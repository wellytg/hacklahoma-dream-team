import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-2xl'

    const variantStyles = {
      default: 'shadow-md',
      elevated: 'shadow-xl',
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
