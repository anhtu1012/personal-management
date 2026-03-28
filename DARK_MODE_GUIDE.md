# Dark Mode Implementation Guide

## Overview
Ứng dụng đã được cải thiện với dark mode hoàn chỉnh, sử dụng Tailwind CSS dark mode với class strategy.

## Theme System

### Theme Toggle
- Component: `components/ui/theme-toggle.tsx`
- Dạng switch bật/tắt (Light ↔ Dark)
- Lưu preference trong localStorage
- Auto-apply khi load app

### CSS Variables
Dark mode sử dụng CSS variables được định nghĩa trong `app/globals.css`:

```css
:root {
  --background: oklch(0.985 0.004 260);  /* Light background */
  --foreground: oklch(0.23 0.02 260);    /* Light text */
  /* ... */
}

.dark {
  --background: oklch(0.15 0.015 260);   /* Dark background */
  --foreground: oklch(0.92 0.01 260);    /* Dark text */
  /* ... */
}
```

## Dark Mode Classes

### Liquid Glass Effects
Tất cả liquid glass components đã có dark mode:

- `.glass` - Glass effect cơ bản
- `.glass-strong` - Glass effect mạnh
- `.glass-subtle` - Glass effect nhẹ
- `.liquid-panel` - Panel với glass effect
- `.liquid-sheet` - Sheet với glass effect
- `.liquid-title` - Gradient text title
- `.liquid-chip` - Chip/badge component

### Background & Gradients
```css
/* Light mode */
body {
  background: linear-gradient(...light colors...);
}

/* Dark mode */
.dark body {
  background: linear-gradient(...dark colors...);
}
```

## Component Dark Mode Support

### ✅ Fully Supported Components

1. **Navigation** (`components/ui/navigation.tsx`)
   - Dark background: `dark:bg-slate-800/80`
   - Dark borders: `dark:border-slate-600/60`
   - Dark text: `dark:text-slate-100`
   - Dark active state: `dark:bg-slate-700/90`

2. **Search Bar** (`components/ui/search-bar.tsx`)
   - Dark background: `dark:bg-slate-800/75`
   - Dark text: `dark:text-slate-100`
   - Dark placeholder: `dark:placeholder:text-slate-500`
   - Dark hover: `dark:hover:bg-slate-700`

3. **Filter Panel** (`components/ui/filter-panel.tsx`)
   - Dark backdrop: `dark:bg-black/40`
   - Dark text: `dark:text-slate-100`
   - Dark badge: `dark:bg-slate-300 dark:text-slate-900`

4. **Theme Toggle** (`components/ui/theme-toggle.tsx`)
   - Dark track: `dark:bg-slate-700`
   - Dark border: `dark:border-slate-600/60`

5. **Input** (`components/ui/input.tsx`)
   - Dark background: `dark:bg-input/30`
   - Dark invalid: `dark:aria-invalid:border-destructive/50`

### 🔄 Components Needing Updates

Các component sau cần thêm dark mode classes:

1. **SwipeableTask** - Hardcoded colors cho swipe actions
2. **PriorityBadge** - Hardcoded red/amber/blue colors
3. **DayDetailModal** - Hardcoded white backgrounds
4. **ExpandableCalendar** - Hardcoded slate colors
5. **QuickAddModal** - Hardcoded white backgrounds
6. **InstallPWABanner** - Hardcoded emerald colors

## Usage Guidelines

### Adding Dark Mode to New Components

1. **Use Tailwind dark: variant**
```tsx
<div className="bg-white dark:bg-slate-800">
  <p className="text-slate-800 dark:text-slate-100">Text</p>
</div>
```

2. **Use CSS variables**
```tsx
<div className="bg-background text-foreground">
  Content adapts automatically
</div>
```

3. **Use liquid classes**
```tsx
<div className="liquid-panel">
  Auto dark mode support
</div>
```

### Color Palette

#### Light Mode
- Background: `#f6f8fc` (slate-50)
- Text: `#0f172a` (slate-900)
- Border: `rgba(148, 163, 184, 0.35)` (slate-400)
- Glass: `rgba(255, 255, 255, 0.82)`

#### Dark Mode
- Background: `#0f1419` (slate-950)
- Text: `#e2e8f0` (slate-200)
- Border: `rgba(71, 85, 105, 0.5)` (slate-600)
- Glass: `rgba(30, 41, 59, 0.72)`

## Testing Dark Mode

1. Click theme toggle in Settings page
2. Check all pages:
   - Home (/)
   - Calendar (/calendar)
   - Profile (/profile)
   - Settings (/settings)
   - Statistics (/statistics)
   - Templates (/templates)

3. Verify:
   - Text is readable
   - Borders are visible
   - Glass effects work
   - Modals have proper backdrop
   - Navigation is clear
   - Buttons are visible

## Known Issues

### Fixed ✅
- Navigation bar dark mode
- Search bar dark mode
- Filter panel dark mode
- Theme toggle functionality
- CSS variables for all colors
- Liquid glass effects
- Background gradients
- Scrollbar colors

### To Fix 🔧
- SwipeableTask swipe indicators
- Priority badge colors
- Category badge colors
- Modal backdrops consistency
- Calendar day cells
- Task cards in dark mode

## Future Improvements

1. **Auto mode** - Detect system preference
2. **Smooth transitions** - Animate color changes
3. **Per-component themes** - Allow custom themes
4. **High contrast mode** - Accessibility
5. **Color customization** - User-defined colors

## Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [OKLCH Color Space](https://oklch.com/)
