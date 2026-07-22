/**
 * Module Tính toán Diện tích, Thành tiền & Tổng cộng (Hỗ trợ nhập số bộ cửa)
 */

const calculator = (function () {
    /**
     * Tính diện tích 1 bộ và tổng diện tích khi có số bộ cửa
     * Ngang x Cao = Diện tích 1 bộ (m²)
     * Diện tích 1 bộ x Số bộ = Tổng m²
     */
    function calculateArea(width, height, setQty = 1) {
        const w = parseFloat(width) || 0;
        const h = parseFloat(height) || 0;
        const qty = parseFloat(setQty) || 1;

        if (w <= 0 || h <= 0) {
            return {
                areaPerSet: 0,
                totalArea: 0
            };
        }

        const areaPerSet = Math.round(w * h * 100) / 100;
        const totalArea = Math.round(areaPerSet * qty * 100) / 100;

        return {
            areaPerSet: areaPerSet,
            totalArea: totalArea
        };
    }

    /**
     * Tính thành tiền của một dòng sản phẩm
     */
    function calculateItemTotal(qtyOrTotalArea, price) {
        const q = parseFloat(qtyOrTotalArea) || 0;
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
