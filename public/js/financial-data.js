const apiUrl = 'https://api.coindesk.com/v1/bpi/historical/close.json';

//get DOM elements
const userInputFromDate = document.getElementById('from-date-input');
const userInputToDate = document.getElementById('to-date-input');
const currencySelect = document.getElementById('currency');
const maxValue = document.getElementById('max-value');
const minValue = document.getElementById('min-value');

//global variables
let fromDate = userInputFromDate.value;
let toDate = userInputToDate.value;
let currency = currencySelect.value;
let chart;

//retrieve data from the API
function getBPIData() {
  const request = `${apiUrl}?start=${fromDate}&end=${toDate}&currency=${currency}`;

  axios
    .get(request)
    .then((responseFromAPI) => {
      printTheChart(responseFromAPI.data.bpi);
    })
    .catch((err) => console.log('Error while getting the data: ', err));
}

//generate the chart
function printTheChart(stockData) {
  const dates = Object.keys(stockData);
  const prices = Object.values(stockData);

  //update max & min values
  max = Math.max(...prices).toFixed(2);
  min = Math.min(...prices).toFixed(2);
  maxValue.innerText = `${max} ${currency}`;
  minValue.innerText = `${min} ${currency}`;

  const ctx = document.getElementById('my-chart').getContext('2d');

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Bitcoin Price Index',
          data: prices,
        },
      ],
    },
  });
}

//event listeners on the inputs & select
userInputFromDate.addEventListener('change', (e) => {
  fromDate = e.target.value;
  if (checkDates()) {
    updateChart();
    return;
  }
  alert('Please choose a valid date range');
});

userInputToDate.addEventListener('change', (e) => {
  toDate = e.target.value;
  if (checkDates()) {
    updateChart();
    return;
  }
  alert('Please choose a valid date range');
});

currencySelect.addEventListener('change', (e) => {
  currency = e.target.value;
  updateChart();
});

function updateChart() {
  clearCanvas();
  getBPIData();
}

getBPIData();
