import React from 'react';
import type { Issue } from '../types';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { XMarkIcon } from './Icons';

interface ARViewProps {
    issues: Issue[];
    userLocation: { latitude: number; longitude: number };
    onClose: () => void;
}

// Placeholder for a full AR implementation
export const ARView: React.FC<ARViewProps> = ({ issues, userLocation, onClose }) => {
    const orientation = useDeviceOrientation();

    return (
        <div className="fixed inset-0 bg-black z-50 text-white">
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg">AR View is not fully implemented.</p>
            </div>
             <div className="absolute top-4 right-4">
                  <button onClick={onClose} className="p-2 bg-white/20 rounded-full">
                     <XMarkIcon className="w-6 h-6"/>
                  </button>
              </div>
            <div className="absolute bottom-4 left-4 text-xs bg-black/50 p-2 rounded">
                <p>Lat: {userLocation.latitude.toFixed(4)}, Lon: {userLocation.longitude.toFixed(4)}</p>
                <p>Alpha: {orientation.alpha?.toFixed(2)}</p>
                <p>Beta: {orientation.beta?.toFixed(2)}</p>
                <p>Gamma: {orientation.gamma?.toFixed(2)}</p>
            </div>
        </div>
    );
};
