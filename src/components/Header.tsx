export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="container h-14 flex items-center justify-between">
        <a href="#top" className="font-semibold text-gray-900">BemViver</a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#beneficios" className="hover:underline">Benefícios</a>
          <a href="#agendar" className="btn-primary">Agendar</a>
        </nav>
      </div>
    </header>
  );
}
