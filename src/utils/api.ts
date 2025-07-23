import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
    IGetLandingPageDateResponse,
    IRegisterRequest,
    IRegisterResponse,
    ILoginRequest,
    ILoginResponse,
    IGetMyProfileResponse,
    IUpdateMyProfileRequest,
    IUpdateMyProfileResponse,
    IGetCoursesResponse,
    IGetCourseByIdResponse,
    IEnrollInCourseRequest,
    IEnrollInCourseResponse,
    IGetMyDashboardResponse,
    IGetMyEnrollmentsResponse,
    IGetAchievementsResponse,
    ISubmitQuizRequest,
    ISubmitQuizResponse,
    IGetCircuitsResponse,
    IGetCircuitResponse,
    ICreateCircuitRequest,
    ICreateCircuitResponse,
    IUpdateCircuitRequest,
    IUpdateCircuitResponse,
    IGetNetworksResponse,
    IGetNetworkResponse,
    ICreateNetworkRequest,
    ICreateNetworkResponse,
    IUpdateNetworkRequest,
    IUpdateNetworkResponse,
    ICreateCourseRequest,
    ICreateCourseResponse,
    IUpdateCourseRequest,
    IUpdateCourseResponse,
    IGetMyCoursesResponse,
    IGetEducatorDashboardResponse,
    IGetCourseAnalyticsResponse,
    IUpdateGamificationSettingsRequest,
    IUpdateGamificationSettingsResponse,
    IGetCourseAdminDashboardResponse,
    IGetCourseAdminUsersRequest,
    IGetCourseAdminUsersResponse,
    IGetCourseAdminCoursesResponse,
    IUpdateCourseStatusRequest,
    IUpdateCourseStatusResponse,
    IGetEducatorsResponse,
    IAddEducatorRequest,
    IAddEducatorResponse,
    IDeleteEducatorResponse,
    IGetEducatorResponse,
    IUpdateEducatorRequest,
    IUpdateEducatorResponse,
    IAddCourseAdministratorResponse,
    IAddCourseAdministratorRequest,
    IUpdateCourseAdministratorResponse,
    IUpdateCourseAdministratorRequest,
    IGetCourseAdministratorResponse,
    IDeleteCourseAdministratorResponse,
} from "./types"

// RTK Query API
export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        //baseUrl: "http://localhost:3000/api/v1/",
        baseUrl: '/api/v1',
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
                body: { course },
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

        // Course Administrator Management
        addCourseAdministrator: builder.mutation<IAddCourseAdministratorResponse, IAddCourseAdministratorRequest>({
            query: (body) => ({
                url: "/sys-admin/course-admins",
                method: "POST",
                body,
            }),
        }),
        getCourseAdministrators: builder.query<IGetCourseAdministratorResponse, void>({
            query: () => "/sys-admin/course-admins",
        }),
        deleteCourseAdministrator: builder.mutation<IDeleteCourseAdministratorResponse, string>({
            query: (cAdminId) => ({
                url: `/sys-admin/course-admins/${cAdminId}`,
                method: "DELETE",
            }),
        }),
        getCourseAdministrator: builder.query<IGetCourseAdministratorResponse, string>({
            query: (cAdminId) => `/sys-admin/course-admins/${cAdminId}`,
        }),
        updateCourseAdministrator: builder.mutation<IUpdateCourseAdministratorResponse, IUpdateCourseAdministratorRequest>({
            query: ({ cAdminId, cAdmin }) => ({
                url: `/sys-admin/course-admins/${cAdminId}`,
                method: "PATCH",
                body: cAdmin,
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
    useAddCourseAdministratorMutation,
    useGetCourseAdministratorsQuery,
    useDeleteCourseAdministratorMutation,
    useGetCourseAdministratorQuery,
    useUpdateCourseAdministratorMutation,
} = api
