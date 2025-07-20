"use client";

import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Users, BookOpen, TrendingUp, CheckCircle, XCircle, Eye, Trash2, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for analytics
const mockEnrollmentData = [
  { month: 'Jan', students: 100 },
  { month: 'Feb', students: 580 },
  { month: 'Mar', students: 220 },
  { month: 'Apr', students: 550 },
  { month: 'May', students: 650 },
  { month: 'Jun', students: 700 },
  { month: 'Jul', students: 750 },
];

// Mock dashboard data
const mockDashboardData = {
  totalUsers: 1250,
  activeCourses: 94,
  newRegistrationsThisMonth: 36,
  pendingApprovals: 8
};

interface Course {
  id: string;
  title: string;
  instructor: { fullName: string };
  status: string;
  createdAt: string;
  enrollments: number;
  category: string;
}

// Mock courses data (initial data, will be moved to state for mutability)
const initialMockCoursesData = {
  courses: [
    {
      id: "c1",
      title: "Quantum Foundations",
      instructor: { fullName: "Dr. Smith" },
      status: "published",
      createdAt: "2024-01-15T10:30:00Z",
      enrollments: 450,
      category: "Quantum Basics",
    },
    {
      id: "c2",
      title: "Advanced Quantum Algorithms",
      instructor: { fullName: "Prof. Johnson" },
      status: "under-review",
      createdAt: "2024-02-20T14:20:00Z",
      enrollments: 0,
      category: "Advanced Algorithms",
    },
    {
      id: "c3",
      title: "Quantum Computing Basics",
      instructor: { fullName: "Dr. Williams" },
      status: "published",
      createdAt: "2024-03-10T09:15:00Z",
      enrollments: 320,
      category: "Quantum Basics",
    },
    {
      id: "c5",
      title: "Introduction to AI",
      instructor: { fullName: "Dr. Alice" },
      status: "published",
      createdAt: "2024-04-01T10:00:00Z",
      enrollments: 600,
      category: "Artificial Intelligence",
    },
    {
      id: "c6",
      title: "Machine Learning Fundamentals",
      instructor: { fullName: "Dr. Bob" },
      status: "rejected",
      createdAt: "2024-04-10T11:00:00Z",
      enrollments: 0,
      category: "Artificial Intelligence",
    },
    {
      id: "c7",
      title: "Data Science with Python",
      instructor: { fullName: "Prof. Carol" },
      status: "published",
      createdAt: "2024-05-05T13:00:00Z",
      enrollments: 720,
      category: "Data Science",
    },
  ],
  pendingCourses: [
    {
      id: "c4",
      title: "Quantum Machine Learning",
      instructor: { fullName: "Dr. Brown" },
      createdAt: "2024-03-25T11:45:00Z",
      category: "Quantum Basics" // Added category for pending course for consistency
    },
  ],
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

const CourseAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourseAnalytics, setSelectedCourseAnalytics] = useState<SelectedCourseAnalytics | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // New state for add user form visibility

  // State for course management filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State for mutable course data
  // Initialize with initialMockCoursesData.courses to allow modifications
  const [courses, setCourses] = useState(initialMockCoursesData.courses);
  // Initialize with initialMockCoursesData.pendingCourses to allow modifications
  const [pendingCourses, setPendingCourses] = useState(initialMockCoursesData.pendingCourses);


  // Mock API responses (assuming these are static for this example)
  const dashboardData = mockDashboardData; // Use mockUsersData directly
  const coursesLoading = false;
  const usersLoading = false;
  const dashboardLoading = false;

  // Filtered courses based on search and filter criteria
  const filteredCourses = useMemo(() => {
    let filtered = courses; // Use the mutable 'courses' state for filtering

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((course) => course.status === statusFilter.toLowerCase().replace(' ', '-'));
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, categoryFilter, courses]); // Depend on 'courses' state for re-evaluation


  // Function to handle course actions (approve, reject, delete)
  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      // Logic to update the status of courses in the main 'courses' list
      if (action === "approve" || action === "reject" || action === "delete") {
        setCourses(prevCourses => {
          const updatedCourses = prevCourses.map(course => {
            if (course.id === courseId) {
              if (action === "approve") {
                return { ...course, status: "published" }; // Change status to 'published' on approve
              } else if (action === "reject") {
                return { ...course, status: "rejected" }; // Change status to 'rejected' on reject
              }
            }
            return course;
          }).filter(course => !(action === "delete" && course.id === courseId)); // Remove course if action is 'delete'
          return updatedCourses;
        });

        // Logic to handle courses in the 'pendingCourses' list
        setPendingCourses(prevPending => {
          const updatedPending = prevPending.filter(course => course.id !== courseId); // Remove from pending list
          const movedCourse = prevPending.find(course => course.id === courseId); // Find the course that was acted upon

          // If a course from pending was approved, add it to the main 'courses' list as 'published'
          if (movedCourse && action === "approve") {
            setCourses(prevCourses => [
              ...prevCourses,
              // Add default values for enrollments and category if they are not present in pending course mock data
              { ...movedCourse, status: "published", enrollments: 0, category: movedCourse.category || "Uncategorized" }
            ]);
          }
          return updatedPending;
        });
      }
      // In a real application, you would also make API calls here to persist these changes to a backend database.
    } catch (error) {
      console.error(`Failed to ${action} course:`, error);
    }
  };


  interface SelectedCourseAnalytics {
    id: string;
    title: string;
    status: string;
  }

  const handleViewAnalytics = (course: Course) => {
  const { id, title, status } = course // Add status to destructuring
  setSelectedCourseAnalytics({ id, title, status }) // Pass status to state
  setActiveTab("analytics") // Switch to analytics tab
}

  const handleCloseAnalytics = () => {
    setSelectedCourseAnalytics(null); // Clear selected course
    setActiveTab("courses"); // Go back to course management
  };

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

  // Extract unique categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    // Use the mutable 'courses' state here to get categories from all current courses
    courses.forEach(course => {
      if (course.category) {
        categories.add(course.category);
      }
    });
    return ["All", ...Array.from(categories).sort()];
  }, [courses]); // Depend on 'courses' state to update categories dynamically

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

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* System Overview */}
              <div className="bg-blue-50 rounded-lg shadow-sm border-l-4 border-cyan-700 p-8">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">System Overview</h3>
                <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{mockDashboardData.totalUsers}</p>
                  </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{mockDashboardData.activeCourses}</p>
                    </div>
                 </div>
                  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{mockDashboardData.newRegistrationsThisMonth}</p>
                  </div>
                </div>
                  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">{mockDashboardData.pendingApprovals}</p>
                  </div>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">Status: All</option>
                    <option value="Published">Published</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        Category: {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Table */}
              {coursesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !filteredCourses || filteredCourses.length === 0 ? (
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
                      {filteredCourses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {course.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {course.instructor.fullName}
                          </td>
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
              
              {pendingCourses && pendingCourses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-cyan-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Course Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Instructor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Submitted On</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingCourses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{course.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{course.instructor.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{course.category ?? 'Quantum Basics'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Link to={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-900">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </button>
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500 text-lg">There are no pending submissions.</p>
                </div>
              )}
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
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
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

              {/* Add New Educator Form */}
              {showAddUserForm && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
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
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2"
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

          {activeTab === "analytics" && selectedCourseAnalytics && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Analytics for: {selectedCourseAnalytics?.title || "Selected Course"}
                </h3>
                <button
                  onClick={handleCloseAnalytics}
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Close Analytics
                </button>
              </div>

              {/* Check if course is under review */}
              {selectedCourseAnalytics.status === 'under-review' ? (
                // Show empty state for under-review courses
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
                  <p className="text-gray-600">
                    Analytics are not available for courses that are under review. 
                    Once the course is approved and published, analytics data will be generated.
                  </p>
                </div>
              ) : (
                // Show analytics for published courses
                <>
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-cyan-700 mr-2" />
                    <h3 className="text-lg font-semibold text-cyan-700">Student Enrollment Analytics</h3>
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
      </>
    )}
  </div>
)}
        </div>
      </div>
    
  );
};

export default CourseAdminDashboard;
