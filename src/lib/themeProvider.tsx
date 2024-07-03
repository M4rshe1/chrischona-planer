"use client";
import React from "react";

const ThemeProvider = ({children}: Readonly<{ children: React.ReactNode }>) => {
    const theme = localStorage.getItem("chrischona_theme") || "dark";
    return (
        <html lang="en"
              data-theme={theme}
              className={"min-h-screen"}
        >
        {children}
        </html>
    );
}

export default ThemeProvider;