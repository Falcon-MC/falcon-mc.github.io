const API = "https://api.github.com";
const REPOSITORY = "Falcon-MC/Falcon";
const ORGANIZATION = "Falcon-MC";

const PLATFORMS = [
    {asset: "FalconServer-windows-x64.exe", label: "Windows"},
    {asset: "FalconServer-linux-x64", label: "Linux"}
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
    return null;
}

async function fetchJson(path) {
    const response = await fetch(API + path, {headers: {Accept: "application/vnd.github+json"}});
    if (!response.ok) {
        throw new Error(`${path} returned ${response.status}`);
    }
    return response.json();
}

function findAsset(release, name) {
    return release.assets.find((asset) => asset.name === name);
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
        const binary = findAsset(release, platform.asset);
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
        const binary = findAsset(release, platform.asset);
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
        checksum = findAsset(release, `${platform.asset}.sha256`);
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

function countDownloads(releases) {
    let total = 0;
    for (const release of releases) {
        for (const asset of release.assets) {
            if (!asset.name.endsWith(".sha256")) {
                total += asset.download_count;
            }
        }
    }
    return total;
}

function setStat(name, value) {
    const element = document.querySelector(`[data-stat="${name}"]`);
    element.textContent = formatCount(value);
    element.closest("li").hidden = false;
}

function showContributors(contributors) {
    const list = document.getElementById("contributors-list");
    for (const contributor of contributors) {
        if (contributor.type !== "User") {
            continue;
        }

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

async function loadReleases() {
    const releases = await fetchJson(`/repos/${REPOSITORY}/releases?per_page=100`);
    const published = releases.filter((release) => !release.draft);
    if (published.length > 0) {
        showRelease(published[0]);
        setStat("downloads", countDownloads(published));
    }
}

async function loadRepository() {
    const repository = await fetchJson(`/repos/${REPOSITORY}`);
    setStat("stars", repository.stargazers_count);
}

async function loadOrganization() {
    const organization = await fetchJson(`/orgs/${ORGANIZATION}`);
    setStat("repositories", organization.public_repos);
}

async function loadContributors() {
    const contributors = await fetchJson(`/repos/${REPOSITORY}/contributors?per_page=100`);
    setStat("contributors", contributors.filter((contributor) => contributor.type === "User").length);
    showContributors(contributors);
}

function labelDownloadButton() {
    const detected = detectPlatform();
    if (detected) {
        document.getElementById("download").textContent = `Download for ${detected}`;
    }
}

labelDownloadButton();

for (const task of [loadReleases, loadRepository, loadOrganization, loadContributors]) {
    task().catch((error) => console.warn("Could not load GitHub data", error));
}
