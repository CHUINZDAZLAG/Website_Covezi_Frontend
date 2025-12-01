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
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material'
import {
  ShoppingCart,
  LocalShipping,
  Security,
  Nature,
  Recycling,
  ExpandMore,
  NavigateNext,
  ArrowBack,
  Download
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
      
      // Mock product data
      const mockProduct = {
        _id: id,
        name: 'COVEZI - Bộ Màu Nước "Tùm Lum Màu" Sáng Tạo Vô Hạn',
        description: 'Bộ 12 màu sơn nước Covezi được thiết kế đặc biệt cho những người yêu thích sáng tạo. Sản phẩm được làm từ nguyên liệu thân thiện với môi trường, không độc hại cho người sử dụng.',
        price: 728000,
        discount: 20,
        quantity: 150,
        sold: 320,
        rating: 4.5,
        reviewCount: 89,
        images: [
          '/eco-product-1.jpg',
          '/eco-product-2.jpg',
          '/eco-product-3.jpg'
        ],
        features: [
          'Nguyên liệu tự nhiên 100%',
          'Không độc hại',
          'Bền lâu',
          'Màu sắc tươi sáng',
          'Dễ sử dụng'
        ],
        ecoMetrics: {
          overallRating: 4.5,
          sustainabilityScore: 92,
          carbonFootprint: 1.2,
          recyclable: true,
          biodegradable: true,
          waterUsage: 8,
          energyEfficiency: 'A+'
        },
        specifications: {
          material: 'Nguyên liệu tự nhiên',
          weight: '250g',
          dimensions: '15 x 10 x 3 cm',
          colors: 12,
          shelfLife: '24 tháng'
        },
        shipping: {
          freeShipping: true,
          fee: 0,
          estimatedDays: '2-3 ngày'
        },
        warranty: {
          duration: 12,
          description: 'Bảo hành 12 tháng từ ngày mua'
        },
        benefits: [
          'Hỗ trợ phát triển sáng tạo',
          'An toàn cho trẻ em',
          'Không gây dị ứng da',
          'Giúp giảm căng thẳng'
        ],
        relatedProducts: [
          { _id: '2', name: 'Bộ Bút Chì Eco-Friendly', price: 150000, image: '/eco-pencil.jpg' },
          { _id: '3', name: 'Giấy Vẽ Tái Chế', price: 85000, image: '/eco-paper.jpg' },
          { _id: '4', name: 'Pallet Gỗ Tự Nhiên', price: 120000, image: '/eco-palette.jpg' }
        ]
      }
      
      setProduct(mockProduct)
    } catch (error) {
      console.error('Error fetching product detail:', error)
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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3, color: '#32778E', fontWeight: 'bold' }}
        >
          Quay lại
        </Button>

        {/* Main Product Section */}
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
                    e.target.src = '/default-product.jpg'
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

          {/* Product Info */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Title & Rating */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#32778E',
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                {product.name}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: '#FFB800', fontWeight: 'bold', mr: 1 }}>★★★★★</Typography>
                  <Typography sx={{ color: '#666' }}>({product.reviewCount} đánh giá)</Typography>
                </Box>
                <Chip label={`Đã bán ${product.sold}`} variant="outlined" />
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
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
                <Typography sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  ✓ Tặng voucher cho khách hàng mới
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Benefits */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E', mb: 2 }}>
                  🌿 Lợi ích sản phẩm
                </Typography>
                <Stack spacing={1}>
                  {product.benefits?.map((benefit, idx) => (
                    <Typography key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                      <Box sx={{ mr: 1, color: '#4caf50', fontWeight: 'bold' }}>✓</Box>
                      {benefit}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={addToCart}
                  sx={{
                    bgcolor: '#32778E',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    flex: 1,
                    '&:hover': { bgcolor: '#1f4d63', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#32778E',
                    color: '#32778E',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': { bgcolor: 'rgba(50, 119, 142, 0.1)' }
                  }}
                >
                  <Download sx={{ mr: 1 }} /> Tải Brochure
                </Button>
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
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E' }}>
                    📝 Mô tả sản phẩm
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: '#555', lineHeight: 1.8, textAlign: 'justify' }}>
                    {product.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#32778E' }}>
                    🎁 Tính năng chính
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {product.features?.map((feature, idx) => (
                      <Typography key={idx} sx={{ display: 'flex', alignItems: 'center', color: '#555' }}>
                        <Box sx={{ mr: 2, color: '#32778E', fontWeight: 'bold' }}>→</Box>
                        {feature}
                      </Typography>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Box>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#32778E',
                mb: 3,
                fontSize: '1.8rem'
              }}
            >
              Sản phẩm liên quan
            </Typography>

            <Grid container spacing={3}>
              {product.relatedProducts.map((relProduct, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      },
                      background: 'white'
                    }}
                    onClick={() => navigate(`/products/${relProduct._id}`)}
                  >
                    <Box sx={{ height: '200px', overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/default-product.jpg'
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography sx={{ fontWeight: 'bold', color: '#32778E', mb: 1, minHeight: '50px' }}>
                        {relProduct.name}
                      </Typography>
                      <Typography sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {formatCurrency(relProduct.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default ProductDetailNew
