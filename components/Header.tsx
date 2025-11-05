import React from 'react';
import { UserCircleIcon } from './Icons';

interface HeaderProps {
    onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white tracking-tight" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>
                    Civic Lens
                </h1>
                <button onClick={onProfileClick} className="text-white hover:text-indigo-300 transition-colors">
                    <UserCircleIcon className="w-8 h-8" />
                </button>
            </div>
        </header>
    );
};
