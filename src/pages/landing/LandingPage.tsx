"use client"

import type React from "react"
import { ArrowRight, BookOpen, Users, Award, Zap, Globe, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetLandingPageDataQuery } from "../../utils/api"
import heroBackground from "../../assets/b.jpg"
import { useState, useEffect } from "react"
import Footer from "../../components/Footer"
import logoImage2 from "../../assets/logo2.png" 
import aboutImage from "../../assets/about.jpg"


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
  {/* Background video */}
  <video
    className="absolute inset-0 w-full h-full object-cover opacity-40"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/video5.mp4" type="video/mp4" />
    <source src="/video5.webm" type="video/webm" />
  </video>

  {/* Gradient overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/40 to-purple-900/60" />

  {/* Navigation */}
  <nav className="relative z-10">
    <div className="max-w-7xl mx-auto pl-4 pr-2 sm:pl-6 sm:pr-3 lg:pl-8 lg:pr-4 py-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logoImage2} alt="QuLearn Logo" className="w-12 h-12 rounded" />
        <span className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">QuLearn</span>
      </div>
      <div className="flex items-center gap-3 mr-2 sm:mr-4 lg:mr-6">
        <Link
          to="/login"
          className="text-white/90 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          aria-label="Sign in"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="bg-white text-blue-700 hover:bg-blue-50 px-4 sm:px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
          aria-label="Get started"
        >
          Get started
        </Link>
      </div>
    </div>
  </nav>

  {/* Main content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 md:pt-16 md:pb-36 flex items-center min-h-[70vh]">
    <div className="max-w-3xl">
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white tracking-tight mb-5">
          Learn Quantum Computing the Modern Way
        </h1>
        <p className="text-base md:text-lg text-blue-100/90 mb-8">
          Master quantum concepts with interactive courses and powerful simulators — designed for clarity, built for inspiration.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/courses-landing"
            className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-blue-950 px-7 py-3 md:px-8 md:py-4 rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Explore courses"
          >
            Explore Courses
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white px-7 py-3 md:px-8 md:py-4 rounded-xl font-semibold border border-white/20 transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Create your free account"
          >
            Create Free Account
          </Link>
        </div>

        {/* Quick value props */}
        <div className="mt-6 md:mt-8 flex flex-wrap gap-3 text-sm text-blue-100/90">
          <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10">No prior experience required</span>
          <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10">Hands-on simulators</span>
          <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border border-white/10">Learn at your own pace</span>
        </div>
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

    {/* Introduction Section */}
    <section className="py-20 bg-gradient-to-br from-blue-150 to-blue-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="transform transition-all duration-1000 ease-out hover:translate-x-2">
            <h2 className="text-4xl font-bold text-blue-900 mb-6 leading-tight transform transition-all duration-700 ease-out hover:scale-105">
              YOUR TRUSTED ONLINE EDUCATION PARTNER
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed transform transition-all duration-500 ease-out hover:text-gray-800">
              QuLearn is a pioneer in interactive quantum computing education, offering cutting-edge 
              simulation tools and comprehensive learning experiences. Our platform transforms complex 
              quantum concepts into engaging, accessible content that empowers learners worldwide. 
              With expert-designed curricula, gamified learning paths, and state-of-the-art quantum 
              circuit and network simulators, we're building the next generation of quantum computing 
              professionals. Our mission extends beyond education - we're creating a sustainable 
              ecosystem where knowledge meets innovation, making quantum computing accessible to 
              everyone from curious beginners to advanced researchers.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center bg-blue-400 hover:bg-blue-500 text-blue-900 px-8 py-4 rounded-lg font-semibold text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
            >
              LEARN MORE ABOUT US
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          {/* Right side - Image */}
          <div className="relative transform transition-all duration-1000 ease-out hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl transition-opacity duration-500 hover:opacity-0"></div>
            <img
              src={aboutImage}
              alt="Quantum Computing Education"
              className="w-full h-150 object-cover rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out relative z-10"
            />
          </div>
        </div>
      </div>
    </section>


      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-300 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Why Choose QuLearn?</h2>
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

      {/* Testimonials Section */}
    <section className="py-20 bg-gradient-to-br from-blue-300 to-gray-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4 transform transition-all duration-700 ease-out hover:scale-105">
            What Students are Saying
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* First Testimonial */}
          <div className=" backdrop-blur-sm p-8 rounded-lg shadow-lg border-2 border-gray-300 hover:shadow-2xl hover:scale-105 hover:bg-white transition-all duration-500 ease-out hover:border-blue-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="flex justify-center mb-4 hover:scale-110 transition-transform duration-300">
                {/* 5 Stars */}
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl hover:text-yellow-300 transition-colors duration-200">★</span>
                ))}
              </div>
              <p className="text-blue-900 leading-relaxed text-sm mb-6 font-bold hover:text-blue-800 transition-colors duration-300">
                QuLearn has completely transformed the way I learn. 
                The course content is rich, engaging, and clearly 
                designed by experts. The platform's user-friendly 
                interface made it easy for me to track my progress 
                and stay motivated. I've gained so much confidence 
                in quantum computing thanks to QuLearn!
              </p>
              <p className="text-cyan-800 font-semibold hover:text-cyan-600 transition-colors duration-300">
                Samudra Kariyawasam
              </p>
            </div>
          </div>

          {/* Second Testimonial */}
          <div className=" backdrop-blur-sm p-8 rounded-lg shadow-lg border-2 border-gray-300 hover:shadow-2xl hover:scale-105 hover:bg-white transition-all duration-500 ease-out hover:border-blue-300 transform hover:-translate-y-2" style={{transitionDelay: '150ms'}}>
            <div className="text-center">
              <div className="flex justify-center mb-4 hover:scale-110 transition-transform duration-300">
                {/* 5 Stars */}
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl hover:text-yellow-300 transition-colors duration-200">★</span>
                ))}
              </div>
              <p className="text-blue-900 leading-relaxed text-sm mb-6 font-bold hover:text-blue-800 transition-colors duration-300">
                As someone new to online learning, I was amazed by 
                how intuitive and visually appealing the QuLearn 
                platform is. The lessons are well-structured and 
                interactive, and I especially love the clean design and 
                smooth navigation. It's the perfect companion for 
                anyone looking to master complex subjects at their 
                own pace.
              </p>
              <p className="text-cyan-800 font-semibold hover:text-cyan-600 transition-colors duration-300">
                Amaya De Silva
              </p>
            </div>
          </div>

          {/* Third Testimonial */}
          <div className=" backdrop-blur-sm p-8 rounded-lg shadow-lg border-2 border-gray-300 hover:shadow-2xl hover:scale-105 hover:bg-white transition-all duration-500 ease-out hover:border-blue-300 transform hover:-translate-y-2" style={{transitionDelay: '300ms'}}>
            <div className="text-center">
              <div className="flex justify-center mb-4 hover:scale-110 transition-transform duration-300">
                {/* 5 Stars */}
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl hover:text-yellow-300 transition-colors duration-200">★</span>
                ))}
              </div>
              <p className="text-blue-900 leading-relaxed text-sm mb-6 font-bold hover:text-blue-800 transition-colors duration-300">
                The quantum circuit simulator is absolutely incredible! 
                Being able to drag and drop gates and see real-time 
                visualizations has made quantum mechanics so much easier 
                to understand. The gamification features keep me engaged, 
                and I love earning badges as I progress through the courses. 
                QuLearn has turned a challenging subject into an exciting 
                learning adventure!
              </p>
              <p className="text-cyan-800 font-semibold hover:text-cyan-600 transition-colors duration-300">
                Chathumini de Zoysa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Quantum Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already learning quantum computing with QuLearn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4  rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
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
