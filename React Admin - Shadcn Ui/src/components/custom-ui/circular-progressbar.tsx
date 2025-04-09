import type React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressbarProps {
  value: number
  maxValue?: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  progressColor?: string
  textColor?: string
  showText?: boolean
  textSize?: number
  textFormatter?: (value: number) => string
  className?: string
}

const CircularProgressbar: React.FC<CircularProgressbarProps> = ({ value, maxValue = 100, size = 120, strokeWidth = 8, backgroundColor = "#e6e6e6", progressColor = "#3b82f6", textColor = "#1f2937", showText = true, textSize = 20, textFormatter = (value) => `${Math.round(value)}%`, className }) => {
  // Ensure value is between 0 and maxValue
  const normalizedValue = Math.min(Math.max(value, 0), maxValue)

  // Calculate percentage
  const percentage = (normalizedValue / maxValue) * 100

  // SVG parameters
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={progressColor} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
      </svg>

      {/* Text in the center */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: textColor, fontSize: textSize }}>
          {textFormatter(percentage)}
        </div>
      )}
    </div>
  )
}

export default CircularProgressbar