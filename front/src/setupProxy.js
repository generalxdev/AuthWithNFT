const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://170.130.55.57:5000',
            changeOrigin: true,
        })
    );
};