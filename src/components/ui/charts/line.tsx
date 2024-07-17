"use client"

import React, {useState} from "react";
import {AgCharts} from "ag-charts-react";
import {AgChartOptions} from "ag-charts-community";

const Line = ({data, title, series, axis}: { data: any[], title: string, series: any[], axis: any[] }) => {
    return <AgCharts options={{
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
        width: 0,
        height: 0,
        axes: axis,
    }}/>;
};

export default Line;