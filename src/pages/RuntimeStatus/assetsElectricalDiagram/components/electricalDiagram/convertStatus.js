/* eslint-disable */
export function convertStatusColor_BJIco(dataModel) {
  if (dataModel.hasOwnProperty("statusCode")) {
    if (dataModel.statusCode === 1) {
      return dataModel.onColor;
    } else {
      return dataModel.offColor;
    }
  }

  return "gray";
}

export function convertStatusContent_BJIco(dataModel) {
  if (dataModel.hasOwnProperty("statusCode")) {
    if (dataModel.statusCode === 1) {
      return dataModel.onText;
    } else {
      return dataModel.offText;
    }
  }

  return "未知";
}

export function convertStatusColor_OpenClose(dataModel) {
  if (dataModel.hasOwnProperty("statusCode") && dataModel.statusCode === 1) {
    return "maroon";
  }
  return "lime";
}

export function convertStatusAngle_OpenClose(dataModel) {
  if (dataModel.hasOwnProperty("statusCode") && dataModel.statusCode === 1) {
    return 0;
  }

  switch (dataModel.cType) {
    case "Breaker":
      return 160;
    case "ACContactor":
      return 150;
    case "AirSwitch":
      if (dataModel.category === "airSwitch_96") {
        return 165;
      } else {
        return 150;
      }
  }

  return 90;
}

export function convertStatusToArrowColor_KIco(dataModel) {
  if (dataModel.hasOwnProperty("outputStatusCode")) {
    if (dataModel.outputStatusCode === 1) {
      return dataModel.onColor;
    } else {
      return dataModel.offColor;
    }
  }

  return "gray";
}

export function convertStatusToArrowAngle_KIco(dataModel) {
  if (dataModel.hasOwnProperty("handStatusCode")) {
    switch (dataModel.handStatusCode) {
      case 0:
        return -90;
      case 1:
        return 0;
      case 2:
        return 90;
      default:
        break;
    }
  }

  return 0;
}

export function convertStatusToArrowLocation_KIco(dataModel) {
  if (dataModel.hasOwnProperty("handStatusCode")) {
    switch (dataModel.handStatusCode) {
      case 0:
      case 2:
        return new go.Point(35, 45);
      case 1:
        return new go.Point(45, 35);
      default:
        break;
    }
  }

  return new go.Point(45, 35);
}

export function getReferenceCurrentDefaultNullStr(dataModel) {
  if (dataModel.hasOwnProperty("referenceCurrent")) {
    return dataModel.referenceCurrent;
  }

  return "---";
}

export function getCurrentDefaultZero(dataModel) {
  if (dataModel.hasOwnProperty("current")) {
    return dataModel.current;
  }

  return 0;
}

export function getActivePowerDefaultZero(dataModel) {
  if (dataModel.hasOwnProperty("activePower")) {
    return dataModel.activePower;
  }

  return 0;
}

export function getPowerFactorDefaultZero(dataModel) {
  if (dataModel.hasOwnProperty("powerFactor")) {
    return dataModel.powerFactor;
  }

  return 0;
}

export function getLIndexAndPhaseStrDefaultEmpty(dataModel) {
  if (dataModel.hasOwnProperty("indexL") && dataModel.hasOwnProperty("phase")) {
    return "(" + dataModel.indexL + dataModel.phase + ")";
  }

  return "";
}

export function getTimeStrDefaultEmpty(dataModel) {
  if (dataModel.hasOwnProperty("time")) {
    return dataModel.time;
  }

  return "";
}

export function convertValueToAngle(v, shape) {
  var scale = shape.part.findObject("SCALE");
  var p = scale.graduatedPointForValue(v);
  var shape = shape.part.findObject("SHAPE");
  var c = shape.actualBounds.center;
  return c.directionPoint(p);
}
