function convertStringToASL(textString) {
    let charArray = Array.from(textString.toUpperCase());
    let charCodeHTML = ''
    let part1 = "<img class='ASL-letter' src='https://www.dcode.fr/tools/sign-language-american/images/char(";
    let part2 = ").png' alt='";
    let part3 = "' title='";
    let part4 = "'>"
    charArray.forEach((char) => {
        let charCode = char.charCodeAt(0);
        if (charCode == 32) {
            charCodeHTML += "&nbsp;&nbsp;&nbsp;"
        } else {
            charCodeHTML += part1 + charCode + part2 + char + part3 + char + part4;
        }
    })
    return charCodeHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const startRecordingButton = document.querySelector('#startRecording');
    const stopRecordingButton = document.querySelector('#stopRecording');

    const textResultDiv = document.querySelector('#resultText');
    const totalTextResultDiv = document.querySelector('#resultTextTot');
    const symbolResultDiv = document.querySelector('#resultSymbol');
    const totalSymbolResultDiv = document.querySelector('#resultSymbolTot');
    const instructions = document.querySelector('#instructions');

    let recognition;

    stopRecordingButton.disabled = true;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let totalTranscript;
        let totalSymbolScript;

        recognition.onstart = () => {
            stopRecordingButton.disabled = false;
            instructions.textContent = "Voice Recognition is On!"
            console.log('Speech recognition started');
            totalTranscript = '';
            totalSymbolScript = '';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            textResultDiv.textContent = finalTranscript || interimTranscript;
            symbolResultDiv.innerHTML = convertStringToASL(finalTranscript || interimTranscript);
            totalTranscript += finalTranscript;
            totalSymbolScript += convertStringToASL(finalTranscript);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            instructions.textContent = "Speech recognition has ended!"
            startRecordingButton.disabled = false;
            stopRecordingButton.disabled = true;
            totalTextResultDiv.textContent = totalTranscript;
            totalSymbolResultDiv.innerHTML = totalSymbolScript;
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            instructions.textContent = 'Speech recognition error:' + event.error;
            startRecordingButton.disabled = false;
        };

        startRecordingButton.addEventListener('click', () => {
            startRecordingButton.disabled = true;
            recognition.start();
        });

        stopRecordingButton.addEventListener('click', () => {
            recognition.stop();
        });
    } else {
        instructions.textContent = 'Web Speech API is not supported in this browser.';
        startRecordingButton.disabled = true;
    }
});