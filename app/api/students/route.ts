import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =====================================
// GET /api/students
// ດຶງ Student ທັງໝົດ
// =====================================
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        studentId: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
      },
      { status: 500 }
    );
  }
}

// =====================================
// POST /api/students
// ເພີ່ມ Student
// =====================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      studentId,
      studentName,
      gender,
      dateOfBirth,
      phoneNumber,
      address,
    } = body;

    // ກວດວ່າຂໍ້ມູນຄົບບໍ່
    if (
      !studentId ||
      !studentName ||
      !gender ||
      !dateOfBirth ||
      !phoneNumber ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ",
        },
        { status: 400 }
      );
    }

    // ກວດ Student ID ຊ້ຳ
    const existingStudent =
      await prisma.student.findUnique({
        where: {
          studentId: studentId,
        },
      });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID ນີ້ມີຢູ່ແລ້ວ",
        },
        { status: 409 }
      );
    }

    // ສ້າງ Student
    const student = await prisma.student.create({
      data: {
        studentId,
        studentName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "ເພີ່ມ Student ສຳເລັດ",
        data: student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST STUDENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student",
      },
      { status: 500 }
    );
  }
}