# Z-Index Hierarchy Guide

## Z-Index Levels

Để tránh conflict giữa các layers, đây là hệ thống z-index được sử dụng:

### Base Layers (0-10)
- `z-0` - Default layer
- `z-10` - Elevated content (cards, panels)

### Content Layers (20-40)
- `z-20` - Sticky headers
- `z-30` - Dropdowns, tooltips
- `z-40` - Popovers, date pickers

### Overlay Layers (50-70)
- `z-50` - Navigation bar (bottom fixed)
- `z-60` - Filter panel backdrop
- `z-70` - Filter panel content

### Modal Layers (80-100)
- `z-80` - Modal backdrop
- `z-90` - Modal content
- `z-100` - Quick add modal backdrop
- `z-101` - Quick add modal content

### Toast/Alert Layers (110+)
- `z-110` - Toast notifications
- `z-120` - Critical alerts

## Current Usage

### Navigation (`z-50`)
```tsx
<nav className="fixed inset-x-0 bottom-0 z-50">
```

### Filter Panel (`z-60` backdrop, `z-70` content)
```tsx
<div className="fixed inset-0 z-60 bg-slate-900/25" />
<div className="absolute right-0 top-full z-70">
```

### Quick Add Modal (`z-100` backdrop, `z-101` content)
```tsx
<div className="fixed inset-0 z-100 bg-slate-900/40" />
<div className="fixed inset-x-4 top-1/2 z-101">
```

### Home Quick Add Sheet (`z-50`)
```tsx
<div className="fixed inset-x-0 bottom-20 z-50">
```

## Rules

1. **Navigation** luôn ở `z-50` (bottom bar)
2. **Dropdowns/Filters** dùng `z-60` (backdrop) và `z-70` (content)
3. **Modals** dùng `z-100+` để luôn ở trên cùng
4. **Backdrop** luôn thấp hơn content 10 units
5. Không dùng z-index tùy ý, phải theo hierarchy này

## Troubleshooting

### Filter bị che bởi Navigation?
- Đảm bảo filter backdrop là `z-60` và content là `z-70`
- Navigation chỉ nên là `z-50`

### Modal bị che?
- Modal phải dùng `z-100+`
- Backdrop modal phải cao hơn tất cả content khác

### Dropdown bị che?
- Dropdown nên dùng `z-30-40`
- Nếu trong modal, có thể cần `z-105+`
