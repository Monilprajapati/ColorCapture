const btn = document.querySelector('.pickColorBtn');
const colorBox = document.querySelector('.colorBox');
const colorCode = document.querySelector('.colorCode');

btn.addEventListener('click', async () => {
    chrome.storage.sync.get('color', ({ color }) => {
        console.log('picked color: ', color);
    });
    // Get active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Execute script
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: pickColor,
        },
        async (injectionResults) => {
            const [data] = injectionResults;
            if (data.result) {
                const color = data.result.sRGBHex;
                colorBox.style.backgroundColor = color;
                colorCode.innerText = color;
                try {
                    await navigator.clipboard.writeText(color);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    );
});

async function pickColor() {
    try {
        // Picker
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    } catch (err) {
        console.error(err);
    }
}