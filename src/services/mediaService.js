const axios = require('axios');
// Por enquanto apenas registra URLs e metadados. Em produção, baixe e armazene no S3.

async function fetchMedia(mediaUrl, auth) {
  // Se quiser baixar, faça o GET com auth basic (Twilio)
  // Neste template, retornamos apenas o URL e indicação de que deve ser baixado
  return { url: mediaUrl, downloaded: false };
}

module.exports = { fetchMedia };