"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface QrButtonProps {
    onScan: (result: string) => void
}

export function QrButton({ onScan }: QrButtonProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerId = "qr-reader"

    useEffect(() => {
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch((error) => {
                    console.error("Error stopping scanner:", error)
                })
            }
        }
    }, [])

    const startScanner = async () => {
        console.log("Start Scanner clicked") // เพิ่ม log เพื่อตรวจสอบ
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
                    handleScanSuccess(decodedText)
                },
                (errorMessage) => {
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
        await stopScanner()
        onScan(decodedText)
    }

    if (isScanning) {
        return (
            <Card className="w-full max-w-sm">
                <CardContent className="pt-4">
                    <div className="flex justify-end mb-2">
                        <Button variant="outline" size="icon" onClick={stopScanner} aria-label="Close scanner">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div id={scannerContainerId} className="w-full aspect-square bg-muted rounded-md overflow-hidden" />
                    {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>
        )
    }

    return (
        <Button onClick={startScanner} size="icon" aria-label="Scan QR Code" className="rounded-full">
            {/* SVG Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
            >
                <path d="M3 11h8V3H3zm2-6h4v4H5zM3 21h8v-8H3zm2-6h4v4H5zm8-12v8h8V3zm6 6h-4V5h4zm-5.99 4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 0h2v2h-2zm2-6h2v2h-2zm2 2h2v2h-2z" />
            </svg>
        </Button>
    )
}