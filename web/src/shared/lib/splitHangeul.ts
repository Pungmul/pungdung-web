const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSUNG_LIST = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const JUNGSUNG_LIST = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const JONGSUNG_LIST = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function splitHangul(text: string): string[][] {
  return Array.from(text).map((char) => {
    const code = char.charCodeAt(0);
    if (code < HANGUL_START || code > HANGUL_END) return [char];
    const uniVal = code - HANGUL_START;
    const chosungIndex = Math.floor(uniVal / 588);
    const jungsungIndex = Math.floor((uniVal % 588) / 28);
    const jongsungIndex = uniVal % 28;
    return [
      char,
      CHOSUNG_LIST[chosungIndex] || "",
      JUNGSUNG_LIST[jungsungIndex] || "",
      JONGSUNG_LIST[jongsungIndex] || "",
    ];
  });
}

function isAllConsonant(search: string): boolean {
  return /^[ㄱ-ㅎ]+$/.test(search);
}

// **핵심**: search의 각 글자가 target의 각 글자 자모와 "각 위치별로" 일치해야 함
export function hangulPositionStrictMatch(
  search: string,
  target: string
): boolean {
  if (!search) return true;
  const targetArr = Array.from(target);
  if (targetArr.length < search.length) return false;

  if (isAllConsonant(search)) {
    const ch = splitHangul(target);
    for (let i = 0; i < search.length; i++) {
      if (ch[i]?.[0] !== search[i]) return false;
    }
    return true;
  } else {
    // 자음이 아닌 경우(복합검색)는 기존처럼 각 글자의 자모 배열에 포함되어야 true
    // (아래는 기존 로직과 동일)
    for (let i = 0; i < search.length; i++) {
      const code = targetArr[i]?.charCodeAt(0);
      if (!code) return false;
      if (code < HANGUL_START || code > HANGUL_END) {
        if (targetArr[i] !== search[i]) return false;
      } else {
        // 초성, 중성, 종성 배열로 분해
        const uniVal = code - HANGUL_START;
        const chosung = CHOSUNG_LIST[Math.floor(uniVal / 588)] || "";
        const jungsung = JUNGSUNG_LIST[Math.floor((uniVal % 588) / 28)] || "";
        const jongsung = JONGSUNG_LIST[uniVal % 28] || "";
        if (![chosung, jungsung, jongsung, targetArr[i]].includes(search[i]))
          return false;
      }
    }
    return true;
  }
} 