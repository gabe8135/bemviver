export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-slate">
      <h1>Política de Privacidade — BemViver</h1>
      <p>Última atualização: {new Date().toISOString().slice(0, 10)}</p>

      <h2>Quem somos</h2>
      <p>
        Este site pertence à BemViver ("nós"). Utilizamos este site para
        divulgação de serviços e para facilitar o agendamento online.
      </p>

      <h2>Dados coletados</h2>
      <ul>
        <li>Dados de contato fornecidos por você (nome, telefone, e serviço escolhido).</li>
        <li>Mensagens trocadas via WhatsApp Cloud API (metadados de entrega).</li>
        <li>Dados de navegação essenciais para funcionamento do site (logs e métricas).</li>
      </ul>

      <h2>Como usamos os dados</h2>
      <ul>
        <li>Agendar e confirmar atendimentos.</li>
        <li>Enviar notificações sobre seu agendamento (por exemplo, confirmação via WhatsApp).</li>
        <li>Melhorar disponibilidade e experiência do site.</li>
      </ul>

      <h2>Compartilhamento</h2>
      <p>
        Não vendemos seus dados. Podemos compartilhar com provedores de infraestrutura
        (por exemplo, hospedagem e banco de dados) estritamente para operação do serviço.
      </p>

      <h2>Retenção e segurança</h2>
      <p>
        Mantemos os dados pelo tempo necessário para execução dos serviços contratados e conforme
        obrigações legais. Aplicamos medidas razoáveis de segurança para proteger suas informações.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção ou exclusão dos seus dados. Veja instruções em
        <a href="/legal/data-deletion">/legal/data-deletion</a>.
      </p>

      <h2>Contato</h2>
      <p>
        Para questões de privacidade, entre em contato pelo e-mail: ramos.analista@gmail.com
      </p>
    </main>
  );
}
