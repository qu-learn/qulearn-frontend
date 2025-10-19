"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import { api } from "./utils/api"
import type { IUser } from "./utils/types"
import LandingPage from "./pages/landing/LandingPage"
import CourseCatalogL from "./pages/landing/CourseCatalogL"
import AboutPage from './pages/landing/AboutPage'
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ProfileSettings from "./components/ProfileSettings"
import CourseCatalog from "./components/CourseCatalog"
import StudentDashboard from "./pages/student/StudentDashboard"
import MyCourses from "./pages/student/MyCourses"
import RecommendedCourses from "./pages/student/RecommendedCourses"
import CourseDashboard from "./pages/student/CourseDashboard"
import CourseQuiz from "./pages/student/CourseQuiz"
import EducatorDashboard from "./pages/educator/EducatorDashboard"
import CourseAdminDashboard from "./pages/CourseAdmin/CourseAdminDashboard"
import SiteAdminDashboard from "./pages/SiteAdmin/SiteAdminDashboard"
//import CourseCatalog from "./pages/educator/CourseCatalog"
//import CourseDetail from "./pages/educator/CourseDetail"
import CourseDetail from "./pages/student/CourseDetail"
import LessonDetail from "./pages/student/LessonDetail"
//import InteractiveLearning from "./pages/student/InteractiveLearning"
import { CircuitSimulator, NetworkSimulator, JSSandbox } from "./components/QCNS"
import Achievements from "./pages/student/Achievements"
import CourseCreation from "./pages/educator/CourseCreation"
import CourseAnalytics from "./pages/educator/CourseAnalytics"
// import ProfileSettings from "./pages/student/ProfileSettings"
import Header from "./components/Header"
import Breadcrumbs from "./components/Breadcrumbs"


interface AppState {
  initialized: boolean
  user: IUser | null
}

function AppContent() {
  const [appState, setAppState] = useState<AppState>({
    initialized: false,
    user: null,
  })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        setAppState((prev) => ({
          ...prev,
          initialized: true,
          user,
        }))
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleLogin = (user: IUser, token: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setAppState((prev) => ({
      ...prev,
      user,
    }))

    // Navigate to appropriate dashboard
    const dashboardPath = user.role === "student" ? "/dashboard" : user.role === "educator" ? "/educator" : user.role === "system-administrator" ? "/site-admin" : "/admin"
    navigate(dashboardPath)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAppState((prev) => ({
      ...prev,
      user: null,
    }))
    navigate("/")
  }

  const getCurrentPage = () => {
    return location.pathname
  }

  // Debug: log navigation changes and current user to help diagnose unexpected redirects
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.debug("Navigation ->", location.pathname, "user:", appState.user)
    } catch (err) {
      // noop
    }
  }, [location.pathname, appState.user])

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!appState.user) {
      return <Navigate to="/login" replace />
    }
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {appState.user && <Header user={appState.user} onLogout={handleLogout} currentPage={getCurrentPage()} />}
      <main className={appState.user ? "pt-20" : ""}>
        {/* Breadcrumbs are rendered inside main so the fixed header (when present) doesn't overlap them. */}
        <Breadcrumbs user={appState.user} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses-landing" element={<CourseCatalogL />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/login"
            element={
              appState.user ? (
                <Navigate
                  to={
                    appState.user.role === "student"
                      ? "/dashboard"
                      : appState.user.role === "educator"
                        ? "/educator"
                        : appState.user.role == "system-administrator"
                          ? "/site-admin"
                          : "/admin"
                  }
                  replace
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              appState.user ? (
                <Navigate
                  to={
                    appState.user.role === "student"
                      ? "/dashboard"
                      : appState.user.role === "educator"
                        ? "/educator"
                        : appState.user.role == "system-administrator"
                          ? "/site-admin"
                          : "/admin"
                  }
                  replace
                />
              ) : (
                <RegisterPage onLogin={handleLogin} />
              )
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommended-courses"
            element={
              <ProtectedRoute>
                <RecommendedCourses />
              </ProtectedRoute>
            }
          />


          {/* Educator Routes */}
          <Route
            path="/educator"
            element={
              <ProtectedRoute>
                <EducatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educator/courses/new"
            element={
              <ProtectedRoute>
                <CourseCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educator/courses/:courseId/edit"
            element={
              <ProtectedRoute>
                <CourseCreation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educator/courses/:courseId/analytics"
            element={
              <ProtectedRoute>
                <CourseAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Course Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <CourseAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Site Admin Routes */}
          <Route
            path="/site-admin"
            element={
              <ProtectedRoute>
                <SiteAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Course Routes */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseCatalog user={appState.user!} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/dashboard"
            element={
              <ProtectedRoute>
                <CourseDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/quiz/:lessonId"
            element={
              <ProtectedRoute>
                <CourseQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            }
          />

          {/* Simulator Routes */}
          <Route
            path="/simulators/circuit"
            element={
              <ProtectedRoute>
                <CircuitSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulators/circuit/:circuitId"
            element={
              <ProtectedRoute>
                <CircuitSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulators/network"
            element={
              <ProtectedRoute>
                <NetworkSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulators/network/:networkId"
            element={
              <ProtectedRoute>
                <NetworkSimulator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/simulators/sandbox"
            element={
              <ProtectedRoute>
                <JSSandbox />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />

          {/* Profile Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings user={appState.user!} />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <ApiProvider api={api}>
      <Router>
        <AppContent />
      </Router>
    </ApiProvider>
  )
}

export default App
