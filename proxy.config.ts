export default {
  '/z': {
    target: 'http://localhost:9999',
    changeOrigin: true,
    cookieDomainRewrite: {
      '*': '',
    },
  },
}
