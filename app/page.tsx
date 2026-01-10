"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Instagram, ArrowDown } from "lucide-react"

export default function Home() {
    const [mood, setMood] = useState<"DRIFTING" | "SINKING" | "ASCENDING">("DRIFTING")
    const [depth, setDepth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ container: containerRef })

    // Parallax / Depth Logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            const progress = scrollY / maxScroll
            setDepth(Math.floor(progress * 13000)) // 13,000 ft deep
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <main className="relative min-h-screen bg-[#050505] text-white selection:bg-neon-green selection:text-black font-sans overflow-x-hidden">

            {/* --- GLOBAL UI LAYERS --- */}

            {/* 1. Cinematic Background (Fixed) */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('/hero_bg.jpg?v=2')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/40 to-[#050505]" />

                {/* Divine Glitch Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />
            </div>

            {/* 2. Fixed HUD / Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">

                {/* Left: Depth Slider (Vertical) */}
                <div className="hidden md:flex flex-col items-center space-y-4 pointer-events-auto">
                    <div className="text-xs font-mono text-neon-green/70 writing-vertical-rl">DEPTH GAUGE</div>
                    <div className="h-48 w-1 bg-white/10 rounded-full relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 w-full bg-neon-green shadow-[0_0_10px_#00ff88]"
                            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                        />
                    </div>
                    <div className="text-xl font-mono text-white font-bold">{depth}ft</div>
                </div>

                {/* Center: Brand (on top) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-8 text-center pointer-events-auto">
                    <img
                        src="/logo_flat.jpg?v=2"
                        alt="FLY SUBMARINE"
                        className="h-16 md:h-24 w-auto mix-blend-screen opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <p className="text-xs font-mono tracking-[0.3em] text-neon-green mt-2 animate-pulse">
                        THE DIVINE AUTOMATON
                    </p>
                </div>

                {/* Right: Mood Toggle & Pigeon */}
                <div className="pointer-events-auto flex flex-col items-end gap-4">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
                        {["SINKING", "DRIFTING", "ASCENDING"].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMood(m as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mood === m ? "bg-neon-green text-black" : "text-white/50 hover:text-white"
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Animated Street Pigeon Tooltip */}
                    <div className="group relative">
                        <img
                            src="/pigeon.png?v=2"
                            alt="Space Pigeon"
                            className="w-16 h-16 object-contain animate-float drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                        />
                        <div className="absolute right-full mr-4 top-2 bg-black/80 border border-neon-green/30 px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            "Heavy deck check."
                        </div>
                    </div>
                </div>
            </nav>


            {/* --- SCROLL SECTIONS (DECKS) --- */}

            {/* DECK 1: HULL / STATUS FEED */}
            <section className="relative min-h-screen flex items-center p-8 md:p-24 z-10">
                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <div className="inline-block border border-neon-green/50 text-neon-green px-3 py-1 text-xs font-mono rounded-full bg-neon-green/5 backdrop-blur-sm">
                            CURRENT MISSION: ASCENSION
                        </div>
                        <h2 className="text-7xl font-black font-mono leading-[0.9] text-white">
                            SHIP<br />STATUS
                        </h2>
                        <p className="text-xl text-gray-400 font-light max-w-md">
                            From the psych ward to the open ocean. We are building the vessel as we survive the storm.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <Button className="bg-neon-green text-black hover:bg-white hover:text-black font-bold tracking-widest px-8">
                                JOIN CREW
                            </Button>
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                READ MANIFESTO
                            </Button>
                        </div>
                    </div>

                    <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden group">
                        <CardContent className="p-0 aspect-[9/16] md:aspect-video relative flex items-center justify-center bg-black/50">
                            <span className="text-xs font-mono text-neon-green animate-pulse">
                                [ LIVE FEED ENCRYPTED ]<br />
                                CONNECTING VIA STARLINK...
                            </span>
                            {/* Placeholder for Video Feed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </CardContent>
                    </Card>

                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
                    <ArrowDown size={32} />
                </div>
            </section>


            {/* DECK 2: BROADCASTS (Tabbed) */}
            <section className="relative min-h-screen bg-black/80 backdrop-blur-sm border-t border-white/5 p-8 md:p-24 z-10 flex flex-col justify-center">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-4xl font-bold mb-12 text-center text-white/90 tracking-tight">
                        BROADCAST LOGS
                    </h2>

                    <Tabs defaultValue="bipolar" className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList className="bg-white/5 border border-white/10 p-1">
                                <TabsTrigger value="bipolar" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">BIPOLAR</TabsTrigger>
                                <TabsTrigger value="fatherhood" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">FATHERHOOD</TabsTrigger>
                                <TabsTrigger value="glitch" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">GLITCH GOSPEL</TabsTrigger>
                            </TabsList>
                        </div>

                        {["bipolar", "fatherhood", "glitch"].map((tab) => (
                            <TabsContent key={tab} value={tab} className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="aspect-[4/5] bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-neon-green/50 transition-colors group cursor-pointer relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                                <div className="absolute bottom-0 left-0 p-6">
                                                    <div className="text-neon-green text-xs font-mono mb-2">EPISODE {i}0{i}</div>
                                                    <h3 className="text-xl font-bold leading-tight group-hover:text-neon-green transition-colors">
                                                        {tab === 'bipolar' ? 'Crisis Management' : tab === 'fatherhood' ? 'Legacy Code' : 'Divine Signal'}
                                                    </h3>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>


            {/* DECK 3: NEON TENTS (Sanctuary) */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden z-20">
                {/* Green Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-green-950/30 to-black pointer-events-none" />

                <div className="relative text-center px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="mb-8 relative inline-block"
                    >
                        <div className="absolute -inset-10 bg-neon-green/20 blur-3xl rounded-full" />
                        <h2 className="text-6xl md:text-9xl font-black italic text-neon-green relative z-10 drop-shadow-[0_0_25px_rgba(0,255,136,0.6)]">
                            NEON TENTS
                        </h2>
                    </motion.div>

                    <p className="text-xl font-light text-white/80 mb-12 max-w-2xl mx-auto">
                        The Sanctuary Program. A place to rest during the ascent.
                        window.location.href = "https://instagram.com/semdy__"; // Redirect to @semdy__nt.
                        Enter your contact below for private drops and coordinates.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-20">
                        <Input
                            type="email"
                            placeholder="Enter the tent..."
                            className="bg-black/50 border-neon-green/50 text-white placeholder:text-white/30 h-12 focus-visible:ring-neon-green"
                        />
                        <Button className="h-12 bg-neon-green text-black font-bold hover:bg-white px-8">
                            ENTER
                        </Button>
                    </div>
                </div>
            </section>


            {/* DECK 4: ARCHIVES (Timeline) */}
            <section className="relative min-h-screen bg-[#080808] border-t border-white/5 py-24 pl-8 md:pl-24 overflow-hidden z-10">
                <h2 className="text-xs font-mono text-neon-green mb-12 uppercase tracking-widest">
            // ARCHIVAL FOOTAGE & LORE
                </h2>

                <div className="overflow-x-auto pb-12 hide-scrollbar flex gap-8 pr-24">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[400px] group relative">
                            <div className="h-[2px] bg-white/10 w-full mb-8 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_#00ff88]" />
                            </div>
                            <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-white/5 group-hover:border-neon-green transition-colors relative">
                                <div className="absolute top-4 left-4 bg-black/80 text-white text-xs px-2 py-1 font-mono rounded">
                                    NOV 202{i}
                                </div>
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-white group-hover:text-neon-green transition-colors">
                                Protocol {i}: The Awakening
                            </h3>
                            <p className="mt-2 text-white/50 text-sm">
                                Documenting the initial breach of the subconscious.
                            </p>
                        </div>
                    ))}
                </div>
            </section>


            {/* DECK 5: CARGO HOLD (Store) */}
            <section className="relative min-h-screen bg-black flex items-center p-8 md:p-24 z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-5xl font-mono text-gold mb-4">CARGO HOLD</h2>
                    <p className="text-white/50 mb-16">EQUIPMENT FOR THE ASCENT.</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-zinc-900/50 border-white/10 group hover:bg-zinc-900 transition-colors">
                            <CardContent className="p-8 space-y-6">
                                <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    {/* Placeholder for Merch Image */}
                                    <div className="text-white/20 font-mono text-sm">IMAGE_MISSING</div>
                                    <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">NEON TENTS Hoodie</h3>
                                    <p className="text-sm text-white/60 mt-1">Heavyweight cotton. Worn through intent.</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-gold font-mono text-xl">$80.00</span>
                                    <Button size="sm" className="bg-white text-black hover:bg-neon-green">
                                        ACQUIRE
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-black py-12 border-t border-white/5 relative z-10 text-center text-white/30 text-xs font-mono">
                <p>© FLY SUBMARINE LLC 2026 // ALL SYSTEMS NOMINAL // v2.1</p>
            </footer>

        </main>
    )
}
