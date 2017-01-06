// Compiled by ClojureScript 1.9.14 {}
goog.provide('datatype_expansion.canonical_form');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('clojure.set');
goog.require('datatype_expansion.utils');
datatype_expansion.canonical_form.atomic_types = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 13, ["json",null,"boolean",null,"string",null,"xml",null,"time-only",null,"any",null,"number",null,"datetime",null,"date-only",null,"integer",null,"datetime-only",null,"file",null,"nil",null], null), null);
datatype_expansion.canonical_form.union_QMARK_ = (function datatype_expansion$canonical_form$union_QMARK_(type){
return cljs.core._EQ_.call(null,"union",cljs.core.get.call(null,type,new cljs.core.Keyword(null,"type","type",1174270348)));
});
datatype_expansion.canonical_form.any_QMARK_ = (function datatype_expansion$canonical_form$any_QMARK_(type){
return cljs.core._EQ_.call(null,"any",cljs.core.get.call(null,type,new cljs.core.Keyword(null,"type","type",1174270348)));
});
datatype_expansion.canonical_form.number_type_QMARK_ = (function datatype_expansion$canonical_form$number_type_QMARK_(type){
return cljs.core._EQ_.call(null,"number",cljs.core.get.call(null,type,new cljs.core.Keyword(null,"type","type",1174270348)));
});
datatype_expansion.canonical_form.integer_type_QMARK_ = (function datatype_expansion$canonical_form$integer_type_QMARK_(type){
return cljs.core._EQ_.call(null,"integer",cljs.core.get.call(null,type,new cljs.core.Keyword(null,"type","type",1174270348)));
});
if(typeof datatype_expansion.canonical_form.lt_restriction !== 'undefined'){
} else {
datatype_expansion.canonical_form.lt_restriction = (function (){var method_table__7141__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__7142__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__7143__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__7144__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__7145__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"datatype-expansion.canonical-form","lt-restriction"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (restriction,super$,sub){
return restriction;
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"minProperties","minProperties",100355152),(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for min-properties than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"maxProperties","maxProperties",1289793027),(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for max-properties than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"required","required",1807647006),(function (_,super$,sub){
if(super$ === true){
if(cljs.core._EQ_.call(null,super$,sub)){
return cljs.core._EQ_.call(null,super$,sub);
} else {
return datatype_expansion.utils.error.call(null,"Error in required property, making optional base class required property");
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
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"discriminator","discriminator",-1267549858),(function (_,super$,sub){
var values = cljs.core.filter.call(null,cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__15891 = cljs.core.count.call(null,values);
var expr__15892 = cljs.core._EQ_;
if(cljs.core.truth_(pred__15891.call(null,(0),expr__15892))){
return null;
} else {
if(cljs.core.truth_(pred__15891.call(null,(1),expr__15892))){
return cljs.core.first.call(null,values);
} else {
if(cljs.core.truth_(pred__15891.call(null,(2),expr__15892))){
if(cljs.core._EQ_.call(null,super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Different values for discriminator constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__15892)].join('')));
}
}
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"discriminatorValue","discriminatorValue",1318459456),(function (_,super$,sub){
var values = cljs.core.filter.call(null,cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__15894 = cljs.core.count.call(null,values);
var expr__15895 = cljs.core._EQ_;
if(cljs.core.truth_(pred__15894.call(null,(0),expr__15895))){
return null;
} else {
if(cljs.core.truth_(pred__15894.call(null,(1),expr__15895))){
return cljs.core.first.call(null,values);
} else {
if(cljs.core.truth_(pred__15894.call(null,(2),expr__15895))){
if(cljs.core._EQ_.call(null,super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Different values for discriminator-value constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__15895)].join('')));
}
}
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"minLength","minLength",-1538722770),(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for min-length than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"maxLength","maxLength",-1633020073),(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for max-length than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"minimum","minimum",-1621006059),(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for minimum than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"maximum","maximum",573880714),(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for maximum than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"format","format",-1306924766),(function (_,super$,sub){
var values = cljs.core.filter.call(null,cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__15897 = cljs.core.count.call(null,values);
var expr__15898 = cljs.core._EQ_;
if(cljs.core.truth_(pred__15897.call(null,(0),expr__15898))){
return null;
} else {
if(cljs.core.truth_(pred__15897.call(null,(1),expr__15898))){
return cljs.core.first.call(null,values);
} else {
if(cljs.core.truth_(pred__15897.call(null,(2),expr__15898))){
if(cljs.core._EQ_.call(null,super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Different values for format constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__15898)].join('')));
}
}
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"pattern","pattern",242135423),(function (_,super$,sub){
var values = cljs.core.filter.call(null,cljs.core.some_QMARK_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null));
var pred__15900 = cljs.core.count.call(null,values);
var expr__15901 = cljs.core._EQ_;
if(cljs.core.truth_(pred__15900.call(null,(0),expr__15901))){
return null;
} else {
if(cljs.core.truth_(pred__15900.call(null,(1),expr__15901))){
return cljs.core.first.call(null,values);
} else {
if(cljs.core.truth_(pred__15900.call(null,(2),expr__15901))){
if(cljs.core._EQ_.call(null,super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Different values for pattern constraint"),cljs.core.str(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [super$,sub], null))].join(''));
}
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__15901)].join('')));
}
}
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"uniqueItems","uniqueItems",-826722268),(function (_,super$,sub){
if((super$ === false) || (cljs.core._EQ_.call(null,super$,sub))){
var and__6204__auto__ = super$;
if(cljs.core.truth_(and__6204__auto__)){
return sub;
} else {
return and__6204__auto__;
}
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for unique-items than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"minItems","minItems",1950622069),(function (_,super$,sub){
if((sub >= super$)){
var x__6547__auto__ = super$;
var y__6548__auto__ = sub;
return ((x__6547__auto__ > y__6548__auto__) ? x__6547__auto__ : y__6548__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for min-items than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"maxItems","maxItems",576652798),(function (_,super$,sub){
if((sub <= super$)){
var x__6554__auto__ = super$;
var y__6555__auto__ = sub;
return ((x__6554__auto__ < y__6555__auto__) ? x__6554__auto__ : y__6555__auto__);
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for max-items than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"enum","enum",1679018432),(function (_,super$,sub){
if(cljs.core.truth_(clojure.set.subset_QMARK_.call(null,cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,sub),cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,super$)))){
return clojure.set.intersection.call(null,cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,super$),cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,sub));
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for enum-values than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"additionalProperties","additionalProperties",-1203767392),(function (_,super$,sub){
if((super$ === true) || (cljs.core._EQ_.call(null,super$,sub))){
var and__6204__auto__ = super$;
if(cljs.core.truth_(and__6204__auto__)){
return sub;
} else {
return and__6204__auto__;
}
} else {
return datatype_expansion.utils.error.call(null,"sub type has a weaker constraint for additional-properties than base type");
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"type","type",1174270348),(function (_,super$,sub){
if((cljs.core._EQ_.call(null,super$,"union")) || (cljs.core._EQ_.call(null,sub,"union"))){
return "union";
} else {
if(cljs.core._EQ_.call(null,super$,sub)){
return super$;
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Cannot compute min value of different sub types")].join(''));

}
}
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt_restriction,new cljs.core.Keyword(null,"default","default",-1987822328),(function (_,super$,sub){
var or__6216__auto__ = sub;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return super$;
}
}));
datatype_expansion.canonical_form.lt_restrictions = (function datatype_expansion$canonical_form$lt_restrictions(super$,sub){
var merged = cljs.core.PersistentArrayMap.EMPTY;
var properties = cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,cljs.core.concat.call(null,cljs.core.keys.call(null,super$),cljs.core.keys.call(null,sub)));
while(true){
if(cljs.core.empty_QMARK_.call(null,properties)){
return merged;
} else {
var property = cljs.core.first.call(null,properties);
var property_super = cljs.core.get.call(null,super$,property);
var property_sub = cljs.core.get.call(null,sub,property);
if(((property_super == null)) || ((property_sub == null))){
var G__15903 = cljs.core.assoc.call(null,merged,property,(function (){var or__6216__auto__ = property_super;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return property_sub;
}
})());
var G__15904 = cljs.core.rest.call(null,properties);
merged = G__15903;
properties = G__15904;
continue;
} else {
var G__15905 = cljs.core.assoc.call(null,merged,property,datatype_expansion.canonical_form.lt_restriction.call(null,property,property_super,property_sub));
var G__15906 = cljs.core.rest.call(null,properties);
merged = G__15905;
properties = G__15906;
continue;
}
}
break;
}
});
datatype_expansion.canonical_form.consistency_checks = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"numProperties","numProperties",-85472948),(function (p__15907){
var map__15908 = p__15907;
var map__15908__$1 = ((((!((map__15908 == null)))?((((map__15908.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15908.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15908):map__15908);
var minProperties = cljs.core.get.call(null,map__15908__$1,new cljs.core.Keyword(null,"minProperties","minProperties",100355152));
var maxProperties = cljs.core.get.call(null,map__15908__$1,new cljs.core.Keyword(null,"maxProperties","maxProperties",1289793027));
if((cljs.core.some_QMARK_.call(null,minProperties)) && (cljs.core.some_QMARK_.call(null,maxProperties))){
if((minProperties <= maxProperties)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(new cljs.core.Keyword(null,"numProperties","numProperties",-85472948)),cljs.core.str(" and values ["),cljs.core.str(minProperties),cljs.core.str(" "),cljs.core.str(maxProperties),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),new cljs.core.Keyword(null,"length","length",588987862),(function (p__15910){
var map__15911 = p__15910;
var map__15911__$1 = ((((!((map__15911 == null)))?((((map__15911.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15911.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15911):map__15911);
var minLength = cljs.core.get.call(null,map__15911__$1,new cljs.core.Keyword(null,"minLength","minLength",-1538722770));
var maxLength = cljs.core.get.call(null,map__15911__$1,new cljs.core.Keyword(null,"maxLength","maxLength",-1633020073));
if((cljs.core.some_QMARK_.call(null,minLength)) && (cljs.core.some_QMARK_.call(null,maxLength))){
if((minLength <= maxLength)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(new cljs.core.Keyword(null,"length","length",588987862)),cljs.core.str(" and values ["),cljs.core.str(minLength),cljs.core.str(" "),cljs.core.str(maxLength),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),new cljs.core.Keyword(null,"size","size",1098693007),(function (p__15913){
var map__15914 = p__15913;
var map__15914__$1 = ((((!((map__15914 == null)))?((((map__15914.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15914.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15914):map__15914);
var minimum = cljs.core.get.call(null,map__15914__$1,new cljs.core.Keyword(null,"minimum","minimum",-1621006059));
var maximum = cljs.core.get.call(null,map__15914__$1,new cljs.core.Keyword(null,"maximum","maximum",573880714));
if((cljs.core.some_QMARK_.call(null,minimum)) && (cljs.core.some_QMARK_.call(null,maximum))){
if((minimum <= maximum)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(new cljs.core.Keyword(null,"size","size",1098693007)),cljs.core.str(" and values ["),cljs.core.str(minimum),cljs.core.str(" "),cljs.core.str(maximum),cljs.core.str("]")].join('')));
}
} else {
return true;
}
}),new cljs.core.Keyword(null,"numItems","numItems",-1505478382),(function (p__15916){
var map__15917 = p__15916;
var map__15917__$1 = ((((!((map__15917 == null)))?((((map__15917.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15917.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15917):map__15917);
var minItems = cljs.core.get.call(null,map__15917__$1,new cljs.core.Keyword(null,"minItems","minItems",1950622069));
var maxItems = cljs.core.get.call(null,map__15917__$1,new cljs.core.Keyword(null,"maxItems","maxItems",576652798));
if((cljs.core.some_QMARK_.call(null,minItems)) && (cljs.core.some_QMARK_.call(null,maxItems))){
if((minItems <= maxItems)){
return true;
} else {
throw (new Error([cljs.core.str("Consistency check failure for property "),cljs.core.str(new cljs.core.Keyword(null,"numItems","numItems",-1505478382)),cljs.core.str(" and values ["),cljs.core.str(minItems),cljs.core.str(" "),cljs.core.str(maxItems),cljs.core.str("]")].join('')));
}
} else {
return true;
}
})], null);
datatype_expansion.canonical_form.consistency_check = (function datatype_expansion$canonical_form$consistency_check(merged){
var seq__15925_15931 = cljs.core.seq.call(null,datatype_expansion.canonical_form.consistency_checks);
var chunk__15926_15932 = null;
var count__15927_15933 = (0);
var i__15928_15934 = (0);
while(true){
if((i__15928_15934 < count__15927_15933)){
var vec__15929_15935 = cljs.core._nth.call(null,chunk__15926_15932,i__15928_15934);
var name_15936 = cljs.core.nth.call(null,vec__15929_15935,(0),null);
var check_fn_15937 = cljs.core.nth.call(null,vec__15929_15935,(1),null);
check_fn_15937.call(null,merged);

var G__15938 = seq__15925_15931;
var G__15939 = chunk__15926_15932;
var G__15940 = count__15927_15933;
var G__15941 = (i__15928_15934 + (1));
seq__15925_15931 = G__15938;
chunk__15926_15932 = G__15939;
count__15927_15933 = G__15940;
i__15928_15934 = G__15941;
continue;
} else {
var temp__4657__auto___15942 = cljs.core.seq.call(null,seq__15925_15931);
if(temp__4657__auto___15942){
var seq__15925_15943__$1 = temp__4657__auto___15942;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__15925_15943__$1)){
var c__7027__auto___15944 = cljs.core.chunk_first.call(null,seq__15925_15943__$1);
var G__15945 = cljs.core.chunk_rest.call(null,seq__15925_15943__$1);
var G__15946 = c__7027__auto___15944;
var G__15947 = cljs.core.count.call(null,c__7027__auto___15944);
var G__15948 = (0);
seq__15925_15931 = G__15945;
chunk__15926_15932 = G__15946;
count__15927_15933 = G__15947;
i__15928_15934 = G__15948;
continue;
} else {
var vec__15930_15949 = cljs.core.first.call(null,seq__15925_15943__$1);
var name_15950 = cljs.core.nth.call(null,vec__15930_15949,(0),null);
var check_fn_15951 = cljs.core.nth.call(null,vec__15930_15949,(1),null);
check_fn_15951.call(null,merged);

var G__15952 = cljs.core.next.call(null,seq__15925_15943__$1);
var G__15953 = null;
var G__15954 = (0);
var G__15955 = (0);
seq__15925_15931 = G__15952;
chunk__15926_15932 = G__15953;
count__15927_15933 = G__15954;
i__15928_15934 = G__15955;
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
if(cljs.core.truth_((function (){var and__6204__auto__ = datatype_expansion.canonical_form.any_QMARK_.call(null,super$);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not.call(null,datatype_expansion.canonical_form.any_QMARK_.call(null,sub));
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any",new cljs.core.Keyword(null,"other","other",995793544)], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not.call(null,datatype_expansion.canonical_form.any_QMARK_.call(null,super$));
if(and__6204__auto__){
return datatype_expansion.canonical_form.any_QMARK_.call(null,sub);
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"other","other",995793544),"any"], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = datatype_expansion.canonical_form.union_QMARK_.call(null,super$);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not.call(null,datatype_expansion.canonical_form.union_QMARK_.call(null,sub));
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union",new cljs.core.Keyword(null,"other","other",995793544)], null);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not.call(null,datatype_expansion.canonical_form.union_QMARK_.call(null,super$));
if(and__6204__auto__){
return datatype_expansion.canonical_form.union_QMARK_.call(null,sub);
} else {
return and__6204__auto__;
}
})())){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"other","other",995793544),"union"], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(super$),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(sub)], null);

}
}
}
}
});
if(typeof datatype_expansion.canonical_form.lt !== 'undefined'){
} else {
datatype_expansion.canonical_form.lt = (function (){var method_table__7141__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__7142__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__7143__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__7144__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__7145__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"datatype-expansion.canonical-form","lt"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (super$,sub){
return datatype_expansion.canonical_form.lt_dispatch_fn.call(null,super$,sub);
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any","any"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["any",new cljs.core.Keyword(null,"other","other",995793544)], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.assoc.call(null,super$,new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.get.call(null,sub,new cljs.core.Keyword(null,"type","type",1174270348))),sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"other","other",995793544),"any"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,cljs.core.assoc.call(null,sub,new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.get.call(null,super$,new cljs.core.Keyword(null,"type","type",1174270348)))));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["boolean","boolean"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["datetime","datetime"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["datetime-only","datetime-only"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["date-only","date-only"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["number","number"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["integer","integer"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["number","integer"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.assoc.call(null,super$,new cljs.core.Keyword(null,"type","type",1174270348),"integer"),cljs.core.assoc.call(null,sub,new cljs.core.Keyword(null,"type","type",1174270348),"integer")));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["string","string"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["nil","nil"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["file","file"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["json","json"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["xml","xml"], null),(function (super$,sub){
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt_restrictions.call(null,super$,sub));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["array","array"], null),(function (super$,sub){
var merged_items = datatype_expansion.canonical_form.canonical_form.call(null,cljs.core.assoc.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(sub),new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(super$)));
var merged = datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.dissoc.call(null,super$,new cljs.core.Keyword(null,"items","items",1031954938)),cljs.core.dissoc.call(null,sub,new cljs.core.Keyword(null,"items","items",1031954938)));
var merged__$1 = datatype_expansion.canonical_form.consistency_check.call(null,merged);
return cljs.core.assoc.call(null,merged__$1,new cljs.core.Keyword(null,"items","items",1031954938),merged_items);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["object","object"], null),(function (super$,sub){
var props_super = new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(super$);
var props_super_names = cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,cljs.core.keys.call(null,props_super));
var props_sub = new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(sub);
var props_sub_names = cljs.core.into.call(null,cljs.core.PersistentHashSet.EMPTY,cljs.core.keys.call(null,props_sub));
var common_props_names = clojure.set.intersection.call(null,props_super_names,props_sub_names);
var merged = datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.dissoc.call(null,super$,new cljs.core.Keyword(null,"properties","properties",685819552)),cljs.core.dissoc.call(null,sub,new cljs.core.Keyword(null,"properties","properties",685819552)));
var merged__$1 = datatype_expansion.canonical_form.consistency_check.call(null,merged);
var common_props = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.call(null,((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,datatype_expansion.canonical_form.lt.call(null,cljs.core.get.call(null,props_super,prop_name),cljs.core.get.call(null,props_sub,prop_name))], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1))
,common_props_names));
var props_exclusive_super = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.call(null,((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,cljs.core.get.call(null,props_super,prop_name)], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props))
,clojure.set.difference.call(null,props_super_names,common_props_names)));
var props_exclusive_sub = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.call(null,((function (props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props,props_exclusive_super){
return (function (prop_name){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,cljs.core.get.call(null,props_sub,prop_name)], null);
});})(props_super,props_super_names,props_sub,props_sub_names,common_props_names,merged,merged__$1,common_props,props_exclusive_super))
,clojure.set.difference.call(null,props_sub_names,common_props_names)));
var merged_properties = cljs.core.merge.call(null,props_exclusive_super,common_props,props_exclusive_sub);
return cljs.core.assoc.call(null,merged__$1,new cljs.core.Keyword(null,"properties","properties",685819552),merged_properties);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union","union"], null),(function (super$,sub){
var of_super = new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(super$);
var of_sub = new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(sub);
var of_merged = ((cljs.core.empty_QMARK_.call(null,of_sub))?of_super:((cljs.core.empty_QMARK_.call(null,of_super))?of_sub:cljs.core.flatten.call(null,cljs.core.map.call(null,((function (of_super,of_sub){
return (function (of_sub_type){
return cljs.core.map.call(null,((function (of_super,of_sub){
return (function (of_super_type){
return datatype_expansion.canonical_form.lt.call(null,of_super_type,of_sub_type);
});})(of_super,of_sub))
,of_super);
});})(of_super,of_sub))
,of_sub))));
var merged = datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.dissoc.call(null,super$,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155)),cljs.core.dissoc.call(null,sub,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155)));
return cljs.core.assoc.call(null,merged,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),of_merged);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["union",new cljs.core.Keyword(null,"other","other",995793544)], null),(function (super$,sub){
var of_super = new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(super$);
var of_merged = cljs.core.map.call(null,((function (of_super){
return (function (of_super_type){
return datatype_expansion.canonical_form.lt.call(null,of_super_type,sub);
});})(of_super))
,of_super);
var merged = datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.dissoc.call(null,super$,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155)),cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,sub,new cljs.core.Keyword(null,"items","items",1031954938)),new cljs.core.Keyword(null,"properties","properties",685819552)));
return cljs.core.assoc.call(null,merged,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),of_merged);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"other","other",995793544),"union"], null),(function (super$,sub){
var of_sub = new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(sub);
var of_merged = cljs.core.map.call(null,((function (of_sub){
return (function (of_sub_type){
return datatype_expansion.canonical_form.lt.call(null,of_sub_type,super$);
});})(of_sub))
,of_sub);
var merged = datatype_expansion.canonical_form.lt_restrictions.call(null,cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,super$,new cljs.core.Keyword(null,"items","items",1031954938)),new cljs.core.Keyword(null,"properties","properties",685819552)),new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155)),cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,cljs.core.dissoc.call(null,sub,new cljs.core.Keyword(null,"items","items",1031954938)),new cljs.core.Keyword(null,"properties","properties",685819552)),new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155)));
return cljs.core.assoc.call(null,merged,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),of_merged);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.lt,new cljs.core.Keyword(null,"default","default",-1987822328),(function (super$,sub){
throw (new datatype_expansion.canonical_form.Exception([cljs.core.str("Invalid inheriance "),cljs.core.str(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(super$)),cljs.core.str(" -> "),cljs.core.str(new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(sub))].join('')));
}));
datatype_expansion.canonical_form.dispatch_node = (function datatype_expansion$canonical_form$dispatch_node(input){
var map__15958 = input;
var map__15958__$1 = ((((!((map__15958 == null)))?((((map__15958.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15958.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15958):map__15958);
var type = cljs.core.get.call(null,map__15958__$1,new cljs.core.Keyword(null,"type","type",1174270348));
if(cljs.core.map_QMARK_.call(null,type)){
return new cljs.core.Keyword(null,"inheritance","inheritance",1144321999);
} else {
if(cljs.core.coll_QMARK_.call(null,type)){
return new cljs.core.Keyword(null,"multiple-inheritance","multiple-inheritance",619645109);
} else {
if(cljs.core.truth_(cljs.core.get.call(null,datatype_expansion.canonical_form.atomic_types,type))){
return new cljs.core.Keyword(null,"atomic","atomic",-120459460);
} else {
return type;

}
}
}
});
if(typeof datatype_expansion.canonical_form.canonical_form !== 'undefined'){
} else {
datatype_expansion.canonical_form.canonical_form = (function (){var method_table__7141__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__7142__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var method_cache__7143__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__7144__auto__ = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__7145__auto__ = cljs.core.get.call(null,cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),cljs.core.get_global_hierarchy.call(null));
return (new cljs.core.MultiFn(cljs.core.symbol.call(null,"datatype-expansion.canonical-form","canonical-form"),((function (method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__){
return (function (node){
return datatype_expansion.canonical_form.dispatch_node.call(null,node);
});})(method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__,hierarchy__7145__auto__))
,new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__7145__auto__,method_table__7141__auto__,prefer_table__7142__auto__,method_cache__7143__auto__,cached_hierarchy__7144__auto__));
})();
}
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,new cljs.core.Keyword(null,"atomic","atomic",-120459460),(function (node){
return datatype_expansion.canonical_form.consistency_check.call(null,node);
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,"array",(function (node){
var canonical_items = datatype_expansion.canonical_form.canonical_form.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(node));
var node__$1 = datatype_expansion.canonical_form.consistency_check.call(null,node);
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_.call(null,canonical_items))){
var of = cljs.core.map.call(null,((function (canonical_items,node__$1){
return (function (value){
return cljs.core.assoc.call(null,node__$1,new cljs.core.Keyword(null,"items","items",1031954938),value);
});})(canonical_items,node__$1))
,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(canonical_items));
return cljs.core.assoc.call(null,canonical_items,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),of);
} else {
return cljs.core.assoc.call(null,node__$1,new cljs.core.Keyword(null,"items","items",1031954938),canonical_items);
}
}));
datatype_expansion.canonical_form.append_property = (function datatype_expansion$canonical_form$append_property(accum,property_name,property_value){
return cljs.core.map.call(null,(function (type){
var properties = new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type);
var properties__$1 = cljs.core.assoc.call(null,properties,property_name,property_value);
return cljs.core.assoc.call(null,type,new cljs.core.Keyword(null,"properties","properties",685819552),properties__$1);
}),accum);
});
datatype_expansion.canonical_form.expand_property = (function datatype_expansion$canonical_form$expand_property(accum,property_name,property_value){
return cljs.core.flatten.call(null,cljs.core.mapv.call(null,(function (type){
var properties = new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type);
var required = new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(property_value);
var union_values = new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(property_value);
return cljs.core.mapv.call(null,((function (properties,required,union_values){
return (function (p1__15962_SHARP_){
return cljs.core.assoc.call(null,type,new cljs.core.Keyword(null,"properties","properties",685819552),p1__15962_SHARP_);
});})(properties,required,union_values))
,cljs.core.mapv.call(null,((function (properties,required,union_values){
return (function (p1__15961_SHARP_){
return cljs.core.assoc.call(null,properties,property_name,p1__15961_SHARP_);
});})(properties,required,union_values))
,cljs.core.mapv.call(null,((function (properties,required,union_values){
return (function (p1__15960_SHARP_){
return cljs.core.assoc.call(null,p1__15960_SHARP_,new cljs.core.Keyword(null,"required","required",1807647006),required);
});})(properties,required,union_values))
,union_values)));
}),accum));
});
datatype_expansion.canonical_form.make_union_from_object_expansion = (function datatype_expansion$canonical_form$make_union_from_object_expansion(of_values,node){
return cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.dissoc.call(null,node,new cljs.core.Keyword(null,"properties","properties",685819552)),new cljs.core.Keyword(null,"type","type",1174270348),"union"),new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),of_values);
});
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,"object",(function (node){
var properties = new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(node);
var properties__$1 = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.call(null,((function (properties){
return (function (p__15963){
var vec__15964 = p__15963;
var property_name = cljs.core.nth.call(null,vec__15964,(0),null);
var property_value = cljs.core.nth.call(null,vec__15964,(1),null);
if((clojure.string.ends_with_QMARK_.call(null,property_name,"?")) && ((new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(property_value) == null))){
var property_name__$1 = clojure.string.replace.call(null,property_name,"?","");
var property_value__$1 = cljs.core.assoc.call(null,property_value,new cljs.core.Keyword(null,"required","required",1807647006),false);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [property_name__$1,property_value__$1], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [property_name,property_value], null);
}
});})(properties))
,properties));
var accum = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.assoc.call(null,node,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.PersistentArrayMap.EMPTY)], null);
var properties__$2 = properties__$1;
var accum__$1 = accum;
while(true){
if(cljs.core.empty_QMARK_.call(null,properties__$2)){
return datatype_expansion.canonical_form.consistency_check.call(null,((cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,accum__$1)))?cljs.core.first.call(null,accum__$1):datatype_expansion.canonical_form.make_union_from_object_expansion.call(null,accum__$1,node)));
} else {
var vec__15965 = cljs.core.first.call(null,properties__$2);
var name = cljs.core.nth.call(null,vec__15965,(0),null);
var value = cljs.core.nth.call(null,vec__15965,(1),null);
var canonical_value = datatype_expansion.canonical_form.canonical_form.call(null,value);
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_.call(null,canonical_value))){
var G__15966 = cljs.core.rest.call(null,properties__$2);
var G__15967 = datatype_expansion.canonical_form.expand_property.call(null,accum__$1,name,canonical_value);
properties__$2 = G__15966;
accum__$1 = G__15967;
continue;
} else {
var G__15968 = cljs.core.rest.call(null,properties__$2);
var G__15969 = datatype_expansion.canonical_form.append_property.call(null,accum__$1,name,canonical_value);
properties__$2 = G__15968;
accum__$1 = G__15969;
continue;
}
}
break;
}
}));
datatype_expansion.canonical_form.find_class = (function datatype_expansion$canonical_form$find_class(node){
if(cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(node))){
return "object";
} else {
if(cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(node))){
return "array";
} else {
if(typeof new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node) === 'string'){
return new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node);
} else {
if(cljs.core.map_QMARK_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))){
return datatype_expansion$canonical_form$find_class.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node));
} else {
if(cljs.core.coll_QMARK_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))){
var type = cljs.core.first.call(null,cljs.core.filter.call(null,cljs.core.some_QMARK_,cljs.core.map.call(null,(function (p1__15970_SHARP_){
try{return datatype_expansion$canonical_form$find_class.call(null,p1__15970_SHARP_);
}catch (e15972){if((e15972 instanceof Error)){
var ex = e15972;
return null;
} else {
throw e15972;

}
}}),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))));
if((type == null)){
return datatype_expansion.utils.error.call(null,"Cannot find top level class for node, not in expanded form");
} else {
return type;
}
} else {
return datatype_expansion.utils.error.call(null,"Cannot find top level class for node, not in expanded form");

}
}
}
}
}
});
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,new cljs.core.Keyword(null,"inheritance","inheritance",1144321999),(function (node){
var super_type_class = datatype_expansion.canonical_form.find_class.call(null,node);
var super_type = datatype_expansion.canonical_form.canonical_form.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node));
var sub_type = cljs.core.assoc.call(null,node,new cljs.core.Keyword(null,"type","type",1174270348),super_type_class);
var sub_type__$1 = (function (){var pred__15973 = cljs.core._EQ_;
var expr__15974 = super_type_class;
if(cljs.core.truth_(pred__15973.call(null,"array",expr__15974))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"items","items",1031954938),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"items","items",1031954938),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),"any"], null)));
} else {
if(cljs.core.truth_(pred__15973.call(null,"object",expr__15974))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.PersistentArrayMap.EMPTY));
} else {
if(cljs.core.truth_(pred__15973.call(null,"union",expr__15974))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.PersistentVector.EMPTY));
} else {
return sub_type;
}
}
}
})();
var sub_type__$2 = datatype_expansion.canonical_form.canonical_form.call(null,sub_type__$1);
return datatype_expansion.canonical_form.consistency_check.call(null,datatype_expansion.canonical_form.lt.call(null,super_type,sub_type__$2));
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,new cljs.core.Keyword(null,"multiple-inheritance","multiple-inheritance",619645109),(function (node){
var super_type_class = datatype_expansion.canonical_form.find_class.call(null,node);
var sub_type = cljs.core.assoc.call(null,node,new cljs.core.Keyword(null,"type","type",1174270348),super_type_class);
var sub_type__$1 = (function (){var pred__15976 = cljs.core._EQ_;
var expr__15977 = super_type_class;
if(cljs.core.truth_(pred__15976.call(null,"array",expr__15977))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"items","items",1031954938),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"items","items",1031954938),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),"any"], null)));
} else {
if(cljs.core.truth_(pred__15976.call(null,"object",expr__15977))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.PersistentVector.EMPTY));
} else {
if(cljs.core.truth_(pred__15976.call(null,"union",expr__15977))){
return cljs.core.assoc.call(null,sub_type,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.get.call(null,sub_type,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.PersistentVector.EMPTY));
} else {
return sub_type;
}
}
}
})();
var final_canonical_form = datatype_expansion.canonical_form.canonical_form.call(null,datatype_expansion.canonical_form.consistency_check.call(null,cljs.core.reduce.call(null,((function (super_type_class,sub_type,sub_type__$1){
return (function (acc,super_type){
var computed = datatype_expansion.canonical_form.lt.call(null,datatype_expansion.canonical_form.canonical_form.call(null,super_type),acc);
return computed;
});})(super_type_class,sub_type,sub_type__$1))
,sub_type__$1,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))));
return final_canonical_form;
}));
cljs.core._add_method.call(null,datatype_expansion.canonical_form.canonical_form,"union",(function (node){
return cljs.core.assoc.call(null,node,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.flatten.call(null,cljs.core.distinct.call(null,cljs.core.map.call(null,(function (canonical_type){
if(cljs.core.truth_(datatype_expansion.canonical_form.union_QMARK_.call(null,canonical_type))){
return new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(canonical_type);
} else {
return canonical_type;
}
}),cljs.core.flatten.call(null,cljs.core.map.call(null,datatype_expansion.canonical_form.canonical_form,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(node)))))));
}));

//# sourceMappingURL=canonical_form.js.map?rel=1480938186346