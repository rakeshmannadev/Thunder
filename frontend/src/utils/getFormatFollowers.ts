export function formatFollowers(count:number) {
    if (count < 1000) {
      return count.toString(); // No abbreviation needed
    } else if (count >= 1000 && count < 1_000_000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
    } else if (count >= 1_000_000 && count < 1_000_000_000) {
      return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
    } else if (count >= 1_000_000_000 && count < 1_000_000_000_000) {
      return (count / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'; // Billions
    } else {
      return (count / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'; // Trillions
    }
  }
  