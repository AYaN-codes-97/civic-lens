// Fix: Implement a custom hook to handle browser-based speech-to-text functionality.
import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechToTextOptions {
    onResult: (transcript: string) => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
}

// Extend the global Window interface to include webkitSpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    // Add type definitions for SpeechRecognition API
    const SpeechRecognition: {
        new (): SpeechRecognition;
        prototype: SpeechRecognition;
    };

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        start(): void;
        stop(): void;
        onresult: (event: SpeechRecognitionEvent) => void;
        onend: () => void;
        onerror: (event: SpeechRecognitionErrorEvent) => void;
    }

    interface SpeechRecognitionEvent extends Event {
        readonly resultIndex: number;
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
        readonly isFinal: boolean;
        readonly length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }
    
    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        readonly error: string;
        readonly message: string;
    }
}

export const useSpeechToText = (options: SpeechToTextOptions) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Use useCallback for options to prevent re-creating the effect unnecessarily
    const { onResult, onEnd, onError } = options;
    const stableOnResult = useCallback(onResult, [onResult]);
    const stableOnEnd = useCallback(() => {
        setIsListening(false);
        if (onEnd) onEnd();
    }, [onEnd]);
    const stableOnError = useCallback((event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (onError) onError(event.error);
    }, [onError]);


    useEffect(() => {
        const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionImpl) {
            console.error('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognitionImpl();
        recognition.continuous = false; // Stop after a pause
        recognition.interimResults = false; // Only final results
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (transcript) {
                stableOnResult(transcript);
            }
        };
        
        recognition.onend = stableOnEnd;
        recognition.onerror = stableOnError;
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [stableOnResult, stableOnEnd, stableOnError]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                // This can happen if start() is called while already active.
                console.error("Error starting speech recognition:", error);
                setIsListening(false);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false); // Manually set state as onend might not fire immediately
        }
    };

    return { isListening, startListening, stopListening };
};
