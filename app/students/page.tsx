"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Student {
  studentId: string;
  studentName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
}

const emptyForm = {
  studentId: "",
  studentName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  address: "",
};

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] =
    useState<Student[]>([]);

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
  }, [router]);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      const result = await res.json();

      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );
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
        ? `/api/students/${editingId}`
        : "/api/students";

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
          ? "ແກ້ໄຂ Student ສຳເລັດ"
          : "ເພີ່ມ Student ສຳເລັດ"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchStudents();
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(student: Student) {
    setEditingId(student.studentId);

    setForm({
      studentId: student.studentId,
      studentName: student.studentName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.substring(0, 10)
        : "",
      phoneNumber: student.phoneNumber,
      address: student.address,
    });

    setShowForm(true);
  }

  async function handleDelete(
    studentId: string
  ) {
    const confirmDelete = confirm(
      "ຕ້ອງການລຶບ Student ນີ້ບໍ?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/students/${studentId}`,
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

      alert("ລຶບ Student ສຳເລັດ");

      fetchStudents();
    } catch (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

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

        <nav className="mt-6 space-y-2 px-4">

          <NavButton
            text="🏠 Dashboard"
            onClick={() =>
              router.push("/dashboard")
            }
          />

          <NavButton
            text="👨‍🎓 Students"
            active
            onClick={() =>
              router.push("/students")
            }
          />

          <NavButton
            text="📚 Subjects"
            onClick={() =>
              router.push("/subjects")
            }
          />

          <NavButton
            text="📝 Registrations"
            onClick={() =>
              router.push("/registrations")
            }
          />

          <NavButton
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

      {/* Content */}
      <main className="ml-64 flex-1 p-8">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage student information
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
            + Add Student
          </button>

        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Student"
                : "Add Student"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >

              <Input
                label="Student ID"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                disabled={!!editingId}
                placeholder="0001"
              />

              <Input
                label="Student Name"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Student Name"
              />

              <div>
                <label className="mb-1 block font-medium">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>
                </select>
              </div>

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="020..."
              />

              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Vientiane"
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
              Student List
            </h2>

            <p className="text-sm text-gray-500">
              {students.length} students
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">ID</th>
                  <th className="px-4 py-4 text-left">Name</th>
                  <th className="px-4 py-4 text-left">Gender</th>
                  <th className="px-4 py-4 text-left">Date of Birth</th>
                  <th className="px-4 py-4 text-left">Phone</th>
                  <th className="px-4 py-4 text-left">Address</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>

                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b transition hover:bg-blue-50"
                    >

                      <td className="px-4 py-4 font-semibold">
                        {student.studentId}
                      </td>

                      <td className="px-4 py-4">
                        {student.studentName}
                      </td>

                      <td className="px-4 py-4">
                        {student.gender}
                      </td>

                      <td className="px-4 py-4">
                        {student.dateOfBirth
                          ? new Date(
                              student.dateOfBirth
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4">
                        {student.phoneNumber}
                      </td>

                      <td className="px-4 py-4">
                        {student.address}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(student)
                            }
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                student.studentId
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

function NavButton({
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
      className={`w-full rounded-xl px-4 py-3 text-left transition ${
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