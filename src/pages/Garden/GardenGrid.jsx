import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  CircularProgress,
  LinearProgress,
  Typography
} from '@mui/material'
import TreeIllustrationV4 from './TreeIllustrationV4'
import XpTransaction from '~/components/Garden/XpTransaction'
import { gamificationAPI } from '~/apis/index'
import {
  addGameNotification,
  createXpNotification,
  createLevelUpNotification,
  createVoucherNotification
} from '~/utils/gamificationNotificationHelper'

// Helper function to get tree stage based on level
const getTreeStage = (level) => {
  if (level <= 20) return 1 // Sprout
  if (level <= 80) return 2 // Young
  if (level <= 200) return 3 // Mature
  if (level <= 500) return 4 // Epic
  return 5 // Legendary
}

// Helper function to get voucher percentage based on level milestones
const getVoucherForLevel = (level) => {
  if (level >= 500) return 50
  if (level >= 200) return 30
  if (level >= 80) return 20
  if (level >= 20) return 10
  return 5
}

const GardenGrid = ({ garden, treeCustomization, onRefresh, onGardenUpdate }) => {
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [plantDialogOpen, setPlantDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [xpTransactions, setXpTransactions] = useState([])
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)

  // Get or initialize plots
  const plots = garden?.gardenPlots || []
  const currentLevel = garden?.level || 1

  // Trigger XP transaction animation
  const triggerXpTransaction = (xpAmount, action, x, y) => {
    const id = `${Date.now()}-${Math.random()}`
    const transaction = { id, xpAmount, action, x, y }
    setXpTransactions(prev => [...prev, transaction])
    
    // Remove transaction after animation
    setTimeout(() => {
      setXpTransactions(prev => prev.filter(t => t.id !== id))
    }, 1500)
  }

  // Show level-up celebration
  const showLevelUpCelebration = (newLevel, voucherEarned, treeStageUpgrade, landUnlock) => {
    setLevelUpData({
      newLevel,
      voucherEarned,
      treeStageUpgrade,
      landUnlock
    })
    setShowLevelUpAlert(true)
    
    // Auto close after 5 seconds
    setTimeout(() => setShowLevelUpAlert(false), 5000)

    // Create and track notification
    const levelUpNotif = createLevelUpNotification(newLevel, treeStageUpgrade, landUnlock)
    addGameNotification(levelUpNotif)
    
    if (voucherEarned) {
      const voucherNotif = createVoucherNotification(
        voucherEarned.discount,
        newLevel,
        voucherEarned.code,
        voucherEarned.expiresAt
      )
      addGameNotification(voucherNotif)
    }
  }



  // Plant tree in selected plot
  const handlePlantTree = async () => {
    if (!selectedPlot) return

    try {
      setIsLoading(true)
      const response = await gamificationAPI.plantTreeInPlot(selectedPlot, {
        treeCustomization
      })

      // Trigger XP transaction animation
      triggerXpTransaction(response.xpGained || 0, 'Planted', 250, 200)

      // Track XP notification
      if (response.xpGained) {
        const xpNotif = createXpNotification(
          response.xpGained,
          'Plant Tree',
          response.garden?.currentXp || 0,
          response.garden?.nextLevelXp || 100
        )
        addGameNotification(xpNotif)
      }

      // Update garden with new level/XP info if returned
      if (response.garden) {
        onGardenUpdate?.(response.garden)

        // Show level-up notification if applicable
        if (response.leveledUp) {
          showLevelUpCelebration(
            response.newLevel,
            response.voucherEarned,
            response.treeStageUpgrade,
            response.landUnlock
          )
        }
      }

      setPlantDialogOpen(false)
      onRefresh?.()
    } catch (error) {
      console.error('Error planting tree:', error)
      alert('Lỗi khi trồng cây: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Water or fertilize tree in plot
  const handleTreeAction = async (plotId, action) => {
    try {
      setIsLoading(true)
      await gamificationAPI.performGardenAction(plotId, action)
      onRefresh?.()
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      alert(`Lỗi khi ${action}: ` + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Harvest tree
  const handleHarvestTree = async (plotId) => {
    try {
      setIsLoading(true)
      const response = await gamificationAPI.harvestGardenTree(plotId)
      
      // Trigger XP transaction animation from tree position
      triggerXpTransaction(response.xpGained, 'Harvest', 250, 200)
      
      // Track XP notification
      const xpNotif = createXpNotification(
        response.xpGained,
        'Tree Harvest',
        response.garden?.currentXp || 0,
        response.garden?.nextLevelXp || 100
      )
      addGameNotification(xpNotif)
      
      // Update garden data with new level/XP/voucher info
      if (response.garden) {
        onGardenUpdate?.(response.garden)
        
        // Show level-up notification if applicable
        if (response.leveledUp) {
          showLevelUpCelebration(
            response.newLevel,
            response.voucherEarned,
            response.treeStageUpgrade,
            response.landUnlock
          )
        }
      }
      
      onRefresh?.()
    } catch (error) {
      console.error('Error harvesting tree:', error)
      alert('Lỗi khi thu hoạch: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Garden Background - Professional Game Style */}
      <Card
        sx={{
          background: `
            linear-gradient(180deg, #E0F4FF 0%, #E8F3FF 40%, #F0F8FF 100%)
          `,
          border: '8px solid #B6349A',
          borderRadius: '24px',
          boxShadow: `
            0 20px 60px rgba(182, 52, 154, 0.2),
            inset 0 2px 10px rgba(255, 255, 255, 0.8)
          `,
          overflow: 'hidden',
          maxWidth: 800,
          minHeight: 700,
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Decorative sun */}
        <Box
          sx={{
            position: 'absolute',
            top: '12%',
            right: '15%',
            width: '70px',
            height: '70px',
            background: 'radial-gradient(circle, #FFD700 0%, #FFA500 70%, rgba(255, 165, 0, 0) 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.7)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Butterfly 1 - Trái trên */}
        <Box
          sx={{
            position: 'absolute',
            top: '18%',
            left: '12%',
            fontSize: '28px',
            animation: 'flutter 3s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes flutter': {
              '0%': { transform: 'translateY(0px) translateX(0px)' },
              '25%': { transform: 'translateY(-15px) translateX(10px)' },
              '50%': { transform: 'translateY(0px) translateX(0px)' },
              '75%': { transform: 'translateY(-10px) translateX(-8px)' },
              '100%': { transform: 'translateY(0px) translateX(0px)' }
            }
          }}
        >
          🦋
        </Box>

        {/* Butterfly 2 - Phải giữa */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            right: '10%',
            fontSize: '24px',
            animation: 'flutter 4s ease-in-out infinite',
            animationDelay: '0.5s',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes flutter': {
              '0%': { transform: 'translateY(0px)' },
              '25%': { transform: 'translateY(-20px)' },
              '50%': { transform: 'translateY(0px)' },
              '75%': { transform: 'translateY(-15px)' },
              '100%': { transform: 'translateY(0px)' }
            }
          }}
        >
          🦋
        </Box>

        {/* Bee 1 - Trái giữa */}
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '18%',
            fontSize: '20px',
            animation: 'buzz 2.5s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes buzz': {
              '0%': { transform: 'translateY(0px) translateX(0px)' },
              '33%': { transform: 'translateY(-12px) translateX(8px)' },
              '66%': { transform: 'translateY(-6px) translateX(-6px)' },
              '100%': { transform: 'translateY(0px) translateX(0px)' }
            }
          }}
        >
          🐝
        </Box>

        {/* Bee 2 - Phải trên */}
        <Box
          sx={{
            position: 'absolute',
            top: '22%',
            right: '22%',
            fontSize: '18px',
            animation: 'buzz 3s ease-in-out infinite',
            animationDelay: '1s',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes buzz': {
              '0%': { transform: 'translateY(0px)' },
              '33%': { transform: 'translateY(-10px)' },
              '66%': { transform: 'translateY(-5px)' },
              '100%': { transform: 'translateY(0px)' }
            }
          }}
        >
          🐝
        </Box>

        {/* Butterfly 3 - Dưới phải */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '18%',
            fontSize: '26px',
            animation: 'flutter 3.5s ease-in-out infinite',
            animationDelay: '1.5s',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes flutter': {
              '0%': { transform: 'translateY(0px)' },
              '25%': { transform: 'translateY(-18px)' },
              '50%': { transform: 'translateY(0px)' },
              '75%': { transform: 'translateY(-12px)' },
              '100%': { transform: 'translateY(0px)' }
            }
          }}
        >
          🦋
        </Box>

        {/* Bee 3 - Dưới trái */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '14%',
            fontSize: '19px',
            animation: 'buzz 2.8s ease-in-out infinite',
            animationDelay: '0.7s',
            pointerEvents: 'none',
            zIndex: 2,
            '@keyframes buzz': {
              '0%': { transform: 'translateY(0px)' },
              '33%': { transform: 'translateY(-11px)' },
              '66%': { transform: 'translateY(-5px)' },
              '100%': { transform: 'translateY(0px)' }
            }
          }}
        >
          🐝
        </Box>



        <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
          {/* Tree Name Label */}
          <Box
            sx={{
              mb: 2,
              p: '8px 14px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(182, 52, 154, 0.6)',
              borderRadius: '8px',
              display: 'inline-block',
              fontSize: '13px',
              color: '#32778E',
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {treeCustomization?.name || 'Cây của tôi'}
          </Box>

          {/* Main Tree Display - Centered & Balanced */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                p: 3,
                borderRadius: '16px',
                border: '3px solid #B6349A',
                boxShadow: '0 10px 30px rgba(182, 52, 154, 0.15), inset 0 1px 6px rgba(255, 255, 255, 0.6)',
                background: 'rgba(255, 255, 255, 0.02)',
                position: 'relative'
              }}
            >
              {/* XP Transaction Animations */}
              {xpTransactions.map(transaction => (
                <XpTransaction
                  key={transaction.id}
                  xp={transaction.xpAmount}
                  x={transaction.x}
                  y={transaction.y}
                  action={transaction.action}
                />
              ))}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: currentLevel >= 300 ? 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.8))' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                  transition: 'all 0.3s ease',
                  animation: 'sway 3s ease-in-out infinite',
                  '@keyframes sway': {
                    '0%': { transform: 'translateX(0px)' },
                    '25%': { transform: 'translateX(4px)' },
                    '50%': { transform: 'translateX(0px)' },
                    '75%': { transform: 'translateX(-4px)' },
                    '100%': { transform: 'translateX(0px)' }
                  }
                }}
              >
                <TreeIllustrationV4
                  level={currentLevel}
                  treeCustomization={treeCustomization}
                  size={Math.min(100 + currentLevel * 2.2, 300)}
                  treeStage={getTreeStage(currentLevel)}
                />
              </Box>
            </Box>

            {/* Plot Grid */}
            {/* REMOVED - Only showing main tree now */}
          </Box>

          {/* Progress Info Bar - Clean Design */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              background: 'linear-gradient(135deg, rgba(182, 52, 154, 0.08) 0%, rgba(255, 140, 60, 0.06) 100%)',
              borderRadius: '12px',
              border: '1.5px solid rgba(182, 52, 154, 0.4)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(182, 52, 154, 0.1)'
            }}
          >
            {/* Level & Progress Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: '#32778E', textShadow: '0 2px 4px rgba(0,0,0,0.5)', minWidth: '40px', textAlign: 'center' }}>
                  {currentLevel}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                  <Box sx={{ fontSize: '11px', color: '#32778E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    LEVEL
                  </Box>
                  <Box sx={{ fontSize: '12px', color: '#32778E', fontWeight: 600 }}>
                    {currentLevel <= 20 && '🌱 SPROUT'}
                    {currentLevel > 20 && currentLevel <= 80 && '🌿 YOUNG'}
                    {currentLevel > 80 && currentLevel <= 200 && '🌳 MATURE'}
                    {currentLevel > 200 && currentLevel <= 500 && '✨ EPIC'}
                    {currentLevel > 500 && '👑 LEGENDARY'}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ fontSize: '10px', color: '#AAA', fontWeight: 500, mb: 0.3 }}>
                  VOUCHER REWARD
                </Box>
                <Box sx={{ fontSize: '18px', fontWeight: 'bold', color: '#FF6B9D', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                  {getVoucherForLevel(currentLevel)}%
                </Box>
              </Box>
            </Box>

            {/* Progress Bar */}
            <Box
              sx={{
                height: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1.5px solid rgba(182, 52, 154, 0.8)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                mb: 1
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #B6349A 0%, #FF8C3C 50%, #FF001A 100%)',
                  width: `${Math.min(((garden?.currentXp || 0) / (garden?.nextLevelXp || 100)) * 100, 100)}%`,
                  borderRadius: '6px',
                  boxShadow: '0 0 12px rgba(182, 52, 154, 0.6)',
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>

            {/* Progress Text */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#32778E' }}>
              <Box>
                {Math.round(((garden?.currentXp || 0) / (garden?.nextLevelXp || 100)) * 100)}% đến Level {currentLevel + 1}
              </Box>
              <Box>
                {garden?.currentXp || 0} / {garden?.nextLevelXp || 100} XP
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Level-Up Celebration Alert */}
      {showLevelUpAlert && levelUpData && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            animation: 'scaleIn 0.5s ease-out',
            '@keyframes scaleIn': {
              '0%': { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
              '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
            }
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
              minWidth: 400,
              p: 3,
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(255, 107, 107, 0.4)',
              borderRadius: '20px',
              border: '3px solid #FF6B6B'
            }}
          >
            <Box sx={{ fontSize: '64px', mb: 1, animation: 'bounce 1s ease infinite' }}>
              🎉
            </Box>
            <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)', mb: 1 }}>
              Level UP!
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', textShadow: '0 1px 5px rgba(0,0,0,0.2)', mb: 2 }}>
              Level {levelUpData.newLevel} 🌟
            </Typography>
            
            {levelUpData.treeStageUpgrade && (
              <Box sx={{ mb: 2, p: 1.5, background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                  🌳 {levelUpData.treeStageUpgrade}
                </Typography>
              </Box>
            )}

            {levelUpData.landUnlock && (
              <Box sx={{ mb: 2, p: 1.5, background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                  🌿 Unlock {levelUpData.landUnlock.newPlots} Garden Plots!
                </Typography>
              </Box>
            )}

            {levelUpData.voucherEarned && (
              <Box sx={{ p: 1.5, background: 'rgba(255, 255, 255, 0.3)', borderRadius: '10px', border: '2px solid white' }}>
                <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                  🎁 Voucher Earned!
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                  {levelUpData.voucherEarned.discount}% OFF
                </Typography>
                <Typography variant="caption" sx={{ color: 'white' }}>
                  Code: {levelUpData.voucherEarned.code}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}

      {/* Selected Plot Details Dialog */}
      {selectedPlot && plots.find(p => p.plotId === selectedPlot)?.treeId && (
        <PlotDetailsDialog
          plot={plots.find(p => p.plotId === selectedPlot)}
          plotId={selectedPlot}
          open={!!selectedPlot && !plantDialogOpen}
          onClose={() => setSelectedPlot(null)}
          onWater={() => handleTreeAction(selectedPlot, 'water')}
          onFertilize={() => handleTreeAction(selectedPlot, 'fertilize')}
          onHarvest={() => {
            handleHarvestTree(selectedPlot)
            setSelectedPlot(null)
          }}
          isLoading={isLoading}
        />
      )}

      {/* Plant Tree Dialog */}
      <Dialog open={plantDialogOpen} onClose={() => setPlantDialogOpen(false)}>
        <DialogTitle>🌱 Trồng cây vào ô {selectedPlot}</DialogTitle>
        <DialogContent sx={{ minWidth: '400px', textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 2, fontSize: '12px', color: '#666' }}>
            Cây sẽ bắt đầu từ cấp độ 1 (hạt giống nhỏ) và lớn lên theo thời gian
          </Box>

          {/* Tree Preview */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <TreeIllustrationV4
              level={1}
              treeCustomization={treeCustomization}
              size={150}
              treeStage={getTreeStage(1)}
            />
          </Box>

          <Box sx={{ fontSize: '13px', color: '#333', textAlign: 'left', mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <strong>Tên cây:</strong> {treeCustomization?.name || 'Cây của tôi'}
            </Box>
            <Box sx={{ mb: 1 }}>
              <strong>Màu lá:</strong> {treeCustomization?.color || 'Xanh cây'}
            </Box>
            <Box>
              <strong>Chậu:</strong> {treeCustomization?.potType || 'Chậu đất'}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlantDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handlePlantTree}
            variant="contained"
            disabled={isLoading}
            sx={{ background: '#4CAF50' }}
          >
            {isLoading ? <CircularProgress size={20} /> : '🌱 Trồng cây'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Plot Details Component
const PlotDetailsDialog = ({ plot, open, onClose, onWater, onFertilize, onHarvest, isLoading }) => {
  const isReady = plot?.xpProgress >= 100

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {plot?.treeName || 'Cây'} - Cấp độ {plot?.level || 1}
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {/* Tree Preview */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <TreeIllustrationV4
            level={plot?.level || 1}
            treeCustomization={plot?.treeCustomization}
            size={180}
            treeStage={(() => {
              const level = plot?.level || 1
              if (level <= 20) return 1
              if (level <= 80) return 2
              if (level <= 200) return 3
              if (level <= 500) return 4
              return 5
            })()}
          />
        </Box>

        {/* Tree Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, background: '#F1F8E9', border: '1px solid #4CAF50' }}>
              <Box sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Sức khỏe</Box>
              <LinearProgress
                variant="determinate"
                value={plot?.health || 100}
                sx={{ mb: 1, height: '6px', borderRadius: '3px' }}
              />
              <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#4CAF50' }}>
                {plot?.health || 100}%
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 1.5, background: '#FFF9C4', border: '1px solid #FFD54F' }}>
              <Box sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Kinh nghiệm</Box>
              <LinearProgress
                variant="determinate"
                value={(plot?.currentXp || 0) / (plot?.requiredXp || 100) * 100}
                sx={{ mb: 1, height: '6px', borderRadius: '3px' }}
              />
              <Box sx={{ fontSize: '13px', fontWeight: 'bold', color: '#FFD54F' }}>
                {plot?.currentXp || 0} / {plot?.requiredXp || 100}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Status */}
        {isReady && (
          <Box sx={{ mb: 2, p: 1.5, background: '#E8F5E9', border: '2px solid #4CAF50', borderRadius: '8px' }}>
            <Box sx={{ fontSize: '14px', fontWeight: 'bold', color: '#2E7D32' }}>
              ✨ Cây sẵn sàng để nâng cấp!
            </Box>
          </Box>
        )}

        {/* Tree Care Info */}
        <Box sx={{ fontSize: '12px', color: '#999', mb: 3, textAlign: 'left' }}>
          <Box sx={{ mb: 1 }}>
            <strong>Trồng lúc:</strong> {plot?.plantedAt ? new Date(plot.plantedAt).toLocaleDateString('vi-VN') : 'N/A'}
          </Box>
          {plot?.lastWatered && (
            <Box>
              <strong>Tưới lần cuối:</strong> {new Date(plot.lastWatered).toLocaleString('vi-VN')}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Đóng
        </Button>
        <Button
          onClick={onWater}
          variant="contained"
          size="small"
          disabled={isLoading}
          sx={{ background: '#2196F3' }}
        >
          💧 Tưới
        </Button>
        <Button
          onClick={onFertilize}
          variant="contained"
          size="small"
          disabled={isLoading}
          sx={{ background: '#8B4513' }}
        >
          🥕 Bón
        </Button>
        {isReady && (
          <Button
            onClick={onHarvest}
            variant="contained"
            size="small"
            disabled={isLoading}
            sx={{ background: '#FF9800' }}
          >
            🌾 Thu hoạch
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default GardenGrid
