import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = resolve(__dirname, '../public/mock');

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data));
}

function generateEnvTimeseries(days = 3, intervalMinutes = 1) {
  const points = [];
  const now = Date.now();
  const total = (days * 24 * 60) / intervalMinutes;
  for (let i = total; i >= 0; i--) {
    const ts = now - i * intervalMinutes * 60 * 1000;
    const hour = new Date(ts).getHours();
    const tempBase = 15 + 10 * Math.sin((2 * Math.PI * hour) / 24);
    const humidityBase = 55 + 20 * Math.cos((2 * Math.PI * hour) / 24);
    points.push({
      ts,
      temperatureC: +(tempBase + rand(-2, 2)).toFixed(2),
      humidityPct: +(humidityBase + rand(-5, 5)).toFixed(2),
      windSpeedMs: +rand(0, 12).toFixed(2),
      solarIrradiance: +Math.max(0, 900 * Math.sin((Math.PI * hour) / 24) + rand(-50, 50)).toFixed(0),
      pressureHpa: +rand(990, 1025).toFixed(1),
    });
  }
  return points;
}

function generateSoilMoistureGrid(cols = 100, rows = 100) {
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({ x, y, moisturePct: +rand(10, 45).toFixed(2), ec: +rand(0.5, 3.5).toFixed(2) });
    }
  }
  return { cols, rows, cells };
}

function generateIrrigationDevices(count = 500) {
  const devices = [];
  for (let i = 0; i < count; i++) {
    const id = `IRR-${String(i + 1).padStart(4, '0')}`;
    const status = pick(['online', 'offline', 'maintenance']);
    const flowLpm = status === 'online' ? +rand(5, 60).toFixed(2) : 0;
    const pressureBar = status === 'online' ? +rand(1.5, 3.5).toFixed(2) : 0;
    devices.push({ id, status, fieldId: randInt(1, 120), flowLpm, pressureBar, lastActiveTs: Date.now() - randInt(0, 6) * 3600 * 1000 });
  }
  return devices;
}

function generatePestAlerts(count = 2000) {
  const levels = ['info', 'warning', 'critical'];
  const types = ['aphid', 'leaf_miner', 'cutworm', 'armyworm', 'mite'];
  const alerts = [];
  for (let i = 0; i < count; i++) {
    const level = pick(levels);
    const type = pick(types);
    const ts = Date.now() - randInt(0, 14 * 24 * 3600) * 1000;
    alerts.push({ id: `AL-${i + 1}`, level, type, fieldId: randInt(1, 120), probability: +rand(0.5, 0.99).toFixed(2), ts });
  }
  alerts.sort((a, b) => a.ts - b.ts);
  return alerts;
}

function generateYieldStats(yearDays = 365) {
  const crops = ['wheat', 'corn', 'soy', 'rice', 'tomato'];
  const start = Date.now() - yearDays * 24 * 3600 * 1000;
  const series = [];
  for (let d = 0; d < yearDays; d++) {
    const ts = start + d * 24 * 3600 * 1000;
    const daily = crops.map((crop) => ({ crop, ts, tonnage: +rand(5, 60).toFixed(2) }));
    series.push(...daily);
  }
  return { crops, series };
}

function generateLogistics(count = 500) {
  const cities = [
    'Beijing','Shanghai','Guangzhou','Shenzhen','Chengdu','Wuhan','Hangzhou','Xi\'an','Nanjing','Tianjin',
    'Qingdao','Jinan','Zhengzhou','Changsha','Xiamen','Fuzhou','Shenyang','Harbin','Dalian','Nanning'
  ];
  const routes = [];
  for (let i = 0; i < count; i++) {
    const from = pick(cities);
    let to = pick(cities);
    while (to === from) to = pick(cities);
    routes.push({ id: `LG-${i + 1}`, from, to, etaHours: randInt(2, 72), loadTons: +rand(1, 30).toFixed(1), status: pick(['in_transit','arrived','delayed']) });
  }
  return routes;
}

function main() {
  ensureDir(outDir);

  const meta = { generatedAt: new Date().toISOString(), note: 'Mock data for Smart Agriculture Dashboard (ECharts)' };
  writeJson(resolve(outDir, 'metadata.json'), meta);

  const env = generateEnvTimeseries(3, 1);
  writeJson(resolve(outDir, 'env_timeseries.json'), env);

  const soil = generateSoilMoistureGrid(100, 100);
  writeJson(resolve(outDir, 'soil_moisture.json'), soil);

  const irr = generateIrrigationDevices(500);
  writeJson(resolve(outDir, 'irrigation_devices.json'), irr);

  const pest = generatePestAlerts(2000);
  writeJson(resolve(outDir, 'pest_alerts.json'), pest);

  const yieldStats = generateYieldStats(365);
  writeJson(resolve(outDir, 'yield_stats.json'), yieldStats);

  const logistics = generateLogistics(500);
  writeJson(resolve(outDir, 'logistics.json'), logistics);

  // Index file to list all mock endpoints
  const index = {
    env: 'mock/env_timeseries.json',
    soil: 'mock/soil_moisture.json',
    irrigation: 'mock/irrigation_devices.json',
    pest: 'mock/pest_alerts.json',
    yield: 'mock/yield_stats.json',
    logistics: 'mock/logistics.json',
    metadata: 'mock/metadata.json',
  };
  writeJson(resolve(outDir, 'index.json'), index);
}

main();


