import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Types
type Role = "student" | "educator" | "course-administrator" | "system-administrator"
type CourseStatus = "draft" | "under-review" | "published" | "rejected"
type BadgeCriteriaType = "courses-completed" | "simulations-run" | "quizzes-answered"

export interface IUser {
  id: string
  fullName: string
  email: string
  role: Role
  avatarUrl?: string
  country?: string
  city?: string
  createdAt: string
}

export interface IBadge {
  id: string
  name: string
  description: string
  iconUrl: string
}

export interface IAchievement {
  badge: IBadge
  achievedAt: string
}

export interface IQuiz {
  id: string
  title: string
  description: string
  questions: IQuestion[]
}

export interface IQuestion {
  id: string
  text: string
  type: "multiple-choice" | "single-choice"
  options: string[]
  answers: string[]
}

export interface ILesson {
  id: string
  title: string
  content?: string
  quiz?: IQuiz
  circuitId?: string
  networkId?: string
}

export interface IModule {
  id: string
  title: string
  lessons: ILesson[]
}

export interface ICourse {
  id: string
  title: string
  subtitle: string
  description: string
  thumbnailUrl: string
  category: string
  difficultyLevel: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  instructor: Pick<IUser, "id" | "fullName">
  status: CourseStatus
  createdAt: string
}

export interface IEnrollment {
  course: ICourse
  progressPercentage: number
  completedAt?: string
}

export type ICircuitConfiguration = {
  gates: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    qubit: number
    controlQubit?: number
  }>
  qubits: number
  results?: number[]
}

export interface ICircuit {
  id: string
  name: string
  configuration: ICircuitConfiguration
  createdAt: string
  updatedAt: string
}

export type INetworkConfiguration = {
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    type: "quantum" | "classical"
    label: string
  }>
  connections: Array<{
    id: string
    from: string
    to: string
    type: "quantum" | "classical"
  }>
  eprPairs: Array<{ nodeA: string; nodeB: string }>
}

export interface INetwork {
  id: string
  name: string
  configuration: INetworkConfiguration
  createdAt: string
  updatedAt: string
}

// Request/Response Interfaces
export interface IGetLandingPageDateResponse {
  noOfLecturers: number
  noOfStudents: number
  noOfCourses: number
}

export interface IRegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface IRegisterResponse {
  user: IUser
  token: string
}

export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginResponse {
  user: IUser
  token: string
}

export interface IGetMyProfileResponse {
  user: IUser
}

export interface IUpdateMyProfileRequest {
  fullName?: string
  email: string
  country?: string
  city?: string
}

export interface IUpdateMyProfileResponse {
  user: IUser
}

export interface IGetCoursesResponse {
  courses: ICourse[]
}

export interface IGetCourseByIdResponse {
  course: ICourse & { modules: IModule[] }
}

export interface IEnrollInCourseRequest {
  courseId: string
}

export interface IEnrollInCourseResponse {
  enrollment: IEnrollment
}

export interface IGetMyEnrollmentsResponse {
  enrollments: IEnrollment[]
}

export interface IGetMyDashboardResponse {
  points: number
  badges: IBadge[]
  learningStreak: number
  achievements: IAchievement[]
  enrolledCourses: IEnrollment[]
  recommendedCourses: ICourse[]
}

export interface IGetAchievementsResponse {
  milestones: string[]
  leaderboard: Array<{
    rank: number
    name: string
    points: number
  }>
}

export interface ISubmitQuizRequest {
  answers: { questionId: string; answers: string[] }[]
}

export interface ISubmitQuizResponse {
  score: number
  isPassed: boolean
  correctAnswers: { questionId: string; correctAnswers: string[] }[]
}

export interface ICreateCircuitRequest {
  name: string
  configuration: ICircuitConfiguration
}

export interface ICreateCircuitResponse {
  circuit: ICircuit
}

export interface IGetCircuitsResponse {
  circuits: ICircuit[]
}

export interface IGetCircuitResponse {
  circuit: ICircuit
}

export interface IUpdateCircuitRequest {
  name: string
  configuration: ICircuitConfiguration
}

export interface IUpdateCircuitResponse {
  circuit: ICircuit
}

export interface ICreateNetworkRequest {
  name: string
  configuration: INetworkConfiguration
}

export interface ICreateNetworkResponse {
  network: INetwork
}

export interface IGetNetworksResponse {
  networks: INetwork[]
}

export interface IGetNetworkResponse {
  network: INetwork
}

export interface IUpdateNetworkRequest {
  name: string
  configuration: INetworkConfiguration
}

export interface IUpdateNetworkResponse {
  network: INetwork
}

export interface ICreateCourseRequest {
  title: string
  subtitle: string
  description: string
  category: string
  difficultyLevel: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  thumbnailImageUrl: string
  jupyterNotebookUrl?: string
}

export interface ICreateCourseResponse {
  course: ICourse
}

export interface IUpdateCourseRequest {
  courseId: string
  course: ICreateCourseRequest
}

export interface IUpdateCourseResponse {
  course: ICourse
}

export interface IGetMyCoursesResponse {
  courses: ICourse[]
}

export interface IGetEducatorDashboardResponse {
  publishedCoursesCount: number
  totalStudents: number
}

export interface IGetCourseAnalyticsResponse {
  enrollmentCount: number
  completionRate: number
  averageQuizScore: number
  studentProgress: { studentId: string; studentName: string; progress: number }[]
}

export interface IUpdateGamificationSettingsRequest {
  pointsPerLesson: number
  pointsPerQuiz: number
  pointsPerSimulation: number
  badges: { name: string; criteria: { type: BadgeCriteriaType; threshold: number }; iconUrl: string }[]
}

export interface IUpdateGamificationSettingsResponse {
  success: boolean
}

export interface IGetCourseAdminDashboardResponse {
  totalUsers: number
  activeCourses: number
  newRegistrationsThisMonth: number
  pendingApprovals: number
  enrollmentsPerMonth: { month: string; count: number }[]
}

export interface IGetCourseAdminUsersRequest {
  page: number
  pageSize: number
}

export interface IGetCourseAdminUsersResponse {
  users: IUser[]
  totalPages: number
  currentPage: number
}

export type IGetCourseAdminCoursesRequest = {}

export interface IGetCourseAdminCoursesResponse {
  courses: ICourse[]
}

export interface IUpdateCourseStatusRequest {
  status: "published" | "rejected"
  feedback?: string
}

export interface IUpdateCourseStatusResponse {
  course: ICourse
}

export interface IAddEducatorRequest {
  fullName: string
  email: string
  password: string
  contactNumber: string
  nationalId: string
  residentialAddress: string
  gender: string
}

export interface IAddEducatorResponse {
  educator: IUser
}

export interface IUpdateEducatorRequest {
  educatorId: string
  educator: IAddEducatorRequest
}

export interface IUpdateEducatorResponse {
  educator: IUser
}

export interface IGetEducatorResponse {
  educator: IUser
}

export interface IGetEducatorsResponse {
  educators: IUser[]
}

export interface IDeleteEducatorRequest {
  educatorId: string
}

export interface IDeleteEducatorResponse {
  success: boolean
}

// RTK Query API
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["User", "Course", "Enrollment", "Circuit", "Network", "Achievement"],
  endpoints: (builder) => ({
    // Landing Page
    getLandingPageData: builder.query<IGetLandingPageDateResponse, void>({
      query: () => "/landingpage",
    }),

    // Authentication
    register: builder.mutation<IRegisterResponse, IRegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // User Profile
    getMyProfile: builder.query<IGetMyProfileResponse, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation<IUpdateMyProfileResponse, IUpdateMyProfileRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Courses
    getCourses: builder.query<IGetCoursesResponse, void>({
      query: () => "/courses",
      providesTags: ["Course"],
    }),
    getStudentCourses: builder.query<IGetCoursesResponse, void>({
      query: () => "/student/courses",
      providesTags: ["Course"],
    }),
    getCourseById: builder.query<IGetCourseByIdResponse, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: ["Course"],
    }),

    // Enrollments
    enrollInCourse: builder.mutation<IEnrollInCourseResponse, IEnrollInCourseRequest>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollment"],
    }),

    // Student Dashboard
    getMyDashboard: builder.query<IGetMyDashboardResponse, void>({
      query: () => "/students/me/dashboard",
      providesTags: ["User", "Enrollment", "Achievement"],
    }),
    getMyEnrollments: builder.query<IGetMyEnrollmentsResponse, void>({
      query: () => "/students/me/enrollments",
      providesTags: ["Enrollment"],
    }),

    // Achievements
    getAchievements: builder.query<IGetAchievementsResponse, void>({
      query: () => "/achievements",
      providesTags: ["Achievement"],
    }),

    // Quiz
    submitQuiz: builder.mutation<
      ISubmitQuizResponse,
      { courseId: string; lessonId: string; answers: ISubmitQuizRequest }
    >({
      query: ({ courseId, lessonId, answers }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}/quiz/submit`,
        method: "POST",
        body: answers,
      }),
    }),

    // Circuits
    getCircuits: builder.query<IGetCircuitsResponse, void>({
      query: () => "/circuits",
      providesTags: ["Circuit"],
    }),
    getCircuit: builder.query<IGetCircuitResponse, string>({
      query: (circuitId) => `/circuits/${circuitId}`,
      providesTags: ["Circuit"],
    }),
    createCircuit: builder.mutation<ICreateCircuitResponse, ICreateCircuitRequest>({
      query: (body) => ({
        url: "/circuits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Circuit"],
    }),
    updateCircuit: builder.mutation<IUpdateCircuitResponse, { circuitId: string } & IUpdateCircuitRequest>({
      query: ({ circuitId, ...body }) => ({
        url: `/circuits/${circuitId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Circuit"],
    }),
    deleteCircuit: builder.mutation<void, string>({
      query: (circuitId) => ({
        url: `/circuits/${circuitId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Circuit"],
    }),

    // Networks
    getNetworks: builder.query<IGetNetworksResponse, void>({
      query: () => "/networks",
      providesTags: ["Network"],
    }),
    getNetwork: builder.query<IGetNetworkResponse, string>({
      query: (networkId) => `/networks/${networkId}`,
      providesTags: ["Network"],
    }),
    createNetwork: builder.mutation<ICreateNetworkResponse, ICreateNetworkRequest>({
      query: (body) => ({
        url: "/networks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Network"],
    }),
    updateNetwork: builder.mutation<IUpdateNetworkResponse, { networkId: string } & IUpdateNetworkRequest>({
      query: ({ networkId, ...body }) => ({
        url: `/networks/${networkId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Network"],
    }),
    deleteNetwork: builder.mutation<void, string>({
      query: (networkId) => ({
        url: `/networks/${networkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Network"],
    }),

    // Educator Courses
    createCourse: builder.mutation<ICreateCourseResponse, ICreateCourseRequest>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation<IUpdateCourseResponse, IUpdateCourseRequest>({
      query: ({ courseId, course }) => ({
        url: `/courses/${courseId}`,
        method: "PATCH",
        body: course,
      }),
      invalidatesTags: ["Course"],
    }),
    getMyCourses: builder.query<IGetMyCoursesResponse, void>({
      query: () => "/educators/me/courses",
      providesTags: ["Course"],
    }),
    getEducatorDashboard: builder.query<IGetEducatorDashboardResponse, void>({
      query: () => "/educators/me/dashboard",
    }),

    // Course Analytics
    getCourseAnalytics: builder.query<IGetCourseAnalyticsResponse, string>({
      query: (courseId) => `/courses/${courseId}/analytics`,
    }),
    updateGamificationSettings: builder.mutation<
      IUpdateGamificationSettingsResponse,
      { courseId: string } & IUpdateGamificationSettingsRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/courses/${courseId}/gamification`,
        method: "PUT",
        body,
      }),
    }),

    // Course Admin
    getCourseAdminDashboard: builder.query<IGetCourseAdminDashboardResponse, void>({
      query: () => "/course-admin/dashboard",
    }),
    getCourseAdminUsers: builder.query<IGetCourseAdminUsersResponse, IGetCourseAdminUsersRequest>({
      query: ({ page, pageSize }) => `/course-admin/users?page=${page}&pageSize=${pageSize}`,
    }),
    getCourseAdminCourses: builder.query<IGetCourseAdminCoursesResponse, void>({
      query: () => "/course-admin/courses",
      providesTags: ["Course"],
    }),
    updateCourseStatus: builder.mutation<
      IUpdateCourseStatusResponse,
      { courseId: string } & IUpdateCourseStatusRequest
    >({
      query: ({ courseId, ...body }) => ({
        url: `/course-admin/courses/${courseId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourseAdmin: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/course-admin/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // Educator Management
    addEducator: builder.mutation<IAddEducatorResponse, IAddEducatorRequest>({
      query: (body) => ({
        url: "/course-admin/educators",
        method: "POST",
        body,
      }),
    }),
    getEducators: builder.query<IGetEducatorsResponse, void>({
      query: () => "/course-admin/educators",
    }),
    deleteEducator: builder.mutation<IDeleteEducatorResponse, string>({
      query: (educatorId) => ({
        url: `/course-admin/educators/${educatorId}`,
        method: "DELETE",
      }),
    }),
    getEducator: builder.query<IGetEducatorResponse, string>({
      query: (educatorId) => `/course-admin/educators/${educatorId}`,
    }),
    updateEducator: builder.mutation<IUpdateEducatorResponse, IUpdateEducatorRequest>({
      query: ({ educatorId, educator }) => ({
        url: `/course-admin/educators/${educatorId}`,
        method: "PATCH",
        body: educator,
      }),
    }),
  }),
})

// Export hooks
export const {
  useGetLandingPageDataQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetCoursesQuery,
  useGetStudentCoursesQuery,
  useGetCourseByIdQuery,
  useEnrollInCourseMutation,
  useGetMyDashboardQuery,
  useGetMyEnrollmentsQuery,
  useGetAchievementsQuery,
  useSubmitQuizMutation,
  useGetCircuitsQuery,
  useGetCircuitQuery,
  useCreateCircuitMutation,
  useUpdateCircuitMutation,
  useDeleteCircuitMutation,
  useGetNetworksQuery,
  useGetNetworkQuery,
  useCreateNetworkMutation,
  useUpdateNetworkMutation,
  useDeleteNetworkMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetMyCoursesQuery,
  useGetEducatorDashboardQuery,
  useGetCourseAnalyticsQuery,
  useUpdateGamificationSettingsMutation,
  useGetCourseAdminDashboardQuery,
  useGetCourseAdminUsersQuery,
  useGetCourseAdminCoursesQuery,
  useUpdateCourseStatusMutation,
  useDeleteCourseAdminMutation,
  useAddEducatorMutation,
  useGetEducatorsQuery,
  useDeleteEducatorMutation,
  useGetEducatorQuery,
  useUpdateEducatorMutation,
} = api
