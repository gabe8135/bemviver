export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-slate">
      <h1>Termos de Serviço — BemViver</h1>
      <p>Última atualização: {new Date().toISOString().slice(0, 10)}</p>

      <h2>Uso do serviço</h2>
      <p>
        Ao utilizar este site e realizar agendamentos, você concorda com estes termos.
        Poderemos contatar você para confirmar, alterar ou cancelar horários.
      </p>

      <h2>Responsabilidades</h2>
      <ul>
        <li>Você deve fornecer dados verdadeiros e atualizados.</li>
        <li>Compromete-se com os horários agendados ou a informar sobre cancelamentos com antecedência.</li>
      </ul>

      <h2>Comunicações</h2>
      <p>
        Podemos enviar mensagens relacionadas ao seu agendamento via WhatsApp Cloud API.
        Para encerrar comunicações, solicite pelo WhatsApp ou pelo e-mail de contato.
      </p>

      <h2>Limitação de responsabilidade</h2>
      <p>
        O serviço é fornecido "como está". Não nos responsabilizamos por indisponibilidades
        temporárias, falhas de terceiros ou eventos fora do nosso controle.
      </p>

      <h2>Alterações</h2>
      <p>
        Podemos atualizar estes termos. Versões atualizadas ficam publicadas nesta página.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas? Contate: ramos.analista@gmail.com
      </p>
    </main>
  );
}
