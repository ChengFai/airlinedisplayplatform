(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-da907216"],{"006d":function(e,t,a){"use strict";a("9f57")},"08bb":function(e,t,a){"use strict";a("a5ea")},"129f":function(e,t){e.exports=Object.is||function(e,t){return e===t?0!==e||1/e===1/t:e!=e&&t!=t}},1902:function(e,t,a){},"4de4":function(e,t,a){"use strict";var n=a("23e7"),r=a("b727").filter,i=a("1dde"),o=a("ae40"),s=i("filter"),l=o("filter");n({target:"Array",proto:!0,forced:!s||!l},{filter:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}})},"55d0":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-card",[a("el-tabs",{attrs:{"tab-position":"left"}},[a("el-tab-pane",{staticClass:"tab_item",attrs:{label:"热门机场"}},[a("airports-list",{attrs:{cAirportsList:e.hotAirportList}})],1),a("el-tab-pane",{attrs:{label:"按省份查询"}},[a("map-container")],1),a("el-tab-pane",{attrs:{label:"按名称查询"}},[a("name-query-container")],1),a("el-tab-pane",{attrs:{label:"查找附近"}},[a("location-container")],1)],1)],1)],1)},r=[],i=(a("96cf"),a("1da1")),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"list_container"},[a("div",{staticClass:"letter_list"},[a("span",[e._v("按首字母查询")]),e._l(e.letterList,(function(t,n){return a("div",{key:t,staticClass:"a_box",on:{click:function(t){return e.hrefClick(n)}}},[a("a",{attrs:{href:"#"+t}},[e._v(e._s(t))])])}))],2),a("ul",{staticClass:"ports_list"},e._l(e.letterList,(function(t,n){return a("li",{key:t},[a("span",{staticClass:"letter",class:{current:e.current==n},attrs:{id:t}},[e._v(" "+e._s(t)+" ")]),a("div",{class:t},e._l(e.getListByLetter(t),(function(t,n){return a("div",{key:n,staticClass:"a_box"},[a("a",{attrs:{href:""},on:{click:function(a){return e.goToDetail(t.name,a)}}},[e._v(e._s(t.name))])])})),0)])})),0)])},s=[],l=(a("4de4"),a("a630"),a("d81d"),a("d3b7"),a("6062"),a("3ca3"),a("ddb0"),{name:"AirportsList",data:function(){return{current:0}},computed:{letterList:function(){var e=this.cAirportsList.map((function(e){return e.first?e.first:""})),t=new Set(e);return e=Array.from(t).sort(),e=e.filter((function(e){return""!==e})),e}},props:{cAirportsList:{type:Array}},methods:{hrefClick:function(e){this.current=e},getListByLetter:function(e){var t=this.cAirportsList.filter((function(t){return t.first==e}));return t},goToDetail:function(e,t){t&&t.preventDefault?t.preventDefault():window.event.returnValue=!1,this.$router.push("/detail/".concat(e))}}}),c=l,u=(a("006d"),a("2877")),p=Object(u["a"])(c,o,s,!1,null,"76ad0e80",null),d=p.exports,m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-alert",{attrs:{title:'请使用右上角的"绘制点"按钮单机省份开始查询',type:"info",closable:!1}}),a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{id:"viewDiv"}}),e.showTable?a("el-table",{attrs:{data:e.info,border:"",stripe:""}},[a("el-table-column",{attrs:{type:"index",label:"#"}}),a("el-table-column",{attrs:{prop:"name",label:"机场名"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("div",{attrs:{id:t.row.name}},[e._v(e._s(t.row.name))])]}}],null,!1,4256645904)}),a("el-table-column",{attrs:{label:"操作",width:"230"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticStyle:{"margin-left":"25px"},attrs:{type:"primary",icon:"el-icon-discover",size:"small"},on:{click:function(a){return e.mapBtnClick(t.row)}}},[e._v(" 地图 ")]),a("el-button",{attrs:{type:"warning",icon:"el-icon-document",size:"small"},on:{click:function(a){return e.goToDetail(t.row.name)}}},[e._v(" 详情 ")])]}}],null,!1,3462730368)})],1):e._e(),a("el-dialog",{attrs:{title:e.currentName,visible:e.mapDialogVisible,width:"50%"},on:{"update:visible":function(t){e.mapDialogVisible=t}}},[a("div",{staticClass:"dialogmap_container"},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}],attrs:{id:"dialogViewDiv"}})])])],1)},f=[],g=(a("b0c0"),a("3835")),h=a("afaa"),v={name:"MapContainer",data:function(){return{info:[],regionName:"",loading:!0,dialogLoading:!0,mapDialogVisible:!1,dialogView:"",currentName:""}},methods:{mapBtnClick:function(e){var t=this,a=e.name,n=e.x,r=e.y;this.currentName=a,this.mapDialogVisible=!0,""==this.dialogView?Object(h["loadModules"])(["esri/views/MapView","esri/Map"],{css:!0}).then((function(e){var a=Object(g["a"])(e,2),i=a[0],o=a[1],s=new o({basemap:"osm"}),l=new i({container:"dialogViewDiv",map:s,center:[n,r],zoom:13});t.dialogView=l})):this.dialogView.goTo({center:[n,r],zoom:13}),this.dialogLoading=!1},_loadMap:function(){var e=this,t="http://localhost:6080/arcgis/rest/services/graduatepro/airportsmap/MapServer";Object(h["loadModules"])(["esri/views/MapView","esri/WebMap","esri/layers/MapImageLayer","esri/layers/GraphicsLayer","esri/widgets/Sketch","esri/tasks/QueryTask","esri/tasks/support/Query","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleFillSymbol","esri/Color"],{css:!0}).then((function(a){var n=Object(g["a"])(a,10),r=n[0],o=n[1],s=n[2],l=n[3],c=n[4],u=n[5],p=n[6],d=n[7],m=n[8],f=n[9],h=new l,v=new s({url:t,id:"initlayer"}),b=new o({layers:[v,h]}),y=new r({map:b,container:"viewDiv"});e.loading=!1;var w=new c({layer:h,view:y,visibleElements:{createTools:{point:!0,polyline:!1,polygon:!1,rectangle:!1,circle:!1},selectionTools:{"lasso-selection":!1,"rectangle-selection":!1},undoRedoMenu:!1},creationMode:"update"});function _(e,a){var n="".concat(t,"/").concat(e),r=new u({url:n}),i=new p({returnGeometry:!0,outFields:["*"]});return i.geometry=a,i.outSpatialReference=b.spatialReference,i.spatialRelationship=p.SPATIAL_REL_INTERSECTS,r.execute(i)}function L(e){h.removeAll();var t=new d(d.STYLE_CIRCLE,new f([255,0,0])),a=new m(m.STYLE_SOLID,new f("rgba(0, 255, 0, 0.5)"));if(0!=e.length){if(e.length>=1)for(var n=0;n<e.length;n++){var r=e[n];"point"===r.geometry.type&&(r.symbol=t),"polygon"===r.geometry.type&&(r.symbol=a),h.add(r)}}else console.log("查询结果为空！")}y.ui.add(w,"top-right"),w.on("create",function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(a){var n,r,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if("complete"!==a.state){t.next=15;break}return t.next=3,_("1",a.graphic.geometry);case 3:return n=t.sent,r=n.features,e.regionName=r[0].attributes.NAME,L(r),t.next=9,_("0",r[0].geometry);case 9:i=t.sent,L(i.features),o=i.features.map((function(e){return{name:e.attributes.name,x:e.attributes.x,y:e.attributes.y}})),e.info=o,t.next=16;break;case 15:h.removeAll();case 16:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),y.on("click",(function(e){y.hitTest(e).then((function(t){if(0!=t.results.length){var a=t.results[0].graphic.attributes.name;y.popup.open({title:a,content:'<a href="#'.concat(a,'" class="jumpBtn">跳转至</a>'),location:e.mapPoint})}}))}))})).catch((function(e){console.error(e)}))},goToDetail:function(e){this.$router.push("/detail/".concat(e))}},computed:{showTable:function(){return 0!==this.info.length}},mounted:function(){this._loadMap()}},b=v,y=(a("08bb"),Object(u["a"])(b,m,f,!1,null,"6cbbda94",null)),w=y.exports,_=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchClick(t)}}},[a("el-row",{staticClass:"input_row"},[a("el-col",{attrs:{span:8}},[a("el-input",{attrs:{placeholder:"请输入内容"},model:{value:e.temp,callback:function(t){e.temp=t},expression:"temp"}},[a("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:e.searchClick},slot:"append"})],1)],1)],1),a("div",{staticClass:"table_container"},[a("div",{staticStyle:{width:"95%"}},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.airportList,border:"",stripe:""}},[a("el-table-column",{attrs:{prop:"name",label:"机场名"}}),a("el-table-column",{attrs:{label:"操作",width:"230"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{staticStyle:{"margin-left":"25px"},attrs:{type:"primary",icon:"el-icon-discover",size:"small"},on:{click:function(a){return e.mapBtnClick(t.row)}}},[e._v(" 地图 ")]),a("el-button",{attrs:{type:"warning",icon:"el-icon-document",size:"small"},on:{click:function(a){return e.goToDetail(t.row.name)}}},[e._v(" 详情 ")])]}}])})],1),a("el-pagination",{attrs:{"current-page":e.query.queryPage,"page-sizes":[5,10,20,40],"page-size":e.query.querySize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)]),a("el-dialog",{attrs:{title:e.currentName,visible:e.mapDialogVisible,width:"50%"},on:{"update:visible":function(t){e.mapDialogVisible=t}}},[a("div",{staticClass:"dialogmap_container"},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoading,expression:"dialogLoading"}],attrs:{id:"dialogViewDiv1"}})])])],1)},L=[],k={name:"NameQueryContainer",data:function(){return{query:{queryInfo:"",queryPage:1,querySize:5},temp:"",airportList:[],loading:!1,total:0,currentName:"",mapDialogVisible:!1,dialogView:"",dialogLoading:!0}},methods:{_getAirportsList:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loading=!0,t.next=3,e.$http.post("/api/airports",e.query);case 3:a=t.sent,n=a.data,1==n.meta.status?(e.airportList=n.data.result,e.total=n.data.total,e.loading=!1):e.$message({type:"error",message:n.meta.msg});case 6:case"end":return t.stop()}}),t)})))()},handleSizeChange:function(e){this.query.querySize=e,this._getAirportsList()},handleCurrentChange:function(e){this.query.queryPage=e,this._getAirportsList()},searchClick:function(){this.query.queryPage=1,this.query.queryInfo=this.temp,this._getAirportsList()},mapBtnClick:function(e){var t=this,a=e.name,n=e.coord,r=n.x,i=n.y;r=parseFloat(r),i=parseFloat(i),this.currentName=a,this.mapDialogVisible=!0,""==this.dialogView?Object(h["loadModules"])(["esri/views/MapView","esri/Map"],{css:!0}).then((function(e){var a=Object(g["a"])(e,2),n=a[0],o=a[1],s=new o({basemap:"osm"}),l=new n({container:"dialogViewDiv1",map:s,center:[r,i],zoom:13});t.dialogView=l})):this.dialogView.goTo({center:[r,i],zoom:13}),this.dialogLoading=!1},goToDetail:function(e){this.$router.push("/detail/".concat(e))}},created:function(){this._getAirportsList()}},C=k,S=(a("5c50"),Object(u["a"])(C,_,L,!1,null,"732d54b6",null)),x=S.exports,A=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.getAirports(e.searchInput)}}},[a("el-row",{staticStyle:{margin:"10px 0"}},[a("el-col",{attrs:{span:8}},[a("el-input",{attrs:{placeholder:"请输入搜索内容"},model:{value:e.searchInput,callback:function(t){e.searchInput=t},expression:"searchInput"}},[a("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:function(t){return e.getAirports(e.searchInput)}},slot:"append"})],1)],1)],1),a("div",{attrs:{id:"map"}}),a("el-table",{staticStyle:{width:"100%","margin-top":"20px"},attrs:{data:e.localList,border:""}},[a("el-table-column",{attrs:{prop:"title",label:"名称"}}),a("el-table-column",{attrs:{prop:"city",label:"城市"}}),a("el-table-column",{attrs:{prop:"address",label:"地址"}}),a("el-table-column",{attrs:{label:"详情页"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("a",{attrs:{href:t.row.detailUrl}},[e._v("前往")])]}}])})],1)],1)},V=[],D=(a("ac1f"),a("841c9"),a("71f3")),M=a.n(D),T={name:"LocationContainer",data:function(){return{map:"",searchInput:"",localList:[]}},methods:{_createMap:function(){var e=new M.a.Map("map");this.map=e;var t=this;navigator.geolocation?navigator.geolocation.getCurrentPosition((function(a){var n=a.coords,r=n.longitude,i=n.latitude,o=new M.a.Point(r,i);e.centerAndZoom(o,11);var s=new M.a.LocalSearch(e,{onSearchComplete:function(e){t.localList=e.Br}});s.searchNearby("机场",o)}),(function(e){console.error(e)})):(e.centerAndZoom(new M.a.Point(116.404,39.915),11),alert("浏览器不支持地理定位。")),e.enableScrollWheelZoom(!0),e.addControl(new M.a.GeolocationControl)},getAirports:function(e){if(""==this.map)return this.$message({type:"error",message:"地图加载失败，请刷新页面"});if(""==e)return this.$message({type:"warning",message:"请输入内容"});var t=this.map,a=this,n=new M.a.LocalSearch(t,{renderOptions:{map:t,selectFirstResult:!0,autoViewport:!0},onSearchComplete:function(e){if(n.getStatus()==BMAP_STATUS_SUCCESS){var r=e.Br[0],i=new M.a.LocalSearch(t,{onSearchComplete:function(e){a.localList=e.Br}});i.searchNearby("机场",r)}}});n.search(e)}},mounted:function(){this._createMap()}},O=T,q=(a("bf6f"),Object(u["a"])(O,A,V,!1,null,"16207e15",null)),N=q.exports,j={name:"Airports",data:function(){return{hotAirportList:[]}},methods:{_getHotAirportsList:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("/api/airports/hot",{params:{num:20}});case 2:a=t.sent,n=a.data,1==n.meta.status?e.hotAirportList=n.data:e.$message({type:"error",message:n.meta.msg});case 5:case"end":return t.stop()}}),t)})))()}},created:function(){this._getHotAirportsList()},components:{AirportsList:d,MapContainer:w,NameQueryContainer:x,LocationContainer:N}},z=j,E=Object(u["a"])(z,n,r,!1,null,"192f4621",null);t["default"]=E.exports},"5c50":function(e,t,a){"use strict";a("e78f")},"841c9":function(e,t,a){"use strict";var n=a("d784"),r=a("825a"),i=a("1d80"),o=a("129f"),s=a("14c3");n("search",1,(function(e,t,a){return[function(t){var a=i(this),n=void 0==t?void 0:t[e];return void 0!==n?n.call(t,a):new RegExp(t)[e](String(a))},function(e){var n=a(t,e,this);if(n.done)return n.value;var i=r(e),l=String(this),c=i.lastIndex;o(c,0)||(i.lastIndex=0);var u=s(i,l);return o(i.lastIndex,c)||(i.lastIndex=c),null===u?-1:u.index}]}))},"9f57":function(e,t,a){},a5ea:function(e,t,a){},bf6f:function(e,t,a){"use strict";a("1902")},e78f:function(e,t,a){}}]);
//# sourceMappingURL=chunk-da907216.975a1e78.js.map