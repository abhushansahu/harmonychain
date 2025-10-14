import { formatTime, classNames } from '../index'

describe('formatTime', () => {
  it('formats seconds correctly', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(30)).toBe('0:30')
    expect(formatTime(60)).toBe('1:00')
    expect(formatTime(90)).toBe('1:30')
    expect(formatTime(3661)).toBe('61:01')
  })

  it('handles negative values', () => {
    expect(formatTime(-30)).toBe('-0:30')
    expect(formatTime(-60)).toBe('-1:00')
  })

  it('handles decimal values', () => {
    expect(formatTime(30.5)).toBe('0:30')
    expect(formatTime(30.9)).toBe('0:30')
  })

  it('handles very large values', () => {
    expect(formatTime(3600)).toBe('60:00')
    expect(formatTime(7200)).toBe('120:00')
  })
})

describe('classNames', () => {
  it('combines class names correctly', () => {
    expect(classNames('class1', 'class2')).toBe('class1 class2')
    expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3')
  })

  it('handles empty strings', () => {
    expect(classNames('')).toBe('')
    expect(classNames('class1', '')).toBe('class1')
  })

  it('handles undefined and null values', () => {
    expect(classNames('class1', undefined)).toBe('class1')
    expect(classNames('class1', null)).toBe('class1')
    expect(classNames(undefined, null)).toBe('')
  })

  it('handles boolean values', () => {
    expect(classNames('class1', true)).toBe('class1')
    expect(classNames('class1', false)).toBe('class1')
  })

  it('handles mixed types', () => {
    expect(classNames('class1', 'class2', undefined, null, true, false)).toBe('class1 class2')
  })

  it('handles no arguments', () => {
    expect(classNames()).toBe('')
  })

  it('handles single argument', () => {
    expect(classNames('class1')).toBe('class1')
  })
})