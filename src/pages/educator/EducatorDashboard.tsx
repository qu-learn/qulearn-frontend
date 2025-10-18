"use client"

import type React from "react"
import { useState, Fragment, useMemo } from "react"
import { BookOpen, Users, TrendingUp, Plus, Edit, BarChart3, Trash2, MoreVertical, Search } from "lucide-react"
import { useGetEducatorDashboardQuery, useGetMyCoursesQuery } from "../../utils/api"
import { useNavigate } from "react-router-dom"
import { Tab, Dialog, Transition, Menu } from "@headlessui/react"


const EducatorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data: dashboardData, isLoading: dashboardLoading } = useGetEducatorDashboardQuery()
  const { data: coursesData, isLoading: coursesLoading } = useGetMyCoursesQuery()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!coursesData?.courses) return []
    if (!searchQuery.trim()) return coursesData.courses
    
    const query = searchQuery.toLowerCase()
    return coursesData.courses.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.subtitle?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    )
  }, [coursesData?.courses, searchQuery])

  if (dashboardLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </Transition>
      </div>
    )
  }

  if (!dashboardData || !coursesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-blue-700">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyan-700 mb-2">Welcome back, Mrs. Nadee Fernando!</h1>
            <p className="text-cyan-700">Manage your courses and track student progress</p>
          </div>
        </Transition>

        {/* Stats Overview - Matching exact Figma design */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
        >
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="w-15 h-15 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <div className="ml-20">
                  <div className="text-4xl font-bold text-gray-900 mb-5">{dashboardData.publishedCoursesCount}</div>
                  <p className="text-gray-600 text-sm font-medium mb-m">Published Courses</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center ">
                <div className="w-15 h-15 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <div className="ml-20">
                  <div className="text-4xl font-bold text-gray-900 mb-5">{dashboardData.totalStudents}</div>
                  <p className="text-gray-600 text-sm font-medium mb-3 ">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="w-15 h-15 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-blue-600" />
                </div>
                <div className="ml-20">
                  <div className="text-4xl font-bold text-gray-900 mb-5">{coursesData.courses.length}</div>
                  <p className="text-gray-600 text-sm font-medium mb-3">All Courses</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        {/* Quick Actions - Matching exact Figma design */}
        {/* <div className="flex gap-20 mb-8 justify-center">
          <button
            onClick={() => navigate("/educator/courses/new")}
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm font-medium py-4 px-8 rounded-lg transition-colors hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 ">
            <Plus className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create New Course</h3>
          <p className="text-blue-100">Your next quantum computing course</p>
          </button>

          <button
            onClick={() => navigate("/simulators/circuit")}
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm font-medium py-4 px-8 rounded-lg transition-colors hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 ">
            <Edit className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Circuit Simulator</h3>
          <p className="text-purple-100">Create interactive circuit examples</p>
          </button>

          <button
            onClick={() => navigate("/simulators/network")}
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-sm font-medium py-4 px-8 rounded-lg transition-colors hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 ">
            <BarChart3 className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Network Simulator</h3>
          <p className="text-green-100">Design quantum network examples</p>
          </button>
        </div> */}

        {/* My Courses with Tab Group */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-700">My Courses</h2>
              <button
                onClick={() => navigate("/educator/courses/new")}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
              >
                Create New Course
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by name, description, or category..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="text-sm font-medium">Clear</span>
                </button>
              )}
            </div>

            {coursesData.courses.length === 0 ? (
              <Transition
                show={true}
                as={Fragment}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No courses yet</h3>
                  <p className="text-blue-700 mb-6">Create your first course to start teaching quantum computing</p>
                  <button
                    onClick={() => navigate("/educator/courses/new")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Create Your First Course
                  </button>
                </div>
              </Transition>
            ) : (
              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex space-x-2 rounded-xl bg-blue-100 p-1 mb-6">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        All Courses
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        Published
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        Draft
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        Under Review
                      </button>
                    )}
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 0}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} navigate={navigate} />
                          ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 1}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "published").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No published courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {filteredCourses
                            .filter((course) => course.status === "published")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 2}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "draft").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No draft courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {filteredCourses
                            .filter((course) => course.status === "draft")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 3}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "under-review").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No courses under review found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-6">
                          {filteredCourses
                            .filter((course) => course.status === "under-review")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            )}
          </div>
        </Transition>
      </div>
    </div>
  )
}

// Course Card Component with Menu and Delete
const CourseCard: React.FC<{ course: any; navigate: any }> = ({ course, navigate }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // TODO: Implement delete course API endpoint
      console.log("Delete course:", course.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete course:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white border border-blue-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        {/* Image with overlay badges */}
        <div className="relative">
          <img
            src={course.thumbnailUrl || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-sm ${
                course.status === "published"
                  ? "bg-green-100/90 text-green-800"
                  : course.status === "under-review"
                    ? "bg-yellow-100/90 text-yellow-800"
                    : course.status === "rejected"
                      ? "bg-red-100/90 text-red-800"
                      : "bg-gray-100/90 text-gray-800"
              }`}
            >
              {course.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-sm ${
                course.difficultyLevel === "beginner"
                  ? "bg-green-100/90 text-green-800"
                  : course.difficultyLevel === "intermediate"
                    ? "bg-yellow-100/90 text-yellow-800"
                    : "bg-red-100/90 text-red-800"
              }`}
            >
              {course.difficultyLevel}
            </span>
          </div>
          
          {/* Menu Button */}
          <div className="absolute top-3 right-3">
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowDeleteDialog(true)}
                          className={`${
                            active ? 'bg-red-50' : ''
                          } group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Course
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-blue-900 mb-2 line-clamp-1">{course.title}</h3>
          <p className="text-sm text-blue-700 mb-4 line-clamp-2 min-h-[40px]">{course.subtitle}</p>

          <div className="flex items-center justify-between text-xs text-blue-600 mb-4 pb-4 border-b border-blue-100">
            <span className="font-semibold">{course.category}</span>
            <span className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 flex items-center justify-center"
            >
              View
            </button>
            <button
              onClick={() => navigate(`/educator/courses/${course.id}/edit`)}
              className="bg-gray-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(`/educator/courses/${course.id}/analytics`)}
              className="bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Transition show={showDeleteDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-2">
                    Delete Course
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to delete <span className="font-semibold text-gray-900">"{course.title}"</span>? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default EducatorDashboard