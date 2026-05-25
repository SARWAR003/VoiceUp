import{d as o,b as n,e as c}from"./index-2aozsP8U.js";async function s(a){const t=await n(`You are a CV analysis expert. 
  Analyze the CV and return ONLY this JSON, no extra text:
  {
    "name": "",
    "currentRole": "",
    "totalExperience": "",
    "topSkills": [],
    "education": "",
    "lastCompany": "",
    "keyProjects": [],
    "suggestedRole": "",
    "interviewFocus": []
  }`,a,"llama-3.3-70b-versatile",!0);return c(t)}class i{async processCVText(e){try{return await s(e)}catch(t){throw console.error("CVAgent Text Parse Error:",t),t}}async processCVImage(e,t){try{const r=await o(e,t,"Extract all the text from this CV. Return only the raw text, no formatting.");return await s(r)}catch(r){throw console.error("CVAgent Image Parse Error:",r),r}}}export{i as CVAgent};
