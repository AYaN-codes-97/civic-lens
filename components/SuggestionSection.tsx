import React, { useState, useEffect } from 'react';
import { getNearbySuggestions } from '../services/geminiService';
import type { GeolocationCoordinates, GroundingChunk } from '../types';

interface SuggestionSectionProps {
    location: GeolocationCoordinates;
    onSuggestionClick: (suggestionText: string) => void;
}

export const SuggestionSection: React.FC<SuggestionSectionProps> = ({ location, onSuggestionClick }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!location) return;
            setIsLoading(true);
            const { suggestions: fetchedSuggestions, groundingChunks: fetchedChunks } = await getNearbySuggestions(location);
            setSuggestions(fetchedSuggestions);
            setGroundingChunks(fetchedChunks || []);
            setIsLoading(false);
        };

        fetchSuggestions();
    }, [location]);

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-white mb-3">What to look for nearby?</h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                </div>
            ) : (
                <div className="space-y-2">
                    {suggestions.map((text, index) => (
                        <button
                            key={index}
                            onClick={() => onSuggestionClick(text)}
                            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 text-sm transition"
                        >
                            {text}
                        </button>
                    ))}
                </div>
            )}
             {groundingChunks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Powered by Google Maps data:</p>
                    <div className="flex flex-wrap gap-2">
                        {groundingChunks.map((chunk, index) =>
                            chunk.maps?.uri ? (
                                <a
                                    key={index}
                                    href={chunk.maps.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-400 hover:text-indigo-300 bg-gray-700 px-2 py-1 rounded"
                                >
                                    {chunk.maps.title || 'View on Map'}
                                </a>
                            ) : null
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
