import type { Badge, User } from '../types';

export const ALL_BADGES: Badge[] = [
    {
        id: 'report-1',
        title: 'First Report',
        description: 'Report your first issue.',
        iconName: 'PlusCircleIcon',
        metric: 'issuesReported',
        threshold: 1,
    },
    {
        id: 'report-5',
        title: 'Civic Starter',
        description: 'Report 5 issues.',
        iconName: 'StarIcon',
        metric: 'issuesReported',
        threshold: 5,
    },
    {
        id: 'report-10',
        title: 'Community Pillar',
        description: 'Report 10 issues.',
        iconName: 'TrophyIcon',
        metric: 'issuesReported',
        threshold: 10,
    },
    {
        id: 'vote-1',
        title: 'First Upvote',
        description: 'Cast your first upvote.',
        iconName: 'PlusCircleIcon',
        metric: 'upvotesGiven',
        threshold: 1,
    },
    {
        id: 'vote-10',
        title: 'Community Contributor',
        description: 'Cast 10 upvotes.',
        iconName: 'StarIcon',
        metric: 'upvotesGiven',
        threshold: 10,
    },
    {
        id: 'vote-25',
        title: 'Civic Champion',
        description: 'Cast 25 upvotes.',
        iconName: 'TrophyIcon',
        metric: 'upvotesGiven',
        threshold: 25,
    },
];

export const INITIAL_USER: User = {
    id: 'user-123',
    name: 'Concerned Resident',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    stats: {
        issuesReported: 0,
        upvotesGiven: 0,
    },
    earnedBadgeIds: new Set<string>(),
    // Add a new set to track voted issues
    votedIssueIds: new Set<string>(),
};
