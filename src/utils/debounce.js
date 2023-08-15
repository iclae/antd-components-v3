export default function debounce(func, wait) {
  let timeout;
  return async function (...args) {
    clearTimeout(timeout);
    return new Promise(resolve => {
      timeout = setTimeout(() => {
        resolve(func(...args));
      }, wait);
    });
  };
}
