// 1. Ambil semua elemen dari halaman HTML
const inputNama = document.getElementById('namaBarang');
const inputHarga = document.getElementById('hargaUang');
const inputKategori = document.getElementById('kategoriBarang');
const tombolTambah = document.getElementById('tombolTambah');
const daftarCatatan = document.getElementById('daftarCatatan');
const totalSaldoTeks = document.getElementById('totalSaldo');

// Fitur Wajib: Mengambil data lama yang tersimpan di memori browser (Local Storage)
let listBelanja = JSON.parse(localStorage.getItem('transaksiKu')) || [];
let totalUang = 0;
let grafikKue = null;

// 2. Fungsi untuk memunculkan data ke layar website
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
            // Simpan perubahan setelah dihapus ke Local Storage
            localStorage.setItem('transaksiKu', JSON.stringify(listBelanja));
            tampilkanData();
        };

        barisBaru.appendChild(tombolHapus);
        daftarCatatan.appendChild(barisBaru);
    });

    totalSaldoTeks.innerText = "Rp " + totalUang.toLocaleString();

    // Jalankan grafik setelah data siap
    perbaruiGrafik();
}

// 3. Perintah saat tombol "Tambah Transaksi" dipencet
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

    // Fitur Wajib: Simpan data baru ke dalam Local Storage browser
    localStorage.setItem('transaksiKu', JSON.stringify(listBelanja));

    inputNama.value = "";
    inputHarga.value = "";

    tampilkanData();
};

// 4. BAGIAN KODE UNTUK GRAFIK KUE (PIE CHART)
function perbaruiGrafik() {
    const elemenGrafik = document.getElementById('grafikKategori');
    if (!elemenGrafik) return;

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
        grafikKue.destroy();
    }

    // Jika belum ada data sama sekali, jangan gambar apa-apa dulu
    if (listBelanja.length === 0) {
        return;
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

// Jalankan fungsi otomatis saat halaman pertama kali dibuka
tampilkanData();
