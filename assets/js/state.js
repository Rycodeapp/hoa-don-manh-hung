/**
 * Module State Quản lý Trạng thái Ứng dụng (SaaS 2025 Standard)
 */

const stateManager = (function () {
    /**
     * Lấy chuỗi Ngày Hôm Nay dạng YYYY-MM-DD theo giờ địa phương
     */
    function getTodayDateString() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    /**
     * Thuật toán sinh Mã Chứng Từ Thuần Chuỗi Số Theo Năm-Tháng-Ngày (YYMMDD)
     * Format: [YYMMDD][001, 002...] (Tự tăng theo ngày, 100% chuỗi số thuần túy)
     * Ví dụ: 260723001, 260723002...
     */
    function generateRandomInvoiceId(customDateStr) {
        const dateVal = customDateStr ? new Date(customDateStr) : new Date();
        const validDate = isNaN(dateVal.getTime()) ? new Date() : dateVal;

        const yy = String(validDate.getFullYear()).slice(-2);
        const mm = String(validDate.getMonth() + 1).padStart(2, '0');
        const dd = String(validDate.getDate()).padStart(2, '0');

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');

        // Bộ đếm tự tăng theo ngày (YYMMDD)
        const dateKey = `${yy}${mm}${dd}`;
        let counterStr = '';
        try {
            const todayKey = `MH_COUNTER_${dateKey}`;
            let currentCounter = parseInt(localStorage.getItem(todayKey) || '0', 10) + 1;
            localStorage.setItem(todayKey, currentCounter.toString());
            counterStr = String(currentCounter).padStart(3, '0');
        } catch (e) {
            counterStr = '';
        }

        if (counterStr) {
            return `${dateKey}${counterStr}`;
        }

        // Fallback: [YYMMDD][HHMM][Crypto 2 chữ số] -> 100% chuỗi số thuần túy
        let cryptoRand = 0;
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            cryptoRand = (array[0] % 90) + 10;
        } else {
            cryptoRand = Math.floor(10 + Math.random() * 90);
        }

        return `${dateKey}${hh}${min}${cryptoRand}`;
    }

    // Trạng thái mặc định
    const todayDate = getTodayDateString();
    let state = {
        unitName: 'Thế giới Cửa Mạnh Hùng',
        invoiceTitle: 'HÓA ĐƠN',
        sellerPhone: '0976.088.080 - 0916.557.888',
        buyerName: '',
        buyerPhone: '',
        address: '',
        warehouse: '',
        invoiceId: generateRandomInvoiceId(todayDate),
        createdDate: todayDate,
        isManualDate: false,
        generalNote: 'Bảo hành 24 tháng đối với motor và 12 tháng đối với thân cửa.',
        items: [
            {
                id: 'item_1',
                productName: 'Cửa cuốn Đức khe thoáng nhôm cao cấp',
                unit: 'm²',
                width: 3.5,
                height: 3.2,
                quantity: 1,
                areaPerSet: 11.2,
                area: 11.2,
                price: 1350000,
                total: 15120000,
                note: 'Đã bao gồm chi phí lắp đặt'
            }
        ]
    };

    let listeners = [];

    function getState() {
        return JSON.parse(JSON.stringify(state));
    }

    function setState(newState, saveUndo = true) {
        if (saveUndo && typeof storage !== 'undefined') {
            storage.pushUndoState(state);
        }
        state = JSON.parse(JSON.stringify(newState));
        recalculate();
        if (typeof storage !== 'undefined') {
            storage.saveInvoiceState(state);
        }
        notify();
    }

    function recalculate() {
        if (Array.isArray(state.items)) {
            state.items.forEach(item => {
                const w = parseFloat(item.width) || 0;
                const h = parseFloat(item.height) || 0;
                const setQty = parseFloat(item.quantity) || 1;
                const price = parseFloat(item.price) || 0;

                if (w > 0 && h > 0) {
                    const calcRes = typeof calculator !== 'undefined' ? calculator.calculateArea(w, h, setQty) : { areaPerSet: Math.round(w*h*100)/100, totalArea: Math.round(w*h*setQty*100)/100 };
                    item.areaPerSet = calcRes.areaPerSet;
                    item.area = calcRes.totalArea;
                    item.total = Math.round(calcRes.totalArea * price);
                } else {
                    item.areaPerSet = 0;
                    item.area = 0;
                    item.total = Math.round(setQty * price);
                }
            });
        }
    }

    function updateCustomer(data, silent = false) {
        state.unitName = data.unitName !== undefined ? data.unitName : state.unitName;
        state.invoiceTitle = data.invoiceTitle !== undefined ? data.invoiceTitle : state.invoiceTitle;
        state.sellerPhone = data.sellerPhone !== undefined ? data.sellerPhone : state.sellerPhone;
        state.buyerName = data.buyerName !== undefined ? data.buyerName : state.buyerName;
        state.buyerPhone = data.buyerPhone !== undefined ? data.buyerPhone : state.buyerPhone;
        state.address = data.address !== undefined ? data.address : state.address;
        state.warehouse = data.warehouse !== undefined ? data.warehouse : state.warehouse;
        state.invoiceId = data.invoiceId !== undefined ? data.invoiceId : state.invoiceId;
        state.generalNote = data.generalNote !== undefined ? data.generalNote : state.generalNote;

        if (data.createdDate !== undefined) {
            state.createdDate = data.createdDate;
            if (data.isManualDate !== undefined) {
                state.isManualDate = data.isManualDate;
            }
        }

        if (typeof storage !== 'undefined') {
            storage.saveInvoiceState(state);
        }

        if (typeof printer !== 'undefined') {
            printer.updatePdfTitle();
        }

        if (!silent) {
            notify();
        }
    }

    function addItem(newItem) {
        if (typeof storage !== 'undefined') {
            storage.pushUndoState(state);
        }
        const item = Object.assign({
            id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            productName: '',
            unit: 'm²',
            width: '',
            height: '',
            quantity: 1,
            areaPerSet: 0,
            area: 0,
            price: 0,
            total: 0,
            note: ''
        }, newItem);

        state.items.push(item);
        recalculate();
        if (typeof storage !== 'undefined') {
            storage.saveInvoiceState(state);
        }
        notify();
    }

    function updateItem(id, updatedFields, silent = false) {
        const index = state.items.findIndex(it => it.id === id);
        if (index !== -1) {
            state.items[index] = Object.assign({}, state.items[index], updatedFields);
            recalculate();
            if (typeof storage !== 'undefined') {
                storage.saveInvoiceState(state);
            }
            if (!silent) {
                notify();
            }
        }
    }

    function removeItem(id) {
        if (typeof storage !== 'undefined') {
            storage.pushUndoState(state);
        }
        state.items = state.items.filter(it => it.id !== id);
        recalculate();
        if (typeof storage !== 'undefined') {
            storage.saveInvoiceState(state);
        }
        notify();
    }

    function undo() {
        if (typeof storage !== 'undefined') {
            const prevState = storage.popUndoState();
            if (prevState) {
                state = prevState;
                recalculate();
                storage.saveInvoiceState(state);
                notify();
                return true;
            }
        }
        return false;
    }

    function getTotalAmount() {
        if (typeof calculator !== 'undefined') {
            return calculator.calculateInvoiceTotal(state.items);
        }
        return state.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    }

    function getTotalText() {
        const total = getTotalAmount();
        if (typeof vietnameseMoney !== 'undefined') {
            return vietnameseMoney.numberToWords(total);
        }
        return '';
    }

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            listeners = listeners.filter(l => l !== listener);
        };
    }

    function notify() {
        listeners.forEach(listener => listener(getState()));
    }

    function loadSavedState() {
        if (typeof storage !== 'undefined') {
            const saved = storage.loadInvoiceState();
            if (saved && Array.isArray(saved.items)) {
                state = Object.assign({}, state, saved);

                if (!saved.isManualDate) {
                    state.createdDate = getTodayDateString();
                    state.isManualDate = false;
                }

                recalculate();
                notify();
            }
        }
    }

    return {
        getState: getState,
        setState: setState,
        updateCustomer: updateCustomer,
        addItem: addItem,
        updateItem: updateItem,
        removeItem: removeItem,
        undo: undo,
        getTotalAmount: getTotalAmount,
        getTotalText: getTotalText,
        subscribe: subscribe,
        loadSavedState: loadSavedState,
        generateRandomInvoiceId: generateRandomInvoiceId,
        getTodayDateString: getTodayDateString
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = stateManager;
}
