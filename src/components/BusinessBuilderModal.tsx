import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Sparkles,
  Rocket,
  DollarSign,
  Layers,
  CheckCircle2,
  Circle,
  ExternalLink,
  Target,
  Zap,
  TrendingUp,
  Code2,
  Package,
  FileSpreadsheet,
  Globe,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { ContrastMode, BusinessNiche, BusinessModelCanvas } from '../types';
import {
  FREE_TOOL_RESOURCES,
  INITIAL_BUSINESS_MODELS,
  generateCustomBusinessIdea,
} from '../utils/businessBuilderData';

interface BusinessBuilderModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialNiche?: BusinessNiche;
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

export const BusinessBuilderModal: React.FC<BusinessBuilderModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialNiche = 'micro_saas',
  onClose,
  onLogVoiceCommand,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<BusinessNiche>(initialNiche);
  const [activeTab, setActiveTab] = useState<'canvas' | 'freestack' | 'roadmap' | 'calculator'>('canvas');
  const [customKeywords, setCustomKeywords] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [copiedScript, setCopiedScript] = useState(false);

  // Revenue Calculator States
  const [calcTraffic, setCalcTraffic] = useState<number>(2000);
  const [calcConversionRate, setCalcConversionRate] = useState<number>(2.5);
  const [calcPricePoint, setCalcPricePoint] = useState<number>(29);

  const isTrueBlack = contrastMode === 'true-black';

  const activeModel = generateCustomBusinessIdea(selectedNiche, customKeywords);

  const handleToggleChecklist = (index: number) => {
    const key = `${selectedNiche}-${index}`;
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyPitch = () => {
    const text = `🚀 Business Model: ${activeModel.title}\n💡 Value Prop: ${activeModel.valueProposition}\n🎯 Audience: ${activeModel.targetAudience}\n💰 Monetization: ${activeModel.pricingStrategy.starterPrice} / ${activeModel.pricingStrategy.proPrice}\n🛠️ $0 Stack: ${activeModel.freeToBuildStack.map((s) => s.name).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!isOpen) return null;

  // Revenue Math
  const estimatedBuyers = Math.round((calcTraffic * calcConversionRate) / 100);
  const estimatedMonthlyRevenue = estimatedBuyers * calcPricePoint;
  const estimatedAnnualRevenue = estimatedMonthlyRevenue * 12;

  const NICHES: Array<{ id: BusinessNiche; label: string; icon: any; highlight: string }> = [
    { id: 'micro_saas', label: 'AI Micro-SaaS', icon: Code2, highlight: '$10K MRR' },
    { id: 'digital_products', label: 'Digital OS & Templates', icon: Package, highlight: '95% Margin' },
    { id: 'ai_automation', label: 'AI Agency (AAA)', icon: Zap, highlight: '$1.5K Retainers' },
    { id: 'newsletter_media', label: 'Niche Media & Newsletter', icon: FileSpreadsheet, highlight: 'Sponsorships' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isTrueBlack
            ? 'bg-black border-neutral-800 text-white'
            : 'bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-950/95 border-white/10 text-white backdrop-blur-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">Online Business & Free Product Studio</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  $0 STARTUP STACK
                </span>
              </div>
              <p className="text-xs text-white/50">Build, Monetize & Launch Digital Products with Zero Capital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPitch}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copied Canvas' : 'Copy Pitch'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Niche Selector Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-white/5 pb-3">
          {NICHES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedNiche === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedNiche(item.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md'
                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-emerald-300 font-mono">
                  {item.highlight}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary View Tabs (Canvas, Zero $ Stack, Roadmap, Calculator) */}
        <div className="px-6 py-2 flex items-center gap-2 border-b border-white/10 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'canvas' ? 'bg-white/15 text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Business Canvas
          </button>
          <button
            onClick={() => setActiveTab('freestack')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'freestack' ? 'bg-white/15 text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            $0 Free Tech Stack
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'roadmap' ? 'bg-white/15 text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            Launch Roadmap ({activeModel.estimatedLaunchDays} Days)
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'calculator' ? 'bg-white/15 text-white font-bold' : 'text-white/50 hover:text-white'
            }`}
          >
            MRR & Profit Simulator
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              {/* Custom Niche Keyword Modifier */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="Customize for your industry (e.g., Real Estate, Fitness Coaches, E-commerce, Doctors)..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
                />
              </div>

              {/* Business Overview Hero */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-pink-500/15 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Business Blueprint
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Target MRR: {activeModel.pricingStrategy.targetMonthlyRevenue}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeModel.title}</h1>
                <p className="text-sm text-white/80 leading-relaxed">{activeModel.valueProposition}</p>
              </div>

              {/* 4-Grid Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Target className="w-4 h-4" />
                    <span>Target Audience & ICP</span>
                  </div>
                  <p className="text-sm text-white/90">{activeModel.targetAudience}</p>
                  <div className="pt-2 text-xs text-white/50 border-t border-white/5">
                    <strong>Problem:</strong> {activeModel.problemSolved}
                  </div>
                </div>

                {/* Monetization & Pricing Tiers */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Monetization & Pricing Strategy</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/60">Free Lead Magnet:</span>
                      <span className="text-white font-medium">{activeModel.pricingStrategy.freeTierOffer}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/60">Starter Tier:</span>
                      <span className="text-emerald-300 font-bold font-mono">{activeModel.pricingStrategy.starterPrice}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-white/60">Pro / Agency Tier:</span>
                      <span className="text-purple-300 font-bold font-mono">{activeModel.pricingStrategy.proPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Zero Budget Growth Tactics */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Zap className="w-4 h-4" />
                    <span>$0 Client Acquisition Tactics</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {activeModel.zeroBudgetTactics.map((tactic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Marketing Funnel */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>High-Converting Marketing Funnel</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {activeModel.marketingFunnel.map((funnel, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-pink-400 font-mono font-bold">{idx + 1}.</span>
                        <span>{funnel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'freestack' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                💡 <strong>The 100% Free Builder Stack:</strong> You can build, deploy, accept global payments, and deliver products with zero monthly overhead until you generate substantial revenue.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FREE_TOOL_RESOURCES.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">{tool.purpose}</p>
                    <div className="text-[11px] text-white/80 p-2 rounded-xl bg-white/5 font-mono">
                      {tool.freeTierDetails}
                    </div>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-purple-200 pt-1"
                    >
                      <span>Visit Tool Free Tier</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Interactive {activeModel.estimatedLaunchDays}-Day Launch Roadmap</h3>
                <p className="text-xs text-white/60">Check off each milestone as you progress toward your launch:</p>
              </div>

              <div className="space-y-2.5">
                {activeModel.launchChecklist.map((item, idx) => {
                  const key = `${selectedNiche}-${idx}`;
                  const isDone = checklist[key] !== undefined ? checklist[key] : item.done;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleChecklist(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                          : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/[0.08]'
                      }`}
                    >
                      <button className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-white/40" />
                        )}
                      </button>
                      <div className="space-y-1 flex-1">
                        <div className={`text-sm font-bold ${isDone ? 'line-through text-white/70' : 'text-white'}`}>
                          {item.step}
                        </div>
                        <div className="text-xs text-white/50">
                          <strong>Pro Tip:</strong> {item.tip}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MVP Execution Steps */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Step-by-Step MVP Build Sequence
                </h4>
                <div className="space-y-2 text-xs text-white/80">
                  {activeModel.mvpCreationSteps.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Online Business Revenue & MRR Simulator</span>
                </h3>

                {/* Sliders */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-white/70 mb-1.5">
                      <span>Monthly Targeted Visitors / Views</span>
                      <span className="font-bold text-white font-mono">{calcTraffic.toLocaleString()} visitors</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={25000}
                      step={500}
                      value={calcTraffic}
                      onChange={(e) => setCalcTraffic(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-white/70 mb-1.5">
                      <span>Estimated Conversion Rate (%)</span>
                      <span className="font-bold text-white font-mono">{calcConversionRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={calcConversionRate}
                      onChange={(e) => setCalcConversionRate(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-white/70 mb-1.5">
                      <span>Product Price / Monthly Subscription ($)</span>
                      <span className="font-bold text-emerald-300 font-mono">${calcPricePoint} / sale</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={299}
                      step={2}
                      value={calcPricePoint}
                      onChange={(e) => setCalcPricePoint(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Calculation Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                    <div className="text-xs text-white/50">Monthly Customers</div>
                    <div className="text-2xl font-bold text-white font-mono">{estimatedBuyers}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-center space-y-1">
                    <div className="text-xs text-emerald-300 font-medium">Monthly Recurring Revenue</div>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                      ${estimatedMonthlyRevenue.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/20 text-center space-y-1">
                    <div className="text-xs text-purple-300 font-medium">Annualized Run-Rate (ARR)</div>
                    <div className="text-2xl font-extrabold text-purple-300 font-mono">
                      ${estimatedAnnualRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Voice prompt: "Create an online business model for real estate" or "नया ऑनलाइन बिज़नेस कैसे शुरू करें"</span>
          </div>
          <span className="font-mono text-emerald-400">$0 Capital Required</span>
        </div>
      </div>
    </div>
  );
};
