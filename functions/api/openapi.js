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
  const debug = {};

  // #region agent log
  debug.entered = true;
  debug.baseUrl = baseUrl;
  // #endregion

  try {
    const fetchUrl = `${baseUrl}/openapi.yaml`;
    const response = await fetch(fetchUrl);

    // #region agent log
    debug.fetchStatus = response.status;
    debug.fetchOk = response.ok;
    debug.fetchContentType = response.headers.get('content-type');
    // #endregion

    if (!response.ok) {
      // #region agent log
      debug.branch = 'not-ok';
      // #endregion

      return new Response('OpenAPI specification not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain', 'X-Debug': JSON.stringify(debug) }
      });
    }
    const text = await response.text();

    // #region agent log
    debug.branch = 'success';
    debug.bodyLen = text.length;
    // #endregion

    return new Response(text, {
      headers: {
        'Content-Type': 'application/yaml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'X-Debug': JSON.stringify(debug)
      }
    });
  } catch (err) {
    // #region agent log
    debug.branch = 'catch';
    debug.error = err.message;
    // #endregion

    return new Response(`Error: ${err.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain', 'X-Debug': JSON.stringify(debug) }
    });
  }
}
