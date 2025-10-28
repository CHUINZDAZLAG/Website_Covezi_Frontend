import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Paper,
  Stack,
  Tab,
  Tabs,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material'
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Receipt,
  Star,
  RateReview,
  Refresh,
  KeyboardArrowRight,
  Payment,
  Inventory,
  Assignment,
  AccessTime,
  Place
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { orderAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailDialog, setOrderDetailDialog] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  })

  const orderStatuses = [
    { value: 'all', label: 'Tất cả', icon: <Receipt />, color: 'default' },
    { value: 'pending', label: 'Chờ xử lý', icon: <Pending />, color: 'warning' },
    { value: 'processing', label: 'Đang xử lý', icon: <Inventory />, color: 'info' },
    { value: 'shipped', label: 'Đang giao', icon: <LocalShipping />, color: 'primary' },
    { value: 'delivered', label: 'Đã giao', icon: <CheckCircle />, color: 'success' },
    { value: 'cancelled', label: 'Đã hủy', icon: <Cancel />, color: 'error' }
  ]

  useEffect(() => {
    fetchOrders()
    fetchOrderStats()
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Mock data for demo
      const mockOrders = [
        {
          _id: '1',
          orderNumber: 'ORD-2025-001',
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'MoMo',
          total: 450000,
          subtotal: 420000,
          shippingFee: 30000,
          discount: 0,
          createdAt: new Date('2025-01-20T10:00:00Z'),
          deliveredDate: new Date('2025-01-22T14:30:00Z'),
          trackingNumber: 'TRK123456789',
          items: [
            {
              product: {
                _id: '1',
                name: 'Túi vải tái chế',
                description: 'Túi vải thân thiện môi trường',
                images: ['/eco-bag.jpg']
              },
              quantity: 2,
              price: 150000
            },
            {
              product: {
                _id: '2',
                name: 'Cốc giữ nhiệt tre',
                description: 'Cốc tre tự nhiên',
                images: ['/bamboo-cup.jpg']
              },
              quantity: 1,
              price: 120000
            }
          ],
          shippingAddress: {
            fullName: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '123 Đường ABC',
            ward: 'Phường 1',
            district: 'Quận 1',
            province: 'TP. Hồ Chí Minh'
          }
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderStats = async () => {
    try {
      // Mock stats
      setStats({
        total: 5,
        pending: 1,
        processing: 1,
        shipped: 1,
        delivered: 2,
        cancelled: 0
      })
    } catch (error) {
      console.error('Error fetching order stats:', error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleOrderAction = async (orderId, action) => {
    try {
      console.log(`Order ${orderId} action: ${action}`)
      fetchOrders()
      fetchOrderStats()
      setOrderDetailDialog(false)
    } catch (error) {
      console.error(`Error ${action} order:`, error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800'
      case 'processing': return '#2196f3'
      case 'shipped': return '#9c27b0'
      case 'delivered': return '#4caf50'
      case 'cancelled': return '#f44336'
      default: return '#9e9e9e'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'processing': return 'Đang xử lý'
      case 'shipped': return 'Đang giao'
      case 'delivered': return 'Đã giao'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#4caf50'
      case 'pending': return '#ff9800'
      case 'failed': return '#f44336'
      default: return '#9e9e9e'
    }
  }

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán'
      case 'pending': return 'Chờ thanh toán'
      case 'failed': return 'Thanh toán thất bại'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading && orders.length === 0) {
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
            Đơn hàng của tôi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Order Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#4caf50', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <Receipt fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng đơn
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#ff9800', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <Pending fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ xử lý
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#2196f3', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <Inventory fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.processing}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang xử lý
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#9c27b0', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <LocalShipping fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.shipped}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang giao
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#4caf50', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <CheckCircle fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.delivered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã giao
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#f44336', mx: 'auto', mb: 1, width: 48, height: 48 }}>
                <Cancel fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã hủy
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {orderStatuses.map((status, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {status.icon}
                    {status.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Orders List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : orders.length > 0 ? (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Card
                key={order._id}
                sx={{
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => {
                  setSelectedOrder(order)
                  setOrderDetailDialog(true)
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Order Info */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                          #{order.orderNumber}
                        </Typography>
                        <Chip
                          label={getStatusText(order.status)}
                          sx={{
                            bgcolor: getStatusColor(order.status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Ngày đặt: {formatDate(order.createdAt)}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Sản phẩm: {order.items?.length || 0} món
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Payment sx={{ fontSize: 16 }} />
                        <Chip
                          label={getPaymentStatusText(order.paymentStatus)}
                          size="small"
                          sx={{
                            bgcolor: getPaymentStatusColor(order.paymentStatus),
                            color: 'white'
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    {/* Product Preview */}
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                        {order.items?.slice(0, 3).map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              minWidth: 60,
                              height: 60,
                              borderRadius: 1,
                              overflow: 'hidden',
                              position: 'relative'
                            }}
                          >
                            <img
                              src={item.product?.images[0] || '/default-product.jpg'}
                              alt={item.product?.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = '/default-product.jpg'
                              }}
                            />
                            {item.quantity > 1 && (
                              <Chip
                                label={`x${item.quantity}`}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  bottom: 2,
                                  right: 2,
                                  minWidth: 'auto',
                                  height: 20,
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>
                        ))}
                        {order.items?.length > 3 && (
                          <Box
                            sx={{
                              minWidth: 60,
                              height: 60,
                              bgcolor: 'grey.200',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              +{order.items.length - 3}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                    
                    {/* Total and Action */}
                    <Grid item xs={12} md={2}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          {formatCurrency(order.total)}
                        </Typography>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                            setOrderDetailDialog(true)
                          }}
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {activeTab === 0 
                ? 'Bạn chưa có đơn hàng nào'
                : `Không có đơn hàng nào ở trạng thái "${orderStatuses[activeTab].label}"`
              }
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Mua sắm ngay
            </Button>
          </Paper>
        )}
      </Container>

      {/* Order Detail Dialog */}
      <Dialog
        open={orderDetailDialog}
        onClose={() => setOrderDetailDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                  Đơn hàng #{selectedOrder.orderNumber}
                </Typography>
                <Chip
                  label={getStatusText(selectedOrder.status)}
                  sx={{
                    bgcolor: getStatusColor(selectedOrder.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={4}>
                {/* Order Items */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Sản phẩm đã đặt
                  </Typography>
                  <Stack spacing={2}>
                    {selectedOrder.items?.map((item, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img
                            src={item.product?.images[0] || '/default-product.jpg'}
                            alt={item.product?.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                            onError={(e) => {
                              e.target.src = '/default-product.jpg'
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.product?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.product?.description}
                            </Typography>
                            <Typography variant="body2">
                              Số lượng: {item.quantity} | Đơn giá: {formatCurrency(item.price)}
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight="bold">
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                  
                  {/* Order Summary */}
                  <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Tổng kết đơn hàng
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Tạm tính:</Typography>
                        <Typography>{formatCurrency(selectedOrder.subtotal || selectedOrder.total)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Phí vận chuyển:</Typography>
                        <Typography>{formatCurrency(selectedOrder.shippingFee || 0)}</Typography>
                      </Box>
                      {selectedOrder.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Giảm giá:</Typography>
                          <Typography color="error">-{formatCurrency(selectedOrder.discount)}</Typography>
                        </Box>
                      )}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formatCurrency(selectedOrder.total)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                
                {/* Order Info */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={3}>
                    {/* Delivery Info */}
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Thông tin giao hàng
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">Địa chỉ:</Typography>
                          <Typography variant="body2">
                            {selectedOrder.shippingAddress?.fullName}<br />
                            {selectedOrder.shippingAddress?.phone}<br />
                            {selectedOrder.shippingAddress?.address}<br />
                            {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}<br />
                            {selectedOrder.shippingAddress?.province}
                          </Typography>
                        </Box>
                        
                        {selectedOrder.trackingNumber && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">Mã vận đơn:</Typography>
                            <Typography variant="body2">{selectedOrder.trackingNumber}</Typography>
                          </Box>
                        )}
                        
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">Phương thức thanh toán:</Typography>
                          <Typography variant="body2">{selectedOrder.paymentMethod || 'MoMo'}</Typography>
                        </Box>
                        
                        <Chip
                          label={getPaymentStatusText(selectedOrder.paymentStatus)}
                          sx={{
                            bgcolor: getPaymentStatusColor(selectedOrder.paymentStatus),
                            color: 'white'
                          }}
                        />
                      </Stack>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOrderDetailDialog(false)}>Đóng</Button>
              
              {selectedOrder.status === 'pending' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOrderAction(selectedOrder._id, 'cancelled')}
                >
                  Hủy đơn hàng
                </Button>
              )}
              
              {selectedOrder.status === 'delivered' && (
                <Button
                  variant="contained"
                  startIcon={<RateReview />}
                  onClick={() => navigate(`/orders/${selectedOrder._id}/review`)}
                >
                  Đánh giá
                </Button>
              )}
              
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={() => {
                  fetchOrders()
                  fetchOrderStats()
                }}
              >
                Làm mới
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default Orders