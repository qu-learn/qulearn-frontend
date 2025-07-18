"use client"

import type React from "react"
import { ArrowRight, BookOpen, Users, Award, Zap, Globe, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetLandingPageDataQuery } from "../../utils/api"
import heroBackground from "../../assets/b.jpg"
import { useState, useEffect } from "react"
import Footer from "../../components/Footer"


const LandingPage: React.FC = () => {
  const { data: landingData, isLoading } = useGetLandingPageDataQuery()

    const useCountAnimation = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (end === 0) return
    
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return count
}

 const animatedLecturers = useCountAnimation(landingData?.noOfLecturers || 0, 2000)
const animatedStudents = useCountAnimation(landingData?.noOfStudents || 0, 2500)
const animatedCourses = useCountAnimation(landingData?.noOfCourses || 0, 2200)
  return (
    <div className="min-h-screen">
  {/* Hero Section */}
<section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 min-h-screen">
  {/* Background quantum network image */}
  <div 
  className="absolute inset-0 bg-cover bg-center opacity-40"
  style={{
    backgroundImage: `url(${heroBackground})`
  }}
></div>
  
  {/* Navigation */}
  <nav className="relative z-10 flex justify-between items-center p-6">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-blue-400 rounded mr-2"></div>
      <span className="text-white text-xl font-bold">QuLearn</span>
    </div>
    {/* <div className="flex space-x-6">
      <Link to="/" className="text-white hover:text-blue-300">Home</Link>
      <Link to="/about" className="text-white hover:text-blue-300">About Us</Link>
      <Link to="/courses" className="text-white hover:text-blue-300">Courses</Link>
      <Link to="/contact" className="text-white hover:text-blue-300">Contact</Link>
    </div> */}
  </nav>

  {/* Main content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center min-h-[70vh]">
    <div className="max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-down">
        Empowering Your Quantum Computing<br />
        Education Journey
      </h1>
      
      <p className="text-lg text-gray-200 mb-8 uppercase tracking-wide animate-fade-in-up animation-delay-300">
        MASTER THE FUTURE OF TECHNOLOGY WITH INTERACTIVE COURSES AND<br />
        POWERFUL SIMULATORS.
      </p>
      
      <div className="flex flex-col gap-4 max-w-sm">
        <Link
          to="/courses-landing"
          className="bg-blue-400 hover:bg-blue-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-center transition-colors"
        >
          EXPLORE COURSES
        </Link>
        <Link
          to="/register"
          className="bg-blue-400 hover:bg-blue-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-center transition-colors"
        >
          SIGN UP
        </Link>
      </div>
    </div>
  </div>
</section>

{/* Statistics Section */}
{!isLoading && landingData && (
<section className="relative bg-blue-950 bg-opacity-90 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
  <div className="text-6xl font-bold text-white mb-2">{animatedLecturers.toLocaleString()}</div>
  <p className="text-gray-300 text-lg">Lecturers</p>
</div>
<div>
  <div className="text-6xl font-bold text-white mb-2">{animatedStudents.toLocaleString()}</div>
  <p className="text-gray-300 text-lg">Students</p>
</div>
<div>
  <div className="text-6xl font-bold text-white mb-2">{animatedCourses.toLocaleString()}</div>
  <p className="text-gray-300 text-lg">Courses</p>
</div>
      </div>
    </div>
  </section>
)}

      {/* Features Section */}
      <section className="py-20 bg-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose QuLearn?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience quantum computing education like never before with our comprehensive platform
            </p>
          </div>

                <div className="grid grid-cols-4 gap-5 mb-20">

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <div className="w-18 h-18 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Simulators</h3>
              <p className="text-gray-600">
                Build and test quantum circuits with our drag-and-drop simulator. Visualize quantum states in real-time
                with Bloch spheres and probability distributions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gamified Learning</h3>
              <p className="text-gray-600">
                Earn points, unlock achievements, and track your progress. Stay motivated with streaks, leaderboards,
                and milestone rewards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Network Simulation</h3>
              <p className="text-gray-600">
                Explore quantum networks, EPR pairs, and teleportation protocols. Build complex quantum communication
                systems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Content</h3>
              <p className="text-gray-600">
                Learn from quantum computing experts with structured courses covering theory, applications, and hands-on
                practice.
              </p>
            </div>

            {/* <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join a community of learners and educators. Share circuits, collaborate on projects, and learn from
                peers.
              </p>
            </div> */}

            {/* <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certification Ready</h3>
              <p className="text-gray-600">
                Complete courses and earn certificates. Track your achievements and showcase your quantum computing
                expertise.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-700 to-indigo-900">
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

      <Footer />

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
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
      </footer> */}
    </div>
    
  )
}

export default LandingPage
