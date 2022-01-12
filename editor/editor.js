import { json, jsonLanguage } from "@codemirror/lang-json";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { darkThemeExtensions, lightThemeExtensions } from "./theme";
import {
  autocompletion,
  completionKeymap,
  completeFromList,
  completeAnyWord,
} from "@codemirror/autocomplete";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { bracketMatching } from "@codemirror/matchbrackets";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorView } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import {
  keymap,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
} from "@codemirror/view";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { indentOnInput } from "@codemirror/language";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { basicSetup } from "@codemirror/basic-setup";

if (!window.ReactNativeWebView) {
  console.log("window.ReactNativeWebView missing, will mock instead");
  window.ReactNativeWebView = {
    postMessage: console.log,
  };
}

const consoleLog = (type, log) =>
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ event: "console", data: { type: type, log: log } })
  );
console = {
  log: (log) => consoleLog("log", log),
  debug: (log) => consoleLog("debug", log),
  info: (log) => consoleLog("info", log),
  warn: (log) => consoleLog("warn", log),
  error: (log) => consoleLog("error", log),
};

let languages = new Compartment();
let themes = new Compartment();

const mapKeywordString = (kString) =>
  kString.split(" ").map((kw) => ({
    label: kw,
    type: "keyword",
  }));

const initialState = EditorState.create({
  doc: ``,
  extensions: [
    basicSetup,
    EditorView.updateListener.of((v) => {
      const { doc } = v.state;
      if (v.docChanged) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ event: "code-change", data: doc.toString() })
        );
      }
    }),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    defaultHighlightStyle.fallback,
    themes.of(darkThemeExtensions),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...completionKeymap,
    ]),
    languages.of(json()),
    EditorView.lineWrapping,
    EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }]),
  ],
});

const view = new EditorView({
  parent: document.getElementById("editor"),
  state: initialState,
});

window.view = view;

window.replaceCode = (code) => {
  window.view.dispatch({
    changes: {
      from: 0,
      to: window.view.state.doc.toString().length,
      insert: code || "",
    },
  });
  view.dispatch({ selection: { anchor: view.state.doc.length } });
};

const languageExtensionsMap = {
  json: json,
};

window.replaceLanguage = (language) => {
  const languageExtension = languageExtensionsMap[language];

  if (languageExtension) {
    view.dispatch({
      effects: languages.reconfigure(languageExtension()),
    });
  } else {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ event: "invalid-language", data: language })
    );
  }
};

window.replaceTheme = (theme) => {
  if (theme === "light") {
    view.dispatch({
      effects: themes.reconfigure(lightThemeExtensions),
    });
  } else if (theme === "dark") {
    view.dispatch({
      effects: themes.reconfigure(darkThemeExtensions),
    });
  } else {
    window?.ReactNativeWebView.postMessage(
      JSON.stringify({ event: "invalid-language", data: language })
    );
  }
};

window.simulateKeyPress = (key = "Enter") => {
  const element = document.querySelector(".cm-content");
  element.dispatchEvent(new KeyboardEvent("keydown", { key }));
  element.dispatchEvent(new KeyboardEvent("keyup", { key }));
};

// this is magic, don't touch
// fixes all problems identified with the editor's webview not syncing with the updates from react native
// e.g. closing the keyboard on Android wouldn't update the editor's view, leaving half a screen blank
window.onresize = (x) => {
  const element = document.querySelector(".cm-activeLine");
  element.scrollIntoViewIfNeeded(false); // false here makes the scroll stop once the element is visible, compared to centering it into the viewport
};
