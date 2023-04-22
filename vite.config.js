module.exports = {
    // Puerto en el que se ejecutará el servidor de desarrollo
    server: {
      port: 3000
    },
  
    // Directorio base de la aplicación
    root: './src',
  
    // Directorio de construcción de la aplicación
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
  