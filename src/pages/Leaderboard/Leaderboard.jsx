import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  TablePagination,
  Divider
} from '@mui/material'
import {
  EmojiEvents,
  LocalFlorist,
  TrendingUp
} from '@mui/icons-material'
import AppBar from '~/components/AppBar/AppBar'
import { gamificationAPI } from '~/apis'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  useEffect(() => {
    fetchLeaderboardData()
  }, [page, rowsPerPage])

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true)
      const [leaderboardRes, rankRes] = await Promise.all([
        gamificationAPI.getLeaderboard(rowsPerPage, page * rowsPerPage),
        gamificationAPI.getUserRank()
      ])
      setLeaderboard(leaderboardRes.data || [])
      setUserRank(rankRes.data || rankRes)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return '#F5F5F5'
  }

  return (
    <Box sx={{ backgroundColor: '#F8FCFD', minHeight: '100vh', pb: 4 }}>
      <AppBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ color: '#063B71', fontWeight: 'bold', mb: 2 }}>
            🏆 Leaderboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Top challengers farming and earning points. Where will you rank?
          </Typography>
        </Box>

        {/* User's Rank Card */}
        {userRank && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  #{userRank.rank}
                </Typography>
                <Typography variant="body1">Your Rank</Typography>
              </Box>
              <Divider
                orientation="vertical"
                sx={{ height: 60, backgroundColor: 'rgba(255,255,255,0.5)' }}
              />
              <Stack spacing={1} flex={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {userRank.name}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip
                    label={`${userRank.points} Points`}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  />
                  <Chip
                    label={`Level ${userRank.level}`}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  />
                  <Chip
                    label={`Tree Stage ${userRank.treeStage}`}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Leaderboard Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : leaderboard.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No leaderboard data available
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#063B71' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Points
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Level
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Tree Stage
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                        Challenges
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((user, index) => {
                      const actualRank = page * rowsPerPage + index + 1
                      return (
                        <TableRow
                          key={user._id}
                          sx={{
                            backgroundColor: getRankColor(actualRank),
                            '&:hover': {
                              backgroundColor: '#F0F0F0'
                            }
                          }}
                        >
                          <TableCell>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {getMedalEmoji(actualRank)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar
                                src={user.avatar}
                                sx={{ width: 40, height: 40 }}
                              >
                                {user.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {user.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={<TrendingUp />}
                              label={user.points}
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<LocalFlorist />}
                              label={`Level ${user.level}`}
                              color="success"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Stage {user.treeStage}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={user.challengesJoined || 0}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={500}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Info Section */}
        <Paper sx={{ p: 3, mt: 4, backgroundColor: '#E8F5E9', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#063B71' }}>
            🎮 How to Climb the Leaderboard
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              • <strong>Join Challenges:</strong> +20 points for your first time
            </Typography>
            <Typography variant="body2">
              • <strong>Harvest Crops:</strong> +10 points per crop harvested
            </Typography>
            <Typography variant="body2">
              • <strong>Collect Eggs:</strong> +5 points per egg collected
            </Typography>
            <Typography variant="body2">
              • <strong>Daily Login:</strong> +5 points every day
            </Typography>
            <Typography variant="body2">
              • <strong>Care for Plants:</strong> +1 point for watering or fertilizing
            </Typography>
            <Typography variant="body2">
              • <strong>Challenge Milestones:</strong> Creator gets +50 at 11 participants, +2 for each additional
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default Leaderboard
