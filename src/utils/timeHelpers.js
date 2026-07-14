// utils/timeHelpers.js

export function parseTimeStringToDate(timeStr) {
    const [time, meridian] = timeStr.split(" "); // "9:15 AM" -> ["9:15", "AM"]
    let [hours, minutes] = time.split(":").map(Number);

    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0; // 12:00 AM -> 0 hours

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
}