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
  {/* Background quantum network image */}
  {/* <div 
  className="absolute inset-0 bg-cover bg-center opacity-40"
  style={{
    backgroundImage: `url(${heroBackground})`
  }}
></div> */}
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
  
  {/* Navigation */}
  <nav className="relative z-10 flex justify-between items-center p-6">
    <div className="flex items-center">
  <img 
    src={logoImage2}
    alt="QuLearn Logo" 
    className="w-15 h-15 rounded mr-2"
  />
  <span className="text-white text-3xl font-bold">QuLearn</span>
</div>
    <Link
      to="/login"
      className="bg-blue-400 hover:bg-blue-500 text-blue-900 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
    >
      Login
    </Link>
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
          className="bg-blue-400 hover:bg-blue-500 text-blue-900 px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
        >
          EXPLORE COURSES
        </Link>
        <Link
          to="/register"
          className="bg-blue-400 hover:bg-blue-500 text-blue-900 px-8 py-4 rounded-lg font-bold text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
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
