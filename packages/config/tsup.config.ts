import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  shims: true,
  dts: true,
  tsconfig: 'tsconfig.build.json',
  treeshake: true,
  clean: true,
  minify: false,
  platform: 'node',
  outDir: 'build',
})
