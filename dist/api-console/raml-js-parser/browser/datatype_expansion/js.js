// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('datatype_expansion.js');
goog.require('cljs.core');
goog.require('datatype_expansion.expanded_form');
goog.require('datatype_expansion.canonical_form');
goog.require('cljs.core.async');
goog.require('clojure.walk');
cljs.core.enable_console_print_BANG_();
datatype_expansion.js.expandedForm = (function datatype_expansion$js$expandedForm(type_form,typing_context,cb){
try{var type_form__$1 = clojure.walk.keywordize_keys(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(type_form));
var typing_context__$1 = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (type_form__$1){
return (function (p__25595){
var vec__25596 = p__25595;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25596,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25596,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,clojure.walk.keywordize_keys(v)], null);
});})(type_form__$1))
,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(typing_context)));
var result = datatype_expansion.expanded_form.expanded_form(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(type_form__$1),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(typing_context__$1));
var result__$1 = cljs.core.clj__GT_js(result);
if(cljs.core.some_QMARK_(cb)){
(cb.cljs$core$IFn$_invoke$arity$2 ? cb.cljs$core$IFn$_invoke$arity$2(null,result__$1) : cb.call(null,null,result__$1));
} else {
}

return result__$1;
}catch (e25594){if((e25594 instanceof Error)){
var error = e25594;
if(cljs.core.some_QMARK_(cb)){
return (cb.cljs$core$IFn$_invoke$arity$2 ? cb.cljs$core$IFn$_invoke$arity$2(error,null) : cb.call(null,error,null));
} else {
throw error;
}
} else {
throw e25594;

}
}});
goog.exportSymbol('datatype_expansion.js.expandedForm', datatype_expansion.js.expandedForm);
datatype_expansion.js.canonicalForm = (function datatype_expansion$js$canonicalForm(expanded_form,cb){
try{var expanded_form__$1 = clojure.walk.keywordize_keys(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(expanded_form));
var result = (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(expanded_form__$1) : datatype_expansion.canonical_form.canonical_form.call(null,expanded_form__$1));
var result__$1 = cljs.core.clj__GT_js(result);
if(cljs.core.some_QMARK_(cb)){
(cb.cljs$core$IFn$_invoke$arity$2 ? cb.cljs$core$IFn$_invoke$arity$2(null,result__$1) : cb.call(null,null,result__$1));
} else {
}

return result__$1;
}catch (e25598){if((e25598 instanceof Error)){
var error = e25598;
if(cljs.core.some_QMARK_(cb)){
return (cb.cljs$core$IFn$_invoke$arity$2 ? cb.cljs$core$IFn$_invoke$arity$2(error,null) : cb.call(null,error,null));
} else {
throw error;
}
} else {
throw e25598;

}
}});
goog.exportSymbol('datatype_expansion.js.canonicalForm', datatype_expansion.js.canonicalForm);
datatype_expansion.js._registerInterface = (function datatype_expansion$js$_registerInterface(){
return null;
});
cljs.core._STAR_main_cli_fn_STAR_ = datatype_expansion.js._registerInterface;
