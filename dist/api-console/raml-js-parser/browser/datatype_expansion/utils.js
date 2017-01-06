// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('datatype_expansion.utils');
goog.require('cljs.core');
cljs.core.enable_console_print_BANG_();
datatype_expansion.utils.trace = (function datatype_expansion$utils$trace(x){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["--- trace: ",x], 0));

return x;
});
datatype_expansion.utils.clear_nils = (function datatype_expansion$utils$clear_nils(m){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__20400){
var vec__20401 = p__20400;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20401,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20401,(1),null);
return !((v == null));
}),m));
});
datatype_expansion.utils.clear_node = (function datatype_expansion$utils$clear_node(node){
if(cljs.core.map_QMARK_(node)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__20404){
var vec__20405 = p__20404;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20405,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20405,(1),null);
if((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(k,cljs.core.cst$kw$content)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(k,cljs.core.cst$kw$description))){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,datatype_expansion$utils$clear_node(v)], null);
}
}),datatype_expansion.utils.clear_nils(node)));
} else {
if(cljs.core.coll_QMARK_(node)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (v){
return datatype_expansion$utils$clear_node(v);
}),node));
} else {
return node;

}
}
});
datatype_expansion.utils.error = (function datatype_expansion$utils$error(e){
throw (new Error(e));
});
datatype_expansion.utils.get_STAR_ = (function datatype_expansion$utils$get_STAR_(m,k,d){
var or__6216__auto__ = (((k instanceof cljs.core.Keyword))?(function (){var or__6216__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,k);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,cljs.core.name(k));
}
})():(function (){var or__6216__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,k);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k));
}
})()
);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return d;
}
});
