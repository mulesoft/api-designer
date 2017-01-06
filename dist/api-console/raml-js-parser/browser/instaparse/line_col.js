// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.line_col');
goog.require('cljs.core');
goog.require('instaparse.transform');

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
instaparse.line_col.Cursor = (function (index,line,column,__meta,__extmap,__hash){
this.index = index;
this.line = line;
this.column = column;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2229667594;
this.cljs$lang$protocol_mask$partition1$ = 8192;
})
instaparse.line_col.Cursor.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__6838__auto__,k__6839__auto__){
var self__ = this;
var this__6838__auto____$1 = this;
return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this__6838__auto____$1,k__6839__auto__,null);
});

instaparse.line_col.Cursor.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__6840__auto__,k21280,else__6841__auto__){
var self__ = this;
var this__6840__auto____$1 = this;
var G__21282 = (((k21280 instanceof cljs.core.Keyword))?k21280.fqn:null);
switch (G__21282) {
case "index":
return self__.index;

break;
case "line":
return self__.line;

break;
case "column":
return self__.column;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k21280,else__6841__auto__);

}
});

instaparse.line_col.Cursor.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__6852__auto__,writer__6853__auto__,opts__6854__auto__){
var self__ = this;
var this__6852__auto____$1 = this;
var pr_pair__6855__auto__ = ((function (this__6852__auto____$1){
return (function (keyval__6856__auto__){
return cljs.core.pr_sequential_writer(writer__6853__auto__,cljs.core.pr_writer,""," ","",opts__6854__auto__,keyval__6856__auto__);
});})(this__6852__auto____$1))
;
return cljs.core.pr_sequential_writer(writer__6853__auto__,pr_pair__6855__auto__,"#instaparse.line-col.Cursor{",", ","}",opts__6854__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$index,self__.index],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$line,self__.line],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$column,self__.column],null))], null),self__.__extmap));
});

instaparse.line_col.Cursor.prototype.cljs$core$IIterable$ = true;

instaparse.line_col.Cursor.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__21279){
var self__ = this;
var G__21279__$1 = this;
return (new cljs.core.RecordIter((0),G__21279__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$index,cljs.core.cst$kw$line,cljs.core.cst$kw$column], null),cljs.core._iterator(self__.__extmap)));
});

instaparse.line_col.Cursor.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__6836__auto__){
var self__ = this;
var this__6836__auto____$1 = this;
return self__.__meta;
});

instaparse.line_col.Cursor.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__6832__auto__){
var self__ = this;
var this__6832__auto____$1 = this;
return (new instaparse.line_col.Cursor(self__.index,self__.line,self__.column,self__.__meta,self__.__extmap,self__.__hash));
});

instaparse.line_col.Cursor.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__6842__auto__){
var self__ = this;
var this__6842__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
});

instaparse.line_col.Cursor.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__6833__auto__){
var self__ = this;
var this__6833__auto____$1 = this;
var h__6651__auto__ = self__.__hash;
if(!((h__6651__auto__ == null))){
return h__6651__auto__;
} else {
var h__6651__auto____$1 = cljs.core.hash_imap(this__6833__auto____$1);
self__.__hash = h__6651__auto____$1;

return h__6651__auto____$1;
}
});

instaparse.line_col.Cursor.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this__6834__auto__,other__6835__auto__){
var self__ = this;
var this__6834__auto____$1 = this;
if(cljs.core.truth_((function (){var and__6204__auto__ = other__6835__auto__;
if(cljs.core.truth_(and__6204__auto__)){
var and__6204__auto____$1 = (this__6834__auto____$1.constructor === other__6835__auto__.constructor);
if(and__6204__auto____$1){
return cljs.core.equiv_map(this__6834__auto____$1,other__6835__auto__);
} else {
return and__6204__auto____$1;
}
} else {
return and__6204__auto__;
}
})())){
return true;
} else {
return false;
}
});

instaparse.line_col.Cursor.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__6847__auto__,k__6848__auto__){
var self__ = this;
var this__6847__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$index,null,cljs.core.cst$kw$column,null,cljs.core.cst$kw$line,null], null), null),k__6848__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__6847__auto____$1),self__.__meta),k__6848__auto__);
} else {
return (new instaparse.line_col.Cursor(self__.index,self__.line,self__.column,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__6848__auto__)),null));
}
});

instaparse.line_col.Cursor.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__6845__auto__,k__6846__auto__,G__21279){
var self__ = this;
var this__6845__auto____$1 = this;
var pred__21283 = cljs.core.keyword_identical_QMARK_;
var expr__21284 = k__6846__auto__;
if(cljs.core.truth_((pred__21283.cljs$core$IFn$_invoke$arity$2 ? pred__21283.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$index,expr__21284) : pred__21283.call(null,cljs.core.cst$kw$index,expr__21284)))){
return (new instaparse.line_col.Cursor(G__21279,self__.line,self__.column,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21283.cljs$core$IFn$_invoke$arity$2 ? pred__21283.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$line,expr__21284) : pred__21283.call(null,cljs.core.cst$kw$line,expr__21284)))){
return (new instaparse.line_col.Cursor(self__.index,G__21279,self__.column,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21283.cljs$core$IFn$_invoke$arity$2 ? pred__21283.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$column,expr__21284) : pred__21283.call(null,cljs.core.cst$kw$column,expr__21284)))){
return (new instaparse.line_col.Cursor(self__.index,self__.line,G__21279,self__.__meta,self__.__extmap,null));
} else {
return (new instaparse.line_col.Cursor(self__.index,self__.line,self__.column,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__6846__auto__,G__21279),null));
}
}
}
});

instaparse.line_col.Cursor.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__6850__auto__){
var self__ = this;
var this__6850__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$index,self__.index],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$line,self__.line],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$column,self__.column],null))], null),self__.__extmap));
});

instaparse.line_col.Cursor.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__6837__auto__,G__21279){
var self__ = this;
var this__6837__auto____$1 = this;
return (new instaparse.line_col.Cursor(self__.index,self__.line,self__.column,G__21279,self__.__extmap,self__.__hash));
});

instaparse.line_col.Cursor.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__6843__auto__,entry__6844__auto__){
var self__ = this;
var this__6843__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__6844__auto__)){
return cljs.core._assoc(this__6843__auto____$1,cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__6844__auto__,(0)),cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__6844__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__6843__auto____$1,entry__6844__auto__);
}
});

instaparse.line_col.Cursor.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$index,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$int], null)),cljs.core.with_meta(cljs.core.cst$sym$line,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$long], null)),cljs.core.with_meta(cljs.core.cst$sym$column,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$long], null))], null);
});

instaparse.line_col.Cursor.cljs$lang$type = true;

instaparse.line_col.Cursor.cljs$lang$ctorPrSeq = (function (this__6872__auto__){
return cljs.core._conj(cljs.core.List.EMPTY,"instaparse.line-col/Cursor");
});

instaparse.line_col.Cursor.cljs$lang$ctorPrWriter = (function (this__6872__auto__,writer__6873__auto__){
return cljs.core._write(writer__6873__auto__,"instaparse.line-col/Cursor");
});

instaparse.line_col.__GT_Cursor = (function instaparse$line_col$__GT_Cursor(index,line,column){
return (new instaparse.line_col.Cursor(index,line,column,null,null,null));
});

instaparse.line_col.map__GT_Cursor = (function instaparse$line_col$map__GT_Cursor(G__21281){
return (new instaparse.line_col.Cursor(cljs.core.cst$kw$index.cljs$core$IFn$_invoke$arity$1(G__21281),cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(G__21281),cljs.core.cst$kw$column.cljs$core$IFn$_invoke$arity$1(G__21281),null,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__21281,cljs.core.cst$kw$index,cljs.core.array_seq([cljs.core.cst$kw$line,cljs.core.cst$kw$column], 0)),null));
});

instaparse.line_col.advance_cursor = (function instaparse$line_col$advance_cursor(cursor,text,new_index){
var new_index__$1 = (new_index | (0));
if((cursor.index <= new_index__$1)){
} else {
throw (new Error("Assert failed: (<= (.-index cursor) new-index)"));
}

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cursor.index,new_index__$1)){
return cursor;
} else {
var index = cursor.index;
var line = cursor.line;
var column = cursor.column;
while(true){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(index,new_index__$1)){
return (new instaparse.line_col.Cursor(index,line,column,null,null,null));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(text.charAt(index),"\n")){
var G__21287 = (index + (1));
var G__21288 = (line + (1));
var G__21289 = (1);
index = G__21287;
line = G__21288;
column = G__21289;
continue;
} else {
var G__21290 = (index + (1));
var G__21291 = line;
var G__21292 = (column + (1));
index = G__21290;
line = G__21291;
column = G__21292;
continue;

}
}
break;
}
}
});
/**
 * Given a string `text`, returns a function that takes an index into the string,
 * and returns a cursor, including line and column information.  For efficiency,
 * inputs must be fed into the function in increasing order.
 */
instaparse.line_col.make_line_col_fn = (function instaparse$line_col$make_line_col_fn(text){
var cursor_state = (function (){var G__21294 = (new instaparse.line_col.Cursor((0),(1),(1),null,null,null));
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__21294) : cljs.core.atom.call(null,G__21294));
})();
return ((function (cursor_state){
return (function instaparse$line_col$make_line_col_fn_$_line_col(i){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(cursor_state,instaparse.line_col.advance_cursor,text,i);

return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(cursor_state) : cljs.core.deref.call(null,cursor_state));
});
;})(cursor_state))
});
instaparse.line_col.hiccup_add_line_col_spans = (function instaparse$line_col$hiccup_add_line_col_spans(line_col_fn,parse_tree){
var m = cljs.core.meta(parse_tree);
var start_index = cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index.cljs$core$IFn$_invoke$arity$1(m);
var end_index = cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index.cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var and__6204__auto__ = start_index;
if(cljs.core.truth_(and__6204__auto__)){
return end_index;
} else {
return and__6204__auto__;
}
})())){
var start_cursor = (line_col_fn.cljs$core$IFn$_invoke$arity$1 ? line_col_fn.cljs$core$IFn$_invoke$arity$1(start_index) : line_col_fn.call(null,start_index));
var children = cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$line_col$hiccup_add_line_col_spans,line_col_fn),cljs.core.next(parse_tree)));
var end_cursor = (line_col_fn.cljs$core$IFn$_invoke$arity$1 ? line_col_fn.cljs$core$IFn$_invoke$arity$1(end_index) : line_col_fn.call(null,end_index));
return cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(parse_tree)], null),children),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.meta(parse_tree),new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_line,cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(start_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_column,cljs.core.cst$kw$column.cljs$core$IFn$_invoke$arity$1(start_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_line,cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(end_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_column,cljs.core.cst$kw$column.cljs$core$IFn$_invoke$arity$1(end_cursor)], null)], 0)));
} else {
return parse_tree;
}
});
instaparse.line_col.enlive_add_line_col_spans = (function instaparse$line_col$enlive_add_line_col_spans(line_col_fn,parse_tree){
var m = cljs.core.meta(parse_tree);
var start_index = cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_index.cljs$core$IFn$_invoke$arity$1(m);
var end_index = cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_index.cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var and__6204__auto__ = start_index;
if(cljs.core.truth_(and__6204__auto__)){
return end_index;
} else {
return and__6204__auto__;
}
})())){
var start_cursor = (line_col_fn.cljs$core$IFn$_invoke$arity$1 ? line_col_fn.cljs$core$IFn$_invoke$arity$1(start_index) : line_col_fn.call(null,start_index));
var children = cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse$line_col$enlive_add_line_col_spans,line_col_fn),cljs.core.cst$kw$content.cljs$core$IFn$_invoke$arity$1(parse_tree)));
var end_cursor = (line_col_fn.cljs$core$IFn$_invoke$arity$1 ? line_col_fn.cljs$core$IFn$_invoke$arity$1(end_index) : line_col_fn.call(null,end_index));
return cljs.core.with_meta(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parse_tree,cljs.core.cst$kw$content,children),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.meta(parse_tree),new cljs.core.PersistentArrayMap(null, 4, [cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_line,cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(start_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_start_DASH_column,cljs.core.cst$kw$column.cljs$core$IFn$_invoke$arity$1(start_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_line,cljs.core.cst$kw$line.cljs$core$IFn$_invoke$arity$1(end_cursor),cljs.core.cst$kw$instaparse$gll_SLASH_end_DASH_column,cljs.core.cst$kw$column.cljs$core$IFn$_invoke$arity$1(end_cursor)], null)], 0)));
} else {
return parse_tree;
}
});
/**
 * Given a string `text` and a `parse-tree` for text, return parse tree
 * with its metadata annotated with line and column info. The info can
 * then be found in the metadata map under the keywords:
 *  
 * :instaparse.gll/start-line, :instaparse.gll/start-column,
 * :instaparse.gll/end-line, :instaparse.gll/end-column
 * 
 * The start is inclusive, the end is exclusive. Lines and columns are 1-based.
 */
instaparse.line_col.add_line_col_spans = (function instaparse$line_col$add_line_col_spans(text,parse_tree){
var line_col_fn = instaparse.line_col.make_line_col_fn(text);
if((parse_tree == null)){
return null;
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.map_QMARK_(parse_tree);
if(and__6204__auto__){
return cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(parse_tree);
} else {
return and__6204__auto__;
}
})())){
return instaparse.line_col.enlive_add_line_col_spans(line_col_fn,parse_tree);
} else {
if((cljs.core.vector_QMARK_(parse_tree)) && ((cljs.core.first(parse_tree) instanceof cljs.core.Keyword))){
return instaparse.line_col.hiccup_add_line_col_spans(line_col_fn,parse_tree);
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = cljs.core.sequential_QMARK_(parse_tree);
if(and__6204__auto__){
var and__6204__auto____$1 = cljs.core.map_QMARK_(cljs.core.first(parse_tree));
if(and__6204__auto____$1){
return cljs.core.cst$kw$tag.cljs$core$IFn$_invoke$arity$1(cljs.core.first(parse_tree));
} else {
return and__6204__auto____$1;
}
} else {
return and__6204__auto__;
}
})())){
return instaparse.transform.map_preserving_meta(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse.line_col.enlive_add_line_col_spans,line_col_fn),parse_tree);
} else {
if((cljs.core.sequential_QMARK_(parse_tree)) && (cljs.core.vector_QMARK_(cljs.core.first(parse_tree))) && ((cljs.core.first(cljs.core.first(parse_tree)) instanceof cljs.core.Keyword))){
return instaparse.transform.map_preserving_meta(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(instaparse.line_col.hiccup_add_line_col_spans,line_col_fn),parse_tree);
} else {
if((parse_tree instanceof instaparse.gll.Failure)){
return parse_tree;
} else {
throw "Invalid parse-tree, not recognized as either enlive or hiccup format.";

}
}
}
}
}
}
});
