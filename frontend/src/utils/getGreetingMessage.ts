export function getGreetingMessage() {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return "Good morning!";
  } else if (hours > 12 && hours < 18) {
    return "Good afternoon!";
  } else if (hours >= 18 && hours < 21) {
    return "Good evening!";
  } else {
    return "Good night!";
  }
}
