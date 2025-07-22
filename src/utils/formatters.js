// Capitalize the first letter of a string
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Generate placeholder card to prevent Dnd-kit bugs when column is empty
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Prevent spam clicks during API calls using CSS pointer-events
// Add 'interceptor-loading' class to elements that trigger API calls
export const interceptorLoadingElements = (calling) => {
  // Get all elements with 'interceptor-loading' class
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Disable interaction during API call
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Restore normal state
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}