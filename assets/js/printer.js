/**
 * Module Printer Xử lý in Hóa đơn và Tự động đặt tên file khi lưu PDF trên cả Máy tính & Điện thoại
 */

const printer = (function () {
    function updatePdfTitle() {
        if (typeof stateManager === 'undefined') return;
        const state = stateManager.getState();
        
        const rawBuyerName = state.buyerName ? state.buyerName.trim() : 'KhachHang';
        // Xóa ký tự không hợp lệ trong tên file
        const cleanBuyerName = rawBuyerName.replace(/[/\\?%*:|"<>]/g, '');
        const invoiceId = state.invoiceId ? state.invoiceId.trim() : 'HD';

        // Đặt document.title chuẩn để điện thoại & máy tính đọc được tên file PDF khi Lưu
        const pdfFileName = `${invoiceId} - ${cleanBuyerName} - Hoa Don Ban Hang`;
        document.title = pdfFileName;
    }

    function printInvoice() {
        // Cập nhật tên file PDF ngay lập tức
        updatePdfTitle();

        // Đảm bảo preview đang mở
        if (typeof preview !== 'undefined') {
            preview.open();
        }

        // Gọi lệnh in của hệ thống
        setTimeout(() => {
            window.print();
        }, 150);
    }

    return {
        updatePdfTitle: updatePdfTitle,
        printInvoice: printInvoice
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = printer;
}
