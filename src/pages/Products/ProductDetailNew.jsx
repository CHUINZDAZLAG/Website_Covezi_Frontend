import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Divider,
  Stack,
  Paper,
  Card,
  CardContent
} from '@mui/material'
import {
  ShoppingCart,
  LocalShipping,
  Security,
  Nature,
  Recycling
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const ProductDetailNew = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching product detail for ID:', id)
      
      const response = await productAPI.getProductDetail(id)
      console.log('📦 Raw API Response:', response)
      console.log('📦 Response.data:', response?.data)
      console.log('📦 Response.product:', response?.product)
      
      if (response?.data || response?.product) {
        // Response might be wrapped in data or product field
        const productData = response.data || response.product || response
        console.log('✅ Product data extracted:', productData)
        console.log('🖼️ Images array:', productData?.images)
        console.log('🖼️ Images count:', productData?.images?.length)
        
        setProduct(productData)
      } else {
        console.warn('⚠️ No product data in response:', response)
        setProduct({
          _id: id,
          name: 'Sản phẩm không tìm thấy',
          images: ['/default-product.jpg'],
          socialLinks: {
            tiktok: 'https://tiktok.com/@covezi',
            shopee: 'https://shopee.vn/covezi',
            facebook: 'https://facebook.com/covezi'
          },
          description: 'Không tìm thấy thông tin sản phẩm',
          price: 0,
          discount: 0,
          features: [],
          ecoMetrics: { sustainabilityScore: 0 },
          specifications: {},
          warranty: { duration: 12 }
        })
      }
    } catch (error) {
      console.error('❌ Error fetching product detail:', error)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error response:', error.response)
      
      setProduct({
        _id: id,
        name: 'Lỗi tải sản phẩm',
        images: ['/default-product.jpg'],
        socialLinks: {
          tiktok: 'https://tiktok.com/@covezi',
          shopee: 'https://shopee.vn/covezi',
          facebook: 'https://facebook.com/covezi'
        },
        description: 'Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại.',
        price: 0,
        discount: 0,
        features: [],
        ecoMetrics: { sustainabilityScore: 0 },
        specifications: {},
        warranty: { duration: 12 }
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    console.log('Added to cart:', { productId: id })
    alert('Đã thêm sản phẩm vào giỏ hàng!')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getEcoScoreColor = (score) => {
    if (score >= 80) return '#4caf50'
    if (score >= 60) return '#ff9800'
    return '#f44336'
  }

  if (loading || !product) {
    return <PageLoadingSpinner />
  }

  const finalPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price

  if (loading || !product) {
    return <PageLoadingSpinner />
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          onClick={() => navigate('/products')}
          sx={{ mb: 3, color: '#32778E', fontWeight: 'bold' }}
        >
          ← Quay lại
        </Button>

        {/* Main Product Section - Simplified */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Images */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ position: 'relative', mb: 3 }}>
                {console.log('🎨 Rendering main image. Product images:', product.images, 'Selected index:', selectedImage)}
                <img
                  src={product.images[selectedImage] || '/default-product.jpg'}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', e.target.src)
                    e.target.src = '/default-product.jpg'
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', product.images[selectedImage])
                  }}
                />
                
                {/* Eco Badge */}
                <Chip
                  icon={<Nature />}
                  label={`Eco Score ${product.ecoMetrics?.sustainabilityScore}%`}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    bgcolor: getEcoScoreColor(product.ecoMetrics?.sustainabilityScore),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <Chip
                    label={`-${product.discount}%`}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: '#FF6B7A',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      width: '50px',
                      height: '50px'
                    }}
                  />
                )}
              </Box>

              {/* Thumbnail Images */}
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      minWidth: '70px',
                      height: '70px',
                      border: selectedImage === index ? '3px solid #32778E' : '2px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Product Info - Simplified */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#32778E',
                  mb: 3,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                {product.name}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Social Media Links - Circular Buttons */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E', mb: 2 }}>
                  Kết nối với chúng tôi
                </Typography>
                <Stack direction="row" spacing={2}>
                  {/* TikTok */}
                  <IconButton
                    href={product.socialLinks?.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#000000',
                      color: 'white',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    ♪
                  </IconButton>

                  {/* Shopee */}
                  <IconButton
                    href={product.socialLinks?.shopee}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#EE4D2D',
                      color: 'white',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(238, 77, 45, 0.3)'
                      }
                    }}
                  >
                    🛍
                  </IconButton>

                  {/* Facebook */}
                  <IconButton
                    href={product.socialLinks?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#1877F2',
                      color: 'white',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)'
                      }
                    }}
                  >
                    📘
                  </IconButton>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Price */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#32778E',
                      fontWeight: 'bold',
                      fontSize: '2rem'
                    }}
                  >
                    {formatCurrency(finalPrice)}
                  </Typography>
                  {product.discount > 0 && (
                    <Typography
                      sx={{
                        color: '#999',
                        textDecoration: 'line-through',
                        fontSize: '1.1rem'
                      }}
                    >
                      {formatCurrency(product.price)}
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <IconButton
                  onClick={addToCart}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#32778E',
                    color: 'white',
                    fontSize: '1.8rem',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#1f4d63',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <ShoppingCart />
                </IconButton>
              </Stack>

              {/* Info Cards */}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                    <LocalShipping sx={{ color: '#4caf50', mb: 1, fontSize: '2rem' }} />
                    <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Miễn phí vận chuyển</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(50, 119, 142, 0.1)' }}>
                    <Security sx={{ color: '#32778E', mb: 1, fontSize: '2rem' }} />
                    <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Bảo hành 12 tháng</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                    <Recycling sx={{ color: '#4caf50', mb: 1, fontSize: '2rem' }} />
                    <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Tái chế được</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Detailed Info Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#32778E',
              mb: 3,
              fontSize: '1.8rem'
            }}
          >
            Thông tin chi tiết
          </Typography>

          <Grid container spacing={3}>
            {/* Specifications */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E', mb: 2 }}>
                    📋 Thông số kỹ thuật
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={1.5}>
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid #eee' }}>
                        <Typography sx={{ color: '#666', fontWeight: 500 }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                        <Typography sx={{ color: '#32778E', fontWeight: 'bold' }}>{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Eco Metrics */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
                    🌱 Chỉ số Eco-Friendly
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: '#666', fontWeight: 500 }}>Điểm bền vững:</Typography>
                        <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>{product.ecoMetrics?.sustainabilityScore}%</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>✓ Phân hủy sinh học</Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>✓ Tái chế được 100%</Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>✓ Hiệu suất năng lượng: A+</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Description Section */}
        <Box sx={{ mb: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E', mb: 2 }}>
                📝 Mô tả sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography sx={{ color: '#555', lineHeight: 1.8, textAlign: 'justify' }}>
                {product.description}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E', mb: 2 }}>
                🎁 Tính năng chính
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                {product.features?.map((feature, idx) => (
                  <Typography key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                    <Box sx={{ mr: 2, color: '#32778E', fontWeight: 'bold' }}>→</Box>
                    {feature}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default ProductDetailNew
