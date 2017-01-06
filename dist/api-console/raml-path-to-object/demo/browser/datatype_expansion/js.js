// Compiled by ClojureScript 1.9.14 {}
goog.provide('datatype_expansion.js');
goog.require('cljs.core');
goog.require('datatype_expansion.expanded_form');
goog.require('datatype_expansion.canonical_form');
goog.require('cljs.core.async');
goog.require('clojure.walk');
cljs.core.enable_console_print_BANG_.call(null);
datatype_expansion.js.expandedForm = (function datatype_expansion$js$expandedForm(type_form,typing_context,cb){
try{var type_form__$1 = clojure.walk.keywordize_keys.call(null,cljs.core.js__GT_clj.call(null,type_form));
var typing_context__$1 = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,((function (type_form__$1){
return (function (p__16943){
var vec__16944 = p__16943;
var k = cljs.core.nth.call(null,vec__16944,(0),null);
var v = cljs.core.nth.call(null,vec__16944,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,clojure.walk.keywordize_keys.call(null,v)], null);
});})(type_form__$1))
,cljs.core.js__GT_clj.call(null,typing_context)));
var result = datatype_expansion.expanded_form.expanded_form.call(null,cljs.core.js__GT_clj.call(null,type_form__$1),cljs.core.js__GT_clj.call(null,typing_context__$1));
var result__$1 = cljs.core.clj__GT_js.call(null,result);
if(cljs.core.some_QMARK_.call(null,cb)){
cb.call(null,null,result__$1);
} else {
}

return result__$1;
}catch (e16942){if((e16942 instanceof Error)){
var error = e16942;
if(cljs.core.some_QMARK_.call(null,cb)){
return cb.call(null,error,null);
} else {
throw error;
}
} else {
throw e16942;

}
}});
goog.exportSymbol('datatype_expansion.js.expandedForm', datatype_expansion.js.expandedForm);
datatype_expansion.js.canonicalForm = (function datatype_expansion$js$canonicalForm(expanded_form,cb){
try{var expanded_form__$1 = clojure.walk.keywordize_keys.call(null,cljs.core.js__GT_clj.call(null,expanded_form));
var result = datatype_expansion.canonical_form.canonical_form.call(null,expanded_form__$1);
var result__$1 = cljs.core.clj__GT_js.call(null,result);
if(cljs.core.some_QMARK_.call(null,cb)){
cb.call(null,null,result__$1);
} else {
}

return result__$1;
}catch (e16946){if((e16946 instanceof Error)){
var error = e16946;
if(cljs.core.some_QMARK_.call(null,cb)){
return cb.call(null,error,null);
} else {
throw error;
}
} else {
throw e16946;

}
}});
goog.exportSymbol('datatype_expansion.js.canonicalForm', datatype_expansion.js.canonicalForm);
datatype_expansion.js._registerInterface = (function datatype_expansion$js$_registerInterface(){
return null;
});
cljs.core._STAR_main_cli_fn_STAR_ = datatype_expansion.js._registerInterface;

//# sourceMappingURL=js.js.map?rel=1480938186924