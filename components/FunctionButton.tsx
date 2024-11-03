import { ReactNode } from 'react'
import { Button } from "@/components/ui/button"

interface FunctionButtonProps {
  icon: ReactNode
  onClick: () => void
  disabled: boolean
  children: ReactNode
  borderColor: string
  hoverBgColor: string
}

export default function FunctionButton({ icon, onClick, disabled, children, borderColor, hoverBgColor }: FunctionButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      disabled={disabled}
      className={`${borderColor} ${hoverBgColor}`}
    >
      {icon}
      {children}
    </Button>
  )
}