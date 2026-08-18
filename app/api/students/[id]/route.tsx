import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/students/:id
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: {
        studentId: id,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("GET STUDENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student",
      },
      { status: 500 }
    );
  }
}

// PUT /api/students/:id
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      studentName,
      gender,
      dateOfBirth,
      phoneNumber,
      address,
    } = body;

    const student = await prisma.student.update({
      where: {
        studentId: id,
      },
      data: {
        studentName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("PUT STUDENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update student",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/students/:id
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    await prisma.student.delete({
      where: {
        studentId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete student",
      },
      { status: 500 }
    );
  }
}