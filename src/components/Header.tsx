import Link from 'next/link';

export default function Header() {
  return (
    <header className="wrap py-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Home
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/contact" className="text-slate-300 hover:text-white">Contact</Link>
          <Link href="/knowledge" className="text-slate-300 hover:text-white">Knowledge</Link>
        </div>
      </nav>
    </header>
  );
}
