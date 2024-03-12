import { fetchDays } from "./agent.js";
import { startUserReview } from "./review.js";

//const data = await fetchDays();
const days = {
    "20240103": true,
    "20240101": false,
    "20240102": false,
    "20240104": true,
}

const res = await startUserReview(days);
console.log(res);