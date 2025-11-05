import React, { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import type { Issue, User, Badge, AnalyzedIssueData, GeolocationCoordinates } from './types';
import { ALL_BADGES, INITIAL_USER } from './data/gamification';

import { Header } from './components/Header';
import { Map } from './components/Map';
import { IssueDetailsCard } from './components/IssueDetailsCard';
import { NewIssueModal } from './components/NewIssueModal';
import { ProfileModal } from './components/ProfileModal';
import { SuggestionSection } from './components/SuggestionSection';
import { ARView } from './components/ARView';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { GlobalStyles } from './components/GlobalStyles';
import { EyeIcon } from './components/Icons';


const mockIssues: Issue[] = [
    { id: '1', title: 'Large Pothole on Main St', description: 'A very large and dangerous pothole in the middle of the road near the intersection.', category: 'Pothole', lat: 34.0522, lng: -118.2437, mediaUrls: ['https://source.unsplash.com/random/400x300?pothole'], votes: 15, comments: [], createdAt: Date.now() - 86400000 },
    { id: '2', title: 'Graffiti on Park Wall', description: 'Someone spray-painted graffiti on the main wall of the central park playground.', category: 'Graffiti', lat: 34.055, lng: -118.245, mediaUrls: ['https://source.unsplash.com/random/400x300?graffiti'], votes: 7, comments: [], createdAt: Date.now() - 172800000 },
    { id: '3', title: 'Flickering Streetlight', description: 'The streetlight at the corner of Oak & 4th has been flickering for a week.', category: 'Broken Streetlight', lat: 34.050, lng: -118.240, mediaUrls: ['https://source.unsplash.com/random/400x300?streetlight'], votes: 22, comments: [], createdAt: Date.now() - 604800000 },
];

function App() {
    const { location, error: locationError } = useGeolocation();
    const [user, setUser] = useState<User>(INITIAL_USER);
    const [issues, setIssues] = useState<Issue[]>(mockIssues);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
    const [isWin95Theme, setIsWin95Theme] = useState(false);

    // Modal states
    const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
    const [newIssuePosition, setNewIssuePosition] = useState<{ lat: number; lng: number } | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isARViewOpen, setIsARViewOpen] = useState(false);

    const checkAndAwardBadges = (updatedUser: User) => {
        const newlyEarned: Badge[] = [];
        ALL_BADGES.forEach(badge => {
            if (!updatedUser.earnedBadgeIds.has(badge.id)) {
                if (updatedUser.stats[badge.metric] >= badge.threshold) {
                    updatedUser.earnedBadgeIds.add(badge.id);
                    newlyEarned.push(badge);
                }
            }
        });

        if (newlyEarned.length > 0) {
            setUser(updatedUser);
            setNewlyUnlockedBadges(prev => [...prev, ...newlyEarned]);
        }
    };

    useEffect(() => {
        if (newlyUnlockedBadges.length > 0) {
            const timer = setTimeout(() => {
                setNewlyUnlockedBadges(prev => prev.slice(1));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [newlyUnlockedBadges]);

    const handleSelectIssue = (issue: Issue) => {
        setSelectedIssue(issue);
    };

    const handleMapClick = (coords: { lat: number; lng: number }) => {
        if (selectedIssue) {
            setSelectedIssue(null);
        } else {
            setNewIssuePosition(coords);
            setIsNewIssueModalOpen(true);
        }
    };

    const handleVote = (issueId: string) => {
        if (user.votedIssueIds.has(issueId)) return;

        setIssues(prevIssues =>
            prevIssues.map(issue =>
                issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue
            )
        );
        setSelectedIssue(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);

        const updatedUser = {
            ...user,
            stats: { ...user.stats, upvotesGiven: user.stats.upvotesGiven + 1 },
            votedIssueIds: new Set(user.votedIssueIds).add(issueId)
        };
        setUser(updatedUser);
        checkAndAwardBadges(updatedUser);
    };

    const handleNewIssueSubmit = (data: AnalyzedIssueData, mediaUrls: string[]) => {
        const newIssue: Issue = {
            id: `issue-${Date.now()}`,
            ...data,
            lat: newIssuePosition!.lat,
            lng: newIssuePosition!.lng,
            mediaUrls,
            votes: 1, // Start with one vote from the reporter
            comments: [],
            createdAt: Date.now(),
        };
        setIssues(prev => [...prev, newIssue]);
        setIsNewIssueModalOpen(false);

        const updatedUser = {
            ...user,
            stats: { ...user.stats, issuesReported: user.stats.issuesReported + 1 },
            votedIssueIds: new Set(user.votedIssueIds).add(newIssue.id),
        };
        setUser(updatedUser);
        checkAndAwardBadges(updatedUser);
    };
    
    const nearbyIssues = location
        ? issues // In a real app with more data, you'd filter here
        : issues;

    return (
        <>
            <GlobalStyles isWin95Theme={isWin95Theme} />
            <div className={isWin95Theme ? "win95-theme" : "bg-gray-900 text-white h-screen w-screen flex flex-col overflow-hidden"}>
                <Header 
                    onProfileClick={() => setIsProfileModalOpen(true)}
                    isWin95Theme={isWin95Theme}
                    onToggleTheme={() => setIsWin95Theme(!isWin95Theme)}
                />

                <main className="flex-grow relative">
                    {/* Layer 1: Map Container */}
                    <div className="absolute inset-0 z-0">
                        {location ? (
                            <Map
                                issues={issues}
                                center={{ lat: location.latitude, lng: location.longitude }}
                                onMarkerClick={handleSelectIssue}
                                onMapClick={handleMapClick}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <p className="text-gray-400">{locationError || 'Getting your location...'}</p>
                            </div>
                        )}
                    </div>

                    {/* Layer 2: UI Overlays */}
                    <div className="relative z-10 h-full p-4 pointer-events-none">
                        <div className="absolute top-16 right-4 w-full max-w-sm">
                            {location && (
                                <div className="space-y-4 pointer-events-auto">
                                    <SuggestionSection 
                                        location={location as GeolocationCoordinates} 
                                        onSuggestionClick={(text) => alert(`Suggestion clicked: "${text}". This could pre-fill the new issue form.`)}
                                        isWin95Theme={isWin95Theme}
                                    />
                                    <button 
                                        onClick={() => setIsARViewOpen(true)} 
                                        className={isWin95Theme ? "w-full win95-btn flex items-center justify-center gap-2 p-3" : "w-full flex items-center justify-center gap-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm p-3 rounded-lg shadow-lg transition-colors"}
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                        <span>AR View</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {selectedIssue && (
                    <IssueDetailsCard
                        issue={selectedIssue}
                        onClose={() => setSelectedIssue(null)}
                        onVote={handleVote}
                        hasVoted={user.votedIssueIds.has(selectedIssue.id)}
                        isWin95Theme={isWin95Theme}
                    />
                )}

                {isNewIssueModalOpen && newIssuePosition && (
                    <NewIssueModal
                        isOpen={isNewIssueModalOpen}
                        onClose={() => setIsNewIssueModalOpen(false)}
                        onSubmit={handleNewIssueSubmit}
                        initialPosition={newIssuePosition}
                    />
                )}

                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={user}
                    allBadges={ALL_BADGES}
                />

                {isARViewOpen && location && (
                    <ARView issues={nearbyIssues} userLocation={location} onClose={() => setIsARViewOpen(false)} />
                )}

                {newlyUnlockedBadges.length > 0 && (
                    <BadgeUnlockToast badge={newlyUnlockedBadges[0]} />
                )}
            </div>
        </>
    );
}

export default App;
