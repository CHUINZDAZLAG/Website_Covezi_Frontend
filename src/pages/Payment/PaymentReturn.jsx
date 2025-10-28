import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Receipt,
  Home,
  ShoppingBag
} from '@mui/icons-material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const PaymentReturn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentResult, setPaymentResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    verifyPayment()
  }, [searchParams])

  const verifyPayment = async () => {
    try {
      setLoading(true)
      
      // Get payment parameters from URL
      const paymentId = searchParams.get('paymentId')
      const status = searchParams.get('status')
      const orderId = searchParams.get('orderId')
      
      // Mock payment verification
      setTimeout(() => {
        const isSuccess = status === 'success' || Math.random() > 0.2 // 80% success rate for demo
        
        setPaymentResult({
          success: isSuccess,
          paymentId: paymentId || 'PAY_' + Date.now(),
          orderId: orderId || 'ECO2024001',
          amount: 425000,
          method: 'Thẻ tín dụng',
          timestamp: new Date().toISOString()
        })
        
        if (isSuccess) {
          setOrderInfo({
            orderNumber: orderId || 'ECO2024001',
            totalAmount: 425000,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          })
        }
        
        setLoading(false)
      }, 2000)
      
    } catch (error) {
      console.error('Error verifying payment:', error)
      setPaymentResult({
        success: false,
        error: 'Có lỗi xảy ra khi xác thực thanh toán'
      })
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        <AppBar />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Đang xử lý thanh toán...
            </Typography>
            <Typography color="text.secondary">
              Vui lòng đợi trong giây lát, đừng đóng trang này
            </Typography>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {paymentResult?.success ? (
            <>
              {/* Success State */}
              <CheckCircle 
                sx={{ 
                  fontSize: 80, 
                  color: 'success.main', 
                  mb: 3 
                }} 
              />
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Thanh toán thành công!
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
              </Typography>

              {/* Payment Details */}
              <Card variant="outlined" sx={{ mb: 4, textAlign: 'left' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Chi tiết thanh toán
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Mã giao dịch
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {paymentResult.paymentId}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Mã đơn hàng
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {paymentResult.orderId}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Số tiền
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {formatCurrency(paymentResult.amount)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phương thức
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {paymentResult.method}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Info */}
              {orderInfo && (
                <Alert severity="info" sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Đơn hàng #{orderInfo.orderNumber}</strong> sẽ được giao vào ngày{' '}
                    <strong>{formatDate(orderInfo.estimatedDelivery)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Chúng tôi sẽ gửi email xác nhận và cập nhật trạng thái giao hàng.
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<Receipt />}
                  onClick={() => navigate(`/orders/${paymentResult.orderId}`)}
                  size="large"
                >
                  Xem đơn hàng
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBag />}
                  onClick={() => navigate('/products')}
                  size="large"
                >
                  Tiếp tục mua sắm
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Về trang chủ
                </Button>
              </Stack>
            </>
          ) : (
            <>
              {/* Failure State */}
              <Error 
                sx={{ 
                  fontSize: 80, 
                  color: 'error.main', 
                  mb: 3 
                }} 
              />
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                Thanh toán không thành công
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                {paymentResult?.error || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
              </Typography>

              <Alert severity="error" sx={{ mb: 4 }}>
                <Typography variant="body1">
                  <strong>Nguyên nhân có thể:</strong>
                </Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Thông tin thẻ không chính xác</li>
                  <li>Không đủ số dư trong tài khoản</li>
                  <li>Thẻ đã hết hạn hoặc bị khóa</li>
                  <li>Kết nối mạng không ổn định</li>
                </ul>
              </Alert>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => navigate('/checkout')}
                  size="large"
                >
                  Thử lại thanh toán
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBag />}
                  onClick={() => navigate('/cart')}
                  size="large"
                >
                  Quay lại giỏ hàng
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Về trang chủ
                </Button>
              </Stack>
            </>
          )}

          <Divider sx={{ my: 4 }} />
          
          {/* Support */}
          <Typography variant="body2" color="text.secondary">
            Cần hỗ trợ? Liên hệ{' '}
            <Button 
              variant="text" 
              size="small"
              onClick={() => window.open('mailto:support@covezi.com')}
            >
              support@covezi.com
            </Button>
            {' '}hoặc hotline 1900-xxxx
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default PaymentReturn