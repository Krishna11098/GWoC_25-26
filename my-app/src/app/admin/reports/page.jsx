"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { FaCheck, FaTimes, FaEye, FaTrash } from "react-icons/fa";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("reportedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
    });
    return () => unsubscribe();
  }, []);

  const handleResolve = async (reportId, action) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: action,
        resolvedAt: new Date(),
      });

      if (action === "approved") {
        // Optionally delete the reported experience
        const report = reports.find((r) => r.id === reportId);
        if (report?.experienceId) {
          // await deleteDoc(doc(db, 'experiences', report.experienceId));
        }
      }
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 font-winky-rough">
      <div className="mb-8 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-foreground/20 shadow-sm">
        <h1 className="text-3xl font-bold text-background drop-shadow-sm mb-2">
          Reported Experiences
        </h1>
        <p className="text-font font-medium">Manage and review user reports</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden border border-foreground/10">
        <table className="w-full">
          <thead className="bg-foreground/5 text-font">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Report ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-foreground/5 transition-colors group">
                <td className="px-6 py-4 text-sm font-bold text-background-2 font-mono">
                  {report.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-font">
                  <button
                    onClick={() =>
                      window.open(
                        `/experiences/${report.experienceId}`,
                        "_blank"
                      )
                    }
                    className="text-background hover:text-orange font-bold flex items-center gap-2 transition-colors"
                  >
                    <FaEye /> View Experience
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-font font-medium">
                  {report.reporterId?.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-font opacity-80">
                  {report.reportedAt?.toDate().toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      report.status === "pending"
                        ? "bg-orange/20 text-background-2 border-orange/30"
                        : report.status === "approved"
                        ? "bg-pink/20 text-red-800 border-pink/30"
                        : "bg-green/20 text-background-2 border-green/30"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleResolve(report.id, "approved")}
                          className="px-3 py-1.5 bg-pink/20 text-red-800 rounded-lg hover:bg-pink border border-pink/30 flex items-center gap-2 font-bold transition-colors text-xs"
                        >
                          <FaCheck /> Remove
                        </button>
                        <button
                          onClick={() => handleResolve(report.id, "rejected")}
                          className="px-3 py-1.5 bg-foreground/10 text-font rounded-lg hover:bg-foreground/20 border border-foreground/20 flex items-center gap-2 font-bold transition-colors text-xs"
                        >
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-50">📝</div>
            <p className="text-font/60 font-medium">No reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
