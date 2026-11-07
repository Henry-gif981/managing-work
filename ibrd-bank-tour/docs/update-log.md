# Update log (_9 → _10 paper, fix list "Fix chap 2.pdf")

Scene and beat numbers are 1-based and refer to the scene list **before** this update (64 scenes). Texts are excerpts (citations stripped).

## Scenes removed (5)

| # (old) | Scene | Beats | Reason |
|---|---|---|---|
| 3 | `f1-rationale-1` | 3 | Update brief part 1 (Introduction keeps 3 scenes; 1.3.2 omitted on purpose) |
| 6 | `f1-objectives` | 4 | Update brief part 1 (Introduction keeps 3 scenes; 1.3.2 omitted on purpose) |
| 7 | `f1-method` | 5 | Update brief part 1 (Introduction keeps 3 scenes; 1.3.2 omitted on purpose) |
| 8 | `f1-scope` | 2 | Update brief part 1 (Introduction keeps 3 scenes; 1.3.2 omitted on purpose) |
| 16 | `f1-voting` | 4 | Update brief part 1 (Introduction keeps 3 scenes; 1.3.2 omitted on purpose) |

Result: **59 scenes**.

## Fix-list scene numbers vs actual ids

| Fix list | Expected id | Actual id at that position | Match |
|---|---|---|---|
| Scene 23 | `f2-cycle` | `f2-cycle` | yes |
| Scene 24 | `f2-vn-procedures` | `f2-vn-procedures` | yes |
| Scene 25 | `f2-disbursement` | `f2-disbursement` | yes |
| Scene 26 | `f2-counterpart` | `f2-counterpart` | yes |
| Scene 27 | `f2-ipf` | `f2-ipf` | yes |
| Scene 28 | `f2-dpf` | `f2-dpf` | yes |
| Scene 29 | `f2-pforr` | `f2-pforr` | yes |
| Scene 30 | `f2-prep` | `f2-prep` | yes |
| Scene 31 | `f2-asa` | `f2-asa` | yes |
| Scene 32 | `f2-me` | `f2-me` | yes |

All ten positions match; no beat had to be located by its quoted text. The fix list calls scene 31 an "added" scene; `f2-asa` already existed at that position, so its beats 1 and 4 were rewritten as given and beats 2-3 were derived from the _10 text.

## Beats changed, merged or deleted (Floors 1-2)

### `ext-facade` (old scene 1): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **THE IBRD AND ITS DEVELOPMENT PROJECT FINANCING ACTIVITIES IN VIETNAM** ·  | unchanged |

### `ext-door` (old scene 2): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **** ·  | unchanged |

### `f1-rationale-2` (old scene 4): 3 → 3 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Why the IBRD matters for Vietnam** · For many years, Vietnam relied on IDA, the World Bank's window for low-income countries, which offers loans with very low interest rates and long repa… | **From IDA to IBRD** · As its economy grew, Vietnam moved from cheap International Development Association (IDA) credits to International Bank for Reconstruction and Develop… (22 words) |
| 2 | **A middle path** · This shift makes the IBRD Vietnam's main source of World Bank financing. IBRD loans are more expensive than IDA credits, but still cheaper and longer-… | **A middle path** · The IBRD is now Vietnam's main source of World Bank financing. Its loans cost more than IDA credits but remain cheaper and longer-term than most comme… (39 words) |
| 3 | **Choosing projects more carefully** · Higher borrowing costs mean Vietnam must choose and manage projects more carefully. After graduation, Deputy Prime Minister Pham Binh Minh asked the M… | **Choosing projects carefully** · Higher borrowing costs mean Vietnam must choose and manage projects more carefully . Beyond money, the IBRD brings appraisal, technical advice and int… (30 words) |

### `f1-problem` (old scene 5): 2 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Research problem** · Since graduating from IDA, Vietnam has relied more on the IBRD for World Bank financing. However, IBRD loans come with different terms and procedures … | **Research problem** · Since graduating from IDA, Vietnam relies more on the IBRD. Its loans come with different terms and procedures from the concessional credits Vietnam k… (35 words) |
| 2 | **Four research questions** · The paper addresses 4 research questions:What is the IBRD, and how was it formed and developed?How is the IBRD organized and funded, and on what terms… | **Four research questions** · What is the IBRD, and how did it develop?How is it organized and funded, and on what terms does it lend?How does it support projects through financial… (41 words) |

### `f1-structure` (old scene 9): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Structure of the paper** · Apart from the Introduction, Conclusion and References, the paper consists of 3 chapters. In this tour each chapter is a floor; click one to jump ther… | **Structure of the paper** · Besides the Introduction, Conclusion and References, the paper has three chapters. Here each chapter is a floor: click one to go there. (22 words) |

### `f1-ch1-title` (old scene 10): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Chapter 1 · Overview of the IBRD** · 1.1 What is the IBRD?1.2 History and development1.3 Organizational structure1.4 Financing instruments and loan conditions | unchanged |

### `f1-what` (old scene 11): 3 → 3 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Definition** · The International Bank for Reconstruction and Development (IBRD) is a global development cooperative owned by 189 member countries. It is one of the 5… | **A development cooperative** · The International Bank for Reconstruction and Development (IBRD) is owned by 189 member countries and, with IDA, forms the World Bank . It is not prof… (36 words) |
| 2 | **Role and mission** · Its role goes beyond lending: it provides loans, guarantees, risk management products and advisory services, and it also coordinates responses to regi… | **Role and mission** · Besides loans, it offers guarantees, risk management and advisory services. It shares the World Bank Group's mission: end extreme poverty and boost sh… (34 words) |
| 3 | **Borrowers and eligibility** · The IBRD's main borrowers are middle-income countries. It also lends to creditworthy poorer countries that are also eligible for IDA support, often th… | **Who can borrow** · Main borrowers are middle-income countries and creditworthy poorer ones. Lending goes to governments, or to public bodies with a government guarantee.… (35 words) |

### `f1-wbg` (old scene 12): 10 → 10 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Five institutions, one goal** · The World Bank Group consists of five institutions. Each has its own role, but they work together toward the same goal. The IBRD is the oldest member,… | **Five institutions, one goal** · The World Bank Group has five institutions working towards one goal. The IBRD, founded in 1944, is the oldest and the largest development bank; with I… (35 words) |
| 2 | **Table 1 · The five institutions** ·  | **Table 1.1.1 · The five institutions** ·  (0 words) |
| 3 | **Table 1 · The five institutions** ·  | **Table 1.1.1 · The five institutions** ·  (0 words) |
| 4 | **Table 1 · The five institutions** ·  | **Table 1.1.1 · The five institutions** ·  (0 words) |
| 5 | **Table 1 · The five institutions** ·  | **Table 1.1.1 · The five institutions** ·  (0 words) |
| 6 | **Table 1 · The five institutions** ·  | **Table 1.1.1 · The five institutions** ·  (0 words) |
| 7 | **Key differences · IBRD / IDA** · The key difference between the IBRD and IDA lies in the type of borrower and the cost of funds. IBRD loans carry market-based interest rates, while ID… | **Key differences · IBRD / IDA** · IBRD loans carry market-based interest rates; IDA, funded by donors, offers much cheaper terms. (14 words) |
| 8 | **Key differences · IBRD / IFC** · The IBRD and IFC differ mainly in their clients. The IBRD lends to governments or to entities guaranteed by governments, while IFC invests directly in… | **Key differences · IBRD / IFC** · The IBRD lends to governments or government-guaranteed bodies; IFC invests in private companies without a guarantee. (16 words) |
| 9 | **Key differences · MIGA / ICSID** · MIGA and ICSID do not provide finance directly. Instead, they reduce risks for investors and help settle disputes, which makes the investment climate … | **Key differences · MIGA / ICSID** · MIGA and ICSID do not lend: they reduce investors' risks and settle disputes, making the investment climate more attractive. (19 words) |
| 10 | **The main public channel** · In this structure, the IBRD acts as the main channel for public financing to middle-income countries.This is why it is especially important for Vietna… | **The main public channel** · In this structure, the IBRD is the main channel for public financing to middle-income countries, which is why it matters so much for Vietnam today. (25 words) |

### `f1-history-1` (old scene 13): 4 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Four stages** · The history of the IBRD can be divided into 4 main stages, each reflecting changes in the global economy and in the needs of member countries. | **Four stages** · The IBRD's history falls into four stages, each reflecting changes in the world economy and in members' needs. (18 words) |
| 2 | **Founding and post-war reconstruction** · 1944-1950s. The IBRD was created at the Bretton Woods Conference in July 1944, together with the International Monetary Fund, as part of the effort to… | **Founding and reconstruction** · Created at Bretton Woods in July 1944 with the IMF, the IBRD began work in 1946. Its first loan, USD 250 million, went to France in 1947, the year of … (33 words) |
| 3 | **From Europe to developing countries** · However, when the United States launched the Marshall Plan in 1948, much of Europe's reconstruction was financed through that program.This led the IBR… | **From Europe to developing countries** · When the Marshall Plan (1948) took over most of Europe's reconstruction, the IBRD turned its attention to developing countries . (19 words) |
| 4 | **Shift to development and expansion** · 1950s-1970s. The IBRD mainly financed large infrastructure projects such as power plants, roads, railways and irrigation systems in Asia, Africa and L… | **Shift to development** · The IBRD financed power plants, roads, railways and irrigation. IFC (1956) and IDA (1960) took other roles, and under Robert McNamara lending shifted … (30 words) |

### `f1-history-2` (old scene 14): 3 → 3 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Crisis and reform** · 1980s-1990s. The debt crisis of the 1980s hit many developing countries hard. In response, the IBRD introduced structural adjustment lending, which pr… | **Crisis and reform** · After the 1980s debt crisis, structural adjustment lending traded funds for reforms; it helped some countries but was criticized for its social costs.… (30 words) |
| 2 | **The 21st century** · 2000-present. The IBRD aligned its work with global development goals and played a counter-cyclical role, sharply increasing lending during the 2008 g… | **The 21st century** · The IBRD lent counter-cyclically in the 2008 crisis and COVID-19. Its mission today: end extreme poverty and boost shared prosperity on a livable plan… (30 words) |
| 3 | **Same model, wider focus** · After more than 80 years, the IBRD has changed from a reconstruction bank for Europe into a global development institution.Its funding model of borrow… | **Same model, wider focus** · After more than 80 years, the IBRD has grown from a reconstruction bank into a global development institution, still borrowing on capital markets and … (27 words) |

### `f1-gov` (old scene 15): 4 → 7 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Board of Governors** · The highest decision-making body of the IBRD. Each member country appoints one Governor and one Alternate Governor, usually the minister of finance or… | **Board of Governors** · The highest decision-making body: one Governor per member, usually the finance minister or central bank governor. It meets once a year, keeps the bigg… (37 words) |
| 2 | **Board of Executive Directors** · The President and 25 Executive Directors, working at headquarters in Washington, D.C. and meeting several times a week. The Board approves loans, guar… | **Board of Executive Directors** · The President and 25 Executive Directors meet several times a week in Washington, D.C. They approve loans, guarantees and the budget. With 189 members… (35 words) |
| 3 | **President** · The President chairs the Board of Executive Directors and leads the entire World Bank Group. The President is selected by the Executive Directors for … | **Who has a seat of its own** · The six largest shareholders each appoint their own Executive Director: the United States, Japan, China, Germany, France and the United Kingdom. Saudi… (30 words) |
| 4 | **A division of roles** · In short, the Board of Governors sets the overall direction, the Board of Executive Directors turns it into policies and approves operations, and the … | **Constituencies** · All other members form constituencies. Each group jointly elects one Executive Director, supported by an Alternate Executive Director, who speaks for … (28 words) |
| 5 |  | **Vietnam's voice on the Board** · Vietnam has no seat of its own: it sits in a ten-country constituency. As of November 2026 it is represented by Executive Director John Patrick Antony… (40 words) |
| 6 |  | **President** · The President chairs the Board and leads the World Bank Group, for a five-year renewable term, voting only to break a tie. Ajay Banga has held the pos… (32 words) |
| 7 |  | **A division of roles** · Governors set direction · Directors approve operations · President carries them out. This balances members' interests with efficient management. (17 words) |

### `f1-funds` (old scene 17): 5 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Two main sources** · The IBRD funds its lending mainly from two sources: capital from its member countries and money raised by issuing bonds on international capital marke… | **Paid-in and callable capital** · Members subscribe shares, but only a small part is paid in. The rest is callable capital, payable only if the IBRD cannot pay bondholders, and never c… (34 words) |
| 2 | **Callable capital and equity** · The rest is callable capital, which members promise to pay only if the IBRD cannot meet its obligations to bondholders. This call has never been made … | **Bonds on capital markets** · The largest source is bonds sold worldwide. A long-held AAA rating lets the IBRD borrow cheaply and pass the savings on; it also issues green and sust… (29 words) |
| 3 | **Bond issuance** · The largest source of funds is borrowing on international capital markets. Acting as a financial intermediary, the IBRD issues bonds in many currencie… | **Other sources** · Loan repayments are lent again and net income strengthens capital. Newer tools such as hybrid capital and shareholder guarantees raise lending capacit… (26 words) |
| 4 | **Green bonds and other sources** · In recent years, the IBRD has also issued sustainable development bonds and green bonds, linking investors' money to social and environmental goals .O… | **IBRD versus IDA funding** · IDA relies on donations; the IBRD funds itself through the market. It can lend at scale and low cost, but its loans are more expensive than IDA credit… (28 words) |
| 5 | **IBRD versus IDA funding** · This funding model is the main difference between the IBRD and IDA. IDA depends on regular donations from rich countries, while the IBRD can fund itse… | *(deleted / merged)* |

### `f1-instruments` (old scene 18): 5 → 5 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Three instruments, one loan product** · The IBRD lends through three instruments, each defined by what it finances and what triggers disbursement.A single loan product, the IBRD Flexible Loa… | **Three instruments, one loan** · The IBRD lends through three instruments, defined by what they finance and what triggers payment. One product, the IBRD Flexible Loan, sets price and … (32 words) |
| 2 | **Table 2 · Three lending instruments** · IPF is the IBRD's traditional instrument. It finances a ring-fenced set of project activities such as civil works, equipment and consulting services; … | **Table 1.4.1 · Three lending instruments** · Investment Project Financing (IPF) pays for project works, goods and services as costs are incurred; it suits infrastructure with a clear scope . (22 words) |
| 3 | **Table 2 · Three lending instruments** · DPF supports a set of policy and institutional reforms rather than a project. The borrower must complete agreed "prior actions" before the Board appro… | **Table 1.4.1 · Three lending instruments** · Development Policy Financing (DPF) supports reforms: after agreed prior actions, money goes to the budget . Vietnam's first IBRD loan, USD 500 million… (28 words) |
| 4 | **Table 2 · Three lending instruments** · PforR was introduced in 2012. It was only the third financing instrument approved by the Bank's Board since 1944 . PforR supports a government's own p… | **Table 1.4.1 · Three lending instruments** · Program-for-Results (PforR), introduced in 2012, funds a government's own program and pays on verified Disbursement-Linked Indicators (DLIs) . (17 words) |
| 5 | **What the IBRD "buys"** · The key difference lies in what the IBRD "buys" with each loan: under IPF, it pays for inputs; under DPF, for reforms; under PforR, for results. This … | **What the IBRD "buys"** · Under IPF the IBRD pays for inputs, under DPF for reforms, under PforR for results. This choice shapes the borrower's obligations. (21 words) |

### `f1-terms` (old scene 19): 9 → 8 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Table 3 · IBRD Flexible Loan** · The IBRD Flexible Loan (IFL) is the Bank's leading loan product for public-sector borrowers in middle-income countries . Its cost reflects the IBRD's … | **Table 1.4.2 · IBRD Flexible Loan** · The IBRD Flexible Loan is the main product for middle-income governments. Its cost has three parts: an interest rate, a front-end fee and a commitment… (26 words) |
| 2 | **Table 3 · IBRD Flexible Loan** · The interest rate = market reference rate + spread. The reference rate was LIBOR until its phase-out; US dollar loans now use the Secured Overnight Fi… | **Table 1.4.2 · IBRD Flexible Loan** · Rate = reference rate + spread. The London Interbank Offered Rate (LIBOR) has given way to the Secured Overnight Financing Rate (SOFR); since 2021 new… (28 words) |
| 3 | **Table 3 · IBRD Flexible Loan** · Maturities are long by market standards. In 2014, the maximum final maturity of a standard IFL was extended from 30 years to 35 years . For some proje… | **Table 1.4.2 · IBRD Flexible Loan** · In 2014 the maximum final maturity rose from 30 years to 35 years; some projects can reach 50 years . (19 words) |
| 4 | **Table 3 · IBRD Flexible Loan** · In the same 2014 change, the maximum average maturity was extended from 18 years to 20 years . | **Table 1.4.2 · IBRD Flexible Loan** · The maximum average maturity rose from 18 years to 20 years in the same reform . (15 words) |
| 5 | **Table 3 · IBRD Flexible Loan** · In October 2024, the IBRD added a Short Maturity Loan with a 7-year final maturity and a 20 bps discount on the spread . | **Table 1.4.2 · IBRD Flexible Loan** · Since October 2024, a Short Maturity Loan offers a 7-year final maturity with a 20 bps spread discount . (18 words) |
| 6 | **Table 3 · IBRD Flexible Loan** · The front-end fee is 0.25% of the committed amount, charged once . | **Table 1.4.2 · IBRD Flexible Loan** · A one-off front-end fee of 0.25% of the committed amount . (10 words) |
| 7 | **Table 3 · IBRD Flexible Loan** · The commitment fee is 0.25% a year on the undisbursed balance, charged from 60 days after signing . | **Table 1.4.2 · IBRD Flexible Loan** · A commitment fee of 0.25% a year on the undisbursed balance, from 60 days after signing . (16 words) |
| 8 | **Borrower choices** · Within these limits, the borrower chooses the currency, the grace period and the repayment schedule.TEP had a 26 years maturity with a 10 years grace … | **Table 1.4.2 · IBRD Flexible Loan** · Because it is charged on undisbursed balances, slow disbursement raises the effective cost of the loan. (16 words) |
| 9 | **Table 3 · IBRD Flexible Loan** · The commitment fee has a practical consequence. Because it is charged on undisbursed balances, slow disbursement raises the effective cost of the loan… | *(deleted / merged)* |

### `f1-safeguards` (old scene 20): 6 → 6 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Rules that come with the money** · IBRD financing comes with rules on environmental and social risks and on procurement. These rules apply mainly to IPF; DPF and PforR operations follow… | **Rules that come with the money** · IBRD money comes with environmental, social and procurement rules, mainly for IPF. The Environmental and Social Framework (ESF), approved on 4 August … (34 words) |
| 2 | **Old and new systems in parallel** · Earlier projects continue under the older Safeguard Policies, such as OP 4.12 on involuntary resettlement. The two systems are expected to run in para… | **Old and new systems** · Earlier projects stay under the older Safeguard Policies, such as Operational Policy (OP) 4.12 on involuntary resettlement. The two systems run in par… (27 words) |
| 3 | **The ten Environmental and Social Standards** · The ESF shifts more responsibility to the borrower. It sets out 10 Environmental and Social Standards (ESSs) that borrowers must meet throughout the p… | **Table 1.4.3 · Ten Environmental and Social Standards** · The ESF shifts responsibility to the borrower, who must meet ten Environmental and Social Standards (ESSs) throughout the project . (19 words) |
| 4 | **The ten Environmental and Social Standards** · ESS5: Land Acquisition, Restrictions on Land Use and Involuntary Resettlement. Requirements are often stricter than domestic rules, especially on land… | **Table 1.4.3 · Ten Environmental and Social Standards** · ESS5 covers land acquisition, restrictions on land use and involuntary resettlement: often the hardest standard to meet. (17 words) |
| 5 | **Procurement Framework** · Procurement follows a separate framework. The Procurement Framework applies to projects with a concept note on or after 1 July 2016 . It replaced the … | **Procurement Framework** · The Procurement Framework applies to projects with a concept note on or after 1 July 2016 . It allows tailored approaches, and each new project prepar… (32 words) |
| 6 | **Stricter than domestic rules** · These requirements are often stricter than domestic rules, especially on land compensation and resettlement.Where the two systems differ, projects fac… | **Stricter than domestic rules** · These requirements are often stricter than domestic rules, especially on land compensation and resettlement. Where the two systems differ, projects ca… (29 words) |

### `lift-1-2` (old scene 21): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **** ·  | unchanged |

### `f2-ch2-title` (old scene 22): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Chapter 2 · How the IBRD supports project financing** · 2.1 Financial support2.2 Technical support2.3 Training and capacity building2.4 Overall assessment | unchanged |

### `f2-cycle` (old scene 23): 8 → 8 beats

| Beat | Before | After |
|---|---|---|
| 1 | **A fixed sequence of steps** · Financial support is the IBRD's core activity, but money reaches a project only through a fixed sequence of steps: the project cycle, the way funds ar… | **Financial support** · The IBRD delivers financial support through specific mechanisms: project cycle, disbursement procedures, and financial instruments.First, the IBRD pro… (41 words) |
| 2 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 3 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 4 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 5 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 6 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 7 | **Table 4 · The project cycle** ·  | **Table 2.1.1 · The project cycle** ·  (0 words) |
| 8 | **The cycle does not end with approval** · During implementation, a project can be restructured when its scope, costs or timing change. TEP was restructured in 2019 and extended by 2 years. CCS… | **Project cycle** · The project cycle continues after approval. Projects can be restructured when scope, costs, or timing change.In Vietnam, IBRD processes must run along… (37 words) |

### `f2-vn-procedures` (old scene 24): 2 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Two systems side by side** · In Vietnam, each stage also runs alongside domestic procedures: approval of the project proposal, the investment decision, the allocation of counterpa… | **Two systems side by side** ·  (0 words) |
| 2 | **Where delays arise** · Delays often arise at the joint between the two systems. CCSEP, for example, became effective about 5.5 months later than planned (see Section 3.3.3). | *(deleted / merged)* |

### `f2-disbursement` (old scene 25): 6 → 6 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Table 5 · Disbursement methods** · Once a loan is effective, the IBRD releases funds through 4 disbursement methods, set out in each project's disbursement letter . | **Table 2.1.2 · Disbursement methods** · Once a loan is effective, the IBRD releases funds through four disbursement methods, set out in each project's disbursement letter . (20 words) |
| 2 | **Table 5 · Disbursement methods** ·  | **Table 2.1.2 · Disbursement methods** ·  (0 words) |
| 3 | **Table 5 · Disbursement methods** ·  | **Table 2.1.2 · Disbursement methods** ·  (0 words) |
| 4 | **Table 5 · Disbursement methods** ·  | **Table 2.1.2 · Disbursement methods** ·  (0 words) |
| 5 | **Table 5 · Disbursement methods** ·  | **Table 2.1.2 · Disbursement methods** ·  (0 words) |
| 6 | **Documents, minimums and deadlines** · Each withdrawal must be supported by documents such as statements of expenditure or interim financial reports. The Bank also sets a minimum value for … | **Documents, minimums and deadlines** · Each fund withdrawal requires supporting documents, minimum application value, and disbursement deadline (often up to 4 months) . (17 words) |

### `f2-counterpart` (old scene 26): 3 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **The borrower pays a share** · The IBRD rarely finances the whole project. The borrower contributes counterpart funding, which typically covers costs the Bank does not finance.In CC… | **Counterpart funding requirements** · The IBRD rarely finances the whole project, so the borrower contributes counterpart funding. This funding is often the binding constraint on disbursem… (34 words) |
| 2 | **TEP: who paid for what** · In TEP, NPT provided US$231.25 million of the planned US$731.25 million . | *(deleted / merged)* |
| 3 | **The binding constraint** · Counterpart funding is often the binding constraint on disbursement. In CCSEP, provincial budget allocations began only in July 2019, so there was no … | *(deleted / merged)* |

### `f2-ipf` (old scene 27): 2 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **IPF: components and contracts** · Investment Project Financing is organized around components, a results framework and an implementing agency. Each component has its own budget and fin… | **Investment Project Financing (IPF)** · IPF is organized around components, a results framework, and an implementing agency. Each component has its own budget, and because disbursement follo… (36 words) |
| 2 | **TEP as the model** · TEP illustrates the model: 3 components, implemented by NPT's regional project management boards, with IBRD funds paid against works and equipment (se… | *(deleted / merged)* |

### `f2-dpf` (old scene 28): 3 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | **DPF: a policy matrix** · Development Policy Financing works through a policy matrix. The government completes prior actions, such as issuing a decree or adopting a new procedu… | **Development Policy Financing (DPF)** · Development Policy Financing works through a policy matrix. The government completes prior actions, such as issuing a decree or adopting a new procedu… (41 words) |
| 2 | **The Public Investment Reform series** · The first operation, a US$500 million IBRD loan, was approved in December 2009 as the first of 2 single-tranche operations .The second, approved in Ma… | **The Public Investment Reform (PIR) series** · Vietnam's DPF approach is demonstrated through three main reform operations: PIR 1, PIR 2, and Power-Sector Reform. These operations aimed to strength… (38 words) |
| 3 | **Power-sector reform** · A similar approach supported power-sector reform: in 2010, a DPF operation combined US$200 million from the IBRD with US$111.8 million from IDA . | *(deleted / merged)* |

### `f2-pforr` (old scene 29): 3 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | **PforR: money for measurable results** · Program-for-Results links money to measurable results. The borrower and the Bank agree on Disbursement-Linked Indicators (DLIs), and funds are release… | **Program-for-Results (PforR)** · PforR links money to Disbursement-Linked Indicators (DLIs), releasing funds only after verified results while relying on country's own fiduciary and e… (42 words) |
| 2 | **Choosing DLIs** · IEG has found that the choice of DLIs is critical: they must lead clearly to the program's development objective, and monitoring should not focus on D… | **Three instruments, three needs** · For Vietnam, which has mainly used IPF for infrastructure, the choice matters: a results-based design shifts more responsibility, and more risk, onto … (24 words) |
| 3 | **Three instruments, three needs** · The three instruments answer different needs. IPF builds assets, DPF supports reforms, and PforR rewards the performance of existing programs.For Viet… | *(deleted / merged)* |

### `f2-prep` (old scene 30): 4 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **More than a loan** · Technical support is what distinguishes IBRD financing from a commercial loan. The Bank helps design the project before money is committed, advises on… | **More than a loan** · Technical support is what sets IBRD financing apart from a commercial loan: the Bank helps design the project, advises on policy and tracks results lo… (27 words) |
| 2 | **Designing the project** · During preparation, the borrower designs the project with advice from a Bank task team of technical, financial, procurement and safeguard specialists.… | **Project preparation and feasibility studies** · During preparation, the borrower designs the project with advice from a Bank task team of technical, financial, procurement and safeguard specialists.… (38 words) |
| 3 | **Safeguard instruments and the Preparation Advance** · Preparation also produces the environmental and social instruments required by the Bank's policies: impact assessments, resettlement plans and stakeho… | **Project preparation and feasibility studies** · Preparation produces required environmental and social instruments, such as impact assessments and resettlement plans. Where preparation is costly, th… (32 words) |
| 4 | **Preparation shapes what follows** · The quality of preparation shapes everything that follows.IEG concluded that more thorough advance preparation and regulatory coordination on TEP's sm… | **Project preparation and feasibility studies** · The quality of preparation shapes everything that follows. As Independent Evaluation Group (IEG) concluded, more thorough advance preparation and regu… (28 words) |

### `f2-asa` (old scene 31): 4 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Advice outside any single loan** · Advisory Services and Analytics (ASA) are the Bank's non-lending activities that help clients advance a development objective. Their outputs include a… | **Advisory Services and analytics (ASA)** · ASA represent non-lending activities such as policy notes and technical advice. They serve a dual purpose: directly informing national policy formulat… (30 words) |
| 2 | **How ASA is funded** · ASA is funded in 3 ways. In 2023, analytical and advisory disbursements totalled US$991 million: 26% from the Bank's administrative budget, 68% from d… | **Advisory Services and analytics (ASA)** · ASA is funded through three channels: the Bank's administrative budget, donor trust funds, and Reimbursable Advisory Services. (17 words) |
| 3 | **Reimbursable Advisory Services** · Under Reimbursable Advisory Services (RAS), a client requests and pays for the advice under a legal agreement . RAS is offered mainly to middle and hi… | **Advisory Services and analytics (ASA)** · Under Reimbursable Advisory Services (RAS), clients request and pay for customized technical advice under a legal agreement. RAS is offered mainly to … (33 words) |
| 4 | **ASA in Vietnam** · In Vietnam, analytical work has supported several of the reforms later financed by loans. The Public Investment Reform series, for example, rested on … | **Advisory Services and analytics (ASA)** · In Vietnam, analytical work underpins major policy dialogues for reforms and builds local regulatory capacity. By resolving institutional bottlenecks … (29 words) |

### `f2-me` (old scene 32): 5 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **The results framework** · Every IBRD project is monitored against a results framework set at appraisal. It defines the project development objective (PDO), its outcome indicato… | **The results framework** · Every IBRD project is monitored against a results framework set at appraisal. It defines the Project Development Objective (PDO), outcome and intermed… (26 words) |
| 2 | **Three levels of M&E** · M&E then works at 3 levels:Supervision: the Bank prepares regular Implementation Status and Results Reports (ISRs), rating progress towards the PDO an… | **Three levels of M&E** · Monitoring and evaluation (M&E) works at three levels :Supervision: Implementation Status and Results Reports (ISRs).Completion: an Implementation Com… (31 words) |
| 3 | **Evidence the borrower can use** · This system produces evidence that the borrower can use. TEP's PPAR rated : | **Ratings as an early warning** · A downgrade in a project's likelihood of achieving its PDO can lead to restructuring, and at completion IEG can revise the outcome rating given in the… (29 words) |
| 4 | **Ratings as an early warning** · Ratings during implementation also act as an early warning. In 2022, CCSEP's likelihood of achieving its PDO was downgraded to moderately unsatisfacto… | **The limits of M&E** · Many indicators, such as transmission losses, measure the whole system, so some improvements in a transmission project cannot be attributed to the pro… (36 words) |
| 5 | **The limits of M&E** · M&E has limits. Many indicators, such as transmission losses, measure the whole system rather than the project alone. IEG therefore warned that some o… | *(deleted / merged)* |

### `f2-training-pmu` (old scene 33): 4 → 3 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Leaving capacity behind** · Training and capacity building aim to leave the borrower able to manage similar investments without outside help. They work at 3 levels: the people in… | **Leaving capacity behind** · Training aims to leave the borrower able to manage similar investments without outside help, at three levels: people, their skills and the institution… (26 words) |
| 2 | **Project management units** · In Vietnam, IBRD projects are run by project management units (PMUs) or boards attached to the implementing agency.TEP was implemented through NPT's n… | **Training project management units** · IBRD projects are run by project management units (PMUs). The Bank trains them in project and financial management, procurement and safeguards, much o… (31 words) |
| 3 | **The Open Learning Campus** · The Bank supports these units with training in project management, financial management, procurement and safeguards. Much of this is delivered through… | **When staff stay** · Training works best when staff stay with the unit. In one urban project, most PMUs were carried over from an earlier project. Even so, weak PMU capaci… (42 words) |
| 4 | **When staff stay** · Training is most effective when staff stay with the unit. CCSEP built on PMUs inherited from an earlier project, and the new PMU in Phan Rang drew 10 … | *(deleted / merged)* |

### `f2-training-knowledge` (old scene 34): 3 → 4 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Learning by doing** · Much of the knowledge transfer happens through doing. Borrower staff apply the Bank's procurement rules and safeguard policies on real contracts, whil… | **Learning by doing** · Most knowledge transfer happens through doing: borrower staff apply Bank procurement and safeguard rules on real contracts while Bank specialists revi… (23 words) |
| 2 | **Dedicated programs** · The Bank also runs dedicated programs. In 2014, it launched what it described as the world's first massive open online course (MOOC) on public procure… | **Dedicated programs** · In 2014 the Bank launched a massive open online course (MOOC) on public procurement , and its e-procurement courses give certification to participants… (26 words) |
| 3 | **TEP and Nha Trang** · TEP shows the cumulative effect: IEG found that NPT's regional boards had built capabilities in procurement, contract administration, financial manage… | **Skills build up across projects** · Skills also build up across projects: the Independent Evaluation Group (IEG) found that the power transmission utility's regional boards had built cap… (31 words) |
| 4 |  | **Safeguards are harder to transfer** · Experience in one coastal city shows that knowing the Bank's resettlement standards is not enough when local compensation rules and land prices differ… (23 words) |

### `f2-institutional` (old scene 35): 9 → 7 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Changing how institutions run** · The third level targets institutions rather than individuals. Here, IBRD projects include components that change how a sector agency or utility is run… | **Changing how institutions run** · The third level targets institutions rather than individuals: IBRD projects include components that change how a sector agency or utility is run. (22 words) |
| 2 | **Table 6 · Institutional reform** ·  | **Table 2.3.1 · Typical institutional reforms** ·  (0 words) |
| 3 | **Table 6 · Institutional reform** ·  | **Table 2.3.1 · Typical institutional reforms** ·  (0 words) |
| 4 | **Table 6 · Institutional reform** ·  | **Table 2.3.1 · Typical institutional reforms** ·  (0 words) |
| 5 | **Table 6 · Institutional reform** ·  | **Table 2.3.1 · Typical institutional reforms** ·  (0 words) |
| 6 | **Table 6 · Institutional reform** ·  | **The same goal at national level** · Development Policy Financing (DPF) pursues the same goal nationally: the Public Investment Reform series strengthened how public investment projects a… (23 words) |
| 7 | **The same goal at national level** · Development Policy Financing pursues the same goal at national level. The Public Investment Reform series, for example, supported measures to strength… | **The borrower must sustain it** · In two IBRD-supported projects in Vietnam, almost all of the capacity-building and reform work was paid for from counterpart funds, and some reforms, … (51 words) |
| 8 | **Who pays for reform** · Institutional reform depends heavily on the borrower's own commitment. In TEP, US$5.50 million of the capacity-building component's US$5.74 million ac… | *(deleted / merged)* |
| 9 | **The borrower must sustain it** · In CCSEP, the whole of Component 4 was financed by counterpart funds, and several reforms, such as performance-based service contracts, took effect on… | *(deleted / merged)* |

### `f2-three-forms` (old scene 36): 7 → 7 beats

| Beat | Before | After |
|---|---|---|
| 1 | **Table 7 · Three forms of support** · The 3 forms of support are designed as one package: finance pays for the investment, technical support makes it sound, and training makes it last. Eac… | **Table 2.4.1 · Three forms of support** · The three forms of support are one package: finance pays for the investment, technical support makes it sound, and training makes it last. (23 words) |
| 2 | **Table 7 · Three forms of support** ·  | **Table 2.4.1 · Three forms of support** ·  (0 words) |
| 3 | **Table 7 · Three forms of support** ·  | **Table 2.4.1 · Three forms of support** ·  (0 words) |
| 4 | **Table 7 · Three forms of support** ·  | **Table 2.4.1 · Three forms of support** ·  (0 words) |
| 5 | **How the forms reinforce one another** · The forms reinforce one another in 3 ways. First, money gives weight to advice: a borrower is more likely to adopt the Bank's procurement and safeguar… | **How the forms reinforce one another** · First, money gives weight to advice: a borrower is more likely to adopt the Bank's procurement and safeguard standards when they are conditions of a l… (26 words) |
| 6 | **How the forms reinforce one another** · The forms reinforce one another in 3 ways. Second, advice protects the money: appraisal and supervision reduce the risk that funds are wasted on a poo… | **How the forms reinforce one another** · Second, advice protects the money: appraisal and supervision reduce the risk that funds are wasted on a poorly designed project. (20 words) |
| 7 | **How the forms reinforce one another** · The forms reinforce one another in 3 ways. Third, training protects the results: assets built with IBRD funds keep working only if local institutions … | **How the forms reinforce one another** · Third, training protects the results: assets built with IBRD funds keep working only if local institutions can operate and maintain them. (21 words) |

### `f2-package` (old scene 37): 2 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | **The package depends on the borrower** · The package, however, depends on the borrower. The evidence in Chapter 3 shows that the binding constraints usually lie on the domestic side: counterp… | **The package depends on the borrower** · In the projects reviewed in this study, the binding constraints lay mainly on the domestic side: counterpart funding, land acquisition and PMU capacit… (41 words) |
| 2 | **The value lies in the combination** · The value of the IBRD therefore lies less in any single form of support than in their combination, and that combination works only when domestic syste… | **The value lies in the combination** · The value of the IBRD lies less in any single form of support than in their combination, and that combination works only when domestic systems are rea… (30 words) |

### `lift-2-3` (old scene 38): 1 → 1 beats

| Beat | Before | After |
|---|---|---|
| 1 | **** ·  | unchanged |

## Table cell edits (not visible in the excerpts above)

| Scene / beat (old numbering) | Edit |
|---|---|
| `f2-cycle` (23) beat 3, Table 2.1.1 row 2 | "ESIA" → "Environmental and Social Impact Assessment (ESIA)" (fix list) |
| `f2-cycle` (23) beat 4, row 3 | "E&S aspects" → "environmental and social aspects" (fix list) |
| `f2-cycle` (23) beat 7, row 6 | "IEG" → "Independent Evaluation Group (IEG)" (fix list) |
| `f1-instruments`, Table 1.4.1 | instrument column "IPF / DPF / PforR" as in the _10 table |
| `f1-terms`, Table 1.4.2 | Source column removed; source line "Authors' compilation from [18; 19; 20; 21; 22]" |
| `f1-safeguards`, NEW Table 1.4.3 | ten ESS rows (Standard / Title) as a centre DataTable; ESS5 focus beat |
| `f2-institutional`, Table 2.3.1 | old Table 6 (TEP/CCSEP rows) replaced by the four generic reform areas |
| `f2-three-forms`, Table 2.4.1 | cell "a utility's asset management system" |

## Other files

- **Facts:** 62 facts removed (case numbers on Floors 1-2, voting power 0.21% / 15-16% / 85%, ASA 2023 amounts, PIR and power-sector amounts, …). 8 checks that used them were removed: ASA 26 + 68 + 6, PIR 2 87.3 + 262.7, power-sector 200 + 111.8, TEP capacity building 5.50 + 0.24 and their order checks, and the eligibility-year order check.
- **Notes:** rewritten for all Floor 1-2 scenes (no case details) with targetSeconds = about 20 s per beat.
- **References:** the 64 entries now come from the _10 paper (US$ → USD in [14]; dashes in [23] and [62]).

---

# Update 2 (scenes 8 and 14 condensed, calm print layout, Thank You page)

## Part 1 · `f1-wbg` (Table 1.1.1): 10 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | Five institutions, one goal | **unchanged**: Five institutions, one goal (wide pose over the five institution props) |
| 2 | Table 1.1.1 · row IBRD (focus) | **Table 1.1.1, whole table** (no row focus, centred) + one card **Key differences**: IBRD vs IDA · IBRD vs IFC · MIGA and ICSID do not lend, as three short lines side by side; table caption with [9] and [10] and the source line kept |
| 3 | row IDA | removed |
| 4 | row IFC | removed |
| 5 | row MIGA | removed |
| 6 | row ICSID | removed |
| 7 | Key differences · IBRD / IDA | removed (now line 1 of the card) |
| 8 | Key differences · IBRD / IFC | removed (now line 2 of the card) |
| 9 | Key differences · MIGA / ICSID | removed (now line 3 of the card) |
| 10 | The main public channel | removed as a beat; its sentence closes the Key differences card |

Decisions:
- The brief lists only the per-row and key-difference beats for deletion, but asks for exactly 2 beats. The old beat 10 ("The main public channel") is the subsection's closing key idea (and the scene objective), so its sentence was kept as the last line of the beat-2 card instead of being dropped.
- To fit the whole table and the card on one 1920×1080 screen, Table 1.1.1 uses 24 px cells in this scene (instead of 26 px) and the three differences sit side by side.
- One leader line, from the table's outer edge to the ICSID prop, without a label (a label would have touched the card). `check-lines`: 0 overlaps.
- Facts: none removed, because every fact used by the deleted beats (`ibrd-founded` and the Table 1.1.1 cells) is still shown. Waypoints: none removed; `f1-wbg-table` is still the camera of beat 2. The per-institution anchors stay, because the 3D props are unchanged.
- Notes: the scene had no per-beat notes. The scene note (the contrasts across the five rows) is now the note of beat 2, with a short note for beat 1. `targetSeconds` 200 → 40.

## Part 2 · `f1-instruments` (Table 1.4.1): 5 → 2 beats

| Beat | Before | After |
|---|---|---|
| 1 | Three instruments, one loan | **unchanged** |
| 2 | Table 1.4.1 · row IPF (focus) | **Table 1.4.1, whole table** (no row focus) + one card: left, **What the IBRD "buys"** with the chips IPF → inputs, DPF → reforms, PforR → results and "This choice shapes the borrower's obligations."; right, the three one-line definitions with [16], [16] + [2], [16; 17], the first IBRD loan (USD 500 million, December 2009, a DPF) and "introduced in 2012" |
| 3 | row DPF | removed (definition kept in the card) |
| 4 | row PforR | removed (definition kept in the card) |
| 5 | What the IBRD "buys" | removed (merged into beat 2) |

Decisions:
- The definitions keep the spelled-out names "Investment Project Financing (IPF)", etc., because beat 1 never spells them out (Floors 1-2 rule: spell out at first use per scene).
- One leader line from the table's edge to the PforR counter, labelled "Lending counters". `check-lines`: 0 overlaps (beat 1 still uses its numbered-pin fallback, as before).
- Facts: none removed (`pir1-ibrd`, `pir1-approved` and `pforr-year` are still shown). Waypoints: none removed (`f1-instruments-table` is the beat-2 camera).
- Notes: per-beat notes added; beat 2 merges the three row notes. `targetSeconds` 100 → 40.

Beat counts come from `beats.length`, so the tracker segments and the n/N counters update by themselves; `scenes.ts` reads the new `targetSeconds` from `notes.ts`. The scene count stays at 59.

## Part 3 · Print / PDF: clean, calm, readable

The print view (`src/print/PrintView.tsx`, `src/print/print.css`) was rebuilt.

| Problem in the 72-page PDF | Now |
|---|---|
| numbered blue circles, numbered squares in card headers, legend row "x → 3D prop: y" | removed; print has no pins, no legend, no prop labels and no leader lines. Nothing is numbered except citations [n] and page numbers |
| staggered cards of different sizes (CSS columns) | CSS grid: equal column width, `grid-auto-rows: 1fr` (every row as tall as the page's tallest card), 2-4 columns, 24 px gap |
| one beat's text split over two cards | one beat = one card; no CSS columns, no fragmentation |
| source tags floating over cards | the source tag is the last line inside each card (17 px, muted); tables keep their own source line inside the table card |
| cards on top of the footer | safe margins 60 px left/right, 40 px top, 110 px bottom; the footer zone is reserved (checked by `check-print`) |
| Conclusion page showed only the last beat plus a tab strip | all five Conclusion parts are cards; no tab strip, buttons or "press" hints |
| References overflowed into the footer; [48] and [62]-[64] missing | paginated by measured height (whole entries only); all 64 printed once, in order, on 5 pages; `check-print` verifies [1]..[64] |
| Thank You unreadable (white on white) | see Part 4 |

Layout decisions:
- **Page grid:** header band (cyan section chip + navy title), a **main area** (all tables, charts, timelines and diagrams of the scene, complete, in their final state, focus glow off), then the **text cards**. The main area is a full-width white panel (96%) with the exhibits centred, so the cards line up with its left and right edges. A scene without exhibits uses the whole page for cards.
- **Exhibits once:** an exhibit used by several beats is printed once, in the version of its last beat (its final state). Charts print 850 px wide, so two charts can sit side by side. Tables shrink to their content width.
- **Card:** a cyan section chip and the title on one line, then the body (20 px), then the source tag. The chip shares the title line to save one line per card; the order (label, title, body) is kept. Title slides (chapter titles) are dark cards with white text, never mixed.
- **Column count:** 2 columns for 1-2 cards, 3 for 3, 4 for 4, 3 for 5-6, 4 for 7-8, 3 for 9, 4 above. The other counts (2-4) are tried when the first choice does not fit. A single card keeps the 2-column width, because a full-width line at 20 px would be hard to read.
- **Packing:** a hidden measuring pass measures every exhibit range and every card at 2/3/4-column widths. Each page then takes the exhibits that fit and as many whole cards as fit. After rendering, a page that still does not fit moves its last card on. Fonts are never shrunk below the minimums (body 20 px, tables 19 px, source tags 17 px, labels 15 px).
- **Background:** the scene's 3D image (`capture-bg`) under a white scrim at 55%, with cards at 96% white and a subtle shadow.
- **Text colours:** print text is navy or ink on white cards. Meaning colours that fail 4.5:1 on white get darker text variants in print: good #1f7a52, bad #b03a30, warn #a4501a (chart fills keep the live colours). The `good` chip uses #1f7a52 with white text.
- **Cover:** a print-only cover card (no "Press → to enter" hint).
- **`ex-sources`:** a card that gives the page range of the reference pages. It prints no entries, so every reference appears exactly once.
- **Contents page:** built from the final page numbers, after pagination.
- **Overflow:** the scenes that need more than one page are listed in `docs/print-overflow.md`. Floor 3 scenes carry the paper's full text (up to 15 beats plus tables and charts), so at a 20 px body they cannot fit one page. The brief asked for "a second page for that scene only", but several Floor 3 scenes need 3-4 pages. Their text was not shortened (Floor 3 content stays as it is), and fonts were not shrunk below the minimums.

## Part 4 · Thank You page and overexposure

**Capture exposure:**
- In `?capture=1` the renderer uses linear tone mapping with `toneMappingExposure` ≤ 1.0 on every material. That includes the unlit ones: labels, the exit door's daylight, the EXIT sign and the glow strips.
- The exit hall's point light and door glow are scaled by the same factor. There is no bloom and no post-processing.
- `npm run capture-bg` measures each frame and rejects it if more than 25% of its pixels are above luminance 245, or if its mean luminance is above 0.90. It then lowers exposure and light by 15% and captures again (at most 4 retries).
- Final values per scene are in `docs/capture-exposure.md`.

**Final exposure values:** all 59 images pass. 21 scenes stayed at 1.000, 34 needed 0.850, and 3 needed 0.723. The exit hall (`ex-thanks`) needed 0.522 (5 tries) and ends at 15.1% of pixels above 245 with a mean of 0.823. `ex-sources` (1.000, mean 0.869) and `lift-down` (1.000, mean 0.712) passed on the first try. Scenes below 1.0:

- `ext-door`: exposure 0.850
- `f1-structure`: exposure 0.850
- `f1-what`: exposure 0.850
- `f1-terms`: exposure 0.850
- `f1-safeguards`: exposure 0.850
- `f2-ch2-title`: exposure 0.850
- `f2-cycle`: exposure 0.850
- `f2-vn-procedures`: exposure 0.850
- `f2-disbursement`: exposure 0.850
- `f2-counterpart`: exposure 0.850
- `f2-ipf`: exposure 0.850
- `f2-dpf`: exposure 0.850
- `f2-pforr`: exposure 0.850
- `f2-prep`: exposure 0.850
- `f2-asa`: exposure 0.850
- `f2-me`: exposure 0.850
- `f2-training-pmu`: exposure 0.850
- `f2-institutional`: exposure 0.850
- `f2-three-forms`: exposure 0.850
- `f2-package`: exposure 0.850
- `f3-ch3-title`: exposure 0.850
- `f3-ida-graduation`: exposure 0.850
- `f3-sahep`: exposure 0.850
- `f3-legal`: exposure 0.850
- `f3-tep-overview`: exposure 0.850
- `f3-tep-cost`: exposure 0.850
- `f3-tep-financing`: exposure 0.850
- `f3-tep-impl`: exposure 0.723
- `f3-tep-outputs`: exposure 0.850
- `f3-tep-gap`: exposure 0.850
- `f3-tep-assess`: exposure 0.850
- `f3-ccsep-overview`: exposure 0.850
- `f3-ccsep-structure`: exposure 0.850
- `f3-ccsep-cities`: exposure 0.850
- `f3-ccsep-impl`: exposure 0.723
- `f3-ccsep-results`: exposure 0.723
- `f3-ccsep-nhatrang`: exposure 0.850
- `ex-thanks`: exposure 0.522

**Thank You card** (`ex-thanks`, live and print use the same `ThanksCard`):
- **Card:** dark navy at 92% (`rgba(0, 20, 43, 0.92)`, a deeper navy than `--wb-navy`). Over a white background, `--wb-navy` at 92% would give the light-cyan IDs only 6.2:1; this navy gives them 7.5:1.
- **Text, all white:** "Thank you for listening", "Group 6 · Investment Economics 65", the five member names, "Lecturer · ThS. Phạm Thu Vân" and "National Economics University – School of Advanced Education Programs · Hanoi, 2026". White on the card is 15.2:1.
- **Student IDs:** light cyan #47C4EB, 7.5:1 on the card.
- **Lecturer line:** kept from the old card (as "Lecturer · …"), since the brief asks to keep everything not listed.
- **"Questions?" line:** the live scene had none, so none was added.
- **Print:** the old print CSS forced cards to white, which made the white text invisible. That override is gone, and the print uses the same dark card.

**`npm run check-print`** (`scripts/check-print.mjs`, results in `docs/print-check.md`, exits non-zero on any failure):
1. **Contrast:** each text node's colour against the page rendered with all text hidden (mean of the pixels under its rectangle), at least 4.5:1.
2. **Placement:** no text in the footer zone (bottom 110 px, except the footer) or outside the page.
3. **Clipping:** no card, sheet, contents or reference box with `scrollHeight` above its height.
4. **Backgrounds:** each 3D image, on the cover and scene pages, must not be blank or uniform (SD ≤ 6) or overexposed (same thresholds as the capture). The contents and reference pages have a plain white background by design and are not tested.
5. **References:** the printed set is exactly [1]..[64], once each, in order.
6. **Font sizes** (added): card body at least 20 px, table text at least 18 px, any other text at least 14 px (citations excepted).

**First run:**
- 25 contrast failures: green/orange/red stat numbers and "Note ·" labels on white. Fixed with darker print text variants.
- 57 background failures: the old images, before the exposure loop. Fixed by recapturing.
- 12 contrast failures on `f1-gov`: the dimmed tiers of the tier diagram printed in earlier beat states. Fixed by printing an exhibit once, in its final state, when beats only change its classes.

**Final run: 95 pages, 0 failures.**

## Final numbers

- Scenes: 59. `f1-wbg` 2 beats, `f1-instruments` 2 beats.
- PDF: **95 pages** (cover, contents, 55 scene pages plus 33 extra pages for scenes that do not fit one page, and 5 reference pages). Overflow scenes are listed in `docs/print-overflow.md`.

---

# Update 3 (scene numbering correction, scene 14 as one beat, source lines hidden)

"Scene n" means the number in the web HUD ("scene n / 59"), not the PDF page.

## Part 0 · Correction of update 2, part 2

Update 2 applied "scene 14" to `f1-instruments`, but web scene 14 is `f1-terms` (Table 1.4.2) and web scene 13 is `f1-instruments`. The scene-8 change (`f1-wbg`) was correct and stays.

`f1-instruments` had been reduced to 2 beats, so it was **restored** to its state before update 2:
- `src/content/f1-instruments.tsx` was restored from commit `ae06609`. The file is identical to the original: beat 1 "Three instruments, one loan", beats 2-4 rows IPF / DPF / PforR (row focus, callouts to the three counters), and beat 5 "What the IBRD 'buys'".
- The notes entry was restored (`targetSeconds` 100, no per-beat notes). The facts and waypoints had not been changed, so nothing else needed restoring.
- The unused CSS that update 2 added for the merged card (`.k-buys*`) was removed.
- Tracker segments and n/N counters follow `beats.length`, so they are back to 5 beats.

The "Part 2" section of update 2 above is therefore **superseded**.
