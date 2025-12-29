"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  FaBan,
  FaCheck,
  FaTimes,
  FaEye,
  FaSearch,
  FaFilter,
  FaSort,
  FaUserSlash,
  FaUserCheck,
  FaExclamationTriangle,
  FaCalendar,
  FaEnvelope,
  FaCrown,
  FaShieldAlt,
} from "react-icons/fa";
import { useSettings } from "@/context/SettingsContext";

export default function AdminUsersPage() {
  const { settings } = useSettings();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);

  // Get auto-ban threshold from settings
  const autoBanThreshold = settings?.autoBanReportThreshold || 3;

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Fetch experiences
        const experiencesSnapshot = await getDocs(
          collection(db, "experiences")
        );
        const experiencesData = experiencesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExperiences(experiencesData);

        // 3. Fetch reports
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const reportsData = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);

        // 4. Calculate reports per user
        const userReportStats = {};

        // Count reports for each user
        reportsData.forEach((report) => {
          if (report.reporterId) {
            const userId = report.reporterId;
            if (!userReportStats[userId]) {
              userReportStats[userId] = {
                totalReports: 0,
                pendingReports: 0,
                reportDetails: [],
              };
            }
            userReportStats[userId].totalReports++;
            if (report.status === "pending") {
              userReportStats[userId].pendingReports++;
            }
            userReportStats[userId].reportDetails.push(report);
          }
        });

        // 5. Calculate experiences per user
        const userExperienceCount = {};
        experiencesData.forEach((exp) => {
          if (exp.userId) {
            userExperienceCount[exp.userId] =
              (userExperienceCount[exp.userId] || 0) + 1;
          }
        });

        // 6. Enhance users with all data
        const enhancedUsers = usersData.map((user) => {
          const userId = user.id;
          const userReports = userReportStats[userId] || {
            totalReports: 0,
            pendingReports: 0,
            reportDetails: [],
          };

          // Count reports where this user's experiences were reported
          const reportedExperiences = experiencesData.filter(
            (exp) =>
              exp.userId === userId && exp.reports && exp.reports.length > 0
          );

          const experienceReportCount = reportedExperiences.reduce(
            (total, exp) => total + (exp.reports?.length || 0),
            0
          );

          const totalReportsForUser =
            userReports.totalReports + experienceReportCount;
          const isAdmin =
            user.role === "admin" ||
            user.isAdmin === true ||
            user.email === "admin@joyjuncture.com";
          const isBanned = user.isBanned === true && !isAdmin; // Admins cannot be banned
          const reportsUntilBan = isAdmin
            ? Infinity
            : Math.max(0, autoBanThreshold - totalReportsForUser);
          const isNearBan =
            !isAdmin &&
            totalReportsForUser >= autoBanThreshold - 1 &&
            totalReportsForUser < autoBanThreshold;

          return {
            ...user,
            experienceCount: userExperienceCount[userId] || 0,
            reportsCount: totalReportsForUser,
            pendingReportsCount: userReports.pendingReports,
            reports: userReports.reportDetails,
            isAdmin,
            isBanned: isBanned, // Force false for admins
            reportsUntilBan,
            isNearBan,
            lastActive: user.lastActive || user.createdAt || serverTimestamp(),
            createdAt: user.createdAt || serverTimestamp(),
          };
        });

        // 7. Check for auto-ban (excluding admins)
        await checkAndAutoBanUsers(enhancedUsers, autoBanThreshold);

        // 8. Update state
        setUsers(enhancedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [autoBanThreshold]);

  // Auto-ban function - SKIPS ADMINS
  const checkAndAutoBanUsers = async (users, threshold) => {
    try {
      const usersToAutoBan = users.filter(
        (user) =>
          !user.isAdmin && !user.isBanned && user.reportsCount >= threshold
      );

      for (const user of usersToAutoBan) {
        await autoBanUser(user.id);
      }

      if (usersToAutoBan.length > 0) {
        console.log(`Auto-banned ${usersToAutoBan.length} users`);
      }
    } catch (error) {
      console.error("Error in auto-ban check:", error);
    }
  };

  const autoBanUser = async (userId) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (user?.isAdmin) {
        console.log("Skipping auto-ban for admin user:", userId);
        return;
      }

      const batch = writeBatch(db);

      // Update user document
      const userRef = doc(db, "users", userId);
      batch.update(userRef, {
        isBanned: true,
        bannedAt: serverTimestamp(),
        banReason: `Auto-banned: Reached ${autoBanThreshold} reports threshold`,
        bannedBy: "system",
      });

      // Hide all experiences by this user
      const userExperiences = await getDocs(
        query(collection(db, "experiences"), where("userId", "==", userId))
      );

      userExperiences.docs.forEach((expDoc) => {
        const expRef = doc(db, "experiences", expDoc.id);
        batch.update(expRef, {
          isHidden: true,
          hiddenAt: serverTimestamp(),
          hiddenReason: "User auto-banned due to multiple reports",
        });
      });

      // Update all reports for this user
      const userReports = await getDocs(
        query(collection(db, "reports"), where("reporterId", "==", userId))
      );

      userReports.docs.forEach((reportDoc) => {
        const reportRef = doc(db, "reports", reportDoc.id);
        batch.update(reportRef, {
          status: "resolved",
          resolvedAt: serverTimestamp(),
          resolution: "User auto-banned",
        });
      });

      await batch.commit();

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isBanned: true, reportsUntilBan: 0, isNearBan: false }
            : u
        )
      );
    } catch (error) {
      console.error("Error auto-banning user:", error);
    }
  };

  // Admin function to ban/unban any user - PREVENTS BANNING ADMINS
  const handleBanUser = async (
    userId,
    ban = true,
    reason = "Manual ban by admin"
  ) => {
    const user = users.find((u) => u.id === userId);

    // Prevent banning admins
    if (ban && user?.isAdmin) {
      alert("Cannot ban an admin user. Remove admin privileges first.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${ban ? "ban" : "unban"} this user?`
      )
    ) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const adminId = auth.currentUser?.uid;
      const adminEmail = auth.currentUser?.email;

      // Update user
      const userRef = doc(db, "users", userId);
      batch.update(userRef, {
        isBanned: ban,
        bannedAt: ban ? serverTimestamp() : null,
        banReason: ban ? reason : null,
        bannedBy: ban ? adminId : null,
        bannedByEmail: ban ? adminEmail : null,
      });

      // Update experiences
      const userExperiences = await getDocs(
        query(collection(db, "experiences"), where("userId", "==", userId))
      );

      userExperiences.docs.forEach((expDoc) => {
        const expRef = doc(db, "experiences", expDoc.id);
        batch.update(expRef, {
          isHidden: ban,
          hiddenAt: ban ? serverTimestamp() : null,
          hiddenReason: ban
            ? `User ${ban ? "banned" : "unbanned"} by admin`
            : null,
        });
      });

      // If banning, resolve all reports by this user
      if (ban) {
        const userReports = await getDocs(
          query(collection(db, "reports"), where("reporterId", "==", userId))
        );

        userReports.docs.forEach((reportDoc) => {
          const reportRef = doc(db, "reports", reportDoc.id);
          batch.update(reportRef, {
            status: "resolved",
            resolvedAt: serverTimestamp(),
            resolution: "User banned by admin",
          });
        });
      }

      await batch.commit();

      // Update user in state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isBanned: ban,
                reportsUntilBan: ban
                  ? 0
                  : Math.max(0, autoBanThreshold - user.reportsCount),
                isNearBan: ban
                  ? false
                  : user.reportsCount >= autoBanThreshold - 1,
              }
            : user
        )
      );

      alert(`User ${ban ? "banned" : "unbanned"} successfully`);
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Error updating user status: " + error.message);
    }
  };

  // Make user admin - ALSO UNBANS THEM IF THEY WERE BANNED
  const handleMakeAdmin = async (userId, makeAdmin = true) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          makeAdmin ? "make" : "remove"
        } this user as admin?`
      )
    ) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);

      if (makeAdmin) {
        // When making admin: set role to admin AND unban them
        batch.update(userRef, {
          role: "admin",
          isAdmin: true,
          isBanned: false, // Unban when making admin
          bannedAt: null,
          banReason: null,
          bannedBy: null,
          updatedAt: serverTimestamp(),
        });

        // Also unban all their experiences
        const userExperiences = await getDocs(
          query(collection(db, "experiences"), where("userId", "==", userId))
        );

        userExperiences.docs.forEach((expDoc) => {
          const expRef = doc(db, "experiences", expDoc.id);
          batch.update(expRef, {
            isHidden: false,
            hiddenAt: null,
            hiddenReason: null,
          });
        });
      } else {
        // When removing admin: set role to user
        batch.update(userRef, {
          role: "user",
          isAdmin: false,
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                isAdmin: makeAdmin,
                isBanned: makeAdmin ? false : user.isBanned, // Unban when making admin
              }
            : user
        )
      );

      alert(
        `User ${
          makeAdmin ? "made admin and unbanned" : "removed from admin"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role");
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((user) => {
      // Status filter
      if (statusFilter === "banned") return user.isBanned;
      if (statusFilter === "reported") return user.reportsCount > 0;
      if (statusFilter === "active")
        return !user.isBanned && user.reportsCount === 0;
      if (statusFilter === "admins") return user.isAdmin;
      if (statusFilter === "nearBan")
        return user.isNearBan && !user.isBanned && !user.isAdmin;
      return true;
    })
    .sort((a, b) => {
      // Sort filter
      switch (sortBy) {
        case "recent":
          return b.lastActive?.toDate() - a.lastActive?.toDate();
        case "oldest":
          return a.lastActive?.toDate() - b.lastActive?.toDate();
        case "most-reports":
          return b.reportsCount - a.reportsCount;
        case "most-experiences":
          return b.experienceCount - a.experienceCount;
        case "name":
          return (a.name || a.email).localeCompare(b.name || b.email);
        default:
          return 0;
      }
    });

  // Statistics
  const stats = {
    totalUsers: users.length,
    bannedUsers: users.filter((u) => u.isBanned).length,
    reportedUsers: users.filter((u) => u.reportsCount > 0).length,
    activeUsers: users.filter((u) => !u.isBanned && u.reportsCount === 0)
      .length,
    adminUsers: users.filter((u) => u.isAdmin).length,
    totalReports: reports.length,
    pendingReports: reports.filter((r) => r.status === "pending").length,
    autoBannedUsers: users.filter((u) => u.banReason?.includes("Auto-banned"))
      .length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage users, review reports, and moderate content
          </p>

          {/* Admin protection info */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">
                  ⚡ Admin Protection Active
                </p>
                <p className="text-xs text-purple-600">
                  Admin users cannot be banned or auto-banned, regardless of
                  reports
                </p>
              </div>
            </div>
          </div>

          {/* Auto-ban threshold info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Auto-ban Threshold: {autoBanThreshold} reports
                </p>
                <p className="text-xs text-blue-600">
                  Regular users with {autoBanThreshold}+ reports will be
                  automatically banned
                  {stats.autoBannedUsers > 0 &&
                    ` • ${stats.autoBannedUsers} users auto-banned`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Updated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Reported Users</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.reportedUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Banned Users</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.bannedUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Admin Users</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.adminUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Pending Reports</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.pendingReports}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="reported">Reported Users</option>
                  <option value="banned">Banned Users</option>
                  <option value="admins">Admins</option>
                  <option value="nearBan">
                    Near Ban ({autoBanThreshold - 1}+ reports)
                  </option>
                </select>
              </div>

              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-reports">Most Reports</option>
                  <option value="most-experiences">Most Experiences</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            user.isBanned
                              ? "bg-red-100 text-red-600"
                              : user.isAdmin
                              ? "bg-purple-100 text-purple-600"
                              : user.reportsCount > 0
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {user.isAdmin ? (
                            <FaCrown />
                          ) : user.isBanned ? (
                            <FaUserSlash />
                          ) : (
                            <FaUserCheck />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {user.name || "No Name"}
                            </p>
                            {user.isAdmin && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                                <FaShieldAlt size={10} /> Admin
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FaEnvelope size={12} /> {user.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Joined:{" "}
                            {user.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Statistics */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Experiences:
                          </span>
                          <span className="font-medium">
                            {user.experienceCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Last Active:
                          </span>
                          <span className="text-sm text-gray-500">
                            {user.lastActive?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Reports - Admin protection notice */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Total Reports:
                          </span>
                          <span
                            className={`font-medium ${
                              user.isAdmin
                                ? "text-purple-600"
                                : user.reportsCount >= autoBanThreshold
                                ? "text-red-600 font-bold"
                                : user.reportsCount > 0
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {user.reportsCount}{" "}
                            {user.isAdmin ? "∞" : `/ ${autoBanThreshold}`}
                          </span>
                        </div>

                        {user.isAdmin ? (
                          <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                            <p className="text-xs text-purple-700 flex items-center gap-1">
                              <FaShieldAlt size={10} />
                              Admin protected - cannot be banned
                            </p>
                          </div>
                        ) : user.reportsCount > 0 && !user.isBanned ? (
                          <div>
                            <div
                              className={`text-xs px-2 py-1 rounded ${
                                user.reportsCount >= autoBanThreshold
                                  ? "bg-red-100 text-red-700"
                                  : user.isNearBan
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.reportsCount >= autoBanThreshold
                                ? "⚠️ Will be auto-banned"
                                : `${user.reportsUntilBan} more report${
                                    user.reportsUntilBan !== 1 ? "s" : ""
                                  } until auto-ban`}
                            </div>
                          </div>
                        ) : null}

                        {user.reportsCount > 0 && (
                          <div>
                            <button
                              onClick={() => {
                                // Show detailed reports
                                alert(
                                  `Reports for ${
                                    user.name || user.email
                                  }:\n\n` +
                                    `Total Reports: ${user.reportsCount}\n` +
                                    (user.isAdmin
                                      ? "⚡ ADMIN PROTECTED - Cannot be banned\n"
                                      : "") +
                                    (user.reports.length > 0
                                      ? `Report Details:\n${user.reports
                                          .map(
                                            (r, i) =>
                                              `${i + 1}. ${
                                                r.experienceTitle || "Unknown"
                                              } - ${r.status}\n   ${r.reportedAt
                                                ?.toDate()
                                                .toLocaleDateString()}`
                                          )
                                          .join("\n")}`
                                      : "No detailed reports found")
                                );
                              }}
                              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                              <FaEye size={12} /> View Report Details
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin
                              ? "bg-purple-100 text-purple-800"
                              : user.isBanned
                              ? user.banReason?.includes("Auto-banned")
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                              : user.reportsCount >= autoBanThreshold
                              ? "bg-red-100 text-red-800"
                              : user.reportsCount > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.isAdmin ? (
                            <>
                              <FaShieldAlt /> Admin Protected
                            </>
                          ) : user.isBanned ? (
                            <>
                              <FaBan />
                              {user.banReason?.includes("Auto-banned")
                                ? "Auto-banned"
                                : "Banned"}
                            </>
                          ) : user.reportsCount >= autoBanThreshold ? (
                            <>
                              <FaExclamationTriangle /> Will Auto-ban
                            </>
                          ) : user.reportsCount > 0 ? (
                            <>
                              <FaExclamationTriangle /> Reported
                            </>
                          ) : (
                            <>
                              <FaCheck /> Active
                            </>
                          )}
                        </span>
                        {user.isAdmin && (
                          <span className="text-xs text-purple-600">
                            ⚡ Immune to bans
                          </span>
                        )}
                        {!user.isAdmin &&
                          user.reportsCount > 0 &&
                          !user.isBanned && (
                            <span className="text-xs text-gray-500">
                              Auto-ban at {autoBanThreshold} reports
                            </span>
                          )}
                        {user.banReason?.includes("Auto-banned") && (
                          <span className="text-xs text-orange-600">
                            Auto-banned by system
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Admin Actions - Enhanced with admin protection */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {user.isAdmin ? (
                            <div className="p-2 bg-purple-50 rounded border border-purple-200">
                              <p className="text-xs text-purple-700">
                                ⚡ Admin protected
                              </p>
                            </div>
                          ) : !user.isBanned ? (
                            <button
                              onClick={() => handleBanUser(user.id, true)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                            >
                              <FaBan /> Ban User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBanUser(user.id, false)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                            >
                              <FaCheck /> Unban User
                            </button>
                          )}

                          {!user.isAdmin ? (
                            <button
                              onClick={() => handleMakeAdmin(user.id, true)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
                            >
                              <FaCrown /> Make Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMakeAdmin(user.id, false)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm"
                            >
                              <FaTimes /> Remove Admin
                            </button>
                          )}
                        </div>

                        {!user.isAdmin &&
                          user.reportsCount >= autoBanThreshold - 1 &&
                          !user.isBanned && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Force auto-ban ${
                                      user.name || user.email
                                    } now?`
                                  )
                                ) {
                                  autoBanUser(user.id);
                                }
                              }}
                              className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 flex items-center gap-1"
                            >
                              <FaTimes /> Force Auto-ban Now
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No users have posted experiences yet"}
              </p>
            </div>
          )}

          {/* Summary */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredUsers.length} of {users.length} users
                {searchTerm && ` matching "${searchTerm}"`} •
                {` ${stats.adminUsers} admin${
                  stats.adminUsers !== 1 ? "s" : ""
                } protected`}{" "}
                • Auto-ban threshold: {autoBanThreshold} reports (admins exempt)
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const usersToBan = users.filter(
                  (u) =>
                    !u.isAdmin &&
                    u.reportsCount >= autoBanThreshold &&
                    !u.isBanned
                );
                if (usersToBan.length > 0) {
                  if (
                    window.confirm(
                      `Auto-ban ${usersToBan.length} non-admin users with ${autoBanThreshold}+ reports?\n\nAdmins will be skipped.`
                    )
                  ) {
                    usersToBan.forEach((user) => autoBanUser(user.id));
                  }
                } else {
                  alert(
                    `No non-admin users meet the auto-ban criteria (${autoBanThreshold}+ reports)`
                  );
                }
              }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaBan className="text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-red-700">
                    Auto-ban Violators
                  </p>
                  <p className="text-sm text-red-600">
                    Ban non-admin users with {autoBanThreshold}+ reports
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                const pendingReports = reports.filter(
                  (r) => r.status === "pending"
                );
                if (pendingReports.length > 0) {
                  window.open("/admin/reports", "_blank");
                } else {
                  alert("No pending reports");
                }
              }}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaExclamationTriangle className="text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-yellow-700">
                    Review Reports
                  </p>
                  <p className="text-sm text-yellow-600">
                    {stats.pendingReports} pending
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                const adminsToDemote = users.filter(
                  (u) => u.isAdmin && u.email !== auth.currentUser?.email
                );
                if (adminsToDemote.length > 0) {
                  alert(
                    `${
                      adminsToDemote.length
                    } other admin users found:\n${adminsToDemote
                      .map((a) => `• ${a.name || a.email}`)
                      .join("\n")}`
                  );
                } else {
                  alert("No other admin users found");
                }
              }}
              className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaShieldAlt className="text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-purple-700">
                    View Other Admins
                  </p>
                  <p className="text-sm text-purple-600">
                    {stats.adminUsers - 1} other admin
                    {stats.adminUsers - 1 !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
