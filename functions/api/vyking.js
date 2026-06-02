/**
 * VyKNG Manifest Endpoint
 *
 * GET /api/vyking
 *
 * Returns a JSON manifest of the Nimbus Ground Effects verified knowledge pack.
 * Each dataset entry includes its URL and a SHA-256 hash computed at request time.
 * AI agents can use this manifest as the entry point to the pack data.
 */

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const packFiles = [
    'index.json',
    'procedures.json',
    'credentials.json',
    'constraints.json',
    'policies.json',
    'guarantees.json',
    'workflows.json',
    'changelog.json',
    'manifest.json'
  ];

  // Fetch each pack file and compute its SHA-256 hash
  const datasets = await Promise.all(
    packFiles.map(async (filename) => {
      const fileUrl = `${baseUrl}/vyking-pack/${filename}`;
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          return {
            name: filename.replace('.json', ''),
            url: fileUrl,
            sha256: null,
            error: `Failed to fetch: ${response.status}`
          };
        }
        const text = await response.text();
        const buffer = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(text)
        );
        const hashArray = Array.from(new Uint8Array(buffer));
        const sha256 = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        return {
          name: filename.replace('.json', ''),
          url: fileUrl,
          sha256: sha256
        };
      } catch (err) {
        return {
          name: filename.replace('.json', ''),
          url: fileUrl,
          sha256: null,
          error: err.message
        };
      }
    })
  );

  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + 90);

  const manifest = {
    version: '1.0.0',
    published: now.toISOString(),
    validUntil: validUntil.toISOString(),
    publisher: {
      name: 'Nimbus Ground Effects',
      domain: 'nimbusgroundeffects.com'
    },
    datasets: datasets,
    _meta: {
      endpointVersion: '1.0',
      note: 'Verified knowledge pack for AI agent consumption. Datasets contain operational facts about services, credentials, constraints, policies, guarantees, and workflows. Fetch the URLs above for full content. SHA-256 hashes allow integrity verification.'
    }
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
