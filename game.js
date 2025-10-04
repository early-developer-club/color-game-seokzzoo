// 게임 상태 변수
let level = 1
let wrong = 0
let timer = null
let timeLeft = 30
let boardSize = 4 // 4x4
let isGameActive = false

const rulesModal = document.getElementById("rules-modal")
const startBtn = document.getElementById("start-btn")
const gameContainer = document.getElementById("game-container")
const board = document.getElementById("board")
const levelSpan = document.getElementById("level")
const timerDiv = document.getElementById("timer")
const timeSpan = document.getElementById("time")
const mistakesSpan = document.getElementById("wrong")
const endModal = document.getElementById("end-modal")
const endMessage = document.getElementById("end-message")
const restartBtn = document.getElementById("restart-btn")
const homeBtn = document.getElementById("home-btn")

function showRules() {
  rulesModal.style.display = "flex"
  gameContainer.style.display = "none"
  endModal.style.display = "none"
}

function startGame() {
  level = 1
  wrong = 0
  isGameActive = true
  rulesModal.style.display = "none"
  endModal.style.display = "none"
  gameContainer.style.display = "block"
  updateInfo()
  nextLevel()
}

function updateInfo() {
  levelSpan.textContent = level
  mistakesSpan.textContent = wrong
}

function getBoardSize(level) {
  if (level <= 3) return 3
  if (level <= 6) return 4
  if (level <= 9) return 5
  if (level <= 12) return 6
  return 7 // 13단계 이상은 7x7
}

function nextLevel() {
  clearInterval(timer)
  timeLeft = 30
  timeSpan.textContent = timeLeft
  updateInfo()
  boardSize = getBoardSize(level)
  generateBoard()
  timer = setInterval(() => {
    timeLeft--
    timeSpan.textContent = timeLeft
    if (timeLeft <= 0) {
      clearInterval(timer)
      endGame()
    }
  }, 1000)
}

function generateBoard() {
  board.innerHTML = ""
  // 난이도에 따라 색 차이 조절
  const diff = Math.max(8 - level, 1) * 8 // 레벨이 올라갈수록 diff 감소
  const baseColor = randomColor()
  const oddColor = shiftColor(baseColor, diff)
  // 랜덤 위치에 oddColor 배치
  const total = boardSize * boardSize
  const oddIdx = Math.floor(Math.random() * total)
  // 동적으로 grid-template-columns 설정
  board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`
  // 보드 최대 크기 조정
  const boardMaxWidth = Math.min(400, boardSize * 70)
  board.style.maxWidth = boardMaxWidth + "px"
  for (let i = 0; i < total; i++) {
    const square = document.createElement("div")
    square.className = "square"
    // 동적으로 크기 조정
    const size = boardMaxWidth / boardSize - 12
    square.style.width = size + "px"
    square.style.height = size + "px"
    square.style.background = i === oddIdx ? oddColor : baseColor
    square.addEventListener("click", () => handleSquareClick(i === oddIdx))
    board.appendChild(square)
  }
}

function handleSquareClick(isOdd) {
  if (!isGameActive) return
  if (isOdd) {
    level++
    nextLevel()
  } else {
    wrong++
    updateInfo()
    if (wrong >= 3) {
      endGame()
    }
  }
}

function endGame() {
  isGameActive = false
  clearInterval(timer)
  endMessage.textContent = `당신의 절대색감 레벨은 LV.${level}입니다.`
  endModal.style.display = "flex"
  gameContainer.style.display = "none"
}

function randomColor() {
  // 밝은 색상 방지, 80~200 범위
  const r = 80 + Math.floor(Math.random() * 120)
  const g = 80 + Math.floor(Math.random() * 120)
  const b = 80 + Math.floor(Math.random() * 120)
  return `rgb(${r},${g},${b})`
}

function shiftColor(rgb, diff) {
  // rgb: 'rgb(r,g,b)', diff: 1~64
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  // 한 채널만 diff만큼 변화
  const channel = Math.floor(Math.random() * 3)
  const arr = [r, g, b]
  arr[channel] = Math.max(0, Math.min(255, arr[channel] + (Math.random() < 0.5 ? -diff : diff)))
  return `rgb(${arr[0]},${arr[1]},${arr[2]})`
}

startBtn.addEventListener("click", startGame)
restartBtn.addEventListener("click", startGame)
homeBtn.addEventListener("click", () => {
  showRules()
})
window.onload = showRules
