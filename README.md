# Office Days Bot

This is the automated time-sheet filler component, using the data collected by [office-days-agent](https://git.okki.hu/garrichs/office-days-agent.git).

## Installation

You can run the application from the command line, using node.

Install the dependencies:

```
cd office-days-bot
npm install
```

Launch the application:

```
node main.js
```

## How does it work?

The application uses [Selenium](https://www.selenium.dev/) to create an automated Firefox browser instance.
The step-by-step process is the following:

   1. Query the office-days data from the agent api
   2. Log in to Timetastic when not logged in, or when the cookies expired (_this is a manual step_)
   3. Start a review process, where you can manually modify each date before starting the automation. You can select Office/Home/Skip for each date.
   4. Open the Timetastic Calendar.
   5. For each date that is not skipped:
      1. if unfilled, click the date
      2. select the presence type (Office/Home)
      3. submit the date
   6. Close Timetastic

The summary will be printed on the console.

## FAQ

### How can I use the bot without running the agent?

The bot obtains the office-days data by querying the agent API (`http://localhost:23460/`).
You may completely replace the agent with your own implementation, if you implement the following APIs:

   * `/list`: return a json document with the days data
   * `/clear`: clears the days data after it has been processed

Check the agent API for more information: https://git.okki.hu/garrichs/office-days-agent.git.