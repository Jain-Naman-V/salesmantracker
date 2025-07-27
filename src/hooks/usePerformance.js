import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { debounce, throttle } from '../utils/performance';

/**
 * Custom hook for debounced state updates
 * @param {any} initialValue - Initial state value
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Array} - [state, setState, immediateSetState]
 */
export const useDebouncedState = (initialValue, delay = 300) => {
  const [state, setState] = useState(initialValue);
  const [immediateState, setImmediateState] = useState(initialValue);
  
  const debouncedSetState = useMemo(
    () => debounce(setState, delay),
    [delay]
  );
  
  const updateState = useCallback((value) => {
    setImmediateState(value);
    debouncedSetState(value);
  }, [debouncedSetState]);
  
  return [state, updateState, setImmediateState, immediateState];
};

/**
 * Custom hook for throttled callbacks
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Throttle delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const useThrottledCallback = (callback, delay = 100) => {
  return useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );
};

/**
 * Custom hook for memoized expensive calculations
 * @param {Function} factory - Function that returns the value to memoize
 * @param {Array} deps - Dependencies array
 * @returns {any} - Memoized value
 */
export const useMemoizedValue = (factory, deps) => {
  return useMemo(factory, deps);
};

/**
 * Custom hook for intersection observer
 * @param {Function} callback - Callback when element is visible
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - { ref, isVisible }
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          callback?.(entry);
        } else {
          setIsVisible(false);
        }
      });
    }, options);
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [callback, options]);
  
  return { ref, isVisible };
};

/**
 * Custom hook for lazy loading
 * @param {Function} importFunc - Dynamic import function
 * @returns {Object} - { Component, loading, error }
 */
export const useLazyComponent = (importFunc) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [importFunc]);
  
  return { Component, loading, error };
};

/**
 * Custom hook for optimized form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} - Form state and handlers
 */
export const useOptimizedForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(error.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors
  };
};

/**
 * Custom hook for optimized list rendering
 * @param {Array} items - Array of items
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} - Virtual scrolling data
 */
export const useVirtualList = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const handleScroll = useThrottledCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, 16); // ~60fps
  
  return {
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
}; 