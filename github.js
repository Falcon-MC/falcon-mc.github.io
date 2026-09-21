const API = "https://api.github.com";
const REPOSITORY = "Falcon-MC/Falcon";
const ORGANIZATION = "Falcon-MC";

const PLATFORMS = [
    {id: "download-windows", asset: "FalconServer-windows-x64.exe", label: "Windows"},
    {id: "download-linux", asset: "FalconServer-linux-x64", label: "Linux"}
];

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

function showRelease(release) {
    const checksums = [];

    for (const platform of PLATFORMS) {
        const binary = findAsset(release, platform.asset);
        if (!binary) {
            continue;
        }

        const button = document.getElementById(platform.id);
        button.href = binary.browser_download_url;
        button.textContent = `Download ${release.tag_name} for ${platform.label}`;

        const checksum = findAsset(release, `${platform.asset}.sha256`);
        if (checksum) {
            checksums.push({label: platform.label, href: checksum.browser_download_url});
        }
    }

    const info = document.getElementById("release-info");
    info.textContent = `${release.tag_name}, released ${formatDate(release.published_at)} · SHA-256: `;
    checksums.forEach((checksum, index) => {
        if (index > 0) {
            info.appendChild(document.createTextNode(", "));
        }
        appendLink(info, checksum.label, checksum.href);
    });
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

for (const task of [loadReleases, loadRepository, loadOrganization, loadContributors]) {
    task().catch((error) => console.warn("Could not load GitHub data", error));
}
