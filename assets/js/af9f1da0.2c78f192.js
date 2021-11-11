"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5257],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),h=i,m=u["".concat(l,".").concat(h)]||u[h]||d[h]||a;return n?r.createElement(m,o(o({ref:t},p),{},{components:n})):r.createElement(m,o({ref:t},p))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},8664:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return p},default:function(){return u}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),o=["components"],s={},l="Candlestick Series",c={unversionedId:"series/candlestick-series",id:"series/candlestick-series",isDocsHomePage:!1,title:"Candlestick Series",description:"A candlestick chart shows price movements in the form of candlesticks.",source:"@site/docs/series/candlestick-series.md",sourceDirName:"series",slug:"/series/candlestick-series",permalink:"/lightweight-charts/series/candlestick-series",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Baseline series",permalink:"/lightweight-charts/series/baseline-series"},next:{title:"Histogram Series",permalink:"/lightweight-charts/series/histogram-series"}},p=[{value:"How to create candlestick series",id:"how-to-create-candlestick-series",children:[],level:2},{value:"Data format",id:"data-format",children:[],level:2},{value:"Customization",id:"customization",children:[{value:"Examples",id:"examples",children:[],level:3}],level:2}],d={toc:p};function u(e){var t=e.components,s=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},d,s,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"candlestick-series"},"Candlestick Series"),(0,a.kt)("p",null,"A candlestick chart shows price movements in the form of candlesticks."),(0,a.kt)("p",null,"On the candlestick chart, open & close values form a solid body of a candle while wicks show high & low values for a candlestick's time interval."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Candlestick chart example",src:n(9189).Z,title:"Candlestick chart example"})),(0,a.kt)("h2",{id:"how-to-create-candlestick-series"},"How to create candlestick series"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"const candlestickSeries = chart.addCandlestickSeries();\n\n// set data\ncandlestickSeries.setData([\n    { time: '2018-12-19', open: 141.77, high: 170.39, low: 120.25, close: 145.72 },\n    { time: '2018-12-20', open: 145.72, high: 147.99, low: 100.11, close: 108.19 },\n    { time: '2018-12-21', open: 108.19, high: 118.43, low: 74.22, close: 75.16 },\n    { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },\n    { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },\n    { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },\n    { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },\n    { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },\n    { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },\n    { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },\n    { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },\n    { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },\n    { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },\n]);\n")),(0,a.kt)("h2",{id:"data-format"},"Data format"),(0,a.kt)("p",null,"Each item of the candlestick series is either an ",(0,a.kt)("a",{parentName:"p",href:"/lightweight-charts/data/ohlc"},"OHLC")," or a ",(0,a.kt)("a",{parentName:"p",href:"/lightweight-charts/data/whitespace-data"},"whitespace")," item."),(0,a.kt)("h2",{id:"customization"},"Customization"),(0,a.kt)("p",null,"Colors for rising and falling candlesticks have to be set separately."),(0,a.kt)("p",null,"Candlestick borders and wicks are visible by default and may be disabled. Note that when wicks are disabled the candlestick doesn't show high and low price values."),(0,a.kt)("p",null,"Border and wick color can be either set for all candlesticks at once or for rising and falling candlesticks separately. If the latter is your preference please make sure that you don't use common options such as ",(0,a.kt)("inlineCode",{parentName:"p"},"borderColor")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"wickColor")," since they have higher priority compared to the specific ones."),(0,a.kt)("p",null,"Candlestick series interface can be customized using the following set of options: ",(0,a.kt)("a",{parentName:"p",href:"/api/interfaces/CandlestickStyleOptions"},"CandlestickStyleOptions"),"."),(0,a.kt)("h3",{id:"examples"},"Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"set initial options for candlestick series:"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-js"},"const candlestickSeries = chart.addCandlestickSeries({\n    upColor: '#6495ED',\n    downColor: '#FF6347',\n    borderVisible: false,\n    wickVisible: true,\n    borderColor: '#000000',\n    wickColor: '#000000',\n    borderUpColor: '#4682B4',\n    borderDownColor: '#A52A2A',\n    wickUpColor: '#4682B4',\n    wickDownColor: '#A52A2A',\n});\n"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"change options after series is created:"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-js"},"// for example, let's override up and down color of the candle\ncandlestickSeries.applyOptions({\n    upColor: 'rgba(255, 0, 0, 1)',\n    downColor: 'rgba(0, 255, 0, 1)',\n});\n")))))}u.isMDXComponent=!0},9189:function(e,t,n){t.Z=n.p+"assets/images/candlestick-series-b21c3c31e6e96452363150136b8d25c8.png"}}]);