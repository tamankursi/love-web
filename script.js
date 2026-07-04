document.addEventListener("DOMContentLoaded", () => {
    // 1. Injeksi Tema
    document.documentElement.style.setProperty('--primary-color', CONFIG.theme.primary);
    document.documentElement.style.setProperty('--secondary-color', CONFIG.theme.secondary);
    document.documentElement.style.setProperty('--bg-color', CONFIG.theme.background);
    document.documentElement.style.setProperty('--text-color', CONFIG.theme.text);

    // 2. Buat Ornamen Melayang
    const ornamentsContainer = document.getElementById("ornamentsContainer");
    const createOrnament = () => {
        const span = document.createElement("span");
        span.className = "ornament";
        const randomOrnament = CONFIG.ornaments[Math.floor(Math.random() * CONFIG.ornaments.length)];
        span.innerText = randomOrnament;
        
        // Randomize position, size, and duration
        span.style.left = Math.random() * 100 + "vw";
        span.style.fontSize = (Math.random() * 2 + 1) + "rem";
        span.style.animationDuration = (Math.random() * 10 + 10) + "s"; // 10s to 20s
        span.style.animationDelay = (Math.random() * 5) + "s";
        
        ornamentsContainer.appendChild(span);

        // Remove after animation finishes to prevent DOM overload
        setTimeout(() => {
            span.remove();
        }, 25000);
    };

    // Spawn initial ornaments
    for (let i = 0; i < 15; i++) {
        createOrnament();
    }
    // Spawn continuously
    setInterval(createOrnament, 2000);

    // 3. Injeksi Konten
    // Home
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

    // 4. Logika Navigasi
    const homeSection = document.getElementById("homeSection");
    const mainContent = document.getElementById("mainContent");
    const backBtn = document.getElementById("backBtn");
    
    document.getElementById("startBtn").addEventListener("click", () => {
        homeSection.classList.add("hidden");
        mainContent.classList.remove("hidden");
        backBtn.classList.remove("hidden");
        
        // Scroll ke atas setelah masuk
        window.scrollTo(0, 0);
        
        // Trigger observer untuk elemen di mainContent
        setTimeout(observeElements, 100);
    });

    backBtn.addEventListener("click", () => {
        mainContent.classList.add("hidden");
        homeSection.classList.remove("hidden");
        backBtn.classList.add("hidden");
        
        // Reset state pertanyaan
        document.getElementById("responseCard").classList.add("hidden");
        
        window.scrollTo(0, 0);
    });

    // 5. Logika Pertanyaan
    const showResponse = (text) => {
        const responseCard = document.getElementById("responseCard");
        document.getElementById("responseText").innerText = text;
        responseCard.classList.remove("hidden");
        
        // Scroll slightly so the response is visible
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

    // 6. Scroll Animation Observer
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".fade-in").forEach(el => {
            // Remove visible class first so it can trigger again
            el.classList.remove("visible"); 
            observer.observe(el);
        });
    };
    
    // Initial observe for home section
    observeElements();
});
