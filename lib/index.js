"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createElement = _interopRequireDefault(require("./create-element"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint camelcase: 0 */
var CSSModules = function CSSModules({injectAttr, styles}) {
  return {
    beforeCreate: function beforeCreate() {
      this.original$createElement = this.original$createElement || this.$createElement;
      this.original_c = this.original_c || this._c;
      this.$createElement = _createElement.default.bind(this, {
        createElement: this.original$createElement,
        context: this,
        styles: styles,
        injectAttr
      });
      this._c = _createElement.default.bind(this, {
        createElement: this.original_c,
        context: this,
        styles: styles,
        injectAttr
      });
    }
  };
};

CSSModules.install = function (Vue, options) {
  Vue.mixin(CSSModules(options));
};

var _default = CSSModules;
exports.default = _default;