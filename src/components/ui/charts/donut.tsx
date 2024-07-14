"use client"

import {useState} from "react";
import {AgCharts} from "ag-charts-react";
import {AgChartOptions} from "ag-charts-types";

const ChartExample = ({data, title}: { data: any[], title: string }) => {
    const [options, setOptions] = useState({
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
                formatter: {
                    text: '[bold]${value}[/]',
                },
                innerLabels: [
                    {
                        text: "Total Investment",
                        fontWeight: "bold",
                        enabled: true,
                        color: "white",
                    },
                    {
                        text: "$100,000",
                        spacing: 4,
                        fontSize: 48,
                        color: "green",
                        enabled: true,
                    },
                ],
                label: {
                    value: {
                        format: '[font-weight=bold]${value}[/]',
                    },
                    color: "#7e848f",
                },
                calloutLabel: {
                    color: "#7e848f",
                }
            },
        ],
        legend: {
            enabled: false,
        },
    });

    return <AgCharts
        className="w-full h-full"
        options={options as AgChartOptions}/>;
};

export default ChartExample;