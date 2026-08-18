"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Registration {
  registerId: string;

  student?: {
    studentId: string;
    studentName: string;
  };

  subject?: {
    subjectId: string;
    subjectName: string;
  };
}

interface Payment {
  paymentId: string;
  registerId: string;
  amount: number;
  paymentDate: string;
  paymentStatus: string;

  registration?: Registration;
}

const emptyForm = {
  paymentId: "",
  registerId: "",
  amount: "",
  paymentDate: "",
  paymentStatus: "paid",
};

export default function PaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [registrations, setRegistrations] =
    useState<Registration[]>([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    fetchPayments();
    fetchRegistrations();
  }, [router]);

  async function fetchPayments() {
    try {
      const res =
        await fetch("/api/payments");

      const result = await res.json();

      if (result.success) {
        setPayments(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchRegistrations() {
    try {
      const res =
        await fetch("/api/registrations");

      const result = await res.json();

      if (result.success) {
        setRegistrations(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const url = editingId
        ? `/api/payments/${editingId}`
        : "/api/payments";

      const method = editingId
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.message ||
            "Something went wrong"
        );
        return;
      }

      alert(
        editingId
          ? "ແກ້ໄຂ Payment ສຳເລັດ"
          : "ເພີ່ມ Payment ສຳເລັດ"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchPayments();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(payment: Payment) {
    setEditingId(payment.paymentId);

    setForm({
      paymentId:
        payment.paymentId,

      registerId:
        payment.registerId,

      amount:
        String(payment.amount),

      paymentDate:
        payment.paymentDate
          ? payment.paymentDate.substring(
              0,
              10
            )
          : "",

      paymentStatus:
        payment.paymentStatus,
    });

    setShowForm(true);
  }

  async function handleDelete(
    paymentId: string
  ) {
    const confirmDelete = confirm(
      "ຕ້ອງການລຶບ Payment ນີ້ບໍ?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/payments/${paymentId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.message ||
            "Delete failed"
        );
        return;
      }

      alert("ລຶບ Payment ສຳເລັດ");

      fetchPayments();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white shadow-xl">

        <div className="border-b border-blue-500 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl">
              🎓
            </div>

            <div>
              <h1 className="font-bold">
                Registration
              </h1>

              <p className="text-xs text-blue-200">
                Management System
              </p>
            </div>

          </div>
        </div>

        <nav className="mt-6 space-y-2 px-4">

          <Nav
            text="🏠 Dashboard"
            onClick={() =>
              router.push("/dashboard")
            }
          />

          <Nav
            text="👨‍🎓 Students"
            onClick={() =>
              router.push("/students")
            }
          />

          <Nav
            text="📚 Subjects"
            onClick={() =>
              router.push("/subjects")
            }
          />

          <Nav
            text="📝 Registrations"
            onClick={() =>
              router.push("/registrations")
            }
          />

          <Nav
            text="💰 Payments"
            active
            onClick={() =>
              router.push("/payments")
            }
          />

        </nav>

        <button
          onClick={logout}
          className="absolute bottom-0 w-full border-t border-blue-500 px-8 py-4 text-left hover:bg-red-500"
        >
          🚪 Logout
        </button>

      </aside>

      <main className="ml-64 flex-1 p-8">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Payment Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage registration payments
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Payment
          </button>

        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Payment"
                : "Add Payment"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >

              <Input
                label="Payment ID"
                name="paymentId"
                value={form.paymentId}
                onChange={handleChange}
                disabled={!!editingId}
                placeholder="PAY001"
              />

              <div>
                <label className="mb-1 block font-medium">
                  Registration
                </label>

                <select
                  name="registerId"
                  value={form.registerId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Registration
                  </option>

                  {registrations.map(
                    (registration) => (
                      <option
                        key={
                          registration.registerId
                        }
                        value={
                          registration.registerId
                        }
                      >
                        {
                          registration.registerId
                        }{" "}
                        -{" "}
                        {
                          registration.student
                            ?.studentName
                        }{" "}
                        /{" "}
                        {
                          registration.subject
                            ?.subjectName
                        }
                      </option>
                    )
                  )}

                </select>
              </div>

              <Input
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="500000"
              />

              <Input
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={form.paymentDate}
                onChange={handleChange}
              />

              <div>
                <label className="mb-1 block font-medium">
                  Payment Status
                </label>

                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Transfer">
                    Transfer
                  </option>
                </select>
              </div>

              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <div className="border-b px-6 py-4">

            <h2 className="font-bold text-gray-800">
              Payment List
            </h2>

            <p className="text-sm text-gray-500">
              {payments.length} payments
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-800 text-white">
                <tr>

                  <th className="px-4 py-4 text-left">
                    Payment ID
                  </th>

                  <th className="px-4 py-4 text-left">
                    Registration
                  </th>

                  <th className="px-4 py-4 text-left">
                    Student
                  </th>

                  <th className="px-4 py-4 text-left">
                    Subject
                  </th>

                  <th className="px-4 py-4 text-left">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-left">
                    Date
                  </th>

                  <th className="px-4 py-4 text-left">
                    Status
                  </th>

                  <th className="px-4 py-4 text-center">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-500"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.paymentId}
                      className="border-b transition hover:bg-blue-50"
                    >

                      <td className="px-4 py-4 font-semibold">
                        {payment.paymentId}
                      </td>

                      <td className="px-4 py-4">
                        {payment.registerId}
                      </td>

                      <td className="px-4 py-4">
                        {payment.registration
                          ?.student
                          ?.studentName || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {payment.registration
                          ?.subject
                          ?.subjectName || "-"}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {Number(
                          payment.amount
                        ).toLocaleString()}{" "}
                        ₭
                      </td>

                      <td className="px-4 py-4">
                        {payment.paymentDate
                          ? new Date(
                              payment.paymentDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            payment.paymentStatus ===
                            "paid"
                              ? "bg-green-100 text-green-700"
                              : payment.paymentStatus ===
                                "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            payment.paymentStatus
                          }
                        </span>

                      </td>

                      <td className="px-4 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(payment)
                            }
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                payment.paymentId
                              )
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function Nav({
  text,
  onClick,
  active = false,
}: {
  text: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3 text-left ${
        active
          ? "bg-white/20 font-semibold"
          : "hover:bg-white/10"
      }`}
    >
      {text}
    </button>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: any) {
  return (
    <div>
      <label className="mb-1 block font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
      />
    </div>
  );
}