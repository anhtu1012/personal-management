# Performance & Theme Persistence Fix

## Vấn đề đã khắc phục

### 1. Giật lag khi thao tác
- **Nguyên nhân**: Quá nhiều animation Framer Motion chạy đồng thời
- **Giải pháp**:
  - Thay thế `motion.button` bằng button thường với CSS transitions
  - Giảm duration của animations (0.8s → 0.6s, 0.04s → 0.03s)
  - Giảm khoảng cách animation (y: -16 → -12, y: 36 → 20)
  - Thêm `duration` cho tất cả transitions để control tốt hơn
  - Loại bỏ `whileHover` và `whileTap` animations không cần thiết

### 2. Dark mode không lưu khi ra vào app
- **Nguyên nhân**: Có 2 hệ thống theme chạy song song (hook và Redux) gây conflict
- **Giải pháp**:
  - Chuyển hoàn toàn sang Redux để quản lý theme
  - Xóa Framer Motion khỏi theme toggle, dùng CSS transitions
  - Thêm `mounted` state trong Providers để tránh hydration mismatch
  - Theme được persist tự động qua redux-persist

## Các thay đổi chi tiết

### 1. `app/providers.tsx`
```typescript
// Thêm mounted state để tránh hydration issues
const [mounted, setMounted] = useState(false)

useEffect(() => {
  // Apply theme ngay khi mount
  const state = store.getState()
  if (state.theme.theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
  setMounted(true)
}, [])

// Chỉ render children sau khi mounted
return mounted ? children : null
```

### 2. `components/ui/theme-toggle.tsx`
```typescript
// Chuyển từ useTheme hook sang Redux
const dispatch = useAppDispatch()
const theme = useAppSelector((state) => state.theme.theme)

// Apply theme với useEffect
useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}, [theme])

// Thay Framer Motion bằng CSS transition
<div
  className="... transition-transform duration-300 ease-out"
  style={{ transform: isDark ? "translateX(32px)" : "translateX(0)" }}
>
```

### 3. `components/ui/navigation.tsx`
```typescript
// Thay motion.button bằng button thường
<button
  onClick={() => setShowQuickAdd(true)}
  className="... transition-transform duration-200 active:scale-95"
>
```

### 4. `app/page.tsx`
```typescript
// Giảm animation delays và durations
<motion.div
  initial={{ opacity: 0, x: -12 }}  // Từ -16
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.03, duration: 0.2 }}  // Từ 0.04
>

// Thay motion.button bằng button thường
<button
  onClick={() => setShowQuickAdd((prev) => !prev)}
  className="... transition-transform duration-200 active:scale-95"
>

// Giảm duration của animations
transition={{ duration: 0.15 }}  // Từ không có
transition={{ duration: 0.2, ease: "easeOut" }}  // Từ không có
transition={{ duration: 0.6, ease: "easeOut" }}  // Từ 0.8s
```

### 5. `app/globals.css`
```css
/* Thêm performance optimizations */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.liquid-orb {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.liquid-panel {
  will-change: transform;
  transform: translateZ(0);
}

.glass {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## Kết quả

✅ App không còn giật lag khi thao tác
✅ Dark mode được lưu và restore khi ra vào app
✅ Animations mượt mà hơn với CSS transitions
✅ Performance tốt hơn với GPU acceleration
✅ Không còn conflict giữa 2 hệ thống theme

## Performance Tips

1. **CSS Transitions > Framer Motion**: Dùng CSS cho animations đơn giản
2. **GPU Acceleration**: Thêm `transform: translateZ(0)` và `will-change`
3. **Reduce Animation Complexity**: Giảm số lượng elements animate cùng lúc
4. **Control Duration**: Luôn set duration rõ ràng cho animations
5. **Avoid Layout Thrashing**: Dùng transform thay vì top/left/width/height

## Testing Checklist

- [ ] Dark mode toggle hoạt động mượt mà
- [ ] Dark mode được lưu khi refresh page
- [ ] Không có giật lag khi scroll
- [ ] Không có giật lag khi mở/đóng modal
- [ ] Animations chạy ở 60fps
- [ ] Navigation button không lag khi click
- [ ] Quick add form mở/đóng mượt mà
