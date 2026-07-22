/**
 * Module Định dạng số và tiền tệ
 */

const formatter = (function () {
    /**
     * Định dạng số tiền VND (vd: 1500000 -> 1.550.000 đ hoặc 1.550.000)
     */
    function formatCurrency(amount, includeSymbol = true) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return includeSymbol ? '0 đ' : '0';
        }
        const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return includeSymbol ? `${formatted} đ` : formatted;
    }

    /**
     * Định dạng diện tích / số lượng (vd: 7.5 -> 7.5 hoặc 7,50)
     */
    function formatDecimal(val, decimals = 2) {
        if (val === null || val === undefined || isNaN(val)) return '0';
        const num = parseFloat(val);
        if (num % 1 === 0) return num.toString();
        return num.toFixed(decimals).replace(/\.?0+$/, '');
    }

    /**
     * Parse chuỗi người dùng nhập (có thể có dấu phẩy, dấu chấm) thành Float
     */
    function parseInputNumber(str) {
        if (typeof str === 'number') return isNaN(str) ? 0 : str;
        if (!str) return 0;
        let cleaned = str.toString().trim();
        if (cleaned.includes('.') && cleaned.includes(',')) {
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else if (cleaned.includes(',')) {
            cleaned = cleaned.replace(',', '.');
        }
        const val = parseFloat(cleaned);
        return isNaN(val) ? 0 : val;
    }

    /**
     * Xóa dấu tiếng Việt và ký tự đặc biệt để tạo tên file an toàn cho iPhone/Android
     */
    function sanitizeFileName(str) {
        if (!str) return '';
        let result = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        result = result.replace(/đ/g, 'd').replace(/Đ/g, 'D');
        result = result.replace(/[/\\?%*:|"<>]/g, '');
        return result.trim();
    }

    return {
        formatCurrency: formatCurrency,
        formatDecimal: formatDecimal,
        parseInputNumber: parseInputNumber,
        sanitizeFileName: sanitizeFileName
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = formatter;
}
