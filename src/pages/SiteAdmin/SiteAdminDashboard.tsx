"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, DialogPanel, DialogTitle } from "@headlessui/react";
import { Users } from "lucide-react";
import { useAddCourseAdministratorMutation, useGetCourseAdministratorsQuery, useUpdateCourseAdministratorMutation, useDeleteCourseAdministratorMutation, useGetSystemMetricsQuery } from "../../utils/api";

// Mock dashboard data
const mockDashboardData = {
  totalUsers: 1250,
  activeCourses: 94,
  newRegistrationsThisMonth: 36,
  pendingApprovals: 8,
  cpuUsage: 65,
  ramUsage: 78,
  diskUsage: 45,
  activeConnections: 342
};

const SiteAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for add user form visibility
  const { data: courseAdmins } = useGetCourseAdministratorsQuery()
  // local mutable admins array
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    if (!courseAdmins?.cAdmins) return;
    setAdmins(courseAdmins.cAdmins);
  }, [courseAdmins]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });
  // Headless UI modal states
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null); // view
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null); // edit
  const [adminToDelete, setAdminToDelete] = useState<any | null>(null); // delete
  const [modalMessage, setModalMessage] = useState<string>("");
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });

  const validateForm = () => {
    let errors = {
      fullName: "",
      email: "",
      contactNumber: "",
      nationalId: "",
      residentialAddress: "",
      gender: "",
    };
    let valid = true;
  
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required.";
      valid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      errors.email = "Invalid email address.";
      valid = false;
    }
    if (formData.contactNumber && !/^\d{10,15}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Contact Number should be 10-15 digits.";
      valid = false;
    }
    if (formData.nationalId && formData.nationalId.length < 5) {
      errors.nationalId = "National ID is too short.";
      valid = false;
    }
    if (formData.residentialAddress && formData.residentialAddress.length < 5) {
      errors.residentialAddress = "Address is too short.";
      valid = false;
    }
    if (!formData.gender) {
      errors.gender = "Gender is required.";
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  const [addCourseAdmin, { isLoading, error }] = useAddCourseAdministratorMutation()
  const [updateCourseAdministrator, { isLoading: updating }] = useUpdateCourseAdministratorMutation()
  // new: delete mutation hook
  const [deleteCourseAdministrator, { isLoading: deleting }] = useDeleteCourseAdministratorMutation()

  // Mock API responses (assuming these are static for this example)
  //const dashboardData = mockDashboardData;
  const usersLoading = false;
  //const dashboardLoading = false;

  // Add this hook
  const { 
    data: systemMetrics, 
    isLoading: metricsLoading, 
    error: metricsError,
    refetch: refetchMetrics 
  } = useGetSystemMetricsQuery(undefined, {
    pollingInterval: activeTab === "dashboard" ? 30000 : 0, // Poll every 30s when on dashboard
    skip: activeTab !== "dashboard" // Skip when not on dashboard tab
  });

  // Use real data when available, fallback to mock
  const dashboardData = systemMetrics ? {
    ...mockDashboardData,
    cpuUsage: systemMetrics.cpuUsage,
    ramUsage: systemMetrics.ramUsage,
    diskUsage: systemMetrics.diskUsage,
    activeConnections: systemMetrics.activeConnections
  } : mockDashboardData;

  // Update the dashboardLoading variable
  const dashboardLoading = metricsLoading;

  const handleAddUserClick = () => {
    setShowAddUserForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUserForm(false);
  };

  const handleSaveNewUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await addCourseAdmin({
        fullName: formData.fullName,
        email: formData.email,
        password: "defaultPassword", // Default password or prompt user to set one
        contactNumber: formData.contactNumber,
        nationalId: formData.nationalId,
        residentialAddress: formData.residentialAddress,
        gender: formData.gender
      }).unwrap()

      console.log(response);

    } catch (error) {
      console.error("Error adding new user:", error);
      return;
    }

    console.log("New user data submitted!");
    console.log(formData);
    setShowAddUserForm(false); // Close form after submission
  };

  // Get logged-in user from localStorage
  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const loggedInUser = userData ? JSON.parse(userData) : null;

  // Add state for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter course administrators based on search and status (use local admins state)
  const filteredAdmins = admins
    ? admins.filter((user) => {
        // Search by name or email
        const matchesSearch =
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        // Status filter (backend statuses: active, suspended, deactivated, deleted)
        const userStatus = user.status || "active";
        const matchesStatus = statusFilter === "all" || userStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];
  // --- modal handlers ---
  const handleViewAdmin = (admin: any) => setSelectedAdmin(admin);
  const handleCloseViewAdmin = () => setSelectedAdmin(null);

  const handleEditAdminClick = (admin: any) => {
    // ensure editingAdmin has accountStatus (backend expects accountStatus in update payload)
    setEditingAdmin({ ...admin, accountStatus: admin.status || "active" });
    // clear previous form errors when opening edit modal
    setFormErrors({ fullName: "", email: "", contactNumber: "", nationalId: "", residentialAddress: "", gender: "" });
  };
  const handleCloseEditAdmin = () => setEditingAdmin(null);
  const handleSaveEditedAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    // validate editingAdmin
    const errors = {
      fullName: "",
      email: "",
      contactNumber: "",
      nationalId: "",
      residentialAddress: "",
      gender: "",
    };
    let valid = true;
    if (!editingAdmin.fullName || !editingAdmin.fullName.trim()) { errors.fullName = "Full name is required."; valid = false; }
    if (!editingAdmin.email || !editingAdmin.email.trim()) { errors.email = "Email is required."; valid = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editingAdmin.email)) { errors.email = "Invalid email address."; valid = false; }
    if (editingAdmin.contactNumber && !/^\d{10,15}$/.test(editingAdmin.contactNumber)) { errors.contactNumber = "Contact Number should be 10-15 digits."; valid = false; }
    // optional checks for nationalId/address
    if (editingAdmin.nationalId && editingAdmin.nationalId.length < 5) { errors.nationalId = "National ID is too short."; valid = false; }
    if (editingAdmin.residentialAddress && editingAdmin.residentialAddress.length < 5) { errors.residentialAddress = "Address is too short."; valid = false; }
    setFormErrors(errors);
    if (!valid) return;
 
     // Build payload for backend (IAddCourseAdministratorRequest shape for updates)
     const payload: any = {
       fullName: editingAdmin.fullName,
       email: editingAdmin.email,
       contactNumber: editingAdmin.contactNumber,
       nationalId: editingAdmin.nationalId,
       residentialAddress: editingAdmin.residentialAddress,
       gender: editingAdmin.gender,
       // include accountStatus key expected by backend
       accountStatus: editingAdmin.accountStatus,
     };

    try {
      const response = await updateCourseAdministrator({
        cAdminId: editingAdmin.id,
        cAdmin: payload,
      }).unwrap();

      // update local admins list from server response
      const updated = response.cAdmin;
      setAdmins(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      setModalMessage("Administrator updated successfully.");
      setEditingAdmin(null);
    } catch (err) {
      console.error("Failed to update administrator:", err);
      setModalMessage("Failed to update administrator.");
    }
  };

  const handleDeleteAdminClick = (admin: any) => setAdminToDelete(admin);
  const handleConfirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      // call backend to delete
      await deleteCourseAdministrator(adminToDelete.id).unwrap();
      // remove locally on success
      setAdmins(prev => prev.filter(a => a.id !== adminToDelete.id));
      setModalMessage(`Administrator "${adminToDelete.fullName}" deleted.`);
    } catch (err) {
      console.error("Failed to delete administrator:", err);
      setModalMessage("Failed to delete administrator.");
    } finally {
      setAdminToDelete(null);
    }
  };
  const handleCloseDeleteAdmin = () => setAdminToDelete(null);
  const handleModalClose = () => setModalMessage("");

  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (

    <div className="w-full px-4 sm:px-6 lg:px-62 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-900 mb-2">Site Administrator Dashboard</h1>
        <p className="text-gray-600">Manage course administrators, and platform settings</p>
      </div>

      <div className="w-full">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2 text-center">
            Welcome back, {loggedInUser?.fullName || "System Administrator"}!
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === "dashboard"
                  ? "border-cyan-700 text-cyan-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-lg ${activeTab === "users"
                  ? "border-cyan-700 text-cyan-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Course Administrator Management
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* CPU Usage Card */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex-shrink-0">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r="26" stroke="#8b5cf6" strokeWidth="5" fill="none"
                          strokeDasharray={`${(dashboardData.cpuUsage / 100) * 163.4} 163.4`} 
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-purple-600">
                        {dashboardData.cpuUsage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right min-w-0 flex-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 truncate">{dashboardData.cpuUsage}%</p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">CPU Usage</p>
                    {metricsError && (
                      <p className="text-xs text-red-500">Live data unavailable</p>
                    )}
                  </div>
                </div>
              </div>

              {/* RAM Usage Card */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex-shrink-0">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r="26" stroke="#f97316" strokeWidth="5" fill="none"
                          strokeDasharray={`${(dashboardData.ramUsage / 100) * 163.4} 163.4`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-orange-600">
                        {dashboardData.ramUsage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right min-w-0 flex-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 truncate">{dashboardData.ramUsage}%</p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">RAM Usage</p>
                    {metricsError && (
                      <p className="text-xs text-red-500">Live data unavailable</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Disk Usage Card */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-cyan-100 rounded-full flex-shrink-0">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r="26" stroke="#06b6d4" strokeWidth="5" fill="none"
                          strokeDasharray={`${(dashboardData.diskUsage / 100) * 163.4} 163.4`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-cyan-600">
                        {dashboardData.diskUsage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right min-w-0 flex-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 truncate">{dashboardData.diskUsage}%</p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">Disk Usage</p>
                    {metricsError && (
                      <p className="text-xs text-red-500">Live data unavailable</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Connections Card */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex-shrink-0">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="5" fill="none"
                          strokeDasharray={`${(dashboardData.activeConnections / 500) * 163.4} 163.4`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-indigo-600">
                        {Math.round((dashboardData.activeConnections / 500) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right min-w-0 flex-1">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 truncate">{dashboardData.activeConnections}</p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">Active Connections</p>
                    {metricsError && (
                      <p className="text-xs text-red-500">Live data unavailable</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Add a refresh button and debug info */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                {systemMetrics && (
                  <p className="text-sm text-green-600">✓ Real-time data loaded</p>
                )}
                {metricsError && (
                  <p className="text-sm text-red-600">⚠ Using fallback data</p>
                )}
              </div>
              <button
                onClick={() => refetchMetrics()}
                disabled={metricsLoading}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {metricsLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Activity Report</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Registrations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Courses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                    <span className="text-gray-600">Active Users</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-around h-64 space-x-8">
                {/* January */}
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-end justify-center space-x-2 h-48 w-full">
                    <div className="w-8 bg-cyan-500 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-8 bg-orange-500 rounded-t" style={{height: '80%'}}></div>
                    <div className="w-8 bg-indigo-600 rounded-t" style={{height: '55%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">January</p>
                </div>
                
                {/* February */}
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-end justify-center space-x-2 h-48 w-full">
                    <div className="w-8 bg-cyan-500 rounded-t" style={{height: '95%'}}></div>
                    <div className="w-8 bg-orange-500 rounded-t" style={{height: '70%'}}></div>
                    <div className="w-8 bg-indigo-600 rounded-t" style={{height: '50%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">February</p>
                </div>
                
                {/* March */}
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-end justify-center space-x-2 h-48 w-full">
                    <div className="w-8 bg-cyan-500 rounded-t" style={{height: '75%'}}></div>
                    <div className="w-8 bg-orange-500 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-8 bg-indigo-600 rounded-t" style={{height: '90%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">March</p>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>10k</span>
                <span>20k</span>
                <span>30k</span>
                <span>40k</span>
                <span>50k</span>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header with Title and Add Button - Only show when form is not open */}
            {!showAddUserForm && (
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Course Administrator Management</h3>
                <button
                  onClick={handleAddUserClick}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
                >
                  Add New Course Administrator
                </button>
              </div>
            )}

            {/* Search and Filter Row - Only show when form is not open */}
            {!showAddUserForm && (
              <div className="flex items-center space-x-4 mb-6">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Filter by Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
            )}

            {/* ✅ Headless UI Modal for Add Course Administrator Form */}
            <Transition appear show={showAddUserForm} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={handleCancelAddUser}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-200"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-150"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                          Add New Course Administrator
                        </DialogTitle>

                        <form onSubmit={handleSaveNewUser} className="space-y-4">
                          {/* Full Name */}
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                              type="text"
                              id="fullName"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter Full Name"
                              value={formData.fullName}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, fullName: e.target.value }))}
                              required
                            />
                            {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                          </div>

                          {/* Email */}
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              id="email"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter Email"
                              value={formData.email}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, email: e.target.value }))}
                              required
                            />
                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                          </div>

                          {/* Contact Number */}
                          <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <input
                              type="text"
                              id="contactNumber"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter Contact Number"
                              value={formData.contactNumber}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, contactNumber: e.target.value }))}
                              required
                            />
                            {formErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{formErrors.contactNumber}</p>}
                          </div>

                          {/* National ID */}
                          <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
                            <input
                              type="text"
                              id="nationalId"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter National ID"
                              value={formData.nationalId}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, nationalId: e.target.value }))}
                              required
                            />
                            {formErrors.nationalId && <p className="text-red-500 text-xs mt-1">{formErrors.nationalId}</p>}
                          </div>

                          {/* Residential Address */}
                          <div>
                            <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">Residential Address</label>
                            <input
                              type="text"
                              id="residentialAddress"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter Residential Address"
                              value={formData.residentialAddress}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, residentialAddress: e.target.value }))}
                              required
                            />
                            {formErrors.residentialAddress && <p className="text-red-500 text-xs mt-1">{formErrors.residentialAddress}</p>}
                          </div>

                          {/* Gender */}
                          <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                              id="gender"
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={formData.gender}
                              onChange={(e) => setFormData((prevData) => ({ ...prevData, gender: e.target.value }))}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                          </div>

                          {/* Buttons */}
                          <div className="flex justify-end space-x-3 mt-6">
                            <button
                              type="button"
                              onClick={handleCancelAddUser}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-md hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                            >
                              Add Course Administrator
                            </button>
                          </div>
                        </form>
                      </DialogPanel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>

            {/* User Table and Loading/Error States - Only show when form is not open */}
            {!showAddUserForm && (
              <>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !filteredAdmins || filteredAdmins.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users found</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Registered On
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredAdmins.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {user.avatarUrl ? (
                                    <img
                                      src={user.avatarUrl || "/placeholder.svg"}
                                      alt={user.fullName}
                                      className="w-10 h-10 rounded-full mr-3"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-white text-medium font-medium">
                                        {user.fullName.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <div className="text-medium font-medium text-gray-900">
                                      {user.fullName.length > 40
                                        ? user.fullName.slice(0, 37) + "..."
                                        : user.fullName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">{user.email.length > 30
                                        ? user.email.slice(0, 27) + "..."
                                        : user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                                    (user.status || "active") === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {(() => {
                                    const s = (user.status || "active");
                                    return s.charAt(0).toUpperCase() + s.slice(1);
                                  })()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewAdmin(user)}
                                    className="text-blue-600 hover:text-blue-900 text-sm px-2 py-1 rounded border border-blue-600"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleEditAdminClick(user)}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm px-2 py-1 rounded border border-indigo-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAdminClick(user)}
                                    className="text-red-600 hover:text-red-900 text-sm px-2 py-1 rounded border border-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Headless UI Modals */}
      {/* View Modal */}
      <Transition appear show={!!selectedAdmin} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseViewAdmin}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>



          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Administrator Details
                  </Dialog.Title>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p><strong>Full Name:</strong> {selectedAdmin?.fullName}</p>
                    <p><strong>Email:</strong> {selectedAdmin?.email}</p>
                    <p><strong>Contact:</strong> {selectedAdmin?.contactNumber || "N/A"}</p>
                    <p><strong>National ID:</strong> {selectedAdmin?.nationalId || "N/A"}</p>
                    <p><strong>Address:</strong> {selectedAdmin?.residentialAddress || "N/A"}</p>
                    <p><strong>Gender:</strong> {selectedAdmin?.gender || "N/A"}</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleCloseViewAdmin} className="px-4 py-2 bg-gray-100 rounded-md">Close</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={!!editingAdmin} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseEditAdmin}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">Edit Administrator</Dialog.Title>
                  {editingAdmin && (
                    <form onSubmit={handleSaveEditedAdmin} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input value={editingAdmin.fullName || ""} onChange={e => setEditingAdmin((prev:any) => ({ ...prev, fullName: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={editingAdmin.email || ""} onChange={e => setEditingAdmin((prev:any) => ({ ...prev, email: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input value={editingAdmin.contactNumber || ""} onChange={e => setEditingAdmin((prev:any) => ({ ...prev, contactNumber: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {formErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{formErrors.contactNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select value={editingAdmin.accountStatus || "active"} onChange={e => setEditingAdmin((prev:any) => ({ ...prev, accountStatus: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="deactivated">Deactivated</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={handleCloseEditAdmin} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md">Save</button>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Modal */}
      <Transition appear show={!!adminToDelete} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseDeleteAdmin}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900">Confirm Delete</Dialog.Title>
                  <div className="mt-3 text-sm text-gray-700">
                    Are you sure you want to delete <strong>{adminToDelete?.fullName}</strong>?
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={handleCloseDeleteAdmin} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                    <button
                      onClick={handleConfirmDeleteAdmin}
                      disabled={deleting}
                      className={`px-4 py-2 text-white rounded-md ${deleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600"}`}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* simple toast */}
      {modalMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white border shadow-md px-4 py-2 rounded-md">
            <div className="flex items-center justify-between space-x-4">
              <div className="text-sm text-gray-800">{modalMessage}</div>
              <button onClick={handleModalClose} className="text-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default SiteAdminDashboard;
