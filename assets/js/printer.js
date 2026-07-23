/**
 * Module Printer Xử lý in Hóa đơn / Báo giá và Tự động đặt tên file khi lưu PDF trên cả Máy tính & Điện thoại
 */

const printer = (function () {
    function updatePdfTitle() {
        if (typeof stateManager === 'undefined') return;
        const state = stateManager.getState();
        
        const rawBuyerName = state.buyerName ? state.buyerName.trim() : 'KhachHang';
        const cleanBuyerName = typeof formatter !== 'undefined' && formatter.sanitizeFileName ? formatter.sanitizeFileName(rawBuyerName) : rawBuyerName.replace(/[/\\?%*:|"<>]/g, '');
        
        const rawInvoiceId = state.invoiceId ? state.invoiceId.trim() : '';

        let docTitleTag = state.invoiceTitle ? state.invoiceTitle.trim() : 'HÓA ĐƠN';
        if (typeof formatter !== 'undefined' && formatter.sanitizeFileName) {
            docTitleTag = formatter.sanitizeFileName(docTitleTag);
        }

        // Khi lưu file PDF: Tự động thêm tiền tố "MH - " trước chuỗi số của mã chứng từ
        let pdfCodeStr = 'MH';
        if (rawInvoiceId) {
            pdfCodeStr = rawInvoiceId.startsWith('MH - ') ? rawInvoiceId : `MH - ${rawInvoiceId}`;
        }

        // Đặt document.title chuẩn để điện thoại & máy tính tự điền tên file PDF khi Lưu: MH - [Chuỗi Số] - [Tên Khách Hàng] - [Tiêu Đề]
        const pdfFileName = `${pdfCodeStr} - ${cleanBuyerName} - ${docTitleTag}`;
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
