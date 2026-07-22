/**
 * Component Preview & In Hóa đơn chuẩn 100% theo mẫu hóa đơn thực tế
 * Tích hợp Phân trang thông minh: Tự động vừa 1 trang A4 và Giữ khối Tổng tiền + Chữ ký luôn đi cùng nhau.
 */

const preview = (function () {
    function init(modalContainerId) {
        const modalContainer = document.getElementById(modalContainerId);
        if (!modalContainer) return;

        stateManager.subscribe(() => {
            if (!modalContainer.classList.contains('hidden')) {
                render(modalContainer);
            }
        });
    }

    function open() {
        const modalContainer = document.getElementById('previewModalContainer');
        if (modalContainer) {
            render(modalContainer);
            modalContainer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function close() {
        const modalContainer = document.getElementById('previewModalContainer');
        if (modalContainer) {
            modalContainer.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function render(container) {
        const state = stateManager.getState();
        const items = state.items || [];
        const totalAmount = stateManager.getTotalAmount();
        const totalText = stateManager.getTotalText();

        // Xử lý ngày tháng năm
        let dayStr = '......', monthStr = '......', yearStr = '.........';
        if (state.createdDate) {
            const parts = state.createdDate.split('-');
            if (parts.length === 3) {
                yearStr = parts[0];
                monthStr = parts[1];
                dayStr = parts[2];
            }
        }

        const isDense = items.length > 8;
        const targetMinRows = isDense ? items.length : 8;
        let rowsHtml = '';

        for (let i = 0; i < targetMinRows; i++) {
            const item = items[i];
            if (item) {
                let qtyDisplay = item.quantity || 1;
                if (item.width && item.height) {
                    qtyDisplay = `${item.width} x ${item.height} = ${item.area} m²`;
                } else if (item.area) {
                    qtyDisplay = `${item.area} m²`;
                }

                const priceStr = item.price ? formatter.formatCurrency(item.price, false) : '';
                const totalStr = item.total ? formatter.formatCurrency(item.total, false) : '';

                const cellPaddingClass = isDense ? 'py-1 px-1.5 text-xs' : 'py-2 px-2 text-sm';

                rowsHtml += `
                    <tr class="invoice-paper-row">
                        <td class="text-center font-medium border-r border-b border-blue-600 ${cellPaddingClass}">${i + 1}</td>
                        <td class="border-r border-b border-blue-600 ${cellPaddingClass} font-semibold text-slate-900 leading-snug">
                            <div class="invoice-product-name">${escapeHtml(item.productName || '')}</div>
                            ${item.note ? `<div class="text-[11px] font-normal italic text-slate-600 mt-0.5">Ghi chú SP: ${escapeHtml(item.note)}</div>` : ''}
                        </td>
                        <td class="text-center border-r border-b border-blue-600 ${cellPaddingClass}">${escapeHtml(item.unit || '')}</td>
                        <td class="text-center border-r border-b border-blue-600 ${cellPaddingClass} font-medium">${qtyDisplay}</td>
                        <td class="text-right border-r border-b border-blue-600 ${cellPaddingClass} font-medium">${priceStr}</td>
                        <td class="text-right border-r border-b border-blue-600 ${cellPaddingClass} font-extrabold text-blue-950">${totalStr}</td>
                    </tr>
                `;
            } else {
                // Dòng trống kẻ sẵn cho hóa đơn ít sản phẩm
                rowsHtml += `
                    <tr class="invoice-paper-row h-9">
                        <td class="border-r border-b border-blue-600 py-2 px-1 text-center"></td>
                        <td class="border-r border-b border-blue-600 py-2 px-2"></td>
                        <td class="border-r border-b border-blue-600 py-2 px-1"></td>
                        <td class="border-r border-b border-blue-600 py-2 px-1"></td>
                        <td class="border-r border-b border-blue-600 py-2 px-2"></td>
                        <td class="border-r border-b border-blue-600 py-2 px-2"></td>
                    </tr>
                `;
            }
        }

        const formattedTotalAmount = formatter.formatCurrency(totalAmount, false);
        const sheetDensityClass = isDense ? 'dense-sheet' : '';

        container.innerHTML = `
            <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-transparent print:static">
                <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none">
                    
                    <!-- Thanh thao tác Modal (Ẩn hoàn toàn khi in) -->
                    <div class="bg-slate-800 text-white p-4 flex items-center justify-between print:hidden">
                        <div class="flex items-center gap-2 font-bold text-lg">
                            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Xem trước Hóa đơn (Phân Trang Thông Minh)
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="printer.printInvoice()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-base flex items-center gap-2 transition-colors shadow-md">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                In Hóa Đơn (PDF)
                            </button>
                            <button type="button" onclick="preview.close()" class="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-base transition-colors">
                                ✕ Đóng
                            </button>
                        </div>
                    </div>

                    <!-- GIẤY HÓA ĐƠN VỚI PHÂN TRANG THÔNG MINH -->
                    <div id="invoicePaperSheet" class="p-6 md:p-10 bg-white text-blue-900 border-4 border-double border-blue-500 print:border-none print:p-0 ${sheetDensityClass}" style="font-family: 'Times New Roman', Times, serif;">
                        
                        <!-- PHẦN ĐẦU HÓA ĐƠN -->
                        <div class="flex flex-col md:flex-row justify-between items-start gap-3 mb-2">
                            <!-- Bên trái: Đơn vị, SĐT Người bán, Người mua, SĐT Người mua, Địa chỉ, Kho -->
                            <div class="flex-1 space-y-1 text-base md:text-lg w-full">
                                <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                    <div class="flex items-baseline gap-2 flex-1 min-w-[280px]">
                                        <span class="font-bold whitespace-nowrap">ĐƠN VỊ :</span>
                                        <span class="font-extrabold uppercase border-b border-dotted border-blue-400 flex-1 text-blue-950">${escapeHtml(state.unitName || '..............................................................')}</span>
                                    </div>
                                    ${state.sellerPhone ? `
                                    <div class="flex items-baseline gap-1">
                                        <span class="font-bold whitespace-nowrap">ĐIỆN THOẠI :</span>
                                        <span class="font-bold text-blue-950 border-b border-dotted border-blue-400">${escapeHtml(state.sellerPhone)}</span>
                                    </div>
                                    ` : ''}
                                </div>
                                <div class="text-blue-500 text-xs tracking-widest pl-2">✩ ✩ ✩</div>

                                <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                    <div class="flex items-baseline gap-2 flex-1 min-w-[260px]">
                                        <span class="font-bold whitespace-nowrap">Họ tên người mua :</span>
                                        <span class="border-b border-dotted border-blue-400 flex-1 font-semibold">${escapeHtml(state.buyerName || '..............................................................')}</span>
                                    </div>
                                    ${state.buyerPhone ? `
                                    <div class="flex items-baseline gap-1">
                                        <span class="font-bold whitespace-nowrap">ĐTDĐ :</span>
                                        <span class="font-semibold border-b border-dotted border-blue-400">${escapeHtml(state.buyerPhone)}</span>
                                    </div>
                                    ` : ''}
                                </div>

                                <div class="flex items-baseline gap-2">
                                    <span class="font-bold whitespace-nowrap">Địa chỉ :</span>
                                    <span class="border-b border-dotted border-blue-400 flex-1">${escapeHtml(state.address || '..........................................................................................')}</span>
                                </div>

                                <div class="flex items-baseline gap-2">
                                    <span class="font-bold whitespace-nowrap">Xuất tại kho :</span>
                                    <span class="border-b border-dotted border-blue-400 flex-1">${escapeHtml(state.warehouse || '..............................................................')}</span>
                                </div>
                            </div>

                            <!-- Bên phải: Tiêu đề HÓA ĐƠN -->
                            <div class="text-center md:text-right w-full md:w-auto min-w-[150px]">
                                <h1 class="text-3xl md:text-4xl font-extrabold tracking-wider text-blue-800 uppercase mb-0.5">
                                    HÓA ĐƠN
                                </h1>
                                <p class="text-sm font-bold text-blue-700">Số: ${escapeHtml(state.invoiceId || '')}</p>
                            </div>
                        </div>

                        <!-- BẢNG SẢN PHẨM -->
                        <div class="overflow-x-auto my-2">
                            <table class="w-full border-2 border-blue-600 border-collapse text-base">
                                <thead>
                                    <tr class="bg-sky-100/90 font-bold text-center border-b-2 border-blue-600">
                                        <th class="border-r border-blue-600 p-2 w-[6%]">Số<br>Thứ<br>Tự</th>
                                        <th class="border-r border-blue-600 p-2 w-[46%] text-center uppercase tracking-wide">TÊN QUY CÁCH SẢN PHẨM HÀNG HÓA</th>
                                        <th class="border-r border-blue-600 p-2 w-[9%]">Đơn vị<br>tính</th>
                                        <th class="border-r border-blue-600 p-2 w-[13%]">Số lượng /<br>Diện tích</th>
                                        <th class="border-r border-blue-600 p-2 w-[12%]">Đơn giá</th>
                                        <th class="border-r border-blue-600 p-2 w-[14%] uppercase">THÀNH TIỀN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rowsHtml}
                                </tbody>
                                <tfoot>
                                    <tr class="font-bold border-t-2 border-blue-600">
                                        <td colspan="5" class="border-r border-blue-600 bg-sky-200/70 p-2 text-center text-lg uppercase tracking-wider text-blue-950">
                                            Cộng :
                                        </td>
                                        <td class="border-r border-blue-600 bg-sky-200/70 p-2 text-right text-xl font-black text-blue-950">
                                            ${formattedTotalAmount}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- KHỐI TỔNG TIỀN + CHỮ KÝ GẮN LIỀN KHÔNG TÁCH TRANG -->
                        <div class="invoice-footer-block break-inside-avoid mt-3">
                            <!-- TỔNG TIỀN BẰNG CHỮ -->
                            <div class="text-base md:text-lg">
                                <div class="flex items-baseline gap-2 font-semibold">
                                    <span class="whitespace-nowrap">Tổng số tiền (viết bằng chữ):</span>
                                    <span class="border-b border-dotted border-blue-400 flex-1 font-bold italic text-blue-950 pl-2">
                                        ${escapeHtml(totalText)}
                                    </span>
                                </div>
                            </div>

                            <!-- KHU VỰC GHI CHÚ CHUNG RÊNG BIỆT -->
                            ${state.generalNote ? `
                            <div class="mt-2.5 p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-sm md:text-base">
                                <span class="font-bold text-blue-950 underline">Ghi chú & Điều khoản:</span>
                                <span class="text-blue-900 font-medium ml-1 whitespace-pre-wrap">${escapeHtml(state.generalNote)}</span>
                            </div>
                            ` : ''}

                            <!-- NGÀY THÁNG VÀ 3 CỘT CHỮ KÝ -->
                            <div class="mt-4">
                                <div class="text-right font-medium italic text-base mb-2">
                                    Ngày <span class="font-bold not-italic px-1">${dayStr}</span> tháng <span class="font-bold not-italic px-1">${monthStr}</span> năm <span class="font-bold not-italic px-1">${yearStr}</span>
                                </div>

                                <!-- 3 CỘT CHỮ KÝ -->
                                <div class="grid grid-cols-3 text-center font-bold text-base md:text-lg gap-2">
                                    <div>
                                        <p class="uppercase tracking-wider">NGƯỜI NHẬN HÀNG</p>
                                        <p class="text-xs font-normal italic text-slate-500 mt-0.5">(Ký, họ tên)</p>
                                        <div class="signature-box h-16"></div>
                                    </div>
                                    <div>
                                        <p class="uppercase tracking-wider">ĐÃ NHẬN ĐỦ TIỀN</p>
                                        <p class="text-xs font-normal italic text-slate-500 mt-0.5">(Ký, họ tên)</p>
                                        <div class="signature-box h-16"></div>
                                    </div>
                                    <div>
                                        <p class="uppercase tracking-wider">NGƯỜI VIẾT HÓA ĐƠN</p>
                                        <p class="text-xs font-normal italic text-slate-500 mt-0.5">(Ký, họ tên)</p>
                                        <div class="signature-box h-16"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
        init: init,
        open: open,
        close: close
    };
})();
