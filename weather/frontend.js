/**
 * WEATHER PLUGIN FOR FM-DX WEBSERVER
 * Author: NoobishSVK
 * Used API: https://open-meteo.com/
 * Icons: OpenWeatherMap
 */

(() => {

    const LAT = localStorage.getItem('qthLatitude');
    const LON = localStorage.getItem('qthLongitude');

    if (!LAT || !LON) {
        console.log('[Weather] Attempting to fetch location...');
        fetchLocation();
    } else {
        getWeather();
    }

    // Function is only executed if local storage items don't exist
    // If they do exist we skip straight to getWeather()
    function fetchLocation() {
        $.ajax({
            url: './static_data',
            dataType: 'json',
            success: function (data) {
                if (data.qthLatitude && data.qthLongitude) {
                    localStorage.setItem('qthLatitude', data.qthLatitude);
                    localStorage.setItem('qthLongitude', data.qthLongitude);
                    getWeather();
                } else {
                    console.warn('[Weather] Location data missing in static_data.');
                }
            },
            error: function (err) {
                console.error('[Weather] Failed to fetch location for weather:', err);
            }
        });
    }

    function getWeather() {
        const LAT = localStorage.getItem('qthLatitude');
        const LON = localStorage.getItem('qthLongitude');

        if (!LAT || !LON) {
            console.warn('Cannot fetch weather without location.');
            return;
        }

        const REQUEST_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m${localStorage.getItem('imperialUnits') === 'true' ? '&temperature_unit=fahrenheit&wind_speed_unit=mph' : ''}`;
        function createWeatherEntry(iconCode, dayDescription, nightDescription = dayDescription) {
            return {
                day: {
                    description: dayDescription,
                    image: `http://openweathermap.org/img/wn/${iconCode}d@2x.png`
                },
                night: {
                    description: nightDescription,
                    image: `http://openweathermap.org/img/wn/${iconCode}n@2x.png`
                }
            };
        }

        const weatherData = {
            "0":  createWeatherEntry("01", "Sunny", "Clear"),
            "1":  createWeatherEntry("01", "Mainly Sunny", "Mainly Clear"),
            "2":  createWeatherEntry("02", "Partly Cloudy"),
            "3":  createWeatherEntry("03", "Cloudy"),
            "45": createWeatherEntry("50", "Foggy"),
            "48": createWeatherEntry("50", "Rime Fog"),
            "51": createWeatherEntry("09", "Light Drizzle"),
            "53": createWeatherEntry("09", "Drizzle"),
            "55": createWeatherEntry("09", "Heavy Drizzle"),
            "56": createWeatherEntry("09", "Light Freezing Drizzle"),
            "57": createWeatherEntry("09", "Freezing Drizzle"),
            "61": createWeatherEntry("10", "Light Rain"),
            "63": createWeatherEntry("10", "Rain"),
            "65": createWeatherEntry("10", "Heavy Rain"),
            "66": createWeatherEntry("10", "Light Freezing Rain"),
            "67": createWeatherEntry("10", "Freezing Rain"),
            "71": createWeatherEntry("13", "Light Snow"),
            "73": createWeatherEntry("13", "Snow"),
            "75": createWeatherEntry("13", "Heavy Snow"),
            "77": createWeatherEntry("13", "Snow Grains"),
            "80": createWeatherEntry("09", "Light Showers"),
            "81": createWeatherEntry("09", "Showers"),
            "82": createWeatherEntry("09", "Heavy Showers"),
            "85": createWeatherEntry("13", "Light Snow Showers"),
            "86": createWeatherEntry("13", "Snow Showers"),
            "95": createWeatherEntry("11", "Thunderstorm"),
            "96": createWeatherEntry("11", "Light Thunderstorms With Hail"),
            "99": createWeatherEntry("11", "Thunderstorm With Hail")
        };

        $( document ).ready(function() {
            getWeatherData();
        });

        function getWeatherData() {
            $.ajax({
                url: REQUEST_URL,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    //console.log(data); // For demonstration purposes, logging the data to console
                    initializeWeatherData(data);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching data:', error);
                }
            });
        }

        function initializeWeatherData(data) {
            document.getElementById('weather-plugin')?.remove();

            const windDirection = degreesToDirection(data.current.wind_direction_10m);

            let tooltipContent = `<table class='text-left'>
                        <tr>
                            <td class='text-bold' style='padding-right: 20px;'>Pressure:</td>
                            <td>${data.current.pressure_msl} ${data.current_units.pressure_msl} <span class='text-gray text-small'>(${data.current.relative_humidity_2m}% humidity)</span></td>
                        </tr>
                        <tr>
                            <td class='text-bold'>Wind:</td>
                            <td>${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m} <span class='text-gray text-small'>(${windDirection})</span></td>
                        </tr>
                    </table>`;
            let $serverInfoContainer = $('.dashboard-panel .panel-100-real .dashboard-panel-plugin-content');
            let weatherPanel = $(`
                <div id="weather-plugin" class="flex-container flex-center tooltip hide-phone hover-brighten br-15" style="height: 48px;padding-right: 10px;" data-tooltip="${tooltipContent}" data-tooltip-placement="bottom">
                    <img id="weatherImage" src="" alt="Weather Image" width="48px" height="48px">
                    <span class="color-4 m-0" style="font-size: 32px;padding-bottom:2px;font-weight: 100;">${data.current.temperature_2m}${data.current_units.temperature_2m}</span><br>
                </div>
            `);

            $serverInfoContainer.prepend(weatherPanel);
            setTimeout(function() {
                initTooltips(weatherPanel);
            }, 1000);

            if ($(window).width() < 768) {
                $serverInfoContainer.attr('style', 'text-align: center !important; padding: 0 !important; width: 100% !important;margin-bottom: 0 !important');
            }

            // Determine if it's day or night
            function getImageUrl(weatherCode) {
                // Convert isDay to a number for comparison
                const isDayNumeric = parseInt(data.current.is_day); 
            
                if (weatherCode in weatherData) {
                    const timeOfDay = isDayNumeric === 1 ? 'day' : 'night'; // Determine the time of day
                    if (timeOfDay in weatherData[weatherCode]) {
                        return weatherData[weatherCode][timeOfDay].image;
                    }
                }
            }
            

            // Get the image URL
            const imageUrl = getImageUrl(data.current.weather_code);

            // Set the image source
            $('#weatherImage').attr('src', imageUrl);
        }


        function degreesToDirection(degrees) {
            const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West', 'North'];
            const index = Math.round((degrees % 360) / 45);
            return directions[index];
        }

        function scheduleNextUpdate() {
            const now = new Date();
            const minutes = now.getMinutes();
            const initialDelay = (15 - (minutes % 15)) * 60 * 1000;

            setTimeout(() => {
                getWeatherData();
                setInterval(getWeatherData, 15 * 60 * 1000);
            }, initialDelay);
        }

        scheduleNextUpdate();
    }

})();
