"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_1 = __importDefault(require("../../services"));
const router = (0, express_1.Router)();
router.get("/bnz/encrypt", async (req, res) => {
    try {
        var service = new services_1.default();
        service
            .Encrypt("159527402", "Er6EfYtz", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0r0FPobwSdw70swqLIXj9KUWaqeydWXHSjRirqM+aeSjihyk398rwbrVQFhOoaPKWy7bToPuBcM8lSSyiF5VVdfDhN+WPodnV4ytDIxn6z1SRKmNVfDITRSfdgbS2++TV0jNmtote9WEwnlFGtP67E9YRDCBb5780Rkux7QDcSYlhs4S6NIaJvyXV8MHfMSWrkPA3qS8V/JHfytan8UKCP7yOTYYF42rW4eT/7UutiKqnvOohlcUOEz4SRM1sbmivg6Xq5JhHc+ooTImdV7IzE5ksr5ZgJNalZKRU3Ffoii6ns56ofmBwQ3r6AOMNdx04vAfNH0GrWAAIwAA/5XdjQIDAQAB")
            ?.then((data) => {
            console.log("data received");
            console.log(data);
            res.status(200).send(data);
        })
            ?.catch((error) => console.error("An error ocurred:", error));
    }
    catch (error) {
        console.error("An error ocurred:", error);
        res.status(500).json(error);
    }
});
router.post("/bnz/encrypt", async (req, res) => {
    try {
        var service = new services_1.default();
        var encryptRequest = req.body;
        service
            .Encrypt(encryptRequest.userId, encryptRequest.password, encryptRequest.publicKey)
            ?.then((data) => {
            console.log("data received");
            console.log(data);
            res.status(200).json(data);
        })
            ?.catch((error) => console.error("An error ocurred:", error));
    }
    catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json(error);
    }
});
router.put("/bnz/:id", async (req, res) => {
    try {
        res.status(200).json({});
    }
    catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json(error);
    }
});
router.delete("/bnz/:id", async (req, res) => {
    try {
        res.status(200).json({});
    }
    catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json(error);
    }
});
exports.default = router;
