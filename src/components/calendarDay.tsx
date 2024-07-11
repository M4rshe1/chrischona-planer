"use client";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";


const CalendarDay = ({day, events, activeMonth, userId, today, index}: {
    day: Date
    events: any[],
    activeMonth: boolean,
    userId: string,
    today: Date,
    index: number
}) => {
    function hasJob(event: any) {
        if (!event) {
            return false;
        }
        return event.Gottesdienst_User.find((user: any) => user.userId === userId);
    }

    return (
        <div
            tabIndex={0}
            data-tip="Klicken für Details"
            className={"grid grid-rows-2 box-border rounded-md h-[70px]"
                + (activeMonth ? " bg-base-200" : " bg-base-100")
                + (day.toString() == today.toString() ? " border-2 border-primary" : "")
                + (events.length > 0 ? " dropdown tooltip cursor-pointer" : "")
                + (index % 7 > 3 ? " dropdown-left" : " dropdown-right")
                + (index > 20 ? " dropdown-end" : "")
            }
        >
            <div className="flex items-center justify-center pt-2 font-semibold flex-wrap">
                {
                    day.getDate()
                }
            </div>
            <div className="flex justify-center items-center w-full h-full">
                <div className="flex gap-1 justify-center items-center overflow-hidden h-full">
                    {
                        events[0]?.abendmahl ? (
                            <span className="h-3 rounded-full bg-warning aspect-square flex flex-grow"
                                  data-tip="Gottesdienst mit Abendmahl"></span>) : ""
                    }
                    {
                        events[0]?.findetStatt ? (
                            <span className="h-3 rounded-full bg-success aspect-square flex flex-grow"
                                  data-tip="Gottesdienst findet statt"></span>
                        ) : events[0]?.findetStatt === false ? (
                            <span className="h-3 rounded-full bg-error aspect-square flex flex-grow"
                                  data-tip="Gottesdienst findet nicht statt"></span>) : ""
                    }
                    {
                        events[0]?.job ? (<span className="h-3 rounded-full bg-blue-600 aspect-square flex flex-grow"
                                                data-tip="Du hast einen Job"></span>) : ""
                    }
                    {
                        hasJob(events[0]) ? (<span className="h-3 rounded-full bg-blue-600 aspect-square flex flex-grow"
                                                   data-tip="Du hast einen Job"></span>) : ""
                    }
                    {
                        events?.length > 1 ? (<span className=""
                                                    data-tip="Es gibt mehrere Gottesdienste">+{events?.length - 1}</span>) : ""
                    }
                </div>
            </div>
            {
                events.length > 0 ? (
                    <ul
                        className={"bg-base-200 rounded-md dropdown-content flex flex-col gap-2 p-2 z-40 w-64 border-neutral border-2 shadow-lg"}>
                        {
                            events.map((event, index) => (
                                <li key={index}
                                    className="flex justify-between text-left w-full flex-col bg-base-100 p-2 rounded-md border-neutral border-2 shadow-lg">
                                    <h3 className="font-semibold w-full">{event.anlass}</h3>
                                    <p><FontAwesomeIcon icon={fas.faLocationDot}
                                                        className={'mr-1'}/>{event.location.name}</p>
                                    {
                                        !event.findetStatt ? <p
                                            className={"text-error font-semibold"}
                                        >
                                            <FontAwesomeIcon icon={fas.faCircleExclamation} className={'mr-1'}/>Findet
                                            nicht statt
                                        </p> : ""
                                    }
                                    {
                                        event.abendmahl ? <p
                                            className={"text-warning font-semibold"}
                                        >
                                            <FontAwesomeIcon icon={fas.faWineGlass} className={'mr-1'}/>Mit Abendmahl
                                        </p> : ""
                                    }
                                    {
                                        hasJob(event) ? (
                                            <p className="text-blue-600 font-semibold"><FontAwesomeIcon
                                                icon={fas.faUser} className={'mr-1'}/>{hasJob(event).role}</p>
                                        ) : ""
                                    }
                                </li>
                            ))
                        }
                    </ul>
                ) : ""
            }
        </div>
    );
}

export default CalendarDay;