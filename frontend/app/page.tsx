"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
      const res = await axios.post(`${apiUrl}/api/chat`, {
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-cyan-500/30 transition-colors duration-300">

      {/* Background Effects */}
      {/* Background Effects - Handled by Scene3D */}

      {/* Navbar */}
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 pb-20">

        {/* Avatar Section */}
        <div className="relative w-full h-[500px] mb-8">
          <Scene3D />
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
                      ? "bg-cyan-100/80 border-cyan-200 text-cyan-900 shadow-[0_4px_20px_rgba(6,182,212,0.2)] dark:bg-cyan-950/60 dark:border-cyan-500/40 dark:text-cyan-50"
                      : "bg-white/90 border-slate-300 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-200"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-40 group-hover:opacity-60 transition duration-500 blur-sm"></div>
            <div className="relative flex items-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-full border border-slate-300 dark:border-slate-700 p-1.5 shadow-xl dark:shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-4 md:px-6 py-3 outline-none rounded-full text-sm md:text-base"
              />
              <button
                onClick={sendMessage}
                className="
                  px-5 md:px-8 py-3 
                  bg-gradient-to-r from-cyan-600 to-blue-600 
                  hover:from-cyan-500 hover:to-blue-500
                  text-white font-semibold tracking-wide
                  rounded-full 
                  transition-all duration-200
                  shadow-[0_4px_0_rgb(6,130,180)]
                  hover:shadow-[0_5px_0_rgb(6,130,180)]
                  hover:-translate-y-0.5
                  active:shadow-[0_0_0_rgb(6,130,180)]
                  active:translate-y-1
                  text-sm md:text-base
                  whitespace-nowrap
                "
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </main >
    </div >
  );
}
