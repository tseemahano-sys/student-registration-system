import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/subjects/:id
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const subject = await prisma.subject.findUnique({
      where: {
        subjectId: id,
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

    return NextResponse.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("GET SUBJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subject",
      },
      { status: 500 }
    );
  }
}

// PUT /api/subjects/:id
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      subjectName,
      semester,
      credit,
      instructor,
    } = body;

    const subject = await prisma.subject.update({
      where: {
        subjectId: id,
      },
      data: {
        subjectName,
        semester,
        credit: Number(credit),
        instructor,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    console.error("PUT SUBJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update subject",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/subjects/:id
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    await prisma.subject.delete({
      where: {
        subjectId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SUBJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subject",
      },
      { status: 500 }
    );
  }
}