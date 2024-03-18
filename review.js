import { Scale } from "./scale.js";

export const PromptValueOffice = 0;
export const PromptValueHome = 1;
export const PromptValueSkip = 2;

export const startUserReview = async (daysMap) => {
    const daysOrdered = sortDays(daysMap);
    const prompt = new Scale({
        message: 'Please review your office days:',
        scale: [
            { name: "O", message: "Office" },   // 0
            { name: "H", message: "Home" },     // 1
            { name: "S", message: "Skip" },     // 2
        ],
        choices: daysOrdered.map(day => ({
            name: day,
            message: day,
            initial: getInitialValue(daysMap, day),
        }))
    });
    return await prompt.run();
}

const sortDays = (daysMap) => {
    const daysOrdered = [];
    for (const day in daysMap) {
        daysOrdered.push(day);
    }
    daysOrdered.sort();
    return daysOrdered;
}

const getInitialValue = (daysMap, day) => {
    // return the prompt value for office/home, however we want
    // to skip weekends, unless office was logged on that day
    return daysMap[day]
        ? PromptValueOffice
        : isWeekend(day)
            ? PromptValueSkip
            : PromptValueOffice;
}

const isWeekend = (day) => {
    const y = Number(date.substring(0, 4));
    const m = Number(date.substring(4, 6));
    const d = Number(date.substring(6, 8));
    const date = new Date(y, m, d);
    const weekday = date.getDay();
    return weekday === 5 || weekday === 6;
}