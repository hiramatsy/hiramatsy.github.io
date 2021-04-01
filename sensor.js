const uaInfo = document.querySelector('#uainfo');

const geolocationValues = [];
const deviceOrientationEvents = [];
const deviceMotionEvents = [];
const gyroscopeValues = [];
const accelerometerValues = [];
const linearAccelerationSensorValues = [];
const absoluteOrientationSensorValues = [];
const relativeOrientationSensorValues = [];

const SensorFreq = 10;

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition

// https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition/coords
// https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates
// https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition/timestamp
const id = navigator.geolocation.watchPosition(
    pos => {
        geolocationValues.push([
            pos.timestamp,
            pos.coords.longitude,
            pos.coords.latitude,
            pos.coords.heading,
            pos.coords.speed,
            pos.coords.accuracy,
            pos.coords.altitude,
            pos.coords.altitudeAccuracy]);
    },
    error => {
        uaInfo.innerText += `${error.code} ${error.message}\n`;
    },
    {
        enableHighAccuracy: false,
        timeout: 1000,
        maximumAge: 0
    }
);

// https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", event => {
        deviceOrientationEvents.push([Date.now(),
        event.absolute,
        event.alpha,// alpha: rotation around z-axis, rotate degrees
        event.gamma,// left to right
        event.beta]);// front back motion, front to back
    }, true);
    uaInfo.innerText += "OK deviceorientation\n";
} else {
    uaInfo.innerText += "NG deviceorientation\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs

// https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event
if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", event => {

        deviceMotionEvents.push([Date.now(),
        event.acceleration.x,
        event.acceleration.y,
        event.acceleration.z,
        event.accelerationIncludingGravity.x,
        event.accelerationIncludingGravity.y,
        event.accelerationIncludingGravity.z,
        event.interval,
        event.rotationRate.alpha,
        event.rotationRate.gamma,
        event.rotationRate.beta
        ]);
    }, true);
    uaInfo.innerText += "OK devicemotion\n";
} else {
    uaInfo.innerText += "NG devicemotion\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope
try {
    const gyroscope = new Gyroscope({ frequency: SensorFreq });
    gyroscope.addEventListener('reading', () => {
        gyroscopeValues.push([Date.now(), gyroscope.x, gyroscope.y, gyroscope.z]);
    });
    gyroscope.start();

    uaInfo.innerText += "OK Gyroscope\n";
} catch (e) {
    uaInfo.innerText += e + "\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer
try {
    const acl = new Accelerometer({ frequency: SensorFreq });
    acl.addEventListener('reading', () => {
        accelerometerValues.push([Date.now(), acl.x, acl.y, acl.z])
    });
    acl.start();
    uaInfo.innerText += "OK Accelerometer\n";
} catch (e) {
    uaInfo.innerText += e + "\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/LinearAccelerationSensor
try {
    const laSensor = new LinearAccelerationSensor({ frequency: SensorFreq });
    laSensor.addEventListener('reading', () => {
        linearAccelerationSensorValues.push([Date.now(), laSensor.x, laSensor.y, laSensor.z])
    });
    laSensor.start();

    uaInfo.innerText += "OK LinearAccelerationSensor\n";
} catch (e) {
    uaInfo.innerText += e + "\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/OrientationSensor
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained

// https://developer.mozilla.org/en-US/docs/Web/API/AbsoluteOrientationSensor
try {
    const options = { frequency: SensorFreq, referenceFrame: 'device' };
    const sensor = new AbsoluteOrientationSensor(options);

    sensor.addEventListener('reading', () => {
        absoluteOrientationSensorValues.push([Date.now(), ...sensor.quaternion]);
    });
    sensor.addEventListener('error', error => {
        if (error.name == 'NotReadableError') {
            uaInfo.innerText += error.message + "\n";
        }
    });
    sensor.start();
    uaInfo.innerText += "OK AbsoluteOrientationSensor\n";
} catch (e) {
    uaInfo.innerText += e + "\n";
}

// https://developer.mozilla.org/en-US/docs/Web/API/RelativeOrientationSensor
try {
    const options = { frequency: SensorFreq, referenceFrame: 'device' };
    const sensor = new RelativeOrientationSensor(options);

    sensor.addEventListener('reading', () => {
        relativeOrientationSensorValues.push([Date.now(), ...sensor.quaternion]);
    });
    sensor.addEventListener('error', error => {
        if (error.name == 'NotReadableError') {
            uaInfo += error.message + "\n";
        }
    });
    sensor.start();
    uaInfo.innerText += "OK RelativeOrientationSensor\n";
} catch (e) {
    uaInfo.innerText += e + "\n";
}

const elGeolocation = document.querySelector("#geolocation");
const elDeviceorientation = document.querySelector("#deviceorientation");
const elDevicemotion = document.querySelector("#devicemotion");
const elGyroscope = document.querySelector("#gyroscope");
const elAccelerometer = document.querySelector("#accelerometer");
const elLinearaccelerationsensor = document.querySelector("#linearaccelerationsensor");
const elAbsoluteorientationsensor = document.querySelector("#absoluteorientationsensor");
const elRelativeorientationsensor = document.querySelector("#relativeorientationsensor");

const formatValues = (label, len, elapsed, ary) => {
    return `${label} ${len} ${len / elapsed}\n` + (ary ? ary.join("\n") : "") + "\n\n"
}

const startTs = Date.now();

const itvId = setInterval(() => {
    const elapsed = (Date.now() - startTs) / 1000;
    elGeolocation.innerText = formatValues("Geolocation", geolocationValues.length, elapsed, geolocationValues[geolocationValues.length - 1]);
    elDeviceorientation.innerText = formatValues("DeviceOrientationEvents", deviceOrientationEvents.length, elapsed, deviceOrientationEvents[deviceOrientationEvents.length - 1]);
    elDevicemotion.innerText = formatValues("DeviceMotionEvent", deviceMotionEvents.length, elapsed, deviceMotionEvents[deviceMotionEvents.length - 1]);
    elGyroscope.innerText = formatValues("Gyroscope", gyroscopeValues.length, elapsed, gyroscopeValues[gyroscopeValues.length - 1]);
    elAccelerometer.innerText = formatValues("Accelerometer", accelerometerValues.length, elapsed, accelerometerValues[accelerometerValues.length - 1]);
    elLinearaccelerationsensor.innerText = formatValues("LinearAccelerationSensor", linearAccelerationSensorValues.length, elapsed, linearAccelerationSensorValues[linearAccelerationSensorValues.length - 1]);
    elAbsoluteorientationsensor.innerText = formatValues("AbsoluteOrientationSensor", absoluteOrientationSensorValues.length, elapsed, absoluteOrientationSensorValues[absoluteOrientationSensorValues.length - 1]);
    elRelativeorientationsensor.innerText = formatValues("RelativeOrientationSensor", relativeOrientationSensorValues.length, elapsed, relativeOrientationSensorValues[relativeOrientationSensorValues.length - 1]);
}, 100);
