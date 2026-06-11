import React from "react";

import { IconProps } from "../../types/type";

function CheckBoxOutline({
  title,
  titleId,
  ...props
}: IconProps, svgRef: React.Ref<SVGSVGElement>) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("rect", {
    x: "2.75",
    y: "2.75",
    width: "18.5",
    height: "18.5",
    rx: "1.25",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    x: "16",
    y: "9",
    d: "M16 9L10.5 15L8 12.2727",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(CheckBoxOutline);
export default React.memo(ForwardRef);

{/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2.75" y="2.75" width="18.5" height="18.5" rx="1.25" stroke="#A4A6AA" stroke-width="1.5"/>
<path d="M16 9L10.5 15L8 12.2727" stroke="#A4A6AA" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg> */}