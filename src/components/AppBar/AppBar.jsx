import { useState } from 'react'
import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputBase,
  Paper
} from '@mui/material'
import {
  Home,
  ShoppingBag,
  EmojiEvents,
  Park,
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  Logout,
  Settings,
  Notifications,
  Favorite,
  LocalShipping,
  Close,
  Dashboard
} from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import GamificationNotifications from './Notifications/GamificationNotifications'

const navItems = [
  { label: 'Trang chủ', path: '/', icon: <Home /> },
  { label: 'Sản phẩm', path: '/products', icon: <ShoppingBag /> },
  { label: 'Thử thách', path: '/challenges', icon: <EmojiEvents /> },
  { label: 'Vườn của tôi', path: '/garden', icon: <Park />, protected: true }
]

function AppBar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null)
  }

  const handleLogout = () => {
    dispatch(logoutUserAPI())
    handleProfileMenuClose()
    navigate('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <MuiAppBar
        position="sticky"
        elevation={4}
        sx={{
          bgcolor: 'white'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
          {/* Left Section - Logo & Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Box
                component="img"
                src="/src/assets/Covezi_Logo.png"
                alt="Covezi Logo"
                sx={{
                  height: 40,
                  width: 'auto',
                  display: 'block'
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {navItems.map((item) => {
                  // Hide protected items for non-logged users
                  if (item.protected && !currentUser) return null

                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: '#063B71',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                        bgcolor: isActive(item.path) ? 'rgba(6, 59, 113, 0.1)' : 'transparent',
                        borderBottom: isActive(item.path) ? '3px solid #063B71' : 'none',
                        '&:hover': {
                          bgcolor: 'rgba(6, 59, 113, 0.08)'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                })}
              </Box>
            )}
          </Box>

          {/* Right Section - Cart, User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 } }}>
            {/* Mode Select */}
            <ModeSelect />

            {/* Cart */}
            {currentUser && (
              <IconButton
                sx={{
                  color: '#063B71',
                  bgcolor: isActive('/cart') ? 'rgba(6, 59, 113, 0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(6, 59, 113, 0.08)' }
                }}
                component={Link}
                to="/cart"
              >
                <Badge badgeContent={0} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            )}

            {/* Notifications */}
            {currentUser && (
              <GamificationNotifications />
            )}

            {/* User Profile / Login */}
            {currentUser ? (
              <>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    src={currentUser.avatar}
                    sx={{
                      width: 36,
                      height: 36,
                      border: '2px solid white',
                      bgcolor: '#ff9800'
                    }}
                  >
                    {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {currentUser.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { navigate('/garden'); handleProfileMenuClose() }}>
                    <ListItemIcon><Park fontSize="small" /></ListItemIcon>
                    Vườn của tôi
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleProfileMenuClose() }}>
                    <ListItemIcon><LocalShipping fontSize="small" /></ListItemIcon>
                    Đơn hàng
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/favorites'); handleProfileMenuClose() }}>
                    <ListItemIcon><Favorite fontSize="small" /></ListItemIcon>
                    Yêu thích
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/settings/account'); handleProfileMenuClose() }}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    Cài đặt
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  {currentUser?.email?.includes('admin') && (
                    <MenuItem onClick={() => { navigate('/admin'); handleProfileMenuClose() }} sx={{ color: 'info.main' }}>
                      <ListItemIcon><Dashboard fontSize="small" sx={{ color: 'info.main' }} /></ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Đăng nhập
                </Button>
                {!isMobile && (
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      color: '#2e7d32',
                      textTransform: 'none',
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    Đăng ký
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>
      </MuiAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#f5f7fa' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            component="img"
            src="/src/assets/Covezi_Logo.png"
            alt="Covezi Logo"
            sx={{
              height: 36,
              width: 'auto',
              display: 'block'
            }}
          />
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />

        {currentUser && (
          <>
            <Box sx={{ p: 2, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={currentUser.avatar}
                  sx={{ width: 48, height: 48, bgcolor: '#ff9800' }}
                >
                  {currentUser.displayName?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">{currentUser.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </>
        )}

        <List>
          {navItems.map((item) => {
            if (item.protected && !currentUser) return null
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  selected={isActive(item.path)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      borderRight: '3px solid #4caf50'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? '#4caf50' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 'bold' : 'normal'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        {currentUser && (
          <>
            <Divider sx={{ my: 1 }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon><LocalShipping /></ListItemIcon>
                  <ListItemText primary="Đơn hàng" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/settings/account"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon><Settings /></ListItemIcon>
                  <ListItemText primary="Cài đặt" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon><Logout color="error" /></ListItemIcon>
                  <ListItemText primary="Đăng xuất" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}

        {!currentUser && (
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{ mb: 1, bgcolor: '#4caf50' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng nhập
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng ký
            </Button>
          </Box>
        )}
      </Drawer>

      {/* Mobile Search Dialog */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: { p: 2 }
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: 3,
            border: '1px solid #e0e0e0'
          }}
          elevation={0}
        >
          <Search sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            autoFocus
            fullWidth
            placeholder="Tìm kiếm sản phẩm, thử thách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
          <IconButton size="small" onClick={() => setSearchOpen(false)}>
            <Close />
          </IconButton>
        </Paper>
      </Drawer>
    </>
  )
}

export default AppBar