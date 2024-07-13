"use client"

import {DataCell, HeaderCell} from "@/components/zeitplanCells";
import React from "react";
import Image from "next/image";


const Zeitplan = ({gottesdienst, sections}: { gottesdienst: any, sections: any }) => {
    return (
        <div
            className={"p-4 flex flex-col justify-start items-center place-items-center h-full w-full fixed inset-0 bg-base-100 z-50"}
        >
            <Image src="/logo.png" alt="Logo" width={100} height={100} className={"fixed top-5 left-5"}/>
            <div
                className={"fixed right-3 bottom-3 border-md border-neutral p-2 text-base-content rounded-md z-[1000] print:hidden bg-base-200 shadow-lg"}
            >
                <button
                    onClick={() => window.history.back()}
                    className={"btn btn-neutral m-2"}
                >Zurück
                </button>
                <button
                    onClick={() => window.print()}
                    className={"btn btn-primary m-2"}
                >Drucken
                </button>
            </div>
            <div className={"grid grid-cols-[1fr_2fr_1fr_2fr] w-full"}>
                <HeaderCell
                    style={"text-center col-span-4 text-2xl py-6"}>Datum: {gottesdienst.dateFrom?.toLocaleString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                </HeaderCell>
                <HeaderCell>Predigt</HeaderCell>
                <DataCell>{gottesdienst.externerPREDIGER ? gottesdienst.externerPREDIGER : gottesdienst.Gottesdienst_User.find((u: any) => u.role === "PREDIGER")?.user.name}</DataCell>
                <HeaderCell>Moderation</HeaderCell>
                <DataCell>{gottesdienst.Gottesdienst_User.find((u: any) => u.role === "MODERATOR")?.user.name}</DataCell>
                <HeaderCell>Thema</HeaderCell>
                <DataCell>{gottesdienst.thema}</DataCell>
                <HeaderCell>MUSIK</HeaderCell>
                <DataCell>{gottesdienst.Gottesdienst_User.filter((u: any) => u.role === "MUSIK").map((u: any) => u.user.name).join(", ")}</DataCell>
                <HeaderCell>Textstelle</HeaderCell>
                <DataCell>{gottesdienst.textstelle}</DataCell>
                <HeaderCell>Begrüssung</HeaderCell>
                <DataCell>{gottesdienst.Gottesdienst_User.find((u: any) => u.role === "BEGRUSSUNG")?.user.name}</DataCell>
                <HeaderCell>Beamer</HeaderCell>
                <DataCell>{gottesdienst.Gottesdienst_User.find((u: any) => u.role === "TECHNIK_BILD")?.user.name}</DataCell>
                <HeaderCell>Ton</HeaderCell>
                <DataCell>{gottesdienst.Gottesdienst_User.find((u: any) => u.role === "TECHNIK_TON")?.user.name}</DataCell>
            </div>
            <div
                className={"grid grid-cols-[auto_auto_1fr_auto_auto] w-full mt-4"}
            >

                <HeaderCell
                    style={"text-center col-span-2"}
                >Zeit/Dauer</HeaderCell>
                <HeaderCell
                    style={"text-center"}
                >Was</HeaderCell>
                <HeaderCell
                    style={"text-center"}
                >Wer</HeaderCell>
                <HeaderCell
                    style={"text-center"}
                >Bild/Ton</HeaderCell>
                <DataCell
                style={"text-xs border-l-red-800 border-l-4 border-t-red-800 border-t-4"}
                >
                    zuvor
                </DataCell>
                <DataCell
                style={"text-xs border-t-red-800 border-t-4"}
                ></DataCell>
                <DataCell
                style={"text-xs border-t-red-800 border-t-4"}
                >
                    Einrichten / Soundcheck / Lüften
                </DataCell>
                <DataCell
                style={"text-xs border-t-red-800 border-t-4"}
                ></DataCell>
                <DataCell
                    style={"text-xs border-r-red-800 border-r-4 border-t-red-800 border-t-4"}
                ></DataCell>
                <DataCell
                    style={"text-xs border-l-red-800 border-l-4"}
                >
                    9:15
                </DataCell>
                <DataCell></DataCell>
                <DataCell
                style={"text-xs"}
                >Gebet</DataCell>
                <DataCell></DataCell>
                <DataCell
                    style={"text-xs border-r-red-800 border-r-4"}
                ></DataCell>
                <DataCell
                    style={"text-xs border-l-red-800 border-l-4 border-b-red-800 border-b-4"}
                >
                    9:30
                </DataCell>
                <DataCell
                style={"text-xs border-b-red-800 border-b-4"}
                ></DataCell>
                <DataCell
                style={"text-xs border-b-red-800 border-b-4"}
                >Begrüssen / Radar laufen lassen</DataCell>
                <DataCell
                style={"text-xs border-b-red-800 border-b-4"}
                ></DataCell>
                <DataCell
                    style={"text-xs border-r-red-800 border-r-4 border-b-red-800 border-b-4"}
                ></DataCell>
                {
                    sections.map((section: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <DataCell>{section.timeFrom}</DataCell>
                                <DataCell>{section.durationMin} &apos;</DataCell>
                                <DataCell>
                                    <pre>{section.was}</pre>
                                </DataCell>
                                <DataCell>
                                    <pre>{section.wer}</pre>
                                </DataCell>
                                <DataCell>
                                    <pre>{section.bild_ton}</pre>
                                </DataCell>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    );
}


export default Zeitplan;