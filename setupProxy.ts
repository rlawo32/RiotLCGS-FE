const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app:any) => {
    app.use(
        "/api",
        createProxyMiddleware({
            // target: "https://port-0-dudu-project-be-ghdys32blrwuqh24.sel5.cloudtype.app",
            target: "http://localhost:8080",
            changeOrigin: true
        })
    );
};