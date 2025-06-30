// Array Utilities
export const generateRandomArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const generateSortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  const step = (max - min) / (size - 1);
  return Array.from({ length: size }, (_, i) => Math.floor(min + i * step));
};

export const generateReverseSortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  return generateSortedArray(size, min, max).reverse();
};

export const generateNearlySortedArray = (size: number, min: number = 1, max: number = 100): number[] => {
  const sorted = generateSortedArray(size, min, max);
  const swapCount = Math.max(1, Math.floor(size * 0.1)); // 10% of elements
  
  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [sorted[idx1], sorted[idx2]] = [sorted[idx2], sorted[idx1]];
  }
  
  return sorted;
};

// Animation Utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const calculateAnimationDelay = (speed: number): number => {
  // Speed ranges from 0.5 to 3.0
  // Delay ranges from 1000ms (slow) to 100ms (fast)
  const baseDelay = 500;
  return Math.max(50, baseDelay / speed);
};

// Color Utilities
export const getElementColor = (state: string): string => {
  const colorMap: Record<string, string> = {
    default: 'var(--color-accent)',
    comparing: 'var(--color-comparison)',
    swapping: 'var(--color-swap)',
    sorted: 'var(--color-sorted)',
    current: 'var(--color-current)',
    pivot: 'var(--color-primary)',
    minimum: 'var(--color-info)',
    maximum: 'var(--color-error)',
  };
  
  return colorMap[state] || colorMap.default;
};

// Validation Utilities
export const validateArrayInput = (input: string): { isValid: boolean; values?: number[]; error?: string } => {
  if (!input.trim()) {
    return { isValid: false, error: 'Input cannot be empty' };
  }
  
  try {
    const values = input
      .split(',')
      .map(val => val.trim())
      .filter(val => val !== '')
      .map(val => {
        const num = parseFloat(val);
        if (isNaN(num)) {
          throw new Error(`"${val}" is not a valid number`);
        }
        return Math.floor(num);
      });
    
    if (values.length === 0) {
      return { isValid: false, error: 'No valid numbers found' };
    }
    
    if (values.length > 50) {
      return { isValid: false, error: 'Maximum 50 elements allowed' };
    }
    
    return { isValid: true, values };
  } catch (error) {
    return { isValid: false, error: (error as Error).message };
  }
};

// Math Utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Format Utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

// Local Storage Utilities
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Array Comparison Utility
export const arraysEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

// Generate Unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};