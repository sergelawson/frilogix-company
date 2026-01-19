"use client";

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AIEngineering() {
    useEffect(() => {
        const reveals = gsap.utils.toArray('.gsap-reveal') as HTMLElement[];
        reveals.forEach((elem) => {
            gsap.fromTo(elem,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="pt-40 pb-20 bg-brand-light min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-secondary/30 pb-12 gap-10">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
                            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">Lab / AI Division</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-light text-brand-dark tracking-tight">
                            Intelligent <br />Systems
                        </h1>
                    </div>
                    <p className="text-2xl text-brand-gray font-light max-w-xl leading-relaxed">
                        Architecting robust, agentic, and context-aware systems for enterprise complexity.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Technical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-secondary/20 border border-secondary/20 mb-40">
                    {[
                        { title: "RAG Systems", desc: "Zero-hallucination retrieval.", icon: "01" },
                        { title: "Multi-Agent", desc: "Collaborative AI workflows.", icon: "02" },
                        { title: "Vector DBs", desc: "Semantic search engine.", icon: "03" },
                        { title: "LangChain", desc: "Deterministic pipelines.", icon: "04" },
                        { title: "Fine-tuning", desc: "Domain adaptation.", icon: "05" },
                        { title: "Copilots", desc: "Assistive UI integration.", icon: "06" }
                    ].map((item, idx) => (
                        <div key={idx} className="gsap-reveal bg-surface p-12 hover:bg-secondary/5 transition-colors aspect-square flex flex-col justify-between group">
                            <span className="font-mono text-xs text-brand-gray group-hover:text-primary transition-colors">{item.icon}</span>
                            <div>
                                <h3 className="text-2xl font-normal text-brand-dark mb-3">{item.title}</h3>
                                <p className="text-brand-gray font-light text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Philosophy Section */}
                <div className="bg-primary text-white p-12 md:p-24 rounded-sm gsap-reveal shadow-2xl shadow-primary/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-light mb-10">Engineering Philosophy</h2>
                            <p className="text-secondary/80 text-xl mb-12 font-light leading-relaxed">
                                We treat AI as a deterministic engineering component, not a black box. Our systems are built for observability, privacy, and tangible utility.
                            </p>
                            <ul className="space-y-6">
                                {['Deterministic Safeguards', 'Privacy-First Architecture', 'Low-Latency Response', 'Model Agnostic'].map((point, i) => (
                                    <li key={i} className="flex items-center border-b border-white/10 pb-4">
                                        <span className="text-secondary font-mono text-xs mr-6">{">>>"}</span>
                                        <span className="font-light tracking-wide">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 to-transparent"></div>
                                <div className="font-mono text-xs text-secondary space-y-3 z-10 w-full">
                                    <div className="flex justify-between border-b border-secondary/20 pb-2 mb-6 text-white">
                                        <span>AGENT_STATUS</span>
                                        <span>ACTIVE</span>
                                    </div>
                                    <div className="opacity-50">Initializing vector store...</div>
                                    <div className="opacity-70">Loading embeddings...</div>
                                    <div className="text-white">Context retrieved.</div>
                                    <div className="mt-6 p-4 bg-white/10 border-l-2 border-secondary text-white/90">
                                        Generating optimized response...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
