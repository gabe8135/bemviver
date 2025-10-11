export default function DataDeletionPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-slate">
      <h1>Exclusão de Dados — BemViver</h1>
      <p>Última atualização: {new Date().toISOString().slice(0, 10)}</p>

      <h2>Como solicitar exclusão</h2>
      <p>
        Para solicitar a exclusão dos seus dados pessoais, envie um e-mail para
        <strong> ramos.analista@gmail.com</strong> com o assunto: "Exclusão de Dados — BemViver".
      </p>
      <p>
        Inclua no corpo do e-mail as seguintes informações para identificação:
      </p>
      <ul>
        <li>Nome completo</li>
        <li>Número de telefone utilizado nos agendamentos</li>
        <li>Descrição sucinta dos dados que deseja excluir</li>
      </ul>

      <h2>Prazos e escopo</h2>
      <p>
        Vamos confirmar o recebimento da sua solicitação e concluí-la em até 30 dias, salvo
        obrigações legais de retenção. Dados essenciais para cumprimento de obrigações legais
        poderão ser mantidos pelo prazo exigido.
      </p>

      <h2>Contato alternativo</h2>
      <p>
        Em caso de dúvidas, também podemos orientar pelo WhatsApp informado no site.
      </p>
    </main>
  );
}
