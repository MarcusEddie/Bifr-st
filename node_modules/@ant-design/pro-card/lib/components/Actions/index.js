"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProCardActions = function ProCardActions(props) {
  var actions = props.actions,
      prefixCls = props.prefixCls;
  return actions && actions.length ? /*#__PURE__*/_react.default.createElement("ul", {
    className: "".concat(prefixCls, "-actions")
  }, actions.map(function (action, index) {
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/no-array-index-key
      _react.default.createElement("li", {
        style: {
          width: "".concat(100 / actions.length, "%")
        },
        key: "action-".concat(index)
      }, /*#__PURE__*/_react.default.createElement("span", null, action))
    );
  })) : null;
};

var _default = ProCardActions;
exports.default = _default;