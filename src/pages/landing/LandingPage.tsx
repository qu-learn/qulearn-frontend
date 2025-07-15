"use client"

import type React from "react"
import { ArrowRight, BookOpen, Users, Award, Zap, Globe, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetLandingPageDataQuery } from "../../utils/api"

const LandingPage: React.FC = () => {
  const { data: landingData, isLoading } = useGetLandingPageDataQuery()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">QuLearn</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Master Quantum Computing Through Interactive Learning
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              Transform your understanding of quantum mechanics with hands-on simulators, gamified learning paths, and
              expert-designed courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Statistics Section */}
      {!isLoading && landingData && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{landingData.noOfStudents.toLocaleString()}</h3>
                <p className="text-gray-600">Active Students</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{landingData.noOfCourses.toLocaleString()}</h3>
                <p className="text-gray-600">Expert Courses</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{landingData.noOfLecturers.toLocaleString()}</h3>
                <p className="text-gray-600">Expert Instructors</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuLearn?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience quantum computing education like never before with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Simulators</h3>
              <p className="text-gray-600">
                Build and test quantum circuits with our drag-and-drop simulator. Visualize quantum states in real-time
                with Bloch spheres and probability distributions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gamified Learning</h3>
              <p className="text-gray-600">
                Earn points, unlock achievements, and track your progress. Stay motivated with streaks, leaderboards,
                and milestone rewards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Network Simulation</h3>
              <p className="text-gray-600">
                Explore quantum networks, EPR pairs, and teleportation protocols. Build complex quantum communication
                systems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Content</h3>
              <p className="text-gray-600">
                Learn from quantum computing experts with structured courses covering theory, applications, and hands-on
                practice.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of learners and educators. Share circuits, collaborate on projects, and learn from
                peers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certification Ready</h3>
              <p className="text-gray-600">
                Complete courses and earn certificates. Track your achievements and showcase your quantum computing
                expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Quantum Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already learning quantum computing with QuLearn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">QuLearn</h3>
            <p className="text-gray-400 mb-8">Empowering the next generation of quantum computing experts</p>
            <div className="flex justify-center space-x-8">
              <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                Courses
              </Link>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
