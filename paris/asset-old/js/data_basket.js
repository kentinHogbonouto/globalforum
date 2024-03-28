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

            const local=window.sessionStorage.getItem('books');
            this.books =local ? JSON.parse(local) : [];

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

        init() {

            const local= localStorage.getItem('books');
            this.books =local ? JSON.parse(local) : [];

            const owner_data = localStorage.getItem('owner_data');
            this.owner_data = owner_data ? JSON.parse(owner_data) : {};

            console.log('books 1', this.books)
            console.log('owner_data 1', this.owner_data)

            for (var i = this.books.length - 1; i >= 0; i--) {
                let book = this.books[i]
                this.subtotal += book.prixbook * book.quantite
            }

            this.total = this.subtotal + 160

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const d = new Date();
            let month = months[d.getMonth()];

            this.date = d.getDate()+" "+month+" "+d.getFullYear()

            window.sessionStorage.setItem('books', JSON.stringify([]));

        }
    }));


})