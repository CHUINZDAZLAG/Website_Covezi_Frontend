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
import CoveziCover from '~/assets/Cover_Covezi.png'
import CoveziTree from '~/assets/Covezi_Tree.png'

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
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'transparent',
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
      
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${CoveziCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(50, 119, 142, 0.3)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
          >
            {company?.name || 'Covezi'}
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, opacity: 0.95, maxWidth: '700px', mx: 'auto', fontWeight: 500 }}
          >
            Thương mại điện tử xanh - Bảo vệ môi trường với mỗi giao dịch<br />
            <span style={{ fontSize: '0.9em', fontStyle: 'italic', marginTop: '8px', display: 'inline-block' }}>
              Vẽ tương lai cho thế giới xanh
            </span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#32778E', 
                color: 'white', 
                fontWeight: 'bold', 
                px: 4,
                '&:hover': {
                  bgcolor: '#1f4d63',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate('/products')}
            >
              Khám phá sản phẩm
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: '#32778E', 
                color: '#32778E', 
                px: 4,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(50, 119, 142, 0.2)',
                  borderColor: '#32778E'
                }
              }}
              onClick={() => navigate('/challenges')}
            >
              Thử thách xanh
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      {features && (
        <Box sx={{ py: 8, background: 'transparent' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 'bold', color: '#32778E' }}
            >
              Tại sao chọn Covezi?
            </Typography>
            <Grid container spacing={4}>
              {features.slice(0, 3).map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                      border: '2px solid rgba(50, 119, 142, 0.2)',
                      bgcolor: 'rgba(50, 119, 142, 0.05)'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          bgcolor: index === 0 ? '#FF6B7A' : index === 1 ? '#B6349A' : '#FF8C3C',
                          mb: 3,
                          width: 64,
                          height: 64,
                          mx: 'auto',
                          color: 'white'
                        }}
                      >
                        {feature.icon === 'eco' && <Nature fontSize="large" />}
                        {feature.icon === 'flower' && <LocalFlorist fontSize="large" />}
                        {feature.icon === 'recycle' && <Recycling fontSize="large" />}
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#32778E' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#32778E' }}>
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

      {/* Brand Story Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          position: 'relative',
          backgroundImage: `url(${CoveziCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Content Section */}
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left side - Image */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  backgroundImage: `url(${CoveziTree})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: { xs: '300px', md: '450px' },
                  borderRadius: '5%',
                  overflow: 'hidden'
                }}
              />
            </Grid>

            {/* Right side - Text Content */}
            <Grid item xs={12} md={7}>
              {/* Title and Icon - Above Text */}
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0 }}>
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#32778E',
                      fontSize: { xs: '22px', md: '26px' },
                      m: 0
                    }}
                  >
                    Câu chuyện thương hiệu
                  </Typography>
                  <LocalFlorist sx={{ fontSize: 32, color: '#32778E', flexShrink: 0 }} />
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#32778E',
                  lineHeight: 1.8,
                  mb: 2,
                  fontSize: '16px'
                }}
              >
                Chúng tôi khởi đầu từ một niềm tin giản dị: mọi thứ đều mang trong mình một giá trị riêng, chỉ cần được nâng niu và nhìn nhận đúng cách. Vỏ quả sau khi bị bỏ đi, tưởng chừng vô nghĩa, lại có thể trở thành nguồn cảm hứng và chất liệu để kiến tạo nên những sản phẩm bền vững.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#32778E',
                  lineHeight: 1.8,
                  mb: 2,
                  fontSize: '16px'
                }}
              >
                Cũng giống như con người, mỗi cá thể đều có một vẻ đẹp riêng biệt – đôi khi ẩn giấu dưới lớp vỏ ngoài, nhưng luôn có thể được đánh thức và phát triển.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#32778E',
                  lineHeight: 1.8,
                  mb: 4,
                  fontSize: '16px'
                }}
              >
                Là thương hiệu khởi nghiệp mang màu của thiên nhiên số, chúng tôi không chỉ tạo ra sản phẩm, mà còn gửi gắm hi vọng: biến điều tưởng như bỏ đi thành giá trị mới, biến nét đẹp tiềm ẩn thành sức mạnh lan tỏa. Đó chính là cách chúng tôi đồng hành cùng bạn trên hành trình hướng tới một lối sống xanh, bền vững và đầy cảm hứng.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <Box sx={{ py: 8, background: 'transparent' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 'bold', color: '#32778E' }}
            >
              Khách hàng nói gì?
            </Typography>
            <Grid container spacing={4}>
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(50, 119, 142, 0.05)' }}>
                    <Rating value={testimonial.rating || 5} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic', color: '#32778E' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: '#32778E' }}>
                        {testimonial.customerName?.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#32778E' }}>
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
          background: 'transparent',
          color: '#32778E',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: '#32778E' }}>
            Bắt đầu hành trình xanh của bạn
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, color: '#32778E' }}>
            Tham gia cộng đồng Covezi để mua sắm có trách nhiệm và bảo vệ môi trường
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: '#32778E', color: 'white', fontWeight: 'bold', px: 4 }}
              onClick={() => navigate('/register')}
            >
              Đăng ký ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: '#32778E', color: '#32778E', px: 4 }}
              onClick={() => navigate('/garden')}
              endIcon={<ArrowForward />}
            >
              Khám phá vườn ảo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: 'transparent', color: '#32778E' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#32778E' }}>
                {company?.name || 'Covezi'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, color: '#32778E' }}>
                {company?.description || 'Thương mại điện tử xanh'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#32778E' }}>
                Liên kết
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8, color: '#32778E' }}>
                Sản phẩm
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8, color: '#32778E' }}>
                Thử thách
              </Typography>
              <Typography variant="body2" sx={{ display: 'block', mb: 1, opacity: 0.8, color: '#32778E' }}>
                Vườn ảo
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#32778E' }}>
                Kết nối
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {company?.socialLinks?.map((link, index) => (
                  <IconButton
                    key={index}
                    href={link.url}
                    target="_blank"
                    sx={{ color: '#32778E', opacity: 0.8 }}
                  >
                    <Share />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(50, 119, 142, 0.2)' }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8, color: '#32778E' }}>
            © 2025 {company?.name || 'Covezi'}. All rights reserved.
          </Typography>
        </Container>
      </Box>
      </Box>
    </Box>
  )
}

export default Homepage