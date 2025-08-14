// Simple in-memory store for prototipagem
// Trocar por Redis / DB em produção

const sessions = {}; // keyed by phone (whatsapp:+55...)
const submissions = [];

module.exports = {
  sessions,
  submissions,
  getSession: (from) => sessions[from],
  createSession: (from) => { sessions[from] = { state: 'menu', draft: {} }; return sessions[from]; },
  resetSession: (from) => { sessions[from] = { state: 'menu', draft: {} }; },
  saveSubmission: (obj) => { submissions.push(obj); return obj; },
  listSubmissions: () => submissions
}