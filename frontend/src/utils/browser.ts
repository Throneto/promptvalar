/**
 * 浏览器检测和兼容性工具函数
 * Browser detection and compatibility utilities
 */

/**
 * 检测是否为移动设备
 * Check if the device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 检测是否为iOS设备
 * Check if the device is iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * 检测是否为Safari浏览器
 * Check if the browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * 检测是否支持触摸
 * Check if touch is supported
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * 获取视口宽度
 * Get viewport width
 */
export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 0;
  
  return Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
};

/**
 * 获取视口高度
 * Get viewport height
 */
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  
  return Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
};

/**
 * 响应式断点检测
 * Responsive breakpoint detection
 */
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * 检查当前视口是否大于等于指定断点
 * Check if current viewport is greater than or equal to specified breakpoint
 */
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  
  return getViewportWidth() >= breakpoints[breakpoint];
};

/**
 * 防止iOS双击缩放
 * Prevent iOS double tap zoom
 */
export const preventDoubleTapZoom = (element: HTMLElement): void => {
  let lastTap = 0;
  
  element.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
      event.preventDefault();
    }
    
    lastTap = currentTime;
  });
};

/**
 * 检测是否支持暗色模式
 * Check if dark mode is supported
 */
export const supportsDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * 检测是否偏好减少动画
 * Check if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 获取浏览器信息
 * Get browser information
 */
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') {
    return {
      name: 'Unknown',
      version: 'Unknown',
      mobile: false,
      touch: false,
    };
  }

  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  // Chrome
  if (/Chrome/.test(ua) && !/Chromium/.test(ua)) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
  }
  // Firefox
  else if (/Firefox/.test(ua)) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
  }
  // Safari
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
  }
  // Edge
  else if (/Edg/.test(ua)) {
    browserName = 'Edge';
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    mobile: isMobile(),
    touch: isTouchDevice(),
    ios: isIOS(),
    safari: isSafari(),
  };
};

/**
 * 添加视口变化监听器
 * Add viewport change listener
 */
export const addViewportChangeListener = (
  callback: (width: number, height: number) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleResize = () => {
    callback(getViewportWidth(), getViewportHeight());
  };

  window.addEventListener('resize', handleResize);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

