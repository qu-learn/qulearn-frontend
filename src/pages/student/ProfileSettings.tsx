// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { ArrowLeft, Save, User, Mail, MapPin } from "lucide-react"
// import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../utils/api"
// import { useNavigate } from "react-router-dom"
// import { type IUser } from "../../utils/types"

//  interface ProfileSettingsProps {
//   user: IUser
// }

// const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     country: "",
//     city: "",
//   })

 
//   const { data: profileData, isLoading } = useGetMyProfileQuery()
//   const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

//   useEffect(() => {
//     if (profileData) {
//       setFormData({
//         fullName: profileData.user.fullName,
//         email: profileData.user.email,
//         country: profileData.user.country || "",
//         city: profileData.user.city || "",
//       })
//     }
//   }, [profileData])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await updateProfile(formData).unwrap()
//       // Update local storage
//       const userData = localStorage.getItem("user")
//       if (userData) {
//         const user = JSON.parse(userData)
//         localStorage.setItem("user", JSON.stringify({ ...user, ...formData }))
//       }
//     } catch (error) {
//       console.error("Profile update failed:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (!profileData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
//           <p className="text-gray-600">Please try refreshing the page.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//       <button
//         onClick={() => {
//           const dashboardPage = user.role === "student" 
//             ? "/dashboard" 
//             : user.role === "educator" 
//             ? "/educator" 
//             : "/admin"
//           navigate(dashboardPage)
//         }}
//         className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
//       >
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back to Dashboard
//       </button>
//         <div>
//           <h1 className="text-3xl font-bold text-cyan-700 mb-2">Profile Settings</h1>
//           <p className="text-cyan-600">Manage your account information</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-cyan-700 to-cyan-600 px-8 py-12">
//           <div className="flex items-center">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
//               {profileData.user.avatarUrl ? (
//                 <img
//                   src={profileData.user.avatarUrl || "/placeholder.svg"}
//                   alt={profileData.user.fullName}
//                   className="w-24 h-24 rounded-full object-cover"
//                 />
//               ) : (
//                 <span className="text-3xl font-bold text-blue-600">
//                   {profileData.user.fullName.charAt(0).toUpperCase()}
//                 </span>
//               )}
//             </div>
//             <div className="ml-6 text-white">
//               <h2 className="text-2xl font-bold">{profileData.user.fullName}</h2>
//               <p className="text-blue-100 capitalize">{profileData.user.role}</p>
//               <p className="text-blue-100">{profileData.user.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Form */}
//         <form onSubmit={handleSubmit} className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-6">
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <User className="w-4 h-4 mr-2" />
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <Mail className="w-4 h-4 mr-2" />
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your email address"
//                 />
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your country"
//                 />
//               </div>

//               <div>
//                 <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter your city"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 pt-8 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
//                 <p className="text-sm text-gray-600">
//                   Member since {new Date(profileData.user.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isUpdating}
//                 className="flex items-center px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Save className="w-4 h-4 mr-2" />
//                 {isUpdating ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Account Stats
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-6 h-6 text-cyan-700" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Role</h3>
//           <p className="text-gray-600 capitalize">{profileData.user.role}</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Mail className="w-6 h-6 text-green-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Status</h3>
//           <p className="text-green-600">Verified</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
//           <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MapPin className="w-6 h-6 text-purple-600" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
//           <p className="text-gray-600">
//             {formData.city && formData.country ? `${formData.city}, ${formData.country}` : "Not specified"}
//           </p>
//         </div>
//       </div> */}
//     </div>
//   )
// }

// export default ProfileSettings
