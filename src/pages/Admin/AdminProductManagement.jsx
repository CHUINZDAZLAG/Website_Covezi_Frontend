import React, { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  Select,
  MenuItem
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Upload,
  Search,
  Close
} from '@mui/icons-material'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import { toast } from 'react-toastify'

const AdminProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 0,
    discount: 0,
    stock: 0,
    links: {
      shopee: '',
      tiktok: '',
      facebook: ''
    }
  })

  useEffect(() => {
    fetchProducts()
  }, [searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryString = searchTerm ? `search=${searchTerm}` : ''
      const response = await productAPI.getProducts(queryString)
      // Handle both response.data as array or nested data property
      const productList = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      setProducts(productList)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        category: product.category || '',
        price: product.price || 0,
        discount: product.discount || 0,
        stock: product.stock || 0,
        links: product.links || { shopee: '', tiktok: '', facebook: '' }
      })
      setImagePreview(product.cover || null)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        category: '',
        price: 0,
        discount: 0,
        stock: 0,
        links: { shopee: '', tiktok: '', facebook: '' }
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduct(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('links.')) {
      const linkField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        links: { ...prev.links, [linkField]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['price', 'discount', 'stock'].includes(name) ? parseFloat(value) || 0 : value
      }))
    }
  }

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Vui lòng nhập tên và giá sản phẩm')
      return
    }

    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('description', formData.description)
      form.append('shortDescription', formData.shortDescription)
      form.append('category', formData.category)
      form.append('price', String(formData.price))
      form.append('discount', String(formData.discount))
      form.append('stock', String(formData.stock))
      form.append('links', JSON.stringify(formData.links))

      if (imageFile) {
        form.append('coverImage', imageFile)
      }

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, form)
      } else {
        await productAPI.createProduct(form)
      }

      await fetchProducts()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving product:', error)
      console.error('Full error response:', error.response?.data)
      console.error('Error message:', error.response?.data?.message)
      console.error('Error stack:', error.response?.data?.stack)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Không thể lưu sản phẩm'
      toast.error(errorMessage)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return

    try {
      await productAPI.deleteProduct(productId)
      await fetchProducts()
      toast.success('Sản phẩm đã được xóa')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Không thể xóa sản phẩm')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            📦 Quản lý Sản phẩm
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />

        {/* Products Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">Không có sản phẩm nào</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Danh mục</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Kho</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Giảm giá</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {product.cover && (
                          <Box
                            component="img"
                            src={product.cover}
                            alt={product.name}
                            sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Bán: {product.sold || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 'bold' }}>
                        ₫{product.price.toLocaleString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.stock}
                        color={product.stock > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.discount > 0 ? (
                        <Chip label={`-${product.discount}%`} color="warning" size="small" />
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      cursor: 'pointer',
                      bgcolor: imagePreview ? 'transparent' : '#f9f9f9',
                      backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                    component="label"
                  >
                    {!imagePreview && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Upload sx={{ fontSize: 40, color: 'textSecondary', mb: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          Tải ảnh lên
                        </Typography>
                      </Box>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                  {imagePreview && (
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      size="small"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Form Fields */}
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Mô tả ngắn"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleFormChange}
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Mô tả chi tiết"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="Danh mục"
                  name="category"
                  select
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <MenuItem value="organic">Organic</MenuItem>
                  <MenuItem value="recycled">Tái chế</MenuItem>
                  <MenuItem value="sustainable">Bền vững</MenuItem>
                  <MenuItem value="eco-conscious">Ý thức sinh thái</MenuItem>
                </TextField>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Giá (₫)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleFormChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Giảm (%)"
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={handleFormChange}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Kho"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleFormChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            {/* External Links */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                🔗 Liên kết bên ngoài
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Shopee URL"
                    name="links.shopee"
                    value={formData.links.shopee}
                    onChange={handleFormChange}
                    placeholder="https://shopee.vn/..."
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="TikTok Shop URL"
                    name="links.tiktok"
                    value={formData.links.tiktok}
                    onChange={handleFormChange}
                    placeholder="https://tiktokshop.com/..."
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Facebook Shop URL"
                    name="links.facebook"
                    value={formData.links.facebook}
                    onChange={handleFormChange}
                    placeholder="https://facebook.com/..."
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
          >
            {editingProduct ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProductManagement
