## Simple text editor built on top of react

### Working on:

- [x] Move Editor out of App.tsx into canvas.tsx
- [ ] Create Component Tree (update canvas tree property which is currently unused)
- [ ] Add carrot handling to canvas manager
- [ ] Keep track of current indentation - maintain (insert) on newline
- [ ] Hijack tab to keep focus and interpret as 4 spaces

Note: currently getting text from `ref.current!.innerText` -> this converts will most likely break when I change it to react elements with styling, so this should be done by walking the tree
