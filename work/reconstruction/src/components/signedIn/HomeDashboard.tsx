import React, { useState, useEffect, useRef } from 'react';
import { ProjectItem, UserProfile } from '../../fixtures/signedInFixtures';

interface HomeDashboardProps {
  user: UserProfile;
  projects: ProjectItem[];
  onOpenProject: (projectId: string) => void;
  onOpenCreate: (initialTemplate?: string) => void;
  onNavigate?: (screen: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  projects,
  onOpenProject,
  onOpenCreate
}) => {
  const [promptText, setPromptText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Authentic WebGL / 2D Canvas Glow (Modules 988602, 833997, 39871 from 2fhcrx0w3hkf3.js)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 1440;
    const height = 765;
    const m = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(width * m));
    canvas.height = Math.max(1, Math.round(height * m));

    const u = [255, 60, 0]; // core [255, 60, 0]
    const i = [30, 30, 31]; // bg [30, 30, 31]
    const ARC_STOP = 0.2;
    const FADE_STOP = 0.6;
    const eRatio = ARC_STOP / FADE_STOP;
    const o = [u[0] + (i[0] - u[0]) * eRatio, u[1] + (i[1] - u[1]) * eRatio, u[2] + (i[2] - u[2]) * eRatio]; // halo

    // S.centerX = 0.5 * v + y / 2 (where y is sidebar offset = 240)
    const yOffset = 240;
    const centerX = 0.5 * width + yOffset / 2; // 840
    const centerY = 1.1 * height; // 841.5
    const radiusX = Math.max(1.05 * width, 900); // 1512
    const radiusY = 0.8 * height; // 612
    const strength = 0.4;

    const VERT_SRC = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const FRAG_SRC = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif

      uniform vec2 uCenter;
      uniform vec2 uInvRadii;
      uniform vec3 uCore;
      uniform vec3 uHalo;
      uniform vec3 uBackground;
      uniform float uStrength;

      const float ARC_STOP = 0.2000;
      const float FADE_STOP = 0.6000;

      float hash(vec2 p) {
        vec3 q = fract(vec3(p.xyx) * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
      }

      void main() {
        vec2 p = gl_FragCoord.xy;
        float t = length((p - uCenter) * uInvRadii);
        vec3 rgb = mix(uCore, uHalo, clamp(t / ARC_STOP, 0.0, 1.0));
        rgb = mix(rgb, uBackground,
                  clamp((t - ARC_STOP) / (FADE_STOP - ARC_STOP), 0.0, 1.0));
        rgb = mix(uBackground, rgb, uStrength);
        const float DITHER_STEPS = 2.0;
        vec3 r1 = vec3(hash(p),
                       hash(p + vec2(17.0, 59.0)),
                       hash(p + vec2(59.0, 17.0)));
        vec3 r2 = vec3(hash(p + vec2(37.0, 11.0)),
                       hash(p + vec2(11.0, 37.0)),
                       hash(p + vec2(29.0, 43.0)));
        gl_FragColor = vec4(
            clamp(rgb + (r1 - r2) * (DITHER_STEPS / 255.0), 0.0, 1.0), 1.0);
      }
    `;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: 'low-power'
    });

    if (gl) {
      const compileShader = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (gl.deleteShader(s), null);
      };

      const vs = compileShader(gl.VERTEX_SHADER, VERT_SRC);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
      const prog = gl.createProgram();

      if (vs && fs && prog) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          gl.useProgram(prog);

          const aPosition = gl.getAttribLocation(prog, 'aPosition');
          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
          gl.enableVertexAttribArray(aPosition);
          gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

          const uCenter = gl.getUniformLocation(prog, 'uCenter');
          const uInvRadii = gl.getUniformLocation(prog, 'uInvRadii');
          const uCore = gl.getUniformLocation(prog, 'uCore');
          const uHalo = gl.getUniformLocation(prog, 'uHalo');
          const uBackground = gl.getUniformLocation(prog, 'uBackground');
          const uStrength = gl.getUniformLocation(prog, 'uStrength');

          gl.uniform3f(uCore, u[0] / 255, u[1] / 255, u[2] / 255);
          gl.uniform3f(uHalo, o[0] / 255, o[1] / 255, o[2] / 255);
          gl.uniform3f(uBackground, i[0] / 255, i[1] / 255, i[2] / 255);
          gl.clearColor(i[0] / 255, i[1] / 255, i[2] / 255, 1);

          gl.viewport(0, 0, canvas.width, canvas.height);
          const v = canvas.height;
          gl.uniform2f(uCenter, centerX * m, v - centerY * m);
          gl.uniform2f(uInvRadii, 1 / Math.max(1, radiusX * m), 1 / Math.max(1, radiusY * m));
          gl.uniform1f(uStrength, strength);

          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          return;
        }
      }
    }

    // 2D Canvas Fallback (Module 833997)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bgStr = `rgb(${i[0]}, ${i[1]}, ${i[2]})`;
    ctx.fillStyle = bgStr;
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = strength;
    ctx.translate(centerX, centerY);
    ctx.scale(1, radiusY / radiusX);
    const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
    radGrad.addColorStop(0, `rgb(${u[0]}, ${u[1]}, ${u[2]})`);
    radGrad.addColorStop(ARC_STOP, `rgb(${Math.round(o[0])}, ${Math.round(o[1])}, ${Math.round(o[2])})`);
    radGrad.addColorStop(FADE_STOP, bgStr);
    ctx.fillStyle = radGrad;
    const vScale = radiusX / radiusY;
    ctx.fillRect(-centerX, -centerY * vScale, width, height * vScale);
    ctx.restore();
  }, []);

  const handleSuggestionClick = (text: string) => {
    setPromptText(text);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (promptText.trim()) {
      onOpenCreate(promptText.trim());
    }
  };

  // Recent 3 projects for the top cards
  const topProjects = projects.slice(0, 3);

  return (
    <>
      {/* AUTHENTIC CANVAS GLOW (Extracted from Live Page) */}
      <div
        aria-hidden="true"
        data-state="entered"
        className="fixed z-0 inset-0 size-full pointer-events-none"
        style={{ opacity: 1 }}
      >
        <canvas
          ref={canvasRef}
          width={1440}
          height={765}
          className="absolute inset-0 size-full"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <main
        id="main-content"
        className="relative flex flex-col shrink basis-0 min-h-0 grow max-tablet-min:overflow-x-hidden max-tablet-min:pt-(--AppLayout--header-height) z-1"
      >
        <div className="flex box-border min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch relative h-dvh min-h-0 shrink">
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden flex-[1_1_0]">
            
            {/* TOP SCROLLABLE SECTION: Recent Projects */}
            <div className="flex min-h-0 flex-col overflow-y-auto flex-[1_1_0]">
              <div
                className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 pt-(--useView--pt) pr-(--useView--pr) pb-(--useView--pb) pl-(--useView--pl) my-0 mx-auto w-full max-w-[800px]"
                style={{
                  padding: '24px'
                }}
              >
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink gap-300">
                  <div className="flex box-border min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center gap-300 min-h-800">
                    <h2 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm font-[weight:inherit] wrap-break-word inline text-color-secondary">
                      Recent projects
                    </h2>
                  </div>

                  <ol className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grid gap-400 grid-cols-[repeat(3,1fr)] [@media_screen_and_(width<=1023px)]:grid-cols-[1fr] list-none p-0 m-0">
                    {topProjects.map((p) => (
                      <li
                        key={p.id}
                        data-react-aria-pressable="true"
                        onClick={() => onOpenProject(p.id)}
                        className="flex box-border min-h-0 min-w-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 group/repl-card relative overflow-hidden [box-shadow:var(--shadow-subtle)] after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:[box-shadow:var(--shadow-inset-overlay-regular)] rounded-12 text-color-default appearance-none border-0 border-solid border-transparent transition-background-color duration-snappy ease-snappy select-none cursor-pointer bg-surface hover:shades-up"
                        style={{ borderRadius: '12px' }}
                      >
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start grow shrink flex-row gap-300 items-center p-300">
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch gap-50 grow shrink">
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none shrink-0 flex-row justify-between items-center">
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start grow shrink flex-row gap-100 items-center">
                                <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-sm max-w-full text-ellipsis whitespace-nowrap wrap-break-word inline-block overflow-hidden text-color-default font-normal">
                                  {p.title}
                                </span>
                              </div>
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100 relative z-3 invisible w-0 overflow-hidden group-hover/repl-card:visible group-hover/repl-card:ml-200 group-hover/repl-card:w-auto group-hover/repl-card:overflow-visible">
                                <button
                                  type="button"
                                  aria-label="App Actions"
                                  className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-surface hover:shades-up-2 p-0"
                                  style={{ width: '24px', height: '24px' }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.25 5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0m0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100 text-(--foreground-dimmer)">
                              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 relative z-3">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M12 1.25A5.75 5.75 0 0 1 17.75 7v3.25H19A2.75 2.75 0 0 1 21.75 13v7A2.75 2.75 0 0 1 19 22.75H5A2.75 2.75 0 0 1 2.25 20v-7A2.75 2.75 0 0 1 5 10.25h1.25V7A5.75 5.75 0 0 1 12 1.25m-7 10.5c-.69 0-1.25.56-1.25 1.25v7c0 .69.56 1.25 1.25 1.25h14c.69 0 1.25-.56 1.25-1.25v-7c0-.69-.56-1.25-1.25-1.25zm7-9A4.25 4.25 0 0 0 7.75 7v3.25h8.5V7A4.25 4.25 0 0 0 12 2.75" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs text-color-tertiary">·</span>
                              <span className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch text-xs text-color-tertiary shrink-0 whitespace-nowrap">
                                6 months ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Greeting, Suggestions, Prompt Box */}
            <div className="flex-none">
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 my-0 mx-auto w-full px-600 pb-700 max-w-[800px] max-tablet-min:pb-400">
                
                {/* 1. GREETING BLOCK */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-[13px]">
                  <div className="mb-0 transform-none opacity-100 blur-none animate-none">
                    <h1 style={{ border: 0, clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: '1px', margin: '-1px', overflow: 'hidden', padding: 0, position: 'absolute', width: '1px', whiteSpace: 'nowrap' }}>
                      Alex, what are we working on today?
                    </h1>
                    <p aria-hidden="true" className="m-0 text-header-big text-(--foreground-default) font-[500] tracking-[-0.01em]">
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">Alex,&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">what&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">are&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">we&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">working&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">on&nbsp;</span>
                      <span className="inline-block transform-none opacity-100 blur-none animate-none">today?&nbsp;</span>
                    </p>
                  </div>
                </div>

                {/* 2. SUGGESTIONS SECTION */}
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 pt-400">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-200 relative w-full">
                    
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-25">
                      <h2 className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 text-xs font-[weight:inherit] wrap-break-word inline text-color-secondary">
                        Suggested for you
                      </h2>
                      <span className="contents">
                        <button
                          type="button"
                          aria-label="More ideas..."
                          className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center w-(--icon-button-size) h-(--icon-button-size) text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer rounded-4 !bg-transparent hover:!text-(--foreground-default)"
                          style={{ width: '16px', height: '16px' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 11.25a.75.75 0 0 1 .75.75A9.75 9.75 0 0 1 12 21.75h-.003a10.5 10.5 0 0 1-7.259-2.951l-.988-.988V21a.75.75 0 0 1-1.5 0v-5a.8.8 0 0 1 .055-.282l.004-.01q.018-.04.042-.078a.8.8 0 0 1 .119-.16.8.8 0 0 1 .16-.12q.037-.023.078-.041l.01-.004q.046-.017.094-.029.019-.006.039-.011.007-.002.016-.003A1 1 0 0 1 3 15.25h5a.75.75 0 0 1 0 1.5H4.81l.971.97a9 9 0 0 0 6.22 2.529A8.25 8.25 0 0 0 20.25 12a.75.75 0 0 1 .75-.75M12.51 2.264a10.5 10.5 0 0 1 6.379 2.593l.373.344.988.988V3a.75.75 0 0 1 1.5 0v5a.8.8 0 0 1-.058.286q-.019.044-.044.083a.7.7 0 0 1-.118.161.7.7 0 0 1-.16.118q-.041.025-.084.044-.048.02-.099.03-.019.007-.039.012l-.016.003A1 1 0 0 1 21 8.75h-5a.75.75 0 0 1 0-1.5h3.19l-.971-.97-.32-.295a9 9 0 0 0-5.901-2.235A8.25 8.25 0 0 0 3.75 12a.75.75 0 0 1-1.5 0A9.75 9.75 0 0 1 12 2.25h.003z" />
                          </svg>
                        </button>
                      </span>
                    </div>

                    <div className="flex flex-col items-logical-start gap-200 overflow-hidden p-25 min-h-[calc(var(--space-96)+var(--space-24))] [&>*]:max-w-full [&>*]:min-w-0 [&*>button]:max-w-full [&*>button]:pl-200 [&*>button]:pr-[calc(var(--space-12)+var(--space-1))]">
                      
                      {/* Chip 1: Help me get things done */}
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick('Help me get things done')}
                          className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 _sdz_switch-theme _sdz_theme-text-input flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-logical-start h-800 gap-50 px-200 rounded-full [--glass-surface-opacity:70%] [background:color-mix(in_srgb,var(--surface-color)_var(--glass-surface-opacity),transparent)] [backdrop-filter:blur(10px)] HomeChatSuggestions-module__YxH_Jq__suggestionPill"
                          style={{ boxShadow: 'var(--shadow-control-overlay-border)', padding: '0 13px 0 8px' }}
                        >
                          <span aria-hidden="true" className="inline-flex size-500 shrink-0 items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-(--surface-color-600) fill-(--surface-color-600) _sdz_theme-brand _sdz_switch-theme" aria-hidden="true">
                              <path d="M10.4 2.6c.5 4.5 2.1 6.1 6.6 6.6-4.5.5-6.1 2.1-6.6 6.6-.5-4.5-2.1-6.1-6.6-6.6 4.5-.5 6.1-2.1 6.6-6.6Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                              <path d="M17.8 13.4c.3 2.7 1.25 3.65 3.95 3.95-2.7.3-3.65 1.25-3.95 3.95-.3-2.7-1.25-3.65-3.95-3.95 2.7-.3 3.65-1.25 3.95-3.95Z" className="fill-(--surface-color--600)" />
                            </svg>
                          </span>
                          <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                            <span className="min-w-0 grow truncate text-left">Help me get things done</span>
                          </span>
                        </button>
                      </div>

                      {/* Chip 2: Find emails needing my reply (neutral placeholder icon per privacy rules) */}
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick('Find emails needing my reply')}
                          className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 _sdz_switch-theme _sdz_theme-text-input flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-logical-start h-800 gap-50 px-200 rounded-full [--glass-surface-opacity:70%] [background:color-mix(in_srgb,var(--surface-color)_var(--glass-surface-opacity),transparent)] [backdrop-filter:blur(10px)] HomeChatSuggestions-module__YxH_Jq__suggestionPill"
                          style={{ boxShadow: 'var(--shadow-control-overlay-border)', padding: '0 13px 0 8px' }}
                        >
                          <span aria-hidden="true" className="inline-flex size-500 shrink-0 items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#9CA3AF]">
                              <rect x="2" y="4" width="20" height="16" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          </span>
                          <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                            <span className="min-w-0 grow truncate text-left">Find emails needing my reply</span>
                          </span>
                        </button>
                      </div>

                      {/* Chip 3: Turn my notes into a slide deck */}
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick('Turn my notes into a slide deck')}
                          className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-surface _sdz_custom-hover:shades-up-2 _sdz_switch-theme _sdz_theme-text-input flex min-h-0 min-w-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-logical-start h-800 gap-50 px-200 rounded-full [--glass-surface-opacity:70%] [background:color-mix(in_srgb,var(--surface-color)_var(--glass-surface-opacity),transparent)] [backdrop-filter:blur(10px)] HomeChatSuggestions-module__YxH_Jq__suggestionPill"
                          style={{ boxShadow: 'var(--shadow-control-overlay-border)', padding: '0 13px 0 8px' }}
                        >
                          <span aria-hidden="true" className="inline-flex size-500 shrink-0 items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-(--surface-color-600) fill-(--surface-color-600) _sdz_theme-brand _sdz_switch-theme" aria-hidden="true">
                              <rect x="2.5" y="3" width="19" height="13.5" rx="2.8" className="fill-(--surface-color--1400)" />
                              <rect x="6" y="6.4" width="9" height="2.5" rx="1.25" />
                              <rect x="6" y="10.6" width="6" height="2.2" rx="1.1" />
                              <path d="M12 16.5v1.9m0 0-3 2.7m3-2.7 3 2.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                            <span className="min-w-0 grow truncate text-left">Turn my notes into a slide deck</span>
                          </span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* 3. PROMPT BOX CONTAINER */}
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0">
                    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full max-w-[800px]">
                      <div
                        data-agent-input2-drop-target="true"
                        className="flex box-border min-w-0 view-outline-none flex-col justify-logical-start items-stretch shrink-0 rounded-(--useView--border-radius) relative overflow-hidden border border-solid [background:color-mix(in_srgb,var(--surface-color)_var(--glass-surface-opacity),transparent)] [backdrop-filter:blur(10px)] border-(--overlay-color-regular) [--code-mirror-background-color:transparent] [--glass-surface-opacity:80%] [&]:bg-clip-padding [&:is(:hover,:focus-within)]:border-[color-mix(in_srgb,var(--outline-strongest)_50%,var(--foreground-dimmest))] [box-shadow:var(--shadow-raised)] min-h-[106px] _sdz_theme-text-input _sdz_switch-theme"
                        style={{ borderRadius: 'var(--border-radius-12)' }}
                      >
                        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch grow shrink cursor-text">
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 grow">
                            <div
                              className="flex grow cursor-text overflow-auto text-(length:--font-size-subhead-default) pt-[12px] pr-[12px] pb-[0px] pl-[12px] min-h-[48px] max-h-[300px]"
                              id="home-chat-input"
                            >
                              <textarea
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                  }
                                }}
                                placeholder="Start chatting or describe a task..."
                                rows={1}
                                className="w-full bg-transparent border-0 outline-none resize-none text-color-default placeholder:text-color-placeholder font-normal text-sm"
                                style={{
                                  lineHeight: '24px',
                                  color: 'rgb(233, 234, 234)',
                                  fontFamily: 'inherit'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer Controls: Left = Add & Output, Right = Free, Mic, Submit */}
                        <div
                          className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row shrink-0 items-center justify-between cursor-text p-(--agent-input-footer-padding)"
                          style={{ padding: '6px' }}
                        >
                          <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-200 cursor-text w-full">
                            
                            {/* Left Controls */}
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start flex-row items-center grow shrink gap-(--agent-actions-gap)" style={{ gap: '8px' }}>
                              <button
                                type="button"
                                aria-label="Add attachment"
                                className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-transparent hover:bg-surface p-0"
                                style={{ width: '32px', height: '32px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 4.25a.75.75 0 0 1 .75.75v6.25H19a.75.75 0 0 1 0 1.5h-6.25V19a.75.75 0 0 1-1.5 0v-6.25H5a.75.75 0 0 1 0-1.5h6.25V5a.75.75 0 0 1 .75-.75" />
                                </svg>
                              </button>

                              <button
                                type="button"
                                aria-label="Output type: Output (Auto-Select)"
                                className="text-color-default appearance-none border-0 border-solid border-transparent select-none bg-transparent hover:bg-surface flex min-h-0 basis-auto cursor-pointer flex-row items-center shrink self-auto justify-center h-800 gap-50 rounded-6 min-w-0 px-100 _sdz_surface"
                                style={{ height: '32px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.927 8.054a2.334 2.334 0 0 1 2.858-1.65l9.416 2.523a2.334 2.334 0 0 1 1.65 2.858l-2.523 9.416a2.334 2.334 0 0 1-2.858 1.65l-9.416-2.523a2.334 2.334 0 0 1-1.65-2.858zm2.491-.28a.915.915 0 0 0-1.121.647l-2.524 9.416c-.13.488.16.99.648 1.121l9.416 2.523c.488.131.99-.159 1.121-.647l2.523-9.416a.916.916 0 0 0-.647-1.121z" clipRule="evenodd" />
                                  <path d="M13.232 1.15a2.334 2.334 0 0 1 2.334 2.334V4.89a.71.71 0 0 1-1.418 0V3.484a.916.916 0 0 0-.916-.916H3.484a.916.916 0 0 0-.916.916v9.748c0 .506.41.916.916.916H4.89a.71.71 0 1 1 0 1.418H3.484a2.334 2.334 0 0 1-2.334-2.334V3.484A2.334 2.334 0 0 1 3.484 1.15z" />
                                </svg>
                                <span className="flex min-w-0 items-center gap-200 px-100 text-label-l-control">
                                  <span className="min-w-0 grow truncate text-left text-xs font-normal">Output</span>
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--foreground-dimmest)">
                                  <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                            {/* Right Controls */}
                            <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-row items-center justify-logical-end grow shrink gap-(--agent-actions-gap)" style={{ gap: '8px' }}>
                              <button
                                type="button"
                                aria-label="Free agent modes"
                                className="flex box-border min-h-0 min-w-0 view-outline-none flex-row justify-between items-center shrink-0 pr-(--useView--pr) pl-(--useView--pl) rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-transparent hover:bg-surface _sdz_surface"
                                style={{ height: '32px', paddingLeft: '6px', paddingRight: '6px', gap: '4px' }}
                              >
                                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none justify-logical-start shrink-0 flex-row items-center gap-100">
                                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                                    <circle cx="3.724" cy="3.724" r="1.75" fill="currentColor" opacity="0.2" />
                                    <circle cx="9.004" cy="3.724" r="1.75" fill="currentColor" opacity="0.55" />
                                    <circle cx="14.285" cy="3.724" r="1.75" fill="currentColor" opacity="1" />
                                    <circle cx="3.724" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                                    <circle cx="9.004" cy="9.004" r="1.75" fill="currentColor" opacity="0.2" />
                                    <circle cx="14.285" cy="9.004" r="1.75" fill="currentColor" opacity="0.55" />
                                    <circle cx="3.724" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                                    <circle cx="9.004" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                                    <circle cx="14.285" cy="14.285" r="1.75" fill="currentColor" opacity="0.2" />
                                  </svg>
                                  <span className="text-sm font-normal text-color-default">Free</span>
                                </div>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--foreground-dimmest)">
                                  <path fillRule="evenodd" d="M12.53 15.53a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 1.06-1.06L12 13.94l5.47-5.47a.75.75 0 1 1 1.06 1.06z" clipRule="evenodd" />
                                </svg>
                              </button>

                              <button
                                type="button"
                                aria-label="Start voice input"
                                className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-transparent hover:bg-surface p-0"
                                style={{ width: '32px', height: '32px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19 9.25a.75.75 0 0 1 .75.75v2a7.75 7.75 0 0 1-7 7.713V22a.75.75 0 0 1-1.5 0v-2.287a7.75 7.75 0 0 1-6.99-7.328L4.25 12v-2a.75.75 0 0 1 1.5 0v2l.008.31A6.25 6.25 0 0 0 12 18.25l.31-.008a6.25 6.25 0 0 0 5.932-5.932l.008-.31v-2a.75.75 0 0 1 .75-.75" />
                                  <path fillRule="evenodd" d="M12 1.25A3.75 3.75 0 0 1 15.75 5v7a3.75 3.75 0 1 1-7.5 0V5A3.75 3.75 0 0 1 12 1.25m0 1.5A2.25 2.25 0 0 0 9.75 5v7a2.25 2.25 0 0 0 4.5 0V5A2.25 2.25 0 0 0 12 2.75" clipRule="evenodd" />
                                </svg>
                              </button>

                              <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!promptText.trim()}
                                aria-label="Start"
                                className="box-border min-h-0 min-w-0 view-outline-none flex-col shrink-0 flex justify-center items-center rounded-6 text-color-default appearance-none border-0 border-solid border-transparent select-none cursor-pointer bg-transparent hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed p-0"
                                style={{ width: '32px', height: '32px' }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M11.47 4.47a.75.75 0 0 1 1.06 0l7 7a.75.75 0 1 1-1.06 1.06l-5.72-5.72V19a.75.75 0 0 1-1.5 0V6.81l-5.72 5.72a.75.75 0 0 1-1.06-1.06z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};
