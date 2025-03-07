/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.aiscribbles.com",
        port: "",
        pathname: "/1d14b9ba76144261ba3bce1b22b3631a.png/**",
        search: "",
      },
    ],
  },
};

export default config;
