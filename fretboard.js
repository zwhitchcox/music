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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function askQuestion() {
  console.clear();

  if (lastQuestion) {
    console.log(
      lastQuestion +
        (lastCorrect ? chalk.green(lastAnswer) : chalk.red(lastAnswer))
    );
  }

  const stringNames = Object.keys(strings);
  const string = stringNames[getRandomInt(0, stringNames.length - 1)];
  const fret = getRandomInt(1, 11);
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  const scoreMessage = chalk.yellow(
    `Score: ${correctAnswers}/${totalQuestions} (${percentage}%)`
  );
  if (totalQuestions) {
    console.log(scoreMessage);
  } else {
    console.log(chalk.yellow("Welcome to the Fretboard Quiz Game!"));
  }

  rl.question(`${chalk.blue(string)}${chalk.green(fret)}? `, (answer) => {
    const correctNote = strings[string][fret];
    totalQuestions++;
    lastQuestion = `${chalk.blue(string)}${chalk.green(fret)}? `;
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

askQuestion();
