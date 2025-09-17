const questions = [
  {
    id: 1,
    movie: "12인의성난사람들",
    image:
      "https://assets.movie-hop.com/ghibli/12인의성난사람들.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_12인의성난사람들.webp",
  },
  {
    id: 2,
    movie: "1917",
    image: "https://assets.movie-hop.com/ghibli/1917.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_1917.webp",
  },
  {
    id: 3,
    movie: "1987",
    image: "https://assets.movie-hop.com/ghibli/1987.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_1987.webp",
  },
  {
    id: 4,
    movie: "8월의크리스마스",
    image: "https://assets.movie-hop.com/ghibli/8월의크리스마스.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_8월의크리스마스.webp",
  },
  {
    id: 5,
    movie: "강철비",
    image: "https://assets.movie-hop.com/ghibli/강철비.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_강철비.webp",
  },
  {
    id: 6,
    movie: "검사외전",
    image: "https://assets.movie-hop.com/ghibli/검사외전.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_검사외전.webp",
  },
  {
    id: 7,
    movie: "검은사제들",
    image: "https://assets.movie-hop.com/ghibli/검은사제들.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_검은사제들.webp",
  },
  {
    id: 8,
    movie: "곡성",
    image: "https://assets.movie-hop.com/ghibli/곡성.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_곡성.webp",
  },
  {
    id: 9,
    movie: "공작",
    image: "https://assets.movie-hop.com/ghibli/공작.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_공작.webp",
  },
  {
    id: 10,
    movie: "과속스캔들",
    image: "https://assets.movie-hop.com/ghibli/과속스캔들.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_과속스캔들.webp",
  },
  {
    id: 11,
    movie: "관상",
    image: "https://assets.movie-hop.com/ghibli/관상.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_관상.webp",
  },
  {
    id: 12,
    movie: "광해",
    image: "https://assets.movie-hop.com/ghibli/광해.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_광해.webp",
  },
  {
    id: 13,
    movie: "괴물",
    image: "https://assets.movie-hop.com/ghibli/괴물.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_괴물.webp",
  },
  {
    id: 14,
    movie: "국제시장",
    image: "https://assets.movie-hop.com/ghibli/국제시장.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_국제시장.webp",
  },
  {
    id: 15,
    movie: "그녀를믿지마세요",
    image:
      "https://assets.movie-hop.com/ghibli/그녀를믿지마세요.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_그녀를믿지마세요.webp",
  },
  {
    id: 16,
    movie: "그랜드부다페스트호텔",
    image:
      "https://assets.movie-hop.com/ghibli/그랜드부다페스트호텔.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_그랜드부다페스트호텔.webp",
  },
  {
    id: 17,
    movie: "극한직업",
    image: "https://assets.movie-hop.com/ghibli/극한직업.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_극한직업.webp",
  },
  {
    id: 18,
    movie: "기생충",
    image: "https://assets.movie-hop.com/ghibli/기생충.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_기생충.webp",
  },
  {
    id: 19,
    movie: "내부자들",
    image: "https://assets.movie-hop.com/ghibli/내부자들.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_내부자들.webp",
  },
  {
    id: 20,
    movie: "늑대소년",
    image: "https://assets.movie-hop.com/ghibli/늑대소년.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_늑대소년.webp",
  },
  {
    id: 21,
    movie: "대부",
    image: "https://assets.movie-hop.com/ghibli/대부.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_대부.webp",
  },
  {
    id: 22,
    movie: "더킹",
    image: "https://assets.movie-hop.com/ghibli/더킹.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_더킹.webp",
  },
  {
    id: 23,
    movie: "더테러라이브",
    image: "https://assets.movie-hop.com/ghibli/더테러라이브.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_더테러라이브.webp",
  },
  {
    id: 24,
    movie: "덩케르크",
    image: "https://assets.movie-hop.com/ghibli/덩케르크.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_덩케르크.webp",
  },
  {
    id: 25,
    movie: "동주",
    image: "https://assets.movie-hop.com/ghibli/동주.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_동주.webp",
  },
  {
    id: 26,
    movie: "라라랜드",
    image: "https://assets.movie-hop.com/ghibli/라라랜드.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_라라랜드.webp",
  },
  {
    id: 27,
    movie: "라이언일병구하기",
    image:
      "https://assets.movie-hop.com/ghibli/라이언일병구하기.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_라이언일병구하기.webp",
  },
  {
    id: 28,
    movie: "러브레터",
    image: "https://assets.movie-hop.com/ghibli/러브레터.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_러브레터.webp",
  },
  {
    id: 29,
    movie: "레옹",
    image: "https://assets.movie-hop.com/ghibli/레옹.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_레옹.webp",
  },
  {
    id: 30,
    movie: "말아톤",
    image: "https://assets.movie-hop.com/ghibli/말아톤.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_말아톤.webp",
  },
  {
    id: 31,
    movie: "말할수없는비밀",
    image:
      "https://assets.movie-hop.com/ghibli/말할수없는비밀.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_말할수없는비밀.webp",
  },
  {
    id: 32,
    movie: "메멘토",
    image: "https://assets.movie-hop.com/ghibli/메멘토.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_메멘토.webp",
  },
  {
    id: 33,
    movie: "명량",
    image: "https://assets.movie-hop.com/ghibli/명량.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_명량.webp",
  },
  {
    id: 34,
    movie: "무간도",
    image: "https://assets.movie-hop.com/ghibli/무간도.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_무간도.webp",
  },
  {
    id: 35,
    movie: "미녀는괴로워",
    image: "https://assets.movie-hop.com/ghibli/미녀는괴로워.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_미녀는괴로워.webp",
  },
  {
    id: 36,
    movie: "범죄도시",
    image: "https://assets.movie-hop.com/ghibli/범죄도시.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_범죄도시.webp",
  },
  {
    id: 37,
    movie: "범죄와의전쟁",
    image: "https://assets.movie-hop.com/ghibli/범죄와의전쟁.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_범죄와의전쟁.webp",
  },
  {
    id: 38,
    movie: "베테랑",
    image: "https://assets.movie-hop.com/ghibli/베테랑.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_베테랑.webp",
  },
  {
    id: 39,
    movie: "부산행",
    image: "https://assets.movie-hop.com/ghibli/부산행.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_부산행.webp",
  },
  {
    id: 40,
    movie: "빅피쉬",
    image: "https://assets.movie-hop.com/ghibli/빅피쉬.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_빅피쉬.webp",
  },
  {
    id: 41,
    movie: "사운드오브뮤직",
    image: "https://assets.movie-hop.com/ghibli/사운드오브뮤직.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_사운드오브뮤직.webp",
  },
  {
    id: 42,
    movie: "살인의추억",
    image: "https://assets.movie-hop.com/ghibli/살인의추억.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_살인의추억.webp",
  },
  {
    id: 43,
    movie: "설국열차",
    image: "https://assets.movie-hop.com/ghibli/설국열차.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_설국열차.webp",
  },
  {
    id: 44,
    movie: "세얼간이",
    image: "https://assets.movie-hop.com/ghibli/세얼간이.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_세얼간이.webp",
  },
  {
    id: 45,
    movie: "소셜네트워크",
    image: "https://assets.movie-hop.com/ghibli/소셜네트워크.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_소셜네트워크.webp",
  },
  {
    id: 46,
    movie: "쇼생크탈출",
    image: "https://assets.movie-hop.com/ghibli/쇼생크탈출.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_쇼생크탈출.webp",
  },
  {
    id: 47,
    movie: "시네마천국",
    image: "https://assets.movie-hop.com/ghibli/시네마천국.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_시네마천국.webp",
  },
  {
    id: 48,
    movie: "아저씨",
    image: "https://assets.movie-hop.com/ghibli/아저씨.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_아저씨.webp",
  },
  {
    id: 49,
    movie: "암살",
    image: "https://assets.movie-hop.com/ghibli/암살.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_암살.webp",
  },
  {
    id: 50,
    movie: "양들의침묵",
    image: "https://assets.movie-hop.com/ghibli/양들의침묵.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_양들의침묵.webp",
  },
  {
    id: 51,
    movie: "여인의향기",
    image: "https://assets.movie-hop.com/ghibli/여인의향기.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_여인의향기.webp",
  },
  {
    id: 52,
    movie: "엽기적인그녀",
    image: "https://assets.movie-hop.com/ghibli/엽기적인그녀.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_엽기적인그녀.webp",
  },
  {
    id: 53,
    movie: "올드보이",
    image: "https://assets.movie-hop.com/ghibli/올드보이.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_올드보이.webp",
  },
  {
    id: 54,
    movie: "왕의남자",
    image: "https://assets.movie-hop.com/ghibli/왕의남자.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_왕의남자.webp",
  },
  {
    id: 55,
    movie: "우리들의행복한시간",
    image:
      "https://assets.movie-hop.com/ghibli/우리들의행복한시간.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_우리들의행복한시간.webp",
  },
  {
    id: 56,
    movie: "울프오브월스트리트",
    image:
      "https://assets.movie-hop.com/ghibli/울프오브월스트리트.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_울프오브월스트리트.webp",
  },
  {
    id: 57,
    movie: "원더",
    image: "https://assets.movie-hop.com/ghibli/원더.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_원더.webp",
  },
  {
    id: 58,
    movie: "웰컴투동막골",
    image: "https://assets.movie-hop.com/ghibli/웰컴투동막골.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_웰컴투동막골.webp",
  },
  {
    id: 59,
    movie: "이터널션샤인",
    image: "https://assets.movie-hop.com/ghibli/이터널션샤인.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_이터널션샤인.webp",
  },
  {
    id: 60,
    movie: "인셉션",
    image: "https://assets.movie-hop.com/ghibli/인셉션.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_인셉션.webp",
  },
  {
    id: 61,
    movie: "인터스텔라",
    image: "https://assets.movie-hop.com/ghibli/인터스텔라.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_인터스텔라.webp",
  },
  {
    id: 62,
    movie: "전우치",
    image: "https://assets.movie-hop.com/ghibli/전우치.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_전우치.webp",
  },
  {
    id: 63,
    movie: "조커",
    image: "https://assets.movie-hop.com/ghibli/조커.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_조커.webp",
  },
  {
    id: 64,
    movie: "죽은시인의사회",
    image: "https://assets.movie-hop.com/ghibli/죽은시인의사회.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_죽은시인의사회.webp",
  },
  {
    id: 65,
    movie: "착하게살자",
    image: "https://assets.movie-hop.com/ghibli/착하게살자.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_착하게살자.webp",
  },
  {
    id: 66,
    movie: "청년경찰",
    image: "https://assets.movie-hop.com/ghibli/청년경찰.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_청년경찰.webp",
  },
  {
    id: 67,
    movie: "추격자",
    image: "https://assets.movie-hop.com/ghibli/추격자.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_추격자.webp",
  },
  {
    id: 68,
    movie: "친구",
    image: "https://assets.movie-hop.com/ghibli/친구.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_친구.webp",
  },
  {
    id: 69,
    movie: "쿵푸허슬",
    image: "https://assets.movie-hop.com/ghibli/쿵푸허슬.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_쿵푸허슬.webp",
  },
  {
    id: 70,
    movie: "클래식",
    image: "https://assets.movie-hop.com/ghibli/클래식.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_클래식.webp",
  },
  {
    id: 71,
    movie: "타이타닉",
    image: "https://assets.movie-hop.com/ghibli/타이타닉.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_타이타닉.webp",
  },
  {
    id: 72,
    movie: "타짜",
    image: "https://assets.movie-hop.com/ghibli/타짜.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_타짜.webp",
  },
  {
    id: 73,
    movie: "태극기휘날리며",
    image: "https://assets.movie-hop.com/ghibli/태극기휘날리며.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_태극기휘날리며.webp",
  },
  {
    id: 74,
    movie: "터미네이터",
    image: "https://assets.movie-hop.com/ghibli/터미네이터.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_터미네이터.webp",
  },
  {
    id: 75,
    movie: "트랜스포머",
    image: "https://assets.movie-hop.com/ghibli/트랜스포머.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_트랜스포머.webp",
  },
  {
    id: 76,
    movie: "파묘",
    image: "https://assets.movie-hop.com/ghibli/파묘.webp",
    quizImage: "https://assets.movie-hop.com/ghibli/ghibli_파묘.webp",
  },
  {
    id: 77,
    movie: "파이트클럽",
    image: "https://assets.movie-hop.com/ghibli/파이트클럽.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_파이트클럽.webp",
  },
  {
    id: 78,
    movie: "포레스트검프",
    image: "https://assets.movie-hop.com/ghibli/포레스트검프.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_포레스트검프.webp",
  },
  {
    id: 79,
    movie: "피아니스트",
    image: "https://assets.movie-hop.com/ghibli/피아니스트.webp",
    quizImage:
      "https://assets.movie-hop.com/ghibli/ghibli_피아니스트.webp",
  },
];

export default questions;
