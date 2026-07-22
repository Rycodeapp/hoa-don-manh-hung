/**
 * Component Form Nhập thông tin Khách hàng, Đơn vị & Ghi chú chung
 */

const customerForm = (function () {
    let isInitialized = false;

    function init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        render(container);
        bindEvents(container);
        isInitialized = true;
    }

    function render(container) {
        const state = stateManager.getState();

        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6">
                <div class="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                        1
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Thông tin Đơn vị, Khách hàng & Ghi chú chung</h2>
                        <p class="text-slate-500 text-sm">Nhập thông tin người bán, người mua và các điều khoản ghi chú</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-base">
                    <!-- Tên Đơn vị bán hàng -->
                    <div class="md:col-span-2">
                        <label class="block text-slate-700 font-semibold mb-1">
                            ĐƠN VỊ BÁN HÀNG <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="inputUnitName" value="${escapeHtml(state.unitName || '')}" 
                            placeholder="Nhập tên đơn vị / cửa hàng..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Số điện thoại người bán -->
                    <div>
                        <label class="block text-slate-700 font-semibold mb-1">
                            Số điện thoại người bán
                        </label>
                        <input type="text" id="inputSellerPhone" value="${escapeHtml(state.sellerPhone || '')}" 
                            placeholder="Ví dụ: 0903 123 456..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Họ tên người mua -->
                    <div>
                        <label class="block text-slate-700 font-semibold mb-1">
                            Họ tên người mua <span class="text-red-500">*</span>
                        </label>
                        <input type="text" id="inputBuyerName" value="${escapeHtml(state.buyerName || '')}" 
                            placeholder="Ví dụ: Nguyễn Văn A..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Số điện thoại người mua -->
                    <div>
                        <label class="block text-slate-700 font-semibold mb-1">
                            Số điện thoại người mua
                        </label>
                        <input type="text" id="inputBuyerPhone" value="${escapeHtml(state.buyerPhone || '')}" 
                            placeholder="Ví dụ: 0912 345 678..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Xuất tại kho -->
                    <div>
                        <label class="block text-slate-700 font-semibold mb-1">
                            Xuất tại kho
                        </label>
                        <input type="text" id="inputWarehouse" value="${escapeHtml(state.warehouse || '')}" 
                            placeholder="Ví dụ: Kho Q.8 / Cửa hàng..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Địa chỉ giao hàng -->
                    <div class="md:col-span-2">
                        <label class="block text-slate-700 font-semibold mb-1">
                            Địa chỉ giao hàng / công trình
                        </label>
                        <input type="text" id="inputAddress" value="${escapeHtml(state.address || '')}" 
                            placeholder="Ví dụ: 123 Nguyễn Trãi, Q.5, TP.HCM..." 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- Ngày lập hóa đơn -->
                    <div>
                        <label class="block text-slate-700 font-semibold mb-1">
                            Ngày lập hóa đơn
                        </label>
                        <input type="date" id="inputCreatedDate" value="${state.createdDate || ''}" 
                            class="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                    </div>

                    <!-- KHU VỰC GHI CHÚ CHUNG CHO TOÀN HÓA ĐƠN -->
                    <div class="md:col-span-2 lg:col-span-3 mt-2">
                        <label class="block text-slate-700 font-semibold mb-1">
                            Ghi chú chung hóa đơn <span class="text-slate-400 font-normal">(VAT, Bảo hành, Phí vận chuyển, Điều khoản...)</span>
                        </label>
                        <textarea id="inputGeneralNote" rows="2" 
                            placeholder="Nhập các thông tin như: Bảo hành, VAT, Điều khoản thanh toán..." 
                            class="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">${escapeHtml(state.generalNote || '')}</textarea>
                    </div>
                </div>
            </div>
        `;
    }

    function bindEvents(container) {
        const fieldIds = ['inputUnitName', 'inputSellerPhone', 'inputBuyerName', 'inputBuyerPhone', 'inputAddress', 'inputWarehouse', 'inputCreatedDate', 'inputGeneralNote'];

        const handleInput = () => {
            stateManager.updateCustomer({
                unitName: container.querySelector('#inputUnitName').value,
                sellerPhone: container.querySelector('#inputSellerPhone').value,
                buyerName: container.querySelector('#inputBuyerName').value,
                buyerPhone: container.querySelector('#inputBuyerPhone').value,
                address: container.querySelector('#inputAddress').value,
                warehouse: container.querySelector('#inputWarehouse').value,
                createdDate: container.querySelector('#inputCreatedDate').value,
                generalNote: container.querySelector('#inputGeneralNote').value
            }, true); // silent = true -> Không re-render để không mất focus!
        };

        fieldIds.forEach(id => {
            const el = container.querySelector('#' + id);
            if (el) {
                el.addEventListener('input', handleInput);
            }
        });

        // Lắng nghe thay đổi state từ bên ngoài (chỉ update value nếu element không đang focus)
        stateManager.subscribe(newState => {
            const activeEl = document.activeElement;
            fieldIds.forEach(id => {
                const inputEl = container.querySelector('#' + id);
                if (inputEl && inputEl !== activeEl) {
                    const keyMap = {
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
