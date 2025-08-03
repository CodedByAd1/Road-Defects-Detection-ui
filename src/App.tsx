import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import DetectionResults from './components/DetectionResults'
import Header from './components/Header'
import { DetectionResult } from './types'

function App() {
  const [results, setResults] = useState<DetectionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDetectionComplete = (detectionResults: DetectionResult) => {
    setResults(detectionResults)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setResults(null)
  }

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div className="space-y-6">
              <ImageUpload 
                onDetectionComplete={handleDetectionComplete}
                onError={handleError}
                onLoading={handleLoading}
              />
            </div>
            
            {/* Right Column - Results */}
            <div className="space-y-6">
              <DetectionResults 
                results={results}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 