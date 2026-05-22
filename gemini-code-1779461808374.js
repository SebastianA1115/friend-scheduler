// In a real app, this array would be replaced by a Firebase Database connection
let schedules = [];

const form = document.getElementById('schedule-form');
const scheduleList = document.getElementById('schedule-list');
const findHangoutBtn = document.getElementById('find-hangout');
const hangoutResults = document.getElementById('hangout-results');

// Handle adding a schedule
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    const details = document.getElementById('event-details').value;

    const newEntry = { name, date, status, details };
    schedules.push(newEntry);
    
    renderSchedules();
    form.reset();
});

// Display schedules on the screen
function renderSchedules() {
    scheduleList.innerHTML = '';
    
    // Sort by date
    schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

    schedules.forEach(entry => {
        const div = document.createElement('div');
        div.className = `entry ${entry.status}`;
        
        let detailText = entry.details ? ` (${entry.details})` : '';
        div.innerHTML = `<strong>${entry.name}</strong>: ${entry.date} - ${entry.status}${detailText}`;
        
        scheduleList.appendChild(div);
    });
}

// Logic to find common free days
findHangoutBtn.addEventListener('click', function() {
    if (schedules.length === 0) {
        hangoutResults.innerHTML = "No schedules added yet!";
        return;
    }

    // Group availability by date
    const dateMap = {};
    schedules.forEach(entry => {
        if (!dateMap[entry.date]) {
            dateMap[entry.date] = [];
        }
        dateMap[entry.date].push(entry);
    });

    let bestDays = [];

    // Check each date to see if people are free or have a half-day
    for (const [date, entries] of Object.entries(dateMap)) {
        // Find if anyone is strictly "Working" (which ruins the whole day)
        const someoneWorking = entries.some(e => e.status === 'Working');
        
        // If no one is working, it's a potential hangout day!
        if (!someoneWorking && entries.length > 1) { 
            bestDays.push(date);
        }
    }

    if (bestDays.length > 0) {
        hangoutResults.innerHTML = `🎉 Great days to hang out: ${bestDays.join(', ')}`;
    } else {
        hangoutResults.innerHTML = `😢 No perfect overlapping days found yet. Someone might need to take a day off!`;
    }
});