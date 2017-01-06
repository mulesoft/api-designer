// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.reduction');
goog.require('cljs.core');
goog.require('instaparse.auto_flatten_seq');
instaparse.reduction.singleton_QMARK_ = (function instaparse$reduction$singleton_QMARK_(s){
return (cljs.core.seq(s)) && (cljs.core.not(cljs.core.next(s)));
});
instaparse.reduction.red = (function instaparse$reduction$red(parser,f){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parser,cljs.core.cst$kw$red,f);
});
instaparse.reduction.raw_non_terminal_reduction = new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$reduction_DASH_type,cljs.core.cst$kw$raw], null);
instaparse.reduction.HiccupNonTerminalReduction = (function instaparse$reduction$HiccupNonTerminalReduction(key){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$reduction_DASH_type,cljs.core.cst$kw$hiccup,cljs.core.cst$kw$key,key], null);
});
instaparse.reduction.EnliveNonTerminalReduction = (function instaparse$reduction$EnliveNonTerminalReduction(key){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$reduction_DASH_type,cljs.core.cst$kw$enlive,cljs.core.cst$kw$key,key], null);
});
instaparse.reduction.reduction_types = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$hiccup,instaparse.reduction.HiccupNonTerminalReduction,cljs.core.cst$kw$enlive,instaparse.reduction.EnliveNonTerminalReduction], null);
instaparse.reduction.node_builders = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$enlive,(function (tag,item){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tag,tag,cljs.core.cst$kw$content,(function (){var x__7050__auto__ = item;
return cljs.core._conj(cljs.core.List.EMPTY,x__7050__auto__);
})()], null);
}),cljs.core.cst$kw$hiccup,(function (tag,item){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [tag,item], null);
})], null);
instaparse.reduction.standard_non_terminal_reduction = cljs.core.cst$kw$hiccup;
instaparse.reduction.apply_reduction = (function instaparse$reduction$apply_reduction(f,result){
var G__20668 = (((cljs.core.cst$kw$reduction_DASH_type.cljs$core$IFn$_invoke$arity$1(f) instanceof cljs.core.Keyword))?cljs.core.cst$kw$reduction_DASH_type.cljs$core$IFn$_invoke$arity$1(f).fqn:null);
switch (G__20668) {
case "raw":
return instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.EMPTY,result);

break;
case "hiccup":
return instaparse.auto_flatten_seq.convert_afs_to_vec(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.auto_flatten_seq(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$key.cljs$core$IFn$_invoke$arity$1(f)], null)),result));

break;
case "enlive":
var content = instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.EMPTY,result);
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tag,cljs.core.cst$kw$key.cljs$core$IFn$_invoke$arity$1(f),cljs.core.cst$kw$content,(((cljs.core.count(content) === (0)))?null:content)], null);

break;
default:
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(result) : f.call(null,result));

}
});
instaparse.reduction.apply_standard_reductions = (function instaparse$reduction$apply_standard_reductions(var_args){
var args20670 = [];
var len__7291__auto___20683 = arguments.length;
var i__7292__auto___20684 = (0);
while(true){
if((i__7292__auto___20684 < len__7291__auto___20683)){
args20670.push((arguments[i__7292__auto___20684]));

var G__20685 = (i__7292__auto___20684 + (1));
i__7292__auto___20684 = G__20685;
continue;
} else {
}
break;
}

var G__20672 = args20670.length;
switch (G__20672) {
case 1:
return instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20670.length)].join('')));

}
});

instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$1 = (function (grammar){
return instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(instaparse.reduction.standard_non_terminal_reduction,grammar);
});

instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2 = (function (reduction_type,grammar){
var temp__4655__auto__ = (instaparse.reduction.reduction_types.cljs$core$IFn$_invoke$arity$1 ? instaparse.reduction.reduction_types.cljs$core$IFn$_invoke$arity$1(reduction_type) : instaparse.reduction.reduction_types.call(null,reduction_type));
if(cljs.core.truth_(temp__4655__auto__)){
var reduction = temp__4655__auto__;
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__6996__auto__ = ((function (reduction,temp__4655__auto__){
return (function instaparse$reduction$iter__20673(s__20674){
return (new cljs.core.LazySeq(null,((function (reduction,temp__4655__auto__){
return (function (){
var s__20674__$1 = s__20674;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__20674__$1);
if(temp__4657__auto__){
var s__20674__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(s__20674__$2)){
var c__6994__auto__ = cljs.core.chunk_first(s__20674__$2);
var size__6995__auto__ = cljs.core.count(c__6994__auto__);
var b__20676 = cljs.core.chunk_buffer(size__6995__auto__);
if((function (){var i__20675 = (0);
while(true){
if((i__20675 < size__6995__auto__)){
var vec__20681 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__6994__auto__,i__20675);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20681,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20681,(1),null);
cljs.core.chunk_append(b__20676,(cljs.core.truth_(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(v))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(v,cljs.core.cst$kw$red,(reduction.cljs$core$IFn$_invoke$arity$1 ? reduction.cljs$core$IFn$_invoke$arity$1(k) : reduction.call(null,k)))], null)));

var G__20687 = (i__20675 + (1));
i__20675 = G__20687;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__20676),instaparse$reduction$iter__20673(cljs.core.chunk_rest(s__20674__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__20676),null);
}
} else {
var vec__20682 = cljs.core.first(s__20674__$2);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20682,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20682,(1),null);
return cljs.core.cons((cljs.core.truth_(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(v))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(v,cljs.core.cst$kw$red,(reduction.cljs$core$IFn$_invoke$arity$1 ? reduction.cljs$core$IFn$_invoke$arity$1(k) : reduction.call(null,k)))], null)),instaparse$reduction$iter__20673(cljs.core.rest(s__20674__$2)));
}
} else {
return null;
}
break;
}
});})(reduction,temp__4655__auto__))
,null,null));
});})(reduction,temp__4655__auto__))
;
return iter__6996__auto__(grammar);
})());
} else {
throw [cljs.core.str("Invalid output format"),cljs.core.str(reduction_type),cljs.core.str(". Use :enlive or :hiccup.")].join('');
}
});

instaparse.reduction.apply_standard_reductions.cljs$lang$maxFixedArity = 2;
