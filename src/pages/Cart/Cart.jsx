import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Divider,
  Chip,
  TextField,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  ShoppingCart,
  Add,
  Remove,
  Delete,
  LocalOffer,
  Nature,
  LocalShipping,
  ArrowForward,
  ShoppingBag,
  Clear
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { cartAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const Cart = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [selectAll, setSelectAll] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  useEffect(() => {
    if (cart?.items) {
      // Select all items by default
      setSelectedItems(new Set(cart.items.map(item => item._id)))
    }
  }, [cart])

  const fetchCart = async () => {
    try {
      setLoading(true)
      
      // Mock data for demo
      const mockCart = {
        _id: 'cart1',
        items: [
          {
            _id: 'item1',
            product: {
              _id: 'product1',
              name: 'Túi vải tái chế',
              description: 'Túi vải thân thiện với môi trường',
              price: 150000,
              discount: 10,
              quantity: 50,
              images: ['/eco-bag.jpg'],
              ecoMetrics: { overallRating: 4.5 }
            },
            quantity: 2
          },
          {
            _id: 'item2',
            product: {
              _id: 'product2',
              name: 'Cốc giữ nhiệt tre',
              description: 'Cốc tre tự nhiên, giữ nhiệt tốt',
              price: 120000,
              discount: 0,
              quantity: 30,
              images: ['/bamboo-cup.jpg'],
              ecoMetrics: { overallRating: 4.2 }
            },
            quantity: 1
          }
        ],
        total: 390000
      }
      
      setCart(mockCart)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      console.log(`Update quantity for ${itemId} to ${newQuantity}`)
      fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      console.log(`Remove item ${itemId}`)
      fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    
    try {
      console.log(`Apply coupon: ${couponCode}`)
      setAppliedCoupon({
        code: couponCode,
        discount: 10
      })
    } catch (error) {
      console.error('Error applying coupon:', error)
    }
  }

  const removeCoupon = async () => {
    try {
      setAppliedCoupon(null)
    } catch (error) {
      console.error('Error removing coupon:', error)
    }
  }

  const handleItemSelect = (itemId) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
    setSelectAll(newSelected.size === cart?.items?.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cart?.items?.map(item => item._id) || []))
    }
    setSelectAll(!selectAll)
  }

  const getSelectedTotal = () => {
    if (!cart?.items) return 0
    
    return cart.items.reduce((total, item) => {
      if (selectedItems.has(item._id)) {
        const itemPrice = item.product.discount > 0 
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price
        return total + (itemPrice * item.quantity)
      }
      return total
    }, 0)
  }

  const getEcoScore = () => {
    if (!cart?.items) return 0
    
    const totalEcoScore = cart.items.reduce((total, item) => {
      if (selectedItems.has(item._id)) {
        return total + ((item.product.ecoMetrics?.overallRating || 4) * item.quantity)
      }
      return total
    }, 0)
    
    const totalQuantity = cart.items.reduce((total, item) => {
      if (selectedItems.has(item._id)) {
        return total + item.quantity
      }
      return total
    }, 0)
    
    return totalQuantity > 0 ? totalEcoScore / totalQuantity : 0
  }

  const proceedToCheckout = () => {
    const selectedItemIds = Array.from(selectedItems)
    if (selectedItemIds.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán')
      return
    }
    
    // Navigate to checkout with selected items
    navigate('/checkout', { 
      state: { 
        selectedItems: selectedItemIds,
        total: getSelectedTotal()
      } 
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return <PageLoadingSpinner />
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        <AppBar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
              Giỏ hàng trống
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              startIcon={<ShoppingBag />}
            >
              Tiếp tục mua sắm
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
            Giỏ hàng của tôi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {cart.items.length} sản phẩm đang chờ thanh toán
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            {/* Select All */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    indeterminate={selectedItems.size > 0 && selectedItems.size < cart.items.length}
                  />
                }
                label="Chọn tất cả sản phẩm"
              />
            </Paper>

            {/* Cart Items List */}
            <Stack spacing={3}>
              {cart.items.map((item) => {
                const finalPrice = item.product.discount > 0 
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price
                
                return (
                  <Card
                    key={item._id}
                    sx={{
                      border: selectedItems.has(item._id) ? 2 : 1,
                      borderColor: selectedItems.has(item._id) ? 'primary.main' : 'divider'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                        {/* Checkbox */}
                        <Checkbox
                          checked={selectedItems.has(item._id)}
                          onChange={() => handleItemSelect(item._id)}
                          sx={{ mt: 1 }}
                        />
                        
                        {/* Product Image */}
                        <img
                          src={item.product.images[0] || '/default-product.jpg'}
                          alt={item.product.name}
                          style={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/products/${item.product._id}`)}
                          onError={(e) => {
                            e.target.src = '/default-product.jpg'
                          }}
                        />
                        
                        {/* Product Info */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ 
                              mb: 1,
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' }
                            }}
                            onClick={() => navigate(`/products/${item.product._id}`)}
                          >
                            {item.product.name}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.product.description}
                          </Typography>
                          
                          {/* Eco Badge */}
                          <Chip
                            icon={<Nature />}
                            label={`Eco ${item.product.ecoMetrics?.overallRating?.toFixed(1) || '4.0'}`}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          
                          {/* Price */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {formatCurrency(finalPrice)}
                            </Typography>
                            {item.product.discount > 0 && (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                  {formatCurrency(item.product.price)}
                                </Typography>
                                <Chip
                                  icon={<LocalOffer />}
                                  label={`-${item.product.discount}%`}
                                  size="small"
                                  color="error"
                                />
                              </>
                            )}
                          </Box>
                          
                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ mr: 2 }}>Số lượng:</Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                sx={{ border: '1px solid #ddd' }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Typography
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  minWidth: 40,
                                  textAlign: 'center',
                                  border: '1px solid #ddd',
                                  borderRadius: 1
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.quantity}
                                sx={{ border: '1px solid #ddd' }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                            
                            {/* Remove Button */}
                            <IconButton
                              color="error"
                              onClick={() => removeItem(item._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                          
                          {/* Stock Warning */}
                          {item.quantity >= item.product.quantity && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                              Chỉ còn {item.product.quantity} sản phẩm trong kho
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Item Total */}
                        <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {formatCurrency(finalPrice * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
            
            {/* Coupon Section */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Mã giảm giá
              </Typography>
              
              {appliedCoupon ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={<LocalOffer />}
                    label={`${appliedCoupon.code} - Giảm ${appliedCoupon.discount}%`}
                    color="success"
                    onDelete={removeCoupon}
                    deleteIcon={<Clear />}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={applyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Áp dụng
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Tổng đơn hàng
              </Typography>
              
              {/* Eco Score */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Nature sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Điểm xanh: {getEcoScore().toFixed(1)}/5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Đơn hàng của bạn thân thiện với môi trường!
                </Typography>
              </Box>
              
              {/* Price Breakdown */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tạm tính ({selectedItems.size} sản phẩm):</Typography>
                  <Typography fontWeight="bold">
                    {formatCurrency(getSelectedTotal())}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Phí vận chuyển:</Typography>
                  <Typography fontWeight="bold">
                    {getSelectedTotal() >= 500000 ? 'Miễn phí' : formatCurrency(30000)}
                  </Typography>
                </Box>
                
                {getSelectedTotal() < 500000 && getSelectedTotal() > 0 && (
                  <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                    <Typography variant="caption">
                      Mua thêm {formatCurrency(500000 - getSelectedTotal())} để được miễn phí vận chuyển
                    </Typography>
                  </Alert>
                )}
                
                {appliedCoupon && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Giảm giá ({appliedCoupon.code}):</Typography>
                    <Typography fontWeight="bold" color="error">
                      -{formatCurrency(getSelectedTotal() * appliedCoupon.discount / 100)}
                    </Typography>
                  </Box>
                )}
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatCurrency(
                      getSelectedTotal() 
                      + (getSelectedTotal() >= 500000 ? 0 : 30000)
                      - (appliedCoupon ? getSelectedTotal() * appliedCoupon.discount / 100 : 0)
                    )}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Free Shipping Info */}
              {getSelectedTotal() >= 500000 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                  <LocalShipping sx={{ color: '#4caf50', mr: 1 }} />
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Miễn phí vận chuyển
                  </Typography>
                </Box>
              )}
              
              {/* Checkout Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={proceedToCheckout}
                disabled={selectedItems.size === 0}
                endIcon={<ArrowForward />}
                sx={{ mb: 2 }}
              >
                Thanh toán ({selectedItems.size})
              </Button>
              
              {/* Continue Shopping */}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate('/products')}
                startIcon={<ShoppingBag />}
              >
                Tiếp tục mua sắm
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Cart