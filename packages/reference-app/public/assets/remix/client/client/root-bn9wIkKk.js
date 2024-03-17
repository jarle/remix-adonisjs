import{r as n,j as e}from"./jsx-runtime-eUkJMm6l.js";import{b as h,c as x,_ as y,M as j,L as S,S as f}from"./components-8brcXnEx.js";import{a as w,b as g,O as k}from"./index-FZYdsAyj.js";/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:r,...l}){let{isSpaMode:c}=h(),o=w(),d=g();x({getKey:r,storageKey:a});let m=n.useMemo(()=>{if(!r)return null;let t=r(o,d);return t!==o.key?t:null},[]);if(c)return null;let p=((t,u)=>{if(!window.history.state||!window.history.state.key){let s=Math.random().toString(32).slice(2);window.history.replaceState({key:s},"")}try{let i=JSON.parse(sessionStorage.getItem(t)||"{}")[u||window.history.state.key];typeof i=="number"&&window.scrollTo(0,i)}catch(s){console.error(s),sessionStorage.removeItem(t)}}).toString();return n.createElement("script",y({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${p})(${JSON.stringify(a)}, ${JSON.stringify(m)})`}}))}const L=()=>[];function N(){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(j,{}),e.jsx("link",{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"}),e.jsx(S,{})]}),e.jsxs("body",{children:[e.jsx("main",{children:e.jsx("div",{className:"container",children:e.jsx(k,{})})}),e.jsx(M,{}),e.jsx(f,{})]})]})}export{N as default,L as links};
