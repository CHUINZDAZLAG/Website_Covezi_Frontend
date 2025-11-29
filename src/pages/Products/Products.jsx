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
  Checkbox,
  FormControlLabel,
  Divider,
  Collapse
} from '@mui/material'
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  Sort,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Nature,
  Star,
  LocalOffer,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [ecoFilter, setEcoFilter] = useState(false)
  const [onSaleFilter, setOnSaleFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState(new Set())

  const categories = [
    'Tất cả',
    'Túi và balo',
    'Đồ dùng gia đình',
    'Mỹ phẩm tự nhiên',
    'Thời trang bền vững',
    'Đồ dùng văn phòng',
    'Đồ ăn hữu cơ'
  ]

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Fetch real products from API
      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.append('search', searchQuery)
      if (category) queryParams.append('category', category)
      queryParams.append('page', currentPage)
      queryParams.append('limit', 12)
      if (sortBy) queryParams.append('sort', sortBy)

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
  }, [searchQuery, category, sortBy, currentPage, ecoFilter, onSaleFilter, priceRange])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue)
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

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      {/* Header - Search Bar with Background Image */}
      <Box
        sx={{
          backgroundImage: 'url(/src/assets/Covezi_Product_Cover.png), linear-gradient(135deg, rgba(76, 175, 80, 0.65) 0%, rgba(46, 125, 50, 0.65) 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: { xs: 4, md: 5 },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          {/* Search Bar Only */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm của Covezi"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                backgroundColor: 'white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#999', mr: 1 }} />
                </InputAdornment>
              )
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Products Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ✨ Tìm thấy <strong style={{ color: '#4caf50' }}>{products.length}</strong> sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category ? `Danh mục: ${category}` : 'Tất cả danh mục'}
          </Typography>
        </Box>

        {/* Products Grid/List */}
        <Grid container spacing={3}>
          {products.map((product) => {
            const finalPrice = getFinalPrice(product)

            return (
              <Grid
                item
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                md={viewMode === 'grid' ? 4 : 12}
                lg={viewMode === 'grid' ? 3 : 12}
                key={product._id}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: viewMode === 'grid' ? 'column' : 'row',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                    },
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    background: 'white'
                  }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Product Image */}
                  <Box sx={{ position: 'relative', width: viewMode === 'grid' ? '100%' : 200, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                    {/* Gradient Background */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${['#FFB6C1', '#FFB6E1', '#FFC0CB', '#FFD1DC'][Math.floor(Math.random() * 4)]} 0%, ${['#FFE4E1', '#FFF0F5', '#FFE4F2', '#FFEBF5'][Math.floor(Math.random() * 4)]} 100%)`,
                        zIndex: 0
                      }}
                    />
                    
                    <CardMedia
                      component="img"
                      height={viewMode === 'grid' ? 200 : 150}
                      image={product.images[0] || '/default-product.svg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/default-product.svg'
                      }}
                      sx={{ position: 'relative', zIndex: 1, objectFit: 'contain' }}
                    />
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <Chip
                        icon={<LocalOffer />}
                        label={`-${product.discount}%`}
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    
                    {/* Eco Badge */}
                    <Chip
                      icon={<Nature />}
                      label={`${product.ecoMetrics?.overallRating?.toFixed(1) || '4.0'}`}
                      color="success"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 'bold'
                      }}
                    />
                    
                    {/* Favorite Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(product._id)
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      {favorites.has(product._id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </Box>
                  
                  {/* Product Info */}
                  <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2,
                        fontWeight: 600,
                        color: '#333'
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    {/* Category */}
                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1, width: 'fit-content', fontSize: '0.75rem' }}
                    />
                    
                    {/* Price - Large and Bold */}
                    <Box sx={{ mb: 1, flex: 1 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                        Giá: {formatCurrency(finalPrice)}
                      </Typography>
                      {product.discount > 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Rating and Sales */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 0.5 }}>
                      <Rating
                        value={product.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        ({product.sold} đã bán)
                      </Typography>
                    </Box>
                    
                    {/* Add to Cart Button - Pink/Magenta */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      fullWidth
                      sx={{ 
                        mt: 'auto',
                        background: 'linear-gradient(135deg, #d946a6 0%, #c71585 100%)',
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #c71585 0%, #b80570 100%)'
                        }
                      }}
                    >
                      Mua ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* No products found */}
        {products.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Không tìm thấy sản phẩm nào
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Products