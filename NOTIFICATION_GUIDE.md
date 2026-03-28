# 🔔 Hướng Dẫn Sử Dụng Thông Báo

## Cách Bật Thông Báo

### Trên Mobile (Android/iOS)

#### Android Chrome:
1. Mở ứng dụng trong Chrome
2. Vào **Cài đặt** (Settings) trong app
3. Bật "Nhắc nhở tasks"
4. Cho phép thông báo khi trình duyệt hỏi
5. Nếu không hiện popup:
   - Nhấn vào icon 🔒 hoặc ⓘ bên cạnh URL
   - Chọn "Permissions" hoặc "Site settings"
   - Bật "Notifications"

#### iOS Safari:
1. Mở ứng dụng trong Safari
2. Nhấn nút Share (biểu tượng chia sẻ)
3. Chọn "Add to Home Screen"
4. Mở app từ Home Screen
5. Vào **Cài đặt** trong app
6. Bật "Nhắc nhở tasks"
7. Cho phép thông báo

**Lưu ý iOS:** Thông báo web chỉ hoạt động khi:
- Cài app vào Home Screen (PWA mode)
- iOS 16.4 trở lên
- Đang dùng Safari

### Trên Desktop:

1. Vào **Cài đặt** (Settings)
2. Bật "Nhắc nhở tasks"
3. Cho phép thông báo khi trình duyệt hỏi
4. Nếu đã từ chối trước đó:
   - Chrome: Settings → Privacy and security → Site Settings → Notifications
   - Firefox: Settings → Privacy & Security → Permissions → Notifications
   - Edge: Settings → Cookies and site permissions → Notifications

## Cách Hoạt Động

### Tạo Task Với Thông Báo:

1. **Nút Thêm Nhanh (Navigation):**
   - Nhấn nút ➕ ở giữa navigation bar
   - Điền tiêu đề, ngày, **và giờ** (quan trọng!)
   - Chọn ưu tiên và danh mục
   - Nhấn "Tạo Task"
   - Thông báo sẽ tự động được lên lịch

2. **Trang Tạo Task Đầy Đủ:**
   - Vào Calendar → Tạo task
   - Điền đầy đủ thông tin
   - **Nhớ điền giờ** để có thông báo
   - Nhấn "Tạo Task"

3. **Quick Add Trên Home:**
   - Nhấn nút "Thêm" trên trang Home
   - Điền thông tin và **giờ**
   - Thông báo sẽ được lên lịch

### Khi Nào Thông Báo Hiện:

- ⏰ Đúng giờ bạn đã đặt cho task
- 📱 Có rung (vibration) trên mobile
- 🔔 Âm thanh thông báo (tùy cài đặt thiết bị)
- 📌 Thông báo sẽ ở lại cho đến khi bạn tương tác

### Lưu Ý Quan Trọng:

✅ **Phải điền giờ** - Không có giờ = không có thông báo
✅ **Trong vòng 24h** - Chỉ lên lịch cho tasks trong 24 giờ tới
✅ **Giữ app mở** - Trên một số thiết bị, app cần chạy nền
✅ **Không tắt trình duyệt** - Thông báo cần trình duyệt hoạt động

## Khắc Phục Sự Cố

### Không Nhận Được Thông Báo?

1. **Kiểm tra quyền:**
   - Vào Settings → Nhắc nhở tasks
   - Đảm bảo đã bật

2. **Kiểm tra cài đặt thiết bị:**
   - Android: Settings → Apps → Chrome → Notifications (bật)
   - iOS: Settings → Safari → Notifications (bật)

3. **Kiểm tra task:**
   - Task có giờ chưa?
   - Giờ có trong tương lai không?
   - Giờ có trong vòng 24h không?

4. **Thử lại:**
   - Tạo task mới với giờ 1-2 phút sau
   - Đợi xem có thông báo không

### Thông Báo Bị Mất Sau Khi Tắt App?

- Thông báo được lưu trong localStorage
- Khi mở lại app, chúng sẽ tự động được lên lịch lại
- Nếu đã quá giờ, thông báo sẽ bị xóa

### Test Thông Báo:

1. Vào Settings
2. Bật "Nhắc nhở tasks"
3. Tạo task với giờ 1 phút sau
4. Đợi 1 phút
5. Sẽ có thông báo + rung

## Tính Năng Nâng Cao

### Persistent Reminders:
- Thông báo được lưu trong localStorage
- Tự động reschedule khi mở lại app
- Không mất thông báo khi refresh

### Vibration Pattern:
- Rung 200ms → Dừng 100ms → Rung 200ms
- Chỉ hoạt động trên mobile có hỗ trợ

### Require Interaction:
- Thông báo không tự động biến mất
- Phải nhấn để đóng
- Đảm bảo không bỏ lỡ

## Hỗ Trợ Trình Duyệt

✅ Chrome/Edge (Desktop & Android)
✅ Firefox (Desktop & Android)
✅ Safari (iOS 16.4+, phải cài PWA)
❌ Safari (iOS < 16.4)
❌ In-app browsers (Facebook, Instagram, etc.)

## Tips & Tricks

💡 **Cài PWA:** Thêm vào Home Screen để trải nghiệm tốt nhất
💡 **Đặt giờ cụ thể:** Ví dụ: 14:30 thay vì 14:00
💡 **Test trước:** Tạo task test với giờ gần để kiểm tra
💡 **Giữ app mở:** Để đảm bảo nhận thông báo đúng giờ
💡 **Kiểm tra pin:** Một số thiết bị tắt thông báo khi tiết kiệm pin

---

Nếu vẫn gặp vấn đề, hãy kiểm tra console log trong DevTools để xem lỗi chi tiết.
