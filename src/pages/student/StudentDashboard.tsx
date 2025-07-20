"use client"

import type React from "react"
import { BookOpen, Award, Zap, TrendingUp, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetMyDashboardQuery } from "../../utils/api"
import Footer from "../../components/Footer"

const StudentDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useGetMyDashboardQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-700 mb-2">Welcome Back!</h1>
        <p className="text-cyan-600">Continue your quantum computing journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.points.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.badges.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.learningStreak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.enrolledCourses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-700">My Courses</h2>
            <Link to="/my-courses" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                <Link
                  to="/courses"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              dashboardData.enrolledCourses.slice(0, 3).map((enrollment) => (
                <div className="grid grid-cols-3 gap-4 mb-8">
                <Link
                  key={enrollment.course.id}
                  to={`/courses/${enrollment.course.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer block"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={enrollment.course.thumbnailUrl || "/1.png"}
                      alt={enrollment.course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{enrollment.course.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.course.difficultyLevel === "beginner"
                              ? "bg-green-100 text-green-800"
                              : enrollment.course.difficultyLevel === "intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {enrollment.course.difficultyLevel}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${enrollment.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-700">Recent Achievements</h2>
            <Link to="/achievements" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.achievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No achievements yet</p>
                <p className="text-sm text-gray-500">Complete lessons to earn your first badge!</p>
              </div>
            ) : (
              dashboardData.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={achievement.badge.iconUrl || "/2.png"}
                    alt={achievement.badge.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.badge.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.badge.description}</p>
                    <p className="text-xs text-gray-500">
                      Earned {new Date(achievement.achievedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      {dashboardData.recommendedCourses.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-700">Recommended for You</h2>
            <Link to="/recommended-courses" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recommendedCourses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer block"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnailUrl || "/1.png"}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.subtitle}</p>
                    <div className="flex items-center justify-between">
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
                      <span className="text-sm text-gray-500">{course.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/simulators/circuit"
          className="bg-gradient-to-r from-cyan-800 to-cyan-500 text-white p-6 rounded-xl hover:from-cyan-900 hover:to-cyan-600 transition-colors block"
        >
          <Zap className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Circuit Simulator</h3>
          <p className="text-blue-100">Build and test quantum circuits</p>
        </Link>

        <Link
          to="/simulators/network"
          className="bg-gradient-to-r from-cyan-800 to-cyan-500 text-white p-6 rounded-xl hover:from-cyan-900 hover:to-cyan-600 transition-colors block"
        >
          <Zap className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Network Simulator</h3>
          <p className="text-blue-100">Explore quantum networks</p>
        </Link>

        <Link
          to="/courses"
          className="bg-gradient-to-r from-cyan-800 to-cyan-500 text-white p-6 rounded-xl hover:from-cyan-900 hover:to-cyan-600 transition-colors block"
        >
          <BookOpen className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Browse Courses</h3>
          <p className="text-blue-100">Discover new learning paths</p>
        </Link>
      </div>
    </div>
    
    <Footer />
    </>
  )
}

export default StudentDashboard
