function trigger() {
	var disks = parseInt($("#diskCount").val())
	var capacity = parseInt($("#diskCapacity").val())
	var type = $("#raidType").val()

	$("#errorText").text('')
	var result = test(disks, capacity, type);
	if (result !== true) {
		clearResults()
		$("#errorText").text(result)
		return console.log(result)
	}	

	var total = Math.floor(calculateCapacity(disks, capacity, type))
	var formatted = Math.floor(convertToFormatted(total))

	var tolerance = 0
	switch (type) {
		case '0':
			// RAID 0
			tolerance = 0
			break
		case '1':
			// RAID 1
			tolerance = drives - 1
			break
		case '2':
			// RAID 5
			tolerance = 1
			break
		case '3':
			// RAID 6
			tolerance = 2
			break
		case '4':
			// RAID 10
			tolerance = 1
			break
	}

	setResults(total, formatted, tolerance)
}

function calculateCapacity(n, c, t) {
	var l = n * c
	var result = 0;
	switch (t) {
		case '0':
			// RAID 0
			result = l
			break
		case '1':
			// RAID 1
			result = l / n
			break
		case '2':
			// RAID 5
			result = l - (l / n)
			break
		case '3':
			// RAID 6
			result = l - (2 / n)
			break
		case '4':
			// RAID 10
			result = l * 0.5
			break
	}
	return result
}

function convertToFormatted(capacity) {
	return capacity * 0.931
}

function test(disks, capacity, type) {
	if (isNaN(disks) || disks <= 1) {
		return "Number of disks must be a number greater than one."
	}

	if (type == '2' && disks <= 2) {
		return "Raid 5 requires at least 3 drives to function."
	}

	if (type == '3' && disks <= 3) {
		return "Raid 6 requires at least 4 drives to function."
	}

	if (isNaN(capacity) || capacity <= 0) {
		return "Single disk capacity must be a number greater than zero."
	}

	return true;
}

function setResults(total, formatted, tolerance) {
	$("#totalCapacityResult").text(total + ' GB')
	$("#formattedCapacityResult").text(formatted + ' GB')
	$("#toleranceResult").text(tolerance + ' Drive Failure' + (tolerance == 1 ? '':'s'))
}

function clearResults() {
	$("#totalCapacityResult").text('--')
	$("#formattedCapacityResult").text('--')
	$("#toleranceResult").text('--')
}

$(":text").keyup(function() {
  trigger()
})

$("#raidType").change(function() {
  trigger()
})

trigger()