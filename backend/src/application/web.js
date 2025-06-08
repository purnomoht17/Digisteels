import express from "express";
import cors from "cors"; // 🟢 Import CORS

import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { pelangganRouter } from "../route/pelanggan-api.js";
import { adminRouter } from "../route/admin-api.js";
import { router as produkRouter } from "../route/produk-api.js";
import { router as keranjangRouter } from "../route/keranjangBelanja-api.js";
import { router as pesananRouter } from "../route/pesanan-api.js";
import { router as pembatalanRouter } from "../route/pembatalan-api.js";

export const web = express();

web.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

web.use(express.json());

web.use(publicRouter);

web.use("/api/admin", adminRouter);
web.use("/api/pelanggan", pelangganRouter);
web.use(produkRouter);
web.use(keranjangRouter);
web.use(pesananRouter);
web.use(pembatalanRouter);

web.use(errorMiddleware);
