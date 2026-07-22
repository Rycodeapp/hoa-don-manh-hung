/**
 * Module StorageService quản lý lưu trữ LocalStorage & Lịch sử Undo
 */

const storage = (function () {
    const STORAGE_KEY = 'HOA_DON_APP_DATA_V1';
    const MAX_UNDO_STACK = 20;
    let undoStack = [];

    /**
     * Tải dữ liệu hóa đơn đã lưu từ LocalStorage
     */
    function loadInvoiceState() {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (rawData) {
                return JSON.parse(rawData);
            }
        } catch (e) {
            console.error('Lỗi khi đọc LocalStorage:', e);
        }
        return null;
    }

    /**
     * Lưu trạng thái hóa đơn hiện tại vào LocalStorage
     */
    function saveInvoiceState(state) {
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (e) {
            console.error('Lỗi khi ghi LocalStorage:', e);
        }
    }

    /**
     * Đẩy trạng thái hiện tại vào stack Undo trước khi xóa/thay đổi lớn
     */
    function pushUndoState(state) {
        try {
            const snapshot = JSON.parse(JSON.stringify(state));
            undoStack.push(snapshot);
            if (undoStack.length > MAX_UNDO_STACK) {
                undoStack.shift();
            }
        } catch (e) {
            console.error('Lỗi khi lưu Undo state:', e);
        }
    }

    /**
     * Lấy lại trạng thái liền trước đó (Undo)
     */
    function popUndoState() {
        if (undoStack.length > 0) {
            return undoStack.pop();
        }
        return null;
    }

    /**
     * Kiểm tra có thể Undo hay không
     */
    function canUndo() {
        return undoStack.length > 0;
    }

    /**
     * Xóa sạch dữ liệu đã lưu
     */
    function clearStorage() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            undoStack = [];
        } catch (e) {
            console.error('Lỗi khi xóa LocalStorage:', e);
        }
    }

    return {
        loadInvoiceState: loadInvoiceState,
        saveInvoiceState: saveInvoiceState,
        pushUndoState: pushUndoState,
        popUndoState: popUndoState,
        canUndo: canUndo,
        clearStorage: clearStorage
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = storage;
}
