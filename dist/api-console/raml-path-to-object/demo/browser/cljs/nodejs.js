// Compiled by ClojureScript 1.9.14 {}
goog.provide('cljs.nodejs');
goog.require('cljs.core');
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.nodejs.enable_util_print_BANG_ = (function cljs$nodejs$enable_util_print_BANG_(){
cljs.core._STAR_print_newline_STAR_ = false;

cljs.core._STAR_print_fn_STAR_ = (function() { 
var G__16880__delegate = function (args){
return console.log.apply(console,cljs.core.into_array.call(null,args));
};
var G__16880 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__16881__i = 0, G__16881__a = new Array(arguments.length -  0);
while (G__16881__i < G__16881__a.length) {G__16881__a[G__16881__i] = arguments[G__16881__i + 0]; ++G__16881__i;}
  args = new cljs.core.IndexedSeq(G__16881__a,0);
} 
return G__16880__delegate.call(this,args);};
G__16880.cljs$lang$maxFixedArity = 0;
G__16880.cljs$lang$applyTo = (function (arglist__16882){
var args = cljs.core.seq(arglist__16882);
return G__16880__delegate(args);
});
G__16880.cljs$core$IFn$_invoke$arity$variadic = G__16880__delegate;
return G__16880;
})()
;

cljs.core._STAR_print_err_fn_STAR_ = (function() { 
var G__16883__delegate = function (args){
return console.error.apply(console,cljs.core.into_array.call(null,args));
};
var G__16883 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__16884__i = 0, G__16884__a = new Array(arguments.length -  0);
while (G__16884__i < G__16884__a.length) {G__16884__a[G__16884__i] = arguments[G__16884__i + 0]; ++G__16884__i;}
  args = new cljs.core.IndexedSeq(G__16884__a,0);
} 
return G__16883__delegate.call(this,args);};
G__16883.cljs$lang$maxFixedArity = 0;
G__16883.cljs$lang$applyTo = (function (arglist__16885){
var args = cljs.core.seq(arglist__16885);
return G__16883__delegate(args);
});
G__16883.cljs$core$IFn$_invoke$arity$variadic = G__16883__delegate;
return G__16883;
})()
;

return null;
});

//# sourceMappingURL=nodejs.js.map?rel=1480936806407