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
    en: "Good morning. We are Group 6, and our paper looks at the IBRD and how it finances development projects in Vietnam. We will walk you through the bank floor by floor.",
    vi: "Chào hội đồng, giới thiệu nhóm 6 và đề tài; mời mọi người \"bước vào ngân hàng\".",
    targetSeconds: 20,
  },
  'f1-rationale-2': {
    en: "As its economy grew, Vietnam moved from cheap IDA credits to IBRD loans. IBRD money costs more than IDA credits but less than most commercial loans, so it must be used carefully.",
    vi: "Mốc từ IDA sang IBRD và con đường trung gian về chi phí.",
    targetSeconds: 60,
  },
  'f1-problem': {
    en: "IBRD loans come with different terms and procedures from the credits Vietnam knew. Our four questions move from what the IBRD is, to how it lends and supports projects, to what happened in Vietnam.",
    vi: "Vấn đề nghiên cứu và 4 câu hỏi.",
    targetSeconds: 40,
  },
  'f1-structure': {
    en: "Besides the introduction and conclusion, the paper has three chapters, and in this tour each chapter is a floor of the bank. We now walk into the banking hall.",
    vi: "Ba chương = ba tầng; có thể bấm để nhảy tầng.",
    targetSeconds: 20,
  },
  // ---------------- Chapter 1 ----------------
  'f1-ch1-title': {
    en: "Chapter 1 gives an overview of the IBRD: what it is, how it developed, how it is organized and funded, and how it lends.",
    vi: "Mở đầu chương 1.",
    targetSeconds: 20,
  },
  'f1-what': {
    en: "The IBRD is a development cooperative owned by its member countries; with IDA it forms the World Bank. It lends mainly to middle-income countries, usually to governments or with a government guarantee.",
    vi: "Định nghĩa, sứ mệnh, đối tượng vay.",
    targetSeconds: 60,
  },
  'f1-wbg': {
    en: "Table 1.1.1 lists the five World Bank Group institutions. The key contrasts: cost of funds for IBRD versus IDA, clients for IBRD versus IFC, and MIGA and ICSID reduce risk rather than lend.",
    vi: "Đi nhanh từng dòng bảng 1.1.1 rồi nêu 3 khác biệt.",
    targetSeconds: 200,
  },
  'f1-history-1': {
    en: "The IBRD was created at Bretton Woods in 1944 and its first loan went to France in 1947. After the Marshall Plan it turned to developing countries and, later, to poverty reduction.",
    vi: "Giai đoạn 1 và 2.",
    targetSeconds: 80,
  },
  'f1-history-2': {
    en: "The debt crisis brought structural adjustment, the 1990s added governance and safeguards, and today the mission is shared prosperity on a livable planet, with the same funding model.",
    vi: "Giai đoạn 3, 4.",
    targetSeconds: 60,
  },
  'f1-gov': {
    en: "Three bodies run the IBRD. The Board of Executive Directors has only 25 seats for 189 members, so most countries share a seat; Vietnam sits in a ten-country constituency led by a director from Malaysia.",
    vi: "Ba cấp quản trị; nhấn mạnh nhóm cử tri 10 nước của Việt Nam.",
    targetSeconds: 140,
  },
  'f1-funds': {
    en: "The IBRD is funded by member capital, mostly callable and never called, and above all by AAA-rated bonds. That lets it lend at scale and low cost, though dearer than IDA.",
    vi: "Vốn góp, trái phiếu AAA, so với IDA.",
    targetSeconds: 80,
  },
  'f1-instruments': {
    en: "Table 1.4.1 shows the three instruments: IPF pays for inputs, DPF for reforms and PforR for results.",
    vi: "Ba công cụ cho vay: đầu vào – cải cách – kết quả.",
    targetSeconds: 100,
  },
  'f1-terms': {
    en: "The IBRD Flexible Loan costs a reference rate plus a variable spread, a one-off front-end fee and a commitment fee on undisbursed money, so slow disbursement raises the real cost.",
    vi: "Bảng 1.4.2 và hệ quả của phí cam kết.",
    targetSeconds: 160,
  },
  'f1-safeguards': {
    en: "Since 2018 new projects follow the Environmental and Social Framework with its ten standards in Table 1.4.3; land and resettlement under ESS5 are the hardest. These rules are often stricter than domestic ones.",
    vi: "Khung ESF, 10 tiêu chuẩn, khung đấu thầu.",
    targetSeconds: 120,
  },
  // ---------------- Chapter 2 ----------------
  'f2-ch2-title': {
    en: "Chapter 2 asks how the IBRD supports project financing: with money, technical support and training, and how the three fit together.",
    vi: "Mở đầu chương 2.",
    targetSeconds: 20,
  },
  'f2-cycle': {
    en: "Every IBRD operation passes through a six-stage cycle in which the borrower implements and the Bank advises, appraises, finances and supervises. In Vietnam it runs alongside domestic steps, which often causes delays.",
    vi: "Chu trình 6 bước, bảng 2.1.1.",
    targetSeconds: 160,
  },
  'f2-vn-procedures': {
    en: "The diagram puts the World Bank cycle next to Vietnam's own approvals; delays arise where the two meet.",
    vi: "Hai làn quy trình song song.",
    targetSeconds: 20,
  },
  'f2-disbursement': {
    en: "Money is paid out by advance, reimbursement, direct payment or special commitment, always against documents and before a deadline.",
    vi: "Bốn phương thức giải ngân, bảng 2.1.2.",
    targetSeconds: 120,
  },
  'f2-counterpart': {
    en: "The borrower pays part of every project, and that counterpart money is often what holds disbursement back.",
    vi: "Vốn đối ứng là ràng buộc chính.",
    targetSeconds: 20,
  },
  'f2-ipf': {
    en: "IPF pays as contracts progress, so delays in land clearance or bidding slow the money directly.",
    vi: "IPF trong thực tế.",
    targetSeconds: 20,
  },
  'f2-dpf': {
    en: "DPF releases money to the budget once agreed reforms are done; Vietnam's Public Investment Reform series is the example.",
    vi: "DPF và chuỗi PIR.",
    targetSeconds: 40,
  },
  'f2-pforr': {
    en: "PforR pays only for verified results and relies on the country's own systems, which shifts responsibility and risk to domestic agencies.",
    vi: "PforR và so sánh ba công cụ.",
    targetSeconds: 40,
  },
  'f2-prep': {
    en: "Technical support starts with preparation: the Bank's team checks design and viability, and a Preparation Advance can fund this work.",
    vi: "Chuẩn bị dự án và nghiên cứu khả thi.",
    targetSeconds: 80,
  },
  'f2-asa': {
    en: "Advisory Services and Analytics are the Bank's non-lending advice, funded three ways; Reimbursable Advisory Services matter more for Vietnam now.",
    vi: "ASA và RAS.",
    targetSeconds: 80,
  },
  'f2-me': {
    en: "Projects are tracked against a results framework at supervision, completion and independent evaluation, but system-wide indicators cannot be credited to one project.",
    vi: "Khung giám sát và đánh giá.",
    targetSeconds: 80,
  },
  'f2-training-pmu': {
    en: "Training works on people, skills and institutions; it sticks best when trained staff stay in the project units.",
    vi: "Đào tạo cho ban quản lý dự án.",
    targetSeconds: 60,
  },
  'f2-training-knowledge': {
    en: "Skills grow by doing and across projects, but safeguards are the hardest to transfer when local land rules differ.",
    vi: "Chuyển giao kiến thức.",
    targetSeconds: 80,
  },
  'f2-institutional': {
    en: "Table 2.3.1 shows typical institutional reforms. They last only if the borrower funds and sustains them.",
    vi: "Cải cách thể chế, bảng 2.3.1.",
    targetSeconds: 140,
  },
  'f2-three-forms': {
    en: "Table 2.4.1 shows finance, technical support and training at each stage; they reinforce one another.",
    vi: "Ba hình thức hỗ trợ, bảng 2.4.1.",
    targetSeconds: 140,
  },
  'f2-package': {
    en: "The package works only when domestic systems are ready: counterpart funds, land and PMU capacity are the binding constraints. Now we take the lift to Floor 3.",
    vi: "Chốt chương 2, đi thang máy lên tầng 3.",
    targetSeconds: 40,
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
  // ---------------- Chapter 3 · evaluation ----------------
  'f3-eval-achievements': {
    en: 'Across both projects, the IBRD mobilized long-term money and counterpart resources, raised technical standards such as smart-grid substations and sewer networks, and raised management standards through Bank procurement, financial and safeguard rules.',
    vi: 'Thành tựu: huy động vốn, nâng chuẩn kỹ thuật và quản lý.',
    targetSeconds: 130,
  },
  'f3-eval-limitations': {
    en: 'The limits were slow disbursement, double procedures, counterpart funding as the binding constraint, and gaps between Bank safeguards and domestic land rules, most visible in Nha Trang where only 29 percent of households had been compensated at closing.',
    vi: 'Hạn chế: giải ngân chậm, thủ tục phức tạp, vốn đối ứng, khác biệt chính sách an toàn.',
    targetSeconds: 130,
  },
  'f3-recs-1': {
    en: 'Because Vietnam will now borrow on IBRD terms, the paper recommends preparing projects fully before approval, securing counterpart funds and checking provincial debt capacity at the start, and aligning compensation with ESS5 from preparation.',
    vi: 'Khuyến nghị 1 – 3.',
    targetSeconds: 120,
  },
  'f3-recs-2': {
    en: 'It also recommends stable professional PMUs trained through the Open Learning Campus, shorter domestic procedures under Decree 242/2025, and a strategic choice of instruments, including PforR, DPF and Reimbursable Advisory Services.',
    vi: 'Khuyến nghị 4 – 6, rồi đi thang máy xuống.',
    targetSeconds: 95,
  },
  // ---------------- Conclusion + exit ----------------
  'lift-down': {
    en: 'As the lift goes down, we summarize: three pillars working as one package, two projects showing value and limits, and the binding constraints on the domestic side. We close with the paper’s significance, its limitations and directions for further research.',
    vi: 'Kết luận trong thang máy: mỗi tầng một phần.',
    targetSeconds: 170,
    beats: [
      { vi: 'Tầng 3: ba trụ cột hỗ trợ.' },
      { vi: 'Tầng 2: đánh giá lại tác động TEP, CCSEP.' },
      { vi: 'Tầng 1: ý nghĩa của đề tài.' },
      { vi: 'Tầng G: hạn chế nghiên cứu.' },
      { vi: 'Cửa mở: hướng nghiên cứu tiếp theo.' },
    ],
  },
  'ex-sources': {
    en: 'All 64 references are on this wall and searchable; any citation number in the tour opens the same list.',
    vi: 'Giới thiệu danh mục tài liệu tham khảo.',
    targetSeconds: 25,
  },
  'ex-thanks': {
    en: 'Thank you to our lecturer and to everyone listening. We are happy to take your questions.',
    vi: 'Cảm ơn cô và các bạn, mời đặt câu hỏi.',
    targetSeconds: 25,
  },
};
