// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.transform');
goog.require('cljs.core');
goog.require('instaparse.gll');
instaparse.transform.map_preserving_meta = (function instaparse$transform$map_preserving_meta(f,l){
return cljs.core.with_meta(cljs.core.map.cljs$core$IFn$_invoke$arity$2(f,l),cljs.core.meta(l));
});
/**
 * This variation of the merge-meta in gll does nothing if obj is not
 * something that can have a metamap attached.
 */
instaparse.transform.merge_meta = (function instaparse$transform$merge_meta(obj,metamap){
if(((!((obj == null)))?((((obj.cljs$lang$protocol_mask$partition0$ & (262144))) || (obj.cljs$core$IWithMeta$))?true:(((!obj.cljs$lang$protocol_mask$partition0$))?cljs.core.native_satisfies_QMARK_(cljs.core.IWithMeta,obj):false)):cljs.core.native_satisfies_QMARK_(cljs.core.IWithMeta,obj))){
return instaparse.gll.merge_meta(obj,metamap);
} else {
return obj;
}
});
instaparse.transform.enlive_transform = (function instaparse$transform$enlive_transform(transform_map,parse_tree){
var transform = (function (){var G__21274 = cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parse_tree);
return (transform_map.cljs$core$IFn$_invoke$arity$1 ? transform_map.cljs$core$IFn$_invoke$arity$1(G__21274) : transform_map.call(null,G__21274));
})();
if(cljs.core.truth_(transform)){
return instaparse.transform.merge_meta(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(transform,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$transform$enlive_transform,transform_map),cljs.core.cst$kw$content.cljs$core$IFn$_invoke$arity$1(parse_tree))),cljs.core.meta(parse_tree));
} else {
if(cljs.core.truth_(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parse_tree))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parse_tree,cljs.core.cst$kw$content,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$transform$enlive_transform,transform_map),cljs.core.cst$kw$content.cljs$core$IFn$_invoke$arity$1(parse_tree)));
} else {
return parse_tree;

}
}
});
instaparse.transform.hiccup_transform = (function instaparse$transform$hiccup_transform(transform_map,parse_tree){
if((cljs.core.sequential_QMARK_(parse_tree)) && (cljs.core.seq(parse_tree))){
var temp__4655__auto__ = (function (){var G__21276 = cljs.core.first(parse_tree);
return (transform_map.cljs$core$IFn$_invoke$arity$1 ? transform_map.cljs$core$IFn$_invoke$arity$1(G__21276) : transform_map.call(null,G__21276));
})();
if(cljs.core.truth_(temp__4655__auto__)){
var transform = temp__4655__auto__;
return instaparse.transform.merge_meta(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(transform,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$transform$hiccup_transform,transform_map),cljs.core.next(parse_tree))),cljs.core.meta(parse_tree));
} else {
return cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(parse_tree)], null),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$transform$hiccup_transform,transform_map),cljs.core.next(parse_tree))),cljs.core.meta(parse_tree));
}
} else {
return parse_tree;
}
});
/**
 * Takes a transform map and a parse tree (or seq of parse-trees).
 * A transform map is a mapping from tags to 
 * functions that take a node's contents and return
 * a replacement for the node, i.e.,
 * {:node-tag (fn [child1 child2 ...] node-replacement),
 *  :another-node-tag (fn [child1 child2 ...] node-replacement)}
 */
instaparse.transform.transform = (function instaparse$transform$transform(transform_map,parse_tree){
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.map_QMARK_(parse_tree);
if(and__6204__auto__){
return cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parse_tree);
} else {
return and__6204__auto__;
}
})())){
return instaparse.transform.enlive_transform(transform_map,parse_tree);
} else {
if((cljs.core.vector_QMARK_(parse_tree)) && ((cljs.core.first(parse_tree) instanceof cljs.core.Keyword))){
return instaparse.transform.hiccup_transform(transform_map,parse_tree);
} else {
if(cljs.core.sequential_QMARK_(parse_tree)){
return instaparse.transform.map_preserving_meta(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$transform$transform,transform_map),parse_tree);
} else {
if((parse_tree instanceof instaparse.gll.Failure)){
return parse_tree;
} else {
throw "Invalid parse-tree, not recognized as either enlive or hiccup format.";

}
}
}
}
});
