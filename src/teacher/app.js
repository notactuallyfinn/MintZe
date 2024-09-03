var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../API/",
            Kuerzel: '',
            AuthKey: "",
            userData: {},
            loggedIn: "",
            searchQueries: {
                pendingActivities: "",
                pendingClasses: ""
            },
            pendingActivities: [],
            pendingClasses: []
        }
    },
    watch: {
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.pendingActivities': function (val) {
            this.getPendingActivities(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.pendingClasses': function(val) {
            this.getPendingClasses(val);
        }
    },
    methods: {
        // calls the script that gets the user data from the data base
        getTeacherInfos(recall) {
            let data = {
                "Kuerzel": this.Kuerzel,
                "AuthKey": this.AuthKey
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/teacherData.php", data));
            xml.send();
            xml.onload = function () {
                let res = JSON.parse(this.response);
                if (res.Status == "200") {
                    recall(res);
                } else {
                    window.location.replace("../");
                }
            }
        },
        // calls the script that gets all pending activity requests for the teacher from the data base
        getPendingActivities: function (filter) {
            let self = this;
            let data = {
                "Kuerzel": this.Kuerzel,
                "AuthKey": this.AuthKey,
                "confirmed": 0,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/pendingActivitesTeacher.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.pendingActivities = data.Items;
                } else {
                    window.location.replace("../");
                }
            }
        },
        // calls the script that gets all pending class requests for the teacher from the data base
        getPendingClasses: function (filter) {
            let self = this;
            let data = {
                "Kuerzel": this.Kuerzel,
                "AuthKey": this.AuthKey,
                "confirmed": 0,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/pendingClassesTeacher.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.pendingClasses = data.Items;
                } else {
                    window.location.replace("../");
                }
            }
        },

        // function that can be run from a button in HTML
        // calls the script that confirmes the pending request of the student for participating in the activity
        confirmActivity(AID, SID, date) {
            let self = this;
            let data = {
                "SID": SID,
                "AID": AID,
                "date": date,
                "AuthKey": this.AuthKey,
                "Kuerzel": this.Kuerzel
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/confirmActivity.php", data));
            xml.send();
            xml.onload = function() {
                self.getPendingActivities("");
            }
        },
        // function that can be run from a button in HTML
        // calls the script that denies the pending request of the student for participating in the activity
        denyActivity(AID, SID, date){
            let self = this;
            let data = {
                "SID": SID,
                "AID": AID,
                "date": date,
                "AuthKey": this.AuthKey,
                "Kuerzel": this.Kuerzel
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/denyActivity.php", data));
            xml.send();
            xml.onload = function() {
                self.getPendingActivities("");
            }
        },
        // function that can be run from a button in HTML
        // calls the script that confirmes the pending request of the student for participating in the class
        confirmClass(SFID, SID, date) {
            let self = this;
            let data = {
                "SID": SID,
                "SFID": SFID,
                "date": date,
                "AuthKey": this.AuthKey,
                "Kuerzel": this.Kuerzel
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/confirmClass.php", data));
            xml.send();
            xml.onload = function() {
                self.getPendingClasses("");
            }
        },
        // function that can be run from a button in HTML
        // calls the script that denies the pending request of the student for participating in the class
        denyClass(SFID, SID, date) {
            let self = this;
            let data = {
                "SID": SID,
                "SFID": SFID,
                "date": date,
                "AuthKey": this.AuthKey,
                "Kuerzel": this.Kuerzel
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/denyClass.php", data));
            xml.send();
            xml.onload = function() {
                self.getPendingClasses("");
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
            this.Kuerzel = this.getCookie("Kuerzel");
            this.AuthKey = this.getCookie("AuthKey");
            this.getTeacherInfos(this.login);
            this.getPendingActivities("");
            this.getPendingClasses("");
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