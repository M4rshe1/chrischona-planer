import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify({authenticated: false},), {
            status: 401,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    return NextResponse.json({authenticated: !!session});
}