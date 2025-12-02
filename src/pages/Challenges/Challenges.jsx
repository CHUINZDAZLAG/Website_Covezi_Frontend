import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Stack,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  People,
  Search as SearchIcon,
  Add as AddIcon,
  EmojiEvents as TrendingIcon,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  PersonAdd,
  ThumbUp,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { challengeAPI } from '~/apis'
import { useSelector } from 'react-redux'
import AppBar from '~/components/AppBar/AppBar'

function Challenges() {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.currentUser)
  
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [favorites, setFavorites] = useState(new Set())
  
  // Edit/Delete menu state
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [selectedChallengeId, setSelectedChallengeId] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchChallenges()
  }, [activeTab, sortBy, page])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      let response
      
      if (activeTab === 0) {
        // All challenges
        response = await challengeAPI.getChallenges(`sortBy=${sortBy}&page=${page}&limit=12`)
      } else if (activeTab === 1) {
        // My created challenges
        response = await challengeAPI.getMyCreatedChallenges(`page=${page}&limit=12`)
      } else if (activeTab === 2) {
        // My joined challenges
        response = await challengeAPI.getDetails('my', `page=${page}&limit=12`)
      }

      if (response?.data) {
        setChallenges(response.data.challenges || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast.error('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setLoading(true)
      const response = await challengeAPI.getChallenges(`search=${searchQuery}&page=1&limit=12`)
      if (response?.data) {
        setChallenges(response.data.challenges || [])
        setTotalPages(response.data.totalPages || 1)
        setPage(1)
      }
    } catch (error) {
      console.error('Error searching challenges:', error)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setPage(1)
  }

  const formatTimeRemaining = (daysRemaining) => {
    if (daysRemaining <= 0) return 'Ended'
    if (daysRemaining === 1) return '1 day left'
    return `${daysRemaining} days left`
  }

  const toggleFavorite = (challengeId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(challengeId)) {
        newFavorites.delete(challengeId)
      } else {
        newFavorites.add(challengeId)
      }
      return newFavorites
    })
  }

  // Edit/Delete handlers
  const handleMenuOpen = (e, challengeId) => {
    setMenuAnchor(e.currentTarget)
    setSelectedChallengeId(challengeId)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedChallengeId(null)
  }

  const handleEditChallenge = () => {
    navigate(`/challenges/edit/${selectedChallengeId}`)
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true)
    setDeletingId(selectedChallengeId)
    handleMenuClose()
  }

  const handleConfirmDelete = async () => {
    try {
      await challengeAPI.deleteChallenge(deletingId)
      toast.success('Challenge deleted successfully')
      setDeleteConfirmOpen(false)
      setDeletingId(null)
      fetchChallenges()
    } catch (error) {
      console.error('Error deleting challenge:', error)
      toast.error(error.response?.data?.message || 'Failed to delete challenge')
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false)
    setDeletingId(null)
  }

  const ChallengeCard = ({ challenge, index }) => {
    // Gradient colors for beautiful boxes - lighter pastel colors
    const gradients = [
      'linear-gradient(135deg, #D8A5C4 0%, #C587B3 100%)',  // Light Purple
      'linear-gradient(135deg, #FFB366 0%, #FFA84D 100%)',  // Light Orange
      'linear-gradient(135deg, #FF6B7A 0%, #FF5566 100%)',  // Light Red
      'linear-gradient(135deg, #D8A5C4 0%, #C587B3 100%)',  // Light Purple
      'linear-gradient(135deg, #FFB366 0%, #FFA84D 100%)',  // Light Orange
      'linear-gradient(135deg, #FF6B7A 0%, #FF5566 100%)',  // Light Red
    ]
    const gradient = gradients[index % gradients.length]

    return (
    <Box
      sx={{
        background: gradient,
        padding: '12px',
        borderRadius: 4,
        height: '100%'
      }}
    >
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: 'none',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          height: 200,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        <CardMedia
          component="img"
          image={challenge.image || '/default-product.svg'}
          alt={challenge.title}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.3s'
          }}
          onClick={() => navigate(`/challenges/${challenge._id}`)}
          onError={(e) => {
            e.target.src = '/default-product.svg'
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 1.5, pt: 2 }}>
        {/* Creator Info */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
          <Avatar 
            src={challenge.creatorAvatar} 
            sx={{ width: 32, height: 32 }}
          >
            {challenge.creatorDisplayName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
              {challenge.creatorDisplayName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              Nov 28, 2025
            </Typography>
          </Box>
          {challenge.isTrending && (
            <Box sx={{ ml: 'auto' }}>
              <Chip 
                icon={<TrendingIcon sx={{ fontSize: 16 }} />} 
                label="Trending" 
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #FFB366, #FFA84D)',
                  color: 'white',
                  fontWeight: 600,
                  height: 28
                }}
              />
            </Box>
          )}
        </Stack>

        {/* Challenge Title */}
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            cursor: 'pointer',
            color: '#222',
            fontWeight: 700,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: '#FF6B7A' }
          }}
          onClick={() => navigate(`/challenges/${challenge._id}`)}
        >
          {challenge.title}
        </Typography>

        {/* Tags/Categories */}
        {challenge.tags?.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1.5} gap={0.5}>
            {challenge.tags.slice(0, 3).map((tag, idx) => (
              <Chip 
                key={idx} 
                label={tag} 
                size="small" 
                sx={{
                  backgroundColor: '#FFF0E6',
                  color: '#FF8C3C',
                  fontWeight: 600,
                  height: 24,
                  fontSize: '0.75rem'
                }}
              />
            ))}
          </Stack>
        )}

        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1
          }}
        >
          {challenge.description}
        </Typography>

        {/* Read More */}
        <Typography 
          sx={{ 
            color: '#FF8C3C',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
            mb: 1.5,
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => navigate(`/challenges/${challenge._id}`)}
        >
          Read more
        </Typography>

        {/* Info Row - Time and Participants */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <People sx={{ fontSize: 16, color: '#999' }} />
            <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
              {challenge.participantCount || 0}
            </Typography>
          </Stack>
          
          <Chip 
            label={formatTimeRemaining(challenge.daysRemaining)}
            size="small"
            sx={{
              backgroundColor: challenge.daysRemaining > 0 && challenge.daysRemaining <= 3 ? '#FFE6E6' : '#F0E6FF',
              color: challenge.daysRemaining > 0 && challenge.daysRemaining <= 3 ? '#FF6B7A' : '#B6349A',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24
            }}
          />
        </Stack>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ justifyContent: 'space-between', pt: 1, pb: 1.5, px: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={favorites.has(challenge._id) ? <Favorite sx={{ fontSize: 18 }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
            sx={{ 
              color: favorites.has(challenge._id) ? '#FF6B7A' : '#666', 
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem'
            }}
            onClick={() => toggleFavorite(challenge._id)}
          >
            {favorites.has(challenge._id) ? 'Liked' : 'Like'}
          </Button>
          <Button
            size="small"
            startIcon={<PersonAdd sx={{ fontSize: 18 }} />}
            sx={{ 
              color: '#B6349A', 
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem'
            }}
            onClick={() => navigate(`/challenges/${challenge._id}`)}
          >
            Join
          </Button>
        </Stack>
        {challenge.createdBy === user?._id && (
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, challenge._id)}
            sx={{ color: '#666' }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
    </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      <AppBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" sx={{ color: '#32778E', fontWeight: 'bold' }}>
            Green Challenges
          </Typography>
          
          {user && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/challenges/create')}
              sx={{
                backgroundColor: '#FF8C3C',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#E67A2B'
                }
              }}
            >
              Create Challenge
            </Button>
          )}
        </Stack>

        <TextField
          fullWidth
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#32778E'
              },
              '&:hover fieldset': {
                borderColor: '#FF8C3C'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#32778E' }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Tất cả challenges" />
          {user && <Tab label="Challenges của tôi" />}
          {user && <Tab label="Challenges tham gia" />}
        </Tabs>
      </Box>

      <Stack direction="row" spacing={1} mb={3}>
        <Chip 
          label="Trending" 
          onClick={() => setSortBy('trending')}
          color={sortBy === 'trending' ? 'primary' : 'default'}
          sx={{
            backgroundColor: sortBy === 'trending' ? '#FF8C3C' : '#F8FCFD',
            color: sortBy === 'trending' ? '#FFFFFF' : '#32778E',
            '&:hover': {
              backgroundColor: sortBy === 'trending' ? '#FF8C3C' : '#FF8C3C',
              color: '#FFFFFF'
            }
          }}
        />
        <Chip 
          label="Ending Soon" 
          onClick={() => setSortBy('ending_soon')}
          color={sortBy === 'ending_soon' ? 'primary' : 'default'}
          sx={{
            backgroundColor: sortBy === 'ending_soon' ? '#FF001A' : '#F8FCFD',
            color: sortBy === 'ending_soon' ? '#FFFFFF' : '#32778E',
            '&:hover': {
              backgroundColor: sortBy === 'ending_soon' ? '#FF001A' : '#FF001A',
              color: '#FFFFFF'
            }
          }}
        />
      </Stack>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : challenges.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No challenges found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {user ? 'Be the first to create a challenge!' : 'Login to participate in challenges'}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {challenges.map((challenge, index) => (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <ChallengeCard challenge={challenge} index={index} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Typography sx={{ py: 1 }}>
                Page {page} of {totalPages}
              </Typography>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
      </Container>

      {/* Edit/Delete Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditChallenge}>
          <EditIcon sx={{ fontSize: 18, mr: 1 }} />
          Edit Challenge
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#FF6B7A' }}>
          <DeleteIcon sx={{ fontSize: 18, mr: 1 }} />
          Delete Challenge
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Challenge</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this challenge? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: '#FF6B7A',
              '&:hover': { backgroundColor: '#FF5566' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Challenges
