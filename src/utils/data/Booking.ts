export function generateBookingId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "#";
  for (let i = 0; i < 10; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function getTomorrowDateTime() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const day = d.getDate();
  const month = d.toLocaleString("en-IN", { month: "long" });
  return `${day} ${month} ${d.getFullYear()}, 11:00 AM`;
}