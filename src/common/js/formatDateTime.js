export function formatDateTime (theDate) {
  let _hour = theDate.getHours()
  let _minute = theDate.getMinutes()
  let _second = theDate.getSeconds()
  let _year = theDate.getFullYear()
  let _month = theDate.getMonth()
  let _date = theDate.getDate()
  if (_hour < 10) {
    _hour = '0' + _hour
  }
  if (_minute < 10) {
    _minute = '0' + _minute
  }
  if (_second < 10) {
    _second = '0' + _second
  }
  _month = _month + 1
  if (_month < 10) {
    _month = '0' + _month
  }
  if (_date < 10) {
    _date = '0' + _date
  }
  return _year + '-' + _month + '-' + _date + ' ' + _hour + ':' + _minute + ':' + _second
}

export function standardDateTime (dateString) {
  let ret = dateString.split(' ')
  let YMD = ret[0].split('-')
  let HMS = ret[1].split(':')
  let standardDate = new Date(YMD[0], YMD[1], YMD[2], HMS[0], HMS[1], HMS[2])
  return standardDate
}
