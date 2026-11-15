// the plugin store pages. Everything shown comes from the API as text: nothing it returns is read as HTML
(function () {
  "use strict";
  var API = /(^|\.)falcon-mc\.com$/.test(location.hostname) ? "https://api.falcon-mc.com" : "http://localhost:8787";
  var RUNTIMES = { wasm: "Wasm", native: "Native", java: "Java", internal: "Internal", dotnet: ".NET" };
  var page = document.body.getAttribute("data-page");

  function $(selector) { return document.querySelector("[data-" + selector + "]"); }

  function el(tag, props) {
    var node = document.createElement(tag);
    for (var key in props || {}) {
      if (key === "text") node.textContent = props[key];
      else if (key === "class") node.className = props[key];
      else if (key.slice(0, 2) === "on") node.addEventListener(key.slice(2), props[key]);
      else node.setAttribute(key, props[key]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined || child === false) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function api(path, body) {
    var init = { credentials: "include" };
    if (body !== undefined) {
      init.method = "POST";
      init.headers = { "content-type": "application/json" };
      init.body = JSON.stringify(body);
    }
    return fetch(API + path, init).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) throw new Error(data.error || "the store did not answer (" + response.status + ")");
        return data;
      });
    });
  }

  function say(target, text) { if (target) target.textContent = text; }
  function plural(count, word) { return count + " " + word + (count === 1 ? "" : "s"); }
  function size(bytes) { return bytes < 1024 * 1024 ? Math.max(1, Math.round(bytes / 1024)) + " KB" : (bytes / 1048576).toFixed(1) + " MB"; }
  function day(value) {
    var date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
    return isNaN(date) ? "" : date.toISOString().slice(0, 10);
  }
  function safeImage(url) { return /^https:\/\/avatars\.githubusercontent\.com\//.test(url || "") ? url : ""; }
  function slugLink(slug) { return "plugin.html?slug=" + encodeURIComponent(slug); }
  function runtimeBadge(runtime) {
    return el("span", { class: "badge" + (runtime === "wasm" ? " sandboxed" : ""), text: runtime === "wasm" ? "Wasm · sandboxed" : (RUNTIMES[runtime] || runtime) });
  }
  function statusBadge(status) { return el("span", { class: "badge state-" + status, text: status }); }

  function loginUrl() { return API + "/v1/auth/login?return=" + encodeURIComponent(location.pathname + location.search); }

  function account(me) {
    var box = $("account");
    if (!box) return;
    box.textContent = "";
    if (!me) {
      box.appendChild(el("a", { class: "button primary", href: loginUrl() }, "Sign in with GitHub"));
      return;
    }
    var avatar = safeImage(me.avatar);
    box.appendChild(el("span", { class: "who" }, avatar ? el("img", { class: "avatar", src: avatar, alt: "" }) : null, me.login));
    box.appendChild(el("a", { class: "button", href: "publish.html" }, "Your plugins"));
    if (me.admin) box.appendChild(el("a", { class: "button", href: "admin.html" }, "Administration"));
    box.appendChild(el("button", { class: "button", type: "button", onclick: function () {
      api("/v1/auth/logout", {}).then(function () { location.reload(); });
    } }, "Sign out"));
  }

  function card(plugin) {
    var avatar = safeImage(plugin.avatar);
    return el("li", { class: "card" },
      el("a", { class: "card-link", href: slugLink(plugin.slug) },
        el("div", { class: "card-top" }, avatar ? el("img", { class: "avatar", src: avatar, alt: "" }) : null,
          el("strong", { text: plugin.name }), plugin.latest ? el("span", { class: "version", text: plugin.latest }) : null),
        el("p", { text: plugin.summary || "No description" }),
        el("div", { class: "card-meta" }, runtimeBadge(plugin.runtime),
          el("span", { text: "by " + plugin.author }), el("span", { text: plural(plugin.downloads, "download") }))));
  }

  function list() {
    var form = $("filters");
    var params = new URLSearchParams(location.search);
    form.q.value = params.get("q") || "";
    form.runtime.value = params.get("runtime") || "";
    var timer;
    function load() {
      var query = new URLSearchParams();
      if (form.q.value.trim()) query.set("q", form.q.value.trim());
      if (form.runtime.value) query.set("runtime", form.runtime.value);
      history.replaceState(null, "", query.toString() ? "?" + query : location.pathname);
      api("/v1/store/plugins?" + query).then(function (data) {
        var target = $("list");
        target.textContent = "";
        data.plugins.forEach(function (plugin) { target.appendChild(card(plugin)); });
        say($("status"), data.plugins.length ? plural(data.plugins.length, "plugin") : "No plugin matches.");
      }).catch(function (error) { say($("status"), "Could not load the plugins: " + error.message); });
    }
    form.addEventListener("submit", function (event) { event.preventDefault(); load(); });
    form.q.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(load, 250); });
    form.runtime.addEventListener("change", load);
    load();
  }

  function plugin(me) {
    var slug = new URLSearchParams(location.search).get("slug") || "";
    api("/v1/store/plugins/" + encodeURIComponent(slug)).then(function (data) {
      var info = data.plugin;
      document.title = info.name + " - Falcon plugins";
      $("name").textContent = info.name;
      $("summary").textContent = info.summary;
      var avatar = safeImage(info.avatar);
      if (avatar) $("avatar").src = avatar; else $("avatar").remove();
      var meta = $("meta");
      meta.append(runtimeBadge(info.runtime), el("span", { text: "by " + info.author }), el("span", { text: info.license }),
        el("span", { text: plural(info.stars, "star") }), el("span", { text: plural(info.downloads, "download") }));
      var latest = data.versions[0];
      var actions = $("actions");
      if (latest) actions.appendChild(el("a", { class: "button primary", href: API + "/v1/store/download/" + encodeURIComponent(info.slug) + "/" + encodeURIComponent(latest.tag) }, "Download " + latest.version));
      actions.appendChild(el("a", { class: "button", href: "https://github.com/" + info.repo }, "Source on GitHub"));
      var rows = $("versions");
      data.versions.forEach(function (version) {
        rows.appendChild(el("tr", null,
          el("td", null, el("a", { href: API + "/v1/store/download/" + encodeURIComponent(info.slug) + "/" + encodeURIComponent(version.tag), text: version.version || version.tag })),
          el("td", { text: day(version.published) }),
          el("td", null, el("code", { text: version.file }), " " + size(version.size)),
          el("td", null, el("code", { class: "hash", text: version.sha256 })),
          el("td", { text: String(version.downloads) })));
      });
      if (!data.versions.length) rows.appendChild(el("tr", null, el("td", { colspan: "5", text: "No version is listed yet." })));
      var report = $("report");
      report.hidden = false;
      if (!me) report.querySelector("form").replaceWith(el("p", null, el("a", { href: loginUrl() }, "Sign in"), " to report this plugin."));
      else $("report-form").addEventListener("submit", function (event) {
        event.preventDefault();
        api("/v1/store/plugins/" + encodeURIComponent(info.slug) + "/report", { reason: event.target.reason.value })
          .then(function () { say($("report-status"), "Thanks, the administrators will look at it."); event.target.reset(); })
          .catch(function (error) { say($("report-status"), error.message); });
      });
      $("status").remove();
      $("plugin").hidden = false;
    }).catch(function () { say($("status"), "This plugin is not in the store."); });
  }

  function versionLine(version, extra) {
    return el("li", { class: "version-line" }, el("strong", { text: version.version || version.tag }), el("code", { text: version.tag }),
      runtimeBadge(version.runtime), statusBadge(version.status), el("span", { class: "muted", text: version.file + " · " + size(version.size) }),
      version.note ? el("span", { class: "note-inline", text: version.note }) : null, extra || null);
  }

  function publish(me) {
    if (!me) { $("signed-out").hidden = false; return; }
    $("signed-in").hidden = false;
    function load() {
      api("/v1/store/mine").then(function (data) {
        var target = $("mine");
        target.textContent = "";
        data.plugins.forEach(function (item) {
          var syncStatus = el("span", { class: "muted", role: "status" });
          var versions = el("ul", { class: "versions" });
          item.versions.forEach(function (version) { versions.appendChild(versionLine(version)); });
          if (!item.versions.length) versions.appendChild(el("li", { class: "muted", text: "No release with a usable file yet." }));
          target.appendChild(el("section", { class: "panel" },
            el("div", { class: "panel-head" }, el("strong", { text: item.name }), statusBadge(item.status), runtimeBadge(item.runtime),
              el("a", { href: "https://github.com/" + item.repo, text: item.repo }),
              item.status === "approved" ? el("a", { href: slugLink(item.slug), text: "Store page" }) : null),
            item.note ? el("p", { class: "note-inline", text: "Review note: " + item.note }) : null,
            versions,
            item.status !== "removed" ? el("div", { class: "row" }, el("button", { class: "button", type: "button", onclick: function () {
              say(syncStatus, "Reading the releases…");
              api("/v1/store/plugins/" + encodeURIComponent(item.slug) + "/sync", {}).then(function (result) {
                say(syncStatus, plural(result.versions, "new version") + " found.");
                load();
              }).catch(function (error) { say(syncStatus, error.message); });
            } }, "Check for new releases"), syncStatus) : null));
        });
        say($("status"), data.plugins.length ? "" : "You have not published a plugin yet.");
      }).catch(function (error) { say($("status"), error.message); });
    }
    $("submit").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      say($("submit-status"), "Reading the repository…");
      api("/v1/store/plugins", { repo: form.repo.value.trim() }).then(function (result) {
        say($("submit-status"), "Submitted with " + plural(result.versions, "version") + ". An administrator will read it.");
        form.reset();
        load();
      }).catch(function (error) { say($("submit-status"), error.message); });
    });
    load();
  }

  function decision(path, actions) {
    var note = el("input", { class: "note-field", placeholder: "Note for the author (optional)", maxlength: "500" });
    var status = el("span", { class: "muted", role: "status" });
    var row = el("div", { class: "row" }, note);
    actions.forEach(function (action) {
      row.appendChild(el("button", { class: "button" + (action[0] === "approve" ? " primary" : action[0] === "resolve" ? "" : " danger"), type: "button", onclick: function () {
        if (action[0] !== "approve" && action[0] !== "resolve" && !confirm(action[1] + "?")) return;
        api(action[2] || path, { action: action[0], note: note.value }).then(function () { admin(); }).catch(function (error) { say(status, error.message); });
      } }, action[1]));
    });
    row.appendChild(status);
    return row;
  }

  function admin() {
    api("/v1/store/admin/queue").then(function (data) {
      $("status").textContent = "Signed in as " + data.admin + ", administrator of Falcon-MC.";
      $("admin").hidden = false;
      var plugins = $("plugins"), versions = $("versions"), reports = $("reports"), audit = $("audit");
      [plugins, versions, reports, audit].forEach(function (node) { node.textContent = ""; });
      $("count-plugins").textContent = String(data.plugins.length);
      $("count-versions").textContent = String(data.versions.length);
      $("count-reports").textContent = String(data.reports.length);
      data.plugins.forEach(function (item) {
        plugins.appendChild(el("section", { class: "panel" },
          el("div", { class: "panel-head" }, el("strong", { text: item.name }), runtimeBadge(item.runtime), el("span", { text: "by " + item.author }),
            el("a", { href: "https://github.com/" + item.repo, text: item.repo }), el("span", { class: "muted", text: item.license + " · " + plural(item.stars, "star") })),
          el("p", { text: item.summary }),
          decision("/v1/store/admin/plugins/" + encodeURIComponent(item.slug), [["approve", "Approve"], ["reject", "Reject"]])));
      });
      if (!data.plugins.length) plugins.appendChild(el("p", { class: "muted", text: "Nothing waits." }));
      data.versions.forEach(function (version) {
        versions.appendChild(el("section", { class: "panel" },
          el("div", { class: "panel-head" }, el("strong", { text: version.name }), el("a", { href: "https://github.com/" + version.repo + "/releases/tag/" + encodeURIComponent(version.tag), text: version.repo + " " + version.tag })),
          el("ul", { class: "versions" }, versionLine(version)),
          el("p", { class: "small" }, "SHA-256 ", el("code", { class: "hash", text: version.sha256 })),
          version.status === "changed" ? el("p", { class: "note-inline", text: "The release file was replaced after it was checked." }) : null,
          decision("/v1/store/admin/versions/" + version.id, [["approve", "Approve"], ["reject", "Reject"]])));
      });
      if (!data.versions.length) versions.appendChild(el("p", { class: "muted", text: "Nothing waits." }));
      data.reports.forEach(function (item) {
        reports.appendChild(el("section", { class: "panel" },
          el("div", { class: "panel-head" }, el("a", { href: slugLink(item.slug), text: item.name }), el("span", { class: "muted", text: "reported by " + item.login + " on " + day(item.created) })),
          el("p", { text: item.reason }),
          decision("/v1/store/admin/reports/" + item.id, [["resolve", "Mark as handled"],
            ["remove", "Remove the plugin", "/v1/store/admin/plugins/" + encodeURIComponent(item.slug)]])));
      });
      if (!data.reports.length) reports.appendChild(el("p", { class: "muted", text: "No open report." }));
      data.audit.forEach(function (entry) {
        audit.appendChild(el("tr", null, el("td", { text: day(entry.at) }), el("td", { text: entry.actor }), el("td", null, el("code", { text: entry.action })),
          el("td", { text: entry.target }), el("td", { text: entry.note })));
      });
      if (!data.audit.length) audit.appendChild(el("tr", null, el("td", { colspan: "5", text: "No decision yet." })));
    }).catch(function () { say($("status"), "Only the administrators of the Falcon-MC organisation can open this page."); });
  }

  api("/v1/me").catch(function () { return { user: null }; }).then(function (data) {
    var me = data.user;
    account(me);
    if (page === "index") list();
    else if (page === "plugin") plugin(me);
    else if (page === "publish") publish(me);
    else if (page === "admin") { if (me && me.admin) admin(); else say($("status"), me ? "Only the administrators of the Falcon-MC organisation can open this page." : "Sign in with GitHub to continue."); }
  });
})();
