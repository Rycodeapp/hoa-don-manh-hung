/**
 * Module PDF Import & Restore (SaaS 2025 Standard)
 * Khôi phục & Chỉnh sửa Hóa đơn / Báo giá từ File PDF đã xuất
 * Không dùng OCR hay AI - Đọc dữ liệu JSON gốc được nhúng trực tiếp trong PDF.
 */

const pdfImport = (function () {
    const CURRENT_VERSION = '2.6';
    const SIGNATURE_START = 'MANH_HUNG_INVOICE_V26_DATA_START:';
    const SIGNATURE_END = ':MANH_HUNG_INVOICE_V26_DATA_END';

    /**
     * Tạo chuỗi JSON Payload hoàn chỉnh từ State ứng dụng hiện tại để nhúng vào PDF
     */
    function createEmbeddedPayload(state) {
        const totalAmount = typeof stateManager !== 'undefined' ? stateManager.getTotalAmount() : 0;
        const totalText = typeof stateManager !== 'undefined' ? stateManager.getTotalText() : '';

        const payload = {
            version: CURRENT_VERSION,
            invoiceTitle: state.invoiceTitle || 'HÓA ĐƠN',
            invoiceId: state.invoiceId || '',
            createdDate: state.createdDate || new Date().toISOString().split('T')[0],
            unitName: state.unitName || '',
            sellerPhone: state.sellerPhone || '',
            buyerName: state.buyerName || '',
            buyerPhone: state.buyerPhone || '',
            address: state.address || '',
            warehouse: state.warehouse || '',
            generalNote: state.generalNote || '',
            items: state.items || [],
            totalAmount: totalAmount,
            totalText: totalText,
            exportedAt: new Date().toISOString()
        };

        return SIGNATURE_START + JSON.stringify(payload) + SIGNATURE_END;
    }

    /**
     * Trích xuất chuỗi JSON từ ArrayBuffer / Binary Text của file PDF
     */
    function extractJsonFromBinary(buffer) {
        try {
            // Chuyển ArrayBuffer thành chuỗi text
            const bytes = new Uint8Array(buffer);
            let binaryStr = '';
            
            // Xử lý đọc theo chunk lớn để tránh stack overflow
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const subArray = bytes.subarray(i, i + chunkSize);
                binaryStr += String.fromCharCode.apply(null, subArray);
            }

            // Tìm vị trí chữ ký SIGNATURE_START và SIGNATURE_END
            const startIdx = binaryStr.indexOf(SIGNATURE_START);
            if (startIdx !== -1) {
                const endIdx = binaryStr.indexOf(SIGNATURE_END, startIdx);
                if (endIdx !== -1) {
                    const jsonStr = binaryStr.substring(startIdx + SIGNATURE_START.length, endIdx);
                    return JSON.parse(jsonStr);
                }
            }

            // Nếu không tìm thấy bằng mã hóa mặc định, thử giải mã UTF-8
            if (typeof TextDecoder !== 'undefined') {
                const decoder = new TextDecoder('utf-8');
                const decodedStr = decoder.decode(bytes);
                const uStart = decodedStr.indexOf(SIGNATURE_START);
                if (uStart !== -1) {
                    const uEnd = decodedStr.indexOf(SIGNATURE_END, uStart);
                    if (uEnd !== -1) {
                        const jsonStr = decodedStr.substring(uStart + SIGNATURE_START.length, uEnd);
                        return JSON.parse(jsonStr);
                    }
                }
            }

        } catch (err) {
            console.error('Lỗi phân tích binary PDF:', err);
        }
        return null;
    }

    /**
     * Trích xuất dữ liệu bằng PDF.js (nếu có thư viện PDF.js)
     */
    async function extractJsonUsingPdfJs(buffer) {
        if (typeof pdfjsLib === 'undefined') return null;

        try {
            // Thiết lập worker PDF.js
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
            }

            const startIdx = fullText.indexOf(SIGNATURE_START);
            if (startIdx !== -1) {
                const endIdx = fullText.indexOf(SIGNATURE_END, startIdx);
                if (endIdx !== -1) {
                    const jsonStr = fullText.substring(startIdx + SIGNATURE_START.length, endIdx).trim();
                    return JSON.parse(jsonStr);
                }
            }
        } catch (e) {
            console.warn('PDF.js parse non-critical error:', e);
        }
        return null;
    }

    /**
     * Kiểm tra tính hợp lệ và hỗ trợ Migration dữ liệu theo version
     */
    function validateAndMigratePayload(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Dữ liệu không đúng định dạng');
        }

        if (!payload.version) {
            throw new Error('Thiếu thông tin phiên bản dữ liệu');
        }

        // Chuyển đổi payload thành State ứng dụng chuẩn
        const newState = {
            unitName: payload.unitName || 'Thế giới Cửa Mạnh Hùng',
            invoiceTitle: payload.invoiceTitle || 'HÓA ĐƠN',
            sellerPhone: payload.sellerPhone || '0976.088.080 - 0916.557.888',
            buyerName: payload.buyerName || '',
            buyerPhone: payload.buyerPhone || '',
            address: payload.address || '',
            warehouse: payload.warehouse || '',
            invoiceId: payload.invoiceId || (stateManager ? stateManager.generateRandomInvoiceId() : 'HD'),
            createdDate: payload.createdDate || new Date().toISOString().split('T')[0],
            generalNote: payload.generalNote || '',
            items: Array.isArray(payload.items) ? payload.items : []
        };

        return newState;
    }

    /**
     * Hàm chọn file PDF từ máy tính / điện thoại và tiến hành Import
     */
    function selectAndImportPdf() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,application/pdf';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                // Hiển thị trạng thái đang đọc
                console.log('Đang đọc file PDF:', file.name);

                const arrayBuffer = await file.arrayBuffer();
                
                // Thuật toán 1: Thử phân tích bằng PDF.js trước
                let payload = await extractJsonUsingPdfJs(arrayBuffer);

                // Thuật toán 2: Nếu PDF.js không thấy, thử đọc binary stream trực tiếp
                if (!payload) {
                    payload = extractJsonFromBinary(arrayBuffer);
                }

                if (!payload) {
                    alert('Đây không phải là file PDF được tạo từ ứng dụng hoặc dữ liệu đã bị mất.\n\nKhông thể khôi phục để chỉnh sửa.');
                    return;
                }

                // Validate và Migrate dữ liệu
                const restoredState = validateAndMigratePayload(payload);

                // Khôi phục vào StateManager
                if (typeof stateManager !== 'undefined') {
                    // Reset Undo Stack khi import thành công
                    if (typeof storage !== 'undefined') {
                        storage.clearUndoStack();
                    }

                    // Cập nhật State mới & render lại giao diện
                    stateManager.setState(restoredState, false);

                    // Thông báo thành công
                    const titleName = restoredState.invoiceTitle || 'Hóa đơn';
                    const code = restoredState.invoiceId || '';
                    const customerName = restoredState.buyerName ? ` - Khách: ${restoredState.buyerName}` : '';
                    alert(`🎉 Khôi phục thành công ${titleName} [${code}]${customerName}!\n\nBạn có thể chỉnh sửa, thêm/xóa sản phẩm và xuất lại PDF mới.`);
                }

            } catch (err) {
                console.error('Lỗi khi khôi phục PDF:', err);
                alert('Có lỗi xảy ra trong quá trình đọc file PDF:\n' + err.message);
            }
        };

        input.click();
    }

    return {
        createEmbeddedPayload: createEmbeddedPayload,
        selectAndImportPdf: selectAndImportPdf
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pdfImport;
}
