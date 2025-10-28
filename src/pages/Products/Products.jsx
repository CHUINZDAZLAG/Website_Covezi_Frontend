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
      
      {/* Header */}
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
        {/* Search and Filter Bar */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
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
            
            {/* Category Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={category}
                  label="Danh mục"
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat === 'Tất cả' ? '' : cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Sort */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* View Mode and Filters */}
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridView />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? 'primary' : 'default'}
                >
                  <FilterList />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          
          {/* Advanced Filters */}
          <Collapse in={showFilters}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {/* Price Range */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Khoảng giá
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000000}
                  step={10000}
                  valueLabelFormat={(value) => formatCurrency(value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">
                    {formatCurrency(priceRange[0])}
                  </Typography>
                  <Typography variant="caption">
                    {formatCurrency(priceRange[1])}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Special Filters */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Bộ lọc đặc biệt
                </Typography>
                <Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ecoFilter}
                        onChange={(e) => setEcoFilter(e.target.checked)}
                      />
                    }
                    label="Sản phẩm xanh"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={onSaleFilter}
                        onChange={(e) => setOnSaleFilter(e.target.checked)}
                      />
                    }
                    label="Đang giảm giá"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>

        {/* Products Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Tìm thấy {products.length} sản phẩm
          </Typography>
          <Button
            startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
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
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Product Image */}
                  <Box sx={{ position: 'relative', width: viewMode === 'grid' ? '100%' : 200 }}>
                    <CardMedia
                      component="img"
                      height={viewMode === 'grid' ? 200 : 150}
                      image={product.images[0] || '/default-product.svg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/default-product.svg'
                      }}
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
                  <CardContent sx={{ flex: 1, p: 2 }}>
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
                        lineHeight: 1.2
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {product.description}
                    </Typography>
                    
                    {/* Category */}
                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    
                    {/* Rating and Sales */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        value={product.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.sold} đã bán)
                      </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {formatCurrency(finalPrice)}
                        </Typography>
                        {product.discount > 0 && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary'
                            }}
                          >
                            {formatCurrency(product.price)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Thêm vào giỏ
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