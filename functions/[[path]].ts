// Cloudflare Pages Function — SPA Routing
// Sirve index.html para todas las rutas sin extensión de archivo,
// y deja pasar los assets estáticos (JS, CSS, imágenes, etc.)
export async function onRequest(context: {
  request: Request;
  env: { ASSETS: { fetch: (req: Request) => Promise<Response> } };
  next: () => Promise<Response>;
}): Promise<Response> {
  const url = new URL(context.request.url);

  // Dejar pasar assets estáticos y archivos con extensión
  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    return context.next();
  }

  // Para todas las demás rutas (SPA), servir index.html
  return context.env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`, context.request)
  );
}
