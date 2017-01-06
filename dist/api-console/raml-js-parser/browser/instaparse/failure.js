// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.failure');
goog.require('cljs.core');
goog.require('instaparse.print');
/**
 * Takes an index into text, and determines the line and column info
 */
instaparse.failure.index__GT_line_column = (function instaparse$failure$index__GT_line_column(index,text){
var line = (1);
var col = (1);
var counter = (0);
while(true){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(index,counter)){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$line,line,cljs.core.cst$kw$column,col], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.get.cljs$core$IFn$_invoke$arity$2(text,counter))){
var G__20873 = (line + (1));
var G__20874 = (1);
var G__20875 = (counter + (1));
line = G__20873;
col = G__20874;
counter = G__20875;
continue;
} else {
var G__20876 = line;
var G__20877 = (col + (1));
var G__20878 = (counter + (1));
line = G__20876;
col = G__20877;
counter = G__20878;
continue;

}
}
break;
}
});
instaparse.failure.newline_chars_QMARK_ = (function instaparse$failure$newline_chars_QMARK_(c){
return cljs.core.boolean$(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\n",null,"\r",null], null), null).call(null,c));
});
instaparse.failure.get_line = (function instaparse$failure$get_line(n,text){
var chars = cljs.core.seq(clojure.string.replace(text,"\r\n","\n"));
var n__$1 = n;
while(true){
if(cljs.core.empty_QMARK_(chars)){
return "";
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n__$1,(1))){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.take_while.cljs$core$IFn$_invoke$arity$2(cljs.core.complement(instaparse.failure.newline_chars_QMARK_),chars));
} else {
if(cljs.core.truth_(instaparse.failure.newline_chars_QMARK_(cljs.core.first(chars)))){
var G__20879 = cljs.core.next(chars);
var G__20880 = (n__$1 - (1));
chars = G__20879;
n__$1 = G__20880;
continue;
} else {
var G__20881 = cljs.core.next(chars);
var G__20882 = n__$1;
chars = G__20881;
n__$1 = G__20882;
continue;

}
}
}
break;
}
});
/**
 * Creates string with caret at nth position, 1-based
 */
instaparse.failure.marker = (function instaparse$failure$marker(n){
if(cljs.core.integer_QMARK_(n)){
if((n <= (1))){
return "^";
} else {
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.repeat.cljs$core$IFn$_invoke$arity$2((n - (1))," "),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["^"], null)));
}
} else {
return null;
}
});
/**
 * Adds text, line, and column info to failure object.
 */
instaparse.failure.augment_failure = (function instaparse$failure$augment_failure(failure,text){
var lc = instaparse.failure.index__GT_line_column(cljs.core.cst$kw$index.cljs$core$IFn$_invoke$arity$1(failure),text);
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([failure,lc,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$text,instaparse.failure.get_line(cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(lc),text)], null)], 0));
});
/**
 * Provides special case for printing negative lookahead reasons
 */
instaparse.failure.print_reason = (function instaparse$failure$print_reason(r){
if(cljs.core.truth_(cljs.core.cst$kw$NOT.cljs$core$IFn$_invoke$arity$1(r))){
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["NOT "], 0));

return cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.cst$kw$NOT.cljs$core$IFn$_invoke$arity$1(r)], 0));
} else {
if(cljs.core.truth_(cljs.core.cst$kw$char_DASH_range.cljs$core$IFn$_invoke$arity$1(r))){
return cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.print.char_range__GT_str(r)], 0));
} else {
if((r instanceof RegExp)){
return cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.print.regexp__GT_str(r)], 0));
} else {
return cljs.core.pr.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([r], 0));

}
}
}
});
/**
 * Takes an augmented failure object and prints the error message
 */
instaparse.failure.pprint_failure = (function instaparse$failure$pprint_failure(p__20883){
var map__20894 = p__20883;
var map__20894__$1 = ((((!((map__20894 == null)))?((((map__20894.cljs$lang$protocol_mask$partition0$ & (64))) || (map__20894.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__20894):map__20894);
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20894__$1,cljs.core.cst$kw$line);
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20894__$1,cljs.core.cst$kw$column);
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20894__$1,cljs.core.cst$kw$text);
var reason = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__20894__$1,cljs.core.cst$kw$reason);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["Parse error at line",line,", column",column,":\n"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([text], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([instaparse.failure.marker(column)], 0));

var full_reasons = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$expecting,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$full,reason)));
var partial_reasons = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$expecting,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.complement(cljs.core.cst$kw$full),reason)));
var total = (cljs.core.count(full_reasons) + cljs.core.count(partial_reasons));
if((total === (0))){
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),total)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["Expected:"], 0));
} else {
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["Expected one of:"], 0));

}
}

var seq__20896_20904 = cljs.core.seq(full_reasons);
var chunk__20897_20905 = null;
var count__20898_20906 = (0);
var i__20899_20907 = (0);
while(true){
if((i__20899_20907 < count__20898_20906)){
var r_20908 = chunk__20897_20905.cljs$core$IIndexed$_nth$arity$2(null,i__20899_20907);
instaparse.failure.print_reason(r_20908);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([" (followed by end-of-string)"], 0));

var G__20909 = seq__20896_20904;
var G__20910 = chunk__20897_20905;
var G__20911 = count__20898_20906;
var G__20912 = (i__20899_20907 + (1));
seq__20896_20904 = G__20909;
chunk__20897_20905 = G__20910;
count__20898_20906 = G__20911;
i__20899_20907 = G__20912;
continue;
} else {
var temp__4657__auto___20913 = cljs.core.seq(seq__20896_20904);
if(temp__4657__auto___20913){
var seq__20896_20914__$1 = temp__4657__auto___20913;
if(cljs.core.chunked_seq_QMARK_(seq__20896_20914__$1)){
var c__7027__auto___20915 = cljs.core.chunk_first(seq__20896_20914__$1);
var G__20916 = cljs.core.chunk_rest(seq__20896_20914__$1);
var G__20917 = c__7027__auto___20915;
var G__20918 = cljs.core.count(c__7027__auto___20915);
var G__20919 = (0);
seq__20896_20904 = G__20916;
chunk__20897_20905 = G__20917;
count__20898_20906 = G__20918;
i__20899_20907 = G__20919;
continue;
} else {
var r_20920 = cljs.core.first(seq__20896_20914__$1);
instaparse.failure.print_reason(r_20920);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([" (followed by end-of-string)"], 0));

var G__20921 = cljs.core.next(seq__20896_20914__$1);
var G__20922 = null;
var G__20923 = (0);
var G__20924 = (0);
seq__20896_20904 = G__20921;
chunk__20897_20905 = G__20922;
count__20898_20906 = G__20923;
i__20899_20907 = G__20924;
continue;
}
} else {
}
}
break;
}

var seq__20900 = cljs.core.seq(partial_reasons);
var chunk__20901 = null;
var count__20902 = (0);
var i__20903 = (0);
while(true){
if((i__20903 < count__20902)){
var r = chunk__20901.cljs$core$IIndexed$_nth$arity$2(null,i__20903);
instaparse.failure.print_reason(r);

cljs.core.println();

var G__20925 = seq__20900;
var G__20926 = chunk__20901;
var G__20927 = count__20902;
var G__20928 = (i__20903 + (1));
seq__20900 = G__20925;
chunk__20901 = G__20926;
count__20902 = G__20927;
i__20903 = G__20928;
continue;
} else {
var temp__4657__auto__ = cljs.core.seq(seq__20900);
if(temp__4657__auto__){
var seq__20900__$1 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__20900__$1)){
var c__7027__auto__ = cljs.core.chunk_first(seq__20900__$1);
var G__20929 = cljs.core.chunk_rest(seq__20900__$1);
var G__20930 = c__7027__auto__;
var G__20931 = cljs.core.count(c__7027__auto__);
var G__20932 = (0);
seq__20900 = G__20929;
chunk__20901 = G__20930;
count__20902 = G__20931;
i__20903 = G__20932;
continue;
} else {
var r = cljs.core.first(seq__20900__$1);
instaparse.failure.print_reason(r);

cljs.core.println();

var G__20933 = cljs.core.next(seq__20900__$1);
var G__20934 = null;
var G__20935 = (0);
var G__20936 = (0);
seq__20900 = G__20933;
chunk__20901 = G__20934;
count__20902 = G__20935;
i__20903 = G__20936;
continue;
}
} else {
return null;
}
}
break;
}
});
