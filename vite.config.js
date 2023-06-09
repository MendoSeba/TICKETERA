module.exports = {
 
  server: {
    port: 5173
  },

  
  root: './src',

  
  build: {
    outDir: './dist'
  }
}
export default {
  // ...
  build: {
    rollupOptions: {
      input: 'index.jsx',
    },
  },
};
module.exports = {
  build: {
    input: 'src/main.js'
  }
}
module.exports = {
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
}