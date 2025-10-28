import { useState, useEffect } from 'react'
import { gamificationAPI } from '~/apis/index'

export const useUserGarden = () => {
  const [garden, setGarden] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGarden = async () => {
    try {
      setLoading(true)
      const response = await gamificationAPI.getUserGarden()
      setGarden(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching garden:', err)
      setError(err.message || 'Failed to load garden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGarden()
  }, [])

  const refetch = () => {
    fetchGarden()
  }

  return { garden, loading, error, refetch }
}
