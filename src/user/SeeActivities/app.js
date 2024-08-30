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
        'searchQueries.confirmedActivities': function (val) {
            this.getConfirmedActivities(val);
        },
        'searchQueries.pendingActivities': function (val) {
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
                console.log(this.response);
                let res = JSON.parse(this.response);
                if (res.Status == "200") {
                    recall(res);
                } else {
                    window.location.replace("../");
                }
            }
        },

        getPendingActivities: function($filter){
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "confirmed": 0,
                "filter": $filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/activities.php", data));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.pendingActivities = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        getConfirmedActivities: function($filter){
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "confirmed": 1,
                "filter": $filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/activities.php", data));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.confirmedActivities = data.Items;
                } else {
                    window.location.replace("../../");
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
        
        update() {
          
        },
        login(data) {
            this.loggedIn = true;
            this.userData = data;
        },
        init() {
            this.SID = this.getCookie("SID");
            this.AuthKey = this.getCookie("AuthKey");
            this.getUserInfos(this.login);
            this.getPendingActivities("");
            this.getConfirmedActivities("");
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
        this.update();
        setInterval(this.update, 1000);
    }
});