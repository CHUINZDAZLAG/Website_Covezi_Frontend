import { useState } from 'react'
import { Box, Button, ArrowBack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import TreeCustomization from './TreeCustomization'
import { useUserGarden } from '~/customHooks/useUserGarden'

const TreeCustomizePage = () => {
  const navigate = useNavigate()
  const { garden, loading, refetch } = useUserGarden()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    refetch()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <AppBar />
      <Box sx={{ py: 2, px: 2 }}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header with Back Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/garden')}
              sx={{
                textTransform: 'none',
                color: '#4CAF50',
                fontWeight: 'bold',
              }}
            >
              Quay lại
            </Button>
          </Box>

          {/* Save Success Message */}
          {saved && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                background: '#C8E6C9',
                borderRadius: '8px',
                color: '#2D5016',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              ✓ Đã lưu trang trí cây thành công!
            </Box>
          )}

          {/* Tree Customization Component */}
          {!loading && garden && (
            <TreeCustomization
              garden={garden}
              onSave={handleSave}
              isLoading={loading}
            />
          )}
        </Box>
      </Box>
    </>
  )
}

export default TreeCustomizePage
