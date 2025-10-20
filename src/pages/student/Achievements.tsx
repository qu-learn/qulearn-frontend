<<<<<<< Updated upstream
import React, { useState, useRef, useEffect } from "react"
=======
// import type React from "react"
// import { Trophy, Medal, Star, TrendingUp } from "lucide-react"
// import { useGetAchievementsQuery, useGetMyDashboardQuery } from "../../utils/api"
// // import Footer from "../../components/Footer"

// const Achievements: React.FC = () => {
//   const { data: achievementsData, isLoading: achievementsLoading } = useGetAchievementsQuery()
//   const { data: dashboardData, isLoading: dashboardLoading } = useGetMyDashboardQuery()

//   if (achievementsLoading || dashboardLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
//       </div>
//     )
//   }

//   if (!achievementsData || !dashboardData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Achievements</h2>
//           <p className="text-gray-600">Please try refreshing the page.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-cyan-700 mb-2">Achievements & Progress</h1>
//         <p className="text-cyan-600">Track your quantum computing learning journey</p>
//       </div>

//       {/* Progress Overview */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-blue-200 rounded-xl shadow-lg p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
//               <Star className="w-6 h-6 text-cyan-700" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Total Points</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData.points.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-blue-200  rounded-xl shadow-lg p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//               <Trophy className="w-6 h-6 text-yellow-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Badges Earned</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData.badges.length}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-blue-200  rounded-xl shadow-lg p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <TrendingUp className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Learning Streak</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData.learningStreak} days</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-blue-200  rounded-xl shadow-lg p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Medal className="w-6 h-6 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Achievements</p>
//               <p className="text-2xl font-bold text-gray-900">{dashboardData.achievements.length}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Earned Badges */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-bold text-cyan-700 mb-6">Your Badges</h2>
//           {dashboardData.badges.length === 0 ? (
//             <div className="text-center py-8">
//               <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-4">No badges earned yet</p>
//               <p className="text-sm text-gray-500">Complete courses and quizzes to earn your first badge!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-4">
//               {dashboardData.badges.map((badge) => (
//                 <div
//                   key={badge.id}
//                   className="bg-gradient-to-br from-cyan-600 to-indigo-50 p-4 rounded-lg border border-cyan-600"
//                 >
//                   <img src={badge.iconUrl || "/placeholder.svg"} alt={badge.name} className="w-12 h-12 mx-auto mb-3" />
//                   <h3 className="font-semibold text-gray-900 text-center mb-1">{badge.name}</h3>
//                   <p className="text-sm text-gray-600 text-center">{badge.description}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Recent Achievements */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-bold text-cyan-700 mb-6">Recent Achievements</h2>
//           {dashboardData.achievements.length === 0 ? (
//             <div className="text-center py-8">
//               <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-4">No achievements yet</p>
//               <p className="text-sm text-gray-500">Start learning to unlock achievements!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {dashboardData.achievements.slice(0, 5).map((achievement, index) => (
//                 <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                   <img
//                     src={achievement.badge.iconUrl || "/placeholder.svg"}
//                     alt={achievement.badge.name}
//                     className="w-12 h-12 rounded-full"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">{achievement.badge.name}</h3>
//                     <p className="text-sm text-gray-600">{achievement.badge.description}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Earned {new Date(achievement.achievedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="text-yellow-500">
//                     <Trophy className="w-6 h-6" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Milestones */}
//       <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-cyan-700 mb-6">Learning Milestones</h2>
//         {achievementsData.milestones.length === 0 ? (
//           <div className="text-center py-8">
//             <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">No milestones available</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {achievementsData.milestones.map((milestone, index) => (
//               <div key={index} className="flex items-center p-4 bg-blue-200 rounded-lg border border-cyan-100">
//                 <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
//                   {index + 1}
//                 </div>
//                 <p className="text-gray-900">{milestone}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Leaderboard */}
//       <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-cyan-700 mb-6">Leaderboard</h2>
//         {achievementsData.leaderboard.length === 0 ? (
//           <div className="text-center py-8">
//             <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">Leaderboard not available</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {achievementsData.leaderboard.map((entry) => (
//               <div key={entry.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-center space-x-4">
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
//                       entry.rank === 1
//                         ? "bg-amber-500"
//                         : entry.rank === 2
//                           ? "bg-zinc-400"
//                           : entry.rank === 3
//                             ? "bg-amber-700"
//                             : "bg-cyan-600"
//                     }`}
//                   >
//                     {entry.rank}
//                   </div>
//                   <span className="font-medium text-gray-900">{entry.name}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Star className="w-4 h-4 text-yellow-500" />
//                   <span className="font-semibold text-gray-900">{entry.points.toLocaleString()}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       </div>
      
//       {/* <Footer /> */}
//     </>
//   )
// }

// export default Achievements

import React, { useRef, useEffect, useState } from "react"
>>>>>>> Stashed changes
import { Trophy, Medal, Star, TrendingUp, Eye, ChevronDown, X } from "lucide-react"
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useGetAchievementsQuery, useGetMyDashboardQuery } from "../../utils/api"

// reuse circular StatRing like student dashboard
type StatRingProps = {
  icon: React.ReactNode
  value: number | string
  label: string
  colorGrad: [string, string]
  progress?: number
}

const StatRing = ({ icon, value, label, colorGrad, progress = 100 }: StatRingProps) => {
  const size = 120
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const circleRef = useRef<SVGCircleElement | null>(null)
  useEffect(() => {
    if (circleRef.current) circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)"
  }, [progress])
  const dashOffset = circumference * (1 - (progress || 0) / 100)

  let iconNode = icon
  if (React.isValidElement(icon)) {
    const iconEl = icon as React.ReactElement<any>
    iconNode = React.cloneElement(iconEl, { className: [iconEl.props.className || "", "w-8 h-8 text-cyan-700"].join(" ") })
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
          />
        </svg>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-extrabold text-cyan-700 leading-none">{value}</span>
        </span>
      </div>
      <div className="ml-4 flex flex-col items-start">
        <span className="mb-1">{iconNode}</span>
        <span className="text-lg font-semibold text-cyan-700 tracking-tight">{label}</span>
      </div>
    </div>
  )
}
// import Footer from "../../components/Footer"

// Local StatRing (matching StudentDashboard style)
type StatRingProps = {
  icon: React.ReactNode
  value: number | string
  label: string
  colorGrad: [string, string]
  progress?: number
}

const StatRing = ({ icon, value, label, colorGrad, progress = 100 }: StatRingProps) => {
  const size = 160
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const circleRef = useRef<SVGCircleElement | null>(null)
  useEffect(() => {
    if (circleRef.current) circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)"
  }, [progress])
  const dashOffset = circumference * (1 - (progress || 0) / 100)

  let iconNode = icon
  if (React.isValidElement(icon)) {
    const iconEl = icon as React.ReactElement<any>
    iconNode = React.cloneElement(iconEl, { className: [iconEl.props.className || "", "w-7 h-7 text-cyan-700"].join(" ") })
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
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-cyan-700 leading-none">{value}</span>
        </span>
      </div>
      <div className="ml-6 flex flex-col items-start">
        <span className="mb-1">{iconNode}</span>
        <span className="text-xl font-semibold text-cyan-700 tracking-tight">{label}</span>
      </div>
    </div>
  )
}

const Achievements: React.FC = () => {
  const { data: achievementsData, isLoading: achievementsLoading } = useGetAchievementsQuery()
  const { data: dashboardData, isLoading: dashboardLoading } = useGetMyDashboardQuery()
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  if (achievementsLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!achievementsData || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Achievements</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
<<<<<<< Updated upstream
          <h1 className="text-5xl font-extrabold text-cyan-700 mb-2">Achievements & Progress</h1>
          <p className="text-xl text-cyan-600">Track your quantum computing learning journey</p>
        </div>

        {/* Circular Stat Rings - single row */}
  <div className="mb-12 border-b-0 pb-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px] grid grid-cols-4 gap-12 items-center justify-items-center px-4 border-b-0">
              <StatRing
                icon={<Star className="w-7 h-7 text-cyan-700" />}
                value={dashboardData.points.toLocaleString()}
                label="Total Points"
                colorGrad={["#60a5fa", "#06b6d4"]}
                progress={100}
              />
              <StatRing
                icon={<Trophy className="w-7 h-7 text-yellow-600" />}
                value={dashboardData.badges.length}
                label="Badges Earned"
                colorGrad={["#f59e0b", "#f97316"]}
                progress={100}
              />
              <StatRing
                icon={<TrendingUp className="w-7 h-7 text-green-600" />}
                value={`${dashboardData.learningStreak}d`}
                label="Learning Streak"
                colorGrad={["#4ade80", "#60a5fa"]}
                progress={100}
              />
              <StatRing
                icon={<Medal className="w-7 h-7 text-cyan-700" />}
                value={dashboardData.achievements.length}
                label="Achievements"
                colorGrad={["#60a5fa", "#06b6d4"]}
                progress={100}
              />
            </div>
          </div>
=======
          <h1 className="text-4xl font-extrabold text-cyan-700 mb-2">Achievements & Progress</h1>
          <p className="text-xl font-medium text-cyan-600">Track your quantum computing learning journey</p>
        </div>

        {/* Progress Overview - circular stats to match student dashboard */}
        <div className="grid grid-cols-4 gap-12 mb-8 items-center justify-items-center">
          <StatRing icon={<Star className="w-8 h-8 text-cyan-700" />} value={dashboardData.points.toLocaleString()} label="Total Points" colorGrad={["#60a5fa", "#06b6d4"]} />
          <StatRing icon={<Trophy className="w-8 h-8 text-yellow-600" />} value={dashboardData.badges.length} label="Badges Earned" colorGrad={["#f59e0b", "#f97316"]} />
          <StatRing icon={<TrendingUp className="w-8 h-8 text-green-600" />} value={`${dashboardData.learningStreak}d`} label="Learning Streak" colorGrad={["#4ade80", "#60a5fa"]} />
          <StatRing icon={<Medal className="w-8 h-8 text-purple-600" />} value={dashboardData.achievements.length} label="Achievements" colorGrad={["#a78bfa", "#7c3aed"]} />
>>>>>>> Stashed changes
        </div>

        {/* Tab Group for different sections */}
        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
          <TabList className="flex space-x-1 rounded-xl bg-transparent p-1 mb-8">
            <Tab className="w-full rounded-lg py-3 text-base font-semibold leading-6 text-cyan-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 data-[selected]:bg-white data-[selected]:shadow data-[hover]:bg-white/[0.12]">
              Badges & Achievements
            </Tab>
            <Tab className="w-full rounded-lg py-3 text-base font-semibold leading-6 text-cyan-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 data-[selected]:bg-white data-[selected]:shadow data-[hover]:bg-white/[0.12]">
              Learning Progress
            </Tab>
            <Tab className="w-full rounded-lg py-3 text-base font-semibold leading-6 text-cyan-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 data-[selected]:bg-white data-[selected]:shadow data-[hover]:bg-white/[0.12]">
              Leaderboard
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Badges & Achievements Tab */}
            <TabPanel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earned Badges */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-cyan-700 mb-6">Your Badges</h2>
                  {dashboardData.badges.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No badges earned yet</p>
                      <p className="text-sm text-gray-500">Complete courses and quizzes to earn your first badge!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {dashboardData.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200 cursor-pointer hover:shadow-lg hover:border-cyan-400 transition-all duration-200"
                          onClick={() => {
                            setSelectedBadge(badge)
                            setIsModalOpen(true)
                          }}
                        >
                          <img src={badge.iconUrl || "/placeholder.svg"} alt={badge.name} className="w-16 h-16 mx-auto mb-3" />
                          <h3 className="font-semibold text-gray-900 text-center text-sm">{badge.name}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-cyan-700 mb-6">Recent Achievements</h2>
                  {dashboardData.achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No achievements yet</p>
                      <p className="text-sm text-gray-500">Start learning to unlock achievements!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.achievements.slice(0, 5).map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <img
                            src={achievement.badge.iconUrl || "/placeholder.svg"}
                            alt={achievement.badge.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{achievement.badge.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.badge.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Earned {new Date(achievement.achievedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-yellow-500">
                            <Trophy className="w-6 h-6" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabPanel>

            {/* Learning Progress Tab */}
            <TabPanel>
              {/* Milestones with Disclosure */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-cyan-700 mb-6">Learning Milestones</h2>
                {achievementsData.milestones.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No milestones available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {achievementsData.milestones.map((milestone, index) => (
                      <Disclosure key={index}>
                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg bg-blue-200 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500 focus-visible:ring-opacity-75">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                              {index + 1}
                            </div>
                            <span>{milestone}</span>
                          </div>
                          <ChevronDown className="h-5 w-5 text-gray-500 group-data-[open]:rotate-180 transform transition-transform duration-200" />
                        </DisclosureButton>
                        <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-gray-600 bg-gray-50 rounded-b-lg">
                          <p>Milestone details and requirements would be displayed here. This represents your progress through the quantum computing curriculum.</p>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </div>
                )}
              </div>
            </TabPanel>

            {/* Leaderboard Tab */}
            <TabPanel>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-cyan-700 mb-6">Leaderboard</h2>
                {achievementsData.leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Leaderboard not available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievementsData.leaderboard.map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              entry.rank === 1
                                ? "bg-amber-500"
                                : entry.rank === 2
                                  ? "bg-zinc-400"
                                  : entry.rank === 3
                                    ? "bg-amber-700"
                                    : "bg-cyan-600"
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <span className="font-medium text-gray-900">{entry.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-gray-900">{entry.points.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {/* Badge Detail Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Badge Details
                </DialogTitle>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {selectedBadge && (
                <div className="text-center">
                  <img 
                    src={selectedBadge.iconUrl || "/placeholder.svg"} 
                    alt={selectedBadge.name} 
                    className="w-24 h-24 mx-auto mb-4"
                  />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedBadge.name}</h4>
                  <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
                  <div className="bg-cyan-50 rounded-lg p-4">
                    <p className="text-sm text-cyan-700">
                      <strong>Requirements:</strong> Complete the associated course or achieve specific learning milestones.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-900 hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      
      {/* <Footer /> */}
    </>
  )
}

export default Achievements
