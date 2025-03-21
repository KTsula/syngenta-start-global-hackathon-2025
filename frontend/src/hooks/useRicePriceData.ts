import { useState, useEffect } from "react";

interface RicePrice {
  date: string;
  formattedDate: string;
  price: number;
  month: string;
}

/**
 * Hook to fetch and parse rice price data from the CSV file
 */
export const useRicePriceData = () => {
  const [priceData, setPriceData] = useState<RicePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/src/data/Rice_03_20_25-03_20_24.csv");
        const csvText = await response.text();

        // Parse CSV (skip header)
        const rows = csvText.split("\n").slice(1);
        const parsedData: RicePrice[] = [];

        for (const row of rows) {
          if (!row.trim()) continue;

          const columns = row.split(",");
          if (columns.length >= 6) {
            const dateStr = columns[5].trim();
            if (!dateStr) continue;

            // Parse date from MM/DD/YY format
            const dateParts = dateStr.split("/");
            if (dateParts.length !== 3) continue;

            const month = parseInt(dateParts[0]);
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);

            if (isNaN(month) || isNaN(day) || isNaN(year)) continue;

            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            // Use the Close price (column index 1)
            const price = parseFloat(columns[1]);
            if (isNaN(price) || price === 0) continue;

            // Use direct USD price instead of converting to INR
            parsedData.push({
              date: dateStr,
              formattedDate: `${day} ${monthNames[month - 1]} ${year}`,
              price: price,
              month: monthNames[month - 1],
            });
          }
        }

        // Sort by date (newest first)
        parsedData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setPriceData(parsedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading rice price data:", err);
        setError("Failed to load rice price data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { priceData, isLoading, error };
};
