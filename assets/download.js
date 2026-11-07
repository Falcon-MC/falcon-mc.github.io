// Points the download button at the latest release build for the visitor's system and shows the download
// count, from data.json, which the deploy workflow writes from the GitHub API. Without it the button keeps
// linking to the releases page.
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
            const release = data.release;
            if (!platform || !release || !Array.isArray(release.assets))
                return;

            const asset = release.assets.find((candidate) => platform.assets.includes(candidate.name));
            if (!asset)
                return;

            const button = document.getElementById("download");
            button.href = asset.browser_download_url;
            button.textContent = "Download for " + platform.label;
            button.title = release.tag_name;
        })
        .catch(() => {});
})();
