"use client"

import { useEffect, useState } from 'react';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>("dark");

    useEffect(() => {
        const savedTheme = typeof window !== 'undefined'
            ? localStorage.getItem("chrischona_theme")
            : "dark"
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <html lang="de" data-theme={theme}>
        {children}
        </html>
    );
};

export default ThemeProvider;