interface IResult<T> {
  value: T;
  isSuccess: boolean;
}

export function tryParseInt(str: string): IResult<number> {
  if (/^\w+$/.test(str)) {
    return { value: parseInt(str), isSuccess: true };
  } else {
    return { value: 0, isSuccess: false };
  }
}

export function sleep(timeout: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}
