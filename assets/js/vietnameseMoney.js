/**
 * Module chuyển đổi số tiền thành chữ tiếng Việt
 */

const vietnameseMoney = (function () {
    const defaultNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    function readGroup(group, showZeroHundred = true) {
        let readStr = '';
        const hundred = Math.floor(group / 100);
        const ten = Math.floor((group % 100) / 10);
        const unit = group % 10;

        if (hundred > 0 || showZeroHundred) {
            readStr += defaultNumbers[hundred] + ' trăm ';
        }

        if (ten > 1) {
            readStr += defaultNumbers[ten] + ' mươi ';
            if (unit === 1) {
                readStr += 'mốt ';
            } else if (unit === 5) {
                readStr += 'lăm ';
            } else if (unit > 0) {
                readStr += defaultNumbers[unit] + ' ';
            }
        } else if (ten === 1) {
            readStr += 'mười ';
            if (unit === 5) {
                readStr += 'lăm ';
            } else if (unit > 0) {
                readStr += defaultNumbers[unit] + ' ';
            }
        } else {
            if (hundred > 0 && unit > 0) {
                readStr += 'lẻ ';
            }
            if (unit > 0) {
                readStr += defaultNumbers[unit] + ' ';
            }
        }

        return readStr;
    }

    function numberToWords(number) {
        if (typeof number !== 'number' || isNaN(number)) return 'Không đồng.';
        number = Math.floor(Math.abs(number));

        if (number === 0) return 'Không đồng.';

        const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
        let groups = [];
        let tempNumber = number;

        while (tempNumber > 0) {
            groups.push(tempNumber % 1000);
            tempNumber = Math.floor(tempNumber / 1000);
        }

        let result = '';
        const totalGroups = groups.length;

        for (let i = totalGroups - 1; i >= 0; i--) {
            const group = groups[i];
            if (group > 0) {
                const showZeroHundred = (i < totalGroups - 1);
                const groupText = readGroup(group, showZeroHundred);
                result += groupText + units[i] + ' ';
            }
        }

        result = result.trim();
        if (!result) return 'Không đồng.';

        // Viết hoa chữ cái đầu và thêm "đồng."
        result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng.';
        return result;
    }

    return {
        numberToWords: numberToWords
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = vietnameseMoney;
}
