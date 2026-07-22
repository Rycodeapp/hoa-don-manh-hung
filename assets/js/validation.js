/**
 * Module Validation Kiểm tra Dữ liệu Đầu vào
 */

const validation = (function () {
    function validateCustomer(customer) {
        const errors = {};
        if (!customer.name || customer.name.trim() === '') {
            errors.name = 'Vui lòng nhập tên khách hàng';
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    function validateItem(item) {
        const errors = {};
        if (!item.productName || item.productName.trim() === '') {
            errors.productName = 'Vui lòng nhập tên sản phẩm';
        }
        if (item.price !== undefined && item.price < 0) {
            errors.price = 'Đơn giá không được âm';
        }
        if (item.width !== undefined && item.width < 0) {
            errors.width = 'Chiều ngang không được âm';
        }
        if (item.height !== undefined && item.height < 0) {
            errors.height = 'Chiều cao không được âm';
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    return {
        validateCustomer: validateCustomer,
        validateItem: validateItem
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = validation;
}
