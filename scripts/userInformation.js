const fs = require("fs");
const prompt = require("prompt-sync")();

//Definitions
let data;
try {
	data = fs.readFileSync("./scripts/data/courseData.json", "utf-8");
	data = JSON.parse(data);
	//console.log(data);
} catch (err) {
	console.log(err);
}

const graduationRequirements = [
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
}
const userInfo = new userBasics("Razak Diallo", 9, 100342969);
console.log(userInfo);

//add courses
function checkPrerequisite(course, courseList) {
	console.log(this);
	return this.id.includes(courseList[0]);
}
let currentSelectedYear = 0;
let userCourses = { preHighschool: [], freshman: [], junior: [], senior: [] };
function courseIDtoCourseOBJ(courseID) {
	foundIndex = data.findIndex(function (course, index) {
		if (course.id == courseID) {
			return true;
		}
	});
	let found = data[foundIndex];
	return found;
}
function courseArraytoCourseArrayOBJ(courseArray) {
	newArray = [];
	for (let i = 0; i < courseArray.length; i++) {
		newArray.push(courseIDtoCourseOBJ(courseArray[i]));
	}
	return newArray;
}

userCourses.preHighschool = ["A1", "B"];
userCourses.preHighschool = courseArraytoCourseArrayOBJ(userCourses.preHighschool);
currentSelectedYear += 1;

console.log(data.filter((course) => course.id == userCourses.preHighschool[0]));
