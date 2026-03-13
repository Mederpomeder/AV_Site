

export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://172.20.10.3:5000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}