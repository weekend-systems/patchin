import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@patchin/ui", "@patchin/db"],
};

export default nextConfig;
