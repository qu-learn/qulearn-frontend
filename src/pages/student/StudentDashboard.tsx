"use client"

import type React from "react"
import { BookOpen, Award, Zap, TrendingUp, Target, Users, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetMyDashboardQuery } from "../../utils/api"
// import Footer from "../../components/Footer"

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

      {/* Stats Overview - compact icon tiles */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-cyan-600" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Total Points</p>
          <p className="text-2xl font-bold text-cyan-700">{dashboardData.points.toLocaleString()}</p>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Badges Earned</p>
          <p className="text-2xl font-bold text-cyan-700">{dashboardData.badges.length}</p>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Learning Streak</p>
          <p className="text-2xl font-bold text-cyan-700">{dashboardData.learningStreak}d</p>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Enrolled Courses</p>
          <p className="text-2xl font-bold text-cyan-700">{dashboardData.enrolledCourses.length}</p>
        </div>
      </div>

      {/* Circle badges with colored borders */}
      {/* <div className="mb-8">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-cyan-500">
              <span className="text-xl font-bold text-cyan-600">{dashboardData.points.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Total Points</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-amber-500">
              <span className="text-xl font-bold text-amber-600">{dashboardData.badges.length}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Badges Earned</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-orange-500">
              <span className="text-xl font-bold text-orange-600">{dashboardData.learningStreak}d</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Learning Streak</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-purple-600">
              <span className="text-xl font-bold text-purple-600">{dashboardData.enrolledCourses.length}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">Enrolled Courses</p>
          </div>
        </div>
      </div> */}

      {/* Timer-style counters (professional) */}
      {/* <div className="mb-12">
        <h3 className="sr-only">Timer counters</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col items-center bg-gray-50 py-6 rounded-lg">
            <div className="bg-white rounded-full p-3 shadow-sm mb-3">
              <Target className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="text-3xl font-mono font-semibold text-cyan-700">{dashboardData.points.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">Total Points</div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 py-6 rounded-lg">
            <div className="bg-white rounded-full p-3 shadow-sm mb-3">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-3xl font-mono font-semibold text-amber-600">{dashboardData.badges.length}</div>
            <div className="text-sm text-gray-500 mt-1">Badges Earned</div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 py-6 rounded-lg">
            <div className="bg-white rounded-full p-3 shadow-sm mb-3">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-mono font-semibold text-orange-600">{dashboardData.learningStreak}</div>
            <div className="text-sm text-gray-500 mt-1">Learning Streak (days)</div>
          </div>

          <div className="flex flex-col items-center bg-gray-50 py-6 rounded-lg">
            <div className="bg-white rounded-full p-3 shadow-sm mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-mono font-semibold text-purple-600">{dashboardData.enrolledCourses.length}</div>
            <div className="text-sm text-gray-500 mt-1">Enrolled Courses</div>
          </div>
        </div>
      </div> */}

      {/* Comparative bar-style view removed per request */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses (use MyCourses layout: no extra white container) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-700">My Courses</h2>
            <Link to="/my-courses" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
              View All
            </Link>
          </div>

          {dashboardData.enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No courses enrolled yet</h3>
              <p className="text-blue-700 mb-6">Browse and enroll in courses to start your quantum computing journey</p>
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-10 justify-center">
              {dashboardData.enrolledCourses.slice(0, 3).map((enrollment) => (
                <Link
                  key={enrollment.course.id}
                  to={`/courses/${enrollment.course.id}/dashboard`}
                  className="flex-none w-80 h-[520px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer block group flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={enrollment.course.thumbnailUrl || "/1.png"}
                      alt={enrollment.course.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                          enrollment.course.difficultyLevel === "beginner"
                            ? "bg-green-500 text-white"
                            : enrollment.course.difficultyLevel === "intermediate"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                        }`}
                      >
                        {enrollment.course.difficultyLevel}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
                        {enrollment.course.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-200 line-clamp-1">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                      {enrollment.course.subtitle}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="mr-3 truncate">By {enrollment.course.instructor.fullName}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(enrollment.course.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-cyan-700">Progress</span>
                        <span className="text-sm text-cyan-600">{enrollment.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {enrollment.course.prerequisites && enrollment.course.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {enrollment.course.prerequisites.slice(0, 2).map((prereq: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-cyan-50 text-cyan-600 text-xs rounded-md font-medium">
                              {prereq}
                            </span>
                          ))}
                          {enrollment.course.prerequisites.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                              +{enrollment.course.prerequisites.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Continue Learning button intentionally removed */}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Browse Courses Section */}
      <div className="mt-8 bg-blue-200 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-cyan-700 mb-2">Accelerate your career with job‑ready skills.</h2>
            <p className="text-gray-600 text-lg">Discover courses tailored to your interests and learning path</p>
          </div>
          <div className="ml-8">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse All Courses</span>
              </Link>            
          </div>
        </div>
      </div>

        {/* Recent Achievements (no white container, match MyCourses layout) */}
        <div>
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
      {/* {dashboardData.recommendedCourses.length > 0 && (
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
      )} */}
    </div>
    
    {/* <Footer /> */}
    </>
  )
}

export default StudentDashboard


