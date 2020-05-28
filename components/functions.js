export function getPoints (choise1, choise2) {
  let roundPoints = []
  if ((choise1 === 'Stone' && choise2 === 'Stone') || (choise2 === 'Stone' && choise1 === 'Stone')) {
    roundPoints.push(0, 0)
  } else if ((choise1 === 'Scissors' && choise2 === 'Scissors') || (choise2 === 'Scissors' && choise1 === 'Scissors')) {
    roundPoints.push(0, 0)
  } else if ((choise1 === 'Paper' && choise2 === 'Paper') || (choise2 === 'Paper' && choise1 === 'Paper')) {
    roundPoints.push(0, 0)
  } else if (choise1 === 'Stone' && choise2 === 'Scissors') {
    roundPoints.push(1, 0)
  } else if (choise1 === 'Scissors' && choise2 === 'Stone') {
    roundPoints.push(0, 1)
  } else if (choise1 === 'Stone' && choise2 === 'Paper') {
    roundPoints.push(0, 1)
  } else if (choise1 === 'Paper' && choise2 === 'Stone') {
    roundPoints.push(1, 0)
  } else if (choise1 === 'Scissors' && choise2 === 'Paper') {
    roundPoints.push(1, 0)
  } else if (choise1 === 'Paper' && choise2 === 'Scissors') {
    roundPoints.push(0, 1)
  }
  return roundPoints
}

export function sumPoints (points) {
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    sum = sum + points[i]
  }
  return sum
}
