import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Share as ShareIcon,
  FileCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Twitter as TwitterIcon,
  Telegram as TelegramIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import AppBar from '~/components/AppBar/AppBar'
import { voucherAPI } from '~/apis'

function MyVouchers() {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [proofDialogOpen, setProofDialogOpen] = useState(false)
  const [proofFile, setProofFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    try {
      setLoading(true)
      const response = await voucherAPI.getUserVouchers()
      if (response?.data) {
        setVouchers(response.data)
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      toast.error('Failed to load vouchers')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'used':
        return 'info'
      case 'expired':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: '✅ Active',
      pending: '⏳ Pending',
      used: '✔️ Used',
      expired: '❌ Expired'
    }
    return labels[status] || status
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Voucher code copied!')
  }

  const generateShareLink = (voucherId) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/vouchers/${voucherId}`
  }

  const shareToSocialMedia = async (platform) => {
    if (!selectedVoucher) return

    try {
      const shareLink = generateShareLink(selectedVoucher._id)
      const shareMessage = `🎉 I got a ${selectedVoucher.percent}% discount voucher! Check it out: ${shareLink}`

      let url = ''
      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareMessage)}`,
        copy_link: null
      }

      if (platform === 'copy_link') {
        navigator.clipboard.writeText(shareLink)
        toast.success('Link copied to clipboard!')
      } else {
        url = urls[platform]
        if (url) {
          window.open(url, '_blank', 'width=600,height=400')
        }
      }

      // Record sharing in backend
      await voucherAPI.shareVoucher(selectedVoucher._id, {
        platform,
        link: shareLink
      })

      toast.success(`Shared to ${platform}!`)
      setShareDialogOpen(false)
    } catch (error) {
      console.error('Error sharing voucher:', error)
      toast.error('Failed to share voucher')
    }
  }

  const handleProofFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setProofFile(file)
    }
  }

  const submitProof = async () => {
    if (!selectedVoucher || !proofFile) {
      toast.error('Please select a proof image')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('proof', proofFile)

      await voucherAPI.submitVoucherProof(selectedVoucher._id, formData)

      toast.success('Proof submitted! Admin will review soon.')
      setProofDialogOpen(false)
      setProofFile(null)
      fetchVouchers()
    } catch (error) {
      console.error('Error submitting proof:', error)
      toast.error(error.response?.data?.message || 'Failed to submit proof')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#F8FCFD', minHeight: '100vh', pb: 4 }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#222', mb: 3 }}>
          🎁 My Vouchers
        </Typography>

        {vouchers.length === 0 ? (
          <Alert severity="info">
            You don't have any vouchers yet. Level up to earn vouchers! 🚀
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {vouchers.map((voucher) => (
              <Grid item xs={12} sm={6} md={4} key={voucher._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(50, 119, 142, 0.1)',
                    border: '2px solid #FFB366',
                    borderRadius: 2,
                    transition: 'transform 0.2s, boxShadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(50, 119, 142, 0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    {/* Header with discount */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#FF8C3C',
                          mb: 1
                        }}
                      >
                        {voucher.percent}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Discount
                      </Typography>
                    </Box>

                    {/* Voucher code */}
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: '#F8FCFD',
                        border: '2px dashed #FFB366',
                        borderRadius: 1.5,
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#222',
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          mb: 0.5
                        }}
                      >
                        {voucher.voucherCode}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<CopyIcon />}
                        onClick={() => copyToClipboard(voucher.voucherCode)}
                        sx={{
                          color: '#FF8C3C',
                          fontSize: '0.7rem',
                          textTransform: 'none'
                        }}
                      >
                        Copy Code
                      </Button>
                    </Box>

                    {/* Status and expiry */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={getStatusLabel(voucher.status)}
                        color={getStatusColor(voucher.status)}
                        size="small"
                        sx={{ width: 'fit-content' }}
                      />
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
                      </Typography>
                    </Stack>

                    {/* Level earned */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        backgroundColor: '#E8F3F8',
                        p: 1,
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      🎖️ Earned at Level {voucher.levelReward}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pt: 0 }}>
                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      {voucher.status === 'active' && (
                        <>
                          <Button
                            size="small"
                            startIcon={<ShareIcon />}
                            onClick={() => {
                              setSelectedVoucher(voucher)
                              setShareDialogOpen(true)
                            }}
                            sx={{
                              flex: 1,
                              backgroundColor: '#FF8C3C',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': { backgroundColor: '#E67A2B' }
                            }}
                          >
                            Share
                          </Button>
                          <Button
                            size="small"
                            startIcon={<PhotoLibraryIcon />}
                            onClick={() => {
                              setSelectedVoucher(voucher)
                              setProofDialogOpen(true)
                            }}
                            sx={{
                              flex: 1,
                              backgroundColor: '#32778E',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': { backgroundColor: '#1f4a56' }
                            }}
                          >
                            Use
                          </Button>
                        </>
                      )}
                      {voucher.status === 'pending' && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#FF8C3C',
                            fontWeight: 600,
                            textAlign: 'center',
                            width: '100%'
                          }}
                        >
                          ⏳ Awaiting Admin Review
                        </Typography>
                      )}
                      {voucher.status === 'used' && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#32778E',
                            fontWeight: 600,
                            textAlign: 'center',
                            width: '100%'
                          }}
                        >
                          ✅ Redeemed
                        </Typography>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Share Voucher</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            Share your voucher code with friends on social media
          </Typography>
          <Stack spacing={2}>
            <Button
              fullWidth
              startIcon={<FacebookIcon />}
              onClick={() => shareToSocialMedia('facebook')}
              variant="contained"
              sx={{ backgroundColor: '#1877F2' }}
            >
              Share to Facebook
            </Button>
            <Button
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => shareToSocialMedia('whatsapp')}
              variant="contained"
              sx={{ backgroundColor: '#25D366' }}
            >
              Share to WhatsApp
            </Button>
            <Button
              fullWidth
              startIcon={<TwitterIcon />}
              onClick={() => shareToSocialMedia('twitter')}
              variant="contained"
              sx={{ backgroundColor: '#1DA1F2' }}
            >
              Share to Twitter
            </Button>
            <Button
              fullWidth
              startIcon={<TelegramIcon />}
              onClick={() => shareToSocialMedia('telegram')}
              variant="contained"
              sx={{ backgroundColor: '#0088cc' }}
            >
              Share to Telegram
            </Button>
            <Button
              fullWidth
              startIcon={<CopyIcon />}
              onClick={() => shareToSocialMedia('copy_link')}
              variant="outlined"
            >
              Copy Share Link
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Proof Upload Dialog */}
      <Dialog
        open={proofDialogOpen}
        onClose={() => setProofDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Voucher Usage Proof</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Upload a screenshot showing you've used the voucher code.
            This helps us verify your usage and process rewards quickly.
          </Typography>
          <Box
            sx={{
              border: '2px dashed #FFB366',
              borderRadius: 1.5,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#F8FCFD',
              mb: 2
            }}
            component="label"
          >
            {proofFile ? (
              <>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#32778E' }}>
                  ✅ {proofFile.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Click to change
                </Typography>
              </>
            ) : (
              <>
                <PhotoLibraryIcon sx={{ fontSize: 40, color: '#FFB366', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#222' }}>
                  Click to upload proof image
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  PNG, JPG up to 5MB
                </Typography>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProofFileSelect}
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#666' }}>
            📸 Pro tip: Include voucher code, discount percentage, and order details in your screenshot
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setProofDialogOpen(false)
            setProofFile(null)
          }}>
            Cancel
          </Button>
          <Button
            onClick={submitProof}
            variant="contained"
            disabled={!proofFile || submitting}
            sx={{
              backgroundColor: '#FF8C3C',
              '&:hover': { backgroundColor: '#E67A2B' }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Proof'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyVouchers
