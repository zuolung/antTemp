export default {
  '/z': {
    target: 'http://localhost:6767',
    changeOrigin: true,
    cookieDomainRewrite: {
      '*': '',
    },
  },
}
