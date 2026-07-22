/**
 * Module Printer Xử lý in Hóa đơn và Tự động đặt tên file khi lưu PDF
 */

const printer = (function () {
    function printInvoice() {
        const state = typeof stateManager !== 'undefined' ? stateManager.getState() : {};
        const originalTitle = document.title;

        // Tạo tên file tự động: [Mã Hóa Đơn] - [Tên Khách Hàng] - Hoa Don Ban Hang
        const rawBuyerName = state.buyerName ? state.buyerName.trim() : 'KhachHang';
        // Xóa ký tự đặc biệt không hợp lệ trong tên file
        const cleanBuyerName = rawBuyerName.replace(/[/\\?%*:|"<>]/g, '');
        const invoiceId = state.invoiceId ? state.invoiceId.trim() : 'HD';

        const suggestedFileName = `${invoiceId} - ${cleanBuyerName} - Hoa Don Ban Hang`;

        // Đổi document.title tạm thời để trình duyệt tự động điền tên file khi Lưu thành PDF
        document.title = suggestedFileName;

        // Đảm bảo preview đang mở
        if (typeof preview !== 'undefined') {
            preview.open();
        }

        // Đợi DOM cập nhật rồi mở hộp thoại in / lưu PDF của hệ thống
        setTimeout(() => {
            window.print();
            // Khôi phục lại title gốc sau khi đóng hộp thoại in
            setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }, 250);
    }

    return {
        printInvoice: printInvoice
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = printer;
}
