import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material'
import {
  FavoriteBorder,
  Favorite,
  Search,
  FilterList
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import { toast } from 'react-toastify'

const ProductListReal = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [page, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (searchTerm) queryParams.append('search', searchTerm)
      if (selectedCategory) queryParams.append('category', selectedCategory)
      queryParams.append('page', page)
      queryParams.append('limit', itemsPerPage)

      const response = await productAPI.getProducts(queryParams.toString())
      setProducts(response.data || [])
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage))
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleToggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const handleViewDetail = (productId) => {
    navigate(`/products/${productId}`)
  }

  if (loading && products.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar />
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            🌿 Sản phẩm Covezi
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Các sản phẩm thân thiện với môi trường được lựa chọn với yêu tâm
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            variant="outlined"
          />

          {/* Categories */}
          {categories.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Tất cả"
                onClick={() => {
                  setSelectedCategory('')
                  setPage(1)
                }}
                color={selectedCategory === '' ? 'primary' : 'default'}
                variant={selectedCategory === '' ? 'filled' : 'outlined'}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setPage(1)
                  }}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          )}
        </Stack>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Alert severity="info">Không tìm thấy sản phẩm nào</Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {products.map((product) => {
                const isFavorite = favorites.has(product._id)
                const discountedPrice = product.price * (1 - (product.discount || 0) / 100)

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {/* Product Image */}
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.cover || product.thumbnail || '/default-product.svg'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/default-product.svg'
                          }}
                          sx={{
                            objectFit: 'cover',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                          onClick={() => handleViewDetail(product._id)}
                        />

                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <Chip
                            label={`-${product.discount}%`}
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              fontWeight: 'bold'
                            }}
                          />
                        )}

                        {/* Favorite Button */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => handleToggleFavorite(product._id)}
                        >
                          {isFavorite ? (
                            <Favorite sx={{ color: 'error.main' }} />
                          ) : (
                            <FavoriteBorder sx={{ color: 'textSecondary' }} />
                          )}
                        </Box>
                      </Box>

                      {/* Product Info */}
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        {/* Category */}
                        <Chip
                          label={product.category || 'Khác'}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />

                        {/* Name */}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            minHeight: 40,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleViewDetail(product._id)}
                        >
                          {product.name}
                        </Typography>

                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <Rating value={product.rating || 5} readOnly size="small" />
                          <Typography variant="caption" color="textSecondary">
                            ({product.reviewCount || 0})
                          </Typography>
                        </Box>

                        {/* Price */}
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }}
                          >
                            ₫{discountedPrice.toLocaleString('vi-VN')}
                          </Typography>
                          {product.discount > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                textDecoration: 'line-through',
                                color: 'textSecondary'
                              }}
                            >
                              ₫{product.price.toLocaleString('vi-VN')}
                            </Typography>
                          )}
                        </Box>

                        {/* Stock Status */}
                        <Chip
                          label={`${product.stock || 0} còn lại`}
                          size="small"
                          color={product.stock > 0 ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />

                        {/* Eco Score */}
                        {product.ecoScore && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                              ♻️ Eco: {product.ecoScore}
                            </Typography>
                          </Box>
                        )}

                        {/* Short Description */}
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {product.shortDescription}
                        </Typography>
                      </CardContent>

                      {/* Action Buttons */}
                      <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          onClick={() => handleViewDetail(product._id)}
                        >
                          Chi tiết
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => {
                    setPage(value)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default ProductListReal
