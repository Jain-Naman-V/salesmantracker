// Performance optimization utilities

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to limit
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoize function results to avoid expensive recalculations
 * @param {Function} fn - The function to memoize
 * @returns {Function} - The memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Lazy load component with loading state
 * @param {Function} importFunc - Dynamic import function
 * @returns {React.Component} - Lazy loaded component
 */
export const lazyLoad = (importFunc) => {
  return React.lazy(() => importFunc());
};

/**
 * Intersection Observer for lazy loading
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Intersection Observer options
 * @returns {IntersectionObserver} - Observer instance
 */
export const createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  });
};

/**
 * Optimize images with lazy loading
 * @param {string} src - Image source
 * @param {string} alt - Image alt text
 * @param {Object} props - Additional props
 * @returns {Object} - Optimized image props
 */
export const optimizeImage = (src, alt, props = {}) => ({
  src,
  alt,
  loading: 'lazy',
  decoding: 'async',
  ...props
});

/**
 * Batch state updates to prevent excessive re-renders
 * @param {Function} setState - React setState function
 * @param {Array} updates - Array of state updates
 */
export const batchStateUpdates = (setState, updates) => {
  setState(prevState => {
    const newState = { ...prevState };
    updates.forEach(([key, value]) => {
      newState[key] = value;
    });
    return newState;
  });
};

/**
 * Virtual scrolling helper for large lists
 * @param {Array} items - Array of items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @param {number} scrollTop - Current scroll position
 * @returns {Object} - Visible items and styles
 */
export const getVisibleItems = (items, itemHeight, containerHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  
  return {
    items: visibleItems,
    style: { transform: `translateY(${offsetY}px)` }
  };
}; 