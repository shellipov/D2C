// значение или функция, которая вернёт значение
export type LambdaValue<TValue, TArgs = unknown> = TValue | ((args?: TArgs) => TValue);
