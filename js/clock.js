export function updateClock(clockElement, bool) {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  if (bool) {
    hours = hours % 12 || 12; // Converts to 12-hour format
  }
  
  const timeString = `${hours}:${minutes}:${seconds}`;
  clockElement.textContent = timeString;
}
