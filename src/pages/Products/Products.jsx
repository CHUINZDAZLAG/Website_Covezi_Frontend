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
  Button,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Pagination,
  Rating,
  IconButton,
  Slider,
  Divider,
  Modal,
  Drawer,
  Avatar
} from '@mui/material'
import {
  Search,
  FilterList,
  GridView,
  Sort,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Nature,
  Star,
  LocalOffer,
  Close,
  TrendingUp,
  NewReleases
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import CoverImage from '~/assets/Cover_Covezi.png'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('Tất cả')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState(new Set())
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const categories = [
    'Tất cả',
    'Màu thiên nhiên',
    'Bộ đồ chơi màu',
    'Bộ sáng tạo nghệ thuật với màu',
    'Combo sản phẩm màu',
    'Other'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất', icon: <NewReleases sx={{ fontSize: 16, mr: 0.5 }} /> },
    { value: 'price-asc', label: 'Giá thấp đến cao', icon: <NewReleases sx={{ fontSize: 16, mr: 0.5 }} /> },
    { value: 'price-desc', label: 'Giá cao đến thấp', icon: <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} /> },
    { value: 'popular', label: 'Phổ biến nhất', icon: <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} /> }
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.append('search', searchQuery)
      if (category && category !== 'Tất cả') queryParams.append('category', category)
      queryParams.append('page', currentPage)
      queryParams.append('limit', 12)
      queryParams.append('sort', sortBy)

      const response = await productAPI.getProducts(queryParams.toString())
      setProducts(response.data?.products || response.products || [])
      setTotalPages(Math.ceil((response.data?.total || response.total || 0) / 12))
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, category, sortBy, currentPage, priceRange])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const addToCart = (product) => {
    console.log('Added to cart:', product)
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getFinalPrice = (product) => {
    return product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price
  }

  // Gradient colors using brand colors: B6349A, FF8C3C, FF001A
  const getRandomGradient = () => {
    const colors = [
      { light: '#D4A8D0', dark: '#A8399A' },  // Purple - darker
      { light: '#FFD4A3', dark: '#FF8C00' },  // Orange - darker
      { light: '#FF99B8', dark: '#E60015' }   // Red - darker
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getGradientForIndex = (index) => {
    const colors = [
      { light: '#D4A8D0', dark: '#A8399A' },  // Purple - darker
      { light: '#FFD4A3', dark: '#FF8C00' },  // Orange - darker
      { light: '#FF99B8', dark: '#E60015' }   // Red - darker
    ]
    const color = colors[index % colors.length]
    return `linear-gradient(135deg, ${color.light} 0%, ${color.dark} 100%)`
  }

  const ProductCard = ({ product, index }) => {
    const gradient = getGradientForIndex(index)
    const finalPrice = getFinalPrice(product)

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
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
            },
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {/* Product Image Container */}
          <Box
            sx={{
              position: 'relative',
              height: 200,
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CardMedia
              component="img"
              image={product.cover || product.images?.[0] || 'https://placehold.co/300x200?text=Product'}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x200?text=Product'
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: 1
              }}
            />

            {/* Discount Badge */}
            {product.discount > 0 && (
              <Chip
                icon={<LocalOffer />}
                label={`-${product.discount}%`}
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontWeight: 'bold',
                  backgroundColor: '#FF6B7A',
                  color: 'white'
                }}
              />
            )}

          </Box>

          {/* Content Section */}
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 1.5, pt: 2 }}>
            {/* Product Name */}
            <Typography
              variant="h6"
              component="h2"
              sx={{
                cursor: 'pointer',
                color: '#222',
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.3,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                '&:hover': { color: '#FF6B7A' }
              }}
            >
              {product.name}
            </Typography>

            {/* Category Chip */}
            <Chip
              label={product.category}
              size="small"
              sx={{
                mb: 1.5,
                width: 'fit-content',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />

            {/* Product Description */}
            {product.description && (
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  color: '#666',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {product.description}
              </Typography>
            )}

            {/* Price Section */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(135deg, #FF6B7A 0%, #B6349A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                {formatCurrency(finalPrice)}
              </Typography>
              {product.discount > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#999',
                    fontSize: '0.85rem'
                  }}
                >
                  {formatCurrency(product.price)}
                </Typography>
              )}
            </Box>



            {/* View Details Button */}
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/products/${product._id}`)
              }}
              fullWidth
              startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
              sx={{
                mt: 'auto',
                background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                py: 1,
                fontSize: '0.9rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c71585 0%, #b80570 100%)',
                  transform: 'scale(1.02)'
                }
              }}
            >
              Xem chi tiết sản phẩm
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const FilterSidebar = () => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        height: 'fit-content',
        position: { xs: 'relative', md: 'sticky' },
        top: { md: 20 },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {/* Sort Options */}
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 700, 
          mb: 2.5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#32778E',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        <Sort sx={{ fontSize: 18, color: '#32778E' }} />
        Sắp xếp
      </Typography>
      <Stack spacing={0.8} sx={{ mb: 3 }}>
        {sortOptions.map(option => (
          <Button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            variant={sortBy === option.value ? 'contained' : 'outlined'}
            fullWidth
            startIcon={option.icon}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: sortBy === option.value ? 600 : 500,
              background: sortBy === option.value ? '#32778E' : 'transparent',
              color: sortBy === option.value ? 'white' : '#32778E',
              border: sortBy === option.value ? 'none' : '1.5px solid #32778E',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              py: 1,
              '&:hover': {
                background: sortBy === option.value ? '#2a5f6f' : 'rgba(50, 119, 142, 0.05)',
                borderColor: '#32778E'
              }
            }}
          >
            {option.label}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      {/* Category Filter */}
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: '#32778E',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Danh mục
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select
          value={category}
          onChange={handleCategoryChange}
          sx={{
            borderRadius: 1.5,
            backgroundColor: '#ffffff',
            border: '1.5px solid #32778E',
            color: '#32778E',
            fontWeight: 500,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#32778E'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#32778E',
              borderWidth: '1.5px'
            },
            '& .MuiSvgIcon-root': {
              color: '#32778E'
            }
          }}
        >
          {categories.map(cat => (
            <MenuItem key={cat} value={cat} sx={{ color: '#32778E' }}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Range */}
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 700, 
          mb: 2,
          color: '#32778E',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Khoảng giá
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2, 
          color: '#32778E',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
      </Typography>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        min={0}
        max={1000000}
        step={50000}
        sx={{
          color: '#32778E',
          '& .MuiSlider-thumb': {
            backgroundColor: '#32778E',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(50, 119, 142, 0.3)'
          },
          '& .MuiSlider-track': {
            backgroundColor: '#32778E'
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#d0d0d0'
          }
        }}
      />
    </Paper>
  )

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: 'transparent'
      }}
    >
      <AppBar />

      {/* Header Section */}
      <Box sx={{ backgroundColor: 'transparent', minHeight: 'auto' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: '#32778E',
                  fontWeight: 'bold'
                }}
              >
                Covezi's Product
              </Typography>
            </Stack>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              sx={{
                backgroundColor: '#FFFFFF',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#32778E'
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF8C3C'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#32778E'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#32778E' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        <Container maxWidth="lg">
          {/* Results Info */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#32778E' }}>
              Tìm thấy <span style={{ color: '#32778E', fontWeight: 800, fontSize: '1.1em' }}>{products.length}</span> sản phẩm
              {category !== 'Tất cả' && ` trong "${category}"`}
            </Typography>
            <Button
              startIcon={<FilterList />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#333' }}
            >
              Bộ lọc
            </Button>
          </Box>
        </Container>

        {/* Main Content Grid */}
        <Container maxWidth="lg">
          <Grid container spacing={3}>
          {/* Sidebar - Desktop Only */}
          <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <FilterSidebar />
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            {products.length > 0 ? (
              <Grid container spacing={3}>
                {products.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <ProductCard product={product} index={index} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Không tìm thấy sản phẩm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
              </Paper>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600
                    }
                  }}
                />
              </Box>
            )}
          </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            borderRadius: '24px 24px 0 0'
          }
        }}
      >
        <Box sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Bộ lọc
            </Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <FilterSidebar />
        </Box>
      </Drawer>
    </Box>
  )
}

export default Products