import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex flex-col items-center justify-center p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Welcome to <span className="text-sky-400">MemoryBuddy</span>
        </h1>
        <p className="text-2xl text-slate-300 max-w-2xl mx-auto">
          Your friendly assistant for capturing thoughts, ideas, and memories, effortlessly.
        </p>
      </header>

      <main className="flex flex-col md:flex-row gap-8 items-center justify-center mb-16">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-4 text-sky-300">Capture Instantly</h2>
          <p className="text-slate-400 leading-relaxed">
            Jot down notes quickly with our intuitive interface. Whether it's a fleeting idea or a detailed plan, MemoryBuddy is ready.
          </p>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-4 text-sky-300">Organize Seamlessly</h2>
          <p className="text-slate-400 leading-relaxed">
            Keep your notes tidy with tags, categories, and smart search. Find what you need, when you need it.
          </p>
        </div>
      </main>

      <div className="text-center mb-12">
        <Link
          href="/notes"
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>

      <section className="w-full max-w-4xl text-center mb-16">
        <h2 className="text-4xl font-semibold mb-8 text-sky-400">Why Choose MemoryBuddy?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <h3 className="text-2xl font-medium mb-2 text-sky-300">User-Friendly</h3>
            <p className="text-slate-400">Simple, clean, and intuitive design.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <h3 className="text-2xl font-medium mb-2 text-sky-300">Cross-Platform</h3>
            <p className="text-slate-400">Access your notes anywhere, on any device.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg">
            <h3 className="text-2xl font-medium mb-2 text-sky-300">Secure & Private</h3>
            <p className="text-slate-400">Your thoughts are safe with us.</p>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-4xl text-center border-t border-slate-700 pt-8">
        <p className="text-slate-500">
          &copy; {new Date().getFullYear()} MemoryBuddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 