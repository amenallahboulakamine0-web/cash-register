let price = 19.5;
let cid = [
  ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1],
  ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55],
  ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]
];

const denominationValues = {
  "PENNY": 0.01, "NICKEL": 0.05, "DIME": 0.1,
  "QUARTER": 0.25, "ONE": 1, "FIVE": 5,
  "TEN": 10, "TWENTY": 20, "ONE HUNDRED": 100
};

const displayChange = document.getElementById("change-due");
const displayStatus = document.getElementById("status");
const drawerDiv = document.getElementById("drawer-display");

const updateUI = () => {
    drawerDiv.innerHTML = "<strong>Cash in Drawer:</strong><br>";
    cid.forEach(item => {
        drawerDiv.innerHTML += `<div class="denom-row"><span>${item[0]}:</span> <span>$${item[1].toFixed(2)}</span></div>`;
    });
};

document.getElementById("purchase-btn").addEventListener("click", () => {
    const cash = parseFloat(document.getElementById("cash").value);
    const priceVal = parseFloat(document.getElementById("price").value);
    calculateChange(priceVal, cash);
});

function calculateChange(price, cash) {
    let changeDue = cash - price;
    
    if (cash < price) {
        alert("Customer does not have enough money!");
        return;
    }
    if (cash === price) {
        displayChange.innerText = "No change due - customer paid with exact cash";
        return;
    }

    let totalCid = Math.round(cid.reduce((sum, curr) => sum + curr[1], 0) * 100) / 100;
    
    if (totalCid < changeDue) {
        displayStatus.innerText = "Status: INSUFFICIENT_FUNDS";
        displayChange.innerText = "";
        return;
    }

    let changeArray = [];
    let remainingChange = Math.round(changeDue * 100);
    let reversedCid = [...cid].reverse();

    for (let [name, amount] of reversedCid) {
        let val = Math.round(denominationValues[name] * 100);
        let available = Math.round(amount * 100);
        let amountFromDenom = 0;

        while (remainingChange >= val && available > 0) {
            remainingChange -= val;
            available -= val;
            amountFromDenom += val;
        }

        if (amountFromDenom > 0) {
            changeArray.push([name, amountFromDenom / 100]);
            let originalIndex = cid.findIndex(item => item[0] === name);
            cid[originalIndex][1] -= amountFromDenom / 100;
        }
    }

    if (remainingChange > 0) {
        displayStatus.innerText = "Status: INSUFFICIENT_FUNDS";
        displayChange.innerText = "";
    } else if (Math.round(cid.reduce((sum, curr) => sum + curr[1], 0) * 100) === 0) {
        displayStatus.innerText = "Status: CLOSED";
        formatChangeResult(changeArray);
    } else {
        displayStatus.innerText = "Status: OPEN";
        formatChangeResult(changeArray);
    }
    
    updateUI();
}

function formatChangeResult(arr) {
    displayChange.innerHTML = arr.map(item => `${item[0]}: $${item[1]}`).join("<br>");
}

updateUI();