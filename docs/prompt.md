# 📄 Prompt Phát Triển Ứng Dụng Hóa Đơn Bán Hàng
> Phiên bản: 1.0
>
> Mục tiêu: Xây dựng một Web App chuyên nghiệp, có khả năng mở rộng lâu dài dành cho cửa hàng sản xuất và kinh doanh **Cửa Cuốn - Cửa Kéo - Cửa Đài Loan**.

---

# 🎯 Vai trò

Bạn là **Senior Full Stack Web Developer**, đồng thời là **UI/UX Designer** và **Software Architect**.

Nhiệm vụ của bạn không chỉ là viết code, mà còn phải thiết kế một kiến trúc phần mềm rõ ràng, dễ mở rộng và dễ bảo trì trong nhiều năm.

Hãy luôn ưu tiên:

- Clean Code
- SOLID
- DRY
- KISS
- Mobile First
- Component-based
- Maintainability
- Performance
- Accessibility

---

# 🎯 Mục tiêu dự án

Xây dựng một Web App chạy trên:

- Android
- iPhone
- Tablet
- Máy tính

để tạo hóa đơn bán hàng cho ngành sản xuất cửa.

Ứng dụng hướng đến người dùng là người lớn tuổi nên phải:

- Chữ lớn
- Nút bấm lớn
- Dễ nhìn
- Ít thao tác
- Không gây rối mắt

---

# 📦 Định hướng phát triển

Đây KHÔNG phải là một bài tập HTML đơn giản.

Hãy thiết kế dự án như một sản phẩm thực tế có thể tiếp tục phát triển thêm:

- Quản lý khách hàng
- Quản lý kho
- Quản lý đơn hàng
- Quản lý doanh thu
- Đăng nhập
- Đồng bộ Cloud
- Firebase
- Supabase
- Backend API
- AI
- OCR
- Barcode

mà không cần viết lại từ đầu.

---

# 🏗️ Kiến trúc Project

Bắt buộc tách module.

Ví dụ:

```text
invoice-app/

index.html

assets/
│
├── css/
│     style.css
│
├── js/
│     app.js
│     router.js
│     state.js
│
│     calculator.js
│     invoice.js
│     customer.js
│     printer.js
│     storage.js
│     validation.js
│     vietnameseMoney.js
│     formatter.js
│
├── components/
│     customerForm.js
│     productTable.js
│     productRow.js
│     toolbar.js
│     preview.js
│
├── icons/
│
└── images/
```

Không được viết toàn bộ code trong một file.

---

# 💻 Công nghệ

Sử dụng:

- HTML5
- CSS3
- JavaScript ES6+

UI:

- TailwindCSS (CDN)

Icon:

- Heroicons hoặc Lucide

Không sử dụng framework nặng như React/Vue ở phiên bản đầu tiên.

---

# 📱 Responsive

Thiết kế Mobile First.

Đảm bảo đẹp ở:

- 320px
- 360px
- 375px
- 390px
- 412px
- Tablet
- Desktop

---

# 🎨 Thiết kế giao diện

Phong cách:

- Hiện đại
- Tối giản
- Chuyên nghiệp
- Dễ đọc

Màu chủ đạo:

- Trắng
- Xanh dương nhạt
- Xám sáng

Giao diện giống một ứng dụng thật.

---

# 👴 Tối ưu cho người lớn tuổi

Phải đảm bảo:

- Font lớn
- Khoảng cách rộng
- Nút bấm cao
- Không cần nhập quá nhiều
- Có placeholder rõ ràng
- Có icon minh họa

---

# 📄 Form nhập hóa đơn

Thông tin khách hàng:

- Họ tên
- Địa chỉ
- Số điện thoại

Thông tin hóa đơn:

- Ngày
- Mã hóa đơn (tự sinh)
- Ghi chú

---

# 🚪 Danh sách sản phẩm

Có nút:

➕ Thêm cửa

Mỗi dòng gồm:

Tên sản phẩm

Dropdown:

- Cửa cuốn
- Cửa kéo
- Cửa Đài Loan
- Khác...

Có thể nhập thủ công.

---

Chiều ngang (m)

Input Number

---

Chiều cao (m)

Input Number

---

Đơn giá

Input Number

---

Đơn vị

Mặc định:

m²

---

Tự động tính:

Diện tích = Ngang × Cao

---

Thành tiền

= Diện tích × Đơn giá

---

Có thể xóa từng dòng.

---

# 🧮 Logic tính toán

Realtime.

Không cần bấm nút.

Mỗi khi thay đổi:

- Ngang
- Cao
- Đơn giá

thì:

Diện tích

↓

Thành tiền

↓

Tổng cộng

được cập nhật ngay.

---

# 💰 Định dạng tiền

Ví dụ:

300000

↓

300.000 đ

---

15000000

↓

15.000.000 đ

---

# 🔤 Chuyển số thành chữ

Viết module riêng:

```text
vietnameseMoney.js
```

Ví dụ:

```text
1550000

↓

Một triệu năm trăm năm mươi nghìn đồng.
```

Không hardcode.

---

# 📄 Giao diện hóa đơn

Có màn hình Preview.

Khi nhấn:

>Xem hóa đơn

Form sẽ ẩn.

Hiển thị:

- Logo
- Tên cửa hàng
- Địa chỉ
- Điện thoại
- Tiêu đề HÓA ĐƠN
- Danh sách sản phẩm
- Tổng tiền
- Bằng chữ
- Chữ ký

Thiết kế giống hóa đơn giấy.

---

# 🖨️ In hóa đơn

Có nút:

In / Xuất PDF

Sử dụng:

```javascript
window.print()
```

Sử dụng:

```css
@media print
```

để:

- Ẩn nút
- Ẩn thanh công cụ
- Chỉ in hóa đơn

---

# 💾 Lưu dữ liệu

Phiên bản đầu:

Sử dụng

```text
LocalStorage
```

Yêu cầu:

Tạo abstraction:

```text
StorageService
```

để sau này thay bằng:

- Firebase

hoặc

- Supabase

mà không phải sửa logic.

---

# 🔄 Auto Save

Mỗi lần thay đổi dữ liệu:

↓

Tự lưu.

Nếu reload trang:

↓

Khôi phục dữ liệu.

---

# ↩️ Undo

Có khả năng:

Hoàn tác

nếu xóa nhầm dòng sản phẩm.

---

# ✅ Validation

Không cho phép:

- Chiều ngang âm
- Chiều cao âm
- Giá âm
- Giá trị rỗng

Hiển thị lỗi rõ ràng.

---

# 📊 Model dữ liệu

Thiết kế model rõ ràng.

Ví dụ:

```javascript
Customer

{
    id,
    name,
    address,
    phone
}
```

```javascript
Invoice

{
    id,
    customer,
    date,
    items,
    total,
    totalText,
    note
}
```

```javascript
InvoiceItem

{
    product,
    width,
    height,
    area,
    price,
    total
}
```

---

# 📦 Component

Thiết kế dạng component.

Ví dụ:

- CustomerForm
- InvoiceForm
- ProductTable
- ProductRow
- InvoicePreview
- Toolbar
- Header
- Footer

---

# ⚙️ Utilities

Tách thành module:

- Number Formatter
- Vietnamese Money
- Validation
- Calculator
- Printer
- Storage

---

# 📈 Khả năng mở rộng

Code phải dễ bổ sung:

- Chi phí lắp đặt
- Chi phí vận chuyển
- Thuế VAT
- Giảm giá
- Màu cửa
- Loại motor
- Remote
- Phụ kiện
- Khuyến mãi

mà không cần sửa nhiều.

---

# 🌐 PWA

Thiết kế sẵn để hỗ trợ:

- Install App
- Offline
- Add to Home Screen
- Splash Screen
- App Icon

---

# 🚀 Hiệu năng

Ưu tiên:

- Vanilla JS
- Ít DOM manipulation
- Không dùng thư viện dư thừa

---

# 🧹 Coding Style

Bắt buộc:

- Comment đầy đủ
- Tên biến rõ ràng
- Hàm ngắn
- Không lặp code
- Module hóa
- Dễ đọc

---

# 📚 Khi trả lời

Không viết toàn bộ ứng dụng trong một lần.

Hãy chia thành các giai đoạn:

## Giai đoạn 1

- Thiết kế kiến trúc
- Cấu trúc thư mục
- Data Model

---

## Giai đoạn 2

- UI
- Component

---

## Giai đoạn 3

- Logic tính toán

---

## Giai đoạn 4

- Local Storage

---

## Giai đoạn 5

- Preview

---

## Giai đoạn 6

- Print PDF

---

## Giai đoạn 7

- Hoàn thiện
- Refactor
- Tối ưu

---

# 🎯 Mục tiêu cuối cùng

Tạo ra một Web App chuyên nghiệp, sạch sẽ, dễ mở rộng, dễ bảo trì, hoạt động mượt trên điện thoại và máy tính, đủ chất lượng để có thể phát triển thành một hệ thống quản lý bán hàng hoàn chỉnh trong tương lai.