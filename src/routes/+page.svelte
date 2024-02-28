<script>
	/**
	 * @type {{ title: string; questions: any[]; } | null}
	 */
	let exam;
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
	/**
	 * @type {boolean[]}
	 */
	let grading = [];

	/**
	 * @param {{ target: { files: any[]; }; }} e
	 */
	async function onFileChange(e) {
		const file = e.target.files[0]; // only one exam at a time
		if (file == null) {
			exam = null;
			return;
		}

		exam = await readJsonFile(file);

		if (exam) {
			attemptAnswers = [];
			grading = [];
			examTitle = exam.title;
			totalQuestions = exam.questions.length;

			// load first question
			showQuestion(1);
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

	function goToPreviousQuestion() {
		if (questionNumber != 1) {
			attemptAnswers[questionNumber - 1] = selectedAnswer;
			showQuestion(questionNumber - 1);
		}
	}

	function goToNextQuestion() {
		if (questionNumber != totalQuestions) {
			attemptAnswers[questionNumber - 1] = selectedAnswer;
			showQuestion(questionNumber + 1);
		}
	}

	function endExam() {
		attemptAnswers[questionNumber - 1] = selectedAnswer;

		exam?.questions.forEach((question, index) => {
			grading = [...grading, question.correctAnswer == attemptAnswers[index]];
		});
	}

	/**
	 * @param {number} numberToLoad
	 */
	function showQuestion(numberToLoad) {
		const currentQuestion = exam.questions[numberToLoad - 1];

		questionNumber = numberToLoad;
		questionId = currentQuestion.id;
		question = currentQuestion.question;
		answerOptions = currentQuestion.otherOptions.concat(currentQuestion.correctAnswer);
		selectedAnswer = attemptAnswers[numberToLoad - 1];
	}
</script>

<main>
	<div class="container">
		<div class="question-container">
			<div class="top-nav">
				{#if exam && grading.length == 0}
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
					<p id="exam-title"></p>
				</div>
			</div>

			<div id="question-box" class="question-box">
				{#if grading.length != 0}
					<table class="grading-report">
						{#each grading as grade, index}
							<tr>
								<td>{index}</td>
								<td
									>{#if grade}✔️{:else}❌{/if}</td
								>
								<td>Review</td>
							</tr>
						{/each}
					</table>
				{:else if exam}
					<p id="question">{question}</p>

					<ol type="A" id="answer-options">
						{#each answerOptions as option}
							<li>
								<input bind:group={selectedAnswer} type="radio" name="answer" value={option} />
								{option}
							</li>
						{/each}
					</ol>
				{:else}
					<form>
						<input type="file" on:change={onFileChange} accept=".json" />
					</form>
				{/if}
			</div>

			<div class="bottom-nav">
				{#if exam && grading.length == 0}
					<div class="nav-group">
						<button on:click={goToPreviousQuestion} class="emoji-button">
							<span class="emoji">⬅️</span>
							<span>Prev.</span>
						</button>
						<button on:click={goToNextQuestion} class="emoji-button">
							<span class="emoji">➡️</span>
							<span>Next</span>
						</button>
						<button on:click={endExam} class="emoji-button">
							<span class="emoji">🛑</span>
							<span>End Exam</span>
						</button>
					</div>

					<div class="nav-group right">
						<button id="lab-values" class="emoji-button">
							<span class="emoji">🧪</span>
							<span>Lab Values</span>
						</button>
						<button id="calculator" class="emoji-button">
							<span class="emoji">🖩</span>
							<span>Calculator</span>
						</button>
						<button id="settings" class="emoji-button">
							<span class="emoji">⚙️</span>
							<span>Settings</span>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.container {
		display: flex;
		flex-direction: row;
	}

	::-webkit-scrollbar {
		-webkit-appearance: none;
		width: 10px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.5);
		-webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
	}

	.question-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		flex-grow: 1;
	}

	.question-box {
		padding: 2em;
	}

	li input {
		position: absolute;
		margin-left: -40px;
		margin-top: 5px;
	}

	.top-nav {
		background-color: #003163;
		width: 100%;
		height: 80px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.top-nav div {
		flex-grow: 1;
		text-align: center;
		color: #f7f7f7;
	}

	.emoji-button {
		display: flex;
		flex-direction: column;
		width: 100px;
		background: transparent;
		border: none !important;
		cursor: pointer;
		color: white;
		text-align: center;
		font-size: 1em;
	}

	.emoji-button .emoji {
		font-size: 1.5em;
	}

	.top-nav .exam-title {
		flex-grow: 16;
	}

	.nav-group {
		display: flex;
		flex-direction: row;
	}

	.right {
		margin-left: auto;
	}

	.bottom-nav {
		background-color: #003163;
		margin-top: auto;
		width: 100%;
		height: 75px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
</style>