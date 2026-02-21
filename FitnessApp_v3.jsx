import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
  :root {
    --bg:#f7f7f5;--surface:#fff;--surface2:#f0f0ee;--border:#e4e4e0;
    --text:#1a1a18;--muted:#8a8a84;
    --green:#2d5a27;--green-lt:#e8f0e7;
    --red:#c8440a;--red-lt:#fceee8;
    --blue:#1a4a7a;--blue-lt:#e6edf5;
    --yellow:#f0b429;--yellow-lt:#fef9ec;
    --purple:#6b3fa0;--purple-lt:#f0eaf9;
    --radius:14px;--radius-sm:8px;
    --shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04);
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;}
  .quiz-overlay{position:fixed;inset:0;background:#111;z-index:100;display:flex;flex-direction:column;}
  .quiz-top{padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:16px;}
  .quiz-logo{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;}
  .quiz-logo span{color:#a8e063;}
  .qprog-wrap{flex:1;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;}
  .qprog-fill{height:100%;background:#a8e063;border-radius:2px;transition:width 0.4s ease;}
  .qstep{font-size:12px;color:rgba(255,255,255,0.35);white-space:nowrap;}
  .quiz-body{flex:1;overflow-y:auto;padding:36px 24px 130px;max-width:560px;margin:0 auto;width:100%;}
  .qtag{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#a8e063;margin-bottom:10px;}
  .qtitle{font-family:'Syne',sans-serif;font-size:clamp(24px,6vw,40px);font-weight:800;color:#fff;line-height:1.1;margin-bottom:6px;}
  .qsub{font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:28px;line-height:1.6;}
  .qcards{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;}
  .qcards.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .qcard{background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:16px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;}
  .qcard:hover{border-color:rgba(168,224,99,0.4);}
  .qcard.sel{border-color:#a8e063;background:rgba(168,224,99,0.08);}
  .qcard-icon{font-size:22px;flex-shrink:0;}
  .qcard-label{font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;}
  .qcard.sel .qcard-label{color:#a8e063;}
  .qcard-desc{font-size:11px;color:rgba(255,255,255,0.35);line-height:1.4;}
  .qcard-chk{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.2);margin-left:auto;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;transition:all 0.15s;}
  .qcard.sel .qcard-chk{background:#a8e063;border-color:#a8e063;color:#111;}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px;}
  .si-box{background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:14px;transition:border-color 0.15s;}
  .si-box:focus-within{border-color:#a8e063;}
  .si-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:4px;}
  .si-box input{background:none;border:none;outline:none;font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#fff;width:100%;}
  .si-unit{font-size:10px;color:rgba(255,255,255,0.25);margin-top:2px;}
  .days-row{display:flex;gap:8px;margin-bottom:24px;}
  .dpick{flex:1;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:16px 8px;cursor:pointer;text-align:center;transition:all 0.15s;}
  .dpick.sel{border-color:#a8e063;background:rgba(168,224,99,0.08);}
  .dpick-num{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;display:block;}
  .dpick.sel .dpick-num{color:#a8e063;}
  .dpick-lbl{font-size:9px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
  .diet-tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:24px;}
  .dtag{background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:100px;padding:7px 14px;font-size:12px;color:rgba(255,255,255,0.6);cursor:pointer;transition:all 0.15s;}
  .dtag.sel{background:#a8e063;border-color:#a8e063;color:#111;font-weight:600;}
  .quiz-footer{position:fixed;bottom:0;left:0;right:0;padding:14px 24px 28px;background:linear-gradient(to top,#111 60%,transparent);display:flex;flex-direction:column;align-items:center;gap:8px;}
  .btn-qnext{width:100%;max-width:560px;background:#a8e063;color:#111;border:none;border-radius:10px;padding:15px;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:all 0.15s;}
  .btn-qnext:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(168,224,99,0.3);}
  .btn-qnext:disabled{opacity:0.25;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-qback{background:none;border:none;color:rgba(255,255,255,0.25);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;height:56px;}
  .app-logo{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:var(--text);}
  .app-logo span{color:var(--green);}
  .user-pill{display:flex;align-items:center;gap:7px;border-radius:100px;padding:5px 11px 5px 7px;cursor:pointer;}
  .user-av{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;}
  .user-lbl{font-size:11px;font-weight:600;}
  .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);display:flex;z-index:50;}
  .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;cursor:pointer;border:none;background:none;color:var(--muted);}
  .nav-btn.active{color:var(--green);}
  .nav-icon{font-size:18px;line-height:1;}
  .nav-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;}
  .page{padding:16px 16px 90px;max-width:780px;margin:0 auto;}
  .page-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px;margin-bottom:2px;}
  .page-sub{font-size:12px;color:var(--muted);margin-bottom:20px;}
  .card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow);overflow:hidden;margin-bottom:12px;}
  .card-body{padding:18px;}
  .macro-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;}
  .macro-tile{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 10px;text-align:center;box-shadow:var(--shadow);}
  .macro-val{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;line-height:1;margin-bottom:2px;}
  .macro-name{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:600;}
  .slabel{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:10px;margin-top:20px;}
  .slabel:first-child{margin-top:0;}
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
  .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);}
  .sc-label{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
  .sc-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;line-height:1;margin-bottom:3px;}
  .sc-sub{font-size:11px;color:var(--muted);}
  .prog-wrap{background:var(--surface2);border-radius:4px;height:5px;overflow:hidden;margin-top:8px;}
  .prog-fill{height:100%;border-radius:4px;transition:width 0.5s ease;}
  .meal-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);}
  .meal-row:last-child{border-bottom:none;}
  .meal-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .meal-time{font-size:10px;color:var(--muted);width:46px;flex-shrink:0;font-weight:600;}
  .meal-name{font-size:13px;font-weight:700;flex:1;}
  .meal-desc{font-size:11px;color:var(--muted);}
  .meal-cal{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--green);}
  .meal-pro{font-size:10px;color:var(--blue);font-weight:600;text-align:right;}
  .wd-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:10px;box-shadow:var(--shadow);}
  .wd-hdr{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;cursor:pointer;}
  .wd-hdr:hover{background:var(--bg);}
  .wd-left{display:flex;align-items:center;gap:10px;}
  .day-badge{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 9px;border-radius:5px;}
  .db-push{background:var(--green-lt);color:var(--green);}
  .db-pull{background:var(--blue-lt);color:var(--blue);}
  .db-legs{background:var(--red-lt);color:var(--red);}
  .db-rest{background:var(--surface2);color:var(--muted);}
  .db-cardio{background:var(--yellow-lt);color:#b07d00;}
  .db-full{background:var(--green-lt);color:var(--green);}
  .wd-name{font-size:14px;font-weight:700;}
  .wd-focus{font-size:11px;color:var(--muted);margin-top:1px;}
  .wd-time{font-size:11px;color:var(--muted);font-weight:500;}
  .ex-list{padding:0 16px 14px;border-top:1px solid var(--border);}
  .ex-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
  .ex-row:last-child{border-bottom:none;}
  .ex-chk{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;transition:all 0.15s;}
  .ex-chk.done{background:var(--green);border-color:var(--green);color:#fff;}
  .ex-name{font-size:12px;font-weight:600;flex:1;}
  .ex-sets{font-size:10px;color:var(--muted);}
  .ex-rest{font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;background:var(--surface2);color:var(--muted);}
  .wlog-row{display:grid;grid-template-columns:60px 1fr 1fr 44px;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);align-items:center;}
  .wlog-row:last-child{border-bottom:none;}
  .wlog-day{font-size:11px;font-weight:700;color:var(--muted);}
  .wi-box{background:var(--surface2);border:1px solid var(--border);border-radius:6px;padding:7px 10px;}
  .wi-lbl{font-size:8px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;}
  .wi-box input{background:none;border:none;outline:none;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--text);width:100%;}
  .wdiff{font-size:11px;font-weight:700;text-align:center;}
  .wdiff.up{color:var(--red);}
  .wdiff.dn{color:var(--green);}
  .bcomp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .bcomp-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:13px;}
  .bcomp-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;}
  .bcomp-box input{background:none;border:none;outline:none;font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);width:100%;}
  .bcomp-unit{font-size:10px;color:var(--muted);}
  .bcomp-range{font-size:10px;color:var(--muted);margin-top:3px;}
  .meas-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .meas-box{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;}
  .meas-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
  .meas-box input{background:none;border:none;outline:none;font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--text);width:100%;}
  .behavior-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
  .beh-card{background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:12px;cursor:default;text-align:center;}
  .beh-card.active{border-color:var(--red);background:var(--red-lt);}
  .beh-icon{font-size:24px;margin-bottom:6px;}
  .beh-label{font-size:11px;font-weight:700;margin-bottom:4px;}
  .beh-count{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:var(--red);}
  .beh-controls{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:6px;}
  .beh-btn{width:26px;height:26px;border-radius:50%;border:none;background:var(--border);cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;}
  .beh-btn:hover{background:#ddd;}
  .sex-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
  .sex-day{text-align:center;}
  .sex-day-lbl{font-size:9px;color:var(--muted);font-weight:700;margin-bottom:4px;}
  .sex-dot{width:32px;height:32px;border-radius:50%;border:2px solid var(--border);cursor:pointer;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:14px;background:var(--surface);}
  .sex-dot.logged{background:var(--purple-lt);border-color:var(--purple);}
  .week-tabs{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;}
  .wtab{padding:5px 13px;border-radius:100px;border:1.5px solid var(--border);background:var(--surface);font-size:11px;font-weight:700;cursor:pointer;color:var(--muted);}
  .wtab.active{background:var(--green);border-color:var(--green);color:#fff;}
  .engine-card{background:var(--text);border-radius:var(--radius);padding:20px;margin-bottom:12px;}
  .engine-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:#fff;margin-bottom:4px;}
  .engine-sub{font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px;}
  .engine-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);}
  .engine-row:last-child{border-bottom:none;}
  .engine-label{font-size:12px;color:rgba(255,255,255,0.55);}
  .engine-val{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#a8e063;}
  .report-band{background:linear-gradient(135deg,var(--green) 0%,#1a3d15 100%);border-radius:var(--radius);padding:22px;margin-bottom:12px;color:#fff;}
  .report-grade{font-family:'Syne',sans-serif;font-size:72px;font-weight:800;line-height:1;color:#a8e063;}
  .calc-input{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:8px;}
  .calc-input:focus-within{border-color:var(--green);}
  .calc-lbl{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;}
  .calc-input input,.calc-input select{background:none;border:none;outline:none;font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--text);width:100%;}
  .result-band{background:var(--text);border-radius:var(--radius);padding:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px;}
  .rb-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#a8e063;}
  .rb-name{font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
  .prep-step{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
  .prep-step:last-child{border-bottom:none;}
  .prep-num{width:26px;height:26px;background:var(--green);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;}
  .prep-title{font-size:13px;font-weight:700;margin-bottom:3px;}
  .prep-desc{font-size:12px;color:var(--muted);line-height:1.5;}
  .new-badge{background:var(--yellow);color:#7a5000;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;}
  .btn-gen{display:flex;align-items:center;gap:6px;background:var(--green);color:#fff;border:none;border-radius:var(--radius-sm);padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;}
  .btn-gen:hover{background:#245221;}
  @media(max-width:480px){
    .macro-strip{grid-template-columns:repeat(2,1fr);}
    .result-band{grid-template-columns:1fr 1fr;gap:12px;}
    .behavior-grid{grid-template-columns:1fr 1fr;}
  }
`;

const GOAL_LABELS = {bulk:"Build Muscle",recomp:"Body Recomp",cut:"Lose Fat"};
const GOAL_COLORS = {bulk:"#2d5a27",recomp:"#1a4a7a",cut:"#c8440a"};
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const BASE_PLANS = {
  bulk:{calories:2800,protein:210,carbs:320,fat:70,meals:[
    {time:"7AM",name:"Breakfast",desc:"Oats + Whole Eggs + Banana",cal:620,pro:42,dot:"#2d5a27"},
    {time:"11AM",name:"Lunch",desc:"Ground Turkey + Rice + Broccoli",cal:680,pro:52,dot:"#1a4a7a"},
    {time:"2PM",name:"Pre-Workout",desc:"Greek Yogurt + Oats + Honey",cal:420,pro:28,dot:"#c8440a"},
    {time:"5PM",name:"Post-Workout",desc:"Whey Shake + Banana + Milk",cal:480,pro:50,dot:"#f0b429"},
    {time:"7PM",name:"Dinner",desc:"Chicken Breast + Sweet Potato + Veggies",cal:480,pro:38,dot:"#2d5a27"},
    {time:"9PM",name:"Evening",desc:"Casein Shake + Peanut Butter",cal:320,pro:30,dot:"#8a8a84"},
  ]},
  cut:{calories:1475,protein:160,carbs:127,fat:16,meals:[
    {time:"7AM",name:"Breakfast",desc:"Oats + Vanilla Protein Shake",cal:280,pro:29,dot:"#2d5a27"},
    {time:"12PM",name:"Lunch",desc:"Ground Turkey (3oz) + Rice + Broccoli",cal:340,pro:24,dot:"#1a4a7a"},
    {time:"4PM",name:"Snack",desc:"Protein Shake",cal:140,pro:24,dot:"#f0b429"},
    {time:"7PM",name:"Dinner",desc:"Chicken Breast + Rice + Broccoli",cal:315,pro:27,dot:"#c8440a"},
    {time:"9PM",name:"Evening",desc:"Chocolate Protein Shake",cal:140,pro:24,dot:"#8a8a84"},
  ]},
  recomp:{calories:2100,protein:185,carbs:210,fat:55,meals:[
    {time:"7AM",name:"Breakfast",desc:"Eggs + Oats + Berries",cal:460,pro:42,dot:"#2d5a27"},
    {time:"12PM",name:"Lunch",desc:"Chicken Breast + Brown Rice + Broccoli",cal:590,pro:52,dot:"#1a4a7a"},
    {time:"4PM",name:"Pre/Post Workout",desc:"Whey Shake + Banana",cal:340,pro:38,dot:"#f0b429"},
    {time:"7PM",name:"Dinner",desc:"Ground Turkey + Quinoa + Veggies",cal:510,pro:45,dot:"#c8440a"},
    {time:"9PM",name:"Evening",desc:"Cottage Cheese + Walnuts",cal:200,pro:18,dot:"#8a8a84"},
  ]},
};

const WP = {
  push:{
    A:[{name:"Machine Shoulder Press",sets:"3x12-15",rest:"60s"},{name:"Chest Press Machine",sets:"3x12-15",rest:"60s"},{name:"Cable Tricep Pushdowns",sets:"4x12-15",rest:"60s"},{name:"Dumbbell Lateral Raises",sets:"3x15",rest:"45s"},{name:"Cable Woodchoppers Low to High",sets:"3x15/side",rest:"30s"},{name:"Seated Machine Crunches",sets:"3x20",rest:"30s"}],
    B:[{name:"Incline Chest Press Machine",sets:"3x12-15",rest:"60s"},{name:"Machine Shoulder Press Neutral",sets:"3x12-15",rest:"60s"},{name:"Overhead Cable Tricep Extensions",sets:"4x12-15",rest:"60s"},{name:"Dumbbell Front Raises",sets:"3x12-15",rest:"45s"},{name:"Russian Twists Cable",sets:"3x15/side",rest:"30s"},{name:"Leg Raises Captains Chair",sets:"3x20",rest:"30s"}],
    C:[{name:"Flat Dumbbell Press",sets:"4x10-12",rest:"75s"},{name:"Arnold Press",sets:"3x12",rest:"60s"},{name:"Tricep Dips Assisted",sets:"3x15",rest:"60s"},{name:"Cable Lateral Raises",sets:"4x15",rest:"45s"},{name:"Decline Crunches",sets:"3x20",rest:"30s"}],
  },
  pull:{
    A:[{name:"Lat Pulldown Wide Grip",sets:"3x12-15",rest:"60s"},{name:"Seated Cable Row",sets:"3x12-15",rest:"60s"},{name:"Dumbbell Bicep Curls Seated",sets:"4x12-15",rest:"60s"},{name:"Face Pulls Cable Rope",sets:"3x15",rest:"45s"},{name:"Russian Twists Cable",sets:"3x15/side",rest:"30s"},{name:"Leg Raises Captains Chair",sets:"3x20",rest:"30s"}],
    B:[{name:"Lat Pulldown Close Grip",sets:"3x12-15",rest:"60s"},{name:"Single-Arm Cable Row",sets:"3x12-15/side",rest:"60s"},{name:"EZ-Bar Preacher Curls",sets:"4x12-15",rest:"60s"},{name:"Face Pulls Cable Rope",sets:"3x15",rest:"45s"},{name:"Cable Woodchoppers Low to High",sets:"3x15/side",rest:"30s"},{name:"Seated Machine Crunches",sets:"3x20",rest:"30s"}],
    C:[{name:"Assisted Pull-Ups",sets:"4x8-10",rest:"75s"},{name:"Chest-Supported Row",sets:"3x12",rest:"60s"},{name:"Hammer Curls",sets:"4x12",rest:"60s"},{name:"Reverse Flyes Machine",sets:"3x15",rest:"45s"},{name:"Plank Hold",sets:"3x45s",rest:"30s"}],
  },
  legs:{
    A:[{name:"Barbell Hip Thrusts",sets:"4x10-12",rest:"90s"},{name:"Leg Press Feet High",sets:"3x12-15",rest:"90s"},{name:"Seated Leg Curl",sets:"3x12-15",rest:"60s"},{name:"Cable Kickbacks",sets:"3x15/leg",rest:"45s"},{name:"Cable Woodchoppers High to Low",sets:"3x15/side",rest:"30s"},{name:"Seated Machine Crunches",sets:"3x20",rest:"30s"}],
    B:[{name:"Hack Squat Machine",sets:"4x10-12",rest:"90s"},{name:"Romanian Deadlift DB",sets:"3x12",rest:"90s"},{name:"Leg Extension",sets:"3x15",rest:"60s"},{name:"Lying Leg Curl",sets:"3x12-15",rest:"60s"},{name:"Calf Raises Machine",sets:"4x20",rest:"45s"}],
    C:[{name:"Goblet Squat",sets:"4x12",rest:"75s"},{name:"Sumo Deadlift",sets:"3x10",rest:"90s"},{name:"Bulgarian Split Squat",sets:"3x10/leg",rest:"75s"},{name:"Leg Curl Seated",sets:"3x15",rest:"60s"},{name:"Glute Kickbacks Machine",sets:"3x15/leg",rest:"45s"}],
  },
};

function getSplit(days,goal,wn) {
  const v=["A","B","C"][(wn-1)%3], vB=v==="A"?"B":v==="B"?"C":"A", vC=v==="A"?"C":"A";
  if(days===3) return [
    {day:"Monday",type:"full",focus:"Full Body Compounds",time:"90min+15shower",exercises:[...WP.push[v].slice(0,2),...WP.pull[v].slice(0,2),...WP.legs[v].slice(0,2)]},
    {day:"Tuesday",type:"rest",focus:"Rest / Light Walk",time:"",exercises:[]},
    {day:"Wednesday",type:"full",focus:"Full Body Hypertrophy",time:"90min+15shower",exercises:[...WP.push[v].slice(2,4),...WP.pull[v].slice(2,4),...WP.legs[v].slice(2,4)]},
    {day:"Thursday",type:"rest",focus:"Rest / Mobility",time:"",exercises:[]},
    {day:"Friday",type:"full",focus:"Full Body Power",time:"90min+15shower",exercises:[...WP.push[vB].slice(0,2),...WP.pull[vB].slice(0,2),...WP.legs[vB].slice(0,2)]},
    {day:"Saturday",type:goal==="cut"?"cardio":"rest",focus:goal==="cut"?"Cardio Treadmill 20min":"Rest",time:goal==="cut"?"35min":"",exercises:[]},
    {day:"Sunday",type:"rest",focus:"Rest and Recovery",time:"",exercises:[]},
  ];
  if(days===4) return [
    {day:"Monday",type:"rest",focus:"Rest Active Recovery",time:"",exercises:[]},
    {day:"Tuesday",type:"push",focus:"Push Chest Shoulders Triceps",time:"90min+15shower",exercises:WP.push[v]},
    {day:"Wednesday",type:"pull",focus:"Pull Back Biceps",time:"90min+15shower",exercises:WP.pull[v]},
    {day:"Thursday",type:"rest",focus:"Rest Walk",time:"",exercises:[]},
    {day:"Friday",type:"legs",focus:"Legs Glutes Hamstrings Quads",time:"100min+15shower",exercises:WP.legs[v]},
    {day:"Saturday",type:"push",focus:"Push Core Volume",time:"90min+15shower",exercises:WP.push[vB]},
    {day:"Sunday",type:"rest",focus:"Rest",time:"",exercises:[]},
  ];
  return [
    {day:"Monday",type:"push",focus:"Push Chest Shoulders Triceps",time:"90min+15shower",exercises:WP.push[v]},
    {day:"Tuesday",type:"pull",focus:"Pull Back Biceps",time:"90min+15shower",exercises:WP.pull[v]},
    {day:"Wednesday",type:"legs",focus:"Legs Squat Pattern",time:"100min+15shower",exercises:WP.legs[v]},
    {day:"Thursday",type:"rest",focus:"Rest Light Cardio",time:"30min walk",exercises:[]},
    {day:"Friday",type:"push",focus:"Push Shoulders Chest Volume",time:"90min+15shower",exercises:WP.push[vB]},
    {day:"Saturday",type:"pull",focus:"Pull Back Rear Delts",time:"90min+15shower",exercises:WP.pull[vC]},
    {day:"Sunday",type:goal==="cut"?"cardio":"rest",focus:goal==="cut"?"Cardio Core 20min":"Rest",time:goal==="cut"?"45min":"",exercises:[]},
  ];
}

function calcTDEE(stats,activity,sex) {
  if(!stats||!stats.weight||!stats.heightFt) return 2000;
  const kg=stats.weight*0.453592,cm=stats.heightFt*30.48+(stats.heightIn||0)*2.54;
  const bmr=sex==="male"?10*kg+6.25*cm-5*stats.age+5:10*kg+6.25*cm-5*stats.age-161;
  return Math.round(bmr*({sedentary:1.2,light:1.375,moderate:1.55,very:1.725}[activity]||1.55));
}

function runEngine(up,wd,wn) {
  if(!wd||wn<2) return null;
  const prev=wd[wn-1];
  if(!prev) return null;
  const goal=up?.goal||"cut",base=BASE_PLANS[goal];
  let calAdj=0,protAdj=0,notes=[];
  const amW=Object.values(prev.weightLog||{}).map(e=>parseFloat(e.am)).filter(Boolean);
  if(amW.length>=3){
    const delta=amW[amW.length-1]-amW[0];
    if(goal==="cut"&&delta>0.5){calAdj-=100;notes.push("Scale up this week, cutting 100 cal");}
    if(goal==="cut"&&delta<-2){calAdj+=75;notes.push("Losing fast, adding 75 cal to protect muscle");}
    if(goal==="bulk"&&delta<0.2){calAdj+=150;notes.push("Not gaining, adding 150 cal to surplus");}
  }
  const beh=prev.behaviors||{};
  const totalBeh=Object.values(beh).reduce((a,b)=>a+(b||0),0);
  if(totalBeh>=5){calAdj-=50;notes.push("High bad behaviors, tightening calories 50 cal");}
  if((beh["Poor Sleep"]||0)>=3){protAdj+=10;notes.push("Poor sleep detected, adding 10g protein for recovery");}
  if(notes.length===0) notes.push("All good, no adjustments needed this week");
  return {calAdj,protAdj,newCal:base.calories+calAdj,newProt:base.protein+protAdj,notes};
}

const BEHAVIORS=[
  {key:"Alcohol",icon:"🍺",label:"Alcohol"},
  {key:"Smoking",icon:"🚬",label:"Smoking/Vaping"},
  {key:"Poor Sleep",icon:"😴",label:"Poor Sleep"},
  {key:"Missed Meals",icon:"🍽️",label:"Missed Meals"},
  {key:"Junk Food",icon:"🍔",label:"Junk Food"},
];

const QS=[
  {id:"goal",tag:"01 Foundation",title:"Primary\ngoal?",sub:"Everything adapts to this answer.",type:"cards",cols:1,
    opts:[{v:"bulk",icon:"💪",l:"Build Muscle",d:"Caloric surplus, heavy compounds, high protein"},{v:"recomp",icon:"⚡",l:"Muscle and Fat Loss",d:"Body recomp, simultaneous change"},{v:"cut",icon:"🔥",l:"Lose Fat",d:"Caloric deficit, high protein, strategic cardio"}]},
  {id:"activity",tag:"02 Baseline",title:"Activity\nlevel?",sub:"Calibrates your daily calorie target.",type:"cards",cols:2,
    opts:[{v:"sedentary",icon:"🪑",l:"Sedentary",d:"Desk job"},{v:"light",icon:"🚶",l:"Light",d:"1-2x/week"},{v:"moderate",icon:"🏋️",l:"Moderate",d:"3-4x/week"},{v:"very",icon:"🚀",l:"Very Active",d:"5-7x/week"}]},
  {id:"stats",tag:"03 Body",title:"Your\nstats.",sub:"Calculates your exact TDEE and macros.",type:"stats"},
  {id:"sex",tag:"04 Biology",title:"Biological\nsex?",sub:"Adjusts BMR formula.",type:"cards",cols:2,
    opts:[{v:"male",icon:"♂️",l:"Male",d:""},{v:"female",icon:"♀️",l:"Female",d:""}]},
  {id:"experience",tag:"05 Experience",title:"Training\nexperience?",sub:"Sets exercise complexity and volume.",type:"cards",cols:1,
    opts:[{v:"beginner",icon:"🌱",l:"Beginner 0-1 yr",d:"Machine-focused, form-first"},{v:"intermediate",icon:"🏆",l:"Intermediate 1-3 yrs",d:"Structured split programming"},{v:"advanced",icon:"⚡",l:"Advanced 3+ yrs",d:"High intensity, periodization"}]},
  {id:"days",tag:"06 Schedule",title:"Training\ndays/week?",sub:"Determines your split type.",type:"days"},
  {id:"diet",tag:"07 Nutrition",title:"Dietary\nrestrictions?",sub:"Select all that apply.",type:"diet"},
];

function Quiz({onComplete}) {
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState({diet:["None"]});
  const q=QS[step];
  const pct=(step/QS.length)*100;
  const valid=()=>{
    if(q.type==="cards") return !!ans[q.id];
    if(q.type==="stats"){const s=ans.stats||{};return s.age&&s.weight&&s.heightFt;}
    if(q.type==="days") return !!ans.days;
    return true;
  };
  const saveStats=()=>{
    const age=document.getElementById("qa")?.value,weight=document.getElementById("qw")?.value,hFt=document.getElementById("qhf")?.value,hIn=document.getElementById("qhi")?.value;
    if(!age||!weight||!hFt) return false;
    setAns(a=>({...a,stats:{age:+age,weight:+weight,heightFt:+hFt,heightIn:+(hIn||0)}}));
    return true;
  };
  const next=()=>{
    if(q.type==="stats"&&!saveStats()) return;
    if(step<QS.length-1){setStep(s=>s+1);}
    else{
      const final={...ans};
      if(q.type==="stats"){
        const age=document.getElementById("qa")?.value,weight=document.getElementById("qw")?.value,hFt=document.getElementById("qhf")?.value,hIn=document.getElementById("qhi")?.value;
        final.stats={age:+age,weight:+weight,heightFt:+hFt,heightIn:+(hIn||0)};
      }
      onComplete(final);
    }
  };
  const toggleDiet=v=>setAns(a=>{
    let d=a.diet||["None"];
    if(v==="None") return {...a,diet:["None"]};
    d=d.filter(x=>x!=="None");
    if(d.includes(v)) d=d.filter(x=>x!==v); else d.push(v);
    if(d.length===0) d=["None"];
    return {...a,diet:d};
  });

  return(
    <div className="quiz-overlay">
      <div className="quiz-top">
        <div className="quiz-logo">FIT<span>FORGE</span></div>
        <div className="qprog-wrap"><div className="qprog-fill" style={{width:pct+"%"}}/></div>
        <div className="qstep">{step+1}/{QS.length}</div>
      </div>
      <div className="quiz-body">
        <div className="qtag">{q.tag}</div>
        <div className="qtitle">{q.title.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div className="qsub">{q.sub}</div>
        {q.type==="cards"&&<div className={`qcards${q.cols===2?" g2":""}`}>
          {q.opts.map(o=>(
            <div key={o.v} className={`qcard${ans[q.id]===o.v?" sel":""}`} onClick={()=>setAns(a=>({...a,[q.id]:o.v}))}>
              <div className="qcard-icon">{o.icon}</div>
              <div><div className="qcard-label">{o.l}</div>{o.d&&<div className="qcard-desc">{o.d}</div>}</div>
              <div className="qcard-chk">{ans[q.id]===o.v?"v":""}</div>
            </div>
          ))}
        </div>}
        {q.type==="stats"&&<div className="stats-grid">
          {[{id:"qa",l:"Age",ph:"28",u:"years"},{id:"qw",l:"Weight lbs",ph:"175",u:"lbs"},{id:"qhf",l:"Height ft",ph:"5",u:"feet"},{id:"qhi",l:"Height in",ph:"10",u:"inches"}].map(f=>(
            <div key={f.id} className="si-box">
              <div className="si-label">{f.l}</div>
              <input id={f.id} type="number" placeholder={f.ph}/>
              <div className="si-unit">{f.u}</div>
            </div>
          ))}
        </div>}
        {q.type==="days"&&<div className="days-row">
          {[3,4,5].map(d=>(
            <div key={d} className={`dpick${ans.days===d?" sel":""}`} onClick={()=>setAns(a=>({...a,days:d}))}>
              <span className="dpick-num">{d}</span><div className="dpick-lbl">days/wk</div>
            </div>
          ))}
        </div>}
        {q.type==="diet"&&<div className="diet-tags">
          {["None","Vegetarian","Vegan","Dairy-Free","Gluten-Free","Low Carb","Halal","Kosher"].map(t=>(
            <div key={t} className={`dtag${(ans.diet||["None"]).includes(t)?" sel":""}`} onClick={()=>toggleDiet(t)}>{t}</div>
          ))}
        </div>}
        <div style={{height:80}}/>
      </div>
      <div className="quiz-footer">
        <button className="btn-qnext" onClick={next} disabled={!valid()}>{step===QS.length-1?"Build My Plan":"Continue"}</button>
        {step>0&&<button className="btn-qback" onClick={()=>setStep(s=>s-1)}>Back</button>}
      </div>
    </div>
  );
}

const NAV=[{id:"home",icon:"📊",lbl:"Home"},{id:"meals",icon:"🍽️",lbl:"Meals"},{id:"train",icon:"🏋️",lbl:"Train"},{id:"track",icon:"📈",lbl:"Track"},{id:"body",icon:"🧬",lbl:"Body"},{id:"german",icon:"🇩🇪",lbl:"Deutsch"},{id:"more",icon:"⋯",lbl:"More"}];

function Home({up,weekNum,weeklyData,setTab}) {
  const goal=up?.goal||"cut",tdee=calcTDEE(up?.stats,up?.activity,up?.sex),engine=runEngine(up,weeklyData,weekNum),base=BASE_PLANS[goal],gc=GOAL_COLORS[goal];
  const adjCal=engine?base.calories+engine.calAdj:base.calories;
  const adjProt=engine?base.protein+engine.protAdj:base.protein;
  return(
    <div className="page">
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Week {weekNum} · {GOAL_LABELS[goal]}</div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="sc-label">Daily Calories</div>
          <div className="sc-val" style={{color:gc}}>{adjCal}</div>
          <div className="sc-sub">{tdee} TDEE · {tdee>adjCal?"deficit":"surplus"} {Math.abs(tdee-adjCal)}</div>
          <div className="prog-wrap"><div className="prog-fill" style={{width:"72%",background:gc}}/></div>
        </div>
        <div className="stat-card">
          <div className="sc-label">Protein Target</div>
          <div className="sc-val" style={{color:"#1a4a7a"}}>{adjProt}g</div>
          <div className="sc-sub">per day</div>
          <div className="prog-wrap"><div className="prog-fill" style={{width:"65%",background:"#1a4a7a"}}/></div>
        </div>
      </div>
      {engine&&<div className="engine-card">
        <div className="engine-title">Adaptive Engine Week {weekNum} Update</div>
        <div className="engine-sub">Based on last week data here is what changed</div>
        {engine.notes.map((n,i)=><div key={i} className="engine-row"><div className="engine-label">{n}</div></div>)}
        {engine.calAdj!==0&&<div className="engine-row"><div className="engine-label">Calories adjusted</div><div className="engine-val">{engine.calAdj>0?"+":""}{engine.calAdj} cal to {adjCal}/day</div></div>}
        {engine.protAdj!==0&&<div className="engine-row"><div className="engine-label">Protein adjusted</div><div className="engine-val">{engine.protAdj>0?"+":""}{engine.protAdj}g to {adjProt}g/day</div></div>}
      </div>}
      <div className="slabel">Quick Actions</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{icon:"🍽️",label:"Meal Plan",tab:"meals",color:"#2d5a27"},{icon:"🏋️",label:"Workout",tab:"train",color:"#1a4a7a"},{icon:"📈",label:"Log Weight",tab:"track",color:"#c8440a"},{icon:"🧬",label:"Body Comp",tab:"body",color:"#6b3fa0"}].map(a=>(
          <div key={a.tab} onClick={()=>setTab(a.tab)} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 16px",cursor:"pointer",boxShadow:"var(--shadow)",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{a.icon}</span><span style={{fontSize:13,fontWeight:700,color:a.color}}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Meals({up,weekNum,weeklyData}) {
  const goal=up?.goal||"cut",base=BASE_PLANS[goal],engine=runEngine(up,weeklyData,weekNum),gc=GOAL_COLORS[goal];
  const cal=engine?base.calories+engine.calAdj:base.calories;
  const prot=engine?base.protein+engine.protAdj:base.protein;
  const sf=cal/base.calories;
  return(
    <div className="page">
      <div className="page-title">Meal Plan</div>
      <div className="page-sub">{GOAL_LABELS[goal]} · Week {weekNum} · Adaptive targets</div>
      <div className="macro-strip">
        {[{v:cal,n:"Calories",c:gc},{v:prot+"g",n:"Protein",c:"#1a4a7a"},{v:Math.round(base.carbs*sf)+"g",n:"Carbs",c:"#c8440a"},{v:Math.round(base.fat*sf)+"g",n:"Fat",c:"#f0b429"}].map(m=>(
          <div key={m.n} className="macro-tile"><div className="macro-val" style={{color:m.c}}>{m.v}</div><div className="macro-name">{m.n}</div></div>
        ))}
      </div>
      {engine&&engine.calAdj!==0&&<div style={{background:"var(--yellow-lt)",border:"1px solid var(--yellow)",borderRadius:"var(--radius-sm)",padding:"10px 14px",marginBottom:12,fontSize:12,color:"#7a5000"}}>
        Adapted from last week: {engine.calAdj>0?"+":""}{engine.calAdj} cal adjustment applied
      </div>}
      <div className="card">
        <div className="card-body">
          {base.meals.map((m,i)=>(
            <div key={i} className="meal-row">
              <div className="meal-dot" style={{background:m.dot}}/>
              <div className="meal-time">{m.time}</div>
              <div style={{flex:1}}><div className="meal-name">{m.name}</div><div className="meal-desc">{m.desc}</div></div>
              <div><div className="meal-cal">{Math.round(m.cal*sf)}</div><div className="meal-pro">{Math.round(m.pro*sf)}g</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Train({up,weekNum,setWeekNum}) {
  const [expanded,setExpanded]=useState(null);
  const [checked,setChecked]=useState({});
  const goal=up?.goal||"cut",days=up?.days||4;
  const split=getSplit(days,goal,weekNum);
  const v=["A","B","C"][(weekNum-1)%3];
  const toggle=(di,ei)=>{const k=`${weekNum}-${di}-${ei}`;setChecked(c=>({...c,[k]:!c[k]}));};
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
        <div><div className="page-title">Workouts</div><div className="page-sub">{days}-day split Variant {v} <span className="new-badge">Week {weekNum}</span></div></div>
        <button className="btn-gen" onClick={()=>setWeekNum(w=>Math.min(w+1,4))}>Next Week</button>
      </div>
      <div className="week-tabs">{[1,2,3,4].map(w=><button key={w} className={`wtab${weekNum===w?" active":""}`} onClick={()=>setWeekNum(w)}>Week {w}</button>)}</div>
      {split.map((day,di)=>(
        <div key={di} className="wd-card">
          <div className="wd-hdr" onClick={()=>day.exercises.length&&setExpanded(expanded===di?null:di)}>
            <div className="wd-left">
              <div className={`day-badge db-${day.type}`}>{day.type.toUpperCase()}</div>
              <div><div className="wd-name">{day.day}</div><div className="wd-focus">{day.focus}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="wd-time">{day.time}</div>
              {day.exercises.length>0&&<div style={{fontSize:12,color:"var(--muted)"}}>{expanded===di?"^":"v"}</div>}
            </div>
          </div>
          {expanded===di&&day.exercises.length>0&&(
            <div className="ex-list" style={{paddingTop:10}}>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Warm-up: 5 min treadmill walk</div>
              {day.exercises.map((ex,ei)=>{
                const k=`${weekNum}-${di}-${ei}`;
                return(
                  <div key={ei} className="ex-row">
                    <div className={`ex-chk${checked[k]?" done":""}`} onClick={()=>toggle(di,ei)}>{checked[k]?"v":""}</div>
                    <div style={{flex:1}}><div className="ex-name">{ex.name}</div><div className="ex-sets">{ex.sets}</div></div>
                    <div className="ex-rest">{ex.rest}</div>
                  </div>
                );
              })}
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginTop:10}}>Cooldown 5 min + Shower 15 min</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Track({weekNum,weeklyData,setWeeklyData}) {
  const wd=weeklyData[weekNum]||{};
  const wl=wd.weightLog||{},beh=wd.behaviors||{},sexLog=wd.sexLog||{};
  const updWl=(day,field,val)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],weightLog:{...(d[weekNum]?.weightLog||{}),[day]:{...(d[weekNum]?.weightLog?.[day]||{}),[field]:val}}}}));
  const updBeh=(key,val)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],behaviors:{...(d[weekNum]?.behaviors||{}),[key]:Math.max(0,val)}}}));
  const toggleSex=(day)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],sexLog:{...(d[weekNum]?.sexLog||{}),[day]:!d[weekNum]?.sexLog?.[day]}}}));
  return(
    <div className="page">
      <div className="page-title">Track</div>
      <div className="page-sub">Week {weekNum} · Log daily data to power the adaptive engine</div>
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
                <div className={`wdiff${diff>0?" up":diff<0?" dn":""}`}>{diff!==null?(diff>0?"+":"")+diff:"--"}</div>
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
      <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Tap a day to log. Frequency tracking only.</div>
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
          <div style={{marginTop:12,fontSize:11,color:"var(--muted)"}}>Week total: <strong>{Object.values(sexLog).filter(Boolean).length}</strong></div>
        </div>
      </div>
    </div>
  );
}

function Body({weekNum,weeklyData,setWeeklyData}) {
  const wd=weeklyData[weekNum]||{},bc=wd.bodyComp||{},meas=wd.measurements||{};
  const updBc=(k,v)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],bodyComp:{...(d[weekNum]?.bodyComp||{}),[k]:v}}}));
  const updMeas=(k,v)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],measurements:{...(d[weekNum]?.measurements||{}),[k]:v}}}));
  const bfNum=parseFloat(bc.bodyFat);
  const bfStatus=!bfNum?"":bfNum<10?"Essential fat":bfNum<20?"Athletic":bfNum<25?"Fitness":bfNum<30?"Average":"Above average";
  const w1=weeklyData[1],heightIn=w1?.bodyComp?.height||70;
  const latestWeight=parseFloat(Object.values(wd.weightLog||{}).map(e=>e.am).filter(Boolean).pop()||0);
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
                <span style={{fontSize:12,fontWeight:600}}>Body Fat</span>
                <span style={{fontSize:12,color:"var(--green)",fontWeight:700}}>{bfNum}% {bfStatus}</span>
              </div>
              <div className="prog-wrap"><div className="prog-fill" style={{width:Math.min(100,bfNum*2)+"%",background:bfNum<20?"var(--green)":bfNum<30?"var(--yellow)":"var(--red)"}}/></div>
            </div>}
            {bmi&&<div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600}}>BMI</span>
                <span style={{fontSize:12,color:bmi<25?"var(--green)":bmi<30?"var(--yellow)":"var(--red)",fontWeight:700}}>{bmi} {bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese"}</span>
              </div>
              <div className="prog-wrap"><div className="prog-fill" style={{width:Math.min(100,(bmi/40)*100)+"%",background:bmi<25?"var(--green)":bmi<30?"var(--yellow)":"var(--red)"}}/></div>
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

function More({up,weekNum,weeklyData}) {
  const [sub,setSub]=useState("monthly");
  const goal=up?.goal||"cut";
  const [form,setForm]=useState({age:up?.stats?.age||"",weight:up?.stats?.weight||"",heightFt:up?.stats?.heightFt||"",heightIn:up?.stats?.heightIn||"",sex:up?.sex||"male",activity:up?.activity||"moderate",goal:up?.goal||"cut"});
  const tdee=calcTDEE({age:form.age,weight:form.weight,heightFt:form.heightFt,heightIn:form.heightIn},form.activity,form.sex);
  const adj=form.goal==="bulk"?tdee+350:form.goal==="cut"?tdee-450:tdee-100;
  const protein=Math.round((form.weight||175)*1.0),fat=Math.round(adj*0.25/9),carbs=Math.round((adj-protein*4-fat*9)/4);
  let totalBeh=0,totalSex=0,allWeights=[];
  for(let w=1;w<=4;w++){const wd=weeklyData[w];if(!wd)continue;const b=wd.behaviors||{};totalBeh+=Object.values(b).reduce((a,x)=>a+(x||0),0);totalSex+=Object.values(wd.sexLog||{}).filter(Boolean).length;allWeights.push(...Object.values(wd.weightLog||{}).map(e=>parseFloat(e.am)).filter(Boolean));}
  const weightChange=allWeights.length>1?(allWeights[allWeights.length-1]-allWeights[0]).toFixed(1):"--";
  const behScore=Math.max(0,100-totalBeh*5);
  const grade=behScore>=90?"A":behScore>=75?"B":behScore>=60?"C":"D";
  return(
    <div className="page">
      <div className="page-title">More</div>
      <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {[{id:"monthly",l:"Monthly"},{id:"calc",l:"Calculator"},{id:"prep",l:"Meal Prep"}].map(s=>(
          <button key={s.id} className={`wtab${sub===s.id?" active":""}`} onClick={()=>setSub(s.id)}>{s.l}</button>
        ))}
      </div>
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
          {[{l:"Weight change",v:weightChange!=="--"?(weightChange>0?"+":"")+weightChange+" lbs":weightChange},{l:"Bad behaviors",v:totalBeh+" total"},{l:"Sexual activity",v:totalSex+" times logged"}].map((r,i)=>(
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
              {icon:"📉",title:"Weight Trend",desc:weightChange!=="--"?`You ${weightChange>0?"gained":"lost"} ${Math.abs(weightChange)} lbs this month.`:"Keep logging daily weights to see trend."},
              {icon:"🚨",title:"Behavior Impact",desc:totalBeh===0?"Zero bad behaviors. Elite discipline.":totalBeh<5?"Minor behaviors, minimal impact.":totalBeh<10?"Moderate behaviors affecting recovery.":"High behavior count. Prioritize sleep and nutrition."},
              {icon:"💪",title:"Next Month Focus",desc:behScore>=90?"Maintain consistency and consider increasing training intensity.":"Reduce bad behaviors first. They directly impact your results."},
            ].map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                <span style={{fontSize:20,flexShrink:0}}>{tip.icon}</span>
                <div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{tip.title}</div><div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{tip.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>}
      {sub==="calc"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:0}}>
          {[{l:"Age",k:"age",ph:"28"},{l:"Weight lbs",k:"weight",ph:"175"},{l:"Height ft",k:"heightFt",ph:"5"},{l:"Height in",k:"heightIn",ph:"10"}].map(f=>(
            <div key={f.k} className="calc-input">
              <div className="calc-lbl">{f.l}</div>
              <input type="number" placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(f2=>({...f2,[f.k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        {[{l:"Sex",k:"sex",opts:[["male","Male"],["female","Female"]]},{l:"Activity",k:"activity",opts:[["sedentary","Sedentary"],["light","Light"],["moderate","Moderate"],["very","Very Active"]]},{l:"Goal",k:"goal",opts:[["bulk","Build Muscle"],["recomp","Recomp"],["cut","Lose Fat"]]}].map(f=>(
          <div key={f.k} className="calc-input">
            <div className="calc-lbl">{f.l}</div>
            <select value={form[f.k]} onChange={e=>setForm(f2=>({...f2,[f.k]:e.target.value}))}>
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
        <div className="slabel">Shopping List ~$46</div>
        <div className="card">
          <div className="card-body" style={{padding:"10px 14px"}}>
            {[["Protein shakes vanilla and choc","14 shakes","$25"],["Ground turkey 93% lean","21 oz","$5"],["Chicken breast","21 oz","$5"],["Dry white rice","2 cups","$2"],["Broccoli","7 cups / 2 lb","$4"],["Rolled oats","3.5 cups","$2"],["Seasonings","salt pepper garlic","$1"],["BPA-free containers 14","24-32 oz","$15"]].map(([item,qty,cost],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<7?"1px solid var(--border)":"none"}}>
                <div><div style={{fontSize:12,fontWeight:600}}>{item}</div><div style={{fontSize:10,color:"var(--muted)"}}>{qty}</div></div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>{cost}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="slabel">Prep Steps</div>
        <div className="card">
          <div className="card-body">
            {[["Cook Rice","2 cups dry + 4 cups water 20 min, yields 5.25 cups"],["Steam Broccoli","7 cups, 5-7 min steam fresh or 3-4 min microwave frozen"],["Cook Turkey","21 oz in skillet seasoned 5-7 min drain fat cool"],["Bake Chicken","21 oz at 400F 18-22 min until 165F internal slice after cooling"],["Assembly","7 lunch: 3oz turkey + 3/4 cup rice + 1 cup broccoli. 7 dinner: swap for chicken"],["Oatmeal","Batch-cook 3.5 cups dry oats 15 min, store in fridge, reheat daily"]].map(([title,desc],i)=>(
              <div key={i} className="prep-step">
                <div className="prep-num">{i+1}</div>
                <div><div className="prep-title">{title}</div><div className="prep-desc">{desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}


const GERMAN_WORDS = {
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

function GermanTab({weekNum,weeklyData,setWeeklyData}) {
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

  const streak=(()=>{
    let s=0;
    for(let w=weekNum;w>=1;w--){
      const wlog=weeklyData[w]?.germanLog||{};
      for(const d of DAYS_FULL){if(wlog[d]?.done)s++;}
    }
    return s;
  })();

  const doneThisWeek=Object.values(germanLog).filter(d=>d?.done).length;
  const todayDone=germanLog[today]?.done||false;
  const todayWritten=germanLog[today]?.written||"";

  const toggleDone=(day)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],germanLog:{...(d[weekNum]?.germanLog||{}),[day]:{...(d[weekNum]?.germanLog?.[day]||{}),done:!d[weekNum]?.germanLog?.[day]?.done}}}}));
  const saveWritten=(day,val)=>setWeeklyData(d=>({...d,[weekNum]:{...d[weekNum],germanLog:{...(d[weekNum]?.germanLog||{}),[day]:{...(d[weekNum]?.germanLog?.[day]||{}),written:val}}}}));

  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
        <div>
          <div className="page-title">🇩🇪 Deutsch</div>
          <div className="page-sub">20 min/day · Week {weekNum} · {doneThisWeek}/7 days done</div>
        </div>
        <div style={{textAlign:"center",background:"var(--green)",borderRadius:12,padding:"10px 14px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:"#fff",lineHeight:1}}>{streak}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>streak</div>
        </div>
      </div>

      <div style={{background:"var(--text)",borderRadius:"var(--radius)",padding:20,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#a8e063",marginBottom:8}}>Wort des Tages — Day {todayWordIdx+1}</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,color:"#fff",marginBottom:4}}>{todayWord.de}</div>
        <div style={{fontSize:16,color:"rgba(255,255,255,0.5)",marginBottom:14}}>{todayWord.en}</div>
        <div style={{background:"rgba(168,224,99,0.1)",border:"1px solid rgba(168,224,99,0.2)",borderRadius:8,padding:"10px 12px",fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>💬 {todayWord.tip}</div>
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
            style={{width:"100%",minHeight:80,background:"var(--surface2)",border:"1.5px solid var(--border)",borderRadius:"var(--radius-sm)",padding:"10px 12px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"var(--text)",resize:"none",outline:"none",lineHeight:1.5,marginBottom:12}}
          />
          <button
            onClick={()=>toggleDone(today)}
            style={{width:"100%",padding:13,background:todayDone?"var(--green)":"var(--surface2)",border:"2px solid "+(todayDone?"var(--green)":"var(--border)"),borderRadius:"var(--radius-sm)",fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:todayDone?"#fff":"var(--muted)",cursor:"pointer",transition:"all 0.15s"}}
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
                  <div onClick={()=>toggleDone(d)} style={{width:36,height:36,borderRadius:"50%",margin:"0 auto",border:isToday?"2px solid var(--green)":"2px solid var(--border)",background:done?"var(--green)":"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",color:done?"#fff":"var(--muted)"}}>
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
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:2}}>{w.de}</div>
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
              <div><div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{t.title}</div><div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [quizDone,setQuizDone]=useState(false);
  const [up,setUp]=useState(null);
  const [tab,setTab]=useState("home");
  const [weekNum,setWeekNum]=useState(1);
  const [weeklyData,setWeeklyData]=useState({});
  const handleQuizDone=(answers)=>{setUp(answers);setQuizDone(true);};
  if(!quizDone) return(<><style>{CSS}</style><Quiz onComplete={handleQuizDone}/></>);
  const goal=up?.goal||"cut",gc=GOAL_COLORS[goal];
  return(
    <>
      <style>{CSS}</style>
      <div>
        <div className="topbar">
          <div className="app-logo">FIT<span>FORGE</span></div>
          <div className="user-pill" style={{background:gc+"22"}} onClick={()=>setQuizDone(false)}>
            <div className="user-av" style={{background:gc}}>{(up?.stats?.age||"U").toString()[0]}</div>
            <div className="user-lbl" style={{color:gc}}>{GOAL_LABELS[goal]}</div>
          </div>
        </div>
        <div style={{paddingBottom:72}}>
          {tab==="home"&&<Home up={up} weekNum={weekNum} weeklyData={weeklyData} setTab={setTab}/>}
          {tab==="meals"&&<Meals up={up} weekNum={weekNum} weeklyData={weeklyData}/>}
          {tab==="train"&&<Train up={up} weekNum={weekNum} setWeekNum={setWeekNum}/>}
          {tab==="track"&&<Track weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData}/>}
          {tab==="body"&&<Body weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData}/>}
          {tab==="german"&&<GermanTab weekNum={weekNum} weeklyData={weeklyData} setWeeklyData={setWeeklyData}/> }
          {tab==="more"&&<More up={up} weekNum={weekNum} weeklyData={weeklyData}/>}
        </div>
        <div className="bottom-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`nav-btn${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-lbl">{n.lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
