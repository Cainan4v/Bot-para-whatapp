# WhatsApp Bot com Twilio API (Node.js)

## Como rodar localmente

1. Instale as dependências:
```bash
npm install
```

2. Rode o servidor:
```bash
npm start
```

3. Configure o Twilio Sandbox para apontar para o endpoint público gerado pelo ngrok:
```
https://SEU_NGROK_URL/webhook
```






```markdown
# WhatsApp Twilio Bot - Node.js (Example)

Template minimal para chatbot WhatsApp com Twilio (Sandbox).

## Requisitos
- Node.js 18+
- Conta Twilio (usar Sandbox inicialmente)
- ngrok (para expor local durante testes)

## Como rodar localmente
1. clone o repositório
2. copie `.env.example` para `.env` e preencha as variáveis (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM)
3. `npm install`
4. `npm run dev` (ou `npm start`)
5. exponha com ngrok: `ngrok http 3000`
6. no Twilio Console > Messaging > WhatsApp Sandbox, coloque o URL do webhook: `https://<seu-ngrok>/webhook/whatsapp` (POST)
7. no WhatsApp, conecte-se ao sandbox seguindo as instruções do Twilio (envie o código para o número sandbox)

## Testes
- Envie mensagens simples: `1` para abrir solicitação
- Siga o fluxo de perguntas
- Envie imagens (anexo) e localização (ícone de anexar → localização)
- Acesse `/export/json` e `/export/csv` para baixar as submissões

## Observações e próximos passos
- Armazenamento em memória — trocar por Redis e banco relacional para produção
- Implementar download de mídia (MediaUrl expira) e armazenar em S3
- Para botões e templates, crie Content Templates na Twilio Console (necessário aprovação)
- Para usar número oficial Meta (WABA) siga o onboarding Twilio / Meta Business Manager
- Integrar OpenAI apenas como apoio e com controle de custos

## Segurança
- Criptografar dados sensíveis em produção (CPF, endereço)
- LGPD: registre base legal e permita exclusão de dados
```
