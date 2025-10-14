import React from 'react'
import { cn } from '../../lib/utils'
import { FormFieldProps } from '../../lib/types'

export interface InputProps extends Omit<FormFieldProps, 'onChange'> {
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  readOnly?: boolean
  required?: boolean
  tabIndex?: number
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  className,
  testId,
  autoComplete,
  autoFocus,
  maxLength,
  minLength,
  pattern,
  readOnly,
  tabIndex,
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200'
  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        tabIndex={tabIndex}
        className={cn(
          baseClasses,
          stateClasses,
          disabledClasses,
          error && 'text-red-900 placeholder-red-300'
        )}
        data-testid={testId}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Specialized input components
export const TextInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="text" {...props} />
)

export const EmailInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="email" {...props} />
)

export const PasswordInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="password" {...props} />
)

export const NumberInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="number" {...props} />
)

export const UrlInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="url" {...props} />
)

export const SearchInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="search" {...props} />
)
