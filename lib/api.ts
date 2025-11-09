const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface Project {
  _id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
  status: "completed" | "in-progress" | "planned"
  createdAt: string
}

export interface ContactMessage {
  name: string
  email: string
  message: string
}

export interface Contact {
  _id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  contacts?: T[]
  totalPages: number
  currentPage: number
  total: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data }
    } catch (error) {
      console.error("API request failed:", error)
      return { error: "Network error occurred" }
    }
  }

  // Projects API
  async getProjects(params?: { featured?: boolean; limit?: number }): Promise<ApiResponse<Project[]>> {
    const searchParams = new URLSearchParams()
    if (params?.featured) searchParams.append("featured", "true")
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request<Project[]>(`/projects${query ? `?${query}` : ""}`)
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`)
  }

  async createProject(data: Omit<Project, "_id" | "createdAt">): Promise<ApiResponse<Project>> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Contact API
  async submitContact(data: ContactMessage): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getContacts(params?: { page?: number; limit?: number; read?: boolean }): Promise<
    ApiResponse<PaginatedResponse<Contact>>
  > {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.read !== undefined) searchParams.append("read", params.read.toString())

    const query = searchParams.toString()
    return this.request<PaginatedResponse<Contact>>(`/contact${query ? `?${query}` : ""}`)
  }

  async markContactAsRead(id: string): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contact/${id}/read`, {
      method: "PATCH",
    })
  }

  async deleteContact(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/contact/${id}`, {
      method: "DELETE",
    })
  }

  // Admin API
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/dashboard")
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>("/health")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
