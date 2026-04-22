import type { NextConfig } from "next";
import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
  register: process.env.NODE_ENV !== "development",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // `next-pwa` still hooks into webpack, so keep an explicit turbopack block
  // to avoid Next 16 treating this config as accidental.
  turbopack: {},
};

export default withPWA(nextConfig);
