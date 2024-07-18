"use client"

import Select from 'react-select';
import selectStyles from "@/lib/selectStyles";

const TeamForm = ({handleDelete, handleAdd, team, users, showForm = false, showDelete = false}: {
    handleDelete: any,
    handleAdd: any,
    team: any,
    users: any,
    showForm: boolean,
    showDelete: boolean
}) => {
    const options = users.map((user: any) => {
        return {
            value: user.id,
            label: user.name
        }
    })

    const selectedOption = team.users.map((user: any) => {
        return {
            value: user.id,
            label: user.name
        }
    })

    function handleChange(selectedOptions: any) {
        const userNotInSelectedOptions = team.users.filter((user: any) => !selectedOptions.find((option: any) => option.value === user.id))
        const userNewInSelectedOptions = selectedOptions.filter((option: any) => !team.users.find((user: any) => user.id === option.value))

        if (Object.keys(selectedOptions).length > Object.keys(selectedOption).length) {
            handleAdd(userNewInSelectedOptions[0].value, team.id)
        } else {
            handleDelete(userNotInSelectedOptions[0].connectionId)
        }
    }

    return (
        <div
            className={"bg-base-200 rounded-md p-4 border-neutral border-2 hover:shadow-lg w-full h-full flex flex-col items-center justify-between"}>
            <div
                className={"w-full flex"}
            >
                <div>
                    <p
                        className={"font-bold"}
                    >{team.name}</p>
                </div>
            </div>
            <br/>
            {
                showForm &&
                <div
                    className={"w-full"}
                >
                    <div
                        className={"w-full gap-2 flex flex-col "}
                    >
                        <label htmlFor="user" className={"text-sm"}>Mitglieder</label>
                        <Select
                            onChange={handleChange}
                            defaultValue={selectedOption}
                            options={options}
                            isSearchable
                            escapeClearsValue={true}
                            isClearable={showDelete}
                            isDisabled={!showForm}
                            isMulti
                            placeholder="Suchen..."
                            styles={selectStyles}
                        />
                    </div>
                </div>
            }
        </div>
    )

}

export default TeamForm