/* PARTICIPANT JUDGEMENTS & QUESTIONS */
var stimuli = Object.freeze({
    templates: [
        '_% chance of appearing',
        '_ thousand people upvoted this'
    ],

    judgments: {
        questions: [
            'How curious are you to know the answer to this question?'
        ],
        choices: [
            ['not curious at all', '', '', '', '', '', 'very curious']
        ]
    },

    attentionQuiz: {
        questions: [
            'How many total headlines did you see?',
            'How many different headlines did you select in Phase 2?'
        ],
        choices: [
            ['5 questions', '7 questions', '10 questions', '15 questions'],
            ['5 questions', '7 questions', '10 questions', '15 questions']
        ]
    },

    articles: [
        {
            headlines: [
                'Banned Ozone-Harming Gas Creeps Back, Suggesting a Mystery Source',
                'How Oman’s Rocks Could Help Save the Planet',
                'New Dive Into Old Data Finds Plumes Erupt From Jupiter’s Moon Europa',
                'A Very Hungry Black Hole Is Found, Gorging on Stars',
                'F.D.A. Approves First Drug Designed to Prevent Migraines'
            ],
            text: [
                'Source: https://www.nytimes.com/2018/05/16/climate/ozone-layer-cfc.html',
                'Source: https://www.nytimes.com/interactive/2018/04/26/climate/oman-rocks.html',
                'Source: https://www.nytimes.com/2018/05/14/science/europa-plumes-water.html',
                'Source: https://www.nytimes.com/2018/05/17/science/hungry-black-hole.html',
                'Source: https://www.nytimes.com/2018/05/17/health/migraines-prevention-drug-aimovig.html'
            ]
        },
        {
            headlines: [
                'When Even LeBron James’s Best Might Not Be Enough',
                'A Road Map to Shopping Like a Royal in London',
                'Jordan Peterson, Custodian of the Patriarchy',
                'For Some in the Hamptons, It’s Not a Home Without a Dock',
                '‘Dietland’ is Violent, Disruptive and Surreal. And Funny.'
            ],
            text: [
                'Source: https://www.nytimes.com/2018/05/18/sports/basketball/lebron-james-cleveland-cavaliers-nba-playoffs.html',
                'Source: https://www.nytimes.com/2018/05/09/travel/royal-warrant-shopping-britain.html',
                'Source: https://www.nytimes.com/2018/05/18/style/jordan-peterson-12-rules-for-life.html',
                'Source: https://www.nytimes.com/2018/05/18/realestate/dock-of-their-own-in-hamptons.html',
                'Source: https://www.nytimes.com/2018/05/18/arts/television/dietland-amc-marti-noxon.html'
            ]
        }
    ]
});
