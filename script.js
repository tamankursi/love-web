document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil nama klien dari URL Parameter (misal: ?to=ifa)
    const urlParams = new URLSearchParams(window.location.search);
    let clientId = urlParams.get('to');
    
    // Jika URL tidak memiliki parameter ?to=, gunakan 'ifa' sebagai default
    if (!clientId) {
        clientId = "ifa";
    }

    // Elemen Loading
    const loadingScreen = document.getElementById("loadingScreen");
    const loadingError = document.getElementById("loadingError");

    // 2. Fetch data klien dari file JSON
    fetch(`clients/${clientId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Data klien tidak ditemukan");
            }
            return response.json();
        })
        .then(CONFIG => {
            // Sembunyikan loading screen
            loadingScreen.style.display = "none";
            
            // Jalankan seluruh logika web menggunakan data CONFIG yang didapat
            initWeb(CONFIG);
        })
        .catch(error => {
            console.error("Error loading config:", error);
            // Tampilkan pesan error di layar
            loadingError.innerHTML = `Maaf, data untuk <b>"${clientId}"</b> tidak ditemukan!<br><br>Pastikan link yang kamu buka sudah benar.`;
            loadingError.style.display = "block";
        });

    // 3. Fungsi Utama Web (Berjalan setelah data didownload)
    function initWeb(CONFIG) {
        // Injeksi Tema
        document.documentElement.style.setProperty('--primary-color', CONFIG.theme.primary);
        document.documentElement.style.setProperty('--secondary-color', CONFIG.theme.secondary);
        document.documentElement.style.setProperty('--bg-color', CONFIG.theme.background);
        document.documentElement.style.setProperty('--text-color', CONFIG.theme.text);

        // Buat Ornamen Melayang
        const ornamentsContainer = document.getElementById("ornamentsContainer");
        const createOrnament = () => {
            const span = document.createElement("span");
            span.className = "ornament";
            const randomOrnament = CONFIG.ornaments[Math.floor(Math.random() * CONFIG.ornaments.length)];
            span.innerText = randomOrnament;
            
            span.style.left = Math.random() * 100 + "vw";
            span.style.fontSize = (Math.random() * 2 + 1) + "rem";
            span.style.animationDuration = (Math.random() * 10 + 10) + "s";
            span.style.animationDelay = (Math.random() * 5) + "s";
            
            ornamentsContainer.appendChild(span);

            setTimeout(() => {
                span.remove();
            }, 25000);
        };

        for (let i = 0; i < 15; i++) {
            createOrnament();
        }
        setInterval(createOrnament, 2000);

        // Injeksi Konten Home
        document.getElementById("heroTitle").innerText = CONFIG.hero.title;
        document.getElementById("startBtn").innerText = CONFIG.hero.buttonText;

        // Music
        document.getElementById("musicText").innerText = CONFIG.music.text;
        const playerContainer = document.getElementById("playerContainer");
        if (CONFIG.music.audioUrl && CONFIG.music.audioUrl.trim() !== "") {
            playerContainer.innerHTML = `<audio controls style="width: 100%; border-radius: 12px; outline: none;">
                                            <source src="${CONFIG.music.audioUrl}" type="audio/mpeg">
                                            Browser kamu tidak mendukung pemutar audio.
                                         </audio>`;
        } else if (CONFIG.music.spotifyId && CONFIG.music.spotifyId.trim() !== "") {
            playerContainer.innerHTML = `<iframe style="border-radius:12px" 
                                            src="https://open.spotify.com/embed/track/${CONFIG.music.spotifyId}?utm_source=generator&theme=0" 
                                            width="100%" height="152" frameBorder="0" allowfullscreen="" 
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                                         </iframe>`;
        }

        // Gallery
        const galleryContainer = document.getElementById("galleryContainer");
        CONFIG.gallery.images.forEach(imgUrl => {
            const img = document.createElement("img");
            img.src = imgUrl;
            img.className = "gallery-img";
            galleryContainer.appendChild(img);
        });
        document.getElementById("galleryMessage").innerText = CONFIG.gallery.message;

        // Question
        document.getElementById("questionText").innerText = CONFIG.question.text;
        document.getElementById("btnYes").innerText = CONFIG.question.btnYes;
        document.getElementById("btnNo").innerText = CONFIG.question.btnNo;

        // Footer
        document.getElementById("footerTitle").innerText = CONFIG.footer.title;
        const footerLongMessage = document.getElementById("footerLongMessage");
        CONFIG.footer.longMessage.forEach(paragraph => {
            const p = document.createElement("p");
            p.innerText = paragraph;
            footerLongMessage.appendChild(p);
        });

        // Logika Navigasi
        const homeSection = document.getElementById("homeSection");
        const mainContent = document.getElementById("mainContent");
        const backBtn = document.getElementById("backBtn");
        
        document.getElementById("startBtn").addEventListener("click", () => {
            homeSection.classList.add("hidden");
            mainContent.classList.remove("hidden");
            backBtn.classList.remove("hidden");
            window.scrollTo(0, 0);
            setTimeout(observeElements, 100);
        });

        backBtn.addEventListener("click", () => {
            mainContent.classList.add("hidden");
            homeSection.classList.remove("hidden");
            backBtn.classList.add("hidden");
            document.getElementById("responseCard").classList.add("hidden");
            window.scrollTo(0, 0);
        });

        // Logika Pertanyaan
        const showResponse = (text) => {
            const responseCard = document.getElementById("responseCard");
            document.getElementById("responseText").innerText = text;
            responseCard.classList.remove("hidden");
            setTimeout(() => {
                responseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        };

        document.getElementById("btnYes").addEventListener("click", () => {
            showResponse(CONFIG.question.responseYes);
        });

        document.getElementById("btnNo").addEventListener("click", () => {
            showResponse(CONFIG.question.responseNo);
        });

        // Scroll Animation Observer
        const observeElements = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll(".fade-in").forEach(el => {
                el.classList.remove("visible"); 
                observer.observe(el);
            });
        };
        
        observeElements();
    }
});
