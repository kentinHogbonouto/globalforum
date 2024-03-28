document.addEventListener('alpine:init', () => {


    Alpine.data('agenda', () => ({
        sectors: [],
        in_memory_sectors: [],
        selected_index: 0,
        head_max_element: 10,
        body_max_element: 3,
        width: 0,
        sector_filters: [],
        next_index: -1,
        remove_ids: [],
        show: "first",
        dates: [],
        times: [],
        durations: [],
        forums: [],

        truncate(text, length = 6, clamp = "...") {
            return text.length > length ? text.slice(0, length) + clamp : text;
        },
        minus_plus(action) {
            if (action == "-") {
                if (this.selected_index > 0) {
                    this.selected_index--
                }
            } else {
                if (this.selected_index < (this.sectors.length - 1)) {
                    this.selected_index++
                }
            }
        },
        show_head_element(index, show = true) {
            let first = false
            let max_index_show = 0

            max_index_show = this.selected_index + this.head_max_element
            first = (index >= this.selected_index)
            return (index < max_index_show) && first
        },
        show_body_element(index, show = true) {
            let first = false
            let max_index_show = 0

            max_index_show = this.selected_index + this.body_max_element
            first = this.selected_index == index || this.selected_index + 1 == index || this.selected_index + 2 == index
            return (index < max_index_show) && first
        },
        resize_window() {
            this.width = window.innerWidth
            if (this.width >= 1200) {
                this.head_max_element = 10
                this.body_max_element = 3
            } else if (this.width >= 992 && this.width < 1200) {
                this.head_max_element = 8
                this.body_max_element = 3
            } else if (this.width >= 576 && this.width < 992) {
                this.head_max_element = 4
                this.body_max_element = 3
            } else {
                this.head_max_element = 3
                this.body_max_element = 1
            }
        },
        sector_in_filter(sector_name, search_in = "") {
            const i = this.sector_filters.findIndex(sector_filter => sector_filter.name === sector_name);
            if (i > -1) {
                let sector_filter = this.sector_filters[i]
                if (search_in === "") {
                    return sector_filter.select
                } else {
                    if (search_in == "date") {
                        return sector_filter.date
                    }
                    if (search_in == "hour") {
                        return sector_filter.hour
                    }
                    if (search_in == "duration") {
                        return sector_filter.duration
                    }
                    if (search_in == "forum") {
                        return sector_filter.forum
                    }
                }
            }
            return false
        },
        toggle_filter(sector_name, search_in = "") {
            const i = this.sector_filters.findIndex(sector_filter => sector_filter.name == sector_name);
            if (i > -1) {
                let sector_filter = this.sector_filters[i]
                if (search_in == "") {
                    sector_filter.select = sector_filter.select ? false : true
                    this.sector_filters[i] = sector_filter

                    if (sector_filter.select) {
                        if (this.remove_ids.includes(i)) {
                            this.remove_ids.splice(this.remove_ids.indexOf(i), 1)
                        }
                    } else {
                        if (!this.remove_ids.includes(i)) {
                            this.remove_ids.push(i)
                        }
                    }

                    this.sectors = []
                    this.in_memory_sectors.forEach((sector, index) => {
                        if (!this.remove_ids.includes(index)) {
                            this.sectors.push(sector)
                        }
                    });

                } else {
                    if (search_in == "date") {
                        sector_filter.date = sector_filter.date ? false : true
                        this.sector_filters[i] = sector_filter
                    }
                    if (search_in == "hour") {
                        sector_filter.hour = sector_filter.hour ? false : true
                        this.sector_filters[i] = sector_filter
                    }
                    if (search_in == "duration") {
                        sector_filter.duration = sector_filter.duration ? false : true
                        this.sector_filters[i] = sector_filter
                    }
                    if (search_in == "forum") {
                        sector_filter.forum = sector_filter.forum ? false : true
                        this.sector_filters[i] = sector_filter
                    }
                }
            } else {
                return false
            }
        },
        value_in_detail(search_in, value) {
            if (search_in == "date") {
                const i = this.dates.findIndex(date => date.date == value);
                if (i > -1) {
                    return this.dates[i].select
                }
            }
            if (search_in == "time") {
                const i = this.times.findIndex(time => time.time == value);
                if (i > -1) {
                    let time = this.times[i]
                    return time.select
                }
            }
            if (search_in == "duration") {
                const i = this.durations.findIndex(duration => duration.duration == value);
                if (i > -1) {
                    let duration = this.durations[i]
                    return duration.select
                }
            }
            if (search_in == "forum") {
                const i = this.forums.findIndex(forum => forum.forum == value);
                if (i > -1) {
                    let forum = this.forums[i]
                    return forum.select
                }
            }
            return true
        },
        toggle_detail(search_in, value) {
            if (search_in == "date") {
                const i = this.dates.findIndex(date => date.date == value);
                if (i > -1) {
                    let date = this.dates[i]
                    date.select = date.select ? false : true
                    this.dates[i] = date
                }
            }
            if (search_in == "time") {
                const i = this.times.findIndex(time => time.time == value);
                if (i > -1) {
                    let time = this.times[i]
                    time.select = time.select ? false : true
                    this.times[i] = time
                }
            }
            if (search_in == "duration") {
                const i = this.durations.findIndex(duration => duration.duration == value);
                if (i > -1) {
                    let duration = this.durations[i]
                    duration.select = duration.select ? false : true
                    this.durations[i] = duration
                }
            }
            if (search_in == "forum") {
                const i = this.forums.findIndex(forum => forum.forum == value);
                if (i > -1) {
                    let forum = this.forums[i]
                    forum.select = forum.select ? false : true
                    this.forums[i] = forum
                }
            }
        },
        init_filter() {
            this.sectors.forEach((sector, index) => {
                this.sector_filters.push({
                    id: index + 1,
                    name: sector.name,
                    select: true,
                    date: true,
                    hour: true,
                    duration: true,
                    forum: true
                })
            });
        },
        init_date() {
            this.sectors.forEach((sector, i) => {
                sector.activities.forEach((activity, index) => {
                    const i = this.dates.findIndex(date => date.date == activity.date);
                    if (i == -1) {
                        this.dates.push({
                            id: index + 1,
                            date: activity.date,
                            select: true
                        })
                    }
                })
            });
        },
        init_time() {
            this.sectors.forEach((sector, i) => {
                sector.activities.forEach((activity, index) => {
                    const i = this.times.findIndex(time => time.time == activity.hour);
                    if (i == -1) {
                        this.times.push({
                            id: index + 1,
                            time: activity.hour,
                            select: true
                        })
                    }
                })
            });
        },
        init_duration() {
            this.sectors.forEach((sector, i) => {
                sector.activities.forEach((activity, index) => {
                    const i = this.durations.findIndex(date => date.duration == activity.duration);
                    if (i == -1) {
                        this.durations.push({
                            id: index + 1,
                            duration: activity.duration,
                            select: true
                        })
                    }
                })
            });
        },
        init_forum() {
            this.sectors.forEach((sector, i) => {
                sector.activities.forEach((activity, index) => {
                    const i = this.forums.findIndex(forum => forum.forum == activity.forum);
                    if (i == -1) {
                        this.forums.push({
                            id: index + 1,
                            forum: activity.forum,
                            select: true
                        })
                    }
                })
            });
        },
        init() {
            this.resize_window()

            this.sectors.push(    {
                id: 1,
                name: "Cities/Local Authorities",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities of the Future",
                    description: "Building Growth and Resilience S1-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Learning from London",
                    description: "The Importance of Infrastructure S1-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Redefining Cities through Opportunities and Challenges S1-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "SDGs in Cities",
                    description: "A Question of Finance? S1-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Urban Policies for Climate Neutrality S1-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pandemic Resilient Cities",
                    description: "Lessons from Coronavirus S1-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Green transformation in cities",
                    description: "what should the energy mix look like? S1-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Creating low-emissions and resilient buildings S1-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Data-driven smart sustainable cities of the future S1-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Creating Safer Cities for All S1-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Reshaping the Urban-Rural Divide in the 21st Century S1-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Harnessing Urbanization for Growth and Poverty Alleviation S1-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Smart Water Cities S1-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Tackling Urban Health Challenges in a Changing World S1-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Urban Planning",
                    description: "The Importance of Civil Society and Grassroots Organisations S1-015",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cities/Local Authorities",
                    description: "Multi-level Action for Equitable and Sustainable Cities S1-016",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Government & Policy",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Monetary Policy and the Risk of Global Recession in 2023 S2-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Funding the WHO and Future Pandemic Preparedness S2-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "The Impact of Public Policy on Economies S2-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Government Administration (5)",
                    description: "The Role of Central Banks: Present and Future S2-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "International Trade and Development (1)",
                    description: "Climate, Trade and Carbon Border Adjustment: Creating Race To The Top S2-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "International Trade and Development(1)",
                    description: "WTO in Crisis? S2-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Government Relations (2)",
                    description: "Reforming the UN: Towards more Fairness S2-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Beyond greenwashing: a hands-on approach to digitally-empowered sustainability S2-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Government Relations (2)",
                    description: "Climate Change Reparations: Colonialism and Climate Change S2-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Social Media: Driving today's Policy-Making S2-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "The Racial Wealth Gap: Radical Differences in Economic Security S2-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Government Relations (2)",
                    description: "Decolonising Foreign Policy S2-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Digital Advertising Policy and Legal State of Play in Europe and Beyond S2-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Building Public Sector Capacity: Open Source and Digital Sovereignty S2-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Public Policy (3)",
                    description: "Regional versus global alliances: Which is the future of the digital economy? S2-015",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "International Affairs (4)",
                    description: "Towards a More Peaceful and Stable World S2-016",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Transport",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Government Investment Strategies: The Importance of Transport to Economic Growth S3-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Achieving an efficient and greener transport sector S3-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain(2)",
                    description: "Decarbonising the commute S3-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain (2)",
                    description: "Reimagining Safety in Transportation S3-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain (2)",
                    description: "On-demand and flexible transport: building a responsive network S3-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Contactless Ticketing for better urban mobility S3-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain (2)",
                    description: "Digitalisation of Public Transport Network S3-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain (2)",
                    description: "Digitalisation of Public Transport Network S3-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Logistics and Supply Chain (2)",
                    description: "Building future mobility with 5G and Telecommunications S3-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Aviation and Aerospace (3)",
                    description: "S3-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Changing mindsets: the challenge of boosting active travel in the regions S3-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Resilient rail transport planning and management S3-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "Transport as a catalyst for inclusive societies S3-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Railroad (4)",
                    description: "High Speed Rail System as a Mobility Driver S3-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Transportation (1)",
                    description: "How a fully integrated urban transport system created by public and private sector collaboration can attract inward investment S3-015",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Railroad (3)",
                    description: "Railway Contribution to EU Green Deal S3-016",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Environment & Energy",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Building a greener future: Reaching Agenda 2030 S4-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Climate Change and National Determined Contributions S4-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Securing The Energy Transition: Resilience And Reliability In The Fce Of Evolving Threats S4-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "After The Crisis: Rebuilding For Energy Security And Climate Action S4-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Europe's Ambitious Shift Towards Renewables S4-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Environmental Services (2)",
                    description: "The UK waste to energy market - how much more growth is there? S4-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Technology’s role in sustainability: fact or fiction? S4-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Oil & Energy (3)",
                    description: "Oil And Gas In A Net-Zero World S4-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "The Mining Industries Role in the Race to Net Zero S4-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "eFuels and Hydrogen – different side of the same medal? S4-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Natural Gas: What Role Does Gas Play in Africa's Energy Sector and Paris Commitments? S4-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Global Responsibility? Sea Level Rise And Cities S4-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Collaborating on the circular economy: Towards Decarbonisation S4-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Renewables & Environment (1)",
                    description: "Public and Private Sector Financing for a Sustainable Future S4-014",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Housing",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Addressing the Cost of Living Crisis S5-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "A right to housing for young people? S5-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Climate-proof and resilient social housing S5-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Climate-neutral housing – Decarbonizing the housing stock in an inclusive and affordable way S5-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Housing and WFH: Rethinking Urban Planning S5-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Data and the Future of Social Housing S5-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "The hard truths of fire safety in the social housing sector S5-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Healthy homes – designing for wellbeing S5-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: " Homes for All: a Theme for the Debate on the Future of Europe S5-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Better housing for seniors? S5-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "The Right to Make a Place: Framing Placemaking within the Right to the City S5-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Mediating House Precarity: Temporary housing for Homeless People S5-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Architecture: the infrastructure of society S5-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Housing",
                    description: "Feminist Practices as an architectural design tool S5-014",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Education",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Reimagining the Futures of Higher Education S6-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Digital Transformation Of The Education Sector S6-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "In the frontlines: The impact of Covid-19 on higher education workers S6-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Education and Pandemic Disruption S6-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Rethinking The Traditional Educational Mode S6-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Universities Contribution to Gender Equality S6-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Is higher education doomed with Inequalities? S6-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Higher education as a human right: Perspectives from youth S6-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Bridging the gap: Preparing refugees for successful transition into tertiary education S6-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Seeing the terms: the future of work in higher education S6-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "E-Learning (2)",
                    description: "Digital Credentials – The key to global learner mobility and lifelong learning? S6-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "How can higher education institutions (HEIs) be transformed into lifelong learning institutions? S6-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Machine Learning in Education S6-012",
                    members: []
                }
                ,{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Higher Education (1)",
                    description: "Global Citizenship in Higher Education S6-013",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Healthcare",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Digital Innovation in Health S7-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "Lessons from COVID-19 S7-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "In conversation with the NHS S7-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Bringing ESG into focus for pharma S7-004Bringing ESG into focus for pharma S7-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Pharma in Africa - Where do the opportunities lie? S7-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Pharma in Asia - Mapping the market S7-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "Bringing RNA therapeutics into the mainstream of healthcare S7-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Drug development - Digitising, decentralising and accelerating S7-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Pharmaceuticals (1)",
                    description: "Alzheimer’s disease treatment revolution S7-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "Integrated living for people with memory decline S7-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "The new patient digital front door: enhancing patient digital services for better experience and efficiency S7-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "Digital Care and Smart living S7-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Health, Wellness & Fitness (3)",
                    description: "The future of Trust in Health S7-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospital & Healthcare (2)",
                    description: "European Health Data Space S7-014",
                    members: []
                }
                ,{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Medical Practice (4)",
                    description: "Partnerships - Driving innovation through collaboration S7-015",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Food",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "Balancing Sustainable Food Security with Today’s Real Economic Constraints S8-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "The Cost of Living Crisis and Access to Food S8-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "Feeding the next generation S8-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "The Smart Factory S8-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production ",
                    description: "How to Make the Healthy Choice the Easy Choice? S8-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "Where Will The Next Generation Of Functional Foods Come From? S8-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "Making Cultivated Meat Commercially Viable Tomorrow S8-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Food Production",
                    description: "Delivering Health Outcomes Through Ingredient Innovation S8-008",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Technology",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Using technology for building future cities S9-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "The Emerging Data-Driven City S9-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Blockchain in Smart Cities S9-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Are We Ready to Let AI Manage Cities? S9-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Connected and sustainable territories, towards a new era? S9-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Computer & Network Security (2)",
                    description: "WPreparing Cities for Cyberattacks S9-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "AI for Good? S9-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Big Data-based Urban Planning for Advanced Smart Cities S9-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Technology as a Push for Inclusion S9-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Computer & Network Security",
                    description: "Software Security: A Modern Overview S9-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Services (3)",
                    description: "Disruptive Tech Empowering Digital Services S9-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "How to scale up European Tech S9-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "A spotlight on Ukraine's resilient tech sector S9-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Efficiency of Digital Services and Their Environmental Impact S9-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "Startup Pitches: GreenTech Innovation S9-015",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Information Technology and Service (1)",
                    description: "The Future of Innovation: How Gen Z, Purpose and Community are Leading the Way S9-016",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Industry",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "How 5G boosts smart factories S10-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "How is the mobile industry managing its own sustainability challenges? S10-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "Unlimited reality: The new reality? S10-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "Accelerating Digital manufacturing in policy, technology, partnership perspective S10-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "How 5G boosts smart factories S10-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "Key enablers for mass IoT adoption S10-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Industry",
                    description: "Digitalising property services with IoT technologies and cloud-based software platforms S10-007",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Financial Services",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Capital Markets (2)",
                    description: "Staying profitable in a hyper-regulated world S11-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Banking (1)",
                    description: "Digital threats - how will banks respond to a new wave in cyber attacks? S11-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Banking (1)",
                    description: "View from the Top: Global uncertainty - the new norm for banks? S11-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Banking (1)",
                    description: "Navigating inflation and rising interest rates S11-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: " Banking (1)",
                    description: "Thriving or Surviving: new strategies for growth in the 2020s S11-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: " Banking (1)",
                    description: "Sanctions, inflation and the climate emergency S11-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Banking (1)",
                    description: "Leadership during a crisis - to what extent can banks support consumers through an economic downturn? S11-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Financial Services (3)",
                    description: "Carbon Markets: Drivers to mobilise climate finance S11-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Financial Services (3)",
                    description: "Financial Services: Is ESG ripe for reform? S11-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Financial Services (3)",
                    description: "Biden Administration's Priorities for Critical Infrastructure and Financial Services S11-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Banking (1)",
                    description: "Crypto’s banking story so far S11-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Financial Services (3)",
                    description: "Progress on international ESG disclosure and taxonomies S11-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Financial Services (3)",
                    description: "The digital single market for financial services – regulating services rather than institutions S11-013",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Investment",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "Importance of Regulation for Investments – What Improvements are Needed? S12-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management(2) ",
                    description: "Sustainable Investment: impossible without a just transition? S12-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "Integrating ESG into Investment Frameworks – Is there an Optimum Model? S12-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "Impact investing and market growth S12-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "ESG - Getting ready for reporting requirements S12-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "What has the sustainable investment movement achieved — and what has it still got to do? S12-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Venture Capital & Private Equity (3)",
                    description: "Developing sustainable finance - challenges and opportunities for pension funds S12-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management (2)",
                    description: "Climate Leader Insight: Green the portfolio or green the planet? S12-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "Nature, biodiversity, and blue economy: Unlocking the potential of nature-based solutions to close the finance gap by 2050 S12-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management(2)",
                    description: "Scaling Up Renewable Investments In Developing Countries S12-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management(2)",
                    description: "Global Reporting Initiative (GRI) Standards and developments in the sustainability reporting landscape S12-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management(2)",
                    description: "Transition Finance in Asia: What Does an Effective, yet Inclusive Transition Look Like? S12-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Management(2)",
                    description: "Importance of Regulation For Investments - What Improvements Are Needed? S12-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Investment Banking (1)",
                    description: "Enabling Clean Energy Transitions Through Cooperation S12-014",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Philanthropy",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "The next generation Charities S13-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "Unleashing Strategic Philanthropy S13-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "The role of governance in influencing funders S13-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "Women in Leadership and Philanthropy S13-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "Lessons learnt from Rapid Response Fundraising S13-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "Compassionate and Collaborative Leadership in our Communities S13-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: " Helping Donors Achieve Intentional Philanthropy S13-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Philanthropy",
                    description: "The Future of Philanthropy: Lessons from Youth Community Leaders S13-008",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Luxury",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "Digital: Luxury’s Next Frontier S14-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "Revitalising The Luxury Market S14-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "Superfoods: The luxury of food S14-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "The luxury outlook S14-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cosmetics (2)",
                    description: "The Art of Skincare Innovation S14-005 ",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Cosmetics (2)",
                    description: "Achieving Circularity in Beauty Products S14-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "New fractures in trade, supply and value chains and the impact on the luxury sector S14-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports (3)",
                    description: "Gaming and eSports: A new runway for luxury brands S14-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Luxury Goods (1)",
                    description: "Jewellery in the spotlight: Creativity, culture and celebrity S14-009",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Hospitality",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "The Future Of Green Infrastructure & How It Will Transition To The Future Of Hospitality S15-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Reinventing Digital Travel S15-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Mapping Out The Future Of Tourism S15-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "The New Normal: How to Do with less Staff S15-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Levelling Up: Maximising the Social and Economic Impact of the Hotel Sector S15-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "The Better Hotel Investment? Why Budget Lifestyle Hotels Are The Future S15-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Power-up: Cost-effective Energy Management in Hospitality & Travel S15-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Crunching the Numbers: The Business of Hotels in 2022 and Beyond S15-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "Embracing Responsible Consumerism S15-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "Does Food Delivery Really Have A Sustainable Future? S15-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Focus on China - Are You Prepared For The Biggest Tourism Market? S15-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "Hybrid Hospitality: Opportunity in the Living Sectors S15-012",
                    members: []
                }
                ,{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "The Power of Insight: Consumer Confidence and the View from Wall Street S15-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "What is Automation and Do Hotel Businesses Even Need to Know? S15-014",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Leisure, Travel & Tourism (2)",
                    description: "Health, Wellness Travel and Industry Market Landscape S15-014",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Hospitality (1)",
                    description: "The role of startups during the pandemic and in a post-covid environment S15-015",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Sports",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Sponsorship with purpose S16-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Use of Tech in Professional Sports S16-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Beyond the Hashtag: Evolving The Athlete Voice S16-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Sports for the Greater Good S16-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Future of Research and Innovation in Sports Tech S16-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Building a challenger sportswear S16-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Redefining the fan experience through digital S16-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "Optimising e-commerce in sports S16-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Sports",
                    description: "The evolution of digital assets and its effect on media and sport business S16-009",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Consumer Goods",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Goods (1)",
                    description: "Rethinking retail supply chains S17-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Goods (1)",
                    description: "Luxury Retail in the Metaverse S17-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Goods (1)",
                    description: "Purposeful Retail: Driving ESG Change S17-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Goods (1)",
                    description: "Scaling Foresight and Driving Impact Across the Organization S17-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Goods",
                    description: "Pricing in the Anywhere Commerce World S17-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Services (2)",
                    description: "Airport Retail: Sustainability And Ethical - Sourcing S17-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Services (2)",
                    description: "Digitalising The Airport Shopper S17-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Services (2)",
                    description: "How are brands addressing the post-pandemic shift? S17-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Consumer Services (2)",
                    description: "Innovation in payments S17-009",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Media",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "Opportunities and threats ahead for news media S18-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "The Evolution of Social Media S18-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Media Production (1)",
                    description: "Creating Accessible Content for Social Media Platforms S18-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Online Media (2)",
                    description: "Disinformation & Misinformation S18-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "Investing in premium journalism and marketing S18-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "Big Tech and news publishers S18-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "How data is influencing media’s transformation S18-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "How AI technology supports editorial teams S18-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "What NFTs and the metaverse mean for news media S18-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Broadcast Media (3)",
                    description: "The state of media advertising S18-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Media Production (1)",
                    description: "What media companies need to (practically) know now about personalisation S18-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Media Production (1)",
                    description: "Building Public Trust – How to Weave Authenticity and Transparency into Your Social Media Strategy S18-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Media Production (1)",
                    description: "How to Keep Your Community Informed in Creative & Engaging Ways S18-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Media Production (1)",
                    description: "Rethinking Digital Storytelling for mobile first platforms S18-014",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Women, Diversity & Inclusion",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Gender diversity in the boardroom S19-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "The Power of Women in Politics & Decision-Making S19-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Academic entrepreneurship: Closing the Gender Gap in University  S19-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Accelerating Diversity & Inclusion Through Data S19-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Practical ways to create an inclusive culture S19-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Diversify The Way You Label Your Career S19-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "From Hesitation To Confidence: Leveraging User Insights In Product Decision-Making S19-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "The Journey To Inclusivity S19-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "How To Pitch A Tech Idea To Get A ‘Yes’ S19-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Women In Technology: Challenges & Opportunities S19-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Empowering Female Immigrant Professionals S19-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "She-conomy S19-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "The importance of female mentorship in the workplace S19-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "I, We, Us' - Effective Allyship S19-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Women, Diversity & Inclusion",
                    description: "Understanding power dynamics for an integrated, sustained and impactful approach to D&I S19-015",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Legal",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Practice (2)",
                    description: "The Role Of Sustainable Corporate Governance In The Global Economy S20-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Transforming the Way Legal Teams Work S20-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "How Can Law Firms Can Best Advise and Assist ESG? S20-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Practice (2)",
                    description: "The Evolving Role of the Board in Addressing ESG S20-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Sustainably Run Law Firms… and Why it Matters to Clients S20-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Practice (2)",
                    description: "Regulation of crypto assets, fintech/cloud and cyber security, sustainability S20-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Using Legal Skills to Combat the Climate Crisis S20-007",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Where Law Meets Technology S20-008",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Practice (2)",
                    description: "Disruptive Legal Innovation: The Metaverse S20-009",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "AI and the Future of the Legal Profession S20-010",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legislative (3)",
                    description: "Russia sanctions – how to respond and what to consider for the future S20-011",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Practice (2)",
                    description: "Lawyers as Leaders: The Essential Role of Lawyers in Accelerating Transformational Governance S20-012",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Women in Law: Reducing the Gender Pay Gap S20-013",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Leading digital and professionally diverse legal organisations S20-014",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Legal Services (1)",
                    description: "Developments & Collaboration - Skills For The Future of Law S20-015",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Consulting",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Research (4)",
                    description: "Rethinking the Digital Future S21-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Marketing & Advertising (1)",
                    description: "Social Media, what it really means S21-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Management Consulting (2)",
                    description: "All about Project Management S21-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Human Resources (3)",
                    description: "Delivering at the Top: A leadership perspective S21-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Human Resources (3)",
                    description: "High Performing Product Leadership: the Key to Success S21-005",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Marketing & Advertising (1)",
                    description: "3 Crucial Ways to Ensure Gen Z Engages with Your Brand S21-006",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Marketing & Advertising (1)",
                    description: "How do digital marketers adapt and thrive in change? S21-007",
                    members: []
                }]
            },
            {
                id: 1,
                name: "Creative Industries",
                activities: [{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Design (1)",
                    description: "Design, hopelessness & regeneration S22-001",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Design (1)",
                    description: "Community Creativity in Crisis S22-002",
                    members: []
                }, {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Design (1)",
                    description: "Embracing Ambiguity - Designing products from Zero to One S22-003",
                    members: []
                },
                {
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Design (1)",
                    description: "Cognitive Bias and the Design Process S22-004",
                    members: []
                },{
                    id: 1,
                    date: "24/11/2023",
                    hour: "08:00AM",
                    duration: "30 mins",
                    forum: "",
                    sub_sectors: "Design (1)",
                    description: "Building the Microverse S22-005",
                    members: []
                }]
            })

            this.in_memory_sectors = this.sectors

            this.init_filter()

            this.init_forum()

            this.init_date()

            this.init_time()

            this.init_duration()
        }
    }));









    Alpine.data('speaker', () => ({
        speakers: [],
        sector_filters: [],
        sectors: [],

        sector_in_filter(sector_name) {
            const i = this.sector_filters.findIndex(sector_filter => sector_filter.name === sector_name);
            if (i > -1) {
                let sector_filter = this.sector_filters[i]
                return sector_filter.select
            }
            return false
        },
        toggle_filter(sector_name) {
            const i = this.sector_filters.findIndex(sector_filter => sector_filter.name == sector_name);
            if (i > -1) {
                let sector_filter = this.sector_filters[i]
                sector_filter.select = sector_filter.select ? false : true
                this.sector_filters[i] = sector_filter
            } else {
                return false
            }
        },
        init_filter() {
            this.speakers.forEach((speaker, index) => {
                const i = this.sector_filters.findIndex(sector => sector.name == speaker.sector);
                if (i == -1) {
                    this.sector_filters.push({
                        id: index + 1,
                        name: speaker.sector,
                        select: true
                    })
                }
            });
        },
        init_sectors() {
            this.speakers.forEach((speaker) => {
                const i = this.sectors.findIndex(sector => sector.name == speaker.sector);
                if (i == -1) {
                    this.sectors.push({
                        id: i + 1,
                        name: speaker.sector
                    })
                }
            });
        },
        init() {
            this.speakers.push({
                id: 1,
                firstname: "RIKESH",
                lastname: "SHAH",
                photo: "https://www.globalforumcities.com/asset/img/s-1.png",
                poste: "Head of Commercial Innovation",
                enterprise: "TRANSPORT FOR LONDON",
                sector: "Technology"
            }, {
                id: 2,
                firstname: "ECATARINA",
                lastname: "HARLING",
                photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok.png",
                poste: "Associate Director",
                enterprise: "EBRD",
                sector: "Technology"
            }, {
                id: 3,
                firstname: "EMMANUEL",
                lastname: "DOSSOU-YOVO",
                photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok.png",
                poste: "Founder & Managing Director",
                enterprise: "THINGS GROWTH",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "JONATHON",
                lastname: "SPANOS",
                photo: "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok.png",
                poste: "Head of Commercial Innovation",
                enterprise: "VIRGIN STARTUP",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "EDD",
                lastname: "ATCHESON",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok.png",
                poste: "Principal of experience Innovation",
                enterprise: "ADOBE",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "MARC",
                lastname: "POTTON",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-1.png",
                poste: "Innovation Development Manager",
                enterprise: "BT",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "MARC",
                lastname: "MASSAR",
                photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok-1.png",
                poste: "Head of Product",
                enterprise: "WORLDPAY",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "JEAN-CHARLES",
                lastname: "SEGHERS",
                photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok-1.png",
                poste: "Head of Climate & Pathways",
                enterprise: "THE CLIMATE GROUPE",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "PEDRO RENTE LOURENÇO",
                lastname: "",
                photo: "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-1.png",
                poste: "Co-Founder",
                enterprise: "SPIKE.AI",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "JOEL",
                lastname: "HUANG",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-2.png",
                poste: "Associate Director",
                enterprise: "PUBLICIS SAPIENT",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "ASHISH",
                lastname: "SAXENA",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-3.png",
                poste: "Head of Digital Transformation",
                enterprise: "COGNIZANT",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "NOEMI DE HEVIA MENDEZ",
                lastname: "",
                photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok-2.png",
                poste: "Lead TelecomsConsultant",
                enterprise: "CGI",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "JEFF",
                lastname: "PEEL",
                photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok-2.png",
                poste: "Founder & Managing Director",
                enterprise: "QUADRIGA CONSULTING",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "GAVIN",
                lastname: "JONES",
                photo: "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-2.png",
                poste: "Founder & Managing Director",
                enterprise: "GAVIN JONES CONSULTING",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "STAMATOULA MATSOUKIS",
                lastname: "",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-4.png",
                poste: "Director & Founder",
                enterprise: "EUCLIDES RISK SOLUTIONS",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "TAUNI",
                lastname: "LANIER",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-6.png",
                poste: "Managing Director",
                enterprise: "ECOCAPITAL",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "MARK",
                lastname: "FIELD",
                photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok-3.png",
                poste: "Founder",
                enterprise: "GROW INSPIRES",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "GAVIN",
                lastname: "JACKSON",
                photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok-3.png",
                poste: "Co-Founder & Director",
                enterprise: "4-22 FOUNDATION",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "NICK",
                lastname: "MURRAY",
                photo: "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-3.png",
                poste: "Marketing & Partnership Lead",
                enterprise: "AAI Employability",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "HUGH",
                lastname: "CHATFIELD",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-5.png",
                poste: "Head of Growth",
                enterprise: "GENERATION UKI",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "MARK",
                lastname: "VINGOE",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-7.png",
                poste: "CEO",
                enterprise: "THE ENGINEERING GROUP",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "NIGEL",
                lastname: "COLIN",
                photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok-4.png",
                poste: "Team Leader",
                enterprise: "THE GRADUATE PROJECT",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "JOHN",
                lastname: "WALKER",
                photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok-4.png",
                poste: "Chief Executive",
                enterprise: "CRATE",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "TALLY",
                lastname: "HATZAKIS",
                photo: "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-4.png",
                poste: "Trilateral Research",
                enterprise: "TRILATERAL RESEARCH",
                sector: "Technology"
            }, {
                id: 4,
                firstname: "HUGH",
                lastname: "CHATFIELD",
                photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-5.png",
                poste: "Head of Growth",
                enterprise: "GENERATION UKI",
                sector: "Technology"
            })

            this.init_filter()

            this.init_sectors()
        }
    }));








})