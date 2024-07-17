"use client"

import {memo, useCallback, useEffect, useMemo, useState} from "react";
import {EditableTableColumn, EditableTableHeaderAction, EditableTableRowAction} from "@/lib/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {
    CheckboxInput,
    DateInput,
    MultiSelectInput,
    NumberInput,
    SelectInput,
    TextareaInput,
    TextBasesInput
} from "@/components/editableTableInputs";

const EditableTable = ({
                           data,
                           saveHandler = (value: any, row: any[], name: string) => {
                           },
                           createHandler = (locationId: string) => {
                           },
                           deleteHandler = (row: any[]) => {
                           },
                           rowActions,
                           headerActions,
                           grouped,
                           columns,
                           allowEdit = false,
                           allowCreate = false,
                           allowDelete = false,
                           allowFullscreen = false,
                           allowExport = false,
                           allowFilter = true,
                           tableName = "table"
                       }: {
    data: any[] | any,
    saveHandler: (value: any, row: any[], name: string) => void,
    createHandler: (locationId: string) => void,
    deleteHandler: (row: any[]) => void,
    rowActions?: EditableTableRowAction[],
    headerActions?: EditableTableHeaderAction[],
    grouped?: boolean,
    columns: any[],
    allowEdit?: boolean,
    allowCreate?: boolean,
    allowDelete?: boolean,
    allowFullscreen?: boolean,
    allowExport?: boolean,
    allowFilter?: boolean,
    tableName: string,
}) => {
    const [selectedColumns, setSelectedColumns] = useState<EditableTableColumn[]>(columns);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [countRowsPage, setCountRowsPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [tableFullscreen, setTableFullscreen] = useState<boolean>(false);
    const [filter, setFilter] = useState(
        columns.map((column) => {
            return {
                name: column.name,
                value: "",
                label: column.label,
                type: column.type
            }
        })
    );

    function clientSaveHandler(value: any, row: any[], name: string) {
        const tmpData = grouped ? data[selectedGroup as string] : data;
        const column = columns.find((column) => column.name === name);
        const newData = tmpData.map((r: any) => {
            if (r === row) {
                if (column?.type === "number") {
                    return {
                        ...r,
                        [name]: parseInt(value)
                    }
                } else if (column?.type === "select") {
                    return {
                        ...r,
                        [name]: column.options.find((option: any) => option.value === value)
                    }
                } else if (column?.type === "multiSelect") {
                    return {
                        ...r,
                        [name]: column.options.filter((option: any) => value.includes(option.value))
                    }
                }
            }
            return r;
        })
        if (grouped) {
            data[selectedGroup as string] = newData;
        } else {
            data = newData;
        }
        saveHandler(value, row, name)
    }


    const memoizedSaveHandler = useCallback(clientSaveHandler, [clientSaveHandler]);
    const memoizedCreateHandler = useCallback(createHandler, [createHandler]);
    const memoizedDeleteHandler = useCallback(deleteHandler, [deleteHandler]);
    const memoizedHandleExport = useCallback(hadleExport, [columns, data, grouped, selectedGroup, tableName])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const groups = (grouped ? Object.keys(data) : [])

    function getRows() {
        if (grouped) {
            if (groups.length > 0 && (selectedGroup === null || !groups.includes(selectedGroup as string))) {
                setSelectedGroup(Object.keys(data)[0])
                const filteredData = filterRows(data[Object.keys(data)[0]])
                // @ts-ignore
                return filteredData.slice((currentPage - 1) * countRowsPage, currentPage * countRowsPage)
            } else if (groups.length > 0) {
                const filteredData = filterRows(data[selectedGroup as string])
                // @ts-ignore
                return filteredData.slice((currentPage - 1) * countRowsPage, currentPage * countRowsPage)
            } else {
                return []
            }
        } else {
            const filteredData = filterRows(data)
            return filteredData.slice((currentPage - 1) * countRowsPage, currentPage * countRowsPage)
        }
    }

    function filterRows(rows: any[]) {
        return rows.filter((row) => {
            return filter.every((filterItem) => {
                if (filterItem.value === "" || row[filterItem.name] === null) {
                    return true;
                }
                return row[filterItem.name].toString().toLowerCase().includes(filterItem.value.toLowerCase())
            })
        })
    }

    const rows = getRows();


    useEffect(() => {
        const storedColumns = JSON.parse(localStorage.getItem("chrischona_planer_" + tableName + "_columns") as string);
        const newColumns = columns.map((column) => {
            const storedColumn = storedColumns?.find((c: EditableTableColumn) => c.name === column.name);
            if (storedColumn) {
                return storedColumn;
            }
            return {
                ...column,
                toggle: true
            }
        });
        localStorage.setItem("chrischona_planer_" + tableName + "_columns", JSON.stringify(newColumns));
        setSelectedColumns(newColumns);
    }, [tableName, columns]);

    const dropdownItems = useMemo(() => {
        return groups?.map((item: string) => (

            <li
                className={"border-2 border-base-300 rounded-lg p-2 hover:bg-base-200 cursor-pointer"}
                key={item}
                onClick={() => setSelectedGroup(item)}
            >
                {item}
            </li>
        ))
    }, [groups]);

    const toggleColumn = useCallback((column: EditableTableColumn) => {
        const newColumns = selectedColumns.map((c) => {
            if (c.name === column.name) {
                return {
                    ...c,
                    toggle: !c.toggle
                };
            }
            return c;
        });
        setSelectedColumns(newColumns);
        localStorage.setItem("chrischona_planer_" + tableName + "_columns", JSON.stringify(newColumns));
    }, [selectedColumns, tableName]);

    function hadleExport() {
        const csvHeader = columns.map((column) => {
            return column.label;
        }).join(",");

        const dataList = grouped ? data[selectedGroup as string] : data;

        const csvData = dataList?.map((row: any) => {
            return columns.map((column) => {
                switch (column.type) {
                    case "select":
                        return row[column.name].map((value: any) => {
                            return value.value;
                        }).join(";");
                    case "date":
                        // @ts-ignore
                        return new Date(row[column.name]).toLocaleDateString('de-CH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        });
                    case "boolean":
                        return row[column.name] ? "Ja" : "Nein";
                    default:
                        return row[column.name];
                }
            }).join(",");
        }).join("\n");
        const csv = csvHeader + "\n" + csvData;
        const blob = new Blob([csv], {type: "text/csv"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tableName}_${new Date().toLocaleDateString('de-CH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function changeFilterValue(e: any, filterItem: any) {
        const newFilter = filter.map((item) => {
            if (item.name === filterItem.name) {
                return {
                    ...item,
                    value: e.target.value
                }
            }
            return item;
        })
        setFilter(newFilter);
    }


    return (
        <div
            className={"w-full h-full flex flex-col gap-4 " + (tableFullscreen ? "p-4 fixed inset-0 z-[1000] bg-base-100" : "relative min-h-screen")}
        >
            {/*HEADER*/}
            <div
                className={"flex flex-row justify-between items-center w-full"}
            >
                <div
                    className={"flex flex-row gap-2"}
                >
                    {
                        allowCreate &&
                        <div
                            role={"button"}
                            className={"btn btn-primary tooltip tooltip-right flex items-center justify-center aspect-square"}
                            onClick={() => memoizedCreateHandler("hello")}
                            data-tip={"Neuer Eintrag"}
                        ><FontAwesomeIcon icon={fas.faPlus}/>
                        </div>
                    }
                    {
                        allowExport &&
                        <div
                            role={"button"}
                            className={"btn btn-neutral tooltip tooltip-right flex items-center justify-center aspect-square"}
                            onClick={memoizedHandleExport}
                            data-tip={"Exportieren"}
                        ><FontAwesomeIcon icon={fas.faFileArrowDown}/></div>
                    }
                    {
                        allowFullscreen &&
                        <div
                            role={"button"}
                            className={"btn btn-neutral tooltip tooltip-right flex items-center justify-center aspect-square"}
                            onClick={() => setTableFullscreen(!tableFullscreen)}
                            data-tip={tableFullscreen ? "Vollbild beenden" : "Vollbild"}
                        >
                            {
                                tableFullscreen ?
                                    <FontAwesomeIcon icon={fas.faCompress}/>
                                    : <FontAwesomeIcon icon={fas.faExpand}/>
                            }
                        </div>
                    }
                    {
                        headerActions?.map((action: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    role={"button"}
                                    className={"btn btn-neutral tooltip tooltip-right flex items-center justify-center aspect-square"}
                                    onClick={() => action.handler()}
                                    data-tip={action.tooltip}
                                >
                                    <FontAwesomeIcon icon={action.icon}/>
                                </div>
                            )
                        })
                    }
                </div>
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
                                selectedColumns.map((column, index) => {
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
                        // @ts-ignore
                        (grouped && groups?.length > 0) && <div
                            className={"dropdown dropdown-end"}
                        >
                            <div
                                tabIndex={0}
                                role={"button"}
                                className={"btn btn-neutral dropdown-toggle dropdown-left"}
                            >
                                {selectedGroup} <FontAwesomeIcon icon={fas.faAngleDown} className={"ml-2"}/>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-300 rounded-md z-[1] shadow p-1 mt-2"
                            >

                                {
                                    dropdownItems
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>
            {/*TABLE*/}
            <div
                className={"overflow-x-auto w-full h-full bg-base-100 rounded-lg shadow-lg py-4 pr-4 border-neutral border-2 hover:shadow-xl relative"}

            >
                <table
                    className={"table table-md table-zebra w-full absolute overflow-x-auto"}
                >
                    <thead>
                    <tr>
                        {
                            (allowDelete || rowActions) && <th>
                                Aktionen
                            </th>
                        }
                        {
                            selectedColumns.map((column, index) => {
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
                        allowFilter &&
                        <tr>
                            {
                                (allowDelete || rowActions) && <td
                                    className={"flex gap-2 items-center h-full flex-nowrap"}
                                >
                                    <div>

                                        {
                                            allowDelete && <button
                                                className={"btn btn-sm btn-neutral tooltip pointer-events-none opacity-0"}
                                            >
                                                <FontAwesomeIcon icon={fas.faTrash}/>
                                            </button>
                                        }
                                        {
                                            rowActions?.map((action: any, index: number) => {
                                                return (
                                                    <button
                                                        key={index}
                                                        className={"btn btn-sm btn-neutral tooltip pointer-events-none opacity-0"}
                                                    >
                                                        <FontAwesomeIcon icon={action.icon}/>
                                                    </button>
                                                )
                                            })
                                        }
                                    </div>
                                </td>
                            }
                            {

                                filter.map((filterItem, index) => {
                                    if (selectedColumns.find((column) => column.name === filterItem.name)?.toggle === false) {
                                        return;
                                    }

                                    return (
                                        <td
                                            key={index}
                                        >
                                            <input
                                                type={"text"}
                                                defaultValue={filterItem.value}
                                                onChange={(e) => {
                                                    changeFilterValue(e, filterItem)
                                                }}
                                                placeholder={filterItem.label}
                                                className={"input input-sm input-bordered"}
                                            />
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    }

                    {
                        rows.length === 0 &&
                        <tr>
                            <td colSpan={selectedColumns.length + 1} className={"text-center"}>
                                Keine Daten vorhanden
                            </td>
                        </tr>
                    }
                    {
                        rows.map((row: any, index: number) => {
                            return (
                                <TableRow
                                    key={index}
                                    row={row}
                                    columns={selectedColumns}
                                    allowDelete={allowDelete}
                                    deleteHandler={memoizedDeleteHandler}
                                    rowActions={rowActions}
                                    saveHandler={memoizedSaveHandler}
                                    allowEdit={allowEdit}
                                />
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
            {/*PAGINATION*/}
            <div
                className={"flex flex-row justify-between items-center w-full"}
            >
                <div
                    className={"bg-neutral p-2 rounded-md shadow-sm font-semibold text-neutral-content text-sm h-12 flex items-center"}
                >
                    {
                        <>{(currentPage - 1) * countRowsPage + 1} bis {currentPage * countRowsPage} von {grouped ? data[selectedGroup as string]?.length || 0 : data.length}</>
                    }
                </div>
                <div
                    className={"join join-horizontal"}
                >
                    <button
                        disabled={currentPage === 1}
                        className={"btn btn-neutral join-item"}
                        onClick={() => setCurrentPage(1)}
                    >
                        <FontAwesomeIcon icon={fas.faAnglesLeft}/>
                    </button>
                    <button
                        disabled={currentPage === 1}
                        className={"btn btn-neutral join-item"}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FontAwesomeIcon icon={fas.faChevronLeft}/>
                    </button>

                    <button
                        className={"btn btn-neutral join-item"}
                        disabled={currentPage * countRowsPage > (grouped ? data[selectedGroup as string]?.length - 1 || 0 : data.length - 1)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <FontAwesomeIcon icon={fas.faChevronRight}/>
                    </button>

                    <button
                        className={"btn btn-neutral join-item"}
                        disabled={currentPage * countRowsPage > (grouped ? data[selectedGroup as string]?.length - 1 || 0 : data.length - 1)}
                        onClick={() => setCurrentPage(Math.ceil((grouped ? data[selectedGroup as string]?.length - 1 || 0 : data.length - 1) / countRowsPage))}
                    >
                        <FontAwesomeIcon icon={fas.faAnglesRight}/>
                    </button>
                </div>
                <div>
                    <div
                        className={"dropdown dropdown-top dropdown-end"}
                    >
                        <div
                            tabIndex={0}
                            role={"button"}
                            className={"btn btn-neutral dropdown-toggle"}
                        >
                            {countRowsPage} <FontAwesomeIcon icon={fas.faAngleDown} className={"ml-2"}/>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-300 rounded-md z-[1] w-24 shadow p-1 mt-2"
                        >
                            <li className={"flex items-center flex-row cursor-pointer hover:bg-base-200 p-1 rounded-lg"}
                                onClick={() => {
                                    setCurrentPage(1)
                                    setCountRowsPage(10)
                                }}>
                                10
                            </li>
                            <li className={"flex items-center flex-row cursor-pointer hover:bg-base-200 p-1 rounded-lg"}
                                onClick={() => {
                                    setCurrentPage(1)
                                    setCountRowsPage(20)
                                }}>
                                20
                            </li>
                            <li className={"flex items-center flex-row cursor-pointer hover:bg-base-200 p-1 rounded-lg"}
                                onClick={() => {
                                    setCurrentPage(1)
                                    setCountRowsPage(50)
                                }}>
                                50
                            </li>
                            <li className={"flex items-center flex-row cursor-pointer hover:bg-base-200 p-1 rounded-lg"}
                                onClick={() => {
                                    setCurrentPage(1)
                                    setCountRowsPage(100)
                                }}>
                                100
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface TableRowProps {
    row: any;
    columns: any[];
    allowDelete: boolean;
    deleteHandler: (row: any[]) => void;
    rowActions?: any[];
    saveHandler: (value: any, row: any[], name: string) => void;
    allowEdit: boolean;
}

const TableRow = memo<TableRowProps>(({
                                          row,
                                          columns,
                                          allowDelete,
                                          deleteHandler,
                                          rowActions,
                                          saveHandler,
                                          allowEdit
                                      }) => {
    return (
        <tr>
            <td>
                <div
                    className={"flex flex-row gap-2 items-center h-full"}
                >

                    {
                        allowDelete && <button
                            className={"btn btn-sm btn-neutral hover:bg-error hover:text-white tooltip"}
                            data-tip={"Löschen"}
                            // @ts-ignore
                            onClick={() => deleteHandler(row)}
                        >
                            <FontAwesomeIcon icon={fas.faTrash}/>
                        </button>
                    }
                    {
                        rowActions && rowActions.map((action: any, index: number) => {
                            return (
                                <button
                                    key={index}
                                    className={"btn btn-sm btn-neutral tooltip " + action.style}
                                    data-tip={action.tooltip}
                                    // @ts-ignore
                                    onClick={() => action.handler(row)}
                                >
                                    <FontAwesomeIcon icon={action.icon}/>
                                </button>
                            )
                        })
                    }
                </div>
            </td>
            {

                columns.map((column, index) => {
                    if (!column.toggle) {
                        return null;
                    }
                    switch (column.type) {
                        case "select":
                            return (
                                <td key={index}>
                                    <SelectInput
                                        options={column.options}
                                        row={row}
                                        value={row[column.name]}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        name={column.name}
                                    />
                                </td>
                            )
                        case "multiSelect":
                            return (
                                <td key={index}>
                                    <MultiSelectInput
                                        options={column.options}
                                        row={row}
                                        value={row[column.name]}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        name={column.name}
                                    />
                                </td>
                            )
                        case "number":
                            return (
                                <td key={index}>
                                    <NumberInput
                                        value={row[column.name]}
                                        row={row}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        min={column.min}
                                        max={column.max}
                                        name={column.name}
                                    />
                                </td>
                            )
                        case "date":
                            return (
                                <td key={index}>
                                    <DateInput
                                        value={new Date(row[column.name]).toISOString().split('T')[0]}
                                        row={row}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        name={column.name}
                                    />
                                </td>
                            )
                        case "checkbox":
                            return (
                                <td key={index}>
                                    <CheckboxInput
                                        value={row[column.name]}
                                        row={row}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        name={column.name}
                                    />
                                </td>
                            )
                        case "textarea":
                            return (
                                <td key={index}>
                                    <TextareaInput
                                        value={row[column.name]}
                                        row={row}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        name={column.name}
                                    />
                                </td>
                            )
                        default:
                            return (
                                <td key={index}>
                                    <TextBasesInput
                                        value={row[column.name]}
                                        row={row}
                                        // @ts-ignore
                                        handler={saveHandler}
                                        isDisabled={column.disabled || !allowEdit}
                                        type={column.type}
                                        name={column.name}
                                    />
                                </td>
                            )
                    }
                })}
        </tr>
    )
});

TableRow.displayName = 'TableRow';


export default EditableTable;