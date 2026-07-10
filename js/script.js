// 1. Ambil semua elemen dari halaman HTML
const inputNama = document.getElementById('namaBarang');
const inputHarga = document.getElementById('hargaUang');
const inputKategori = document.getElementById('kategoriBarang');
const tombolTambah = document.getElementById('tombolTambah');
const daftarCatatan = document.getElementById('daftarCatatan');
const totalSaldoTeks = document.getElementById('totalSaldo');

// Mengambil data dari memori browser (Local Storage)
let listBelanja = JSON.parse(localStorage.getItem('transaksiKu')) || [];
let totalUang = 0;
let grafikKue = null;

// 2. BAGIAN KODE UNTUK GRAFIK KUE (PIE CHART)
function perbaruiGrafik() {
    const elemenGrafik = document.getElementById('grafikKategori');
    if (!elemenGrafik) return; // Cari tempat canvas, jika tidak ada jangan digambar

    const konteksGrafik = elemenGrafik.getContext('2d');
    
    let totalMakanan = 0;
    let totalTransport = 0;
    let totalHiburan = 0;

    listBelanja.forEach(function(barang) {
        if (barang.kategori === "Makanan") {
            totalMakanan += Number(barang.harga);
        } else if (barang.kategori === "Transport") {
            totalTransport += Number(barang.harga);
        } else if (barang.kategori === "Hiburan") {
            totalHiburan += Number(barang.harga);
        }
    });

    if (grafikKue) {
        grafikKue.destroy(); // Hapus grafik lama agar tidak menumpuk error
    }

    // Jika belum ada data belanja, biarkan kosong dulu
    if (listBelanja.length === 0) {
        return;
    }

    // Gambar grafik lingkaran baru
    grafikKue = new Chart(konteksGrafik, {
        type: 'pie',
        data: {
            labels: ['Makanan', 'Transport', 'Hiburan'],
            datasets: [{
                data: [totalMakanan, totalTransport, totalHiburan],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 3. Fungsi untuk memunculkan daftar data ke layar website
function tampilkanData() {
    daftarCatatan.innerHTML = "";
    totalUang = 0;

    listBelanja.forEach(function(barang, indeks) {
        totalUang = totalUang + Number(barang.harga);

        const barisBaru = document.createElement('li');
        barisBaru.innerHTML = barang.nama + " - Rp " + Number(barang.harga).toLocaleString() + " (" + barang.kategori + ") ";
        
        const tombolHapus = document.createElement('button');
        tombolHapus.innerText = "Hapus";
        tombolHapus.style.width = "auto";
        tombolHapus.style.backgroundColor = "#e74c3c";
        tombolHapus.style.marginLeft = "10px";
        
        tombolHapus.onclick = function() {
            listBelanja.splice(indeks, 1);
            localStorage.setItem('transaksiKu', JSON.stringify(listBelanja));
            tampilkanData();
        };

        barisBaru.appendChild(tombolHapus);
        daftarCatatan.appendChild(barisBaru);
    });

    totalSaldoTeks.innerText = "Rp " + totalUang.toLocaleString();

    // Jalankan pembaruan grafik
    perbaruiGrafik();
}

// 4. Perintah saat tombol "Tambah Transaksi" dipencet
tombolTambah.onclick = function() {
    const namaKetik = inputNama.value;
    const hargaKetik = inputHarga.value;
    const kategoriPilih = inputKategori.value;

    if (namaKetik === "" || hargaKetik === "") {
        alert("Maaf, semua kotak harus diisi terlebih dahulu ya!");
        return;
    }

    const paketBarangBaru = {
        nama: namaKetik,
        harga: hargaKetik,
        kategori: kategoriPilih
    };

    listBelanja.push(paketBarangBaru);
    localStorage.setItem('transaksiKu', JSON.stringify(listBelanja));

    inputNama.value = "";
    inputHarga.value = "";

    tampilkanData();
};

// PENGAMAN UTAMA: Fungsi baru berjalan otomatis hanya KETIKA HALAMAN WEB SUDAH SELESAI DI-LOAD TOTAL
window.onload = function() {
    tampilkanData();
};
