"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ArrowLeft, Home, BookOpen, ChevronDown, ChevronRight, Play, Award, CheckCircle, Circle, ChevronLeft } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useGetEnrolledCourseByIdQuery, useGetMyDashboardQuery } from "../../utils/api"

const CourseDashboard: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("course-dashboard")
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [currentYear, setCurrentYear] = useState(2025)

  const { data: courseData, isLoading, error } = useGetEnrolledCourseByIdQuery(courseId!)
  const { data: dashboardData } = useGetMyDashboardQuery()

  // Prefer enrollment/completion data returned with the course query, fallback to dashboard
  const enrollmentForCourse = useMemo(() => {
    // If getEnrolledCourseByIdQuery returns an enrollment/completions object, use it.
    // common shapes: courseData.enrollment OR courseData.enrolledCourse — adjust field name as needed.
    if (courseData?.completion) return courseData.completion
    if ((courseData as any)?.enrolledCourse) return (courseData as any).enrolledCourse

    // fallback: find enrollment from dashboard query
    return dashboardData?.enrolledCourses?.find(
      (e) => e.course?.id === courseData?.course?.id || e.course?.id === courseId
    )
  }, [courseData, dashboardData, courseId])

  const completedLessonIds = useMemo(() => {
    const s = new Set<string>()
    enrollmentForCourse?.completions?.forEach((mc: any) => {
      mc.lessonIds?.forEach((li: any) => {
        if (li?.lessonId) s.add(li.lessonId)
      })
    })
    return s
  }, [enrollmentForCourse])

  const currentLessonId = useMemo(() => {
    for (const mod of courseData?.course?.modules || []) {
      for (const lesson of mod.lessons || []) {
        if (!completedLessonIds.has(lesson.id)) return lesson.id
      }
    }
    return null
  }, [courseData, completedLessonIds])

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

  const handlePreviousYear = () => {
    setCurrentYear(prev => prev - 1)
  }

  const handleNextYear = () => {
    setCurrentYear(prev => prev + 1)
  }

  // Calculate progress (placeholder - you can implement actual progress calculation)
  const calculateProgress = () => {
    if (!courseData || !dashboardData) return 0
    const c = courseData.course
    const enrollment = dashboardData.enrolledCourses?.find(
      (e) => e.course?.id === c.id || e.course?.id === courseId
    )
    if (enrollment && typeof enrollment.progressPercentage === "number") {
      return Math.max(0, Math.min(100, Math.round(enrollment.progressPercentage)))
    }

    // compute from completed lessons if no saved percentage
    const completedSet = new Set<string>()
    enrollment?.completions?.forEach((mc) => {
      mc.lessonIds?.forEach((li) => {
        if (li?.lessonId) {
          completedSet.add(li.lessonId)
        }
      })
    })
    const totalLessons = c.modules.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0
    return totalLessons === 0 ? 0 : Math.round((completedSet.size / totalLessons) * 100)
  }

  // Helper: build a map of 'YYYY-MM-DD' -> lessonsCompleted from API activityHistory
  const getActivityMap = () => {
    const map = new Map<string, number>()
    const items = (enrollmentForCourse && enrollmentForCourse.activityHistory) || []
    items.forEach((h: any) => {
      if (!h || !h.date) return
      const d = new Date(h.date)
      if (isNaN(d.getTime())) return
      const key = d.toISOString().slice(0, 10)
      const count = typeof h.lessonsCompleted === "number" ? h.lessonsCompleted : 1
      map.set(key, (map.get(key) || 0) + count)
    })
    return map
  }

  // Helper: generate calendar weeks for a given month (array of weeks; each week is array of Date | null)
  const getWeeksForMonth = (year: number, monthIndex: number): (Date | null)[][] => {
    const weeks: (Date | null)[][] = []
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const totalDays = lastDay.getDate()
    let week: (Date | null)[] = []

    // pad start of first week with nulls up to firstDay.getDay()
    for (let i = 0; i < firstDay.getDay(); i++) week.push(null)

    for (let day = 1; day <= totalDays; day++) {
      week.push(new Date(year, monthIndex, day))
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    // pad the final week if needed
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }

    // Ensure at least 5 weeks for layout stability (some months span 6 weeks)
    if (weeks.length < 5) {
      while (weeks.length < 5) weeks.push(Array(7).fill(null))
    }

    return weeks
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

  // Render function for the Course Content section so it can be reused
  const CourseContent: React.FC<{ showHeader?: boolean }> = ({ showHeader = true }) => (
    <div className="max-w-7xl">
      {/* Course Header (optional) */}
      {showHeader && (
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
      )}

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
                      {completedLessonIds.has(lesson.id) ? (
                        <CheckCircle className="w-4 h-4 mr-3 text-cyan-500" />
                      ) : (
                        <Play className="w-4 h-4 mr-3 text-gray-400" />
                      )}
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
  )

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
              <h3 className="font-semibold text-gray-900 text-sm break-words whitespace-normal">{course.title}</h3>
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

          {/* Course Content tab removed per request */}

          <button
            onClick={() => setActiveTab("assessments")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "assessments" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Assessments
          </button>

          <button
            onClick={() => setActiveTab("grades")}
            className={`w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 ${
              activeTab === "grades" 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white" 
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
          {activeTab === "course-content" && <CourseContent />}

          {activeTab === "course-dashboard" && (
            <div className="max-w-7xl space-y-8">
              {/* Keep course detail box and course content on top */}
              <div>
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
                      <p className="text-gray-600 mb-3">{course.subtitle}</p>

                      {/* Top summary: include total modules and lessons here */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="inline-flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                          <span className="text-sm text-gray-600 mr-2">Modules</span>
                          <span className="text-sm font-semibold text-cyan-600">{course.modules.length}</span>
                        </div>
                        <div className="inline-flex items-center bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                          <span className="text-sm text-gray-600 mr-2">Lessons</span>
                          <span className="text-sm font-semibold text-cyan-600">{course.modules.reduce((total, m) => total + m.lessons.length, 0)}</span>
                        </div>
                        <div className="ml-auto text-sm font-medium text-gray-700">
                          <span className="mr-2">Progress</span>
                          <span className="text-sm font-medium text-cyan-600">{progress}%</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-cyan-600 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Content (top) */}
                {/* <CourseContent showHeader={false} /> */}
              </div>

              {/* Then show dashboard metrics and activity */}
              <div>
                {/* <h2 className="text-xl font-bold text-gray-900">Course Dashboard</h2> */}

                {/* Removed duplicate small stat cards (Progress / Modules / Lessons) to avoid duplication
                    Total modules and lessons are now shown in the course detail card above. */}

                {/* Road to Certificate */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Road to Certificate</h3>
                  <div className="space-y-6">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border-l-4 border-cyan-500 pl-6 relative">
                        <div className="absolute -left-2 top-2 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white" />
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">{module.title}</h4>
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const isCompleted = completedLessonIds.has(lesson.id)
                              const isCurrentLesson = currentLessonId === lesson.id

                              console.log({lessonId: lesson.id, isCompleted, isCurrentLesson})

                              return (
                                <div key={lesson.id} className="flex items-center space-x-3">
                                  <div className={`flex-shrink-0 ${isCompleted ? 'text-cyan-500' : isCurrentLesson ? 'text-cyan-500' : 'text-gray-300'}`}>
                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-shrink-0"><span className="text-sm font-medium text-cyan-600">{moduleIndex + 1}.{lessonIndex + 1}</span></div>
                                  <div className="flex-1 relative">
                                    <button onClick={() => handleStartLesson(lesson.id)} className="text-left text-gray-700 font-medium hover:text-cyan-600 hover:underline transition-colors cursor-pointer">{lesson.title}</button>
                                    {isCurrentLesson && <span className="ml-2 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">Continue</span>}
                                  </div>
                                  {lesson.quiz && <div className="flex-shrink-0"><button className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-md border border-amber-200 hover:bg-amber-200 transition-colors"><Award className="w-3 h-3 mr-1 inline" />Quiz Available</button></div>}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity</h3>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4"><h4 className="text-lg font-semibold">{currentYear}</h4></div>
                      <div className="flex items-center space-x-2">
                        <button onClick={handlePreviousYear} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                        <button onClick={handleNextYear} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2">{Array.from({ length: 12 }, (_, monthIndex) => {
                      const activityMap = getActivityMap()
                      const weeks = getWeeksForMonth(currentYear, monthIndex)
                      const monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthIndex]
                      return (
                        <div key={monthIndex} className="space-y-1">
                          <div className="text-xs text-center text-gray-500">{monthName}</div>
                          <div className="space-y-1">
                            {weeks.map((week, weekIndex) => (
                              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                                {week.map((cellDate, dayIndex) => {
                                  if (!cellDate) {
                                    return <div key={dayIndex} className="w-3 h-3 rounded-sm bg-gray-100" />
                                  }
                                  const iso = cellDate.toISOString().slice(0, 10)
                                  const count = activityMap.get(iso) || 0
                                  const isToday = iso === new Date().toISOString().slice(0, 10)
                                  // Choose color intensity based on lessonsCompleted (0 -> light, 1+ -> stronger)
                                  const bgClass = count >= 3 ? 'bg-cyan-700' : count === 2 ? 'bg-cyan-600' : count === 1 ? 'bg-cyan-500' : (isToday ? 'bg-cyan-200 border-2 border-cyan-500' : 'bg-gray-100')
                                  const title = count > 0 ? `${count} lesson(s) completed on ${iso}` : `${iso} - no activity`
                                  return (
                                    <div
                                      key={dayIndex}
                                      className={`w-3 h-3 rounded-sm ${bgClass}`}
                                      title={title}
                                      aria-label={title}
                                    />
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}</div>

                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500"><span>Longest Streak: 3 days</span><div className="flex items-center space-x-2"><p className="text-sm text-gray-500">Current Streak: 0 days</p></div></div>
                  </div>
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
              
              {/* Grade Summary Cards
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Grade</h3>
                  <div className="text-3xl font-bold text-cyan-600">85.2%</div>
                  <p className="text-gray-600">B+ Grade</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                  <div className="text-3xl font-bold text-green-600">2/5</div>
                  <p className="text-gray-600">Assessments</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
                  <div className="text-3xl font-bold text-blue-600">87.5%</div>
                  <p className="text-gray-600">Quiz Average</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rank</h3>
                  <div className="text-3xl font-bold text-purple-600">12/45</div>
                  <p className="text-gray-600">Class Position</p>
                </div>
              </div> */}

              {/* Grades Table */}
              <div className="bg-white rounded-lg shadow-sm">
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assessment
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attempts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Generate table rows based on course modules with quizzes */}
                      {course.modules.map((module, moduleIndex) =>
                        module.lessons
                          .filter((lesson) => lesson.quiz)
                          .map((lesson, lessonIndex) => {
                            // Mock grade data - replace with actual data
                            const isCompleted = moduleIndex === 0 && lessonIndex === 0 // Only Quiz 1 (lesson 1.1) is completed
                            const score = isCompleted ? 85 : null // Only Quiz 1 has a score
                            const grade = score ? (score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F') : '-'
                            const attempts = isCompleted ? '1/3' : '0/3'
                            const status = isCompleted ? 'Completed' : 'Pending'
                            
                            return (
                              <tr key={lesson.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Award className="w-4 h-4 text-amber-500 mr-2" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {lesson.title} Quiz
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {module.title}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap"> */}
                                  {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Quiz
                                  </span> */}
                                {/* </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  15%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {score ? `${score}/100` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    grade === 'A' ? 'bg-green-100 text-green-800' :
                                    grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                    grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                    grade === 'D' ? 'bg-orange-100 text-orange-800' :
                                    grade === 'F' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {grade}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {attempts}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    status === 'Completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {status}
                                  </span>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(Date.now() + (moduleIndex * 7 + lessonIndex * 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {isCompleted ? new Date(Date.now() - (7 - moduleIndex * 2 - lessonIndex) * 24 * 60 * 60 * 1000).toLocaleDateString() : '-'}
                                </td> */}
                              </tr>
                            )
                          })
                      )}
                      
                      {/* Show message if no quizzes available */}
                      {course.modules.every((module) => module.lessons.every((lesson) => !lesson.quiz)) && (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center">
                            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Available</h3>
                            <p className="text-gray-600">There are currently no graded assessments for this course.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Grade Scale */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Grading Scale</h3>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">A</span>
                      <span className="text-gray-600">90-100%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">B</span>
                      <span className="text-gray-600">80-89%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">C</span>
                      <span className="text-gray-600">70-79%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">D</span>
                      <span className="text-gray-600">60-69%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">F</span>
                      <span className="text-gray-600">0-59%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default CourseDashboard
