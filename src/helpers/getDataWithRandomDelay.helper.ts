export function getDataWithRandomDelay<T> (data: T): Promise<T> {
  const delay = Math.random() * 400 + 100; // от 100 до 500 мс

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
