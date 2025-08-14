const twilio = require('twilio');
const { handleIncoming } = require('../services/flowManager');
const { fetchMedia } = require('../services/mediaService');

// Recebe requisições do Twilio (form-url-encoded)

async function webhook(req, res) {
  const from = req.body.From; // ex: 'whatsapp:+5511...'
  const body = req.body.Body || '';
  const numMedia = parseInt(req.body.NumMedia || '0',10);
  const latitude = req.body.Latitude || null;
  const longitude = req.body.Longitude || null;

  // montar objeto de input para flow manager
  const incoming = { body, numMedia, latitude, longitude };

  if (numMedia>0) {
    incoming.media = [];
    for (let i=0;i<numMedia;i++) {
      const url = req.body[`MediaUrl${i}`];
      const contentType = req.body[`MediaContentType${i}`];
      // opcional: baixar com fetchMedia(url)
      incoming.media.push({ url, contentType });
    }
  }

  const out = await handleIncoming(from, incoming);

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(out.reply);
  res.set('Content-Type','text/xml');
  return res.send(twiml.toString());
}

module.exports = { webhook };