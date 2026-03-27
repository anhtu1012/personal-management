# 🌊 Quản Lý Lịch Trình - Liquid Glass UI

Ứng dụng quản lý lịch trình cá nhân hiện đại với phong cách Liquid Glass, tối ưu cho cả web và mobile.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.2-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055)

## ✨ Tính năng

### 🏠 Dashboard
- Timeline tuần với quick navigation
- Thống kê real-time (tasks đang chờ, hoàn thành, tiến độ)
- Quick add form inline (không dùng modal)
- Swipe gestures cho mobile
- Responsive grid layout

### 📆 Calendar
- Lịch tháng với visual indicators
- Thống kê tasks theo tháng
- Quick add tasks cho ngày được chọn
- Highlight ngày hôm nay và ngày được chọn
- Smooth month navigation

### 👤 Profile
- Thông tin cá nhân với avatar gradient
- Thống kê tổng quan (tổng, hoàn thành, chờ, delay)
- Tỷ lệ hoàn thành với animated progress bar
- Phân tích theo danh mục với color coding
- Achievement badges

## 🎨 Design System

### Liquid Glass Effect
- **Backdrop blur**: 20px - 30px cho depth
- **Opacity layers**: 5% - 10% white overlay
- **Border**: 1px white với 10% - 20% opacity
- **Shadows**: Soft glows với sky-500 color

### Color Palette
- **Primary**: Sky (#38bdf8)
- **Success**: Green (#4ade80)
- **Warning**: Amber (#fbbf24)
- **Danger**: Orange (#fb923c)
- **Background**: Dark gradient (gray-900 → black)

### Typography
- **Heading**: Noto Sans
- **Body**: Oxanium
- **Mono**: Geist Mono

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📱 Mobile Features

### Swipe Gestures
- **Swipe Right (→)**: Đánh dấu task hoàn thành
- **Swipe Left (←)**: Delay task sang ngày mai
- **Tap**: Xem chi tiết task

### Touch Optimizations
- Larger touch targets (44x44px minimum)
- Haptic feedback ready
- Smooth 60fps animations
- Safe area insets support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.2
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion 12
- **Icons**: Phosphor Icons
- **Date Utils**: date-fns
- **Storage**: Local Storage API

## 📂 Project Structure

```
├── app/
│   ├── page.tsx              # Dashboard (Home)
│   ├── calendar/
│   │   └── page.tsx          # Calendar view
│   ├── profile/
│   │   └── page.tsx          # User profile
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/
│       ├── glass-card.tsx    # Liquid glass card component
│       ├── navigation.tsx    # Bottom navigation
│       ├── swipeable-task.tsx # Task card with gestures
│       ├── button.tsx        # shadcn button
│       ├── input.tsx         # shadcn input
│       ├── textarea.tsx      # shadcn textarea
│       ├── select.tsx        # shadcn select
│       └── label.tsx         # shadcn label
├── hooks/
│   └── use-tasks.ts          # Task management hook
├── lib/
│   ├── storage.ts            # Local storage utilities
│   └── utils.ts              # Helper functions
└── types/
    └── index.ts              # TypeScript definitions
```

## 🎯 Key Features

### 1. No Modals Design
- Inline forms với smooth transitions
- Sidebar panels cho desktop
- Bottom sheets cho mobile
- Better UX flow

### 2. Liquid Glass UI
- Glassmorphism với backdrop-filter
- Layered transparency
- Subtle borders và shadows
- Animated backgrounds

### 3. Responsive Layout
- Mobile-first approach
- Breakpoints: sm (640px), lg (1024px)
- Grid system với auto-fit
- Touch-friendly spacing

### 4. Performance
- Client-side rendering cho interactivity
- Local storage cho instant load
- Optimized animations (GPU accelerated)
- Code splitting với Next.js

## 📊 Component Variants

### GlassCard
```tsx
<GlassCard variant="default" />  // bg-white/5, blur-xl
<GlassCard variant="strong" />   // bg-white/10, blur-2xl
<GlassCard variant="subtle" />   // bg-white/[0.02], blur-lg
```

### Task Categories
- 🏢 **Work**: Sky color (#38bdf8)
- 👤 **Personal**: Purple color (#a78bfa)
- 💪 **Health**: Green color (#4ade80)
- 📌 **Other**: Amber color (#fbbf24)

## 🔧 Configuration

### Tailwind Config
Sử dụng Tailwind CSS v4 với inline theme trong `globals.css`

### Next.js Config
- React Strict Mode enabled
- SWC minification
- Optimized for production

## 📝 Usage Guide

### Tạo Task
1. Nhấn nút **+** hoặc "Thêm task"
2. Form hiện inline (không popup)
3. Điền thông tin: tiêu đề, mô tả, thời gian, danh mục
4. Submit để tạo task

### Quản lý Task
- **Complete**: Swipe phải hoặc click checkbox
- **Delay**: Swipe trái (chuyển sang ngày mai)
- **View**: Click vào task card

### Navigation
- **Home**: Dashboard với timeline tuần
- **Lịch**: Calendar view theo tháng
- **Cá nhân**: Profile và statistics

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - Free to use for personal and commercial projects

---

Made with 💙 using Next.js, TypeScript, and Liquid Glass design
