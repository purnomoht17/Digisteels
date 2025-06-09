// Validasi untuk membuat pesanan
import Joi from "joi";

// ENUM status pesanan sesuai schema
const allowedStatus = ["PENDING", "ON_PROCESS", "ON_DELIVERY"];

// Validasi untuk membuat pesanan
const createPesananValidation = Joi.object({
  status: Joi.string()
    .valid(...allowedStatus)
    .required()
    .messages({
      'string.base': "Status harus berupa string",
      'any.only': `Status hanya boleh salah satu dari: ${allowedStatus.join(", ")}`,
      'any.required': "Status wajib diisi",
    }),

  alamatDetail: Joi.string()
    .required()
    .messages({
      'string.base': "Alamat detail harus berupa string",
      'string.max': "Alamat detail maksimal 255 karakter",
      'any.required': "Alamat detail wajib diisi",
    }),

  provinsi: Joi.string()
    .required()
    .messages({
      'string.base': "Provinsi harus berupa string",
      'string.max': "Provinsi maksimal 20 karakter",
      'any.required': "Provinsi wajib diisi",
    }),

  kabupaten: Joi.string()
    .required()
    .messages({
      'string.base': "Kabupaten harus berupa string",
      'string.max': "Kabupaten maksimal 20 karakter",
      'any.required': "Kabupaten wajib diisi",
    }),

  kecamatan: Joi.string()
    .required()
    .messages({
      'string.base': "Kecamatan harus berupa string",
      'string.max': "Kecamatan maksimal 20 karakter",
      'any.required': "Kecamatan wajib diisi",
    }),

  kelurahan: Joi.string()
    .required()
    .messages({
      'string.base': "Kelurahan harus berupa string",
      'string.max': "Kelurahan maksimal 20 karakter",
      'any.required': "Kelurahan wajib diisi",
    }),

  nomorTelepon: Joi.string()
    .max(255)
    .required()
    .messages({
      'string.base': "Nomor telepon harus berupa string",
      'string.max': "Nomor telepon maksimal 255 karakter",
      'any.required': "Nomor telepon wajib diisi",
    }),

  keranjangId: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.base': "Keranjang ID harus berupa string",
      'string.length': "Keranjang ID harus 24 karakter (ObjectId)",
      'any.required': "Keranjang ID wajib diisi",
    }),

  bankName: Joi.string()
    .required()
    .messages({
      'string.base': "Nama bank harus berupa string",
      'any.required': "Nama bank wajib diisi",
    }),

  accountName: Joi.string()
    .required()
    .messages({
      'string.base': "Nama pemilik rekening harus berupa string",
      'any.required': "Nama pemilik rekening wajib diisi",
    }),

  accountNumber: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': "Nomor rekening harus berupa angka",
      'number.integer': "Nomor rekening harus berupa bilangan bulat",
      'any.required': "Nomor rekening wajib diisi",
    }),

  buktiTransferUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.base': "Bukti transfer harus berupa string (URL)",
      'string.uri': "Bukti transfer harus berupa URL yang valid",
      'any.required': "Bukti transfer wajib diisi",
    }),
});

// Validasi untuk update pesanan (misalnya update status / alamat / bukti transfer)
const updatePesananValidation = Joi.object({
  status: Joi.string()
    .valid(...allowedStatus)
    .optional()
    .messages({
      'string.base': "Status harus berupa string",
      'any.only': `Status hanya boleh salah satu dari: ${allowedStatus.join(", ")}`,
    }),

  alamatDetail: Joi.string()
    .optional()
    .messages({
      'string.base': "Alamat detail harus berupa string",
      'string.max': "Alamat detail maksimal 255 karakter",
    }),

  provinsi: Joi.string()
    .optional()
    .messages({
      'string.base': "Provinsi harus berupa string",
      'string.max': "Provinsi maksimal 20 karakter",
    }),

  kabupaten: Joi.string()
    .optional()
    .messages({
      'string.base': "Kabupaten harus berupa string",
      'string.max': "Kabupaten maksimal 20 karakter",
    }),

  kecamatan: Joi.string()
    .optional()
    .messages({
      'string.base': "Kecamatan harus berupa string",
      'string.max': "Kecamatan maksimal 20 karakter",
    }),

  kelurahan: Joi.string()
    .optional()
    .messages({
      'string.base': "Kelurahan harus berupa string",
      'string.max': "Kelurahan maksimal 20 karakter",
    }),

  nomorTelepon: Joi.string()
    .optional()
    .messages({
      'string.base': "Nomor telepon harus berupa string",
      'string.max': "Nomor telepon maksimal 255 karakter",
    }),

  bankName: Joi.string()
    .optional()
    .messages({
      'string.base': "Nama bank harus berupa string",
    }),

  accountName: Joi.string()
    .optional()
    .messages({
      'string.base': "Nama pemilik rekening harus berupa string",
    }),

  accountNumber: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': "Nomor rekening harus berupa angka",
      'number.integer': "Nomor rekening harus berupa bilangan bulat",
    }),

  buktiTransferUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.base': "Bukti transfer harus berupa string (URL)",
      'string.uri': "Bukti transfer harus berupa URL yang valid",
    }),
});

// Validasi untuk mendapatkan pesanan berdasarkan ID
const getPesananIdValidation = Joi.string()
  .length(24)
  .required()
  .messages({
    'string.base': "ID harus berupa string",
    'string.length': "ID harus 24 karakter (ObjectId)",
    'any.required': "ID wajib diisi",
  });

export {
  createPesananValidation,
  updatePesananValidation,
  getPesananIdValidation
};
