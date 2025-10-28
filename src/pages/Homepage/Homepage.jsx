import React from 'react'
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
  Avatar,
  Divider,
  Paper,
  IconButton
} from '@mui/material'
import {
  Nature,
  LocalFlorist,
  Recycling,
  Star,
  ShoppingCart,
  Favorite,
  Share,
  TrendingUp,
  People,
  Park,
  ArrowForward
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { homepageAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'

const Homepage = () => {
  const navigate = useNavigate()
  const [homepageData, setHomepageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true)
        const response = await homepageAPI.getHomepageData()
        setHomepageData(response.data)
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  const { company, features, stats, promotions, testimonials, news } = homepageData || {}

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
      <AppBar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            {company?.name || 'Covezi'}
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}
          >
            {company?.description || 'Thương mại điện tử xanh - Mua sắm có trách nhiệm'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: '#2e7d32', fontWeight: 'bold', px: 4 }}
              onClick={() => navigate('/products')}
            >
              Khám phá sản phẩm
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4 }}
              onClick={() => navigate('/challenges')}
            >
              Thử thách xanh
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      {stats && (
        <Box sx={{ py: 6, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} textAlign="center">
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#4caf50', mb: 2, width: 60, height: 60 }}>
                    <ShoppingCart fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.totalProducts || '500+'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sản phẩm xanh
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#2e7d32', mb: 2, width: 60, height: 60 }}>
                    <People fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.totalCustomers || '10K+'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Khách hàng
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#66bb6a', mb: 2, width: 60, height: 60 }}>
                    <Park fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.treesPlanted || '5000+'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Cây được trồng
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#81c784', mb: 2, width: 60, height: 60 }}>
                    <Recycling fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {stats.carbonSaved || '100T'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    CO2 tiết kiệm
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Features Section */}
      {features && (
        <Box sx={{ py: 8, bgcolor: '#f8fdf8' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 'bold', color: '#2e7d32' }}
            >
              Tại sao chọn Covezi?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                      border: '2px solid #e8f5e8'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#4caf50',
                          mb: 3,
                          width: 64,
                          height: 64,
                          mx: 'auto'
                        }}
                      >
                        {feature.icon === 'eco' && <Nature fontSize="large" />}
                        {feature.icon === 'flower' && <LocalFlorist fontSize="large" />}
                        {feature.icon === 'recycle' && <Recycling fontSize="large" />}
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Promotions Section */}
      {promotions && promotions.length > 0 && (
        <Box sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 'bold', color: '#2e7d32' }}
            >
              Ưu đãi đặc biệt
            </Typography>
            <Grid container spacing={4}>
              {promotions.slice(0, 3).map((promo, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #ff7043 0%, #f4511e 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}
                    onClick={() => navigate('/products')}
                  >
                    {promo.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={promo.image}
                        alt={promo.title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {promo.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                        {promo.description}
                      </Typography>
                      <Chip
                        label={`Giảm ${promo.discount}%`}
                        sx={{ bgcolor: 'white', color: '#f4511e', fontWeight: 'bold' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <Box sx={{ py: 8, bgcolor: '#f8fdf8' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 'bold', color: '#2e7d32' }}
            >
              Khách hàng nói gì?
            </Typography>
            <Grid container spacing={4}>
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Rating value={testimonial.rating || 5} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#4caf50' }}>
                        {testimonial.customerName?.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.customerName}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Bắt đầu hành trình xanh của bạn
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Tham gia cộng đồng Covezi để mua sắm có trách nhiệm và bảo vệ môi trường
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: '#2e7d32', fontWeight: 'bold', px: 4 }}
              onClick={() => navigate('/register')}
            >
              Đăng ký ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4 }}
              onClick={() => navigate('/garden')}
              endIcon={<ArrowForward />}
            >
              Khám phá vườn ảo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#1b5e20', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {company?.name || 'Covezi'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {company?.description || 'Thương mại điện tử xanh'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Liên kết
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Sản phẩm
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Thử thách
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                Vườn ảo
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Kết nối
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {company?.socialLinks?.map((link, index) => (
                  <IconButton
                    key={index}
                    href={link.url}
                    target="_blank"
                    sx={{ color: 'white', opacity: 0.8 }}
                  >
                    <Share />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
            © 2025 {company?.name || 'Covezi'}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Homepage