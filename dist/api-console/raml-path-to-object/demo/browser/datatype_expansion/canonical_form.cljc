(ns datatype-expansion.canonical-form
  #?(:cljs (:require-macros [datatype-expansion.utils-macros :refer [check]]))
  (:require #?(:clj [datatype-expansion.utils-macros-clj :refer [check]])
            [clojure.string :as string]
            [clojure.set :as set]
            [datatype-expansion.utils :refer [error]]))

(declare canonical-form)

(def atomic-types #{"any" "boolean" "datetime" "datetime-only" "date-only" "time-only"
                    "number" "integer" "string" "nil" "file"
                    "xml" "json"})

(defn union? [type] (= "union" (get type :type)))
(defn any? [type] (= "any" (get type :type)))
(defn number-type? [type] (= "number" (get type :type)))
(defn integer-type? [type] (= "integer" (get type :type)))


(defmulti lt-restriction (fn [restriction super sub] restriction))

(defmethod lt-restriction :minProperties [_ super sub] (if (>= sub super)
                                                         (max super sub)
                                                         (error "sub type has a weaker constraint for min-properties than base type")))
(defmethod lt-restriction :maxProperties [_ super sub] (if (<= sub super)
                                                         (min super sub)
                                                         (error "sub type has a weaker constraint for max-properties than base type")))
(defmethod lt-restriction :required [_ super sub] (if (true? super)
                                                    (if (= super sub)
                                                      (= super sub)
                                                      (error "Error in required property, making optional base class required property"))
                                                    (or super sub)))
(defmethod lt-restriction :discriminator [_ super sub]
  (let [values (filter some? [super sub])]
    (condp (count values) =
      0 nil
      1 (first values)
      2 (if (= super sub) super (error (str "Different values for discriminator constraint" [ super sub ]))))))
(defmethod lt-restriction :discriminatorValue [_ super sub]
  (let [values (filter some? [super sub])]
    (condp (count values) =
      0 nil
      1 (first values)
      2 (if (= super sub) super (error (str "Different values for discriminator-value constraint" [ super sub ]))))))
(defmethod lt-restriction :minLength [_ super sub] (if (>= sub super)
                                                     (max super sub)
                                                     (error "sub type has a weaker constraint for min-length than base type")))
(defmethod lt-restriction :maxLength [_ super sub] (if (<= sub super)
                                                     (min super sub)
                                                     (error "sub type has a weaker constraint for max-length than base type")))
(defmethod lt-restriction :minimum [_ super sub] (if (>= sub super)
                                                   (max super sub)
                                                   (error "sub type has a weaker constraint for minimum than base type")))
(defmethod lt-restriction :maximum [_ super sub] (if (<= sub super)
                                                   (min super sub)
                                                   (error "sub type has a weaker constraint for maximum than base type")))
(defmethod lt-restriction :format [_ super sub]
  (let [values (filter some? [super sub])]
    (condp (count values) =
      0 nil
      1 (first values)
      2 (if (= super sub) super (error (str "Different values for format constraint" [ super sub ]))))))
(defmethod lt-restriction :pattern [_ super sub]
  (let [values (filter some? [super sub])]
    (condp (count values) =
      0 nil
      1 (first values)
      2 (if (= super sub) super (error (str "Different values for pattern constraint" [ super sub ]))))))
(defmethod lt-restriction :uniqueItems [_ super sub] (if (or (false? super) (= super sub))
                                                       (and super sub)
                                                       (error "sub type has a weaker constraint for unique-items than base type")))
(defmethod lt-restriction :minItems [_ super sub] (if (>= sub super)
                                                    (max super sub)
                                                    (error "sub type has a weaker constraint for min-items than base type")))
(defmethod lt-restriction :maxItems [_ super sub] (if (<= sub super)
                                                    (min super sub)
                                                    (error "sub type has a weaker constraint for max-items than base type")))
(defmethod lt-restriction :enum [_ super sub]
  (if (set/subset? (into #{} sub) (into #{} super))
    (set/intersection (into #{} super) (into #{} sub))
    (error "sub type has a weaker constraint for enum-values than base type")))
(defmethod lt-restriction :additionalProperties [_ super sub]
  (if (or (true? super) (= super sub))
    (and super sub)
    (error "sub type has a weaker constraint for additional-properties than base type")))
(defmethod lt-restriction :type [_ super sub]
  (cond
    (or (= super "union")
        (= sub "union"))    "union"
    (= super sub)           super
    :else                   (error (str "Cannot compute min value of different sub types"))))

(defmethod lt-restriction :default [_ super sub]
  (or sub super))

(defn lt-restrictions [super sub]
  (loop [merged {}
         properties (into #{} (concat (keys super) (keys sub)))]
    (if (empty? properties)
      merged
      (let [property (first properties)
            property-super (get super property)
            property-sub  (get sub property)]
        (if (or (nil? property-super) (nil? property-sub))
          (recur (assoc merged property (or property-super property-sub))
                 (rest properties))
          (recur (assoc merged property (lt-restriction property property-super property-sub))
                 (rest properties)))))))


(def consistency-checks {:numProperties (fn [{:keys [minProperties maxProperties]}]
                                          (check :numProperties minProperties maxProperties
                                                 (<= minProperties maxProperties)))
                         :length         (fn [{:keys [minLength maxLength]}]
                                           (check :length minLength maxLength
                                                  (<= minLength maxLength)))
                         :size           (fn [{:keys [minimum maximum]}]
                                           (check :size minimum maximum
                                                  (<= minimum maximum)))
                         :numItems      (fn [{:keys [minItems maxItems]}]
                                          (check :numItems minItems maxItems
                                                 (<= minItems maxItems)))})
(defn consistency-check [merged]
  (doseq [[name check-fn] consistency-checks]
    (check-fn merged))
  merged)

(defn lt-dispatch-fn [super sub]
  (cond
    (and (any? super) (not (any? sub)))     ["any" :other]
    (and (not (any? super)) (any? sub))     [:other "any"]
    (and (union? super) (not (union? sub))) ["union" :other]
    (and (not (union? super)) (union? sub)) [:other "union"]
    :else [(:type super) (:type sub)]))

(defmulti lt (fn [super sub] (lt-dispatch-fn super sub)))

;; scalar types
(defmethod lt ["any" "any"] [super sub] (->> (lt-restrictions super sub)
                                             (consistency-check)))
(defmethod lt ["any" :other] [super sub] (->> (lt-restrictions (assoc super :type (get sub :type))
                                                               sub)
                                              (consistency-check)))
(defmethod lt [ :other "any"] [super sub] (->> (lt-restrictions super
                                                                (assoc sub :type (get super :type)))
                                               consistency-check))
(defmethod lt ["boolean" "boolean"] [super sub] (->> (lt-restrictions super sub)
                                                     (consistency-check)))
(defmethod lt ["datetime" "datetime"] [super sub] (->> (lt-restrictions super sub)
                                                       (consistency-check)))
(defmethod lt ["datetime-only" "datetime-only"] [super sub] (->> (lt-restrictions super sub)
                                                                 (consistency-check)))

(defmethod lt ["date-only" "date-only"] [super sub] (->> (lt-restrictions super sub)
                                                         (consistency-check)))

(defmethod lt ["number" "number"] [super sub] (->> (lt-restrictions super sub)
                                                   (consistency-check)))
(defmethod lt ["integer" "integer"] [super sub] (->> (lt-restrictions super sub)
                                                     (consistency-check)))
(defmethod lt ["number" "integer"] [super sub] (->> (lt-restrictions (assoc super :type "integer")
                                                                     (assoc sub :type "integer"))
                                                    (consistency-check)))
(defmethod lt ["string" "string"] [super sub] (->> (lt-restrictions super sub)
                                                   (consistency-check)))
(defmethod lt ["nil" "nil"] [super sub] (->> (lt-restrictions super sub)
                                             (consistency-check)))
(defmethod lt ["file" "file"] [super sub] (->> (lt-restrictions super sub)
                                               (consistency-check)))

(defmethod lt ["json" "json"] [super sub] (->> (lt-restrictions super sub)
                                               (consistency-check)))

(defmethod lt ["xml" "xml"] [super sub] (->> (lt-restrictions super sub)
                                             (consistency-check)))

(defmethod lt ["array" "array"] [super sub] (let [merged-items (canonical-form (assoc (:items sub) :type (:items super)))
                                                  merged (lt-restrictions (dissoc super :items) (dissoc sub :items))
                                                  merged (consistency-check merged)]
                                              (assoc merged :items merged-items)))

;;A sub-type can override properties of its parent type with the following restrictions:
;;  1) a required property in the parent type cannot be changed to optional in the sub-type, and
;;  2) the type declaration of a defined property in the parent type can only be changed to a narrower type (a specialization of the parent type) in the sub-type.
(defmethod lt ["object" "object"] [super sub] (let [props-super (:properties super)
                                                    props-super-names (into #{} (keys props-super))
                                                    props-sub (:properties sub)
                                                    props-sub-names (into #{} (keys props-sub))
                                                    common-props-names (set/intersection props-super-names props-sub-names)
                                                    merged (lt-restrictions (dissoc super :properties) (dissoc sub :properties))
                                                    merged (consistency-check merged)
                                                    common-props (->> common-props-names
                                                                      (mapv (fn [prop-name]
                                                                              [prop-name (lt (get props-super prop-name)
                                                                                             (get props-sub prop-name))]))
                                                                      (into {}))
                                                    props-exclusive-super (->> (set/difference props-super-names common-props-names)
                                                                               (mapv (fn [prop-name]
                                                                                       [prop-name (get props-super prop-name)]))
                                                                               (into {}))
                                                    props-exclusive-sub (->> (set/difference props-sub-names common-props-names)
                                                                             (mapv (fn [prop-name] [prop-name (get props-sub prop-name)]))
                                                                             (into {}))
                                                    merged-properties (merge props-exclusive-super common-props props-exclusive-sub)]
                                                (assoc merged :properties merged-properties)))

(defmethod lt ["union" "union"] [super sub]
  (let [of-super (:anyOf super)
        of-sub (:anyOf sub)
        of-merged (if (empty? of-sub)
                    of-super
                    (if (empty? of-super)
                      of-sub
                      (->> of-sub
                           (map (fn [of-sub-type]
                                  (map (fn [of-super-type]
                                         (lt of-super-type of-sub-type))
                                       of-super)))
                           flatten
                           )))
        merged (lt-restrictions (dissoc super :anyOf) (dissoc sub :anyOf))]
    (assoc merged :anyOf of-merged)))


(defmethod lt ["union" :other] [super sub]
  (let [of-super (:anyOf super)
        of-merged (map (fn [of-super-type]
                         (lt of-super-type sub))
                       of-super)
        merged (lt-restrictions (dissoc super :anyOf)
                                (-> sub
                                    (dissoc :items)
                                    (dissoc :properties)))]
    (assoc merged :anyOf of-merged)))

(defmethod lt [:other "union"] [super sub]
  (let [of-sub (:anyOf sub)
        of-merged (map (fn [of-sub-type]
                         (lt of-sub-type super))
                       of-sub)
        merged (lt-restrictions (-> super
                                    (dissoc :items)
                                    (dissoc :properties)
                                    (dissoc :anyOf))
                                (-> sub
                                    (dissoc :items)
                                    (dissoc :properties)
                                    (dissoc :anyOf)))]
    (assoc merged :anyOf of-merged)))

(defmethod lt :default [super sub]
  (throw (Exception. (str "Invalid inheriance " (:type super) " -> " (:type sub)))))

(defn dispatch-node [input]
  (let [{:keys [type]} input]
    (cond
      (map? type) :inheritance
      (coll? type) :multiple-inheritance
      (get atomic-types type) :atomic
      :else type)))

(defmulti canonical-form (fn [node] (dispatch-node node)))

(defmethod canonical-form :atomic [node] (consistency-check node))

(defmethod canonical-form "array" [node]
  (let [canonical-items (canonical-form (:items node))
        node (consistency-check node)]
    (if (union? canonical-items)
      (let [of (map (fn [value] (assoc node :items value)) (:anyOf canonical-items))]
        (assoc canonical-items :anyOf of))
      (assoc node :items canonical-items))))

(defn append-property [accum property-name property-value]
  (map (fn [type]
         (let [properties (:properties type)
               properties (assoc properties property-name property-value)]
           (assoc type :properties properties)))
       accum))

(defn expand-property [accum property-name property-value]
  (->> accum
       (mapv (fn [type]
               (let [properties (:properties type)
                     required (:required property-value)
                     union-values (:anyOf property-value)]
                 (->> union-values
                      (mapv #(assoc % :required required))
                      (mapv #(assoc properties property-name %))
                      (mapv #(assoc type :properties %))))))
       flatten))

(defn make-union-from-object-expansion [of-values node]
  (-> node
      (dissoc :properties)
      (assoc :type "union")
      (assoc :anyOf of-values)))

(defmethod canonical-form "object" [node]
  (let [properties (:properties node)
        properties (->> properties
                        (mapv (fn [[property-name property-value]]
                                (if (and (string/ends-with? property-name "?")
                                         (nil? (:required property-value)))
                                  (let [property-name (string/replace property-name "?" "")
                                        property-value (assoc property-value :required false)]
                                    [property-name property-value])
                                  [property-name property-value])))
                        (into {}))
        accum [(assoc node :properties {})]]
    (loop [properties properties
           accum accum]
      (if (empty? properties)
        (consistency-check
         (if (= 1 (count accum))
           (first accum)
           (make-union-from-object-expansion accum node)))
        (let [[name value] (first properties)
              canonical-value (canonical-form value)]
          (if (union? canonical-value)
            (recur (rest properties)
                   (expand-property accum name canonical-value))
            (recur (rest properties)
                   (append-property accum name canonical-value))))))))

(defn find-class [node]
  (cond
    (some? (:properties node)) "object"
    (some? (:items node)) "array"
    (string? (:type node)) (:type node)
    (map? (:type node))    (find-class (:type node))
    (coll? (:type node))   (let [type (->> (:type node)
                                           (map #(try (find-class %)
                                                      (catch #?(:clj Exception :cljs js/Error) ex nil)))
                                           (filter some?)
                                           first)]
                             (if (nil? type)
                               (error "Cannot find top level class for node, not in expanded form")
                               type))
    :else                  (error "Cannot find top level class for node, not in expanded form")))

(defmethod canonical-form :inheritance [node]
  (let [super-type-class (find-class node)
        super-type (canonical-form (:type node))
        sub-type (assoc node :type super-type-class)
        sub-type (condp = super-type-class
                   "array" (assoc sub-type :items (get sub-type :items {:type "any"}))
                   "object" (assoc sub-type :properties (get sub-type :properties {}))
                   "union"   (assoc sub-type :anyOf (get sub-type :anyOf []))
                   sub-type)
        sub-type (canonical-form sub-type)]
    (consistency-check (lt super-type sub-type))))


(defmethod canonical-form :multiple-inheritance [node]
  (let [super-type-class (find-class node)
        sub-type (assoc node :type super-type-class)
        sub-type (condp = super-type-class
                   "array" (assoc sub-type :items (get sub-type :items {:type "any"}))
                   "object" (assoc sub-type :properties (get sub-type :properties []))
                   "union"   (assoc sub-type :anyOf (get sub-type :anyOf []))
                   sub-type)]
    (let [final-canonical-form (canonical-form (consistency-check
                                                (reduce (fn [acc super-type]
                                                          (let [computed (lt (canonical-form super-type) acc)]
                                                            computed))
                                                        sub-type
                                                        (:type node))))]
      final-canonical-form)))


(defmethod canonical-form "union" [node]
  (assoc node
         :anyOf (->> (:anyOf node)
                     (map canonical-form)
                     flatten
                     (map (fn [canonical-type]
                            (if (union? canonical-type)
                              (:anyOf canonical-type)
                              canonical-type)))
                     distinct
                     flatten)))
