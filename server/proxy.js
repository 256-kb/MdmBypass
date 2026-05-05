const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/proxy', createProxyMiddleware({
  changeOrigin: true,
  router: (req) => req.query.url, // mieux que target dynamique ici
  pathRewrite: {
    '^/proxy': ''
  },
  onError(err, req, res) {
    res.status(500).send('Proxy error');
  }
}));

app.get("/", (req, res) => res.send("server online"));
app.get("/health", (req, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("running"));