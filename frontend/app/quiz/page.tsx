"use client";

import { useState } from "react";
import axios from "axios";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  async function generateQuiz() {
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz([]);
    setScore(null);
    setAnswers({});

    try {
      const res = await axios.post("http://127.0.0.1:8001/api/quiz", { topic });
      if (res.data.quiz && Array.isArray(res.data.quiz)) {
        setQuiz(res.data.quiz);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleOptionSelect(qIndex: number, option: string) {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  }

  function submitQuiz() {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      }
    });
    setScore(correct);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          CHATBOT
        </div>
        <div className="hidden md:flex items-center space-x-8 text-gray-400 text-sm font-medium tracking-wide">
          <a href="/" className="hover:text-cyan-400 transition-colors duration-300">Home</a>
          <a href="/upload" className="hover:text-cyan-400 transition-colors duration-300">Upload</a>
          <a href="/quiz" className="text-cyan-400 transition-colors duration-300">Quiz</a>
          <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Profile</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-100px)] px-4 py-10">

        <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-500/10 shadow-[0_0_60px_rgba(0,200,255,0.15)]">
          <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-400">
            AI Knowledge Quiz
          </h1>

          <div className="flex space-x-4 mb-8">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., Quantum Computing)"
              className="flex-1 bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              onClick={generateQuiz}
              disabled={loading}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Start Quiz"}
            </button>
          </div>

          {quiz.length > 0 && (
            <div className="space-y-8">
              {quiz.map((q, i) => (
                <div key={i} className="p-6 bg-black/20 rounded-2xl border border-cyan-500/10">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-100">{i + 1}. {q.question}</h3>
                  <div className="space-y-3">
                    {q.options.map((opt: string, optIndex: number) => (
                      <button
                        key={optIndex}
                        onClick={() => handleOptionSelect(i, opt)}
                        disabled={score !== null}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200
                          ${answers[i] === opt
                            ? "bg-cyan-900/40 border-cyan-400 text-cyan-100"
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          }
                          ${score !== null && opt === q.answer ? "bg-green-900/40 border-green-500 text-green-100" : ""}
                          ${score !== null && answers[i] === opt && opt !== q.answer ? "bg-red-900/40 border-red-500 text-red-100" : ""}
                        `}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {!score && Object.keys(answers).length === quiz.length && (
                <button
                  onClick={submitQuiz}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
                >
                  Submit Answers
                </button>
              )}

              {score !== null && (
                <div className="text-center p-6 bg-cyan-900/20 rounded-2xl border border-cyan-500/30">
                  <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
                  <p className="text-xl text-cyan-300">Your Score: {score} / {quiz.length}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
