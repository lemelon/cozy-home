// Generated by CoffeeScript 1.10.0
var Instance, LOCALE_PATH, LocalizationManager, Polyglot, fs, path;

fs = require('fs');

Polyglot = require('node-polyglot');

Instance = require('../models/cozyinstance');

path = require('path');

LOCALE_PATH = path.resolve(__dirname, '../locales');

LocalizationManager = (function() {
  function LocalizationManager() {}

  LocalizationManager.prototype.polyglot = null;

  LocalizationManager.prototype.defaultPolyglot = null;

  LocalizationManager.prototype.initialize = function(callback) {
    return this.retrieveLocale((function(_this) {
      return function(err, locale) {
        if (err != null) {
          return callback(err);
        } else {
          _this.polyglot = _this.getPolyglotByLocale(locale);
          return callback(null, _this.polyglot);
        }
      };
    })(this));
  };

  LocalizationManager.prototype.retrieveLocale = function(callback) {
    return Instance.getLocale(function(err, locale) {
      if ((err != null) || !locale) {
        locale = 'en';
      }
      return callback(err, locale);
    });
  };

  LocalizationManager.prototype.getPolyglotByLocale = function(locale) {
    var defaultPhrases, err, error, phrases;
    defaultPhrases = require(LOCALE_PATH + "/en");
    try {
      phrases = require(LOCALE_PATH + "/" + locale);
    } catch (error) {
      err = error;
      phrases = defaultPhrases;
    }
    this.defaultPolyglot = new Polyglot({
      locale: 'en',
      phrases: defaultPhrases
    });
    return new Polyglot({
      locale: locale,
      phrases: phrases
    });
  };

  LocalizationManager.prototype.t = function(key, params) {
    var ref, ref1;
    if (params == null) {
      params = {};
    }
    if (params._ == null) {
      params._ = (ref = this.defaultPolyglot) != null ? ref.t(key, params) : void 0;
    }
    return ((ref1 = this.polyglot) != null ? ref1.t(key, params) : void 0) || key;
  };

  LocalizationManager.prototype.getPolyglot = function() {
    return this.polyglot;
  };

  return LocalizationManager;

})();

module.exports = new LocalizationManager();
