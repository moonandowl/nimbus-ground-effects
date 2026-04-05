const SCRUNCH_URL = "https://webhooks.scrunchai.com/v1/sites/01KNF3F7K432W9DVWE6KH8PGJ0/platforms/custom/web-traffic";
const SCRUNCH_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlX2lkIjoiMDFLTkYzRjdLNDMyVzlEVldFNktIOFBHSjAiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3NzU0MDIxOTYuOTczNjQyLCJkb21haW4iOiJodHRwczovL25pbWJ1c2dyb3VuZGVmZmVjdHMuY29tIn0.xot2nxKKenV2DRq8a0JrO2f-cXsUeFz9DjbFHY0JI8U";

export async function onRequest(context) {
  const { request } = context;
  const start = Date.now();
  const response = await context.next();
  const elapsed = Date.now() - start;

  const url = new URL(request.url);
  const payload = JSON.stringify({
    domain: "nimbusgroundeffects.com",
    user_agent: request.headers.get("user-agent") || "",
    url: request.url,
    path: url.pathname,
    method: request.method,
    status_code: response.status,
    timestamp: Math.floor(Date.now() / 1000),
    response_time: elapsed,
    ip: request.headers.get("cf-connecting-ip") || ""
  });

  context.waitUntil(
    fetch(SCRUNCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": SCRUNCH_API_KEY
      },
      body: payload
    }).catch(() => {})
  );

  return response;
}
