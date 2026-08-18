"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Subject {
  subjectId: string;
  subjectName: string;
  semester: string;
  credit: number;
  instructor: string;
}

const emptyForm = {
  subjectId: "",
  subjectName: "",
  semester: "",
  credit: "",
  instructor: "",
};

export default function SubjectsPage() {
  const router = useRouter();

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

    fetchSubjects();
  }, [router]);

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/subjects");
      const result = await res.json();

      if (result.success) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error(
        "FETCH SUBJECTS ERROR:",
        error
      );
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
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
        ? `/api/subjects/${editingId}`
        : "/api/subjects";

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
          credit: Number(form.credit),
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
          ? "ແກ້ໄຂ Subject ສຳເລັດ"
          : "ເພີ່ມ Subject ສຳເລັດ"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchSubjects();
    } catch (error) {
      console.error(
        "SUBMIT SUBJECT ERROR:",
        error
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(subject: Subject) {
    setEditingId(subject.subjectId);

    setForm({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      semester: subject.semester,
      credit: String(subject.credit),
      instructor: subject.instructor,
    });

    setShowForm(true);
  }

  async function handleDelete(
    subjectId: string
  ) {
    const confirmDelete = confirm(
      "ຕ້ອງການລຶບ Subject ນີ້ບໍ?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/subjects/${subjectId}`,
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

      alert("ລຶບ Subject ສຳເລັດ");

      fetchSubjects();
    } catch (error) {
      console.error(
        "DELETE SUBJECT ERROR:",
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
            active
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
              Subject Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage subject information
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
            + Add Subject
          </button>

        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow">

            <h2 className="mb-5 text-xl font-bold">
              {editingId
                ? "Edit Subject"
                : "Add Subject"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >

              <Input
                label="Subject ID"
                name="subjectId"
                value={form.subjectId}
                onChange={handleChange}
                disabled={!!editingId}
                placeholder="SUB001"
              />

              <Input
                label="Subject Name"
                name="subjectName"
                value={form.subjectName}
                onChange={handleChange}
                placeholder="Database"
              />

              <Input
                label="Semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                placeholder="Semester 1"
              />

              <Input
                label="Credit"
                name="credit"
                type="number"
                value={form.credit}
                onChange={handleChange}
                placeholder="3"
              />

              <Input
                label="Instructor"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                placeholder="Teacher Name"
              />

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
              Subject List
            </h2>

            <p className="text-sm text-gray-500">
              {subjects.length} subjects
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-800 text-white">
                <tr>

                  <th className="px-4 py-4 text-left">
                    ID
                  </th>

                  <th className="px-4 py-4 text-left">
                    Subject Name
                  </th>

                  <th className="px-4 py-4 text-left">
                    Semester
                  </th>

                  <th className="px-4 py-4 text-left">
                    Credit
                  </th>

                  <th className="px-4 py-4 text-left">
                    Instructor
                  </th>

                  <th className="px-4 py-4 text-center">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {subjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-gray-500"
                    >
                      No subjects found
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr
                      key={subject.subjectId}
                      className="border-b transition hover:bg-blue-50"
                    >

                      <td className="px-4 py-4 font-semibold">
                        {subject.subjectId}
                      </td>

                      <td className="px-4 py-4">
                        {subject.subjectName}
                      </td>

                      <td className="px-4 py-4">
                        {subject.semester}
                      </td>

                      <td className="px-4 py-4">
                        {subject.credit}
                      </td>

                      <td className="px-4 py-4">
                        {subject.instructor}
                      </td>

                      <td className="px-4 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(subject)
                            }
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                subject.subjectId
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