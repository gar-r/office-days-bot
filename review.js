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
    return daysMap[day] ? PromptValueOffice : PromptValueHome;
}