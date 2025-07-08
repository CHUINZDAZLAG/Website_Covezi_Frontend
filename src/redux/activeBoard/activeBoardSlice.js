import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Initialize value of a Slice in Redux
const initialState = {
  currentActiveBoard: null
}

// Actions to call api (asynchronous) and update data to Redux, use middleware createAsyncThunk go with extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Axios return json data in response.data
    return response.data
  }
)

// Initialize a Slide in Redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: handle synchronous data
  reducers: {
    // always use () => {}, this is rules of redux
    updteCurrentActiveBoard: (state, action) => {
      // action.payload is a standard naming for input reducer, we assign it for a meaning variable
      const board = action.payload

      // Handle data if need...

      // Update currentActiveBoard data
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: handle asynchronous data
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload is response.data that api return
      let board = action.payload

      // Handle data if need...
      // Arrange order column before drop down data to child component
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Handle drag and drop card into empty column
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Arrange order column before drop down data to child component
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })

      // Update currentActiveBoard data
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
// Action là nơi dành cho các components bên dưới gọi bằng dispathch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Thuộc tính actions sẽ được redux tạo tự động theo tên của reducer
export const { updteCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: child components call by hook useSelector() to get data in redux store
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// This file name is activeBoardSlide but we will export one thing called Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer