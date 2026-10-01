import type { FC } from 'react';
import { Link } from 'react-router';

const Footer: FC = () => {
    return (
        <footer className="bg-primary text-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
                    <div className="max-w-xs">
                        <Link to="/" className="text-2xl font-semibold tracking-tight text-white flex items-center mb-6">
                            FRILOGIX <span className="ml-1 w-2 h-2 bg-secondary rounded-full"></span>
                        </Link>
                        <p className="text-sm font-light text-secondary/80 leading-relaxed">
                            Engineering excellence for the modern web. Sustainable, scalable software solutions.
                        </p>
                    </div>

                    <div className="flex gap-24">
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-8">Sitemap</h4>
                            <ul className="space-y-4 text-sm font-light text-white/80">
                                <li><Link to="/about" className="hover:text-white hover:underline transition-all">About</Link></li>
                                <li><Link to="/services" className="hover:text-white hover:underline transition-all">Services</Link></li>
                                <li><Link to="/services#intelligent-systems" className="hover:text-white hover:underline transition-all">AI Engineering</Link></li>
                                <li><Link to="/contact" className="hover:text-white hover:underline transition-all">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-8">Connect</h4>
                            <ul className="space-y-4 text-sm font-light text-white/80">
                                <li><a href="#" className="hover:text-white hover:underline transition-all">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">Twitter</a></li>
                                <li><a href="#" className="hover:text-white hover:underline transition-all">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 font-mono">
                    <p>&copy; {new Date().getFullYear()} Frilogix Inc.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
