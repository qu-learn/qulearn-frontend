"use client"

import type React from "react"
import { useState, useEffect, Fragment, useRef } from "react"
import { ArrowLeft, Save, User, Mail, MapPin, Phone, Lock, FileText, Award, Edit, Eye, EyeOff } from "lucide-react"
import { useGetMyProfileQuery, useUpdateMyProfileMutation, useChangePasswordMutation } from "../utils/api"
import { useNavigate } from "react-router-dom"
import { type IUser } from "../utils/types"
import { Transition, Tab, Disclosure, Switch } from "@headlessui/react"

interface ProfileSettingsProps {
  user: IUser
}


const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const navigate = useNavigate()
  const disclosureBtnRef = useRef<HTMLButtonElement | null>(null)
  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation()
  const [toast, setToast] = useState<{ show: boolean; message: string; success: boolean }>({ show: false, message: "", success: true })
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    bio: "",
    certName: "",
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

  // always refetch profile on mount to avoid showing stale/cached data
  const { data: profileData, isLoading } = useGetMyProfileQuery(undefined, { refetchOnMountOrArgChange: true })
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.user.fullName,
        email: profileData.user.email,
        country: profileData.user.country || "",
        city: profileData.user.city || "",
        bio: (profileData.user as any).bio || "",
        certName: (profileData.user as any).certName || "",
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

  // map backend reason codes to friendly messages
  const reasonToMessage = (reason?: string) => {
    switch (reason) {
      case "missing_passwords": return "Please provide both current and new passwords."
      case "user_not_found": return "User not found."
      case "incorrect_old_password": return "Current password is incorrect."
      case "new_password_same_as_old": return "New password must be different from the current one."
      default: return "Failed to change password. Please try again."
    }
  }

  // auto-hide toast
  useEffect(() => {
    if (!toast.show) return
    const t = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500)
    return () => clearTimeout(t)
  }, [toast.show])

  const handleChangePassword = async () => {
    try {
      const res = await changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword }).unwrap()
      if (res?.success) {
        // collapse panel, reset form
        disclosureBtnRef.current?.click()
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        setPasswordVisibility({ old: false, new: false, confirm: false })
        setToast({ show: true, message: "Password changed successfully.", success: true })
      } else {
        setToast({ show: true, message: reasonToMessage((res as any)?.reason), success: false })
      }
    } catch (err: any) {
      const reason = err?.data?.reason || err?.message
      setToast({ show: true, message: reasonToMessage(reason), success: false })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </Transition>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-[1500px] mx-auto px-10 py-10">
        <Transition
          show={true}
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="mb-8">
            <button
              onClick={() => {
                const dashboardPage = user.role === "student"
                  ? "/dashboard"
                  : user.role === "educator"
                  ? "/educator"
                  : "/admin"
                navigate(dashboardPage)
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
            >
              {/* <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard */}
            </button>
            <h1 className="text-4xl font-bold text-cyan-700 mb-2">My Profile</h1>
          </div>
        </Transition>

        <div className="flex flex-row gap-12 items-start">
          {/* Left: Profile Info Only (1/3) */}
          <div className="flex flex-col items-center justify-start w-1/3 min-w-[280px] max-w-sm py-8">
            <div className="relative w-90 h-90 rounded-full flex items-center justify-center group mb-6 shadow-xl overflow-hidden">
              {profileData.user.avatarUrl ? (
                <img
                  src={profileData.user.avatarUrl || "/placeholder.svg"}
                  alt={profileData.user.fullName}
                  className="w-90 h-90 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-90 h-90 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-7xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                    {profileData.user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 hover:scale-110"
                onClick={() => {
                  // Handle profile photo change logic here
                  console.log("Edit profile photo clicked")
                }}
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1 text-center break-words">{profileData.user.fullName}</h2>
            <p className="text-gray-500 capitalize mb-1 text-center">{profileData.user.role}</p>
            <p className="text-gray-500 text-center break-words">{profileData.user.email}</p>
          </div>

          {/* Right: Settings Form (2/3) */}
          <div className="flex-1 w-2/3 bg-white rounded-xl shadow-lg px-8 py-12 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Tab.Group>
                <Tab.List className="flex space-x-2 rounded-xl bg-blue-100 p-1 mb-6">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        type="button"
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        Personal Information
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        type="button"
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200
                          ${
                            selected
                              ? "bg-white text-cyan-700 shadow"
                              : "text-blue-700 hover:bg-white/[0.12] hover:text-cyan-600"
                          }`}
                      >
                        Security
                      </button>
                    )}
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  {/* Personal Information Tab */}
                  <Tab.Panel>
                    <Transition
                      show={true}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      <div className="grid grid-cols-2 gap-20">
                        {/* First Column */}
                        <div className="space-y-6">
                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-100"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your full name"
                              />
                            </div>
                          </Transition>

                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-150"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Tell us about yourself"
                              />
                            </div>
                          </Transition>

                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-200"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
                            <div>
                              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Award className="w-4 h-4 mr-2" />
                                Name for Certification
                              </label>
                              <input
                                type="text"
                                name="certName"
                                value={formData.certName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Name as it should appear on certificates"
                              />
                            </div>
                          </Transition>

                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-250"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your country"
                              />
                            </div>
                          </Transition>

                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-300"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your city"
                              />
                            </div>
                          </Transition>
                        </div>

                        {/* Second Column */}
                        <div className="space-y-6">
                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-100"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your email address"
                              />
                            </div>
                          </Transition>

                          <Transition
                            show={true}
                            as={Fragment}
                            enter="transition-all duration-300 delay-150"
                            enterFrom="opacity-0 translate-x-4"
                            enterTo="opacity-100 translate-x-0"
                          >
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your contact number"
                              />
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </Transition>
                  </Tab.Panel>

                  {/* Security Tab */}
                  <Tab.Panel>
                    <Transition
                      show={true}
                      as={Fragment}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      <div className="max-w-2xl">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                ref={disclosureBtnRef}
                                className="flex w-full justify-between items-center rounded-lg bg-blue-50 px-4 py-4 text-left text-sm font-medium text-blue-900 hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-all duration-200"
                              >
                                 <div className="flex items-center">
                                   <Lock className="w-5 h-5 mr-3" />
                                   <span>Password Settings</span>
                                 </div>
                                 <Edit className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500 transition-transform duration-200`} />
                               </Disclosure.Button>
                               <Transition
                                 enter="transition duration-300 ease-out"
                                 enterFrom="transform scale-95 opacity-0"
                                 enterTo="transform scale-100 opacity-100"
                                 leave="transition duration-200 ease-out"
                                 leaveFrom="transform scale-100 opacity-100"
                                 leaveTo="transform scale-95 opacity-0"
                               >
                                 <Disclosure.Panel className="px-4 pt-4 pb-2">
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
                                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                          placeholder="Enter current password"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setPasswordVisibility(prev => ({...prev, old: !prev.old}))}
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                          placeholder="Enter new password"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setPasswordVisibility(prev => ({...prev, new: !prev.new}))}
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                          placeholder="Confirm new password"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setPasswordVisibility(prev => ({...prev, confirm: !prev.confirm}))}
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                        >
                                          {passwordVisibility.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          // programmatically click the Disclosure button to collapse the panel
                                          disclosureBtnRef.current?.click()
                                          setShowPasswordEdit(false)
                                          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
                                          setPasswordVisibility({ old: false, new: false, confirm: false })
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleChangePassword}
                                        className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={
                                          !passwordForm.oldPassword ||
                                          !passwordForm.newPassword ||
                                          passwordForm.newPassword !== passwordForm.confirmPassword ||
                                          passwordForm.oldPassword === passwordForm.newPassword ||
                                          isChanging
                                        }
                                      >
                                        {isChanging ? "Changing..." : "Confirm"}
                                      </button>
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </Transition>
                            </>
                          )}
                        </Disclosure>
                      </div>
                    </Transition>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
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
                    className="flex items-center px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast (bottom-right) */}
      <Transition
        show={toast.show}
        as={Fragment}
        appear={true}
        enter="transform transition duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transform transition duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div
          aria-live="polite"
          role="status"
          className="fixed bottom-6 right-6 z-[9999] pointer-events-auto"
        >
          <div className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg ${toast.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            <div className="text-sm">{toast.message}</div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default ProfileSettings

