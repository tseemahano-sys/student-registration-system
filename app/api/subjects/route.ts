import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        subjectId: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("GET SUBJECTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subjects",
      },
      { status: 500 }
    );
  }
}

// POST /api/subjects
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      subjectId,
      subjectName,
      semester,
      credit,
      instructor,
    } = body;

    if (
      !subjectId ||
      !subjectName ||
      !semester ||
      credit === undefined ||
      credit === "" ||
      !instructor
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ",
        },
        { status: 400 }
      );
    }

    const existingSubject =
      await prisma.subject.findUnique({
        where: {
          subjectId,
        },
      });

    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject ID ນີ້ມີຢູ່ແລ້ວ",
        },
        { status: 409 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        subjectId,
        subjectName,
        semester,
        credit: Number(credit),
        instructor,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ເພີ່ມ Subject ສຳເລັດ",
        data: subject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST SUBJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create subject",
      },
      { status: 500 }
    );
  }
}