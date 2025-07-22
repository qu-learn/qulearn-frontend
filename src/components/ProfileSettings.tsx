// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { ArrowLeft, Save, User, Mail, MapPin } from "lucide-react"
// import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../utils/api"
// import { useNavigate } from "react-router-dom"
// import { type IUser } from "../utils/types"

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
//               {/* <p className="text-blue-100 capitalize">{profileData.user.role}</p> */}
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

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, User, Mail, MapPin, Phone, Lock, FileText, Award, Edit, Eye, EyeOff } from "lucide-react"
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../utils/api"
import { useNavigate } from "react-router-dom"
import { type IUser } from "../utils/types"


const ProfileSettings: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    bio: "",
    certificationName: "",
    contactNumber: "",
    password: "",
  })

  const [showPasswordEdit, setShowPasswordEdit] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const { data: profileData, isLoading } = useGetMyProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.user.fullName,
        email: profileData.user.email,
        country: profileData.user.country || "",
        city: profileData.user.city || "",
        bio: (profileData.user as any).bio || "",
        certificationName: (profileData.user as any).certificationName || "",
        contactNumber: (profileData.user as any).contactNumber || "",
        password: "",
      })
    }
  }, [profileData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData).unwrap()
      // Update local storage
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }))
      }
    } catch (error) {
      console.error("Profile update failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => {
            const user = profileData.user
            const dashboardPage =
              user.role === "student"
                ? "/dashboard"
                : user.role === "educator"
                  ? "/educator"
                  : "/admin"
            navigate(dashboardPage)
          }}
          className="flex items-center text-cyan-700 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-bold text-cyan-700 mb-2">My Profile</h1>
          {/* <p className="text-cyan-600">Manage your account information</p> */}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-cyan-800 to-cyan-500 px-8 py-12">
          <div className="flex items-center">
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center">
              {profileData.user.avatarUrl ? (
                <img
                  src={profileData.user.avatarUrl || "/placeholder.svg"}
                  alt={profileData.user.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  {profileData.user.fullName.charAt(0).toUpperCase()}
                </span>
              )}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                onClick={() => {
                  // Handle profile photo change logic here
                  console.log("Edit profile photo clicked")
                }}
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="ml-6 text-white">
              <h2 className="text-2xl font-bold">{profileData.user.fullName}</h2>
              <p className="text-blue-100 capitalize">{profileData.user.role}</p>
              <p className="text-blue-100">{profileData.user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-2 gap-20">
            {/* First Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 mr-2" />
                  Name for Certification
                </label>
                <input
                  type="text"
                  name="certificationName"
                  value={formData.certificationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name as it should appear on certificates"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your country"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your contact number"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                
                {!showPasswordEdit ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value="••••••••"
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordEdit(true)}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Old Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisibility.old ? "text" : "password"}
                          value={passwordForm.oldPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, oldPassword: e.target.value}))}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisibility(prev => ({...prev, old: !prev.old}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisibility.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisibility(prev => ({...prev, new: !prev.new}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisibility.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisibility(prev => ({...prev, confirm: !prev.confirm}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {passwordVisibility.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordEdit(false)
                          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
                          setPasswordVisibility({ old: false, new: false, confirm: false })
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // Handle password change logic here
                          console.log("Password change:", passwordForm)
                          setShowPasswordEdit(false)
                          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
                          setPasswordVisibility({ old: false, new: false, confirm: false })
                        }}
                        className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition-colors text-sm"
                        disabled={!passwordForm.oldPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                <p className="text-sm text-gray-600">
                  Member since {new Date(profileData.user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettings

