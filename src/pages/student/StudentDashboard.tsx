
      



"use client"

<<<<<<< Updated upstream
import React, { useRef, useEffect, useState } from "react"
import { BookOpen, Award, Zap, TrendingUp, Target, Users, Clock, X } from "lucide-react"
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
=======
import React, { useRef, useEffect } from "react"
import { BookOpen, Award, Zap, TrendingUp, Target, Users, Clock } from "lucide-react"
>>>>>>> Stashed changes
import { Link } from "react-router-dom"
import { useGetMyDashboardQuery } from "../../utils/api"
// import Footer from "../../components/Footer"

<<<<<<< Updated upstream
// StatRing: round stat card with animated ring and centered value
=======
// Circular StatRing matching educator style
>>>>>>> Stashed changes
type StatRingProps = {
  icon: React.ReactNode
  value: number | string
  label: string
  colorGrad: [string, string]
  progress?: number
}

const StatRing = ({ icon, value, label, colorGrad, progress = 100 }: StatRingProps) => {
<<<<<<< Updated upstream
  const size = 160
=======
  const size = 120
>>>>>>> Stashed changes
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const circleRef = useRef<SVGCircleElement | null>(null)
  useEffect(() => {
<<<<<<< Updated upstream
    if (circleRef.current) {
      circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)"
    }
=======
    if (circleRef.current) circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)"
>>>>>>> Stashed changes
  }, [progress])
  const dashOffset = circumference * (1 - (progress || 0) / 100)

  let iconNode = icon
  if (React.isValidElement(icon)) {
    const iconEl = icon as React.ReactElement<any>
<<<<<<< Updated upstream
    iconNode = React.cloneElement(iconEl, {
      className: [iconEl.props.className || "", "w-7 h-7 text-blue-600"].join(" ").trim(),
    })
=======
    iconNode = React.cloneElement(iconEl, { className: [iconEl.props.className || "", "w-8 h-8 text-cyan-700"].join(" ") })
>>>>>>> Stashed changes
  }

  return (
    <div className="flex items-center">
      <div className="relative bg-white rounded-full shadow-xl" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <defs>
            <linearGradient id={`statRingGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorGrad[0]} />
              <stop offset="100%" stopColor={colorGrad[1]} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
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
<<<<<<< Updated upstream
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
=======
>>>>>>> Stashed changes
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center">
<<<<<<< Updated upstream
          <span className="text-4xl font-extrabold text-cyan-700 leading-none">{value}</span>
        </span>
      </div>
      <div className="ml-6 flex flex-col items-start">
        <span className="mb-1">{iconNode}</span>
        <span className="text-xl font-semibold text-cyan-700 tracking-tight">{label}</span>
=======
          <span className="text-3xl font-extrabold text-cyan-700 leading-none">{value}</span>
        </span>
      </div>
      <div className="ml-4 flex flex-col items-start">
        <span className="mb-1">{iconNode}</span>
        <span className="text-lg font-semibold text-cyan-700 tracking-tight">{label}</span>
>>>>>>> Stashed changes
      </div>
    </div>
  )
}

const StudentDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useGetMyDashboardQuery()
  const [selectedAchievement, setSelectedAchievement] = useState<any | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null)
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <>
  <div className="max-w-[1500px] mx-auto px-10 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-cyan-700 mb-2">Welcome Back!</h1>
<<<<<<< Updated upstream
        <p className="text-xl text-cyan-600">Continue your quantum computing journey</p>
      </div>

      {/* Stats Overview - Circular Stat Rings (match Educator design) */}
      <div className="mb-12">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-4 gap-12 items-center justify-items-center px-4">
        <StatRing
          icon={<Target className="w-7 h-7 text-cyan-600" />}
          value={dashboardData.points.toLocaleString()}
          label="Total Points"
          colorGrad={["#60a5fa", "#06b6d4"]}
          progress={100}
        />
        <StatRing
          icon={<Award className="w-7 h-7 text-amber-500" />}
          value={dashboardData.badges.length}
          label="Badges Earned"
          colorGrad={["#f59e0b", "#f97316"]}
          progress={100}
        />
        <StatRing
          icon={<TrendingUp className="w-7 h-7 text-orange-500" />}
          value={`${dashboardData.learningStreak}d`}
          label="Learning Streak"
          colorGrad={["#fb923c", "#fb7185"]}
          progress={100}
        />
        <StatRing
          icon={<BookOpen className="w-7 h-7 text-purple-600" />}
          value={dashboardData.enrolledCourses.length}
          label="Enrolled Courses"
          colorGrad={["#a78bfa", "#7c3aed"]}
          progress={100}
        />
          </div>
        </div>
=======
        <p className="text-xl font-medium text-cyan-600">Continue your quantum computing journey</p>
      </div>

      {/* Stats Overview - circular stat rings to match educator design */}
      <div className="grid grid-cols-4 gap-12 mb-8 items-center justify-items-center">
        <StatRing icon={<Target className="w-8 h-8 text-cyan-700" />} value={dashboardData.points.toLocaleString()} label="Total Points" colorGrad={["#60a5fa","#06b6d4"]} />
        <StatRing icon={<Award className="w-8 h-8 text-amber-500" />} value={dashboardData.badges.length} label="Badges Earned" colorGrad={["#f59e0b","#f97316"]} />
        <StatRing icon={<TrendingUp className="w-8 h-8 text-orange-500" />} value={`${dashboardData.learningStreak}d`} label="Learning Streak" colorGrad={["#4ade80","#60a5fa"]} />
        <StatRing icon={<BookOpen className="w-8 h-8 text-purple-600" />} value={dashboardData.enrolledCourses.length} label="Enrolled Courses" colorGrad={["#a78bfa","#7c3aed"]} />
>>>>>>> Stashed changes
      </div>

      
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses (use MyCourses layout: no extra white container) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-cyan-700">My Courses</h2>
<<<<<<< Updated upstream
            <Link to="/my-courses" className="inline-flex items-center px-3 py-1 bg-white text-cyan-700 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50">
=======
            <Link to="/my-courses" className="inline-flex items-center px-2 py-1 text-sm font-medium text-cyan-700 bg-white/0 border border-transparent hover:border-cyan-200 rounded-md">
>>>>>>> Stashed changes
              View All
            </Link>
          </div>

          {dashboardData.enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No courses enrolled yet</h3>
              <p className="text-blue-700 mb-6">Browse and enroll in courses to start your quantum computing journey</p>
              <Link
                to="/courses"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-10 justify-center">
              {dashboardData.enrolledCourses.slice(0, 3).map((enrollment) => (
                <Link
                  key={enrollment.course.id}
                    to={`/courses/${enrollment.course.id}/dashboard`}
                    className="flex-none w-96 h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer block group flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={enrollment.course.thumbnailUrl || "/1.png"}
                      alt={enrollment.course.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                          enrollment.course.difficultyLevel === "beginner"
                            ? "bg-green-500 text-white"
                            : enrollment.course.difficultyLevel === "intermediate"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                        }`}
                      >
                        {enrollment.course.difficultyLevel}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
                        {enrollment.course.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors duration-200 line-clamp-1">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-base line-clamp-2 leading-relaxed">
                      {enrollment.course.subtitle}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="mr-3 truncate">By {enrollment.course.instructor.fullName}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(enrollment.course.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Progress Bar */}
                      <div className="mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base font-medium text-cyan-700">Progress</span>
                        <span className="text-base text-cyan-600">{enrollment.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {enrollment.course.prerequisites && enrollment.course.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {enrollment.course.prerequisites.slice(0, 2).map((prereq: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-cyan-50 text-cyan-600 text-xs rounded-md font-medium">
                              {prereq}
                            </span>
                          ))}
                          {enrollment.course.prerequisites.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                              +{enrollment.course.prerequisites.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Continue Learning button intentionally removed */}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
<<<<<<< Updated upstream
        {/* Browse Courses Section - full width promotional band */}
      <div className="w-full bg-blue-200">
        <div className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12">
          <div className="flex-1 md:pr-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-2">Accelerate your career with job‑ready skills.</h2>
            <p className="text-base md:text-lg text-gray-700">Discover courses tailored to your interests and learning path</p>
=======
        {/* Browse Courses Section */}
      <div className="mt-8 bg-blue-200 shadow-lg p-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-cyan-700 mb-2">Accelerate your career with job‑ready skills.</h2>
            <p className="text-gray-700 text-xl">Discover courses tailored to your interests and learning path</p>
>>>>>>> Stashed changes
          </div>
          <div className="mt-6 md:mt-0 md:ml-6">
            <Link
              to="/courses"
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg text-base md:text-lg font-semibold transition-colors flex items-center space-x-3 shadow-md"
            >
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              <span>Browse All Courses</span>
            </Link>
          </div>
        </div>
      </div>
      





               {/* Browse Courses Section */}
       {/* <div className="mt-8 bg-blue-200 rounded-xl shadow-lg p-8">
         <div className="flex items-center justify-between">
          <div className="flex-1">
           <h2 className="text-2xl font-bold text-cyan-700 mb-2">Accelerate your career with job‑ready skills.</h2>
             <p className="text-gray-600 text-lg">Discover courses tailored to your interests and learning path</p>
          </div>
           <div className="ml-8">
               <Link
                to="/courses"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-7 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 text-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse All Courses</span>
              </Link>            
          </div>
        </div>
      </div> */}

<<<<<<< Updated upstream

        {/* Recent Achievements removed: consolidated into My achievements section above */}

        {/* My Achievements (badges preview) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-cyan-700">My achievements</h2>
            <Link to="/achievements" className="inline-flex items-center px-3 py-1 bg-white text-cyan-700 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50">
=======
        {/* Recent Achievements (no white container, match MyCourses layout) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-cyan-700">My Achievements</h2>
            <Link to="/achievements" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
>>>>>>> Stashed changes
              View All
            </Link>
          </div>

          {dashboardData.badges.length === 0 ? (
            <div className="text-center py-6">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No badges yet — complete lessons to earn badges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {dashboardData.badges.slice(0, 8).map((badge: any) => (
                <button
                  key={badge.id}
                  onClick={() => {
                    setSelectedBadge(badge)
                    setIsBadgeModalOpen(true)
                  }}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200 hover:shadow-lg hover:border-cyan-400 transition-all duration-200"
                >
                  <img src={badge.iconUrl || '/placeholder.svg'} alt={badge.name} className="w-16 h-16 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 text-center text-sm">{badge.name}</h3>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* Achievement details modal */}
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSelectedAchievement(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 p-6 z-10">
              <div className="flex items-start">
                <img src={selectedAchievement.badge.iconUrl || '/2.png'} alt={selectedAchievement.badge.name} className="w-20 h-20 rounded-full mr-4" />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedAchievement.badge.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">Earned {new Date(selectedAchievement.achievedAt).toLocaleDateString()}</p>
                  <p className="text-gray-700">{selectedAchievement.badge.description}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedAchievement(null)} className="px-4 py-2 bg-gray-100 rounded-md mr-2">Close</button>
                <Link to={`/achievements/${selectedAchievement.badge.id}`} className="px-4 py-2 bg-cyan-600 text-white rounded-md">View Badge Page</Link>
              </div>
            </div>
          </div>
        )}

        {/* Badge detail modal (reused look from Achievements) */}
        <Dialog open={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">Badge Details</DialogTitle>
                  <button type="button" className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none" onClick={() => setIsBadgeModalOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedBadge && (
                  <div className="text-center">
                    <img src={selectedBadge.iconUrl || '/placeholder.svg'} alt={selectedBadge.name} className="w-24 h-24 mx-auto mb-4 rounded-full" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedBadge.name}</h4>
                    <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <p className="text-sm text-cyan-700"><strong>Requirements:</strong> Complete the associated course or achieve specific learning milestones.</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsBadgeModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-md mr-2">Close</button>
                  {selectedBadge && (
                    <Link to={`/achievements/${selectedBadge.id}`} className="px-4 py-2 bg-cyan-600 text-white rounded-md">View Badge Page</Link>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

      

      {/* Recommended Courses */}
      {/* {dashboardData.recommendedCourses.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-700">Recommended for You</h2>
            <Link to="/recommended-courses" className="text-cyan-700 hover:text-cyan-900 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recommendedCourses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer block"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnailUrl || "/1.png"}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )} */}
    </div>
    
    {/* <Footer /> */}
    </>
  )
}

export default StudentDashboard



