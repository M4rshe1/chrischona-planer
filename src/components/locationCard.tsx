import Link from "next/link";

const LocationCard = ({ location }: {location: any}) => {
    return (
        <Link href={'/location/' + location.location.id}
              className="flex justify-between mt-4 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full">
            <div>
                <h2 className="text-xl font-bold">{location.location.name}</h2>
                <p>{location.location.address}</p>
                <p
                    className={"text-sm text-neutral-500 font-semibold"}
                >{location.relation}</p>
            </div>
        </Link>
    )
}

export default LocationCard