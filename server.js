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

// High-performance in-memory cache for AI responses
const aiCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

async function fetchWithTimeout(url, options = {}, timeoutMs = 1200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

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
      const rawPrompt = (body.prompt || "").trim();
      const clientKey = body.apiKey;

      if (!rawPrompt) {
        return new Response(JSON.stringify({ result: null, error: "Empty prompt" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 1. Check in-memory cache for instant <1ms response
      const cacheKey = rawPrompt.toLowerCase();
      const cached = aiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return new Response(
          JSON.stringify({
            result: cached.result,
            configured: true,
            provider: cached.provider + " (Instant Cache)",
            cached: true
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // Instruct AI to write naturally like a human guide, avoiding raw pipe tables
      const prompt = rawPrompt.includes("FORMATTING")
        ? rawPrompt
        : `${rawPrompt}\n\nIMPORTANT FORMATTING INSTRUCTIONS: Write cleanly and naturally like an experienced, friendly local travel guide. Use clear section headers and bullet points with emojis. Never output raw markdown pipe tables (|---|) or raw HTML tags. Be concise, engaging, and directly useful.`;

      const activeGeminiKey = clientKey || GEMINI_API_KEY;
      const activeOpenAIKey = OPENAI_API_KEY;

      // 2. Try Gemini with fast fallback models and strict timeout
      if (activeGeminiKey) {
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemma-4-26b-a4b-it"];
        for (const model of candidateModels) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
              activeGeminiKey
            )}`;

            const geminiRes = await fetchWithTimeout(
              geminiUrl,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { maxOutputTokens: 500, temperature: 0.3 }
                })
              },
              1200
            );

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              let text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
              if (text) {
                // Strip model thinking traces if any
                text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
                aiCache.set(cacheKey, { result: text, provider: "Gemini AI", timestamp: Date.now() });
                return new Response(
                  JSON.stringify({ result: text, configured: true, provider: "Gemini AI" }),
                  { headers: { "Content-Type": "application/json" } }
                );
              }
            }
          } catch (gemErr) {
            console.warn(`Gemini model ${model} attempt notice:`, gemErr.name === "AbortError" ? "timed out" : gemErr.message);
          }
        }
      }

      // 3. Try OpenAI if configured
      if (activeOpenAIKey) {
        try {
          const openaiRes = await fetchWithTimeout(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeOpenAIKey}`
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                max_tokens: 600
              })
            },
            2500
          );

          if (openaiRes.ok) {
            const data = await openaiRes.json();
            const text = data.choices?.[0]?.message?.content || null;
            if (text) {
              aiCache.set(cacheKey, { result: text, provider: "OpenAI GPT", timestamp: Date.now() });
              return new Response(
                JSON.stringify({ result: text, configured: true, provider: "OpenAI GPT" }),
                { headers: { "Content-Type": "application/json" } }
              );
            }
          }
        } catch (oaiErr) {
          console.warn("OpenAI attempt notice:", oaiErr.message);
        }
      }

      // 4. Free Cloud AI Engine fallback (fast 2.8s timeout)
      try {
        const freeAiUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
        const freeRes = await fetchWithTimeout(
          freeAiUrl,
          {
            headers: { "User-Agent": "WeatherTrail/1.0" }
          },
          2800
        );

        if (freeRes.ok) {
          const aiText = await freeRes.text();
          if (aiText && aiText.trim().length > 0 && !aiText.includes('"error":')) {
            const cleanText = aiText.trim();
            aiCache.set(cacheKey, { result: cleanText, provider: "WeatherTrail Smart AI", timestamp: Date.now() });
            return new Response(
              JSON.stringify({
                result: cleanText,
                configured: true,
                provider: "WeatherTrail Smart AI"
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }
        }
      } catch (freeErr) {
        console.warn("Free cloud AI notice:", freeErr.name === "AbortError" ? "timed out" : freeErr.message);
      }

      // 5. If all cloud calls failed or timed out, inform client immediately to use local smart responder
      return new Response(
        JSON.stringify({
          result: null,
          configured: false,
          fallbackRequired: true,
          message: "Cloud AI services unreachable or busy; local smart responder engaged."
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("AI proxy handler error:", err);
      return new Response(JSON.stringify({ error: err.message, fallbackRequired: true }), {
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
