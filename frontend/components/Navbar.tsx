"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
    return (
        <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <div className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                ORION
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
                {["Home", "Upload", "Quiz", "Profile"].map((item) => (
                    <Link
                        key={item}
                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="
                            text-slate-400 hover:text-cyan-400
                            transition-colors duration-300
                            hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]
                        "
                    >
                        {item}
                    </Link>
                ))}
                <ThemeToggle />
            </div>
        </nav>
    );
}
