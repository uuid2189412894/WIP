window.onload = function () {
    const intro = document.getElementById('intro');
    const question = document.getElementById('question');
    const mainContent = document.getElementById('main-content');
    const prompt = document.getElementById('prompt');
    const userInput = document.getElementById('user-input');
    const dimension = document.getElementById('dimension');
    const accessGranted = document.getElementById('access-granted');
    const dataLog = document.getElementById('data-log');
    const information = document.getElementById('information');
    const bulletinBoard = document.getElementById('bulletin-board');
    const closeLogBtn = document.getElementById('close-log');
    const minimizedLog = document.getElementById('minimized-log');
    const openLogBtn = document.getElementById('open-log-btn');
    const muteToggle = document.getElementById('mute-toggle');
    const muteBtn = document.getElementById('mute-btn');
    const audio = document.getElementById('audio');
    const waveform = document.getElementById('waveform');
    
    let questionsAnswered = localStorage.getItem('questionsAnswered');
    let isMuted = false;

    // If answers are already stored, show the "Access Granted" screen
    if (questionsAnswered === 'true') {
        showAccessGranted();
    } else {
        // Normal flow for asking questions
        showIntroAndQuestions();
    }

    function showIntroAndQuestions() {
        // Fade out the question "Are you real?"
        setTimeout(() => {
            question.style.opacity = 0;
            setTimeout(() => {
                intro.style.display = 'none';
                mainContent.style.display = 'block'; // Show main content after intro fades
            }, 2000);
        }, 4000); // Show question for 4 seconds before transition

        // Questions for the command line interface
        const questions = [
            "What is reality?",
            "Where do you see the future heading?",
            "What is your opinion on the AI revolution?"
        ];
        let currentQuestion = 0;

        function askQuestion() {
            if (currentQuestion < questions.length) {
                prompt.textContent = questions[currentQuestion];
                userInput.value = '';
                userInput.placeholder = 'Type your answer...';
            }
        }

        function finalAction() {
            // Mark questions as answered in localStorage
            localStorage.setItem('questionsAnswered', 'true');
            showAccessGranted();  // Show the Access Granted screen after answering all questions
        }

        // Listen for the user's answer to display the next question
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    askQuestion();
                } else {
                    finalAction();  // Trigger final action after last question
                }
            }
        });

        // Start asking the first question
        askQuestion();
    }

    function showAccessGranted() {
        accessGranted.style.display = 'flex';
        setTimeout(() => {
            accessGranted.style.display = 'none';
            dimension.style.display = 'flex'; // Transition to the next phase
            muteToggle.style.display = 'block';  // Show mute button
            audio.play(); // Play the audio when the WORLDIF photo loads
            visualizeAudio(); // Start the waveform animation
        }, 3000); // Show access granted for 3 seconds
    }

    // Close and minimize the data log
    closeLogBtn.addEventListener('click', function () {
        bulletinBoard.style.display = 'none';
        minimizedLog.style.display = 'block';
    });

    // Reopen the data log
    openLogBtn.addEventListener('click', function () {
        minimizedLog.style.display = 'none';
        bulletinBoard.style.display = 'flex';
        bulletinBoard.style.opacity = 1;
    });

    // Mute/Unmute audio
    muteBtn.addEventListener('click', function () {
        if (isMuted) {
            audio.muted = false;
            muteBtn.textContent = '🔊';
        } else {
            audio.muted = true;
            muteBtn.textContent = '🔇';
        }
        isMuted = !isMuted;
    });

    // Audio visualization
    function visualizeAudio() {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = document.getElementById('waveform');
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        function drawWaveform() {
            requestAnimationFrame(drawWaveform);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = '#00ffff';

            canvasCtx.beginPath();
            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }

        drawWaveform();
    }
};
