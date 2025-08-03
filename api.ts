import axios from 'axios'
import { DetectionResult } from '../types'

// Configure axios with base URL and timeout
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds timeout for model inference
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const detectDefects = async (imageFile: File): Promise<DetectionResult> => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.error || 'Detection failed')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The model is taking too long to process the image.')
      }
      if (error.response?.status === 413) {
        throw new Error('Image file is too large. Please use an image smaller than 10MB.')
      }
      if (error.response?.status === 415) {
        throw new Error('Unsupported image format. Please use JPG, PNG, or WEBP.')
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.')
      }
      throw new Error(error.response?.data?.error || 'Failed to connect to the detection service.')
    }
    throw error
  }
}

// Health check endpoint
export const checkModelHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health')
    return response.data.status === 'healthy'
  } catch (error) {
    console.error('Model health check failed:', error)
    return false
  }
}

// Get model information
export const getModelInfo = async () => {
  try {
    const response = await api.get('/model-info')
    return response.data
  } catch (error) {
    console.error('Failed to get model info:', error)
    return null
  }
} 