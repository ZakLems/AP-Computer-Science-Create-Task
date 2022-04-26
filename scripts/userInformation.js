const fs = require("fs");
const prompt = require("prompt-sync")();

//Referencing course roster
let data;
try {
	data = fs.readFileSync("./scripts/data/courseData.json", "utf-8");
	data = JSON.parse(data);
	//console.log(data);
} catch (err) {
	console.log(err);
}

//add courses declarations/misc. functions
function camelCaseToSentenceCase(text) {
	return text
		.replace(/([A-Z])/g, (match) => ` ${match}`)
		.replace(/^./, (match) => match.toUpperCase())
		.trim();
}
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
function courseIDtoCourseOBJ(courseID) {
	foundIndex = data.findIndex(function (course, index) {
		if (course.id == courseID) {
			return true;
		}
	});
	let found = data[foundIndex];
	return found;
}
function courseArrayToCourseArrayOBJ(courseArray) {
	newArray = [];
	for (let i = 0; i < courseArray.length; i++) {
		newArray.push(courseIDtoCourseOBJ(courseArray[i]));
	}
	return newArray;
}
function yearNumberToName(year) {
	let currentSelectedYearName;
	if (year == 0) {
		currentSelectedYearName = "preHighSchool";
	} else if (year == 1) {
		currentSelectedYearName = "freshman";
	} else if (year == 2) {
		currentSelectedYearName = "sophomore";
	} else if (year == 3) {
		currentSelectedYearName = "junior";
	} else if (year == 4) {
		currentSelectedYearName = "senior";
	}
	return currentSelectedYearName;
}

//Validation (prerequisites, grade level)
function selectableCoursesBasedOnPrerequisites(courses, year) {
	if (year == 1) {
		allCourses = courses["preHighSchool"];
	} else if (year == 2) {
		var allCourses = courses["preHighSchool"].concat(courses["freshman"]);
	} else if (year == 3) {
		var allCourses = courses["preHighSchool"].concat(courses["freshman"], courses["sophomore"]);
	} else if (year == 4) {
		var allCourses = courses["preHighSchool"].concat(courses["freshman"], courses["sophomore"], courses["junior"]);
	}
	var allowedCourses = [];
	if (year == 0 || allCourses.length == 0) {
		allowedCourses = data.filter((course) => course.prerequisites == "");
	} else {
		for (let i = 0; i < allCourses.length; i++) {
			allowedCourses = allowedCourses.concat(
				data.filter((course) => course.prerequisites == allCourses[i].id || course.prerequisites == "")
			);
		}
	}
	return allowedCourses.filter(onlyUnique);
}

function selectableCoursesBasedOnGradeLevel(year) {
	var allowedCourses = [];
	if (year == 1) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(9));
	}
	if (year == 2) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(10));
	}
	if (year == 3) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(11));
	}
	if (year == 4) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(12));
	}

	return allowedCourses.filter(onlyUnique);
}

//course addition
var currentSelectedYear = 1;
let userCourses = { preHighSchool: [], freshman: [], sophomore: [], junior: [], senior: [] };
function addCourses(courseToAdd) {
	//determine current selected year name
	let currentSelectedYearName = yearNumberToName(currentSelectedYear);
	//add selected courses as object as referenced from data variable to master course list
	courseToAdd = courseIDtoCourseOBJ(courseToAdd);
	//determine if user can take selected courses based on prerequisites and grades allowed to take course. Remove if lacking required prerequisites or not offered in grade (with exceptions for grade for courses that require prerequisites to allow pre-highschool advancement).

	if (
		selectableCoursesBasedOnPrerequisites(userCourses, currentSelectedYear)
			.map((courses) => courses.id)
			.includes(courseToAdd.id)
	) {
		console.log(`${courseToAdd.name} has the required prerequisites`);
		if (currentSelectedYearName != "preHighSchool") {
			if (courseToAdd.prerequisites == "") {
				if (
					selectableCoursesBasedOnGradeLevel(currentSelectedYear)
						.map((courses) => courses.id)
						.includes(courseToAdd.id)
				) {
					console.log(`${courseToAdd.name} is in the appropriate grade level for the student.`);
					lineBreak();
					console.log(
						`${courseToAdd.name} has successfully been added to ${camelCaseToSentenceCase(
							currentSelectedYearName
						)} year!`
					);
				} else {
					addCourses(
						prompt(
							`${courseToAdd.name} doesn't provide classes for the student's grade level! Please input another course:`
						)
					);
				}
			}
		} else {
			console.log(`${courseToAdd.name} has been successfully added to Pre-High School courses!`);
		}
	} else {
		addCourses(prompt(`${courseToAdd.name} doesn't have the required prerequisites! Please input another course: `));
	}
	if (courseToAdd.term == "S") {
		var pairedSemesterCourse = prompt(
			"Select another semester long course to be added that is in the same department of the course you selected"
		);
		//put variable to only allow semester courses to be selected
		//semester courses are in an infinite loop ruh roh
		addCourses(pairedSemesterCourse);
	}
	userCourses[currentSelectedYearName].push(courseToAdd);
}

addCourses("H1");
console.log(userCourses);

//graduation requirements
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

function verifyGraduationRequirementsMet(courseList) {
	var acceptable = true;
	var languageCredits = 0;
	for (let i = 0; i < Object.keys(courseList).length; i++) {
		var currentSelectedYearName = `${yearNumberToName(i)}`;
		if (currentSelectedYearName != "preHighSchool") {
			if (
				courseList[currentSelectedYearName].map((courses) => courses.graduationRequirement).includes("Math") != true
			) {
				console.log(`Your ${camelCaseToSentenceCase(currentSelectedYearName)} year is missing a math course!`);
				acceptable = false;
			}
			if (courseList[currentSelectedYearName].map((courses) => courses.graduationRequirement.includes("Language"))) {
				languageCredits =
					languageCredits +
					courseList[currentSelectedYearName]
						.map((courses) => courses.graduationRequirement)
						.filter((v) => v === "Language").length;
			}
		}
	}
	if (!(languageCredits > 2)) {
		console.log(`You are missing ${2 - languageCredits} language credits!`);
	}
	var allCourses = courseList["preHighSchool"].concat(
		courseList["freshman"],
		courseList["sophomore"],
		courseList["junior"],
		courseList["senior"]
	);
	allGraduationReq = allCourses.map((courses) => courses.graduationRequirement);
	missingGraduationReq = graduationRequirements.filter((n) => !allGraduationReq.includes(n));
	if (missingGraduationReq.length > 0) {
		for (let i = 0; i < missingGraduationReq.length; i++) {
			console.log(`Your ${missingGraduationReq[i]} credit is missing!`);
		}
		acceptable = false;
	}

	console.log(acceptable);
}

//calculate estimated credits
function estimatedCreditsCalculator(courseList) {
	var totalCredits = 0;
	for (let i = 0; i < Object.keys(courseList).length; i++) {
		var currentSelectedYearName = `${yearNumberToName(i)}`;

		for (let o = 0; o < courseList[currentSelectedYearName].length; o++) {
			var currentSelectedYearName = `${yearNumberToName(i)}`;
			if (courseList[currentSelectedYearName][o].term == "FY") {
				totalCredits = totalCredits + 1;
			} else if (courseList[currentSelectedYearName][o].term == "S") {
				totalCredits = totalCredits + 0.5;
			}
		}
	}
	return totalCredits;
}

//User Inputs
function lineBreak() {
	console.log();
}
var finished = false;
while (finished == false) {
	console.log(
		"\n" +
			"Welcome to the Wise Pather, your digital assistant through the entirety of your high school career. This program gives you the ability to view the courses you wish to take throughout your high school career." +
			"\n\n" +
			"Let's start with some basic information"
	);
	var userName = prompt("Name: ");
	lineBreak();
	console.log(`Hello ${userName}! Let's get started with any classes you may have taken before high school.`);
	lineBreak();

	break;
}
