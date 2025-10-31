/**
 * Performance Utilities
 * Optimization helpers for better UX
 */

/**
 * Lazy load image with promise
 */
export function lazyLoadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure function performance
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  const duration = end - start;
  
  if (import.meta.env.DEV) {
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Async version of measure performance
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  const duration = end - start;
  
  if (import.meta.env.DEV) {
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Request Animation Frame helper
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  return observer;
}

/**
 * Prefetch resource
 */
export function prefetchResource(url: string, as: 'script' | 'style' | 'image' | 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Preload critical resource
 */
export function preloadResource(url: string, as: 'script' | 'style' | 'image' | 'font'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Memory usage (Chrome only)
 */
export function getMemoryUsage(): {
  used: number;
  limit: number;
  percentage: number;
} | null {
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }
  return null;
}

/**
 * Check if browser supports feature
 */
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case 'webp':
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    case 'indexeddb':
      return 'indexedDB' in window;
    
    case 'serviceworker':
      return 'serviceWorker' in navigator;
    
    case 'webgl':
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        );
      } catch {
        return false;
      }
    
    default:
      return false;
  }
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates: Array<() => void>): void {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Idle callback helper
 */
export function runWhenIdle(callback: () => void, timeout: number = 2000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Cache result of expensive function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Clear cache of memoized function
 */
export function clearMemoCache<T extends (...args: any[]) => any>(fn: T): void {
  if ((fn as any).cache) {
    (fn as any).cache.clear();
  }
}

/**
 * Batch promises with concurrency limit
 */
export async function batchPromises<T>(
  promises: Array<() => Promise<T>>,
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const promise of promises) {
    const p = promise().then((result) => {
      results.push(result);
      executing.splice(executing.indexOf(p), 1);
    });

    executing.push(p);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

