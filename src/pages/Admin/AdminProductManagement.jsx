import { useState, useEffect, useRef, useCallback } from 'react'
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
  MenuItem
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Upload,
  Search
} from '@mui/icons-material'
import { productAPI } from '~/apis'
import { toast } from 'react-toastify'

const AdminProductManagement = () => {
  const fileInputRef = useRef(null)
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
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

  const handleFetchStats = useCallback(async () => {
    try {
      const response = await productAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  const handleFetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      // Use getMyProducts to fetch only products created by current user
      const queryString = searchTerm ? `search=${searchTerm}` : ''
      const response = await productAPI.getMyProducts(queryString)
      // Handle both response.data as array or nested data property
      const productList = Array.isArray(response.data) ? response.data : (response.data?.products || response.data?.data || [])
      setProducts(productList)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    handleFetchProducts()
    handleFetchStats()
  }, [handleFetchProducts, handleFetchStats])

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
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log('[DEBUG] handleImageChange - file selected:', file?.name, file?.size, file?.type)
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        console.log('[DEBUG] Image preview set successfully')
      }
      reader.readAsDataURL(file)
    } else {
      console.warn('[WARNING] No file selected in handleImageChange')
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

      // Debug: Log image file status
      console.log('[DEBUG] handleSaveProduct - imageFile:', imageFile)
      console.log('[DEBUG] handleSaveProduct - imageFile size:', imageFile?.size)
      console.log('[DEBUG] handleSaveProduct - imageFile name:', imageFile?.name)
      console.log('[DEBUG] handleSaveProduct - imageFile type:', imageFile?.type)

      // Only append image if a NEW file was selected
      // When editing, if no new file selected, imageFile will be null but image preview might show old image
      if (imageFile) {
        form.append('coverImage', imageFile)
        console.log('[DEBUG] Added NEW coverImage to FormData, file size:', imageFile.size)
      } else if (!editingProduct) {
        // Only warn about missing image when CREATING new product
        console.warn('[WARNING] No image file selected for new product!')
      } else {
        console.log('[DEBUG] Editing product - no new image selected, keeping existing image')
      }

      // Debug: Log FormData contents
      console.log('[DEBUG] FormData contents:')
      for (let pair of form.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: File(name="${pair[1].name}", size=${pair[1].size}, type="${pair[1].type}")`)
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`)
        }
      }

      console.log('[DEBUG] About to send request, editingProduct:', editingProduct ? editingProduct._id : 'none')

      let response
      try {
        if (editingProduct) {
          console.log('[DEBUG] Calling updateProduct API...')
          response = await productAPI.updateProduct(editingProduct._id, form)
          console.log('[DEBUG] updateProduct response:', response)
          console.log('[DEBUG] Response data._id:', response.data?._id)
          console.log('[DEBUG] Response data.cover:', response.data?.cover)
          console.log('[DEBUG] Response data.name:', response.data?.name)
        } else {
          console.log('[DEBUG] Calling createProduct API...')
          response = await productAPI.createProduct(form)
          console.log('[DEBUG] createProduct response:', response)
          console.log('[DEBUG] Response data._id:', response.data?._id)
          console.log('[DEBUG] Response data.cover:', response.data?.cover)
          console.log('[DEBUG] Response data.name:', response.data?.name)
        }
      } catch (apiError) {
        console.error('[DEBUG] API call failed:', apiError.message)
        throw apiError
      }

      toast.success(editingProduct ? 'Sản phẩm cập nhật thành công!' : 'Sản phẩm tạo thành công!')
      await handleFetchProducts()
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
      await handleFetchProducts()
      toast.success('Sản phẩm đã được xóa')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Không thể xóa sản phẩm')
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f0 100%)',
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#B6349A', mb: 0.5 }}>
              📦 Quản lý Sản phẩm
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
              Quản lý tất cả sản phẩm của bạn
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1.5,
              px: 3,
              py: 1,
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(217, 70, 166, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                background: 'linear-gradient(135deg, #FF6B7A 0%, #FF8C3C 100%)',
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255, 107, 122, 0.2)',
                border: 'none'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500 }}>
                    Tổng sản phẩm
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {stats.categories && Object.entries(stats.categories).map(([category, count], idx) => {
              const colors = [
                { bg: 'linear-gradient(135deg, #B6349A 0%, #FF6B7A 100%)', shadow: 'rgba(182, 52, 154, 0.2)' },
                { bg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', shadow: 'rgba(76, 175, 80, 0.2)' },
                { bg: 'linear-gradient(135deg, #32778E 0%, #4d99b3 100%)', shadow: 'rgba(50, 119, 142, 0.2)' },
                { bg: 'linear-gradient(135deg, #FFB366 0%, #FFA84D 100%)', shadow: 'rgba(255, 179, 102, 0.2)' }
              ]
              const colorScheme = colors[idx % colors.length]
              return (
                <Grid item xs={12} sm={6} md={3} key={category}>
                  <Card sx={{
                    background: colorScheme.bg,
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${colorScheme.shadow}`,
                    border: 'none'
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
                        {count}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.95, fontWeight: 500, textTransform: 'capitalize' }}>
                        {category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#B6349A' }} />
              </InputAdornment>
            )
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '1px solid #B6349A',
                boxShadow: '0 2px 8px rgba(182, 52, 154, 0.08)'
              },
              '&.Mui-focused': {
                border: '2px solid #B6349A',
                boxShadow: '0 4px 16px rgba(182, 52, 154, 0.12)'
              }
            }
          }}
        />

        {/* Products Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">Không có sản phẩm nào</Alert>
        ) : (
          <TableContainer component={Paper} sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead sx={{
                background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.08) 0%, rgba(255, 107, 122, 0.08) 100%)',
                borderBottom: '2px solid #e0e0e0'
              }}>
                <TableRow>
                  <TableCell sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Sản phẩm</TableCell>
                  <TableCell sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Danh mục</TableCell>
                  <TableCell align="right" sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Giá</TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Kho</TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Giảm giá</TableCell>
                  <TableCell align="center" sx={{
                    fontWeight: 700,
                    color: '#B6349A',
                    fontSize: '0.95rem',
                    py: 2
                  }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(182, 52, 154, 0.03)',
                      borderLeft: '3px solid #B6349A'
                    },
                    borderLeft: '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {product.cover && (
                          <Box
                            component="img"
                            src={product.cover}
                            alt={product.name}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1.5,
                              objectFit: 'cover',
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="subtitle2" sx={{
                            fontWeight: 700,
                            color: '#222'
                          }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Bán: {product.sold || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{
                      py: 2,
                      fontSize: '0.95rem',
                      color: '#666'
                    }}>
                      <Chip
                        label={product.category || '-'}
                        sx={{
                          backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{
                      py: 2,
                      fontSize: '0.95rem'
                    }}>
                      <Typography sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ₫{product.price.toLocaleString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <Chip
                        label={product.stock}
                        sx={{
                          backgroundColor: product.stock > 0 ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 107, 122, 0.15)',
                          color: product.stock > 0 ? '#4CAF50' : '#FF6B7A',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      {product.discount > 0 ? (
                        <Chip
                          label={`-${product.discount}%`}
                          sx={{
                            backgroundColor: 'rgba(255, 107, 122, 0.15)',
                            color: '#FF6B7A',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#999' }}>-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(product)}
                        sx={{
                          color: '#B6349A',
                          '&:hover': {
                            backgroundColor: 'rgba(182, 52, 154, 0.1)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Edit sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product._id)}
                        sx={{
                          color: '#FF6B7A',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 122, 0.1)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Delete sx={{ fontSize: '1.2rem' }} />
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: '1.2rem',
          background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.05) 0%, rgba(255, 107, 122, 0.05) 100%)',
          borderBottom: '2px solid #e0e0e0'
        }}>
          {editingProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <CardContent>
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      border: '2px dashed #B6349A',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      cursor: 'pointer',
                      bgcolor: imagePreview ? 'transparent' : '#f9f9f9',
                      backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: imagePreview ? 'transparent' : '#f0f0f0',
                        borderColor: '#FF6B7A'
                      }
                    }}
                    component="label"
                  >
                    {!imagePreview && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Upload sx={{
                          fontSize: 40,
                          color: '#B6349A',
                          mb: 1
                        }} />
                        <Typography variant="body2" sx={{
                          color: '#B6349A',
                          fontWeight: 600
                        }}>
                          Tải ảnh lên
                        </Typography>
                      </Box>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                  {imagePreview && (
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                      sx={{
                        color: '#FF6B7A',
                        borderColor: '#FF6B7A',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 122, 0.05)',
                          borderColor: '#FF6B7A'
                        }
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      opacity: 0.6
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Mô tả ngắn"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleFormChange}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Mô tả chi tiết"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  multiline
                  rows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Danh mục"
                  name="category"
                  select
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B6349A'
                      }
                    }
                  }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        }
                      }}
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B6349A'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            {/* External Links */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{
                fontWeight: 700,
                color: '#B6349A',
                mb: 1
              }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      }
                    }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      }
                    }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#B6349A'
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{
          borderTop: '1px solid #e0e0e0',
          p: 2,
          gap: 1
        }}>
          <Button onClick={handleCloseDialog} sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: '#999'
          }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            sx={{
              background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1.5,
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(217, 70, 166, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {editingProduct ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProductManagement
