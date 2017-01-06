// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.print');
goog.require('cljs.core');
goog.require('clojure.string');
instaparse.print.paren_for_tags = (function instaparse$print$paren_for_tags(tag_set,hidden_QMARK_,parser){
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not(hidden_QMARK_);
if(and__6204__auto__){
var G__20814 = (parser.cljs$core$IFn$_invoke$arity$1 ? parser.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$tag) : parser.call(null,cljs.core.cst$kw$tag));
return (tag_set.cljs$core$IFn$_invoke$arity$1 ? tag_set.cljs$core$IFn$_invoke$arity$1(G__20814) : tag_set.call(null,G__20814));
} else {
return and__6204__auto__;
}
})())){
return [cljs.core.str("("),cljs.core.str((instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2(parser,false) : instaparse.print.combinators__GT_str.call(null,parser,false))),cljs.core.str(")")].join('');
} else {
return (instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2(parser,false) : instaparse.print.combinators__GT_str.call(null,parser,false));
}
});
instaparse.print.paren_for_compound = cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$cat,null,cljs.core.cst$kw$ord,null,cljs.core.cst$kw$alt,null], null), null));
/**
 * Replaces whitespace characters with escape sequences for better printing
 */
instaparse.print.regexp_replace = (function instaparse$print$regexp_replace(s){
var G__20816 = s;
switch (G__20816) {
case "\n":
return "\\n";

break;
case "\b":
return "\\b";

break;
case "\f":
return "\\f";

break;
case "\r":
return "\\r";

break;
case "\t":
return "\\t";

break;
default:
return s;

}
});
instaparse.print.regexp__GT_str = (function instaparse$print$regexp__GT_str(r){
return clojure.string.replace([cljs.core.str("#\""),cljs.core.str(cljs.core.subs.cljs$core$IFn$_invoke$arity$2(r.source,(1))),cljs.core.str("\"")].join(''),/[\s]/,instaparse.print.regexp_replace);
});
instaparse.print.number__GT_hex_padded = (function instaparse$print$number__GT_hex_padded(n){
if((n <= (4095))){
return [cljs.core.str("0000"),cljs.core.str(n.toString((16)))].join('').substr((-4));
} else {
return n.toString((16));
}
});
instaparse.print.char_range__GT_str = (function instaparse$print$char_range__GT_str(p__20818){
var map__20821 = p__20818;
var map__20821__$1 = ((((!((map__20821 == null)))?((((map__20821.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20821.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20821):map__20821);
var lo = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20821__$1,cljs.core.cst$kw$lo);
var hi = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20821__$1,cljs.core.cst$kw$hi);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(lo,hi)){
return [cljs.core.str("%x"),cljs.core.str(instaparse.print.number__GT_hex_padded(lo))].join('');
} else {
return [cljs.core.str("%x"),cljs.core.str(instaparse.print.number__GT_hex_padded(lo)),cljs.core.str("-"),cljs.core.str(instaparse.print.number__GT_hex_padded(hi))].join('');
}
});
/**
 * Stringifies a parser built from combinators
 */
instaparse.print.combinators__GT_str = (function instaparse$print$combinators__GT_str(var_args){
var args20823 = [];
var len__7291__auto___20834 = arguments.length;
var i__7292__auto___20835 = (0);
while(true){
if((i__7292__auto___20835 < len__7291__auto___20834)){
args20823.push((arguments[i__7292__auto___20835]));

var G__20836 = (i__7292__auto___20835 + (1));
i__7292__auto___20835 = G__20836;
continue;
} else {
}
break;
}

var G__20825 = args20823.length;
switch (G__20825) {
case 1:
return instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20823.length)].join('')));

}
});

instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1 = (function (p){
return instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2(p,false);
});

instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2 = (function (p__20826,hidden_QMARK_){
var map__20827 = p__20826;
var map__20827__$1 = ((((!((map__20827 == null)))?((((map__20827.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20827.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20827):map__20827);
var p = map__20827__$1;
var parser = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20827__$1,cljs.core.cst$kw$parser);
var parser1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20827__$1,cljs.core.cst$kw$parser1);
var parser2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20827__$1,cljs.core.cst$kw$parser2);
var parsers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20827__$1,cljs.core.cst$kw$parsers);
var tag = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20827__$1,cljs.core.cst$kw$tag);
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not(hidden_QMARK_);
if(and__6204__auto__){
return cljs.core.cst$kw$hide.cljs$core$IFn$_invoke$arity$1(p);
} else {
return and__6204__auto__;
}
})())){
return [cljs.core.str("<"),cljs.core.str(instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2(p,true)),cljs.core.str(">")].join('');
} else {
var G__20829 = (((tag instanceof cljs.core.Keyword))?tag.fqn:null);
switch (G__20829) {
case "neg":
return [cljs.core.str("!"),cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)))].join('');

break;
case "cat":
return clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$3(instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$ord,null,cljs.core.cst$kw$alt,null], null), null),hidden_QMARK_),parsers));

break;
case "ord":
return [cljs.core.str(instaparse.print.paren_for_tags(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$alt,null], null), null),hidden_QMARK_,parser1)),cljs.core.str(" / "),cljs.core.str(instaparse.print.paren_for_tags(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$alt,null], null), null),hidden_QMARK_,parser2))].join('');

break;
case "alt":
return clojure.string.join.cljs$core$IFn$_invoke$arity$2(" | ",cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$3(instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$ord,null], null), null),hidden_QMARK_),parsers));

break;
case "look":
return [cljs.core.str("&"),cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)))].join('');

break;
case "nt":
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2([cljs.core.str(cljs.core.cst$kw$keyword.cljs$core$IFn$_invoke$arity$1(p))].join(''),(1));

break;
case "rep":
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$min.cljs$core$IFn$_invoke$arity$1(p),cljs.core.cst$kw$max.cljs$core$IFn$_invoke$arity$1(p))){
return [cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))),cljs.core.str("{"),cljs.core.str(cljs.core.cst$kw$min.cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str(","),cljs.core.str(cljs.core.cst$kw$max.cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str("}")].join('');
} else {
return [cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))),cljs.core.str("{"),cljs.core.str(cljs.core.cst$kw$min.cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str("}")].join('');
}

break;
case "star":
return [cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))),cljs.core.str("*")].join('');

break;
case "string":
var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_20830_20839 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_20831_20840 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_20830_20839,_STAR_print_fn_STAR_20831_20840,sb__7202__auto__,G__20829,map__20827,map__20827__$1,p,parser,parser1,parser2,parsers,tag){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_20830_20839,_STAR_print_fn_STAR_20831_20840,sb__7202__auto__,G__20829,map__20827,map__20827__$1,p,parser,parser1,parser2,parsers,tag))
;

try{cljs.core.pr.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.cst$kw$string.cljs$core$IFn$_invoke$arity$1(p)], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_20831_20840;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_20830_20839;
}
return [cljs.core.str(sb__7202__auto__)].join('');

break;
case "regexp":
return instaparse.print.regexp__GT_str(cljs.core.cst$kw$regexp.cljs$core$IFn$_invoke$arity$1(p));

break;
case "plus":
return [cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))),cljs.core.str("+")].join('');

break;
case "epsilon":
return "\u03B5";

break;
case "string-ci":
var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_20832_20841 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_20833_20842 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_20832_20841,_STAR_print_fn_STAR_20833_20842,sb__7202__auto__,G__20829,map__20827,map__20827__$1,p,parser,parser1,parser2,parsers,tag){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_20832_20841,_STAR_print_fn_STAR_20833_20842,sb__7202__auto__,G__20829,map__20827,map__20827__$1,p,parser,parser1,parser2,parsers,tag))
;

try{cljs.core.pr.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.cst$kw$string.cljs$core$IFn$_invoke$arity$1(p)], 0));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_20833_20842;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_20832_20841;
}
return [cljs.core.str(sb__7202__auto__)].join('');

break;
case "char":
return instaparse.print.char_range__GT_str(p);

break;
case "opt":
return [cljs.core.str((instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2 ? instaparse.print.paren_for_compound.cljs$core$IFn$_invoke$arity$2(hidden_QMARK_,parser) : instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))),cljs.core.str("?")].join('');

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(tag)].join('')));

}
}
});

instaparse.print.combinators__GT_str.cljs$lang$maxFixedArity = 2;
/**
 * Takes a terminal symbol and a parser built from combinators,
 * and returns a string for the rule.
 */
instaparse.print.rule__GT_str = (function instaparse$print$rule__GT_str(terminal,parser){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$reduction_DASH_type.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$red.cljs$core$IFn$_invoke$arity$1(parser)),cljs.core.cst$kw$raw)){
return [cljs.core.str("<"),cljs.core.str(cljs.core.name(terminal)),cljs.core.str(">"),cljs.core.str(" = "),cljs.core.str(instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1(parser))].join('');
} else {
return [cljs.core.str(cljs.core.name(terminal)),cljs.core.str(" = "),cljs.core.str(instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1(parser))].join('');
}
});
/**
 * Takes a Parser object, i.e., something with a grammar map and a start 
 * production keyword, and stringifies it.
 */
instaparse.print.Parser__GT_str = (function instaparse$print$Parser__GT_str(p__20843){
var map__20856 = p__20843;
var map__20856__$1 = ((((!((map__20856 == null)))?((((map__20856.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20856.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20856):map__20856);
var grammar = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20856__$1,cljs.core.cst$kw$grammar);
var start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20856__$1,cljs.core.cst$kw$start_DASH_production);
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.cons(instaparse.print.rule__GT_str(start,(grammar.cljs$core$IFn$_invoke$arity$1 ? grammar.cljs$core$IFn$_invoke$arity$1(start) : grammar.call(null,start))),(function (){var iter__6996__auto__ = ((function (map__20856,map__20856__$1,grammar,start){
return (function instaparse$print$Parser__GT_str_$_iter__20858(s__20859){
return (new cljs.core.LazySeq(null,((function (map__20856,map__20856__$1,grammar,start){
return (function (){
var s__20859__$1 = s__20859;
while(true){
var temp__4657__auto__ = cljs.core.seq(s__20859__$1);
if(temp__4657__auto__){
var s__20859__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(s__20859__$2)){
var c__6994__auto__ = cljs.core.chunk_first(s__20859__$2);
var size__6995__auto__ = cljs.core.count(c__6994__auto__);
var b__20861 = cljs.core.chunk_buffer(size__6995__auto__);
if((function (){var i__20860 = (0);
while(true){
if((i__20860 < size__6995__auto__)){
var vec__20866 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(c__6994__auto__,i__20860);
var terminal = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20866,(0),null);
var parser = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20866,(1),null);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(terminal,start)){
cljs.core.chunk_append(b__20861,instaparse.print.rule__GT_str(terminal,parser));

var G__20868 = (i__20860 + (1));
i__20860 = G__20868;
continue;
} else {
var G__20869 = (i__20860 + (1));
i__20860 = G__20869;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__20861),instaparse$print$Parser__GT_str_$_iter__20858(cljs.core.chunk_rest(s__20859__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__20861),null);
}
} else {
var vec__20867 = cljs.core.first(s__20859__$2);
var terminal = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20867,(0),null);
var parser = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__20867,(1),null);
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(terminal,start)){
return cljs.core.cons(instaparse.print.rule__GT_str(terminal,parser),instaparse$print$Parser__GT_str_$_iter__20858(cljs.core.rest(s__20859__$2)));
} else {
var G__20870 = cljs.core.rest(s__20859__$2);
s__20859__$1 = G__20870;
continue;
}
}
} else {
return null;
}
break;
}
});})(map__20856,map__20856__$1,grammar,start))
,null,null));
});})(map__20856,map__20856__$1,grammar,start))
;
return iter__6996__auto__(grammar);
})()));
});
