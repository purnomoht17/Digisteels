import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createKeranjangValidation,
  getKeranjangIdValidation,
  updateKeranjangValidation
} from "../validation/keranjangBelanja-validation.js";

// Ambil semua item keranjang berdasarkan userId
const getAllByUserId = async (userId) => {
  const items = await prismaClient.keranjangBelanja.findMany({
    where: { userId: userId },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  return items;
};

// Tambah item ke keranjang
const create = async (request) => {
  const data = validate(createKeranjangValidation, request);

  return prismaClient.keranjangBelanja.create({
    data: {
      userId: data.userId,
      produkVarianId: data.produkVarianId,
      jumlah: data.jumlah || 1
    },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });
};

// Ambil satu item keranjang berdasarkan ID keranjang
const getById = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return item;
};

// Update jumlah item
const updateJumlah = async (id, jumlahBaru) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: { jumlah: jumlahBaru },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });
};

// Update spesifikasi item (jumlah, size, thickness, hole)
const updateSpesifikasi = async (id, request) => {
  const validId = validate(getKeranjangIdValidation, id);
  const data = validate(updateKeranjangValidation, request);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: { produkVarian: true }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  // Update jumlah (di keranjang)
  const updatedKeranjang = await prismaClient.keranjangBelanja.update({
    where: { id: validId },
    data: {
      jumlah: data.jumlah ?? item.jumlah
    }
  });

  // Update size / thickness / hole jika ada
  const produkVarianUpdates = {};
  if (data.size !== undefined) produkVarianUpdates.size = data.size;
  if (data.thickness !== undefined) produkVarianUpdates.thickness = data.thickness;
  if (data.hole !== undefined) produkVarianUpdates.hole = data.hole;

  if (Object.keys(produkVarianUpdates).length > 0) {
    await prismaClient.produkVarian.update({
      where: { id: item.produkVarianId },
      data: produkVarianUpdates
    });
  }

  // Ambil data terbaru setelah update
  const updatedItem = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId },
    include: {
      produkVarian: {
        include: {
          produk: true
        }
      }
    }
  });

  return updatedItem;
};

// Hapus item dari keranjang
const remove = async (id) => {
  const validId = validate(getKeranjangIdValidation, id);

  const item = await prismaClient.keranjangBelanja.findUnique({
    where: { id: validId }
  });

  if (!item) {
    throw new ResponseError(404, "Item keranjang tidak ditemukan");
  }

  return prismaClient.keranjangBelanja.delete({
    where: { id: validId }
  });
};

export default {
  getAllByUserId,
  create,
  getById,
  updateJumlah,
  updateSpesifikasi,
  remove
};
