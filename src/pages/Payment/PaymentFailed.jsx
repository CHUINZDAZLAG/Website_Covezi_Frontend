import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import {
  Error,
  Refresh,
  Home,
  ShoppingBag,
  Support,
  CreditCard,
  AccountBalance,
  ExpandMore
} from '@mui/icons-material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'

const PaymentFailed = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [errorInfo, setErrorInfo] = useState(null)

  useEffect(() => {
    // Get error information from URL parameters
    const errorCode = searchParams.get('errorCode')
    const message = searchParams.get('message')
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    
    setErrorInfo({
      code: errorCode || 'UNKNOWN_ERROR',
      message: message || 'Thanh toán không thành công',
      orderId: orderId || 'N/A',
      amount: amount ? parseInt(amount) : 0,
      timestamp: new Date().toISOString()
    })
  }, [searchParams])

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'INSUFFICIENT_FUNDS': 'Tài khoản không đủ số dư để thực hiện giao dịch',
      'INVALID_CARD': 'Thông tin thẻ không hợp lệ hoặc đã hết hạn',
      'CARD_DECLINED': 'Thẻ của bạn đã bị từ chối bởi ngân hàng',
      'NETWORK_ERROR': 'Lỗi kết nối mạng, vui lòng thử lại',
      'BANK_MAINTENANCE': 'Hệ thống ngân hàng đang bảo trì',
      'EXPIRED_SESSION': 'Phiên giao dịch đã hết hạn',
      'SECURITY_VIOLATION': 'Phát hiện hoạt động bất thường, giao dịch bị từ chối',
      'UNKNOWN_ERROR': 'Có lỗi không xác định xảy ra'
    }
    
    return errorMessages[errorCode] || errorMessages['UNKNOWN_ERROR']
  }

  const getSolution = (errorCode) => {
    const solutions = {
      'INSUFFICIENT_FUNDS': [
        'Kiểm tra số dư tài khoản',
        'Sử dụng thẻ khác có đủ số dư',
        'Chuyển tiền vào tài khoản trước khi thanh toán'
      ],
      'INVALID_CARD': [
        'Kiểm tra lại số thẻ, ngày hết hạn và mã CVV',
        'Đảm bảo thẻ chưa hết hạn',
        'Sử dụng thẻ khác đã được kích hoạt'
      ],
      'CARD_DECLINED': [
        'Liên hệ ngân hàng để kiểm tra tình trạng thẻ',
        'Đảm bảo thẻ đã được kích hoạt thanh toán online',
        'Thử lại với thẻ khác'
      ],
      'NETWORK_ERROR': [
        'Kiểm tra kết nối internet',
        'Thử lại sau vài phút',
        'Sử dụng mạng khác nếu có thể'
      ],
      'BANK_MAINTENANCE': [
        'Đợi ngân hàng hoàn tất bảo trì',
        'Sử dụng thẻ của ngân hàng khác',
        'Thử lại sau ít nhất 1 giờ'
      ],
      'EXPIRED_SESSION': [
        'Quay lại giỏ hàng và thực hiện lại thanh toán',
        'Đảm bảo hoàn tất thanh toán trong thời gian quy định',
        'Không để trang thanh toán mở quá lâu'
      ],
      'SECURITY_VIOLATION': [
        'Liên hệ ngân hàng để xác minh tài khoản',
        'Đảm bảo đang sử dụng thiết bị quen thuộc',
        'Thử lại sau 24h'
      ]
    }
    
    return solutions[errorCode] || solutions['UNKNOWN_ERROR'] || [
      'Thử lại với phương thức thanh toán khác',
      'Liên hệ hỗ trợ khách hàng để được giúp đỡ',
      'Kiểm tra lại thông tin thanh toán'
    ]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const paymentMethods = [
    {
      icon: <CreditCard />,
      title: 'Thẻ tín dụng/ghi nợ',
      description: 'Visa, Mastercard, JCB'
    },
    {
      icon: <AccountBalance />,
      title: 'Chuyển khoản ngân hàng',
      description: 'Tất cả ngân hàng trong nước'
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          {/* Error Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Error 
              sx={{ 
                fontSize: 80, 
                color: 'error.main', 
                mb: 3 
              }} 
            />
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              Thanh toán thất bại
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Rất tiếc, giao dịch của bạn không thể hoàn tất
            </Typography>
          </Box>

          {/* Error Details */}
          {errorInfo && (
            <Alert severity="error" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {getErrorMessage(errorInfo.code)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Mã lỗi: {errorInfo.code} | Thời gian: {new Date(errorInfo.timestamp).toLocaleString('vi-VN')}
              </Typography>
              {errorInfo.orderId !== 'N/A' && (
                <Typography variant="body2">
                  Mã đơn hàng: {errorInfo.orderId}
                  {errorInfo.amount > 0 && (
                    <span> | Số tiền: {formatCurrency(errorInfo.amount)}</span>
                  )}
                </Typography>
              )}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Solutions */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Cách khắc phục
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Các bước khắc phục được đề xuất:
                  </Typography>
                  
                  <ol style={{ paddingLeft: '20px', margin: 0 }}>
                    {getSolution(errorInfo?.code || 'UNKNOWN_ERROR').map((solution, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <Typography variant="body1">
                          {solution}
                        </Typography>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Câu hỏi thường gặp
              </Typography>
              
              <Stack spacing={1}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Tại sao thanh toán của tôi bị từ chối?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Thanh toán có thể bị từ chối vì nhiều lý do như không đủ số dư, 
                      thông tin thẻ không chính xác, thẻ hết hạn, hoặc ngân hàng đang bảo trì. 
                      Hãy kiểm tra lại thông tin và thử lại.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Có bị trừ tiền không khi thanh toán thất bại?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Không, khi thanh toán thất bại, số tiền sẽ không bị trừ khỏi tài khoản của bạn. 
                      Nếu thấy có giao dịch đã bị trừ, đó có thể là giao dịch tạm giữ và 
                      sẽ được hoàn lại trong 1-3 ngày làm việc.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Tôi có thể sử dụng phương thức thanh toán khác không?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Có, bạn có thể quay lại giỏ hàng và chọn phương thức thanh toán khác 
                      như chuyển khoản ngân hàng, ví điện tử, hoặc thanh toán khi nhận hàng.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Grid>

            {/* Alternative Payment Methods */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Phương thức thanh toán khác
              </Typography>
              
              <Stack spacing={2}>
                {paymentMethods.map((method, index) => (
                  <Card key={index} variant="outlined" sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {method.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {method.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Mẹo:</strong> Nếu thanh toán online gặp vấn đề, 
                  bạn có thể chọn "Thanh toán khi nhận hàng" để đảm bảo đơn hàng được xử lý.
                </Typography>
              </Alert>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => navigate('/checkout')}
                size="large"
              >
                Thử lại thanh toán
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
          </Box>

          <Divider sx={{ my: 4 }} />
          
          {/* Support */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cần hỗ trợ thêm?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<Support />}
                onClick={() => window.open('mailto:support@covezi.com')}
              >
                Gửi email hỗ trợ
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.open('tel:1900xxxx')}
              >
                Gọi hotline: 1900-xxxx
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PaymentFailed