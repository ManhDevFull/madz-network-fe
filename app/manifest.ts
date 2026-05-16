import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Thread Clone",
    short_name: "Thread",
    description: "Dark social app UI for home, login, chat, profile, and settings.",
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
