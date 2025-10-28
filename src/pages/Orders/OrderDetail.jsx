import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material'
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Inventory,
  Support,
  Star,
  Download,
  Print,
  Share
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      
      // Mock order data
      const mockOrder = {
        _id: orderId,
        orderNumber: 'ECO2024001',
        status: 'delivered',
        totalAmount: 450000,
        shippingFee: 25000,
        discount: 50000,
        finalAmount: 425000,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryDate: '2024-01-18T14:30:00Z',
        estimatedDelivery: '2024-01-20T23:59:59Z',
        shippingAddress: {
          name: 'Nguyễn Văn An',
          phone: '0123456789',
          address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
          note: 'Giao trong giờ hành chính'
        },
        products: [
          {
            _id: '1',
            name: 'Túi vải tái chế cao cấp',
            image: '/eco-bag.jpg',
            price: 150000,
            quantity: 2,
            discount: 10,
            ecoMetrics: { overallRating: 4.5 },
            reviewed: false
          },
          {
            _id: '2',
            name: 'Cốc giữ nhiệt tre tự nhiên',
            image: '/bamboo-cup.jpg',
            price: 120000,
            quantity: 1,
            discount: 0,
            ecoMetrics: { overallRating: 4.8 },
            reviewed: true
          }
        ],
        timeline: [
          {
            status: 'ordered',
            title: 'Đặt hàng thành công',
            description: 'Đơn hàng của bạn đã được xác nhận',
            timestamp: '2024-01-15T10:30:00Z',
            completed: true
          },
          {
            status: 'confirmed',
            title: 'Xác nhận đơn hàng',
            description: 'Người bán đã xác nhận đơn hàng',
            timestamp: '2024-01-15T11:00:00Z',
            completed: true
          },
          {
            status: 'processing',
            title: 'Đang chuẩn bị hàng',
            description: 'Đơn hàng đang được đóng gói',
            timestamp: '2024-01-16T09:00:00Z',
            completed: true
          },
          {
            status: 'shipped',
            title: 'Đã giao cho vận chuyển',
            description: 'Đơn hàng đang trên đường giao đến bạn',
            timestamp: '2024-01-17T08:30:00Z',
            completed: true
          },
          {
            status: 'delivered',
            title: 'Giao hàng thành công',
            description: 'Đơn hàng đã được giao thành công',
            timestamp: '2024-01-18T14:30:00Z',
            completed: true
          }
        ]
      }
      
      setOrder(mockOrder)
    } catch (error) {
      console.error('Error fetching order detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'shipped': 'secondary',
      'delivered': 'success',
      'cancelled': 'error'
    }
    return statusColors[status] || 'default'
  }

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang chuẩn bị',
      'shipped': 'Đang vận chuyển',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    }
    return statusTexts[status] || status
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleReviewProduct = (product) => {
    setSelectedProduct(product)
    setReviewDialog(true)
  }

  const submitReview = async () => {
    try {
      console.log('Submit review:', {
        productId: selectedProduct._id,
        rating: reviewRating,
        comment: reviewComment
      })
      
      // Update product reviewed status
      setOrder(prevOrder => ({
        ...prevOrder,
        products: prevOrder.products.map(product =>
          product._id === selectedProduct._id
            ? { ...product, reviewed: true }
            : product
        )
      }))
      
      setReviewDialog(false)
      setReviewRating(5)
      setReviewComment('')
      alert('Cảm ơn bạn đã đánh giá sản phẩm!')
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  if (loading) {
    return <PageLoadingSpinner />
  }

  if (!order) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <AppBar />
        <Container sx={{ py: 4 }}>
          <Alert severity="error">
            Không tìm thấy đơn hàng
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
            sx={{ mb: 2 }}
          >
            Quay lại đơn hàng
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Chi tiết đơn hàng #{order.orderNumber}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton>
                <Download />
              </IconButton>
              <IconButton>
                <Print />
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </Box>
          </Box>
          
          <Chip
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
            size="large"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Order Timeline */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Trạng thái đơn hàng
              </Typography>
              
              <Stepper activeStep={order.timeline.length - 1} orientation="vertical">
                {order.timeline.map((item, index) => (
                  <Step key={index} completed={item.completed}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: item.completed ? 'success.main' : 'grey.300',
                            color: 'white'
                          }}
                        >
                          {item.status === 'shipped' && <LocalShipping />}
                          {item.status === 'delivered' && <CheckCircle />}
                          {item.status === 'processing' && <Inventory />}
                          {item.status === 'confirmed' && <Inventory />}
                        </Box>
                      )}
                    >
                      <Typography variant="h6">
                        {item.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.timestamp)}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Products */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Sản phẩm trong đơn hàng
              </Typography>
              
              <Stack spacing={2}>
                {order.products.map((product) => (
                  <Card key={product._id} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <CardMedia
                            component="img"
                            sx={{ width: 80, height: 80, borderRadius: 1 }}
                            image={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/default-product.jpg'
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs>
                          <Typography variant="h6">
                            {product.name}
                          </Typography>
                          <Typography color="text.secondary">
                            Số lượng: {product.quantity}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h6" color="primary">
                              {formatCurrency(product.price * (1 - product.discount / 100))}
                            </Typography>
                            {product.discount > 0 && (
                              <Typography
                                variant="body2"
                                sx={{ ml: 1, textDecoration: 'line-through' }}
                              >
                                {formatCurrency(product.price)}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        
                        <Grid item>
                          {order.status === 'delivered' && !product.reviewed && (
                            <Button
                              variant="outlined"
                              startIcon={<Star />}
                              onClick={() => handleReviewProduct(product)}
                            >
                              Đánh giá
                            </Button>
                          )}
                          {product.reviewed && (
                            <Chip
                              icon={<Star />}
                              label="Đã đánh giá"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Thông tin đơn hàng
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Mã đơn hàng:</Typography>
                  <Typography fontWeight="bold">{order.orderNumber}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Ngày đặt:</Typography>
                  <Typography>{formatDate(order.orderDate)}</Typography>
                </Box>
                
                {order.deliveryDate && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Ngày giao:</Typography>
                    <Typography>{formatDate(order.deliveryDate)}</Typography>
                  </Box>
                )}
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tổng tiền hàng:</Typography>
                  <Typography>{formatCurrency(order.totalAmount)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography>{formatCurrency(order.shippingFee)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Giảm giá:</Typography>
                  <Typography color="error">
                    -{formatCurrency(order.discount)}
                  </Typography>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Tổng thanh toán:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(order.finalAmount)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Shipping Address */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Địa chỉ giao hàng
              </Typography>
              
              <Stack spacing={1}>
                <Typography fontWeight="bold">
                  {order.shippingAddress.name}
                </Typography>
                <Typography>
                  {order.shippingAddress.phone}
                </Typography>
                <Typography>
                  {order.shippingAddress.address}
                </Typography>
                {order.shippingAddress.note && (
                  <Typography color="text.secondary">
                    Ghi chú: {order.shippingAddress.note}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Support */}
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Cần hỗ trợ?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng
          </Typography>
          <Button variant="outlined" startIcon={<Support />}>
            Liên hệ hỗ trợ
          </Button>
        </Paper>
      </Container>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Đánh giá sản phẩm
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedProduct.image}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Typography variant="h6">
                  {selectedProduct.name}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Đánh giá của bạn
              </Typography>
              <Rating
                size="large"
                value={reviewRating}
                onChange={(event, newValue) => setReviewRating(newValue)}
                sx={{ mb: 3 }}
              />
              
              <TextField
                label="Nhận xét (tùy chọn)"
                multiline
                rows={4}
                fullWidth
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>
            Hủy
          </Button>
          <Button variant="contained" onClick={submitReview}>
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderDetail