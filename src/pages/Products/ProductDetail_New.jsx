import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Box,
  Chip,
  Rating,
  IconButton,
  Divider,
  Paper,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress
} from '@mui/material'
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Nature,
  LocalShipping,
  Verified,
  Add,
  Remove,
  NavigateNext,
  OpenInNew,
  Info
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

// Icons for external shops
const ShopeeIcon = () => (
  <Box
    sx={{
      width: 20,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#EE4D2D',
      borderRadius: '50%',
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold'
    }}
  >
    S
  </Box>
)

const TikTokIcon = () => (
  <Box
    sx={{
      width: 20,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      borderRadius: '2px',
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold'
    }}
  >
    TT
  </Box>
)

const FacebookIcon = () => (
  <Box
    sx={{
      width: 20,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1877F2',
      borderRadius: '2px',
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold'
    }}
  >
    f
  </Box>
)

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (id) {
      fetchProductDetail()
      fetchRelatedProducts()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProductDetail(id)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product detail:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await productAPI.getRelatedProducts(id)
      setRelatedProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleQuantityChange = (action) => {
    if (action === 'increase' && product && quantity < product.quantity) {
      setQuantity(quantity + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const toggleFavorite = () => {
    setFavorite(!favorite)
  }

  const handleShopClick = (url, shopName) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return <PageLoadingSpinner />
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        <AppBar />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Sản phẩm không tìm thấy
          </Typography>
          <Button onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            Quay lại danh sách sản phẩm
          </Button>
        </Container>
      </Box>
    )
  }

  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 4 }}
        >
          <MuiLink
            color="inherit"
            href="/products"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Sản phẩm
          </MuiLink>
          <Typography color="textPrimary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Main Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Product Images */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Main Image */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    product.images?.[selectedImage] ||
                    product.cover ||
                    '/Covezi-Product.png'
                  }
                  alt={product.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    p: 2
                  }}
                />
              </Box>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 0 && (
                <Stack direction="row" spacing={1}>
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid #4caf50' : '2px solid transparent',
                        transition: 'all 0.3s',
                        '&:hover': { borderColor: '#4caf50' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`${product.name}-${index}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={7}>
            {/* Product Name & Rating */}
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={product.rating || 4.5} precision={0.1} readOnly />
                <Typography variant="body2" color="textSecondary">
                  {product.reviewCount || 0} đánh giá
                </Typography>
              </Box>
              <Chip
                label={product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                size="small"
                sx={{
                  background: product.quantity > 0 ? '#e8f5e9' : '#ffebee',
                  color: product.quantity > 0 ? '#2e7d32' : '#c62828',
                  fontWeight: 600
                }}
              />
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 3, color: '#666', lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {/* Eco Metrics */}
            {product.ecoScore && (
              <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f0f7f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Nature sx={{ color: '#4caf50' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Chỉ số sinh thái
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Điểm xanh: {product.ecoScore}/100
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `conic-gradient(#4caf50 ${product.ecoScore}%, #e0e0e0 0%)`,
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#4caf50'
                      }}
                    >
                      {product.ecoScore}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Price Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Giá
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {discountedPrice.toLocaleString()}đ
                </Typography>
                {product.discount > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: '#aaa'
                      }}
                    >
                      {product.price.toLocaleString()}đ
                    </Typography>
                    <Chip
                      label={`-${product.discount}%`}
                      size="small"
                      sx={{
                        background: '#ff4444',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Quantity Section */}
            {product.quantity > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Số lượng:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 1
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('decrease')}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ mx: 2, fontWeight: 600, minWidth: 30, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange('increase')}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* External Shop Links */}
            {product.links && (
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fafafa' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  🛍️ Mua hàng trên các nền tảng bên ngoài
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {product.links.shopee && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShopeeIcon />}
                      endIcon={<OpenInNew fontSize="small" />}
                      onClick={() => handleShopClick(product.links.shopee, 'Shopee')}
                      sx={{
                        background: '#EE4D2D',
                        '&:hover': { background: '#D23E1F' }
                      }}
                    >
                      Mua trên Shopee
                    </Button>
                  )}
                  {product.links.tiktok && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<TikTokIcon />}
                      endIcon={<OpenInNew fontSize="small" />}
                      onClick={() => handleShopClick(product.links.tiktok, 'TikTok')}
                      sx={{
                        background: '#000',
                        '&:hover': { background: '#333' }
                      }}
                    >
                      Mua trên TikTok Shop
                    </Button>
                  )}
                  {product.links.facebook && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<FacebookIcon />}
                      endIcon={<OpenInNew fontSize="small" />}
                      onClick={() => handleShopClick(product.links.facebook, 'Facebook')}
                      sx={{
                        background: '#1877F2',
                        '&:hover': { background: '#0a66c2' }
                      }}
                    >
                      Mua trên Facebook
                    </Button>
                  )}
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, p: 1, backgroundColor: '#fff3cd', borderRadius: 1 }}>
                  <Info fontSize="small" sx={{ color: '#856404' }} />
                  <Typography variant="caption" sx={{ color: '#856404' }}>
                    Nhấp vào để truy cập cửa hàng chính thức của Covezi trên các nền tảng
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.quantity === 0}
                sx={{
                  flex: 1,
                  background: product.quantity > 0 ? 'linear-gradient(135deg, #4caf50, #2e7d32)' : '#ccc',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {product.quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
              </Button>
              <IconButton
                variant="outlined"
                size="large"
                onClick={toggleFavorite}
                sx={{
                  borderColor: '#ddd',
                  border: '1px solid #ddd'
                }}
              >
                {favorite ? (
                  <Favorite sx={{ color: '#f44336' }} />
                ) : (
                  <FavoriteBorder sx={{ color: '#666' }} />
                )}
              </IconButton>
            </Stack>

            {/* Shipping Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <LocalShipping sx={{ color: '#4caf50' }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                Miễn phí vận chuyển cho đơn hàng từ 50.000đ
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Sản phẩm liên quan
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                  <Card
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'translateY(-8px)' }
                    }}
                  >
                    <Box sx={{ paddingTop: '100%', position: 'relative', backgroundColor: '#f5f5f5' }}>
                      <CardMedia
                        component="img"
                        image={relatedProduct.images?.[0] || '/Covezi-Product.png'}
                        alt={relatedProduct.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 1
                        }}
                      />
                    </Box>
                  </Card>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                    {relatedProduct.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {relatedProduct.price.toLocaleString()}đ
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default ProductDetail
