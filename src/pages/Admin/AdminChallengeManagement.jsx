import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  InputAdornment,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { challengeAPI } from '~/apis'
import { toast } from 'react-toastify'
import AppBar from '~/components/AppBar/AppBar'
import { useSelector } from 'react-redux'

function AdminChallengeManagement() {
  const user = useSelector(state => state.user.user)
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Post composer state
  const [composerData, setComposerData] = useState({
    title: '',
    description: '',
    type: 'eco-action',
    tags: '',
    durationDays: 7,
    image: null
  })
  const [composerImagePreview, setComposerImagePreview] = useState(null)
  const [composerImageFile, setComposerImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Edit dialog state
  const [editDialog, setEditDialog] = useState({ open: false, challenge: null })
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    type: 'eco-action',
    tags: '',
    durationDays: 7,
    image: null
  })
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, challenge: null })
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null)
  const [selectedChallengeForMenu, setSelectedChallengeForMenu] = useState(null)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await challengeAPI.getCreatedChallenges({ limit: 100 })
      setChallenges(response.data?.challenges || response.data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast.error('Không thể tải danh sách thử thách')
    } finally {
      setLoading(false)
    }
  }

  // ==================== POST COMPOSER HANDLERS ====================
  
  const handleComposerChange = (e) => {
    const { name, value } = e.target
    setComposerData(prev => ({ ...prev, [name]: value }))
  }

  const handleComposerImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setComposerImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setComposerImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleClearComposerImage = () => {
    setComposerImageFile(null)
    setComposerImagePreview(null)
  }

  const handlePostChallenge = async () => {
    if (!composerData.title.trim() || !composerData.description.trim()) {
      toast.error('Vui lòng nhập tiêu đề và mô tả')
      return
    }

    if (composerData.title.length < 5 || composerData.title.length > 100) {
      toast.error('Tiêu đề phải từ 5 đến 100 ký tự')
      return
    }

    if (composerData.description.length < 10 || composerData.description.length > 2000) {
      toast.error('Mô tả phải từ 10 đến 2000 ký tự')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('title', composerData.title)
      formData.append('description', composerData.description)
      formData.append('type', composerData.type)
      formData.append('durationDays', String(composerData.durationDays))
      if (composerData.tags.trim()) {
        formData.append('tags', composerData.tags)
      }
      if (composerImageFile) {
        formData.append('image', composerImageFile)
      }

      console.log('[AdminChallengeManagement] Sending challenge creation request')
      console.log('[AdminChallengeManagement] FormData:', { title: composerData.title, description: composerData.description, type: composerData.type, durationDays: composerData.durationDays })

      await challengeAPI.createChallenge(formData)
      
      toast.success('✅ Thử thách đã được tạo thành công!')
      
      // Reset composer
      setComposerData({
        title: '',
        description: '',
        type: 'eco-action',
        tags: '',
        durationDays: 7,
        image: null
      })
      setComposerImageFile(null)
      setComposerImagePreview(null)
      
      // Reload challenges
      await fetchChallenges()
    } catch (error) {
      console.error('Error creating challenge:', error)
      toast.error(error.response?.data?.message || 'Lỗi khi tạo thử thách')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==================== EDIT HANDLERS ====================
  
  const handleOpenEditDialog = (challenge) => {
    setEditDialog({ open: true, challenge })
    setEditFormData({
      title: challenge.title,
      description: challenge.description,
      type: challenge.type,
      tags: challenge.tags?.join(', ') || '',
      durationDays: challenge.durationDays || 7,
      image: null
    })
    setEditImagePreview(challenge.image || null)
    setEditImageFile(null)
    setMoreMenuAnchor(null)
  }

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, challenge: null })
    setEditFormData({
      title: '',
      description: '',
      type: 'eco-action',
      tags: '',
      durationDays: 7,
      image: null
    })
    setEditImagePreview(null)
    setEditImageFile(null)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setEditImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveChallenge = async () => {
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      toast.error('Vui lòng nhập tiêu đề và mô tả')
      return
    }

    try {
      setEditSubmitting(true)
      const formData = new FormData()
      formData.append('title', editFormData.title)
      formData.append('description', editFormData.description)
      formData.append('type', editFormData.type)
      formData.append('durationDays', String(editFormData.durationDays))
      if (editFormData.tags.trim()) {
        formData.append('tags', editFormData.tags)
      }
      if (editImageFile) {
        formData.append('image', editImageFile)
      }

      await challengeAPI.updateChallenge(editDialog.challenge._id, formData)
      
      toast.success('✅ Thử thách đã được cập nhật!')
      handleCloseEditDialog()
      await fetchChallenges()
    } catch (error) {
      console.error('Error updating challenge:', error)
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thử thách')
    } finally {
      setEditSubmitting(false)
    }
  }

  // ==================== DELETE HANDLERS ====================

  const handleOpenDeleteDialog = (challenge) => {
    setDeleteDialog({ open: true, challenge })
    setMoreMenuAnchor(null)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, challenge: null })
  }

  const handleConfirmDelete = async () => {
    try {
      await challengeAPI.deleteChallenge(deleteDialog.challenge._id)
      toast.success('✅ Thử thách đã được xóa')
      setChallenges(challenges.filter(c => c._id !== deleteDialog.challenge._id))
      handleCloseDeleteDialog()
    } catch (error) {
      console.error('Error deleting challenge:', error)
      toast.error(error.response?.data?.message || 'Lỗi khi xóa thử thách')
    }
  }

  // ==================== MENU HANDLERS ====================

  const handleOpenMoreMenu = (event, challenge) => {
    setMoreMenuAnchor(event.currentTarget)
    setSelectedChallengeForMenu(challenge)
  }

  const handleCloseMoreMenu = () => {
    setMoreMenuAnchor(null)
  }

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar />
      
      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* POST COMPOSER */}
        <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            {/* Header with Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                src={user?.avatar}
                alt={user?.displayName}
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {user?.displayName}
                </Typography>
              </Box>
            </Box>

            {/* Title Input */}
            <TextField
              fullWidth
              placeholder="🎯 Tiêu đề thử thách..."
              name="title"
              value={composerData.title}
              onChange={handleComposerChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            />

            {/* Description Input */}
            <TextField
              fullWidth
              placeholder="📝 Mô tả thử thách chi tiết..."
              name="description"
              value={composerData.description}
              onChange={handleComposerChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            />

            {/* Image Preview */}
            {composerImagePreview && (
              <Box sx={{ mb: 2, position: 'relative' }}>
                <Box
                  component="img"
                  src={composerImagePreview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    maxHeight: 300,
                    objectFit: 'cover'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleClearComposerImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Options Grid */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select
                    name="type"
                    value={composerData.type}
                    onChange={handleComposerChange}
                    label="Loại"
                    disabled={isSubmitting}
                  >
                    <MenuItem value="eco-action">🌱 Hành động Eco</MenuItem>
                    <MenuItem value="purchase-green">🛍️ Mua sản phẩm xanh</MenuItem>
                    <MenuItem value="recycle">♻️ Tái chế</MenuItem>
                    <MenuItem value="plant-tree">🌳 Trồng cây</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời hạn (ngày)"
                  name="durationDays"
                  value={composerData.durationDays}
                  onChange={handleComposerChange}
                  inputProps={{ min: 3, max: 30 }}
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  name="tags"
                  value={composerData.tags}
                  onChange={handleComposerChange}
                  size="small"
                  disabled={isSubmitting}
                  placeholder="environment, sustainability, ..."
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
              <Button
                startIcon={<ImageIcon />}
                component="label"
                variant="outlined"
                size="small"
                disabled={isSubmitting}
              >
                Thêm ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleComposerImageChange}
                  style={{ display: 'none' }}
                  disabled={isSubmitting}
                />
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handlePostChallenge}
                disabled={isSubmitting || !composerData.title.trim() || !composerData.description.trim()}
                sx={{ flex: 1, ml: 1 }}
              >
                {isSubmitting ? 'Đang tạo...' : 'Đăng thử thách'}
              </Button>
            </Box>
          </CardContent>
        </Paper>

        {/* SEARCH */}
        <TextField
          fullWidth
          placeholder="🔍 Tìm kiếm thử thách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3, bgcolor: 'white' }}
        />

        {/* CHALLENGES LIST */}
        {filteredChallenges.length === 0 ? (
          <Alert severity="info">
            {searchTerm ? '❌ Không tìm thấy thử thách' : '📋 Chưa có thử thách nào'}
          </Alert>
        ) : (
          <Stack spacing={2}>
            {filteredChallenges.map((challenge) => (
              <Card key={challenge._id} elevation={1}>
                <CardHeader
                  avatar={<Avatar src={challenge.creatorAvatar} alt={challenge.creatorDisplayName} />}
                  title={challenge.creatorDisplayName}
                  subheader={new Date(challenge.createdAt).toLocaleString('vi-VN')}
                  action={
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMoreMenu(e, challenge)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {challenge.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {challenge.description}
                  </Typography>
                  {challenge.image && (
                    <Box
                      component="img"
                      src={challenge.image}
                      alt={challenge.title}
                      sx={{
                        width: '100%',
                        maxHeight: 300,
                        borderRadius: 1,
                        objectFit: 'cover',
                        mb: 2
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={challenge.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`⏱️ ${challenge.durationDays} ngày`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`👥 ${challenge.participantCount || 0}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* MORE MENU */}
        <Menu
          anchorEl={moreMenuAnchor}
          open={Boolean(moreMenuAnchor)}
          onClose={handleCloseMoreMenu}
        >
          <MenuItem onClick={() => handleOpenEditDialog(selectedChallengeForMenu)}>
            <EditIcon sx={{ mr: 1 }} /> Chỉnh sửa
          </MenuItem>
          <MenuItem onClick={() => handleOpenDeleteDialog(selectedChallengeForMenu)}>
            <DeleteIcon sx={{ mr: 1, color: 'error' }} /> Xóa
          </MenuItem>
        </Menu>

        {/* EDIT DIALOG */}
        <Dialog open={editDialog.open} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>✏️ Chỉnh sửa thử thách</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              disabled={editSubmitting}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              multiline
              rows={3}
              disabled={editSubmitting}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Loại</InputLabel>
              <Select
                name="type"
                value={editFormData.type}
                onChange={handleEditFormChange}
                label="Loại"
                disabled={editSubmitting}
              >
                <MenuItem value="eco-action">🌱 Hành động Eco</MenuItem>
                <MenuItem value="purchase-green">🛍️ Mua sản phẩm xanh</MenuItem>
                <MenuItem value="recycle">♻️ Tái chế</MenuItem>
                <MenuItem value="plant-tree">🌳 Trồng cây</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Thời hạn (ngày)"
              name="durationDays"
              value={editFormData.durationDays}
              onChange={handleEditFormChange}
              inputProps={{ min: 3, max: 30 }}
              size="small"
              disabled={editSubmitting}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Tags"
              name="tags"
              value={editFormData.tags}
              onChange={handleEditFormChange}
              size="small"
              disabled={editSubmitting}
              sx={{ mb: 2 }}
            />
            {editImagePreview && (
              <Box sx={{ mb: 2 }}>
                <Box
                  component="img"
                  src={editImagePreview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    maxHeight: 250,
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}
            <Button
              fullWidth
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              disabled={editSubmitting}
            >
              Thay đổi ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ display: 'none' }}
                disabled={editSubmitting}
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={editSubmitting}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveChallenge}
              variant="contained"
              disabled={editSubmitting}
            >
              {editSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
          <DialogTitle>⚠️ Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa thử thách "{deleteDialog.challenge?.title}"?
            </Typography>
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AdminChallengeManagement
