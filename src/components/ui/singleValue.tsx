const SingleValue = ({label, value, style}: { label: string | number, value: string | number, style?: {parent?: string, label?: string, value?: string} }) => {
    return (
        <div className={"flex flex-col items-start " + style?.parent}>
            <p
                className={"text-sm " + style?.label}
            >
                {label}
            </p>
            <p
                className={"font-bold text-lg " + style?.value}
            >
                {value}
            </p>
        </div>
    )
}

export default SingleValue;