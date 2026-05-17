import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MADZ Network",
    short_name: "MADZ",
    description: "MADZ Network social platform for home, login, chat, profile, and settings.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1016",
    theme_color: "#0f1016",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
