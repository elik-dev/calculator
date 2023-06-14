const operations = {
    "+": (a, b) => { return a + b },
    "-": (a, b) => { return a - b },
    "×": (a, b) => { return a * b },
    "÷": (a, b) => {
        if (b === 0) {
            clearCalculator();
            alert("You can't divide by zero!");
            removeFX();
            return 0;
        }
        return a / b;
    },
};

function clearCalculator() {
    firstNumber = null;
    operator = null;
    secondNumber = null;
    result = null;
    display.textContent = 0;
}

function shortenDecimals(num) {
    return Math.round(num * 1000000) / 1000000;
}

const calculatorButtons = {
    "backspace": () => {
        // display.textContent = display.textContent
        //     .slice(0, display.textContent.length - 1);
        if (display.textContent.slice(-1) === operator) return;
        if ((display.textContent.length === 2
            && display.textContent.slice(0, 1) === "-")
            || display.textContent.length === 1) {
            display.textContent = 0;
        } else {
            display.textContent = display.textContent.slice(0, -1);
        }


    },
    "clear": () => {
        clearCalculator();
    },
    "square-root": () => {
        if (display.textContent.slice(-1) === operator) {
            display.textContent = shortenDecimals(Math.sqrt(+display.textContent.slice(0, -1)));
        } else {
            display.textContent = shortenDecimals(Math.sqrt(+display.textContent));
        }
        if (display.textContent === "NaN") {
            alert("Negative numbers doesn't have square roots!");
            removeFX();
            clearCalculator();
        }
    },
    "power-of-2": () => {
        if (display.textContent.slice(-1) === operator) {
            display.textContent = shortenDecimals(Math.pow(+display.textContent.slice(0, -1), 2));
        } else {
            display.textContent = shortenDecimals(Math.pow(+display.textContent, 2));
        }

    },
    "negate": () => {
        if (display.textContent == 0) return;
        if (display.textContent.slice(-1) === operator) {
            display.textContent = display.textContent.slice(0, -1) * -1;
        } else {
            display.textContent = +display.textContent * -1;
        }
    },
    "floating-point": () => {
        if (display.textContent.includes(operator)) {
            display.textContent = "0.";
        } else if (!display.textContent.includes(".")) {
            display.textContent += ".";
        }
    },
    "operator": (event) => {
        if (display.textContent.slice(-1) === operator) {
            display.textContent = display.textContent
                .slice(0, -1) + event.target.textContent;
            operator = event.target.textContent;
        } else if (!display.textContent.includes(operator) && operator && !result) {
            secondNumber = +display.textContent;
            firstNumber = shortenDecimals(operations[operator](firstNumber, secondNumber));
            operator = event.target.textContent;
            display.textContent = firstNumber + operator;
        } else {
            operator = event.target.textContent;
            if (display.textContent.slice(-1) === ".") {
                display.textContent = display.textContent
                    .slice(0, display.textContent.length - 1);
            }
            display.textContent += operator;
            result = null;
        }
        firstNumber = +display.textContent.slice(0, -1);
    },
    "equals": () => {
        if (!operator) return;
        if (result == null) {
            if (display.textContent.slice(-1) === operator) {
                secondNumber = +display.textContent.slice(0, -1);
            } else {
                secondNumber = +display.textContent;
            }
        } else {
            firstNumber = result;
        }
        result = shortenDecimals(operations[operator](firstNumber, secondNumber));
        display.textContent = result;
    },
    "number": (event) => {
        if (display.textContent === "0" || display.textContent.includes(operator)) {
            display.textContent = "";
        }
        display.textContent += event.target.textContent;
    },
};

function addPressFX(event) {
    if (event.target.textContent === "⌫") {
        event.target.classList.add("backspace-active");
        return;
    }
    event.target.classList.add("fx-active");
}

function addHoverFX(event) {
    if ("ontouchstart" in window) return;
    if (event.target.textContent === "⌫") {
        event.target.classList.add("backspace-hover");
        return;
    };
    event.target.classList.add("fx-hover");
}

function removePressFX(event) { // wip
    if (event.target.textContent === "⌫") {
        event.target.classList.remove("backspace-active");
        return;
    }
    if (!event) {
        event.target.classList.remove("fx-active");
    } else {
        buttons.forEach(button => {
            button.classList.remove("fx-active");
        });
    }
}

function removeHoverFX(event) {
    if (event.target.textContent === "⌫") {
        event.target.classList.remove("backspace-hover");
        return;
    }
    if (!event) {
        event.target.classList.remove("fx-hover");
    } else {
        buttons.forEach(button => {
            button.classList.remove("fx-hover");
        });
    }

}

function pressButton(event) {
    event.preventDefault();
    addPressFX(event);
    calculatorButtons[event.target.getAttribute("data-btn-type")](event);
}

let firstNumber = null;
let operator = null;
let secondNumber = null;
let result = null;

const display = document.querySelector(".display-content");
display.textContent = 0;
const buttons = document.querySelectorAll(".calculator button");
buttons.forEach(button => {
    button.addEventListener("mousedown", pressButton);
    button.addEventListener("mouseup", removePressFX);
    button.addEventListener("mouseover", addHoverFX);
    button.addEventListener("mouseout", removeHoverFX);
    button.addEventListener("touchstart", pressButton);
    button.addEventListener("touchend", removePressFX);
});

// todo
// - limit display numbers max length
// - add keyboard support