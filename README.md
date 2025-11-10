Seymour Test AI Analyzer — Backend Proxy Setup

Why this is needed
------------------
This frontend demo must not embed a private Google API key in client-side JavaScript. Browsers are public: keys pasted into HTML or JS will be stolen and abused. Instead, host a small backend "proxy" that holds your secret key in an environment variable and forwards requests from the browser to Google's API.

What I added
------------
- Frontend changes in `index.html` to call a backend proxy instead of Google directly.
- `api/generate.js`: Example serverless function for Vercel/Netlify that reads `GOOGLE_API_KEY` from env and forwards requests.

How to deploy (quick start)
---------------------------
1. Create a project on Vercel (recommended for simplicity) or Netlify/Cloud Functions.
2. Add this repo or these files to the project.
3. In your deployment settings, add an environment variable named `GOOGLE_API_KEY` and paste your Google API key there.
   - DO NOT put your API key in `index.html`.
4. Deploy.

How to configure the frontend
-----------------------------
After you deploy your backend, you need to tell the frontend where to find it.

Option A — Quick (edit `index.html`):
Add a small inline script before the main script block and set `window.BACKEND_URL`:

<script>
  // Replace with your deployed backend base URL (no trailing slash preferred)
  window.BACKEND_URL = 'https://your-deployment.example.com';
</script>

Option B — Serve your own copy with the URL already injected by your host.

What the backend expects
------------------------
POST JSON to `${BACKEND_URL}/api/generate` with body:
{
  "systemPrompt": "...",
  "userQuery": "...",
  "schema": { ... }
}

The example proxy will forward this to the Google generative language API using the `GOOGLE_API_KEY` env var and return the provider response to the client.

Security notes
--------------
- Keep `GOOGLE_API_KEY` secret in your hosting provider's environment settings.
- For production, restrict the key to specific APIs and enforce usage limits in Google Cloud.
- Consider adding authentication to your backend if you don't want the endpoint publicly callable by anyone with your site URL.
- Do NOT place the key in client-side files or public repos.

Local testing
-------------
- You can test locally with Vercel CLI (`vercel dev`) or similar. Make sure to set the `GOOGLE_API_KEY` in your local environment before running.

Support
-------
If you'd like, I can:
- Add a Netlify function variant.
- Add minimal server (Express) for local development.
- Add example instructions to lock down CORS to your site domain.

Happy to continue and wire whichever hosting target you prefer.
