// "use client";

// import { useEffect, useState } from "react";
// import SudokuCard from "@/components/SudokuCard";
// import AddSudokuCard from "@/components/AddSudokuCard";

// export default function AdminSudokuPage() {
//   const [levels, setLevels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function loadLevels() {
//     const res = await fetch("/api/admin/sudoku/levels");
//     const data = await res.json();
//     setLevels(data.levels);
//     setLoading(false);
//   }

//   useEffect(() => {
//     loadLevels();
//   }, []);

//   if (loading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Admin • Sudoku Control
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {levels.map(level => (
//           <SudokuCard
//             key={level.levelId}
//             level={level}
//             refresh={loadLevels}
//           />
//         ))}

//         <AddSudokuCard onAdded={loadLevels} />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient"; // 🔴 make sure this exists
import SudokuCard from "@/components/SudokuCard";
import AddSudokuCard from "@/components/AddSudokuCard";

export default function AdminSudokuPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadLevels() {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("Not authenticated");
        setLevels([]);
        return;
      }
      console.log("Current user:", user);

      const token = await user.getIdToken();

      const res = await fetch("/api/admin/sudoku/levels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🛡️ Absolute safety
      if (!res.ok || !Array.isArray(data)) {
        setLevels([]);
        setError(data?.error || "Failed to load levels");
        return;
      }

      setLevels(data);
    } catch (err) {
      console.error(err);
      setLevels([]);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) loadLevels();
      else {
        setLevels([]);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderBottomColor: "var(--dark-teal)" }}
          ></div>
          <p className="mt-4 text-dark-teal">Loading sudoku levels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--light-orange)",
            color: "var(--dark-teal)",
          }}
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: "var(--dark-teal)" }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-dark-teal">
              Sudoku Management
            </h1>
            <p className="text-dark-teal mt-1">Manage sudoku levels</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((level) => (
          <SudokuCard key={level.levelId} level={level} refresh={loadLevels} />
        ))}

        <AddSudokuCard onAdded={loadLevels} />
      </div>
    </div>
  );
}
