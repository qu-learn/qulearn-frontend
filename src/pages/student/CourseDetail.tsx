"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Clock, Users, Award, Play, ChevronDownIcon } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button, Disclosure, DisclosureButton, DisclosurePanel, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useGetCourseByIdQuery, useEnrollInCourseMutation, useGetMyDashboardQuery } from "../../utils/api"

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [showEnrollDialog, setShowEnrollDialog] = useState<boolean>(false)
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<boolean>(false)

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)
  const { data: dashboardData } = useGetMyDashboardQuery()
  const [enrollInCourse] = useEnrollInCourseMutation()

  const handleEnrollClick = () => {
    setShowEnrollDialog(true)
  }

  const handleEnroll = async () => {
    try {
      await enrollInCourse({ courseId: courseId! }).unwrap()
      setIsEnrolled(true)
      setEnrollmentSuccess(true)
      setShowEnrollDialog(false)
      // Auto close success dialog after 3 seconds
      setTimeout(() => {
        setEnrollmentSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Enrollment failed:", error)
      setShowEnrollDialog(false)
    }
  }

  const handleContinueToCourse = () => {
    // Navigate to the course dashboard
    navigate(`/courses/${courseId}/dashboard`)
  }

  const handleStartLesson = (lessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`)
  }

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

  // Check if this course is in the recommended courses list
  const isRecommendedCourse = dashboardData?.recommendedCourses?.some(
    (recommendedCourse) => recommendedCourse.id === course.id
  ) || false

  // Check if user is already enrolled in this course
  const isAlreadyEnrolled = dashboardData?.enrolledCourses?.some(
    (enrollment) => enrollment.course.id === course.id
  ) || false

  // Determine button state: enrolled state takes precedence over local state
  const shouldShowEnrolledState = isAlreadyEnrolled || isEnrolled

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/courses" className="flex items-center text-cyan-700 hover:text-cyan-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-3">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-2 gap-8 p-8">
              {/* Left Column - Course Image */}
              <div className="flex justify-center">
                <div className="relative w-4/5">
                  <img
                    src={course.thumbnailUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {/* Overlay badges on image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <Button
                      className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm cursor-default ${
                        course.difficultyLevel === "beginner"
                          ? "bg-green-100/90 text-green-800 data-[hover]:bg-green-200/90"
                          : course.difficultyLevel === "intermediate"
                            ? "bg-yellow-100/90 text-yellow-800 data-[hover]:bg-yellow-200/90"
                            : "bg-red-100/90 text-red-800 data-[hover]:bg-red-200/90"
                      }`}
                      disabled
                    >
                      {course.difficultyLevel}
                    </Button>
                    <Button className="px-3 py-1 bg-gray-900/80 text-white text-sm rounded-full backdrop-blur-sm cursor-default data-[hover]:bg-gray-800/90" disabled>
                      {course.category}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Course Details */}
              <div>
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
                        <Button 
                          key={index} 
                          className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full cursor-default data-[hover]:bg-cyan-200" 
                          disabled
                        >
                          {prereq}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enroll Now button - only show for recommended courses */}
                {isRecommendedCourse && (
                  <Button
                    onClick={shouldShowEnrolledState ? handleContinueToCourse : handleEnrollClick}
                    className="bg-cyan-700 text-white py-3 px-6 rounded-lg hover:bg-cyan-800 transition-colors font-semibold text-lg data-[hover]:bg-cyan-800 data-[active]:bg-cyan-900"
                  >
                    {shouldShowEnrolledState ? "Continue to Course" : "Enroll Now"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Outline */}
        <div className="lg:col-span-3 mt-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Outline</h3>
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Disclosure key={module.id} defaultOpen={true}>
                  <div className="border-l-4 border-cyan-500 pl-6 relative">
                    {/* Module circle indicator */}
                    <div className="absolute -left-2 top-2 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white"></div>
                    
                    <DisclosureButton className="flex items-center justify-between w-full text-left py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded">
                      <h4 className="text-lg font-semibold text-gray-900 group-data-[hover]:text-cyan-700 transition-colors">
                        {module.title}
                      </h4>
                      <ChevronDownIcon className="w-5 h-5 text-gray-500 group-data-[open]:rotate-180 transition-transform duration-200" />
                    </DisclosureButton>
                    
                    <DisclosurePanel className="mt-3">
                      {/* Lessons as sub-topics */}
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center space-x-3 py-2">
                            <div className="flex-shrink-0">
                              <span className="text-sm font-medium text-cyan-600">
                                {moduleIndex + 1}.{lessonIndex + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <Button
                                onClick={() => handleStartLesson(lesson.id)}
                                className="w-full text-left text-gray-700 font-medium hover:text-cyan-600 hover:underline transition-colors cursor-pointer data-[hover]:text-cyan-600 data-[hover]:underline py-1"
                              >
                                {lesson.title}
                              </Button>
                            </div>
                            {lesson.quiz && (
                              <div className="flex-shrink-0">
                                <Button className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-md border border-amber-200 hover:bg-amber-200 transition-colors data-[hover]:bg-amber-200">
                                  <Award className="w-3 h-3 mr-1 inline" />
                                  Quiz Available
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </div>
                </Disclosure>
              ))}
            </div>
            
            {/* Enrollment prompt
            {!shouldShowEnrolledState && (
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Learning?</h4>
                  <p className="text-gray-600 mb-4">
                    Enroll in this course to access all lessons, quizzes, and interactive content.
                  </p>
                  <button
                    onClick={handleEnroll}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white py-3 px-8 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={showEnrollDialog} onClose={() => setShowEnrollDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-xl">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirm Enrollment
            </DialogTitle>
            <p className="text-gray-600">
              Are you sure you want to enroll in "{course.title}"? This will add the course to your dashboard and give you access to all course materials.
            </p>
            <div className="flex space-x-4 pt-4">
              <Button
                onClick={() => setShowEnrollDialog(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 data-[hover]:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnroll}
                className="flex-1 bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 data-[hover]:bg-cyan-800"
              >
                Enroll Now
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Enrollment Success Dialog */}
      <Dialog open={enrollmentSuccess} onClose={() => setEnrollmentSuccess(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md space-y-4 bg-white p-6 rounded-lg shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                Enrollment Successful!
              </DialogTitle>
              <p className="text-gray-600 mb-4">
                You have successfully enrolled in "{course.title}". You can now access all course materials from your dashboard.
              </p>
              <Button
                onClick={handleContinueToCourse}
                className="w-full bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 data-[hover]:bg-cyan-800"
              >
                Go to Course Dashboard
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default CourseDetail


