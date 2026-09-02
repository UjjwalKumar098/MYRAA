import {
  CodeTemplateItem,
  ProgrammingLanguage,
  CodeExplanationReport,
} from '../types';

export const PROGRAMMING_LANGUAGES_LIST: Array<{
  id: ProgrammingLanguage;
  name: string;
  icon: string;
  version: string;
  color: string;
}> = [
  { id: 'typescript', name: 'TypeScript / React', icon: '⚡', version: 'v5.4', color: 'from-blue-500 to-indigo-600' },
  { id: 'javascript', name: 'JavaScript (Node.js)', icon: '💛', version: 'ES2024', color: 'from-yellow-400 to-amber-600' },
  { id: 'python', name: 'Python (AI & Data)', icon: '🐍', version: 'v3.12', color: 'from-emerald-500 to-teal-600' },
  { id: 'react', name: 'React 18+ Components', icon: '⚛️', version: 'v18.3', color: 'from-cyan-400 to-blue-600' },
  { id: 'html', name: 'HTML5 & Tailwind UI', icon: '🎨', version: 'HTML5', color: 'from-orange-500 to-rose-600' },
  { id: 'sql', name: 'SQL & Database Queries', icon: '🗄️', version: 'PostgreSQL', color: 'from-purple-500 to-violet-700' },
  { id: 'go', name: 'Go (Golang)', icon: '🐹', version: 'v1.22', color: 'from-cyan-500 to-sky-600' },
  { id: 'rust', name: 'Rust (Memory Safe)', icon: '🦀', version: 'v1.78', color: 'from-amber-600 to-red-700' },
  { id: 'cpp', name: 'C++ (DSA & High Perf)', icon: '⚙️', version: 'C++20', color: 'from-blue-600 to-slate-700' },
  { id: 'bash', name: 'Bash & Shell Automation', icon: '💻', version: 'POSIX', color: 'from-slate-600 to-zinc-800' },
];

export const INITIAL_CODE_TEMPLATES: CodeTemplateItem[] = [
  {
    id: 'code-1',
    title: 'Custom React Hook: useDebounce with Cleanup',
    language: 'typescript',
    category: 'frontend',
    description: 'Production-ready debouncing hook for search inputs, preventing excessive API calls.',
    tags: ['React', 'TypeScript', 'Hooks', 'Performance'],
    explanation: 'Delays updating the debounced value until after the specified delay has passed without new inputs.',
    codeSnippet: `import { useState, useEffect } from 'react';

/**
 * useDebounce custom hook
 * @param value The value to debounce (e.g. search query)
 * @param delay Delay in milliseconds (default 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    id: 'code-2',
    title: 'Python: Async Web Scraper & Data Extractor',
    language: 'python',
    category: 'backend',
    description: 'Blazing-fast asynchronous web scraper utilizing aiohttp and BeautifulSoup.',
    tags: ['Python', 'Asyncio', 'WebScraping', 'Data'],
    explanation: 'Fetches multiple URLs concurrently without blocking the main event loop.',
    codeSnippet: `import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def fetch_page(session: aiohttp.ClientSession, url: str) -> dict:
    headers = {"User-Agent": "MyraaOS/2.0 (FastScraperBot)"}
    try:
        async with session.get(url, headers=headers, timeout=10) as response:
            html = await response.text()
            soup = BeautifulSoup(html, 'html.parser')
            title = soup.title.string.strip() if soup.title else "No Title"
            return {"url": url, "status": response.status, "title": title}
    except Exception as e:
        return {"url": url, "error": str(e)}

async def scrape_multiple_urls(urls: list[str]):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# Example Execution
if __name__ == "__main__":
    target_urls = ["https://news.ycombinator.com", "https://github.com/trending"]
    data = asyncio.run(scrape_multiple_urls(target_urls))
    print(f"Scraped {len(data)} pages successfully:", data)`,
  },
  {
    id: 'code-3',
    title: 'DSA: Two Sum & Optimal Hash Map (O(n))',
    language: 'typescript',
    category: 'algorithms',
    description: 'The definitive Two Sum solution using a single-pass hash map for O(n) time and O(n) space.',
    tags: ['DSA', 'Algorithms', 'LeetCode', 'HashMap'],
    explanation: 'Stores each number and its index in a map; checks if target - current exists in O(1) average time.',
    codeSnippet: `/**
 * Solves Two Sum in O(n) Time Complexity and O(n) Space Complexity
 * @param nums Array of integers
 * @param target Target sum
 * @returns Indices of the two numbers that add up to target
 */
export function twoSum(nums: number[], target: number): [number, number] | null {
  const map = new Map<number, number>(); // Stores value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }

  return null; // No valid pair found
}

// Test Case
console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]`,
  },
  {
    id: 'code-4',
    title: 'SQL: Window Function & Running Revenue Totals',
    language: 'sql',
    category: 'database',
    description: 'PostgreSQL window function calculating 7-day moving averages and cumulative sales.',
    tags: ['SQL', 'PostgreSQL', 'Analytics', 'Database'],
    explanation: 'Uses OVER (PARTITION BY ... ORDER BY ...) to compute running totals without self-joins.',
    codeSnippet: `-- Calculate daily revenue, cumulative running total, and 7-day moving average
SELECT
    order_date,
    SUM(order_amount) AS daily_revenue,
    SUM(SUM(order_amount)) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_revenue,
    AVG(SUM(order_amount)) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7day_avg_revenue
FROM orders
WHERE status = 'completed'
GROUP BY order_date
ORDER BY order_date DESC;`,
  },
  {
    id: 'code-5',
    title: 'Tailwind CSS: Glassmorphic Bento Grid Card',
    language: 'html',
    category: 'frontend',
    description: 'Modern, responsive Bento card layout with subtle glowing gradient and hover lift effect.',
    tags: ['HTML', 'TailwindCSS', 'UI', 'Design'],
    explanation: 'Uses backdrop-blur, subtle borders, and smooth transitions for a sleek modern tech look.',
    codeSnippet: `<div class="relative group p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:-translate-y-1">
  <!-- Glowing subtle top accent -->
  <div class="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  
  <div class="flex items-center justify-between mb-4">
    <div class="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold">
      ⚡ AI Engine
    </div>
    <span class="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      Active (12ms)
    </span>
  </div>
  
  <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
    High-Throughput Stream
  </h3>
  <p class="text-sm text-zinc-400 leading-relaxed mb-6">
    Low-latency audio and function routing with sub-millisecond dispatch pipelines.
  </p>
  
  <button class="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-2">
    <span>Launch Terminal</span>
    <span class="text-lg">→</span>
  </button>
</div>`,
  },
];

/**
 * Generates an instant AI code explanation report
 */
export function explainCodeSnippet(code: string, language: ProgrammingLanguage = 'typescript'): CodeExplanationReport {
  const lines = code.trim().split('\n');
  const summary = `This ${language.toUpperCase()} script contains ${lines.length} lines of code structured for clean modular execution and optimal memory usage.`;

  const lineBreakdown: Array<{ lines: string; explanation: string }> = [];
  
  if (lines.length > 0) {
    lineBreakdown.push({
      lines: lines.slice(0, Math.min(3, lines.length)).join('\n'),
      explanation: 'Initial imports, type declarations, or function setup establishing the core contract.',
    });
  }
  if (lines.length > 3) {
    lineBreakdown.push({
      lines: lines.slice(3, Math.min(8, lines.length)).join('\n'),
      explanation: 'Primary logic processing loop, conditional dispatching, and state transformations.',
    });
  }
  if (lines.length > 8) {
    lineBreakdown.push({
      lines: lines.slice(8).join('\n'),
      explanation: 'Return statement, clean up handling, or module exports.',
    });
  }

  return {
    title: `${language.toUpperCase()} Execution Analysis`,
    language,
    code,
    summary,
    lineByLineExplanation: lineBreakdown,
    timeComplexity: 'O(n) - Single pass iteration',
    spaceComplexity: 'O(1) - Constant auxiliary memory',
    bestPractices: [
      'Strict type definitions minimize runtime regressions.',
      'Explicit error boundaries ensure graceful fault tolerance.',
      'Immutable state patterns prevent unintended side effects.',
    ],
    suggestedImprovements: 'Consider memoizing high-frequency transformations or leveraging Web Workers for CPU-bound computations.',
  };
}
