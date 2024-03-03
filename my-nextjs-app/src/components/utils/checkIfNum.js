// Return true if string is a number
// Set isPositiveOnly to allow number 0 to infinity
// Set isIntegerOnly to check if string is an integer
const checkIfNum = (strToCheck, isPositiveOnly=false, isIntegerOnly=false) => {
  if (isPositiveOnly) {
    if (isIntegerOnly && /^[0-9]*$/.test(strToCheck)) return true;
    if (!isIntegerOnly && /^[0-9]*\.?[0-9]*$/.test(strToCheck)) return true;
  }
  else {
    if (isIntegerOnly && /^-?[0-9]*$/.test(strToCheck)) return true;
    if (!isIntegerOnly && /^-?[0-9]*\.?[0-9]*$/.test(strToCheck)) return true;
  }
  return false;
}

export {checkIfNum}