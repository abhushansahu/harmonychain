import React from 'react'
import { cn } from '../../lib/utils'
import { SelectProps, SelectOption } from '../../lib/types'

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  className,
  testId,
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200'
  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn('space-y-1', className)}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          baseClasses,
          stateClasses,
          disabledClasses,
          error && 'text-red-900'
        )}
        data-testid={testId}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Multi-select component
export interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  disabled = false,
  error,
  maxSelections,
  className,
  testId,
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200'
  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
  const disabledClasses = disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    if (!maxSelections || selectedOptions.length <= maxSelections) {
      onChange(selectedOptions)
    }
  }

  return (
    <div className={cn('space-y-1', className)}>
      <select
        multiple
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          baseClasses,
          stateClasses,
          disabledClasses,
          error && 'text-red-900'
        )}
        data-testid={testId}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {maxSelections && (
        <p className="text-xs text-gray-500">
          {value.length}/{maxSelections} selected
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Searchable select component
export interface SearchableSelectProps extends Omit<SelectProps, 'options'> {
  options: SelectOption[]
  searchValue: string
  onSearchChange: (value: string) => void
  noResultsText?: string
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  searchValue,
  onSearchChange,
  placeholder = 'Search and select',
  disabled = false,
  error,
  noResultsText = 'No options found',
  className,
  testId,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          onChange?.(filteredOptions[focusedIndex].value)
          setIsOpen(false)
          setFocusedIndex(-1)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  const handleOptionClick = (optionValue: string | number) => {
    onChange?.(optionValue)
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  React.useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [focusedIndex, isOpen])

  return (
    <div className={cn('relative space-y-1', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          )}
          data-testid={testId}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={cn(
                  'px-3 py-2 cursor-pointer hover:bg-gray-100',
                  index === focusedIndex && 'bg-gray-100',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">{noResultsText}</li>
          )}
        </ul>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
