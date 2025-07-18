"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Clock, Users, Award, Play } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useGetCourseByIdQuery, useEnrollInCourseMutation } from "../../utils/api"


const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)
  const [enrollInCourse] = useEnrollInCourseMutation()

//   const handleEnroll = async () => {
//     try {
//       await enrollInCourse({ courseId: courseId! }).unwrap()
//     } catch (error) {
//       console.error("Enrollment failed:", error)
//     }
//   }

  const handleStartLesson = (lessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`)
  }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Course</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return null
  }

  const { course } = courseData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/courses" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-4 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={course.thumbnailUrl || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.subtitle}</p>
              <p className="text-gray-700 mb-8">{course.description}</p>

              <div className="flex items-center text-sm text-gray-600 mb-8">
                <Users className="w-4 h-4 mr-2" />
                <span className="mr-6">Instructor: {course.instructor.fullName}</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
              </div>

              {course.prerequisites.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* <button
                onClick={handleEnroll}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Enroll in Course
              </button> */}
            </div>
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Course Content</h3>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">{module.title}</h4>
                  </div>
                  <div className="p-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleStartLesson(lesson.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
                      >
                        <div className="flex items-center">
                          <Play className="w-4 h-4 mr-3" />
                          <span className="flex-1">{lesson.title}</span>
                          {lesson.quiz && <Award className="w-4 h-4 text-yellow-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
