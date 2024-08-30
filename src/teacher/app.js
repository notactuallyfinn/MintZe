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
                pendingActivities: ""
            },
            pendingActivities: []
        }
    },
    watch: {
        'searchQueries.pendingActivities': function (val) {
            this.getPendingActivities(val);
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
        getPendingActivities: function ($filter) {
            let self = this;
            let data = {
                "Kuerzel": this.Kuerzel,
                "AuthKey": this.AuthKey,
                "confirmed": 0,
                "filter": $filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/pendingActivitesTeacher.php", data));
            xml.send();
            xml.onload = function () {
                console.log(this.response);
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.pendingActivities = data.Items;
                    console.log(self.pendingActivities);
                } else {
                    window.location.replace("../");
                }
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