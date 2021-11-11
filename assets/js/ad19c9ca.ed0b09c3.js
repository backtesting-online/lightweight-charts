"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4442],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=p(n),d=a,f=m["".concat(l,".").concat(d)]||m[d]||c[d]||i;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1810:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],s={sidebar_position:2},l="Time",p={unversionedId:"data/time",id:"data/time",isDocsHomePage:!1,title:"Time",description:"This article contains descriptions of types to represent the time of data items.",source:"@site/docs/data/time.md",sourceDirName:"data",slug:"/data/time",permalink:"/lightweight-charts/data/time",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Whitespace Data",permalink:"/lightweight-charts/data/whitespace-data"},next:{title:"Series Basics",permalink:"/lightweight-charts/series/series-basics"}},u=[{value:"UNIX timestamp",id:"unix-timestamp",children:[],level:2},{value:"Business day object",id:"business-day-object",children:[],level:2},{value:"Business day string",id:"business-day-string",children:[],level:2}],c={toc:u};function m(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"time"},"Time"),(0,i.kt)("p",null,"This article contains descriptions of types to represent the time of data items."),(0,i.kt)("h2",{id:"unix-timestamp"},"UNIX timestamp"),(0,i.kt)("p",null,"If your chart displays an intraday interval, you should use a UNIX Timestamp format for time point data transfer."),(0,i.kt)("p",null,"Note that to prevent errors, you should cast the numeric type of the time to ",(0,i.kt)("inlineCode",{parentName:"p"},"UTCTimestamp")," (it's a nominal type) type from the package (",(0,i.kt)("inlineCode",{parentName:"p"},"value as UTCTimestamp"),") in TypeScript code."),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const timestamp = 1529884800; // June 25, 2018\n")),(0,i.kt)("h2",{id:"business-day-object"},"Business day object"),(0,i.kt)("p",null,"This type is used to specify time for DWM data."),(0,i.kt)("p",null,"This format uses objects where year, month and day are shown as separate fields:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"year")," (",(0,i.kt)("inlineCode",{parentName:"li"},"number"),") - year"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"month")," (",(0,i.kt)("inlineCode",{parentName:"li"},"number"),") - month"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"day")," (",(0,i.kt)("inlineCode",{parentName:"li"},"number"),") - day")),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const day = { year: 2019, month: 6, day: 1 }; // June 1, 2019\n")),(0,i.kt)("h2",{id:"business-day-string"},"Business day string"),(0,i.kt)("p",null,"This format is shorter than business day format. It allows you to specify dates using an ISO string format (",(0,i.kt)("inlineCode",{parentName:"p"},"YYYY-MM-DD"),")."),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const timestamp = '2018-06-25'; // June 25, 2018\n")))}m.isMDXComponent=!0}}]);