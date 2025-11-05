import { useState, useEffect } from 'react';

interface DeviceOrientation {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
}

export const useDeviceOrientation = (): DeviceOrientation => {
    const [orientation, setOrientation] = useState<DeviceOrientation>({
        alpha: null,
        beta: null,
        gamma: null,
    });

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            setOrientation({
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
            });
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return orientation;
};
