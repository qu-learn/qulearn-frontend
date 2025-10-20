"use client"

import type React from "react"
import { useState } from "react"
import { Search, BookOpen, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetMyDashboardQuery } from "../../utils/api"
// import Footer from "../../components/Footer"

const MyCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const { data: dashboardData, isLoading, error } = useGetMyDashboardQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Courses</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (!dashboardData || !dashboardData.enrolledCourses) {
    return null
  }

  const enrolledCourses = dashboardData.enrolledCourses

  const filteredCourses = enrolledCourses.filter((enrollment) => {
    const course = enrollment.course
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficultyLevel === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = Array.from(new Set(enrolledCourses.map((enrollment) => enrollment.course.category)))

  return (
    <>
  <div className="w-full max-w-[1500px] mx-auto px-10 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-700 mb-2">My Courses</h1>
        <p className="text-xl text-cyan-600">Continue your learning journey with your enrolled courses</p>
      </div>

      {/* Search and Filters (match Course Catalog sizing) */}
      <div className="flex justify-between items-center mb-8 gap-8">
        <div className="flex-1 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 border border-gray-300 rounded-xl leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div className="flex gap-4 min-w-[400px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-base"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-base"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid: 3 columns on large screens, keep card width/height */}
  {/* Use fixed 24rem columns to guarantee 3 cards per row on large screens */}
  <div className="grid grid-cols-3 gap-12 mb-12 w-full max-w-[1600px] mx-auto">
        {filteredCourses.map((enrollment) => (
          <Link
            key={enrollment.course.id}
            to={`/courses/${enrollment.course.id}/dashboard`}
            className="w-96 h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer block group flex flex-col self-start"
          >
            <div className="relative">
              <img
                src={enrollment.course.thumbnailUrl || "/1.png"}
                alt={enrollment.course.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
              />
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="font-bold text-2xl text-gray-900 mb-3 line-clamp-1 group-hover:text-cyan-700">{enrollment.course.title}</h3>
              <p className="text-lg text-gray-600 mb-6 line-clamp-2 min-h-[40px]">{enrollment.course.subtitle}</p>

              <div className="flex items-center justify-between text-base text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <span className="font-semibold">By {enrollment.course.instructor.fullName}</span>
                <span className="text-gray-500">{new Date(enrollment.course.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-cyan-700">Progress</span>
                  <span className="text-sm font-medium text-cyan-600">{enrollment.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${enrollment.progressPercentage}%` }} />
                </div>
              </div>

              <div className="flex gap-3 mb-4 items-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm backdrop-blur-sm ${
                    enrollment.course.difficultyLevel === "beginner"
                      ? "bg-green-100/90 text-green-800"
                      : enrollment.course.difficultyLevel === "intermediate"
                        ? "bg-yellow-100/90 text-yellow-800"
                        : "bg-red-100/90 text-red-800"
                  }`}
                >
                  {enrollment.course.difficultyLevel?.charAt(0).toUpperCase() + enrollment.course.difficultyLevel?.slice(1) || 'Beginner'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{enrollment.course.category}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-auto">
                <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 flex items-center justify-center">
                  Continue Learning
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrolled courses found</h3>
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet or no courses match your search criteria</p>
          <Link
            to="/courses"
            className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-900 transition-colors font-medium"
          >
            Browse Course Catalog
          </Link>
        </div>
      )}
    </div>
    
    {/* <Footer /> */}
    </>
  )
}

export default MyCourses
