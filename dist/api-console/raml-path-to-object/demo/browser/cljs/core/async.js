// Compiled by ClojureScript 1.9.14 {}
goog.provide('cljs.core.async');
goog.require('cljs.core');
goog.require('cljs.core.async.impl.channels');
goog.require('cljs.core.async.impl.dispatch');
goog.require('cljs.core.async.impl.ioc_helpers');
goog.require('cljs.core.async.impl.protocols');
goog.require('cljs.core.async.impl.buffers');
goog.require('cljs.core.async.impl.timers');
cljs.core.async.fn_handler = (function cljs$core$async$fn_handler(var_args){
var args17982 = [];
var len__7291__auto___17988 = arguments.length;
var i__7292__auto___17989 = (0);
while(true){
if((i__7292__auto___17989 < len__7291__auto___17988)){
args17982.push((arguments[i__7292__auto___17989]));

var G__17990 = (i__7292__auto___17989 + (1));
i__7292__auto___17989 = G__17990;
continue;
} else {
}
break;
}

var G__17984 = args17982.length;
switch (G__17984) {
case 1:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args17982.length)].join('')));

}
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$1 = (function (f){
return cljs.core.async.fn_handler.call(null,f,true);
});

cljs.core.async.fn_handler.cljs$core$IFn$_invoke$arity$2 = (function (f,blockable){
if(typeof cljs.core.async.t_cljs$core$async17985 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async17985 = (function (f,blockable,meta17986){
this.f = f;
this.blockable = blockable;
this.meta17986 = meta17986;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17987,meta17986__$1){
var self__ = this;
var _17987__$1 = this;
return (new cljs.core.async.t_cljs$core$async17985(self__.f,self__.blockable,meta17986__$1));
});

cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17987){
var self__ = this;
var _17987__$1 = this;
return self__.meta17986;
});

cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.blockable;
});

cljs.core.async.t_cljs$core$async17985.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.f;
});

cljs.core.async.t_cljs$core$async17985.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"blockable","blockable",-28395259,null),new cljs.core.Symbol(null,"meta17986","meta17986",1716903884,null)], null);
});

cljs.core.async.t_cljs$core$async17985.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async17985.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async17985";

cljs.core.async.t_cljs$core$async17985.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async17985");
});

cljs.core.async.__GT_t_cljs$core$async17985 = (function cljs$core$async$__GT_t_cljs$core$async17985(f__$1,blockable__$1,meta17986){
return (new cljs.core.async.t_cljs$core$async17985(f__$1,blockable__$1,meta17986));
});

}

return (new cljs.core.async.t_cljs$core$async17985(f,blockable,cljs.core.PersistentArrayMap.EMPTY));
});

cljs.core.async.fn_handler.cljs$lang$maxFixedArity = 2;
/**
 * Returns a fixed buffer of size n. When full, puts will block/park.
 */
cljs.core.async.buffer = (function cljs$core$async$buffer(n){
return cljs.core.async.impl.buffers.fixed_buffer.call(null,n);
});
/**
 * Returns a buffer of size n. When full, puts will complete but
 *   val will be dropped (no transfer).
 */
cljs.core.async.dropping_buffer = (function cljs$core$async$dropping_buffer(n){
return cljs.core.async.impl.buffers.dropping_buffer.call(null,n);
});
/**
 * Returns a buffer of size n. When full, puts will complete, and be
 *   buffered, but oldest elements in buffer will be dropped (not
 *   transferred).
 */
cljs.core.async.sliding_buffer = (function cljs$core$async$sliding_buffer(n){
return cljs.core.async.impl.buffers.sliding_buffer.call(null,n);
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
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.async.impl.protocols.UnblockingBuffer,buff);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,cljs.core.async.impl.protocols.UnblockingBuffer,buff);
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
var args17994 = [];
var len__7291__auto___17997 = arguments.length;
var i__7292__auto___17998 = (0);
while(true){
if((i__7292__auto___17998 < len__7291__auto___17997)){
args17994.push((arguments[i__7292__auto___17998]));

var G__17999 = (i__7292__auto___17998 + (1));
i__7292__auto___17998 = G__17999;
continue;
} else {
}
break;
}

var G__17996 = args17994.length;
switch (G__17996) {
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
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args17994.length)].join('')));

}
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.chan.call(null,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1 = (function (buf_or_n){
return cljs.core.async.chan.call(null,buf_or_n,null,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$2 = (function (buf_or_n,xform){
return cljs.core.async.chan.call(null,buf_or_n,xform,null);
});

cljs.core.async.chan.cljs$core$IFn$_invoke$arity$3 = (function (buf_or_n,xform,ex_handler){
var buf_or_n__$1 = ((cljs.core._EQ_.call(null,buf_or_n,(0)))?null:buf_or_n);
if(cljs.core.truth_(xform)){
if(cljs.core.truth_(buf_or_n__$1)){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("buffer must be supplied when transducer is"),cljs.core.str("\n"),cljs.core.str("buf-or-n")].join('')));
}
} else {
}

return cljs.core.async.impl.channels.chan.call(null,((typeof buf_or_n__$1 === 'number')?cljs.core.async.buffer.call(null,buf_or_n__$1):buf_or_n__$1),xform,ex_handler);
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
var args18001 = [];
var len__7291__auto___18004 = arguments.length;
var i__7292__auto___18005 = (0);
while(true){
if((i__7292__auto___18005 < len__7291__auto___18004)){
args18001.push((arguments[i__7292__auto___18005]));

var G__18006 = (i__7292__auto___18005 + (1));
i__7292__auto___18005 = G__18006;
continue;
} else {
}
break;
}

var G__18003 = args18001.length;
switch (G__18003) {
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
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18001.length)].join('')));

}
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$0 = (function (){
return cljs.core.async.promise_chan.call(null,null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$1 = (function (xform){
return cljs.core.async.promise_chan.call(null,xform,null);
});

cljs.core.async.promise_chan.cljs$core$IFn$_invoke$arity$2 = (function (xform,ex_handler){
return cljs.core.async.chan.call(null,cljs.core.async.impl.buffers.promise_buffer.call(null),xform,ex_handler);
});

cljs.core.async.promise_chan.cljs$lang$maxFixedArity = 2;
/**
 * Returns a channel that will close after msecs
 */
cljs.core.async.timeout = (function cljs$core$async$timeout(msecs){
return cljs.core.async.impl.timers.timeout.call(null,msecs);
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
var args18008 = [];
var len__7291__auto___18011 = arguments.length;
var i__7292__auto___18012 = (0);
while(true){
if((i__7292__auto___18012 < len__7291__auto___18011)){
args18008.push((arguments[i__7292__auto___18012]));

var G__18013 = (i__7292__auto___18012 + (1));
i__7292__auto___18012 = G__18013;
continue;
} else {
}
break;
}

var G__18010 = args18008.length;
switch (G__18010) {
case 2:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18008.length)].join('')));

}
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,fn1){
return cljs.core.async.take_BANG_.call(null,port,fn1,true);
});

cljs.core.async.take_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,fn1,on_caller_QMARK_){
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.fn_handler.call(null,fn1));
if(cljs.core.truth_(ret)){
var val_18015 = cljs.core.deref.call(null,ret);
if(cljs.core.truth_(on_caller_QMARK_)){
fn1.call(null,val_18015);
} else {
cljs.core.async.impl.dispatch.run.call(null,((function (val_18015,ret){
return (function (){
return fn1.call(null,val_18015);
});})(val_18015,ret))
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
cljs.core.async.fhnop = cljs.core.async.fn_handler.call(null,cljs.core.async.nop);
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
var args18016 = [];
var len__7291__auto___18019 = arguments.length;
var i__7292__auto___18020 = (0);
while(true){
if((i__7292__auto___18020 < len__7291__auto___18019)){
args18016.push((arguments[i__7292__auto___18020]));

var G__18021 = (i__7292__auto___18020 + (1));
i__7292__auto___18020 = G__18021;
continue;
} else {
}
break;
}

var G__18018 = args18016.length;
switch (G__18018) {
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
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18016.length)].join('')));

}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (port,val){
var temp__4655__auto__ = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fhnop);
if(cljs.core.truth_(temp__4655__auto__)){
var ret = temp__4655__auto__;
return cljs.core.deref.call(null,ret);
} else {
return true;
}
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (port,val,fn1){
return cljs.core.async.put_BANG_.call(null,port,val,fn1,true);
});

cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (port,val,fn1,on_caller_QMARK_){
var temp__4655__auto__ = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fn_handler.call(null,fn1));
if(cljs.core.truth_(temp__4655__auto__)){
var retb = temp__4655__auto__;
var ret = cljs.core.deref.call(null,retb);
if(cljs.core.truth_(on_caller_QMARK_)){
fn1.call(null,ret);
} else {
cljs.core.async.impl.dispatch.run.call(null,((function (ret,retb,temp__4655__auto__){
return (function (){
return fn1.call(null,ret);
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
return cljs.core.async.impl.protocols.close_BANG_.call(null,port);
});
cljs.core.async.random_array = (function cljs$core$async$random_array(n){
var a = (new Array(n));
var n__7131__auto___18023 = n;
var x_18024 = (0);
while(true){
if((x_18024 < n__7131__auto___18023)){
(a[x_18024] = (0));

var G__18025 = (x_18024 + (1));
x_18024 = G__18025;
continue;
} else {
}
break;
}

var i = (1);
while(true){
if(cljs.core._EQ_.call(null,i,n)){
return a;
} else {
var j = cljs.core.rand_int.call(null,i);
(a[i] = (a[j]));

(a[j] = i);

var G__18026 = (i + (1));
i = G__18026;
continue;
}
break;
}
});
cljs.core.async.alt_flag = (function cljs$core$async$alt_flag(){
var flag = cljs.core.atom.call(null,true);
if(typeof cljs.core.async.t_cljs$core$async18030 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async18030 = (function (alt_flag,flag,meta18031){
this.alt_flag = alt_flag;
this.flag = flag;
this.meta18031 = meta18031;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (flag){
return (function (_18032,meta18031__$1){
var self__ = this;
var _18032__$1 = this;
return (new cljs.core.async.t_cljs$core$async18030(self__.alt_flag,self__.flag,meta18031__$1));
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (flag){
return (function (_18032){
var self__ = this;
var _18032__$1 = this;
return self__.meta18031;
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref.call(null,self__.flag);
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (flag){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.flag,null);

return true;
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.getBasis = ((function (flag){
return (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"alt-flag","alt-flag",-1794972754,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"private","private",-558947994),true,new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(cljs.core.PersistentVector.EMPTY))], null)),new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"meta18031","meta18031",1412292572,null)], null);
});})(flag))
;

cljs.core.async.t_cljs$core$async18030.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async18030.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async18030";

cljs.core.async.t_cljs$core$async18030.cljs$lang$ctorPrWriter = ((function (flag){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async18030");
});})(flag))
;

cljs.core.async.__GT_t_cljs$core$async18030 = ((function (flag){
return (function cljs$core$async$alt_flag_$___GT_t_cljs$core$async18030(alt_flag__$1,flag__$1,meta18031){
return (new cljs.core.async.t_cljs$core$async18030(alt_flag__$1,flag__$1,meta18031));
});})(flag))
;

}

return (new cljs.core.async.t_cljs$core$async18030(cljs$core$async$alt_flag,flag,cljs.core.PersistentArrayMap.EMPTY));
});
cljs.core.async.alt_handler = (function cljs$core$async$alt_handler(flag,cb){
if(typeof cljs.core.async.t_cljs$core$async18036 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async18036 = (function (alt_handler,flag,cb,meta18037){
this.alt_handler = alt_handler;
this.flag = flag;
this.cb = cb;
this.meta18037 = meta18037;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_18038,meta18037__$1){
var self__ = this;
var _18038__$1 = this;
return (new cljs.core.async.t_cljs$core$async18036(self__.alt_handler,self__.flag,self__.cb,meta18037__$1));
});

cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_18038){
var self__ = this;
var _18038__$1 = this;
return self__.meta18037;
});

cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.active_QMARK_.call(null,self__.flag);
});

cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return true;
});

cljs.core.async.t_cljs$core$async18036.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.async.impl.protocols.commit.call(null,self__.flag);

return self__.cb;
});

cljs.core.async.t_cljs$core$async18036.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"alt-handler","alt-handler",963786170,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"private","private",-558947994),true,new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null)], null)))], null)),new cljs.core.Symbol(null,"flag","flag",-1565787888,null),new cljs.core.Symbol(null,"cb","cb",-2064487928,null),new cljs.core.Symbol(null,"meta18037","meta18037",613595759,null)], null);
});

cljs.core.async.t_cljs$core$async18036.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async18036.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async18036";

cljs.core.async.t_cljs$core$async18036.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async18036");
});

cljs.core.async.__GT_t_cljs$core$async18036 = (function cljs$core$async$alt_handler_$___GT_t_cljs$core$async18036(alt_handler__$1,flag__$1,cb__$1,meta18037){
return (new cljs.core.async.t_cljs$core$async18036(alt_handler__$1,flag__$1,cb__$1,meta18037));
});

}

return (new cljs.core.async.t_cljs$core$async18036(cljs$core$async$alt_handler,flag,cb,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * returns derefable [val port] if immediate, nil if enqueued
 */
cljs.core.async.do_alts = (function cljs$core$async$do_alts(fret,ports,opts){
var flag = cljs.core.async.alt_flag.call(null);
var n = cljs.core.count.call(null,ports);
var idxs = cljs.core.async.random_array.call(null,n);
var priority = new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(opts);
var ret = (function (){var i = (0);
while(true){
if((i < n)){
var idx = (cljs.core.truth_(priority)?i:(idxs[i]));
var port = cljs.core.nth.call(null,ports,idx);
var wport = ((cljs.core.vector_QMARK_.call(null,port))?port.call(null,(0)):null);
var vbox = (cljs.core.truth_(wport)?(function (){var val = port.call(null,(1));
return cljs.core.async.impl.protocols.put_BANG_.call(null,wport,val,cljs.core.async.alt_handler.call(null,flag,((function (i,val,idx,port,wport,flag,n,idxs,priority){
return (function (p1__18039_SHARP_){
return fret.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__18039_SHARP_,wport], null));
});})(i,val,idx,port,wport,flag,n,idxs,priority))
));
})():cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.alt_handler.call(null,flag,((function (i,idx,port,wport,flag,n,idxs,priority){
return (function (p1__18040_SHARP_){
return fret.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__18040_SHARP_,port], null));
});})(i,idx,port,wport,flag,n,idxs,priority))
)));
if(cljs.core.truth_(vbox)){
return cljs.core.async.impl.channels.box.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.deref.call(null,vbox),(function (){var or__6216__auto__ = wport;
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return port;
}
})()], null));
} else {
var G__18041 = (i + (1));
i = G__18041;
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
if(cljs.core.contains_QMARK_.call(null,opts,new cljs.core.Keyword(null,"default","default",-1987822328))){
var temp__4657__auto__ = (function (){var and__6204__auto__ = cljs.core.async.impl.protocols.active_QMARK_.call(null,flag);
if(cljs.core.truth_(and__6204__auto__)){
return cljs.core.async.impl.protocols.commit.call(null,flag);
} else {
return and__6204__auto__;
}
})();
if(cljs.core.truth_(temp__4657__auto__)){
var got = temp__4657__auto__;
return cljs.core.async.impl.channels.box.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"default","default",-1987822328).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"default","default",-1987822328)], null));
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
var len__7291__auto___18047 = arguments.length;
var i__7292__auto___18048 = (0);
while(true){
if((i__7292__auto___18048 < len__7291__auto___18047)){
args__7298__auto__.push((arguments[i__7292__auto___18048]));

var G__18049 = (i__7292__auto___18048 + (1));
i__7292__auto___18048 = G__18049;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((1) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((1)),(0),null)):null);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__7299__auto__);
});

cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (ports,p__18044){
var map__18045 = p__18044;
var map__18045__$1 = ((((!((map__18045 == null)))?((((map__18045.cljs$lang$protocol_mask$partition0$ & (64))) || (map__18045.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__18045):map__18045);
var opts = map__18045__$1;
throw (new Error("alts! used not in (go ...) block"));
});

cljs.core.async.alts_BANG_.cljs$lang$maxFixedArity = (1);

cljs.core.async.alts_BANG_.cljs$lang$applyTo = (function (seq18042){
var G__18043 = cljs.core.first.call(null,seq18042);
var seq18042__$1 = cljs.core.next.call(null,seq18042);
return cljs.core.async.alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__18043,seq18042__$1);
});
/**
 * Puts a val into port if it's possible to do so immediately.
 *   nil values are not allowed. Never blocks. Returns true if offer succeeds.
 */
cljs.core.async.offer_BANG_ = (function cljs$core$async$offer_BANG_(port,val){
var ret = cljs.core.async.impl.protocols.put_BANG_.call(null,port,val,cljs.core.async.fn_handler.call(null,cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref.call(null,ret);
} else {
return null;
}
});
/**
 * Takes a val from port if it's possible to do so immediately.
 *   Never blocks. Returns value if successful, nil otherwise.
 */
cljs.core.async.poll_BANG_ = (function cljs$core$async$poll_BANG_(port){
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,port,cljs.core.async.fn_handler.call(null,cljs.core.async.nop,false));
if(cljs.core.truth_(ret)){
return cljs.core.deref.call(null,ret);
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
var args18050 = [];
var len__7291__auto___18100 = arguments.length;
var i__7292__auto___18101 = (0);
while(true){
if((i__7292__auto___18101 < len__7291__auto___18100)){
args18050.push((arguments[i__7292__auto___18101]));

var G__18102 = (i__7292__auto___18101 + (1));
i__7292__auto___18101 = G__18102;
continue;
} else {
}
break;
}

var G__18052 = args18050.length;
switch (G__18052) {
case 2:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18050.length)].join('')));

}
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$2 = (function (from,to){
return cljs.core.async.pipe.call(null,from,to,true);
});

cljs.core.async.pipe.cljs$core$IFn$_invoke$arity$3 = (function (from,to,close_QMARK_){
var c__17937__auto___18104 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___18104){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___18104){
return (function (state_18076){
var state_val_18077 = (state_18076[(1)]);
if((state_val_18077 === (7))){
var inst_18072 = (state_18076[(2)]);
var state_18076__$1 = state_18076;
var statearr_18078_18105 = state_18076__$1;
(statearr_18078_18105[(2)] = inst_18072);

(statearr_18078_18105[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (1))){
var state_18076__$1 = state_18076;
var statearr_18079_18106 = state_18076__$1;
(statearr_18079_18106[(2)] = null);

(statearr_18079_18106[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (4))){
var inst_18055 = (state_18076[(7)]);
var inst_18055__$1 = (state_18076[(2)]);
var inst_18056 = (inst_18055__$1 == null);
var state_18076__$1 = (function (){var statearr_18080 = state_18076;
(statearr_18080[(7)] = inst_18055__$1);

return statearr_18080;
})();
if(cljs.core.truth_(inst_18056)){
var statearr_18081_18107 = state_18076__$1;
(statearr_18081_18107[(1)] = (5));

} else {
var statearr_18082_18108 = state_18076__$1;
(statearr_18082_18108[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (13))){
var state_18076__$1 = state_18076;
var statearr_18083_18109 = state_18076__$1;
(statearr_18083_18109[(2)] = null);

(statearr_18083_18109[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (6))){
var inst_18055 = (state_18076[(7)]);
var state_18076__$1 = state_18076;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18076__$1,(11),to,inst_18055);
} else {
if((state_val_18077 === (3))){
var inst_18074 = (state_18076[(2)]);
var state_18076__$1 = state_18076;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18076__$1,inst_18074);
} else {
if((state_val_18077 === (12))){
var state_18076__$1 = state_18076;
var statearr_18084_18110 = state_18076__$1;
(statearr_18084_18110[(2)] = null);

(statearr_18084_18110[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (2))){
var state_18076__$1 = state_18076;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18076__$1,(4),from);
} else {
if((state_val_18077 === (11))){
var inst_18065 = (state_18076[(2)]);
var state_18076__$1 = state_18076;
if(cljs.core.truth_(inst_18065)){
var statearr_18085_18111 = state_18076__$1;
(statearr_18085_18111[(1)] = (12));

} else {
var statearr_18086_18112 = state_18076__$1;
(statearr_18086_18112[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (9))){
var state_18076__$1 = state_18076;
var statearr_18087_18113 = state_18076__$1;
(statearr_18087_18113[(2)] = null);

(statearr_18087_18113[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (5))){
var state_18076__$1 = state_18076;
if(cljs.core.truth_(close_QMARK_)){
var statearr_18088_18114 = state_18076__$1;
(statearr_18088_18114[(1)] = (8));

} else {
var statearr_18089_18115 = state_18076__$1;
(statearr_18089_18115[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (14))){
var inst_18070 = (state_18076[(2)]);
var state_18076__$1 = state_18076;
var statearr_18090_18116 = state_18076__$1;
(statearr_18090_18116[(2)] = inst_18070);

(statearr_18090_18116[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (10))){
var inst_18062 = (state_18076[(2)]);
var state_18076__$1 = state_18076;
var statearr_18091_18117 = state_18076__$1;
(statearr_18091_18117[(2)] = inst_18062);

(statearr_18091_18117[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18077 === (8))){
var inst_18059 = cljs.core.async.close_BANG_.call(null,to);
var state_18076__$1 = state_18076;
var statearr_18092_18118 = state_18076__$1;
(statearr_18092_18118[(2)] = inst_18059);

(statearr_18092_18118[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___18104))
;
return ((function (switch__17825__auto__,c__17937__auto___18104){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_18096 = [null,null,null,null,null,null,null,null];
(statearr_18096[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_18096[(1)] = (1));

return statearr_18096;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_18076){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18076);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18097){if((e18097 instanceof Object)){
var ex__17829__auto__ = e18097;
var statearr_18098_18119 = state_18076;
(statearr_18098_18119[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18076);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18097;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18120 = state_18076;
state_18076 = G__18120;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_18076){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_18076);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___18104))
})();
var state__17939__auto__ = (function (){var statearr_18099 = f__17938__auto__.call(null);
(statearr_18099[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18104);

return statearr_18099;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___18104))
);


return to;
});

cljs.core.async.pipe.cljs$lang$maxFixedArity = 3;
cljs.core.async.pipeline_STAR_ = (function cljs$core$async$pipeline_STAR_(n,to,xf,from,close_QMARK_,ex_handler,type){
if((n > (0))){
} else {
throw (new Error("Assert failed: (pos? n)"));
}

var jobs = cljs.core.async.chan.call(null,n);
var results = cljs.core.async.chan.call(null,n);
var process = ((function (jobs,results){
return (function (p__18304){
var vec__18305 = p__18304;
var v = cljs.core.nth.call(null,vec__18305,(0),null);
var p = cljs.core.nth.call(null,vec__18305,(1),null);
var job = vec__18305;
if((job == null)){
cljs.core.async.close_BANG_.call(null,results);

return null;
} else {
var res = cljs.core.async.chan.call(null,(1),xf,ex_handler);
var c__17937__auto___18487 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results){
return (function (state_18310){
var state_val_18311 = (state_18310[(1)]);
if((state_val_18311 === (1))){
var state_18310__$1 = state_18310;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18310__$1,(2),res,v);
} else {
if((state_val_18311 === (2))){
var inst_18307 = (state_18310[(2)]);
var inst_18308 = cljs.core.async.close_BANG_.call(null,res);
var state_18310__$1 = (function (){var statearr_18312 = state_18310;
(statearr_18312[(7)] = inst_18307);

return statearr_18312;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18310__$1,inst_18308);
} else {
return null;
}
}
});})(c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results))
;
return ((function (switch__17825__auto__,c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_18316 = [null,null,null,null,null,null,null,null];
(statearr_18316[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__);

(statearr_18316[(1)] = (1));

return statearr_18316;
});
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1 = (function (state_18310){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18310);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18317){if((e18317 instanceof Object)){
var ex__17829__auto__ = e18317;
var statearr_18318_18488 = state_18310;
(statearr_18318_18488[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18310);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18317;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18489 = state_18310;
state_18310 = G__18489;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = function(state_18310){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1.call(this,state_18310);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results))
})();
var state__17939__auto__ = (function (){var statearr_18319 = f__17938__auto__.call(null);
(statearr_18319[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18487);

return statearr_18319;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___18487,res,vec__18305,v,p,job,jobs,results))
);


cljs.core.async.put_BANG_.call(null,p,res);

return true;
}
});})(jobs,results))
;
var async = ((function (jobs,results,process){
return (function (p__18320){
var vec__18321 = p__18320;
var v = cljs.core.nth.call(null,vec__18321,(0),null);
var p = cljs.core.nth.call(null,vec__18321,(1),null);
var job = vec__18321;
if((job == null)){
cljs.core.async.close_BANG_.call(null,results);

return null;
} else {
var res = cljs.core.async.chan.call(null,(1));
xf.call(null,v,res);

cljs.core.async.put_BANG_.call(null,p,res);

return true;
}
});})(jobs,results,process))
;
var n__7131__auto___18490 = n;
var __18491 = (0);
while(true){
if((__18491 < n__7131__auto___18490)){
var G__18322_18492 = (((type instanceof cljs.core.Keyword))?type.fqn:null);
switch (G__18322_18492) {
case "compute":
var c__17937__auto___18494 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (__18491,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (__18491,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function (state_18335){
var state_val_18336 = (state_18335[(1)]);
if((state_val_18336 === (1))){
var state_18335__$1 = state_18335;
var statearr_18337_18495 = state_18335__$1;
(statearr_18337_18495[(2)] = null);

(statearr_18337_18495[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18336 === (2))){
var state_18335__$1 = state_18335;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18335__$1,(4),jobs);
} else {
if((state_val_18336 === (3))){
var inst_18333 = (state_18335[(2)]);
var state_18335__$1 = state_18335;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18335__$1,inst_18333);
} else {
if((state_val_18336 === (4))){
var inst_18325 = (state_18335[(2)]);
var inst_18326 = process.call(null,inst_18325);
var state_18335__$1 = state_18335;
if(cljs.core.truth_(inst_18326)){
var statearr_18338_18496 = state_18335__$1;
(statearr_18338_18496[(1)] = (5));

} else {
var statearr_18339_18497 = state_18335__$1;
(statearr_18339_18497[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18336 === (5))){
var state_18335__$1 = state_18335;
var statearr_18340_18498 = state_18335__$1;
(statearr_18340_18498[(2)] = null);

(statearr_18340_18498[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18336 === (6))){
var state_18335__$1 = state_18335;
var statearr_18341_18499 = state_18335__$1;
(statearr_18341_18499[(2)] = null);

(statearr_18341_18499[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18336 === (7))){
var inst_18331 = (state_18335[(2)]);
var state_18335__$1 = state_18335;
var statearr_18342_18500 = state_18335__$1;
(statearr_18342_18500[(2)] = inst_18331);

(statearr_18342_18500[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
});})(__18491,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
;
return ((function (__18491,switch__17825__auto__,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_18346 = [null,null,null,null,null,null,null];
(statearr_18346[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__);

(statearr_18346[(1)] = (1));

return statearr_18346;
});
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1 = (function (state_18335){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18335);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18347){if((e18347 instanceof Object)){
var ex__17829__auto__ = e18347;
var statearr_18348_18501 = state_18335;
(statearr_18348_18501[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18335);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18347;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18502 = state_18335;
state_18335 = G__18502;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = function(state_18335){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1.call(this,state_18335);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__;
})()
;})(__18491,switch__17825__auto__,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
})();
var state__17939__auto__ = (function (){var statearr_18349 = f__17938__auto__.call(null);
(statearr_18349[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18494);

return statearr_18349;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(__18491,c__17937__auto___18494,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
);


break;
case "async":
var c__17937__auto___18503 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (__18491,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (__18491,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function (state_18362){
var state_val_18363 = (state_18362[(1)]);
if((state_val_18363 === (1))){
var state_18362__$1 = state_18362;
var statearr_18364_18504 = state_18362__$1;
(statearr_18364_18504[(2)] = null);

(statearr_18364_18504[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18363 === (2))){
var state_18362__$1 = state_18362;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18362__$1,(4),jobs);
} else {
if((state_val_18363 === (3))){
var inst_18360 = (state_18362[(2)]);
var state_18362__$1 = state_18362;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18362__$1,inst_18360);
} else {
if((state_val_18363 === (4))){
var inst_18352 = (state_18362[(2)]);
var inst_18353 = async.call(null,inst_18352);
var state_18362__$1 = state_18362;
if(cljs.core.truth_(inst_18353)){
var statearr_18365_18505 = state_18362__$1;
(statearr_18365_18505[(1)] = (5));

} else {
var statearr_18366_18506 = state_18362__$1;
(statearr_18366_18506[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18363 === (5))){
var state_18362__$1 = state_18362;
var statearr_18367_18507 = state_18362__$1;
(statearr_18367_18507[(2)] = null);

(statearr_18367_18507[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18363 === (6))){
var state_18362__$1 = state_18362;
var statearr_18368_18508 = state_18362__$1;
(statearr_18368_18508[(2)] = null);

(statearr_18368_18508[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18363 === (7))){
var inst_18358 = (state_18362[(2)]);
var state_18362__$1 = state_18362;
var statearr_18369_18509 = state_18362__$1;
(statearr_18369_18509[(2)] = inst_18358);

(statearr_18369_18509[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
}
}
}
}
}
}
});})(__18491,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
;
return ((function (__18491,switch__17825__auto__,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_18373 = [null,null,null,null,null,null,null];
(statearr_18373[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__);

(statearr_18373[(1)] = (1));

return statearr_18373;
});
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1 = (function (state_18362){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18362);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18374){if((e18374 instanceof Object)){
var ex__17829__auto__ = e18374;
var statearr_18375_18510 = state_18362;
(statearr_18375_18510[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18362);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18374;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18511 = state_18362;
state_18362 = G__18511;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = function(state_18362){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1.call(this,state_18362);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__;
})()
;})(__18491,switch__17825__auto__,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
})();
var state__17939__auto__ = (function (){var statearr_18376 = f__17938__auto__.call(null);
(statearr_18376[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18503);

return statearr_18376;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(__18491,c__17937__auto___18503,G__18322_18492,n__7131__auto___18490,jobs,results,process,async))
);


break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(type)].join('')));

}

var G__18512 = (__18491 + (1));
__18491 = G__18512;
continue;
} else {
}
break;
}

var c__17937__auto___18513 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___18513,jobs,results,process,async){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___18513,jobs,results,process,async){
return (function (state_18398){
var state_val_18399 = (state_18398[(1)]);
if((state_val_18399 === (1))){
var state_18398__$1 = state_18398;
var statearr_18400_18514 = state_18398__$1;
(statearr_18400_18514[(2)] = null);

(statearr_18400_18514[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18399 === (2))){
var state_18398__$1 = state_18398;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18398__$1,(4),from);
} else {
if((state_val_18399 === (3))){
var inst_18396 = (state_18398[(2)]);
var state_18398__$1 = state_18398;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18398__$1,inst_18396);
} else {
if((state_val_18399 === (4))){
var inst_18379 = (state_18398[(7)]);
var inst_18379__$1 = (state_18398[(2)]);
var inst_18380 = (inst_18379__$1 == null);
var state_18398__$1 = (function (){var statearr_18401 = state_18398;
(statearr_18401[(7)] = inst_18379__$1);

return statearr_18401;
})();
if(cljs.core.truth_(inst_18380)){
var statearr_18402_18515 = state_18398__$1;
(statearr_18402_18515[(1)] = (5));

} else {
var statearr_18403_18516 = state_18398__$1;
(statearr_18403_18516[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18399 === (5))){
var inst_18382 = cljs.core.async.close_BANG_.call(null,jobs);
var state_18398__$1 = state_18398;
var statearr_18404_18517 = state_18398__$1;
(statearr_18404_18517[(2)] = inst_18382);

(statearr_18404_18517[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18399 === (6))){
var inst_18379 = (state_18398[(7)]);
var inst_18384 = (state_18398[(8)]);
var inst_18384__$1 = cljs.core.async.chan.call(null,(1));
var inst_18385 = cljs.core.PersistentVector.EMPTY_NODE;
var inst_18386 = [inst_18379,inst_18384__$1];
var inst_18387 = (new cljs.core.PersistentVector(null,2,(5),inst_18385,inst_18386,null));
var state_18398__$1 = (function (){var statearr_18405 = state_18398;
(statearr_18405[(8)] = inst_18384__$1);

return statearr_18405;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18398__$1,(8),jobs,inst_18387);
} else {
if((state_val_18399 === (7))){
var inst_18394 = (state_18398[(2)]);
var state_18398__$1 = state_18398;
var statearr_18406_18518 = state_18398__$1;
(statearr_18406_18518[(2)] = inst_18394);

(statearr_18406_18518[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18399 === (8))){
var inst_18384 = (state_18398[(8)]);
var inst_18389 = (state_18398[(2)]);
var state_18398__$1 = (function (){var statearr_18407 = state_18398;
(statearr_18407[(9)] = inst_18389);

return statearr_18407;
})();
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18398__$1,(9),results,inst_18384);
} else {
if((state_val_18399 === (9))){
var inst_18391 = (state_18398[(2)]);
var state_18398__$1 = (function (){var statearr_18408 = state_18398;
(statearr_18408[(10)] = inst_18391);

return statearr_18408;
})();
var statearr_18409_18519 = state_18398__$1;
(statearr_18409_18519[(2)] = null);

(statearr_18409_18519[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___18513,jobs,results,process,async))
;
return ((function (switch__17825__auto__,c__17937__auto___18513,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_18413 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_18413[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__);

(statearr_18413[(1)] = (1));

return statearr_18413;
});
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1 = (function (state_18398){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18398);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18414){if((e18414 instanceof Object)){
var ex__17829__auto__ = e18414;
var statearr_18415_18520 = state_18398;
(statearr_18415_18520[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18398);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18414;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18521 = state_18398;
state_18398 = G__18521;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = function(state_18398){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1.call(this,state_18398);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___18513,jobs,results,process,async))
})();
var state__17939__auto__ = (function (){var statearr_18416 = f__17938__auto__.call(null);
(statearr_18416[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18513);

return statearr_18416;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___18513,jobs,results,process,async))
);


var c__17937__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto__,jobs,results,process,async){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto__,jobs,results,process,async){
return (function (state_18454){
var state_val_18455 = (state_18454[(1)]);
if((state_val_18455 === (7))){
var inst_18450 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
var statearr_18456_18522 = state_18454__$1;
(statearr_18456_18522[(2)] = inst_18450);

(statearr_18456_18522[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (20))){
var state_18454__$1 = state_18454;
var statearr_18457_18523 = state_18454__$1;
(statearr_18457_18523[(2)] = null);

(statearr_18457_18523[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (1))){
var state_18454__$1 = state_18454;
var statearr_18458_18524 = state_18454__$1;
(statearr_18458_18524[(2)] = null);

(statearr_18458_18524[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (4))){
var inst_18419 = (state_18454[(7)]);
var inst_18419__$1 = (state_18454[(2)]);
var inst_18420 = (inst_18419__$1 == null);
var state_18454__$1 = (function (){var statearr_18459 = state_18454;
(statearr_18459[(7)] = inst_18419__$1);

return statearr_18459;
})();
if(cljs.core.truth_(inst_18420)){
var statearr_18460_18525 = state_18454__$1;
(statearr_18460_18525[(1)] = (5));

} else {
var statearr_18461_18526 = state_18454__$1;
(statearr_18461_18526[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (15))){
var inst_18432 = (state_18454[(8)]);
var state_18454__$1 = state_18454;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18454__$1,(18),to,inst_18432);
} else {
if((state_val_18455 === (21))){
var inst_18445 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
var statearr_18462_18527 = state_18454__$1;
(statearr_18462_18527[(2)] = inst_18445);

(statearr_18462_18527[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (13))){
var inst_18447 = (state_18454[(2)]);
var state_18454__$1 = (function (){var statearr_18463 = state_18454;
(statearr_18463[(9)] = inst_18447);

return statearr_18463;
})();
var statearr_18464_18528 = state_18454__$1;
(statearr_18464_18528[(2)] = null);

(statearr_18464_18528[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (6))){
var inst_18419 = (state_18454[(7)]);
var state_18454__$1 = state_18454;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18454__$1,(11),inst_18419);
} else {
if((state_val_18455 === (17))){
var inst_18440 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
if(cljs.core.truth_(inst_18440)){
var statearr_18465_18529 = state_18454__$1;
(statearr_18465_18529[(1)] = (19));

} else {
var statearr_18466_18530 = state_18454__$1;
(statearr_18466_18530[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (3))){
var inst_18452 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18454__$1,inst_18452);
} else {
if((state_val_18455 === (12))){
var inst_18429 = (state_18454[(10)]);
var state_18454__$1 = state_18454;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18454__$1,(14),inst_18429);
} else {
if((state_val_18455 === (2))){
var state_18454__$1 = state_18454;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18454__$1,(4),results);
} else {
if((state_val_18455 === (19))){
var state_18454__$1 = state_18454;
var statearr_18467_18531 = state_18454__$1;
(statearr_18467_18531[(2)] = null);

(statearr_18467_18531[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (11))){
var inst_18429 = (state_18454[(2)]);
var state_18454__$1 = (function (){var statearr_18468 = state_18454;
(statearr_18468[(10)] = inst_18429);

return statearr_18468;
})();
var statearr_18469_18532 = state_18454__$1;
(statearr_18469_18532[(2)] = null);

(statearr_18469_18532[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (9))){
var state_18454__$1 = state_18454;
var statearr_18470_18533 = state_18454__$1;
(statearr_18470_18533[(2)] = null);

(statearr_18470_18533[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (5))){
var state_18454__$1 = state_18454;
if(cljs.core.truth_(close_QMARK_)){
var statearr_18471_18534 = state_18454__$1;
(statearr_18471_18534[(1)] = (8));

} else {
var statearr_18472_18535 = state_18454__$1;
(statearr_18472_18535[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (14))){
var inst_18434 = (state_18454[(11)]);
var inst_18432 = (state_18454[(8)]);
var inst_18432__$1 = (state_18454[(2)]);
var inst_18433 = (inst_18432__$1 == null);
var inst_18434__$1 = cljs.core.not.call(null,inst_18433);
var state_18454__$1 = (function (){var statearr_18473 = state_18454;
(statearr_18473[(11)] = inst_18434__$1);

(statearr_18473[(8)] = inst_18432__$1);

return statearr_18473;
})();
if(inst_18434__$1){
var statearr_18474_18536 = state_18454__$1;
(statearr_18474_18536[(1)] = (15));

} else {
var statearr_18475_18537 = state_18454__$1;
(statearr_18475_18537[(1)] = (16));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (16))){
var inst_18434 = (state_18454[(11)]);
var state_18454__$1 = state_18454;
var statearr_18476_18538 = state_18454__$1;
(statearr_18476_18538[(2)] = inst_18434);

(statearr_18476_18538[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (10))){
var inst_18426 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
var statearr_18477_18539 = state_18454__$1;
(statearr_18477_18539[(2)] = inst_18426);

(statearr_18477_18539[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (18))){
var inst_18437 = (state_18454[(2)]);
var state_18454__$1 = state_18454;
var statearr_18478_18540 = state_18454__$1;
(statearr_18478_18540[(2)] = inst_18437);

(statearr_18478_18540[(1)] = (17));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18455 === (8))){
var inst_18423 = cljs.core.async.close_BANG_.call(null,to);
var state_18454__$1 = state_18454;
var statearr_18479_18541 = state_18454__$1;
(statearr_18479_18541[(2)] = inst_18423);

(statearr_18479_18541[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto__,jobs,results,process,async))
;
return ((function (switch__17825__auto__,c__17937__auto__,jobs,results,process,async){
return (function() {
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_18483 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_18483[(0)] = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__);

(statearr_18483[(1)] = (1));

return statearr_18483;
});
var cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1 = (function (state_18454){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18454);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18484){if((e18484 instanceof Object)){
var ex__17829__auto__ = e18484;
var statearr_18485_18542 = state_18454;
(statearr_18485_18542[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18454);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18484;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18543 = state_18454;
state_18454 = G__18543;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__ = function(state_18454){
switch(arguments.length){
case 0:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1.call(this,state_18454);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____0;
cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$pipeline_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$pipeline_STAR__$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto__,jobs,results,process,async))
})();
var state__17939__auto__ = (function (){var statearr_18486 = f__17938__auto__.call(null);
(statearr_18486[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto__);

return statearr_18486;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto__,jobs,results,process,async))
);

return c__17937__auto__;
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
var args18544 = [];
var len__7291__auto___18547 = arguments.length;
var i__7292__auto___18548 = (0);
while(true){
if((i__7292__auto___18548 < len__7291__auto___18547)){
args18544.push((arguments[i__7292__auto___18548]));

var G__18549 = (i__7292__auto___18548 + (1));
i__7292__auto___18548 = G__18549;
continue;
} else {
}
break;
}

var G__18546 = args18544.length;
switch (G__18546) {
case 4:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18544.length)].join('')));

}
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$4 = (function (n,to,af,from){
return cljs.core.async.pipeline_async.call(null,n,to,af,from,true);
});

cljs.core.async.pipeline_async.cljs$core$IFn$_invoke$arity$5 = (function (n,to,af,from,close_QMARK_){
return cljs.core.async.pipeline_STAR_.call(null,n,to,af,from,close_QMARK_,null,new cljs.core.Keyword(null,"async","async",1050769601));
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
var args18551 = [];
var len__7291__auto___18554 = arguments.length;
var i__7292__auto___18555 = (0);
while(true){
if((i__7292__auto___18555 < len__7291__auto___18554)){
args18551.push((arguments[i__7292__auto___18555]));

var G__18556 = (i__7292__auto___18555 + (1));
i__7292__auto___18555 = G__18556;
continue;
} else {
}
break;
}

var G__18553 = args18551.length;
switch (G__18553) {
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
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18551.length)].join('')));

}
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$4 = (function (n,to,xf,from){
return cljs.core.async.pipeline.call(null,n,to,xf,from,true);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$5 = (function (n,to,xf,from,close_QMARK_){
return cljs.core.async.pipeline.call(null,n,to,xf,from,close_QMARK_,null);
});

cljs.core.async.pipeline.cljs$core$IFn$_invoke$arity$6 = (function (n,to,xf,from,close_QMARK_,ex_handler){
return cljs.core.async.pipeline_STAR_.call(null,n,to,xf,from,close_QMARK_,ex_handler,new cljs.core.Keyword(null,"compute","compute",1555393130));
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
var args18558 = [];
var len__7291__auto___18611 = arguments.length;
var i__7292__auto___18612 = (0);
while(true){
if((i__7292__auto___18612 < len__7291__auto___18611)){
args18558.push((arguments[i__7292__auto___18612]));

var G__18613 = (i__7292__auto___18612 + (1));
i__7292__auto___18612 = G__18613;
continue;
} else {
}
break;
}

var G__18560 = args18558.length;
switch (G__18560) {
case 2:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 4:
return cljs.core.async.split.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18558.length)].join('')));

}
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.split.call(null,p,ch,null,null);
});

cljs.core.async.split.cljs$core$IFn$_invoke$arity$4 = (function (p,ch,t_buf_or_n,f_buf_or_n){
var tc = cljs.core.async.chan.call(null,t_buf_or_n);
var fc = cljs.core.async.chan.call(null,f_buf_or_n);
var c__17937__auto___18615 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___18615,tc,fc){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___18615,tc,fc){
return (function (state_18586){
var state_val_18587 = (state_18586[(1)]);
if((state_val_18587 === (7))){
var inst_18582 = (state_18586[(2)]);
var state_18586__$1 = state_18586;
var statearr_18588_18616 = state_18586__$1;
(statearr_18588_18616[(2)] = inst_18582);

(statearr_18588_18616[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (1))){
var state_18586__$1 = state_18586;
var statearr_18589_18617 = state_18586__$1;
(statearr_18589_18617[(2)] = null);

(statearr_18589_18617[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (4))){
var inst_18563 = (state_18586[(7)]);
var inst_18563__$1 = (state_18586[(2)]);
var inst_18564 = (inst_18563__$1 == null);
var state_18586__$1 = (function (){var statearr_18590 = state_18586;
(statearr_18590[(7)] = inst_18563__$1);

return statearr_18590;
})();
if(cljs.core.truth_(inst_18564)){
var statearr_18591_18618 = state_18586__$1;
(statearr_18591_18618[(1)] = (5));

} else {
var statearr_18592_18619 = state_18586__$1;
(statearr_18592_18619[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (13))){
var state_18586__$1 = state_18586;
var statearr_18593_18620 = state_18586__$1;
(statearr_18593_18620[(2)] = null);

(statearr_18593_18620[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (6))){
var inst_18563 = (state_18586[(7)]);
var inst_18569 = p.call(null,inst_18563);
var state_18586__$1 = state_18586;
if(cljs.core.truth_(inst_18569)){
var statearr_18594_18621 = state_18586__$1;
(statearr_18594_18621[(1)] = (9));

} else {
var statearr_18595_18622 = state_18586__$1;
(statearr_18595_18622[(1)] = (10));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (3))){
var inst_18584 = (state_18586[(2)]);
var state_18586__$1 = state_18586;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18586__$1,inst_18584);
} else {
if((state_val_18587 === (12))){
var state_18586__$1 = state_18586;
var statearr_18596_18623 = state_18586__$1;
(statearr_18596_18623[(2)] = null);

(statearr_18596_18623[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (2))){
var state_18586__$1 = state_18586;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18586__$1,(4),ch);
} else {
if((state_val_18587 === (11))){
var inst_18563 = (state_18586[(7)]);
var inst_18573 = (state_18586[(2)]);
var state_18586__$1 = state_18586;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18586__$1,(8),inst_18573,inst_18563);
} else {
if((state_val_18587 === (9))){
var state_18586__$1 = state_18586;
var statearr_18597_18624 = state_18586__$1;
(statearr_18597_18624[(2)] = tc);

(statearr_18597_18624[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (5))){
var inst_18566 = cljs.core.async.close_BANG_.call(null,tc);
var inst_18567 = cljs.core.async.close_BANG_.call(null,fc);
var state_18586__$1 = (function (){var statearr_18598 = state_18586;
(statearr_18598[(8)] = inst_18566);

return statearr_18598;
})();
var statearr_18599_18625 = state_18586__$1;
(statearr_18599_18625[(2)] = inst_18567);

(statearr_18599_18625[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (14))){
var inst_18580 = (state_18586[(2)]);
var state_18586__$1 = state_18586;
var statearr_18600_18626 = state_18586__$1;
(statearr_18600_18626[(2)] = inst_18580);

(statearr_18600_18626[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (10))){
var state_18586__$1 = state_18586;
var statearr_18601_18627 = state_18586__$1;
(statearr_18601_18627[(2)] = fc);

(statearr_18601_18627[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18587 === (8))){
var inst_18575 = (state_18586[(2)]);
var state_18586__$1 = state_18586;
if(cljs.core.truth_(inst_18575)){
var statearr_18602_18628 = state_18586__$1;
(statearr_18602_18628[(1)] = (12));

} else {
var statearr_18603_18629 = state_18586__$1;
(statearr_18603_18629[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___18615,tc,fc))
;
return ((function (switch__17825__auto__,c__17937__auto___18615,tc,fc){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_18607 = [null,null,null,null,null,null,null,null,null];
(statearr_18607[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_18607[(1)] = (1));

return statearr_18607;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_18586){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18586);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18608){if((e18608 instanceof Object)){
var ex__17829__auto__ = e18608;
var statearr_18609_18630 = state_18586;
(statearr_18609_18630[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18586);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18608;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18631 = state_18586;
state_18586 = G__18631;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_18586){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_18586);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___18615,tc,fc))
})();
var state__17939__auto__ = (function (){var statearr_18610 = f__17938__auto__.call(null);
(statearr_18610[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___18615);

return statearr_18610;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___18615,tc,fc))
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
var c__17937__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto__){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto__){
return (function (state_18695){
var state_val_18696 = (state_18695[(1)]);
if((state_val_18696 === (7))){
var inst_18691 = (state_18695[(2)]);
var state_18695__$1 = state_18695;
var statearr_18697_18718 = state_18695__$1;
(statearr_18697_18718[(2)] = inst_18691);

(statearr_18697_18718[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (1))){
var inst_18675 = init;
var state_18695__$1 = (function (){var statearr_18698 = state_18695;
(statearr_18698[(7)] = inst_18675);

return statearr_18698;
})();
var statearr_18699_18719 = state_18695__$1;
(statearr_18699_18719[(2)] = null);

(statearr_18699_18719[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (4))){
var inst_18678 = (state_18695[(8)]);
var inst_18678__$1 = (state_18695[(2)]);
var inst_18679 = (inst_18678__$1 == null);
var state_18695__$1 = (function (){var statearr_18700 = state_18695;
(statearr_18700[(8)] = inst_18678__$1);

return statearr_18700;
})();
if(cljs.core.truth_(inst_18679)){
var statearr_18701_18720 = state_18695__$1;
(statearr_18701_18720[(1)] = (5));

} else {
var statearr_18702_18721 = state_18695__$1;
(statearr_18702_18721[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (6))){
var inst_18678 = (state_18695[(8)]);
var inst_18682 = (state_18695[(9)]);
var inst_18675 = (state_18695[(7)]);
var inst_18682__$1 = f.call(null,inst_18675,inst_18678);
var inst_18683 = cljs.core.reduced_QMARK_.call(null,inst_18682__$1);
var state_18695__$1 = (function (){var statearr_18703 = state_18695;
(statearr_18703[(9)] = inst_18682__$1);

return statearr_18703;
})();
if(inst_18683){
var statearr_18704_18722 = state_18695__$1;
(statearr_18704_18722[(1)] = (8));

} else {
var statearr_18705_18723 = state_18695__$1;
(statearr_18705_18723[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (3))){
var inst_18693 = (state_18695[(2)]);
var state_18695__$1 = state_18695;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18695__$1,inst_18693);
} else {
if((state_val_18696 === (2))){
var state_18695__$1 = state_18695;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_18695__$1,(4),ch);
} else {
if((state_val_18696 === (9))){
var inst_18682 = (state_18695[(9)]);
var inst_18675 = inst_18682;
var state_18695__$1 = (function (){var statearr_18706 = state_18695;
(statearr_18706[(7)] = inst_18675);

return statearr_18706;
})();
var statearr_18707_18724 = state_18695__$1;
(statearr_18707_18724[(2)] = null);

(statearr_18707_18724[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (5))){
var inst_18675 = (state_18695[(7)]);
var state_18695__$1 = state_18695;
var statearr_18708_18725 = state_18695__$1;
(statearr_18708_18725[(2)] = inst_18675);

(statearr_18708_18725[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (10))){
var inst_18689 = (state_18695[(2)]);
var state_18695__$1 = state_18695;
var statearr_18709_18726 = state_18695__$1;
(statearr_18709_18726[(2)] = inst_18689);

(statearr_18709_18726[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18696 === (8))){
var inst_18682 = (state_18695[(9)]);
var inst_18685 = cljs.core.deref.call(null,inst_18682);
var state_18695__$1 = state_18695;
var statearr_18710_18727 = state_18695__$1;
(statearr_18710_18727[(2)] = inst_18685);

(statearr_18710_18727[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto__))
;
return ((function (switch__17825__auto__,c__17937__auto__){
return (function() {
var cljs$core$async$reduce_$_state_machine__17826__auto__ = null;
var cljs$core$async$reduce_$_state_machine__17826__auto____0 = (function (){
var statearr_18714 = [null,null,null,null,null,null,null,null,null,null];
(statearr_18714[(0)] = cljs$core$async$reduce_$_state_machine__17826__auto__);

(statearr_18714[(1)] = (1));

return statearr_18714;
});
var cljs$core$async$reduce_$_state_machine__17826__auto____1 = (function (state_18695){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18695);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18715){if((e18715 instanceof Object)){
var ex__17829__auto__ = e18715;
var statearr_18716_18728 = state_18695;
(statearr_18716_18728[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18695);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18715;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18729 = state_18695;
state_18695 = G__18729;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$reduce_$_state_machine__17826__auto__ = function(state_18695){
switch(arguments.length){
case 0:
return cljs$core$async$reduce_$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$reduce_$_state_machine__17826__auto____1.call(this,state_18695);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$reduce_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$reduce_$_state_machine__17826__auto____0;
cljs$core$async$reduce_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$reduce_$_state_machine__17826__auto____1;
return cljs$core$async$reduce_$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto__))
})();
var state__17939__auto__ = (function (){var statearr_18717 = f__17938__auto__.call(null);
(statearr_18717[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto__);

return statearr_18717;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto__))
);

return c__17937__auto__;
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
var args18730 = [];
var len__7291__auto___18782 = arguments.length;
var i__7292__auto___18783 = (0);
while(true){
if((i__7292__auto___18783 < len__7291__auto___18782)){
args18730.push((arguments[i__7292__auto___18783]));

var G__18784 = (i__7292__auto___18783 + (1));
i__7292__auto___18783 = G__18784;
continue;
} else {
}
break;
}

var G__18732 = args18730.length;
switch (G__18732) {
case 2:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args18730.length)].join('')));

}
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$2 = (function (ch,coll){
return cljs.core.async.onto_chan.call(null,ch,coll,true);
});

cljs.core.async.onto_chan.cljs$core$IFn$_invoke$arity$3 = (function (ch,coll,close_QMARK_){
var c__17937__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto__){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto__){
return (function (state_18757){
var state_val_18758 = (state_18757[(1)]);
if((state_val_18758 === (7))){
var inst_18739 = (state_18757[(2)]);
var state_18757__$1 = state_18757;
var statearr_18759_18786 = state_18757__$1;
(statearr_18759_18786[(2)] = inst_18739);

(statearr_18759_18786[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (1))){
var inst_18733 = cljs.core.seq.call(null,coll);
var inst_18734 = inst_18733;
var state_18757__$1 = (function (){var statearr_18760 = state_18757;
(statearr_18760[(7)] = inst_18734);

return statearr_18760;
})();
var statearr_18761_18787 = state_18757__$1;
(statearr_18761_18787[(2)] = null);

(statearr_18761_18787[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (4))){
var inst_18734 = (state_18757[(7)]);
var inst_18737 = cljs.core.first.call(null,inst_18734);
var state_18757__$1 = state_18757;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_18757__$1,(7),ch,inst_18737);
} else {
if((state_val_18758 === (13))){
var inst_18751 = (state_18757[(2)]);
var state_18757__$1 = state_18757;
var statearr_18762_18788 = state_18757__$1;
(statearr_18762_18788[(2)] = inst_18751);

(statearr_18762_18788[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (6))){
var inst_18742 = (state_18757[(2)]);
var state_18757__$1 = state_18757;
if(cljs.core.truth_(inst_18742)){
var statearr_18763_18789 = state_18757__$1;
(statearr_18763_18789[(1)] = (8));

} else {
var statearr_18764_18790 = state_18757__$1;
(statearr_18764_18790[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (3))){
var inst_18755 = (state_18757[(2)]);
var state_18757__$1 = state_18757;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_18757__$1,inst_18755);
} else {
if((state_val_18758 === (12))){
var state_18757__$1 = state_18757;
var statearr_18765_18791 = state_18757__$1;
(statearr_18765_18791[(2)] = null);

(statearr_18765_18791[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (2))){
var inst_18734 = (state_18757[(7)]);
var state_18757__$1 = state_18757;
if(cljs.core.truth_(inst_18734)){
var statearr_18766_18792 = state_18757__$1;
(statearr_18766_18792[(1)] = (4));

} else {
var statearr_18767_18793 = state_18757__$1;
(statearr_18767_18793[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (11))){
var inst_18748 = cljs.core.async.close_BANG_.call(null,ch);
var state_18757__$1 = state_18757;
var statearr_18768_18794 = state_18757__$1;
(statearr_18768_18794[(2)] = inst_18748);

(statearr_18768_18794[(1)] = (13));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (9))){
var state_18757__$1 = state_18757;
if(cljs.core.truth_(close_QMARK_)){
var statearr_18769_18795 = state_18757__$1;
(statearr_18769_18795[(1)] = (11));

} else {
var statearr_18770_18796 = state_18757__$1;
(statearr_18770_18796[(1)] = (12));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (5))){
var inst_18734 = (state_18757[(7)]);
var state_18757__$1 = state_18757;
var statearr_18771_18797 = state_18757__$1;
(statearr_18771_18797[(2)] = inst_18734);

(statearr_18771_18797[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (10))){
var inst_18753 = (state_18757[(2)]);
var state_18757__$1 = state_18757;
var statearr_18772_18798 = state_18757__$1;
(statearr_18772_18798[(2)] = inst_18753);

(statearr_18772_18798[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_18758 === (8))){
var inst_18734 = (state_18757[(7)]);
var inst_18744 = cljs.core.next.call(null,inst_18734);
var inst_18734__$1 = inst_18744;
var state_18757__$1 = (function (){var statearr_18773 = state_18757;
(statearr_18773[(7)] = inst_18734__$1);

return statearr_18773;
})();
var statearr_18774_18799 = state_18757__$1;
(statearr_18774_18799[(2)] = null);

(statearr_18774_18799[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto__))
;
return ((function (switch__17825__auto__,c__17937__auto__){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_18778 = [null,null,null,null,null,null,null,null];
(statearr_18778[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_18778[(1)] = (1));

return statearr_18778;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_18757){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_18757);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e18779){if((e18779 instanceof Object)){
var ex__17829__auto__ = e18779;
var statearr_18780_18800 = state_18757;
(statearr_18780_18800[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_18757);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e18779;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__18801 = state_18757;
state_18757 = G__18801;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_18757){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_18757);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto__))
})();
var state__17939__auto__ = (function (){var statearr_18781 = f__17938__auto__.call(null);
(statearr_18781[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto__);

return statearr_18781;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto__))
);

return c__17937__auto__;
});

cljs.core.async.onto_chan.cljs$lang$maxFixedArity = 3;
/**
 * Creates and returns a channel which contains the contents of coll,
 *   closing when exhausted.
 */
cljs.core.async.to_chan = (function cljs$core$async$to_chan(coll){
var ch = cljs.core.async.chan.call(null,cljs.core.bounded_count.call(null,(100),coll));
cljs.core.async.onto_chan.call(null,ch,coll);

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
return m__6880__auto__.call(null,_);
} else {
var m__6880__auto____$1 = (cljs.core.async.muxch_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,_);
} else {
throw cljs.core.missing_protocol.call(null,"Mux.muxch*",_);
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
return m__6880__auto__.call(null,m,ch,close_QMARK_);
} else {
var m__6880__auto____$1 = (cljs.core.async.tap_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,ch,close_QMARK_);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.tap*",m);
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
return m__6880__auto__.call(null,m,ch);
} else {
var m__6880__auto____$1 = (cljs.core.async.untap_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.untap*",m);
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
return m__6880__auto__.call(null,m);
} else {
var m__6880__auto____$1 = (cljs.core.async.untap_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m);
} else {
throw cljs.core.missing_protocol.call(null,"Mult.untap-all*",m);
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
var cs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async19023 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Mult}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async19023 = (function (mult,ch,cs,meta19024){
this.mult = mult;
this.ch = ch;
this.cs = cs;
this.meta19024 = meta19024;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs){
return (function (_19025,meta19024__$1){
var self__ = this;
var _19025__$1 = this;
return (new cljs.core.async.t_cljs$core$async19023(self__.mult,self__.ch,self__.cs,meta19024__$1));
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs){
return (function (_19025){
var self__ = this;
var _19025__$1 = this;
return self__.meta19024;
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mult$ = true;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mult$tap_STAR_$arity$3 = ((function (cs){
return (function (_,ch__$1,close_QMARK_){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.assoc,ch__$1,close_QMARK_);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mult$untap_STAR_$arity$2 = ((function (cs){
return (function (_,ch__$1){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.dissoc,ch__$1);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.prototype.cljs$core$async$Mult$untap_all_STAR_$arity$1 = ((function (cs){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return null;
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.getBasis = ((function (cs){
return (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"mult","mult",-1187640995,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Creates and returns a mult(iple) of the supplied channel. Channels\n  containing copies of the channel can be created with 'tap', and\n  detached with 'untap'.\n\n  Each item is distributed to all taps in parallel and synchronously,\n  i.e. each tap must accept before the next item is distributed. Use\n  buffering/windowing to prevent slow taps from holding up the mult.\n\n  Items received when there are no taps get dropped.\n\n  If a tap puts to a closed channel, it will be removed from the mult."], null)),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"meta19024","meta19024",-2038648076,null)], null);
});})(cs))
;

cljs.core.async.t_cljs$core$async19023.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async19023.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async19023";

cljs.core.async.t_cljs$core$async19023.cljs$lang$ctorPrWriter = ((function (cs){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async19023");
});})(cs))
;

cljs.core.async.__GT_t_cljs$core$async19023 = ((function (cs){
return (function cljs$core$async$mult_$___GT_t_cljs$core$async19023(mult__$1,ch__$1,cs__$1,meta19024){
return (new cljs.core.async.t_cljs$core$async19023(mult__$1,ch__$1,cs__$1,meta19024));
});})(cs))
;

}

return (new cljs.core.async.t_cljs$core$async19023(cljs$core$async$mult,ch,cs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var dchan = cljs.core.async.chan.call(null,(1));
var dctr = cljs.core.atom.call(null,null);
var done = ((function (cs,m,dchan,dctr){
return (function (_){
if((cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.call(null,dchan,true);
} else {
return null;
}
});})(cs,m,dchan,dctr))
;
var c__17937__auto___19244 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___19244,cs,m,dchan,dctr,done){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___19244,cs,m,dchan,dctr,done){
return (function (state_19156){
var state_val_19157 = (state_19156[(1)]);
if((state_val_19157 === (7))){
var inst_19152 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19158_19245 = state_19156__$1;
(statearr_19158_19245[(2)] = inst_19152);

(statearr_19158_19245[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (20))){
var inst_19057 = (state_19156[(7)]);
var inst_19067 = cljs.core.first.call(null,inst_19057);
var inst_19068 = cljs.core.nth.call(null,inst_19067,(0),null);
var inst_19069 = cljs.core.nth.call(null,inst_19067,(1),null);
var state_19156__$1 = (function (){var statearr_19159 = state_19156;
(statearr_19159[(8)] = inst_19068);

return statearr_19159;
})();
if(cljs.core.truth_(inst_19069)){
var statearr_19160_19246 = state_19156__$1;
(statearr_19160_19246[(1)] = (22));

} else {
var statearr_19161_19247 = state_19156__$1;
(statearr_19161_19247[(1)] = (23));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (27))){
var inst_19097 = (state_19156[(9)]);
var inst_19028 = (state_19156[(10)]);
var inst_19099 = (state_19156[(11)]);
var inst_19104 = (state_19156[(12)]);
var inst_19104__$1 = cljs.core._nth.call(null,inst_19097,inst_19099);
var inst_19105 = cljs.core.async.put_BANG_.call(null,inst_19104__$1,inst_19028,done);
var state_19156__$1 = (function (){var statearr_19162 = state_19156;
(statearr_19162[(12)] = inst_19104__$1);

return statearr_19162;
})();
if(cljs.core.truth_(inst_19105)){
var statearr_19163_19248 = state_19156__$1;
(statearr_19163_19248[(1)] = (30));

} else {
var statearr_19164_19249 = state_19156__$1;
(statearr_19164_19249[(1)] = (31));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (1))){
var state_19156__$1 = state_19156;
var statearr_19165_19250 = state_19156__$1;
(statearr_19165_19250[(2)] = null);

(statearr_19165_19250[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (24))){
var inst_19057 = (state_19156[(7)]);
var inst_19074 = (state_19156[(2)]);
var inst_19075 = cljs.core.next.call(null,inst_19057);
var inst_19037 = inst_19075;
var inst_19038 = null;
var inst_19039 = (0);
var inst_19040 = (0);
var state_19156__$1 = (function (){var statearr_19166 = state_19156;
(statearr_19166[(13)] = inst_19039);

(statearr_19166[(14)] = inst_19038);

(statearr_19166[(15)] = inst_19037);

(statearr_19166[(16)] = inst_19040);

(statearr_19166[(17)] = inst_19074);

return statearr_19166;
})();
var statearr_19167_19251 = state_19156__$1;
(statearr_19167_19251[(2)] = null);

(statearr_19167_19251[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (39))){
var state_19156__$1 = state_19156;
var statearr_19171_19252 = state_19156__$1;
(statearr_19171_19252[(2)] = null);

(statearr_19171_19252[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (4))){
var inst_19028 = (state_19156[(10)]);
var inst_19028__$1 = (state_19156[(2)]);
var inst_19029 = (inst_19028__$1 == null);
var state_19156__$1 = (function (){var statearr_19172 = state_19156;
(statearr_19172[(10)] = inst_19028__$1);

return statearr_19172;
})();
if(cljs.core.truth_(inst_19029)){
var statearr_19173_19253 = state_19156__$1;
(statearr_19173_19253[(1)] = (5));

} else {
var statearr_19174_19254 = state_19156__$1;
(statearr_19174_19254[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (15))){
var inst_19039 = (state_19156[(13)]);
var inst_19038 = (state_19156[(14)]);
var inst_19037 = (state_19156[(15)]);
var inst_19040 = (state_19156[(16)]);
var inst_19053 = (state_19156[(2)]);
var inst_19054 = (inst_19040 + (1));
var tmp19168 = inst_19039;
var tmp19169 = inst_19038;
var tmp19170 = inst_19037;
var inst_19037__$1 = tmp19170;
var inst_19038__$1 = tmp19169;
var inst_19039__$1 = tmp19168;
var inst_19040__$1 = inst_19054;
var state_19156__$1 = (function (){var statearr_19175 = state_19156;
(statearr_19175[(13)] = inst_19039__$1);

(statearr_19175[(18)] = inst_19053);

(statearr_19175[(14)] = inst_19038__$1);

(statearr_19175[(15)] = inst_19037__$1);

(statearr_19175[(16)] = inst_19040__$1);

return statearr_19175;
})();
var statearr_19176_19255 = state_19156__$1;
(statearr_19176_19255[(2)] = null);

(statearr_19176_19255[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (21))){
var inst_19078 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19180_19256 = state_19156__$1;
(statearr_19180_19256[(2)] = inst_19078);

(statearr_19180_19256[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (31))){
var inst_19104 = (state_19156[(12)]);
var inst_19108 = done.call(null,null);
var inst_19109 = cljs.core.async.untap_STAR_.call(null,m,inst_19104);
var state_19156__$1 = (function (){var statearr_19181 = state_19156;
(statearr_19181[(19)] = inst_19108);

return statearr_19181;
})();
var statearr_19182_19257 = state_19156__$1;
(statearr_19182_19257[(2)] = inst_19109);

(statearr_19182_19257[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (32))){
var inst_19098 = (state_19156[(20)]);
var inst_19097 = (state_19156[(9)]);
var inst_19096 = (state_19156[(21)]);
var inst_19099 = (state_19156[(11)]);
var inst_19111 = (state_19156[(2)]);
var inst_19112 = (inst_19099 + (1));
var tmp19177 = inst_19098;
var tmp19178 = inst_19097;
var tmp19179 = inst_19096;
var inst_19096__$1 = tmp19179;
var inst_19097__$1 = tmp19178;
var inst_19098__$1 = tmp19177;
var inst_19099__$1 = inst_19112;
var state_19156__$1 = (function (){var statearr_19183 = state_19156;
(statearr_19183[(20)] = inst_19098__$1);

(statearr_19183[(9)] = inst_19097__$1);

(statearr_19183[(21)] = inst_19096__$1);

(statearr_19183[(11)] = inst_19099__$1);

(statearr_19183[(22)] = inst_19111);

return statearr_19183;
})();
var statearr_19184_19258 = state_19156__$1;
(statearr_19184_19258[(2)] = null);

(statearr_19184_19258[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (40))){
var inst_19124 = (state_19156[(23)]);
var inst_19128 = done.call(null,null);
var inst_19129 = cljs.core.async.untap_STAR_.call(null,m,inst_19124);
var state_19156__$1 = (function (){var statearr_19185 = state_19156;
(statearr_19185[(24)] = inst_19128);

return statearr_19185;
})();
var statearr_19186_19259 = state_19156__$1;
(statearr_19186_19259[(2)] = inst_19129);

(statearr_19186_19259[(1)] = (41));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (33))){
var inst_19115 = (state_19156[(25)]);
var inst_19117 = cljs.core.chunked_seq_QMARK_.call(null,inst_19115);
var state_19156__$1 = state_19156;
if(inst_19117){
var statearr_19187_19260 = state_19156__$1;
(statearr_19187_19260[(1)] = (36));

} else {
var statearr_19188_19261 = state_19156__$1;
(statearr_19188_19261[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (13))){
var inst_19047 = (state_19156[(26)]);
var inst_19050 = cljs.core.async.close_BANG_.call(null,inst_19047);
var state_19156__$1 = state_19156;
var statearr_19189_19262 = state_19156__$1;
(statearr_19189_19262[(2)] = inst_19050);

(statearr_19189_19262[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (22))){
var inst_19068 = (state_19156[(8)]);
var inst_19071 = cljs.core.async.close_BANG_.call(null,inst_19068);
var state_19156__$1 = state_19156;
var statearr_19190_19263 = state_19156__$1;
(statearr_19190_19263[(2)] = inst_19071);

(statearr_19190_19263[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (36))){
var inst_19115 = (state_19156[(25)]);
var inst_19119 = cljs.core.chunk_first.call(null,inst_19115);
var inst_19120 = cljs.core.chunk_rest.call(null,inst_19115);
var inst_19121 = cljs.core.count.call(null,inst_19119);
var inst_19096 = inst_19120;
var inst_19097 = inst_19119;
var inst_19098 = inst_19121;
var inst_19099 = (0);
var state_19156__$1 = (function (){var statearr_19191 = state_19156;
(statearr_19191[(20)] = inst_19098);

(statearr_19191[(9)] = inst_19097);

(statearr_19191[(21)] = inst_19096);

(statearr_19191[(11)] = inst_19099);

return statearr_19191;
})();
var statearr_19192_19264 = state_19156__$1;
(statearr_19192_19264[(2)] = null);

(statearr_19192_19264[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (41))){
var inst_19115 = (state_19156[(25)]);
var inst_19131 = (state_19156[(2)]);
var inst_19132 = cljs.core.next.call(null,inst_19115);
var inst_19096 = inst_19132;
var inst_19097 = null;
var inst_19098 = (0);
var inst_19099 = (0);
var state_19156__$1 = (function (){var statearr_19193 = state_19156;
(statearr_19193[(20)] = inst_19098);

(statearr_19193[(9)] = inst_19097);

(statearr_19193[(21)] = inst_19096);

(statearr_19193[(11)] = inst_19099);

(statearr_19193[(27)] = inst_19131);

return statearr_19193;
})();
var statearr_19194_19265 = state_19156__$1;
(statearr_19194_19265[(2)] = null);

(statearr_19194_19265[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (43))){
var state_19156__$1 = state_19156;
var statearr_19195_19266 = state_19156__$1;
(statearr_19195_19266[(2)] = null);

(statearr_19195_19266[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (29))){
var inst_19140 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19196_19267 = state_19156__$1;
(statearr_19196_19267[(2)] = inst_19140);

(statearr_19196_19267[(1)] = (26));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (44))){
var inst_19149 = (state_19156[(2)]);
var state_19156__$1 = (function (){var statearr_19197 = state_19156;
(statearr_19197[(28)] = inst_19149);

return statearr_19197;
})();
var statearr_19198_19268 = state_19156__$1;
(statearr_19198_19268[(2)] = null);

(statearr_19198_19268[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (6))){
var inst_19088 = (state_19156[(29)]);
var inst_19087 = cljs.core.deref.call(null,cs);
var inst_19088__$1 = cljs.core.keys.call(null,inst_19087);
var inst_19089 = cljs.core.count.call(null,inst_19088__$1);
var inst_19090 = cljs.core.reset_BANG_.call(null,dctr,inst_19089);
var inst_19095 = cljs.core.seq.call(null,inst_19088__$1);
var inst_19096 = inst_19095;
var inst_19097 = null;
var inst_19098 = (0);
var inst_19099 = (0);
var state_19156__$1 = (function (){var statearr_19199 = state_19156;
(statearr_19199[(20)] = inst_19098);

(statearr_19199[(9)] = inst_19097);

(statearr_19199[(21)] = inst_19096);

(statearr_19199[(11)] = inst_19099);

(statearr_19199[(30)] = inst_19090);

(statearr_19199[(29)] = inst_19088__$1);

return statearr_19199;
})();
var statearr_19200_19269 = state_19156__$1;
(statearr_19200_19269[(2)] = null);

(statearr_19200_19269[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (28))){
var inst_19096 = (state_19156[(21)]);
var inst_19115 = (state_19156[(25)]);
var inst_19115__$1 = cljs.core.seq.call(null,inst_19096);
var state_19156__$1 = (function (){var statearr_19201 = state_19156;
(statearr_19201[(25)] = inst_19115__$1);

return statearr_19201;
})();
if(inst_19115__$1){
var statearr_19202_19270 = state_19156__$1;
(statearr_19202_19270[(1)] = (33));

} else {
var statearr_19203_19271 = state_19156__$1;
(statearr_19203_19271[(1)] = (34));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (25))){
var inst_19098 = (state_19156[(20)]);
var inst_19099 = (state_19156[(11)]);
var inst_19101 = (inst_19099 < inst_19098);
var inst_19102 = inst_19101;
var state_19156__$1 = state_19156;
if(cljs.core.truth_(inst_19102)){
var statearr_19204_19272 = state_19156__$1;
(statearr_19204_19272[(1)] = (27));

} else {
var statearr_19205_19273 = state_19156__$1;
(statearr_19205_19273[(1)] = (28));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (34))){
var state_19156__$1 = state_19156;
var statearr_19206_19274 = state_19156__$1;
(statearr_19206_19274[(2)] = null);

(statearr_19206_19274[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (17))){
var state_19156__$1 = state_19156;
var statearr_19207_19275 = state_19156__$1;
(statearr_19207_19275[(2)] = null);

(statearr_19207_19275[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (3))){
var inst_19154 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_19156__$1,inst_19154);
} else {
if((state_val_19157 === (12))){
var inst_19083 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19208_19276 = state_19156__$1;
(statearr_19208_19276[(2)] = inst_19083);

(statearr_19208_19276[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (2))){
var state_19156__$1 = state_19156;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_19156__$1,(4),ch);
} else {
if((state_val_19157 === (23))){
var state_19156__$1 = state_19156;
var statearr_19209_19277 = state_19156__$1;
(statearr_19209_19277[(2)] = null);

(statearr_19209_19277[(1)] = (24));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (35))){
var inst_19138 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19210_19278 = state_19156__$1;
(statearr_19210_19278[(2)] = inst_19138);

(statearr_19210_19278[(1)] = (29));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (19))){
var inst_19057 = (state_19156[(7)]);
var inst_19061 = cljs.core.chunk_first.call(null,inst_19057);
var inst_19062 = cljs.core.chunk_rest.call(null,inst_19057);
var inst_19063 = cljs.core.count.call(null,inst_19061);
var inst_19037 = inst_19062;
var inst_19038 = inst_19061;
var inst_19039 = inst_19063;
var inst_19040 = (0);
var state_19156__$1 = (function (){var statearr_19211 = state_19156;
(statearr_19211[(13)] = inst_19039);

(statearr_19211[(14)] = inst_19038);

(statearr_19211[(15)] = inst_19037);

(statearr_19211[(16)] = inst_19040);

return statearr_19211;
})();
var statearr_19212_19279 = state_19156__$1;
(statearr_19212_19279[(2)] = null);

(statearr_19212_19279[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (11))){
var inst_19057 = (state_19156[(7)]);
var inst_19037 = (state_19156[(15)]);
var inst_19057__$1 = cljs.core.seq.call(null,inst_19037);
var state_19156__$1 = (function (){var statearr_19213 = state_19156;
(statearr_19213[(7)] = inst_19057__$1);

return statearr_19213;
})();
if(inst_19057__$1){
var statearr_19214_19280 = state_19156__$1;
(statearr_19214_19280[(1)] = (16));

} else {
var statearr_19215_19281 = state_19156__$1;
(statearr_19215_19281[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (9))){
var inst_19085 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19216_19282 = state_19156__$1;
(statearr_19216_19282[(2)] = inst_19085);

(statearr_19216_19282[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (5))){
var inst_19035 = cljs.core.deref.call(null,cs);
var inst_19036 = cljs.core.seq.call(null,inst_19035);
var inst_19037 = inst_19036;
var inst_19038 = null;
var inst_19039 = (0);
var inst_19040 = (0);
var state_19156__$1 = (function (){var statearr_19217 = state_19156;
(statearr_19217[(13)] = inst_19039);

(statearr_19217[(14)] = inst_19038);

(statearr_19217[(15)] = inst_19037);

(statearr_19217[(16)] = inst_19040);

return statearr_19217;
})();
var statearr_19218_19283 = state_19156__$1;
(statearr_19218_19283[(2)] = null);

(statearr_19218_19283[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (14))){
var state_19156__$1 = state_19156;
var statearr_19219_19284 = state_19156__$1;
(statearr_19219_19284[(2)] = null);

(statearr_19219_19284[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (45))){
var inst_19146 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19220_19285 = state_19156__$1;
(statearr_19220_19285[(2)] = inst_19146);

(statearr_19220_19285[(1)] = (44));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (26))){
var inst_19088 = (state_19156[(29)]);
var inst_19142 = (state_19156[(2)]);
var inst_19143 = cljs.core.seq.call(null,inst_19088);
var state_19156__$1 = (function (){var statearr_19221 = state_19156;
(statearr_19221[(31)] = inst_19142);

return statearr_19221;
})();
if(inst_19143){
var statearr_19222_19286 = state_19156__$1;
(statearr_19222_19286[(1)] = (42));

} else {
var statearr_19223_19287 = state_19156__$1;
(statearr_19223_19287[(1)] = (43));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (16))){
var inst_19057 = (state_19156[(7)]);
var inst_19059 = cljs.core.chunked_seq_QMARK_.call(null,inst_19057);
var state_19156__$1 = state_19156;
if(inst_19059){
var statearr_19224_19288 = state_19156__$1;
(statearr_19224_19288[(1)] = (19));

} else {
var statearr_19225_19289 = state_19156__$1;
(statearr_19225_19289[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (38))){
var inst_19135 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19226_19290 = state_19156__$1;
(statearr_19226_19290[(2)] = inst_19135);

(statearr_19226_19290[(1)] = (35));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (30))){
var state_19156__$1 = state_19156;
var statearr_19227_19291 = state_19156__$1;
(statearr_19227_19291[(2)] = null);

(statearr_19227_19291[(1)] = (32));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (10))){
var inst_19038 = (state_19156[(14)]);
var inst_19040 = (state_19156[(16)]);
var inst_19046 = cljs.core._nth.call(null,inst_19038,inst_19040);
var inst_19047 = cljs.core.nth.call(null,inst_19046,(0),null);
var inst_19048 = cljs.core.nth.call(null,inst_19046,(1),null);
var state_19156__$1 = (function (){var statearr_19228 = state_19156;
(statearr_19228[(26)] = inst_19047);

return statearr_19228;
})();
if(cljs.core.truth_(inst_19048)){
var statearr_19229_19292 = state_19156__$1;
(statearr_19229_19292[(1)] = (13));

} else {
var statearr_19230_19293 = state_19156__$1;
(statearr_19230_19293[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (18))){
var inst_19081 = (state_19156[(2)]);
var state_19156__$1 = state_19156;
var statearr_19231_19294 = state_19156__$1;
(statearr_19231_19294[(2)] = inst_19081);

(statearr_19231_19294[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (42))){
var state_19156__$1 = state_19156;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_19156__$1,(45),dchan);
} else {
if((state_val_19157 === (37))){
var inst_19028 = (state_19156[(10)]);
var inst_19124 = (state_19156[(23)]);
var inst_19115 = (state_19156[(25)]);
var inst_19124__$1 = cljs.core.first.call(null,inst_19115);
var inst_19125 = cljs.core.async.put_BANG_.call(null,inst_19124__$1,inst_19028,done);
var state_19156__$1 = (function (){var statearr_19232 = state_19156;
(statearr_19232[(23)] = inst_19124__$1);

return statearr_19232;
})();
if(cljs.core.truth_(inst_19125)){
var statearr_19233_19295 = state_19156__$1;
(statearr_19233_19295[(1)] = (39));

} else {
var statearr_19234_19296 = state_19156__$1;
(statearr_19234_19296[(1)] = (40));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19157 === (8))){
var inst_19039 = (state_19156[(13)]);
var inst_19040 = (state_19156[(16)]);
var inst_19042 = (inst_19040 < inst_19039);
var inst_19043 = inst_19042;
var state_19156__$1 = state_19156;
if(cljs.core.truth_(inst_19043)){
var statearr_19235_19297 = state_19156__$1;
(statearr_19235_19297[(1)] = (10));

} else {
var statearr_19236_19298 = state_19156__$1;
(statearr_19236_19298[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___19244,cs,m,dchan,dctr,done))
;
return ((function (switch__17825__auto__,c__17937__auto___19244,cs,m,dchan,dctr,done){
return (function() {
var cljs$core$async$mult_$_state_machine__17826__auto__ = null;
var cljs$core$async$mult_$_state_machine__17826__auto____0 = (function (){
var statearr_19240 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_19240[(0)] = cljs$core$async$mult_$_state_machine__17826__auto__);

(statearr_19240[(1)] = (1));

return statearr_19240;
});
var cljs$core$async$mult_$_state_machine__17826__auto____1 = (function (state_19156){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_19156);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e19241){if((e19241 instanceof Object)){
var ex__17829__auto__ = e19241;
var statearr_19242_19299 = state_19156;
(statearr_19242_19299[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19156);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e19241;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__19300 = state_19156;
state_19156 = G__19300;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$mult_$_state_machine__17826__auto__ = function(state_19156){
switch(arguments.length){
case 0:
return cljs$core$async$mult_$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$mult_$_state_machine__17826__auto____1.call(this,state_19156);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mult_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mult_$_state_machine__17826__auto____0;
cljs$core$async$mult_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mult_$_state_machine__17826__auto____1;
return cljs$core$async$mult_$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___19244,cs,m,dchan,dctr,done))
})();
var state__17939__auto__ = (function (){var statearr_19243 = f__17938__auto__.call(null);
(statearr_19243[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___19244);

return statearr_19243;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___19244,cs,m,dchan,dctr,done))
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
var args19301 = [];
var len__7291__auto___19304 = arguments.length;
var i__7292__auto___19305 = (0);
while(true){
if((i__7292__auto___19305 < len__7291__auto___19304)){
args19301.push((arguments[i__7292__auto___19305]));

var G__19306 = (i__7292__auto___19305 + (1));
i__7292__auto___19305 = G__19306;
continue;
} else {
}
break;
}

var G__19303 = args19301.length;
switch (G__19303) {
case 2:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19301.length)].join('')));

}
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$2 = (function (mult,ch){
return cljs.core.async.tap.call(null,mult,ch,true);
});

cljs.core.async.tap.cljs$core$IFn$_invoke$arity$3 = (function (mult,ch,close_QMARK_){
cljs.core.async.tap_STAR_.call(null,mult,ch,close_QMARK_);

return ch;
});

cljs.core.async.tap.cljs$lang$maxFixedArity = 3;
/**
 * Disconnects a target channel from a mult
 */
cljs.core.async.untap = (function cljs$core$async$untap(mult,ch){
return cljs.core.async.untap_STAR_.call(null,mult,ch);
});
/**
 * Disconnects all target channels from a mult
 */
cljs.core.async.untap_all = (function cljs$core$async$untap_all(mult){
return cljs.core.async.untap_all_STAR_.call(null,mult);
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
return m__6880__auto__.call(null,m,ch);
} else {
var m__6880__auto____$1 = (cljs.core.async.admix_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.admix*",m);
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
return m__6880__auto__.call(null,m,ch);
} else {
var m__6880__auto____$1 = (cljs.core.async.unmix_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.unmix*",m);
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
return m__6880__auto__.call(null,m);
} else {
var m__6880__auto____$1 = (cljs.core.async.unmix_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.unmix-all*",m);
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
return m__6880__auto__.call(null,m,state_map);
} else {
var m__6880__auto____$1 = (cljs.core.async.toggle_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,state_map);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.toggle*",m);
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
return m__6880__auto__.call(null,m,mode);
} else {
var m__6880__auto____$1 = (cljs.core.async.solo_mode_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,m,mode);
} else {
throw cljs.core.missing_protocol.call(null,"Mix.solo-mode*",m);
}
}
}
});

cljs.core.async.ioc_alts_BANG_ = (function cljs$core$async$ioc_alts_BANG_(var_args){
var args__7298__auto__ = [];
var len__7291__auto___19318 = arguments.length;
var i__7292__auto___19319 = (0);
while(true){
if((i__7292__auto___19319 < len__7291__auto___19318)){
args__7298__auto__.push((arguments[i__7292__auto___19319]));

var G__19320 = (i__7292__auto___19319 + (1));
i__7292__auto___19319 = G__19320;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((3) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((3)),(0),null)):null);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),argseq__7299__auto__);
});

cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic = (function (state,cont_block,ports,p__19312){
var map__19313 = p__19312;
var map__19313__$1 = ((((!((map__19313 == null)))?((((map__19313.cljs$lang$protocol_mask$partition0$ & (64))) || (map__19313.cljs$core$ISeq$))?true:false):false))?cljs.core.apply.call(null,cljs.core.hash_map,map__19313):map__19313);
var opts = map__19313__$1;
var statearr_19315_19321 = state;
(statearr_19315_19321[cljs.core.async.impl.ioc_helpers.STATE_IDX] = cont_block);


var temp__4657__auto__ = cljs.core.async.do_alts.call(null,((function (map__19313,map__19313__$1,opts){
return (function (val){
var statearr_19316_19322 = state;
(statearr_19316_19322[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = val);


return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state);
});})(map__19313,map__19313__$1,opts))
,ports,opts);
if(cljs.core.truth_(temp__4657__auto__)){
var cb = temp__4657__auto__;
var statearr_19317_19323 = state;
(statearr_19317_19323[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref.call(null,cb));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
return null;
}
});

cljs.core.async.ioc_alts_BANG_.cljs$lang$maxFixedArity = (3);

cljs.core.async.ioc_alts_BANG_.cljs$lang$applyTo = (function (seq19308){
var G__19309 = cljs.core.first.call(null,seq19308);
var seq19308__$1 = cljs.core.next.call(null,seq19308);
var G__19310 = cljs.core.first.call(null,seq19308__$1);
var seq19308__$2 = cljs.core.next.call(null,seq19308__$1);
var G__19311 = cljs.core.first.call(null,seq19308__$2);
var seq19308__$3 = cljs.core.next.call(null,seq19308__$2);
return cljs.core.async.ioc_alts_BANG_.cljs$core$IFn$_invoke$arity$variadic(G__19309,G__19310,G__19311,seq19308__$3);
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
var cs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var solo_modes = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"pause","pause",-2095325672),null,new cljs.core.Keyword(null,"mute","mute",1151223646),null], null), null);
var attrs = cljs.core.conj.call(null,solo_modes,new cljs.core.Keyword(null,"solo","solo",-316350075));
var solo_mode = cljs.core.atom.call(null,new cljs.core.Keyword(null,"mute","mute",1151223646));
var change = cljs.core.async.chan.call(null);
var changed = ((function (cs,solo_modes,attrs,solo_mode,change){
return (function (){
return cljs.core.async.put_BANG_.call(null,change,true);
});})(cs,solo_modes,attrs,solo_mode,change))
;
var pick = ((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (attr,chs){
return cljs.core.reduce_kv.call(null,((function (cs,solo_modes,attrs,solo_mode,change,changed){
return (function (ret,c,v){
if(cljs.core.truth_(attr.call(null,v))){
return cljs.core.conj.call(null,ret,c);
} else {
return ret;
}
});})(cs,solo_modes,attrs,solo_mode,change,changed))
,cljs.core.PersistentHashSet.EMPTY,chs);
});})(cs,solo_modes,attrs,solo_mode,change,changed))
;
var calc_state = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick){
return (function (){
var chs = cljs.core.deref.call(null,cs);
var mode = cljs.core.deref.call(null,solo_mode);
var solos = pick.call(null,new cljs.core.Keyword(null,"solo","solo",-316350075),chs);
var pauses = pick.call(null,new cljs.core.Keyword(null,"pause","pause",-2095325672),chs);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"solos","solos",1441458643),solos,new cljs.core.Keyword(null,"mutes","mutes",1068806309),pick.call(null,new cljs.core.Keyword(null,"mute","mute",1151223646),chs),new cljs.core.Keyword(null,"reads","reads",-1215067361),cljs.core.conj.call(null,(((cljs.core._EQ_.call(null,mode,new cljs.core.Keyword(null,"pause","pause",-2095325672))) && (!(cljs.core.empty_QMARK_.call(null,solos))))?cljs.core.vec.call(null,solos):cljs.core.vec.call(null,cljs.core.remove.call(null,pauses,cljs.core.keys.call(null,chs)))),change)], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick))
;
var m = (function (){
if(typeof cljs.core.async.t_cljs$core$async19487 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mix}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async19487 = (function (change,mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,meta19488){
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
this.meta19488 = meta19488;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_19489,meta19488__$1){
var self__ = this;
var _19489__$1 = this;
return (new cljs.core.async.t_cljs$core$async19487(self__.change,self__.mix,self__.solo_mode,self__.pick,self__.cs,self__.calc_state,self__.out,self__.changed,self__.solo_modes,self__.attrs,meta19488__$1));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_19489){
var self__ = this;
var _19489__$1 = this;
return self__.meta19488;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.out;
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$ = true;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$admix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.assoc,ch,cljs.core.PersistentArrayMap.EMPTY);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$unmix_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,ch){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.dissoc,ch);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$unmix_all_STAR_$arity$1 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_){
var self__ = this;
var ___$1 = this;
cljs.core.reset_BANG_.call(null,self__.cs,cljs.core.PersistentArrayMap.EMPTY);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$toggle_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,state_map){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.call(null,self__.cs,cljs.core.partial.call(null,cljs.core.merge_with,cljs.core.merge),state_map);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.prototype.cljs$core$async$Mix$solo_mode_STAR_$arity$2 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (_,mode){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.solo_modes.call(null,mode))){
} else {
throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str([cljs.core.str("mode must be one of: "),cljs.core.str(self__.solo_modes)].join('')),cljs.core.str("\n"),cljs.core.str("(solo-modes mode)")].join('')));
}

cljs.core.reset_BANG_.call(null,self__.solo_mode,mode);

return self__.changed.call(null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.getBasis = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (){
return new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"change","change",477485025,null),cljs.core.with_meta(new cljs.core.Symbol(null,"mix","mix",2121373763,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"out","out",729986010,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Creates and returns a mix of one or more input channels which will\n  be put on the supplied out channel. Input sources can be added to\n  the mix with 'admix', and removed with 'unmix'. A mix supports\n  soloing, muting and pausing multiple inputs atomically using\n  'toggle', and can solo using either muting or pausing as determined\n  by 'solo-mode'.\n\n  Each channel can have zero or more boolean modes set via 'toggle':\n\n  :solo - when true, only this (ond other soloed) channel(s) will appear\n          in the mix output channel. :mute and :pause states of soloed\n          channels are ignored. If solo-mode is :mute, non-soloed\n          channels are muted, if :pause, non-soloed channels are\n          paused.\n\n  :mute - muted channels will have their contents consumed but not included in the mix\n  :pause - paused channels will not have their contents consumed (and thus also not included in the mix)\n"], null)),new cljs.core.Symbol(null,"solo-mode","solo-mode",2031788074,null),new cljs.core.Symbol(null,"pick","pick",1300068175,null),new cljs.core.Symbol(null,"cs","cs",-117024463,null),new cljs.core.Symbol(null,"calc-state","calc-state",-349968968,null),new cljs.core.Symbol(null,"out","out",729986010,null),new cljs.core.Symbol(null,"changed","changed",-2083710852,null),new cljs.core.Symbol(null,"solo-modes","solo-modes",882180540,null),new cljs.core.Symbol(null,"attrs","attrs",-450137186,null),new cljs.core.Symbol(null,"meta19488","meta19488",1812344244,null)], null);
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.t_cljs$core$async19487.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async19487.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async19487";

cljs.core.async.t_cljs$core$async19487.cljs$lang$ctorPrWriter = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async19487");
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

cljs.core.async.__GT_t_cljs$core$async19487 = ((function (cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state){
return (function cljs$core$async$mix_$___GT_t_cljs$core$async19487(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta19488){
return (new cljs.core.async.t_cljs$core$async19487(change__$1,mix__$1,solo_mode__$1,pick__$1,cs__$1,calc_state__$1,out__$1,changed__$1,solo_modes__$1,attrs__$1,meta19488));
});})(cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state))
;

}

return (new cljs.core.async.t_cljs$core$async19487(change,cljs$core$async$mix,solo_mode,pick,cs,calc_state,out,changed,solo_modes,attrs,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__17937__auto___19650 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function (state_19587){
var state_val_19588 = (state_19587[(1)]);
if((state_val_19588 === (7))){
var inst_19505 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
var statearr_19589_19651 = state_19587__$1;
(statearr_19589_19651[(2)] = inst_19505);

(statearr_19589_19651[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (20))){
var inst_19517 = (state_19587[(7)]);
var state_19587__$1 = state_19587;
var statearr_19590_19652 = state_19587__$1;
(statearr_19590_19652[(2)] = inst_19517);

(statearr_19590_19652[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (27))){
var state_19587__$1 = state_19587;
var statearr_19591_19653 = state_19587__$1;
(statearr_19591_19653[(2)] = null);

(statearr_19591_19653[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (1))){
var inst_19493 = (state_19587[(8)]);
var inst_19493__$1 = calc_state.call(null);
var inst_19495 = (inst_19493__$1 == null);
var inst_19496 = cljs.core.not.call(null,inst_19495);
var state_19587__$1 = (function (){var statearr_19592 = state_19587;
(statearr_19592[(8)] = inst_19493__$1);

return statearr_19592;
})();
if(inst_19496){
var statearr_19593_19654 = state_19587__$1;
(statearr_19593_19654[(1)] = (2));

} else {
var statearr_19594_19655 = state_19587__$1;
(statearr_19594_19655[(1)] = (3));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (24))){
var inst_19561 = (state_19587[(9)]);
var inst_19540 = (state_19587[(10)]);
var inst_19547 = (state_19587[(11)]);
var inst_19561__$1 = inst_19540.call(null,inst_19547);
var state_19587__$1 = (function (){var statearr_19595 = state_19587;
(statearr_19595[(9)] = inst_19561__$1);

return statearr_19595;
})();
if(cljs.core.truth_(inst_19561__$1)){
var statearr_19596_19656 = state_19587__$1;
(statearr_19596_19656[(1)] = (29));

} else {
var statearr_19597_19657 = state_19587__$1;
(statearr_19597_19657[(1)] = (30));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (4))){
var inst_19508 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19508)){
var statearr_19598_19658 = state_19587__$1;
(statearr_19598_19658[(1)] = (8));

} else {
var statearr_19599_19659 = state_19587__$1;
(statearr_19599_19659[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (15))){
var inst_19534 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19534)){
var statearr_19600_19660 = state_19587__$1;
(statearr_19600_19660[(1)] = (19));

} else {
var statearr_19601_19661 = state_19587__$1;
(statearr_19601_19661[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (21))){
var inst_19539 = (state_19587[(12)]);
var inst_19539__$1 = (state_19587[(2)]);
var inst_19540 = cljs.core.get.call(null,inst_19539__$1,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_19541 = cljs.core.get.call(null,inst_19539__$1,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_19542 = cljs.core.get.call(null,inst_19539__$1,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var state_19587__$1 = (function (){var statearr_19602 = state_19587;
(statearr_19602[(12)] = inst_19539__$1);

(statearr_19602[(10)] = inst_19540);

(statearr_19602[(13)] = inst_19541);

return statearr_19602;
})();
return cljs.core.async.ioc_alts_BANG_.call(null,state_19587__$1,(22),inst_19542);
} else {
if((state_val_19588 === (31))){
var inst_19569 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19569)){
var statearr_19603_19662 = state_19587__$1;
(statearr_19603_19662[(1)] = (32));

} else {
var statearr_19604_19663 = state_19587__$1;
(statearr_19604_19663[(1)] = (33));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (32))){
var inst_19546 = (state_19587[(14)]);
var state_19587__$1 = state_19587;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_19587__$1,(35),out,inst_19546);
} else {
if((state_val_19588 === (33))){
var inst_19539 = (state_19587[(12)]);
var inst_19517 = inst_19539;
var state_19587__$1 = (function (){var statearr_19605 = state_19587;
(statearr_19605[(7)] = inst_19517);

return statearr_19605;
})();
var statearr_19606_19664 = state_19587__$1;
(statearr_19606_19664[(2)] = null);

(statearr_19606_19664[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (13))){
var inst_19517 = (state_19587[(7)]);
var inst_19524 = inst_19517.cljs$lang$protocol_mask$partition0$;
var inst_19525 = (inst_19524 & (64));
var inst_19526 = inst_19517.cljs$core$ISeq$;
var inst_19527 = (inst_19525) || (inst_19526);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19527)){
var statearr_19607_19665 = state_19587__$1;
(statearr_19607_19665[(1)] = (16));

} else {
var statearr_19608_19666 = state_19587__$1;
(statearr_19608_19666[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (22))){
var inst_19547 = (state_19587[(11)]);
var inst_19546 = (state_19587[(14)]);
var inst_19545 = (state_19587[(2)]);
var inst_19546__$1 = cljs.core.nth.call(null,inst_19545,(0),null);
var inst_19547__$1 = cljs.core.nth.call(null,inst_19545,(1),null);
var inst_19548 = (inst_19546__$1 == null);
var inst_19549 = cljs.core._EQ_.call(null,inst_19547__$1,change);
var inst_19550 = (inst_19548) || (inst_19549);
var state_19587__$1 = (function (){var statearr_19609 = state_19587;
(statearr_19609[(11)] = inst_19547__$1);

(statearr_19609[(14)] = inst_19546__$1);

return statearr_19609;
})();
if(cljs.core.truth_(inst_19550)){
var statearr_19610_19667 = state_19587__$1;
(statearr_19610_19667[(1)] = (23));

} else {
var statearr_19611_19668 = state_19587__$1;
(statearr_19611_19668[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (36))){
var inst_19539 = (state_19587[(12)]);
var inst_19517 = inst_19539;
var state_19587__$1 = (function (){var statearr_19612 = state_19587;
(statearr_19612[(7)] = inst_19517);

return statearr_19612;
})();
var statearr_19613_19669 = state_19587__$1;
(statearr_19613_19669[(2)] = null);

(statearr_19613_19669[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (29))){
var inst_19561 = (state_19587[(9)]);
var state_19587__$1 = state_19587;
var statearr_19614_19670 = state_19587__$1;
(statearr_19614_19670[(2)] = inst_19561);

(statearr_19614_19670[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (6))){
var state_19587__$1 = state_19587;
var statearr_19615_19671 = state_19587__$1;
(statearr_19615_19671[(2)] = false);

(statearr_19615_19671[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (28))){
var inst_19557 = (state_19587[(2)]);
var inst_19558 = calc_state.call(null);
var inst_19517 = inst_19558;
var state_19587__$1 = (function (){var statearr_19616 = state_19587;
(statearr_19616[(15)] = inst_19557);

(statearr_19616[(7)] = inst_19517);

return statearr_19616;
})();
var statearr_19617_19672 = state_19587__$1;
(statearr_19617_19672[(2)] = null);

(statearr_19617_19672[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (25))){
var inst_19583 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
var statearr_19618_19673 = state_19587__$1;
(statearr_19618_19673[(2)] = inst_19583);

(statearr_19618_19673[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (34))){
var inst_19581 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
var statearr_19619_19674 = state_19587__$1;
(statearr_19619_19674[(2)] = inst_19581);

(statearr_19619_19674[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (17))){
var state_19587__$1 = state_19587;
var statearr_19620_19675 = state_19587__$1;
(statearr_19620_19675[(2)] = false);

(statearr_19620_19675[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (3))){
var state_19587__$1 = state_19587;
var statearr_19621_19676 = state_19587__$1;
(statearr_19621_19676[(2)] = false);

(statearr_19621_19676[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (12))){
var inst_19585 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_19587__$1,inst_19585);
} else {
if((state_val_19588 === (2))){
var inst_19493 = (state_19587[(8)]);
var inst_19498 = inst_19493.cljs$lang$protocol_mask$partition0$;
var inst_19499 = (inst_19498 & (64));
var inst_19500 = inst_19493.cljs$core$ISeq$;
var inst_19501 = (inst_19499) || (inst_19500);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19501)){
var statearr_19622_19677 = state_19587__$1;
(statearr_19622_19677[(1)] = (5));

} else {
var statearr_19623_19678 = state_19587__$1;
(statearr_19623_19678[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (23))){
var inst_19546 = (state_19587[(14)]);
var inst_19552 = (inst_19546 == null);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19552)){
var statearr_19624_19679 = state_19587__$1;
(statearr_19624_19679[(1)] = (26));

} else {
var statearr_19625_19680 = state_19587__$1;
(statearr_19625_19680[(1)] = (27));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (35))){
var inst_19572 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
if(cljs.core.truth_(inst_19572)){
var statearr_19626_19681 = state_19587__$1;
(statearr_19626_19681[(1)] = (36));

} else {
var statearr_19627_19682 = state_19587__$1;
(statearr_19627_19682[(1)] = (37));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (19))){
var inst_19517 = (state_19587[(7)]);
var inst_19536 = cljs.core.apply.call(null,cljs.core.hash_map,inst_19517);
var state_19587__$1 = state_19587;
var statearr_19628_19683 = state_19587__$1;
(statearr_19628_19683[(2)] = inst_19536);

(statearr_19628_19683[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (11))){
var inst_19517 = (state_19587[(7)]);
var inst_19521 = (inst_19517 == null);
var inst_19522 = cljs.core.not.call(null,inst_19521);
var state_19587__$1 = state_19587;
if(inst_19522){
var statearr_19629_19684 = state_19587__$1;
(statearr_19629_19684[(1)] = (13));

} else {
var statearr_19630_19685 = state_19587__$1;
(statearr_19630_19685[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (9))){
var inst_19493 = (state_19587[(8)]);
var state_19587__$1 = state_19587;
var statearr_19631_19686 = state_19587__$1;
(statearr_19631_19686[(2)] = inst_19493);

(statearr_19631_19686[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (5))){
var state_19587__$1 = state_19587;
var statearr_19632_19687 = state_19587__$1;
(statearr_19632_19687[(2)] = true);

(statearr_19632_19687[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (14))){
var state_19587__$1 = state_19587;
var statearr_19633_19688 = state_19587__$1;
(statearr_19633_19688[(2)] = false);

(statearr_19633_19688[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (26))){
var inst_19547 = (state_19587[(11)]);
var inst_19554 = cljs.core.swap_BANG_.call(null,cs,cljs.core.dissoc,inst_19547);
var state_19587__$1 = state_19587;
var statearr_19634_19689 = state_19587__$1;
(statearr_19634_19689[(2)] = inst_19554);

(statearr_19634_19689[(1)] = (28));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (16))){
var state_19587__$1 = state_19587;
var statearr_19635_19690 = state_19587__$1;
(statearr_19635_19690[(2)] = true);

(statearr_19635_19690[(1)] = (18));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (38))){
var inst_19577 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
var statearr_19636_19691 = state_19587__$1;
(statearr_19636_19691[(2)] = inst_19577);

(statearr_19636_19691[(1)] = (34));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (30))){
var inst_19540 = (state_19587[(10)]);
var inst_19541 = (state_19587[(13)]);
var inst_19547 = (state_19587[(11)]);
var inst_19564 = cljs.core.empty_QMARK_.call(null,inst_19540);
var inst_19565 = inst_19541.call(null,inst_19547);
var inst_19566 = cljs.core.not.call(null,inst_19565);
var inst_19567 = (inst_19564) && (inst_19566);
var state_19587__$1 = state_19587;
var statearr_19637_19692 = state_19587__$1;
(statearr_19637_19692[(2)] = inst_19567);

(statearr_19637_19692[(1)] = (31));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (10))){
var inst_19493 = (state_19587[(8)]);
var inst_19513 = (state_19587[(2)]);
var inst_19514 = cljs.core.get.call(null,inst_19513,new cljs.core.Keyword(null,"solos","solos",1441458643));
var inst_19515 = cljs.core.get.call(null,inst_19513,new cljs.core.Keyword(null,"mutes","mutes",1068806309));
var inst_19516 = cljs.core.get.call(null,inst_19513,new cljs.core.Keyword(null,"reads","reads",-1215067361));
var inst_19517 = inst_19493;
var state_19587__$1 = (function (){var statearr_19638 = state_19587;
(statearr_19638[(16)] = inst_19516);

(statearr_19638[(17)] = inst_19515);

(statearr_19638[(18)] = inst_19514);

(statearr_19638[(7)] = inst_19517);

return statearr_19638;
})();
var statearr_19639_19693 = state_19587__$1;
(statearr_19639_19693[(2)] = null);

(statearr_19639_19693[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (18))){
var inst_19531 = (state_19587[(2)]);
var state_19587__$1 = state_19587;
var statearr_19640_19694 = state_19587__$1;
(statearr_19640_19694[(2)] = inst_19531);

(statearr_19640_19694[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (37))){
var state_19587__$1 = state_19587;
var statearr_19641_19695 = state_19587__$1;
(statearr_19641_19695[(2)] = null);

(statearr_19641_19695[(1)] = (38));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19588 === (8))){
var inst_19493 = (state_19587[(8)]);
var inst_19510 = cljs.core.apply.call(null,cljs.core.hash_map,inst_19493);
var state_19587__$1 = state_19587;
var statearr_19642_19696 = state_19587__$1;
(statearr_19642_19696[(2)] = inst_19510);

(statearr_19642_19696[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
;
return ((function (switch__17825__auto__,c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m){
return (function() {
var cljs$core$async$mix_$_state_machine__17826__auto__ = null;
var cljs$core$async$mix_$_state_machine__17826__auto____0 = (function (){
var statearr_19646 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_19646[(0)] = cljs$core$async$mix_$_state_machine__17826__auto__);

(statearr_19646[(1)] = (1));

return statearr_19646;
});
var cljs$core$async$mix_$_state_machine__17826__auto____1 = (function (state_19587){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_19587);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e19647){if((e19647 instanceof Object)){
var ex__17829__auto__ = e19647;
var statearr_19648_19697 = state_19587;
(statearr_19648_19697[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19587);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e19647;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__19698 = state_19587;
state_19587 = G__19698;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$mix_$_state_machine__17826__auto__ = function(state_19587){
switch(arguments.length){
case 0:
return cljs$core$async$mix_$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$mix_$_state_machine__17826__auto____1.call(this,state_19587);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mix_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mix_$_state_machine__17826__auto____0;
cljs$core$async$mix_$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mix_$_state_machine__17826__auto____1;
return cljs$core$async$mix_$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
})();
var state__17939__auto__ = (function (){var statearr_19649 = f__17938__auto__.call(null);
(statearr_19649[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___19650);

return statearr_19649;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___19650,cs,solo_modes,attrs,solo_mode,change,changed,pick,calc_state,m))
);


return m;
});
/**
 * Adds ch as an input to the mix
 */
cljs.core.async.admix = (function cljs$core$async$admix(mix,ch){
return cljs.core.async.admix_STAR_.call(null,mix,ch);
});
/**
 * Removes ch as an input to the mix
 */
cljs.core.async.unmix = (function cljs$core$async$unmix(mix,ch){
return cljs.core.async.unmix_STAR_.call(null,mix,ch);
});
/**
 * removes all inputs from the mix
 */
cljs.core.async.unmix_all = (function cljs$core$async$unmix_all(mix){
return cljs.core.async.unmix_all_STAR_.call(null,mix);
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
return cljs.core.async.toggle_STAR_.call(null,mix,state_map);
});
/**
 * Sets the solo mode of the mix. mode must be one of :mute or :pause
 */
cljs.core.async.solo_mode = (function cljs$core$async$solo_mode(mix,mode){
return cljs.core.async.solo_mode_STAR_.call(null,mix,mode);
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
return m__6880__auto__.call(null,p,v,ch,close_QMARK_);
} else {
var m__6880__auto____$1 = (cljs.core.async.sub_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,p,v,ch,close_QMARK_);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.sub*",p);
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
return m__6880__auto__.call(null,p,v,ch);
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,p,v,ch);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub*",p);
}
}
}
});

cljs.core.async.unsub_all_STAR_ = (function cljs$core$async$unsub_all_STAR_(var_args){
var args19699 = [];
var len__7291__auto___19702 = arguments.length;
var i__7292__auto___19703 = (0);
while(true){
if((i__7292__auto___19703 < len__7291__auto___19702)){
args19699.push((arguments[i__7292__auto___19703]));

var G__19704 = (i__7292__auto___19703 + (1));
i__7292__auto___19703 = G__19704;
continue;
} else {
}
break;
}

var G__19701 = args19699.length;
switch (G__19701) {
case 1:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19699.length)].join('')));

}
});

cljs.core.async.unsub_all_STAR_.cljs$core$IFn$_invoke$arity$1 = (function (p){
if((!((p == null))) && (!((p.cljs$core$async$Pub$unsub_all_STAR_$arity$1 == null)))){
return p.cljs$core$async$Pub$unsub_all_STAR_$arity$1(p);
} else {
var x__6879__auto__ = (((p == null))?null:p);
var m__6880__auto__ = (cljs.core.async.unsub_all_STAR_[goog.typeOf(x__6879__auto__)]);
if(!((m__6880__auto__ == null))){
return m__6880__auto__.call(null,p);
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,p);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub-all*",p);
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
return m__6880__auto__.call(null,p,v);
} else {
var m__6880__auto____$1 = (cljs.core.async.unsub_all_STAR_["_"]);
if(!((m__6880__auto____$1 == null))){
return m__6880__auto____$1.call(null,p,v);
} else {
throw cljs.core.missing_protocol.call(null,"Pub.unsub-all*",p);
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
var args19707 = [];
var len__7291__auto___19832 = arguments.length;
var i__7292__auto___19833 = (0);
while(true){
if((i__7292__auto___19833 < len__7291__auto___19832)){
args19707.push((arguments[i__7292__auto___19833]));

var G__19834 = (i__7292__auto___19833 + (1));
i__7292__auto___19833 = G__19834;
continue;
} else {
}
break;
}

var G__19709 = args19707.length;
switch (G__19709) {
case 2:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19707.length)].join('')));

}
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$2 = (function (ch,topic_fn){
return cljs.core.async.pub.call(null,ch,topic_fn,cljs.core.constantly.call(null,null));
});

cljs.core.async.pub.cljs$core$IFn$_invoke$arity$3 = (function (ch,topic_fn,buf_fn){
var mults = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
var ensure_mult = ((function (mults){
return (function (topic){
var or__6216__auto__ = cljs.core.get.call(null,cljs.core.deref.call(null,mults),topic);
if(cljs.core.truth_(or__6216__auto__)){
return or__6216__auto__;
} else {
return cljs.core.get.call(null,cljs.core.swap_BANG_.call(null,mults,((function (or__6216__auto__,mults){
return (function (p1__19706_SHARP_){
if(cljs.core.truth_(p1__19706_SHARP_.call(null,topic))){
return p1__19706_SHARP_;
} else {
return cljs.core.assoc.call(null,p1__19706_SHARP_,topic,cljs.core.async.mult.call(null,cljs.core.async.chan.call(null,buf_fn.call(null,topic))));
}
});})(or__6216__auto__,mults))
),topic);
}
});})(mults))
;
var p = (function (){
if(typeof cljs.core.async.t_cljs$core$async19710 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.Pub}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.async.Mux}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async19710 = (function (ch,topic_fn,buf_fn,mults,ensure_mult,meta19711){
this.ch = ch;
this.topic_fn = topic_fn;
this.buf_fn = buf_fn;
this.mults = mults;
this.ensure_mult = ensure_mult;
this.meta19711 = meta19711;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (mults,ensure_mult){
return (function (_19712,meta19711__$1){
var self__ = this;
var _19712__$1 = this;
return (new cljs.core.async.t_cljs$core$async19710(self__.ch,self__.topic_fn,self__.buf_fn,self__.mults,self__.ensure_mult,meta19711__$1));
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (mults,ensure_mult){
return (function (_19712){
var self__ = this;
var _19712__$1 = this;
return self__.meta19711;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Mux$ = true;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Mux$muxch_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
return self__.ch;
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Pub$ = true;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Pub$sub_STAR_$arity$4 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1,close_QMARK_){
var self__ = this;
var p__$1 = this;
var m = self__.ensure_mult.call(null,topic);
return cljs.core.async.tap.call(null,m,ch__$1,close_QMARK_);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Pub$unsub_STAR_$arity$3 = ((function (mults,ensure_mult){
return (function (p,topic,ch__$1){
var self__ = this;
var p__$1 = this;
var temp__4657__auto__ = cljs.core.get.call(null,cljs.core.deref.call(null,self__.mults),topic);
if(cljs.core.truth_(temp__4657__auto__)){
var m = temp__4657__auto__;
return cljs.core.async.untap.call(null,m,ch__$1);
} else {
return null;
}
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$1 = ((function (mults,ensure_mult){
return (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reset_BANG_.call(null,self__.mults,cljs.core.PersistentArrayMap.EMPTY);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.prototype.cljs$core$async$Pub$unsub_all_STAR_$arity$2 = ((function (mults,ensure_mult){
return (function (_,topic){
var self__ = this;
var ___$1 = this;
return cljs.core.swap_BANG_.call(null,self__.mults,cljs.core.dissoc,topic);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.getBasis = ((function (mults,ensure_mult){
return (function (){
return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"topic-fn","topic-fn",-862449736,null),new cljs.core.Symbol(null,"buf-fn","buf-fn",-1200281591,null),new cljs.core.Symbol(null,"mults","mults",-461114485,null),new cljs.core.Symbol(null,"ensure-mult","ensure-mult",1796584816,null),new cljs.core.Symbol(null,"meta19711","meta19711",-579772220,null)], null);
});})(mults,ensure_mult))
;

cljs.core.async.t_cljs$core$async19710.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async19710.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async19710";

cljs.core.async.t_cljs$core$async19710.cljs$lang$ctorPrWriter = ((function (mults,ensure_mult){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async19710");
});})(mults,ensure_mult))
;

cljs.core.async.__GT_t_cljs$core$async19710 = ((function (mults,ensure_mult){
return (function cljs$core$async$__GT_t_cljs$core$async19710(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta19711){
return (new cljs.core.async.t_cljs$core$async19710(ch__$1,topic_fn__$1,buf_fn__$1,mults__$1,ensure_mult__$1,meta19711));
});})(mults,ensure_mult))
;

}

return (new cljs.core.async.t_cljs$core$async19710(ch,topic_fn,buf_fn,mults,ensure_mult,cljs.core.PersistentArrayMap.EMPTY));
})()
;
var c__17937__auto___19836 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___19836,mults,ensure_mult,p){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___19836,mults,ensure_mult,p){
return (function (state_19784){
var state_val_19785 = (state_19784[(1)]);
if((state_val_19785 === (7))){
var inst_19780 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19786_19837 = state_19784__$1;
(statearr_19786_19837[(2)] = inst_19780);

(statearr_19786_19837[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (20))){
var state_19784__$1 = state_19784;
var statearr_19787_19838 = state_19784__$1;
(statearr_19787_19838[(2)] = null);

(statearr_19787_19838[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (1))){
var state_19784__$1 = state_19784;
var statearr_19788_19839 = state_19784__$1;
(statearr_19788_19839[(2)] = null);

(statearr_19788_19839[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (24))){
var inst_19763 = (state_19784[(7)]);
var inst_19772 = cljs.core.swap_BANG_.call(null,mults,cljs.core.dissoc,inst_19763);
var state_19784__$1 = state_19784;
var statearr_19789_19840 = state_19784__$1;
(statearr_19789_19840[(2)] = inst_19772);

(statearr_19789_19840[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (4))){
var inst_19715 = (state_19784[(8)]);
var inst_19715__$1 = (state_19784[(2)]);
var inst_19716 = (inst_19715__$1 == null);
var state_19784__$1 = (function (){var statearr_19790 = state_19784;
(statearr_19790[(8)] = inst_19715__$1);

return statearr_19790;
})();
if(cljs.core.truth_(inst_19716)){
var statearr_19791_19841 = state_19784__$1;
(statearr_19791_19841[(1)] = (5));

} else {
var statearr_19792_19842 = state_19784__$1;
(statearr_19792_19842[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (15))){
var inst_19757 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19793_19843 = state_19784__$1;
(statearr_19793_19843[(2)] = inst_19757);

(statearr_19793_19843[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (21))){
var inst_19777 = (state_19784[(2)]);
var state_19784__$1 = (function (){var statearr_19794 = state_19784;
(statearr_19794[(9)] = inst_19777);

return statearr_19794;
})();
var statearr_19795_19844 = state_19784__$1;
(statearr_19795_19844[(2)] = null);

(statearr_19795_19844[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (13))){
var inst_19739 = (state_19784[(10)]);
var inst_19741 = cljs.core.chunked_seq_QMARK_.call(null,inst_19739);
var state_19784__$1 = state_19784;
if(inst_19741){
var statearr_19796_19845 = state_19784__$1;
(statearr_19796_19845[(1)] = (16));

} else {
var statearr_19797_19846 = state_19784__$1;
(statearr_19797_19846[(1)] = (17));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (22))){
var inst_19769 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
if(cljs.core.truth_(inst_19769)){
var statearr_19798_19847 = state_19784__$1;
(statearr_19798_19847[(1)] = (23));

} else {
var statearr_19799_19848 = state_19784__$1;
(statearr_19799_19848[(1)] = (24));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (6))){
var inst_19715 = (state_19784[(8)]);
var inst_19765 = (state_19784[(11)]);
var inst_19763 = (state_19784[(7)]);
var inst_19763__$1 = topic_fn.call(null,inst_19715);
var inst_19764 = cljs.core.deref.call(null,mults);
var inst_19765__$1 = cljs.core.get.call(null,inst_19764,inst_19763__$1);
var state_19784__$1 = (function (){var statearr_19800 = state_19784;
(statearr_19800[(11)] = inst_19765__$1);

(statearr_19800[(7)] = inst_19763__$1);

return statearr_19800;
})();
if(cljs.core.truth_(inst_19765__$1)){
var statearr_19801_19849 = state_19784__$1;
(statearr_19801_19849[(1)] = (19));

} else {
var statearr_19802_19850 = state_19784__$1;
(statearr_19802_19850[(1)] = (20));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (25))){
var inst_19774 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19803_19851 = state_19784__$1;
(statearr_19803_19851[(2)] = inst_19774);

(statearr_19803_19851[(1)] = (21));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (17))){
var inst_19739 = (state_19784[(10)]);
var inst_19748 = cljs.core.first.call(null,inst_19739);
var inst_19749 = cljs.core.async.muxch_STAR_.call(null,inst_19748);
var inst_19750 = cljs.core.async.close_BANG_.call(null,inst_19749);
var inst_19751 = cljs.core.next.call(null,inst_19739);
var inst_19725 = inst_19751;
var inst_19726 = null;
var inst_19727 = (0);
var inst_19728 = (0);
var state_19784__$1 = (function (){var statearr_19804 = state_19784;
(statearr_19804[(12)] = inst_19727);

(statearr_19804[(13)] = inst_19728);

(statearr_19804[(14)] = inst_19726);

(statearr_19804[(15)] = inst_19750);

(statearr_19804[(16)] = inst_19725);

return statearr_19804;
})();
var statearr_19805_19852 = state_19784__$1;
(statearr_19805_19852[(2)] = null);

(statearr_19805_19852[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (3))){
var inst_19782 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_19784__$1,inst_19782);
} else {
if((state_val_19785 === (12))){
var inst_19759 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19806_19853 = state_19784__$1;
(statearr_19806_19853[(2)] = inst_19759);

(statearr_19806_19853[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (2))){
var state_19784__$1 = state_19784;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_19784__$1,(4),ch);
} else {
if((state_val_19785 === (23))){
var state_19784__$1 = state_19784;
var statearr_19807_19854 = state_19784__$1;
(statearr_19807_19854[(2)] = null);

(statearr_19807_19854[(1)] = (25));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (19))){
var inst_19715 = (state_19784[(8)]);
var inst_19765 = (state_19784[(11)]);
var inst_19767 = cljs.core.async.muxch_STAR_.call(null,inst_19765);
var state_19784__$1 = state_19784;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_19784__$1,(22),inst_19767,inst_19715);
} else {
if((state_val_19785 === (11))){
var inst_19739 = (state_19784[(10)]);
var inst_19725 = (state_19784[(16)]);
var inst_19739__$1 = cljs.core.seq.call(null,inst_19725);
var state_19784__$1 = (function (){var statearr_19808 = state_19784;
(statearr_19808[(10)] = inst_19739__$1);

return statearr_19808;
})();
if(inst_19739__$1){
var statearr_19809_19855 = state_19784__$1;
(statearr_19809_19855[(1)] = (13));

} else {
var statearr_19810_19856 = state_19784__$1;
(statearr_19810_19856[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (9))){
var inst_19761 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19811_19857 = state_19784__$1;
(statearr_19811_19857[(2)] = inst_19761);

(statearr_19811_19857[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (5))){
var inst_19722 = cljs.core.deref.call(null,mults);
var inst_19723 = cljs.core.vals.call(null,inst_19722);
var inst_19724 = cljs.core.seq.call(null,inst_19723);
var inst_19725 = inst_19724;
var inst_19726 = null;
var inst_19727 = (0);
var inst_19728 = (0);
var state_19784__$1 = (function (){var statearr_19812 = state_19784;
(statearr_19812[(12)] = inst_19727);

(statearr_19812[(13)] = inst_19728);

(statearr_19812[(14)] = inst_19726);

(statearr_19812[(16)] = inst_19725);

return statearr_19812;
})();
var statearr_19813_19858 = state_19784__$1;
(statearr_19813_19858[(2)] = null);

(statearr_19813_19858[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (14))){
var state_19784__$1 = state_19784;
var statearr_19817_19859 = state_19784__$1;
(statearr_19817_19859[(2)] = null);

(statearr_19817_19859[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (16))){
var inst_19739 = (state_19784[(10)]);
var inst_19743 = cljs.core.chunk_first.call(null,inst_19739);
var inst_19744 = cljs.core.chunk_rest.call(null,inst_19739);
var inst_19745 = cljs.core.count.call(null,inst_19743);
var inst_19725 = inst_19744;
var inst_19726 = inst_19743;
var inst_19727 = inst_19745;
var inst_19728 = (0);
var state_19784__$1 = (function (){var statearr_19818 = state_19784;
(statearr_19818[(12)] = inst_19727);

(statearr_19818[(13)] = inst_19728);

(statearr_19818[(14)] = inst_19726);

(statearr_19818[(16)] = inst_19725);

return statearr_19818;
})();
var statearr_19819_19860 = state_19784__$1;
(statearr_19819_19860[(2)] = null);

(statearr_19819_19860[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (10))){
var inst_19727 = (state_19784[(12)]);
var inst_19728 = (state_19784[(13)]);
var inst_19726 = (state_19784[(14)]);
var inst_19725 = (state_19784[(16)]);
var inst_19733 = cljs.core._nth.call(null,inst_19726,inst_19728);
var inst_19734 = cljs.core.async.muxch_STAR_.call(null,inst_19733);
var inst_19735 = cljs.core.async.close_BANG_.call(null,inst_19734);
var inst_19736 = (inst_19728 + (1));
var tmp19814 = inst_19727;
var tmp19815 = inst_19726;
var tmp19816 = inst_19725;
var inst_19725__$1 = tmp19816;
var inst_19726__$1 = tmp19815;
var inst_19727__$1 = tmp19814;
var inst_19728__$1 = inst_19736;
var state_19784__$1 = (function (){var statearr_19820 = state_19784;
(statearr_19820[(12)] = inst_19727__$1);

(statearr_19820[(13)] = inst_19728__$1);

(statearr_19820[(14)] = inst_19726__$1);

(statearr_19820[(17)] = inst_19735);

(statearr_19820[(16)] = inst_19725__$1);

return statearr_19820;
})();
var statearr_19821_19861 = state_19784__$1;
(statearr_19821_19861[(2)] = null);

(statearr_19821_19861[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (18))){
var inst_19754 = (state_19784[(2)]);
var state_19784__$1 = state_19784;
var statearr_19822_19862 = state_19784__$1;
(statearr_19822_19862[(2)] = inst_19754);

(statearr_19822_19862[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19785 === (8))){
var inst_19727 = (state_19784[(12)]);
var inst_19728 = (state_19784[(13)]);
var inst_19730 = (inst_19728 < inst_19727);
var inst_19731 = inst_19730;
var state_19784__$1 = state_19784;
if(cljs.core.truth_(inst_19731)){
var statearr_19823_19863 = state_19784__$1;
(statearr_19823_19863[(1)] = (10));

} else {
var statearr_19824_19864 = state_19784__$1;
(statearr_19824_19864[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___19836,mults,ensure_mult,p))
;
return ((function (switch__17825__auto__,c__17937__auto___19836,mults,ensure_mult,p){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_19828 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_19828[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_19828[(1)] = (1));

return statearr_19828;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_19784){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_19784);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e19829){if((e19829 instanceof Object)){
var ex__17829__auto__ = e19829;
var statearr_19830_19865 = state_19784;
(statearr_19830_19865[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19784);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e19829;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__19866 = state_19784;
state_19784 = G__19866;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_19784){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_19784);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___19836,mults,ensure_mult,p))
})();
var state__17939__auto__ = (function (){var statearr_19831 = f__17938__auto__.call(null);
(statearr_19831[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___19836);

return statearr_19831;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___19836,mults,ensure_mult,p))
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
var args19867 = [];
var len__7291__auto___19870 = arguments.length;
var i__7292__auto___19871 = (0);
while(true){
if((i__7292__auto___19871 < len__7291__auto___19870)){
args19867.push((arguments[i__7292__auto___19871]));

var G__19872 = (i__7292__auto___19871 + (1));
i__7292__auto___19871 = G__19872;
continue;
} else {
}
break;
}

var G__19869 = args19867.length;
switch (G__19869) {
case 3:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19867.length)].join('')));

}
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$3 = (function (p,topic,ch){
return cljs.core.async.sub.call(null,p,topic,ch,true);
});

cljs.core.async.sub.cljs$core$IFn$_invoke$arity$4 = (function (p,topic,ch,close_QMARK_){
return cljs.core.async.sub_STAR_.call(null,p,topic,ch,close_QMARK_);
});

cljs.core.async.sub.cljs$lang$maxFixedArity = 4;
/**
 * Unsubscribes a channel from a topic of a pub
 */
cljs.core.async.unsub = (function cljs$core$async$unsub(p,topic,ch){
return cljs.core.async.unsub_STAR_.call(null,p,topic,ch);
});
/**
 * Unsubscribes all channels from a pub, or a topic of a pub
 */
cljs.core.async.unsub_all = (function cljs$core$async$unsub_all(var_args){
var args19874 = [];
var len__7291__auto___19877 = arguments.length;
var i__7292__auto___19878 = (0);
while(true){
if((i__7292__auto___19878 < len__7291__auto___19877)){
args19874.push((arguments[i__7292__auto___19878]));

var G__19879 = (i__7292__auto___19878 + (1));
i__7292__auto___19878 = G__19879;
continue;
} else {
}
break;
}

var G__19876 = args19874.length;
switch (G__19876) {
case 1:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19874.length)].join('')));

}
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$1 = (function (p){
return cljs.core.async.unsub_all_STAR_.call(null,p);
});

cljs.core.async.unsub_all.cljs$core$IFn$_invoke$arity$2 = (function (p,topic){
return cljs.core.async.unsub_all_STAR_.call(null,p,topic);
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
var args19881 = [];
var len__7291__auto___19952 = arguments.length;
var i__7292__auto___19953 = (0);
while(true){
if((i__7292__auto___19953 < len__7291__auto___19952)){
args19881.push((arguments[i__7292__auto___19953]));

var G__19954 = (i__7292__auto___19953 + (1));
i__7292__auto___19953 = G__19954;
continue;
} else {
}
break;
}

var G__19883 = args19881.length;
switch (G__19883) {
case 2:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.map.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19881.length)].join('')));

}
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$2 = (function (f,chs){
return cljs.core.async.map.call(null,f,chs,null);
});

cljs.core.async.map.cljs$core$IFn$_invoke$arity$3 = (function (f,chs,buf_or_n){
var chs__$1 = cljs.core.vec.call(null,chs);
var out = cljs.core.async.chan.call(null,buf_or_n);
var cnt = cljs.core.count.call(null,chs__$1);
var rets = cljs.core.object_array.call(null,cnt);
var dchan = cljs.core.async.chan.call(null,(1));
var dctr = cljs.core.atom.call(null,null);
var done = cljs.core.mapv.call(null,((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (i){
return ((function (chs__$1,out,cnt,rets,dchan,dctr){
return (function (ret){
(rets[i] = ret);

if((cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec) === (0))){
return cljs.core.async.put_BANG_.call(null,dchan,rets.slice((0)));
} else {
return null;
}
});
;})(chs__$1,out,cnt,rets,dchan,dctr))
});})(chs__$1,out,cnt,rets,dchan,dctr))
,cljs.core.range.call(null,cnt));
var c__17937__auto___19956 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function (state_19922){
var state_val_19923 = (state_19922[(1)]);
if((state_val_19923 === (7))){
var state_19922__$1 = state_19922;
var statearr_19924_19957 = state_19922__$1;
(statearr_19924_19957[(2)] = null);

(statearr_19924_19957[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (1))){
var state_19922__$1 = state_19922;
var statearr_19925_19958 = state_19922__$1;
(statearr_19925_19958[(2)] = null);

(statearr_19925_19958[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (4))){
var inst_19886 = (state_19922[(7)]);
var inst_19888 = (inst_19886 < cnt);
var state_19922__$1 = state_19922;
if(cljs.core.truth_(inst_19888)){
var statearr_19926_19959 = state_19922__$1;
(statearr_19926_19959[(1)] = (6));

} else {
var statearr_19927_19960 = state_19922__$1;
(statearr_19927_19960[(1)] = (7));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (15))){
var inst_19918 = (state_19922[(2)]);
var state_19922__$1 = state_19922;
var statearr_19928_19961 = state_19922__$1;
(statearr_19928_19961[(2)] = inst_19918);

(statearr_19928_19961[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (13))){
var inst_19911 = cljs.core.async.close_BANG_.call(null,out);
var state_19922__$1 = state_19922;
var statearr_19929_19962 = state_19922__$1;
(statearr_19929_19962[(2)] = inst_19911);

(statearr_19929_19962[(1)] = (15));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (6))){
var state_19922__$1 = state_19922;
var statearr_19930_19963 = state_19922__$1;
(statearr_19930_19963[(2)] = null);

(statearr_19930_19963[(1)] = (11));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (3))){
var inst_19920 = (state_19922[(2)]);
var state_19922__$1 = state_19922;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_19922__$1,inst_19920);
} else {
if((state_val_19923 === (12))){
var inst_19908 = (state_19922[(8)]);
var inst_19908__$1 = (state_19922[(2)]);
var inst_19909 = cljs.core.some.call(null,cljs.core.nil_QMARK_,inst_19908__$1);
var state_19922__$1 = (function (){var statearr_19931 = state_19922;
(statearr_19931[(8)] = inst_19908__$1);

return statearr_19931;
})();
if(cljs.core.truth_(inst_19909)){
var statearr_19932_19964 = state_19922__$1;
(statearr_19932_19964[(1)] = (13));

} else {
var statearr_19933_19965 = state_19922__$1;
(statearr_19933_19965[(1)] = (14));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (2))){
var inst_19885 = cljs.core.reset_BANG_.call(null,dctr,cnt);
var inst_19886 = (0);
var state_19922__$1 = (function (){var statearr_19934 = state_19922;
(statearr_19934[(7)] = inst_19886);

(statearr_19934[(9)] = inst_19885);

return statearr_19934;
})();
var statearr_19935_19966 = state_19922__$1;
(statearr_19935_19966[(2)] = null);

(statearr_19935_19966[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (11))){
var inst_19886 = (state_19922[(7)]);
var _ = cljs.core.async.impl.ioc_helpers.add_exception_frame.call(null,state_19922,(10),Object,null,(9));
var inst_19895 = chs__$1.call(null,inst_19886);
var inst_19896 = done.call(null,inst_19886);
var inst_19897 = cljs.core.async.take_BANG_.call(null,inst_19895,inst_19896);
var state_19922__$1 = state_19922;
var statearr_19936_19967 = state_19922__$1;
(statearr_19936_19967[(2)] = inst_19897);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19922__$1);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (9))){
var inst_19886 = (state_19922[(7)]);
var inst_19899 = (state_19922[(2)]);
var inst_19900 = (inst_19886 + (1));
var inst_19886__$1 = inst_19900;
var state_19922__$1 = (function (){var statearr_19937 = state_19922;
(statearr_19937[(7)] = inst_19886__$1);

(statearr_19937[(10)] = inst_19899);

return statearr_19937;
})();
var statearr_19938_19968 = state_19922__$1;
(statearr_19938_19968[(2)] = null);

(statearr_19938_19968[(1)] = (4));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (5))){
var inst_19906 = (state_19922[(2)]);
var state_19922__$1 = (function (){var statearr_19939 = state_19922;
(statearr_19939[(11)] = inst_19906);

return statearr_19939;
})();
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_19922__$1,(12),dchan);
} else {
if((state_val_19923 === (14))){
var inst_19908 = (state_19922[(8)]);
var inst_19913 = cljs.core.apply.call(null,f,inst_19908);
var state_19922__$1 = state_19922;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_19922__$1,(16),out,inst_19913);
} else {
if((state_val_19923 === (16))){
var inst_19915 = (state_19922[(2)]);
var state_19922__$1 = (function (){var statearr_19940 = state_19922;
(statearr_19940[(12)] = inst_19915);

return statearr_19940;
})();
var statearr_19941_19969 = state_19922__$1;
(statearr_19941_19969[(2)] = null);

(statearr_19941_19969[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (10))){
var inst_19890 = (state_19922[(2)]);
var inst_19891 = cljs.core.swap_BANG_.call(null,dctr,cljs.core.dec);
var state_19922__$1 = (function (){var statearr_19942 = state_19922;
(statearr_19942[(13)] = inst_19890);

return statearr_19942;
})();
var statearr_19943_19970 = state_19922__$1;
(statearr_19943_19970[(2)] = inst_19891);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19922__$1);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_19923 === (8))){
var inst_19904 = (state_19922[(2)]);
var state_19922__$1 = state_19922;
var statearr_19944_19971 = state_19922__$1;
(statearr_19944_19971[(2)] = inst_19904);

(statearr_19944_19971[(1)] = (5));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done))
;
return ((function (switch__17825__auto__,c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_19948 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_19948[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_19948[(1)] = (1));

return statearr_19948;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_19922){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_19922);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e19949){if((e19949 instanceof Object)){
var ex__17829__auto__ = e19949;
var statearr_19950_19972 = state_19922;
(statearr_19950_19972[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_19922);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e19949;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__19973 = state_19922;
state_19922 = G__19973;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_19922){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_19922);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done))
})();
var state__17939__auto__ = (function (){var statearr_19951 = f__17938__auto__.call(null);
(statearr_19951[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___19956);

return statearr_19951;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___19956,chs__$1,out,cnt,rets,dchan,dctr,done))
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
var args19975 = [];
var len__7291__auto___20031 = arguments.length;
var i__7292__auto___20032 = (0);
while(true){
if((i__7292__auto___20032 < len__7291__auto___20031)){
args19975.push((arguments[i__7292__auto___20032]));

var G__20033 = (i__7292__auto___20032 + (1));
i__7292__auto___20032 = G__20033;
continue;
} else {
}
break;
}

var G__19977 = args19975.length;
switch (G__19977) {
case 1:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args19975.length)].join('')));

}
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$1 = (function (chs){
return cljs.core.async.merge.call(null,chs,null);
});

cljs.core.async.merge.cljs$core$IFn$_invoke$arity$2 = (function (chs,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20035 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20035,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20035,out){
return (function (state_20007){
var state_val_20008 = (state_20007[(1)]);
if((state_val_20008 === (7))){
var inst_19987 = (state_20007[(7)]);
var inst_19986 = (state_20007[(8)]);
var inst_19986__$1 = (state_20007[(2)]);
var inst_19987__$1 = cljs.core.nth.call(null,inst_19986__$1,(0),null);
var inst_19988 = cljs.core.nth.call(null,inst_19986__$1,(1),null);
var inst_19989 = (inst_19987__$1 == null);
var state_20007__$1 = (function (){var statearr_20009 = state_20007;
(statearr_20009[(7)] = inst_19987__$1);

(statearr_20009[(9)] = inst_19988);

(statearr_20009[(8)] = inst_19986__$1);

return statearr_20009;
})();
if(cljs.core.truth_(inst_19989)){
var statearr_20010_20036 = state_20007__$1;
(statearr_20010_20036[(1)] = (8));

} else {
var statearr_20011_20037 = state_20007__$1;
(statearr_20011_20037[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (1))){
var inst_19978 = cljs.core.vec.call(null,chs);
var inst_19979 = inst_19978;
var state_20007__$1 = (function (){var statearr_20012 = state_20007;
(statearr_20012[(10)] = inst_19979);

return statearr_20012;
})();
var statearr_20013_20038 = state_20007__$1;
(statearr_20013_20038[(2)] = null);

(statearr_20013_20038[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (4))){
var inst_19979 = (state_20007[(10)]);
var state_20007__$1 = state_20007;
return cljs.core.async.ioc_alts_BANG_.call(null,state_20007__$1,(7),inst_19979);
} else {
if((state_val_20008 === (6))){
var inst_20003 = (state_20007[(2)]);
var state_20007__$1 = state_20007;
var statearr_20014_20039 = state_20007__$1;
(statearr_20014_20039[(2)] = inst_20003);

(statearr_20014_20039[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (3))){
var inst_20005 = (state_20007[(2)]);
var state_20007__$1 = state_20007;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20007__$1,inst_20005);
} else {
if((state_val_20008 === (2))){
var inst_19979 = (state_20007[(10)]);
var inst_19981 = cljs.core.count.call(null,inst_19979);
var inst_19982 = (inst_19981 > (0));
var state_20007__$1 = state_20007;
if(cljs.core.truth_(inst_19982)){
var statearr_20016_20040 = state_20007__$1;
(statearr_20016_20040[(1)] = (4));

} else {
var statearr_20017_20041 = state_20007__$1;
(statearr_20017_20041[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (11))){
var inst_19979 = (state_20007[(10)]);
var inst_19996 = (state_20007[(2)]);
var tmp20015 = inst_19979;
var inst_19979__$1 = tmp20015;
var state_20007__$1 = (function (){var statearr_20018 = state_20007;
(statearr_20018[(10)] = inst_19979__$1);

(statearr_20018[(11)] = inst_19996);

return statearr_20018;
})();
var statearr_20019_20042 = state_20007__$1;
(statearr_20019_20042[(2)] = null);

(statearr_20019_20042[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (9))){
var inst_19987 = (state_20007[(7)]);
var state_20007__$1 = state_20007;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20007__$1,(11),out,inst_19987);
} else {
if((state_val_20008 === (5))){
var inst_20001 = cljs.core.async.close_BANG_.call(null,out);
var state_20007__$1 = state_20007;
var statearr_20020_20043 = state_20007__$1;
(statearr_20020_20043[(2)] = inst_20001);

(statearr_20020_20043[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (10))){
var inst_19999 = (state_20007[(2)]);
var state_20007__$1 = state_20007;
var statearr_20021_20044 = state_20007__$1;
(statearr_20021_20044[(2)] = inst_19999);

(statearr_20021_20044[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20008 === (8))){
var inst_19979 = (state_20007[(10)]);
var inst_19987 = (state_20007[(7)]);
var inst_19988 = (state_20007[(9)]);
var inst_19986 = (state_20007[(8)]);
var inst_19991 = (function (){var cs = inst_19979;
var vec__19984 = inst_19986;
var v = inst_19987;
var c = inst_19988;
return ((function (cs,vec__19984,v,c,inst_19979,inst_19987,inst_19988,inst_19986,state_val_20008,c__17937__auto___20035,out){
return (function (p1__19974_SHARP_){
return cljs.core.not_EQ_.call(null,c,p1__19974_SHARP_);
});
;})(cs,vec__19984,v,c,inst_19979,inst_19987,inst_19988,inst_19986,state_val_20008,c__17937__auto___20035,out))
})();
var inst_19992 = cljs.core.filterv.call(null,inst_19991,inst_19979);
var inst_19979__$1 = inst_19992;
var state_20007__$1 = (function (){var statearr_20022 = state_20007;
(statearr_20022[(10)] = inst_19979__$1);

return statearr_20022;
})();
var statearr_20023_20045 = state_20007__$1;
(statearr_20023_20045[(2)] = null);

(statearr_20023_20045[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___20035,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20035,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20027 = [null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_20027[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20027[(1)] = (1));

return statearr_20027;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20007){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20007);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20028){if((e20028 instanceof Object)){
var ex__17829__auto__ = e20028;
var statearr_20029_20046 = state_20007;
(statearr_20029_20046[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20007);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20028;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20047 = state_20007;
state_20007 = G__20047;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20007){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20007);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20035,out))
})();
var state__17939__auto__ = (function (){var statearr_20030 = f__17938__auto__.call(null);
(statearr_20030[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20035);

return statearr_20030;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20035,out))
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
return cljs.core.async.reduce.call(null,cljs.core.conj,coll,ch);
});
/**
 * Returns a channel that will return, at most, n items from ch. After n items
 * have been returned, or ch has been closed, the return chanel will close.
 * 
 *   The output channel is unbuffered by default, unless buf-or-n is given.
 */
cljs.core.async.take = (function cljs$core$async$take(var_args){
var args20048 = [];
var len__7291__auto___20097 = arguments.length;
var i__7292__auto___20098 = (0);
while(true){
if((i__7292__auto___20098 < len__7291__auto___20097)){
args20048.push((arguments[i__7292__auto___20098]));

var G__20099 = (i__7292__auto___20098 + (1));
i__7292__auto___20098 = G__20099;
continue;
} else {
}
break;
}

var G__20050 = args20048.length;
switch (G__20050) {
case 2:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.take.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20048.length)].join('')));

}
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.take.call(null,n,ch,null);
});

cljs.core.async.take.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20101 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20101,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20101,out){
return (function (state_20074){
var state_val_20075 = (state_20074[(1)]);
if((state_val_20075 === (7))){
var inst_20056 = (state_20074[(7)]);
var inst_20056__$1 = (state_20074[(2)]);
var inst_20057 = (inst_20056__$1 == null);
var inst_20058 = cljs.core.not.call(null,inst_20057);
var state_20074__$1 = (function (){var statearr_20076 = state_20074;
(statearr_20076[(7)] = inst_20056__$1);

return statearr_20076;
})();
if(inst_20058){
var statearr_20077_20102 = state_20074__$1;
(statearr_20077_20102[(1)] = (8));

} else {
var statearr_20078_20103 = state_20074__$1;
(statearr_20078_20103[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (1))){
var inst_20051 = (0);
var state_20074__$1 = (function (){var statearr_20079 = state_20074;
(statearr_20079[(8)] = inst_20051);

return statearr_20079;
})();
var statearr_20080_20104 = state_20074__$1;
(statearr_20080_20104[(2)] = null);

(statearr_20080_20104[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (4))){
var state_20074__$1 = state_20074;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20074__$1,(7),ch);
} else {
if((state_val_20075 === (6))){
var inst_20069 = (state_20074[(2)]);
var state_20074__$1 = state_20074;
var statearr_20081_20105 = state_20074__$1;
(statearr_20081_20105[(2)] = inst_20069);

(statearr_20081_20105[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (3))){
var inst_20071 = (state_20074[(2)]);
var inst_20072 = cljs.core.async.close_BANG_.call(null,out);
var state_20074__$1 = (function (){var statearr_20082 = state_20074;
(statearr_20082[(9)] = inst_20071);

return statearr_20082;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20074__$1,inst_20072);
} else {
if((state_val_20075 === (2))){
var inst_20051 = (state_20074[(8)]);
var inst_20053 = (inst_20051 < n);
var state_20074__$1 = state_20074;
if(cljs.core.truth_(inst_20053)){
var statearr_20083_20106 = state_20074__$1;
(statearr_20083_20106[(1)] = (4));

} else {
var statearr_20084_20107 = state_20074__$1;
(statearr_20084_20107[(1)] = (5));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (11))){
var inst_20051 = (state_20074[(8)]);
var inst_20061 = (state_20074[(2)]);
var inst_20062 = (inst_20051 + (1));
var inst_20051__$1 = inst_20062;
var state_20074__$1 = (function (){var statearr_20085 = state_20074;
(statearr_20085[(8)] = inst_20051__$1);

(statearr_20085[(10)] = inst_20061);

return statearr_20085;
})();
var statearr_20086_20108 = state_20074__$1;
(statearr_20086_20108[(2)] = null);

(statearr_20086_20108[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (9))){
var state_20074__$1 = state_20074;
var statearr_20087_20109 = state_20074__$1;
(statearr_20087_20109[(2)] = null);

(statearr_20087_20109[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (5))){
var state_20074__$1 = state_20074;
var statearr_20088_20110 = state_20074__$1;
(statearr_20088_20110[(2)] = null);

(statearr_20088_20110[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (10))){
var inst_20066 = (state_20074[(2)]);
var state_20074__$1 = state_20074;
var statearr_20089_20111 = state_20074__$1;
(statearr_20089_20111[(2)] = inst_20066);

(statearr_20089_20111[(1)] = (6));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20075 === (8))){
var inst_20056 = (state_20074[(7)]);
var state_20074__$1 = state_20074;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20074__$1,(11),out,inst_20056);
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
});})(c__17937__auto___20101,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20101,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20093 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_20093[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20093[(1)] = (1));

return statearr_20093;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20074){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20074);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20094){if((e20094 instanceof Object)){
var ex__17829__auto__ = e20094;
var statearr_20095_20112 = state_20074;
(statearr_20095_20112[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20074);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20094;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20113 = state_20074;
state_20074 = G__20113;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20074){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20074);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20101,out))
})();
var state__17939__auto__ = (function (){var statearr_20096 = f__17938__auto__.call(null);
(statearr_20096[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20101);

return statearr_20096;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20101,out))
);


return out;
});

cljs.core.async.take.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_LT_ = (function cljs$core$async$map_LT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async20121 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async20121 = (function (map_LT_,f,ch,meta20122){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta20122 = meta20122;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_20123,meta20122__$1){
var self__ = this;
var _20123__$1 = this;
return (new cljs.core.async.t_cljs$core$async20121(self__.map_LT_,self__.f,self__.ch,meta20122__$1));
});

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_20123){
var self__ = this;
var _20123__$1 = this;
return self__.meta20122;
});

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
var ret = cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,(function (){
if(typeof cljs.core.async.t_cljs$core$async20124 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Handler}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async20124 = (function (map_LT_,f,ch,meta20122,_,fn1,meta20125){
this.map_LT_ = map_LT_;
this.f = f;
this.ch = ch;
this.meta20122 = meta20122;
this._ = _;
this.fn1 = fn1;
this.meta20125 = meta20125;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = ((function (___$1){
return (function (_20126,meta20125__$1){
var self__ = this;
var _20126__$1 = this;
return (new cljs.core.async.t_cljs$core$async20124(self__.map_LT_,self__.f,self__.ch,self__.meta20122,self__._,self__.fn1,meta20125__$1));
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$IMeta$_meta$arity$1 = ((function (___$1){
return (function (_20126){
var self__ = this;
var _20126__$1 = this;
return self__.meta20125;
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$async$impl$protocols$Handler$ = true;

cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return cljs.core.async.impl.protocols.active_QMARK_.call(null,self__.fn1);
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$async$impl$protocols$Handler$blockable_QMARK_$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
return true;
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = ((function (___$1){
return (function (___$1){
var self__ = this;
var ___$2 = this;
var f1 = cljs.core.async.impl.protocols.commit.call(null,self__.fn1);
return ((function (f1,___$2,___$1){
return (function (p1__20114_SHARP_){
return f1.call(null,(((p1__20114_SHARP_ == null))?null:self__.f.call(null,p1__20114_SHARP_)));
});
;})(f1,___$2,___$1))
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.getBasis = ((function (___$1){
return (function (){
return new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map<","map<",-1235808357,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta20122","meta20122",105203685,null),cljs.core.with_meta(new cljs.core.Symbol(null,"_","_",-1201019570,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol("cljs.core.async","t_cljs$core$async20121","cljs.core.async/t_cljs$core$async20121",-1168673972,null)], null)),new cljs.core.Symbol(null,"fn1","fn1",895834444,null),new cljs.core.Symbol(null,"meta20125","meta20125",-1441164041,null)], null);
});})(___$1))
;

cljs.core.async.t_cljs$core$async20124.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async20124.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async20124";

cljs.core.async.t_cljs$core$async20124.cljs$lang$ctorPrWriter = ((function (___$1){
return (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async20124");
});})(___$1))
;

cljs.core.async.__GT_t_cljs$core$async20124 = ((function (___$1){
return (function cljs$core$async$map_LT__$___GT_t_cljs$core$async20124(map_LT___$1,f__$1,ch__$1,meta20122__$1,___$2,fn1__$1,meta20125){
return (new cljs.core.async.t_cljs$core$async20124(map_LT___$1,f__$1,ch__$1,meta20122__$1,___$2,fn1__$1,meta20125));
});})(___$1))
;

}

return (new cljs.core.async.t_cljs$core$async20124(self__.map_LT_,self__.f,self__.ch,self__.meta20122,___$1,fn1,cljs.core.PersistentArrayMap.EMPTY));
})()
);
if(cljs.core.truth_((function (){var and__6204__auto__ = ret;
if(cljs.core.truth_(and__6204__auto__)){
return !((cljs.core.deref.call(null,ret) == null));
} else {
return and__6204__auto__;
}
})())){
return cljs.core.async.impl.channels.box.call(null,self__.f.call(null,cljs.core.deref.call(null,ret)));
} else {
return ret;
}
});

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async20121.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,val,fn1);
});

cljs.core.async.t_cljs$core$async20121.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map<","map<",-1235808357,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta20122","meta20122",105203685,null)], null);
});

cljs.core.async.t_cljs$core$async20121.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async20121.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async20121";

cljs.core.async.t_cljs$core$async20121.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async20121");
});

cljs.core.async.__GT_t_cljs$core$async20121 = (function cljs$core$async$map_LT__$___GT_t_cljs$core$async20121(map_LT___$1,f__$1,ch__$1,meta20122){
return (new cljs.core.async.t_cljs$core$async20121(map_LT___$1,f__$1,ch__$1,meta20122));
});

}

return (new cljs.core.async.t_cljs$core$async20121(cljs$core$async$map_LT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.map_GT_ = (function cljs$core$async$map_GT_(f,ch){
if(typeof cljs.core.async.t_cljs$core$async20130 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async20130 = (function (map_GT_,f,ch,meta20131){
this.map_GT_ = map_GT_;
this.f = f;
this.ch = ch;
this.meta20131 = meta20131;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_20132,meta20131__$1){
var self__ = this;
var _20132__$1 = this;
return (new cljs.core.async.t_cljs$core$async20130(self__.map_GT_,self__.f,self__.ch,meta20131__$1));
});

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_20132){
var self__ = this;
var _20132__$1 = this;
return self__.meta20131;
});

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async20130.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,self__.f.call(null,val),fn1);
});

cljs.core.async.t_cljs$core$async20130.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"map>","map>",1676369295,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"f","f",43394975,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta20131","meta20131",-1598034190,null)], null);
});

cljs.core.async.t_cljs$core$async20130.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async20130.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async20130";

cljs.core.async.t_cljs$core$async20130.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async20130");
});

cljs.core.async.__GT_t_cljs$core$async20130 = (function cljs$core$async$map_GT__$___GT_t_cljs$core$async20130(map_GT___$1,f__$1,ch__$1,meta20131){
return (new cljs.core.async.t_cljs$core$async20130(map_GT___$1,f__$1,ch__$1,meta20131));
});

}

return (new cljs.core.async.t_cljs$core$async20130(cljs$core$async$map_GT_,f,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_GT_ = (function cljs$core$async$filter_GT_(p,ch){
if(typeof cljs.core.async.t_cljs$core$async20136 !== 'undefined'){
} else {

/**
* @constructor
 * @implements {cljs.core.async.impl.protocols.Channel}
 * @implements {cljs.core.async.impl.protocols.WritePort}
 * @implements {cljs.core.async.impl.protocols.ReadPort}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
cljs.core.async.t_cljs$core$async20136 = (function (filter_GT_,p,ch,meta20137){
this.filter_GT_ = filter_GT_;
this.p = p;
this.ch = ch;
this.meta20137 = meta20137;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
})
cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_20138,meta20137__$1){
var self__ = this;
var _20138__$1 = this;
return (new cljs.core.async.t_cljs$core$async20136(self__.filter_GT_,self__.p,self__.ch,meta20137__$1));
});

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_20138){
var self__ = this;
var _20138__$1 = this;
return self__.meta20137;
});

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$Channel$ = true;

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.close_BANG_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$Channel$closed_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch);
});

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$ReadPort$ = true;

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = (function (_,fn1){
var self__ = this;
var ___$1 = this;
return cljs.core.async.impl.protocols.take_BANG_.call(null,self__.ch,fn1);
});

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$WritePort$ = true;

cljs.core.async.t_cljs$core$async20136.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = (function (_,val,fn1){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.p.call(null,val))){
return cljs.core.async.impl.protocols.put_BANG_.call(null,self__.ch,val,fn1);
} else {
return cljs.core.async.impl.channels.box.call(null,cljs.core.not.call(null,cljs.core.async.impl.protocols.closed_QMARK_.call(null,self__.ch)));
}
});

cljs.core.async.t_cljs$core$async20136.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"filter>","filter>",-37644455,null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"arglists","arglists",1661989754),cljs.core.list(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.list(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null)], null))),new cljs.core.Keyword(null,"doc","doc",1913296891),"Deprecated - this function will be removed. Use transducer instead"], null)),new cljs.core.Symbol(null,"p","p",1791580836,null),new cljs.core.Symbol(null,"ch","ch",1085813622,null),new cljs.core.Symbol(null,"meta20137","meta20137",-1608862634,null)], null);
});

cljs.core.async.t_cljs$core$async20136.cljs$lang$type = true;

cljs.core.async.t_cljs$core$async20136.cljs$lang$ctorStr = "cljs.core.async/t_cljs$core$async20136";

cljs.core.async.t_cljs$core$async20136.cljs$lang$ctorPrWriter = (function (this__6822__auto__,writer__6823__auto__,opt__6824__auto__){
return cljs.core._write.call(null,writer__6823__auto__,"cljs.core.async/t_cljs$core$async20136");
});

cljs.core.async.__GT_t_cljs$core$async20136 = (function cljs$core$async$filter_GT__$___GT_t_cljs$core$async20136(filter_GT___$1,p__$1,ch__$1,meta20137){
return (new cljs.core.async.t_cljs$core$async20136(filter_GT___$1,p__$1,ch__$1,meta20137));
});

}

return (new cljs.core.async.t_cljs$core$async20136(cljs$core$async$filter_GT_,p,ch,cljs.core.PersistentArrayMap.EMPTY));
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_GT_ = (function cljs$core$async$remove_GT_(p,ch){
return cljs.core.async.filter_GT_.call(null,cljs.core.complement.call(null,p),ch);
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.filter_LT_ = (function cljs$core$async$filter_LT_(var_args){
var args20139 = [];
var len__7291__auto___20183 = arguments.length;
var i__7292__auto___20184 = (0);
while(true){
if((i__7292__auto___20184 < len__7291__auto___20183)){
args20139.push((arguments[i__7292__auto___20184]));

var G__20185 = (i__7292__auto___20184 + (1));
i__7292__auto___20184 = G__20185;
continue;
} else {
}
break;
}

var G__20141 = args20139.length;
switch (G__20141) {
case 2:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20139.length)].join('')));

}
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.filter_LT_.call(null,p,ch,null);
});

cljs.core.async.filter_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20187 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20187,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20187,out){
return (function (state_20162){
var state_val_20163 = (state_20162[(1)]);
if((state_val_20163 === (7))){
var inst_20158 = (state_20162[(2)]);
var state_20162__$1 = state_20162;
var statearr_20164_20188 = state_20162__$1;
(statearr_20164_20188[(2)] = inst_20158);

(statearr_20164_20188[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (1))){
var state_20162__$1 = state_20162;
var statearr_20165_20189 = state_20162__$1;
(statearr_20165_20189[(2)] = null);

(statearr_20165_20189[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (4))){
var inst_20144 = (state_20162[(7)]);
var inst_20144__$1 = (state_20162[(2)]);
var inst_20145 = (inst_20144__$1 == null);
var state_20162__$1 = (function (){var statearr_20166 = state_20162;
(statearr_20166[(7)] = inst_20144__$1);

return statearr_20166;
})();
if(cljs.core.truth_(inst_20145)){
var statearr_20167_20190 = state_20162__$1;
(statearr_20167_20190[(1)] = (5));

} else {
var statearr_20168_20191 = state_20162__$1;
(statearr_20168_20191[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (6))){
var inst_20144 = (state_20162[(7)]);
var inst_20149 = p.call(null,inst_20144);
var state_20162__$1 = state_20162;
if(cljs.core.truth_(inst_20149)){
var statearr_20169_20192 = state_20162__$1;
(statearr_20169_20192[(1)] = (8));

} else {
var statearr_20170_20193 = state_20162__$1;
(statearr_20170_20193[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (3))){
var inst_20160 = (state_20162[(2)]);
var state_20162__$1 = state_20162;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20162__$1,inst_20160);
} else {
if((state_val_20163 === (2))){
var state_20162__$1 = state_20162;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20162__$1,(4),ch);
} else {
if((state_val_20163 === (11))){
var inst_20152 = (state_20162[(2)]);
var state_20162__$1 = state_20162;
var statearr_20171_20194 = state_20162__$1;
(statearr_20171_20194[(2)] = inst_20152);

(statearr_20171_20194[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (9))){
var state_20162__$1 = state_20162;
var statearr_20172_20195 = state_20162__$1;
(statearr_20172_20195[(2)] = null);

(statearr_20172_20195[(1)] = (10));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (5))){
var inst_20147 = cljs.core.async.close_BANG_.call(null,out);
var state_20162__$1 = state_20162;
var statearr_20173_20196 = state_20162__$1;
(statearr_20173_20196[(2)] = inst_20147);

(statearr_20173_20196[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (10))){
var inst_20155 = (state_20162[(2)]);
var state_20162__$1 = (function (){var statearr_20174 = state_20162;
(statearr_20174[(8)] = inst_20155);

return statearr_20174;
})();
var statearr_20175_20197 = state_20162__$1;
(statearr_20175_20197[(2)] = null);

(statearr_20175_20197[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20163 === (8))){
var inst_20144 = (state_20162[(7)]);
var state_20162__$1 = state_20162;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20162__$1,(11),out,inst_20144);
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
});})(c__17937__auto___20187,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20187,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20179 = [null,null,null,null,null,null,null,null,null];
(statearr_20179[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20179[(1)] = (1));

return statearr_20179;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20162){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20162);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20180){if((e20180 instanceof Object)){
var ex__17829__auto__ = e20180;
var statearr_20181_20198 = state_20162;
(statearr_20181_20198[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20162);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20180;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20199 = state_20162;
state_20162 = G__20199;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20162){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20162);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20187,out))
})();
var state__17939__auto__ = (function (){var statearr_20182 = f__17938__auto__.call(null);
(statearr_20182[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20187);

return statearr_20182;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20187,out))
);


return out;
});

cljs.core.async.filter_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.remove_LT_ = (function cljs$core$async$remove_LT_(var_args){
var args20200 = [];
var len__7291__auto___20203 = arguments.length;
var i__7292__auto___20204 = (0);
while(true){
if((i__7292__auto___20204 < len__7291__auto___20203)){
args20200.push((arguments[i__7292__auto___20204]));

var G__20205 = (i__7292__auto___20204 + (1));
i__7292__auto___20204 = G__20205;
continue;
} else {
}
break;
}

var G__20202 = args20200.length;
switch (G__20202) {
case 2:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20200.length)].join('')));

}
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$2 = (function (p,ch){
return cljs.core.async.remove_LT_.call(null,p,ch,null);
});

cljs.core.async.remove_LT_.cljs$core$IFn$_invoke$arity$3 = (function (p,ch,buf_or_n){
return cljs.core.async.filter_LT_.call(null,cljs.core.complement.call(null,p),ch,buf_or_n);
});

cljs.core.async.remove_LT_.cljs$lang$maxFixedArity = 3;
cljs.core.async.mapcat_STAR_ = (function cljs$core$async$mapcat_STAR_(f,in$,out){
var c__17937__auto__ = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto__){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto__){
return (function (state_20372){
var state_val_20373 = (state_20372[(1)]);
if((state_val_20373 === (7))){
var inst_20368 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
var statearr_20374_20415 = state_20372__$1;
(statearr_20374_20415[(2)] = inst_20368);

(statearr_20374_20415[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (20))){
var inst_20338 = (state_20372[(7)]);
var inst_20349 = (state_20372[(2)]);
var inst_20350 = cljs.core.next.call(null,inst_20338);
var inst_20324 = inst_20350;
var inst_20325 = null;
var inst_20326 = (0);
var inst_20327 = (0);
var state_20372__$1 = (function (){var statearr_20375 = state_20372;
(statearr_20375[(8)] = inst_20349);

(statearr_20375[(9)] = inst_20327);

(statearr_20375[(10)] = inst_20324);

(statearr_20375[(11)] = inst_20325);

(statearr_20375[(12)] = inst_20326);

return statearr_20375;
})();
var statearr_20376_20416 = state_20372__$1;
(statearr_20376_20416[(2)] = null);

(statearr_20376_20416[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (1))){
var state_20372__$1 = state_20372;
var statearr_20377_20417 = state_20372__$1;
(statearr_20377_20417[(2)] = null);

(statearr_20377_20417[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (4))){
var inst_20313 = (state_20372[(13)]);
var inst_20313__$1 = (state_20372[(2)]);
var inst_20314 = (inst_20313__$1 == null);
var state_20372__$1 = (function (){var statearr_20378 = state_20372;
(statearr_20378[(13)] = inst_20313__$1);

return statearr_20378;
})();
if(cljs.core.truth_(inst_20314)){
var statearr_20379_20418 = state_20372__$1;
(statearr_20379_20418[(1)] = (5));

} else {
var statearr_20380_20419 = state_20372__$1;
(statearr_20380_20419[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (15))){
var state_20372__$1 = state_20372;
var statearr_20384_20420 = state_20372__$1;
(statearr_20384_20420[(2)] = null);

(statearr_20384_20420[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (21))){
var state_20372__$1 = state_20372;
var statearr_20385_20421 = state_20372__$1;
(statearr_20385_20421[(2)] = null);

(statearr_20385_20421[(1)] = (23));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (13))){
var inst_20327 = (state_20372[(9)]);
var inst_20324 = (state_20372[(10)]);
var inst_20325 = (state_20372[(11)]);
var inst_20326 = (state_20372[(12)]);
var inst_20334 = (state_20372[(2)]);
var inst_20335 = (inst_20327 + (1));
var tmp20381 = inst_20324;
var tmp20382 = inst_20325;
var tmp20383 = inst_20326;
var inst_20324__$1 = tmp20381;
var inst_20325__$1 = tmp20382;
var inst_20326__$1 = tmp20383;
var inst_20327__$1 = inst_20335;
var state_20372__$1 = (function (){var statearr_20386 = state_20372;
(statearr_20386[(9)] = inst_20327__$1);

(statearr_20386[(10)] = inst_20324__$1);

(statearr_20386[(11)] = inst_20325__$1);

(statearr_20386[(14)] = inst_20334);

(statearr_20386[(12)] = inst_20326__$1);

return statearr_20386;
})();
var statearr_20387_20422 = state_20372__$1;
(statearr_20387_20422[(2)] = null);

(statearr_20387_20422[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (22))){
var state_20372__$1 = state_20372;
var statearr_20388_20423 = state_20372__$1;
(statearr_20388_20423[(2)] = null);

(statearr_20388_20423[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (6))){
var inst_20313 = (state_20372[(13)]);
var inst_20322 = f.call(null,inst_20313);
var inst_20323 = cljs.core.seq.call(null,inst_20322);
var inst_20324 = inst_20323;
var inst_20325 = null;
var inst_20326 = (0);
var inst_20327 = (0);
var state_20372__$1 = (function (){var statearr_20389 = state_20372;
(statearr_20389[(9)] = inst_20327);

(statearr_20389[(10)] = inst_20324);

(statearr_20389[(11)] = inst_20325);

(statearr_20389[(12)] = inst_20326);

return statearr_20389;
})();
var statearr_20390_20424 = state_20372__$1;
(statearr_20390_20424[(2)] = null);

(statearr_20390_20424[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (17))){
var inst_20338 = (state_20372[(7)]);
var inst_20342 = cljs.core.chunk_first.call(null,inst_20338);
var inst_20343 = cljs.core.chunk_rest.call(null,inst_20338);
var inst_20344 = cljs.core.count.call(null,inst_20342);
var inst_20324 = inst_20343;
var inst_20325 = inst_20342;
var inst_20326 = inst_20344;
var inst_20327 = (0);
var state_20372__$1 = (function (){var statearr_20391 = state_20372;
(statearr_20391[(9)] = inst_20327);

(statearr_20391[(10)] = inst_20324);

(statearr_20391[(11)] = inst_20325);

(statearr_20391[(12)] = inst_20326);

return statearr_20391;
})();
var statearr_20392_20425 = state_20372__$1;
(statearr_20392_20425[(2)] = null);

(statearr_20392_20425[(1)] = (8));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (3))){
var inst_20370 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20372__$1,inst_20370);
} else {
if((state_val_20373 === (12))){
var inst_20358 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
var statearr_20393_20426 = state_20372__$1;
(statearr_20393_20426[(2)] = inst_20358);

(statearr_20393_20426[(1)] = (9));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (2))){
var state_20372__$1 = state_20372;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20372__$1,(4),in$);
} else {
if((state_val_20373 === (23))){
var inst_20366 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
var statearr_20394_20427 = state_20372__$1;
(statearr_20394_20427[(2)] = inst_20366);

(statearr_20394_20427[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (19))){
var inst_20353 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
var statearr_20395_20428 = state_20372__$1;
(statearr_20395_20428[(2)] = inst_20353);

(statearr_20395_20428[(1)] = (16));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (11))){
var inst_20338 = (state_20372[(7)]);
var inst_20324 = (state_20372[(10)]);
var inst_20338__$1 = cljs.core.seq.call(null,inst_20324);
var state_20372__$1 = (function (){var statearr_20396 = state_20372;
(statearr_20396[(7)] = inst_20338__$1);

return statearr_20396;
})();
if(inst_20338__$1){
var statearr_20397_20429 = state_20372__$1;
(statearr_20397_20429[(1)] = (14));

} else {
var statearr_20398_20430 = state_20372__$1;
(statearr_20398_20430[(1)] = (15));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (9))){
var inst_20360 = (state_20372[(2)]);
var inst_20361 = cljs.core.async.impl.protocols.closed_QMARK_.call(null,out);
var state_20372__$1 = (function (){var statearr_20399 = state_20372;
(statearr_20399[(15)] = inst_20360);

return statearr_20399;
})();
if(cljs.core.truth_(inst_20361)){
var statearr_20400_20431 = state_20372__$1;
(statearr_20400_20431[(1)] = (21));

} else {
var statearr_20401_20432 = state_20372__$1;
(statearr_20401_20432[(1)] = (22));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (5))){
var inst_20316 = cljs.core.async.close_BANG_.call(null,out);
var state_20372__$1 = state_20372;
var statearr_20402_20433 = state_20372__$1;
(statearr_20402_20433[(2)] = inst_20316);

(statearr_20402_20433[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (14))){
var inst_20338 = (state_20372[(7)]);
var inst_20340 = cljs.core.chunked_seq_QMARK_.call(null,inst_20338);
var state_20372__$1 = state_20372;
if(inst_20340){
var statearr_20403_20434 = state_20372__$1;
(statearr_20403_20434[(1)] = (17));

} else {
var statearr_20404_20435 = state_20372__$1;
(statearr_20404_20435[(1)] = (18));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (16))){
var inst_20356 = (state_20372[(2)]);
var state_20372__$1 = state_20372;
var statearr_20405_20436 = state_20372__$1;
(statearr_20405_20436[(2)] = inst_20356);

(statearr_20405_20436[(1)] = (12));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20373 === (10))){
var inst_20327 = (state_20372[(9)]);
var inst_20325 = (state_20372[(11)]);
var inst_20332 = cljs.core._nth.call(null,inst_20325,inst_20327);
var state_20372__$1 = state_20372;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20372__$1,(13),out,inst_20332);
} else {
if((state_val_20373 === (18))){
var inst_20338 = (state_20372[(7)]);
var inst_20347 = cljs.core.first.call(null,inst_20338);
var state_20372__$1 = state_20372;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20372__$1,(20),out,inst_20347);
} else {
if((state_val_20373 === (8))){
var inst_20327 = (state_20372[(9)]);
var inst_20326 = (state_20372[(12)]);
var inst_20329 = (inst_20327 < inst_20326);
var inst_20330 = inst_20329;
var state_20372__$1 = state_20372;
if(cljs.core.truth_(inst_20330)){
var statearr_20406_20437 = state_20372__$1;
(statearr_20406_20437[(1)] = (10));

} else {
var statearr_20407_20438 = state_20372__$1;
(statearr_20407_20438[(1)] = (11));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto__))
;
return ((function (switch__17825__auto__,c__17937__auto__){
return (function() {
var cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__ = null;
var cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____0 = (function (){
var statearr_20411 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_20411[(0)] = cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__);

(statearr_20411[(1)] = (1));

return statearr_20411;
});
var cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____1 = (function (state_20372){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20372);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20412){if((e20412 instanceof Object)){
var ex__17829__auto__ = e20412;
var statearr_20413_20439 = state_20372;
(statearr_20413_20439[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20372);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20412;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20440 = state_20372;
state_20372 = G__20440;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__ = function(state_20372){
switch(arguments.length){
case 0:
return cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____1.call(this,state_20372);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____0;
cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$mapcat_STAR__$_state_machine__17826__auto____1;
return cljs$core$async$mapcat_STAR__$_state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto__))
})();
var state__17939__auto__ = (function (){var statearr_20414 = f__17938__auto__.call(null);
(statearr_20414[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto__);

return statearr_20414;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto__))
);

return c__17937__auto__;
});
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_LT_ = (function cljs$core$async$mapcat_LT_(var_args){
var args20441 = [];
var len__7291__auto___20444 = arguments.length;
var i__7292__auto___20445 = (0);
while(true){
if((i__7292__auto___20445 < len__7291__auto___20444)){
args20441.push((arguments[i__7292__auto___20445]));

var G__20446 = (i__7292__auto___20445 + (1));
i__7292__auto___20445 = G__20446;
continue;
} else {
}
break;
}

var G__20443 = args20441.length;
switch (G__20443) {
case 2:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20441.length)].join('')));

}
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$2 = (function (f,in$){
return cljs.core.async.mapcat_LT_.call(null,f,in$,null);
});

cljs.core.async.mapcat_LT_.cljs$core$IFn$_invoke$arity$3 = (function (f,in$,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
cljs.core.async.mapcat_STAR_.call(null,f,in$,out);

return out;
});

cljs.core.async.mapcat_LT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.mapcat_GT_ = (function cljs$core$async$mapcat_GT_(var_args){
var args20448 = [];
var len__7291__auto___20451 = arguments.length;
var i__7292__auto___20452 = (0);
while(true){
if((i__7292__auto___20452 < len__7291__auto___20451)){
args20448.push((arguments[i__7292__auto___20452]));

var G__20453 = (i__7292__auto___20452 + (1));
i__7292__auto___20452 = G__20453;
continue;
} else {
}
break;
}

var G__20450 = args20448.length;
switch (G__20450) {
case 2:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20448.length)].join('')));

}
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$2 = (function (f,out){
return cljs.core.async.mapcat_GT_.call(null,f,out,null);
});

cljs.core.async.mapcat_GT_.cljs$core$IFn$_invoke$arity$3 = (function (f,out,buf_or_n){
var in$ = cljs.core.async.chan.call(null,buf_or_n);
cljs.core.async.mapcat_STAR_.call(null,f,in$,out);

return in$;
});

cljs.core.async.mapcat_GT_.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.unique = (function cljs$core$async$unique(var_args){
var args20455 = [];
var len__7291__auto___20506 = arguments.length;
var i__7292__auto___20507 = (0);
while(true){
if((i__7292__auto___20507 < len__7291__auto___20506)){
args20455.push((arguments[i__7292__auto___20507]));

var G__20508 = (i__7292__auto___20507 + (1));
i__7292__auto___20507 = G__20508;
continue;
} else {
}
break;
}

var G__20457 = args20455.length;
switch (G__20457) {
case 1:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20455.length)].join('')));

}
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$1 = (function (ch){
return cljs.core.async.unique.call(null,ch,null);
});

cljs.core.async.unique.cljs$core$IFn$_invoke$arity$2 = (function (ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20510 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20510,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20510,out){
return (function (state_20481){
var state_val_20482 = (state_20481[(1)]);
if((state_val_20482 === (7))){
var inst_20476 = (state_20481[(2)]);
var state_20481__$1 = state_20481;
var statearr_20483_20511 = state_20481__$1;
(statearr_20483_20511[(2)] = inst_20476);

(statearr_20483_20511[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (1))){
var inst_20458 = null;
var state_20481__$1 = (function (){var statearr_20484 = state_20481;
(statearr_20484[(7)] = inst_20458);

return statearr_20484;
})();
var statearr_20485_20512 = state_20481__$1;
(statearr_20485_20512[(2)] = null);

(statearr_20485_20512[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (4))){
var inst_20461 = (state_20481[(8)]);
var inst_20461__$1 = (state_20481[(2)]);
var inst_20462 = (inst_20461__$1 == null);
var inst_20463 = cljs.core.not.call(null,inst_20462);
var state_20481__$1 = (function (){var statearr_20486 = state_20481;
(statearr_20486[(8)] = inst_20461__$1);

return statearr_20486;
})();
if(inst_20463){
var statearr_20487_20513 = state_20481__$1;
(statearr_20487_20513[(1)] = (5));

} else {
var statearr_20488_20514 = state_20481__$1;
(statearr_20488_20514[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (6))){
var state_20481__$1 = state_20481;
var statearr_20489_20515 = state_20481__$1;
(statearr_20489_20515[(2)] = null);

(statearr_20489_20515[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (3))){
var inst_20478 = (state_20481[(2)]);
var inst_20479 = cljs.core.async.close_BANG_.call(null,out);
var state_20481__$1 = (function (){var statearr_20490 = state_20481;
(statearr_20490[(9)] = inst_20478);

return statearr_20490;
})();
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20481__$1,inst_20479);
} else {
if((state_val_20482 === (2))){
var state_20481__$1 = state_20481;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20481__$1,(4),ch);
} else {
if((state_val_20482 === (11))){
var inst_20461 = (state_20481[(8)]);
var inst_20470 = (state_20481[(2)]);
var inst_20458 = inst_20461;
var state_20481__$1 = (function (){var statearr_20491 = state_20481;
(statearr_20491[(10)] = inst_20470);

(statearr_20491[(7)] = inst_20458);

return statearr_20491;
})();
var statearr_20492_20516 = state_20481__$1;
(statearr_20492_20516[(2)] = null);

(statearr_20492_20516[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (9))){
var inst_20461 = (state_20481[(8)]);
var state_20481__$1 = state_20481;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20481__$1,(11),out,inst_20461);
} else {
if((state_val_20482 === (5))){
var inst_20461 = (state_20481[(8)]);
var inst_20458 = (state_20481[(7)]);
var inst_20465 = cljs.core._EQ_.call(null,inst_20461,inst_20458);
var state_20481__$1 = state_20481;
if(inst_20465){
var statearr_20494_20517 = state_20481__$1;
(statearr_20494_20517[(1)] = (8));

} else {
var statearr_20495_20518 = state_20481__$1;
(statearr_20495_20518[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (10))){
var inst_20473 = (state_20481[(2)]);
var state_20481__$1 = state_20481;
var statearr_20496_20519 = state_20481__$1;
(statearr_20496_20519[(2)] = inst_20473);

(statearr_20496_20519[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20482 === (8))){
var inst_20458 = (state_20481[(7)]);
var tmp20493 = inst_20458;
var inst_20458__$1 = tmp20493;
var state_20481__$1 = (function (){var statearr_20497 = state_20481;
(statearr_20497[(7)] = inst_20458__$1);

return statearr_20497;
})();
var statearr_20498_20520 = state_20481__$1;
(statearr_20498_20520[(2)] = null);

(statearr_20498_20520[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___20510,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20510,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20502 = [null,null,null,null,null,null,null,null,null,null,null];
(statearr_20502[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20502[(1)] = (1));

return statearr_20502;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20481){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20481);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20503){if((e20503 instanceof Object)){
var ex__17829__auto__ = e20503;
var statearr_20504_20521 = state_20481;
(statearr_20504_20521[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20481);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20503;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20522 = state_20481;
state_20481 = G__20522;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20481){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20481);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20510,out))
})();
var state__17939__auto__ = (function (){var statearr_20505 = f__17938__auto__.call(null);
(statearr_20505[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20510);

return statearr_20505;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20510,out))
);


return out;
});

cljs.core.async.unique.cljs$lang$maxFixedArity = 2;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition = (function cljs$core$async$partition(var_args){
var args20523 = [];
var len__7291__auto___20593 = arguments.length;
var i__7292__auto___20594 = (0);
while(true){
if((i__7292__auto___20594 < len__7291__auto___20593)){
args20523.push((arguments[i__7292__auto___20594]));

var G__20595 = (i__7292__auto___20594 + (1));
i__7292__auto___20594 = G__20595;
continue;
} else {
}
break;
}

var G__20525 = args20523.length;
switch (G__20525) {
case 2:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20523.length)].join('')));

}
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$2 = (function (n,ch){
return cljs.core.async.partition.call(null,n,ch,null);
});

cljs.core.async.partition.cljs$core$IFn$_invoke$arity$3 = (function (n,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20597 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20597,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20597,out){
return (function (state_20563){
var state_val_20564 = (state_20563[(1)]);
if((state_val_20564 === (7))){
var inst_20559 = (state_20563[(2)]);
var state_20563__$1 = state_20563;
var statearr_20565_20598 = state_20563__$1;
(statearr_20565_20598[(2)] = inst_20559);

(statearr_20565_20598[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (1))){
var inst_20526 = (new Array(n));
var inst_20527 = inst_20526;
var inst_20528 = (0);
var state_20563__$1 = (function (){var statearr_20566 = state_20563;
(statearr_20566[(7)] = inst_20528);

(statearr_20566[(8)] = inst_20527);

return statearr_20566;
})();
var statearr_20567_20599 = state_20563__$1;
(statearr_20567_20599[(2)] = null);

(statearr_20567_20599[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (4))){
var inst_20531 = (state_20563[(9)]);
var inst_20531__$1 = (state_20563[(2)]);
var inst_20532 = (inst_20531__$1 == null);
var inst_20533 = cljs.core.not.call(null,inst_20532);
var state_20563__$1 = (function (){var statearr_20568 = state_20563;
(statearr_20568[(9)] = inst_20531__$1);

return statearr_20568;
})();
if(inst_20533){
var statearr_20569_20600 = state_20563__$1;
(statearr_20569_20600[(1)] = (5));

} else {
var statearr_20570_20601 = state_20563__$1;
(statearr_20570_20601[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (15))){
var inst_20553 = (state_20563[(2)]);
var state_20563__$1 = state_20563;
var statearr_20571_20602 = state_20563__$1;
(statearr_20571_20602[(2)] = inst_20553);

(statearr_20571_20602[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (13))){
var state_20563__$1 = state_20563;
var statearr_20572_20603 = state_20563__$1;
(statearr_20572_20603[(2)] = null);

(statearr_20572_20603[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (6))){
var inst_20528 = (state_20563[(7)]);
var inst_20549 = (inst_20528 > (0));
var state_20563__$1 = state_20563;
if(cljs.core.truth_(inst_20549)){
var statearr_20573_20604 = state_20563__$1;
(statearr_20573_20604[(1)] = (12));

} else {
var statearr_20574_20605 = state_20563__$1;
(statearr_20574_20605[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (3))){
var inst_20561 = (state_20563[(2)]);
var state_20563__$1 = state_20563;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20563__$1,inst_20561);
} else {
if((state_val_20564 === (12))){
var inst_20527 = (state_20563[(8)]);
var inst_20551 = cljs.core.vec.call(null,inst_20527);
var state_20563__$1 = state_20563;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20563__$1,(15),out,inst_20551);
} else {
if((state_val_20564 === (2))){
var state_20563__$1 = state_20563;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20563__$1,(4),ch);
} else {
if((state_val_20564 === (11))){
var inst_20543 = (state_20563[(2)]);
var inst_20544 = (new Array(n));
var inst_20527 = inst_20544;
var inst_20528 = (0);
var state_20563__$1 = (function (){var statearr_20575 = state_20563;
(statearr_20575[(7)] = inst_20528);

(statearr_20575[(10)] = inst_20543);

(statearr_20575[(8)] = inst_20527);

return statearr_20575;
})();
var statearr_20576_20606 = state_20563__$1;
(statearr_20576_20606[(2)] = null);

(statearr_20576_20606[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (9))){
var inst_20527 = (state_20563[(8)]);
var inst_20541 = cljs.core.vec.call(null,inst_20527);
var state_20563__$1 = state_20563;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20563__$1,(11),out,inst_20541);
} else {
if((state_val_20564 === (5))){
var inst_20536 = (state_20563[(11)]);
var inst_20528 = (state_20563[(7)]);
var inst_20531 = (state_20563[(9)]);
var inst_20527 = (state_20563[(8)]);
var inst_20535 = (inst_20527[inst_20528] = inst_20531);
var inst_20536__$1 = (inst_20528 + (1));
var inst_20537 = (inst_20536__$1 < n);
var state_20563__$1 = (function (){var statearr_20577 = state_20563;
(statearr_20577[(11)] = inst_20536__$1);

(statearr_20577[(12)] = inst_20535);

return statearr_20577;
})();
if(cljs.core.truth_(inst_20537)){
var statearr_20578_20607 = state_20563__$1;
(statearr_20578_20607[(1)] = (8));

} else {
var statearr_20579_20608 = state_20563__$1;
(statearr_20579_20608[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (14))){
var inst_20556 = (state_20563[(2)]);
var inst_20557 = cljs.core.async.close_BANG_.call(null,out);
var state_20563__$1 = (function (){var statearr_20581 = state_20563;
(statearr_20581[(13)] = inst_20556);

return statearr_20581;
})();
var statearr_20582_20609 = state_20563__$1;
(statearr_20582_20609[(2)] = inst_20557);

(statearr_20582_20609[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (10))){
var inst_20547 = (state_20563[(2)]);
var state_20563__$1 = state_20563;
var statearr_20583_20610 = state_20563__$1;
(statearr_20583_20610[(2)] = inst_20547);

(statearr_20583_20610[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20564 === (8))){
var inst_20536 = (state_20563[(11)]);
var inst_20527 = (state_20563[(8)]);
var tmp20580 = inst_20527;
var inst_20527__$1 = tmp20580;
var inst_20528 = inst_20536;
var state_20563__$1 = (function (){var statearr_20584 = state_20563;
(statearr_20584[(7)] = inst_20528);

(statearr_20584[(8)] = inst_20527__$1);

return statearr_20584;
})();
var statearr_20585_20611 = state_20563__$1;
(statearr_20585_20611[(2)] = null);

(statearr_20585_20611[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___20597,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20597,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20589 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_20589[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20589[(1)] = (1));

return statearr_20589;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20563){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20563);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20590){if((e20590 instanceof Object)){
var ex__17829__auto__ = e20590;
var statearr_20591_20612 = state_20563;
(statearr_20591_20612[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20563);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20590;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20613 = state_20563;
state_20563 = G__20613;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20563){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20563);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20597,out))
})();
var state__17939__auto__ = (function (){var statearr_20592 = f__17938__auto__.call(null);
(statearr_20592[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20597);

return statearr_20592;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20597,out))
);


return out;
});

cljs.core.async.partition.cljs$lang$maxFixedArity = 3;
/**
 * Deprecated - this function will be removed. Use transducer instead
 */
cljs.core.async.partition_by = (function cljs$core$async$partition_by(var_args){
var args20614 = [];
var len__7291__auto___20688 = arguments.length;
var i__7292__auto___20689 = (0);
while(true){
if((i__7292__auto___20689 < len__7291__auto___20688)){
args20614.push((arguments[i__7292__auto___20689]));

var G__20690 = (i__7292__auto___20689 + (1));
i__7292__auto___20689 = G__20690;
continue;
} else {
}
break;
}

var G__20616 = args20614.length;
switch (G__20616) {
case 2:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error([cljs.core.str("Invalid arity: "),cljs.core.str(args20614.length)].join('')));

}
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$2 = (function (f,ch){
return cljs.core.async.partition_by.call(null,f,ch,null);
});

cljs.core.async.partition_by.cljs$core$IFn$_invoke$arity$3 = (function (f,ch,buf_or_n){
var out = cljs.core.async.chan.call(null,buf_or_n);
var c__17937__auto___20692 = cljs.core.async.chan.call(null,(1));
cljs.core.async.impl.dispatch.run.call(null,((function (c__17937__auto___20692,out){
return (function (){
var f__17938__auto__ = (function (){var switch__17825__auto__ = ((function (c__17937__auto___20692,out){
return (function (state_20658){
var state_val_20659 = (state_20658[(1)]);
if((state_val_20659 === (7))){
var inst_20654 = (state_20658[(2)]);
var state_20658__$1 = state_20658;
var statearr_20660_20693 = state_20658__$1;
(statearr_20660_20693[(2)] = inst_20654);

(statearr_20660_20693[(1)] = (3));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (1))){
var inst_20617 = [];
var inst_20618 = inst_20617;
var inst_20619 = new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123);
var state_20658__$1 = (function (){var statearr_20661 = state_20658;
(statearr_20661[(7)] = inst_20619);

(statearr_20661[(8)] = inst_20618);

return statearr_20661;
})();
var statearr_20662_20694 = state_20658__$1;
(statearr_20662_20694[(2)] = null);

(statearr_20662_20694[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (4))){
var inst_20622 = (state_20658[(9)]);
var inst_20622__$1 = (state_20658[(2)]);
var inst_20623 = (inst_20622__$1 == null);
var inst_20624 = cljs.core.not.call(null,inst_20623);
var state_20658__$1 = (function (){var statearr_20663 = state_20658;
(statearr_20663[(9)] = inst_20622__$1);

return statearr_20663;
})();
if(inst_20624){
var statearr_20664_20695 = state_20658__$1;
(statearr_20664_20695[(1)] = (5));

} else {
var statearr_20665_20696 = state_20658__$1;
(statearr_20665_20696[(1)] = (6));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (15))){
var inst_20648 = (state_20658[(2)]);
var state_20658__$1 = state_20658;
var statearr_20666_20697 = state_20658__$1;
(statearr_20666_20697[(2)] = inst_20648);

(statearr_20666_20697[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (13))){
var state_20658__$1 = state_20658;
var statearr_20667_20698 = state_20658__$1;
(statearr_20667_20698[(2)] = null);

(statearr_20667_20698[(1)] = (14));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (6))){
var inst_20618 = (state_20658[(8)]);
var inst_20643 = inst_20618.length;
var inst_20644 = (inst_20643 > (0));
var state_20658__$1 = state_20658;
if(cljs.core.truth_(inst_20644)){
var statearr_20668_20699 = state_20658__$1;
(statearr_20668_20699[(1)] = (12));

} else {
var statearr_20669_20700 = state_20658__$1;
(statearr_20669_20700[(1)] = (13));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (3))){
var inst_20656 = (state_20658[(2)]);
var state_20658__$1 = state_20658;
return cljs.core.async.impl.ioc_helpers.return_chan.call(null,state_20658__$1,inst_20656);
} else {
if((state_val_20659 === (12))){
var inst_20618 = (state_20658[(8)]);
var inst_20646 = cljs.core.vec.call(null,inst_20618);
var state_20658__$1 = state_20658;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20658__$1,(15),out,inst_20646);
} else {
if((state_val_20659 === (2))){
var state_20658__$1 = state_20658;
return cljs.core.async.impl.ioc_helpers.take_BANG_.call(null,state_20658__$1,(4),ch);
} else {
if((state_val_20659 === (11))){
var inst_20626 = (state_20658[(10)]);
var inst_20622 = (state_20658[(9)]);
var inst_20636 = (state_20658[(2)]);
var inst_20637 = [];
var inst_20638 = inst_20637.push(inst_20622);
var inst_20618 = inst_20637;
var inst_20619 = inst_20626;
var state_20658__$1 = (function (){var statearr_20670 = state_20658;
(statearr_20670[(11)] = inst_20638);

(statearr_20670[(7)] = inst_20619);

(statearr_20670[(12)] = inst_20636);

(statearr_20670[(8)] = inst_20618);

return statearr_20670;
})();
var statearr_20671_20701 = state_20658__$1;
(statearr_20671_20701[(2)] = null);

(statearr_20671_20701[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (9))){
var inst_20618 = (state_20658[(8)]);
var inst_20634 = cljs.core.vec.call(null,inst_20618);
var state_20658__$1 = state_20658;
return cljs.core.async.impl.ioc_helpers.put_BANG_.call(null,state_20658__$1,(11),out,inst_20634);
} else {
if((state_val_20659 === (5))){
var inst_20619 = (state_20658[(7)]);
var inst_20626 = (state_20658[(10)]);
var inst_20622 = (state_20658[(9)]);
var inst_20626__$1 = f.call(null,inst_20622);
var inst_20627 = cljs.core._EQ_.call(null,inst_20626__$1,inst_20619);
var inst_20628 = cljs.core.keyword_identical_QMARK_.call(null,inst_20619,new cljs.core.Keyword("cljs.core.async","nothing","cljs.core.async/nothing",-69252123));
var inst_20629 = (inst_20627) || (inst_20628);
var state_20658__$1 = (function (){var statearr_20672 = state_20658;
(statearr_20672[(10)] = inst_20626__$1);

return statearr_20672;
})();
if(cljs.core.truth_(inst_20629)){
var statearr_20673_20702 = state_20658__$1;
(statearr_20673_20702[(1)] = (8));

} else {
var statearr_20674_20703 = state_20658__$1;
(statearr_20674_20703[(1)] = (9));

}

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (14))){
var inst_20651 = (state_20658[(2)]);
var inst_20652 = cljs.core.async.close_BANG_.call(null,out);
var state_20658__$1 = (function (){var statearr_20676 = state_20658;
(statearr_20676[(13)] = inst_20651);

return statearr_20676;
})();
var statearr_20677_20704 = state_20658__$1;
(statearr_20677_20704[(2)] = inst_20652);

(statearr_20677_20704[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (10))){
var inst_20641 = (state_20658[(2)]);
var state_20658__$1 = state_20658;
var statearr_20678_20705 = state_20658__$1;
(statearr_20678_20705[(2)] = inst_20641);

(statearr_20678_20705[(1)] = (7));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
if((state_val_20659 === (8))){
var inst_20626 = (state_20658[(10)]);
var inst_20622 = (state_20658[(9)]);
var inst_20618 = (state_20658[(8)]);
var inst_20631 = inst_20618.push(inst_20622);
var tmp20675 = inst_20618;
var inst_20618__$1 = tmp20675;
var inst_20619 = inst_20626;
var state_20658__$1 = (function (){var statearr_20679 = state_20658;
(statearr_20679[(14)] = inst_20631);

(statearr_20679[(7)] = inst_20619);

(statearr_20679[(8)] = inst_20618__$1);

return statearr_20679;
})();
var statearr_20680_20706 = state_20658__$1;
(statearr_20680_20706[(2)] = null);

(statearr_20680_20706[(1)] = (2));


return new cljs.core.Keyword(null,"recur","recur",-437573268);
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
});})(c__17937__auto___20692,out))
;
return ((function (switch__17825__auto__,c__17937__auto___20692,out){
return (function() {
var cljs$core$async$state_machine__17826__auto__ = null;
var cljs$core$async$state_machine__17826__auto____0 = (function (){
var statearr_20684 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
(statearr_20684[(0)] = cljs$core$async$state_machine__17826__auto__);

(statearr_20684[(1)] = (1));

return statearr_20684;
});
var cljs$core$async$state_machine__17826__auto____1 = (function (state_20658){
while(true){
var ret_value__17827__auto__ = (function (){try{while(true){
var result__17828__auto__ = switch__17825__auto__.call(null,state_20658);
if(cljs.core.keyword_identical_QMARK_.call(null,result__17828__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
continue;
} else {
return result__17828__auto__;
}
break;
}
}catch (e20685){if((e20685 instanceof Object)){
var ex__17829__auto__ = e20685;
var statearr_20686_20707 = state_20658;
(statearr_20686_20707[(5)] = ex__17829__auto__);


cljs.core.async.impl.ioc_helpers.process_exception.call(null,state_20658);

return new cljs.core.Keyword(null,"recur","recur",-437573268);
} else {
throw e20685;

}
}})();
if(cljs.core.keyword_identical_QMARK_.call(null,ret_value__17827__auto__,new cljs.core.Keyword(null,"recur","recur",-437573268))){
var G__20708 = state_20658;
state_20658 = G__20708;
continue;
} else {
return ret_value__17827__auto__;
}
break;
}
});
cljs$core$async$state_machine__17826__auto__ = function(state_20658){
switch(arguments.length){
case 0:
return cljs$core$async$state_machine__17826__auto____0.call(this);
case 1:
return cljs$core$async$state_machine__17826__auto____1.call(this,state_20658);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$0 = cljs$core$async$state_machine__17826__auto____0;
cljs$core$async$state_machine__17826__auto__.cljs$core$IFn$_invoke$arity$1 = cljs$core$async$state_machine__17826__auto____1;
return cljs$core$async$state_machine__17826__auto__;
})()
;})(switch__17825__auto__,c__17937__auto___20692,out))
})();
var state__17939__auto__ = (function (){var statearr_20687 = f__17938__auto__.call(null);
(statearr_20687[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__17937__auto___20692);

return statearr_20687;
})();
return cljs.core.async.impl.ioc_helpers.run_state_machine_wrapped.call(null,state__17939__auto__);
});})(c__17937__auto___20692,out))
);


return out;
});

cljs.core.async.partition_by.cljs$lang$maxFixedArity = 3;

//# sourceMappingURL=async.js.map?rel=1480936808655