"use client"

import { Fragment } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import type { IUser } from "../utils/types"
import { useGetCourseByIdQuery } from "../utils/api"
import { Transition, Menu } from "@headlessui/react"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbsProps {
  user?: IUser | null
}

const labelMap: Record<string, string> = {
  "": "Home",
  dashboard: "Dashboard",
  "my-courses": "My Courses",
  "recommended-courses": "Recommended Courses",
  courses: "Courses",
  quiz: "Quiz",
  lessons: "Lessons",
  achievements: "Achievements",
  profile: "Profile",
  educator: "Dashboard",
  admin: "Admin",
  "site-admin": "Site Admin",
  simulators: "Simulators",
  circuit: "Circuit Simulator",
  network: "Network Simulator",
}

function humanizeSegment(seg: string) {
  if (!seg) return labelMap[""]
  if (labelMap[seg]) return labelMap[seg]
  // fallback: replace hyphens and underscores and capitalize
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function Breadcrumbs({ user }: BreadcrumbsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const rawSegments = location.pathname.split("/").filter(Boolean)

  // Find courseId (if present) to fetch its title
  let courseId: string | undefined
  for (let i = 0; i < rawSegments.length; i++) {
    if (rawSegments[i - 1] === "courses") {
      courseId = rawSegments[i]
      break
    }
  }

  const { data: courseData } = useGetCourseByIdQuery(courseId ?? "", {
    skip: !courseId,
  })

  // Do not render breadcrumbs on landing or auth pages
  const excludedPaths = [
    "/",
    "/login",
    "/register",
    "/courses-landing",
    "/about",
    // Do not show on dashboards
    "/dashboard",
    "/educator",
    "/admin",
    "/site-admin",
  ]
  if (excludedPaths.includes(pathname)) return null

  const dashboardPath = user
    ? user.role === "student"
      ? "/dashboard"
      : user.role === "educator"
      ? "/educator"
      : user.role === "system-administrator"
      ? "/site-admin"
      : "/admin"
    : "/"

  // Build crumbs
  // Known route patterns (simple regexes) - keep in sync with App.tsx routes
  const routePatterns = [
    /^\/$/,
    /^\/dashboard$/,
    /^\/my-courses$/,
    /^\/recommended-courses$/,
    /^\/courses$/,
    /^\/courses\/[^/]+$/,
    /^\/courses\/[^/]+\/dashboard$/,
    /^\/courses\/[^/]+\/quiz\/[^/]+$/,
    /^\/courses\/[^/]+\/lessons\/[^/]+$/,
    /^\/simulators\/circuit$/,
    /^\/simulators\/circuit\/[^/]+$/,
    /^\/simulators\/network$/,
    /^\/simulators\/network\/[^/]+$/,
    /^\/educator$/,
    /^\/educator\/courses\/new$/,
    /^\/educator\/courses\/[^/]+\/edit$/,
    /^\/educator\/courses\/[^/]+\/analytics$/,
    /^\/admin$/,
    /^\/site-admin$/,
    /^\/achievements$/,
    /^\/profile$/,
  ]

  const matchesKnownRoute = (path: string) => routePatterns.some((r) => r.test(path))

  const crumbs: { to: string; label: string; clickable: boolean }[] = []
  // Always include starting Dashboard/Home for authenticated users
  if (user) {
    crumbs.push({ to: dashboardPath, label: "Home", clickable: matchesKnownRoute(dashboardPath) })
  } else {
    crumbs.push({ to: "/", label: "Home", clickable: true })
  }

  let accumulated = ""
  rawSegments.forEach((seg: string, idx: number) => {
    accumulated += `/${seg}`

    // Skip repeating the dashboard route if it's the first segment and we already have Home
    if (idx === 0 && (seg === "dashboard" || seg === "educator" || seg === "admin" || seg === "site-admin")) {
      // only add if not duplicate of Home
  if (!user) crumbs.push({ to: accumulated, label: humanizeSegment(seg), clickable: matchesKnownRoute(accumulated) })
      return
    }

    // If this segment is a course id, use the course title if available
    if (rawSegments[idx - 1] === "courses") {
      const label = courseData?.course?.title ?? `Course ${seg}`
      const clickable = matchesKnownRoute(accumulated)
      crumbs.push({ to: accumulated, label, clickable })
      return
    }

    // If segment looks like a lesson id and previous is lessons, show Lesson {id}
    if (rawSegments[idx - 1] === "lessons") {
      const clickable = matchesKnownRoute(accumulated)
      crumbs.push({ to: accumulated, label: `Lesson ${seg}`, clickable })
      return
    }

    // generic
    const clickable = matchesKnownRoute(accumulated)
    crumbs.push({ to: accumulated, label: humanizeSegment(seg), clickable })
  })

  // Render (simple inline style, no card)
  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1
            const isFirst = i === 0
            return (
              <li key={c.to} className="flex items-center">
                <Transition
                  show={true}
                  as={Fragment}
                  enter={`transition-all duration-300 delay-${i * 50}`}
                  enterFrom="opacity-0 translate-x-2"
                  enterTo="opacity-100 translate-x-0"
                >
                  <div className="flex items-center">
                    {!isLast ? (
                      <>
                        {c.clickable ? (
                          <Link
                            to={c.to}
                            onClick={(e) => {
                              e.preventDefault()
                              navigate(c.to)
                            }}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg group"
                          >
                            {isFirst && <Home className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />}
                            <span className="group-hover:underline">{c.label}</span>
                          </Link>
                        ) : (
                          <span className="flex items-center text-blue-500 text-lg">
                            {isFirst && <Home className="w-4 h-4 mr-1" />}
                            {c.label}
                          </span>
                        )}
                        <ChevronRight className="mx-2 text-blue-300 w-4 h-4" />
                      </>
                    ) : (
                      <span className="flex items-center text-blue-700 font-semibold text-lg">
                        {isFirst && <Home className="w-4 h-4 mr-1" />}
                        {c.label}
                      </span>
                    )}
                  </div>
                </Transition>
              </li>
            )
          })}
        </ol>
      </nav>
    </Transition>
  )
}

export default Breadcrumbs
