// components/native-qr-scanner.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import jsQR from "jsqr"

interface QrScannerProps {
  onResult: (result: string) => void
}

export function NativeQrScanner({ onResult }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  const startScanner = async () => {
    setError(null)
    setIsScanning(true)

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      streamRef.current = stream

      // Set video source to camera stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning frames once video is playing
        videoRef.current.onloadedmetadata = () => {
          scanQRCode()
        }
      }
    } catch (err) {
      setError("Camera access denied or not available")
      setIsScanning(false)
      console.error("Error accessing camera:", err)
    }
  }

  const stopScanner = () => {
    // Stop animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for QR code processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Process image data with jsQR
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    })

    if (code) {
      // QR code detected
      stopScanner()
      onResult(code.data)
    } else {
      // Continue scanning
      animationRef.current = requestAnimationFrame(scanQRCode)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {!isScanning ? (
        <Button onClick={startScanner} size="icon" aria-label="Scan QR Code">
          {/* SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 11h8V3H3zm2-6h4v4H5zM3 21h8v-8H3zm2-6h4v4H5zm8-12v8h8V3zm6 6h-4V5h4zm-5.99 4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 0h2v2h-2zm2-6h2v2h-2zm2 2h2v2h-2z" />
          </svg>
        </Button>
      ) : (
        <div className="w-full max-w-sm">
          <div className="flex justify-end mb-2">
            <Button variant="outline" size="icon" onClick={stopScanner} aria-label="Close scanner">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
            <canvas
              ref={canvasRef}
              className="hidden" // Hidden canvas for processing
            />
          </div>
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}