const fs = require("fs");

//Definitions
let data;
try {
	data = fs.readFileSync("./scripts/data/courseData.json", "utf-8");
	data = JSON.parse(data);
	//console.log(data);
} catch (err) {
	console.log(err);
}

var graduationRequirements = [
	"Fine Art",
	"English 11",
	"English 12",
	"English 10",
	"English 9",
	"Financial Literacy",
	"Health",
	"Physical Education",
	"Math",
	"Science",
	"Biology",
	"Government",
	"World History",
	"U.S. History",
	"Technology Education",
	"Language",
];

//basic user information
function userBasics(name, gradeLevel, studentID, coursesTaken) {
	this.name = name;
	this.gradeLevel = gradeLevel;
	this.studentID = studentID;
	this.coursesTaken = coursesTaken;
}
var userInfo = new userBasics("Razak Diallo", 9, 100342969, ["A1", "B"]);

//find prerequisites
const foundArray = [];
for (let i = 0; i < userInfo.coursesTaken.length; i++) {
	console.log(userInfo.coursesTaken[i]);
	found = data.findIndex(function (course, index) {
		if (course.id == userInfo.coursesTaken[i]) {
			return true;
		}
	});
	foundArray.push(data[found]);
}
console.log(foundArray);
