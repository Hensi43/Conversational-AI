"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Auth({ onLogin }: { onLogin: (token: string, username: string) => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: username, // Using username field as email for now, or we should change input type
                    password: password,
                });

                if (error) throw error;
                if (data.session) {
                    onLogin(data.session.access_token, data.user.email || username);
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email: username,
                    password: password,
                    options: {
                        data: {
                            username: username.split("@")[0], // Store part of email as username
                        }
                    }
                });

                if (error) throw error;
                // Auto login logic depends on email confirmation settings
                setIsLogin(true);
                setError("Registration successful! Check your email to confirm.");
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden group">
            {/* Animated Background Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
                    {isLogin ? "SYSTEM ACCESS" : "NEW IDENTITY"}
                </h2>

                {/* Tabs */}
                <div className="flex mb-8 bg-slate-950/50 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isLogin
                            ? "bg-cyan-950/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "text-slate-400 hover:text-cyan-300"
                            }`}
                    >
                        LOGIN
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${!isLogin
                            ? "bg-cyan-950/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                            : "text-slate-400 hover:text-cyan-300"
                            }`}
                    >
                        REGISTER
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-cyan-500/70 mb-2">Email</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300"
                            placeholder="Enter email address..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-cyan-500/70 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wide rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "PROCESSING..." : (isLogin ? "AUTHENTICATE" : "INITIALIZE")}
                    </button>
                </form>
            </div>
        </div>
    );
}
