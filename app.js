"use strict";
const data = window.LIBRARY_DATA;
const labels = {all:"全部资料",interview:"Agent 面经",harness:"Harness 工程",rag:"Agentic RAG"};
const cards = document.querySelector("#cards");
const reader = document.querySelector("#reader");
const search = document.querySelector("#search");
let category = "all";
let previousFocus;
const el = (tag, cls, text) => {const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const fillList = (target, values) => {const list=document.querySelector(target);list.replaceChildren(...values.map(value=>el("li","",value)));};

function openReader(note){
  previousFocus=document.activeElement;
  document.querySelector("#reader-category").textContent=labels[note.category];
  document.querySelector("#reader-type").textContent=note.type+" / AI 学习摘要";
  document.querySelector("#reader-title").textContent=note.title;
  document.querySelector("#reader-summary").textContent=note.summary;
  document.querySelector("#reader-tags").replaceChildren(...note.tags.map(tag=>el("span","tag",tag)));
  fillList("#reader-points",note.points);fillList("#reader-practice",note.practice);
  document.querySelector("#reader-evidence").textContent=note.imageCount+" 张图片已采集 · "+note.collectedOn+" · 内容待核验";
  document.querySelector("#reader-source").href=note.url;
  reader.showModal();reader.scrollTop=0;
  document.body.style.overflow="hidden";
}

function makeCard(note,index){
  const card=el("article","card");
  const top=el("div","card-top");top.append(el("span","card-category",labels[note.category]+" / "+note.type),el("span","card-number",String(index+1).padStart(2,"0")));
  const tags=el("div","tags");tags.append(...note.tags.slice(0,4).map(tag=>el("span","tag",tag)));
  const bottom=el("div","card-bottom");const meta=el("span","meta");meta.append(el("span","",note.imageCount+" 张源帖图片"),el("i"),el("span","","待核验"));
  const button=el("button","read-button","阅读摘要");button.setAttribute("aria-label","阅读摘要："+note.title);button.append(el("span","","↗"));button.addEventListener("click",()=>openReader(note));
  bottom.append(meta,button);card.append(top,el("h3","",note.title),el("p","summary",note.summary),tags,bottom);return card;
}

function render(){
  const terms=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const visible=data.notes.filter(note=>(category==="all"||category===note.category)&&terms.every(term=>[note.title,note.summary,...note.tags,...note.points,...note.practice].join(" ").toLocaleLowerCase().includes(term)));
  cards.replaceChildren(...visible.map(note=>makeCard(note,data.notes.indexOf(note))));
  document.querySelector("#empty").hidden=visible.length!==0;
  document.querySelector("#category-title").firstChild.textContent=labels[category]+" ";
  document.querySelector("#visible-count").textContent=visible.length;
  document.querySelector("#result-text").textContent=visible.length+" 篇资料"+(terms.length?" · 搜索结果":" · 按采集顺序展示");
  document.querySelectorAll(".category").forEach(button=>{const active=button.dataset.category===category;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
}
document.querySelectorAll(".category").forEach(button=>{button.addEventListener("click",()=>{category=button.dataset.category;render();});button.querySelector(".cat-count").textContent=button.dataset.category==="all"?data.notes.length:data.notes.filter(note=>note.category===button.dataset.category).length;});
search.addEventListener("input",render);
document.querySelector("#reset").addEventListener("click",()=>{search.value="";category="all";render();search.focus();});
document.querySelector("#close-reader").addEventListener("click",()=>reader.close());
reader.addEventListener("click",event=>{if(event.target===reader){const r=reader.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)reader.close();}});
reader.addEventListener("close",()=>{document.body.style.overflow="";if(previousFocus?.isConnected)previousFocus.focus();});
document.querySelector("#total").textContent=data.notes.length;
document.querySelector("#image-total").textContent=data.imageCount;
document.querySelector("#updated").textContent=data.updatedOn;
render();
