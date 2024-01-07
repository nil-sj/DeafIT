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
    const transResultDiv = document.querySelector('#resultTextTrans');
    const totalTransResultDiv = document.querySelector('#resultTextTransTot');
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
            let intText = convertStringToASL(finalTranscript || interimTranscript);
            symbolResultDiv.innerHTML = intText;
            let langInput = document.querySelector('#translatedLang').value;
            let transText = '';

            // (async () => {
            //     let res = await fetch(`/cors-proxy/https://665.uncovernet.workers.dev/translate?text={intText}&source_lang=en&target_lang={langInput}`, {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            //     });
            //     transText = await res.json();
            //     console.log(transText);
            //     transResultDiv.innerHTML = transText;    
            // })();

            const apiUrl = 'https://665.uncovernet.workers.dev/translate?text=hello&source_lang=en&target_lang=hi';
            const data = {
            // name: 'John Doe',
            // email: 'johndoe@example.com',
            };

            const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            };

            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                transResultDiv.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error

            ('Error:', error);
            });
            
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
