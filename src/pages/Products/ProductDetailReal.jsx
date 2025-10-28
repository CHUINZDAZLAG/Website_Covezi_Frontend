import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  Rating,
  IconButton,
  Divider,
  Stack,
  Badge,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Security,
  Nature,
  Recycling,
  Star,
  Add,
  Remove,
  NavigateNext,
  Verified,
  LocalOffer,
  OpenInNew
} from '@mui/icons-material'
import { FiShoppingBag } from 'react-icons/fi'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI, voucherAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { toast } from 'react-toastify'

const ProductDetailReal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [favorite, setFavorite] = useState(false)
  const [userVouchers, setUserVouchers] = useState([])
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false)
  const [loadingVouchers, setLoadingVouchers] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
      fetchUserVouchers()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProductDetail(id)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Không thể tải chi tiết sản phẩm')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserVouchers = async () => {
    try {
      setLoadingVouchers(true)
      const response = await voucherAPI.getActiveVouchers()
      setUserVouchers(response.data || [])
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    } finally {
      setLoadingVouchers(false)
    }
  }

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value
    if (newQuantity > 0 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
    // TODO: Implement add to cart
  }

  const handleOpenVoucherDialog = () => {
    if (userVouchers.length === 0) {
      toast.info('Bạn chưa có voucher nào')
      return
    }
    setOpenVoucherDialog(true)
  }

  const handleApplyVoucher = async () => {
    if (!selectedVoucher) {
      toast.error('Vui lòng chọn voucher')
      return
    }
    try {
      await voucherAPI.requestVoucher(selectedVoucher._id, id)
      setOpenVoucherDialog(false)
      setSelectedVoucher(null)
    } catch (error) {
      console.error('Error applying voucher:', error)
      toast.error('Không thể sử dụng voucher')
    }
  }

  const openExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) return <PageLoadingSpinner />

  if (!product) {
    return (
      <Container maxWidth="lg">
        <AppBar />
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h6">Sản phẩm không tìm thấy</Typography>
        </Box>
      </Container>
    )
  }

  const productImage = product.cover || '/default-product.png'
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100)
  const originalPrice = product.price

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/products')}
            sx={{ cursor: 'pointer', color: 'primary.main' }}
          >
            Sản phẩm
          </Link>
          <Typography variant="body2">{product.name}</Typography>
        </Breadcrumbs>

        {/* Main Product Content */}
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
              <Box
                component="img"
                src={productImage}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  minHeight: 400,
                  objectFit: 'cover',
                  bgcolor: '#f0f0f0'
                }}
              />
              {product.discount > 0 && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: '1rem',
                    height: 40
                  }}
                />
              )}
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Title */}
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating || 5} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  ({product.reviewCount || 0} đánh giá)
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      fontSize: '1.5rem'
                    }}
                  >
                    ₫{discountedPrice.toLocaleString('vi-VN')}
                  </Typography>
                  {product.discount > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'textSecondary'
                      }}
                    >
                      ₫{originalPrice.toLocaleString('vi-VN')}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={`Còn ${product.stock || 0} sản phẩm`}
                  color={product.stock > 0 ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
              </Box>

              {/* Eco/Certification Info */}
              {product.ecoScore && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Recycling fontSize="small" />
                    <Typography variant="body2">
                      Sản phẩm thân thiện với môi trường - Điểm Eco: {product.ecoScore}
                    </Typography>
                  </Box>
                </Alert>
              )}

              {/* Description */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body1" color="textSecondary">
                  {product.description || product.shortDescription}
                </Typography>
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="body2">Số lượng:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    inputProps={{ readOnly: true, textAlign: 'center' }}
                    sx={{ width: 60, '& input': { textAlign: 'center' } }}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 1)}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                {/* Add to Cart */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  fullWidth
                >
                  Thêm vào giỏ hàng
                </Button>

                {/* Use Voucher Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<LocalOffer />}
                  onClick={handleOpenVoucherDialog}
                  fullWidth
                >
                  Sử dụng Voucher
                  {userVouchers.length > 0 && (
                    <Badge
                      badgeContent={userVouchers.length}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <Box />
                    </Badge>
                  )}
                </Button>

                {/* Favorite Button */}
                <Button
                  variant="outlined"
                  startIcon={favorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => setFavorite(!favorite)}
                  fullWidth
                >
                  {favorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* External Shop Links */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Mua hàng tại các sàn thương mại:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                  {product.links?.shopee && (
                    <Button
                      variant="contained"
                      startIcon={<OpenInNew />}
                      onClick={() => openExternalLink(product.links.shopee)}
                      sx={{
                        bgcolor: '#ee4d2d',
                        '&:hover': { bgcolor: '#d63013' }
                      }}
                    >
                      🛒 Shopee
                    </Button>
                  )}
                  {product.links?.tiktok && (
                    <Button
                      variant="contained"
                      startIcon={<OpenInNew />}
                      onClick={() => openExternalLink(product.links.tiktok)}
                      sx={{
                        bgcolor: '#000000',
                        '&:hover': { bgcolor: '#333333' }
                      }}
                    >
                      🎵 TikTok Shop
                    </Button>
                  )}
                  {product.links?.facebook && (
                    <Button
                      variant="contained"
                      startIcon={<OpenInNew />}
                      onClick={() => openExternalLink(product.links.facebook)}
                      sx={{
                        bgcolor: '#1877f2',
                        '&:hover': { bgcolor: '#0a66c2' }
                      }}
                    >
                      👍 Facebook
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Benefits */}
              <Card sx={{ bgcolor: '#f9f9f9', border: '1px solid #eee' }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocalShipping color="primary" />
                      <Typography variant="body2">Giao hàng toàn quốc</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Security color="primary" />
                      <Typography variant="body2">Thanh toán an toàn</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Nature color="primary" />
                      <Typography variant="body2">Sản phẩm thân thiện môi trường</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Thông tin chi tiết
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Danh mục</Typography>
                <Typography variant="body1">{product.category || 'Không xác định'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Đã bán</Typography>
                <Typography variant="body1">{product.sold || 0} sản phẩm</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Trạng thái</Typography>
                <Chip
                  label={product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  color={product.stock > 0 ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">Eco Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Recycling fontSize="small" color="success" />
                  <Typography variant="body1">{product.ecoScore || 0}/100</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Voucher Selection Dialog */}
      <Dialog open={openVoucherDialog} onClose={() => setOpenVoucherDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chọn Voucher để sử dụng</DialogTitle>
        <DialogContent>
          {loadingVouchers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : userVouchers.length === 0 ? (
            <Alert severity="info">Bạn chưa có voucher nào</Alert>
          ) : (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {userVouchers.map((voucher) => (
                <Card
                  key={voucher._id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedVoucher?._id === voucher._id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    bgcolor: selectedVoucher?._id === voucher._id ? '#e3f2fd' : 'white',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedVoucher(voucher)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {voucher.voucherCode}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Giảm {voucher.percent}%
                        </Typography>
                      </Box>
                      <Chip
                        label={voucher.status === 'active' ? 'Có sẵn' : 'Đang chờ'}
                        color={voucher.status === 'active' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVoucherDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleApplyVoucher}
            disabled={!selectedVoucher || loadingVouchers}
          >
            Sử dụng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductDetailReal
