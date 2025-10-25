import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function QueryProvider(
    { children }: { children: React.ReactNode }
){
// Create a client

const [queryClient] = useState(() => new QueryClient({


    defaultOptions:{
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false, // Disable refetch on window focus
            retry: 1, // Retry once on failure
        },
    },
}))

return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)}