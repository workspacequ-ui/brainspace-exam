import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Code,
  Sigma,
  Eraser,
  Eye,
  FileCode,
  Palette,
  Upload,
  Sparkles,
  Maximize2,
  X,
  Check,
  Type
} from 'lucide-react';

interface CbtRichTextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  onTextAlignChange?: (align: 'left' | 'center' | 'right' | 'justify') => void;
  compact?: boolean;
}

export const CbtRichTextEditor: React.FC<CbtRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan teks / naskah...',
  rows = 3,
  label,
  textAlign = 'left',
  onTextAlignChange,
  compact = false
}) => {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Math Modal state
  const [latexExpr, setLatexExpr] = useState('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const [katexPreview, setKatexPreview] = useState('');

  // Image Modal state
  const [imageUrl, setImageUrl] = useState('');
  const [imageSize, setImageSize] = useState<'25' | '50' | '75' | '100'>('50');
  const [imageCaption, setImageCaption] = useState('');

  // Video Modal state
  const [videoUrl, setVideoUrl] = useState('');

  // Link Modal state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Editor ref
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync value to contentEditable when not in HTML source mode
  useEffect(() => {
    if (editorRef.current && !showHtmlSource) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, showHtmlSource]);

  // Update KaTeX Preview
  useEffect(() => {
    try {
      if (latexExpr.trim()) {
        const html = katex.renderToString(latexExpr, {
          throwOnError: false,
          displayMode: true
        });
        setKatexPreview(html);
      } else {
        setKatexPreview('');
      }
    } catch {
      setKatexPreview('<span class="text-rose-400">Formula LaTeX tidak valid</span>');
    }
  }, [latexExpr]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, valueArgument: string = '') => {
    if (!showHtmlSource && editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, valueArgument);
      handleEditorInput();
    }
  };

  const insertHtmlAtCursor = (htmlToInsert: string) => {
    if (showHtmlSource) {
      onChange((value || '') + htmlToInsert);
      return;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement('div');
        el.innerHTML = htmlToInsert;
        const frag = document.createDocumentFragment();
        let node: Node | null;
        let lastNode: Node | null = null;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        editorRef.current.innerHTML += htmlToInsert;
      }
      handleEditorInput();
    }
  };

  // Math Presets
  const mathPresets = [
    { label: 'Pecahan (Fraction)', code: '\\frac{a}{b}' },
    { label: 'Akar (Square Root)', code: '\\sqrt{x}' },
    { label: 'Akar Pangkat n', code: '\\sqrt[n]{x}' },
    { label: 'Pangkat (Superscript)', code: 'x^{2}' },
    { label: 'Indeks (Subscript)', code: 'x_{i}' },
    { label: 'Integral', code: '\\int_{a}^{b} f(x) dx' },
    { label: 'Sumasi (Sigma)', code: '\\sum_{k=1}^{n} k' },
    { label: 'Limit', code: '\\lim_{x \\to \\infty} f(x)' },
    { label: 'Matriks 2x2', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: 'Kurung Kurawal Sistem', code: '\\begin{cases} x + y = 1 \\\\ x - y = 0 \\end{cases}' },
    { label: 'Plus Minus', code: '\\pm' },
    { label: 'Tidak Sama Dengan', code: '\\neq' },
    { label: 'Kurang Dari Sama', code: '\\leq' },
    { label: 'Lebih Dari Sama', code: '\\geq' },
    { label: 'Alpha α', code: '\\alpha' },
    { label: 'Beta β', code: '\\beta' },
    { label: 'Gamma γ', code: '\\gamma' },
    { label: 'Theta θ', code: '\\theta' },
    { label: 'Pi π', code: '\\pi' },
    { label: 'Infinity ∞', code: '\\infty' },
    { label: 'Panah Kanan →', code: '\\rightarrow' },
    { label: 'Perkalian ×', code: '\\times' },
    { label: 'Pembagian ÷', code: '\\div' }
  ];

  const handleInsertMath = () => {
    if (!latexExpr.trim()) return;
    try {
      const renderedHtml = katex.renderToString(latexExpr, {
        throwOnError: false,
        displayMode: false
      });
      const wrapper = `<span class="katex-inline inline-block px-1 align-middle my-0.5" data-latex="${encodeURIComponent(latexExpr)}">${renderedHtml}</span>`;
      insertHtmlAtCursor(wrapper);
      setShowMathModal(false);
    } catch (e) {
      alert('Gagal menyisipkan rumus LaTeX.');
    }
  };

  // Local Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImageUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = () => {
    if (!imageUrl) return;
    const widthClass =
      imageSize === '25' ? 'w-1/4' :
      imageSize === '50' ? 'w-1/2' :
      imageSize === '75' ? 'w-3/4' : 'w-full';

    const imgHtml = `<figure class="my-2 inline-block max-w-full"><img src="${imageUrl}" alt="${imageCaption || 'Gambar Soal'}" class="${widthClass} h-auto rounded-xl border border-slate-700 shadow-lg object-contain" />${
      imageCaption ? `<figcaption class="text-[11px] text-slate-400 text-center mt-1 italic">${imageCaption}</figcaption>` : ''
    }</figure>`;

    insertHtmlAtCursor(imgHtml);
    setImageUrl('');
    setImageCaption('');
    setShowImageModal(false);
  };

  const handleInsertVideo = () => {
    if (!videoUrl) return;
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const videoHtml = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')
      ? `<video src="${embedUrl}" controls class="w-full max-w-xl h-64 rounded-xl border border-slate-700 my-2 shadow-lg"></video>`
      : `<div class="aspect-video w-full max-w-xl my-2 rounded-xl overflow-hidden border border-slate-700 shadow-lg"><iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

    insertHtmlAtCursor(videoHtml);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const textToShow = linkText.trim() || linkUrl;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline font-semibold hover:text-cyan-300">${textToShow}</a>`;
    insertHtmlAtCursor(linkHtml);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  const colors = [
    { name: 'Sian Cyan', value: '#06b6d4' },
    { name: 'Kuning Yellow', value: '#eab308' },
    { name: 'Hijau Green', value: '#22c55e' },
    { name: 'Merah Red', value: '#ef4444' },
    { name: 'Ungu Purple', value: '#a855f7' },
    { name: 'Putih White', value: '#ffffff' },
    { name: 'Kelabu Slate', value: '#94a3b8' }
  ];

  return (
    <div className="space-y-1 w-full">
      {label && <label className="block text-[11px] font-semibold text-slate-300 mb-1">{label}</label>}

      {/* Main Rich Text Container */}
      <div className="border border-slate-700/80 bg-slate-950 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all focus-within:border-cyan-500">
        
        {/* Toolbar Row 1 - Formatting */}
        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-900 border-b border-slate-800 text-slate-200 select-none">
          
          {/* Bold */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Tebal (Bold) - Ctrl+B"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Miring (Italic) - Ctrl+I"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Garis Bawah (Underline) - Ctrl+U"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Coret Teks (Strikethrough)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          {/* Superscript X² */}
          <button
            type="button"
            onClick={() => execCmd('superscript')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
            title="Superscript / Pangkat (X²)"
          >
            <SuperIcon className="w-3.5 h-3.5" />
          </button>

          {/* Subscript X₂ */}
          <button
            type="button"
            onClick={() => execCmd('subscript')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
            title="Subscript / Notasi Kimia (X₂)"
          >
            <SubIcon className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Font Size Selector */}
          <select
            onChange={(e) => execCmd('fontSize', e.target.value)}
            defaultValue="3"
            className="bg-slate-950 text-slate-300 text-[11px] font-semibold rounded-md border border-slate-800 px-1.5 py-0.5 focus:border-cyan-500 cursor-pointer"
            title="Ukuran Font"
          >
            <option value="1">10 px</option>
            <option value="2">12 px</option>
            <option value="3">14 px (Default)</option>
            <option value="4">16 px</option>
            <option value="5">18 px</option>
            <option value="6">24 px</option>
            <option value="7">32 px</option>
          </select>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
            title="Bullet List (Daftar Poin)"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg transition-colors"
            title="Numbered List (Daftar Angka)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Alignments */}
          <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (onTextAlignChange) onTextAlignChange('left');
                execCmd('justifyLeft');
              }}
              className={`p-1 rounded ${textAlign === 'left' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Rata Kiri"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (onTextAlignChange) onTextAlignChange('center');
                execCmd('justifyCenter');
              }}
              className={`p-1 rounded ${textAlign === 'center' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Rata Tengah"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (onTextAlignChange) onTextAlignChange('right');
                execCmd('justifyRight');
              }}
              className={`p-1 rounded ${textAlign === 'right' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Rata Kanan"
            >
              <AlignRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (onTextAlignChange) onTextAlignChange('justify');
                execCmd('justifyFull');
              }}
              className={`p-1 rounded ${textAlign === 'justify' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Rata Kanan Kiri (Justify)"
            >
              <AlignJustify className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Toolbar Row 2 - Media, Math & Code */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 border-b border-slate-800 text-slate-200 select-none">
          
          {/* Insert Image */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-lg transition-colors border border-slate-800 flex items-center gap-1 text-[11px] font-semibold"
            title="Sisipkan Gambar (Upload / URL)"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gambar</span>
          </button>

          {/* Insert Video */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors border border-slate-800 flex items-center gap-1 text-[11px] font-semibold"
            title="Sisipkan Video YouTube Embed / MP4"
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Video</span>
          </button>

          {/* Insert Link */}
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-blue-300 rounded-lg transition-colors border border-slate-800 flex items-center gap-1 text-[11px] font-semibold"
            title="Sisipkan Tautan Hyperlink"
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Link</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Math Formula KaTeX Modal Button */}
          <button
            type="button"
            onClick={() => setShowMathModal(true)}
            className="px-2 py-1 bg-amber-950/60 border border-amber-600/60 hover:bg-amber-900 text-amber-300 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold shadow-sm"
            title="Editor Rumus Matematika KaTeX (Ikon Σ)"
          >
            <Sigma className="w-3.5 h-3.5 text-amber-400" />
            <span>Rumus (Σ)</span>
          </button>

          {/* Text Color Picker Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 hover:bg-slate-800 text-amber-400 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
              title="Warna Teks"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {showColorPicker && (
              <div className="absolute top-8 left-0 z-50 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl flex gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      execCmd('foreColor', c.value);
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => execCmd('removeFormat')}
            className="p-1.5 hover:bg-rose-950/50 text-slate-300 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-900/50"
            title="Hapus Format Teks"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="ml-auto flex items-center gap-1">
            {/* View HTML Source Toggle */}
            <button
              type="button"
              onClick={() => setShowHtmlSource(!showHtmlSource)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                showHtmlSource
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              title="Edit Source Code HTML (Ikon </>) "
            >
              {showHtmlSource ? <Eye className="w-3 h-3" /> : <FileCode className="w-3 h-3" />}
              <span>{showHtmlSource ? 'Visual' : '</> Code'}</span>
            </button>
          </div>
        </div>

        {/* Editor Input / ContentEditable or HTML Code Editor */}
        {showHtmlSource ? (
          <textarea
            rows={compact ? 3 : rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Edit HTML Source Code secara langsung di sini..."
            className="w-full bg-slate-950 p-3 text-xs font-mono text-cyan-300 focus:outline-none resize-y min-h-[90px] border-t border-slate-800"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            className={`w-full bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:outline-none overflow-y-auto ${
              compact ? 'min-h-[60px] max-h-[140px]' : 'min-h-[120px] max-h-[400px]'
            }`}
            style={{
              textAlign: textAlign
            }}
          />
        )}
      </div>

      {/* MATH FORMULA KATEX MODAL (IKON Σ) */}
      {showMathModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Sigma className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editor Rumus Matematika (KaTeX / LaTeX)</h3>
                  <p className="text-xs text-slate-400">Pilih simbol cepat atau ketik ekspresi LaTeX di bawah.</p>
                </div>
              </div>
              <button
                onClick={() => setShowMathModal(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-amber-400">Simbol & Format Matematika Cepat:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                {mathPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setLatexExpr(prev => prev + ' ' + preset.code)}
                    className="p-1.5 bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-600/60 text-slate-200 hover:text-amber-300 rounded-lg text-left text-[11px] transition-colors truncate"
                    title={preset.code}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LaTeX Textarea Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Ekspresi Kode LaTeX:</label>
              <textarea
                rows={3}
                value={latexExpr}
                onChange={(e) => setLatexExpr(e.target.value)}
                placeholder="Contoh: \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Live KaTeX Rendered Preview */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-cyan-400">Pratinjau Hasil Rumus (Live Preview):</label>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 min-h-[60px] flex items-center justify-center overflow-x-auto">
                {katexPreview ? (
                  <div dangerouslySetInnerHTML={{ __html: katexPreview }} className="text-white text-lg" />
                ) : (
                  <span className="text-slate-600 text-xs italic">Ketik ekspresi LaTeX untuk melihat pratinjau rumus.</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowMathModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertMath}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" /> Sisipkan Rumus Ke Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" /> Sisipkan Gambar
              </h3>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Local File Upload Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">1. Upload Gambar dari Perangkat:</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950 rounded-xl text-center cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                <p className="text-xs text-slate-300 font-semibold">Klik untuk Memilih File Gambar</p>
                <p className="text-[10px] text-slate-500">Format PNG, JPG, WEBP, GIF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">2. Atau Masukkan URL Gambar (https://...):</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://domain.com/gambar.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-500"
              />
            </div>

            {/* Image Resize Scale Option */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Ukuran Skala Gambar:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['25', '50', '75', '100'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setImageSize(sz)}
                    className={`py-1.5 rounded-xl text-xs font-bold border ${
                      imageSize === sz ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {sz}%
                  </button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Keterangan / Caption (Opsional):</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Contoh: Gambar 1. Grafik Fungsi Kuadrat"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder-slate-600"
              />
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex justify-center max-h-40 overflow-hidden">
                <img src={imageUrl} alt="Preview" className="max-h-36 rounded object-contain" />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl}
                className="px-5 py-2 bg-cyan-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs"
              >
                Sisipkan Gambar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" /> Sisipkan Video
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Link YouTube atau Video MP4:</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertVideo}
                disabled={!videoUrl}
                className="px-5 py-2 bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs"
              >
                Sisipkan Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-400" /> Sisipkan Hyperlink
              </h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Teks Tautan (Text):</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Contoh: Buka Website Referensi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">URL Tujuan (https://...):</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="px-5 py-2 bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs"
              >
                Sisipkan Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
