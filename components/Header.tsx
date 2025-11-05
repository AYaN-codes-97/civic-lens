import React from 'react';
import { UserCircleIcon } from './Icons';

interface HeaderProps {
    onProfileClick: () => void;
    isWin95Theme?: boolean;
    onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, isWin95Theme = false, onToggleTheme }) => {
    if (isWin95Theme) {
        return (
            <header className="win95-window" style={{ borderBottom: 'none', position: 'relative', zIndex: 20 }}>
                <div className="win95-titlebar">
                    <div className="win95-titlebar-text">
                        <span>Civic Lens</span>
                    </div>
                    <div className="win95-control-btns">
                        <button 
                            className="win95-control-btn" 
                            title="Toggle Theme"
                            onClick={onToggleTheme}
                            style={{ width: '24px', fontSize: '8px' }}
                        >
                            ◐
                        </button>
                        <button 
                            className="win95-control-btn" 
                            title="Profile"
                            onClick={onProfileClick}
                        >
                            <UserCircleIcon className="w-3 h-3" style={{ color: '#000' }} />
                        </button>
                        <button className="win95-control-btn" title="Minimize">_</button>
                        <button className="win95-control-btn" title="Maximize">□</button>
                        <button className="win95-control-btn" title="Close">×</button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white tracking-tight" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>
                    Civic Lens
                </h1>
                <div className="flex items-center gap-3">
                    {onToggleTheme && (
                        <button 
                            onClick={onToggleTheme}
                            className="text-white hover:text-indigo-300 transition-colors px-3 py-1 rounded border border-white/30 hover:border-indigo-300/50"
                            title="Toggle Windows 95 Theme"
                        >
                            ◐ Win95
                        </button>
                    )}
                    <button onClick={onProfileClick} className="text-white hover:text-indigo-300 transition-colors">
                        <UserCircleIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </header>
    );
};
