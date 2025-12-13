import React from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onNavigate?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-12">
          <div onClick={onNavigate} className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
            <Logo />
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
            <button onClick={onNavigate} className="hover:text-brand transition-colors">
              Log Analysis
            </button>
            <span className="group flex items-center gap-2 cursor-not-allowed opacity-40 hover:opacity-100 transition-opacity">
              <span className="hover:text-main">Hardware Analysis</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">
                Soon
              </span>
            </span>
          </nav>
        </div>

        {/* Right Side: Secondary Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-muted tracking-widest uppercase">
          <a href="#" className="hover:text-brand transition-colors">Documentation</a>
          <a href="#" className="hover:text-brand transition-colors">Roadmap</a>
          <a href="#" className="hover:text-brand transition-colors">About AiDA</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-main p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-bold text-main">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.(); setIsMenuOpen(false); }} className="text-brand">Log Analysis</a>
            <span className="text-muted opacity-50">Hardware Analysis (Soon)</span>
          </nav>
          <div className="h-px bg-border w-full" />
          <div className="flex flex-col gap-4 text-xs font-black text-muted tracking-widest uppercase">
            <a href="#">Documentation</a>
            <a href="#">Roadmap</a>
            <a href="#">About AiDA</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;