import React from 'react';
import Link from 'next/link';

export default function CaseStudies() {
    return (
        <div className="pt-32 lg:pt-48 pb-20 min-h-[80vh] flex items-center bg-brand-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-12 inline-flex items-center px-4 py-2 rounded-sm bg-white border border-secondary/30 text-primary text-xs font-mono uppercase tracking-widest shadow-sm">
                    Phase 2 Update
                </div>
                <h1 className="text-6xl md:text-8xl font-light text-brand-dark mb-10 tracking-tight">Success Stories <br /><span className="text-primary font-medium">Coming Soon</span></h1>
                <p className="text-2xl text-brand-gray max-w-3xl mx-auto mb-16 font-light leading-relaxed">
                    We&apos;re currently documenting our recent wins with startups and enterprises. Check back soon for deep dives into our technical architecture.
                </p>
                <Link href="/contact" className="px-12 py-5 bg-primary text-white font-medium text-lg rounded-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                    Discuss Your Success Story
                </Link>
            </div>
        </div>
    );
}
