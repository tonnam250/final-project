"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Scan, X } from "lucide-react"

interface QrCodeScannerProps {
  onResult: (result: string) => void
  buttonText?: string
}

export function QrCodeScanner({ onResult, buttonText = "Scan QR Code" }: QrCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerId = "qr-reader"

  useEffect(() => {
    // Clean up scanner when component unmounts
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((error) => {
          console.error("Error stopping scanner:", error)
        })
      }
    }
  }, [])

  const startScanner = async () => {
    setError(null)
    setIsScanning(true)

    try {
      scannerRef.current = new Html5Qrcode(scannerContainerId)

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan
          handleScanSuccess(decodedText)
        },
        (errorMessage) => {
          // QR code scanning errors are handled silently
          console.log(errorMessage)
        },
      )
    } catch (err) {
      setError("Camera access denied or not available")
      setIsScanning(false)
      console.error("Error starting scanner:", err)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop()
      setIsScanning(false)
    }
  }

  const handleScanSuccess = async (decodedText: string) => {
    // Stop scanning after successful scan
    await stopScanner()
    // Pass result to parent component
    onResult(decodedText)
  }

  return (
    <div className="flex flex-col items-center">
      {!isScanning ? (
        <Button onClick={startScanner} className="flex items-center gap-2">
          <Scan className="h-4 w-4" />
          {buttonText}
        </Button>
      ) : (
        <div className="w-full max-w-sm">
          <div className="flex justify-end mb-2">
            <Button variant="outline" size="icon" onClick={stopScanner} aria-label="Close scanner">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div id={scannerContainerId} className="w-full aspect-square bg-muted rounded-md overflow-hidden" />
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}