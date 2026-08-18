import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        student: true,
        subject: true,
        payment: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("GET REGISTRATIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const registration = await prisma.registration.create({
      data: {
        registerId: body.registerId,
        studentId: body.studentId,
        subjectId: body.subjectId,
        registerDate: new Date(body.registerDate),
        status: body.status,
        academicYear: body.academicYear,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration created successfully",
        data: registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create registration",
        error: String(error),
      },
      { status: 500 }
    );
  }
}