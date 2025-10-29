# 主题系统使用示例 / Theme System Usage Examples

## 基础使用 / Basic Usage

### 1. 在组件中使用主题

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setTheme('light')}>亮色模式</button>
      <button onClick={() => setTheme('dark')}>暗色模式</button>
    </div>
  );
}
```

### 2. 使用响应式Hook

```tsx
import { useResponsive } from '../hooks/useResponsive';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  
  return (
    <div>
      <p>视口宽度: {width}px</p>
      {isMobile && <p>移动端视图</p>}
      {isTablet && <p>平板视图</p>}
      {isDesktop && <p>桌面视图</p>}
    </div>
  );
}
```

### 3. 检测特定断点

```tsx
import { useBreakpoint } from '../hooks/useResponsive';

function BreakpointComponent() {
  const isLargeScreen = useBreakpoint('lg');
  
  return (
    <div>
      {isLargeScreen ? (
        <p>显示桌面版导航</p>
      ) : (
        <p>显示移动版导航</p>
      )}
    </div>
  );
}
```

## 样式示例 / Styling Examples

### 1. 基础暗色模式样式

```tsx
// 简单的文字和背景
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  这段文字在暗色模式下会自动调整颜色
</div>

// 边框
<div className="border border-gray-200 dark:border-gray-700">
  带边框的容器
</div>

// 按钮
<button className="bg-primary hover:bg-primary-dark dark:bg-primary-light text-white">
  点击我
</button>
```

### 2. 卡片组件

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700 
      rounded-lg 
      shadow-sm dark:shadow-lg
      p-6
      transition-all duration-200
    ">
      {children}
    </div>
  );
}
```

### 3. 输入框组件

```tsx
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="
        w-full px-4 py-2
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary
        transition-colors duration-200
      "
    />
  );
}
```

### 4. 导航链接

```tsx
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="
        text-gray-700 dark:text-gray-300
        hover:text-primary dark:hover:text-primary-light
        transition-colors duration-200
      "
    >
      {children}
    </a>
  );
}
```

## 响应式设计示例 / Responsive Design Examples

### 1. 响应式网格

```tsx
function ResponsiveGrid() {
  return (
    <div className="
      grid 
      grid-cols-1      /* 手机: 1列 */
      sm:grid-cols-2   /* 小平板: 2列 */
      md:grid-cols-3   /* 平板: 3列 */
      lg:grid-cols-4   /* 桌面: 4列 */
      gap-4
    ">
      {/* 网格项 */}
    </div>
  );
}
```

### 2. 响应式导航

```tsx
function Navigation() {
  const { isMobile } = useResponsive();
  
  return (
    <nav>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </nav>
  );
}
```

### 3. 响应式隐藏/显示

```tsx
function ResponsiveVisibility() {
  return (
    <div>
      {/* 只在移动端显示 */}
      <div className="block md:hidden">
        移动端内容
      </div>
      
      {/* 只在平板及以上显示 */}
      <div className="hidden md:block">
        桌面端内容
      </div>
      
      {/* 在大屏幕显示完整版，小屏幕显示简化版 */}
      <div className="lg:text-2xl md:text-xl text-lg">
        响应式文字大小
      </div>
    </div>
  );
}
```

### 4. 响应式间距和内边距

```tsx
function ResponsivePadding() {
  return (
    <div className="
      p-4           /* 手机: 16px */
      md:p-6        /* 平板: 24px */
      lg:p-8        /* 桌面: 32px */
    ">
      内容区域
    </div>
  );
}
```

## 高级用法 / Advanced Usage

### 1. 自定义主题颜色

```tsx
// 在组件中动态应用主题
function ThemedButton() {
  const { theme } = useTheme();
  
  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
    color: 'white',
  };
  
  return <button style={buttonStyle}>自定义样式按钮</button>;
}
```

### 2. 检测浏览器能力

```tsx
import { getBrowserInfo, isTouchDevice, prefersReducedMotion } from '../utils/browser';

function BrowserAdaptive() {
  const browserInfo = getBrowserInfo();
  const isTouch = isTouchDevice();
  const reduceMotion = prefersReducedMotion();
  
  return (
    <div>
      <p>浏览器: {browserInfo.name} {browserInfo.version}</p>
      <p>触摸设备: {isTouch ? '是' : '否'}</p>
      {reduceMotion && <p>用户偏好减少动画</p>}
    </div>
  );
}
```

### 3. 监听视口变化

```tsx
import { useState, useEffect } from 'react';
import { addViewportChangeListener } from '../utils/browser';

function ViewportListener() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const cleanup = addViewportChangeListener((width, height) => {
      setViewport({ width, height });
      console.log(`视口变化: ${width}x${height}`);
    });
    
    return cleanup;
  }, []);
  
  return (
    <div>
      视口大小: {viewport.width} x {viewport.height}
    </div>
  );
}
```

## 完整组件示例 / Complete Component Examples

### 1. 响应式卡片列表

```tsx
import { useResponsive } from '../hooks/useResponsive';

interface Card {
  id: number;
  title: string;
  description: string;
}

function CardList({ cards }: { cards: Card[] }) {
  const { isMobile } = useResponsive();
  
  return (
    <div className={`
      grid gap-4
      ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
    `}>
      {cards.map((card) => (
        <div
          key={card.id}
          className="
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg p-6
            hover:shadow-lg dark:hover:shadow-2xl
            transition-all duration-300
          "
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {card.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### 2. 带主题切换的设置面板

```tsx
import { useTheme } from '../contexts/ThemeContext';

function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700 
      rounded-lg p-6
    ">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        外观设置
      </h2>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="form-radio text-primary"
          />
          <span className="text-gray-700 dark:text-gray-300">亮色模式</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="form-radio text-primary"
          />
          <span className="text-gray-700 dark:text-gray-300">暗色模式</span>
        </label>
      </div>
    </div>
  );
}
```

## 最佳实践 / Best Practices

### 1. 性能优化

```tsx
// ✅ 好的做法: 使用CSS类
<div className="bg-white dark:bg-gray-900">内容</div>

// ❌ 不好的做法: 使用内联样式和条件判断
const { theme } = useTheme();
<div style={{ backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }}>
  内容
</div>
```

### 2. 语义化颜色

```tsx
// ✅ 好的做法: 使用语义化的颜色类
<div className="text-gray-900 dark:text-gray-100">主要文字</div>
<div className="text-gray-600 dark:text-gray-400">次要文字</div>

// ❌ 不好的做法: 硬编码颜色
<div className="text-black dark:text-white">文字</div>
```

### 3. 过渡动画

```tsx
// ✅ 好的做法: 添加平滑过渡
<div className="transition-colors duration-200 bg-white dark:bg-gray-900">
  内容
</div>

// ❌ 不好的做法: 没有过渡效果
<div className="bg-white dark:bg-gray-900">内容</div>
```

### 4. 辅助功能

```tsx
// ✅ 好的做法: 确保足够的对比度
<button className="
  bg-primary text-white 
  hover:bg-primary-dark 
  dark:bg-primary-light dark:text-gray-900
">
  按钮
</button>

// 添加适当的 aria 标签
<button aria-label="切换主题">
  <ThemeIcon />
</button>
```

## 调试技巧 / Debugging Tips

### 1. 检查当前主题

```tsx
import { useTheme } from '../contexts/ThemeContext';

function DebugTheme() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded">
      当前主题: {theme}
    </div>
  );
}
```

### 2. 检查响应式断点

```tsx
import { useResponsive } from '../hooks/useResponsive';

function DebugBreakpoint() {
  const responsive = useResponsive();
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded">
      <p>宽度: {responsive.width}px</p>
      <p>移动端: {responsive.isMobile ? '是' : '否'}</p>
      <p>平板: {responsive.isTablet ? '是' : '否'}</p>
      <p>桌面: {responsive.isDesktop ? '是' : '否'}</p>
    </div>
  );
}
```

## 故障排除 / Troubleshooting

### 问题1: 主题切换不生效

**解决方案:**
- 确保 `ThemeProvider` 包裹了整个应用
- 检查 `tailwind.config.js` 中是否启用了 `darkMode: 'class'`
- 确保 HTML 元素上正确添加了 `dark` 类

### 问题2: 样式在某些浏览器不工作

**解决方案:**
- 检查 `.browserslistrc` 配置
- 运行 `npm run build` 确保样式正确编译
- 使用 PostCSS 的 autoprefixer

### 问题3: 移动端显示异常

**解决方案:**
- 检查 viewport meta 标签
- 确保使用响应式断点类
- 测试不同设备和浏览器

## 相关资源 / Related Resources

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Can I Use](https://caniuse.com/) - 浏览器兼容性查询

