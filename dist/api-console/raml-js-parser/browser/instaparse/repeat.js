// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.repeat');
goog.require('cljs.core');
goog.require('instaparse.combinators_source');
goog.require('instaparse.auto_flatten_seq');
goog.require('instaparse.viz');
goog.require('instaparse.gll');
goog.require('instaparse.reduction');
goog.require('instaparse.failure');
instaparse.repeat.empty_result_QMARK_ = (function instaparse$repeat$empty_result_QMARK_(result){
return ((cljs.core.vector_QMARK_(result)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(result),(1)))) || ((cljs.core.map_QMARK_(result)) && (cljs.core.contains_QMARK_(result,cljs.core.cst$kw$tag)) && (cljs.core.empty_QMARK_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(result,cljs.core.cst$kw$content)))) || (cljs.core.empty_QMARK_(result));
});
instaparse.repeat.failure_signal = instaparse.gll.__GT_Failure(null,null);
instaparse.repeat.get_end = (function instaparse$repeat$get_end(var_args){
var args21601 = [];
var len__7291__auto___21606 = arguments.length;
var i__7292__auto___21607 = (0);
while(true){
if((i__7292__auto___21607 < len__7291__auto___21606)){
args21601.push((arguments[i__7292__auto___21607]));

var G__21608 = (i__7292__auto___21607 + (1));
i__7292__auto___21607 = G__21608;
continue;
} else {
}
break;
}

var G__21603 = args21601.length;
switch (G__21603) {
case 1:
return instaparse.repeat.get_end.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.repeat.get_end.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21601.length)].join('')));

}
});

instaparse.repeat.get_end.cljs$core$IFn$_invoke$arity$1 = (function (parse){
var vec__21604 = instaparse.viz.span(parse);
var start = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21604,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21604,(1),null);
if(cljs.core.truth_(end)){
return cljs.core.long$(end);
} else {
return cljs.core.count(parse);
}
});

instaparse.repeat.get_end.cljs$core$IFn$_invoke$arity$2 = (function (parse,index){
var vec__21605 = instaparse.viz.span(parse);
var start = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21605,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21605,(1),null);
if(cljs.core.truth_(end)){
return cljs.core.long$(end);
} else {
return (index + cljs.core.count(parse));
}
});

instaparse.repeat.get_end.cljs$lang$maxFixedArity = 2;
instaparse.repeat.parse_from_index = (function instaparse$repeat$parse_from_index(grammar,initial_parser,text,segment,index){
var tramp = instaparse.gll.make_tramp.cljs$core$IFn$_invoke$arity$3(grammar,text,segment);
instaparse.gll.push_listener(tramp,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [index,initial_parser], null),instaparse.gll.TopListener(tramp));

return instaparse.gll.run.cljs$core$IFn$_invoke$arity$1(tramp);
});
/**
 * Returns either:
 * [a-parse end-index a-list-of-valid-follow-up-parses]
 * [a-parse end-index nil] (successfully reached end of text)
 * nil (hit a dead-end with this strategy)
 */
instaparse.repeat.select_parse = (function instaparse$repeat$select_parse(grammar,initial_parser,text,segment,index,parses){
var length = cljs.core.count(text);
var parses__$1 = cljs.core.seq(parses);
while(true){
if(parses__$1){
var parse = cljs.core.first(parses__$1);
var vec__21611 = instaparse.viz.span(parse);
var start = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21611,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21611,(1),null);
var end__$1 = (cljs.core.truth_(end)?end:(index + cljs.core.count(parse)));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(end__$1,length)){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [parse,end__$1,null], null);
} else {
var temp__4655__auto__ = cljs.core.seq(instaparse.repeat.parse_from_index(grammar,initial_parser,text,segment,end__$1));
if(temp__4655__auto__){
var follow_ups = temp__4655__auto__;
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [parse,end__$1,follow_ups], null);
} else {
var G__21612 = cljs.core.next(parses__$1);
parses__$1 = G__21612;
continue;
}

}
} else {
return null;
}
break;
}
});
instaparse.repeat.repeat_parse_hiccup = (function instaparse$repeat$repeat_parse_hiccup(var_args){
var args21613 = [];
var len__7291__auto___21620 = arguments.length;
var i__7292__auto___21621 = (0);
while(true){
if((i__7292__auto___21621 < len__7291__auto___21620)){
args21613.push((arguments[i__7292__auto___21621]));

var G__21622 = (i__7292__auto___21621 + (1));
i__7292__auto___21621 = G__21622;
continue;
} else {
}
break;
}

var G__21615 = args21613.length;
switch (G__21615) {
case 5:
return instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21613.length)].join('')));

}
});

instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$5 = (function (grammar,initial_parser,root_tag,text,segment){
return instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$6(grammar,initial_parser,root_tag,text,segment,(0));
});

instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$6 = (function (grammar,initial_parser,root_tag,text,segment,index){
var length = cljs.core.count(text);
var first_result = instaparse.repeat.parse_from_index(grammar,initial_parser,text,segment,index);
var index__$1 = cljs.core.long$(index);
var parses = instaparse.auto_flatten_seq.auto_flatten_seq(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [root_tag], null));
var G__21617 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,index__$1,first_result);
var vec__21618 = G__21617;
var parse = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21618,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21618,(1),null);
var follow_ups = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21618,(2),null);
var selection = vec__21618;
var index__$2 = index__$1;
var parses__$1 = parses;
var G__21617__$1 = G__21617;
while(true){
var index__$3 = index__$2;
var parses__$2 = parses__$1;
var vec__21619 = G__21617__$1;
var parse__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21619,(0),null);
var end__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21619,(1),null);
var follow_ups__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21619,(2),null);
var selection__$1 = vec__21619;
if((selection__$1 == null)){
return instaparse.repeat.failure_signal;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(index__$3,end__$1)){
return instaparse.repeat.failure_signal;
} else {
if((follow_ups__$1 == null)){
return instaparse.gll.safe_with_meta(instaparse.auto_flatten_seq.convert_afs_to_vec(instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1)),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$optimize,cljs.core.cst$kw$memory,cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index,(0),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index,length], null));
} else {
var G__21624 = cljs.core.long$(end__$1);
var G__21625 = instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1);
var G__21626 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,end__$1,follow_ups__$1);
index__$2 = G__21624;
parses__$1 = G__21625;
G__21617__$1 = G__21626;
continue;

}
}
}
break;
}
});

instaparse.repeat.repeat_parse_hiccup.cljs$lang$maxFixedArity = 6;
instaparse.repeat.repeat_parse_enlive = (function instaparse$repeat$repeat_parse_enlive(var_args){
var args21627 = [];
var len__7291__auto___21634 = arguments.length;
var i__7292__auto___21635 = (0);
while(true){
if((i__7292__auto___21635 < len__7291__auto___21634)){
args21627.push((arguments[i__7292__auto___21635]));

var G__21636 = (i__7292__auto___21635 + (1));
i__7292__auto___21635 = G__21636;
continue;
} else {
}
break;
}

var G__21629 = args21627.length;
switch (G__21629) {
case 5:
return instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21627.length)].join('')));

}
});

instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$5 = (function (grammar,initial_parser,root_tag,text,segment){
return instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$6(grammar,initial_parser,root_tag,text,segment,(0));
});

instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$6 = (function (grammar,initial_parser,root_tag,text,segment,index){
var length = cljs.core.count(text);
var first_result = instaparse.repeat.parse_from_index(grammar,initial_parser,text,segment,index);
var index__$1 = cljs.core.long$(index);
var parses = instaparse.auto_flatten_seq.EMPTY;
var G__21631 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,index__$1,first_result);
var vec__21632 = G__21631;
var parse = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21632,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21632,(1),null);
var follow_ups = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21632,(2),null);
var selection = vec__21632;
var index__$2 = index__$1;
var parses__$1 = parses;
var G__21631__$1 = G__21631;
while(true){
var index__$3 = index__$2;
var parses__$2 = parses__$1;
var vec__21633 = G__21631__$1;
var parse__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21633,(0),null);
var end__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21633,(1),null);
var follow_ups__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21633,(2),null);
var selection__$1 = vec__21633;
if((selection__$1 == null)){
return instaparse.repeat.failure_signal;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(index__$3,end__$1)){
return instaparse.repeat.failure_signal;
} else {
if((follow_ups__$1 == null)){
return instaparse.gll.safe_with_meta(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tag,root_tag,cljs.core.cst$kw$content,cljs.core.seq(instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1))], null),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$optimize,cljs.core.cst$kw$memory,cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index,(0),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index,length], null));
} else {
var G__21638 = cljs.core.long$(end__$1);
var G__21639 = instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1);
var G__21640 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,end__$1,follow_ups__$1);
index__$2 = G__21638;
parses__$1 = G__21639;
G__21631__$1 = G__21640;
continue;

}
}
}
break;
}
});

instaparse.repeat.repeat_parse_enlive.cljs$lang$maxFixedArity = 6;
instaparse.repeat.repeat_parse_no_tag = (function instaparse$repeat$repeat_parse_no_tag(var_args){
var args21641 = [];
var len__7291__auto___21648 = arguments.length;
var i__7292__auto___21649 = (0);
while(true){
if((i__7292__auto___21649 < len__7291__auto___21648)){
args21641.push((arguments[i__7292__auto___21649]));

var G__21650 = (i__7292__auto___21649 + (1));
i__7292__auto___21649 = G__21650;
continue;
} else {
}
break;
}

var G__21643 = args21641.length;
switch (G__21643) {
case 4:
return instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21641.length)].join('')));

}
});

instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$4 = (function (grammar,initial_parser,text,segment){
return instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$5(grammar,initial_parser,text,segment,(0));
});

instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$5 = (function (grammar,initial_parser,text,segment,index){
var length = cljs.core.count(text);
var first_result = instaparse.repeat.parse_from_index(grammar,initial_parser,text,segment,index);
var index__$1 = cljs.core.long$(index);
var parses = instaparse.auto_flatten_seq.EMPTY;
var G__21645 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,index__$1,first_result);
var vec__21646 = G__21645;
var parse = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21646,(0),null);
var end = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21646,(1),null);
var follow_ups = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21646,(2),null);
var selection = vec__21646;
var index__$2 = index__$1;
var parses__$1 = parses;
var G__21645__$1 = G__21645;
while(true){
var index__$3 = index__$2;
var parses__$2 = parses__$1;
var vec__21647 = G__21645__$1;
var parse__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21647,(0),null);
var end__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21647,(1),null);
var follow_ups__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21647,(2),null);
var selection__$1 = vec__21647;
if((selection__$1 == null)){
return instaparse.repeat.failure_signal;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(index__$3,end__$1)){
return instaparse.repeat.failure_signal;
} else {
if((follow_ups__$1 == null)){
return instaparse.gll.safe_with_meta(instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1),new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$optimize,cljs.core.cst$kw$memory,cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index,(0),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index,length], null));
} else {
var G__21652 = cljs.core.long$(end__$1);
var G__21653 = instaparse.auto_flatten_seq.conj_flat(parses__$2,parse__$1);
var G__21654 = instaparse.repeat.select_parse(grammar,initial_parser,text,segment,end__$1,follow_ups__$1);
index__$2 = G__21652;
parses__$1 = G__21653;
G__21645__$1 = G__21654;
continue;

}
}
}
break;
}
});

instaparse.repeat.repeat_parse_no_tag.cljs$lang$maxFixedArity = 5;
instaparse.repeat.repeat_parse = (function instaparse$repeat$repeat_parse(var_args){
var args21655 = [];
var len__7291__auto___21658 = arguments.length;
var i__7292__auto___21659 = (0);
while(true){
if((i__7292__auto___21659 < len__7291__auto___21658)){
args21655.push((arguments[i__7292__auto___21659]));

var G__21660 = (i__7292__auto___21659 + (1));
i__7292__auto___21659 = G__21660;
continue;
} else {
}
break;
}

var G__21657 = args21655.length;
switch (G__21657) {
case 4:
return instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args21655.length)].join('')));

}
});

instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$4 = (function (grammar,initial_parser,output_format,text){
return instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$4(grammar,initial_parser,text,instaparse.gll.text__GT_segment(text));
});

instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$5 = (function (grammar,initial_parser,output_format,root_tag,text){
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$hiccup,null,cljs.core.cst$kw$enlive,null], null), null).call(null,output_format))){
} else {
throw (new Error("Assert failed: (#{:hiccup :enlive} output-format)"));
}

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(output_format,cljs.core.cst$kw$hiccup)){
return instaparse.repeat.repeat_parse_hiccup.cljs$core$IFn$_invoke$arity$5(grammar,initial_parser,root_tag,text,instaparse.gll.text__GT_segment(text));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(output_format,cljs.core.cst$kw$enlive)){
return instaparse.repeat.repeat_parse_enlive.cljs$core$IFn$_invoke$arity$5(grammar,initial_parser,root_tag,text,instaparse.gll.text__GT_segment(text));
} else {
return null;
}
}
});

instaparse.repeat.repeat_parse.cljs$lang$maxFixedArity = 5;
instaparse.repeat.repeat_parse_with_header = (function instaparse$repeat$repeat_parse_with_header(grammar,header_parser,repeating_parser,output_format,root_tag,text){
var segment = instaparse.gll.text__GT_segment(text);
var length = cljs.core.count(text);
var header_results = instaparse.repeat.parse_from_index(grammar,header_parser,text,segment,(0));
if(cljs.core.truth_((function (){var or__6216__auto__ = cljs.core.empty_QMARK_(header_results);
if(or__6216__auto__){
return or__6216__auto__;
} else {
return cljs.core.cst$kw$hide.cljs$core$IFn$_invoke$arity$1(header_parser);
}
})())){
return instaparse.repeat.failure_signal;
} else {
var header_result = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.max_key,instaparse.repeat.get_end,header_results);
var end = instaparse.repeat.get_end.cljs$core$IFn$_invoke$arity$1(header_result);
var repeat_result = instaparse.repeat.repeat_parse_no_tag.cljs$core$IFn$_invoke$arity$5(grammar,cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(repeating_parser),text,segment,end);
var span_meta = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$optimize,cljs.core.cst$kw$memory,cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index,(0),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index,length], null);
if(cljs.core.truth_((function (){var or__6216__auto__ = (repeat_result instanceof instaparse.gll.Failure);
if(or__6216__auto__){
return or__6216__auto__;
} else {
var and__6204__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(repeating_parser),cljs.core.cst$kw$star);
if(and__6204__auto__){
return instaparse.repeat.empty_result_QMARK_(repeat_result);
} else {
return and__6204__auto__;
}
}
})())){
return instaparse.repeat.failure_signal;
} else {
var G__21663 = (((output_format instanceof cljs.core.Keyword))?output_format.fqn:null);
switch (G__21663) {
case "enlive":
return instaparse.gll.safe_with_meta(new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tag,root_tag,cljs.core.cst$kw$content,instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.EMPTY,header_result),repeat_result)], null),span_meta);

break;
case "hiccup":
return instaparse.gll.safe_with_meta(instaparse.auto_flatten_seq.convert_afs_to_vec(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.auto_flatten_seq(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [root_tag], null)),header_result),repeat_result)),span_meta);

break;
default:
return instaparse.gll.safe_with_meta(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.conj_flat(instaparse.auto_flatten_seq.EMPTY,header_result),repeat_result),span_meta);

}
}
}
});
instaparse.repeat.try_repeating_parse_strategy_with_header = (function instaparse$repeat$try_repeating_parse_strategy_with_header(grammar,text,start_production,start_rule,output_format){

var parsers = cljs.core.cst$kw$parsers.cljs$core$IFn$_invoke$arity$1(start_rule);
var repeating_parser = cljs.core.last(parsers);
if(cljs.core.not((function (){var and__6204__auto__ = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(start_rule),cljs.core.cst$kw$cat);
if(and__6204__auto__){
var and__6204__auto____$1 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$star,null,cljs.core.cst$kw$plus,null], null), null).call(null,cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(repeating_parser));
if(cljs.core.truth_(and__6204__auto____$1)){
return (cljs.core.not(cljs.core.cst$kw$hide.cljs$core$IFn$_invoke$arity$1(repeating_parser))) && (cljs.core.not(cljs.core.cst$kw$hide.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(repeating_parser))));
} else {
return and__6204__auto____$1;
}
} else {
return and__6204__auto__;
}
})())){
return instaparse.repeat.failure_signal;
} else {
var header_parser = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.cat,cljs.core.butlast(parsers));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(start_rule),instaparse.reduction.raw_non_terminal_reduction)){
return instaparse.repeat.repeat_parse_with_header(grammar,header_parser,repeating_parser,null,start_production,text);
} else {
return instaparse.repeat.repeat_parse_with_header(grammar,header_parser,repeating_parser,output_format,start_production,text);
}
}
});
instaparse.repeat.try_repeating_parse_strategy = (function instaparse$repeat$try_repeating_parse_strategy(parser,text,start_production){
var grammar = cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser);
var output_format = cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(parser);
var start_rule = cljs.core.get.cljs$core$IFn$_invoke$arity$2(grammar,start_production);

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$hide.cljs$core$IFn$_invoke$arity$1(start_rule),true)){
return instaparse.repeat.failure_signal;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(start_rule),instaparse.reduction.raw_non_terminal_reduction)){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(start_rule),cljs.core.cst$kw$star)){
return instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$4(grammar,cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(start_rule),output_format,text);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(start_rule),cljs.core.cst$kw$plus)){
var result = instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$4(grammar,cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(start_rule),output_format,text);
if(cljs.core.truth_(instaparse.repeat.empty_result_QMARK_(result))){
return instaparse.repeat.failure_signal;
} else {
return result;
}
} else {
return instaparse.repeat.try_repeating_parse_strategy_with_header(grammar,text,start_production,start_rule,output_format);

}
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(start_rule),cljs.core.cst$kw$star)){
return instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$5(grammar,cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(start_rule),output_format,start_production,text);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(start_rule),cljs.core.cst$kw$plus)){
var result = instaparse.repeat.repeat_parse.cljs$core$IFn$_invoke$arity$5(grammar,cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(start_rule),output_format,start_production,text);
if(cljs.core.truth_(instaparse.repeat.empty_result_QMARK_(result))){
return instaparse.repeat.failure_signal;
} else {
return result;
}
} else {
return instaparse.repeat.try_repeating_parse_strategy_with_header(grammar,text,start_production,start_rule,output_format);

}
}
}
}
});
instaparse.repeat.used_memory_optimization_QMARK_ = (function instaparse$repeat$used_memory_optimization_QMARK_(tree){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$memory,cljs.core.cst$kw$optimize.cljs$core$IFn$_invoke$arity$1(cljs.core.meta(tree)));
});
