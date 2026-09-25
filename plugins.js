const TUTORIALS = {
    cpp: [
        {
            title: "Add the SDK",
            text: "The SDK is a CMake project. <code>falcon_add_plugin</code> builds the shared library with the " +
                "right settings for your platform.",
            file: "CMakeLists.txt",
            syntax: "cmake",
            code: `include(FetchContent)

FetchContent_Declare(
    falcon_plugin_api
    GIT_REPOSITORY https://github.com/Falcon-MC/PluginAPI.git
    GIT_TAG main
)
FetchContent_MakeAvailable(falcon_plugin_api)

falcon_add_plugin(MyPlugin MyPlugin.cpp)`
        },
        {
            title: "Write the plugin",
            text: "Subclass <code>falcon::Plugin</code>, subscribe to events and register commands in " +
                "<code>onEnable</code>. Split it into as many classes and folders as you like.",
            file: "MyPlugin.cpp",
            syntax: "cpp",
            code: `#include <falcon/Falcon.hpp>

class MyPlugin : public falcon::Plugin {
public:
    bool onEnable() override {
        events().on<falcon::PlayerJoinEvent>(
            [](falcon::PlayerJoinEvent &event) {
                event.player().sendMessage("Welcome!");
            });
        return true;
    }
};

FALCON_PLUGIN(MyPlugin)`
        },
        {
            title: "Install it",
            text: "Put the library next to a <code>plugin.json</code> in <code>plugins/MyPlugin/</code> and start " +
                "the server. Dependencies are declared here and load in the right order.",
            file: "plugin.json",
            syntax: "json",
            code: `{
  "name": "MyPlugin",
  "version": "1.0.0",
  "api-version": "1.2",
  "main": "MyPlugin",
  "depend": [],
  "softdepend": []
}`
        }
    ],
    csharp: [
        {
            title: "Reference the SDK",
            text: "Create a .NET 8 class library and add the <code>Falcon.PluginAPI</code> package.",
            file: "MyPlugin.csproj",
            syntax: "xml",
            code: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <EnableDynamicLoading>true</EnableDynamicLoading>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Falcon.PluginAPI" Version="1.2.0" />
  </ItemGroup>
</Project>`
        },
        {
            title: "Write the plugin",
            text: "Subclass <code>Plugin</code> and subscribe to events in <code>OnEnable</code>. The events, " +
                "commands and content are the same as in C++.",
            file: "MyPlugin.cs",
            syntax: "csharp",
            code: `using Falcon;

namespace MyPlugin;

public class MyPlugin : Plugin
{
    public override bool OnEnable()
    {
        Events.On<PlayerJoinEvent>(e =>
            e.Player.SendMessage("Welcome!"));
        return true;
    }
}`
        },
        {
            title: "Install it",
            text: "Copy the build output next to a <code>plugin.json</code> in <code>plugins/MyPlugin/</code>. " +
                "The server needs the .NET runtime.",
            file: "plugin.json",
            syntax: "json",
            code: `{
  "name": "MyPlugin",
  "version": "1.0.0",
  "runtime": "dotnet",
  "main": "MyPlugin.MyPlugin",
  "assembly": "MyPlugin.dll"
}`
        }
    ],
    java: [
        {
            title: "Add the dependency",
            text: "Create a Maven project on Java 22 and add the plugin API with the <code>provided</code> scope.",
            file: "pom.xml",
            syntax: "xml",
            code: `<dependency>
    <groupId>io.github.falcon-mc</groupId>
    <artifactId>falcon-plugin-api</artifactId>
    <version>1.2.0</version>
    <scope>provided</scope>
</dependency>`
        },
        {
            title: "Write the plugin",
            text: "Extend <code>Plugin</code> and subscribe to events in <code>onEnable</code>. The events, " +
                "commands and content are the same as in C++.",
            file: "MyPlugin.java",
            syntax: "java",
            code: `package com.example;

import falcon.api.Plugin;
import falcon.api.event.PlayerJoinEvent;

public class MyPlugin extends Plugin {
    @Override
    public boolean onEnable() {
        events().on(PlayerJoinEvent.class, event ->
            event.player().sendMessage("Welcome!"));
        return true;
    }
}`
        },
        {
            title: "Install it",
            text: "Put the jar next to a <code>plugin.json</code> in <code>plugins/MyPlugin/</code>. The server " +
                "needs Java 22 or newer.",
            file: "plugin.json",
            syntax: "json",
            code: `{
  "name": "MyPlugin",
  "version": "1.0.0",
  "api-version": "1.2",
  "runtime": "java",
  "main": "com.example.MyPlugin",
  "jar": "MyPlugin.jar"
}`
        }
    ]
};

const KEYWORDS = {
    cmake: ["include", "FetchContent_Declare", "FetchContent_MakeAvailable", "falcon_add_plugin"],
    cpp: ["#include", "class", "public", "bool", "override", "return", "true", "false", "const", "auto"],
    csharp: ["using", "namespace", "public", "class", "override", "bool", "return", "true", "false"],
    java: ["package", "import", "public", "class", "extends", "boolean", "return", "true", "false", "@Override"],
    json: ["true", "false", "null"],
    xml: []
};

const STORAGE_KEY = "falcon-plugin-language";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let generation = 0;
let started = false;

function tokenize(code, syntax) {
    const keywords = new Set(KEYWORDS[syntax] || []);
    const pattern = syntax === "xml"
        ? /(<\/?[\w.-]+|\/?>)|("(?:[^"\\]|\\.)*")|([^<>"]+|.)/g
        : /("(?:[^"\\]|\\.)*")|([@#]?[A-Za-z_][\w]*)|(<[\w/.]+\.hpp>)|(\s+|.)/g;
    const tokens = [];
    let match;

    while ((match = pattern.exec(code)) !== null) {
        const text = match[0];
        let type = null;

        if (syntax === "xml") {
            if (match[1]) {
                type = "keyword";
            } else if (match[2]) {
                type = "string";
            }
        } else if (match[1] || match[3]) {
            type = "string";
        } else if (match[2] && keywords.has(text)) {
            type = "keyword";
        }

        tokens.push({text, type});
    }
    return tokens;
}

function renderTokens(tokens) {
    const fragment = document.createDocumentFragment();
    for (const token of tokens) {
        if (token.type) {
            const span = document.createElement("span");
            span.className = token.type;
            span.textContent = token.text;
            fragment.appendChild(span);
        } else {
            fragment.appendChild(document.createTextNode(token.text));
        }
    }
    return fragment;
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function typeInto(target, tokens, current) {
    const caret = document.createElement("span");
    caret.className = "caret";
    target.appendChild(caret);

    const total = tokens.reduce((sum, token) => sum + token.text.length, 0);
    const perFrame = Math.max(1, Math.round(total / 110));

    for (const token of tokens) {
        const node = token.type ? document.createElement("span") : document.createTextNode("");
        if (token.type) {
            node.className = token.type;
        }
        target.insertBefore(node, caret);

        for (let index = 0; index < token.text.length; index += perFrame) {
            if (current !== generation) {
                return false;
            }
            node.textContent = token.text.slice(0, index + perFrame);
            await new Promise((resolve) => requestAnimationFrame(resolve));
        }
    }

    caret.remove();
    return true;
}

function buildStep(step, index) {
    const element = document.createElement("div");
    element.className = "tutorial-step";

    const text = document.createElement("div");
    text.className = "tutorial-text";
    text.innerHTML = `<span class="step-number">${index + 1}</span><h3>${step.title}</h3><p>${step.text}</p>`;

    const frame = document.createElement("div");
    frame.className = "code-window";
    frame.innerHTML = `<div class="code-window-bar"><span></span><span></span><span></span>` +
        `<em>${step.file}</em></div>`;

    const pre = document.createElement("pre");
    pre.className = "code";
    const ghost = document.createElement("span");
    ghost.className = "code-ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = step.code;
    const typed = document.createElement("span");
    typed.className = "code-typed";
    pre.append(ghost, typed);
    frame.appendChild(pre);

    element.append(text, frame);
    return {element, typed};
}

async function showLanguage(language) {
    const current = ++generation;
    const container = document.getElementById("tutorial");
    const steps = TUTORIALS[language];

    document.getElementById("language-note").hidden = language === "cpp";
    container.replaceChildren();

    const built = steps.map((step, index) => buildStep(step, index));
    built.forEach((entry) => container.appendChild(entry.element));

    for (let index = 0; index < built.length; index++) {
        const {element, typed} = built[index];
        const tokens = tokenize(steps[index].code, steps[index].syntax);

        if (reducedMotion) {
            element.classList.add("shown");
            typed.appendChild(renderTokens(tokens));
            continue;
        }

        await wait(index === 0 ? 80 : 250);
        if (current !== generation) {
            return;
        }

        element.classList.add("shown");
        await wait(300);
        if (current !== generation || !(await typeInto(typed, tokens, current))) {
            return;
        }
    }
}

function moveIndicator(button) {
    const indicator = document.getElementById("language-indicator");
    indicator.style.width = `${button.offsetWidth}px`;
    indicator.style.transform = `translateX(${button.offsetLeft - 4}px)`;
}

function selectLanguage(language, animate) {
    const tabs = document.querySelectorAll("#language-tabs button");
    for (const tab of tabs) {
        const active = tab.dataset.language === language;
        tab.setAttribute("aria-selected", String(active));
        if (active) {
            moveIndicator(tab);
        }
    }

    try {
        localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
    }

    if (animate) {
        showLanguage(language);
    }
}

function setupTutorial() {
    const tabs = document.getElementById("language-tabs");
    const section = document.getElementById("first-plugin");
    if (!tabs || !section) {
        return;
    }

    let language = "cpp";
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && TUTORIALS[saved]) {
            language = saved;
        }
    } catch (error) {
    }

    tabs.hidden = false;
    selectLanguage(language, false);
    window.addEventListener("resize", () => {
        const active = tabs.querySelector('[aria-selected="true"]');
        if (active) {
            moveIndicator(active);
        }
    });

    for (const tab of tabs.querySelectorAll("button")) {
        tab.addEventListener("click", () => {
            language = tab.dataset.language;
            selectLanguage(language, started);
        });
    }

    const start = () => {
        if (started) {
            return;
        }
        started = true;
        showLanguage(language);
    };

    if (!("IntersectionObserver" in window)) {
        start();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            start();
        }
    }, {threshold: 0.2});
    observer.observe(section);
}

setupTutorial();
