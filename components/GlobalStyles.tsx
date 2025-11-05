import React from 'react';

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

export const GlobalStyles = () => (
    <style>{globalCss}</style>
);
