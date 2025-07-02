import { useGetTestQuery } from "../utils/api"

export function TestPage() {
    const { data, isLoading, isError } = useGetTestQuery()
    return (
        <div className="p-4">
            <h1>Test</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading data</p>}
            {data && (
                <div>
                    <p>Message: {data.message}</p>
                </div>
            )}
        </div>
    );
}
