"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bnzEncrypterRaw_1 = require("./bnzEncrypterRaw");
class BnzEncrypterService {
    Encrypt(id, password, publicKey) {
        return (0, bnzEncrypterRaw_1.encryptLoginCredentials)(id, password, publicKey);
    }
}
exports.default = BnzEncrypterService;
