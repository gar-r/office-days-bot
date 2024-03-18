import { withProgress } from "./progress.js";
import { PromptValueHome, PromptValueOffice } from "./review.js";
import { Builder, Browser, By } from "selenium-webdriver";
import fs from "fs";


const cookiesFile = './cookies.json';
const loginUrl = "https://app.timetastic.co.uk/login/";
const calendarUrl = "https://app.timetastic.co.uk/calendar";
const wfo = "Work from the office";
const wfh = "Work from home";

export const automateFillout = async (choices) => {
    const driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    try {
        await withProgress("configuring web driver", async () => {
            await driver.manage().setTimeouts({ implicit: 2500 });
            await driver.manage().window().setRect(0, 0, 800, 600);
        });
        await withProgress("logging in", async () => {
            await performLogin(driver);
        });
        await withProgress("opening calendar", async () => {
            await openCalendar(driver);
        });
        await processChoices(driver, choices);
    } finally {
        await withProgress("quitting web driver", async () => {
            await driver.quit();
        });
    }
}


const performLogin = async (driver) => {

    const loadCookies = async (driver) => {
        if (fs.existsSync(cookiesFile)) {
            let cookiesString = fs.readFileSync(cookiesFile);
            let cookies = JSON.parse(cookiesString);
            for (let cookie of cookies) {
                try {
                    await driver.manage().addCookie(cookie);
                } catch (e) {
                    // skip this cookie
                }
            }
        }
    }

    const saveCookies = async (driver) => {
        let cookies = await driver.manage().getCookies();
        fs.writeFileSync(cookiesFile, JSON.stringify(cookies));
    }

    const isLoggedIn = async (driver) => {
        const title = await driver.getTitle();
        return title.indexOf("Timetastic") > -1 && title.indexOf("Sign In") == -1;
    }

    await driver.get(loginUrl);
    await loadCookies(driver);
    await driver.navigate().refresh();
    while (!await isLoggedIn(driver)) {  // wait for manual login
        await sleep(500);
    }
    await saveCookies(driver);
}

const processChoices = async (driver, choices) => {
    for (const date in choices) {
        try {
            const choice = choices[date];
            const msg = {
                progress: `${date}: processing`,
                succeed: `${date}: done`,
                fail: `${date}: $$e`
            };
            switch (choice) {
                case PromptValueOffice:
                    await withProgress(msg, async () => { await processDate(driver, date, wfo) });
                    break;
                case PromptValueHome:
                    await withProgress(msg, async () => { await processDate(driver, date, wfh) });
                    break;
            }
        } catch (e) {
            continue;
        }
    }
}

const processDate = async (driver, date, type) => {
    const openDate = async (driver, date) => {
        const y = Number(date.substring(0, 4))
        const m = Number(date.substring(4, 6))
        const d = Number(date.substring(6, 8))
        const monthElement = await driver.findElement(By.css(`table[data-year="${y}"][data-month="${m}"]`));
        const dayElements = await monthElement.findElements(By.css(`td.first.day`));
        for (let i = 0; i < dayElements.length; i++) {
            const dayElement = dayElements[i];
            const span = await dayElement.findElement(By.css("span"));
            const text = await span.getText();
            if (d == text) { // we compare a string to a number here
                await dayElement.click();
                await sleep(500);   // modal fade-in animation
                return;
            }
        }
        throw new Error(`not found, or already populated`);
    }

    const selectType = async (driver, type) => {
        const typeSelector = await driver.findElement(By.id("leavetype-select"));
        await typeSelector.click();
        const menu = await driver.findElement(By.className("leavetype__menu-list"));
        const leaveTypes = await menu.findElements(By.css("div.leavetype__option"));
        for (let i = 0; i < leaveTypes.length; i++) {
            const leaveTypeElement = leaveTypes[i];
            const span = await leaveTypeElement.findElement(By.css("span"));
            const text = await span.getText();
            if (type === text) {
                await span.click();
                return;
            }
        }
        throw new Error("leave type not found");
    }

    const submitDate = async (driver) => {
        // const submitButton = await driver.findElement(By.id("submit_holiday"));
        const submitButton = await driver.findElement(By.className("close-book"));
        await submitButton.click();
        await sleep(500);   // modal fade-out animation
    }

    await openDate(driver, date);
    try {
        await selectType(driver, type);
    } finally {
        await submitDate(driver);
    }
}

const openCalendar = async (driver) => {
    await driver.get(calendarUrl);
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}