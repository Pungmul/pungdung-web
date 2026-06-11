import * as React from "react";

import { IconProps } from "../../types/type";

function KakaoLogo(
  { ...props }: IconProps,
  svgRef: React.Ref<SVGSVGElement>
) {
  return /*#__PURE__*/ React.createElement(
    "svg",
    Object.assign(
      {
        width: "36",
        height: "36",
        viewBox: "0 0 36 36",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ref: svgRef,
        "aria-labelledby": "kakao-logo",
      },
      props
    ),
    /*#__PURE__*/ React.createElement(
      "title",
      {
        id: "kakao-logo",
      },
      "kakao-logo"
    ),
    /*#__PURE__*/ React.createElement(
      "g",
      {
        clipPath: "url(#clip0_122_67)",
      },
      /*#__PURE__*/ React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18 1.20001C8.05835 1.20001 0 7.42593 0 15.1046C0 19.8801 3.11681 24.09 7.86305 26.5939L5.86606 33.889C5.68962 34.5336 6.42683 35.0474 6.99293 34.6739L15.7467 28.8964C16.4854 28.9677 17.2362 29.0093 18 29.0093C27.9409 29.0093 35.9999 22.7836 35.9999 15.1046C35.9999 7.42593 27.9409 1.20001 18 1.20001Z",
        fill: "black",
      })
    ),
    /*#__PURE__*/ React.createElement(
      "defs",
      {},
      /*#__PURE__*/ React.createElement(
        "clipPath",
        {
          id: "clip0_122_67",
        },
        /*#__PURE__*/ React.createElement("rect", {
          width: "35.9999",
          height: "36",
          fill: "white",
        })
      )
    )
  );
}

const ForwardRef = /*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(KakaoLogo);
export default React.memo(ForwardRef);

