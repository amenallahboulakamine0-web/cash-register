// Global variables for price and cash in drawer
let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Currency values in descending order
const currencyUnits = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 20],
  ["TEN", 10],
  ["FIVE", 5],
  ["ONE", 1],
  ["QUARTER", 0.25],
  ["DIME", 0.1],
  ["NICKEL", 0.05],
  ["PENNY", 0.01]
];

// DOM elements
const priceDisplay = document.getElementById("price-display");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const alertMessage = document.getElementById("alert-message");
const changeBreakdown = document.getElementById("change-breakdown");
const changeItems = document.getElementById("change-items");
const drawerItems = document.getElementById("drawer-items");

// Initialize the app
function init() {
  priceDisplay.textContent = price.toFixed(2);
  renderDrawer();
  
  purchaseBtn.addEventListener("click", handlePurchase);
  cashInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      handlePurchase();
    }
  });
  
  // Focus on input when page loads
  cashInput.focus();
}

// Handle purchase button click
function handlePurchase() {
  hideAlert();
  hideChangeBreakdown();
  
  const cash = parseFloat(cashInput.value);
  
  // Validate input
  if (isNaN(cash) || cash < 0) {
    showAlert("Please enter a valid cash amount");
    return;
  }
  
  if (cash < price) {
    showAlert("Customer does not have enough money to purchase the item");
    return;
  }
  
  if (cash === price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    changeDue.className = "status-closed";
    return;
  }

  const change = getChange(cash - price, JSON.parse(JSON.stringify(cid)));
  displayResult(change);
  
  // Update drawer display
  renderDrawer();
}

// Calculate change
function getChange(changeDue, drawer) {
  let changeArray = [];
  let remaining = changeDue;
  let totalCID = drawer.reduce((sum, curr) => sum + curr[1], 0);

  totalCID = Math.round(totalCID * 100) / 100;

  if (totalCID < remaining) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // Create a copy of drawer in the same order as currencyUnits
  const drawerReversed = [...drawer].reverse();

  for (let i = 0; i < currencyUnits.length; i++) {
    const [unit, value] = currencyUnits[i];
    let drawerUnit = drawerReversed[i][1];
    let amountUsed = 0;

    while (remaining >= value && drawerUnit > 0) {
      remaining -= value;
      remaining = Math.round(remaining * 100) / 100;
      drawerUnit -= value;
      amountUsed += value;
    }

    if (amountUsed > 0) {
      changeArray.push([unit, Math.round(amountUsed * 100) / 100]);
    }
  }

  const totalChange = changeArray.reduce((sum, curr) => sum + curr[1], 0);
  totalCID = Math.round(totalCID * 100) / 100;
  remaining = Math.round(remaining * 100) / 100;

  if (remaining > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  } else if (totalChange === totalCID) {
    return { status: "CLOSED", change: drawer };
  } else {
    return { status: "OPEN", change: changeArray };
  }
}

// Display the result
function displayResult(result) {
  changeDue.textContent = `Status: ${result.status}`;
  
  if (result.status === "INSUFFICIENT_FUNDS") {
    changeDue.className = "status-insufficient";
  } else if (result.status === "CLOSED") {
    changeDue.className = "status-closed";
    // Show change breakdown for CLOSED status
    showChangeBreakdown(result.change.filter(([_, amt]) => amt > 0));
  } else if (result.status === "OPEN") {
    changeDue.className = "status-open";
    // Show change breakdown for OPEN status
    showChangeBreakdown(result.change);
  }
}

// Show change breakdown
function showChangeBreakdown(changeArray) {
  changeBreakdown.classList.remove("hidden");
  changeItems.innerHTML = "";
  
  if (changeArray.length === 0) {
    changeItems.innerHTML = "<p>No change to give</p>";
    return;
  }
  
  changeArray.forEach(([unit, amount]) => {
    const changeItem = document.createElement("div");
    changeItem.className = "change-item";
    changeItem.innerHTML = `
      <span class="change-denomination">${unit}:</span>
      <span class="change-amount">$${amount.toFixed(2)}</span>
    `;
    changeItems.appendChild(changeItem);
  });
}

// Hide change breakdown
function hideChangeBreakdown() {
  changeBreakdown.classList.add("hidden");
}

// Show alert message
function showAlert(message) {
  alertMessage.textContent = message;
  alertMessage.classList.remove("hidden");
}

// Hide alert message
function hideAlert() {
  alertMessage.classList.add("hidden");
}

// Render the cash drawer
function renderDrawer() {
  drawerItems.innerHTML = "";
  
  cid.forEach(([unit, amount]) => {
    const drawerItem = document.createElement("div");
    drawerItem.className = "drawer-item";
    drawerItem.innerHTML = `
      <div class="drawer-denomination">${unit}</div>
      <div class="drawer-amount">$${amount.toFixed(2)}</div>
    `;
    drawerItems.appendChild(drawerItem);
  });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);