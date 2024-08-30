var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../API/",
            SID: -1,
            AuthKey: "",
            userData: {},
            loggedIn: ""
        }
    },
    watch: {
        'searchQuerys.activitys': function (val) {
            this.getAllActivities(val);
        },
        'searchQuerys.pending': function (val) {
            this.getPendingActivities(val);
        }
    },
    methods: {
        getUserInfos: function(recall){
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey
            };
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/studentData.php", data));
            xml.send();
            xml.onload = function() {
                let res = JSON.parse(this.response);
                if (res.Status == "200") {
                    recall(res);
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
            this.SID = this.getCookie("SID");
            this.AuthKey = this.getCookie("AuthKey");
            this.getUserInfos(this.login);
        },

        runAddActivity() {
            window.location.replace("./AddActivity/");
        },
        runEvaluation() {
            window.location.replace("./Evaluation/");
        },
        runSeeActivities() {
            window.location.replace("./SeeActivities/");
        },

        getCookie: function(cname){
            let name = cname + "=";
            let cookies = decodeURIComponent(document.cookie).split(';');
            for (let i = 0; i < cookies.length; i++){
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