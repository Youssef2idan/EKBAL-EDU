document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    const timetable = document.getElementById('timetable');
    const currentWeekSpan = document.getElementById('currentWeek');
    
    // Sample schedule data (in a real app, this would come from a backend)
    const scheduleData = {
        // Each class has their own schedule
        "2-C": {
            Monday: [
                { time: "8:00 - 8:45", subject: "Mathematics", room: "Room 201" },
                { time: "8:50 - 9:35", subject: "English", room: "Room 202" },
                // Add more periods...
            ],
            Tuesday: [
                { time: "8:00 - 8:45", subject: "Science", room: "Lab 101" },
                { time: "8:50 - 9:35", subject: "History", room: "Room 203" },
                // Add more periods...
            ],
            // Add more days...
        }
    };

    function updateWeekDisplay() {
        const options = { month: 'long', day: 'numeric' };
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        currentWeekSpan.textContent = `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
    }

    function getWeekStart(date) {
        const newDate = new Date(date);
        const day = newDate.getDay();
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
        newDate.setDate(diff);
        return newDate;
    }

    function renderSchedule() {
        // Clear existing schedule
        timetable.innerHTML = '';
        
        // Get user's class (this would normally come from user data)
        const userClass = "2-C";
        const schedule = scheduleData[userClass];
        
        // Create schedule for each day
        const weekStart = getWeekStart(currentDate);
        
        for (let i = 0; i < 5; i++) { // Monday to Friday
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            
            const dayName = currentDay.toLocaleDateString('en-US', { weekday: 'long' });
            const daySchedule = schedule[dayName] || [];
            
            const dayElement = createDayElement(dayName, currentDay, daySchedule);
            timetable.appendChild(dayElement);
        }
    }

    function createDayElement(dayName, date, schedule) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-schedule';
        
        const header = document.createElement('div');
        header.className = 'day-header';
        header.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        `;
        
        const periods = document.createElement('div');
        periods.className = 'periods';
        
        schedule.forEach(period => {
            const periodElement = document.createElement('div');
            periodElement.className = 'period';
            periodElement.innerHTML = `
                <span class="period-time">${period.time}</span>
                <span class="period-subject">${period.subject}</span>
                <span class="period-room">${period.room}</span>
            `;
            periods.appendChild(periodElement);
        });
        
        dayDiv.appendChild(header);
        dayDiv.appendChild(periods);
        return dayDiv;
    }

    // Event Listeners
    document.querySelector('.prev-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekDisplay();
        renderSchedule();
    });

    document.querySelector('.next-week').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekDisplay();
        renderSchedule();
    });

    // Initialize
    updateWeekDisplay();
    renderSchedule();
}); 