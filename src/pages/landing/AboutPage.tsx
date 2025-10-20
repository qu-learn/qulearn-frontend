"use client"

import type React from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"
import aboutUs1 from "../../assets/aboutUs1.jpg"

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Section */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-200 to-gray-500 justify-between items-center p-8">
          <Link
        to="/"
        className="flex items-center text-blue-800 hover:text-blue-600 transition-colors"
    >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
    </Link>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-gray-800">
              <h1 className="text-3xl font-bold mb-8 uppercase tracking-wide">
                YOUR TRUSTED HIGHER EDUCATION PARTNER
              </h1>
              <div className="space-y-4 text-medium leading-relaxed">
                <p>
                  Welcome to QuLearn, a pioneering quantum computing learning platform designed 
                  to make the knowledge and skills of university students with a special 
                  focus on overcoming the latest trends of UCSC. Beyond all an institute for scientific 
                  exploration and future-focused technology. QuLearn believes that our business 
                  lies at the intersection of education, innovation and authentic quantum 
                  computing.
                </p>
                <p>
                  At QuLearn, we are committed to transforming students' job's capability. Our 
                  platform offers an interactive and structured learning environment with expertly 
                  crafted content, visual simulations, perfect assessment, and gamified challenges. 
                  Whether you're an instructor seeking creative curriculum content you to develop 
                  Wherever you're just beginning your quantum journey to searching for advanced 
                  resources to enhance to university level, the team content and learn offer of our way.
                </p>
                <p>
                  Rooted in scientific excellence and innovation. QuLearn is more than a learning 
                  platform – it's a launchpad that the next generation of quantum thinkers from UCSC 
                  and beyond.
                </p>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="relative">
              <img
                src={aboutUs1}
                alt="Quantum Computing Research Lab"
                className="w-full h-120 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="bg-gray-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-12">
            {/* Vision Box */}
            <div className=" p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 uppercase tracking-wide">
                  VISION
                </h2>
                <p className="text-blue-900 leading-relaxed text-medium font-bold">
                  To be the leading quantum computing education 
                  platform in Sri Lanka, fostering a new 
                  generation of quantum-literate professionals. We 
                  make quantum knowledge accessible, practical, and 
                  transformative for university students – inspiring 
                  them to innovate and contribute to quantum research 
                  globally.
                </p>
              </div>
            </div>

            {/* Mission Box */}
            <div className=" p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 uppercase tracking-wide">
                  MISSION
                </h2>
                <p className="text-blue-900 leading-relaxed text-medium font-bold">
                  QuLearn is committed to revolutionizing the way 
                  students engage with quantum computing 
                  education. Through cutting-edge simulators, 
                  interactive tools, and industry-aligned content, 
                  our mission is to empower UCSC students and 
                  beyond with the skills, knowledge, and confidence 
                  and creativity needed to thrive in the quantum 
                  era.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage