"use client";

import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import { Navbar } from "@/components/Navbar";

import { supabase } from "@/lib/supabase";

export default function Profile() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setToken(session.access_token);
                setUser(session.user.user_metadata.username || session.user.email?.split("@")[0] || "User");
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setToken(session.access_token);
                setUser(session.user.user_metadata.username || session.user.email?.split("@")[0] || "User");
            } else {
                setToken(null);
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (newToken: string, username: string) => {
        // This is called by Auth component, but onAuthStateChange handles it too.
        // We can keep it to force update or just let the subscription handle it.
        // For smoother UX, we update state immediately.
        setToken(newToken);
        setUser(username);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setToken(null);
        setUser(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-cyan-500/30 transition-colors duration-300">

            {/* Navbar */}
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">

                {!token ? (
                    <Auth onLogin={login} />
                ) : (
                    <div className="w-full max-w-2xl p-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-1 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-3xl">
                                👤
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 mb-2">
                            WELCOME, {user?.toUpperCase()}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 tracking-wide">ACCESS LEVEL: AUTHORIZED</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                                <h3 className="text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-1">ACCOUNT STATUS</h3>
                                <p className="text-foreground">ACTIVE</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                                <h3 className="text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-1">MEMBER SINCE</h3>
                                <p className="text-foreground">2024</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="px-8 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-medium tracking-wide rounded-lg transition-all duration-300"
                        >
                            TERMINATE SESSION
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
