import { clearDays, fetchDays } from "./agent.js";
import { startUserReview } from "./review.js";
import { automateFillout } from "./automation.js";

const days = await fetchDays();
const reviewedDays = await startUserReview(days);
await automateFillout(reviewedDays);
await clearDays();