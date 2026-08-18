"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  studentId: string;
  studentName: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
}

interface Registration {
  registerId: string;
  studentId: string;
  subjectId: string;
  registerDate: string;
  status: string;
  academicYear: string;
  student?: Student;
  subject?: Subject;
}

const emptyForm = {
  registerId: "",
  studentId: "",
  subjectId: "",
  registerDate: "",
  status: "active",
  academicYear: "",
};

export default function RegistrationsPage() {
  const router = useRouter();

  const [registrations, setRegistrations] =
    useState<Registration[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

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

    fetchStudents();
    fetchSubjects();
    fetchRegistrations();
  }, [router]);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      const result = await res.json();

      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects");
      const result = await res.json();

      if (result.success) {
        setSubjects(result.data);
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
        ? `/api/registrations/${editingId}`
        : "/api/registrations";

      const method = editingId
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
          ? "ແກ້ໄຂ Registration ສຳເລັດ"
          : "ເພີ່ມ Registration ສຳເລັດ"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchRegistrations();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(
    registration: Registration
  ) {
    setEditingId(
      registration.registerId
    );

    setForm({
      registerId:
        registration.registerId,
      studentId:
        registration.studentId,
      subjectId:
        registration.subjectId,
      registerDate:
        registration.registerDate
          ? registration.registerDate.substring(
              0,
              10
            )
          : "",
      status:
        registration.status,
      academicYear:
        registration.academicYear,
    });

    setShowForm(true);
  }

  async function handleDelete(
    registerId: string
  ) {
    const confirmDelete = confirm(
      "ຕ້ອງການລຶບ Registration ນີ້ບໍ?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/registrations/${registerId}`,
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

      alert(
        "ລຶບ Registration ສຳເລັດ"
      );

      fetchRegistrations();
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

          <Nav text="🏠 Dashboard"
            onClick={() =>
              router.push("/dashboard")
            }
          />

          <Nav text="👨‍🎓 Students"
            onClick={() =>
              router.push("/students")
            }
          />

          <Nav text="📚 Subjects"
            onClick={() =>
              router.push("/subjects")
            }
          />

          <Nav
            text="📝 Registrations"
            active
            onClick={() =>
              router.push("/registrations")
            }
          />

          <Nav
            text="💰 Payments"
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
              Registration Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage student registrations
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
            + Add Registration
          </button>

        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Registration"
                : "Add Registration"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >

              <Input
                label="Register ID"
                name="registerId"
                value={form.registerId}
                onChange={handleChange}
                disabled={!!editingId}
                placeholder="REG001"
              />

              <div>
                <label className="mb-1 block font-medium">
                  Student
                </label>

                <select
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Student
                  </option>

                  {students.map(
                    (student) => (
                      <option
                        key={student.studentId}
                        value={student.studentId}
                      >
                        {student.studentId} -{" "}
                        {student.studentName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Subject
                </label>

                <select
                  name="subjectId"
                  value={form.subjectId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={subject.subjectId}
                        value={subject.subjectId}
                      >
                        {subject.subjectId} -{" "}
                        {subject.subjectName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <Input
                label="Register Date"
                name="registerDate"
                type="date"
                value={form.registerDate}
                onChange={handleChange}
              />

              <div>
                <label className="mb-1 block font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
          
                  <option value="Not yet paid">
                    Not yet paid
                  </option>

                  <option value="paid">
                    Paid
                  </option>
                </select>
              </div>

              <Input
                label="Academic Year"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="2026-2027"
              />

              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
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
                  className="rounded-xl bg-gray-500 px-6 py-3 font-semibold text-white"
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
              Registration List
            </h2>

            <p className="text-sm text-gray-500">
              {registrations.length} registrations
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-800 text-white">
                <tr>

                  <th className="px-4 py-4 text-left">
                    Register ID
                  </th>

                  <th className="px-4 py-4 text-left">
                    Student
                  </th>

                  <th className="px-4 py-4 text-left">
                    Subject
                  </th>

                  <th className="px-4 py-4 text-left">
                    Date
                  </th>

                  <th className="px-4 py-4 text-left">
                    Status
                  </th>

                  <th className="px-4 py-4 text-left">
                    Academic Year
                  </th>

                  <th className="px-4 py-4 text-center">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {registrations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-gray-500"
                    >
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  registrations.map(
                    (registration) => (
                      <tr
                        key={
                          registration.registerId
                        }
                        className="border-b transition hover:bg-blue-50"
                      >

                        <td className="px-4 py-4 font-semibold">
                          {
                            registration.registerId
                          }
                        </td>

                        <td className="px-4 py-4">
                          {registration.student
                            ? `${registration.student.studentId} - ${registration.student.studentName}`
                            : registration.studentId}
                        </td>

                        <td className="px-4 py-4">
                          {registration.subject
                            ? `${registration.subject.subjectId} - ${registration.subject.subjectName}`
                            : registration.subjectId}
                        </td>

                        <td className="px-4 py-4">
                          {registration.registerDate
                            ? new Date(
                                registration.registerDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              registration.status ===
                              "active"
                                ? "bg-green-100 text-green-700"
                                : registration.status ===
                                  "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {
                            registration.academicYear
                          }
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex justify-center gap-2">

                            <button
                              onClick={() =>
                                handleEdit(
                                  registration
                                )
                              }
                              className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  registration.registerId
                                )
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
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