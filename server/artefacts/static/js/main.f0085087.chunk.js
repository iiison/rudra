(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{100:function(e,t){},104:function(e,t,n){},105:function(e,t,n){},125:function(e,t,n){},129:function(e,t,n){},130:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"test",(function(){return g})),n.d(a,"home",(function(){return w})),n.d(a,"wrapper",(function(){return _}));var o=n(0),i=n.n(o),r=n(22),c=n.n(r),l=n(10),s=n(16),u=n(59),m=n.n(u),f=n(4),d=n.n(f),p=n(2),h=n(60),v=n(14);n(33),n(61);var E={isFetching:!1,isAuthed:!1,error:""};function g(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:E,t=arguments.length>1?arguments[1]:void 0,n={GET_USER:function(){return Object(p.a)({},e,{isFetching:!0})},GET_USER_FAILURE:function(){return Object(p.a)({},e,{isFetching:!1,error:t.error})},GET_USER_SUCCESS:function(){return Object(p.a)({},e,{isFetching:!1,error:"",userInfo:t.response})}};return t.type&&n[t.type]?n[t.type]():e}var b=n(17);function O(e,t){return{type:"".concat(e).concat({success:"_SUCCESS",failure:"_FAILURE"}[t])}}var j={isFetching:!0,error:""};function N(e){var t=e.actionName,n=e.additionalActions,a=e.initialState,o=void 0===a?j:a,i=e.shouldMergeDefaultStates,r=void 0!==i&&i?Object(p.a)({},j,{},o):o;return function(){var e,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,o=arguments.length>1?arguments[1]:void 0,i=n?n(a,o):{},c=Object(p.a)((e={},Object(b.a)(e,t,(function(){return Object(p.a)({},a,{isFetching:!0})})),Object(b.a)(e,O(t,"failure").type,(function(){return Object(p.a)({},a,{isFetching:!1,error:o.error})})),Object(b.a)(e,O(t,"success").type,(function(){return Object(p.a)({},a,{error:"",isFetching:!1,response:o.response})})),e),i);return o.type&&c[o.type]?c[o.type]():a}}var y=N({actionName:"file",shouldMergeDefaultStates:!0,initialState:{query:""},additionalActions:function(e,t){return{SET_QUERY_RESULTS:function(){return Object(p.a)({},e,{files:t.files})}}}});function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return{type:"SET_QUERY_RESULTS",files:e}}var w=y,C=N({shouldMergeDefaultStates:!0,actionName:"NOTIFICATION_CONTENT",additionalActions:function(e,t){return{SET_NOTIFICATIONS_CONTENT:function(){return Object(p.a)({},e,{content:t.content})},TOGGLE_CONTEXT:function(){return Object(p.a)({},e,{showContext:t.state||!e.showContext})}}},initialState:{showContext:!1,content:{title:"",options:[]}}});function T(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{type:"SET_NOTIFICATIONS_CONTENT",content:e}}function F(e){return{type:"TOGGLE_CONTEXT",state:e}}var _=C,I=Object(v.e)(Object(v.c)(Object(p.a)({},a)),Object(v.d)(Object(v.a)(h.a),window.__REDUX_DEVTOOLS_EXTENSION__?window.__REDUX_DEVTOOLS_EXTENSION__():function(e){return e})),k=n(13),x=n(7);n(104);var D=function(e){var t=e.event,n=e.className,a=void 0===n?"":n,r=e.returnData,c=void 0===r?{}:r,l=e.placeholder,s=void 0===l?"Enter value":l,u=Object(o.useState)(""),m=Object(x.a)(u,2),f=m[0],d=m[1],h=Object(o.useState)(!1),v=Object(x.a)(h,2),E=v[0],g=v[1],b=Object(o.useState)(!1),O=Object(x.a)(b,2),j=O[0],N=O[1];return Object(o.useEffect)((function(){return g(""!==f)}),[f]),i.a.createElement("div",{className:"input-wrapper"},i.a.createElement("input",{type:"text",value:f,disabled:j,placeholder:s,className:"input ".concat(a),onChange:function(e){d(e.target.value)},onKeyDown:function(e){var n=e.keyCode,a=e.target.value;a&&13===n&&(t&&t(Object(p.a)({value:a},c)),N(!0))}}),i.a.createElement("button",{className:"input-button ".concat(E&&!j&&"visible"),onClick:function(){t&&t(Object(p.a)({value:f},c)),N(!0)}},"ok"))},R=n(24),A=n.n(R);n(105);function U(e){var t=e.push,n=e.file,a=e.event,o=(e.pathname,e.filteredFiles),r=(e.setSelectedFile,e.isDirectory),c=void 0!==r&&r,l={js:i.a.createElement("i",{class:"fab fa-js-square"}),css:i.a.createElement("i",{class:"fab fa-css3-alt"}),tpl:i.a.createElement("i",{class:"fab fa-html5"}),html:i.a.createElement("i",{class:"fab fa-html5"}),jsx:i.a.createElement("i",{class:"fab fa-react"}),default:i.a.createElement("i",{class:"fas fa-code"}),directory:i.a.createElement("i",{class:"fas fa-folder-open"})};return o.map((function(e,o){var r,s=e.slice(e.lastIndexOf(".")+1);r=c?l.directory:l[s]||l.default;var u=c?null:function(){return function(e){var t=e.index,n=e.file;(0,e.push)("/explore/".concat(n,"/").concat(t))}({index:o,file:n,push:t})};return i.a.createElement("p",{onClick:u,className:"file-item"},r," ",i.a.createElement("span",{className:"file-name"},e),c&&i.a.createElement(D,{placeholder:"Directory Name",returnData:{fileName:e},event:a}))}))}var L=function(){var e=Object(o.useState)([]),t=Object(x.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)("Ask something to Rudra..."),c=Object(x.a)(r,2),s=c[0],u=c[1],m=Object(l.b)(),f=Object(k.g)(),p=Object(k.f)();return Object(o.useEffect)((function(){return function(e){var t=e.history,n=e.location,a=e.dispatch,o=e.setFiles,i=e.setMessage,r=e.setSelectedFile,c={hello:function(){d.a.trigger("go home"),i("Hey Man! Let's do this thing!"),o([])},"search for file *file":function(e){d.a.trigger("go home"),i("open ".concat(e)),V.emit("openFile",{operation:"open",file:e.split(" ")})},"select :fileIndex file":function(e){i("Selected ".concat(e))},"make new directory at *path":function(e){V.emit("make directory",{path:e.split(" "),operation:"list directory"})},"make new file at *path":function(e){V.emit("make file",{path:e.split(" "),operation:"list directory"})}};V.on("openFile",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},c=e.filteredFiles,l=e.file,s=t.push,u=n.pathname;c&&c.length?(i("I found ".concat(c.length," files:")),o(U({filteredFiles:c,setSelectedFile:r,push:s,pathname:u,file:l})),a(S(c))):(i("I couldn't find any file with this name: ".concat(l,".")),o([])),console.log(e)})),V.on("list directory",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};d.a.trigger("go home");var c=e.filteredDirs,l=e.path,s=e.listFor,u=t.push,m=n.pathname;c&&c.length?(i("I found ".concat(c.length," directories:")),o(U({push:u,pathname:m,setSelectedFile:r,file:l,isDirectory:!0,filteredFiles:c,event:function(e){var t=e.value,n=e.fileName;V.emit("make ".concat(s),{operation:"create ".concat(s),dirName:"".concat(n).concat(t)}),i("Making new ".concat(s," '").concat(t,"'..."))}})),a(S(c))):(i("I couldn't find any directories with this name: ".concat(l,".")),o([]))})),V.on("create directory status",(function(e){var t=e.exceptions,n=e.dirName;i(t?"Error occured: ".concat(t):"Created new directory at ".concat(n,".")),o([])})),d.a.addCommands(c)}({setMessage:u,setFiles:a,dispatch:m,location:f,history:p})}),[]),i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-header"},i.a.createElement("img",{className:"monk App-logo",src:A.a,alt:"logo"}),i.a.createElement("p",null,s,i.a.createElement("div",{className:"t-left"},n.length>0&&n))))},G=n(38);n(107),n(108),n(109),n(110),n(111),n(112),n(113),n(114),n(115),n(116),n(117);function M(e){var t=e.line,n=e.type,a=e.column,o=(e.ruleId,e.message);return i.a.createElement("div",{className:"lint-".concat(n)},"".concat(n.toUpperCase(),": ").concat(o," @ ").concat(t,":").concat(a))}var P=n(36),X=n.n(P);n(123),n(124),n(125),n(126),n(127),n(128);function q(){var e=Object(o.useState)(""),t=Object(x.a)(e,2),n=t[0],a=t[1],r=Object(o.useState)(1),c=Object(x.a)(r,2),s=c[0],u=c[1],m=Object(l.c)((function(e){return e.home})).files,f=Object(k.h)().index,h=Object(l.b)(),v=m[f];return Object(o.useEffect)((function(){return function(e){var t=e.dispatch,n=e.selectedFilePath,a=e.setCursorPosition,o=e.setRenderedContent;window.Ace=X.a;var i={"add variable at line number :line":function(e,t){V.emit("addNewItem",{line:e,name:t,type:"variable",file:n})},"add function at line number :line":function(e,t){V.emit("addNewItem",{line:e,name:t,type:"function",file:n})},"import library *libraryName":function(e){V.emit("import operation",{name:e,file:n,operation:"library import"})},"import file *fileName":function(e){V.emit("import operation",{name:e,file:n,operation:"file import"})},"import file from *fileName":function(e){V.emit("import operation",{name:e,file:n,operation:"file import"})}};V.on("renderFile",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.fileContent,n=e.cursorPosition,i=void 0===n?1:n;a(i),o(t)})),V.on("add new content",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.fileContent,n=e.line,i=parseInt(n,10);o(t),a(i)})),V.on("import operation",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.operation,a=e.query,o=e.operationOn,i=e.suggestions;if(n&&"show suggestions"===n){var r=i.length?"Choose one:":"Not found.";console.log("*******************"),console.log(i),console.log("*******************"),t(T({title:r,options:i,event:function(e){var t=e.active;e.options;V.emit("import operation",Object(p.a)({},a,{imortItem:t,operation:"".concat(o," import confirmation")}))}})),t(F())}})),V.on("show context",(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.type,a=e.data,o=a.meta,i=a.errors,r="Lint: ".concat(o.errorCount," Errors, ").concat(o.warningCount," Warnings"),c=[].concat(Object(G.a)(i.errors),Object(G.a)(i.warnings)).map((function(e){return e.key=e.message,e}));t(T({type:n,title:r,options:c,template:M,event:function(e){var t=e.active,n=e.options;return console.log(t,n)}})),t(F())})),d.a.addCommands(i)}({dispatch:h,selectedFilePath:v,setCursorPosition:u,setRenderedContent:a})}),[]),Object(o.useEffect)((function(){return V.emit("renderFile",{operation:"render",fileName:v})}),[]),console.log("*******************"),console.log(s),console.log("*******************"),i.a.createElement("div",{className:"editor-cont"},i.a.createElement("header",{className:"editor-header"},i.a.createElement("img",{className:"small-monk",src:A.a,alt:"logo"}),i.a.createElement("h1",null,"Rudra")),i.a.createElement("div",{className:"editor"},n&&i.a.createElement(X.a,{tabSize:2,width:"auto",fontSize:14,theme:"monokai",mode:"javascript",name:v,value:n,height:"calc(100vh - 62px)",cursorStart:s,editorProps:{$blockScrolling:!0},onChange:function(e){return a(e)}})))}var W=n(37);function z(e){var t=e.customEvent,n=Object(W.a)(e,["customEvent"]);return I.dispatch(T()),I.dispatch(F(!1)),t&&t(n)}function B(e){var t=e.value,n=e.customEvent,a=Object(W.a)(e,["value","customEvent"]);return n&&n(Object(p.a)({},a,{active:t}))}var J=function(e){var t=e.children,n=Object(k.g)(),a=Object(k.f)();Object(o.useEffect)((function(){return function(e){var t=e.history,n=e.location,a={"go home":function(){"/"!==n.pathname&&t.go("/")},"show context":function(){"/"!==n.pathname&&t.go("/")}};d.a.removeCommands(Object.keys(a)),d.a.addCommands(a)}({history:a,location:n})}),[n]);var r=Object(l.c)((function(e){return e.wrapper})),c=r.content,s=r.showContext,u=c.event,m=c.title,f=c.options,p=c.template;return i.a.createElement("div",null,t,s&&i.a.createElement("div",{className:"context-menu"},i.a.createElement("h2",{className:"context-title"},m),i.a.createElement("ul",{className:"context-options"},f.map((function(e){return i.a.createElement("li",{key:e.key||e,onClick:function(){return z({customEvent:u,active:e,options:f})}},p?p(e):e)})),0===f.length&&i.a.createElement("li",null,"Enter name in the input below:"),i.a.createElement("li",null,i.a.createElement(D,{returnData:{customEvent:u,active:"",options:f},event:B,placeholder:"Enter custom value?",className:"context-input"})))))},Q=function(e){return i.a.createElement("div",{className:"app grid"},i.a.createElement("div",{className:"col"},e?i.a.createElement(J,null,i.a.createElement(k.c,null,i.a.createElement(k.a,{exact:!0,path:"/",component:L}),i.a.createElement(k.a,{path:"/explore/:query/:index",component:q}))):i.a.createElement("div",null,"Speech Synthesis is not supported!")))};n(129),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n.d(t,"socket",(function(){return V}));var V=m()();d.a&&(d.a.setLanguage("en-IN"),d.a.start()),c.a.render(i.a.createElement(l.a,{store:I},i.a.createElement(s.a,null,Q(d.a))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},24:function(e,t,n){e.exports=n.p+"static/media/monk.188e60c7.png"},63:function(e,t,n){e.exports=n(130)}},[[63,1,2]]]);
//# sourceMappingURL=main.f0085087.chunk.js.map