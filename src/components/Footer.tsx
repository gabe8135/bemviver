export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="container py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} BemViver. Todos os direitos reservados.</p>
        <nav className="flex items-center gap-4">
          <a href="#beneficios" className="hover:underline">Benefícios</a>
          <a href="#agendar" className="hover:underline">Agendar</a>
          <a href="mailto:contato@bemviver.com" className="hover:underline">Contato</a>
        </nav>
      </div>
    </footer>
  );
}
