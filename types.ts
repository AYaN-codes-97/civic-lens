export interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy: number;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
}

export interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: number; // timestamp
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: string;
    lat: number;
    lng: number;
    mediaUrls: string[];
    votes: number;
    comments: Comment[];
    createdAt: number; // timestamp
}

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    stats: {
        issuesReported: number;
        upvotesGiven: number;
    };
    earnedBadgeIds: Set<string>;
    votedIssueIds: Set<string>;
}

export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}

export interface GroundingChunk {
    maps?: {
        uri?: string;
        title?: string;
        placeAnswerSources?: {
            reviewSnippets: {
                uri?: string;
                // Fix: Made title optional to match the type from @google/genai, which expects it to be optional.
                title?: string;
                text?: string;
            }[];
        }
    };
    web?: {
        uri?: string;
        title?: string;
    }
}

export interface AnalyzedIssueData {
    title: string;
    description: string;
    category: string;
}

export interface Badge {
    id: string;
    title: string;
    description: string;
    iconName: 'TrophyIcon' | 'StarIcon' | 'PlusCircleIcon';
    metric: 'issuesReported' | 'upvotesGiven';
    threshold: number;
}