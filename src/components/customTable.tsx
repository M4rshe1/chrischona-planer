"use client"

import {useEffect, useMemo, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";

const CustomTable = ({columns, data, dropdown, tableName, addButton, handleSave, editButton, deleteButton, actions, selectMenu, handleDelete}: {
    columns: any[],
    data: any,
    dropdown: string[],
    tableName: string,
    addButton?: boolean,
    handleSave?: any,
    handleDelete?: any,
    editButton?: boolean,
    deleteButton?: boolean,
    actions?: any,
    selectMenu: boolean
}) => {
    console.log(data)
    const formRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<string>(dropdown[(dropdown.length - 1)])
    const [displayedColumns, setDisplayedColumns] = useState<any[]>(columns);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleAdd = () => {
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
        clearModalData();
    }

    const handleModalSave = (formData: FormData) => {
        setShowModal(false);
        clearModalData();
        handleSave(formData);
    }

    const handleEdit = (item: any) => {
        setShowModal(true);
        item = Object.keys(item).map((key) => {
            return {
                name: key,
                value: item[key]
            }
        })
        setModalData(item);
    }

    const handleRowDelete = (item: any) => {
        const confirmDelete = confirm("Möchten Sie diesen Eintrag wirklich löschen?");
        if (confirmDelete) {
            handleDelete(item);
        }
    }

    const clearModalData = () => {
        setModalData({
            ...columns.map((column) => {
                const datetime = new Date();
                datetime.setDate(datetime.getDate() + (7 - datetime.getDay() + 7) % 7);
                datetime.setHours(9);
                datetime.setMinutes(45);
                return {
                    name: column.name,
                    value: column.type === "boolean" ? false : column.type === "select" ? [] : column.type === "datetime" ? datetime.toISOString().slice(0, 16) : ""
                }
            })
        }, true);
    }

    const setModalData = (data: any, clear: boolean = false) => {
        const form = formRef.current;
        if (form) {
            for (let i = 0; i < Object.keys(data).length; i++) {
                const input = form.querySelector(`[name="${data[i].name}"]`);
                if (input) {
                    // @ts-ignore
                    if (input.type === "checkbox") {
                        // @ts-ignore
                        input.checked = data[i].value;
                        // @ts-ignore
                    } else if (input.type === "datetime-local") {
                        // @ts-ignore
                        input.value = new Date(data[i].value).toISOString().slice(0, 16);

                    } else if (input.querySelectorAll("option").length >= 1) {
                        // @ts-ignore
                        if (clear) {
                            input.querySelectorAll(`option`).forEach((option) => {
                                option.selected = false
                            })
                        } else {
                            data[i].value.map((value: any) => {
                                // @ts-ignore
                                input.querySelector(`option[value="${value.id}"]`).selected = true;
                            });
                        }
                    } else {
                        // @ts-ignore
                        input.value = data[i].value;
                    }
                }
            }
        }
    }
    useEffect(() => {
        let localStoredColumns = JSON.parse(localStorage.getItem("chrischona_planer_ " + tableName + "_columns") || "[]")
        if (localStoredColumns && localStoredColumns.length > 0 && localStoredColumns.length === columns.length) {
            localStoredColumns = localStoredColumns.filter((column: any) => {
                return columns.some((c: any) => c.name === column.name)
            });
            setDisplayedColumns(localStoredColumns);
        } else {
            localStorage.setItem("chrischona_planer_ " + tableName + "_columns", JSON.stringify(columns));
        }
    }, [tableName, columns]);

    const toggleColumn = (column: any) => {
        const newColumns = displayedColumns.map((c: any) => {
            if (c.name === column.name) {
                return {
                    ...c,
                    toggle: !c.toggle
                }
            }
            return c;
        });
        setDisplayedColumns(newColumns);
        localStorage.setItem("chrischona_planer_ " + tableName + "_columns", JSON.stringify(newColumns));
    };

    // Optimize dropdown map rendering
    const dropdownItems = useMemo(() => dropdown?.map((item: string) => {
        return (
            <li
                className={"border-2 border-base-300 rounded-lg p-2 hover:bg-base-200 cursor-pointer"}
                key={item}
                onClick={() => setSelected(item)}
            >
                {item}
            </li>
        );
    }), [dropdown, setSelected]);


    return (
        <div
            className={"w-full h-full flex flex-col gap-4 relative"}
        >
            <div
                className={"flex flex-row justify-between items-center w-full"}
            >
                {
                    addButton ?
                        <div
                            role={"button"}
                            className={"btn btn-primary tooltip tooltip-right flex items-center justify-center aspect-square"}
                            onClick={handleAdd}
                            data-tip={"Neuer Eintrag"}
                        ><FontAwesomeIcon icon={fas.faPlus}/>

                        </div> : <div></div>
                }
                <div>
                    <div
                        className={"dropdown dropdown-end mr-2"}
                    >
                        <div
                            tabIndex={0}
                            role={"button"}
                            className={"btn btn-neutral dropdown-toggle"}
                        >
                            Spalten <FontAwesomeIcon icon={fas.faAngleDown} className={"ml-2"}/>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-300 rounded-md z-[1] w-48 shadow p-2 mt-2 flex flex-col gap-1 overflow-y-auto"
                        >
                            {
                                displayedColumns.map((column, index) => {
                                    return (
                                        <li
                                            key={index}

                                        >
                                            <label
                                                className={"flex items-center flex-row cursor-pointer hover:bg-base-200 p-1 rounded-lg"}
                                            >
                                                <input type="checkbox"
                                                       checked={column.toggle}
                                                       onChange={() => toggleColumn(column)}
                                                       className={"mr-2 checkbox checkbox-sm checkbox-primary"}
                                                />
                                                {column.label}
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    {
                        selectMenu && <div
                            className={"dropdown dropdown-end"}
                        >
                            <div
                                tabIndex={0}
                                role={"button"}
                                className={"btn btn-neutral dropdown-toggle dropdown-left"}
                            >
                                {selected} <FontAwesomeIcon icon={fas.faAngleDown} className={"ml-2"}/>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-300 rounded-md z-[1] w-24 shadow p-1 mt-2"
                            >

                                {
                                    dropdownItems
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>
            <div
                className={"overflow-x-auto w-full h-full bg-base-100 rounded-lg shadow-lg p-4 border-neutral border-2 hover:shadow-xl relative"}
            >
                <table
                    className={"table table-md table-zebra w-full absolute overflow-x-auto"}
                >
                    <thead>
                    <tr>
                        {
                            (editButton || deleteButton || actions?.length) &&
                            <th
                            >
                                Aktionen
                            </th>
                        }
                        {
                            displayedColumns.map((column, index) => {
                                if (!column.toggle) {
                                    return null;
                                }
                                return (
                                    <th
                                        key={index}
                                    >
                                        {column.label}
                                    </th>
                                )
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data[selected].map((item: any, index: number) => {
                            return (
                                <tr
                                    key={index}
                                >
                                    {
                                        (editButton || deleteButton || actions?.length)  ?
                                            <td
                                                className={"text-nowrap"}
                                            >
                                                {
                                                    editButton ?
                                                        <button
                                                            className={"btn btn-sm btn-neutral mr-2 tooltip"}
                                                            data-tip={"Bearbeiten"}
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FontAwesomeIcon icon={fas.faEdit}/>
                                                        </button> : null
                                                }
                                                {
                                                    deleteButton ?
                                                        <button
                                                            className={"btn btn-sm btn-neutral hover:bg-error hover:text-white tooltip"}
                                                            data-tip={"Löschen"}
                                                            onClick={() => handleRowDelete(item)}
                                                        >
                                                            <FontAwesomeIcon icon={fas.faTrash}/>
                                                        </button> : null
                                                }
                                                {
                                                    actions?.length ? (
                                                        actions.map((action: any, key: number) => {
                                                            return <button
                                                                key={key}
                                                                className={"btn btn-sm tooltip ml-2 " + action.style}
                                                                data-tip={action.tooltip}
                                                                onClick={() => action.handler(item)}
                                                            >
                                                                <FontAwesomeIcon icon={action.icon}/>
                                                            </button>
                                                        })
                                                    ) : null
                                                }
                                            </td> : null
                                    }
                                    {
                                        displayedColumns.map((column, index) => {
                                            if (!column.toggle) {
                                                return null;
                                            }
                                            return (
                                                <td
                                                    key={index}
                                                    className={"text-nowrap"}
                                                >
                                                    {
                                                        column.type === "datetime" ?
                                                            new Date(item[column.name]).toLocaleDateString('de-CH',
                                                                {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit'
                                                                }) :
                                                            column.type === "boolean" ?
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item[column.name]}
                                                                    disabled={true}
                                                                /> :
                                                                column.type === "select" ?
                                                                    Object.keys(item[column.name]).map((key: any, index: number) => {
                                                                        return (
                                                                            <span
                                                                                key={index}
                                                                                className={"badge badge-neutral " + (index && "ml-2")}
                                                                            >
                                                                            {item[column.name][key].value}
                                                                        </span>
                                                                        )
                                                                    }) :
                                                                    item[column.name]?.toString()

                                                    }
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
            {
                (editButton || addButton) &&
                <form
                    action={handleModalSave}
                    className={"absolute w-full inset-0 grid bg-base-100 rounded-lg grid-rows-[auto_1fr_auto] p-4" + (showModal ? " visible" : " hidden")}>
                    <div className={"flex flex-row justify-between items-center w-full"}>
                        <h2 className={"font-bold text-2xl"}>Neuer Eintrag</h2>
                        <button className={"btn btn-neutral aspect-square"} onClick={handleModalClose} type={"button"}>
                            <FontAwesomeIcon icon={fas.faX}/>
                        </button>
                    </div>

                    <div
                        ref={formRef}
                        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto p-2"
                        style={{maxHeight: "calc(100vh - 10rem)"}}>
                        {
                            columns.map((column, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={"flex flex-col gap-2 w-full " + ((column.type === "hidden" || !column.toggle) ? "hidden" : "")}
                                    >
                                        <label
                                            className={"text-sm"}
                                        >
                                            {column.label}
                                        </label>
                                        {
                                            column.type === "text" ?
                                                <input
                                                    type="text"
                                                    className={"input input-bordered"}
                                                    name={column.name}
                                                /> :
                                                column.type === "number" ?
                                                    <input
                                                        type="number"
                                                        className={"input input-bordered"}
                                                        name={column.name}
                                                        min={column.min}
                                                        max={column.max}
                                                    /> :
                                                    column.type === "datetime" ?
                                                        <input
                                                            type="datetime-local"
                                                            className={"input input-bordered"}
                                                            name={column.name}
                                                        /> :
                                                    column.type === "boolean" ?
                                                        <input
                                                            type="checkbox"
                                                            className={"checkbox checkbox-primary"}
                                                            name={column.name}
                                                        /> :
                                                        column.type === "hidden" ?
                                                            <input
                                                                type="hidden"
                                                                className={"hidden"}
                                                                value={column.value}
                                                                name={column.name}
                                                            /> :
                                                            column.type === "select" ?
                                                                <select
                                                                    className={"select select-bordered"}
                                                                    name={column.name}
                                                                    multiple={column.multiple}
                                                                >
                                                                    {
                                                                        column.options.map((option: any, index: number) => {
                                                                            return (
                                                                                <option
                                                                                    key={index}
                                                                                    value={option[column.keys.id]}
                                                                                >
                                                                                    {option[column.keys.value]}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select> : null
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div
                        className={"flex flex-row justify-end w-full pt-2"}
                    >
                        <button className={"btn btn-primary mr-2"}
                                type={"submit"}
                        >
                            Speichern
                        </button>
                        <button className={"btn btn-neutral"} onClick={handleModalClose}
                                type={"button"}
                        >
                            Abbrechen
                        </button>
                    </div>
                </form>}
        </div>
    )
}

export default CustomTable;