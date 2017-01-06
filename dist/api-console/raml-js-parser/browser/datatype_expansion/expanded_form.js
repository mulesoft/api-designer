// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('datatype_expansion.expanded_form');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('datatype_expansion.utils');
goog.require('instaparse.core');
goog.require('clojure.walk');
cljs.core.enable_console_print_BANG_();
datatype_expansion.expanded_form.raml_grammar = "TYPE_EXPRESSION = TYPE_NAME | SCALAR_TYPE | <'('> <BS>  TYPE_EXPRESSION <BS> <')'> | ARRAY_TYPE | UNION_TYPE\n                   SCALAR_TYPE = 'string' | 'number' | 'integer' | 'boolean' | 'date-only' | 'time-only' | 'datetime-only' | 'datetime' | 'file' | 'nil'\n                   ARRAY_TYPE = TYPE_EXPRESSION <'[]'>\n                   TYPE_NAME = #\"(\\w[\\w\\d]+\\.)*\\w[\\w\\d]+\"\n                   UNION_TYPE = TYPE_EXPRESSION <BS> (<'|'> <BS> TYPE_EXPRESSION)+\n                   BS = #\"\\s*\"\n                   ";
datatype_expansion.expanded_form.default_type = "any";
datatype_expansion.expanded_form.raml_type_grammar_analyser = instaparse.core.parser(datatype_expansion.expanded_form.raml_grammar);
datatype_expansion.expanded_form.ast__GT_type = (function datatype_expansion$expanded_form$ast__GT_type(ast,context){
while(true){
var type = cljs.core.filterv(((function (ast,context){
return (function (p1__21732_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(p1__21732_SHARP_,cljs.core.cst$kw$TYPE_EXPRESSION);
});})(ast,context))
,ast);
if((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(type))) && (cljs.core.vector_QMARK_(cljs.core.first(type)))){
var G__21742 = cljs.core.first(type);
var G__21743 = context;
ast = G__21742;
context = G__21743;
continue;
} else {
var pred__21739 = cljs.core._EQ_;
var expr__21740 = cljs.core.first(type);
if(cljs.core.truth_((pred__21739.cljs$core$IFn$_invoke$arity$2 ? pred__21739.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$UNION_TYPE,expr__21740) : pred__21739.call(null,cljs.core.cst$kw$UNION_TYPE,expr__21740)))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"union",cljs.core.cst$kw$anyOf,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (ast,context,pred__21739,expr__21740,type){
return (function (p1__21733_SHARP_){
return datatype_expansion$expanded_form$ast__GT_type(p1__21733_SHARP_,context);
});})(ast,context,pred__21739,expr__21740,type))
,cljs.core.rest(type))], null);
} else {
if(cljs.core.truth_((pred__21739.cljs$core$IFn$_invoke$arity$2 ? pred__21739.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$SCALAR_TYPE,expr__21740) : pred__21739.call(null,cljs.core.cst$kw$SCALAR_TYPE,expr__21740)))){
return new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.last(type)], null);
} else {
if(cljs.core.truth_((pred__21739.cljs$core$IFn$_invoke$arity$2 ? pred__21739.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$ARRAY_TYPE,expr__21740) : pred__21739.call(null,cljs.core.cst$kw$ARRAY_TYPE,expr__21740)))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"array",cljs.core.cst$kw$items,datatype_expansion$expanded_form$ast__GT_type(cljs.core.last(type),context)], null);
} else {
if(cljs.core.truth_((pred__21739.cljs$core$IFn$_invoke$arity$2 ? pred__21739.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$TYPE_NAME,expr__21740) : pred__21739.call(null,cljs.core.cst$kw$TYPE_NAME,expr__21740)))){
return cljs.core.last(type);
} else {
return datatype_expansion.utils.error([cljs.core.str("Cannot parse type expression AST "),cljs.core.str(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,type))].join(''));
}
}
}
}
}
break;
}
});
datatype_expansion.expanded_form.parse_type_expression = (function datatype_expansion$expanded_form$parse_type_expression(exp,context){
try{return datatype_expansion.expanded_form.ast__GT_type((datatype_expansion.expanded_form.raml_type_grammar_analyser.cljs$core$IFn$_invoke$arity$1 ? datatype_expansion.expanded_form.raml_type_grammar_analyser.cljs$core$IFn$_invoke$arity$1(exp) : datatype_expansion.expanded_form.raml_type_grammar_analyser.call(null,exp)),context);
}catch (e21745){if((e21745 instanceof Error)){
var ex = e21745;
return null;
} else {
throw e21745;

}
}});
datatype_expansion.expanded_form.atomic_types = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 11, ["boolean",null,"string",null,"time-only",null,"any",null,"number",null,"datetime",null,"date-only",null,"integer",null,"datetime-only",null,"file",null,"nil",null], null), null);
datatype_expansion.expanded_form.collect_facets_constraints = (function datatype_expansion$expanded_form$collect_facets_constraints(node){
var facets = cljs.core.get.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$facets,cljs.core.PersistentArrayMap.EMPTY);
var facets__$1 = (function (){var or__6216__auto__ = cljs.core.keys(facets);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
if(cljs.core.map_QMARK_(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(facets__$1,datatype_expansion$expanded_form$collect_facets_constraints(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node)));
} else {
if(cljs.core.coll_QMARK_(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(facets__$1,cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2(datatype_expansion$expanded_form$collect_facets_constraints,cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(node))));
} else {
return facets__$1;

}
}
});
datatype_expansion.expanded_form.process_user_facets_constraints = (function datatype_expansion$expanded_form$process_user_facets_constraints(parsed_type,type_node){
var facets = datatype_expansion.expanded_form.collect_facets_constraints(type_node);
var facets_map = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (facets){
return (function (facet){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [facet,(facet.cljs$core$IFn$_invoke$arity$1 ? facet.cljs$core$IFn$_invoke$arity$1(type_node) : facet.call(null,type_node))], null);
});})(facets))
,facets));
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([parsed_type,facets_map], 0));
});
datatype_expansion.expanded_form.process_constraints = (function datatype_expansion$expanded_form$process_constraints(parsed_type,type_node){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(datatype_expansion.expanded_form.process_user_facets_constraints(parsed_type,type_node),cljs.core.cst$kw$required,((cljs.core.some_QMARK_(cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(type_node)))?cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(type_node):null)),cljs.core.cst$kw$xml,cljs.core.cst$kw$xml.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$fileTypes,cljs.core.cst$kw$fileTypes.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$example,cljs.core.cst$kw$example.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$description,cljs.core.cst$kw$description.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$displayName,cljs.core.cst$kw$displayName.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$default,cljs.core.cst$kw$default.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$examples,cljs.core.cst$kw$examples.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$title,cljs.core.cst$kw$title.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$minProperties,cljs.core.cst$kw$minProperties.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$maxProperties,cljs.core.cst$kw$maxProperties.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$discriminator,cljs.core.cst$kw$discriminator.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$discriminatorValue,cljs.core.cst$kw$discriminatorValue.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$minLength,cljs.core.cst$kw$minLength.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$maxLength,cljs.core.cst$kw$maxLength.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$minimum,cljs.core.cst$kw$minimum.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$maximum,cljs.core.cst$kw$maximum.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$format,cljs.core.cst$kw$format.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$multipleOf,cljs.core.cst$kw$multipleOf.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$pattern,cljs.core.cst$kw$pattern.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$uniqueItems,cljs.core.cst$kw$uniqueItems.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$minItems,cljs.core.cst$kw$minItems.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$maxItems,cljs.core.cst$kw$maxItems.cljs$core$IFn$_invoke$arity$1(type_node)),cljs.core.cst$kw$enum,(function (){var enum_values = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.cst$kw$enum.cljs$core$IFn$_invoke$arity$1(type_node));
if(cljs.core.empty_QMARK_(enum_values)){
return null;
} else {
return enum_values;
}
})()),cljs.core.cst$kw$additionalProperties,cljs.core.cst$kw$additionalProperties.cljs$core$IFn$_invoke$arity$2(type_node,(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("object",cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(parsed_type))) || (cljs.core.some_QMARK_(cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(parsed_type))))?true:null)));
});
datatype_expansion.expanded_form.xml_type_QMARK_ = (function datatype_expansion$expanded_form$xml_type_QMARK_(type){
return (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,"xml")) || ((typeof type === 'string') && (clojure.string.starts_with_QMARK_(type,"<?xml")));
});
datatype_expansion.expanded_form.json_type_QMARK_ = (function datatype_expansion$expanded_form$json_type_QMARK_(type){
return (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,"json")) || ((typeof type === 'string') && (clojure.string.starts_with_QMARK_(type,"{")));
});
datatype_expansion.expanded_form.setup_context = (function datatype_expansion$expanded_form$setup_context(p__21747){
var map__21751 = p__21747;
var map__21751__$1 = ((((!((map__21751 == null)))?((((map__21751.cljs$lang$protocol_mask$partition0$ & (64))) || (map__21751.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__21751):map__21751);
var context = map__21751__$1;
var path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21751__$1,cljs.core.cst$kw$path);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(context,cljs.core.cst$kw$path,cljs.core.PersistentVector.EMPTY,cljs.core.array_seq([cljs.core.cst$kw$fixpoints,(function (){var G__21753 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__21753) : cljs.core.atom.call(null,G__21753));
})()], 0));
});
datatype_expansion.expanded_form.cycle_QMARK_ = (function datatype_expansion$expanded_form$cycle_QMARK_(type,path){
return cljs.core.some_QMARK_(cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (type_in_path){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type_in_path,type);
}),path)));
});
datatype_expansion.expanded_form.process_items = (function datatype_expansion$expanded_form$process_items(node,context){
if(cljs.core.some_QMARK_(cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(node))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,cljs.core.cst$kw$items,(function (){var G__21756 = cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(node);
var G__21757 = context;
return (datatype_expansion.expanded_form.expanded_form_inner.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.expanded_form.expanded_form_inner.cljs$core$IFn$_invoke$arity$2(G__21756,G__21757) : datatype_expansion.expanded_form.expanded_form_inner.call(null,G__21756,G__21757));
})());
} else {
return node;
}
});
datatype_expansion.expanded_form.process_properties = (function datatype_expansion$expanded_form$process_properties(var_args){
var args21758 = [];
var len__7291__auto___21763 = arguments.length;
var i__7292__auto___21764 = (0);
while(true){
if((i__7292__auto___21764 < len__7291__auto___21763)){
args21758.push((arguments[i__7292__auto___21764]));

var G__21765 = (i__7292__auto___21764 + (1));
i__7292__auto___21764 = G__21765;
continue;
} else {
}
break;
}

var G__21760 = args21758.length;
switch (G__21760) {
case 2:
return datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21758.length)].join('')));

}
});

datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2 = (function (node,context){
return datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3(node,context,cljs.core.cst$kw$properties);
});

datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3 = (function (node,context,facet_name){
if(cljs.core.some_QMARK_((facet_name.cljs$core$IFn$_invoke$arity$1 ? facet_name.cljs$core$IFn$_invoke$arity$1(node) : facet_name.call(null,node)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(node,facet_name,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__21761){
var vec__21762 = p__21761;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21762,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21762,(1),null);
var prop_expanded = (datatype_expansion.expanded_form.expanded_form_inner.cljs$core$IFn$_invoke$arity$2 ? datatype_expansion.expanded_form.expanded_form_inner.cljs$core$IFn$_invoke$arity$2(v,context) : datatype_expansion.expanded_form.expanded_form_inner.call(null,v,context));
var explicit_required = (cljs.core.map_QMARK_(v)) && (cljs.core.some_QMARK_(cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(v)));
var optional = clojure.string.ends_with_QMARK_(cljs.core.name(k),"?");
var prop_name = ((explicit_required)?cljs.core.name(k):clojure.string.replace(cljs.core.name(k),/\?$/,""));
var prop_expanded__$1 = (((optional) && (!(explicit_required)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(prop_expanded,cljs.core.cst$kw$required,false):cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(prop_expanded,cljs.core.cst$kw$required,((explicit_required)?cljs.core.cst$kw$required.cljs$core$IFn$_invoke$arity$1(v):true)));
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [prop_name,prop_expanded__$1], null);
}),(facet_name.cljs$core$IFn$_invoke$arity$1 ? facet_name.cljs$core$IFn$_invoke$arity$1(node) : facet_name.call(null,node)))));
} else {
return node;
}
});

datatype_expansion.expanded_form.process_properties.cljs$lang$maxFixedArity = 3;
datatype_expansion.expanded_form.process_user_facets = (function datatype_expansion$expanded_form$process_user_facets(node,context){
var processed = datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$3(node,context,cljs.core.cst$kw$facets);
var facets = cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(processed);
if((facets == null)){
return processed;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(processed,cljs.core.cst$kw$facets,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(((function (processed,facets){
return (function (p__21769){
var vec__21770 = p__21769;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21770,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21770,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(v)], null)], null);
});})(processed,facets))
,facets)));
}
});
datatype_expansion.expanded_form.expanded_form_inner = (function datatype_expansion$expanded_form$expanded_form_inner(type_node,context){
var type_node__$1 = (((cljs.core.map_QMARK_(type_node)) && (cljs.core.some_QMARK_(cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type_node))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(type_node,cljs.core.cst$kw$properties,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__21779){
var vec__21780 = p__21779;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21780,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21780,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.name(k),v], null);
}),cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type_node)))):type_node);
var type = ((typeof type_node__$1 === 'string')?type_node__$1:(function (){var or__6216__auto__ = cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(type_node__$1);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.cst$kw$schema.cljs$core$IFn$_invoke$arity$1(type_node__$1);
}
})());
if(((type == null)) && ((type_node__$1 == null))){
return new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,datatype_expansion.expanded_form.default_type], null);
} else {
if((!(cljs.core.map_QMARK_(type))) && (cljs.core.coll_QMARK_(type))){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_items(datatype_expansion.expanded_form.process_user_facets(datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(type_node__$1,cljs.core.cst$kw$type,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (type_node__$1,type){
return (function (p1__21771_SHARP_){
return datatype_expansion$expanded_form$expanded_form_inner(p1__21771_SHARP_,context);
});})(type_node__$1,type))
,type)),context),context),context),type_node__$1));
} else {
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(datatype_expansion.expanded_form.atomic_types,type))){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_user_facets(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,type,cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),context),type_node__$1));
} else {
if((((type == null)) && (cljs.core.some_QMARK_(cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$1(type_node__$1)))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,"array"))){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_user_facets(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"array",cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),cljs.core.cst$kw$items,datatype_expansion$expanded_form$expanded_form_inner(cljs.core.cst$kw$items.cljs$core$IFn$_invoke$arity$2(type_node__$1,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,datatype_expansion.expanded_form.default_type], null)),context)),context),type_node__$1));
} else {
if((((type == null)) && (cljs.core.some_QMARK_(cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type_node__$1)))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,"object"))){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_user_facets(datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2(datatype_expansion.expanded_form.process_constraints(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,"object",cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1),cljs.core.cst$kw$properties,cljs.core.cst$kw$properties.cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),type_node__$1),context),context));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(type,"union")){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_user_facets(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,"union",cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1),cljs.core.cst$kw$anyOf,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (type_node__$1,type){
return (function (p1__21772_SHARP_){
return datatype_expansion$expanded_form$expanded_form_inner(p1__21772_SHARP_,context);
});})(type_node__$1,type))
,cljs.core.cst$kw$anyOf.cljs$core$IFn$_invoke$arity$1(type_node__$1))], null),context),type_node__$1));
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.some_QMARK_(type);
if(and__6204__auto__){
var and__6204__auto____$1 = (typeof type === 'string') || ((type instanceof cljs.core.Keyword));
if(and__6204__auto____$1){
var or__6216__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(context,cljs.core.name(type));
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(context,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(type));
}
} else {
return and__6204__auto____$1;
}
} else {
return and__6204__auto__;
}
})())){
var ref_type = (function (){var or__6216__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(context,cljs.core.name(type));
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(context,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(type));
}
})();
if((ref_type == null)){
throw (new Error([cljs.core.str("Cannot find reference "),cljs.core.str(cljs.core.name(type))].join('')));
} else {
}

if(cljs.core.truth_(datatype_expansion.expanded_form.cycle_QMARK_(cljs.core.name(type),cljs.core.cst$kw$path.cljs$core$IFn$_invoke$arity$1(context)))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$fixpoints.cljs$core$IFn$_invoke$arity$1(context),((function (ref_type,type_node__$1,type){
return (function (fps){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(fps,type,true);
});})(ref_type,type_node__$1,type))
);

return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,cljs.core.cst$kw$$recur], null),type_node__$1));
} else {
var path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(context,cljs.core.cst$kw$path);
var context__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(context,cljs.core.cst$kw$path,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(path,cljs.core.name(type)));
if(typeof type_node__$1 === 'string'){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(datatype_expansion$expanded_form$expanded_form_inner(ref_type,context__$1),cljs.core.cst$kw$$ref,type);
} else {
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_items(datatype_expansion.expanded_form.process_user_facets(datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(((cljs.core.map_QMARK_(type_node__$1))?type_node__$1:cljs.core.PersistentArrayMap.EMPTY),cljs.core.cst$kw$$ref,type),cljs.core.cst$kw$type,datatype_expansion$expanded_form$expanded_form_inner(ref_type,context__$1)),context__$1),context__$1),context__$1),type_node__$1));
}
}
} else {
if(cljs.core.truth_(datatype_expansion.expanded_form.xml_type_QMARK_(type))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(type_node__$1),"xml")){
return type_node__$1;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"xml",cljs.core.cst$kw$content,type], null);
}
} else {
if(cljs.core.truth_(datatype_expansion.expanded_form.json_type_QMARK_(type))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(type_node__$1),"json")){
return type_node__$1;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"json",cljs.core.cst$kw$content,type], null);
}
} else {
if(((type == null)) && (cljs.core.some_QMARK_(type_node__$1))){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_user_facets(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,"any",cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1)], null),context),type_node__$1));
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = typeof type === 'string';
if(and__6204__auto__){
return cljs.core.re_matches(/^.*\?$/,type);
} else {
return and__6204__auto__;
}
})())){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion.expanded_form.process_user_facets(new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$type,"union",cljs.core.cst$kw$facets,cljs.core.cst$kw$facets.cljs$core$IFn$_invoke$arity$1(type_node__$1),cljs.core.cst$kw$anyOf,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,clojure.string.replace(type,"?","")], null),new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$type,"nil"], null)], null)], null),context),type_node__$1));
} else {
if(cljs.core.map_QMARK_(type)){
var result = datatype_expansion$expanded_form$expanded_form_inner(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(type_node__$1,cljs.core.cst$kw$type,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [type], null)),context);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_items(datatype_expansion.expanded_form.process_user_facets(datatype_expansion.expanded_form.process_properties.cljs$core$IFn$_invoke$arity$2(result,context),context),context)),cljs.core.cst$kw$type,cljs.core.first(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(result)));
} else {
var parsed_type = datatype_expansion.expanded_form.parse_type_expression(type,context);
if(cljs.core.some_QMARK_(parsed_type)){
return datatype_expansion.utils.clear_node(datatype_expansion.expanded_form.process_constraints(datatype_expansion$expanded_form$expanded_form_inner(parsed_type,context),type_node__$1));
} else {
return datatype_expansion.utils.error([cljs.core.str("Unknown type "),cljs.core.str(type),cljs.core.str(" in "),cljs.core.str(context)].join(''));
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
if((cljs.core.map_QMARK_(t)) && (cljs.core.some_QMARK_(cljs.core.cst$kw$$ref.cljs$core$IFn$_invoke$arity$1(t)))){
var ref_type = cljs.core.cst$kw$$ref.cljs$core$IFn$_invoke$arity$1(t);
var t__$1 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(t,cljs.core.cst$kw$$ref);
var processed = datatype_expansion$expanded_form$add_fixpoints(t__$1,fixpoints,num_fixpoints);
if(cljs.core.some_QMARK_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(fixpoints,ref_type))){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,cljs.core.cst$kw$fixpoint,cljs.core.cst$kw$value,processed], null);
} else {
return processed;
}
} else {
if((cljs.core.map_QMARK_(t)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$type.cljs$core$IFn$_invoke$arity$1(t),cljs.core.cst$kw$$recur))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(num_fixpoints,cljs.core.inc);

return t;
} else {
if(cljs.core.map_QMARK_(t)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__21784){
var vec__21785 = p__21784;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21785,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21785,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,datatype_expansion$expanded_form$add_fixpoints(v,fixpoints,num_fixpoints)], null);
}),t));
} else {
if(cljs.core.coll_QMARK_(t)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21781_SHARP_){
return datatype_expansion$expanded_form$add_fixpoints(p1__21781_SHARP_,fixpoints,num_fixpoints);
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

var context__$1 = datatype_expansion.expanded_form.setup_context(context);
var found_context_type = cljs.core.ffirst(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(((function (context__$1){
return (function (p__21790){
var vec__21791 = p__21790;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21791,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21791,(1),null);
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,node);
});})(context__$1))
,context__$1));
var path = ((cljs.core.some_QMARK_(found_context_type))?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [found_context_type], null):cljs.core.PersistentVector.EMPTY);
var context__$2 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(context__$1,cljs.core.cst$kw$path,path);
var expanded = datatype_expansion.expanded_form.expanded_form_inner(node,context__$2);
var expanded__$1 = ((cljs.core.some_QMARK_(found_context_type))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(expanded,cljs.core.cst$kw$$ref,found_context_type):expanded);
var num_fixpoints = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0)) : cljs.core.atom.call(null,(0)));
var expanded__$2 = datatype_expansion.expanded_form.add_fixpoints(expanded__$1,(function (){var G__21792 = cljs.core.cst$kw$fixpoints.cljs$core$IFn$_invoke$arity$1(context__$2);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__21792) : cljs.core.deref.call(null,G__21792));
})(),num_fixpoints);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(num_fixpoints) : cljs.core.deref.call(null,num_fixpoints)),cljs.core.count((function (){var G__21793 = cljs.core.cst$kw$fixpoints.cljs$core$IFn$_invoke$arity$1(context__$2);
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(G__21793) : cljs.core.deref.call(null,G__21793));
})()))){
return expanded__$2;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$type,cljs.core.cst$kw$fixpoint,cljs.core.cst$kw$value,expanded__$2], null);
}
});
