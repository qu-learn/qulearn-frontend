"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Eye, Plus, Trash2, X, Maximize2 } from "lucide-react"
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery } from "../../utils/api"
import { useNavigate, useParams } from "react-router-dom"
import { LessonContent } from "../../components/LessonContent"
import { CircuitSimulator, NetworkSimulator } from "../../components/QCNS"

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

//gamification types start
interface Badge {
  id: string
  name: string
  criteria: string
  iconUrl: string
}

interface PointRule {
  lessonPoints: number
  quizPoints: number
  simulationPoints: number
}

interface Milestone {
  id: string
  name: string
  pointsRequired: number
  rewardDescription: string
}

interface GamificationSettings {
  badges: Badge[]
  pointRules: PointRule
  milestones: Milestone[]
}
//gamification types end

const CourseCreation: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"details" | "content" | "gamification" | "preview">("details")
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
  const [showCircuitModal, setShowCircuitModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  const { data: existingCourse } = useGetCourseByIdQuery(courseId || "", { skip: !courseId })
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()

  const selectedModuleData = modules.find((m) => m.id === selectedModule)
  const selectedLessonData = selectedModuleData?.lessons.find((l) => l.id === selectedLesson)

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isFormValid, setIsFormValid] = useState(true)

  // Add URL validation helper function
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Add form validation function
const validateForm = (): boolean => {
  const errors: {[key: string]: string} = {}

  // Title validation
  if (!courseForm.title.trim()) {
    errors.title = "Course title is required"
  } else if (courseForm.title.trim().length < 3) {
    errors.title = "Course title must be at least 3 characters long"
  }

  // Subtitle validation
  if (!courseForm.subtitle.trim()) {
    errors.subtitle = "Course subtitle is required"
  }

  // Description validation
  if (!courseForm.description.trim()) {
    errors.description = "Course description is required"
  } else if (courseForm.description.trim().length < 20) {
    errors.description = "Course description must be at least 20 characters long"
  }

  // Category validation
  if (!courseForm.category.trim()) {
    errors.category = "Course category is required"
  }

  // Thumbnail URL validation
  if (!courseForm.thumbnailImageUrl.trim()) {
    errors.thumbnailImageUrl = "Thumbnail image URL is required"
  } else if (!isValidUrl(courseForm.thumbnailImageUrl)) {
    errors.thumbnailImageUrl = "Please enter a valid URL"
  }

  // Jupyter Notebook URL validation (optional but validate if provided)
  if (courseForm.jupyterNotebookUrl && courseForm.jupyterNotebookUrl.trim() && !isValidUrl(courseForm.jupyterNotebookUrl)) {
    errors.jupyterNotebookUrl = "Please enter a valid URL"
  }

  // Prerequisites validation
  if (courseForm.prerequisites.length === 0) {
    errors.prerequisites = "At least one prerequisite is required"
  }

  setFormErrors(errors)
  setIsFormValid(Object.keys(errors).length === 0)
  return Object.keys(errors).length === 0
}


  //gamification states start
  const [gamificationSettings, setGamificationSettings] = useState<GamificationSettings>({
    badges: [],
    pointRules: {
      lessonPoints: 10,
      quizPoints: 15,
      simulationPoints: 20
    },
    milestones: []
  })
  const [newBadgeName, setNewBadgeName] = useState("")
  const [newBadgeCriteria, setNewBadgeCriteria] = useState("")
  const [newBadgeIcon, setNewBadgeIcon] = useState("")
  const [newMilestoneName, setNewMilestoneName] = useState("")
  const [newMilestonePoints, setNewMilestonePoints] = useState("")
  const [newMilestoneReward, setNewMilestoneReward] = useState("")
  //gamification states end

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
        jupyterNotebookUrl: course.jupyterNotebookUrl || "",
      })
      setModules(course.modules || [])
    }
  }, [existingCourse])

  const handleFormChange = (field: keyof CourseForm, value: any) => {
  setCourseForm((prev) => ({ ...prev, [field]: value }))
  
  // Clear specific field error when user starts typing
  if (formErrors[field]) {
    setFormErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }
}

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourseForm((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }))
      setNewPrerequisite("")
      
      // Clear prerequisites error when adding
      if (formErrors.prerequisites) {
        setFormErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.prerequisites
          return newErrors
        })
      }
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
      title: "Lesson",
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
  if (!validateForm()) {
    return
  }

  try {
    const courseData = {
      ...courseForm,
      gamificationSettings,
      modules
    }
    
    if (courseId) {
      await updateCourse({ courseId, course: courseData }).unwrap()
    } else {
      const result = await createCourse(courseData).unwrap()
      navigate(`/courses/${result.course.id}`)
    }
  } catch (error) {
    console.error("Failed to save course:", error)
    setFormErrors({ submit: "Failed to save course. Please try again." })
  }
}

  const handleCircuitCreated = (circuitId: string) => {
    if (selectedModule && selectedLesson) {
      updateLesson(selectedModule, selectedLesson, { circuitId })
      setShowCircuitModal(false)
    }
  }

  const handleCircuitDeleted = () => {
    if (selectedModule && selectedLesson) {
      updateLesson(selectedModule, selectedLesson, { circuitId: undefined })
    }
  }

  const handleNetworkCreated = (networkId: string) => {
    if (selectedModule && selectedLesson) {
      updateLesson(selectedModule, selectedLesson, { networkId })
      setShowNetworkModal(false)
    }
  }

  const handleNetworkDeleted = () => {
    if (selectedModule && selectedLesson) {
      updateLesson(selectedModule, selectedLesson, { networkId: undefined })
    }
  }


  const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null
  return (
    <p className="text-sm text-red-600 mt-1">{error}</p>
  )
}

  //gamification functions start
  const addBadge = () => {
    if (newBadgeName.trim() && newBadgeCriteria.trim()) {
      const newBadge: Badge = {
        id: Date.now().toString(),
        name: newBadgeName.trim(),
        criteria: newBadgeCriteria.trim(),
        iconUrl: newBadgeIcon.trim() || ""
      }
      setGamificationSettings(prev => ({
        ...prev,
        badges: [...prev.badges, newBadge]
      }))
      setNewBadgeName("")
      setNewBadgeCriteria("")
      setNewBadgeIcon("")
    }
  }

  const removeBadge = (badgeId: string) => {
    setGamificationSettings(prev => ({
      ...prev,
      badges: prev.badges.filter(badge => badge.id !== badgeId)
    }))
  }

  const updatePointRules = (field: keyof PointRule, value: number) => {
    setGamificationSettings(prev => ({
      ...prev,
      pointRules: {
        ...prev.pointRules,
        [field]: value
      }
    }))
  }

  const addMilestone = () => {
    if (newMilestoneName.trim() && newMilestonePoints.trim() && newMilestoneReward.trim()) {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        name: newMilestoneName.trim(),
        pointsRequired: parseInt(newMilestonePoints),
        rewardDescription: newMilestoneReward.trim()
      }
      setGamificationSettings(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }))
      setNewMilestoneName("")
      setNewMilestonePoints("")
      setNewMilestoneReward("")
    }
  }

  const removeMilestone = (milestoneId: string) => {
    setGamificationSettings(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== milestoneId)
    }))
  }//gamification function end


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {/* <button
          onClick={() => navigate("/educator")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button> */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-700">{courseId ? "Edit Course" : "Create New Course"}</h1>
            <p className="text-cyan-900">Build engaging quantum computing courses</p>
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
              disabled={isCreating || isUpdating || !isFormValid}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating || isUpdating ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </div>

      {formErrors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-red-600">{formErrors.submit}</p>
        </div>
      )}

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
          {/* Gamification Tab */}
          <button
            onClick={() => setActiveTab("gamification")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "gamification"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Gamification Settings
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
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.title 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter course title"
                />
                <FieldError error={formErrors.title} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={courseForm.subtitle}
                  onChange={(e) => handleFormChange("subtitle", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.subtitle 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Brief course subtitle"
                />
                <FieldError error={formErrors.subtitle} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.description 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Detailed course description"
                />
                <FieldError error={formErrors.description} />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={courseForm.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.category 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="e.g., Quantum Computing, Quantum Algorithms"
                />
                <FieldError error={formErrors.category} />
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.thumbnailImageUrl 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                <FieldError error={formErrors.thumbnailImageUrl} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jupyter Notebook URL (Optional)</label>
                <input
                  type="url"
                  value={courseForm.jupyterNotebookUrl || ""}
                  onChange={(e) => handleFormChange("jupyterNotebookUrl", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.jupyterNotebookUrl 
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="https://example.com/notebook.ipynb"
                />
                <FieldError error={formErrors.jupyterNotebookUrl} />
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
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 transition-colors"
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
                <FieldError error={formErrors.prerequisites} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content & Modules Tab */}
      {activeTab === "content" && (
        <div className="grid grid-cols-[auto_1fr] gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Modules List */}
            <div className="bg-white rounded-xl shadow-xl p-6 w-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Modules</h3>
                <button
                  onClick={addModule}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 transition-colors text-sm"
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
            <div className="bg-white rounded-xl shadow-lg p-6 w-xs">
              {selectedModuleData ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{selectedModuleData.title}</h3>
                    <button
                      onClick={() => addLesson(selectedModule!)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors text-sm"
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
          </div>

          {/* Lesson Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl">
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

                {/* Circuit Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Circuit Simulator</label>
                    <div className="flex items-center space-x-2">
                      {selectedLessonData.circuitId ? (
                        <>
                          <button
                            onClick={handleCircuitDeleted}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                          <button
                            onClick={() => setShowCircuitModal(true)}
                            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Maximize2 className="w-4 h-4 mr-1" />
                            Maximize
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowCircuitModal(true)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Circuit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Network Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Network Simulator</label>
                    <div className="flex items-center space-x-2">
                      {selectedLessonData.networkId ? (
                        <>
                          <button
                            onClick={handleNetworkDeleted}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                          <button
                            onClick={() => setShowNetworkModal(true)}
                            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <Maximize2 className="w-4 h-4 mr-1" />
                            Maximize
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowNetworkModal(true)}
                          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Network
                        </button>
                      )}
                    </div>
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

      {/* Gamification Settings Tab */}
      {activeTab === "gamification" && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Badge Management */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Badge Management</h3>

              <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                  <input
                    type="text"
                    value={newBadgeName}
                    onChange={(e) => setNewBadgeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Quantum Explorer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Criteria</label>
                  <input
                    type="text"
                    value={newBadgeCriteria}
                    onChange={(e) => setNewBadgeCriteria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Complete 5 lessons"
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex-1 mr-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Badge Icon</label>
                    <input
                      type="text"
                      value={newBadgeIcon}
                      onChange={(e) => setNewBadgeIcon(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Icon URL or upload"
                    />
                  </div>
                </div>
                <button
                  onClick={addBadge}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                >
                  Add Badge
                </button>
              </div>

              {/* Display existing badges */}
              {gamificationSettings.badges.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Current Badges</h4>
                  <div className="space-y-2">
                    {gamificationSettings.badges.map((badge) => (
                      <div key={badge.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <span className="font-medium text-gray-900">{badge.name}</span>
                          <span className="text-gray-500 ml-2">- {badge.criteria}</span>
                        </div>
                        <button
                          onClick={() => removeBadge(badge.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Point System Rules */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Point System Rules</h3>

              <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points per Lesson</label>
                  <input
                    type="number"
                    value={gamificationSettings.pointRules.lessonPoints}
                    onChange={(e) => updatePointRules("lessonPoints", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points per Quiz</label>
                  <input
                    type="number"
                    value={gamificationSettings.pointRules.quizPoints}
                    onChange={(e) => updatePointRules("quizPoints", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points per Simulation</label>
                  <input
                    type="number"
                    value={gamificationSettings.pointRules.simulationPoints}
                    onChange={(e) => updatePointRules("simulationPoints", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 20"
                  />
                </div>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                >
                  Save Rules
                </button>
              </div>
            </div>

            {/* Milestone Configuration */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Milestone Configuration</h3>

              <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Name</label>
                  <input
                    type="text"
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Quantum Explorer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Required</label>
                  <input
                    type="number"
                    value={newMilestonePoints}
                    onChange={(e) => setNewMilestonePoints(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward Description</label>
                  <input
                    type="text"
                    value={newMilestoneReward}
                    onChange={(e) => setNewMilestoneReward(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Certificate of Achievement"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={addMilestone}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                  >
                    Add Milestone
                  </button>
                </div>
              </div>

              {/* Display existing milestones */}
              {gamificationSettings.milestones.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Current Milestones</h4>
                  <div className="space-y-2">
                    {gamificationSettings.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <span className="font-medium text-gray-900">{milestone.name}</span>
                          <span className="text-gray-500 ml-2">- {milestone.pointsRequired} points</span>
                          <span className="text-gray-500 ml-2">- {milestone.rewardDescription}</span>
                        </div>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                          <div key={lesson.id} className="flex flex-col justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-3">
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
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Network</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-3">
                              {lesson.content && (
                                <LessonContent content={lesson.content} />
                              )}
                              
                              {/* Interactive Elements */}
                              {(lesson.circuitId || lesson.networkId) && (
                                <div className="flex items-center space-x-3 pt-3 border-t">
                                  {lesson.circuitId && (
                                    <button
                                      onClick={() => {
                                        setSelectedModule(module.id)
                                        setSelectedLesson(lesson.id)
                                        setShowCircuitModal(true)
                                      }}
                                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                      View Circuit Simulator
                                    </button>
                                  )}
                                  {lesson.networkId && (
                                    <button
                                      onClick={() => {
                                        setSelectedModule(module.id)
                                        setSelectedLesson(lesson.id)
                                        setShowNetworkModal(true)
                                      }}
                                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                      View Network Simulator
                                    </button>
                                  )}
                                </div>
                              )}
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

      {/* Circuit Modal */}
      {showCircuitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 h-5/6 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedLessonData?.circuitId ? "View Circuit" : "Create Circuit"}
              </h3>
              <button
                onClick={() => setShowCircuitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden pt-4">
              <CircuitSimulator 
                circuitId={selectedLessonData?.circuitId}
                lessonTitle={selectedLessonData?.title}
                onCircuitCreated={activeTab === "preview" ? undefined : handleCircuitCreated}
                onCircuitDeleted={activeTab === "preview" ? undefined : handleCircuitDeleted}
                isModal={activeTab !== "preview"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Network Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 h-5/6 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedLessonData?.networkId ? "View Network" : "Create Network"}
              </h3>
              <button
                onClick={() => setShowNetworkModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden pt-4">
              <NetworkSimulator 
                networkId={selectedLessonData?.networkId}
                lessonTitle={selectedLessonData?.title}
                onNetworkCreated={activeTab === "preview" ? undefined : handleNetworkCreated}
                onNetworkDeleted={activeTab === "preview" ? undefined : handleNetworkDeleted}
                isModal={activeTab !== "preview"}
              />
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default CourseCreation
