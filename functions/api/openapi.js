/**
 * OpenAPI Specification Endpoint
 *
 * GET /api/openapi
 *
 * Serves the OpenAPI 3.0 specification for the VyKNG manifest endpoint.
 * AI agent platforms (GPT Actions, Copilot plugins, Vertex AI Extensions)
 * read this spec to understand how to call the API.
 */

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const response = await fetch(`${baseUrl}/openapi.yaml`);
    if (!response.ok) {
      return new Response('OpenAPI specification not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    const text = await response.text();
    return new Response(text, {
      headers: {
        'Content-Type': 'application/yaml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
