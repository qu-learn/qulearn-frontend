import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Users, BookOpen, TrendingUp, CheckCircle, XCircle, Eye, Trash2, X, Edit3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // Re-imported Recharts components for analytics chart
import { useAddEducatorMutation } from "../../utils/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  nationalId?: string;
  residentialAddress?: string;
  gender?: string;
  status: string;
  createdAt: Date;
  avatarUrl: string | null;
}
// Define interfaces for modal props
interface CustomModalProps {
  message: string | null;
  onClose: () => void;
}

interface IAddEducatorRequest {
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  nationalId: string;
  residentialAddress: string;
  gender: string;
}

interface ViewUserModalProps {
  user: User | null;
  onClose: () => void;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, updatedData: any) => void; // 'any' for updatedData for now, could be more specific
}

interface DeleteConfirmModalProps {
  userName: string;
  onDelete: () => void;
  onClose: () => void;
}

// Custom Modal Component
const CustomModal = ({ message, onClose }: CustomModalProps) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// View User Modal Component
const ViewUserModal = ({ user, onClose }: ViewUserModalProps) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-gray-700">
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact Number:</strong> {user.contactNumber || 'N/A'}</p>
          <p><strong>National ID:</strong> {user.nationalId || 'N/A'}</p>
          <p><strong>Residential Address:</strong> {user.residentialAddress || 'N/A'}</p>
          <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
          <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>{user.status}</span></p>
          <p><strong>Registered On:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p> {/* Changed to direct Date object */}
          <p className="break-all"><strong>User ID:</strong> {user.id}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    contactNumber: user.contactNumber || '',
    nationalId: user.nationalId || '',
    residentialAddress: user.residentialAddress || '',
    gender: user.gender || '',
    status: user.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              type="text"
              id="nationalId"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.nationalId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">Residential Address</label>
            <input
              type="text"
              id="residentialAddress"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.residentialAddress}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-semibold text-sm shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ userName, onDelete, onClose }: DeleteConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">Are you sure you want to delete user "{userName}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-semibold text-sm shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 font-semibold text-sm shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// Mock data for analytics (overall enrollments)
const mockOverallEnrollmentData = [
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
  enrollments: number; // Keep this for the table display
  category: string;
  enrollmentHistory?: { month: string; students: number; }[]; // Added for course-specific analytics
}

interface SelectedCourseAnalytics {
  id: string;
  title: string;
  status: string;
  enrollmentHistory?: { month: string; students: number; }[]; // Added for course-specific analytics
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
      instructor: { fullName: "Prof. Johnson" },
      status: "under-review",
      createdAt: "2024-02-20T14:20:00Z",
      enrollments: 0,
      category: "Advanced Algorithms",
      enrollmentHistory: [
        { month: 'Feb', students: 0 }, { month: 'Mar', students: 0 },
        { month: 'Apr', students: 0 }, { month: 'May', students: 0 },
        { month: 'Jun', students: 0 }, { month: 'Jul', students: 0 },
      ],
    },
    {
      id: "c3",
      title: "Quantum Computing Basics",
      instructor: { fullName: "Dr. Williams" },
      status: "published",
      createdAt: "2024-03-10T09:15:00Z",
      enrollments: 320,
      category: "Quantum Basics",
      enrollmentHistory: [
        { month: 'Mar', students: 80 }, { month: 'Apr', students: 120 },
        { month: 'May', students: 200 }, { month: 'Jun', students: 280 },
        { month: 'Jul', students: 320 },
      ],
    },
    {
      id: "c5",
      title: "Introduction to AI",
      instructor: { fullName: "Dr. Alice" },
      status: "published",
      createdAt: "2024-04-01T10:00:00Z",
      enrollments: 600,
      category: "Artificial Intelligence",
      enrollmentHistory: [
        { month: 'Apr', students: 100 }, { month: 'May', students: 250 },
        { month: 'Jun', students: 400 }, { month: 'Jul', students: 600 },
      ],
    },
    {
      id: "c6",
      title: "Machine Learning Fundamentals",
      instructor: { fullName: "Dr. Bob" },
      status: "rejected",
      createdAt: "2024-04-10T11:00:00Z",
      enrollments: 0,
      category: "Artificial Intelligence",
      enrollmentHistory: [], // No enrollments as it's rejected
    },
    {
      id: "c7",
      title: "Data Science with Python",
      instructor: { fullName: "Prof. Carol" },
      status: "published",
      createdAt: "2024-05-05T13:00:00Z",
      enrollments: 720,
      category: "Data Science",
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
      instructor: { fullName: "Dr. Brown" },
      createdAt: "2024-03-25T11:45:00Z",
      category: "Quantum Basics", // Added category for pending course for consistency
      enrollmentHistory: [], // Pending courses likely have no enrollment history yet
    },
  ],
};

// Mock users data to be pre-populated
const mockUsersToPrepopulate: User[] = [
  {
    id: "U001",
    fullName: "John Doe",
    email: "john@example.com",
    contactNumber: "123-456-7890",
    nationalId: "NID-001",
    residentialAddress: "123 Main St, New York, USA",
    gender: "male",
    status: "Active",
    createdAt: new Date("2023-01-10T08:00:00Z"), // Convert to Date object
    avatarUrl: null,
  },
  {
    id: "U002",
    fullName: "Jane Smith",
    email: "jane@example.com",
    contactNumber: "098-765-4321",
    nationalId: "NID-002",
    residentialAddress: "456 Oak Ave, London, UK",
    gender: "female",
    status: "Inactive",
    createdAt: new Date("2023-02-15T10:30:00Z"), // Convert to Date object
    avatarUrl: null,
  },
  {
    id: "U003",
    fullName: "Peter Jones",
    email: "peter@example.com",
    contactNumber: "111-222-3333",
    nationalId: "NID-003",
    residentialAddress: "789 Pine Rd, Sydney, AU",
    gender: "male",
    status: "Active",
    createdAt: new Date("2023-03-01T12:00:00Z"),
    avatarUrl: null,
  },
  {
    id: "U004",
    fullName: "Alice Brown",
    email: "alice@example.com",
    contactNumber: "444-555-6666",
    nationalId: "NID-004",
    residentialAddress: "101 Elm St, Toronto, CA",
    gender: "female",
    status: "Active",
    createdAt: new Date("2023-04-20T09:00:00Z"),
    avatarUrl: null,
  },
  {
    id: "U005",
    fullName: "Robert White",
    email: "robert@example.com",
    contactNumber: "777-888-9999",
    nationalId: "NID-005",
    residentialAddress: "202 Birch Ln, Berlin, DE",
    gender: "male",
    status: "Inactive",
    createdAt: new Date("2023-05-10T11:00:00Z"),
    avatarUrl: null,
  },
  {
    id: "U006",
    fullName: "Emily Green",
    email: "emily@example.com",
    contactNumber: "123-987-6543",
    nationalId: "NID-006",
    residentialAddress: "303 Cedar Blvd, Paris, FR",
    gender: "female",
    status: "Active",
    createdAt: new Date("2023-06-01T14:00:00Z"),
    avatarUrl: null,
  },
];


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

  const [addEducator, { isLoading: isAddingEducator }] = useAddEducatorMutation();

  // State for course management filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State for mutable course data
  const [courses, setCourses] = useState(initialMockCoursesData.courses);
  const [pendingCourses, setPendingCourses] = useState(initialMockCoursesData.pendingCourses);

  // State variables for User Management Tab
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsersToPrepopulate); // Initialize with mock data
  const [usersCurrentPage, setUsersCurrentPage] = useState(1); // Separate pagination for users
  const [usersPerPage] = useState(5); // Number of users to display per page
  const [userSearchTerm, setUserSearchTerm] = useState(''); // Search term for users
  const [userStatusFilter, setUserStatusFilter] = useState('All'); // Status filter for users

  // States for user modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // State for custom modal
  const [modalMessage, setModalMessage] = useState('');

  // Mock API responses (assuming these are static for this example)
  const dashboardData = mockDashboardData;
  const coursesLoading = false;
  const dashboardLoading = false;

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

  // Filtered users based on search and filter criteria
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (userSearchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    if (userStatusFilter !== "All") {
      filtered = filtered.filter((user) => user.status === userStatusFilter);
    }

    return filtered;
  }, [userSearchTerm, userStatusFilter, users]);


  // Function to handle course actions (approve, reject, delete)
  const handleCourseAction = async (courseId: string, action: string) => {
    try {
      // Logic to update the status of courses in the main 'courses' list
      if (action === "approve" || action === "reject" || action === "delete") {
        setCourses(prevCourses => {
          const updatedCourses = prevCourses.map(course => {
            if (course.id === courseId) {
              if (action === "approve") {
                return { ...course, status: "published" };
              } else if (action === "reject") {
                return { ...course, status: "rejected" };
              }
            }
            return course;
          }).filter(course => !(action === "delete" && course.id === courseId));
          return updatedCourses;
        });

        // Logic to handle courses in the 'pendingCourses' list
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
      setModalMessage(`Failed to ${action} course: ${error.message}`);
    }
  };


  const handleViewAnalytics = (course: Course) => {
    const { id, title, status, enrollmentHistory } = course; // Destructure enrollmentHistory
    setSelectedCourseAnalytics({ id, title, status, enrollmentHistory }); // Pass it here
    setActiveTab("analytics");
  };

  const handleCloseAnalytics = () => {
    setSelectedCourseAnalytics(null);
    setActiveTab("courses");
  };

  // User Management Event Handlers
  const handleAddUserClick = () => {
    setShowAddUserForm(true);
  };

  const handleCancelAddUser = () => {
    setShowAddUserForm(false);
  };

  const handleSaveNewUser = async (event: React.FormEvent) => {
    event.preventDefault();

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
      // API request (optional, can be mocked)
      await addEducator({
        ...formData,
        password: formData.password || "defaultPassword",
      }).unwrap();

      // Add to local state
      const newUser: User = {
        id: newId,
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        nationalId: formData.nationalId,
        residentialAddress: formData.residentialAddress,
        gender: formData.gender,
        status: "Active",
        createdAt: new Date(),
        avatarUrl: null,
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
      setModalMessage(`Failed to add user: ${error.message}`);
    }
  };

  const handleViewUser = (user: User) => { // Explicitly type user
    setSelectedUser(user);
  };

  const handleCloseViewUserModal = () => {
    setSelectedUser(null);
  };

  const handleEditUserClick = (user: User) => { // Explicitly type user
    setEditingUser(user);
  };

  const handleSaveEditedUser = async (userId: string, updatedData: any) => {
    try {
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, ...updatedData } : user
      ));
      setModalMessage("User updated successfully!");
      setEditingUser(null);
    } catch (error: any) {
      console.error("Error updating user:", error);
      setModalMessage(`Failed to update user: ${error.message}`);
    }
  };

  const handleCloseEditUserModal = () => {
    setEditingUser(null);
  };

  const handleDeleteUserClick = (user: User) => { // Explicitly type user
    setUserToDelete(user);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) {
      setModalMessage("No user selected for deletion.");
      return;
    }

    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      setModalMessage(`User "${userToDelete.fullName}" deleted successfully!`);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setModalMessage(`Failed to delete user: ${error.message}`);
    }
  };

  const handleCloseDeleteConfirmModal = () => {
    setUserToDelete(null);
  };

  const handleModalClose = () => {
    setModalMessage('');
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
    courses.forEach(course => {
      if (course.category) {
        categories.add(course.category);
      }
    });
    return ["All", ...Array.from(categories).sort()];
  }, [courses]);

  // Pagination logic for User Management
  const indexOfLastUser = usersCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Calculate max students for bar chart height normalization (for overall enrollments)
  const maxOverallStudents = Math.max(...mockOverallEnrollmentData.map((d) => d.students));


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
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
            <nav className="flex space-x-8 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-cyan-700 text-cyan-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "courses"
                    ? "border-cyan-700 text-cyan-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Course Management
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
              <div>
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">System Overview</h3>
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-200 rounded-lg shadow-sm p-6 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{mockDashboardData.totalUsers}</p>
                    </div>
                  </div>
                  <div className="bg-blue-200 rounded-lg shadow-sm p-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{mockDashboardData.activeCourses}</p>
                    </div>
                  </div>
                  <div className="bg-blue-200 rounded-lg shadow-sm p-6 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">New Registrations</p>
                      <p className="text-2xl font-bold text-gray-900">{mockDashboardData.newRegistrationsThisMonth}</p>
                    </div>
                  </div>
                  <div className="bg-blue-200 rounded-lg shadow-sm p-6 flex items-center">
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
              {/* Enrollment Bar Chart (Overall) */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-cyan-700 mb-6">Monthly Enrollments</h3>
                <div className="flex justify-around items-end h-64 border-b border-gray-200 pb-2">
                  {mockOverallEnrollmentData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center mx-1">
                      <div
                        className="w-full bg-cyan-700 rounded-t-md"
                        style={{
                          height: `${(data.students / maxOverallStudents) * 200}px`, // Max height 200px
                          width: '80%', // Control bar width
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
                          <td className="px-4 py-3 text-sm text-gray-900">{course.category ?? 'Uncategorized'}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Link to={`/courses/${course.id}`}>
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
                            <td className="px-4 py-3 text-sm text-gray-900">{course.category ?? 'Uncategorized'}</td>
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
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
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
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                  >
                    <option value="All">Filter by Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

              {/* Add New Educator Form */}
              {showAddUserForm && (
              <div className="bg-white-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Educator</h4>
                <form onSubmit={handleSaveNewUser} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter Full Name"
                      value={formData.fullName}
                      onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
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
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Set a password or leave for default"
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                      onChange={e => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
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
                      onChange={e => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
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
                      onChange={e => setFormData(prev => ({ ...prev, residentialAddress: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      id="gender"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.gender}
                      onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
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
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-semibold text-sm shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md"
                      disabled={isAddingEducator}
                    >
                      {isAddingEducator ? "Adding..." : "Add User"}
                    </button>
                  </div>
                </form>
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
                              {paginatedUsers.map((user) => (
                                <tr key={user.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 break-all">{user.id}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      {user.avatarUrl ? (
                                        <img
                                          src={user.avatarUrl}
                                          alt={user.fullName}
                                          className="w-10 h-10 rounded-full mr-3 object-cover"
                                          // Corrected type assertion for e.target
                                          onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = "https://placehold.co/40x40/cccccc/ffffff?text=U"; }}
                                        />
                                      ) : (
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-white text-sm font-medium">
                                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
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
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} {/* Changed to direct Date object */}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleViewUser(user)}
                                        className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded border border-blue-600 flex items-center space-x-1"
                                      >
                                        <Eye className="w-4 h-4" /> <span>View</span>
                                      </button>
                                      <button
                                        onClick={() => handleEditUserClick(user)}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs px-2 py-1 rounded border border-indigo-600 flex items-center space-x-1"
                                      >
                                        <Edit3 className="w-4 h-4" /> <span>Edit</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUserClick(user)}
                                        className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded border border-red-600 flex items-center space-x-1"
                                      >
                                        <Trash2 className="w-4 h-4" /> <span>Delete</span>
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
                            <div className="text-sm text-gray-700">
                              Page {usersCurrentPage} of {totalUsersPages}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setUsersCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={usersCurrentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setUsersCurrentPage((prev) => Math.min(totalUsersPages, prev + 1))}
                                disabled={usersCurrentPage === totalUsersPages}
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

            {/* Analytics Tab Content */}
            {activeTab === "analytics" && selectedCourseAnalytics && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Analytics for: {selectedCourseAnalytics.title}
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
                        <LineChart data={selectedCourseAnalytics.enrollmentHistory}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
        {/* The modals are now conditionally rendered based on selectedUser, editingUser, userToDelete */}
        {selectedUser && <ViewUserModal user={selectedUser} onClose={handleCloseViewUserModal} />}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={handleCloseEditUserModal}
            onSave={handleSaveEditedUser}
          />
        )}
        {userToDelete && (
          <DeleteConfirmModal
            userName={userToDelete.fullName}
            onDelete={handleConfirmDeleteUser}
            onClose={handleCloseDeleteConfirmModal}
          />
        )}
        {/* CustomModal is now conditionally rendered based on modalMessage presence */}
        {modalMessage && <CustomModal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
};

export default CourseAdminDashboard;
