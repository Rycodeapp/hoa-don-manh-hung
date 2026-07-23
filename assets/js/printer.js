/**
 * Module Printer Xử lý in Hóa đơn / Báo giá và Tự động đặt tên file khi lưu PDF trên cả Máy tính & Điện thoại
 */

const printer = (function () {
    function updatePdfTitle() {
        if (typeof stateManager === 'undefined') return;
        const state = stateManager.getState();
        
        const rawBuyerName = state.buyerName ? state.buyerName.trim() : 'KhachHang';
        const cleanBuyerName = typeof formatter !== 'undefined' && formatter.sanitizeFileName ? formatter.sanitizeFileName(rawBuyerName) : rawBuyerName.replace(/[/\\?%*:|"<>]/g, '');
        
        const invoiceId = state.invoiceId ? state.invoiceId.trim() : 'HD';

        let docTitleTag = state.invoiceTitle ? state.invoiceTitle.trim() : 'HÓA ĐƠN';
        if (typeof formatter !== 'undefined' && formatter.sanitizeFileName) {
            docTitleTag = formatter.sanitizeFileName(docTitleTag);
        }

        // Đặt document.title chuẩn để điện thoại & máy tính đọc được tên file PDF khi Lưu
        const pdfFileName = `${invoiceId} - ${cleanBuyerName} - ${docTitleTag}`;
        document.title = pdfFileName;
    }

    function printInvoice() {
        updatePdfTitle();

        if (typeof preview !== 'undefined') {
            preview.open();
        }

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
