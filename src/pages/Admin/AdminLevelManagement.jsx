import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import { API_ENDPOINT } from '~/apis'
import { gamificationAPI } from '~/apis'
import { toast } from 'react-toastify'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  )
}

function AdminLevelManagement() {
  const [tabValue, setTabValue] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Challenges for level
  const [levelChallenges, setLevelChallenges] = useState([])
  const [openChallengeDialog, setOpenChallengeDialog] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [allChallenges, setAllChallenges] = useState([])

  // Products for level
  const [levelProducts, setLevelProducts] = useState([])
  const [openProductDialog, setOpenProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])

  // Vouchers for level
  const [levelVouchers, setLevelVouchers] = useState([])
  const [openVoucherDialog, setOpenVoucherDialog] = useState(false)
  const [voucherForm, setVoucherForm] = useState({
    requiredLevel: 1,
    discountPercent: 10,
    voucherName: '',
    validityDays: 90,
  })

  const token = localStorage.getItem('token')
  const maxLevel = 10000

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchAllChallenges(),
        fetchAllProducts(),
        fetchLevelData(selectedLevel),
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllChallenges = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/challenges?page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAllChallenges(data.data || [])
      }
    } catch (err) {
      console.error('Error fetching challenges:', err)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/v1/products?page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAllProducts(data.data?.products || [])
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const fetchLevelData = async (level) => {
    try {
      // Fetch level-specific data from localStorage or backend
      const savedData = localStorage.getItem(`level_${level}_data`)
      if (savedData) {
        const data = JSON.parse(savedData)
        setLevelChallenges(data.challenges || [])
        setLevelProducts(data.products || [])
        setLevelVouchers(data.vouchers || [])
      }
    } catch (err) {
      console.error('Error fetching level data:', err)
    }
  }

  const handleLevelChange = (event) => {
    const level = event.target.value
    setSelectedLevel(level)
    fetchLevelData(level)
  }

  // Challenge Management
  const handleAddChallenge = (challenge) => {
    if (!levelChallenges.find(c => c._id === challenge._id)) {
      const updated = [...levelChallenges, challenge]
      setLevelChallenges(updated)
      saveLevelData(updated, levelProducts, levelVouchers)
      toast.success('Challenge added to level')
    } else {
      toast.warning('Challenge already added to this level')
    }
    setOpenChallengeDialog(false)
  }

  const handleRemoveChallenge = (challengeId) => {
    const updated = levelChallenges.filter(c => c._id !== challengeId)
    setLevelChallenges(updated)
    saveLevelData(updated, levelProducts, levelVouchers)
  }

  // Product Management
  const handleAddProduct = (product) => {
    if (!levelProducts.find(p => p._id === product._id)) {
      const updated = [...levelProducts, product]
      setLevelProducts(updated)
      saveLevelData(levelChallenges, updated, levelVouchers)
      toast.success('Product added to level')
    } else {
      toast.warning('Product already added to this level')
    }
    setOpenProductDialog(false)
  }

  const handleRemoveProduct = (productId) => {
    const updated = levelProducts.filter(p => p._id !== productId)
    setLevelProducts(updated)
    saveLevelData(levelChallenges, updated, levelVouchers)
  }

  // Voucher Management
  const handleAddVoucher = async () => {
    if (!voucherForm.voucherName) {
      toast.error('Please enter voucher name')
      return
    }
    
    try {
      // Sync to backend
      await gamificationAPI.updateVoucherMilestone(
        selectedLevel,
        voucherForm.discountPercent,
        voucherForm.voucherName
      )
      
      const newVoucher = {
        _id: Date.now().toString(),
        ...voucherForm,
        createdAt: new Date().toISOString(),
      }
      const updated = [...levelVouchers, newVoucher]
      setLevelVouchers(updated)
      saveLevelData(levelChallenges, levelProducts, updated)
      setVoucherForm({
        requiredLevel: selectedLevel,
        discountPercent: 10,
        voucherName: '',
        validityDays: 90,
      })
      setOpenVoucherDialog(false)
      toast.success('Voucher added and synced to backend')
    } catch (error) {
      toast.error('Failed to sync voucher to backend')
      console.error(error)
    }
  }

  const handleRemoveVoucher = async (voucherId) => {
    try {
      // Find the voucher to get its level
      const voucher = levelVouchers.find(v => v._id === voucherId)
      if (!voucher) return

      // Sync deletion to backend
      await gamificationAPI.deleteVoucherMilestone(selectedLevel)

      const updated = levelVouchers.filter(v => v._id !== voucherId)
      setLevelVouchers(updated)
      saveLevelData(levelChallenges, levelProducts, updated)
      toast.success('Voucher deleted and synced')
    } catch (error) {
      toast.error('Failed to sync deletion to backend')
      console.error(error)
    }
  }

  const handleSyncAllVouchers = async () => {
    setLoading(true)
    try {
      // Sync all vouchers for current level
      for (const voucher of levelVouchers) {
        await gamificationAPI.updateVoucherMilestone(
          selectedLevel,
          voucher.discountPercent,
          voucher.voucherName
        )
      }
      toast.success(`All vouchers for Level ${selectedLevel} synced to backend`)
    } catch (error) {
      toast.error('Failed to sync vouchers')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const saveLevelData = (challenges, products, vouchers) => {
    const data = { challenges, products, vouchers }
    localStorage.setItem(`level_${selectedLevel}_data`, JSON.stringify(data))
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Level Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Level</InputLabel>
              <Select
                value={selectedLevel}
                label="Select Level"
                onChange={handleLevelChange}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(level => (
                  <MenuItem key={level} value={level}>
                    Level {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              💡 Configure challenges, products, and vouchers for Level {selectedLevel}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for Challenge, Product, Voucher */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`🎯 Challenges (${levelChallenges.length})`} />
          <Tab label={`📦 Products (${levelProducts.length})`} />
          <Tab label={`🎁 Vouchers (${levelVouchers.length})`} />
        </Tabs>
      </Paper>

      {/* Challenges Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenChallengeDialog(true)}
          >
            Add Challenge
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Challenge</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Participants</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levelChallenges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2, color: '#999' }}>
                    No challenges assigned to this level
                  </TableCell>
                </TableRow>
              ) : (
                levelChallenges.map((challenge) => (
                  <TableRow key={challenge._id}>
                    <TableCell>
                      <Box sx={{ fontWeight: '600' }}>{challenge.title}</Box>
                      <Box sx={{ fontSize: '12px', color: '#666' }}>{challenge.description?.substring(0, 40)}...</Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={challenge.type || 'N/A'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip label={challenge.participants?.length || 0} size="small" color="primary" />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveChallenge(challenge._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Products Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenProductDialog(true)}
          >
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levelProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2, color: '#999' }}>
                    No products assigned to this level
                  </TableCell>
                </TableRow>
              ) : (
                levelProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box sx={{ fontWeight: '600' }}>{product.name}</Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ fontWeight: '600', color: '#2e7d32' }}>
                        {product.price?.toLocaleString()} VND
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Vouchers Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenVoucherDialog(true)}
          >
            Create Voucher
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleSyncAllVouchers}
            disabled={levelVouchers.length === 0}
          >
            Sync to Backend
          </Button>
        </Box>

        <Grid container spacing={2}>
          {levelVouchers.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">No vouchers created for this level</Alert>
            </Grid>
          ) : (
            levelVouchers.map((voucher) => (
              <Grid item xs={12} sm={6} md={4} key={voucher._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {voucher.voucherName}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveVoucher(voucher._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        📊 Discount: <strong>{voucher.discountPercent}%</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        ⏱️ Valid for: <strong>{voucher.validityDays} days</strong>
                      </Typography>
                    </Box>
                    <Chip
                      label={`Level ${voucher.requiredLevel}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      {/* Add Challenge Dialog */}
      <Dialog open={openChallengeDialog} onClose={() => setOpenChallengeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Challenge</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search challenges..."
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {allChallenges.map((challenge) => (
              <Paper
                key={challenge._id}
                onClick={() => handleAddChallenge(challenge)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
              >
                <Box sx={{ fontWeight: '600' }}>{challenge.title}</Box>
                <Box sx={{ fontSize: '12px', color: '#666' }}>
                  Type: {challenge.type} | Participants: {challenge.participants?.length || 0}
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChallengeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Product</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {allProducts.map((product) => (
              <Paper
                key={product._id}
                onClick={() => handleAddProduct(product)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
              >
                <Box sx={{ fontWeight: '600' }}>{product.name}</Box>
                <Box sx={{ fontSize: '12px', color: '#666' }}>
                  Price: {product.price?.toLocaleString()} VND | Category: {product.category}
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Voucher Dialog */}
      <Dialog open={openVoucherDialog} onClose={() => setOpenVoucherDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Level Voucher</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Voucher Name"
              value={voucherForm.voucherName}
              onChange={(e) => setVoucherForm({ ...voucherForm, voucherName: e.target.value })}
              fullWidth
              size="small"
              placeholder="e.g., Level 5 Eco Discount"
            />
            <TextField
              label="Discount Percent"
              type="number"
              value={voucherForm.discountPercent}
              onChange={(e) => setVoucherForm({ ...voucherForm, discountPercent: parseInt(e.target.value) })}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 100 }}
            />
            <TextField
              label="Validity Days"
              type="number"
              value={voucherForm.validityDays}
              onChange={(e) => setVoucherForm({ ...voucherForm, validityDays: parseInt(e.target.value) })}
              fullWidth
              size="small"
              inputProps={{ min: 1 }}
            />
            <Alert severity="info">
              This voucher will be assigned to Level {selectedLevel} users
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVoucherDialog(false)}>Cancel</Button>
          <Button onClick={handleAddVoucher} variant="contained">
            Create Voucher
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminLevelManagement
