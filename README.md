# Troubled Paths on Ancient Ground: Cold Case companion

A phone-friendly web app that goes with Robin McKean's novel *Troubled Paths on Ancient Ground*. It is modelled on the Shipwrecked Cold Case app.

Live: https://robmac10.github.io/troubled-paths-cold-case/

## What it has
- **Witness files** for Michael Gahan, Nako and the Keeper. Each unlocks when the reader says they have finished that chapter.
- **The club table**: seven objects from the Anzac Day 1924 prologue, each with real history kept apart from made-up story.
- **The board**: six questions where the reader pairs clashing statements, says whom they trust, writes a finding and locks it in before reading how Daisy weighs it in the book. Then the *Case file: Finding* page.
- **Real records**: the Pacific Island Labourers Act 1901, who could vote, Sergeant Joseph Gahan, a map from Ireland and Kalkie to the Sinai and Gaza, and background history.
- **Class mode**: discussion questions and a short writing task. There is no teacher key.

## How it works
Plain HTML, CSS and JavaScript. No build step, no tracking, no cookies, no accounts. Answers are kept in the browser's `localStorage` only. `tools/make_maps.py` rebuilds `maps.js` from Natural Earth outlines.

## Text and pictures
Story text, entries and Daisy's weighing are quoted from the novel and are © Robin McKean. All pictures are public domain and credited on the About page. There are no AI images.
