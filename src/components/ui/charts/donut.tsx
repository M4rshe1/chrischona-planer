"use client"

import {AgCharts} from "ag-charts-react";
import {AgChartOptions} from "ag-charts-types";

const Donut = ({data, title}: { data: any[], title: string }) => {
    const options = {
        data: data,
        theme: 'ag-polychroma',
        title: {
            text: title,
            color: "#7e848f",
        },
        background: {
            fill: "transparent",
        },
        series: [
            {
                type: "donut",
                calloutLabelKey: "name",
                angleKey: "value",
                innerRadiusRatio: .6,
                // innerLabels: [
                //     {
                //         text: "Total Investment",
                //         fontWeight: "bold",
                //         enabled: true,
                //         color: "white",
                //     },
                //     {
                //         text: "$100,000",
                //         spacing: 4,
                //         fontSize: 48,
                //         color: "green",
                //         enabled: true,
                //     },
                // ],
                calloutLabel: {
                    color: "#7e848f",
                }
            },
        ],
        legend: {
            enabled: false,
        },

    };
    return <AgCharts
        className="w-full h-full"
        options={options as AgChartOptions}/>;
};

export default Donut;