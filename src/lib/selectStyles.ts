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

export default selectStyles;