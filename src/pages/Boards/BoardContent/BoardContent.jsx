import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // Have bug for mobile if use PointerSensor and touchAction
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Click and move 10px to activate event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Touch and hold 250ms with tolerence 500px to activate event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Use mouse and touch sensor to have a good experience on mobile and web
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log(event)
    const { active, over } = event

    // Check drag outside
    if (!over) return

    // Old position difference form new position
    if (active.id !== over.id) {
      // Get index of old position from active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Get index of new position from over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

      // Render new state of column
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>

  )
}

export default BoardContent