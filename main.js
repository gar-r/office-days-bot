import { clearDays, fetchDays } from "./agent.js";
import { startUserReview } from "./review.js";
import { automateFillout } from "./automation.js";

// const days = {
//     "20240103": true,
//     "20240101": false,
//     "20240102": false,
//     "20240104": true,
// }
const days = await fetchDays();
const reviewedDays = await startUserReview(days);
await automateFillout(reviewedDays);
// await clearDays();