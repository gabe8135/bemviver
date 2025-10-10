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
        <p className="text-xs text-gray-500">Landing Page desenvolvida por <a href="https://vempracaapp.com" target="_blank" className="underline hover:text-gray-700">Gabriel Ramos</a></p>
      </div>
    </footer>
  );
}
