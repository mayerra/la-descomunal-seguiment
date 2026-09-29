import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El quadre no s'ha d'indexar als cercadors (també per a /api i fitxers).
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
