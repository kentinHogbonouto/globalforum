function formatDate() {
    const date = new Date()
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const month = months[date.getMonth()];

    // suffix for the day of the month
    let suffix;
    switch (day) {
        case 1:
        case 21:
        case 31:
            suffix = "st";
            break;
        case 2:
        case 22:
            suffix = "nd";
            break;
        case 3:
        case 23:
            suffix = "rd";
            break;
        default:
            suffix = "th";
            break;
    }

    return `${weekday} ${month} ${day}${suffix}`;
}

function formatTime() {
    const date = new Date()
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // AM ou PM ?
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Conversion en format 12 heures
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 heures = 12AM et non 0AM

    // Ajout d'un 0 pour les minutes < 10
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format final
    const formattedTime = `${hours}:${minutes}${ampm}`;
    return formattedTime;
}

function findCountry(symbole) {
    const payload = {
        'SGD': 'London',
        '€': 'Paris',
        '$': 'New York',
        'SGD': 'Singapore'
    }

    return payload[symbole]
}


document.addEventListener('alpine:init', () => {


    Alpine.data('checkout', () => ({
        books: [],
        subtotal: 0,
        total: 0,
        diff_payer: false,

        owner_first_name: "",
        owner_last_name: "",
        owner_mobile: "",
        owner_email: "",
        owner_company: "",
        owner_job: "",
        owner_department_or_division: "",
        owner_country: "",

        payer_first_name: "",
        payer_last_name: "",
        payer_mobile: "",
        payer_email: "",
        payer_company: "",
        payer_job: "",
        payer_department_or_division: "",
        payer_country: "",


        sendData() {
            let formdata = new FormData();
            formdata.append("books", JSON.stringify(this.books));

            formdata.append("save_data", 1);

            formdata.append("owner_first_name", this.owner_first_name);
            formdata.append("owner_last_name", this.owner_last_name);
            formdata.append("owner_mobile", this.owner_mobile);
            formdata.append("owner_email", this.owner_email);
            formdata.append("owner_company", this.owner_company);
            formdata.append("owner_job", this.owner_job);
            formdata.append("owner_department_or_division", this.owner_department_or_division);
            formdata.append("owner_country", this.owner_country);

            formdata.append("diff_payer", this.diff_payer ? 1 : 0);

            if (this.diff_payer) {
                formdata.append("payer_first_name", this.payer_first_name);
                formdata.append("payer_last_name", this.payer_last_name);
                formdata.append("payer_mobile", this.payer_mobile);
                formdata.append("payer_email", this.payer_email);
                formdata.append("payer_company", this.payer_company);
                formdata.append("payer_job", this.payer_job);
                formdata.append("payer_department_or_division", this.payer_department_or_division);
                formdata.append("payer_country", this.payer_country);
            }


            let owner_data = {
                "owner_first_name": this.owner_first_name,
                "owner_last_name": this.owner_last_name,
                "owner_mobile": this.owner_mobile,
                "owner_email": this.owner_email,
                "owner_company": this.owner_company,
                "owner_job": this.owner_job,
                "owner_department_or_division": this.owner_department_or_division,
                "owner_country": this.owner_country,
                "diff_payer": this.diff_payer,
                "payer_first_name": this.payer_first_name,
                "payer_last_name": this.payer_last_name,
                "payer_mobile": this.payer_mobile,
                "payer_email": this.payer_email,
                "payer_company": this.payer_company,
                "payer_job": this.payer_job,
                "payer_department_or_division": this.payer_department_or_division,
                "payer_country": this.payer_country,
            }


            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            let url = "https://london.globalforumcities.com/checkout.php";


            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    //console.log(data)
                    //console.log(owner_data)
                    if (data.url) {
                        localStorage.setItem('owner_data', JSON.stringify(owner_data));
                        localStorage.setItem('books', JSON.stringify(this.books));
                        window.location.href = data.url;
                    }

                })
        },
        init() {

            const local = window.sessionStorage.getItem('books');
            this.books = local ? JSON.parse(local) : [];

            console.log('books 1', this.books)

            for (var i = this.books.length - 1; i >= 0; i--) {
                let book = this.books[i]
                this.subtotal += book.prixbook * book.quantite
            }

            this.total = this.subtotal + 160
        }
    }));



    Alpine.data('recu', () => ({
        books: [],
        subtotal: 0,
        owner_data: {},
        total: 0,
        date: "",
        currencySymbole: '',
        time: "",
        address: "",


        init() {
            let paymentData = window.sessionStorage.getItem('paymentData')
            if (paymentData) {
                paymentData = JSON.parse(paymentData)
                this.books = JSON.parse(paymentData.books) ?? []
                this.currencySymbole = paymentData.currencySymbole

                console.log("paymentData", paymentData)
            }

            for (const key in paymentData) {
                if (key.startsWith('owner')) {
                    this.owner_data[key] = paymentData[key]
                }
            }

            for (let i = this.books.length - 1; i >= 0; i--) {
                const book = this.books[i]
                this.subtotal += book.prixbook * book.quantite
            }

            this.total = this.subtotal + 160
            this.date = formatDate()
            this.time = formatTime()
            this.address = `${findCountry(this.currencySymbole)} City Hall Kamai Chunchie Way ${findCountry(this.currencySymbole)} E16 1ZE`
        }
    }));


})