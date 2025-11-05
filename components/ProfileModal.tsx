import React from 'react';
import { XMarkIcon, TrophyIcon, StarIcon, PlusCircleIcon } from './Icons';
import { BadgeDisplay } from './BadgeDisplay';
import type { User, Badge } from '../types';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    allBadges: Badge[];
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    TrophyIcon,
    StarIcon,
    PlusCircleIcon,
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, allBadges }) => {
    if (!isOpen) return null;

    const earnedBadges = allBadges.filter(badge => user.earnedBadgeIds.has(badge.id));
    const lockedBadges = allBadges.filter(badge => !user.earnedBadgeIds.has(badge.id));

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md relative transform transition-all animate-slide-up-fast">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Your Profile</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center space-x-4 mb-6">
                        <img className="h-20 w-20 rounded-full" src={user.avatarUrl} alt="User Avatar" />
                        <div>
                            <h4 className="text-2xl font-semibold text-white">{user.name}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-white">{user.stats.issuesReported}</p>
                            <p className="text-sm text-gray-400">Issues Reported</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-white">{user.stats.upvotesGiven}</p>
                            <p className="text-sm text-gray-400">Upvotes Given</p>
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="text-md font-bold text-white mb-3">Earned Badges</h5>
                        {earnedBadges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {earnedBadges.map(badge => {
                                    const IconComponent = iconMap[badge.iconName];
                                    return <BadgeDisplay key={badge.id} icon={<IconComponent className="w-6 h-6 text-yellow-400" />} title={badge.title} description={badge.description} />
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No badges earned yet. Keep contributing!</p>
                        )}
                    </div>
                    
                    <div className="mt-6">
                        <h5 className="text-md font-bold text-white mb-3">Badges to Unlock</h5>
                         {lockedBadges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lockedBadges.map(badge => {
                                    const IconComponent = iconMap[badge.iconName];
                                    return <BadgeDisplay key={badge.id} icon={<IconComponent className="w-6 h-6" />} title={badge.title} description={badge.description} locked />
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">You've unlocked all badges!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
