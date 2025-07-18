// "use client"

// import type React from "react"
// import { useState } from "react"
// import { ArrowLeft, Play, CheckCircle, Award, Zap, Globe } from "lucide-react"
// import { Link, useParams, useNavigate } from "react-router-dom"
// import { useGetCourseByIdQuery, useSubmitQuizMutation } from "../../utils/api"

// const InteractiveLearning: React.FC = () => {
//   const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
//   const navigate = useNavigate()
//   const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string[] }>({})
//   const [quizSubmitted, setQuizSubmitted] = useState(false)
//   const [quizResults, setQuizResults] = useState<any>(null)
//   const [showAchievement, setShowAchievement] = useState(false)

//   const { data: courseData, isLoading } = useGetCourseByIdQuery(courseId!)
//   const [submitQuiz] = useSubmitQuizMutation()

//   const lesson = courseData?.course.modules.flatMap((module) => module.lessons).find((l) => l.id === lessonId)

//   const currentModuleIndex = courseData?.course.modules.findIndex((module) =>
//     module.lessons.some((l) => l.id === lessonId),
//   )
//   const currentLessonIndex = courseData?.course.modules[currentModuleIndex || 0]?.lessons.findIndex(
//     (l) => l.id === lessonId,
//   )

//   const nextLesson = (() => {
//     if (!courseData || currentModuleIndex === undefined || currentLessonIndex === undefined) return null

//     const currentModule = courseData.course.modules[currentModuleIndex]
//     if (currentLessonIndex < currentModule.lessons.length - 1) {
//       return currentModule.lessons[currentLessonIndex + 1]
//     }

//     if (currentModuleIndex < courseData.course.modules.length - 1) {
//       return courseData.course.modules[currentModuleIndex + 1].lessons[0]
//     }

//     return null
//   })()

//   const handleQuizAnswer = (questionId: string, answer: string, isMultiple: boolean) => {
//     setQuizAnswers((prev) => {
//       if (isMultiple) {
//         const currentAnswers = prev[questionId] || []
//         const newAnswers = currentAnswers.includes(answer)
//           ? currentAnswers.filter((a) => a !== answer)
//           : [...currentAnswers, answer]
//         return { ...prev, [questionId]: newAnswers }
//       } else {
//         return { ...prev, [questionId]: [answer] }
//       }
//     })
//   }

//   const handleQuizSubmit = async () => {
//     if (!lesson?.quiz) return

//     try {
//       const answers = Object.entries(quizAnswers).map(([questionId, answers]) => ({
//         questionId,
//         answers,
//       }))

//       const result = await submitQuiz({
//         courseId: courseId!,
//         lessonId: lessonId!,
//         answers: { answers },
//       }).unwrap()

//       setQuizResults(result)
//       setQuizSubmitted(true)

//       if (result.isPassed) {
//         setShowAchievement(true)
//         setTimeout(() => setShowAchievement(false), 3000)
//       }
//     } catch (error) {
//       console.error("Quiz submission failed:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
//       </div>
//     )
//   }

//   if (!courseData || !lesson) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h2>
//           <Link to={`/courses/${courseId}`} className="text-cyan-600 hover:text-cyan-800">
//             Back to Course
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Achievement Notification */}
//       {showAchievement && (
//         <div className="fixed top-20 right-4 bg-cyan-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
//           <div className="flex items-center">
//             <Award className="w-6 h-6 mr-2" />
//             <div>
//               <p className="font-semibold">Achievement Unlocked!</p>
//               <p className="text-sm">Quiz completed successfully</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex h-screen">
//         {/* Content Panel */}
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           <div className="bg-white shadow-sm border-b p-4">
//             <div className="flex items-center justify-between">
//               <Link to={`/courses/${courseId}`} className="flex items-center text-cyan-700 hover:text-cyan-800">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to Course
//               </Link>
//               <div className="text-center">
//                 <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
//                 <p className="text-sm text-gray-600">{courseData.course.title}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {nextLesson && (
//                   <Link
//                     to={`/courses/${courseId}/lessons/${nextLesson.id}`}
//                     className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
//                   >
//                     Next Lesson
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Lesson Content */}
//             {lesson.content && (
//               <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//                 <div className="prose max-w-none">
//                   <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
//                 </div>
//               </div>
//             )}

//             {/* Interactive Elements */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {lesson.circuitId && (
//                 <div className="bg-white rounded-xl shadow-lg p-6">
//                   <div className="flex items-center mb-4">
//                     <Zap className="w-6 h-6 text-cyan-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">Circuit Simulator</h3>
//                   </div>
//                   <p className="text-gray-600 mb-4">
//                     Practice with the interactive quantum circuit simulator for this lesson.
//                   </p>
//                   <Link
//                     to={`/simulators/circuit/${lesson.circuitId}`}
//                     className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors block text-center"
//                   >
//                     Open Circuit Simulator
//                   </Link>
//                 </div>
//               )}

//               {lesson.networkId && (
//                 <div className="bg-white rounded-xl shadow-lg p-6">
//                   <div className="flex items-center mb-4">
//                     <Globe className="w-6 h-6 text-purple-600 mr-2" />
//                     <h3 className="text-lg font-semibold text-gray-900">Network Simulator</h3>
//                   </div>
//                   <p className="text-gray-600 mb-4">Explore quantum networks and communication protocols.</p>
//                   <Link
//                     to={`/simulators/network/${lesson.networkId}`}
//                     className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors block text-center"
//                   >
//                     Open Network Simulator
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Quiz Section */}
//             {lesson.quiz && (
//               <div className="bg-white rounded-xl shadow-lg p-8">
//                 <div className="flex items-center mb-6">
//                   <CheckCircle className="w-6 h-6 text-cyan-700 mr-2" />
//                   <h3 className="text-xl font-bold text-gray-900">{lesson.quiz.title}</h3>
//                 </div>
//                 <p className="text-gray-600 mb-6">{lesson.quiz.description}</p>

//                 {!quizSubmitted ? (
//                   <div className="space-y-6">
//                     {lesson.quiz.questions.map((question, index) => (
//                       <div key={question.id} className="border border-gray-200 rounded-lg p-6">
//                         <h4 className="font-semibold text-gray-900 mb-4">
//                           {index + 1}. {question.text}
//                         </h4>
//                         <div className="space-y-3">
//                           {question.options.map((option, optionIndex) => (
//                             <label key={optionIndex} className="flex items-center cursor-pointer">
//                               <input
//                                 type={question.type === "multiple-choice" ? "checkbox" : "radio"}
//                                 name={question.id}
//                                 value={option}
//                                 checked={
//                                   question.type === "multiple-choice"
//                                     ? (quizAnswers[question.id] || []).includes(option)
//                                     : (quizAnswers[question.id] || [])[0] === option
//                                 }
//                                 onChange={() =>
//                                   handleQuizAnswer(question.id, option, question.type === "multiple-choice")
//                                 }
//                                 className="mr-3 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//                               />
//                               <span className="text-gray-700">{option}</span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     ))}

//                     <button
//                       onClick={handleQuizSubmit}
//                       disabled={Object.keys(quizAnswers).length === 0}
//                       className="w-full bg-cyan-700 text-white py-3 px-6 rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
//                     >
//                       Submit Quiz
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <div
//                       className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
//                         quizResults.isPassed ? "bg-cyan-100 text-cyan-800" : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {quizResults.isPassed ? (
//                         <CheckCircle className="w-6 h-6 mr-2" />
//                       ) : (
//                         <div className="w-6 h-6 mr-2 rounded-full border-2 border-current" />
//                       )}
//                       Score: {quizResults.score}%
//                     </div>
//                     <p className="text-gray-600 mb-6">
//                       {quizResults.isPassed ? "Congratulations! You passed the quiz." : "Keep studying and try again!"}
//                     </p>

//                     {/* Show correct answers */}
//                     <div className="text-left space-y-4">
//                       <h4 className="font-semibold text-gray-900">Correct Answers:</h4>
//                       {quizResults.correctAnswers.map((answer: any, index: number) => {
//                         const question = lesson.quiz!.questions.find((q) => q.id === answer.questionId)
//                         return (
//                           <div key={answer.questionId} className="bg-gray-50 p-4 rounded-lg">
//                             <p className="font-medium text-gray-900 mb-2">
//                               {index + 1}. {question?.text}
//                             </p>
//                             <p className="text-cyan-700">Correct answer(s): {answer.correctAnswers.join(", ")}</p>
//                           </div>
//                         )
//                       })}
//                     </div>

//                     {nextLesson && quizResults.isPassed && (
//                       <Link
//                         to={`/courses/${courseId}/lessons/${nextLesson.id}`}
//                         className="mt-6 bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors inline-block"
//                       >
//                         Continue to Next Lesson
//                       </Link>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Progress Sidebar */}
//         <div className="w-80 bg-white shadow-lg border-l">
//           <div className="p-6">
//             <h3 className="text-lg font-bold text-cyan-700 mb-4">Course Progress</h3>

//             <div className="space-y-4">
//               {courseData.course.modules.map((module, moduleIndex) => (
//                 <div key={module.id} className="border border-gray-200 rounded-lg">
//                   <div className="p-4 bg-gray-50 border-b border-gray-200">
//                     <h4 className="font-semibold text-gray-900">{module.title}</h4>
//                   </div>
//                   <div className="p-2">
//                     {module.lessons.map((moduleLesson) => (
//                       <Link
//                         key={moduleLesson.id}
//                         to={`/courses/${courseId}/lessons/${moduleLesson.id}`}
//                         className={`w-full text-left p-3 rounded-lg hover:bg-cyan-50 transition-colors block ${
//                           moduleLesson.id === lessonId
//                             ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <Play className="w-4 h-4 mr-3" />
//                           <span className="flex-1">{moduleLesson.title}</span>
//                           {moduleLesson.quiz && <Award className="w-4 h-4 text-yellow-500" />}
//                           {moduleLesson.circuitId && <Zap className="w-4 h-4 text-cyan-500 ml-1" />}
//                           {moduleLesson.networkId && <Globe className="w-4 h-4 text-purple-500 ml-1" />}
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default InteractiveLearning
