"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from '../components/Particles';
import ImageParticles from '../components/ImageParticles';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Load Animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".hero-animate",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, delay: 0.2 }
    );

    // Scroll Reveal Animations
    const reveals = gsap.utils.toArray('.gsap-reveal') as HTMLElement[];
    reveals.forEach((elem) => {
      gsap.fromTo(elem,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Mouse Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !textRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(textRef.current, {
        x: x,
        y: y,
        duration: 1,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="overflow-hidden bg-brand-light">
      {/* Hero Section - Swiss Grid Style with Particles */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-secondary/30 min-h-[90vh] flex items-center">
        <Particles />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-8" ref={textRef}>

              <h1 className="hero-animate text-6xl md:text-8xl lg:text-9xl font-light text-primary tracking-tight leading-[1] mb-12">
                Engineering <br />
                <span className="font-medium text-brand-dark">Intelligent</span> <br />
                Futures.
              </h1>
              <div className="hero-animate flex flex-col sm:flex-row gap-6 mt-16">
                <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-all rounded-sm min-w-[180px] shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1">
                  Start Project
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center px-10 py-5 bg-transparent border border-primary/30 text-primary font-medium text-sm hover:border-primary transition-all rounded-sm min-w-[180px] backdrop-blur-sm">
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 hero-animate hidden lg:flex flex-col justify-end min-h-[500px] pb-8">
              <div className="w-full flex-1 flex items-center justify-center">
                <ImageParticles />
              </div>
              <div className="w-full mt-6 pl-6 border-l border-secondary/50 relative">
                <span className="absolute -left-[3px] top-0 w-[5px] h-[5px] bg-primary rounded-full"></span>
                <span className="block text-xs font-mono text-secondary mb-3 tracking-widest uppercase">
                  OUR COMPANY
                </span>
                <p className="text-brand-gray text-base font-light leading-relaxed">
                  Frilogix is a software & AI engineering company building high‑performance web, mobile, and AI‑powered applications for startups and forward‑thinking businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities - Horizontal Layout */}
      <section className="py-40 border-b border-secondary/30 relative z-10 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 gsap-reveal">
              <h2 className="text-4xl font-light text-brand-dark mb-8">Core <br />Capabilities</h2>
              <p className="text-brand-gray font-light leading-relaxed text-lg">
                Our methodology merges clean code architecture with environmental efficiency.
              </p>
              <div className="mt-12">
                <div className="w-20 h-20 rounded-full border border-secondary flex items-center justify-center group hover:scale-105 transition-transform duration-500">
                  <svg className="w-8 h-8 text-primary group-hover:rotate-45 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-secondary/30 border border-secondary/30">
                {[
                  { title: "Web & Frontend", desc: "Performance-first React architectures.", icon: "01" },
                  { title: "Scalable Backends", desc: "High-concurrency Go & Node.js systems.", icon: "02" },
                  { title: "AI Engineering", desc: "LLM integration & RAG pipelines.", icon: "03" },
                  { title: "Mobile", desc: "Native-grade cross-platform apps.", icon: "04" }
                ].map((s, i) => (
                  <div key={i} className="gsap-reveal bg-white p-12 hover:bg-secondary/5 transition-colors group">
                    <span className="font-mono text-xs text-secondary mb-6 block font-bold">{s.icon}</span>
                    <h3 className="text-2xl font-normal text-primary mb-4">{s.title}</h3>
                    <p className="text-brand-gray font-light">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Advantage - Studio Clean */}
      <section className="py-40 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-24 max-w-3xl gsap-reveal">
            <h2 className="text-5xl font-light text-brand-dark mb-8">Sustainable Engineering</h2>
            <p className="text-2xl text-brand-gray font-light leading-relaxed">
              We treat code as a resource. Efficient algorithms mean less compute, lower costs, and a smaller carbon footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Precision", text: "Clean codebases with zero redundancy." },
              { title: "Intelligence", text: "AI that enhances, not replaces." },
              { title: "Scale", text: "Infrastructure that grows organically." }
            ].map((item, idx) => (
              <div key={idx} className="gsap-reveal bg-brand-light p-12 rounded-sm studio-shadow flex flex-col justify-between h-96 group hover:-translate-y-2 transition-transform duration-500">
                <div>
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-10 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <h3 className="text-3xl font-light text-brand-dark mb-6">{item.title}</h3>
                  <p className="text-brand-gray font-light leading-relaxed">{item.text}</p>
                </div>
                <div className="w-full h-px bg-secondary/30 mt-8 group-hover:bg-primary/30 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Monochromatic */}
      <section className="py-32 border-t border-secondary/30 bg-brand-light relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-baseline gap-16">
            <h3 className="text-sm font-mono uppercase tracking-widest text-primary/60 whitespace-nowrap">Technical Stack</h3>
            <div className="flex flex-wrap gap-x-16 gap-y-8">
              {['React', 'Node.js', 'Go', 'Python', 'AWS', 'PostgreSQL', 'LangChain', 'OpenAI'].map((tech) => (
                <span key={tech} className="text-3xl font-light text-brand-gray/50 hover:text-primary transition-colors cursor-default hover:scale-105 transform duration-300 display-block">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-primary text-white relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Abstract Circle/Shape for background detail */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[20px] border-white"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-secondary blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center gsap-reveal relative z-10">
          <h2 className="text-5xl md:text-7xl font-light mb-10">Ready to innovate?</h2>
          <p className="text-secondary text-2xl font-light mb-16 max-w-2xl mx-auto">
            Let&apos;s engineer a solution that stands the test of time.
          </p>
          <Link href="/contact" className="inline-block px-14 py-6 bg-white text-primary font-medium text-lg hover:bg-secondary hover:text-white transition-colors rounded-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-300">
            Start Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
