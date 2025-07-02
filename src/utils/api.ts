
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TestInput = void
type TestOutput = {
    message: string;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/',
    }),
    endpoints: (build) => ({
        getTest: build.query<TestOutput, TestInput>({
            query: () => `/test`,
        }),
    }),
})

export const { useGetTestQuery } = api
