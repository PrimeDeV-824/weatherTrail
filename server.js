// Lightweight HTTP Server for WeatherTrail
// Serves static assets, health checks, and optional server-side AI proxy.

const PORT = Number(Deno.env.get("PORT") || 3000);
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

async function handleRequest(req) {
  const url = new URL(req.url);

  // Health check
  if (url.pathname === "/api/health") {
    return new Response(JSON.stringify({ status: "ok", app: "WeatherTrail", timestamp: Date.now() }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // Server-side AI Proxy
  if (url.pathname === "/api/ai-chat" && req.method === "POST") {
    try {
      const body = await req.json();
      const prompt = body.prompt;
      const clientKey = body.apiKey;

      const activeGeminiKey = clientKey || GEMINI_API_KEY;
      const activeOpenAIKey = OPENAI_API_KEY;

      if (!activeGeminiKey && !activeOpenAIKey) {
        return new Response(
          JSON.stringify({
            result: null,
            configured: false,
            message: "No AI API key configured on server or client. Truthfully using deterministic rule engine."
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // If Gemini Key is present
      if (activeGeminiKey) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
          activeGeminiKey
        )}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.2 }
          })
        });

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          console.warn("Gemini API error:", errText);
          return new Response(
            JSON.stringify({ result: null, configured: true, error: "AI provider request failed." }),
            { headers: { "Content-Type": "application/json" } }
          );
        }

        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        return new Response(JSON.stringify({ result: text, configured: true }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      // If OpenAI Key is present
      if (activeOpenAIKey) {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeOpenAIKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 500
          })
        });

        if (!openaiRes.ok) {
          return new Response(JSON.stringify({ result: null, configured: true, error: "OpenAI error" }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        const data = await openaiRes.json();
        const text = data.choices?.[0]?.message?.content || null;
        return new Response(JSON.stringify({ result: text, configured: true }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      console.error("AI proxy handler error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Static file serving
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  // Prevent directory traversal
  filePath = "." + filePath.replace(/\.\./g, "");

  try {
    const file = await Deno.readFile(filePath);
    const ext = filePath.slice(filePath.lastIndexOf("."));
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    return new Response(file, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

console.log(`WeatherTrail server starting on http://localhost:${PORT}`);
Deno.serve({ port: PORT }, handleRequest);
