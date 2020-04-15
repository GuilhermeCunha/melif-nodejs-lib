var M = require('melif')

const Melif = new M({
    api_root_url: 'https://api.mercadolibre.com',
    skd_version: '0.0.13',
    auth_url: 'https://auth.mercadolibre.com/authorization',
    oauth_url: 'https://api.mercadolibre.com/oauth/token',
    client_id: 'your mercado libre client_id',
    client_secret: 'your mercado libre client_secret',
});

module.exports = Melif;