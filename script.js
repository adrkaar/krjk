// Vent til hele siden er lastet inn
document.addEventListener('DOMContentLoaded', () => {

    // --- NY FUNKSJON FOR SNØFALL ---
    function createSnowfall() {
        const snowContainer = document.getElementById('snow-container');
        if (!snowContainer) return;
        const numberOfFlakes = 200; // Juster for mer/mindre snø

        for (let i = 0; i < numberOfFlakes; i++) {
            const flake = document.createElement('div');
            flake.classList.add('snowflake');

            const size = Math.random() * 15.5 + 1.5; // Størrelse mellom 1.5px og 5px
            flake.style.width = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left = `${Math.random() * 100}vw`;
            flake.style.opacity = Math.random() * 0.7 + 0.2; // Opacity mellom 0.2 og 0.9

            const duration = Math.random() * 7 + 8; // Varighet mellom 8s og 15s
            const delay = Math.random() * -10; // Negativ forsinkelse for å starte spredt
            flake.style.animation = `fall ${duration}s ${delay}s linear infinite`;

            snowContainer.appendChild(flake);
        }
    }

    // --- VIKTIG FOR TESTING ---
    // Setter dato til 10. desember for testing
    // const erIDesember = true;
    // const dagensDato = 24; // Late som det er 10. desember

    // --- EKTE KODE (brukes når du er ferdig med å teste): ---
    // Kommenter ut de to linjene over og fjern kommentar fra de tre under
    const naa = new Date();
    const erIDesember = naa.getMonth() === 11; // 11 = Desember (0-indeksert)
    const dagensDato = naa.getDate();
    // --------------------------------------------------------

    // Hent modal-elementene
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const alleLuker = document.querySelectorAll('.calendar-door');

    // Funksjon for å åpne modalen
    function openModal(title, body) {
        modalTitle.innerHTML = title;
        modalBody.innerHTML = body;
        modalOverlay.classList.add('is-open');
        shootGifts(); // Start gave-animasjonen
    }

    // Funksjon for å lukke modalen
    function closeModal() {
        modalOverlay.classList.remove('is-open');
    }

    // Legg til lyttere for å lukke modalen
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        // Lukk bare hvis man klikker på bakgrunnen, ikke på selve boksen
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // --- NY FUNKSJON FOR GAVE-ANIMASJON ---
    function shootGifts() {
        const giftEmojis = ['🎁', '🎀', '🎉', '✨', '🎄'];
        const numberOfGifts = 100; // Antall gaver som skal "skytes ut"

        for (let i = 0; i < numberOfGifts; i++) {
            const gift = document.createElement('div');
            gift.classList.add('christmas-gift');

            // Velg en tilfeldig emoji
            gift.textContent = giftEmojis[Math.floor(Math.random() * giftEmojis.length)];

            // Tilfeldige verdier for animasjonen
            const randomX = (Math.random() - 0.5) * window.innerWidth * 1.2;
            const randomY = (Math.random() - 0.5) * window.innerHeight * 1.2;
            const randomRot = (Math.random() - 0.5) * 720; // Tilfeldig rotasjon
            const randomDuration = Math.random() * 1 + 1; // Varighet mellom 1s og 2s
            const randomDelay = Math.random() * 0.2; // Liten forsinkelse

            // Sett CSS custom properties for animasjonen
            gift.style.setProperty('--tx', `${randomX}px`);
            gift.style.setProperty('--ty', `${randomY}px`);
            gift.style.setProperty('--rot', `${randomRot}deg`);
            gift.style.setProperty('--duration', `${randomDuration}s`);
            gift.style.setProperty('--delay', `${randomDelay}s`);

            document.body.appendChild(gift);

            // Fjern elementet etter at animasjonen er ferdig for å rydde opp
            setTimeout(() => {
                gift.remove();
            }, (randomDuration + randomDelay) * 1000);
        }
    }

    // Start snøanimasjonen
    createSnowfall();

    const storageKey = 'kristineJulekalenderOpened';
    const openedDoors = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Gå gjennom hver luke
    alleLuker.forEach(luke => {
        const lukeDag = parseInt(luke.dataset.day, 10);
        const doorBack = luke.querySelector('.door-back');
        const lukeTitle = doorBack.querySelector('h2')?.innerHTML || '';
        // Samle alt innhold i luken (unntatt tittelen) for å vise i modalen
        const bodyElements = Array.from(doorBack.children).filter(child => child.tagName !== 'H2');
        const lukeBody = bodyElements.map(el => el.outerHTML).join('');

        // 1. Bruk lagret data for å markere luker som åpnet
        if (openedDoors.includes(lukeDag)) {
            luke.classList.add('is-opened');
        }

        // 2. Sjekk om luken skal være låst (frem i tid)
        if (!erIDesember || lukeDag > dagensDato) {
            luke.classList.add('is-locked');
            return; // Ikke legg til klikk-lytter på låste luker
        }

        // 3. Legg til klikk-lytter for alle åpne luker
        luke.addEventListener('click', () => {
            openModal(lukeTitle, lukeBody);

            // Merk som "sett" og lagre fremgangen hvis den ikke allerede er åpnet
            if (!openedDoors.includes(lukeDag)) {
                luke.classList.add('is-opened');
                openedDoors.push(lukeDag);
                localStorage.setItem(storageKey, JSON.stringify(openedDoors));
            }
        });
    });
});

