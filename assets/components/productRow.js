/**
 * Component Dòng sản phẩm (Product Row) trong bảng nhập liệu (SaaS 2025 Standard)
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
        const w = parseFloat(item.width) || 0;
        const h = parseFloat(item.height) || 0;
        const setQty = parseFloat(item.quantity) || 1;
        const totalArea = w > 0 && h > 0 ? (w * h * setQty).toFixed(2) : (item.area || 0);

        const formattedTotal = typeof formatter !== 'undefined' ? formatter.formatCurrency(item.total) : item.total + ' đ';

        return `
            <div class="product-row bg-slate-50/70 border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 sm:p-5 mb-4 transition-all duration-200" data-id="${item.id}">
                <!-- ROW HEADER -->
                <div class="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-4">
                    <span class="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2.5">
                        <span class="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 text-xs sm:text-sm flex items-center justify-center font-extrabold">#${index + 1}</span>
                        Món hàng ${index + 1}
                    </span>
                    <button type="button" class="btn-remove-row text-slate-400 hover:text-red-600 hover:bg-red-50/80 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Xóa dòng
                    </button>
                </div>

                <!-- INPUT FIELDS GRID -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 text-base">
                    <!-- Tên quy cách sản phẩm -->
                    <div class="lg:col-span-4">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Quy cách / Tên sản phẩm <span class="text-red-500 font-bold">*</span></label>
                        <input type="text" list="productList_${item.id}" class="item-name form-input-custom font-medium" 
                            placeholder="Nhập hoặc chọn tên cửa..." value="${escapeHtml(item.productName || '')}">
                        <datalist id="productList_${item.id}">
                            ${PRESET_PRODUCTS.map(p => `<option value="${p}"></option>`).join('')}
                        </datalist>
                    </div>

                    <!-- Đơn vị tính -->
                    <div class="lg:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">ĐVT</label>
                        <select class="item-unit form-input-custom font-medium cursor-pointer">
                            <option value="m²" ${item.unit === 'm²' ? 'selected' : ''}>m²</option>
                            <option value="Bộ" ${item.unit === 'Bộ' ? 'selected' : ''}>Bộ</option>
                            <option value="Cái" ${item.unit === 'Cái' ? 'selected' : ''}>Cái</option>
                            <option value="Mét" ${item.unit === 'Mét' ? 'selected' : ''}>Mét</option>
                            <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                        </select>
                    </div>

                    <!-- Kích thước Ngang (m) -->
                    <div class="lg:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Ngang (m)</label>
                        <input type="number" step="0.01" min="0" class="item-width form-input-custom font-medium" 
                            placeholder="0.00" value="${item.width !== undefined && item.width !== '' ? item.width : ''}">
                    </div>

                    <!-- Kích thước Cao (m) -->
                    <div class="lg:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Cao (m)</label>
                        <input type="number" step="0.01" min="0" class="item-height form-input-custom font-medium" 
                            placeholder="0.00" value="${item.height !== undefined && item.height !== '' ? item.height : ''}">
                    </div>

                    <!-- Số bộ cửa / Số lượng -->
                    <div class="lg:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Số bộ / SL</label>
                        <input type="number" min="1" step="1" class="item-quantity form-input-custom font-bold text-amber-900 bg-amber-50/70 border-amber-200" 
                            placeholder="1" value="${item.quantity || 1}">
                    </div>

                    <!-- Tổng m² tính toán -->
                    <div class="lg:col-span-3">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Tổng m² diện tích</label>
                        <input type="number" step="0.01" min="0" class="item-qty-area form-input-custom font-bold text-blue-700 bg-blue-50/60 border-blue-200" 
                            placeholder="0" value="${totalArea}">
                    </div>

                    <!-- Đơn giá (VNĐ) -->
                    <div class="lg:col-span-3">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Đơn giá (đ)</label>
                        <input type="number" step="1000" min="0" class="item-price form-input-custom font-semibold text-slate-900" 
                            placeholder="0" value="${item.price || ''}">
                    </div>

                    <!-- Thành tiền -->
                    <div class="lg:col-span-3">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Thành tiền</label>
                        <div class="item-total-display h-[52px] px-4 flex items-center text-lg font-extrabold text-emerald-700 bg-emerald-50/80 rounded-xl border border-emerald-200/80">
                            ${formattedTotal}
                        </div>
                    </div>

                    <!-- Ghi chú riêng cho sản phẩm này -->
                    <div class="lg:col-span-3">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1">Ghi chú SP</label>
                        <input type="text" class="item-note form-input-custom" 
                            placeholder="Ví dụ: màu xám..." value="${escapeHtml(item.note || '')}">
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
