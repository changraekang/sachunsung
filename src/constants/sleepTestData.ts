export type SleepAxis = "FL" | "MQ" | "SD" | "CN";

export type SleepLetter = "F" | "L" | "M" | "Q" | "S" | "D" | "C" | "N";

export const AXIS_ORDER: SleepAxis[] = ["FL", "MQ", "SD", "CN"];

export const AXIS_LETTER_MAP: Record<SleepAxis, [SleepLetter, SleepLetter]> = {
  FL: ["F", "L"],
  MQ: ["M", "Q"],
  SD: ["S", "D"],
  CN: ["C", "N"],
};

export type SleepQuestion = {
  id: number;
  text: string;
  axis: SleepAxis;
  yes: SleepLetter;
};

export const SLEEP_QUESTIONS: SleepQuestion[] = [
  { id: 1, text: "나는 눕자마자 금방 잠드는 편이다.", axis: "FL", yes: "F" },
  { id: 2, text: "잠들기까지 20분 이상 걸리는 편이다.", axis: "FL", yes: "L" },
  { id: 3, text: "낮잠도 쉽게 든다.", axis: "FL", yes: "F" },
  {
    id: 4,
    text: "잠들기 전에 생각이 많아 쉽게 못 잔다.",
    axis: "FL",
    yes: "L",
  },
  {
    id: 5,
    text: "자면서 이불을 자주 걷어차거나 말아버린다.",
    axis: "MQ",
    yes: "M",
  },
  {
    id: 6,
    text: "자고 일어나면 베개나 자세가 자주 바뀌어 있다.",
    axis: "MQ",
    yes: "M",
  },
  { id: 7, text: "나는 같은 자세로 오랫동안 고요하게 잔다.", axis: "MQ", yes: "Q" },
  {
    id: 8,
    text: "나의 수면은 주변에 방해가 되지 않을 만큼 조용하다.",
    axis: "MQ",
    yes: "Q",
  },
  { id: 9, text: "작은 소리에도 쉽게 잠에서 깬다.", axis: "SD", yes: "S" },
  { id: 10, text: "누가 살짝 건드려도 잠에서 깬다.", axis: "SD", yes: "S" },
  {
    id: 11,
    text: "알람이 울려도 못 듣고 자는 경우가 있다.",
    axis: "SD",
    yes: "D",
  },
  { id: 12, text: "불빛이나 소음이 있어도 푹 잘 잔다.", axis: "SD", yes: "D" },
  { id: 13, text: "나는 꿈을 자주 기억한다.", axis: "CN", yes: "C" },
  {
    id: 14,
    text: "내 꿈은 종종 생생해서 영화처럼 느껴진다.",
    axis: "CN",
    yes: "C",
  },
  { id: 15, text: "아침에 일어나면 꿈을 거의 기억 못 한다.", axis: "CN", yes: "N" },
  { id: 16, text: "나는 꿈을 잘 꾸지 않는 편이다.", axis: "CN", yes: "N" },
];

export type SleepResultType = {
  code: string;
  name: string;
  desc: string;
  tip: string;
  image: string;
};

export const SLEEP_RESULT_TYPES: SleepResultType[] = [
  {
    code: "FMSC",
    name: "몽환 예민게",
    desc: "금방 잠들지만 꿈틀, 꿈을 자주 꾸며 건드리면 쉽게 깨는 타입",
    tip: "귀마개와 안대를 챙기면 수면의 질이 확 좋아져요.",
    image: "/sleep-types/FMSC.svg",
  },
  {
    code: "FMSN",
    name: "불안정 단잠게",
    desc: "금방 잠들고 뒤척이지만 꿈은 없고 예민해서 쉽게 깸",
    tip: "베개 높이/매트리스 탄성 점검으로 뒤척임을 줄여보세요.",
    image: "/sleep-types/FMSN.svg",
  },
  {
    code: "FMDC",
    name: "꿈속 탐험게",
    desc: "금방 잠들고 뒤척이며 깊은 잠에 빠져 꿈을 선명히 꾸는 타입",
    tip: "자기 전 가벼운 독서로 즐거운 꿈을 세팅해보세요.",
    image: "/sleep-types/FMDC.svg",
  },
  {
    code: "FMDN",
    name: "폭풍 돌잠게",
    desc: "금방 잠들고 꿈도 없으며 뒤척여도 절대 안 깨는 강철 수면러",
    tip: "알람은 2개 이상! 기상 루틴을 확실히 만드세요.",
    image: "/sleep-types/FMDN.svg",
  },
  {
    code: "FQSC",
    name: "새털몽게",
    desc: "고요하게 금방 잠들고 꿈을 잘 꾸지만 작은 자극에도 금방 깸",
    tip: "백색소음이나 가벼운 음악으로 미세한 소음을 덮어주세요.",
    image: "/sleep-types/FQSC.svg",
  },
  {
    code: "FQSN",
    name: "고요 예민게",
    desc: "조용히 금방 잠들지만 꿈은 없고 예민하게 잘 깸",
    tip: "수면 마스크 + 암막 커튼으로 빛 차단을 추천해요.",
    image: "/sleep-types/FQSN.svg",
  },
  {
    code: "FQDC",
    name: "몽중 철인게",
    desc: "고요하게 깊게 자며 생생한 꿈을 꾸는 강철 수면러",
    tip: "침실 온도/습도만 잘 맞추면 최강 컨디션 유지!",
    image: "/sleep-types/FQDC.svg",
  },
  {
    code: "FQDN",
    name: "철벽 돌잠게",
    desc: "고요히 푹 자고 꿈도 없으며 절대 안 깨는 최강 수면러",
    tip: "수면 시간이 너무 길어지지 않게 기상 알림을 분산해두세요.",
    image: "/sleep-types/FQDN.svg",
  },
  {
    code: "LMSC",
    name: "뒤척몽게",
    desc: "늦게 자고 뒤척이며 꿈도 자주 꾸고 예민하게 깨는 타입",
    tip: "자기 전 스트레칭으로 긴장을 풀고 루틴을 고정하세요.",
    image: "/sleep-types/LMSC.svg",
  },
  {
    code: "LMSN",
    name: "뒤척 예민게",
    desc: "늦게 잠들고 꿈도 없지만 뒤척이고 쉽게 깸",
    tip: "카페인/당류 섭취 시간대를 앞당겨보세요.",
    image: "/sleep-types/LMSN.svg",
  },
  {
    code: "LMDC",
    name: "불안정 몽환게",
    desc: "늦게 자고 뒤척이지만 깊은 잠에 빠져 꿈을 선명히 꾸는 타입",
    tip: "자기 전 스크린 타임을 1시간 줄여보세요.",
    image: "/sleep-types/LMDC.svg",
  },
  {
    code: "LMDN",
    name: "야행 돌잠게",
    desc: "늦게 자고 뒤척이지만 꿈도 없고 절대 안 깨는 타입",
    tip: "수면-기상 시간을 주 단위로 조금씩 앞당겨보세요.",
    image: "/sleep-types/LMDN.svg",
  },
  {
    code: "LQSC",
    name: "고요 몽환게",
    desc: "늦게 자고 조용히 꿈을 꾸지만 예민해서 쉽게 깸",
    tip: "수면 환경(온도/소음/빛) 체크리스트를 만들어보세요.",
    image: "/sleep-types/LQSC.svg",
  },
  {
    code: "LQSN",
    name: "고요 예민게(야행)",
    desc: "늦게 자고 조용하지만 꿈도 없고 예민하게 깨는 타입",
    tip: "자가 마사지나 따뜻한 샤워로 이완하세요.",
    image: "/sleep-types/LQSN.svg",
  },
  {
    code: "LQDC",
    name: "몽속 잠꾸러기게",
    desc: "늦게 자고 고요히 깊은 잠에 빠져 꿈도 자주 꾸는 타입",
    tip: "일정한 취침 알림으로 시작 신호를 뇌에 학습시키세요.",
    image: "/sleep-types/LQDC.svg",
  },
  {
    code: "LQDN",
    name: "돌잠 마스터게",
    desc: "늦게 자고 고요하며 꿈도 없고 절대 안 깸",
    tip: "기상 후 햇빛 10분으로 리듬을 리셋해보세요.",
    image: "/sleep-types/LQDN.svg",
  },
];

export const SLEEP_CHARACTER_EMOJI = "🦀";
