import Select from "react-select";
import selectStyles from "@/lib/selectStyles";
// @ts-ignore


export const SelectInput = ({options, row, handler, value, isDisabled, name}: {
    options: string[],
    row: any,
    value: string,
    handler: (value: string, row: string, name: string) => void,
    isDisabled: boolean,
    name: string
}) => {
    return (
        <Select
            instanceId={row.toString()}
            defaultValue={value}
            onChange={(selectedOption: any) => handler(selectedOption.value, row, name)}
            options={options}
            isSearchable
            isDisabled={isDisabled}
            isClearable={true}
            placeholder="Suchen..."
            styles={selectStyles}
        />
    )
}

export const MultiSelectInput = ({options, row, handler, value, isDisabled, name}: {
    options: string[],
    row: any,
    value: string[],
    handler: (value: string, row: string, name: string) => void,
    isDisabled: boolean,
    name: string
}) => {
    return (
        <Select
            instanceId={row.toString()}
            defaultValue={value}
            onChange={(selectedOption: any) => handler(selectedOption.map((option: any) => option.value), row, name)}
            options={options}
            isSearchable
            isMulti
            isDisabled={isDisabled}
            isClearable={true}
            placeholder="Suchen..."
            styles={selectStyles}
        />
    )

}

export const TextBasesInput = ({value, handler, row, isDisabled, type, name}: {
    value: string,
    handler: (value: string, row: string, name: string) => void,
    row: any,
    isDisabled: boolean,
    type: string,
    name: string
}) => {
    return (
        <input
            type={type}
            defaultValue={value}
            onBlur={(e) => handler(e.target.value, row, name)}
            disabled={isDisabled}
            className={"input input-bordered input-sm"}
        />
    )
}

export const CheckboxInput = ({value, handler, row, isDisabled, name}: {
    value: boolean,
    handler: (value: boolean, row: string, name: string) => void,
    row: any,
    isDisabled: boolean,
    name: string
}) => {
    return (
        value ?
        <input
            type={"checkbox"}
            defaultChecked
            disabled={isDisabled}
            onChange={(e) => handler(e.target.checked, row, name)}
            className={"checkbox checkbox-sm checkbox-primary "}
        /> :
        <input
            type={"checkbox"}
            disabled={isDisabled}
            onChange={(e) => handler(e.target.checked, row, name)}
            className={"checkbox checkbox-sm checkbox-primary "}
        />
    )
}

export const TextareaInput = ({value, handler, row, isDisabled, name}: {
    value: string,
    handler: (value: string, row: string, name: string) => void,
    row: any,
    isDisabled: boolean,
    name: string
}) => {
    return (
        <textarea
            defaultValue={value}
            onBlur={(e) => handler(e.target.value, row, name)}
            disabled={isDisabled}
            className={"textarea textarea-bordered textarea-sm w-[300px] h-24"}
        />
    )
}

export const NumberInput = ({value, handler, row, isDisabled, min, max, name}: {
    value: number,
    handler: (value: number, row: string, name: string) => void,
    row: any,
    isDisabled: boolean,
    min: number,
    max: number,
    name: string
}) => {
    return (
        <input
            type={"number"}
            defaultValue={value}
            onBlur={(e) => handler(parseInt(e.target.value), row, name)}
            disabled={isDisabled}
            min={min}
            max={max}
            className={"input input-bordered input-sm"}
        />
    )
}

export const DateInput = ({value, handler, row, isDisabled, name}: {
    value: string,
    handler: (value: string, row: string, name: string) => void,
    row: any,
    isDisabled: boolean,
    name: string
}) => {
    return (
        <input
            type={"date"}
            defaultValue={value}
            onBlur={(e) => handler(e.target.value, row, name)}
            disabled={isDisabled}
            className={"input input-bordered input-sm"}
        />
    )
}
