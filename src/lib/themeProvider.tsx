"use client"

import React, { useState } from 'react';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("chrischona_theme");
            return savedTheme ? savedTheme : "dark";
        } else {
            return "dark"; // Default theme if on server-side
        }
    });

    return (
        <html lang="de" data-theme={theme}>
        {children}
        </html>
    );
};

export default ThemeProvider;