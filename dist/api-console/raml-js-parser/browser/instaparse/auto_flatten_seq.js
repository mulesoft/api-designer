// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('instaparse.auto_flatten_seq');
goog.require('cljs.core');
instaparse.auto_flatten_seq.threshold = (32);
/**
 * Returns the partially calculated hash code, still requires a call to mix-collection-hash
 */
instaparse.auto_flatten_seq.hash_ordered_coll_without_mix = (function instaparse$auto_flatten_seq$hash_ordered_coll_without_mix(var_args){
var args20625 = [];
var len__7291__auto___20628 = arguments.length;
var i__7292__auto___20629 = (0);
while(true){
if((i__7292__auto___20629 < len__7291__auto___20628)){
args20625.push((arguments[i__7292__auto___20629]));

var G__20630 = (i__7292__auto___20629 + (1));
i__7292__auto___20629 = G__20630;
continue;
} else {
}
break;
}

var G__20627 = args20625.length;
switch (G__20627) {
case 1:
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20625.length)].join('')));

}
});

instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$1 = (function (coll){
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$2((1),coll);
});

instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$2 = (function (existing_unmixed_hash,coll){
var unmixed_hash = existing_unmixed_hash;
var coll__$1 = cljs.core.seq(coll);
while(true){
if(!((coll__$1 == null))){
var G__20632 = ((cljs.core.imul((31),unmixed_hash) + cljs.core.hash(cljs.core.first(coll__$1))) | (0));
var G__20633 = cljs.core.next(coll__$1);
unmixed_hash = G__20632;
coll__$1 = G__20633;
continue;
} else {
return unmixed_hash;
}
break;
}
});

instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$lang$maxFixedArity = 2;
/**
 * Returns the hash code, consistent with =, for an external ordered
 *   collection implementing Iterable.
 *   See http://clojure.org/data_structures#hash for full algorithms.
 */
instaparse.auto_flatten_seq.hash_conj = (function instaparse$auto_flatten_seq$hash_conj(unmixed_hash,item){
return ((cljs.core.imul((31),unmixed_hash) + cljs.core.hash(item)) | (0));
});
instaparse.auto_flatten_seq.expt = (function instaparse$auto_flatten_seq$expt(base,pow){
if((pow === (0))){
return (1);
} else {
var n = (pow | (0));
var y = ((1) | (0));
var z = (base | (0));
while(true){
var t = cljs.core.even_QMARK_(n);
var n__$1 = cljs.core.quot(n,(2));
if(t){
var G__20634 = n__$1;
var G__20635 = y;
var G__20636 = cljs.core.imul(z,z);
n = G__20634;
y = G__20635;
z = G__20636;
continue;
} else {
if((n__$1 === (0))){
return cljs.core.imul(z,y);
} else {
var G__20637 = n__$1;
var G__20638 = cljs.core.imul(z,y);
var G__20639 = cljs.core.imul(z,z);
n = G__20637;
y = G__20638;
z = G__20639;
continue;

}
}
break;
}
}
});
instaparse.auto_flatten_seq.hash_cat = (function instaparse$auto_flatten_seq$hash_cat(v1,v2){
var c = cljs.core.count(v2);
var e = (instaparse.auto_flatten_seq.expt((31),c) | (0));
return ((cljs.core.imul(e,v1.premix_hashcode) | (0)) + (v2.premix_hashcode - e));
});
instaparse.auto_flatten_seq.delve = (function instaparse$auto_flatten_seq$delve(v,index){
var v__$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(v,index);
var index__$1 = index;
while(true){
if(cljs.core.truth_((instaparse.auto_flatten_seq.afs_QMARK_.cljs$core$IFn$_invoke$arity$1 ? instaparse.auto_flatten_seq.afs_QMARK_.cljs$core$IFn$_invoke$arity$1(v__$1) : instaparse.auto_flatten_seq.afs_QMARK_.call(null,v__$1)))){
var G__20640 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(v__$1,(0));
var G__20641 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(index__$1,(0));
v__$1 = G__20640;
index__$1 = G__20641;
continue;
} else {
return index__$1;
}
break;
}
});
instaparse.auto_flatten_seq.advance = (function instaparse$auto_flatten_seq$advance(v,index){
while(true){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.count(index),(1))){
if((cljs.core.peek(index) < ((instaparse.auto_flatten_seq.true_count.cljs$core$IFn$_invoke$arity$1 ? instaparse.auto_flatten_seq.true_count.cljs$core$IFn$_invoke$arity$1(v) : instaparse.auto_flatten_seq.true_count.call(null,v)) - (1)))){
return instaparse.auto_flatten_seq.delve(v,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.peek(index) + (1))], null));
} else {
return null;
}
} else {
if((cljs.core.peek(index) < ((function (){var G__20643 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(v,cljs.core.pop(index));
return (instaparse.auto_flatten_seq.true_count.cljs$core$IFn$_invoke$arity$1 ? instaparse.auto_flatten_seq.true_count.cljs$core$IFn$_invoke$arity$1(G__20643) : instaparse.auto_flatten_seq.true_count.call(null,G__20643));
})() - (1)))){
return instaparse.auto_flatten_seq.delve(v,cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.pop(index),(cljs.core.peek(index) + (1))));
} else {
var G__20644 = v;
var G__20645 = cljs.core.pop(index);
v = G__20644;
index = G__20645;
continue;

}
}
break;
}
});
instaparse.auto_flatten_seq.flat_seq = (function instaparse$auto_flatten_seq$flat_seq(var_args){
var args20646 = [];
var len__7291__auto___20649 = arguments.length;
var i__7292__auto___20650 = (0);
while(true){
if((i__7292__auto___20650 < len__7291__auto___20649)){
args20646.push((arguments[i__7292__auto___20650]));

var G__20651 = (i__7292__auto___20650 + (1));
i__7292__auto___20650 = G__20651;
continue;
} else {
}
break;
}

var G__20648 = args20646.length;
switch (G__20648) {
case 1:
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20646.length)].join('')));

}
});

instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$1 = (function (v){
if((cljs.core.count(v) > (0))){
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2(v,instaparse.auto_flatten_seq.delve(v,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0)], null)));
} else {
return null;
}
});

instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2 = (function (v,index){
return (new cljs.core.LazySeq(null,(function (){
return cljs.core.cons(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(v,index),(function (){var temp__4657__auto__ = instaparse.auto_flatten_seq.advance(v,index);
if(cljs.core.truth_(temp__4657__auto__)){
var next_index = temp__4657__auto__;
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2(v,next_index);
} else {
return null;
}
})());
}),null,null));
});

instaparse.auto_flatten_seq.flat_seq.cljs$lang$maxFixedArity = 2;

/**
 * @interface
 */
instaparse.auto_flatten_seq.ConjFlat = function(){};

instaparse.auto_flatten_seq.conj_flat = (function instaparse$auto_flatten_seq$conj_flat(self,obj){
if((!((self == null))) && (!((self.instaparse$auto_flatten_seq$ConjFlat$conj_flat$arity$2 == null)))){
return self.instaparse$auto_flatten_seq$ConjFlat$conj_flat$arity$2(self,obj);
} else {
var x__6879__auto__ = (((self == null))?null:self);
var m__6880__auto__ = (instaparse.auto_flatten_seq.conj_flat[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(self,obj) : m__6880__auto__.call(null,self,obj));
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.conj_flat["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(self,obj) : m__6880__auto____$1.call(null,self,obj));
} else {
throw cljs.core.missing_protocol("ConjFlat.conj-flat",self);
}
}
}
});

instaparse.auto_flatten_seq.cached_QMARK_ = (function instaparse$auto_flatten_seq$cached_QMARK_(self){
if((!((self == null))) && (!((self.instaparse$auto_flatten_seq$ConjFlat$cached_QMARK_$arity$1 == null)))){
return self.instaparse$auto_flatten_seq$ConjFlat$cached_QMARK_$arity$1(self);
} else {
var x__6879__auto__ = (((self == null))?null:self);
var m__6880__auto__ = (instaparse.auto_flatten_seq.cached_QMARK_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(self) : m__6880__auto__.call(null,self));
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.cached_QMARK_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(self) : m__6880__auto____$1.call(null,self));
} else {
throw cljs.core.missing_protocol("ConjFlat.cached?",self);
}
}
}
});


/**
* @constructor
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeq}
 * @implements {cljs.core.INext}
 * @implements {instaparse.auto_flatten_seq.ConjFlat}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {instaparse.auto_flatten_seq.Object}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.ILookup}
*/
instaparse.auto_flatten_seq.AutoFlattenSeq = (function (v,premix_hashcode,hashcode,cnt,dirty,cached_seq){
this.v = v;
this.premix_hashcode = premix_hashcode;
this.hashcode = hashcode;
this.cnt = cnt;
this.dirty = dirty;
this.cached_seq = cached_seq;
this.cljs$lang$protocol_mask$partition0$ = 31850958;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.toString = (function (){
var self__ = this;
var self = this;
return cljs.core.pr_str_STAR_(cljs.core.seq(self));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (self,key){
var self__ = this;
var self__$1 = this;
return self__.v.cljs$core$ILookup$_lookup$arity$2(null,key);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (self,key,not_found){
var self__ = this;
var self__$1 = this;
return self__.v.cljs$core$ILookup$_lookup$arity$3(null,key,not_found);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.meta(self__.v);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$INext$_next$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.next(cljs.core.seq(self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ICounted$_count$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.cnt;
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.hashcode;
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (self,other){
var self__ = this;
var self__$1 = this;
return (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(self__.hashcode,cljs.core.hash(other))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(self__.cnt,cljs.core.count(other))) && ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(self__.cnt,(0))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.seq(self__$1),other)));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.with_meta(instaparse.auto_flatten_seq.EMPTY,cljs.core.meta(self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.first(cljs.core.seq(self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.rest(cljs.core.seq(self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_(self__.cached_seq)){
return self__.cached_seq;
} else {
self__.cached_seq = ((self__.dirty)?instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$1(self__.v):cljs.core.seq(self__.v));

return self__.cached_seq;
}
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (self,metamap){
var self__ = this;
var self__$1 = this;
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.with_meta(self__.v,metamap),self__.premix_hashcode,self__.hashcode,self__.cnt,self__.dirty,null));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (self,o){
var self__ = this;
var self__$1 = this;
return cljs.core.cons(o,self__$1);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$ = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$conj_flat$arity$2 = (function (self,obj){
var self__ = this;
var self__$1 = this;
if((obj == null)){
return self__$1;
} else {
if(cljs.core.truth_((instaparse.auto_flatten_seq.afs_QMARK_.cljs$core$IFn$_invoke$arity$1 ? instaparse.auto_flatten_seq.afs_QMARK_.cljs$core$IFn$_invoke$arity$1(obj) : instaparse.auto_flatten_seq.afs_QMARK_.call(null,obj)))){
if((self__.cnt === (0))){
return obj;
} else {
if((cljs.core.count(obj) <= instaparse.auto_flatten_seq.threshold)){
var phc = instaparse.auto_flatten_seq.hash_cat(self__$1,obj);
var new_cnt = (self__.cnt + cljs.core.count(obj));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.into.cljs$core$IFn$_invoke$arity$2(self__.v,obj),phc,cljs.core.mix_collection_hash(phc,new_cnt),new_cnt,(function (){var or__6216__auto__ = self__.dirty;
if(or__6216__auto__){
return or__6216__auto__;
} else {
return obj.dirty;
}
})(),null));
} else {
var phc = instaparse.auto_flatten_seq.hash_cat(self__$1,obj);
var new_cnt = (self__.cnt + cljs.core.count(obj));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(self__.v,obj),phc,cljs.core.mix_collection_hash(phc,new_cnt),new_cnt,true,null));

}
}
} else {
var phc = instaparse.auto_flatten_seq.hash_conj(self__.premix_hashcode,obj);
var new_cnt = (self__.cnt + (1));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(self__.v,obj),phc,cljs.core.mix_collection_hash(phc,new_cnt),new_cnt,self__.dirty,null));

}
}
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$cached_QMARK_$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.cached_seq;
});

instaparse.auto_flatten_seq.AutoFlattenSeq.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$v,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$PersistentVector], null)),cljs.core.with_meta(cljs.core.cst$sym$premix_DASH_hashcode,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$number], null)),cljs.core.with_meta(cljs.core.cst$sym$hashcode,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$number], null)),cljs.core.with_meta(cljs.core.cst$sym$cnt,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$number], null)),cljs.core.with_meta(cljs.core.cst$sym$dirty,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$boolean], null)),cljs.core.with_meta(cljs.core.cst$sym$cached_DASH_seq,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$tag,cljs.core.cst$sym$ISeq,cljs.core.cst$kw$unsynchronized_DASH_mutable,true], null))], null);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$type = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$ctorStr = "instaparse.auto-flatten-seq/AutoFlattenSeq";

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"instaparse.auto-flatten-seq/AutoFlattenSeq");
});

instaparse.auto_flatten_seq.__GT_AutoFlattenSeq = (function instaparse$auto_flatten_seq$__GT_AutoFlattenSeq(v,premix_hashcode,hashcode,cnt,dirty,cached_seq){
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(v,premix_hashcode,hashcode,cnt,dirty,cached_seq));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (afs,writer,opts){
var afs__$1 = this;
return cljs.core._pr_writer(cljs.core.seq(afs__$1),writer,opts);
});
instaparse.auto_flatten_seq.auto_flatten_seq = (function instaparse$auto_flatten_seq$auto_flatten_seq(v){
var v__$1 = cljs.core.vec(v);
var c = cljs.core.count(v__$1);
var unmixed_hash = instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$1(v__$1);
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(v__$1,unmixed_hash,cljs.core.mix_collection_hash(unmixed_hash,c),c,false,null));
});
instaparse.auto_flatten_seq.EMPTY = instaparse.auto_flatten_seq.auto_flatten_seq(cljs.core.PersistentVector.EMPTY);
instaparse.auto_flatten_seq.afs_QMARK_ = (function instaparse$auto_flatten_seq$afs_QMARK_(s){
return (s instanceof instaparse.auto_flatten_seq.AutoFlattenSeq);
});
instaparse.auto_flatten_seq.true_count = (function instaparse$auto_flatten_seq$true_count(v){
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_(v))){
return cljs.core.count(v.v);
} else {
return cljs.core.count(v);
}
});
instaparse.auto_flatten_seq.flat_vec_helper = (function instaparse$auto_flatten_seq$flat_vec_helper(acc,v){
while(true){
var temp__4655__auto__ = cljs.core.seq(v);
if(temp__4655__auto__){
var s = temp__4655__auto__;
var fst = cljs.core.first(v);
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_(fst))){
var G__20653 = instaparse$auto_flatten_seq$flat_vec_helper(acc,fst);
var G__20654 = cljs.core.next(v);
acc = G__20653;
v = G__20654;
continue;
} else {
var G__20655 = cljs.core.conj_BANG_.cljs$core$IFn$_invoke$arity$2(acc,fst);
var G__20656 = cljs.core.next(v);
acc = G__20655;
v = G__20656;
continue;
}
} else {
return acc;
}
break;
}
});
/**
 * Turns deep vector (like the vector inside of FlattenOnDemandVector) into a flat vec
 */
instaparse.auto_flatten_seq.flat_vec = (function instaparse$auto_flatten_seq$flat_vec(v){
return cljs.core.persistent_BANG_(instaparse.auto_flatten_seq.flat_vec_helper(cljs.core.transient$(cljs.core.PersistentVector.EMPTY),v));
});

/**
 * @interface
 */
instaparse.auto_flatten_seq.GetVec = function(){};

instaparse.auto_flatten_seq.get_vec = (function instaparse$auto_flatten_seq$get_vec(self){
if((!((self == null))) && (!((self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1 == null)))){
return self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(self);
} else {
var x__6879__auto__ = (((self == null))?null:self);
var m__6880__auto__ = (instaparse.auto_flatten_seq.get_vec[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(self) : m__6880__auto__.call(null,self));
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.get_vec["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(self) : m__6880__auto____$1.call(null,self));
} else {
throw cljs.core.missing_protocol("GetVec.get-vec",self);
}
}
}
});


/**
* @constructor
 * @implements {cljs.core.IIndexed}
 * @implements {cljs.core.IVector}
 * @implements {cljs.core.IReversible}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.IEmptyableCollection}
 * @implements {cljs.core.ICounted}
 * @implements {instaparse.auto_flatten_seq.GetVec}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IStack}
 * @implements {instaparse.auto_flatten_seq.Object}
 * @implements {cljs.core.IComparable}
 * @implements {cljs.core.ISequential}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.ILookup}
*/
instaparse.auto_flatten_seq.FlattenOnDemandVector = (function (v,hashcode,cnt,flat){
this.v = v;
this.hashcode = hashcode;
this.cnt = cnt;
this.flat = flat;
this.cljs$lang$protocol_mask$partition0$ = 167142175;
this.cljs$lang$protocol_mask$partition1$ = 2048;
})
instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.toString = (function (){
var self__ = this;
var self = this;
return cljs.core.pr_str_STAR_(self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(null));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (self,key){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$ILookup$_lookup$arity$2(null,key);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (self,key,not_found){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$ILookup$_lookup$arity$3(null,key,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.instaparse$auto_flatten_seq$GetVec$ = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.not((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat)))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.flat,((function (self__$1){
return (function (_){
return cljs.core.with_meta(instaparse.auto_flatten_seq.flat_vec((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.v) : cljs.core.deref.call(null,self__.v))),cljs.core.meta((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.v) : cljs.core.deref.call(null,self__.v))));
});})(self__$1))
);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.v,((function (self__$1){
return (function (_){
return null;
});})(self__$1))
);
} else {
}

return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (self,f,init){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IKVReduce$_kv_reduce$arity$3(null,f,init);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (self,i){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IIndexed$_nth$arity$2(null,i);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (self,i,not_found){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IIndexed$_nth$arity$3(null,i,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (self,i,val){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IVector$_assoc_n$arity$3(null,i,val);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IMeta$_meta$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat)))){
return cljs.core.meta((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat)));
} else {
return cljs.core.meta((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.v) : cljs.core.deref.call(null,self__.v)));
}
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ICounted$_count$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.cnt;
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IStack$_peek$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IStack$_peek$arity$1(null);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IStack$_pop$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IStack$_pop$arity$1(null);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IReversible$_rseq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if((self__.cnt > (0))){
return cljs.core.rseq(instaparse.auto_flatten_seq.get_vec(self__$1));
} else {
return null;
}
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IHash$_hash$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.hashcode;
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (self,other){
var self__ = this;
var self__$1 = this;
return (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(self__.hashcode,cljs.core.hash(other))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(self__.cnt,cljs.core.count(other))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(instaparse.auto_flatten_seq.get_vec(self__$1),other));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY,cljs.core.meta(self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (self,i,val){
var self__ = this;
var self__$1 = this;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(instaparse.auto_flatten_seq.get_vec(self__$1),i,val);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (self,k){
var self__ = this;
var self__$1 = this;
return instaparse.auto_flatten_seq.get_vec(self__$1).cljs$core$IAssociative$_contains_key_QMARK_$arity$2(null,k);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.seq(instaparse.auto_flatten_seq.get_vec(self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (self,metamap){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat)))){
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector((function (){var G__20658 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.v) : cljs.core.deref.call(null,self__.v));
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20658) : cljs.core.atom.call(null,G__20658));
})(),self__.hashcode,self__.cnt,(function (){var G__20659 = cljs.core.with_meta((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat)),metamap);
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20659) : cljs.core.atom.call(null,G__20659));
})()));
} else {
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector((function (){var G__20660 = cljs.core.with_meta((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.v) : cljs.core.deref.call(null,self__.v)),metamap);
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20660) : cljs.core.atom.call(null,G__20660));
})(),self__.hashcode,self__.cnt,(function (){var G__20661 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flat) : cljs.core.deref.call(null,self__.flat));
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20661) : cljs.core.atom.call(null,G__20661));
})()));
}
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ICollection$_conj$arity$2 = (function (self,obj){
var self__ = this;
var self__$1 = this;
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(instaparse.auto_flatten_seq.get_vec(self__$1),obj);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.call = (function() {
var G__20662 = null;
var G__20662__2 = (function (self__,arg){
var self__ = this;
var self____$1 = this;
var self = self____$1;
return self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(null).cljs$core$IFn$_invoke$arity$2(null,arg);
});
var G__20662__3 = (function (self__,arg,not_found){
var self__ = this;
var self____$1 = this;
var self = self____$1;
return self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(null).cljs$core$IFn$_invoke$arity$3(null,arg,not_found);
});
G__20662 = function(self__,arg,not_found){
switch(arguments.length){
case 2:
return G__20662__2.call(this,self__,arg);
case 3:
return G__20662__3.call(this,self__,arg,not_found);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__20662.cljs$core$IFn$_invoke$arity$2 = G__20662__2;
G__20662.cljs$core$IFn$_invoke$arity$3 = G__20662__3;
return G__20662;
})()
;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.apply = (function (self__,args20657){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args20657)));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IFn$_invoke$arity$1 = (function (arg){
var self__ = this;
var self = this;
return self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(null).cljs$core$IFn$_invoke$arity$2(null,arg);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IFn$_invoke$arity$2 = (function (arg,not_found){
var self__ = this;
var self = this;
return self.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1(null).cljs$core$IFn$_invoke$arity$3(null,arg,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IComparable$_compare$arity$2 = (function (self,that){
var self__ = this;
var self__$1 = this;
return cljs.core._compare(instaparse.auto_flatten_seq.get_vec(self__$1),that);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$v,cljs.core.with_meta(cljs.core.cst$sym$hashcode,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$number], null)),cljs.core.with_meta(cljs.core.cst$sym$cnt,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$number], null)),cljs.core.cst$sym$flat], null);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$type = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$ctorStr = "instaparse.auto-flatten-seq/FlattenOnDemandVector";

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"instaparse.auto-flatten-seq/FlattenOnDemandVector");
});

instaparse.auto_flatten_seq.__GT_FlattenOnDemandVector = (function instaparse$auto_flatten_seq$__GT_FlattenOnDemandVector(v,hashcode,cnt,flat){
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector(v,hashcode,cnt,flat));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (v,writer,opts){
var v__$1 = this;
return cljs.core._pr_writer(instaparse.auto_flatten_seq.get_vec(v__$1),writer,opts);
});
instaparse.auto_flatten_seq.convert_afs_to_vec = (function instaparse$auto_flatten_seq$convert_afs_to_vec(afs){
if(cljs.core.truth_(afs.dirty)){
if(cljs.core.truth_(afs.instaparse$auto_flatten_seq$ConjFlat$cached_QMARK_$arity$1(null))){
return cljs.core.vec(cljs.core.seq(afs));
} else {
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector((function (){var G__20664 = afs.v;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__20664) : cljs.core.atom.call(null,G__20664));
})(),afs.hashcode,afs.cnt,(cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null) : cljs.core.atom.call(null,null))));
}
} else {
return afs.v;

}
});
