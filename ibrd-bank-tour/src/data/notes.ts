/**
 * Presenter notes per scene: English talk track (2-3 sentences), a one-line Vietnamese cue,
 * and targetSeconds for the whole scene (about 25-35 s per beat). Only facts from the paper.
 */
export interface SceneNotes {
  presenter?: string;
  en?: string;
  vi?: string;
  /** planned speaking time for the whole scene (about 25-35 s per beat) */
  targetSeconds?: number;
  beats?: { en?: string; vi?: string }[];
}

export const NOTES: Record<string, SceneNotes> = {
  // ---------------- Entrance + Introduction ----------------
  'ext-facade': {
    en: 'Good morning. We are Group 6, and our paper looks at the IBRD and how it finances development projects in Vietnam. We will walk you through the bank floor by floor, ending with two case studies, TEP and CCSEP.',
    vi: 'Chào hội đồng, giới thiệu nhóm 6 và đề tài; mời mọi người "bước vào ngân hàng".',
    targetSeconds: 30,
  },
  'f1-rationale-1': {
    en: 'Developing economies need far more long-term investment than domestic savings and taxes can fund, and market borrowing is costly or short. Multilateral development banks fill that gap with cheap, long-term and stable capital, and they also crowd in private money and raise project quality.',
    vi: 'Nhấn mạnh: MDB cung cấp vốn dài hạn, ổn định, có vai trò xúc tác và nâng chất lượng dự án.',
    targetSeconds: 90,
  },
  'f1-rationale-2': {
    en: 'Vietnam became IBRD-eligible in 2007, took its first IBRD loan in 2009 and graduated from IDA in July 2017. IBRD money is dearer than IDA credits but cheaper and longer than most commercial loans, so it is a middle path that must be used carefully.',
    vi: 'Đi theo mốc thời gian 2007 – 2009 – 2017 – 2018 – 2026, rồi so sánh chi phí IDA / IBRD / vay thương mại.',
    targetSeconds: 95,
  },
  'f1-problem': {
    en: 'IBRD loans come with different terms and procedures from the concessional credits Vietnam knew. Our four research questions move from what the IBRD is, to how it is organized and lends, to how it supports projects, and finally to the results in Vietnam.',
    vi: 'Đọc lần lượt 4 câu hỏi nghiên cứu, liên hệ với 3 chương.',
    targetSeconds: 60,
  },
  'f1-objectives': {
    en: 'Objective one is the mechanism: how the IBRD raises money, which instruments it uses and how the project cycle works. Objective two tests it on TEP and CCSEP, using relevance, effectiveness, efficiency and sustainability.',
    vi: 'Hai mục tiêu: cơ chế tham gia của IBRD và đánh giá thực tiễn qua TEP, CCSEP.',
    targetSeconds: 120,
  },
  'f1-method': {
    en: 'We use a qualitative approach: a literature review plus two case studies, based on secondary data. To reduce bias we cross-check World Bank reports against IEG and Vietnamese government sources, and we state the source of every number.',
    vi: 'Phương pháp định tính, dữ liệu thứ cấp, đối chiếu nguồn; nêu rõ hạn chế.',
    targetSeconds: 140,
  },
  'f1-scope': {
    en: 'The subject is the IBRD itself; other World Bank Group members appear only for comparison. Spatially we focus on Vietnam, and in time on 2014 to the present, especially after the 2017 IDA graduation.',
    vi: 'Phạm vi: đối tượng, nội dung, không gian, thời gian.',
    targetSeconds: 60,
  },
  'f1-structure': {
    en: 'Besides the introduction and conclusion, the paper has three chapters, and in this tour each chapter is a floor of the bank. We now walk into the banking hall for Chapter 1.',
    vi: 'Giới thiệu cấu trúc 3 chương = 3 tầng; có thể bấm để nhảy tầng.',
    targetSeconds: 30,
  },
  // ---------------- Chapter 1 ----------------
  'f1-ch1-title': {
    en: 'Chapter 1 gives an overview of the IBRD: what it is, how it developed, how it is organized and funded, and on what terms it lends.',
    vi: 'Mở đầu chương 1, đọc 4 mục con.',
    targetSeconds: 25,
  },
  'f1-what': {
    en: 'The IBRD is a development cooperative owned by 189 member countries; with IDA it forms the World Bank. It lends mainly to middle-income countries, usually to governments or to entities with a government guarantee, and Vietnam moved from IDA to IBRD lending after 2017.',
    vi: 'Định nghĩa, sứ mệnh và đối tượng vay của IBRD.',
    targetSeconds: 90,
  },
  'f1-wbg': {
    en: 'Table 1 lists the five World Bank Group institutions, from the IBRD in 1944 to MIGA in 1988. The key contrasts are cost of funds for IBRD versus IDA, clients for IBRD versus IFC, and the fact that MIGA and ICSID reduce risk rather than lend.',
    vi: 'Đi từng dòng bảng 1, sau đó nêu 3 điểm khác biệt chính.',
    targetSeconds: 270,
  },
  'f1-history-1': {
    en: 'The IBRD was created at Bretton Woods in July 1944, and its first loan of US$250 million went to France in 1947. After the Marshall Plan it turned to developing countries, and from the late 1960s it stressed poverty reduction.',
    vi: 'Giai đoạn 1 và 2 của lịch sử IBRD.',
    targetSeconds: 110,
  },
  'f1-history-2': {
    en: 'The 1980s debt crisis brought structural adjustment lending, and the 1990s added governance and safeguards. Today the mission is to end extreme poverty and boost shared prosperity on a livable planet, with the same funding model as in 1944.',
    vi: 'Giai đoạn 3, 4 và kết luận về lịch sử.',
    targetSeconds: 85,
  },
  'f1-gov': {
    en: 'Three bodies run the IBRD: the Board of Governors sets direction, the Board of Executive Directors with 25 directors approves loans and policies, and the President, Ajay Banga since June 2023, manages operations.',
    vi: 'Ba cấp quản trị: Hội đồng Thống đốc, Hội đồng Giám đốc Điều hành, Chủ tịch.',
    targetSeconds: 110,
  },
  'f1-voting': {
    en: 'Votes follow one share, one vote, made of basic votes plus share votes. The United States holds around 15-16 percent and, with an 85 percent threshold for major decisions, an effective veto; Vietnam holds 0.21 percent and acts through its constituency.',
    vi: 'Nhấn mạnh con số 0,21% của Việt Nam và vai trò nhóm cử tri.',
    targetSeconds: 110,
  },
  'f1-funds': {
    en: 'The IBRD is funded by member capital, mostly callable and never called, and above all by AAA-rated bonds. That market model lets it lend at scale and low cost, but makes its loans dearer than donor-funded IDA credits.',
    vi: 'Vốn góp, vốn khả dụng, trái phiếu AAA và khác biệt với IDA.',
    targetSeconds: 140,
  },
  'f1-instruments': {
    en: 'Table 2 shows the three instruments: IPF pays for inputs, DPF for reforms and PforR for results. Both our case studies used IPF, and Vietnam’s first IBRD loan was a US$500 million DPF in 2009.',
    vi: 'Ba công cụ cho vay; câu chốt: đầu vào – cải cách – kết quả.',
    targetSeconds: 140,
  },
  'f1-terms': {
    en: 'The IBRD Flexible Loan costs SOFR plus a variable spread, a one-off 0.25 percent front-end fee and a 0.25 percent commitment fee on undisbursed balances. Maturities run up to 35 years, or 50 for some projects, and slow disbursement raises the real cost.',
    vi: 'Đi từng dòng bảng 3; kết thúc bằng hệ quả của phí cam kết.',
    targetSeconds: 250,
  },
  'f1-safeguards': {
    en: 'The ESF of 2016 applies to IPF projects from October 2018 and sets ten standards, including ESS5 on land and resettlement. TEP and CCSEP still used the older Safeguard Policies, and these rules are often stricter than Vietnamese ones.',
    vi: 'Khung ESF, 10 tiêu chuẩn ESS (nhấn ESS5), khung đấu thầu và Nha Trang.',
    targetSeconds: 170,
  },
};
