import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username, password } = body;

    console.log("LOGIN:", username);

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "ກະລຸນາປ້ອນ Username ແລະ Password",
        },
        { status: 400 }
      );
    }

    // ດຶງສະເພາະ fields ທີ່ Login ຕ້ອງໃຊ້
    // ບໍ່ດຶງ createdAt
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });

    console.log("USER FOUND:", !!user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username ບໍ່ຖືກຕ້ອງ",
        },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password ບໍ່ຖືກຕ້ອງ",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login ສຳເລັດ",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}