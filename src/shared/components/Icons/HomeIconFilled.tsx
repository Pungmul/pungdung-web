import * as React from "react";

import { IconProps } from "../../types/type";

function HomeIconFilled({
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
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.94907 10.4744C4.35913 10.8388 4 11.4827 4 12.1761V25.999C4 27.1035 4.89543 27.999 6 27.999H13.3333V23.3608C13.3333 21.888 14.5272 20.6941 16 20.6941C17.4728 20.6941 18.6667 21.888 18.6667 23.3608V27.999H26C27.1046 27.999 28 27.1035 28 25.999V12.1761C28 11.4827 27.6409 10.8388 27.0509 10.4744L17.0509 4.29837C16.4068 3.90054 15.5932 3.90054 14.9491 4.29837L4.94907 10.4744Z",
    fill: "currentColor"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(HomeIconFilled);
export default React.memo(ForwardRef);
