import { useState, useEffect } from 'react';
import { breakpoints, type Breakpoint, getViewportWidth } from '../utils/browser';

/**
 * 响应式Hook - 检测当前视口大小
 * Responsive hook - detect current viewport size
 * 
 * @example
 * const { isMobile, isTablet, isDesktop, width } = useResponsive();
 */
export function useResponsive() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? getViewportWidth() : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWidth(getViewportWidth());
    };

    window.addEventListener('resize', handleResize);
    
    // 初始化时调用一次
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    isXs: width < breakpoints.xs,
    isSm: width >= breakpoints.sm && width < breakpoints.md,
    isMd: width >= breakpoints.md && width < breakpoints.lg,
    isLg: width >= breakpoints.lg && width < breakpoints.xl,
    isXl: width >= breakpoints.xl && width < breakpoints['2xl'],
    is2Xl: width >= breakpoints['2xl'],
  };
}

/**
 * 检测特定断点的Hook
 * Hook to detect specific breakpoint
 * 
 * @example
 * const isDesktop = useBreakpoint('lg');
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState<boolean>(
    typeof window !== 'undefined' ? getViewportWidth() >= breakpoints[breakpoint] : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setMatches(getViewportWidth() >= breakpoints[breakpoint]);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return matches;
}

/**
 * 检测是否为移动设备的Hook
 * Hook to detect if device is mobile
 */
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

