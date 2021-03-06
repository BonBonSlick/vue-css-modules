"use strict";

exports.__esModule = true;
exports.default = createElement;

var _utils = require("./utils");

var _parseClassExpression2 = _interopRequireDefault(require("./parse-class-expression"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-depth: 0 guard-for-in: 0 */
// eslint-disable-next-line
function createElement(_) {
  var args = [].slice.call(arguments, 1); // for functional component
  if ((0, _utils.isFunction)(_)) {
    return createElement.bind(_, {
      functional: true,
      createElement: _,
      styles: args[0],
      context: args[1],
    });
  }

  var _$functional = _.functional,
      functional = _$functional === void 0 ? false : _$functional,
      h = _.createElement,
      _$context = _.context,
      context = _$context === void 0 ? {} : _$context,
      _$styles = _.styles,
      mergeDefault = _.mergeDefault,
      styles = _$styles === void 0 ? context.$style || {}
          : mergeDefault ? Object.assign({}, _$styles, context.$style)
          : _$styles;

  if ((0, _utils.isString)(styles)) {
    styles = (functional ? (context.injections || {})[styles] : context[styles]) || {};
  }

  if (functional) {
    context = context.props || {};
  }

  var data = args[1];

  if ((0, _utils.isObject)(data)) {
    if (!data.staticClass) {
      data.staticClass = '';
    }

    if (!data.attrs) {
      data.attrs = {};
    }

    var injectAttr = _.injectAttr || _config.INJECT_ATTR;
    if(injectAttr === 'class') {
      var expression = data[injectAttr] || '',
          extracted = '';
      if((0, _utils.isObject)(expression)) {
        if(expression instanceof Array) {
          extracted = extracted + ' ' + expression.join(' ');
        }else{
          extracted = extracted + ' ' + Object.keys(expression).filter(function(k) {return !!expression[k];}).join(' ');
        }
      }else if((0, _utils.isString)(expression)) {
        extracted = extracted + ' ' + expression;
      }

      // concat with staticClass
      data[injectAttr] = data.staticClass + ' ' + (extracted || '');
    }

    var modules = data[injectAttr] || data.attrs[injectAttr] || '';

    if (modules.length) {
      var _modules = Array.isArray(modules) ? modules : [modules];

      for (var i in _modules) {
        var module = _modules[i];

        if (module && typeof module === 'string') {
          var classExpressions = module.split(/\s+/g);

          for (var _i in classExpressions) {
            var classExpression = classExpressions[_i];

            var _parseClassExpression = (0, _parseClassExpression2.default)(classExpression),
                className = _parseClassExpression.className,
                binding = _parseClassExpression.binding,
                bindingValue = _parseClassExpression.bindingValue,
                role = _parseClassExpression.role;

            if (bindingValue) {
              className = context[binding];
              binding = undefined;
            }

            var hit = (binding ? context[binding] : true) && styles[className] ? styles[className] : className;
            if(['staticClass', 'class'].indexOf(injectAttr) >= 0) {
              var targetRegex = new RegExp('(^|\\s+)' + className + '(\\s+|$)');
              if(targetRegex.test(data.staticClass)) {
                data.staticClass = data.staticClass.replace(targetRegex, '$1' + hit + '$2');
              }else{
                data.staticClass += " " + hit;
              }
            }else{
              data.staticClass += " " + hit;
            }
            data.staticClass = data.staticClass.trim();

            if (role) {
              data.attrs["data-component-" + role] = '';
            }
          }
        }
      }
    } // remove styleName attr

    if(injectAttr !== 'staticClass') {
      delete data[injectAttr];
      delete data.attrs[injectAttr];
    }
  }

  return h.apply(null, args);
}
