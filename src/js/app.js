const API_KEY = 'FjNdE9Chm5Iai5wxocReVcasFXJ9Wbncz9mELOSh';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const currentSolElement = document.querySelector('[data-current-sol]');
const currentDateElement = document.querySelector('[data-current-date]');
const currentSeasonElement = document.querySelector('[data-current-season]');
const currentTempHighElement = document.querySelector(
	'[data-current-temp-high]'
);
const currentTempLowElement = document.querySelector('[data-current-temp-low]');
const currentPresHighElement = document.querySelector(
	'[data-current-pres-high]'
);
const currentPresLowElement = document.querySelector('[data-current-pres-low]');
const currentWindSpeedElement = document.querySelector(
	'[data-current-wind-speed]'
);
const currentWindDirectionElement = document.querySelector(
	'[data-current-wind-direction]'
);
const currentWindDegreesElement = document.querySelector(
	'[data-current-wind-degrees]'
);

const previousDaysContainer = document.querySelector('[data-previous-days]');
const previousDaysTemplate = document.querySelector(
	'[data-previous-days-template]'
);

let selectedSolIndex;

getWeather().then((sols) => {
	selectedSolIndex = sols.length - 1;
	displaySelectedSol(sols);
	displayPreviousDays(sols);
});

function getWeather() {
	return fetch(API_URL)
		.then((res) => res.json())
		.then((data) => {
			const { sol_keys, validity_checks, ...solData } = data;
			return Object.entries(solData).map(([sol, data]) => {
				return {
					sol: sol,
					date: new Date(data.First_UTC),
					season: data.Season,
					maxTemp: data.AT.mx,
					minTemp: data.AT.mn,
					maxPres: data.PRE.mx,
					minPres: data.PRE.mn,
					windSpeed: data.HWS.av,
					windDegrees: data.WD.most_common.compass_degrees,
					windDirection: data.WD.most_common.compass_point,
				};
			});
		});
}

function displaySelectedSol(sols) {
	const selectedSol = sols[selectedSolIndex];

	currentSolElement.innerText = selectedSol.sol;
	currentDateElement.innerText = displayDate(selectedSol.date);
	currentSeasonElement.innerText = selectedSol.season;
	currentTempHighElement.innerText = displayRoundedData(selectedSol.maxTemp);
	currentTempLowElement.innerText = displayRoundedData(selectedSol.minTemp);
	currentPresHighElement.innerText = displayRoundedData(selectedSol.maxPres);
	currentPresLowElement.innerText = displayRoundedData(selectedSol.minPres);
	currentWindSpeedElement.innerText = displayRoundedData(
		selectedSol.windSpeed
	);
	currentWindDirectionElement.innerText = selectedSol.windDirection;
	currentWindDegreesElement.style.setProperty(
		'--direction',
		`${selectedSol.windDegrees}deg`
	);
}

function displayPreviousDays(sols) {
	previousDaysContainer.innerHTML = '';

	sols.forEach((solData, index) => {
		const solContainer = previousDaysTemplate.content.cloneNode(true);
		solContainer.querySelector('[data-previous-sol]').innerText =
			solData.sol;
		solContainer.querySelector(
			'[data-previous-date]'
		).innerText = displayDate(solData.date);
		solContainer.querySelector(
			'[data-previous-temp-high]'
		).innerText = displayRoundedData(solData.maxTemp);
		solContainer.querySelector(
			'[data-previous-temp-low]'
		).innerText = displayRoundedData(solData.minTemp);
		solContainer
			.querySelector('[data-more-info]')
			.addEventListener('click', () => {
				selectedSolIndex = index;
				displaySelectedSol(sols);
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			});
		previousDaysContainer.appendChild(solContainer);
	});
}

function displayDate(date) {
	return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
}

function displayRoundedData(number) {
	return Math.round(number * 10) / 10;
}
