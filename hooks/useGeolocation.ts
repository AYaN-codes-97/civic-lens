
import { useState, useEffect } from 'react';

interface GeolocationState {
    location: GeolocationCoordinates | null;
    error: string | null;
}

export const useGeolocation = (): GeolocationState => {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState(prevState => ({ ...prevState, error: 'Geolocation is not supported by your browser.' }));
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setState({
                location: position.coords,
                error: null,
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            setState(prevState => ({ ...prevState, error: error.message }));
        };

        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return state;
};
