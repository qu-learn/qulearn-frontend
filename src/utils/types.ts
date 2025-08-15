// Types
export type Role = "student" | "educator" | "course-administrator" | "system-administrator"
export type CourseStatus = "draft" | "under-review" | "published" | "rejected"
export type BadgeCriteriaType = "courses-completed" | "simulations-run" | "quizzes-answered"
export type AccountStatus = "active" | "suspended" | "deactivated" | "deleted"

export interface IUser {
  id: string
  fullName: string
  email: string
  role: Role
  avatarUrl?: string
  country?: string
  city?: string
  createdAt: string
  gender?: string
  contactNumber?: string
  status?: AccountStatus
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
  jupyterNotebookUrl?: string
  modules: IModule[]
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
  course: ICourse
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
  modules: IModule[]
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

export interface IAddCourseAdministratorRequest {
  fullName: string
  email: string
  password: string
  contactNumber: string
  nationalId: string
  residentialAddress: string
  gender: string
  // New: optional account status for updates (kept optional to avoid affecting creation flows)
  accountStatus?: AccountStatus
}

export interface IAddCourseAdministratorResponse {
  cAdmin: IUser
}

export interface IUpdateCourseAdministratorRequest {
  cAdminId: string
  cAdmin: IAddCourseAdministratorRequest
}

export interface IUpdateCourseAdministratorResponse {
  cAdmin: IUser
}

export interface IGetCourseAdministratorResponse {
  cAdmin: IUser
}

export interface IGetCourseAdministratorsResponse {
  cAdmins: IUser[]
}

export interface IDeleteCourseAdministratorRequest {
  cAdminId: string
}

export interface IDeleteCourseAdministratorResponse {
  success: boolean
}
