// "use client"

// import type React from "react"
// import { useState } from "react"
// import { ArrowLeft, Home, BookOpen, FileText, BarChart3, Clock, Award, CheckCircle } from "lucide-react"
// import { Link, useParams } from "react-router-dom"
// import { useGetCourseByIdQuery, useSubmitQuizMutation } from "../../utils/api"

// const CourseQuiz: React.FC = () => {
//   const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
//   const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string[] }>({})
//   const [quizSubmitted, setQuizSubmitted] = useState(false)
//   const [quizResults, setQuizResults] = useState<any>(null)

//   const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)
//   const [submitQuiz] = useSubmitQuizMutation()

//   const lesson = courseData?.course.modules
//     .flatMap((module) => module.lessons)
//     .find((l) => l.id === lessonId)

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

//   const handleSubmitQuiz = async () => {
//     if (!lesson?.quiz) return

//     try {
//       const answers = Object.entries(quizAnswers).map(([questionId, answers]) => ({
//         questionId,
//         answers,
//       }))

//       console.log("Submitting quiz with answers:", answers)
//       console.log("Quiz answers state:", quizAnswers)

//       const result = await submitQuiz({
//         courseId: courseId!,
//         lessonId: lessonId!,
//         answers: {
//           answers,
//         },
//       }).unwrap()

//       console.log("Quiz result:", result)
//       setQuizResults(result)
//       setQuizSubmitted(true)
//     } catch (error) {
//       console.error("Quiz submission failed:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-700"></div>
//       </div>
//     )
//   }

//   if (error || !courseData || !lesson || !lesson.quiz) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
//           <p className="text-gray-600">The requested quiz could not be found.</p>
//           {/* <Link
//             to={`/courses/${courseId}/dashboard`}
//             className="mt-4 inline-block bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800"
//           >
//             Back to Course
//           </Link> */}
//         </div>
//       </div>
//     )
//   }

//   const { course } = courseData
//   const { quiz } = lesson

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         {/* Logo/Course Header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center mb-2">
//             <div className="w-8 h-8 bg-cyan-600 rounded mr-3 flex items-center justify-center">
//               <BookOpen className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="mt-4">
//           <Link
//             to={`/courses/${courseId}/dashboard`}
//             className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           >
//             Course Dashboard
//           </Link>

//           <Link
//             to={`/courses/${courseId}/dashboard`}
//             className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           >
//             Course Content
//           </Link>

//           <button
//             className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm"
//           >
//             Assessments
//           </button>

//           <Link
//             to={`/courses/${courseId}/dashboard`}
//             className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           >
//             Grades
//           </Link>
//         </nav>

        
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Link 
//                 to={`/courses/${courseId}/dashboard`}
//                 className="flex items-center text-cyan-700 hover:text-cyan-800 mr-4"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 {course.title}
//               </Link>
//               <div className="text-sm text-gray-500">
//                 Assessment: {lesson.title} Quiz
//               </div>
//             </div>
//             <div className="flex items-center text-sm text-gray-500">
//               <Clock className="w-4 h-4 mr-2" />
//               <span>Quiz in Progress</span>
//             </div>
//           </div>
//         </header>

//         {/* Quiz Content */}
//         <main className="flex-1 p-6">
//           <div className="max-w-4xl mx-auto">
//             {!quizSubmitted ? (
//               <div className="bg-white rounded-lg shadow-sm p-8">
//                 <div className="mb-8">
//                   <div className="flex items-center mb-4">
//                     <CheckCircle className="w-6 h-6 text-cyan-700 mr-2" />
//                     <h1 className="text-3xl font-bold text-gray-900">{lesson.title} Quiz</h1>
//                   </div>
//                   <p className="text-gray-600 mb-4">
//                     Test your understanding of {lesson.title.toLowerCase()}. Answer all questions to complete the assessment.
//                   </p>
//                   <div className="flex items-center text-sm text-gray-500">
//                     <Award className="w-4 h-4 mr-2" />
//                     <span>{quiz.questions.length} questions</span>
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   {quiz.questions.map((question, index) => (
//                     <div key={question.id} className="border border-gray-200 rounded-lg p-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         {index + 1}. {question.text}
//                       </h3>
//                       <div className="space-y-3">
//                         {question.options.map((option, optionIndex) => (
//                           <label
//                             key={optionIndex}
//                             className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50"
//                           >
//                             <input
//                               type={question.type === "multiple-choice" ? "checkbox" : "radio"}
//                               name={question.id}
//                               value={option}
//                               checked={
//                                 question.type === "multiple-choice"
//                                   ? (quizAnswers[question.id] || []).includes(option)
//                                   : (quizAnswers[question.id] || [])[0] === option
//                               }
//                               onChange={() =>
//                                 handleQuizAnswer(question.id, option, question.type === "multiple-choice")
//                               }
//                               className="mr-3 w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
//                             />
//                             <span className="text-gray-700">{option}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                   <button
//                     onClick={handleSubmitQuiz}
//                     disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
//                     className="w-full bg-cyan-700 text-white py-3 px-6 rounded-lg hover:bg-cyan-800 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//                   >
//                     Submit Quiz
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                 <div className="mb-6">
//                   <div
//                     className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
//                       quizResults?.isPassed ? "bg-cyan-100 text-cyan-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {quizResults?.isPassed ? (
//                       <CheckCircle className="w-6 h-6 mr-2" />
//                     ) : (
//                       <div className="w-6 h-6 mr-2 rounded-full border-2 border-current" />
//                     )}
//                     Score: {quizResults?.score || 0}%
//                   </div>
//                   <p className="text-gray-600 mb-6">
//                     {quizResults?.isPassed ? "Congratulations! You passed the quiz." : "Keep studying and try again!"}
//                   </p>
//                 </div>
                
//                 {quizResults && (
//                   <div className="text-left space-y-4 mb-6">
//                     <h4 className="font-semibold text-gray-900">Correct Answers:</h4>
//                     {quizResults.correctAnswers?.map((answer: any, index: number) => {
//                       const question = quiz.questions.find((q) => q.id === answer.questionId)
//                       return (
//                         <div key={answer.questionId} className="bg-gray-50 p-4 rounded-lg">
//                           <p className="font-medium text-gray-900 mb-2">
//                             {index + 1}. {question?.text}
//                           </p>
//                           <p className="text-cyan-700">Correct answer(s): {answer.correctAnswers?.join(", ")}</p>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}

//                 <div className="space-x-4">
//                   <Link
//                     to={`/courses/${courseId}/dashboard`}
//                     className="inline-block bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800"
//                   >
//                     Back to Course
//                   </Link>
//                   <button
//                     onClick={() => {
//                       setQuizSubmitted(false)
//                       setQuizAnswers({})
//                       setQuizResults(null)
//                     }}
//                     className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
//                   >
//                     Retake Quiz
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default CourseQuiz


"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Home, BookOpen, FileText, BarChart3, Clock, Award, CheckCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { RadioGroup, Checkbox, Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useGetCourseByIdQuery, useSubmitQuizMutation } from "../../utils/api"

const CourseQuiz: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string[] }>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId!)
  const [submitQuiz] = useSubmitQuizMutation()

  const lesson = courseData?.course.modules
    .flatMap((module) => module.lessons)
    .find((l) => l.id === lessonId)

  const handleQuizAnswer = (questionId: string, answer: string, isMultiple: boolean) => {
    setQuizAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || []
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter((a) => a !== answer)
          : [...currentAnswers, answer]
        return { ...prev, [questionId]: newAnswers }
      } else {
        return { ...prev, [questionId]: [answer] }
      }
    })
  }

  const handleRadioGroupChange = (questionId: string, value: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: [value]
    }))
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setQuizAnswers((prev) => {
      const currentAnswers = prev[questionId] || []
      const newAnswers = checked
        ? [...currentAnswers, option]
        : currentAnswers.filter((a) => a !== option)
      return { ...prev, [questionId]: newAnswers }
    })
  }

  const handleSubmitQuiz = async () => {
    if (!lesson?.quiz) return

    try {
      const answers = Object.entries(quizAnswers).map(([questionId, answers]) => ({
        questionId,
        answers,
      }))

      console.log("Submitting quiz with answers:", answers)
      console.log("Quiz answers state:", quizAnswers)

      const result = await submitQuiz({
        courseId: courseId!,
        lessonId: lessonId!,
        answers: {
          answers,
        },
      }).unwrap()

      console.log("Quiz result:", result)
      setQuizResults(result)
      setQuizSubmitted(true)
    } catch (error) {
      console.error("Quiz submission failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-700"></div>
      </div>
    )
  }

  if (error || !courseData || !lesson || !lesson.quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600">The requested quiz could not be found.</p>
          <Link
            to={`/courses/${courseId}/dashboard`}
            className="mt-4 inline-block bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800"
          >
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const { course } = courseData
  const { quiz } = lesson

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo/Course Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-cyan-600 rounded mr-3 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <Link
            to={`/courses/${courseId}/dashboard`}
            className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Course Dashboard
          </Link>

          <Link
            to={`/courses/${courseId}/dashboard`}
            className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Course Content
          </Link>

          <button
            className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-sm"
          >
            Assessments
          </button>

          <Link
            to={`/courses/${courseId}/dashboard`}
            className="w-full flex items-center px-6 py-4 text-left font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            Grades
          </Link>
        </nav>

        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to={`/courses/${courseId}/dashboard`}
                className="flex items-center text-cyan-700 hover:text-cyan-800 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {course.title}
              </Link>
              <div className="text-sm text-gray-500">
                Assessment: {lesson.title} Quiz
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Quiz in Progress</span>
            </div>
          </div>
        </header>

        {/* Quiz Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {!quizSubmitted ? (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-cyan-700 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-900">{lesson.title} Quiz</h1>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Test your understanding of {lesson.title.toLowerCase()}. Answer all questions to complete the assessment.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="w-4 h-4 mr-2" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {index + 1}. {question.text}
                      </h3>
                      
                      {question.type === "multiple-choice" ? (
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <Checkbox
                              key={optionIndex}
                              checked={(quizAnswers[question.id] || []).includes(option)}
                              onChange={(checked) => handleCheckboxChange(question.id, option, checked)}
                              className="group flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 data-[checked]:bg-cyan-50"
                            >
                              <div className="mr-3 flex h-4 w-4 items-center justify-center rounded border-2 border-gray-300 group-data-[checked]:border-cyan-600 group-data-[checked]:bg-cyan-600">
                                <CheckCircle className="h-3 w-3 text-white opacity-0 group-data-[checked]:opacity-100" />
                              </div>
                              <span className="text-gray-700 group-data-[checked]:text-gray-900 font-medium">
                                {option}
                              </span>
                            </Checkbox>
                          ))}
                        </div>
                      ) : (
                        <RadioGroup
                          value={(quizAnswers[question.id] || [])[0] || ''}
                          onChange={(value) => handleRadioGroupChange(question.id, value)}
                          className="space-y-3"
                        >
                          {question.options.map((option, optionIndex) => (
                            <RadioGroup.Option
                              key={optionIndex}
                              value={option}
                              className="group flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 data-[checked]:bg-cyan-50"
                            >
                              <div className="mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 group-data-[checked]:border-cyan-600">
                                <div className="h-2 w-2 rounded-full bg-cyan-600 opacity-0 group-data-[checked]:opacity-100" />
                              </div>
                              <span className="text-gray-700 group-data-[checked]:text-gray-900 font-medium">
                                {option}
                              </span>
                            </RadioGroup.Option>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
                    className="w-full bg-cyan-700 text-white py-3 px-6 rounded-lg hover:bg-cyan-800 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed data-[hover]:bg-cyan-800 data-[disabled]:bg-gray-400 data-[disabled]:cursor-not-allowed"
                  >
                    Submit Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Dialog open={quizSubmitted} onClose={() => {}} className="relative z-50">
                  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-2xl space-y-4 bg-white p-8 rounded-lg shadow-xl">
                      <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                        Quiz Results
                      </DialogTitle>
                      
                      <div className="text-center mb-6">
                        <div
                          className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
                            quizResults?.isPassed ? "bg-cyan-100 text-cyan-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {quizResults?.isPassed ? (
                            <CheckCircle className="w-6 h-6 mr-2" />
                          ) : (
                            <div className="w-6 h-6 mr-2 rounded-full border-2 border-current" />
                          )}
                          Score: {quizResults?.score || 0}%
                        </div>
                        <p className="text-gray-600 mb-6">
                          {quizResults?.isPassed ? "Congratulations! You passed the quiz." : "Keep studying and try again!"}
                        </p>
                      </div>
                      
                      {quizResults && (
                        <div className="text-left space-y-4 mb-6 max-h-60 overflow-y-auto">
                          <h4 className="font-semibold text-gray-900">Correct Answers:</h4>
                          {quizResults.correctAnswers?.map((answer: any, index: number) => {
                            const question = quiz.questions.find((q) => q.id === answer.questionId)
                            return (
                              <div key={answer.questionId} className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-900 mb-2">
                                  {index + 1}. {question?.text}
                                </p>
                                <p className="text-cyan-700">Correct answer(s): {answer.correctAnswers?.join(", ")}</p>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="flex space-x-4 pt-4">
                        <Link
                          to={`/courses/${courseId}/dashboard`}
                          className="flex-1 text-center bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800"
                        >
                          Back to Course
                        </Link>
                        <Button
                          onClick={() => {
                            setQuizSubmitted(false)
                            setQuizAnswers({})
                            setQuizResults(null)
                          }}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 data-[hover]:bg-gray-300"
                        >
                          Retake Quiz
                        </Button>
                      </div>
                    </DialogPanel>
                  </div>
                </Dialog>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CourseQuiz
