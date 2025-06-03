
"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClientFormattedDateProps {
  date: Date | { seconds: number; nanoseconds: number } | undefined | null;
  formatString?: string;
}

const ClientFormattedDate: React.FC<ClientFormattedDateProps> = ({ date, formatString = 'MMM d, yyyy, h:mm a' }) => {
  const [formattedDate, setFormattedDate] = useState<string>(''); // Initialize with empty string or placeholder

  useEffect(() => {
    // This effect runs only on the client, after initial hydration
    if (date instanceof Date) {
      setFormattedDate(format(date, formatString));
    } else if (date && typeof date.seconds === 'number' && typeof date.nanoseconds === 'number') {
      // Handle Firestore Timestamp object if it wasn't converted to Date earlier
      setFormattedDate(format(new Date(date.seconds * 1000 + date.nanoseconds / 1000000), formatString));
    } else {
      setFormattedDate('Invalid Date');
    }
  }, [date, formatString]);

  // Render nothing or a placeholder on the server and during initial client render
  if (!formattedDate) {
    return null; // Or a placeholder like '...' or <Skeleton className="h-4 w-24" />
  }

  return <>{formattedDate}</>;
};
export default ClientFormattedDate;
