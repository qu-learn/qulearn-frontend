"use client"

import React, { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useLoginMutation } from "../../utils/api"
import { type IUser } from "../../utils/types"
import loginImage from "../../assets/login.png"

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

  // Enhanced error message extraction function with debugging
  const getErrorMessage = (error: any): string => {
    console.log("Full error object:", error) // Debug log
    
    if (!error) return ""
    
    // Check for RTK Query error structure
    if ("data" in error && error.data && typeof error.data === "object") {
      console.log("Error data:", error.data) // Debug log
      if ("message" in error.data) {
        return String(error.data.message)
      }
      if ("error" in error.data) {
        return String(error.data.error)
      }
    }
    
    // // Check for standard error status codes
    // if ("status" in error) {
    //   console.log("Error status:", error.status) // Debug log
    //   switch (error.status) {
    //     case 401:
    //       return "Invalid email or password. Please check your credentials and try again."
    //     case 404:
    //       return "User not found. Please check your email address or sign up for a new account."
    //     case 429:
    //       return "Too many login attempts. Please wait a few minutes before trying again."
    //     case 500:
    //       return "Server error. Please try again later or contact support if the problem persists."
    //     default:
    //       return "Login failed. Please check your credentials and try again."
    //   }
    // }
    
    // Fallback for other error types
    if (typeof error === "string") {
      return error
    }
    
    if (error.message) {
      return error.message
    }
    
    return "Login failed. Please check your credentials and try again."
  }

  const errorMessage = getErrorMessage(error)
  console.log("Final error message:", errorMessage) // Debug log

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-800">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left side: Image */}
        <div className="w-1/2 h-auto flex items-center justify-center bg-gray-100">
          <img src={loginImage} alt="Login" className="object-cover w-full h-full" style={{ borderRadius: '1.5rem 0 0 1.5rem' }} />
        </div>
        {/* Right side: Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Sign In to QuLearn</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            {!!error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2">
                <strong className="font-bold">Login Error: </strong>
                <span className="block">{errorMessage || "Login failed. Please check your credentials and try again."}</span>
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">Debug Info (remove in production)</summary>
                  <pre className="text-xs text-gray-500 mt-1 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                </details>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.keepSignedIn}
                onChange={e => setFormData(prev => ({ ...prev, keepSignedIn: e.target.checked }))}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="ml-2 block text-sm text-gray-700">Keep me signed in</span>
            </label>
          </div>
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage