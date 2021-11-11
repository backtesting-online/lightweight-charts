"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9822],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return d}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=n.createContext({}),l=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=l(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),f=l(r),d=i,m=f["".concat(p,".").concat(d)]||f[d]||u[d]||a;return r?n.createElement(m,o(o({ref:t},c),{},{components:r})):n.createElement(m,o({ref:t},c))}));function d(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=f;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var l=2;l<a;l++)o[l]=r[l];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},8937:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return c},default:function(){return f}});var n=r(7462),i=r(3366),a=(r(7294),r(3905)),o=["components"],s={id:"SeriesOptionsMap",title:"Interface: SeriesOptionsMap",sidebar_label:"SeriesOptionsMap",sidebar_position:0,custom_edit_url:null},p=void 0,l={unversionedId:"api/interfaces/SeriesOptionsMap",id:"api/interfaces/SeriesOptionsMap",isDocsHomePage:!1,title:"Interface: SeriesOptionsMap",description:"Represents the type of options for each series type.",source:"@site/docs/api/interfaces/SeriesOptionsMap.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/SeriesOptionsMap",permalink:"/lightweight-charts/api/interfaces/SeriesOptionsMap",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"SeriesOptionsMap",title:"Interface: SeriesOptionsMap",sidebar_label:"SeriesOptionsMap",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"SeriesOptionsCommon",permalink:"/lightweight-charts/api/interfaces/SeriesOptionsCommon"},next:{title:"SeriesPartialOptionsMap",permalink:"/lightweight-charts/api/interfaces/SeriesPartialOptionsMap"}},c=[{value:"Properties",id:"properties",children:[{value:"Area",id:"area",children:[],level:3},{value:"Bar",id:"bar",children:[],level:3},{value:"Baseline",id:"baseline",children:[],level:3},{value:"Candlestick",id:"candlestick",children:[],level:3},{value:"Histogram",id:"histogram",children:[],level:3},{value:"Line",id:"line",children:[],level:3}],level:2}],u={toc:c};function f(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Represents the type of options for each series type."),(0,a.kt)("p",null,"For example a bar series has options represented by ",(0,a.kt)("a",{parentName:"p",href:"../#barseriesoptions"},"BarSeriesOptions"),"."),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"area"},"Area"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Area"),": ",(0,a.kt)("a",{parentName:"p",href:"../#areaseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"AreaSeriesOptions"))),(0,a.kt)("p",null,"The type of area series options."),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"bar"},"Bar"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Bar"),": ",(0,a.kt)("a",{parentName:"p",href:"../#barseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"BarSeriesOptions"))),(0,a.kt)("p",null,"The type of bar series options."),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"baseline"},"Baseline"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Baseline"),": ",(0,a.kt)("a",{parentName:"p",href:"../#baselineseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"BaselineSeriesOptions"))),(0,a.kt)("p",null,"The type of baseline series options."),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"candlestick"},"Candlestick"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Candlestick"),": ",(0,a.kt)("a",{parentName:"p",href:"../#candlestickseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"CandlestickSeriesOptions"))),(0,a.kt)("p",null,"The type of candlestick series options."),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"histogram"},"Histogram"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Histogram"),": ",(0,a.kt)("a",{parentName:"p",href:"../#histogramseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"HistogramSeriesOptions"))),(0,a.kt)("p",null,"The type of histogram series options."),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"line"},"Line"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"Line"),": ",(0,a.kt)("a",{parentName:"p",href:"../#lineseriesoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"LineSeriesOptions"))),(0,a.kt)("p",null,"The type of line series options."))}f.isMDXComponent=!0}}]);