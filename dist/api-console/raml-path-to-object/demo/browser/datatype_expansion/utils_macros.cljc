(ns datatype-expansion.utils-macros)

(defmacro maybe [f]
  `(try ~f (catch js/Error e# nil)))

(defmacro check [name a b & fs]
  `(if (and (some? ~a) (some? ~b))
     (if (do ~@fs)
       true
       (throw (js/Error. (str "Consistency check failure for property " ~name " and values [" ~a " " ~b "]"))))
     true))
