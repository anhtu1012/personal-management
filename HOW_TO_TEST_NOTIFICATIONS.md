# 🧪 Hướng Dẫn Test Thông Báo

## Cách Test Nhanh

### Bước 1: Vào Trang Test
1. Mở ứng dụng
2. Vào **Settings** (⚙️)
3. Nhấn nút **"🧪 Test thông báo"**
4. Hoặc truy cập trực tiếp: `/test-notification`

### Bước 2: Cấp Quyền
1. Nhấn nút **"🔔 Yêu cầu quyền thông báo"**
2. Trình duyệt sẽ hiện popup
3. Nhấn **"Allow"** hoặc **"Cho phép"**
4. Trạng thái sẽ chuyển sang **"✅ Đã cấp quyền"**

### Bước 3: Test Thông Báo

#### Test Ngay Lập Tức (⚡)
- Nhấn **"⚡ Test ngay lập tức"**
- Thông báo sẽ hiện ngay
- Nếu không thấy → Kiểm tra settings trình duyệt

#### Test Sau 5 Giây (⏱️)
- Nhấn **"⏱️ Test sau 5 giây"**
- Đợi 5 giây
- Thông báo sẽ hiện với tiêu đề "⏰ Thông Báo 5 Giây"

#### Test Sau 30 Giây (⏰)
- Nhấn **"⏰ Test sau 30 giây"**
- Đợi 30 giây
- Thông báo sẽ hiện với tiêu đề "⏰ Thông Báo 30 Giây"

#### Test Scheduled (📅)
- Nhấn **"📅 Test scheduled (10 giây)"**
- Đợi 10 giây
- Thông báo sẽ hiện với tiêu đề "⏰ Nhắc nhở Task"
- Test này giống với cách app schedule thông báo thật

## Kiểm Tra Reminders

Nhấn **"📋 Kiểm tra reminders"** để xem:
- Số lượng reminders đang chờ
- Thời gian của từng reminder
- Tiêu đề của từng reminder

## Troubleshooting

### Không Thấy Thông Báo?

#### 1. Kiểm tra quyền:
```
Trạng thái phải là: ✅ Đã cấp quyền
Nếu không → Nhấn "Yêu cầu quyền" lại
```

#### 2. Kiểm tra settings trình duyệt:

**Chrome Desktop:**
1. Settings → Privacy and security
2. Site Settings → Notifications
3. Tìm localhost hoặc domain của bạn
4. Đảm bảo là "Allow"

**Chrome Mobile:**
1. Settings → Site settings
2. Notifications
3. Tìm site của bạn
4. Bật notifications

**Safari iOS:**
1. Settings → Safari
2. Notifications
3. Bật cho site của bạn
4. **Lưu ý:** Phải cài PWA (Add to Home Screen)

#### 3. Kiểm tra Do Not Disturb:
- Desktop: Tắt Focus/DND mode
- Mobile: Tắt chế độ im lặng
- Kiểm tra volume không bị mute

#### 4. Kiểm tra tab:
- Tab phải đang mở (không đóng)
- Trình duyệt không bị minimize hoàn toàn
- Trên mobile, app có thể cần ở foreground

### Thông Báo Hiện Nhưng Không Rung?

Vibration chỉ hoạt động trên:
- ✅ Android Chrome
- ✅ Android Firefox
- ❌ iOS (không hỗ trợ vibration API)
- ❌ Desktop (không có vibration)

### Thông Báo Biến Mất Ngay?

Một số thông báo có `requireInteraction: false` sẽ tự động biến mất sau vài giây. Đây là hành vi bình thường.

## Test Với Task Thật

### Cách 1: Quick Add Modal
1. Nhấn nút ➕ ở navigation
2. Điền tiêu đề: "Test Task"
3. Chọn ngày: Hôm nay
4. **Điền giờ:** 1-2 phút sau giờ hiện tại
5. Nhấn "Tạo Task"
6. Đợi đến giờ → Sẽ có thông báo

### Cách 2: Create Page
1. Vào Calendar → Tạo task
2. Điền đầy đủ thông tin
3. **Quan trọng:** Điền giờ
4. Tạo task
5. Đợi đến giờ

### Cách 3: Home Quick Add
1. Ở trang Home, nhấn "Thêm"
2. Điền thông tin và giờ
3. Tạo task
4. Đợi thông báo

## Kiểm Tra Console

Mở DevTools (F12) và xem Console:

```javascript
// Kiểm tra permission
console.log(Notification.permission)
// Kết quả: "granted", "denied", hoặc "default"

// Kiểm tra reminders
console.log(localStorage.getItem('task_reminders'))
// Kết quả: JSON array của reminders

// Test thông báo thủ công
new Notification("Test", { body: "Hello" })
```

## Các Trường Hợp Đặc Biệt

### iOS Safari
- **Bắt buộc:** Phải cài PWA (Add to Home Screen)
- **Bắt buộc:** iOS 16.4 trở lên
- Không hoạt động trong Safari browser thông thường
- Không hoạt động trong in-app browsers

### Android
- Hoạt động tốt trong Chrome/Firefox
- Không cần cài PWA
- Hỗ trợ vibration
- Hỗ trợ notification actions

### Desktop
- Hoạt động tốt trên tất cả browsers
- Không có vibration
- Có thể có notification center
- Có thể có âm thanh

## Kết Quả Mong Đợi

### Thành Công ✅
- Thông báo hiện đúng giờ
- Có tiêu đề và nội dung
- Có icon/badge
- Có âm thanh (nếu không mute)
- Có rung (trên Android)

### Thất Bại ❌
- Không có thông báo nào
- Thông báo bị chặn
- Không có âm thanh/rung
- Thông báo không đúng thời gian

## Tips

💡 **Test nhiều lần:** Thử cả 4 loại test để đảm bảo
💡 **Kiểm tra log:** Xem "Kết quả test" để debug
💡 **Đợi đủ thời gian:** Đừng tắt tab quá sớm
💡 **Thử nhiều trình duyệt:** Nếu một browser không được
💡 **Kiểm tra reminders:** Dùng nút "📋 Kiểm tra reminders"

## Support

Nếu vẫn không hoạt động sau khi thử tất cả:
1. Kiểm tra browser version (cần version mới)
2. Thử trình duyệt khác
3. Kiểm tra OS settings
4. Restart browser
5. Clear cache và thử lại
