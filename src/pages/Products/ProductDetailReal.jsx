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
  Divider,
  Stack,
  Breadcrumbs,
  Link,
  Rating,
  Tabs,
  Tab
} from '@mui/material'
import {
  LocalShipping,
  Security,
  Nature,
  NavigateNext,
  OpenInNew
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { productAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { toast } from 'react-toastify'
import ProductCoverBg from '~/assets/Covezi_Product_Cover.png'
import CoveziCover from '~/assets/Cover_Covezi.png'

const ProductDetailReal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProductDetail(id)
      console.log('[ProductDetailReal] Full response:', response)
      
      // API file returns response.data = { success: true, data: product }
      // So response here is { success: true, data: product }
      const productData = response.data
      console.log('[ProductDetailReal] Product data:', productData)
      
      if (productData) {
        setProduct(productData)
      } else {
        throw new Error('No product data found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Không thể tải chi tiết sản phẩm')
      navigate('/products')
    } finally {
      setLoading(false)
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
  const discountedPrice = product.price ? product.price * (1 - (product.discount || 0) / 100) : 0
  const originalPrice = product.price || 0

  // Debug log
  console.log('[ProductDetailReal] Rendering product:', {
    id: product._id,
    name: product.name,
    cover: product.cover,
    price: product.price,
    discount: product.discount,
    description: product.description,
    stock: product.stock
  })

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      backgroundImage: `url(${CoveziCover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <AppBar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/products')}
            sx={{ cursor: 'pointer', color: '#FF8C3C', fontWeight: 600 }}
          >
            Sản phẩm
          </Link>
          <Typography variant="body2">{product.name}</Typography>
        </Breadcrumbs>

        {/* Product Header Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Card sx={{ position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Box
                component="img"
                src={productImage}
                alt={product.name}
                onError={(e) => {
                  console.warn('[ProductDetailReal] Image failed to load:', productImage)
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E'
                }}
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
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: '1rem',
                    height: 40,
                    background: 'linear-gradient(135deg, #FF6B7A, #FF5566)',
                    color: '#FFFFFF',
                    fontWeight: 600
                  }}
                />
              )}
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Title & Price Section */}
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#222' }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={product.rating || 0} readOnly size="medium" />
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    ({product.reviewCount || 0} đánh giá)
                  </Typography>
                </Box>
                <Chip
                  label={`Còn ${product.stock || 0} sản phẩm`}
                  color={product.stock > 0 ? 'success' : 'error'}
                  variant="outlined"
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>Giá</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #FF6B7A, #FF5566)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    ₫{discountedPrice.toLocaleString('vi-VN')}
                  </Typography>
                  {product.discount > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: 'line-through',
                        color: '#999'
                      }}
                    >
                      ₫{originalPrice.toLocaleString('vi-VN')}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, border: '1px solid #eee' }}>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  {product.description || product.shortDescription || 'Không có mô tả'}
                </Typography>
              </Box>

              {/* External Shop Links */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#222', fontSize: '1.1rem' }}>
                  ✨ Chọn nền tảng mua sắm yêu thích của bạn
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ justifyContent: 'flex-start' }}>
                  {product.links?.shopee && (
                    <Box
                      onClick={() => openExternalLink(product.links.shopee)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 150,
                        height: 150,
                        bgcolor: '#ee4d2d',
                        color: 'white',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '3px solid #ee4d2d',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          transition: 'left 0.3s ease',
                        },
                        '&:hover': { 
                          bgcolor: '#d63e21',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(238, 77, 45, 0.4)',
                          border: '3px solid #d63e21',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '4rem', mb: 1, position: 'relative', zIndex: 1 }}>🛒</Box>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>Shopee</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, position: 'relative', zIndex: 1, mt: 0.5, opacity: 0.9 }}>Mua ngay</Typography>
                    </Box>
                  )}
                  {product.links?.tiktok && (
                    <Box
                      onClick={() => openExternalLink(product.links.tiktok)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 150,
                        height: 150,
                        bgcolor: '#000000',
                        color: 'white',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '3px solid #000000',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          transition: 'left 0.3s ease',
                        },
                        '&:hover': { 
                          bgcolor: '#1a1a1a',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
                          border: '3px solid #1a1a1a',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '4rem', mb: 1, position: 'relative', zIndex: 1 }}>🎵</Box>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>TikTok Shop</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, position: 'relative', zIndex: 1, mt: 0.5, opacity: 0.9 }}>Mua ngay</Typography>
                    </Box>
                  )}
                  {product.links?.facebook && (
                    <Box
                      onClick={() => openExternalLink(product.links.facebook)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 150,
                        height: 150,
                        bgcolor: '#1877f2',
                        color: 'white',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '3px solid #1877f2',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          transition: 'left 0.3s ease',
                        },
                        '&:hover': { 
                          bgcolor: '#0a66c2',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(24, 119, 242, 0.4)',
                          border: '3px solid #0a66c2',
                        },
                        '&:hover::before': {
                          left: '100%',
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '4rem', mb: 1, position: 'relative', zIndex: 1 }}>👍</Box>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>Facebook</Typography>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, position: 'relative', zIndex: 1, mt: 0.5, opacity: 0.9 }}>Mua ngay</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Benefits Card */}
        <Card sx={{ 
          mb: 6,
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '3px solid',
          borderImage: 'linear-gradient(135deg, #FFD9B8, #FFC9A8) 1',
          '&:hover': { 
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease'
          }
        }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShipping sx={{ color: '#FF8C3C', fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#222' }}>Giao hàng toàn quốc</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>Miễn phí từ 500k</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security sx={{ color: '#FF8C3C', fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#222' }}>Thanh toán an toàn</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>Bảo mật 100%</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Nature sx={{ color: '#FF8C3C', fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#222' }}>Sản phẩm xanh</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>Thân thiện môi trường</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Product Details Card */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '3px solid',
          borderImage: 'linear-gradient(135deg, #FFB3BB, #FF9BA5) 1',
          '&:hover': { 
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease'
          }
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#222' }}>
              Thông tin chi tiết
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>Danh mục</Typography>
                  <Typography variant="body2" sx={{ color: '#222', fontWeight: 600 }}>{product.category || 'Không xác định'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>Đã bán</Typography>
                  <Typography variant="body2" sx={{ color: '#222', fontWeight: 600 }}>{product.sold || 0} sản phẩm</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, fontSize: '0.75rem', display: 'block', mb: 0.5 }}>Trạng thái</Typography>
                  <Chip
                    label={product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    color={product.stock > 0 ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </Box>
  )
}

export default ProductDetailReal
