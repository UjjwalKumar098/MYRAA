import React, { useState } from 'react';
import {
  X,
  Languages,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Play,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Award,
  GraduationCap,
} from 'lucide-react';
import { ContrastMode, TargetLanguageCode, LanguageTopicLesson } from '../types';
import {
  SUPPORTED_TUTOR_LANGUAGES,
  INITIAL_ENGLISH_LESSONS,
  INITIAL_QUIZ_QUESTIONS,
  ROLEPLAY_SCENARIOS,
  analyzeGrammarAndSentence,
} from '../utils/languageTutorData';
import { AudioPlayer } from '../services/AudioPlayer';

interface LanguageTutorModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  audioPlayer?: AudioPlayer;
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
}

export const LanguageTutorModal: React.FC<LanguageTutorModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  audioPlayer,
  onClose,
  onLogVoiceCommand,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<TargetLanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'lessons' | 'analyzer' | 'roleplay' | 'quiz'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<LanguageTopicLesson>(INITIAL_ENGLISH_LESSONS[0]);
  const [inputText, setInputText] = useState('I have seen him yesterday at the office.');
  const [analysisResult, setAnalysisResult] = useState(() => analyzeGrammarAndSentence('I have seen him yesterday at the office.'));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Roleplay State
  const [activeRoleplayIndex, setActiveRoleplayIndex] = useState(0);
  const [roleplayChat, setRoleplayChat] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: ROLEPLAY_SCENARIOS[0].initialDialogue },
  ]);
  const [customUserReply, setCustomUserReply] = useState('');

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const isTrueBlack = contrastMode === 'true-black';

  if (!isOpen) return null;

  const currentLangMeta = SUPPORTED_TUTOR_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_TUTOR_LANGUAGES[0];

  const handleSpeak = async (text: string, langCode: string = currentLangMeta.voiceLangCode, rate: number = 0.9) => {
    if (isSpeaking) {
      if (audioPlayer) audioPlayer.interrupt();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    if (audioPlayer) {
      await audioPlayer.speakCrystalVoice(text, langCode, rate);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langCode;
      u.rate = rate;
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    }
    setIsSpeaking(false);
  };

  const handleAnalyze = () => {
    const result = analyzeGrammarAndSentence(inputText, selectedLanguage);
    setAnalysisResult(result);
    if (onLogVoiceCommand) {
      onLogVoiceCommand(`Analyze sentence: ${inputText}`, 'system', `Grammar score: ${result.confidenceScore}%`);
    }
  };

  const handleSendRoleplayReply = (replyText: string) => {
    if (!replyText.trim()) return;
    const newChat = [...roleplayChat, { sender: 'user' as const, text: replyText }];
    setRoleplayChat(newChat);
    setCustomUserReply('');

    // AI Response simulation with feedback
    setTimeout(() => {
      let aiFollowup = "Excellent phrasing! Your grammar and vocabulary are spot-on. What's the next step you would like to take?";
      if (activeRoleplayIndex === 0) {
        aiFollowup = "Got it! One iced oat milk latte coming right up. That will be $5.50. Would you like a fresh blueberry muffin with that?";
      } else if (activeRoleplayIndex === 1) {
        aiFollowup = "That is a great structured approach to incident response. How did you communicate the downtime status to your external customers?";
      }
      setRoleplayChat((prev) => [...prev, { sender: 'ai' as const, text: aiFollowup }]);
      handleSpeak(aiFollowup, 'en-US');
    }, 600);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    if (optionIdx === INITIAL_QUIZ_QUESTIONS[currentQuizIndex].correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuizIndex < INITIAL_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((i) => i + 1);
    } else {
      setCurrentQuizIndex(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isTrueBlack
            ? 'bg-black border-zinc-700 text-white'
            : 'bg-zinc-950/95 border-amber-500/30 text-zinc-100'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Language Academy & English Tutor
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Multilingual AI
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Master fluent spoken English, grammar rules, native pronunciation, and global languages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector Ribbon */}
        <div className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto border-b border-zinc-800 bg-zinc-900/30 no-scrollbar">
          <span className="text-xs text-zinc-400 whitespace-nowrap font-medium flex items-center gap-1.5 mr-1">
            <Languages className="w-3.5 h-3.5 text-amber-400" /> Target Language:
          </span>
          {SUPPORTED_TUTOR_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold scale-102'
                    : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-700/50'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Navigation */}
        <div className="flex items-center justify-around px-4 border-b border-zinc-800 bg-zinc-900/40 text-xs font-semibold">
          {[
            { id: 'lessons', label: 'Structured Lessons', icon: BookOpen },
            { id: 'analyzer', label: 'Grammar Doctor & Analyzer', icon: Sparkles },
            { id: 'roleplay', label: 'Conversation Practice', icon: MessageSquare },
            { id: 'quiz', label: 'Mastery Quiz', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-all ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: STRUCTURED LESSONS */}
          {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Lesson Directory */}
              <div className="md:col-span-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  English Mastery Modules
                </h3>
                {INITIAL_ENGLISH_LESSONS.map((lesson) => {
                  const isSelected = selectedLesson.id === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-md'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold">
                          {lesson.level}
                        </span>
                        <span className="text-[10px] text-zinc-400 capitalize">{lesson.category.replace('_', ' ')}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{lesson.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{lesson.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Lesson Detail */}
              <div className="md:col-span-8 space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
                <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                      Module Details • {selectedLesson.level.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedLesson.title}</h3>
                    <p className="text-xs text-zinc-300 mt-1">{selectedLesson.description}</p>
                  </div>
                  <button
                    onClick={() => handleSpeak(selectedLesson.keyPhrases.map((p) => p.phrase).join('. '))}
                    className="p-2.5 rounded-xl bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen All</span>
                  </button>
                </div>

                {/* Key Phrases & Pronunciation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Key Phrases & Native Pronunciation
                  </h4>
                  {selectedLesson.keyPhrases.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white tracking-wide">{item.phrase}</p>
                          <p className="text-xs text-amber-400/90 font-mono mt-0.5">{item.phonetic}</p>
                        </div>
                        <button
                          onClick={() => handleSpeak(item.phrase)}
                          className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-amber-300 hover:bg-zinc-700 transition-colors"
                          title="Listen with clear audio"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-zinc-400 italic">Translation: {item.translation}</p>
                      <div className="p-2 rounded-lg bg-black/40 border border-zinc-800/80 text-[11px] text-zinc-300">
                        <span className="font-semibold text-amber-300">Example:</span> {item.exampleUsage}
                      </div>
                      <p className="text-[11px] text-zinc-400">{item.explanation}</p>
                    </div>
                  ))}
                </div>

                {/* Grammar Golden Tip */}
                {selectedLesson.grammarTip && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Golden Grammar Rule: </span>
                      {selectedLesson.grammarTip}
                    </div>
                  </div>
                )}

                {/* Speaking Practice Prompt */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Pronunciation Challenge</span>
                    <p className="text-xs font-semibold text-white mt-0.5">{selectedLesson.practicePrompt}</p>
                  </div>
                  <button
                    onClick={() => handleSpeak(selectedLesson.practicePrompt)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRAMMAR DOCTOR & ANALYZER */}
          {activeTab === 'analyzer' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                  Enter or Speak Any Sentence to Inspect Grammar & Native Phrasing
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type e.g., 'I have seen him yesterday' or 'He do not know this'..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleAnalyze}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze</span>
                  </button>
                </div>

                {/* Quick Test Samples */}
                <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] text-zinc-400 whitespace-nowrap">Try samples:</span>
                  {[
                    'I have seen him yesterday.',
                    'He do not like coffee.',
                    'Please explain me this rule.',
                    'I am agree with your proposal.',
                    'This code is much more better.',
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(sample);
                        setAnalysisResult(analyzeGrammarAndSentence(sample, selectedLanguage));
                      }}
                      className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 text-[11px] hover:bg-zinc-700 whitespace-nowrap border border-zinc-700/50"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analysis Result Card */}
              {analysisResult && (
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      {analysisResult.isCorrect ? (
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {analysisResult.isCorrect ? 'Grammatically Natural & Accurate!' : 'Grammar Correction Suggested'}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Confidence Assessment: {analysisResult.confidenceScore}%
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeak(analysisResult.spokenAudioText)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 text-amber-400 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-2 border border-zinc-700"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Speak Corrected</span>
                    </button>
                  </div>

                  {/* Original vs Corrected */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Your Input</span>
                      <p className="text-sm text-zinc-300 font-medium mt-1">{analysisResult.originalSentence}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                        Polished & Corrected
                      </span>
                      <p className="text-sm text-white font-bold mt-1">{analysisResult.correctedSentence}</p>
                    </div>
                  </div>

                  {/* Parts of Speech Breakdown */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                      Grammar & Parts-of-Speech Breakdown
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {analysisResult.grammarBreakdown.map((part, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                          <span className="font-bold text-amber-400 text-sm block">"{part.part}"</span>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">{part.partOfSpeech}</span>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-tight">{part.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Better Alternatives */}
                  {analysisResult.betterAlternatives.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Native Expressions & Alternatives
                      </h5>
                      <div className="space-y-1.5">
                        {analysisResult.betterAlternatives.map((alt, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs text-zinc-200"
                          >
                            <span className="font-medium">{alt}</span>
                            <button
                              onClick={() => handleSpeak(alt)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ROLEPLAY CONVERSATION */}
          {activeTab === 'roleplay' && (
            <div className="space-y-5">
              {/* Scenario Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROLEPLAY_SCENARIOS.map((scen, idx) => {
                  const isSelected = activeRoleplayIndex === idx;
                  return (
                    <div
                      key={scen.id}
                      onClick={() => {
                        setActiveRoleplayIndex(idx);
                        setRoleplayChat([{ sender: 'ai', text: scen.initialDialogue }]);
                        handleSpeak(scen.initialDialogue);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-md'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{scen.emoji}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{scen.title}</h4>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{scen.scenarioRole}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Simulation Area */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col h-[360px]">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {roleplayChat.map((msg, idx) => {
                    const isAi = msg.sender === 'ai';
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                      >
                        {isAi && (
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                            AI
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                            isAi
                              ? 'bg-zinc-800/90 text-zinc-100 rounded-tl-none border border-zinc-700/50'
                              : 'bg-amber-500 text-black font-medium rounded-tr-none shadow-md'
                          }`}
                        >
                          <p>{msg.text}</p>
                          {isAi && (
                            <button
                              onClick={() => handleSpeak(msg.text)}
                              className="mt-1.5 text-[10px] text-amber-400 flex items-center gap-1 hover:underline"
                            >
                              <Volume2 className="w-3 h-3" /> Listen
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Suggested Quick Replies */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Suggested Responses:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {ROLEPLAY_SCENARIOS[activeRoleplayIndex].suggestedResponses.map((sugg, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendRoleplayReply(sugg)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 whitespace-nowrap border border-zinc-700 flex items-center gap-1.5"
                      >
                        <span>{sugg}</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    ))}
                  </div>

                  {/* Custom Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUserReply}
                      onChange={(e) => setCustomUserReply(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendRoleplayReply(customUserReply)}
                      placeholder="Type your spoken reply in English..."
                      className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleSendRoleplayReply(customUserReply)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MASTERY QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Question {currentQuizIndex + 1} of {INITIAL_QUIZ_QUESTIONS.length}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-xs font-mono font-bold text-amber-300">
                    Score: {quizScore}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {INITIAL_QUIZ_QUESTIONS[currentQuizIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {INITIAL_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === INITIAL_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                    let btnStyle = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                    <span className="font-bold text-amber-300">Explanation:</span>
                    <p>{INITIAL_QUIZ_QUESTIONS[currentQuizIndex].explanation}</p>
                  </div>
                )}

                {selectedOption !== null && (
                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>
                      {currentQuizIndex < INITIAL_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Speech Synthesis Engine: Active & Crystal Clear (24kHz)</span>
          </div>
          <button
            onClick={() => handleSpeak("Welcome to Myraa Language Academy! I am your AI personal tutor ready to guide your fluency in English and beyond.")}
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Volume2 className="w-3.5 h-3.5" /> Test Tutor Voice
          </button>
        </div>
      </div>
    </div>
  );
};
