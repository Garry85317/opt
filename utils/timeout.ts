const timer: Record<string | number, NodeJS.Timeout | null> = {};
export function debounce(fn: Function, delay = 500) {
  if (!fn.name) throw Error('Function must has name');
  timer[fn.name] = setTimeout(() => {});
  return (...args: unknown[]) => {
    if (timer[fn.name]) clearTimeout(timer[fn.name] as NodeJS.Timeout);
    timer[fn.name] = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function throttle(fn: Function, delay = 500) {
  if (!fn.name) throw Error('Function must has name');
  return (...args: unknown[]) => {
    if (timer[fn.name]) return;
    timer[fn.name] = setTimeout(() => {
      fn(...args);
      timer[fn.name] = null;
    }, delay);
  };
}
