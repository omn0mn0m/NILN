<script>
	export let left = window.screen.width - 500;
	export let top = window.screen.height - 600;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}

	function onMouseMove(e) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}

	function onMouseUp() {
		moving = false;
	}

    let expression = ''

    /**
	 * @param {string} value
	 */
    function onNumberPress(value) {
        expression += value;
    }
</script>

<section on:mousedown={onMouseDown} role='form' aria-label='calculator' style="left: {left}px; top: {top}px;" class="draggable">
	<table id="calculator">
		<tr>
			<td colspan="3">
				<input type="text" id="result" value={expression} readonly/>
			</td>
			<td><input type="button" value="c" /></td>
		</tr>

		<tr>
			<td><input on:click={onNumberPress('1')} type="button" value="1" /></td>
			<td><input on:click={onNumberPress('2')} type="button" value="2" /></td>
			<td><input on:click={onNumberPress('3')} type="button" value="3" /></td>
			<td><input type="button" value="/" /></td>
		</tr>
		<tr>
			<td><input on:click={onNumberPress('4')} type="button" value="4" /></td>
			<td><input on:click={onNumberPress('5')} type="button" value="5" /></td>
			<td><input on:click={onNumberPress('6')} type="button" value="6" /></td>
			<td><input type="button" value="*" /></td>
		</tr>
		<tr>
			<td><input on:click={onNumberPress('7')} type="button" value="7" /></td>
			<td><input on:click={onNumberPress('8')} type="button" value="8" /></td>
			<td><input on:click={onNumberPress('9')} type="button" value="9" /></td>
			<td><input type="button" value="-" /></td>
		</tr>
		<tr>
			<td><input on:click={onNumberPress('0')} type="button" value="0" /></td>
			<td><input on:click={onNumberPress('.')} type="button" value="." /></td>
			<td><input type="button" value="=" /></td>
			<td><input type="button" value="+" /></td>
		</tr>
	</table>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.draggable {
		user-select: none;
		cursor: move;
		border: solid 1px gray;
		position: absolute;
	}

	input[type='button'] {
		width: 100%;
		padding: 5px 28px;
		background-color: #003163;
		color: white;
		font-size: 24px;
		font-weight: bold;
		border: none;
		border-radius: 5px;
	}

	input[type='text'] {
        width: 200px;
		padding: 5px 10px;
		font-size: 24px;
		font-weight: bold;
		border: none;
		border-radius: 5px;
		border: 2px solid black;
	}
</style>
