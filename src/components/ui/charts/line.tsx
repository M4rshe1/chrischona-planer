"use client"

import React, {useState} from "react";
import {AgCharts} from "ag-charts-react";
import {AgChartOptions} from "ag-charts-community";

const Line = ({data, title, series}: { data: any[], title: string, series: any[] }) => {
    const [options, setOptions] = useState<AgChartOptions>({
        data: data,
        theme: 'ag-polychroma',
        title: {
            text: title,
            color: "#7e848f",
        },
        background: {
            fill: "transparent",
        },
        series: series,
        width: "100%",
        height: "100%",
    });

    return <AgCharts options={options}/>;
};

export default Line;