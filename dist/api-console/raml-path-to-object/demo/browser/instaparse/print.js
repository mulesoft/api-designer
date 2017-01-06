// Compiled by ClojureScript 1.9.14 {}
goog.provide('instaparse.print');
goog.require('cljs.core');
goog.require('clojure.string');
instaparse.print.paren_for_tags = (function instaparse$print$paren_for_tags(tag_set,hidden_QMARK_,parser){
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not.call(null,hidden_QMARK_);
if(and__6204__auto__){
return tag_set.call(null,parser.call(null,new cljs.core.Keyword(null,"tag","tag",-1290361223)));
} else {
return and__6204__auto__;
}
})())){
return [cljs.core.str("("),cljs.core.str(instaparse.print.combinators__GT_str.call(null,parser,false)),cljs.core.str(")")].join('');
} else {
return instaparse.print.combinators__GT_str.call(null,parser,false);
}
});
instaparse.print.paren_for_compound = cljs.core.partial.call(null,instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"cat","cat",-1457810207),null,new cljs.core.Keyword(null,"ord","ord",1142548323),null,new cljs.core.Keyword(null,"alt","alt",-3214426),null], null), null));
/**
 * Replaces whitespace characters with escape sequences for better printing
 */
instaparse.print.regexp_replace = (function instaparse$print$regexp_replace(s){
var G__16063 = s;
switch (G__16063) {
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
return clojure.string.replace.call(null,[cljs.core.str("#\""),cljs.core.str(cljs.core.subs.call(null,r.source,(1))),cljs.core.str("\"")].join(''),/[\s]/,instaparse.print.regexp_replace);
});
instaparse.print.number__GT_hex_padded = (function instaparse$print$number__GT_hex_padded(n){
if((n <= (4095))){
return [cljs.core.str("0000"),cljs.core.str(n.toString((16)))].join('').substr((-4));
} else {
return n.toString((16));
}
});
instaparse.print.char_range__GT_str = (function instaparse$print$char_range__GT_str(p__16065){
var map__16068 = p__16065;
var map__16068__$1 = ((((!((map__16068 == null)))?((((map__16068.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16068.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16068):map__16068);
var lo = cljs.core.get.call(null,map__16068__$1,new cljs.core.Keyword(null,"lo","lo",-931799889));
var hi = cljs.core.get.call(null,map__16068__$1,new cljs.core.Keyword(null,"hi","hi",-1821422114));
if(cljs.core._EQ_.call(null,lo,hi)){
return [cljs.core.str("%x"),cljs.core.str(instaparse.print.number__GT_hex_padded.call(null,lo))].join('');
} else {
return [cljs.core.str("%x"),cljs.core.str(instaparse.print.number__GT_hex_padded.call(null,lo)),cljs.core.str("-"),cljs.core.str(instaparse.print.number__GT_hex_padded.call(null,hi))].join('');
}
});
/**
 * Stringifies a parser built from combinators
 */
instaparse.print.combinators__GT_str = (function instaparse$print$combinators__GT_str(var_args){
var args16070 = [];
var len__7291__auto___16081 = arguments.length;
var i__7292__auto___16082 = (0);
while(true){
if((i__7292__auto___16082 < len__7291__auto___16081)){
args16070.push((arguments[i__7292__auto___16082]));

var G__16083 = (i__7292__auto___16082 + (1));
i__7292__auto___16082 = G__16083;
continue;
} else {
}
break;
}

var G__16072 = args16070.length;
switch (G__16072) {
case 1:
return instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args16070.length)].join('')));

}
});

instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$1 = (function (p){
return instaparse.print.combinators__GT_str.call(null,p,false);
});

instaparse.print.combinators__GT_str.cljs$core$IFn$_invoke$arity$2 = (function (p__16073,hidden_QMARK_){
var map__16074 = p__16073;
var map__16074__$1 = ((((!((map__16074 == null)))?((((map__16074.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16074.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16074):map__16074);
var p = map__16074__$1;
var parser = cljs.core.get.call(null,map__16074__$1,new cljs.core.Keyword(null,"parser","parser",-1543495310));
var parser1 = cljs.core.get.call(null,map__16074__$1,new cljs.core.Keyword(null,"parser1","parser1",-439601422));
var parser2 = cljs.core.get.call(null,map__16074__$1,new cljs.core.Keyword(null,"parser2","parser2",1013754688));
var parsers = cljs.core.get.call(null,map__16074__$1,new cljs.core.Keyword(null,"parsers","parsers",-804353827));
var tag = cljs.core.get.call(null,map__16074__$1,new cljs.core.Keyword(null,"tag","tag",-1290361223));
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.not.call(null,hidden_QMARK_);
if(and__6204__auto__){
return new cljs.core.Keyword(null,"hide","hide",-596913169).cljs$core$IFn$_invoke$arity$1(p);
} else {
return and__6204__auto__;
}
})())){
return [cljs.core.str("<"),cljs.core.str(instaparse.print.combinators__GT_str.call(null,p,true)),cljs.core.str(">")].join('');
} else {
var G__16076 = (((tag instanceof cljs.core.Keyword))?tag.fqn:null);
switch (G__16076) {
case "neg":
return [cljs.core.str("!"),cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))].join('');

break;
case "cat":
return clojure.string.join.call(null," ",cljs.core.map.call(null,cljs.core.partial.call(null,instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ord","ord",1142548323),null,new cljs.core.Keyword(null,"alt","alt",-3214426),null], null), null),hidden_QMARK_),parsers));

break;
case "ord":
return [cljs.core.str(instaparse.print.paren_for_tags.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"alt","alt",-3214426),null], null), null),hidden_QMARK_,parser1)),cljs.core.str(" / "),cljs.core.str(instaparse.print.paren_for_tags.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"alt","alt",-3214426),null], null), null),hidden_QMARK_,parser2))].join('');

break;
case "alt":
return clojure.string.join.call(null," | ",cljs.core.map.call(null,cljs.core.partial.call(null,instaparse.print.paren_for_tags,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ord","ord",1142548323),null], null), null),hidden_QMARK_),parsers));

break;
case "look":
return [cljs.core.str("&"),cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser))].join('');

break;
case "nt":
return cljs.core.subs.call(null,[cljs.core.str(new cljs.core.Keyword(null,"keyword","keyword",811389747).cljs$core$IFn$_invoke$arity$1(p))].join(''),(1));

break;
case "rep":
if(cljs.core.not_EQ_.call(null,new cljs.core.Keyword(null,"min","min",444991522).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"max","max",61366548).cljs$core$IFn$_invoke$arity$1(p))){
return [cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)),cljs.core.str("{"),cljs.core.str(new cljs.core.Keyword(null,"min","min",444991522).cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str(","),cljs.core.str(new cljs.core.Keyword(null,"max","max",61366548).cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str("}")].join('');
} else {
return [cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)),cljs.core.str("{"),cljs.core.str(new cljs.core.Keyword(null,"min","min",444991522).cljs$core$IFn$_invoke$arity$1(p)),cljs.core.str("}")].join('');
}

break;
case "star":
return [cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)),cljs.core.str("*")].join('');

break;
case "string":
var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_16077_16086 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_16078_16087 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_16077_16086,_STAR_print_fn_STAR_16078_16087,sb__7202__auto__,G__16076,map__16074,map__16074__$1,p,parser,parser1,parser2,parsers,tag){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_16077_16086,_STAR_print_fn_STAR_16078_16087,sb__7202__auto__,G__16076,map__16074,map__16074__$1,p,parser,parser1,parser2,parsers,tag))
;

try{cljs.core.pr.call(null,new cljs.core.Keyword(null,"string","string",-1989541586).cljs$core$IFn$_invoke$arity$1(p));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_16078_16087;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_16077_16086;
}
return [cljs.core.str(sb__7202__auto__)].join('');

break;
case "regexp":
return instaparse.print.regexp__GT_str.call(null,new cljs.core.Keyword(null,"regexp","regexp",-541372782).cljs$core$IFn$_invoke$arity$1(p));

break;
case "plus":
return [cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)),cljs.core.str("+")].join('');

break;
case "epsilon":
return "\u03B5";

break;
case "string-ci":
var sb__7202__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR_16079_16088 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR_16080_16089 = cljs.core._STAR_print_fn_STAR_;
cljs.core._STAR_print_newline_STAR_ = true;

cljs.core._STAR_print_fn_STAR_ = ((function (_STAR_print_newline_STAR_16079_16088,_STAR_print_fn_STAR_16080_16089,sb__7202__auto__,G__16076,map__16074,map__16074__$1,p,parser,parser1,parser2,parsers,tag){
return (function (x__7203__auto__){
return sb__7202__auto__.append(x__7203__auto__);
});})(_STAR_print_newline_STAR_16079_16088,_STAR_print_fn_STAR_16080_16089,sb__7202__auto__,G__16076,map__16074,map__16074__$1,p,parser,parser1,parser2,parsers,tag))
;

try{cljs.core.pr.call(null,new cljs.core.Keyword(null,"string","string",-1989541586).cljs$core$IFn$_invoke$arity$1(p));
}finally {cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR_16080_16089;

cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR_16079_16088;
}
return [cljs.core.str(sb__7202__auto__)].join('');

break;
case "char":
return instaparse.print.char_range__GT_str.call(null,p);

break;
case "opt":
return [cljs.core.str(instaparse.print.paren_for_compound.call(null,hidden_QMARK_,parser)),cljs.core.str("?")].join('');

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
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"reduction-type","reduction-type",-488293450).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"red","red",-969428204).cljs$core$IFn$_invoke$arity$1(parser)),new cljs.core.Keyword(null,"raw","raw",1604651272))){
return [cljs.core.str("<"),cljs.core.str(cljs.core.name.call(null,terminal)),cljs.core.str(">"),cljs.core.str(" = "),cljs.core.str(instaparse.print.combinators__GT_str.call(null,parser))].join('');
} else {
return [cljs.core.str(cljs.core.name.call(null,terminal)),cljs.core.str(" = "),cljs.core.str(instaparse.print.combinators__GT_str.call(null,parser))].join('');
}
});
/**
 * Takes a Parser object, i.e., something with a grammar map and a start 
 * production keyword, and stringifies it.
 */
instaparse.print.Parser__GT_str = (function instaparse$print$Parser__GT_str(p__16090){
var map__16101 = p__16090;
var map__16101__$1 = ((((!((map__16101 == null)))?((((map__16101.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16101.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16101):map__16101);
var grammar = cljs.core.get.call(null,map__16101__$1,new cljs.core.Keyword(null,"grammar","grammar",1881328267));
var start = cljs.core.get.call(null,map__16101__$1,new cljs.core.Keyword(null,"start-production","start-production",687546537));
return clojure.string.join.call(null,"\n",cljs.core.cons.call(null,instaparse.print.rule__GT_str.call(null,start,grammar.call(null,start)),(function (){var iter__6996__auto__ = ((function (map__16101,map__16101__$1,grammar,start){
return (function instaparse$print$Parser__GT_str_$_iter__16103(s__16104){
return (new cljs.core.LazySeq(null,((function (map__16101,map__16101__$1,grammar,start){
return (function (){
var s__16104__$1 = s__16104;
while(true){
var temp__4657__auto__ = cljs.core.seq.call(null,s__16104__$1);
if(temp__4657__auto__){
var s__16104__$2 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,s__16104__$2)){
var c__6994__auto__ = cljs.core.chunk_first.call(null,s__16104__$2);
var size__6995__auto__ = cljs.core.count.call(null,c__6994__auto__);
var b__16106 = cljs.core.chunk_buffer.call(null,size__6995__auto__);
if((function (){var i__16105 = (0);
while(true){
if((i__16105 < size__6995__auto__)){
var vec__16109 = cljs.core._nth.call(null,c__6994__auto__,i__16105);
var terminal = cljs.core.nth.call(null,vec__16109,(0),null);
var parser = cljs.core.nth.call(null,vec__16109,(1),null);
if(cljs.core.not_EQ_.call(null,terminal,start)){
cljs.core.chunk_append.call(null,b__16106,instaparse.print.rule__GT_str.call(null,terminal,parser));

var G__16111 = (i__16105 + (1));
i__16105 = G__16111;
continue;
} else {
var G__16112 = (i__16105 + (1));
i__16105 = G__16112;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__16106),instaparse$print$Parser__GT_str_$_iter__16103.call(null,cljs.core.chunk_rest.call(null,s__16104__$2)));
} else {
return cljs.core.chunk_cons.call(null,cljs.core.chunk.call(null,b__16106),null);
}
} else {
var vec__16110 = cljs.core.first.call(null,s__16104__$2);
var terminal = cljs.core.nth.call(null,vec__16110,(0),null);
var parser = cljs.core.nth.call(null,vec__16110,(1),null);
if(cljs.core.not_EQ_.call(null,terminal,start)){
return cljs.core.cons.call(null,instaparse.print.rule__GT_str.call(null,terminal,parser),instaparse$print$Parser__GT_str_$_iter__16103.call(null,cljs.core.rest.call(null,s__16104__$2)));
} else {
var G__16113 = cljs.core.rest.call(null,s__16104__$2);
s__16104__$1 = G__16113;
continue;
}
}
} else {
return null;
}
break;
}
});})(map__16101,map__16101__$1,grammar,start))
,null,null));
});})(map__16101,map__16101__$1,grammar,start))
;
return iter__6996__auto__.call(null,grammar);
})()));
});

//# sourceMappingURL=print.js.map?rel=1480936804972