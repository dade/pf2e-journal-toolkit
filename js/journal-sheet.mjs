/**
 * The custom Journal Sheet used for our toolkit
 */
export class JTKJournalSheet extends JournalSheet {
  constructor(doc, options) {
    super(doc, options);
    this.options.classes.push(jtk.CSS_CLASS);
  }
}

// The "post description to chat" functionality
function postDescToChat(description, doc) {
  ChatMessage.create({
    flavor:
      '<div class="page" data-visibility="gm"><p>@UUID[' +
      doc.uuid +
      "]</p></div>",
    content: description.outerHTML,
    speaker: { alias: "Description" },
  });
}

async function speakToChat(speech, doc) {
  let nameNode = speech.children[1].children[0];
  let speakerData = {};
  let actor;
  let text = "";
  let alias = speech.children[1].innerText;

  if (nameNode != null && nameNode.dataset != null) {
    actor = await fromUuid(nameNode.dataset.uuid);
  }

  for (let i = 2; i < speech.children.length; i++) {
    text += speech.children[i].outerHTML;
  }

  if (!actor) {
    speakerData = {
      alias: alias,
    };
  } else {
    speakerData = {
      actor: actor,
      alias: alias != actor.name ? alias : actor.name,
    };
  }

  ChatMessage.create({
    flavor: `<div class="page" data-visibility="gm"><p>@UUID[${doc.uuid}]</p></div>`,
    content: text,
    speaker: speakerData,
  });
}

export function addDescriptionButtons(doc) {
  // check of the button is needed
  const descriptions = document.querySelectorAll(
    ".journal-sheet section.description:not(.readout)",
  );
  descriptions.forEach(function (description) {
    description.classList.add("readout");
    // create button
    const readoutButton = document.createElement("i");
    readoutButton.className = "fa-regular fa-comment-alt readoutButton";
    readoutButton.setAttribute("data-tooltip", "Send to Chat");
    readoutButton.setAttribute("aria-label", "Send to Chat");
    readoutButton.onclick = function () {
      postDescToChat(description, doc);
    };
    description.prepend(readoutButton);
  });

  // handle speakers
  const speakers = document.querySelectorAll(
    ".journal-sheet section.speaker:not(.speakout)",
  );
  speakers.forEach(function (speech) {
    speech.classList.add("speakout");

    // create button
    const speakButton = document.createElement("i");
    speakButton.className = "fa-regular fa-comment-alt speakButton";
    speakButton.setAttribute("data-tooltip", "Speak");
    speakButton.setAttribute("aria-label", "Speak");
    speakButton.onclick = function () {
      speakToChat(speech, doc);
    };
    speech.prepend(speakButton);
  });
}
