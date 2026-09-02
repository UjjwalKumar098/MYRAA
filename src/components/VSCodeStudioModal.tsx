import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Code2,
  Terminal,
  Play,
  Copy,
  Check,
  Sparkles,
  FileCode,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Save,
  Download,
  ExternalLink,
  Eye,
  Search,
  RefreshCw,
  Sliders,
  Cpu,
  GitBranch,
  Layers,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';
import { ContrastMode, VSCodeWorkspaceFile, VSCodeTerminalCommand, ProgrammingLanguage } from '../types';
import {
  getStoredWorkspaceFiles,
  saveStoredWorkspaceFiles,
  executeTerminalCommand,
  executeCodeInBrowser,
  INITIAL_VSCODE_FILES,
} from '../utils/vscodeWorkspaceData';

interface VSCodeStudioModalProps {
  isOpen: boolean;
  contrastMode?: ContrastMode;
  initialFileId?: string;
  onClose: () => void;
  onLogVoiceCommand?: (command: string, category: any, details?: string, source?: any) => void;
  onToolActivity?: (toolName: string, detail: string) => void;
}

export const VSCodeStudioModal: React.FC<VSCodeStudioModalProps> = ({
  isOpen,
  contrastMode = 'cosmic',
  initialFileId,
  onClose,
  onLogVoiceCommand,
  onToolActivity,
}) => {
  const [files, setFiles] = useState<VSCodeWorkspaceFile[]>(getStoredWorkspaceFiles);
  const [activeFileId, setActiveFileId] = useState<string>(() => {
    return initialFileId || files[0]?.id || 'file-app-tsx';
  });
  const [openFileIds, setOpenFileIds] = useState<string[]>(() => {
    return [files[0]?.id || 'file-app-tsx', files[1]?.id || 'file-calculator-ts'].filter(Boolean);
  });

  // Sidebar views: 'explorer' | 'search' | 'git' | 'copilot' | 'terminal' | 'preview'
  const [activeSideNav, setActiveSideNav] = useState<'explorer' | 'search' | 'copilot' | 'terminal' | 'preview'>('explorer');

  // Bottom pane view: 'terminal' | 'output' | 'preview' | 'closed'
  const [bottomPane, setBottomPane] = useState<'terminal' | 'output' | 'preview' | 'closed'>('output');

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<VSCodeTerminalCommand[]>([
    {
      id: 'cmd-init',
      command: 'npm run dev',
      output: '[Myraa VS Code Web Studio v2.4]\nWorkspace mounted in container.\nTypeScript compiler active. Type "help" for commands.',
      exitCode: 0,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Editor Search / Replace state
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Runner state
  const [executionResult, setExecutionResult] = useState<{ output: string; timeMs: number; success: boolean } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Copilot state
  const [copilotPrompt, setCopilotPrompt] = useState('Create a custom React hook for debouncing input with TypeScript generics');
  const [copilotGeneratedCode, setCopilotGeneratedCode] = useState('');
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState(false);

  // UI state
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTrueBlack = contrastMode === 'true-black';

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Save to LocalStorage whenever files update
  useEffect(() => {
    saveStoredWorkspaceFiles(files);
  }, [files]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (bottomPane === 'terminal') {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, bottomPane]);

  if (!isOpen) return null;

  // Handle file switching
  const handleSelectFile = (fileId: string) => {
    setActiveFileId(fileId);
    if (!openFileIds.includes(fileId)) {
      setOpenFileIds((prev) => [...prev, fileId]);
    }
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    const updated = openFileIds.filter((id) => id !== fileId);
    setOpenFileIds(updated);
    if (activeFileId === fileId && updated.length > 0) {
      setActiveFileId(updated[updated.length - 1]);
    }
  };

  // Handle direct code typing
  const handleCodeChange = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === activeFileId) {
          return {
            ...f,
            content: newContent,
            isModified: true,
            lastSaved: Date.now(),
          };
        }
        return f;
      })
    );
  };

  // Handle Save File
  const handleSaveFile = () => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, isModified: false, lastSaved: Date.now() } : f))
    );
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
    onToolActivity?.('vscode', `Saved ${activeFile?.name || 'file'}`);
  };

  // Handle Execute Current Code
  const handleRunCode = () => {
    if (!activeFile) return;
    setIsExecuting(true);
    setBottomPane('output');

    setTimeout(() => {
      const res = executeCodeInBrowser(activeFile.content, activeFile.language);
      setExecutionResult(res);
      setIsExecuting(false);
      onToolActivity?.('codeRunner', `Ran ${activeFile.name} (${res.timeMs}ms)`);
      if (onLogVoiceCommand) {
        onLogVoiceCommand(`Run ${activeFile.name}`, 'tool_call', `Execution returned status ${res.success ? 'OK' : 'ERROR'}`);
      }
    }, 250);
  };

  // Handle Terminal submit
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput;
    setTerminalInput('');

    const res = executeTerminalCommand(cmd, files);
    if (res.output === 'CLEARED') {
      setTerminalHistory([]);
      return;
    }

    setTerminalHistory((prev) => [...prev, res]);
    onToolActivity?.('terminal', `Executed: "${cmd}"`);
  };

  // Handle AI Copilot generation
  const handleGenerateCopilotCode = () => {
    if (!copilotPrompt.trim()) return;
    setIsGeneratingCopilot(true);

    setTimeout(() => {
      const generated = `/**
 * Generated by Myraa VS Code Copilot
 * Prompt: "${copilotPrompt}"
 */
export function useDebouncedState<T>(initialValue: T, delayMs: number = 300) {
  const [value, setValue] = React.useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return [debouncedValue, setValue, value] as const;
}`;
      setCopilotGeneratedCode(generated);
      setIsGeneratingCopilot(false);
      onToolActivity?.('copilot', `Generated solution for "${copilotPrompt.substring(0, 30)}..."`);
    }, 600);
  };

  // Insert generated code into active file
  const handleInsertCopilotCode = () => {
    if (!activeFile || !copilotGeneratedCode) return;
    const updated = `${activeFile.content}\n\n${copilotGeneratedCode}`;
    handleCodeChange(updated);
    setBottomPane('output');
    setExecutionResult({
      output: `✓ Copilot code successfully inserted into ${activeFile.name}!`,
      timeMs: 5,
      success: true,
    });
  };

  // Create new file
  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const name = newFileName.trim();
    let lang: ProgrammingLanguage | 'json' | 'css' | 'html' = 'typescript';
    if (name.endsWith('.py')) lang = 'python';
    else if (name.endsWith('.sql')) lang = 'sql';
    else if (name.endsWith('.html')) lang = 'html';
    else if (name.endsWith('.json')) lang = 'json';
    else if (name.endsWith('.css')) lang = 'css';
    else if (name.endsWith('.js')) lang = 'javascript';
    else if (name.endsWith('.tsx') || name.endsWith('.jsx')) lang = 'react';

    const newFile: VSCodeWorkspaceFile = {
      id: `file_${Date.now()}`,
      name,
      path: `src/${name}`,
      language: lang,
      content: `// ${name}\n// Created in Myraa VS Code Web IDE\n\nconsole.log('Hello from ${name}');\n`,
      isModified: false,
      lastSaved: Date.now(),
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setOpenFileIds((prev) => [...prev, newFile.id]);
    setNewFileName('');
    setIsAddingFile(false);
    onToolActivity?.('vscode', `Created file ${name}`);
  };

  // Delete file
  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setOpenFileIds((prev) => prev.filter((id) => id !== fileId));
    if (activeFileId === fileId) {
      const remaining = files.filter((f) => f.id !== fileId);
      setActiveFileId(remaining[0]?.id || '');
    }
  };

  // Download active file
  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Open in VS Code Desktop URL Protocol
  const handleOpenVSCodeDesktop = () => {
    const protocolUrl = `vscode://file/${activeFile?.path || 'workspace'}`;
    window.location.href = protocolUrl;
    onToolActivity?.('vscodeDesktop', `Triggered desktop VS Code protocol for ${activeFile?.name}`);
  };

  // Open VS Code for Web
  const handleOpenVSCodeWeb = () => {
    window.open('https://vscode.dev', '_blank');
  };

  // Copy code
  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle Tab key in Textarea for 2-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      target.value = value.substring(0, start) + '  ' + value.substring(end);
      target.selectionStart = target.selectionEnd = start + 2;
      handleCodeChange(target.value);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveFile();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearchBox((prev) => !prev);
    }
  };

  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
    const lines = text.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const activeLines = activeFile ? activeFile.content.split('\n') : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-6xl h-[92vh] rounded-2xl'
        } flex flex-col border shadow-2xl overflow-hidden ${
          isTrueBlack
            ? 'bg-[#0f0f11] border-neutral-800 text-neutral-100'
            : 'bg-[#18181b] border-cyan-500/30 text-neutral-100'
        }`}
      >
        {/* ================= TOP TITLE BAR ================= */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e24] border-b border-neutral-800/80 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Code2 className="w-4 h-4" />
              <span className="text-xs font-bold font-mono tracking-tight text-white">
                VS CODE STUDIO & DIRECT IDE
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" /> main
              </span>
              <span>•</span>
              <span className="text-neutral-300 font-mono">{activeFile?.path || 'workspace'}</span>
              {activeFile?.isModified && (
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Unsaved changes" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Run button */}
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              title="Run Code (Ctrl + Enter)"
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
            </button>

            {/* Desktop VS Code trigger */}
            <button
              onClick={handleOpenVSCodeDesktop}
              title="Open in VS Code Desktop Application (vscode:// protocol)"
              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1 transition-all hidden md:flex"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open Desktop VS Code</span>
            </button>

            {/* Web VS Code trigger */}
            <button
              onClick={handleOpenVSCodeWeb}
              title="Open in VS Code Web (vscode.dev)"
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1 transition-all hidden lg:flex"
            >
              <ExternalLink className="w-3 h-3 text-neutral-400" />
              <span>vscode.dev</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Close VS Code Studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= MAIN WORKSPACE BODY ================= */}
        <div className="flex-1 flex overflow-hidden">
          {/* 1. LEFT ACTIVITY BAR */}
          <div className="w-12 bg-[#121216] border-r border-neutral-800 flex flex-col items-center py-3 gap-3 select-none">
            {[
              { id: 'explorer', icon: Folder, label: 'Explorer & Files' },
              { id: 'search', icon: Search, label: 'Search in Workspace' },
              { id: 'copilot', icon: Sparkles, label: 'AI Copilot Code Writer' },
              { id: 'terminal', icon: Terminal, label: 'Integrated Terminal' },
              { id: 'preview', icon: Eye, label: 'Live HTML/React Preview' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSideNav === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSideNav(tab.id as any);
                    if (tab.id === 'terminal') setBottomPane('terminal');
                    if (tab.id === 'preview') setBottomPane('preview');
                  }}
                  title={tab.label}
                  className={`relative p-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-md'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isActive && <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-r" />}
                </button>
              );
            })}
          </div>

          {/* 2. SIDEBAR PANEL */}
          <div className="w-56 sm:w-64 bg-[#18181f] border-r border-neutral-800 flex flex-col overflow-y-auto select-none">
            {/* Sidebar View 1: FILE EXPLORER */}
            {activeSideNav === 'explorer' && (
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Explorer
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAddingFile((p) => !p)}
                      title="New File"
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFiles(INITIAL_VSCODE_FILES)}
                      title="Reset Default Files"
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add new file form */}
                {isAddingFile && (
                  <form onSubmit={handleCreateFile} className="p-2 rounded-lg bg-black/50 border border-cyan-500/40 space-y-2">
                    <input
                      type="text"
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g. Counter.tsx or test.py"
                      className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingFile(false)}
                        className="px-2 py-0.5 rounded text-[10px] text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded bg-cyan-500 text-black font-bold text-[10px]"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                )}

                {/* Files Tree */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 px-1.5 py-1">
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>MYRAA WORKSPACE</span>
                  </div>

                  {files.map((file) => {
                    const isSelected = file.id === activeFileId;
                    return (
                      <div
                        key={file.id}
                        onClick={() => handleSelectFile(file.id)}
                        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                            : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                          <span className="truncate font-mono text-[11px]">{file.name}</span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          {files.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteFile(file.id, e)}
                              className="p-1 rounded text-neutral-500 hover:text-rose-400"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sidebar View 2: COPILOT CODE WRITER */}
            {activeSideNav === 'copilot' && (
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Copilot Direct Writer</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Describe any logic, component, hook, or algorithm to write directly into your project.
                </p>

                <textarea
                  value={copilotPrompt}
                  onChange={(e) => setCopilotPrompt(e.target.value)}
                  rows={4}
                  placeholder="e.g. Build an Express middleware for API token authentication..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
                />

                <button
                  onClick={handleGenerateCopilotCode}
                  disabled={isGeneratingCopilot}
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingCopilot ? 'Generating Code...' : 'Write Code With AI'}</span>
                </button>

                {copilotGeneratedCode && (
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Generated Snippet:</span>
                    <pre className="p-2 rounded-lg bg-black text-[10px] font-mono text-cyan-300 max-h-36 overflow-y-auto leading-tight">
                      <code>{copilotGeneratedCode}</code>
                    </pre>
                    <button
                      onClick={handleInsertCopilotCode}
                      className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Insert Directly into Active File</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sidebar View 3: SEARCH & REPLACE */}
            {activeSideNav === 'search' && (
              <div className="p-3 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Search & Replace
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in current file..."
                  className="w-full p-2 rounded-lg bg-black/60 border border-neutral-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with..."
                  className="w-full p-2 rounded-lg bg-black/60 border border-neutral-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  onClick={() => {
                    if (!activeFile || !searchQuery) return;
                    const updated = activeFile.content.replaceAll(searchQuery, replaceQuery);
                    handleCodeChange(updated);
                    onToolActivity?.('vscode', `Replaced occurrences of "${searchQuery}"`);
                  }}
                  className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                >
                  Replace All Occurrences
                </button>
              </div>
            )}
          </div>

          {/* 3. CENTER EDITOR & MAIN CANVAS */}
          <div className="flex-1 flex flex-col bg-[#141418] overflow-hidden">
            {/* TABS HEADER */}
            <div className="flex items-center justify-between bg-[#1e1e24] border-b border-neutral-800 px-2 overflow-x-auto no-scrollbar select-none">
              <div className="flex items-center gap-1">
                {openFileIds.map((fileId) => {
                  const file = files.find((f) => f.id === fileId);
                  if (!file) return null;
                  const isActive = file.id === activeFileId;
                  return (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileId(file.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs border-r border-neutral-800 cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#141418] text-white font-medium border-t-2 border-t-cyan-400'
                          : 'bg-[#1a1a20] text-neutral-400 hover:text-neutral-200 hover:bg-[#1e1e26]'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
                      <span className="font-mono text-[11px]">{file.name}</span>
                      {file.isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />}
                      <button
                        onClick={(e) => handleCloseTab(e, file.id)}
                        className="p-0.5 rounded text-neutral-500 hover:text-white hover:bg-neutral-700/50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Editor Quick Actions */}
              <div className="flex items-center gap-1 px-2">
                <button
                  onClick={handleSaveFile}
                  title="Save File (Ctrl + S)"
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                    isSavedRecently
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {isSavedRecently ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-neutral-400" />}
                  <span>{isSavedRecently ? 'Saved!' : 'Save'}</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  title="Copy File Content"
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleDownloadFile}
                  title="Download File"
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* DIRECT CODE EDITING AREA */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Line Numbers Gutter */}
              <div className="w-12 bg-[#121216] border-r border-neutral-800/80 select-none py-3 text-right pr-3 font-mono text-[11px] text-neutral-600 space-y-0 leading-[1.625rem] overflow-hidden">
                {activeLines.map((_, idx) => (
                  <div
                    key={idx}
                    className={cursorPos.line === idx + 1 ? 'text-cyan-400 font-bold' : ''}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Live Interactive Code Textarea */}
              <textarea
                ref={textareaRef}
                value={activeFile?.content || ''}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={handleCursorMove}
                onKeyUp={handleCursorMove}
                spellCheck={false}
                className="flex-1 p-3 bg-transparent text-cyan-200 font-mono text-xs leading-[1.625rem] resize-none focus:outline-none selection:bg-cyan-500/30 overflow-y-auto whitespace-pre tab-4"
                placeholder="// Write or paste your code directly here..."
              />
            </div>

            {/* ================= BOTTOM PANE: TERMINAL / OUTPUT / PREVIEW ================= */}
            {bottomPane !== 'closed' && (
              <div className="h-56 bg-[#101014] border-t border-neutral-800 flex flex-col overflow-hidden">
                {/* Bottom Pane Tabs */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181e] border-b border-neutral-800 select-none">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <button
                      onClick={() => setBottomPane('output')}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        bottomPane === 'output' ? 'text-cyan-400' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Play className="w-3 h-3" /> Output & Telemetry
                    </button>
                    <button
                      onClick={() => setBottomPane('terminal')}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        bottomPane === 'terminal' ? 'text-cyan-400' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="w-3 h-3" /> Bash Terminal
                    </button>
                    <button
                      onClick={() => setBottomPane('preview')}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        bottomPane === 'preview' ? 'text-cyan-400' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Live HTML/React Preview
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setBottomPane('closed')}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                      title="Minimize Panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pane 1: OUTPUT */}
                {bottomPane === 'output' && (
                  <div className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-relaxed text-emerald-400 bg-black/70">
                    {executionResult ? (
                      <div className="space-y-1">
                        <div className="text-[10px] text-neutral-400">
                          Execution time: {executionResult.timeMs}ms • Status: {executionResult.success ? 'SUCCESS' : 'ERROR'}
                        </div>
                        <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
                      </div>
                    ) : (
                      <div className="text-neutral-500">
                        Ready to execute. Click &ldquo;Run Code&rdquo; or press (Ctrl + Enter) to test this script.
                      </div>
                    )}
                  </div>
                )}

                {/* Pane 2: TERMINAL */}
                {bottomPane === 'terminal' && (
                  <div className="flex-1 flex flex-col p-3 overflow-y-auto font-mono text-xs bg-black text-neutral-200">
                    <div className="flex-1 space-y-2 overflow-y-auto">
                      {terminalHistory.map((item) => (
                        <div key={item.id} className="space-y-0.5">
                          <div className="flex items-center gap-2 text-cyan-400">
                            <span className="text-emerald-400">myraa-dev@workspace:~$</span>
                            <span>{item.command}</span>
                          </div>
                          <pre className="text-neutral-300 whitespace-pre-wrap pl-2 leading-tight">
                            {item.output}
                          </pre>
                        </div>
                      ))}
                      <div ref={terminalBottomRef} />
                    </div>

                    <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                      <span className="text-emerald-400">myraa-dev@workspace:~$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Type 'help', 'npm run build', 'tsc', 'ls', or 'node ...'"
                        className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
                      />
                    </form>
                  </div>
                )}

                {/* Pane 3: LIVE PREVIEW IFRAME */}
                {bottomPane === 'preview' && (
                  <div className="flex-1 bg-neutral-900 overflow-hidden relative">
                    <iframe
                      title="VS Code Live Preview"
                      srcDoc={
                        activeFile?.language === 'html'
                          ? activeFile.content
                          : `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-neutral-950 text-white p-6 font-sans"><div class="p-6 rounded-2xl bg-neutral-900 border border-cyan-500/40 text-center"><h2 class="text-xl font-bold text-cyan-400 mb-2">Live Component Preview</h2><p class="text-xs text-neutral-400">Viewing active file: ${activeFile?.name}</p><div class="mt-4 p-4 rounded-xl bg-black/60 font-mono text-xs text-left text-cyan-200 whitespace-pre-wrap">${activeFile?.content.substring(0, 300)}...</div></div></body></html>`
                      }
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ================= STATUS BAR ================= */}
            <div className="flex items-center justify-between px-3 py-1 bg-[#181820] border-t border-neutral-800 text-[11px] font-mono text-neutral-400 select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Flame className="w-3 h-3" /> Ready
                </span>
                <span>
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </span>
                <span>Spaces: 2</span>
                <span>UTF-8</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="uppercase text-cyan-300 font-semibold">{activeFile?.language || 'typescript'}</span>
                <span className="text-neutral-500">TypeScript 5.4 AST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
