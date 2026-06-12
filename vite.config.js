import { defineConfig } from 'vite'

export default defineConfig({
  base: '/wubb-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.mp3', '**/*.ogg']
})