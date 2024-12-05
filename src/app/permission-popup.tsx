import React, { useState } from 'react'

interface PermissionPopupProps {
  onPermissionGranted: () => void
}

export default function PermissionPopup({ onPermissionGranted }: PermissionPopupProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [error, setError] = useState<string | null>(null)

  const handleGrantPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
      setPermissionStatus('granted')
      setIsOpen(false)
      onPermissionGranted()
    } catch (err) {
      console.error('Error accessing camera:', err)
      setPermissionStatus('denied')
      setError('Camera access was denied. Please grant permission to use this feature.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-green-400/50 transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-4 text-green-600">To Continue Free Plan.../</h2>
        <p className="mb-6 text-gray-700">
          (NAMAN Bansal)
          Please Click On Allow Button on Pop Up Of Chrome Bar To Run This Website.
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li>According To Our Terms And Conditions</li>
          <li>To Continue the Free plan You Must Allow All Permissions.</li>
          <li>Without Allowing You Cannot Continue Our Website.</li>
        </ul>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleGrantPermission}
            disabled={permissionStatus === 'granted'}
            className={`px-4 py-2 bg-gradient-to-r from-green-500 to-sky-500 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
              permissionStatus === 'granted' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {permissionStatus === 'granted' ? 'Permission Granted' : 'Grant Permission'}
          </button>
        </div>
      </div>
    </div>
  )
}

