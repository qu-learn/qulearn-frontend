"use client"

import type React from "react"
import { User, BookOpen, Zap, Award, LogOut, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import type { IUser } from "../api"

interface HeaderProps {
  user: IUser
  onLogout: () => void
  currentPage: string
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentPage }) => {
  const navigate = useNavigate()

  const getNavigationItems = () => {
    const baseItems = [
      { id: "/courses", label: "Courses", icon: BookOpen },
      { id: "/achievements", label: "Achievements", icon: Award },
    ]

    switch (user.role) {
      case "student":
        return [
          { id: "/dashboard", label: "Dashboard", icon: User },
          ...baseItems,
          { id: "/simulators/circuit", label: "Circuit Simulator", icon: Zap },
          { id: "/simulators/network", label: "Network Simulator", icon: Zap },
        ]
      case "educator":
        return [
          { id: "/educator", label: "Dashboard", icon: User },
          ...baseItems,
          { id: "/simulators/circuit", label: "Circuit Simulator", icon: Zap },
          { id: "/simulators/network", label: "Network Simulator", icon: Zap },
        ]
      case "course-administrator":
        return [
          { id: "/admin", label: "Dashboard", icon: User },
          ...baseItems,
          { id: "/simulators/circuit", label: "Circuit Simulator", icon: Zap },
          { id: "/simulators/network", label: "Network Simulator", icon: Zap },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  QuLearn
                </h1>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    to={item.id}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.avatarUrl ? (
                <img src={user.avatarUrl || "/placeholder.svg"} alt={user.fullName} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.fullName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{user.fullName}</span>
            </div>
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
