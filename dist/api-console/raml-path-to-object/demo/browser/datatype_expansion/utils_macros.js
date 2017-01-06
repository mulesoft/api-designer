// Compiled by ClojureScript 1.9.14 {}
goog.provide('datatype_expansion.utils_macros');
goog.require('cljs.core');
datatype_expansion.utils_macros.maybe = (function datatype_expansion$utils_macros$maybe(_AMPERSAND_form,_AMPERSAND_env,f){
return cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"try","try",-1273693247,null)),(function (){var x__7050__auto__ = f;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"catch","catch",-1616370245,null)),cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("js","Error","js/Error",-1692659266,null)),cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"e__15981__auto__","e__15981__auto__",783189835,null)),cljs.core._conj.call(null,cljs.core.List.EMPTY,null))));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
});

datatype_expansion.utils_macros.maybe.cljs$lang$macro = true;
datatype_expansion.utils_macros.check = (function datatype_expansion$utils_macros$check(var_args){
var args__7298__auto__ = [];
var len__7291__auto___15988 = arguments.length;
var i__7292__auto___15989 = (0);
while(true){
if((i__7292__auto___15989 < len__7291__auto___15988)){
args__7298__auto__.push((arguments[i__7292__auto___15989]));

var G__15990 = (i__7292__auto___15989 + (1));
i__7292__auto___15989 = G__15990;
continue;
} else {
}
break;
}

var argseq__7299__auto__ = ((((5) < args__7298__auto__.length))?(new cljs.core.IndexedSeq(args__7298__auto__.slice((5)),(0),null)):null);
return datatype_expansion.utils_macros.check.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),argseq__7299__auto__);
});

datatype_expansion.utils_macros.check.cljs$core$IFn$_invoke$arity$variadic = (function (_AMPERSAND_form,_AMPERSAND_env,name,a,b,fs){
return cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"if","if",1181717262,null)),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("cljs.core","and","cljs.core/and",-6692549,null)),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("cljs.core","some?","cljs.core/some?",-440439360,null)),(function (){var x__7050__auto__ = a;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("cljs.core","some?","cljs.core/some?",-440439360,null)),(function (){var x__7050__auto__ = b;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"if","if",1181717262,null)),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"do","do",1686842252,null)),fs)));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),cljs.core._conj.call(null,cljs.core.List.EMPTY,true),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol(null,"throw","throw",595905694,null)),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("js","Error.","js/Error.",750655924,null)),(function (){var x__7050__auto__ = cljs.core.sequence.call(null,cljs.core.seq.call(null,cljs.core.concat.call(null,cljs.core._conj.call(null,cljs.core.List.EMPTY,new cljs.core.Symbol("cljs.core","str","cljs.core/str",-1971828991,null)),cljs.core._conj.call(null,cljs.core.List.EMPTY,"Consistency check failure for property "),(function (){var x__7050__auto__ = name;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),cljs.core._conj.call(null,cljs.core.List.EMPTY," and values ["),(function (){var x__7050__auto__ = a;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),cljs.core._conj.call(null,cljs.core.List.EMPTY," "),(function (){var x__7050__auto__ = b;
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),cljs.core._conj.call(null,cljs.core.List.EMPTY,"]"))));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})())));
return cljs.core._conj.call(null,cljs.core.List.EMPTY,x__7050__auto__);
})(),cljs.core._conj.call(null,cljs.core.List.EMPTY,true))));
});

datatype_expansion.utils_macros.check.cljs$lang$maxFixedArity = (5);

datatype_expansion.utils_macros.check.cljs$lang$applyTo = (function (seq15982){
var G__15983 = cljs.core.first.call(null,seq15982);
var seq15982__$1 = cljs.core.next.call(null,seq15982);
var G__15984 = cljs.core.first.call(null,seq15982__$1);
var seq15982__$2 = cljs.core.next.call(null,seq15982__$1);
var G__15985 = cljs.core.first.call(null,seq15982__$2);
var seq15982__$3 = cljs.core.next.call(null,seq15982__$2);
var G__15986 = cljs.core.first.call(null,seq15982__$3);
var seq15982__$4 = cljs.core.next.call(null,seq15982__$3);
var G__15987 = cljs.core.first.call(null,seq15982__$4);
var seq15982__$5 = cljs.core.next.call(null,seq15982__$4);
return datatype_expansion.utils_macros.check.cljs$core$IFn$_invoke$arity$variadic(G__15983,G__15984,G__15985,G__15986,G__15987,seq15982__$5);
});

datatype_expansion.utils_macros.check.cljs$lang$macro = true;

//# sourceMappingURL=utils_macros.js.map?rel=1480938186427