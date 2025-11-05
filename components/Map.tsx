import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { IssueMarker } from './IssueMarker';
import type { Issue } from '../types';

interface MapProps {
    issues: Issue[];
    onMarkerClick: (issue: Issue) => void;
    onMapClick: (coords: { lat: number; lng: number }) => void;
    center: { lat: number; lng: number };
}

export const Map: React.FC<MapProps> = ({ issues, onMarkerClick, onMapClick, center }) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<L.LayerGroup | null>(null);

    // Initialize map
    useEffect(() => {
        if (containerRef.current && !mapRef.current) {
            const map = L.map(containerRef.current, {
                zoomControl: false, // Optional: for a cleaner look
            }).setView([center.lat, center.lng], 16);
            
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);

            map.on('click', (e) => {
                onMapClick(e.latlng);
            });

            mapRef.current = map;
            markersRef.current = L.layerGroup().addTo(map);
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        }
    }, []);

    // Update center
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom());
        }
    }, [center]);

    // Update markers
    useEffect(() => {
        if (mapRef.current && markersRef.current) {
            markersRef.current.clearLayers();
            
            issues.forEach(issue => {
                const iconHtml = ReactDOMServer.renderToString(
                    // The onClick here is for React, but we'll use the Leaflet event handler
                    <IssueMarker issue={issue} onClick={() => {}} />
                );

                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: '', // Prevents Leaflet's default styles
                    iconSize: [32, 32],
                    iconAnchor: [16, 32], // Anchors the bottom-center of the icon
                });

                const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });
                marker.on('click', (e) => {
                    // Stop propagation to prevent map click event from firing
                    L.DomEvent.stopPropagation(e);
                    onMarkerClick(issue);
                });
                markersRef.current?.addLayer(marker);
            });
        }
    }, [issues, onMarkerClick]);

    return <div ref={containerRef} className="w-full h-full" />;
};
