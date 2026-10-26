export async function onRequestGet({ env, params }) {
  if (!/^[\w.\-]+$/.test(params.key)) return new Response('Not found', { status: 404 });
  const { value, metadata } = await env.KV.getWithMetadata('img:' + params.key, 'arrayBuffer');
  if (!value) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: { 'Content-Type': (metadata && metadata.type) || 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
}
