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
        'searchQueries.pendingActivities': function (val) {
            this.getPendingActivities(val);
        },
        'searchQueries.pendingClasses': function(val) {
            this.getPendingClasses(val);
        }
    },
    methods: {
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

        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            return string;
        },
        login(data) {
            this.loggedIn = true;
            this.userData = data;
        },
        init() {
            this.Kuerzel = this.getCookie("Kuerzel");
            this.AuthKey = this.getCookie("AuthKey");
            this.getTeacherInfos(this.login);
            this.getPendingActivities("");
            this.getPendingClasses("");
        },

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
    created() {
        this.init();
    }
});