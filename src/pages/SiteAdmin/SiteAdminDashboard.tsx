"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import { useAddCourseAdministratorMutation } from "../../utils/api";

// Mock dashboard data
const mockDashboardData = {
  totalUsers: 1250,
  activeCourses: 94,
  newRegistrationsThisMonth: 36,
  pendingApprovals: 8
};

// Mock users data
const mockUsersData = {
  users: [
    {
      id: "U001",
      fullName: "John Doe",
      email: "john@example.com",
      role: "admin",
      city: "New York",
      country: "USA",
      createdAt: "2023-01-10T08:00:00Z",
      avatarUrl: null,
      status: "Active",
    },
    {
      id: "U002",
      fullName: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      city: "London",
      country: "UK",
      createdAt: "2023-02-15T10:30:00Z",
      avatarUrl: null,
      status: "Inactive",
    },
  ],
  totalPages: 5,
  currentPage: 1,
};

const SiteAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for add user form visibility
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });

   const [addCourseAdmin, { isLoading, error }] = useAddCourseAdministratorMutation()

  // Mock API responses (assuming these are static for this example)
  const dashboardData = mockDashboardData;
  const usersLoading = false;
  const dashboardLoading = false;

  const handleAddUserClick = () => {
    setShowAddUserForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUserForm(false);
  };

  const handleSaveNewUser = async (event: React.FormEvent) => {
    event.preventDefault();

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
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-900 mb-2">System Administrator Dashboard</h1>
          <p className="text-gray-600">Manage course administrators, and platform settings</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-cyan-700 mb-2 text-center">Welcome back, Nanayakkara A.T.S!</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-cyan-700 text-cyan-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Course Administrator Management
              </button>
            </nav>
          </div>

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Header with Title and Add Button - Only show when form is not open */}
              {!showAddUserForm && (
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Course Administrator Management</h3>
                  <button
                    onClick={handleAddUserClick}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                    <option>Filter by Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              )}

              {/* Add New Course Administrator Form */}
              {showAddUserForm && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Course Administrator</h4>
                <form onSubmit={handleSaveNewUser} className="space-y-4">
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
                  </div>
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
                  </div>
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                      type="text"
                      id="contactNumber"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Contact Number"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData((prevData) => ({ ...prevData, contactNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
                    <input
                      type="text"
                      id="nationalId"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter National ID"
                      value={formData.nationalId}
                      onChange={(e) => setFormData((prevData) => ({ ...prevData, nationalId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">Residential Address</label>
                    <input
                      type="text"
                      id="residentialAddress"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Residential Address"
                      value={formData.residentialAddress}
                      onChange={(e) => setFormData((prevData) => ({ ...prevData, residentialAddress: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      id="gender"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.gender}
                      onChange={(e) => setFormData((prevData) => ({ ...prevData, gender: e.target.value }))}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={handleCancelAddUser}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 py-3 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
                      >
                        Add Course Administrator
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* User Table and Loading/Error States - Only show when form is not open */}
              {!showAddUserForm && (
                <>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : !mockUsersData || mockUsersData.users.length === 0 ? (
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
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Registered On
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockUsersData.users.map((user) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
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
                                        <span className="text-white text-sm font-medium">
                                          {user.fullName.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      user.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded border border-blue-600">
                                      View
                                    </button>
                                    <button className="text-indigo-600 hover:text-indigo-900 text-xs px-2 py-1 rounded border border-indigo-600">
                                      Edit
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded border border-red-600">
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {mockUsersData.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-sm text-gray-700">
                            Page {mockUsersData.currentPage} of {mockUsersData.totalPages}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setCurrentPage((prev) => Math.min(mockUsersData.totalPages, prev + 1))}
                              disabled={currentPage === mockUsersData.totalPages}
                              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    
  );
};

export default SiteAdminDashboard;
