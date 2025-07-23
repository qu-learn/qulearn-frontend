"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, BookOpen, Download, FileText, Video, ExternalLink, Play, Clock, Users } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useGetCourseByIdQuery } from "../../utils/api"
import type { ILesson, IModule } from "../../utils/types"
import { LessonContent } from "../../components/LessonContent"

const LessonDetail: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Lesson</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const { course } = courseData

  // Find the current lesson
  let currentLesson: ILesson | null = null
  let currentModule: IModule | null = null
  let currentModuleIndex: number = -1
  let currentLessonIndex: number = -1

  for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
    const module = course.modules[moduleIndex]
    const lessonIndex = module.lessons.findIndex((l: any) => l.id === lessonId)
    if (lessonIndex !== -1) {
      currentLesson = module.lessons[lessonIndex]
      currentModule = module
      currentModuleIndex = moduleIndex
      currentLessonIndex = lessonIndex
      break
    }
  }

  // Function to find previous lesson
  const findPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      // Previous lesson in the same module
      return course.modules[currentModuleIndex].lessons[currentLessonIndex - 1]
    } else if (currentModuleIndex > 0) {
      // Last lesson of the previous module
      const previousModule = course.modules[currentModuleIndex - 1]
      return previousModule.lessons[previousModule.lessons.length - 1]
    }
    return null
  }

  // Function to find next lesson
  const findNextLesson = () => {
    if (currentLessonIndex < course.modules[currentModuleIndex].lessons.length - 1) {
      // Next lesson in the same module
      return course.modules[currentModuleIndex].lessons[currentLessonIndex + 1]
    } else if (currentModuleIndex < course.modules.length - 1) {
      // First lesson of the next module
      return course.modules[currentModuleIndex + 1].lessons[0]
    }
    return null
  }

  const previousLesson = findPreviousLesson()
  const nextLesson = findNextLesson()

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/courses/${courseId}/lessons/${previousLesson.id}`)
    }
  }

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
    }
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h2>
          <p className="text-gray-600">The requested lesson could not be found.</p>
        </div>
      </div>
    )
  }

  // Mock lesson materials - replace with actual data from API
  const lessonMaterials = [
    {
      id: 1,
      title: "Introduction to Quantum Machine Learning - Lecture Notes",
      type: "pdf",
      url: "/materials/qml-intro-notes.pdf",
      size: "2.4 MB",
      description: "Comprehensive lecture notes covering the fundamentals of quantum machine learning"
    },
    {
      id: 2,
      title: "QML Video Lecture",
      type: "video",
      url: "/materials/qml-intro-video.mp4",
      duration: "45 minutes",
      description: "Video lecture explaining quantum machine learning concepts with visual examples"
    },
    {
      id: 3,
      title: "Quantum Computing Basics - Reference Material",
      type: "pdf",
      url: "/materials/quantum-basics-ref.pdf",
      size: "1.8 MB",
      description: "Additional reading material on quantum computing fundamentals"
    },
    {
      id: 4,
      title: "Interactive Quantum Circuit Examples",
      type: "external",
      url: "https://qiskit.org/textbook/",
      description: "External resource with interactive quantum circuit examples"
    }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />
      case 'external':
        return <ExternalLink className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to={`/courses/${courseId}/dashboard`}
              className="flex items-center text-cyan-700 hover:text-cyan-800 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Link>
            <div className="text-sm text-gray-500">
              {course.title} / {currentModule.title} / Lesson {currentModuleIndex + 1}.{currentLessonIndex + 1}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
              <p className="text-lg text-gray-600 mb-4">
                Module: {currentModule.title}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>45 minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Beginner Level</span>
                </div>
              </div>
            </div>
            {/* <div className="flex-shrink-0">
              <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </button>
            </div> */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "overview"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "materials"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Materials
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {currentLesson.content && (
                  <LessonContent content={currentLesson.content} />
                )}
              </div>
            )}

            {activeTab === "materials" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Materials</h2>

                <div className="grid gap-4">
                  {lessonMaterials.map((material) => (
                    <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{material.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {material.size && <span>{material.size}</span>}
                              {material.duration && <span>{material.duration}</span>}
                              <span className="capitalize">{material.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {material.type === 'external' ? (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Open
                            </a>
                          ) : (
                            <>
                              <a
                                href={
                                  material.title.includes("Reference Material") || material.title.includes("Lecture Notes")
                                    ? "https://w.wiki/EnFG"
                                    : material.title.includes("Video Lecture")
                                      ? "https://youtu.be/QtWCmO_KIlg?si=qJS20FXynzqGAfrU"
                                      : material.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                              >
                                View
                              </a>
                              {/* <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </button> */}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xs">
              {previousLesson ? (
                <button
                  onClick={handlePreviousLesson}
                  className="text-left text-gray-600 hover:text-gray-800 font-medium transition-colors group"
                >
                  <div className="flex items-center">
                    <span className="mr-2">←</span>
                    <div>
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="truncate group-hover:underline">{previousLesson.title}</div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="text-gray-400 text-sm">No previous lesson</div>
              )}
            </div>

            <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium">
              Mark as Complete
            </button>

            <div className="flex-1 max-w-xs text-right">
              {nextLesson ? (
                <button
                  onClick={handleNextLesson}
                  className="text-right text-cyan-600 hover:text-cyan-700 font-medium transition-colors group"
                >
                  <div className="flex items-center justify-end">
                    <div>
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="truncate group-hover:underline">{nextLesson.title}</div>
                    </div>
                    <span className="ml-2">→</span>
                  </div>
                </button>
              ) : (
                <div className="text-gray-400 text-sm">No next lesson</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LessonDetail
