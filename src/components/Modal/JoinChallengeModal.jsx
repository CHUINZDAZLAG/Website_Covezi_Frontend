import { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material'
import {
  Delete,
  Image as ImageIcon,
  Close
} from '@mui/icons-material'
import { toast } from 'react-toastify'

function JoinChallengeModal({ open, onClose, onSubmit, submitting }) {
  const [proofText, setProofText] = useState('')
  const [proofImage, setProofImage] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      
      setProofImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const isValidVideoUrl = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const tiktokRegex = /(?:tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com\/)/
    const facebookRegex = /(?:facebook\.com\/.*\/videos\/|fb\.watch\/)/
    
    return youtubeRegex.test(url) || tiktokRegex.test(url) || facebookRegex.test(url)
  }

  const handleSubmit = () => {
    if (!proofText.trim() && !proofImage && !videoUrl.trim()) {
      toast.warning('Please add text, image, or video URL as proof')
      return
    }

    if (videoUrl.trim() && !isValidVideoUrl(videoUrl)) {
      toast.error('Please enter a valid YouTube, TikTok, or Facebook video URL')
      return
    }

    const formData = new FormData()
    formData.append('content', proofText)
    
    if (proofImage) {
      formData.append('media', proofImage)
    } else if (videoUrl.trim()) {
      formData.append('videoUrl', videoUrl)
    }

    onSubmit(formData)
  }

  const handleClose = () => {
    setProofText('')
    setProofImage(null)
    setVideoUrl('')
    setPreviewUrl(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Join Challenge (+30 points)</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Share your experience completing this challenge..."
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          placeholder="Or paste video URL (YouTube, TikTok, Facebook)..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          sx={{ mb: 2 }}
          helperText="Supported: YouTube, TikTok, Facebook video links"
        />

        {previewUrl && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ 
                width: '100%', 
                maxHeight: 300, 
                objectFit: 'contain', 
                borderRadius: 8 
              }} 
            />
            <IconButton
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                bgcolor: 'background.paper' 
              }}
              onClick={() => {
                setProofImage(null)
                setPreviewUrl(null)
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        )}

        <Button
          variant="outlined"
          startIcon={<ImageIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Add Photo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || (!proofText.trim() && !proofImage && !videoUrl.trim())}
        >
          {submitting ? <CircularProgress size={20} /> : 'Submit Proof'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default JoinChallengeModal