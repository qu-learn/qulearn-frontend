"use client"

import type React from "react"
import { useState } from "react"
import { User, BookOpen, Zap, Award, LogOut, Settings, ChevronDown } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { type IUser } from "../utils/types"
import logoImage1 from "../assets/logo1.png" 
import logoImage2 from "../assets/logo2.png" 

interface HeaderProps {
  user: IUser
  onLogout: () => void
  currentPage: string
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentPage }) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleLogout = () => {
    closeDropdown()
    onLogout()
  }

  const handleSettingsClick = () => {
    closeDropdown()
    navigate("/profile")
  }

  const getNavigationItems = () => {
    // Base navigation items for ALL users (main navigation)
    const baseItems = [
      { id: "/courses", label: "Courses", icon: BookOpen },
      { id: "/achievements", label: "Achievements", icon: Award },
    ]

    // Role-specific dashboard routing only
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
        return [
          { id: "/dashboard", label: "Dashboard", icon: User },
          ...baseItems,
        ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
  <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-800 shadow-lg z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-0">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoImage2}
                alt="QuLearn Logo" 
                className="h-15 w-15" 
              />
              <h1 className="text-3xl font-bold bg-white bg-clip-text text-transparent">
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

          {/* User profile and action buttons */}
          <div className="flex items-center space-x-4">
            {/* Role-specific action buttons */}
            {(user.role === "student" || user.role === "educator") && (
              <>
                <Link
                  to="/simulators/circuit"
                  className="flex items-center px-3 py-2 rounded-md text-large font-medium text-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Circuit Simulator
                </Link>
                <Link
                  to="/simulators/network"
                  className="flex items-center px-3 py-2 rounded-md text-large font-medium text-white hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Network Simulator
                </Link>
              </>
            )}

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-large font-medium text-white hover:text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl || "/placeholder.svg"} 
                    alt={user.fullName} 
                    className="w-8 h-8 rounded-full" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-large font-medium">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-large font-medium text-white hover:text-blue-600 hover:bg-blue-50 transition-colors">{user.fullName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}

              {/* Backdrop to close dropdown when clicking outside */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={closeDropdown}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
