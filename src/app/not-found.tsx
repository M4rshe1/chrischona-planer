import Link from 'next/link'

function ErrorPage({description, code}: { description: string, code: number }) {

    if (!code) {
        code = 404
    }

    if (!description) {
        description = "Could not find the page you were looking for."
    }

    return (
        <div
            className={"flex items-center justify-center h-full max-w-96 border-neutral border-2 rounded-lg shadow-lg bg-base-100"}
        >
            <div
                className={"flex flex-col items-center justify-center" +
                    " bg-base-100 p-4 rounded-lg shadow-lg text-center" +
                    " w-md"}
            >
                <h2
                    className={"text-6xl font-bold"}
                >{code}</h2>
                <p
                    className={"text-2xl mt-4 w-md"}
                >{description}</p>
                <p>
                    <Link href="/" className={"btn btn-primary mt-4 mx-1"}>
                        Home
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ErrorPage
