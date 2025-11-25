export const generateChartData = (days) => {
    const data = [];
    let cumulative = 0;
    const today = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Random logic to make it look real (weekends lower, etc.)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const base = isWeekend ? 15000 : 45000;
        const noise = Math.random() * 20000;
        const dailyValue = Math.floor(base + noise);

        cumulative += dailyValue;

        data.push({
            date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            daily: dailyValue,
            cumulative: cumulative
        });
    }
    return data;
};
