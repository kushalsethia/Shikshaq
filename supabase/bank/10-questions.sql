set standard_conforming_strings = on;
begin;

-- questions 4001-4500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-2ab95b-1-1', '2ab95b', 1, '1', '(b) A man invests ₹ 4500 in shares of a company which is paying 7.5% dividend. [3]

If ₹ 100 shares are available at a discount of 10%.

Find:

(i) Number of shares he purchases.

(ii) His annual income.', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-2ab95b-2-0', '2ab95b', 2, '2', '(a) Using the factor theorem, show that $$(x - 2)$$ is a factor of $$x^3 + x^2 - 4x - 4$$. [3] Hence factorise the polynomial completely.', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-2ab95b-2-1', '2ab95b', 3, '2', '(b) Prove that: [3]

$$(\text{cosec } \theta - \sin \theta)(\sec \theta - \cos \theta)(\tan \theta + \cot \theta) = 1$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-2ab95b-3-0', '2ab95b', 4, '3', '(a) Simplify [3]

$$\sin A \begin{bmatrix} \sin A & -\cos A \\ \cos A & \sin A \end{bmatrix} + \cos A \begin{bmatrix} \cos A & \sin A \\ -\sin A & \cos A \end{bmatrix}$$', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-2ab95b-3-2', '2ab95b', 5, '3', '(c) A solid metallic sphere of radius 6 cm is melted and made into a solid cylinder of height 32 cm. Find the: [4]

(i) radius of the cylinder
(ii) curved surface area of the cylinder

Take π = 3.1', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-2ab95b-4-1', '2ab95b', 6, '4', '(b) Solve for x the quadratic equation x² - 4x - 8 = 0. [3]

Give your answer correct to three significant figures.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-2ab95b-5-0', '2ab95b', 7, '5', '(a) There are 25 discs numbered 1 to 25. They are put in a closed box and shaken thoroughly. A disc is drawn at random from the box. [3]

Find the probability that the number on the disc is:

(i) an odd number
(ii) divisible by 2 and 3 both.
(iii) a number less than 16.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-2ab95b-5-1', '2ab95b', 8, '5', '(b) Rekha opened a recurring deposit account for 20 months. The rate of interest is 9% per annum and Rekha receives ₹ 441 as interest at the time of maturity. Find the amount Rekha deposited each month. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-2ab95b-5-2', '2ab95b', 9, '5', '(c) Use a graph sheet for this question. [4]

Take 1 cm = 1 unit along both x and y axis.

(i) Plot the following points:
A(0,5), B(3,0), C(1,0) and D(1,-5)
(ii) Reflect the points B, C and D on the y axis and name them as B'', C'' and D'' respectively.
(iii) Write down the coordinates of B'', C'' and D''.
(iv) Join the points A, B, C, D, D'', C'', B'', A in order and give a name to the closed figure ABCDD''C''B''.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-2ab95b-6-0', '2ab95b', 10, '6', '(a) In the given figure, ∠PQR = ∠PST = 90°, PQ = 5 cm and PS = 2 cm. [3]

(i) Prove that ΔPQR ~ ΔPST.
(ii) Find Area of ΔPQR : Area of quadrilateral SRQT.', 3, 'Similarity', 'short', 4, '2ab95b__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-2ab95b-6-2', '2ab95b', 11, '6', '(c) A hemispherical and a conical hole is scooped out of a solid wooden cylinder. [4]

Find the volume of the remaining solid where the measurements are as follows:

The height of the solid cylinder is 7 cm, radius of each of hemisphere, cone and cylinder is 3 cm. Height of cone is 3 cm.

Give your answer correct to the nearest whole number. Take $$\pi = \frac{22}{7}$$.', 4, 'Mensuration', 'long', 5, '2ab95b__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-2ab95b-7-0', '2ab95b', 12, '7', '(a) In the given figure AC is a tangent to the circle with centre O. [3]

If $$\angle ADB = 55^{\circ}$$, find $$x$$ and $$y$$. Give reasons for your answers.', 3, 'Circles', 'short', 5, '2ab95b__ICSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-2ab95b-7-1', '2ab95b', 13, '7', '(b) The model of a building is constructed with the scale factor 1 : 30. [3]

- (i) If the height of the model is 80 cm, find the actual height of the building in meters.
- (ii) If the actual volume of a tank at the top of the building is 27 m³, find the volume of the tank on the top of the model.', 3, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-2ab95b-7-2', '2ab95b', 14, '7', '(c) Given $$\begin{bmatrix} 4 & 2 \\ -1 & 1 \end{bmatrix} M = 6I$$, where M is a matrix and I is unit matrix of order 2x2. [4]

(i) State the order of matrix M.

(ii) Find the matrix M.', 4, 'Matrices', 'long', 6, NULL, NULL),
  ('MQ-2ab95b-8-0', '2ab95b', 15, '8', '(a) The sum of the first three terms of an Arithmetic Progression (A.P.) is 42 and the product of the first and third term is 52. Find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-2ab95b-8-1', '2ab95b', 16, '8', '(b) The vertices of a $$\Delta ABC$$ are A(3, 8), B(-1, 2) and C(6, -6). Find: [3]

(i) Slope of BC.

(ii) Equation of a line perpendicular to BC and passing through A.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-2ab95b-8-2', '2ab95b', 17, '8', '(c) Using ruler and a compass only construct a semi-circle with diameter BC = 7cm. [4]

Locate a point A on the circumference of the semicircle such that A is equidistant from B and C. Complete the cyclic quadrilateral ABCD, such that D is equidistant from AB and BC. Measure $$\angle ADC$$ and write it down.', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-2ab95b-9-0', '2ab95b', 18, '9', '(a) The data on the number of patients attending a hospital in a month are given below. [3]

Find the average (mean) number of patients attending the hospital in a month by using the shortcut method.

Take the assumed mean as 45. Give your answer correct to 2 decimal places.

| Number of patients | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of Days | 5 | 2 | 7 | 9 | 2 | 5 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-2ab95b-10-0', '2ab95b', 19, '10', '(a) Use graph paper for this question. [6]

The marks obtained by 120 students in an English test are given below:

| Marks | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 80–90 | 90–100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw the ogive and hence, estimate:

- (i) the median marks.
- (ii) the number of students who did not pass the test if the pass percentage was 50.
- (iii) the upper quartile marks.', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-2ab95b-10-1', '2ab95b', 20, '10', '(b) A man observes the angle of elevation of the top of the tower to be 45°. He walks towards it in a horizontal line through its base. On covering 20 m the angle of elevation changes to 60°. Find the height of the tower correct to 2 significant figures. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-2ab95b-11-0', '2ab95b', 21, '11', '(a) Using the Remainder Theorem find the remainders obtained when [3]

$$x^{3} + (kx + 8)x + k$$ is divided by $$x + 1$$ and $$x - 2$$.

Hence find $$k$$ if the sum of the two remainders is 1.', 3, 'Factorisation and Remainder Theorem', 'short', 8, NULL, NULL),
  ('MQ-2ab95b-11-1', '2ab95b', 22, '11', '(b) The product of two consecutive natural numbers which are multiples of 3 is equal [3]

to 810. Find the two numbers.', 3, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-2ab95b-11-2', '2ab95b', 23, '11', '(c) In the given figure, ABCDE is a pentagon inscribed in a circle such that AC is a [4]

diameter and side BC//AE. If $$\angle BAC = 50^{\circ}$$, find giving reasons:

- (i) $$\angle ACB$$
- (ii) $$\angle EDC$$
- (iii) $$\angle BEC$$

Hence prove that BE is also a diameter', 4, 'Circles', 'long', 8, '2ab95b__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-bdf81d-10-0', 'bdf81d', 0, '10', 'b. Mohan has a recurring deposit account in a bank for 2 years at 6% p.a. simple interest. If he gets Rs. 1200 as interest at the time of maturity, find :

i. monthly instalment
ii. amount of maturity', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-bdf81d-10-1', 'bdf81d', 1, '10', 'c. The scores obtained by 25 students in a (3) Mathematics mental text.

| CI. | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 5 | 8 | 4 | 6 |

i. Draw the histogram
ii. Calculate mode
iii. Determine the Model Class.', 3, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-bdf81d-11-0', 'bdf81d', 2, '11', 'Q11. a. Prove that : (4)

$$\frac{\text{Cos A}}{1 + \sin A} + \tan A = \text{Sec A}$$', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-bdf81d-11-1', 'bdf81d', 3, '11', 'b. In the figure given below PQ = 24 cm QR = 7 cm LPQR = 90°, find the radius of the inscribed

circle of ΔPQR', NULL, 'Circles', 'short', 1, 'bdf81d__ICSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-bdf81d-11-2', 'bdf81d', 4, '11', 'c. Ashok invested Rs. 26,400 in 12%, 25 shares of a company. If he receives a dividend of Rs. 2475, find the :

i. Number of shares he bought
ii. Market value of each share.', NULL, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-bdf81d-1-0', 'bdf81d', 5, '1', '1. a. A recurring deposit account of Rs. 1200 per month has a maturity value of Rs. 12,440. If the rate of interest is calculated at the end of every month, find the time of this Recurring Deposit Account. (4)', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-bdf81d-1-1', 'bdf81d', 6, '1', 'b. If P = {x : 7x - 4 > 5x + 2, x ∈ R} and (3)

Q = {x : x - 19 ≥ 1 - 3x, x ∈ R}; find the range of set P ∩ Q and represent it on a number line.', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-bdf81d-1-2', 'bdf81d', 7, '1', 'c. Solve the following : (3)
x - 18/x = 6 Give answer correct to two significant figures', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-bdf81d-2-0', 'bdf81d', 8, '2', '2. a. In the given figure ABC is a right angled triangle with LABC - 90° (4)

i. Prove : ΔADB ~ ΔCDA
ii. If BD = 18 cm and CD = 8 cm, find AD
iii. Find the ratio of the area of ΔADB is to the area of ΔCDA', 4, 'Similarity', 'long', 1, 'bdf81d__ICSE_X_Mat_p1_img_1_jpeg.webp', NULL),
  ('MQ-bdf81d-2-1', 'bdf81d', 9, '2', 'b. Find the value of ''m'' so that the equation has equal roots. Also, find the solution of each equation :

$$x^2 - (m+2) x + (m+5) = 0$$', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-2-2', 'bdf81d', 10, '2', 'c. In each case given below, find : (3)

a. The order of matrix M.

b. The matrix M

i. $$M \times \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix} = [1 \ 2]$$', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-3-0', 'bdf81d', 11, '3', '3. a. Use the Remainder Theorem to factorise the following expression : (4)

$$2x^3 + x^2 - 13x + 6$$', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-bdf81d-3-1', 'bdf81d', 12, '3', 'b. Cards marked with numbers 1,2,3,4, ... 20 are well shuffled and a card is drawn at random. What is the probability that the number on the card is : (3)

i. a prime number?

ii. divisible by 3?

iii. a perfect square?', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-3-2', 'bdf81d', 13, '3', 'c. Find the mean, median and mode : (3)

| x. | 40 | 41 | 43 | 45 | 46 | 49 | 50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| f. | 14 | 28 | 38 | 50 | 40 | 20 | 10 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-4-0', 'bdf81d', 14, '4', '4. a. A (-2, 4) and B (-4, 2) are reflected in the y-axis. (4) If A'' and B'' are images of A and B respectively.

i. Find the co-ordinates of A'' and B''

ii. Assign a special name to quadrilateral A A'' B''B.

iii. State whether AB'' = BA''', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-bdf81d-x-0', 'bdf81d', 15, NULL, 'c. The figure alongside shown a circle with centre O chord ED is parallel to diameter AC and angle CBE = 64°. Find angle CED. (3)', 3, 'Circles', 'short', 2, 'bdf81d__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-bdf81d-9-0', 'bdf81d', 16, '9', 'Q9. a. The sum of 3rd and 11th terms of an A.P. is 34. Find the sum of its 13 terms. (4)', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-bdf81d-9-1', 'bdf81d', 17, '9', 'b. A conical tent is to accommodate 11 persons. Each person must have 4 sq. m of the space on the ground and 20 cubic metre of air to breath. Find the height of the cone.', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-9-2', 'bdf81d', 18, '9', 'c. ABC is a right-angled triangle with the right angle of vertex B. BD is altitude through B. BD = 12 cm and AD = 9 cm

i. Calculate AB

ii. Name the triangles which are similar to ΔADB

iii. Find AC.', NULL, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-bdf81d-10-2', 'bdf81d', 19, '10', 'Q10. a. A model of a ship is made to a scale 1 : 300 (4)

i. The length of the model of the ship is 2m. Calculate the length of the ship.

ii. The area of the deck of the ship is 180000 m². Calculate the area of the deck of the model.

iii. The volume of the model is 6.5 m³. Calculate the volume of the ship.', 4, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-bdf81d-10-3', 'bdf81d', 20, '10', 'b. If sec Q. sin (36° + Q) = 1, find the value of Q so that Q and 36° + Q are acute angles. (3)', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-10-4', 'bdf81d', 21, '10', 'c. In what ratio does the line x-y-2 = 0 divides the line segment joining the points (3, -1) and (8, 9)? Also, find co-ordinates of the point of intersection. (3)', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-5-0', 'bdf81d', 22, '5', 'Q5. a. In the given figure, tangents PQ and PR are drawn to a circle such that angle RPQ = 30°. A chord RS is drawn parallel to the tangent PQ.

Find the angle PQS.', NULL, 'Circles', 'short', 3, 'bdf81d__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-bdf81d-5-1', 'bdf81d', 23, '5', 'b. A right circular cone is 3.6 cm high and radius of its base is 1.6 cm. It is metted and recast into a right circular cone with radius of the base as 1.2 cm. Find its height. (3)', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-5-2', 'bdf81d', 24, '5', 'c. Find the 99th term of the series : (3)

\[
7 \frac {3}{4}, 9 \frac {1}{2}, 1 1 \frac {1}{4}, \dots \dots
\]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-6-0', 'bdf81d', 25, '6', 'Q6. From the top of a building AB = 60 cm high, the angle of depression of top and bottom of a vertical lamp CD are observed to be 30° and 60° respectively. Find (i) horizontal distance between ABC & CD.

(ii) the height of the lamp post.', NULL, 'Trigonometry', 'short', 3, 'bdf81d__ICSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-bdf81d-6-1', 'bdf81d', 26, '6', 'b. Find the length of canvas, 2m in width required (2) make a conical tent, 12m in diameter and 12.6 m in slant height. Also, find the cost of canvas at the rate of Rs 112.50 per meter.', 2, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-6-2', 'bdf81d', 27, '6', 'c. A man desires to have an annual income of Rs. 36,000 from 18% Rs. 125 shares available at a premium of 20%. How much should he invest?', NULL, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-7-0', 'bdf81d', 28, '7', 'Q7. a. Find the co-ordinates of the point Q on x-axis which lies on the perpendicular bisector of the line segment joining the points A (-5, -2) and B (4, -2). Name the type of the triangle QAB.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-7-1', 'bdf81d', 29, '7', 'b. Prove that: \( \frac{\cos^{2}A + \tan^{2}A - 1}{\sin^{2}A} = \tan^{2}A \) (3)', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-7-2', 'bdf81d', 30, '7', 'c. A person bought a certain number of pen for Rs. 800. If he had bought 4 pens more for the same money, he would have paid 10 less for each pen. How many pens did he buy? (3)', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-bdf81d-8-0', 'bdf81d', 31, '8', 'Q8. a. If (x-2) is a factor of the expression \( 2x^{3} + ax^{2} + bx - 14 \) and when the expression is divided by (x-3), it leaves a remainder 52. Find the value of a and b. (4)', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-bdf81d-8-1', 'bdf81d', 32, '8', 'b. The marks obtained by 120 students in a mathematics test : (6)

| Marks | No of students | Marks | No. of students |
| --- | --- | --- | --- |
| 9 - 10 | 5 | 50-60 | 18 |
| 10-20 | 9 | 60-70 | 11 |
| 20-30 | 16 | 70-80 | 6 |
| 30-40 | 22 | 80-90 | 4 |
| 40-50 | 26 | 90-100 | 3 |

Draw an ogive on a graph. Use the ogive drawn to estimate.

i. the median
ii. the number of students who obtained more than 75% marks in the test.', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-bdf81d-7-4', 'bdf81d', 33, '7', 'b. Prove that: \( \frac{\cos^{2}A + \tan^{2}A - 1}{\sin^{2}A} = \tan^{2}A \) (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-c628be-1-0', 'c628be', 0, '1', '(a) Solve the following Quadratic Equation: [3]

$$x^2 - 7x + 3 = 0$$

Give your answer correct to two decimal places.', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-c628be-1-1', 'c628be', 1, '1', '(b) Given $$A = \begin{bmatrix} x & 3 \\ y & 3 \end{bmatrix}$$ [3]

If $$A^2 = 3I$$, where $$I$$ is the identity matrix of order 2, find $$x$$ and $$y$$.', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-c628be-1-2', 'c628be', 2, '1', '(c) Using ruler and compass construct a triangle ABC where AB = 3 cm, BC = 4 cm and [4]

$$\angle ABC = 90^\circ$$. Hence construct a circle circumscribing the triangle ABC. Measure and write down the radius of the circle.', 4, 'Constructions', 'long', 1, NULL, NULL),
  ('MQ-c628be-2-0', 'c628be', 3, '2', '(a) Use factor theorem to factorise $6x^3 + 17x^2 + 4x - 12$ completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-c628be-2-1', 'c628be', 4, '2', '(b) Solve the following inequation and represent the solution set on the number line. [3]

$$\frac{3x}{5} + 2 < x + 4 \leq \frac{x}{2} + 5, \quad x \in R$$', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-c628be-2-2', 'c628be', 5, '2', '(c) Draw a Histogram for the given data, using a graph paper: [4]

| Weekly Wages (in ₹) | No. of People |
| --- | --- |
| 3000 – 4000 | 4 |
| 4000 – 5000 | 9 |
| 5000 – 6000 | 18 |
| 6000 – 7000 | 6 |
| 7000 – 8000 | 7 |
| 8000 – 9000 | 2 |
| 9000 – 10000 | 4 |

Estimate the mode from the graph.', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-c628be-3-0', 'c628be', 6, '3', '(a) In the figure given below, O is the centre of the circle and AB is a diameter. [3]

If AC = BD and $\angle AOC = 72^\circ$. Find:

(i) $\angle ABC$

(ii) $\angle BAD$

(iii) $\angle ABD$', 3, 'Circles', 'short', 2, 'c628be__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-c628be-3-1', 'c628be', 7, '3', '(b) Prove that: [3]

$$\frac{\sin A}{1 + \cot A} - \frac{\cos A}{1 + \tan A} = \sin A - \cos A$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-c628be-3-2', 'c628be', 8, '3', '(c) In what ratio is the line joining P(5, 3) and Q(-5, 3) divided by the y-axis? Also find [4]

the coordinates of the point of intersection.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-c628be-4-0', 'c628be', 9, '4', '(a) A solid spherical ball of radius 6 cm is melted and recast into 64 identical spherical marbles. Find the radius of each marble. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-c628be-4-1', 'c628be', 10, '4', '(b) Each of the letters of the word ‘AUTHORIZES’ is written on identical circular discs and put in a bag. They are well shuffled. If a disc is drawn at random from the bag, what is the probability that the letter is: [3]

(i) a vowel
(ii) one of the first 9 letters of the English alphabet which appears in the given word
(iii) one of the last 9 letters of the English alphabet which appears in the given word?', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-c628be-4-2', 'c628be', 11, '4', '(c) Mr. Bedi visits the market and buys the following articles: [4]

Medicines costing ₹ 950, GST @ 5%

A pair of shoes costing ₹ 3000, GST @ 18%

A Laptop bag costing ₹ 1000 with a discount of 30%, GST @ 18%.

(i) Calculate the total amount of GST paid.
(ii) The total bill amount including GST paid by Mr. Bedi.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-c628be-5-0', 'c628be', 12, '5', '(a) A company with 500 shares of nominal value ₹ 120 declares an annual dividend of 15%. Calculate: [3]

(i) the toal amount of dividend paid by the company.
(ii) annual income of Mr. Sharma who holds 80 shares of the company.

If the return percent of Mr. Sharma from his shares is 10%, find the market value of each share.', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-c628be-5-1', 'c628be', 13, '5', '(b) The mean of the following data is 16. Calculate the value of f. [3]

| Marks | 5 | 10 | 15 | 20 | 25 |
| --- | --- | --- | --- | --- | --- |
| No. of Students | 3 | 7 | f | 9 | 6 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-c628be-5-2', 'c628be', 14, '5', '(c) The 4th, 6th and the last term of a geometric progression are 10, 40 and 640 respectively. If the common ratio is positive, find the first term, common ratio and the number of terms of the series. [4]', 4, 'Geometric Progression', 'long', 4, NULL, NULL),
  ('MQ-c628be-6-0', 'c628be', 15, '6', '(a) If $$A = \begin{bmatrix} 3 & 0 \\ 5 & 1 \end{bmatrix}$$ and $$B = \begin{bmatrix} -4 & 2 \\ 1 & 0 \end{bmatrix}$$ [3]

Find $$A^2 - 2AB + B^2$$', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-c628be-6-1', 'c628be', 16, '6', '(b) In the given figure AB = 9 cm, PA = 7.5 cm and PC = 5 cm. [3]

Chords AD and BC intersect at P.

- (i) Prove that $$\Delta PAB \sim \Delta PCD$$
- (ii) Find the length of CD.
- (iii) Find area of $$\Delta PAB$$ : area of $$\Delta PCD$$', 3, 'Similarity', 'short', 4, 'c628be__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-c628be-6-2', 'c628be', 17, '6', '(c) From the top of a cliff, the angle of depression of the top and bottom of a tower are observed to be 45° and 60° respectively. If the height of the tower is 20 m. [4]

Find:

- (i) the height of the cliff
- (ii) the distance between the cliff and the tower.', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-c628be-7-0', 'c628be', 18, '7', '(a) Find the value of ''p'' if the lines, $$5x - 3y + 2 = 0$$ and $$6x - py + 7 = 0$$ are perpendicular to each other. Hence find the equation of a line passing through $$(-2, -1)$$ and parallel to $$6x - py + 7 = 0$$. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-c628be-7-1', 'c628be', 19, '7', '(b) Using properties of proportion find $x : y$, given: [3]

$$\frac{x^2 + 2x}{2x + 4} = \frac{y^2 + 3y}{3y + 9}$$', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-c628be-7-2', 'c628be', 20, '7', '(c) In the given figure TP and TQ are two tangents to the circle with centre O, touching at A and C respectively. If $\angle BCQ = 55^\circ$ and $\angle BAP = 60^\circ$, find: [4]

(i) $\angle OBA$ and $\angle OBC$
(ii) $\angle AOC$
(iii) $\angle ATC$', 4, 'Circles', 'long', 5, 'c628be__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-c628be-8-0', 'c628be', 21, '8', '(a) What must be added to the polynomial $2x^3 - 3x^2 - 8x$, so that it leaves a remainder 10 when divided by $2x + 1$? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-c628be-8-1', 'c628be', 22, '8', '(b) Mr.Sonu has a recurring deposit account and deposits ₹ 750 per month for 2 years. If he gets ₹ 19125 at the time of maturity, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-c628be-8-2', 'c628be', 23, '8', '(c) Use graph paper for this question. [4]

Take 1 cm = 1 unit on both $x$ and $y$ axes.

(i) Plot the following points on your graph sheets:

A(-4, 0), B(-3, 2), C(0, 4), D(4, 1) and E(7, 3)

(ii) Reflect the points B, C, D and E on the $x$-axis and name them as B'', C'', D'' and E'' respectively.
(iii) Join the points A, B, C, D, E, E'', D'', C'', B'' and A in order.
(iv) Name the closed figure formed.', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-c628be-9-0', 'c628be', 24, '9', '(a) 40 students enter for a game of shot-put competition. The distance thrown (in metres) is recorded below:

| Distance in m | 12 – 13 | 13 – 14 | 14 – 15 | 15 – 16 | 16 – 17 | 17 – 18 | 18 – 19 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of Students | 3 | 9 | 12 | 9 | 4 | 2 | 1 |

Use a graph paper to draw an ogive for the above distribution.

Use a scale of 2 cm = 1 m on one axis and 2 cm = 5 students on the other axis.

Hence using your graph find:

- (i) the median
- (ii) Upper Quartile
- (iii) Number of students who cover a distance which is above $16\frac{1}{2}$ m.', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-c628be-9-1', 'c628be', 25, '9', '(b) If $x = \frac{\sqrt{2a + 1} + \sqrt{2a - 1}}{\sqrt{2a + 1} - \sqrt{2a - 1}}$, prove that $x^2 - 4ax + 1 = 0$ [4]', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-c628be-10-0', 'c628be', 26, '10', '- (a) If the 6th term of an A.P. is equal to four times its first term and the sum of first six terms is 75, find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-c628be-10-1', 'c628be', 27, '10', '- (b) The difference of two natural numbers is 7 and their product is 450. [3]
Find the numbers.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-c628be-10-2', 'c628be', 28, '10', '- (c) Use ruler and compass for this question. Construct a circle of radius 4.5 cm. [4]
Draw a chord. AB = 6 cm.

(i) Find the locus of points equidistant from A and B.

Mark the point where it meets the circle as D.

(ii) Join AD and find the locus of points which are equidistant from AD and AB.

Mark the point where it meets the circle as C.

(iii) Join BC and CD. Measure and write down the length of side CD of the quadrilateral ABCD.', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-c628be-11-0', 'c628be', 29, '11', '(a) A model of a high rise building is made to a scale of 1 : 50. [3]

(i) If the height of the model is 0.8 m, find the height of the actual building.
(ii) If the floor area of a flat in the building is 20 m², find the floor area of that in the model.', 3, 'Similarity', 'short', 7, NULL, NULL),
  ('MQ-c628be-11-1', 'c628be', 30, '11', '(b) From a solid wooden cylinder of height 28 cm and diameter 6 cm, two conical cavities are hollowed out. The diameters of the cones are also of 6 cm and height 10.5 cm. [3]

Taking $$\pi = \frac{22}{7}$$ find the volume of the remaining solid.', 3, 'Mensuration', 'short', 7, 'c628be__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-c628be-11-2', 'c628be', 31, '11', '(c) Prove the identity [4]

$$\left(\frac{1 - \tan \theta}{1 - \cot \theta}\right)^2 = \tan^2 \theta$$', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-405263-1-0', '405263', 0, '1', '1. (a) Solve the following Quadratic Equation : [3]

$$x^2 - 7x + 3 = 0$$

Give your answer correct to two decimal places.', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-405263-1-2', '405263', 1, '1', '(c) Using ruler and compass construct a triangle $ABC$ where $AB = 3$ cm, $BC = 4$ cm and $\angle ABC = 90^\circ$. Hence construct a circle circumscribing triangle $ABC$. Measure and write down the radius of the circle. [4]', 4, 'Constructions', 'long', 1, '405263__ICSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-405263-2-0', '405263', 2, '2', '2. (a) Use factor theorem to factorise $6x^3 + 17x^2 + 4x - 12$ completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-405263-2-1', '405263', 3, '2', '(b) Solve the following inequation and represent the solution set on the number line. [3]

$$\frac{3x}{5} + 2 < x + 4 \leq \frac{x}{2} + 5, x \in R$$', 3, 'Linear Inequations', 'short', 1, '405263__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-405263-3-0', '405263', 4, '3', '3. (a) In the figure given below, O is the centre of the circle and AB is a diameter. [3] If AC = BD and $$\angle AOC = 72^\circ$$. Find:

- (i) $$\angle ABC$$
- (ii) $$\angle BAD$$
- (iii) $$\angle ABD$$', 3, 'Circles', 'short', 2, '405263__ICSE_X_Mat_p2_img_2_jpeg.webp', NULL),
  ('MQ-405263-3-1', '405263', 5, '3', '(b) Prove that : [3]

$$\frac{\sin A}{1+\cot A} \quad \frac{\cos A}{1+\tan A} = \sin A - \cos A$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-405263-3-2', '405263', 6, '3', '(c) In what ratio is the line joining P(5, 3) and Q(-5, 3) divided by the y-axis ? Also find the coordinates of the point of intersection. [4]', 4, 'Coordinate Geometry', 'long', 2, '405263__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-405263-4-0', '405263', 7, '4', '4. (a) A solid spherical ball of radius $6\mathrm{cm}$ is melted and recast into 64 identical spherical marbles. Find the radius of each marble. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-405263-4-1', '405263', 8, '4', '(b) Each of the letters of the word ''AUTHORIZES'' is written on identical circular discs and put in a bag. They are well shuffled. If a disc is drawn at random from the bag, what is the probability that the letter is :

(i) a vowel?

(ii) one of the first 9 letters of the English alphabet which appears in the given word?
(iii) one of the last 9 letters of the English alphabet which appears in the given word? [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-405263-4-2', '405263', 9, '4', '(c) Mr. Bedi visits the market and buys the following articles:

Medicines costing ₹ 950, GST @ 5%

A Pair of shoes costing ₹ 3000, GST @ 18%

A Laptop bag costing ₹ 1000 with a discount of $30\%$ GST @ $18\%$

(i) Calculate the total amount of GST paid.
(ii) The total bill amount including GST paid by Mr. Bedi. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-405263-5-0', '405263', 10, '5', '5. (a) A company with 500 shares of nominal value ₹ 120 declares an annual dividend of 15%. Calculate :

(i) the total amount of dividend paid by the company.
(ii) annual income of Mr. Sharma who holds 80 shares of the company. [3] If the return percent of Mr. Sharma from his shares is \(10\%\). Find the market value of each share.', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-405263-6-0', '405263', 11, '6', '6. (a) If $A = \begin{bmatrix} 3 & 0 \\ 5 & 1 \end{bmatrix}$ and $B = \begin{bmatrix} -4 & 2 \\ 1 & 0 \end{bmatrix}$ [3]

Find $A^2 - 2AB + B^2$ .', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-405263-6-2', '405263', 12, '6', '(c) From the top of a cliff, the angle of depression of the top and bottom of a tower are observed to be $45^{\circ}$ and $60^{\circ}$ respectively. If the height of the tower is $20\mathrm{m}$ . [4]

Find :

(i) the height of the cliff.
(ii) the distance between the cliff and the tower.', 4, 'Trigonometry', 'long', 5, '405263__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-405263-7-0', '405263', 13, '7', '7. (a) Find the value of ‘$p$’ if the lines, $5x - 3y + 2 = 0$ and $6x - py + 7 = 0$ are perpendicular to each other. Hence, find the equation of a line passing through $(-2, -1)$ and parallel to $6x - py + 7 = 0$. [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-405263-7-2', '405263', 14, '7', '(c) In the given figure $TP$ and $TQ$ are two tangents to the circle with centre $O$, touching at $A$ and $C$ respectively. If $\angle BCQ = 55^\circ$ and $\angle BAP = 60^\circ$, find:

(i) \(\angle OBA\) and \(\angle OBC\)
(ii) \(\angle AOC\)
(iii) \(\angle ATC\)', NULL, 'Circles', 'short', 6, '405263__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-405263-8-0', '405263', 15, '8', '8. (a) What must be added to the polynomial $2x^3 - 3x^2 - 8x$ , so that it leaves a remainder 10 when divided by $2x + 1$ ? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 7, NULL, NULL),
  ('MQ-405263-8-1', '405263', 16, '8', '(b) Mr. Sona has a recurring deposit account and deposits ₹ 750 per month for 2 years.

If he gets ₹ 19125 at the time of maturity, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-405263-8-2', '405263', 17, '8', '(c) Use graph paper for this question.

Take $1\mathrm{cm} = 1$ unit on both $x$ and $y$ axes. [4]

(i) Plot the following points on your graph sheets. $A(-4,0), B(-3,2), C(0,4), D(4,1)$ and E(7,3)

(ii) Reflect the points $B, C, D$ and $E$ on the $x$ -axis and name them as $B'', C'', D''$ and $E''$ respectively.

(iii) Join the points $A, B, C, D, E, E'', D'', C, B''$ and $A$ in order.

(iv) Name the closed figure formed.', 4, 'Coordinate Geometry', 'long', 7, '405263__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-405263-9-0', '405263', 18, '9', '9. (a) 40 Students enter for a game of shot-put competition. The distance thrown (in metres) is recorded below :

| Distance in m | 12 – 13 | 13 – 14 | 14 – 15 | 15 – 16 | 16 – 17 | 17 – 18 | 18 – 19 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of Students | 3 | 9 | 12 | 9 | 4 | 2 | 1 |

Use a graph paper to draw an ogive for the above distribution.

Use a scale of $2\mathrm{cm} = 1\mathrm{m}$ on one axis and $2\mathrm{cm} = 5$ students on the other axis.

Hence, using your graph find :

(i) the median.
(ii) upper qartile.

(iii) number of students who cover a distance which is above $16\frac{1}{2}\mathrm{m}$ . [6]', 6, 'Statistics', 'long', 8, '405263__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-405263-9-1', '405263', 19, '9', '(b) If $x = \frac{\sqrt{2a + 1} + \sqrt{2a - 1}}{\sqrt{2a + 1} - \sqrt{2a - 1}}$ , prove that $x^2 - 4ax + 1$

$$
= 0. \tag {4}
$$', 4, 'Ratio and Proportion', 'long', 8, NULL, NULL),
  ('MQ-405263-10-0', '405263', 20, '10', '10. (a) If the $6^{\text{th}}$ term of an A.P. is equal to four times its first term and the sum of fist six terms is 75, find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 9, NULL, NULL),
  ('MQ-405263-10-2', '405263', 21, '10', '(c) Use ruler and compass for this question. Construct a circle of radius \(4.5\mathrm{cm}\). Draw a chord \(AB = 6\mathrm{cm}\).
(i) Find the locus of points equidistant from \( A \) and \( B \).

Mark the point where it meets the circle as $D$.

(ii) Join \(AD\) and find the locus of points which are equidistant from \(AD\) and \(AB\). Mark the point where it meets the circle as \(C\).
(iii) Join \(BC\) and \(CD\), Mesuare and write down the length of side \(CD\) of the quadrilateral \(ABCD\). [4]', 4, 'Constructions', 'long', 9, '405263__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-405263-11-0', '405263', 22, '11', '11. (a) A model of a high rise building is made to a scale of $1:50$. [3]

(i) If the height of the model is \(0.8\mathrm{m}\), find the height of the actual building.
(ii) If the floor area of a flat in the building is \(20\mathrm{m}^2\), find the floor area of that in the model.', 3, 'Similarity', 'short', 10, NULL, NULL),
  ('MQ-405263-11-1', '405263', 23, '11', '(b) From a solid wooden cylinder of height $28\mathrm{cm}$ and diameter $6\mathrm{cm}$, two conical cavities are hollowed out. The diameters of the cones are also of $6\mathrm{cm}$ and height $10.5\mathrm{cm}$.

Taking $\pi = \frac{22}{7}$ find the volume of the remaining solid.', NULL, 'Mensuration', 'short', 10, '405263__ICSE_X_Mat_p10_img_1_jpeg.webp', NULL),
  ('MQ-405263-11-2', '405263', 24, '11', '(c) Prove the identity

$$
\left(\frac{1 - \tan \theta}{1 - \cot \theta}\right)^2 = \tan^2 \theta \tag{4}
$$', 4, 'Trigonometry', 'long', 10, NULL, NULL),
  ('MQ-bdb81a-1-2', 'bdb81a', 0, '1', '(c) Using ruler and compass construct a triangle ABC where AB = 3 cm, BC = 4 cm and [4]

∠ABC = 90°. Hence construct a circle circumscribing the triangle ABC. Measure and write down the radius of the circle.', 4, 'Constructions', 'long', 1, NULL, NULL),
  ('MQ-bdb81a-3-0', 'bdb81a', 1, '3', '(a) In the figure given below, O is the centre of the circle and AB is a diameter. [3]

If AC = BD and ∠AOC = 72°. Find:

(i) \(\angle ABC\)
(ii) \(\angle BAD\)
(iii) \(\angle ABD\)', 3, 'Circles', 'short', 2, 'bdb81a__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-bdb81a-6-0', 'bdb81a', 2, '6', '(a) If $$A = \begin{bmatrix} 3 & 0 \\ 5 & 1 \end{bmatrix}$$ and $$B = \begin{bmatrix} -4 & 2 \\ 1 & 0 \end{bmatrix}$$ [3]

Find $$A - 2AB + B^2$$', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-bdb81a-6-1', 'bdb81a', 3, '6', '(b) In the given figure AB = 9 cm, PA = 7.5 cm and PC = 5 cm. [3]

Chord: AD and BC intersect at P.

(i) Prove that \(\Delta \mathrm{PAB} \sim \Delta \mathrm{PCD}\)
(ii) Find the length of CD.
(iii) Find area of \(\Delta \mathrm{PAB}\) : area of \(\Delta \mathrm{PCD}\)', 3, 'Similarity', 'short', 4, 'bdb81a__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-bdb81a-7-2', 'bdb81a', 4, '7', '(c) In the given figure TP and TQ are two tangents to the circle with centre O, touching at A and C respectively. If ∠BCQ = 55° and ∠BAP = 60°, find: [4]

(i) \(\angle OBA\) and \(\angle OBC\)
(ii) \(\angle AOC\)
(iii) \(\angle ATC\)', 4, 'Circles', 'long', 5, 'bdb81a__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-bdb81a-8-1', 'bdb81a', 5, '8', '(b) Mr.Sonu has a recurring deposit account and deposits ₹ 750 per month for 2 years. [3] If he gets ₹ 19125 at the time of maturity, find the rate of interest.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-bdb81a-9-0', 'bdb81a', 6, '9', '(a) 40 students enter for a game of shot-put competition. The distance thrown (in metres) is recorded below: [6]

| Distance in m | 12 – 13 | 13 – 14 | 14 – 15 | 15 – 16 | 16 – 17 | 17 – 18 | 18 – 19 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of Students | 3 | 9 | 12 | 9 | 4 | 2 | 1 |

Use a graph paper to draw an ogive for the above distribution.

Use a scale of 2 cm = 1 m on one axis and 2 cm = 5 students on the other axis.

Hence using your graph find:

(i) the median
(ii) Upper Quartile
(iii) Number of students who cover a distance which is above \(16\frac{1}{2}\mathrm{m}\).', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-bdb81a-10-0', 'bdb81a', 7, '10', '(a) If the \(6^{\text{th}}\) term of an A.P. is equal to four times its first term and the sum of first six terms is 75, find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-bdb81a-10-2', 'bdb81a', 8, '10', '(c) Use ruler and compass for this question. Construct a circle of radius \(4.5\mathrm{cm}\). Draw a chord. \(\mathrm{AB} = 6\mathrm{cm}\).

( ) Find the locus of points equidistant from A and B.

Mark the point where it meets the circle as D.

(i) Join AD and find the locus of points which are equidistant from AD and AB.

Mark the point where it meets the circle as C.

(ii) Join BC and CD. Measure and write down the length of side CD of the quadrilateral ABCD.', NULL, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-bdb81a-11-0', 'bdb81a', 9, '11', '(a) A model of a high rise building is made to a scale of 1 : 50. [3]

(i) If the height of the model is \(0.8\mathrm{m}\), find the height of the actual building.
(ii) If the floor area of a flat in the building is \(20\mathrm{m}^2\), find the floor area of that in the model.', 3, 'Similarity', 'short', 7, NULL, NULL),
  ('MQ-ebe936-1-0', 'ebe936', 0, '1', 'a. ₹480 is divided equally among x children. If the number of children were 20 more, then each would have got ₹12 less. find x. (4)', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-ebe936-1-1', 'ebe936', 1, '1', 'b. The sum of \( 4^{\text{th}} \) and \( 8^{\text{th}} \) term of an AP is 24 and the sum of \( 6^{\text{th}} \) and \( 10^{\text{th}} \) terms is 34. Find the first term and common difference. (4)', 4, 'Arithmetic Progression', 'long', 1, NULL, NULL),
  ('MQ-ebe936-1-2', 'ebe936', 2, '1', 'c. Solve: \( 2x - \frac{3}{x} = 5 \) without using formula (2)', 2, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-ebe936-2-0', 'ebe936', 3, '2', 'a. Find the value of ''k'' if (x-2) is a factor of \( x^3 + 2x^2 - kx + 10 \). Hence determine whether (x+5) is also a factor. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-ebe936-2-1', 'ebe936', 4, '2', 'b. The radius and the slant height of a cone are in the ratio 4:7. If its Curved surface area is \(792cm^2\), find its radius. (use \(\Pi = \frac{22}{7}\)) (3)', 3, 'Mensuration', 'short', 1, NULL, NULL),
  ('MQ-ebe936-2-2', 'ebe936', 5, '2', 'c. Mohan has a recurring deposit account in a bank for 2 years at \(6\%\) per annum simple interest. If he gets \(\text{1200}\) as interest at the time of maturity, find: (i) the monthly installment (ii) The amount of maturity (4)', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-ebe936-3-0', 'ebe936', 6, '3', 'a. If \( b \) is the mean proportional between \( a \) and \( c \), prove that \( (ab + bc) \) is the mean proportional between \( (a^2 + b^2) \) and \( (b^2 + c^2) \) (3)', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-ebe936-3-1', 'ebe936', 7, '3', 'b. Evaluate without using Trigonometrical tables:

$$2(\frac{\tan 35^{\circ}}{\cot 55^{\circ}})^{2} + (\frac{\cot 55^{\circ}}{\tan 35^{\circ}})^{2} - 3(\frac{\sec 40^{\circ}}{\cosec 50^{\circ}}) \tag{3}$$', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-ebe936-3-2', 'ebe936', 8, '3', 'c. Two pipes running together can fill a cistern in $2\frac{8}{11}$ minutes. If one pipe takes one minute more than the other to fill the cistern, find the time in which each pipe will fill the cistern. (4)', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-ebe936-4-0', 'ebe936', 9, '4', 'a. In the given figure $\Delta ABC$ and $\Delta AMP$ are right angled at B and M respectively. Given AC=10cm, AP = 15cm and PM = 12cm.

(i) Prove that \(\Delta ABC\sim \Delta AMP\)
(ii) Find AB and BC (4)', 4, 'Similarity', 'long', 2, 'ebe936__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-ebe936-4-1', 'ebe936', 10, '4', 'b. When divided by (x-3), the polynomials $x^3 - px^2 + x + 6$ and $2x^3 - x^2 - (p + 3)x - 6$ leave the same remainder. Find the value of ''p'' (3)', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-ebe936-4-2', 'ebe936', 11, '4', 'c. Prove that $\frac{\tan^2\theta}{(\sec\theta - 1)^2} = \frac{1 + \cos\theta}{1 - \cos\theta}$ (3)', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-ebe936-5-0', 'ebe936', 12, '5', 'a. Ashima has a recurring deposit account in a bank for 5 years at \(9 \%\) p.a. At the time of maturity, she gets ₹51,607.50. Find the monthly installment. (4)', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-ebe936-5-1', 'ebe936', 13, '5', 'b. In an AP the first term is 8, nth term is 33 and the sum of first n terms is 123. Find n and d. (3)', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ebe936-5-2', 'ebe936', 14, '5', 'c. A solid cone of radius \(5\mathrm{cm}\) and height \(8\mathrm{cm}\) is melted and made into small spheres of radius \(0.5\mathrm{cm}\). Find the number of spheres formed. (3)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-ebe936-6-1', 'ebe936', 15, '6', 'b. In the adjoining figure, ABC is a right angled triangle with \(\angle BAC = 90^{\circ}\) and AD is perpendicular to BC.

(i) Prove that \(\Delta \mathrm{ADB} \sim \Delta \mathrm{CDA}\)
(ii) If \(BD = 18\mathrm{cm}\) and \(CD = 8\mathrm{cm}\), find AD.
(iii) Find the ratio of the area of \(\Delta\)ADB and area of \(\Delta\)CDA (4)', 4, 'Similarity', 'long', 3, 'ebe936__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-ebe936-6-2', 'ebe936', 16, '6', 'c. If x, y, z are in continued proportion, prove that $$\frac{(x+y)^2}{(y+z)^2} = \frac{x}{z}$$ (3)', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-ebe936-7-0', 'ebe936', 17, '7', 'a. Using the remainder theorem, factorise the polynomial completely: \(3x^{3} + 2x^{2} - 19x + 6\) (4)', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-ebe936-7-1', 'ebe936', 18, '7', 'b. Without solving the following quadratic equation, find ''m'' for which the given equation has real and equal roots: \( x^{2} + 2(m - 1)x + (m + 5) = 0 \) (3)', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-ebe936-7-2', 'ebe936', 19, '7', 'c. The volume of a cylinder is \(448\pi cm^3\) and height \(7cm\). Find the curved surface area and total surface area. (3)', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-ebe936-8-0', 'ebe936', 20, '8', 'a. In ΔABC, DE ∥BC. If AD =x-5, DB = 3x -19, AE=3 and EC = x-3, find x. (3)', 3, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-ebe936-8-1', 'ebe936', 21, '8', 'b. What must be added to the numbers 6, 10, 14 and 22 to make them in proportion? (3)', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-ebe936-8-2', 'ebe936', 22, '8', 'c. Solve $4x^2 - 5x - 3 = 0$ for $x$ and give your answer correct to two decimal places. (4)', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-ebe936-9-0', 'ebe936', 23, '9', 'a. Find the remainder when $f(x) = 2x^3 - 3x^2 - 4x - 5$ is divided by $(2x+1)$. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-ebe936-9-1', 'ebe936', 24, '9', 'b. If 7 times of 7$^{th}$ term of an AP is equal to 11 times of its 11$^{th}$ term, then show that its 18$^{th}$ term is zero. (3)', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-ebe936-9-2', 'ebe936', 25, '9', 'c. Solve: $2\left(\frac{x}{1+x}\right)^2 - 5\left(\frac{x}{1+x}\right) + 2 = 0$ (4)', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-ebe936-10-0', 'ebe936', 26, '10', 'a. If $x = \frac{\sqrt{a+1}+\sqrt{a-1}}{\sqrt{a+1}-\sqrt{a-1}}$, using properties show that $x^2 - 2ax + 1 = 0$ (4)', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-ebe936-10-1', 'ebe936', 27, '10', 'b. Form a quadratic equation whose roots are 2 and -5 (2)', 2, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-ebe936-10-2', 'ebe936', 28, '10', 'c. David opened a recurring deposit account in a bank and deposited ₹300 per month for two years. If he received ₹7725 at the time of maturity find the rate of interest per annum. (4)', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-ebe936-11-0', 'ebe936', 29, '11', 'a. A toy is in the form of a cone mounted on a hemisphere of radius 3.5cm. The total height of the toy is 15.5cm. Find the total surface area. (4)', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-ebe936-11-1', 'ebe936', 30, '11', 'b. Prove that $(\cosec A - \sin A)(\sec A - \cos A)\sec^2 A = \tan A$ (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-ebe936-11-2', 'ebe936', 31, '11', 'c. The sum of two numbers is 8 and the sum of their squares is 34. Find the numbers. (3)', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-3c2b77-1-0', '3c2b77', 0, '1', '(i) The probability of getting a number divisible by 3 in throwing a dice is:', 1, 'Probability', 'MCQ', 1, NULL, array['$\frac{1}{6}$', '$\frac{1}{3}$', '$\frac{1}{2}$', '$\frac{2}{3}$']::text[]),
  ('MQ-3c2b77-1-1', '3c2b77', 1, '1', '(ii) The volume of a conical tent is $462 \, \text{m}^3$ and the area of the base is $154 \, \text{m}^2$. The height of the cone is:', 1, 'Mensuration', 'MCQ', 1, NULL, array['$15\mathrm{m}$', '$12\mathrm{m}$', '$9\mathrm{m}$', '$24\mathrm{m}$']::text[]),
  ('MQ-3c2b77-1-2', '3c2b77', 2, '1', '(iii) The median class for the given distribution is:
| Class Interval | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 |
| --- | --- | --- | --- | --- |
| Frequency | 2 | 4 | 3 | 5 |', 1, 'Statistics', 'MCQ', 1, NULL, array['0-10', '10-20', '20-30', '30-40']::text[]),
  ('MQ-3c2b77-1-3', '3c2b77', 3, '1', '(iv) If two lines are perpendicular to one another then the relation between their slopes $m_{1}$ and $m_{2}$ is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$m_{1} = m_{2}$', '$m_{1} = \frac{1}{m_{2}}$', '$m_{1} = -m_{2}$', '$m_{1} \times m_{2} = -1$']::text[]),
  ('MQ-3c2b77-1-4', '3c2b77', 4, '1', '(v) A lighthouse is $80 \, \text{m}$ high. The angle of elevation of its top from a point $80 \, \text{m}$ away from its foot along the same horizontal line is:', 1, 'Trigonometry', 'MCQ', 1, '3c2b77__ICSE_X_Mat_p2_img_0_jpeg.webp', array['$60^{\circ}$', '$45^{\circ}$', '$30^{\circ}$', '$90^{\circ}$']::text[]),
  ('MQ-3c2b77-1-5', '3c2b77', 5, '1', '(vi) The modal class of a given distribution always corresponds to the:', 1, 'Statistics', 'MCQ', 1, NULL, array['interval with highest frequency', 'interval with lowest frequency', 'the first interval', 'the last interval']::text[]),
  ('MQ-3c2b77-1-6', '3c2b77', 6, '1', '(vii) The coordinates of the point $\mathbf{P}(-3, 5)$ on reflecting on the X axis are:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(3, 5)', '$(-3, -5)$', '$(3, -5)$', '$(-3, 5)$']::text[]),
  ('MQ-3c2b77-1-7', '3c2b77', 7, '1', '(viii) ABCD is a cyclic quadrilateral. If $\angle \mathrm{BAD} = (2x + 5)^{\circ}$ and $\angle \mathrm{BCD} = (x + 10)^{\circ}$ then $x$ is equal to:', 1, 'Circles', 'MCQ', 1, '3c2b77__ICSE_X_Mat_p1_img_0_jpeg.webp', array['$65^{\circ}$', '$45^{\circ}$', '$55^{\circ}$', '$5^{\circ}$']::text[]),
  ('MQ-3c2b77-1-8', '3c2b77', 8, '1', '(ix) A(1, 4), B (4, 1) and C $(x, 4)$ are the vertices of $\Delta ABC$. If the centroid of the triangle is G (4, 3) then $x$ is equal to', 1, 'Coordinate Geometry', 'MCQ', 1, '3c2b77__ICSE_X_Mat_p2_img_1_jpeg.webp', array['2', '1', '7', '4']::text[]),
  ('MQ-3c2b77-1-9', '3c2b77', 9, '1', '(x) The radius of a roller $100\mathrm{cm}$ long is $14\mathrm{cm}$. The curved surface area of the roller is:
(Take $\pi = \frac{22}{7}$)', 1, 'Mensuration', 'MCQ', 1, NULL, array['$13200\mathrm{cm}^2$', '$15400\mathrm{cm}^2$', '$4400\mathrm{cm}^2$', '$8800\mathrm{cm}^2$']::text[]),
  ('MQ-3c2b77-2-0', '3c2b77', 10, '2', '2. (i) Prove that

[2]

$$
\frac {1}{1 + \sin \theta} + \frac {1}{1 - \sin \theta} = 2 \sec^ {2} \theta
$$', 2, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-3c2b77-2-1', '3c2b77', 11, '2', '(ii) Find $a$ if A $(2a + 2, 3)$ , B $(7, 4)$ and C $(2a + 5, 2)$ are collinear.

[2]', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-3c2b77-2-2', '3c2b77', 12, '2', '(iii) Calculate the mean of the following frequency distribution [3]

| Class Interval | 5 - 15 | 15 - 25 | 25 - 35 | 35 - 45 | 45 - 55 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 6 | 4 | 8 | 4 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-3c2b77-2-3', '3c2b77', 13, '2', '(iv) In the given figure O is the centre of the circle. PQ and PR are tangents and $\angle QPR = 70^{\circ}$ Calculate: [3]
(a) \(\angle QOR\)
(b) \(\angle QSR\)', 3, 'Circles', 'short', 3, '3c2b77__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-3c2b77-3-0', '3c2b77', 14, '3', '3. (i) A bag contains 5 white, 2 red and 3 black balls. A ball is drawn at random. What is the probability that the ball drawn is a red ball? [2]', 2, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-3c2b77-3-1', '3c2b77', 15, '3', '(ii) A solid cone of radius \(5\mathrm{cm}\) and height \(9\mathrm{cm}\) is melted and made into small cylinders of radius of \(0.5\mathrm{cm}\) and height \(1.5\mathrm{cm}\). Find the number of cylinders so formed. [2]', 2, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-3c2b77-3-2', '3c2b77', 16, '3', '(iii) Two lamp posts AB and CD each of height 100 m are on either side of the road. P is a point on the road between the two lamp posts. The angles of elevation of the top of the lamp posts from the point P are \(60^{\circ}\) and \(30^{\circ}\). Find the distances PB and PD. [3]', 3, 'Trigonometry', 'short', 3, '3c2b77__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-3c2b77-3-3', '3c2b77', 17, '3', '(iv) Marks obtained by 100 students in an examination are given below. [3]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 5 | 15 | 20 | 28 | 20 | 12 |

Draw a histogram for the given data using a graph paper and find the mode.

Take 2 cm = 10 marks along one axis and 2 cm = 10 students along the other axis.', 3, 'Statistics', 'short', 4, '3c2b77__ICSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-3c2b77-4-0', '3c2b77', 18, '4', '4. (i) Find a point P which divides internally the line segment joining the points A (-3, 9) and B (1, -3) in the ratio 1:3. [2]', 2, 'Coordinate Geometry', 'short', 4, '3c2b77__ICSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-3c2b77-4-1', '3c2b77', 19, '4', '(ii) A letter of the word ''SECONDARY'' is selected at random. What is the probability that the letter selected is not a vowel? [2]', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-3c2b77-4-2', '3c2b77', 20, '4', '(iii) Use a graph paper for this question. Take 2 cm - 1 unit along both the axes. [3]

(a) Plot the points A (0, 4), B (2, 2), C(5, 2) and D (4, 0), E(0, 0) is the origin.

(b) Reflect B, C, D on the Y-axis and name them as B'', C'' and D'' respectively.
(c) Join the points ABCDD''C''B'' and A in order and give a geometrical name to the closed figure.', 3, 'Coordinate Geometry', 'short', 4, '3c2b77__ICSE_X_Mat_p5_img_2_jpeg.webp', NULL),
  ('MQ-3c2b77-4-3', '3c2b77', 21, '4', '(iv) A solid wooden cylinder is of radius 6 cm and height \(16\mathrm{cm}\). Two cones each of radius \(2\mathrm{cm}\) and height \(6\mathrm{cm}\) are drilled out of the cylinder. Find the volume of the remaining solid. [3]', 3, 'Mensuration', 'short', 5, '3c2b77__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-3c2b77-5-0', '3c2b77', 22, '5', '5. (i) Two chords AB and CD of a circle intersect externally at E. If EC = 2 cm, EA = 3 cm and AB = 5 cm, find the length of CD. [2]', 2, 'Circles', 'short', 6, '3c2b77__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-3c2b77-5-1', '3c2b77', 23, '5', '(ii) Line AB is perpendicular to CD coordinates of B, C and D respectively (4, 0), (0, -1) and (4, 3). [2]
Find

(a) Slope of CD
(b) Equation of AB', 2, 'Coordinate Geometry', 'short', 6, '3c2b77__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-3c2b77-5-2', '3c2b77', 24, '5', '(iii) Prove that: [3]

$$
\frac {\left(1 + \sin \theta\right) ^ {2} + \left(1 - \sin \theta\right) ^ {2}}{2 \cos^ {2} \theta} = \sec^ {2} \theta + \tan^ {2} \theta
$$', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-3c2b77-5-3', '3c2b77', 25, '5', '(iv) The mean of the following distribution is 50. Find the unknown frequency. [3]

| Class Interval | Frequency |
| --- | --- |
| 0 - 20 | 6 |
| 20 - 40 | f |
| 40 - 60 | 8 |
| 60 - 80 | 12 |
| 80 - 100 | 8 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-3c2b77-6-0', '3c2b77', 26, '6', '6. (i) Prove that: [2]

$$
1 + \frac {\tan^ {2} \theta}{1 + \sec \theta} = \sec \theta
$$', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-3c2b77-6-1', '3c2b77', 27, '6', '(ii) In the given figure A, B, C and D are points on the circle with centre O. Given $\angle ABC = 62^{\circ}$ . [2]

Find:
(a) $\angle ADC$ (b) $\angle CAB$', 2, 'Circles', 'short', 7, '3c2b77__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-3c2b77-6-2', '3c2b77', 28, '6', '(iii) Find the equation of a line parallel to the line $2x + y - 7 = 0$ and passing through the intersection of the lines $x + y - 4 = 0$ and $2x - y = 8$ . [3]', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-3c2b77-6-3', '3c2b77', 29, '6', '(iv) Marks obtained by 40 students in an examination are given below. [3]

| Marks | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 3 | 8 | 14 | 9 | 4 | 2 |

Using graph paper draw an ogive and estimate the median marks. Take $2\mathrm{cm} = 10$ marks along one axis and $2\mathrm{cm} = 5$ students along the other axis.', 3, 'Statistics', 'short', 7, '3c2b77__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-87ae07-1-0', '87ae07', 0, '1', '(i) A consumer bought a TV from a dealer at a discount of 20% on the marked price of Rs.40,000. If the rate of GST is 18%, then the tax paid by the consumer is :

a) 5760 b) 2880 c) nil d) 7200', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-1', '87ae07', 1, '1', '(ii) A man deposited Rs.1000 per month in a recurring deposit for 3 years at 8% p.a. The maturity value is :

a) 44,000 b) 40,000 c) 40,440 d) 44,444', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-2', '87ae07', 2, '1', '(iii) If $2x - 5 \leq 5x + 4 < 11x \in \mathbb{I}$ , then:

a) $-3 \leq x \leq 1.4$ b) $-3 \leq x \leq 2$ c) $-3 < x < 1$ d) $-3 > x$', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-3', '87ae07', 3, '1', '(iv) The Discriminant of the quadratic equation $3x^2 - 4x + 2 = 0$ is :

a) 8 b) -8 c) 16 d) $-\sqrt{8}$', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-4', '87ae07', 4, '1', '(v) Rs.9100 were divided among A, B and C in the ratio $\frac{1}{2} : \frac{1}{3} : \frac{1}{4}$ , then A''s share is:

a) 4,200 b) 2,100 c) 2,800 d) 3,000', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-5', '87ae07', 5, '1', '(vi) If $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ , $B = \begin{bmatrix} 4 & 0 \\ -2 & 2 \end{bmatrix}$ : Find $AB + BA =$

a) $\begin{bmatrix} 2 & 3 \\ 12 & 8 \end{bmatrix}$ b) $\begin{bmatrix} 8 & 8 \\ 12 & 12 \end{bmatrix}$ c) $\begin{bmatrix} 12 & 8 \\ 8 & 12 \end{bmatrix}$ d) $\begin{bmatrix} 8 & 12 \\ 8 & 12 \end{bmatrix}$', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-6', '87ae07', 6, '1', '(vii) Find the value of k, if $f(x) = x^2 - kx + 12$ is exactly divisible by $(x - 3)$ .

a) $k = 5$ b) $k = 15$ c) $k = 9$ d) $k = 12$', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-7', '87ae07', 7, '1', '(viii) For the AP -8, -4, 0, 4, ... Find the 10$^{th}$ term is:

a) 30 b) -28 c) 28 d) -30', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-8', '87ae07', 8, '1', '(ix) The reflection of the point $P(-2,3)$ in the x-axis is _____.

a) (2,3) b) (2,-3) c) (-2,-3) d) (-2,0)', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-9', '87ae07', 9, '1', '(x) If one end of a diameter of a circle is (2,3) and the centre is (-2,5), then the other end is:

a) (-6,7) b) (6,-7) c) (0,8) d) (-6,7)', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-10', '87ae07', 10, '1', '(xi) The inclination of the line $y = \sqrt{3}x - 5$ is :

a) $30^\circ$ b) $60^\circ$ c) $45^\circ$ d) $90^\circ$', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-87ae07-1-11', '87ae07', 11, '1', '(xii) There are ______ two tangents to a circle passing through a point lying outside the circle.
a) At least b) at most c) exactly d) maximum', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-87ae07-1-12', '87ae07', 12, '1', '(xiii) If R and r be the external and internal radii, and h be the height of hollow cylinder, then volume of material is:
a) $2\pi(R^2 - r^2)h$ b) $\pi(R^2 - r^2)h$ c) $\pi(r^2 - R^2)h$ d) $2\pi(R - r)h$', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-87ae07-1-13', '87ae07', 13, '1', '(xiv) If $\sin A + \cos A = \sqrt{3}$, then $\tan A + \cot A =$
a) -1 b) 1 c) $\sqrt{3} + 1$ d) 0', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-87ae07-1-14', '87ae07', 14, '1', '(xv) The ______ quartile is the median, denoted by $Q_2$
a) $4n + 3$ b) $3n + 1$ c) $n + 3$ d) $5 + 3n$', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-87ae07-2-0', '87ae07', 15, '2', 'Q2) (a) Use the graph paper for this question.

The marks obtained by 120 students in an English test are given below :

[4]

| Marks | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. Of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw the give and hence, estimate:

(i) The median marks.

(ii) The number of students who did not pass the test if the pass percentage was 50.

(iii) The upper quartile marks.', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-87ae07-2-1', '87ae07', 16, '2', '(b) Prove that :- $\frac{\sin \theta}{1 - \cot \theta} + \frac{\cos \theta}{1 - \tan \theta} = \cos \theta + \sin \theta$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-87ae07-2-2', '87ae07', 17, '2', '(c) The surface area of a solid metallic sphere is $2464 \text{ cm}^2$. It is melted and recast into solid right circular cones of radius 3.5 cm and height 7 cm. Calculate :

(i) the radius of sphere, (ii) the number of cone recast. (take $\pi = 22/7$) 4', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-87ae07-3-0', '87ae07', 18, '3', 'Q3) (a) In $\triangle ABC$, $A(3,5)$, $B(7,8)$, $C(1, -10)$. Find the equation of the median through A. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-87ae07-3-1', '87ae07', 19, '3', '(b) Given $A = \begin{bmatrix} 2 & -6 \\ 2 & 0 \end{bmatrix}$, $B = \begin{bmatrix} -3 & 2 \\ 4 & 0 \end{bmatrix}$, $c = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix}$ 4

Find the matrix X such that $A + 2X = 2B + C$.', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-87ae07-3-2', '87ae07', 20, '3', '(c) Construct a triangle ABC in which base BC = 6cm, AB = 5.5cm and $\angle ABC = 120^\circ$. 5

(i) construct a circle circumscribing the triangle ABC.

(ii) draw a cyclic quadrilateral ABCD so that D is equidistant from B and C.', 5, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-87ae07-1-15', '87ae07', 21, '1', 'Q1) a) Use the Remainder Theorem to factorise the following expression: $2x^3 + x^2 - 13x + 6$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-87ae07-1-16', '87ae07', 22, '1', 'b) Solve the following equation: $x - \frac{18}{x} = 6$, give your answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-87ae07-1-17', '87ae07', 23, '1', 'c) In the figure, $\angle DBC = 58^\circ$. BD is a diameter of the circle. Calculate: (i) $\angle BDC$, $\angle BEC$, $\angle BAC$ [4]', 4, 'Circles', 'long', 2, '87ae07__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-87ae07-2-3', '87ae07', 24, '2', 'Q2) a) A bag contains 5 white balls, 6 red balls and 9 green balls. A ball is drawn at random from the bag. [3] Find the probability that the ball drawn is: (i) a green ball, (ii) a white or a red ball,

(iii) is neither green nor a white ball.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-87ae07-2-5', '87ae07', 25, '2', 'c) Given $A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$ and $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ and $A^2 = 9A + MI$. Find M. [4]', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-87ae07-3-3', '87ae07', 26, '3', 'Q3) a) Using properties of proportionality, solve for x. Given that x is positive : $\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$ [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-87ae07-3-4', '87ae07', 27, '3', 'b) P (1,-2) is a point on the line segment A (3,-6) and B (x,y) such that AP : PB is equal to 2 : 3. Find the coordinates of B. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-87ae07-3-5', '87ae07', 28, '3', 'c) Use a graph paper for this question (Take 2 cm = 1 unit on both x and y axis) [4] (i) Plot the following points : A (0,4), B (2,3), C (1,1) and D (2,0).

(ii) Reflect points B,C,D on the y-axis and write down their coordinates. Name the images as B'', C'', D'' respectively.

(iii) Join the points A, B, C, D, D'', C'', B'' and A in order.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-87ae07-4-0', '87ae07', 29, '4', 'Q4) a) Mr. Kumar a registered dealer purchased goods worth Rs. 40000 from a dealer (within the same state). If the rate of GST is 18%, [3]

(i) Calculate the input CGST and input SGST

(ii) If he sold these goods to Mr. Dev (within the state) for Rs. 50000, calculate Mr. Kumar''s output CGST and output SGST.

(iii) Calculate the CGST and SGST payable by Mr. Kumar', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-87ae07-4-1', '87ae07', 30, '4', 'b) Mohan opened a recurring deposit account in a bank and deposited Rs. 800 per month for $1\frac{1}{2}$ years. If he received Rs. 15084 at the time of maturity, find the rate of interest per annum. 3', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-87ae07-4-2', '87ae07', 31, '4', 'c) If a : b :: c : d, show that: $\frac{a + b}{c + d} = \frac{\sqrt{2a^2 + 7b^2}}{\sqrt{2c^2 + 7d^2}}$ 4', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-87ae07-5-0', '87ae07', 32, '5', 'Q5) a) Solve the in equation $2y - 3 < y + 1 \le 4y + 7$, where $y \in R$. Also represent the solution set on the number line. 3', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-87ae07-5-1', '87ae07', 33, '5', 'b) A car covers a distance of 400 km at a certain speed. Had the speed been 12 km/hr more, the time taken for the journey would have been 1 hr 40 min. Less. Find the original speed of the car. 3', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-87ae07-5-2', '87ae07', 34, '5', 'd) A Mathematics aptitude test of 50 students was recorded as follows: 4

| Marks | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- |
| Number of students | 4 | 8 | 14 | 19 | 5 |

 
Draw a histogram for the above data using a graph paper and locate the mode', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-87ae07-6-0', '87ae07', 35, '6', 'Q6) a) The sum of the 5th and 9th terms of an A.P. is 26 and the sum of its 7th and 11th terms is 42. Find the first three terms of an A.P. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-87ae07-6-1', '87ae07', 36, '6', 'b) A man observes the angle of elevation of the top of a building to be 30. He walks towards it in a horizontal line through its base.

On covering 60m, the angle of elevation changes to 60. Find the height of the building correct to the nearest meter. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-87ae07-6-2', '87ae07', 37, '6', 'c) Find the value of p for which the lines 2x + 3y - 7 = 0 and 4y - px - 12 = 0 are perpendicular to each other. [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-87ae07-7-0', '87ae07', 38, '7', 'Q7) a) Calculate the mean of the following distribution using Short Cut Method ; [3]

| Class-interval | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 8 | 30 | 25 | 14 | 12 | 6 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-87ae07-7-1', '87ae07', 39, '7', 'b) In the given figure, O is the centre of the circle and ∠AOC = 160°. Prove that 3∠y - 2∠x = 140°. 3', 3, 'Circles', 'short', 4, '87ae07__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-87ae07-7-2', '87ae07', 40, '7', 'c) In the figure given below, CD || LA and DE || AC. Find the length of CL if BE = 4 cm and EC = 2 cm. 4', 4, 'Similarity', 'long', 4, '87ae07__ICSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-1-0', 'b0a2a8', 0, '1', '(i) If $\begin{bmatrix} 2 & 0 \\ 0 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 2 \\ -8 \end{bmatrix}$, the value of $x$ and $y$ respectively are:', 1, 'Matrices', 'MCQ', 1, NULL, array['$1, -2$', '$-2, 1$', '$1, 2$', '$-2, -1$']::text[]),
  ('MQ-b0a2a8-1-1', 'b0a2a8', 1, '1', '(ii) If $x - 2$ is a factor of $x^3 - kx - 12$, then the value of $k$ is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['3', '2', '$-2$', '$-3$']::text[]),
  ('MQ-b0a2a8-1-2', 'b0a2a8', 2, '1', '(iii) In the given diagram RT is a tangent touching the circle at S. If $\angle PST = 30^{\circ}$ and $\angle SPQ = 60^{\circ}$ then $\angle PSQ$ is equal to:', 1, 'Circles', 'MCQ', 1, 'b0a2a8__ICSE_X_Mat_p1_img_0_jpeg.webp', array['$40^{\circ}$', '$30^{\circ}$', '$60^{\circ}$', '$90^{\circ}$']::text[]),
  ('MQ-b0a2a8-1-3', 'b0a2a8', 3, '1', '(iv) A letter is chosen at random from all the letters of the English alphabets. The probability that the letter chosen is a vowel, is:', 1, 'Probability', 'MCQ', 1, NULL, array['$\frac{4}{26}$', '$\frac{5}{26}$', '$\frac{21}{26}$', '$\frac{5}{24}$']::text[]),
  ('MQ-b0a2a8-1-4', 'b0a2a8', 4, '1', '(v) If 3 is a root of the quadratic equation $x^2 - px + 3 = 0$ then $p$ is equal to:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['4', '3', '5', '2']::text[]),
  ('MQ-b0a2a8-1-5', 'b0a2a8', 5, '1', '(vi) In the given figure $\angle BAP = \angle DCP = 70^{\circ}$, $PC = 6$ cm and $CA = 4$ cm, then $PD : DB$ is:', 1, 'Similarity', 'MCQ', 1, 'b0a2a8__ICSE_X_Mat_p1_img_1_jpeg.webp', array['$5:3$', '$3:5$', '$3:2$', '$2:3$']::text[]),
  ('MQ-b0a2a8-1-6', 'b0a2a8', 6, '1', '(vii) The printed price of an article is ₹3080. If the rate of GST is 10% then the GST charged is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹154', '₹308', '₹30.80', '₹15.40']::text[]),
  ('MQ-b0a2a8-1-7', 'b0a2a8', 7, '1', '(viii) $(1 + \sin A)(1 - \sin A)$ is equal to:', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$\text{cosec}^2 A$', '$\sin^2 A$', '$\sec^2 A$', '$\cos^2 A$']::text[]),
  ('MQ-b0a2a8-1-8', 'b0a2a8', 8, '1', '(ix) The coordinates of the vertices of $\triangle ABC$ are respectively $(-4, -2)$, $(6, 2)$ and $(4, 6)$. The centroid G of $\triangle ABC$ is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$(2, 2)$', '$(2, 3)$', '$(3, 3)$', '$(0, -1)$']::text[]),
  ('MQ-b0a2a8-1-9', 'b0a2a8', 9, '1', '(x) The $n^{\text{th}}$ term an Arithmetic Progression (A.P.) is $2n + 5$. The $10^{\text{th}}$ term is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['7', '15', '25', '45']::text[]),
  ('MQ-b0a2a8-1-10', 'b0a2a8', 10, '1', '(xi) The mean proportional between 4 and 9 is:', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['4', '6', '9', '36']::text[]),
  ('MQ-b0a2a8-1-11', 'b0a2a8', 11, '1', '(xii) Which of the following cannot be determined graphically for a grouped frequency distribution?', 1, 'Statistics', 'MCQ', 1, NULL, array['Median', 'Mode', 'Quartiles', 'Mean']::text[]),
  ('MQ-b0a2a8-1-12', 'b0a2a8', 12, '1', '(xiii) Volume of a cylinder of height $3\mathrm{cm}$ is $48\pi \mathrm{cm}^3$ . Radius of the cylinder is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['$48\mathrm{cm}$', '$16\mathrm{cm}$', '$4\mathrm{cm}$', '$24\mathrm{cm}$']::text[]),
  ('MQ-b0a2a8-1-13', 'b0a2a8', 13, '1', '(xiv) Naveen deposits ₹800 every month in a recurring deposit account for 6 months. If he receives ₹4884 at the time of maturity, then the interest he earns is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹84', '₹42', '₹24', '₹284']::text[]),
  ('MQ-b0a2a8-1-14', 'b0a2a8', 14, '1', '(xv) The solution set for the inequation $2x + 4 \leq 14$ , $x \in W$ is:', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['$\{1,2,3,4,5\}$', '$\{0,1,2,3,4,5\}$', '$\{1,2,3,4\}$', '$\{0,1,2,3,4\}$']::text[]),
  ('MQ-b0a2a8-2-0', 'b0a2a8', 15, '2', '2.(i) Find the value of \( a'' \) if \( x - a \) is a factor of the polynomial \( 3x^3 + x^2 - ax - 81 \). [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-b0a2a8-2-1', 'b0a2a8', 16, '2', '(ii) Salman deposits ₹1000 every month in a recurring deposit account for 2 years. If he receives ₹26000 on maturity, find: [4]

(a) the total interest Salman earns.
(b) the rate of interest.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-b0a2a8-2-2', 'b0a2a8', 17, '2', '(iii) In the given figure O, is the centre of the circle. CE is a tangent to the circle at A. If $\angle ABD = 26^\circ$, then find: [4]

(a) \(\angle BDA\)
(b) \(\angle BAD\)
(c) \(\angle CAD\)
(d) \(\angle ODB\)', 4, 'Circles', 'long', 3, 'b0a2a8__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-b0a2a8-3-0', 'b0a2a8', 18, '3', '3.(i) Solve the following quadratic equation: [4]

$$
x^2 + 4x - 8 = 0
$$

Give your answer correct to one decimal place.

(Use mathematical tables if necessary.)', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-b0a2a8-3-1', 'b0a2a8', 19, '3', '(ii) Prove the following identity: [4]

$$
(\sin^2\theta - 1)(\tan^2\theta + 1) + 1 = 0
$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-b0a2a8-3-2', 'b0a2a8', 20, '3', '(iii) Use graph sheet to answer this question. Take $2\,\mathrm{cm} = 1$ unit along both the axes. [5]

(a) Plot A, B, C where \( \mathrm{A}(0,4) \), \( \mathrm{B}(1,1) \) and \( \mathrm{C}(4,0) \)
(b) Reflect A and B on the \(x\)-axis and name them as E and D respectively.
(c) Reflect B through the origin and name if F. Write down the coordinates of F.
(d) Reflect B and C on the \(y\)-axis and name them as H and G respectively.
(e) Join points A, B, C, D, E, F, G, H and A in order and name the closed figure formed.', 5, 'Coordinate Geometry', 'long', 3, 'b0a2a8__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-b0a2a8-4-0', 'b0a2a8', 21, '4', '4.(i) If $A = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$ , $B = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$ , $C = \begin{bmatrix} 4 & 1 \\ 1 & 5 \end{bmatrix}$ and $I =$

$$
\left[ \begin{array}{c c} 1 & 0 \\ 0 & 1 \end{array} \right].
$$

Find $A(B + C) - 14I$ [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-b0a2a8-4-1', 'b0a2a8', 22, '4', '(ii) ABC is a triangle whose vertices are A(1, -1), B(0, 4) and C(-6, 4). D is the midpoint of BC. Find the: [3]

(a) coordinates of D.
(b) equation of the median AD.', 3, 'Coordinate Geometry', 'short', 4, 'b0a2a8__ICSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-b0a2a8-4-2', 'b0a2a8', 23, '4', '(iii) In the given figure, O is the centre of the circle. PQ is a tangent to the circle at T. Chord AB produced meets the tangent at P. [4]

$$
\mathrm {A B} = 9 \mathrm {c m}, \mathrm {B P} = 1 6 \mathrm {c m}, \angle \mathrm {P T B} = 5 0 ^ {\circ}
$$

$$
\angle O B A = 4 5 ^ {\circ}
$$

Find:

(a) length of PT
(b) \(\angle\) BAT
(c) \(\angle\) BOT
(d) \(\angle ABT\)', 4, 'Circles', 'long', 4, 'b0a2a8__ICSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-5-0', 'b0a2a8', 24, '5', '5.(i) Mrs. Arora bought the following articles from a departmental store: [3]

| S.No. | Item | Price | Rate of GST | Discount |
| --- | --- | --- | --- | --- |
| 1. | Hair oil | ₹1200 | 18% | ₹100 |
| 2. | Cashew nuts | ₹600 | 12% | - |

Find the:

(a) Total GST paid.
(b) Total bill amount including GST.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-b0a2a8-5-1', 'b0a2a8', 25, '5', '(ii) Solve the following inequation. Write down the solution set and represent it on the real number line.

$$
- 5 (x - 9) \geq 1 7 - 9 x > x + 2, x \in \mathrm {R} \tag {3}
$$', 3, 'Linear Inequations', 'short', 5, 'b0a2a8__ICSE_X_Mat_p5_img_4_jpeg.webp', NULL),
  ('MQ-b0a2a8-5-2', 'b0a2a8', 26, '5', '(iii) In the given figure, AC || DE || BF.

If $\mathrm{AC} = 24\mathrm{cm}$ , $\mathrm{EG} = 8\mathrm{cm}$ , $\mathrm{GB} = 16\mathrm{cm}$ , $\mathrm{BF} = 30\mathrm{cm}$ .

(a) Prove \(\Delta\)GED- \(\Delta\)GBF
(b) Find DE
(c) DB:AB', 4, 'Similarity', 'long', 5, 'b0a2a8__ICSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-6-0', 'b0a2a8', 27, '6', '6.(i) The following distribution gives the daily wages of 60 workers of a factory. [3]

| Daily income ₹ | Number of worker (f) |
| --- | --- |
| 200-300 | 6 |
| 300-400 | 10 |
| 400-500 | 14 |
| 500-600 | 16 |
| 600-700 | 10 |
| 700-800 | 4 |

Use graph paper to answer this question.

Take $2\text{ cm} = ₹100$ along one axis and $2\text{ cm} = 2$ workers along the other axis. Draw a histogram and hence find the mode of the given distribution.', 3, 'Statistics', 'short', 6, 'b0a2a8__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-6-1', 'b0a2a8', 28, '6', '(ii) The $5^{\text{th}}$ term and the $9^{\text{th}}$ term of an Arithmetic Progression are 4 and -12 respectively. [3] Find:

(a) the first term
(b) common difference
(c) sum of 16 terms of the AP.', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-b0a2a8-6-2', 'b0a2a8', 29, '6', '(iii) A and B are two points on the $x$-axis and $y$-axis respectively. [4]

(a) Write down the coordinates of A and B.
(b) P is a point on AB such that AP : PB = 3 : 1. Using section formula find the coordinates of point P.
(c) Find the equation of a line passing through P and perpendicular to AB.', 4, 'Coordinate Geometry', 'long', 6, 'b0a2a8__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-b0a2a8-7-0', 'b0a2a8', 30, '7', '7.(i) A bag contains 25 cards, numbered through 1 to 25. A card is drawn at random. What is the probability that the number on the card drawn is: [3]

(a) multiple of 5
(b) a perfect square
(c) a prime number?', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-b0a2a8-7-1', 'b0a2a8', 31, '7', '(ii) A man covers a distance of \(100\mathrm{km}\), travelling with a uniform speed of \(x\mathrm{km / hr}\), had the speed been 5 km/hr more it would have taken 1 hour less. Find \(x\) the original speed. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-b0a2a8-7-2', 'b0a2a8', 32, '7', '(iii) A solid in the shape of a hemisphere of radius 7 cm, surmounted by a cone of height 4 cm. The solid

is immersed completely in a cylindrical container filled with water to a certain height. If the radius of the cylinder is $14\mathrm{cm}$ , find the rise in the water level. [4]', 4, 'Mensuration', 'long', 7, 'b0a2a8__ICSE_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-8-0', 'b0a2a8', 33, '8', '8.(i) The following table gives the marks scored by a set of students in an examination. Calculate the mean of the distribution by using the short cut method. [3]

| Marks | Number of Students (f) |
| --- | --- |
| 0-10 | 3 |
| 10-20 | 8 |
| 20-30 | 14 |
| 30-40 | 9 |
| 40-50 | 4 |
| 50-60 | 2 |', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-b0a2a8-8-1', 'b0a2a8', 34, '8', '(ii) What number must be added to each of the numbers 4, 6, 8, 11 in order to get the four numbers in proportion? [3]', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-b0a2a8-8-2', 'b0a2a8', 35, '8', '(iii) Using ruler and compass construct a triangle ABC in which \(\mathrm{AB} = 6\mathrm{cm}\), \(\angle \mathrm{BAC} = 120^{\circ}\) and \(\mathrm{AC} = 5\) cm. Construct a circle passing through A, B and C. Measure and write down the radius of the circle.

[4]', 4, 'Constructions', 'long', 8, 'b0a2a8__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-b0a2a8-9-0', 'b0a2a8', 36, '9', '9.(i) Using Componendo and Dividendo solve for $x$ . [3]

$$
\frac {\sqrt {2 x + 2} + \sqrt {2 x - 1}}{\sqrt {2 x + 2} - \sqrt {2 x - 1}} = 3', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-b0a2a8-9-1', 'b0a2a8', 37, '9', '(ii) Which term of the Arithmetic Progression (A.P.) 15, 30, 45, 60 ... is 300? Hence find the sum of the terms of the Arithmetic Progression (A.P.) [3]', 3, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-b0a2a8-9-2', 'b0a2a8', 38, '9', '(iii) From the top of a tower \(100\mathrm{m}\) high a man observes the angles of depression of two ships A and B, on opposite sides of the lower as \(45^{\circ}\) and \(38^{\circ}\) respectively. If the foot of the tower and the ships are in the same horizontal line find the distance between the two ships A and B to the nearest metre.

(Use Mathematical Tables for this question.) [4]', 4, 'Trigonometry', 'long', 8, 'b0a2a8__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-b0a2a8-10-0', 'b0a2a8', 39, '10', '10.(i) Factorize completely using factor theorem: [4]

$$2 x ^ {3} - x ^ {2} - 1 3 x - 6$$', 4, 'Factorisation and Remainder Theorem', 'long', 9, NULL, NULL),
  ('MQ-b0a2a8-10-1', 'b0a2a8', 40, '10', '(ii) Use graph paper to answer this question. [6]

During a medical checkup of 60 students in a school, weights were recorded as follows:

| Weight (in kg) | Number of Students |
| --- | --- |
| 28-30 | 2 |
| 30-32 | 4 |
| 32-34 | 10 |
| 34-36 | 13 |
| 36-38 | 15 |
| 38-40 | 9 |
| 40-42 | 5 |
| 42-44 | 2 |

Taking $2\mathrm{cm} = 2\mathrm{kg}$ along one axis and $2\mathrm{cm} = 10$ students along the other axis draw an ogive. Use your graph to find the:

(a) median
(b) upper Quartile
(c) number of students whose weight is above 37 kg', 6, 'Statistics', 'long', 9, 'b0a2a8__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-471e2c-1-0', '471e2c', 0, '1', '(1) If A = $$\begin{bmatrix} 2 & 1 \\ -1 & 0 \end{bmatrix}$$, then 3A is:', 1, 'Matrices', 'MCQ', 1, NULL, array['$$\begin{bmatrix} 6 & 3 \\ -3 & 3 \end{bmatrix}$$', '$$\begin{bmatrix} 6 & 3 \\ -1 & 0 \end{bmatrix}$$', '$$\begin{bmatrix} 6 & 1 \\ -3 & 0 \end{bmatrix}$$', '$$\begin{bmatrix} 6 & 3 \\ -3 & 0 \end{bmatrix}$$']::text[]),
  ('MQ-471e2c-2-0', '471e2c', 1, '2', '(2) Identify the types of taxes under GST levied on intra-state sales.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['CGST only', 'SGST only', 'IGST only', 'Both CGST and SGST']::text[]),
  ('MQ-471e2c-3-0', '471e2c', 2, '3', '(3) The mean proportion between 4 and 49 is:', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['14', '45', '53', '196']::text[]),
  ('MQ-471e2c-4-0', '471e2c', 3, '4', '(4) Ankur deposited Rs 1000 every month in a recurring deposit account for 3 years at 8% p.a. simple interest. If he received Rs 40440 at the time of maturity, the interest received by him is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['Rs 4440', 'Rs 8640', 'Rs 37440', 'Rs 39440']::text[]),
  ('MQ-471e2c-5-0', '471e2c', 4, '5', '(5) If $x \in W$, then the solution set of the inequation $1 < 2x - 1 \le 3$ is:', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{2}', '{1, 2}', '{2, 3}', '{0, 1, 2}']::text[]),
  ('MQ-471e2c-6-0', '471e2c', 5, '6', '(6) The roots of the quadratic equation $x^2 - 6x + 9 = 0$ are:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['real and distinct', 'real and equal', 'distinct but not real', 'equal but not real']::text[]),
  ('MQ-471e2c-7-0', '471e2c', 6, '7', '(7) If a polynomial $2x^3 - 7x^2 + 3$ is divided by $(x - 2)$, then the remainder is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['- 41', '- 15', '- 9', '9']::text[]),
  ('MQ-471e2c-8-0', '471e2c', 7, '8', '(8) If matrix A is of order $2 \times 2$ and matrix B is of order $2 \times 1$, then the order of the matrix AB is:', 1, 'Matrices', 'MCQ', 2, NULL, array['$1 \times 2$', '$2 \times 1$', '$2 \times 2$', '$2 \times 3$']::text[]),
  ('MQ-471e2c-9-0', '471e2c', 8, '9', '(9) If 9, 15, 25 and $x$ are in continued proportion, then ''x'' is equal to:', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['7', '15', '$5\frac{2}{5}$', '$41\frac{2}{3}$']::text[]),
  ('MQ-471e2c-10-0', '471e2c', 9, '10', '(10) The roots of the quadratic equation $x^2 - 2x - 3 = 0$ are:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['- 3, - 1', '- 3, 1', '- 1, 3', '1, 3']::text[]),
  ('MQ-471e2c-11-0', '471e2c', 10, '11', '(11) If $(x + 1)$ is a factor of the polynomial $x^3 + 2x^2 - 5x + k$, then ''k'' is equal to:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['- 6', '- 2', '2', '6']::text[]),
  ('MQ-471e2c-12-0', '471e2c', 11, '12', '(12) The solution set representing the following number line is:', 1, 'Linear Inequations', 'MCQ', 2, '471e2c__ICSE_X_Mat_p2_img_0_jpeg.webp', array['$\{x : x \in R, -2 \le x \le 1\}$', '$\{x : x \in R, -2 \le x < 1\}$', '$\{x : x \in R, -2 < x \le 1\}$', '$\{x : x \in R, -2 < x < 1\}$']::text[]),
  ('MQ-471e2c-13-0', '471e2c', 12, '13', '(13) Mr. Singh deposited Rs 600 every month in a recurring deposit account in a bank for 2 years. If the bank pays interest at the rate of 12% per annum, then the amount he gets on maturity is:', 2, 'GST and Banking', 'MCQ', 3, NULL, array['Rs 744', 'Rs 1218', 'Rs 1800', 'Rs 16200']::text[]),
  ('MQ-471e2c-14-0', '471e2c', 13, '14', '(14) If (x + 2) is a factor of the polynomial x³ + 3x² - 4x - 12, then its factors are:', 2, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['(x + 2)(x - 2)(x + 3)', '(x + 2)(x - 2)(x - 3)', '(x + 2)(x - 1)(x + 6)', '(x + 2)(x + 1)(x - 6)']::text[]),
  ('MQ-471e2c-15-0', '471e2c', 14, '15', '(15) The solution set of the linear inequation -1 < 3 - 2x ≤ 7, x ∈ 1 is:', 2, 'Linear Inequations', 'MCQ', 3, NULL, array['{x : x ∈ R, -2 ≤ x < 2}', '{-2, -1, 0, 1}', '{-2, -1, 0, 1, 2}', '{-2, -1, 0}']::text[]),
  ('MQ-471e2c-16-0', '471e2c', 15, '16', '(16) If m : n = 9 : 14, then by the properties of proportion, the value of (7m + 3n)/(7m - 3n) is:', 2, 'Ratio and Proportion', 'MCQ', 3, NULL, array['-5', '1', '3/2', '5']::text[]),
  ('MQ-471e2c-17-0', '471e2c', 16, '17', '(17) If A = [(-3, 2), (1, 5)] and I is the identity matrix of order 2, then A² - 4I is:', 2, 'Matrices', 'MCQ', 3, NULL, array['[(-11, 4), (2, 23)]', '[7, 0), (-2, 23)]', '[7, 4), (2, 23)]', '[5, 4), (1, 21)]']::text[]),
  ('MQ-471e2c-18-0', '471e2c', 17, '18', '(18) A retailer purchases a watch for Rs 2500 from a wholesaler and sells it to a consumer at 16% profit. If the sales are intra-state and the rate of GST is 12%, the cost of the watch to the consumer inclusive of tax is:', 2, 'GST and Banking', 'MCQ', 3, NULL, array['Rs 2848', 'Rs 3074', 'Rs 3200', 'Rs 3248']::text[]),
  ('MQ-471e2c-19-0', '471e2c', 18, '19', '(19) A cottage industry in Shikohabad produces a certain number of pottery articles in a day. On 30th August, the Small-Scale Industry Day (SSI Day), it was observed that the cost of production of each article (in Rs) was 3 more than twice the number of articles produced on that day.
(i) Considering the number of articles produced on SSI Day as ''x'', the cost of production of each article was:
(a) Rs (x + 3) (b) Rs (2x + 3) (c) Rs x(2x + 3) (d) Rs 2(x + 3)
(ii) If the total cost of production on SSI Day was Rs 90, then the quadratic equation formed is:
(a) $$2x^2 + 3x + 90 = 0$$
(b) $$x^2 + 3x - 45 = 0$$
(c) $$x^2 + 3x - 90 = 0$$
(d) $$2x^2 + 3x - 90 = 0$$
(iii) The number of articles produced on SSI Day was:
(a) 6
(b) 7
(c) 8
(d) 9
(iv) The cost of production of each article on that day was:', 4, 'Quadratic Equations', 'MCQ', 3, NULL, array['Rs 9', 'Rs 12', 'Rs 15', 'Rs 19']::text[]),
  ('MQ-471e2c-20-0', '471e2c', 19, '20', '(20) The $$n^{\text{th}}$$ term of an arithmetic progression (A.P.) is given by $$(5n + 3)$$.
(i) The first three terms of this A.P. are:
(a) 2, 7, 12
(b) 3, 8, 13
(c) 8, 11, 14
(d) 8, 13, 18
(ii) The common difference of this A.P. is:
(a) -5
(b) 3
(c) 5
(d) 8
(iii) Which of the following is NOT a term of this A.P.?
(a) 23
(b) 25
(c) 28
(d) 33
(iv) The sum of first 20 terms of this A.P. is:', 4, 'Arithmetic Progression', 'MCQ', 4, NULL, array['103', '1030', '1110', '1160']::text[]),
  ('MQ-471e2c-21-0', '471e2c', 20, '21', '(21) If $$x = \frac{6ab}{a+b}$$, using properties of proportion, find the value of $$\frac{x+3a}{x-3a} + \frac{x+3b}{x-3b}$$ [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-471e2c-22-0', '471e2c', 21, '22', '(22) A car covers a distance of 390 km in ''x'' hours. If the speed of the car had been 4 km/h more, it would have taken 2 hours less for the journey. Find ''x''. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-417b04-1-0', '417b04', 0, '1', '(a) The roots of the quadratic equation $3x^2 + 4x - 3$ are :', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['Not real', 'Real and equal', 'Real and unequal', 'Irrational']::text[]),
  ('MQ-417b04-1-1', '417b04', 1, '1', '(b) Taxes that are levied on any Intra-State purchase are ?', NULL, 'GST and Banking', 'MCQ', 1, NULL, array['IGST', 'CGST and SGST', 'SGST', 'CGST']::text[]),
  ('MQ-417b04-1-2', '417b04', 2, '1', '(c) When $f(x) = x^2 - 5x + 1$ is divided by $(x + 1)$ , then the remainder is :', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['7', '-7', '-2', '4']::text[]),
  ('MQ-417b04-1-3', '417b04', 3, '1', '(d) If $M \times \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix} = [1 \quad 2]$ , order of matrix $M$ :', NULL, 'Matrices', 'MCQ', 1, NULL, array['$2 \times 1$', '$1 \times 2$', '$2 \times 2$', '$3 \times 1$']::text[]),
  ('MQ-417b04-1-4', '417b04', 4, '1', '(e) If 84 is the $n^{\text{th}}$ term of the arithmetic progression 21, 28, 35, 42 ..., then ''n'' is.', NULL, 'Arithmetic Progression', 'MCQ', 1, NULL, array['11', '14', '9', '10']::text[]),
  ('MQ-417b04-1-5', '417b04', 5, '1', '(f) The reflection of the point $P(6, -2)$ in the origin is :', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$(-6, 2)$', '$(6, 2)$', '$(-6, -2)$', '$(-2, -6)$']::text[]),
  ('MQ-417b04-1-6', '417b04', 6, '1', '(g) A bag contains 3 red balls and 4 black balls. A ball is drawn at random from bag, find probability that the ball drawn is black :', NULL, 'Probability', 'MCQ', 2, NULL, array['$\frac{3}{7}$', '$\frac{4}{3}$', '$\frac{4}{7}$', '$\frac{3}{4}$']::text[]),
  ('MQ-417b04-1-7', '417b04', 7, '1', '(h) In the given figure, ABC and AMP are right angled at B and M respectively. If AC = 10 cm, AP = 15 cm and PM = 12 cm ; value of BC :', NULL, 'Similarity', 'MCQ', 2, '417b04__ICSE_X_Mat_p2_img_0_jpeg.webp', array['18 cm', '6 cm', '7 cm', '8 cm']::text[]),
  ('MQ-417b04-1-8', '417b04', 8, '1', '(i) Choose the correct solution set of the following number line :
$$\begin{array}{c} \text{---} \\ -5 \quad -4 \quad -3 \quad -2 \quad -1 \quad 0 \quad 1 \end{array}$$', NULL, 'Linear Inequations', 'MCQ', 2, NULL, array['$\{x : x \in \mathbb{R}; -5 < x < -1\}$', '$\{x : x \in \mathbb{R}; -5 \leq x < -1\}$', '$\{x : x \in \mathbb{R}; -4 \leq x < -2\}$', '$\{x : x \in \mathbb{R}; -4 \leq x \leq -2\}$']::text[]),
  ('MQ-417b04-1-9', '417b04', 9, '1', '(j) If vertices of a triangle be $(-4, 1)$ , $(3, -4)$ , $(1, 3)$ then centroid is :', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(2, 3)$', '$(-2, -3)$', '$(0, 0)$', '$(-2, 3)$']::text[]),
  ('MQ-417b04-1-10', '417b04', 10, '1', '(k) In the figure PQ is a diameter of the circle whose centre is O. Given $\angle ROS = 42^\circ$ then x is equal to :', NULL, 'Circles', 'MCQ', 2, '417b04__ICSE_X_Mat_p2_img_1_jpeg.webp', array['$42^\circ$', '$90^\circ$', '$69^\circ$', '$21^\circ$']::text[]),
  ('MQ-417b04-1-11', '417b04', 11, '1', '(l) If $$\begin{bmatrix} x+3 & 4 \\ y-4 & x+y \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 3 & 9 \end{bmatrix}$$ , then the values of x and y are :', NULL, 'Matrices', 'MCQ', 3, NULL, array['$$x = 2, y = 7$$', '$$x = 7, y = 2$$', '$$x = 3, y = 6$$', '$$x = -2, y = 7$$']::text[]),
  ('MQ-417b04-1-12', '417b04', 12, '1', '(m) If 4, 16, x are in continued proportion, then x is :', NULL, 'Ratio and Proportion', 'MCQ', 3, NULL, array['16', '64', '4', '8']::text[]),
  ('MQ-417b04-1-13', '417b04', 13, '1', '(n) The volume of a right circular cone with same base radius and height as that of a right circular cylinder is 120 cm$^{3}$. The volume of the cylinder is :', NULL, 'Mensuration', 'MCQ', 3, NULL, array['240 cm$^{3}$', '60 cm$^{3}$', '360 cm$^{3}$', '480 cm$^{3}$']::text[]),
  ('MQ-417b04-1-14', '417b04', 14, '1', '(o) If 11 is mode of the following data, then the value of x is 8, 9, 11, 10, 12, 14, 11, 14, 15, 14, x, 11 :', NULL, 'Statistics', 'MCQ', 3, NULL, array['8', '14', '11', '10']::text[]),
  ('MQ-417b04-2-0', '417b04', 15, '2', '(a) Mrs. Vasundhra Mehta has a recurring deposit account in a bank for 4 years at 10% p.a. She gets ₹ 6370 as the interest, find the monthly installment. ~~₹ 4274~~ [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-417b04-2-1', '417b04', 16, '2', '(b) If $(x + y) : (x - y)$ is equal to the duplicate ratio of 3 : 1 find $x : y = 5 : 4$ [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-417b04-2-2', '417b04', 17, '2', '(c) Prove that : $$\sqrt{\frac{1 - \sin A}{1 + \sin A}} = \sec A - \tan A$$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-417b04-3-0', '417b04', 18, '3', '(a) A hollow sphere of internal & external radii 6 cm & 8 cm respectively, is melted and recast into small cones of base radius 2 cm and height 8 cm. Find the number of cones. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-417b04-3-1', '417b04', 19, '3', '(b) Find the equation of the line passing through $(-2, 1)$ and perpendicular to $4x + 5y = 6$ . [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-417b04-3-2', '417b04', 20, '3', '(c) The point $P(3, 4)$ is reflected to $P''$ in the x axis and $O''$ is the image of $O$ (the origin) when reflected in the line $PP''$ . Write :

(i) The length of the segments $PP''$ & $OO''$

(ii) The perimeter of the quadrilateral $POP''O''$

(iii) The geometrical name of the figure $POP''O''$

[5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-417b04-4-0', '417b04', 21, '4', '(a) A manufacturer in Delhi manufactures a machine and marks it at ₹ 60,000. He sells the machine to a wholesaler (in Patna) at a discount of 20%. The wholesaler sells the machine to a dealer (in Agra) at a discount of 10% on the marked price. If the rate of GST is 28%, find the tax paid by the wholesaler to the central government. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-417b04-4-1', '417b04', 22, '4', '(b) Solve the quadratic equation x² - 3(x + 3) = 0, give your answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-417b04-4-2', '417b04', 23, '4', '(c) Find mode of the following distribution using its histogram : [4]

| Class Intervals | 200-300 | 300-400 | 400-500 | 500-600 | 600-700 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 6 | 18 | 22 | 10 | 15 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-417b04-5-0', '417b04', 24, '5', '(a) Let A = [4 -2, 6 -3], B = [0 2, 1 -1] & C = [-2 3, 1 -1]. Find A² - A + BC. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-417b04-5-1', '417b04', 25, '5', '(b) PQ is tangent that touches circle at T. Find ∠SOT if ∠STQ = 70°. [3]', 3, 'Circles', 'short', 4, '417b04__ICSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-417b04-5-2', '417b04', 26, '5', '(c) If (x - 2) is a factor of the expression 2x³ + ax² + bx - 14 and when the expression is divided by (x, -3), it leaves a remainder 52, find the values of a and b. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-417b04-6-0', '417b04', 27, '6', '(a) If two opposite vertices of square are (7, -3) and (-1, 11) then find equations of its diagonals. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-417b04-6-1', '417b04', 28, '6', '-(b) Prove that : $\tan\theta - \cot\theta = \frac{2\sin^2\theta - 1}{\sin\theta\cos\theta}$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-417b04-6-2', '417b04', 29, '6', '(c) The sum of three numbers in A.P. is 15 and the sum of the squares of the extreme terms is 58. Find the numbers. [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-417b04-7-0', '417b04', 30, '7', '(a) Solve the following inequation, write the solution set and represent it on the number line :

$$-\frac{1}{5} \leq \frac{3x}{10} + 1 < \frac{2}{5}; x \in \mathbb{R}.$$', NULL, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-417b04-7-1', '417b04', 31, '7', '(b) The mean of following frequency table is 50 but frequencies are missing, find the missing frequencies : [4]

| Class Intervals | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 17 | f_{1} | 32 | f_{2} | 19 | 120 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-417b04-7-2', '417b04', 32, '7', '(c) In the given figure $\triangle ABC \sim \triangle AXY$ . If $AY : YC = 4 : 7$ and $XY = 6.6$ cm, find BC. If ''x'' be the length of the perpendicular from A to XY, find the length of the perpendicular from A to BC in terms of ''x''. [3]', 3, 'Similarity', 'short', 5, '417b04__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-417b04-8-0', '417b04', 33, '8', '(a) A hotel bill for a number of people for overnight stay is ₹ 4,800. If there were 4 people more, the bill each person had to pay, would have reduced by ₹ 200. Find the number of people staying overnight. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-417b04-8-1', '417b04', 34, '8', '(b) The weight of 200 students in kg are given below :

| Weight | 40-45 | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 17 | 22 | 45 | 51 | 31 | 20 | 9 |

Use a graph paper to draw an ogive for the above distribution.
Use your ogive to estimate the following : [6]

- (i) Find median
- (ii) The percentage of students weighing 55 kg or more,
- (iii) The weight above which the heaviest 30% of the students fall,
- (iv) The number of students who are under weight and over weight, if 55.70 kg is considered as standard weight ?', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-417b04-9-0', '417b04', 35, '9', '- (a) A joker''s cap is in the form of a right circular cone of base radius 7 cm and height 24 cm. Find the area of the sheet required to make 10 such caps. [3]', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-417b04-9-1', '417b04', 36, '9', '- (b) AT is a tangent, AB is a diameter with centre O. If ∠AOC = 64°, calculate ∠ABC and ∠ATC. [3]', 3, 'Circles', 'short', 6, '417b04__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-417b04-9-2', '417b04', 37, '9', '- (c) Using a ruler and a compass, construct a triangle ABC in which AB = 6 cm, ∠ABC = 90° and BC = 7.2 cm and BD is perpendicular to side AC. Draw circumcircle of triangle BDC and then state the length of the radius of this circumcircle drawn. [4]', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-417b04-10-0', '417b04', 38, '10', '- (a) Using component and dividend, find the value of x : $$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$ [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-417b04-10-1', '417b04', 39, '10', '- (b) An observer on the top of a cliff; 200 m above the sea level, observes the angles of depression of the two ships, on the same side of the cliff, to be 45° and 30° respectively. Find the distance between the ships. [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-417b04-10-2', '417b04', 40, '10', '- (c) Cards marked with numbers 1, 2, 3, 4 ... 30 are well shuffled and a card is drawn at random. What is the probability that the number on the card is : [3]

- (i) A prime number (ii) Divisible by 3 (iii) A perfect square', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-caf50f-1-0', 'caf50f', 0, '1', '(i) The SGST paid by a customer to the shopkeeper for an article which is priced at ₹500 is ₹15. The rate of GST charged is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1.5%', '3%', '5%', '6%']::text[]),
  ('MQ-caf50f-1-1', 'caf50f', 1, '1', '(ii) When the roots of a quadratic equation are real and equal then the discriminant of the quadratic equation is:

- (a) Infinite
- (b) Positive

✓(c) Zero

- (d) Negative', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-caf50f-1-2', 'caf50f', 2, '1', '(iii) If $(x - 1)$ is a factor of $2x^2 - ax - 1$, then the value of ''a'' is :

- (a) $-1$

✓(b) $1$

- (c) $3$

- (d) $-3$', 1, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-caf50f-1-3', 'caf50f', 3, '1', '(iv) Given $\begin{bmatrix} a & b \\ c & d \end{bmatrix} \times X = \begin{bmatrix} p \\ q \end{bmatrix}$. The order of matrix $X$ is :

- (a) $2 \times 2$

- (b) $1 \times 2$

✓(c) $2 \times 1$

- (d) $1 \times 1$', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-caf50f-1-4', 'caf50f', 4, '1', '(v) 57, 54, 51, 48, ...are in Arithmetic Progression. The value of the 8th term is:

- ✓(a) 36

- (b) 78

- (c) -36

- (d) -78', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-caf50f-1-5', 'caf50f', 5, '1', '(vi) The point $A(p, q)$ is invariant about $x = p$ under reflection.

The coordinates of it''s image $A''$ is:

- (a) $A''(p, -q)$

- (b) $A''(-p, q)$

✓(c) $A''(p, q)$

- (d) $A''(-p, -q)$', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-caf50f-1-6', 'caf50f', 6, '1', '(vii) In the given diagram the $\Delta ABC$ is similar to $\Delta DEF$ by the axiom:', 1, 'Similarity', 'MCQ', 3, 'caf50f__ICSE_X_Mat_p3_img_0_jpeg.webp', array['SSS', 'SAS', 'AAA', 'RHS']::text[]),
  ('MQ-caf50f-1-7', 'caf50f', 7, '1', '(viii) The volume of a right circular cone with same base radius and height as that of a right circular cylinder, is $120 \text{ cm}^3$. The volume of the cylinder is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['\(240cm^3\)', '\(60cm^3\)', '\(360cm^3\)', '\(480~cm^3\)']::text[]),
  ('MQ-caf50f-1-8', 'caf50f', 8, '1', '(ix) The solution set for the given inequation is:
$-8 \le 2x < 8, x \in W$', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['\(\{-4, -3, -2, -1, 0, 1, 2, 3, 4\}\)', '\(\{-4, -3, -2, -1\}\)', '$\{0, 1, 2, 3\}$', '$\{-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8\}$']::text[]),
  ('MQ-caf50f-1-9', 'caf50f', 9, '1', '(x) The probability of the Sun rising from the east is P(S). The value of P(S) is:', 1, 'Probability', 'MCQ', 3, NULL, array['\(P(S) = 0\)', '\(P(S) < 0\)', 'P(S) = 1', 'P(S) > 1']::text[]),
  ('MQ-caf50f-1-10', 'caf50f', 10, '1', '(xi) If $\begin{bmatrix} 2 & x \\ 0 & 1 \end{bmatrix} + 3 \begin{bmatrix} 2 & 1 \\ 4 & 0 \end{bmatrix} = \begin{bmatrix} 8 & 8 \\ 12 & 1 \end{bmatrix}$

The value of x is:

(a) 2

(b) 3

(c) 4

~~(d) 5~~', 1, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-caf50f-1-11', 'caf50f', 11, '1', '(xii) The centroid of a $\triangle ABC$ is G (6, 7). If the coordinates of the vertices A, B and C are (a, 5), (7, 9) and (5, 7) respectively.

The value of a is:

(a) 9

~~(b) 6~~

(c) 3

(d) 7', 1, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-caf50f-1-12', 'caf50f', 12, '1', '(xiii) In the given diagram AC is a diameter of the circle and $\angle ADB=35^\circ$

The degree measure of x is:

~~(a) 55^\circ~~

(b) 35^\circ

(c) 45^\circ

(d) 70^\circ', 1, 'Circles', 'short', 4, 'caf50f__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-1-13', 'caf50f', 13, '1', '(xiv) If the nth term of an Arithmetic Progression (A.P.) is (n + 3), then the first three terms of the A.P. are:

(a) 1,2,3
(b) 2,4,6

☑ (c) 4,5,6

(d) 7,8,9', 1, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-caf50f-1-14', 'caf50f', 14, '1', '(xv) The median of a grouped frequency distribution is found graphically by drawing:', 1, 'Statistics', 'MCQ', 5, NULL, array['a linear graph', 'a histogram', 'a frequency polygon', 'a cumulative frequency curve']::text[]),
  ('MQ-caf50f-2-0', 'caf50f', 15, '2', '(i) Salman deposits ₹1200 every month in a recurring deposit account for 2 ½ years. If the rate of interest is 6% per annum, find the amount he will receive on maturity. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-caf50f-2-1', 'caf50f', 16, '2', '(ii) 3, 9, m, 81 and n are in continued proportion. Find the values of m and n. [4]', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-caf50f-2-2', 'caf50f', 17, '2', '(iii) Prove that: \(\frac{\cos A}{1 + \sin A} + \frac{1 + \sin A}{\cos A} = 2\sec A\) [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-caf50f-3-0', 'caf50f', 18, '3', 'The inner circumference of the rim of a circular metal tub is 44 cm. [4]

Find:

(a) The inner radius of the tub
(b) The volume of the material of the tub if it''s outer radius is \(8\mathrm{cm}\).

Use $$\pi = \frac{22}{7}$$

Give your answer correct to three significant figures.', 4, 'Mensuration', 'long', 5, 'caf50f__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-3-1', 'caf50f', 19, '3', '(ii) From the given figure:

[4]

(a) Write down the coordinates of A and B.
(b) If P divides AB in the ratio 2:3, find the coordinates of point P
(c) Find the equation of a line parallel to line AB and passing through origin.', 4, 'Coordinate Geometry', 'long', 6, 'caf50f__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-3-2', 'caf50f', 20, '3', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along the axes.

[5]

Plot the $$\Delta OAB$$, where $$O(0, 0)$$, $$A(3, -2)$$, $$B(2, -3)$$.

(a) Reflect the \(\Delta OAB\) through the origin and name it as \(\Delta OA''B''\).
(b) Reflect the \(\Delta OA''B''\) on the \(y - axis\) and name it as \(\Delta OA''''B''''\).
(c) Reflect the \(\Delta OA''B''\) on the \(x - axis\) and name it as \(\Delta OA''''''B''''''\).
(d) Join the points \( AA''''B''''B''A'' A''''''B''''''B \) and give the geometrical name of the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-caf50f-4-0', 'caf50f', 21, '4', '☑ (i) The following bill shows the GST rates and the marked price of articles: [3]

| BILL: COMPUTERS | | |
| --- | --- | --- |
| Articles | Marked price | Rate of GST |
| Graphic Card | Rs 15500.00 | 18% |
| Laptop adapter | Rs 1900.00 | 28% |

Find the total amount to be paid for the above bill.', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-caf50f-4-1', 'caf50f', 22, '4', '(ii) Solve the following quadratic equation, [3]

$$7x^2 + 2x - 2 = 0$$

Give your answer correct to two places of decimal', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-caf50f-4-2', 'caf50f', 23, '4', '(iii) Use graph sheet for this question. Draw a histogram for the daily earnings of 54 medical stores in the following table and hence estimate the mode for the following distribution. Take 2 cm = ₹500 units along the x-axis and 2 cm = 5 stores along the y-axis. [4]

| Daily earnings (₹) | 4500 – 5000 | 5000 – 5500 | 5500 – 6000 | 6000 – 6500 | 6500 – 7000 |
| --- | --- | --- | --- | --- | --- |
| No. of medical stores | 20 | 14 | 12 | 5 | 3 |', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-caf50f-5-0', 'caf50f', 24, '5', '(i) $$A = \begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix}, B = \begin{bmatrix} 6 \\ 1 \end{bmatrix}$$ and $$C = \begin{bmatrix} -4 \\ 5 \end{bmatrix}$$, Evaluate AB – 5C [3]', 3, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-caf50f-5-1', 'caf50f', 25, '5', '(ii) In the given figure, O is the centre of circle. The tangent PT meets the diameter RQ produced at P. [3]

(a) Prove \(\Delta PQT\sim \Delta PTR\)
(b) If \( PT = 6 \, cm \), \( QR = 9 \, cm \). Find the length of \( PQ \)', 3, 'Similarity', 'short', 8, 'caf50f__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-5-2', 'caf50f', 26, '5', '(iii) Factorise the given polynomial completely, using Remainder Theorem: [4]

$$6x^3 + 25x^2 + 31x + 10$$', 4, 'Factorisation and Remainder Theorem', 'long', 8, NULL, NULL),
  ('MQ-caf50f-6-0', 'caf50f', 27, '6', '(i) ABCD is a square where B (1, 3), D (3, 2) are the end points of the diagonal BD. Find: [3]

(a) the coordinates of point of intersection of the diagonals AC and BD
(b) the equation of the diagonal AC', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-caf50f-6-2', 'caf50f', 28, '6', '(iii) The first, the last term and the common difference of an Arithmetic Progression are 98, 1001 and 7 respectively. Find the following for the given Arithmetic Progression: [4]

(a) number of terms \( n \).
(b) Sum of the \(n\) terms.', 4, 'Arithmetic Progression', 'long', 8, NULL, NULL),
  ('MQ-caf50f-7-0', 'caf50f', 29, '7', '(i) A box contains some green, yellow and white tennis balls. The probability of selecting a green ball is $\frac{1}{4}$ and yellow ball is $\frac{1}{3}$. If the box contains 10 white balls, then find:

(a) total number of balls in the box.
(b) probability of selecting a white ball.', NULL, 'Probability', 'short', 9, NULL, NULL),
  ('MQ-caf50f-7-1', 'caf50f', 30, '7', '(ii) A cone and a sphere having the same radius are melted and recast into a cylinder. The radius and height of the cone are 3 cm and 12 cm respectively. If the radius of the cylinder so formed is 2 cm, find the height of the cylinder.', NULL, 'Mensuration', 'short', 9, NULL, NULL),
  ('MQ-caf50f-7-2', 'caf50f', 31, '7', '(iii) In the given diagram, ABCD is a cyclic quadrilateral and PQ is a tangent to the smaller circle at E. Given $\angle AEP = 70^{\circ}, \angle BOC = 110^{\circ}$. Find:

(a) \(\angle ECB,\)
(b) \(\angle BEC,\)
(c) \(\angle BFC,\)
(d) \(\angle DAB,\)', NULL, 'Circles', 'short', 9, 'caf50f__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-8-0', 'caf50f', 32, '8', '(i) Solve the following inequation:

$$- \frac{x}{3} - 4 \leq \frac{x}{2} - \frac{7}{3} < - \frac{7}{6}, x \in R$$

Represent the solution set on a number line.', NULL, 'Linear Inequations', 'short', 9, NULL, NULL),
  ('MQ-caf50f-8-1', 'caf50f', 33, '8', '(ii)

The following table gives the petrol prices per litre for a period of 50 days.

[3]

| Price (₹) | 85 – 90 | 90 – 95 | 95 – 100 | 100 - 105 | 105 - 110 |
| --- | --- | --- | --- | --- | --- |
| No. of days | 12 | 10 | 8 | 15 | 5 |

Find the mean price of petrol per litre to the nearest rupee using step – deviation method.', 3, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-caf50f-8-2', 'caf50f', 34, '8', '(iii)

In the given diagram, ABC is a triangle and BCFD is a parallelogram.

[4]

AD: DB = 4: 5 and EF = 15 cm.

Find:

(a) AE : EC

(b) DE

(c) BC', 4, 'Similarity', 'long', 10, 'caf50f__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-caf50f-9-0', 'caf50f', 35, '9', '(i) Amit takes 12 days less than the days taken by Bijoy to complete a certain work. If both, working together, takes 8 days to complete the work, find the number of days taken by Bijoy to complete the work, working alone.', NULL, 'Quadratic Equations', 'short', 10, NULL, NULL),
  ('MQ-caf50f-9-1', 'caf50f', 36, '9', '(ii) Use a graph sheet for this question. The daily wages of 120 workers working at a site are given below:

| Wages (₹) | 250 – 300 | 300 – 350 | 350 – 400 | 400 - 450 | 450 – 500 | 500 – 550 | 550 - 600 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 8 | 15 | 20 | 30 | 25 | 15 | 7 |

Use 2cm = ₹ 50 and 2 cm = 20 workers along x – axis and y – axis respectively to draw an ogive and hence estimate:

(a) the median wages
(b) the inter - quartile range of wages
(c) percentage of workers whose daily wage is above 475.', NULL, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-caf50f-10-0', 'caf50f', 37, '10', '(i) Solve for x, using the properties of proportion. [3]

$$\frac{\sqrt{2+x} + \sqrt{3-x}}{\sqrt{2+x} - \sqrt{3-x}} = 3$$', 3, 'Ratio and Proportion', 'short', 11, NULL, NULL),
  ('MQ-caf50f-10-1', 'caf50f', 38, '10', '(ii) Using ruler and compasses, construct a regular hexagon of side 4.5 cm. Hence construct a circle circumscribing the hexagon. Measure and write down the length of the circum-radius. [3]', 3, 'Constructions', 'short', 11, NULL, NULL),
  ('MQ-caf50f-10-2', 'caf50f', 39, '10', '(iii) An observer standing on the top of a lighthouse 150 m above the sea level watches a ship sailing away. As he observes, the angle of depression of the ship changes from 50° to 30°. Determine the distance travelled by the ship during the period of observation. Give your answer correct to the nearest meter. (Use Mathematical Table for this question.) [4]', 4, 'Trigonometry', 'long', 11, NULL, NULL),
  ('MQ-7416af-1-5', '7416af', 0, '1', '(vi) In the given figure ∠BAP = ∠DCP = 70°, PC = 6 cm and CA = 4 cm, then PD : DB
is:', 1, 'Similarity', 'MCQ', 3, '7416af__ICSE_X_Mat_p3_img_0_jpeg.webp', array['5 : 3', '3 : 5', '3 : 2', '2 : 3']::text[]),
  ('MQ-7416af-1-7', '7416af', 1, '1', '(viii) (1 + sinA) (1 - sinA) is equal to:', 1, 'Trigonometry', 'MCQ', 3, NULL, array['cosec²A', 'sin²A', 'sec²A', 'cos²A']::text[]),
  ('MQ-7416af-1-8', '7416af', 2, '1', '(ix) The coordinates of the vertices of ΔABC are respectively (-4, -2), (6, 2) and (4, 6). The centroid G of ΔABC is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(2, 2)', '(2, 3)', '(3, 3)', '(0, -1)']::text[]),
  ('MQ-7416af-1-9', '7416af', 3, '1', '(x) The nth term of an Arithmetic Progression (A.P.) is 2n + 5. The 10th term is', 1, 'Arithmetic Progression', 'MCQ', 4, NULL, array['7', '15', '25', '45']::text[]),
  ('MQ-7416af-1-10', '7416af', 4, '1', '(xi) The mean proportional between 4 and 9 is:', 1, 'Ratio and Proportion', 'MCQ', 4, NULL, array['4', '6', '9', '36']::text[]),
  ('MQ-7416af-1-12', '7416af', 5, '1', '(xiii) Volume of a cylinder of height 3 cm is 48π. Radius of the cylinder is:', 1, 'Mensuration', 'MCQ', 4, NULL, array['\(48\mathrm{cm}\)', '\(16\mathrm{cm}\)', '\(4\mathrm{cm}\)', '\(24\mathrm{cm}\)']::text[]),
  ('MQ-7416af-1-14', '7416af', 6, '1', '(xv) The solution set for the inequation $2x + 4 \leq 14$, $x \in \mathbb{W}$ is:', 1, 'Linear Inequations', 'MCQ', 5, NULL, array['$\{1, 2, 3, 4, 5\}$', '$\{0, 1, 2, 3, 4, 5\}$', '$\{1, 2, 3, 4\}$', '$\{0, 1, 2, 3, 4\}$']::text[]),
  ('MQ-7416af-2-0', '7416af', 7, '2', '(i) Find the value of ''a'' if $x - a$ is a factor of the polynomial $3x^3 + x^2 - ax - 81$. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-7416af-2-1', '7416af', 8, '2', '(ii) Salman deposits ₹ 1000 every month in a recurring deposit account for 2 years. [4]
If he receives ₹ 26000 on maturity, find:

- (a) the total interest Salman earns.
- (b) the rate of interest.', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-7416af-2-2', '7416af', 9, '2', '(iii) In the given figure O, is the centre of the circle. CE is a tangent to the circle at A. [4]
If $\angle ABD = 26^\circ$, then find:

- (a) $\angle BDA$
- (b) $\angle BAD$
- (c) $\angle CAD$
- (d) $\angle ODB$', 4, 'Circles', 'long', 5, '7416af__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-7416af-3-0', '7416af', 10, '3', '(i) Solve the following quadratic equation: [4]

$$x^2 + 4x - 8 = 0$$

Give your answer correct to one decimal place.

(Use mathematical tables if necessary.)', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-7416af-3-2', '7416af', 11, '3', '(iii) Use graph sheet to answer this question. Take 2 cm = 1 unit along both the axes. [5]

(a) Plot A, B, C where A(0, 4), B(1, 1) and C(4, 0)
(b) Reflect A and B on the \(x\)-axis and name them as E and D respectively.
(c) Reflect B through the origin and name it F. Write down the coordinates of F.
(d) Reflect B and C on the \(y\)-axis and name them as H and G respectively.
(e) Join points A, B, C, D, E, F, G, H and A in order and name the closed figure formed.', 5, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-7416af-4-0', '7416af', 12, '4', '(i)

If $$A = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}, B = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}, C = \begin{bmatrix} 4 & 1 \\ 1 & 5 \end{bmatrix}$$ and $$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$. [3]

Find $$A(B + C) - 14I$$', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-7416af-4-1', '7416af', 13, '4', '(ii) ABC is a triangle whose vertices are A(1, -1), B(0, 4) and C(-6, 4). [3]

D is the midpoint of BC. Find the:

(a) coordinates of D.
(b) equation of the median AD.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-7416af-4-2', '7416af', 14, '4', '(iii) In the given figure, O is the centre of the circle. PQ is a tangent to the circle at T. [4] Chord AB produced meets the tangent at P.

$$AB = 9 \text{ cm}, BP = 16 \text{ cm}, \angle PTB = 50^\circ$$

$$\angle OBA = 45^\circ$$

Find:

(a) length of PT
(b) \(\angle BAT\)
(c) \(\angle BOT\)
(d) \(\angle ABT\)', 4, 'Circles', 'long', 6, '7416af__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-7416af-5-0', '7416af', 15, '5', '(i) Mrs. Arora bought the following articles from a departmental store: [3]
| S. No. | Item | Price | Rate of GST | Discount |
| --- | --- | --- | --- | --- |
| 1. | Hair oil | ₹ 1200 | 18% | ₹ 100 |
| 2. | Cashew nuts | ₹ 600 | 12% | – |
Find the:

(a) Total GST paid.
(b) Total bill amount including GST.', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-7416af-5-1', '7416af', 16, '5', '(ii) Solve the following inequation. Write down the solution set and represent it on the real number line. [3]

$$-5(x - 9) \geq 17 - 9x > x + 2, x \in R$$', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-7416af-5-2', '7416af', 17, '5', '(iii) In the given figure, AC // DE // BF.

If AC = 24 cm, EG=8 cm, GB=16 cm, BF=30 cm.

(a) Prove \(\Delta G E D\sim \Delta G B F\)
(b) Find DE
(c) DB:AB', NULL, 'Similarity', 'short', 7, '7416af__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-7416af-6-0', '7416af', 18, '6', '(i) The following distribution gives the daily wages of 60 workers of a factory.

[3]

| Daily income in ₹ | Number of workers (f) |
| --- | --- |
| 200 – 300 | 6 |
| 300 – 400 | 10 |
| 400 – 500 | 14 |
| 500 – 600 | 16 |
| 600 – 700 | 10 |
| 700 – 800 | 4 |

Use graph paper to answer this question.

Take 2 cm = ₹ 100 along one axis and 2 cm = 2 workers along the other axis.

Draw a histogram and hence find the mode of the given distribution.', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-7416af-6-1', '7416af', 19, '6', '(ii) The 5th term and the 9th term of an Arithmetic Progression are 4 and –12 respectively. [3]

Find:

(a) the first term
(b) common difference
(c) sum of 16 terms of the AP.', 3, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-7416af-7-0', '7416af', 20, '7', '(i) A bag contains 25 cards, numbered through 1 to 25. A card is drawn at random. What is the probability that the number on the card drawn is: [3]

(a) multiple of 5
(b) a perfect square
(c) a prime number?', 3, 'Probability', 'short', 9, NULL, NULL),
  ('MQ-7416af-7-1', '7416af', 21, '7', '(ii) A man covers a distance of 100 km, travelling with a uniform speed of x km/hr. Had the speed been 5 km/hr more it would have taken 1 hour less. Find x the original speed. [3]', 3, 'Quadratic Equations', 'short', 9, NULL, NULL),
  ('MQ-7416af-7-2', '7416af', 22, '7', '(iii) A solid is in the shape of a hemisphere of radius 7 cm, surmounted by a cone of height 4 cm. The solid is immersed completely in a cylindrical container filled with water to a certain height. If the radius of the cylinder is 14 cm, find the rise in the water level. [4]', 4, 'Mensuration', 'long', 9, '7416af__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-7416af-8-0', '7416af', 23, '8', '(i) The following table gives the marks scored by a set of students in an examination. [3]
Calculate the mean of the distribution by using the short cut method.

| Marks | Number of Students (f) |
| --- | --- |
| 0 - 10 | 3 |
| 10 - 20 | 8 |
| 20 - 30 | 14 |
| 30 - 40 | 9 |
| 40 - 50 | 4 |
| 50 - 60 | 2 |', 3, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-7416af-8-2', '7416af', 24, '8', '(iii) Using ruler and compass construct a triangle ABC in which AB = 6 cm. ∠BAC = 120° and AC = 5 cm. Construct a circle passing through A, B and C. Measure and write down the radius of the circle. [4]', 4, 'Constructions', 'long', 10, NULL, NULL),
  ('MQ-7416af-9-0', '7416af', 25, '9', '(i) Using Componendo and Dividendo solve for x: [3]

$$\frac{\sqrt{2x+2} + \sqrt{2x-1}}{\sqrt{2x+2} - \sqrt{2x-1}} = 3$$', 3, 'Ratio and Proportion', 'short', 10, NULL, NULL),
  ('MQ-7416af-9-1', '7416af', 26, '9', '(ii) Which term of the Arithmetic Progression (A.P.) 15, 30, 45, 60... is 300? [3]

Hence find the sum of all the terms of the Arithmetic Progression (A.P.)', 3, 'Arithmetic Progression', 'short', 10, NULL, NULL),
  ('MQ-7416af-9-2', '7416af', 27, '9', '(iii) From the top of a tower 100 m high a man observes the angles of depression of two ships A and B, on opposite sides of the tower as 45° and 38° respectively. If the foot of the tower and the ships are in the same horizontal line find the distance between the two ships A and B to the nearest metre. [4]

(Use Mathematical Tables for this question.)', 4, 'Trigonometry', 'long', 11, '7416af__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-7416af-10-0', '7416af', 28, '10', '(i) Factorize completely using factor theorem: [4]

$$2x^3 - x^2 - 13x - 6$$', 4, 'Factorisation and Remainder Theorem', 'long', 11, NULL, NULL),
  ('MQ-7416af-10-1', '7416af', 29, '10', '(ii) Use graph paper to answer this question. [6]

During a medical checkup of 60 students in a school, weights were recorded as follows:

| Weight (in kg) | Number of Students |
| --- | --- |
| 28 – 30 | 2 |
| 30 – 32 | 4 |
| 32 – 34 | 10 |
| 34 – 36 | 13 |
| 36 – 38 | 15 |
| 38 – 40 | 9 |
| 40 – 42 | 5 |
| 42 – 44 | 2 |

Taking 2 cm = 2 kg along one axis and 2 cm = 10 students along the other axis draw an ogive. Use your graph to find the:

- (a) median
- (b) upper Quartile
- (c) number of students whose weight is above 37 kg', 6, 'Statistics', 'long', 11, NULL, NULL),
  ('MQ-23dbf0-1-0', '23dbf0', 0, '1', '(i) For an Intra-state sale, the CGST paid by a dealer to the Central government is ₹ 120. If the marked price of the article is ₹ 2000, the rate of GST is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['\(6\%\)', '\(10\%\)', '\(12\%\)', '\(16.67\%\)']::text[]),
  ('MQ-23dbf0-1-1', '23dbf0', 1, '1', '(ii) What must be subtracted from the polynomial $x^3 + x^2 - 2x + 1$, so that the result is exactly divisible by $(x - 3)$?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['-31', '-30', '30', '31']::text[]),
  ('MQ-23dbf0-1-2', '23dbf0', 2, '1', '(iii) The roots of the quadratic equation $px^2 - qx + r = 0$ are real and equal if:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['\(p^2 = 4qr\)', '\(q^2 = 4pr\)', '\(-q^{2} = 4pr\)', '\(p^2 > 4qr\)']::text[]),
  ('MQ-23dbf0-1-3', '23dbf0', 3, '1', '(iv) If matrix $A = \begin{bmatrix} 2 & 2 \\ 0 & 2 \end{bmatrix}$ and $A^2 = \begin{bmatrix} 4 & x \\ 0 & 4 \end{bmatrix}$, then the value of $x$ is:', 1, 'Matrices', 'MCQ', 2, NULL, array['2', '4', '8', '10']::text[]),
  ('MQ-23dbf0-1-4', '23dbf0', 4, '1', '(v) The median of the following observations arranged in ascending order is 64. Find the value of $x$:
27, 31, 46, 52, $x$, $x + 4$, 71, 79, 85, 90', 1, 'Statistics', 'MCQ', 2, NULL, array['60', '61', '62', '66']::text[]),
  ('MQ-23dbf0-1-5', '23dbf0', 5, '1', '(vi) Points A $(x, y)$, B $(3, -2)$ and C $(4, -5)$ are collinear. The value of $y$ in terms of $x$ is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['\(3x - 11\)', '\(11 - 3x\)', '\(3x - 7\)', '\(7 - 3x\)']::text[]),
  ('MQ-23dbf0-1-6', '23dbf0', 6, '1', '(vii) The given table shows the distance covered and the time taken by a train moving at a uniform speed along a straight track.
| Distance (in m) | 60 | 90 | 120 |
| --- | --- | --- | --- |
| Time (in sec) | 2 | 4 | 5 |
The values of x and y are:', 1, NULL, 'MCQ', 3, NULL, array['\(x = 4, y = 150\)', '\(x = 3, y = 100\)', '\(x = 4, y = 100\)', '\(x = 3, y = 150\)']::text[]),
  ('MQ-23dbf0-1-7', '23dbf0', 7, '1', '(viii) The 7th term of the given Arithmetic Progression (A.P.):
$$\frac{1}{a}, \left(\frac{1}{a} + 1\right), \left(\frac{1}{a} + 2\right) \dots \text{ is:}$$', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['\(\left(\frac{1}{a} + 6\right)\)', '\(\left(\frac{1}{a} + 7\right)\)', '\(\left(\frac{1}{a} + 8\right)\)', '\(\left(\frac{1}{a} + 7^7\right)\)']::text[]),
  ('MQ-23dbf0-1-8', '23dbf0', 8, '1', '(ix) The sum invested to purchase 15 shares of a company of nominal value ₹ 75 available at a discount of 20% is:', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['60', '90', '1350', '900']::text[]),
  ('MQ-23dbf0-1-9', '23dbf0', 9, '1', '(x) The circumcentre of a triangle is the point which is:', 1, 'Circles', 'MCQ', 3, NULL, array['at equal distance from the three sides of the triangle.', 'at equal distance from the three vertices of the triangle.', 'the point of intersection of the three medians.', 'the point of intersection of the three altitudes of the triangle.']::text[]),
  ('MQ-23dbf0-1-10', '23dbf0', 10, '1', '(xi) Statement 1: $$\sin^2 \theta + \cos^2 \theta = 1$$
Statement 2: $$\text{cosec}^2 \theta + \cot^2 \theta = 1$$
Which of the following is valid?', 1, 'Trigonometry', 'MCQ', 4, NULL, array['only 1', 'only 2', 'both 1 and 2', 'neither 1 nor 2']::text[]),
  ('MQ-23dbf0-1-11', '23dbf0', 11, '1', '(xii) In the given diagram, PS and PT are the tangents to the circle. SQ || PT and
$$\angle SPT = 80^\circ$$. The value of $$\angle QST$$ is:', 1, 'Circles', 'MCQ', 4, '23dbf0__ICSE_X_Mat_p4_img_0_jpeg.webp', array['\(140^{\circ}\)', '\(90^{\circ}\)', '\(80^{\circ}\)', '\(50^{\circ}\)']::text[]),
  ('MQ-23dbf0-1-12', '23dbf0', 12, '1', '(xiii) Assertion (A): A die is thrown once and the probability of getting an even number is $$\frac{2}{3}$$.
Reason (R): The sample space for even numbers on a die is {2, 4, 6}', 1, 'Probability', 'MCQ', 4, NULL, array['A is true, R is false.', 'A is false, R is true.', 'Both A and R are true.', 'Both A and R and false.']::text[]),
  ('MQ-23dbf0-1-13', '23dbf0', 13, '1', '(xiv) A rectangular sheet of paper of size 11 cm x 7 cm is first rotated about the side 11 cm and then about the side 7 cm to form a cylinder, as shown in the diagram. The ratio of their curved surface areas is:', 1, 'Mensuration', 'MCQ', 4, '23dbf0__ICSE_X_Mat_p4_img_1_jpeg.webp', array['\(1:1\)', '\(7:11\)', '\(11:7\)', '\(\frac{11\pi}{7}:\frac{7\pi}{11}\)']::text[]),
  ('MQ-23dbf0-1-14', '23dbf0', 14, '1', '(xv) In the given diagram, ΔABC ~ ΔPQR. If AD and PS are bisectors of ∠BAC and ∠QPR respectively then:', 1, 'Similarity', 'MCQ', 5, '23dbf0__ICSE_X_Mat_p5_img_0_jpeg.webp', array['\(\Delta ABC \sim \Delta PQS\)', '\(\Delta ABD \sim \Delta PQS\)', '\(\Delta ABD \sim \Delta PSR\)', '\(\Delta ABC \sim \Delta PSR\)']::text[]),
  ('MQ-23dbf0-2-0', '23dbf0', 15, '2', '$$A = \begin{bmatrix} x & 0 \\ 1 & 1 \end{bmatrix}, B = \begin{bmatrix} 4 & 0 \\ y & 1 \end{bmatrix} \text{ and } C = \begin{bmatrix} 4 & 0 \\ x & 1 \end{bmatrix} \tag{4}$$

Find the values of x and y, if AB = C.', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-23dbf0-2-1', '23dbf0', 16, '2', '(ii) A solid metallic cylinder is cut into two identical halves along its height (as shown in the diagram). The diameter of the cylinder is 7 cm and the height is 10 cm. Find:

(a) The total surface area (both the halves).
(b) The total cost of painting the two halves at the rate of \(\text{元} 30\) per cm²

$$\left(Use \pi = \frac{22}{7}\right)$$', NULL, 'Mensuration', 'short', 5, '23dbf0__ICSE_X_Mat_p5_img_2_jpeg.webp', NULL),
  ('MQ-23dbf0-2-2', '23dbf0', 17, '2', '(iii) 15, 30, 60, 120... are in G.P. (Geometric Progression). [4]

(a) Find the \(\mathbf{n}^{\mathrm{th}}\) term of this G.P. in terms of \(n\).
(b) How many terms of the above G.P. will give the sum 945?', 4, 'Geometric Progression', 'long', 5, NULL, NULL),
  ('MQ-23dbf0-3-0', '23dbf0', 18, '3', '(i) Factorize: sin³θ + cos³θ [4]

Hence, prove the following identity:

$$\frac{\sin^3\theta + \cos^3\theta}{\sin\theta + \cos\theta} + \sin\theta\cos\theta = 1$$', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-23dbf0-3-1', '23dbf0', 19, '3', '(ii) In the given diagram, O is the centre of the circle. PR and PT are two tangents drawn from the external point P and touching the circle at Q and S respectively. MN is a diameter of the circle. Given ∠PQM = 42° and ∠PSM = 25°.

Find:

(a) \(\angle OQM\)
(b) \(\angle QNS\)
(c) \(\angle QOS\)
(d) \(\angle QMS\)', NULL, 'Circles', 'short', 6, '23dbf0__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-23dbf0-3-2', '23dbf0', 20, '3', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along the axes.

(a) Plot A(0, 3), B(2, 1) and C(4, -1).
(b) Reflect point B and C in \(y\)-axis and name their images as \(\mathbf{B}''\) and \(\mathbf{C}''\) respectively. Plot and write coordinates of the points \(\mathbf{B}''\) and \(\mathbf{C}''\).
(c) Reflect point A in the line BB'' and name its images as A''.
(d) Plot and write coordinates of point A''.
(e) Join the points ABA''B'' and give the geometrical name of the closed figure so formed.', NULL, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-23dbf0-4-0', '23dbf0', 21, '4', '(i) Suresh has a recurring deposit account in a bank. He deposits ₹ 2000 per month and the bank pays interest at the rate of \(8\%\) per annum. If he gets ₹ 1040 as interest at the time of maturity, find in years total time for which the account was held.', NULL, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-23dbf0-4-1', '23dbf0', 22, '4', '(ii) The following table gives the duration of movies in minutes. [3]

| Duration (in minutes) | 100 – 110 | 110 – 120 | 120 – 130 | 130 – 140 | 140 – 150 | 150 – 160 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of movies | 5 | 10 | 17 | 8 | 6 | 4 |

Using step – deviation method, find the mean duration of the movies.', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-23dbf0-4-2', '23dbf0', 23, '4', '(iii) If $$\frac{(a+b)^3}{(a-b)^3} = \frac{64}{27}$$ [4]

(a) Find $$\frac{a+b}{a-b}$$

(b) Hence using properties of proportion, find a : b.', 4, 'Ratio and Proportion', 'long', 7, NULL, NULL),
  ('MQ-23dbf0-5-0', '23dbf0', 24, '5', '(i) The given graph with a histogram represents the number of plants of different heights grown in a school campus. Study the graph carefully and answer the following questions: [5]

(a) Make a frequency table with respect to the class boundaries and their corresponding frequencies.
(b) State the modal class.
(c) Identify and note down the mode of the distribution.
(d) Find the number of plants whose height range is between \(80~\mathrm{cm}\) to \(90~\mathrm{cm}\).', 5, 'Statistics', 'long', 7, '23dbf0__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-23dbf0-5-1', '23dbf0', 25, '5', '(ii) The angle of elevation of the top of a 100 m high tree from two points A and B on the opposite side of the tree are 52° and 45° respectively. Find the distance AB, to the nearest', NULL, 'Trigonometry', 'short', 8, '23dbf0__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-23dbf0-6-0', '23dbf0', 26, '6', '(i) Solve the following quadratic equation for x and give your answer correct to three significant figures: 2x² - 10x + 5 = 0 [3]

(Use mathematical tables if necessary)', 3, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-23dbf0-6-1', '23dbf0', 27, '6', '(ii) The nᵗʰ term of an Arithmetic Progression (A.P.) is given by the relation Tₙ = 6(7 - n). [3] Find:

(a) its first term and common difference
(b) sum of its first 25 terms', 3, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-23dbf0-6-2', '23dbf0', 28, '6', '(iii) In the given diagram ΔADB and ΔACB are two right angled triangles with ∠ADB = ∠BCA = 90°. If AB = 10 cm. AD = 6 cm, BC = 2.4 cm and DP = 4.5 cm [4]

(a) Prove that \(\Delta APD \sim \Delta BPC\)
(b) Find the length of BD and PB
(c) Hence, find the length of PA
(d) Find area \(\Delta APD\) : area \(\Delta BPC\)', 4, 'Similarity', 'long', 8, '23dbf0__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-23dbf0-7-0', '23dbf0', 29, '7', '(i) In the given diagram, an isosceles ΔABC is inscribed in a circle with centre O. PQ is a tangent to the circle at C. OM is perpendicular to chord AC and ∠COM = 65°.

Find:

(a) \(\angle ABC\)
(b) \(\angle BAC\)
(c) \(\angle BCQ\)', NULL, 'Circles', 'short', 9, '23dbf0__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-23dbf0-7-1', '23dbf0', 30, '7', '(ii) Solve the following inequation, write down the solution set and represent it on the real number line.

$$-3 + x \leq \frac{7x}{2} + 2 < 8 + 2x, x \in I$$', NULL, 'Linear Inequations', 'short', 9, NULL, NULL),
  ('MQ-23dbf0-7-2', '23dbf0', 31, '7', '(iii) In the given diagram, ABC is a triangle, where B(4, -4) and C(-4, -2). D is a point on AC.

(a) Write down the coordinates of A and D.
(b) Find the coordinates of the centroid of \(\Delta ABC\).
(c) If \( D \) divides AC in the ratio \( k: 1 \), find the value of \( k \).
(d) Find the equation of the line BD.', NULL, 'Coordinate Geometry', 'short', 9, '23dbf0__ICSE_X_Mat_p9_img_1_jpeg.webp', NULL),
  ('MQ-23dbf0-8-0', '23dbf0', 32, '8', '(i) The polynomial $3x^3 + 8x^2 - 15x + k$ has $(x - 1)$ as a factor. Find the value of $k$. Hence [3] factorize the resulting polynomial completely.', 3, 'Factorisation and Remainder Theorem', 'short', 10, NULL, NULL),
  ('MQ-23dbf0-8-1', '23dbf0', 33, '8', '(ii) The following letters A, D, M, N, O, S, U, Y of the English alphabet are written on separate [3] cards and put in a box. The cards are well shuffled and one card is drawn at random. What is the probability that the card drawn is a letter of the word,

(a) MONDAY?
(b) which does not appear in MONDAY?
(c) which appears both in SUNDAY and MONDAY?', 3, 'Probability', 'short', 10, NULL, NULL),
  ('MQ-23dbf0-8-2', '23dbf0', 34, '8', '(iii) Oil is stored in a spherical vessel occupying 3/4 of its full capacity. Radius of this spherical [4] vessel is 28 cm. This oil is then poured into a cylindrical vessel with a radius of 21 cm. Find the height of the oil in the cylindrical vessel (correct to the nearest cm).

$$Take \pi = \frac{22}{7}$$', 4, 'Mensuration', 'long', 10, '23dbf0__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-23dbf0-9-0', '23dbf0', 35, '9', '(i) The figure shows a circle of radius 9 cm with O as the centre. The diameter AB produced [3] meets the tangent PQ at P. If PA = 24 cm, find the length of tangent PQ.', 3, 'Circles', 'short', 10, '23dbf0__ICSE_X_Mat_p10_img_1_jpeg.webp', NULL),
  ('MQ-23dbf0-9-1', '23dbf0', 36, '9', '(ii) Mr. Gupta invested ₹ 33000 in buying ₹ 100 shares of a company at 10% premium. The dividend declared by the company is 12%. Find: [3]

(a) the number of shares purchased by him.
(b) his annual dividend.', 3, 'Shares and Dividends', 'short', 11, NULL, NULL),
  ('MQ-23dbf0-9-2', '23dbf0', 37, '9', '(iii) A life insurance agent found the following data for distribution of ages of 100 policy holders: [4]

| Age in years | Policy Holders (frequency) | Cumulative frequency |
| --- | --- | --- |
| 20 – 25 | 2 | 2 |
| 25 – 30 | 4 | 6 |
| 30 – 35 | 12 | 18 |
| 35 – 40 | 20 | 38 |
| 40 – 45 | 28 | 66 |
| 45 – 50 | 22 | 88 |
| 50 – 55 | 8 | 96 |
| 55 – 60 | 4 | 100 |

On a graph sheet draw an ogive using the given data. Take 2 cm = 5 years along one axis and 2 cm = 10 policy holders along the other axis. Use your graph to find:

(a) The median age.
(b) Number of policy holders whose age is above 52 years.', 4, 'Statistics', 'long', 11, NULL, NULL),
  ('MQ-23dbf0-10-0', '23dbf0', 38, '10', '(i) Rohan bought the following eatables for his friends : [3]

| Soham Sweet Mart : Bill | | | | |
| --- | --- | --- | --- | --- |
| S. No. | Item | Price | Quantity | Rate of GST |
| 1 | Laddu | ₹ 500 per kg | 2 kg | 5% |
| 2 | Pastries | ₹ 100 per piece | 12 pieces | 18% |

Calculate :

(a) Total GST paid.
(b) Total bill amount including GST.', 3, 'GST and Banking', 'short', 11, NULL, NULL),
  ('MQ-23dbf0-10-1', '23dbf0', 39, '10', '(ii) (a) If the lines \( kx - y + 4 = 0 \) and \( 2y = 6x + 7 \) are perpendicular to each other, find the value of \( k \).
(b) Find the equation of a line parallel to \(2y = 6x + 7\) and passing through \((-1, 1)\)', NULL, 'Coordinate Geometry', 'short', 12, NULL, NULL),
  ('MQ-23dbf0-10-2', '23dbf0', 40, '10', '(iii) Use ruler and compass to answer this question. Construct ∠ABC = 90°, where AB = 6 cm, BC = 8 cm.

(a) Construct the locus of points equidistant from B and C.
(b) Construct the locus of points equidistant from A and B.
(c) Mark the point which satisfies both the conditions (a) and (b) as O. Construct the locus of points keeping a fixed distance OA from the fixed point O.
(d) Construct the locus of points which are equidistant from BA and BC.', NULL, 'Constructions', 'short', 12, NULL, NULL),
  ('MQ-665d41-1-0', '665d41', 0, '1', '(i) If $A = \begin{bmatrix} -1 & 2 \end{bmatrix}$ and $B = \begin{bmatrix} 1 & -2 \\ 0 & 3 \end{bmatrix}$
Which of the following operation is possible?', 1, 'Matrices', 'MCQ', 1, NULL, array['A – B', 'A + B', 'AB', 'BA']::text[]),
  ('MQ-665d41-1-1', '665d41', 1, '1', '(ii) If $x^2 + kx + 6 = (x - 2)(x - 3)$ for all values of $x$, then the value of $k$ is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['$-5$', '$-3$', '$-2$', '$5$']::text[]),
  ('MQ-665d41-1-2', '665d41', 2, '1', '(iii) A retailer purchased an item for ₹1500 from a wholesaler and sells it to a customer at 10% profit. The sales are intra-state and the rate of GST is 10%. The amount of GST paid by the customer:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹15', '₹30', '₹150', '₹165']::text[]),
  ('MQ-665d41-1-3', '665d41', 3, '1', '(iv) If the roots of equation $x^2 - 6x + k = 0$ are real and distinct, then value of $k$ is:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['$>-9$', '$>-6$', '$<6$', '$<9$']::text[]),
  ('MQ-665d41-1-4', '665d41', 4, '1', '(v) Which of the following is/are an Arithmetic Progression (A.P.)?
1. $1, 4, 9, 16, \dots\dots\dots$
2. $\sqrt{3}, 2\sqrt{3}, 3\sqrt{3}, 4\sqrt{3}, \dots\dots\dots$
3. $8, 6, 4, 2, \dots\dots\dots$', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['only 1.', 'only 2.', 'only 2. and 3.', 'all 1., 2. and 3.']::text[]),
  ('MQ-665d41-1-5', '665d41', 5, '1', '(vi) The table shows the values of x and y, where x is proportional to y.
| x | 6 | 12 | N |
| --- | --- | --- | --- |
| y | M | 18 | 6 |
What are the values of M and N?', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['M = 4, N = 9', 'M = 9, N = 3', 'M = 9, N = 4', 'M = 12, N = 0']::text[]),
  ('MQ-665d41-1-6', '665d41', 6, '1', '(vii) In the given diagram, $$\Delta ABC \sim \Delta PQR$$ and $$\frac{AD}{PS} = \frac{3}{8}$$. The value of AB : PQ is:', 1, 'Similarity', 'MCQ', 3, '665d41__ICSE_X_Mat_p3_img_0_jpeg.webp', array['8 : 3', '3 : 5', '3 : 8', '5 : 8']::text[]),
  ('MQ-665d41-1-7', '665d41', 7, '1', '(viii) A right angle triangle shaped piece of hard board is rotated completely about its hypotenuse, as shown in the diagram. The solid so formed is always:
1. a single cone
2. a double cone
Which of the statement is valid?', 1, 'Mensuration', 'MCQ', 3, '665d41__ICSE_X_Mat_p3_img_1_jpeg.webp', array['only 1.', 'only 2.', 'both 1. and 2.', 'neither 1. nor 2.']::text[]),
  ('MQ-665d41-1-8', '665d41', 8, '1', '(ix) Event A: The sun will rise from east tomorrow.
Event B: It will rain on Monday.
Event C: February month has 29 days in a leap year.
Which of the above event(s) has probability equal to 1?', 1, 'Probability', 'MCQ', 4, NULL, array['all events A, B and C', 'both events A and B', 'both events B and C', 'both events A and C']::text[]),
  ('MQ-665d41-1-9', '665d41', 9, '1', '(x) The three vertices of a scalene triangle are always equidistant from a fixed point.
The point is:', 1, 'Circles', 'MCQ', 4, NULL, array['Orthocentre of the triangle.', 'Incentre of the triangle.', 'Circumcentre of the triangle.', 'Centroid of the triangle.']::text[]),
  ('MQ-665d41-1-10', '665d41', 10, '1', '(xi) In a circle with radius R, the shortest distance between two parallel tangents is equal to:', 1, 'Circles', 'MCQ', 4, NULL, array['R', '2R', '2πR', 'πR']::text[]),
  ('MQ-665d41-1-11', '665d41', 11, '1', '(xii) An observer at point E, which is at a certain distance from the lamp post AB, finds the angle of elevation of top of lamp post from positions C, D and E as α, β and γ. It is given that B, C, D and E are along a straight line.
Which of the following condition is satisfied?', 1, 'Trigonometry', 'MCQ', 4, '665d41__ICSE_X_Mat_p4_img_0_jpeg.webp', array['tanα > tan β', 'tan β < tan γ', 'tan γ > tan α', 'tan α < tan β']::text[]),
  ('MQ-665d41-1-12', '665d41', 12, '1', '(xiii) 1. Shares of company A, paying 12%, ₹100 shares are at ₹80.
2. Shares of company B, paying 12%, ₹100 shares at ₹100.
3. Shares of company C, paying 12%, ₹100 shares are at ₹120.
Shares of which company are at premium?', 1, 'Shares and Dividends', 'MCQ', 5, NULL, array['Company A', 'Company B', 'Company C', 'Company A and C']::text[]),
  ('MQ-665d41-1-13', '665d41', 13, '1', '(xiv) Which of the following equation represent a line passing through origin?', 1, 'Coordinate Geometry', 'MCQ', 5, NULL, array['3x - 2y + 5 = 0', '2x - 3y = 0', 'x = 5', 'y = -6']::text[]),
  ('MQ-665d41-1-14', '665d41', 14, '1', '(xv) For the given 25 variables: x₁, x₂, x₃ ... ... ... ... x₂₅
Assertion (A): To find median of the given data, the variate needs to be arranged in ascending or descending order.
Reason (R): The median is the central most term of the arranged data.', 1, 'Statistics', 'MCQ', 5, NULL, array['A is true, R is false', 'A is false, R is true', 'both A and R are true', 'both A and R are false']::text[]),
  ('MQ-665d41-2-0', '665d41', 15, '2', '(i) Shown below is a horizontal water tank composed of a cylinder and two hemispheres. The tank is filled up to a height of 7 m. Find the surface area of the tank in contact with water. Use π = 22/7.', NULL, 'Mensuration', 'short', 5, '665d41__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-665d41-2-1', '665d41', 16, '2', '(ii) In a recurring deposit account for 2 years, the total amount deposited by a person is ₹ 9600. If the interest earned by him is one-twelfth of his total deposit, then find: [4]

(a) the interest he earns.
(b) his monthly deposit.
(c) the rate of interest.', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-665d41-2-2', '665d41', 17, '2', '(iii) Find: [4]

(a) $$(\sin \theta + \text{cosec } \theta)^2$$
(b) $$(\cos \theta + \sec \theta)^2$$

Using the above results prove the following trigonometry identity.

$$(\sin \theta + \text{cosec } \theta)^2 + (\cos \theta + \sec \theta)^2 = 7 + \tan^2 \theta + \cot^2 \theta$$', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-665d41-3-0', '665d41', 18, '3', '(i) If a, b and c are in continued proportion, then prove that: [4]

$$\frac{3a^2 + 5ab + 7b^2}{3b^2 + 5bc + 7c^2} = \frac{a}{c}$$', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-665d41-3-1', '665d41', 19, '3', '(ii) In the given diagram, O is the centre of circle circumscribing the ΔABC. [4] CD is perpendicular to chord AB. ∠OAC=32°. Find each of the unknown angles x, y and z.', 4, 'Circles', 'long', 6, '665d41__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-665d41-3-2', '665d41', 20, '3', '(iii) Study the graph and answer each of the following:

[5]

- (a) Name the curve plotted
- (b) Total number of students
- (c) The median marks
- (d) Number of students scoring between 50 and 80 marks', 5, 'Statistics', 'long', 7, '665d41__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-665d41-4-0', '665d41', 21, '4', '(i) If $$A = \begin{bmatrix} 4 & -4 \\ -4 & 4 \end{bmatrix}$$, find $$A^2$$. If $$A^2 = p A$$, then find the value of $$p$$. [3]', 3, 'Matrices', 'short', 8, NULL, NULL),
  ('MQ-665d41-4-1', '665d41', 22, '4', '(ii) Solve the given equation $$x^2 - 4x - 2 = 0$$ and express your answer correct to two places [3] of decimal.

(You may use mathematical tables for this question).', 3, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-665d41-4-2', '665d41', 23, '4', '(iii) In the given diagram, $$\Delta ABC$$ is right angled at B. BDFE is a rectangle. [4]

AD = 6 cm, CE = 4 cm and BC = 12 cm

(a) prove that \(\Delta \mathrm{ADF} \sim \Delta \mathrm{FEC}\)
(b) prove that \(\Delta \mathrm{ADF} \sim \Delta \mathrm{ABC}\)
(c) find the length of FE
(d) find area \(\Delta \mathrm{ADF}\) : area \(\Delta \mathrm{ABC}\)', 4, 'Similarity', 'long', 8, '665d41__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-665d41-5-0', '665d41', 24, '5', '(i) Shown below is a table illustrating the monthly income distribution of a company with [3] 100 employees.

| Monthly Income (in ₹10, 000) | 0 - 4 | 4 - 8 | 8 - 12 | 12 - 16 | 16 - 20 | 20 - 24 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of employees | 55 | 15 | 06 | 08 | 12 | 4 |

Using step- deviation method, find the mean monthly income of an employee.', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-665d41-5-1', '665d41', 25, '5', '(ii) The following bill shows the GST rate and the marked price of articles: [3]

| Vidhyut Electronics | | | | |
| --- | --- | --- | --- | --- |
| S. No. | Item | Marked Price | Quantity | Rate of GST |
| (a) | LED TV set | ₹ 12000 | 01 | 28% |
| (b) | MP4 player | ₹ 5000 | 01 | 18% |

Find the total amount to be paid (including GST) for the above bill.', 3, 'GST and Banking', 'short', 8, NULL, NULL),
  ('MQ-665d41-5-2', '665d41', 26, '5', '(iii) In the given figure, O is the centre of the circle and AB is a tangent to the circle at B. [4]

If ∠PQB=55°.

(a) find the value of the angles x, y and z.
(b) prove that RB is parallel to PQ.', 4, 'Circles', 'long', 9, '665d41__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-665d41-6-0', '665d41', 27, '6', '(i) There are three positive numbers in a Geometric Progression (G.P.) such that: [3]

(a) their product is 3375
(b) the result of the product of first and second number added to the product of second and third number is 750.

Find the numbers.', 3, 'Geometric Progression', 'short', 9, NULL, NULL),
  ('MQ-665d41-6-1', '665d41', 28, '6', '(ii) The table given below shows the ages of members of a society. [3]

| Age (in years) | Number of Members of the Society |
| --- | --- |
| 25 – 35 | 05 |
| 35 – 45 | 32 |
| 45 – 55 | 69 |
| 55 - 65 | 80 |
| 65 – 75 | 61 |
| 75 - 85 | 13 |

Use graph sheet for this question.

Take 2cm = 10 years along one axis and 2cm=10 members along the other axis.

(a) Draw a histogram representing the above distribution.
(b) Hence find the modal age of the members.', 3, 'Statistics', 'short', 9, NULL, NULL),
  ('MQ-665d41-7-0', '665d41', 29, '7', '(i) The line segment joining A(2,-3) and B(-3, 2) is intercepted by the x-axis at the point M [5] and the y axis at the point N. PQ is perpendicular to AB produced at R and meets the y- axis at a distance of 6 units from the origin O, as shown in the diagram, at S. Find the:

(a) coordinates of M and N
(b) coordinates of S
(c) slope of AB.
(d) equation of line PQ.', 5, 'Coordinate Geometry', 'long', 10, '665d41__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-665d41-7-1', '665d41', 30, '7', '(ii) The angle of depression of two ships A and B on opposite sides of a light house of height [5] 100m are respectively 42° and 54°. The line joining the two ships passes through the foot of the lighthouse. 

(a) Find the distance between the two ships A and B.
(b) Give your final answer correct to the nearest whole number.

(Use mathematical tables for this question)', 5, 'Trigonometry', 'long', 10, '665d41__ICSE_X_Mat_p10_img_1_jpeg.webp', NULL),
  ('MQ-665d41-8-0', '665d41', 31, '8', '(i) Solve the following inequation write the solution set and represent it on the real number [3] line.

$$3 - 2x \geq x + \frac{1 - x}{3} > \frac{2x}{5}, x \in R$$', 3, 'Linear Inequations', 'short', 11, NULL, NULL),
  ('MQ-665d41-8-1', '665d41', 32, '8', '(ii) ABCD is a cyclic quadrilateral in which BC = CD and EF is a tangent at A. [3]

∠CBD = 43° and ∠ADB = 62°. Find:

(a) \(\angle ADC\)
(b) \(\angle ABD\)
(c) \(\angle FAD\)', 3, 'Circles', 'short', 11, '665d41__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-665d41-8-2', '665d41', 33, '8', '(iii) A (a, b), B(-4, 3) and C(8,-6) are the vertices of a ΔABC. Point D is on BC such that [4] BD : DC is 2 : 1 and M (6, 0) is mid point of AD. Find:

(a) coordinates of point D.
(b) coordinates of point A.
(c) equation of a line passing through M and parallel to line BC.', 4, 'Coordinate Geometry', 'long', 11, NULL, NULL),
  ('MQ-665d41-9-0', '665d41', 34, '9', '(i) Using componendo and dividend, find the value of x, when: [3]

$$\frac{x^3 + 3x}{3x^2 + 1} = \frac{14}{13}$$', 3, 'Ratio and Proportion', 'short', 11, NULL, NULL),
  ('MQ-665d41-9-1', '665d41', 35, '9', '(ii) The total expense of a trip for certain number of people is ₹18000. If three more people join [3] them, then the share of each reduces by ₹3000. Taking x to be the original number of people, form a quadratic equation in x and solve it to find the value of x.', 3, 'Quadratic Equations', 'short', 11, NULL, NULL),
  ('MQ-665d41-9-2', '665d41', 36, '9', '(iii) Using ruler and compass only construct ∠ABC = 60°, AB = 6 cm and BC = 5 cm. [4]

- (a) construct the locus of points equidistant from AB and BC.
- (b) construct the locus of points equidistant from A and B.
- (c) Mark the point which satisfies both the conditions (a) and (b) as P.

Hence, construct a circle with centre P and passing through A and B.', 4, 'Constructions', 'long', 12, NULL, NULL),
  ('MQ-665d41-10-0', '665d41', 37, '10', '(i) Using remainder and factor theorem, factorize completely, the given polynomial: [3]

$$2x^3 - 9x^2 + 7x + 6$$', 3, 'Factorisation and Remainder Theorem', 'short', 12, NULL, NULL),
  ('MQ-665d41-10-1', '665d41', 38, '10', '(ii) Each of the letter of the word “HOUSEWARMING” is written on cards and put in a bag. [3]

If a card is drawn at random from the bag after shuffling, what is the probability that the letter on the card is:

- (a) a vowel
- (b) one of the letters of the word SEWING.
- (c) not a letter from the word WEAR.', 3, 'Probability', 'short', 12, NULL, NULL),
  ('MQ-665d41-10-2', '665d41', 39, '10', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along the axes. [4]

- (a) Plot A (1, 2), B(1, 1)and C (2, 1)
- (b) Reflect A, B and C about y-axis and name them as A'', B'' and C''.
- (c) Reflect A, B, C, A'', B'' and C'' about x-axis and name them as A'''', B'''', C'''', A'''''''', B'''''' and C'''''' respectively.
- (d) Join A, B, C, C'''', B'''', A'''', A'''''''', B'''''''', C'''''''', C'', B'', A'' and A to form a closed figure.', 4, 'Coordinate Geometry', 'long', 12, NULL, NULL),
  ('MQ-fa8623-1-6', 'fa8623', 0, '1', '(vii) The given table shows the distance covered and the time taken by a train moving at a uniform speed along a straight track.
| Distance (in m) | 60 | 90 | y |
| --- | --- | --- | --- |
| Time (in s) | 2 | x | 5 |
The values of $x$ and $y$ are:', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['$x = 4, y = 150$', '$x = 3, y = 100$', '$x = 4, y = 100$', '$x = 3, y = 150$']::text[]),
  ('MQ-fa8623-1-7', 'fa8623', 1, '1', '(viii) The $7^{\text{th}}$ term of the given Arithmetic Progression (A.P.):
$$
\frac{1}{a}, \left(\frac{1}{a} + 1\right), \left(\frac{1}{a} + 2\right) \dots \text{is:}
$$', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['$\left(\frac{1}{a} + 6\right)$', '$\left(\frac{1}{a} + 7\right)$', '$\left(\frac{1}{a} + 8\right)$', '$\left(\frac{1}{a} + 7^7\right)$']::text[]),
  ('MQ-fa8623-1-10', 'fa8623', 2, '1', '(xi) Statement 1: $\sin^2 \theta + \cos^2 \theta = 1$
Statement 2: $\operatorname{cosec}^2 \theta + \cot^2 \theta = 1$
Which of the following is valid?', 1, 'Trigonometry', 'MCQ', 1, NULL, array['only 1', 'only 2', 'both 1 and 2', 'neither 1 nor 2']::text[]),
  ('MQ-fa8623-1-13', 'fa8623', 3, '1', '(xiv) A rectangular sheet of paper of size $11\mathrm{cm}\times 7\mathrm{cm}$ is first rotated about the side $11~\mathrm{cm}$ and then about the side $7\mathrm{cm}$ to form a cylinder, as shown in the diagram. The ratio of their curved surface areas is:

(a) 1:1

(c) 11:7

(b) 7:11

(d) $\frac{11\pi}{7}:\frac{7\pi}{11}$', 1, 'Mensuration', 'short', 2, 'fa8623__ICSE_X_Mat_p2_img_1_jpeg.webp', NULL),
  ('MQ-fa8623-1-14', 'fa8623', 4, '1', '(xv) In the given diagram, $\Delta ABC \sim \Delta PQR$ . If AD and PS are bisectors of $\angle BAC$ and $\angle QPR$ respectively then:

(a) $\Delta ABC\sim \Delta PQS$

(c) $\Delta ABD\sim \Delta PSR$

(b) $\Delta ABD\sim \Delta PQS$

(d) $\Delta ABC\sim \Delta PSR$', 1, 'Similarity', 'short', 2, 'fa8623__ICSE_X_Mat_p2_img_3_jpeg.webp', NULL),
  ('MQ-fa8623-2-0', 'fa8623', 5, '2', '(i) $A = \begin{bmatrix} x & 0 \\ 1 & 1 \end{bmatrix}, B = \begin{bmatrix} 4 & 0 \\ y & 1 \end{bmatrix}$ and $C = \begin{bmatrix} 4 & 0 \\ x & 1 \end{bmatrix}$ [4]

Find the values of $x$ and $y$ , if $AB = C$ .', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-fa8623-2-1', 'fa8623', 6, '2', '(ii) A solid metallic cylinder is cut into two identical halves along its height (as shown in the diagram). The diameter of the cylinder is $7\mathrm{cm}$ and the height is $10\mathrm{cm}$ . Find: [4]

(a) the total surface area (both the halves).
(b) the total cost of painting the two halves at the rate of 30 per \(\mathrm{cm}^2\) (Use \(\pi = \frac{22}{7}\))', 4, 'Mensuration', 'long', 2, 'fa8623__ICSE_X_Mat_p2_img_5_jpeg.webp', NULL),
  ('MQ-fa8623-2-2', 'fa8623', 7, '2', '(iii) 15, 30, 60, 120... are in G.P. (Geometric Progression).

(a) Find the \(n^{\mathrm{th}}\) term of this G.P. in terms of \(n\).
(b) How many terms of the above G.P. will give the sum 945? [4]', 4, 'Geometric Progression', 'long', 2, NULL, NULL),
  ('MQ-fa8623-3-0', 'fa8623', 8, '3', '(i) Factorize: $\sin^3\theta +\cos^3\theta$

Hence, prove the following identity: [4]

$$
\frac {\sin^ {3} \theta + \cos^ {3} \theta}{\sin \theta + \cos \theta} + \sin \theta \cos \theta = 1
$$', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-fa8623-3-1', 'fa8623', 9, '3', '(ii) In the given diagram, O is the centre of the circle.

PR and PT are two tangents drawn from the external point P and touching the circle at Q and S respectively.

MN is a diameter of the

circle. Given $\angle PQM = 42^{\circ}$ and $\angle PSM = 25^{\circ}$ . [4]

Find:

(a) $\angle OQM$

(b) $\angle QNS$

(c) $\angle QOS$

(d) $\angle QMS$', 4, 'Circles', 'long', 2, 'fa8623__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-fa8623-3-2', 'fa8623', 10, '3', '(iii) Use graph sheet for this question. Take $2\mathrm{cm} = 1$ unit along the a [5]

(a) Plot A(0, 3), B(2, 1) and C(4, -1).
(b) Reflect point B and C in \(y\)-axis and name their images as \(\mathbf{B}''\) and \(\mathbf{C}''\) respectively. Plot and write coordinates of the points \(\mathbf{B}''\) and \(\mathbf{C}''\).
(c) Reflect point A in the line \(\mathrm{BB}''\) and name its images as \(A''\).
(d) Plot and write coordinates of point \(A''\).
(e) Join the points \( \mathrm{AB} / \mathrm{B}'' \) and give the geometrical name of the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 2, 'fa8623__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-fa8623-4-0', 'fa8623', 11, '4', '(i) Suresh has a recurring deposit account in a bank. He deposits ₹ 2000 per month and the bank pays interest at the rate of \(8\%\) per annum. If he gets ₹ 1040 as interest at the time of maturity, find in years total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-fa8623-4-1', 'fa8623', 12, '4', '(ii) The following table gives the duration of movies in minutes. [3]

| Duration (in minutes) | No. of movies |
| --- | --- |
| 100 - 110 | 5 |
| 110 - 120 | 10 |
| 120 - 130 | 17 |
| 130 - 140 | 8 |
| 140 - 150 | 6 |
| 150 - 160 | 4 |

Using step - deviation method, find the mean duration of the movies.', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-fa8623-5-0', 'fa8623', 13, '5', '(i) The given graph with a histogram represents the number of plants of different heights in a school campus. Study the graph carefully and answer the following questions: [5]

(a) Make a frequency table with respect to the class boundaries and their corresponding frequencies.
(b) State the modal class.
(c) Identify and note down the mode of the distribution.
(d) Find the number of plants whose height range is between \(80~\mathrm{cm}\) to \(90~\mathrm{cm}\).', 5, 'Statistics', 'long', 3, 'fa8623__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-fa8623-5-1', 'fa8623', 14, '5', '(ii) The angle of elevation of the top of a $100\mathrm{m}$ high tree from two points A and B on the opposite side of the tree are $52^{\circ}$ and $45^{\circ}$ respectively. Find the distance AB, to the nearest metre. [5]', 5, 'Trigonometry', 'long', 3, 'fa8623__ICSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-fa8623-6-0', 'fa8623', 15, '6', '(i) Solve the following quadratic equation for $x$ and give your answer correct up to three significant figures: $2x^{2} - 10x + 5 = 0$ [3]

(Use mathematical tables if necessary)', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-fa8623-6-1', 'fa8623', 16, '6', '(ii) The nth term of an Arithmetic Progression (A.P.) is given by the relation $T_{n} = 6(7 - n)$ . [3] Find:

(a) its first term and common difference
(b) sum of its first 25 terms', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-fa8623-6-2', 'fa8623', 17, '6', '(iii) In the given diagram $\Delta$ ADB and $\Delta$ ACB are two right angled triangles with $\angle ADB = \angle BCA = 90^{\circ}$ . If $\mathrm{AB} = 10\mathrm{cm}$ , $\mathrm{AD} = 6\mathrm{cm}$ , $\mathrm{BC} = 2.4\mathrm{cm}$ and $\mathrm{DP} = 4.5\mathrm{cm}$ [4]

(a) Prove that \(\Delta APD \sim \Delta BPC\)
(b) Find the length of BD and PB
(c) Hence, find the length of PA
(d) Find area \(\Delta\)APD: area \(\Delta\)BPC', 4, 'Similarity', 'long', 3, 'fa8623__ICSE_X_Mat_p3_img_2_jpeg.webp', NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
