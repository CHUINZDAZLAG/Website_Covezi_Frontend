import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn
}) {
  // Have bug for mobile if use PointerSensor and touchAction
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Click and move 5px to activate event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } })

  // Touch and hold 250ms with tolerence 500px to activate event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Use mouse and touch sensor to have a good experience on mobile and web
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // The last collision point for algorithm collision detection
  const lastOverId = useRef(null)

  useEffect(() => {
    // Columns has been arranged in father component
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    activeColumn,
    active,
    over,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns(prevColumns => {
      // Find index of overCard in final column that card has been dropped
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic calculate new cardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      let newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone orderedColumns to handle data then update new orderedColumns
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // Handle old column
      if (nextActiveColumn) {
        // Remove card in active column that moved
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Add placeholder card if column is empty to avoid bug column is empty
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Update cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // Handle new column
      if (nextOverColumn) {
        // Check if card dragging is exists at overColumn to delete it
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Update columnId of Card when move it between 2 columns
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Add dragging card into overColumn by following new index
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Remove Placeholder Card if column exists at least 1 Card
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // If function was called from handlDragEnd so we call API
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }

      return nextColumns
    })
  }
  // Trigger when start to drag item
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Set oldColumn only when dragging card
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger in progress drag item
  const handleDragOver = (event) => {
    // Do nothing when dreag column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    // Check drag outside
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // Find 2 columns by CardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Check exist column to avoid crash web
    if (!activeColumn || !overColumn) return

    // Hanlde logic when drag card into 2 difference columns
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        activeColumn,
        active,
        over,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  // Trigger when end to drag item
  const handleDragEnd = (event) => {
    const { active, over } = event

    // Check drag and drop outside scope
    if (!active || !over) return

    // Handle drag and drop Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // Find 2 columns by CardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Check exist column to avoid crash web
      if (!activeColumn || !overColumn) return

      // Can use activeDragItemData.columnId (maybe have a bug) or oldColumnWhenDraggingCard._id to get old column
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Handle card drag and drop between different columns
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          activeColumn,
          active,
          over,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else { // Handle card drag and drop between same columns
        // Get index of old position from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Get index of new position from over
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Use arrayMove because drag card inside a column is the same with drag column inside a board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(prevColumns => {
          // Clone orderedColumns to handle data then update new orderedColumns
          const nextColumns = cloneDeep(prevColumns)

          // Find the column that card is dropped
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Update card and cardOrderIds in targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          // Return new state of correct position
          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // Handle drag and drop Columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Old position difference form new position
      if (active.id !== over.id) {
        // Get index of old position from active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Get index of new position from over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Render new state of column which dont wait to call API to avoid flickering
        setOrderedColumns(dndOrderedColumns)

        // Can use REDUX
        moveColumns(dndOrderedColumns)
      }
    }

    // Clear data back to default
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Animation when drop item
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // Custom algorithm to avoid flikering of collistion dectetion
  const collisionDetectionStrategy = useCallback((args) => {
    // Use closestCorners algorithm for column drag and drop
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Find the collision point - intersetion with pointer
    const pointerIntersetions = pointerWithin(args)

    // Do nothing when drag and drop card outside of scope
    if (!pointerIntersetions?.length) return

    // const intersections = !!pointerIntersetions?.length
    //   ? pointerIntersetions
    //   : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersetions, 'id')

    if (overId) {
      // If overId is column then we find the nearest cardId by closestCorners algorithm
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // When reach edge of column, assign overId = cardId in that column
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // If overId is null then return empty array - avoid crash web
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType])
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}

      // Bug flickering
      // collisionDetection={closestCorners}

      // flickering
      collisionDetection={collisionDetectionStrategy}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>

  )
}

export default BoardContent