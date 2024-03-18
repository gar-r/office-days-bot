const agentApiBase = "http://localhost:23460"

const agentApiList = `${agentApiBase}/list`
const agentApiClear = `${agentApiBase}/clear`

export async function fetchDays() {
    try {
        const response = await fetch(agentApiList);
        return await response.json();
    } catch (e) {
        throw new Error(`error while fetching days from agent api: ${e}`);
    }
}

export async function clearDays() {
    try {
        await fetch(agentApiClear, {
            method: "POST"
        });
    } catch (e) {
        throw new Error(`error while clearing days on agent api: ${e}`);
    }
}