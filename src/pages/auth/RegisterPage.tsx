"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { useRegisterMutation } from "../../utils/api"
import { type IUser } from "../../utils/types"
import loginImage from "../../assets/login.png"

interface RegisterPageProps {
  onLogin: (user: IUser, token: string) => void
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [register, { isLoading, error }] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      return
    }

    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }).unwrap()
      onLogin(result.user, result.token)
    } catch (err) {
      console.error("Registration failed:", err)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-800">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left side: Image */}
        <div className="w-1/2 h-auto flex items-center justify-center bg-gray-100">
          <img src={loginImage} alt="Register" className="object-cover w-full h-full" style={{ borderRadius: '1.5rem 0 0 1.5rem' }} />
        </div>
        {/* Right side: Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Sign Up to QuLearn</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Rashel Howard"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

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

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                I agreed to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2">
                <strong className="font-bold">Registration Error: </strong>
                <span className="block">
                  {"data" in error && error.data && typeof error.data === "object" && "message" in error.data
                    ? String(error.data.message)
                    : "Registration failed. Please try again."}
                </span>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage