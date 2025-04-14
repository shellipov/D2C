import { SettingsVars } from '../settings';

export async function suddenError (errorMessage?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const probabilityLevel = SettingsVars.errorProbability;

    if (!probabilityLevel) {
      resolve();

      return;
    }

    if (probabilityLevel < 1 || probabilityLevel > 10) {
      reject(new Error('Probability level must be between 1 and 10'));

      return;
    }

    const probability = probabilityLevel / 10;
    const randomValue = Math.random();

    if (randomValue < probability) {
      reject(new Error(errorMessage));
    } else {
      resolve();
    }
  });
}
