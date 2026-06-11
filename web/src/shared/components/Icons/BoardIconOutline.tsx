import * as React from "react";

import { IconProps } from "../../types/type";

function BoardIconOutline({
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
    x: "9.99944",
    y: "4",
    width: "16",
    height: "20",
    rx: "4",
    strokeWidth: "2.5",
    className: "stroke-grey-800"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "8",
    width: "16",
    height: "20",
    rx: "4",
    className: "fill-background stroke-grey-800",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 18H16",
    className: "stroke-grey-800",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 14H16",
    className: "stroke-grey-800",
    strokeWidth: "2",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 22H11.7556",
    className: "stroke-grey-800",
    strokeWidth: "2",
    strokeLinecap: "round"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(BoardIconOutline);
export default React.memo(ForwardRef);
