"use client"

import type React from "react"
import { BookOpen, Users, TrendingUp, Plus, Edit, BarChart3 } from "lucide-react"
import { useGetEducatorDashboardQuery, useGetMyCoursesQuery } from "../../utils/api"
import { useNavigate } from "react-router-dom"


const EducatorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data: dashboardData, isLoading: dashboardLoading } = useGetEducatorDashboardQuery()
  const { data: coursesData, isLoading: coursesLoading } = useGetMyCoursesQuery()

  if (dashboardLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">Welcome back, Mrs. Nadee Fernando!</h1>
          <p className="text-cyan-700">Manage your courses and track student progress</p>
        </div>

        {/* Stats Overview - Matching exact Figma design */}
        <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
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

        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
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

        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
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

        {/* My Courses  */}
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

          {coursesData.courses.length === 0 ? (
            
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
          ) : (
      <div className="grid grid-cols-3 gap-4 mb-8">
              {coursesData.courses.map((course) => (
                <div key={course.id} className="border border-blue-100 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-blue-50">
                  <img
                   src={course.thumbnailUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-50 object-cover rounded-xl mb-4"
                  />

                  <div className="flex items-center justify-between mb-2">
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.difficultyLevel === "beginner"
                          ? "bg-green-100 text-green-800"
                          : course.difficultyLevel === "intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="font-semibold text-blue-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-blue-700 mb-4 line-clamp-2">{course.subtitle}</p>

                  <div className="flex items-center justify-between text-sm text-blue-600 mb-4">
                    <span>{course.category}</span>
                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        navigate(`/courses/${course.id}`)
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-2 px-3 rounded-xl text-sm hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/educator/courses/${course.id}/edit`)}
                      className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-xl text-sm hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/educator/courses/${course.id}/analytics`)}
                      className="bg-green-600 text-white py-2 px-3 rounded-xl text-sm hover:bg-green-700 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
        
  )
}

export default EducatorDashboard