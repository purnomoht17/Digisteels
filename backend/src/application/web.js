import express from "express";
import cors from "cors";

import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";
import { router as produkRouter } from "../route/produk-api.js";
import { router as keranjangRouter } from "../route/keranjangBelanja-api.js";
import { router as pesananRouter } from "../route/pesanan-api.js";
import { router as pembatalanRouter } from "../route/pembatalan-api.js";
import { router as laporanRouter } from "../route/laporan-api.js";

export const web = express();

web.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

web.use(express.json());

// Public routes
web.use(publicRouter);

// Protected routes
web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);
web.use(produkRouter);
web.use(keranjangRouter);
web.use(pesananRouter);
web.use(pembatalanRouter);
web.use(laporanRouter);

web.use(errorMiddleware);
