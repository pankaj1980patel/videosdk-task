type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_ENDPOINT;
export const fetcher = async <TResponse>({
  url,
  method = "GET",
  data,
  customHeaders = {},
  fetchInit = {},
}: {
  url: string;
  method?: HttpMethod;
  data?: any;
  customHeaders?: Record<string, string>;
  fetchInit?: RequestInit;
}): Promise<TResponse> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      ...customHeaders,
    };
    const response = await fetch(
      process.env.NEXT_PUBLIC_APP_API_ENDPOINT! + url,
      {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
        ...fetchInit,
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "We're experiencing technical difficulties. Please try again later.",
    } as TResponse;
  }
};
