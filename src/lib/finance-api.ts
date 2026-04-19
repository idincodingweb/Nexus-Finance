export const API_URL = "https://script.google.com/macros/s/AKfycbwYmCnWfkWCpCiJgdbhJCb27QdEIrGdVIBfbOQoPXETqAnt5YcY3l8qJnYo5mTFImOpXg/exec";

export type Transaksi = {
  ID: string;
  UserID: string;
  Tanggal: string;
  Jenis: "Pemasukan" | "Pengeluaran" | string;
  Kategori: string;
  Jumlah: number;
  Metode: string;
  Deskripsi: string;
};

export type Summary = {
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
};

export type FinanceData = {
  summary: Summary;
  transaksi: Transaksi[];
};

// --- FUNGSI AUTH (Update: Tambah updateProfile) ---
export const authApi = {
  register: (nama: string, email: string, pass: string) => 
    postAction({ action: "REGISTER", nama, email, password: pass }),
  
  verify: (userId: string, code: string) => 
    postAction({ action: "VERIFY", userId, code }),
  
  login: (email: string, pass: string) => 
    postAction({ action: "LOGIN", email, password: pass }),

  // JEBRED! Fungsi baru buat ganti nama & upload foto ke Drive
  updateProfile: (userId: string, nama: string, imageBase64?: string) => 
    postAction({ action: "UPDATE_PROFILE", userId, nama, image: imageBase64 }),
};

// --- FUNGSI DATA ---
export async function fetchFinance(userId: string): Promise<FinanceData> {
  const res = await fetch(`${API_URL}?action=read_transactions&userId=${userId}`, { 
    method: "GET", 
    redirect: "follow" 
  });
  
  if (!res.ok) throw new Error("Gagal memuat data");
  const data = await res.json();
  return {
    summary: data.summary ?? { pemasukan: 0, pengeluaran: 0, saldo: 0 },
    transaksi: Array.isArray(data.transaksi) ? data.transaksi : [],
  };
}

export async function postAction(body: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("Permintaan gagal");
  return await res.json();
}

// --- HELPER ---
export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatTanggal = (s: string) => {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}-${mm}-${yy}`;
};