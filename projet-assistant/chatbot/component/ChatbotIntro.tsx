"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChatbotIntro() {
    const router = useRouter();

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#6A0DAD] via-[#7b1fcf] to-[#a46bf5] text-white text-center px-6">
            {/* Effet lumineux en arrière-plan */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

            {/* Bouton de fermeture */}
            <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                className="absolute top-6 left-6 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-lg hover:bg-white/20 transition"
            >
                ✕
            </motion.button>

            {/* Titre animé */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-semibold tracking-wide mb-3"
            >
                Hello 👋
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-white/90 max-w-md mb-8 leading-relaxed"
            >
                I'm <span className="font-semibold text-white">Mima</span>, your AI assistant
                here to help you <span className="font-semibold text-white">track and understand</span> your
                <span className="font-semibold text-white">visa application process</span>.
            </motion.p>

            {/* Avatar du chatbot */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
                className="bg-white rounded-full p-6 mb-8 shadow-lg ring-4 ring-white/20"
            >
                <Image
                    src="/bot-con.jpeg"
                    alt="Chatbot"
                    width={90}
                    height={90}
                    className="rounded-full"
                />
            </motion.div>

            {/* Message d’aide */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl mb-10 font-light text-white/90"
            >
                How can I help you today?
            </motion.p>

            {/* Bouton principal */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/chat")}
                className="bg-white text-[#6A0DAD] font-semibold px-10 py-3 rounded-full shadow-lg hover:shadow-purple-300/50 hover:bg-purple-50 transition-all duration-300"
            >
                I want to know!
            </motion.button>
        </div>
    );
}
