title: Forms and scoreboards
section: Packs and scripting
---
## Forms

```js
import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((event) => {
  new ActionFormData()
    .title("Menu")
    .body("Pick one")
    .button("Spawn")
    .button("Shop")
    .show(event.source)
    .then((response) => {
      if (!response.canceled) console.log(response.selection);
    });
});
```

| Class | Methods |
|---|---|
| `ActionFormData` | `title`, `body`, `button(text, icon)`, `show`. `header`, `label` and `divider` are accepted and ignored |
| `MessageFormData` | `title`, `body`, `show` |
| `ModalFormData` | `title`, `textField(label, placeholder, defaultValue)`, `toggle(label, defaultValue)`, `slider(label, min, max, step, defaultValue)`, `dropdown(label, options, defaultIndex)`, `label`, `header`, `divider`, `submitButton`, `show` |

Form responses are limited by `max-form-responses-per-second`.


## Scoreboard

`world.scoreboard` manages objectives. `ScoreboardObjective` has `getScore`, `setScore`, `addScore`, `removeParticipant`, `hasParticipant` and `getParticipants`.
