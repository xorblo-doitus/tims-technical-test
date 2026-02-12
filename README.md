# tims-technical-test

## Part 1

Each exercise has its own file in the [`part-1-Algorithm/`](part-1-Algorithm) folder.
Answers to questions are written directly in this files as comments.

Note: I used Python 3.12.9


## Part 2 (Tic-tac-toe)

I never used any web framework extensively, so I chose to use React, as it's
the one you mention in your internship offer, in order to prepare myself.

Since I was discovering React, I started with the basic template suggested by
the [documentation](https://react.dev/learn/build-a-react-app-from-scratch#vite):

```
npm create vite@latest my-app -- --template react-ts
```

Then I kind of followed [the example project tutorial](https://react.dev/learn/tutorial-tic-tac-toe), but not too much because it was a tic-tac-toe...
So I avoided looking at the given examples.
Instead, I mainly consulted the documentation and stackoverflow to figure out how
to do things.

I have almost only modified code in [`tic-tac-toe/src/`](tic-tac-toe/src)
(appart from a few config files to make `npm run deploy` deploy to
[GitHub Pages](https://xorblo-doitus.github.io/tims-technical-test/))

To test the project locally:

```
cd tic-tac-toe
npm run dev
```


### Tools used

- VSCode
- No AI
- Chrome DevTools
- GitHub Pages ([link](https://xorblo-doitus.github.io/tims-technical-test/))


### What I have learned

- Basic React features:
  - Components as functions
  - States
  - JSX (This is awesome)
- I discovered the `@media (prefers-color-scheme: light)` rule in the css
  of the template.


### What I would have done if I had more time

- Create an SVG for the cross, the circle, and the favicon.
- Refactor (`App.tsx` holds too much code)