import { useEffect, useState } from 'react';
import { api } from './api';

/**
 * Every option both wizards offer, fetched once per session.
 *
 * The server owns this list because the server validates against it — if the
 * UI invented its own options, a reader could pick something the API would
 * reject. The fallback below exists only so the marketing pages still render
 * their sign grid when the API is unreachable; the wizards wait for the real
 * catalog before letting anything be submitted.
 */

export const FALLBACK_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', dates: '21 Mar – 19 Apr' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', dates: '20 Apr – 20 May' },
  { name: 'Gemini', symbol: '♊', element: 'Air', dates: '21 May – 20 Jun' },
  { name: 'Cancer', symbol: '♋', element: 'Water', dates: '21 Jun – 22 Jul' },
  { name: 'Leo', symbol: '♌', element: 'Fire', dates: '23 Jul – 22 Aug' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', dates: '23 Aug – 22 Sep' },
  { name: 'Libra', symbol: '♎', element: 'Air', dates: '23 Sep – 22 Oct' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', dates: '23 Oct – 21 Nov' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: '22 Nov – 21 Dec' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', dates: '22 Dec – 19 Jan' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', dates: '20 Jan – 18 Feb' },
  { name: 'Pisces', symbol: '♓', element: 'Water', dates: '19 Feb – 20 Mar' },
];

let cache = null;
let inFlight = null;

function formatDateRange(range) {
  if (!range) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const { start, end } = range;
  return `${start.day} ${months[start.month - 1]} – ${end.day} ${months[end.month - 1]}`;
}

async function loadCatalog() {
  if (cache) return cache;
  if (!inFlight) {
    inFlight = api
      .getCatalog()
      .then((response) => {
        const data = response.data;
        cache = {
          ...data,
          zodiacSigns: data.zodiacSigns.map((sign) => ({
            ...sign,
            dates: formatDateRange(sign.dateRange),
          })),
        };
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function useCatalog() {
  const [state, setState] = useState(() => ({
    catalog: cache,
    loading: !cache,
    error: null,
  }));

  useEffect(() => {
    if (cache) return undefined;
    let active = true;

    loadCatalog()
      .then((catalog) => {
        if (active) setState({ catalog, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ catalog: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

/** Signs for display on marketing pages, with a static fallback. */
export function useSigns() {
  const { catalog } = useCatalog();
  return catalog?.zodiacSigns?.length ? catalog.zodiacSigns : FALLBACK_SIGNS;
}
