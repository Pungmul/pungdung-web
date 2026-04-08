import * as React from "react";

import { IconProps } from "../../types/type";

function BoardIconFilled({
  title,
  titleId,
  ...props
}: IconProps, svgRef: React.Ref<SVGSVGElement>) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "4",
    width: "16",
    height: "20",
    rx: "4",
    strokeWidth: "2.5",
    className: "fill-current stroke-current"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6.99997",
    y: "7",
    width: "16",
    height: "20",
    rx: "4",
    strokeWidth: "2.5",
    className: "fill-background stroke-background"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "8",
    width: "16",
    height: "20",
    rx: "4",
    strokeWidth: "2.5",
    className: "fill-current stroke-current"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 18H17",
    strokeWidth: "2",
    strokeLinecap: "round",
    className: "stroke-background"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 14H17",
    strokeWidth: "2",
    strokeLinecap: "round",
    className: "stroke-background"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 22H12.7556",
    strokeWidth: "2",
    strokeLinecap: "round",
    className: "stroke-background"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(BoardIconFilled);
export default React.memo(ForwardRef);
