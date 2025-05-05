import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to parse as JSON first
      const data = await res.json();
      console.error("API Error Response:", {
        status: res.status,
        statusText: res.statusText,
        data
      });
      throw new Error(data.message || `${res.status}: ${res.statusText}`);
    } catch (jsonError) {
      // If not JSON, get as text
      const text = await res.text();
      console.error("API Error Response (text):", {
        status: res.status,
        statusText: res.statusText,
        text
      });
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`API Request: ${method} ${url}`, data ? { data } : '');
  
  const options = {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include" as RequestCredentials,
  };
  
  console.log("Request options:", options);
  
  const res = await fetch(url, options);
  
  console.log(`API Response: ${method} ${url}`, {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    headers: Object.fromEntries([...res.headers]),
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
