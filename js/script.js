// 1. Ambil semua elemen dari halaman HTML
const inputNama = document.getElementById('namaBarang');
const inputHarga = document.getElementById('hargaUang');
const inputKategori = document.getElementById('kategoriBarang');
const tombolTambah = document.getElementById('tombolTambah');
const daftarCatatan = document.getElementById('daftarCatatan');
const totalSaldoTeks = document.getElementById('totalSaldo');

// Wadah kosong untuk menyimpan daftar belanjaan
let listBelanja = [];
let totalUang = 0;
let grafikKue = null;

// 2. Fungsi untuk memunculkan data ke layar website
function tampilkanData() {
    // Kosongkan daftar lama agar tidak menumpuk
    daftarCatatan.innerHTML = "";
    totalUang = 0;

    // Ambil setiap barang yang ada di dalam wadah
    listBelanja.forEach(function(barang, indeks) {
        totalUang = totalUang + Number(barang.harga);

        // Buat baris teks untuk daftar pengeluaran
        const barisBaru = document.createElement('li');
        barisBaru.innerHTML = barang.nama + " - Rp " + Number(barang.harga).toLocaleString() + " (" + barang.kategori + ") ";
        
        // Buat tombol hapus merah
        const tombolHapus = document.createElement('button');
        tombolHapus.innerText = "Hapus";
        tombolHapus.style.width = "auto";
        tombolHapus.style.backgroundColor = "#e74c3c";
        tombolHapus.style.marginLeft = "10px";
        
        // Jalankan perintah hapus jika dipencet
        tombolHapus.onclick = function() {
            listBelanja.splice(indeks, 1);
            tampilkanData();
        };

        barisBaru.appendChild(tombolHapus);
        daftarCatatan.appendChild(barisBaru);
    });

    // Perbarui angka Total Saldo di layar
    totalSaldoTeks.innerText = "Rp " + totalUang.toLocaleString();

    // Jalankan pembaruan grafik lingkaran
    perbaruiGrafik();
}

// 3. Perintah saat tombol "Tambah Transaksi" dipencet
tombolTambah.onclick = function() {
    const namaKetik = inputNama.value;
    const hargaKetik = inputHarga.value;
    const kategoriPilih = inputKategori.value;

    // Validasi jika kosong
    if (namaKetik === "" || hargaKetik === "") {
        alert("Maaf, semua kotak harus diisi terlebih dahulu ya!");
        return;
    }

    // Bungkus data menjadi satu paket
    const paketBarangBaru = {
        nama: namaKetik,
        harga: hargaKetik,
        kategori: kategoriPilih
    };

    // Masukkan ke dalam wadah
    listBelanja.push(paketBarangBaru);

    // Bersihkan kembali kotak ketikan
    inputNama.value = "";
    inputHarga.value = "";

    // Perbarui tampilan layar
    tampilkanData();
};

// 4. BAGIAN KODE UNTUK GRAFIK KUE (PIE CHART)
function perbaruiGrafik() {
    const konteksGrafik = document.getElementById('grafikKategori').getContext('2d');
    
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
        grafikKue.destroy();
    }

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
