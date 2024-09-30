/**
 * WEATHER PLUGIN FOR FM-DX WEBSERVER
 * Author: NoobishSVK, minor changes by Bkram
 * Used API: https://open-meteo.com/
 * Icons: OpenWeatherMap
 */

const LAT = localStorage.getItem('qthLatitude');
const LON = localStorage.getItem('qthLongitude');
const REQUEST_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m`;
let lastUpdate;

const weatherData = {
	"0": {
		"day": {
			"description": "Sunny",
			"image": "http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night": {
			"description": "Clear",
			"image": "http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"1": {
		"day": {
			"description": "Mainly Sunny",
			"image": "http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night": {
			"description": "Mainly Clear",
			"image": "http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"2": {
		"day": {
			"description": "Partly Cloudy",
			"image": "http://openweathermap.org/img/wn/02d@2x.png"
		},
		"night": {
			"description": "Partly Cloudy",
			"image": "http://openweathermap.org/img/wn/02n@2x.png"
		}
	},
	"3": {
		"day": {
			"description": "Cloudy",
			"image": "http://openweathermap.org/img/wn/03d@2x.png"
		},
		"night": {
			"description": "Cloudy",
			"image": "http://openweathermap.org/img/wn/03n@2x.png"
		}
	},
	"45": {
		"day": {
			"description": "Foggy",
			"image": "http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night": {
			"description": "Foggy",
			"image": "http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"48": {
		"day": {
			"description": "Rime Fog",
			"image": "http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night": {
			"description": "Rime Fog",
			"image": "http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"51": {
		"day": {
			"description": "Light Drizzle",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Light Drizzle",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"53": {
		"day": {
			"description": "Drizzle",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Drizzle",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"55": {
		"day": {
			"description": "Heavy Drizzle",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Heavy Drizzle",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"56": {
		"day": {
			"description": "Light Freezing Drizzle",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Light Freezing Drizzle",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"57": {
		"day": {
			"description": "Freezing Drizzle",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Freezing Drizzle",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"61": {
		"day": {
			"description": "Light Rain",
			"image": "http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night": {
			"description": "Light Rain",
			"image": "http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"63": {
		"day": {
			"description": "Rain",
			"image": "http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night": {
			"description": "Rain",
			"image": "http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"65": {
		"day": {
			"description": "Heavy Rain",
			"image": "http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night": {
			"description": "Heavy Rain",
			"image": "http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"66": {
		"day": {
			"description": "Light Freezing Rain",
			"image": "http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night": {
			"description": "Light Freezing Rain",
			"image": "http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"67": {
		"day": {
			"description": "Freezing Rain",
			"image": "http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night": {
			"description": "Freezing Rain",
			"image": "http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"71": {
		"day": {
			"description": "Light Snow",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Light Snow",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"73": {
		"day": {
			"description": "Snow",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Snow",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"75": {
		"day": {
			"description": "Heavy Snow",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Heavy Snow",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"77": {
		"day": {
			"description": "Snow Grains",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Snow Grains",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"80": {
		"day": {
			"description": "Light Showers",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Light Showers",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"81": {
		"day": {
			"description": "Showers",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Showers",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"82": {
		"day": {
			"description": "Heavy Showers",
			"image": "http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night": {
			"description": "Heavy Showers",
			"image": "http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"85": {
		"day": {
			"description": "Light Snow Showers",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Light Snow Showers",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"86": {
		"day": {
			"description": "Snow Showers",
			"image": "http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night": {
			"description": "Snow Showers",
			"image": "http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"95": {
		"day": {
			"description": "Thunderstorm",
			"image": "http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night": {
			"description": "Thunderstorm",
			"image": "http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"96": {
		"day": {
			"description": "Light Thunderstorms With Hail",
			"image": "http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night": {
			"description": "Light Thunderstorms With Hail",
			"image": "http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"99": {
		"day": {
			"description": "Thunderstorm With Hail",
			"image": "http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night": {
			"description": "Thunderstorm With Hail",
			"image": "http://openweathermap.org/img/wn/11n@2x.png"
		}
	}
};

$(document).ready(function () {
	getWeatherData();
});

function getWeatherData() {
	$.ajax({
		url: REQUEST_URL,
		method: 'GET',
		dataType: 'json',
		success: function (data) {
			console.log(data); // Log the data for debugging
			if (data && data.current) { // Check if data and current exist
				// Remove existing weather panel if it exists
				// $('#weatherPanel').remove();
				initializeWeatherData(data);
			} else {
				console.error('Unexpected data structure:', data);
			}
		},
		error: function (xhr, status, error) {
			console.error('Error fetching data:', error);
		}
	});
}

function degreesToDirection(degrees) {
	const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West', 'North'];
	const index = Math.round((degrees % 360) / 45);
	return directions[index];
}
function initializeWeatherData(data) {
	if (!data.current) return; // Safeguard against missing current data

	const windDirection = degreesToDirection(data.current.wind_direction_10m);
	const lastUpdate = new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true
	});

	const createWeatherTable = () => `
        <div class="flex-container flex-center">
            <img id="weatherImage" src="" alt="Weather Image" width="70px" height="70px">
            <span class="text-medium-big color-4 m-0">${data.current.temperature_2m}${data.current_units.temperature_2m}</span><br>
        </div>
        <div class="flex-container flex-center">
            <table class="text-left">
                <tr>
                    <td class="text-bold" style="padding-right: 20px;">Pressure:</td>
                    <td>${data.current.pressure_msl} ${data.current_units.pressure_msl} <span class="text-gray text-small">(${data.current.relative_humidity_2m}% humidity)</span></td>
                </tr>
                <tr>
                    <td class="text-bold">Wind:</td>
                    <td>${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m} <span class="text-gray text-small">(${windDirection})</span></td>
                </tr>
                <tr>
                    <td class="text-bold">Last Update:</td>
                    <td>${lastUpdate}</td>
                </tr>
            </table>
        </div>
    `;

	let $serverInfoContainer = $('#tuner-name').parent();
	let weatherPanel = $(`
        <div id="weatherPanel" class="panel-33 no-bg hide-phone m-0" style="margin-left: 25px !important;">
            ${createWeatherTable()}
        </div>
    `);

	if (document.getElementById("weatherPanel")) {
		$('#weatherPanel').html(createWeatherTable());
	} else {
		let newParent = $('<div class="flex-container flex-center"></div>');
		newParent.insertBefore($serverInfoContainer);
		newParent.append($serverInfoContainer, weatherPanel);
		$serverInfoContainer.removeClass('panel-100').addClass('panel-75').css('padding-left', '20px');
	}

	if ($(window).width() < 768) {
		$serverInfoContainer.attr('style', 'text-align: center !important; padding: 0 !important; width: 100% !important; margin-bottom: 0 !important');
	}

	const imageUrl = getImageUrl(data);
	$('#weatherImage').attr('src', imageUrl);
}

function getImageUrl(data) {
	const weatherCode = data.current.weather_code;
	const isDayNumeric = parseInt(data.current.is_day);
	if (weatherCode in weatherData) {
		const timeOfDay = isDayNumeric === 1 ? 'day' : 'night';
		if (timeOfDay in weatherData[weatherCode]) {
			return weatherData[weatherCode][timeOfDay].image;
		}
	}
	return ''; // Return an empty string if no valid image found
}

function reloadWeatherData() {
	getWeatherData();
	lastUpdate = new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true
	});
}

// Set an interval to reload weather data every 10 minutes (600000 milliseconds)
setInterval(reloadWeatherData, 600000);
