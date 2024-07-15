import Link from "next/link";
import Card from "@/components/ui/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";

const LocationCard = ({location}: { location: any }) => {
    return (
        <Card>
            <Link
                className={"w-full"}
                href={'/location/' + location.location.id}
            >
                <div>
                    <h2 className="text-xl font-bold">{location.location.name}</h2>
                    <p>{location.location.address}</p>
                    <p
                        className={"text-sm text-neutral-500 font-semibold"}
                    >{location.relation}</p>
                </div>
            </Link>
            <FontAwesomeIcon icon={fas.faUpRightFromSquare}
                             className={"absolute top-3 right-4 cursor-pointer"}
            />
        </Card>
    )
}

export default LocationCard