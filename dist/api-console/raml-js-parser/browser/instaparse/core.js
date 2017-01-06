// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.core');
goog.require('cljs.core');
goog.require('instaparse.transform');
goog.require('instaparse.combinators_source');
goog.require('instaparse.abnf');
goog.require('instaparse.gll');
goog.require('instaparse.line_col');
goog.require('instaparse.print');
goog.require('instaparse.cfg');
goog.require('instaparse.reduction');
goog.require('instaparse.failure');
goog.require('instaparse.repeat');
instaparse.core._STAR_default_output_format_STAR_ = cljs.core.cst$kw$hiccup;
/**
 * Changes the default output format.  Input should be :hiccup or :enlive
 */
instaparse.core.set_default_output_format_BANG_ = (function instaparse$core$set_default_output_format_BANG_(type){
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$hiccup,null,cljs.core.cst$kw$enlive,null], null), null).call(null,type))){
} else {
throw (new Error("Assert failed: (#{:hiccup :enlive} type)"));
}

return instaparse.core._STAR_default_output_format_STAR_ = type;
});
instaparse.core._STAR_default_input_format_STAR_ = cljs.core.cst$kw$ebnf;
/**
 * Changes the default input format.  Input should be :abnf or :ebnf
 */
instaparse.core.set_default_input_format_BANG_ = (function instaparse$core$set_default_input_format_BANG_(type){
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$ebnf,null,cljs.core.cst$kw$abnf,null], null), null).call(null,type))){
} else {
throw (new Error("Assert failed: (#{:ebnf :abnf} type)"));
}

return instaparse.core._STAR_default_input_format_STAR_ = type;
});

instaparse.core.unhide_parser = (function instaparse$core$unhide_parser(parser,unhide){
var G__21668 = unhide;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(null,G__21668)){
return parser;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$content,G__21668)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parser,cljs.core.cst$kw$grammar,instaparse.combinators_source.unhide_all_content(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser)));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$tags,G__21668)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parser,cljs.core.cst$kw$grammar,instaparse.combinators_source.unhide_tags(cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(parser),cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser)));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$all,G__21668)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parser,cljs.core.cst$kw$grammar,instaparse.combinators_source.unhide_all(cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(parser),cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser)));
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(unhide)].join('')));

}
}
}
}
});
/**
 * Use parser to parse the text.  Returns first parse tree found
 * that completely parses the text.  If no parse tree is possible, returns
 * a Failure object.
 * 
 * Optional keyword arguments:
 * :start :keyword  (where :keyword is name of starting production rule)
 * :partial true    (parses that don't consume the whole string are okay)
 * :total true      (if parse fails, embed failure node in tree)
 * :unhide <:tags or :content or :all> (for this parse, disable hiding)
 * :optimize :memory   (when possible, employ strategy to use less memory)
 */
instaparse.core.parse = (function instaparse$core$parse(var_args){
var args__7298__auto__ = [];
var len__7291__auto___21676 = arguments.length;
var i__7292__auto___21677 = (0);
while(true){
if((i__7292__auto___21677 < len__7291__auto___21676)){
args__7298__auto__.push((arguments[i__7292__auto___21677]));

var G__21678 = (i__7292__auto___21677 + (1));
i__7292__auto___21677 = G__21678;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((2) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((2)),(0),null)):null);
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7299__auto__);
});

instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic = (function (parser,text,p__21672){
var map__21673 = p__21672;
var map__21673__$1 = ((((!((map__21673 == null)))?((((map__21673.cljs$lang$protocol_mask$partition0$ & (64))) || (map__21673.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__21673):map__21673);
var options = map__21673__$1;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [null,null,cljs.core.cst$kw$tags,null,cljs.core.cst$kw$content,null,cljs.core.cst$kw$all,null], null), null),cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$unhide))){
} else {
throw (new Error("Assert failed: (contains? #{nil :tags :content :all} (get options :unhide))"));
}

if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [null,null,cljs.core.cst$kw$memory,null], null), null),cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$optimize))){
} else {
throw (new Error("Assert failed: (contains? #{nil :memory} (get options :optimize))"));
}

var start_production = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$start,cljs.core.cst$kw$start_DASH_production.cljs$core$IFn$_invoke$arity$1(parser));
var partial_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$partial,false);
var optimize_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$optimize,false);
var unhide = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$unhide);
var parser__$1 = instaparse.core.unhide_parser(parser,unhide);
if(cljs.core.truth_(cljs.core.cst$kw$total.cljs$core$IFn$_invoke$arity$1(options))){
return instaparse.gll.parse_total(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_,(function (){var G__21675 = cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(parser__$1);
return (instaparse.reduction.node_builders.cljs$core$IFn$_invoke$arity$1 ? instaparse.reduction.node_builders.cljs$core$IFn$_invoke$arity$1(G__21675) : instaparse.reduction.node_builders.call(null,G__21675));
})());
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = optimize_QMARK_;
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not(partial_QMARK_);
} else {
return and__6204__auto__;
}
})())){
var result = instaparse.repeat.try_repeating_parse_strategy(parser__$1,text,start_production);
if(cljs.core.truth_((instaparse.core.failure_QMARK_.cljs$core$IFn$_invoke$arity$1 ? instaparse.core.failure_QMARK_.cljs$core$IFn$_invoke$arity$1(result) : instaparse.core.failure_QMARK_.call(null,result)))){
return instaparse.gll.parse(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);
} else {
return result;
}
} else {
return instaparse.gll.parse(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);

}
}
});

instaparse.core.parse.cljs$lang$maxFixedArity = (2);

instaparse.core.parse.cljs$lang$applyTo = (function (seq21669){
var G__21670 = cljs.core.first(seq21669);
var seq21669__$1 = cljs.core.next(seq21669);
var G__21671 = cljs.core.first(seq21669__$1);
var seq21669__$2 = cljs.core.next(seq21669__$1);
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(G__21670,G__21671,seq21669__$2);
});
/**
 * Use parser to parse the text.  Returns lazy seq of all parse trees
 * that completely parse the text.  If no parse tree is possible, returns
 * () with a Failure object attached as metadata.
 * 
 * Optional keyword arguments:
 * :start :keyword  (where :keyword is name of starting production rule)
 * :partial true    (parses that don't consume the whole string are okay)
 * :total true      (if parse fails, embed failure node in tree)
 * :unhide <:tags or :content or :all> (for this parse, disable hiding)
 */
instaparse.core.parses = (function instaparse$core$parses(var_args){
var args__7298__auto__ = [];
var len__7291__auto___21686 = arguments.length;
var i__7292__auto___21687 = (0);
while(true){
if((i__7292__auto___21687 < len__7291__auto___21686)){
args__7298__auto__.push((arguments[i__7292__auto___21687]));

var G__21688 = (i__7292__auto___21687 + (1));
i__7292__auto___21687 = G__21688;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((2) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((2)),(0),null)):null);
return instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7299__auto__);
});

instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic = (function (parser,text,p__21682){
var map__21683 = p__21682;
var map__21683__$1 = ((((!((map__21683 == null)))?((((map__21683.cljs$lang$protocol_mask$partition0$ & (64))) || (map__21683.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__21683):map__21683);
var options = map__21683__$1;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [null,null,cljs.core.cst$kw$tags,null,cljs.core.cst$kw$content,null,cljs.core.cst$kw$all,null], null), null),cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$unhide))){
} else {
throw (new Error("Assert failed: (contains? #{nil :tags :content :all} (get options :unhide))"));
}

var start_production = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$start,cljs.core.cst$kw$start_DASH_production.cljs$core$IFn$_invoke$arity$1(parser));
var partial_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$partial,false);
var unhide = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$unhide);
var parser__$1 = instaparse.core.unhide_parser(parser,unhide);
if(cljs.core.truth_(cljs.core.cst$kw$total.cljs$core$IFn$_invoke$arity$1(options))){
return instaparse.gll.parses_total(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_,(function (){var G__21685 = cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(parser__$1);
return (instaparse.reduction.node_builders.cljs$core$IFn$_invoke$arity$1 ? instaparse.reduction.node_builders.cljs$core$IFn$_invoke$arity$1(G__21685) : instaparse.reduction.node_builders.call(null,G__21685));
})());
} else {
return instaparse.gll.parses(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);

}
});

instaparse.core.parses.cljs$lang$maxFixedArity = (2);

instaparse.core.parses.cljs$lang$applyTo = (function (seq21679){
var G__21680 = cljs.core.first(seq21679);
var seq21679__$1 = cljs.core.next(seq21679);
var G__21681 = cljs.core.first(seq21679__$1);
var seq21679__$2 = cljs.core.next(seq21679__$1);
return instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic(G__21680,G__21681,seq21679__$2);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
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
instaparse.core.Parser = (function (grammar,start_production,output_format,__meta,__extmap,__hash){
this.grammar = grammar;
this.start_production = start_production;
this.output_format = output_format;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2229667595;
this.cljs$lang$protocol_mask$partition1$ = 8192;
})
instaparse.core.Parser.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__6838__auto__,k__6839__auto__){
var self__ = this;
var this__6838__auto____$1 = this;
return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this__6838__auto____$1,k__6839__auto__,null);
});

instaparse.core.Parser.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__6840__auto__,k21690,else__6841__auto__){
var self__ = this;
var this__6840__auto____$1 = this;
var G__21693 = (((k21690 instanceof cljs.core.Keyword))?k21690.fqn:null);
switch (G__21693) {
case "grammar":
return self__.grammar;

break;
case "start-production":
return self__.start_production;

break;
case "output-format":
return self__.output_format;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k21690,else__6841__auto__);

}
});

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__6852__auto__,writer__6853__auto__,opts__6854__auto__){
var self__ = this;
var this__6852__auto____$1 = this;
var pr_pair__6855__auto__ = ((function (this__6852__auto____$1){
return (function (keyval__6856__auto__){
return cljs.core.pr_sequential_writer(writer__6853__auto__,cljs.core.pr_writer,""," ","",opts__6854__auto__,keyval__6856__auto__);
});})(this__6852__auto____$1))
;
return cljs.core.pr_sequential_writer(writer__6853__auto__,pr_pair__6855__auto__,"#instaparse.core.Parser{",", ","}",opts__6854__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$grammar,self__.grammar],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$start_DASH_production,self__.start_production],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$output_DASH_format,self__.output_format],null))], null),self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IIterable$ = true;

instaparse.core.Parser.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__21689){
var self__ = this;
var G__21689__$1 = this;
return (new cljs.core.RecordIter((0),G__21689__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$grammar,cljs.core.cst$kw$start_DASH_production,cljs.core.cst$kw$output_DASH_format], null),cljs.core._iterator(self__.__extmap)));
});

instaparse.core.Parser.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__6836__auto__){
var self__ = this;
var this__6836__auto____$1 = this;
return self__.__meta;
});

instaparse.core.Parser.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__6832__auto__){
var self__ = this;
var this__6832__auto____$1 = this;
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,self__.__meta,self__.__extmap,self__.__hash));
});

instaparse.core.Parser.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__6842__auto__){
var self__ = this;
var this__6842__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__6833__auto__){
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

instaparse.core.Parser.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this__6834__auto__,other__6835__auto__){
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

instaparse.core.Parser.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__6847__auto__,k__6848__auto__){
var self__ = this;
var this__6847__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$start_DASH_production,null,cljs.core.cst$kw$grammar,null,cljs.core.cst$kw$output_DASH_format,null], null), null),k__6848__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__6847__auto____$1),self__.__meta),k__6848__auto__);
} else {
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__6848__auto__)),null));
}
});

instaparse.core.Parser.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__6845__auto__,k__6846__auto__,G__21689){
var self__ = this;
var this__6845__auto____$1 = this;
var pred__21694 = cljs.core.keyword_identical_QMARK_;
var expr__21695 = k__6846__auto__;
if(cljs.core.truth_((pred__21694.cljs$core$IFn$_invoke$arity$2 ? pred__21694.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$grammar,expr__21695) : pred__21694.call(null,cljs.core.cst$kw$grammar,expr__21695)))){
return (new instaparse.core.Parser(G__21689,self__.start_production,self__.output_format,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21694.cljs$core$IFn$_invoke$arity$2 ? pred__21694.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$start_DASH_production,expr__21695) : pred__21694.call(null,cljs.core.cst$kw$start_DASH_production,expr__21695)))){
return (new instaparse.core.Parser(self__.grammar,G__21689,self__.output_format,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21694.cljs$core$IFn$_invoke$arity$2 ? pred__21694.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$output_DASH_format,expr__21695) : pred__21694.call(null,cljs.core.cst$kw$output_DASH_format,expr__21695)))){
return (new instaparse.core.Parser(self__.grammar,self__.start_production,G__21689,self__.__meta,self__.__extmap,null));
} else {
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__6846__auto__,G__21689),null));
}
}
}
});

instaparse.core.Parser.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__6850__auto__){
var self__ = this;
var this__6850__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$grammar,self__.grammar],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$start_DASH_production,self__.start_production],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.cst$kw$output_DASH_format,self__.output_format],null))], null),self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__6837__auto__,G__21689){
var self__ = this;
var this__6837__auto____$1 = this;
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,G__21689,self__.__extmap,self__.__hash));
});

instaparse.core.Parser.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__6843__auto__,entry__6844__auto__){
var self__ = this;
var this__6843__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__6844__auto__)){
return cljs.core._assoc(this__6843__auto____$1,cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__6844__auto__,(0)),cljs.core._nth.cljs$core$IFn$_invoke$arity$2(entry__6844__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__6843__auto____$1,entry__6844__auto__);
}
});

instaparse.core.Parser.prototype.call = (function() {
var G__21698 = null;
var G__21698__2 = (function (self__,text){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse(parser,text);
});
var G__21698__4 = (function (self__,text,key1,val1){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1], 0));
});
var G__21698__6 = (function (self__,text,key1,val1,key2,val2){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1,key2,val2], 0));
});
var G__21698__8 = (function (self__,text,key1,val1,key2,val2,key3,val3){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1,key2,val2,key3,val3], 0));
});
G__21698 = function(self__,text,key1,val1,key2,val2,key3,val3){
switch(arguments.length){
case 2:
return G__21698__2.call(this,self__,text);
case 4:
return G__21698__4.call(this,self__,text,key1,val1);
case 6:
return G__21698__6.call(this,self__,text,key1,val1,key2,val2);
case 8:
return G__21698__8.call(this,self__,text,key1,val1,key2,val2,key3,val3);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__21698.cljs$core$IFn$_invoke$arity$2 = G__21698__2;
G__21698.cljs$core$IFn$_invoke$arity$4 = G__21698__4;
G__21698.cljs$core$IFn$_invoke$arity$6 = G__21698__6;
G__21698.cljs$core$IFn$_invoke$arity$8 = G__21698__8;
return G__21698;
})()
;

instaparse.core.Parser.prototype.apply = (function (self__,args21692){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args21692)));
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$1 = (function (text){
var self__ = this;
var parser = this;
return instaparse.core.parse(parser,text);
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$3 = (function (text,key1,val1){
var self__ = this;
var parser = this;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1], 0));
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$5 = (function (text,key1,val1,key2,val2){
var self__ = this;
var parser = this;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1,key2,val2], 0));
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$7 = (function (text,key1,val1,key2,val2,key3,val3){
var self__ = this;
var parser = this;
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(parser,text,cljs.core.array_seq([key1,val1,key2,val2,key3,val3], 0));
});

instaparse.core.Parser.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$grammar,cljs.core.cst$sym$start_DASH_production,cljs.core.cst$sym$output_DASH_format], null);
});

instaparse.core.Parser.cljs$lang$type = true;

instaparse.core.Parser.cljs$lang$ctorPrSeq = (function (this__6872__auto__){
return cljs.core._conj(cljs.core.List.EMPTY,"instaparse.core/Parser");
});

instaparse.core.Parser.cljs$lang$ctorPrWriter = (function (this__6872__auto__,writer__6873__auto__){
return cljs.core._write(writer__6873__auto__,"instaparse.core/Parser");
});

instaparse.core.__GT_Parser = (function instaparse$core$__GT_Parser(grammar,start_production,output_format){
return (new instaparse.core.Parser(grammar,start_production,output_format,null,null,null));
});

instaparse.core.map__GT_Parser = (function instaparse$core$map__GT_Parser(G__21691){
return (new instaparse.core.Parser(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(G__21691),cljs.core.cst$kw$start_DASH_production.cljs$core$IFn$_invoke$arity$1(G__21691),cljs.core.cst$kw$output_DASH_format.cljs$core$IFn$_invoke$arity$1(G__21691),null,cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__21691,cljs.core.cst$kw$grammar,cljs.core.array_seq([cljs.core.cst$kw$start_DASH_production,cljs.core.cst$kw$output_DASH_format], 0)),null));
});

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (parser,writer,_){
var parser__$1 = this;
return cljs.core._write(writer,instaparse.print.Parser__GT_str(parser__$1));
});
/**
 * Takes a string specification of a context-free grammar,
 *   or a URI for a text file containing such a specification,
 *   or a map of parser combinators and returns a parser for that grammar.
 * 
 *   Optional keyword arguments:
 *   :input-format :ebnf
 *   or
 *   :input-format :abnf
 * 
 *   :output-format :enlive
 *   or
 *   :output-format :hiccup
 * 
 *   :start :keyword (where :keyword is name of starting production rule)
 * 
 *   :string-ci true (treat all string literals as case insensitive)
 * 
 *   :no-slurp (ignored in cljs as slurping is not supported)
 * 
 *   :auto-whitespace (:standard or :comma)
 *   or
 *   :auto-whitespace custom-whitespace-parser
 */
instaparse.core.parser = (function instaparse$core$parser(var_args){
var args__7298__auto__ = [];
var len__7291__auto___21708 = arguments.length;
var i__7292__auto___21709 = (0);
while(true){
if((i__7292__auto___21709 < len__7291__auto___21708)){
args__7298__auto__.push((arguments[i__7292__auto___21709]));

var G__21710 = (i__7292__auto___21709 + (1));
i__7292__auto___21709 = G__21710;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((1) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((1)),(0),null)):null);
return instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7299__auto__);
});

instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic = (function (grammar_specification,p__21701){
var map__21702 = p__21701;
var map__21702__$1 = ((((!((map__21702 == null)))?((((map__21702.cljs$lang$protocol_mask$partition0$ & (64))) || (map__21702.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__21702):map__21702);
var options = map__21702__$1;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [null,null,cljs.core.cst$kw$ebnf,null,cljs.core.cst$kw$abnf,null], null), null),cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$input_DASH_format))){
} else {
throw (new Error("Assert failed: (contains? #{nil :ebnf :abnf} (get options :input-format))"));
}

if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [null,null,cljs.core.cst$kw$hiccup,null,cljs.core.cst$kw$enlive,null], null), null),cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$output_DASH_format))){
} else {
throw (new Error("Assert failed: (contains? #{nil :hiccup :enlive} (get options :output-format))"));
}

if((function (){var ws_parser = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$auto_DASH_whitespace);
return ((ws_parser == null)) || (cljs.core.contains_QMARK_(instaparse.core.standard_whitespace_parsers,ws_parser)) || ((cljs.core.map_QMARK_(ws_parser)) && (cljs.core.contains_QMARK_(ws_parser,cljs.core.cst$kw$grammar)) && (cljs.core.contains_QMARK_(ws_parser,cljs.core.cst$kw$start_DASH_production)));
})()){
} else {
throw (new Error("Assert failed: (let [ws-parser (get options :auto-whitespace)] (or (nil? ws-parser) (contains? standard-whitespace-parsers ws-parser) (and (map? ws-parser) (contains? ws-parser :grammar) (contains? ws-parser :start-production))))"));
}

var input_format = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$input_DASH_format,instaparse.core._STAR_default_input_format_STAR_);
var build_parser = (function (){var G__21704 = (((input_format instanceof cljs.core.Keyword))?input_format.fqn:null);
switch (G__21704) {
case "abnf":
return instaparse.abnf.build_parser;

break;
case "ebnf":
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$string_DASH_ci))){
return ((function (G__21704,input_format,map__21702,map__21702__$1,options){
return (function (spec,output_format){
var _STAR_case_insensitive_literals_STAR_21705 = instaparse.cfg._STAR_case_insensitive_literals_STAR_;
instaparse.cfg._STAR_case_insensitive_literals_STAR_ = true;

try{return instaparse.cfg.build_parser(spec,output_format);
}finally {instaparse.cfg._STAR_case_insensitive_literals_STAR_ = _STAR_case_insensitive_literals_STAR_21705;
}});
;})(G__21704,input_format,map__21702,map__21702__$1,options))
} else {
return instaparse.cfg.build_parser;
}

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(input_format)].join('')));

}
})();
var output_format = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$output_DASH_format,instaparse.core._STAR_default_output_format_STAR_);
var start = cljs.core.get.cljs$core$IFn$_invoke$arity$3(options,cljs.core.cst$kw$start,null);
var built_parser = ((typeof grammar_specification === 'string')?(function (){var parser = (build_parser.cljs$core$IFn$_invoke$arity$2 ? build_parser.cljs$core$IFn$_invoke$arity$2(grammar_specification,output_format) : build_parser.call(null,grammar_specification,output_format));
if(cljs.core.truth_(start)){
return instaparse.core.map__GT_Parser(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parser,cljs.core.cst$kw$start_DASH_production,start));
} else {
return instaparse.core.map__GT_Parser(parser);
}
})():((cljs.core.map_QMARK_(grammar_specification))?(function (){var parser = instaparse.cfg.build_parser_from_combinators(grammar_specification,output_format,start);
return instaparse.core.map__GT_Parser(parser);
})():((cljs.core.vector_QMARK_(grammar_specification))?(function (){var start__$1 = (cljs.core.truth_(start)?start:(grammar_specification.cljs$core$IFn$_invoke$arity$1 ? grammar_specification.cljs$core$IFn$_invoke$arity$1((0)) : grammar_specification.call(null,(0))));
var parser = instaparse.cfg.build_parser_from_combinators(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,grammar_specification),output_format,start__$1);
return instaparse.core.map__GT_Parser(parser);
})():null)));
var auto_whitespace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(options,cljs.core.cst$kw$auto_DASH_whitespace);
var whitespace_parser = (((auto_whitespace instanceof cljs.core.Keyword))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(instaparse.core.standard_whitespace_parsers,auto_whitespace):auto_whitespace);
var temp__4655__auto__ = whitespace_parser;
if(cljs.core.truth_(temp__4655__auto__)){
var map__21706 = temp__4655__auto__;
var map__21706__$1 = ((((!((map__21706 == null)))?((((map__21706.cljs$lang$protocol_mask$partition0$ & (64))) || (map__21706.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__21706):map__21706);
var ws_grammar = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21706__$1,cljs.core.cst$kw$grammar);
var ws_start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21706__$1,cljs.core.cst$kw$start_DASH_production);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(built_parser,cljs.core.cst$kw$grammar,instaparse.combinators_source.auto_whitespace(cljs.core.cst$kw$grammar.cljs$core$IFn$_invoke$arity$1(built_parser),cljs.core.cst$kw$start_DASH_production.cljs$core$IFn$_invoke$arity$1(built_parser),ws_grammar,ws_start));
} else {
return built_parser;
}
});

instaparse.core.parser.cljs$lang$maxFixedArity = (1);

instaparse.core.parser.cljs$lang$applyTo = (function (seq21699){
var G__21700 = cljs.core.first(seq21699);
var seq21699__$1 = cljs.core.next(seq21699);
return instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic(G__21700,seq21699__$1);
});
/**
 * Tests whether a parse result is a failure.
 */
instaparse.core.failure_QMARK_ = (function instaparse$core$failure_QMARK_(result){
return ((result instanceof instaparse.gll.Failure)) || ((cljs.core.meta(result) instanceof instaparse.gll.Failure));
});
/**
 * Extracts failure object from failed parse result.
 */
instaparse.core.get_failure = (function instaparse$core$get_failure(result){
if((result instanceof instaparse.gll.Failure)){
return result;
} else {
if((cljs.core.meta(result) instanceof instaparse.gll.Failure)){
return cljs.core.meta(result);
} else {
return null;

}
}
});
instaparse.core.transform = instaparse.transform.transform;
instaparse.core.add_line_and_column_info_to_metadata = instaparse.line_col.add_line_col_spans;
instaparse.core.standard_whitespace_parsers = new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$standard,instaparse.core.parser("whitespace = #'\\s+'"),cljs.core.cst$kw$comma,instaparse.core.parser("whitespace = #'[,\\s]+'")], null);
