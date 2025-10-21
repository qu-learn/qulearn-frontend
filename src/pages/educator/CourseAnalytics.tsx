"use client"

import React, { useState, Fragment, useRef, useEffect, isValidElement, cloneElement } from "react"
import { ArrowLeft, Users, TrendingUp, Award, BarChart3, ChevronDown } from "lucide-react"
import { useGetCourseAnalyticsQuery, useGetCourseByIdQuery } from "../../utils/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useNavigate, useParams } from "react-router-dom"
import { Tab, Transition, Disclosure, Menu } from "@headlessui/react"


// StatRing: round stat card with icon, large value, and label
interface StatRingProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  colorGrad: [string, string];
  progress?: number;
}
const StatRing: React.FC<StatRingProps> = ({ icon, value, label, colorGrad, progress = 100 }) => {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)";
    }
  }, [progress]);
  const dashOffset = circumference * (1 - (typeof progress === 'number' ? progress : 100) / 100);
  let iconNode = icon;
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="relative flex items-center justify-center mb-2 bg-white rounded-full shadow-xl" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <defs>
            <linearGradient id={`statRingGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorGrad[0]} />
              <stop offset="100%" stopColor={colorGrad[1]} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={stroke}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#statRingGrad-${label})`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-cyan-700 leading-none drop-shadow-lg">{value}</span>
        </span>
      </div>
      <div className="flex flex-col items-start ml-4">
        <span className="mb-1">{iconNode}</span>
        <span className="text-base font-semibold text-cyan-700 tracking-tight">{label}</span>
      </div>
    </div>
  );
}

const CourseAnalytics: React.FC = () => {
  const navigate = useNavigate()
  const { courseId } = useParams<{ courseId: string }>()
  const [selectedTab, setSelectedTab] = useState(0)
  
  if (!courseId) {
    throw new Error("Course ID is required")
  }

  const { data: analyticsData, isLoading: analyticsLoading } = useGetCourseAnalyticsQuery(courseId)
  const { data: courseData, isLoading: courseLoading } = useGetCourseByIdQuery(courseId)

  // --- FIX: Move hook above early returns and filter quizzes without a real title ---
  const quizScores = React.useMemo(() => {
    // Prefer per-quiz averages; exclude items with no resolved title
    const perQuiz = analyticsData?.averageQuizScorePerQuiz
    if (Array.isArray(perQuiz) && perQuiz.length) {
      const modules = courseData?.course?.modules || []
      const items: { quizName: string; averageScore: number }[] = []

      for (const q of perQuiz) {
        let title = (q as any).quizTitle as string | undefined

        if (!title) {
          // Try resolve title from course structure
          let resolved: string | undefined
          for (const module of modules) {
            for (const lesson of module.lessons || []) {
              const quiz = (lesson as any).quiz
              if (!quiz) continue
              if (quiz.id === q.quizId || (quiz._id && quiz._id.toString && quiz._id.toString() === q.quizId)) {
                resolved = quiz.title || lesson.title
                break
              }
            }
            if (resolved) break
          }
          title = resolved
        }

        // If still no title, skip this quiz
        if (title && title.trim()) {
          items.push({ quizName: title.trim(), averageScore: (q as any).averageScore })
        }
      }

      return items
    }

    // Fallback: overall average if provided
    if (typeof analyticsData?.averageQuizScore === "number") {
      return [{ quizName: "All Quizzes (avg)", averageScore: analyticsData.averageQuizScore }]
    }

    return []
  }, [analyticsData, courseData])

  if (analyticsLoading || courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </Transition>
      </div>
    )
  }

  if (!analyticsData || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const progressData = analyticsData.studentProgress.map((student) => ({
    name: student.studentName,
    progress: student.progress,
  }))

  const completionData = [
    { name: "Completed", value: analyticsData.completionRate, color: "#10B981" },
    { name: "In Progress", value: 100 - analyticsData.completionRate, color: "#F59E0B" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1500px] mx-auto px-10 py-10">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="mb-8">
            <div>
              <h1 className="text-4xl font-bold text-cyan-700 mb-2">Course Analytics</h1>
              <p className="text-gray-600">{courseData.course.title}</p>
            </div>
          </div>
        </Transition>

        {/* Overview Stats */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
        >
          <div className="grid grid-cols-3 gap-12 mb-12 w-full max-w-[1600px] mx-auto">
            <StatRing
              icon={<Users className="w-9 h-9 text-blue-600" />}
              value={analyticsData.enrollmentCount}
              label="Total Enrollments"
              colorGrad={["#38bdf8", "#0ea5e9"]}
            />
            <StatRing
              icon={<TrendingUp className="w-9 h-9 text-blue-600" />}
              value={`${analyticsData.completionRate.toFixed(1)}%`}
              label="Completion Rate"
              colorGrad={["#34d399", "#10b981"]}
              progress={analyticsData.completionRate}
            />
            <StatRing
              icon={<BarChart3 className="w-9 h-9 text-blue-600" />}
              value={analyticsData.studentProgress.filter((s) => s.progress > 0 && s.progress < 100).length}
              label="Active Students"
              colorGrad={["#a78bfa", "#6366f1"]}
            />
          </div>
        </Transition>

        {/* Tab Group for Different Views */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-2 rounded-xl bg-blue-100 p-1 mb-6">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                    ${
                      selected
                        ? "bg-white text-cyan-700 shadow"
                        : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                    }`}
                  >
                    Overview
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                    ${
                      selected
                        ? "bg-white text-cyan-700 shadow"
                        : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                    }`}
                  >
                    Average Quiz Score
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                    ${
                      selected
                        ? "bg-white text-cyan-700 shadow"
                        : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                    }`}
                  >
                    Student Details
                  </button>
                )}
              </Tab>
            </Tab.List>

            <Tab.Panels>
              {/* Overview Tab: Student Progress Distribution as Line Chart */}
              <Tab.Panel>
                <Transition
                  show={selectedTab === 0}
                  as={Fragment}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Student Progress Distribution</h3>
                    <div className="h-96 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                          <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
                          <Bar dataKey="progress" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Transition>
              </Tab.Panel>

              {/* Average Quiz Score Tab: Histogram of Quiz Scores */}
              <Tab.Panel>
                <Transition
                  show={selectedTab === 1}
                  as={Fragment}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quiz Score Distribution</h3>
                    <div className="h-96 flex items-center justify-center">
                      {quizScores.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={quizScores} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="quizName" angle={-45} textAnchor="end" interval={0} height={80} />
                             <YAxis domain={[0, 100]} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                             <Tooltip formatter={(value) => [
                               typeof value === 'number' ? `${value.toFixed(1)}%` : `${value}%`,
                               "Average Score"
                             ]} />
                             <Bar dataKey="averageScore" fill="#F59E0B" />
                           </BarChart>
                         </ResponsiveContainer>
                       ) : (
                         <span className="text-gray-400">No quiz score data available.</span>
                       )}
                   </div>
                  </div>
                </Transition>
              </Tab.Panel>

              {/* Student Details Tab: Student Access/Activity Table */}
              <Tab.Panel>
                <Transition
                  show={selectedTab === 2}
                  as={Fragment}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Student Access & Activity</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.studentProgress.map((student, index) => (
                            <Transition
                              key={student.studentId}
                              show={selectedTab === 2}
                              as={Fragment}
                              enter={`transition-all duration-300 delay-${index * 50}`}
                              enterFrom="opacity-0 translate-x-4"
                              enterTo="opacity-100 translate-x-0"
                            >
                              <tr className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${student.progress}%` }}></div>
                                    </div>
                                    <span className="text-sm text-gray-900">{student.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${student.progress === 100
                                        ? "bg-green-100 text-green-800"
                                        : student.progress > 0
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {student.progress === 100 ? "Completed" : student.progress > 0 ? "In Progress" : "Not Started"}
                                  </span>
                                </td>
                              </tr>
                            </Transition>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Transition>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Transition>
      </div>
    </div>
  )
}

export default CourseAnalytics
