(ns datatype-expansion.js
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [datatype-expansion.expanded-form :as expanded]
            [datatype-expansion.canonical-form :as canonical]
            [cljs.core.async  :refer [<!]]
            [clojure.walk :refer [keywordize-keys]]))

(enable-console-print!)

(defn ^:export expandedForm [type-form typing-context cb]
  (try
    (let [type-form (-> type-form js->clj keywordize-keys)
          typing-context (-> typing-context
                             js->clj
                             (->> (map (fn [[k v]] [k (keywordize-keys v)]))
                                  (into {})))
          result (expanded/expanded-form (js->clj type-form) (js->clj typing-context))
          result (clj->js result)]
      (when (some? cb) (cb nil result))
      result)
    (catch js/Error error
      (if (some? cb)
        (cb error nil)
        (throw error)))))

(defn ^:export canonicalForm [expanded-form cb]
  (try
    (let [expanded-form (-> expanded-form js->clj keywordize-keys)
          result (canonical/canonical-form expanded-form)
          result (clj->js result)]
      (when (some? cb) (cb nil result))
      result)
    (catch js/Error error
      (if (some? cb)
        (cb error nil)
        (throw error)))))

(defn -registerInterface [] nil)

(set! *main-cli-fn* -registerInterface)
