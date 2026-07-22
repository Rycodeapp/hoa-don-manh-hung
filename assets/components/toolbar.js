/**
 * Component Toolbar Thanh Công Cụ Thao Tác
 */

const toolbar = (function () {
    function init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        render(container);
        bindEvents(container);

        stateManager.subscribe(() => {
            render(container);
            bindEvents(container);
        });
    }

    function render(container) {
        const canUndo = typeof storage !== 'undefined' ? storage.canUndo() : false;

        container.innerHTML = `
            <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3 shadow-2xl z-40">
                <div class="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    <!-- Nút Xem Hóa Đơn & In PDF -->
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <button type="button" id="btnPreviewInvoice" class="flex-1 sm:flex-initial px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-extrabold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            XEM HÓA ĐƠN
                        </button>
                        
                        <button type="button" id="btnPrintPdfToolbar" class="flex-1 sm:flex-initial px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-extrabold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            IN / XUẤT PDF
                        </button>
                    </div>

                    <!-- Nút Hoàn tác & Tạo mới -->
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button type="button" id="btnUndo" ${!canUndo ? 'disabled' : ''} 
                            class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                            Hoàn tác
                        </button>

                        <button type="button" id="btnClearForm" class="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center gap-1.5">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Tạo hóa đơn mới
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function bindEvents(container) {
        const btnPreview = container.querySelector('#btnPreviewInvoice');
        if (btnPreview) {
            btnPreview.addEventListener('click', () => {
                if (typeof preview !== 'undefined') {
                    preview.open();
                }
            });
        }

        const btnPrint = container.querySelector('#btnPrintPdfToolbar');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                if (typeof printer !== 'undefined') {
                    printer.printInvoice();
                }
            });
        }

        const btnUndo = container.querySelector('#btnUndo');
        if (btnUndo) {
            btnUndo.addEventListener('click', () => {
                stateManager.undo();
            });
        }

        const btnClear = container.querySelector('#btnClearForm');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa hết thông tin để tạo hóa đơn mới không?')) {
                    stateManager.setState({
                        unitName: 'Thế giới Cửa Mạnh Hùng',
                        sellerPhone: '0976.088.080 - 0916.557.888',
                        buyerName: '',
                        buyerPhone: '',
                        address: '',
                        warehouse: '',
                        invoiceId: 'HD' + Date.now().toString().slice(-6),
                        createdDate: new Date().toISOString().split('T')[0],
                        generalNote: 'Bảo hành 24 tháng đối với motor và 12 tháng đối với thân cửa.',
                        items: []
                    });
                }
            });
        }
    }

    return {
        init: init
    };
})();
