function studentResultCalculator() {
    // 1. Take student name
    let studentName = prompt("Enter the student's name:");
    
    // Setup variables for marks
    let marks = [];
    let numSubjects = 5;

    // 2. Take marks of 5 subjects & BONUS: Validate between 0 and 100
    for (let i = 0; i < numSubjects; i++) {
        let valid = false;
        while (!valid) {
            let input = parseFloat(prompt(`Enter marks for Subject ${i + 1} (between 0 and 100):`));
            
            // Validation check
            if (!isNaN(input) && input >= 0 && input <= 100) {
                marks.push(input);
                valid = true; // Exit the while loop
            } else {
                alert("Invalid input! Please enter a valid number between 0 and 100.");
            }
        }
    }

    // Ask for the current day for the switch statement later
    let currentDay = prompt("What day of the week is it today? (e.g., Monday, Tuesday)");

    // 3. Use loops to display all subject marks and calculate the total
    let total = 0;
    console.log(`\n--- Result Card for ${studentName} ---`);
    console.log("Subject Breakdown:");
    
    for (let i = 0; i < marks.length; i++) {
        console.log(`Subject ${i + 1}: ${marks[i]}`);
        total += marks[i]; // Calculating total inside the loop
    }

    // 4. Calculate average and percentage
    let average = total / numSubjects;
    let maxTotalMarks = numSubjects * 100;
    let percentage = (total / maxTotalMarks) * 100;

    // 5. Display grade/ranks using if/else (BONUS included)
    let grade = "";
    if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else {
        grade = "Fail";
    }

    // 6. BONUS: Display highest and lowest subject marks
    // Math.max and Math.min combined with the spread operator (...) finds the values in the array
    let highestMark = Math.max(...marks);
    let lowestMark = Math.min(...marks);

    // 7. Use switch to print a motivational message based on the day
    let motivationMessage = "";
    // .toLowerCase() ensures it matches regardless of how the user typed it
    switch (currentDay.toLowerCase().trim()) {
        case "monday":
            motivationMessage = "It's Monday! A fresh start to a great week of learning.";
            break;
        case "wednesday":
            motivationMessage = "Happy Hump Day! You're halfway through the week, keep pushing.";
            break;
        case "friday":
            motivationMessage = "It's Friday! Finish strong, the weekend is almost here.";
            break;
        case "saturday":
        case "sunday":
            motivationMessage = "It's the weekend! Take some time to rest and recharge.";
            break;
        default:
            motivationMessage = "Every day is a great day to learn something new!";
            break;
    }

    // Print Final Results
    console.log("-----------------------------");
    console.log(`Total Marks: ${total} / ${maxTotalMarks}`);
    console.log(`Average: ${average.toFixed(2)}`);
    console.log(`Percentage: ${percentage.toFixed(2)}%`);
    console.log(`Final Grade/Rank: ${grade}`);
    console.log(`Highest Mark: ${highestMark}`);
    console.log(`Lowest Mark: ${lowestMark}`);
    console.log("-----------------------------");
    console.log(`Message of the day: ${motivationMessage}`);
}

// Call the function to start the program
studentResultCalculator();