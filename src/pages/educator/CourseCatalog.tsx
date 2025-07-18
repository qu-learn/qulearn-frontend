"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft,Search, BookOpen, Clock, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetCoursesQuery } from "../../utils/api"
// import { useEnrollInCourseMutation } from "../../utils/api"
import { useNavigate, useParams } from "react-router-dom"


const CourseCatalog: React.FC = () => {
    const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const { data: coursesData, isLoading, error } = useGetCoursesQuery()
//   const [enrollInCourse] = useEnrollInCourseMutation()

//   const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
//     e.stopPropagation()
//     e.preventDefault()
//     try {
//       await enrollInCourse({ courseId }).unwrap()
//       // Could show success message here
//     } catch (error) {
//       console.error("Enrollment failed:", error)
//     }
//   }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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

  if (!coursesData) {
    return null
  }

  const filteredCourses = coursesData.courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficultyLevel === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty && course.status === "published"
  })

  const categories = Array.from(new Set(coursesData.courses.map((course) => course.category)))

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/educator")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
        <p className="text-gray-600">Explore our comprehensive quantum computing courses</p>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-end mb-4">
      {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-8 "> */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>
      {/* </div> */}
     

      {/* Course Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block"
          >
            <img
              src={course.thumbnailUrl || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
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
                <span className="text-xs text-gray-500">{course.category}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.subtitle}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4 mr-1" />
                <span className="mr-4">By {course.instructor.fullName}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>

              {course.prerequisites.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.slice(0, 2).map((prereq, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {prereq}
                      </span>
                    ))}
                    {course.prerequisites.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{course.prerequisites.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* <button
                onClick={(e) => handleEnroll(course.id, e)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Enroll Now
              </button> */}
            </div>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default CourseCatalog
