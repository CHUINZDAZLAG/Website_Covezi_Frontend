import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Paper,
  Stack,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material'
import {
  Payment,
  CheckCircle,
  Nature,
  Security,
  Place,
  Phone,
  Person,
  Email
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { orderAPI, cartAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const steps = ['Thông tin giao hàng', 'Phương thức thanh toán', 'Xác nhận đơn hàng']

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [orderItems, setOrderItems] = useState([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    province: '',
    notes: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('momo')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [errors, setErrors] = useState({})

  const provinces = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'
  ]

  const shippingOptions = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', time: '3-5 ngày', fee: 30000 },
    { id: 'express', name: 'Giao hàng nhanh', time: '1-2 ngày', fee: 50000 },
    { id: 'same-day', name: 'Giao trong ngày', time: 'Trong ngày', fee: 80000 }
  ]

  useEffect(() => {
    fetchOrderItems()
  }, [])

  const fetchOrderItems = async () => {
    try {
      setLoading(true)
      
      // Get selected items from state or fetch from cart
      const selectedItems = location.state?.selectedItems || []
      
      if (selectedItems.length === 0) {
        // Mock data for demo
        setOrderItems([
          {
            _id: '1',
            product: {
              _id: '1',
              name: 'Túi vải tái chế',
              price: 150000,
              discount: 10,
              images: ['/eco-bag.jpg'],
              ecoMetrics: { overallRating: 4.5 }
            },
            quantity: 2
          }
        ])
        setOrderTotal(270000)
      } else {
        // Use provided items
        setOrderItems(selectedItems)
        setOrderTotal(location.state?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching order items:', error)
      // Use mock data on error
      setOrderItems([])
    } finally {
      setLoading(false)
    }
  }

  const validateShippingInfo = () => {
    const newErrors = {}
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên'
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại'
    if (!shippingInfo.email.trim()) newErrors.email = 'Vui lòng nhập email'
    if (!shippingInfo.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ'
    if (!shippingInfo.ward.trim()) newErrors.ward = 'Vui lòng nhập phường/xã'
    if (!shippingInfo.district.trim()) newErrors.district = 'Vui lòng nhập quận/huyện'
    if (!shippingInfo.province) newErrors.province = 'Vui lòng chọn tỉnh/thành phố'
    
    // Phone validation
    if (shippingInfo.phone && !/^[0-9]{10,11}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    
    // Email validation
    if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingInfo()) {
      return
    }
    
    if (activeStep === 2) {
      // Final step - show confirmation
      setConfirmDialog(true)
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const calculateTotal = () => {
    const selectedShipping = shippingOptions.find(opt => opt.id === shippingMethod)
    const itemsTotal = orderItems.reduce((total, item) => {
      const itemPrice = item.product.discount > 0 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price
      return total + (itemPrice * item.quantity)
    }, 0)
    
    const shippingFee = itemsTotal >= 500000 ? 0 : selectedShipping?.fee || 0
    
    return itemsTotal + shippingFee
  }

  const createOrder = async () => {
    try {
      setProcessing(true)
      
      const orderData = {
        items: orderItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discount > 0 
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price
        })),
        shippingAddress: shippingInfo,
        paymentMethod,
        shippingMethod,
        total: calculateTotal(),
        notes: shippingInfo.notes
      }
      
      // Simulate order creation
      console.log('Creating order:', orderData)
      
      // For demo, just navigate to a success page
      setTimeout(() => {
        navigate('/orders', {
          state: { orderCreated: true }
        })
      }, 2000)
      
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.')
    } finally {
      setProcessing(false)
      setConfirmDialog(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getEcoScore = () => {
    if (!orderItems.length) return 0
    
    const totalEcoScore = orderItems.reduce((total, item) => {
      return total + ((item.product.ecoMetrics?.overallRating || 4) * item.quantity)
    }, 0)
    
    const totalQuantity = orderItems.reduce((total, item) => total + item.quantity, 0)
    
    return totalQuantity > 0 ? totalEcoScore / totalQuantity : 0
  }

  if (loading) {
    return <PageLoadingSpinner />
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        <AppBar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Không có sản phẩm nào để thanh toán
            </Typography>
            <Button variant="contained" onClick={() => navigate('/cart')}>
              Quay lại giỏ hàng
            </Button>
          </Paper>
        </Container>
      </Box>
    )
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
            Thanh toán
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Hoàn tất đơn hàng của bạn
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              {/* Step 1: Shipping Information */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Thông tin giao hàng
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Địa chỉ cụ thể"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        error={!!errors.address}
                        helperText={errors.address}
                        InputProps={{
                          startAdornment: <Place sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Phường/Xã"
                        value={shippingInfo.ward}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                        error={!!errors.ward}
                        helperText={errors.ward}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Quận/Huyện"
                        value={shippingInfo.district}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                        error={!!errors.district}
                        helperText={errors.district}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth error={!!errors.province}>
                        <InputLabel>Tỉnh/Thành phố</InputLabel>
                        <Select
                          value={shippingInfo.province}
                          label="Tỉnh/Thành phố"
                          onChange={(e) => setShippingInfo({ ...shippingInfo, province: e.target.value })}
                        >
                          {provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                              {province}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.province && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                            {errors.province}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Ghi chú (tùy chọn)"
                        multiline
                        rows={3}
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        placeholder="Ghi chú về đơn hàng, thời gian giao hàng..."
                      />
                    </Grid>
                  </Grid>
                  
                  {/* Shipping Options */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Phương thức giao hàng
                    </Typography>
                    <RadioGroup
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      {shippingOptions.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {option.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.time}
                                </Typography>
                              </Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {formatCurrency(option.fee)}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            m: 1,
                            p: 2,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </Box>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Phương thức thanh toán
                  </Typography>
                  
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="momo"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src="/momo-logo.png"
                            alt="MoMo"
                            style={{ width: 40, height: 40, marginRight: 16 }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Ví điện tử MoMo
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Thanh toán an toàn và nhanh chóng
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        m: 1,
                        p: 2,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    />
                    
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Payment sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Thanh toán khi nhận hàng (COD)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        m: 1,
                        p: 2,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    />
                  </RadioGroup>
                  
                  {/* Security Info */}
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Thông tin thanh toán của bạn được bảo mật với công nghệ mã hóa SSL 256-bit
                      </Typography>
                    </Box>
                  </Alert>
                </Box>
              )}

              {/* Step 3: Order Confirmation */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Xác nhận đơn hàng
                  </Typography>
                  
                  {/* Shipping Info Summary */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Thông tin giao hàng
                      </Typography>
                      <Typography variant="body1">
                        <strong>{shippingInfo.fullName}</strong><br />
                        {shippingInfo.phone}<br />
                        {shippingInfo.email}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.province}
                      </Typography>
                      {shippingInfo.notes && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Ghi chú: {shippingInfo.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Payment Method Summary */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        Phương thức thanh toán
                      </Typography>
                      <Typography variant="body1">
                        {paymentMethod === 'momo' ? 'Ví điện tử MoMo' : 'Thanh toán khi nhận hàng (COD)'}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  {/* Shipping Method Summary */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        Phương thức giao hàng
                      </Typography>
                      <Typography variant="body1">
                        {shippingOptions.find(opt => opt.id === shippingMethod)?.name} - 
                        {shippingOptions.find(opt => opt.id === shippingMethod)?.time}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  size="large"
                >
                  {activeStep === 2 ? 'Đặt hàng' : 'Tiếp tục'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Đơn hàng của bạn
              </Typography>
              
              {/* Eco Score */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Nature sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Điểm xanh: {getEcoScore().toFixed(1)}/5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Đơn hàng thân thiện với môi trường
                </Typography>
              </Box>
              
              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Sản phẩm ({orderItems.length})
                </Typography>
                <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {orderItems.map((item, index) => {
                    const finalPrice = item.product.discount > 0 
                      ? item.product.price * (1 - item.product.discount / 100)
                      : item.product.price
                    
                    return (
                      <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                        <img
                          src={item.product.images?.[0] || '/default-product.jpg'}
                          alt={item.product.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} × {formatCurrency(finalPrice)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(finalPrice * item.quantity)}
                        </Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Price Breakdown */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tạm tính:</Typography>
                  <Typography>
                    {formatCurrency(orderItems.reduce((total, item) => {
                      const itemPrice = item.product.discount > 0 
                        ? item.product.price * (1 - item.product.discount / 100)
                        : item.product.price
                      return total + (itemPrice * item.quantity)
                    }, 0))}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography>
                    {formatCurrency(
                      orderItems.reduce((total, item) => {
                        const itemPrice = item.product.discount > 0 
                          ? item.product.price * (1 - item.product.discount / 100)
                          : item.product.price
                        return total + (itemPrice * item.quantity)
                      }, 0) >= 500000 ? 0 : shippingOptions.find(opt => opt.id === shippingMethod)?.fee || 0
                    )}
                  </Typography>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Order Info */}
              <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                <Typography variant="caption">
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của Covezi
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Order Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => !processing && setConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Xác nhận đặt hàng
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn đặt hàng với tổng giá trị <strong>{formatCurrency(calculateTotal())}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sau khi xác nhận, đơn hàng sẽ được xử lý và bạn sẽ nhận được email xác nhận.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={processing}>
            Hủy
          </Button>
          <Button
            onClick={createOrder}
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {processing ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Checkout