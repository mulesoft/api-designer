// Compiled by ClojureScript 1.9.14 {:static-fns true, :optimize-constants true}
goog.provide('cljs.core.async');
goog.require('cljs.core');
goog.require('cljs.core.async.impl.channels');
goog.require('cljs.core.async.impl.dispatch');
goog.require('cljs.core.async.impl.ioc_helpers');
goog.require('cljs.core.async.impl.protocols');
goog.require('cljs.core.async.impl.buffers');
goog.require('cljs.core.async.impl.timers');
cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var args22835 = [];
var len__7291__auto___22841 = arguments.length;
var i__7292__auto___22842 = (0);
while(true){
if((i__7292__auto___22842 < len__7291__auto___22841)){
args22835.push((arguments[i__7292__auto___22842]));

var G__22843 = (i__7292__auto___22842 + (1));
i__7292__auto___22842 = G__22843;
continue;
} else {
}
break;
}

var G__22837 = args22835.length;
switch (G__22837) {
case 1:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22835.length)].join('')));

}
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1 = (function (f){
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(f,true);
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2 = (function (f,blockable){
if(typeof cljs.core.async.t_cljs$core$async22838 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async22838 = (function (f,blockable,meta22839){
this.f = f;
this.blockable = blockable;
this.meta22839 = meta22839;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_22840,meta22839__$1){
var self__ = this;
var _22840__$1 = this;
return (new cljs.core.async.t_cljs$core$async22838(self__.f,self__.blockable,meta22839__$1));
});

cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_22840){
var self__ = this;
var _22840__$1 = this;
return self__.meta22839;
});

cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
});

cljs.core.async.t_cljs$core$async22838.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
});

cljs.core.async.t_cljs$core$async22838.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$f,cljs.core.cst$sym$blockable,cljs.core.cst$sym$meta22839], null);
});

cljs.core.async.t_cljs$core$async22838.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async22838.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async22838";

cljs.core.async.t_cljs$core$async22838.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async22838");
});

cljs.core.async.__GT_t_cljs$core$async22838 = (function cljs$core$async$__GT_t_cljs$core$async22838(f__$1,blockable__$1,meta22839){
return (new cljs.core.async.t_cljs$core$async22838(f__$1,blockable__$1,meta22839));
});

}

return (new cljs.core.async.t_cljs$core$async22838(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
});

cljs.core.async.fn_handler.cljs$lang$maxFixedArity = 2;
/**
 * Returns a fixed buffer of size n. When full, puts will block/park.
 */
cljs.core.async.buffer = (function cljs$core$async$buffer(n){
return cljs.core.async.impl.buffers.fixed_buffer(n);
});
/**
 * Returns a buffer of size n. When full, puts will complete but
 *   val will be dropped (no transfer).
 */
cljs.core.async.dropping_buffer = (function cljs$core$async$dropping_buffer(n){
return cljs.core.async.impl.buffers.dropping_buffer(n);
});
/**
 * Returns a buffer of size n. When full, puts will complete, and be
 *   buffered, but oldest elements in buffer will be dropped (not
 *   transferred).
 */
cljs.core.async.sliding_buffer = (function cljs$core$async$sliding_buffer(n){
return cljs.core.async.impl.buffers.sliding_buffer(n);
});
/**
 * Returns true if a channel created with buff will never block. That is to say,
 * puts into this buffer will never cause the buffer to be full. 
 */
cljs.core.async.unblocking_buffer_QMARK_ = (function cljs$core$async$unblocking_buffer_QMARK_(buff){
if(!((buff == null))){
if((false) || (buff.cljs$core$async$impl$protocols$UnblockingBuffer$)){
return true;
} else {
if((!buff.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(cljs.core.async.impl.protocols.UnblockingBuffer,buff);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(cljs.core.async.impl.protocols.UnblockingBuffer,buff);
}
});
/**
 * Creates a channel with an optional buffer, an optional transducer (like (map f),
 *   (filter p) etc or a composition thereof), and an optional exception handler.
 *   If buf-or-n is a number, will create and use a fixed buffer of that size. If a
 *   transducer is supplied a buffer must be specified. ex-handler must be a
 *   fn of one argument - if an exception occurs during transformation it will be called
 *   with the thrown value as an argument, and any non-nil return value will be placed
 *   in the channel.
 */
cljs.core.async.chan = (function cljs$core$async$chan(var_args){
var args22847 = [];
var len__7291__auto___22850 = arguments.length;
var i__7292__auto___22851 = (0);
while(true){
if((i__7292__auto___22851 < len__7291__auto___22850)){
args22847.push((arguments[i__7292__auto___22851]));

var G__22852 = (i__7292__auto___22851 + (1));
i__7292__auto___22851 = G__22852;
continue;
} else {
}
break;
}

var G__22849 = args22847.length;
switch (G__22849) {
case 0:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22847.length)].join('')));

}
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1 = (function (buf_or_n){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(buf_or_n,null,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2 = (function (buf_or_n,xform){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(buf_or_n,xform,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3 = (function (buf_or_n,xform,ex_handler){
var buf_or_n__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(buf_or_n,(0)))?null:buf_or_n);
if(cljs.core.truth_(xform)){
if(cljs.core.truth_(buf_or_n__$1)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("buffer must be supplied when transducer is"),cljs.core.str("\n"),cljs.core.str("buf-or-n")].join('')));
}
} else {
}

return cljs.core.async.impl.channels.chan.cljs$core$IFn$_invoke$arity$3(((typeof buf_or_n__$1 === 'number')?cljs.core.async.buffer(buf_or_n__$1):buf_or_n__$1),xform,ex_handler);
});

cljs.core.async.chan.cljs$lang$maxFixedArity = 3;
/**
 * Creates a promise channel with an optional transducer, and an optional
 *   exception-handler. A promise channel can take exactly one value that consumers
 *   will receive. Once full, puts complete but val is dropped (no transfer).
 *   Consumers will block until either a value is placed in the channel or the
 *   channel is closed. See chan for the semantics of xform and ex-handler.
 */
cljs.core.async.promise_chan = (function cljs$core$async$promise_chan(var_args){
var args22854 = [];
var len__7291__auto___22857 = arguments.length;
var i__7292__auto___22858 = (0);
while(true){
if((i__7292__auto___22858 < len__7291__auto___22857)){
args22854.push((arguments[i__7292__auto___22858]));

var G__22859 = (i__7292__auto___22858 + (1));
i__7292__auto___22858 = G__22859;
continue;
} else {
}
break;
}

var G__22856 = args22854.length;
switch (G__22856) {
case 0:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22854.length)].join('')));

}
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1(null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1 = (function (xform){
return cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2(xform,null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2 = (function (xform,ex_handler){
return cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3(cljs.core.async.impl.buffers.promise_buffer(),xform,ex_handler);
});

cljs.core.async.promise_chan.cljs$lang$maxFixedArity = 2;
/**
 * Returns a channel that will close after msecs
 */
cljs.core.async.timeout = (function cljs$core$async$timeout(msecs){
return cljs.core.async.impl.timers.timeout(msecs);
});
/**
 * takes a val from port. Must be called inside a (go ...) block. Will
 *   return nil if closed. Will park if nothing is available.
 *   Returns true unless port is already closed
 */
cljs.core.async._LT__BANG_ = (function cljs$core$async$_LT__BANG_(port){
throw (new Error("<! used not in (go ...) block"));
});
/**
 * Asynchronously takes a val from port, passing to fn1. Will pass nil
 * if closed. If on-caller? (default true) is true, and value is
 * immediately available, will call fn1 on calling thread.
 * Returns nil.
 */
cljs.core.async.take_BANG_ = (function cljs$core$async$take_BANG_(var_args){
var args22861 = [];
var len__7291__auto___22864 = arguments.length;
var i__7292__auto___22865 = (0);
while(true){
if((i__7292__auto___22865 < len__7291__auto___22864)){
args22861.push((arguments[i__7292__auto___22865]));

var G__22866 = (i__7292__auto___22865 + (1));
i__7292__auto___22865 = G__22866;
continue;
} else {
}
break;
}

var G__22863 = args22861.length;
switch (G__22863) {
case 2:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22861.length)].join('')));

}
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,fn1){
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3(port,fn1,true);
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,fn1,on_caller_QMARK_){
var ret = cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(fn1));
if(cljs.core.truth_(ret)){
var val_22868 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
if(cljs.core.truth_(on_caller_QMARK_)){
(fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_22868) : fn1.call(null,val_22868));
} else {
cljs.core.async.impl.dispatch.run(((function (val_22868,ret){
return (function (){
return (fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(val_22868) : fn1.call(null,val_22868));
});})(val_22868,ret))
);
}
} else {
}

return null;
});

cljs.core.async.take_BANG_.cljs$lang$maxFixedArity = 3;
cljs.core.async.nop = (function cljs$core$async$nop(_){
return null;
});
cljs.core.async.fhnop = cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(cljs.core.async.nop);
/**
 * puts a val into port. nil values are not allowed. Must be called
 *   inside a (go ...) block. Will park if no buffer space is available.
 *   Returns true unless port is already closed.
 */
cljs.core.async._GT__BANG_ = (function cljs$core$async$_GT__BANG_(port,val){
throw (new Error(">! used not in (go ...) block"));
});
/**
 * Asynchronously puts a val into port, calling fn0 (if supplied) when
 * complete. nil values are not allowed. Will throw if closed. If
 * on-caller? (default true) is true, and the put is immediately
 * accepted, will call fn0 on calling thread.  Returns nil.
 */
cljs.core.async.put_BANG_ = (function cljs$core$async$put_BANG_(var_args){
var args22869 = [];
var len__7291__auto___22872 = arguments.length;
var i__7292__auto___22873 = (0);
while(true){
if((i__7292__auto___22873 < len__7291__auto___22872)){
args22869.push((arguments[i__7292__auto___22873]));

var G__22874 = (i__7292__auto___22873 + (1));
i__7292__auto___22873 = G__22874;
continue;
} else {
}
break;
}

var G__22871 = args22869.length;
switch (G__22871) {
case 2:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22869.length)].join('')));

}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,val){
var temp__4655__auto__ = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fhnop);
if(cljs.core.truth_(temp__4655__auto__)){
var ret = temp__4655__auto__;
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
} else {
return true;
}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,val,fn1){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4(port,val,fn1,true);
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (port,val,fn1,on_caller_QMARK_){
var temp__4655__auto__ = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1(fn1));
if(cljs.core.truth_(temp__4655__auto__)){
var retb = temp__4655__auto__;
var ret = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(retb) : cljs.core.deref.call(null,retb));
if(cljs.core.truth_(on_caller_QMARK_)){
(fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(ret) : fn1.call(null,ret));
} else {
cljs.core.async.impl.dispatch.run(((function (ret,retb,temp__4655__auto__){
return (function (){
return (fn1.cljs$core$IFn$_invoke$arity$1 ? fn1.cljs$core$IFn$_invoke$arity$1(ret) : fn1.call(null,ret));
});})(ret,retb,temp__4655__auto__))
);
}

return ret;
} else {
return true;
}
});

cljs.core.async.put_BANG_.cljs$lang$maxFixedArity = 4;
cljs.core.async.close_BANG_ = (function cljs$core$async$close_BANG_(port){
return cljs.core.async.impl.protocols.close_BANG_(port);
});
cljs.core.async.random_array = (function cljs$core$async$random_array(n){
var a = (new Array(n));
var n__7131__auto___22876 = n;
var x_22877 = (0);
while(true){
if((x_22877 < n__7131__auto___22876)){
(a[x_22877] = (0));

var G__22878 = (x_22877 + (1));
x_22877 = G__22878;
continue;
} else {
}
break;
}

var i = (1);
while(true){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(i,n)){
return a;
} else {
var j = cljs.core.rand_int(i);
(a[i] = (a[j]));

(a[j] = i);

var G__22879 = (i + (1));
i = G__22879;
continue;
}
break;
}
});
cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true) : cljs.core.atom.call(null,true));
if(typeof cljs.core.async.t_cljs$core$async22883 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async22883 = (function (alt_flag,flag,meta22884){
this.alt_flag = alt_flag;
this.flag = flag;
this.meta22884 = meta22884;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (flag){
return (function (_22885,meta22884__$1){
var self__ = this;
var _22885__$1 = this;
return (new cljs.core.async.t_cljs$core$async22883(self__.alt_flag,self__.flag,meta22884__$1));
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (flag){
return (function (_22885){
var self__ = this;
var _22885__$1 = this;
return self__.meta22884;
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.flag) : cljs.core.deref.call(null,self__.flag));
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(self__.flag,null) : cljs.core.reset_BANG_.call(null,self__.flag,null));

return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.getBasis = ((function (flag){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$alt_DASH_flag,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$private,true,cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(cljs.core.PersistentVector.EMPTY))], null)),cljs.core.cst$sym$flag,cljs.core.cst$sym$meta22884], null);
});})(flag))
;

cljs.core.async.t_cljs$core$async22883.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async22883.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async22883";

cljs.core.async.t_cljs$core$async22883.cljs$lang$ctorPrWriter = ((function (flag){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async22883");
});})(flag))
;

cljs.core.async.__GT_t_cljs$core$async22883 = ((function (flag){
return (function cljs$core$async$alt_flag_$___GT_t_cljs$core$async22883(alt_flag__$1,flag__$1,meta22884){
return (new cljs.core.async.t_cljs$core$async22883(alt_flag__$1,flag__$1,meta22884));
});})(flag))
;

}

return (new cljs.core.async.t_cljs$core$async22883(cljs$core$async$alt_flag,flag,cljs.core.PersistentArrayMap.EMPTY));
});
cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
if(typeof cljs.core.async.t_cljs$core$async22889 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async22889 = (function (alt_handler,flag,cb,meta22890){
this.alt_handler = alt_handler;
this.flag = flag;
this.cb = cb;
this.meta22890 = meta22890;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_22891,meta22890__$1){
var self__ = this;
var _22891__$1 = this;
return (new cljs.core.async.t_cljs$core$async22889(self__.alt_handler,self__.flag,self__.cb,meta22890__$1));
});

cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_22891){
var self__ = this;
var _22891__$1 = this;
return self__.meta22890;
});

cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.flag);
});

cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async22889.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit(self__.flag);

return self__.cb;
});

cljs.core.async.t_cljs$core$async22889.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$alt_DASH_handler,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$private,true,cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$flag,cljs.core.cst$sym$cb], null)))], null)),cljs.core.cst$sym$flag,cljs.core.cst$sym$cb,cljs.core.cst$sym$meta22890], null);
});

cljs.core.async.t_cljs$core$async22889.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async22889.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async22889";

cljs.core.async.t_cljs$core$async22889.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async22889");
});

cljs.core.async.__GT_t_cljs$core$async22889 = (function cljs$core$async$alt_handler_$___GT_t_cljs$core$async22889(alt_handler__$1,flag__$1,cb__$1,meta22890){
return (new cljs.core.async.t_cljs$core$async22889(alt_handler__$1,flag__$1,cb__$1,meta22890));
});

}

return (new cljs.core.async.t_cljs$core$async22889(cljs$core$async$alt_handler,flag,cb,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * returns derefable [val port] if immediate, nil if enqueued
 */
cljs.core.async.do_alts = (function cljs$core$async$do_alts(fret,ports,opts){
var flag = cljs.core.async.alt_flag();
var n = cljs.core.count(ports);
var idxs = cljs.core.async.random_array(n);
var priority = cljs.core.cst$kw$priority.cljs$core$IFn$_invoke$arity$1(opts);
var ret = (function (){var i = (0);
while(true){
if((i < n)){
var idx = (cljs.core.truth_(priority)?i:(idxs[i]));
var port = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(ports,idx);
var wport = ((cljs.core.vector_QMARK_(port))?(port.cljs$core$IFn$_invoke$arity$1 ? port.cljs$core$IFn$_invoke$arity$1((0)) : port.call(null,(0))):null);
var vbox = (cljs.core.truth_(wport)?(function (){var val = (port.cljs$core$IFn$_invoke$arity$1 ? port.cljs$core$IFn$_invoke$arity$1((1)) : port.call(null,(1)));
return cljs.core.async.impl.protocols.put_BANG_(wport,val,cljs.core.async.alt_handler(flag,((function (i,val,idx,port,wport,flag,n,idxs,priority){
return (function (p1__22892_SHARP_){
var G__22896 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__22892_SHARP_,wport], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__22896) : fret.call(null,G__22896));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.alt_handler(flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__22893_SHARP_){
var G__22897 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__22893_SHARP_,port], null);
return (fret.cljs$core$IFn$_invoke$arity$1 ? fret.cljs$core$IFn$_invoke$arity$1(G__22897) : fret.call(null,G__22897));
});})(i,idx,port,wport,flag,n,idxs,priority))
)));
if(cljs.core.truth_(vbox)){
return cljs.core.async.impl.channels.box(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(vbox) : cljs.core.deref.call(null,vbox)),(function (){var or__6216__auto__ = wport;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return port;
}
})()], null));
} else {
var G__22898 = (i + (1));
i = G__22898;
continue;
}
} else {
return null;
}
break;
}
})();
var or__6216__auto__ = ret;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
if(cljs.core.contains_QMARK_(opts,cljs.core.cst$kw$default)){
var temp__4657__auto__ = (function (){var and__6204__auto__ = cljs.core.async.impl.protocols.active_QMARK_(flag);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.async.impl.protocols.commit(flag);
} else {
return and__6204__auto__;
}
})();
if(cljs.core.truth_(temp__4657__auto__)){
var got = temp__4657__auto__;
return cljs.core.async.impl.channels.box(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$kw$default.cljs$core$IFn$_invoke$arity$1(opts),cljs.core.cst$kw$default], null));
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Completes at most one of several channel operations. Must be called
 * inside a (go ...) block. ports is a vector of channel endpoints,
 * which can be either a channel to take from or a vector of
 *   [channel-to-put-to val-to-put], in any combination. Takes will be
 *   made as if by <!, and puts will be made as if by >!. Unless
 *   the :priority option is true, if more than one port operation is
 *   ready a non-deterministic choice will be made. If no operation is
 *   ready and a :default value is supplied, [default-val :default] will
 *   be returned, otherwise alts! will park until the first operation to
 *   become ready completes. Returns [val port] of the completed
 *   operation, where val is the value taken for takes, and a
 *   boolean (true unless already closed, as per put!) for puts.
 * 
 *   opts are passed as :key val ... Supported options:
 * 
 *   :default val - the value to use if none of the operations are immediately ready
 *   :priority true - (default nil) when true, the operations will be tried in order.
 * 
 *   Note: there is no guarantee that the port exps or val exprs will be
 *   used, nor in what order should they be, so they should not be
 *   depended upon for side effects.
 */
cljs.core.async.alts_BANG_ = (function cljs$core$async$alts_BANG_(var_args){
var args__7298__auto__ = [];
var len__7291__auto___22904 = arguments.length;
var i__7292__auto___22905 = (0);
while(true){
if((i__7292__auto___22905 < len__7291__auto___22904)){
args__7298__auto__.push((arguments[i__7292__auto___22905]));

var G__22906 = (i__7292__auto___22905 + (1));
i__7292__auto___22905 = G__22906;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((1) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((1)),(0),null)):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7299__auto__);
});

cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__22901){
var map__22902 = p__22901;
var map__22902__$1 = ((((!((map__22902 == null)))?((((map__22902.cljs$lang$protocol_mask$partition0$ & (64))) || (map__22902.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__22902):map__22902);
var opts = map__22902__$1;
throw (new Error("alts! used not in (go ...) block"));
});

cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1);

cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq22899){
var G__22900 = cljs.core.first(seq22899);
var seq22899__$1 = cljs.core.next(seq22899);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__22900,seq22899__$1);
});
/**
 * Puts a val into port if it's possible to do so immediately.
 *   nil values are not allowed. Never blocks. Returns true if offer succeeds.
 */
cljs.core.async.offer_BANG_ = (function cljs$core$async$offer_BANG_(port,val){
var ret = cljs.core.async.impl.protocols.put_BANG_(port,val,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
} else {
return null;
}
});
/**
 * Takes a val from port if it's possible to do so immediately.
 *   Never blocks. Returns value if successful, nil otherwise.
 */
cljs.core.async.poll_BANG_ = (function cljs$core$async$poll_BANG_(port){
var ret = cljs.core.async.impl.protocols.take_BANG_(port,cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2(cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
} else {
return null;
}
});
/**
 * Takes elements from the from channel and supplies them to the to
 * channel. By default, the to channel will be closed when the from
 * channel closes, but can be determined by the close?  parameter. Will
 * stop consuming the from channel if the to channel closes
 */
cljs.core.async.pipe = (function cljs$core$async$pipe(var_args){
var args22907 = [];
var len__7291__auto___22957 = arguments.length;
var i__7292__auto___22958 = (0);
while(true){
if((i__7292__auto___22958 < len__7291__auto___22957)){
args22907.push((arguments[i__7292__auto___22958]));

var G__22959 = (i__7292__auto___22958 + (1));
i__7292__auto___22958 = G__22959;
continue;
} else {
}
break;
}

var G__22909 = args22907.length;
switch (G__22909) {
case 2:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args22907.length)].join('')));

}
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2 = (function (from,to){
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3(from,to,true);
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3 = (function (from,to,close_QMARK_){
var c__22790__auto___22961 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___22961){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___22961){
return (function (state_22933){
var state_val_22934 = (state_22933[(1)]);
if((state_val_22934 === (7))){
var inst_22929 = (state_22933[(2)]);
var state_22933__$1 = state_22933;
var statearr_22935_22962 = state_22933__$1;
(statearr_22935_22962[(2)] = inst_22929);

(statearr_22935_22962[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (1))){
var state_22933__$1 = state_22933;
var statearr_22936_22963 = state_22933__$1;
(statearr_22936_22963[(2)] = null);

(statearr_22936_22963[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (4))){
var inst_22912 = (state_22933[(7)]);
var inst_22912__$1 = (state_22933[(2)]);
var inst_22913 = (inst_22912__$1 == null);
var state_22933__$1 = (function (){var statearr_22937 = state_22933;
(statearr_22937[(7)] = inst_22912__$1);

return statearr_22937;
})();
if(cljs.core.truth_(inst_22913)){
var statearr_22938_22964 = state_22933__$1;
(statearr_22938_22964[(1)] = (5));

} else {
var statearr_22939_22965 = state_22933__$1;
(statearr_22939_22965[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (13))){
var state_22933__$1 = state_22933;
var statearr_22940_22966 = state_22933__$1;
(statearr_22940_22966[(2)] = null);

(statearr_22940_22966[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (6))){
var inst_22912 = (state_22933[(7)]);
var state_22933__$1 = state_22933;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_22933__$1,(11),to,inst_22912);
} else {
if((state_val_22934 === (3))){
var inst_22931 = (state_22933[(2)]);
var state_22933__$1 = state_22933;
return cljs.core.async.impl.ioc_helpers.return_chan(state_22933__$1,inst_22931);
} else {
if((state_val_22934 === (12))){
var state_22933__$1 = state_22933;
var statearr_22941_22967 = state_22933__$1;
(statearr_22941_22967[(2)] = null);

(statearr_22941_22967[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (2))){
var state_22933__$1 = state_22933;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_22933__$1,(4),from);
} else {
if((state_val_22934 === (11))){
var inst_22922 = (state_22933[(2)]);
var state_22933__$1 = state_22933;
if(cljs.core.truth_(inst_22922)){
var statearr_22942_22968 = state_22933__$1;
(statearr_22942_22968[(1)] = (12));

} else {
var statearr_22943_22969 = state_22933__$1;
(statearr_22943_22969[(1)] = (13));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (9))){
var state_22933__$1 = state_22933;
var statearr_22944_22970 = state_22933__$1;
(statearr_22944_22970[(2)] = null);

(statearr_22944_22970[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (5))){
var state_22933__$1 = state_22933;
if(cljs.core.truth_(close_QMARK_)){
var statearr_22945_22971 = state_22933__$1;
(statearr_22945_22971[(1)] = (8));

} else {
var statearr_22946_22972 = state_22933__$1;
(statearr_22946_22972[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (14))){
var inst_22927 = (state_22933[(2)]);
var state_22933__$1 = state_22933;
var statearr_22947_22973 = state_22933__$1;
(statearr_22947_22973[(2)] = inst_22927);

(statearr_22947_22973[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (10))){
var inst_22919 = (state_22933[(2)]);
var state_22933__$1 = state_22933;
var statearr_22948_22974 = state_22933__$1;
(statearr_22948_22974[(2)] = inst_22919);

(statearr_22948_22974[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_22934 === (8))){
var inst_22916 = cljs.core.async.close_BANG_(to);
var state_22933__$1 = state_22933;
var statearr_22949_22975 = state_22933__$1;
(statearr_22949_22975[(2)] = inst_22916);

(statearr_22949_22975[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___22961))
;
return ((function (switch__22676__auto__,c__22790__auto___22961){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_22953 = [null,null,null,null,null,null,null,null];
(statearr_22953[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_22953[(1)] = (1));

return statearr_22953;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_22933){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_22933);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e22954){if((e22954 instanceof Object)){
var ex__22680__auto__ = e22954;
var statearr_22955_22976 = state_22933;
(statearr_22955_22976[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_22933);

return cljs.core.cst$kw$recur;
} else {
throw e22954;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__22977 = state_22933;
state_22933 = G__22977;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_22933){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_22933);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___22961))
})();
var state__22792__auto__ = (function (){var statearr_22956 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_22956[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___22961);

return statearr_22956;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___22961))
);


return to;
});

cljs.core.async.pipe.cljs$lang$maxFixedArity = 3;
cljs.core.async.pipeline_STAR_ = (function cljs$core$async$pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,type){
if((n > (0))){
} else {
throw (new Error("Assert failed: (pos? n)"));
}

var jobs = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(n);
var results = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(n);
var process = ((function (jobs,results){
return (function (p__23161){
var vec__23162 = p__23161;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23162,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23162,(1),null);
var job = vec__23162;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3((1),xf,ex_handler);
var c__22790__auto___23344 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results){
return (function (state_23167){
var state_val_23168 = (state_23167[(1)]);
if((state_val_23168 === (1))){
var state_23167__$1 = state_23167;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23167__$1,(2),res,v);
} else {
if((state_val_23168 === (2))){
var inst_23164 = (state_23167[(2)]);
var inst_23165 = cljs.core.async.close_BANG_(res);
var state_23167__$1 = (function (){var statearr_23169 = state_23167;
(statearr_23169[(7)] = inst_23164);

return statearr_23169;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_23167__$1,inst_23165);
} else {
return null;
}
}
});})(c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results))
;
return ((function (switch__22676__auto__,c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_23173 = [null,null,null,null,null,null,null,null];
(statearr_23173[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__);

(statearr_23173[(1)] = (1));

return statearr_23173;
});
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1 = (function (state_23167){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23167);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23174){if((e23174 instanceof Object)){
var ex__22680__auto__ = e23174;
var statearr_23175_23345 = state_23167;
(statearr_23175_23345[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23167);

return cljs.core.cst$kw$recur;
} else {
throw e23174;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23346 = state_23167;
state_23167 = G__23346;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = function(state_23167){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1.call(this,state_23167);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results))
})();
var state__22792__auto__ = (function (){var statearr_23176 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23176[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___23344);

return statearr_23176;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___23344,res,vec__23162,v,p,job,jobs,results))
);


cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});})(jobs,results))
;
var async = ((function (jobs,results,process){
return (function (p__23177){
var vec__23178 = p__23177;
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23178,(0),null);
var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23178,(1),null);
var job = vec__23178;
if((job == null)){
cljs.core.async.close_BANG_(results);

return null;
} else {
var res = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
(xf.cljs$core$IFn$_invoke$arity$2 ? xf.cljs$core$IFn$_invoke$arity$2(v,res) : xf.call(null,v,res));

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(p,res);

return true;
}
});})(jobs,results,process))
;
var n__7131__auto___23347 = n;
var __23348 = (0);
while(true){
if((__23348 < n__7131__auto___23347)){
var G__23179_23349 = (((type instanceof cljs.core.Keyword))?type.fqn:null);
switch (G__23179_23349) {
case "compute":
var c__22790__auto___23351 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__23348,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (__23348,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function (state_23192){
var state_val_23193 = (state_23192[(1)]);
if((state_val_23193 === (1))){
var state_23192__$1 = state_23192;
var statearr_23194_23352 = state_23192__$1;
(statearr_23194_23352[(2)] = null);

(statearr_23194_23352[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23193 === (2))){
var state_23192__$1 = state_23192;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23192__$1,(4),jobs);
} else {
if((state_val_23193 === (3))){
var inst_23190 = (state_23192[(2)]);
var state_23192__$1 = state_23192;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23192__$1,inst_23190);
} else {
if((state_val_23193 === (4))){
var inst_23182 = (state_23192[(2)]);
var inst_23183 = process(inst_23182);
var state_23192__$1 = state_23192;
if(cljs.core.truth_(inst_23183)){
var statearr_23195_23353 = state_23192__$1;
(statearr_23195_23353[(1)] = (5));

} else {
var statearr_23196_23354 = state_23192__$1;
(statearr_23196_23354[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23193 === (5))){
var state_23192__$1 = state_23192;
var statearr_23197_23355 = state_23192__$1;
(statearr_23197_23355[(2)] = null);

(statearr_23197_23355[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23193 === (6))){
var state_23192__$1 = state_23192;
var statearr_23198_23356 = state_23192__$1;
(statearr_23198_23356[(2)] = null);

(statearr_23198_23356[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23193 === (7))){
var inst_23188 = (state_23192[(2)]);
var state_23192__$1 = state_23192;
var statearr_23199_23357 = state_23192__$1;
(statearr_23199_23357[(2)] = inst_23188);

(statearr_23199_23357[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
});})(__23348,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
;
return ((function (__23348,switch__22676__auto__,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_23203 = [null,null,null,null,null,null,null];
(statearr_23203[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__);

(statearr_23203[(1)] = (1));

return statearr_23203;
});
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1 = (function (state_23192){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23192);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23204){if((e23204 instanceof Object)){
var ex__22680__auto__ = e23204;
var statearr_23205_23358 = state_23192;
(statearr_23205_23358[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23192);

return cljs.core.cst$kw$recur;
} else {
throw e23204;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23359 = state_23192;
state_23192 = G__23359;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = function(state_23192){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1.call(this,state_23192);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__;
})()
;})(__23348,switch__22676__auto__,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
})();
var state__22792__auto__ = (function (){var statearr_23206 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23206[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___23351);

return statearr_23206;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(__23348,c__22790__auto___23351,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
);


break;
case "async":
var c__22790__auto___23360 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (__23348,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (__23348,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function (state_23219){
var state_val_23220 = (state_23219[(1)]);
if((state_val_23220 === (1))){
var state_23219__$1 = state_23219;
var statearr_23221_23361 = state_23219__$1;
(statearr_23221_23361[(2)] = null);

(statearr_23221_23361[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23220 === (2))){
var state_23219__$1 = state_23219;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23219__$1,(4),jobs);
} else {
if((state_val_23220 === (3))){
var inst_23217 = (state_23219[(2)]);
var state_23219__$1 = state_23219;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23219__$1,inst_23217);
} else {
if((state_val_23220 === (4))){
var inst_23209 = (state_23219[(2)]);
var inst_23210 = async(inst_23209);
var state_23219__$1 = state_23219;
if(cljs.core.truth_(inst_23210)){
var statearr_23222_23362 = state_23219__$1;
(statearr_23222_23362[(1)] = (5));

} else {
var statearr_23223_23363 = state_23219__$1;
(statearr_23223_23363[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23220 === (5))){
var state_23219__$1 = state_23219;
var statearr_23224_23364 = state_23219__$1;
(statearr_23224_23364[(2)] = null);

(statearr_23224_23364[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23220 === (6))){
var state_23219__$1 = state_23219;
var statearr_23225_23365 = state_23219__$1;
(statearr_23225_23365[(2)] = null);

(statearr_23225_23365[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23220 === (7))){
var inst_23215 = (state_23219[(2)]);
var state_23219__$1 = state_23219;
var statearr_23226_23366 = state_23219__$1;
(statearr_23226_23366[(2)] = inst_23215);

(statearr_23226_23366[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
});})(__23348,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
;
return ((function (__23348,switch__22676__auto__,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_23230 = [null,null,null,null,null,null,null];
(statearr_23230[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__);

(statearr_23230[(1)] = (1));

return statearr_23230;
});
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1 = (function (state_23219){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23219);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23231){if((e23231 instanceof Object)){
var ex__22680__auto__ = e23231;
var statearr_23232_23367 = state_23219;
(statearr_23232_23367[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23219);

return cljs.core.cst$kw$recur;
} else {
throw e23231;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23368 = state_23219;
state_23219 = G__23368;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = function(state_23219){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1.call(this,state_23219);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__;
})()
;})(__23348,switch__22676__auto__,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
})();
var state__22792__auto__ = (function (){var statearr_23233 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23233[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___23360);

return statearr_23233;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(__23348,c__22790__auto___23360,G__23179_23349,n__7131__auto___23347,jobs,results,process,async))
);


break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(type)].join('')));

}

var G__23369 = (__23348 + (1));
__23348 = G__23369;
continue;
} else {
}
break;
}

var c__22790__auto___23370 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___23370,jobs,results,process,async){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___23370,jobs,results,process,async){
return (function (state_23255){
var state_val_23256 = (state_23255[(1)]);
if((state_val_23256 === (1))){
var state_23255__$1 = state_23255;
var statearr_23257_23371 = state_23255__$1;
(statearr_23257_23371[(2)] = null);

(statearr_23257_23371[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23256 === (2))){
var state_23255__$1 = state_23255;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23255__$1,(4),from);
} else {
if((state_val_23256 === (3))){
var inst_23253 = (state_23255[(2)]);
var state_23255__$1 = state_23255;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23255__$1,inst_23253);
} else {
if((state_val_23256 === (4))){
var inst_23236 = (state_23255[(7)]);
var inst_23236__$1 = (state_23255[(2)]);
var inst_23237 = (inst_23236__$1 == null);
var state_23255__$1 = (function (){var statearr_23258 = state_23255;
(statearr_23258[(7)] = inst_23236__$1);

return statearr_23258;
})();
if(cljs.core.truth_(inst_23237)){
var statearr_23259_23372 = state_23255__$1;
(statearr_23259_23372[(1)] = (5));

} else {
var statearr_23260_23373 = state_23255__$1;
(statearr_23260_23373[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23256 === (5))){
var inst_23239 = cljs.core.async.close_BANG_(jobs);
var state_23255__$1 = state_23255;
var statearr_23261_23374 = state_23255__$1;
(statearr_23261_23374[(2)] = inst_23239);

(statearr_23261_23374[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23256 === (6))){
var inst_23236 = (state_23255[(7)]);
var inst_23241 = (state_23255[(8)]);
var inst_23241__$1 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var inst_23242 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_23243 = [inst_23236,inst_23241__$1];
var inst_23244 = (new cljs.core.PersistentVector(null,2,(5),inst_23242,inst_23243,null));
var state_23255__$1 = (function (){var statearr_23262 = state_23255;
(statearr_23262[(8)] = inst_23241__$1);

return statearr_23262;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23255__$1,(8),jobs,inst_23244);
} else {
if((state_val_23256 === (7))){
var inst_23251 = (state_23255[(2)]);
var state_23255__$1 = state_23255;
var statearr_23263_23375 = state_23255__$1;
(statearr_23263_23375[(2)] = inst_23251);

(statearr_23263_23375[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23256 === (8))){
var inst_23241 = (state_23255[(8)]);
var inst_23246 = (state_23255[(2)]);
var state_23255__$1 = (function (){var statearr_23264 = state_23255;
(statearr_23264[(9)] = inst_23246);

return statearr_23264;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23255__$1,(9),results,inst_23241);
} else {
if((state_val_23256 === (9))){
var inst_23248 = (state_23255[(2)]);
var state_23255__$1 = (function (){var statearr_23265 = state_23255;
(statearr_23265[(10)] = inst_23248);

return statearr_23265;
})();
var statearr_23266_23376 = state_23255__$1;
(statearr_23266_23376[(2)] = null);

(statearr_23266_23376[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___23370,jobs,results,process,async))
;
return ((function (switch__22676__auto__,c__22790__auto___23370,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_23270 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_23270[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__);

(statearr_23270[(1)] = (1));

return statearr_23270;
});
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1 = (function (state_23255){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23255);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23271){if((e23271 instanceof Object)){
var ex__22680__auto__ = e23271;
var statearr_23272_23377 = state_23255;
(statearr_23272_23377[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23255);

return cljs.core.cst$kw$recur;
} else {
throw e23271;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23378 = state_23255;
state_23255 = G__23378;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = function(state_23255){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1.call(this,state_23255);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___23370,jobs,results,process,async))
})();
var state__22792__auto__ = (function (){var statearr_23273 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23273[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___23370);

return statearr_23273;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___23370,jobs,results,process,async))
);


var c__22790__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto__,jobs,results,process,async){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto__,jobs,results,process,async){
return (function (state_23311){
var state_val_23312 = (state_23311[(1)]);
if((state_val_23312 === (7))){
var inst_23307 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
var statearr_23313_23379 = state_23311__$1;
(statearr_23313_23379[(2)] = inst_23307);

(statearr_23313_23379[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (20))){
var state_23311__$1 = state_23311;
var statearr_23314_23380 = state_23311__$1;
(statearr_23314_23380[(2)] = null);

(statearr_23314_23380[(1)] = (21));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (1))){
var state_23311__$1 = state_23311;
var statearr_23315_23381 = state_23311__$1;
(statearr_23315_23381[(2)] = null);

(statearr_23315_23381[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (4))){
var inst_23276 = (state_23311[(7)]);
var inst_23276__$1 = (state_23311[(2)]);
var inst_23277 = (inst_23276__$1 == null);
var state_23311__$1 = (function (){var statearr_23316 = state_23311;
(statearr_23316[(7)] = inst_23276__$1);

return statearr_23316;
})();
if(cljs.core.truth_(inst_23277)){
var statearr_23317_23382 = state_23311__$1;
(statearr_23317_23382[(1)] = (5));

} else {
var statearr_23318_23383 = state_23311__$1;
(statearr_23318_23383[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (15))){
var inst_23289 = (state_23311[(8)]);
var state_23311__$1 = state_23311;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23311__$1,(18),to,inst_23289);
} else {
if((state_val_23312 === (21))){
var inst_23302 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
var statearr_23319_23384 = state_23311__$1;
(statearr_23319_23384[(2)] = inst_23302);

(statearr_23319_23384[(1)] = (13));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (13))){
var inst_23304 = (state_23311[(2)]);
var state_23311__$1 = (function (){var statearr_23320 = state_23311;
(statearr_23320[(9)] = inst_23304);

return statearr_23320;
})();
var statearr_23321_23385 = state_23311__$1;
(statearr_23321_23385[(2)] = null);

(statearr_23321_23385[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (6))){
var inst_23276 = (state_23311[(7)]);
var state_23311__$1 = state_23311;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23311__$1,(11),inst_23276);
} else {
if((state_val_23312 === (17))){
var inst_23297 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
if(cljs.core.truth_(inst_23297)){
var statearr_23322_23386 = state_23311__$1;
(statearr_23322_23386[(1)] = (19));

} else {
var statearr_23323_23387 = state_23311__$1;
(statearr_23323_23387[(1)] = (20));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (3))){
var inst_23309 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23311__$1,inst_23309);
} else {
if((state_val_23312 === (12))){
var inst_23286 = (state_23311[(10)]);
var state_23311__$1 = state_23311;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23311__$1,(14),inst_23286);
} else {
if((state_val_23312 === (2))){
var state_23311__$1 = state_23311;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23311__$1,(4),results);
} else {
if((state_val_23312 === (19))){
var state_23311__$1 = state_23311;
var statearr_23324_23388 = state_23311__$1;
(statearr_23324_23388[(2)] = null);

(statearr_23324_23388[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (11))){
var inst_23286 = (state_23311[(2)]);
var state_23311__$1 = (function (){var statearr_23325 = state_23311;
(statearr_23325[(10)] = inst_23286);

return statearr_23325;
})();
var statearr_23326_23389 = state_23311__$1;
(statearr_23326_23389[(2)] = null);

(statearr_23326_23389[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (9))){
var state_23311__$1 = state_23311;
var statearr_23327_23390 = state_23311__$1;
(statearr_23327_23390[(2)] = null);

(statearr_23327_23390[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (5))){
var state_23311__$1 = state_23311;
if(cljs.core.truth_(close_QMARK_)){
var statearr_23328_23391 = state_23311__$1;
(statearr_23328_23391[(1)] = (8));

} else {
var statearr_23329_23392 = state_23311__$1;
(statearr_23329_23392[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (14))){
var inst_23289 = (state_23311[(8)]);
var inst_23291 = (state_23311[(11)]);
var inst_23289__$1 = (state_23311[(2)]);
var inst_23290 = (inst_23289__$1 == null);
var inst_23291__$1 = cljs.core.not(inst_23290);
var state_23311__$1 = (function (){var statearr_23330 = state_23311;
(statearr_23330[(8)] = inst_23289__$1);

(statearr_23330[(11)] = inst_23291__$1);

return statearr_23330;
})();
if(inst_23291__$1){
var statearr_23331_23393 = state_23311__$1;
(statearr_23331_23393[(1)] = (15));

} else {
var statearr_23332_23394 = state_23311__$1;
(statearr_23332_23394[(1)] = (16));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (16))){
var inst_23291 = (state_23311[(11)]);
var state_23311__$1 = state_23311;
var statearr_23333_23395 = state_23311__$1;
(statearr_23333_23395[(2)] = inst_23291);

(statearr_23333_23395[(1)] = (17));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (10))){
var inst_23283 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
var statearr_23334_23396 = state_23311__$1;
(statearr_23334_23396[(2)] = inst_23283);

(statearr_23334_23396[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (18))){
var inst_23294 = (state_23311[(2)]);
var state_23311__$1 = state_23311;
var statearr_23335_23397 = state_23311__$1;
(statearr_23335_23397[(2)] = inst_23294);

(statearr_23335_23397[(1)] = (17));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23312 === (8))){
var inst_23280 = cljs.core.async.close_BANG_(to);
var state_23311__$1 = state_23311;
var statearr_23336_23398 = state_23311__$1;
(statearr_23336_23398[(2)] = inst_23280);

(statearr_23336_23398[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto__,jobs,results,process,async))
;
return ((function (switch__22676__auto__,c__22790__auto__,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_23340 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_23340[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__);

(statearr_23340[(1)] = (1));

return statearr_23340;
});
var cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1 = (function (state_23311){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23311);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23341){if((e23341 instanceof Object)){
var ex__22680__auto__ = e23341;
var statearr_23342_23399 = state_23311;
(statearr_23342_23399[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23311);

return cljs.core.cst$kw$recur;
} else {
throw e23341;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23400 = state_23311;
state_23311 = G__23400;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__ = function(state_23311){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1.call(this,state_23311);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto__,jobs,results,process,async))
})();
var state__22792__auto__ = (function (){var statearr_23343 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23343[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto__);

return statearr_23343;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto__,jobs,results,process,async))
);

return c__22790__auto__;
});
/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the async function af, with parallelism n. af
 *   must be a function of two arguments, the first an input value and
 *   the second a channel on which to place the result(s). af must close!
 *   the channel before returning.  The presumption is that af will
 *   return immediately, having launched some asynchronous operation
 *   whose completion/callback will manipulate the result channel. Outputs
 *   will be returned in order relative to  the inputs. By default, the to
 *   channel will be closed when the from channel closes, but can be
 *   determined by the close?  parameter. Will stop consuming the from
 *   channel if the to channel closes.
 */
cljs.core.async.pipeline_async = (function cljs$core$async$pipeline_async(var_args){
var args23401 = [];
var len__7291__auto___23404 = arguments.length;
var i__7292__auto___23405 = (0);
while(true){
if((i__7292__auto___23405 < len__7291__auto___23404)){
args23401.push((arguments[i__7292__auto___23405]));

var G__23406 = (i__7292__auto___23405 + (1));
i__7292__auto___23405 = G__23406;
continue;
} else {
}
break;
}

var G__23403 = args23401.length;
switch (G__23403) {
case 4:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23401.length)].join('')));

}
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4 = (function (n,to,af,from){
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5(n,to,af,from,true);
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5 = (function (n,to,af,from,close_QMARK_){
return cljs.core.async.pipeline_STAR_(n,to,af,from,close_QMARK_,null,cljs.core.cst$kw$async);
});

cljs.core.async.pipeline_async.cljs$lang$maxFixedArity = 5;
/**
 * Takes elements from the from channel and supplies them to the to
 *   channel, subject to the transducer xf, with parallelism n. Because
 *   it is parallel, the transducer will be applied independently to each
 *   element, not across elements, and may produce zero or more outputs
 *   per input.  Outputs will be returned in order relative to the
 *   inputs. By default, the to channel will be closed when the from
 *   channel closes, but can be determined by the close?  parameter. Will
 *   stop consuming the from channel if the to channel closes.
 * 
 *   Note this is supplied for API compatibility with the Clojure version.
 *   Values of N > 1 will not result in actual concurrency in a
 *   single-threaded runtime.
 */
cljs.core.async.pipeline = (function cljs$core$async$pipeline(var_args){
var args23408 = [];
var len__7291__auto___23411 = arguments.length;
var i__7292__auto___23412 = (0);
while(true){
if((i__7292__auto___23412 < len__7291__auto___23411)){
args23408.push((arguments[i__7292__auto___23412]));

var G__23413 = (i__7292__auto___23412 + (1));
i__7292__auto___23412 = G__23413;
continue;
} else {
}
break;
}

var G__23410 = args23408.length;
switch (G__23410) {
case 4:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
case 6:
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),(arguments[(5)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23408.length)].join('')));

}
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4 = (function (n,to,xf,from){
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5(n,to,xf,from,true);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5 = (function (n,to,xf,from,close_QMARK_){
return cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6(n,to,xf,from,close_QMARK_,null);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6 = (function (n,to,xf,from,close_QMARK_,ex_handler){
return cljs.core.async.pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,cljs.core.cst$kw$compute);
});

cljs.core.async.pipeline.cljs$lang$maxFixedArity = 6;
/**
 * Takes a predicate and a source channel and returns a vector of two
 *   channels, the first of which will contain the values for which the
 *   predicate returned true, the second those for which it returned
 *   false.
 * 
 *   The out channels will be unbuffered by default, or two buf-or-ns can
 *   be supplied. The channels will close after the source channel has
 *   closed.
 */
cljs.core.async.split = (function cljs$core$async$split(var_args){
var args23415 = [];
var len__7291__auto___23468 = arguments.length;
var i__7292__auto___23469 = (0);
while(true){
if((i__7292__auto___23469 < len__7291__auto___23468)){
args23415.push((arguments[i__7292__auto___23469]));

var G__23470 = (i__7292__auto___23469 + (1));
i__7292__auto___23469 = G__23470;
continue;
} else {
}
break;
}

var G__23417 = args23415.length;
switch (G__23417) {
case 2:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23415.length)].join('')));

}
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4(p,ch,null,null);
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$4 = (function (p,ch,t_buf_or_n,f_buf_or_n){
var tc = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(t_buf_or_n);
var fc = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(f_buf_or_n);
var c__22790__auto___23472 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___23472,tc,fc){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___23472,tc,fc){
return (function (state_23443){
var state_val_23444 = (state_23443[(1)]);
if((state_val_23444 === (7))){
var inst_23439 = (state_23443[(2)]);
var state_23443__$1 = state_23443;
var statearr_23445_23473 = state_23443__$1;
(statearr_23445_23473[(2)] = inst_23439);

(statearr_23445_23473[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (1))){
var state_23443__$1 = state_23443;
var statearr_23446_23474 = state_23443__$1;
(statearr_23446_23474[(2)] = null);

(statearr_23446_23474[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (4))){
var inst_23420 = (state_23443[(7)]);
var inst_23420__$1 = (state_23443[(2)]);
var inst_23421 = (inst_23420__$1 == null);
var state_23443__$1 = (function (){var statearr_23447 = state_23443;
(statearr_23447[(7)] = inst_23420__$1);

return statearr_23447;
})();
if(cljs.core.truth_(inst_23421)){
var statearr_23448_23475 = state_23443__$1;
(statearr_23448_23475[(1)] = (5));

} else {
var statearr_23449_23476 = state_23443__$1;
(statearr_23449_23476[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (13))){
var state_23443__$1 = state_23443;
var statearr_23450_23477 = state_23443__$1;
(statearr_23450_23477[(2)] = null);

(statearr_23450_23477[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (6))){
var inst_23420 = (state_23443[(7)]);
var inst_23426 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_23420) : p.call(null,inst_23420));
var state_23443__$1 = state_23443;
if(cljs.core.truth_(inst_23426)){
var statearr_23451_23478 = state_23443__$1;
(statearr_23451_23478[(1)] = (9));

} else {
var statearr_23452_23479 = state_23443__$1;
(statearr_23452_23479[(1)] = (10));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (3))){
var inst_23441 = (state_23443[(2)]);
var state_23443__$1 = state_23443;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23443__$1,inst_23441);
} else {
if((state_val_23444 === (12))){
var state_23443__$1 = state_23443;
var statearr_23453_23480 = state_23443__$1;
(statearr_23453_23480[(2)] = null);

(statearr_23453_23480[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (2))){
var state_23443__$1 = state_23443;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23443__$1,(4),ch);
} else {
if((state_val_23444 === (11))){
var inst_23420 = (state_23443[(7)]);
var inst_23430 = (state_23443[(2)]);
var state_23443__$1 = state_23443;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23443__$1,(8),inst_23430,inst_23420);
} else {
if((state_val_23444 === (9))){
var state_23443__$1 = state_23443;
var statearr_23454_23481 = state_23443__$1;
(statearr_23454_23481[(2)] = tc);

(statearr_23454_23481[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (5))){
var inst_23423 = cljs.core.async.close_BANG_(tc);
var inst_23424 = cljs.core.async.close_BANG_(fc);
var state_23443__$1 = (function (){var statearr_23455 = state_23443;
(statearr_23455[(8)] = inst_23423);

return statearr_23455;
})();
var statearr_23456_23482 = state_23443__$1;
(statearr_23456_23482[(2)] = inst_23424);

(statearr_23456_23482[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (14))){
var inst_23437 = (state_23443[(2)]);
var state_23443__$1 = state_23443;
var statearr_23457_23483 = state_23443__$1;
(statearr_23457_23483[(2)] = inst_23437);

(statearr_23457_23483[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (10))){
var state_23443__$1 = state_23443;
var statearr_23458_23484 = state_23443__$1;
(statearr_23458_23484[(2)] = fc);

(statearr_23458_23484[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23444 === (8))){
var inst_23432 = (state_23443[(2)]);
var state_23443__$1 = state_23443;
if(cljs.core.truth_(inst_23432)){
var statearr_23459_23485 = state_23443__$1;
(statearr_23459_23485[(1)] = (12));

} else {
var statearr_23460_23486 = state_23443__$1;
(statearr_23460_23486[(1)] = (13));

}

return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___23472,tc,fc))
;
return ((function (switch__22676__auto__,c__22790__auto___23472,tc,fc){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_23464 = [null,null,null,null,null,null,null,null,null];
(statearr_23464[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_23464[(1)] = (1));

return statearr_23464;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_23443){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23443);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23465){if((e23465 instanceof Object)){
var ex__22680__auto__ = e23465;
var statearr_23466_23487 = state_23443;
(statearr_23466_23487[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23443);

return cljs.core.cst$kw$recur;
} else {
throw e23465;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23488 = state_23443;
state_23443 = G__23488;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_23443){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_23443);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___23472,tc,fc))
})();
var state__22792__auto__ = (function (){var statearr_23467 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23467[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___23472);

return statearr_23467;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___23472,tc,fc))
);


return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [tc,fc], null);
});

cljs.core.async.split.cljs$lang$maxFixedArity = 4;
/**
 * f should be a function of 2 arguments. Returns a channel containing
 *   the single result of applying f to init and the first item from the
 *   channel, then applying f to that result and the 2nd item, etc. If
 *   the channel closes without yielding items, returns init and f is not
 *   called. ch must close before reduce produces a result.
 */
cljs.core.async.reduce = (function cljs$core$async$reduce(f,init,ch){
var c__22790__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto__){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto__){
return (function (state_23552){
var state_val_23553 = (state_23552[(1)]);
if((state_val_23553 === (7))){
var inst_23548 = (state_23552[(2)]);
var state_23552__$1 = state_23552;
var statearr_23554_23575 = state_23552__$1;
(statearr_23554_23575[(2)] = inst_23548);

(statearr_23554_23575[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (1))){
var inst_23532 = init;
var state_23552__$1 = (function (){var statearr_23555 = state_23552;
(statearr_23555[(7)] = inst_23532);

return statearr_23555;
})();
var statearr_23556_23576 = state_23552__$1;
(statearr_23556_23576[(2)] = null);

(statearr_23556_23576[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (4))){
var inst_23535 = (state_23552[(8)]);
var inst_23535__$1 = (state_23552[(2)]);
var inst_23536 = (inst_23535__$1 == null);
var state_23552__$1 = (function (){var statearr_23557 = state_23552;
(statearr_23557[(8)] = inst_23535__$1);

return statearr_23557;
})();
if(cljs.core.truth_(inst_23536)){
var statearr_23558_23577 = state_23552__$1;
(statearr_23558_23577[(1)] = (5));

} else {
var statearr_23559_23578 = state_23552__$1;
(statearr_23559_23578[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (6))){
var inst_23535 = (state_23552[(8)]);
var inst_23532 = (state_23552[(7)]);
var inst_23539 = (state_23552[(9)]);
var inst_23539__$1 = (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(inst_23532,inst_23535) : f.call(null,inst_23532,inst_23535));
var inst_23540 = cljs.core.reduced_QMARK_(inst_23539__$1);
var state_23552__$1 = (function (){var statearr_23560 = state_23552;
(statearr_23560[(9)] = inst_23539__$1);

return statearr_23560;
})();
if(inst_23540){
var statearr_23561_23579 = state_23552__$1;
(statearr_23561_23579[(1)] = (8));

} else {
var statearr_23562_23580 = state_23552__$1;
(statearr_23562_23580[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (3))){
var inst_23550 = (state_23552[(2)]);
var state_23552__$1 = state_23552;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23552__$1,inst_23550);
} else {
if((state_val_23553 === (2))){
var state_23552__$1 = state_23552;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_23552__$1,(4),ch);
} else {
if((state_val_23553 === (9))){
var inst_23539 = (state_23552[(9)]);
var inst_23532 = inst_23539;
var state_23552__$1 = (function (){var statearr_23563 = state_23552;
(statearr_23563[(7)] = inst_23532);

return statearr_23563;
})();
var statearr_23564_23581 = state_23552__$1;
(statearr_23564_23581[(2)] = null);

(statearr_23564_23581[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (5))){
var inst_23532 = (state_23552[(7)]);
var state_23552__$1 = state_23552;
var statearr_23565_23582 = state_23552__$1;
(statearr_23565_23582[(2)] = inst_23532);

(statearr_23565_23582[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (10))){
var inst_23546 = (state_23552[(2)]);
var state_23552__$1 = state_23552;
var statearr_23566_23583 = state_23552__$1;
(statearr_23566_23583[(2)] = inst_23546);

(statearr_23566_23583[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23553 === (8))){
var inst_23539 = (state_23552[(9)]);
var inst_23542 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(inst_23539) : cljs.core.deref.call(null,inst_23539));
var state_23552__$1 = state_23552;
var statearr_23567_23584 = state_23552__$1;
(statearr_23567_23584[(2)] = inst_23542);

(statearr_23567_23584[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto__))
;
return ((function (switch__22676__auto__,c__22790__auto__){
return (function() {
var cljs$core$async$reduce_$_state_machine__22677__auto__ = null;
var cljs$core$async$reduce_$_state_machine__22677__auto____0 = (function (){
var statearr_23571 = [null,null,null,null,null,null,null,null,null,null];
(statearr_23571[(0)] = cljs$core$async$reduce_$_state_machine__22677__auto__);

(statearr_23571[(1)] = (1));

return statearr_23571;
});
var cljs$core$async$reduce_$_state_machine__22677__auto____1 = (function (state_23552){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23552);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23572){if((e23572 instanceof Object)){
var ex__22680__auto__ = e23572;
var statearr_23573_23585 = state_23552;
(statearr_23573_23585[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23552);

return cljs.core.cst$kw$recur;
} else {
throw e23572;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23586 = state_23552;
state_23552 = G__23586;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__22677__auto__ = function(state_23552){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__22677__auto____1.call(this,state_23552);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__22677__auto____0;
cljs$core$async$reduce_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__22677__auto____1;
return cljs$core$async$reduce_$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto__))
})();
var state__22792__auto__ = (function (){var statearr_23574 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23574[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto__);

return statearr_23574;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto__))
);

return c__22790__auto__;
});
/**
 * Puts the contents of coll into the supplied channel.
 * 
 *   By default the channel will be closed after the items are copied,
 *   but can be determined by the close? parameter.
 * 
 *   Returns a channel which will close after the items are copied.
 */
cljs.core.async.onto_chan = (function cljs$core$async$onto_chan(var_args){
var args23587 = [];
var len__7291__auto___23639 = arguments.length;
var i__7292__auto___23640 = (0);
while(true){
if((i__7292__auto___23640 < len__7291__auto___23639)){
args23587.push((arguments[i__7292__auto___23640]));

var G__23641 = (i__7292__auto___23640 + (1));
i__7292__auto___23640 = G__23641;
continue;
} else {
}
break;
}

var G__23589 = args23587.length;
switch (G__23589) {
case 2:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args23587.length)].join('')));

}
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2 = (function (ch,coll){
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3(ch,coll,true);
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3 = (function (ch,coll,close_QMARK_){
var c__22790__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto__){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto__){
return (function (state_23614){
var state_val_23615 = (state_23614[(1)]);
if((state_val_23615 === (7))){
var inst_23596 = (state_23614[(2)]);
var state_23614__$1 = state_23614;
var statearr_23616_23643 = state_23614__$1;
(statearr_23616_23643[(2)] = inst_23596);

(statearr_23616_23643[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (1))){
var inst_23590 = cljs.core.seq(coll);
var inst_23591 = inst_23590;
var state_23614__$1 = (function (){var statearr_23617 = state_23614;
(statearr_23617[(7)] = inst_23591);

return statearr_23617;
})();
var statearr_23618_23644 = state_23614__$1;
(statearr_23618_23644[(2)] = null);

(statearr_23618_23644[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (4))){
var inst_23591 = (state_23614[(7)]);
var inst_23594 = cljs.core.first(inst_23591);
var state_23614__$1 = state_23614;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_23614__$1,(7),ch,inst_23594);
} else {
if((state_val_23615 === (13))){
var inst_23608 = (state_23614[(2)]);
var state_23614__$1 = state_23614;
var statearr_23619_23645 = state_23614__$1;
(statearr_23619_23645[(2)] = inst_23608);

(statearr_23619_23645[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (6))){
var inst_23599 = (state_23614[(2)]);
var state_23614__$1 = state_23614;
if(cljs.core.truth_(inst_23599)){
var statearr_23620_23646 = state_23614__$1;
(statearr_23620_23646[(1)] = (8));

} else {
var statearr_23621_23647 = state_23614__$1;
(statearr_23621_23647[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (3))){
var inst_23612 = (state_23614[(2)]);
var state_23614__$1 = state_23614;
return cljs.core.async.impl.ioc_helpers.return_chan(state_23614__$1,inst_23612);
} else {
if((state_val_23615 === (12))){
var state_23614__$1 = state_23614;
var statearr_23622_23648 = state_23614__$1;
(statearr_23622_23648[(2)] = null);

(statearr_23622_23648[(1)] = (13));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (2))){
var inst_23591 = (state_23614[(7)]);
var state_23614__$1 = state_23614;
if(cljs.core.truth_(inst_23591)){
var statearr_23623_23649 = state_23614__$1;
(statearr_23623_23649[(1)] = (4));

} else {
var statearr_23624_23650 = state_23614__$1;
(statearr_23624_23650[(1)] = (5));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (11))){
var inst_23605 = cljs.core.async.close_BANG_(ch);
var state_23614__$1 = state_23614;
var statearr_23625_23651 = state_23614__$1;
(statearr_23625_23651[(2)] = inst_23605);

(statearr_23625_23651[(1)] = (13));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (9))){
var state_23614__$1 = state_23614;
if(cljs.core.truth_(close_QMARK_)){
var statearr_23626_23652 = state_23614__$1;
(statearr_23626_23652[(1)] = (11));

} else {
var statearr_23627_23653 = state_23614__$1;
(statearr_23627_23653[(1)] = (12));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (5))){
var inst_23591 = (state_23614[(7)]);
var state_23614__$1 = state_23614;
var statearr_23628_23654 = state_23614__$1;
(statearr_23628_23654[(2)] = inst_23591);

(statearr_23628_23654[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (10))){
var inst_23610 = (state_23614[(2)]);
var state_23614__$1 = state_23614;
var statearr_23629_23655 = state_23614__$1;
(statearr_23629_23655[(2)] = inst_23610);

(statearr_23629_23655[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_23615 === (8))){
var inst_23591 = (state_23614[(7)]);
var inst_23601 = cljs.core.next(inst_23591);
var inst_23591__$1 = inst_23601;
var state_23614__$1 = (function (){var statearr_23630 = state_23614;
(statearr_23630[(7)] = inst_23591__$1);

return statearr_23630;
})();
var statearr_23631_23656 = state_23614__$1;
(statearr_23631_23656[(2)] = null);

(statearr_23631_23656[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto__))
;
return ((function (switch__22676__auto__,c__22790__auto__){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_23635 = [null,null,null,null,null,null,null,null];
(statearr_23635[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_23635[(1)] = (1));

return statearr_23635;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_23614){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_23614);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e23636){if((e23636 instanceof Object)){
var ex__22680__auto__ = e23636;
var statearr_23637_23657 = state_23614;
(statearr_23637_23657[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_23614);

return cljs.core.cst$kw$recur;
} else {
throw e23636;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__23658 = state_23614;
state_23614 = G__23658;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_23614){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_23614);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto__))
})();
var state__22792__auto__ = (function (){var statearr_23638 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_23638[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto__);

return statearr_23638;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto__))
);

return c__22790__auto__;
});

cljs.core.async.onto_chan.cljs$lang$maxFixedArity = 3;
/**
 * Creates and returns a channel which contains the contents of coll,
 *   closing when exhausted.
 */
cljs.core.async.to_chan = (function cljs$core$async$to_chan(coll){
var ch = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(cljs.core.bounded_count((100),coll));
cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2(ch,coll);

return ch;
});

/**
 * @interface
 */
cljs.core.async.Mux = function(){};

cljs.core.async.muxch_STAR_ = (function cljs$core$async$muxch_STAR_(_){
if((!((_ == null))) && (!((_.cljs$core$async$Mux$muxch_STAR_$arity$1 == null)))){
return _.cljs$core$async$Mux$muxch_STAR_$arity$1(_);
} else {
var x__6879__auto__ = (((_ == null))?null:_);
var m__6880__auto__ = (cljs.core.async.muxch_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(_) : m__6880__auto__.call(null,_));
} else {
var m__6880__auto____$1 = (cljs.core.async.muxch_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(_) : m__6880__auto____$1.call(null,_));
} else {
throw cljs.core.missing_protocol("Mux.muxch*",_);
}
}
}
});


/**
 * @interface
 */
cljs.core.async.Mult = function(){};

cljs.core.async.tap_STAR_ = (function cljs$core$async$tap_STAR_(m,ch,close_QMARK_){
if((!((m == null))) && (!((m.cljs$core$async$Mult$tap_STAR_$arity$3 == null)))){
return m.cljs$core$async$Mult$tap_STAR_$arity$3(m,ch,close_QMARK_);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.tap_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$3 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$3(m,ch,close_QMARK_) : m__6880__auto__.call(null,m,ch,close_QMARK_));
} else {
var m__6880__auto____$1 = (cljs.core.async.tap_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$3 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$3(m,ch,close_QMARK_) : m__6880__auto____$1.call(null,m,ch,close_QMARK_));
} else {
throw cljs.core.missing_protocol("Mult.tap*",m);
}
}
}
});

cljs.core.async.untap_STAR_ = (function cljs$core$async$untap_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mult$untap_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mult$untap_STAR_$arity$2(m,ch);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.untap_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto__.call(null,m,ch));
} else {
var m__6880__auto____$1 = (cljs.core.async.untap_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto____$1.call(null,m,ch));
} else {
throw cljs.core.missing_protocol("Mult.untap*",m);
}
}
}
});

cljs.core.async.untap_all_STAR_ = (function cljs$core$async$untap_all_STAR_(m){
if((!((m == null))) && (!((m.cljs$core$async$Mult$untap_all_STAR_$arity$1 == null)))){
return m.cljs$core$async$Mult$untap_all_STAR_$arity$1(m);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.untap_all_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__6880__auto__.call(null,m));
} else {
var m__6880__auto____$1 = (cljs.core.async.untap_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(m) : m__6880__auto____$1.call(null,m));
} else {
throw cljs.core.missing_protocol("Mult.untap-all*",m);
}
}
}
});

/**
 * Creates and returns a mult(iple) of the supplied channel. Channels
 *   containing copies of the channel can be created with 'tap', and
 *   detached with 'untap'.
 * 
 *   Each item is distributed to all taps in parallel and synchronously,
 *   i.e. each tap must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow taps from holding up the mult.
 * 
 *   Items received when there are no taps get dropped.
 * 
 *   If a tap puts to a closed channel, it will be removed from the mult.
 */
cljs.core.async.mult = (function cljs$core$async$mult(ch){
var cs = (function (){var G__23883 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__23883) : cljs.core.atom.call(null,G__23883));
})();
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async23884 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async23884 = (function (mult,ch,cs,meta23885){
this.mult = mult;
this.ch = ch;
this.cs = cs;
this.meta23885 = meta23885;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs){
return (function (_23886,meta23885__$1){
var self__ = this;
var _23886__$1 = this;
return (new cljs.core.async.t_cljs$core$async23884(self__.mult,self__.ch,self__.cs,meta23885__$1));
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs){
return (function (_23886){
var self__ = this;
var _23886__$1 = this;
return self__.meta23885;
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mult$ = true;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = ((function (cs){
return (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = ((function (cs){
return (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch__$1);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
var G__23887_24107 = self__.cs;
var G__23888_24108 = cljs.core.PersistentArrayMap.EMPTY;
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__23887_24107,G__23888_24108) : cljs.core.reset_BANG_.call(null,G__23887_24107,G__23888_24108));

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.getBasis = ((function (cs){
return (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$mult,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$ch], null))),cljs.core.cst$kw$doc,"Creates and returns a mult(iple) of the supplied channel. Channels\n  containing copies of the channel can be created with 'tap', and\n  detached with 'untap'.\n\n  Each item is distributed to all taps in parallel and synchronously,\n  i.e. each tap must accept before the next item is distributed. Use\n  buffering/windowing to prevent slow taps from holding up the mult.\n\n  Items received when there are no taps get dropped.\n\n  If a tap puts to a closed channel, it will be removed from the mult."], null)),cljs.core.cst$sym$ch,cljs.core.cst$sym$cs,cljs.core.cst$sym$meta23885], null);
});})(cs))
;

cljs.core.async.t_cljs$core$async23884.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async23884.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async23884";

cljs.core.async.t_cljs$core$async23884.cljs$lang$ctorPrWriter = ((function (cs){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async23884");
});})(cs))
;

cljs.core.async.__GT_t_cljs$core$async23884 = ((function (cs){
return (function cljs$core$async$mult_$___GT_t_cljs$core$async23884(mult__$1,ch__$1,cs__$1,meta23885){
return (new cljs.core.async.t_cljs$core$async23884(mult__$1,ch__$1,cs__$1,meta23885));
});})(cs))
;

}

return (new cljs.core.async.t_cljs$core$async23884(cljs$core$async$mult,ch,cs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null) : cljs.core.atom.call(null,null));
var done = ((function (cs,m,dchan,dctr){
return (function (_){
if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,true);
} else {
return null;
}
});})(cs,m,dchan,dctr))
;
var c__22790__auto___24109 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24109,cs,m,dchan,dctr,done){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24109,cs,m,dchan,dctr,done){
return (function (state_24019){
var state_val_24020 = (state_24019[(1)]);
if((state_val_24020 === (7))){
var inst_24015 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24021_24110 = state_24019__$1;
(statearr_24021_24110[(2)] = inst_24015);

(statearr_24021_24110[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (20))){
var inst_23920 = (state_24019[(7)]);
var inst_23930 = cljs.core.first(inst_23920);
var inst_23931 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_23930,(0),null);
var inst_23932 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_23930,(1),null);
var state_24019__$1 = (function (){var statearr_24022 = state_24019;
(statearr_24022[(8)] = inst_23931);

return statearr_24022;
})();
if(cljs.core.truth_(inst_23932)){
var statearr_24023_24111 = state_24019__$1;
(statearr_24023_24111[(1)] = (22));

} else {
var statearr_24024_24112 = state_24019__$1;
(statearr_24024_24112[(1)] = (23));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (27))){
var inst_23891 = (state_24019[(9)]);
var inst_23960 = (state_24019[(10)]);
var inst_23967 = (state_24019[(11)]);
var inst_23962 = (state_24019[(12)]);
var inst_23967__$1 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(inst_23960,inst_23962);
var inst_23968 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_23967__$1,inst_23891,done);
var state_24019__$1 = (function (){var statearr_24025 = state_24019;
(statearr_24025[(11)] = inst_23967__$1);

return statearr_24025;
})();
if(cljs.core.truth_(inst_23968)){
var statearr_24026_24113 = state_24019__$1;
(statearr_24026_24113[(1)] = (30));

} else {
var statearr_24027_24114 = state_24019__$1;
(statearr_24027_24114[(1)] = (31));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (1))){
var state_24019__$1 = state_24019;
var statearr_24028_24115 = state_24019__$1;
(statearr_24028_24115[(2)] = null);

(statearr_24028_24115[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (24))){
var inst_23920 = (state_24019[(7)]);
var inst_23937 = (state_24019[(2)]);
var inst_23938 = cljs.core.next(inst_23920);
var inst_23900 = inst_23938;
var inst_23901 = null;
var inst_23902 = (0);
var inst_23903 = (0);
var state_24019__$1 = (function (){var statearr_24029 = state_24019;
(statearr_24029[(13)] = inst_23903);

(statearr_24029[(14)] = inst_23901);

(statearr_24029[(15)] = inst_23900);

(statearr_24029[(16)] = inst_23937);

(statearr_24029[(17)] = inst_23902);

return statearr_24029;
})();
var statearr_24030_24116 = state_24019__$1;
(statearr_24030_24116[(2)] = null);

(statearr_24030_24116[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (39))){
var state_24019__$1 = state_24019;
var statearr_24034_24117 = state_24019__$1;
(statearr_24034_24117[(2)] = null);

(statearr_24034_24117[(1)] = (41));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (4))){
var inst_23891 = (state_24019[(9)]);
var inst_23891__$1 = (state_24019[(2)]);
var inst_23892 = (inst_23891__$1 == null);
var state_24019__$1 = (function (){var statearr_24035 = state_24019;
(statearr_24035[(9)] = inst_23891__$1);

return statearr_24035;
})();
if(cljs.core.truth_(inst_23892)){
var statearr_24036_24118 = state_24019__$1;
(statearr_24036_24118[(1)] = (5));

} else {
var statearr_24037_24119 = state_24019__$1;
(statearr_24037_24119[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (15))){
var inst_23903 = (state_24019[(13)]);
var inst_23901 = (state_24019[(14)]);
var inst_23900 = (state_24019[(15)]);
var inst_23902 = (state_24019[(17)]);
var inst_23916 = (state_24019[(2)]);
var inst_23917 = (inst_23903 + (1));
var tmp24031 = inst_23901;
var tmp24032 = inst_23900;
var tmp24033 = inst_23902;
var inst_23900__$1 = tmp24032;
var inst_23901__$1 = tmp24031;
var inst_23902__$1 = tmp24033;
var inst_23903__$1 = inst_23917;
var state_24019__$1 = (function (){var statearr_24038 = state_24019;
(statearr_24038[(13)] = inst_23903__$1);

(statearr_24038[(18)] = inst_23916);

(statearr_24038[(14)] = inst_23901__$1);

(statearr_24038[(15)] = inst_23900__$1);

(statearr_24038[(17)] = inst_23902__$1);

return statearr_24038;
})();
var statearr_24039_24120 = state_24019__$1;
(statearr_24039_24120[(2)] = null);

(statearr_24039_24120[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (21))){
var inst_23941 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24043_24121 = state_24019__$1;
(statearr_24043_24121[(2)] = inst_23941);

(statearr_24043_24121[(1)] = (18));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (31))){
var inst_23967 = (state_24019[(11)]);
var inst_23971 = done(null);
var inst_23972 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null,inst_23967);
var state_24019__$1 = (function (){var statearr_24044 = state_24019;
(statearr_24044[(19)] = inst_23971);

return statearr_24044;
})();
var statearr_24045_24122 = state_24019__$1;
(statearr_24045_24122[(2)] = inst_23972);

(statearr_24045_24122[(1)] = (32));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (32))){
var inst_23959 = (state_24019[(20)]);
var inst_23960 = (state_24019[(10)]);
var inst_23961 = (state_24019[(21)]);
var inst_23962 = (state_24019[(12)]);
var inst_23974 = (state_24019[(2)]);
var inst_23975 = (inst_23962 + (1));
var tmp24040 = inst_23959;
var tmp24041 = inst_23960;
var tmp24042 = inst_23961;
var inst_23959__$1 = tmp24040;
var inst_23960__$1 = tmp24041;
var inst_23961__$1 = tmp24042;
var inst_23962__$1 = inst_23975;
var state_24019__$1 = (function (){var statearr_24046 = state_24019;
(statearr_24046[(20)] = inst_23959__$1);

(statearr_24046[(22)] = inst_23974);

(statearr_24046[(10)] = inst_23960__$1);

(statearr_24046[(21)] = inst_23961__$1);

(statearr_24046[(12)] = inst_23962__$1);

return statearr_24046;
})();
var statearr_24047_24123 = state_24019__$1;
(statearr_24047_24123[(2)] = null);

(statearr_24047_24123[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (40))){
var inst_23987 = (state_24019[(23)]);
var inst_23991 = done(null);
var inst_23992 = m.cljs$core$async$Mult$untap_STAR_$arity$2(null,inst_23987);
var state_24019__$1 = (function (){var statearr_24048 = state_24019;
(statearr_24048[(24)] = inst_23991);

return statearr_24048;
})();
var statearr_24049_24124 = state_24019__$1;
(statearr_24049_24124[(2)] = inst_23992);

(statearr_24049_24124[(1)] = (41));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (33))){
var inst_23978 = (state_24019[(25)]);
var inst_23980 = cljs.core.chunked_seq_QMARK_(inst_23978);
var state_24019__$1 = state_24019;
if(inst_23980){
var statearr_24050_24125 = state_24019__$1;
(statearr_24050_24125[(1)] = (36));

} else {
var statearr_24051_24126 = state_24019__$1;
(statearr_24051_24126[(1)] = (37));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (13))){
var inst_23910 = (state_24019[(26)]);
var inst_23913 = cljs.core.async.close_BANG_(inst_23910);
var state_24019__$1 = state_24019;
var statearr_24052_24127 = state_24019__$1;
(statearr_24052_24127[(2)] = inst_23913);

(statearr_24052_24127[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (22))){
var inst_23931 = (state_24019[(8)]);
var inst_23934 = cljs.core.async.close_BANG_(inst_23931);
var state_24019__$1 = state_24019;
var statearr_24053_24128 = state_24019__$1;
(statearr_24053_24128[(2)] = inst_23934);

(statearr_24053_24128[(1)] = (24));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (36))){
var inst_23978 = (state_24019[(25)]);
var inst_23982 = cljs.core.chunk_first(inst_23978);
var inst_23983 = cljs.core.chunk_rest(inst_23978);
var inst_23984 = cljs.core.count(inst_23982);
var inst_23959 = inst_23983;
var inst_23960 = inst_23982;
var inst_23961 = inst_23984;
var inst_23962 = (0);
var state_24019__$1 = (function (){var statearr_24054 = state_24019;
(statearr_24054[(20)] = inst_23959);

(statearr_24054[(10)] = inst_23960);

(statearr_24054[(21)] = inst_23961);

(statearr_24054[(12)] = inst_23962);

return statearr_24054;
})();
var statearr_24055_24129 = state_24019__$1;
(statearr_24055_24129[(2)] = null);

(statearr_24055_24129[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (41))){
var inst_23978 = (state_24019[(25)]);
var inst_23994 = (state_24019[(2)]);
var inst_23995 = cljs.core.next(inst_23978);
var inst_23959 = inst_23995;
var inst_23960 = null;
var inst_23961 = (0);
var inst_23962 = (0);
var state_24019__$1 = (function (){var statearr_24056 = state_24019;
(statearr_24056[(20)] = inst_23959);

(statearr_24056[(10)] = inst_23960);

(statearr_24056[(21)] = inst_23961);

(statearr_24056[(27)] = inst_23994);

(statearr_24056[(12)] = inst_23962);

return statearr_24056;
})();
var statearr_24057_24130 = state_24019__$1;
(statearr_24057_24130[(2)] = null);

(statearr_24057_24130[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (43))){
var state_24019__$1 = state_24019;
var statearr_24058_24131 = state_24019__$1;
(statearr_24058_24131[(2)] = null);

(statearr_24058_24131[(1)] = (44));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (29))){
var inst_24003 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24059_24132 = state_24019__$1;
(statearr_24059_24132[(2)] = inst_24003);

(statearr_24059_24132[(1)] = (26));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (44))){
var inst_24012 = (state_24019[(2)]);
var state_24019__$1 = (function (){var statearr_24060 = state_24019;
(statearr_24060[(28)] = inst_24012);

return statearr_24060;
})();
var statearr_24061_24133 = state_24019__$1;
(statearr_24061_24133[(2)] = null);

(statearr_24061_24133[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (6))){
var inst_23951 = (state_24019[(29)]);
var inst_23950 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(cs) : cljs.core.deref.call(null,cs));
var inst_23951__$1 = cljs.core.keys(inst_23950);
var inst_23952 = cljs.core.count(inst_23951__$1);
var inst_23953 = (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,inst_23952) : cljs.core.reset_BANG_.call(null,dctr,inst_23952));
var inst_23958 = cljs.core.seq(inst_23951__$1);
var inst_23959 = inst_23958;
var inst_23960 = null;
var inst_23961 = (0);
var inst_23962 = (0);
var state_24019__$1 = (function (){var statearr_24062 = state_24019;
(statearr_24062[(20)] = inst_23959);

(statearr_24062[(30)] = inst_23953);

(statearr_24062[(10)] = inst_23960);

(statearr_24062[(21)] = inst_23961);

(statearr_24062[(12)] = inst_23962);

(statearr_24062[(29)] = inst_23951__$1);

return statearr_24062;
})();
var statearr_24063_24134 = state_24019__$1;
(statearr_24063_24134[(2)] = null);

(statearr_24063_24134[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (28))){
var inst_23959 = (state_24019[(20)]);
var inst_23978 = (state_24019[(25)]);
var inst_23978__$1 = cljs.core.seq(inst_23959);
var state_24019__$1 = (function (){var statearr_24064 = state_24019;
(statearr_24064[(25)] = inst_23978__$1);

return statearr_24064;
})();
if(inst_23978__$1){
var statearr_24065_24135 = state_24019__$1;
(statearr_24065_24135[(1)] = (33));

} else {
var statearr_24066_24136 = state_24019__$1;
(statearr_24066_24136[(1)] = (34));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (25))){
var inst_23961 = (state_24019[(21)]);
var inst_23962 = (state_24019[(12)]);
var inst_23964 = (inst_23962 < inst_23961);
var inst_23965 = inst_23964;
var state_24019__$1 = state_24019;
if(cljs.core.truth_(inst_23965)){
var statearr_24067_24137 = state_24019__$1;
(statearr_24067_24137[(1)] = (27));

} else {
var statearr_24068_24138 = state_24019__$1;
(statearr_24068_24138[(1)] = (28));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (34))){
var state_24019__$1 = state_24019;
var statearr_24069_24139 = state_24019__$1;
(statearr_24069_24139[(2)] = null);

(statearr_24069_24139[(1)] = (35));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (17))){
var state_24019__$1 = state_24019;
var statearr_24070_24140 = state_24019__$1;
(statearr_24070_24140[(2)] = null);

(statearr_24070_24140[(1)] = (18));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (3))){
var inst_24017 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
return cljs.core.async.impl.ioc_helpers.return_chan(state_24019__$1,inst_24017);
} else {
if((state_val_24020 === (12))){
var inst_23946 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24071_24141 = state_24019__$1;
(statearr_24071_24141[(2)] = inst_23946);

(statearr_24071_24141[(1)] = (9));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (2))){
var state_24019__$1 = state_24019;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_24019__$1,(4),ch);
} else {
if((state_val_24020 === (23))){
var state_24019__$1 = state_24019;
var statearr_24072_24142 = state_24019__$1;
(statearr_24072_24142[(2)] = null);

(statearr_24072_24142[(1)] = (24));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (35))){
var inst_24001 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24073_24143 = state_24019__$1;
(statearr_24073_24143[(2)] = inst_24001);

(statearr_24073_24143[(1)] = (29));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (19))){
var inst_23920 = (state_24019[(7)]);
var inst_23924 = cljs.core.chunk_first(inst_23920);
var inst_23925 = cljs.core.chunk_rest(inst_23920);
var inst_23926 = cljs.core.count(inst_23924);
var inst_23900 = inst_23925;
var inst_23901 = inst_23924;
var inst_23902 = inst_23926;
var inst_23903 = (0);
var state_24019__$1 = (function (){var statearr_24074 = state_24019;
(statearr_24074[(13)] = inst_23903);

(statearr_24074[(14)] = inst_23901);

(statearr_24074[(15)] = inst_23900);

(statearr_24074[(17)] = inst_23902);

return statearr_24074;
})();
var statearr_24075_24144 = state_24019__$1;
(statearr_24075_24144[(2)] = null);

(statearr_24075_24144[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (11))){
var inst_23900 = (state_24019[(15)]);
var inst_23920 = (state_24019[(7)]);
var inst_23920__$1 = cljs.core.seq(inst_23900);
var state_24019__$1 = (function (){var statearr_24076 = state_24019;
(statearr_24076[(7)] = inst_23920__$1);

return statearr_24076;
})();
if(inst_23920__$1){
var statearr_24077_24145 = state_24019__$1;
(statearr_24077_24145[(1)] = (16));

} else {
var statearr_24078_24146 = state_24019__$1;
(statearr_24078_24146[(1)] = (17));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (9))){
var inst_23948 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24079_24147 = state_24019__$1;
(statearr_24079_24147[(2)] = inst_23948);

(statearr_24079_24147[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (5))){
var inst_23898 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(cs) : cljs.core.deref.call(null,cs));
var inst_23899 = cljs.core.seq(inst_23898);
var inst_23900 = inst_23899;
var inst_23901 = null;
var inst_23902 = (0);
var inst_23903 = (0);
var state_24019__$1 = (function (){var statearr_24080 = state_24019;
(statearr_24080[(13)] = inst_23903);

(statearr_24080[(14)] = inst_23901);

(statearr_24080[(15)] = inst_23900);

(statearr_24080[(17)] = inst_23902);

return statearr_24080;
})();
var statearr_24081_24148 = state_24019__$1;
(statearr_24081_24148[(2)] = null);

(statearr_24081_24148[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (14))){
var state_24019__$1 = state_24019;
var statearr_24082_24149 = state_24019__$1;
(statearr_24082_24149[(2)] = null);

(statearr_24082_24149[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (45))){
var inst_24009 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24083_24150 = state_24019__$1;
(statearr_24083_24150[(2)] = inst_24009);

(statearr_24083_24150[(1)] = (44));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (26))){
var inst_23951 = (state_24019[(29)]);
var inst_24005 = (state_24019[(2)]);
var inst_24006 = cljs.core.seq(inst_23951);
var state_24019__$1 = (function (){var statearr_24084 = state_24019;
(statearr_24084[(31)] = inst_24005);

return statearr_24084;
})();
if(inst_24006){
var statearr_24085_24151 = state_24019__$1;
(statearr_24085_24151[(1)] = (42));

} else {
var statearr_24086_24152 = state_24019__$1;
(statearr_24086_24152[(1)] = (43));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (16))){
var inst_23920 = (state_24019[(7)]);
var inst_23922 = cljs.core.chunked_seq_QMARK_(inst_23920);
var state_24019__$1 = state_24019;
if(inst_23922){
var statearr_24087_24153 = state_24019__$1;
(statearr_24087_24153[(1)] = (19));

} else {
var statearr_24088_24154 = state_24019__$1;
(statearr_24088_24154[(1)] = (20));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (38))){
var inst_23998 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24089_24155 = state_24019__$1;
(statearr_24089_24155[(2)] = inst_23998);

(statearr_24089_24155[(1)] = (35));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (30))){
var state_24019__$1 = state_24019;
var statearr_24090_24156 = state_24019__$1;
(statearr_24090_24156[(2)] = null);

(statearr_24090_24156[(1)] = (32));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (10))){
var inst_23903 = (state_24019[(13)]);
var inst_23901 = (state_24019[(14)]);
var inst_23909 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(inst_23901,inst_23903);
var inst_23910 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_23909,(0),null);
var inst_23911 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_23909,(1),null);
var state_24019__$1 = (function (){var statearr_24091 = state_24019;
(statearr_24091[(26)] = inst_23910);

return statearr_24091;
})();
if(cljs.core.truth_(inst_23911)){
var statearr_24092_24157 = state_24019__$1;
(statearr_24092_24157[(1)] = (13));

} else {
var statearr_24093_24158 = state_24019__$1;
(statearr_24093_24158[(1)] = (14));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (18))){
var inst_23944 = (state_24019[(2)]);
var state_24019__$1 = state_24019;
var statearr_24094_24159 = state_24019__$1;
(statearr_24094_24159[(2)] = inst_23944);

(statearr_24094_24159[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (42))){
var state_24019__$1 = state_24019;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_24019__$1,(45),dchan);
} else {
if((state_val_24020 === (37))){
var inst_23891 = (state_24019[(9)]);
var inst_23987 = (state_24019[(23)]);
var inst_23978 = (state_24019[(25)]);
var inst_23987__$1 = cljs.core.first(inst_23978);
var inst_23988 = cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3(inst_23987__$1,inst_23891,done);
var state_24019__$1 = (function (){var statearr_24095 = state_24019;
(statearr_24095[(23)] = inst_23987__$1);

return statearr_24095;
})();
if(cljs.core.truth_(inst_23988)){
var statearr_24096_24160 = state_24019__$1;
(statearr_24096_24160[(1)] = (39));

} else {
var statearr_24097_24161 = state_24019__$1;
(statearr_24097_24161[(1)] = (40));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24020 === (8))){
var inst_23903 = (state_24019[(13)]);
var inst_23902 = (state_24019[(17)]);
var inst_23905 = (inst_23903 < inst_23902);
var inst_23906 = inst_23905;
var state_24019__$1 = state_24019;
if(cljs.core.truth_(inst_23906)){
var statearr_24098_24162 = state_24019__$1;
(statearr_24098_24162[(1)] = (10));

} else {
var statearr_24099_24163 = state_24019__$1;
(statearr_24099_24163[(1)] = (11));

}

return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24109,cs,m,dchan,dctr,done))
;
return ((function (switch__22676__auto__,c__22790__auto___24109,cs,m,dchan,dctr,done){
return (function() {
var cljs$core$async$mult_$_state_machine__22677__auto__ = null;
var cljs$core$async$mult_$_state_machine__22677__auto____0 = (function (){
var statearr_24103 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24103[(0)] = cljs$core$async$mult_$_state_machine__22677__auto__);

(statearr_24103[(1)] = (1));

return statearr_24103;
});
var cljs$core$async$mult_$_state_machine__22677__auto____1 = (function (state_24019){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24019);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24104){if((e24104 instanceof Object)){
var ex__22680__auto__ = e24104;
var statearr_24105_24164 = state_24019;
(statearr_24105_24164[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24019);

return cljs.core.cst$kw$recur;
} else {
throw e24104;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24165 = state_24019;
state_24019 = G__24165;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__22677__auto__ = function(state_24019){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__22677__auto____1.call(this,state_24019);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__22677__auto____0;
cljs$core$async$mult_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__22677__auto____1;
return cljs$core$async$mult_$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24109,cs,m,dchan,dctr,done))
})();
var state__22792__auto__ = (function (){var statearr_24106 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24106[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24109);

return statearr_24106;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24109,cs,m,dchan,dctr,done))
);


return m;
});
/**
 * Copies the mult source onto the supplied channel.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.tap = (function cljs$core$async$tap(var_args){
var args24166 = [];
var len__7291__auto___24169 = arguments.length;
var i__7292__auto___24170 = (0);
while(true){
if((i__7292__auto___24170 < len__7291__auto___24169)){
args24166.push((arguments[i__7292__auto___24170]));

var G__24171 = (i__7292__auto___24170 + (1));
i__7292__auto___24170 = G__24171;
continue;
} else {
}
break;
}

var G__24168 = args24166.length;
switch (G__24168) {
case 2:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24166.length)].join('')));

}
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2 = (function (mult,ch){
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(mult,ch,true);
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3 = (function (mult,ch,close_QMARK_){
cljs.core.async.tap_STAR_(mult,ch,close_QMARK_);

return ch;
});

cljs.core.async.tap.cljs$lang$maxFixedArity = 3;
/**
 * Disconnects a target channel from a mult
 */
cljs.core.async.untap = (function cljs$core$async$untap(mult,ch){
return cljs.core.async.untap_STAR_(mult,ch);
});
/**
 * Disconnects all target channels from a mult
 */
cljs.core.async.untap_all = (function cljs$core$async$untap_all(mult){
return cljs.core.async.untap_all_STAR_(mult);
});

/**
 * @interface
 */
cljs.core.async.Mix = function(){};

cljs.core.async.admix_STAR_ = (function cljs$core$async$admix_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mix$admix_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$admix_STAR_$arity$2(m,ch);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.admix_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto__.call(null,m,ch));
} else {
var m__6880__auto____$1 = (cljs.core.async.admix_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto____$1.call(null,m,ch));
} else {
throw cljs.core.missing_protocol("Mix.admix*",m);
}
}
}
});

cljs.core.async.unmix_STAR_ = (function cljs$core$async$unmix_STAR_(m,ch){
if((!((m == null))) && (!((m.cljs$core$async$Mix$unmix_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$unmix_STAR_$arity$2(m,ch);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.unmix_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto__.call(null,m,ch));
} else {
var m__6880__auto____$1 = (cljs.core.async.unmix_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(m,ch) : m__6880__auto____$1.call(null,m,ch));
} else {
throw cljs.core.missing_protocol("Mix.unmix*",m);
}
}
}
});

cljs.core.async.unmix_all_STAR_ = (function cljs$core$async$unmix_all_STAR_(m){
if((!((m == null))) && (!((m.cljs$core$async$Mix$unmix_all_STAR_$arity$1 == null)))){
return m.cljs$core$async$Mix$unmix_all_STAR_$arity$1(m);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.unmix_all_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(m) : m__6880__auto__.call(null,m));
} else {
var m__6880__auto____$1 = (cljs.core.async.unmix_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(m) : m__6880__auto____$1.call(null,m));
} else {
throw cljs.core.missing_protocol("Mix.unmix-all*",m);
}
}
}
});

cljs.core.async.toggle_STAR_ = (function cljs$core$async$toggle_STAR_(m,state_map){
if((!((m == null))) && (!((m.cljs$core$async$Mix$toggle_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$toggle_STAR_$arity$2(m,state_map);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.toggle_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(m,state_map) : m__6880__auto__.call(null,m,state_map));
} else {
var m__6880__auto____$1 = (cljs.core.async.toggle_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(m,state_map) : m__6880__auto____$1.call(null,m,state_map));
} else {
throw cljs.core.missing_protocol("Mix.toggle*",m);
}
}
}
});

cljs.core.async.solo_mode_STAR_ = (function cljs$core$async$solo_mode_STAR_(m,mode){
if((!((m == null))) && (!((m.cljs$core$async$Mix$solo_mode_STAR_$arity$2 == null)))){
return m.cljs$core$async$Mix$solo_mode_STAR_$arity$2(m,mode);
} else {
var x__6879__auto__ = (((m == null))?null:m);
var m__6880__auto__ = (cljs.core.async.solo_mode_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(m,mode) : m__6880__auto__.call(null,m,mode));
} else {
var m__6880__auto____$1 = (cljs.core.async.solo_mode_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(m,mode) : m__6880__auto____$1.call(null,m,mode));
} else {
throw cljs.core.missing_protocol("Mix.solo-mode*",m);
}
}
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__7298__auto__ = [];
var len__7291__auto___24183 = arguments.length;
var i__7292__auto___24184 = (0);
while(true){
if((i__7292__auto___24184 < len__7291__auto___24183)){
args__7298__auto__.push((arguments[i__7292__auto___24184]));

var G__24185 = (i__7292__auto___24184 + (1));
i__7292__auto___24184 = G__24185;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((3) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((3)),(0),null)):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__7299__auto__);
});

cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__24177){
var map__24178 = p__24177;
var map__24178__$1 = ((((!((map__24178 == null)))?((((map__24178.cljs$lang$protocol_mask$partition0$ & (64))) || (map__24178.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,map__24178):map__24178);
var opts = map__24178__$1;
var statearr_24180_24186 = state;
(statearr_24180_24186[cljs.core.async.impl.ioc_helpers.STATE_IDX] = cont_block);


var temp__4657__auto__ = cljs.core.async.do_alts(((function (map__24178,map__24178__$1,opts){
return (function (val){
var statearr_24181_24187 = state;
(statearr_24181_24187[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state);
});})(map__24178,map__24178__$1,opts))
,ports,opts);
if(cljs.core.truth_(temp__4657__auto__)){
var cb = temp__4657__auto__;
var statearr_24182_24188 = state;
(statearr_24182_24188[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(cb) : cljs.core.deref.call(null,cb)));


return cljs.core.cst$kw$recur;
} else {
return null;
}
});

cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3);

cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq24173){
var G__24174 = cljs.core.first(seq24173);
var seq24173__$1 = cljs.core.next(seq24173);
var G__24175 = cljs.core.first(seq24173__$1);
var seq24173__$2 = cljs.core.next(seq24173__$1);
var G__24176 = cljs.core.first(seq24173__$2);
var seq24173__$3 = cljs.core.next(seq24173__$2);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__24174,G__24175,G__24176,seq24173__$3);
});
/**
 * Creates and returns a mix of one or more input channels which will
 *   be put on the supplied out channel. Input sources can be added to
 *   the mix with 'admix', and removed with 'unmix'. A mix supports
 *   soloing, muting and pausing multiple inputs atomically using
 *   'toggle', and can solo using either muting or pausing as determined
 *   by 'solo-mode'.
 * 
 *   Each channel can have zero or more boolean modes set via 'toggle':
 * 
 *   :solo - when true, only this (ond other soloed) channel(s) will appear
 *        in the mix output channel. :mute and :pause states of soloed
 *        channels are ignored. If solo-mode is :mute, non-soloed
 *        channels are muted, if :pause, non-soloed channels are
 *        paused.
 * 
 *   :mute - muted channels will have their contents consumed but not included in the mix
 *   :pause - paused channels will not have their contents consumed (and thus also not included in the mix)
 */
cljs.core.async.mix = (function cljs$core$async$mix(out){
var cs = (function (){var G__24355 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__24355) : cljs.core.atom.call(null,G__24355));
})();
var solo_modes = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$pause,null,cljs.core.cst$kw$mute,null], null), null);
var attrs = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(solo_modes,cljs.core.cst$kw$solo);
var solo_mode = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.cst$kw$mute) : cljs.core.atom.call(null,cljs.core.cst$kw$mute));
var change = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0();
var changed = ((function (cs,solo_modes,attrs,solo_mode,change){
return (function (){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(change,true);
});})(cs,solo_modes,attrs,solo_mode,change))
;
var pick = ((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (attr,chs){
return cljs.core.reduce_kv(((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (ret,c,v){
if(cljs.core.truth_((attr.cljs$core$IFn$_invoke$arity$1 ? attr.cljs$core$IFn$_invoke$arity$1(v) : attr.call(null,v)))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(ret,c);
} else {
return ret;
}
});})(cs,solo_modes,attrs,solo_mode,change,changed))
,cljs.core.PersistentHashSet.EMPTY,chs);
});})(cs,solo_modes,attrs,solo_mode,change,changed))
;
var calc_state = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick){
return (function (){
var chs = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(cs) : cljs.core.deref.call(null,cs));
var mode = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(solo_mode) : cljs.core.deref.call(null,solo_mode));
var solos = pick(cljs.core.cst$kw$solo,chs);
var pauses = pick(cljs.core.cst$kw$pause,chs);
return new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$solos,solos,cljs.core.cst$kw$mutes,pick(cljs.core.cst$kw$mute,chs),cljs.core.cst$kw$reads,cljs.core.conj.cljs$core$IFn$_invoke$arity$2((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(mode,cljs.core.cst$kw$pause)) && (!(cljs.core.empty_QMARK_(solos))))?cljs.core.vec(solos):cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(pauses,cljs.core.keys(chs)))),change)], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick))
;
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async24356 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async24356 = (function (change,mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta24357){
this.change = change;
this.mix = mix;
this.solo_mode = solo_mode;
this.pick = pick;
this.cs = cs;
this.calc_state = calc_state;
this.out = out;
this.changed = changed;
this.solo_modes = solo_modes;
this.attrs = attrs;
this.meta24357 = meta24357;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_24358,meta24357__$1){
var self__ = this;
var _24358__$1 = this;
return (new cljs.core.async.t_cljs$core$async24356(self__.change,self__.mix,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta24357__$1));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_24358){
var self__ = this;
var _24358__$1 = this;
return self__.meta24357;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$ = true;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.dissoc,ch);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
var G__24359_24521 = self__.cs;
var G__24360_24522 = cljs.core.PersistentArrayMap.EMPTY;
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__24359_24521,G__24360_24522) : cljs.core.reset_BANG_.call(null,G__24359_24521,G__24360_24522));

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.cs,cljs.core.partial.cljs$core$IFn$_invoke$arity$2(cljs.core.merge_with,cljs.core.merge),state_map);

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.solo_modes.cljs$core$IFn$_invoke$arity$1 ? self__.solo_modes.cljs$core$IFn$_invoke$arity$1(mode) : self__.solo_modes.call(null,mode)))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("mode must be one of: "),cljs.core.str(self__.solo_modes)].join('')),cljs.core.str("\n"),cljs.core.str("(solo-modes mode)")].join('')));
}

(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(self__.solo_mode,mode) : cljs.core.reset_BANG_.call(null,self__.solo_mode,mode));

return (self__.changed.cljs$core$IFn$_invoke$arity$0 ? self__.changed.cljs$core$IFn$_invoke$arity$0() : self__.changed.call(null));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.getBasis = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (){
return new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$change,cljs.core.with_meta(cljs.core.cst$sym$mix,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$out], null))),cljs.core.cst$kw$doc,"Creates and returns a mix of one or more input channels which will\n  be put on the supplied out channel. Input sources can be added to\n  the mix with 'admix', and removed with 'unmix'. A mix supports\n  soloing, muting and pausing multiple inputs atomically using\n  'toggle', and can solo using either muting or pausing as determined\n  by 'solo-mode'.\n\n  Each channel can have zero or more boolean modes set via 'toggle':\n\n  :solo - when true, only this (ond other soloed) channel(s) will appear\n          in the mix output channel. :mute and :pause states of soloed\n          channels are ignored. If solo-mode is :mute, non-soloed\n          channels are muted, if :pause, non-soloed channels are\n          paused.\n\n  :mute - muted channels will have their contents consumed but not included in the mix\n  :pause - paused channels will not have their contents consumed (and thus also not included in the mix)\n"], null)),cljs.core.cst$sym$solo_DASH_mode,cljs.core.cst$sym$pick,cljs.core.cst$sym$cs,cljs.core.cst$sym$calc_DASH_state,cljs.core.cst$sym$out,cljs.core.cst$sym$changed,cljs.core.cst$sym$solo_DASH_modes,cljs.core.cst$sym$attrs,cljs.core.cst$sym$meta24357], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async24356.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async24356.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async24356";

cljs.core.async.t_cljs$core$async24356.cljs$lang$ctorPrWriter = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async24356");
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.__GT_t_cljs$core$async24356 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function cljs$core$async$mix_$___GT_t_cljs$core$async24356(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta24357){
return (new cljs.core.async.t_cljs$core$async24356(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta24357));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

}

return (new cljs.core.async.t_cljs$core$async24356(change,cljs$core$async$mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__22790__auto___24523 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (state_24458){
var state_val_24459 = (state_24458[(1)]);
if((state_val_24459 === (7))){
var inst_24376 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
var statearr_24460_24524 = state_24458__$1;
(statearr_24460_24524[(2)] = inst_24376);

(statearr_24460_24524[(1)] = (4));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (20))){
var inst_24388 = (state_24458[(7)]);
var state_24458__$1 = state_24458;
var statearr_24461_24525 = state_24458__$1;
(statearr_24461_24525[(2)] = inst_24388);

(statearr_24461_24525[(1)] = (21));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (27))){
var state_24458__$1 = state_24458;
var statearr_24462_24526 = state_24458__$1;
(statearr_24462_24526[(2)] = null);

(statearr_24462_24526[(1)] = (28));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (1))){
var inst_24364 = (state_24458[(8)]);
var inst_24364__$1 = calc_state();
var inst_24366 = (inst_24364__$1 == null);
var inst_24367 = cljs.core.not(inst_24366);
var state_24458__$1 = (function (){var statearr_24463 = state_24458;
(statearr_24463[(8)] = inst_24364__$1);

return statearr_24463;
})();
if(inst_24367){
var statearr_24464_24527 = state_24458__$1;
(statearr_24464_24527[(1)] = (2));

} else {
var statearr_24465_24528 = state_24458__$1;
(statearr_24465_24528[(1)] = (3));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (24))){
var inst_24411 = (state_24458[(9)]);
var inst_24418 = (state_24458[(10)]);
var inst_24432 = (state_24458[(11)]);
var inst_24432__$1 = (inst_24411.cljs$core$IFn$_invoke$arity$1 ? inst_24411.cljs$core$IFn$_invoke$arity$1(inst_24418) : inst_24411.call(null,inst_24418));
var state_24458__$1 = (function (){var statearr_24466 = state_24458;
(statearr_24466[(11)] = inst_24432__$1);

return statearr_24466;
})();
if(cljs.core.truth_(inst_24432__$1)){
var statearr_24467_24529 = state_24458__$1;
(statearr_24467_24529[(1)] = (29));

} else {
var statearr_24468_24530 = state_24458__$1;
(statearr_24468_24530[(1)] = (30));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (4))){
var inst_24379 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24379)){
var statearr_24469_24531 = state_24458__$1;
(statearr_24469_24531[(1)] = (8));

} else {
var statearr_24470_24532 = state_24458__$1;
(statearr_24470_24532[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (15))){
var inst_24405 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24405)){
var statearr_24471_24533 = state_24458__$1;
(statearr_24471_24533[(1)] = (19));

} else {
var statearr_24472_24534 = state_24458__$1;
(statearr_24472_24534[(1)] = (20));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (21))){
var inst_24410 = (state_24458[(12)]);
var inst_24410__$1 = (state_24458[(2)]);
var inst_24411 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24410__$1,cljs.core.cst$kw$solos);
var inst_24412 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24410__$1,cljs.core.cst$kw$mutes);
var inst_24413 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24410__$1,cljs.core.cst$kw$reads);
var state_24458__$1 = (function (){var statearr_24473 = state_24458;
(statearr_24473[(9)] = inst_24411);

(statearr_24473[(12)] = inst_24410__$1);

(statearr_24473[(13)] = inst_24412);

return statearr_24473;
})();
return cljs.core.async.ioc_alts_BANG_(state_24458__$1,(22),inst_24413);
} else {
if((state_val_24459 === (31))){
var inst_24440 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24440)){
var statearr_24474_24535 = state_24458__$1;
(statearr_24474_24535[(1)] = (32));

} else {
var statearr_24475_24536 = state_24458__$1;
(statearr_24475_24536[(1)] = (33));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (32))){
var inst_24417 = (state_24458[(14)]);
var state_24458__$1 = state_24458;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_24458__$1,(35),out,inst_24417);
} else {
if((state_val_24459 === (33))){
var inst_24410 = (state_24458[(12)]);
var inst_24388 = inst_24410;
var state_24458__$1 = (function (){var statearr_24476 = state_24458;
(statearr_24476[(7)] = inst_24388);

return statearr_24476;
})();
var statearr_24477_24537 = state_24458__$1;
(statearr_24477_24537[(2)] = null);

(statearr_24477_24537[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (13))){
var inst_24388 = (state_24458[(7)]);
var inst_24395 = inst_24388.cljs$lang$protocol_mask$partition0$;
var inst_24396 = (inst_24395 & (64));
var inst_24397 = inst_24388.cljs$core$ISeq$;
var inst_24398 = (inst_24396) || (inst_24397);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24398)){
var statearr_24478_24538 = state_24458__$1;
(statearr_24478_24538[(1)] = (16));

} else {
var statearr_24479_24539 = state_24458__$1;
(statearr_24479_24539[(1)] = (17));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (22))){
var inst_24417 = (state_24458[(14)]);
var inst_24418 = (state_24458[(10)]);
var inst_24416 = (state_24458[(2)]);
var inst_24417__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_24416,(0),null);
var inst_24418__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_24416,(1),null);
var inst_24419 = (inst_24417__$1 == null);
var inst_24420 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_24418__$1,change);
var inst_24421 = (inst_24419) || (inst_24420);
var state_24458__$1 = (function (){var statearr_24480 = state_24458;
(statearr_24480[(14)] = inst_24417__$1);

(statearr_24480[(10)] = inst_24418__$1);

return statearr_24480;
})();
if(cljs.core.truth_(inst_24421)){
var statearr_24481_24540 = state_24458__$1;
(statearr_24481_24540[(1)] = (23));

} else {
var statearr_24482_24541 = state_24458__$1;
(statearr_24482_24541[(1)] = (24));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (36))){
var inst_24410 = (state_24458[(12)]);
var inst_24388 = inst_24410;
var state_24458__$1 = (function (){var statearr_24483 = state_24458;
(statearr_24483[(7)] = inst_24388);

return statearr_24483;
})();
var statearr_24484_24542 = state_24458__$1;
(statearr_24484_24542[(2)] = null);

(statearr_24484_24542[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (29))){
var inst_24432 = (state_24458[(11)]);
var state_24458__$1 = state_24458;
var statearr_24485_24543 = state_24458__$1;
(statearr_24485_24543[(2)] = inst_24432);

(statearr_24485_24543[(1)] = (31));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (6))){
var state_24458__$1 = state_24458;
var statearr_24486_24544 = state_24458__$1;
(statearr_24486_24544[(2)] = false);

(statearr_24486_24544[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (28))){
var inst_24428 = (state_24458[(2)]);
var inst_24429 = calc_state();
var inst_24388 = inst_24429;
var state_24458__$1 = (function (){var statearr_24487 = state_24458;
(statearr_24487[(15)] = inst_24428);

(statearr_24487[(7)] = inst_24388);

return statearr_24487;
})();
var statearr_24488_24545 = state_24458__$1;
(statearr_24488_24545[(2)] = null);

(statearr_24488_24545[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (25))){
var inst_24454 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
var statearr_24489_24546 = state_24458__$1;
(statearr_24489_24546[(2)] = inst_24454);

(statearr_24489_24546[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (34))){
var inst_24452 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
var statearr_24490_24547 = state_24458__$1;
(statearr_24490_24547[(2)] = inst_24452);

(statearr_24490_24547[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (17))){
var state_24458__$1 = state_24458;
var statearr_24491_24548 = state_24458__$1;
(statearr_24491_24548[(2)] = false);

(statearr_24491_24548[(1)] = (18));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (3))){
var state_24458__$1 = state_24458;
var statearr_24492_24549 = state_24458__$1;
(statearr_24492_24549[(2)] = false);

(statearr_24492_24549[(1)] = (4));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (12))){
var inst_24456 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
return cljs.core.async.impl.ioc_helpers.return_chan(state_24458__$1,inst_24456);
} else {
if((state_val_24459 === (2))){
var inst_24364 = (state_24458[(8)]);
var inst_24369 = inst_24364.cljs$lang$protocol_mask$partition0$;
var inst_24370 = (inst_24369 & (64));
var inst_24371 = inst_24364.cljs$core$ISeq$;
var inst_24372 = (inst_24370) || (inst_24371);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24372)){
var statearr_24493_24550 = state_24458__$1;
(statearr_24493_24550[(1)] = (5));

} else {
var statearr_24494_24551 = state_24458__$1;
(statearr_24494_24551[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (23))){
var inst_24417 = (state_24458[(14)]);
var inst_24423 = (inst_24417 == null);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24423)){
var statearr_24495_24552 = state_24458__$1;
(statearr_24495_24552[(1)] = (26));

} else {
var statearr_24496_24553 = state_24458__$1;
(statearr_24496_24553[(1)] = (27));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (35))){
var inst_24443 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
if(cljs.core.truth_(inst_24443)){
var statearr_24497_24554 = state_24458__$1;
(statearr_24497_24554[(1)] = (36));

} else {
var statearr_24498_24555 = state_24458__$1;
(statearr_24498_24555[(1)] = (37));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (19))){
var inst_24388 = (state_24458[(7)]);
var inst_24407 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,inst_24388);
var state_24458__$1 = state_24458;
var statearr_24499_24556 = state_24458__$1;
(statearr_24499_24556[(2)] = inst_24407);

(statearr_24499_24556[(1)] = (21));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (11))){
var inst_24388 = (state_24458[(7)]);
var inst_24392 = (inst_24388 == null);
var inst_24393 = cljs.core.not(inst_24392);
var state_24458__$1 = state_24458;
if(inst_24393){
var statearr_24500_24557 = state_24458__$1;
(statearr_24500_24557[(1)] = (13));

} else {
var statearr_24501_24558 = state_24458__$1;
(statearr_24501_24558[(1)] = (14));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (9))){
var inst_24364 = (state_24458[(8)]);
var state_24458__$1 = state_24458;
var statearr_24502_24559 = state_24458__$1;
(statearr_24502_24559[(2)] = inst_24364);

(statearr_24502_24559[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (5))){
var state_24458__$1 = state_24458;
var statearr_24503_24560 = state_24458__$1;
(statearr_24503_24560[(2)] = true);

(statearr_24503_24560[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (14))){
var state_24458__$1 = state_24458;
var statearr_24504_24561 = state_24458__$1;
(statearr_24504_24561[(2)] = false);

(statearr_24504_24561[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (26))){
var inst_24418 = (state_24458[(10)]);
var inst_24425 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(cs,cljs.core.dissoc,inst_24418);
var state_24458__$1 = state_24458;
var statearr_24505_24562 = state_24458__$1;
(statearr_24505_24562[(2)] = inst_24425);

(statearr_24505_24562[(1)] = (28));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (16))){
var state_24458__$1 = state_24458;
var statearr_24506_24563 = state_24458__$1;
(statearr_24506_24563[(2)] = true);

(statearr_24506_24563[(1)] = (18));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (38))){
var inst_24448 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
var statearr_24507_24564 = state_24458__$1;
(statearr_24507_24564[(2)] = inst_24448);

(statearr_24507_24564[(1)] = (34));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (30))){
var inst_24411 = (state_24458[(9)]);
var inst_24418 = (state_24458[(10)]);
var inst_24412 = (state_24458[(13)]);
var inst_24435 = cljs.core.empty_QMARK_(inst_24411);
var inst_24436 = (inst_24412.cljs$core$IFn$_invoke$arity$1 ? inst_24412.cljs$core$IFn$_invoke$arity$1(inst_24418) : inst_24412.call(null,inst_24418));
var inst_24437 = cljs.core.not(inst_24436);
var inst_24438 = (inst_24435) && (inst_24437);
var state_24458__$1 = state_24458;
var statearr_24508_24565 = state_24458__$1;
(statearr_24508_24565[(2)] = inst_24438);

(statearr_24508_24565[(1)] = (31));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (10))){
var inst_24364 = (state_24458[(8)]);
var inst_24384 = (state_24458[(2)]);
var inst_24385 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24384,cljs.core.cst$kw$solos);
var inst_24386 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24384,cljs.core.cst$kw$mutes);
var inst_24387 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24384,cljs.core.cst$kw$reads);
var inst_24388 = inst_24364;
var state_24458__$1 = (function (){var statearr_24509 = state_24458;
(statearr_24509[(7)] = inst_24388);

(statearr_24509[(16)] = inst_24385);

(statearr_24509[(17)] = inst_24386);

(statearr_24509[(18)] = inst_24387);

return statearr_24509;
})();
var statearr_24510_24566 = state_24458__$1;
(statearr_24510_24566[(2)] = null);

(statearr_24510_24566[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (18))){
var inst_24402 = (state_24458[(2)]);
var state_24458__$1 = state_24458;
var statearr_24511_24567 = state_24458__$1;
(statearr_24511_24567[(2)] = inst_24402);

(statearr_24511_24567[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (37))){
var state_24458__$1 = state_24458;
var statearr_24512_24568 = state_24458__$1;
(statearr_24512_24568[(2)] = null);

(statearr_24512_24568[(1)] = (38));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24459 === (8))){
var inst_24364 = (state_24458[(8)]);
var inst_24381 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map,inst_24364);
var state_24458__$1 = state_24458;
var statearr_24513_24569 = state_24458__$1;
(statearr_24513_24569[(2)] = inst_24381);

(statearr_24513_24569[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
;
return ((function (switch__22676__auto__,c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function() {
var cljs$core$async$mix_$_state_machine__22677__auto__ = null;
var cljs$core$async$mix_$_state_machine__22677__auto____0 = (function (){
var statearr_24517 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24517[(0)] = cljs$core$async$mix_$_state_machine__22677__auto__);

(statearr_24517[(1)] = (1));

return statearr_24517;
});
var cljs$core$async$mix_$_state_machine__22677__auto____1 = (function (state_24458){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24458);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24518){if((e24518 instanceof Object)){
var ex__22680__auto__ = e24518;
var statearr_24519_24570 = state_24458;
(statearr_24519_24570[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24458);

return cljs.core.cst$kw$recur;
} else {
throw e24518;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24571 = state_24458;
state_24458 = G__24571;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__22677__auto__ = function(state_24458){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__22677__auto____1.call(this,state_24458);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__22677__auto____0;
cljs$core$async$mix_$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__22677__auto____1;
return cljs$core$async$mix_$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
})();
var state__22792__auto__ = (function (){var statearr_24520 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24520[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24523);

return statearr_24520;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24523,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
);


return m;
});
/**
 * Adds ch as an input to the mix
 */
cljs.core.async.admix = (function cljs$core$async$admix(mix,ch){
return cljs.core.async.admix_STAR_(mix,ch);
});
/**
 * Removes ch as an input to the mix
 */
cljs.core.async.unmix = (function cljs$core$async$unmix(mix,ch){
return cljs.core.async.unmix_STAR_(mix,ch);
});
/**
 * removes all inputs from the mix
 */
cljs.core.async.unmix_all = (function cljs$core$async$unmix_all(mix){
return cljs.core.async.unmix_all_STAR_(mix);
});
/**
 * Atomically sets the state(s) of one or more channels in a mix. The
 *   state map is a map of channels -> channel-state-map. A
 *   channel-state-map is a map of attrs -> boolean, where attr is one or
 *   more of :mute, :pause or :solo. Any states supplied are merged with
 *   the current state.
 * 
 *   Note that channels can be added to a mix via toggle, which can be
 *   used to add channels in a particular (e.g. paused) state.
 */
cljs.core.async.toggle = (function cljs$core$async$toggle(mix,state_map){
return cljs.core.async.toggle_STAR_(mix,state_map);
});
/**
 * Sets the solo mode of the mix. mode must be one of :mute or :pause
 */
cljs.core.async.solo_mode = (function cljs$core$async$solo_mode(mix,mode){
return cljs.core.async.solo_mode_STAR_(mix,mode);
});

/**
 * @interface
 */
cljs.core.async.Pub = function(){};

cljs.core.async.sub_STAR_ = (function cljs$core$async$sub_STAR_(p,v,ch,close_QMARK_){
if((!((p == null))) && (!((p.cljs$core$async$Pub$sub_STAR_$arity$4 == null)))){
return p.cljs$core$async$Pub$sub_STAR_$arity$4(p,v,ch,close_QMARK_);
} else {
var x__6879__auto__ = (((p == null))?null:p);
var m__6880__auto__ = (cljs.core.async.sub_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$4 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$4(p,v,ch,close_QMARK_) : m__6880__auto__.call(null,p,v,ch,close_QMARK_));
} else {
var m__6880__auto____$1 = (cljs.core.async.sub_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$4 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$4(p,v,ch,close_QMARK_) : m__6880__auto____$1.call(null,p,v,ch,close_QMARK_));
} else {
throw cljs.core.missing_protocol("Pub.sub*",p);
}
}
}
});

cljs.core.async.unsub_STAR_ = (function cljs$core$async$unsub_STAR_(p,v,ch){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_STAR_$arity$3 == null)))){
return p.cljs$core$async$Pub$unsub_STAR_$arity$3(p,v,ch);
} else {
var x__6879__auto__ = (((p == null))?null:p);
var m__6880__auto__ = (cljs.core.async.unsub_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$3 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$3(p,v,ch) : m__6880__auto__.call(null,p,v,ch));
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$3 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$3(p,v,ch) : m__6880__auto____$1.call(null,p,v,ch));
} else {
throw cljs.core.missing_protocol("Pub.unsub*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var args24572 = [];
var len__7291__auto___24575 = arguments.length;
var i__7292__auto___24576 = (0);
while(true){
if((i__7292__auto___24576 < len__7291__auto___24575)){
args24572.push((arguments[i__7292__auto___24576]));

var G__24577 = (i__7292__auto___24576 + (1));
i__7292__auto___24576 = G__24577;
continue;
} else {
}
break;
}

var G__24574 = args24572.length;
switch (G__24574) {
case 1:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24572.length)].join('')));

}
});

cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1 = (function (p){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$1 == null)))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$1(p);
} else {
var x__6879__auto__ = (((p == null))?null:p);
var m__6880__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$1(p) : m__6880__auto__.call(null,p));
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$1(p) : m__6880__auto____$1.call(null,p));
} else {
throw cljs.core.missing_protocol("Pub.unsub-all*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2 = (function (p,v){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$2 == null)))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$2(p,v);
} else {
var x__6879__auto__ = (((p == null))?null:p);
var m__6880__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return (m__6880__auto__.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto__.cljs$core$IFn$_invoke$arity$2(p,v) : m__6880__auto__.call(null,p,v));
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return (m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2 ? m__6880__auto____$1.cljs$core$IFn$_invoke$arity$2(p,v) : m__6880__auto____$1.call(null,p,v));
} else {
throw cljs.core.missing_protocol("Pub.unsub-all*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_.cljs$lang$maxFixedArity = 2;

/**
 * Creates and returns a pub(lication) of the supplied channel,
 *   partitioned into topics by the topic-fn. topic-fn will be applied to
 *   each value on the channel and the result will determine the 'topic'
 *   on which that value will be put. Channels can be subscribed to
 *   receive copies of topics using 'sub', and unsubscribed using
 *   'unsub'. Each topic will be handled by an internal mult on a
 *   dedicated channel. By default these internal channels are
 *   unbuffered, but a buf-fn can be supplied which, given a topic,
 *   creates a buffer with desired properties.
 * 
 *   Each item is distributed to all subs in parallel and synchronously,
 *   i.e. each sub must accept before the next item is distributed. Use
 *   buffering/windowing to prevent slow subs from holding up the pub.
 * 
 *   Items received when there are no matching subs get dropped.
 * 
 *   Note that if buf-fns are used then each topic is handled
 *   asynchronously, i.e. if a channel is subscribed to more than one
 *   topic it should not expect them to be interleaved identically with
 *   the source.
 */
cljs.core.async.pub = (function cljs$core$async$pub(var_args){
var args24580 = [];
var len__7291__auto___24708 = arguments.length;
var i__7292__auto___24709 = (0);
while(true){
if((i__7292__auto___24709 < len__7291__auto___24708)){
args24580.push((arguments[i__7292__auto___24709]));

var G__24710 = (i__7292__auto___24709 + (1));
i__7292__auto___24709 = G__24710;
continue;
} else {
}
break;
}

var G__24582 = args24580.length;
switch (G__24582) {
case 2:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24580.length)].join('')));

}
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2 = (function (ch,topic_fn){
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3(ch,topic_fn,cljs.core.constantly(null));
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3 = (function (ch,topic_fn,buf_fn){
var mults = (function (){var G__24583 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__24583) : cljs.core.atom.call(null,G__24583));
})();
var ensure_mult = ((function (mults){
return (function (topic){
var or__6216__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(mults) : cljs.core.deref.call(null,mults)),topic);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(mults,((function (or__6216__auto__,mults){
return (function (p1__24579_SHARP_){
if(cljs.core.truth_((p1__24579_SHARP_.cljs$core$IFn$_invoke$arity$1 ? p1__24579_SHARP_.cljs$core$IFn$_invoke$arity$1(topic) : p1__24579_SHARP_.call(null,topic)))){
return p1__24579_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__24579_SHARP_,topic,cljs.core.async.mult(cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((buf_fn.cljs$core$IFn$_invoke$arity$1 ? buf_fn.cljs$core$IFn$_invoke$arity$1(topic) : buf_fn.call(null,topic)))));
}
});})(or__6216__auto__,mults))
),topic);
}
});})(mults))
;
var p = (function (){
if(typeof cljs.core.async.t_cljs$core$async24584 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Pub}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async24584 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta24585){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta24585 = meta24585;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (mults,ensure_mult){
return (function (_24586,meta24585__$1){
var self__ = this;
var _24586__$1 = this;
return (new cljs.core.async.t_cljs$core$async24584(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta24585__$1));
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (mults,ensure_mult){
return (function (_24586){
var self__ = this;
var _24586__$1 = this;
return self__.meta24585;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Pub$ = true;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = (self__.ensure_mult.cljs$core$IFn$_invoke$arity$1 ? self__.ensure_mult.cljs$core$IFn$_invoke$arity$1(topic) : self__.ensure_mult.call(null,topic));
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3(m,ch__$1,close_QMARK_);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1){
var self__ = this;
var p__$1 = this;
var temp__4657__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(self__.mults) : cljs.core.deref.call(null,self__.mults)),topic);
if(cljs.core.truth_(temp__4657__auto__)){
var m = temp__4657__auto__;
return cljs.core.async.untap(m,ch__$1);
} else {
return null;
}
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
var G__24587 = self__.mults;
var G__24588 = cljs.core.PersistentArrayMap.EMPTY;
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__24587,G__24588) : cljs.core.reset_BANG_.call(null,G__24587,G__24588));
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = ((function (mults,ensure_mult){
return (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.mults,cljs.core.dissoc,topic);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.getBasis = ((function (mults,ensure_mult){
return (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$ch,cljs.core.cst$sym$topic_DASH_fn,cljs.core.cst$sym$buf_DASH_fn,cljs.core.cst$sym$mults,cljs.core.cst$sym$ensure_DASH_mult,cljs.core.cst$sym$meta24585], null);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async24584.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async24584.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async24584";

cljs.core.async.t_cljs$core$async24584.cljs$lang$ctorPrWriter = ((function (mults,ensure_mult){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async24584");
});})(mults,ensure_mult))
;

cljs.core.async.__GT_t_cljs$core$async24584 = ((function (mults,ensure_mult){
return (function cljs$core$async$__GT_t_cljs$core$async24584(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta24585){
return (new cljs.core.async.t_cljs$core$async24584(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta24585));
});})(mults,ensure_mult))
;

}

return (new cljs.core.async.t_cljs$core$async24584(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__22790__auto___24712 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24712,mults,ensure_mult,p){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24712,mults,ensure_mult,p){
return (function (state_24660){
var state_val_24661 = (state_24660[(1)]);
if((state_val_24661 === (7))){
var inst_24656 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24662_24713 = state_24660__$1;
(statearr_24662_24713[(2)] = inst_24656);

(statearr_24662_24713[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (20))){
var state_24660__$1 = state_24660;
var statearr_24663_24714 = state_24660__$1;
(statearr_24663_24714[(2)] = null);

(statearr_24663_24714[(1)] = (21));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (1))){
var state_24660__$1 = state_24660;
var statearr_24664_24715 = state_24660__$1;
(statearr_24664_24715[(2)] = null);

(statearr_24664_24715[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (24))){
var inst_24639 = (state_24660[(7)]);
var inst_24648 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(mults,cljs.core.dissoc,inst_24639);
var state_24660__$1 = state_24660;
var statearr_24665_24716 = state_24660__$1;
(statearr_24665_24716[(2)] = inst_24648);

(statearr_24665_24716[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (4))){
var inst_24591 = (state_24660[(8)]);
var inst_24591__$1 = (state_24660[(2)]);
var inst_24592 = (inst_24591__$1 == null);
var state_24660__$1 = (function (){var statearr_24666 = state_24660;
(statearr_24666[(8)] = inst_24591__$1);

return statearr_24666;
})();
if(cljs.core.truth_(inst_24592)){
var statearr_24667_24717 = state_24660__$1;
(statearr_24667_24717[(1)] = (5));

} else {
var statearr_24668_24718 = state_24660__$1;
(statearr_24668_24718[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (15))){
var inst_24633 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24669_24719 = state_24660__$1;
(statearr_24669_24719[(2)] = inst_24633);

(statearr_24669_24719[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (21))){
var inst_24653 = (state_24660[(2)]);
var state_24660__$1 = (function (){var statearr_24670 = state_24660;
(statearr_24670[(9)] = inst_24653);

return statearr_24670;
})();
var statearr_24671_24720 = state_24660__$1;
(statearr_24671_24720[(2)] = null);

(statearr_24671_24720[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (13))){
var inst_24615 = (state_24660[(10)]);
var inst_24617 = cljs.core.chunked_seq_QMARK_(inst_24615);
var state_24660__$1 = state_24660;
if(inst_24617){
var statearr_24672_24721 = state_24660__$1;
(statearr_24672_24721[(1)] = (16));

} else {
var statearr_24673_24722 = state_24660__$1;
(statearr_24673_24722[(1)] = (17));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (22))){
var inst_24645 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
if(cljs.core.truth_(inst_24645)){
var statearr_24674_24723 = state_24660__$1;
(statearr_24674_24723[(1)] = (23));

} else {
var statearr_24675_24724 = state_24660__$1;
(statearr_24675_24724[(1)] = (24));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (6))){
var inst_24641 = (state_24660[(11)]);
var inst_24591 = (state_24660[(8)]);
var inst_24639 = (state_24660[(7)]);
var inst_24639__$1 = (topic_fn.cljs$core$IFn$_invoke$arity$1 ? topic_fn.cljs$core$IFn$_invoke$arity$1(inst_24591) : topic_fn.call(null,inst_24591));
var inst_24640 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(mults) : cljs.core.deref.call(null,mults));
var inst_24641__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(inst_24640,inst_24639__$1);
var state_24660__$1 = (function (){var statearr_24676 = state_24660;
(statearr_24676[(11)] = inst_24641__$1);

(statearr_24676[(7)] = inst_24639__$1);

return statearr_24676;
})();
if(cljs.core.truth_(inst_24641__$1)){
var statearr_24677_24725 = state_24660__$1;
(statearr_24677_24725[(1)] = (19));

} else {
var statearr_24678_24726 = state_24660__$1;
(statearr_24678_24726[(1)] = (20));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (25))){
var inst_24650 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24679_24727 = state_24660__$1;
(statearr_24679_24727[(2)] = inst_24650);

(statearr_24679_24727[(1)] = (21));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (17))){
var inst_24615 = (state_24660[(10)]);
var inst_24624 = cljs.core.first(inst_24615);
var inst_24625 = cljs.core.async.muxch_STAR_(inst_24624);
var inst_24626 = cljs.core.async.close_BANG_(inst_24625);
var inst_24627 = cljs.core.next(inst_24615);
var inst_24601 = inst_24627;
var inst_24602 = null;
var inst_24603 = (0);
var inst_24604 = (0);
var state_24660__$1 = (function (){var statearr_24680 = state_24660;
(statearr_24680[(12)] = inst_24601);

(statearr_24680[(13)] = inst_24626);

(statearr_24680[(14)] = inst_24602);

(statearr_24680[(15)] = inst_24604);

(statearr_24680[(16)] = inst_24603);

return statearr_24680;
})();
var statearr_24681_24728 = state_24660__$1;
(statearr_24681_24728[(2)] = null);

(statearr_24681_24728[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (3))){
var inst_24658 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
return cljs.core.async.impl.ioc_helpers.return_chan(state_24660__$1,inst_24658);
} else {
if((state_val_24661 === (12))){
var inst_24635 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24682_24729 = state_24660__$1;
(statearr_24682_24729[(2)] = inst_24635);

(statearr_24682_24729[(1)] = (9));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (2))){
var state_24660__$1 = state_24660;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_24660__$1,(4),ch);
} else {
if((state_val_24661 === (23))){
var state_24660__$1 = state_24660;
var statearr_24683_24730 = state_24660__$1;
(statearr_24683_24730[(2)] = null);

(statearr_24683_24730[(1)] = (25));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (19))){
var inst_24641 = (state_24660[(11)]);
var inst_24591 = (state_24660[(8)]);
var inst_24643 = cljs.core.async.muxch_STAR_(inst_24641);
var state_24660__$1 = state_24660;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_24660__$1,(22),inst_24643,inst_24591);
} else {
if((state_val_24661 === (11))){
var inst_24615 = (state_24660[(10)]);
var inst_24601 = (state_24660[(12)]);
var inst_24615__$1 = cljs.core.seq(inst_24601);
var state_24660__$1 = (function (){var statearr_24684 = state_24660;
(statearr_24684[(10)] = inst_24615__$1);

return statearr_24684;
})();
if(inst_24615__$1){
var statearr_24685_24731 = state_24660__$1;
(statearr_24685_24731[(1)] = (13));

} else {
var statearr_24686_24732 = state_24660__$1;
(statearr_24686_24732[(1)] = (14));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (9))){
var inst_24637 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24687_24733 = state_24660__$1;
(statearr_24687_24733[(2)] = inst_24637);

(statearr_24687_24733[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (5))){
var inst_24598 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(mults) : cljs.core.deref.call(null,mults));
var inst_24599 = cljs.core.vals(inst_24598);
var inst_24600 = cljs.core.seq(inst_24599);
var inst_24601 = inst_24600;
var inst_24602 = null;
var inst_24603 = (0);
var inst_24604 = (0);
var state_24660__$1 = (function (){var statearr_24688 = state_24660;
(statearr_24688[(12)] = inst_24601);

(statearr_24688[(14)] = inst_24602);

(statearr_24688[(15)] = inst_24604);

(statearr_24688[(16)] = inst_24603);

return statearr_24688;
})();
var statearr_24689_24734 = state_24660__$1;
(statearr_24689_24734[(2)] = null);

(statearr_24689_24734[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (14))){
var state_24660__$1 = state_24660;
var statearr_24693_24735 = state_24660__$1;
(statearr_24693_24735[(2)] = null);

(statearr_24693_24735[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (16))){
var inst_24615 = (state_24660[(10)]);
var inst_24619 = cljs.core.chunk_first(inst_24615);
var inst_24620 = cljs.core.chunk_rest(inst_24615);
var inst_24621 = cljs.core.count(inst_24619);
var inst_24601 = inst_24620;
var inst_24602 = inst_24619;
var inst_24603 = inst_24621;
var inst_24604 = (0);
var state_24660__$1 = (function (){var statearr_24694 = state_24660;
(statearr_24694[(12)] = inst_24601);

(statearr_24694[(14)] = inst_24602);

(statearr_24694[(15)] = inst_24604);

(statearr_24694[(16)] = inst_24603);

return statearr_24694;
})();
var statearr_24695_24736 = state_24660__$1;
(statearr_24695_24736[(2)] = null);

(statearr_24695_24736[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (10))){
var inst_24601 = (state_24660[(12)]);
var inst_24602 = (state_24660[(14)]);
var inst_24604 = (state_24660[(15)]);
var inst_24603 = (state_24660[(16)]);
var inst_24609 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(inst_24602,inst_24604);
var inst_24610 = cljs.core.async.muxch_STAR_(inst_24609);
var inst_24611 = cljs.core.async.close_BANG_(inst_24610);
var inst_24612 = (inst_24604 + (1));
var tmp24690 = inst_24601;
var tmp24691 = inst_24602;
var tmp24692 = inst_24603;
var inst_24601__$1 = tmp24690;
var inst_24602__$1 = tmp24691;
var inst_24603__$1 = tmp24692;
var inst_24604__$1 = inst_24612;
var state_24660__$1 = (function (){var statearr_24696 = state_24660;
(statearr_24696[(12)] = inst_24601__$1);

(statearr_24696[(17)] = inst_24611);

(statearr_24696[(14)] = inst_24602__$1);

(statearr_24696[(15)] = inst_24604__$1);

(statearr_24696[(16)] = inst_24603__$1);

return statearr_24696;
})();
var statearr_24697_24737 = state_24660__$1;
(statearr_24697_24737[(2)] = null);

(statearr_24697_24737[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (18))){
var inst_24630 = (state_24660[(2)]);
var state_24660__$1 = state_24660;
var statearr_24698_24738 = state_24660__$1;
(statearr_24698_24738[(2)] = inst_24630);

(statearr_24698_24738[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24661 === (8))){
var inst_24604 = (state_24660[(15)]);
var inst_24603 = (state_24660[(16)]);
var inst_24606 = (inst_24604 < inst_24603);
var inst_24607 = inst_24606;
var state_24660__$1 = state_24660;
if(cljs.core.truth_(inst_24607)){
var statearr_24699_24739 = state_24660__$1;
(statearr_24699_24739[(1)] = (10));

} else {
var statearr_24700_24740 = state_24660__$1;
(statearr_24700_24740[(1)] = (11));

}

return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24712,mults,ensure_mult,p))
;
return ((function (switch__22676__auto__,c__22790__auto___24712,mults,ensure_mult,p){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_24704 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24704[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_24704[(1)] = (1));

return statearr_24704;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_24660){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24660);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24705){if((e24705 instanceof Object)){
var ex__22680__auto__ = e24705;
var statearr_24706_24741 = state_24660;
(statearr_24706_24741[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24660);

return cljs.core.cst$kw$recur;
} else {
throw e24705;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24742 = state_24660;
state_24660 = G__24742;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_24660){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_24660);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24712,mults,ensure_mult,p))
})();
var state__22792__auto__ = (function (){var statearr_24707 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24707[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24712);

return statearr_24707;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24712,mults,ensure_mult,p))
);


return p;
});

cljs.core.async.pub.cljs$lang$maxFixedArity = 3;
/**
 * Subscribes a channel to a topic of a pub.
 * 
 *   By default the channel will be closed when the source closes,
 *   but can be determined by the close? parameter.
 */
cljs.core.async.sub = (function cljs$core$async$sub(var_args){
var args24743 = [];
var len__7291__auto___24746 = arguments.length;
var i__7292__auto___24747 = (0);
while(true){
if((i__7292__auto___24747 < len__7291__auto___24746)){
args24743.push((arguments[i__7292__auto___24747]));

var G__24748 = (i__7292__auto___24747 + (1));
i__7292__auto___24747 = G__24748;
continue;
} else {
}
break;
}

var G__24745 = args24743.length;
switch (G__24745) {
case 3:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24743.length)].join('')));

}
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3 = (function (p,topic,ch){
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4(p,topic,ch,true);
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4 = (function (p,topic,ch,close_QMARK_){
return cljs.core.async.sub_STAR_(p,topic,ch,close_QMARK_);
});

cljs.core.async.sub.cljs$lang$maxFixedArity = 4;
/**
 * Unsubscribes a channel from a topic of a pub
 */
cljs.core.async.unsub = (function cljs$core$async$unsub(p,topic,ch){
return cljs.core.async.unsub_STAR_(p,topic,ch);
});
/**
 * Unsubscribes all channels from a pub, or a topic of a pub
 */
cljs.core.async.unsub_all = (function cljs$core$async$unsub_all(var_args){
var args24750 = [];
var len__7291__auto___24753 = arguments.length;
var i__7292__auto___24754 = (0);
while(true){
if((i__7292__auto___24754 < len__7291__auto___24753)){
args24750.push((arguments[i__7292__auto___24754]));

var G__24755 = (i__7292__auto___24754 + (1));
i__7292__auto___24754 = G__24755;
continue;
} else {
}
break;
}

var G__24752 = args24750.length;
switch (G__24752) {
case 1:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24750.length)].join('')));

}
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1 = (function (p){
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1(p);
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2 = (function (p,topic){
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2(p,topic);
});

cljs.core.async.unsub_all.cljs$lang$maxFixedArity = 2;
/**
 * Takes a function and a collection of source channels, and returns a
 *   channel which contains the values produced by applying f to the set
 *   of first items taken from each source channel, followed by applying
 *   f to the set of second items from each channel, until any one of the
 *   channels is closed, at which point the output channel will be
 *   closed. The returned channel will be unbuffered by default, or a
 *   buf-or-n can be supplied
 */
cljs.core.async.map = (function cljs$core$async$map(var_args){
var args24757 = [];
var len__7291__auto___24828 = arguments.length;
var i__7292__auto___24829 = (0);
while(true){
if((i__7292__auto___24829 < len__7291__auto___24828)){
args24757.push((arguments[i__7292__auto___24829]));

var G__24830 = (i__7292__auto___24829 + (1));
i__7292__auto___24829 = G__24830;
continue;
} else {
}
break;
}

var G__24759 = args24757.length;
switch (G__24759) {
case 2:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24757.length)].join('')));

}
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$2 = (function (f,chs){
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3(f,chs,null);
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$3 = (function (f,chs,buf_or_n){
var chs__$1 = cljs.core.vec(chs);
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var cnt = cljs.core.count(chs__$1);
var rets = cljs.core.object_array.cljs$core$IFn$_invoke$arity$1(cnt);
var dchan = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
var dctr = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null) : cljs.core.atom.call(null,null));
var done = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (i){
return ((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (ret){
(rets[i] = ret);

if((cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(dchan,rets.slice((0)));
} else {
return null;
}
});
;})(chs__$1,out,cnt,rets,dchan,dctr))
});})(chs__$1,out,cnt,rets,dchan,dctr))
,cljs.core.range.cljs$core$IFn$_invoke$arity$1(cnt));
var c__22790__auto___24832 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (state_24798){
var state_val_24799 = (state_24798[(1)]);
if((state_val_24799 === (7))){
var state_24798__$1 = state_24798;
var statearr_24800_24833 = state_24798__$1;
(statearr_24800_24833[(2)] = null);

(statearr_24800_24833[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (1))){
var state_24798__$1 = state_24798;
var statearr_24801_24834 = state_24798__$1;
(statearr_24801_24834[(2)] = null);

(statearr_24801_24834[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (4))){
var inst_24762 = (state_24798[(7)]);
var inst_24764 = (inst_24762 < cnt);
var state_24798__$1 = state_24798;
if(cljs.core.truth_(inst_24764)){
var statearr_24802_24835 = state_24798__$1;
(statearr_24802_24835[(1)] = (6));

} else {
var statearr_24803_24836 = state_24798__$1;
(statearr_24803_24836[(1)] = (7));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (15))){
var inst_24794 = (state_24798[(2)]);
var state_24798__$1 = state_24798;
var statearr_24804_24837 = state_24798__$1;
(statearr_24804_24837[(2)] = inst_24794);

(statearr_24804_24837[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (13))){
var inst_24787 = cljs.core.async.close_BANG_(out);
var state_24798__$1 = state_24798;
var statearr_24805_24838 = state_24798__$1;
(statearr_24805_24838[(2)] = inst_24787);

(statearr_24805_24838[(1)] = (15));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (6))){
var state_24798__$1 = state_24798;
var statearr_24806_24839 = state_24798__$1;
(statearr_24806_24839[(2)] = null);

(statearr_24806_24839[(1)] = (11));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (3))){
var inst_24796 = (state_24798[(2)]);
var state_24798__$1 = state_24798;
return cljs.core.async.impl.ioc_helpers.return_chan(state_24798__$1,inst_24796);
} else {
if((state_val_24799 === (12))){
var inst_24784 = (state_24798[(8)]);
var inst_24784__$1 = (state_24798[(2)]);
var inst_24785 = cljs.core.some(cljs.core.nil_QMARK_,inst_24784__$1);
var state_24798__$1 = (function (){var statearr_24807 = state_24798;
(statearr_24807[(8)] = inst_24784__$1);

return statearr_24807;
})();
if(cljs.core.truth_(inst_24785)){
var statearr_24808_24840 = state_24798__$1;
(statearr_24808_24840[(1)] = (13));

} else {
var statearr_24809_24841 = state_24798__$1;
(statearr_24809_24841[(1)] = (14));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (2))){
var inst_24761 = (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cnt) : cljs.core.reset_BANG_.call(null,dctr,cnt));
var inst_24762 = (0);
var state_24798__$1 = (function (){var statearr_24810 = state_24798;
(statearr_24810[(7)] = inst_24762);

(statearr_24810[(9)] = inst_24761);

return statearr_24810;
})();
var statearr_24811_24842 = state_24798__$1;
(statearr_24811_24842[(2)] = null);

(statearr_24811_24842[(1)] = (4));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (11))){
var inst_24762 = (state_24798[(7)]);
var _ = cljs.core.async.impl.ioc_helpers.add_exception_frame(state_24798,(10),Object,null,(9));
var inst_24771 = (chs__$1.cljs$core$IFn$_invoke$arity$1 ? chs__$1.cljs$core$IFn$_invoke$arity$1(inst_24762) : chs__$1.call(null,inst_24762));
var inst_24772 = (done.cljs$core$IFn$_invoke$arity$1 ? done.cljs$core$IFn$_invoke$arity$1(inst_24762) : done.call(null,inst_24762));
var inst_24773 = cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2(inst_24771,inst_24772);
var state_24798__$1 = state_24798;
var statearr_24812_24843 = state_24798__$1;
(statearr_24812_24843[(2)] = inst_24773);


cljs.core.async.impl.ioc_helpers.process_exception(state_24798__$1);

return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (9))){
var inst_24762 = (state_24798[(7)]);
var inst_24775 = (state_24798[(2)]);
var inst_24776 = (inst_24762 + (1));
var inst_24762__$1 = inst_24776;
var state_24798__$1 = (function (){var statearr_24813 = state_24798;
(statearr_24813[(7)] = inst_24762__$1);

(statearr_24813[(10)] = inst_24775);

return statearr_24813;
})();
var statearr_24814_24844 = state_24798__$1;
(statearr_24814_24844[(2)] = null);

(statearr_24814_24844[(1)] = (4));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (5))){
var inst_24782 = (state_24798[(2)]);
var state_24798__$1 = (function (){var statearr_24815 = state_24798;
(statearr_24815[(11)] = inst_24782);

return statearr_24815;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_24798__$1,(12),dchan);
} else {
if((state_val_24799 === (14))){
var inst_24784 = (state_24798[(8)]);
var inst_24789 = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,inst_24784);
var state_24798__$1 = state_24798;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_24798__$1,(16),out,inst_24789);
} else {
if((state_val_24799 === (16))){
var inst_24791 = (state_24798[(2)]);
var state_24798__$1 = (function (){var statearr_24816 = state_24798;
(statearr_24816[(12)] = inst_24791);

return statearr_24816;
})();
var statearr_24817_24845 = state_24798__$1;
(statearr_24817_24845[(2)] = null);

(statearr_24817_24845[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (10))){
var inst_24766 = (state_24798[(2)]);
var inst_24767 = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(dctr,cljs.core.dec);
var state_24798__$1 = (function (){var statearr_24818 = state_24798;
(statearr_24818[(13)] = inst_24766);

return statearr_24818;
})();
var statearr_24819_24846 = state_24798__$1;
(statearr_24819_24846[(2)] = inst_24767);


cljs.core.async.impl.ioc_helpers.process_exception(state_24798__$1);

return cljs.core.cst$kw$recur;
} else {
if((state_val_24799 === (8))){
var inst_24780 = (state_24798[(2)]);
var state_24798__$1 = state_24798;
var statearr_24820_24847 = state_24798__$1;
(statearr_24820_24847[(2)] = inst_24780);

(statearr_24820_24847[(1)] = (5));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done))
;
return ((function (switch__22676__auto__,c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_24824 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24824[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_24824[(1)] = (1));

return statearr_24824;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_24798){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24798);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24825){if((e24825 instanceof Object)){
var ex__22680__auto__ = e24825;
var statearr_24826_24848 = state_24798;
(statearr_24826_24848[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24798);

return cljs.core.cst$kw$recur;
} else {
throw e24825;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24849 = state_24798;
state_24798 = G__24849;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_24798){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_24798);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done))
})();
var state__22792__auto__ = (function (){var statearr_24827 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24827[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24832);

return statearr_24827;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24832,chs__$1,out,cnt,rets,dchan,dctr,done))
);


return out;
});

cljs.core.async.map.cljs$lang$maxFixedArity = 3;
/**
 * Takes a collection of source channels and returns a channel which
 *   contains all values taken from them. The returned channel will be
 *   unbuffered by default, or a buf-or-n can be supplied. The channel
 *   will close after all the source channels have closed.
 */
cljs.core.async.merge = (function cljs$core$async$merge(var_args){
var args24851 = [];
var len__7291__auto___24907 = arguments.length;
var i__7292__auto___24908 = (0);
while(true){
if((i__7292__auto___24908 < len__7291__auto___24907)){
args24851.push((arguments[i__7292__auto___24908]));

var G__24909 = (i__7292__auto___24908 + (1));
i__7292__auto___24908 = G__24909;
continue;
} else {
}
break;
}

var G__24853 = args24851.length;
switch (G__24853) {
case 1:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24851.length)].join('')));

}
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1 = (function (chs){
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2(chs,null);
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2 = (function (chs,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___24911 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24911,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24911,out){
return (function (state_24883){
var state_val_24884 = (state_24883[(1)]);
if((state_val_24884 === (7))){
var inst_24863 = (state_24883[(7)]);
var inst_24862 = (state_24883[(8)]);
var inst_24862__$1 = (state_24883[(2)]);
var inst_24863__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_24862__$1,(0),null);
var inst_24864 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(inst_24862__$1,(1),null);
var inst_24865 = (inst_24863__$1 == null);
var state_24883__$1 = (function (){var statearr_24885 = state_24883;
(statearr_24885[(7)] = inst_24863__$1);

(statearr_24885[(9)] = inst_24864);

(statearr_24885[(8)] = inst_24862__$1);

return statearr_24885;
})();
if(cljs.core.truth_(inst_24865)){
var statearr_24886_24912 = state_24883__$1;
(statearr_24886_24912[(1)] = (8));

} else {
var statearr_24887_24913 = state_24883__$1;
(statearr_24887_24913[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (1))){
var inst_24854 = cljs.core.vec(chs);
var inst_24855 = inst_24854;
var state_24883__$1 = (function (){var statearr_24888 = state_24883;
(statearr_24888[(10)] = inst_24855);

return statearr_24888;
})();
var statearr_24889_24914 = state_24883__$1;
(statearr_24889_24914[(2)] = null);

(statearr_24889_24914[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (4))){
var inst_24855 = (state_24883[(10)]);
var state_24883__$1 = state_24883;
return cljs.core.async.ioc_alts_BANG_(state_24883__$1,(7),inst_24855);
} else {
if((state_val_24884 === (6))){
var inst_24879 = (state_24883[(2)]);
var state_24883__$1 = state_24883;
var statearr_24890_24915 = state_24883__$1;
(statearr_24890_24915[(2)] = inst_24879);

(statearr_24890_24915[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (3))){
var inst_24881 = (state_24883[(2)]);
var state_24883__$1 = state_24883;
return cljs.core.async.impl.ioc_helpers.return_chan(state_24883__$1,inst_24881);
} else {
if((state_val_24884 === (2))){
var inst_24855 = (state_24883[(10)]);
var inst_24857 = cljs.core.count(inst_24855);
var inst_24858 = (inst_24857 > (0));
var state_24883__$1 = state_24883;
if(cljs.core.truth_(inst_24858)){
var statearr_24892_24916 = state_24883__$1;
(statearr_24892_24916[(1)] = (4));

} else {
var statearr_24893_24917 = state_24883__$1;
(statearr_24893_24917[(1)] = (5));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (11))){
var inst_24855 = (state_24883[(10)]);
var inst_24872 = (state_24883[(2)]);
var tmp24891 = inst_24855;
var inst_24855__$1 = tmp24891;
var state_24883__$1 = (function (){var statearr_24894 = state_24883;
(statearr_24894[(11)] = inst_24872);

(statearr_24894[(10)] = inst_24855__$1);

return statearr_24894;
})();
var statearr_24895_24918 = state_24883__$1;
(statearr_24895_24918[(2)] = null);

(statearr_24895_24918[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (9))){
var inst_24863 = (state_24883[(7)]);
var state_24883__$1 = state_24883;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_24883__$1,(11),out,inst_24863);
} else {
if((state_val_24884 === (5))){
var inst_24877 = cljs.core.async.close_BANG_(out);
var state_24883__$1 = state_24883;
var statearr_24896_24919 = state_24883__$1;
(statearr_24896_24919[(2)] = inst_24877);

(statearr_24896_24919[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (10))){
var inst_24875 = (state_24883[(2)]);
var state_24883__$1 = state_24883;
var statearr_24897_24920 = state_24883__$1;
(statearr_24897_24920[(2)] = inst_24875);

(statearr_24897_24920[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24884 === (8))){
var inst_24863 = (state_24883[(7)]);
var inst_24855 = (state_24883[(10)]);
var inst_24864 = (state_24883[(9)]);
var inst_24862 = (state_24883[(8)]);
var inst_24867 = (function (){var cs = inst_24855;
var vec__24860 = inst_24862;
var v = inst_24863;
var c = inst_24864;
return ((function (cs,vec__24860,v,c,inst_24863,inst_24855,inst_24864,inst_24862,state_val_24884,c__22790__auto___24911,out){
return (function (p1__24850_SHARP_){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,p1__24850_SHARP_);
});
;})(cs,vec__24860,v,c,inst_24863,inst_24855,inst_24864,inst_24862,state_val_24884,c__22790__auto___24911,out))
})();
var inst_24868 = cljs.core.filterv(inst_24867,inst_24855);
var inst_24855__$1 = inst_24868;
var state_24883__$1 = (function (){var statearr_24898 = state_24883;
(statearr_24898[(10)] = inst_24855__$1);

return statearr_24898;
})();
var statearr_24899_24921 = state_24883__$1;
(statearr_24899_24921[(2)] = null);

(statearr_24899_24921[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24911,out))
;
return ((function (switch__22676__auto__,c__22790__auto___24911,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_24903 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_24903[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_24903[(1)] = (1));

return statearr_24903;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_24883){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24883);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24904){if((e24904 instanceof Object)){
var ex__22680__auto__ = e24904;
var statearr_24905_24922 = state_24883;
(statearr_24905_24922[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24883);

return cljs.core.cst$kw$recur;
} else {
throw e24904;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24923 = state_24883;
state_24883 = G__24923;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_24883){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_24883);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24911,out))
})();
var state__22792__auto__ = (function (){var statearr_24906 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24906[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24911);

return statearr_24906;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24911,out))
);


return out;
});

cljs.core.async.merge.cljs$lang$maxFixedArity = 2;
/**
 * Returns a channel containing the single (collection) result of the
 *   items taken from the channel conjoined to the supplied
 *   collection. ch must close before into produces a result.
 */
cljs.core.async.into = (function cljs$core$async$into(coll,ch){
return cljs.core.async.reduce(cljs.core.conj,coll,ch);
});
/**
 * Returns a channel that will return, at most, n items from ch. After n items
 * have been returned, or ch has been closed, the return chanel will close.
 * 
 *   The output channel is unbuffered by default, unless buf-or-n is given.
 */
cljs.core.async.take = (function cljs$core$async$take(var_args){
var args24924 = [];
var len__7291__auto___24973 = arguments.length;
var i__7292__auto___24974 = (0);
while(true){
if((i__7292__auto___24974 < len__7291__auto___24973)){
args24924.push((arguments[i__7292__auto___24974]));

var G__24975 = (i__7292__auto___24974 + (1));
i__7292__auto___24974 = G__24975;
continue;
} else {
}
break;
}

var G__24926 = args24924.length;
switch (G__24926) {
case 2:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args24924.length)].join('')));

}
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3(n,ch,null);
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___24977 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___24977,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___24977,out){
return (function (state_24950){
var state_val_24951 = (state_24950[(1)]);
if((state_val_24951 === (7))){
var inst_24932 = (state_24950[(7)]);
var inst_24932__$1 = (state_24950[(2)]);
var inst_24933 = (inst_24932__$1 == null);
var inst_24934 = cljs.core.not(inst_24933);
var state_24950__$1 = (function (){var statearr_24952 = state_24950;
(statearr_24952[(7)] = inst_24932__$1);

return statearr_24952;
})();
if(inst_24934){
var statearr_24953_24978 = state_24950__$1;
(statearr_24953_24978[(1)] = (8));

} else {
var statearr_24954_24979 = state_24950__$1;
(statearr_24954_24979[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (1))){
var inst_24927 = (0);
var state_24950__$1 = (function (){var statearr_24955 = state_24950;
(statearr_24955[(8)] = inst_24927);

return statearr_24955;
})();
var statearr_24956_24980 = state_24950__$1;
(statearr_24956_24980[(2)] = null);

(statearr_24956_24980[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (4))){
var state_24950__$1 = state_24950;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_24950__$1,(7),ch);
} else {
if((state_val_24951 === (6))){
var inst_24945 = (state_24950[(2)]);
var state_24950__$1 = state_24950;
var statearr_24957_24981 = state_24950__$1;
(statearr_24957_24981[(2)] = inst_24945);

(statearr_24957_24981[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (3))){
var inst_24947 = (state_24950[(2)]);
var inst_24948 = cljs.core.async.close_BANG_(out);
var state_24950__$1 = (function (){var statearr_24958 = state_24950;
(statearr_24958[(9)] = inst_24947);

return statearr_24958;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_24950__$1,inst_24948);
} else {
if((state_val_24951 === (2))){
var inst_24927 = (state_24950[(8)]);
var inst_24929 = (inst_24927 < n);
var state_24950__$1 = state_24950;
if(cljs.core.truth_(inst_24929)){
var statearr_24959_24982 = state_24950__$1;
(statearr_24959_24982[(1)] = (4));

} else {
var statearr_24960_24983 = state_24950__$1;
(statearr_24960_24983[(1)] = (5));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (11))){
var inst_24927 = (state_24950[(8)]);
var inst_24937 = (state_24950[(2)]);
var inst_24938 = (inst_24927 + (1));
var inst_24927__$1 = inst_24938;
var state_24950__$1 = (function (){var statearr_24961 = state_24950;
(statearr_24961[(10)] = inst_24937);

(statearr_24961[(8)] = inst_24927__$1);

return statearr_24961;
})();
var statearr_24962_24984 = state_24950__$1;
(statearr_24962_24984[(2)] = null);

(statearr_24962_24984[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (9))){
var state_24950__$1 = state_24950;
var statearr_24963_24985 = state_24950__$1;
(statearr_24963_24985[(2)] = null);

(statearr_24963_24985[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (5))){
var state_24950__$1 = state_24950;
var statearr_24964_24986 = state_24950__$1;
(statearr_24964_24986[(2)] = null);

(statearr_24964_24986[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (10))){
var inst_24942 = (state_24950[(2)]);
var state_24950__$1 = state_24950;
var statearr_24965_24987 = state_24950__$1;
(statearr_24965_24987[(2)] = inst_24942);

(statearr_24965_24987[(1)] = (6));


return cljs.core.cst$kw$recur;
} else {
if((state_val_24951 === (8))){
var inst_24932 = (state_24950[(7)]);
var state_24950__$1 = state_24950;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_24950__$1,(11),out,inst_24932);
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___24977,out))
;
return ((function (switch__22676__auto__,c__22790__auto___24977,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_24969 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_24969[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_24969[(1)] = (1));

return statearr_24969;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_24950){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_24950);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e24970){if((e24970 instanceof Object)){
var ex__22680__auto__ = e24970;
var statearr_24971_24988 = state_24950;
(statearr_24971_24988[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_24950);

return cljs.core.cst$kw$recur;
} else {
throw e24970;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__24989 = state_24950;
state_24950 = G__24989;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_24950){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_24950);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___24977,out))
})();
var state__22792__auto__ = (function (){var statearr_24972 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_24972[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___24977);

return statearr_24972;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___24977,out))
);


return out;
});

cljs.core.async.take.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async24999 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async24999 = (function (map_LT_,f,ch,meta25000){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta25000 = meta25000;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25001,meta25000__$1){
var self__ = this;
var _25001__$1 = this;
return (new cljs.core.async.t_cljs$core$async24999(self__.map_LT_,self__.f,self__.ch,meta25000__$1));
});

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25001){
var self__ = this;
var _25001__$1 = this;
return self__.meta25000;
});

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
});

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
});

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_(self__.ch,(function (){
if(typeof cljs.core.async.t_cljs$core$async25002 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25002 = (function (map_LT_,f,ch,meta25000,_,fn1,meta25003){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta25000 = meta25000;
this._ = _;
this.fn1 = fn1;
this.meta25003 = meta25003;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (___$1){
return (function (_25004,meta25003__$1){
var self__ = this;
var _25004__$1 = this;
return (new cljs.core.async.t_cljs$core$async25002(self__.map_LT_,self__.f,self__.ch,self__.meta25000,self__._,self__.fn1,meta25003__$1));
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (___$1){
return (function (_25004){
var self__ = this;
var _25004__$1 = this;
return self__.meta25003;
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_(self__.fn1);
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit(self__.fn1);
return ((function (f1,___$2,___$1){
return (function (p1__24990_SHARP_){
var G__25005 = (((p1__24990_SHARP_ == null))?null:(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(p1__24990_SHARP_) : self__.f.call(null,p1__24990_SHARP_)));
return (f1.cljs$core$IFn$_invoke$arity$1 ? f1.cljs$core$IFn$_invoke$arity$1(G__25005) : f1.call(null,G__25005));
});
;})(f1,___$2,___$1))
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.getBasis = ((function (___$1){
return (function (){
return new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$map_LT_,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$f,cljs.core.cst$sym$ch], null))),cljs.core.cst$kw$doc,"Deprecated - this function will be removed. Use transducer instead"], null)),cljs.core.cst$sym$f,cljs.core.cst$sym$ch,cljs.core.cst$sym$meta25000,cljs.core.with_meta(cljs.core.cst$sym$_,new cljs.core.PersistentArrayMap(null, 1, [cljs.core.cst$kw$tag,cljs.core.cst$sym$cljs$core$async_SLASH_t_cljs$core$async24999], null)),cljs.core.cst$sym$fn1,cljs.core.cst$sym$meta25003], null);
});})(___$1))
;

cljs.core.async.t_cljs$core$async25002.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25002.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25002";

cljs.core.async.t_cljs$core$async25002.cljs$lang$ctorPrWriter = ((function (___$1){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async25002");
});})(___$1))
;

cljs.core.async.__GT_t_cljs$core$async25002 = ((function (___$1){
return (function cljs$core$async$map_LT__$___GT_t_cljs$core$async25002(map_LT___$1,f__$1,ch__$1,meta25000__$1,___$2,fn1__$1,meta25003){
return (new cljs.core.async.t_cljs$core$async25002(map_LT___$1,f__$1,ch__$1,meta25000__$1,___$2,fn1__$1,meta25003));
});})(___$1))
;

}

return (new cljs.core.async.t_cljs$core$async25002(self__.map_LT_,self__.f,self__.ch,self__.meta25000,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY));
})()
);
if(cljs.core.truth_((function (){var and__6204__auto__ = ret;
if(cljs.core.truth_(and__6204__auto__)){
return !(((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret)) == null));
} else {
return and__6204__auto__;
}
})())){
return cljs.core.async.impl.channels.box((function (){var G__25006 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(ret) : cljs.core.deref.call(null,ret));
return (self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(G__25006) : self__.f.call(null,G__25006));
})());
} else {
return ret;
}
});

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async24999.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
});

cljs.core.async.t_cljs$core$async24999.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$map_LT_,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$f,cljs.core.cst$sym$ch], null))),cljs.core.cst$kw$doc,"Deprecated - this function will be removed. Use transducer instead"], null)),cljs.core.cst$sym$f,cljs.core.cst$sym$ch,cljs.core.cst$sym$meta25000], null);
});

cljs.core.async.t_cljs$core$async24999.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async24999.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async24999";

cljs.core.async.t_cljs$core$async24999.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async24999");
});

cljs.core.async.__GT_t_cljs$core$async24999 = (function cljs$core$async$map_LT__$___GT_t_cljs$core$async24999(map_LT___$1,f__$1,ch__$1,meta25000){
return (new cljs.core.async.t_cljs$core$async24999(map_LT___$1,f__$1,ch__$1,meta25000));
});

}

return (new cljs.core.async.t_cljs$core$async24999(cljs$core$async$map_LT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async25010 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25010 = (function (map_GT_,f,ch,meta25011){
this.map_GT_ = map_GT_;
this.f = f;
this.ch = ch;
this.meta25011 = meta25011;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25012,meta25011__$1){
var self__ = this;
var _25012__$1 = this;
return (new cljs.core.async.t_cljs$core$async25010(self__.map_GT_,self__.f,self__.ch,meta25011__$1));
});

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25012){
var self__ = this;
var _25012__$1 = this;
return self__.meta25011;
});

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
});

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async25010.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,(self__.f.cljs$core$IFn$_invoke$arity$1 ? self__.f.cljs$core$IFn$_invoke$arity$1(val) : self__.f.call(null,val)),fn1);
});

cljs.core.async.t_cljs$core$async25010.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$map_GT_,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$f,cljs.core.cst$sym$ch], null))),cljs.core.cst$kw$doc,"Deprecated - this function will be removed. Use transducer instead"], null)),cljs.core.cst$sym$f,cljs.core.cst$sym$ch,cljs.core.cst$sym$meta25011], null);
});

cljs.core.async.t_cljs$core$async25010.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25010.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25010";

cljs.core.async.t_cljs$core$async25010.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async25010");
});

cljs.core.async.__GT_t_cljs$core$async25010 = (function cljs$core$async$map_GT__$___GT_t_cljs$core$async25010(map_GT___$1,f__$1,ch__$1,meta25011){
return (new cljs.core.async.t_cljs$core$async25010(map_GT___$1,f__$1,ch__$1,meta25011));
});

}

return (new cljs.core.async.t_cljs$core$async25010(cljs$core$async$map_GT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
if(typeof cljs.core.async.t_cljs$core$async25016 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async25016 = (function (filter_GT_,p,ch,meta25017){
this.filter_GT_ = filter_GT_;
this.p = p;
this.ch = ch;
this.meta25017 = meta25017;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_25018,meta25017__$1){
var self__ = this;
var _25018__$1 = this;
return (new cljs.core.async.t_cljs$core$async25016(self__.filter_GT_,self__.p,self__.ch,meta25017__$1));
});

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_25018){
var self__ = this;
var _25018__$1 = this;
return self__.meta25017;
});

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_(self__.ch);
});

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_(self__.ch);
});

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_(self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async25016.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_((self__.p.cljs$core$IFn$_invoke$arity$1 ? self__.p.cljs$core$IFn$_invoke$arity$1(val) : self__.p.call(null,val)))){
return cljs.core.async.impl.protocols.put_BANG_(self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box(cljs.core.not(cljs.core.async.impl.protocols.closed_QMARK_(self__.ch)));
}
});

cljs.core.async.t_cljs$core$async25016.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(cljs.core.cst$sym$filter_GT_,new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$arglists,cljs.core.list(cljs.core.cst$sym$quote,cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.cst$sym$p,cljs.core.cst$sym$ch], null))),cljs.core.cst$kw$doc,"Deprecated - this function will be removed. Use transducer instead"], null)),cljs.core.cst$sym$p,cljs.core.cst$sym$ch,cljs.core.cst$sym$meta25017], null);
});

cljs.core.async.t_cljs$core$async25016.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async25016.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async25016";

cljs.core.async.t_cljs$core$async25016.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write(writer__6823__auto__,"cljs.core.async/t_cljs$core$async25016");
});

cljs.core.async.__GT_t_cljs$core$async25016 = (function cljs$core$async$filter_GT__$___GT_t_cljs$core$async25016(filter_GT___$1,p__$1,ch__$1,meta25017){
return (new cljs.core.async.t_cljs$core$async25016(filter_GT___$1,p__$1,ch__$1,meta25017));
});

}

return (new cljs.core.async.t_cljs$core$async25016(cljs$core$async$filter_GT_,p,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_GT_ = (function cljs$core$async$remove_GT_(p,ch){
return cljs.core.async.filter_GT_(cljs.core.complement(p),ch);
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_LT_ = (function cljs$core$async$filter_LT_(var_args){
var args25019 = [];
var len__7291__auto___25063 = arguments.length;
var i__7292__auto___25064 = (0);
while(true){
if((i__7292__auto___25064 < len__7291__auto___25063)){
args25019.push((arguments[i__7292__auto___25064]));

var G__25065 = (i__7292__auto___25064 + (1));
i__7292__auto___25064 = G__25065;
continue;
} else {
}
break;
}

var G__25021 = args25019.length;
switch (G__25021) {
case 2:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25019.length)].join('')));

}
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3(p,ch,null);
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___25067 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___25067,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___25067,out){
return (function (state_25042){
var state_val_25043 = (state_25042[(1)]);
if((state_val_25043 === (7))){
var inst_25038 = (state_25042[(2)]);
var state_25042__$1 = state_25042;
var statearr_25044_25068 = state_25042__$1;
(statearr_25044_25068[(2)] = inst_25038);

(statearr_25044_25068[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (1))){
var state_25042__$1 = state_25042;
var statearr_25045_25069 = state_25042__$1;
(statearr_25045_25069[(2)] = null);

(statearr_25045_25069[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (4))){
var inst_25024 = (state_25042[(7)]);
var inst_25024__$1 = (state_25042[(2)]);
var inst_25025 = (inst_25024__$1 == null);
var state_25042__$1 = (function (){var statearr_25046 = state_25042;
(statearr_25046[(7)] = inst_25024__$1);

return statearr_25046;
})();
if(cljs.core.truth_(inst_25025)){
var statearr_25047_25070 = state_25042__$1;
(statearr_25047_25070[(1)] = (5));

} else {
var statearr_25048_25071 = state_25042__$1;
(statearr_25048_25071[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (6))){
var inst_25024 = (state_25042[(7)]);
var inst_25029 = (p.cljs$core$IFn$_invoke$arity$1 ? p.cljs$core$IFn$_invoke$arity$1(inst_25024) : p.call(null,inst_25024));
var state_25042__$1 = state_25042;
if(cljs.core.truth_(inst_25029)){
var statearr_25049_25072 = state_25042__$1;
(statearr_25049_25072[(1)] = (8));

} else {
var statearr_25050_25073 = state_25042__$1;
(statearr_25050_25073[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (3))){
var inst_25040 = (state_25042[(2)]);
var state_25042__$1 = state_25042;
return cljs.core.async.impl.ioc_helpers.return_chan(state_25042__$1,inst_25040);
} else {
if((state_val_25043 === (2))){
var state_25042__$1 = state_25042;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_25042__$1,(4),ch);
} else {
if((state_val_25043 === (11))){
var inst_25032 = (state_25042[(2)]);
var state_25042__$1 = state_25042;
var statearr_25051_25074 = state_25042__$1;
(statearr_25051_25074[(2)] = inst_25032);

(statearr_25051_25074[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (9))){
var state_25042__$1 = state_25042;
var statearr_25052_25075 = state_25042__$1;
(statearr_25052_25075[(2)] = null);

(statearr_25052_25075[(1)] = (10));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (5))){
var inst_25027 = cljs.core.async.close_BANG_(out);
var state_25042__$1 = state_25042;
var statearr_25053_25076 = state_25042__$1;
(statearr_25053_25076[(2)] = inst_25027);

(statearr_25053_25076[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (10))){
var inst_25035 = (state_25042[(2)]);
var state_25042__$1 = (function (){var statearr_25054 = state_25042;
(statearr_25054[(8)] = inst_25035);

return statearr_25054;
})();
var statearr_25055_25077 = state_25042__$1;
(statearr_25055_25077[(2)] = null);

(statearr_25055_25077[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25043 === (8))){
var inst_25024 = (state_25042[(7)]);
var state_25042__$1 = state_25042;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25042__$1,(11),out,inst_25024);
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___25067,out))
;
return ((function (switch__22676__auto__,c__22790__auto___25067,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_25059 = [null,null,null,null,null,null,null,null,null];
(statearr_25059[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_25059[(1)] = (1));

return statearr_25059;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_25042){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_25042);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e25060){if((e25060 instanceof Object)){
var ex__22680__auto__ = e25060;
var statearr_25061_25078 = state_25042;
(statearr_25061_25078[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_25042);

return cljs.core.cst$kw$recur;
} else {
throw e25060;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__25079 = state_25042;
state_25042 = G__25079;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_25042){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_25042);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___25067,out))
})();
var state__22792__auto__ = (function (){var statearr_25062 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_25062[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___25067);

return statearr_25062;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___25067,out))
);


return out;
});

cljs.core.async.filter_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_LT_ = (function cljs$core$async$remove_LT_(var_args){
var args25080 = [];
var len__7291__auto___25083 = arguments.length;
var i__7292__auto___25084 = (0);
while(true){
if((i__7292__auto___25084 < len__7291__auto___25083)){
args25080.push((arguments[i__7292__auto___25084]));

var G__25085 = (i__7292__auto___25084 + (1));
i__7292__auto___25084 = G__25085;
continue;
} else {
}
break;
}

var G__25082 = args25080.length;
switch (G__25082) {
case 2:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25080.length)].join('')));

}
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3(p,ch,null);
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3(cljs.core.complement(p),ch,buf_or_n);
});

cljs.core.async.remove_LT_.cljs$lang$maxFixedArity = 3;
cljs.core.async.mapcat_STAR_ = (function cljs$core$async$mapcat_STAR_(f,in$,out){
var c__22790__auto__ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto__){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto__){
return (function (state_25252){
var state_val_25253 = (state_25252[(1)]);
if((state_val_25253 === (7))){
var inst_25248 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
var statearr_25254_25295 = state_25252__$1;
(statearr_25254_25295[(2)] = inst_25248);

(statearr_25254_25295[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (20))){
var inst_25218 = (state_25252[(7)]);
var inst_25229 = (state_25252[(2)]);
var inst_25230 = cljs.core.next(inst_25218);
var inst_25204 = inst_25230;
var inst_25205 = null;
var inst_25206 = (0);
var inst_25207 = (0);
var state_25252__$1 = (function (){var statearr_25255 = state_25252;
(statearr_25255[(8)] = inst_25207);

(statearr_25255[(9)] = inst_25204);

(statearr_25255[(10)] = inst_25229);

(statearr_25255[(11)] = inst_25205);

(statearr_25255[(12)] = inst_25206);

return statearr_25255;
})();
var statearr_25256_25296 = state_25252__$1;
(statearr_25256_25296[(2)] = null);

(statearr_25256_25296[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (1))){
var state_25252__$1 = state_25252;
var statearr_25257_25297 = state_25252__$1;
(statearr_25257_25297[(2)] = null);

(statearr_25257_25297[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (4))){
var inst_25193 = (state_25252[(13)]);
var inst_25193__$1 = (state_25252[(2)]);
var inst_25194 = (inst_25193__$1 == null);
var state_25252__$1 = (function (){var statearr_25258 = state_25252;
(statearr_25258[(13)] = inst_25193__$1);

return statearr_25258;
})();
if(cljs.core.truth_(inst_25194)){
var statearr_25259_25298 = state_25252__$1;
(statearr_25259_25298[(1)] = (5));

} else {
var statearr_25260_25299 = state_25252__$1;
(statearr_25260_25299[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (15))){
var state_25252__$1 = state_25252;
var statearr_25264_25300 = state_25252__$1;
(statearr_25264_25300[(2)] = null);

(statearr_25264_25300[(1)] = (16));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (21))){
var state_25252__$1 = state_25252;
var statearr_25265_25301 = state_25252__$1;
(statearr_25265_25301[(2)] = null);

(statearr_25265_25301[(1)] = (23));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (13))){
var inst_25207 = (state_25252[(8)]);
var inst_25204 = (state_25252[(9)]);
var inst_25205 = (state_25252[(11)]);
var inst_25206 = (state_25252[(12)]);
var inst_25214 = (state_25252[(2)]);
var inst_25215 = (inst_25207 + (1));
var tmp25261 = inst_25204;
var tmp25262 = inst_25205;
var tmp25263 = inst_25206;
var inst_25204__$1 = tmp25261;
var inst_25205__$1 = tmp25262;
var inst_25206__$1 = tmp25263;
var inst_25207__$1 = inst_25215;
var state_25252__$1 = (function (){var statearr_25266 = state_25252;
(statearr_25266[(8)] = inst_25207__$1);

(statearr_25266[(14)] = inst_25214);

(statearr_25266[(9)] = inst_25204__$1);

(statearr_25266[(11)] = inst_25205__$1);

(statearr_25266[(12)] = inst_25206__$1);

return statearr_25266;
})();
var statearr_25267_25302 = state_25252__$1;
(statearr_25267_25302[(2)] = null);

(statearr_25267_25302[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (22))){
var state_25252__$1 = state_25252;
var statearr_25268_25303 = state_25252__$1;
(statearr_25268_25303[(2)] = null);

(statearr_25268_25303[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (6))){
var inst_25193 = (state_25252[(13)]);
var inst_25202 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_25193) : f.call(null,inst_25193));
var inst_25203 = cljs.core.seq(inst_25202);
var inst_25204 = inst_25203;
var inst_25205 = null;
var inst_25206 = (0);
var inst_25207 = (0);
var state_25252__$1 = (function (){var statearr_25269 = state_25252;
(statearr_25269[(8)] = inst_25207);

(statearr_25269[(9)] = inst_25204);

(statearr_25269[(11)] = inst_25205);

(statearr_25269[(12)] = inst_25206);

return statearr_25269;
})();
var statearr_25270_25304 = state_25252__$1;
(statearr_25270_25304[(2)] = null);

(statearr_25270_25304[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (17))){
var inst_25218 = (state_25252[(7)]);
var inst_25222 = cljs.core.chunk_first(inst_25218);
var inst_25223 = cljs.core.chunk_rest(inst_25218);
var inst_25224 = cljs.core.count(inst_25222);
var inst_25204 = inst_25223;
var inst_25205 = inst_25222;
var inst_25206 = inst_25224;
var inst_25207 = (0);
var state_25252__$1 = (function (){var statearr_25271 = state_25252;
(statearr_25271[(8)] = inst_25207);

(statearr_25271[(9)] = inst_25204);

(statearr_25271[(11)] = inst_25205);

(statearr_25271[(12)] = inst_25206);

return statearr_25271;
})();
var statearr_25272_25305 = state_25252__$1;
(statearr_25272_25305[(2)] = null);

(statearr_25272_25305[(1)] = (8));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (3))){
var inst_25250 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
return cljs.core.async.impl.ioc_helpers.return_chan(state_25252__$1,inst_25250);
} else {
if((state_val_25253 === (12))){
var inst_25238 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
var statearr_25273_25306 = state_25252__$1;
(statearr_25273_25306[(2)] = inst_25238);

(statearr_25273_25306[(1)] = (9));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (2))){
var state_25252__$1 = state_25252;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_25252__$1,(4),in$);
} else {
if((state_val_25253 === (23))){
var inst_25246 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
var statearr_25274_25307 = state_25252__$1;
(statearr_25274_25307[(2)] = inst_25246);

(statearr_25274_25307[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (19))){
var inst_25233 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
var statearr_25275_25308 = state_25252__$1;
(statearr_25275_25308[(2)] = inst_25233);

(statearr_25275_25308[(1)] = (16));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (11))){
var inst_25204 = (state_25252[(9)]);
var inst_25218 = (state_25252[(7)]);
var inst_25218__$1 = cljs.core.seq(inst_25204);
var state_25252__$1 = (function (){var statearr_25276 = state_25252;
(statearr_25276[(7)] = inst_25218__$1);

return statearr_25276;
})();
if(inst_25218__$1){
var statearr_25277_25309 = state_25252__$1;
(statearr_25277_25309[(1)] = (14));

} else {
var statearr_25278_25310 = state_25252__$1;
(statearr_25278_25310[(1)] = (15));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (9))){
var inst_25240 = (state_25252[(2)]);
var inst_25241 = cljs.core.async.impl.protocols.closed_QMARK_(out);
var state_25252__$1 = (function (){var statearr_25279 = state_25252;
(statearr_25279[(15)] = inst_25240);

return statearr_25279;
})();
if(cljs.core.truth_(inst_25241)){
var statearr_25280_25311 = state_25252__$1;
(statearr_25280_25311[(1)] = (21));

} else {
var statearr_25281_25312 = state_25252__$1;
(statearr_25281_25312[(1)] = (22));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (5))){
var inst_25196 = cljs.core.async.close_BANG_(out);
var state_25252__$1 = state_25252;
var statearr_25282_25313 = state_25252__$1;
(statearr_25282_25313[(2)] = inst_25196);

(statearr_25282_25313[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (14))){
var inst_25218 = (state_25252[(7)]);
var inst_25220 = cljs.core.chunked_seq_QMARK_(inst_25218);
var state_25252__$1 = state_25252;
if(inst_25220){
var statearr_25283_25314 = state_25252__$1;
(statearr_25283_25314[(1)] = (17));

} else {
var statearr_25284_25315 = state_25252__$1;
(statearr_25284_25315[(1)] = (18));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (16))){
var inst_25236 = (state_25252[(2)]);
var state_25252__$1 = state_25252;
var statearr_25285_25316 = state_25252__$1;
(statearr_25285_25316[(2)] = inst_25236);

(statearr_25285_25316[(1)] = (12));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25253 === (10))){
var inst_25207 = (state_25252[(8)]);
var inst_25205 = (state_25252[(11)]);
var inst_25212 = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(inst_25205,inst_25207);
var state_25252__$1 = state_25252;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25252__$1,(13),out,inst_25212);
} else {
if((state_val_25253 === (18))){
var inst_25218 = (state_25252[(7)]);
var inst_25227 = cljs.core.first(inst_25218);
var state_25252__$1 = state_25252;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25252__$1,(20),out,inst_25227);
} else {
if((state_val_25253 === (8))){
var inst_25207 = (state_25252[(8)]);
var inst_25206 = (state_25252[(12)]);
var inst_25209 = (inst_25207 < inst_25206);
var inst_25210 = inst_25209;
var state_25252__$1 = state_25252;
if(cljs.core.truth_(inst_25210)){
var statearr_25286_25317 = state_25252__$1;
(statearr_25286_25317[(1)] = (10));

} else {
var statearr_25287_25318 = state_25252__$1;
(statearr_25287_25318[(1)] = (11));

}

return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto__))
;
return ((function (switch__22676__auto__,c__22790__auto__){
return (function() {
var cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__ = null;
var cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____0 = (function (){
var statearr_25291 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25291[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__);

(statearr_25291[(1)] = (1));

return statearr_25291;
});
var cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____1 = (function (state_25252){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_25252);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e25292){if((e25292 instanceof Object)){
var ex__22680__auto__ = e25292;
var statearr_25293_25319 = state_25252;
(statearr_25293_25319[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_25252);

return cljs.core.cst$kw$recur;
} else {
throw e25292;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__25320 = state_25252;
state_25252 = G__25320;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__ = function(state_25252){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____1.call(this,state_25252);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__22677__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto__))
})();
var state__22792__auto__ = (function (){var statearr_25294 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_25294[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto__);

return statearr_25294;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto__))
);

return c__22790__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var args25321 = [];
var len__7291__auto___25324 = arguments.length;
var i__7292__auto___25325 = (0);
while(true){
if((i__7292__auto___25325 < len__7291__auto___25324)){
args25321.push((arguments[i__7292__auto___25325]));

var G__25326 = (i__7292__auto___25325 + (1));
i__7292__auto___25325 = G__25326;
continue;
} else {
}
break;
}

var G__25323 = args25321.length;
switch (G__25323) {
case 2:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25321.length)].join('')));

}
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2 = (function (f,in$){
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3(f,in$,null);
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3 = (function (f,in$,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
cljs.core.async.mapcat_STAR_(f,in$,out);

return out;
});

cljs.core.async.mapcat_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_GT_ = (function cljs$core$async$mapcat_GT_(var_args){
var args25328 = [];
var len__7291__auto___25331 = arguments.length;
var i__7292__auto___25332 = (0);
while(true){
if((i__7292__auto___25332 < len__7291__auto___25331)){
args25328.push((arguments[i__7292__auto___25332]));

var G__25333 = (i__7292__auto___25332 + (1));
i__7292__auto___25332 = G__25333;
continue;
} else {
}
break;
}

var G__25330 = args25328.length;
switch (G__25330) {
case 2:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25328.length)].join('')));

}
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2 = (function (f,out){
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3(f,out,null);
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3 = (function (f,out,buf_or_n){
var in$ = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
cljs.core.async.mapcat_STAR_(f,in$,out);

return in$;
});

cljs.core.async.mapcat_GT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.unique = (function cljs$core$async$unique(var_args){
var args25335 = [];
var len__7291__auto___25386 = arguments.length;
var i__7292__auto___25387 = (0);
while(true){
if((i__7292__auto___25387 < len__7291__auto___25386)){
args25335.push((arguments[i__7292__auto___25387]));

var G__25388 = (i__7292__auto___25387 + (1));
i__7292__auto___25387 = G__25388;
continue;
} else {
}
break;
}

var G__25337 = args25335.length;
switch (G__25337) {
case 1:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25335.length)].join('')));

}
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1 = (function (ch){
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2(ch,null);
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2 = (function (ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___25390 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___25390,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___25390,out){
return (function (state_25361){
var state_val_25362 = (state_25361[(1)]);
if((state_val_25362 === (7))){
var inst_25356 = (state_25361[(2)]);
var state_25361__$1 = state_25361;
var statearr_25363_25391 = state_25361__$1;
(statearr_25363_25391[(2)] = inst_25356);

(statearr_25363_25391[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (1))){
var inst_25338 = null;
var state_25361__$1 = (function (){var statearr_25364 = state_25361;
(statearr_25364[(7)] = inst_25338);

return statearr_25364;
})();
var statearr_25365_25392 = state_25361__$1;
(statearr_25365_25392[(2)] = null);

(statearr_25365_25392[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (4))){
var inst_25341 = (state_25361[(8)]);
var inst_25341__$1 = (state_25361[(2)]);
var inst_25342 = (inst_25341__$1 == null);
var inst_25343 = cljs.core.not(inst_25342);
var state_25361__$1 = (function (){var statearr_25366 = state_25361;
(statearr_25366[(8)] = inst_25341__$1);

return statearr_25366;
})();
if(inst_25343){
var statearr_25367_25393 = state_25361__$1;
(statearr_25367_25393[(1)] = (5));

} else {
var statearr_25368_25394 = state_25361__$1;
(statearr_25368_25394[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (6))){
var state_25361__$1 = state_25361;
var statearr_25369_25395 = state_25361__$1;
(statearr_25369_25395[(2)] = null);

(statearr_25369_25395[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (3))){
var inst_25358 = (state_25361[(2)]);
var inst_25359 = cljs.core.async.close_BANG_(out);
var state_25361__$1 = (function (){var statearr_25370 = state_25361;
(statearr_25370[(9)] = inst_25358);

return statearr_25370;
})();
return cljs.core.async.impl.ioc_helpers.return_chan(state_25361__$1,inst_25359);
} else {
if((state_val_25362 === (2))){
var state_25361__$1 = state_25361;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_25361__$1,(4),ch);
} else {
if((state_val_25362 === (11))){
var inst_25341 = (state_25361[(8)]);
var inst_25350 = (state_25361[(2)]);
var inst_25338 = inst_25341;
var state_25361__$1 = (function (){var statearr_25371 = state_25361;
(statearr_25371[(7)] = inst_25338);

(statearr_25371[(10)] = inst_25350);

return statearr_25371;
})();
var statearr_25372_25396 = state_25361__$1;
(statearr_25372_25396[(2)] = null);

(statearr_25372_25396[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (9))){
var inst_25341 = (state_25361[(8)]);
var state_25361__$1 = state_25361;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25361__$1,(11),out,inst_25341);
} else {
if((state_val_25362 === (5))){
var inst_25338 = (state_25361[(7)]);
var inst_25341 = (state_25361[(8)]);
var inst_25345 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_25341,inst_25338);
var state_25361__$1 = state_25361;
if(inst_25345){
var statearr_25374_25397 = state_25361__$1;
(statearr_25374_25397[(1)] = (8));

} else {
var statearr_25375_25398 = state_25361__$1;
(statearr_25375_25398[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (10))){
var inst_25353 = (state_25361[(2)]);
var state_25361__$1 = state_25361;
var statearr_25376_25399 = state_25361__$1;
(statearr_25376_25399[(2)] = inst_25353);

(statearr_25376_25399[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25362 === (8))){
var inst_25338 = (state_25361[(7)]);
var tmp25373 = inst_25338;
var inst_25338__$1 = tmp25373;
var state_25361__$1 = (function (){var statearr_25377 = state_25361;
(statearr_25377[(7)] = inst_25338__$1);

return statearr_25377;
})();
var statearr_25378_25400 = state_25361__$1;
(statearr_25378_25400[(2)] = null);

(statearr_25378_25400[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___25390,out))
;
return ((function (switch__22676__auto__,c__22790__auto___25390,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_25382 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_25382[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_25382[(1)] = (1));

return statearr_25382;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_25361){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_25361);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e25383){if((e25383 instanceof Object)){
var ex__22680__auto__ = e25383;
var statearr_25384_25401 = state_25361;
(statearr_25384_25401[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_25361);

return cljs.core.cst$kw$recur;
} else {
throw e25383;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__25402 = state_25361;
state_25361 = G__25402;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_25361){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_25361);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___25390,out))
})();
var state__22792__auto__ = (function (){var statearr_25385 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_25385[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___25390);

return statearr_25385;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___25390,out))
);


return out;
});

cljs.core.async.unique.cljs$lang$maxFixedArity = 2;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var args25403 = [];
var len__7291__auto___25473 = arguments.length;
var i__7292__auto___25474 = (0);
while(true){
if((i__7292__auto___25474 < len__7291__auto___25473)){
args25403.push((arguments[i__7292__auto___25474]));

var G__25475 = (i__7292__auto___25474 + (1));
i__7292__auto___25474 = G__25475;
continue;
} else {
}
break;
}

var G__25405 = args25403.length;
switch (G__25405) {
case 2:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25403.length)].join('')));

}
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3(n,ch,null);
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___25477 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___25477,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___25477,out){
return (function (state_25443){
var state_val_25444 = (state_25443[(1)]);
if((state_val_25444 === (7))){
var inst_25439 = (state_25443[(2)]);
var state_25443__$1 = state_25443;
var statearr_25445_25478 = state_25443__$1;
(statearr_25445_25478[(2)] = inst_25439);

(statearr_25445_25478[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (1))){
var inst_25406 = (new Array(n));
var inst_25407 = inst_25406;
var inst_25408 = (0);
var state_25443__$1 = (function (){var statearr_25446 = state_25443;
(statearr_25446[(7)] = inst_25408);

(statearr_25446[(8)] = inst_25407);

return statearr_25446;
})();
var statearr_25447_25479 = state_25443__$1;
(statearr_25447_25479[(2)] = null);

(statearr_25447_25479[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (4))){
var inst_25411 = (state_25443[(9)]);
var inst_25411__$1 = (state_25443[(2)]);
var inst_25412 = (inst_25411__$1 == null);
var inst_25413 = cljs.core.not(inst_25412);
var state_25443__$1 = (function (){var statearr_25448 = state_25443;
(statearr_25448[(9)] = inst_25411__$1);

return statearr_25448;
})();
if(inst_25413){
var statearr_25449_25480 = state_25443__$1;
(statearr_25449_25480[(1)] = (5));

} else {
var statearr_25450_25481 = state_25443__$1;
(statearr_25450_25481[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (15))){
var inst_25433 = (state_25443[(2)]);
var state_25443__$1 = state_25443;
var statearr_25451_25482 = state_25443__$1;
(statearr_25451_25482[(2)] = inst_25433);

(statearr_25451_25482[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (13))){
var state_25443__$1 = state_25443;
var statearr_25452_25483 = state_25443__$1;
(statearr_25452_25483[(2)] = null);

(statearr_25452_25483[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (6))){
var inst_25408 = (state_25443[(7)]);
var inst_25429 = (inst_25408 > (0));
var state_25443__$1 = state_25443;
if(cljs.core.truth_(inst_25429)){
var statearr_25453_25484 = state_25443__$1;
(statearr_25453_25484[(1)] = (12));

} else {
var statearr_25454_25485 = state_25443__$1;
(statearr_25454_25485[(1)] = (13));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (3))){
var inst_25441 = (state_25443[(2)]);
var state_25443__$1 = state_25443;
return cljs.core.async.impl.ioc_helpers.return_chan(state_25443__$1,inst_25441);
} else {
if((state_val_25444 === (12))){
var inst_25407 = (state_25443[(8)]);
var inst_25431 = cljs.core.vec(inst_25407);
var state_25443__$1 = state_25443;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25443__$1,(15),out,inst_25431);
} else {
if((state_val_25444 === (2))){
var state_25443__$1 = state_25443;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_25443__$1,(4),ch);
} else {
if((state_val_25444 === (11))){
var inst_25423 = (state_25443[(2)]);
var inst_25424 = (new Array(n));
var inst_25407 = inst_25424;
var inst_25408 = (0);
var state_25443__$1 = (function (){var statearr_25455 = state_25443;
(statearr_25455[(10)] = inst_25423);

(statearr_25455[(7)] = inst_25408);

(statearr_25455[(8)] = inst_25407);

return statearr_25455;
})();
var statearr_25456_25486 = state_25443__$1;
(statearr_25456_25486[(2)] = null);

(statearr_25456_25486[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (9))){
var inst_25407 = (state_25443[(8)]);
var inst_25421 = cljs.core.vec(inst_25407);
var state_25443__$1 = state_25443;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25443__$1,(11),out,inst_25421);
} else {
if((state_val_25444 === (5))){
var inst_25411 = (state_25443[(9)]);
var inst_25408 = (state_25443[(7)]);
var inst_25416 = (state_25443[(11)]);
var inst_25407 = (state_25443[(8)]);
var inst_25415 = (inst_25407[inst_25408] = inst_25411);
var inst_25416__$1 = (inst_25408 + (1));
var inst_25417 = (inst_25416__$1 < n);
var state_25443__$1 = (function (){var statearr_25457 = state_25443;
(statearr_25457[(12)] = inst_25415);

(statearr_25457[(11)] = inst_25416__$1);

return statearr_25457;
})();
if(cljs.core.truth_(inst_25417)){
var statearr_25458_25487 = state_25443__$1;
(statearr_25458_25487[(1)] = (8));

} else {
var statearr_25459_25488 = state_25443__$1;
(statearr_25459_25488[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (14))){
var inst_25436 = (state_25443[(2)]);
var inst_25437 = cljs.core.async.close_BANG_(out);
var state_25443__$1 = (function (){var statearr_25461 = state_25443;
(statearr_25461[(13)] = inst_25436);

return statearr_25461;
})();
var statearr_25462_25489 = state_25443__$1;
(statearr_25462_25489[(2)] = inst_25437);

(statearr_25462_25489[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (10))){
var inst_25427 = (state_25443[(2)]);
var state_25443__$1 = state_25443;
var statearr_25463_25490 = state_25443__$1;
(statearr_25463_25490[(2)] = inst_25427);

(statearr_25463_25490[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25444 === (8))){
var inst_25416 = (state_25443[(11)]);
var inst_25407 = (state_25443[(8)]);
var tmp25460 = inst_25407;
var inst_25407__$1 = tmp25460;
var inst_25408 = inst_25416;
var state_25443__$1 = (function (){var statearr_25464 = state_25443;
(statearr_25464[(7)] = inst_25408);

(statearr_25464[(8)] = inst_25407__$1);

return statearr_25464;
})();
var statearr_25465_25491 = state_25443__$1;
(statearr_25465_25491[(2)] = null);

(statearr_25465_25491[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___25477,out))
;
return ((function (switch__22676__auto__,c__22790__auto___25477,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_25469 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25469[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_25469[(1)] = (1));

return statearr_25469;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_25443){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_25443);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e25470){if((e25470 instanceof Object)){
var ex__22680__auto__ = e25470;
var statearr_25471_25492 = state_25443;
(statearr_25471_25492[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_25443);

return cljs.core.cst$kw$recur;
} else {
throw e25470;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__25493 = state_25443;
state_25443 = G__25493;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_25443){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_25443);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___25477,out))
})();
var state__22792__auto__ = (function (){var statearr_25472 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_25472[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___25477);

return statearr_25472;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___25477,out))
);


return out;
});

cljs.core.async.partition.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var args25494 = [];
var len__7291__auto___25568 = arguments.length;
var i__7292__auto___25569 = (0);
while(true){
if((i__7292__auto___25569 < len__7291__auto___25568)){
args25494.push((arguments[i__7292__auto___25569]));

var G__25570 = (i__7292__auto___25569 + (1));
i__7292__auto___25569 = G__25570;
continue;
} else {
}
break;
}

var G__25496 = args25494.length;
switch (G__25496) {
case 2:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args25494.length)].join('')));

}
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2 = (function (f,ch){
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3(f,ch,null);
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3 = (function (f,ch,buf_or_n){
var out = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(buf_or_n);
var c__22790__auto___25572 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1((1));
cljs.core.async.impl.dispatch.run(((function (c__22790__auto___25572,out){
return (function (){
var f__22791__auto__ = (function (){var switch__22676__auto__ = ((function (c__22790__auto___25572,out){
return (function (state_25538){
var state_val_25539 = (state_25538[(1)]);
if((state_val_25539 === (7))){
var inst_25534 = (state_25538[(2)]);
var state_25538__$1 = state_25538;
var statearr_25540_25573 = state_25538__$1;
(statearr_25540_25573[(2)] = inst_25534);

(statearr_25540_25573[(1)] = (3));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (1))){
var inst_25497 = [];
var inst_25498 = inst_25497;
var inst_25499 = cljs.core.cst$kw$cljs$core$async_SLASH_nothing;
var state_25538__$1 = (function (){var statearr_25541 = state_25538;
(statearr_25541[(7)] = inst_25499);

(statearr_25541[(8)] = inst_25498);

return statearr_25541;
})();
var statearr_25542_25574 = state_25538__$1;
(statearr_25542_25574[(2)] = null);

(statearr_25542_25574[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (4))){
var inst_25502 = (state_25538[(9)]);
var inst_25502__$1 = (state_25538[(2)]);
var inst_25503 = (inst_25502__$1 == null);
var inst_25504 = cljs.core.not(inst_25503);
var state_25538__$1 = (function (){var statearr_25543 = state_25538;
(statearr_25543[(9)] = inst_25502__$1);

return statearr_25543;
})();
if(inst_25504){
var statearr_25544_25575 = state_25538__$1;
(statearr_25544_25575[(1)] = (5));

} else {
var statearr_25545_25576 = state_25538__$1;
(statearr_25545_25576[(1)] = (6));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (15))){
var inst_25528 = (state_25538[(2)]);
var state_25538__$1 = state_25538;
var statearr_25546_25577 = state_25538__$1;
(statearr_25546_25577[(2)] = inst_25528);

(statearr_25546_25577[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (13))){
var state_25538__$1 = state_25538;
var statearr_25547_25578 = state_25538__$1;
(statearr_25547_25578[(2)] = null);

(statearr_25547_25578[(1)] = (14));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (6))){
var inst_25498 = (state_25538[(8)]);
var inst_25523 = inst_25498.length;
var inst_25524 = (inst_25523 > (0));
var state_25538__$1 = state_25538;
if(cljs.core.truth_(inst_25524)){
var statearr_25548_25579 = state_25538__$1;
(statearr_25548_25579[(1)] = (12));

} else {
var statearr_25549_25580 = state_25538__$1;
(statearr_25549_25580[(1)] = (13));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (3))){
var inst_25536 = (state_25538[(2)]);
var state_25538__$1 = state_25538;
return cljs.core.async.impl.ioc_helpers.return_chan(state_25538__$1,inst_25536);
} else {
if((state_val_25539 === (12))){
var inst_25498 = (state_25538[(8)]);
var inst_25526 = cljs.core.vec(inst_25498);
var state_25538__$1 = state_25538;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25538__$1,(15),out,inst_25526);
} else {
if((state_val_25539 === (2))){
var state_25538__$1 = state_25538;
return cljs.core.async.impl.ioc_helpers.take_BANG_(state_25538__$1,(4),ch);
} else {
if((state_val_25539 === (11))){
var inst_25502 = (state_25538[(9)]);
var inst_25506 = (state_25538[(10)]);
var inst_25516 = (state_25538[(2)]);
var inst_25517 = [];
var inst_25518 = inst_25517.push(inst_25502);
var inst_25498 = inst_25517;
var inst_25499 = inst_25506;
var state_25538__$1 = (function (){var statearr_25550 = state_25538;
(statearr_25550[(7)] = inst_25499);

(statearr_25550[(11)] = inst_25516);

(statearr_25550[(12)] = inst_25518);

(statearr_25550[(8)] = inst_25498);

return statearr_25550;
})();
var statearr_25551_25581 = state_25538__$1;
(statearr_25551_25581[(2)] = null);

(statearr_25551_25581[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (9))){
var inst_25498 = (state_25538[(8)]);
var inst_25514 = cljs.core.vec(inst_25498);
var state_25538__$1 = state_25538;
return cljs.core.async.impl.ioc_helpers.put_BANG_(state_25538__$1,(11),out,inst_25514);
} else {
if((state_val_25539 === (5))){
var inst_25502 = (state_25538[(9)]);
var inst_25499 = (state_25538[(7)]);
var inst_25506 = (state_25538[(10)]);
var inst_25506__$1 = (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(inst_25502) : f.call(null,inst_25502));
var inst_25507 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(inst_25506__$1,inst_25499);
var inst_25508 = cljs.core.keyword_identical_QMARK_(inst_25499,cljs.core.cst$kw$cljs$core$async_SLASH_nothing);
var inst_25509 = (inst_25507) || (inst_25508);
var state_25538__$1 = (function (){var statearr_25552 = state_25538;
(statearr_25552[(10)] = inst_25506__$1);

return statearr_25552;
})();
if(cljs.core.truth_(inst_25509)){
var statearr_25553_25582 = state_25538__$1;
(statearr_25553_25582[(1)] = (8));

} else {
var statearr_25554_25583 = state_25538__$1;
(statearr_25554_25583[(1)] = (9));

}

return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (14))){
var inst_25531 = (state_25538[(2)]);
var inst_25532 = cljs.core.async.close_BANG_(out);
var state_25538__$1 = (function (){var statearr_25556 = state_25538;
(statearr_25556[(13)] = inst_25531);

return statearr_25556;
})();
var statearr_25557_25584 = state_25538__$1;
(statearr_25557_25584[(2)] = inst_25532);

(statearr_25557_25584[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (10))){
var inst_25521 = (state_25538[(2)]);
var state_25538__$1 = state_25538;
var statearr_25558_25585 = state_25538__$1;
(statearr_25558_25585[(2)] = inst_25521);

(statearr_25558_25585[(1)] = (7));


return cljs.core.cst$kw$recur;
} else {
if((state_val_25539 === (8))){
var inst_25502 = (state_25538[(9)]);
var inst_25498 = (state_25538[(8)]);
var inst_25506 = (state_25538[(10)]);
var inst_25511 = inst_25498.push(inst_25502);
var tmp25555 = inst_25498;
var inst_25498__$1 = tmp25555;
var inst_25499 = inst_25506;
var state_25538__$1 = (function (){var statearr_25559 = state_25538;
(statearr_25559[(7)] = inst_25499);

(statearr_25559[(8)] = inst_25498__$1);

(statearr_25559[(14)] = inst_25511);

return statearr_25559;
})();
var statearr_25560_25586 = state_25538__$1;
(statearr_25560_25586[(2)] = null);

(statearr_25560_25586[(1)] = (2));


return cljs.core.cst$kw$recur;
} else {
return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});})(c__22790__auto___25572,out))
;
return ((function (switch__22676__auto__,c__22790__auto___25572,out){
return (function() {
var cljs$core$async$state_machine__22677__auto__ = null;
var cljs$core$async$state_machine__22677__auto____0 = (function (){
var statearr_25564 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_25564[(0)] = cljs$core$async$state_machine__22677__auto__);

(statearr_25564[(1)] = (1));

return statearr_25564;
});
var cljs$core$async$state_machine__22677__auto____1 = (function (state_25538){
while(true){
var ret_value__22678__auto__ = (function (){try{while(true){
var result__22679__auto__ = switch__22676__auto__(state_25538);
if(cljs.core.keyword_identical_QMARK_(result__22679__auto__,cljs.core.cst$kw$recur)){
continue;
} else {
return result__22679__auto__;
}
break;
}
}catch (e25565){if((e25565 instanceof Object)){
var ex__22680__auto__ = e25565;
var statearr_25566_25587 = state_25538;
(statearr_25566_25587[(5)] = ex__22680__auto__);


cljs.core.async.impl.ioc_helpers.process_exception(state_25538);

return cljs.core.cst$kw$recur;
} else {
throw e25565;

}
}})();
if(cljs.core.keyword_identical_QMARK_(ret_value__22678__auto__,cljs.core.cst$kw$recur)){
var G__25588 = state_25538;
state_25538 = G__25588;
continue;
} else {
return ret_value__22678__auto__;
}
break;
}
});
cljs$core$async$state_machine__22677__auto__ = function(state_25538){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__22677__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__22677__auto____1.call(this,state_25538);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__22677__auto____0;
cljs$core$async$state_machine__22677__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__22677__auto____1;
return cljs$core$async$state_machine__22677__auto__;
})()
;})(switch__22676__auto__,c__22790__auto___25572,out))
})();
var state__22792__auto__ = (function (){var statearr_25567 = (f__22791__auto__.cljs$core$IFn$_invoke$arity$0 ? f__22791__auto__.cljs$core$IFn$_invoke$arity$0() : f__22791__auto__.call(null));
(statearr_25567[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__22790__auto___25572);

return statearr_25567;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped(state__22792__auto__);
});})(c__22790__auto___25572,out))
);


return out;
});

cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3;
