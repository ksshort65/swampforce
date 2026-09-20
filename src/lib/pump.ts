/** EIA weekly retail via FRED. Calendar years sit with the Oval that held most of the year. 2026 is year-to-date. */

export const PUMP_UPDATED = "2026-09-20";

export const PUMP_SOURCES = [
  {
    label: "EIA — weekly gasoline and diesel",
    href: "https://www.eia.gov/petroleum/gasdiesel/",
  },
  {
    label: "EIA — U.S. regular gasoline annual",
    href: "https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_a.htm",
  },
  {
    label: "FRED GASREGW — EIA regular gasoline",
    href: "https://fred.stlouisfed.org/series/GASREGW",
  },
  {
    label: "FRED GASDESW — EIA on-highway diesel",
    href: "https://fred.stlouisfed.org/series/GASDESW",
  },
  {
    label: "FRED DCOILWTICO — EIA WTI crude",
    href: "https://fred.stlouisfed.org/series/DCOILWTICO",
  },
];

export const PUMP_CHARTS = [
  {
    src: "/images/chart-pump-admins.jpg",
    title: "Pump prices — last four administrations",
  },
  {
    src: "/images/chart-pump-years.jpg",
    title: "Regular gasoline by year, 2009–2026",
  },
];

/** Dollars per gallon. Weekly EIA averages. 2026 through mid-September. */
export const ADMINS = [
  {
    who: "Obama",
    when: "2009–16",
    gas: 2.96,
    diesel: 3.25,
    wti: 77,
  },
  {
    who: "Trump 1",
    when: "2017–20",
    gas: 2.48,
    diesel: 2.86,
    wti: 53,
  },
  {
    who: "Biden",
    when: "2021–24",
    gas: 3.45,
    diesel: 4.06,
    wti: 79,
  },
  {
    who: "Trump 2",
    when: "2025–26 YTD",
    gas: 3.44,
    diesel: 4.30,
    wti: 75,
  },
] as const;

export const MARKS = [
  { k: "Cheapest full year", v: "2016  ·  $2.14 gasoline", href: "https://fred.stlouisfed.org/series/GASREGW" },
  { k: "Virus crash", v: "2020  ·  $2.17 gasoline  ·  $39 WTI", href: "https://fred.stlouisfed.org/series/DCOILWTICO" },
  { k: "Peak gallon", v: "2022  ·  $3.95 gasoline  ·  $4.99 diesel", href: "https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_a.htm" },
  { k: "Last full year", v: "2025  ·  $3.10 gasoline  ·  $3.66 diesel", href: "https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_a.htm" },
];
