const { listSubmissions } = require('../storage/memoryStore');
const { Parser } = require('json2csv');

function exportJSON() {
  return listSubmissions();
}

function exportCSV() {
  const data = listSubmissions();
  const fields = ['protocol','name','description','address','createdAt','from'];
  const parser = new Parser({ fields });
  return parser.parse(data);
}

module.exports = { exportJSON, exportCSV };