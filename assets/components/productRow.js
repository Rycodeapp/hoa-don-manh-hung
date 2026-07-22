/**
 * Component Dòng sản phẩm (Product Row) trong bảng nhập liệu
 */

const productRow = (function () {
    const PRESET_PRODUCTS = [
        'Cửa cuốn Đức khe thoáng',
        'Cửa cuốn Đài Loan lá 7dem',
        'Cửa cuốn Đài Loan lá 8dem',
        'Cửa kéo Đài Loan có lá',
        'Cửa kéo Đài Loan không lá',
        'Cửa cuốn Úc tấm liền',
        'Motor cửa cuốn 400kg',
        'Motor cửa cuốn 600kg',
        'Bình lưu điện cửa cuốn',
        'Remote điều khiển cửa cuốn',
        'Công lắp đặt & vận chuyển'
    ];

    function renderRow(item, index) {
        const area = item.width && item.height ? (parseFloat(item.width) * parseFloat(item.height)).toFixed(2) : (item.area || 0);
        const formattedTotal = typeof formatter !== 'undefined' ? formatter.formatCurrency(item.total) : item.total + ' đ';

        return `
            <div class="product-row bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl p-4 mb-4 transition-all" data-id="${item.id}">
                <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span class="font-bold text-blue-700 text-lg flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm flex items-center justify-center font-extrabold">${index + 1}</span>
                        Món hàng #${index + 1}
                    </span>
                    <button type="button" class="btn-remove-row text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Xóa dòng
                    </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-base">
                    <!-- Tên quy cách sản phẩm (Cột rộng nhất) -->
                    <div class="lg:col-span-4">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Quy cách / Tên sản phẩm <span class="text-red-500">*</span></label>
                        <input type="text" list="productList_${item.id}" class="item-name w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-medium" 
                            placeholder="Nhập hoặc chọn tên cửa..." value="${escapeHtml(item.productName || '')}">
                        <datalist id="productList_${item.id}">
                            ${PRESET_PRODUCTS.map(p => `<option value="${p}"></option>`).join('')}
                        </datalist>
                    </div>

                    <!-- Đơn vị tính -->
                    <div class="lg:col-span-2">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">ĐVT</label>
                        <select class="item-unit w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white">
                            <option value="m²" ${item.unit === 'm²' ? 'selected' : ''}>m²</option>
                            <option value="Bộ" ${item.unit === 'Bộ' ? 'selected' : ''}>Bộ</option>
                            <option value="Cái" ${item.unit === 'Cái' ? 'selected' : ''}>Cái</option>
                            <option value="Mét" ${item.unit === 'Mét' ? 'selected' : ''}>Mét</option>
                            <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                        </select>
                    </div>

                    <!-- Kích thước Ngang (m) -->
                    <div class="lg:col-span-2">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Ngang (m)</label>
                        <input type="number" step="0.01" min="0" class="item-width w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white" 
                            placeholder="0.00" value="${item.width !== undefined && item.width !== '' ? item.width : ''}">
                    </div>

                    <!-- Kích thước Cao (m) -->
                    <div class="lg:col-span-2">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Cao (m)</label>
                        <input type="number" step="0.01" min="0" class="item-height w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white" 
                            placeholder="0.00" value="${item.height !== undefined && item.height !== '' ? item.height : ''}">
                    </div>

                    <!-- Diện tích / SL -->
                    <div class="lg:col-span-2">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Diện tích / SL</label>
                        <input type="number" step="0.01" min="0" class="item-qty-area w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-blue-700 bg-blue-50/50" 
                            placeholder="0" value="${item.width && item.height ? area : (item.quantity || 1)}">
                    </div>

                    <!-- Đơn giá (VNĐ) -->
                    <div class="lg:col-span-4">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Đơn giá (đ)</label>
                        <input type="number" step="1000" min="0" class="item-price w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-medium" 
                            placeholder="0" value="${item.price || ''}">
                    </div>

                    <!-- Thành tiền -->
                    <div class="lg:col-span-4">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Thành tiền</label>
                        <div class="item-total-display px-3 py-2.5 text-lg font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                            ${formattedTotal}
                        </div>
                    </div>

                    <!-- Ghi chú riêng cho sản phẩm này -->
                    <div class="lg:col-span-4">
                        <label class="block text-slate-700 font-semibold text-sm mb-1">Ghi chú SP</label>
                        <input type="text" class="item-note w-full px-3 py-2.5 text-base border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white" 
                            placeholder="Ví dụ: màu xám, motor rời..." value="${escapeHtml(item.note || '')}">
                    </div>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    return {
        renderRow: renderRow
    };
})();
