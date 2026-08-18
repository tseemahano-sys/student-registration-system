import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// ==========================================
// GET /api/registrations/:id
// ==========================================
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const registration =
      await prisma.registration.findUnique({
        where: {
          registerId: id,
        },
        include: {
          student: true,
          subject: true,
          payment: true,
        },
      });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("GET REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registration",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT /api/registrations/:id
// ==========================================
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      studentId,
      subjectId,
      registerDate,
      status,
      academicYear,
    } = body;

    // Check required fields
    if (
      !studentId ||
      !subjectId ||
      !registerDate ||
      !status ||
      !academicYear
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ",
        },
        { status: 400 }
      );
    }

    // Check Registration
    const existing =
      await prisma.registration.findUnique({
        where: {
          registerId: id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    // Check Student
    const student =
      await prisma.student.findUnique({
        where: {
          studentId,
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

    // Check Subject
    const subject =
      await prisma.subject.findUnique({
        where: {
          subjectId,
        },
      });

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found",
        },
        { status: 404 }
      );
    }

    // Update
    const registration =
      await prisma.registration.update({
        where: {
          registerId: id,
        },
        data: {
          studentId,
          subjectId,
          registerDate: new Date(registerDate),
          status,
          academicYear,
        },
        include: {
          student: true,
          subject: true,
          payment: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("PUT REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update registration",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE /api/registrations/:id
// ==========================================
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check Registration
    const existing =
      await prisma.registration.findUnique({
        where: {
          registerId: id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    // Delete
    await prisma.registration.delete({
      where: {
        registerId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete registration",
        error: String(error),
      },
      { status: 500 }
    );
  }
}