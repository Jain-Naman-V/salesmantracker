// Performance monitoring utilities

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Start timing a component or operation
   * @param {string} name - Name of the component/operation
   * @returns {string} - Unique ID for the timing
   */
  startTimer(name) {
    if (!this.isEnabled) return null;
    
    const id = `${name}_${Date.now()}_${Math.random()}`;
    this.metrics.set(id, {
      name,
      startTime: performance.now(),
      startMemory: performance.memory?.usedJSHeapSize || 0
    });
    
    return id;
  }

  /**
   * End timing and log metrics
   * @param {string} id - Timer ID from startTimer
   * @param {Object} additionalData - Additional data to log
   */
  endTimer(id, additionalData = {}) {
    if (!this.isEnabled || !id || !this.metrics.has(id)) return;
    
    const metric = this.metrics.get(id);
    const endTime = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    
    const duration = endTime - metric.startTime;
    const memoryDelta = endMemory - metric.startMemory;
    
    const result = {
      name: metric.name,
      duration: `${duration.toFixed(2)}ms`,
      memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`,
      timestamp: new Date().toISOString(),
      ...additionalData
    };
    
    // Log to console in development
    console.log(`🚀 Performance: ${result.name}`, result);
    
    // Store for analysis
    this.metrics.set(id, { ...metric, ...result });
    
    // Clean up old metrics (keep last 100)
    if (this.metrics.size > 100) {
      const keys = Array.from(this.metrics.keys());
      keys.slice(0, keys.length - 100).forEach(key => this.metrics.delete(key));
    }
  }

  /**
   * Monitor component render performance
   * @param {string} componentName - Name of the component
   * @param {Function} component - Component function
   * @returns {Function} - Wrapped component
   */
  monitorComponent(componentName, component) {
    if (!this.isEnabled) return component;
    
    return (...props) => {
      const timerId = this.startTimer(`${componentName}_render`);
      const result = component(...props);
      this.endTimer(timerId, { props: props.length });
      return result;
    };
  }

  /**
   * Monitor async operations
   * @param {string} operationName - Name of the operation
   * @param {Function} operation - Async operation
   * @returns {Function} - Wrapped operation
   */
  async monitorAsync(operationName, operation) {
    if (!this.isEnabled) return operation;
    
    return async (...args) => {
      const timerId = this.startTimer(`${operationName}_async`);
      try {
        const result = await operation(...args);
        this.endTimer(timerId, { success: true });
        return result;
      } catch (error) {
        this.endTimer(timerId, { success: false, error: error.message });
        throw error;
      }
    };
  }

  /**
   * Get performance summary
   * @returns {Object} - Performance summary
   */
  getSummary() {
    if (!this.isEnabled) return {};
    
    const metrics = Array.from(this.metrics.values());
    const byName = {};
    
    metrics.forEach(metric => {
      if (!byName[metric.name]) {
        byName[metric.name] = [];
      }
      byName[metric.name].push(metric);
    });
    
    const summary = {};
    Object.entries(byName).forEach(([name, items]) => {
      const durations = items
        .filter(item => item.duration)
        .map(item => parseFloat(item.duration.replace('ms', '')));
      
      if (durations.length > 0) {
        summary[name] = {
          count: items.length,
          avgDuration: `${(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)}ms`,
          minDuration: `${Math.min(...durations).toFixed(2)}ms`,
          maxDuration: `${Math.max(...durations).toFixed(2)}ms`,
          totalDuration: `${durations.reduce((a, b) => a + b, 0).toFixed(2)}ms`
        };
      }
    });
    
    return summary;
  }

  /**
   * Monitor memory usage
   * @returns {Object} - Memory usage info
   */
  getMemoryInfo() {
    if (!performance.memory) return null;
    
    return {
      used: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
      percentage: `${((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
    };
  }

  /**
   * Monitor network performance
   * @param {string} url - URL to monitor
   * @returns {Promise} - Network timing data
   */
  async monitorNetwork(url) {
    if (!this.isEnabled) return fetch(url);
    
    const timerId = this.startTimer(`network_${url}`);
    
    try {
      const startTime = performance.now();
      const response = await fetch(url);
      const endTime = performance.now();
      
      this.endTimer(timerId, {
        status: response.status,
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        size: response.headers.get('content-length') || 'unknown'
      });
      
      return response;
    } catch (error) {
      this.endTimer(timerId, { error: error.message });
      throw error;
    }
  }

  /**
   * Enable/disable monitoring
   * @param {boolean} enabled - Whether to enable monitoring
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// React hook for monitoring component performance
export const usePerformanceMonitor = (componentName) => {
  const timerId = React.useRef(null);
  
  React.useEffect(() => {
    if (performanceMonitor.isEnabled) {
      timerId.current = performanceMonitor.startTimer(`${componentName}_mount`);
    }
    
    return () => {
      if (timerId.current) {
        performanceMonitor.endTimer(timerId.current, { type: 'unmount' });
      }
    };
  }, [componentName]);
  
  return performanceMonitor;
};

// Higher-order component for performance monitoring
export const withPerformanceMonitor = (WrappedComponent, componentName) => {
  return React.forwardRef((props, ref) => {
    const timerId = React.useRef(null);
    
    React.useEffect(() => {
      if (performanceMonitor.isEnabled) {
        timerId.current = performanceMonitor.startTimer(`${componentName}_render`);
      }
      
      return () => {
        if (timerId.current) {
          performanceMonitor.endTimer(timerId.current, { props: Object.keys(props).length });
        }
      };
    });
    
    return <WrappedComponent {...props} ref={ref} />;
  });
};

export default performanceMonitor; 