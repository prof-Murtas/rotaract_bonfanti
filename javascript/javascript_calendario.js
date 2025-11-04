document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
    const modal = document.getElementById("eventModal");
    const closeModal = document.querySelector(".close");

    const eventTitle = document.getElementById("eventTitle");
    const eventContainer = document.getElementById("eventDescription"); // useremo solo questo per tutti gli eventi

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = [];

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
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        monthYear.textContent = firstDay.toLocaleString("it-IT", { month: "long", year: "numeric" });

        for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
            calendar.appendChild(document.createElement("div"));
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDateForCompare(date);
            const cell = document.createElement("div");
            cell.textContent = day;

            if (dateStr === formatDateForCompare(new Date())) {
                cell.classList.add("today");
            }

            const dayEvents = events.filter(e => formatDateForCompare(e.data) === dateStr);
            if (dayEvents.length > 0) {
                cell.classList.add("event-day");
                cell.addEventListener("click", () => showEvents(dayEvents));
            }

            calendar.appendChild(cell);
        }
    }

    function showEvents(dayEvents) {
        // Titolo modal
        eventTitle.textContent = `Eventi del giorno: ${dayEvents[0].data}`;

        // Pulisce contenuto precedente
        eventContainer.innerHTML = "";

        // Genera box per ogni evento
        dayEvents.forEach((event, index) => {
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
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    fetchEvents();
});
