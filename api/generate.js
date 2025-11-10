// Vercel / Netlify-compatible serverless function
// Deploy this file under `api/generate.js` (Vercel) or equivalent path for your platform.
// It expects an environment variable named `GOOGLE_API_KEY` containing your secret key.

export default async function handler(req, res) {
  // Allow CORS for simple demos. For production, restrict origins.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: 'Server misconfigured: GOOGLE_API_KEY is not set' } });
    return;
  }

  try {
    const body = req.body || {};
    const { systemPrompt, userQuery, schema, generationConfig } = body;

    // Build the payload in the format the generative language API expects.
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: Object.assign({ responseMimeType: 'application/json', responseSchema: schema, temperature: 0.3 }, generationConfig || {})
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const fetchRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await fetchRes.json();

    // Mirror status codes for easier debugging
    if (!fetchRes.ok) {
      res.status(fetchRes.status).json(data);
      return;
    }

    // Return the Google response directly to the frontend (the frontend still parses candidates)
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: { message: err.message || 'Internal server error' } });
  }
}
