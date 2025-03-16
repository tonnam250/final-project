"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QrButton() {
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState<string | null>(null)
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

    useEffect(() => {
        if (isScanning) {
            startScanner()
        }
    }, [isScanning])

    const startScanner = async () => {
        console.log("Start Scanner clicked") // เพิ่ม log เพื่อตรวจสอบ
        setError(null)
        setScanResult(null)

        try {
            scannerRef.current = new Html5Qrcode(scannerContainerId)

            await scannerRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }, // ตั้งค่าให้เป็นสี่เหลี่ยมจตุรัส
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
        setScanResult(decodedText)

        // Log the result (this will happen on the client side)
        console.log("Scanned data:", decodedText)
    }

    // If not scanning and no result, show the scan button
    if (!isScanning && !scanResult) {
        return (
            <button
                onClick={() => setIsScanning(true)}
                className="bg-blue-500 flex rounded-full w-12 h-12 text-center justify-center items-center text-white hover:bg-blue-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M9 3H3v6h2V5h4zM3 21v-6h2v4h4v2zM15 3v2h4v4h2V3zm4 12h2v6h-6v-2h4zM7 7h4v4H7zm0 6h4v4H7zm10-6h-4v4h4zm-4 6h4v4h-4z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        )
    }

    // If scanning, show the scanner
    if (isScanning) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-sm m-4">
                    <CardContent className="pt-4">
                        <div className="flex justify-end mb-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={stopScanner}
                                aria-label="Close scanner"
                                className="hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* ปรับขนาดช่องสแกนให้เป็นสี่เหลี่ยมจตุรัส */}
                        <div
                            id={scannerContainerId}
                            className="w-full aspect-square bg-muted rounded-md overflow-hidden"
                            style={{ width: "250px", height: "250px" }} // ตั้งค่าขนาดให้เป็นสี่เหลี่ยมจตุรัส
                        />
                        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // If there's a result, show it with an option to scan again
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-sm m-4">
                <CardContent className="pt-4">
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setScanResult(null)}
                            aria-label="Close result"
                            className="hover:bg-gray-500 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Scan Result:</h3>
                        <div className="p-3 bg-muted rounded-md break-all">{scanResult}</div>
                    </div>
                    <Button
                        onClick={() => setIsScanning(true)}
                        className="w-full hover:bg-green-500 hover:text-white transition-colors"
                    >
                        Scan Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}