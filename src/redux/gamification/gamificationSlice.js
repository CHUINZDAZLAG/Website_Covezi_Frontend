import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  garden: null,
  currentXp: 0,
  currentLevel: 1,
  nextLevelXp: 100,
  lastUpdated: null
}

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // Set entire garden data
    setGarden: (state, action) => {
      state.garden = action.payload
      state.currentXp = action.payload?.currentXp || 0
      state.currentLevel = action.payload?.level || 1
      state.nextLevelXp = action.payload?.nextLevelXp || 100
      state.lastUpdated = Date.now()
    },

    // Update XP (for when we earn XP from challenges, etc)
    updateXp: (state, action) => {
      const { xpGained } = action.payload
      state.currentXp = (state.currentXp || 0) + xpGained
      state.lastUpdated = Date.now()
    },

    // Update garden after level up
    updateLevel: (state, action) => {
      const { newLevel, newXp, nextLevelXp, voucherEarned } = action.payload
      state.currentLevel = newLevel
      state.currentXp = newXp || 0
      state.nextLevelXp = nextLevelXp || 100
      state.lastUpdated = Date.now()
    },

    // Clear garden (on logout)
    clearGarden: (state) => {
      state.garden = null
      state.currentXp = 0
      state.currentLevel = 1
      state.nextLevelXp = 100
      state.lastUpdated = null
    }
  }
})

export const { setGarden, updateXp, updateLevel, clearGarden } = gamificationSlice.actions

export default gamificationSlice.reducer
