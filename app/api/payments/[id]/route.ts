import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// ========================================
// GET /api/payments/:id
// ========================================
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const payment =
      await prisma.payment.findUnique({
        where: {
          paymentId: id,
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

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("GET PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch payment",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// ========================================
// PUT /api/payments/:id
// ========================================
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      registerId,
      amount,
      paymentDate,
      paymentStatus,
    } = body;

    if (
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

    // Check Payment
    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          paymentId: id,
        },
      });

    if (!existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
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
          message: "Registration not found",
        },
        { status: 404 }
      );
    }

    // If registerId changed,
    // make sure another payment doesn't use it
    if (
      registerId !==
      existingPayment.registerId
    ) {
      const duplicatePayment =
        await prisma.payment.findUnique({
          where: {
            registerId,
          },
        });

      if (duplicatePayment) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Registration ນີ້ມີ Payment ແລ້ວ",
          },
          { status: 409 }
        );
      }
    }

    const payment =
      await prisma.payment.update({
        where: {
          paymentId: id,
        },
        data: {
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

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
    });
  } catch (error) {
    console.error("PUT PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE /api/payments/:id
// ========================================
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const existingPayment =
      await prisma.payment.findUnique({
        where: {
          paymentId: id,
        },
      });

    if (!existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found",
        },
        { status: 404 }
      );
    }

    await prisma.payment.delete({
      where: {
        paymentId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete payment",
        error: String(error),
      },
      { status: 500 }
    );
  }
}