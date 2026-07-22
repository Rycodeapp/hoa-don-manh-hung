/**
 * Component Toolbar Thanh Công Cụ Thao Tác STICKY (Căn giữa 45% - 10% - 45% & Equal Buttons)
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
            <div class="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40">
                <!-- CONTAINER CĂN GIỮA ĐỒNG BỘ VỚI KHUNG CHÍNH (MAX-W-[1150PX]) -->
                <div class="max-w-[1150px] mx-auto w-full">
                    
                    <!-- GRID CHÍNH DESKTOP: 45% (1FR) | 10% (AUTO GAP) | 45% (1FR) -->
                    <!-- MOBILE: 2 NÚT TRÊN HÀNG 1, 2 NÚT TRÊN HÀNG 2 -->
                    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 w-full">
                        
                        <!-- NHÓM BÊN TRÁI: XEM HÓA ĐƠN & IN PDF (CHIẾM 45% TRÊN DESKTOP) -->
                        <div class="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                            <button type="button" id="btnPreviewInvoice" 
                                class="btn-saas h-[50px] px-3 sm:px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-[12px] shadow-sm transition-all duration-200 w-full flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                <span class="truncate">XEM HÓA ĐƠN</span>
                            </button>
                            
                            <button type="button" id="btnPrintPdfToolbar" 
                                class="btn-saas h-[50px] px-3 sm:px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-[12px] shadow-sm transition-all duration-200 w-full flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                <span class="truncate">IN / XUẤT PDF</span>
                            </button>
                        </div>

                        <!-- KHOẢNG TRỐNG TRONG GIỮA (~10% HOẶC MIN-WIDTH 32PX TRÊN DESKTOP) -->
                        <div class="hidden md:block w-8 lg:w-16"></div>

                        <!-- NHÓM BÊN PHẢI: HOÀN TÁC & TẠO MỚI (CHIẾM 45% TRÊN DESKTOP) -->
                        <div class="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                            <button type="button" id="btnUndo" ${!canUndo ? 'disabled' : ''} 
                                class="btn-saas h-[50px] px-3 sm:px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold rounded-[12px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 w-full flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                <span class="truncate">Hoàn tác</span>
                            </button>

                            <button type="button" id="btnClearForm" 
                                class="btn-saas h-[50px] px-3 sm:px-4 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-bold rounded-[12px] transition-all duration-200 border border-red-200/60 w-full flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                <span class="truncate">Tạo hóa đơn mới</span>
                            </button>
                        </div>

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
                        invoiceId: stateManager.generateRandomInvoiceId(),
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
