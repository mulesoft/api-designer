(ns datatype-expansion.utils)

#?(:cljs (enable-console-print!))

(defn trace [x] (println "--- trace: " x) x)

(defn clear-nils [m] (into {} (filter (fn [[k v]] (-> v nil? not)) m)))

(defn clear-node
  ([node]
   (cond
     (map? node) (->> (map
                       (fn [[k v]]
                         (if (or (= k :content) (= k :description))
                           ;;[k (str (.substring (str v) 0 5) "...")]
                           [k v]
                           [k (clear-node v)]))
                       (clear-nils node))
                      (into {}))
     (coll? node) (into [] (map (fn [v] (clear-node v)) node))

     :else node)))

(defn error [e]
  #?(:clj (throw (Exception. e))
     :cljs (throw (js/Error. e))))

(defn get* [m k d]
  (or (cond
        (keyword? k) (or (get m k)
                         (get m (name k)))
        :else (or (get m k) (get m (keyword k))))
      d))
