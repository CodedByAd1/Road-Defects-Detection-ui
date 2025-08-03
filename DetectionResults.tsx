import { useState } from 'react'
import { 
  AlertCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { DetectionResult, Detection } from '../types'

interface DetectionResultsProps {
  results: DetectionResult | null
  isLoading: boolean
  error: string | null
}

const DetectionResults = ({ results, isLoading, error }: DetectionResultsProps) => {
  const [selectedView, setSelectedView] = useState<'processed' | 'original'>('processed')

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing image...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-danger-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="text-gray-700">{error}</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h2>
          <p className="text-gray-600">Upload and analyze an image to see detection results</p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-danger-500'
      case 'medium': return 'bg-warning-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pothole': return 'bg-danger-500'
      case 'crack': return 'bg-warning-500'
      default: return 'bg-gray-500'
    }
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = results.processedImage
    link.download = 'road-defect-detection-result.png'
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Detection Results</h2>
          <div className="flex space-x-2">
            <button
              onClick={downloadImage}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download result"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share results"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Detections</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{results.detections.length}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Processing Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{results.processingTime}ms</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Model Confidence</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${results.modelConfidence * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {(results.modelConfidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Image Display */}
      <div className="card">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSelectedView('processed')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'processed'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Processed Image
          </button>
          <button
            onClick={() => setSelectedView('original')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'original'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Original Image
          </button>
        </div>

        <div className="relative">
          <img
            src={selectedView === 'processed' ? results.processedImage : results.originalImage}
            alt={selectedView === 'processed' ? 'Processed image with detections' : 'Original image'}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Detection Details */}
      {results.detections.length > 0 && (
        <div className="card">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Detection Details</h3>
          <div className="space-y-3">
            {results.detections.map((detection: Detection) => (
              <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(detection.type)}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{detection.type}</p>
                    <p className="text-sm text-gray-600">
                      Confidence: {(detection.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(detection.severity)}`}>
                    {detection.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DetectionResults 