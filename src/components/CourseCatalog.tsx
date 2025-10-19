"use client"

import type React from "react"
import { useState, Fragment } from "react"
import { ArrowLeft, Search, BookOpen, Clock, Users, X } from "lucide-react"
import { Link } from "react-router-dom"
import { Tab, Dialog, Transition } from "@headlessui/react"
import CourseCatalogEnrollButton from "./CourseCatalogEnrollButton"
import { useGetCoursesQuery, useGetMyEnrollmentsQuery } from "../utils/api"
// import { useEnrollInCourseMutation } from "../../utils/api"
import { useNavigate, useParams } from "react-router-dom"
import { type IUser } from "../utils/types"

interface CourseCatalogProps {
  user: IUser | null
}


const CourseCatalog: React.FC<CourseCatalogProps> = ({ user }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [hiddenCourseIds, setHiddenCourseIds] = useState<Set<string>>(new Set())

  const { data: coursesData, isLoading, error } = useGetCoursesQuery()
  const { data: enrollmentsData } = useGetMyEnrollmentsQuery(undefined, {
    skip: !user?.id || user?.role !== "student",
  })
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

  const enrolledIds = new Set<string>([
    ...((enrollmentsData?.enrollments || []).map((e) => e.course.id)),
    ...Array.from(hiddenCourseIds),
  ])

  const filteredCourses = coursesData.courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficultyLevel === selectedDifficulty

    const isPublished = course.status === "published"
    const isUnenrolled = user?.role === "student" ? !enrolledIds.has(course.id) : true

    return matchesSearch && matchesCategory && matchesDifficulty && isPublished && isUnenrolled
  })

  const categories = Array.from(new Set(coursesData.courses.map((course) => course.category)))

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course)
    setShowCourseDialog(true)
  }

  const handleEnrolled = (courseId: string) => {
    setHiddenCourseIds((prev) => {
      const next = new Set(prev)
      next.add(courseId)
      return next
    })
    setShowCourseDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1500px] mx-auto px-10 py-10">
        <div className="mb-8">

        {/* <button
        onClick={() => {
            const dashboardPath = user.role === "student" 
            ? "/dashboard" 
            : user.role === "educator" 
            ? "/educator" 
            : "/admin"
            navigate(dashboardPath)
        }}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
        </button> */}
          <div className="mb-3">
              <h2 className="text-4xl font-bold text-cyan-700 tracking-tight">Course catalog </h2>
            </div>
          <p className="text-xl font-medium text-gray-600 tracking-wide">Explore our comprehensive quantum computing courses</p>
        </div>

      {/* Search and Filters */}
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
      {/* </div> */}
     

      {/* Course Grid */}
      <Tab.Group>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-3 gap-12 mb-12 w-full max-w-[1600px] mx-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="border border-blue-200 rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-white p-0 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={course.thumbnailUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-8">
                    <h3 className="font-bold text-2xl text-blue-900 mb-4 line-clamp-1">{course.title}</h3>
                    <p className="text-lg text-blue-700 mb-6 line-clamp-2 min-h-[40px]">{course.subtitle}</p>

                    <div className="flex items-center justify-between text-base text-blue-600 mb-6 pb-6 border-b border-blue-100">
                      <span className="font-semibold">{course.category}</span>
                      <span className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Difficulty Label */}
                    <div className="flex gap-3 mb-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm backdrop-blur-sm ${
                          course.difficultyLevel === "beginner"
                            ? "bg-green-100/90 text-green-800"
                            : course.difficultyLevel === "intermediate"
                              ? "bg-yellow-100/90 text-yellow-800"
                              : "bg-red-100/90 text-red-800"
                        }`}
                      >
                        {course.difficultyLevel?.charAt(0).toUpperCase() + course.difficultyLevel?.slice(1) || 'Beginner'}
                      </span>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center text-base text-blue-600 mb-6">
                      <Users className="w-5 h-5 mr-2" />
                      <span>By {course.instructor.fullName}</span>
                    </div>

                    {/* Action Button */}
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCourseClick(course)
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 flex items-center justify-center"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Course Detail Dialog */}
      <Transition show={showCourseDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowCourseDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-cyan-50 shadow-2xl transition-all">
                  {selectedCourse && (
                    <>
                      {/* Close Button */}
                      <button
                        onClick={() => setShowCourseDialog(false)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-700" />
                      </button>

                      {/* Course Image with Gradient Overlay */}
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={selectedCourse.thumbnailUrl || "/placeholder.svg"}
                          alt={selectedCourse.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        
                        {/* Course Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${
                                selectedCourse.difficultyLevel === "beginner"
                                  ? "bg-green-500/90 text-white"
                                  : selectedCourse.difficultyLevel === "intermediate"
                                    ? "bg-yellow-500/90 text-white"
                                    : "bg-red-500/90 text-white"
                              }`}
                            >
                              {selectedCourse.difficultyLevel?.charAt(0).toUpperCase() + selectedCourse.difficultyLevel?.slice(1)}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-600/90 text-white shadow-lg">
                              {selectedCourse.category}
                            </span>
                          </div>
                          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-lg">{selectedCourse.title}</h2>
                          <p className="text-xl font-medium text-blue-100 drop-shadow-md">{selectedCourse.subtitle}</p>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-8">
                        {/* Instructor & Date */}
                        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-cyan-200">
                          <div className="flex items-center text-cyan-900">
                            <Users className="w-5 h-5 mr-2 text-cyan-600" />
                            <span className="font-semibold">Instructor:</span>
                            <span className="ml-2">{selectedCourse.instructor.fullName}</span>
                          </div>
                          <div className="flex items-center text-cyan-900">
                            <Clock className="w-5 h-5 mr-2 text-cyan-600" />
                            <span className="font-semibold">Created:</span>
                            <span className="ml-2">{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Course Description */}
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-cyan-800 mb-4 flex items-center">
                            <BookOpen className="w-6 h-6 mr-2" />
                            Course Description
                          </h3>
                          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                            {selectedCourse.description}
                          </p>
                        </div>

                        {/* Prerequisites */}
                        {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-cyan-800 mb-3">Prerequisites</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedCourse.prerequisites.map((prereq: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg shadow-sm"
                                >
                                  {prereq}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Modules Info (if available) */}
                        {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-semibold text-cyan-900">
                                  {selectedCourse.modules.length} Module{selectedCourse.modules.length > 1 ? 's' : ''}
                                </p>
                                <p className="text-sm text-cyan-700">
                                  {selectedCourse.modules.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0)} Lessons
                                </p>
                              </div>
                              <BookOpen className="w-10 h-10 text-cyan-600 opacity-50" />
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8">
                          <div className="flex-1">
                            <CourseCatalogEnrollButton
                              courseId={selectedCourse.id}
                              isLoggedIn={!!user?.id}
                              userRole={user?.role}
                              onEnrolled={handleEnrolled}
                            />
                          </div>
                          <button
                            onClick={() => {
                              setShowCourseDialog(false)
                              navigate(`/courses/${selectedCourse.id}`)
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            View Full Course
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      </div>
    </div>
  )
}

export default CourseCatalog
