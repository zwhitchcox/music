import readline from "readline";
import chalk from "chalk";

// Define the notes for each string
const strings = {
  E: ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"],
  A: ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
  D: ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],
  G: ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"],
  B: ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#"],
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let correctAnswers = 0;
let totalQuestions = 0;
let lastQuestion = "";
let lastAnswer = "";
let lastCorrect = false;
let startTime = Date.now();
const duration = process.argv[3] ? parseInt(process.argv[3]) * 1000 : 60000; // Default to 1 minute
let questionQueue = [];
let recentQuestions = [];
const selectedString = process.argv[2] ? process.argv[2].toUpperCase() : "";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  let fret = getRandomInt(1, 11);
  let question = `${selectedString}${fret}`;

  while (recentQuestions.includes(question)) {
    fret = getRandomInt(1, 11);
    question = `${selectedString}${fret}`;
  }

  recentQuestions.push(question);
  if (recentQuestions.length > 5) {
    recentQuestions.shift();
  }

  return question;
}

function getNextQuestions() {
  while (questionQueue.length < 6) {
    questionQueue.push(generateQuestion());
  }
  return questionQueue;
}

function askQuestion() {
  const elapsedTime = Date.now() - startTime;
  if (elapsedTime >= duration) {
    const rate = (correctAnswers / (elapsedTime / 1000)).toFixed(2); // Correct answers per second
    console.log(
      chalk.green(
        `Time's up! You answered ${correctAnswers} correctly in ${(
          elapsedTime / 1000
        ).toFixed(2)} seconds.`
      )
    );
    if (correctAnswers > 60) {
      console.log(chalk.green("You're a fretboard master!"));
    } else if (correctAnswers > 50) {
      console.log(chalk.green("You're a fretboard pro!"));
    } else if (correctAnswers > 40) {
      console.log(chalk.green("You're a fretboard expert!"));
    } else if (correctAnswers > 30) {
      console.log(chalk.green("You're a fretboard enthusiast!"));
    } else if (correctAnswers > 20) {
      console.log(chalk.green("You're a fretboard beginner!"));
    } else if (correctAnswers > 10) {
      console.log(chalk.green("You're a fretboard novice!"));
    } else {
      console.log(chalk.green("You're a fretboard newbie!"));
    }
    console.log(
      chalk.green(`Your rate is ${rate} correct answers per second.`)
    );
    rl.close();
    return;
  }

  console.clear();

  if (lastQuestion) {
    console.log(
      lastQuestion +
        (lastCorrect ? chalk.green(lastAnswer) : chalk.red(lastAnswer))
    );
  } else {
    console.log(chalk.green("Welcome to Fretboard Trainer!"));
  }

  const nextQuestions = getNextQuestions();
  const currentQuestion = nextQuestions.shift();
  const fret = parseInt(currentQuestion.slice(1));

  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  const scoreMessage = chalk.yellow(
    `Score: ${correctAnswers}/${totalQuestions} (${
      isNaN(percentage) ? 0 : percentage
    }%)`
  );
  console.log(scoreMessage);

  console.log(chalk.magenta(`${currentQuestion}, ${nextQuestions.join(", ")}`));

  rl.question(``, (answer) => {
    const correctNote = strings[selectedString][fret];
    totalQuestions++;
    lastQuestion = `${chalk.blue(selectedString)}${chalk.green(fret)}? `;
    lastAnswer = correctNote;

    if (answer.replace("s", "#").toUpperCase() === correctNote.toUpperCase()) {
      correctAnswers++;
      lastCorrect = true;
    } else {
      lastCorrect = false;
    }

    askQuestion();
  });
}

if (!strings[selectedString]) {
  console.log(
    chalk.red(
      `Invalid string: ${selectedString}. Please specify one of E, A, D, G, B.`
    )
  );
  process.exit(1);
}

askQuestion();
