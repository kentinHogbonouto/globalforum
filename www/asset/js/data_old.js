document.addEventListener("alpine:init", () => {
  Alpine.data("agenda", () => ({
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
          this.selected_index--;
        }
      } else {
        if (this.selected_index < this.sectors.length - 1) {
          this.selected_index++;
        }
      }
    },

    show_head_element(index, show = true) {
      let first = false;

      let max_index_show = 0;

      max_index_show = this.selected_index + this.head_max_element;

      first = index >= this.selected_index;

      return index < max_index_show && first;
    },

    show_body_element(index, show = true) {
      let first = false;

      let max_index_show = 0;

      max_index_show = this.selected_index + this.body_max_element;

      first =
        this.selected_index == index ||
        this.selected_index + 1 == index ||
        this.selected_index + 2 == index;

      return index < max_index_show && first;
    },

    resize_window() {
      this.width = window.innerWidth;

      if (this.width >= 1200) {
        this.head_max_element = 10;

        this.body_max_element = 3;
      } else if (this.width >= 992 && this.width < 1200) {
        this.head_max_element = 8;

        this.body_max_element = 3;
      } else if (this.width >= 576 && this.width < 992) {
        this.head_max_element = 4;

        this.body_max_element = 3;
      } else {
        this.head_max_element = 3;

        this.body_max_element = 1;
      }
    },

    sector_in_filter(sector_name, search_in = "") {
      const i = this.sector_filters.findIndex(
        (sector_filter) => sector_filter.name === sector_name
      );

      if (i > -1) {
        let sector_filter = this.sector_filters[i];

        if (search_in === "") {
          return sector_filter.select;
        } else {
          if (search_in == "date") {
            return sector_filter.date;
          }

          if (search_in == "hour") {
            return sector_filter.hour;
          }

          if (search_in == "duration") {
            return sector_filter.duration;
          }

          if (search_in == "forum") {
            return sector_filter.forum;
          }
        }
      }

      return false;
    },

    toggle_filter(sector_name, search_in = "") {
      const i = this.sector_filters.findIndex(
        (sector_filter) => sector_filter.name == sector_name
      );

      if (i > -1) {
        let sector_filter = this.sector_filters[i];

        if (search_in == "") {
          sector_filter.select = sector_filter.select ? false : true;

          this.sector_filters[i] = sector_filter;

          if (sector_filter.select) {
            if (this.remove_ids.includes(i)) {
              this.remove_ids.splice(this.remove_ids.indexOf(i), 1);
            }
          } else {
            if (!this.remove_ids.includes(i)) {
              this.remove_ids.push(i);
            }
          }

          this.sectors = [];

          this.in_memory_sectors.forEach((sector, index) => {
            if (!this.remove_ids.includes(index)) {
              this.sectors.push(sector);
            }
          });
        } else {
          if (search_in == "date") {
            sector_filter.date = sector_filter.date ? false : true;

            this.sector_filters[i] = sector_filter;
          }

          if (search_in == "hour") {
            sector_filter.hour = sector_filter.hour ? false : true;

            this.sector_filters[i] = sector_filter;
          }

          if (search_in == "duration") {
            sector_filter.duration = sector_filter.duration ? false : true;

            this.sector_filters[i] = sector_filter;
          }

          if (search_in == "forum") {
            sector_filter.forum = sector_filter.forum ? false : true;

            this.sector_filters[i] = sector_filter;
          }
        }
      } else {
        return false;
      }
    },

    value_in_detail(search_in, value) {
      if (search_in == "date") {
        const i = this.dates.findIndex((date) => date.date == value);

        if (i > -1) {
          return this.dates[i].select;
        }
      }

      if (search_in == "time") {
        const i = this.times.findIndex((time) => time.time == value);

        if (i > -1) {
          let time = this.times[i];

          return time.select;
        }
      }

      if (search_in == "duration") {
        const i = this.durations.findIndex(
          (duration) => duration.duration == value
        );

        if (i > -1) {
          let duration = this.durations[i];

          return duration.select;
        }
      }

      if (search_in == "forum") {
        const i = this.forums.findIndex((forum) => forum.forum == value);

        if (i > -1) {
          let forum = this.forums[i];

          return forum.select;
        }
      }

      return true;
    },

    toggle_detail(search_in, value) {
      if (search_in == "date") {
        const i = this.dates.findIndex((date) => date.date == value);

        if (i > -1) {
          let date = this.dates[i];

          date.select = date.select ? false : true;

          this.dates[i] = date;
        }
      }

      if (search_in == "time") {
        const i = this.times.findIndex((time) => time.time == value);

        if (i > -1) {
          let time = this.times[i];

          time.select = time.select ? false : true;

          this.times[i] = time;
        }
      }

      if (search_in == "duration") {
        const i = this.durations.findIndex(
          (duration) => duration.duration == value
        );

        if (i > -1) {
          let duration = this.durations[i];

          duration.select = duration.select ? false : true;

          this.durations[i] = duration;
        }
      }

      if (search_in == "forum") {
        const i = this.forums.findIndex((forum) => forum.forum == value);

        if (i > -1) {
          let forum = this.forums[i];

          forum.select = forum.select ? false : true;

          this.forums[i] = forum;
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

          forum: true,
        });
      });
    },

    init_date() {
      this.sectors.forEach((sector, i) => {
        sector.activities.forEach((activity, index) => {
          const i = this.dates.findIndex((date) => date.date == activity.date);

          if (i == -1) {
            this.dates.push({
              id: index + 1,

              date: activity.date,

              select: true,
            });
          }
        });
      });
    },

    init_time() {
      this.sectors.forEach((sector, i) => {
        sector.activities.forEach((activity, index) => {
          const i = this.times.findIndex((time) => time.time == activity.hour);

          if (i == -1) {
            this.times.push({
              id: index + 1,

              time: activity.hour,

              select: true,
            });
          }
        });
      });
    },

    init_duration() {
      this.sectors.forEach((sector, i) => {
        sector.activities.forEach((activity, index) => {
          const i = this.durations.findIndex(
            (date) => date.duration == activity.duration
          );

          if (i == -1) {
            this.durations.push({
              id: index + 1,

              duration: activity.duration,

              select: true,
            });
          }
        });
      });
    },

    init_forum() {
      this.sectors.forEach((sector, i) => {
        sector.activities.forEach((activity, index) => {
          const i = this.forums.findIndex(
            (forum) => forum.forum == activity.forum
          );

          if (i == -1) {
            this.forums.push({
              id: index + 1,

              forum: activity.forum,

              select: true,
            });
          }
        });
      });
    },

    init() {
      this.resize_window();

      this.sectors.push(
        {
          id: 1,

          name: "Cities",

          activities: [
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Cities of the Future: Building Growth and Resilience",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "PARIS",

              sub_sectors: "Local Authorities",

              description:
                "Learning from London: The Importance of Infrastructure",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "SINGAPORE",

              sub_sectors: "Local Authorities",

              description: "SDGs in Cities: A Question of Finance?",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "NEW YORK",

              sub_sectors: "Local Authorities",

              description: "Urban Policies for Climate Neutrality",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Pandemic Resilient Cities: Lessons from Coronavirus",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Green transformation in cities: what should the energy mix look like?",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description: "Creating low-emissions and resilient buildings",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description: "Data-driven smart sustainable cities of the future",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description: "Creating Safer Cities for All",

              photo: "https://img.freepik.com/free-icon/user_318-159711.jpg",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Reshaping the Urban-Rural Divide in the 21st Century",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Harnessing Urbanization for Growth and Poverty Alleviation",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description: "Smart Water Cities",

              photo: "https://img.freepik.com/free-icon/user_318-159711.jpg",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Tackling Urban Health Challenges in a Changing World",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Urban Planning: The Importance of Civil Society and Grassroots Organisations",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Local Authorities",

              description:
                "Multi-level Action for Equitable and Sustainable Cities",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
          ],
        },
        {
          id: 1,

          name: "Government & Policy",

          activities: [
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Monetary Policy and the Risk of Global Recession in 2023",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description: "Funding the WHO and Future Pandemic Preparedness",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description: "The Impact of Public Policy on Economies",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Government Administration (5)",

              description: "The Role of Central Banks: Present and Future",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "International Trade and Development (1)",

              description:
                "Climate, Trade and Carbon Border Adjustment: Creating Race To The Top",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "International Trade and Development(1)",

              description: "WTO in Crisis?",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Government Relations (2)",

              description: "Reforming the UN: Towards more Fairness",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Beyond greenwashing: a hands-on approach to digitally-empowered sustainability",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Government Relations (2)",

              description:
                "Climate Change Reparations: Colonialism and Climate Change",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description: "Social Media: Driving today's Policy-Making",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "The Racial Wealth Gap: Radical Differences in Economic Security",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Government Relations (2)",

              description: "Decolonising Foreign Policy",

              photo: "https://img.freepik.com/free-icon/user_318-159711.jpg",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Digital Advertising Policy and Legal State of Play in Europe and Beyond",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Building Public Sector Capacity: Open Source and Digital Sovereignty",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Government Investment Strategies: The Importance of Transport to Economic Growth",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Public Policy (3)",

              description:
                "Regional versus global alliances: Which is the future of the digital economy?",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "International Affairs (4)",

              description: "Towards a More Peaceful and Stable World",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
          ],
        },
        {
          id: 1,

          name: "Transport",

          activities: [
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description:
                "Government Investment Strategies: The Importance of Transport to Economic Growth",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description:
                "Achieving an efficient and greener transport sector",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description: "Decarbonising the commute",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description: "Reimagining Safety in Transportation",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description:
                "On-demand and flexible transport: building a responsive network",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description: "Contactless Ticketing for better urban mobility",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description: "Digitalisation of Public Transport Network",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description: "Digitalisation of Public Transport Network",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Logistics and Supply Chain(2)",

              description:
                "Building future mobility with 5G and Telecommunications",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "",

              description: "Aviation and Aerospace (3)",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description:
                "Changing mindsets: the challenge of boosting active travel in the regions",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description: "Resilient rail transport planning and management",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description: "Transport as a catalyst for inclusive societies",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Railroad (4)",

              description: "High Speed Rail System as a Mobility Driver",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Transportation (1)",

              description:
                "How a fully integrated urban transport system created by public and private sector collaboration can attract inward investment",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Railroad (3)",

              description: "Railway Contribution to EU Green Deal",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
          ],
        },
        {
          id: 1,

          name: "Environmental & Energy",

          activities: [
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Renewables & Environment (1)",

              description: "Building a greener future: Reaching Agenda 2030",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Renewables & Environment (1)",

              description:
                "Climate Change and National Determined Contributions",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Renewables & Environment (1)",

              description:
                "Securing The Energy Transition: Resilience And Reliability In The Fce Of Evolving Threats",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
            {
              id: 1,

              date: "24/11/2023",

              hour: "08:00AM",

              duration: "30 mins",

              forum: "LONDON",

              sub_sectors: "Renewables & Environment (1)",

              description:
                "After The Crisis: Rebuilding For Energy Security And Climate Action",

              members: [
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://www.shareicon.net/data/512x512/2016/09/15/829453_user_512x512.png",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
                {
                  id: "",

                  photo:
                    "https://img.freepik.com/free-icon/user_318-159711.jpg",

                  lastname: "Nom",

                  firstname: "Prénom",

                  poste: "Titre",

                  enterprise: "Entreprise",
                },
              ],
            },
          ],
        },
        {
          id: 1,

          name: "Biotechnology",

          activities: [],
        },
        {
          id: 1,

          name: "Construction",

          activities: [],
        },
        {
          id: 1,

          name: "Consulting & Serices",

          activities: [],
        },
        {
          id: 1,

          name: "Consumer Good",

          activities: [],
        },
        {
          id: 1,

          name: "Creative industries",

          activities: [],
        },
        {
          id: 1,

          name: "Design",

          activities: [],
        },
        {
          id: 1,

          name: "Digital Revolution",

          activities: [],
        },
        {
          id: 1,

          name: "Diversity",

          activities: [],
        },
        {
          id: 1,

          name: "Education & Learning",

          activities: [],
        },
        {
          id: 1,

          name: "Environment",

          activities: [],
        },
        {
          id: 1,

          name: "Financial Services",

          activities: [],
        },
        {
          id: 1,

          name: "Food",

          activities: [],
        },
        {
          id: 1,

          name: "Gender",

          activities: [],
        },
        {
          id: 1,

          name: "Gouvernment",

          activities: [],
        },
        {
          id: 1,

          name: "Healthcare",

          activities: [],
        },
        {
          id: 1,

          name: "Hospitality",

          activities: [],
        },
        {
          id: 1,

          name: "Industrial Automation",

          activities: [],
        },
        {
          id: 1,

          name: "Infratructure",

          activities: [],
        },
        {
          id: 1,

          name: "Insurance",

          activities: [],
        },
        {
          id: 1,

          name: "Investment",

          activities: [],
        },
        {
          id: 1,

          name: "Legal",

          activities: [],
        },
        {
          id: 1,

          name: "Lifestyle & Luxury",

          activities: [],
        },
        {
          id: 1,

          name: "Logisticts",

          activities: [],
        },
        {
          id: 1,

          name: "Media & Film",

          activities: [],
        },
        {
          id: 1,

          name: "Pharmaceutials",

          activities: [],
        },
        {
          id: 1,

          name: "Public policy",

          activities: [],
        },
        {
          id: 1,

          name: "Real Estate",

          activities: [],
        },
        {
          id: 1,

          name: "Social impact",

          activities: [],
        },
        {
          id: 1,

          name: "Sport",

          activities: [],
        },
        {
          id: 1,

          name: "Technology",

          activities: [],
        },
        {
          id: 1,

          name: "Tourism",

          activities: [],
        },
        {
          id: 1,

          name: "Travel",

          activities: [],
        },
        {
          id: 1,

          name: "Utility",

          activities: [],
        },
        {
          id: 1,

          name: "Women",

          activities: [],
        }
      );

      this.in_memory_sectors = this.sectors;

      this.init_filter();

      this.init_forum();

      this.init_date();

      this.init_time();

      this.init_duration();
    },
  }));

  Alpine.data("speaker", () => ({
    speakers: [],

    sector_filters: [],

    sectors: [],

    sector_in_filter(sector_name) {
      const i = this.sector_filters.findIndex(
        (sector_filter) => sector_filter.name === sector_name
      );

      if (i > -1) {
        let sector_filter = this.sector_filters[i];

        return sector_filter.select;
      }

      return false;
    },

    toggle_filter(sector_name) {
      const i = this.sector_filters.findIndex(
        (sector_filter) => sector_filter.name == sector_name
      );

      if (i > -1) {
        let sector_filter = this.sector_filters[i];

        sector_filter.select = sector_filter.select ? false : true;

        this.sector_filters[i] = sector_filter;
      } else {
        return false;
      }
    },

    init_filter() {
      this.speakers.forEach((speaker, index) => {
        const i = this.sector_filters.findIndex(
          (sector) => sector.name == speaker.sector
        );

        if (i == -1) {
          this.sector_filters.push({
            id: index + 1,

            name: speaker.sector,

            select: true,
          });
        }
      });
    },

    init_sectors() {
      this.speakers.forEach((speaker) => {
        const i = this.sectors.findIndex(
          (sector) => sector.name == speaker.sector
        );

        if (i == -1) {
          this.sectors.push({
            id: i + 1,

            name: speaker.sector,
          });
        }
      });
    },

    init() {
      this.speakers.push(
        {
          id: 1,

          firstname: "RIKESH",

          lastname: "SHAH",

          photo: "https://www.globalforumcities.com/asset/img/s-1.png",

          poste: "Head of Commercial Innovation",

          enterprise: "TRANSPORT FOR LONDON",

          sector: "Technology",
        },
        {
          id: 2,

          firstname: "ECATARINA",

          lastname: "HARLING",

          photo: "https://www.globalforumcities.com/asset/img/Ecatarina-ok.png",

          poste: "Associate Director",

          enterprise: "TRANSPORT FOR LONDON",

          sector: "Technology",
        },
        {
          id: 3,

          firstname: "EMMANUEL",

          lastname: "DOSSOU-YOVO",

          photo: "https://www.globalforumcities.com/asset/img/Emmanuel-ok.png",

          poste: "Founder & Managing Director",

          enterprise: "THINGS GROWTH",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "JONATHON",

          lastname: "SPANOS",

          photo:
            "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok.png",

          poste: "Head of Commercial Innovation",

          enterprise: "VIRGIN STARTUP",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "EDD",

          lastname: "ATCHESON",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok.png",

          poste: "Principal of experience Innovation",

          enterprise: "ADOBE",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "MARC",

          lastname: "POTTON",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-1.png",

          poste: "Innovation Development Manager",

          enterprise: "BT",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "MARC",

          lastname: "MASSAR",

          photo:
            "https://www.globalforumcities.com/asset/img/Ecatarina-ok-1.png",

          poste: "Head of Product",

          enterprise: "WORLDPAY",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "JEAN-CHARLES",

          lastname: "SEGHERS",

          photo:
            "https://www.globalforumcities.com/asset/img/Emmanuel-ok-1.png",

          poste: "Head of Climate & Pathways",

          enterprise: "THE CLIMATE GROUPE",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "PEDRO RENTE LOURENÇO",

          lastname: "",

          photo:
            "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-1.png",

          poste: "Co-Founder",

          enterprise: "SPIKE.AI",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "JOEL",

          lastname: "HUANG",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-2.png",

          poste: "Associate Director",

          enterprise: "PUBLICIS SAPIENT",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "ASHISH",

          lastname: "SAXENA",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-3.png",

          poste: "Head of Digital Transformation",

          enterprise: "COGNIZANT",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "NOEMI DE HEVIA MENDEZ",

          lastname: "",

          photo:
            "https://www.globalforumcities.com/asset/img/Ecatarina-ok-2.png",

          poste: "Lead TelecomsConsultant",

          enterprise: "CGI",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "JEFF",

          lastname: "PEEL",

          photo:
            "https://www.globalforumcities.com/asset/img/Emmanuel-ok-2.png",

          poste: "Founder & Managing Director",

          enterprise: "QUADRIGA CONSULTING",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "GAVIN",

          lastname: "JONES",

          photo:
            "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-2.png",

          poste: "Founder & Managing Director",

          enterprise: "GAVIN JONES CONSULTING",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "STAMATOULA MATSOUKIS",

          lastname: "",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-4.png",

          poste: "Director & Founder",

          enterprise: "EUCLIDES RISK SOLUTIONS",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "TAUNI",

          lastname: "LANIER",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-6.png",

          poste: "Managing Director",

          enterprise: "ECOCAPITAL",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "MARK",

          lastname: "FIELD",

          photo:
            "https://www.globalforumcities.com/asset/img/Ecatarina-ok-3.png",

          poste: "Founder",

          enterprise: "GROW INSPIRES",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "GAVIN",

          lastname: "JACKSON",

          photo:
            "https://www.globalforumcities.com/asset/img/Emmanuel-ok-3.png",

          poste: "Co-Founder & Director",

          enterprise: "4-22 FOUNDATION",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "NICK",

          lastname: "MURRAY",

          photo:
            "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-3.png",

          poste: "Marketing & Partnership Lead",

          enterprise: "MI",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "HUGH",

          lastname: "CHATFIELD",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-5.png",

          poste: "Head of Growth",

          enterprise: "GENERATION",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "MRK",

          lastname: "VINGOE",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-7.png",

          poste: "CEO",

          enterprise: "THE ENGINEERING",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "NIGEL",

          lastname: "COLIN",

          photo:
            "https://www.globalforumcities.com/asset/img/Ecatarina-ok-4.png",

          poste: "Team Leader",

          enterprise: "THE GRADUATE PROJECT",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "JOHN",

          lastname: "WALKER",

          photo:
            "https://www.globalforumcities.com/asset/img/Emmanuel-ok-4.png",

          poste: "Chief Executive",

          enterprise: "CRATE",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "TALLY",

          lastname: "HATZAKIS",

          photo:
            "https://www.globalforumcities.com/asset/img/Jonathon-Spanos-ok-4.png",

          poste: "Trilateral Research",

          enterprise: "TRILATERAL RESEARCH",

          sector: "Technology",
        },
        {
          id: 4,

          firstname: "HUGH",

          lastname: "CHATFIELD",

          photo: "https://www.globalforumcities.com/asset/img/Rikesh-ok-5.png",

          poste: "Head of Growth",

          enterprise: "GENERATION",

          sector: "Technology",
        }
      );

      this.init_filter();

      this.init_sectors();
    },
  }));
});
