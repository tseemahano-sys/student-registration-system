"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [students, setStudents] = useState(0);
  const [subjects, setSubjects] = useState(0);
  const [registrations, setRegistrations] = useState(0);
  const [payments, setPayments] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    try {
      const [
        studentsRes,
        subjectsRes,
        registrationsRes,
        paymentsRes,
      ] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/subjects"),
        fetch("/api/registrations"),
        fetch("/api/payments"),
      ]);

      const studentsData = await studentsRes.json();
      const subjectsData = await subjectsRes.json();
      const registrationsData =
        await registrationsRes.json();
      const paymentsData = await paymentsRes.json();

      if (studentsData.success) {
        setStudents(studentsData.data.length);
      }

      if (subjectsData.success) {
        setSubjects(subjectsData.data.length);
      }

      if (registrationsData.success) {
        setRegistrations(
          registrationsData.data.length
        );
      }

      if (paymentsData.success) {
        setPayments(paymentsData.data.length);
      }
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );
    }
  }

  function logout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
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

        <nav className="mt-6 px-4 space-y-2">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center gap-3 rounded-xl bg-white/20 px-4 py-3 text-left font-semibold"
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => router.push("/students")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
          >
            👨‍🎓 Students
          </button>

          <button
            onClick={() => router.push("/subjects")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
          >
            📚 Subjects
          </button>

          <button
            onClick={() => router.push("/registrations")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
          >
            📝 Registrations
          </button>

          <button
            onClick={() => router.push("/payments")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10"
          >
            💰 Payments
          </button>

        </nav>

        <div className="absolute bottom-0 w-full border-t border-blue-500 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-red-500"
          >
            🚪 Logout
          </button>

        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen flex-1">

        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-8 py-5 shadow-sm">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Student Registration Overview
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="font-semibold text-gray-800">
                {user?.username || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
              👤
            </div>

          </div>

        </header>

        <div className="p-8">

          {/* Welcome */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">

            <h1 className="text-3xl font-bold">
              Welcome back! 👋
            </h1>

            <p className="mt-2 text-blue-100">
              Manage students, subjects,
              registrations and payments
              from one place.
            </p>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            <DashboardCard
              title="Students"
              value={students}
              icon="👨‍🎓"
              color="blue"
              onClick={() => router.push("/students")}
            />

            <DashboardCard
              title="Subjects"
              value={subjects}
              icon="📚"
              color="purple"
              onClick={() => router.push("/subjects")}
            />

            <DashboardCard
              title="Registrations"
              value={registrations}
              icon="📝"
              color="green"
              onClick={() =>
                router.push("/registrations")
              }
            />

            <DashboardCard
              title="Payments"
              value={payments}
              icon="💰"
              color="orange"
              onClick={() =>
                router.push("/payments")
              }
            />

          </div>

          {/* Quick Actions */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <button
                onClick={() =>
                  router.push("/students")
                }
                className="rounded-xl border p-5 text-left transition hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="mb-2 text-3xl">
                  👨‍🎓
                </div>

                <h3 className="font-bold">
                  Manage Students
                </h3>

                <p className="text-sm text-gray-500">
                  Add, edit and delete students
                </p>
              </button>

              <button
                onClick={() =>
                  router.push("/registrations")
                }
                className="rounded-xl border p-5 text-left transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="mb-2 text-3xl">
                  📝
                </div>

                <h3 className="font-bold">
                  New Registration
                </h3>

                <p className="text-sm text-gray-500">
                  Manage student registrations
                </p>
              </button>

              <button
                onClick={() =>
                  router.push("/payments")
                }
                className="rounded-xl border p-5 text-left transition hover:border-orange-500 hover:bg-orange-50"
              >
                <div className="mb-2 text-3xl">
                  💰
                </div>

                <h3 className="font-bold">
                  Manage Payments
                </h3>

                <p className="text-sm text-gray-500">
                  Manage registration payments
                </p>
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-4xl font-bold text-gray-800">
            {value}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${colors[color]}`}
        >
          {icon}
        </div>

      </div>
    </button>
  );
}