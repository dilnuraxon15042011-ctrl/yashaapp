// WHO height-for-age percentiles (boys and girls), simplified to standard reference points.

export type PercentilePoint = { p5: number; p15: number; p50: number; p85: number; p95: number };

export const WHO_BOYS: Record<number, PercentilePoint> = {
  0:   { p5: 46.1, p15: 47.5, p50: 49.9, p85: 52.3, p95: 53.7 },
  6:   { p5: 63.3, p15: 64.8, p50: 67.6, p85: 70.4, p95: 71.9 },
  12:  { p5: 71.0, p15: 72.8, p50: 75.7, p85: 78.6, p95: 80.5 },
  18:  { p5: 76.0, p15: 78.0, p50: 81.7, p85: 85.4, p95: 87.7 },
  24:  { p5: 81.0, p15: 83.2, p50: 87.1, p85: 91.0, p95: 93.4 },
  36:  { p5: 89.0, p15: 91.4, p50: 96.1, p85: 100.9, p95: 103.5 },
  48:  { p5: 96.1, p15: 98.9, p50: 103.3, p85: 107.7, p95: 110.3 },
  60:  { p5: 102.0, p15: 105.0, p50: 110.0, p85: 115.0, p95: 117.5 },
  72:  { p5: 107.0, p15: 110.2, p50: 116.0, p85: 121.8, p95: 124.5 },
  96:  { p5: 117.0, p15: 120.6, p50: 127.3, p85: 134.0, p95: 137.2 },
  120: { p5: 126.0, p15: 130.0, p50: 137.5, p85: 145.0, p95: 148.5 },
  144: { p5: 134.5, p15: 138.7, p50: 147.0, p85: 155.3, p95: 159.0 },
  168: { p5: 143.0, p15: 148.0, p50: 158.0, p85: 168.0, p95: 172.0 },
  192: { p5: 156.0, p15: 161.0, p50: 169.0, p85: 177.0, p95: 181.0 },
  216: { p5: 163.0, p15: 167.5, p50: 174.5, p85: 181.5, p95: 185.0 },
};

export const WHO_GIRLS: Record<number, PercentilePoint> = {
  0:   { p5: 45.4, p15: 46.8, p50: 49.1, p85: 51.4, p95: 52.9 },
  6:   { p5: 61.2, p15: 62.7, p50: 65.7, p85: 68.7, p95: 70.2 },
  12:  { p5: 68.9, p15: 70.7, p50: 74.0, p85: 77.3, p95: 79.2 },
  18:  { p5: 74.0, p15: 76.0, p50: 79.7, p85: 83.4, p95: 85.7 },
  24:  { p5: 79.3, p15: 81.5, p50: 85.7, p85: 89.9, p95: 92.5 },
  36:  { p5: 87.4, p15: 89.8, p50: 95.1, p85: 100.4, p95: 103.1 },
  48:  { p5: 94.1, p15: 96.9, p50: 102.7, p85: 108.5, p95: 111.3 },
  60:  { p5: 100.0, p15: 103.0, p50: 109.4, p85: 115.7, p95: 118.5 },
  72:  { p5: 105.3, p15: 108.7, p50: 115.1, p85: 121.5, p95: 124.5 },
  96:  { p5: 116.0, p15: 120.0, p50: 127.0, p85: 134.0, p95: 137.5 },
  120: { p5: 126.0, p15: 131.0, p50: 138.6, p85: 146.2, p95: 150.0 },
  144: { p5: 137.0, p15: 142.0, p50: 149.8, p85: 157.6, p95: 161.5 },
  168: { p5: 145.0, p15: 150.0, p50: 157.0, p85: 164.0, p95: 167.5 },
  192: { p5: 147.0, p15: 151.5, p50: 158.0, p85: 164.5, p95: 168.0 },
  216: { p5: 148.0, p15: 152.5, p50: 159.0, p85: 165.5, p95: 169.0 },
};

export function getChartData(sex: "male" | "female") {
  const src = sex === "male" ? WHO_BOYS : WHO_GIRLS;
  return Object.entries(src)
    .map(([m, v]) => ({ ageM: +m, ageY: +(+m / 12).toFixed(1), ...v }))
    .sort((a, b) => a.ageM - b.ageM);
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function interpolate(sex: "male" | "female", ageM: number): PercentilePoint {
  const src = sex === "male" ? WHO_BOYS : WHO_GIRLS;
  const keys = Object.keys(src).map(Number).sort((a, b) => a - b);
  if (ageM <= keys[0]) return src[keys[0]];
  if (ageM >= keys[keys.length - 1]) return src[keys[keys.length - 1]];
  let lo = keys[0], hi = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (ageM >= keys[i] && ageM <= keys[i + 1]) { lo = keys[i]; hi = keys[i + 1]; break; }
  }
  const t = (ageM - lo) / (hi - lo);
  const a = src[lo], b = src[hi];
  return { p5: lerp(a.p5, b.p5, t), p15: lerp(a.p15, b.p15, t), p50: lerp(a.p50, b.p50, t), p85: lerp(a.p85, b.p85, t), p95: lerp(a.p95, b.p95, t) };
}

/** Approximate percentile of a child's height given age in months, using piecewise linear over the 5 reference percentiles. */
export function estimatePercentile(sex: "male" | "female", ageM: number, heightCm: number): number {
  const p = interpolate(sex, ageM);
  const xs = [p.p5, p.p15, p.p50, p.p85, p.p95];
  const ys = [5, 15, 50, 85, 95];
  if (heightCm <= xs[0]) return Math.max(1, Math.round((heightCm / xs[0]) * 5));
  if (heightCm >= xs[xs.length - 1]) return 99;
  for (let i = 0; i < xs.length - 1; i++) {
    if (heightCm >= xs[i] && heightCm <= xs[i + 1]) {
      const t = (heightCm - xs[i]) / (xs[i + 1] - xs[i]);
      return Math.round(lerp(ys[i], ys[i + 1], t));
    }
  }
  return 50;
}

export function bmiCategory(bmi: number): "underweight" | "healthy" | "overweight" | "obese" {
  if (bmi < 14) return "underweight";
  if (bmi < 18.5) return "healthy";
  if (bmi < 25) return "overweight";
  return "obese";
}

export type GrowthEntry = { date: string; height: number; weight: number };
