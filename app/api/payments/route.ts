import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// GET /api/payments
// ========================================
export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: {
        paymentDate: "desc",
      },
      include: {
        registration: {
          include: {
            student: true,
            subject: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch payments",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// ========================================
// POST /api/payments
// ========================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      paymentId,
      registerId,
      amount,
      paymentDate,
      paymentStatus,
    } = body;

    if (
      !paymentId ||
      !registerId ||
      amount === undefined ||
      !paymentDate ||
      !paymentStatus
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ",
        },
        { status: 400 }
      );
    }

    // Check Payment ID
    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          paymentId,
        },
      });

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID ນີ້ມີຢູ່ແລ້ວ",
        },
        { status: 409 }
      );
    }

    // Check Registration
    const registration =
      await prisma.registration.findUnique({
        where: {
          registerId,
        },
      });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration ບໍ່ພົບ",
        },
        { status: 404 }
      );
    }

    // Check if registration already has payment
    const existingRegistrationPayment =
      await prisma.payment.findUnique({
        where: {
          registerId,
        },
      });

    if (existingRegistrationPayment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Registration ນີ້ມີ Payment ແລ້ວ",
        },
        { status: 409 }
      );
    }

    const payment =
      await prisma.payment.create({
        data: {
          paymentId,
          registerId,
          amount: Number(amount),
          paymentDate: new Date(paymentDate),
          paymentStatus,
        },
        include: {
          registration: {
            include: {
              student: true,
              subject: true,
            },
          },
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "ເພີ່ມ Payment ສຳເລັດ",
        data: payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment",
        error: String(error),
      },
      { status: 500 }
    );
  }
}