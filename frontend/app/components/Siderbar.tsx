export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white/60 backdrop-blur-xl border-r border-gray-200 shadow-xl p-6 flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight">
        AI Tutor
      </h1>

      <nav className="flex flex-col gap-5 text-gray-700 text-lg">
        <a href="/" className="hover:text-black transition">🏠 Home</a>
        <a href="/upload" className="hover:text-black transition">📄 Upload Notes</a>
        <a href="/quiz" className="hover:text-black transition">📝 Generate Quiz</a>
        <a className="hover:text-black transition">👤 Profile</a>
      </nav>
    </div>
  );
}
