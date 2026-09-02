import {
  LanguageTopicLesson,
  GrammarSentenceAnalysis,
  LanguageQuizQuestion,
  ConversationRoleplayScenario,
  TargetLanguageCode,
} from '../types';

export const SUPPORTED_TUTOR_LANGUAGES: Array<{
  code: TargetLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  voiceLangCode: string;
  description: string;
}> = [
  {
    code: 'en',
    name: 'English (US/UK/Global)',
    nativeName: 'English',
    flag: '🇺🇸',
    voiceLangCode: 'en-US',
    description: 'Master spoken English, grammar rules, daily idioms, business vocabulary, and clear accents.',
  },
  {
    code: 'hi',
    name: 'Hindi (हिंदी)',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    voiceLangCode: 'hi-IN',
    description: 'Learn conversational Hindi, formal etiquette, beautiful vocabulary, and everyday expressions.',
  },
  {
    code: 'es',
    name: 'Spanish (Español)',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceLangCode: 'es-ES',
    description: 'Learn everyday Spanish, travel dialogues, verb conjugations, and lively expressions.',
  },
  {
    code: 'fr',
    name: 'French (Français)',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceLangCode: 'fr-FR',
    description: 'Master French pronunciation, chic idioms, cafe conversations, and romantic phrases.',
  },
  {
    code: 'de',
    name: 'German (Deutsch)',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    voiceLangCode: 'de-DE',
    description: 'Master German sentence structure, compound words, technical expressions, and travel phrases.',
  },
  {
    code: 'ja',
    name: 'Japanese (日本語)',
    nativeName: '日本語',
    flag: '🇯🇵',
    voiceLangCode: 'ja-JP',
    description: 'Learn essential Japanese greetings, anime expressions, Hiragana/Katakana concepts, and polite Keigo.',
  },
  {
    code: 'zh',
    name: 'Mandarin (中文)',
    nativeName: '中文',
    flag: '🇨🇳',
    voiceLangCode: 'zh-CN',
    description: 'Learn conversational Chinese, Pinyin pronunciation, business greetings, and tone mastery.',
  },
  {
    code: 'ar',
    name: 'Arabic (العربية)',
    nativeName: 'العربية',
    flag: '🇦🇪',
    voiceLangCode: 'ar-SA',
    description: 'Learn modern standard Arabic, welcoming greetings, and poetic expressions.',
  },
];

export const INITIAL_ENGLISH_LESSONS: LanguageTopicLesson[] = [
  {
    id: 'lesson-eng-1',
    title: 'Fluent Daily Small Talk & Greetings',
    category: 'daily_conversation',
    level: 'beginner',
    description: 'Move beyond "How are you?" to natural, native-sounding casual greetings and replies.',
    keyPhrases: [
      {
        phrase: "How's it going today?",
        translation: "आज का दिन कैसा चल रहा है? / ¿Cómo te va?",
        phonetic: "/haʊz ɪt ˈɡoʊ.ɪŋ təˈdeɪ/",
        exampleUsage: "Hey Alex! How's it going today? — Can't complain, pretty good!",
        explanation: "Very natural casual replacement for 'How are you?' used with friends and coworkers.",
      },
      {
        phrase: "I couldn't help but notice...",
        translation: "मैंने ध्यान दिया कि... / Me di cuenta de que...",
        phonetic: "/aɪ ˈkʊd.ənt hɛlp bʌt ˈnoʊ.tɪs/",
        exampleUsage: "I couldn't help but notice your laptop sticker, are you a React developer?",
        explanation: "The smoothest, most polite conversation starter in English for social settings.",
      },
      {
        phrase: "Catch you later!",
        translation: "बाद में मिलते हैं! / ¡Hasta luego!",
        phonetic: "/kætʃ juː ˈleɪ.tər/",
        exampleUsage: "I've got a meeting in 5 minutes, catch you later!",
        explanation: "Warm and friendly farewell for colleagues and friends.",
      },
    ],
    grammarTip: "In natural English, use contractions like 'How's', 'I've', and 'Can't' to sound relaxed and fluent.",
    practicePrompt: "Try saying: 'Hey there! How's everything going with your project?'",
  },
  {
    id: 'lesson-eng-2',
    title: 'Essential Grammar: Past Simple vs Present Perfect',
    category: 'grammar_rules',
    level: 'intermediate',
    description: 'Never mix up "I saw" vs "I have seen" ever again with this golden rule.',
    keyPhrases: [
      {
        phrase: "I visited London last year.",
        translation: "Past Simple: Finished time in the past.",
        phonetic: "/aɪ ˈvɪz.ɪ.tɪd ˈlʌn.dən læst jɪər/",
        exampleUsage: "I visited London in 2023 (specific finished time).",
        explanation: "Use Past Simple when mentioning a specific time in the past (yesterday, last year, 2 days ago).",
      },
      {
        phrase: "I have visited London three times.",
        translation: "Present Perfect: Life experience connected to now.",
        phonetic: "/aɪ hæv ˈvɪz.ɪ.tɪd ˈlʌn.dən θriː taɪmz/",
        exampleUsage: "Have you ever visited London? — Yes, I have visited three times.",
        explanation: "Use Present Perfect (Have + V3) when time is not specified; it is about life experience.",
      },
    ],
    grammarTip: "If you say 'when' it happened (yesterday, at 3pm), ALWAYS use Past Simple!",
    practicePrompt: "Say: 'I have finished my assignment today, but I started it yesterday.'",
  },
  {
    id: 'lesson-eng-3',
    title: 'High-Impact Business & Workplace English',
    category: 'business_english',
    level: 'advanced',
    description: 'Polite corporate phrasing for meetings, emails, negotiations, and presentations.',
    keyPhrases: [
      {
        phrase: "Let's touch base next week.",
        translation: "अगले हफ्ते बात करते हैं / Hablemos la próxima semana.",
        phonetic: "/lɛts tʌtʃ beɪs nɛkst wiːk/",
        exampleUsage: "Let's touch base on Tuesday to review the launch metrics.",
        explanation: "Standard professional idiom meaning 'to briefly connect or meet'.",
      },
      {
        phrase: "Could you elaborate on that point?",
        translation: "क्या आप उस बिंदु को थोड़ा और समझा सकते हैं?",
        phonetic: "/kʊd juː ɪˈlæb.ə.reɪt ɒn ðæt pɔɪnt/",
        exampleUsage: "That's an interesting approach. Could you elaborate on the security aspect?",
        explanation: "Much more polite and executive than saying 'Explain that more' or 'What do you mean?'.",
      },
      {
        phrase: "I'll circle back with the data by EOD.",
        translation: "मैं दिन के अंत तक डेटा लेकर वापस आता हूँ।",
        phonetic: "/aɪl ˈsɜːr.kəl bæk wɪð ðə ˈdeɪ.tə baɪ iː-oʊ-diː/",
        exampleUsage: "I'll circle back with the client feedback by EOD (End of Day).",
        explanation: "Standard corporate phrasing for following up with information.",
      },
    ],
    grammarTip: "Soft modal verbs ('Could you', 'Would you mind', 'I would suggest') make your business tone 10x more persuasive.",
    practicePrompt: "Say: 'Would you mind circling back with me once the pull request is reviewed?'",
  },
  {
    id: 'lesson-eng-4',
    title: 'Popular Idioms & Everyday Slang',
    category: 'idioms_slang',
    level: 'intermediate',
    description: 'Understand native speakers effortlessly by learning the top idioms used in movies and real conversations.',
    keyPhrases: [
      {
        phrase: "Hit the nail on the head",
        translation: "बिल्कुल सही बात कहना / Dar en el clavo",
        phonetic: "/hɪt ðə neɪl ɒn ðə hɛd/",
        exampleUsage: "You hit the nail on the head! That's exactly why the performance dropped.",
        explanation: "Used when someone describes the exact truth or correct solution.",
      },
      {
        phrase: "Piece of cake",
        translation: "बेहद आसान काम / Pan comido",
        phonetic: "/piːs ʌv keɪk/",
        exampleUsage: "Don't worry about the coding exam, it was a piece of cake!",
        explanation: "Describes any task that is very simple and easy to complete.",
      },
      {
        phrase: "Cut corners",
        translation: "कामचोरी करना या सस्ता रास्ता चुनना",
        phonetic: "/kʌt ˈkɔːr.nərz/",
        exampleUsage: "We cannot cut corners on user privacy and software testing.",
        explanation: "Taking an easy or cheap shortcut that reduces overall quality.",
      },
    ],
    grammarTip: "Idioms should be used naturally. One or two well-placed idioms show great language mastery.",
    practicePrompt: "Say: 'Fixing that bug was a piece of cake once we found the root cause!'",
  },
  {
    id: 'lesson-eng-5',
    title: 'Clear Accent & Phonetics: The Silent Letters & Rhythms',
    category: 'accent_phonetics',
    level: 'beginner',
    description: 'Master tricky English pronunciation traps like silent B, K, W and the relaxed Schwa sound /ə/.',
    keyPhrases: [
      {
        phrase: "Doubt, Debt, Subtle (Silent 'B')",
        translation: "उच्चारण: डाऊट, डेट, सटल (B साइलेंट है)",
        phonetic: "/daʊt/, /dɛt/, /ˈsʌt.əl/",
        exampleUsage: "There is no doubt that his debt was settled in a subtle manner.",
        explanation: "When B follows M or precedes T, it is almost always silent.",
      },
      {
        phrase: "Knight, Knife, Knowledge (Silent 'K')",
        translation: "उच्चारण: नाइट, नाइफ, नॉलेज (K साइलेंट है)",
        phonetic: "/naɪt/, /naɪf/, /ˈnɒl.ɪdʒ/",
        exampleUsage: "The knight possessed deep technical knowledge.",
        explanation: "When K comes before N at the start of a word, do NOT pronounce the K.",
      },
      {
        phrase: "Comfortable, Wednesday, February",
        translation: "उच्चारण: /ˈkʌmf.tə.bəl/, /ˈwɛnz.deɪ/, /ˈfɛb.ruːˌɛr.i/",
        phonetic: "/ˈkʌmf.tə.bəl/",
        exampleUsage: "Make yourself comfortable this Wednesday!",
        explanation: "Notice syllables compress in native speech: 'comf-ter-ble' and 'Wenz-day'.",
      },
    ],
    grammarTip: "English is a stress-timed language: stress key nouns and verbs, and glide quickly over filler words.",
    practicePrompt: "Say: 'I have no doubt that comfortable shoes make Wednesday meetings easier.'",
  },
];

export const INITIAL_QUIZ_QUESTIONS: LanguageQuizQuestion[] = [
  {
    id: 'q-1',
    question: "Choose the correct sentence for an action that happened yesterday:",
    language: 'en',
    options: [
      'I have visited my grandparents yesterday.',
      'I visited my grandparents yesterday.',
      'I was visit my grandparents yesterday.',
      'I have been visited my grandparents yesterday.',
    ],
    correctIndex: 1,
    explanation: "Because 'yesterday' is a specific finished past time, we MUST use the Past Simple tense ('I visited').",
    category: 'Grammar',
  },
  {
    id: 'q-2',
    question: "What does the idiom 'Cut corners' mean in conversation?",
    language: 'en',
    options: [
      'To turn quickly around a street corner',
      'To do something poorly or cheaply in order to save time or money',
      'To build a square room with sharp corners',
      'To interrupt someone in a polite way',
    ],
    correctIndex: 1,
    explanation: "'Cutting corners' means taking cheap shortcuts that harm quality.",
    category: 'Idioms',
  },
  {
    id: 'q-3',
    question: "Which of these words has a silent letter 'B'?",
    language: 'en',
    options: ['Table', 'Doubt', 'Robber', 'Bubble'],
    correctIndex: 1,
    explanation: "In 'Doubt' (and debt, subtle), the letter 'b' is completely silent and pronounced /daʊt/.",
    category: 'Pronunciation',
  },
  {
    id: 'q-4',
    question: "In professional workplace English, what is the best way to ask for more details?",
    language: 'en',
    options: [
      'Tell me more now.',
      'Could you elaborate on that point?',
      'Why did you say that?',
      'Speak clearly please.',
    ],
    correctIndex: 1,
    explanation: "'Could you elaborate on that point?' is an elegant, polite, and executive way to request details.",
    category: 'Business English',
  },
  {
    id: 'q-5',
    question: "How do you say 'Thank you very much' politely in Spanish?",
    language: 'es',
    options: ['Por favor', 'Muchas gracias', 'De nada', 'Buenos días'],
    correctIndex: 1,
    explanation: "'Muchas gracias' means 'Thank you very much' in Spanish.",
    category: 'Spanish Basics',
  },
];

export const ROLEPLAY_SCENARIOS: ConversationRoleplayScenario[] = [
  {
    id: 'rp-1',
    title: 'Ordering at a Specialty Coffee Shop',
    emoji: '☕',
    scenarioRole: 'Barista at Blue Bottle Coffee',
    difficulty: 'beginner',
    targetLanguage: 'en',
    initialDialogue: "Hi there! Welcome in. What can I get started for you today?",
    expectedLearnerGoal: 'Order a coffee with custom milk and ask about pastry recommendations.',
    suggestedResponses: [
      "Can I get a large iced oat milk latte with light ice, please?",
      "What do you recommend for fresh pastries today?",
      "Could I have a flat white to go, please?",
    ],
  },
  {
    id: 'rp-2',
    title: 'Tech Job Interview: Behavioral Question',
    emoji: '💼',
    scenarioRole: 'Senior Engineering Manager',
    difficulty: 'advanced',
    targetLanguage: 'en',
    initialDialogue: "Welcome! Tell me about a time you faced a critical bug in production and how you handled it.",
    expectedLearnerGoal: 'Use the STAR method (Situation, Task, Action, Result) with clear past tense verbs.',
    suggestedResponses: [
      "Last quarter, an unexpected edge case caused latency spikes in our payment pipeline...",
      "I immediately coordinated with the on-call team to isolate the root cause...",
      "Within 30 minutes, we deployed a hotfix and instituted automated integration tests to prevent recurrence.",
    ],
  },
  {
    id: 'rp-3',
    title: 'Airport Check-In & Flight Upgrade',
    emoji: '✈️',
    scenarioRole: 'Airline Counter Agent',
    difficulty: 'intermediate',
    targetLanguage: 'en',
    initialDialogue: "Good morning! May I see your passport and booking reference number, please?",
    expectedLearnerGoal: 'Provide travel documents and politely enquire if window seats or upgrades are available.',
    suggestedResponses: [
      "Here is my passport and confirmation code.",
      "Are there any window seats available towards the front?",
      "Could you let me know if there are upgrade options available for this leg?",
    ],
  },
  {
    id: 'rp-4',
    title: 'Casual Networking at a Tech Meetup',
    emoji: '🤝',
    scenarioRole: 'Fellow Developer at AI Conference',
    difficulty: 'intermediate',
    targetLanguage: 'en',
    initialDialogue: "Hey! That keynote on large language models was mind-blowing. What did you think?",
    expectedLearnerGoal: 'Express your opinion, mention what you are currently building, and exchange contact info.',
    suggestedResponses: [
      "I loved the live latency benchmarks! I've been experimenting with real-time WebSockets myself.",
      "The voice AI demo was definitely the highlight. What stack are you currently using at work?",
      "Let's connect on LinkedIn or GitHub! What's your handle?",
    ],
  },
];

/**
 * Real-time sentence breakdown and grammar correction engine
 */
export function analyzeGrammarAndSentence(inputSentence: string, targetLang: TargetLanguageCode = 'en'): GrammarSentenceAnalysis {
  const trimmed = inputSentence.trim();
  if (!trimmed) {
    return {
      originalSentence: '',
      correctedSentence: "Please enter or speak a sentence to analyze.",
      isCorrect: true,
      confidenceScore: 100,
      targetLanguage: targetLang,
      grammarBreakdown: [],
      betterAlternatives: [],
      phoneticPronunciation: '',
      spokenAudioText: 'Please provide a sentence.',
    };
  }

  const lower = trimmed.toLowerCase();
  let corrected = trimmed;
  let isCorrect = true;
  const breakdown: Array<{ part: string; partOfSpeech: string; role: string; explanation: string }> = [];
  const alternatives: string[] = [];

  // Common ESL error patterns
  if (lower.includes('i have seen him yesterday') || lower.includes('i have visited yesterday') || lower.includes('i seen him yesterday')) {
    corrected = trimmed.replace(/have seen|seen/gi, 'saw').replace(/have visited/gi, 'visited');
    isCorrect = false;
    alternatives.push("I saw him yesterday afternoon.");
    alternatives.push("I met him yesterday.");
  } else if (lower.includes('he do not') || lower.includes('she do not') || lower.includes('it do not')) {
    corrected = trimmed.replace(/\bdo not\b/gi, 'does not').replace(/\bdont\b/gi, "doesn't");
    isCorrect = false;
    alternatives.push(trimmed.replace(/\bdo not\b/gi, 'does not'));
  } else if (lower.includes('explain me') || lower.includes('explain to me this')) {
    corrected = trimmed.replace(/explain me/gi, 'explain this to me');
    isCorrect = false;
    alternatives.push("Could you explain this to me?");
    alternatives.push("Could you elaborate on this for me?");
  } else if (lower.includes('i am agree') || lower.includes('i am agreed')) {
    corrected = trimmed.replace(/i am agree|i am agreed/gi, 'I agree');
    isCorrect = false;
    alternatives.push("I completely agree with you.");
    alternatives.push("I share the exact same view.");
  } else if (lower.includes('did not went') || lower.includes('didn\'t went')) {
    corrected = trimmed.replace(/didn't went|did not went/gi, "didn't go");
    isCorrect = false;
    alternatives.push(trimmed.replace(/didn't went|did not went/gi, "didn't go"));
  } else if (lower.includes('more better') || lower.includes('much more better')) {
    corrected = trimmed.replace(/more better/gi, 'much better');
    isCorrect = false;
    alternatives.push(trimmed.replace(/more better/gi, 'much better'));
  } else {
    // If no explicit error detected, offer natural native polish
    alternatives.push(`In professional settings: "${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}"`);
    alternatives.push(`More casual: "${trimmed.replace(/\bdo not\b/g, "don't").replace(/\bcannot\b/g, "can't")}"`);
  }

  // Parse words into parts of speech breakdown
  const words = trimmed.split(/\s+/);
  words.slice(0, 7).forEach((word) => {
    const cleanWord = word.replace(/[.,?!]/g, '');
    const wLower = cleanWord.toLowerCase();

    let pos = 'Noun / Word';
    let role = 'Sentence constituent';
    let exp = `Used as a key building block in the sentence.`;

    if (['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'].includes(wLower)) {
      pos = 'Pronoun';
      role = 'Subject / Object';
      exp = `Refers to the person or entity taking action.`;
    } else if (['is', 'am', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'go', 'went', 'saw', 'see', 'make', 'code', 'learn'].includes(wLower)) {
      pos = 'Verb (Action/State)';
      role = 'Predicate';
      exp = `Expresses the primary action or state of being.`;
    } else if (['the', 'a', 'an', 'this', 'that', 'these', 'those'].includes(wLower)) {
      pos = 'Article / Determiner';
      role = 'Noun modifier';
      exp = `Specifies whether the noun is general or specific.`;
    } else if (['good', 'great', 'fast', 'smart', 'clear', 'easy', 'better', 'best', 'beautiful'].includes(wLower)) {
      pos = 'Adjective';
      role = 'Descriptor';
      exp = `Describes qualities of the associated noun.`;
    } else if (['quickly', 'clearly', 'yesterday', 'today', 'very', 'extremely', 'always'].includes(wLower)) {
      pos = 'Adverb';
      role = 'Modifier';
      exp = `Modifies verbs, adjectives, or entire clauses.`;
    }

    breakdown.push({
      part: cleanWord,
      partOfSpeech: pos,
      role: role,
      explanation: exp,
    });
  });

  return {
    originalSentence: trimmed,
    correctedSentence: corrected,
    isCorrect: isCorrect,
    confidenceScore: isCorrect ? 98 : 88,
    targetLanguage: targetLang,
    grammarBreakdown: breakdown,
    betterAlternatives: alternatives,
    phoneticPronunciation: `/${trimmed.toLowerCase().replace(/[^a-z ]/g, '')}/`,
    spokenAudioText: corrected,
  };
}
