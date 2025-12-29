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
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Reported Experiences
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Report ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reporter
              </th>
              <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {report.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() =>
                      window.open(
                        `/experiences/${report.experienceId}`,
                        "_blank"
                      )
                    }
                    className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                  >
                    <FaEye /> View Experience
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {report.reporterId?.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {report.reportedAt?.toDate().toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "approved"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleResolve(report.id, "approved")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                        >
                          <FaCheck /> Remove
                        </button>
                        <button
                          onClick={() => handleResolve(report.id, "rejected")}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
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
          <div className="text-center py-12">
            <p className="text-gray-500">No reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
