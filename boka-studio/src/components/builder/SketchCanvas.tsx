import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  onExport: (dataUrl: string | null) => void
}

export function SketchCanvas({ onExport }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#7E3091')
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [lineWidth, setLineWidth] = useState(3)

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    const me = e as React.MouseEvent
    return {
      x: (me.clientX - rect.left) * scaleX,
      y: (me.clientY - rect.top) * scaleY,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    drawingRef.current = true
    const ctx = getCtx()
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return
    e.preventDefault()
    const ctx = getCtx()
    if (!ctx) return
    const { x, y } = getPos(e)
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function endDraw() {
    drawingRef.current = false
    const canvas = canvasRef.current
    if (canvas) onExport(canvas.toDataURL('image/png'))
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    onExport(null)
  }

  function downloadSketch() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'boka-sketch.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="sketch-canvas-wrap">
      <div className="sketch-toolbar">
        <button
          type="button"
          className={tool === 'pen' ? 'active' : undefined}
          onClick={() => setTool('pen')}
        >
          Pen
        </button>
        <button
          type="button"
          className={tool === 'eraser' ? 'active' : undefined}
          onClick={() => setTool('eraser')}
        >
          Eraser
        </button>
        <label className="sketch-color">
          Colour
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Size
          <input
            type="range"
            min={1}
            max={12}
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </label>
        <button type="button" onClick={clearCanvas}>
          Clear
        </button>
        <button type="button" onClick={downloadSketch}>
          Download sketch
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={400}
        className="sketch-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <p className="sketch-hint">Draw your idea directly — it will be saved with your order.</p>
    </div>
  )
}
