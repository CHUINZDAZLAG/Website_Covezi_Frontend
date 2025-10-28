import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  Alert
} from '@mui/material'
import GiftIcon from '@mui/icons-material/CardGiftcard'
import FileCopyIcon from '@mui/icons-material/FileCopy'

const VoucherNotification = ({
  open = false,
  voucher = null,
  onClose = () => {}
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleCopy = () => {
    if (voucher?.code) {
      navigator.clipboard.writeText(voucher.code)
      setCopied(true)
    }
  }

  if (!voucher) return null

  const getVoucherColor = () => {
    if (voucher.discount >= 100) return '#FFD700'  // Gold
    if (voucher.discount >= 70) return '#FF6B6B'   // Red
    if (voucher.discount >= 50) return '#4ECDC4'   // Teal
    if (voucher.discount >= 30) return '#5DADE2'   // Blue
    return '#95E1D3'                               // Light green
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <GiftIcon sx={{ fontSize: '2.5rem' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Chúc mừng! 🎉
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        {/* Level Achievement */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            Bạn đã đạt Level {voucher.levelEarned}!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Bạn mở khóa một voucher mới
          </Typography>
        </Box>

        {/* Voucher Details */}
        <Paper
          sx={{
            p: 2.5,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${getVoucherColor()} 0%, ${getVoucherColor()}dd 100%)`,
            color: '#1a1a1a',
            my: 2,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: '80px',
              opacity: 0.1
            }}
          >
            🎁
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
              DISCOUNT
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {voucher.discount}%
            </Typography>
            {voucher.discount === 100 && (
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                Mặt hàng miễn phí!
              </Typography>
            )}
            <Typography variant="caption" sx={{ display: 'block' }}>
              Hiệu lực đến: {new Date(voucher.expiresAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        </Paper>

        {/* Voucher Code */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>
            Mã voucher
          </Typography>
          <Paper
            sx={{
              p: 1.5,
              background: 'rgba(255,255,255,0.1)',
              border: '1px dashed rgba(255,255,255,0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                wordBreak: 'break-all',
                flex: 1
              }}
            >
              {voucher.code}
            </Typography>
            <Button
              size="small"
              onClick={handleCopy}
              sx={{
                color: 'white',
                minWidth: 'auto',
                p: 0.5,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
              title="Copy mã"
            >
              <FileCopyIcon sx={{ fontSize: '1rem' }} />
            </Button>
          </Paper>
          {copied && (
            <Alert severity="success" sx={{ mt: 1, fontSize: '0.85rem' }}>
              Mã đã sao chép! 📋
            </Alert>
          )}
        </Box>

        {/* Milestone Info */}
        <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
          Tiếp tục chơi và hoàn thành thách thức để lên level tiếp theo!
        </Alert>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'rgba(255,255,255,0.9)',
            color: '#667eea',
            fontWeight: 'bold',
            px: 3,
            '&:hover': {
              background: 'white'
            }
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VoucherNotification
