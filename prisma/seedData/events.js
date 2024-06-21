function generateEvents(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const events = [];
    let eventId = 1;

    const facilitators = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        // If the day is not Saturday (6) or Sunday (0)
        if (d.getDay() !== 6 && d.getDay() !== 0) {
            const dateStr = d.toISOString().split('T')[0];
            const randomFacilitator = facilitators[Math.floor(Math.random() * facilitators.length)];
            const event = {
                event_id: eventId,
                start_time: `${dateStr}T08:30:00`,
                end_time: `${dateStr}T14:30:00`,
                summary: `Open Lab (${dateStr})`,
                description: `Regular Open Lab session on ${dateStr}.`,
                facilitator: randomFacilitator,
            };
            events.push(event);
            eventId++;
        }
    }

    return events;
}
// Change the start and end dates to the desired range
const events = generateEvents("2024-06-18T08:30:00", "2024-07-31T08:30:00");


module.exports = events;
