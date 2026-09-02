import { BusinessModelCanvas, BusinessNiche, FreeToolResource } from '../types';

export const FREE_TOOL_RESOURCES: FreeToolResource[] = [
  {
    name: 'Vercel / Cloudflare Pages',
    purpose: 'Zero-Cost Web Hosting & Edge CDN',
    freeTierDetails: 'Unlimited static sites, 100GB/mo bandwidth, global fast edge network',
    website: 'https://vercel.com',
    badge: 'Hosting $0',
  },
  {
    name: 'Supabase / Firebase',
    purpose: 'Free Database, Auth & Realtime State',
    freeTierDetails: '50,000 monthly active users, 500MB PostgreSQL / Firestore, free social login',
    website: 'https://supabase.com',
    badge: 'Database $0',
  },
  {
    name: 'Stripe / Gumroad / Lemon Squeezy',
    purpose: 'Global Payment Processing & Invoicing',
    freeTierDetails: '$0 monthly fee, pay-as-you-sell transaction cut only',
    website: 'https://stripe.com',
    badge: 'Payments $0',
  },
  {
    name: 'GitHub & GitHub Actions',
    purpose: 'Code Versioning & Automated CI/CD Pipelines',
    freeTierDetails: 'Unlimited private repositories, 2,000 build minutes/month',
    website: 'https://github.com',
    badge: 'Dev Stack $0',
  },
  {
    name: 'Canva / Figma',
    purpose: 'Product Mockups, UI Design & Social Assets',
    freeTierDetails: 'Extensive free templates, high-res exports, collaborative canvas',
    website: 'https://figma.com',
    badge: 'Design $0',
  },
  {
    name: 'Resend / Brevo (Sendinblue)',
    purpose: 'Transactional & Newsletter Email Delivery',
    freeTierDetails: '3,000 free emails/mo (Resend) / 300 free emails/day (Brevo)',
    website: 'https://resend.com',
    badge: 'Email $0',
  },
  {
    name: 'Google AI Studio / Gemini API',
    purpose: 'AI Model Brains for Micro-SaaS',
    freeTierDetails: 'Generous free rate limits for Gemini 1.5 Flash & Pro for builders',
    website: 'https://ai.google.dev',
    badge: 'AI API $0',
  },
  {
    name: 'Carrd / Typedream / Notion',
    purpose: 'Instant No-Code Landing Pages & Docs',
    freeTierDetails: 'Build up to 3 live landing pages for $0 on carrd.co',
    website: 'https://carrd.co',
    badge: 'Landing $0',
  },
];

export const INITIAL_BUSINESS_MODELS: BusinessModelCanvas[] = [
  {
    id: 'biz-micro-saas',
    niche: 'micro_saas',
    title: 'AI Micro-SaaS: Niche Prompt & Document Assistant',
    tagline: 'Solve one hyper-specific painful problem for professionals with an AI edge.',
    targetAudience: 'Real estate agents, lawyers, freelance copywriters, or medical clinics.',
    problemSolved: 'Manual drafting of legal agreements, client follow-up pitches, and listing descriptions takes 10+ hours/week.',
    valueProposition: 'Generate custom compliant documents in 10 seconds using specialized AI templates with one-click export.',
    freeToBuildStack: [
      FREE_TOOL_RESOURCES[0], // Vercel
      FREE_TOOL_RESOURCES[1], // Supabase
      FREE_TOOL_RESOURCES[2], // Stripe
      FREE_TOOL_RESOURCES[6], // Gemini API
    ],
    monetizationModel: 'Freemium Subscription (Monthly/Annual Recurring Revenue) + Pay-per-credit packs.',
    pricingStrategy: {
      freeTierOffer: '3 document generations per month ($0 forever)',
      starterPrice: '$15 / month (Unlimited drafts & basic exports)',
      proPrice: '$39 / month (Team sharing, custom branding & CRM sync)',
      targetMonthlyRevenue: '$3,500 - $12,000 / month (with 150-300 active subscribers)',
    },
    mvpCreationSteps: [
      '1. Pick one narrow niche (e.g. Airbnb host messages or Legal NDA builder).',
      '2. Build single-page React app with Tailwind and Gemini API on Google AI Studio.',
      '3. Hook up Supabase for user auth (Google login) and Stripe Checkout for billing.',
      '4. Deploy live in under 2 hours on Vercel at $0 infrastructure cost.',
    ],
    launchChecklist: [
      { step: 'Define niche and single core killer feature', done: true, tip: 'Keep MVP strictly to 1 primary workflow' },
      { step: 'Set up Stripe account & webhook for subscriptions', done: true, tip: 'Use Stripe Checkout for $0 hosting fee' },
      { step: 'Deploy frontend on Vercel with free custom domain or .vercel.app', done: true, tip: 'Test responsive mobile layout' },
      { step: 'Share launch post on Reddit (r/SideProject), Product Hunt & Twitter', done: false, tip: 'Offer first 50 users a lifetime 50% discount' },
    ],
    marketingFunnel: [
      'Top of Funnel: Short-form TikTok/Reels showcasing before/after 10x speedup',
      'Middle: Free browser mini-tool with no signup required for 1st trial',
      'Bottom: Email welcome sequence offering 7-day Pro free trial with Stripe',
    ],
    zeroBudgetTactics: [
      'Direct cold DM to 20 target professionals on LinkedIn with a free custom sample',
      'Post actionable tutorials on Reddit r/Entrepreneur and indiehackers.com',
      'Submit to 50+ free AI tool directories (ThereIsAnAIForThat, Futurepedia, BetaList)',
    ],
    estimatedLaunchDays: 3,
  },
  {
    id: 'biz-digital-products',
    niche: 'digital_products',
    title: 'Digital Templates & Notion Operating System',
    tagline: 'Create once, sell infinitely with 95%+ pure profit margins and zero inventory.',
    targetAudience: 'Freelancers, remote tech workers, small agency founders, students.',
    problemSolved: 'Disorganized daily task tracking, client CRM chaos, and project deadline slipping.',
    valueProposition: 'A beautifully structured Notion OS / Excel Financial Tracker that organizes business in 1 click.',
    freeToBuildStack: [
      FREE_TOOL_RESOURCES[4], // Figma / Canva
      FREE_TOOL_RESOURCES[2], // Gumroad / Lemon Squeezy
      FREE_TOOL_RESOURCES[5], // Resend Email
    ],
    monetizationModel: 'Direct digital download sales ($19 - $99 one-time) + Bundle upsells.',
    pricingStrategy: {
      freeTierOffer: 'Free Starter Checklist / Mini-Template on Gumroad (Lead Magnet)',
      starterPrice: '$29 one-time (Full Ultimate Notion Workspace)',
      proPrice: '$69 one-time (Master Bundle + Video Walkthrough + Automation Pack)',
      targetMonthlyRevenue: '$2,000 - $6,500 / month (pure passive digital revenue)',
    },
    mvpCreationSteps: [
      '1. Build a master workspace in Notion or Google Sheets that you use daily.',
      '2. Design clean mockup graphics in Canva/Figma for product thumbnail.',
      '3. Create a free product listing on Gumroad or Lemon Squeezy.',
      '4. Add a Loom video tutorial showing how to duplicate and setup in 3 minutes.',
    ],
    launchChecklist: [
      { step: 'Build comprehensive template workspace', done: true, tip: 'Include demo sample data so buyers see value immediately' },
      { step: 'Create high-converting cover images in Canva', done: true, tip: 'Use dark mode mockup screenshots' },
      { step: 'Set Gumroad price with "Pay What You Want" ($0+ for lead gen)', done: true, tip: 'Builds an active email buyer list' },
      { step: 'Post Twitter/X breakdown thread with free template link', done: false, tip: 'Ask followers to Retweet for instant access' },
    ],
    marketingFunnel: [
      'Lead Magnet: Free mini-tracker distributed on Twitter and LinkedIn',
      'Autoresponder: Automated email sequence delivering template + 30% discount code for Master OS',
      'Upsell: Offer consultation call or custom setup service for $199',
    ],
    zeroBudgetTactics: [
      'Create 30-second aesthetic workflow reels on Instagram and YouTube Shorts',
      'List on free Gumroad discovery marketplace and Notion Template galleries',
      'Partner with micro-influencers in productivity niche for 40% affiliate split',
    ],
    estimatedLaunchDays: 2,
  },
  {
    id: 'biz-ai-agency',
    niche: 'ai_automation',
    title: 'AI Automation Agency (AAA) for Local & E-comm Businesses',
    tagline: 'Deliver high-ROI workflow automations to local businesses charging monthly retainers.',
    targetAudience: 'Dentists, real estate brokers, gym owners, e-commerce stores, roofers.',
    problemSolved: 'Businesses miss 40% of customer inquiries after hours, losing thousands in sales.',
    valueProposition: 'Install 24/7 WhatsApp AI Chatbots & voice lead capturers that book appointments automatically into Google Calendar.',
    freeToBuildStack: [
      FREE_TOOL_RESOURCES[6], // Gemini API
      FREE_TOOL_RESOURCES[1], // Supabase / Firebase
      FREE_TOOL_RESOURCES[2], // Stripe Invoicing
      FREE_TOOL_RESOURCES[7], // Carrd Landing Page
    ],
    monetizationModel: 'Setup Fee ($500 - $1,500) + Monthly Maintenance Retainer ($200 - $500/mo/client).',
    pricingStrategy: {
      freeTierOffer: 'Free 15-Minute Audit & Live AI Bot Demo on their own website',
      starterPrice: '$499 Setup + $199/mo (WhatsApp AI Booking Bot + CRM sync)',
      proPrice: '$1,299 Setup + $499/mo (Multi-channel Voice + Chat + Automated Followup)',
      targetMonthlyRevenue: '$5,000 - $20,000 / month (with 10-25 retainer clients)',
    },
    mvpCreationSteps: [
      '1. Create a 1-page agency portfolio on Carrd ($0) showcasing chatbot demos.',
      '2. Build a working WhatsApp/Web chatbot prototype using Gemini API and Webhooks.',
      '3. Screen record a 60-second Loom showing the bot booking an appointment for a specific local business.',
      '4. Send custom Loom video to the business owner via Email or Instagram DM.',
    ],
    launchChecklist: [
      { step: 'Build sample live demo bot for a dentist or real estate agent', done: true, tip: 'Personalize with the prospect\'s actual logo and services' },
      { step: 'Create professional Stripe invoice template and service agreement', done: true, tip: 'Offer a 14-day 100% money-back guarantee' },
      { step: 'Identify 50 local businesses with outdated website contact forms', done: false, tip: 'Check Google Maps reviews for "slow response" complaints' },
      { step: 'Send 10 personalized video audits per day', done: false, tip: 'Keep video under 90 seconds' },
    ],
    marketingFunnel: [
      'Outreach: Cold personalized video email & Instagram DM with live demo link',
      'Discovery: 15-minute Zoom screen-share walking through live booking flow',
      'Close: "Risk-Free Trial" where they only pay setup after first 10 leads captured',
    ],
    zeroBudgetTactics: [
      'Walk into local businesses in your city and speak directly with the general manager',
      'Host a free 30-minute webinar "How Local Businesses Can Automate Inquiries with AI"',
      'Ask satisfied first clients for referrals in exchange for 1 month free retainer',
    ],
    estimatedLaunchDays: 4,
  },
  {
    id: 'biz-newsletter',
    niche: 'newsletter_media',
    title: 'Curated AI & Tech Niche Newsletter + Sponsorships',
    tagline: 'Build a high-value audience around emerging tech and monetize via sponsorships.',
    targetAudience: 'Software engineers, marketers, crypto investors, product managers.',
    problemSolved: 'Information overload—professionals have no time to filter 100s of daily tech news items.',
    valueProposition: 'A 5-minute Monday & Thursday digest curating the top 5 game-changing AI breakthroughs and tools.',
    freeToBuildStack: [
      FREE_TOOL_RESOURCES[5], // Resend / Brevo / Substack / Beehiiv
      FREE_TOOL_RESOURCES[4], // Canva Design
      FREE_TOOL_RESOURCES[7], // Notion / Carrd
    ],
    monetizationModel: 'Newsletter Sponsorships ($50 - $200 per 1,000 subscribers) + Premium Tier.',
    pricingStrategy: {
      freeTierOffer: 'Bi-weekly free curated email newsletter with zero ads',
      starterPrice: '$9 / month (Premium Deep-Dive Industry Reports & Database Access)',
      proPrice: '$150 / edition (Dedicated Sponsor Ad Slot to your audience)',
      targetMonthlyRevenue: '$2,500 - $8,000 / month (at 5,000 - 15,000 subscribers)',
    },
    mvpCreationSteps: [
      '1. Create a free account on Beehiiv, Substack, or Resend.',
      '2. Define 3 specific content buckets (e.g. Top 3 AI Tools, 1 Case Study, 1 Prompt).',
      '3. Write and publish the first 3 editions before public promotion.',
      '4. Share high-value visual summaries on LinkedIn and Twitter with signup link.',
    ],
    launchChecklist: [
      { step: 'Design clean minimalist newsletter header in Canva', done: true, tip: 'Keep layout high-contrast and readable on mobile' },
      { step: 'Set up automated welcome email with top 5 favorite resources', done: true, tip: 'Ask new readers to reply "YES" to boost email deliverability' },
      { step: 'Publish weekly viral infographics on Twitter & Reddit', done: false, tip: 'Include newsletter link in first pinned comment' },
    ],
    marketingFunnel: [
      'Attraction: Viral Twitter/X threads and LinkedIn carousels summarizing AI research',
      'Conversion: Lead magnet "The Ultimate 100 AI Tools Database" on landing page',
      'Monetization: Sell sponsor slots via Paved, Passionfroot, or direct outreach',
    ],
    zeroBudgetTactics: [
      'Cross-promote with other complementary newsletters in the 1,000-5,000 subscriber range',
      'Repurpose newsletter content into YouTube Shorts and LinkedIn text posts',
      'Comment insightful value on top influencers\' posts within 10 minutes of publishing',
    ],
    estimatedLaunchDays: 1,
  },
];

export function generateCustomBusinessIdea(niche: BusinessNiche, customKeywords?: string): BusinessModelCanvas {
  const base = INITIAL_BUSINESS_MODELS.find((m) => m.niche === niche) || INITIAL_BUSINESS_MODELS[0];
  if (!customKeywords) return base;

  return {
    ...base,
    id: `custom-${Date.now()}`,
    title: `${base.title} (Tailored for: ${customKeywords})`,
    tagline: `Customized blueprint focused on ${customKeywords} with zero startup capital.`,
    targetAudience: `Targeting specific operators and clients in ${customKeywords}.`,
  };
}
