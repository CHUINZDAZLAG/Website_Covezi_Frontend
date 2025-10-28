import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, API_ENDPOINT } from '~/utils/constants'
import { toast } from 'react-toastify'

// Export API_ENDPOINT for admin pages
export { API_ENDPOINT }

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
  toast.success('Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' })
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
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/products`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    toast.success('Sản phẩm được tạo thành công!')
    return response.data
  },
  
  updateProduct: async (productId, formData) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/products/${productId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    toast.success('Sản phẩm được cập nhật thành công!')
    return response.data
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

// Cart API
export const cartAPI = {
  getCart: async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/cart`)
    return response.data
  },
  
  addToCart: async (productId, quantity = 1) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cart/add`, { productId, quantity })
    toast.success('Product added to cart!')
    return response.data
  },
  
  updateCartItem: async (itemId, updateData) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cart/items/${itemId}`, updateData)
    return response.data
  },
  
  removeCartItem: async (itemId) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cart/items/${itemId}`)
    toast.success('Item removed from cart!')
    return response.data
  },
  
  applyCoupon: async (couponCode) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cart/coupon`, { code: couponCode })
    toast.success('Coupon applied successfully!')
    return response.data
  },
  
  removeCoupon: async () => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cart/coupon`)
    toast.success('Coupon removed!')
    return response.data
  },
  
  getSelectedItems: async (itemIds) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cart/selected-items`, { itemIds })
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
      `${API_ROOT}/v1/gamification/customize-tree`,
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
  }
}

// Challenge API
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
