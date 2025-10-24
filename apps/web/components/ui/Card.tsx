'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CardProps } from '@/lib/types'

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg',
        onClick && 'cursor-pointer hover:shadow-xl',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {image && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image}
            alt={title || 'Card image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600 mb-2">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export default Card
