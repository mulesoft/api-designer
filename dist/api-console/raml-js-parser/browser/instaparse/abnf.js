// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.abnf');
goog.require('cljs.core');
goog.require('instaparse.transform');
goog.require('instaparse.combinators_source');
goog.require('instaparse.gll');
goog.require('instaparse.cfg');
goog.require('instaparse.reduction');
goog.require('goog.string.format');
/**
 * This is normally set to false, in which case the non-terminals
 * are treated as case-sensitive, which is NOT the norm
 * for ABNF grammars. If you really want case-insensitivity,
 * bind this to true, in which case all non-terminals
 * will be converted to upper-case internally (which
 * you'll have to keep in mind when transforming).
 */
instaparse.abnf._STAR_case_insensitive_STAR_ = false;
instaparse.abnf.abnf_core = cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$CRLF,cljs.core.cst$kw$HTAB,cljs.core.cst$kw$LWSP,cljs.core.cst$kw$LF,cljs.core.cst$kw$VCHAR,cljs.core.cst$kw$DIGIT,cljs.core.cst$kw$SP,cljs.core.cst$kw$HEXDIG,cljs.core.cst$kw$CTL,cljs.core.cst$kw$DQUOTE,cljs.core.cst$kw$WSP,cljs.core.cst$kw$CR,cljs.core.cst$kw$OCTET,cljs.core.cst$kw$ALPHA,cljs.core.cst$kw$CHAR,cljs.core.cst$kw$BIT],[instaparse.combinators_source.string("\r\n"),instaparse.combinators_source.string("\t"),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string(" "),instaparse.combinators_source.string("\t")], 0)),instaparse.combinators_source.star(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string("\r\n"),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string(" "),instaparse.combinators_source.string("\t")], 0))], 0)))], 0)),instaparse.combinators_source.string("\n"),instaparse.combinators_source.regexp("[\\u0021-\\u007E]"),instaparse.combinators_source.regexp("[0-9]"),instaparse.combinators_source.string(" "),instaparse.combinators_source.regexp("[0-9a-fA-F]"),instaparse.combinators_source.regexp("[\\u0000-\\u001F|\\u007F]"),instaparse.combinators_source.string("\""),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string(" "),instaparse.combinators_source.string("\t")], 0)),instaparse.combinators_source.string("\r"),instaparse.combinators_source.regexp("[\\u0000-\\u00FF]"),instaparse.combinators_source.regexp("[a-zA-Z]"),instaparse.combinators_source.regexp("[\\u0001-\\u007F]"),instaparse.combinators_source.regexp("[01]")]);
instaparse.abnf.abnf_grammar = "\n<rulelist> = <opt-whitespace> (rule | hide-tag-rule)+;\nrule = rulename-left <defined-as> alternation <opt-whitespace>;\nhide-tag-rule = hide-tag <defined-as> alternation <opt-whitespace>;\nrulename-left = rulename;\nrulename-right = rulename;\n<rulename> = #'[a-zA-Z][-a-zA-Z0-9]*';\n<hide-tag> = <'<' opt-whitespace> rulename-left <opt-whitespace '>'>;\ndefined-as = <opt-whitespace> ('=' | '=/') <opt-whitespace>;\nalternation = concatenation (<opt-whitespace '/' opt-whitespace> concatenation)*;\nconcatenation = repetition (<whitespace> repetition)*;\nrepetition = [repeat] <opt-whitespace> element;\nrepeat = NUM | (NUM? '*' NUM?);\n<element> = rulename-right | group | hide | option | char-val | num-val\n          | look | neg | regexp;\nlook = <'&' opt-whitespace> element;\nneg = <'!' opt-whitespace> element;\n<group> = <'(' opt-whitespace> alternation <opt-whitespace ')'>;\noption = <'[' opt-whitespace> alternation <opt-whitespace ']'>;\nhide = <'<' opt-whitespace> alternation <opt-whitespace '>'>;\nchar-val = <'\\u0022'> #'[\\u0020-\\u0021\\u0023-\\u007E]'* <'\\u0022'> (* double-quoted strings *)\n         | <'\\u0027'> #'[\\u0020-\\u0026(-~]'* <'\\u0027'>;  (* single-quoted strings *)\n<num-val> = <'%'> (bin-val | dec-val | hex-val);\nbin-val = <'b'> bin-char\n          [ (<'.'> bin-char)+ | ('-' bin-char) ];\nbin-char = ('0' | '1')+;\ndec-val = <'d'> dec-char\n          [ (<'.'> dec-char)+ | ('-' dec-char) ];\ndec-char = DIGIT+;\nhex-val = <'x'> hex-char\n          [ (<'.'> hex-char)+ | ('-' hex-char) ];\nhex-char = HEXDIG+;\nNUM = DIGIT+;\n<DIGIT> = #'[0-9]';\n<HEXDIG> = #'[0-9a-fA-F]';\nopt-whitespace = #'\\s*(?:;.*?(?:\\u000D?\\u000A\\s*|$))*';\nwhitespace = #'\\s+(?:;.*?\\u000D?\\u000A\\s*)*';\nregexp = #\"#'[^'\\\\]*(?:\\\\.[^'\\\\]*)*'\"\n       | #\"#\\\"[^\\\"\\\\]*(?:\\\\.[^\\\"\\\\]*)*\\\"\"\n";
/**
 * Formats a string using goog.string.format.
 */
instaparse.abnf.format = (function instaparse$abnf$format(var_args){
var args__7298__auto__ = [];
var len__7291__auto___21513 = arguments.length;
var i__7292__auto___21514 = (0);
while(true){
if((i__7292__auto___21514 < len__7291__auto___21513)){
args__7298__auto__.push((arguments[i__7292__auto___21514]));

var G__21515 = (i__7292__auto___21514 + (1));
i__7292__auto___21514 = G__21515;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((1) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((1)),(0),null)):null);
return instaparse.abnf.format.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7299__auto__);
});

instaparse.abnf.format.cljs$core$IFn$_invoke$arity$variadic = (function (fmt,args){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(goog.string.format,fmt,args);
});

instaparse.abnf.format.cljs$lang$maxFixedArity = (1);

instaparse.abnf.format.cljs$lang$applyTo = (function (seq21511){
var G__21512 = cljs.core.first(seq21511);
var seq21511__$1 = cljs.core.next(seq21511);
return instaparse.abnf.format.cljs$core$IFn$_invoke$arity$variadic(G__21512,seq21511__$1);
});
instaparse.abnf.get_char_combinator = (function instaparse$abnf$get_char_combinator(var_args){
var args__7298__auto__ = [];
var len__7291__auto___21524 = arguments.length;
var i__7292__auto___21525 = (0);
while(true){
if((i__7292__auto___21525 < len__7291__auto___21524)){
args__7298__auto__.push((arguments[i__7292__auto___21525]));

var G__21526 = (i__7292__auto___21525 + (1));
i__7292__auto___21525 = G__21526;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((0) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((0)),(0),null)):null);
return instaparse.abnf.get_char_combinator.cljs$core$IFn$_invoke$arity$variadic(argseq__7299__auto__);
});

instaparse.abnf.get_char_combinator.cljs$core$IFn$_invoke$arity$variadic = (function (nums){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("-",cljs.core.second(nums))){
var vec__21517 = nums;
var lo = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21517,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21517,(1),null);
var hi = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21517,(2),null);
return instaparse.combinators_source.unicode_char.cljs$core$IFn$_invoke$arity$2(lo,hi);
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.cat,(function (){var iter__6996__auto__ = (function instaparse$abnf$iter__21518(s__21519){
return (new cljs.core.LazySeq(null,(function (){
var s__21519__$1 = s__21519;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__21519__$1);
if(temp__4657__auto__){
var s__21519__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(s__21519__$2)){
var c__6994__auto__ = cljs.core.chunk_first(s__21519__$2);
var size__6995__auto__ = cljs.core.count(c__6994__auto__);
var b__21521 = cljs.core.chunk_buffer(size__6995__auto__);
if((function (){var i__21520 = (0);
while(true){
if((i__21520 < size__6995__auto__)){
var n = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__6994__auto__,i__21520);
cljs.core.chunk_append(b__21521,instaparse.combinators_source.unicode_char.cljs$core$IFn$_invoke$arity$1(n));

var G__21527 = (i__21520 + (1));
i__21520 = G__21527;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__21521),instaparse$abnf$iter__21518(cljs.core.chunk_rest(s__21519__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__21521),null);
}
} else {
var n = cljs.core.first(s__21519__$2);
return cljs.core.cons(instaparse.combinators_source.unicode_char.cljs$core$IFn$_invoke$arity$1(n),instaparse$abnf$iter__21518(cljs.core.rest(s__21519__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__6996__auto__(nums);
})());

}
});

instaparse.abnf.get_char_combinator.cljs$lang$maxFixedArity = (0);

instaparse.abnf.get_char_combinator.cljs$lang$applyTo = (function (seq21516){
return instaparse.abnf.get_char_combinator.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21516));
});
/**
 * Restricts map to certain keys
 */
instaparse.abnf.project = (function instaparse$abnf$project(m,ks){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__6996__auto__ = (function instaparse$abnf$project_$_iter__21534(s__21535){
return (new cljs.core.LazySeq(null,(function (){
var s__21535__$1 = s__21535;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__21535__$1);
if(temp__4657__auto__){
var s__21535__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(s__21535__$2)){
var c__6994__auto__ = cljs.core.chunk_first(s__21535__$2);
var size__6995__auto__ = cljs.core.count(c__6994__auto__);
var b__21537 = cljs.core.chunk_buffer(size__6995__auto__);
if((function (){var i__21536 = (0);
while(true){
if((i__21536 < size__6995__auto__)){
var k = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__6994__auto__,i__21536);
if(cljs.core.contains_QMARK_(m,k)){
cljs.core.chunk_append(b__21537,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,(m.cljs$core$IFn$_invoke$arity$1 ? m.cljs$core$IFn$_invoke$arity$1(k) : m.call(null,k))], null));

var G__21540 = (i__21536 + (1));
i__21536 = G__21540;
continue;
} else {
var G__21541 = (i__21536 + (1));
i__21536 = G__21541;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__21537),instaparse$abnf$project_$_iter__21534(cljs.core.chunk_rest(s__21535__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__21537),null);
}
} else {
var k = cljs.core.first(s__21535__$2);
if(cljs.core.contains_QMARK_(m,k)){
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,(m.cljs$core$IFn$_invoke$arity$1 ? m.cljs$core$IFn$_invoke$arity$1(k) : m.call(null,k))], null),instaparse$abnf$project_$_iter__21534(cljs.core.rest(s__21535__$2)));
} else {
var G__21542 = cljs.core.rest(s__21535__$2);
s__21535__$1 = G__21542;
continue;
}
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__6996__auto__(ks);
})());
});
/**
 * Merges abnf-core map in with parsed grammar map
 */
instaparse.abnf.merge_core = (function instaparse$abnf$merge_core(grammar_map){
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.abnf.project(instaparse.abnf.abnf_core,cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(instaparse.cfg.seq_nt,cljs.core.array_seq([cljs.core.vals(grammar_map)], 0)))),grammar_map], 0));
});
/**
 * Tests whether parser was constructed with hide-tag
 */
instaparse.abnf.hide_tag_QMARK_ = (function instaparse$abnf$hide_tag_QMARK_(p){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(p),instaparse.reduction.raw_non_terminal_reduction);
});
instaparse.abnf.alt_preserving_hide_tag = (function instaparse$abnf$alt_preserving_hide_tag(p1,p2){
var hide_tag_p1_QMARK_ = instaparse.abnf.hide_tag_QMARK_(p1);
var hide_tag_p2_QMARK_ = instaparse.abnf.hide_tag_QMARK_(p2);
if(cljs.core.truth_((function (){var and__6204__auto__ = hide_tag_p1_QMARK_;
if(cljs.core.truth_(and__6204__auto__)){
return hide_tag_p2_QMARK_;
} else {
return and__6204__auto__;
}
})())){
return instaparse.combinators_source.hide_tag(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1,cljs.core.cst$kw$red),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p2,cljs.core.cst$kw$red)], 0)));
} else {
if(cljs.core.truth_(hide_tag_p1_QMARK_)){
return instaparse.combinators_source.hide_tag(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1,cljs.core.cst$kw$red),p2], 0)));
} else {
if(cljs.core.truth_(hide_tag_p2_QMARK_)){
return instaparse.combinators_source.hide_tag(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([p1,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p2,cljs.core.cst$kw$red)], 0)));
} else {
return instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([p1,p2], 0));

}
}
}
});
instaparse.abnf.abnf_transformer = cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$neg,cljs.core.cst$kw$hide_DASH_tag_DASH_rule,cljs.core.cst$kw$look,cljs.core.cst$kw$bin_DASH_char,cljs.core.cst$kw$rule,cljs.core.cst$kw$rulename_DASH_right,cljs.core.cst$kw$NUM,cljs.core.cst$kw$char_DASH_val,cljs.core.cst$kw$hide,cljs.core.cst$kw$option,cljs.core.cst$kw$hex_DASH_char,cljs.core.cst$kw$bin_DASH_val,cljs.core.cst$kw$dec_DASH_val,cljs.core.cst$kw$concatenation,cljs.core.cst$kw$alternation,cljs.core.cst$kw$regexp,cljs.core.cst$kw$repetition,cljs.core.cst$kw$rulename_DASH_left,cljs.core.cst$kw$repeat,cljs.core.cst$kw$hex_DASH_val,cljs.core.cst$kw$dec_DASH_char],[instaparse.combinators_source.neg,(function (tag,rule){
return cljs.core.PersistentArrayMap.fromArray([tag,instaparse.combinators_source.hide_tag(rule)], true, false);
}),instaparse.combinators_source.look,(function() { 
var G__21553__delegate = function (cs){
var G__21546 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cs);
var G__21547 = (2);
return parseInt(G__21546,G__21547);
};
var G__21553 = function (var_args){
var cs = null;
if (arguments.length > 0) {
var G__21554__i = 0, G__21554__a = new Array(arguments.length -  0);
while (G__21554__i < G__21554__a.length) {G__21554__a[G__21554__i] = arguments[G__21554__i + 0]; ++G__21554__i;}
  cs = new cljs.core.IndexedSeq(G__21554__a,0);
} 
return G__21553__delegate.call(this,cs);};
G__21553.cljs$lang$maxFixedArity = 0;
G__21553.cljs$lang$applyTo = (function (arglist__21555){
var cs = cljs.core.seq(arglist__21555);
return G__21553__delegate(cs);
});
G__21553.cljs$core$IFn$_invoke$arity$variadic = G__21553__delegate;
return G__21553;
})()
,cljs.core.hash_map,(function() { 
var G__21556__delegate = function (rest__21544_SHARP_){
if(cljs.core.truth_(instaparse.abnf._STAR_case_insensitive_STAR_)){
return instaparse.combinators_source.nt(cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(clojure.string.upper_case(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,rest__21544_SHARP_))));
} else {
return instaparse.combinators_source.nt(cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,rest__21544_SHARP_)));
}
};
var G__21556 = function (var_args){
var rest__21544_SHARP_ = null;
if (arguments.length > 0) {
var G__21557__i = 0, G__21557__a = new Array(arguments.length -  0);
while (G__21557__i < G__21557__a.length) {G__21557__a[G__21557__i] = arguments[G__21557__i + 0]; ++G__21557__i;}
  rest__21544_SHARP_ = new cljs.core.IndexedSeq(G__21557__a,0);
} 
return G__21556__delegate.call(this,rest__21544_SHARP_);};
G__21556.cljs$lang$maxFixedArity = 0;
G__21556.cljs$lang$applyTo = (function (arglist__21558){
var rest__21544_SHARP_ = cljs.core.seq(arglist__21558);
return G__21556__delegate(rest__21544_SHARP_);
});
G__21556.cljs$core$IFn$_invoke$arity$variadic = G__21556__delegate;
return G__21556;
})()
,(function() { 
var G__21559__delegate = function (rest__21545_SHARP_){
var G__21548 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,rest__21545_SHARP_);
return parseInt(G__21548);
};
var G__21559 = function (var_args){
var rest__21545_SHARP_ = null;
if (arguments.length > 0) {
var G__21560__i = 0, G__21560__a = new Array(arguments.length -  0);
while (G__21560__i < G__21560__a.length) {G__21560__a[G__21560__i] = arguments[G__21560__i + 0]; ++G__21560__i;}
  rest__21545_SHARP_ = new cljs.core.IndexedSeq(G__21560__a,0);
} 
return G__21559__delegate.call(this,rest__21545_SHARP_);};
G__21559.cljs$lang$maxFixedArity = 0;
G__21559.cljs$lang$applyTo = (function (arglist__21561){
var rest__21545_SHARP_ = cljs.core.seq(arglist__21561);
return G__21559__delegate(rest__21545_SHARP_);
});
G__21559.cljs$core$IFn$_invoke$arity$variadic = G__21559__delegate;
return G__21559;
})()
,(function() { 
var G__21562__delegate = function (cs){
return instaparse.combinators_source.string_ci(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cs));
};
var G__21562 = function (var_args){
var cs = null;
if (arguments.length > 0) {
var G__21563__i = 0, G__21563__a = new Array(arguments.length -  0);
while (G__21563__i < G__21563__a.length) {G__21563__a[G__21563__i] = arguments[G__21563__i + 0]; ++G__21563__i;}
  cs = new cljs.core.IndexedSeq(G__21563__a,0);
} 
return G__21562__delegate.call(this,cs);};
G__21562.cljs$lang$maxFixedArity = 0;
G__21562.cljs$lang$applyTo = (function (arglist__21564){
var cs = cljs.core.seq(arglist__21564);
return G__21562__delegate(cs);
});
G__21562.cljs$core$IFn$_invoke$arity$variadic = G__21562__delegate;
return G__21562;
})()
,instaparse.combinators_source.hide,instaparse.combinators_source.opt,(function() { 
var G__21565__delegate = function (cs){
var G__21549 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cs);
var G__21550 = (16);
return parseInt(G__21549,G__21550);
};
var G__21565 = function (var_args){
var cs = null;
if (arguments.length > 0) {
var G__21566__i = 0, G__21566__a = new Array(arguments.length -  0);
while (G__21566__i < G__21566__a.length) {G__21566__a[G__21566__i] = arguments[G__21566__i + 0]; ++G__21566__i;}
  cs = new cljs.core.IndexedSeq(G__21566__a,0);
} 
return G__21565__delegate.call(this,cs);};
G__21565.cljs$lang$maxFixedArity = 0;
G__21565.cljs$lang$applyTo = (function (arglist__21567){
var cs = cljs.core.seq(arglist__21567);
return G__21565__delegate(cs);
});
G__21565.cljs$core$IFn$_invoke$arity$variadic = G__21565__delegate;
return G__21565;
})()
,instaparse.abnf.get_char_combinator,instaparse.abnf.get_char_combinator,instaparse.combinators_source.cat,instaparse.combinators_source.alt,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.regexp,instaparse.cfg.process_regexp),(function() {
var G__21568 = null;
var G__21568__1 = (function (element){
return element;
});
var G__21568__2 = (function (repeat,element){
if(cljs.core.empty_QMARK_(repeat)){
return instaparse.combinators_source.star(element);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(repeat),(2))){
return instaparse.combinators_source.rep(cljs.core.cst$kw$low.cljs$core$IFn$_invoke$arity$1(repeat),cljs.core.cst$kw$high.cljs$core$IFn$_invoke$arity$1(repeat),element);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$low.cljs$core$IFn$_invoke$arity$1(repeat),(1))){
return instaparse.combinators_source.plus(element);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$high.cljs$core$IFn$_invoke$arity$1(repeat),(1))){
return instaparse.combinators_source.opt(element);
} else {
return instaparse.combinators_source.rep((function (){var or__6216__auto__ = cljs.core.cst$kw$low.cljs$core$IFn$_invoke$arity$1(repeat);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return (0);
}
})(),(function (){var or__6216__auto__ = cljs.core.cst$kw$high.cljs$core$IFn$_invoke$arity$1(repeat);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return Infinity;
}
})(),element);

}
}
}
}
});
G__21568 = function(repeat,element){
switch(arguments.length){
case 1:
return G__21568__1.call(this,repeat);
case 2:
return G__21568__2.call(this,repeat,element);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__21568.cljs$core$IFn$_invoke$arity$1 = G__21568__1;
G__21568.cljs$core$IFn$_invoke$arity$2 = G__21568__2;
return G__21568;
})()
,(function() { 
var G__21569__delegate = function (rest__21543_SHARP_){
if(cljs.core.truth_(instaparse.abnf._STAR_case_insensitive_STAR_)){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(clojure.string.upper_case(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,rest__21543_SHARP_)));
} else {
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,rest__21543_SHARP_));
}
};
var G__21569 = function (var_args){
var rest__21543_SHARP_ = null;
if (arguments.length > 0) {
var G__21570__i = 0, G__21570__a = new Array(arguments.length -  0);
while (G__21570__i < G__21570__a.length) {G__21570__a[G__21570__i] = arguments[G__21570__i + 0]; ++G__21570__i;}
  rest__21543_SHARP_ = new cljs.core.IndexedSeq(G__21570__a,0);
} 
return G__21569__delegate.call(this,rest__21543_SHARP_);};
G__21569.cljs$lang$maxFixedArity = 0;
G__21569.cljs$lang$applyTo = (function (arglist__21571){
var rest__21543_SHARP_ = cljs.core.seq(arglist__21571);
return G__21569__delegate(rest__21543_SHARP_);
});
G__21569.cljs$core$IFn$_invoke$arity$variadic = G__21569__delegate;
return G__21569;
})()
,(function() { 
var G__21572__delegate = function (items){
var G__21551 = cljs.core.count(items);
switch (G__21551) {
case (1):
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(items),"*")){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$low,cljs.core.first(items),cljs.core.cst$kw$high,cljs.core.first(items)], null);

}

break;
case (2):
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(items),"*")){
return new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$high,cljs.core.second(items)], null);
} else {
return new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$low,cljs.core.first(items)], null);

}

break;
case (3):
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$low,cljs.core.first(items),cljs.core.cst$kw$high,cljs.core.nth.cljs$core$IFn$_invoke$arity$2(items,(2))], null);

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(cljs.core.count(items))].join('')));

}
};
var G__21572 = function (var_args){
var items = null;
if (arguments.length > 0) {
var G__21574__i = 0, G__21574__a = new Array(arguments.length -  0);
while (G__21574__i < G__21574__a.length) {G__21574__a[G__21574__i] = arguments[G__21574__i + 0]; ++G__21574__i;}
  items = new cljs.core.IndexedSeq(G__21574__a,0);
} 
return G__21572__delegate.call(this,items);};
G__21572.cljs$lang$maxFixedArity = 0;
G__21572.cljs$lang$applyTo = (function (arglist__21575){
var items = cljs.core.seq(arglist__21575);
return G__21572__delegate(items);
});
G__21572.cljs$core$IFn$_invoke$arity$variadic = G__21572__delegate;
return G__21572;
})()
,instaparse.abnf.get_char_combinator,(function() { 
var G__21576__delegate = function (cs){
var G__21552 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cs);
return parseInt(G__21552);
};
var G__21576 = function (var_args){
var cs = null;
if (arguments.length > 0) {
var G__21577__i = 0, G__21577__a = new Array(arguments.length -  0);
while (G__21577__i < G__21577__a.length) {G__21577__a[G__21577__i] = arguments[G__21577__i + 0]; ++G__21577__i;}
  cs = new cljs.core.IndexedSeq(G__21577__a,0);
} 
return G__21576__delegate.call(this,cs);};
G__21576.cljs$lang$maxFixedArity = 0;
G__21576.cljs$lang$applyTo = (function (arglist__21578){
var cs = cljs.core.seq(arglist__21578);
return G__21576__delegate(cs);
});
G__21576.cljs$core$IFn$_invoke$arity$variadic = G__21576__delegate;
return G__21576;
})()
]);
instaparse.abnf.abnf_parser = instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$hiccup,instaparse.cfg.ebnf(instaparse.abnf.abnf_grammar));
instaparse.abnf.rules__GT_grammar_map = (function instaparse$abnf$rules__GT_grammar_map(rules){
return instaparse.abnf.merge_core(cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.merge_with,instaparse.abnf.alt_preserving_hide_tag,rules));
});
/**
 * Takes an ABNF grammar specification string and returns the combinator version.
 *   If you give it the right-hand side of a rule, it will return the combinator equivalent.
 *   If you give it a series of rules, it will give you back a grammar map.   
 *   Useful for combining with other combinators.
 */
instaparse.abnf.abnf = (function instaparse$abnf$abnf(spec){
if(cljs.core.truth_(cljs.core.re_find(/=/,spec))){
var rule_tree = instaparse.gll.parse(instaparse.abnf.abnf_parser,cljs.core.cst$kw$rulelist,spec,false);
if((rule_tree instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21583_21587 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21584_21588 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21583_21587,_STAR_print_fn_STAR_21584_21588,sb__7202__auto__,rule_tree){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21583_21587,_STAR_print_fn_STAR_21584_21588,sb__7202__auto__,rule_tree))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rule_tree], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21584_21588;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21583_21587;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
return instaparse.abnf.rules__GT_grammar_map(instaparse.transform.transform(instaparse.abnf.abnf_transformer,rule_tree));
}
} else {
var rhs_tree = instaparse.gll.parse(instaparse.abnf.abnf_parser,cljs.core.cst$kw$alternation,spec,false);
if((rhs_tree instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21585_21589 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21586_21590 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21585_21589,_STAR_print_fn_STAR_21586_21590,sb__7202__auto__,rhs_tree){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21585_21589,_STAR_print_fn_STAR_21586_21590,sb__7202__auto__,rhs_tree))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rhs_tree], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21586_21590;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21585_21589;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
return instaparse.transform.transform(instaparse.abnf.abnf_transformer,rhs_tree);
}
}
});
instaparse.abnf.build_parser = (function instaparse$abnf$build_parser(spec,output_format){
var rule_tree = instaparse.gll.parse(instaparse.abnf.abnf_parser,cljs.core.cst$kw$rulelist,spec,false);
if((rule_tree instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21593_21595 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21594_21596 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21593_21595,_STAR_print_fn_STAR_21594_21596,sb__7202__auto__,rule_tree){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21593_21595,_STAR_print_fn_STAR_21594_21596,sb__7202__auto__,rule_tree))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rule_tree], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21594_21596;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21593_21595;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
var rules = instaparse.transform.transform(instaparse.abnf.abnf_transformer,rule_tree);
var grammar_map = instaparse.abnf.rules__GT_grammar_map(rules);
var start_production = cljs.core.first(cljs.core.first(cljs.core.first(rules)));
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$grammar,instaparse.cfg.check_grammar(instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(output_format,grammar_map)),cljs.core.cst$kw$start_DASH_production,start_production,cljs.core.cst$kw$output_DASH_format,output_format], null);
}
});
