import keranjangService from "../service/keranjangBelanja-service.js";

// Ambil semua item keranjang milik pelanggan yg login
const getAllByUser = async (req, res, next) => {
  try {
    // Ambil userId dari token pelanggan yg sedang login
    const userId = req.pelanggan.id;

    const result = await keranjangService.getAllByUserId(userId);
    res.status(200).json({
      message: "Data keranjang berhasil diambil",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Ambil item keranjang berdasarkan ID
const getById = async (req, res, next) => {
  try {
    const item = await keranjangService.getById(req.params.id);

    // Jika login sebagai pelanggan, batasi akses ke item miliknya
    if (req.pelanggan && item.userId !== req.pelanggan.id) {
      return res.status(403).json({
        errors: "Pelanggan tidak diizinkan mengakses item keranjang ini"
      });
    }

    res.status(200).json({
      message: "Detail item keranjang berhasil diambil",
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// Tambah item ke keranjang
const create = async (req, res, next) => {
  try {
    const result = await keranjangService.create({
      userId: req.pelanggan.id, // Inject userId dari token
      produkVarianId: req.body.produkVarianId,
      jumlah: req.body.jumlah
    });
    res.status(201).json({
      message: "Item berhasil ditambahkan ke keranjang",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update jumlah item
const updateJumlah = async (req, res, next) => {
  try {
    const result = await keranjangService.updateJumlah(req.params.id, req.body.jumlah);
    res.status(200).json({
      message: "Jumlah item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Update spesifikasi item
const updateSpesifikasi = async (req, res, next) => {
  try {
    const result = await keranjangService.updateSpesifikasi(req.params.id, req.body);
    res.status(200).json({
      message: "Spesifikasi item keranjang berhasil diperbarui",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Hapus item dari keranjang
const remove = async (req, res, next) => {
  try {
    await keranjangService.remove(req.params.id);
    res.status(200).json({
      message: "Item keranjang berhasil dihapus"
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllByUser,
  getById,
  create,
  updateJumlah,
  updateSpesifikasi,
  remove
};
