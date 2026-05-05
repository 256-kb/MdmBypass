const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// Configuration CORS
app.use(cors({
    origin: ['https://[ton-username].github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Route principale du proxy
app.use('/proxy', createProxyMiddleware({
    target: (req) => req.query.url,
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        // Ajouter les en-têtes nécessaires
        proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error occurred');
    }
}));

// Route pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.status(200).send('Proxy server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});