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
            classes: [],
            chosenSFID: "",
            chosenType: "",
            possiblePoints: [],
            chosenPoints: "",
            gradeLevels: [],
            chosenGradeLevel: "",
            possibleTeachers: [],
            chosenTeacher: "",
            title: "",
            searchQueries: {
                allClasses: "",
                possiblePoints: "",
                gradeLevels: "",
                possibleTeachers: "",
                setTitle: ""
            }
        }
    },
    watch: {
        'searchQueries.allClasses': function (val) {
            this.getAllClasses(val);
        },
        'searchQueries.possiblePoints': function (val) {
            this.getPossiblePoints(val, 0);
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
        getAllClasses: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleClasses.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.classes = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        getPossiblePoints: function (filter, exact) {
            if (this.chosenSFID != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "filter": filter,
                    "Exact": exact
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/possiblePoints.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.possiblePoints = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        getGradeLevels: function (filter) {
            if (this.chosenSFID != "" && "" + this.chosenPoints != "") {
                if (!filter.startsWith("Q")){
                    filter = "Q" + filter;
                }
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
            } else {
                console.log("a" + this.chosenSFID + "a");
                console.log("a" + this.chosenPoints + "a");
            }
        },
        getPossibleTeachers: function (filter) {
            if (this.chosenSFID != "" && "" + this.chosenPoints != "" && this.chosenGradeLevel != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "class": this.chosenSFID,
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

        chooseClass(SFID, Name, Type) {
            this.chosenSFID = SFID;
            this.chosenType = Type;
            this.getAllClasses(Name);
            this.chosenPoints = "";
            this.chosenGradeLevel = "";
            this.chosenTeacher = "";
            this.getPossiblePoints("", 0);
        },
        choosePoints(Punkte) {
            this.chosenPoints = Punkte;
            this.getPossiblePoints(Punkte, 1);
            this.chosenGradeLevel = "";
            this.chosenTeacher = "";
            this.getGradeLevels("");
        },
        chooseGradeLevel(gradeLevel) {
            this.chosenGradeLevel = gradeLevel;
            this.getGradeLevels(gradeLevel);
            this.chosenTeacher = "";
            this.getPossibleTeachers("");
        },
        chooseTeacher(Kuerzel) {
            this.chosenTeacher = Kuerzel;
            this.getPossibleTeachers(Kuerzel);
        },
        createPendingClass(){
            if (this.chosenSFID != "" && "" + this.chosenPoints != "" && this.chosenGradeLevel != "" && this.chosenTeacher != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "Kuerzel": this.chosenTeacher,
                    "SFID": this.chosenSFID,
                    "GradeLevel": this.chosenGradeLevel,
                    "Points": this.chosenPoints,
                    "Title": this.title,
                    "AuthKey": this.AuthKey
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "action/createPendingClasses.php", data));
                xml.send();
                xml.onload = function () {
                    console.log(this.response);
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.chooseTeacher("");
                        self.chooseGradeLevel("");
                        self.choosePoints("");
                        self.chooseClass("", "", "");
                        window.location.replace("../");
                    } else {
                        //window.location.replace("../../");
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
            this.getAllClasses("");
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