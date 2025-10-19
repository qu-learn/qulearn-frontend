"use client"

import React, { useState, Fragment, useMemo, useEffect, useRef } from "react"
import { BookOpen, Users, TrendingUp, Plus, Edit, BarChart3, Trash2, MoreVertical, Search } from "lucide-react"
import { useGetEducatorDashboardQuery, useGetMyCoursesQuery, useGetMyProfileQuery } from "../../utils/api"
import { useNavigate } from "react-router-dom"
import { Tab, Dialog, Transition, Menu } from "@headlessui/react"


// StatRing: round stat card with icon, large value, and label
type StatRingProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
  colorGrad: [string, string];
  progress?: number; // 0-100, if set animates the ring fill
};

const StatRing = ({ icon, value, label, colorGrad, progress = 100 }: StatRingProps) => {
  // Ring geometry
  const size = 160;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Animate progress
  const circleRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)";
    }
  }, [progress]);
  const dashOffset = circumference * (1 - progress / 100);
  // Merge icon className for Lucide icons
  let iconNode = icon;
  if (React.isValidElement(icon)) {
    const iconEl = icon as React.ReactElement<any>;
    iconNode = React.cloneElement(iconEl, {
      className: [
        (iconEl.props.className || ""),
        "w-8 h-8 text-blue-600"
      ].join(" ").trim()
    });
  }
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="relative flex items-center justify-center bg-white rounded-full shadow-xl" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <defs>
            <linearGradient id={`statRingGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorGrad[0]} />
              <stop offset="100%" stopColor={colorGrad[1]} />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={stroke}
          />
          {/* Foreground animated ring */}
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
      <div className="ml-4 flex flex-col items-start">
        <span className="mb-1">{iconNode}</span>
        <span className="text-xl font-semibold text-cyan-700 tracking-tight">{label}</span>
      </div>
    </div>
  );
};

const EducatorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data: dashboardData, isLoading: dashboardLoading } = useGetEducatorDashboardQuery()
  const { data: profileData } = useGetMyProfileQuery(undefined, { refetchOnMountOrArgChange: true })
  const { data: coursesData, isLoading: coursesLoading } = useGetMyCoursesQuery()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!coursesData?.courses) return []
    if (!searchQuery.trim()) return coursesData.courses
    
    const query = searchQuery.toLowerCase()
    return coursesData.courses.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.subtitle?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    )
  }, [coursesData?.courses, searchQuery])

  if (dashboardLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
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

  if (!dashboardData || !coursesData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-blue-700">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

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
            {(() => {
              const localUserRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
              let displayName: string | undefined = profileData?.user?.fullName;
              if (!displayName && localUserRaw) {
                try {
                  const localUser = JSON.parse(localUserRaw);
                  displayName = localUser?.fullName || localUser?.name;
                } catch {}
              }
              if (!displayName) displayName = 'Educator';
              return (
                <>
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 drop-shadow-sm tracking-tight">
                    Welcome back, {displayName}!
                  </h1>
                  <p className="text-xl font-medium text-gray-600 tracking-wide">
                    Manage your courses and track student progress
                  </p>
                </>
              );
            })()}
          </div>
        </Transition>
        <div className="w-full flex justify-center">
          <div className="mb-9 opacity-80"></div>
        </div>

        {/* Stats Overview - Ring Shape, Large, Wide, Headless UI */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
        >
          <div className="grid grid-cols-3 gap-12 mb-12 w-full max-w-[1600px] mx-auto">
            <StatRing
              icon={<BookOpen className="w-9 h-9 text-blue-600" />}
              value={dashboardData.publishedCoursesCount}
              label="Published Courses"
              colorGrad={["#60a5fa", "#06b6d4"]}
              progress={100}
            />
            <StatRing
              icon={<Users className="w-9 h-9 text-blue-600" />}
              value={dashboardData.totalStudents}
              label="Total Students"
              colorGrad={["#4ade80", "#60a5fa"]}
              progress={100}
            />
            <StatRing
              icon={<TrendingUp className="w-9 h-9 text-blue-600" />}
              value={coursesData.courses.length}
              label="All Courses"
              colorGrad={["#a78bfa", "#60a5fa"]}
              progress={100}
            />
          </div>
        </Transition>
       {/* <div className="w-full flex justify-center">
          <div className="mb-3 opacity-80"></div>
        </div> */}

        {/* My Courses with Tab Group */}
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-700 delay-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="pt-7 pb-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-4xl font-bold text-cyan-700 tracking-tight">My Courses</h2>
              <button
                onClick={() => navigate("/educator/courses/new")}
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-lg"
              >
                Create New Course
              </button>
            </div>

            {/* Search + Tabs Row */}
            <div className="flex flex-row flex-wrap items-center justify-between gap-4 mb-6">
              {/* Tabs */}
              {coursesData.courses.length > 0 && (
                <div className="w-full md:w-auto flex-1 min-w-[260px]">
                  <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="flex flex-wrap gap-12 rounded-xl bg-blue-100 p-2">
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`rounded-xl px-10 py-2.5 text-base font-semibold leading-6 transition-all duration-200
                              ${selected ? "bg-white text-cyan-700 shadow" : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"}`}
                          >
                            All Courses
                          </button>
                        )}
                      </Tab>
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`rounded-xl px-10 py-2.5 text-base font-semibold leading-6 transition-all duration-200
                              ${selected ? "bg-white text-cyan-700 shadow" : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"}`}
                          >
                            Published Courses
                          </button>
                        )}
                      </Tab>
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`rounded-xl px-10 py-2.5 text-base font-semibold leading-6 transition-all duration-200
                              ${selected ? "bg-white text-cyan-700 shadow" : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"}`}
                          >
                            Draft Courses
                          </button>
                        )}
                      </Tab>
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            className={`rounded-xl px-10 py-2.5 text-base font-semibold leading-6 transition-all duration-200
                              ${selected ? "bg-white text-cyan-700 shadow" : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"}`}
                          >
                            Under Review Courses
                          </button>
                        )}
                      </Tab>
                    </Tab.List>
                  </Tab.Group>
                </div>
              )}

              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses by name, description, or category..."
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-base transition-all duration-200 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-sm font-medium">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {coursesData.courses.length === 0 ? (
              <Transition
                show={true}
                as={Fragment}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No courses yet</h3>
                  <p className="text-blue-700 mb-6">Create your first course to start teaching quantum computing</p>
                  <button
                    onClick={() => navigate("/educator/courses/new")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Create Your First Course
                  </button>
                </div>
              </Transition>
            ) : (
              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="hidden">
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
                        All Courses
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
                        Published
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
                        Draft
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
                        Under Review
                      </button>
                    )}
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 0}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-8">
                          {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} navigate={navigate} />
                          ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 1}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "published").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No published courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-8">
                          {filteredCourses
                            .filter((course) => course.status === "published")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 2}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "draft").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No draft courses found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-8">
                          {filteredCourses
                            .filter((course) => course.status === "draft")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Transition
                      show={selectedTab === 3}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      {filteredCourses.filter((course) => course.status === "under-review").length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No courses under review found matching your search.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-8">
                          {filteredCourses
                            .filter((course) => course.status === "under-review")
                            .map((course) => (
                              <CourseCard key={course.id} course={course} navigate={navigate} />
                            ))}
                        </div>
                      )}
                    </Transition>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            )}
          </div>
        </Transition>
      </div>
    </div>
  )
}

// Course Card Component with Menu and Delete
const CourseCard: React.FC<{ course: any; navigate: any }> = ({ course, navigate }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // TODO: Implement delete course API endpoint
      console.log("Delete course:", course.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete course:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="border border-blue-200 rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-white p-0">
        {/* Image with overlay badges */}
        <div className="relative">
          <img
            src={course.thumbnailUrl || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
          />

          {/* Menu Button */}
          <div className="absolute top-3 right-3">
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowDeleteDialog(true)}
                          className={`$${'{'}
                            active ? 'bg-red-50' : ''
                          } group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Course
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-blue-900 mb-3 line-clamp-1">{course.title}</h3>
          <p className="text-base text-blue-700 mb-4 line-clamp-2 min-h-[40px]">{course.subtitle}</p>

          <div className="flex items-center justify-between text-sm text-blue-600 mb-4 pb-4 border-b border-blue-100">
            <span className="font-semibold">{course.category}</span>
            <span className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Status & Difficulty Labels */}
          <div className="flex gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${
                course.status === "published"
                  ? "bg-green-100/90 text-green-800"
                  : course.status === "under-review"
                    ? "bg-yellow-100/90 text-yellow-800"
                    : course.status === "rejected"
                      ? "bg-red-100/90 text-red-800"
                      : "bg-gray-100/90 text-gray-800"
              }`}
            >
              {course.status?.charAt(0).toUpperCase() + course.status?.slice(1) || 'Draft'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm ${
                course.difficultyLevel === "beginner"
                  ? "bg-green-100/90 text-green-800"
                  : course.difficultyLevel === "intermediate"
                    ? "bg-yellow-100/90 text-yellow-800"
                    : "bg-red-100/90 text-red-800"
              }`}
            >
              {course.difficultyLevel?.charAt(0).toUpperCase() + course.difficultyLevel?.slice(1) || 'Beginner'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 flex items-center justify-center"
            >
              View
            </button>
            <button
              onClick={() => navigate(`/educator/courses/${course.id}/edit`)}
              className="bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(`/educator/courses/${course.id}/analytics`)}
              className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Transition show={showDeleteDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-2">
                    Delete Course
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to delete <span className="font-semibold text-gray-900">"{course.title}"</span>? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default EducatorDashboard