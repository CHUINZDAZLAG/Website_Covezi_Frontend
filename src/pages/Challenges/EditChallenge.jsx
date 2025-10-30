import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack,
  CloudUpload,
  Close as CloseIcon,
  Image as ImageIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { challengeAPI } from '~/apis'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'

function EditChallenge() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.currentUser)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'eco-action',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenge()
  }, [id])

  const fetchChallenge = async () => {
    try {
      setLoading(true)
      const response = await challengeAPI.getChallengeDetail(id)
      if (response?.data) {
        const challenge = response.data
        setFormData({
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          tags: challenge.tags || []
        })
        setExistingImage(challenge.image)
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      toast.error('Failed to load challenge')
      navigate('/challenges')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter challenge title')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Please enter challenge description')
      return
    }

    if (formData.title.length < 5 || formData.title.length > 100) {
      toast.error('Title must be 5-100 characters')
      return
    }

    if (formData.description.length < 10 || formData.description.length > 2000) {
      toast.error('Description must be 10-2000 characters')
      return
    }

    try {
      setSubmitting(true)
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('type', formData.type)
      submitData.append('tags', formData.tags.join(','))
      
      if (selectedFile) {
        submitData.append('image', selectedFile)
      }

      const response = await challengeAPI.updateChallenge(id, submitData)
      
      if (response?.data) {
        toast.success('Challenge updated successfully!')
        navigate(`/challenges/${id}`)
      }
    } catch (error) {
      console.error('Error updating challenge:', error)
      toast.error(error.response?.data?.message || 'Failed to update challenge')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please login to edit challenges
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    )
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
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/challenges/${id}`)}
          sx={{ mb: 3, color: '#32778E', fontWeight: 600 }}
        >
          Back to Challenge
        </Button>

        {/* Main Post Card - Facebook Style */}
        <Card
          sx={{
            boxShadow: '0 2px 8px rgba(50, 119, 142, 0.1)',
            borderRadius: 2,
            border: '1px solid #E8F3F8',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{ backgroundColor: '#FFFFFF', p: 2.5, borderBottom: '1px solid #E8F3F8' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 48, height: 48, backgroundColor: '#FF8C3C' }}
              >
                {user?.displayName?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                  {user?.displayName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Edit your challenge
                </Typography>
              </Box>
              <Chip
                label="✏️ Edit"
                sx={{
                  backgroundColor: '#E8F3F8',
                  color: '#32778E',
                  fontWeight: 600
                }}
              />
            </Stack>
          </Box>

          {/* Form Content */}
          <CardContent sx={{ backgroundColor: '#FFFFFF', p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {/* Title Input */}
                <TextField
                  fullWidth
                  required
                  placeholder="Challenge Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8FCFD',
                      border: '1px solid #E8F3F8',
                      borderRadius: 1.5,
                      '& fieldset': {
                        borderColor: '#E8F3F8'
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF8C3C'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#32778E'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#999',
                      opacity: 1
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#999', ml: 1 }}>
                  {formData.title.length}/100 characters
                </Typography>

                {/* Description Input */}
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={5}
                  placeholder="Describe your challenge in detail... What should participants do? What's the goal?"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 2000 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#F8FCFD',
                      border: '1px solid #E8F3F8',
                      borderRadius: 1.5,
                      '& fieldset': {
                        borderColor: '#E8F3F8'
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF8C3C'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#32778E'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: '#999',
                      opacity: 1
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#999', ml: 1 }}>
                  {formData.description.length}/2000 characters
                </Typography>

                <Divider sx={{ borderColor: '#E8F3F8', my: 1 }} />

                {/* Challenge Type */}
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#666' }}>Challenge Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Challenge Type"
                    sx={{
                      backgroundColor: '#F8FCFD',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E8F3F8'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FF8C3C'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#32778E'
                      }
                    }}
                  >
                    <MenuItem value="eco-action">🌿 Eco Action</MenuItem>
                    <MenuItem value="reduce-waste">♻️ Reduce Waste</MenuItem>
                    <MenuItem value="save-energy">⚡ Save Energy</MenuItem>
                    <MenuItem value="plant-trees">🌳 Plant Trees</MenuItem>
                    <MenuItem value="recycle">🔄 Recycle</MenuItem>
                    <MenuItem value="other">✨ Other</MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ borderColor: '#E8F3F8', my: 1 }} />

                {/* Tags */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222', mb: 1.5 }}>
                    Tags (max 5)
                  </Typography>
                  <Stack direction="row" spacing={1} mb={1.5}>
                    <TextField
                      size="small"
                      placeholder="Add tag and press Enter or click Add"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      disabled={formData.tags.length >= 5}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#F8FCFD',
                          '& fieldset': {
                            borderColor: '#E8F3F8'
                          },
                          '&:hover fieldset': {
                            borderColor: '#FF8C3C'
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || formData.tags.length >= 5}
                      sx={{
                        backgroundColor: '#FF8C3C',
                        '&:hover': { backgroundColor: '#E67A2B' }
                      }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {formData.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{
                          backgroundColor: '#E8F3F8',
                          color: '#32778E',
                          fontWeight: 600,
                          '& .MuiChip-deleteIcon': {
                            color: '#FF8C3C',
                            '&:hover': { color: '#E67A2B' }
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: '#E8F3F8', my: 1 }} />

                {/* Image Upload - Facebook Style */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222', mb: 1.5 }}>
                    Challenge Cover Image
                  </Typography>

                  {previewUrl ? (
                    <Paper
                      sx={{
                        position: 'relative',
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        border: '2px solid #FF8C3C'
                      }}
                    >
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#FFFFFF',
                          '&:hover': { backgroundColor: '#F8FCFD' }
                        }}
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                      >
                        <CloseIcon sx={{ color: '#FF8C3C' }} />
                      </IconButton>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: '100%',
                          maxHeight: 350,
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </Paper>
                  ) : existingImage ? (
                    <Paper
                      sx={{
                        position: 'relative',
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        border: '2px solid #E8F3F8'
                      }}
                    >
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: '#FFFFFF',
                          '&:hover': { backgroundColor: '#F8FCFD' }
                        }}
                        onClick={() => {
                          setExistingImage(null)
                          setSelectedFile(null)
                        }}
                      >
                        <CloseIcon sx={{ color: '#FF8C3C' }} />
                      </IconButton>
                      <img
                        src={existingImage}
                        alt="Current"
                        style={{
                          width: '100%',
                          maxHeight: 350,
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </Paper>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        py: 4,
                        borderColor: '#E8F3F8',
                        color: '#32778E',
                        fontWeight: 600,
                        backgroundColor: '#F8FCFD',
                        border: '2px dashed #FF8C3C',
                        '&:hover': {
                          backgroundColor: '#E8F3F8',
                          borderColor: '#FF8C3C'
                        }
                      }}
                    >
                      Click to upload new image
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileSelect}
                  />
                </Box>

                <Divider sx={{ borderColor: '#E8F3F8', my: 1 }} />

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/challenges/${id}`)}
                    sx={{
                      borderColor: '#32778E',
                      color: '#32778E',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#F8FCFD',
                        borderColor: '#32778E'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    sx={{
                      backgroundColor: '#FF8C3C',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#E67A2B'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#CCC'
                      }
                    }}
                  >
                    {submitting ? 'Updating...' : '✏️ Update Challenge'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default EditChallenge
