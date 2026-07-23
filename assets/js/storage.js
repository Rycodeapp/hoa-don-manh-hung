/**
 * Module Storage Quản lý lưu trữ LocalStorage & Undo History Stack
 */

const storage = (function () {
    const STORAGE_KEY = 'HOA_DON_MANH_HUNG_STATE';
    const UNDO_STACK_KEY = 'HOA_DON_MANH_HUNG_UNDO_STACK';
    const MAX_UNDO_STEPS = 20;

    let undoStack = [];

    function saveInvoiceState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Lỗi khi lưu state vào LocalStorage:', e);
        }
    }

    function loadInvoiceState() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Lỗi khi tải state từ LocalStorage:', e);
            return null;
        }
    }

    function pushUndoState(state) {
        if (!state) return;
        undoStack.push(JSON.parse(JSON.stringify(state)));
        if (undoStack.length > MAX_UNDO_STEPS) {
            undoStack.shift();
        }
    }

    function popUndoState() {
        if (undoStack.length === 0) return null;
        return undoStack.pop();
    }

    function canUndo() {
        return undoStack.length > 0;
    }

    function clearUndoStack() {
        undoStack = [];
    }

    return {
        saveInvoiceState: saveInvoiceState,
        loadInvoiceState: loadInvoiceState,
        pushUndoState: pushUndoState,
        popUndoState: popUndoState,
        canUndo: canUndo,
        clearUndoStack: clearUndoStack
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = storage;
}
