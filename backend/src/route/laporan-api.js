import express from "express";
import laporanController from "../controller/laporan-controller.js";
import { adminMiddleware } from "../middleware/admin-middleware.js"; // admin only

const router = new express.Router();

// GET → Admin → semua laporan penjualan (bisa ditambah filter nanti)
router.get("/api/laporan", adminMiddleware, laporanController.getAll);

// GET → Admin → detail laporan by ID
router.get("/api/laporan/:id", adminMiddleware, laporanController.getById);

// POST → Admin → tambah laporan penjualan baru
router.post("/api/laporan", adminMiddleware, laporanController.create);

// PATCH → Admin → update laporan penjualan
router.patch("/api/laporan/:id", adminMiddleware, laporanController.update);

// DELETE → Admin → hapus laporan penjualan
router.delete("/api/laporan/:id", adminMiddleware, laporanController.remove);

export {
  router
};
