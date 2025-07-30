'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your developer assistant. Ask me anything about code, debugging, or best practices!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Error: Unable to get a response.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className={`min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] flex flex-col items-center justify-center px-2 py-6 transition-colors duration-300`}>
            <div className="w-full max-w-2xl bg-white/90 dark:bg-[#18181b]/90 rounded-3xl shadow-2xl flex flex-col h-[80vh] sm:h-[70vh] overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300">
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#2c5364] to-[#0f2027] text-white shadow">
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.1"/>
                    <path d="M10 22v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="13" r="3" stroke="#fff" strokeWidth="2"/>
                  </svg>
                  <span className="font-bold text-lg tracking-wide">Dev ChatBot</span>
                </div>
              </header>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-white/80 via-white/60 to-white/30 dark:from-[#232526]/80 dark:via-[#232526]/60 dark:to-[#232526]/30 custom-scrollbar transition-colors duration-300">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-base whitespace-pre-line
                        ${msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-none'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#232526] dark:to-[#2c5364] text-gray-900 dark:text-gray-100 rounded-bl-none'
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={sendMessage}
                className="flex items-center gap-2 px-4 py-4 bg-white/80 dark:bg-[#18181b]/80 border-t border-gray-200 dark:border-gray-800"
              >
                <input
                  type="text"
                  className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#232526] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Type your question about code…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  autoFocus
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-full font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </form>
            </div>
            <footer className="mt-6 text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} Dev ChatBot by Zain. Powered by Next.js & OpenAI.
            </footer>
      </div>
  );
}