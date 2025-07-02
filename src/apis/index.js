import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Not use try catch because we will use Interceptors of axios to collective error handling
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Axios return json data in response.data
  return response.data
}
