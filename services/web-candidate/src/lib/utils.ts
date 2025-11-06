import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parse } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (error) {
    return '';
  }
}

// Convert YYYY-MM-DD to dd/MM/yyyy for display
export function formatDateForInput(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  
  try {
    let date: Date;
    
    if (typeof dateString === 'string') {
      // If already in dd/MM/yyyy format, return as is
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString.trim())) {
        return dateString.trim();
      }
      // If in YYYY-MM-DD format, parse it
      if (/^\d{4}-\d{2}-\d{2}/.test(dateString.trim())) {
        // Extract just the date part (YYYY-MM-DD) if it's a full ISO string
        const datePart = dateString.trim().split('T')[0].split(' ')[0];
        date = parse(datePart, 'yyyy-MM-dd', new Date());
      } else {
        // Try parsing as ISO date string or any other format
        date = new Date(dateString);
      }
    } else {
      date = dateString;
    }
    
    // Check if date is valid
    if (date && !isNaN(date.getTime())) {
      const formatted = format(date, 'dd/MM/yyyy');
      return formatted;
    }
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
  }
  
  return '';
}

// Convert dd/MM/yyyy to YYYY-MM-DD for API
export function parseDateFromInput(dateString: string): string | null {
  if (!dateString || dateString.trim() === '') return null;
  try {
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Parse dd/MM/yyyy format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const date = parse(dateString, 'dd/MM/yyyy', new Date());
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd');
      }
    }
  } catch (error) {
    return null;
  }
  return null;
}

// Format date input as user types (dd/mm/yyyy)
export function formatDateInput(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Limit to 8 digits (ddmmyyyy)
  const limited = digits.slice(0, 8);
  
  // Format as dd/mm/yyyy
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

