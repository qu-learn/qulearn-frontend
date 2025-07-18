"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Home, BookOpen, ChevronDown, ChevronRight, Play, Award } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useGetCourseByIdQuery, useGetMyDashboardQuery } from "../../utils/api"

const CourseDashboard: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("course-content")
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)
  const { data: dashboardData } = useGetMyDashboardQuery()

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleStartLesson = (lessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`)
  }

  // Calculate progress (placeholder - you can implement actual progress calculation)
  const calculateProgress = () => {
    if (!courseData || !dashboardData) return 0
    // This is a placeholder - implement actual progress calculation based on completed lessons
    return 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-700"></div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Course</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const { course } = courseData
  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo/Course Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-cyan-600 rounded mr-3 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
              
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          
          <button
            onClick={() => setActiveTab("course-dashboard")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "course-dashboard" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Course Dashboard
          </button>

          <button
            onClick={() => setActiveTab("course-content")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "course-content" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Course Content
          </button>

          <button
            onClick={() => setActiveTab("assessments")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "assessments" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Assessments
          </button>

          <button
            onClick={() => setActiveTab("grades")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "grades" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Grades
          </button>
        </nav>

        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to={`/courses/${courseId}`}
                className="flex items-center text-cyan-700 hover:text-cyan-800 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {course.title}
              </Link>
              {/* <div className="text-sm text-gray-500">
                {activeTab === "course-content" ? "Course Content" : 
                 activeTab === "course-dashboard" ? "Course Dashboard" :
                 activeTab === "assessments" ? "Assessments" : "Grades"}
              </div> */}
            </div>
            
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {activeTab === "course-content" && (
            <div className="max-w-7xl">
              {/* Course Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start space-x-6">
                  <div className="relative w-48 h-32 flex-shrink-0">
                    <img
                      src={course.thumbnailUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                    <p className="text-gray-600 mb-4">{course.subtitle}</p>
                    
                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-cyan-600">{progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-cyan-600 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {course.modules.map((module) => (
                    <div key={module.id} className="p-4">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedModules.has(module.id) && (
                        <div className="mt-3 pl-4 space-y-2">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleStartLesson(lesson.id)}
                              className="flex items-center w-full text-left p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-cyan-600"
                            >
                              <Play className="w-4 h-4 mr-3 text-gray-400" />
                              <span className="flex-1">{lesson.title}</span>
                              {lesson.quiz && <Award className="w-4 h-4 text-yellow-500 ml-2" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "course-dashboard" && (
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Course Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
                  <div className="text-3xl font-bold text-cyan-600">{progress}%</div>
                  <p className="text-gray-600">Course completion</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Modules</h3>
                  <div className="text-3xl font-bold text-cyan-600">{course.modules.length}</div>
                  <p className="text-gray-600">Total modules</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lessons</h3>
                  <div className="text-3xl font-bold text-cyan-600">
                    {course.modules.reduce((total, module) => total + module.lessons.length, 0)}
                  </div>
                  <p className="text-gray-600">Total lessons</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Assessments</h1>
              <div className="space-y-4">
                {course.modules.map((module) =>
                  module.lessons
                    .filter((lesson) => lesson.quiz)
                    .map((lesson) => (
                      <div key={lesson.id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {lesson.title} Quiz
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Test your knowledge on {lesson.title.toLowerCase()}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Award className="w-4 h-4 mr-2" />
                              <span>Assessment available</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/courses/${courseId}/quiz/${lesson.id}`)}
                            className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition-colors font-medium"
                          >
                            Attempt Quiz
                          </button>
                        </div>
                      </div>
                    ))
                )}
                {course.modules.every((module) => module.lessons.every((lesson) => !lesson.quiz)) && (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Available</h3>
                    <p className="text-gray-600">There are currently no quizzes available for this course.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="max-w-7xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Grades</h1>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Grades content will be displayed here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default CourseDashboard
