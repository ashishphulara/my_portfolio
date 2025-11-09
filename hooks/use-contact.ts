"use client"

import { useState } from "react"
import { apiClient, type ContactMessage } from "@/lib/api"

export function useContact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitContact = async (data: ContactMessage) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const response = await apiClient.submitContact(data)

    if (response.error) {
      setError(response.error)
    } else {
      setSuccess(true)
    }

    setLoading(false)
    return response
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return { submitContact, loading, success, error, reset }
}
