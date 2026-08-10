import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  outDir: ".output",
  target: "node20",
  clean: true,
  sourcemap: true,
  splitting: false,
  dts: false,
  // necessário por causa dos experimentalDecorators
  esbuildOptions(options) {
    options.keepNames = true;
  },
});
