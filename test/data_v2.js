const timeperiods = [
    { start: 1960, end: 1969, label: '1960年代' },
    { start: 1970, end: 1979, label: '1970年代' },
    { start: 1980, end: 1989, label: '1980年代' },
    { start: 1990, end: 1999, label: '1990年代' },
    { start: 2000, end: 2009, label: '2000年代' },
    { start: 2010, end: 2019, label: '2010年代' },
    { start: 2020, end: 2025, label: '2020年代' }
];

const eventData = {
    tech: {
        title: '科技發展',
        color: '#FFE4E1',
        events: [
            {
                period: '1960年代',
                mainEvents: [
                    {
                        year: 1966,
                        title: '工研院籌備',
                        description: '經建會設立工業技術研究院籌備小組，台灣政府著手推動工業現代化政策，並籌劃設立工研院。',
                        impact: ['奠定科技自主研發基礎']
                    }
                ],
                background: '台灣開始工業化轉型期',
                trends: ['製造業基礎建設', '技術引進']
            },
            {
                period: '1970年代',
                mainEvents: [
                    {
                        year: 1973,
                        title: '工研院成立',
                        description: '工業技術研究院(ITRI)成立，成為台灣科技研發的重要推手。',
                        impact: ['建立自主研發能力', '產業技術升級']
                    },
                    {
                        year: 1974,
                        title: 'RCA技術合作',
                        description: '政府與RCA技術合作，引進美國RCA半導體技術。',
                        impact: ['培養第一代電子工程技術人才', '半導體產業起步']
                    }
                ],
                background: '科技研發體系建立期',
                trends: ['半導體技術引進', '研發機構設立']
            }
        ]
    }
};

// 先只實作科技領域的測試資料
// 若測試成功再補充其他領域
