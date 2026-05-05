document.getElementById('goBtn').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('content');
    
    if (!url) return;
    
    // Réinitialiser l'affichage
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    content.innerHTML = '';
    
    // URL de ton proxy déployé sur Vercel
    const proxyUrl = 'https://[ton-vercel-app].vercel.app/proxy?url=' + encodeURIComponent(url);
    
    // Utiliser fetch avec les en-têtes appropriés
    fetch(proxyUrl, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        loading.classList.add('hidden');
        
        // Créer un iframe sandbox pour afficher le contenu
        const iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms';
        iframe.style.width = '100%';
        iframe.style.height = '80vh';
        iframe.style.border = 'none';
        
        // Injecter le HTML dans l'iframe
        content.appendChild(iframe);
        iframe.contentDocument.open();
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
    })
    .catch(err => {
        loading.classList.add('hidden');
        error.textContent = `Erreur: ${err.message}`;
        error.classList.remove('hidden');
        console.error('Proxy error:', err);
    });
});

// Permettre l'appui sur la touche Entrée
document.getElementById('url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('goBtn').click();
    }
});