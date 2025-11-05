
import React, { useState, useEffect, useRef } from 'react';
import type { AnalyzedIssueData } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { analyzeMediaAndSuggestDetails, refineDetailsWithSpeech } from '../agents/formFillerAgent';
import { blobToBase64 } from '../utils/fileUtils';
import { XMarkIcon, PhotoIcon, MicrophoneIcon, ArrowPathIcon } from './Icons';

interface NewIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AnalyzedIssueData, mediaUrls: string[]) => void;
    initialPosition: { lat: number; lng: number };
}

const CATEGORIES = ["Pothole", "Graffiti", "Broken Streetlight", "Trash", "Park Maintenance", "Other"];

export const NewIssueModal: React.FC<NewIssueModalProps> = ({ isOpen, onClose, onSubmit, initialPosition }) => {
    const [details, setDetails] = useState<AnalyzedIssueData>({ title: '', description: '', category: '' });
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isRefining, setIsRefining] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSpeechResult = async (transcript: string) => {
        if (!transcript) return;
        setIsRefining(true);
        setAnalysisError(null);
        try {
            const refinedDetails = await refineDetailsWithSpeech(details, transcript);
            setDetails(refinedDetails);
        } catch (error) {
            console.error(error);
            setAnalysisError('Failed to refine details with your speech. Please try again.');
        } finally {
            setIsRefining(false);
        }
    };

    const { isListening, startListening, stopListening } = useSpeechToText({
        onResult: handleSpeechResult,
    });

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            mediaPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [mediaPreviews]);

    const resetState = () => {
        setDetails({ title: '', description: '', category: '' });
        setAnalysisError(null);
        setIsAnalyzing(false);
        setIsRefining(false);
        setMediaFiles([]);
        mediaPreviews.forEach(url => URL.revokeObjectURL(url));
        setMediaPreviews([]);
        if (isListening) {
            stopListening();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            setAnalysisError("Please select at least one image file.");
            return;
        }

        setMediaFiles(imageFiles);
        const previews = imageFiles.map(file => URL.createObjectURL(file));
        setMediaPreviews(previews);

        // Analyze the first image
        const firstFile = imageFiles[0];
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const base64Data = await blobToBase64(firstFile);
            const analyzedData = await analyzeMediaAndSuggestDetails({
                mimeType: firstFile.type,
                data: base64Data,
            });
            setDetails(analyzedData);
        } catch (error) {
            console.error(error);
            setAnalysisError("AI analysis failed. Please fill in the details manually.");
            setDetails({ title: '', description: '', category: 'Other' }); // Fallback
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!details.title || !details.description || !details.category) {
            alert("Please fill in all fields.");
            return;
        }
        if (mediaFiles.length === 0) {
            alert("Please upload at least one image.");
            return;
        }
        // In a real app, you'd upload files to a server and get URLs.
        // Here, we'll simulate it with the local blob URLs for demonstration.
        onSubmit(details, mediaPreviews);
    };

    if (!isOpen) {
        return null;
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg relative transform transition-all animate-slide-up-fast">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Report a New Issue</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {mediaPreviews.length > 0 ? (
                         <div className="bg-gray-900 p-3 rounded-lg">
                             <h4 className="text-md font-semibold text-white mb-2">Image Preview</h4>
                             <div className="grid grid-cols-3 gap-2">
                                 {mediaPreviews.map((src, index) => (
                                     <img key={index} src={src} className="aspect-square w-full rounded-md object-cover" alt={`preview ${index + 1}`}/>
                                 ))}
                             </div>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-indigo-400 hover:underline mt-2">Change images</button>
                         </div>
                    ) : (
                        <div className="bg-gray-900 p-4 rounded-lg text-center">
                            <h4 className="text-md font-semibold text-white mb-2">Upload Images</h4>
                            <p className="text-sm text-gray-400 mb-3">The first image will be analyzed by AI to pre-fill the form.</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                <PhotoIcon className="w-5 h-5" />
                                <span>Select Images</span>
                            </button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

                    {isAnalyzing && (
                         <div className="text-center text-sm text-gray-300 flex items-center justify-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            <span>AI is analyzing your image...</span>
                        </div>
                    )}
                    {analysisError && <p className="text-red-400 text-sm mt-2 text-center">{analysisError}</p>}
                    
                    {(mediaFiles.length > 0 && !isAnalyzing) && (
                        <>
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                                <input id="title" type="text" value={details.title} onChange={(e) => setDetails(prev => ({...prev, title: e.target.value}))} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                                <div className="relative">
                                    <textarea id="description" value={details.description} onChange={(e) => setDetails(prev => ({...prev, description: e.target.value}))} required rows={4} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10" />
                                    <button type="button" onClick={isListening ? stopListening : startListening} title={isListening ? "Stop listening" : "Start speaking to refine description"} className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'}`}>
                                        {isRefining ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <MicrophoneIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                                <select id="category" value={details.category} onChange={(e) => setDetails(prev => ({...prev, category: e.target.value}))} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="" disabled>Select a category</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="text-xs text-gray-400">
                                Reporting at Lat: {initialPosition.lat.toFixed(5)}, Lng: {initialPosition.lng.toFixed(5)}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500" disabled={isRefining}>
                                    Submit Issue
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};
