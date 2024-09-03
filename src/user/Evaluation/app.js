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
            EvaluationData: {
                totalLevel: 0,
                c1Level: 0,
                c2Level: 0,
                c3Level: 0,
                c1Activities: [],
                c2Activity: {},
                c3Activities: []
            }
        }
    },
    methods: {
        // calls the script that gets the user data from the data base
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
            
            //call to evaluation algorithm missing
        },

        // returns the value of the specified cookie or an empty string
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
    //function that is called upon changing into this folder
    created() {
        this.init();
    }
});