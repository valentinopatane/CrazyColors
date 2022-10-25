chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.query === "eye_dropper_clicked") {
        setTimeout(() => {
            const eyeDropper = new EyeDropper();
            eyeDropper.open().then((result) => {
                chrome.storage.local.get("colorHex", (response) => {
                    if (response.colorHex && response.colorHex.length > 0) {
                        chrome.storage.local.set({
                            colorHex: [...response.colorHex, result.sRGBHex],
                        });
                    } else {
                        chrome.storage.local.set({
                            colorHex: [result.sRGBHex],
                        });
                    }
                });
            });
        }, 500);
    }
});
