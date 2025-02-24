const themeSwitch = document.querySelector("#switch");
const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

const keySound = new Audio("./assets/key-press.mp3");
const clearSound = new Audio("./assets/clear-button.mp3");
const switchSound = new Audio("./assets/switch-button.mp3");

let expression = "0";

themeSwitch.addEventListener("click", () => {
  switchSound.play();
  if (document.body.classList.contains("theme-casio")) {
    document.body.classList.remove("theme-casio");
    document.body.classList.add("theme-retro");
  } else {
    document.body.classList.remove("theme-retro");
    document.body.classList.add("theme-casio");
  }
});

function getCharacterCount(char) {
  const expressionArray = expression.split("");
  return expressionArray.filter((c) => c === char).length;
}

function keyEventHandler(value) {
  const lastChar = expression.slice(-1);

  if (["c", "="].includes(value.toLowerCase())) {
    clearSound.play();
  }

  // Clear
  if (value.toLowerCase() === "c") {
    expression = "0";
    updateDisplay();
    return;
  }

  // Equals
  if (value === "=") {
    try {
      // Replace the expression with its calculated result
      expression = eval(expression).toString();
      // If the result is Infinity or NaN, display "Error"
      if (expression === "Infinity" || expression === "NaN") {
        expression = "Error";
      }
    } catch (e) {
      expression = "Error";
    }
    updateDisplay();
    return;
  }

  keySound.play();

  // Handle operator input rules
  if (["+", "-", "*", "/"].includes(value)) {
    // Prevent multiple consecutive operators
    if (["+", "-", "*", "/"].includes(lastChar)) {
      // Replace last operator if another operator is pressed
      expression = expression.slice(0, -1) + value;
    } else if (expression !== "0") {
      // Append operator if last character is a number or closing parenthesis
      expression += value;
    }
    updateDisplay();
    return;
  }

  // Handle parentheses
  if (value === "(") {
    if (
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", ")"].includes(lastChar) ||
      (lastChar === "0" && expression.length !== 1)
    ) {
      // Add multiplication before ( if after a number or )
      expression += "*(";
    } else {
      expression = expression === "0" ? "(" : expression + "(";
    }
    updateDisplay();
    return;
  }
  if (value === ")") {
    // Only allow ) if there's an open ( and more ( than )
    const openCount = getCharacterCount("(");
    const closeCount = getCharacterCount(")");
    if (
      openCount > closeCount &&
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(lastChar)
    ) {
      expression += ")";
    }
    updateDisplay();
    return;
  }

  // Handle numbers and decimal
  if (expression === "0" && value !== ".") {
    expression = value;
  } else if (expression === "Error") {
    expression = value;
  } else {
    // Prevent multiple decimals in a single number
    if (value === ".") {
      const lastNumber = expression.split(/[+\-*/()]/).pop();
      if (!lastNumber.includes(".")) {
        expression += value;
      }
    } else {
      expression += value;
    }
  }

  updateDisplay();
}

function handleBackspace() {
  if (expression === "Error") {
    expression = "0";
  } else if (expression.length > 1) {
    expression = expression.slice(0, -1);
  } else {
    expression = "0";
  }
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    keyEventHandler(value);
  });
});

document.addEventListener("keydown", (e) => {
  if (
    [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "(",
      ")",
      "+",
      "-",
      "*",
      "/",
      "c",
      "=",
    ].includes(e.key.toLowerCase())
  ) {
    keyEventHandler(e.key);
  } else if (e.key.toLowerCase() === "enter") {
    keyEventHandler("=");
  } else if (e.key.toLowerCase() === "escape") {
    keyEventHandler("C");
  } else if (e.key.toLowerCase() === "backspace") {
    handleBackspace();
  }
});

function updateDisplay() {
  display.textContent = expression;
}
