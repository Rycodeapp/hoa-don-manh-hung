/**
 * Module PDF Import & Restore (SaaS 2025 Standard - Base64 Robust Engine)
 * Khôi phục & Chỉnh sửa Hóa đơn / Báo giá từ File PDF đã xuất
 * Sử dụng mã hóa Base64 thuần ASCII đảm bảo 100% trích xuất thành công trên mọi trình duyệt.
 */

const pdfImport = (function () {
    const CURRENT_VERSION = '2.6';
    const B64_START = 'MANH_HUNG_INVOICE_V26_B64_START:';
    const B64_END = ':MANH_HUNG_INVOICE_V26_B64_END';
    
    const RAW_START = 'MANH_HUNG_INVOICE_V26_DATA_START:';
    const RAW_END = ':MANH_HUNG_INVOICE_V26_DATA_END';

    /**
     * Mã hóa chuỗi UTF-8 sang Base64 an toàn
     */
    function utf8ToBase64(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        } catch (e) {
            return btoa(str);
        }
    }

    /**
     * Giải mã chuỗi Base64 về UTF-8
     */
    function base64ToUtf8(str) {
        try {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return atob(str);
        }
    }

    /**
     * Tạo chuỗi nhúng Base64 vào PDF (100% Ký tự ASCII tiêu chuẩn)
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

        const jsonStr = JSON.stringify(payload);
        const b64Str = utf8ToBase64(jsonStr);

        return B64_START + b64Str + B64_END;
    }

    /**
     * Phân tích văn bản PDF bằng PDF.js
     */
    async function extractPayloadPdfJs(arrayBuffer) {
        if (typeof pdfjsLib === 'undefined') return null;

        try {
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let combinedText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join('');
                combinedText += pageText + ' ';
            }

            // Xóa toàn bộ khoảng trắng dư thừa do PDF.js ghép chữ
            const cleanText = combinedText.replace(/\s+/g, '');

            // 1. Thử tìm Base64 Signature
            const bStart = cleanText.indexOf(B64_START);
            if (bStart !== -1) {
                const bEnd = cleanText.indexOf(B64_END, bStart);
                if (bEnd !== -1) {
                    const b64Content = cleanText.substring(bStart + B64_START.length, bEnd);
                    const jsonStr = base64ToUtf8(b64Content);
                    return JSON.parse(jsonStr);
                }
            }

            // 2. Thử tìm Raw Signature
            const rStart = combinedText.indexOf(RAW_START);
            if (rStart !== -1) {
                const rEnd = combinedText.indexOf(RAW_END, rStart);
                if (rEnd !== -1) {
                    const jsonStr = combinedText.substring(rStart + RAW_START.length, rEnd);
                    return JSON.parse(jsonStr);
                }
            }
        } catch (err) {
            console.warn('PDF.js extraction notice:', err);
        }
        return null;
    }

    /**
     * Phân tích Binary stream trực tiếp bằng ArrayBuffer
     */
    function extractPayloadBinary(arrayBuffer) {
        try {
            const bytes = new Uint8Array(arrayBuffer);
            let binaryStr = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                binaryStr += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
            }

            const cleanStr = binaryStr.replace(/\s+/g, '');

            // 1. Thử B64
            const bStart = cleanStr.indexOf(B64_START);
            if (bStart !== -1) {
                const bEnd = cleanStr.indexOf(B64_END, bStart);
                if (bEnd !== -1) {
                    const b64Content = cleanStr.substring(bStart + B64_START.length, bEnd);
                    const jsonStr = base64ToUtf8(b64Content);
                    return JSON.parse(jsonStr);
                }
            }

            // 2. Thử UTF-8 Decode
            if (typeof TextDecoder !== 'undefined') {
                const decoder = new TextDecoder('utf-8');
                const decodedText = decoder.decode(bytes);
                const cleanDecoded = decodedText.replace(/\s+/g, '');
                const uStart = cleanDecoded.indexOf(B64_START);
                if (uStart !== -1) {
                    const uEnd = cleanDecoded.indexOf(B64_END, uStart);
                    if (uEnd !== -1) {
                        const b64Content = cleanDecoded.substring(uStart + B64_START.length, uEnd);
                        const jsonStr = base64ToUtf8(b64Content);
                        return JSON.parse(jsonStr);
                    }
                }
            }
        } catch (e) {
            console.error('Binary extraction notice:', e);
        }
        return null;
    }

    /**
     * Validate và chuyển đổi về State ứng dụng
     */
    function validatePayload(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Dữ liệu không đúng định dạng');
        }

        return {
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
    }

    /**
     * Chọn file PDF và tiến hành Import
     */
    function selectAndImportPdf() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,application/pdf';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const arrayBuffer = await file.arrayBuffer();

                // 1. Phân tích bằng PDF.js
                let payload = await extractPayloadPdfJs(arrayBuffer);

                // 2. Phân tích bằng Binary Direct
                if (!payload) {
                    payload = extractPayloadBinary(arrayBuffer);
                }

                if (!payload) {
                    alert('Đây không phải là file PDF được tạo từ ứng dụng hoặc dữ liệu đã bị mất.\n\nKhông thể khôi phục để chỉnh sửa.');
                    return;
                }

                const restoredState = validatePayload(payload);

                if (typeof stateManager !== 'undefined') {
                    if (typeof storage !== 'undefined') {
                        storage.clearUndoStack();
                    }
                    stateManager.setState(restoredState, false);

                    const titleName = restoredState.invoiceTitle || 'Hóa đơn';
                    const code = restoredState.invoiceId || '';
                    const customerName = restoredState.buyerName ? ` - Khách: ${restoredState.buyerName}` : '';
                    alert(`🎉 Khôi phục thành công ${titleName} [${code}]${customerName}!\n\nBạn có thể chỉnh sửa, thêm/xóa sản phẩm và xuất lại PDF mới.`);
                }

            } catch (err) {
                console.error('Lỗi khi khôi phục PDF:', err);
                alert('Đây không phải là file PDF được tạo từ ứng dụng hoặc dữ liệu đã bị mất.\n\nKhông thể khôi phục để chỉnh sửa.');
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
