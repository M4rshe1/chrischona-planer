"use client"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Select from 'react-select';

const TeamForm = ({handleDelete, handleAdd, team, users, showForm = false, showDelete = false}: {
    handleDelete: any,
    handleAdd: any,
    team: any,
    users: any,
    showForm: boolean,
    showDelete: boolean
}) => {
    const usersNotInTeam = users.filter((user: any) => {
        return !team.users.find((teamUser: any) => teamUser.id === user.id)
    })
    const options = usersNotInTeam.map((user: any) => {
        return {
            value: user.id,
            label: user.name
        }
    })
    const [selectedOption, setSelectedOption] = useState(null)
    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption)
    }

    function handleFormAdd() {
        if (selectedOption) {
            // @ts-ignore
            handleAdd(selectedOption.value, team.id)
        }
    }

    return (
        <div
            className={"bg-base-200 rounded-md p-4 border-neutral border-2 hover:shadow-lg w-full h-full flex flex-col items-center justify-between"}>
            <div
                className={"w-full flex justify-between"}
            >
                <div>
                    <div>
                        <p className={"text-sm"}>Team</p>
                        <p
                            className={"font-bold"}
                        >{team.name}</p>
                    </div>
                    <div
                        className={"my-2 flex gap-2 flex-wrap w-full"}
                    >
                        {
                            team.users.map((user: any, key: number) => {
                                return (
                                    <div key={key}
                                         className={"badge flex justify-between gap-2 badge-md badge-neutral grow"}>
                                        <span>{user.name}</span>
                                        {
                                            showDelete &&
                                            <button onClick={() => handleDelete(user.connectionId)}>
                                                <FontAwesomeIcon icon={fas.faX} className={"text-error"}/>
                                            </button>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            {
                showForm &&
                <form action={handleFormAdd}
                      className={"w-full"}
                >
                    <div
                        className={"w-full gap-2 flex flex-col "}
                    >
                        <label htmlFor="user" className={"text-sm"}>Mitglied</label>
                        <Select
                            value={selectedOption}
                            onChange={handleChange}
                            options={options}
                            isSearchable
                            isClearable={true}
                            placeholder="Suchen..."
                            styles={{

                                control: (provided) => ({
                                    ...provided,
                                    border: '1px solid var(--fallback-n,oklch(var(--n)/var(--tw-border-opacity)))',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))'
                                    },
                                    backgroundColor: 'none',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: 'var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)))',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused ? 'base-200' : 'base-100',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'color-mix( in oklab, oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%, black )',
                                    },
                                    '&:active': {backgroundColor: 'base-300'}, // Adjust active state color
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: 'var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))',
                                    borderColor: 'var(--fallback-n,oklch(var(--n)/var(--tw-border-opacity)))',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                }),
                            }}
                        />
                    </div>
                    <div
                        className={"mt-2 flex justify-end"}
                    >
                        <input
                            type={"submit"}
                            className={"btn btn-primary"}
                            value={"Hinzufügen"}
                        />
                    </div>
                </form>
            }
        </div>
    )

}

export default TeamForm