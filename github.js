const REPOSITORY = "Falcon-MC/Falcon";
const DATA_SOURCE = "data.json";

const PLATFORMS = [
    {assets: ["FalconServer.exe", "FalconServer-windows-x64.exe"], label: "Windows"},
    {assets: ["FalconServer-linux-x64"], label: "Linux"},
    {assets: ["FalconServer-macos-arm64"], label: "macOS"}
];

function detectPlatform() {
    const platform = navigator.userAgentData ? navigator.userAgentData.platform : "";
    const agent = navigator.userAgent;

    if (platform === "Windows" || /Windows/.test(agent)) {
        return "Windows";
    }
    if (platform === "Linux" || (/Linux/.test(agent) && !/Android/.test(agent))) {
        return "Linux";
    }
    if (platform === "macOS" || /Macintosh/.test(agent)) {
        return "macOS";
    }
    return null;
}

async function fetchData() {
    const response = await fetch(DATA_SOURCE, {cache: "no-cache"});
    if (!response.ok) {
        throw new Error(`${DATA_SOURCE} returned ${response.status}`);
    }
    return response.json();
}

function findAsset(release, names) {
    for (const name of names) {
        const asset = release.assets.find((candidate) => candidate.name === name);
        if (asset) {
            return asset;
        }
    }
    return undefined;
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
}

function formatCount(value) {
    return new Intl.NumberFormat("en-US", {notation: "compact", maximumFractionDigits: 1}).format(value);
}

function appendLink(parent, text, href) {
    const link = document.createElement("a");
    link.textContent = text;
    link.href = href;
    parent.appendChild(link);
}

function showDownloadMenu(release) {
    const options = document.getElementById("download-options");
    for (const platform of PLATFORMS) {
        const binary = findAsset(release, platform.assets);
        if (binary) {
            appendLink(options, `${platform.label} (${release.tag_name})`, binary.browser_download_url);
        }
    }

    if (options.children.length > 0) {
        document.getElementById("download").hidden = true;
        document.getElementById("download-menu").hidden = false;
    }
}

function showRelease(release) {
    const detected = detectPlatform();
    const others = [];
    let checksum = null;

    if (!detected) {
        showDownloadMenu(release);
    }

    for (const platform of PLATFORMS) {
        const binary = findAsset(release, platform.assets);
        if (!binary) {
            continue;
        }

        if (platform.label !== detected) {
            others.push({label: platform.label, href: binary.browser_download_url});
            continue;
        }

        const button = document.getElementById("download");
        button.href = binary.browser_download_url;
        button.textContent = `Download ${release.tag_name} for ${platform.label}`;
        checksum = findAsset(release, [`${binary.name}.sha256`]);
    }

    const info = document.getElementById("release-info");
    info.textContent = `${release.tag_name}, released ${formatDate(release.published_at)}`;
    if (checksum) {
        info.appendChild(document.createTextNode(" · "));
        appendLink(info, "SHA-256", checksum.browser_download_url);
    }
    if (checksum && others.length > 0) {
        info.appendChild(document.createTextNode(" · Other platforms: "));
        others.forEach((other, index) => {
            if (index > 0) {
                info.appendChild(document.createTextNode(", "));
            }
            appendLink(info, other.label, other.href);
        });
    }
    info.appendChild(document.createTextNode(" · "));
    appendLink(info, "Release notes", release.html_url);
    info.hidden = false;
}

function formatRelativeDate(value) {
    const days = Math.round((Date.now() - new Date(value).getTime()) / 86400000);
    const format = new Intl.RelativeTimeFormat("en-US", {numeric: "auto"});
    if (days < 30) {
        return format.format(-days, "day");
    }
    if (days < 365) {
        return format.format(-Math.round(days / 30), "month");
    }
    return format.format(-Math.round(days / 365), "year");
}

function setStat(name, value) {
    const element = document.querySelector(`[data-stat="${name}"]`);
    element.textContent = formatCount(value);
    element.classList.remove("skeleton");
}

function clearPendingStats() {
    for (const element of document.querySelectorAll("[data-stat].skeleton")) {
        element.textContent = "-";
        element.classList.remove("skeleton");
    }
}

function showContributors(contributors) {
    const list = document.getElementById("contributors-list");
    for (const contributor of contributors) {
        const link = document.createElement("a");
        link.href = contributor.html_url;
        link.title = `${contributor.login} (${contributor.contributions} commits)`;

        const avatar = document.createElement("img");
        avatar.src = `${contributor.avatar_url}&s=96`;
        avatar.alt = contributor.login;
        avatar.width = 48;
        avatar.height = 48;
        avatar.loading = "lazy";

        link.appendChild(avatar);
        list.appendChild(link);
    }
    document.getElementById("contributors").hidden = list.children.length === 0;
}

function showVersion(version) {
    if (version.game) {
        document.getElementById("game-version").textContent = `Bedrock ${version.game}`;
    }
    if (version.protocol) {
        document.getElementById("protocol-version").textContent = `Protocol ${version.protocol}`;
    }
}

function showRepositories(repositories) {
    for (const repository of repositories) {
        if (repository.full_name === REPOSITORY) {
            setStat("stars", repository.stargazers_count);
        }

        const link = document.querySelector(`[data-repo="${repository.name}"]`);
        if (!link) {
            continue;
        }

        link.querySelector(".repo-meta").textContent =
            `★ ${formatCount(repository.stargazers_count)} · ${formatRelativeDate(repository.pushed_at)}`;
    }
}

async function loadData() {
    const data = await fetchData();

    showVersion(data.version);
    showRepositories(data.repositories);
    showContributors(data.contributors);
    setStat("contributors", data.contributors.length);
    setStat("downloads", data.downloads);

    if (data.release) {
        showRelease(data.release);
    }
}

function labelDownloadButton() {
    const detected = detectPlatform();
    if (detected) {
        document.getElementById("download").textContent = `Download for ${detected}`;
    }
}

const TERMINAL_LINES = [
    {prompt: "$ ", text: "./FalconServer"},
    {level: "INFO", text: "Starting Server"},
    {level: "INFO", text: "Version: 1.26.51.01"},
    {level: "INFO", text: "Level Name: Bedrock level"},
    {level: "INFO", text: "Game mode: 0 Survival"},
    {level: "INFO", text: "Difficulty: 1 EASY"},
    {level: "INFO", text: "Opening level 'worlds/Bedrock level/db'"},
    {level: "INFO", text: "IPv4 supported, port: 19132: Used for gameplay"},
    {level: "INFO", text: "Server started."},
    {level: "INFO", text: "RakNet transport is active."}
];

function logTimestamp() {
    const now = new Date();
    const pad = (value, length = 2) => String(value).padStart(length, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} `
        + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(now.getMilliseconds(), 3)}`;
}

const RELEASES_URL = "https://github.com/Falcon-MC/Falcon/releases";

function appendTerminalLine(output, line) {
    const row = document.createElement("div");
    const tag = document.createElement("span");
    if (line.prompt) {
        tag.className = "prompt";
        tag.textContent = line.prompt;
    } else {
        tag.className = "level";
        tag.textContent = `[${logTimestamp()} ${line.level}] `;
    }
    row.appendChild(tag);
    row.appendChild(document.createTextNode(line.text));
    output.appendChild(row);
}

function answerCommand(output, command) {
    const echo = document.createElement("div");
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "> ";
    echo.appendChild(prompt);
    echo.appendChild(document.createTextNode(command));
    output.appendChild(echo);

    const answer = document.createElement("div");
    const level = document.createElement("span");
    level.className = "warn";
    level.textContent = `[${logTimestamp()} WARN] `;
    answer.appendChild(level);
    answer.appendChild(document.createTextNode("This is only a preview. "));
    appendLink(answer, "Download Falcon", document.getElementById("download").href || RELEASES_URL);
    answer.appendChild(document.createTextNode(" to run commands on your own server."));
    output.appendChild(answer);
}

function openConsole() {
    const body = document.getElementById("terminal-body");
    const output = document.getElementById("terminal-output");
    const form = document.getElementById("terminal-form");
    const input = document.getElementById("terminal-input");

    form.hidden = false;
    body.addEventListener("click", (event) => {
        if (!event.target.closest("a")) {
            input.focus({preventScroll: true});
        }
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const command = input.value.trim();
        if (command.length === 0) {
            return;
        }

        answerCommand(output, command);
        input.value = "";
        body.scrollTop = body.scrollHeight;
    });
}

function playTerminal() {
    const output = document.getElementById("terminal-output");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        TERMINAL_LINES.forEach((line) => appendTerminalLine(output, line));
        openConsole();
        return;
    }

    let index = 0;
    const step = () => {
        if (index < TERMINAL_LINES.length) {
            appendTerminalLine(output, TERMINAL_LINES[index]);
            index++;
            setTimeout(step, index === 1 ? 700 : 260 + Math.random() * 280);
            return;
        }
        openConsole();
    };
    step();
}

function setupTerminalWindow() {
    const terminal = document.getElementById("terminal");
    const reopen = document.getElementById("terminal-reopen");

    document.getElementById("terminal-close").addEventListener("click", () => {
        if (document.fullscreenElement === terminal) {
            document.exitFullscreen();
        }
        terminal.classList.remove("zoomed", "minimized");
        terminal.hidden = true;
        reopen.hidden = false;
        reopen.focus();
    });

    reopen.addEventListener("click", () => {
        reopen.hidden = true;
        terminal.hidden = false;
        document.getElementById("terminal-input").focus({preventScroll: true});
    });

    document.getElementById("terminal-minimize").addEventListener("click", () => {
        if (document.fullscreenElement === terminal) {
            document.exitFullscreen();
        }
        terminal.classList.remove("zoomed");
        terminal.classList.toggle("minimized");
    });

    document.getElementById("terminal-zoom").addEventListener("click", () => {
        terminal.classList.remove("minimized");
        if (document.fullscreenEnabled) {
            if (document.fullscreenElement === terminal) {
                document.exitFullscreen();
            } else {
                terminal.requestFullscreen();
            }
            return;
        }
        terminal.classList.toggle("zoomed");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            terminal.classList.remove("zoomed");
        }
    });
}

labelDownloadButton();
setupTerminalWindow();
playTerminal();

loadData()
    .catch((error) => console.warn("Could not load site data", error))
    .finally(clearPendingStats);
