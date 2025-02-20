const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
let expression = "0";

function getCharacterCount(char) {
  const expressionArray = expression.split("");
  return expressionArray.filter((c) => c === char).length;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;
    const lastChar = expression.slice(-1);

    // Clear
    if (button.classList.contains("clear")) {
      expression = "0";
      updateDisplay();
      return;
    }

    // Equals
    if (button.classList.contains("equals")) {
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

    // Handle operator input rules
    if (
      button.classList.contains("operator") &&
      value !== "(" &&
      value !== ")"
    ) {
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
  });
});

function updateDisplay() {
  display.textContent = expression;
}
