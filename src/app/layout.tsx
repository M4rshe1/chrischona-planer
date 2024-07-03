import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Provider from "@/lib/provider";
import "./globals.css";
import React from "react";
import Header from "@/components/header";
import ThemeProvider from "@/lib/themeProvider";
import Footer from "@/components/footer";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "MAL Stats",
  description: "A simple MAL stats viewer",
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
  return (
      <ThemeProvider>
        <body className={
            inter.className + " bg-base-300 text-base-content min-h-screen flex flex-col items-center justify-center w-full"
        }>
        <Provider>
          <Header/>
          <div className={"flex flex-col items-center justify-center grow w-full h-full"}>
            {children}
          </div>
          <Footer/>
        </Provider>
        </body>
      </ThemeProvider>
  );
}
