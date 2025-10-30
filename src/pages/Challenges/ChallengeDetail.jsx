import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Button,
  TextField,
  Chip,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  People,
  MoreVert,
  Delete,
  Edit,
  EmojiEvents as TrendingIcon,
  Image as ImageIcon,
  ChatBubbleOutline,
  Share as ShareIcon,
  VideoCall,
  SentimentSatisfiedAlt,
  Send as SendIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { challengeAPI, gamificationAPI } from '~/apis'
import { setGarden } from '~/redux/gamification/gamificationSlice'
import { formatDistanceToNow } from 'date-fns'
import AppBar from '~/components/AppBar/AppBar'

function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.currentUser)
  const fileInputRef = useRef(null)

  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [proofText, setProofText] = useState('')
  const [proofImage, setProofImage] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleteChallengeDialogOpen, setDeleteChallengeDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchChallengeDetails()
  }, [id, sortBy])

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true)
      const response = await challengeAPI.getDetails(id, `sortBy=${sortBy}&limit=20`)
      if (response?.data) {
        setChallenge(response.data)
      }
    } catch (error) {
      console.error('Error fetching challenge details:', error)
      toast.error('Failed to load challenge')
    } finally {
      setLoading(false)
    }
  }

  const handleLikeChallenge = async () => {
    if (!user) {
      toast.warning('Please login to like')
      return
    }

    try {
      if (challenge.isLiked) {
        await challengeAPI.unlikeChallenge(id)
      } else {
        await challengeAPI.likeChallenge(id)
      }
      
      setChallenge(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
      }))
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error(error.response?.data?.message || 'Failed to like')
    }
  }

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

  const handleProofSubmit = async () => {
    if (!user) {
      toast.warning('Please login to participate')
      return
    }

    if (!proofText.trim() && !proofImage && !videoUrl.trim()) {
      toast.warning('Please add text, image, or video URL as proof')
      return
    }

    if (videoUrl.trim() && !isValidVideoUrl(videoUrl)) {
      toast.error('Please enter a valid YouTube, TikTok, or Facebook video URL')
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append('content', proofText)
      
      if (proofImage) {
        formData.append('media', proofImage)
      } else if (videoUrl.trim()) {
        formData.append('videoUrl', videoUrl)
      }

      const response = await challengeAPI.addProofComment(id, formData)
      
      if (response?.data) {
        const { pointsEarned } = response.data
        
        // Show success message with earned points
        toast.success(`Proof submitted! +${pointsEarned} XP`)
        
        setProofText('')
        setProofImage(null)
        setVideoUrl('')
        setPreviewUrl(null)
        
        // Fetch updated garden data and update Redux store
        const gardenResponse = await gamificationAPI.getUserGarden()
        if (gardenResponse?.data) {
          // Update Redux store with latest garden data
          dispatch(setGarden(gardenResponse.data))
        }
        
        fetchChallengeDetails()
      }
    } catch (error) {
      console.error('Error submitting proof:', error)
      toast.error(error.response?.data?.message || 'Failed to submit proof')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId, isLiked) => {
    if (!user) {
      toast.warning('Please login to like')
      return
    }

    try {
      if (isLiked) {
        await challengeAPI.unlikeComment(id, commentId)
      } else {
        await challengeAPI.likeComment(id, commentId)
      }
      
      setChallenge(prev => ({
        ...prev,
        comments: prev.comments.map(c => {
          if (c._id === commentId) {
            return {
              ...c,
              likes: isLiked 
                ? c.likes.filter(l => l.userId !== user._id)
                : [...c.likes, { userId: user._id, userDisplayName: user.displayName, createdAt: Date.now() }],
              likeCount: isLiked ? c.likeCount - 1 : c.likeCount + 1
            }
          }
          return c
        })
      }))
    } catch (error) {
      console.error('Error toggling comment like:', error)
      toast.error('Failed to like comment')
    }
  }

  const handleDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      await challengeAPI.deleteProofComment(id, commentToDelete)
      toast.success('Comment deleted')
      fetchChallengeDetails()
      setDeleteDialogOpen(false)
      setCommentToDelete(null)
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const handleDeleteChallenge = async () => {
    try {
      setDeleting(true)
      await challengeAPI.deleteChallenge(id)
      toast.success('Challenge deleted successfully')
      setDeleteChallengeDialogOpen(false)
      navigate('/challenges')
    } catch (error) {
      console.error('Error deleting challenge:', error)
      toast.error(error.response?.data?.message || 'Failed to delete challenge')
    } finally {
      setDeleting(false)
    }
  }

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'recently'
    }
  }

  const getVideoEmbedUrl = (url) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // TikTok - Extract video ID for better embed handling
    const tiktokRegex = /(?:tiktok\.com\/@[^/]+\/video\/)([0-9]+)|vm\.tiktok\.com\/([A-Za-z0-9]+)/
    const tiktokMatch = url.match(tiktokRegex)
    if (tiktokMatch) {
      const videoId = tiktokMatch[1] || tiktokMatch[2]
      if (videoId && videoId.length > 8) { // TikTok video IDs are usually longer
        return `https://www.tiktok.com/embed/v2/${videoId}`
      }
    }

    // Facebook - Extract video ID for better embed handling  
    const facebookRegex = /(?:facebook\.com\/.*\/videos\/)([0-9]+)|(?:fb\.watch\/)([A-Za-z0-9_-]+)/
    const facebookMatch = url.match(facebookRegex)
    if (facebookMatch) {
      const videoId = facebookMatch[1] || facebookMatch[2]
      if (videoId) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=500`
      }
    }

    return null
  }

  const CommentItem = ({ comment }) => {
    const isOwner = user?._id === comment.userId
    const isLiked = comment.likes.some(l => l.userId === user?._id)
    
    // Random gradient border (purple, red, or orange) - lighter versions
    const gradients = [
      'linear-gradient(135deg, #E8D5E8, #D8A5C4)', // Light purple gradient
      'linear-gradient(135deg, #FFB3BB, #FF9BA5)', // Light red gradient
      'linear-gradient(135deg, #FFD9B8, #FFC9A8)'  // Light orange gradient
    ]
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]

    return (
      <Box
        sx={{
          mb: 3,
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '3px solid',
          borderImage: `${randomGradient} 1`,
          '&:hover': { 
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease'
          }
        }}
      >
        <Box sx={{ p: 2.5 }}>
          {/* Header with Creator Info */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ flex: 1 }}>
              <Avatar 
                src={comment.userAvatar} 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '2px solid #FFB366',
                  flexShrink: 0
                }}
              >
                {comment.userDisplayName?.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="baseline" mb={0.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                    {comment.userDisplayName}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                  {formatTimeAgo(comment.createdAt)}
                </Typography>
              </Box>
            </Stack>

            {isOwner && (
              <IconButton
                size="small"
                onClick={() => {
                  setCommentToDelete(comment._id)
                  setDeleteDialogOpen(true)
                }}
                sx={{ 
                  color: '#999', 
                  ml: 1,
                  '&:hover': { color: '#FF6B7A', backgroundColor: 'rgba(255,107,122,0.1)' }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {/* Content */}
          {comment.content && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#333',
                lineHeight: 1.6,
                mb: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {comment.content}
            </Typography>
          )}

          {/* Media - Image */}
          {comment.media?.type === 'image' && (
            <Box sx={{ mb: 1.5, borderRadius: 1.5, overflow: 'hidden' }}>
              <img 
                src={comment.media.url} 
                alt="Proof" 
                style={{ 
                  width: '100%', 
                  maxHeight: 300,
                  objectFit: 'cover'
                }} 
              />
            </Box>
          )}

          {/* Media - Video */}
          {comment.media?.type === 'video_embed' && (
            <Box sx={{ mb: 1.5, borderRadius: 1.5, overflow: 'hidden' }}>
              {(() => {
                const embedUrl = getVideoEmbedUrl(comment.media.url)
                if (embedUrl) {
                  return (
                    <Box 
                      sx={{ 
                        position: 'relative', 
                        paddingBottom: '56.25%', 
                        height: 0, 
                        overflow: 'hidden'
                      }}
                    >
                      <iframe
                        src={embedUrl}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%'
                        }}
                        frameBorder="0"
                        allowFullScreen
                        title="Embedded video"
                      />
                    </Box>
                  )
                }
                return (
                  <Box sx={{ p: 2, bgcolor: '#F5F5F5', textAlign: 'center', borderRadius: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#FF8C3C', fontWeight: 600, cursor: 'pointer' }}
                      component="a" 
                      href={comment.media.url} 
                      target="_blank" 
                      rel="noopener"
                    >
                      🎥 Watch Video
                    </Typography>
                  </Box>
                )
              })()}
            </Box>
          )}

          {/* Points Badge */}
          {comment.pointsEarned > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Chip
                label={`✅ +${comment.pointsEarned} points`}
                sx={{
                  background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                  color: 'white',
                  fontWeight: 600,
                  height: 28,
                  fontSize: '0.825rem'
                }}
                size="small"
              />
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 0 }} />

        {/* Facebook-Style Engagement Footer */}
        <Stack 
          direction="row" 
          spacing={0}
          sx={{ 
            p: '12px 16px',
            backgroundColor: '#FAFBFC'
          }}
        >
          {/* Like Button */}
          <Button
            fullWidth
            size="small"
            startIcon={isLiked ? <Favorite sx={{ fontSize: 16 }} /> : <FavoriteBorder sx={{ fontSize: 16 }} />}
            onClick={() => handleLikeComment(comment._id, isLiked)}
            sx={{
              color: isLiked ? '#FF6B7A' : '#666',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              py: 0.75,
              borderRadius: 1,
              '&:hover': { 
                backgroundColor: 'rgba(255,107,122,0.08)',
                color: '#FF6B7A'
              }
            }}
          >
            {isLiked ? 'Unlike' : 'Like'}
          </Button>

          {/* Comment Button */}
          <Button
            fullWidth
            size="small"
            startIcon={<ChatBubbleOutline sx={{ fontSize: 16 }} />}
            sx={{
              color: '#666',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              py: 0.75,
              borderRadius: 1,
              '&:hover': { 
                backgroundColor: 'rgba(182,52,154,0.08)',
                color: '#B6349A'
              }
            }}
          >
            Join
          </Button>

          {/* Share Button */}
          <Button
            fullWidth
            size="small"
            startIcon={<ShareIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#666',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              py: 0.75,
              borderRadius: 1,
              '&:hover': { 
                backgroundColor: 'rgba(255,140,60,0.08)',
                color: '#FF8C3C'
              }
            }}
          >
            Share
          </Button>
        </Stack>
      </Box>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!challenge) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6">Challenge not found</Typography>
        <Button onClick={() => navigate('/challenges')}>Back to Challenges</Button>
      </Container>
    )
  }

  const isCreator = user?._id === challenge.createdBy
  const daysLeft = challenge.daysRemaining || 0

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      pb: 4,
      background: 'transparent',
      backgroundAttachment: 'fixed',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        backgroundImage: 'url("https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=300&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        zIndex: -1,
        pointerEvents: 'none'
      }
    }}>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        
        {/* Challenge Header Card with Gradient Border */}
        <Box sx={{ mb: 3 }}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '3px solid',
              borderImage: 'linear-gradient(135deg, #FFD9B8, #FFC9A8) 1',
              overflow: 'hidden'
            }}
          >
            {/* Challenge Image Inside */}
            {challenge.image && (
              <Box
                component="img"
                src={challenge.image}
                alt={challenge.title}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            )}

            <CardContent sx={{ p: 3 }}>
              {/* Creator Info */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={challenge.creatorAvatar} sx={{ width: 48, height: 48, border: '2px solid #FFB366' }}>
                    {challenge.creatorDisplayName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#222' }}>
                      {challenge.creatorDisplayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {formatTimeAgo(challenge.createdAt)}
                    </Typography>
                  </Box>
                </Stack>

                {isCreator && (
                  <IconButton 
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ color: '#999' }}
                  >
                    <MoreVert />
                  </IconButton>
                )}
              </Stack>

              {/* Title */}
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#222', 
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: '1.5rem'
                }}
              >
                {challenge.title}
              </Typography>

              {/* Badges */}
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
                {challenge.isTrending && (
                  <Chip 
                    icon={<TrendingIcon sx={{ fontSize: 16 }} />}
                    label="Trending" 
                    sx={{
                      background: 'linear-gradient(135deg, #FFB366, #FFA84D)',
                      color: 'white',
                      fontWeight: 600,
                      height: 28
                    }}
                    size="small"
                  />
                )}
                {challenge.isOfficial && (
                  <Chip 
                    label="Official" 
                    sx={{
                      background: 'linear-gradient(135deg, #B6349A, #8B2670)',
                      color: 'white',
                      fontWeight: 600,
                      height: 28
                    }}
                    size="small"
                  />
                )}
                <Chip 
                  label={daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  sx={{
                    background: daysLeft > 0 ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : '#F8FCFD',
                    color: daysLeft > 0 ? 'white' : '#999',
                    fontWeight: 600,
                    height: 28
                  }}
                  size="small"
                />
              </Stack>

              {/* Description */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#666',
                  lineHeight: 1.6,
                  mb: 2,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {challenge.description}
              </Typography>

              {/* Tags */}
              {challenge.tags?.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={2} gap={0.5}>
                  {challenge.tags.map((tag, idx) => (
                    <Chip 
                      key={idx} 
                      label={tag} 
                      sx={{
                        backgroundColor: '#FFF0E6',
                        color: '#FF8C3C',
                        fontWeight: 600,
                        height: 28
                      }}
                      size="small"
                    />
                  ))}
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Stats */}
              <Stack direction="row" spacing={3} mb={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Favorite sx={{ fontSize: 18, color: '#FF6B7A' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    {challenge.likeCount || 0}
                  </Typography>
                </Stack>
                
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <People sx={{ fontSize: 18, color: '#B6349A' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    {challenge.participantCount || 0} joined
                  </Typography>
                </Stack>
              </Stack>

              {/* Like Button */}
              <Button
                fullWidth
                variant={challenge.isLiked ? 'contained' : 'outlined'}
                startIcon={challenge.isLiked ? <Favorite /> : <FavoriteBorder />}
                onClick={handleLikeChallenge}
                sx={{
                  background: challenge.isLiked ? 'linear-gradient(135deg, #FF6B7A, #FF5566)' : 'transparent',
                  color: challenge.isLiked ? '#FFFFFF' : '#FF6B7A',
                  borderColor: '#FF6B7A',
                  borderWidth: 2,
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: 2,
                  mb: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF6B7A, #FF5566)',
                    color: '#FFFFFF',
                    borderColor: '#FF6B7A'
                  }
                }}
              >
                {challenge.isLiked ? '❤️ Liked' : '🤍 Like'}
              </Button>


            </CardContent>
          </Card>
        </Box>

        {/* Proof Submission & Comments Section - Full Width Facebook Style */}
        <Box>
          {/* Proof Submission */}
          {user && daysLeft > 0 && (
            <Card
              sx={{
                mb: 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Input Box Header */}
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                  <Avatar 
                    src={user?.avatar} 
                    sx={{ width: 36, height: 36 }}
                  >
                    {user?.displayName?.charAt(0)}
                  </Avatar>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="What's on your mind, Chau?"
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: '#F8FCFD',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: '#E0E0E0' },
                        '&.Mui-focused fieldset': { borderColor: 'transparent' }
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        opacity: 0.6,
                        color: '#999'
                      }
                    }}
                  />
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                {/* Video URL Input */}
                {videoUrl && (
                  <TextField
                    fullWidth
                    placeholder="Paste video URL..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    size="small"
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#F8FCFD',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: '#E0E0E0' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8C3C', borderWidth: 1 }
                      }
                    }}
                  />
                )}

                {/* Image Preview */}
                {previewUrl && (
                  <Box sx={{ mb: 1.5, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ width: '100%', maxHeight: 250, objectFit: 'contain' }} 
                    />
                    <IconButton
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        bgcolor: 'rgba(255,255,255,0.95)',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={() => {
                        setProofImage(null)
                        setPreviewUrl(null)
                      }}
                    >
                      <Delete sx={{ color: '#FF6B7A' }} />
                    </IconButton>
                  </Box>
                )}

                {/* Action Buttons - Facebook Style */}
                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        color: '#FF8C3C',
                        '&:hover': { backgroundColor: 'rgba(255,140,60,0.1)' }
                      }}
                      title="Add photo"
                    >
                      <ImageIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => setVideoUrl(videoUrl ? '' : 'https://')}
                      sx={{
                        color: '#FF8C3C',
                        '&:hover': { backgroundColor: 'rgba(255,140,60,0.1)' }
                      }}
                      title="Add video"
                    >
                      <VideoCall sx={{ fontSize: 20 }} />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      sx={{
                        color: '#FF8C3C',
                        '&:hover': { backgroundColor: 'rgba(255,140,60,0.1)' }
                      }}
                      title="Add emoji"
                    >
                      <SentimentSatisfiedAlt sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Stack>

                  <Box sx={{ ml: 'auto' }} />
                  
                  <Button
                    size="small"
                    onClick={handleProofSubmit}
                    disabled={submitting || (!proofText.trim() && !proofImage && !videoUrl.trim())}
                    startIcon={submitting ? undefined : <SendIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #FF8C3C, #E67A2B)',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 2.5,
                      py: 0.75,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E67A2B, #D46620)'
                      },
                      '&:disabled': {
                        background: '#F0F0F0',
                        color: '#CCC'
                      }
                    }}
                  >
                    {submitting ? '⏳' : 'Post'}
                  </Button>
                </Stack>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileSelect}
                />
              </CardContent>
            </Card>
          )}

          {/* Comments Section Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#222', 
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              💬 {challenge.comments?.length || 0} {challenge.comments?.length === 1 ? 'Proof' : 'Proofs'}
            </Typography>
            
            <Stack direction="row" spacing={1}>
              <Chip 
                label="🆕 Newest" 
                onClick={() => setSortBy('newest')}
                sx={{
                  background: sortBy === 'newest' ? 'linear-gradient(135deg, #FFB366, #FFA84D)' : '#FFFFFF',
                  color: sortBy === 'newest' ? '#FFFFFF' : '#666',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: sortBy === 'newest' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                }}
                size="small"
              />
              <Chip 
                label="🔥 Popular" 
                onClick={() => setSortBy('popular')}
                sx={{
                  background: sortBy === 'popular' ? 'linear-gradient(135deg, #D8A5C4, #C587B3)' : '#FFFFFF',
                  color: sortBy === 'popular' ? '#FFFFFF' : '#666',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: sortBy === 'popular' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                }}
                size="small"
              />
            </Stack>
          </Stack>

          {/* Comments List */}
          {challenge.comments?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#FFFFFF', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
                🌱 No proofs yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to complete this challenge!
              </Typography>
            </Box>
          ) : (
            challenge.comments?.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            navigate(`/challenges/edit/${id}`)
            setAnchorEl(null)
          }}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => {
            setDeleteChallengeDialogOpen(true)
            setAnchorEl(null)
          }}>
            <Delete fontSize="small" sx={{ mr: 1, color: '#FF6B7A' }} /> Delete
          </MenuItem>
        </Menu>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Proof?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this proof? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteComment} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteChallengeDialogOpen} onClose={() => setDeleteChallengeDialogOpen(false)}>
          <DialogTitle>Delete Challenge?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this challenge? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteChallengeDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteChallenge} 
              color="error"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default ChallengeDetail
