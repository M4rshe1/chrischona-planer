'use client';

import {useState} from "react";
import CalendarDay from "@/components/calendarDay";
import {UserSession} from "@/lib/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";

const Calendar = ({data, session}: { data?: any[], session: UserSession }) => {
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    if (!data) {
        data = [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0)
    const possitionDate = new Date(year, month);
    const positionMonth = possitionDate.getMonth();
    const maxDaysThisMonth = new Date(possitionDate.getFullYear(), positionMonth + 1, 0).getDate();
    const maxDaysLastMonth = new Date(possitionDate.getFullYear(), positionMonth, 0).getDate();
    const firstDayThisMonth = new Date(possitionDate.getFullYear(), positionMonth, 1).getDay();
    const daysToFillUpAtStart = firstDayThisMonth - 1;
    const daysToFillUpAtEnd = 7 - ((daysToFillUpAtStart + maxDaysThisMonth) % 7);

    let dataset: any[] = [];

    const allDates = []

    // fill up the days of the last month at the beginning into the allDates array as date
    for (let i = 0; i < daysToFillUpAtStart; i++) {
        allDates.push(new Date(possitionDate.getFullYear(), positionMonth - 1, maxDaysLastMonth - i));
    }

    // fill up the days of the current month
    for (let i = 0; i < maxDaysThisMonth; i++) {
        allDates.push(new Date(possitionDate.getFullYear(), positionMonth, i + 1));
    }

    // fill up the days of the next month at the end into the allDates array as date
    for (let i = 0; i < daysToFillUpAtEnd; i++) {
        allDates.push(new Date(possitionDate.getFullYear(), positionMonth + 1, i + 1));
    }

    allDates.map((date) => {
        const matchingItems = data.filter(event => {
            const startDate = new Date(event.dateFrom);
            const endDate = new Date(event.dateUntill);
            const targetDate = new Date(date);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            return targetDate >= startDate && targetDate <= endDate;
        });
        dataset.push({
            day: date,
            activeMonth: date.getMonth() === positionMonth,
            events: matchingItems,
        })
    })

    dataset = dataset.slice(0, 35);

    return (
        <div
            className={"flex items-center flex-col"}
        >
            <div

            >
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className="btn btn-neutral"
                        onClick={() => {
                            setMonth(month - 1);
                            if (month === 0) {
                                setYear(year - 1);
                                setMonth(11);
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={fas.faArrowLeft}/>
                    </button>
                    <button className="btn text-2xl font-bold btn-neutral"
                            onClick={() => {
                                setMonth(new Date().getMonth());
                                setYear(new Date().getFullYear());
                            }}
                    >
                        Heute
                    </button>
                    <button
                        className="btn btn-neutral"
                        onClick={() => {
                            setMonth(month + 1);
                            if (month === 11) {
                                setYear(year + 1);
                                setMonth(0);
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={fas.faArrowRight}/>
                    </button>
                </div>
            </div>
            <div
                className={"text-center font-bold mb-4"}
            >
                {new Date(year, month).toLocaleString('default', {month: 'long'})} {year}
            </div>
            <div
                className={"grid grid-cols-7 gap-1 w-full"}
            >
                {
                    ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, index) => (
                        <div className="text-center align-bottom h-full font-bold" key={index}>{day}</div>
                    ))
                }
            </div>

            <div
                className={"grid grid-cols-7 grid-rows-5 gap-1 w-full"}
            >
                {
                    dataset.map((day, index) => (
                        <CalendarDay day={day.day} events={day.events} activeMonth={day.activeMonth}
                                     userId={session.user.id}
                                     today={today}
                                     key={index}
                                     index={index}
                        />
                    ))
                }
            </div>
            <div className="flex flex-wrap justify-between gap-2 mt-4 w-3/4">
                <div className="flex items-center gap-2 flex-grow">
                    <div className="h-3 rounded-full bg-success aspect-square"></div>
                    <p className="text-nowrap">Findet statt</p>
                </div>
                <div className="flex items-center gap-2 flex-grow">
                    <div className="h-3 rounded-full bg-error aspect-square"></div>
                    <p className="text-nowrap">Findet nicht statt</p>
                </div>
                <div className="flex items-center gap-2 flex-grow">
                    <div className="h-3 rounded-full bg-warning aspect-square"></div>
                    <p className="text-nowrap">Mit Abendmahl</p>
                </div>
                <div className="flex items-center gap-2 flex-grow">
                    <div className="h-3 rounded-full bg-blue-600 aspect-square"></div>
                    <p className="text-nowrap">Du hast einen Job</p>
                </div>
            </div>

        </div>
    );
}

export default Calendar;