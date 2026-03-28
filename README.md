# 🌊 Quản Lý Lịch Trình - Liquid Glass UI

Ứng dụng quản lý lịch trình cá nhân hiện đại với phong cách Liquid Glass, tối ưu cho cả web và mobile.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black)
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
- **🔍 Tìm kiếm tasks** - Tìm kiếm theo tiêu đề, mô tả, tags
- **🎯 Lọc nâng cao** - Lọc theo danh mục, ưu tiên, trạng thái

### 📆 Calendar
- Lịch tháng với visual indicators
- Thống kê tasks theo tháng
- Quick add tasks cho ngày được chọn
- Highlight ngày hôm nay và ngày được chọn
- Smooth month navigation

### 📊 Statistics (MỚI)
- Biểu đồ hoàn thành 7 ngày qua
- Streak counter (chuỗi ngày hoàn thành liên tiếp)
- Thống kê theo danh mục và ưu tiên
- Tỷ lệ hoàn thành tổng quan

### ⚙️ Settings (MỚI)
- Bật/tắt thông báo trình duyệt
- Xuất dữ liệu (JSON, CSV)
- Nhập dữ liệu từ file JSON
- Xóa toàn bộ dữ liệu

### 👤 Profile
- Thông tin cá nhân với avatar gradient
- Thống kê tổng quan (tổng, hoàn thành, chờ, delay)
- Tỷ lệ hoàn thành với animated progress bar
- Phân tích theo danh mục với color coding
- Achievement badges

### 🎯 Task Management (NÂNG CẤP)
- **Mức độ ưu tiên** - Cao, Trung bình, Thấp với màu sắc riêng
- **Tags hệ thống** - Gắn nhiều tags cho mỗi task
- **Task lặp lại** - Hàng ngày, hàng tuần, hàng tháng
- **Ghi chú** - Thêm notes chi tiết cho tasks
- **Thông báo** - Nhắc nhở khi đến giờ làm task
- Sắp xếp tự động theo ưu tiên và thời gian

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

### Priority Colors
- **High**: Red (#ef4444)
- **Medium**: Amber (#f59e0b)
- **Low**: Blue (#3b82f6)

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
- **Swipe Left (←)**: Xóa task
- **Tap**: Xem chi tiết task

### Touch Optimizations
- Larger touch targets (44x44px minimum)
- Haptic feedback ready
- Smooth 60fps animations
- Safe area insets support

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.2
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion 12
- **Icons**: Phosphor Icons
- **Date Utils**: date-fns
- **Storage**: Local Storage API
- **Notifications**: Web Notifications API

## 📂 Project Structure

```
├── app/
│   ├── page.tsx              # Dashboard (Home)
│   ├── calendar/
│   │   ├── page.tsx          # Calendar view
│   │   └── create/
│   │       └── page.tsx      # Create task form
│   ├── statistics/
│   │   └── page.tsx          # Statistics & analytics
│   ├── settings/
│   │   └── page.tsx          # Settings & data management
│   ├── profile/
│   │   └── page.tsx          # User profile
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/
│       ├── glass-card.tsx    # Liquid glass card component
│       ├── navigation.tsx    # Bottom navigation (5 tabs)
│       ├── swipeable-task.tsx # Task card with gestures
│       ├── priority-badge.tsx # Priority indicator
│       ├── tag-input.tsx     # Tag input component
│       ├── search-bar.tsx    # Search component
│       ├── filter-panel.tsx  # Filter dropdown
│       ├── button.tsx        # shadcn button
│       ├── input.tsx         # shadcn input
│       ├── textarea.tsx      # shadcn textarea
│       ├── select.tsx        # shadcn select
│       └── label.tsx         # shadcn label
├── hooks/
│   └── use-tasks.ts          # Task management hook (enhanced)
├── lib/
│   ├── storage.ts            # Local storage utilities
│   ├── notifications.ts      # Browser notifications
│   ├── recurring.ts          # Recurring tasks logic
│   ├── export-import.ts      # Data export/import
│   └── utils.ts              # Helper functions
└── types/
    └── index.ts              # TypeScript definitions (enhanced)
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

### 5. Smart Features (MỚI)
- Priority-based sorting
- Tag-based organization
- Recurring tasks automation
- Search & filter capabilities
- Data export/import
- Browser notifications

## 📊 Component Variants

### GlassCard
```tsx
<GlassCard variant="default" />  // bg-white/5, blur-xl
<GlassCard variant="strong" />   // bg-white/10, blur-2xl
<GlassCard variant="subtle" />   // bg-white/[0.02], blur-lg
```

### Task Categories
- 🏢 **Work**: Sky color (#38bdf8)
- 👤 **Personal**: Indigo color (#6366f1)
- 💪 **Health**: Emerald color (#10b981)
- 📌 **Other**: Slate color (#64748b)

### Task Priorities
- 🔴 **High**: Red badge with up arrow
- 🟡 **Medium**: Amber badge with minus
- 🔵 **Low**: Blue badge with down arrow

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
4. Chọn mức độ ưu tiên (Cao/Trung bình/Thấp)
5. Thêm tags (nhấn Enter hoặc dấu phẩy)
6. Chọn lặp lại nếu cần (hàng ngày/tuần/tháng)
7. Submit để tạo task

### Quản lý Task
- **Complete**: Swipe phải hoặc click checkbox
- **Delete**: Swipe trái
- **View**: Click vào task card
- **Search**: Dùng thanh tìm kiếm ở Dashboard
- **Filter**: Click nút Lọc để lọc theo danh mục, ưu tiên, trạng thái

### Navigation
- **Home**: Dashboard với timeline và quick add
- **Lịch**: Calendar view theo tháng
- **Thống kê**: Biểu đồ và phân tích chi tiết
- **Cá nhân**: Profile và statistics
- **Cài đặt**: Quản lý dữ liệu và thông báo

### Export/Import Data
1. Vào trang **Cài đặt**
2. **Xuất**: Chọn JSON hoặc CSV
3. **Nhập**: Upload file JSON đã xuất trước đó

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔔 Notifications

Ứng dụng hỗ trợ thông báo trình duyệt:
1. Vào **Cài đặt**
2. Bật "Nhắc nhở tasks"
3. Cho phép thông báo khi trình duyệt hỏi
4. Nhận thông báo khi đến giờ làm task

## 📄 License

MIT License - Free to use for personal and commercial projects

---

Made with 💙 using Next.js, TypeScript, and Liquid Glass design
