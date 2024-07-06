"use client";

const AccessRequestFormular = ({formAction, location}: {formAction:  ((formData: FormData) => void), location: string}) => {
    return (
        <form
            action={formAction}
            className={"flex flex-col justify-center gap-4 w-2/3 my-32"}
        >
            <textarea
                id={"message"}
                name={"message"}
                className={"w-full textarea"}
                defaultValue={`Ich möchte Zugriff auf den Standort beantragen.`}
            />
            <input
                type={"hidden"}
                id={"location"}
                name={"location"}
                value={location}
            />
            <button
                type={"submit"}
                className={"btn btn-primary w-fit"}
            >Zugriff beantragen</button>
        </form>
    );

}

export default AccessRequestFormular;