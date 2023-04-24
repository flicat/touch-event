const path = require('path')
const { build } = require('vite')

build({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'TouchEvent',
      formats: ['es', 'umd'],
      fileName: 'index'
    },
    outDir: 'lib',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
