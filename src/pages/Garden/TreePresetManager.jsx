import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TreeIllustrationV4 from './TreeIllustrationV4'

const TreePresetManager = ({ treeCustomization, onSave, level = 1 }) => {
  const [presets, setPresets] = useState([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(null)

  const STORAGE_KEY = 'garden_tree_presets'

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPresets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load presets:', e)
      }
    }
  }, [])

  // Save current tree customization as a preset
  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      alert('Vui lòng nhập tên cho cây của bạn')
      return
    }

    setLoading(true)
    try {
      const newPreset = {
        id: Date.now(),
        name: presetName,
        customization: { ...treeCustomization },
        createdAt: new Date().toISOString()
      }

      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresets))

      alert(`✨ Đã lưu cây "${presetName}" thành công!`)
      setPresetName('')
      setSaveDialogOpen(false)

      // Trigger callback if provided
      if (onSave) {
        onSave(newPreset)
      }
    } catch (error) {
      console.error('Error saving preset:', error)
      alert('Lỗi khi lưu cây. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Load a preset
  const handleLoadPreset = (preset) => {
    setSelectedPreset(preset)
    if (onSave) {
      onSave(preset)
    }
    alert(`✨ Đã tải cây "${preset.name}" thành công!`)
    setLoadDialogOpen(false)
  }

  // Delete a preset
  const handleDeletePreset = (presetId) => {
    const updatedPresets = presets.filter((p) => p.id !== presetId)
    setPresets(updatedPresets)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresets))
    if (selectedPreset?.id === presetId) {
      setSelectedPreset(null)
    }
    alert('Đã xóa cây thành công!')
  }

  // Clear all presets
  const handleClearAll = () => {
    if (window.confirm('Bạn chắc chắn muốn xóa tất cả cây đã lưu không?')) {
      setPresets([])
      localStorage.removeItem(STORAGE_KEY)
      setSelectedPreset(null)
      alert('Đã xóa tất cả cây')
    }
  }

  return (
    <>
      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={() => setSaveDialogOpen(true)}
          size="small"
        >
          Lưu hình dạng
        </Button>
        <Button
          variant="outlined"
          color="info"
          startIcon={<RestartAltIcon />}
          onClick={() => setLoadDialogOpen(true)}
          disabled={presets.length === 0}
          size="small"
        >
          Tải ({presets.length})
        </Button>
      </Box>

      {/* Save Preset Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => !loading && setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>💾 Lưu hình dạng cây của bạn</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <TreeIllustrationV4 treeCustomization={treeCustomization} level={level} size={120} />
            </Box>
            <TextField
              label="Tên cây"
              placeholder="vd: Hoa hồng đẹp"
              fullWidth
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <Alert severity="info">
              💡 Hình dạng cây sẽ được lưu với loại cây, màu sắc, chậu và hiệu ứng hiện tại.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSavePreset}
            variant="contained"
            color="success"
            disabled={loading || !presetName.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Preset Dialog */}
      <Dialog
        open={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>📂 Tải hình dạng cây đã lưu</DialogTitle>
        <DialogContent>
          {presets.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Bạn chưa lưu hình dạng cây nào. Hãy tạo một cây đẹp và lưu nó!
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {presets.map((preset) => (
                  <ListItem
                    key={preset.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeletePreset(preset.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    disablePadding
                    sx={{ mb: 1 }}
                  >
                    <ListItemButton
                      onClick={() => handleLoadPreset(preset)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        pr: 7
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box sx={{ minWidth: 80, display: 'flex', justifyContent: 'center' }}>
                          <TreeIllustrationV4
                            treeCustomization={preset.customization}
                            level={1}
                            size={60}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <ListItemText
                            primary={preset.name}
                            secondary={
                              <>
                                <Chip
                                  label={
                                    preset.customization.treeType === 'rose'
                                      ? '🌹 Hoa hồng'
                                      : preset.customization.treeType === 'lavender'
                                        ? '💜 Hoa oải hương'
                                        : preset.customization.treeType === 'banyan'
                                          ? '🌳 Cây đa'
                                          : preset.customization.treeType === 'bamboo'
                                            ? '🎋 Tre'
                                            : preset.customization.treeType === 'cactus'
                                              ? '🌵 Xương rồng'
                                              : preset.customization.treeType === 'sunflower'
                                                ? '🌻 Hoa hướng dương'
                                                : preset.customization.treeType === 'orchid'
                                                  ? '🌸 Hoa phong lan'
                                                  : preset.customization.treeType === 'moneyPlant'
                                                    ? '💚 Cây tiền'
                                                    : preset.customization.treeType === 'jade'
                                                      ? '💎 Ngọc'
                                                      : '🌷 Hoa mẫu đơn'
                                  }
                                  size="small"
                                  sx={{ mr: 1, mt: 0.5 }}
                                />
                                <Chip
                                  label={`Chậu: ${preset.customization.potColor}`}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              </>
                            }
                          />
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                color="error"
                onClick={handleClearAll}
                sx={{ mt: 2 }}
              >
                🗑️ Xóa tất cả
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoadDialogOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Current selection indicator */}
      {selectedPreset && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✨ Đang sử dụng: <strong>{selectedPreset.name}</strong>
        </Alert>
      )}
    </>
  )
}

export default TreePresetManager
