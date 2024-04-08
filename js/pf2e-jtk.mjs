import { JTKJournalSheet, addDescriptionButtons } from "./journal-sheet.mjs";

// the ID of the module itself
const MODULE_ID = "pf2e-journal-toolkit";

// the ID of the compendium package containing the documents
const PACK_ID = "pf2e-jtk";

Hooks.once("init", function () {
  // Global reference to the module
  globalThis.jtk = game.modules.get(MODULE_ID);

  jtk.CSS_CLASS = "pf2e-jtk";

  // Register sheets
  DocumentSheetConfig.registerSheet(JournalEntry, MODULE_ID, JTKJournalSheet, {
    types: ["base"],
    label: "Journal Toolkit",
    makeDefault: false,
  });

  game.settings.register(MODULE_ID, "descriptiveTextButton", {
    name: '"Send To Chat" button',
    hint: "Adds a button to the Journals that can be used to send the 'readaloud' text to chat.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });
});

Hooks.on("renderJournalPageSheet", (app, html) => {
  // Handle Description Sections
  const doc = app.document;
  html.addClass(jtk.CSS_CLASS);
  if (game.settings.get(MODULE_ID, "descriptiveTextButton")) {
    addDescriptionButtons(doc);
  }
});
