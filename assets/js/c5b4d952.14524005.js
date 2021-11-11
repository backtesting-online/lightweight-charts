"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6884],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return k}});var n=t(7294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=n.createContext({}),p=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},c=function(e){var r=p(e.components);return n.createElement(s.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=p(t),k=i,h=d["".concat(s,".").concat(k)]||d[k]||u[k]||o;return t?n.createElement(h,l(l({ref:r},c),{},{components:t})):n.createElement(h,l({ref:r},c))}));function k(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,l=new Array(o);l[0]=d;var a={};for(var s in r)hasOwnProperty.call(r,s)&&(a[s]=r[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,l[1]=a;for(var p=2;p<o;p++)l[p]=t[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},3996:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return a},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var n=t(7462),i=t(3366),o=(t(7294),t(3905)),l=["components"],a={id:"AreaStyleOptions",title:"Interface: AreaStyleOptions",sidebar_label:"AreaStyleOptions",sidebar_position:0,custom_edit_url:null},s=void 0,p={unversionedId:"api/interfaces/AreaStyleOptions",id:"api/interfaces/AreaStyleOptions",isDocsHomePage:!1,title:"Interface: AreaStyleOptions",description:"Represents style options for an area series.",source:"@site/docs/api/interfaces/AreaStyleOptions.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/AreaStyleOptions",permalink:"/lightweight-charts/api/interfaces/AreaStyleOptions",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"AreaStyleOptions",title:"Interface: AreaStyleOptions",sidebar_label:"AreaStyleOptions",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"TickMarkType",permalink:"/lightweight-charts/api/enums/TickMarkType"},next:{title:"AutoScaleMargins",permalink:"/lightweight-charts/api/interfaces/AutoScaleMargins"}},c=[{value:"Properties",id:"properties",children:[{value:"bottomColor",id:"bottomcolor",children:[],level:3},{value:"crosshairMarkerBackgroundColor",id:"crosshairmarkerbackgroundcolor",children:[],level:3},{value:"crosshairMarkerBorderColor",id:"crosshairmarkerbordercolor",children:[],level:3},{value:"crosshairMarkerRadius",id:"crosshairmarkerradius",children:[],level:3},{value:"crosshairMarkerVisible",id:"crosshairmarkervisible",children:[],level:3},{value:"lastPriceAnimation",id:"lastpriceanimation",children:[],level:3},{value:"lineColor",id:"linecolor",children:[],level:3},{value:"lineStyle",id:"linestyle",children:[],level:3},{value:"lineType",id:"linetype",children:[],level:3},{value:"lineWidth",id:"linewidth",children:[],level:3},{value:"topColor",id:"topcolor",children:[],level:3}],level:2}],u={toc:c};function d(e){var r=e.components,t=(0,i.Z)(e,l);return(0,o.kt)("wrapper",(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Represents style options for an area series."),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("h3",{id:"bottomcolor"},"bottomColor"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"bottomColor"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"Color of the bottom part of the area."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"crosshairmarkerbackgroundcolor"},"crosshairMarkerBackgroundColor"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"crosshairMarkerBackgroundColor"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"The crosshair marker background color. An empty string falls back to the the color of the series under the crosshair."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"crosshairmarkerbordercolor"},"crosshairMarkerBorderColor"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"crosshairMarkerBorderColor"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"Crosshair marker border color. An empty string falls back to the the color of the series under the crosshair."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"crosshairmarkerradius"},"crosshairMarkerRadius"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"crosshairMarkerRadius"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"number")),(0,o.kt)("p",null,"Crosshair marker radius in pixels."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"crosshairmarkervisible"},"crosshairMarkerVisible"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"crosshairMarkerVisible"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"boolean")),(0,o.kt)("p",null,"Show the crosshair marker."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"lastpriceanimation"},"lastPriceAnimation"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"lastPriceAnimation"),": ",(0,o.kt)("a",{parentName:"p",href:"../enums/LastPriceAnimationMode"},(0,o.kt)("inlineCode",{parentName:"a"},"LastPriceAnimationMode"))),(0,o.kt)("p",null,"Last price animation mode."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"linecolor"},"lineColor"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"lineColor"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"Line color."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"linestyle"},"lineStyle"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"lineStyle"),": ",(0,o.kt)("a",{parentName:"p",href:"../enums/LineStyle"},(0,o.kt)("inlineCode",{parentName:"a"},"LineStyle"))),(0,o.kt)("p",null,"Line style."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"linetype"},"lineType"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"lineType"),": ",(0,o.kt)("a",{parentName:"p",href:"../enums/LineType"},(0,o.kt)("inlineCode",{parentName:"a"},"LineType"))),(0,o.kt)("p",null,"Line type."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"linewidth"},"lineWidth"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"lineWidth"),": ",(0,o.kt)("a",{parentName:"p",href:"../#linewidth"},(0,o.kt)("inlineCode",{parentName:"a"},"LineWidth"))),(0,o.kt)("p",null,"Line width in pixels."),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"topcolor"},"topColor"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"topColor"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"Color of the top part of the area."))}d.isMDXComponent=!0}}]);