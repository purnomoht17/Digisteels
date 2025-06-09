'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/app/header';
import Navbar from '@/app/components/navbar';
import FooterHitam from '@/app/components/footerHitam';
import EditModal from './components/editModal'; // This is the ProductModal
import OrderModal from './components/orderModal';
import styles from './cart.module.css';

type CartItem = {
  id: string;
  userId: string;
  produkVarianId: string;
  jumlah: number;
  totalHarga: number;
  produkVarian: {
    id: string;
    produkId: string;
    size?: string;
    thickness?: number;
    hole?: number;
    harga: number;
    stok: number;
    produk: {
      id: string;
      namaProduk: string;
      kategori: string;
      gambar?: string;
    };
  };
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCartItemForOrder, setSelectedCartItemForOrder] = useState<CartItem | null>(null);

  const fetchCart = async () => {
    // Resetting loading state to show feedback on refresh
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/keranjang/my', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.data);
      } else {
        console.error('Error fetching cart:', data.errors || data.message);
        // Clear cart on auth error, for example
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleEdit = (item: CartItem) => {
    setSelectedCartItem(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCartItem(null);
    // Refresh cart data whenever the edit modal is closed
    fetchCart();
  };

  const handleOrder = (item: CartItem) => {
    setSelectedCartItemForOrder(item);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedCartItemForOrder(null);
    fetchCart(); // Refresh cart after order
  };

  const handleDelete = async (itemId: string) => {
    // Using a custom modal for confirmation would be better than window.confirm
    // but for now, this works.
    if (!window.confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/keranjang/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Item berhasil dihapus.');
        fetchCart();
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert('Gagal menghapus item.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus item.');
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>
      <div className={styles.pageWrapper}>
        <Header />
        <Navbar />
        <div className={styles.orderList}>
          {loading ? (
            <p style={{ color: 'white', fontSize: '20px' }}>Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p style={{ color: 'white', fontSize: '20px' }}>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.orderCard}>
                <div className={styles.orderCardImg}>
                  <img
                    src={item.produkVarian.produk.gambar || 'https://via.placeholder.com/200'}
                    alt={item.produkVarian.produk.namaProduk}
                  />
                </div>
                <div className={styles.orderCardContent}>
                  <div className={styles.orderCardDesc}>
                    <h3>{item.produkVarian.produk.namaProduk}</h3>
                    <div className={styles.orderCardSizeWrap}>
                      <div className={styles.orderCardSize}>
                        <p>
                          Size: {item.produkVarian.size || '-'} | Thickness:{' '}
                          {item.produkVarian.thickness ?? '-'} mm | Hole:{' '}
                          {item.produkVarian.hole === 0
                            ? 'None'
                            : item.produkVarian.hole !== undefined
                            ? `${item.produkVarian.hole} mm`
                            : '-'}
                        </p>
                      </div>
                    </div>
                    <p>Price: Rp {item.totalHarga.toLocaleString()}</p>
                    <br />
                    <p>
                      Amount: <span className={styles.amountValue}>{item.jumlah}</span>
                    </p>
                  </div>
                  <div className={styles.buttonWrap}>
                    <button
                      className={styles.orderBtn}
                      onClick={() => handleOrder(item)}
                    >
                      Order
                    </button>
                    <button
                      className={styles.produk}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteCartBtn}
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <FooterHitam />

        {/* MODIFICATION: Passing the correct props to EditModal */}
        {showEditModal && selectedCartItem && (
          <EditModal
            id={selectedCartItem.produkVarian.produk.id}
            onClose={handleCloseEditModal}
          />
        )}

        {showOrderModal && selectedCartItemForOrder && (
          <OrderModal
            isOpen={showOrderModal}
            onClose={handleCloseOrderModal}
            totalPrice={selectedCartItemForOrder.totalHarga}
            shippingFee={0}
            keranjangId={selectedCartItemForOrder.id}
            // MODIFICATION: Added the missing cartItem prop
            cartItem={selectedCartItemForOrder}
          />
        )}
      </div>
    </>
  );
}
