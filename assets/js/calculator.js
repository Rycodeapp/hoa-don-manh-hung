/**
 * Module Tính toán Diện tích, Thành tiền & Tổng cộng
 */

const calculator = (function () {
    /**
     * Tính diện tích từ Ngang và Cao (m x m = m²)
     */
    function calculateArea(width, height) {
        const w = parseFloat(width) || 0;
        const h = parseFloat(height) || 0;
        if (w <= 0 || h <= 0) return 0;
        return Math.round(w * h * 100) / 100; // Làm tròn 2 chữ số thập phân
    }

    /**
     * Tính thành tiền của một dòng sản phẩm
     * Nếu tính theo diện tích m² hoặc số lượng (cái, bộ, kg...)
     */
    function calculateItemTotal(qtyOrArea, price) {
        const q = parseFloat(qtyOrArea) || 0;
        const p = parseFloat(price) || 0;
        if (q <= 0 || p <= 0) return 0;
        return Math.round(q * p);
    }

    /**
     * Tính tổng tiền cả hóa đơn
     */
    function calculateInvoiceTotal(items) {
        if (!Array.isArray(items)) return 0;
        return items.reduce((sum, item) => {
            const itemTotal = parseFloat(item.total) || 0;
            return sum + itemTotal;
        }, 0);
    }

    return {
        calculateArea: calculateArea,
        calculateItemTotal: calculateItemTotal,
        calculateInvoiceTotal: calculateInvoiceTotal
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = calculator;
}
