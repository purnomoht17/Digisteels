import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createPesananValidation,
  getPesananIdValidation,
  updatePesananValidation
} from "../validation/pesanan-validation.js";

// Ambil semua pesanan
const getAll = async (userId, isAdmin) => {
  const whereClause = isAdmin ? {} : { userId };

  const pesanan = await prismaClient.pesanan.findMany({
    where: whereClause,
    include: {
      keranjang: {
        include: {
          produkVarian: {
            include: {
              produk: true
            }
          }
        }
      }
    }
  });

  return pesanan;
};

// Tambah pesanan baru (hanya customer)
const create = async (userId, request) => {
  const data = validate(createPesananValidation, request);

  return prismaClient.pesanan.create({
    data: {
      userId: userId,
      status: data.status,
      alamatDetail: data.alamatDetail,
      provinsi: data.provinsi,
      kabupaten: data.kabupaten,
      kecamatan: data.kecamatan,
      kelurahan: data.kelurahan,
      nomorTelepon: data.nomorTelepon,
      keranjangId: data.keranjangId,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      buktiTransferUrl: data.buktiTransferUrl
      // tanggalPemesanan tidak perlu diisi, Prisma akan auto
    }
  });
};

// Ambil satu pesanan berdasarkan ID
const getById = async (id, userId, isAdmin) => {
  const validId = validate(getPesananIdValidation, id);

  const pesanan = await prismaClient.pesanan.findUnique({
    where: { id: validId },
    include: {
      keranjang: {
        include: {
          produkVarian: {
            include: {
              produk: true
            }
          }
        }
      }
    }
  });

  if (!pesanan) {
    throw new ResponseError(404, "Pesanan tidak ditemukan");
  }

  if (!isAdmin && pesanan.userId !== userId) {
    throw new ResponseError(403, "Anda tidak memiliki akses ke pesanan ini");
  }

  return pesanan;
};

// Update pesanan
const update = async (id, request, userId, isAdmin) => {
  const validId = validate(getPesananIdValidation, id);
  const data = validate(updatePesananValidation, request);

  const pesanan = await prismaClient.pesanan.findUnique({
    where: { id: validId }
  });

  if (!pesanan) {
    throw new ResponseError(404, "Pesanan tidak ditemukan");
  }

  // Jika customer
  if (!isAdmin) {
    if (pesanan.userId !== userId) {
      throw new ResponseError(403, "Anda tidak memiliki akses ke pesanan ini");
    }

    if (data.status !== undefined) {
      throw new ResponseError(403, "Customer tidak boleh mengubah status pesanan");
    }

    // Customer boleh update field lain selain status
    return prismaClient.pesanan.update({
      where: { id: validId },
      data: {
        alamatDetail: data.alamatDetail ?? pesanan.alamatDetail,
        provinsi: data.provinsi ?? pesanan.provinsi,
        kabupaten: data.kabupaten ?? pesanan.kabupaten,
        kecamatan: data.kecamatan ?? pesanan.kecamatan,
        kelurahan: data.kelurahan ?? pesanan.kelurahan,
        nomorTelepon: data.nomorTelepon ?? pesanan.nomorTelepon,
        bankName: data.bankName ?? pesanan.bankName,
        accountName: data.accountName ?? pesanan.accountName,
        accountNumber: data.accountNumber ?? pesanan.accountNumber,
        buktiTransferUrl: data.buktiTransferUrl ?? pesanan.buktiTransferUrl
      }
    });
  }

  // Jika admin
  return prismaClient.pesanan.update({
    where: { id: validId },
    data: {
      status: data.status ?? pesanan.status,
      alamatDetail: data.alamatDetail ?? pesanan.alamatDetail,
      provinsi: data.provinsi ?? pesanan.provinsi,
      kabupaten: data.kabupaten ?? pesanan.kabupaten,
      kecamatan: data.kecamatan ?? pesanan.kecamatan,
      kelurahan: data.kelurahan ?? pesanan.kelurahan,
      nomorTelepon: data.nomorTelepon ?? pesanan.nomorTelepon,
      bankName: data.bankName ?? pesanan.bankName,
      accountName: data.accountName ?? pesanan.accountName,
      accountNumber: data.accountNumber ?? pesanan.accountNumber,
      buktiTransferUrl: data.buktiTransferUrl ?? pesanan.buktiTransferUrl
    }
  });
};

// Hapus pesanan
const remove = async (id, userId, isAdmin) => {
  const validId = validate(getPesananIdValidation, id);

  const pesanan = await prismaClient.pesanan.findUnique({
    where: { id: validId }
  });

  if (!pesanan) {
    throw new ResponseError(404, "Pesanan tidak ditemukan");
  }

  if (!isAdmin && pesanan.userId !== userId) {
    throw new ResponseError(403, "Anda tidak memiliki akses untuk menghapus pesanan ini");
  }

  return prismaClient.pesanan.delete({
    where: { id: validId }
  });
};

export default {
  getAll,
  create,
  getById,
  update,
  remove
};
