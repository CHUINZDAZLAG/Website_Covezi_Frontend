import React, { useEffect, useRef, useState } from 'react'
import './GardenDisplay.css'

const GardenDisplay = ({ garden, onEggCollect }) => {
  const canvasRef = useRef(null)
  const [chickenPos, setChickenPos] = useState({ x: 150, y: 150 })
  const [chickenDir, setChickenDir] = useState(1) // 1 = right, -1 = left
  const [eggs, setEggs] = useState(garden?.eggs || [])
  const animationRef = useRef(null)
  const stepCountRef = useRef(0)

  // Chicken size based on level (grows every 5 levels)
  const getChickenSize = () => {
    const level = garden?.level || 1
    const stage = Math.floor((level - 1) / 5) + 1
    return 20 + stage * 5 // Base 20 + stage bonus
  }

  // Tree size based on level
  const getTreeSize = () => {
    const level = garden?.level || 1
    const stage = Math.floor((level - 1) / 5) + 1
    return 30 + stage * 8 // Base 30 + stage bonus
  }

  // Draw garden with canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#e8f5e9'
    ctx.fillRect(0, 0, width, height)

    // Draw plot border
    ctx.strokeStyle = '#8b7355'
    ctx.lineWidth = 3
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // Draw soil pattern
    ctx.fillStyle = '#d7ccc8'
    for (let i = 0; i < width; i += 30) {
      for (let j = 0; j < height; j += 30) {
        if ((i / 30 + j / 30) % 2 === 0) {
          ctx.fillRect(i, j, 30, 30)
        }
      }
    }

    // Draw tree (center-right)
    const treeX = width - 120
    const treeY = height / 2
    const treeSize = getTreeSize()

    // Tree trunk
    ctx.fillStyle = '#8d6e63'
    ctx.fillRect(treeX - 5, treeY + 10, 10, 40)

    // Tree foliage (circle based on pot type)
    ctx.fillStyle = garden?.treeCustomization?.color || '#4caf50'
    ctx.beginPath()
    ctx.arc(treeX, treeY, treeSize, 0, Math.PI * 2)
    ctx.fill()

    // Pot decoration
    ctx.strokeStyle = garden?.treeCustomization?.potColor || '#8b4513'
    ctx.lineWidth = 2
    ctx.strokeRect(treeX - 8, treeY + 45, 16, 15)

    // Draw eggs on ground (clickable)
    eggs.forEach((egg, idx) => {
      ctx.fillStyle = '#fff8e1'
      ctx.beginPath()
      ctx.ellipse(egg.x, egg.y, 8, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffd54f'
      ctx.lineWidth = 2
      ctx.stroke()

      // Egg collection hint
      if (egg.hovered) {
        ctx.fillStyle = 'rgba(255, 200, 0, 0.3)'
        ctx.beginPath()
        ctx.arc(egg.x, egg.y, 15, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw chicken
    const chickenSize = getChickenSize()
    drawChicken(ctx, chickenPos.x, chickenPos.y, chickenSize, chickenDir, garden?.petCustomization)
  }, [chickenPos, eggs, garden])

  // Draw chicken character
  const drawChicken = (ctx, x, y, size, direction, petCustomization = {}) => {
    const color = petCustomization?.color || '#ff9800'

    // Scale
    const scale = size / 20

    // Body
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x, y, 10 * scale, 12 * scale, 0, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + (8 * direction * scale), y - 10 * scale, 6 * scale, 0, Math.PI * 2)
    ctx.fill()

    // Eye
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x + (10 * direction * scale), y - 11 * scale, 2 * scale, 0, Math.PI * 2)
    ctx.fill()

    // Beak
    ctx.fillStyle = '#ffb74d'
    ctx.beginPath()
    ctx.moveTo(x + (12 * direction * scale), y - 9 * scale)
    ctx.lineTo(x + (14 * direction * scale), y - 9 * scale)
    ctx.lineTo(x + (12 * direction * scale), y - 8 * scale)
    ctx.fill()

    // Wing
    ctx.fillStyle = 'rgba(255, 152, 0, 0.7)'
    ctx.beginPath()
    ctx.ellipse(x - (3 * direction * scale), y, 4 * scale, 8 * scale, 0.3 * direction, 0, Math.PI * 2)
    ctx.fill()

    // Legs
    ctx.strokeStyle = '#ffb74d'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - (3 * scale), y + 10 * scale)
    ctx.lineTo(x - (3 * scale), y + 15 * scale)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + (3 * scale), y + 10 * scale)
    ctx.lineTo(x + (3 * scale), y + 15 * scale)
    ctx.stroke()

    // Feet
    ctx.beginPath()
    ctx.moveTo(x - (5 * scale), y + 15 * scale)
    ctx.lineTo(x - (1 * scale), y + 15 * scale)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + (1 * scale), y + 15 * scale)
    ctx.lineTo(x + (5 * scale), y + 15 * scale)
    ctx.stroke()
  }

  // Chicken animation loop
  useEffect(() => {
    const animate = () => {
      stepCountRef.current += 1

      // Chicken moves in pattern around tree
      const centerX = canvasRef.current?.width - 120
      const centerY = canvasRef.current?.height / 2
      const radius = 60

      // Move in circle with wobble
      const angle = (stepCountRef.current / 100) * Math.PI * 2
      const wobble = Math.sin(stepCountRef.current / 20) * 10
      const newX = centerX + Math.cos(angle) * radius + wobble
      const newY = centerY + Math.sin(angle) * radius / 2

      setChickenPos({ x: newX, y: newY })
      setChickenDir(Math.cos(angle) > 0 ? 1 : -1)

      // Lay egg randomly
      if (stepCountRef.current % 120 === 0 && eggs.length < 3) {
        const newEgg = {
          id: Date.now(),
          x: centerX - 30 + Math.random() * 60,
          y: centerY + 30 + Math.random() * 20,
          hovered: false
        }
        setEggs(prev => [...prev, newEgg])
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [eggs])

  // Handle egg collection
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    eggs.forEach((egg) => {
      const dist = Math.sqrt((x - egg.x) ** 2 + (y - egg.y) ** 2)
      if (dist < 15) {
        // Egg collected
        setEggs(prev => prev.filter(e => e.id !== egg.id))
        onEggCollect?.(egg)
      }
    })
  }

  return (
    <div className="garden-display">
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        onClick={handleCanvasClick}
        style={{ cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px' }}
      />
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Level: {garden?.level || 1} | XP: {garden?.currentXp || 0} / {garden?.nextLevelXp || 50}
      </p>
    </div>
  )
}

export default GardenDisplay
