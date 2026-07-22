/**
 * Entry point Khởi tạo Ứng dụng Hóa Đơn Bán Hàng
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khôi phục dữ liệu đã lưu từ LocalStorage
    if (typeof stateManager !== 'undefined') {
        stateManager.loadSavedState();
    }

    // 2. Khởi tạo các Components
    if (typeof customerForm !== 'undefined') {
        customerForm.init('customerFormContainer');
    }

    if (typeof productTable !== 'undefined') {
        productTable.init('productTableContainer');
    }

    if (typeof toolbar !== 'undefined') {
        toolbar.init('toolbarContainer');
    }

    if (typeof preview !== 'undefined') {
        preview.init('previewModalContainer');
    }

    console.log('Invoice App initialized successfully!');
});
