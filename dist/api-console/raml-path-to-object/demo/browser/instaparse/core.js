// Compiled by ClojureScript 1.9.14 {}
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
instaparse.core._STAR_default_output_format_STAR_ = new cljs.core.Keyword(null,"hiccup","hiccup",1218876238);
/**
 * Changes the default output format.  Input should be :hiccup or :enlive
 */
instaparse.core.set_default_output_format_BANG_ = (function instaparse$core$set_default_output_format_BANG_(type){
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"hiccup","hiccup",1218876238),null,new cljs.core.Keyword(null,"enlive","enlive",1679023921),null], null), null).call(null,type))){
} else {
throw (new Error("Assert failed: (#{:hiccup :enlive} type)"));
}

return instaparse.core._STAR_default_output_format_STAR_ = type;
});
instaparse.core._STAR_default_input_format_STAR_ = new cljs.core.Keyword(null,"ebnf","ebnf",31967825);
/**
 * Changes the default input format.  Input should be :abnf or :ebnf
 */
instaparse.core.set_default_input_format_BANG_ = (function instaparse$core$set_default_input_format_BANG_(type){
if(cljs.core.truth_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ebnf","ebnf",31967825),null,new cljs.core.Keyword(null,"abnf","abnf",-152462052),null], null), null).call(null,type))){
} else {
throw (new Error("Assert failed: (#{:ebnf :abnf} type)"));
}

return instaparse.core._STAR_default_input_format_STAR_ = type;
});

instaparse.core.unhide_parser = (function instaparse$core$unhide_parser(parser,unhide){
var G__16836 = unhide;
if(cljs.core._EQ_.call(null,null,G__16836)){
return parser;
} else {
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"content","content",15833224),G__16836)){
return cljs.core.assoc.call(null,parser,new cljs.core.Keyword(null,"grammar","grammar",1881328267),instaparse.combinators_source.unhide_all_content.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser)));
} else {
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"tags","tags",1771418977),G__16836)){
return cljs.core.assoc.call(null,parser,new cljs.core.Keyword(null,"grammar","grammar",1881328267),instaparse.combinators_source.unhide_tags.call(null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676).cljs$core$IFn$_invoke$arity$1(parser),new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser)));
} else {
if(cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"all","all",892129742),G__16836)){
return cljs.core.assoc.call(null,parser,new cljs.core.Keyword(null,"grammar","grammar",1881328267),instaparse.combinators_source.unhide_all.call(null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676).cljs$core$IFn$_invoke$arity$1(parser),new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser)));
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
var len__7291__auto___16843 = arguments.length;
var i__7292__auto___16844 = (0);
while(true){
if((i__7292__auto___16844 < len__7291__auto___16843)){
args__7298__auto__.push((arguments[i__7292__auto___16844]));

var G__16845 = (i__7292__auto___16844 + (1));
i__7292__auto___16844 = G__16845;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((2) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((2)),(0),null)):null);
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7299__auto__);
});

instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic = (function (parser,text,p__16840){
var map__16841 = p__16840;
var map__16841__$1 = ((((!((map__16841 == null)))?((((map__16841.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16841.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16841):map__16841);
var options = map__16841__$1;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [null,null,new cljs.core.Keyword(null,"tags","tags",1771418977),null,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"all","all",892129742),null], null), null),cljs.core.get.call(null,options,new cljs.core.Keyword(null,"unhide","unhide",-413983695)))){
} else {
throw (new Error("Assert failed: (contains? #{nil :tags :content :all} (get options :unhide))"));
}

if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [null,null,new cljs.core.Keyword(null,"memory","memory",-1449401430),null], null), null),cljs.core.get.call(null,options,new cljs.core.Keyword(null,"optimize","optimize",-1912349448)))){
} else {
throw (new Error("Assert failed: (contains? #{nil :memory} (get options :optimize))"));
}

var start_production = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"start","start",-355208981),new cljs.core.Keyword(null,"start-production","start-production",687546537).cljs$core$IFn$_invoke$arity$1(parser));
var partial_QMARK_ = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"partial","partial",241141745),false);
var optimize_QMARK_ = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"optimize","optimize",-1912349448),false);
var unhide = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"unhide","unhide",-413983695));
var parser__$1 = instaparse.core.unhide_parser.call(null,parser,unhide);
if(cljs.core.truth_(new cljs.core.Keyword(null,"total","total",1916810418).cljs$core$IFn$_invoke$arity$1(options))){
return instaparse.gll.parse_total.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_,instaparse.reduction.node_builders.call(null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676).cljs$core$IFn$_invoke$arity$1(parser__$1)));
} else {
if(cljs.core.truth_((function (){var and__6204__auto__ = optimize_QMARK_;
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.not.call(null,partial_QMARK_);
} else {
return and__6204__auto__;
}
})())){
var result = instaparse.repeat.try_repeating_parse_strategy.call(null,parser__$1,text,start_production);
if(cljs.core.truth_(instaparse.core.failure_QMARK_.call(null,result))){
return instaparse.gll.parse.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);
} else {
return result;
}
} else {
return instaparse.gll.parse.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);

}
}
});

instaparse.core.parse.cljs$lang$maxFixedArity = (2);

instaparse.core.parse.cljs$lang$applyTo = (function (seq16837){
var G__16838 = cljs.core.first.call(null,seq16837);
var seq16837__$1 = cljs.core.next.call(null,seq16837);
var G__16839 = cljs.core.first.call(null,seq16837__$1);
var seq16837__$2 = cljs.core.next.call(null,seq16837__$1);
return instaparse.core.parse.cljs$core$IFn$_invoke$arity$variadic(G__16838,G__16839,seq16837__$2);
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
var len__7291__auto___16852 = arguments.length;
var i__7292__auto___16853 = (0);
while(true){
if((i__7292__auto___16853 < len__7291__auto___16852)){
args__7298__auto__.push((arguments[i__7292__auto___16853]));

var G__16854 = (i__7292__auto___16853 + (1));
i__7292__auto___16853 = G__16854;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((2) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((2)),(0),null)):null);
return instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7299__auto__);
});

instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic = (function (parser,text,p__16849){
var map__16850 = p__16849;
var map__16850__$1 = ((((!((map__16850 == null)))?((((map__16850.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16850.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16850):map__16850);
var options = map__16850__$1;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [null,null,new cljs.core.Keyword(null,"tags","tags",1771418977),null,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"all","all",892129742),null], null), null),cljs.core.get.call(null,options,new cljs.core.Keyword(null,"unhide","unhide",-413983695)))){
} else {
throw (new Error("Assert failed: (contains? #{nil :tags :content :all} (get options :unhide))"));
}

var start_production = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"start","start",-355208981),new cljs.core.Keyword(null,"start-production","start-production",687546537).cljs$core$IFn$_invoke$arity$1(parser));
var partial_QMARK_ = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"partial","partial",241141745),false);
var unhide = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"unhide","unhide",-413983695));
var parser__$1 = instaparse.core.unhide_parser.call(null,parser,unhide);
if(cljs.core.truth_(new cljs.core.Keyword(null,"total","total",1916810418).cljs$core$IFn$_invoke$arity$1(options))){
return instaparse.gll.parses_total.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_,instaparse.reduction.node_builders.call(null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676).cljs$core$IFn$_invoke$arity$1(parser__$1)));
} else {
return instaparse.gll.parses.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(parser__$1),start_production,text,partial_QMARK_);

}
});

instaparse.core.parses.cljs$lang$maxFixedArity = (2);

instaparse.core.parses.cljs$lang$applyTo = (function (seq16846){
var G__16847 = cljs.core.first.call(null,seq16846);
var seq16846__$1 = cljs.core.next.call(null,seq16846);
var G__16848 = cljs.core.first.call(null,seq16846__$1);
var seq16846__$2 = cljs.core.next.call(null,seq16846__$1);
return instaparse.core.parses.cljs$core$IFn$_invoke$arity$variadic(G__16847,G__16848,seq16846__$2);
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
return cljs.core._lookup.call(null,this__6838__auto____$1,k__6839__auto__,null);
});

instaparse.core.Parser.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__6840__auto__,k16856,else__6841__auto__){
var self__ = this;
var this__6840__auto____$1 = this;
var G__16859 = (((k16856 instanceof cljs.core.Keyword))?k16856.fqn:null);
switch (G__16859) {
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
return cljs.core.get.call(null,self__.__extmap,k16856,else__6841__auto__);

}
});

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__6852__auto__,writer__6853__auto__,opts__6854__auto__){
var self__ = this;
var this__6852__auto____$1 = this;
var pr_pair__6855__auto__ = ((function (this__6852__auto____$1){
return (function (keyval__6856__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__6853__auto__,cljs.core.pr_writer,""," ","",opts__6854__auto__,keyval__6856__auto__);
});})(this__6852__auto____$1))
;
return cljs.core.pr_sequential_writer.call(null,writer__6853__auto__,pr_pair__6855__auto__,"#instaparse.core.Parser{",", ","}",opts__6854__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"grammar","grammar",1881328267),self__.grammar],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"start-production","start-production",687546537),self__.start_production],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"output-format","output-format",-1826382676),self__.output_format],null))], null),self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IIterable$ = true;

instaparse.core.Parser.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__16855){
var self__ = this;
var G__16855__$1 = this;
return (new cljs.core.RecordIter((0),G__16855__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"grammar","grammar",1881328267),new cljs.core.Keyword(null,"start-production","start-production",687546537),new cljs.core.Keyword(null,"output-format","output-format",-1826382676)], null),cljs.core._iterator.call(null,self__.__extmap)));
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
return (3 + cljs.core.count.call(null,self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__6833__auto__){
var self__ = this;
var this__6833__auto____$1 = this;
var h__6651__auto__ = self__.__hash;
if(!((h__6651__auto__ == null))){
return h__6651__auto__;
} else {
var h__6651__auto____$1 = cljs.core.hash_imap.call(null,this__6833__auto____$1);
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
return cljs.core.equiv_map.call(null,this__6834__auto____$1,other__6835__auto__);
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
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"start-production","start-production",687546537),null,new cljs.core.Keyword(null,"grammar","grammar",1881328267),null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676),null], null), null),k__6848__auto__)){
return cljs.core.dissoc.call(null,cljs.core.with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__6847__auto____$1),self__.__meta),k__6848__auto__);
} else {
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__6848__auto__)),null));
}
});

instaparse.core.Parser.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__6845__auto__,k__6846__auto__,G__16855){
var self__ = this;
var this__6845__auto____$1 = this;
var pred__16860 = cljs.core.keyword_identical_QMARK_;
var expr__16861 = k__6846__auto__;
if(cljs.core.truth_(pred__16860.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267),expr__16861))){
return (new instaparse.core.Parser(G__16855,self__.start_production,self__.output_format,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__16860.call(null,new cljs.core.Keyword(null,"start-production","start-production",687546537),expr__16861))){
return (new instaparse.core.Parser(self__.grammar,G__16855,self__.output_format,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__16860.call(null,new cljs.core.Keyword(null,"output-format","output-format",-1826382676),expr__16861))){
return (new instaparse.core.Parser(self__.grammar,self__.start_production,G__16855,self__.__meta,self__.__extmap,null));
} else {
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__6846__auto__,G__16855),null));
}
}
}
});

instaparse.core.Parser.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__6850__auto__){
var self__ = this;
var this__6850__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"grammar","grammar",1881328267),self__.grammar],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"start-production","start-production",687546537),self__.start_production],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"output-format","output-format",-1826382676),self__.output_format],null))], null),self__.__extmap));
});

instaparse.core.Parser.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__6837__auto__,G__16855){
var self__ = this;
var this__6837__auto____$1 = this;
return (new instaparse.core.Parser(self__.grammar,self__.start_production,self__.output_format,G__16855,self__.__extmap,self__.__hash));
});

instaparse.core.Parser.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__6843__auto__,entry__6844__auto__){
var self__ = this;
var this__6843__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__6844__auto__)){
return cljs.core._assoc.call(null,this__6843__auto____$1,cljs.core._nth.call(null,entry__6844__auto__,(0)),cljs.core._nth.call(null,entry__6844__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__6843__auto____$1,entry__6844__auto__);
}
});

instaparse.core.Parser.prototype.call = (function() {
var G__16864 = null;
var G__16864__2 = (function (self__,text){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.call(null,parser,text);
});
var G__16864__4 = (function (self__,text,key1,val1){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.call(null,parser,text,key1,val1);
});
var G__16864__6 = (function (self__,text,key1,val1,key2,val2){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.call(null,parser,text,key1,val1,key2,val2);
});
var G__16864__8 = (function (self__,text,key1,val1,key2,val2,key3,val3){
var self__ = this;
var self____$1 = this;
var parser = self____$1;
return instaparse.core.parse.call(null,parser,text,key1,val1,key2,val2,key3,val3);
});
G__16864 = function(self__,text,key1,val1,key2,val2,key3,val3){
switch(arguments.length){
case 2:
return G__16864__2.call(this,self__,text);
case 4:
return G__16864__4.call(this,self__,text,key1,val1);
case 6:
return G__16864__6.call(this,self__,text,key1,val1,key2,val2);
case 8:
return G__16864__8.call(this,self__,text,key1,val1,key2,val2,key3,val3);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__16864.cljs$core$IFn$_invoke$arity$2 = G__16864__2;
G__16864.cljs$core$IFn$_invoke$arity$4 = G__16864__4;
G__16864.cljs$core$IFn$_invoke$arity$6 = G__16864__6;
G__16864.cljs$core$IFn$_invoke$arity$8 = G__16864__8;
return G__16864;
})()
;

instaparse.core.Parser.prototype.apply = (function (self__,args16858){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone.call(null,args16858)));
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$1 = (function (text){
var self__ = this;
var parser = this;
return instaparse.core.parse.call(null,parser,text);
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$3 = (function (text,key1,val1){
var self__ = this;
var parser = this;
return instaparse.core.parse.call(null,parser,text,key1,val1);
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$5 = (function (text,key1,val1,key2,val2){
var self__ = this;
var parser = this;
return instaparse.core.parse.call(null,parser,text,key1,val1,key2,val2);
});

instaparse.core.Parser.prototype.cljs$core$IFn$_invoke$arity$7 = (function (text,key1,val1,key2,val2,key3,val3){
var self__ = this;
var parser = this;
return instaparse.core.parse.call(null,parser,text,key1,val1,key2,val2,key3,val3);
});

instaparse.core.Parser.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"grammar","grammar",-773107502,null),new cljs.core.Symbol(null,"start-production","start-production",-1966889232,null),new cljs.core.Symbol(null,"output-format","output-format",-185851149,null)], null);
});

instaparse.core.Parser.cljs$lang$type = true;

instaparse.core.Parser.cljs$lang$ctorPrSeq = (function (this__6872__auto__){
return cljs.core._conj.call(null,cljs.core.List.EMPTY,"instaparse.core/Parser");
});

instaparse.core.Parser.cljs$lang$ctorPrWriter = (function (this__6872__auto__,writer__6873__auto__){
return cljs.core._write.call(null,writer__6873__auto__,"instaparse.core/Parser");
});

instaparse.core.__GT_Parser = (function instaparse$core$__GT_Parser(grammar,start_production,output_format){
return (new instaparse.core.Parser(grammar,start_production,output_format,null,null,null));
});

instaparse.core.map__GT_Parser = (function instaparse$core$map__GT_Parser(G__16857){
return (new instaparse.core.Parser(new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(G__16857),new cljs.core.Keyword(null,"start-production","start-production",687546537).cljs$core$IFn$_invoke$arity$1(G__16857),new cljs.core.Keyword(null,"output-format","output-format",-1826382676).cljs$core$IFn$_invoke$arity$1(G__16857),null,cljs.core.dissoc.call(null,G__16857,new cljs.core.Keyword(null,"grammar","grammar",1881328267),new cljs.core.Keyword(null,"start-production","start-production",687546537),new cljs.core.Keyword(null,"output-format","output-format",-1826382676)),null));
});

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.core.Parser.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (parser,writer,_){
var parser__$1 = this;
return cljs.core._write.call(null,writer,instaparse.print.Parser__GT_str.call(null,parser__$1));
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
var len__7291__auto___16874 = arguments.length;
var i__7292__auto___16875 = (0);
while(true){
if((i__7292__auto___16875 < len__7291__auto___16874)){
args__7298__auto__.push((arguments[i__7292__auto___16875]));

var G__16876 = (i__7292__auto___16875 + (1));
i__7292__auto___16875 = G__16876;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((1) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((1)),(0),null)):null);
return instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7299__auto__);
});

instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic = (function (grammar_specification,p__16867){
var map__16868 = p__16867;
var map__16868__$1 = ((((!((map__16868 == null)))?((((map__16868.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16868.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16868):map__16868);
var options = map__16868__$1;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [null,null,new cljs.core.Keyword(null,"ebnf","ebnf",31967825),null,new cljs.core.Keyword(null,"abnf","abnf",-152462052),null], null), null),cljs.core.get.call(null,options,new cljs.core.Keyword(null,"input-format","input-format",-422703481)))){
} else {
throw (new Error("Assert failed: (contains? #{nil :ebnf :abnf} (get options :input-format))"));
}

if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [null,null,new cljs.core.Keyword(null,"hiccup","hiccup",1218876238),null,new cljs.core.Keyword(null,"enlive","enlive",1679023921),null], null), null),cljs.core.get.call(null,options,new cljs.core.Keyword(null,"output-format","output-format",-1826382676)))){
} else {
throw (new Error("Assert failed: (contains? #{nil :hiccup :enlive} (get options :output-format))"));
}

if((function (){var ws_parser = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"auto-whitespace","auto-whitespace",741152317));
return ((ws_parser == null)) || (cljs.core.contains_QMARK_.call(null,instaparse.core.standard_whitespace_parsers,ws_parser)) || ((cljs.core.map_QMARK_.call(null,ws_parser)) && (cljs.core.contains_QMARK_.call(null,ws_parser,new cljs.core.Keyword(null,"grammar","grammar",1881328267))) && (cljs.core.contains_QMARK_.call(null,ws_parser,new cljs.core.Keyword(null,"start-production","start-production",687546537))));
})()){
} else {
throw (new Error("Assert failed: (let [ws-parser (get options :auto-whitespace)] (or (nil? ws-parser) (contains? standard-whitespace-parsers ws-parser) (and (map? ws-parser) (contains? ws-parser :grammar) (contains? ws-parser :start-production))))"));
}

var input_format = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"input-format","input-format",-422703481),instaparse.core._STAR_default_input_format_STAR_);
var build_parser = (function (){var G__16870 = (((input_format instanceof cljs.core.Keyword))?input_format.fqn:null);
switch (G__16870) {
case "abnf":
return instaparse.abnf.build_parser;

break;
case "ebnf":
if(cljs.core.truth_(cljs.core.get.call(null,options,new cljs.core.Keyword(null,"string-ci","string-ci",374631805)))){
return ((function (G__16870,input_format,map__16868,map__16868__$1,options){
return (function (spec,output_format){
var _STAR_case_insensitive_literals_STAR_16871 = instaparse.cfg._STAR_case_insensitive_literals_STAR_;
instaparse.cfg._STAR_case_insensitive_literals_STAR_ = true;

try{return instaparse.cfg.build_parser.call(null,spec,output_format);
}finally {instaparse.cfg._STAR_case_insensitive_literals_STAR_ = _STAR_case_insensitive_literals_STAR_16871;
}});
;})(G__16870,input_format,map__16868,map__16868__$1,options))
} else {
return instaparse.cfg.build_parser;
}

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(input_format)].join('')));

}
})();
var output_format = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"output-format","output-format",-1826382676),instaparse.core._STAR_default_output_format_STAR_);
var start = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"start","start",-355208981),null);
var built_parser = ((typeof grammar_specification === 'string')?(function (){var parser = build_parser.call(null,grammar_specification,output_format);
if(cljs.core.truth_(start)){
return instaparse.core.map__GT_Parser.call(null,cljs.core.assoc.call(null,parser,new cljs.core.Keyword(null,"start-production","start-production",687546537),start));
} else {
return instaparse.core.map__GT_Parser.call(null,parser);
}
})():((cljs.core.map_QMARK_.call(null,grammar_specification))?(function (){var parser = instaparse.cfg.build_parser_from_combinators.call(null,grammar_specification,output_format,start);
return instaparse.core.map__GT_Parser.call(null,parser);
})():((cljs.core.vector_QMARK_.call(null,grammar_specification))?(function (){var start__$1 = (cljs.core.truth_(start)?start:grammar_specification.call(null,(0)));
var parser = instaparse.cfg.build_parser_from_combinators.call(null,cljs.core.apply.call(null,cljs.core.hash_map,grammar_specification),output_format,start__$1);
return instaparse.core.map__GT_Parser.call(null,parser);
})():null)));
var auto_whitespace = cljs.core.get.call(null,options,new cljs.core.Keyword(null,"auto-whitespace","auto-whitespace",741152317));
var whitespace_parser = (((auto_whitespace instanceof cljs.core.Keyword))?cljs.core.get.call(null,instaparse.core.standard_whitespace_parsers,auto_whitespace):auto_whitespace);
var temp__4655__auto__ = whitespace_parser;
if(cljs.core.truth_(temp__4655__auto__)){
var map__16872 = temp__4655__auto__;
var map__16872__$1 = ((((!((map__16872 == null)))?((((map__16872.cljs$lang$protocol_mask$partition0$ & (64))) || (map__16872.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__16872):map__16872);
var ws_grammar = cljs.core.get.call(null,map__16872__$1,new cljs.core.Keyword(null,"grammar","grammar",1881328267));
var ws_start = cljs.core.get.call(null,map__16872__$1,new cljs.core.Keyword(null,"start-production","start-production",687546537));
return cljs.core.assoc.call(null,built_parser,new cljs.core.Keyword(null,"grammar","grammar",1881328267),instaparse.combinators_source.auto_whitespace.call(null,new cljs.core.Keyword(null,"grammar","grammar",1881328267).cljs$core$IFn$_invoke$arity$1(built_parser),new cljs.core.Keyword(null,"start-production","start-production",687546537).cljs$core$IFn$_invoke$arity$1(built_parser),ws_grammar,ws_start));
} else {
return built_parser;
}
});

instaparse.core.parser.cljs$lang$maxFixedArity = (1);

instaparse.core.parser.cljs$lang$applyTo = (function (seq16865){
var G__16866 = cljs.core.first.call(null,seq16865);
var seq16865__$1 = cljs.core.next.call(null,seq16865);
return instaparse.core.parser.cljs$core$IFn$_invoke$arity$variadic(G__16866,seq16865__$1);
});
/**
 * Tests whether a parse result is a failure.
 */
instaparse.core.failure_QMARK_ = (function instaparse$core$failure_QMARK_(result){
return ((result instanceof instaparse.gll.Failure)) || ((cljs.core.meta.call(null,result) instanceof instaparse.gll.Failure));
});
/**
 * Extracts failure object from failed parse result.
 */
instaparse.core.get_failure = (function instaparse$core$get_failure(result){
if((result instanceof instaparse.gll.Failure)){
return result;
} else {
if((cljs.core.meta.call(null,result) instanceof instaparse.gll.Failure)){
return cljs.core.meta.call(null,result);
} else {
return null;

}
}
});
instaparse.core.transform = instaparse.transform.transform;
instaparse.core.add_line_and_column_info_to_metadata = instaparse.line_col.add_line_col_spans;
instaparse.core.standard_whitespace_parsers = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"standard","standard",-1769206695),instaparse.core.parser.call(null,"whitespace = #'\\s+'"),new cljs.core.Keyword(null,"comma","comma",1699024745),instaparse.core.parser.call(null,"whitespace = #'[,\\s]+'")], null);

//# sourceMappingURL=core.js.map?rel=1480936806387