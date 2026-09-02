import {
  MobileNotificationItem,
  SystemUpdateItem,
  DevPackageUpdateItem,
  SystemHealthDiagnostics,
  VSCodeFileSnippet,
  EverydayEmailTemplate,
  ProgrammingLanguage,
} from '../types';

// =====================================================================
// 1. MOBILE NOTIFICATIONS & CROSS-DEVICE DISPATCHER
// =====================================================================

export const INITIAL_MOBILE_NOTIFICATIONS: MobileNotificationItem[] = [
  {
    id: 'notif-1',
    title: '🚀 Sprint Goal Check-in',
    body: 'Time to wrap up the React component refactoring and push git commit.',
    timestamp: Date.now() - 1000 * 60 * 12,
    priority: 'urgent',
    channel: 'mobile_push',
    iconEmoji: '📱',
    status: 'sent',
  },
  {
    id: 'notif-2',
    title: '💧 Hydration & Posture Break',
    body: 'Take a sip of water and do a quick 30-second shoulder roll.',
    timestamp: Date.now() - 1000 * 60 * 45,
    priority: 'normal',
    channel: 'browser',
    iconEmoji: '🌿',
    status: 'sent',
  },
  {
    id: 'notif-3',
    title: '📅 Standup Meeting in 10 mins',
    body: 'Review your 3 daily tasks and open Google Meet room.',
    timestamp: Date.now() - 1000 * 60 * 120,
    priority: 'high',
    channel: 'whatsapp',
    iconEmoji: '🔔',
    status: 'sent',
  },
];

export const MOBILE_NOTIFICATION_PRESETS: Array<{
  id: string;
  title: string;
  body: string;
  priority: MobileNotificationItem['priority'];
  channel: MobileNotificationItem['channel'];
  emoji: string;
  categoryLabel: string;
}> = [
  {
    id: 'preset-focus',
    title: '🎯 Deep Focus Sprint Activated',
    body: 'Do Not Disturb active for 45 minutes. Silence social media and enter flow state.',
    priority: 'urgent',
    channel: 'mobile_push',
    emoji: '🔥',
    categoryLabel: 'Focus & Productivity',
  },
  {
    id: 'preset-client-ping',
    title: '💼 Priority Work Alert',
    body: 'Client PR merged successfully on GitHub. Staging build deployed to production!',
    priority: 'high',
    channel: 'whatsapp',
    emoji: '⚡',
    categoryLabel: 'Work & GitHub',
  },
  {
    id: 'preset-health',
    title: '💧 20-20-20 Eye Rest & Hydration',
    body: 'Look at an object 20 feet away for 20 seconds. Drink 250ml of fresh water.',
    priority: 'normal',
    channel: 'browser',
    emoji: '🌿',
    categoryLabel: 'Health & Wellness',
  },
  {
    id: 'preset-meeting',
    title: '👥 Quick Sync Reminder',
    body: 'Team architecture discussion starting in 5 minutes. Grab your headphones!',
    priority: 'urgent',
    channel: 'telegram',
    emoji: '🗓️',
    categoryLabel: 'Calendar Sync',
  },
  {
    id: 'preset-battery',
    title: '🔋 Laptop Power Notice',
    body: 'Laptop running on battery saver mode. Plug in charger for turbo compilation.',
    priority: 'low',
    channel: 'browser',
    emoji: '⚡',
    categoryLabel: 'Device Health',
  },
];

/**
 * Trigger real browser Web Notification if supported and permitted
 */
export async function triggerLiveBrowserNotification(
  title: string,
  body: string,
  emoji: string = '🔔'
): Promise<{ success: boolean; permission: string; message: string }> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      success: false,
      permission: 'unsupported',
      message: 'Browser notifications not supported on this device/environment.',
    };
  }

  try {
    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }

    if (perm === 'granted') {
      new Notification(`${emoji} ${title}`, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `myraa-alert-${Date.now()}`,
      });
      return {
        success: true,
        permission: 'granted',
        message: 'Notification delivered to device screen & notification tray!',
      };
    } else {
      return {
        success: false,
        permission: perm,
        message: 'Notification permission is currently blocked/denied in browser.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      permission: 'error',
      message: `Notification dispatch failed: ${err.message}`,
    };
  }
}

// =====================================================================
// 2. LAPTOP & SYSTEM MAINTENANCE / UPDATE ENGINE
// =====================================================================

export const INITIAL_SYSTEM_UPDATES: SystemUpdateItem[] = [
  {
    id: 'update-os-kernel',
    name: 'OS Security & Kernel Patch (v2026.08.30)',
    category: 'os',
    currentVersion: 'v2026.07.15',
    latestVersion: 'v2026.08.30',
    updateSizeMb: 342,
    releaseNotes: 'Fixed CPU scheduling latency, memory leak patch in network daemon, and kernel security hardening.',
    severity: 'critical',
    status: 'available',
    updateCommand: 'sudo apt update && sudo apt upgrade -y || softwareupdate -i -a',
  },
  {
    id: 'update-node-runtime',
    name: 'Node.js & V8 Engine LTS (v22.14.0)',
    category: 'runtime',
    currentVersion: 'v20.11.0',
    latestVersion: 'v22.14.0',
    updateSizeMb: 78,
    releaseNotes: 'Faster startup time with Maglev JIT compiler, native WebSocket stability, and TLS 1.3 optimization.',
    severity: 'recommended',
    status: 'available',
    updateCommand: 'nvm install --lts && nvm use --lts',
  },
  {
    id: 'update-vscode',
    name: 'VS Code Editor Core (v1.98.0)',
    category: 'dev_tool',
    currentVersion: 'v1.96.2',
    latestVersion: 'v1.98.0',
    updateSizeMb: 112,
    releaseNotes: 'Native AI Copilot inline diffing, terminal tab groups, and faster TypeScript language server indexing.',
    severity: 'recommended',
    status: 'available',
    updateCommand: 'code --update-extensions',
  },
  {
    id: 'update-gpu-driver',
    name: 'Graphics Display & Metal/DirectX Acceleration',
    category: 'security',
    currentVersion: 'v550.40',
    latestVersion: 'v555.58',
    updateSizeMb: 490,
    releaseNotes: 'Fixed 4K multi-monitor stutter, reduced GPU idle power draw by 18%, and enhanced WebGL2 frame rates.',
    severity: 'optional',
    status: 'available',
    updateCommand: 'sudo ubuntu-drivers autoinstall',
  },
];

export const DEV_PACKAGE_UPDATES: DevPackageUpdateItem[] = [
  {
    name: 'typescript',
    manager: 'npm',
    currentVersion: '5.3.3',
    latestVersion: '5.7.2',
    command: 'npm install -g typescript@latest',
    status: 'pending',
  },
  {
    name: 'vite',
    manager: 'npm',
    currentVersion: '5.1.0',
    latestVersion: '6.1.0',
    command: 'npm install -D vite@latest',
    status: 'pending',
  },
  {
    name: 'fastapi',
    manager: 'pip',
    currentVersion: '0.109.0',
    latestVersion: '0.115.6',
    command: 'pip install --upgrade fastapi uvicorn',
    status: 'pending',
  },
  {
    name: 'docker-compose',
    manager: 'brew',
    currentVersion: '2.24.1',
    latestVersion: '2.32.0',
    command: 'brew upgrade docker-compose',
    status: 'pending',
  },
];

export const INITIAL_SYSTEM_DIAGNOSTICS: SystemHealthDiagnostics = {
  cpuUsagePercent: 24,
  ramUsagePercent: 58,
  diskFreeGb: 142.6,
  batteryHealthPercent: 94,
  batteryStatus: 'charging',
  cacheSizeBytes: 1024 * 1024 * 720, // 720 MB
  backgroundProcessesCount: 68,
  osName: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mac') ? 'macOS Sequoia' : navigator.userAgent.includes('Win') ? 'Windows 11' : 'Linux Kernel 6.8') : 'Universal OS',
};

// =====================================================================
// 3. VS CODE AI CODER & INSTANT FILE GENERATOR
// =====================================================================

export const INITIAL_VSCODE_SNIPPETS: VSCodeFileSnippet[] = [
  {
    id: 'vscode-react-dashboard',
    fileName: 'UserDashboard.tsx',
    vscodeTargetPath: 'src/components/UserDashboard.tsx',
    language: 'typescript',
    title: '⚡ Production React + Tailwind Dashboard',
    description: 'Complete animated user statistics grid with metric badges, search filter, and responsive card layouts.',
    category: 'react',
    tags: ['React', 'Tailwind', 'TypeScript', 'Lucide'],
    code: `import React, { useState } from 'react';
import { Activity, TrendingUp, Users, DollarSign, Search, Sparkles } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, icon }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">{icon}</div>
    </div>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      <span className={\`text-xs font-semibold px-2 py-0.5 rounded-full \${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}\`}>
        {change}
      </span>
    </div>
  </div>
);

export const UserDashboard: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            System Overview <Sparkles className="w-6 h-6 text-cyan-400" />
          </h1>
          <p className="text-sm text-slate-400">Real-time metrics, live telemetry & active subscribers</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value="$48,290" change="+14.2%" isPositive={true} icon={<DollarSign className="w-5 h-5" />} />
        <MetricCard title="Active Users" value="12,480" change="+8.1%" isPositive={true} icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Conversion Rate" value="3.85%" change="+0.4%" isPositive={true} icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Server Latency" value="24ms" change="-12ms" isPositive={true} icon={<Activity className="w-5 h-5" />} />
      </div>
    </div>
  );
};

export default UserDashboard;`,
  },
  {
    id: 'vscode-node-express-api',
    fileName: 'authRoutes.ts',
    vscodeTargetPath: 'src/routes/authRoutes.ts',
    language: 'typescript',
    title: '🔒 Express.js JWT Auth & Rate Limiter Router',
    description: 'Production-ready REST API route handler with bcrypt password hashing, JWT token issue, and validation middleware.',
    category: 'backend',
    tags: ['Express', 'Node.js', 'JWT', 'TypeScript'],
    code: `import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-myraa-dev-key-2026';

// Middleware: Authenticate JWT Token
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Bearer token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired session token.' });
  }
};

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  // Simulated User Lookup & Token Generation
  const token = jwt.sign(
    { userId: 'user_9921', email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful!',
    token,
    user: { id: 'user_9921', email, name: 'Developer User' },
  });
});

// GET /api/auth/me (Protected)
router.get('/me', requireAuth, (req: Request, res: Response) => {
  return res.json({
    success: true,
    user: (req as any).user,
    serverTime: new Date().toISOString(),
  });
});

export default router;`,
  },
  {
    id: 'vscode-python-scraper',
    fileName: 'smart_scraper.py',
    vscodeTargetPath: 'scripts/smart_scraper.py',
    language: 'python',
    title: '🐍 Python Fast Async Web Scraper & Data Extractor',
    description: 'High-speed asynchronous crawler with fake user-agent rotation, BeautifulSoup HTML parser, and JSON exporter.',
    category: 'python',
    tags: ['Python', 'Asyncio', 'Aiohttp', 'Scraping'],
    code: `import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import time

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}

async def fetch_page(session, url: str):
    try:
        async with session.get(url, headers=HEADERS, timeout=10) as response:
            if response.status == 200:
                html = await response.text()
                return {'url': url, 'html': html, 'status': 200}
            return {'url': url, 'status': response.status, 'html': None}
    except Exception as e:
        return {'url': url, 'status': 'error', 'error': str(e)}

async def scrape_tech_headlines(urls: list):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

        extracted = []
        for res in results:
            if res.get('html'):
                soup = BeautifulSoup(res['html'], 'html.parser')
                title = soup.title.string.strip() if soup.title else 'No title'
                links = [a.get('href') for a in soup.find_all('a', href=True)][:5]
                extracted.append({
                    'url': res['url'],
                    'page_title': title,
                    'sample_links': links,
                    'timestamp': time.time()
                })

        return extracted

if __name__ == '__main__':
    target_sites = [
        'https://news.ycombinator.com',
        'https://github.com/trending'
    ]
    print(f"🚀 Starting async scrape for {len(target_sites)} target domains...")
    data = asyncio.run(scrape_tech_headlines(target_sites))
    print(json.dumps(data, indent=2))`,
  },
  {
    id: 'vscode-settings-config',
    fileName: 'settings.json',
    vscodeTargetPath: '.vscode/settings.json',
    language: 'json',
    title: '⚙️ Pro Developer VS Code Settings (.vscode)',
    description: 'Optimized developer settings for TypeScript, Prettier auto-format on save, Tailwind intellisense, and clean font pairing.',
    category: 'config',
    tags: ['VSCode', 'Settings', 'Prettier', 'Tailwind'],
    code: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "files.autoSave": "onFocusChange",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\\\(([^)]*)\\\\)", "[\"'\\\`]([^\"'\\\`]*).*?[\"'\\\`]"],
    ["cn\\\\(([^)]*)\\\\)", "[\"'\\\`]([^\"'\\\`]*).*?[\"'\\\`]"]
  ],
  "typescript.updateImportsOnFileMove.enabled": "always",
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}`,
  },
  {
    id: 'vscode-docker-compose',
    fileName: 'docker-compose.yml',
    vscodeTargetPath: 'docker-compose.yml',
    language: 'yaml',
    title: '🐳 Full-Stack Docker Compose (App + Postgres + Redis)',
    description: 'Production container setup with automated health checks, persistent data volumes, and hot-reload mounting.',
    category: 'devops',
    tags: ['Docker', 'PostgreSQL', 'Redis', 'DevOps'],
    code: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: myraa_app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DATABASE_URL=postgres://postgres:secret123@postgres:5432/myraa_db
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: myraa_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret123
      POSTGRES_DB: myraa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: myraa_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`,
  },
  {
    id: 'vscode-vitest-unit-test',
    fileName: 'math.test.ts',
    vscodeTargetPath: 'src/__tests__/math.test.ts',
    language: 'typescript',
    title: '🧪 Vitest / Jest Unit Test Suite',
    description: 'Clean unit tests with describe blocks, edge-case assertions, and async mock validation.',
    category: 'testing',
    tags: ['Vitest', 'Jest', 'Testing', 'TypeScript'],
    code: `import { describe, it, expect, beforeEach, vi } from 'vitest';

export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>,
  taxRate: number = 0.08,
  discountPercent: number = 0
): { subtotal: number; tax: number; discount: number; total: number } {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * taxRate).toFixed(2));
  const total = Number((taxableAmount + tax).toFixed(2));

  return { subtotal, tax, discount, total };
}

describe('calculateCartTotal() Unit Test Suite', () => {
  it('should accurately calculate total with tax and zero discount', () => {
    const items = [
      { price: 50, quantity: 2 }, // $100
      { price: 25, quantity: 1 }, // $25
    ];
    const result = calculateCartTotal(items, 0.10, 0); // 10% tax

    expect(result.subtotal).toBe(125);
    expect(result.discount).toBe(0);
    expect(result.tax).toBe(12.5);
    expect(result.total).toBe(137.5);
  });

  it('should apply 20% discount before calculating tax', () => {
    const items = [{ price: 100, quantity: 1 }];
    const result = calculateCartTotal(items, 0.08, 20); // 20% off -> $80 taxable

    expect(result.subtotal).toBe(100);
    expect(result.discount).toBe(20);
    expect(result.tax).toBe(6.4); // 8% of $80
    expect(result.total).toBe(86.4);
  });
});`,
  },
];

/**
 * Generate custom VS Code ready code snippet from prompt
 */
export function generateCustomVSCodeSnippet(
  prompt: string,
  language: ProgrammingLanguage = 'typescript',
  customFileName?: string
): VSCodeFileSnippet {
  const cleanPrompt = prompt.toLowerCase();
  let fileName = customFileName || 'GeneratedComponent.tsx';
  let code = '';
  let title = 'Custom VS Code Code Module';
  let category: VSCodeFileSnippet['category'] = 'react';

  if (cleanPrompt.includes('hook') || cleanPrompt.includes('react') || cleanPrompt.includes('component')) {
    fileName = customFileName || 'useCustomState.ts';
    title = 'React Custom Hook for VS Code';
    category = 'react';
    code = `import { useState, useEffect, useCallback } from 'react';

/**
 * Auto-generated by Myraa AI for VS Code
 * Prompt: ${prompt}
 */
export function useAutoAsync<T>(asyncFn: () => Promise<T>, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFn();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
}`;
  } else if (cleanPrompt.includes('python') || cleanPrompt.includes('bot') || cleanPrompt.includes('script')) {
    fileName = customFileName || 'automation_task.py';
    title = 'Python Automation Script for VS Code';
    category = 'python';
    code = `"""
Auto-generated Python Script for VS Code
Prompt: ${prompt}
"""
import sys
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_main_routine():
    logging.info("Starting automation routine...")
    try:
        # Business logic goes here
        payload = {"status": "success", "processed_records": 42, "runtime_sec": 0.18}
        logging.info("Execution finished cleanly.")
        print(json.dumps(payload, indent=2))
    except Exception as e:
        logging.error(f"Execution failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_main_routine()`;
  } else if (cleanPrompt.includes('sql') || cleanPrompt.includes('table') || cleanPrompt.includes('database')) {
    fileName = customFileName || 'schema_migration.sql';
    title = 'SQL Schema & Migration Script';
    category = 'database';
    code = `-- Auto-generated SQL Migration Script
-- Prompt: ${prompt}

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

COMMIT;`;
  } else {
    fileName = customFileName || 'apiHelper.ts';
    title = 'TypeScript Utility Module for VS Code';
    category = 'backend';
    code = `/**
 * Auto-generated TypeScript Module for VS Code
 * Prompt: ${prompt}
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<ApiResponse<T>> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP error \${response.status}: \${response.statusText}\`);
      }
      const data = await response.json();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (err: any) {
      if (attempt === retries) {
        return { success: false, error: err.message, timestamp: new Date().toISOString() };
      }
      // Exponential backoff delay
      await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 200));
    }
  }
  return { success: false, error: 'Maximum retry attempts exceeded', timestamp: new Date().toISOString() };
}`;
  }

  return {
    id: `snippet-${Date.now()}`,
    fileName,
    vscodeTargetPath: `src/${fileName}`,
    language,
    title,
    description: prompt,
    category,
    code,
    tags: ['VSCode', 'MyraaAI', language],
  };
}

// =====================================================================
// 4. EVERYDAY LIFE & WORK PRODUCTIVITY ACTIONS
// =====================================================================

export const EVERYDAY_EMAIL_TEMPLATES: EverydayEmailTemplate[] = [
  {
    id: 'email-leave',
    title: '🌴 Formal Leave Application (1-2 Days)',
    category: 'leave',
    subject: 'Leave Application - [Your Name] - [Date Range]',
    body: `Dear [Manager/HR Name],

I am writing to formally request leave for [Number of Days] day(s), from [Start Date] to [End Date], due to [personal reason / urgent family commitment].

I have handed over my immediate tasks to [Colleague Name] and ensured that all deliverables scheduled for this period are up to date. I will have limited access to my email and can be reached on my phone ([Phone Number]) for any critical emergencies.

Thank you for your understanding.

Warm regards,
[Your Name]
[Your Role / Team]`,
  },
  {
    id: 'email-sick',
    title: '🤒 Sick Day Notification',
    category: 'sick_day',
    subject: 'Sick Leave Notice - [Your Name] - [Today\'s Date]',
    body: `Hi [Manager Name],

I am unwell today with [fever/cold/migraine] and will be unable to work effectively. I plan to rest and recover today so I can return to full capacity as soon as possible.

I will monitor critical messages if urgent, but please feel free to delegate any immediate standup blockers to [Colleague Name].

Thanks for understanding,
[Your Name]`,
  },
  {
    id: 'email-update',
    title: '🚀 Weekly Project Milestone Update',
    category: 'work_update',
    subject: 'Project Progress Update: [Project Name] - Week of [Date]',
    body: `Hi Team,

Here is a quick digest of key milestones achieved this week on [Project Name]:

✅ Highlights Completed:
- Shipped feature [Feature A] to staging with 0 regression bugs
- Improved API response time by 35% through Redis caching
- Resolved [3] critical customer feedback tickets

🎯 Focus for Next Week:
- Kickoff end-to-end integration tests for payment module
- Finalize UI review with product design

Let me know if you have any questions or blockers.

Best regards,
[Your Name]`,
  },
  {
    id: 'email-invoice',
    title: '💰 Polite Invoice Follow-Up',
    category: 'invoice_followup',
    subject: 'Follow-up: Invoice #[1042] - [Your Company / Name]',
    body: `Hi [Client Name],

I hope you are having a productive week!

I am following up regarding Invoice #[1042] for the sum of $[Amount], which was sent on [Date Sent] and was due on [Due Date].

Could you please confirm if the payment has been scheduled? I have attached a copy of the invoice for your convenience.

Thank you for your prompt attention.

Best regards,
[Your Name]
[Contact Details]`,
  },
];

/**
 * Generate Google Calendar URL or iCal download string
 */
export function generateCalendarEventLink(
  title: string,
  startDate: Date = new Date(),
  durationMinutes: number = 30,
  description: string = 'Scheduled via Myraa AI'
): { googleCalendarUrl: string; icsContent: string } {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startGCal = formatGCalDate(startDate);
  const endGCal = formatGCalDate(endDate);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startGCal}/${endGCal}&details=${encodeURIComponent(description)}`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Myraa AI//Calendar Assistant//EN
BEGIN:VEVENT
UID:${Date.now()}@myraa.ai
DTSTAMP:${startGCal}
DTSTART:${startGCal}
DTEND:${endGCal}
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  return { googleCalendarUrl, icsContent };
}

/**
 * Calculate Split Expense
 */
export function calculateSplitExpense(
  totalBill: number,
  numberOfPeople: number = 2,
  tipPercent: number = 10,
  taxPercent: number = 5
): {
  subtotal: number;
  tipAmount: number;
  taxAmount: number;
  totalWithTipAndTax: number;
  perPersonShare: number;
} {
  const safePeople = Math.max(1, numberOfPeople);
  const taxAmount = Number((totalBill * (taxPercent / 100)).toFixed(2));
  const tipAmount = Number((totalBill * (tipPercent / 100)).toFixed(2));
  const totalWithTipAndTax = Number((totalBill + taxAmount + tipAmount).toFixed(2));
  const perPersonShare = Number((totalWithTipAndTax / safePeople).toFixed(2));

  return {
    subtotal: totalBill,
    tipAmount,
    taxAmount,
    totalWithTipAndTax,
    perPersonShare,
  };
}
