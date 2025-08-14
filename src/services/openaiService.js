// Serviço opcional para refinar/formatar textos via OpenAI
// Este arquivo é um stub — somente ativar se tiver a chave e desejar usar

const axios = require('axios');
const config = require('../config');

async function refineDescription(text) {
  if (!config.openai.apiKey) return { success: false, result: text };

  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [ { role: 'user', content: `Resuma e melhore a clareza desta descrição em 2 frases: ${text}` } ],
      max_tokens: 120
    }, { headers: { Authorization: `Bearer ${config.openai.apiKey}` } });

    const out = res.data.choices?.[0]?.message?.content || text;
    return { success: true, result: out };
  } catch (err) {
    return { success: false, result: text, error: err.message };
  }
}

module.exports = { refineDescription };
