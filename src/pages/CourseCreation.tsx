"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Eye, Plus, Trash2 } from "lucide-react"
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery } from "../api"
import { useNavigate, useParams } from "react-router-dom"


interface CourseForm {
  title: string
  subtitle: string
  description: string
  category: string
  difficultyLevel: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  thumbnailImageUrl: string
  jupyterNotebookUrl?: string
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  content?: string
  quiz?: Quiz
  circuitId?: string
  networkId?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
}

interface Question {
  id: string
  text: string
  type: "multiple-choice" | "single-choice"
  options: string[]
  answers: string[]
}

const CourseCreation: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"details" | "content" | "preview">("details")
  const [courseForm, setCourseForm] = useState<CourseForm>({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    difficultyLevel: "beginner",
    prerequisites: [],
    thumbnailImageUrl: "",
    jupyterNotebookUrl: "",
  })
  const [modules, setModules] = useState<Module[]>([])
  const [newPrerequisite, setNewPrerequisite] = useState("")
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

  const { data: existingCourse } = useGetCourseByIdQuery(courseId || "", { skip: !courseId })
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()

  useEffect(() => {
    if (existingCourse) {
      const { course } = existingCourse
      setCourseForm({
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        category: course.category,
        difficultyLevel: course.difficultyLevel,
        prerequisites: course.prerequisites,
        thumbnailImageUrl: course.thumbnailUrl,
        jupyterNotebookUrl: "",
      })
      setModules(course.modules || [])
    }
  }, [existingCourse])

  const handleFormChange = (field: keyof CourseForm, value: any) => {
    setCourseForm((prev) => ({ ...prev, [field]: value }))
  }

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourseForm((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }))
      setNewPrerequisite("")
    }
  }

  const removePrerequisite = (index: number) => {
    setCourseForm((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }))
  }

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "New Module",
      lessons: [],
    }
    setModules((prev) => [...prev, newModule])
  }

  const updateModule = (moduleId: string, title: string) => {
    setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, title } : module)))
  }

  const deleteModule = (moduleId: string) => {
    setModules((prev) => prev.filter((module) => module.id !== moduleId))
  }

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "New Lesson",
      content: "",
    }
    setModules((prev) =>
      prev.map((module) => (module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module)),
    )
  }

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
            ...module,
            lessons: module.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...updates } : lesson)),
          }
          : module,
      ),
    )
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
          : module,
      ),
    )
  }

  const addQuizToLesson = (moduleId: string, lessonId: string) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: "Lesson Quiz",
      description: "Test your understanding of this lesson",
      questions: [],
    }
    updateLesson(moduleId, lessonId, { quiz: newQuiz })
  }

  const addQuestionToQuiz = (moduleId: string, lessonId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "New Question",
      type: "single-choice",
      options: ["Option 1", "Option 2"],
      answers: ["Option 1"],
    }

    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId && lesson.quiz
                ? {
                  ...lesson,
                  quiz: {
                    ...lesson.quiz,
                    questions: [...lesson.quiz.questions, newQuestion],
                  },
                }
                : lesson,
            ),
          }
          : module,
      ),
    )
  }

  const handleSave = async () => {
    try {
      if (courseId) {
        await updateCourse({ courseId, course: courseForm }).unwrap()
      } else {
        const result = await createCourse(courseForm).unwrap()
        navigate(`/courses/${result.course.id}`)
      }
    } catch (error) {
      console.error("Failed to save course:", error)
    }
  }

  const selectedModuleData = modules.find((m) => m.id === selectedModule)
  const selectedLessonData = selectedModuleData?.lessons.find((l) => l.id === selectedLesson)

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{courseId ? "Edit Course" : "Create New Course"}</h1>
            <p className="text-gray-600">Build engaging quantum computing courses</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("preview")}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating || isUpdating ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "content"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Content & Modules
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "preview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Preview
          </button>
        </nav>
      </div>

      {/* Course Details Tab */}
      {activeTab === "details" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={courseForm.subtitle}
                  onChange={(e) => handleFormChange("subtitle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief course subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed course description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={courseForm.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Quantum Computing, Quantum Algorithms"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={courseForm.difficultyLevel}
                  onChange={(e) => handleFormChange("difficultyLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={courseForm.thumbnailImageUrl}
                  onChange={(e) => handleFormChange("thumbnailImageUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jupyter Notebook URL (Optional)</label>
                <input
                  type="url"
                  value={courseForm.jupyterNotebookUrl || ""}
                  onChange={(e) => handleFormChange("jupyterNotebookUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/notebook.ipynb"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add prerequisite"
                    onKeyPress={(e) => e.key === "Enter" && addPrerequisite()}
                  />
                  <button
                    onClick={addPrerequisite}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseForm.prerequisites.map((prereq, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {prereq}
                      <button
                        onClick={() => removePrerequisite(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content & Modules Tab */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Modules</h3>
              <button
                onClick={addModule}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Module
              </button>
            </div>

            <div className="space-y-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedModule === module.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteModule(module.id)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{module.lessons.length} lessons</p>
                </div>
              ))}
            </div>
          </div>

          {/* Module Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedModuleData ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <input
                    type="text"
                    value={selectedModuleData.title}
                    onChange={(e) => updateModule(selectedModule!, e.target.value)}
                    className="text-lg font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                  />
                  <button
                    onClick={() => addLesson(selectedModule!)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Lesson
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedModuleData.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedLesson === lesson.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                        }`}
                      onClick={() => setSelectedLesson(lesson.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteLesson(selectedModule!, lesson.id)
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {lesson.quiz && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Quiz</span>
                        )}
                        {lesson.circuitId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Circuit</span>
                        )}
                        {lesson.networkId && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Network</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a module to edit its content</p>
              </div>
            )}
          </div>

          {/* Lesson Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selectedLessonData ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                  <input
                    type="text"
                    value={selectedLessonData.title}
                    onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                  <textarea
                    value={selectedLessonData.content}
                    onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Write your lesson content in Markdown..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Circuit ID (Optional)</label>
                    <input
                      type="text"
                      value={selectedLessonData.circuitId || ""}
                      onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { circuitId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Circuit simulator ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network ID (Optional)</label>
                    <input
                      type="text"
                      value={selectedLessonData.networkId || ""}
                      onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { networkId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Network simulator ID"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Quiz</h4>
                    {!selectedLessonData.quiz ? (
                      <button
                        onClick={() => addQuizToLesson(selectedModule!, selectedLesson!)}
                        className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => addQuestionToQuiz(selectedModule!, selectedLesson!)}
                        className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Question
                      </button>
                    )}
                  </div>

                  {selectedLessonData.quiz && (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={selectedLessonData.quiz.title}
                          onChange={(e) => {
                            const updatedQuiz = { ...selectedLessonData.quiz!, title: e.target.value }
                            updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          placeholder="Quiz title"
                        />
                      </div>

                      <div>
                        <textarea
                          value={selectedLessonData.quiz.description}
                          onChange={(e) => {
                            const updatedQuiz = { ...selectedLessonData.quiz!, description: e.target.value }
                            updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Quiz description"
                        />
                      </div>

                      <div className="space-y-3">
                        {selectedLessonData.quiz.questions.map((question, qIndex) => (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">Question {qIndex + 1}</span>
                              <select
                                value={question.type}
                                onChange={(e) => {
                                  const updatedQuestions = selectedLessonData.quiz!.questions.map((q) =>
                                    q.id === question.id ? { ...q, type: e.target.value as any } : q,
                                  )
                                  const updatedQuiz = { ...selectedLessonData.quiz!, questions: updatedQuestions }
                                  updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                                }}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="single-choice">Single Choice</option>
                                <option value="multiple-choice">Multiple Choice</option>
                              </select>
                            </div>

                            <textarea
                              value={question.text}
                              onChange={(e) => {
                                const updatedQuestions = selectedLessonData.quiz!.questions.map((q) =>
                                  q.id === question.id ? { ...q, text: e.target.value } : q,
                                )
                                const updatedQuiz = { ...selectedLessonData.quiz!, questions: updatedQuestions }
                                updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                              placeholder="Question text"
                            />

                            <div className="space-y-2">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2">
                                  <input
                                    type={question.type === "multiple-choice" ? "checkbox" : "radio"}
                                    checked={question.answers.includes(option)}
                                    onChange={(e) => {
                                      let newAnswers: string[]
                                      if (question.type === "multiple-choice") {
                                        newAnswers = e.target.checked
                                          ? [...question.answers, option]
                                          : question.answers.filter((a) => a !== option)
                                      } else {
                                        newAnswers = e.target.checked ? [option] : []
                                      }
                                      const updatedQuestions = selectedLessonData.quiz!.questions.map((q) =>
                                        q.id === question.id ? { ...q, answers: newAnswers } : q,
                                      )
                                      const updatedQuiz = { ...selectedLessonData.quiz!, questions: updatedQuestions }
                                      updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const updatedOptions = question.options.map((opt, i) =>
                                        i === oIndex ? e.target.value : opt,
                                      )
                                      const updatedQuestions = selectedLessonData.quiz!.questions.map((q) =>
                                        q.id === question.id ? { ...q, options: updatedOptions } : q,
                                      )
                                      const updatedQuiz = { ...selectedLessonData.quiz!, questions: updatedQuestions }
                                      updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                                    }}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder={`Option ${oIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a lesson to edit its content</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <img
                src={courseForm.thumbnailImageUrl || "/placeholder.svg"}
                alt={courseForm.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${courseForm.difficultyLevel === "beginner"
                    ? "bg-green-100 text-green-800"
                    : courseForm.difficultyLevel === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {courseForm.difficultyLevel}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseForm.title || "Course Title"}</h1>
              <p className="text-xl text-gray-600 mb-6">{courseForm.subtitle || "Course subtitle"}</p>
              <p className="text-gray-700 mb-8">{courseForm.description || "Course description"}</p>

              {courseForm.prerequisites.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {courseForm.prerequisites.map((prereq, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    {module.lessons.length === 0 ? (
                      <p className="text-gray-500 italic">No lessons added yet</p>
                    ) : (
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-3">{lessonIndex + 1}.</span>
                              <span className="font-medium text-gray-900">{lesson.title}</span>
                              <div className="flex items-center space-x-2 ml-4">
                                {lesson.quiz && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Quiz</span>
                                )}
                                {lesson.circuitId && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Circuit</span>
                                )}
                                {lesson.networkId && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Network
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseCreation
