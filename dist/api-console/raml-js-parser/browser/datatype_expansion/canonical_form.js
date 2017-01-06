// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('datatype_expansion.canonical_form');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('clojure.set');
goog.require('datatype_expansion.utils');
datatype_expansion.canonical_form.atomic_types = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 13, ["json",null,"boolean",null,"string",null,"xml",null,"time-only",null,"any",null,"number",null,"datetime",null,"date-only",null,"integer",null,"datetime-only",null,"file",null,"nil",null], null), null);
datatype_expansion.canonical_form.union_QMARK_ = (function datatype_expansion$canonical_form$union_QMARK_(type){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("union",cljs.core.get.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$type));
});
datatype_expansion.canonical_form.any_QMARK_ = (function datatype_expansion$canonical_form$any_QMARK_(type){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("any",cljs.core.get.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$type));
});
datatype_expansion.canonical_form.number_type_QMARK_ = (function datatype_expansion$canonical_form$number_type_QMARK_(type){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("number",cljs.core.get.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$type));
});
datatype_expansion.canonical_form.integer_type_QMARK_ = (function datatype_expansion$canonical_form$integer_type_QMARK_(type){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("integer",cljs.core.get.cljs$core$IFn$_invoke$arity$2(type,cljs.core.cst$kw$type));
});
if(typeof datatype_expansion.canonical_form.lt_restriction !== 'undefined'){
} else {
datatype_expansion.canonical_form.lt_restriction = (function (){var method_table__7141__auto__ = (function (){var G__20461 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20461) : cljs.core.atom.call(null,G__20461));
})();
var prefer_table__7142__auto__ = (function (){var G__20462 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20462) : cljs.core.atom.call(null,G__20462));
})();
var method_cache__7143__auto__ = (function (){var G__20463 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20463) : cljs.core.atom.call(null,G__20463));
})();
var cached_hierarchy__7144__auto__ = (function (){var G__20464 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20464) : cljs.core.atom.call(null,G__20464));
})();
var hierarchy__7145__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("datatype-expansion.canonical-form","lt-restriction"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (restriction,super$,sub){
return restriction;
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,cljs.core.cst$kw$default,hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$minProperties,(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for min-properties than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$maxProperties,(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for max-properties than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$required,(function (_,super$,sub){
if(super$ === true){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub);
} else {
return datatype_expansion.utils.error("Error in required property, making optional base class required property");
}
} else {
var or__6216__auto__ = super$;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return sub;
}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$discriminator,(function (_,super$,sub){
var values = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__20465 = cljs.core.count(values);
var expr__20466 = cljs.core._EQ_;
if(cljs.core.truth_((pred__20465.cljs$core$IFn$_invoke$arity$2 ? pred__20465.cljs$core$IFn$_invoke$arity$2((0),expr__20466) : pred__20465.call(null,(0),expr__20466)))){
return null;
} else {
if(cljs.core.truth_((pred__20465.cljs$core$IFn$_invoke$arity$2 ? pred__20465.cljs$core$IFn$_invoke$arity$2((1),expr__20466) : pred__20465.call(null,(1),expr__20466)))){
return cljs.core.first(values);
} else {
if(cljs.core.truth_((pred__20465.cljs$core$IFn$_invoke$arity$2 ? pred__20465.cljs$core$IFn$_invoke$arity$2((2),expr__20466) : pred__20465.call(null,(2),expr__20466)))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error([cljs.core.str("Different values for discriminator constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__20466)].join('')));
}
}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$discriminatorValue,(function (_,super$,sub){
var values = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__20468 = cljs.core.count(values);
var expr__20469 = cljs.core._EQ_;
if(cljs.core.truth_((pred__20468.cljs$core$IFn$_invoke$arity$2 ? pred__20468.cljs$core$IFn$_invoke$arity$2((0),expr__20469) : pred__20468.call(null,(0),expr__20469)))){
return null;
} else {
if(cljs.core.truth_((pred__20468.cljs$core$IFn$_invoke$arity$2 ? pred__20468.cljs$core$IFn$_invoke$arity$2((1),expr__20469) : pred__20468.call(null,(1),expr__20469)))){
return cljs.core.first(values);
} else {
if(cljs.core.truth_((pred__20468.cljs$core$IFn$_invoke$arity$2 ? pred__20468.cljs$core$IFn$_invoke$arity$2((2),expr__20469) : pred__20468.call(null,(2),expr__20469)))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error([cljs.core.str("Different values for discriminator-value constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__20469)].join('')));
}
}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$minLength,(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for min-length than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$maxLength,(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for max-length than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$minimum,(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for minimum than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$maximum,(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for maximum than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$format,(function (_,super$,sub){
var values = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__20471 = cljs.core.count(values);
var expr__20472 = cljs.core._EQ_;
if(cljs.core.truth_((pred__20471.cljs$core$IFn$_invoke$arity$2 ? pred__20471.cljs$core$IFn$_invoke$arity$2((0),expr__20472) : pred__20471.call(null,(0),expr__20472)))){
return null;
} else {
if(cljs.core.truth_((pred__20471.cljs$core$IFn$_invoke$arity$2 ? pred__20471.cljs$core$IFn$_invoke$arity$2((1),expr__20472) : pred__20471.call(null,(1),expr__20472)))){
return cljs.core.first(values);
} else {
if(cljs.core.truth_((pred__20471.cljs$core$IFn$_invoke$arity$2 ? pred__20471.cljs$core$IFn$_invoke$arity$2((2),expr__20472) : pred__20471.call(null,(2),expr__20472)))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error([cljs.core.str("Different values for format constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__20472)].join('')));
}
}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$pattern,(function (_,super$,sub){
var values = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__20474 = cljs.core.count(values);
var expr__20475 = cljs.core._EQ_;
if(cljs.core.truth_((pred__20474.cljs$core$IFn$_invoke$arity$2 ? pred__20474.cljs$core$IFn$_invoke$arity$2((0),expr__20475) : pred__20474.call(null,(0),expr__20475)))){
return null;
} else {
if(cljs.core.truth_((pred__20474.cljs$core$IFn$_invoke$arity$2 ? pred__20474.cljs$core$IFn$_invoke$arity$2((1),expr__20475) : pred__20474.call(null,(1),expr__20475)))){
return cljs.core.first(values);
} else {
if(cljs.core.truth_((pred__20474.cljs$core$IFn$_invoke$arity$2 ? pred__20474.cljs$core$IFn$_invoke$arity$2((2),expr__20475) : pred__20474.call(null,(2),expr__20475)))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error([cljs.core.str("Different values for pattern constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__20475)].join('')));
}
}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$uniqueItems,(function (_,super$,sub){
if((super$ === false) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub))){
var and__6204__auto__ = super$;
if(cljs.core.truth_(and__6204__auto__)){
return sub;
} else {
return and__6204__auto__;
}
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for unique-items than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$minItems,(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for min-items than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$maxItems,(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for max-items than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$enum,(function (_,super$,sub){
if(cljs.core.truth_(clojure.set.subset_QMARK_(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,sub),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,super$)))){
return clojure.set.intersection.cljs$core$IFn$_invoke$arity$2(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,super$),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,sub));
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for enum-values than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$additionalProperties,(function (_,super$,sub){
if((super$ === true) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub))){
var and__6204__auto__ = super$;
if(cljs.core.truth_(and__6204__auto__)){
return sub;
} else {
return and__6204__auto__;
}
} else {
return datatype_expansion.utils.error("sub type has a weaker constraint for additional-properties than base type");
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$type,(function (_,super$,sub){
if((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,"union")) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(sub,"union"))){
return "union";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error([cljs.core.str("Cannot compute min value of different sub types")].join(''));

}
}
}));
datatype_expansion.canonical_form.lt_restriction.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$default,(function (_,super$,sub){
var or__6216__auto__ = sub;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return super$;
}
}));
datatype_expansion.canonical_form.lt_restrictions = (function datatype_expansion$canonical_form$lt_restrictions(super$,sub){
var merged = cljs.core.PersistentArrayMap.EMPTY;
var properties = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.keys(super$),cljs.core.keys(sub)));
while(true){
if(cljs.core.empty_QMARK_(properties)){
return merged;
} else {
var property = cljs.core.first(properties);
var property_super = cljs.core.get.cljs$core$IFn$_invoke$arity$2(super$,property);
var property_sub = cljs.core.get.cljs$core$IFn$_invoke$arity$2(sub,property);
if(((property_super == null)) || ((property_sub == null))){
var G__20477 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,property,(function (){var or__6216__auto__ = property_super;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return property_sub;
}
})());
var G__20478 = cljs.core.rest(properties);
merged = G__20477;
properties = G__20478;
continue;
} else {
var G__20479 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,property,(datatype_expansion.canonical_form.lt_restriction.cljs$core$IFn$_invoke$arity$3 ? datatype_expansion.canonical_form.lt_restriction.cljs$core$IFn$_invoke$arity$3(property,property_super,property_sub) : datatype_expansion.canonical_form.lt_restriction.call(null,property,property_super,property_sub)));
var G__20480 = cljs.core.rest(properties);
merged = G__20479;
properties = G__20480;
continue;
}
}
break;
}
});
datatype_expansion.canonical_form.consistency_checks = new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$numProperties,(function (p__20481){
var map__20482 = p__20481;
var map__20482__$1 = ((((!((map__20482 == null)))?((((map__20482.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20482.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20482):map__20482);
var minProperties = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20482__$1,cljs.core.cst$kw$minProperties);
var maxProperties = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20482__$1,cljs.core.cst$kw$maxProperties);
if((cljs.core.some_QMARK_(minProperties)) && (cljs.core.some_QMARK_(maxProperties))){
if((minProperties <= maxProperties)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(cljs.core.cst$kw$numProperties),cljs.core.str(" and values ["),cljs.core.str(minProperties),cljs.core.str(" "),cljs.core.str(maxProperties),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),cljs.core.cst$kw$length,(function (p__20484){
var map__20485 = p__20484;
var map__20485__$1 = ((((!((map__20485 == null)))?((((map__20485.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20485.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20485):map__20485);
var minLength = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20485__$1,cljs.core.cst$kw$minLength);
var maxLength = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20485__$1,cljs.core.cst$kw$maxLength);
if((cljs.core.some_QMARK_(minLength)) && (cljs.core.some_QMARK_(maxLength))){
if((minLength <= maxLength)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(cljs.core.cst$kw$length),cljs.core.str(" and values ["),cljs.core.str(minLength),cljs.core.str(" "),cljs.core.str(maxLength),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),cljs.core.cst$kw$size,(function (p__20487){
var map__20488 = p__20487;
var map__20488__$1 = ((((!((map__20488 == null)))?((((map__20488.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20488.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20488):map__20488);
var minimum = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20488__$1,cljs.core.cst$kw$minimum);
var maximum = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20488__$1,cljs.core.cst$kw$maximum);
if((cljs.core.some_QMARK_(minimum)) && (cljs.core.some_QMARK_(maximum))){
if((minimum <= maximum)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(cljs.core.cst$kw$size),cljs.core.str(" and values ["),cljs.core.str(minimum),cljs.core.str(" "),cljs.core.str(maximum),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),cljs.core.cst$kw$numItems,(function (p__20490){
var map__20491 = p__20490;
var map__20491__$1 = ((((!((map__20491 == null)))?((((map__20491.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20491.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20491):map__20491);
var minItems = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20491__$1,cljs.core.cst$kw$minItems);
var maxItems = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20491__$1,cljs.core.cst$kw$maxItems);
if((cljs.core.some_QMARK_(minItems)) && (cljs.core.some_QMARK_(maxItems))){
if((minItems <= maxItems)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(cljs.core.cst$kw$numItems),cljs.core.str(" and values ["),cljs.core.str(minItems),cljs.core.str(" "),cljs.core.str(maxItems),cljs.core.str("]")].join('')));
}
} else {
return true;
}
})], null);
datatype_expansion.canonical_form.consistency_check = (function datatype_expansion$canonical_form$consistency_check(merged){
var seq__20499_20505 = cljs.core.seq(datatype_expansion.canonical_form.consistency_checks);
var chunk__20500_20506 = null;
var count__20501_20507 = (0);
var i__20502_20508 = (0);
while(true){
if((i__20502_20508 < count__20501_20507)){
var vec__20503_20509 = chunk__20500_20506.cljs$core$IIndexed$_nth$arity$2(null,i__20502_20508);
var name_20510 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20503_20509,(0),null);
var check_fn_20511 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20503_20509,(1),null);
(check_fn_20511.cljs$core$IFn$_invoke$arity$1 ? check_fn_20511.cljs$core$IFn$_invoke$arity$1(merged) : check_fn_20511.call(null,merged));

var G__20512 = seq__20499_20505;
var G__20513 = chunk__20500_20506;
var G__20514 = count__20501_20507;
var G__20515 = (i__20502_20508 + (1));
seq__20499_20505 = G__20512;
chunk__20500_20506 = G__20513;
count__20501_20507 = G__20514;
i__20502_20508 = G__20515;
continue;
} else {
var temp__4657__auto___20516 = cljs.core.seq(seq__20499_20505);
if(temp__4657__auto___20516){
var seq__20499_20517__$1 = temp__4657__auto___20516;
if(cljs.core.chunked_seq_QMARK_(seq__20499_20517__$1)){
var c__7027__auto___20518 = cljs.core.chunk_first(seq__20499_20517__$1);
var G__20519 = cljs.core.chunk_rest(seq__20499_20517__$1);
var G__20520 = c__7027__auto___20518;
var G__20521 = cljs.core.count(c__7027__auto___20518);
var G__20522 = (0);
seq__20499_20505 = G__20519;
chunk__20500_20506 = G__20520;
count__20501_20507 = G__20521;
i__20502_20508 = G__20522;
continue;
} else {
var vec__20504_20523 = cljs.core.first(seq__20499_20517__$1);
var name_20524 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20504_20523,(0),null);
var check_fn_20525 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20504_20523,(1),null);
(check_fn_20525.cljs$core$IFn$_invoke$arity$1 ? check_fn_20525.cljs$core$IFn$_invoke$arity$1(merged) : check_fn_20525.call(null,merged));

var G__20526 = cljs.core.next(seq__20499_20517__$1);
var G__20527 = null;
var G__20528 = (0);
var G__20529 = (0);
seq__20499_20505 = G__20526;
chunk__20500_20506 = G__20527;
count__20501_20507 = G__20528;
i__20502_20508 = G__20529;
continue;
}
} else {
}
}
break;
}

return merged;
});
datatype_expansion.canonical_form.lt_dispatch_fn = (function datatype_expansion$canonical_form$lt_dispatch_fn(super$,sub){
if(cljs.core.truth_((function (){var and__6204__auto__ = datatype_expansion.canonical_form.any_QMARK_(super$);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not(datatype_expansion.canonical_form.any_QMARK_(sub));
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any",cljs.core.cst$kw$other], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not(datatype_expansion.canonical_form.any_QMARK_(super$));
if(and__6204__auto__){
return datatype_expansion.canonical_form.any_QMARK_(sub);
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$other,"any"], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = datatype_expansion.canonical_form.union_QMARK_(super$);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not(datatype_expansion.canonical_form.union_QMARK_(sub));
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union",cljs.core.cst$kw$other], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not(datatype_expansion.canonical_form.union_QMARK_(super$));
if(and__6204__auto__){
return datatype_expansion.canonical_form.union_QMARK_(sub);
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$other,"union"], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(super$),cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(sub)], null);

}
}
}
}
});
if(typeof datatype_expansion.canonical_form.lt !== 'undefined'){
} else {
datatype_expansion.canonical_form.lt = (function (){var method_table__7141__auto__ = (function (){var G__20530 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20530) : cljs.core.atom.call(null,G__20530));
})();
var prefer_table__7142__auto__ = (function (){var G__20531 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20531) : cljs.core.atom.call(null,G__20531));
})();
var method_cache__7143__auto__ = (function (){var G__20532 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20532) : cljs.core.atom.call(null,G__20532));
})();
var cached_hierarchy__7144__auto__ = (function (){var G__20533 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20533) : cljs.core.atom.call(null,G__20533));
})();
var hierarchy__7145__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("datatype-expansion.canonical-form","lt"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (super$,sub){
return datatype_expansion.canonical_form.lt_dispatch_fn(super$,sub);
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,cljs.core.cst$kw$default,hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any","any"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any",cljs.core.cst$kw$other], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(super$,cljs.core.cst$kw$type,cljs.core.get.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$type)),sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$other,"any"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub,cljs.core.cst$kw$type,cljs.core.get.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$type))));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["boolean","boolean"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["datetime","datetime"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["datetime-only","datetime-only"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["date-only","date-only"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["number","number"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["integer","integer"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["number","integer"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(super$,cljs.core.cst$kw$type,"integer"),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub,cljs.core.cst$kw$type,"integer")));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["string","string"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["nil","nil"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["file","file"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["json","json"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["xml","xml"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check(datatype_expansion.canonical_form.lt_restrictions(super$,sub));
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["array","array"], null),(function (super$,sub){
var merged_items = (function (){var G__20534 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(sub),cljs.core.cst$kw$type,cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(super$));
return (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(G__20534) : datatype_expansion.canonical_form.canonical_form.call(null,G__20534));
})();
var merged = datatype_expansion.canonical_form.lt_restrictions(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$items),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$items));
var merged__$1 = datatype_expansion.canonical_form.consistency_check(merged);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged__$1,cljs.core.cst$kw$items,merged_items);
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["object","object"], null),(function (super$,sub){
var props_super = cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(super$);
var props_super_names = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.keys(props_super));
var props_sub = cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(sub);
var props_sub_names = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.keys(props_sub));
var common_props_names = clojure.set.intersection.cljs$core$IFn$_invoke$arity$2(props_super_names,props_sub_names);
var merged = datatype_expansion.canonical_form.lt_restrictions(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$properties),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$properties));
var merged__$1 = datatype_expansion.canonical_form.consistency_check(merged);
var common_props = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,(function (){var G__20535 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(props_super,prop_name);
var G__20536 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(props_sub,prop_name);
return (datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(G__20535,G__20536) : datatype_expansion.canonical_form.lt.call(null,G__20535,G__20536));
})()], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1))
,common_props_names));
var props_exclusive_super = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,cljs.core.get.cljs$core$IFn$_invoke$arity$2(props_super,prop_name)], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props))
,clojure.set.difference.cljs$core$IFn$_invoke$arity$2(props_super_names,common_props_names)));
var props_exclusive_sub = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props,props_exclusive_super){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,cljs.core.get.cljs$core$IFn$_invoke$arity$2(props_sub,prop_name)], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props,props_exclusive_super))
,clojure.set.difference.cljs$core$IFn$_invoke$arity$2(props_sub_names,common_props_names)));
var merged_properties = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([props_exclusive_super,common_props,props_exclusive_sub], 0));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged__$1,cljs.core.cst$kw$properties,merged_properties);
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union","union"], null),(function (super$,sub){
var of_super = cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(super$);
var of_sub = cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(sub);
var of_merged = ((cljs.core.empty_QMARK_(of_sub))?of_super:((cljs.core.empty_QMARK_(of_super))?of_sub:cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (of_super,of_sub){
return (function (of_sub_type){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (of_super,of_sub){
return (function (of_super_type){
return (datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(of_super_type,of_sub_type) : datatype_expansion.canonical_form.lt.call(null,of_super_type,of_sub_type));
});})(of_super,of_sub))
,of_super);
});})(of_super,of_sub))
,of_sub))));
var merged = datatype_expansion.canonical_form.lt_restrictions(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$anyOf),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$anyOf));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,cljs.core.cst$kw$anyOf,of_merged);
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union",cljs.core.cst$kw$other], null),(function (super$,sub){
var of_super = cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(super$);
var of_merged = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (of_super){
return (function (of_super_type){
return (datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(of_super_type,sub) : datatype_expansion.canonical_form.lt.call(null,of_super_type,sub));
});})(of_super))
,of_super);
var merged = datatype_expansion.canonical_form.lt_restrictions(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$anyOf),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$items),cljs.core.cst$kw$properties));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,cljs.core.cst$kw$anyOf,of_merged);
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$other,"union"], null),(function (super$,sub){
var of_sub = cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(sub);
var of_merged = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (of_sub){
return (function (of_sub_type){
return (datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(of_sub_type,super$) : datatype_expansion.canonical_form.lt.call(null,of_sub_type,super$));
});})(of_sub))
,of_sub);
var merged = datatype_expansion.canonical_form.lt_restrictions(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(super$,cljs.core.cst$kw$items),cljs.core.cst$kw$properties),cljs.core.cst$kw$anyOf),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(sub,cljs.core.cst$kw$items),cljs.core.cst$kw$properties),cljs.core.cst$kw$anyOf));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,cljs.core.cst$kw$anyOf,of_merged);
}));
datatype_expansion.canonical_form.lt.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$default,(function (super$,sub){
throw (new datatype_expansion.canonical_form.Exception([cljs.core.str("Invalid inheriance "),cljs.core.str(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(super$)),cljs.core.str(" -> "),cljs.core.str(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(sub))].join('')));
}));
datatype_expansion.canonical_form.dispatch_node = (function datatype_expansion$canonical_form$dispatch_node(input){
var map__20539 = input;
var map__20539__$1 = ((((!((map__20539 == null)))?((((map__20539.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20539.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20539):map__20539);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20539__$1,cljs.core.cst$kw$type);
if(cljs.core.map_QMARK_(type)){
return cljs.core.cst$kw$inheritance;
} else {
if(cljs.core.coll_QMARK_(type)){
return cljs.core.cst$kw$multiple_DASH_inheritance;
} else {
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(datatype_expansion.canonical_form.atomic_types,type))){
return cljs.core.cst$kw$atomic;
} else {
return type;

}
}
}
});
if(typeof datatype_expansion.canonical_form.canonical_form !== 'undefined'){
} else {
datatype_expansion.canonical_form.canonical_form = (function (){var method_table__7141__auto__ = (function (){var G__20541 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20541) : cljs.core.atom.call(null,G__20541));
})();
var prefer_table__7142__auto__ = (function (){var G__20542 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20542) : cljs.core.atom.call(null,G__20542));
})();
var method_cache__7143__auto__ = (function (){var G__20543 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20543) : cljs.core.atom.call(null,G__20543));
})();
var cached_hierarchy__7144__auto__ = (function (){var G__20544 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20544) : cljs.core.atom.call(null,G__20544));
})();
var hierarchy__7145__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.cst$kw$hierarchy,cljs.core.get_global_hierarchy());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("datatype-expansion.canonical-form","canonical-form"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (node){
return datatype_expansion.canonical_form.dispatch_node(node);
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,cljs.core.cst$kw$default,hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$atomic,(function (node){
return datatype_expansion.canonical_form.consistency_check(node);
}));
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,"array",(function (node){
var canonical_items = (function (){var G__20545 = cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(node);
return (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(G__20545) : datatype_expansion.canonical_form.canonical_form.call(null,G__20545));
})();
var node__$1 = datatype_expansion.canonical_form.consistency_check(node);
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_(canonical_items))){
var of = cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (canonical_items,node__$1){
return (function (value){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node__$1,cljs.core.cst$kw$items,value);
});})(canonical_items,node__$1))
,cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(canonical_items));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(canonical_items,cljs.core.cst$kw$anyOf,of);
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node__$1,cljs.core.cst$kw$items,canonical_items);
}
}));
datatype_expansion.canonical_form.append_property = (function datatype_expansion$canonical_form$append_property(accum,property_name,property_value){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (type){
var properties = cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type);
var properties__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(properties,property_name,property_value);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(type,cljs.core.cst$kw$properties,properties__$1);
}),accum);
});
datatype_expansion.canonical_form.expand_property = (function datatype_expansion$canonical_form$expand_property(accum,property_name,property_value){
return cljs.core.flatten(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (type){
var properties = cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type);
var required = cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(property_value);
var union_values = cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(property_value);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (properties,required,union_values){
return (function (p1__20548_SHARP_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(type,cljs.core.cst$kw$properties,p1__20548_SHARP_);
});})(properties,required,union_values))
,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (properties,required,union_values){
return (function (p1__20547_SHARP_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(properties,property_name,p1__20547_SHARP_);
});})(properties,required,union_values))
,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (properties,required,union_values){
return (function (p1__20546_SHARP_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__20546_SHARP_,cljs.core.cst$kw$required,required);
});})(properties,required,union_values))
,union_values)));
}),accum));
});
datatype_expansion.canonical_form.make_union_from_object_expansion = (function datatype_expansion$canonical_form$make_union_from_object_expansion(of_values,node){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(node,cljs.core.cst$kw$properties),cljs.core.cst$kw$type,"union"),cljs.core.cst$kw$anyOf,of_values);
});
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,"object",(function (node){
var properties = cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(node);
var properties__$1 = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (properties){
return (function (p__20549){
var vec__20550 = p__20549;
var property_name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20550,(0),null);
var property_value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20550,(1),null);
if((clojure.string.ends_with_QMARK_(property_name,"?")) && ((cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(property_value) == null))){
var property_name__$1 = clojure.string.replace(property_name,"?","");
var property_value__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(property_value,cljs.core.cst$kw$required,false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [property_name__$1,property_value__$1], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [property_name,property_value], null);
}
});})(properties))
,properties));
var accum = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$properties,cljs.core.PersistentArrayMap.EMPTY)], null);
var properties__$2 = properties__$1;
var accum__$1 = accum;
while(true){
if(cljs.core.empty_QMARK_(properties__$2)){
return datatype_expansion.canonical_form.consistency_check(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(accum__$1)))?cljs.core.first(accum__$1):datatype_expansion.canonical_form.make_union_from_object_expansion(accum__$1,node)));
} else {
var vec__20551 = cljs.core.first(properties__$2);
var name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20551,(0),null);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20551,(1),null);
var canonical_value = (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(value) : datatype_expansion.canonical_form.canonical_form.call(null,value));
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_(canonical_value))){
var G__20552 = cljs.core.rest(properties__$2);
var G__20553 = datatype_expansion.canonical_form.expand_property(accum__$1,name,canonical_value);
properties__$2 = G__20552;
accum__$1 = G__20553;
continue;
} else {
var G__20554 = cljs.core.rest(properties__$2);
var G__20555 = datatype_expansion.canonical_form.append_property(accum__$1,name,canonical_value);
properties__$2 = G__20554;
accum__$1 = G__20555;
continue;
}
}
break;
}
}));
datatype_expansion.canonical_form.find_class = (function datatype_expansion$canonical_form$find_class(node){
if(cljs.core.some_QMARK_(cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(node))){
return "object";
} else {
if(cljs.core.some_QMARK_(cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(node))){
return "array";
} else {
if(typeof cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node) === 'string'){
return cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node);
} else {
if(cljs.core.map_QMARK_(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))){
return datatype_expansion$canonical_form$find_class(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node));
} else {
if(cljs.core.coll_QMARK_(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))){
var type = cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__20556_SHARP_){
try{return datatype_expansion$canonical_form$find_class(p1__20556_SHARP_);
}catch (e20559){if((e20559 instanceof Error)){
var ex = e20559;
return null;
} else {
throw e20559;

}
}}),cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))));
if((type == null)){
return datatype_expansion.utils.error("Cannot find top level class for node, not in expanded form");
} else {
return type;
}
} else {
return datatype_expansion.utils.error("Cannot find top level class for node, not in expanded form");

}
}
}
}
}
});
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$inheritance,(function (node){
var super_type_class = datatype_expansion.canonical_form.find_class(node);
var super_type = (function (){var G__20560 = cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node);
return (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(G__20560) : datatype_expansion.canonical_form.canonical_form.call(null,G__20560));
})();
var sub_type = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$type,super_type_class);
var sub_type__$1 = (function (){var pred__20561 = cljs.core._EQ_;
var expr__20562 = super_type_class;
if(cljs.core.truth_((pred__20561.cljs$core$IFn$_invoke$arity$2 ? pred__20561.cljs$core$IFn$_invoke$arity$2("array",expr__20562) : pred__20561.call(null,"array",expr__20562)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$items,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$items,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,"any"], null)));
} else {
if(cljs.core.truth_((pred__20561.cljs$core$IFn$_invoke$arity$2 ? pred__20561.cljs$core$IFn$_invoke$arity$2("object",expr__20562) : pred__20561.call(null,"object",expr__20562)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$properties,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$properties,cljs.core.PersistentArrayMap.EMPTY));
} else {
if(cljs.core.truth_((pred__20561.cljs$core$IFn$_invoke$arity$2 ? pred__20561.cljs$core$IFn$_invoke$arity$2("union",expr__20562) : pred__20561.call(null,"union",expr__20562)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$anyOf,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$anyOf,cljs.core.PersistentVector.EMPTY));
} else {
return sub_type;
}
}
}
})();
var sub_type__$2 = (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(sub_type__$1) : datatype_expansion.canonical_form.canonical_form.call(null,sub_type__$1));
return datatype_expansion.canonical_form.consistency_check((datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(super_type,sub_type__$2) : datatype_expansion.canonical_form.lt.call(null,super_type,sub_type__$2)));
}));
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,cljs.core.cst$kw$multiple_DASH_inheritance,(function (node){
var super_type_class = datatype_expansion.canonical_form.find_class(node);
var sub_type = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$type,super_type_class);
var sub_type__$1 = (function (){var pred__20564 = cljs.core._EQ_;
var expr__20565 = super_type_class;
if(cljs.core.truth_((pred__20564.cljs$core$IFn$_invoke$arity$2 ? pred__20564.cljs$core$IFn$_invoke$arity$2("array",expr__20565) : pred__20564.call(null,"array",expr__20565)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$items,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$items,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,"any"], null)));
} else {
if(cljs.core.truth_((pred__20564.cljs$core$IFn$_invoke$arity$2 ? pred__20564.cljs$core$IFn$_invoke$arity$2("object",expr__20565) : pred__20564.call(null,"object",expr__20565)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$properties,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$properties,cljs.core.PersistentVector.EMPTY));
} else {
if(cljs.core.truth_((pred__20564.cljs$core$IFn$_invoke$arity$2 ? pred__20564.cljs$core$IFn$_invoke$arity$2("union",expr__20565) : pred__20564.call(null,"union",expr__20565)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$anyOf,cljs.core.get.cljs$core$IFn$_invoke$arity$3(sub_type,cljs.core.cst$kw$anyOf,cljs.core.PersistentVector.EMPTY));
} else {
return sub_type;
}
}
}
})();
var final_canonical_form = (function (){var G__20569 = datatype_expansion.canonical_form.consistency_check(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(((function (super_type_class,sub_type,sub_type__$1){
return (function (acc,super_type){
var computed = (function (){var G__20570 = (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(super_type) : datatype_expansion.canonical_form.canonical_form.call(null,super_type));
var G__20571 = acc;
return (datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.canonical_form.lt.cljs$core$IFn$_invoke$arity$2(G__20570,G__20571) : datatype_expansion.canonical_form.lt.call(null,G__20570,G__20571));
})();
return computed;
});})(super_type_class,sub_type,sub_type__$1))
,sub_type__$1,cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node)));
return (datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.canonical_form.canonical_form.cljs$core$IFn$_invoke$arity$1(G__20569) : datatype_expansion.canonical_form.canonical_form.call(null,G__20569));
})();
return final_canonical_form;
}));
datatype_expansion.canonical_form.canonical_form.cljs$core$IMultiFn$_add_method$arity$3(null,"union",(function (node){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$anyOf,cljs.core.flatten(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (canonical_type){
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_(canonical_type))){
return cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(canonical_type);
} else {
return canonical_type;
}
}),cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2(datatype_expansion.canonical_form.canonical_form,cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(node)))))));
}));
