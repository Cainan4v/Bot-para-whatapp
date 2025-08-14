const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const { webhook } = require('./controllers/whatsappWebhook');
const { exportJSON, exportCSV } = require('./services/exportService');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/webhook/whatsapp', webhook);

app.get('/export/json', (req,res) => {
  res.json(exportJSON());
});

app.get('/export/csv', (req,res) => {
  const csv = exportCSV();
  res.set('Content-Type','text/csv');
  res.attachment('submissions.csv');
  res.send(csv);
});

app.get('/', (req,res) => res.send('WhatsApp Twilio Bot — running'));

app.listen(config.port, () => console.log(`Server listening on ${config.port}`));