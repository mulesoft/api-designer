// Compiled by ClojureScript 1.9.14 {}
goog.provide('datatype_expansion.expanded_form');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('datatype_expansion.utils');
goog.require('instaparse.core');
goog.require('clojure.walk');
cljs.core.enable_console_print_BANG_.call(null);
datatype_expansion.expanded_form.raml_grammar = "TYPE_EXPRESSION = TYPE_NAME | SCALAR_TYPE | <'('> <BS>  TYPE_EXPRESSION <BS> <')'> | ARRAY_TYPE | UNION_TYPE\n                   SCALAR_TYPE = 'string' | 'number' | 'integer' | 'boolean' | 'date-only' | 'time-only' | 'datetime-only' | 'datetime' | 'file' | 'nil'\n                   ARRAY_TYPE = TYPE_EXPRESSION <'[]'>\n                   TYPE_NAME = #\"(\\w[\\w\\d]+\\.)*\\w[\\w\\d]+\"\n                   UNION_TYPE = TYPE_EXPRESSION <BS> (<'|'> <BS> TYPE_EXPRESSION)+\n                   BS = #\"\\s*\"\n                   ";
datatype_expansion.expanded_form.default_type = "any";
datatype_expansion.expanded_form.raml_type_grammar_analyser = instaparse.core.parser.call(null,datatype_expansion.expanded_form.raml_grammar);
datatype_expansion.expanded_form.ast__GT_type = (function datatype_expansion$expanded_form$ast__GT_type(ast,context){
while(true){
var type = cljs.core.filterv.call(null,((function (ast,context){
return (function (p1__15844_SHARP_){
return cljs.core.not_EQ_.call(null,p1__15844_SHARP_,new cljs.core.Keyword(null,"TYPE_EXPRESSION","TYPE_EXPRESSION",260003064));
});})(ast,context))
,ast);
if((cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,type))) && (cljs.core.vector_QMARK_.call(null,cljs.core.first.call(null,type)))){
var G__15852 = cljs.core.first.call(null,type);
var G__15853 = context;
ast = G__15852;
context = G__15853;
continue;
} else {
var pred__15849 = cljs.core._EQ_;
var expr__15850 = cljs.core.first.call(null,type);
if(cljs.core.truth_(pred__15849.call(null,new cljs.core.Keyword(null,"UNION_TYPE","UNION_TYPE",-1311432052),expr__15850))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"union",new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.mapv.call(null,((function (ast,context,pred__15849,expr__15850,type){
return (function (p1__15845_SHARP_){
return datatype_expansion$expanded_form$ast__GT_type.call(null,p1__15845_SHARP_,context);
});})(ast,context,pred__15849,expr__15850,type))
,cljs.core.rest.call(null,type))], null);
} else {
if(cljs.core.truth_(pred__15849.call(null,new cljs.core.Keyword(null,"SCALAR_TYPE","SCALAR_TYPE",-784669066),expr__15850))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.last.call(null,type)], null);
} else {
if(cljs.core.truth_(pred__15849.call(null,new cljs.core.Keyword(null,"ARRAY_TYPE","ARRAY_TYPE",-473571449),expr__15850))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"array",new cljs.core.Keyword(null,"items","items",1031954938),datatype_expansion$expanded_form$ast__GT_type.call(null,cljs.core.last.call(null,type),context)], null);
} else {
if(cljs.core.truth_(pred__15849.call(null,new cljs.core.Keyword(null,"TYPE_NAME","TYPE_NAME",-245619732),expr__15850))){
return cljs.core.last.call(null,type);
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Cannot parse type expression AST "),cljs.core.str(cljs.core.mapv.call(null,cljs.core.identity,type))].join(''));
}
}
}
}
}
break;
}
});
datatype_expansion.expanded_form.parse_type_expression = (function datatype_expansion$expanded_form$parse_type_expression(exp,context){
try{return datatype_expansion.expanded_form.ast__GT_type.call(null,datatype_expansion.expanded_form.raml_type_grammar_analyser.call(null,exp),context);
}catch (e15855){if((e15855 instanceof Error)){
var ex = e15855;
return null;
} else {
throw e15855;

}
}});
datatype_expansion.expanded_form.atomic_types = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 11, ["boolean",null,"string",null,"time-only",null,"any",null,"number",null,"datetime",null,"date-only",null,"integer",null,"datetime-only",null,"file",null,"nil",null], null), null);
datatype_expansion.expanded_form.collect_facets_constraints = (function datatype_expansion$expanded_form$collect_facets_constraints(node){
var facets = cljs.core.get.call(null,node,new cljs.core.Keyword(null,"facets","facets",-2061519464),cljs.core.PersistentArrayMap.EMPTY);
var facets__$1 = (function (){var or__6216__auto__ = cljs.core.keys.call(null,facets);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
if(cljs.core.map_QMARK_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.concat.call(null,facets__$1,datatype_expansion$expanded_form$collect_facets_constraints.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node)));
} else {
if(cljs.core.coll_QMARK_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.concat.call(null,facets__$1,cljs.core.flatten.call(null,cljs.core.map.call(null,datatype_expansion$expanded_form$collect_facets_constraints,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(node))));
} else {
return facets__$1;

}
}
});
datatype_expansion.expanded_form.process_user_facets_constraints = (function datatype_expansion$expanded_form$process_user_facets_constraints(parsed_type,type_node){
var facets = datatype_expansion.expanded_form.collect_facets_constraints.call(null,type_node);
var facets_map = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,((function (facets){
return (function (facet){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [facet,facet.call(null,type_node)], null);
});})(facets))
,facets));
return cljs.core.merge.call(null,parsed_type,facets_map);
});
datatype_expansion.expanded_form.process_constraints = (function datatype_expansion$expanded_form$process_constraints(parsed_type,type_node){
return cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,datatype_expansion.expanded_form.process_user_facets_constraints.call(null,parsed_type,type_node),new cljs.core.Keyword(null,"required","required",1807647006),((cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(type_node)))?new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(type_node):null)),new cljs.core.Keyword(null,"xml","xml",-1170142052),new cljs.core.Keyword(null,"xml","xml",-1170142052).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"fileTypes","fileTypes",-200305100),new cljs.core.Keyword(null,"fileTypes","fileTypes",-200305100).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"example","example",-1755779144),new cljs.core.Keyword(null,"example","example",-1755779144).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"description","description",-1428560544),new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"displayName","displayName",-809144601),new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"default","default",-1987822328),new cljs.core.Keyword(null,"default","default",-1987822328).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"examples","examples",-473712556),new cljs.core.Keyword(null,"examples","examples",-473712556).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"minProperties","minProperties",100355152),new cljs.core.Keyword(null,"minProperties","minProperties",100355152).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"maxProperties","maxProperties",1289793027),new cljs.core.Keyword(null,"maxProperties","maxProperties",1289793027).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"discriminator","discriminator",-1267549858),new cljs.core.Keyword(null,"discriminator","discriminator",-1267549858).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"discriminatorValue","discriminatorValue",1318459456),new cljs.core.Keyword(null,"discriminatorValue","discriminatorValue",1318459456).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"minLength","minLength",-1538722770),new cljs.core.Keyword(null,"minLength","minLength",-1538722770).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"maxLength","maxLength",-1633020073),new cljs.core.Keyword(null,"maxLength","maxLength",-1633020073).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"minimum","minimum",-1621006059),new cljs.core.Keyword(null,"minimum","minimum",-1621006059).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"maximum","maximum",573880714),new cljs.core.Keyword(null,"maximum","maximum",573880714).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"format","format",-1306924766),new cljs.core.Keyword(null,"format","format",-1306924766).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"multipleOf","multipleOf",1127305698),new cljs.core.Keyword(null,"multipleOf","multipleOf",1127305698).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"pattern","pattern",242135423),new cljs.core.Keyword(null,"pattern","pattern",242135423).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"uniqueItems","uniqueItems",-826722268),new cljs.core.Keyword(null,"uniqueItems","uniqueItems",-826722268).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"minItems","minItems",1950622069),new cljs.core.Keyword(null,"minItems","minItems",1950622069).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"maxItems","maxItems",576652798),new cljs.core.Keyword(null,"maxItems","maxItems",576652798).cljs$core$IFn$_invoke$arity$1(type_node)),new cljs.core.Keyword(null,"enum","enum",1679018432),(function (){var enum_values = cljs.core.into.call(null,cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"enum","enum",1679018432).cljs$core$IFn$_invoke$arity$1(type_node));
if(cljs.core.empty_QMARK_.call(null,enum_values)){
return null;
} else {
return enum_values;
}
})()),new cljs.core.Keyword(null,"additionalProperties","additionalProperties",-1203767392),new cljs.core.Keyword(null,"additionalProperties","additionalProperties",-1203767392).cljs$core$IFn$_invoke$arity$2(type_node,(((cljs.core._EQ_.call(null,"object",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(parsed_type))) || (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(parsed_type))))?true:null)));
});
datatype_expansion.expanded_form.xml_type_QMARK_ = (function datatype_expansion$expanded_form$xml_type_QMARK_(type){
return (cljs.core._EQ_.call(null,type,"xml")) || ((typeof type === 'string') && (clojure.string.starts_with_QMARK_.call(null,type,"<?xml")));
});
datatype_expansion.expanded_form.json_type_QMARK_ = (function datatype_expansion$expanded_form$json_type_QMARK_(type){
return (cljs.core._EQ_.call(null,type,"json")) || ((typeof type === 'string') && (clojure.string.starts_with_QMARK_.call(null,type,"{")));
});
datatype_expansion.expanded_form.setup_context = (function datatype_expansion$expanded_form$setup_context(p__15856){
var map__15859 = p__15856;
var map__15859__$1 = ((((!((map__15859 == null)))?((((map__15859.cljs$lang$protocol_mask$partition0$ & (64))) || (map__15859.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__15859):map__15859);
var context = map__15859__$1;
var path = cljs.core.get.call(null,map__15859__$1,new cljs.core.Keyword(null,"path","path",-188191168));
return cljs.core.assoc.call(null,context,new cljs.core.Keyword(null,"path","path",-188191168),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"fixpoints","fixpoints",-1871487163),cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY));
});
datatype_expansion.expanded_form.cycle_QMARK_ = (function datatype_expansion$expanded_form$cycle_QMARK_(type,path){
return cljs.core.some_QMARK_.call(null,cljs.core.first.call(null,cljs.core.filter.call(null,(function (type_in_path){
return cljs.core._EQ_.call(null,type_in_path,type);
}),path)));
});
datatype_expansion.expanded_form.process_items = (function datatype_expansion$expanded_form$process_items(node,context){
if(cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.assoc.call(null,node,new cljs.core.Keyword(null,"items","items",1031954938),datatype_expansion.expanded_form.expanded_form_inner.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(node),context));
} else {
return node;
}
});
datatype_expansion.expanded_form.process_properties = (function datatype_expansion$expanded_form$process_properties(var_args){
var args15861 = [];
var len__7291__auto___15866 = arguments.length;
var i__7292__auto___15867 = (0);
while(true){
if((i__7292__auto___15867 < len__7291__auto___15866)){
args15861.push((arguments[i__7292__auto___15867]));

var G__15868 = (i__7292__auto___15867 + (1));
i__7292__auto___15867 = G__15868;
continue;
} else {
}
break;
}

var G__15863 = args15861.length;
switch (G__15863) {
case 2:
return datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15861.length)].join('')));

}
});

datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2 = (function (node,context){
return datatype_expansion.expanded_form.process_properties.call(null,node,context,new cljs.core.Keyword(null,"properties","properties",685819552));
});

datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3 = (function (node,context,facet_name){
if(cljs.core.some_QMARK_.call(null,facet_name.call(null,node))){
return cljs.core.assoc.call(null,node,facet_name,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,(function (p__15864){
var vec__15865 = p__15864;
var k = cljs.core.nth.call(null,vec__15865,(0),null);
var v = cljs.core.nth.call(null,vec__15865,(1),null);
var prop_expanded = datatype_expansion.expanded_form.expanded_form_inner.call(null,v,context);
var explicit_required = (cljs.core.map_QMARK_.call(null,v)) && (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(v)));
var optional = clojure.string.ends_with_QMARK_.call(null,cljs.core.name.call(null,k),"?");
var prop_name = ((explicit_required)?cljs.core.name.call(null,k):clojure.string.replace.call(null,cljs.core.name.call(null,k),/\?$/,""));
var prop_expanded__$1 = (((optional) && (!(explicit_required)))?cljs.core.assoc.call(null,prop_expanded,new cljs.core.Keyword(null,"required","required",1807647006),false):cljs.core.assoc.call(null,prop_expanded,new cljs.core.Keyword(null,"required","required",1807647006),((explicit_required)?new cljs.core.Keyword(null,"required","required",1807647006).cljs$core$IFn$_invoke$arity$1(v):true)));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,prop_expanded__$1], null);
}),facet_name.call(null,node))));
} else {
return node;
}
});

datatype_expansion.expanded_form.process_properties.cljs$lang$maxFixedArity = 3;
datatype_expansion.expanded_form.process_user_facets = (function datatype_expansion$expanded_form$process_user_facets(node,context){
var processed = datatype_expansion.expanded_form.process_properties.call(null,node,context,new cljs.core.Keyword(null,"facets","facets",-2061519464));
var facets = new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(processed);
if((facets == null)){
return processed;
} else {
return cljs.core.assoc.call(null,processed,new cljs.core.Keyword(null,"facets","facets",-2061519464),cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,((function (processed,facets){
return (function (p__15872){
var vec__15873 = p__15872;
var k = cljs.core.nth.call(null,vec__15873,(0),null);
var v = cljs.core.nth.call(null,vec__15873,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null,k),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(v)], null)], null);
});})(processed,facets))
,facets)));
}
});
datatype_expansion.expanded_form.expanded_form_inner = (function datatype_expansion$expanded_form$expanded_form_inner(type_node,context){
var type_node__$1 = (((cljs.core.map_QMARK_.call(null,type_node)) && (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type_node))))?cljs.core.assoc.call(null,type_node,new cljs.core.Keyword(null,"properties","properties",685819552),cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,(function (p__15878){
var vec__15879 = p__15878;
var k = cljs.core.nth.call(null,vec__15879,(0),null);
var v = cljs.core.nth.call(null,vec__15879,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.name.call(null,k),v], null);
}),new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type_node)))):type_node);
var type = ((typeof type_node__$1 === 'string')?type_node__$1:(function (){var or__6216__auto__ = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(type_node__$1);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return new cljs.core.Keyword(null,"schema","schema",-1582001791).cljs$core$IFn$_invoke$arity$1(type_node__$1);
}
})());
if(((type == null)) && ((type_node__$1 == null))){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),datatype_expansion.expanded_form.default_type], null);
} else {
if((!(cljs.core.map_QMARK_.call(null,type))) && (cljs.core.coll_QMARK_.call(null,type))){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_items.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,datatype_expansion.expanded_form.process_properties.call(null,cljs.core.assoc.call(null,type_node__$1,new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.mapv.call(null,((function (type_node__$1,type){
return (function (p1__15874_SHARP_){
return datatype_expansion$expanded_form$expanded_form_inner.call(null,p1__15874_SHARP_,context);
});})(type_node__$1,type))
,type)),context),context),context),type_node__$1));
} else {
if(cljs.core.truth_(cljs.core.get.call(null,datatype_expansion.expanded_form.atomic_types,type))){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),type,new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),context),type_node__$1));
} else {
if((((type == null)) && (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(type_node__$1)))) || (cljs.core._EQ_.call(null,type,"array"))){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,cljs.core.assoc.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"array",new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),new cljs.core.Keyword(null,"items","items",1031954938),datatype_expansion$expanded_form$expanded_form_inner.call(null,new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$2(type_node__$1,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),datatype_expansion.expanded_form.default_type], null)),context)),context),type_node__$1));
} else {
if((((type == null)) && (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type_node__$1)))) || (cljs.core._EQ_.call(null,type,"object"))){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,datatype_expansion.expanded_form.process_properties.call(null,datatype_expansion.expanded_form.process_constraints.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"object",new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1),new cljs.core.Keyword(null,"properties","properties",685819552),new cljs.core.Keyword(null,"properties","properties",685819552).cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),type_node__$1),context),context));
} else {
if(cljs.core._EQ_.call(null,type,"union")){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"union",new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1),new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),cljs.core.mapv.call(null,((function (type_node__$1,type){
return (function (p1__15875_SHARP_){
return datatype_expansion$expanded_form$expanded_form_inner.call(null,p1__15875_SHARP_,context);
});})(type_node__$1,type))
,new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155).cljs$core$IFn$_invoke$arity$1(type_node__$1))], null),context),type_node__$1));
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.some_QMARK_.call(null,type);
if(and__6204__auto__){
var and__6204__auto____$1 = (typeof type === 'string') || ((type instanceof cljs.core.Keyword));
if(and__6204__auto____$1){
var or__6216__auto__ = cljs.core.get.call(null,context,cljs.core.name.call(null,type));
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.call(null,context,cljs.core.keyword.call(null,type));
}
} else {
return and__6204__auto____$1;
}
} else {
return and__6204__auto__;
}
})())){
var ref_type = (function (){var or__6216__auto__ = cljs.core.get.call(null,context,cljs.core.name.call(null,type));
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.call(null,context,cljs.core.keyword.call(null,type));
}
})();
if((ref_type == null)){
throw (new Error([cljs.core.str("Cannot find reference "),cljs.core.str(cljs.core.name.call(null,type))].join('')));
} else {
}

if(cljs.core.truth_(datatype_expansion.expanded_form.cycle_QMARK_.call(null,cljs.core.name.call(null,type),new cljs.core.Keyword(null,"path","path",-188191168).cljs$core$IFn$_invoke$arity$1(context)))){
cljs.core.swap_BANG_.call(null,new cljs.core.Keyword(null,"fixpoints","fixpoints",-1871487163).cljs$core$IFn$_invoke$arity$1(context),((function (ref_type,type_node__$1,type){
return (function (fps){
return cljs.core.assoc.call(null,fps,type,true);
});})(ref_type,type_node__$1,type))
);

return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"$recur","$recur",-1392172218)], null),type_node__$1));
} else {
var path = cljs.core.get.call(null,context,new cljs.core.Keyword(null,"path","path",-188191168));
var context__$1 = cljs.core.assoc.call(null,context,new cljs.core.Keyword(null,"path","path",-188191168),cljs.core.conj.call(null,path,cljs.core.name.call(null,type)));
if(typeof type_node__$1 === 'string'){
return cljs.core.assoc.call(null,datatype_expansion$expanded_form$expanded_form_inner.call(null,ref_type,context__$1),new cljs.core.Keyword(null,"$ref","$ref",841290683),type);
} else {
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_items.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,datatype_expansion.expanded_form.process_properties.call(null,cljs.core.assoc.call(null,cljs.core.assoc.call(null,((cljs.core.map_QMARK_.call(null,type_node__$1))?type_node__$1:cljs.core.PersistentArrayMap.EMPTY),new cljs.core.Keyword(null,"$ref","$ref",841290683),type),new cljs.core.Keyword(null,"type","type",1174270348),datatype_expansion$expanded_form$expanded_form_inner.call(null,ref_type,context__$1)),context__$1),context__$1),context__$1),type_node__$1));
}
}
} else {
if(cljs.core.truth_(datatype_expansion.expanded_form.xml_type_QMARK_.call(null,type))){
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(type_node__$1),"xml")){
return type_node__$1;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"xml",new cljs.core.Keyword(null,"content","content",15833224),type], null);
}
} else {
if(cljs.core.truth_(datatype_expansion.expanded_form.json_type_QMARK_.call(null,type))){
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(type_node__$1),"json")){
return type_node__$1;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"json",new cljs.core.Keyword(null,"content","content",15833224),type], null);
}
} else {
if(((type == null)) && (cljs.core.some_QMARK_.call(null,type_node__$1))){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"any",new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),context),type_node__$1));
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = typeof type === 'string';
if(and__6204__auto__){
return cljs.core.re_matches.call(null,/^.*\?$/,type);
} else {
return and__6204__auto__;
}
})())){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"union",new cljs.core.Keyword(null,"facets","facets",-2061519464),new cljs.core.Keyword(null,"facets","facets",-2061519464).cljs$core$IFn$_invoke$arity$1(type_node__$1),new cljs.core.Keyword(null,"anyOf","anyOf",-1046092155),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),clojure.string.replace.call(null,type,"?","")], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),"nil"], null)], null)], null),context),type_node__$1));
} else {
if(cljs.core.map_QMARK_.call(null,type)){
var result = datatype_expansion$expanded_form$expanded_form_inner.call(null,cljs.core.assoc.call(null,type_node__$1,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [type], null)),context);
return cljs.core.assoc.call(null,datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_items.call(null,datatype_expansion.expanded_form.process_user_facets.call(null,datatype_expansion.expanded_form.process_properties.call(null,result,context),context),context)),new cljs.core.Keyword(null,"type","type",1174270348),cljs.core.first.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(result)));
} else {
var parsed_type = datatype_expansion.expanded_form.parse_type_expression.call(null,type,context);
if(cljs.core.some_QMARK_.call(null,parsed_type)){
return datatype_expansion.utils.clear_node.call(null,datatype_expansion.expanded_form.process_constraints.call(null,datatype_expansion$expanded_form$expanded_form_inner.call(null,parsed_type,context),type_node__$1));
} else {
return datatype_expansion.utils.error.call(null,[cljs.core.str("Unknown type "),cljs.core.str(type),cljs.core.str(" in "),cljs.core.str(context)].join(''));
}

}
}
}
}
}
}
}
}
}
}
}
}
});
datatype_expansion.expanded_form.add_fixpoints = (function datatype_expansion$expanded_form$add_fixpoints(t,fixpoints,num_fixpoints){
if((cljs.core.map_QMARK_.call(null,t)) && (cljs.core.some_QMARK_.call(null,new cljs.core.Keyword(null,"$ref","$ref",841290683).cljs$core$IFn$_invoke$arity$1(t)))){
var ref_type = new cljs.core.Keyword(null,"$ref","$ref",841290683).cljs$core$IFn$_invoke$arity$1(t);
var t__$1 = cljs.core.dissoc.call(null,t,new cljs.core.Keyword(null,"$ref","$ref",841290683));
var processed = datatype_expansion$expanded_form$add_fixpoints.call(null,t__$1,fixpoints,num_fixpoints);
if(cljs.core.some_QMARK_.call(null,cljs.core.get.call(null,fixpoints,ref_type))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"fixpoint","fixpoint",-1727096127),new cljs.core.Keyword(null,"value","value",305978217),processed], null);
} else {
return processed;
}
} else {
if((cljs.core.map_QMARK_.call(null,t)) && (cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(t),new cljs.core.Keyword(null,"$recur","$recur",-1392172218)))){
cljs.core.swap_BANG_.call(null,num_fixpoints,cljs.core.inc);

return t;
} else {
if(cljs.core.map_QMARK_.call(null,t)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.call(null,(function (p__15883){
var vec__15884 = p__15883;
var k = cljs.core.nth.call(null,vec__15884,(0),null);
var v = cljs.core.nth.call(null,vec__15884,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,datatype_expansion$expanded_form$add_fixpoints.call(null,v,fixpoints,num_fixpoints)], null);
}),t));
} else {
if(cljs.core.coll_QMARK_.call(null,t)){
return cljs.core.mapv.call(null,(function (p1__15880_SHARP_){
return datatype_expansion$expanded_form$add_fixpoints.call(null,p1__15880_SHARP_,fixpoints,num_fixpoints);
}),t);
} else {
return t;

}
}
}
}
});
datatype_expansion.expanded_form.expanded_form = (function datatype_expansion$expanded_form$expanded_form(node,context){
if((node == null)){
throw Error("Cannot expand nil node");
} else {
}

var context__$1 = datatype_expansion.expanded_form.setup_context.call(null,context);
var found_context_type = cljs.core.ffirst.call(null,cljs.core.filter.call(null,((function (context__$1){
return (function (p__15887){
var vec__15888 = p__15887;
var k = cljs.core.nth.call(null,vec__15888,(0),null);
var v = cljs.core.nth.call(null,vec__15888,(1),null);
return cljs.core._EQ_.call(null,v,node);
});})(context__$1))
,context__$1));
var path = ((cljs.core.some_QMARK_.call(null,found_context_type))?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [found_context_type], null):cljs.core.PersistentVector.EMPTY);
var context__$2 = cljs.core.assoc.call(null,context__$1,new cljs.core.Keyword(null,"path","path",-188191168),path);
var expanded = datatype_expansion.expanded_form.expanded_form_inner.call(null,node,context__$2);
var expanded__$1 = ((cljs.core.some_QMARK_.call(null,found_context_type))?cljs.core.assoc.call(null,expanded,new cljs.core.Keyword(null,"$ref","$ref",841290683),found_context_type):expanded);
var num_fixpoints = cljs.core.atom.call(null,(0));
var expanded__$2 = datatype_expansion.expanded_form.add_fixpoints.call(null,expanded__$1,cljs.core.deref.call(null,new cljs.core.Keyword(null,"fixpoints","fixpoints",-1871487163).cljs$core$IFn$_invoke$arity$1(context__$2)),num_fixpoints);
if(cljs.core._EQ_.call(null,cljs.core.deref.call(null,num_fixpoints),cljs.core.count.call(null,cljs.core.deref.call(null,new cljs.core.Keyword(null,"fixpoints","fixpoints",-1871487163).cljs$core$IFn$_invoke$arity$1(context__$2))))){
return expanded__$2;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"fixpoint","fixpoint",-1727096127),new cljs.core.Keyword(null,"value","value",305978217),expanded__$2], null);
}
});

//# sourceMappingURL=expanded_form.js.map?rel=1480938186104