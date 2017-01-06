// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.cfg');
goog.require('cljs.core');
goog.require('instaparse.combinators_source');
goog.require('instaparse.reduction');
goog.require('instaparse.gll');
goog.require('clojure.string');
goog.require('cljs.reader');
/**
 * When true all string literal terminals in built grammar will be treated as case insensitive
 */
instaparse.cfg._STAR_case_insensitive_literals_STAR_ = false;
instaparse.cfg.single_quoted_string = /'[^'\\]*(?:\\.[^'\\]*)*'/;
instaparse.cfg.single_quoted_regexp = /#'[^'\\]*(?:\\.[^'\\]*)*'/;
instaparse.cfg.double_quoted_string = /\"[^\"\\]*(?:\\.[^\"\\]*)*\"/;
instaparse.cfg.double_quoted_regexp = /#\"[^\"\\]*(?:\\.[^\"\\]*)*\"/;
instaparse.cfg.inside_comment = /(?:(?!(?:\(\*|\*\)))[\s\S])*/;
instaparse.cfg.ws = "[,\\s]*";
instaparse.cfg.opt_whitespace = instaparse.combinators_source.hide(instaparse.combinators_source.nt(cljs.core.cst$kw$opt_DASH_whitespace));
instaparse.cfg.cfg = instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$hiccup,cljs.core.PersistentHashMap.fromArrays([cljs.core.cst$kw$neg,cljs.core.cst$kw$cat,cljs.core.cst$kw$ord,cljs.core.cst$kw$rule_DASH_separator,cljs.core.cst$kw$alt,cljs.core.cst$kw$look,cljs.core.cst$kw$rule,cljs.core.cst$kw$nt,cljs.core.cst$kw$hide_DASH_nt,cljs.core.cst$kw$inside_DASH_comment,cljs.core.cst$kw$star,cljs.core.cst$kw$string,cljs.core.cst$kw$rules,cljs.core.cst$kw$hide,cljs.core.cst$kw$paren,cljs.core.cst$kw$alt_DASH_or_DASH_ord,cljs.core.cst$kw$regexp,cljs.core.cst$kw$factor,cljs.core.cst$kw$comment,cljs.core.cst$kw$plus,cljs.core.cst$kw$epsilon,cljs.core.cst$kw$opt_DASH_whitespace,cljs.core.cst$kw$opt],[instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("!")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$factor)], 0)),instaparse.combinators_source.plus(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.cfg.opt_whitespace,instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$factor),instaparse.combinators_source.nt(cljs.core.cst$kw$look),instaparse.combinators_source.nt(cljs.core.cst$kw$neg)], 0)),instaparse.cfg.opt_whitespace], 0))),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$cat),instaparse.combinators_source.plus(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("/")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$cat)], 0)))], 0)),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string(":"),instaparse.combinators_source.string(":="),instaparse.combinators_source.string("::="),instaparse.combinators_source.string("=")], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$cat),instaparse.combinators_source.star(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("|")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$cat)], 0)))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("&")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$factor)], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$nt),instaparse.combinators_source.nt(cljs.core.cst$kw$hide_DASH_nt)], 0)),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.nt(cljs.core.cst$kw$rule_DASH_separator)),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$alt_DASH_or_DASH_ord),instaparse.combinators_source.hide(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$opt_DASH_whitespace),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$opt_DASH_whitespace),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string(";"),instaparse.combinators_source.string(".")], 0)),instaparse.combinators_source.nt(cljs.core.cst$kw$opt_DASH_whitespace)], 0))], 0)))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.neg(instaparse.combinators_source.nt(cljs.core.cst$kw$epsilon)),instaparse.combinators_source.regexp("[^, \\r\\t\\n<>(){}\\[\\]+*?:=|'\"#&!;./]+")], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("<")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$nt),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string(">"))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.regexp(instaparse.cfg.inside_comment),instaparse.combinators_source.star(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$comment),instaparse.combinators_source.regexp(instaparse.cfg.inside_comment)], 0)))], 0)),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("{")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$alt_DASH_or_DASH_ord),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("}"))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$factor),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("*"))], 0))], 0)),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.regexp(instaparse.cfg.single_quoted_string),instaparse.combinators_source.regexp(instaparse.cfg.double_quoted_string)], 0)),instaparse.combinators_source.hide_tag(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.cfg.opt_whitespace,instaparse.combinators_source.plus(instaparse.combinators_source.nt(cljs.core.cst$kw$rule))], 0))),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("<")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$alt_DASH_or_DASH_ord),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string(">"))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("(")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$alt_DASH_or_DASH_ord),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string(")"))], 0)),instaparse.combinators_source.hide_tag(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$alt),instaparse.combinators_source.nt(cljs.core.cst$kw$ord)], 0))),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.regexp(instaparse.cfg.single_quoted_regexp),instaparse.combinators_source.regexp(instaparse.cfg.double_quoted_regexp)], 0)),instaparse.combinators_source.hide_tag(instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$nt),instaparse.combinators_source.nt(cljs.core.cst$kw$string),instaparse.combinators_source.nt(cljs.core.cst$kw$regexp),instaparse.combinators_source.nt(cljs.core.cst$kw$opt),instaparse.combinators_source.nt(cljs.core.cst$kw$star),instaparse.combinators_source.nt(cljs.core.cst$kw$plus),instaparse.combinators_source.nt(cljs.core.cst$kw$paren),instaparse.combinators_source.nt(cljs.core.cst$kw$hide),instaparse.combinators_source.nt(cljs.core.cst$kw$epsilon)], 0))),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string("(*"),instaparse.combinators_source.nt(cljs.core.cst$kw$inside_DASH_comment),instaparse.combinators_source.string("*)")], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$factor),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("+"))], 0)),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.string("Epsilon"),instaparse.combinators_source.string("epsilon"),instaparse.combinators_source.string("EPSILON"),instaparse.combinators_source.string("eps"),instaparse.combinators_source.string("\u03B5")], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.regexp(instaparse.cfg.ws),instaparse.combinators_source.star(instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$comment),instaparse.combinators_source.regexp(instaparse.cfg.ws)], 0)))], 0)),instaparse.combinators_source.alt.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.hide(instaparse.combinators_source.string("[")),instaparse.cfg.opt_whitespace,instaparse.combinators_source.nt(cljs.core.cst$kw$alt_DASH_or_DASH_ord),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("]"))], 0)),instaparse.combinators_source.cat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.combinators_source.nt(cljs.core.cst$kw$factor),instaparse.cfg.opt_whitespace,instaparse.combinators_source.hide(instaparse.combinators_source.string("?"))], 0))], 0))]));
instaparse.cfg.tag = cljs.core.first;
instaparse.cfg.contents = cljs.core.next;
instaparse.cfg.content = cljs.core.fnext;
/**
 * Converts escaped single-quotes to unescaped, and unescaped double-quotes to escaped
 */
instaparse.cfg.escape = (function instaparse$cfg$escape(s){
var sq = cljs.core.seq(s);
var v = cljs.core.PersistentVector.EMPTY;
while(true){
var temp__4655__auto__ = cljs.core.first(sq);
if(cljs.core.truth_(temp__4655__auto__)){
var c = temp__4655__auto__;
var G__21428 = c;
switch (G__21428) {
case "\\":
var temp__4655__auto____$1 = cljs.core.second(sq);
if(cljs.core.truth_(temp__4655__auto____$1)){
var c2 = temp__4655__auto____$1;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(c2,"'")){
var G__21430 = cljs.core.drop.cljs$core$IFn$_invoke$arity$2((2),sq);
var G__21431 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(v,c2);
sq = G__21430;
v = G__21431;
continue;
} else {
var G__21432 = cljs.core.drop.cljs$core$IFn$_invoke$arity$2((2),sq);
var G__21433 = cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(v,c,cljs.core.array_seq([c2], 0));
sq = G__21432;
v = G__21433;
continue;
}
} else {
throw [cljs.core.str("Encountered backslash character at end of string:"),cljs.core.str(s)].join('');
}

break;
case "\"":
var G__21434 = cljs.core.next(sq);
var G__21435 = cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(v,"\\",cljs.core.array_seq(["\""], 0));
sq = G__21434;
v = G__21435;
continue;

break;
default:
var G__21436 = cljs.core.next(sq);
var G__21437 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(v,c);
sq = G__21436;
v = G__21437;
continue;

}
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,v);
}
break;
}
});
instaparse.cfg.safe_read_string = (function instaparse$cfg$safe_read_string(s){
return cljs.reader.read_string_STAR_(cljs.reader.push_back_reader(s),null);
});
/**
 * Converts single quoted string to double-quoted
 */
instaparse.cfg.process_string = (function instaparse$cfg$process_string(s){
var stripped = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(s,(1),(cljs.core.count(s) - (1)));
var remove_escaped_single_quotes = instaparse.cfg.escape(stripped);
var final_string = instaparse.cfg.safe_read_string([cljs.core.str(remove_escaped_single_quotes),cljs.core.str("\"")].join(''));
return final_string;
});
/**
 * Converts single quoted regexp to double-quoted
 */
instaparse.cfg.process_regexp = (function instaparse$cfg$process_regexp(s){
var stripped = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(s,(2),(cljs.core.count(s) - (1)));
var remove_escaped_single_quotes = instaparse.cfg.escape(stripped);
var final_string = cljs.core.re_pattern(remove_escaped_single_quotes);
return final_string;
});
/**
 * Convert one parsed rule from the grammar into combinators
 */
instaparse.cfg.build_rule = (function instaparse$cfg$build_rule(tree){
while(true){
var G__21447 = ((((instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.tag.call(null,tree)) instanceof cljs.core.Keyword))?(instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.tag.call(null,tree)).fqn:null);
switch (G__21447) {
case "neg":
return instaparse.combinators_source.neg(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "cat":
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.cat,cljs.core.map.cljs$core$IFn$_invoke$arity$2(instaparse$cfg$build_rule,(instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.contents.call(null,tree))));

break;
case "ord":
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.ord,cljs.core.map.cljs$core$IFn$_invoke$arity$2(instaparse$cfg$build_rule,(instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.contents.call(null,tree))));

break;
case "alt":
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(instaparse.combinators_source.alt,cljs.core.map.cljs$core$IFn$_invoke$arity$2(instaparse$cfg$build_rule,(instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.contents.call(null,tree))));

break;
case "look":
return instaparse.combinators_source.look(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "rule":
var vec__21448 = (instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.contents.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.contents.call(null,tree));
var nt = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21448,(0),null);
var alt_or_ord = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21448,(1),null);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1(nt) : instaparse.cfg.tag.call(null,nt)),cljs.core.cst$kw$hide_DASH_nt)){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1((function (){var G__21449 = (instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(nt) : instaparse.cfg.content.call(null,nt));
return (instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(G__21449) : instaparse.cfg.content.call(null,G__21449));
})()),instaparse.combinators_source.hide_tag(instaparse$cfg$build_rule(alt_or_ord))], null);
} else {
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(nt) : instaparse.cfg.content.call(null,nt))),instaparse$cfg$build_rule(alt_or_ord)], null);
}

break;
case "nt":
return instaparse.combinators_source.nt(cljs.core.keyword.cljs$core$IFn$_invoke$arity$1((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "star":
return instaparse.combinators_source.star(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "string":
return (cljs.core.truth_(instaparse.cfg._STAR_case_insensitive_literals_STAR_)?instaparse.combinators_source.string_ci:instaparse.combinators_source.string).call(null,instaparse.cfg.process_string((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "hide":
return instaparse.combinators_source.hide(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "paren":
var G__21451 = (instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree));
tree = G__21451;
continue;

break;
case "regexp":
return instaparse.combinators_source.regexp(instaparse.cfg.process_regexp((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "plus":
return instaparse.combinators_source.plus(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
case "epsilon":
return instaparse.combinators_source.Epsilon;

break;
case "opt":
return instaparse.combinators_source.opt(instaparse$cfg$build_rule((instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.content.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.content.call(null,tree))));

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str((instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1 ? instaparse.cfg.tag.cljs$core$IFn$_invoke$arity$1(tree) : instaparse.cfg.tag.call(null,tree)))].join('')));

}
break;
}
});
/**
 * Returns a sequence of all non-terminals in a parser built from combinators.
 */
instaparse.cfg.seq_nt = (function instaparse$cfg$seq_nt(parser){
while(true){
var G__21453 = (((cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parser) instanceof cljs.core.Keyword))?cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parser).fqn:null);
switch (G__21453) {
case "neg":
var G__21455 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21455;
continue;

break;
case "cat":
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(instaparse$cfg$seq_nt,cljs.core.array_seq([cljs.core.cst$kw$parsers.cljs$core$IFn$_invoke$arity$1(parser)], 0));

break;
case "ord":
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(instaparse$cfg$seq_nt,cljs.core.array_seq([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$parser1.cljs$core$IFn$_invoke$arity$1(parser),cljs.core.cst$kw$parser2.cljs$core$IFn$_invoke$arity$1(parser)], null)], 0));

break;
case "alt":
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(instaparse$cfg$seq_nt,cljs.core.array_seq([cljs.core.cst$kw$parsers.cljs$core$IFn$_invoke$arity$1(parser)], 0));

break;
case "look":
var G__21456 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21456;
continue;

break;
case "nt":
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$keyword.cljs$core$IFn$_invoke$arity$1(parser)], null);

break;
case "rep":
var G__21457 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21457;
continue;

break;
case "star":
var G__21458 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21458;
continue;

break;
case "string":
return cljs.core.PersistentVector.EMPTY;

break;
case "regexp":
return cljs.core.PersistentVector.EMPTY;

break;
case "plus":
var G__21459 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21459;
continue;

break;
case "epsilon":
return cljs.core.PersistentVector.EMPTY;

break;
case "string-ci":
return cljs.core.PersistentVector.EMPTY;

break;
case "char":
return cljs.core.PersistentVector.EMPTY;

break;
case "opt":
var G__21460 = cljs.core.cst$kw$parser.cljs$core$IFn$_invoke$arity$1(parser);
parser = G__21460;
continue;

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parser))].join('')));

}
break;
}
});
/**
 * Throw error if grammar uses any invalid non-terminals in its productions
 */
instaparse.cfg.check_grammar = (function instaparse$cfg$check_grammar(grammar_map){
var valid_nts_21469 = cljs.core.set(cljs.core.keys(grammar_map));
var seq__21465_21470 = cljs.core.seq(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(instaparse.cfg.seq_nt,cljs.core.array_seq([cljs.core.vals(grammar_map)], 0))));
var chunk__21466_21471 = null;
var count__21467_21472 = (0);
var i__21468_21473 = (0);
while(true){
if((i__21468_21473 < count__21467_21472)){
var nt_21474 = chunk__21466_21471.cljs$core$IIndexed$_nth$arity$2(null,i__21468_21473);
if(cljs.core.truth_((valid_nts_21469.cljs$core$IFn$_invoke$arity$1 ? valid_nts_21469.cljs$core$IFn$_invoke$arity$1(nt_21474) : valid_nts_21469.call(null,nt_21474)))){
} else {
throw [cljs.core.str(cljs.core.subs.cljs$core$IFn$_invoke$arity$2([cljs.core.str(nt_21474)].join(''),(1))),cljs.core.str(" occurs on the right-hand side of your grammar, but not on the left")].join('');
}

var G__21475 = seq__21465_21470;
var G__21476 = chunk__21466_21471;
var G__21477 = count__21467_21472;
var G__21478 = (i__21468_21473 + (1));
seq__21465_21470 = G__21475;
chunk__21466_21471 = G__21476;
count__21467_21472 = G__21477;
i__21468_21473 = G__21478;
continue;
} else {
var temp__4657__auto___21479 = cljs.core.seq(seq__21465_21470);
if(temp__4657__auto___21479){
var seq__21465_21480__$1 = temp__4657__auto___21479;
if(cljs.core.chunked_seq_QMARK_(seq__21465_21480__$1)){
var c__7027__auto___21481 = cljs.core.chunk_first(seq__21465_21480__$1);
var G__21482 = cljs.core.chunk_rest(seq__21465_21480__$1);
var G__21483 = c__7027__auto___21481;
var G__21484 = cljs.core.count(c__7027__auto___21481);
var G__21485 = (0);
seq__21465_21470 = G__21482;
chunk__21466_21471 = G__21483;
count__21467_21472 = G__21484;
i__21468_21473 = G__21485;
continue;
} else {
var nt_21486 = cljs.core.first(seq__21465_21480__$1);
if(cljs.core.truth_((valid_nts_21469.cljs$core$IFn$_invoke$arity$1 ? valid_nts_21469.cljs$core$IFn$_invoke$arity$1(nt_21486) : valid_nts_21469.call(null,nt_21486)))){
} else {
throw [cljs.core.str(cljs.core.subs.cljs$core$IFn$_invoke$arity$2([cljs.core.str(nt_21486)].join(''),(1))),cljs.core.str(" occurs on the right-hand side of your grammar, but not on the left")].join('');
}

var G__21487 = cljs.core.next(seq__21465_21480__$1);
var G__21488 = null;
var G__21489 = (0);
var G__21490 = (0);
seq__21465_21470 = G__21487;
chunk__21466_21471 = G__21488;
count__21467_21472 = G__21489;
i__21468_21473 = G__21490;
continue;
}
} else {
}
}
break;
}

return grammar_map;
});
instaparse.cfg.build_parser = (function instaparse$cfg$build_parser(spec,output_format){
var rules = instaparse.gll.parse(instaparse.cfg.cfg,cljs.core.cst$kw$rules,spec,false);
if((rules instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21493_21495 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21494_21496 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21493_21495,_STAR_print_fn_STAR_21494_21496,sb__7202__auto__,rules){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21493_21495,_STAR_print_fn_STAR_21494_21496,sb__7202__auto__,rules))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rules], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21494_21496;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21493_21495;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
var productions = cljs.core.map.cljs$core$IFn$_invoke$arity$2(instaparse.cfg.build_rule,rules);
var start_production = cljs.core.first(cljs.core.first(productions));
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$grammar,instaparse.cfg.check_grammar(instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(output_format,cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,productions))),cljs.core.cst$kw$start_DASH_production,start_production,cljs.core.cst$kw$output_DASH_format,output_format], null);
}
});
instaparse.cfg.build_parser_from_combinators = (function instaparse$cfg$build_parser_from_combinators(grammar_map,output_format,start_production){
if((start_production == null)){
throw "When you build a parser from a map of parser combinators, you must provide a start production using the :start keyword argument.";
} else {
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$grammar,instaparse.cfg.check_grammar(instaparse.reduction.apply_standard_reductions.cljs$core$IFn$_invoke$arity$2(output_format,grammar_map)),cljs.core.cst$kw$start_DASH_production,start_production,cljs.core.cst$kw$output_DASH_format,output_format], null);
}
});
/**
 * Takes an EBNF grammar specification string and returns the combinator version.
 * If you give it the right-hand side of a rule, it will return the combinator equivalent.
 * If you give it a series of rules, it will give you back a grammar map.   
 * Useful for combining with other combinators.
 */
instaparse.cfg.ebnf = (function instaparse$cfg$ebnf(spec){
if(cljs.core.truth_(cljs.core.re_find(/[:=]/,spec))){
var rules = instaparse.gll.parse(instaparse.cfg.cfg,cljs.core.cst$kw$rules,spec,false);
if((rules instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21501_21505 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21502_21506 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21501_21505,_STAR_print_fn_STAR_21502_21506,sb__7202__auto__,rules){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21501_21505,_STAR_print_fn_STAR_21502_21506,sb__7202__auto__,rules))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rules], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21502_21506;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21501_21505;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2(instaparse.cfg.build_rule,rules));
}
} else {
var rhs = instaparse.gll.parse(instaparse.cfg.cfg,cljs.core.cst$kw$alt_DASH_or_DASH_ord,spec,false);
if((rhs instanceof instaparse.gll.Failure)){
throw [cljs.core.str("Error parsing grammar specification:\n"),cljs.core.str((function (){var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_21503_21507 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_21504_21508 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_21503_21507,_STAR_print_fn_STAR_21504_21508,sb__7202__auto__,rhs){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_21503_21507,_STAR_print_fn_STAR_21504_21508,sb__7202__auto__,rhs))
;

try{cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([rhs], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_21504_21508;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_21503_21507;
}
return [cljs.core.str(sb__7202__auto__)].join('');
})())].join('');
} else {
return instaparse.cfg.build_rule(cljs.core.first(rhs));
}
}
});
