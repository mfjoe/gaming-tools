/**
 * Analytics & Tracking Service
 * Google Analytics 4 integration with custom event tracking
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

/**
 * Initialize Google Analytics
 */
export function initAnalytics(): void {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined') return;

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  console.log('Analytics initialized');
}

/**
 * Analytics Event Interface
 */
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}

/**
 * Track custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.params,
  });

  if (import.meta.env.DEV) {
    console.log('📊 Analytics Event:', event);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string): void {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });

  if (import.meta.env.DEV) {
    console.log('📄 Page View:', path, title);
  }
}

/**
 * Squad Builder Events
 */
export function trackSquadBuilt(formation: string, totalRating: number, chemistry: number): void {
  trackEvent({
    action: 'squad_built',
    category: 'Squad Builder',
    label: formation,
    value: totalRating,
    params: {
      formation,
      total_rating: totalRating,
      chemistry,
    },
  });
}

export function trackFormationChange(oldFormation: string, newFormation: string): void {
  trackEvent({
    action: 'formation_changed',
    category: 'Squad Builder',
    label: `${oldFormation} → ${newFormation}`,
  });
}

export function trackPlayerAdded(player: string, position: string, rating: number): void {
  trackEvent({
    action: 'player_added',
    category: 'Squad Builder',
    label: player,
    value: rating,
    params: {
      position,
      rating,
    },
  });
}

/**
 * Player Search Events
 */
export function trackPlayerSearch(query: string, resultsCount: number, timeMs: number): void {
  trackEvent({
    action: 'player_search',
    category: 'Search',
    label: query,
    value: resultsCount,
    params: {
      query,
      results_count: resultsCount,
      search_time_ms: timeMs,
    },
  });
}

export function trackPlayerSearchFilter(filterType: string, filterValue: string): void {
  trackEvent({
    action: 'search_filter_used',
    category: 'Search',
    label: `${filterType}: ${filterValue}`,
  });
}

/**
 * SBC Solver Events
 */
export function trackSBCSolved(sbcName: string, cost: number, players: number): void {
  trackEvent({
    action: 'sbc_solved',
    category: 'SBC Solver',
    label: sbcName,
    value: cost,
    params: {
      sbc_name: sbcName,
      total_cost: cost,
      players_used: players,
    },
  });
}

export function trackSBCFailed(sbcName: string, reason: string): void {
  trackEvent({
    action: 'sbc_failed',
    category: 'SBC Solver',
    label: `${sbcName}: ${reason}`,
  });
}

/**
 * Squad Sharing Events
 */
export function trackSquadShared(method: 'url' | 'twitter' | 'reddit' | 'discord' | 'whatsapp' | 'image'): void {
  trackEvent({
    action: 'squad_shared',
    category: 'Sharing',
    label: method,
    params: {
      share_method: method,
    },
  });
}

export function trackSquadLoaded(source: 'url' | 'local_storage'): void {
  trackEvent({
    action: 'squad_loaded',
    category: 'Sharing',
    label: source,
  });
}

/**
 * Evolution Planner Events
 */
export function trackEvolutionPlanned(evolutionName: string, playerRating: number): void {
  trackEvent({
    action: 'evolution_planned',
    category: 'Evolution',
    label: evolutionName,
    value: playerRating,
    params: {
      evolution_name: evolutionName,
      player_rating: playerRating,
    },
  });
}

export function trackEvolutionStageCompleted(evolutionName: string, stage: number): void {
  trackEvent({
    action: 'evolution_stage_completed',
    category: 'Evolution',
    label: `${evolutionName} - Stage ${stage}`,
    value: stage,
  });
}

/**
 * User Engagement Events
 */
export function trackFeatureUsed(featureName: string): void {
  trackEvent({
    action: 'feature_used',
    category: 'Engagement',
    label: featureName,
  });
}

export function trackTimeSpent(pageName: string, seconds: number): void {
  trackEvent({
    action: 'time_spent',
    category: 'Engagement',
    label: pageName,
    value: seconds,
  });
}

/**
 * Error Tracking
 */
export function trackError(error: Error, context: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
  trackEvent({
    action: 'error',
    category: 'Error',
    label: `${context}: ${error.message}`,
    params: {
      error_message: error.message,
      error_stack: error.stack,
      context,
      severity,
    },
  });

  // Also log to console in development
  if (import.meta.env.DEV) {
    console.error('🔴 Tracked Error:', context, error);
  }
}

/**
 * Performance Tracking
 */
export function trackPerformance(metric: string, value: number, unit: 'ms' | 'bytes' | 'count' = 'ms'): void {
  trackEvent({
    action: 'performance_metric',
    category: 'Performance',
    label: metric,
    value: Math.round(value),
    params: {
      metric,
      value,
      unit,
    },
  });
}

/**
 * Web Vitals Tracking
 */
export function trackWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Dynamically import web-vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, onINP }) => {
    getCLS((metric) => {
      trackPerformance('CLS', metric.value * 1000, 'count');
    });

    getFID((metric) => {
      trackPerformance('FID', metric.value, 'ms');
    });

    getFCP((metric) => {
      trackPerformance('FCP', metric.value, 'ms');
    });

    getLCP((metric) => {
      trackPerformance('LCP', metric.value, 'ms');
    });

    getTTFB((metric) => {
      trackPerformance('TTFB', metric.value, 'ms');
    });

    onINP((metric) => {
      trackPerformance('INP', metric.value, 'ms');
    });
  }).catch((err) => {
    console.warn('Failed to load web-vitals:', err);
  });
}

/**
 * User Properties
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

/**
 * Consent Management
 */
export function updateConsent(granted: boolean): void {
  if (!ENABLE_ANALYTICS || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });

  if (import.meta.env.DEV) {
    console.log('Analytics consent:', granted ? 'granted' : 'denied');
  }
}

/**
 * Session Tracking
 */
let sessionStartTime: number = 0;

export function startSession(): void {
  sessionStartTime = Date.now();
  trackEvent({
    action: 'session_start',
    category: 'Session',
  });
}

export function endSession(): void {
  if (sessionStartTime > 0) {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    trackTimeSpent('total_session', duration);
    trackEvent({
      action: 'session_end',
      category: 'Session',
      value: duration,
    });
  }
}

// Track session end on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    endSession();
  });
}

