import React from 'react';
import type { Badge } from '../types';
import { TrophyIcon, StarIcon, PlusCircleIcon } from './Icons';

interface BadgeUnlockToastProps {
    badge: Badge;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    TrophyIcon,
    StarIcon,
    PlusCircleIcon,
};

export const BadgeUnlockToast: React.FC<BadgeUnlockToastProps> = ({ badge }) => {
    const IconComponent = iconMap[badge.iconName];

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm animate-slide-up-fast">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl p-4 flex items-center space-x-4">
                <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                     <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Badge Unlocked!</h3>
                    <p className="text-sm text-indigo-100">{badge.title}</p>
                </div>
            </div>
        </div>
    );
};
