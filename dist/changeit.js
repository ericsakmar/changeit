(function() {
  window.addEventListener('scroll', function(e) {
    var c, y, _i, _len, _ref, _results;
    y = window.pageYOffset;
    _ref = this.changes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push(c.applyIt(y));
    }
    return _results;
  }, false);

  this.changes = [];

  this.between = function(start) {
    var c;
    c = new Changer(start);
    this.changes.push(c);
    return c;
  };

  this.Changer = (function() {
    function Changer(start) {
      this.start = start;
      this;
    }

    Changer.prototype.and = function(end) {
      this.end = end;
      return this;
    };

    Changer.prototype.change = function(property) {
      this.property = property;
      return this;
    };

    Changer.prototype.on = function(elSelector) {
      this.elSelector = elSelector;
      this.el = document.querySelector(elSelector);
      return this;
    };

    Changer.prototype.from = function(fromRaw) {
      this.fromRaw = fromRaw;
      this.from = this.parseProperty(this.fromRaw);
      return this;
    };

    Changer.prototype.to = function(toRaw) {
      this.toRaw = toRaw;
      this.to = this.parseProperty(this.toRaw);
      return this;
    };

    Changer.prototype.parseProperty = function(property) {
      var match;
      if (property.match(/[\d\.]+[\w\%]+/)) {
        match = /([\d\.]+)([\w\%]+)/.exec(property);
        return {
          value: parseFloat(match[1]),
          unit: match[2]
        };
      }
    };

    Changer.prototype.applyIt = function(position) {
      var css;
      css = this.parseCssText(this.el.style.cssText);
      if (position >= this.start && position <= this.end) {
        css[this.property] = this.calculate(position);
      } else if (position < this.start) {
        css[this.property] = this.fromRaw;
      } else if (position > this.end) {
        css[this.property] = this.toRaw;
      }
      return this.el.style.cssText = this.toCssText(css);
    };

    Changer.prototype.toPercent = function(position) {
      return (position - this.start) / (this.end - this.start);
    };

    Changer.prototype.calculate = function(position) {
      return (((this.to.value - this.from.value) * this.toPercent(position)) + this.from.value) + this.to.unit;
    };

    Changer.prototype.parseCssText = function(css) {
      var parsed, parsedProperty, properties, property, _i, _len;
      properties = css.split(/\s*;\s*/);
      parsed = {};
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        property = properties[_i];
        parsedProperty = this.parseCssProperty(property);
        parsed[parsedProperty[0]] = parsedProperty[1];
      }
      return parsed;
    };

    Changer.prototype.parseCssProperty = function(css) {
      var trimmed;
      trimmed = css.replace(/^\s*|\s*$/g, '');
      return trimmed.split(/\s*:\s*/);
    };

    Changer.prototype.toCssText = function(css) {
      var cssText, key, value;
      cssText = '';
      for (key in css) {
        value = css[key];
        cssText = cssText + ("" + key + ":" + value + ";");
      }
      return cssText;
    };

    return Changer;

  })();

}).call(this);
