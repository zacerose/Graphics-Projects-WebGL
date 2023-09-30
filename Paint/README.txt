CSCI 445 Fall 2023
Project 2
Zachary Rose
9/29/2023

This project contains a paint-style canvas environment for simple drawings, using WebGL.
  Run Paint.html in a browser to start the program.
      Click and drag on the gray canvas to draw.
      Use the color menu to select your draw color.
      Press Undo to remove your last stroke.
      Press Redo to "undo" your last undo.
      Press Eraser to hide old brush strokes.
      Press Erase Canvas to clear the canvas. This can be undone.

Some implementation notes:
I chose to use square points as the brush instead of lines. Firstly, I wanted to be able to change the size easily, which couldn't be done with lines.
  This is good for showing how the overlapping works. I also wanted to be able to draw separate drawings, and even write words, so line-strip wasn't a good choice.
I'm happy with how the undo/redo buttons turned out. They make use of a small array of a capped size and storing indices whenever a brush stroke is started.
  A small amount of logic was needed to control the index, but with this there was no need to erase any vertices in the buffer. By changing the index directly,
  that part of the buffer is not rendered, and is overwritten when new strokes are added.
Unfortunately, I couldn't get a more fancy eraser working. This eraser merely assigns the color of the canvas. In the same vein, I
  was unable to get dynamic line width changing working. I thought I knew the theory, but I couldn't buffer the data properly.

Undo button: The amount of times this can be pressed is arbitrary with how I implemented it, but I left it at 20 by default. This can be changed at the top of Paint.js easily.
  Erasing the canvas can be undone, redos can be undone, and eraser strokes can be undone. See above notes for implementation discussion.
Redo button: The "undo undo" button. Any number of undos can be redone using the redo button. In order to prevent unwanted behavior, the redo button can only be used so long
  as another stroke isn't added since the last undo. Otherwise, undo and redo can be pressed in succession as desired.
