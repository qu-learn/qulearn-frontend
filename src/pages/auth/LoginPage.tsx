"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft,Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useLoginMutation } from "../../utils/api"
import { type IUser } from "../../utils/types"

interface LoginPageProps {
  onLogin: (user: IUser, token: string) => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepSignedIn: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap()
      onLogin(result.user, result.token)
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #5372c5ff 0%, #3b82f6 50%, #93c5fd 100%)",
      }}
    >

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.47)",
            backdropFilter: "blur(10px)",
          }}
          
        >
        <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
        </Link>

          {/* Left Section with Logo and Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to QuLearn</h1>

            {/* Quantum Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-100 h-50">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer rings */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="url(#gradient3)"
                    strokeWidth="2"
                    opacity="0.8"
                  />

                  {/* Center sphere */}
                  <circle cx="50" cy="50" r="12" fill="url(#centerGradient)" />

                  {/* Orbital paths */}
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="25"
                    ry="15"
                    fill="none"
                    stroke="url(#gradient4)"
                    strokeWidth="1.5"
                    opacity="0.7"
                    transform="rotate(45 50 50)"
                  />
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="25"
                    ry="15"
                    fill="none"
                    stroke="url(#gradient5)"
                    strokeWidth="1.5"
                    opacity="0.7"
                    transform="rotate(-45 50 50)"
                  />

                  {/* Electrons */}
                  <circle cx="75" cy="50" r="3" fill="#FF6B6B" />
                  <circle cx="35" cy="35" r="3" fill="#4ECDC4" />
                  <circle cx="65" cy="65" r="3" fill="#45B7D1" />

                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f093fb" />
                      <stop offset="100%" stopColor="#f5576c" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4facfe" />
                      <stop offset="100%" stopColor="#00f2fe" />
                    </linearGradient>
                    <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a8edea" />
                      <stop offset="100%" stopColor="#fed6e3" />
                    </linearGradient>
                    <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff9a9e" />
                      <stop offset="100%" stopColor="#fecfef" />
                    </linearGradient>
                    <radialGradient id="centerGradient">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section with Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="bill.sanders@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">
                    {"data" in error && error.data && typeof error.data === "object" && "message" in error.data
                      ? String(error.data.message)
                      : "Login failed. Please check your credentials."}
                  </p>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Bottom Options */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepSignedIn"
                  name="keepSignedIn"
                  checked={formData.keepSignedIn}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keepSignedIn" className="ml-2 block text-sm text-gray-700">
                  Keep me signed in
                </label>
              </div>
              {/* <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a> */}
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage