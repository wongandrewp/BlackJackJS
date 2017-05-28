' use strict '

var display = document.getElementById('display')

function yourFunctionName (){
  display.innerHTML = "hello"
}

function example () {
  var v = 3 + 4
  display.innerHTML = v
}

function combineArrays(arrOne, arrTwo) {
  let arrCombined = []
  for (let i = 0; i < arrOne.length; i++) {
    arrCombined.push(arrOne[i])
    arrCombined.push(arrTwo[i])
  }
  display.innerHTML = arrCombined
}

function getFirstDigit (num) {
  let digitString = ('' + num)[0]
  let digit = parseInt(digitString)
  return digit
}

function compare (numOne, numTwo) {
  const digitOne = getFirstDigit(numOne)
  const digitTwo = getFirstDigit(numTwo)
  if (digitOne < digitTwo) return 1
  if (digitOne > digitTwo) return -1
  else return 0
}

function formLargestNum (arrPosInt) {
  console.log(arrPosInt)
  arrPosInt.sort(compare)
  display.innerHTML += arrPosInt.join('')
}

