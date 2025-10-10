# BemViver — Landing de Agendamentos

Landing page em Next.js com formulário inteligente, API para criar agendamentos no Supabase e integrações opcionais via Webhook e WhatsApp.

## Funcionalidades

- Landing moderna (Tailwind) com formulário: nome, WhatsApp, serviço, data, horário e observações
- API: POST /api/appointments (validação Zod, salva no Supabase quando configurado)
- Integrações: Webhook genérico e mensagem no WhatsApp (opcionais)
- Painel admin básico em /admin (Basic Auth via middleware)

## Variáveis de ambiente (.env.local)

Veja `.env.example` e copie para `.env.local`.

## Supabase — SQL de tabela

Veja `supabase.sql` e execute no SQL Editor do seu projeto Supabase.

## Desenvolvimento

1. Instale dependências
2. Rode o servidor de desenvolvimento
3. Acesse http://localhost:3000

## Deploy

Recomendado Vercel. Configure as mesmas variáveis de ambiente.

---

Feito para demonstrar automação de atendimento para clínicas (ex.: Clínica BemViver).
