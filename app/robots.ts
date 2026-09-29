import type { MetadataRoute } from "next";

// El quadre no s'ha d'indexar als cercadors.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
