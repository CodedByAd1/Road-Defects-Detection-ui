export interface DetectionResult {
  originalImage: string
  processedImage: string
  detections: Detection[]
  processingTime: number
  modelConfidence: number
}

export interface Detection {
  id: string
  type: 'pothole' | 'crack' | 'other'
  confidence: number
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
  severity: 'low' | 'medium' | 'high'
}

export interface UploadResponse {
  success: boolean
  data?: DetectionResult
  error?: string
} 