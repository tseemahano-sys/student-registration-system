
import { NextResponse } from "next/server";

export async function GET() {
    const users = [
        { id: 1, name: "DAO", role: "Senior Developer" },
        { id: 2, name: "MOT", role: "Developer" },
        { id: 3, name: "SUKKY", role: "Lead Developer" },
    ]
    return NextResponse.json(users);

}
export async function POST(request:Request) {
    try {
        const body = await request.json();
        return NextResponse.json({
            method:"POST",
            message:"User created successfully",
            receiveData: body,
            status:"Success"
        },{status:201});
    } catch (error) {
        return NextResponse.json({error: "Invalid JSON data"},{status:400});
    }
}
export async function PUT(request:Request) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({error: "User ID is required"},{status:400});
    }
    try {
        const body = await request.json();
        return NextResponse.json({
            method:"PUT",
            message: `User with ID ${id} updated successfully`,
            receiveData: body,
            status:"Success"
        });
    } catch (error) {
        return NextResponse.json({error: "User ID is required"},{status:400});
    }
}
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try { 
         return NextResponse.json({
            method: "DELETE",
            message: `User with ID ${id} deleted successfully`,
            status: "Success"
        });
    } catch (error) {        
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
}

