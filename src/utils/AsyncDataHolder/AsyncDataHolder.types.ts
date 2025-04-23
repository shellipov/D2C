/**
 * Содержит только свойства состояния IAsyncDataHolder.
 */
export interface IAsyncStatusHolder<T = unknown, TError = Error> {
  readonly isFirstLoading: boolean;
  readonly isLoading: boolean;
  readonly data?: T;
  readonly error?: TError;
  // Есть данные либо ошибка. isLoading не имеет значения. Может быть true одновременно с isLoading.
  readonly isReady: boolean;
  // Данные заполнены, используется lodash/isEmpty
  readonly isFilled: boolean;
  // Состояние ошибки.
  readonly isError: boolean;
}

export interface IAsyncDataHolder<T = unknown, TError = Error> extends IAsyncStatusHolder<T, TError> {
  /**
   * - Задаёт значение isLoading
   * - 🔴 data не трогает
   * - 🔴 error не трогает
   * @param isLoading по-умолчанию true
   */
  setLoading(isLoading?: boolean): this;
  /**
   * - Задаёт значение data
   * - Сбрасывает isLoading в false
   * - Очищает error
   * @param data
   */
  setData(data?: T): this;
  /**
   * - Задаёт значение error
   * - Сбрасывает isLoading в false
   * - 🔴 data не трогает
   * @param error
   */
  setError(error?: TError): this;
  /**
   * - Задаёт значение isLoading = false
   * - Очищает data
   * - Очищает error
   * - isEmpty становится = true
   */
  setEmpty(): this;
}
