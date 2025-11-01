import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Template {
  id: string
  name: string
  description: string | null
  category: string
  aiEnabled: boolean
  aiPrompt: string | null
  isPublic: boolean
  items?: TemplateItem[]
}

export interface TemplateItem {
  id: string
  title: string
  description: string | null
  order: number
  required: boolean
  aiKeywords: string[]
}

export interface Checklist {
  id: string
  meetingId: string
  templateId: string
  userId: string
  totalItems: number
  completedItems: number
  completionRate: number
  aiAnalysis: any
  items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  checklistId: string
  title: string
  description: string | null
  order: number
  required: boolean
  isCompleted: boolean
  completedAt: Date | null
  completedBy: string | null
  aiChecked: boolean
  aiConfidence: number | null
  notes: string | null
  aiKeywords: string[]
}

export interface Meeting {
  id: string
  title: string
  zoomMeetingId: string
  templateId: string | null
  hostUserId: string
  organizationId: string
  startedAt: Date
  endedAt: Date | null
  duration: number | null
  participants: any[]
  outcome: string | null
  dealStage: string | null
  dealValue: number | null
  transcript: string | null
  aiSummary: string | null
  aiSentiment: string | null
}

// Templates API
export const templatesApi = {
  list: async (params?: { search?: string; category?: string }) => {
    const response = await api.get<{ success: boolean; data: Template[] }>('/templates', { params })
    return response.data.data
  },

  get: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Template }>(`/templates/${id}`)
    return response.data.data
  },
}

// Meetings API
export const meetingsApi = {
  create: async (data: {
    title: string
    zoomMeetingId: string
    templateId?: string
    hostUserId: string
    organizationId: string
    startedAt?: Date
  }) => {
    const response = await api.post<{ success: boolean; data: Meeting }>('/meetings', data)
    return response.data.data
  },

  get: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Meeting }>(`/meetings/${id}`)
    return response.data.data
  },

  list: async (params?: { userId?: string; organizationId?: string }) => {
    const response = await api.get<{ success: boolean; data: Meeting[] }>('/meetings', { params })
    return response.data.data
  },
}

// Checklists API
export const checklistsApi = {
  create: async (data: { meetingId: string; templateId: string; userId: string }) => {
    const response = await api.post<{ success: boolean; data: Checklist }>('/checklists', data)
    return response.data.data
  },

  get: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Checklist }>(`/checklists/${id}`)
    return response.data.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch<{ success: boolean; data: Checklist }>(
      `/checklists/${id}`,
      data
    )
    return response.data.data
  },

  updateItem: async (checklistId: string, itemId: string, data: {
    isCompleted?: boolean
    notes?: string
    completedBy?: string
  }) => {
    const response = await api.patch<{ success: boolean; data: ChecklistItem }>(
      `/checklists/${checklistId}/items/${itemId}`,
      data
    )
    return response.data.data
  },

  analyze: async (checklistId: string, data: { transcript: string; userId: string }) => {
    const response = await api.post<{
      success: boolean
      data: { checklist: Checklist; analysis: any; creditsRemaining: number | null }
    }>(`/checklists/${checklistId}/analyze`, data)
    return response.data.data
  },
}

export default api
