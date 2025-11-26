"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    // Clear input immediately
    const currentInput = input;
    setInput("");

    try {
      const res = await axios.post("http://127.0.0.1:8001/api/chat", {
        query: currentInput,
      });

      const aiMsg = { role: "ai", content: res.data.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add error message to chat
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          CHATBOT
        </div>
        <div className="hidden md:flex items-center space-x-8 text-gray-400 text-sm font-medium tracking-wide">
          <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Home</a>
          <a href="/upload" className="hover:text-cyan-400 transition-colors duration-300">Upload</a>
          <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Quiz</a>
          <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Profile</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">

        {/* Avatar Section */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8 animate-pulse-slow">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[60px]" />
          <Image
            src="/avatar.png"
            alt="AI Avatar"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
            priority
          />
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-2xl">

          {/* Messages Area */}
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto px-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] px-6 py-3 rounded-2xl text-base backdrop-blur-md border
                    ${msg.role === "user"
                      ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "bg-slate-900/60 border-slate-700/50 text-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-30 group-hover:opacity-50 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl rounded-full border border-slate-800 p-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 px-6 py-3 outline-none rounded-full"
              />
              <button
                onClick={sendMessage}
                className="
                  px-8 py-3 
                  bg-gradient-to-r from-cyan-600 to-blue-600 
                  hover:from-cyan-500 hover:to-blue-500
                  text-white font-medium tracking-wide
                  rounded-full 
                  transition-all duration-300
                  shadow-[0_0_20px_rgba(6,182,212,0.4)]
                  hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                "
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
