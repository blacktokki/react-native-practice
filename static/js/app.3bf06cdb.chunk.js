(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{243:function(e,t,n){"use strict";n.d(t,"a",(function(){return ye}));var a=n(244),r=n(0),o=n.n(r),c=n(334),i=n(9),l=n.n(i),s=n(16),u=n.n(s),d=n(7),p=n.n(d),f=n(332),b=n(333),g=n(171);function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){l()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var v=n(248);function E(){return Object(v.a)()}var y=n(208),x=n(206),T=n(86),k=n(331),O=n(6),w=n(38),C=n(52),S=n(4);function j(e){var t=e.navigation;return r.createElement(S.a,{style:P.container},r.createElement(w.a,{style:P.title},"This screen doesn't exist."),r.createElement(C.a,{onPress:function(){return t.replace("Root")},style:P.link},r.createElement(w.a,{style:P.linkText},"Go to home screen!")))}var P=O.a.create({container:{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center",padding:20},title:{fontSize:20,fontWeight:"bold"},link:{marginTop:15,paddingVertical:15},linkText:{fontSize:14,color:"#2e78b7"}}),I=n(39),R=n.n(I),z=n(330),F=n(136),L={light:{text:"#000",background:"#fff",tint:"#2f95dc",tabIconDefault:"#ccc",tabIconSelected:"#2f95dc"},dark:{text:"#fff",background:"#000",tint:"#fff",tabIconDefault:"#ccc",tabIconSelected:"#fff"}},A=n(37),D=n(2),N=n(328),H=n(152),G=n(170),V=Object(G.a)((function(e){var t=Object(r.useState)(e.data.length),n=u()(t,2),a=n[0],c=n[1],i=Object(r.useRef)(null);return Object(r.useEffect)((function(){a!=e.data.length&&(e.last==e.data.length&&setTimeout((function(){var e;null==(e=i.current)||e.scrollToEnd()}),.5*e.data.length),c(e.data.length))})),o.a.createElement(H.a,{ref:i,renderItem:e.renderItem,data:e.data,scrollEnabled:e.scrollEnabled,keyExtractor:function(e,t){return t.toString()},removeClippedSubviews:!0,windowSize:Math.floor(e.data.length/2),ListFooterComponent:e.ListFooterComponent})})),J=Object(G.b)((function(e){return e.children}));var M=function(e){var t=Object(r.useState)(e.data),n=u()(t,2),a=n[0],c=n[1],i=Object(r.useState)(e.data.length),l=u()(i,2),s=l[0],d=l[1],p=Object(r.useRef)({}),f=Object(r.useCallback)((function(t){var n=t.item,a=t.index;t.isActive;return a in p.current&&p.current[a][0]==n||(p.current[a]=[n,o.a.createElement(J,{key:a,index:a},e.renderItem({item:n,index:a}))]),p.current[a][1]}),[]),b=Object(r.useCallback)((function(t,n){if(void 0!==e.addElement){var a=t.map((function(e){return e}));a.splice(a.length,0,e.addElement(t)),c(a),e.dataCallback(a),d(a.length)}}),[a,s]);return o.a.createElement(S.a,{style:{height:e.height}},o.a.createElement(V,{data:a,renderItem:f,keyExtractor:e.keyExtractor,onSortEnd:function(t){var n=t.newIndex,r=t.oldIndex;if(n!=r){var o=a.map((function(e){return e}));o.splice(n,0,o.splice(r,1)[0]),c(o),e.dataCallback(o)}},distance:e.sortEnabled?5:99999,scrollEnabled:e.scrollEnabled,ListFooterComponent:o.a.createElement(F.a,{onPress:function(){return b(a,s)},title:e.addTitle||"",color:"#888"}),last:s}))},W=function(e){var t=e.item,n=(e.index,e.drag),a=e.isActive;return o.a.createElement(C.a,{style:{backgroundColor:a?"red":"white",marginRight:"web"==D.a.OS?0:5,alignItems:"center",justifyContent:"center"},onLongPress:n},t)},B=function(e){var t=e.item;e.index,e.drag,e.isActive;return o.a.createElement(S.a,{style:{backgroundColor:"white",marginRight:0,alignItems:"center",justifyContent:"center"}},t)};function _(e){var t=Object(N.a)(),n=o.a.Children.toArray(e.children),a=void 0===e.sortEnabled||e.sortEnabled;return o.a.createElement(M,{sortEnabled:a,scrollEnabled:e.scrollEnabled,height:A.a.get("window").height-t,data:n,dataCallback:e.dataCallback,renderItem:a?W:B,keyExtractor:function(e,t){return"main-draggable-item-"+t},addElement:e.addElement,addTitle:e.addTitle})}var q=n(17),K=n.n(q);function Q(e,t){var n=E(),a=e[n];return a||L[n][t]}function U(e){var t=e.style,n=e.lightColor,a=e.darkColor,o=K()(e,["style","lightColor","darkColor"]),c=Q({light:n,dark:a},"text");return r.createElement(w.a,R()({style:[{color:c},t]},o))}function X(e){var t=e.style,n=e.lightColor,a=e.darkColor,o=K()(e,["style","lightColor","darkColor"]),c=Q({light:n,dark:a},"background");return r.createElement(S.a,R()({style:[{backgroundColor:c},t]},o))}var Y=n(246);function Z(e){return r.createElement(U,R()({},e,{style:[e.style,{fontFamily:"space-mono"}]}))}function $(e){var t=e.path;return o.a.createElement(X,null,o.a.createElement(X,{style:te.getStartedContainer},o.a.createElement(U,{style:te.getStartedText,lightColor:"rgba(0,0,0,0.8)",darkColor:"rgba(255,255,255,0.8)"},"Open up the code for this screen:"),o.a.createElement(X,{style:[te.codeHighlightContainer,te.homeScreenFilename],darkColor:"rgba(255,255,255,0.05)",lightColor:"rgba(0,0,0,0.05)"},o.a.createElement(Z,null,t)),o.a.createElement(U,{style:te.getStartedText,lightColor:"rgba(0,0,0,0.8)",darkColor:"rgba(255,255,255,0.8)"},"Change any of the text, save the file, and your app will automatically update.")),o.a.createElement(X,{style:te.helpContainer},o.a.createElement(C.a,{onPress:ee,style:te.helpLink},o.a.createElement(U,{style:te.helpLinkText,lightColor:L.light.tint},"Tap here if your app doesn't automatically update after making changes"))))}function ee(){Y.a("https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet")}var te=O.a.create({getStartedContainer:{alignItems:"center",marginHorizontal:50},homeScreenFilename:{marginVertical:7},codeHighlightContainer:{borderRadius:3,paddingHorizontal:4},getStartedText:{fontSize:17,lineHeight:24,textAlign:"center"},helpContainer:{marginTop:15,marginHorizontal:20,alignItems:"center"},helpLink:{paddingVertical:15},helpLinkText:{textAlign:"center"}});function ne(e){return r.createElement(X,{style:ae.container},r.createElement(C.a,{onPress:e.onPress1,style:ae.link},r.createElement(U,{style:ae.linkText},e.pressText1)),r.createElement(U,{style:ae.title},e.title),r.createElement(X,{style:ae.separator,lightColor:"#eee",darkColor:"rgba(255,255,255,0.1)"}),r.createElement($,{path:e.path}))}var ae=O.a.create({container:{flex:1,alignItems:"center",justifyContent:"center"},title:{fontSize:20,fontWeight:"bold"},separator:{marginVertical:30,height:1,width:"80%"},link:{marginTop:15,paddingVertical:15},linkText:{fontSize:14,color:"#2e78b7"}});var re=Object(z.a)();function oe(){var e=E();return r.createElement(re.Navigator,{initialRouteName:se,screenOptions:{},drawerContentOptions:{activeTintColor:L[e].tint}},ue)}function ce(e,t,n,a){return r.createElement(re.Screen,{key:e,name:e,component:le(t,n,a),options:{drawerIcon:function(e){var t=e.color;return r.createElement(ie,{name:"ios-code",color:t})}}})}function ie(e){return r.createElement(f.a,R()({size:30,style:{marginBottom:-3}},e))}function le(e,t,n){var a=Object(k.a)();return function(o){var c=o.navigation;return r.createElement(a.Navigator,null,r.createElement(a.Screen,{name:e,component:t,options:{headerTitle:n,headerLeft:function(){return r.createElement(F.a,{onPress:function(){return c.openDrawer()},title:"Menu",color:"#888"})}}}))}}var se="TabOne",ue=[ce("TabOne","TabOneScreen",(function(e){for(var t=e.navigation,n=(Object(r.useRef)(null),Object(r.useCallback)((function(e){return o.a.createElement(ne,{title:"Tab One"+(e.length+1),pressText1:"Go 2 screen!",onPress1:function(){t.navigate("TabTwo")},path:"/screens/TabOneScreen.tsx"})}),[])),a=Object(r.useCallback)((function(e){console.log("!")}),[]),c=[],i=0;i<100;i++)c[i]=o.a.createElement(ne,{key:i,title:"Tab One"+(i+1),pressText1:"Go 2 screen!",onPress1:function(){t.navigate("TabTwo")},path:"/screens/TabOneScreen.tsx"});return o.a.createElement(_,{addElement:n,dataCallback:a,addTitle:"add"},c)}),"Tab One Title"),ce("TabTwo","TabTwoScreen",(function(e){var t=e.navigation;return r.createElement(_,{sortEnabled:!1,dataCallback:function(){}},r.createElement(ne,{title:"Tab Two",pressText1:"Go 1 screen!",onPress1:function(){t.navigate("TabOne")},path:"/screens/TabTwoScreen.tsx"}),r.createElement(ne,{title:"Tab Two",pressText1:"Go 1 screen!",onPress1:function(){t.navigate("TabOne")},path:"/screens/TabTwoScreen.tsx"}))}),"Tab Two Title")],de=n(245),pe=n(322),fe={prefixes:[de.a("/")],config:{screens:{Root:{path:pe.homepage.split("github.io/")[1],screens:{TabOne:{screens:{TabOneScreen:"one"}},TabTwo:{screens:{TabTwoScreen:"two"}}}},NotFound:"*"}}};function be(e){var t=e.colorScheme;return r.createElement(y.a,{linking:fe,theme:"dark"===t?x.a:T.a},r.createElement(me,null))}var ge=Object(k.a)();function me(){return r.createElement(ge.Navigator,{screenOptions:{headerShown:!1}},r.createElement(ge.Screen,{name:"Root",component:oe}),r.createElement(ge.Screen,{name:"NotFound",component:j,options:{title:"Oops!"}}))}var he=n(242),ve=["ReactNativeFiberHostComponent"],Ee=n.n(he).a.clone(console);function ye(){var e=function(){var e=r.useState(!1),t=u()(e,2),a=t[0],o=t[1];return r.useEffect((function(){p.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,g.b(),e.next=4,p.a.awrap(b.b(h(h({},f.a.font),{},{"space-mono":n(271)})));case 4:e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.warn(e.t0);case 9:return e.prev=9,o(!0),g.a(),e.finish(9);case 13:case"end":return e.stop()}}),null,null,[[0,6,9,13]],Promise)}),[]),a}(),t=E();return e?o.a.createElement(c.b,null,o.a.createElement(be,{colorScheme:t}),o.a.createElement(a.a,null)):null}console.warn=function(e){var t=!0;ve.forEach((function(n){e.indexOf(n)<=-1&&(t=!1)})),t&&Ee.warn(e)}},255:function(e,t,n){e.exports=n(323)},271:function(e,t,n){e.exports=n.p+"./fonts/SpaceMono-Regular.ttf"},316:function(e,t){},322:function(e){e.exports=JSON.parse('{"main":"node_modules/expo/AppEntry.js","homepage":"http://blacktokki.github.io/node-repository","scripts":{"start":"expo start","android":"expo start --android","ios":"expo start --ios","web":"expo start --web","eject":"expo eject","test":"jest --watchAll","github":"gh-pages -d web-build && copyfiles --flat 404.html web-build","pregithub":"expo build:web"},"jest":{"preset":"jest-expo"},"dependencies":{"@expo/vector-icons":"^12.0.0","@react-native-community/masked-view":"0.1.10","@react-navigation/drawer":"^5.12.5","@react-navigation/native":"~5.8.10","@react-navigation/stack":"~5.12.8","copyfiles":"^2.4.1","expo":"~41.0.1","expo-asset":"~8.3.1","expo-constants":"~10.1.3","expo-font":"~9.1.0","expo-linking":"~2.2.3","expo-splash-screen":"~0.10.2","expo-status-bar":"~1.0.4","expo-web-browser":"~9.1.0","gh-pages":"^3.2.2","lodash":"^4.17.21","react":"16.13.1","react-dom":"16.13.1","react-native":"https://github.com/expo/react-native/archive/sdk-41.0.0.tar.gz","react-native-draggable-flatlist":"^2.6.2","react-native-gesture-handler":"~1.10.2","react-native-reanimated":"~2.1.0","react-native-safe-area-context":"3.2.0","react-native-screens":"~3.0.0","react-native-web":"~0.13.12","react-sortable-hoc":"^2.0.0"},"devDependencies":{"@babel/core":"^7.9.0","@types/lodash":"^4.14.170","@types/react":"~16.9.35","@types/react-native":"~0.63.2","jest-expo":"~41.0.0","typescript":"~4.0.0"},"private":true}')}},[[255,1,2]]]);
//# sourceMappingURL=app.3bf06cdb.chunk.js.map