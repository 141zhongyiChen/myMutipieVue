/* eslint-disable */
import { roundNumber } from "./common.js";

function changeRunningStatus_BJIco(model, nodeData, status) {
    let bjStatus = status[nodeData.index];
    if (bjStatus !== undefined) {
        model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
    }
}

function changeRunningStatus_Breaker(model, nodeData, status) {
    if (nodeData.indexBJ === 14 || nodeData.indexBJ === 15 || nodeData.indexBJ === 16) {

        if ((status[14] && status[14].statusCode === 1) || (status[15] && status[15].statusCode === 1) ||
            (status[16] && status[16].statusCode === 1)) {

            model.setDataProperty(nodeData, "statusCode", 1);
        }
        else {
            model.setDataProperty(nodeData, "statusCode", 0);
        }
    } else {
        let bjStatus = status[nodeData.indexBJ];
        if (bjStatus !== undefined) {
            model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
        }
    }
}

function changeRunningStatus_Contactor(model, nodeData, status) {
    let bjStatus = status[nodeData.indexBJ];
    if (bjStatus !== undefined) {
        model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
    }
}

function changeRunningStatus_CT(model, nodeData, statusL, statusK, isOnline) {
    let lineStatus = statusL[nodeData.indexL];
    if (lineStatus !== undefined) {
        let referenceCurrent = -1;
        let current = 0;
        let activePower = 0;
        let powerFactor = 0;
        let voltage = 0;
        let abnormalValue = 0

        // 根据不同相序，计算值
        switch (nodeData.phase) {
            case "A":
                referenceCurrent = lineStatus.reference_IA;
                current = lineStatus.noRatioIA * nodeData.ratio;
                activePower = lineStatus.noRatioPA * nodeData.ratio / 1000;
                voltage = lineStatus.ua;
                abnormalValue = lineStatus.abnormalValue_IA;
                break;
            case "B":
                referenceCurrent = lineStatus.reference_IB;
                current = lineStatus.noRatioIB * nodeData.ratio;
                activePower = lineStatus.noRatioPB * nodeData.ratio / 1000;
                voltage = lineStatus.ub;
                abnormalValue = lineStatus.abnormalValue_IB;
                break;
            case "C":
                referenceCurrent = lineStatus.reference_IC;
                current = lineStatus.noRatioIC * nodeData.ratio;
                activePower = lineStatus.noRatioPC * nodeData.ratio / 1000;
                voltage = lineStatus.uc;
                abnormalValue = lineStatus.abnormalValue_IC;
                break;
            default:
                break;
        }

        // 计算功率因数
        if (current === 0 || voltage === 0) {
            powerFactor = 0;
        } else {
            let tempF = activePower * 1000 / (current * voltage);
            if (tempF > 1) {
                powerFactor = 1;
            } else {
                powerFactor = tempF;
            }
        }

        // 修改数据模型
        if (referenceCurrent > -1) {
            model.setDataProperty(nodeData, "referenceCurrent", roundNumber(referenceCurrent, 2));
            // 终端在线，K路开灯，且设有参考电流时，判断电流是否异常
            let kStatus = statusK[nodeData.indexK];
            if (kStatus !== undefined && isOnline === true && kStatus.outputStatusCode === 1) {
                // 实际电流与参考电流的偏差值
                let deviation = Math.abs(current - referenceCurrent);
                // 异常判断条件
                let tempValue = referenceCurrent * abnormalValue / 100;
                if (deviation > tempValue) {
                    model.setDataProperty(nodeData, "warning", true);
                } else {
                    model.setDataProperty(nodeData, "warning", false);
                }
            } else {
                model.setDataProperty(nodeData, "warning", false);
            }
        } else {
            model.setDataProperty(nodeData, "referenceCurrent", "---");
        }
        model.setDataProperty(nodeData, "current", roundNumber(current, 2));
        model.setDataProperty(nodeData, "activePower", roundNumber(activePower, 2));
        model.setDataProperty(nodeData, "powerFactor", roundNumber(powerFactor, 2));
    }
}

function changeRunningStatus_ThreePhaseCT(model, nodeData, statusL, statusK, isOnline) {
    let hasWarning = false;
    // A相
    let lineStatusA = statusL[nodeData.indexA];
    if (lineStatusA !== undefined) {
        let reference_IA = lineStatusA.reference_IA;
        let currentA = 0;
        let activePowerA = 0;
        let powerFactorA = 0;
        let abnormalValueA = 0

        currentA = lineStatusA.noRatioIA * nodeData.ratioA;
        activePowerA = lineStatusA.noRatioPA * nodeData.ratioA / 1000;
        powerFactorA = calculatePowerFactor(lineStatusA.noRatioIA, lineStatusA.ua, lineStatusA.noRatioPA);
        abnormalValueA = lineStatusA.abnormalValue_IA;

        if (reference_IA > -1) {
            model.setDataProperty(nodeData, "reference_IA", roundNumber(reference_IA, 2));
            let kStatusA = statusK[nodeData.kIndexA];
            if (kStatusA !== undefined && isOnline === true && kStatusA.outputStatusCode === 1) {
                let deviationA = Math.abs(currentA - reference_IA);
                let tempValueA = reference_IA * abnormalValueA / 100;
                if (deviationA > tempValueA) {
                    hasWarning = true;
                }
            }
        } else {
            model.setDataProperty(nodeData, "reference_IA", "---");
        }
        model.setDataProperty(nodeData, "currentA", roundNumber(currentA, 2));
        model.setDataProperty(nodeData, "activePowerA", roundNumber(activePowerA, 2));
        model.setDataProperty(nodeData, "powerFactorA", roundNumber(powerFactorA, 2));
    }

    // B相
    let lineStatusB = statusL[nodeData.indexB];
    if (lineStatusB !== undefined) {
        let reference_IB = lineStatusB.reference_IB;
        let currentB = 0;
        let activePowerB = 0;
        let powerFactorB = 0;
        let abnormalValueB = 0

        currentB = lineStatusB.noRatioIB * nodeData.ratioB;
        activePowerB = lineStatusB.noRatioPB * nodeData.ratioB / 1000;
        powerFactorB = calculatePowerFactor(lineStatusB.noRatioIB, lineStatusB.ub, lineStatusB.noRatioPB);
        abnormalValueB = lineStatusB.abnormalValue_IB;

        if (reference_IB > -1) {
            model.setDataProperty(nodeData, "reference_IB", roundNumber(reference_IB, 2));
            let kStatusB = statusK[nodeData.kIndexB];
            if (kStatusB !== undefined && isOnline === true && kStatusB.outputStatusCode === 1) {
                let deviationB = Math.abs(currentB - reference_IB);
                let tempValueB = reference_IB * abnormalValueB / 100;
                if (deviationB > tempValueB) {
                    hasWarning = true;
                }
            }
        } else {
            model.setDataProperty(nodeData, "reference_IB", "---");
        }
        model.setDataProperty(nodeData, "currentB", roundNumber(currentB, 2));
        model.setDataProperty(nodeData, "activePowerB", roundNumber(activePowerB, 2));
        model.setDataProperty(nodeData, "powerFactorB", roundNumber(powerFactorB, 2));
    }

    // C相
    let lineStatusC = statusL[nodeData.indexC];
    if (lineStatusC !== undefined) {
        let reference_IC = lineStatusC.reference_IC;
        let currentC = 0;
        let activePowerC = 0;
        let powerFactorC = 0;
        let abnormalValueC = 0

        currentC = lineStatusC.noRatioIC * nodeData.ratioC;
        activePowerC = lineStatusC.noRatioPC * nodeData.ratioC / 1000;
        powerFactorC = calculatePowerFactor(lineStatusC.noRatioIC, lineStatusC.uc, lineStatusC.noRatioPC);
        abnormalValueC = lineStatusC.abnormalValue_IC;

        if (reference_IC > -1) {
            model.setDataProperty(nodeData, "reference_IC", roundNumber(reference_IC, 2));
            let kStatusC = statusK[nodeData.kIndexC];
            if (kStatusC !== undefined && isOnline === true && kStatusC.outputStatusCode === 1) {
                let deviationC = Math.abs(currentC - reference_IC);
                let tempValueC = reference_IC * abnormalValueC / 100;
                if (deviationC > tempValueC) {
                    hasWarning = true;
                }
            }
        } else {
            model.setDataProperty(nodeData, "reference_IC", "---");
        }
        model.setDataProperty(nodeData, "currentC", roundNumber(currentC, 2));
        model.setDataProperty(nodeData, "activePowerC", roundNumber(activePowerC, 2));
        model.setDataProperty(nodeData, "powerFactorC", roundNumber(powerFactorC, 2));
    }

    if (hasWarning) {
        model.setDataProperty(nodeData, "warning", true);
    } else {
        model.setDataProperty(nodeData, "warning", false);
    }
}

function changeRunningStatus_KIco(model, nodeData, status) {
    let kStatus = status[nodeData.index];
    if (kStatus !== undefined) {
        model.setDataProperty(nodeData, "isDisable", kStatus.isDisable);
        model.setDataProperty(nodeData, "outputStatusCode", kStatus.outputStatusCode);
        model.setDataProperty(nodeData, "handStatusCode", kStatus.handStatusCode);
        model.setDataProperty(nodeData, "isLeakageProtection", kStatus.isLeakageProtection);
    }
}

function changeRunningStatus_AirSwitch(model, nodeData, status) {
    let bjStatus = status[nodeData.indexBJ];
    if (bjStatus !== undefined) {
        model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
    }
}

function changeRunningStatus_Load(model, nodeData, status) {
    let bjStatus = status[nodeData.indexBJ];
    if (bjStatus !== undefined) {
        model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
    }
}

function changeRunningStatus_TimeTable(model, nodeData, timeStr) {
    model.setDataProperty(nodeData, "time", timeStr);
}

function changeRunningStatus_VoltageTable(model, nodeData, isIn, voltageA, voltageB, voltageC) {
    let name = isIn === true ? "inputU" : "outputU";
    model.setDataProperty(nodeData, name + "A", roundNumber(voltageA, 2));
    model.setDataProperty(nodeData, name + "B", roundNumber(voltageB, 2));
    model.setDataProperty(nodeData, name + "C", roundNumber(voltageC, 2));
}

function changeRunningStatus_TotalIPTable(model, nodeData, lineStatus, linePhaseRatioMap) {
    let lineStatusArray = Object.keys(lineStatus).map(function (e) {
        return lineStatus[e]
    });

    // 总有功
    let tPowerA = 0, tPowerB = 0, tPowerC = 0;
    // 与cosφ相关的电流
    let cosA = 0, cosB = 0, cosC = 0;
    // 与sinφ相关的电流
    let sinA = 0, sinB = 0, sinC = 0;
    // 总参考电流
    let tRefCurrentA = 0, tRefCurrentB = 0, tRefCurrentC = 0;

    linePhaseRatioMap.forEach(function (value, key) {
        // 找到线路的数据记录
        let statusIndex = lineStatusArray.findIndex(function (obj) {
            return obj.index === key;
        });
        if (statusIndex > -1) {
            // 线路状态的对象
            let statusItem = lineStatusArray[statusIndex];
            /******** 判断该线路上存在的相序，并计算 ********/
            if (value.has("A")) {
                // A相
                tPowerA += statusItem.noRatioPA * value.get("A");
                let pfA = calculatePowerFactor(statusItem.noRatioIA, statusItem.ua, statusItem.noRatioPA);
                cosA += statusItem.noRatioIA * value.get("A") * pfA;
                sinA += statusItem.noRatioIA * value.get("A") * Math.sqrt(1 - Math.pow(pfA, 2));
                if (statusItem.reference_IA > 0) {
                    tRefCurrentA += statusItem.reference_IA;
                }
            }
            if (value.has("B")) {
                // B相
                tPowerB += statusItem.noRatioPB * value.get("B");
                let pfB = calculatePowerFactor(statusItem.noRatioIB, statusItem.ub, statusItem.noRatioPB);
                cosB += statusItem.noRatioIB * value.get("B") * pfB;
                sinB += statusItem.noRatioIB * value.get("B") * Math.sqrt(1 - Math.pow(pfB, 2));
                if (statusItem.reference_IB > 0) {
                    tRefCurrentB += statusItem.reference_IB;
                }
            }
            if (value.has("C")) {
                // C相
                tPowerC += statusItem.noRatioPC * value.get("C");
                let pfC = calculatePowerFactor(statusItem.noRatioIC, statusItem.uc, statusItem.noRatioPC);
                cosC += statusItem.noRatioIC * value.get("C") * pfC;
                sinC += statusItem.noRatioIC * value.get("C") * Math.sqrt(1 - Math.pow(pfC, 2));
                if (statusItem.reference_IC > 0) {
                    tRefCurrentC += statusItem.reference_IC;
                }
            }
        }
    }, linePhaseRatioMap);

    let totalP_A = tPowerA / 1000;
    let totalP_B = tPowerB / 1000;
    let totalP_C = tPowerC / 1000;

    let totalI_A = Math.sqrt(Math.pow(cosA, 2) + Math.pow(sinA, 2));
    let totalI_B = Math.sqrt(Math.pow(cosB, 2) + Math.pow(sinB, 2));
    let totalI_C = Math.sqrt(Math.pow(cosC, 2) + Math.pow(sinC, 2));

    model.setDataProperty(nodeData, "totalI_A", roundNumber(totalI_A, 2));
    model.setDataProperty(nodeData, "totalI_B", roundNumber(totalI_B, 2));
    model.setDataProperty(nodeData, "totalI_C", roundNumber(totalI_C, 2));

    model.setDataProperty(nodeData, "totalP_A", roundNumber(totalP_A, 2));
    model.setDataProperty(nodeData, "totalP_B", roundNumber(totalP_B, 2));
    model.setDataProperty(nodeData, "totalP_C", roundNumber(totalP_C, 2));

    if (tRefCurrentA > 0) {
        model.setDataProperty(nodeData, "tRefCurrentA", roundNumber(tRefCurrentA, 2));
    } else {
        model.setDataProperty(nodeData, "tRefCurrentA", "---");
    }

    if (tRefCurrentB > 0) {
        model.setDataProperty(nodeData, "tRefCurrentB", roundNumber(tRefCurrentB, 2));
    } else {
        model.setDataProperty(nodeData, "tRefCurrentB", "---");
    }

    if (tRefCurrentC > 0) {
        model.setDataProperty(nodeData, "tRefCurrentC", roundNumber(tRefCurrentC, 2));
    } else {
        model.setDataProperty(nodeData, "tRefCurrentC", "---");
    }
}

function calculatePowerFactor(current, voltage, activePower) {
    if (current === 0 || voltage === 0) {
        return 0;
    }
    let apparentPower = current * voltage;
    let temp = activePower / apparentPower;
    return temp > 1 ? 1 : temp;
}

function changeRunningStatus_KClock(model, nodeData, status) {
    let kStatus = status[nodeData.indexK];
    if (kStatus !== undefined) {
        let lightTimeData = kStatus.openLightTimeRangeDictionary;
        // 第一段
        if (lightTimeData[1] !== undefined) {
            model.setDataProperty(nodeData, "areaData_1", lightTimeData[1].areaPathData);
            model.setDataProperty(nodeData, "areaAngle_1", lightTimeData[1].areaAngle);
            model.setDataProperty(nodeData, "open1", lightTimeData[1].beginTime + "~" + lightTimeData[1].endTime);
        }
    }
}

function changeRunningStatus_KnifeSwitch(model, nodeData, status) {
    let bjStatus = status[nodeData.indexBJ];
    if (bjStatus !== undefined) {
        model.setDataProperty(nodeData, "statusCode", bjStatus.statusCode);
    }
}

function changeRunningStatus_LineFrequency(model, nodeData, lineFrequency) {
    model.setDataProperty(nodeData, "lineFrequency", lineFrequency);
}

let changeStatus = {
    forBJIco: changeRunningStatus_BJIco,
    forBreaker: changeRunningStatus_Breaker,
    forContactor: changeRunningStatus_Contactor,
    forCT: changeRunningStatus_CT,
    forKIco: changeRunningStatus_KIco,
    forAirSwitch: changeRunningStatus_AirSwitch,
    forLoad: changeRunningStatus_Load,
    forTimeTable: changeRunningStatus_TimeTable,
    forVoltageTable: changeRunningStatus_VoltageTable,
    forTotalIPTable: changeRunningStatus_TotalIPTable,
    forThreePhaseCT: changeRunningStatus_ThreePhaseCT,
    forKClock: changeRunningStatus_KClock,
    forKnifeSwitch: changeRunningStatus_KnifeSwitch,
    forLineFrequency: changeRunningStatus_LineFrequency
}

export { changeStatus }
