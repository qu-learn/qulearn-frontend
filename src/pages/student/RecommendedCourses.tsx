"use client"

import type React from "react"
import { useState } from "react"
import { Search, BookOpen, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetMyDashboardQuery } from "../../utils/api"
import Footer from "../../components/Footer"

const RecommendedCourses: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Recommended Courses</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (!dashboardData || !dashboardData.recommendedCourses) {
    return null
  }

  const recommendedCourses = dashboardData.recommendedCourses

  const filteredCourses = recommendedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficultyLevel === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = Array.from(new Set(recommendedCourses.map((course) => course.category)))

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">Course Catalog</h1>
          <p className="text-cyan-600">Discover courses tailored to your interests and learning path</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center md:justify-start items-center mb-8">
          {/* Search */}
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recommended courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <div className="w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="w-40">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex flex-wrap gap-10 justify-center">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="flex-none w-80 h-[480px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer block group flex flex-col"
            >
              <div className="relative">
                <img
                  src={course.thumbnailUrl || "/1.png"}
                  alt={course.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      course.difficultyLevel === "beginner"
                        ? "bg-green-500 text-white"
                        : course.difficultyLevel === "intermediate"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {course.difficultyLevel}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-200 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                  {course.subtitle}
                </p>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="mr-3 truncate">By {course.instructor.fullName}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-1">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Prerequisites:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.slice(0, 2).map((prereq, index) => (
                        <span key={index} className="px-2 py-1 bg-cyan-50 text-cyan-600 text-xs rounded-md font-medium">
                          {prereq}
                        </span>
                      ))}
                      {course.prerequisites.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                          +{course.prerequisites.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-4 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2">
                  View Course
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommended courses found</h3>
            <p className="text-gray-600 mb-4">No courses match your search criteria</p>
            <Link
              to="/courses"
              className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-colors font-medium"
            >
              Browse Course Catalog
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}

export default RecommendedCourses
