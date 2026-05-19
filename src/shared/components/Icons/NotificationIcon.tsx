import * as React from "react";

import { IconProps } from "../../types/type";

function NotificationIcon({
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
    d: "M8 12C8 7.58172 11.5817 4 16 4C20.4183 4 24 7.58172 24 12V21H26V24H24H8H6V21H8V12ZM13 25C13 26.6569 14.3431 28 16 28C17.6569 28 19 26.6569 19 25H13Z",
    fill: "currentColor"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(NotificationIcon);
export default React.memo(ForwardRef);
