"use client"

import React, { useState } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"
import { Users, BookOpen, TrendingUp, CheckCircle, XCircle, Eye, Trash2, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for analytics
const mockEnrollmentData = [
  { month: 'Jan', students: 850 },
  { month: 'Feb', students: 780 },
  { month: 'Mar', students: 820 },
  { month: 'Apr', students: 550 },
  { month: 'May', students: 1050 },
  { month: 'Jun', students: 1100 },
  { month: 'Jul', students: 900 },
]

// Mock dashboard data
const mockDashboardData = {
  totalUsers: 1250,
  activeCourses: 94,
  newRegistrationsThisMonth: 36,
  pendingApprovals: 8
}

interface Course {
  id: string;
  title: string;
  instructor: { fullName: string };
  status: string;
  createdAt: string;
  enrollments: number;
  category: string;
}

// Mock courses data
const mockCoursesData = {
  courses: [
    {
      id: 'c1',
      title: 'Quantum Foundations',
      instructor: { fullName: 'Dr. Smith' },
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      enrollments: 450,
      category: 'Quantum Basics'
    },
    {
      id: 'c2',
      title: 'Advanced Quantum Algorithms',
      instructor: { fullName: 'Prof. Johnson' },
      status: 'under-review',
      createdAt: '2024-02-20T14:20:00Z',
      enrollments: 0,
      category: 'Advanced Algorithms'
    },
    {
      id: 'c3',
      title: 'Quantum Computing Basics',
      instructor: { fullName: 'Dr. Williams' },
      status: 'published',
      createdAt: '2024-03-10T09:15:00Z',
      enrollments: 320,
      category: 'Quantum Basics'
    }
  ],
  pendingCourses: [
  {
    id: 'c4',
    title: 'Quantum Machine Learning',
    instructor: { fullName: 'Dr. Brown' },
    createdAt: '2024-03-25T11:45:00Z'
  }
]

}

// Mock users data
const mockUsersData = {
  users: [
    {
      id: 'U001',
      fullName: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      city: 'New York',
      country: 'USA',
      createdAt: '2023-01-10T08:00:00Z',
      avatarUrl: null,
      status: 'Active'
    },
    {
      id: 'U002',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      city: 'London',
      country: 'UK',
      createdAt: '2023-02-15T10:30:00Z',
      avatarUrl: null,
      status: 'Inactive'
    }
  ],
  totalPages: 5,
  currentPage: 1
}

const CourseAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourseAnalytics, setSelectedCourseAnalytics] = useState<SelectedCourseAnalytics | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for add user form visibility

  // Mock API responses
  const dashboardData = mockDashboardData
  const coursesData = mockCoursesData
  const usersData = mockUsersData
  const dashboardLoading = false
  const coursesLoading = false
  const usersLoading = false

  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      console.log(`${action} course ${courseId}`)
      // In real app, this would call the API
    } catch (error) {
      console.error(`Failed to ${action} course:`, error)
    }
  }

  interface SelectedCourseAnalytics {
  id: string;
  title: string;
  
}

  const handleViewAnalytics = (course:Course) => {
    const { id, title } = course
    setSelectedCourseAnalytics({ id, title })
    setActiveTab("analytics") // Switch to analytics tab
  }

  const handleCloseAnalytics = () => {
    setSelectedCourseAnalytics(null) // Clear selected course
    setActiveTab("courses") // Go back to course management
  }

  const handleAddUserClick = () => {
    setShowAddUserForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUserForm(false);
  };

  const handleSaveNewUser = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("New user data submitted!");
    setShowAddUserForm(false); // Close form after submission
  };


  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-900 mb-2">Course Administrator Dashboard</h1>
        <p className="text-gray-600">Manage courses, users, and platform settings</p>
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
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-cyan-700 text-cyan-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "courses"
                  ? "border-cyan-700 text-cyan-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Course Management
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-cyan-700 text-cyan-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Management
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* System Overview */}
            <div className="bg-blue-50 rounded-lg shadow-sm border-l-4 border-cyan-700 p-8">
              <h3 className="text-lg font-semibold text-cyan-700 mb-4">System Overview</h3>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">{dashboardData.totalUsers || '1,250'}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">{dashboardData.activeCourses || '94'}</div>
                  <div className="text-sm text-gray-600">Active Courses</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">{dashboardData.newRegistrationsThisMonth || '36'}</div>
                  <div className="text-sm text-gray-600">New Registrations</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingApprovals}</p>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                </div>
              </div>
            </div>
            {/* Enrollment Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Enrollments</h3>
            <div className="h-64 flex items-end space-x-2">
              {mockEnrollmentData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-cyan-700 rounded-t"
                    style={{
                      height: `${(data.students / Math.max(...mockEnrollmentData.map((d) => d.students))) * 200}px`,
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    <div className="font-semibold">{data.students}</div>
                    <div>{data.month}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* Course Management Tab */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Course Management</h3>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by course title or Instructor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>
              <div className="relative">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                <option>Status: All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Under Review</option>
              </select>
              </div>
              <div className="relative">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                <option>Category: All</option>
                <option>Quantum Basics</option>
                <option>Advanced Algorithms</option>
              </select>
              </div>
            </div>

            {/* Course Table */}
            {coursesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !coursesData || coursesData.courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses to manage</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-cyan-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Course Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Instructor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Enrollments</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coursesData.courses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.instructor.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === "published"
                                ? "bg-green-100 text-green-800"
                                : course.status === "under-review"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : course.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.enrollments ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.category ?? 'Quantum Basics'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Link to={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-900">
                               <Eye className="w-4 h-4" />
                              </Link>
                            </button>
                            {course.status === "under-review" && (
                              <>
                                <button
                                  onClick={() => handleCourseAction(course.id, "approve")}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCourseAction(course.id, "reject")}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleCourseAction(course.id, "delete")}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                               onClick={() => handleViewAnalytics(course)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>


                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pending Course Submissions */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Course Submissions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-cyan-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Course Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Instructor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Submitted On</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coursesData.pendingCourses?.map((course) => (
                      <tr key={course.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.instructor.fullName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-300"
                              onClick={() => handleCourseAction(course.id, 'approve')}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs hover:bg-red-300"
                              onClick={() => handleCourseAction(course.id, 'reject')}
                            >
                              Reject
                            </button>
                            <button className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-300">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                <button
                  onClick={handleAddUserClick}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md"
                >
                  Add New User
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

            {showAddUserForm && (
              <div className="bg-white p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Educator</h4>
                <form onSubmit={handleSaveNewUser} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Full Name"
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
                    />
                  </div>
                  <div>
                    <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
                    <input
                      type="text"
                      id="nationalId"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter National ID"
                    />
                  </div>
                  <div>
                    <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">Residential Address</label>
                    <input
                      type="text"
                      id="residentialAddress"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Residential Address"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      id="gender"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md mt-2"
                    >
                      Add User
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
                ) : !usersData || usersData.users.length === 0 ? (
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
                          {usersData.users.map((user) => (
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
                    {usersData.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                          Page {usersData.currentPage} of {usersData.totalPages}
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
                            onClick={() => setCurrentPage((prev) => Math.min(usersData.totalPages, prev + 1))}
                            disabled={currentPage === usersData.totalPages}
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

        {/* Analytics Tab */}
        {activeTab === "analytics" && selectedCourseAnalytics && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Analytics for: {selectedCourseAnalytics?.title || "Selected Course"}
            </h3>
            <button
              onClick={handleCloseAnalytics} // Use the new close handler
              className="text-sm text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Close Analytics
            </button>
          </div>


            {/* Course Analytics Summary */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-700">Student Enrollment Analytics</h3>
              </div>

              {/* Chart Container */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-4">
                  <h4 className="text-center text-lg font-semibold text-gray-900 mb-6">Student Enrollments Over Time</h4>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockEnrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                      <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 1200]}
                        ticks={[0, 200, 400, 600, 800, 1000, 1200]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">Months</p>
                </div>
              </div>

              {/* Additional Analytics Cards */}
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">1,058</div>
                  <div className="text-sm text-gray-600">Total Enrollments</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">4.7</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remove the Analytics Modal since it's now a tab */}
    </div>
  )
}

export default CourseAdminDashboard;
