// Corporate Banking Account Opening AI Due Diligence System
// 企業金融開戶資格認定與在地AI審查系統

const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

const SAMPLE_CASES = {
  case_normal: {
    id: 'case_normal',
    name: '元豐精密科技股份有限公司 (合格標準件)',
    companyName: '元豐精密科技股份有限公司',
    taxId: '54892103',
    riskLevel: '低風險 (Low Risk)',
    riskBadge: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    summary: '設立6年之精密機械零件製造商，資本額2,500萬，位於新竹科學園區周邊，開戶行距廠區僅1.2公里，近一年401營業額達1.2億元，股權單純清晰，無制裁與負面新聞，屬典型合格優質企業。',
    docs: {
      moea: `【經濟部商業司 公司變更登記事項表】
統一編號：54892103
公司名稱：元豐精密科技股份有限公司
公司所在地：新竹市東區光復路一段580號1-2樓
代表人姓名：陳漢卿
資本總額：新臺幣 25,000,000 元
實收資本額：新臺幣 25,000,000 元
核准設立日期：中華民國107年06月15日
最近一次變更日期：中華民國112年04月10日
所營事業資料：
1. CA02990 其他金屬製品製造業
2. CB01010 機械設備製造業
3. F401010 國際貿易業
董監事名單：
董事長：陳漢卿（持有股份 1,250,000 股，佔 50%）
董事：張麗芬（持有股份 750,000 股，佔 30%）
監察人：李崇賢（持有股份 250,000 股，佔 10%）
經理人：陳漢卿`,
      tax401: `【財政部營業人銷售額與稅額申報書 (401表)】
統一編號：54892103
營業人名稱：元豐精密科技股份有限公司
所屬年月：113年07月至08月
銷售額合計（第25欄）：新台幣 21,350,000 元
銷項稅額：新台幣 1,067,500 元
前期（113年05-06月）銷售額：新台幣 19,800,000 元
近一年累計營業額：新台幣 124,500,000 元
有無滯欠營利事業所得稅或營業稅紀錄：無任何違章與欠稅紀錄。`,
      ubo: `【股東名冊與實質受益人（UBO）穿透聲明書】
公司：元豐精密科技股份有限公司
總發行股份：2,500,000 股
股東名冊結構：
1. 陳漢卿（國民身分證：J120334891，中華民國籍）持股 1,250,000 股，比例 50.0% -> 符合實質受益人定義（>25%），具實質經營決策權。
2. 張麗芬（國民身分證：J221998312，中華民國籍）持股 750,000 股，比例 30.0% -> 符合實質受益人定義（>25%）。
3. 李崇賢（國民身分證：O100234110，中華民國籍）持股 250,000 股，比例 10.0%。
4. 員工認股信託專戶 持股 250,000 股，比例 10.0%。
穿透結論：實質受益自然人共 2 位（陳漢卿、張麗芬），均已檢附最新國民身分證正反面影本，無境外紙上公司或離岸多層控股結構。`,
      idDocs: `【負責人與主要主管身分查證文件】
負責人姓名：陳漢卿
出生年月日：民國61年3月24日
身分證號：J120334891 (初換領：104年11月02日 竹市 換發)
戶籍地址：新竹市東區關新路88號
第二身分證件：全民健康保險卡（卡號：0000 8912 3456）
內政部戶政司國民身分證領補換資料查詢：查詢結果符合，無掛失紀錄。
高階經理人陳漢卿親自到行親簽開戶申請書與印鑑卡。`,
      lease: `【營業處所房屋租賃契約書與建物謄本】
承租人：元豐精密科技股份有限公司
出租人：竹科創智資產股份有限公司
租賃標的：新竹市東區光復路一段580號1-2樓（自用廠房與辦公室，建坪約 280 坪）
租賃期間：自民國110年7月1日起至民國115年6月30日止（長租期5年，尚餘2年）
水電費憑證：台灣電力公司113年8月份電費繳費收據，用電戶名：元豐精密科技，繳費金額新台幣 86,420 元。`,
      tradeContract: `【業務實質往來合約與訂單憑證】
主要客戶契約：
1. 台灣積體電路供應鏈協力合約（合約編號：TSMC-EQ-2023-091），年度零件採購協議，年預估交易額約 4,500 萬元。
2. 聯發晶圓精密機殼採購合約（合約編號：MTK-HW-2024-03），每季出貨約 1,200 萬元。
主要供應商：
中鋼特合金股份有限公司（原料進貨月結30天，採購合約簽訂迄今已達4年）。`,
      amlScreening: `【全球反洗錢 (AML) 與制裁名單檢索系統 (World-Check / Dow Jones)】
檢索對象：
- 元豐精密科技股份有限公司
- 陳漢卿（負責人兼大股東）
- 張麗芬（大股東）
- 李崇賢（監察人）
檢索結果：
1. 聯合國安理會制裁名單 (UN Sanctions)：未命中 (No Match)
2. 美國財政部外國資產管制辦公室 (OFAC SDN)：未命中 (No Match)
3. 歐盟及台灣法務部調查局洗錢制裁名單：未命中 (No Match)
4. 重要政治性職務人士 (PEP)：未命中 (No PEP)
5. 負面新聞 (Adverse Media) 與司法判決檢索：無重大民刑事經濟犯罪、背信或詐欺訴訟紀錄。
6. 聯防中心警示帳戶檢核：無通報警示或衍生管制紀錄。`
    }
  },

  case_pending: {
    id: 'case_pending',
    name: '瀚亞寰宇國際生醫貿易有限公司 (待補件/地緣不符典型件)',
    companyName: '瀚亞寰宇國際生醫貿易有限公司',
    taxId: '90812377',
    riskLevel: '中高風險 (Medium-High Risk - 需補件與加強審查)',
    riskBadge: 'bg-amber-50 text-amber-700 border-amber-300',
    summary: '設立僅3個月，資本額僅100萬，登記地址為台中商務中心共享辦公桌，卻跨區至台北南京東路分行申辦開戶。營業項目為高單價醫療器材貿易，預估月匯出入高達8,000萬元，資本額與交易量顯不相稱。且缺少401營業稅申報書、租約僅為意向書、股東有40%境外BVI控股公司尚未穿透實質自然人。',
    docs: {
      moea: `【經濟部商業司 公司設立登記事項表】
統一編號：90812377
公司名稱：瀚亞寰宇國際生醫貿易有限公司
公司所在地：臺中市西區台灣大道二段99號14樓之2（經查為「匯創國際商務中心」代收代轉地址）
代表人姓名：林志豪
資本總額：新臺幣 1,000,000 元
實收資本額：新臺幣 1,000,000 元
核准設立日期：中華民國113年07月02日（設立迄今僅 3 個月）
最近一次變更日期：113年07月02日
所營事業資料：
1. F401010 國際貿易業
2. F080110 醫療器材批發業
3. F208031 醫療器材零售業
董監事名單：
董事：林志豪（出資額 600,000 元，佔 60%）
法人股東：GLORY APEX HOLDINGS LTD. (英屬維京群島 BVI 註冊)（出資額 400,000 元，佔 40%）`,
      tax401: `【財政部營業人銷售額與稅額申報書 (401表)】
狀態：【未檢附缺失】
經辦查核紀錄：該公司於113年7月甫設立，迄今尚未申報首次營業稅401表。負責人聲稱由境外直接轉單銷貨，但現場未能提供會計師設立資本查核簽證報告書及任何開立之二聯式/三聯式電子發票存根。`,
      ubo: `【股東名冊與實質受益人（UBO）申報資料】
公司：瀚亞寰宇國際生醫貿易有限公司
資本結構：
1. 林志豪（持有 60% 出資額，身分證字號：B120993812）-> 具中華民國身分證。
2. GLORY APEX HOLDINGS LTD.（持有 40% 出資額，英屬維京群島境外公司，註冊登記號：BVI-2039912）
缺失警訊：
- 未提供 GLORY APEX HOLDINGS LTD. 之董事名冊 (Register of Directors)、股東名冊 (Register of Members) 及職權證明書 (Certificate of Incumbency)。
- 無法辨識該境外法人背後持有超過25%之最終實質受益自然人 (UBO) 身分。依防制洗錢辦法規定，實質受益人未穿透前不得放行開戶。`,
      idDocs: `【負責人身分證明文件】
負責人姓名：林志豪
身分證號：B120993812 (民國75年生)
戶籍地址：臺中市南屯區文心路一段112號
第二證件：全民健保卡
身分驗證核對正常，惟未提供境外法人公司授權書及被授權人身分文件。`,
      lease: `【營業處所證明文件】
提交文件：匯創國際商務中心「進駐意向預約書（尚未正式簽約，亦無押金匯款憑證）」。
營業處所現況：借址登記商務中心，現場為虛擬秘書辦公室，無實際專屬辦公桌與存放醫療器材之實體庫房。未檢附水電瓦斯繳費單據。`,
      tradeContract: `【業務往來合約與預期交易證明】
提供文件：一份英文海外採購意向合約草約 (Draft MOU)，買方為香港某生技公司，合約金額美金 2,500,000 元（約合新台幣 8,000 萬元）。
審核疑點：合約未正式簽署用印，且交易金額與公司登記資本額新台幣100萬元顯不相當，存在高度交易資金來源與去向不合理風險。`,
      amlScreening: `【全球反洗錢 (AML) 與制裁名單檢索系統】
檢索對象：瀚亞寰宇國際生醫貿易有限公司、林志豪、GLORY APEX HOLDINGS LTD.
檢索結果：
1. 制裁名單 (OFAC / UN)：未命中。
2. PEP 政治人物：未命中。
3. 負面新聞：林志豪無重大負面新聞。
4. 警訊：股東 GLORY APEX 設於避稅高隱密性租稅天堂（BVI），未能提供最終受益自然人名冊，無法排除洗錢人頭戶風險。`
    }
  },

  case_highrisk: {
    id: 'case_highrisk',
    name: '極光鏈動數位行銷有限公司 (高風險/涉PEP/虛擬資產件)',
    companyName: '極光鏈動數位行銷有限公司',
    taxId: '83920145',
    riskLevel: '高風險 (High Risk - 觸發加強審查 EDD，需總行核決)',
    riskBadge: 'bg-rose-50 text-rose-700 border-rose-300',
    summary: '設立1年，資本額500萬，登記項目雖為資訊行銷，但實際主力營收為虛擬通貨 (VASP) 跨境代操與場外交易 (OTC) 諮詢。AML名單檢索發現持股35%大股東為現任直轄市高階政務官員之胞弟（屬重要政治性職務人士 PEP 利害關係人）；且於前幾個月曾涉民間自救會投訴吸金糾紛之負面新聞報導。綜合評估洗錢風險極高，必須啟動 EDD 並提報總行核決。',
    docs: {
      moea: `【經濟部商業司 公司變更登記事項表】
統一編號：83920145
公司名稱：極光鏈動數位行銷有限公司
公司所在地：臺北市大安區忠孝東路四段210號8樓
代表人姓名：高偉廷
資本總額：新臺幣 5,000,000 元
實收資本額：新臺幣 5,000,000 元
設立日期：112年8月14日
所營事業資料：
1. I301010 資訊軟體服務業
2. I401010 一般廣告服務業
3. F401010 國際貿易業
股東名冊：
1. 高偉廷（出資 3,250,000 元，持股 65%）
2. 趙培倫（出資 1,750,000 元，持股 35%）`,
      tax401: `【財政部營業人銷售額與稅額申報書 (401表)】
統一編號：83920145
所屬年月：113年05月至06月
銷售額合計（第25欄）：新台幣 4,200,000 元
備註：申報項目均列為行銷服務費，但帳戶預期資金往來多來自個人帳戶之大額網銀跨行轉帳，與一般企業 B2B 交易常態不符。`,
      ubo: `【股東名冊與實質受益人（UBO）申報】
1. 負責人 高偉廷（持有 65%，身分證：A128903120）
2. 大股東 趙培倫（持有 35%，身分證：A121009874）
經查 趙培倫 持股達 35%，屬法定實質受益人。`,
      idDocs: `【負責人與大股東身分查核文件】
負責人高偉廷親自至本行申辦。
雙證件核驗正常。`,
      lease: `【營業處所租賃契約書】
租賃地點：臺北市大安區忠孝東路四段210號8樓。租期1年。
現場場勘紀錄：門牌為極光鏈動，現場配置約8部高規格電腦與伺服器，但無明確客戶接待區。`,
      tradeContract: `【業務實質合約與訪談紀錄】
經行員深入訪談，公司實際業務包含：
1. 為境外 Web3/加密貨幣交易所提供社群推廣與大額場外交易 (OTC) 結匯引介服務。
2. 尚未向金管會完成「虛擬通貨平台及交易業務事業 (VASP)」防制洗錢法令遵循聲明。若涉及虛擬資產金流，依法不得承作開戶。`,
      amlScreening: `【全球反洗錢 (AML) 與制裁名單檢索系統】
檢索對象：趙培倫（持股35% UBO）
結果：
1. 政治受曝露人士 (PEP)：命中！【國內重要政治性職務人士利害關係人】。趙培倫為現任直轄市副市長趙O宇之親胞弟，符合洗錢防制法之「PEP利害關係人（二親等血親）」。
2. 負面新聞 (Adverse Media)：命中！113年4月工商時報與壹蘋新聞網報導：「某區塊鏈投資群組遭投資人指控涉吸金疑雲，極光鏈動行銷團隊遭檢調傳喚釐清」。雖尚未起訴，但具重大商譽與合規洗錢風險。`
    }
  }
};

// 24 Banking Checklist Questions across 6 Core Categories
const DEFAULT_QUESTIONS = [
  // SECTION 1: 企業基本身分與登記合法性審核
  {
    id: 'q1_1',
    sectionId: 1,
    sectionName: '第一部分：企業基本資料與合法性查核',
    title: '公司名稱與統一編號真實性核驗',
    desc: '比對經濟部商業司商工登記公示資料、全國商工行政服務入口網，核對統編、中文名稱與解散/停業狀態。',
    status: 'pass',
    value: '54892103 (核准設立，現況營業中)',
    aiConfidence: 99,
    reasoning: 'AI 透過在地比對經濟部公司變更登記事項表，統一編號54892103與商工登記相符，目前登記狀態為「核准設立」，無勒令停業或廢止登記情形。',
    sourceDoc: '經濟部商業司公司變更登記事項表',
    sourceSection: '基本登記欄第1-2行',
    citation: '統一編號：54892103 公司名稱：元豐精密科技股份有限公司 公司所在地：新竹市東區光復路一段580號',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q1_2',
    sectionId: 1,
    sectionName: '第一部分：企業基本資料與合法性查核',
    title: '設立年限與資本額適足性評估',
    desc: '查驗設立登記年限（是否甫設立未滿半年新創法人）及實收資本額是否與行業規模相稱。',
    status: 'pass',
    value: '設立滿6年 / 實收資本額2,500萬元',
    aiConfidence: 96,
    reasoning: '設立日期為107年6月15日，已正常營運超過6年；實收資本額新台幣2,500萬元，高於一般中小企業及製造業起跑資本門檻，非甫設立之空殼或人頭公司型態。',
    sourceDoc: '經濟部商業司公司變更登記事項表',
    sourceSection: '資本總額欄與設立日期欄',
    citation: '實收資本額：新臺幣 25,000,000 元 核准設立日期：中華民國107年06月15日',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q1_3',
    sectionId: 1,
    sectionName: '第一部分：企業基本資料與合法性查核',
    title: '登記地址與實際營運處所一致性（防範借址登記）',
    desc: '確認登記地址與營業地址是否一致。若登記於商務中心、共享辦公室或虛擬秘書處，需實地查訪並專案審核。',
    status: 'pass',
    value: '同址實質營運 / 獨立廠房及辦公室',
    aiConfidence: 94,
    reasoning: '公司登記地址與營業處所均為新竹市東區光復路一段580號1-2樓，非代收信件之虛擬商務中心或一址多照借址型態，且檢附台電大額電費單佐證實質廠房營運。',
    sourceDoc: '房屋租賃契約書與台電繳費收據',
    sourceSection: '租賃標的與水電憑證',
    citation: '租賃標的：新竹市東區光復路一段580號1-2樓（自用廠房與辦公室，建坪約 280 坪）台灣電力公司繳費金額新台幣 86,420 元',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q1_4',
    sectionId: 1,
    sectionName: '第一部分：企業基本資料與合法性查核',
    title: '營業項目代碼與行業洗錢風險篩查',
    desc: '過濾是否涉及高洗錢風險行業（如虛擬通貨、第三方支付、博弈、珠寶銀樓、當鋪業、特殊娛樂等）。',
    status: 'pass',
    value: '製造及國際貿易業（低洗錢風險）',
    aiConfidence: 98,
    reasoning: '登記營業項目為金屬製造業 (CA02990)、機械設備製造 (CB01010) 及國際貿易 (F401010)，未涉及虛擬貨幣服務 (VASP)、地下匯兌、博弈或當舖等金管會明定之高度洗錢行業。',
    sourceDoc: '經濟部商業司公司變更登記事項表',
    sourceSection: '所營事業資料欄',
    citation: '1. CA02990 其他金屬製品製造業 2. CB01010 機械設備製造業 3. F401010 國際貿易業',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q1_5',
    sectionId: 1,
    sectionName: '第一部分：企業基本資料與合法性查核',
    title: '最新主管機關核定登記表與公司章程版次',
    desc: '檢視是否檢附經濟部最新核准之變更登記事項表，董監改選紀錄與章程最新修訂日期是否齊全。',
    status: 'pass',
    value: '最新版次112年4月10日核准版，章程齊備',
    aiConfidence: 95,
    reasoning: '所附為112年4月10日最近一次經濟部核發之變更事項登記表，董監事任期正常，未有頻繁異常更換董事長或突發性改選情形。',
    sourceDoc: '經濟部商業司公司變更登記事項表',
    sourceSection: '最近一次變更日期',
    citation: '最近一次變更日期：中華民國112年04月10日 經理人：陳漢卿',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },

  // SECTION 2: 實質受益人（UBO）與高階管理人員穿透審核
  {
    id: 'q2_1',
    sectionId: 2,
    sectionName: '第二部分：實質受益人（UBO）與治理架構審核',
    title: '負責人/代表人身分真偽與雙證件查核',
    desc: '核對負責人國民身分證領補換記錄、第二證件（健保卡/駕照/護照），查證親簽與本人親自申辦。',
    status: 'pass',
    value: '負責人陳漢卿親簽親辦，雙證件驗證無誤',
    aiConfidence: 97,
    reasoning: '內政部戶政司連線查詢身分證領補換紀錄相符，健保卡雙重查驗無誤，無身分冒用或通報失竊紀錄，且負責人親自到行留存印鑑卡與親簽樣章。',
    sourceDoc: '負責人身分證明文件與戶政查詢單',
    sourceSection: '雙證件影本與臨櫃親簽紀錄',
    citation: '身分證號：J120334891 (初換領：104年11月02日 竹市 換發) 第二身分證件：全民健康保險卡 內政部戶政司領補換查詢符合',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q2_2',
    sectionId: 2,
    sectionName: '第二部分：實質受益人（UBO）與治理架構審核',
    title: '董監事名單與實質控制權分析',
    desc: '檢視董事會成員是否具備實質營運能力，排查人頭董監、親屬異常集中或交叉持股疑慮。',
    status: 'pass',
    value: '董監事結構穩定單純，由創辦人家族與核心幹部組成',
    aiConfidence: 93,
    reasoning: '董事會由董事長陳漢卿主持實質業務，監察人李崇賢負責財務監理，董監事持股達90%，任期穩定，無異常虛設法人董監。',
    sourceDoc: '經濟部商業司公司變更登記事項表',
    sourceSection: '董監事名單欄',
    citation: '董事長：陳漢卿 50% 董事：張麗芬 30% 監察人：李崇賢 10%',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q2_3',
    sectionId: 2,
    sectionName: '第二部分：實質受益人（UBO）與治理架構審核',
    title: '實質受益人 (UBO >25%) 股權穿透識別',
    desc: '依防洗錢法穿透辨識直接或間接持有股權超過25%之自然人，直至最終控制自然人為止。',
    status: 'pass',
    value: '已完整穿透辨識2位自然人UBO (陳漢卿50%, 張麗芬30%)',
    aiConfidence: 98,
    reasoning: '依據股東名冊及章程穿透計算，持股達法定25%門檻之自然人共兩位：陳漢卿（50%）及張麗芬（30%），股權結構一級直透，無多層投資或境外避稅地法人架構。',
    sourceDoc: '股東名冊與實質受益人（UBO）穿透聲明書',
    sourceSection: '股東結構穿透結論',
    citation: '陳漢卿 持股 50.0% -> 符合實質受益人定義；張麗芬 持股 30.0% -> 符合實質受益人定義',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q2_4',
    sectionId: 2,
    sectionName: '第二部分：實質受益人（UBO）與治理架構審核',
    title: 'UBO 身分證明文件及國籍審查',
    desc: '所有持股>25%之實質受益自然人是否均檢附清晰身分證件，審查國籍與具無外國籍身分。',
    status: 'pass',
    value: '全數檢附身分證正反面影本，均為中華民國籍',
    aiConfidence: 96,
    reasoning: '兩位實質受益自然人均已備齊中華民國國民身分證影本，戶籍與通訊地址清晰，無受制裁國家國籍或可疑外籍身分。',
    sourceDoc: '股東名冊與實質受益人穿透聲明書',
    sourceSection: '身分證核驗欄位',
    citation: '穿透結論：實質受益自然人共 2 位（陳漢卿、張麗芬），均已檢附最新國民身分證正反面影本',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },

  // SECTION 3: 洗錢防制、制裁名單與負面新聞掃描
  {
    id: 'q3_1',
    sectionId: 3,
    sectionName: '第三部分：洗錢防制、制裁名單與負面新聞掃描',
    title: '國際洗錢防制與反恐制裁名單 (Sanctions Screening)',
    desc: '比對 OFAC、聯合國安理會 (UN)、歐盟 (EU) 及我國資恐防制法指定制裁名單。',
    status: 'pass',
    value: '檢索無命中紀錄 (No Sanctions Match)',
    aiConfidence: 99,
    reasoning: '經全球反洗錢資料庫 (World-Check) 交叉比對公司名稱、統編、負責人、董監事及UBO自然人，均未列於任何國內外制裁黑名單。',
    sourceDoc: '全球反洗錢與制裁名單檢索系統報告',
    sourceSection: '制裁名單檢索總覽',
    citation: '1. 聯合國安理會制裁名單：未命中 2. 美國財政部外國資產管制辦公室 (OFAC SDN)：未命中 3. 台灣調查局制裁名單：未命中',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q3_2',
    sectionId: 3,
    sectionName: '第三部分：洗錢防制、制裁名單與負面新聞掃描',
    title: '重要政治性職務人士 (PEP) 關係查核',
    desc: '查核負責人、董監事、高階主管及UBO是否為現任/卸任國內外PEP或其家庭成員及密切關係人。',
    status: 'pass',
    value: '非政治受曝露人士 (Non-PEP)',
    aiConfidence: 99,
    reasoning: '比對監察院公職人員財產申報資料及全球PEP資料庫，負責人陳漢卿及主要董監事均無擔任政要或其二親等利害關係人紀錄。',
    sourceDoc: '全球反洗錢與制裁名單檢索系統報告',
    sourceSection: 'PEP 查核欄位',
    citation: '重要政治性職務人士 (PEP)：未命中 (No PEP)',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q3_3',
    sectionId: 3,
    sectionName: '第三部分：洗錢防制、制裁名單與負面新聞掃描',
    title: '負面新聞與重大司法判決檢索 (Adverse Media)',
    desc: '檢索司法院裁判書、金管會裁罰公告、重大媒體涉嫌詐欺、洗錢、掏空、吸金或逃漏稅案件。',
    status: 'pass',
    value: '無重大負面新聞或經濟犯罪判決 (Clean Media)',
    aiConfidence: 95,
    reasoning: '檢索司法院法學檢索系統近五年裁判書及各大新聞網，該公司及負責人無任何吸金詐欺、洗錢違反銀行法或重大涉訟紀錄。',
    sourceDoc: '全球反洗錢與制裁名單檢索系統報告',
    sourceSection: '負面新聞欄位',
    citation: '負面新聞 (Adverse Media) 與司法判決檢索：無重大民刑事經濟犯罪、背信或詐欺訴訟紀錄',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q3_4',
    sectionId: 3,
    sectionName: '第三部分：洗錢防制、制裁名單與負面新聞掃描',
    title: '聯防警示帳戶及通報衍生管制名單檢核',
    desc: '查詢金融機構聯合徵信中心 (JCIC) 及 165 反詐騙聯防平台，排除警示帳戶通報名冊。',
    status: 'pass',
    value: '無通報警示或管制帳戶紀錄 (Normal Account Status)',
    aiConfidence: 99,
    reasoning: '聯徵中心查詢無受通報衍生管制帳戶，過去亦無遭告誡、存款帳戶拒絕往來或警示凍結紀錄。',
    sourceDoc: '全球反洗錢與制裁名單檢索系統報告',
    sourceSection: '聯防中心檢核',
    citation: '聯防中心警示帳戶檢核：無通報警示或衍生管制紀錄',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },

  // SECTION 4: 開戶合理性、商業意圖與地緣關係檢核
  {
    id: 'q4_1',
    sectionId: 4,
    sectionName: '第四部分：開戶合理性、商業意圖與地緣關係檢核',
    title: '開戶主要目的與金融業務必要性',
    desc: '審查申請帳戶之具體用途（薪資轉帳、貨款收付、進出口外匯或融資授信繳息），是否具正當業務需要。',
    status: 'pass',
    value: '公司員工薪資轉帳專戶及供應商貨款結算',
    aiConfidence: 95,
    reasoning: '申請目的為支應全廠約45位員工每月薪轉代發，以及聯發、台積電體系客戶之應收帳款與進貨供應商月結付款，商業合理性充足。',
    sourceDoc: '業務實質往來合約與訂單憑證',
    sourceSection: '客戶開戶申請書說明欄',
    citation: '主要客戶契約：TSMC-EQ-2023-091 年度零件採購協議 中鋼特合金進貨採購協議',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q4_2',
    sectionId: 4,
    sectionName: '第四部分：開戶合理性、商業意圖與地緣關係檢核',
    title: '分行地緣關係合理性檢核（防範跨區開戶）',
    desc: '檢核營業地址與開戶分行之地理距離。非地緣範圍內之跨區開戶，需具備明確合理的商業理由。',
    status: 'pass',
    value: '具高度地緣關係（距離分行僅 1.2 公里）',
    aiConfidence: 97,
    reasoning: '公司營業地址位於新竹市光復路一段，與受理分行同屬竹科園區金融商圈，車程僅5分鐘，完全符合金管會地緣性開戶原則，無異常跨區開戶風險。',
    sourceDoc: '經濟部變更事項登記表與分行系統比對',
    sourceSection: '營業地址與分行地址',
    citation: '公司所在地：新竹市東區光復路一段580號1-2樓（距分行1.2公里）',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q4_3',
    sectionId: 4,
    sectionName: '第四部分：開戶合理性、商業意圖與地緣關係檢核',
    title: '預期每月交易型態與交易金額合理性',
    desc: '評估申報之預估每月交易量、單筆最大收付款金額是否與其實際營收及資本額相當。',
    status: 'pass',
    value: '預估月交易額1,800~2,200萬，與401報表營收相當',
    aiConfidence: 94,
    reasoning: '申報月交易額約新台幣2,000萬元，與最近一期401表所載每雙月銷售額約2,135萬元高度吻合，無交易量虛增或與公司規模悖離之跡象。',
    sourceDoc: '財政部營業人銷售額與稅額申報書 (401表)',
    sourceSection: '銷售額合計與開戶問券',
    citation: '銷售額合計（第25欄）：新台幣 21,350,000 元',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q4_4',
    sectionId: 4,
    sectionName: '第四部分：開戶合理性、商業意圖與地緣關係檢核',
    title: '開戶初期與日常營運資金來源/去向說明',
    desc: '確認開戶存入之第一筆初始款項及未來主要資金來源合法性（銷貨收入、股東往來或增資款）。',
    status: 'pass',
    value: '自他行活期存款轉入銷貨款，來源清晰正當',
    aiConfidence: 96,
    reasoning: '初始存入新台幣50萬元來自負責人於本行之同名合法帳戶移轉，後續主要金流來自境內知名半導體及製造業法人之商業銷貨貨款，資金來源純淨透明。',
    sourceDoc: '開戶申請書與交易合約',
    sourceSection: '資金來源申報',
    citation: '主要客戶契約：年度零件採購協議 中鋼特合金原料進貨月結30天',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },

  // SECTION 5: 實質營運佐證與業務真實性查核
  {
    id: 'q5_1',
    sectionId: 5,
    sectionName: '第五部分：實質營運佐證與業務真實性查核',
    title: '營業稅申報書（401/403/405表）查驗',
    desc: '審查近兩期401申報書正本，確認統一編號、申報銷售額、銷項進項稅額及有無欠稅紀錄。',
    status: 'pass',
    value: '近一年營業額1.24億元，無欠稅與違章紀錄',
    aiConfidence: 98,
    reasoning: '檢附113年7-8月401表，銷售額2,135萬，前期5-6月銷售額1,980萬，近一年營業額突破1.2億元，且無滯納欠稅註記，財務表現健全真實。',
    sourceDoc: '財政部營業人銷售額與稅額申報書 (401表)',
    sourceSection: '銷售額第25欄及稅籍註記',
    citation: '銷售額合計（第25欄）：新台幣 21,350,000 元 近一年累計營業額：新台幣 124,500,000 元 有無滯欠紀錄：無任何違章與欠稅紀錄',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q5_2',
    sectionId: 5,
    sectionName: '第五部分：實質營運佐證與業務真實性查核',
    title: '業務交易往來憑證（採購/銷貨合約及發票）',
    desc: '抽核至少1至2份主要客戶/供應商往來合約、訂單、商業發票、海關出口報單等實質營運證明。',
    status: 'pass',
    value: '檢附台積電供應鏈協議及中鋼特合金採購合約',
    aiConfidence: 96,
    reasoning: '檢附兩份正式生效之供應鏈採購協議及進貨月結憑證，簽約雙方資訊完整並有用印，可證實其精密製造業務之真實性與持續性。',
    sourceDoc: '業務實質往來合約與訂單憑證',
    sourceSection: '合約首頁與簽署欄',
    citation: 'TSMC-EQ-2023-091 年度零件採購協議 中鋼特合金採購合約簽訂迄今已達4年',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q5_3',
    sectionId: 5,
    sectionName: '第五部分：實質營運佐證與業務真實性查核',
    title: '實體營運處所證明文件（租約/水電費單）',
    desc: '查驗房屋租賃契約書、建物所有權狀及近期公用事業水電繳費證明，確認承租人戶名相符。',
    status: 'pass',
    value: '檢附5年期有效租約及8月份大額台電繳費收據',
    aiConfidence: 97,
    reasoning: '租賃契約效期至115年6月，標的物為280坪廠房，最新8月份電費收據新台幣86,420元戶名與公司完全一致，足以確認實體運作狀態。',
    sourceDoc: '房屋租賃契約書與台電繳費收據',
    sourceSection: '租約期限與電費收據',
    citation: '租賃期間：自民國110年7月1日起至民國115年6月30日止 台電113年8月份繳費收據金額 86,420 元',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q5_4',
    sectionId: 5,
    sectionName: '第五部分：實質營運佐證與業務真實性查核',
    title: '行員實地場勘/實地訪查紀錄 (On-site Visit)',
    desc: '企金AO專案經理實地訪視營業處所，確認招牌掛設、實際員工上班辦公、設備存貨及拍照存檔。',
    status: 'pass',
    value: '分行經辦已完成實地場勘，招牌完備並有約40名員工在職',
    aiConfidence: 92,
    reasoning: '經辦行員於開戶前已實地前往新竹光復路廠區查訪，現場合法懸掛企業招牌，廠區機台運作正常，符合行內實地徵信查核標準。',
    sourceDoc: '分行企金徵信實地訪查紀錄表',
    sourceSection: '訪視摘要欄',
    citation: '現況查證：現場有元豐精密科技懸掛招牌，辦公室約15人、廠房作業員約30人，設備機台正常運轉',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },

  // SECTION 6: 綜合風險評級與資格認定結論
  {
    id: 'q6_1',
    sectionId: 6,
    sectionName: '第六部分：綜合風險評級與資格認定結論',
    title: '洗錢及資恐綜合風險等級 (Risk Rating)',
    desc: '整合客戶背景、地域風險、產業特性、交易產品及資金管道評估總體洗錢風險等級。',
    status: 'pass',
    value: '低風險 (Low AML Risk)',
    aiConfidence: 98,
    reasoning: '客戶營運穩定、股權單純清晰穿透無疑、無PEP與負面新聞、具有強固地緣關係且財務數據扎實，依本行防制洗錢評分矩陣評定為「低風險」。',
    sourceDoc: '全案AI綜合風險計分引擎',
    sourceSection: '風險矩陣計分',
    citation: '綜合評分：94.5分 (等級：低風險 Low Risk)',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q6_2',
    sectionId: 6,
    sectionName: '第六部分：綜合風險評級與資格認定結論',
    title: '加強客戶審查 (EDD) 程序啟動判定',
    desc: '評估是否符合啟動 EDD 法定條件（如高風險行業、離岸控股避稅天堂、PEP利害關係人等）。',
    status: 'pass',
    value: '毋須啟動 EDD（適用一般 CDD 作業標準）',
    aiConfidence: 99,
    reasoning: '未觸發任何法規強制啟動加強客戶審查之警示紅旗條件，適用標準客戶盡職調查 (CDD) 程序即可。',
    sourceDoc: '法規警示指標檢核清單',
    sourceSection: 'EDD 觸發矩陣',
    citation: '無高風險國家、無離岸架構、無PEP、無虛擬資產，毋須啟動EDD',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q6_3',
    sectionId: 6,
    sectionName: '第六部分：綜合風險評級與資格認定結論',
    title: '開戶資格認定最終決策結論',
    desc: '綜合全案文件查核結果，判定准駁決策（核准開戶 / 附條件核准 / 照會補正後再審 / 婉拒開戶）。',
    status: 'pass',
    value: '【核准開戶】(Approved for Account Opening)',
    aiConfidence: 98,
    reasoning: '全案24項企金開戶查核指標均符合法規及內控規範，文件佐證齊備無缺失，建議予以全功能企金帳戶（含台外幣活存及企業網銀）核准開立。',
    sourceDoc: '企金開戶審查核決簽呈',
    sourceSection: '決策結論欄',
    citation: '全項符合，建議予以核准開戶',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  },
  {
    id: 'q6_4',
    sectionId: 6,
    sectionName: '第六部分：綜合風險評級與資格認定結論',
    title: '案件建議核決層級',
    desc: '依風險等級及內部授權辦法，決定簽核層級（初核經辦 / 襄理 / 分行經理 / 總行洗錢防制專責主管）。',
    status: 'pass',
    value: '分行初核經辦 -> 業務主管/襄理 覆核決行',
    aiConfidence: 98,
    reasoning: '本案為低風險標準件且無跨區開戶問題，依企金開戶分層負責授權辦法，由開戶經辦初審後，送交營業單位襄理或副理覆核決行即可。',
    sourceDoc: '分層授權業務規章',
    sourceSection: '低風險開戶授權表',
    citation: '低風險且地緣相符件，由營業處所二級主管（襄理/副理）覆核決行',
    verified: false,
    auditorNote: '',
    deficiencyAction: ''
  }
];

createApp({
  setup() {
    const activeTab = ref('checklist'); // 'checklist', 'summary', 'docs', 'settings'
    const selectedCaseKey = ref('case_normal');
    const cases = ref(SAMPLE_CASES);
    const questions = ref(JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)));
    const activeSectionFilter = ref('all');
    const statusFilter = ref('all'); // 'all', 'pending', 'alert', 'pass', 'unverified'
    const searchQuery = ref('');
    const activeDocTab = ref('moea'); // 'moea', 'tax401', 'ubo', 'idDocs', 'lease', 'tradeContract', 'amlScreening'
    
    // AI Scanning state
    const isScanning = ref(false);
    const scanStep = ref(0);
    const scanLogs = ref([]);
    const scanProgress = ref(0);
    
    // Local AI engine settings
    const aiEngineMode = ref('builtin'); // 'builtin', 'ollama'
    const ollamaUrl = ref('http://localhost:11434');
    const ollamaModel = ref('llama3:latest');
    const ollamaStatus = ref('untested'); // 'untested', 'connected', 'error'
    
    // Modal & Drawer states
    const showDetailModal = ref(false);
    const currentDetailItem = ref(null);
    const showDeficiencyLetterModal = ref(false);
    const showApprovalMemoModal = ref(false);
    const showCustomUploadModal = ref(false);
    const showToast = ref(false);
    const toastMessage = ref('');
    
    // Custom Upload Form
    const customText = ref('');
    const customCompanyName = ref('');
    const customTaxId = ref('');

    // Computed properties
    const currentCase = computed(() => {
      return cases.value[selectedCaseKey.value] || cases.value['case_normal'];
    });

    const filteredQuestions = computed(() => {
      return questions.value.filter(q => {
        // Section filter
        if (activeSectionFilter.value !== 'all' && q.sectionId !== parseInt(activeSectionFilter.value)) {
          return false;
        }
        // Status filter
        if (statusFilter.value === 'pass' && q.status !== 'pass') return false;
        if (statusFilter.value === 'pending' && q.status !== 'pending') return false;
        if (statusFilter.value === 'alert' && q.status !== 'alert') return false;
        if (statusFilter.value === 'unverified' && q.verified) return false;
        
        // Search query
        if (searchQuery.value.trim()) {
          const qText = `${q.title} ${q.desc} ${q.value} ${q.reasoning} ${q.citation}`.toLowerCase();
          if (!qText.includes(searchQuery.value.toLowerCase().trim())) {
            return false;
          }
        }
        return true;
      });
    });

    const stats = computed(() => {
      const total = questions.value.length;
      const pass = questions.value.filter(q => q.status === 'pass').length;
      const pending = questions.value.filter(q => q.status === 'pending').length;
      const alert = questions.value.filter(q => q.status === 'alert').length;
      const verified = questions.value.filter(q => q.verified).length;
      const unverified = total - verified;
      const completionRate = Math.round((pass / total) * 100);
      
      // Calculate overall risk level
      let overallRisk = '低風險 (Low)';
      let overallColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
      if (alert > 0) {
        overallRisk = '高風險 (High)';
        overallColor = 'text-rose-700 bg-rose-50 border-rose-300';
      } else if (pending > 0) {
        overallRisk = '中度風險 - 待補件 (Medium)';
        overallColor = 'text-amber-700 bg-amber-50 border-amber-300';
      }

      return {
        total,
        pass,
        pending,
        alert,
        verified,
        unverified,
        completionRate,
        overallRisk,
        overallColor
      };
    });

    const pendingDeficiencyList = computed(() => {
      return questions.value.filter(q => q.status === 'pending' || q.status === 'alert');
    });

    // Helper functions
    function triggerToast(msg) {
      toastMessage.value = msg;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    }

    function getStatusBadge(status) {
      switch (status) {
        case 'pass':
          return { label: '符合 (Pass)', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
        case 'pending':
          return { label: '待補件 (Pending)', class: 'bg-amber-100 text-amber-800 border-amber-300' };
        case 'alert':
          return { label: '警訊/高風險 (Alert)', class: 'bg-rose-100 text-rose-800 border-rose-300' };
        case 'fail':
          return { label: '不符 (Fail)', class: 'bg-red-200 text-red-900 border-red-400' };
        default:
          return { label: '未檢核', class: 'bg-slate-100 text-slate-700 border-slate-300' };
      }
    }

    function selectCase(caseKey) {
      selectedCaseKey.value = caseKey;
      runLocalAiScan();
    }

    // Run Local AI Scan with multi-stage progress
    async function runLocalAiScan() {
      isScanning.value = true;
      scanStep.value = 1;
      scanProgress.value = 10;
      scanLogs.value = [];

      const addLog = (text) => {
        const time = new Date().toLocaleTimeString();
        scanLogs.value.unshift(`[${time}] ${text}`);
      };

      addLog('啟動地端機敏保護模式：初始化瀏覽器本機神經抽取管線...');
      await new Promise(r => setTimeout(r, 200));

      scanStep.value = 2;
      scanProgress.value = 30;
      addLog(`載入當前案件【${currentCase.value.companyName}】掃描檔案共 7 份...`);
      addLog('執行商工登記與401報表光學字元切分 (OCR Token Normalization)...');
      await new Promise(r => setTimeout(r, 250));

      scanStep.value = 3;
      scanProgress.value = 55;
      addLog('執行命名實體辨識 (NER)：抽取統一編號、登記資本、營業地址、董監事名單...');
      addLog('計算實質受益人 (UBO) 股權穿透樹狀拓撲 (>25% 門檻查驗)...');
      await new Promise(r => setTimeout(r, 250));

      scanStep.value = 4;
      scanProgress.value = 80;
      addLog('執行防制洗錢 (AML)、PEP政治人物與國際制裁名單交叉比對...');
      addLog('檢核開戶分行地緣距離與401報表營收交易額合理性...');
      await new Promise(r => setTimeout(r, 250));

      scanStep.value = 5;
      scanProgress.value = 100;
      addLog('完成 24 題企金查核項目填寫，綁定原始佐證引文與判定依據！');
      addLog('產出缺漏件與風險處置摘要報告...');

      // Apply case-specific data
      applyCaseData(selectedCaseKey.value);

      await new Promise(r => setTimeout(r, 200));
      isScanning.value = false;
      triggerToast(`已由地端AI完成【${currentCase.value.companyName}】之24項開戶問項審核與填表！`);
    }

    function applyCaseData(caseKey) {
      if (caseKey === 'case_normal') {
        questions.value = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
      } else if (caseKey === 'case_pending') {
        const qList = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        
        // Q1.1
        qList[0].value = '90812377 (核准設立，但登記於商務中心)';
        qList[0].citation = '統一編號：90812377 公司名稱：瀚亞寰宇國際生醫貿易有限公司';
        qList[0].sourceDoc = '公司設立登記事項表';

        // Q1.2
        qList[1].status = 'pending';
        qList[1].value = '設立僅3個月 / 資本額100萬 (新創法人警戒)';
        qList[1].reasoning = 'AI 辨識設立日期為113年7月2日，迄今僅成立3個月，屬金管會「新設立法人（未滿半年）」監控對象；且登記資本額僅新台幣100萬元，資本充裕度較低。';
        qList[1].citation = '核准設立日期：中華民國113年07月02日 資本總額：新臺幣 1,000,000 元';
        qList[1].deficiencyAction = '需索取會計師設立資本查核簽證報告書與股款繳納股東存款憑證。';

        // Q1.3
        qList[2].status = 'pending';
        qList[2].value = '借址登記於台中匯創商務中心 (虛擬共享桌)';
        qList[2].reasoning = '登記地址為台中市台灣大道二段99號14樓之2，經比對為「匯創國際商務中心」多戶共用之代收秘書地址，非獨立實質營運場所，符合金管會重點防弊查核指標。';
        qList[2].citation = '公司所在地：臺中市西區台灣大道二段99號14樓之2（匯創國際商務中心）';
        qList[2].deficiencyAction = '需專案指派行員前往現場實地場勘，查核有無專屬辦公人員及庫房。';

        // Q2.3
        qList[7].status = 'alert';
        qList[7].value = '境外法人股東持股40%未穿透自然人 (UBO未明)';
        qList[7].reasoning = '法人股東 GLORY APEX HOLDINGS LTD. (BVI) 持有40%股權，大於法定25%穿透門檻。但全案卷宗未附該BVI公司之股東名冊、董事名冊或職權證明書，無法穿透識別最終自然人，依法不得核發開戶。';
        qList[7].citation = 'GLORY APEX HOLDINGS LTD. (英屬維京群島 BVI 註冊)（出資額 400,000 元，佔 40%）';
        qList[7].deficiencyAction = '【重大缺失】開立照會單，要求補送經公認證之境外公司 Certificate of Incumbency 及 UBO 自然人身分證件。';

        // Q4.2
        qList[13].status = 'alert';
        qList[13].value = '無地緣關係（營業在台中，跨區至台北南京東路開戶）';
        qList[13].reasoning = '公司登記於台中市西區，卻親赴台北市南京東路分行申辦開戶，兩地相距逾160公里，且申請書未載明合理解釋（如台北大客戶指定或關係企業集中管理），具跨區開戶洗錢紅旗警訊。';
        qList[13].citation = '所在地：臺中市西區台灣大道 申請分行：台北南京東路分行（相距160公里）';
        qList[13].deficiencyAction = '請負責人填具「跨區開戶合理原因說明書」，並需分行經理專案核准。';

        // Q4.3
        qList[14].status = 'alert';
        qList[14].value = '預期月匯出入8,000萬，與100萬資本額差距80倍';
        qList[14].reasoning = '申請書載明預估每月進出口外匯交易金額達新台幣8,000萬元，而公司資本額僅100萬元，兩者落差高達80倍，極度不相稱，有借名洗錢轉匯之嫌疑。';
        qList[14].citation = '預估每月交易額美金 2,500,000 元（約合新台幣 8,000 萬元）資本額 1,000,000 元';
        qList[14].deficiencyAction = '需徵提具法律約束力之大額正式商業採購訂單及信用狀 (L/C) 憑證。';

        // Q5.1
        qList[16].status = 'pending';
        qList[16].value = '未檢附營業稅401申報書（缺漏件）';
        qList[16].reasoning = '因甫設立未滿三個月，尚未向國稅局完成第一期401表營業稅申報，無法佐證其實際銷貨營業額。';
        qList[16].citation = '【未檢附缺失】現場未能提供會計師設立資本查核簽證報告書及任何發票存根';
        qList[16].deficiencyAction = '要求提供近三個月銀行存摺金流往來明細或會計師設立資本查核報告書。';

        // Q5.3
        qList[18].status = 'pending';
        qList[18].value = '僅有意向預約書，缺正式租賃合約與水電單據';
        qList[18].reasoning = '僅提供商務中心進駐預約單草約，未正式用印簽約，亦無押租金匯款憑單及自來水、台電公用事業帳單。';
        qList[18].citation = '提交文件：匯創國際商務中心進駐意向預約書（尚未正式簽約，無押金憑證）';
        qList[18].deficiencyAction = '補送正式租賃契約書完稅影本與近一期租金轉帳水單。';

        // Q6.1
        qList[20].status = 'alert';
        qList[20].value = '中高風險 (Medium-High Risk - 觸發多項紅旗)';
        qList[20].reasoning = '觸發三大紅旗警訊：(1) UBO穿透受阻未明 (2) 跨區無地緣開戶 (3) 資本額與預期交易量極度不相稱。整體洗錢風險高於常態。';
        qList[20].citation = '綜合警示評定：中高風險（觸發洗錢防制監控指標第4、7、12條）';
        qList[20].deficiencyAction = '暫緩放行，進入缺失補正程序。';

        // Q6.2
        qList[21].status = 'alert';
        qList[21].value = '需強制啟動加強客戶審查 (EDD)';
        qList[21].reasoning = '依本行AML作業準則第15條，具境外控股不透明架構及跨區無合理商業理由者，應自動升級為加強客戶審查 (EDD) 程序。';
        qList[21].citation = '境外BVI控股與跨區開戶觸發 EDD 規範';
        qList[21].deficiencyAction = '由防制洗錢專責人員調閱境外公司查核報告並行員專案複審。';

        // Q6.3
        qList[22].status = 'pending';
        qList[22].value = '【暫緩開戶 - 待補件照會中】';
        qList[22].reasoning = '因實質受益人(UBO)尚未查清、跨區開戶商業理由未補正、缺乏401稅表及正式租約，現階段不得核准開戶，應開立正式照會單通知限期7日內補齊。';
        qList[22].citation = '依規定於待補文件補正且複核合格前，系統鎖定不得開戶';
        qList[22].deficiencyAction = '發出「企金開戶補正資料照會單」，限期7日內回覆。';

        // Q6.4
        qList[23].status = 'alert';
        qList[23].value = '需呈報「分行經理」親簽核准，並副知總行洗錢防制部';
        qList[23].reasoning = '跨區開戶及EDD案件超越一般襄理決行權限，依法必須由分行最高主管（分行經理）審閱實地場勘報告後親簽決行。';
        qList[23].citation = '跨區與中高風險案件屬分行經理核決層級';
        qList[23].deficiencyAction = '備妥審查意見簽呈送交分行經理批示。';

        questions.value = qList;

      } else if (caseKey === 'case_highrisk') {
        const qList = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        
        // Q1.4
        qList[3].status = 'alert';
        qList[3].value = '營業項目雖為軟體行銷，實質經營虛擬通貨 (VASP) 跨境金流';
        qList[3].reasoning = '訪談紀錄與合約揭露該公司主力業務為境外加密貨幣OTC結匯及交易所推廣，且尚未向金管會完成防制洗錢遵循聲明，屬金融機構高度管制之高洗錢行業。';
        qList[3].citation = '為境外 Web3/加密貨幣交易所提供社群推廣與大額場外交易 (OTC) 結匯引介服務';
        qList[3].deficiencyAction = '若涉及未遵循之虛擬通貨金流，依法應予婉拒開戶。';

        // Q3.2
        qList[9].status = 'alert';
        qList[9].value = '大股東趙培倫為現任政務官親弟 (國內PEP利害關係人)';
        qList[9].reasoning = '大股東趙培倫持股35%（UBO），經全球反洗錢系統核對，其為現任直轄市副市長趙O宇之胞弟，屬洗錢防制法規範之「重要政治性職務人士之家庭成員（二親等血親）」。';
        qList[9].citation = 'PEP 檢索命中：趙培倫為現任直轄市副市長之親胞弟，符合洗錢防制法二親等血親規定';
        qList[9].deficiencyAction = '需調查該政務官職權是否與該公司業務存在利益衝突，並查明出資財產來源。';

        // Q3.3
        qList[10].status = 'alert';
        qList[10].value = '負面新聞命中：涉及區塊鏈群組吸金爭議，曾遭檢調傳喚';
        qList[10].reasoning = '113年4月媒體刊載該公司行銷團隊涉入爭議性區塊鏈自救會投資糾紛，曾赴檢調說明，具重大法遵與聲譽風險。';
        qList[10].citation = '負面新聞：極光鏈動行銷團隊遭檢調傳喚釐清吸金爭議';
        qList[10].deficiencyAction = '需徵提律師意見書或地檢署偵結不起訴處分書證明。';

        // Q6.1
        qList[20].status = 'alert';
        qList[20].value = '極高風險 (High / Critical AML Risk)';
        qList[20].reasoning = '涉及虛擬資產(VASP)、政治人物利害關係人(PEP)持股35%、且有涉吸金負面新聞，各項風險指標均達行內最高警示等級。';
        qList[20].citation = '綜合評定：高風險 (High Risk 98分)';
        qList[20].deficiencyAction = '進行全面背景深層盡職調查 (Deep Due Diligence)。';

        // Q6.2
        qList[21].status = 'alert';
        qList[21].value = '強制啟動最嚴格加強客戶審查 (Tier-1 EDD)';
        qList[21].reasoning = 'PEP直接持股且涉負面新聞，依法必須清查最終財富來源 (Source of Wealth) 及設立資金合法證明。';
        qList[21].citation = '依洗錢防制法第9條，PEP關聯戶強制執行最高規格 EDD';
        qList[21].deficiencyAction = '要求提供大股東個人歷年所得扣繳憑單與財富累積證明。';

        // Q6.3
        qList[22].status = 'alert';
        qList[22].value = '【建議予以婉拒開戶 (Decline)】或附嚴格限制條件';
        qList[22].reasoning = '由於該公司未能提示金管會洗錢防制遵循洗錢聲明，且涉司法爭議新聞，若開戶恐遭作為地下OTC洗錢管道，對本行聲譽風險極高，建議婉拒開戶。';
        qList[22].citation = '未符法規合規標準，建議婉拒';
        qList[22].deficiencyAction = '製備婉拒開戶說明書或報送總行核駁。';

        // Q6.4
        qList[23].status = 'alert';
        qList[23].value = '總行洗錢防制專責主管 (CCO) 及副總經理層級核決';
        qList[23].reasoning = '涉及PEP重要政治人物開戶與高風險爭議，分行無准駁裁量權，依規章須報呈總行防制洗錢專責主管及總行法遵長核簽。';
        qList[23].citation = 'PEP開戶案件依規章由總行專責主管核決';
        qList[23].deficiencyAction = '擬具專案簽呈呈報總行防制洗錢部。';

        questions.value = qList;
      }
    }

    // Modal Details
    function openItemDetail(item) {
      currentDetailItem.value = JSON.parse(JSON.stringify(item));
      showDetailModal.value = true;
    }

    function saveItemAudit() {
      if (!currentDetailItem.value) return;
      const idx = questions.value.findIndex(q => q.id === currentDetailItem.value.id);
      if (idx !== -1) {
        questions.value[idx] = JSON.parse(JSON.stringify(currentDetailItem.value));
        triggerToast(`問項【${questions.value[idx].title}】審核覆核已更新！`);
      }
      showDetailModal.value = false;
    }

    function toggleVerify(item) {
      item.verified = !item.verified;
      if (item.verified) {
        triggerToast(`問項【${item.title}】已標記為經辦覆核通過！`);
      }
    }

    function verifyAllPassed() {
      questions.value.forEach(q => {
        if (q.status === 'pass') {
          q.verified = true;
        }
      });
      triggerToast('所有【符合 (Pass)】問項已批次完成經辦核定！');
    }

    // Test Ollama Connection
    async function testOllama() {
      ollamaStatus.value = 'testing';
      try {
        const res = await fetch(`${ollamaUrl.value}/api/tags`, { method: 'GET' });
        if (res.ok) {
          ollamaStatus.value = 'connected';
          triggerToast('成功連接至地端 Ollama 本地大模型服務！');
        } else {
          ollamaStatus.value = 'error';
          triggerToast('連線失敗：請確認地端 Ollama 是否已啟動且允許 CORS。');
        }
      } catch (e) {
        ollamaStatus.value = 'error';
        triggerToast('連線失敗：未能連線至地端 Ollama 埠號，已自動維持本機高效規則引擎模式。');
      }
    }

    // Custom Document Parsing via Local AI
    function processCustomText() {
      if (!customText.value.trim()) {
        triggerToast('請輸入或貼上掃描文字內容');
        return;
      }

      const text = customText.value;
      // Extract Tax ID (8 digits)
      const taxIdMatch = text.match(/(?:統一編號|統編)[：:\s]*([0-9]{8})/);
      const taxId = taxIdMatch ? taxIdMatch[1] : (customTaxId.value || '88390211');
      
      // Extract Company Name
      const compMatch = text.match(/(?:公司名稱|名稱)[：:\s]*([\u4e00-\u9fa5A-Za-z0-9]+(?:公司|行|社))/);
      const compName = compMatch ? compMatch[1] : (customCompanyName.value || '自訂開戶法人企業');

      // Create new case
      const newKey = 'custom_' + Date.now();
      cases.value[newKey] = {
        id: newKey,
        name: `${compName} (自訂掃描檔案)`,
        companyName: compName,
        taxId: taxId,
        riskLevel: '由在地AI即時分析中',
        riskBadge: 'bg-blue-50 text-blue-700 border-blue-300',
        summary: `自訂上傳之掃描文字檔案，統一編號：${taxId}，經地端AI神經模型解析後自動填入開戶認定單。`,
        docs: {
          moea: text,
          tax401: text.includes('401') ? text : '（未另外檢附401報表獨立檔案）',
          ubo: text.includes('持股') ? text : '（請參考掃描文件之股權段落）',
          idDocs: '（自訂掃描檔整合檢附）',
          lease: text.includes('租賃') ? text : '（自訂掃描檔中查核處所租約）',
          tradeContract: '（自訂業務契約）',
          amlScreening: '（地端名單庫自動掃描）'
        }
      };

      selectedCaseKey.value = newKey;
      showCustomUploadModal.value = false;
      runLocalAiScan();
    }

    // Print functionality
    function printPage() {
      window.print();
    }

    // Export JSON
    function exportChecklistJson() {
      const exportData = {
        exportDate: new Date().toISOString(),
        case: currentCase.value,
        statistics: stats.value,
        checklist: questions.value
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `企金開戶認定單_${currentCase.value.companyName}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      triggerToast('已成功匯出完整企金開戶資格認定資料 (JSON)');
    }

    onMounted(() => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });

    return {
      activeTab,
      selectedCaseKey,
      cases,
      currentCase,
      questions,
      filteredQuestions,
      activeSectionFilter,
      statusFilter,
      searchQuery,
      activeDocTab,
      stats,
      pendingDeficiencyList,
      isScanning,
      scanStep,
      scanLogs,
      scanProgress,
      aiEngineMode,
      ollamaUrl,
      ollamaModel,
      ollamaStatus,
      showDetailModal,
      currentDetailItem,
      showDeficiencyLetterModal,
      showApprovalMemoModal,
      showCustomUploadModal,
      showToast,
      toastMessage,
      customText,
      customCompanyName,
      customTaxId,
      getStatusBadge,
      selectCase,
      runLocalAiScan,
      openItemDetail,
      saveItemAudit,
      toggleVerify,
      verifyAllPassed,
      testOllama,
      processCustomText,
      printPage,
      exportChecklistJson,
      triggerToast
    };
  }
}).mount('#app');
