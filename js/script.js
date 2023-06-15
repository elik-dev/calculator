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

const calculatorButtons = {
    "backspace": () => {
        if (result) return;
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

function shortenDecimals(num) {
    return Math.round(num * 1000000) / 1000000;
}

function clearCalculator() {
    firstNumber = null;
    operator = null;
    secondNumber = null;
    result = null;
    display.textContent = 0;
}

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

function clickButton(event) {
    event.preventDefault();
    addPressFX(event);
    calculatorButtons[event.target.getAttribute("data-click")](event);
}

function releaseButton(event) {
    if (event.target.textContent === "⌫") {
        event.target.classList.remove("backspace-active");
        return;
    }
    if (!event) {
        event.target.classList.remove("fx-active");
    } else {
        buttons.forEach(button => {
            button.classList.remove("fx-active", "backspace-active");
        });
    }
}

// keyboard support
// this solution is a crime
function pressButton(event) {
    if (event.code === "Backspace") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='backspace']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Escape") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='clear']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit2" && event.shiftKey) {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='sqrt']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "KeyQ") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='pow']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Slash" || event.code === "NumpadDivide") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='divide']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit7" || event.code === "Numpad7") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='7']");
        button.dispatchEvent(mouseDown);
    }
    if ((event.code === "Digit8" && !event.shiftKey)
        || event.code === "Numpad8") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='8']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit9" || event.code === "Numpad9") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='9']");
        button.dispatchEvent(mouseDown);
    }
    if ((event.code === "Digit8" && event.shiftKey)
        || event.code == "NumpadMultiply") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='multiply']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit4" || event.code === "Numpad4") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='4']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit5" || event.code === "Numpad5") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='5']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit6" || event.code === "Numpad6") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='6']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Minus" || event.code === "NumpadSubtract") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='subtract']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit1" || event.code === "Numpad1") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='1']");
        button.dispatchEvent(mouseDown);
    }
    if ((event.code === "Digit2" && !event.shiftKey)
        || event.code === "Numpad2") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='2']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit3" || event.code === "Numpad3") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='3']");
        button.dispatchEvent(mouseDown);
    }
    if ((event.code === "Equal" && event.shiftKey)
        || event.code === "NumpadAdd") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='add']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Digit0" || event.code === "Numpad0") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='0']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Period" || event.code === "NumpadDecimal") {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='decimal']");
        button.dispatchEvent(mouseDown);
    }
    if (event.code === "Enter" || event.code === "NumpadEnter"
        || (event.code === "Equal" && !event.shiftKey)) {
        const mouseDown = new MouseEvent("mousedown");
        const button = document.querySelector("[data-key='equals']");
        button.dispatchEvent(mouseDown);
    }
}

let firstNumber = null;
let operator = null;
let secondNumber = null;
let result = null;

const display = document.querySelector(".display-content");
display.textContent = 0;

const buttons = document.querySelectorAll(".calculator button");
buttons.forEach(button => {
    button.addEventListener("mousedown", clickButton);
    button.addEventListener("mouseup", releaseButton);
    button.addEventListener("mouseover", addHoverFX);
    button.addEventListener("mouseout", removeHoverFX);
    button.addEventListener("touchstart", clickButton);
    button.addEventListener("touchend", releaseButton);
});

document.addEventListener("keydown", pressButton);
document.addEventListener("keyup", releaseButton);