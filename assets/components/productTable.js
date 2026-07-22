/**
 * Component Bảng Danh sách Sản phẩm (SaaS 2025 Standard)
 */

const productTable = (function () {
    let lastItemsCount = -1;

    function init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        render(container);
        bindEvents(container);

        stateManager.subscribe((newState) => {
            const currentItems = newState.items || [];
            if (currentItems.length !== lastItemsCount) {
                render(container);
                bindEvents(container);
            } else {
                updateTotalsOnly(container);
            }
        });
    }

    function render(container) {
        const state = stateManager.getState();
        const items = state.items || [];
        lastItemsCount = items.length;

        const totalAmount = stateManager.getTotalAmount();
        const totalText = stateManager.getTotalText();
        const formattedTotal = typeof formatter !== 'undefined' ? formatter.formatCurrency(totalAmount) : totalAmount + ' đ';

        let rowsHtml = '';
        if (items.length === 0) {
            // EMPTY STATE PREMIUM DESIGN
            rowsHtml = `
                <div class="text-center py-12 px-4 bg-slate-50/60 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                    <div class="w-16 h-16 rounded-2xl bg-blue-50/80 text-blue-600 flex items-center justify-center font-black text-3xl mb-3 shadow-inner">
                        📦
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Chưa có sản phẩm nào trong hóa đơn</h3>
                    <p class="text-slate-500 text-sm max-w-md mb-5">Nhấp vào nút bên dưới để bắt đầu thêm loại cửa hoặc sản phẩm dịch vụ vào hóa đơn.</p>
                    <button type="button" id="btnAddFirstItem" class="btn-saas h-[50px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Thêm sản phẩm đầu tiên
                    </button>
                </div>
            `;
        } else {
            rowsHtml = items.map((item, idx) => productRow.renderRow(item, idx)).join('');
        }

        container.innerHTML = `
            <div class="card-saas p-5 md:p-6 mb-6">
                <!-- SECTION HEADER -->
                <div class="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base flex-shrink-0">
                            2
                        </div>
                        <div>
                            <h2 class="text-[22px] font-bold text-slate-900 leading-tight">Danh sách Cửa & Sản phẩm</h2>
                            <p class="text-slate-500 text-xs sm:text-sm mt-0.5">Nhập số đo (Ngang x Cao), số bộ cửa và đơn giá</p>
                        </div>
                    </div>
                    
                    <button type="button" id="btnAddItem" class="w-full sm:w-auto btn-saas h-[50px] px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        THÊM CỬA / SẢN PHẨM
                    </button>
                </div>

                <!-- PRODUCT ROWS CONTAINER -->
                <div id="productRowsList">
                    ${rowsHtml}
                </div>

                <!-- NÚT THÊM SẢN PHẨM PHÍA DƯỚI DANH SÁCH (KHI ĐÃ CÓ SẢN PHẨM) -->
                ${items.length > 0 ? `
                <div class="mt-4 mb-2 flex justify-center">
                    <button type="button" id="btnAddBottomItem" class="btn-saas h-[48px] px-6 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span>THÊM CỬA / SẢN PHẨM MỚI</span>
                    </button>
                </div>
                ` : ''}

                <!-- TOTAL SUMMARY CARD (PREMIUM SAAS CARD DESIGN) -->
                <div class="mt-6 p-6 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                        <div class="text-slate-400 text-base font-semibold uppercase tracking-wider">TỔNG CỘNG HÓA ĐƠN</div>
                        <div class="text-[30px] md:text-[36px] font-extrabold text-amber-400 tracking-tight leading-none" id="displayInvoiceTotalAmount">
                            ${formattedTotal}
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-baseline gap-2 text-slate-200 text-base md:text-lg">
                        <span class="font-bold text-amber-300 whitespace-nowrap">Bằng chữ:</span>
                        <span class="italic font-semibold text-amber-100" id="displayTotalText">${totalText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function updateTotalsOnly(container) {
        const totalAmountEl = container.querySelector('#displayInvoiceTotalAmount');
        const totalTextEl = container.querySelector('#displayTotalText');
        if (totalAmountEl && totalTextEl) {
            const totalAmount = stateManager.getTotalAmount();
            const totalText = stateManager.getTotalText();
            const formattedTotal = typeof formatter !== 'undefined' ? formatter.formatCurrency(totalAmount) : totalAmount + ' đ';
            totalAmountEl.textContent = formattedTotal;
            totalTextEl.textContent = totalText;
        }
    }

    function bindEvents(container) {
        const btnAdd = container.querySelector('#btnAddItem');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                stateManager.addItem({});
            });
        }
        const btnAddFirst = container.querySelector('#btnAddFirstItem');
        if (btnAddFirst) {
            btnAddFirst.addEventListener('click', () => {
                stateManager.addItem({});
            });
        }
        const btnAddBottom = container.querySelector('#btnAddBottomItem');
        if (btnAddBottom) {
            btnAddBottom.addEventListener('click', () => {
                stateManager.addItem({});
            });
        }

        const rowEls = container.querySelectorAll('.product-row');
        rowEls.forEach(rowEl => {
            const id = rowEl.getAttribute('data-id');

            const btnRemove = rowEl.querySelector('.btn-remove-row');
            if (btnRemove) {
                btnRemove.addEventListener('click', () => {
                    stateManager.removeItem(id);
                });
            }

            const nameInp = rowEl.querySelector('.item-name');
            const unitSelect = rowEl.querySelector('.item-unit');
            const widthInp = rowEl.querySelector('.item-width');
            const heightInp = rowEl.querySelector('.item-height');
            const qtyInp = rowEl.querySelector('.item-quantity');
            const qtyAreaInp = rowEl.querySelector('.item-qty-area');
            const priceInp = rowEl.querySelector('.item-price');
            const noteInp = rowEl.querySelector('.item-note');
            const totalDisplayDiv = rowEl.querySelector('.item-total-display');

            const handleItemInput = () => {
                const w = parseFloat(widthInp.value) || 0;
                const h = parseFloat(heightInp.value) || 0;
                const setQty = parseFloat(qtyInp.value) || 1;
                const price = parseFloat(priceInp.value) || 0;
                let areaPerSet = 0;
                let totalArea = 0;
                let total = 0;

                if (w > 0 && h > 0) {
                    areaPerSet = Math.round(w * h * 100) / 100;
                    totalArea = Math.round(areaPerSet * setQty * 100) / 100;
                    qtyAreaInp.value = totalArea;
                    total = Math.round(totalArea * price);
                } else {
                    totalArea = parseFloat(qtyAreaInp.value) || setQty;
                    total = Math.round(setQty * price);
                }

                if (totalDisplayDiv) {
                    totalDisplayDiv.textContent = typeof formatter !== 'undefined' ? formatter.formatCurrency(total) : total + ' đ';
                }

                stateManager.updateItem(id, {
                    productName: nameInp.value,
                    unit: unitSelect.value,
                    width: widthInp.value,
                    height: heightInp.value,
                    quantity: setQty,
                    areaPerSet: areaPerSet,
                    area: totalArea,
                    price: price,
                    total: total,
                    note: noteInp.value
                }, true);

                updateTotalsOnly(container);
            };

            [nameInp, unitSelect, widthInp, heightInp, qtyInp, qtyAreaInp, priceInp, noteInp].forEach(inputEl => {
                if (inputEl) {
                    inputEl.addEventListener('input', handleItemInput);
                }
            });
        });
    }

    return {
        init: init
    };
})();
