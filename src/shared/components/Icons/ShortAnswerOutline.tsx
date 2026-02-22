import * as React from "react";
import { IconProps } from "../../types/type";

function ShortAnswerOutline({
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
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M2 8.42857C2 8.04969 2.15051 7.68633 2.41842 7.41842C2.68633 7.15051 3.04969 7 3.42857 7H20.5714C20.9503 7 21.3137 7.15051 21.5816 7.41842C21.8495 7.68633 22 8.04969 22 8.42857C22 8.80745 21.8495 9.17081 21.5816 9.43872C21.3137 9.70663 20.9503 9.85714 20.5714 9.85714H3.42857C3.04969 9.85714 2.68633 9.70663 2.41842 9.43872C2.15051 9.17081 2 8.80745 2 8.42857ZM2 15.5714C2 15.1925 2.15051 14.8292 2.41842 14.5613C2.68633 14.2934 3.04969 14.1429 3.42857 14.1429H12C12.3789 14.1429 12.7422 14.2934 13.0102 14.5613C13.2781 14.8292 13.4286 15.1925 13.4286 15.5714C13.4286 15.9503 13.2781 16.3137 13.0102 16.5816C12.7422 16.8495 12.3789 17 12 17H3.42857C3.04969 17 2.68633 16.8495 2.41842 16.5816C2.15051 16.3137 2 15.9503 2 15.5714Z",
    fill: "currentColor"
  }));
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(ShortAnswerOutline);
export default React.memo(ForwardRef);