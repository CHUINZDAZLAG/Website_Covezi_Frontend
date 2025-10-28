import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Paper
} from '@mui/material'
import {
  ArrowBack,
  CloudUpload,
  Close as CloseIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { challengeAPI } from '~/apis'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'

function CreateChallenge() {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.currentUser)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'eco-action',
    durationDays: 7,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

    console.log('User:', user)
    console.log('FormData:', formData)

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
      submitData.append('durationDays', formData.durationDays)
      submitData.append('tags', formData.tags.join(','))
      
      if (selectedFile) {
        submitData.append('image', selectedFile)
      }

      const response = await challengeAPI.createChallenge(submitData)
      
      if (response?.data) {
        toast.success('Challenge created successfully!')
        navigate(`/challenges/${response.data._id}`)
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      toast.error(error.response?.data?.message || 'Failed to create challenge')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please login to create challenges
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Container>
    )
  }

  return (
    <Box>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/challenges')}
          sx={{ mb: 2 }}
        >
          Back to Challenges
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          🌱 Create New Challenge
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Create a green challenge to inspire others to take eco-friendly actions!
        </Typography>

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Title */}
              <TextField
                fullWidth
                required
                label="Challenge Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Zero Waste Week Challenge"
                helperText={`${formData.title.length}/100 characters`}
                inputProps={{ maxLength: 100 }}
              />

              {/* Description */}
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your challenge in detail... What should participants do? What's the goal?"
                helperText={`${formData.description.length}/2000 characters`}
                inputProps={{ maxLength: 2000 }}
              />

              {/* Type */}
              <FormControl fullWidth>
                <InputLabel>Challenge Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Challenge Type"
                >
                  <MenuItem value="eco-action">Eco Action</MenuItem>
                  <MenuItem value="reduce-waste">Reduce Waste</MenuItem>
                  <MenuItem value="save-energy">Save Energy</MenuItem>
                  <MenuItem value="plant-trees">Plant Trees</MenuItem>
                  <MenuItem value="recycle">Recycle</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              {/* Duration */}
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  label="Duration"
                >
                  <MenuItem value={3}>3 days</MenuItem>
                  <MenuItem value={5}>5 days</MenuItem>
                  <MenuItem value={7}>7 days (1 week)</MenuItem>
                  <MenuItem value={14}>14 days (2 weeks)</MenuItem>
                  <MenuItem value={21}>21 days (3 weeks)</MenuItem>
                  <MenuItem value={30}>30 days (1 month)</MenuItem>
                </Select>
              </FormControl>

              {/* Tags */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tags (max 5)
                </Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField
                    size="small"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    disabled={formData.tags.length >= 5}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || formData.tags.length >= 5}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {formData.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Image Upload */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Challenge Cover Image (Optional)
                </Typography>
                
                {previewUrl ? (
                  <Paper sx={{ p: 2, position: 'relative' }}>
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                    />
                  </Paper>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ py: 6 }}
                  >
                    Upload Challenge Image
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

              {/* Info Box */}
              <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                <Box component="div">
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    💡 <strong>Tips:</strong>
                  </Typography>
                  <Box component="ul" sx={{ mt: 0, mb: 0, pl: 2.5 }}>
                    <li>Make your challenge specific and achievable</li>
                    <li>Add clear instructions in the description</li>
                    <li>Choose an eye-catching cover image</li>
                    <li>Use relevant tags to help people find your challenge</li>
                  </Box>
                </Box>
              </Paper>

              {/* Submit Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/challenges')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Challenge'}
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

export default CreateChallenge
