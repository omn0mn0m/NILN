<script>
	import Calculator from './Calculator.svelte';
	import LabValues from './LabValues.svelte';

	const Mode = {
		Load: 'Load',
		Exam: 'Exam',
		Report: 'Report',
		Review: 'Review'
	};

	let mode = Mode.Load;

	/**
	 * @type {{ title: string; questions: any[]; } | null}
	 */
	let exam;
	/**
	 * @type {string}
	 */
	let examTitle;
	/**
	 * @type {number}
	 */
	let totalQuestions;
	/**
	 * @type {string[]}
	 */
	let attemptAnswers = [];

	// Current question
	/**
	 * @type {number}
	 */
	let questionNumber;
	/**
	 * @type {number}
	 */
	let questionId;
	/**
	 * @type {string}
	 */
	let question;
	/**
	 * @type {string[]}
	 */
	let answerOptions;
	/**
	 * @type {string}
	 */
	let selectedAnswer;
	let explanation = '';

	/**
	 * @type {boolean[]}
	 */
	let grading = [];

	let showCalculator = false;
	let showLabValues = false;

	/**
	 * @param {any} event
	 */
	async function onFileChange(event) {
		const file = event.target.files[0]; // only one exam at a time
		if (file == null) {
			exam = null;
			return;
		}

		exam = await readJsonFile(file);

		if (exam) {
			attemptAnswers = [];
			grading = [];
			explanation = '';
			examTitle = exam.title;
			totalQuestions = exam.questions.length;

			// load first question
			showQuestion(1);

			mode = Mode.Exam;
		}
	}

	/**
	 * @param {Blob} file
	 */
	function readJsonFile(file) {
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = () => resolve(JSON.parse(reader.result));
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}

	function saveQuestionChanges() {
		attemptAnswers[questionNumber - 1] = selectedAnswer;
		exam.questions[questionNumber - 1].question = question;
		exam.questions[questionNumber - 1].answerOptions = answerOptions;
	}

	function goToPreviousQuestion() {
		if (questionNumber != 1) {
			saveQuestionChanges();
			showQuestion(questionNumber - 1);
		}
	}

	function goToNextQuestion() {
		if (questionNumber != totalQuestions) {
			saveQuestionChanges();
			showQuestion(questionNumber + 1);
		}
	}

	function endExam() {
		saveQuestionChanges();

		exam?.questions.forEach((question, index) => {
			grading = [...grading, question.correctAnswer == attemptAnswers[index]];
		});

		mode = Mode.Report;
	}

	function showScoreReport() {
		mode = Mode.Report;
	}

	/**
	 * @param {number} numberToLoad
	 */
	function showQuestion(numberToLoad) {
		if (exam) {
			const currentQuestion = exam.questions[numberToLoad - 1];

			questionNumber = numberToLoad;
			questionId = currentQuestion.id;
			question = currentQuestion.question;
			answerOptions = currentQuestion.answerOptions;
			selectedAnswer = attemptAnswers[numberToLoad - 1];
			explanation = currentQuestion.explanation;
		}
	}

	function toggleCalculator() {
		showCalculator = !showCalculator;
	}

	function toggleLabValues() {
		showLabValues = !showLabValues;
	}

	/**
	 * @param {number} index
	 */
	function showReview(index) {
		mode = Mode.Review;
		showQuestion(index + 1);
	}

	function highlight() {
		if (window.getSelection) {
			const selection = window.getSelection()?.toString();

			if (selection) {
				question = question.replace(selection, `<mark>${selection}</mark>`);
			}
		}
	}

	function unhighlight(event) {
		if (event.target.tagName == 'MARK') {
			question = question.replace(event.target.outerHTML, event.target.outerText);
		}
	}

	function toggleStrikethrough(event) {
		if (event.target.tagName == 'DEL') {
			const index = answerOptions.indexOf(event.target.outerHTML);
			answerOptions[index] = event.target.outerText;
		} else {
			const index = answerOptions.indexOf(event.target.outerText);
			answerOptions[index] = `<del>${event.target.outerText}</del>`;
		}
	}
</script>

<div class="container">
	<header class="nav">
		{#if exam && mode == Mode.Exam}
			<div>
				<p id="question-number">Item {questionNumber} of {totalQuestions}</p>
				<p id="question-id">Question Id: {questionId}</p>
			</div>
			<div>
				<input type="checkbox" />🚩 Mark
			</div>
		{/if}
		<div class="exam-title">
			<p>NILN Is Like NBME</p>
			{#if exam}
				<p>{examTitle}</p>
			{/if}
		</div>
	</header>

	<main>
		<div class="question-box">
			{#if mode == Mode.Report}
				<table class="grading-report">
					{#each grading as grade, index}
						<tr>
							<td>{index + 1}</td>
							<td>
								{#if grade}
									✔️
								{:else}
									❌
								{/if}
							</td>
							<td
								><button on:click={() => showReview(index)} class="review-button">Review</button
								></td
							>
						</tr>
					{/each}
				</table>
			{:else if mode == Mode.Exam || mode == Mode.Review}
				<p on:click={unhighlight} on:mouseup={highlight} id="question" class="left">
					{@html question}
				</p>

				<ol type="A" id="answer-options">
					{#each answerOptions as option}
						<li>
							<input bind:group={selectedAnswer} type="radio" name="answer" value={option} />
							<span on:click={toggleStrikethrough}>{@html option}</span>
						</li>
					{/each}
				</ol>

				{#if mode == Mode.Review}
					<h3>Explanation:</h3>
					<p>{explanation}</p>
				{/if}

				{#if showCalculator}
					<Calculator />
				{/if}
			{:else}
				<p>
					NILN is a NBME-style online practice exam where you can upload a custom exam file to take.
					It attempts to simulate the exam-taking experience as closely as possible.
				</p>

				<p>Disclaimer: NILN does not distribute any copyrighted exam questions.</p>

				<form>
					<input type="file" on:change={onFileChange} accept=".json" />
				</form>

				<p>
					Looking for an exam to try out the software? <a href="/example.json" download
						>Download our example exam.</a
					>
				</p>
			{/if}
		</div>
		{#if showLabValues}
			<LabValues />
		{/if}
	</main>

	<footer class="nav bottom">
		{#if mode == Mode.Exam || mode == Mode.Review}
			<div class="nav-group">
				<button on:click={goToPreviousQuestion} class="emoji-button">
					<span class="emoji">⬅️</span>
					<span>Prev.</span>
				</button>
				<button on:click={goToNextQuestion} class="emoji-button">
					<span class="emoji">➡️</span>
					<span>Next</span>
				</button>
				{#if mode == Mode.Exam}
					<button on:click={endExam} class="emoji-button">
						<span class="emoji">🛑</span>
						<span>End Exam</span>
					</button>
				{:else if mode == Mode.Review}
					<button on:click={showScoreReport} class="emoji-button">
						<span class="emoji">📄</span>
						<span>Score Report</span>
					</button>
				{/if}
			</div>

			<div class="nav-group right">
				<button on:click={toggleLabValues} class="emoji-button">
					<span class="emoji">🧪</span>
					<span>Lab Values</span>
				</button>
				<button on:click={toggleCalculator} class="emoji-button">
					<span class="emoji">🧮</span>
					<span>Calculator</span>
				</button>
				<button id="settings" class="emoji-button">
					<span class="emoji">⚙️</span>
					<span>Settings</span>
				</button>
			</div>
		{:else}
			<div class="nav-group">
				<p>Copyright 2024 Nam Tran</p>
			</div>
			<div class="nav-group right">
				<p>Source Code</p>
			</div>
		{/if}
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	main {
		display: flex;
	}

	.container {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-columns: 100%;
		min-height: 100vh;
		min-height: 100svh;
	}

	.question-box {
		flex: 1;
		padding: 2em;
	}

	li input {
		position: absolute;
		margin-left: -40px;
		margin-top: 5px;
	}

	.nav {
		background-color: #003163;
		color: #f7f7f7;
		width: 100%;
		height: 80px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nav div {
		padding-left: 8px;
		padding-right: 8px;
	}

	.exam-title {
		text-align: center;
		flex-grow: 1;
	}

	.emoji-button {
		display: flex;
		flex-direction: column;
		width: 100px;
		background: transparent;
		border: none !important;
		cursor: pointer;
		text-align: center;
		font-size: 1em;
		color: #f7f7f7;
	}

	.emoji-button .emoji {
		font-size: 1.5em;
	}

	.nav-group {
		display: flex;
		flex-direction: row;
	}

	.left {
		margin-left: 0;
	}

	.right {
		margin-left: auto;
	}

	.bottom {
		margin-top: auto;
	}

	form {
		margin: 0 auto;
		width: 250px;
	}

	input[type='file']::file-selector-button {
		margin: 20px;
		border: none;
		background: #003163;
		padding: 10px 20px;
		border-radius: 10px;
		color: #fff;
		cursor: pointer;
		transition: background 0.2s ease-in-out;
	}

	.grading-report {
		border: 1px solid #003163;
		border-collapse: collapse;
	}

	.grading-report tr:nth-child(even) {
		background-color: #ccc;
	}

	.grading-report td {
		padding: 6px;
	}

	.review-button {
		cursor: pointer;
		text-decoration: underline;
		color: #0000ee;
		background: transparent;
		border: none !important;
	}
</style>
