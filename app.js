"use strict";
const data=window.LIBRARY_DATA;
const labels={all:"全部文章",interview:"Agent 面试",harness:"Harness 工程",rag:"Agentic RAG"};
const cards=document.querySelector("#cards"),reader=document.querySelector("#reader"),search=document.querySelector("#search");
let category="all",previousFocus;
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
function openReader(article){
  previousFocus=document.activeElement;
  document.querySelector("#reader-category").textContent=labels[article.category];
  document.querySelector("#reader-title").textContent=article.title;
  document.querySelector("#reader-summary").textContent=article.summary;
  document.querySelector("#reader-tags").replaceChildren(...article.tags.map(tag=>el("span","tag",tag)));
  document.querySelector("#reader-content").textContent=article.body;
  document.querySelector("#reader-date").textContent="更新于 "+article.updatedOn;
  reader.showModal();reader.scrollTop=0;document.body.style.overflow="hidden";
}
function makeCard(article,index){
  const card=el("article","card"),top=el("div","card-top"),tags=el("div","tags"),bottom=el("div","card-bottom");
  top.append(el("span","card-category",labels[article.category]),el("span","card-number",String(index+1).padStart(2,"0")));
  tags.append(...article.tags.map(tag=>el("span","tag",tag)));
  const button=el("button","read-button","阅读全文");button.setAttribute("aria-label","阅读全文："+article.title);button.append(el("span","","↗"));button.addEventListener("click",()=>openReader(article));
  bottom.append(el("span","meta",article.updatedOn),button);card.append(top,el("h3","",article.title),el("p","summary",article.summary),tags,bottom);return card;
}
function render(){
  const terms=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const visible=data.articles.filter(article=>(category==="all"||category===article.category)&&terms.every(term=>[article.title,article.summary,article.body,...article.tags].join(" ").toLocaleLowerCase().includes(term)));
  cards.replaceChildren(...visible.map(article=>makeCard(article,data.articles.indexOf(article))));
  document.querySelector("#empty").hidden=visible.length!==0;
  document.querySelector("#empty-title").textContent=data.articles.length?"暂时没有匹配的文章":"文章整理中";
  document.querySelector("#empty-description").textContent=data.articles.length?"试试其他关键词或学习主题。":"把材料读懂，把观点写清楚。成稿后会在这里与你见面。";
  document.querySelector("#reset").hidden=!data.articles.length;
  document.querySelector("#category-title").firstChild.textContent=labels[category]+" ";
  document.querySelector("#visible-count").textContent=visible.length;
  document.querySelector("#result-text").textContent=visible.length+" 篇文章"+(terms.length?" · 搜索结果":" · 已发布");
  document.querySelectorAll(".category").forEach(button=>{const active=button.dataset.category===category;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
}
document.querySelectorAll(".category").forEach(button=>{button.addEventListener("click",()=>{category=button.dataset.category;render();});button.querySelector(".cat-count").textContent=button.dataset.category==="all"?data.articles.length:data.articles.filter(article=>article.category===button.dataset.category).length;});
search.addEventListener("input",render);document.querySelector("#reset").addEventListener("click",()=>{search.value="";category="all";render();search.focus();});
document.querySelector("#close-reader").addEventListener("click",()=>reader.close());reader.addEventListener("close",()=>{document.body.style.overflow="";if(previousFocus?.isConnected)previousFocus.focus();});
document.querySelector("#total").textContent=data.articles.length;document.querySelector("#updated").textContent=data.updatedOn;render();
