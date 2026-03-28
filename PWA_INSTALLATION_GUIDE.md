# 📱 Hướng Dẫn Cài Đặt PWA Để Nhận Thông Báo Background

## Tại Sao Cần Cài PWA?

Để nhận thông báo **ngay cả khi app đóng** hoặc **ở background**, bạn cần cài đặt app như một PWA (Progressive Web App). Điều này cho phép:

✅ Thông báo hiện ở ngoài màn hình (system notifications)
✅ Thông báo hoạt động khi app đóng
✅ Thông báo hoạt động khi điện thoại khóa màn hình
✅ App chạy như native app
✅ Icon trên home screen

## Cài Đặt Trên Android

### Chrome (Khuyến nghị)

1. **Mở app trong Chrome:**
   - Truy cập: `https://your-domain.com`
   - Hoặc `http://localhost:3000` (dev)

2. **Cài đặt PWA:**
   - Nhấn menu (⋮) ở góc trên bên phải
   - Chọn **"Add to Home screen"** hoặc **"Install app"**
   - Hoặc sẽ có banner popup ở dưới: **"Add [App Name] to Home screen"**
   - Nhấn **"Add"** hoặc **"Install"**

3. **Đặt tên (tùy chọn):**
   - Có thể đổi tên app
   - Nhấn **"Add"**

4. **Hoàn thành:**
   - Icon app sẽ xuất hiện trên Home screen
   - Mở app từ icon này (không phải từ Chrome)

### Firefox

1. Mở app trong Firefox
2. Nhấn menu (⋮)
3. Chọn **"Install"**
4. Nhấn **"Add to Home screen"**

### Samsung Internet

1. Mở app trong Samsung Internet
2. Nhấn menu (≡)
3. Chọn **"Add page to"**
4. Chọn **"Home screen"**

## Cài Đặt Trên iOS (iPhone/iPad)

### Safari (BẮT BUỘC - iOS 16.4+)

⚠️ **Quan trọng:** Thông báo web chỉ hoạt động trên iOS 16.4 trở lên!

1. **Mở app trong Safari:**
   - Phải dùng Safari, không dùng Chrome/Firefox
   - Truy cập: `https://your-domain.com`

2. **Thêm vào Home Screen:**
   - Nhấn nút **Share** (biểu tượng chia sẻ) ở dưới
   - Cuộn xuống và chọn **"Add to Home Screen"**
   - Hoặc tìm icon với dấu ➕

3. **Đặt tên:**
   - Đặt tên cho app (mặc định: "Lịch Trình")
   - Nhấn **"Add"** ở góc trên bên phải

4. **Hoàn thành:**
   - Icon app xuất hiện trên Home screen
   - **Quan trọng:** Phải mở từ icon này, không mở từ Safari

5. **Bật thông báo:**
   - Mở app từ Home screen
   - Vào Settings trong app
   - Bật "Nhắc nhở tasks"
   - Cho phép thông báo

## Kiểm Tra Đã Cài Đúng Chưa

### Android:
✅ Icon app trên Home screen
✅ Mở app không có thanh địa chỉ Chrome
✅ App chạy fullscreen
✅ Có splash screen khi mở

### iOS:
✅ Icon app trên Home screen  
✅ Mở app không có thanh Safari
✅ App chạy fullscreen
✅ Có thể swipe up để đóng như app thật

## Bật Thông Báo Sau Khi Cài PWA

### Bước 1: Mở App Từ Home Screen
- **Quan trọng:** Phải mở từ icon trên Home screen
- Không mở từ browser

### Bước 2: Vào Settings
- Nhấn tab **Settings** (⚙️) ở navigation bar
- Hoặc vào `/settings`

### Bước 3: Bật Thông Báo
- Tìm phần **"Thông báo"**
- Nhấn nút toggle để bật
- Cho phép khi hệ thống hỏi

### Bước 4: Test
- Nhấn **"🧪 Test thông báo"**
- Chọn test ngay lập tức
- Nếu thấy thông báo → Thành công!

## Test Thông Báo Background

### Test 1: App Ở Background
1. Tạo task với giờ 1 phút sau
2. Nhấn Home button (app vào background)
3. Đợi 1 phút
4. Thông báo sẽ hiện ở ngoài màn hình ✅

### Test 2: App Đã Đóng
1. Tạo task với giờ 2 phút sau
2. Đóng app hoàn toàn (swipe up)
3. Đợi 2 phút
4. Thông báo vẫn hiện ✅

### Test 3: Màn Hình Khóa
1. Tạo task với giờ 1 phút sau
2. Khóa màn hình điện thoại
3. Đợi 1 phút
4. Thông báo hiện trên lock screen ✅

## Troubleshooting

### Không Thấy "Add to Home Screen"?

**Android Chrome:**
- Đảm bảo đang dùng HTTPS (hoặc localhost)
- Manifest.json phải hợp lệ
- Service Worker phải đăng ký thành công
- Thử refresh trang và đợi vài giây

**iOS Safari:**
- Phải dùng Safari, không phải Chrome
- iOS phải 16.4 trở lên
- Kiểm tra Settings → Safari → Advanced → Experimental Features

### Đã Cài Nhưng Không Nhận Thông Báo?

1. **Kiểm tra quyền:**
   - Android: Settings → Apps → [App Name] → Notifications (bật)
   - iOS: Settings → [App Name] → Notifications (bật)

2. **Kiểm tra Do Not Disturb:**
   - Tắt chế độ im lặng
   - Tắt Focus mode
   - Kiểm tra volume

3. **Kiểm tra app:**
   - Phải mở từ Home screen icon
   - Phải bật thông báo trong app Settings
   - Phải điền giờ khi tạo task

4. **Thử cài lại:**
   - Xóa app khỏi Home screen
   - Clear browser cache
   - Cài lại từ đầu

### iOS Không Hoạt Động?

⚠️ **Yêu cầu:**
- iOS 16.4 trở lên (kiểm tra: Settings → General → About)
- Phải cài PWA (Add to Home Screen)
- Phải mở từ Home screen icon
- Không hoạt động trong Safari browser thông thường

⚠️ **Không hỗ trợ:**
- iOS < 16.4
- In-app browsers (Facebook, Instagram, etc.)
- Chrome/Firefox trên iOS

## Lợi Ích Của PWA

### So với Web App Thông Thường:
✅ Thông báo background
✅ Offline support
✅ Faster loading (cached)
✅ Native app experience
✅ Home screen icon
✅ No app store needed

### So với Native App:
✅ Không cần download từ store
✅ Không tốn dung lượng nhiều
✅ Update tự động
✅ Cross-platform (Android + iOS)
✅ Dễ cài đặt hơn

## Gỡ Cài Đặt PWA

### Android:
1. Long press icon trên Home screen
2. Chọn **"Uninstall"** hoặc **"Remove"**
3. Hoặc: Settings → Apps → [App Name] → Uninstall

### iOS:
1. Long press icon trên Home screen
2. Chọn **"Remove App"**
3. Chọn **"Delete App"**

## Tips

💡 **Cài ngay:** Cài PWA ngay từ đầu để trải nghiệm tốt nhất
💡 **Mở đúng cách:** Luôn mở từ Home screen icon
💡 **Test trước:** Test thông báo trước khi dùng thật
💡 **Update:** PWA tự động update khi có version mới
💡 **Battery:** PWA tiết kiệm pin hơn web app thông thường

## Kết Luận

Để nhận thông báo **ở ngoài màn hình** khi app đóng:
1. ✅ Cài PWA (Add to Home Screen)
2. ✅ Mở từ Home screen icon
3. ✅ Bật thông báo trong Settings
4. ✅ Tạo task với giờ cụ thể
5. ✅ Đợi và nhận thông báo!

---

Nếu vẫn gặp vấn đề, hãy test trên trang `/test-notification` để debug.
