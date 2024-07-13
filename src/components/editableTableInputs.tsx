import Select from "react-select";

// @ts-ignore
const selectStyles = {
    control: (provided: any) => ({
        ...provided,
        minWidth: '300px',
        border: '1px solid var(--fallback-n,oklch(var(--n)/var(--tw-border-opacity)))',
        boxShadow: 'none',
        '&:hover': {
            borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))'
        },
        backgroundColor: 'none',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))',
    }),
    input: (provided: any) => ({
        ...provided,
        color: 'var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))',
    }),
    option: (provided: any, state: { isFocused: any; }) => ({
        ...provided,
        backgroundColor: state.isFocused ? 'base-200' : 'base-100',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'color-mix( in oklab, oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%, black )',
        },
        '&:active': {backgroundColor: 'base-300'}, // Adjust active state color
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))',
        borderColor: 'var(--fallback-n,oklch(var(--n)/var(--tw-border-opacity)))',
        borderWidth: '2px',
        borderStyle: 'solid',
    }),
    multiValue: (styles: any) => {

        return {
            ...styles,
            backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))',
        };
    },
    multiValueLabel: (styles: any) => ({
        ...styles,
        color: "var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))"
    }),
    multiValueRemove: (styles: any, {data}: any) => ({
        ...styles,
        ':hover': {
            backgroundColor: 'var(--fallback-er,oklch(var(--er)/var(--tw-bg-opacity)))',
            color: 'white',
        },
    }),
}

export const SelectInput = ({options, row, handler, value, isDisabled, name}: {
    options: string[],
    row: any,
    value: string,
    handler: (value: string, row: string, name: string) => void,
    isDisabled: boolean,
    name: string
}) => {
    console.log(row, value, name, isDisabled)
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
    value ? console.log("true") : console.log("false")
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
            className={"textarea textarea-bordered textarea-sm"}
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
