var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../../API/",
            SID: -1,
            AuthKey: "",
            userData: {},
            pendingActivities: [],
            confirmedActivities: [],
            loggedIn: "",
            searchQueries: {
                confirmedActivities: "",
                pendingActivities: ""
            }
        }
    },
    watch: {
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.confirmedActivities': function (val) {
            this.getConfirmedActivities(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.pendingActivities': function (val) {
            this.getPendingActivities(val);
        }
    },
    methods: {
        // calls the script that gets the user data from the data base
        getUserInfos: function (recall) {
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey
            };
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/studentData.php", data));
            xml.send();
            xml.onload = function () {
                console.log(this.response);
                let res = JSON.parse(this.response);
                if (res.Status == "200") {
                    recall(res);
                } else {
                    window.location.replace("../");
                }
            }
        },

        // calls the script that gets the pending activites of the user from the data base
        getPendingActivities: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "confirmed": 0,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/activities.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.pendingActivities = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        // calls the script that gets the confirmed activites of the user from the data base
        getConfirmedActivities: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "confirmed": 1,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/activities.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.confirmedActivities = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },

        // appends the data to be send to the url in the correct format
        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            return string;
        },

        //sets the state to logged in and asignes the user data to its designated variable
        login(data) {
            this.loggedIn = true;
            this.userData = data;
        },
        // function that is called in created upon changing to this page
        // retrieves the login informations and initalizes the call for the user data
        init() {
            this.SID = this.getCookie("SID");
            this.AuthKey = this.getCookie("AuthKey");
            this.getUserInfos(this.login);
            this.getPendingActivities("");
            this.getConfirmedActivities("");
        },

        // returns the value of the specified cookie or an empty string
        getCookie: function (cname) {
            let name = cname + "=";
            let cookies = decodeURIComponent(document.cookie).split(';');
            for (let i = 0; i < cookies.length; i++) {
                if (cookies[i].trimStart().indexOf(name) == 0) {
                    return cookies[i].trimStart().substring(name.length);
                }
            }
            return "";
        }
    },
    //function that is called upon changing into this folder
    created() {
        this.init();
    }
});