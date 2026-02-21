import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Dumbbell, Utensils, Activity, BarChart2, User, MoreHorizontal, 
  Zap, Flame, Battery, Moon, Cigarette, Beer, Pizza, Calendar, 
  Ruler, Scale, LayoutDashboard, Brain, CheckCircle2, Syringe,
  Cloud, CloudOff, Clock, Watch, Eye, EyeOff
} from "lucide-react";
import { PWAHelper, useNotificationScheduler } from "./components/PWAHelper";
import { supabase, projectId } from "./components/supabaseClient";
import { signUpUser, loadAllData, saveData, logTimeSession, getTimeStats, getHealthSync } from "./components/cloudSync";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  :root {
    /* Earth & Iron + Medical Palette */
    --bg: #121212;           /* Deep Iron */
    --surface: #1e1e1e;      /* Dark Steel */
    --surface2: #2a2a2a;     /* Lighter Steel for inputs/cards */
    --border: #333333;       /* Sharp Border */
    --text: #f0f0f0;         /* Medical White */
    --muted: #a0a0a0;        /* Muted Steel */
    
    /* Brand Colors */
    --green: #6b705c;        /* Olive (Secondary/Success) */
    --green-lt: #23261e;     /* Dark Olive bg */
    
    --red: #3e6451;          /* Forest Green (Primary/Action) */
    --red-lt: #1a2b23;       /* Dark Forest bg */
    
    --blue: #4a6fa5;         /* Medical Blue/Steel Blue (Technical) */
    --blue-lt: #1a222e;      /* Dark Blue bg */
    
    --yellow: #c49a38;       /* Tarnished Gold/Brass */
    --yellow-lt: #2e2614;    /* Dark Brass bg */
    
    --purple: #8a2be2;       /* Neon/Plasma (keep for specific accents if needed) */
    --purple-lt: #250d3d;
    
    --radius: 6px;           /* Sturdy/Sharp */
    --radius-sm: 4px;
    
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3); /* Heavier, darker shadows */
  }
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:rgba(196,154,56,0.22);}
  body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;}

  /* ── Universal tap / click glow — same feel everywhere ── */
  button:active,.qcard:active,.beh-card:active,.nav-btn:active,.dpick:active,.wtab:active,.dtag:active,.sex-dot:active,.login-btn:active,.btn-qnext:active,.btn-qback:active,.beh-btn:active,.login-tab:active,.food-delete:active,.photo-delete:active,.prog-photo-btn:active,[role="button"]:active{transform:scale(0.96) !important;box-shadow:0 0 0 2px rgba(196,154,56,0.55),0 0 22px rgba(196,154,56,0.28) !important;opacity:0.92 !important;transition:transform 0.08s ease,box-shadow 0.08s ease,opacity 0.08s ease !important;}
  .btn-qnext:disabled:active{transform:none !important;box-shadow:none !important;opacity:0.3 !important;}
  .quiz-overlay{position:fixed;inset:0;background:#0e0e0e;z-index:100;display:flex;flex-direction:column;}
  .quiz-top{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px;background:#121212;}
  .quiz-logo{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px;text-transform:uppercase;}
  .quiz-logo span{color:var(--red);} /* Rust accent for logo */
  .qprog-wrap{flex:1;height:4px;background:var(--surface2);border-radius:0px;overflow:hidden;}
  .qprog-fill{height:100%;background:var(--red);border-radius:0px;transition:width 0.4s ease;}
  .qstep{font-size:12px;color:var(--muted);white-space:nowrap;font-weight:600;}
  .quiz-body{flex:1;overflow-y:auto;padding:40px 24px 140px;max-width:580px;margin:0 auto;width:100%;}
  .qtag{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);margin-bottom:12px;}
  .qtitle{font-family:'Outfit',sans-serif;font-size:clamp(28px,6vw,44px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:12px;letter-spacing:-1px;}
  .qsub{font-size:16px;color:var(--muted);margin-bottom:32px;line-height:1.6;font-weight:400;}
  .qcards{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
  .qcards.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .qcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;cursor:pointer;transition:all 0.2s;display:flex;align-items:flex-start;gap:14px;}
  .qcard:hover{border-color:var(--red);transform:translateY(-2px);background:var(--surface2);}
  .qcard.sel{border-color:var(--red);background:var(--red-lt);transform:translateY(-2px);box-shadow:var(--shadow);}
  .qcard-icon{font-size:26px;flex-shrink:0;filter:grayscale(100%);} /* Grayscale icons for industrial look */
  .qcard-label{font-size:16px;font-weight:700;color:#fff;margin-bottom:3px;}
  .qcard.sel .qcard-label{color:var(--red);}
  .qcard-desc{font-size:16px;color:var(--muted);line-height:1.5;font-weight:400;}
  .qcard-chk{width:22px;height:22px;border-radius:2px;border:2px solid var(--muted);margin-left:auto;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all 0.2s;}
  .qcard.sel .qcard-chk{background:var(--red);border-color:var(--red);color:#fff;font-weight:800;}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px;}
  .stats-grid.three{grid-template-columns:1fr 1fr 1fr;}
  .si-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 16px;transition:all 0.2s;}
  .si-box:focus-within{border-color:var(--red);background:var(--surface2);transform:translateY(-2px);}
  .si-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
  .si-box input{background:none;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:32px;font-weight:700;color:#fff;width:100%;}
  .si-box input::placeholder{color:rgba(255,255,255,0.1);font-weight:500;}
  .si-unit{font-size:11px;color:var(--muted);margin-top:4px;font-weight:500;}
  .days-row{display:flex;gap:8px;margin-bottom:24px;}
  .dpick{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 8px;cursor:pointer;text-align:center;transition:all 0.2s;}
  .dpick:hover{border-color:var(--red);transform:translateY(-2px);}
  .dpick.sel{border-color:var(--red);background:var(--red-lt);transform:translateY(-2px);box-shadow:var(--shadow);}
  .dpick-num{font-family:'Outfit',sans-serif;font-size:36px;font-weight:800;color:#fff;display:block;letter-spacing:-1px;}
  .dpick.sel .dpick-num{color:var(--red);}
  .dpick-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;margin-top:4px;font-weight:600;}
  .diet-tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:24px;}
  .dtag{background:var(--surface);border:1px solid var(--border);border-radius:2px;padding:9px 18px;font-size:13px;color:var(--muted);cursor:pointer;transition:all 0.2s;font-weight:600;}
  .dtag:hover{border-color:var(--red);transform:translateY(-1px);color:#fff;}
  .dtag.sel{background:var(--red);border-color:var(--red);color:#fff;font-weight:700;transform:translateY(-1px);}
  .quiz-footer{position:fixed;bottom:0;left:0;right:0;padding:20px 24px 32px;background:linear-gradient(to top,#0e0e0e 80%,transparent);display:flex;flex-direction:column;align-items:center;gap:12px;}
  .btn-qnext{background:var(--red);color:#fff;border:none;border-radius:var(--radius);padding:18px;font-family:'Outfit',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all 0.15s;letter-spacing:0.5px;text-transform:uppercase;flex:1;width:100%;max-width:560px;}
  .btn-qnext:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(217,84,54,0.3);}
  .btn-qnext:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none;background:var(--surface2);color:var(--muted);}
  .btn-qback{background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:var(--radius);padding:18px 24px;font-family:'Outfit',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all 0.15s;letter-spacing:0.5px;text-transform:uppercase;flex-shrink:0;white-space:nowrap;}
  .btn-qback:hover{border-color:var(--muted);background:var(--surface);}
  .quiz-footer-row{display:flex;gap:10px;width:100%;max-width:560px;}
  
  /* App Shell */
  .topbar{background:var(--bg);border-bottom:1px solid var(--border);padding:0 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;height:60px;}
  .app-logo{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;color:var(--text);letter-spacing:-0.5px;text-transform:uppercase;}
  .app-logo span{color:var(--red);}
  .user-pill{display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:5px 12px 5px 6px;cursor:pointer;}
  .user-av{width:24px;height:24px;background:var(--red);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;}
  .user-lbl{font-size:11px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:0.5px;}
  .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:var(--bg);border-top:1px solid var(--border);display:flex;z-index:50;height:64px;padding-bottom:env(safe-area-inset-bottom);}
  .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:none;background:none;color:var(--muted);}
  .nav-btn.active{color:var(--red);}
  .nav-icon{font-size:20px;line-height:1;}
  .nav-lbl{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;}
  
  .page{padding:20px 16px 100px;max-width:780px;margin:0 auto;}
  .page-title{font-family:'Outfit',sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;margin-bottom:4px;color:#fff;text-transform:uppercase;}
  .page-sub{font-size:16px;color:var(--muted);margin-bottom:24px;font-family:'Outfit';font-weight:500;letter-spacing:0.3px;}
  
  .card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow);overflow:hidden;margin-bottom:16px;}
  .card-body{padding:20px;}
  
  .macro-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
  .macro-tile{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 10px;text-align:center;}
  .macro-val{font-family:'Outfit',sans-serif;font-size:20px;font-weight:800;line-height:1;margin-bottom:4px;letter-spacing:-0.5px;color:#fff;}
  .macro-name{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;font-weight:700;}
  
  .slabel{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:var(--muted);margin-bottom:12px;margin-top:24px;display:flex;align-items:center;gap:8px;}
  .slabel::after{content:'';flex:1;height:1px;background:var(--border);}
  .slabel:first-child{margin-top:0;}
  
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;}
  .sc-label{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
  .sc-val{font-family:'Outfit',sans-serif;font-size:32px;font-weight:800;line-height:1;margin-bottom:4px;letter-spacing:-1px;color:var(--cream);}
  .sc-sub{font-size:11px;color:var(--gold);font-weight:600;}
  
  .prog-wrap{background:var(--bg);border-radius:2px;height:6px;overflow:hidden;margin-top:10px;}
  .prog-fill{height:100%;border-radius:2px;transition:width 0.5s ease;}
  
  .meal-row{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--border);}
  .meal-row:last-child{border-bottom:none;}
  .meal-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0;}
  .meal-time{font-size:10px;color:var(--muted);width:46px;flex-shrink:0;font-weight:700;letter-spacing:0.5px;}
  .meal-name{font-size:16px;font-weight:700;flex:1;color:#fff;}
  .meal-desc{font-size:16px;color:var(--muted);margin-top:2px;}
  .meal-cal{font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:var(--green);letter-spacing:-0.3px;}
  .meal-pro{font-size:10px;color:var(--muted);font-weight:600;text-align:right;}
  
  .wd-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:12px;}
  .wd-hdr{display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;background:var(--surface);}
  .wd-hdr:hover{background:var(--surface2);}
  .wd-left{display:flex;align-items:center;gap:12px;}
  .day-badge{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:4px 8px;border-radius:2px;}
  .db-push{background:var(--red-lt);color:var(--red);}
  .db-pull{background:var(--blue-lt);color:var(--blue);}
  .db-legs{background:var(--green-lt);color:var(--green);}
  .db-rest{background:var(--bg);color:var(--muted);}
  .db-cardio{background:var(--yellow-lt);color:var(--yellow);}
  .db-full{background:var(--green-lt);color:var(--green);}
  .wd-name{font-size:16px;font-weight:700;color:#fff;}
  .wd-focus{font-size:16px;color:var(--muted);margin-top:2px;}
  .wd-time{font-size:11px;color:var(--muted);font-weight:600;}
  .ex-list{padding:0 16px 16px;border-top:1px solid var(--border);background:var(--bg);}
  .ex-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);}
  .ex-row:last-child{border-bottom:none;}
  .ex-chk{width:20px;height:20px;border-radius:2px;border:2px solid var(--muted);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all 0.15s;}
  .ex-chk.done{background:var(--green);border-color:var(--green);color:#fff;}
  .ex-name{font-size:16px;font-weight:600;flex:1;color:#fff;}
  .ex-sets{font-size:13px;color:var(--muted);font-family:'Outfit';}
  .ex-rest{font-size:10px;font-weight:700;padding:3px 8px;border-radius:2px;background:var(--surface);color:var(--muted);border:1px solid var(--border);}
  
  .wlog-row{display:grid;grid-template-columns:60px 1fr 1fr 44px;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center;}
  .wlog-row:last-child{border-bottom:none;}
  .wlog-day{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;}
  .wi-box{background:var(--bg);border:1px solid var(--border);border-radius:2px;padding:8px 10px;}
  .wi-lbl{font-size:8px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;margin-bottom:2px;}
  .wi-box input{background:none;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:#fff;width:100%;}
  .wdiff{font-size:11px;font-weight:700;text-align:center;}
  .wdiff.up{color:var(--red);}
  .wdiff.dn{color:var(--green);}
  
  .bcomp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .bcomp-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;}
  .bcomp-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
  .bcomp-box input{background:none;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:#fff;width:100%;letter-spacing:-0.5px;}
  .bcomp-unit{font-size:10px;color:var(--muted);}
  .bcomp-range{font-size:10px;color:var(--muted);margin-top:4px;}
  
  .meas-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .meas-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;}
  .meas-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
  .meas-box input{background:none;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:#fff;width:100%;letter-spacing:-0.5px;}
  
  .behavior-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
  .beh-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;cursor:default;text-align:center;transition:all 0.2s;}
  .beh-card.active{border-color:var(--red);background:var(--red-lt);}
  .beh-icon{font-size:24px;margin-bottom:8px;filter:grayscale(100%);}
  .beh-label{font-size:13px;font-weight:700;margin-bottom:4px;color:#fff;text-transform:uppercase;letter-spacing:0.5px;}
  .beh-count{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:var(--red);letter-spacing:-0.5px;}
  .beh-controls{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:8px;}
  .beh-btn{width:28px;height:28px;border-radius:2px;border:1px solid var(--border);background:var(--bg);cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;color:var(--muted);}
  .beh-btn:hover{background:var(--surface2);color:#fff;border-color:var(--muted);}
  
  .sex-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
  .sex-day{text-align:center;}
  .sex-day-lbl{font-size:9px;color:var(--muted);font-weight:700;margin-bottom:6px;text-transform:uppercase;}
  .sex-dot{width:34px;height:34px;border-radius:2px;border:1px solid var(--border);cursor:pointer;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:14px;background:var(--bg);color:var(--muted);}
  .sex-dot.logged{background:var(--red-lt);border-color:var(--red);color:var(--red);font-weight:800;}
  
  .week-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
  .wtab{padding:6px 14px;border-radius:2px;border:1px solid var(--border);background:var(--surface);font-size:11px;font-weight:700;cursor:pointer;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}
  .wtab.active{background:var(--red);border-color:var(--red);color:#fff;}
  
  .engine-card{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:16px;position:relative;overflow:hidden;}
  .engine-card::before{content:'';position:absolute;top:0;left:0;width:4px;bottom:0;background:var(--red);}
  .engine-title{font-family:'Outfit',sans-serif;font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;letter-spacing:-0.3px;text-transform:uppercase;}
  .engine-sub{font-size:16px;color:var(--muted);margin-bottom:20px;font-family:'Outfit';}
  .engine-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);}
  .engine-row:last-child{border-bottom:none;}
  .engine-label{font-size:16px;color:var(--muted);font-weight:600;}
  .engine-val{font-family:'Outfit',sans-serif;font-size:16px;font-weight:700;color:var(--green);letter-spacing:-0.2px;}
  
  .report-band{background:linear-gradient(135deg,var(--green-lt) 0%,#121212 100%);border:1px solid var(--green);border-radius:var(--radius);padding:24px;margin-bottom:16px;color:#fff;}
  .report-grade{font-family:'Outfit',sans-serif;font-size:72px;font-weight:800;line-height:1;color:var(--green);letter-spacing:-2px;}
  
  .calc-input{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 16px;margin-bottom:12px;transition:all 0.2s;}
  .calc-input:focus-within{border-color:var(--red);background:var(--surface2);}
  .calc-lbl{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;}
  .calc-input input,.calc-input select{background:none;border:none;outline:none;font-family:'Outfit',sans-serif;font-size:22px;font-weight:700;color:#fff;width:100%;}
  .calc-input input::placeholder{color:var(--border);font-weight:500;}
  
  .result-band{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px;}
  .rb-val{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:var(--red);letter-spacing:-0.5px;}
  .rb-name{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:4px;font-weight:700;}
  
  .prep-step{display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--border);}
  .prep-step:last-child{border-bottom:none;}
  .prep-num{width:28px;height:28px;background:var(--surface2);color:var(--red);border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;margin-top:0px;}
  .prep-title{font-size:16px;font-weight:700;margin-bottom:4px;color:#fff;text-transform:uppercase;letter-spacing:0.5px;}
  .prep-desc{font-size:16px;color:var(--muted);line-height:1.5;}
  
  .new-badge{background:var(--red);color:#fff;font-size:9px;font-weight:800;padding:3px 6px;border-radius:2px;text-transform:uppercase;letter-spacing:0.5px;}
  .btn-gen{display:flex;align-items:center;gap:8px;background:var(--green);color:#fff;border:none;border-radius:2px;padding:10px 16px;font-size:11px;font-weight:800;cursor:pointer;text-transform:uppercase;letter-spacing:1px;}
  .btn-gen:hover{background:var(--green-lt);border:1px solid var(--green);}
  
  @media(max-width:480px){
    .macro-strip{grid-template-columns:repeat(2,1fr);}
    .result-band{grid-template-columns:1fr 1fr;gap:12px;}
    .behavior-grid{grid-template-columns:1fr 1fr;}
  }

  /* LOGIN */
  .login-screen{position:fixed;inset:0;background:#0e0e0e;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;}
  .login-logo{font-family:'Outfit',sans-serif;font-size:48px;font-weight:800;color:#fff;letter-spacing:-2px;text-transform:uppercase;margin-bottom:6px;}
  .login-logo span{color:var(--red);}
  .login-tagline{font-size:16px;color:var(--muted);margin-bottom:4px;text-align:center;font-weight:400;font-style:italic;max-width:340px;padding:8px 0;}
  .login-tagline-line{display:flex;justify-content:center;align-items:center;line-height:2.6;}
  @keyframes letterMagnify{0%{transform:scale(1);}50%{transform:scale(2.1);}100%{transform:scale(1);}}
  .magnify-letter{display:inline-block;white-space:pre;animation:letterMagnify 0.45s cubic-bezier(0.34,1.56,0.64,1) 1 both;}
  .login-tagline-author{margin-bottom:36px;text-align:center;}
  .author-line{display:inline-flex;align-items:center;font-size:13px;font-weight:500;color:var(--muted);font-style:normal;}
  .tolstoy-name{display:inline-flex;border-bottom:2px solid #c49a38;padding-bottom:2px;}
  .login-box{width:100%;max-width:400px;}
  .login-tabs{display:flex;gap:0;margin-bottom:24px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
  .login-tab{flex:1;padding:12px;background:none;border:none;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;color:var(--muted);text-transform:uppercase;letter-spacing:1px;transition:all 0.15s;}
  .login-tab.active{background:var(--red);color:#fff;}
  .login-field{margin-bottom:14px;}
  .login-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:7px;}
  .login-field input{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:#fff;outline:none;transition:border 0.15s;}
  .login-field input:focus{border-color:var(--red);}
  .login-btn{width:100%;background:var(--red);color:#fff;border:none;border-radius:var(--radius);padding:16px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;cursor:pointer;text-transform:uppercase;letter-spacing:1px;margin-top:6px;transition:all 0.15s;}
  .login-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(217,84,54,0.35);}
  .login-err{font-size:12px;color:var(--red);text-align:center;margin-top:10px;font-weight:600;}
  .login-skip{background:none;border:none;font-family:'Outfit',sans-serif;font-size:12px;color:var(--muted);cursor:pointer;margin-top:18px;text-align:center;display:block;width:100%;text-transform:uppercase;letter-spacing:1px;}

  /* FOOD LOG */
  .food-log-btn{display:flex;align-items:center;gap:8px;background:var(--red);color:#fff;border:none;border-radius:var(--radius-sm);padding:12px 18px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;cursor:pointer;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;width:100%;justify-content:center;}
  .food-log-btn:hover{opacity:0.9;}
  .food-entry{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;}
  .food-entry-img{width:60px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0;border:1px solid var(--border);}
  .food-entry-info{flex:1;}
  .food-entry-name{font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;}
  .food-entry-macros{display:flex;gap:10px;flex-wrap:wrap;}
  .food-macro-pill{font-size:10px;font-weight:700;padding:3px 8px;border-radius:2px;background:var(--bg);}
  .food-entry-time{font-size:10px;color:var(--muted);margin-top:4px;}
  .food-delete{background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:2px 6px;border-radius:2px;flex-shrink:0;}
  .food-delete:hover{color:var(--red);}
  .nutrient-alert{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:var(--radius-sm);margin-bottom:10px;border:1px solid;}
  .alert-over{background:var(--red-lt);border-color:var(--red);}
  .alert-under{background:var(--blue-lt);border-color:var(--blue);}
  .alert-ok{background:var(--green-lt);border-color:var(--green);}
  .alert-icon{font-size:18px;flex-shrink:0;margin-top:1px;}
  .alert-text{font-size:12px;line-height:1.5;color:var(--text);}
  .alert-label{font-weight:800;text-transform:uppercase;letter-spacing:0.5px;font-size:10px;margin-bottom:2px;}
  .avg-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;}
  .avg-tile{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 8px;text-align:center;}
  .avg-val{font-size:18px;font-weight:800;line-height:1;margin-bottom:4px;}
  .avg-name{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700;}

  /* PROGRESS PHOTOS */
  .progress-photo-btn{display:flex;align-items:center;gap:8px;background:var(--surface2);color:var(--text);border:2px dashed var(--border);border-radius:var(--radius-sm);padding:20px 18px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;cursor:pointer;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;width:100%;justify-content:center;transition:all 0.15s;}
  .progress-photo-btn:hover{border-color:var(--red);color:var(--red);}
  .photo-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
  .photo-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;}
  .photo-card img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;}
  .photo-card-info{padding:10px 12px;}
  .photo-card-date{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;}
  .photo-card-week{font-size:12px;font-weight:700;color:var(--red);}
  .photo-delete{background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;float:right;padding:2px 4px;}
  .photo-delete:hover{color:var(--red);}
`;

const GOAL_LABELS: Record<string, string> = {bulk:"Hypertrophy",recomp:"Recomp",cut:"Fat Loss"};
const GOAL_COLORS: Record<string, string> = {bulk:"#DDA15E",recomp:"#BC6C25",cut:"#606C38"};
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const BASE_PLANS: Record<string, any> = {
  bulk:{calories:2800,protein:210,carbs:320,fat:70,meals:[
    {time:"6:30AM",name:"Breakfast",desc:"6 Whole Eggs + 2 cups Oats + Banana + OJ",cal:720,pro:48,dot:"#606C38"},
    {time:"10AM",name:"Mid-Morning",desc:"Greek Yogurt (1 cup) + Granola + Mixed Berries",cal:380,pro:22,dot:"#8fa35a"},
    {time:"1PM",name:"Lunch",desc:"Ground Turkey 6oz + White Rice 1.5 cups + Broccoli",cal:680,pro:52,dot:"#283618"},
    {time:"4PM",name:"Pre-Workout",desc:"Oats 1 cup + Whey Shake + Almond Butter",cal:520,pro:38,dot:"#DDA15E"},
    {time:"6:30PM",name:"Post-Workout",desc:"Whey Shake + 2 Bananas + Whole Milk 1 cup",cal:480,pro:50,dot:"#BC6C25"},
    {time:"8PM",name:"Dinner",desc:"Chicken Breast 8oz + Sweet Potato + Veggies + Olive Oil",cal:600,pro:52,dot:"#606C38"},
    {time:"10PM",name:"Nightcap",desc:"Casein Shake + Peanut Butter 2 tbsp",cal:320,pro:30,dot:"#8fa35a"},
  ]},
  cut:{calories:1600,protein:175,carbs:140,fat:40,meals:[
    {time:"7AM",name:"Breakfast",desc:"4 Egg Whites + 1 Whole Egg + Oats 0.5 cup + Black Coffee",cal:290,pro:32,dot:"#606C38"},
    {time:"11AM",name:"Lunch",desc:"Chicken Breast 5oz + Brown Rice 0.75 cup + Broccoli 2 cups",cal:380,pro:42,dot:"#283618"},
    {time:"2PM",name:"Afternoon",desc:"Protein Shake + Apple",cal:180,pro:28,dot:"#BC6C25"},
    {time:"5PM",name:"Pre-Workout",desc:"Rice Cakes + Whey Shake",cal:220,pro:28,dot:"#DDA15E"},
    {time:"7PM",name:"Dinner",desc:"Tilapia 6oz + Asparagus + Salad + Lemon",cal:310,pro:38,dot:"#606C38"},
    {time:"9PM",name:"Evening",desc:"Casein Shake (if hungry)",cal:140,pro:25,dot:"#8fa35a"},
  ]},
  recomp:{calories:2150,protein:190,carbs:215,fat:58,meals:[
    {time:"7AM",name:"Breakfast",desc:"3 Eggs + Egg Whites 3 + Oats 0.75 cup + Berries",cal:480,pro:44,dot:"#606C38"},
    {time:"12PM",name:"Lunch",desc:"Chicken Breast 6oz + Brown Rice + Broccoli + Avocado",cal:580,pro:50,dot:"#283618"},
    {time:"4PM",name:"Pre/Post Workout",desc:"Whey Shake + Banana + Rice Cakes",cal:380,pro:38,dot:"#BC6C25"},
    {time:"7PM",name:"Dinner",desc:"Ground Turkey 5oz + Quinoa + Mixed Veggies",cal:510,pro:45,dot:"#DDA15E"},
    {time:"9PM",name:"Evening",desc:"Cottage Cheese 1 cup + Walnuts",cal:200,pro:18,dot:"#8fa35a"},
  ]},
};

// Adjust calories by body type multiplier
function getBodyTypeMultiplier(bodyType: string, goal: string) {
  if(bodyType==="ectomorph") return goal==="bulk"?1.15:goal==="cut"?0.92:1.05;
  if(bodyType==="endomorph") return goal==="bulk"?0.95:goal==="cut"?0.85:0.93;
  return 1; // mesomorph = baseline
}
// ─── WORKOUT DATA ─────────────────────────────────────────────────────────────
const WORKOUT_DATA: Record<string, {
  name: string;
  tag: string;
  color: string;
  warmup: { name: string; sets: string; reps: string; note: string };
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: string;
    tempo: string;
    note: string;
    restSeconds: number;
    type: "compound" | "isolation";
    superset?: string;
    youtubeSearch: string;
  }[];
}[]> = {
  push: [
    {
      name: "Push — Chest & Shoulders",
      tag: "PUSH",
      color: "#d95436",
      warmup: {
        name: "Flat Dumbbell Flyes",
        sets: "3",
        reps: "12",
        note: "Light weight — open your chest, feel the movement, not a working set",
      },
      exercises: [
        {
          id: "p1",
          name: "Machine Incline Press",
          sets: 4,
          reps: "8-10",
          tempo: "3s down · squeeze hard at top",
          note: "Build up weight each set. Set seat so handles come across your clavicle.",
          restSeconds: 120,
          type: "compound",
          youtubeSearch: "machine incline press chest form",
        },
        {
          id: "p2",
          name: "Incline DB Hex Press",
          sets: 4,
          reps: "10-12",
          tempo: "2s down · pre-squeeze chest before lowering",
          note: "Don't go too heavy. Squeeze your chest together before you lower the dumbbells.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "incline dumbbell hex press chest",
        },
        {
          id: "p3",
          name: "Cable Flyes Cluster Sets",
          sets: 4,
          reps: "10-12 each",
          tempo: "3s down · 2s squeeze at top · 20s between clusters",
          note: "Last set is to failure. 20s micro-rest between each cluster.",
          restSeconds: 90,
          type: "isolation",
          youtubeSearch: "standing cable flyes cluster sets chest",
        },
        {
          id: "p4",
          name: "DB Lateral Raises",
          sets: 4,
          reps: "12-15",
          tempo: "Controlled · don't go past halfway",
          note: "Lift slightly out as you raise. No swinging.",
          restSeconds: 60,
          type: "isolation",
          youtubeSearch: "dumbbell lateral raises shoulders form",
        },
        {
          id: "p5",
          name: "Tricep Cable Pushdown",
          sets: 3,
          reps: "12-15",
          tempo: "Squeeze at bottom · controlled up",
          note: "Dropset on last set — reduce weight and keep going to failure.",
          restSeconds: 60,
          type: "isolation",
          youtubeSearch: "tricep cable pushdown form dropset",
        },
      ],
    },
  ],
  pull: [
    {
      name: "Pull — Back & Biceps",
      tag: "PULL",
      color: "#4a6fa5",
      warmup: {
        name: "Seated Cable Rows",
        sets: "4",
        reps: "10-12",
        note: "Fix hips in place. Arms are just levers — squeeze mid-back for 2s at top, 2s eccentric.",
      },
      exercises: [
        {
          id: "l1",
          name: "Stiff Arm Cable Pulldown",
          sets: 3,
          reps: "12",
          tempo: "Full stretch · squeeze lats at bottom",
          note: "Establish mind-muscle connection with your lats before adding weight.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "stiff arm cable pulldown lat activation",
        },
        {
          id: "l2",
          name: "Wide Grip Seated Cable Row",
          sets: 3,
          reps: "8-10",
          tempo: "2s eccentric · squeeze upper back",
          note: "Upper back focus. Don't let your lower back do the work.",
          restSeconds: 120,
          type: "compound",
          youtubeSearch: "wide grip seated cable row upper back",
        },
        {
          id: "l3",
          name: "Single Arm DB Row",
          sets: 2,
          reps: "10 each arm",
          tempo: "Row back and up · 2s eccentric",
          note: "Lat focus. Keep seat high for lower lat engagement.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "single arm dumbbell row lat focus",
        },
        {
          id: "l4",
          name: "Chest Supported DB Row",
          sets: 3,
          reps: "10-12",
          tempo: "Slight hyperextend at bottom · squeeze lats and mid-back",
          note: "Supported on incline bench. Row back and up.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "chest supported dumbbell row form",
        },
        {
          id: "l5",
          name: "EZ Bar Cable Curl",
          sets: 3,
          reps: "12",
          tempo: "Controlled down · stretch bicep",
          note: "Dropset on last set.",
          restSeconds: 60,
          type: "isolation",
          youtubeSearch: "ez bar cable curl bicep form",
        },
      ],
    },
  ],
  legs: [
    {
      name: "Legs — Quads, Glutes & Hams",
      tag: "LEGS",
      color: "#6b705c",
      warmup: {
        name: "Leg Extensions — 2s Isometric Hold",
        sets: "4",
        reps: "10",
        note: "Medium weight only. Getting blood into the quads.",
      },
      exercises: [
        {
          id: "g1",
          name: "Leg Press",
          sets: 5,
          reps: "10-15",
          tempo: "2-3s eccentric · drive through heels",
          note: "Don't lock out knees. Focus on quads flexing at the top.",
          restSeconds: 120,
          type: "compound",
          youtubeSearch: "leg press proper form quads",
        },
        {
          id: "g2",
          name: "Barbell Squat",
          sets: 4,
          reps: "10",
          tempo: "1-2s down · pause at bottom · drive through heels",
          note: "Give yourself warm-up sets to adjust. Squeeze quads at top.",
          restSeconds: 120,
          type: "compound",
          youtubeSearch: "barbell squat proper form beginners",
        },
        {
          id: "g3",
          name: "Barbell Hip Thrust",
          sets: 4,
          reps: "10-12",
          tempo: "Hard squeeze at top · last rep hold 3s",
          note: "Feet farther out. Squeeze from bottom of glute to top every rep.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "barbell hip thrust glutes form",
        },
        {
          id: "g4",
          name: "DB Bulgarian Split Squat",
          sets: 4,
          reps: "10 each",
          tempo: "Controlled down · drive through front heel",
          note: "Stay upright to hit quads more. Control the eccentric.",
          restSeconds: 90,
          type: "compound",
          youtubeSearch: "bulgarian split squat dumbbell form",
        },
        {
          id: "g5",
          name: "Dumbbell RDL",
          sets: 3,
          reps: "12-15",
          tempo: "Push hips back first · 2-3s eccentric",
          note: "Feel the hamstring stretch. Drive through heels at the top.",
          restSeconds: 90,
          type: "isolation",
          youtubeSearch: "dumbbell romanian deadlift hamstrings form",
        },
      ],
    },
  ],
};

// ─── REST TIME CALCULATOR ─────────────────────────────────────────────────────
function getRestTime(
  exercise: any,
  setIndex: number,
  totalSets: number,
  weeklyData: any,
  weekNum: number
): number {
  let base = exercise.restSeconds;
  if (setIndex === totalSets - 1) base = Math.max(45, base - 15);
  const beh = weeklyData[weekNum]?.behaviors || {};
  const poorSleep = beh["Poor Sleep"] || 0;
  const missedMeals = beh["Missed Meals"] || 0;
  if (poorSleep >= 2 || missedMeals >= 2) base += 30;
  return base;
}

// ─── EXERCISE DETAIL MODAL ────────────────────────────────────────────────────
function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: any;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        padding: "0 0 env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "#3e6451", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
            {exercise.type === "compound" ? "Compound" : "Isolation"} · {exercise.sets} sets · {exercise.reps} reps
          </div>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            {exercise.name}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "#2a2a2a", border: "none", borderRadius: 8, padding: "8px 14px", color: "#a0a0a0", fontSize: 18, cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      <div style={{ margin: 16 }}>
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeSearch)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", background: "#1a1a1a", border: "1px solid #3e6451", borderRadius: 10, padding: "18px 20px", textDecoration: "none", transition: "background 0.15s" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" fill="#FF0000"/>
            <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white"/>
          </svg>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Watch Form on YouTube
          </span>
        </a>
      </div>

      <div style={{ padding: "0 16px", flex: 1, overflowY: "auto" }}>
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>⏱ Tempo</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{exercise.tempo}</div>
        </div>
        <div style={{ background: "#0e1a14", border: "1px solid #3e645140", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#3e6451", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>💡 Coach Note</div>
          <div style={{ fontSize: 16, color: "#c8e6d4", lineHeight: 1.6 }}>{exercise.note}</div>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>😮‍💨 Rest Between Sets</div>
          <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.6 }}>
            {exercise.type === "compound" ? "2 min · Your nervous system needs it" : "90 sec · Keep intensity up"}
          </div>
          <div style={{ fontSize: 13, color: "#6b705c", marginTop: 6 }}>Last set: 15s less — weight is heavier, reps are shorter</div>
        </div>
      </div>
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone, onSkip }: { seconds: number; onDone: () => void; onSkip: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const pct = (remaining / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ fontSize: 11, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Rest</div>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={100} cy={100} r={88} fill="none" stroke="#1a1a1a" strokeWidth={8} />
          <circle
            cx={100} cy={100} r={88} fill="none"
            stroke={remaining <= 10 ? "#3e6451" : "#6b705c"}
            strokeWidth={8}
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 52, fontWeight: 800, color: remaining <= 10 ? "#3e6451" : "#fff", letterSpacing: -2, lineHeight: 1, transition: "color 0.3s" }}>
            {mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : secs}
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>seconds</div>
        </div>
      </div>
      {remaining <= 10 && (
        <div style={{ fontSize: 16, color: "#3e6451", fontWeight: 700, animation: "pulse 0.5s ease-in-out infinite alternate" }}>Get ready...</div>
      )}
      <button
        onClick={onSkip}
        style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 100, padding: "12px 32px", color: "#a0a0a0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}
      >
        Skip Rest →
      </button>
      <style>{`@keyframes pulse { from { opacity: 0.6; transform: scale(0.98); } to { opacity: 1; transform: scale(1.02); } }`}</style>
    </div>
  );
}

// ─── ACTIVE WORKOUT VIEW ──────────────────────────────────────────────────────
function ActiveWorkout({ workout, weeklyData, weekNum, onFinish }: { workout: any; weeklyData: any; weekNum: number; onFinish: (summary: any) => void }) {
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean[]>>({});
  const [sessionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const exercise = workout.exercises[exIdx];
  const isLastEx = exIdx === workout.exercises.length - 1;
  const isLastSet = setIdx === exercise.sets - 1;
  const restTime = getRestTime(exercise, setIdx, exercise.sets, weeklyData, weekNum);
  const elapsedMins = Math.floor(elapsed / 60);
  const elapsedSecs = elapsed % 60;

  const markSetDone = () => {
    const key = exercise.id;
    const prev = completed[key] || [];
    const next = [...prev];
    next[setIdx] = true;
    setCompleted(c => ({ ...c, [key]: next }));
    if (isLastSet && isLastEx) {
      setShowRest(false);
      onFinish({ elapsed, completed });
    } else {
      setShowRest(true);
    }
  };

  const afterRest = () => {
    setShowRest(false);
    if (isLastSet) { setExIdx(i => i + 1); setSetIdx(0); }
    else { setSetIdx(s => s + 1); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", paddingBottom: 100 }}>
      {showRest && <RestTimer seconds={restTime} onDone={afterRest} onSkip={afterRest} />}
      {showModal && <ExerciseModal exercise={exercise} onClose={() => setShowModal(false)} />}

      <div style={{ background: "#121212", borderBottom: "1px solid #1a1a1a", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{workout.tag}</div>
          <div style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 800, color: "#fff" }}>{workout.name.split("—")[1]?.trim()}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Outfit", fontSize: 22, fontWeight: 800, color: "#c49a38" }}>{elapsedMins}:{elapsedSecs.toString().padStart(2, "0")}</div>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>elapsed</div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", display: "flex", gap: 6 }}>
        {workout.exercises.map((_: any, i: number) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < exIdx ? "#6b705c" : i === exIdx ? "#3e6451" : "#222", transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
          Exercise {exIdx + 1} of {workout.exercises.length}
        </div>
        <div onClick={() => setShowModal(true)} style={{ fontFamily: "Outfit, sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          {exercise.name}
          <span style={{ fontSize: 14, color: "#3e6451", fontWeight: 700 }}>▶ Form</span>
        </div>
        <div style={{ fontSize: 14, color: "#a0a0a0", marginBottom: 20 }}>{exercise.sets} sets · {exercise.reps} reps</div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {Array.from({ length: exercise.sets }).map((_, i) => {
            const done = completed[exercise.id]?.[i];
            const current = i === setIdx;
            return (
              <div key={i} style={{ flex: 1, height: 52, borderRadius: 8, border: `2px solid ${done ? "#6b705c" : current ? "#3e6451" : "#222"}`, background: done ? "#23261e" : current ? "#0f1e17" : "#111", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, transition: "all 0.2s" }}>
                <div style={{ fontSize: 10, color: done ? "#6b705c" : current ? "#3e6451" : "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{done ? "✓" : `Set ${i + 1}`}</div>
                {!done && <div style={{ fontSize: 11, color: "#555" }}>{exercise.reps}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>⏱ Tempo</div>
          <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 600 }}>{exercise.tempo}</div>
        </div>

        <button onClick={markSetDone} style={{ width: "100%", padding: 18, background: "#3e6451", border: "none", borderRadius: 12, fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          {isLastSet && isLastEx ? "Finish Workout 🏁" : `Set ${setIdx + 1} Done → Rest`}
        </button>
        {!isLastEx && (
          <button onClick={() => { setExIdx(i => i + 1); setSetIdx(0); }} style={{ width: "100%", padding: 14, background: "transparent", border: "1px solid #222", borderRadius: 12, fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 700, color: "#555", cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
            Skip This Exercise
          </button>
        )}
      </div>
    </div>
  );
}

// ─── WORKOUT COMPLETE ──────────────────────────────────────────────────────────
function WorkoutComplete({ elapsed, onDone }: { elapsed: number; onDone: () => void }) {
  const mins = Math.floor(elapsed / 60);
  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>💪</div>
      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -1 }}>Session Complete</div>
      <div style={{ fontSize: 15, color: "#a0a0a0", marginBottom: 32, lineHeight: 1.6 }}>
        {mins} minutes in the gym.{" "}
        {mins < 50 ? "Efficient. That's how it's done." : mins < 70 ? "Solid session. Right in the zone." : "Dedicated. Now go eat and recover."}
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #3e6451", borderRadius: 12, padding: "16px 32px", marginBottom: 32 }}>
        <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 48, fontWeight: 800, color: "#3e6451", letterSpacing: -2 }}>{mins}</div>
        <div style={{ fontSize: 11, color: "#a0a0a0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>minutes</div>
      </div>
      <button onClick={onDone} style={{ width: "100%", maxWidth: 320, padding: 18, background: "#3e6451", border: "none", borderRadius: 12, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff", cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
        Back to Home
      </button>
    </div>
  );
}

function calcTDEE(stats: any, activity: string, sex: string) {
  if(!stats||!stats.weight||!stats.heightFt) return 2000;
  const kg=stats.weight*0.453592,cm=stats.heightFt*30.48+(stats.heightIn||0)*2.54;
  const bmr=sex==="male"?10*kg+6.25*cm-5*stats.age+5:sex==="nonbinary"?10*kg+6.25*cm-5*stats.age-78:10*kg+6.25*cm-5*stats.age-161;
  return Math.round(bmr*({sedentary:1.2,light:1.375,moderate:1.55,very:1.725}[activity]||1.55));
}

function runEngine(up: any, wd: any, wn: number) {
  if(!wd||wn<2) return null;
  const prev=wd[wn-1];
  if(!prev) return null;
  const goal=up?.goal||"cut",base=BASE_PLANS[goal];
  let calAdj=0,protAdj=0,notes: string[]=[];
  const amW=Object.values(prev.weightLog||{}).map((e: any)=>parseFloat(e.am)).filter(Boolean);
  if(amW.length>=3){
    const delta=amW[amW.length-1]-amW[0];
    if(goal==="cut"&&delta>0.5){calAdj-=100;notes.push("Scale up this week, cutting 100 cal");}
    if(goal==="cut"&&delta<-2){calAdj+=75;notes.push("Losing fast, adding 75 cal to protect muscle");}
    if(goal==="bulk"&&delta<0.2){calAdj+=150;notes.push("Not gaining, adding 150 cal to surplus");}
  }
  const beh=prev.behaviors||{};
  const totalBeh=Object.values(beh).reduce((a: any,b: any)=>a+(b||0),0);
  if(totalBeh>=5){calAdj-=50;notes.push("High bad behaviors, tightening calories 50 cal");}
  if((beh["Poor Sleep"]||0)>=3){protAdj+=10;notes.push("Poor sleep detected, adding 10g protein for recovery");}
  if(notes.length===0) notes.push("Maintenance verified. Consistency locked.");
  return {calAdj,protAdj,newCal:base.calories+calAdj,newProt:base.protein+protAdj,notes};
}

const BEHAVIORS=[
  {key:"Alcohol",icon:<Beer size={20} color="#DDA15E" />,label:"Alcohol"},
  {key:"Smoking",icon:<Cigarette size={20} color="#BC6C25" />,label:"Smoking/Vaping"},
  {key:"Poor Sleep",icon:<Moon size={20} color="#606C38" />,label:"Poor Sleep"},
  {key:"Missed Meals",icon:<Utensils size={20} color="#DDA15E" />,label:"Missed Meals"},
  {key:"Junk Food",icon:<Pizza size={20} color="#BC6C25" />,label:"Junk Food"},
  {key:"Drugs",icon:<Syringe size={20} color="#606C38" />,label:"Drugs"},
];

// ─── Body type auto-detect from measurements ─────────────────────────────────
function suggestBodyType(stats: any): string|null {
  if(!stats?.heightFt || !stats?.weight) return null;
  const hIn = parseFloat(stats.heightFt)*12 + parseFloat(stats.heightIn||0);
  const wKg = parseFloat(stats.weight)*0.453592;
  const hM = hIn*0.0254;
  const bmi = wKg/(hM*hM);
  const waist = parseFloat(stats.waist||0);
  const whr = waist>0 ? waist/hIn : 0;
  if(bmi<20.5||whr<0.43) return "ectomorph";
  if(bmi>26.5||whr>0.54) return "endomorph";
  return "mesomorph";
}

const QS: any[] = [
  {id:"name",tag:"01 — Hey",title:"What's your\nname...bruhhh?",sub:"Not for Instagram. Just so we know what to call you.",type:"name"},

  {id:"goal",tag:"02 — Your Why",title:"What are we\nworking toward?",sub:"Everything — calories, split, rest days — gets built around this answer.",type:"cards",cols:1,
    opts:[
      {v:"cut",icon:<Flame size={24} color="#BC6C25"/>,l:"Lose Fat",d:"Caloric deficit · Cardio integration · Muscle preservation."},
      {v:"bulk",icon:<Dumbbell size={24} color="#DDA15E"/>,l:"Build Muscle",d:"Caloric surplus · Heavy compounds · Progressive overload."},
      {v:"recomp",icon:<Activity size={24} color="#606C38"/>,l:"Both — Recomposition",d:"Maintenance calories · Lose fat and gain muscle simultaneously. Slower, but real."},
    ]},

  {id:"targetWeight",tag:"03 — The Target",title:"Where do you\nwant to be?",sub:"Your goal weight in lbs. Sets your weekly progress milestones.",type:"number",unit:"lbs",placeholder:"e.g. 185"},

  {id:"stats",tag:"04 — Your Body",title:"Let's build\nyour profile.",sub:"These numbers automatically calculate your body type, TDEE, and macro targets. Be honest.",type:"measurements"},

  {id:"bodyType",tag:"05 — Body Type",title:"Here's what\nyour numbers say.",sub:"Calculated from your measurements. Confirm it or adjust — you know your body.",type:"bodytype"},

  {id:"sleep",tag:"06 — Your 24 Hours",title:"Sleep. Work.\nGym time.",sub:"You have 24 hours. We work backward from what you sleep and work to find your real gym window.",type:"sleep"},

  {id:"sex",tag:"07 — Biology",title:"Biological\nsex?",sub:"Used for BMR formula. Non-binary uses the average.",type:"cards",cols:3,
    opts:[{v:"male",icon:<User size={24} color="#DDA15E"/>,l:"Male",d:""},{v:"female",icon:<User size={24} color="#DDA15E"/>,l:"Female",d:""},{v:"nonbinary",icon:<User size={24} color="#DDA15E"/>,l:"Non-Binary",d:""}]},

  {id:"activity",tag:"08 — Baseline",title:"Daily activity\nlevel?",sub:"Used for your TDEE and calorie targets.",type:"cards",cols:2,
    opts:[
      {v:"sedentary",icon:<User size={24} color="#FEFAE0"/>,l:"Sedentary",d:"Desk job · mostly sitting"},
      {v:"light",icon:<User size={24} color="#FEFAE0"/>,l:"Light",d:"Walk around · 1–2x training"},
      {v:"moderate",icon:<Activity size={24} color="#DDA15E"/>,l:"Moderate",d:"On feet · 3–4x training"},
      {v:"very",icon:<Zap size={24} color="#BC6C25"/>,l:"High Output",d:"Physical job · 5–7x training"},
    ]},

  {id:"experience",tag:"09 — History",title:"Training\nhistory?",sub:"Sets your volume, intensity, and how fast we progress you.",type:"cards",cols:1,
    opts:[
      {v:"beginner",icon:<Battery size={24} color="#606C38"/>,l:"Beginner — 0 to 1 year",d:"Foundation Phase · Linear progression · Form comes first."},
      {v:"intermediate",icon:<Battery size={24} color="#DDA15E"/>,l:"Intermediate — 1 to 3 years",d:"Hypertrophy Phase · Undulating periodization · More volume."},
      {v:"advanced",icon:<Battery size={24} color="#BC6C25"/>,l:"Advanced — 3+ years",d:"Performance Phase · Block periodization · You know your body."},
    ]},

  {id:"focusMuscle",tag:"10 — Focus",title:"Pick your focus\nmuscle groups.",sub:"Select at least 2 — your weak points get extra volume. Every compound hits more than one group.",type:"cards",cols:2,multi:true,minSelect:2,
    opts:[
      {v:"chest",icon:<Activity size={24} color="#BC6C25"/>,l:"Chest",d:"Pec development",compound:"Trains front delts & triceps on every press."},
      {v:"back",icon:<Activity size={24} color="#606C38"/>,l:"Back",d:"Width & thickness",compound:"Trains rear delts, rhomboids & biceps on every pull."},
      {v:"legs",icon:<Activity size={24} color="#DDA15E"/>,l:"Legs",d:"Quads, hams, glutes",compound:"Trains glutes, core stability & lower back under load."},
      {v:"shoulders",icon:<Activity size={24} color="#BC6C25"/>,l:"Shoulders",d:"3D delt look",compound:"Trains upper traps & triceps on every overhead press."},
      {v:"arms",icon:<Dumbbell size={24} color="#DDA15E"/>,l:"Arms",d:"Bis & tris",compound:"Trains brachialis, forearms & grip on every curl & extension."},
      {v:"core",icon:<Zap size={24} color="#606C38"/>,l:"Core",d:"Abs & stability",compound:"Trains hip flexors & spinal erectors on every bracing movement."},
    ]},

  {id:"days",tag:"11 — Schedule",title:"Training\nfrequency?",sub:"Determines your weekly split. This adjusts based on your 24h window.",type:"days"},

  {id:"smokes",tag:"12 — Habits",title:"Do you\nsmoke?",sub:"No judgment. It affects recovery time and cardio capacity — we factor it in.",type:"yn",yLabel:"Yeah, I smoke",nLabel:"Nah, clean lungs"},

  {id:"drinksWater",tag:"13 — Hydration",title:"You drink water\nbruhhhh?",sub:"Like consistently. Not just when you're already dying.",type:"yn",yLabel:"Yeah, I stay hydrated",nLabel:"Mostly forget honestly"},

  {id:"sexFreq",tag:"14 — Lifestyle",title:"How many times a\nweek? Real talk.",sub:"Energy expenditure. Recovery data. We track everything that matters.",type:"cards",cols:2,
    opts:[
      {v:"0",icon:<Moon size={24} color="#606C38"/>,l:"None right now",d:""},
      {v:"1-2",icon:<Zap size={24} color="#DDA15E"/>,l:"1 – 2x",d:""},
      {v:"3-5",icon:<Flame size={24} color="#BC6C25"/>,l:"3 – 5x",d:""},
      {v:"6+",icon:<Battery size={24} color="#DDA15E"/>,l:"Daily+",d:"Respect."},
    ]},

  {id:"diet",tag:"15 — Nutrition",title:"Dietary\nconstraints?",sub:"We adjust your meals to your restrictions.",type:"diet"},

  {id:"weekTask",tag:"16 — This Week",title:"Your #1 work task\nthis week?",sub:"One thing outside the gym you must get done. We ask every Sunday. Accountability doesn't stop at the gym door.",type:"worktask"},
];

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({onLogin}: {onLogin: (user: any, token: string) => void}) {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google"|null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setSocialLoading(provider);
    setError("");
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (oauthErr) {
      setError(oauthErr.message);
      setSocialLoading(null);
    }
    // On success, user is redirected — onAuthStateChange handles the return
  };

  const handleSubmit = async () => {
    setError("");
    if(!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if(password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    try {
      if(mode === "signup") {
        if(!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        // Create user via server (uses service role key)
        await signUpUser(email, password, name);
        // Then sign in to get the session token
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if(signInErr || !data.session) { setError(signInErr?.message || "Sign in after signup failed."); setLoading(false); return; }
        const user = { email, name, id: data.user.id };
        onLogin(user, data.session.access_token);
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if(signInErr || !data.session) { setError("Incorrect email or password."); setLoading(false); return; }
        const displayName = data.user.user_metadata?.name || email.split("@")[0];
        const user = { email, name: displayName, id: data.user.id };
        onLogin(user, data.session.access_token);
      }
    } catch(err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-logo">BRUHH<span>H</span></div>
      {(()=>{
        const L1="Everyone thinks of changing the world,";
        const L2="but no one thinks of changing himself.";
        const BY="By:\u00A0";
        const NAME="Leo Tolstoy";
        const l1len=L1.length, l2len=L2.length, bylen=BY.length;
        const delay=(n:number)=>({animationDelay:`${n*0.05}s`});
        return(<>
          <div className="login-tagline">
            <div className="login-tagline-line">{L1.split("").map((ch,i)=><span key={i} className="magnify-letter" style={delay(i)}>{ch===" "?"\u00A0":ch}</span>)}</div>
            <div className="login-tagline-line">{L2.split("").map((ch,i)=><span key={i} className="magnify-letter" style={delay(l1len+i)}>{ch===" "?"\u00A0":ch}</span>)}</div>
          </div>
          <div className="login-tagline-author">
            <div className="author-line">
              {BY.split("").map((ch,i)=><span key={i} className="magnify-letter" style={{...delay(l1len+l2len+i),fontSize:13,color:"var(--muted)",fontWeight:500}}>{ch}</span>)}
              <span className="tolstoy-name">
                {NAME.split("").map((ch,i)=><span key={i} className="magnify-letter" style={{...delay(l1len+l2len+bylen+i),color:"#c49a38",fontWeight:700,fontSize:13}}>{ch===" "?"\u00A0":ch}</span>)}
              </span>
            </div>
          </div>
        </>);
      })()}
      <div className="login-box">
        {/* Social Login */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          <button
            onClick={()=>handleSocialLogin("google")}
            disabled={!!socialLoading || loading}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,width:"100%",background:"#fff",border:"none",borderRadius:"var(--radius)",padding:"14px 16px",fontFamily:"Outfit,sans-serif",fontSize:15,fontWeight:700,color:"#1a1a1a",cursor:"pointer",opacity:(socialLoading||loading)?0.6:1,transition:"opacity 0.15s"}}
          >
            {socialLoading==="google" ? "Redirecting..." : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
          <span style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5}}>or</span>
          <div style={{flex:1,height:1,background:"var(--border)"}}/>
        </div>

        <div className="login-tabs">
          <button className={`login-tab${mode==="login"?" active":""}`} onClick={()=>{setMode("login");setError("");}}>Log In</button>
          <button className={`login-tab${mode==="signup"?" active":""}`} onClick={()=>{setMode("signup");setError("");}}>Sign Up</button>
        </div>
        {mode==="signup" && (
          <div className="login-field">
            <label>Full Name</label>
            <input type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        )}
        <div className="login-field">
          <label>Email</label>
          <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="login-field">
          <label>Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
              style={{ paddingRight: "2.8rem", width: "100%", boxSizing: "border-box" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute",
                right: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#606C38",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                opacity: 0.7,
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="login-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : mode==="login" ? "Log In" : "Create Account"}
        </button>
        {error && <div className="login-err">{error}</div>}
        <button className="login-skip" onClick={()=>onLogin({email:"guest", name:"Guest", guest:true}, "")}>Continue as Guest →</button>
      </div>
    </div>
  );
}

// ─── FOOD PHOTO LOGGER ────────────────────────────────────────────────────────
const FOOD_NUTRIENT_TARGETS: Record<string, {cal:number,protein:number,carbs:number,fat:number}> = {
  bulk: {cal:2800,protein:210,carbs:320,fat:70},
  cut:  {cal:1475,protein:160,carbs:127,fat:40},
  recomp:{cal:2100,protein:185,carbs:210,fat:55},
};

function getNutrientAlerts(log: any[], goal: string): Array<{type:"over"|"under"|"ok", nutrient:string, message:string}> {
  if(!log || log.length === 0) return [];
  const targets = FOOD_NUTRIENT_TARGETS[goal] || FOOD_NUTRIENT_TARGETS.cut;
  const days = Math.max(1, Math.ceil(log.length / 3));
  const totals = log.reduce((a,e)=>({
    cal: a.cal + (e.cal||0),
    protein: a.protein + (e.protein||0),
    carbs: a.carbs + (e.carbs||0),
    fat: a.fat + (e.fat||0),
  }), {cal:0,protein:0,carbs:0,fat:0});
  const avg = {cal:totals.cal/days, protein:totals.protein/days, carbs:totals.carbs/days, fat:totals.fat/days};
  const alerts: any[] = [];
  if(avg.protein < targets.protein * 0.8) alerts.push({type:"under",nutrient:"Protein",message:`You're averaging ${Math.round(avg.protein)}g protein/day — you need ${targets.protein}g. Try adding chicken, eggs, or a shake 💪`});
  if(avg.protein > targets.protein * 1.3) alerts.push({type:"over",nutrient:"Protein",message:`You're getting ${Math.round(avg.protein)}g protein/day — above your ${targets.protein}g target. Stay balanced 🥩`});
  if(avg.cal < targets.cal * 0.75) alerts.push({type:"under",nutrient:"Calories",message:`You're only averaging ${Math.round(avg.cal)} cal/day. Undereating can cost you muscle — fuel up! 🍽️`});
  if(avg.cal > targets.cal * 1.25) alerts.push({type:"over",nutrient:"Calories",message:`You're eating ~${Math.round(avg.cal)} cal/day, above your ${targets.cal} target. Stay disciplined 🔥`});
  if(avg.fat > targets.fat * 1.4) alerts.push({type:"over",nutrient:"Fat",message:`Your fat intake is high at ${Math.round(avg.fat)}g/day. Swap some processed foods for lean options 🥗`});
  if(avg.carbs < targets.carbs * 0.6) alerts.push({type:"under",nutrient:"Carbs",message:`Low carbs detected (~${Math.round(avg.carbs)}g/day). Carbs fuel your workouts — add rice or oats 🍚`});
  if(alerts.length === 0) alerts.push({type:"ok",nutrient:"Balance",message:`You're nailing your nutrition! Averages are on point. Keep that consistency 🏆`});
  return alerts;
}

// Simple food DB for photo recognition simulation
const FOOD_DB: Record<string, {cal:number,protein:number,carbs:number,fat:number}> = {
  "Rice bowl":     {cal:520,protein:28,carbs:72,fat:10},
  "Chicken salad": {cal:380,protein:42,carbs:18,fat:14},
  "Protein shake": {cal:160,protein:30,carbs:8, fat:3},
  "Oatmeal":       {cal:290,protein:10,carbs:52,fat:6},
  "Grilled salmon":{cal:420,protein:46,carbs:4, fat:22},
  "Eggs & toast":  {cal:350,protein:22,carbs:30,fat:16},
  "Turkey wrap":   {cal:440,protein:35,carbs:44,fat:12},
  "Smoothie":      {cal:280,protein:18,carbs:42,fat:5},
};

function FoodPhotoLogger({foodLog, setFoodLog, goal}: {foodLog:any[], setFoodLog:(l:any[])=>void, goal:string}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [showLog, setShowLog] = useState(true);

  const handlePhoto = (e: any) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgSrc = ev.target?.result as string;
      // Simulate AI food recognition with random pick from DB
      setTimeout(() => {
        const foods = Object.keys(FOOD_DB);
        const detected = foods[Math.floor(Math.random() * foods.length)];
        const macros = FOOD_DB[detected];
        const entry = {
          id: Date.now(),
          name: detected,
          imgSrc,
          time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
          date: new Date().toLocaleDateString(),
          ...macros,
        };
        setFoodLog([...foodLog, entry]);
        setAnalyzing(false);
      }, 1800);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeEntry = (id: number) => setFoodLog(foodLog.filter(e=>e.id!==id));

  const avg = foodLog.length > 0 ? {
    cal: Math.round(foodLog.reduce((a,e)=>a+e.cal,0)/Math.max(1,Math.ceil(foodLog.length/3))),
    protein: Math.round(foodLog.reduce((a,e)=>a+e.protein,0)/Math.max(1,Math.ceil(foodLog.length/3))),
    carbs: Math.round(foodLog.reduce((a,e)=>a+e.carbs,0)/Math.max(1,Math.ceil(foodLog.length/3))),
    fat: Math.round(foodLog.reduce((a,e)=>a+e.fat,0)/Math.max(1,Math.ceil(foodLog.length/3))),
  } : null;

  const alerts = getNutrientAlerts(foodLog, goal);
  const targets = FOOD_NUTRIENT_TARGETS[goal] || FOOD_NUTRIENT_TARGETS.cut;

  return (
    <div>
      <div className="slabel">Food Photo Log</div>
      
      <label style={{display:"block",cursor:"pointer"}}>
        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handlePhoto} />
        <div className="food-log-btn">
          {analyzing ? "🔍 Analyzing your food..." : "📸 Take Photo & Log Food"}
        </div>
      </label>

      {avg && (
        <>
          <div className="slabel">Daily Averages</div>
          <div className="avg-grid">
            {[
              {v:avg.cal, n:"Calories", c:GOAL_COLORS[goal]||"var(--red)", target:targets.cal},
              {v:avg.protein+"g", n:"Protein", c:"var(--blue)", target:targets.protein},
              {v:avg.carbs+"g", n:"Carbs", c:"var(--yellow)", target:targets.carbs},
              {v:avg.fat+"g", n:"Fat", c:"var(--green)", target:targets.fat},
            ].map(m=>(
              <div key={m.n} className="avg-tile">
                <div className="avg-val" style={{color:m.c}}>{m.v}</div>
                <div className="avg-name">{m.n}</div>
              </div>
            ))}
          </div>

          <div className="slabel">Smart Alerts</div>
          {alerts.map((a,i)=>(
            <div key={i} className={`nutrient-alert ${a.type==="over"?"alert-over":a.type==="under"?"alert-under":"alert-ok"}`}>
              <div className="alert-icon">{a.type==="over"?"⚠️":a.type==="under"?"📉":"✅"}</div>
              <div className="alert-text">
                <div className="alert-label" style={{color:a.type==="over"?"var(--red)":a.type==="under"?"var(--blue)":"var(--green)"}}>{a.nutrient}</div>
                {a.message}
              </div>
            </div>
          ))}
        </>
      )}

      {foodLog.length > 0 && (
        <>
          <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setShowLog(s=>!s)}>
            Logged Meals ({foodLog.length}) {showLog?"▲":"▼"}
          </div>
          {showLog && foodLog.slice().reverse().map((entry:any) => (
            <div key={entry.id} className="food-entry">
              <img src={entry.imgSrc} className="food-entry-img" alt={entry.name} />
              <div className="food-entry-info">
                <div className="food-entry-name">{entry.name}</div>
                <div className="food-entry-macros">
                  <span className="food-macro-pill" style={{color:"var(--red)"}}>{entry.cal} cal</span>
                  <span className="food-macro-pill" style={{color:"var(--blue)"}}>{entry.protein}g protein</span>
                  <span className="food-macro-pill" style={{color:"var(--yellow)"}}>{entry.carbs}g carbs</span>
                  <span className="food-macro-pill" style={{color:"var(--green)"}}>{entry.fat}g fat</span>
                </div>
                <div className="food-entry-time">{entry.date} · {entry.time}</div>
              </div>
              <button className="food-delete" onClick={()=>removeEntry(entry.id)}>✕</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── PROGRESS PHOTOS ──────────────────────────────────────────────────────────
function ProgressPhotos({photos, setPhotos, weekNum}: {photos:any[], setPhotos:(p:any[])=>void, weekNum:number}) {
  const [uploading, setUploading] = useState(false);

  const handlePhoto = (e: any) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const entry = {
        id: Date.now(),
        imgSrc: ev.target?.result as string,
        date: new Date().toLocaleDateString(),
        week: weekNum,
      };
      setPhotos([...photos, entry]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = (id: number) => setPhotos(photos.filter(p=>p.id!==id));

  const sorted = [...photos].sort((a,b)=>b.week-a.week);

  return (
    <div>
      <div className="slabel">Progress Photos</div>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.5}}>
        Track your body transformation week by week. Log a shirtless photo to see your visual progress.
      </div>

      <label style={{display:"block",cursor:"pointer"}}>
        <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handlePhoto} />
        <div className="progress-photo-btn">
          {uploading ? "📤 Saving..." : "📷 Log Progress Photo (Week " + weekNum + ")"}
        </div>
      </label>

      {photos.length === 0 ? (
        <div style={{textAlign:"center",padding:"32px 16px",color:"var(--muted)",fontSize:12}}>
          No progress photos yet. Log your first one above to start tracking your transformation 💪
        </div>
      ) : (
        <>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:12,fontWeight:600}}>
            {photos.length} photo{photos.length>1?"s":" "} logged · {[...new Set(photos.map(p=>p.week))].length} week{[...new Set(photos.map(p=>p.week))].length>1?"s":""} tracked
          </div>
          <div className="photo-grid">
            {sorted.map((p:any) => (
              <div key={p.id} className="photo-card">
                <img src={p.imgSrc} alt={`Week ${p.week}`} />
                <div className="photo-card-info">
                  <div className="photo-card-date">{p.date}</div>
                  <div className="photo-card-week">Week {p.week}</div>
                  <button className="photo-delete" onClick={()=>removePhoto(p.id)}>✕ remove</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Quiz({onComplete}: {onComplete: (answers: any) => void}) {
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState<any>({diet:["None"], stats: {}});
  const q=QS[step];
  const pct=(step/QS.length)*100;
  
  const valid=()=>{
    if(q.type==="name") return !!(ans.name?.trim());
    if(q.type==="number") return !!(ans[q.id]);
    if(q.type==="cards") {
      if(q.multi) return (ans[q.id]||[]).length >= (q.minSelect||1);
      return !!ans[q.id];
    }
    if(q.type==="bodytype") return !!ans[q.id];
    if(q.type==="measurements"){
      const s = ans.stats || {};
      return !!(s.weight && s.heightFt);
    }
    if(q.type==="sleep") return !!(ans.sleepGoal && ans.workHours);
    if(q.type==="yn") return ans[q.id] !== undefined;
    if(q.type==="days") return !!ans.days;
    if(q.type==="worktask") return true;
    return true;
  };

  const next=()=>{
    if(step<QS.length-1){setStep(s=>s+1);}
    else{
      onComplete(ans);
    }
  };

  const toggleDiet=(v: string)=>setAns((a: any)=>{
    let d=a.diet||["None"];
    if(v==="None") return {...a,diet:["None"]};
    d=d.filter((x: string)=>x!=="None");
    if(d.includes(v)) d=d.filter((x: string)=>x!==v); else d.push(v);
    if(d.length===0) d=["None"];
    return {...a,diet:d};
  });

  const updateStat = (key: string, val: string) => {
    setAns((a: any) => ({
      ...a,
      stats: {
        ...(a.stats || {}),
        [key]: val
      }
    }));
  };

  return(
    <div className="quiz-overlay">
      <div className="quiz-top">
        <div className="quiz-logo">BRUHH<span>H</span></div>
        <div className="qprog-wrap"><div className="qprog-fill" style={{width:pct+"%"}}/></div>
        <div className="qstep">{step+1}/{QS.length}</div>
      </div>
      <div className="quiz-body">
        <div className="qtag">{q.tag}</div>
        <div className="qtitle">{q.title.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div className="qsub">{q.sub}</div>
        {q.type==="cards"&&<div className={`qcards${q.cols===2?" g2":""}`}>
          {q.multi&&(()=>{const cnt=(ans[q.id]||[]).length;const met=cnt>=(q.minSelect||1);return(<div style={{fontSize:13,color:met?"var(--green)":"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{met?`✓ ${cnt} selected — continue`:`Select ${q.minSelect} minimum (${cnt} chosen)`}</div>);})()}
          {q.opts.map((o: any)=>{
            const isSelected = q.multi ? (ans[q.id]||[]).includes(o.v) : ans[q.id]===o.v;
            const handleClick = () => {
              if(q.multi) {
                setAns((a: any) => {
                  const cur = a[q.id]||[];
                  const next = cur.includes(o.v) ? cur.filter((x: string)=>x!==o.v) : [...cur, o.v];
                  return {...a,[q.id]:next};
                });
              } else {
                setAns((a: any)=>({...a,[q.id]:o.v}));
              }
            };
            return (
              <div key={o.v} className={`qcard${isSelected?" sel":""}`} onClick={handleClick} style={{flexDirection:"column",alignItems:"flex-start",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:14,width:"100%"}}>
                  <div className="qcard-icon">{o.icon}</div>
                  <div style={{flex:1}}><div className="qcard-label">{o.l}</div>{o.d&&<div className="qcard-desc">{o.d}</div>}</div>
                  <div className="qcard-chk">{isSelected?"✓":""}</div>
                </div>
                {o.compound&&isSelected&&(
                  <div style={{fontSize:16,color:"var(--muted)",lineHeight:1.5,borderTop:"1px solid var(--border)",paddingTop:8,width:"100%",fontStyle:"italic"}}>
                    💡 {o.compound}
                  </div>
                )}
              </div>
            );
          })}
        </div>}
        {/* NAME */}
        {q.type==="name"&&<div style={{marginBottom:24}}>
          <input type="text" placeholder="Your name..." autoFocus value={ans.name||""} onChange={e=>setAns((a:any)=>({...a,name:e.target.value}))} style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px",fontFamily:"Outfit,sans-serif",fontSize:28,fontWeight:800,color:"#fff",outline:"none",letterSpacing:-0.5}}/>
          {ans.name&&<div style={{fontSize:16,color:"var(--red)",fontWeight:700,marginTop:12}}>What's up, {ans.name}. Let's get into it. 💪</div>}
        </div>}

        {/* SINGLE NUMBER (target weight) */}
        {q.type==="number"&&<div style={{marginBottom:24}}>
          <div className="si-box" style={{padding:"24px 20px"}}>
            <div className="si-label">{q.unit}</div>
            <input type="number" placeholder={q.placeholder} inputMode="decimal" value={ans[q.id]||""} onChange={e=>setAns((a:any)=>({...a,[q.id]:e.target.value}))} style={{background:"none",border:"none",outline:"none",fontFamily:"Outfit,sans-serif",fontSize:56,fontWeight:800,color:"#fff",width:"100%",letterSpacing:-2}}/>
            <div className="si-unit" style={{fontSize:16}}>{q.unit}</div>
          </div>
          {ans[q.id]&&<div style={{fontSize:16,color:"var(--muted)",marginTop:12}}>Target locked: <strong style={{color:"var(--red)"}}>{ans[q.id]} lbs</strong>. We'll track your progress toward this every week.</div>}
        </div>}

        {/* MEASUREMENTS */}
        {q.type==="measurements"&&<div style={{marginBottom:24}}>
          <div className="stats-grid">
            {[{id:"age",l:"Age",ph:"28",u:"years"},{id:"weight",l:"Current Weight",ph:"175",u:"lbs"},{id:"heightFt",l:"Height (ft)",ph:"5",u:"feet"},{id:"heightIn",l:"Height (in)",ph:"10",u:"inches"},{id:"waist",l:"Waist",ph:"32",u:"inches"},{id:"chest",l:"Chest",ph:"40",u:"inches"},{id:"hips",l:"Hips",ph:"38",u:"inches"},{id:"arm",l:"Arm (dominant)",ph:"14",u:"inches"},{id:"neck",l:"Neck",ph:"15",u:"inches"}].map(f=>(
              <div key={f.id} className="si-box">
                <div className="si-label">{f.l}</div>
                <input type="number" placeholder={f.ph} inputMode="decimal" value={(ans.stats||{})[f.id]||""} onChange={e=>updateStat(f.id,e.target.value)}/>
                <div className="si-unit">{f.u}</div>
              </div>
            ))}
          </div>
          {(()=>{const s=suggestBodyType(ans.stats);return s?<div style={{marginTop:14,background:"var(--green-lt)",border:"1px solid var(--green)",borderRadius:"var(--radius)",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:24}}>{s==="ectomorph"?"🧍":s==="mesomorph"?"🏃":"🧱"}</div>
            <div><div style={{fontSize:13,color:"var(--green)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Auto-calculated</div><div style={{fontSize:16,color:"#fff",fontWeight:700}}>Looks like you're a {s.charAt(0).toUpperCase()+s.slice(1)}</div><div style={{fontSize:13,color:"var(--muted)"}}>Confirm on the next screen</div></div>
          </div>:null;})()}
        </div>}

        {/* SLEEP + 24H DISTRIBUTION */}
        {q.type==="sleep"&&(()=>{
          const sg=parseInt(ans.sleepGoal||"0");const wh=parseInt(ans.workHours||"0");
          const free=Math.max(0,24-sg-wh);const gym=sg>0&&wh>0?Math.min(3,Math.max(1,Math.round(free*0.4))):0;const rest=sg>0&&wh>0?Math.max(0,free-gym):0;
          return(<div style={{marginBottom:24}}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>🌙 Sleep Goal</div>
              <div style={{display:"flex",gap:8}}>
                {[6,7,8,9].map(h=>(<div key={h} onClick={()=>setAns((a:any)=>({...a,sleepGoal:String(h)}))} style={{flex:1,background:ans.sleepGoal===String(h)?"var(--red)":"var(--surface)",border:`1px solid ${ans.sleepGoal===String(h)?"var(--red)":"var(--border)"}`,borderRadius:"var(--radius)",padding:"14px 8px",textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}>
                  <div style={{fontFamily:"Outfit",fontSize:32,fontWeight:800,color:"#fff",lineHeight:1}}>{h}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>hrs</div>
                </div>))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>💼 Work Hours Per Day</div>
              <div className="si-box"><div className="si-label">Hours</div>
                <input type="number" placeholder="8" inputMode="decimal" value={ans.workHours||""} onChange={e=>setAns((a:any)=>({...a,workHours:e.target.value}))} style={{background:"none",border:"none",outline:"none",fontFamily:"Outfit",fontSize:40,fontWeight:800,color:"#fff",width:"100%",letterSpacing:-1}}/>
                <div className="si-unit">hours working per day</div>
              </div>
            </div>
            {sg>0&&wh>0&&<div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>⚡ Your 24-Hour Distribution</div>
              {[{label:"🌙 Sleep",hours:sg,color:"#4a6fa5"},{label:"💼 Work",hours:wh,color:"var(--muted)"},{label:"🏋️ Gym Window",hours:gym,color:"var(--red)",bold:true},{label:"🌿 Free / Rest",hours:rest,color:"var(--green)"}].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":undefined}}>
                  <span style={{fontSize:16,color:row.color,fontWeight:row.bold?800:600}}>{row.label}</span>
                  <span style={{fontFamily:"Outfit",fontSize:24,fontWeight:800,color:row.color}}>{row.hours}h</span>
                </div>
              ))}
              <div style={{marginTop:12,fontSize:16,color:"var(--green)",fontWeight:700}}>{gym>=2?"✓ Solid gym window — you can do real work.":"⚠️ Tight schedule. 1 hour max. We'll make it count."}</div>
            </div>}
          </div>);
        })()}

        {/* YES / NO */}
        {q.type==="yn"&&<div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
          {[{v:true,l:q.yLabel,icon:"✓",color:"var(--red)"},{v:false,l:q.nLabel,icon:"✗",color:"var(--green)"}].map(opt=>(
            <div key={String(opt.v)} onClick={()=>setAns((a:any)=>({...a,[q.id]:opt.v}))} style={{background:ans[q.id]===opt.v?"var(--surface2)":"var(--surface)",border:`2px solid ${ans[q.id]===opt.v?opt.color:"var(--border)"}`,borderRadius:"var(--radius)",padding:"22px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,transition:"all 0.2s"}}>
              <div style={{width:36,height:36,borderRadius:4,background:ans[q.id]===opt.v?opt.color:"var(--bg)",border:`2px solid ${ans[q.id]===opt.v?opt.color:"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:800,flexShrink:0}}>{ans[q.id]===opt.v?opt.icon:""}</div>
              <span style={{fontSize:18,fontWeight:700,color:ans[q.id]===opt.v?"#fff":"var(--muted)"}}>{opt.l}</span>
            </div>
          ))}
        </div>}

        {/* WORK TASK */}
        {q.type==="worktask"&&<div style={{marginBottom:24}}>
          <textarea placeholder="e.g. Finish the Q3 report, call the accountant, close that deal..." value={ans.weekTask||""} onChange={e=>setAns((a:any)=>({...a,weekTask:e.target.value}))} rows={4} style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"18px 20px",fontFamily:"Outfit,sans-serif",fontSize:18,fontWeight:600,color:"#fff",outline:"none",resize:"none",lineHeight:1.6}}/>
          <div style={{fontSize:13,color:"var(--muted)",marginTop:10}}>Optional — tap Continue to skip. We ask every Sunday.</div>
        </div>}
        {q.type==="days"&&<div className="days-row">
          {[3,4,5].map(d=>(
            <div key={d} className={`dpick${ans.days===d?" sel":""}`} onClick={()=>setAns((a: any)=>({...a,days:d}))}>
              <span className="dpick-num">{d}</span><div className="dpick-lbl">days/wk</div>
            </div>
          ))}
        </div>}
        {q.type==="bodytype"&&(()=>{const auto=suggestBodyType(ans.stats);return(<div style={{marginBottom:24}}>
          {auto&&<div style={{marginBottom:16,background:"var(--green-lt)",border:"1px solid var(--green)",borderRadius:"var(--radius)",padding:"12px 16px",fontSize:16,color:"var(--green)",fontWeight:700}}>
            📊 Based on your measurements, you look like a {auto.charAt(0).toUpperCase()+auto.slice(1)}. Confirm below or pick what feels right.
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {v:"ectomorph",emoji:"🧍",name:"Ectomorph",subtitle:"Naturally Lean",traits:["Fast metabolism","Hard to gain weight","Longer limbs, narrow frame"],cal:"Need +20% calories vs average",color:"#4a90d9",reality:"You can eat more than most without gaining fat — use it. But muscle won't come without a real caloric surplus and heavy compound lifts. Consistency matters more for you than anyone."},
            {v:"mesomorph",emoji:"🏃",name:"Mesomorph",subtitle:"Naturally Athletic",traits:["Natural muscle builder","Medium build, wide shoulders","Responds quickly to training"],cal:"Balanced macro approach",color:"#6b705c",reality:"You build muscle easier than most — but fat follows if you're not tracking. You have the best genetic starting point, but it can also make you lazy. Track everything. Balanced macros work best."},
            {v:"endomorph",emoji:"🧱",name:"Endomorph",subtitle:"Naturally Stocky",traits:["Slower metabolism","Gains fat more easily","Strong base, wide structure"],cal:"Need stricter calorie control",color:"#3e6451",reality:"Your metabolism is slower and calories matter more for you. The upside: you have natural strength and a solid base to build on. Stricter calorie control + higher protein + cardio will unlock your physique."},
          ].map(bt=>(
            <div key={bt.v} onClick={()=>setAns((a:any)=>({...a,[q.id]:bt.v}))} style={{background:ans[q.id]===bt.v?"var(--surface2)":"var(--surface)",border:`2px solid ${ans[q.id]===bt.v?bt.color:auto===bt.v?"#3a3a3a":"var(--border)"}`,borderRadius:"var(--radius)",padding:18,cursor:"pointer",transition:"all 0.2s",boxShadow:ans[q.id]===bt.v?`0 0 16px ${bt.color}30`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{fontSize:32}}>{bt.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:17,fontWeight:800,color:ans[q.id]===bt.v?bt.color:"#fff"}}>{bt.name}</div>
                    {auto===bt.v&&<span style={{fontSize:11,background:"var(--green)",color:"#fff",padding:"2px 7px",borderRadius:2,fontWeight:700}}>CALCULATED</span>}
                  </div>
                  <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,marginTop:2}}>{bt.subtitle}</div>
                </div>
                <div style={{width:22,height:22,borderRadius:2,border:`2px solid ${ans[q.id]===bt.v?bt.color:"var(--muted)"}`,background:ans[q.id]===bt.v?bt.color:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:800}}>{ans[q.id]===bt.v?"✓":""}</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {bt.traits.map((t: string,i: number)=><span key={i} style={{fontSize:13,fontWeight:600,padding:"4px 10px",background:"var(--bg)",borderRadius:2,color:"var(--muted)",border:"1px solid var(--border)"}}>{t}</span>)}
              </div>
              <div style={{fontSize:13,color:bt.color,fontWeight:700,marginBottom:8}}>📊 {bt.cal}</div>
              {ans[q.id]===bt.v&&<div style={{fontSize:16,color:"var(--muted)",lineHeight:1.6,borderTop:"1px solid var(--border)",paddingTop:10,marginTop:2}}>{bt.reality}</div>}
            </div>
          ))}
          </div></div>);})()}
        {q.type==="diet"&&<div className="diet-tags">
          {["None","Vegetarian","Vegan","Dairy-Free","Gluten-Free","Low Carb","Halal","Kosher"].map(t=>(
            <div key={t} className={`dtag${(ans.diet||["None"]).includes(t)?" sel":""}`} onClick={()=>toggleDiet(t)}>{t}</div>
          ))}
        </div>}
        <div style={{height:80}}/>
      </div>
      <div className="quiz-footer">
        {step > 0 ? (
          <div className="quiz-footer-row">
            <button className="btn-qback" onClick={()=>setStep(s=>s-1)}>← Back</button>
            <button className="btn-qnext" onClick={next} disabled={!valid()}>{step===QS.length-1?"Build My Plan":"Continue"}</button>
          </div>
        ) : (
          <button className="btn-qnext" onClick={next} disabled={!valid()}>Continue</button>
        )}
      </div>
    </div>
  );
}

const NAV=[{id:"home",icon:<LayoutDashboard size={20} color="#DDA15E" />,lbl:"Home"},{id:"meals",icon:<Utensils size={20} color="#606C38" />,lbl:"Meals"},{id:"train",icon:<Dumbbell size={20} color="#BC6C25" />,lbl:"Train"},{id:"track",icon:<BarChart2 size={20} color="#DDA15E" />,lbl:"Track"},{id:"body",icon:<Scale size={20} color="#FEFAE0" />,lbl:"Body"},{id:"german",icon:<MoreHorizontal size={20} color="#606C38" />,lbl:"Deutsch"},{id:"more",icon:<MoreHorizontal size={20} color="#BC6C25" />,lbl:"More"}];

// ─── MEDAL SYSTEM ─────────────────────────────────────────────────────────────
const MEDAL_DEFS = [
  { week: 1,  name: "Iron Start",      color: "#8a9a7a", glow: "#8a9a7a", shape: "hex",    emoji: "🔩" },
  { week: 2,  name: "Steel Grind",     color: "#a0a8b0", glow: "#a0b4c8", shape: "shield", emoji: "⚙️" },
  { week: 3,  name: "Bronze Edge",     color: "#cd7f32", glow: "#e8a060", shape: "star",   emoji: "🥉" },
  { week: 4,  name: "Copper Lock",     color: "#b87333", glow: "#d4904a", shape: "diamond",emoji: "🔶" },
  { week: 5,  name: "Silver Forge",    color: "#c0c0c0", glow: "#e0e8f0", shape: "hex",    emoji: "🥈" },
  { week: 6,  name: "Gold Struck",     color: "#ffd700", glow: "#ffe860", shape: "shield", emoji: "🥇" },
  { week: 7,  name: "Platinum Vault",  color: "#e5e4e2", glow: "#f0f4ff", shape: "star",   emoji: "💎" },
  { week: 8,  name: "Obsidian Peak",   color: "#4a4a5a", glow: "#8060ff", shape: "diamond",emoji: "🖤" },
  { week: 9,  name: "Crimson Legion",  color: "#d95436", glow: "#ff7050", shape: "hex",    emoji: "🔴" },
  { week: 10, name: "Titan Seal",      color: "#dda15e", glow: "#ffcc80", shape: "shield", emoji: "👑" },
  { week: 11, name: "Emerald Oath",    color: "#50c878", glow: "#80ff9a", shape: "star",   emoji: "💚" },
  { week: 12, name: "IRON LEGEND",     color: "#ff6b35", glow: "#ffaa00", shape: "diamond",emoji: "🏆" },
];

function MedalShape({ def, size=56, earned=false }: { def:any, size?:number, earned?:boolean }) {
  const s = size;
  const c = earned ? def.color : "#2a2a2a";
  const gc = earned ? def.glow : "#333";
  const id = `g${def.week}`;
  if (def.shape === "hex") {
    const pts = Array.from({length:6},(_,i)=>{const a=Math.PI/180*(60*i-30);return `${s/2+s/2*0.85*Math.cos(a)},${s/2+s/2*0.85*Math.sin(a)}`;}).join(" ");
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{filter:earned?`drop-shadow(0 0 8px ${gc})`:undefined}}>
        <defs><radialGradient id={id}><stop offset="0%" stopColor={earned?"#fff":c} stopOpacity={earned?0.3:0.05}/><stop offset="100%" stopColor={c}/></radialGradient></defs>
        <polygon points={pts} fill={`url(#${id})`} stroke={c} strokeWidth={earned?2:1}/>
        {earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.32} fill="#fff" fontFamily="Outfit">{def.emoji}</text>}
        {!earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.22} fill="#444" fontFamily="Outfit">W{def.week}</text>}
      </svg>
    );
  }
  if (def.shape === "shield") {
    const d = `M${s/2},${s*0.08} L${s*0.88},${s*0.3} L${s*0.88},${s*0.62} Q${s/2},${s*0.95} ${s/2},${s*0.95} Q${s*0.12},${s*0.95} ${s*0.12},${s*0.62} L${s*0.12},${s*0.3} Z`;
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{filter:earned?`drop-shadow(0 0 8px ${gc})`:undefined}}>
        <defs><linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={earned?"#fff":c} stopOpacity={earned?0.25:0.05}/><stop offset="100%" stopColor={c}/></linearGradient></defs>
        <path d={d} fill={`url(#${id})`} stroke={c} strokeWidth={earned?2:1}/>
        {earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.32} fill="#fff" fontFamily="Outfit">{def.emoji}</text>}
        {!earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.22} fill="#444" fontFamily="Outfit">W{def.week}</text>}
      </svg>
    );
  }
  if (def.shape === "star") {
    const pts = Array.from({length:10},(_,i)=>{const r=i%2===0?s/2*0.85:s/2*0.4;const a=Math.PI/5*i-Math.PI/2;return `${s/2+r*Math.cos(a)},${s/2+r*Math.sin(a)}`;}).join(" ");
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{filter:earned?`drop-shadow(0 0 8px ${gc})`:undefined}}>
        <defs><radialGradient id={id}><stop offset="0%" stopColor={earned?"#fff":c} stopOpacity={earned?0.3:0.05}/><stop offset="100%" stopColor={c}/></radialGradient></defs>
        <polygon points={pts} fill={`url(#${id})`} stroke={c} strokeWidth={earned?2:1}/>
        {earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.26} fill="#fff" fontFamily="Outfit">{def.emoji}</text>}
        {!earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.22} fill="#444" fontFamily="Outfit">W{def.week}</text>}
      </svg>
    );
  }
  // diamond
  const pts2 = `${s/2},${s*0.05} ${s*0.95},${s/2} ${s/2},${s*0.95} ${s*0.05},${s/2}`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{filter:earned?`drop-shadow(0 0 8px ${gc})`:undefined}}>
      <defs><linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={earned?"#fff":c} stopOpacity={earned?0.3:0.05}/><stop offset="100%" stopColor={c}/></linearGradient></defs>
      <polygon points={pts2} fill={`url(#${id})`} stroke={c} strokeWidth={earned?2:1}/>
      {earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.3} fill="#fff" fontFamily="Outfit">{def.emoji}</text>}
      {!earned&&<text x={s/2} y={s/2+5} textAnchor="middle" fontSize={s*0.22} fill="#444" fontFamily="Outfit">W{def.week}</text>}
    </svg>
  );
}

// ─── MINI CHARTS ──────────────────────────────────────────────────────────────
function RingChart({ pct, color, size=80, label, value }: any) {
  const r = (size-12)/2, cx = size/2, cy = size/2;
  const circ = 2*Math.PI*r;
  const filled = circ * Math.min(1, pct/100);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#222" strokeWidth={8}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${filled} ${circ}`} strokeDashoffset={circ*0.25}
          strokeLinecap="round" style={{filter:`drop-shadow(0 0 4px ${color}80)`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:size>70?13:10,fontWeight:800,color,lineHeight:1}}>{value}</div>
        <div style={{fontSize:8,color:"#666",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
      </div>
    </div>
  );
}

function BarSparkline({ data, color, height=40, width=120 }: any) {
  const max = Math.max(...data, 1);
  const bw = width / data.length;
  return (
    <svg width={width} height={height}>
      {data.map((v:number,i:number) => {
        const bh = (v/max)*height*0.85;
        return <rect key={i} x={i*bw+1} y={height-bh} width={bw-3} height={bh}
          fill={color} rx={2} opacity={i===data.length-1?1:0.4+0.3*(i/data.length)}/>;
      })}
    </svg>
  );
}

function LineSparkline({ data, color, height=44, width=130 }: any) {
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v:number,i:number) => {
    const x = (i/(data.length-1))*width;
    const y = height - ((v-min)/range)*(height*0.8) - height*0.1;
    return `${x},${y}`;
  }).join(" ");
  const area = `M${pts.split(" ").map((p,i,arr)=>i===0?`${p} L`:p+" L").join("")}${width},${height} L0,${height} Z`.replace(/ L$/, "");
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={`lg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`M${pts.split(" ").join(" L")}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <path d={`M${pts.split(" ")[0]} L${pts.split(" ").join(" L")} L${width},${height} L0,${height} Z`}
        fill={`url(#lg${color.replace("#","")})`}/>
    </svg>
  );
}

function RadialDots({ count, total=7, color, size=56 }: any) {
  const cx = size/2, cy = size/2, r = size/2 - 7;
  return (
    <svg width={size} height={size}>
      {Array.from({length:total},(_,i) => {
        const a = (2*Math.PI/total)*i - Math.PI/2;
        const x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
        const filled = i < count;
        return <circle key={i} cx={x} cy={y} r={4} fill={filled?color:"#222"}
          stroke={filled?color:"#333"} strokeWidth={1}
          style={{filter:filled?`drop-shadow(0 0 3px ${color})`:undefined}}/>;
      })}
      <text x={cx} y={cy+4} textAnchor="middle" fill={color} fontSize={13} fontWeight={800} fontFamily="Outfit">{count}</text>
      <text x={cx} y={cy+15} textAnchor="middle" fill="#555" fontSize={7} fontFamily="Outfit" textDecoration="uppercase" letterSpacing={0.5}>/{total}</text>
    </svg>
  );
}

function StatNumber({value, label, sub, color, icon}: any) {
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
      <div style={{fontSize:22,lineHeight:1,flexShrink:0,marginTop:2}}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:4}}>{label}</div>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:color||"#fff",letterSpacing:-0.5,lineHeight:1}}>{value}</div>
        {sub&&<div style={{fontSize:10,color:"var(--muted)",marginTop:3,fontWeight:500}}>{sub}</div>}
      </div>
    </div>
  );
}

function HeatRow({days, values, color, max}: {days:string[], values:number[], color:string, max:number}) {
  return (
    <div style={{display:"flex",gap:3}}>
      {days.map((d,i)=>{
        const pct = max > 0 ? Math.min(1, values[i]/max) : 0;
        return (
          <div key={d} style={{flex:1,textAlign:"center"}}>
            <div style={{height:24,background:pct>0?color:"#1a1a1a",borderRadius:2,opacity:0.2+pct*0.8,border:`1px solid ${pct>0?color:"#2a2a2a"}`}}/>
            <div style={{fontSize:8,color:"#444",marginTop:2,fontWeight:700}}>{d[0]}</div>
          </div>
        );
      })}
    </div>
  );
}

function Home({up,weekNum,weeklyData,setTab,foodLog}: any) {
  const [showMedals, setShowMedals] = useState(false);
  const goal = up?.goal||"cut";
  const bodyType = up?.bodyType||"mesomorph";
  const btMult = getBodyTypeMultiplier(bodyType, goal);
  const tdee = calcTDEE(up?.stats, up?.activity, up?.sex);
  const engine = runEngine(up, weeklyData, weekNum);
  const base = BASE_PLANS[goal];
  const gc = GOAL_COLORS[goal]||"#3e6451";
  const baseCal = Math.round(base.calories*btMult);
  const adjCal = engine ? baseCal+engine.calAdj : baseCal;
  const adjProt = engine ? Math.round(base.protein*btMult)+engine.protAdj : Math.round(base.protein*btMult);

  // ── DATA AGGREGATION ───────────────────────────────────────────────────
  // Weight history across all weeks
  const weightHistory: number[] = [];
  for(let w=1;w<=4;w++){
    const wl = weeklyData[w]?.weightLog||{};
    Object.values(wl).forEach((e:any)=>{ if(e?.am) weightHistory.push(parseFloat(e.am)); });
  }
  const latestWeight = weightHistory.length ? weightHistory[weightHistory.length-1] : parseFloat(up?.stats?.weight||175);
  const weightChange = weightHistory.length > 1 ? (weightHistory[weightHistory.length-1]-weightHistory[0]) : null;

  // This week weight
  const thisWkWeights = DAYS.map(d=>{
    const e = weeklyData[weekNum]?.weightLog?.[d];
    return e?.am ? parseFloat(e.am) : 0;
  });
  const thisWkAvgWeight = thisWkWeights.filter(Boolean).length > 0
    ? (thisWkWeights.filter(Boolean).reduce((a,b)=>a+b,0)/thisWkWeights.filter(Boolean).length).toFixed(1)
    : latestWeight.toFixed(1);

  // Behaviors aggregated
  const allBeh: Record<string,number> = {};
  for(let w=1;w<=4;w++){
    const b = weeklyData[w]?.behaviors||{};
    Object.entries(b).forEach(([k,v])=>{ allBeh[k]=(allBeh[k]||0)+(v as number||0); });
  }
  const thisBeh = weeklyData[weekNum]?.behaviors||{};
  const totalBadAllTime = Object.values(allBeh).reduce((a:any,b)=>a+(b||0),0) as number;
  const behScore = Math.max(0, 100-Object.values(thisBeh).reduce((a:any,b:any)=>a+(b||0),0)*10);

  // Steps
  const thisWkSteps = DAYS.map(d => parseFloat(weeklyData[weekNum]?.stepsLog?.[d]||"0"));
  const avgSteps = thisWkSteps.filter(Boolean).length > 0
    ? Math.round(thisWkSteps.filter(Boolean).reduce((a,b)=>a+b,0)/thisWkSteps.filter(Boolean).length)
    : 0;
  const totalSteps = thisWkSteps.reduce((a,b)=>a+b,0);

  // Food log stats
  const mealsLogged = foodLog?.length || 0;
  const avgCal = mealsLogged > 0 ? Math.round(foodLog.reduce((a:any,e:any)=>a+e.cal,0)/Math.max(1,Math.ceil(mealsLogged/3))) : 0;
  const avgProt = mealsLogged > 0 ? Math.round(foodLog.reduce((a:any,e:any)=>a+e.protein,0)/Math.max(1,Math.ceil(mealsLogged/3))) : 0;
  const calPct = adjCal > 0 ? Math.round((avgCal/adjCal)*100) : 0;

  // Sex log
  const totalSexAllTime = Object.values(weeklyData).reduce((a:any,wd:any)=>a+(Object.values(wd?.sexLog||{}).filter(Boolean).length),0) as number;
  const thisSex = Object.values(weeklyData[weekNum]?.sexLog||{}).filter(Boolean).length;
  const sexByDay = DAYS.map(d => weeklyData[weekNum]?.sexLog?.[d] ? 1 : 0);

  // Body comp
  const latestWd = weeklyData[weekNum]||weeklyData[Math.max(1,weekNum-1)]||{};
  const bodyFat = parseFloat(latestWd.bodyComp?.bodyFat||"0");
  const waist = parseFloat(latestWd.measurements?.waist||"0");
  const chest = parseFloat(latestWd.measurements?.chest||"0");

  // Medals
  function getWeekScore(w: number) {
    const wd = weeklyData[w];
    if(!wd) return 0;
    const wl = wd.weightLog||{};
    const logged = Object.values(wl).filter((e:any)=>e?.am).length;
    const beh = Object.values(wd.behaviors||{}).reduce((a:any,b:any)=>a+(b||0),0);
    return logged >= 4 && (beh as number) < 5 ? 1 : 0;
  }
  const earnedMedals: number[] = [];
  for(let w=1;w<=weekNum;w++) { if(getWeekScore(w)) earnedMedals.push(w); }
  const totalMedals = earnedMedals.length;
  const latestMedalDef = earnedMedals.length ? MEDAL_DEFS[earnedMedals[earnedMedals.length-1]-1] : null;
  const nextMedalDef = MEDAL_DEFS[Math.min(weekNum, 11)];

  // German
  const germanDone = Object.values(weeklyData[weekNum]?.germanLog||{}).filter((d:any)=>d?.done).length;

  // Workout days done this week (exercises checked)
  const workoutsThisWeek = up?.days||4;

  return (
    <div className="page" style={{paddingTop:16}}>

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>Week {weekNum} · {bodyType}</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#fff",letterSpacing:-1,lineHeight:1}}>{GOAL_LABELS[goal]}</div>
          <div style={{fontSize:16,color:gc,fontWeight:600,marginTop:3}}>{tdee} TDEE · target {adjCal} cal/day</div>
        </div>
        <div onClick={()=>setShowMedals(s=>!s)} style={{cursor:"pointer",textAlign:"center"}}>
          {latestMedalDef ? <MedalShape def={latestMedalDef} size={52} earned={true}/> : <MedalShape def={MEDAL_DEFS[0]} size={52} earned={false}/>}
          <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,marginTop:3,textTransform:"uppercase"}}>{totalMedals} medals</div>
        </div>
      </div>

      {/* MEDALS PANEL */}
      {showMedals && (
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,color:"#fff",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>🏅 Medal Series</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {MEDAL_DEFS.map((m) => {
              const earned = earnedMedals.includes(m.week);
              return (
                <div key={m.week} style={{textAlign:"center"}}>
                  <MedalShape def={m} size={50} earned={earned}/>
                  <div style={{fontSize:8,fontWeight:700,color:earned?m.color:"#333",marginTop:3,textTransform:"uppercase",lineHeight:1.2}}>{m.name}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,fontSize:11,color:"var(--muted)",textAlign:"center"}}>{totalMedals}/12 unlocked</div>
        </div>
      )}

      {/* ── MEALS CARD ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("meals")}>🍽️ Meals <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ view plan</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}} onClick={()=>setTab("meals")}>
        {/* Calorie ring + protein ring side by side */}
        <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:14}}>
          <RingChart pct={Math.min(100,calPct||68)} color={gc} size={80} label="cal" value={avgCal||adjCal}/>
          <RingChart pct={Math.min(100,adjProt>0?Math.round((avgProt/adjProt)*100):65)} color="#4a90d9" size={80} label="prot" value={(avgProt||adjProt)+"g"}/>
          <div style={{flex:1}}>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:10,color:"var(--muted)",fontWeight:600}}>Calories</span>
                <span style={{fontSize:10,fontWeight:800,color:gc}}>{avgCal||adjCal} / {adjCal}</span>
              </div>
              <div style={{height:4,background:"#222",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(100,calPct||68)}%`,background:gc,borderRadius:2}}/>
              </div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:10,color:"var(--muted)",fontWeight:600}}>Protein</span>
                <span style={{fontSize:10,fontWeight:800,color:"#4a90d9"}}>{avgProt||adjProt}g / {adjProt}g</span>
              </div>
              <div style={{height:4,background:"#222",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(100,adjProt>0?Math.round((avgProt/adjProt)*100):65)}%`,background:"#4a90d9",borderRadius:2}}/>
              </div>
            </div>
          </div>
        </div>
        {/* Meals count + quick stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {label:"Meals Logged",val:mealsLogged,color:"var(--green)"},
            {label:"Avg Cal",val:avgCal||"—",color:gc},
            {label:"Avg Protein",val:(avgProt||"—")+(avgProt?"g":""),color:"#4a90d9"},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center",background:"var(--bg)",borderRadius:"var(--radius-sm)",padding:"10px 6px"}}>
              <div style={{fontSize:22,fontWeight:800,color:s.color,letterSpacing:-0.5}}>{s.val}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WORKOUT + STEPS CARD ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("train")}>💪 Workout & Steps <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ view split</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}} onClick={()=>setTab("train")}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Workouts/Week</div>
            <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"var(--red)",letterSpacing:-1,lineHeight:1}}>{workoutsThisWeek}<span style={{fontSize:16,color:"var(--muted)",fontWeight:500}}> days</span></div>
            <div style={{fontSize:16,color:"var(--muted)",marginTop:3}}>{goal==="cut"?"+ cardio days":"heavy compound focus"}</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Avg Steps</div>
            <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"var(--yellow)",letterSpacing:-1,lineHeight:1}}>{avgSteps>0?avgSteps.toLocaleString():"—"}</div>
            <div style={{fontSize:16,color:avgSteps>=10000?"var(--green)":"var(--muted)",fontWeight:avgSteps>=10000?700:400,marginTop:3}}>{avgSteps>=10000?"✓ 10k goal met":avgSteps>0?`${(10000-avgSteps).toLocaleString()} to goal`:"log steps in Track"}</div>
          </div>
        </div>
        {/* Steps bar chart */}
        <div style={{marginBottom:6}}>
          <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Daily Steps This Week</div>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:44}}>
            {DAYS.map((d,i)=>{
              const s = thisWkSteps[i];
              const pct = Math.min(1, s/12000);
              return (
                <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:"100%",borderRadius:"2px 2px 0 0",background:s>=10000?"var(--green)":s>5000?"var(--yellow)":s>0?"var(--red)":"#1a1a1a",height:`${Math.max(3,pct*40)}px`,transition:"height 0.3s"}}/>
                  <div style={{fontSize:8,color:"#444",fontWeight:700}}>{d[0]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--muted)",textAlign:"right"}}>Total this week: <strong style={{color:"var(--yellow)"}}>{totalSteps.toLocaleString()}</strong> steps</div>
      </div>

      {/* ── WEIGHT TREND ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("track")}>⚖️ Daily Weight <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ log</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}} onClick={()=>setTab("track")}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{fontFamily:"Outfit",fontSize:56,fontWeight:800,color:"var(--yellow)",letterSpacing:-2,lineHeight:1}}>{parseFloat(thisWkAvgWeight).toFixed(1)}</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>avg this week (lbs)</div>
          </div>
          {weightChange !== null && (
            <div style={{marginTop:6}}>
              <div style={{fontFamily:"Outfit",fontSize:22,fontWeight:800,color:weightChange<0?"var(--green)":"var(--red)",letterSpacing:-0.5}}>{weightChange>0?"+":""}{weightChange.toFixed(1)}</div>
              <div style={{fontSize:13,color:"var(--muted)"}}>total change</div>
              <div style={{fontSize:16,color:goal==="cut"&&weightChange<0?"var(--green)":goal==="bulk"&&weightChange>0?"var(--green)":"var(--muted)",fontWeight:600,marginTop:2}}>{goal==="cut"&&weightChange<0?"On track 🎯":goal==="bulk"&&weightChange>0?"Growing 💪":goal==="cut"&&weightChange>0?"Recalibrate ⚠️":"—"}</div>
            </div>
          )}
        </div>
        <BarSparkline data={thisWkWeights.map((w,i)=>w||latestWeight-1)} color="var(--yellow)" width={280} height={42}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginTop:4}}>
          {DAYS.map(d=><div key={d} style={{fontSize:8,color:"#444",textAlign:"center",fontWeight:700}}>{d[0]}</div>)}
        </div>
      </div>

      {/* ── BAD BEHAVIORS (all as stat numbers) ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("track")}>⚠️ Behaviors This Week <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ track</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}}>
        {/* Behavior score prominent */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14,paddingBottom:14,borderBottom:"1px solid var(--border)"}}>
          <div style={{position:"relative",width:64,height:64,flexShrink:0}}>
            <svg width={64} height={64}>
              <circle cx={32} cy={32} r={26} fill="none" stroke="#222" strokeWidth={7}/>
              <circle cx={32} cy={32} r={26} fill="none" stroke={behScore>=80?"var(--green)":behScore>=50?"var(--yellow)":"var(--red)"} strokeWidth={7}
                strokeDasharray={`${(behScore/100)*163} 163`} strokeDashoffset={40} strokeLinecap="round"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
              <div style={{fontSize:16,fontWeight:800,color:behScore>=80?"var(--green)":behScore>=50?"var(--yellow)":"var(--red)"}}>{behScore}</div>
            </div>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>Discipline Score</div>
            <div style={{fontSize:16,color:"var(--muted)"}}>{behScore>=80?"Clean week 🔥":behScore>=50?"Some slips — keep it tight":"High impact behaviors ⚠️"}</div>
          </div>
        </div>
        {/* Individual behaviors */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {key:"Alcohol",icon:"🍺",color:"#DDA15E"},
            {key:"Smoking",icon:"🚬",color:"#BC6C25"},
            {key:"Poor Sleep",icon:"😴",color:"#606C38"},
            {key:"Missed Meals",icon:"🍽️",color:"#DDA15E"},
            {key:"Junk Food",icon:"🍕",color:"#BC6C25"},
            {key:"Drugs",icon:"💊",color:"#8a2be2"},
          ].map(b=>{
            const count = thisBeh[b.key]||0;
            return (
              <div key={b.key} style={{background:"var(--bg)",borderRadius:"var(--radius-sm)",padding:"10px 8px",textAlign:"center",border:`1px solid ${count>0?b.color+"60":"var(--border)"}`,transition:"border 0.2s"}}>
                <div style={{fontSize:20,marginBottom:4}}>{b.icon}</div>
                <div style={{fontFamily:"Outfit",fontSize:28,fontWeight:800,color:count>0?b.color:"#333",letterSpacing:-0.5}}>{count}</div>
                <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginTop:2,lineHeight:1.2}}>{b.key}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SEXUAL ACTIVITY ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("track")}>❤️ Sexual Activity <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ log</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}} onClick={()=>setTab("track")}>
        <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"#e0507a",letterSpacing:-2,lineHeight:1}}>{thisSex}</div>
          <div>
            <div style={{fontSize:16,color:"var(--muted)"}}>times this week</div>
            <div style={{fontSize:16,color:"#e0507a",fontWeight:700}}>{totalSexAllTime} all-time logged</div>
          </div>
        </div>
        <HeatRow days={DAYS} values={sexByDay} color="#e0507a" max={1}/>
      </div>

      {/* ── BODY COMPOSITION ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("body")}>🧬 Body Composition <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ track</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div style={{background:"var(--bg)",borderRadius:"var(--radius-sm)",padding:"14px"}}>
            <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Body Fat %</div>
            <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:bodyFat>0?(bodyFat<20?"var(--green)":bodyFat<30?"var(--yellow)":"var(--red)"):"#333",letterSpacing:-2,lineHeight:1}}>{bodyFat>0?bodyFat+"%":"—"}</div>
            {bodyFat>0&&<div style={{fontSize:16,color:"var(--muted)",marginTop:2}}>{bodyFat<10?"Essential":bodyFat<20?"Athletic":bodyFat<25?"Fitness":bodyFat<30?"Average":"High"}</div>}
            {bodyFat>0&&<div style={{height:4,background:"#222",borderRadius:2,marginTop:6,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,bodyFat*3)}%`,background:bodyFat<20?"var(--green)":bodyFat<30?"var(--yellow)":"var(--red)",borderRadius:2}}/>
            </div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {label:"Chest",val:chest,unit:"in",color:"#4a90d9"},
              {label:"Waist",val:waist,unit:"in",color:"var(--red)"},
            ].map(m=>(
              <div key={m.label} style={{background:"var(--bg)",borderRadius:"var(--radius-sm)",padding:"10px 12px"}}>
                <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{m.label}</div>
                <div style={{fontFamily:"Outfit",fontSize:20,fontWeight:800,color:m.val>0?m.color:"#333",letterSpacing:-0.5}}>{m.val>0?m.val+'"':"—"}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Measurement heatmap / comparison row */}
        <div style={{fontSize:16,color:"var(--muted)",textAlign:"center"}}>→ Log measurements in Body tab</div>
      </div>

      {/* ── DEUTSCH ── */}
      <div className="slabel" style={{cursor:"pointer"}} onClick={()=>setTab("german")}>🇩🇪 Deutsch Progress <span style={{fontSize:9,color:"var(--muted)",fontWeight:400,float:"right",textTransform:"none"}}>→ practice</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14}} onClick={()=>setTab("german")}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"var(--green)",letterSpacing:-2,lineHeight:1}}>{germanDone}</div>
          <div>
            <div style={{fontSize:16,color:"#fff",fontWeight:700}}>days done this week</div>
            <div style={{fontSize:16,color:germanDone>=7?"var(--green)":"var(--muted)"}}>Goal: 7/7 · 20 min/day</div>
            <div style={{fontSize:16,color:"var(--green)",fontWeight:700,marginTop:3}}>{germanDone>=7?"🔥 Perfekte Woche!":germanDone>=5?"💪 Sehr gut!":germanDone>=3?"📈 Gut gemacht!":"🎯 Mach weiter!"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {DAYS.map(d=>{
            const done=weeklyData[weekNum]?.germanLog?.[d]?.done;
            return(
              <div key={d} style={{flex:1,height:28,borderRadius:"var(--radius-sm)",background:done?"var(--green)":"#1a1a1a",border:`1px solid ${done?"var(--green)":"#2a2a2a"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{done?"✓":""}</div>
            );
          })}
        </div>
      </div>

      {/* NEXT MEDAL BANNER */}
      <div style={{background:`linear-gradient(135deg, #1a1208 0%, #0e0e0e 100%)`,border:`1px solid ${nextMedalDef.color}40`,borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
        <MedalShape def={nextMedalDef} size={44} earned={false}/>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:2}}>Next Up — Week {weekNum+1}</div>
          <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{nextMedalDef.name}</div>
          <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Log 4+ weights & keep habits under control</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:800,color:nextMedalDef.color}}>{earnedMedals.length}</div>
          <div style={{fontSize:8,color:"var(--muted)",fontWeight:700,textTransform:"uppercase"}}>earned</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="slabel">Quick Actions</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[
          {icon:<Utensils size={18}/>,label:"Meal Plan",tab:"meals",color:"var(--green)"},
          {icon:<Dumbbell size={18}/>,label:"Workout",tab:"train",color:"var(--red)"},
          {icon:<BarChart2 size={18}/>,label:"Log Weight",tab:"track",color:"var(--yellow)"},
          {icon:<Scale size={18}/>,label:"Body Comp",tab:"body",color:"#4a90d9"},
        ].map(a=>(
          <div key={a.tab} onClick={()=>setTab(a.tab)} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:a.color}}>{a.icon}</span>
            <span style={{fontSize:12,fontWeight:700,color:a.color}}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MEAL PLAN DATA ───────────────────────────────────────────────────────────

// ─── WEEKLY RECIPE ROTATION ──────────────────────────────────────────────────
// Each week a different 5-ingredient recipe. Simple, repeatable, goal-aligned.
const WEEKLY_RECIPES: Record<string, any[]> = {
  cut: [
    {
      week: 1,
      name: "Turkey Cottage Cheese Pasta",
      tag: "🍝 High Protein · 37g/serving",
      time: "30 min",
      servings: 5,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=ground+turkey+cottage+cheese+pasta+high+protein+meal+prep",
      why: "Cottage cheese blends into a creamy sauce — you'd never guess it's that clean. 37g protein per container, freezes perfectly.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"1 lb (454g)", weight:"454g total", emoji:"🦃"},
        {item:"Barilla Protein+ pasta", amount:"8 oz (227g)", weight:"227g dry", emoji:"🍝"},
        {item:"Low-fat cottage cheese", amount:"1 cup (225g)", weight:"225g", emoji:"🧀"},
        {item:"Marinara sauce (low sugar)", amount:"1 jar (680g)", weight:"680g", emoji:"🍅"},
        {item:"Frozen spinach or mushrooms", amount:"2 cups (140g)", weight:"140g", emoji:"🥬"},
      ],
      steps: [
        "Cook pasta 1-2 min LESS than box says (it keeps cooking). Drain, set aside.",
        "In a large skillet, brown the turkey over medium-high. Break it up small. Drain fat.",
        "Add spinach/mushrooms, cook 2 min until soft.",
        "Pour in marinara. Stir. Let simmer 3 min.",
        "BLEND cottage cheese until smooth (30 sec in blender or use immersion blender). Stir into the pan OFF the heat.",
        "Toss in cooked pasta. Mix. Divide into 5 containers.",
      ],
      macrosPerServing: {cal: 370, protein: 37, carbs: 36, fat: 7},
      scaleTip: "Weigh your turkey RAW (454g total ÷ 5 = 91g raw per serving). After cooking it shrinks — so always weigh before cooking.",
      prepNote: "Makes 5 servings. Eat 1-2 per day. Good in fridge 4-5 days.",
      budget: "$14",
    },
    {
      week: 2,
      name: "One-Pan Egg Roll in a Bowl",
      tag: "🥢 Low Carb · 10 min cook",
      time: "15 min",
      servings: 4,
      difficulty: "Super Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=egg+roll+in+a+bowl+high+protein+meal+prep+ground+turkey",
      why: "One pan. 10 minutes of actual cooking. High volume, low calorie. You'll feel full on 350 cal.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"1 lb (454g)", weight:"454g total", emoji:"🦃"},
        {item:"Coleslaw mix (bagged)", amount:"1 bag (14oz / 397g)", weight:"397g", emoji:"🥗"},
        {item:"Soy sauce (low sodium)", amount:"3 tbsp (45ml)", weight:"45g", emoji:"🫙"},
        {item:"Sesame oil", amount:"1 tsp (4g)", weight:"4g", emoji:"🫒"},
        {item:"Garlic powder + ginger powder", amount:"1 tsp each", weight:"season to taste", emoji:"🧄"},
      ],
      steps: [
        "Heat a large skillet or wok over medium-high heat.",
        "Brown turkey, breaking it up. Takes 5-6 min. Drain any fat.",
        "Add the entire bag of coleslaw mix directly in. Stir it all together.",
        "Pour soy sauce + sesame oil over everything. Sprinkle garlic + ginger powder.",
        "Stir fry 3-4 min until cabbage softens but still has crunch.",
        "Divide into 4 containers. Add sriracha on top if you want heat.",
      ],
      macrosPerServing: {cal: 245, protein: 34, carbs: 8, fat: 9},
      scaleTip: "This is portion-controlled by weight. Divide the final cooked batch by 4. Use your scale to ensure each container is equal.",
      prepNote: "4 servings. Add rice to 1-2 containers for bulk days. Ready in under 15 min.",
      budget: "$11",
    },
    {
      week: 3,
      name: "Sheet Pan Chicken & Broccoli",
      tag: "🍗 Classic · Zero dishes",
      time: "35 min",
      servings: 5,
      difficulty: "Easiest",
      youtubeSearch: "https://www.youtube.com/results?search_query=sheet+pan+chicken+breast+broccoli+meal+prep+high+protein",
      why: "Literally one pan in the oven. Season it, walk away for 22 min. This is the one you make when you have zero energy.",
      ingredients: [
        {item:"Chicken breast", amount:"2 lbs (907g)", weight:"907g total", emoji:"🍗"},
        {item:"Frozen broccoli florets", amount:"2 bags (32oz each)", weight:"907g total", emoji:"🥦"},
        {item:"Olive oil spray", amount:"spray can", weight:"~5g per use", emoji:"🫒"},
        {item:"Garlic powder + paprika + salt", amount:"1 tsp each", weight:"season to taste", emoji:"🧄"},
        {item:"White rice (dry)", amount:"2.5 cups (475g)", weight:"475g dry", emoji:"🍚"},
      ],
      steps: [
        "Preheat oven to 400°F.",
        "Line a large baking sheet with foil (easy cleanup).",
        "Place chicken breasts on one half of the sheet. Spray with olive oil. Season with garlic, paprika, salt.",
        "Pour frozen broccoli on the other half. Spray + season.",
        "Bake 22-25 min. Chicken is done when internal temp is 165°F or when it's no longer pink.",
        "While it bakes: cook rice (2.5 cups dry + 5 cups water, 18 min on stove).",
        "Rest chicken 5 min, slice, divide evenly across 5 containers with rice + broccoli.",
      ],
      macrosPerServing: {cal: 420, protein: 46, carbs: 38, fat: 6},
      scaleTip: "Slice all chicken, weigh total, divide by 5. Each portion should be ~181g cooked chicken. Same for rice: weigh the whole cooked batch, divide by 5.",
      prepNote: "5 servings. The gold standard. Tastes good cold, microwaves well, freezes fine.",
      budget: "$16",
    },
    {
      week: 4,
      name: "Baked Ziti (Cottage Cheese Version)",
      tag: "🔥 Comfort Food · Freezer-friendly",
      time: "45 min",
      servings: 6,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=healthy+baked+ziti+cottage+cheese+high+protein+meal+prep",
      why: "Feels like a cheat meal but hits 38g protein. Make it Sunday, eat like a king all week. Tastes even better day 2.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"1 lb (454g)", weight:"454g raw", emoji:"🦃"},
        {item:"Ziti or penne pasta (protein+)", amount:"12 oz (340g)", weight:"340g dry", emoji:"🍝"},
        {item:"Low-fat cottage cheese", amount:"1.5 cups (340g)", weight:"340g", emoji:"🧀"},
        {item:"Marinara sauce", amount:"1 jar (680g)", weight:"680g", emoji:"🍅"},
        {item:"Part-skim mozzarella (shredded)", amount:"1 cup (112g)", weight:"112g", emoji:"🧀"},
      ],
      steps: [
        "Preheat oven 375°F. Boil pasta 2 min LESS than box says.",
        "Brown turkey in skillet. Drain. Season with salt, pepper, Italian seasoning.",
        "In a bowl: blend cottage cheese smooth (blender or fork). Mix in marinara.",
        "Combine pasta + turkey + cottage cheese sauce. Mix well.",
        "Pour into a 9x13 greased baking dish. Top with mozzarella.",
        "Cover with foil, bake 25 min. Remove foil, bake 10 more min until cheese bubbles.",
        "Let rest 10 min (important — it sets up). Cut into 6 equal squares.",
      ],
      macrosPerServing: {cal: 395, protein: 38, carbs: 42, fat: 9},
      scaleTip: "Score the top of the bake into 6 equal sections before serving. Weigh one section if you want to be precise. Each should be ~285g.",
      prepNote: "6 servings. Freezes in individual portions for 3 months. Microwave from frozen 3-4 min.",
      budget: "$17",
    },
  ],
  bulk: [
    {
      week: 1,
      name: "Ground Turkey Rice Power Bowl",
      tag: "💪 Bulk Classic · 52g protein",
      time: "25 min",
      servings: 6,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=ground+turkey+rice+bowl+meal+prep+bulk+high+protein",
      why: "The workhorse of every bulk. Cook it twice a week, eat it 3x a day if needed. Boring? Only if you don't season it right.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"2 lbs (907g)", weight:"907g total", emoji:"🦃"},
        {item:"White rice (dry)", amount:"4 cups (760g)", weight:"760g dry", emoji:"🍚"},
        {item:"Frozen broccoli", amount:"3 bags (32oz each)", weight:"1.3 kg", emoji:"🥦"},
        {item:"Olive oil", amount:"2 tbsp (28g)", weight:"28g", emoji:"🫒"},
        {item:"Garlic powder + cumin + salt", amount:"2 tsp each", weight:"season", emoji:"🧄"},
      ],
      steps: [
        "Cook rice: 4 cups dry + 8 cups water. Boil, reduce, cover, 18 min.",
        "Brown turkey in large skillet with olive oil. Season aggressively — garlic, cumin, salt, pepper. Cook 7-8 min.",
        "Microwave broccoli bags per instructions (5 min each).",
        "Divide rice into 6 containers (weigh: ~200g cooked rice each).",
        "Add turkey on top (~150g per container). Add broccoli.",
        "Drizzle a little soy sauce or hot sauce in each. Seal.",
      ],
      macrosPerServing: {cal: 620, protein: 52, carbs: 72, fat: 14},
      scaleTip: "Cook ALL the turkey, weigh the whole cooked batch, divide by 6. Same with rice. Don't eyeball — 50g difference in rice is 100+ calories.",
      prepNote: "6 containers. Eat 2-3/day on training days. Keep it consistent.",
      budget: "$22",
    },
    {
      week: 2,
      name: "Egg + Oat Power Breakfast",
      tag: "🥚 Morning Fuel · 48g protein",
      time: "10 min",
      servings: 1,
      difficulty: "Easiest",
      youtubeSearch: "https://www.youtube.com/results?search_query=scrambled+eggs+oatmeal+protein+high+calorie+bulk+breakfast",
      why: "You make this fresh every morning. 10 min. This is not meal prep — this is a system. Same meal, same time, every day.",
      ingredients: [
        {item:"Whole eggs", amount:"3 large (150g)", weight:"50g each", emoji:"🥚"},
        {item:"Egg whites", amount:"3 (90g)", weight:"30g each", emoji:"🥚"},
        {item:"Rolled oats", amount:"1 cup dry (90g)", weight:"90g", emoji:"🌾"},
        {item:"Whey protein powder", amount:"1 scoop (30g)", weight:"30g", emoji:"🥛"},
        {item:"Banana (optional)", amount:"1 medium (120g)", weight:"120g", emoji:"🍌"},
      ],
      steps: [
        "Microwave oats: 1 cup oats + 1.5 cups water, 2 min. Stir in protein powder while hot.",
        "Spray a pan. Crack 3 whole eggs + 3 egg whites. Scramble 2-3 min.",
        "Slice banana on top of oats. Eat eggs alongside.",
        "Total time: under 10 min.",
      ],
      macrosPerServing: {cal: 720, protein: 48, carbs: 82, fat: 16},
      scaleTip: "Weigh your oats dry every time. 90g is 1 cup but weigh it — scoops vary. Each egg is roughly 50g, each white is 30g.",
      prepNote: "Make fresh each morning. Buy 18-pack eggs on Sunday. Non-negotiable meal.",
      budget: "$3/day",
    },
    {
      week: 3,
      name: "Salmon + Sweet Potato + Asparagus",
      tag: "🐟 Premium Week · Omega-3 boost",
      time: "30 min",
      servings: 4,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=salmon+sweet+potato+meal+prep+high+protein+oven",
      why: "Week 3 you get something that feels like a real meal. Salmon is expensive but worth one week — the omega-3s help recovery.",
      ingredients: [
        {item:"Salmon fillets", amount:"4 fillets (~6oz each / 680g)", weight:"170g each", emoji:"🐟"},
        {item:"Sweet potatoes", amount:"4 medium (800g)", weight:"200g each", emoji:"🍠"},
        {item:"Asparagus bunch", amount:"1 bundle (400g)", weight:"400g total", emoji:"🌿"},
        {item:"Olive oil", amount:"2 tbsp (28g)", weight:"28g", emoji:"🫒"},
        {item:"Lemon + garlic salt", amount:"1 lemon + seasoning", weight:"season", emoji:"🍋"},
      ],
      steps: [
        "Preheat oven to 400°F. Line two baking sheets.",
        "Pierce sweet potatoes with fork. Microwave 5 min each, or bake alongside salmon.",
        "Place salmon on one pan. Drizzle olive oil, lemon juice, garlic salt.",
        "Lay asparagus on second pan. Olive oil + salt. Spread flat.",
        "Bake salmon 15-18 min. Asparagus 12-14 min.",
        "Divide into 4 containers: 1 fillet + 1 sweet potato + asparagus.",
      ],
      macrosPerServing: {cal: 580, protein: 48, carbs: 46, fat: 18},
      scaleTip: "Salmon fillets should each be 170g raw. Weigh them at the store or ask the counter. After cooking they lose ~20-25% weight.",
      prepNote: "4 servings — this is a premium prep week. Good in fridge 3 days max (fish). Make Wed and Sun.",
      budget: "$28",
    },
    {
      week: 4,
      name: "Turkey Pasta Bake (Bulk Edition)",
      tag: "🍝 High Cal · Comfort + Gains",
      time: "45 min",
      servings: 6,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=ground+turkey+pasta+bake+meal+prep+high+protein+bulk",
      why: "Same baked ziti concept but with more pasta and turkey for bulk macros. Tastes incredible, makes 6 massive portions.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"1.5 lbs (680g)", weight:"680g raw", emoji:"🦃"},
        {item:"Rigatoni or penne pasta", amount:"1 lb (454g)", weight:"454g dry", emoji:"🍝"},
        {item:"Ricotta cheese", amount:"15 oz (425g)", weight:"425g", emoji:"🧀"},
        {item:"Marinara sauce", amount:"2 jars (1360g)", weight:"1360g", emoji:"🍅"},
        {item:"Shredded mozzarella", amount:"1.5 cups (168g)", weight:"168g", emoji:"🧀"},
      ],
      steps: [
        "Preheat oven 375°F. Cook pasta 2 min under (it bakes more).",
        "Brown turkey. Season with Italian seasoning, salt, pepper.",
        "Mix ricotta + marinara in a large bowl.",
        "Add cooked pasta + turkey to bowl. Mix everything together.",
        "Pour into a large greased baking dish. Top with mozzarella.",
        "Bake 30-35 min covered, then 10 min uncovered for golden cheese.",
        "Rest 10 min. Portion into 6 equal containers.",
      ],
      macrosPerServing: {cal: 640, protein: 50, carbs: 68, fat: 16},
      scaleTip: "Score 6 equal sections in the dish before scooping. Weigh each portion — target ~350g per container.",
      prepNote: "6 servings. Freezes great. Rotate with the turkey rice bowl so you never have the same two days in a row.",
      budget: "$20",
    },
  ],
  recomp: [
    {
      week: 1,
      name: "Sheet Pan Chicken + Veggies",
      tag: "🍗 Recomp Classic · Balanced macros",
      time: "35 min",
      servings: 5,
      difficulty: "Easiest",
      youtubeSearch: "https://www.youtube.com/results?search_query=sheet+pan+chicken+vegetables+meal+prep+recomp+balanced",
      why: "The foundation. Clean protein, fiber, and moderate carbs. Repeatable all week without getting bored if you change the seasoning.",
      ingredients: [
        {item:"Chicken breast", amount:"2 lbs (907g)", weight:"907g raw", emoji:"🍗"},
        {item:"Sweet potato", amount:"3 medium (600g)", weight:"200g each", emoji:"🍠"},
        {item:"Frozen broccoli", amount:"2 bags (32oz each)", weight:"907g", emoji:"🥦"},
        {item:"Olive oil spray", amount:"1 can", weight:"~5g per meal", emoji:"🫒"},
        {item:"Seasoning of choice", amount:"garlic, paprika, cumin", weight:"season", emoji:"🧄"},
      ],
      steps: [
        "Preheat oven to 400°F.",
        "Cube sweet potatoes (leave skin on). Spread on baking sheet. Spray + season.",
        "Place chicken on same or second sheet. Spray + season differently (try cumin + paprika).",
        "Bake 20-25 min. Microwave broccoli bags while oven runs.",
        "Rest chicken 5 min. Slice. Divide into 5 containers with sweet potato + broccoli.",
      ],
      macrosPerServing: {cal: 470, protein: 46, carbs: 44, fat: 7},
      scaleTip: "Weigh sweet potato BEFORE cooking (200g raw each). After roasting they get smaller. Pre-portion raw.",
      prepNote: "5 containers. Change the seasoning each week (cajun, lemon pepper, Italian) to keep it fresh mentally.",
      budget: "$18",
    },
    {
      week: 2,
      name: "Turkey & Veggie Skillet",
      tag: "🥘 One Pan · 46g protein",
      time: "20 min",
      servings: 4,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=one+pan+ground+turkey+vegetable+skillet+meal+prep+high+protein",
      why: "One pot, done in 20 min. You can throw in whatever vegetables you have. The one-pot means less cleanup = more likely to actually do it.",
      ingredients: [
        {item:"93% lean ground turkey", amount:"1 lb (454g)", weight:"454g raw", emoji:"🦃"},
        {item:"Zucchini", amount:"2 medium (400g)", weight:"200g each", emoji:"🥒"},
        {item:"Mushrooms", amount:"8oz (227g)", weight:"227g", emoji:"🍄"},
        {item:"Canned diced tomatoes", amount:"1 can (400g)", weight:"400g", emoji:"🍅"},
        {item:"Brown rice or quinoa (dry)", amount:"1.5 cups (280g)", weight:"280g dry", emoji:"🌾"},
      ],
      steps: [
        "Cook rice/quinoa separately (follow box). Quinoa: 1.5 cups + 3 cups water, 15 min.",
        "In a large skillet: brown turkey, break up, season. 5-6 min.",
        "Add sliced zucchini + mushrooms. Cook 4-5 min until soft.",
        "Pour in canned tomatoes (don't drain). Stir. Simmer 5 min.",
        "Divide rice into 4 containers. Top with turkey + veggie mix.",
      ],
      macrosPerServing: {cal: 455, protein: 46, carbs: 48, fat: 8},
      scaleTip: "1.5 cups dry quinoa yields ~4.5 cups cooked. Divide by 4 = ~1.1 cups cooked per container. Weigh it (target ~220g cooked per portion).",
      prepNote: "4 containers. Great with hot sauce on top. Change the veggie combo each week.",
      budget: "$13",
    },
    {
      week: 3,
      name: "Protein Shake + Overnight Oats",
      tag: "🥤 Shake as Meal · 10 min prep",
      time: "5 min",
      servings: 1,
      difficulty: "Easiest",
      youtubeSearch: "https://www.youtube.com/results?search_query=high+protein+overnight+oats+meal+prep+simple",
      why: "The shake IS the meal. You said a shake counts — and you're right. Make overnight oats the night before, shake in the morning. Done.",
      ingredients: [
        {item:"Rolled oats", amount:"¾ cup (68g)", weight:"68g dry", emoji:"🌾"},
        {item:"Whey or casein protein", amount:"1 scoop (30g)", weight:"30g", emoji:"🥛"},
        {item:"Greek yogurt (0% fat)", amount:"½ cup (113g)", weight:"113g", emoji:"🥣"},
        {item:"Almond milk or water", amount:"¾ cup (180ml)", weight:"180g", emoji:"🥛"},
        {item:"Frozen berries (optional)", amount:"½ cup (75g)", weight:"75g", emoji:"🫐"},
      ],
      steps: [
        "The night before: in a jar or container, add oats, protein powder, yogurt, milk. Stir.",
        "Add berries on top. Cover. Refrigerate overnight.",
        "Morning: shake up your protein shake separately OR eat the oats as your morning meal.",
        "No cooking. Just mix and forget. 5 min total.",
      ],
      macrosPerServing: {cal: 430, protein: 44, carbs: 50, fat: 6},
      scaleTip: "Weigh oats dry (68g). Each tablespoon of oats is ~10g so count carefully. Protein powder: use a kitchen scale, don't trust scoops (scoops can vary 5-8g).",
      prepNote: "Make 3-5 jars at once Sunday night. Grab one each morning. Lasts 5 days in fridge.",
      budget: "$7/5 jars",
    },
    {
      week: 4,
      name: "Ricotta Turkey Pasta (Broccoli)",
      tag: "🍝 Creamy + Clean · 38g protein",
      time: "30 min",
      servings: 5,
      difficulty: "Easy",
      youtubeSearch: "https://www.youtube.com/results?search_query=ricotta+ground+turkey+pasta+broccoli+high+protein+meal+prep",
      why: "Ricotta makes it feel creamy and indulgent. 38g protein per bowl. Hits the macros and hits the taste. Week 4 reward.",
      ingredients: [
        {item:"Extra lean ground turkey", amount:"1 lb (454g)", weight:"454g raw", emoji:"🦃"},
        {item:"Broccoli florets (fresh/frozen)", amount:"3 cups (270g)", weight:"270g", emoji:"🥦"},
        {item:"Jumbo shells or penne pasta", amount:"8oz (227g)", weight:"227g dry", emoji:"🍝"},
        {item:"Part-skim ricotta", amount:"15oz (425g)", weight:"425g", emoji:"🧀"},
        {item:"Lemon pepper seasoning + garlic", amount:"2 tsp + 3 cloves", weight:"season", emoji:"🍋"},
      ],
      steps: [
        "Cook pasta per box (al dente). Drain, reserve ¼ cup pasta water.",
        "In a large skillet: roast broccoli in a dry hot pan 4-5 min (gets slightly charred = better flavor).",
        "Push broccoli aside. Brown turkey with lemon pepper seasoning and garlic.",
        "Lower heat. Add ricotta + pasta water. Stir until everything is coated and creamy.",
        "Add cooked pasta. Toss gently. Divide into 5 containers.",
      ],
      macrosPerServing: {cal: 450, protein: 38, carbs: 44, fat: 12},
      scaleTip: "After mixing, weigh the entire batch. Divide by 5. Scoop equal portions. Each should be ~340g.",
      prepNote: "5 servings. The lemon pepper is non-negotiable — it's what makes it taste like restaurant food.",
      budget: "$16",
    },
  ],
};

const SCALE_GUIDE = [
  {emoji:"📏", rule:"Always weigh protein RAW", why:"Chicken loses 25-30% weight when cooked. If you weigh cooked chicken you'll under-eat protein."},
  {emoji:"🍚", rule:"Weigh carbs DRY (rice/oats)", why:"1 cup dry rice = 3 cups cooked. The weight changes dramatically. Dry = accurate."},
  {emoji:"🧀", rule:"Weigh cheese/fats precisely", why:"These are calorie-dense. An extra 20g of cheese = ~70 extra calories. Doesn't seem like much — adds up across a week."},
  {emoji:"⚖️", rule:"Divide the whole batch", why:"Cook everything, weigh the total, divide by servings. Faster than weighing each ingredient separately."},
  {emoji:"📱", rule:"Log the raw weight in MyFitnessPal", why:"Search for 'raw chicken breast' not 'cooked' — the entries match the numbers you're tracking."},
  {emoji:"🥩", rule:"4oz cooked = ~5.5oz raw", why:"A quick cheat: target 4oz cooked chicken per meal. Buy 5.5oz raw per serving."},
];

function RecipeCard({recipe}: {recipe: any}) {
  const [tab, setTab] = useState<"how"|"macros"|"scale">("how");
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",overflow:"hidden",marginBottom:16}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a1a1a,#111)",padding:"18px 16px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--red)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>Week {recipe.week} Recipe</div>
            <div style={{fontFamily:"Outfit",fontSize:18,fontWeight:800,color:"#fff",letterSpacing:-0.3,marginBottom:4}}>{recipe.name}</div>
            <div style={{fontSize:11,color:"var(--green)",fontWeight:700}}>{recipe.tag}</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
            <div style={{fontFamily:"Outfit",fontSize:22,fontWeight:800,color:"var(--green)"}}>{recipe.budget}</div>
            <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase"}}>budget</div>
          </div>
        </div>
        <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,fontStyle:"italic",marginBottom:12}}>{recipe.why}</div>
        {/* Stats row */}
        <div style={{display:"flex",gap:8}}>
          {[{l:"Time",v:recipe.time},{l:"Servings",v:recipe.servings},{l:"Level",v:recipe.difficulty}].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,padding:"6px 8px",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:800,color:"#fff"}}>{s.v}</div>
              <div style={{fontSize:8,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid var(--border)"}}>
        {(["how","macros","scale"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px 4px",border:"none",background:tab===t?"var(--red)":"none",color:tab===t?"#fff":"var(--muted)",fontFamily:"Outfit",fontSize:11,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5,transition:"all 0.15s"}}>
            {t==="how"?"🍳 How To":t==="macros"?"📊 Macros":"⚖️ Scale"}
          </button>
        ))}
      </div>

      {/* How to make */}
      {tab==="how" && (
        <div style={{padding:"16px"}}>
          {/* Ingredients */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>Ingredients</div>
            {recipe.ingredients.map((ing: any, i: number) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<recipe.ingredients.length-1?"1px solid #1a1a1a":"none"}}>
                <div style={{fontSize:20,lineHeight:1,flexShrink:0}}>{ing.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{ing.item}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{ing.amount}</div>
                </div>
                <div style={{fontSize:10,fontWeight:800,color:"var(--yellow)",flexShrink:0,background:"var(--yellow-lt)",padding:"3px 7px",borderRadius:3}}>{ing.weight}</div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>Steps</div>
            {recipe.steps.map((step: string, i: number) => (
              <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
                <div style={{width:22,height:22,borderRadius:2,background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:12,color:"#d0d0d0",lineHeight:1.6,flex:1}}>{step}</div>
              </div>
            ))}
          </div>

          {/* Prep note */}
          <div style={{background:"var(--green-lt)",border:"1px solid var(--green)",borderRadius:"var(--radius-sm)",padding:"10px 12px",marginBottom:14}}>
            <div style={{fontSize:11,color:"var(--green)",fontWeight:600,lineHeight:1.5}}>📦 {recipe.prepNote}</div>
          </div>

          {/* YouTube button */}
          <a href={recipe.youtubeSearch} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"#ff0000",borderRadius:"var(--radius)",padding:"12px 16px",textDecoration:"none",cursor:"pointer"}}>
            <span style={{fontSize:18}}>▶️</span>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>Watch How To Make It on YouTube</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>Search results open in browser</div>
            </div>
          </a>
        </div>
      )}

      {/* Macros */}
      {tab==="macros" && (
        <div style={{padding:"16px"}}>
          <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:14}}>Per Serving · {recipe.servings} Total</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[
              {label:"Calories",val:recipe.macrosPerServing.cal,color:"var(--red)",big:true},
              {label:"Protein",val:recipe.macrosPerServing.protein+"g",color:"#4a90d9",big:true},
              {label:"Carbs",val:recipe.macrosPerServing.carbs+"g",color:"var(--yellow)",big:false},
              {label:"Fat",val:recipe.macrosPerServing.fat+"g",color:"var(--green)",big:false},
            ].map(m=>(
              <div key={m.label} style={{background:"var(--bg)",borderRadius:"var(--radius)",padding:"16px 14px",textAlign:"center",border:`1px solid ${m.big?m.color+"40":"var(--border)"}`,boxShadow:m.big?`0 0 12px ${m.color}20`:"none"}}>
                <div style={{fontFamily:"Outfit",fontSize:m.big?32:24,fontWeight:800,color:m.color,letterSpacing:-1,lineHeight:1}}>{m.val}</div>
                <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginTop:4}}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Daily totals if eating 2-3x */}
          <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>If You Eat This All Day</div>
          <div style={{background:"var(--surface2)",borderRadius:"var(--radius)",overflow:"hidden"}}>
            {[2,3].map(n=>(
              <div key={n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:n===2?"1px solid var(--border)":"none"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>Eat this {n}x today</div>
                <div style={{display:"flex",gap:14}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"Outfit",fontSize:15,fontWeight:800,color:"var(--red)"}}>{recipe.macrosPerServing.cal*n}</div>
                    <div style={{fontSize:8,color:"var(--muted)",fontWeight:700}}>cal</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"Outfit",fontSize:15,fontWeight:800,color:"#4a90d9"}}>{recipe.macrosPerServing.protein*n}g</div>
                    <div style={{fontSize:8,color:"var(--muted)",fontWeight:700}}>prot</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:8}}>Add a protein shake for extra protein without many calories</div>
        </div>
      )}

      {/* Scale tips */}
      {tab==="scale" && (
        <div style={{padding:"16px"}}>
          <div style={{background:"var(--yellow-lt)",border:"1px solid var(--yellow)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--yellow)",marginBottom:4}}>⚖️ Recipe-specific tip</div>
            <div style={{fontSize:11,color:"#d0a030",lineHeight:1.6}}>{recipe.scaleTip}</div>
          </div>
          <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:12}}>Ingredient Weights Quick Ref</div>
          {recipe.ingredients.map((ing: any, i: number) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<recipe.ingredients.length-1?"1px solid #1a1a1a":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>{ing.emoji}</span>
                <div style={{fontSize:12,color:"#d0d0d0"}}>{ing.item}</div>
              </div>
              <div style={{fontFamily:"Outfit",fontSize:12,fontWeight:800,color:"var(--yellow)",background:"var(--yellow-lt)",padding:"3px 8px",borderRadius:3,flexShrink:0}}>{ing.weight}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FoodScaleGuide() {
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px",marginBottom:16}}>
      <div style={{fontFamily:"Outfit",fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>⚖️ Do I Need a Food Scale?</div>
      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5,marginBottom:14}}>Short answer: <strong style={{color:"#fff"}}>yes.</strong> A $10 kitchen scale on Amazon will be the best investment in your diet. Here's why and how:</div>
      {SCALE_GUIDE.map((tip,i)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i<SCALE_GUIDE.length-1?"1px solid #1a1a1a":"none"}}>
          <div style={{fontSize:20,lineHeight:1,flexShrink:0}}>{tip.emoji}</div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:3}}>{tip.rule}</div>
            <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{tip.why}</div>
          </div>
        </div>
      ))}
      <div style={{marginTop:14,background:"var(--blue-lt)",border:"1px solid var(--blue)",borderRadius:"var(--radius-sm)",padding:"10px 12px"}}>
        <div style={{fontSize:11,color:"var(--blue)",fontWeight:700}}>💡 No scale yet? Use this shortcut:</div>
        <div style={{fontSize:11,color:"#88aadd",marginTop:4,lineHeight:1.5}}>Cook the whole batch, divide the container into equal sections visually (cut 6 lines across it), weigh each section. Close enough to stay on track.</div>
      </div>
    </div>
  );
}

function GroceryList({items, totalBudget}: {items: any[], totalBudget: number}) {
  const [checked, setChecked] = useState<Record<string,boolean>>({});
  const total = items.reduce((a,i)=>a+i.cost, 0);
  const remaining = items.filter(i=>!checked[i.item]).reduce((a,i)=>a+i.cost, 0);
  const aisles: Record<string, any[]> = {};
  items.forEach(i => { if(!aisles[i.aisle]) aisles[i.aisle]=[]; aisles[i.aisle].push(i); });

  return (
    <div>
      <div style={{background:"var(--surface2)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16,border:"1px solid var(--border)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1}}>Weekly Grocery Budget</div>
          <div style={{fontFamily:"Outfit",fontSize:22,fontWeight:800,color:"var(--green)"}}>${total}</div>
        </div>
        <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${100-(remaining/total)*100}%`,background:"var(--green)",borderRadius:3,transition:"width 0.4s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <div style={{fontSize:10,color:"var(--muted)"}}>{items.filter(i=>checked[i.item]).length}/{items.length} items checked</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>~${remaining} left to buy</div>
        </div>
      </div>
      {Object.entries(aisles).map(([aisle, aisleItems]) => (
        <div key={aisle} style={{marginBottom:14}}>
          <div style={{fontSize:9,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:8,paddingBottom:6,borderBottom:"1px solid var(--border)"}}>{aisle}</div>
          {aisleItems.map((item: any) => (
            <div key={item.item} onClick={()=>setChecked(c=>({...c,[item.item]:!c[item.item]}))}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid #1a1a1a",cursor:"pointer",opacity:checked[item.item]?0.4:1,transition:"opacity 0.2s"}}>
              <div style={{width:22,height:22,borderRadius:2,border:`2px solid ${checked[item.item]?"var(--green)":"var(--border)"}`,background:checked[item.item]?"var(--green)":"none",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",transition:"all 0.15s"}}>
                {checked[item.item]?"✓":""}
              </div>
              <div style={{fontSize:18,lineHeight:1,flexShrink:0}}>{item.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:checked[item.item]?"var(--muted)":"#fff",textDecoration:checked[item.item]?"line-through":"none"}}>{item.item}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{item.qty}</div>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:item.cost===0?"var(--muted)":"var(--green)",flexShrink:0}}>{item.cost===0?"Free":"$"+item.cost}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:8}}>Tap items to check off as you shop 🛒</div>
    </div>
  );
}

const BUDGET_PLANS: Record<string, any> = {
  cut: {calories:1600,protein:175,carbs:140,fat:40,weeklyBudget:38,
    grocery:[
      {item:"Chicken breast",qty:"3 lbs",cost:9,aisle:"Meat",emoji:"🍗"},
      {item:"White rice (dry)",qty:"3 cups",cost:2,aisle:"Grains",emoji:"🍚"},
      {item:"Frozen broccoli",qty:"2 bags 32oz",cost:5,aisle:"Frozen",emoji:"🥦"},
      {item:"Whey protein",qty:"1 tub",cost:10,aisle:"Supplements",emoji:"🥛"},
      {item:"Rolled oats",qty:"42oz container",cost:4,aisle:"Grains",emoji:"🌾"},
      {item:"Olive oil spray",qty:"1 can",cost:3,aisle:"Oils",emoji:"🫒"},
      {item:"Garlic powder",qty:"1 bottle",cost:2,aisle:"Spices",emoji:"🧄"},
      {item:"Salt & pepper",qty:"Already home",cost:0,aisle:"Spices",emoji:"🧂"},
      {item:"Containers 6-pack",qty:"24-32oz BPA-free",cost:8,aisle:"Kitchen",emoji:"📦"},
    ],
  },
  bulk: {calories:2900,protein:215,carbs:340,fat:72,weeklyBudget:55,
    grocery:[
      {item:"Ground turkey 93%",qty:"4 lbs",cost:12,aisle:"Meat",emoji:"🦃"},
      {item:"Whole eggs",qty:"18-pack x2",cost:8,aisle:"Dairy",emoji:"🥚"},
      {item:"White rice",qty:"5 lb bag",cost:4,aisle:"Grains",emoji:"🍚"},
      {item:"Frozen broccoli",qty:"3 bags 32oz",cost:7,aisle:"Frozen",emoji:"🥦"},
      {item:"Whey protein",qty:"1 tub",cost:10,aisle:"Supplements",emoji:"🥛"},
      {item:"Casein protein",qty:"1 tub",cost:8,aisle:"Supplements",emoji:"🍼"},
      {item:"Rolled oats",qty:"42oz",cost:4,aisle:"Grains",emoji:"🌾"},
      {item:"Bananas",qty:"1 bunch",cost:2,aisle:"Produce",emoji:"🍌"},
      {item:"Peanut butter",qty:"16oz",cost:4,aisle:"Pantry",emoji:"🥜"},
      {item:"Olive oil",qty:"small bottle",cost:4,aisle:"Oils",emoji:"🫒"},
    ],
  },
  recomp: {calories:2150,protein:190,carbs:215,fat:58,weeklyBudget:45,
    grocery:[
      {item:"Chicken breast",qty:"2.5 lbs",cost:8,aisle:"Meat",emoji:"🍗"},
      {item:"Sweet potatoes",qty:"4 medium",cost:3,aisle:"Produce",emoji:"🍠"},
      {item:"Frozen broccoli",qty:"2 bags",cost:5,aisle:"Frozen",emoji:"🥦"},
      {item:"Whole eggs",qty:"18-pack",cost:5,aisle:"Dairy",emoji:"🥚"},
      {item:"Whey protein",qty:"1 tub",cost:10,aisle:"Supplements",emoji:"🥛"},
      {item:"Rolled oats",qty:"42oz",cost:4,aisle:"Grains",emoji:"🌾"},
      {item:"Cottage cheese",qty:"32oz",cost:4,aisle:"Dairy",emoji:"🧀"},
      {item:"Mixed berries frozen",qty:"12oz",cost:3,aisle:"Frozen",emoji:"🫐"},
      {item:"Olive oil spray",qty:"1 can",cost:3,aisle:"Oils",emoji:"🫒"},
    ],
  },
};

function Meals({up,weekNum,weeklyData,foodLog,setFoodLog}: any) {
  const [mealTab, setMealTab] = useState<"recipe"|"prep"|"log">("recipe");
  const goal=up?.goal||"cut";
  const base=BASE_PLANS[goal];
  const budget=BUDGET_PLANS[goal];
  const engine=runEngine(up,weeklyData,weekNum);
  const gc=GOAL_COLORS[goal];
  const btMult=getBodyTypeMultiplier(up?.bodyType||"mesomorph",goal);
  const baseCal=Math.round(base.calories*btMult);
  const cal=engine?baseCal+engine.calAdj:baseCal;
  const prot=engine?Math.round(base.protein*btMult)+engine.protAdj:Math.round(base.protein*btMult);
  const sf=cal/base.calories;

  // Get this week's recipe (rotate through 4)
  const recipes = WEEKLY_RECIPES[goal] || WEEKLY_RECIPES.cut;
  const thisWeekRecipe = recipes[(weekNum-1) % 4];
  const nextWeekRecipe = recipes[weekNum % 4];

  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
        <div>
          <div className="page-title">Meal Plan</div>
          <div className="page-sub">{GOAL_LABELS[goal]} · Week {weekNum}</div>
        </div>
      </div>

      {/* Macro targets */}
      <div className="macro-strip" style={{marginBottom:16}}>
        {[{v:cal,n:"Calories",c:gc},{v:prot+"g",n:"Protein",c:"#4a90d9"},{v:Math.round(base.carbs*sf)+"g",n:"Carbs",c:"#c8440a"},{v:Math.round(base.fat*sf)+"g",n:"Fat",c:"#f0b429"}].map(m=>(
          <div key={m.n} className="macro-tile"><div className="macro-val" style={{color:m.c}}>{m.v}</div><div className="macro-name">{m.n}</div></div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:4,marginBottom:20,background:"var(--surface)",borderRadius:"var(--radius)",padding:4}}>
        {([["recipe","🍳 This Week"],["prep","🛒 Grocery"],["log","📸 Log Food"]] as [string,string][]).map(([id,label])=>(
          <button key={id} onClick={()=>setMealTab(id as any)} style={{flex:1,padding:"9px 4px",borderRadius:"var(--radius-sm)",border:"none",background:mealTab===id?"var(--red)":"none",color:mealTab===id?"#fff":"var(--muted)",fontFamily:"Outfit",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.15s",textAlign:"center"}}>{label}</button>
        ))}
      </div>

      {/* ── RECIPE TAB ── */}
      {mealTab==="recipe" && (
        <div>
          {/* Philosophy banner */}
          <div style={{background:"linear-gradient(135deg,#0e1a0e,#0e0e0e)",border:"1px solid var(--green)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:4}}>The System</div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:4}}>1 recipe per week. Prep Sunday + Wednesday. Eat the same all week.</div>
            <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>A shake counts as a meal. You don't need to be a chef. You just need one good recipe locked in per week. Every 4 weeks the rotation resets — 4 recipes total, all 5 ingredients or less.</div>
          </div>

          {/* This week's recipe */}
          <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:12}}>This Week</div>
          <RecipeCard recipe={thisWeekRecipe}/>

          {/* Food scale guide */}
          <FoodScaleGuide/>

          {/* Shake = meal */}
          <div style={{background:"var(--surface)",border:"1px solid #4a90d9",borderRadius:"var(--radius)",padding:"16px",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:8}}>🥤 A Shake IS a Meal</div>
            <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.6,marginBottom:12}}>You said it — and it's true. Every elite bodybuilder uses shakes as meals. Here's your shake-as-meal template. It hits your protein and calorie target:</div>
            {[
              {name:"Standard Shake",cal:300,pro:30,desc:"2 scoops whey + 12oz whole milk + banana. Blend or shake. Done."},
              {name:"High-Protein Shake",cal:420,pro:50,desc:"2 scoops whey + 1 cup Greek yogurt + 6oz milk + handful oats. Blend."},
              {name:"Budget Shake",cal:250,pro:28,desc:"1.5 scoops whey + water + 1 tbsp peanut butter. 30 seconds to make."},
            ].map((shake,i)=>(
              <div key={i} style={{background:"var(--bg)",borderRadius:"var(--radius-sm)",padding:"12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#fff"}}>{shake.name}</div>
                  <div style={{display:"flex",gap:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:"var(--red)"}}>{shake.cal} cal</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#4a90d9"}}>{shake.pro}g pro</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{shake.desc}</div>
              </div>
            ))}
          </div>

          {/* Next week preview */}
          <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:9,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Next Week → Week {weekNum+1}</div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{nextWeekRecipe.name}</div>
            <div style={{fontSize:11,color:"var(--green)",marginTop:2}}>{nextWeekRecipe.tag} · {nextWeekRecipe.budget} · {nextWeekRecipe.time}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:6,lineHeight:1.5}}>{nextWeekRecipe.why}</div>
          </div>
        </div>
      )}

      {/* ── GROCERY TAB ── */}
      {mealTab==="prep" && (
        <div>
          <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Week {weekNum} Recipe Budget</div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:4}}>{thisWeekRecipe.name}</div>
            <div style={{display:"flex",gap:10}}>
              <span style={{fontSize:12,color:"var(--green)",fontWeight:700}}>{thisWeekRecipe.budget} this week</span>
              <span style={{fontSize:12,color:"var(--muted)"}}>{thisWeekRecipe.servings} servings</span>
              <span style={{fontSize:12,color:"var(--muted)"}}>{thisWeekRecipe.time} prep</span>
            </div>
          </div>

          {/* Prep timing guide */}
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:"#fff",marginBottom:10}}>📅 When to Prep</div>
            {[
              {day:"Sunday",task:`Full batch — ${thisWeekRecipe.servings} containers`,covers:"Mon → Wed"},
              {day:"Wednesday",task:"Same recipe, same process",covers:"Thu → Sat"},
              {day:"Saturday",task:"5 min to plan next week",covers:"Review, shop list"},
            ].map((p,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<2?"1px solid var(--border)":"none",alignItems:"flex-start"}}>
                <div style={{width:28,flexShrink:0,fontFamily:"Outfit",fontSize:13,fontWeight:800,color:"var(--red)"}}>{p.day}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{p.task}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>Covers: {p.covers}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Grocery list */}
          <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:12}}>Base Grocery List</div>
          <GroceryList items={budget.grocery} totalBudget={budget.weeklyBudget}/>

          {/* Containers reminder */}
          <div style={{background:"var(--surface2)",borderRadius:"var(--radius)",padding:"12px 14px",marginTop:8,border:"1px solid var(--border)"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:4}}>📦 What You Need (One Time)</div>
            {[
              "6-8 meal prep containers, 24-32oz (BPA-free) — $8 at Walmart",
              "Kitchen scale — $10 on Amazon (search 'Etekcity kitchen scale')",
              "Large baking sheet with foil",
              "Large skillet or nonstick pan",
            ].map((item,i)=>(
              <div key={i} style={{fontSize:11,color:"var(--muted)",padding:"4px 0",display:"flex",gap:8}}>
                <span style={{color:"var(--green)",flexShrink:0}}>→</span>{item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOG FOOD TAB ── */}
      {mealTab==="log" && (
        <div>
          <FoodPhotoLogger foodLog={foodLog} setFoodLog={setFoodLog} goal={goal} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN TRAIN TAB ───────────────────────────────────────────────────────────
function Train({ up, weekNum, setWeekNum, progressPhotos, setProgressPhotos, weeklyData, setTab }: any) {
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [workoutDone, setWorkoutDone] = useState<any>(null);

  const SPLIT = ["push", "rest", "pull", "rest", "legs", "push", "rest"];
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (workoutDone) {
    return (
      <WorkoutComplete
        elapsed={workoutDone.elapsed}
        onDone={() => { setWorkoutDone(null); setTab("home"); }}
      />
    );
  }

  if (activeWorkout) {
    return (
      <ActiveWorkout
        workout={activeWorkout}
        weeklyData={weeklyData}
        weekNum={weekNum}
        onFinish={(summary: any) => { setActiveWorkout(null); setWorkoutDone(summary); }}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-title">Train</div>
      <div className="page-sub">Week {weekNum} · Tap a day to start</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2, 3, 4].map(w => (
          <button
            key={w}
            onClick={() => setWeekNum(w)}
            style={{ flex: 1, padding: "10px 0", background: w === weekNum ? "#3e6451" : "#1a1a1a", border: `1px solid ${w === weekNum ? "#3e6451" : "#222"}`, borderRadius: 8, fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 800, color: w === weekNum ? "#fff" : "#555", cursor: "pointer" }}
          >
            W{w}
          </button>
        ))}
      </div>

      {DAY_NAMES.map((day, i) => {
        const splitType = SPLIT[i];
        const isRest = splitType === "rest";
        const workouts = WORKOUT_DATA[splitType];
        const workout = workouts ? workouts[0] : null;
        return (
          <div
            key={day}
            onClick={() => !isRest && workout && setActiveWorkout(workout)}
            style={{ background: "#1a1a1a", border: `1px solid ${isRest ? "#1a1a1a" : "#2a2a2a"}`, borderRadius: 10, padding: "16px", marginBottom: 10, cursor: isRest ? "default" : "pointer", display: "flex", alignItems: "center", gap: 14, opacity: isRest ? 0.5 : 1 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, background: isRest ? "#111" : workout?.color + "20", border: `1px solid ${isRest ? "#222" : workout?.color + "40"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: isRest ? "#333" : workout?.color, textTransform: "uppercase", letterSpacing: 1 }}>
              {isRest ? "REST" : workout?.tag}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: isRest ? "#333" : "#fff", marginBottom: 2 }}>{day}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{isRest ? "Rest & recover" : workout?.name.split("—")[1]?.trim()}</div>
            </div>
            {!isRest && <div style={{ fontSize: 13, fontWeight: 700, color: workout?.color }}>Start →</div>}
          </div>
        );
      })}

      <div className="slabel" style={{ marginTop: 24 }}>Progress Photos</div>
      <ProgressPhotos photos={progressPhotos} setPhotos={setProgressPhotos} weekNum={weekNum} />
    </div>
  );
}

function Track({weekNum,weeklyData,setWeeklyData,savings,setSavings,up}: any) {
  const wd=weeklyData[weekNum]||{};
  const wl=wd.weightLog||{},beh=wd.behaviors||{},sexLog=wd.sexLog||{},stepsLog=wd.stepsLog||{};
  const updWl=(day: string,field: string,val: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],weightLog:{...(d[weekNum]?.weightLog||{}),[day]:{...(d[weekNum]?.weightLog?.[day]||{}),[field]:val}}}}));
  const updBeh=(key: string,val: number)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],behaviors:{...(d[weekNum]?.behaviors||{}),[key]:Math.max(0,val)}}}));
  const updSteps=(day: string,val: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],stepsLog:{...(d[weekNum]?.stepsLog||{}),[day]:val}}}));
  const toggleSex=(day: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],sexLog:{...(d[weekNum]?.sexLog||{}),[day]:!d[weekNum]?.sexLog?.[day]}}}));
  const toggleWater=(day: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],waterLog:{...(d[weekNum]?.waterLog||{}),[day]:!d[weekNum]?.waterLog?.[day]}}}));
  const toggleMed=(day: string,med: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],medsLog:{...(d[weekNum]?.medsLog||{}),[day]:{...(d[weekNum]?.medsLog?.[day]||{}),[med]:!d[weekNum]?.medsLog?.[day]?.[med]}}}}));
  const waterLog=wd.waterLog||{};const medsLog=wd.medsLog||{};
  const waterDays=Object.values(waterLog).filter(Boolean).length;
  const [savingsCustom,setSavingsCustom]=React.useState("");
  const addSaving=(amount: number,label: string)=>{
    const entry={id:Date.now(),amount,label,date:new Date().toLocaleDateString(),week:weekNum};
    setSavings((s: any[])=>[...s,entry]);
  };
  const thisWeekSavings=(savings||[]).filter((e:any)=>e.week===weekNum);
  const thisWeekTotal=thisWeekSavings.reduce((a:number,e:any)=>a+e.amount,0);
  const allTimeTotal=(savings||[]).reduce((a:number,e:any)=>a+e.amount,0);
  const meds: string[] = up?.meds || ["Creatine","Vitamin D","Fish Oil"];
  const avgSteps=Math.round(Object.values(stepsLog).filter(Boolean).reduce((a:any,b:any)=>a+parseFloat(b as string),0)/Math.max(1,Object.values(stepsLog).filter(Boolean).length));
  return(
    <div className="page">
      <div className="page-title">Track</div>
      <div className="page-sub">Week {weekNum} · Log daily data to power the adaptive engine</div>
      <div className="slabel">Daily Steps <span style={{fontSize:10,color:"var(--muted)",fontWeight:400,textTransform:"none"}}>— sync from iPhone or enter manually</span></div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 14px",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:10}}>
          {DAYS.map(day=>{
            const steps=parseFloat(stepsLog[day]||"0");
            const pct=Math.min(100,(steps/10000)*100);
            return(
              <div key={day} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,marginBottom:4}}>{day}</div>
                <div style={{height:48,display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"center",marginBottom:4}}>
                  <div style={{width:18,borderRadius:"2px 2px 0 0",background:pct>=100?"var(--green)":pct>50?"var(--yellow)":"var(--red)",height:`${Math.max(4,pct*0.48)}px`,transition:"height 0.3s"}}></div>
                </div>
                <input type="number" placeholder="0" value={stepsLog[day]||""} onChange={ev=>updSteps(day,ev.target.value)} style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:2,padding:"3px 2px",fontSize:9,fontWeight:700,color:"#fff",textAlign:"center",fontFamily:"Outfit",outline:"none"}}/>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:11,color:"var(--muted)"}}>Avg: <strong style={{color:"var(--yellow)"}}>{avgSteps.toLocaleString()}</strong> steps/day</div>
          <div style={{fontSize:11,color:avgSteps>=10000?"var(--green)":"var(--muted)",fontWeight:700}}>{avgSteps>=10000?"✓ Goal Met":"Goal: 10,000"}</div>
        </div>
      </div>
      <div className="slabel">Daily Weight Log</div>
      <div className="card">
        <div className="card-body" style={{padding:"10px 14px"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr 44px",gap:8,marginBottom:8}}>
            {["Day","AM","PM","Diff"].map(h=><div key={h} style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{h}</div>)}
          </div>
          {DAYS.map(day=>{
            const e=wl[day]||{};
            const diff=e.am&&e.pm?(parseFloat(e.pm)-parseFloat(e.am)).toFixed(1):null;
            return(
              <div key={day} className="wlog-row">
                <div className="wlog-day">{day}</div>
                <div className="wi-box"><div className="wi-lbl">Morning</div><input type="number" placeholder="0" value={e.am||""} onChange={ev=>updWl(day,"am",ev.target.value)} step="0.1"/></div>
                <div className="wi-box"><div className="wi-lbl">Evening</div><input type="number" placeholder="0" value={e.pm||""} onChange={ev=>updWl(day,"pm",ev.target.value)} step="0.1"/></div>
                <div className={`wdiff${diff&&parseFloat(diff)>0?" up":diff&&parseFloat(diff)<0?" dn":""}`}>{diff!==null?(parseFloat(diff)>0?"+":"")+diff:"--"}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="slabel">Bad Behaviors</div>
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Count incidents this week. Data adjusts next week plan.</div>
      <div className="behavior-grid">
        {BEHAVIORS.map(b=>{
          const count=beh[b.key]||0;
          return(
            <div key={b.key} className={`beh-card${count>0?" active":""}`}>
              <div className="beh-icon">{b.icon}</div>
              <div className="beh-label">{b.label}</div>
              <div className="beh-count">{count}</div>
              <div className="beh-controls">
                <button className="beh-btn" onClick={()=>updBeh(b.key,count-1)}>-</button>
                <button className="beh-btn" onClick={()=>updBeh(b.key,count+1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="slabel">Sexual Activity</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Tap a day to log. Frequency tracking only.</div>
      <div className="card">
        <div className="card-body">
          <div className="sex-week">
            {DAYS.map(d=>(
              <div key={d} className="sex-day">
                <div className="sex-day-lbl">{d}</div>
                <div className={`sex-dot${sexLog[d]?" logged":""}`} onClick={()=>toggleSex(d)}>{sexLog[d]?"❤️":""}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,fontSize:13,color:"var(--muted)"}}>Week total: <strong>{Object.values(sexLog).filter(Boolean).length}</strong></div>
        </div>
      </div>

      {/* ── WATER ── */}
      <div className="slabel">💧 Water</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Tap each day you drank water consistently. No measuring needed — just log it.</div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:12}}>
          {DAYS.map(d=>(
            <div key={d} style={{textAlign:"center"}}>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,marginBottom:6,textTransform:"uppercase"}}>{d[0]}</div>
              <div onClick={()=>toggleWater(d)} style={{width:"100%",aspectRatio:"1",borderRadius:4,background:waterLog[d]?"#1a5cff22":"var(--bg)",border:`2px solid ${waterLog[d]?"#4a90d9":"var(--border)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,transition:"all 0.2s"}}>
                {waterLog[d]?"💧":""}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:16,color:"var(--muted)"}}><strong style={{color:"#4a90d9",fontSize:22}}>{waterDays}</strong>/7 days logged</div>
          <div style={{fontSize:16,color:waterDays>=5?"var(--green)":"var(--muted)",fontWeight:700}}>{waterDays>=7?"🔥 Hydration king":waterDays>=5?"✓ Solid week":waterDays>=3?"Keep going":"Log your water"}</div>
        </div>
      </div>

      {/* ── MEDS & SUPPLEMENTS ── */}
      <div className="slabel">💊 Meds & Supplements</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Daily tracking. Tap each day you took it.</div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-body">
          {meds.map(med=>(
            <div key={med} style={{marginBottom:14}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}}>{med}</div>
              <div style={{display:"flex",gap:6}}>
                {DAYS.map(d=>{
                  const done=medsLog[d]?.[med];
                  return(
                    <div key={d} onClick={()=>toggleMed(d,med)} style={{flex:1,background:done?"var(--green-lt)":"var(--bg)",border:`1px solid ${done?"var(--green)":"var(--border)"}`,borderRadius:4,padding:"6px 4px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}>
                      <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase"}}>{d[0]}</div>
                      <div style={{fontSize:14,marginTop:2}}>{done?"✓":""}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Add/remove supplements in your profile → More tab.</div>
        </div>
      </div>

      {/* ── SAVINGS ── */}
      <div className="slabel">💰 Savings Tracker</div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Log money saved. Every $50 or $100 counts. Small wins compound.</div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px",marginBottom:12}}>
        <div style={{display:"flex",gap:20,marginBottom:20}}>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"var(--yellow)",letterSpacing:-2,lineHeight:1}}>${thisWeekTotal}</div>
            <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,marginTop:4}}>this week</div>
          </div>
          <div style={{width:"1px",background:"var(--border)"}}/>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontFamily:"Outfit",fontSize:48,fontWeight:800,color:"var(--green)",letterSpacing:-2,lineHeight:1}}>${allTimeTotal}</div>
            <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,marginTop:4}}>all time</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[{amount:50,label:"Skipped something"},{amount:100,label:"Didn't buy it"}].map(btn=>(
            <button key={btn.amount} onClick={()=>addSaving(btn.amount,btn.label)} style={{flex:1,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px",fontFamily:"Outfit",fontSize:22,fontWeight:800,color:"var(--yellow)",cursor:"pointer",transition:"all 0.15s"}}>
              +${btn.amount}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input type="number" placeholder="Custom amount..." value={savingsCustom} onChange={e=>setSavingsCustom(e.target.value)} style={{flex:1,background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"12px 14px",fontFamily:"Outfit",fontSize:18,fontWeight:700,color:"#fff",outline:"none"}}/>
          <button onClick={()=>{if(savingsCustom&&parseFloat(savingsCustom)>0){addSaving(parseFloat(savingsCustom),"Custom save");setSavingsCustom("");}}} style={{background:"var(--yellow)",border:"none",borderRadius:"var(--radius-sm)",padding:"12px 18px",fontFamily:"Outfit",fontSize:16,fontWeight:800,color:"#1a1400",cursor:"pointer"}}>Log</button>
        </div>
        {thisWeekSavings.length>0&&<div style={{marginTop:16,borderTop:"1px solid var(--border)",paddingTop:14}}>
          {thisWeekSavings.slice().reverse().map((e:any)=>(
            <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{e.label}</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>{e.date}</div>
              </div>
              <div style={{fontFamily:"Outfit",fontSize:22,fontWeight:800,color:"var(--yellow)"}}>${e.amount}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

function Body({weekNum,weeklyData,setWeeklyData}: any) {
  const wd=weeklyData[weekNum]||{},bc=wd.bodyComp||{},meas=wd.measurements||{};
  const updBc=(k: string,v: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],bodyComp:{...(d[weekNum]?.bodyComp||{}),[k]:v}}}));
  const updMeas=(k: string,v: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],measurements:{...(d[weekNum]?.measurements||{}),[k]:v}}}));
  const bfNum=parseFloat(bc.bodyFat);
  const bfStatus=!bfNum?"":bfNum<10?"Essential fat":bfNum<20?"Athletic":bfNum<25?"Fitness":bfNum<30?"Average":"Above average";
  const w1=weeklyData[1],heightIn=w1?.bodyComp?.height||70;
  const latestWeight=parseFloat(Object.values(wd.weightLog||{}).map((e: any)=>e.am).filter(Boolean).pop()||0);
  const bmi=latestWeight?(latestWeight/Math.pow(heightIn/39.37,2)).toFixed(1):null;
  return(
    <div className="page">
      <div className="page-title">Body Composition</div>
      <div className="page-sub">Week {weekNum} · Track fat types BMI and measurements</div>
      <div className="slabel">Body Fat and Composition</div>
      <div className="card">
        <div className="card-body">
          <div className="bcomp-grid">
            {[{k:"bodyFat",l:"Body Fat %",u:"%",r:"Athletic: 14-20% M / 20-27% F"},{k:"subcutaneous",l:"Subcutaneous Fat",u:"%",r:"Fat under skin, visible"},{k:"visceral",l:"Visceral Fat",u:"level",r:"Internal organ fat, aim under 12"},{k:"height",l:"Height",u:"inches",r:"Used for BMI"}].map(f=>(
              <div key={f.k} className="bcomp-box">
                <div className="bcomp-lbl">{f.l}</div>
                <input type="number" placeholder="0" value={bc[f.k]||""} onChange={e=>updBc(f.k,e.target.value)} step="0.1"/>
                <div className="bcomp-unit">{f.u}</div>
                <div className="bcomp-range">{f.r}</div>
              </div>
            ))}
          </div>
          {(bfNum||bmi)&&<div style={{marginTop:14,background:"var(--surface2)",borderRadius:"var(--radius-sm)",padding:"12px 14px"}}>
            {bfNum>0&&<div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:16,fontWeight:600}}>Body Fat</span>
                <span style={{fontSize:16,color:"var(--green)",fontWeight:700}}>{bfNum}% {bfStatus}</span>
              </div>
              <div className="prog-wrap"><div className="prog-fill" style={{width:Math.min(100,bfNum*2)+"%",background:bfNum<20?"var(--green)":bfNum<30?"var(--yellow)":"var(--red)"}}/></div>
            </div>}
            {bmi&&<div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:16,fontWeight:600}}>BMI</span>
                <span style={{fontSize:16,color:(parseFloat(bmi)||0)<25?"var(--green)":(parseFloat(bmi)||0)<30?"var(--yellow)":"var(--red)",fontWeight:700}}>{bmi} {(parseFloat(bmi)||0)<18.5?"Underweight":(parseFloat(bmi)||0)<25?"Normal":(parseFloat(bmi)||0)<30?"Overweight":"Obese"}</span>
              </div>
              <div className="prog-wrap"><div className="prog-fill" style={{width:Math.min(100,((parseFloat(bmi)||0)/40)*100)+"%",background:(parseFloat(bmi)||0)<25?"var(--green)":(parseFloat(bmi)||0)<30?"var(--yellow)":"var(--red)"}}/></div>
            </div>}
          </div>}
        </div>
      </div>
      <div className="slabel">Body Measurements</div>
      <div className="card">
        <div className="card-body">
          <div className="meas-grid">
            {[{k:"chest",l:"Chest"},{k:"waist",l:"Waist"},{k:"hips",l:"Hips"},{k:"thigh",l:"Thigh L"},{k:"armL",l:"Arm L"},{k:"armR",l:"Arm R"}].map(f=>(
              <div key={f.k} className="meas-box">
                <div className="meas-lbl">{f.l}</div>
                <input type="number" placeholder="0" value={meas[f.k]||""} onChange={e=>updMeas(f.k,e.target.value)} step="0.1"/>
                <div style={{fontSize:10,color:"var(--muted)"}}>inches</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TIME IN APP TAB ──────────────────────────────────────────────────────────
function TimeInAppTab({timeStats, authUser}: {timeStats: Record<string, any>, authUser: any}) {
  const entries = Object.entries(timeStats).sort((a,b)=>b[0].localeCompare(a[0]));
  const totalAllTime = entries.reduce((sum, [, d]: any) => sum + (d.totalMinutes || 0), 0);
  const last7 = entries.slice(0, 7);
  const avgLast7 = last7.length > 0
    ? last7.reduce((sum, [, d]: any) => sum + (d.totalMinutes || 0), 0) / last7.length
    : 0;

  // Aggregate tab breakdown across all time
  const allTabs: Record<string, number> = {};
  entries.forEach(([, d]: any) => {
    Object.entries(d.tabBreakdown || {}).forEach(([tab, mins]: any) => {
      allTabs[tab] = (allTabs[tab] || 0) + mins;
    });
  });
  const tabEntries = Object.entries(allTabs).sort((a,b)=>b[1]-a[1]);
  const tabLabels: Record<string,string> = {home:"🏠 Home",meals:"🍽 Meals",train:"🏋️ Train",track:"📊 Track",body:"⚖️ Body",german:"🇩🇪 Deutsch",more:"⚙️ More"};

  const fmtMins = (m: number) => {
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };

  if(authUser?.guest) {
    return (
      <div style={{textAlign:"center",padding:"48px 24px"}}>
        <Clock size={40} color="var(--muted)" style={{margin:"0 auto 16px"}} />
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}}>Create an Account</div>
        <div style={{fontSize:16,color:"var(--muted)",lineHeight:1.6}}>Time tracking requires a free account so your data is synced across devices. Log in or sign up to unlock this feature.</div>
      </div>
    );
  }

  if(entries.length === 0) {
    return (
      <div style={{textAlign:"center",padding:"48px 24px"}}>
        <Clock size={40} color="var(--muted)" style={{margin:"0 auto 16px"}} />
        <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}}>No Sessions Yet</div>
        <div style={{fontSize:16,color:"var(--muted)",lineHeight:1.6}}>Your time in the app is tracked automatically. Come back after using the app a bit and your stats will appear here.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="slabel">Time Overview</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {label:"Total Time",value:fmtMins(totalAllTime),icon:"⏱",color:"var(--red)"},
          {label:"Avg / Day",value:fmtMins(avgLast7),icon:"📅",color:"var(--yellow)"},
          {label:"Days Active",value:String(entries.length),icon:"📆",color:"var(--green)"},
          {label:"Sessions",value:String(entries.reduce((s,[,d]:any)=>s+(d.sessions||1),0)),icon:"🔁",color:"var(--blue)"},
        ].map((stat,i)=>(
          <div key={i} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px 14px"}}>
            <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:4}}>{stat.icon} {stat.label}</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:36,fontWeight:800,color:stat.color,letterSpacing:-0.5,lineHeight:1}}>{stat.value}</div>
          </div>
        ))}
      </div>

      {tabEntries.length > 0 && (
        <>
          <div className="slabel">Time by Section</div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-body">
              {tabEntries.map(([tab, mins]: any, i) => {
                const pct = totalAllTime > 0 ? (mins / totalAllTime) * 100 : 0;
                return (
                  <div key={tab} style={{marginBottom: i < tabEntries.length-1 ? 14 : 0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{tabLabels[tab] || tab}</span>
                      <span style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{fmtMins(mins)} · {Math.round(pct)}%</span>
                    </div>
                    <div className="prog-wrap">
                      <div className="prog-fill" style={{width:`${pct}%`,background:"var(--red)"}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="slabel">Daily History (Last 14 Days)</div>
      <div className="card">
        <div className="card-body">
          {entries.slice(0,14).map(([date, d]: any) => (
            <div key={date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{date}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{d.sessions || 1} session{(d.sessions||1)>1?"s":""}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800,color:"var(--red)",letterSpacing:-0.5}}>{fmtMins(d.totalMinutes||0)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APPLE WATCH / HEALTH SYNC TAB ───────────────────────────────────────────
function AppleWatchTab({accessToken, authUser, healthData}: {accessToken: string|null, authUser: any, healthData: Record<string,any>}) {
  const [copied, setCopied] = useState(false);
  const entries = Object.entries(healthData).sort((a,b)=>b[0].localeCompare(a[0]));

  const today = new Date().toISOString().split("T")[0];
  const todayData = healthData[today];

  const sampleBody = JSON.stringify({
    steps: 8500,
    heartRate: 72,
    activeMinutes: 45,
    workoutType: "Strength",
    caloriesBurned: 420,
    date: today,
  }, null, 2);

  const copyToken = () => {
    if(accessToken) { navigator.clipboard.writeText(accessToken); setCopied(true); setTimeout(()=>setCopied(false), 2000); }
  };

  if(authUser?.guest) {
    return (
      <div style={{textAlign:"center",padding:"48px 24px"}}>
        <Watch size={40} color="var(--muted)" style={{margin:"0 auto 16px"}} />
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:8}}>Sign In Required</div>
        <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>Apple Watch integration requires an account to securely sync your health data.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"20px 18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,width:4,bottom:0,background:"var(--red)"}}/>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:4,textTransform:"uppercase",letterSpacing:-0.3}}>⌚ Apple Watch Sync</div>
        <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>Push health data from your Apple Watch via Apple Shortcuts. No app needed — just a Shortcut that runs automatically after workouts.</div>
      </div>

      {todayData && (
        <>
          <div className="slabel">Today's Health Data</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[
              {label:"Steps",value:todayData.steps?.toLocaleString()||"—",icon:"👟",color:"var(--green)"},
              {label:"Heart Rate",value:todayData.heartRate?`${todayData.heartRate} bpm`:"—",icon:"❤️",color:"var(--red)"},
              {label:"Active Min",value:todayData.activeMinutes?`${todayData.activeMinutes}m`:"—",icon:"🏃",color:"var(--yellow)"},
              {label:"Cal Burned",value:todayData.caloriesBurned?`${todayData.caloriesBurned}`:"—",icon:"🔥",color:"var(--blue)"},
            ].map((s,i)=>(
              <div key={i} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 12px"}}>
                <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:4}}>{s.icon} {s.label}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:s.color,letterSpacing:-0.5}}>{s.value}</div>
              </div>
            ))}
          </div>
          {todayData.workoutType && (
            <div style={{background:"var(--green-lt)",border:"1px solid var(--green)",borderRadius:"var(--radius-sm)",padding:"10px 14px",marginBottom:16,fontSize:12,fontWeight:700,color:"var(--green)"}}>
              🏋️ Workout: {todayData.workoutType} · Synced from {todayData.source || "Apple Watch"} at {todayData.syncedAt ? new Date(todayData.syncedAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "—"}
            </div>
          )}
        </>
      )}

      <div className="slabel">Setup Guide</div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-body">
          {[
            {n:1,title:"Open Shortcuts on iPhone",desc:"Go to the Shortcuts app → tap + to create a new Shortcut."},
            {n:2,title:"Add a 'Get Contents of URL' action",desc:"Set Method to POST and URL to the endpoint below."},
            {n:3,title:"Set Authorization Header",desc:"Add a header: Authorization = Bearer [your token]"},
            {n:4,title:"Set JSON body",desc:"Add body as JSON with: steps, heartRate, activeMinutes, workoutType, caloriesBurned, date"},
            {n:5,title:"Automate it",desc:"In Automations, trigger after Apple Watch workout ends — fully hands-free sync!"},
          ].map((step,i)=>(
            <div key={step.n} className="prep-step" style={{paddingTop: i===0?0:16}}>
              <div className="prep-num">{step.n}</div>
              <div>
                <div className="prep-title">{step.title}</div>
                <div className="prep-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slabel">Endpoint URL</div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginBottom:16,fontFamily:"monospace",fontSize:11,color:"var(--yellow)",wordBreak:"break-all",lineHeight:1.6}}>
        POST https://{projectId}.supabase.co/functions/v1/make-server-c1c566ee/health-sync
      </div>

      <div className="slabel">Sample JSON Body</div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginBottom:16,fontFamily:"monospace",fontSize:11,color:"var(--green)",whiteSpace:"pre",lineHeight:1.6,overflowX:"auto"}}>
        {sampleBody}
      </div>

      <div className="slabel">Your Auth Token</div>
      <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginBottom:4,fontSize:11,color:"var(--muted)",wordBreak:"break-all",fontFamily:"monospace",lineHeight:1.5}}>
        {accessToken ? `${accessToken.substring(0, 40)}...` : "No token — please sign in"}
      </div>
      <button onClick={copyToken} style={{width:"100%",background:copied?"var(--green)":"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"10px",fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:800,color:copied?"#fff":"var(--muted)",cursor:"pointer",textTransform:"uppercase",letterSpacing:1,marginBottom:16,transition:"all 0.15s"}}>
        {copied ? "✓ Copied!" : "Copy Token for Shortcuts"}
      </button>

      {entries.length > 0 && (
        <>
          <div className="slabel">Sync History</div>
          <div className="card">
            <div className="card-body">
              {entries.slice(0,7).map(([date,d]:any)=>(
                <div key={date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{date}</div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{d.workoutType||"Health data"} · {d.source||"external"}</div>
                  </div>
                  <div style={{fontSize:11,color:"var(--green)",fontWeight:700}}>{d.steps?.toLocaleString()||"—"} steps</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function More({up,weekNum,weeklyData,updateProfile,authUser,timeStats,healthData,accessToken,onLogout}: any) {
  const [sub,setSub]=useState("profile");
  const goal=up?.goal||"cut";
  const [form,setForm]=useState({age:up?.stats?.age||"",weight:up?.stats?.weight||"",heightFt:up?.stats?.heightFt||"",heightIn:up?.stats?.heightIn||"",sex:up?.sex||"male",activity:up?.activity||"moderate",goal:up?.goal||"cut"});
  const [profile,setProfile]=useState({name:up?.profile?.name||"",email:up?.profile?.email||"",phone:up?.profile?.phone||"",location:up?.profile?.location||""});
  const tdee=calcTDEE({age:form.age,weight:form.weight,heightFt:form.heightFt,heightIn:form.heightIn},form.activity,form.sex);
  const adj=form.goal==="bulk"?tdee+350:form.goal==="cut"?tdee-450:tdee-100;
  const protein=Math.round((parseFloat(form.weight as any)||175)*1.0),fat=Math.round(adj*0.25/9),carbs=Math.round((adj-protein*4-fat*9)/4);
  let totalBeh=0,totalSex=0,allWeights: number[]=[];
  for(let w=1;w<=4;w++){const wd=weeklyData[w];if(!wd)continue;const b=wd.behaviors||{};totalBeh+=Object.values(b).reduce((a: any,x: any)=>a+(x||0),0);totalSex+=Object.values(wd.sexLog||{}).filter(Boolean).length;allWeights.push(...Object.values(wd.weightLog||{}).map((e: any)=>parseFloat(e.am)).filter(Boolean));}
  const weightChange=allWeights.length>1?(allWeights[allWeights.length-1]-allWeights[0]).toFixed(1):"--";
  const behScore=Math.max(0,100-totalBeh*5);
  const grade=behScore>=90?"A":behScore>=75?"B":behScore>=60?"C":"D";
  return(
    <div className="page">
      <div className="page-title">More</div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {[{id:"profile",l:"Profile"},{id:"monthly",l:"Monthly"},{id:"time",l:"⏱ Time"},{id:"watch",l:"⌚ Watch"},{id:"calc",l:"Calculator"},{id:"prep",l:"Meal Prep"}].map(s=>(
          <button key={s.id} className={`wtab${sub===s.id?" active":""}`} onClick={()=>setSub(s.id)}>{s.l}</button>
        ))}
      </div>
      {sub==="profile"&&<div>
        <div className="slabel">Personal Information</div>
        <div className="card">
          <div className="card-body">
            <div className="calc-input">
              <div className="calc-lbl">Full Name</div>
              <input type="text" placeholder="Enter your name" value={profile.name} onChange={e=>{setProfile(p=>({...p,name:e.target.value}));updateProfile({...up,profile:{...profile,name:e.target.value}});}}/>
            </div>
            <div className="calc-input">
              <div className="calc-lbl">Email</div>
              <input type="email" placeholder="your@email.com" value={profile.email} onChange={e=>{setProfile(p=>({...p,email:e.target.value}));updateProfile({...up,profile:{...profile,email:e.target.value}});}}/>
            </div>
            <div className="calc-input">
              <div className="calc-lbl">Phone</div>
              <input type="tel" placeholder="+1 (555) 123-4567" value={profile.phone} onChange={e=>{setProfile(p=>({...p,phone:e.target.value}));updateProfile({...up,profile:{...profile,phone:e.target.value}});}}/>
            </div>
            <div className="calc-input">
              <div className="calc-lbl">Location</div>
              <input type="text" placeholder="City, State" value={profile.location} onChange={e=>{setProfile(p=>({...p,location:e.target.value}));updateProfile({...up,profile:{...profile,location:e.target.value}});}}/>
            </div>
          </div>
        </div>
        {authUser && !authUser.guest && (
          <div className="card" style={{marginBottom:16}}>
            <div className="card-body">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>🔐 Logged in as</div>
                  <div style={{fontSize:14,fontWeight:700}}>{authUser.name}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>{authUser.email}</div>
                </div>
                <button onClick={onLogout} style={{background:"var(--red-lt)",border:"1px solid var(--red)",borderRadius:"var(--radius-sm)",padding:"8px 14px",fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:800,color:"var(--red)",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.5px"}}>Log Out</button>
              </div>
            </div>
          </div>
        )}
        <div className="slabel">Stats Summary</div>
        <div className="card">
          <div className="card-body">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {label:"Age",value:up?.stats?.age||"--",icon:"🎂"},
                {label:"Weight",value:(up?.stats?.weight||"--")+" lbs",icon:"⚖️"},
                {label:"Height",value:up?.stats?.heightFt?`${up.stats.heightFt}'${up.stats.heightIn||0}"`:"--",icon:"📏"},
                {label:"Sex",value:up?.sex==="male"?"Male":up?.sex==="nonbinary"?"Non-Binary":"Female",icon:"👤"},
                {label:"Activity",value:up?.activity||"--",icon:"🏃"},
                {label:"Goal",value:GOAL_LABELS[up?.goal]||"--",icon:"🎯"},
              ].map((item,i)=>(
                <div key={i} style={{padding:"12px",background:"var(--surface2)",borderRadius:"var(--radius-sm)"}}>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{item.icon} {item.label}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>}
      {sub==="monthly"&&<div>
        <div className="report-band">
          <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
            <div className="report-grade">{grade}</div>
            <div>
              <div style={{fontSize:11,opacity:0.6,marginBottom:4}}>MONTH GRADE</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>Month Complete</div>
              <div style={{fontSize:12,opacity:0.7}}>Behavior score {behScore}/100</div>
            </div>
          </div>
          {[{l:"Weight change",v:weightChange!=="--"?((parseFloat(weightChange)||0)>0?"+":"")+weightChange+" lbs":weightChange},{l:"Bad behaviors",v:totalBeh+" total"},{l:"Sexual activity",v:totalSex+" times logged"}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.1)":"none"}}>
              <span style={{fontSize:12,opacity:0.6}}>{r.l}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#a8e063"}}>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="slabel">Analysis</div>
        <div className="card">
          <div className="card-body">
            {[
              {icon:<BarChart2 size={24} color="#DDA15E" />,title:"Weight Trend",desc:weightChange!=="--"?`You ${(parseFloat(weightChange)||0)>0?"gained":"lost"} ${Math.abs(parseFloat(weightChange)||0)} lbs this month.`:"Keep logging daily weights to see trend."},
              {icon:<Activity size={24} color="#BC6C25" />,title:"Behavior Impact",desc:totalBeh===0?"Zero bad behaviors. Elite discipline.":totalBeh<5?"Minor behaviors, minimal impact.":totalBeh<10?"Moderate behaviors affecting recovery.":"High behavior count. Prioritize sleep and nutrition."},
              {icon:<Brain size={24} color="#606C38" />,title:"Next Month Focus",desc:behScore>=90?"Maintain consistency and consider increasing training intensity.":"Reduce bad behaviors first. They directly impact your results."},
            ].map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                <span style={{color:"var(--muted)"}}>{tip.icon}</span>
                <div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{tip.title}</div><div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{tip.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {sub==="time"&&<TimeInAppTab timeStats={timeStats} authUser={authUser} />}
      {sub==="watch"&&<AppleWatchTab accessToken={accessToken} authUser={authUser} healthData={healthData} />}

      {sub==="calc"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:0}}>
          {[{l:"Age",k:"age",ph:"28"},{l:"Weight lbs",k:"weight",ph:"175"},{l:"Height ft",k:"heightFt",ph:"5"},{l:"Height in",k:"heightIn",ph:"10"}].map(f=>(
            <div key={f.k} className="calc-input">
              <div className="calc-lbl">{f.l}</div>
              <input type="number" placeholder={f.ph} value={(form as any)[f.k]} onChange={e=>setForm((f2: any)=>({...f2,[f.k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        {[{l:"Sex",k:"sex",opts:[["male","Male"],["female","Female"],["nonbinary","Non-Binary"]]},{l:"Activity",k:"activity",opts:[["sedentary","Sedentary"],["light","Light"],["moderate","Moderate"],["very","Very Active"]]},{l:"Goal",k:"goal",opts:[["bulk","Build Muscle"],["recomp","Recomp"],["cut","Lose Fat"]]}].map(f=>(
          <div key={f.k} className="calc-input">
            <div className="calc-lbl">{f.l}</div>
            <select value={(form as any)[f.k]} onChange={e=>setForm((f2: any)=>({...f2,[f.k]:e.target.value}))}>
              {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
        <div className="result-band">
          {[{v:adj,n:"Calories"},{v:protein+"g",n:"Protein"},{v:carbs+"g",n:"Carbs"},{v:fat+"g",n:"Fat"}].map(r=>(
            <div key={r.n}><div className="rb-val">{r.v}</div><div className="rb-name">{r.n}</div></div>
          ))}
        </div>
      </div>}
      {sub==="prep"&&<div>
        <div style={{background:"var(--surface2)",border:"1px solid var(--green)",borderRadius:"var(--radius)",padding:"24px 20px",textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:12}}>🥡</div>
          <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:6}}>Meal Prep & Grocery List</div>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:16}}>Full meal prep guide, step-by-step instructions, and a checkable grocery list have been moved to the Meals tab for easier access while you shop and cook.</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {[["💰 Budget Mode","Budget plan with 2 repeatable meals"],["🛒 Grocery List","Checkable list by aisle"],["⏱ Prep Steps","30-min Sunday prep guide"]].map(([label,desc],i)=>(
              <div key={i} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"10px 12px",textAlign:"left",flex:"1 1 140px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:3}}>{label}</div>
                <div style={{fontSize:10,color:"var(--muted)"}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center"}}>Go to <strong style={{color:"var(--green)"}}>Meals tab → 🥡 Meal Prep</strong> to access everything</div>
      </div>}
    </div>
  );
}


const GERMAN_WORDS: Record<number, any[]> = {
  1:[
    {de:"der Muskel",en:"the muscle",tip:"Mein Muskel wächst. (My muscle is growing.)"},
    {de:"der Körper",en:"the body",tip:"Mein Körper ist stark. (My body is strong.)"},
    {de:"das Training",en:"the workout",tip:"Das Training war hart. (The workout was hard.)"},
    {de:"die Kraft",en:"the strength",tip:"Ich habe viel Kraft. (I have a lot of strength.)"},
    {de:"die Übung",en:"the exercise",tip:"Die Übung ist schwer. (The exercise is hard.)"},
    {de:"gesund",en:"healthy",tip:"Ich lebe gesund. (I live healthily.)"},
    {de:"stark",en:"strong",tip:"Ich bin stark. (I am strong.)"},
  ],
  2:[
    {de:"das Eiweiß",en:"protein",tip:"Ich esse viel Eiweiß. (I eat a lot of protein.)"},
    {de:"die Kalorien",en:"calories",tip:"Wie viele Kalorien? (How many calories?)"},
    {de:"das Hähnchen",en:"chicken",tip:"Ich koche Hähnchen. (I am cooking chicken.)"},
    {de:"der Reis",en:"rice",tip:"Ich esse Reis. (I eat rice.)"},
    {de:"das Gemüse",en:"vegetables",tip:"Gemüse ist gesund. (Vegetables are healthy.)"},
    {de:"essen",en:"to eat",tip:"Ich esse jeden Tag gut. (I eat well every day.)"},
    {de:"trinken",en:"to drink",tip:"Ich trinke viel Wasser. (I drink a lot of water.)"},
  ],
  3:[
    {de:"der Morgen",en:"the morning",tip:"Ich trainiere am Morgen. (I train in the morning.)"},
    {de:"jeden Tag",en:"every day",tip:"Ich lerne jeden Tag Deutsch. (I learn German every day.)"},
    {de:"die Woche",en:"the week",tip:"Diese Woche ist gut. (This week is good.)"},
    {de:"schlafen",en:"to sleep",tip:"Ich schlafe acht Stunden. (I sleep eight hours.)"},
    {de:"der Fortschritt",en:"progress",tip:"Ich sehe meinen Fortschritt. (I see my progress.)"},
    {de:"früh",en:"early",tip:"Ich stehe früh auf. (I wake up early.)"},
    {de:"müde",en:"tired",tip:"Ich bin nicht müde. (I am not tired.)"},
  ],
  4:[
    {de:"das Gewicht",en:"weight",tip:"Mein Gewicht sinkt. (My weight is dropping.)"},
    {de:"abnehmen",en:"to lose weight",tip:"Ich möchte abnehmen. (I want to lose weight.)"},
    {de:"zunehmen",en:"to gain mass",tip:"Ich möchte zunehmen. (I want to gain mass.)"},
    {de:"das Ziel",en:"the goal",tip:"Mein Ziel ist klar. (My goal is clear.)"},
    {de:"weiter",en:"keep going",tip:"Mach weiter! (Keep going!)"},
    {de:"die Verbesserung",en:"improvement",tip:"Ich sehe eine Verbesserung. (I see improvement.)"},
    {de:"mehr",en:"more",tip:"Ich will mehr lernen. (I want to learn more.)"},
  ],
};

const DAILY_TIPS = [
  "Read it out loud 3 times before logging",
  "Write it on a sticky note somewhere visible",
  "Use it in one sentence out loud before bed",
  "Use yesterday's word and today's in one sentence",
  "Close your eyes and recall yesterday's word first",
  "Change your phone lock screen to today's word",
  "Make a rhyme or short song with the word",
];

function GermanTab({weekNum,weeklyData,setWeeklyData}: any) {
  const [showAll,setShowAll]=useState(false);
  const [inputVal,setInputVal]=useState("");
  const wd=weeklyData[weekNum]||{};
  const germanLog=wd.germanLog||{};
  const dayMap=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const today=dayMap[new Date().getDay()];
  const wordBank=GERMAN_WORDS[Math.min(weekNum,4)];
  const todayWordIdx=(new Date().getDate()-1)%wordBank.length;
  const todayWord=wordBank[todayWordIdx];
  const dailyTip=DAILY_TIPS[new Date().getDate()%DAILY_TIPS.length];
  const DAYS_FULL=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // Fixed IIFE by separating declaration
  let streak = 0;
  for(let w=weekNum;w>=1;w--){
    const wlog=weeklyData[w]?.germanLog||{};
    for(const d of DAYS_FULL){if(wlog[d]?.done)streak++;}
  }

  const doneThisWeek=Object.values(germanLog).filter((d: any)=>d?.done).length;
  const todayDone=germanLog[today]?.done||false;
  const todayWritten=germanLog[today]?.written||"";

  const toggleDone=(day: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],germanLog:{...(d[weekNum]?.germanLog||{}),[day]:{...(d[weekNum]?.germanLog?.[day]||{}),done:!d[weekNum]?.germanLog?.[day]?.done}}}}));
  const saveWritten=(day: string,val: string)=>setWeeklyData((d: any)=>({...d,[weekNum]:{...d[weekNum],germanLog:{...(d[weekNum]?.germanLog||{}),[day]:{...(d[weekNum]?.germanLog?.[day]||{}),written:val}}}}));

  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
        <div>
          <div className="page-title">🇩🇪 Deutsch</div>
          <div className="page-sub">20 min/day · Week {weekNum} · {doneThisWeek}/7 days done</div>
        </div>
        <div style={{textAlign:"center",background:"var(--green)",borderRadius:12,padding:"10px 14px"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#fff",lineHeight:1}}>{streak}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>streak</div>
        </div>
      </div>

      <div style={{background:"var(--surface2)",borderRadius:"var(--radius)",padding:20,marginBottom:12,border:"1px solid var(--border)"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>Wort des Tages — Day {todayWordIdx+1}</div>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:36,fontWeight:800,color:"var(--cream)",marginBottom:4}}>{todayWord.de}</div>
        <div style={{fontSize:16,color:"var(--muted)",marginBottom:14}}>{todayWord.en}</div>
        <div style={{background:"rgba(40, 54, 24, 0.5)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px",fontSize:12,color:"var(--cream)",lineHeight:1.6}}>💬 {todayWord.tip}</div>
      </div>

      <div className="slabel">Daily Practice</div>
      <div className="card">
        <div className="card-body">
          <div style={{fontSize:12,color:"var(--muted)",marginBottom:12,lineHeight:1.5,fontStyle:"italic"}}>{dailyTip}</div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Write today's word or a sentence in German</div>
          <textarea
            placeholder={"Try using " + todayWord.de.split(" ").pop() + " in a sentence..."}
            value={todayWritten||inputVal}
            onChange={e=>{setInputVal(e.target.value);saveWritten(today,e.target.value);}}
            style={{width:"100%",minHeight:80,background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"10px 12px",fontFamily:"'Outfit',sans-serif",fontSize:14,color:"var(--text)",resize:"none",outline:"none",lineHeight:1.5,marginBottom:12}}
          />
          <button
            onClick={()=>toggleDone(today)}
            style={{width:"100%",padding:13,background:todayDone?"var(--green)":"var(--surface2)",border:"2px solid "+(todayDone?"var(--green)":"var(--border)"),borderRadius:"var(--radius-sm)",fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:800,color:todayDone?"#fff":"var(--muted)",cursor:"pointer",transition:"all 0.15s"}}
          >
            {todayDone?"✓ 20 Minutes Done — Ausgezeichnet!":"Mark 20 Min Complete"}
          </button>
        </div>
      </div>

      <div className="slabel">This Week</div>
      <div className="card">
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:12}}>
            {DAYS_FULL.map(d=>{
              const done=germanLog[d]?.done;
              const written=germanLog[d]?.written;
              const isToday=d===today;
              return(
                <div key={d} style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,marginBottom:4}}>{d}</div>
                  <div onClick={()=>toggleDone(d)} style={{width:36,height:36,borderRadius:"50%",margin:"0 auto",border:isToday?"2px solid var(--green)":"2px solid var(--border)",background:done?"var(--green)":"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",color:done?"#fff":"var(--muted)"}}>
                    {done?"✓":written?"✏️":""}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:11,color:"var(--muted)",textAlign:"center"}}>
            {doneThisWeek===7?"🔥 Perfekte Woche! (Perfect week!)":doneThisWeek>=5?"💪 "+doneThisWeek+"/7 — Sehr gut! (Very good!)":doneThisWeek>=3?"📈 "+doneThisWeek+"/7 — Gut gemacht! (Good job!)":"🎯 "+doneThisWeek+"/7 — Mach weiter! (Keep going!)"}
          </div>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:20,marginBottom:10}}>
        <div className="slabel" style={{margin:0}}>Week {weekNum} Word Bank</div>
        <button onClick={()=>setShowAll(a=>!a)} style={{background:"none",border:"none",fontSize:12,color:"var(--green)",fontWeight:700,cursor:"pointer"}}>{showAll?"Hide":"Show all"}</button>
      </div>
      {showAll&&<div className="card">
        <div className="card-body">
          {wordBank.map((w,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:i<wordBank.length-1?"1px solid var(--border)":"none"}}>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:800,marginBottom:2}}>{w.de}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>{w.tip}</div>
              </div>
              <div style={{fontSize:12,color:"var(--green)",fontWeight:700,flexShrink:0,marginLeft:12,marginTop:2}}>{w.en}</div>
            </div>
          ))}
        </div>
      </div>}

      <div className="slabel">Why 20 Min Daily Works</div>
      <div className="card">
        <div className="card-body">
          {[
            {icon:"🧠",title:"Spaced Repetition",desc:"20 min daily beats 2 hours once a week. Your brain consolidates language during sleep — every night your German gets stronger."},
            {icon:"🏋️",title:"Same Rule as Training",desc:"Consistency over intensity. You wouldn't skip 6 gym days and do one 3-hour session. Same principle here."},
            {icon:"📅",title:"At 90 Days",desc:"If you keep the streak, you will know 180+ words, basic sentence structure, and be able to introduce yourself fully in German."},
          ].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
              <span style={{fontSize:20,flexShrink:0}}>{t.icon}</span>
              <div><div style={{fontSize:16,fontWeight:700,marginBottom:3}}>{t.title}</div><div style={{fontSize:16,color:"var(--muted)",lineHeight:1.5}}>{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [weekNum, setWeekNum] = useState(1);
  const [weeklyData, setWeeklyData] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [foodLog, setFoodLog] = useState<any[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<any[]>([]);
  const [savings, setSavings] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<"idle"|"syncing"|"saved"|"error">("idle");
  const [timeStats, setTimeStats] = useState<Record<string, any>>({});
  const [healthData, setHealthData] = useState<Record<string, any>>({});
  const syncTimerRef = useRef<any>(null);

  // Time tracking refs
  const tabStartRef = useRef<number>(Date.now());
  const tabBreakdownRef = useRef<Record<string, number>>({});
  const sessionStartRef = useRef<number>(Date.now());
  const savedMinutesRef = useRef<number>(0);

  // Enable notification scheduler for daily reminders
  useNotificationScheduler();

  // ── Check for existing Supabase session on mount ──────────────────────────
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          setIsCheckingSession(false);
          return;
        }
        
        const session = data?.session;
        if(session) {
          const displayName = session.user?.user_metadata?.name || session.user?.email?.split("@")[0] || "User";
          const user = { email: session.user.email, name: displayName, id: session.user.id };
          setAuthUser(user);
          setAccessToken(session.access_token);
          setShowLogin(false);
        }
      } catch (err) {
        console.error("Failed to check session:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Listen for auth changes (handles OAuth redirects from Google/Apple)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if(session) {
        const displayName = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name || session.user?.email?.split("@")[0] || "User";
        const user = { email: session.user.email, name: displayName, id: session.user.id };
        setAuthUser(user);
        setAccessToken(session.access_token);
        setShowLogin(false);
      } else {
        setAccessToken(null);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  // ── Load cloud data after login ───────────────────────────────────────────
  useEffect(() => {
    if(!accessToken || !authUser || authUser.guest) return;
    setSyncStatus("syncing");
    loadAllData(accessToken).then((data: any) => {
      if(data.profile) setUserProfile(data.profile);
      if(data.weeklyData) setWeeklyData(data.weeklyData);
      if(data.foodLog) setFoodLog(data.foodLog);
      if(data.timeStats) setTimeStats(data.timeStats);
      setSyncStatus("saved");
    }).catch((err: any) => {
      console.log("Cloud load error:", err);
      setSyncStatus("error");
    });
    // Also load health sync data
    getHealthSync(accessToken).then((d: any) => {
      if(d.healthData) setHealthData(d.healthData);
    }).catch(() => {});
  }, [accessToken, authUser?.id]);

  // ── Debounced cloud save ───────────────────────────────────────────────────
  const triggerSave = useCallback((key: string, value: any) => {
    if(!accessToken || authUser?.guest) return;
    if(syncTimerRef.current) clearTimeout(syncTimerRef.current);
    setSyncStatus("syncing");
    syncTimerRef.current = setTimeout(async () => {
      try {
        await saveData(key, value, accessToken);
        setSyncStatus("saved");
      } catch(err) {
        console.log(`Cloud save error for ${key}:`, err);
        setSyncStatus("error");
      }
    }, 2000);
  }, [accessToken, authUser?.guest]);

  // Watch state changes and sync
  useEffect(() => { if(userProfile && accessToken && !authUser?.guest) triggerSave("profile", userProfile); }, [userProfile]);
  useEffect(() => { if(accessToken && !authUser?.guest && Object.keys(weeklyData).length) triggerSave("weeklyData", weeklyData); }, [weeklyData]);
  useEffect(() => { if(accessToken && !authUser?.guest) triggerSave("foodLog", foodLog); }, [foodLog]);

  // ── Time Tracking ──────────────────────────────────────────────────────────
  // Track tab changes
  useEffect(() => {
    const now = Date.now();
    const elapsed = (now - tabStartRef.current) / 60000;
    const prevTab = Object.keys(tabBreakdownRef.current)[Object.keys(tabBreakdownRef.current).length - 1] || tab;
    tabBreakdownRef.current[prevTab] = (tabBreakdownRef.current[prevTab] ?? 0) + elapsed;
    tabStartRef.current = now;
  }, [tab]);

  const flushTimeTracker = useCallback(async () => {
    if(!accessToken || authUser?.guest) return;
    const now = Date.now();
    const sessionTotalMs = now - sessionStartRef.current;
    const sessionMinutes = sessionTotalMs / 60000;
    const tabElapsedMins = (now - tabStartRef.current) / 60000;
    const breakdown = { ...tabBreakdownRef.current, [tab]: (tabBreakdownRef.current[tab] ?? 0) + tabElapsedMins };
    const newMinutes = sessionMinutes - savedMinutesRef.current;
    if(newMinutes < 0.5) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      await logTimeSession(today, Math.round(newMinutes * 10) / 10, breakdown, accessToken);
      savedMinutesRef.current = sessionMinutes;
      tabBreakdownRef.current = {};
      tabStartRef.current = now;
      // Refresh time stats
      getTimeStats(accessToken).then((d: any) => { if(d.timeStats) setTimeStats(d.timeStats); }).catch(() => {});
    } catch(err) { console.log("Time flush error:", err); }
  }, [accessToken, authUser?.guest, tab]);

  // Auto-save time every 5 minutes
  useEffect(() => {
    if(!accessToken || authUser?.guest) return;
    const interval = setInterval(() => flushTimeTracker(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [flushTimeTracker]);

  // Save time on visibility change / unload
  useEffect(() => {
    if(!accessToken || authUser?.guest) return;
    const handleHide = () => flushTimeTracker();
    document.addEventListener("visibilitychange", handleHide);
    window.addEventListener("beforeunload", handleHide);
    return () => {
      document.removeEventListener("visibilitychange", handleHide);
      window.removeEventListener("beforeunload", handleHide);
    };
  }, [flushTimeTracker]);

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = (user: any, token: string) => {
    setAuthUser(user);
    setAccessToken(token || null);
    setShowLogin(false);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await flushTimeTracker();
    await supabase.auth.signOut();
    setAuthUser(null);
    setAccessToken(null);
    setShowLogin(true);
    setUserProfile(null);
    setWeeklyData({});
    setFoodLog([]);
    setTimeStats({});
    setHealthData({});
    setSyncStatus("idle");
    sessionStartRef.current = Date.now();
    savedMinutesRef.current = 0;
    tabBreakdownRef.current = {};
  };

  // Show loading screen while checking for session
  if (isCheckingSession) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)",color:"var(--text)"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#fff",letterSpacing:-2,textTransform:"uppercase",marginBottom:12}}>
              BRUHH<span style={{color:"var(--red)"}}>H</span>
            </div>
            <div style={{fontSize:13,color:"var(--muted)",fontWeight:500}}>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (showLogin) {
    return (
      <>
        <style>{CSS}</style>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <style>{CSS}</style>
        <Quiz onComplete={(profile: any) => {
          setUserProfile(profile);
          if(accessToken && !authUser?.guest) saveData("profile", profile, accessToken).catch(() => {});
        }} />
      </>
    );
  }

  // Sync status indicator
  const syncIcon = syncStatus === "syncing" ? (
    <span style={{fontSize:10,color:"var(--muted)"}}>⟳</span>
  ) : syncStatus === "saved" ? (
    <Cloud size={12} color="#6b705c" />
  ) : syncStatus === "error" ? (
    <CloudOff size={12} color="var(--red)" />
  ) : null;

  return (
    <div className="app-shell">
      <style>{CSS}</style>
      <div className="topbar">
        <div className="app-logo">BRUHH<span>H</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {!authUser?.guest && syncIcon && (
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--muted)"}}>
              {syncIcon}
              <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>
                {syncStatus==="syncing"?"Syncing…":syncStatus==="saved"?"Synced":"Sync error"}
              </span>
            </div>
          )}
          {authUser?.guest && (
            <span style={{fontSize:9,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",border:"1px solid var(--border)",padding:"2px 8px",borderRadius:2}}>Guest</span>
          )}
          <div className="user-pill" onClick={()=>setTab("more")}>
            <div className="user-av">{authUser?.name?authUser.name[0].toUpperCase():userProfile.name?userProfile.name[0].toUpperCase():"U"}</div>
            <div className="user-lbl">{authUser?.name?.split(" ")[0]||userProfile.name?.split(" ")[0]||GOAL_LABELS[userProfile.goal]?.split(" ")[0]||"User"}</div>
          </div>
        </div>
      </div>
      <div style={{paddingBottom: 80}}>
        {tab==="home" && <Home up={userProfile} weekNum={weekNum} weeklyData={weeklyData} setTab={setTab} foodLog={foodLog} />}
        {tab==="meals" && <Meals up={userProfile} weekNum={weekNum} weeklyData={weeklyData} foodLog={foodLog} setFoodLog={setFoodLog} />}
        {tab==="train" && <Train up={userProfile} weekNum={weekNum} setWeekNum={setWeekNum} progressPhotos={progressPhotos} setProgressPhotos={setProgressPhotos} weeklyData={weeklyData} setTab={setTab} />}
        {tab==="track" && <Track weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData} savings={savings} setSavings={setSavings} up={userProfile} />}
        {tab==="body" && <Body weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData} />}
        {tab==="more" && <More up={userProfile} weekNum={weekNum} weeklyData={weeklyData} updateProfile={setUserProfile} authUser={authUser} timeStats={timeStats} healthData={healthData} accessToken={accessToken} onLogout={handleLogout} />}
        {tab==="german" && <GermanTab weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData} />}
      </div>
      <div className="bottom-nav">
        {NAV.map(n=>(
          <button key={n.id} className={`nav-btn${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)}>
            <div className="nav-icon">{n.icon}</div>
            <div className="nav-lbl">{n.lbl}</div>
          </button>
        ))}
      </div>
      <PWAHelper />
    </div>
  );
}
