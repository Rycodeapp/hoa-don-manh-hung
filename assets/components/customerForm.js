/**
 * Component Form Nhập thông tin Khách hàng, Đơn vị & Tiêu đề chứng từ (SaaS 2025 Standard)
 */

const customerForm = (function () {
    function init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        render(container);
        bindEvents(container);
    }

    function render(container) {
        const state = stateManager.getState();
        const currentTitle = state.invoiceTitle || 'HÓA ĐƠN';

        container.innerHTML = `
            <div class="card-saas p-5 md:p-6 mb-6">
                <!-- SECTION HEADER -->
                <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 flex-wrap gap-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                            1
                        </div>
                        <div>
                            <h2 class="text-[22px] font-bold text-slate-900 leading-tight">Thông tin Chứng từ & Khách hàng</h2>
                            <p class="text-slate-500 text-xs sm:text-sm mt-0.5">Nhập thông tin người bán, người mua và tùy chỉnh tiêu đề (Hóa đơn / Báo giá)</p>
                        </div>
                    </div>
                </div>

                <!-- FORM GRID -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-base">
                    <!-- Tiêu đề Chứng từ (HÓA ĐƠN / BÁO GIÁ) -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Tiêu đề chứng từ <span class="text-blue-600 font-bold">(HÓA ĐƠN / BÁO GIÁ)</span>
                        </label>
                        <div class="flex gap-2">
                            <input type="text" id="inputInvoiceTitle" list="documentTitleList" value="${escapeHtml(currentTitle)}" 
                                placeholder="HÓA ĐƠN / BÁO GIÁ..." 
                                class="form-input-custom font-extrabold uppercase text-blue-900">
                            <datalist id="documentTitleList">
                                <option value="HÓA ĐƠN"></option>
                                <option value="BÁO GIÁ"></option>
                                <option value="BẢNG BÁO GIÁ"></option>
                                <option value="PHIẾU GIAO HÀNG"></option>
                                <option value="HÓA ĐƠN BÁN HÀNG"></option>
                            </datalist>
                        </div>
                    </div>

                    <!-- Tên Đơn vị bán hàng -->
                    <div class="md:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            ĐƠN VỊ BÁN HÀNG <span class="text-red-500 font-bold">*</span>
                        </label>
                        <input type="text" id="inputUnitName" value="${escapeHtml(state.unitName || '')}" 
                            placeholder="Nhập tên đơn vị / cửa hàng..." 
                            class="form-input-custom font-medium">
                    </div>

                    <!-- Số điện thoại người bán -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Số điện thoại người bán
                        </label>
                        <input type="text" id="inputSellerPhone" value="${escapeHtml(state.sellerPhone || '')}" 
                            placeholder="Ví dụ: 0903 123 456..." 
                            class="form-input-custom font-medium">
                    </div>

                    <!-- Họ tên người mua -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Họ tên người mua <span class="text-red-500 font-bold">*</span>
                        </label>
                        <input type="text" id="inputBuyerName" value="${escapeHtml(state.buyerName || '')}" 
                            placeholder="Ví dụ: Nguyễn Văn A..." 
                            class="form-input-custom font-medium">
                    </div>

                    <!-- Số điện thoại người mua -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Số điện thoại người mua
                        </label>
                        <input type="text" id="inputBuyerPhone" value="${escapeHtml(state.buyerPhone || '')}" 
                            placeholder="Ví dụ: 0912 345 678..." 
                            class="form-input-custom font-medium">
                    </div>

                    <!-- Xuất tại kho -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Xuất tại kho
                        </label>
                        <input type="text" id="inputWarehouse" value="${escapeHtml(state.warehouse || '')}" 
                            placeholder="Ví dụ: Kho Q.8 / Cửa hàng..." 
                            class="form-input-custom">
                    </div>

                    <!-- Địa chỉ giao hàng -->
                    <div class="md:col-span-2">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Địa chỉ giao hàng / công trình
                        </label>
                        <input type="text" id="inputAddress" value="${escapeHtml(state.address || '')}" 
                            placeholder="Ví dụ: 123 Nguyễn Trãi, Q.5, TP.HCM..." 
                            class="form-input-custom">
                    </div>

                    <!-- Ngày lập hóa đơn -->
                    <div>
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Ngày lập chứng từ
                        </label>
                        <input type="date" id="inputCreatedDate" value="${state.createdDate || ''}" 
                            class="form-input-custom">
                    </div>

                    <!-- KHU VỰC GHI CHÚ CHUNG CHO TOÀN HÓA ĐƠN -->
                    <div class="md:col-span-2 lg:col-span-3 mt-1">
                        <label class="block text-[14px] font-medium text-slate-700 mb-1.5">
                            Ghi chú chung / Điều khoản <span class="text-slate-400 font-normal text-xs">(VAT, Bảo hành, Phí vận chuyển, Điều khoản...)</span>
                        </label>
                        <textarea id="inputGeneralNote" rows="2" 
                            placeholder="Nhập các điều khoản như: Bảo hành, VAT, Điều khoản thanh toán..." 
                            class="form-textarea-custom">${escapeHtml(state.generalNote || '')}</textarea>
                    </div>
                </div>
            </div>
        `;
    }

    function bindEvents(container) {
        const fieldIds = ['inputInvoiceTitle', 'inputUnitName', 'inputSellerPhone', 'inputBuyerName', 'inputBuyerPhone', 'inputAddress', 'inputWarehouse', 'inputCreatedDate', 'inputGeneralNote'];

        const handleInput = () => {
            stateManager.updateCustomer({
                invoiceTitle: container.querySelector('#inputInvoiceTitle').value,
                unitName: container.querySelector('#inputUnitName').value,
                sellerPhone: container.querySelector('#inputSellerPhone').value,
                buyerName: container.querySelector('#inputBuyerName').value,
                buyerPhone: container.querySelector('#inputBuyerPhone').value,
                address: container.querySelector('#inputAddress').value,
                warehouse: container.querySelector('#inputWarehouse').value,
                createdDate: container.querySelector('#inputCreatedDate').value,
                generalNote: container.querySelector('#inputGeneralNote').value
            }, true);
        };

        fieldIds.forEach(id => {
            const el = container.querySelector('#' + id);
            if (el) {
                el.addEventListener('input', handleInput);
            }
        });

        stateManager.subscribe(newState => {
            const activeEl = document.activeElement;
            fieldIds.forEach(id => {
                const inputEl = container.querySelector('#' + id);
                if (inputEl && inputEl !== activeEl) {
                    const keyMap = {
                        inputInvoiceTitle: 'invoiceTitle',
                        inputUnitName: 'unitName',
                        inputSellerPhone: 'sellerPhone',
                        inputBuyerName: 'buyerName',
                        inputBuyerPhone: 'buyerPhone',
                        inputAddress: 'address',
                        inputWarehouse: 'warehouse',
                        inputCreatedDate: 'createdDate',
                        inputGeneralNote: 'generalNote'
                    };
                    const val = newState[keyMap[id]] || '';
                    if (inputEl.value !== val) {
                        inputEl.value = val;
                    }
                }
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    return {
        init: init
    };
})();
