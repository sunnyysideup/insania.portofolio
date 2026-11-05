/* ==========================================================
   Portfolio Insania Istiqamah - script.js
   Semua interaksi memakai addEventListener().

   Isi file:
   1. Tema terang / gelap (dark mode)
   2. Navigasi: penanda halaman aktif + menu mobile
   3. Tombol sapaan interaktif (halaman Home)
   4. Validasi form kontak (halaman Experience)
   5. Tahun otomatis di footer
   ========================================================== */

/* ---------- 1. TEMA TERANG / GELAP ---------- */
/* Bagian ini dijalankan langsung (sebelum halaman tampil)
   supaya tema tersimpan tidak "berkedip" saat halaman dibuka. */
var THEME_KEY = "insania-theme";

function getSavedTheme() {
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (err) {
    /* localStorage bisa saja diblokir browser; abaikan saja */
  }
  // Jika belum pernah memilih, ikuti pengaturan perangkat
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

applyTheme(getSavedTheme());

document.addEventListener("DOMContentLoaded", function () {
  setupThemeToggle();
  setupNavigation();
  setupGreeting();
  setupContactForm();
  setupYear();
});

function setupThemeToggle() {
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  var icon = button.querySelector(".theme-icon");
  var label = button.querySelector(".theme-label");

  function refreshButton() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    if (icon) icon.src = isDark ? "assets/icons/sun.svg" : "assets/icons/moon.svg";
    if (label) label.textContent = isDark ? "Mode terang" : "Mode gelap";
    button.setAttribute("aria-label", isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
  }

  button.addEventListener("click", function () {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      /* tidak apa-apa jika gagal menyimpan */
    }
    refreshButton();
  });

  refreshButton();
}

/* ---------- 2. NAVIGASI ---------- */
function setupNavigation() {
  // Ambil nama halaman dari URL, misalnya "about" dari "/about.html"
  function pageName(path) {
    var file = path.split("/").pop() || "index";
    return file.replace(/\.html$/, "") || "index";
  }

  var current = pageName(window.location.pathname);
  var links = document.querySelectorAll(".nav-link");

  links.forEach(function (link) {
    var target = pageName(link.getAttribute("href"));
    if (target === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Tombol menu untuk layar kecil
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- 3. TOMBOL SAPAAN (HOME) ---------- */
function setupGreeting() {
  var button = document.getElementById("greet-btn");
  var speech = document.getElementById("speech");
  var pet = document.getElementById("pet-img");
  var counter = document.getElementById("greet-count");
  if (!button || !speech || !pet) return;

  // Tiap hewan punya gambar dan beberapa kalimat sendiri
  var animals = [
    {
      src: "assets/images/cat.svg",
      alt: "Kucing pixel berwarna lavender",
      lines: [
        "Halo! Aku si kucing penjaga portofolio Insania. Selamat datang!",
        "Meow~ Insania suka merapikan dokumen sampai semuanya mudah dicari.",
        "Coba klik Experience di menu atas untuk melihat perjalanan organisasinya."
      ]
    },
    {
      src: "assets/images/bunny.svg",
      alt: "Kelinci pixel berwarna krem dengan telinga pink",
      lines: [
        "Hop hop! Aku kelinci. Insania memakai Excel untuk mengolah data, lho.",
        "Tahun ini Insania belajar Python, data, dan Gen AI. Rajin sekali, ya.",
        "Psst, coba tekan tombol Mode gelap di pojok kanan atas."
      ]
    },
    {
      src: "assets/images/bear.svg",
      alt: "Beruang pixel berwarna biru muda",
      lines: [
        "Grr... eh, halo! Aku beruang. Insania terbiasa bekerja dalam tim.",
        "Dia pernah mengelola surat, proposal, dan dokumentasi kegiatan.",
        "Mau kenal lebih jauh? Buka halaman About."
      ]
    }
  ];

  var clicks = 0;

  button.addEventListener("click", function () {
    var animal = animals[clicks % animals.length];
    var line = animal.lines[Math.floor(clicks / animals.length) % animal.lines.length];
    clicks += 1;

    // Kejutan kecil di sapaan ke-10
    if (clicks === 10) {
      line = "Sapaan ke-10! Terima kasih sudah mampir dan menyapa ya <3";
    }

    pet.src = animal.src;
    pet.alt = animal.alt;
    speech.textContent = line;
    if (counter) counter.textContent = "Sapaan ke-" + clicks;
    button.textContent = "Sapa lagi";
  });
}

/* ---------- 4. VALIDASI FORM KONTAK ---------- */
function setupContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  // Aturan tiap kolom: fungsi mengembalikan teks error, atau "" jika benar
  var rules = {
    name: function (value) {
      if (value.length === 0) return "Nama wajib diisi.";
      if (value.length < 2) return "Nama minimal 2 karakter.";
      return "";
    },
    email: function (value) {
      if (value.length === 0) return "Email wajib diisi.";
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!pattern.test(value)) return "Format email belum benar. Contoh: nama@email.com";
      return "";
    },
    message: function (value) {
      if (value.length === 0) return "Pesan wajib diisi.";
      if (value.length < 10) return "Pesan minimal 10 karakter.";
      if (value.length > 500) return "Pesan maksimal 500 karakter.";
      return "";
    }
  };

  function checkField(name) {
    var input = form.elements[name];
    var box = input.closest(".form-field");
    var errorEl = document.getElementById(name + "-error");
    var message = rules[name](input.value.trim());

    errorEl.textContent = message;
    box.classList.toggle("has-error", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
    return message === "";
  }

  function showStatus(text, type) {
    status.textContent = text;
    status.className = "form-status " + type;
    status.hidden = false;
  }

  // Periksa saat pengguna selesai mengisi kolom, dan hapus error saat mengetik ulang
  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener("blur", function () {
      checkField(name);
    });
    input.addEventListener("input", function () {
      if (input.closest(".form-field").classList.contains("has-error")) {
        checkField(name);
      }
    });
  });

  // Event utama: submit
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // cegah halaman memuat ulang

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var ok = checkField(name);
      if (!ok && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      showStatus("Ada kolom yang belum benar. Periksa pesan merah di bawah kolom.", "is-error");
      firstInvalid.focus();
      return;
    }

    // PENTING: pesan TIDAK dikirim ke mana pun.
    // Situs ini statis. Untuk benar-benar mengirim pesan dibutuhkan
    // backend atau layanan pihak ketiga (lihat README.md).
    showStatus(
      "Isi form sudah valid, tetapi pesan belum terkirim. Situs ini masih statis dan belum terhubung ke backend atau layanan pengiriman (misalnya Formspree atau EmailJS).",
      "is-info"
    );
  });
}

/* ---------- 5. TAHUN DI FOOTER ---------- */
function setupYear() {
  var el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
