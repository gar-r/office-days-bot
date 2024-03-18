import ora from "ora";

const progress = ora();

export const withProgress = async (msg, fn) => {
    try {
        progress.start(msg.progress || msg);
        await fn();
        progress.succeed(msg.succeed || null);
    } catch (e) {
        progress.fail(msg.fail ? msg.fail.replace("$$e", e.message || "") : null);
        throw e;
    }
}
