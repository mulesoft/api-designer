// Compiled by ClojureScript 1.9.14 {}
goog.provide('instaparse.auto_flatten_seq');
goog.require('cljs.core');
instaparse.auto_flatten_seq.threshold = (32);
/**
 * Returns the partially calculated hash code, still requires a call to mix-collection-hash
 */
instaparse.auto_flatten_seq.hash_ordered_coll_without_mix = (function instaparse$auto_flatten_seq$hash_ordered_coll_without_mix(var_args){
var args15860 = [];
var len__7291__auto___15863 = arguments.length;
var i__7292__auto___15864 = (0);
while(true){
if((i__7292__auto___15864 < len__7291__auto___15863)){
args15860.push((arguments[i__7292__auto___15864]));

var G__15865 = (i__7292__auto___15864 + (1));
i__7292__auto___15864 = G__15865;
continue;
} else {
}
break;
}

var G__15862 = args15860.length;
switch (G__15862) {
case 1:
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15860.length)].join('')));

}
});

instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$1 = (function (coll){
return instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.call(null,(1),coll);
});

instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.cljs$core$IFn$_invoke$arity$2 = (function (existing_unmixed_hash,coll){
var unmixed_hash = existing_unmixed_hash;
var coll__$1 = cljs.core.seq.call(null,coll);
while(true){
if(!((coll__$1 == null))){
var G__15867 = ((cljs.core.imul.call(null,(31),unmixed_hash) + cljs.core.hash.call(null,cljs.core.first.call(null,coll__$1))) | (0));
var G__15868 = cljs.core.next.call(null,coll__$1);
unmixed_hash = G__15867;
coll__$1 = G__15868;
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
return ((cljs.core.imul.call(null,(31),unmixed_hash) + cljs.core.hash.call(null,item)) | (0));
});
instaparse.auto_flatten_seq.expt = (function instaparse$auto_flatten_seq$expt(base,pow){
if((pow === (0))){
return (1);
} else {
var n = (pow | (0));
var y = ((1) | (0));
var z = (base | (0));
while(true){
var t = cljs.core.even_QMARK_.call(null,n);
var n__$1 = cljs.core.quot.call(null,n,(2));
if(t){
var G__15869 = n__$1;
var G__15870 = y;
var G__15871 = cljs.core.imul.call(null,z,z);
n = G__15869;
y = G__15870;
z = G__15871;
continue;
} else {
if((n__$1 === (0))){
return cljs.core.imul.call(null,z,y);
} else {
var G__15872 = n__$1;
var G__15873 = cljs.core.imul.call(null,z,y);
var G__15874 = cljs.core.imul.call(null,z,z);
n = G__15872;
y = G__15873;
z = G__15874;
continue;

}
}
break;
}
}
});
instaparse.auto_flatten_seq.hash_cat = (function instaparse$auto_flatten_seq$hash_cat(v1,v2){
var c = cljs.core.count.call(null,v2);
var e = (instaparse.auto_flatten_seq.expt.call(null,(31),c) | (0));
return ((cljs.core.imul.call(null,e,v1.premix_hashcode) | (0)) + (v2.premix_hashcode - e));
});
instaparse.auto_flatten_seq.delve = (function instaparse$auto_flatten_seq$delve(v,index){
var v__$1 = cljs.core.get_in.call(null,v,index);
var index__$1 = index;
while(true){
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_.call(null,v__$1))){
var G__15875 = cljs.core.get.call(null,v__$1,(0));
var G__15876 = cljs.core.conj.call(null,index__$1,(0));
v__$1 = G__15875;
index__$1 = G__15876;
continue;
} else {
return index__$1;
}
break;
}
});
instaparse.auto_flatten_seq.advance = (function instaparse$auto_flatten_seq$advance(v,index){
while(true){
if(cljs.core._EQ_.call(null,cljs.core.count.call(null,index),(1))){
if((cljs.core.peek.call(null,index) < (instaparse.auto_flatten_seq.true_count.call(null,v) - (1)))){
return instaparse.auto_flatten_seq.delve.call(null,v,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.peek.call(null,index) + (1))], null));
} else {
return null;
}
} else {
if((cljs.core.peek.call(null,index) < (instaparse.auto_flatten_seq.true_count.call(null,cljs.core.get_in.call(null,v,cljs.core.pop.call(null,index))) - (1)))){
return instaparse.auto_flatten_seq.delve.call(null,v,cljs.core.conj.call(null,cljs.core.pop.call(null,index),(cljs.core.peek.call(null,index) + (1))));
} else {
var G__15877 = v;
var G__15878 = cljs.core.pop.call(null,index);
v = G__15877;
index = G__15878;
continue;

}
}
break;
}
});
instaparse.auto_flatten_seq.flat_seq = (function instaparse$auto_flatten_seq$flat_seq(var_args){
var args15879 = [];
var len__7291__auto___15882 = arguments.length;
var i__7292__auto___15883 = (0);
while(true){
if((i__7292__auto___15883 < len__7291__auto___15882)){
args15879.push((arguments[i__7292__auto___15883]));

var G__15884 = (i__7292__auto___15883 + (1));
i__7292__auto___15883 = G__15884;
continue;
} else {
}
break;
}

var G__15881 = args15879.length;
switch (G__15881) {
case 1:
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args15879.length)].join('')));

}
});

instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$1 = (function (v){
if((cljs.core.count.call(null,v) > (0))){
return instaparse.auto_flatten_seq.flat_seq.call(null,v,instaparse.auto_flatten_seq.delve.call(null,v,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(0)], null)));
} else {
return null;
}
});

instaparse.auto_flatten_seq.flat_seq.cljs$core$IFn$_invoke$arity$2 = (function (v,index){
return (new cljs.core.LazySeq(null,(function (){
return cljs.core.cons.call(null,cljs.core.get_in.call(null,v,index),(function (){var temp__4657__auto__ = instaparse.auto_flatten_seq.advance.call(null,v,index);
if(cljs.core.truth_(temp__4657__auto__)){
var next_index = temp__4657__auto__;
return instaparse.auto_flatten_seq.flat_seq.call(null,v,next_index);
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
return m__6880__auto__.call(null,self,obj);
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.conj_flat["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,self,obj);
} else {
throw cljs.core.missing_protocol.call(null,"ConjFlat.conj-flat",self);
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
return m__6880__auto__.call(null,self);
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.cached_QMARK_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,self);
} else {
throw cljs.core.missing_protocol.call(null,"ConjFlat.cached?",self);
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
return cljs.core.pr_str_STAR_.call(null,cljs.core.seq.call(null,self));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (self,key){
var self__ = this;
var self__$1 = this;
return cljs.core._lookup.call(null,self__.v,key);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (self,key,not_found){
var self__ = this;
var self__$1 = this;
return cljs.core._lookup.call(null,self__.v,key,not_found);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.meta.call(null,self__.v);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$INext$_next$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.next.call(null,cljs.core.seq.call(null,self__$1));
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
return (cljs.core._EQ_.call(null,self__.hashcode,cljs.core.hash.call(null,other))) && (cljs.core._EQ_.call(null,self__.cnt,cljs.core.count.call(null,other))) && ((cljs.core._EQ_.call(null,self__.cnt,(0))) || (cljs.core._EQ_.call(null,cljs.core.seq.call(null,self__$1),other)));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.with_meta.call(null,instaparse.auto_flatten_seq.EMPTY,cljs.core.meta.call(null,self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.first.call(null,cljs.core.seq.call(null,self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.rest.call(null,cljs.core.seq.call(null,self__$1));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_(self__.cached_seq)){
return self__.cached_seq;
} else {
self__.cached_seq = ((self__.dirty)?instaparse.auto_flatten_seq.flat_seq.call(null,self__.v):cljs.core.seq.call(null,self__.v));

return self__.cached_seq;
}
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (self,metamap){
var self__ = this;
var self__$1 = this;
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.with_meta.call(null,self__.v,metamap),self__.premix_hashcode,self__.hashcode,self__.cnt,self__.dirty,null));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (self,o){
var self__ = this;
var self__$1 = this;
return cljs.core.cons.call(null,o,self__$1);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$ = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$conj_flat$arity$2 = (function (self,obj){
var self__ = this;
var self__$1 = this;
if((obj == null)){
return self__$1;
} else {
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_.call(null,obj))){
if((self__.cnt === (0))){
return obj;
} else {
if((cljs.core.count.call(null,obj) <= instaparse.auto_flatten_seq.threshold)){
var phc = instaparse.auto_flatten_seq.hash_cat.call(null,self__$1,obj);
var new_cnt = (self__.cnt + cljs.core.count.call(null,obj));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.into.call(null,self__.v,obj),phc,cljs.core.mix_collection_hash.call(null,phc,new_cnt),new_cnt,(function (){var or__6216__auto__ = self__.dirty;
if(or__6216__auto__){
return or__6216__auto__;
} else {
return obj.dirty;
}
})(),null));
} else {
var phc = instaparse.auto_flatten_seq.hash_cat.call(null,self__$1,obj);
var new_cnt = (self__.cnt + cljs.core.count.call(null,obj));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.conj.call(null,self__.v,obj),phc,cljs.core.mix_collection_hash.call(null,phc,new_cnt),new_cnt,true,null));

}
}
} else {
var phc = instaparse.auto_flatten_seq.hash_conj.call(null,self__.premix_hashcode,obj);
var new_cnt = (self__.cnt + (1));
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(cljs.core.conj.call(null,self__.v,obj),phc,cljs.core.mix_collection_hash.call(null,phc,new_cnt),new_cnt,self__.dirty,null));

}
}
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.instaparse$auto_flatten_seq$ConjFlat$cached_QMARK_$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return self__.cached_seq;
});

instaparse.auto_flatten_seq.AutoFlattenSeq.getBasis = (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"v","v",1661996586,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"PersistentVector","PersistentVector",-837570443,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"premix-hashcode","premix-hashcode",-1918840795,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"hashcode","hashcode",1350412446,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"dirty","dirty",-1924882488,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"boolean","boolean",-278886877,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"cached-seq","cached-seq",1369780142,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"ISeq","ISeq",1517365813,null),new cljs.core.Keyword(null,"unsynchronized-mutable","unsynchronized-mutable",-164143950),true], null))], null);
});

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$type = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$ctorStr = "instaparse.auto-flatten-seq/AutoFlattenSeq";

instaparse.auto_flatten_seq.AutoFlattenSeq.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"instaparse.auto-flatten-seq/AutoFlattenSeq");
});

instaparse.auto_flatten_seq.__GT_AutoFlattenSeq = (function instaparse$auto_flatten_seq$__GT_AutoFlattenSeq(v,premix_hashcode,hashcode,cnt,dirty,cached_seq){
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(v,premix_hashcode,hashcode,cnt,dirty,cached_seq));
});

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.auto_flatten_seq.AutoFlattenSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (afs,writer,opts){
var afs__$1 = this;
return cljs.core._pr_writer.call(null,cljs.core.seq.call(null,afs__$1),writer,opts);
});
instaparse.auto_flatten_seq.auto_flatten_seq = (function instaparse$auto_flatten_seq$auto_flatten_seq(v){
var v__$1 = cljs.core.vec.call(null,v);
var c = cljs.core.count.call(null,v__$1);
var unmixed_hash = instaparse.auto_flatten_seq.hash_ordered_coll_without_mix.call(null,v__$1);
return (new instaparse.auto_flatten_seq.AutoFlattenSeq(v__$1,unmixed_hash,cljs.core.mix_collection_hash.call(null,unmixed_hash,c),c,false,null));
});
instaparse.auto_flatten_seq.EMPTY = instaparse.auto_flatten_seq.auto_flatten_seq.call(null,cljs.core.PersistentVector.EMPTY);
instaparse.auto_flatten_seq.afs_QMARK_ = (function instaparse$auto_flatten_seq$afs_QMARK_(s){
return (s instanceof instaparse.auto_flatten_seq.AutoFlattenSeq);
});
instaparse.auto_flatten_seq.true_count = (function instaparse$auto_flatten_seq$true_count(v){
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_.call(null,v))){
return cljs.core.count.call(null,v.v);
} else {
return cljs.core.count.call(null,v);
}
});
instaparse.auto_flatten_seq.flat_vec_helper = (function instaparse$auto_flatten_seq$flat_vec_helper(acc,v){
while(true){
var temp__4655__auto__ = cljs.core.seq.call(null,v);
if(temp__4655__auto__){
var s = temp__4655__auto__;
var fst = cljs.core.first.call(null,v);
if(cljs.core.truth_(instaparse.auto_flatten_seq.afs_QMARK_.call(null,fst))){
var G__15886 = instaparse$auto_flatten_seq$flat_vec_helper.call(null,acc,fst);
var G__15887 = cljs.core.next.call(null,v);
acc = G__15886;
v = G__15887;
continue;
} else {
var G__15888 = cljs.core.conj_BANG_.call(null,acc,fst);
var G__15889 = cljs.core.next.call(null,v);
acc = G__15888;
v = G__15889;
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
return cljs.core.persistent_BANG_.call(null,instaparse.auto_flatten_seq.flat_vec_helper.call(null,cljs.core.transient$.call(null,cljs.core.PersistentVector.EMPTY),v));
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
return m__6880__auto__.call(null,self);
} else {
var m__6880__auto____$1 = (instaparse.auto_flatten_seq.get_vec["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,self);
} else {
throw cljs.core.missing_protocol.call(null,"GetVec.get-vec",self);
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
return cljs.core.pr_str_STAR_.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (self,key){
var self__ = this;
var self__$1 = this;
return cljs.core._lookup.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),key);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (self,key,not_found){
var self__ = this;
var self__$1 = this;
return cljs.core._lookup.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),key,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.instaparse$auto_flatten_seq$GetVec$ = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.instaparse$auto_flatten_seq$GetVec$get_vec$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.not.call(null,cljs.core.deref.call(null,self__.flat))){
cljs.core.swap_BANG_.call(null,self__.flat,((function (self__$1){
return (function (_){
return cljs.core.with_meta.call(null,instaparse.auto_flatten_seq.flat_vec.call(null,cljs.core.deref.call(null,self__.v)),cljs.core.meta.call(null,cljs.core.deref.call(null,self__.v)));
});})(self__$1))
);

cljs.core.swap_BANG_.call(null,self__.v,((function (self__$1){
return (function (_){
return null;
});})(self__$1))
);
} else {
}

return cljs.core.deref.call(null,self__.flat);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (self,f,init){
var self__ = this;
var self__$1 = this;
return cljs.core._kv_reduce.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),f,init);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (self,i){
var self__ = this;
var self__$1 = this;
return cljs.core._nth.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),i);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (self,i,not_found){
var self__ = this;
var self__$1 = this;
return cljs.core._nth.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),i,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (self,i,val){
var self__ = this;
var self__$1 = this;
return cljs.core._assoc_n.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),i,val);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IMeta$_meta$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_(cljs.core.deref.call(null,self__.flat))){
return cljs.core.meta.call(null,cljs.core.deref.call(null,self__.flat));
} else {
return cljs.core.meta.call(null,cljs.core.deref.call(null,self__.v));
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
return cljs.core._peek.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IStack$_pop$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core._pop.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IReversible$_rseq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
if((self__.cnt > (0))){
return cljs.core.rseq.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1));
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
return (cljs.core._EQ_.call(null,self__.hashcode,cljs.core.hash.call(null,other))) && (cljs.core._EQ_.call(null,self__.cnt,cljs.core.count.call(null,other))) && (cljs.core._EQ_.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),other));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentVector.EMPTY,cljs.core.meta.call(null,self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (self,i,val){
var self__ = this;
var self__$1 = this;
return cljs.core.assoc.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),i,val);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (self,k){
var self__ = this;
var self__$1 = this;
return cljs.core._contains_key_QMARK_.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),k);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (self){
var self__ = this;
var self__$1 = this;
return cljs.core.seq.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (self,metamap){
var self__ = this;
var self__$1 = this;
if(cljs.core.truth_(cljs.core.deref.call(null,self__.flat))){
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector(cljs.core.atom.call(null,cljs.core.deref.call(null,self__.v)),self__.hashcode,self__.cnt,cljs.core.atom.call(null,cljs.core.with_meta.call(null,cljs.core.deref.call(null,self__.flat),metamap))));
} else {
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector(cljs.core.atom.call(null,cljs.core.with_meta.call(null,cljs.core.deref.call(null,self__.v),metamap)),self__.hashcode,self__.cnt,cljs.core.atom.call(null,cljs.core.deref.call(null,self__.flat))));
}
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$ICollection$_conj$arity$2 = (function (self,obj){
var self__ = this;
var self__$1 = this;
return cljs.core.conj.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),obj);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.call = (function() {
var G__15891 = null;
var G__15891__2 = (function (self__,arg){
var self__ = this;
var self____$1 = this;
var self = self____$1;
return cljs.core._invoke.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self),arg);
});
var G__15891__3 = (function (self__,arg,not_found){
var self__ = this;
var self____$1 = this;
var self = self____$1;
return cljs.core._invoke.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self),arg,not_found);
});
G__15891 = function(self__,arg,not_found){
switch(arguments.length){
case 2:
return G__15891__2.call(this,self__,arg);
case 3:
return G__15891__3.call(this,self__,arg,not_found);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
G__15891.cljs$core$IFn$_invoke$arity$2 = G__15891__2;
G__15891.cljs$core$IFn$_invoke$arity$3 = G__15891__3;
return G__15891;
})()
;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.apply = (function (self__,args15890){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone.call(null,args15890)));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IFn$_invoke$arity$1 = (function (arg){
var self__ = this;
var self = this;
return cljs.core._invoke.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self),arg);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IFn$_invoke$arity$2 = (function (arg,not_found){
var self__ = this;
var self = this;
return cljs.core._invoke.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self),arg,not_found);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IComparable$_compare$arity$2 = (function (self,that){
var self__ = this;
var self__$1 = this;
return cljs.core._compare.call(null,instaparse.auto_flatten_seq.get_vec.call(null,self__$1),that);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"v","v",1661996586,null),cljs.core.with_meta(new cljs.core.Symbol(null,"hashcode","hashcode",1350412446,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),cljs.core.with_meta(new cljs.core.Symbol(null,"cnt","cnt",1924510325,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"number","number",-1084057331,null)], null)),new cljs.core.Symbol(null,"flat","flat",-2076841507,null)], null);
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$type = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$ctorStr = "instaparse.auto-flatten-seq/FlattenOnDemandVector";

instaparse.auto_flatten_seq.FlattenOnDemandVector.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"instaparse.auto-flatten-seq/FlattenOnDemandVector");
});

instaparse.auto_flatten_seq.__GT_FlattenOnDemandVector = (function instaparse$auto_flatten_seq$__GT_FlattenOnDemandVector(v,hashcode,cnt,flat){
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector(v,hashcode,cnt,flat));
});

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IPrintWithWriter$ = true;

instaparse.auto_flatten_seq.FlattenOnDemandVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (v,writer,opts){
var v__$1 = this;
return cljs.core._pr_writer.call(null,instaparse.auto_flatten_seq.get_vec.call(null,v__$1),writer,opts);
});
instaparse.auto_flatten_seq.convert_afs_to_vec = (function instaparse$auto_flatten_seq$convert_afs_to_vec(afs){
if(cljs.core.truth_(afs.dirty)){
if(cljs.core.truth_(instaparse.auto_flatten_seq.cached_QMARK_.call(null,afs))){
return cljs.core.vec.call(null,cljs.core.seq.call(null,afs));
} else {
return (new instaparse.auto_flatten_seq.FlattenOnDemandVector(cljs.core.atom.call(null,afs.v),afs.hashcode,afs.cnt,cljs.core.atom.call(null,null)));
}
} else {
return afs.v;

}
});

//# sourceMappingURL=auto_flatten_seq.js.map?rel=1480936804603