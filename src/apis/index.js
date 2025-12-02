import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, API_ENDPOINT } from '~/utils/constants'
import { toast } from 'react-toastify'
import chatAPI from './chatAPI'

// Export API_ENDPOINT for admin pages
export { API_ENDPOINT, chatAPI }

// ===== LEGACY TRELLO APIs =====
// Board API
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success('Board created successfully')
  return response.data
}

// Column API
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

// Card API
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardInDetailAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success('User invited to board successfully!')
  return response.data
}

// ===== COVEZI E-COMMERCE APIs =====

// Users API
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  return response.data
}

export const verifyUserPINAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify-pin`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

// Homepage API
export const homepageAPI = {
  getHomepageData: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/homepage`)
    return response.data
  }
}

// Product API
export const productAPI = {
  // User Operations
  getProducts: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products?${queryString}`)
    return response.data
  },
  
  getMyProducts: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/my-products?${queryString}`)
    return response.data
  },
  
  getProductDetail: async (productId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/${productId}`)
    return response.data
  },
  
  getProductReviews: async (productId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/${productId}/reviews`)
    return response.data
  },
  
  getRelatedProducts: async (productId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/${productId}/related`)
    return response.data
  },
  
  getCategories: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/categories`)
    return response.data
  },
  
  getFeaturedProducts: async (limit = 8) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/featured?limit=${limit}`)
    return response.data
  },
  
  // Admin Operations
  createProduct: async (formData) => {
    console.log('[API] createProduct called with formData, FormData size:', formData.toString().length)
    try {
      const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/v1/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('[API] createProduct success:', response.data)
      toast.success('Sản phẩm được tạo thành công!')
      return response.data
    } catch (error) {
      console.error('[API] createProduct error:', error)
      throw error
    }
  },
  
  updateProduct: async (productId, formData) => {
    console.log('[API] updateProduct called with productId:', productId, 'FormData size:', formData.toString().length)
    try {
      const response = await authorizedAxiosInstance.put(
        `${API_ROOT}/v1/products/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log('[API] updateProduct success:', response.data)
      toast.success('Sản phẩm được cập nhật thành công!')
      return response.data
    } catch (error) {
      console.error('[API] updateProduct error:', error)
      throw error
    }
  },
  
  deleteProduct: async (productId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/products/${productId}`)
    toast.success('Sản phẩm được xóa thành công!')
    return response.data
  },
  
  updateProductStock: async (productId, quantity) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/products/${productId}/stock`,
      { quantity }
    )
    return response.data
  },
  
  getStats: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/stats`)
    return response.data
  }
}

// Voucher API
export const voucherAPI = {
  getUserVouchers: async (status = '') => {
    const queryString = status ? `?status=${status}` : ''
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/vouchers${queryString}`)
    return response.data
  },
  
  getActiveVouchers: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/vouchers/active`)
    return response.data
  },
  
  getVoucherDetails: async (voucherId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/vouchers/${voucherId}`)
    return response.data
  },
  
  requestVoucher: async (voucherId, productId = null) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/vouchers/${voucherId}/use`,
      { voucherId, productId }
    )
    toast.success('Yêu cầu sử dụng voucher đã được gửi!')
    return response.data
  },
  
  // Admin Operations
  getPendingVouchers: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/vouchers/pending`)
    return response.data
  },
  
  confirmVoucher: async (voucherId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/admin/vouchers/${voucherId}/confirm`,
      { voucherId }
    )
    toast.success('Xác nhận sử dụng voucher thành công!')
    return response.data
  },
  
  rejectVoucher: async (voucherId, reason = '') => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/admin/vouchers/${voucherId}/reject`,
      { voucherId, reason }
    )
    toast.success('Voucher bị từ chối và quay về trạng thái hoạt động!')
    return response.data
  },

  shareVoucher: async (voucherId, data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/vouchers/${voucherId}/share`,
      data
    )
    toast.success(`Chia sẻ voucher lên ${data.platform} thành công!`)
    return response.data
  },

  submitVoucherProof: async (voucherId, formData) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/vouchers/${voucherId}/proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    toast.success('Chứng minh sử dụng voucher đã được gửi! Admin sẽ xem xét sớm.')
    return response.data
  }
}



// Garden API
export const gardenAPI = {
  getGarden: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/garden`)
    return response.data
  },

  getAvailableVouchers: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/garden/vouchers`)
    return response.data
  },

  claimVoucher: async (voucherId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/garden/vouchers/${voucherId}/claim`)
    toast.success('Đã nhận voucher thành công!')
    return response.data
  },
  
  getTreeShop: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/garden/shop`)
    return response.data
  },
  
  buyTree: async (treeTypeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/garden/buy-tree`, { treeTypeId })
    toast.success('Mua cây thành công!')
    return response.data
  },
  
  waterTree: async (treeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/garden/trees/${treeId}/water`)
    return response.data
  },
  
  fertilizeTree: async (treeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/garden/trees/${treeId}/fertilize`)
    return response.data
  },
  
  harvestTree: async (treeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/garden/trees/${treeId}/harvest`)
    return response.data
  }
}

// Order API
export const orderAPI = {
  getOrders: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders?${queryString}`)
    return response.data
  },
  
  getOrderStats: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/orders/stats`)
    return response.data
  },
  
  createOrder: async (orderData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/orders`, orderData)
    toast.success('Order created successfully!')
    return response.data
  },
  
  updateOrderStatus: async (orderId, statusData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/orders/${orderId}/status`, statusData)
    return response.data
  }
}

// Gamification API (New unified system - /user-garden endpoint)
export const gamificationAPI = {
  /**
   * Get user's complete garden (level, XP, pet, crops, inventory, vouchers)
   */
  getUserGarden: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/gamification/user-garden`)
    return response.data
  },

  /**
   * XP Rewards
   */
  claimDailyLoginReward: async () => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/gamification/daily-login`)
    toast.success('Daily reward claimed! +5 XP')
    return response.data
  },

  awardJoinChallengeXp: async (challengeId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/join-challenge`,
      { challengeId }
    )
    return response.data
  },

  awardCompleteChallengeXp: async (challengeId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/complete-challenge`,
      { challengeId }
    )
    return response.data
  },

  awardCreatorBonusXp: async (challengeId, participantCount) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/creator-bonus`,
      { challengeId, participantCount }
    )
    return response.data
  },

  /**
   * Garden Operations
   */
  plantSeed: async (cropType) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/plant-seed`,
      { cropType }
    )
    return response.data
  },

  careForPlant: async (plotId, careType) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/care-plant`,
      { plotId, careType }
    )
    return response.data
  },

  harvestCrop: async (plotId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/harvest-crop`,
      { plotId }
    )
    return response.data
  },

  customizeTreePlot: async (plotId, customization) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/customize-tree-plot`,
      { plotId, ...customization }
    )
    return response.data
  },

  customizeTree: async (customization) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/garden/customize-tree`,
      customization
    )
    return response.data
  },

  /**
   * Garden Grid Operations - Plant trees in garden plots
   */
  plantTreeInPlot: async (plotId, treeData) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/plant-tree-in-plot`,
      { plotId, ...treeData }
    )
    toast.success('Cây được trồng thành công!')
    return response.data
  },

  performGardenAction: async (plotId, action) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/garden-action`,
      { plotId, action }
    )
    return response.data
  },

  harvestGardenTree: async (plotId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/harvest-garden-tree`,
      { plotId }
    )
    return response.data
  },

  dailyLogin: async () => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/daily-login`
    )
    toast.success('Đăng nhập thành công! +XP')
    return response.data
  },

  /**
   * Pet Operations (One pet per user)
   */
  customizePet: async (customization) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/customize-pet`,
      customization
    )
    return response.data
  },

  feedPet: async () => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/gamification/feed-pet`)
    return response.data
  },

  collectEgg: async () => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/gamification/collect-egg`)
    return response.data
  },

  /**
   * Vouchers
   */
  getUserVouchers: async (status = 'active') => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/gamification/vouchers?status=${status}`
    )
    return response.data
  },

  useVoucher: async (voucherId, orderId) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/gamification/use-voucher`,
      { voucherId, orderId }
    )
    toast.success('Voucher applied!')
    return response.data
  },

  /**
   * Leaderboard
   */
  getLeaderboard: async (limit = 50, offset = 0) => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/gamification/leaderboard?limit=${limit}&offset=${offset}`
    )
    return response.data
  },

  getUserRank: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/gamification/user-rank`)
    return response.data
  },

  /**
   * Admin
   */
  getConfig: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/gamification/admin/config`)
    return response.data
  },

  updateConfig: async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/gamification/admin/config`, data)
    return response.data
  },

  updateVoucherTier: async (levelMin, levelMax, discountPercent) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/gamification/admin/voucher-tier`,
      { levelMin, levelMax, discountPercent }
    )
    return response.data
  },

  getVoucherConfig: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/voucher-config`)
    return response.data
  },

  updateVoucherMilestone: async (level, discountPercent, description = '') => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/admin/voucher-config/${level}`,
      { discountPercent, description }
    )
    toast.success(`Voucher milestone at Level ${level} updated to ${discountPercent}%`)
    return response.data
  },

  deleteVoucherMilestone: async (level) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/admin/voucher-config/${level}`)
    toast.success(`Voucher milestone at Level ${level} deleted`)
    return response.data
  },

  getVoucherStats: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/voucher-config/stats`)
    return response.data
  }
}

// Challenge API
// Admin Challenge API
export const adminChallengeAPI = {
  // Get all challenges (admin view)
  getAll: async (queryObj = {}) => {
    const params = new URLSearchParams()
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value)
      }
    })
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/challenges?${params.toString()}`)
    return response.data
  },

  // Get challenge details (admin view with full stats)
  getDetails: async (challengeId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/challenges/${challengeId}`)
    return response.data
  },

  // Delete challenge (admin can delete any challenge)
  deleteChallenge: async (challengeId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/admin/challenges/${challengeId}`)
    return response.data
  },

  // Get challenge statistics
  getStats: async (queryObj = {}) => {
    const params = new URLSearchParams()
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value)
      }
    })
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/challenges/stats?${params.toString()}`)
    return response.data
  },

  // Get challenges with low participation
  getLowParticipation: async (minParticipants = 5) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/challenges/low-participation?minParticipants=${minParticipants}`)
    return response.data
  }
}

export const challengeAPI = {
  // User Operations
  getAll: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/challenges?${queryString}`)
    return response.data
  },

  // Alias for compatibility
  getChallenges: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/challenges?${queryString}`)
    return response.data
  },

  getDetails: async (challengeId, queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/challenges/${challengeId}?${queryString}`)
    return response.data
  },

  getCreatedChallenges: async (queryObj = {}) => {
    const params = new URLSearchParams()
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value)
      }
    })
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/challenges/created?${params.toString()}`)
    return response.data
  },

  // Alias for compatibility
  getMyCreatedChallenges: async (queryString = '') => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/challenges/created?${queryString}`)
    return response.data
  },

  createChallenge: async (formData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/challenges`, formData)
    return response.data
  },

  updateChallenge: async (challengeId, formData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/challenges/${challengeId}`, formData)
    return response.data
  },

  deleteChallenge: async (challengeId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/challenges/${challengeId}`)
    return response.data
  },

  // Join challenge (award +10 XP on first participation)
  joinChallenge: async (challengeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/challenges/${challengeId}/join`)
    return response.data
  },

  // Like operations
  likeChallenge: async (challengeId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/challenges/${challengeId}/like`)
    return response.data
  },

  unlikeChallenge: async (challengeId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/challenges/${challengeId}/like`)
    return response.data
  },

  // Comment/proof operations
  addProofComment: async (challengeId, commentData) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/challenges/${challengeId}/comments`, commentData)
    return response.data
  },

  deleteProofComment: async (challengeId, commentId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/challenges/${challengeId}/comments/${commentId}`)
    return response.data
  },

  likeComment: async (challengeId, commentId) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/challenges/${challengeId}/comments/${commentId}/like`)
    return response.data
  },

  unlikeComment: async (challengeId, commentId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/challenges/${challengeId}/comments/${commentId}/like`)
    return response.data
  }
}

// Admin User Management API
export const adminUserManagementAPI = {
  // Get all users with pagination, search, filters
  getAllUsers: async (queryObj = {}) => {
    const params = new URLSearchParams()
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value)
      }
    })
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/users?${params.toString()}`)
    return response.data
  },

  // Get user statistics dashboard
  getUserStats: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/users/stats`)
    return response.data
  },

  // Get signup statistics
  getSignupStats: async (days = 30) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/users/signup/stats?days=${days}`)
    return response.data
  },

  // Get login statistics
  getLoginStats: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/users/login/stats`)
    return response.data
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/admin/users/${userId}`)
    return response.data
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (userId, isActive) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin/users/${userId}/status`, { isActive })
    return response.data
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin/users/${userId}/role`, { role })
    return response.data
  }
}
