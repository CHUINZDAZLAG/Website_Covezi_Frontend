import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Rating,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Tooltip,
  Paper,
  Stack
} from '@mui/material'
import {
  Search,
  FilterList,
  Nature,
  LocalShipping,
  Verified,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Star,
  TrendingUp,
  LocalOffer
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const ProductList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    ecoRating: '',
    inStock: false
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [page, searchTerm, category, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category }),
        sortBy,
        sortOrder: 'desc'
      })
      
      const response = await productAPI.getProducts(queryParams.toString())
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    setPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setPage(1)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const addToCart = (product) => {
    console.log('Added to cart:', product)
  }

  const getEcoChipColor = (rating) => {
    if (rating >= 4.5) return 'success'
    if (rating >= 3.5) return 'primary'
    return 'warning'
  }

  if (loading && products.length === 0) {
    return <PageLoadingSpinner />
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Sản phẩm xanh
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Khám phá hàng ngàn sản phẩm thân thiện với môi trường
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={category}
                  label="Danh mục"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={handleSortChange}
                >
                  <MenuItem value="createdAt">Mới nhất</MenuItem>
                  <MenuItem value="price">Giá thấp đến cao</MenuItem>
                  <MenuItem value="-price">Giá cao đến thấp</MenuItem>
                  <MenuItem value="rating">Đánh giá cao</MenuItem>
                  <MenuItem value="ecoRating">Xanh nhất</MenuItem>
                  <MenuItem value="sold">Bán chạy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
              >
                Bộ lọc
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product, index) => {
                // Gradient colors for beautiful boxes - rainbow effect
                const gradients = [
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // Purple
                  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',  // Pink-Red
                  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',  // Blue-Cyan
                  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',  // Green-Cyan
                  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',  // Orange
                  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',  // Cyan-Purple
                ]
                const gradient = gradients[index % gradients.length]

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: '#fff',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {/* Image Container with Gradient Overlay */}
                      <Box
                        sx={{
                          position: 'relative',
                          height: 240,
                          overflow: 'hidden',
                          background: gradient
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={product.images[0] || '/default-product.jpg'}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.85,
                            transition: 'opacity 0.3s'
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: gradient,
                            opacity: 0.35,
                            transition: 'opacity 0.3s',
                            '.card:hover &': { opacity: 0.2 }
                          }}
                        />
                        
                        {/* Eco Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: 2,
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Nature sx={{ fontSize: 16, color: '#4caf50' }} />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: '#333' }}
                          >
                            {product.ecoMetrics?.overallRating?.toFixed(1) || '4.0'}
                          </Typography>
                        </Box>
                        
                        {/* Favorite Button */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(product._id)
                          }}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                          }}
                        >
                          {favorites.has(product._id) ? (
                            <Favorite sx={{ color: '#f44336' }} />
                          ) : (
                            <FavoriteBorder sx={{ color: '#666' }} />
                          )}
                        </IconButton>
                        
                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 12,
                              left: 12,
                              background: 'rgba(244, 67, 54, 0.95)',
                              backdropFilter: 'blur(8px)',
                              color: 'white',
                              borderRadius: 1.5,
                              padding: '4px 12px',
                              fontWeight: 'bold',
                              fontSize: '0.875rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                          >
                            -{product.discount}%
                          </Box>
                        )}
                      </Box>
                      
                      {/* Content Section */}
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                        {/* Product Name */}
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            mb: 1.5,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: '#2e2e2e',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            color: '#777',
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            flexGrow: 1
                          }}
                        >
                          {product.description}
                        </Typography>
                        
                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Rating value={product.rating || 4.5} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.8rem' }}>
                            ({product.reviewCount || 0})
                          </Typography>
                        </Box>
                        
                        {/* Price Section */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 2 }}>
                          <Box>
                            {product.discount > 0 ? (
                              <>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                    background: `linear-gradient(135deg, ${gradient.split(',')[0].split('(')[2]}, ${gradient.split(',')[1].split(')')[0]})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}
                                >
                                  {(product.price * (1 - product.discount / 100)).toLocaleString()}đ
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: 'line-through',
                                    color: '#aaa',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  {product.price.toLocaleString()}đ
                                </Typography>
                              </>
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '1.2rem',
                                  background: `linear-gradient(135deg, ${gradient.split(',')[0].split('(')[2]}, ${gradient.split(',')[1].split(')')[0]})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text'
                                }}
                              >
                                {product.price.toLocaleString()}đ
                              </Typography>
                            )}
                          </Box>
                          <Chip
                            label={product.quantity > 0 ? 'Còn' : 'Hết'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              borderRadius: 1,
                              background: product.quantity > 0 ? '#e8f5e9' : '#ffebee',
                              color: product.quantity > 0 ? '#2e7d32' : '#c62828'
                            }}
                          />
                        </Box>
                        
                        {/* Action Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCart />}
                          disabled={product.quantity === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                          }}
                          sx={{
                            mt: 'auto',
                            background: product.quantity > 0 ? `linear-gradient(135deg, #4caf50, #2e7d32)` : '#ccc',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            py: 1.2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: product.quantity > 0 ? '0 8px 20px rgba(76, 175, 80, 0.3)' : 'none',
                              transform: product.quantity > 0 ? 'translateY(-2px)' : 'none'
                            }
                          }}
                        >
                          {product.quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default ProductList