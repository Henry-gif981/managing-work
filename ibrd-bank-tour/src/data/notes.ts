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
  // ---------------- Chapter 2 ----------------
  'f2-ch2-title': {
    en: 'Chapter 2 asks how the IBRD supports project financing: with money, with technical support, and with training. We end with an overall assessment of how the three fit together.',
    vi: 'Mở đầu chương 2, đọc 4 mục con.',
    targetSeconds: 25,
  },
  'f2-cycle': {
    en: 'Every operation passes through six stages, from identification to completion and evaluation. The borrower owns and implements the project, the Bank advises, appraises, finances and supervises, and projects can be restructured, as TEP was in 2019 and CCSEP in 2022.',
    vi: 'Đi lần lượt 6 giai đoạn của bảng 4; nhấn vai trò bên vay và Ngân hàng.',
    targetSeconds: 230,
  },
  'f2-vn-procedures': {
    en: 'In Vietnam each Bank stage runs alongside domestic steps: the project proposal, the investment decision, counterpart funds and on-lending. Delays sit at the joint; CCSEP became effective about five and a half months late.',
    vi: 'Hai làn quy trình song song; chậm trễ ở điểm nối.',
    targetSeconds: 60,
  },
  'f2-disbursement': {
    en: 'Money is paid out by advance, reimbursement, direct payment or special commitment. Every withdrawal needs documents, there is a minimum value and a deadline up to four months after closing, and CCSEP used all four methods.',
    vi: 'Bốn phương thức giải ngân trong bảng 5.',
    targetSeconds: 175,
  },
  'f2-counterpart': {
    en: 'The borrower pays part of the cost: in TEP, NPT provided 231.25 of 731.25 million dollars. Counterpart money is often the binding constraint; CCSEP had no disbursement in 2017 and 2018 because provincial allocations began only in July 2019.',
    vi: 'Vốn đối ứng: ràng buộc chính đối với giải ngân.',
    targetSeconds: 90,
  },
  'f2-ipf': {
    en: 'IPF is built from components, a results framework and an implementing agency. TEP had three components run by NPT’s regional boards, so delays in land clearance or bidding slowed disbursement directly.',
    vi: 'IPF trong thực tế, ví dụ TEP.',
    targetSeconds: 60,
  },
  'f2-dpf': {
    en: 'DPF releases money to the budget once prior actions are done. Vietnam’s Public Investment Reform series began with a 500 million dollar IBRD loan in 2009, then 87.3 million IBRD plus 262.7 million IDA in May 2011; a 2010 power-sector DPF combined 200 and 111.8 million.',
    vi: 'Chuỗi PIR và DPF ngành điện, đọc các con số trên thẻ.',
    targetSeconds: 90,
  },
  'f2-pforr': {
    en: 'PforR pays only when an agreed agency verifies the DLIs, and it relies on the country’s own systems. IPF builds assets, DPF supports reforms, PforR rewards performance; a results-based design moves risk onto domestic agencies.',
    vi: 'PforR và kết luận về ba công cụ.',
    targetSeconds: 90,
  },
  'f2-prep': {
    en: 'Technical support starts with preparation: a Bank task team checks design and viability, as with TEP’s 31.4 percent EIRR. CCSEP prepared an ESIA per city, and IEG found better preparation would have avoided TEP’s extension.',
    vi: 'Hỗ trợ kỹ thuật: chuẩn bị dự án và nghiên cứu khả thi.',
    targetSeconds: 120,
  },
  'f2-asa': {
    en: 'Advisory Services and Analytics are the Bank’s non-lending work. In 2023 they cost 991 million dollars, 68 percent from trust funds, and paid advice through RAS is becoming relevant for Vietnam.',
    vi: 'ASA: nguồn tài trợ 26/68/6 và RAS.',
    targetSeconds: 120,
  },
  'f2-me': {
    en: 'Projects are tracked against a results framework through ISRs, the ICR and IEG validation. TEP was rated highly satisfactory, while CCSEP was downgraded in 2022 and later re-rated, and M&E has limits when indicators measure the whole system.',
    vi: 'Khung giám sát – đánh giá, ba cấp và các xếp hạng.',
    targetSeconds: 150,
  },
  'f2-training-pmu': {
    en: 'Training works on people, skills and institutions. TEP used NPT’s three regional boards and CCSEP one PMU per province; training sticks when staff stay, yet weak PMU capacity still caused delays.',
    vi: 'Đào tạo cho ban quản lý dự án.',
    targetSeconds: 120,
  },
  'f2-training-knowledge': {
    en: 'Most transfer happens on real contracts, plus courses such as the 2014 public procurement MOOC. TEP’s boards built lasting skills, but Nha Trang shows safeguards are harder to transfer when local rules differ.',
    vi: 'Chuyển giao kiến thức về đấu thầu và an toàn.',
    targetSeconds: 90,
  },
  'f2-institutional': {
    en: 'Table 6 lists the institutional reforms in both cases, from NPT’s asset management system to CCSEP’s 14 performance-based contracts. Reform depends on the borrower: NPT paid 5.50 of the 5.74 million dollars for TEP’s capacity building.',
    vi: 'Bảng 6 và thông điệp: bên vay phải tự tài trợ và duy trì cải cách.',
    targetSeconds: 250,
  },
  'f2-three-forms': {
    en: 'Table 7 shows finance, technical support and training at each stage of the cycle. They reinforce one another: money gives weight to advice, advice protects the money, and training protects the results.',
    vi: 'Bảng 7 và ba cách các hình thức hỗ trợ bổ trợ nhau.',
    targetSeconds: 200,
  },
  'f2-package': {
    en: 'The package only works when domestic systems are ready: counterpart funds, land and PMU capacity are the binding constraints. Chapter 3 tests this on two projects, so we take the lift to Floor 3.',
    vi: 'Chốt chương 2 và chuyển sang chương 3.',
    targetSeconds: 60,
  },
  // ---------------- Chapter 3 · context ----------------
  'f3-ch3-title': {
    en: 'Chapter 3 applies the framework to Vietnam: first the context of the partnership, then TEP on the left of this room and CCSEP on the right, and finally the evaluation in the office at the end. Throughout, we separate planned money from money actually spent.',
    vi: 'Giới thiệu chương 3 và bố cục tầng: TEP bên trái, CCSEP bên phải.',
    targetSeconds: 55,
  },
  'f3-1993': {
    en: 'The Bank resumed lending in October 1993 with two IDA credits and opened its Hanoi office in 1994. Over two decades its role went beyond money, and the paper stresses that "World Bank financing" may be either IDA or IBRD.',
    vi: 'Mốc 1993 – 1994 và phân biệt IDA / IBRD.',
    targetSeconds: 60,
  },
  'f3-ida-graduation': {
    en: 'Vietnam graduated from IDA on 1 July 2017, with transitional IDA18 support of SDR 1.593 billion. IBRD terms are closer to the market, but the IBRD was not new: TEP was approved for an IBRD loan in August 2014.',
    vi: 'Tốt nghiệp IDA là thay đổi cơ cấu và điều kiện vay, không phải thay thế toàn bộ.',
    targetSeconds: 120,
  },
  'f3-sahep': {
    en: 'SAHEP, approved in May 2017 with an IDA credit of SDR 114.3 million, shows the late IDA pipeline. Table 8 puts it next to TEP; the comparison is institutional, not about sector outputs.',
    vi: 'Đi từng dòng bảng 8, so sánh TEP và SAHEP.',
    targetSeconds: 230,
  },
  'f3-legal': {
    en: 'Projects live under two systems, Vietnamese rules and World Bank rules, and delays come where they do not align. Table 9 traces the ODA decrees from 38/2013 to today’s 242/2025 as amended by 119/2026; TEP must be judged by the rules of its own period.',
    vi: 'Khung pháp lý ODA theo thời gian, đọc bảng 9.',
    targetSeconds: 290,
  },
  // ---------------- Chapter 3 · TEP ----------------
  'f3-tep-overview': {
    en: 'TEP, loan IBRD-84170, was approved on 7 August 2014, became effective in February 2015 and closed in December 2021 after a two-year extension. NPT implemented it through three regional boards, and the planned cost was 731.25 million dollars, including a 500 million IBRD loan.',
    vi: 'Tổng quan TEP và bảng 10.',
    targetSeconds: 240,
  },
  'f3-tep-cost': {
    en: 'Table 11 shows every component cost less than planned: infrastructure 74.32 percent, smart grid 57.51 and capacity building 22.96, so the project cost 70.77 percent of its budget. Figure 2 shows the same gap bar by bar.',
    vi: 'Bảng 11 và biểu đồ 2: chi phí thực tế thấp hơn dự toán.',
    targetSeconds: 330,
  },
  'f3-tep-financing': {
    en: 'Of the 500 million committed, the IBRD disbursed 318.53 million, 63.7 percent: 289.03 for infrastructure, 28.01 for smart grid, 0.24 for capacity building and the 1.25 fee. Capacity building was almost all paid by NPT.',
    vi: 'Bảng 12, biểu đồ 1: cam kết và giải ngân IBRD.',
    targetSeconds: 250,
  },
  'f3-tep-impl': {
    en: 'Capacity building planned four strands, but the IBRD funded mainly the asset management system; NPT paid for tariff, IFRS and laboratory work. Boards gained skills, though the paper refuses to invent trainee numbers, and smart-grid approval took about four years.',
    vi: 'Bảng 13: hệ thống thể chế và số hoá.',
    targetSeconds: 270,
  },
  'f3-tep-outputs': {
    en: 'TEP beat most output targets: 981 km of new lines against 920, 261 km rehabilitated against 120, 4,263 MW against 3,950, all five 500-kV substations and ten of eleven 220-kV ones. Each bar points to its piece of equipment in the room.',
    vi: 'Bảng 14 và biểu đồ 3, chỉ từng thanh vào mô hình.',
    targetSeconds: 210,
  },
  'f3-tep-outcomes': {
    en: 'O&M cost per MWh fell from 0.87 to 0.67 dollars and unserved energy from 4,875 to 817 MWh, but transmission losses rose again to 2.54 percent in 2022. The re-estimated EIRR is 52.6 percent, a model result, not a cash return.',
    vi: 'Bảng 15, biểu đồ 4 và EIRR; nhấn mạnh chỉ số toàn hệ thống.',
    targetSeconds: 300,
  },
  'f3-tep-gap': {
    en: 'The IBRD disbursed 181.47 million less than committed, 36.3 percent, and total cost was 213.72 million below appraisal, partly from lower prices and competition. IEG’s 160 million of cancelled savings is a different accounting concept.',
    vi: 'Bảng 16: khoảng cách cam kết – giải ngân, chậm trễ, tái định cư.',
    targetSeconds: 360,
  },
  'f3-tep-assess': {
    en: 'TEP combined capital investment, technology and institutional work, with strong outputs but a long smart-grid preparation and a large undisbursed balance. Its PPAR rated the outcome highly satisfactory; the lessons are to look at disbursed money and not to over-attribute system results.',
    vi: 'Bốn tiêu chí đánh giá TEP và ba kết luận.',
    targetSeconds: 270,
  },
  // ---------------- Chapter 3 · CCSEP ----------------
  'f3-ccsep-overview': {
    en: 'CCSEP addressed coastal cities where only about 10 percent of urban wastewater was treated. It covered Dong Hoi, Quy Nhon, Nha Trang and Phan Rang-Thap Cham, became effective in January 2018 instead of August 2017, and closed in June 2024.',
    vi: 'Tổng quan CCSEP, bảng 17, bốn thành phố trên bản đồ.',
    targetSeconds: 270,
  },
  'f3-ccsep-structure': {
    en: 'The 273.6 million dollar project blended a 46 million IBRD loan with a 190.2 million IDA credit and 37.4 million of counterpart funds. The whole IBRD loan was on-lent to provinces, so it was real debt, and it fully financed the roads and bridges of Component 2.',
    vi: 'Cơ cấu tài chính, biểu đồ 5, 6 và bảng 18.',
    targetSeconds: 480,
  },
  'f3-ccsep-cities': {
    en: 'Phan Rang received the most, 87.9 million, and Nha Trang and Dong Hoi most of the IBRD money. In 2022 the Bank cancelled 11.8 million of IBRD and about 34 million of IDA funds, and counterpart funding rose to 50 million.',
    vi: 'Biểu đồ 7, bảng 19, tái cơ cấu 2022.',
    targetSeconds: 420,
  },
  'f3-ccsep-impl': {
    en: 'By late 2022 only about 36 percent of the loan had been disbursed because counterpart funds arrived only from July 2019 and resettlement stalled, especially in Nha Trang. Reforms such as the 14 performance-based contracts came late but were completed.',
    vi: 'Triển khai CCSEP: giải ngân chậm, tái định cư, năng lực PMU.',
    targetSeconds: 390,
  },
  'f3-ccsep-results': {
    en: 'At completion CCSEP reached 94 percent of its beneficiary target and 89 percent of sewer connections, with full cost recovery, 22 km of roads and five bridges. The ICR rated it moderately satisfactory and IEG satisfactory, but Nha Trang lagged far behind.',
    vi: 'Bảng 20, các xếp hạng và kết quả khí hậu.',
    targetSeconds: 390,
  },
  'f3-ccsep-nhatrang': {
    en: 'In Nha Trang only 160 of 585 compensation plans were approved and only 138 of 469 households were compensated at closing. Residents complained to the Inspection Panel in August 2023, which later found non-compliance in two areas.',
    vi: 'Nha Trang: tái định cư, khiếu nại và kết luận của Ban Thanh tra.',
    targetSeconds: 240,
  },
};
