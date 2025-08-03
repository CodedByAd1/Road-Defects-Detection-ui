# Road Defect Detection Web Application

A modern web application for detecting road defects like potholes and cracks using Edge YOLO model. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🖼️ **Image Upload**: Drag-and-drop or browse to upload road images
- 🔍 **AI Detection**: Powered by Edge YOLO model for accurate defect detection
- 📊 **Visual Results**: Display detection results with bounding boxes and confidence scores
- 📈 **Statistics**: Processing time, detection count, and model confidence metrics
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- 📱 **Mobile Friendly**: Optimized for all device sizes
- ⚡ **Fast**: Built with Vite for rapid development and fast builds

## Supported Defect Types

- 🚨 **Potholes**: Deep holes in the road surface
- 🔶 **Cracks**: Various types of road surface cracks
- ⚠️ **Other Defects**: Additional road surface issues

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Your Edge YOLO model backend running on `http://localhost:8000`

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd road-defect-detection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Backend API Requirements

The web application expects your Edge YOLO model backend to be running on `http://localhost:8000` with the following endpoints:

### POST /detect
Upload an image for defect detection.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
```json
{
  "success": true,
  "data": {
    "originalImage": "data:image/jpeg;base64,...",
    "processedImage": "data:image/jpeg;base64,...",
    "detections": [
      {
        "id": "detection_1",
        "type": "pothole",
        "confidence": 0.95,
        "bbox": {
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 100
        },
        "severity": "high"
      }
    ],
    "processingTime": 1250,
    "modelConfidence": 0.92
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### GET /model-info
Get model information.

**Response:**
```json
{
  "model_name": "edge-yolo-road-defects",
  "version": "1.0.0",
  "classes": ["pothole", "crack", "other"]
}
```

## Configuration

### Vite Proxy Configuration

The application is configured to proxy API requests to your backend. You can modify the proxy settings in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000', // Change this to your backend URL
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_MAX_FILE_SIZE=10485760
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── ImageUpload.tsx # Image upload component
│   └── DetectionResults.tsx # Results display
├── services/           # API services
│   └── api.ts         # API client
├── types/             # TypeScript types
│   └── types.ts       # Type definitions
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and custom components

### Components
Each component is modular and can be easily customized:
- `ImageUpload.tsx` - Modify upload behavior and validation
- `DetectionResults.tsx` - Customize results display
- `Header.tsx` - Update branding and navigation

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Static Hosting
You can deploy the built application to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Docker Deployment
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from `http://localhost:3000`
2. **Model Not Responding**: Check if your Edge YOLO backend is running on port 8000
3. **Large File Uploads**: The app limits file size to 10MB by default
4. **Image Format Issues**: Only JPG, PNG, and WEBP formats are supported

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
VITE_DEBUG=true npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for road safety and infrastructure maintenance. 