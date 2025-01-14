const Console: Partial<Console> = {};

const consoleMethods = Object.keys(console).filter((key) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (console as any)[key] === 'function';
});

consoleMethods.forEach((method) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Console as any)[method] = (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (console as any)[method](...args);
    }
  };
});

export { Console };
