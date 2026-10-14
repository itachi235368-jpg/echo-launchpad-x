import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    environments: {
      nitro: {
        resolve: {
          // Solana SDKs and their dependencies (like @solana/codecs and rpc-websockets)
          // lack 'workerd' exports. By adding 'browser' to the nitro environment's
          // resolve conditions, we allow these packages to resolve to their browser
          // builds even during the Cloudflare Worker build.
          conditions: ["browser", "module", "import", "default"],
        },
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
