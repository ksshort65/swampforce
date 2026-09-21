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
    label: "FRED — U.S. oil price (WTI, $ per barrel)",
    href: "https://fred.stlouisfed.org/series/DCOILWTICO",
  },
  {
    label: "OPEC — who sits at the table",
    href: "https://www.opec.org/opec_web/en/about_us/25.htm",
  },
  {
    label: "EIA — what is in a gallon",
    href: "https://www.eia.gov/energyexplained/gasoline/factors-affecting-prices.php",
  },
  {
    label: "EIA — gasoline pump components, monthly",
    href: "https://www.eia.gov/petroleum/gasdiesel/gaspump_hist.php",
  },
  {
    label: "EIA — state motor-fuel taxes, January 2026",
    href: "https://www.eia.gov/todayinenergy/detail.php?id=67165",
  },
  {
    label: "EIA STEO — world crude, OPEC+",
    href: "https://www.eia.gov/outlooks/steo/",
  },
];

export const PUMP_CHARTS = [
  {
    src: "/images/chart-pump-stack.jpg",
    title: "What is in a gallon — EIA",
  },
  {
    src: "/images/chart-pump-admins.jpg",
    title: "Highest week — last four administrations",
  },
  {
    src: "/images/chart-pump-years.jpg",
    title: "Highest week of each year, 2009–2026",
  },
];

/** EIA weekly retail. The number is the highest week in that Oval, not a four-year mean. */
export const ADMINS = [
  {
    who: "Obama",
    when: "2009–16",
    gas: 3.965,
    gasWhen: "week of May 9, 2011",
    diesel: 4.159,
    dieselWhen: "week of Feb. 25, 2013",
    wti: 113.03,
    wtiWhen: "May 2, 2011",
  },
  {
    who: "Trump 1",
    when: "2017–20",
    gas: 2.962,
    gasWhen: "week of May 28, 2018",
    diesel: 3.394,
    dieselWhen: "week of Oct. 15, 2018",
    wti: 77.41,
    wtiWhen: "June 27, 2018",
  },
  {
    who: "Biden",
    when: "2021–24",
    gas: 5.006,
    gasWhen: "week of June 13, 2022",
    diesel: 5.81,
    dieselWhen: "week of June 20, 2022",
    wti: 123.64,
    wtiWhen: "March 8, 2022",
  },
  {
    who: "Trump 2",
    when: "2025–26",
    gas: 4.5,
    gasWhen: "week of May 11, 2026",
    diesel: 6.285,
    dieselWhen: "week of Sept. 14, 2026",
    wti: 114.58,
    wtiWhen: "April 7, 2026",
  },
] as const;

export const MARKS = [
  {
    k: "Record regular gasoline",
    v: "June 13, 2022  ·  $5.006  ·  Biden",
    href: "https://fred.stlouisfed.org/series/GASREGW",
  },
  {
    k: "Biden diesel high",
    v: "June 20, 2022  ·  $5.810",
    href: "https://fred.stlouisfed.org/series/GASDESW",
  },
  {
    k: "Highest diesel in the series",
    v: "Sept. 14, 2026  ·  $6.285  ·  Trump 2",
    href: "https://fred.stlouisfed.org/series/GASDESW",
  },
  {
    k: "Latest week",
    v: "Sept. 14, 2026  ·  gasoline $4.319  ·  diesel $6.285",
    href: "https://www.eia.gov/petroleum/gasdiesel/",
  },
];

/** EIA Gasoline and Diesel Fuel Update, May 2026. Dollars of a $4.479 gallon. */
export const GALLON_STACK = {
  asOf: "May 2026",
  retail: "$4.479",
  href: "https://www.eia.gov/petroleum/gasdiesel/gaspump_hist.php",
  items: [
    { k: "Crude oil", pct: "51.9%", amt: "$2.33", note: "The barrel. OPEC, OPEC+, wars, and world demand set this number. A president does not." },
    { k: "Refining", pct: "21.7%", amt: "$0.97", note: "Turning black oil into gasoline. U.S. operable capacity: 18.4 million barrels a day as of January 1, 2025." },
    { k: "Distribution and marketing", pct: "14.8%", amt: "$0.66", note: "Pipeline to a terminal, ethanol blend, truck to the station, the rent and the labor at the pump." },
    { k: "Taxes", pct: "11.5%", amt: "$0.52", note: "Federal excise plus the state average. California is higher. Alaska is lower." },
  ],
};

export const OPEC_FILE = {
  k: "OPEC and OPEC+",
  v: "OPEC is the Organization of the Petroleum Exporting Countries — governments that sit on a large share of the world’s oil, including Saudi Arabia, Iraq, Iran, the United Arab Emirates, Kuwait, Venezuela, Nigeria, Algeria, Libya, and others. OPEC+ is that group plus Russia and additional producers who agreed, in 2022, to manage output together. They meet and decide how many barrels leave the ground. Fewer barrels raise the price of crude. More barrels lower it. EIA’s Short-Term Energy Outlook records OPEC+ crude production at 33.08 million barrels a day in the second quarter of 2025 and 26.22 million in the second quarter of 2026, after Middle East export routes were disrupted. That is the barrel. It is not a switch in the Oval.",
  href: "https://www.eia.gov/outlooks/steo/",
  opec: "https://www.opec.org/opec_web/en/about_us/25.htm",
};

export const TAX_FILE = {
  k: "Federal tax, state tax",
  v: "The federal gasoline tax is 18.4 cents a gallon and the federal diesel tax is 24.4 cents a gallon. Both have been unchanged since October 1993. On January 1, 2026, EIA counted state gasoline taxes and fees from 9.0 cents in Alaska to 70.9 cents in California, averaging 33.5 cents. Add the federal 18.4 and the national average tax take is about 52 cents a gallon. California’s combined federal-plus-state bill is about 89 cents. Alaska’s is about 27 cents. Same oil. Different legislatures.",
  href: "https://www.eia.gov/todayinenergy/detail.php?id=67165",
  rows: [
    { k: "Federal gasoline", amt: "18.4¢", note: "Unchanged since October 1993." },
    { k: "Federal diesel", amt: "24.4¢", note: "Unchanged since October 1993." },
    { k: "State average, Jan. 1, 2026", amt: "33.5¢", note: "EIA, taxes and fees on gasoline." },
    { k: "California", amt: "70.9¢", note: "Highest state gasoline tax and fees." },
    { k: "Alaska", amt: "9.0¢", note: "Lowest state gasoline tax and fees." },
  ],
};

export const RULES_FILE = {
  k: "Refining, shipping, and the state blend",
  v: "Crude becomes gasoline at a refinery. CRS, using EIA: 132 operable U.S. refineries, 18.4 million barrels a day of distillation capacity on January 1, 2025. Finished gasoline then moves by pipeline to terminals, is often blended with ethanol, and is trucked to stations. That is EIA’s “distribution and marketing.” Some states require reformulated gasoline (RFG) under the Clean Air Act. California requires its own CARB blend, which fewer refineries can make and which does not ship easily from the Gulf Coast. A unique recipe in a closed market is a higher gallon even when WTI is the same number everywhere.",
  href: "https://www.congress.gov/crs-product/IF13251",
  eia: "https://www.eia.gov/energyexplained/gasoline/factors-affecting-prices.php",
};
