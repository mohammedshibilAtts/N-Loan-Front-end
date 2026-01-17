// commonFunctions.js

import { useState } from "react";

import numeral from 'numeral';

export const SaveSvg = "/assets/images/common/Save.svg"
  
// /**
//  * Formats a number as currency.
//  * @param number - The number to format.
//  * @returns Formatted currency string.
//  */
// export function fCurrency(number: number): string {
//   return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
// }

// /**
//  * Formats a number as a percentage.
//  * @param number - The number to format.
//  * @returns Formatted percentage string.
//  */
// export function fPercent(number: number): string {
//   return numeral(number / 100).format('0.0%');
// }

// /**
//  * Formats a number with default formatting.
//  * @param number - The number to format.
//  * @returns Formatted number string.
//  */
// export function fNumber(number: number): string {
//   return numeral(number).format();
// }

// /**
//  * Shortens a number with an abbreviation (e.g., 1.23M).
//  * @param number - The number to shorten.
//  * @returns Shortened number string.
//  */
// export function fShortenNumber(number: number): string {
//   return replace(numeral(number).format('0.00a'), '.00', '');
// }

// /**
//  * Formats a number as data size (e.g., 1.0 KB).
//  * @param number - The number to format.
//  * @returns Formatted data size string.
//  */
export function fData(number: number): string {
  return numeral(number).format('0.0 b');
}

// Hook for Mobile Number Validation
export const useMobileNumber = (maxLength = 10) => {
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    let newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    console.log(newValue);

    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    setValue(newValue);
  };

  return {
    value,
    keyDown: handleChange,
    maxLength,
    inputMode: "numeric",
    pattern: "[0-9]*",
  };
};

export const emptyToZero = (value: any) => {
  if (value === undefined || value === null || value === "" || typeof value === "string") {
    return 0.00;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.includes(",")) {
    return parseFloat(value.replace(/,/g, ""));
  }

  return isNaN(value) ? 0.00 : parseFloat(value);
};


// { value: 1234567.89, locale: "en-IN", currency: "INR" }
export const formatNumber = ({
  value,
  decimalPlaces = 2,
  locale = "en-IN",
  // locale = "en-US",
  // currency = null,
  currency = "INR",
  
}: any = {}) => {


  value = emptyToZero(value);
  

  const options:any = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };

  if (currency) {
    options.style = "currency";
    options.currency = currency;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDecimal = (value: any, decimalPlaces = 2) => {
  value = emptyToZero(value);
  return parseFloat(value).toFixed(decimalPlaces);
};

export const MobilePattern = (value: string): string | undefined => {
  if (/^\d+$/.test(value)) {
    return value;
  }
  return "Only numeric digits are allowed";
};

export const toNum = (value: any): number => {
  // Handle empty/undefined cases
  if (value === null || value === undefined || value === '') return 0;
  
  // Convert to string and remove leading zeros
  const strValue = String(value).replace(/^0+/, '') || '0';
  
  // Convert to number
  const num = Number(strValue);
  
  // Return 0 for NaN cases
  return isNaN(num) ? 0 : num;
};

export const formatJoinDate = (dateString:string)=>{
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}