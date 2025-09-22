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

/* 
💤 수면구분법 최종 축

잠드는 속도:

F (Fast): 금방 잠듦
L (Late): 늦게 겨우 잠듦

잠버릇:

M (Mover): 많이 뒤척임
Q (Quiet): 조용히 잠

예민도:

S (Sensitive): 쉽게 깸
D (Deep): 잘 안 깸

꿈 성향:

C (Clear): 꿈을 자주 꾸고 기억함
N (No-dream): 꿈을 잘 안 꾸거나 기억 못함

*/
export const SLEEP_QUESTIONS: SleepQuestion[] = [
  // FL — Fast vs Late
  {
    id: 1,
    axis: "FL",
    yes: "F",
    text: "불을 끄면 눈꺼풀이 커튼처럼 바로 내려온다.",
  },
  {
    id: 2,
    axis: "FL",
    yes: "L",
    text: "침대에 누우면 마음속 대화가 오래 이어진다.",
  },
  { id: 3, axis: "FL", yes: "F", text: "양을 세면 셋을 넘기기 어렵다." },
  { id: 4, axis: "FL", yes: "L", text: "베개와 한참 씨름해야 잠과 친해진다." },

  // MQ — Mover vs Quiet
  {
    id: 5,
    axis: "MQ",
    yes: "M",
    text: "아침에 보면 이불이 밤사이 모험을 다녀온 듯하다.",
  },
  {
    id: 6,
    axis: "MQ",
    yes: "M",
    text: "자다 보면 내 몸의 나침반이 자주 방향을 바꾼다.",
  },
  {
    id: 7,
    axis: "MQ",
    yes: "Q",
    text: "내 잠은 사진 한 장처럼 오래 같은 자세로 고정된다.",
  },
  {
    id: 8,
    axis: "MQ",
    yes: "Q",
    text: "베개 자국도 가지런히, 밤새 파도는 잔잔하다.",
  },

  // SD — Sensitive vs Deep
  {
    id: 9,
    axis: "SD",
    yes: "S",
    text: "문틈의 미세한 빛에도 몸이 깜빡 깨어난다.",
  },
  {
    id: 10,
    axis: "SD",
    yes: "S",
    text: "누군가 스치면 꿈이 얕아져 표면으로 떠오른다.",
  },
  {
    id: 11,
    axis: "SD",
    yes: "D",
    text: "알람이 두 번은 울어야 바다가 나를 놓아준다.",
  },
  {
    id: 12,
    axis: "SD",
    yes: "D",
    text: "빗소리는 자장가가 되어 더 깊이 가라앉게 만든다.",
  },

  // CN — Clear vs No-dream
  {
    id: 13,
    axis: "CN",
    yes: "C",
    text: "아침이면 이야기 조각들이 선명히 손에 잡힌다.",
  },
  {
    id: 14,
    axis: "CN",
    yes: "C",
    text: "가끔은 꿈에서 색과 냄새까지 기억난다.",
  },
  {
    id: 15,
    axis: "CN",
    yes: "N",
    text: "눈을 뜨면 밤은 백지장처럼 아무 흔적이 없다.",
  },
  {
    id: 16,
    axis: "CN",
    yes: "N",
    text: "내 잠은 한 편의 영화가 아니라 무음의 암전 같다.",
  },
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
    desc: "눈 감자마자 꿈속으로 뛰어들지만, 작은 바람에도 쉽게 눈을 뜨는 여린 잠결.",
    tip: "백색소음을 자장가처럼 틀어 두면 당신의 꿈길이 조금 더 깊어질 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FMSC.webp",
  },
  {
    code: "FMSN",
    name: "불안정 단잠게",
    desc: "빠르게 잠들지만 뒤척이는 파도 위, 꿈은 희미하고 쉽게 흔들린다.",
    tip: "부드러운 매트리스와 포근한 이불로 몸의 모험을 잠재워 보세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FMSN.webp",
  },
  {
    code: "FMDC",
    name: "꿈속 탐험게",
    desc: "눈을 감으면 금세 깊은 바다로 가라앉아, 선명한 꿈의 지도를 따라간다.",
    tip: "자기 전 따뜻한 차 한 잔이 여행의 길잡이가 될 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FMDC.webp",
  },
  {
    code: "FMDN",
    name: "폭풍 돌잠게",
    desc: "거센 파도처럼 몸은 움직여도, 잠은 흔들림 없는 바위처럼 단단하다.",
    tip: "아침 햇살이 들어오도록 커튼을 반쯤 열어두세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FMDN.webp",
  },
  {
    code: "FQSC",
    name: "새털몽게",
    desc: "고요히 잠들지만 꿈은 하늘을 날고, 작은 바람에도 쉽게 깨어난다.",
    tip: "귀마개와 수면 안대가 당신의 하늘을 더 평온하게 지켜줄 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FQSC.webp",
  },
  {
    code: "FQSN",
    name: "고요 예민게",
    desc: "물결 없는 호수처럼 잔잔히 자지만, 작은 돌멩이에도 흔들린다.",
    tip: "암막 커튼과 부드러운 조명이 밤을 지켜줄 친구가 돼줄 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FQSN.webp",
  },
  {
    code: "FQDC",
    name: "몽중 철인게",
    desc: "조용한 바다 깊숙이 잠기듯, 흔들림 없이 꿈의 세계를 누빈다.",
    tip: "쾌적한 온도와 향기로운 디퓨저로 바다를 더 깊게 만들어보세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FQDC.webp",
  },
  {
    code: "FQDN",
    name: "철벽 돌잠게",
    desc: "잠들면 무너뜨릴 수 없는 성벽처럼, 꿈도 기억 없이 단단히 닫힌다.",
    tip: "기상 알람을 여러 개 두어, 아침의 문을 열어두세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/FQDN.webp",
  },
  {
    code: "LMSC",
    name: "뒤척몽게",
    desc: "늦은 밤에야 겨우 잠들고, 꿈은 파편처럼 이어지다 쉽게 깨어난다.",
    tip: "자기 전 스트레칭이 당신의 파편을 이어줄 실이 될 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LMSC.webp",
  },
  {
    code: "LMSN",
    name: "뒤척 예민게",
    desc: "늦게 찾아온 잠은 얕고, 몸은 파도처럼 흔들려 쉽게 깨어난다.",
    tip: "카페인 시간을 조절해 밤의 물결을 잔잔하게 만들어보세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LMSN.webp",
  },
  {
    code: "LMDC",
    name: "불안정 몽환게",
    desc: "잠은 늦게 오지만 깊이 잠기면, 또렷한 꿈이 어둠 속 등불처럼 빛난다.",
    tip: "취침 전 휴대폰을 내려놓고 어둠에 몸을 맡기세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LMDC.webp",
  },
  {
    code: "LMDN",
    name: "야행 돌잠게",
    desc: "밤의 끝자락에서 잠들고, 꿈도 없이 바위처럼 단단히 쉰다.",
    tip: "아침 햇살과 함께 하루를 맞이하는 루틴을 조금씩 세워보세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LMDN.webp",
  },
  {
    code: "LQSC",
    name: "고요 몽환게",
    desc: "늦은 밤, 잔잔한 호수에 빠져드는 듯한 잠. 그러나 쉽게 깨어난다.",
    tip: "따뜻한 샤워와 조용한 음악으로 꿈결을 지켜보세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LQSC.webp",
  },
  {
    code: "LQSN",
    name: "고요 예민게(야행)",
    desc: "늦게 잠들고 조용히 쉬지만, 작은 소리에 금세 깨어난다.",
    tip: "라벤더 향초가 당신의 귓가를 지켜줄 거예요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LQSN.webp",
  },
  {
    code: "LQDC",
    name: "몽속 잠꾸러기게",
    desc: "늦게 잠들어도 고요히, 선명한 꿈 속에서 오랫동안 머문다.",
    tip: "취침 알람을 통해 뇌와 몸에 '이제 꿈의 시간이야'라는 신호를 주세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LQDC.webp",
  },
  {
    code: "LQDN",
    name: "돌잠 마스터게",
    desc: "늦은 밤에 잠들고도 꿈조차 꾸지 않은 채, 절대 깨지 않는 깊은 어둠.",
    tip: "아침 햇살을 눈으로 담아 하루의 리듬을 맞추세요.",
    image:
      "https://assets.sparkling-rae.com/crab-game/sleep-type-webp/LQDN.webp",
  },
];

export const SLEEP_CHARACTER_EMOJI = "🦀";
