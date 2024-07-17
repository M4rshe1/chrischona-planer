"use client"

import Card from "@/components/ui/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {SelectInput, SelectInputMulti} from "@/components/bulkActionsInput";
import {useState} from "react";

const BulkactionPage = ({options, handler}: { options: any, handler: any }) => {
    const [showDocs, setShowDocs] = useState(false)

    return (
        <div
            className={"flex items-center justify-center w-full h-full p-4 min-h-screen relative"}
        >
            <form
                action={handler}
                className={"grid grid-cols-1 grid-rows-[auto_1fr_auto_1fr_auto_1fr_auto] items-center justify-center gap-4 w-full h-full"}
            >
                <h1 className={"text-2xl font-semibold text-center w-full"}>Bulk Action</h1>
                <div className="divider">1. Zeitraum auswählen / Generell</div>
                <div
                    className={"flex items-start justify-center w-full gap-4 h-full flex-wrap"}
                >
                    <Card>
                        <div
                            className={"flex flex-col gap-2 items-center w-full h-full"}
                        >
                            <h2
                                className={"text-lg font-semibold gap-2 w-full"}
                            >
                                Zeitraum
                            </h2>
                            <div
                                className={"flex gap-4 flex-col items-start w-full h-full"}
                            >
                                <label className={"flex flex-col gap-2"}>
                                    <span
                                        className={"text-sm"}
                                    >
                                        Start Datum
                                    </span>

                                    <input type={"date"} name={"start"} className={"input"} required/>
                                </label>
                                <label className={"flex flex-col gap-2"}>
                                    <span
                                        className={"text-sm"}
                                    >
                                        Start Datum
                                    </span>
                                    <input type={"date"} name={"end"} className={"input"} required/>
                                </label>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className={"flex flex-col gap-4 items-start w-full h-full"}>
                            <h2 className={"text-lg font-semibold gap-2"}>
                                Generell
                            </h2>
                            <label className={"flex items-center gap-2 text-sm"}>
                                <input type="checkbox"
                                       name={"createSunday"}
                                       className={"checkbox checkbox-primary checkbox-sm"}
                                />
                                <span>Fehlende Gottesdienste/Sonntage erstellen</span>
                            </label>
                            <label className={"flex items-center gap-2"}>
                                <input type="checkbox"
                                       name={"createSunday"}
                                       className={"checkbox checkbox-primary checkbox-sm"}
                                />
                                <span className={"flex items-center gap-2 text-sm"}>Abendmahl</span>
                            </label>
                            <label className={"flex items-center gap-2"}>
                                <input type="checkbox"
                                       name={"overrideOld"}
                                       className={"checkbox checkbox-primary checkbox-sm"}
                                />
                                <span className={"flex items-center gap-2 text-sm"}>Alte Daten überschreiben</span>
                            </label>
                            <label className={"flex flex-col gap-2"}>
                                    <span
                                        className={"text-sm"}
                                    >
                                        Standart Prediger
                                    </span>

                                <SelectInput name={"standartPrediger"}
                                             options={options?.find((option: any) => option.name === "PREDIGER")?.users.map((user: any) => {
                                                 return {
                                                     value: user.user.id,
                                                     label: user.user.name
                                                 }
                                             })} isDisabled={false}/>
                            </label>
                        </div>
                    </Card>
                </div>
                <div className="divider">2. Aktionen auswählen</div>
                <div
                    className={"grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full"}
                >
                    <JobForm title={"Technik Bild"}
                             options={options?.find((option: any) => option.name === "TECHNIK_BILD")?.users.map((user: any) => {
                                 return {
                                     value: user.user.id,
                                     label: user.user.name
                                 }
                             })} name={"technik_bild"}/>
                    <JobForm title={"Technik Ton"}
                             options={options?.find((option: any) => option.name === "TECHNIK_TON")?.users.map((user: any) => {
                                 return {
                                     value: user.user.id,
                                     label: user.user.name
                                 }
                             })} name={"technik_ton"}/>
                    <JobForm title={"Kindertreff"}
                             options={options?.find((option: any) => option.name === "KINDERTREFF")?.users.map((user: any) => {
                                 return {
                                     value: user.user.id,
                                     label: user.user.name
                                 }
                             })} name={"kindertreff"}
                             count={true}
                    />
                    <JobForm title={"Kinder Hüte"}
                             options={options?.find((option: any) => option.name === "KINDERHUTE")?.users.map((user: any) => {
                                 return {
                                     value: user.user.id,
                                     label: user.user.name
                                 }
                             })} name={"kinderhute"}
                             count={true}
                    />
                    <JobForm title={"Moderation"}
                             options={options?.find((option: any) => option.name === "MODERATOR")?.users.map((user: any) => {
                                 return {
                                     value: user.user.id,
                                     label: user.user.name
                                 }
                             })} name={"moderation"}/>
                </div>
                <div className="divider">3. Aktionen ausführen</div>
                <div
                    className={"flex gap-4 items-center w-full"}
                >
                    <button
                        type={"submit"}
                        className={"btn btn-primary"}
                    >
                        Aktionen ausführen
                    </button>
                    <button
                        type={"button"}
                        className={"btn btn-neutral"}
                        onClick={() => window.location.reload()}
                    >
                        Abbrechen
                    </button>
                </div>
            </form>
            {showDocs && <BulkActionDocs/>}
            <button
                data-tip={"Dokumentation zu Bulk Aktionen"}
                className={"btn btn-neutral absolute top-3 right-3 tooltip tooltip-left"}
                onClick={() => setShowDocs(!showDocs)}
            >
                <FontAwesomeIcon icon={fas.faBook} className={"text-2xl"}/>
            </button>
        </div>
    )
}

const JobForm = ({options, title, name, count}: {
    options: any,
    title: string,
    name: string,
    count?: boolean
}) => {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <Card>
            <div
                className={"flex flex-col gap-4 items-start w-full h-full"}
            >
                <label className={"flex items-center gap-2"}>
                    <input type="checkbox"
                           name={name}
                           className={"checkbox checkbox-primary"}
                           onChange={() => setIsChecked(!isChecked)}
                    />
                    <span className={"flex items-center gap-2"}>{title}</span>
                </label>
                <div
                    className={"flex gap-4 items-start w-full h-full flex-wrap"}
                >

                    <label className={"flex flex-col gap-2 grow"}>
                                    <span
                                        className={"text-sm"}
                                    >
                                        Ausgeschlossen
                                    </span>
                        <SelectInputMulti
                            options={options}
                            isDisabled={!isChecked}
                            name={name + "_excluded"}
                        />

                    </label>
                    {
                        count &&
                        <label className={"flex flex-col gap-2 grow"}>
                                    <span
                                        className={"text-sm"}
                                    >
                                        Anzahl
                                    </span>
                            <input type={"number"} className={"input w-24 input-sm input-bordered disabled:border-neutral border-px"}
                                   min={0} required={isChecked}
                                   name={name + "_anzahl"}
                                   defaultValue={1}
                                   disabled={!isChecked}
                            />
                        </label>
                    }
                </div>
            </div>
        </Card>
    )
}

const BulkActionDocs = () => {
    return (
        <div
            className={"absolute inset-0 bg-base-300 p-8 flex flex-col"}
        >
            <h2 className={"text-2xl font-semibold text-center w-full mb-8"}>Bulk Action Dokumentation</h2>
            <h3
                className={"text-xl font-semibold"}
            >Abschnitt 1</h3>
            <p>
                In diesem Abschnitt wird der Zeitraum und generelle Einstellungen für die Aktionen festgelegt.
            </p>
            <br/>
            <p>
                <strong>Zeitraum</strong>: Hier wird der Zeitraum festgelegt, für den die Aktionen ausgeführt werden
                sollen.<br/>
                <blockquote
                    className={"pl-4"}
                >
                    <strong>Start Datum</strong>: Das Startdatum des Zeitraums.<br/>
                    <strong>End Datum</strong>: Das Enddatum des Zeitraums.
                </blockquote>
                <br/>
                <strong>Generell</strong>: Hier werden generelle Einstellungen für die Aktionen festgelegt.
                <blockquote
                    className={"pl-4"}
                >
                    <strong>Fehlende Gottesdienste erstellen</strong>: Erstellt fehlende Gottesdienste am Sonntag falls
                    diese nicht vorhanden sind.<br/>
                    <strong>Abendmahl</strong>: Fügt Abendmahl für den ersten Sonntag des Monats hinzu.<br/>
                    <strong>Alte Daten überschreiben</strong>: Überschreibt alte Daten im Gottesdienstplan mit den neuen.<br/>
                    <strong>Standart Predigt</strong>: Fügt die Standart Predigt für den Sonntag hinzu. Leer lassen wen
                    kein standart Predigt eingetragen werden soll.
                </blockquote>
            </p>
            <br/>
            <h3
                className={"text-xl font-semibold"}
            >Abschnitt 2</h3>
            <p>
                In diesem Abschnitt werden die Aktionen ausgewählt, die ausgeführt werden sollen.
            </p>
            <br/>
            <p>
                <strong>Checkboxen</strong>: Hier können die Aktionen ausgewählt werden, die ausgeführt werden
                sollen.<br/>
                <strong>Ausgeschlossen</strong>: Hier können Personen ausgeschlossen werden, die nicht von der Aktion
                verwendet werden sollen.<br/>
                <strong>Anzahl</strong>: Hier kann die Anzahl der Personen festgelegt werden, die für die Aktion
                benötigt werden.
            </p>
            <br/>
            <h3
                className={"text-xl font-semibold"}
            >Abschnitt 3</h3>
            <p>
                In diesem Abschnitt werden die Aktionen ausgeführt.
            </p>
            <br/>
            <p>
                <strong>Aktionen ausführen</strong>: Hier werden die ausgewählten Aktionen ausgeführt.<br/>
                <strong>Abbrechen</strong>: Hier wird der Vorgang abgebrochen und die Seite neu geladen.
            </p>
            <h2
                className={"text-2xl font-semibold text-center w-full my-6 text-primary"}
            >
                Wichtig
            </h2>
            <p>
                Bulk Aktionen sollten nur von Personen ausgeführt werden, die wissen was sie tun. Falsche Einstellungen
                können zu Datenverlust führen, der nicht rückgängig gemacht werden kann.
            </p>
        </div>
    )
}


export default BulkactionPage;