// Points the download button at the latest release build for the visitor's system and shows the download
// count, from data.json, which the deploy workflow writes from the GitHub API. Without it the button keeps
// linking to the releases page. A nightly, when there is one, is offered from the button's menu after a warning.
(function () {
    const PLATFORMS = [
        {label: "Windows", assets: ["FalconServer.exe", "FalconServer-windows-x64.exe"]},
        {label: "Linux", assets: ["FalconServer-linux-x64"]},
        {label: "macOS", assets: ["FalconServer-macos-arm64"]}
    ];

    function detectPlatform() {
        const hint = navigator.userAgentData ? navigator.userAgentData.platform : "";
        const agent = navigator.userAgent;
        if (hint === "Windows" || /Windows/.test(agent))
            return "Windows";
        if (hint === "macOS" || /Macintosh|Mac OS X/.test(agent))
            return "macOS";
        if (hint === "Linux" || (/Linux/.test(agent) && !/Android/.test(agent)))
            return "Linux";
        return null;
    }

    function setUpNightly(nightly, asset) {
        const toggle = document.getElementById("download-more");
        const menu = document.getElementById("download-menu");
        const link = document.getElementById("download-nightly");
        const dialog = document.getElementById("nightly-confirm");
        const target = asset ? asset.browser_download_url : nightly.html_url;
        link.href = nightly.html_url;
        const built = nightly.updated_at ? new Date(nightly.updated_at) : null;
        document.getElementById("nightly-version").textContent = (nightly.name || "Nightly")
            + (built && !isNaN(built) ? ", built " + built.toISOString().slice(0, 10) : "");
        toggle.hidden = false;

        const close = () => {
            menu.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
        };
        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            menu.hidden = !menu.hidden;
            toggle.setAttribute("aria-expanded", String(!menu.hidden));
            if (!menu.hidden)
                menu.querySelector("a").focus();
        });
        document.addEventListener("click", (event) => {
            if (!menu.hidden && !menu.contains(event.target))
                close();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !menu.hidden) {
                close();
                toggle.focus();
            }
        });

        // a browser without <dialog> still asks before an unstable download
        link.addEventListener("click", (event) => {
            event.preventDefault();
            close();
            if (typeof dialog.showModal !== "function") {
                if (window.confirm("A nightly is a development build and may be unstable. Download it anyway?"))
                    window.location.href = target;
                return;
            }
            dialog.returnValue = "";
            dialog.showModal();
        });
        dialog.addEventListener("close", () => {
            if (dialog.returnValue === "download")
                window.location.href = target;
        });
    }

    fetch("data.json", {cache: "no-cache"})
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
            if (!data)
                return;

            if (typeof data.downloads === "number" && data.downloads > 0) {
                const item = document.getElementById("downloads");
                item.querySelector("b").textContent = data.downloads.toLocaleString("en-US");
                item.hidden = false;
            }

            const platform = PLATFORMS.find((entry) => entry.label === detectPlatform());
            const assetFor = (build) => !platform || !build || !Array.isArray(build.assets) ? null
                : build.assets.find((candidate) => platform.assets.includes(candidate.name));

            const release = data.release;
            const asset = assetFor(release);
            if (asset) {
                const button = document.getElementById("download");
                button.href = asset.browser_download_url;
                button.textContent = "Download for " + platform.label;
                button.title = release.tag_name;
                document.getElementById("download-release").href = asset.browser_download_url;
            }

            // the nightly sits behind a menu and a warning, never on the main button
            const nightly = data.nightly;
            if (nightly && Array.isArray(nightly.assets) && nightly.assets.length)
                setUpNightly(nightly, assetFor(nightly));
        })
        .catch(() => {});
})();
