import React, { useState } from 'react';
import { MarketplaceProduct, ProductStatus, MarketplaceCategory } from '../../types';
import {
  ShoppingBag,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Tag,
  Layers,
  FolderPlus
} from 'lucide-react';

interface MarketplaceManagementProps {
  products: MarketplaceProduct[];
  categories: MarketplaceCategory[];
  onSaveProduct: (product: MarketplaceProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onSaveCategory: (category: MarketplaceCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const MarketplaceManagement: React.FC<MarketplaceManagementProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MarketplaceProduct | null>(null);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<MarketplaceCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');

  // Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Buku Cetak');
  const [price, setPrice] = useState(149000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');

  // Open Category Form Modal
  const openCatModal = (cat?: MarketplaceCategory) => {
    if (cat) {
      setEditingCat(cat);
      setCatName(cat.name);
      setCatDescription(cat.description || '');
    } else {
      setEditingCat(null);
      setCatName('');
      setCatDescription('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    onSaveCategory({
      id: editingCat ? editingCat.id : `cat-${Date.now()}`,
      name: catName.trim(),
      description: catDescription.trim()
    });
    setIsCatModalOpen(false);
  };

  const openFormModal = (prod?: MarketplaceProduct) => {
    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setCategory(prod.category);
      setPrice(prod.price);
      setDescription(prod.description);
      setImageUrl(prod.imageUrl);
      setExternalLink(prod.externalLink);
      setStatus(prod.status);
    } else {
      setEditingProduct(null);
      setName('');
      setCategory('Buku Cetak');
      setPrice(99000);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80');
      setExternalLink('https://shopee.co.id');
      setStatus('ACTIVE');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !externalLink) return;

    onSaveProduct({
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
      externalLink: externalLink.trim(),
      status,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Manajemen Toko & Marketplace Sekolah</h2>
          </div>
          <p className="text-xs text-slate-400">
            Kelola katalog buku fisik, paket tryout premium, bimbingan VIP, dan link toko Shopee/Tokopedia/WA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCatModal()}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4 text-blue-400" /> + Kategori Baru
          </button>

          <button
            onClick={() => openFormModal()}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-blue-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Category CRUD Chips Section */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Layers className="w-4 h-4 text-red-500" /> Kategori Produk Editable (CRUD):
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            Klik ikon pencil untuk edit / trash untuk hapus kategori
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-200 group hover:border-slate-700"
            >
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold">{cat.name}</span>
              <div className="flex items-center gap-1 ml-1 opacity-80 group-hover:opacity-100">
                <button
                  onClick={() => openCatModal(cat)}
                  className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                  title="Edit Kategori"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (categories.length <= 1) {
                      alert('Minimal harus ada 1 kategori produk.');
                      return;
                    }
                    if (confirm(`Hapus kategori ${cat.name}?`)) onDeleteCategory(cat.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Product Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/50">
                    {product.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {product.status === 'ACTIVE' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Aktif
                    </span>
                  )}
                  {product.status === 'INACTIVE' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/90 backdrop-blur-md text-slate-400 border border-slate-700 inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Non-Aktif
                    </span>
                  )}
                  {product.status === 'OUT_OF_STOCK' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/90 backdrop-blur-md text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stok Habis
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-300 transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-extrabold text-lg text-amber-400">
                    {formatRupiah(product.price)}
                  </span>

                  <a
                    href={product.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Link Toko</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Tersedia untuk Siswa</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openFormModal(product)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus produk ${product.name}?`)) onDeleteProduct(product.id);
                  }}
                  className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-xl text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM PRODUCT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Produk Marketplace' : 'Tambah Produk Marketplace Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Buku Super Master SNBT 2026..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Produk
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold text-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Gambar Foto Produk
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Eksternal Pemesanan (Shopee / Tokopedia / WhatsApp)
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={e => setExternalLink(e.target.value)}
                  placeholder="https://shopee.co.id/... atau https://wa.me/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Produk
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ProductStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="ACTIVE">Aktif (Bisa Dipesan)</option>
                    <option value="INACTIVE">Non-Aktif (Disembunyikan)</option>
                    <option value="OUT_OF_STOCK">Stok Habis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Rincian fitur dan keunggulan paket..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/30"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM CATEGORY */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white">
                <FolderPlus className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">
                  {editingCat ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
                </h3>
              </div>
              <button onClick={() => setIsCatModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Kategori <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  placeholder="Contoh: Modul Digital, Voucher CBT, Merchandise..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Kategori (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={catDescription}
                  onChange={e => setCatDescription(e.target.value)}
                  placeholder="Keterangan singkat mengenai kategori ini..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/30"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
