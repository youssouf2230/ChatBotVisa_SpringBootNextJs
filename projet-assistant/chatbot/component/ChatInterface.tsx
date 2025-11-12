"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Typage TypeScript pour la réponse du bot
interface BotResponse {
    answer: string;
}

// Typage des messages
interface Message {
    from: "bot" | "user";
    text: string;
}

export default function ChatInterface() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { from: "bot", text: "Hello welcome, what I can help you today?" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll automatique vers le dernier message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { from: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const response = await axios.post<BotResponse>(
                "http://localhost:8080/api/visa/ask",
                { question: input }
            );

            const botAnswer = response.data.answer;

            setMessages(prev => [...prev, { from: "bot", text: botAnswer }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [
                ...prev,
                { from: "bot", text: "Le bot ne répond pas pour le moment." },
            ]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 relative">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-purple-100 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="text-purple-600 text-2xl font-light hover:text-purple-800 transition"
                >
                    ←
                </button>
                <h1 className="text-xl font-semibold text-purple-700">
                    Hello, I'm Mima
                </h1>
                <Image
                    src="/bot-con.jpeg"
                    alt="bot"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.from === "bot" && (
                            <div className="flex items-end space-x-2">
                                <Image
                                    src="/bot-con.jpeg"
                                    alt="bot"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <div className="bg-white text-purple-700 px-4 py-3 rounded-2xl max-w-xs shadow whitespace-pre-wrap">
                                    {msg.text}
                                </div>
                            </div>
                        )}
                        {msg.from === "user" && (
                            <div className="bg-purple-600 text-white px-5 py-3 rounded-2xl max-w-xs shadow">
                                {msg.text}
                            </div>
                        )}
                    </motion.div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-purple-100 shadow-md">
                <div className="flex items-center bg-purple-100 rounded-full p-2">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-600 text-white text-lg hover:bg-purple-700 transition">
                        ✕
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Message"
                        className="flex-1 bg-transparent px-4 text-gray-800 focus:outline-none"
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                        ➤
                    </button>
                </div>

                {/* Boutons de choix rapides */}
                <div className="flex justify-center mt-4 space-x-3">
                    <button className="px-5 py-2 rounded-full bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 transition">
                        No, I dunno
                    </button>
                    <button className="px-5 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
