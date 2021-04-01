const elInp = document.createElement("input");
elInp.type = "file";
elInp.addEventListener("change", (inp) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const doc = document.createElement("div");
    doc.innerText = reader.result;
    document.body.appendChild(doc);
  });
  reader.readAsText(inp.target.files[0]);
});

const geolocationValues = [];
const gyroscopeValues = [];
const accelerometerValues = [];
const linearAccelerationSensorValues = [];
const absoluteOrientationSensorValues = [];
const relativeOrientationSensorValues = [];

const elInpBin = document.createElement("input");
elInpBin.type = "file";
elInpBin.addEventListener("change", (inp) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const doc = document.createElement("div");
    const resultBin = reader.result;

    const bufs = [
      geolocationValues,
      gyroscopeValues,
      accelerometerValues,
      linearAccelerationSensorValues,
      absoluteOrientationSensorValues,
      relativeOrientationSensorValues,
    ];

    const segCnt = bufs.length;
    const hdrSize = segCnt * 2 * 4;
    const hdr = new Uint32Array(resultBin, 0, segCnt * 2);

    const flens = Array(segCnt);
    let ps = resultBin.byteLength;
    for (let i = segCnt - 1; i >= 0; i--) {
      const ofs = hdr[2 * i];
      const len = hdr[2 * i + 1];
      flens[i] = (ps - ofs) / (len * 8);
      ps = ofs;
    }

    for (let i = 0; i < segCnt; i++) {
      const ofs = hdr[2 * i];
      const len = hdr[2 * i + 1];
      const dv = new DataView(resultBin, ofs, len * flens[i] * 8);

      let tofs = 0;
      for (let j = 0; j < len; j++) {
        const rec = [];
        rec.push(dv.getBigUint64(tofs, true));
        tofs += 8;
        for (let k = 1; k < flens[i]; k++) {
          rec.push(dv.getFloat64(tofs, true));
          tofs += 8;
        }
        bufs[i].push(rec);
      }
    }

    const resultTxt = [
      "GEOLOCATION",
      ...geolocationValues.map((rec) => rec.join(",")),
      "GYROSCOPE",
      ...gyroscopeValues.map((rec) => rec.join(",")),
      "ACCELEROMETER",
      ...accelerometerValues.map((rec) => rec.join(",")),
      "LINEARACCELERATIONSENSOR",
      ...linearAccelerationSensorValues.map((rec) => rec.join(",")),
      "ABSOLUTEORIENTATIONSENSOR",
      ...absoluteOrientationSensorValues.map((rec) => rec.join(",")),
      "RELATIVEORIENTATIONSENSOR",
      ...relativeOrientationSensorValues.map((rec) => rec.join(",")),
    ].join("\n");

    doc.innerText = resultTxt;

    document.body.appendChild(doc);
  });
  reader.readAsArrayBuffer(inp.target.files[0]);
});

const elLbl = document.createElement("label");
elLbl.innerText = "Text";
const elLblBin = document.createElement("label");
elLblBin.innerText = "Binary";

document.body.appendChild(elLbl);
document.body.appendChild(elInp);
document.body.appendChild(elLblBin);
document.body.appendChild(elInpBin);
