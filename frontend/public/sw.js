const CACHE_NAME = "saudememora-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/documents",
  "/perfil",
  "/logo.png",
  "/manifest.json",
];

// Instala o SW e faz cache dos assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativa o novo SW e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First para API, Cache First para assets estáticos
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET e chamadas de API
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/") || url.hostname.includes("localhost:5204")) return;
  if (url.protocol === "chrome-extension:") return;

  // Assets estáticos (_next/static): Cache First
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
        );
      })
    );
    return;
  }

  // Páginas: Network First com fallback para cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match("/dashboard");
        });
      })
  );
});
