document.addEventListener("DOMContentLoaded", () => {
    const mainCont = document.getElementById("mainCont");
    const buttonCont = document.getElementById("buttonCont");
    const resultList = document.getElementById("result");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        if (tab.url === undefined || tab.url.indexOf("chrome") == 0) {
            buttonCont.innerHTML =
                '<span style="font-family: lobster, sans-serif">Crazy Colors</span> is not available Chrome pages';
        } else if (tab.url.indexOf("file") === 0) {
            buttonCont.innerHTML =
                '<span style="font-family: lobster, sans-serif">Crazy Colors</span> is not available local pages';
        } else {
            const button = document.createElement("button");
            button.setAttribute("id", "pickerButton");
            button.innerText = "Select a Color";
            buttonCont.appendChild(button);

            button.addEventListener("click", () => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    from: "popup",
                    query: "eye_dropper_clicked",
                });
                window.close();
            });
        }
    });

    chrome.storage.local.get("colorHex", (resp) => {
        if (resp.colorHex && resp.colorHex.length > 0) {
            resp.colorHex.forEach((hexCode) => {
                const liElem = document.createElement("li");
                liElem.innerText = hexCode;
                liElem.style.backgroundColor = hexCode;

                liElem.addEventListener("click", () => {
                    navigator.clipboard.writeText(hexCode);
                    const spanEl = document.createElement("span");
                    spanEl.setAttribute("id", "copy");
                    spanEl.innerText = "Copied to clipboard!";
                    mainCont.appendChild(spanEl);
                    setTimeout(() => window.close(), 1000);
                });

                resultList.appendChild(liElem);
            });

            const savedTitle = document.getElementById("savedTitle");
            savedTitle.innerText = "Saved colors:";

            const clearButton = document.createElement("button");
            clearButton.innerText = "Delete All";
            clearButton.setAttribute("id", "clearButton");

            clearButton.addEventListener("click", () => {
                chrome.storage.local.remove("colorHex");
                window.close();
            });

            mainCont.appendChild(clearButton);
        }
    });
});
