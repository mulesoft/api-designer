// Compiled by ClojureScript 1.9.14 {}
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
if(cljs.core._EQ_.call(null,index,counter)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"line","line",212345235),line,new cljs.core.Keyword(null,"column","column",2078222095),col], null);
} else {
if(cljs.core._EQ_.call(null,"\n",cljs.core.get.call(null,text,counter))){
var G__16116 = (line + (1));
var G__16117 = (1);
var G__16118 = (counter + (1));
line = G__16116;
col = G__16117;
counter = G__16118;
continue;
} else {
var G__16119 = line;
var G__16120 = (col + (1));
var G__16121 = (counter + (1));
line = G__16119;
col = G__16120;
counter = G__16121;
continue;

}
}
break;
}
});
instaparse.failure.newline_chars_QMARK_ = (function instaparse$failure$newline_chars_QMARK_(c){
return cljs.core.boolean$.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["\n",null,"\r",null], null), null).call(null,c));
});
instaparse.failure.get_line = (function instaparse$failure$get_line(n,text){
var chars = cljs.core.seq.call(null,clojure.string.replace.call(null,text,"\r\n","\n"));
var n__$1 = n;
while(true){
if(cljs.core.empty_QMARK_.call(null,chars)){
return "";
} else {
if(cljs.core._EQ_.call(null,n__$1,(1))){
return cljs.core.apply.call(null,cljs.core.str,cljs.core.take_while.call(null,cljs.core.complement.call(null,instaparse.failure.newline_chars_QMARK_),chars));
} else {
if(cljs.core.truth_(instaparse.failure.newline_chars_QMARK_.call(null,cljs.core.first.call(null,chars)))){
var G__16122 = cljs.core.next.call(null,chars);
var G__16123 = (n__$1 - (1));
chars = G__16122;
n__$1 = G__16123;
continue;
} else {
var G__16124 = cljs.core.next.call(null,chars);
var G__16125 = n__$1;
chars = G__16124;
n__$1 = G__16125;
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
if(cljs.core.integer_QMARK_.call(null,n)){
if((n <= (1))){
return "^";
} else {
return cljs.core.apply.call(null,cljs.core.str,cljs.core.concat.call(null,cljs.core.repeat.call(null,(n - (1))," "),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["^"], null)));
}
} else {
return null;
}
});
/**
 * Adds text, line, and column info to failure object.
 */
instaparse.failure.augment_failure = (function instaparse$failure$augment_failure(failure,text){
var lc = instaparse.failure.index__GT_line_column.call(null,new cljs.core.Keyword(null,"index","index",-1531685915).cljs$core$IFn$_invoke$arity$1(failure),text);
return cljs.core.merge.call(null,failure,lc,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"text","text",-1790561697),instaparse.failure.get_line.call(null,new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(lc),text)], null));
});
/**
 * Provides special case for printing negative lookahead reasons
 */
instaparse.failure.print_reason = (function instaparse$failure$print_reason(r){
if(cljs.core.truth_(new cljs.core.Keyword(null,"NOT","NOT",-1689245341).cljs$core$IFn$_invoke$arity$1(r))){
cljs.core.print.call(null,"NOT ");

return cljs.core.print.call(null,new cljs.core.Keyword(null,"NOT","NOT",-1689245341).cljs$core$IFn$_invoke$arity$1(r));
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"char-range","char-range",1443391389).cljs$core$IFn$_invoke$arity$1(r))){
return cljs.core.print.call(null,instaparse.print.char_range__GT_str.call(null,r));
} else {
if((r instanceof RegExp)){
return cljs.core.print.call(null,instaparse.print.regexp__GT_str.call(null,r));
} else {
return cljs.core.pr.call(null,r);

}
}
}
});
/**
 * Takes an augmented failure object and prints the error message
 */
instaparse.failure.pprint_failure = (function instaparse$failure$pprint_failure(p__16126){
var map__16137 = p__16126;
var map__16137__$1 = ((((!((map__16137 == null)))?((((map__16137.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16137.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16137):map__16137);
var line = cljs.core.get.call(null,map__16137__$1,new cljs.core.Keyword(null,"line","line",212345235));
var column = cljs.core.get.call(null,map__16137__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var text = cljs.core.get.call(null,map__16137__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var reason = cljs.core.get.call(null,map__16137__$1,new cljs.core.Keyword(null,"reason","reason",-2070751759));
cljs.core.println.call(null,"Parse error at line",line,", column",column,":\n");

cljs.core.println.call(null,text);

cljs.core.println.call(null,instaparse.failure.marker.call(null,column));

var full_reasons = cljs.core.distinct.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"expecting","expecting",-57706705),cljs.core.filter.call(null,new cljs.core.Keyword(null,"full","full",436801220),reason)));
var partial_reasons = cljs.core.distinct.call(null,cljs.core.map.call(null,new cljs.core.Keyword(null,"expecting","expecting",-57706705),cljs.core.filter.call(null,cljs.core.complement.call(null,new cljs.core.Keyword(null,"full","full",436801220)),reason)));
var total = (cljs.core.count.call(null,full_reasons) + cljs.core.count.call(null,partial_reasons));
if((total === (0))){
} else {
if(cljs.core._EQ_.call(null,(1),total)){
cljs.core.println.call(null,"Expected:");
} else {
cljs.core.println.call(null,"Expected one of:");

}
}

var seq__16139_16147 = cljs.core.seq.call(null,full_reasons);
var chunk__16140_16148 = null;
var count__16141_16149 = (0);
var i__16142_16150 = (0);
while(true){
if((i__16142_16150 < count__16141_16149)){
var r_16151 = cljs.core._nth.call(null,chunk__16140_16148,i__16142_16150);
instaparse.failure.print_reason.call(null,r_16151);

cljs.core.println.call(null," (followed by end-of-string)");

var G__16152 = seq__16139_16147;
var G__16153 = chunk__16140_16148;
var G__16154 = count__16141_16149;
var G__16155 = (i__16142_16150 + (1));
seq__16139_16147 = G__16152;
chunk__16140_16148 = G__16153;
count__16141_16149 = G__16154;
i__16142_16150 = G__16155;
continue;
} else {
var temp__4657__auto___16156 = cljs.core.seq.call(null,seq__16139_16147);
if(temp__4657__auto___16156){
var seq__16139_16157__$1 = temp__4657__auto___16156;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__16139_16157__$1)){
var c__7027__auto___16158 = cljs.core.chunk_first.call(null,seq__16139_16157__$1);
var G__16159 = cljs.core.chunk_rest.call(null,seq__16139_16157__$1);
var G__16160 = c__7027__auto___16158;
var G__16161 = cljs.core.count.call(null,c__7027__auto___16158);
var G__16162 = (0);
seq__16139_16147 = G__16159;
chunk__16140_16148 = G__16160;
count__16141_16149 = G__16161;
i__16142_16150 = G__16162;
continue;
} else {
var r_16163 = cljs.core.first.call(null,seq__16139_16157__$1);
instaparse.failure.print_reason.call(null,r_16163);

cljs.core.println.call(null," (followed by end-of-string)");

var G__16164 = cljs.core.next.call(null,seq__16139_16157__$1);
var G__16165 = null;
var G__16166 = (0);
var G__16167 = (0);
seq__16139_16147 = G__16164;
chunk__16140_16148 = G__16165;
count__16141_16149 = G__16166;
i__16142_16150 = G__16167;
continue;
}
} else {
}
}
break;
}

var seq__16143 = cljs.core.seq.call(null,partial_reasons);
var chunk__16144 = null;
var count__16145 = (0);
var i__16146 = (0);
while(true){
if((i__16146 < count__16145)){
var r = cljs.core._nth.call(null,chunk__16144,i__16146);
instaparse.failure.print_reason.call(null,r);

cljs.core.println.call(null);

var G__16168 = seq__16143;
var G__16169 = chunk__16144;
var G__16170 = count__16145;
var G__16171 = (i__16146 + (1));
seq__16143 = G__16168;
chunk__16144 = G__16169;
count__16145 = G__16170;
i__16146 = G__16171;
continue;
} else {
var temp__4657__auto__ = cljs.core.seq.call(null,seq__16143);
if(temp__4657__auto__){
var seq__16143__$1 = temp__4657__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__16143__$1)){
var c__7027__auto__ = cljs.core.chunk_first.call(null,seq__16143__$1);
var G__16172 = cljs.core.chunk_rest.call(null,seq__16143__$1);
var G__16173 = c__7027__auto__;
var G__16174 = cljs.core.count.call(null,c__7027__auto__);
var G__16175 = (0);
seq__16143 = G__16172;
chunk__16144 = G__16173;
count__16145 = G__16174;
i__16146 = G__16175;
continue;
} else {
var r = cljs.core.first.call(null,seq__16143__$1);
instaparse.failure.print_reason.call(null,r);

cljs.core.println.call(null);

var G__16176 = cljs.core.next.call(null,seq__16143__$1);
var G__16177 = null;
var G__16178 = (0);
var G__16179 = (0);
seq__16143 = G__16176;
chunk__16144 = G__16177;
count__16145 = G__16178;
i__16146 = G__16179;
continue;
}
} else {
return null;
}
}
break;
}
});

//# sourceMappingURL=failure.js.map?rel=1480936805024