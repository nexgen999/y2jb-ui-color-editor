/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Download, RefreshCcw, Palette, Terminal, Layout, Check, Type } from 'lucide-react';

const INITIAL_COLORS = {
  bgColor: '#272727',
  titleColor: '#ccc',
  logBgColor: '#000',
  borderColor: 'red',
  progressLabelColor: '#fff',
  progressBarColor: '#aa0000',
  logInfoColor: '#ccc',
  logSuccessColor: 'lightgreen',
  logErrorColor: 'red',
  logWarningColor: 'yellow',
};

const INITIAL_TEXTS = {
  titleText: 'Y2JB Autoloader',
  versionString: 'Y2JB 1.3 by Gezine',
  autoloaderVersion: 'v0.5',
};

const COLOR_LABELS = {
  bgColor: 'Fond Interface',
  titleColor: 'Texte Principal',
  logBgColor: 'Fond Console',
  borderColor: 'Bordures & Rails',
  progressLabelColor: 'Texte Progression',
  progressBarColor: 'Barre de Progression',
  logInfoColor: 'Logs: Info',
  logSuccessColor: 'Logs: Succès',
  logErrorColor: 'Logs: Erreur',
  logWarningColor: 'Logs: Alerte',
};

export default function App() {
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [texts, setTexts] = useState(INITIAL_TEXTS);
  const [useBgImage, setUseBgImage] = useState(false);
  const [bgTimestamp, setBgTimestamp] = useState(Date.now());
  const [scale, setScale] = useState(0.4);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const scaleW = (width * 0.95) / 1920;
        const scaleH = (height * 0.95) / 1080;
        setScale(Math.min(scaleW, scaleH));
      }
    };
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

  const handleColorChange = (key: keyof typeof INITIAL_COLORS, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleTextChange = (key: keyof typeof INITIAL_TEXTS, value: string) => {
    setTexts((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefault = () => {
    setColors(INITIAL_COLORS);
    setTexts(INITIAL_TEXTS);
  };

  const generateFullJS = async () => {
    // On va chercher le fichier main.js directement pour s'assurer d'avoir l'original exact
    try {
      const response = await fetch('/main.js');
      let content = await response.text();
      
      // Sécurité supplémentaire: on retire d'éventuels commentaires injectés par Vite en dev
      content = content.split('//# sourceMappingURL=')[0].trim();
      
      // Remplacements précis
      content = content.replace('const version_string = "Y2JB 1.3 by Gezine";', `const version_string = "${texts.versionString}";`);
      content = content.replace('const autoloader_version = "v0.5";', `const autoloader_version = "${texts.autoloaderVersion}";`);
      
      if (useBgImage) {
        content = content.replace('autoloader_ui.style.backgroundColor = "#272727";', `autoloader_ui.style.backgroundImage = "url('background.jpg')"; autoloader_ui.style.backgroundSize = "cover"; autoloader_ui.style.backgroundPosition = "center";`);
      } else {
        content = content.replace('autoloader_ui.style.backgroundColor = "#272727";', `autoloader_ui.style.backgroundColor = "${colors.bgColor}";`);
      }
      
      content = content.replace('title.style.color = "#ccc";', `title.style.color = "${colors.titleColor}";`);
      content = content.replace('title.textContent = "Y2JB Autoloader";', `title.textContent = "${texts.titleText}";`);
      
      content = content.replace('logWrapper.style.color = "#ccc";', `logWrapper.style.color = "${colors.logInfoColor}";`);
      content = content.replace('logWrapper.style.backgroundColor = "#000";', `logWrapper.style.backgroundColor = "${colors.logBgColor}";`);
      content = content.replace('logWrapper.style.border = "2px solid red";', `logWrapper.style.border = "2px solid ${colors.borderColor}";`);
      
      content = content.replace('progressBarContainer.style.border = "2px solid red";', `progressBarContainer.style.border = "2px solid ${colors.borderColor}";`);
      content = content.replace('progressLabel.style.color = "#fff";', `progressLabel.style.color = "${colors.progressLabelColor}";`);
      content = content.replace('progressBar.style.backgroundColor = "#aa0000";', `progressBar.style.backgroundColor = "${colors.progressBarColor}";`);
      
      content = content.replace('logEntry.style.color = "red";', `logEntry.style.color = "${colors.logErrorColor}";`);
      content = content.replace('logEntry.style.color = "lightgreen";', `logEntry.style.color = "${colors.logSuccessColor}";`);
      content = content.replace('logEntry.style.color = "yellow";', `logEntry.style.color = "${colors.logWarningColor}";`);
      content = content.replace('logEntry.style.color = "#ccc";', `logEntry.style.color = "${colors.logInfoColor}";`);

      return content;
    } catch (e) {
      console.error("Erreur lors de la lecture de main.js", e);
      return "// Erreur: Impossible de charger main.js";
    }
  };

  const handleDownload = async () => {
    const content = await generateFullJS();
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#0A0B0E] text-[#E0E2E6] font-sans overflow-hidden">
      {/* Sidebar: Editor */}
      <aside className="w-96 border-r border-[#1E2028] bg-[#0F1115] p-8 flex flex-col gap-8 overflow-y-auto shrink-0">
        <div className="flex items-center gap-4 pb-6 border-b border-[#1E2028]">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Main.js Editor</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none mt-1">Color Injector</p>
          </div>
        </div>

        {/* Text Customization */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Type className="w-3 h-3 text-indigo-400" /> Titre Interface
            </label>
            <input
              type="text"
              value={texts.titleText}
              onChange={(e) => handleTextChange('titleText', e.target.value)}
              className="w-full bg-[#1E2028] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Terminal className="w-3 h-3 text-indigo-400" /> Version
            </label>
            <input
              type="text"
              value={texts.versionString}
              onChange={(e) => handleTextChange('versionString', e.target.value)}
              className="w-full bg-[#1E2028] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <RefreshCcw className="w-3 h-3 text-indigo-400" /> Autoloader Version
            </label>
            <input
              type="text"
              value={texts.autoloaderVersion}
              onChange={(e) => handleTextChange('autoloaderVersion', e.target.value)}
              className="w-full bg-[#1E2028] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Colors Section */}
        <div className="space-y-6 flex-1">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Fond Interface</label>
            <button 
              onClick={() => {
                const newValue = !useBgImage;
                setUseBgImage(newValue);
                if (newValue) setBgTimestamp(Date.now());
              }}
              className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${useBgImage ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              {useBgImage ? 'IMAGE (background.jpg)' : 'COULEUR UNIE'}
            </button>
          </div>
          {useBgImage && (
            <p className="text-[10px] text-white/30 px-1 mt-[-15px]">
              Placez un fichier <code className="text-indigo-400">background.jpg</code> dans le dossier du projet pour voir l'aperçu.
            </p>
          )}
          
          <div className="space-y-3">
            {Object.entries(colors).map(([key, value]) => {
              if (key === 'bgColor' && useBgImage) return null;
              
              return (
                <div key={key} className="flex items-center justify-between bg-[#1E2028]/50 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden relative shadow-inner group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: value }}
                    >
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof typeof INITIAL_COLORS, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                    <span className="text-xs text-white/80 font-semibold">{COLOR_LABELS[key as keyof typeof INITIAL_COLORS]}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/20 uppercase pr-2 group-hover:text-indigo-400/50 transition-colors">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#1E2028] space-y-4">
          <button
            onClick={resetToDefault}
            className="w-full flex items-center justify-center gap-2 py-3 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-xl transition-all text-xs font-medium"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl text-sm font-bold shadow-2xl shadow-indigo-900/40 transition-all transform active:scale-95 group"
          >
            <Download className="w-5 h-5 group-hover:bounce" />
            Exporter main.js
          </button>

          <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
            <p className="text-[10px] text-indigo-300/40 leading-relaxed text-center">
              Le fichier exporté est prêt à l'emploi. Seules les valeurs de texte et de couleur sont injectées.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 bg-[#050608] relative flex flex-col items-center justify-center p-4 overflow-hidden" ref={containerRef}>
        <div className="absolute top-6 left-8 flex items-center gap-3 opacity-30 select-none z-20">
          <Layout className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">Live Feed Preview (1920x1080)</span>
        </div>

        {/* Centered Scalable Canvas Container */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none relative">
            <motion.div
              animate={{ scale: scale }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] rounded-sm overflow-hidden ring-1 ring-white/10 shrink-0"
              style={{
                width: '1920px',
                height: '1080px',
                backgroundColor: colors.bgColor,
                backgroundImage: useBgImage ? `url('/background.jpg?t=${bgTimestamp}')` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transformOrigin: 'center center'
              }}
            >
            {/* Real Interface Content @ 1920x1080 */}
            <div className="w-full h-full flex flex-col items-center">
              <div className="mt-[180px]">
                <h1 className="font-mono font-bold tracking-tighter text-center" style={{ fontSize: '100px', color: colors.titleColor }}>
                  {texts.titleText}
                </h1>
              </div>

              <div
                className="mt-[80px] p-12 font-mono overflow-hidden flex flex-col justify-end"
                style={{
                  width: '1200px',
                  height: '600px',
                  backgroundColor: colors.logBgColor,
                  border: `4px solid ${colors.borderColor}`,
                  borderRadius: '24px',
                  fontSize: '44px',
                }}
              >
                <div className="space-y-4">
                  <div style={{ color: colors.logSuccessColor }}>Autoloader {texts.autoloaderVersion} by PLK</div>
                  <div style={{ color: colors.logWarningColor }}>Running userland exploit...</div>
                  <div style={{ color: colors.logSuccessColor }}>{texts.versionString}</div>
                  <div style={{ color: colors.logInfoColor }}>FW: 7.61</div>
                  <div style={{ color: colors.logWarningColor }}>Running kernel exploit...</div>
                  <div style={{ color: colors.logSuccessColor }}>Y2JB Lapse 1.1 by Gezine</div>
                  <div style={{ color: colors.logWarningColor }}>Kernel exploit finished.</div>
                  <div style={{ color: colors.logInfoColor }} className="opacity-60 overflow-hidden text-ellipsis whitespace-nowrap">
                    Found autoload config at: /mnt/sandbox/PPSA01650_000/download0/cache/...
                  </div>
                  <div style={{ color: colors.logErrorColor }}>[ERROR] Failed to find payload</div>
                  <div style={{ color: colors.logInfoColor }}>Autoload finished.</div>
                </div>
              </div>

              <div
                className="mt-[60px] relative overflow-hidden flex items-center justify-center font-mono font-bold uppercase tracking-widest"
                style={{
                  width: '1160px',
                  height: '140px',
                  backgroundColor: '#202020',
                  border: `4px solid ${colors.borderColor}`,
                  borderRadius: '35px',
                }}
              >
                <span className="z-10" style={{ fontSize: '56px', color: colors.progressLabelColor }}>
                  Autoload finished.
                </span>
                <div
                  className="absolute left-0 top-0 bottom-0"
                  style={{ width: '100%', backgroundColor: colors.progressBarColor }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scaling Indicator */}
        <div className="absolute bottom-6 right-8 text-[10px] text-white/20 font-mono tracking-widest uppercase flex items-center gap-6 z-20">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Status: Online</div>
          <span>Canvas: 1920x1080 Native</span>
          <span className="text-indigo-400">Auto-Scale: {(scale * 100).toFixed(1)}%</span>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .shrink-0 { flex-shrink: 0; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .group-hover\\:bounce { animation: bounce 0.5s ease infinite; }
      `}} />
    </div>
  );
}
