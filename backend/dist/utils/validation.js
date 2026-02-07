"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
class Validation {
    isValidPrice(value) {
        const num = typeof value === 'string' ? value.trim() : value;
        const n = Number(num);
        if (typeof n !== 'number' || Number.isNaN(n))
            return false;
        const parts = String(n).split('.');
        if (parts.length === 2 && parts[1].length > 2)
            return false;
        const re = /^\d+(\.\d{1,2})?$/;
        return re.test(String(n));
    }
}
exports.validate = new Validation();
//# sourceMappingURL=validation.js.map