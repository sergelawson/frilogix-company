"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Services', path: '/services' },
        { name: 'AI Engineering', path: '/ai-engineering' },
        { name: 'About', path: '/about' },
        { name: 'Case Studies', path: '/case-studies' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
                    ? 'bg-brand-light/60 backdrop-blur-2xl border-b border-white/40 shadow-sm'
                    : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`flex justify-between items-center transition-all duration-500 ease-in-out ${isScrolled ? 'h-20' : 'h-28'
                        }`}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/logo.png"
                            alt="Frilogix"
                            width={160}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Links - Minimalist Swiss */}
                    <div className="hidden md:flex items-center space-x-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-sm tracking-wide transition-colors ${pathname === link.path ? 'text-primary font-medium border-b-2 border-secondary pb-1' : 'text-brand-gray hover:text-primary'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="ml-4 px-8 py-3 bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all rounded-sm shadow-lg shadow-primary/20"
                        >
                            Start Project
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-primary focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-24 left-0 w-full bg-brand-light border-b border-secondary/30 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
                <div className="px-6 py-8 space-y-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block text-2xl font-light text-brand-dark hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-secondary/20">
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="block w-full py-4 bg-primary text-white text-center font-medium hover:bg-primary-dark transition-colors"
                        >
                            Start Project
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
