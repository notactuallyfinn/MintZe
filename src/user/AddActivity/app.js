var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../../API/",
            SID: -1,
            AuthKey: "",
            userData: {},
            loggedIn: "",
            activities: [],
            chosenAID: "",
            gradesOfActivity: [],
            chosenGrade: "",
            gradeLevels: [],
            chosenGradeLevel: "",
            possibleTeachers: [],
            chosenTeacher: "",
            title: "",
            searchQueries: {
                allActivities: "",
                gradesOfActivity: "",
                gradeLevels: "",
                possibleTeachers: "",
                setTitle: ""
            }
        }
    },
    watch: {
        'searchQueries.allActivities': function (val) {
            this.getAllActivities(val);
        },
        'searchQueries.gradesOfActivity': function (val) {
            this.getGradesOfActivity(val);
        },
        'searchQueries.gradeLevels': function (val) {
            this.getGradeLevels(val);
        },
        'searchQueries.possibleTeachers': function (val) {
            this.getPossibleTeachers(val);
        },
        'searchQueries.setTitle': function (val) {
            this.title = val;
        }
    },
    methods: {
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
        getAllActivities: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleActivities.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.activities = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        getGradesOfActivity: function (filter) {
            if (this.chosenAID != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "AID": this.chosenAID,
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/gradesOfActivity.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.gradesOfActivity = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        getGradeLevels: function (filter) {
            if (this.chosenAID != "" && this.chosenGrade != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/gradeLevels.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.gradeLevels = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        getPossibleTeachers: function (filter) {
            if (this.chosenAID != "" && this.chosenGrade != "" && this.chosenGradeLevel != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleTeachers.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.possibleTeachers = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },

        chooseActivity(AID, Name) {
            this.chosenAID = AID;
            this.getAllActivities(Name);
            this.chosenGrade = "";
            this.getGradesOfActivity("");
        },
        chooseGradeOfActivity(ALID, Bezeichnung) {
            this.chosenGrade = ALID;
            this.getGradesOfActivity(Bezeichnung);
            this.getGradeLevels("");
        },
        chooseGradeLevel(gradeLevel) {
            this.chosenGradeLevel = gradeLevel;
            this.getGradeLevels(gradeLevel);
            this.getPossibleTeachers("");
        },
        chooseTeacher(Kuerzel) {
            this.chosenTeacher = Kuerzel;
            this.getPossibleTeachers(Kuerzel);
        },
        createPendingActivity(){
            if (this.chosenAID != "" && this.chosenGrade != "" && this.chosenGradeLevel != "" && this.chosenTeacher != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "Kuerzel": this.chosenTeacher,
                    "AID": this.chosenAID,
                    "GradeLevel": this.chosenGradeLevel,
                    "ALID": this.chosenGrade,
                    "Title": this.title,
                    "Date": new Date().toUTCString(),
                    "AuthKey": this.AuthKey
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "action/createPendingActivity.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.chooseTeacher("");
                        self.chooseGradeLevel("");
                        self.chooseGradeOfActivity("", "");
                        self.chooseActivity("", "");
                        window.location.replace("../");
                    } else {
                        window.location.replace("../../");
                    }
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
            this.getAllActivities("");
            this.getGradeLevels("");
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
        this.update();
        setInterval(this.update, 1000);
    }
});