document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
    const modal = document.getElementById("eventModal");
    const closeModal = document.querySelector(".close");

    const eventTitle = document.getElementById("eventTitle");
    const eventContainer = document.getElementById("eventDescription");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = [];

    const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

    function formatDateForCompare(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    async function fetchEvents() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/eventi");
            events = await response.json();
            renderCalendar(currentMonth, currentYear);
        } catch (err) {
            console.error("Errore nel caricamento degli eventi:", err);
        }
    }

    function renderCalendar(month, year) {
        calendar.innerHTML = "";

        // 1. RIGA GIORNI DELLA SETTIMANA
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement("div");
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = "600";
            dayHeader.style.padding = "10px 0";
            calendar.appendChild(dayHeader);
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lun=0

        monthYear.textContent = firstDay.toLocaleString("it-IT", { month: "long", year: "numeric" });

        // 2. Celle del mese precedente
        for (let i = startDay - 1; i >= 0; i--) {
            const cell = document.createElement("div");
            cell.textContent = prevMonthLastDay - i;
            cell.classList.add("prev-month-day");
            calendar.appendChild(cell);
        }

        // 3. Giorni del mese corrente
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDateForCompare(date);
            const cell = document.createElement("div");
            cell.textContent = day;

            // Evidenzia oggi
            if (dateStr === formatDateForCompare(new Date())) {
                cell.classList.add("today");
            }

            // Evidenzia giorni con eventi
            const dayEvents = events.filter(e => formatDateForCompare(e.data) === dateStr);
            if (dayEvents.length > 0) {
                cell.classList.add("event-day");
                cell.addEventListener("click", () => showEvents(dayEvents));
            }

            calendar.appendChild(cell);
        }

        // 4. Completa l’ultima riga con giorni del mese successivo
        const totalCells = startDay + lastDay.getDate();
        const nextDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= nextDays; i++) {
            const cell = document.createElement("div");
            cell.textContent = i;
            cell.classList.add("next-month-day");
            calendar.appendChild(cell);
        }
    }

    function showEvents(dayEvents) {
        eventTitle.textContent = `Eventi del giorno: ${dayEvents[0].data}`;
        eventContainer.innerHTML = "";

        dayEvents.forEach(event => {
            const box = document.createElement("div");
            box.classList.add("event-box");

            const title = document.createElement("h3");
            title.textContent = event.titolo;

            const date = document.createElement("p");
            date.textContent = `Data: ${event.data}`;

            const time = document.createElement("p");
            time.textContent = `Orario: ${event.ora}`;

            const desc = document.createElement("p");
            desc.textContent = event.descrizione;

            box.appendChild(title);
            box.appendChild(date);
            box.appendChild(time);
            box.appendChild(desc);

            eventContainer.appendChild(box);
        });

        modal.style.display = "block";
    }

    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target == modal) modal.style.display = "none"; });

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }a
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    fetchEvents();
});
