import { ZODIAC_SIGNS, getZodiacSignByName } from '../constants/zodiac.js';

export class ZodiacService {
  /**
   * Derive Western Tropical Sun sign from month (1-12) and day (1-31).
   */
  static deriveSignFromDate(dateInput) {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    // Use UTC to prevent timezone shifts across days
    const month = date.getUTCMonth() + 1; // 1 to 12
    const day = date.getUTCDate(); // 1 to 31

    for (const sign of ZODIAC_SIGNS) {
      const { start, end } = sign.dateRange;

      if (start.month === end.month) {
        if (month === start.month && day >= start.day && day <= end.day) {
          return sign;
        }
      } else if (start.month > end.month) {
        // Year wrap-around (e.g. Capricorn: Dec 22 to Jan 19)
        if (
          (month === start.month && day >= start.day) ||
          (month === end.month && day <= end.day)
        ) {
          return sign;
        }
      } else {
        // Standard range across consecutive months
        if (
          (month === start.month && day >= start.day) ||
          (month === end.month && day <= end.day)
        ) {
          return sign;
        }
      }
    }

    return null;
  }

  /**
   * Validates date and selected zodiac sign, checking for consistency or mismatch.
   */
  static validateSignAlignment({ dateOfBirth, selectedZodiacSign, inputMode = 'manual_symbolic_choice' }) {
    let derivedSignObj = null;
    let derivedSignName = null;

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        const err = new Error('Invalid date of birth provided.');
        err.code = 'VALIDATION_ERROR';
        err.isCustomError = true;
        err.statusCode = 400;
        throw err;
      }
      if (dob > new Date()) {
        const err = new Error('Date of birth cannot be in the celestial future.');
        err.code = 'VALIDATION_ERROR';
        err.isCustomError = true;
        err.statusCode = 400;
        throw err;
      }
      derivedSignObj = this.deriveSignFromDate(dateOfBirth);
      derivedSignName = derivedSignObj ? derivedSignObj.name : null;
    }

    const selectedSignObj = getZodiacSignByName(selectedZodiacSign);
    if (!selectedSignObj && !derivedSignObj) {
      const err = new Error('Please select a valid zodiac sign or enter your date of birth.');
      err.code = 'VALIDATION_ERROR';
      err.isCustomError = true;
      err.statusCode = 400;
      throw err;
    }

    // Determine final effective sign based on inputMode
    let finalSignName = selectedSignObj ? selectedSignObj.name : derivedSignName;
    if (inputMode === 'derived_from_date' && derivedSignName) {
      finalSignName = derivedSignName;
    }

    const isConsistent = !derivedSignName || !selectedSignObj || derivedSignName === selectedSignObj.name;

    let message = 'Your celestial signature is aligned.';
    if (!isConsistent && inputMode === 'manual_symbolic_choice') {
      message = `Your selected sign (${selectedZodiacSign}) differs from the date-derived Western Sun sign (${derivedSignName}). You can keep it as a symbolic choice or switch to your derived sign.`;
    } else if (!isConsistent && inputMode === 'derived_from_date') {
      message = `Based on your birth date, your Western Sun sign is ${derivedSignName}.`;
    }

    const effectiveSignObj = getZodiacSignByName(finalSignName);

    return {
      isConsistent,
      derivedSign: derivedSignName,
      selectedSign: selectedZodiacSign || derivedSignName,
      effectiveSign: finalSignName,
      inputMode,
      message,
      zodiacData: effectiveSignObj,
    };
  }
}
