"use client"

import Select from "react-select";
import selectStyles from "@/lib/selectStyles";

export const SelectInputMulti = ({name, options, isDisabled}: {
    name: string,
    options: { value: string, label: string }[],
    isDisabled: boolean
}) => {
    return (
        <Select
            name={name}
            options={options}
            className={"w-full"}
            styles={selectStyles}
            isMulti
            isClearable={true}
            isDisabled={isDisabled}
        />
    )
}

export const SelectInput = ({name, options, isDisabled}: {
    name: string,
    options: { value: string, label: string }[],
    isDisabled: boolean
}) => {
    return (
        <Select
            name={name}
            options={options}
            className={"w-full"}
            styles={selectStyles}
            isClearable={true}
            isDisabled={isDisabled}
        />
    )
}
