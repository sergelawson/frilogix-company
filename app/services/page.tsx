"use client";

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
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

    const services = [
        {
            id: 'frontend',
            title: "Frontend Development",
            stack: "React / Next.js",
            desc: "Pixel-perfect interfaces. We build modern web applications that prioritize user experience and performance efficiency.",
            features: ["SEO Optimized", "Mobile Responsive", "WCAG Compliant"]
        },
        {
            id: 'backend',
            title: "Backend Systems",
            stack: "Go / Node.js",
            desc: "Robust architectures. We specialize in distributed systems and high-performance APIs for scalable business logic.",
            features: ["Microservices", "Cloud Native", "Real-time Data"]
        },
        {
            id: 'mobile',
            title: "Mobile Engineering",
            stack: "React Native",
            desc: "Cross-platform efficiency. Native-quality mobile applications that utilize device capabilities seamlessly.",
            features: ["iOS & Android", "Offline First", "High Performance"]
        },
        {
            id: 'ai',
            title: "AI Integration",
            stack: "LLM / Python",
            desc: "Intelligent automation. We integrate large language models and vector search to create context-aware applications.",
            features: ["RAG Systems", "Custom Agents", "Automation"]
        }
    ];

    return (
        <div className="pt-40 pb-20 bg-brand-light min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="border-b border-secondary/30 pb-10">
                    <h1 className="text-6xl md:text-8xl font-light text-primary mb-6 tracking-tight">Services</h1>
                    <p className="text-2xl text-brand-gray font-light max-w-3xl">
                        Precision engineering for the modern web.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, idx) => (
                        <div key={service.id} className="gsap-reveal bg-surface p-12 studio-shadow border border-secondary/10 flex flex-col justify-between group hover:border-primary/30 transition-colors duration-500">
                            <div className="mb-12">
                                <div className="flex justify-between items-start mb-8">
                                    <span className="font-mono text-xs text-white uppercase tracking-widest bg-primary px-3 py-1.5 rounded-sm">{service.stack}</span>
                                    <span className="text-secondary/60 font-mono text-lg">0{idx + 1}</span>
                                </div>
                                <h2 className="text-4xl font-light text-brand-dark mb-6 group-hover:text-primary transition-colors">{service.title}</h2>
                                <p className="text-brand-gray font-light leading-relaxed mb-10 text-lg">
                                    {service.desc}
                                </p>
                                <ul className="space-y-4">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-center text-sm text-brand-dark font-medium tracking-wide">
                                            <span className="w-2 h-2 bg-secondary rounded-full mr-4"></span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full flex justify-end">
                                <div className="w-12 h-12 border border-secondary/30 rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary group-hover:text-white transition-all text-primary">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
