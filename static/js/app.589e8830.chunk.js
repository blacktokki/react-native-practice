(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{107:function(e,t,n){var r={initialRouteName:"TabOne",repo:"https://github.com/blacktokki/react-native-practice.git",packages:["core"],rootPath:"/react-native-practice"};try{Object.assign(r,n(282).default)}catch(a){}e.exports=r},206:function(e,t,n){var r={"./core/screens":332};function a(e){var t=o(e);return n(t)}function o(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}a.keys=function(){return Object.keys(r)},a.resolve=o,e.exports=a,a.id=206},215:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return h}));var r=n(253),a=n(0),o=n.n(a),i=n(335),l=n(216),c=n(93),s=n(255),u=n(252),d=n.n(u);e.versions&&e.versions.electron&&function(){var e=window.XMLHttpRequest.prototype.open;window.XMLHttpRequest.prototype.open=function(){window.location.href!=window.location.origin+"/"&&sessionStorage.setItem("_href",window.location.href),window.history.replaceState(null,"",window.location.origin);var t=[];return e.apply(this,t.slice.call(arguments))}}(),function(e){if(void 0!==e&&"/"===e.search[1]){var t=e.search.slice(1).split("&").map((function(e){return e.replace(/~and~/g,"&")})).join("?");window.history.replaceState(null,"",e.pathname.slice(0,-1)+t+e.hash)}}(window.location);var f=["ReactNativeFiberHostComponent"],p=d.a.clone(console);function h(){var t=Object(l.a)(),n=Object(c.a)();if(t){if(e.versions&&e.versions.electron)if("win32"==e.platform)window.history.replaceState(null,"","file:///");else{var a=sessionStorage.getItem("_href");window.history.replaceState(null,"",a||"/")}return o.a.createElement(i.b,null,o.a.createElement(s.a,{colorScheme:n}),o.a.createElement(r.a,null))}return null}console.warn=function(e){var t=!0;e instanceof Object?t=!1:f.forEach((function(n){e.indexOf&&e.indexOf(n)<=-1&&(t=!1)})),t&&p.warn(e)}}).call(this,n(178))},216:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var r=n(9),a=n.n(r),o=n(15),i=n.n(o),l=n(7),c=n.n(l),s=n(333),u=n(334),d=n(175),f=n(0);function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){a()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function m(){var e=f.useState(!1),t=i()(e,2),r=t[0],a=t[1];return f.useEffect((function(){c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,d.b(),e.next=4,c.a.awrap(u.b(h(h({},s.a.font),{},{"space-mono":n(281)})));case 4:e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.warn(e.t0);case 9:return e.prev=9,a(!0),d.a(),e.finish(9);case 13:case"end":return e.stop()}}),null,null,[[0,6,9,13]],Promise)}),[]),r}},255:function(e,t,n){"use strict";n.d(t,"a",(function(){return R}));var r=n(214),a=n(212),o=n(90),i=n(344),l=n(0),c=n(6),s=n(30),u=n(48),d=n(4);function f(e){var t=e.navigation;return l.createElement(d.a,{style:p.container},l.createElement(s.a,{style:p.title},"This screen doesn't exist."),l.createElement(u.a,{onPress:function(){return t.replace("Root")},style:p.link},l.createElement(s.a,{style:p.linkText},"Go to home screen!")))}var p=c.a.create({container:{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center",padding:20},title:{fontSize:20,fontWeight:"bold"},link:{marginTop:15,paddingVertical:15},linkText:{fontSize:14,color:"#2e78b7"}}),h=n(41),m=n.n(h),g=n(333),b=n(343),y=n(153),v=n(94),O=n(93),E={},x=n(107),S=n.n(x),k=Object(b.a)(),C=S.a.packages.reduce((function(e,t){var r=n(206)("./"+t+"/screens");return e.concat(Object.keys(r.default).map((function(e){return function(e,t,n){var r=e.substring(0,e.lastIndexOf("Screen"));return E[r]=void 0,l.createElement(k.Screen,{key:r,name:r,component:j(e,t,n),options:{drawerIcon:function(e){var t=e.color;return l.createElement(T,{name:"ios-code",color:t})}}})}(e,r.default[e].component,r.default[e].title)})))}),[]);function w(){var e=Object(O.a)();return l.createElement(k.Navigator,{initialRouteName:S.a.initialRouteName,screenOptions:{},drawerContentOptions:{activeTintColor:v.a[e].tint}},C)}function T(e){return l.createElement(g.a,m()({size:30,style:{marginBottom:-3}},e))}function j(e,t,n){var r=Object(i.a)();return function(a){var o=a.navigation;return l.createElement(r.Navigator,null,l.createElement(r.Screen,{name:e,component:t,options:{headerTitle:n,headerLeft:function(){return l.createElement(y.a,{onPress:function(){return o.openDrawer()},title:"Menu",color:"#888"})}}}))}}var P=n(254),D=S.a.packages.reduce((function(e,t){var r=n(206)("./"+t+"/screens");return Object.keys(r.default).reduce((function(e,t){var n={};return n[t]=r.default[t].url,e[t.substring(0,t.lastIndexOf("Screen"))]={screens:n},e}),e),e}),{}),I={prefixes:[P.a("/")],config:{screens:{Root:{path:S.a.rootPath,screens:D},NotFound:"*"}}};function R(e){var t=e.colorScheme;return l.createElement(r.a,{linking:I,theme:"dark"===t?a.a:o.a},l.createElement(_,null))}var z=Object(i.a)();function _(){return l.createElement(z.Navigator,{screenOptions:{headerShown:!1}},l.createElement(z.Screen,{name:"Root",component:w}),l.createElement(z.Screen,{name:"NotFound",component:f,options:{title:"Oops!"}}))}},265:function(e,t,n){e.exports=n(331)},281:function(e,t,n){e.exports=n.p+"./fonts/SpaceMono-Regular.ttf"},282:function(e,t,n){"use strict";n.r(t),t.default={initialRouteName:"TabOne",repo:"https://github.com/blacktokki/react-native-practice.git",packages:["core"],rootPath:"/react-native-practice"}},325:function(e,t){},332:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(6),i=n(30),l=n(153),c=n(4),s=n(48),u=n(39),d=n(2),f=n(20),p=n(342),h=n(9),m=n.n(h),g=n(8),b=n.n(g),y=n(10),v=n.n(y),O=n(13),E=n.n(O),x=n(14),S=n.n(x),k=n(3),C=n.n(k),w=n(12),T=n.n(w),j=n(56);function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?P(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function I(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=C()(e);if(t){var a=C()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return S()(this,n)}}var R=function(e){E()(n,e);var t=I(n);function n(){var e;b()(this,n);for(var r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a))).state={expanded:e.props.initExpanded,maxHeight:null,style:{overflow:"hidden"},onCloseCallback:function(){}},e.mount=!1,e.useCloseCallback=!1,e}return v()(n,[{key:"setExpand",value:function(e){this.mount&&this.setState({expanded:e})}},{key:"onClose",value:function(e){this.useCloseCallback=!0,f.a.timing(this.state.style.height,{toValue:0,duration:0,useNativeDriver:!1}).start(),this.setState({expanded:!1,style:{overflow:"hidden",height:new f.a.Value(0)},onCloseCallback:e})}},{key:"componentDidMount",value:function(){this.props.initExpanded&&this.props.closeAll(),this.mount=!0}},{key:"componentWillUnmount",value:function(){this.mount=!1}},{key:"componentDidUpdate",value:function(){void 0!==this.state.style.height&&null!==this.state.maxHeight?this.state.expanded&&0==this.state.style.height._value?f.a.timing(this.state.style.height,{toValue:this.state.maxHeight,duration:this.props.expandSpeed,useNativeDriver:!1}).start():this.state.expanded||this.state.style.height._value!=this.state.maxHeight||f.a.timing(this.state.style.height,{toValue:0,duration:this.props.expandSpeed,useNativeDriver:!1}).start():null!==this.state.maxHeight&&this.setState({style:{overflow:"hidden",height:new f.a.Value(0)}}),this.useCloseCallback&&(this.useCloseCallback=!1,setTimeout(this.state.onCloseCallback,100))}},{key:"onPress",value:function(e){this.props.closeAll(),this.setExpand(!0)}},{key:"render",value:function(){var e=this,t=[this.props.holderStyle,{opacity:null==this.state.maxHeight?0:100}];return this.props.horizontal&&t.push({height:"100%",backgroundColor:"rgba(0, 0, 0, 0)"}),this.props.renderItem({item:this.props.item,holderStyle:t,buttonOnPress:this.onPress.bind(this),contentStyle:this.state.style,contentOnLayout:function(t){var n=t.nativeEvent.layout,r=(n.x,n.y,n.width,n.height);null==e.state.maxHeight&&e.setState({maxHeight:r})}.bind(this),onClose:this.onClose.bind(this)})}}]),n}(r.Component),z=function(e){E()(n,e);var t=I(n);function n(e){var r;return b()(this,n),(r=t.call(this,e)).update_Layout=function(){r.childrenRef.forEach((function(e){e&&e.state.expanded&&e.setExpand(!1)}))},r.renderItem=function(e){return a.a.createElement(R,{ref:function(e){r.childrenRef.push(e)},numnum:e.index,key:e.index,holderStyle:r.props.holderStyle,horizontal:r.props.horizontal,closeAll:r.update_Layout.bind(T()(r)),item:e.item,initExpanded:e.initExpanded,expandSpeed:r.expandSpeed,renderItem:function(t){return r.props.renderItem(D(D({},t),e))}})},r.childrenRef=[],r.expandSpeed=e.expandSpeed||200,r}return v()(n,[{key:"render",value:function(){var e=this;return a.a.createElement(c.a,{style:_.MainContainer},a.a.createElement(j.a,{contentContainerStyle:{paddingHorizontal:10,paddingVertical:5}},this.props.data.map((function(t,n){return e.renderItem({item:t,index:n,initExpanded:!1})}))))}}]),n}(r.Component),_=o.a.create({MainContainer:{flex:1,justifyContent:"center",paddingTop:"ios"===d.a.OS?20:0}}),L=n(15),H=n.n(L),B=n(156),N=n(174),F=Object(N.a)((function(e){var t=Object(r.useState)(e.data.length),n=H()(t,2),o=n[0],i=n[1],l=Object(r.useRef)(null);return Object(r.useEffect)((function(){var t,n;(o!=e.data.length&&e.last>0&&(o<e.data.length&&e.last==e.data.length&&setTimeout((function(){var e;null==(e=l.current)||e.scrollToEnd()}),e.scrollDelay),i(e.data.length)),o<e.data.length&&1==e.last)&&(null==(n=l.current)||n.scrollToIndex({animated:!0,index:1}));var r=(null==(t=l.current)?void 0:t.getNativeScrollRef()).getScrollableNode();if(r&&e.horizontal){var a=function(e){0!=e.deltaY&&(e.preventDefault(),r.scrollTo({left:r.scrollLeft+e.deltaY}))};return r.addEventListener("wheel",a),function(){return r.removeEventListener("wheel",a)}}})),a.a.createElement(B.a,{ref:l,renderItem:e.renderItem,data:e.data,scrollEnabled:e.scrollEnabled,keyExtractor:function(e,t){return t.toString()},horizontal:e.horizontal,removeClippedSubviews:!0,windowSize:10+Math.floor(e.data.length/2),ListFooterComponent:e.ListFooterComponent,onScroll:e.onScroll})})),A=Object(N.b)((function(e){return e.children}));var V=function(e){var t=Object(r.useState)(e.data),n=H()(t,2),o=n[0],i=n[1],l=Object(r.useState)(e.data.length),s=H()(l,2),u=s[0],d=s[1],f=Object(r.useRef)({}),p=Object(r.useCallback)((function(t){var n=t.item,r=t.index;t.isActive;return r in f.current&&f.current[r][0]==n||(f.current[r]=[n,a.a.createElement(A,{key:r,index:r},e.renderItem({item:n,index:r}))]),f.current[r][1]}),[]),h=Object(r.useCallback)((function(){return o}),[o]),m=Object(r.useCallback)((function(t,n){var r=o.map((function(e){return e}));r.splice(n,0,t),i(r),e.dataCallback(r),d(n+1)}),[o,u]),g=Object(r.useCallback)((function(t){var n=o.map((function(e){return e}));return n.splice(t,1),i(n),e.dataCallback(n),d(-1),o[t]}),[o]),b=Object(r.useCallback)((function(t,n){if(t!=n){var r=o.map((function(e){return e}));r.splice(t,0,r.splice(n,1)[0]),i(r),e.dataCallback(r)}}),[o]);return e.commandSetter&&e.commandSetter({getData:h,add:m,remove:g,shift:b}),a.a.createElement(c.a,{style:{height:e.height}},a.a.createElement(F,{data:o,renderItem:p,keyExtractor:e.keyExtractor,onSortEnd:function(e){var t=e.newIndex,n=e.oldIndex;return b(t,n)},distance:e.sortEnabled?5:99999,scrollEnabled:e.scrollEnabled,ListFooterComponent:e.ListFooterComponent,last:u,horizontal:e.horizontal,scrollDelay:e.scrollDelay||.5*o.length,updateBeforeSortStart:e.updateBeforeSortStart,onScroll:e.onScroll}))};function M(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function G(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?M(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):M(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function W(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=C()(e);if(t){var a=C()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return S()(this,n)}}var U=function(e){E()(n,e);var t=W(n);function n(){var e;b()(this,n);for(var r=arguments.length,a=new Array(r),o=0;o<r;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a))).initExpanded=!1,e.renderDraggableItem=function(t){return e.renderItem(G(G({},t),{},{initExpanded:e.initExpanded}))},e.updateBeforeSortStart=function(){e.childrenRef.forEach((function(e){e&&e.state.expanded&&e.onClose((function(){}))}))},e}return v()(n,[{key:"componentDidMount",value:function(){this.initExpanded=!0}},{key:"render",value:function(){return a.a.createElement(c.a,{style:q.MainContainer},a.a.createElement(V,{data:this.props.data,dataCallback:this.props.dataCallback,commandSetter:this.props.commandSetter,renderItem:this.renderDraggableItem,sortEnabled:this.props.sortEnabled,height:this.props.height,keyExtractor:function(e,t){return""+t},scrollDelay:2*this.expandSpeed,horizontal:this.props.horizontal,updateBeforeSortStart:this.updateBeforeSortStart,onScroll:this.props.onScroll,ListFooterComponent:this.props.ListFooterComponent}))}}]),n}(z),q=o.a.create({MainContainer:{flex:1,justifyContent:"center",paddingTop:"ios"===d.a.OS?20:0}}),J=function(e){var t=e.item,n=(e.index,e.drag,e.isActive),r=e.holderStyle,o=e.buttonOnPress,i=e.contentStyle,l=e.contentOnLayout;e.onClose;return a.a.createElement(c.a,{style:r},a.a.createElement(s.a,{activeOpacity:.7,onPress:o,style:{padding:10,backgroundColor:"#888"}},t.header),a.a.createElement(f.a.View,{style:[i,n?{height:0}:{}],onLayout:l},t.body))},X=function(e){return a.a.createElement(s.a,{style:{backgroundColor:e.isActive?"red":"white",marginRight:"web"==d.a.OS?0:5,alignItems:"center",justifyContent:"center"},onLongPress:function(){e.drag&&e.onClose(e.drag)}},J(e))},Y=function(e){return a.a.createElement(c.a,{style:{backgroundColor:"white",marginRight:0,alignItems:"center",justifyContent:"center"}},J(e))};function K(e){var t=Object(p.a)(),n=a.a.Children.toArray(e.children).map((function(t,n){return{header:e.header[n]||a.a.createElement(c.a,null),body:t}})),r=void 0===e.sortEnabled||e.sortEnabled,o=r?X:Y,i=u.a.get("window").height-t;return a.a.createElement(U,{data:n,commandSetter:e.commandSetter,dataCallback:e.dataCallback,sortEnabled:r,scrollEnabled:e.scrollEnabled,height:i,holderStyle:e.holderStyle,renderItem:function(t){return a.a.createElement(c.a,{style:e.horizontal?{minHeight:0,width:u.a.get("window").width}:{flex:1}},o(t))},keyExtractor:function(e,t){return"main-draggable-item-"+t},horizontal:e.horizontal,onScroll:e.onScroll,ListFooterComponent:e.ListFooterComponent})}var Q=n(41),Z=n.n(Q),$=n(16),ee=n.n($),te=n(94),ne=n(93);function re(e,t){var n=Object(ne.a)(),r=e[n];return r||te.a[n][t]}function ae(e){var t=e.style,n=e.lightColor,a=e.darkColor,o=ee()(e,["style","lightColor","darkColor"]),l=re({light:n,dark:a},"text");return r.createElement(i.a,Z()({style:[{color:l},t]},o))}function oe(e){var t=e.style,n=e.lightColor,a=e.darkColor,o=ee()(e,["style","lightColor","darkColor"]),i=re({light:n,dark:a},"background");return r.createElement(c.a,Z()({style:[{backgroundColor:i},t]},o))}var ie=n(256);function le(e){return r.createElement(ae,Z()({},e,{style:[e.style,{fontFamily:"space-mono"}]}))}function ce(e){var t=e.path;return a.a.createElement(oe,null,a.a.createElement(oe,{style:ue.getStartedContainer},a.a.createElement(ae,{style:ue.getStartedText,lightColor:"rgba(0,0,0,0.8)",darkColor:"rgba(255,255,255,0.8)"},"Open up the code for this screen:"),a.a.createElement(oe,{style:[ue.codeHighlightContainer,ue.homeScreenFilename],darkColor:"rgba(255,255,255,0.05)",lightColor:"rgba(0,0,0,0.05)"},a.a.createElement(le,null,t)),a.a.createElement(ae,{style:ue.getStartedText,lightColor:"rgba(0,0,0,0.8)",darkColor:"rgba(255,255,255,0.8)"},"Change any of the text, save the file, and your app will automatically update.")),a.a.createElement(oe,{style:ue.helpContainer},a.a.createElement(s.a,{onPress:se,style:ue.helpLink},a.a.createElement(ae,{style:ue.helpLinkText,lightColor:te.a.light.tint},"Tap here if your app doesn't automatically update after making changes"))))}function se(){ie.a("https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet")}var ue=o.a.create({getStartedContainer:{alignItems:"center",marginHorizontal:50},homeScreenFilename:{marginVertical:7},codeHighlightContainer:{borderRadius:3,paddingHorizontal:4},getStartedText:{fontSize:17,lineHeight:24,textAlign:"center"},helpContainer:{marginTop:15,marginHorizontal:20,alignItems:"center"},helpLink:{paddingVertical:15},helpLinkText:{textAlign:"center"}});function de(e){return r.createElement(oe,{style:fe.container},r.createElement(s.a,{onPress:e.onPress1,style:fe.link},r.createElement(ae,{style:fe.linkText},e.pressText1)),r.createElement(ae,{style:fe.title},e.title),r.createElement(oe,{style:fe.separator,lightColor:"#eee",darkColor:"rgba(255,255,255,0.1)"}),r.createElement(ce,{path:e.path}))}var fe=o.a.create({container:{flex:1,alignItems:"center",justifyContent:"center"},title:{fontSize:20,fontWeight:"bold"},separator:{marginVertical:30,height:1,width:"80%"},link:{marginTop:15,paddingVertical:15},linkText:{fontSize:14,color:"#2e78b7"}});var pe=o.a.create({Panel_Button_Text:{textAlign:"center",color:"#fff",fontSize:21},Panel_Holder:{borderWidth:1,borderColor:"#888",marginVertical:5}});var he=o.a.create({Panel_text:{fontSize:18,color:"#000",padding:10},Panel_Button_Text:{textAlign:"center",color:"#fff",fontSize:21},Panel_Holder:{borderWidth:1,borderColor:"#888",marginVertical:5}});var me=o.a.create({Panel_text:{fontSize:18,color:"#000",padding:10},Panel_Button_Text:{textAlign:"center",color:"#fff",fontSize:21},Panel_Holder:{borderWidth:1,borderColor:"#888"}});t.default={TabOneScreen:{component:function(e){for(var t=e.navigation,n=(Object(r.useRef)(null),{}),o=Object(r.useCallback)((function(e){console.log("dataCallback")}),[]),c=[],s=[],u=0;u<10;u++)c[u]=a.a.createElement(i.a,{style:pe.Panel_Button_Text},"Tab One"+(u+1)," "),s[u]=a.a.createElement(de,{key:u,title:"Tab One"+(u+1),pressText1:"Go 2 screen!",onPress1:function(){t.navigate("TabTwo")},path:"/screens/TabOneScreen.tsx"});return a.a.createElement(K,{header:c,commandSetter:function(e){Object.assign(n,e)},dataCallback:o,ListFooterComponent:a.a.createElement(l.a,{onPress:function(){n.add({header:a.a.createElement(i.a,{style:pe.Panel_Button_Text},"Tab One"+(n.getData().length+1)," "),body:a.a.createElement(de,{title:"Tab One"+(n.getData().length+1),pressText1:"Go 2 screen!",onPress1:function(){t.navigate("TabTwo")},path:"/screens/TabOneScreen.tsx"})},n.getData().length)},title:"add",color:"#888"})},s)},title:"Tab One Title",url:"one"},TabTwoScreen:{component:function(e){var t=e.navigation;return r.createElement(K,{header:[r.createElement(i.a,{style:he.Panel_Button_Text},"Tab Two 1"," "),r.createElement(i.a,{style:he.Panel_Button_Text},"Tab Two 2"," ")],dataCallback:function(){},holderStyle:he.Panel_Holder,sortEnabled:!1},r.createElement(de,{title:"Tab Two",pressText1:"Go 1 screen!",onPress1:function(){t.navigate("TabOne")},path:"/screens/TabTwoScreen.tsx"}),r.createElement(de,{title:"Tab Two",pressText1:"Go 1 screen!",onPress1:function(){t.navigate("TabOne")},path:"/screens/TabTwoScreen.tsx"}),r.createElement(de,{title:"Tab Two",pressText1:"Go 1 screen!",onPress1:function(){t.navigate("TabOne")},path:"/screens/TabTwoScreen.tsx"}))},title:"Tab Two Title",url:"two"},TabThreeScreen:{component:function(e){for(var t=e.navigation,n=[],r=[],o=0;o<10;o++)n[o]=a.a.createElement(i.a,{style:me.Panel_Button_Text},"Tab One"+(o+1)," "),r[o]=a.a.createElement(de,{key:o,title:"Tab One"+(o+1),pressText1:"Go 2 screen!",onPress1:function(){t.navigate("TabTwo")},path:"/screens/TabOneScreen.tsx"});var l={};return a.a.createElement(K,{header:n,commandSetter:function(e){Object.assign(l,e)},dataCallback:function(){},holderStyle:me.Panel_Holder,sortEnabled:!1,horizontal:!0,onScroll:function(e){var t=e.nativeEvent;if(t.contentOffset.x+t.layoutMeasurement.width>=t.contentSize.width){var n=l.remove(0);setTimeout((function(){return l.add(n,l.getData().length)}),200)}else if(0==t.contentOffset.x){var r=l.remove(l.getData().length-1);setTimeout((function(){return l.add(r,0)}),200)}}},r)},title:"Tab Three Title",url:"three"}}},93:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(258);function a(){return Object(r.a)()}},94:function(e,t,n){"use strict";t.a={light:{text:"#000",background:"#fff",tint:"#2f95dc",tabIconDefault:"#ccc",tabIconSelected:"#2f95dc"},dark:{text:"#fff",background:"#000",tint:"#fff",tabIconDefault:"#ccc",tabIconSelected:"#fff"}}}},[[265,1,2]]]);
//# sourceMappingURL=app.589e8830.chunk.js.map