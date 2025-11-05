import React from 'react';

interface GlobalStylesProps {
    isWin95Theme?: boolean;
}

const globalCss = `
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes fade-in-fast {
    from { opacity: 0; }
    to { opacity: 1; }
}
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
.animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }

@keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes slide-up-fast {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.animate-slide-up-fast { animation: slide-up-fast 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

@keyframes pulse-fast {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
.animate-pulse-fast { animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
`;

const win95Css = `
/* Windows 95 Theme */
:root {
    --win95-gray: #c0c0c0;
    --win95-dark-gray: #808080;
    --win95-light-gray: #dfdfdf;
    --win95-white: #ffffff;
    --win95-black: #000000;
    --win95-blue: #000080;
    --win95-light-blue: #1084d0;
    --win95-teal: #008080;
}

.win95-theme {
    font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Arial, sans-serif;
    background: var(--win95-teal);
    color: var(--win95-black);
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Windows 95 Button Base */
.win95-btn {
    background: var(--win95-gray);
    border: 2px solid;
    border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
    padding: 4px 12px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 11px;
    color: var(--win95-black);
    cursor: pointer;
    box-shadow: inset 1px 1px 0 var(--win95-light-gray), inset -1px -1px 0 var(--win95-dark-gray);
    position: relative;
}

.win95-btn:hover {
    background: #d4d4d4;
}

.win95-btn:active {
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    box-shadow: inset 1px 1px 0 var(--win95-black), inset -1px -1px 0 var(--win95-light-gray);
    padding: 5px 11px 3px 13px;
}

.win95-btn:focus {
    outline: 1px dotted var(--win95-black);
    outline-offset: -4px;
}

/* Windows 95 Window/Panel */
.win95-window {
    background: var(--win95-gray);
    border: 2px solid;
    border-color: var(--win95-white) var(--win95-black) var(--win95-black) var(--win95-white);
    box-shadow: 1px 1px 0 var(--win95-black);
}

/* Windows 95 Titlebar */
.win95-titlebar {
    background: linear-gradient(90deg, var(--win95-blue), var(--win95-light-blue));
    color: var(--win95-white);
    padding: 2px 4px;
    font-weight: bold;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
}

.win95-titlebar-text {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 2px;
}

/* Window Control Buttons */
.win95-control-btns {
    display: flex;
    gap: 2px;
}

.win95-control-btn {
    width: 16px;
    height: 14px;
    background: var(--win95-gray);
    border: 1px solid;
    border-color: var(--win95-white) var(--win95-black) var(--win95-black) var(--win95-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
}

.win95-control-btn:active {
    border-color: var(--win95-black) var(--win95-white) var(--win95-white) var(--win95-black);
}

/* Inset/Sunken Panel */
.win95-inset {
    border: 2px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    box-shadow: inset 1px 1px 0 var(--win95-black), inset -1px -1px 0 var(--win95-light-gray);
    background: var(--win95-white);
}

/* Windows 95 Input */
.win95-input {
    background: var(--win95-white);
    border: 2px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    padding: 3px 4px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 11px;
    color: var(--win95-black);
}

.win95-input:focus {
    outline: none;
}

/* Windows 95 Textarea */
.win95-textarea {
    background: var(--win95-white);
    border: 2px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    padding: 3px 4px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 11px;
    color: var(--win95-black);
    resize: vertical;
}

.win95-textarea:focus {
    outline: none;
}

/* Windows 95 Select/Dropdown */
.win95-select {
    background: var(--win95-white);
    border: 2px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    padding: 2px 20px 2px 4px;
    font-family: 'MS Sans Serif', Arial, sans-serif;
    font-size: 11px;
    color: var(--win95-black);
    cursor: pointer;
}

/* Windows 95 Status Bar */
.win95-statusbar {
    background: var(--win95-gray);
    border-top: 1px solid var(--win95-white);
    padding: 2px 4px;
    font-size: 11px;
    display: flex;
    gap: 4px;
}

.win95-statusbar-panel {
    border: 1px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    padding: 2px 4px;
}

/* Windows 95 Scrollbar styling (basic) */
.win95-scrollbar::-webkit-scrollbar {
    width: 16px;
    background: var(--win95-gray);
}

.win95-scrollbar::-webkit-scrollbar-track {
    background: var(--win95-gray);
}

.win95-scrollbar::-webkit-scrollbar-thumb {
    background: var(--win95-gray);
    border: 2px solid;
    border-color: var(--win95-white) var(--win95-black) var(--win95-black) var(--win95-white);
}

/* Windows 95 Checkbox */
.win95-checkbox {
    width: 13px;
    height: 13px;
    background: var(--win95-white);
    border: 2px solid;
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    cursor: pointer;
}

/* Windows 95 specific overrides for modern elements */
.win95-theme button:not(.win95-btn) {
    background: var(--win95-gray);
    border: 2px solid;
    border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
    color: var(--win95-black);
    font-family: 'MS Sans Serif', Arial, sans-serif;
}

.win95-theme button:not(.win95-btn):active {
    border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
}
`;

export const GlobalStyles: React.FC<GlobalStylesProps> = ({ isWin95Theme = false }) => (
    <style>{globalCss + (isWin95Theme ? win95Css : '')}</style>
);
