$(document).ready(function () {
	let safeColors = ['00', '33', '66', '99', 'cc', 'ff']

	let rand = () => {
		return Math.floor(Math.random() * 6)
	}

	let randomColor = () => {
		let r = safeColors[rand()]
		let g = safeColors[rand()]
		let b = safeColors[rand()]
		return '#' + r + b + g
	}

	let getScoreFromDom = () => {
		return document.getElementById('score')
	}

	let saveFile = () => {
		let score = getScoreFromDom().textContent
		if (parseInt(score) > 0) {
			localStorage.setItem('kentaro.saveFile', score)
		}
	}

	let loadFile = () => {
		var score = JSON.parse(localStorage.getItem('kentaro.saveFile'))
		if (score !== null) {
			getScoreFromDom().textContent = score
		}
	}

	function updateState() {
		let scoreElement = getScoreFromDom()
		let score = parseInt(scoreElement.textContent)

		score++
		scoreElement.textContent = score

		saveFile()

		document.body.style.background = randomColor()
		document.body.style.color = 'white'

		let dWidth = $(document).width() - 211
		let dHeight = $(document).height() - 211

		let nextX = Math.floor(Math.random() * dWidth)
		let nextY = Math.floor(Math.random() * dHeight)

		$(this).animate({ left: nextX + 'px', top: nextY + 'px' })
	}

	jQuery(function ($) {
		loadFile()

		const isTouchDevice = () => {
			return ['iPad', 'iPhone', 'iPod'].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
		}

		// bluntly assume only one input method for mobile as mouseup
		// and mouseover can lead to 2 taps
		if(isTouchDevice()) {
			$('#kentaro').on('mouseup', updateState)
		} else {
			$('#kentaro').on('mouseover', updateState)
		}
	})
})
