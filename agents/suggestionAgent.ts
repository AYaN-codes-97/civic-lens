
import type { GeolocationCoordinates } from '../types';

export const createSuggestionRequest = (location: GeolocationCoordinates) => {
    const prompt = `
    You are an AI assistant for a civic reporting app. Your goal is to suggest potential issues a user might look for in their vicinity.
    
    User's location: latitude: ${location.latitude}, longitude: ${location.longitude}.
    
    Based on this location, generate a list of 3 concise, actionable suggestions for civic issues to report.
    Frame them as simple statements, not questions.
    For example: "Potholes on main roads", "Broken or flickering streetlights", "Graffiti on public walls", "Overfilled public trash cans".
    
    Return ONLY a bulleted list of these 3 suggestions, with each suggestion on a new line starting with a hyphen.
    
    Example output format:
    - First suggestion
    - Second suggestion
    - Third suggestion
    `;

    return {
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                },
            },
        },
    };
};
