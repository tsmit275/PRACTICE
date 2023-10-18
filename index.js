document.addEventListener('DOMContentLoaded', function () {
    // Select the question container
    const questionContainer = document.querySelector('.container')
    // Create an array to store questions and answers
    const questionsAndAnswers = []

    const question1 = {
        question: "What is the ideal destination for a fashionista looking to attend a major international fashion week event?",
        answers: ["Paris, France", "Atlanta, Georgia", "New York, New York", "Newark, New Jersey"],
        correctAnswer: "Paris, France"
    };
    questionsAndAnswers.push(question1)

    const question2 = {
        question: "What has 4 wheels, a handle, and can easily carry all of your 'It girl' travel essentials?",
        answers: ["The 'Kelly' Makeup bag", "The 'Airport Baddie' Suitcase", "'Ms. Independent' Duffle bag"],
        correctAnswer: "The 'Airport Baddie' Suitcase"
    };
    questionsAndAnswers.push(question2)

    const question3 = {
        question: "In which city can you find the famous Rodeo Drive shopping district?",
        answers: ["Orlando, Florida", "Los Angeles, California", "Toronto, Canada", "Charlotte, North Carolina"],
        correctAnswer: "Los Angeles, California"
    };
    questionsAndAnswers.push(question3)

    const question4 = {
        question: "How does an 'It Girl' best prepare for her trip?",
        answers: ["Shop at 'It Girl' Essentials", "Doesn't pack anything and borrows friend stuff"],
        correctAnswer: "Shop at 'It Girl' Essentials"
    };

    const scoreElement = document.getElementById('correct-answers')
    let correctAnswers = 0;

    const betContainer = document.querySelector('.bet-container')
    const betButtons = betContainer.querySelectorAll('.bet-button')
    let hasBet = false

    function handleBetting() {
        betButtons.forEach((button) => {
            button.addEventListener('click', () => {
                if (button.textContent === 'Yes' && !hasBet) {
                    hasBet = true
                    betContainer.style.display = 'none'
                    askQuestion4()
                } else if (button.textContent === 'No' || hasBet) {
                    hasBet = true
                    feedbackElement.textContent = "Congratulations, You've received a 30% discount!";
                    feedbackElement.style.color = "green"
                    feedbackElement.style.display = "block"
                    setTimeout(() => {
                        feedbackElement.style.display = 'none'
                        proceedToNextQuestion()
                    }, 1000)
                }
            })
        })
    }

    function proceedToNextQuestion() {
        if (hasBet || correctAnswers <= 0) {
            feedbackElement.style.color = "green"
            feedbackElement.style.display = "block"
        } else {
            askQuestions()
        }
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        return new Promise((resolve, reject) => {
            if (selectedAnswer === correctAnswer) {
                feedbackElement.textContent = "That is correct"
                feedbackElement.style.color = "green"
                feedbackElement.style.display = "block"
                correctAnswers++;
                scoreElement.textContent = ` ${correctAnswers}`
                setTimeout(() => {
                    feedbackElement.style.display = 'none'
                    resolve()
                }, 1000)
            } else {
                feedbackElement.textContent = "That is incorrect, please try again"
                feedbackElement.style.color = "red"
                feedbackElement.style.display = "block"
                reject("Incorrect answer")
            }
        })
    }

    const feedbackElement = document.getElementById('feedback')

    async function askQuestions() {
        for (let i = 0; i < questionsAndAnswers.length; i++) {
            const currentQuestion = questionsAndAnswers[i]
            feedbackElement.style.display = 'none'
            let attempts = 0

            while (attempts < 3) {
                loadQuestion(currentQuestion)
                const selectedAnswer = await waitForAnswer()
                try {
                    await checkAnswer(selectedAnswer, currentQuestion.correctAnswer)
                    break;
                } catch (error) {
                    attempts++
                }
            }

            if (i === 2 && !hasBet) {
                // Show the betting container after the third question if the user hasn't bet yet
                betContainer.style.display = 'block'
            }
        }

        if (hasBet || correctAnswers <= 0) {
            feedbackElement.style.color = "green"
            feedbackElement.style.display = "block"
        }
    }

    function loadQuestion(questionData) {
        questionContainer.querySelector('h3').textContent = questionData.question
        const answerButtonsContainer = questionContainer.querySelector('.answers')
        answerButtonsContainer.innerHTML = ""

        questionData.answers.forEach((answer, index) => {
            const button = document.createElement('button')
            button.textContent = answer
            button.classList.add('btn', 'btn-primary')
            answerButtonsContainer.appendChild(button)
        })
    }

    async function askQuestion4() {
        loadQuestion(question4)
        const selectedAnswer = await waitForAnswer()
        try {
            await checkAnswer(selectedAnswer, question4.correctAnswer)
            correctAnswers = Math.floor(correctAnswers * 0.5) // Applies a 50% discount
            scoreElement.textContent = ` ${correctAnswers}`
            feedbackElement.textContent = "Congratulations! You've received a 50% off discount!"
            feedbackElement.style.color = "green"
            feedbackElement.style.display = "block"
            
            setTimeout(() => {
                feedbackElement.style.display = 'none'
                proceedToNextQuestion()
            }, 1000)
        } catch (error) {
            // Handles incorrect answer for question 4 (if needed)
            feedbackElement.textContent = "That is incorrect, please try again"
            feedbackElement.style.color = "red"
            feedbackElement.style.display = "block"
            proceedToNextQuestion()
        }
    }

    function waitForAnswer() {
        return new Promise((resolve) => {
            const answerButtons = questionContainer.querySelectorAll('.btn.btn-primary')
            answerButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    resolve(button.textContent)
                })
            })
        })
    }

    // Starts the quiz with the first question
    askQuestions()

    // Handle betting options
    handleBetting()
})

