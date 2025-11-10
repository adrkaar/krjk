// Vent til hele siden er lastet inn
document.addEventListener('DOMContentLoaded', () => {

    // --- VIKTIG FOR TESTING ---
    // Setter dato til 10. desember for testing
    const erIDesember = true;
    const dagensDato = 1; // Late som det er 10. desember

    // --- EKTE KODE (brukes når du er ferdig med å teste): ---
    // Kommenter ut de to linjene over og fjern kommentar fra de tre under
    // const naa = new Date();
    // const erIDesember = naa.getMonth() === 11; // 11 = Desember (0-indeksert)
    // const dagensDato = naa.getDate();
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


    // Gå gjennom hver luke
    alleLuker.forEach(luke => {
        const lukeDag = parseInt(luke.dataset.day);

        // Hent innholdet fra den skjulte .door-back
        const doorBack = luke.querySelector('.door-back');
        const lukeTitle = doorBack.querySelector('h2').innerHTML;
        const lukeBody = doorBack.querySelector('p').innerHTML;

        // Sjekk om luken skal være låst
        if (!erIDesember || lukeDag > dagensDato) {
            luke.classList.add('is-locked');
        } else {
            // Denne luken kan åpnes

            // Merk luker fra fortiden som "sett"
            if (lukeDag < dagensDato) {
                luke.classList.add('is-opened');
            }

            // Legg til klikk-lytter
            luke.addEventListener('click', () => {
                // Åpne modalen med riktig innhold
                openModal(lukeTitle, lukeBody);

                // Merk luken som "sett"
                luke.classList.add('is-opened');
            });
        }
    });
});