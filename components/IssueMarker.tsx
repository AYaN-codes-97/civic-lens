
import React from 'react';
import { MapPinIcon } from './Icons';
import type { Issue } from '../types';

interface IssueMarkerProps {
    issue: Issue;
    onClick: (issue: Issue) => void;
}

export const IssueMarker: React.FC<IssueMarkerProps> = ({ issue, onClick }) => {
    // This is a placeholder component. In a real map implementation (like Google Maps or Leaflet),
    // this would be an actual map marker. For this example, it's a simple clickable div.
    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); // prevent map click event
                onClick(issue)
            }}
            className="group absolute -translate-x-1/2 -translate-y-full"
            title={issue.title}
        >
            <MapPinIcon className="w-8 h-8 text-indigo-500 group-hover:text-indigo-400 transition-colors drop-shadow-lg" />
            <span className="absolute bottom-full mb-2 w-max max-w-xs scale-0 rounded bg-gray-900/80 p-2 text-xs text-white group-hover:scale-100 transition-transform origin-bottom">
                {issue.title}
            </span>
        </button>
    );
};
