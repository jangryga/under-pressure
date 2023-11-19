## Simple text editor built on top of react

### Working on:

- [ ] fix newline handling
- [ ] Hijack tab to keep focus and interpret as 4 spaces
- [ ] add comment support
- [ ] add line numbers
- [ ] add scrolling ability
- [ ] manage size properly
- [ ] improve user interface (pass props to canvas etc.)
- [ ] make into a crate

Note: currently getting text from `ref.current!.innerText` -> this converts will most likely break when I change it to react elements with styling, so this should be done by walking the tree
