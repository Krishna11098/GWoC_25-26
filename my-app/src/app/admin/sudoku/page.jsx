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
    const unsub = auth.onAuthStateChanged(user => {
      if (user) loadLevels();
      else {
        setLevels([]);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <p className="p-6">Loading sudoku levels...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin • Sudoku Control
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map(level => (
          <SudokuCard
            key={level.levelId}
            level={level}
            refresh={loadLevels}
          />
        ))}

        <AddSudokuCard onAdded={loadLevels} />
      </div>
    </div>
  );
}
