const { getSession, createSession, resetSession, saveSubmission } = require('../storage/memoryStore');
const { v4: uuidv4 } = require('uuid');
const { refineDescription } = require('./openaiService');

function gerarProtocolo() {
  const ts = Date.now();
  return `PR-${ts}-${Math.floor(Math.random()*9000)+1000}`;
}

async function handleIncoming(from, incoming) {
  // incoming: { body, numMedia, media: [{url,contentType}], latitude, longitude }
  let session = getSession(from) || createSession(from);
  const text = (incoming.body || '').trim();

  // localização recebida
  if (incoming.latitude && incoming.longitude) {
    session.draft.location = { lat: incoming.latitude, lon: incoming.longitude };
    session.state = 'awaiting_confirmation';
    return { reply: `Recebi sua localização (${incoming.latitude}, ${incoming.longitude}). Deseja confirmar envio? (sim/não)` };
  }

  // mídia recebida
  if (incoming.numMedia && incoming.numMedia > 0 && incoming.media && incoming.media.length>0) {
    session.draft.media = session.draft.media || [];
    session.draft.media.push(...incoming.media);
    session.state = 'awaiting_confirmation';
    return { reply: `Recebi ${incoming.media.length} arquivo(s). Deseja confirmar envio? (sim/não)` };
  }

  // fluxo por estado
  switch (session.state) {
    case 'menu': {
      const lower = text.toLowerCase();
      if (lower.startsWith('1') || lower.includes('abrir')) { session.state = 'ask_name'; return { reply: 'Ótimo — vamos abrir a solicitação. Qual o seu NOME completo?' } }
      if (lower.startsWith('2') || lower.includes('consult')) { session.state = 'consult'; return { reply: 'Informe o número do protocolo ou CPF para consulta:' } }
      if (lower.startsWith('3') || lower.includes('info')) { return { reply: 'Informações Gerais: Este é um serviço de exemplo. Para abrir solicitação responda 1.' } }
      return { reply: `Bem-vindo! Escolha:
1 - Abrir Solicitação
2 - Consultar Status
3 - Informações Gerais
Responda 1, 2 ou 3.` };
    }

    case 'ask_name':
      session.draft.name = text; session.state = 'ask_desc'; return { reply: 'Descreva o problema (detalhe o máximo possível):' };
    case 'ask_desc':
      session.draft.description = text; session.state = 'ask_address'; return { reply: 'Informe o endereço ou ponto de referência (ou envie localização):' };
    case 'ask_address':
      session.draft.address = text; session.state = 'ask_media_or_location'; return { reply: 'Se desejar, envie foto(s) ou localização agora. Caso contrário, responda "pular".' };
    case 'ask_media_or_location':
      if (text.toLowerCase().startsWith('pular')) { session.state = 'awaiting_confirmation';
        return { reply: `Confirme envio?\nNome: ${session.draft.name}\nEnd: ${session.draft.address}\nDescrição: ${session.draft.description}\nResponda 'sim' para confirmar.` } }
      return { reply: 'Aguardando mídia ou localização. Envie foto(s) ou localização, ou responda "pular" para continuar.' };
    case 'awaiting_confirmation':
      if (text.toLowerCase().startsWith('s')) {
        // optional: refine via OpenAI
        try {
          const refined = await refineDescription(session.draft.description || '');
          if (refined.success) session.draft.description_refined = refined.result;
        } catch(e){}

        const protocolo = gerarProtocolo();
        const submission = { protocol: protocolo, ...session.draft, createdAt: new Date().toISOString(), from };
        saveSubmission(submission);
        resetSession(from);
        return { reply: `Solicitação recebida! Protocolo: ${protocolo}. Obrigado.` };
      }
      resetSession(from);
      return { reply: 'Envio cancelado. Retornando ao menu principal.' };

    case 'consult': {
      const key = text;
      // Simulação: procura protocolo ou cpf (campo 'from' ou 'protocol')
      const subs = require('../storage/memoryStore').submissions;
      const found = subs.find(s => s.protocol === key || s.cpf === key);
      if (found) {
        resetSession(from);
        return { reply: `Protocolo ${found.protocol}\nStatus: Em processamento\nResumo: ${found.description?.slice(0,120)}` };
      } else {
        resetSession(from);
        return { reply: `Nada encontrado para: ${key}. Verifique o número do protocolo ou CPF.` };
      }
    }

    default:
      resetSession(from);
      return { reply: 'Sessão reiniciada. Escolha 1-Abrir 2-Consultar 3-Info.' };
  }
}

module.exports = { handleIncoming };