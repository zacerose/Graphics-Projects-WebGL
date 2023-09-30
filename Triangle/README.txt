CSCI 445 Fall 2023
Project 1
Zachary Rose
9/9/2023

This project contains 4 example triangles seperated into 2 files:
  Run Triangle.html in a browser to see a black wireframe triangle, and a rotated red triangle.
  Run TriangleTessellated.html in a browser to see a black wireframe tessellated triangle, and a red twisted triangle.
Should you want to change the angle at which the bottom triangle rotates, change the "angle" value near the top of the associated .js file.
The number of times the tessellated triangle is subdivided can also be changed in the same manner.

Some implementation notes:
In order to avoid implementing more than one of each type of shader, I passed a color through the vertex shader along with each location.
  This allowed for more easily implementing the two differently colored triangles in a single file.
Due to my lack of full understanding of how the buffers work, I implemented both triangles into a single buffer. I don't know if this
  was the correct way to do it, but it necessitated using a variable to store the length of the first triangle and drawing the arrays separately.
To prevent warping when rotating the triangles, I calculated the centroid of the triangle to be rotated, and used it to transform the
  point as if it were rotating about the origin. This seemed to work somewhat well, but at very large theta values some warping can be 
  observed. This may be due to rounding errors or an error in logic. 