import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Rating,
  IconButton,
  Divider,
  Paper,
  Stack,
  Badge,
  Avatar,
  LinearProgress,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ZoomIn,
  LocalShipping,
  Security,
  Assignment,
  Nature,
  Recycling,
  Star,
  ExpandMore,
  Add,
  Remove,
  NavigateNext,
  Verified,
  LocalOffer
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState('description')

  useEffect(() => {
    if (id) {
      fetchProductDetail()
      fetchProductReviews()
      fetchRelatedProducts()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      
      // Mock product data
      const mockProduct = {
        _id: id,
        name: 'Túi vải tái chế cao cấp',
        description: 'Túi vải được làm từ chất liệu tái chế 100%, thân thiện với môi trường. Thiết kế hiện đại, bền đẹp và tiện dụng cho mọi hoạt động hàng ngày.',
        price: 150000,
        discount: 10,
        quantity: 25,
        sold: 120,
        rating: 4.5,
        reviewCount: 45,
        images: [
          '/eco-bag.jpg',
          '/eco-bag-2.jpg',
          '/eco-bag-3.jpg'
        ],
        features: [
          'Chất liệu 100% tái chế',
          'Kháng nước nhẹ',
          'Có thể giặt máy',
          'Thiết kế gấp gọn',
          'Tay cầm chắc chắn'
        ],
        ecoMetrics: {
          overallRating: 4.5,
          sustainabilityScore: 85,
          carbonFootprint: 2.5,
          recyclable: true,
          biodegradable: false,
          waterUsage: 15,
          energyEfficiency: 'A+'
        },
        shipping: {
          freeShipping: true,
          fee: 0
        },
        warranty: {
          duration: 12
        },
        returnPolicy: {
          duration: 7
        }
      }
      
      setProduct(mockProduct)
    } catch (error) {
      console.error('Error fetching product detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductReviews = async () => {
    try {
      // Mock reviews
      const mockReviews = [
        {
          _id: '1',
          customerName: 'Nguyễn Văn A',
          rating: 5,
          comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi!'
        },
        {
          _id: '2',
          customerName: 'Trần Thị B',
          rating: 4,
          comment: 'Túi đẹp và bền, phù hợp cho việc đi chợ.'
        }
      ]
      setReviews(mockReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      // Mock related products
      const mockRelatedProducts = [
        {
          _id: '2',
          name: 'Cốc giữ nhiệt tre',
          price: 120000,
          images: ['/bamboo-cup.jpg']
        },
        {
          _id: '3',
          name: 'Hộp cơm tre tự nhiên',
          price: 200000,
          images: ['/bamboo-lunchbox.jpg']
        }
      ]
      setRelatedProducts(mockRelatedProducts)
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < product.quantity) {
      setQuantity(quantity + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const addToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { productId: id, quantity })
    alert('Đã thêm sản phẩm vào giỏ hàng!')
  }

  const toggleFavorite = () => {
    setFavorite(!favorite)
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false)
  }

  const getEcoScoreColor = (score) => {
    if (score >= 80) return '#4caf50'
    if (score >= 60) return '#ff9800'
    return '#f44336'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading || !product) {
    return <PageLoadingSpinner />
  }

  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Trang chủ
          </Link>
          <Link color="inherit" onClick={() => navigate('/products')} sx={{ cursor: 'pointer' }}>
            Sản phẩm
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img
                  src={product.images[selectedImage] || '/default-product.jpg'}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.src = '/default-product.jpg'
                  }}
                />
                <IconButton
                  onClick={() => setOpenImageDialog(true)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.9)'
                  }}
                >
                  <ZoomIn />
                </IconButton>
                
                {/* Eco Rating Badge */}
                <Chip
                  icon={<Nature />}
                  label={`Eco ${product.ecoMetrics?.overallRating?.toFixed(1) || '4.0'}`}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: getEcoScoreColor(product.ecoMetrics?.overallRating * 20 || 80),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              {/* Thumbnail Images */}
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      minWidth: '80px',
                      height: '80px',
                      border: selectedImage === index ? 2 : 1,
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = '/default-product.jpg'
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Product Title and Rating */}
              <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating || 4.5} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewCount || 0} đánh giá)
                </Typography>
                <Chip
                  label={`Đã bán: ${product.sold || 0}`}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                {product.discount > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {formatCurrency(finalPrice)}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      {formatCurrency(product.price)}
                    </Typography>
                    <Chip
                      icon={<LocalOffer />}
                      label={`-${product.discount}%`}
                      color="error"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                ) : (
                  <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                )}
              </Box>

              {/* Eco Features */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e8' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Nature sx={{ mr: 1, color: '#4caf50' }} />
                  Đặc điểm xanh
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<Verified />}
                    label={`Bền vững: ${product.ecoMetrics?.sustainabilityScore || 85}%`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Nature />}
                    label={`Carbon: ${product.ecoMetrics?.carbonFootprint || 45}kg CO2`}
                    color="primary"
                    variant="outlined"
                  />
                  {product.ecoMetrics?.recyclable && (
                    <Chip
                      icon={<Recycling />}
                      label="Có thể tái chế"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {product.ecoMetrics?.biodegradable && (
                    <Chip
                      icon={<Nature />}
                      label="Phân hủy sinh học"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Paper>

              {/* Quantity and Actions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Số lượng:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                    <IconButton onClick={() => handleQuantityChange('decrease')} disabled={quantity <= 1}>
                      <Remove />
                    </IconButton>
                    <Typography sx={{ px: 2, minWidth: '40px', textAlign: 'center' }}>
                      {quantity}
                    </Typography>
                    <IconButton onClick={() => handleQuantityChange('increase')} disabled={quantity >= product.quantity}>
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Còn lại: {product.quantity}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={addToCart}
                  disabled={product.quantity === 0}
                  sx={{ flex: 1 }}
                >
                  {product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </Button>
                <IconButton
                  onClick={toggleFavorite}
                  sx={{ border: '1px solid #ddd' }}
                >
                  {favorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <IconButton sx={{ border: '1px solid #ddd' }}>
                  <Share />
                </IconButton>
              </Box>

              {/* Shipping Info */}
              <Paper sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShipping sx={{ mr: 1, color: '#4caf50' }} />
                    <Typography variant="body2">
                      {product.shipping?.freeShipping 
                        ? 'Miễn phí vận chuyển' 
                        : `Phí vận chuyển: ${formatCurrency(product.shipping?.fee || 30000)}`
                      }
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1, color: '#4caf50' }} />
                    <Typography variant="body2">
                      Bảo hành {product.warranty?.duration || 12} tháng
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Assignment sx={{ mr: 1, color: '#4caf50' }} />
                    <Typography variant="body2">
                      Đổi trả trong {product.returnPolicy?.duration || 7} ngày
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Accordions */}
        <Box sx={{ mt: 6 }}>
          <Accordion
            expanded={expandedAccordion === 'description'}
            onChange={handleAccordionChange('description')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Mô tả sản phẩm</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </Typography>
              {product.features && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Tính năng nổi bật:</Typography>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <Typography>{feature}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordion === 'eco'}
            onChange={handleAccordionChange('eco')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">Chỉ số môi trường</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Điểm bền vững
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={product.ecoMetrics?.sustainabilityScore || 85}
                      sx={{ flex: 1, mr: 2, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body1" fontWeight="bold">
                      {product.ecoMetrics?.sustainabilityScore || 85}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Dấu chân carbon
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {product.ecoMetrics?.carbonFootprint || 45} kg CO2
                  </Typography>
                </Grid>
                {product.ecoMetrics?.waterUsage && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Sử dụng nước
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {product.ecoMetrics.waterUsage} lít
                    </Typography>
                  </Grid>
                )}
                {product.ecoMetrics?.energyEfficiency && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Hiệu quả năng lượng
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {product.ecoMetrics.energyEfficiency}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedAccordion === 'reviews'}
            onChange={handleAccordionChange('reviews')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" fontWeight="bold">
                Đánh giá ({reviews.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {reviews.length > 0 ? (
                <Stack spacing={3}>
                  {reviews.slice(0, 5).map((review, index) => (
                    <Paper key={index} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: '#4caf50' }}>
                          {review.customerName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.customerName}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography>Chưa có đánh giá nào.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
              Sản phẩm liên quan
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={relatedProduct.images[0] || '/default-product.jpg'}
                      alt={relatedProduct.name}
                      onError={(e) => {
                        e.target.src = '/default-product.jpg'
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatCurrency(relatedProduct.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Image Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={() => setOpenImageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
        <DialogContent>
          <img
            src={product.images[selectedImage] || '/default-product.jpg'}
            alt={product.name}
            style={{ width: '100%', height: 'auto' }}
            onError={(e) => {
              e.target.src = '/default-product.jpg'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductDetail