import React from 'react';

interface BadgeDisplayProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    locked?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ icon, title, description, locked = false }) => {
    return (
        <div className={`p-3 rounded-lg flex items-start space-x-3 ${locked ? 'bg-gray-900/50 opacity-60' : 'bg-gray-700'}`}>
            <div className={`flex-shrink-0 mt-1 ${locked ? 'grayscale' : ''}`}>
                {icon}
            </div>
            <div>
                <h6 className={`font-semibold text-sm ${locked ? 'text-gray-400' : 'text-white'}`}>{title}</h6>
                <p className="text-xs text-gray-400">{locked ? `Unlock by reaching: ${description}` : description}</p>
            </div>
        </div>
    );
};
