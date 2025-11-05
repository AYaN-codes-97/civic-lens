import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'modern' | 'windows95';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('modern');

    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem('civic-lens-theme') as Theme;
        if (savedTheme && (savedTheme === 'modern' || savedTheme === 'windows95')) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Apply theme class to document body and save to localStorage
        document.body.className = theme === 'windows95' ? 'windows95-theme' : 'modern-theme';
        localStorage.setItem('civic-lens-theme', theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState(current => current === 'modern' ? 'windows95' : 'modern');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};