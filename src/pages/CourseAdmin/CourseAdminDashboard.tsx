import React, { useState, useMemo, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, TrendingUp, CheckCircle, XCircle, Eye, Trash2, X, Edit3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Dialog,
  Transition,
  Tab,
  Listbox,
  Menu,
  RadioGroup,
} from "@headlessui/react";

import type { IUser, IAddEducatorRequest, ICourse, CourseStatus } from "../../utils/types";
import {
  useAddEducatorMutation,
  useGetEducatorsQuery,
  useUpdateEducatorMutation,
  useDeleteEducatorMutation,
  useGetCourseAdminDashboardQuery,
  useGetCourseAdminCoursesQuery,
} from "../../utils/api";

// Mock courses data (initial data, will be moved to state for mutability)
const initialMockCoursesData = {
  courses: [
    {
      id: "c1",
      title: "Quantum Foundations",
      instructor: { id: "inst1", fullName: "Dr. Smith" },
      status: "published",
      createdAt: "2024-01-15T10:30:00Z",
      enrollments: 450,
      category: "Quantum Basics",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "beginner" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [
        { month: 'Jan', students: 50 }, { month: 'Feb', students: 70 },
        { month: 'Mar', students: 120 }, { month: 'Apr', students: 150 },
        { month: 'May', students: 200 }, { month: 'Jun', students: 250 },
        { month: 'Jul', students: 450 },
      ],
    },
    {
      id: "c2",
      title: "Advanced Quantum Algorithms",
      instructor: { id: "inst2", fullName: "Prof. Johnson" },
      status: "under-review",
      createdAt: "2024-02-20T14:20:00Z",
      enrollments: 0,
      category: "Advanced Algorithms",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "advanced" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [
        { month: 'Feb', students: 0 }, { month: 'Mar', students: 0 },
        { month: 'Apr', students: 0 }, { month: 'May', students: 0 },
        { month: 'Jun', students: 0 }, { month: 'Jul', students: 0 },
      ],
    },
    {
      id: "c3",
      title: "Quantum Computing Basics",
      instructor: { id: "inst3", fullName: "Dr. Williams" },
      status: "published",
      createdAt: "2024-03-10T09:15:00Z",
      enrollments: 320,
      category: "Quantum Basics",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "beginner" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [
        { month: 'Mar', students: 80 }, { month: 'Apr', students: 120 },
        { month: 'May', students: 200 }, { month: 'Jun', students: 280 },
        { month: 'Jul', students: 320 },
      ],
    },
    {
      id: "c5",
      title: "Introduction to AI",
      instructor: { id: "inst4", fullName: "Dr. Alice" },
      status: "published",
      createdAt: "2024-04-01T10:00:00Z",
      enrollments: 600,
      category: "Artificial Intelligence",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "intermediate" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [
        { month: 'Apr', students: 100 }, { month: 'May', students: 250 },
        { month: 'Jun', students: 400 }, { month: 'Jul', students: 600 },
      ],
    },
    {
      id: "c6",
      title: "Machine Learning Fundamentals",
      instructor: { id: "inst5", fullName: "Dr. Bob" },
      status: "rejected",
      createdAt: "2024-04-10T11:00:00Z",
      enrollments: 0,
      category: "Artificial Intelligence",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "intermediate" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [],
    },
    {
      id: "c7",
      title: "Data Science with Python",
      instructor: { id: "inst6", fullName: "Prof. Carol" },
      status: "published",
      createdAt: "2024-05-05T13:00:00Z",
      enrollments: 720,
      category: "Data Science",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "intermediate" as const,
      prerequisites: [],
      modules: [],
      enrollmentHistory: [
        { month: 'May', students: 150 }, { month: 'Jun', students: 400 },
        { month: 'Jul', students: 720 },
      ],
    },
  ],
  pendingCourses: [
    {
      id: "c4",
      title: "Quantum Machine Learning",
      instructor: { id: "inst7", fullName: "Dr. Brown" },
      status: "under-review",
      createdAt: "2024-03-25T11:45:00Z",
      category: "Quantum Basics",
      subtitle: "",
      description: "",
      thumbnailUrl: "",
      difficultyLevel: "advanced" as const,
      prerequisites: [],
      modules: [],
      enrollments: 0,
      enrollmentHistory: [],
    },
  ],
};

type SelectedCourseAnalytics = {
  id: string;
  title: string;
  status: CourseStatus;
  enrollmentHistory: { month: string; students: number }[];
};

const tabOrder = ["overview", "courses", "users"];

const CourseAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseAnalytics, setSelectedCourseAnalytics] = useState<SelectedCourseAnalytics | null>(null);

  const [formData, setFormData] = useState<IAddEducatorRequest>({
    fullName: "",
    email: "",
    password: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });

  // add form errors
  const [addFormErrors, setAddFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });
  // edit form errors
  const [editFormErrors, setEditFormErrors] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    nationalId: "",
    residentialAddress: "",
    gender: "",
  });

  // RTK Query hooks
  const [addEducator, { isLoading: isAddingEducator }] = useAddEducatorMutation();
  const [updateEducator, { isLoading: isUpdatingEducator }] = useUpdateEducatorMutation();
  const [deleteEducator, { isLoading: isDeletingEducator }] = useDeleteEducatorMutation();

  const { data: educators } = useGetEducatorsQuery();
  const { data: dashboardData, isLoading: dashboardLoading, isError: dashboardError } = useGetCourseAdminDashboardQuery();
  const { data: courseAdminCoursesData, isLoading: coursesLoading, isError: coursesError } = useGetCourseAdminCoursesQuery();

  // State for course management filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State for mutable course data (use ICourse from shared types)
  const [courses, setCourses] = useState<ICourse[]>(initialMockCoursesData.courses as ICourse[]);
  const [pendingCourses, setPendingCourses] = useState<ICourse[]>(initialMockCoursesData.pendingCourses as ICourse[]);

  // State variables for User Management Tab
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]); // use IUser from types.ts
  const [usersCurrentPage, setUsersCurrentPage] = useState(1); // Separate pagination for users
  const [usersPerPage] = useState(5); // Number of users to display per page
  const [userSearchTerm, setUserSearchTerm] = useState(''); // Search term for users
  const [userStatusFilter, setUserStatusFilter] = useState('all'); // Status filter for users (use same values as SiteAdminDashboard)

  useEffect(() => {
    if (!educators) return;
    setUsers(educators.educators ?? []);
  }, [educators]);

  // When API data arrives map to ICourse shape and replace local state
  useEffect(() => {
    if (!courseAdminCoursesData?.courses) return;
    const apiCourses: ICourse[] = courseAdminCoursesData.courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      instructor: {
        id: c.instructor?.userId || c.instructor?.id || "unknown",
        fullName: c.instructor?.fullName || "Unknown"
      },
      status: (c.status ?? "draft") as CourseStatus,
      createdAt: c.createdAt ?? new Date().toISOString(),
      enrollments: (c as any).enrollments ?? 0,
      category: c.category ?? "Uncategorized",
      subtitle: c.subtitle ?? "",
      description: c.description ?? "",
      thumbnailUrl: c.thumbnailUrl ?? "",
      difficultyLevel: c.difficultyLevel ?? "beginner",
      prerequisites: c.prerequisites ?? [],
      modules: c.modules ?? [],
      enrollmentHistory: (c as any).enrollmentHistory ?? [],
    }));
    setCourses(apiCourses);
    setPendingCourses(apiCourses.filter((c) => c.status === "under-review"));
  }, [courseAdminCoursesData]);

  // States for user modals
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  // State for custom modal
  const [modalMessage, setModalMessage] = useState('');

  // Get logged-in user from localStorage (use same approach as SiteAdminDashboard)
  const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const loggedInUser = userData ? JSON.parse(userData) : null;

  // build fallback months with zeros when API doesn't return enrollmentsPerMonth
  const buildEmptyMonths = (count = 6) => {
    const now = new Date();
    const months: { month: string; count: number }[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: d.toLocaleString("en-US", { month: "short" }), count: 0 });
    }
    return months;
  };

  // Use API data; keep existing fallback for enrollmentsPerMonth
  const enrollmentData = dashboardData?.enrollmentsPerMonth ?? buildEmptyMonths(6);
  const totalUsersCount = dashboardData?.totalUsers ?? 0;
  const activeCoursesCount = dashboardData?.activeCourses ?? 0;
  const newRegistrationsThisMonthCount = dashboardData?.newRegistrationsThisMonth ?? 0;
  const pendingApprovalsCount = dashboardData?.pendingApprovals ?? 0;

  const maxOverallStudents = Math.max(...enrollmentData.map((d) => d.count), 1);

  // Filtered courses based on search and filter criteria
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((course) => course.status === statusFilter.toLowerCase().replace(' ', '-'));
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((course) => course.category === categoryFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, categoryFilter, courses]);

  // Unique categories
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    courses.forEach(course => {
      if (course.category) categories.add(course.category);
    });
    return ["All", ...Array.from(categories).sort()];
  }, [courses]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (userSearchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter((user) => {
      const userStatus = (user.status || "active").toLowerCase();
      return userStatusFilter.toLowerCase() === "all" || userStatus === userStatusFilter.toLowerCase();
    });

    return filtered;
  }, [userSearchTerm, userStatusFilter, users]);

  // Pagination logic for User Management
  const indexOfLastUser = usersCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Function to handle course actions (approve, reject, delete)
  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      if (action === "approve" || action === "reject" || action === "delete") {
        setCourses(prevCourses => {
          const updatedCourses = prevCourses.map(course => {
            if (course.id === courseId) {
              if (action === "approve") return { ...course, status: "published" as CourseStatus };
              if (action === "reject") return { ...course, status: "rejected" as CourseStatus };
            }
            return course;
          }).filter(course => !(action === "delete" && course.id === courseId));
          return updatedCourses;
        });

        setPendingCourses(prevPending => {
          const updatedPending = prevPending.filter(course => course.id !== courseId);
          const movedCourse = prevPending.find(course => course.id === courseId);

          if (movedCourse && action === "approve") {
            setCourses(prevCourses => [
              ...prevCourses,
              { ...movedCourse, status: "published", enrollments: 0, category: movedCourse.category || "Uncategorized" }
            ]);
          }
          return updatedPending;
        });
      }
      setModalMessage(`Course ${action}d successfully!`);
    } catch (error: any) {
      console.error(`Failed to ${action} course:`, error);
      setModalMessage(`Failed to ${action} course: ${error?.message ?? String(error)}`);
    }
  };

  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

 const handleOpenAnalyticsModal = (course: ICourse) => {
  // set the data first
  setSelectedCourseAnalytics({
    id: course.id,
    title: course.title,
    status: course.status,
    enrollmentHistory: course.enrollmentHistory ?? [],
  });

  // then open modal (no race)
  setShowAnalyticsModal(true);
};

const handleCloseAnalyticsModal = () => {
  // close UI first
  setShowAnalyticsModal(false);

  // clear selected data after the leave animation finishes (match Transition leave duration)
  setTimeout(() => setSelectedCourseAnalytics(null), 220);
};

  // User Management Event Handlers
  const handleAddUserClick = () => setShowAddUserForm(true);
  const handleCancelAddUser = () => setShowAddUserForm(false);


  // password live checks
  const passwordChecks = useMemo(() => {
    const pwd = formData.password || "";
    return {
      length: pwd.length >= 8,
      letter: /[A-Za-z]/.test(pwd),
      number: /\d/.test(pwd),
      valid: pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd),
    };
  }, [formData.password]);

  const validateAddForm = () => {
    const errors = {
      fullName: "",
      email: "",
      password: "",
      contactNumber: "",
      nationalId: "",
      residentialAddress: "",
      gender: "",
    };
    let valid = true;
    if (!formData.fullName.trim()) { errors.fullName = "Full name is required"; valid = false; }
    if (!formData.email.trim()) { errors.email = "Email is required"; valid = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) { errors.email = "Invalid email"; valid = false; }
      // Password rules: at least 8 chars, at least one letter, at least one number
    if (formData.password) {
      if (formData.password.length < 8) { errors.password = "Password must be at least 8 characters."; valid = false; }
      else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
        errors.password = "Password must include letters and numbers."; valid = false;
      }
    } else {
      // If you want to require password when adding: uncomment next lines
      errors.password = "Password is required";
      valid = false;
    }
    if (formData.contactNumber && !/^\d{10,15}$/.test(formData.contactNumber)) { errors.contactNumber = "Contact must be 10-15 digits"; valid = false; }
    if (formData.nationalId && formData.nationalId.length < 5) { errors.nationalId = "National ID is too short"; valid = false; }
    if (formData.residentialAddress && formData.residentialAddress.length < 5) { errors.residentialAddress = "Address is too short"; valid = false; }
    if (!formData.gender) { errors.gender = "Gender is required"; valid = false; }
    setAddFormErrors(errors);
    return valid;
  };

  const handleSaveNewUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateAddForm()) return;

    // Generate a new sequential ID (U001, U002, U003...)
    const lastUserId = users.reduce((maxId, user) => {
      const match = user.id.match(/^U(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(maxId, num);
      }
      return maxId;
    }, 0);
    const newId = `U${String(lastUserId + 1).padStart(3, '0')}`;

    try {
      const newUserResponse = await addEducator({
        ...formData,
        password: formData.password || "defaultPassword",
      } as any).unwrap();

      const newUser: IUser = {
        id: newUserResponse?.educator?.id ?? newId,
        fullName: formData.fullName,
        email: formData.email,
        role: "educator",
        contactNumber: formData.contactNumber,
        nationalId: formData.nationalId,
        residentialAddress: formData.residentialAddress,
        gender: formData.gender,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      setUsers(prevUsers => {
        const updatedUsers = [...prevUsers, newUser];
        return updatedUsers.sort((a, b) => {
          const aNum = parseInt(a.id.replace('U', ''), 10);
          const bNum = parseInt(b.id.replace('U', ''), 10);
          return aNum - bNum;
        });
      });

      setModalMessage("New user added successfully!");
      setShowAddUserForm(false);
      setAddFormErrors({ fullName: "", email: "", password: "", contactNumber: "", nationalId: "", residentialAddress: "", gender: ""});
      setFormData({
        fullName: "",
        email: "",
        password: "",
        contactNumber: "",
        nationalId: "",
        residentialAddress: "",
        gender: "",
      });
    } catch (error: any) {
      console.error("Error adding new user:", error);
      setModalMessage(`Failed to add user: ${error?.message ?? String(error)}`);
    }
  };

  const handleViewUser = (user: IUser) => setSelectedUser(user);
  const handleCloseViewUserModal = () => setSelectedUser(null);
  const handleEditUserClick = (user: IUser) => setEditingUser(user);

  const handleSaveEditedUser = async (userId: string, updatedData: any) => {
    try {
      const payload: any = {
        fullName: updatedData.fullName,
        email: updatedData.email,
        contactNumber: updatedData.contactNumber,
        nationalId: updatedData.nationalId,
        residentialAddress: updatedData.residentialAddress,
        gender: updatedData.gender,
        status: updatedData.status && String(updatedData.status).toLowerCase(),
      };
      if (updatedData.password) payload.password = updatedData.password;

      const res = await updateEducator({ educatorId: userId, educator: payload } as any).unwrap();
      const updatedUser = res.educator;
      setUsers(prev => prev.map(u => (u.id === updatedUser.id ? ({ ...u, ...updatedUser } as any) : u)));
      setModalMessage("User updated successfully!");
      setEditFormErrors({ fullName: "", email: "", contactNumber: "", nationalId: "", residentialAddress: "", gender: "" });
      setEditingUser(null);
    } catch (error: any) {
      console.error("Error updating user:", error);
      setModalMessage(error?.data?.message || error?.message || "Failed to update user");
    }
  };

  const handleCloseEditUserModal = () => setEditingUser(null);
  const handleDeleteUserClick = (user: IUser) => setUserToDelete(user);

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) {
      setModalMessage("No user selected for deletion.");
      return;
    }
    try {
      await deleteEducator(userToDelete.id).unwrap();
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      setModalMessage(`User "${userToDelete.fullName}" deleted successfully!`);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setModalMessage(error?.data?.message || error?.message || "Failed to delete user");
    }
  };

  const handleCloseDeleteConfirmModal = () => setUserToDelete(null);
  const handleModalClose = () => setModalMessage('');

  // map activeTab to Tab.Group index
  const currentTabIndex = Math.max(0, tabOrder.indexOf(activeTab === "analytics" ? "courses" : activeTab));

  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error UI only when not loading and no data returned
  if (!dashboardData && !dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const totalEnrollments = enrollmentData.reduce((sum, data) => sum + data.count, 0);
  const averageEnrollments = totalEnrollments / enrollmentData.length || 0;

  return (
    <div className="min-h-screen bg-blue p-4 sm:p-6 lg:p-8 font-inter">
      <div className="w-full px-4 sm:px-6 lg:px-62 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-cyan-900 mb-2">Course Administrator Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage courses, users, and platform settings</p>
        </div>

        <div className="w-full">
          {/* Welcome Message */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-cyan-700 mb-2 text-center">
              Welcome back, {loggedInUser?.fullName || "Administrator"}!
            </h1>
          </div>

          {/* Navigation Tabs - Headless UI */}
          <div className="mb-6">
            <Tab.Group selectedIndex={currentTabIndex} onChange={(idx) => setActiveTab(tabOrder[idx])}>
              <Tab.List className="flex space-x-8 overflow-x-auto pb-2">
                <Tab as="button" className={({ selected }) => `py-2 px-1 border-b-2 font-medium text-xl whitespace-nowrap ${selected ? "border-cyan-700 text-cyan-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                  Overview
                </Tab>
                <Tab as="button" className={({ selected }) => `py-2 px-1 border-b-2 font-medium text-xl whitespace-nowrap ${selected ? "border-cyan-700 text-cyan-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                  Course Management
                </Tab>
                <Tab as="button" className={({ selected }) => `py-2 px-1 border-b-2 font-medium text-xl whitespace-nowrap ${selected ? "border-cyan-700 text-cyan-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                  Educator Management
                </Tab>
              </Tab.List>

              <Tab.Panels className="mt-6">
                <Tab.Panel>
                  {/* Overview Tab Content */}
                  <div className="space-y-8">
                    {/* System Overview */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h3>
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUsersCount}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-600">Active Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{activeCoursesCount}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-600">New Registrations</p>
                            <p className="text-2xl font-bold text-gray-900">{newRegistrationsThisMonthCount}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-600">Pending Approvals</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingApprovalsCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Enrollment Bar Chart (Overall) */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-2xl font-bold text-black-700 mb-6">Monthly Enrollments</h3>
                      <div className="flex justify-around items-end h-64 border-b border-gray-200 pb-2">
                        {enrollmentData.map((data, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center mx-1">
                            <div
                              className="w-full bg-cyan-700 rounded-t-md"
                              style={{
                                height: `${(data.count / maxOverallStudents) * 200}px`,
                                width: '80%',
                              }}
                            ></div>
                            <div className="text-medium text-gray-600 mt-2 text-center">
                              <div className="font-semibold">{data.count}</div>
                              <div>{data.month}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  {/* Course Management Tab */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Management</h3>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex-1 min-w-64">
                        <input
                          type="text"
                          placeholder="Search by course title or Instructor"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="relative w-56">
                        <Listbox value={statusFilter} onChange={setStatusFilter}>
                          <div className="relative">
                            <Listbox.Button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-medium text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
                              {statusFilter === "All" ? "Status: All" : `Status: ${statusFilter}`}
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10">
                                {["All", "Published", "Under Review", "Rejected", "Draft"].map((opt) => (
                                  <Listbox.Option key={opt} value={opt}>
                                    {({ active }) => (
                                      <div className={`${active ? "bg-gray-100" : ""} px-3 py-2 text-medium`}>
                                        {opt}
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>

                      <div className="relative w-56">
                        <Listbox value={categoryFilter} onChange={setCategoryFilter}>
                          <div className="relative">
                            <Listbox.Button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-medium text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
                              {categoryFilter === "All" ? "Category: All" : `Category: ${categoryFilter}`}
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10 max-h-60 overflow-auto">
                                {uniqueCategories.map((category) => (
                                  <Listbox.Option key={category} value={category}>
                                    {({ active }) => (
                                      <div className={`${active ? "bg-gray-100" : ""} px-3 py-2 text-medium`}>
                                        {category}
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
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
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCourses.map((course) => (
                              <tr key={course.id}>
                                <td className="px-4 py-3 text-medium text-gray-900">
                                  {course.title}
                                </td>
                                <td className="px-4 py-3 text-medium text-gray-900">
                                  {course.instructor.fullName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                                  <span
                                    className={`px-2 py-1 rounded-full text-medium font-medium ${course.status === "published"
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
                                <td className="px-4 py-3 text-medium text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-medium text-gray-900">{course.enrollments ?? 0}</td>
                                <td className="px-4 py-3 text-medium text-gray-900">{course.category ?? 'Uncategorized'}</td>
                               <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <Link
                                    to={`/courses/${course.id}`}
                                    className="px-3 py-1 text-sm font-medium rounded border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    aria-label={`View ${course.title}`}
                                  >
                                    View
                                  </Link>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();                  // prevent row handlers from interfering
                                      handleOpenAnalyticsModal(course);
                                    }}
                                    className="px-3 py-1 text-sm font-medium rounded border border-green-500 text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                    aria-label={`Open analytics for ${course.title}`}
                                  >
                                    Analytics
                                  </button>

                                  <button
                                    onClick={() => handleCourseAction(course.id, "delete")}
                                    className="px-3 py-1 text-sm font-medium rounded border border-red-500 text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                    aria-label={`Delete ${course.title}`}
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
                    )}

                    {/* Pending Course Submissions */}
                    <div className="mt-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Pending Course Submissions</h3>

                      {pendingCourses && pendingCourses.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-cyan-700 text-white">
                              <tr>
                                <th className="px-4 py-3 text-left text-medium font-semibold">Course Title</th>
                                <th className="px-4 py-3 text-left text-medium font-semibold">Instructor</th>
                                <th className="px-4 py-3 text-left text-medium font-semibold">Submitted On</th>
                                <th className="px-4 py-3 text-left text-medium font-semibold">Category</th>
                                <th className="px-4 py-3 text-left text-medium font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {pendingCourses.map((course) => (
                                <tr key={course.id}>
                                  <td className="px-4 py-3 text-medium text-gray-900">{course.title}</td>
                                  <td className="px-4 py-3 text-medium text-gray-900">{course.instructor.fullName}</td>
                                  <td className="px-4 py-3 text-medium text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</td>
                                  <td className="px-4 py-3 text-medium text-gray-900">{course.category ?? 'Uncategorized'}</td>
                                  <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Link
                                      to={`/courses/${course.id}`}
                                      className="px-3 py-1 text-sm font-medium rounded border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                      aria-label={`View ${course.title}`}
                                    >
                                      View
                                    </Link>

                                    <button
                                      onClick={() => handleCourseAction(course.id, "approve")}
                                      className="px-3 py-1 text-sm font-medium rounded border border-green-500 text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                      aria-label={`Approve ${course.title}`}
                                    >
                                      Approve
                                    </button>

                                    <button
                                      onClick={() => handleCourseAction(course.id, "reject")}
                                      className="px-3 py-1 text-sm font-medium rounded border border-red-500 text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                      aria-label={`Reject ${course.title}`}
                                    >
                                      Reject
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
                </Tab.Panel>

                <Tab.Panel>
                  {/* User Management Tab */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Header with Title and Add Button - Only show when form is not open */}
                    {!showAddUserForm && (
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Educator Management</h3>
                        <button
                          onClick={handleAddUserClick}
                          className="px-4 py-2 border border-transparent rounded-2xl shadow-sm text-medium font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                        >
                          Add New Educator
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
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                        <div className="w-56">
                          <Listbox value={userStatusFilter} onChange={setUserStatusFilter}>
                            <div className="relative">
                              <Listbox.Button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-medium text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
                                {userStatusFilter === "all"
                                  ? "Filter by Status"
                                  : userStatusFilter.charAt(0).toUpperCase() + userStatusFilter.slice(1)}
                              </Listbox.Button>
                              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10">
                                  {["all", "active", "suspended", "deactivated"].map((opt) => (
                                    <Listbox.Option key={opt} value={opt}>
                                      {({ active }) => (
                                        <div className={`${active ? "bg-gray-100" : ""} px-3 py-2 text-medium`}>
                                          {opt === 'all' ? 'Filter by Status' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        </div>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>
                      </div>
                    )}

                    {/* User Table and Loading/Error States - Only show when form is not open */}
                    {!showAddUserForm && (
                      <>
                        {filteredUsers.length === 0 ? (
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
                                  {paginatedUsers.map((user) => (
                                    <tr key={user.id}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          {user.avatarUrl ? (
                                            <img
                                              src={user.avatarUrl}
                                              alt={user.fullName}
                                              className="w-10 h-10 rounded-full mr-3 object-cover"
                                              onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = "https://placehold.co/40x40/cccccc/ffffff?text=U"; }}
                                            />
                                          ) : (
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                              <span className="text-white text-medium font-medium">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                              </span>
                                            </div>
                                          )}
                                          <div>
                                            <div className="text-medium font-medium text-gray-900">
                                              {user.fullName && user.fullName.length > 40
                                                ? user.fullName.slice(0, 37) + "..."
                                                : user.fullName}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">
                                        {user.email && user.email.length > 30 ? user.email.slice(0, 27) + "..." : user.email}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-medium font-medium ${true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                          {user.status || 'Active'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                      </td>

                                      {/* Actions cell: inline View / Edit / Delete buttons (styled like screenshot) */}
                                      <td className="px-6 py-4 whitespace-nowrap text-medium font-medium">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => handleViewUser(user)}
                                            className="px-3 py-1 text-medium font-medium rounded border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            aria-label={`View ${user.fullName}`}
                                          >
                                            View
                                          </button>

                                          <button
                                            onClick={() => handleEditUserClick(user)}
                                            className="px-3 py-1 text-medium font-medium rounded border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                            aria-label={`Edit ${user.fullName}`}
                                          >
                                            Edit
                                          </button>

                                          <button
                                            onClick={() => handleDeleteUserClick(user)}
                                            className="px-3 py-1 text-medium font-medium rounded border border-red-500 text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                            aria-label={`Delete ${user.fullName}`}
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

                            {/* Pagination */}
                            {totalUsersPages > 1 && (
                              <div className="flex items-center justify-between mt-6">
                                <div className="text-medium text-gray-700">
                                  Page {usersCurrentPage} of {totalUsersPages}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setUsersCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={usersCurrentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded text-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Previous
                                  </button>
                                  <button
                                    onClick={() => setUsersCurrentPage((prev) => Math.min(totalUsersPages, prev + 1))}
                                    disabled={usersCurrentPage === totalUsersPages}
                                    className="px-3 py-1 border border-gray-300 rounded text-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>


          <Transition appear show={showAnalyticsModal} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={handleCloseAnalyticsModal}>
            {/* overlay with lower z-index */}
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            </Transition.Child>

            <div className="min-h-screen px-4 text-center">
              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                {/* Panel with higher stacking context so it stays above the overlay */}
                <Dialog.Panel className="inline-block w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative z-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-cyan-700" />
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {selectedCourseAnalytics?.title ?? "Course"} — Analytics
                      </Dialog.Title>
                    </div>
                    <div>
                      <button onClick={handleCloseAnalyticsModal} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
                    </div>
                  </div>

                  {/* your safe chart / fallback rendering (unchanged) */}
                  {/* ... */}
                  {(() => {
                    const data = selectedCourseAnalytics?.enrollmentHistory ?? [];
                    if (data.length === 0) {
                      return (
                        <div className="h-80 flex flex-col items-center justify-center text-center text-gray-600">
                          <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 3L3 21" />
                          </svg>
                          <p className="text-lg font-medium">No analytics available</p>
                          <p className="text-sm mt-1">There is no enrollment history or analytics data for this course.</p>
                        </div>
                      );
                    }

                    // otherwise render chart
                    return (
                      <>
                        <div style={{ width: "100%", height: 320 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={data}
                              margin={{ top: 8, right: 24, left: 8, bottom: 10 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e6eef2" />
                              <XAxis dataKey="month" stroke="#6b7280" tickLine={false} axisLine={false} />
                              <YAxis stroke="#6b7280" tickLine={false} axisLine={false} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(data ?? []).reduce((s, d) => s + (d?.students ?? 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Enrollments</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">—</div>
                            <div className="text-sm text-gray-600">Completion Rate</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">—</div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        </div>
      </div>

      { /* Headless UI Dialogs for View / Edit / Delete / Add User and toast */ }

      <Transition appear show={!!selectedUser} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseViewUserModal}>
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
                <Dialog.Panel className="w-full max-w-lg min-h-[400px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-3">Educator Details</Dialog.Title>
                  <div className="space-y-2 text-medium text-gray-700">
                    <p><strong>Full Name:</strong> {selectedUser?.fullName}</p>
                    <p><strong>Email:</strong> {selectedUser?.email}</p>
                    <p><strong>Contact Number:</strong> {selectedUser?.contactNumber || "N/A"}</p>
                    <p><strong>National ID:</strong> {selectedUser?.nationalId || "N/A"}</p>
                    <p><strong>Residential Address:</strong> {selectedUser?.residentialAddress || "N/A"}</p>
                    <p><strong>Gender:</strong> {selectedUser?.gender || "N/A"}</p>
                    <p><strong>Status:</strong> {selectedUser?.status}</p>
                    <p><strong>Registered On:</strong> {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</p>
                    <p className="break-all"><strong>User ID:</strong> {selectedUser?.id}</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleCloseViewUserModal} className="px-4 py-2 bg-gray-100 rounded-md">Close</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={!!editingUser} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseEditUserModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl min-h-[700px] transform overflow-hidden rounded-2xl bg-white px-12 py-10 shadow-xl transition-all my-20 ml-10">
                  <Dialog.Title className="text-xl font-medium text-gray-900 mb-3">Edit Educator</Dialog.Title>
                  {editingUser && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // validate editingUser
                      const errors = { fullName: "", email: "", contactNumber: "", nationalId: "", residentialAddress: "", gender: "" };
                      let valid = true;
                      if (!editingUser.fullName || !editingUser.fullName.trim()) { errors.fullName = "Full name is required"; valid = false; }
                      if (!editingUser.email || !editingUser.email.trim()) { errors.email = "Email is required"; valid = false; }
                      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editingUser.email)) { errors.email = "Invalid email"; valid = false; }
                      if (editingUser.contactNumber && !/^\d{10,15}$/.test(editingUser.contactNumber)) { errors.contactNumber = "Contact must be 10-15 digits"; valid = false; }
                      if (editingUser.nationalId && editingUser.nationalId.length < 5) { errors.nationalId = "National ID is too short"; valid = false; }
                      if (editingUser.residentialAddress && editingUser.residentialAddress.length < 5) { errors.residentialAddress = "Address is too short"; valid = false; }
                      setEditFormErrors(errors);
                      if (!valid) return;

                      // call existing handler (signature: userId, updatedData)
                      handleSaveEditedUser(editingUser.id, editingUser);
                    }}
                    className="space-y-3"
                  >
                    {/* compact grid: 2 columns on md+, stacked on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-medium font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          value={editingUser.fullName || ""}
                          onChange={e => setEditingUser((prev: any) => ({ ...prev, fullName: e.target.value }))}
                          className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter full name"
                        />
                        {editFormErrors.fullName && <p className="text-red-500 text-xs mt-1">{editFormErrors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-medium font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editingUser.email || ""}
                          onChange={e => setEditingUser((prev: any) => ({ ...prev, email: e.target.value }))}
                          className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter email"
                        />
                        {editFormErrors.email && <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-medium font-medium text-gray-700 mb-2">Contact Number</label>
                        <input
                          value={editingUser.contactNumber || ""}
                          onChange={e => setEditingUser((prev: any) => ({ ...prev, contactNumber: e.target.value }))}
                          className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Contact number"
                        />
                        {editFormErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{editFormErrors.contactNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-medium font-medium text-gray-700 mb-2">National ID</label>
                        <input
                          value={editingUser.nationalId || ""}
                          onChange={e => setEditingUser((prev: any) => ({ ...prev, nationalId: e.target.value }))}
                          className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="National ID"
                        />
                        {editFormErrors.nationalId && <p className="text-red-500 text-xs mt-1">{editFormErrors.nationalId}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-medium font-medium text-gray-700 mb-2">Residential Address</label>
                      <input
                        value={editingUser.residentialAddress || ""}
                        onChange={e => setEditingUser((prev: any) => ({ ...prev, residentialAddress: e.target.value }))}
                        className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Residential address"
                      />
                      {editFormErrors.residentialAddress && <p className="text-red-500 text-xs mt-1">{editFormErrors.residentialAddress}</p>}
                    </div>

                    {/* compact gender radio group (small pill buttons) */}
                    <div>
                      <label className="block text-medium font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex gap-2">
                        {["male", "female", "other"].map((g) => {
                          const checked = (editingUser.gender || "") === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setEditingUser((prev: any) => ({ ...prev, gender: g }))}
                              className={`px-3 py-1 text-medium rounded-md border ${checked ? 'bg-white text-cyan-700 border-cyan-700 shadow-sm' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                      {editFormErrors.gender && <p className="text-red-500 text-xs mt-1">{editFormErrors.gender}</p>}
                    </div>

                    {/* account status inline / compact */}
                    <div>
                      <label className="block text-medium font-medium text-gray-700 mb-2">Account Status</label>
                      <select
                        value={editingUser.status || "active"}
                        onChange={e => setEditingUser((prev: any) => ({ ...prev, status: e.target.value }))}
                        className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="deactivated">Deactivated</option>
                      </select>
                    </div>

                    {/* tighter action row */}
                    <div className="flex justify-end gap-3 mt-3">
                      <button type="button" onClick={handleCloseEditUserModal} className="px-4 py-2 border border-gray-300 rounded-2xl shadow-sm text-medium font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 border border-transparent rounded-2xl shadow-sm text-medium font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800">
                        Save
                      </button>
                    </div>
                  </form>
                )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={!!userToDelete} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseDeleteConfirmModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900">Confirm Deletion</Dialog.Title>
                  <div className="mt-3 text-sm text-gray-700">
                    Are you sure you want to delete <strong>{userToDelete?.fullName}</strong>? This action cannot be undone.
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={handleCloseDeleteConfirmModal} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                    <button onClick={handleConfirmDeleteUser} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add New Educator Dialog (moved from inline form to Headless UI Dialog) */}
    <Transition appear show={showAddUserForm} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setShowAddUserForm(false)}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center pt-20 pb-10 px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl min-h-[700px] transform overflow-hidden rounded-2xl bg-white px-12 py-10 shadow-xl transition-all my-20 ml-10">
                <Dialog.Title className="text-xl font-medium text-gray-900 mb-3">Add New Educator</Dialog.Title>

                <form onSubmit={handleSaveNewUser} className="space-y-1">
                  {/* 2-column compact grid on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="fullName" className="block text-medium font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        className="mt-2 block w-full px-4 py-2 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Full Name"
                        value={formData.fullName}
                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                      {addFormErrors.fullName && <p className="text-red-500 text-xs mt-1">{addFormErrors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-medium font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-2 py-1 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                      {addFormErrors.email && <p className="text-red-500 text-xs mt-1">{addFormErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="password" className="block text-medium font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-2 py-1 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Set a password or leave for default"
                        value={formData.password}
                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />

                      {/* Live password checklist */}
                      <div className="mt-2 text-xs" aria-live="polite">
                        <ul className="space-y-1">
                          <li className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-white bg-current" style={{background: passwordChecks.length ? '#16a34a' : '#d1d5db'}} aria-hidden>
                              {passwordChecks.length ? "✓" : ""}
                            </span>
                            Minimum 8 characters
                          </li>
                          <li className={`flex items-center gap-2 ${passwordChecks.letter ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-white bg-current" style={{background: passwordChecks.letter ? '#16a34a' : '#d1d5db'}} aria-hidden>
                              {passwordChecks.letter ? "✓" : ""}
                            </span>
                            Contains a letter
                          </li>
                          <li className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-white bg-current" style={{background: passwordChecks.number ? '#16a34a' : '#d1d5db'}} aria-hidden>
                              {passwordChecks.number ? "✓" : ""}
                            </span>
                            Contains a number
                          </li>
                        </ul>
                      </div>

                      {/* inline validation / server error */}
                      {addFormErrors.password && <p className="text-red-500 text-xs mt-2" role="alert">{addFormErrors.password}</p>}
                    </div>

                    <div>
                      <label htmlFor="contactNumber" className="block text-medium font-medium text-gray-700">Contact Number</label>
                      <input
                        type="text"
                        id="contactNumber"
                        className="mt-1 block w-full px-2 py-1 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Contact Number"
                        value={formData.contactNumber}
                        onChange={e => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                      />
                      {addFormErrors.contactNumber && <p className="text-red-500 text-xs mt-1">{addFormErrors.contactNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="nationalId" className="block text-medium font-medium text-gray-700">National ID</label>
                      <input
                        type="text"
                        id="nationalId"
                        className="mt-1 block w-full px-2 py-1 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter National ID"
                        value={formData.nationalId}
                        onChange={e => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                      />
                      {addFormErrors.nationalId && <p className="text-red-500 text-xs mt-1">{addFormErrors.nationalId}</p>}
                    </div>

                    <div>
                      <label htmlFor="residentialAddress" className="block text-medium font-medium text-gray-700">Residential Address</label>
                      <input
                        type="text"
                        id="residentialAddress"
                        className="mt-1 block w-full px-2 py-1 text-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Residential Address"
                        value={formData.residentialAddress}
                        onChange={e => setFormData(prev => ({ ...prev, residentialAddress: e.target.value }))}
                      />
                      {addFormErrors.residentialAddress && <p className="text-red-500 text-xs mt-1">{addFormErrors.residentialAddress}</p>}
                    </div>
                  </div>

                  {/* compact gender radio pills */}
                  <div>
                    <label className="block text-medium font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-2">
                      {["male", "female", "other"].map((g) => {
                        const checked = formData.gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                            className={`px-3 py-1 text-medium rounded-md border ${checked ? 'bg-white text-cyan-700 border-cyan-700 shadow-sm' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                    {addFormErrors.gender && <p className="text-red-500 text-xs mt-1">{addFormErrors.gender}</p>}
                  </div>

                  {/* compact action row */}
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleCancelAddUser}
                      className="px-4 py-2 border border-gray-300 rounded-2xl shadow-sm text-medium font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-2xl shadow-sm text-medium font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                      disabled={isAddingEducator}
                    >
                      {isAddingEducator ? "Adding..." : "Add Educator"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

      { /* Toast with Transition */ }
      <Transition
        show={!!modalMessage}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 translate-y-2"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white border shadow-md px-4 py-2 rounded-md">
            <div className="flex items-center justify-between space-x-4">
              <div className="text-sm text-gray-800">{modalMessage}</div>
              <button onClick={handleModalClose} className="text-gray-500">Close</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default CourseAdminDashboard;