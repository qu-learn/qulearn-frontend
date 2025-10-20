"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Save, Eye, Plus, Trash2, X, Maximize2 } from "lucide-react"
import { useCreateCourseMutation, useUpdateCourseMutation, useGetCourseByIdQuery } from "../../utils/api"
import { useNavigate, useParams } from "react-router-dom"
import { LessonContent, hasJavaScriptCode, extractJavaScriptCode, injectJavaScriptCode } from "../../components/LessonContent"
import { CircuitSimulator, NetworkSimulator, JSSandbox } from "../../components/QCNS"
import { Tab, Transition, Disclosure } from "@headlessui/react"

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
  const [showJSSandboxModal, setShowJSSandboxModal] = useState(false)

  const { data: existingCourse } = useGetCourseByIdQuery(courseId || "", { skip: !courseId });
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(true);

  const selectedModuleData = modules.find((m) => m.id === selectedModule)
  const selectedLessonData = selectedModuleData?.lessons.find((l) => l.id === selectedLesson)

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
    // Always re-validate form on change
    // validateForm(); // Not needed, handled by useEffect
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
      setIsFormValid(false);
      return;
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
      setFormErrors((prev) => ({ ...prev, submit: "Failed to save course. Please try again." }))
      setIsFormValid(true); // Re-enable button after error
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


  const tabLabels = [
    "Course Details",
    "Content & Modules",
    "Gamification Settings",
    "Preview"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1500px] mx-auto px-10 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
            <h1 className="text-4xl font-bold text-cyan-700">{courseId ? "Edit Course" : "Create New Course"}</h1>
            <p className="text-lg text-cyan-900">Build engaging quantum computing courses</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("preview")}
              className="flex items-center px-5 py-3 text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating || !isFormValid}
              className="flex items-center px-7 py-3 text-base bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isCreating || isUpdating ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </div>

      {formErrors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
          <p className="text-base text-red-600">{formErrors.submit}</p>
        </div>
      )}

      {/* Headless UI Tabs */}
      <Tab.Group selectedIndex={tabLabels.indexOf(
        activeTab === "details" ? "Course Details" :
        activeTab === "content" ? "Content & Modules" :
        activeTab === "gamification" ? "Gamification Settings" : "Preview"
      )} onChange={i => setActiveTab([
        "details", "content", "gamification", "preview"
      ][i] as any)}>
        <Tab.List className="flex space-x-8 mb-8 border-b">
          {tabLabels.map((label, idx) => (
            <Tab as={React.Fragment} key={label}>
              {({ selected }) => (
                <button
                  className={`py-3 px-2 border-b-2 font-semibold text-base focus:outline-none transition-all duration-200 ${
                    selected
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Transition
              show={activeTab === "details"}
              as={React.Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {/* Course Details Tab Content */}
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
            </Transition>
          </Tab.Panel>
          <Tab.Panel>
            <Transition
              show={activeTab === "content"}
              as={React.Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {/* Content & Modules Tab */}
              <div className="grid grid-cols-[auto_1fr] gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-w-0">
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
                <div className="space-y-6 w-full">
                  <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-full">
                    {selectedLessonData ? (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-cyan-700 border-b pb-3">Lesson Details</h3>
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Lesson Title</label>
                          <input
                            type="text"
                            value={selectedLessonData.title}
                            onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-base font-medium text-gray-700">Content (Markdown)</label>
                            <button
                              onClick={() => {
                                // If no JS code exists, create a template
                                if (!hasJavaScriptCode(selectedLessonData.content || '')) {
                                  const defaultCode = '// Write your JavaScript code here\nconsole.log("Hello, World!");'
                                  updateLesson(selectedModule!, selectedLesson!, { 
                                    content: injectJavaScriptCode(defaultCode)
                                  })
                                }
                                setShowJSSandboxModal(true)
                              }}
                              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {hasJavaScriptCode(selectedLessonData.content || '') ? 'Edit' : 'Add'} JS Code
                            </button>
                          </div>
                          <textarea
                            value={selectedLessonData.content || ''}
                            onChange={(e) => updateLesson(selectedModule!, selectedLesson!, { content: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base"
                            placeholder="Write your lesson content in Markdown..."
                          />
                        </div>

                        {/* Circuit Section */}
                        <div className="border-t pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-base font-medium text-gray-700">Circuit Simulator</label>
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
                            <label className="block text-base font-medium text-gray-700">Network Simulator</label>
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
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Select a lesson to edit its content</p>
                      </div>
                    )}
                  </div>

                  {/* Quiz Section - Separate Card */}
                  {selectedLessonData && (
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-full max-h-[500px] overflow-y-auto">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h3 className="text-2xl font-bold text-cyan-700">Quiz</h3>
                          {!selectedLessonData.quiz ? (
                            <button
                              onClick={() => addQuizToLesson(selectedModule!, selectedLesson!)}
                              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-base font-semibold"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Quiz
                          </button>
                        ) : (
                          <button
                            onClick={() => addQuestionToQuiz(selectedModule!, selectedLesson!)}
                            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-base font-semibold"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question
                          </button>
                        )}
                      </div>

                      {selectedLessonData.quiz ? (
                        <div className="space-y-6">
                          <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Quiz Title</label>
                            <input
                              type="text"
                              value={selectedLessonData.quiz.title}
                              onChange={(e) => {
                                const updatedQuiz = { ...selectedLessonData.quiz!, title: e.target.value }
                                updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                              placeholder="Quiz title"
                            />
                          </div>

                          <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">Quiz Description</label>
                            <textarea
                              value={selectedLessonData.quiz.description}
                              onChange={(e) => {
                                const updatedQuiz = { ...selectedLessonData.quiz!, description: e.target.value }
                                updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                              }}
                              rows={2}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Quiz description"
                            />
                          </div>

                          <div className="space-y-8">
                            <h4 className="font-semibold text-lg text-gray-800">Questions</h4>
                            {selectedLessonData.quiz.questions.map((question, qIndex) => (
                              <div key={question.id}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-base font-semibold text-gray-700">Question {qIndex + 1}</span>
                                  <select
                                    value={question.type}
                                    onChange={(e) => {
                                      const updatedQuestions = selectedLessonData.quiz!.questions.map((q) =>
                                        q.id === question.id ? { ...q, type: e.target.value as any } : q,
                                      )
                                      const updatedQuiz = { ...selectedLessonData.quiz!, questions: updatedQuestions }
                                      updateLesson(selectedModule!, selectedLesson!, { quiz: updatedQuiz })
                                    }}
                                    className="text-base border border-gray-300 rounded px-3 py-2"
                                  >
                                    <option value="single-choice">Single Choice</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                  </select>
                                </div>

                                <div className="mb-2">
                                  <label className="block text-base font-medium text-gray-700 mb-1">Question Text</label>
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your question here..."
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-base font-medium text-gray-700">Answer Options</label>
                                  {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3 border-b border-gray-200 pb-2 last:border-b-0">
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
                                        className="w-5 h-5"
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
                                        className="flex-1 px-3 py-1 border-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
                                        placeholder={`Option ${oIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                                {/* Add Question button after last question */}
                                {selectedLessonData.quiz && selectedLessonData.quiz.questions && qIndex === selectedLessonData.quiz.questions.length - 1 && (
                                  <div className="flex justify-end mt-6">
                                    <button
                                      onClick={() => addQuestionToQuiz(selectedModule!, selectedLesson!)}
                                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-base font-semibold"
                                    >
                                      <Plus className="w-5 h-5 mr-2" />
                                      Add Another Question
                                    </button>
                                  </div>
                                )}
                                {selectedLessonData.quiz && selectedLessonData.quiz.questions && qIndex !== selectedLessonData.quiz.questions.length - 1 && (
                                  <hr className="my-6 border-gray-300" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg">No quiz added yet. Click "Add Quiz" to create one.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </Transition>
          </Tab.Panel>
          <Tab.Panel>
            <Transition
              show={activeTab === "gamification"}
              as={React.Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {/* Gamification Settings Tab - Redesigned */}
              <div className="flex flex-row gap-8 justify-center items-start py-8 max-w-[1400px] mx-auto">
                {/* Badges */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-lg flex flex-col flex-1 max-w-[450px]">
                  <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                      <span>🏅</span> Badges
                    </h3>
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        value={newBadgeName}
                        onChange={(e) => setNewBadgeName(e.target.value)}
                        className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        placeholder="Badge Name (e.g., Quantum Explorer)"
                      />
                      <select
                        value={newBadgeCriteria}
                        onChange={(e) => setNewBadgeCriteria(e.target.value)}
                        className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="">Select Criteria</option>
                        <option value="Complete 3 lessons">Complete 3 lessons</option>
                        <option value="Complete 5 lessons">Complete 5 lessons</option>
                        <option value="Complete 10 lessons">Complete 10 lessons</option>
                        <option value="Complete all lessons">Complete all lessons</option>
                        <option value="Pass 3 quizzes">Pass 3 quizzes</option>
                        <option value="Pass 5 quizzes">Pass 5 quizzes</option>
                        <option value="Pass all quizzes">Pass all quizzes</option>
                        <option value="Complete 3 simulations">Complete 3 simulations</option>
                        <option value="Complete 5 simulations">Complete 5 simulations</option>
                        <option value="Complete course">Complete course</option>
                        <option value="Score 90% or higher">Score 90% or higher</option>
                        <option value="Perfect quiz score">Perfect quiz score</option>
                      </select>
                      <input
                        type="text"
                        value={newBadgeIcon}
                        onChange={(e) => setNewBadgeIcon(e.target.value)}
                        className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        placeholder="Icon URL (optional)"
                      />
                      <button
                        onClick={addBadge}
                        className="w-full py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition"
                      >
                        Add Badge
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {gamificationSettings.badges.length > 0 ? (
                        <ul className="space-y-2">
                          {gamificationSettings.badges.map((badge) => (
                            <li key={badge.id} className="flex items-center justify-between bg-white border border-cyan-100 rounded-lg px-3 py-2 shadow-sm">
                              <div className="flex items-center gap-2">
                                {badge.iconUrl && <img src={badge.iconUrl} alt="icon" className="w-6 h-6 rounded-full" />}
                                <span className="font-medium text-cyan-900">{badge.name}</span>
                                <span className="text-xs text-cyan-600">({badge.criteria})</span>
                              </div>
                              <button
                                onClick={() => removeBadge(badge.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove badge"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-cyan-400 text-sm text-center">No badges added yet.</p>
                      )}
                    </div>
                </div>

                {/* Points */}
                <div className="bg-gradient-to-br from-green-50 to-cyan-50 rounded-xl p-6 shadow-lg flex flex-col flex-1 max-w-[450px]">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      <span>⭐</span> Points
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">Points per Lesson</label>
                        <input
                          type="number"
                          value={gamificationSettings.pointRules.lessonPoints}
                          onChange={(e) => updatePointRules("lessonPoints", parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="e.g., 10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">Points per Quiz</label>
                        <input
                          type="number"
                          value={gamificationSettings.pointRules.quizPoints}
                          onChange={(e) => updatePointRules("quizPoints", parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="e.g., 15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-700 mb-1">Points per Simulation</label>
                        <input
                          type="number"
                          value={gamificationSettings.pointRules.simulationPoints}
                          onChange={(e) => updatePointRules("simulationPoints", parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          placeholder="e.g., 20"
                        />
                      </div>
                    </div>
                </div>

                {/* Milestones */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg flex flex-col flex-1 max-w-[450px]">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <span>🎯</span> Milestones
                    </h3>
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        value={newMilestoneName}
                        onChange={(e) => setNewMilestoneName(e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Milestone Name (e.g., Quantum Explorer)"
                      />
                      <input
                        type="number"
                        value={newMilestonePoints}
                        onChange={(e) => setNewMilestonePoints(e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Points Required (e.g., 100)"
                      />
                      <input
                        type="text"
                        value={newMilestoneReward}
                        onChange={(e) => setNewMilestoneReward(e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Reward Description (e.g., Certificate)"
                      />
                      <button
                        onClick={addMilestone}
                        className="w-full py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
                      >
                        Add Milestone
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {gamificationSettings.milestones.length > 0 ? (
                        <ul className="space-y-2">
                          {gamificationSettings.milestones.map((milestone) => (
                            <li key={milestone.id} className="flex items-center justify-between bg-white border border-yellow-100 rounded-lg px-3 py-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="font-medium text-yellow-900">{milestone.name}</span>
                                <span className="text-xs text-yellow-700">{milestone.pointsRequired} points - {milestone.rewardDescription}</span>
                              </div>
                              <button
                                onClick={() => removeMilestone(milestone.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove milestone"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-yellow-400 text-sm text-center">No milestones added yet.</p>
                      )}
                    </div>
                </div>
              </div>
            </Transition>
          </Tab.Panel>
          <Tab.Panel>
            <Transition
              show={activeTab === "preview"}
              as={React.Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              {/* Preview Tab */}
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
                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                          Network
                                        </span>
                                      )}
                                      {lesson.content && hasJavaScriptCode(lesson.content) && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">JS Sandbox</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    {lesson.content && (
                                      <LessonContent content={lesson.content} />
                                    )}
                                    
                                    {/* Interactive Elements */}
                                    {(lesson.circuitId || lesson.networkId || (lesson.content && hasJavaScriptCode(lesson.content))) && (
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
                                        {lesson.content && hasJavaScriptCode(lesson.content) && (
                                          <button
                                            onClick={() => {
                                              setSelectedModule(module.id)
                                              setSelectedLesson(lesson.id)
                                              setShowJSSandboxModal(true)
                                            }}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                          >
                                            View JS Sandbox
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
            </Transition>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

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

      {/* JS Sandbox Modal */}
      {showJSSandboxModal && selectedLessonData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 h-5/6 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">JavaScript Sandbox</h3>
              <button
                onClick={() => setShowJSSandboxModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden pt-4">
              <JSSandbox 
                code={extractJavaScriptCode(selectedLessonData.content || '') || ''}
                onSave={(code) => {
                  updateLesson(selectedModule!, selectedLesson!, { 
                    content: injectJavaScriptCode(code)
                  })
                  setShowJSSandboxModal(false)
                }}
                isModal={activeTab !== "preview"}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>

  )
}

export default CourseCreation
