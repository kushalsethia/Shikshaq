set standard_conforming_strings = on;
begin;

-- questions 4501-5000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-fa8623-7-0', 'fa8623', 18, '7', '(i) In the given diagram, an isosceles $\Delta ABC$ is inscribed in a circle with centre O. PQ is a tangent to the circle at C. OM is perpendicular to chord AC and $\angle COM = 65^{\circ}$ .

Find:

(a) $\angle ABC$

(b) $\angle BAC$

(c) $\angle BCQ$

[3]', 3, 'Circles', 'short', 3, 'fa8623__ICSE_X_Mat_p3_img_3_jpeg.webp', NULL),
  ('MQ-fa8623-7-1', 'fa8623', 19, '7', '(ii) Solve the following in equation, write down the solution set and represent it on the real number line.

$$
- 3 + x \leq \frac {7 x}{2} + 2 < 8 + 2 x, x \in I \tag {3}
$$', 3, 'Linear Inequations', 'short', 3, 'fa8623__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-fa8623-7-2', 'fa8623', 20, '7', '(iii) In the given diagram, ABC is a triangle, where $\mathrm{B}(4, - 4)$ and $\mathrm{C}(-4, - 2)$ . D is a point on AC. [4]

(a) Write down the coordinates of A and D.
(b) Find the coordinates of the centroid of \(\Delta ABC\)
(c) If D divides AC in the ratio \( k: 1 \), find the value of \( k \).
(d) Find the equation of the line BD.', 4, 'Coordinate Geometry', 'long', 3, 'fa8623__ICSE_X_Mat_p3_img_4_jpeg.webp', NULL),
  ('MQ-0a75ef-1-0', '0a75ef', 0, '1', '(i) The given quadratic equation $$3x^2 + \sqrt{7}x + 2 = 0$$ has:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['two equal real roots.', 'two distinct real roots.', 'more than two real roots.', 'no real roots.']::text[]),
  ('MQ-0a75ef-1-1', '0a75ef', 1, '1', '(ii) Mr. Anuj deposits ₹500 per month for 18 months in a recurring deposit account at a certain rate. If he earns ₹570 as interest at the time of maturity, then his matured amount is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹(500 × 18 + 570)', '₹(500 × 19 + 570)', '₹(500 × 18 × 19 + 570)', '₹(500 × 9 × 19 + 570)']::text[]),
  ('MQ-0a75ef-1-2', '0a75ef', 2, '1', '(iii) Which of the following cannot be the probability of any event?', 1, 'Probability', 'MCQ', 2, NULL, array['$$\frac{5}{4}$$', '0.25', '$$\frac{1}{33}$$', '67%']::text[]),
  ('MQ-0a75ef-1-3', '0a75ef', 3, '1', '(iv) The equation of the line passing through origin and parallel to the line 3x + 4y + 7 = 0 is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['\(3x + 4y + 5 = 0\)', '\(4x - 3y - 5 = 0\)', '\(4x - 3y = 0\)', '\(3x + 4y = 0\)']::text[]),
  ('MQ-0a75ef-1-4', '0a75ef', 4, '1', '(v) If A = [0 1; 1 0], then A² is equal to:

(a) \(\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}\)
(b) \(\begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix}\)
\(\left( \begin{array}{ll}1 & 0\\ 0 & 1 \end{array} \right)\)
(d) \(\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}\)', 1, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-0a75ef-1-5', '0a75ef', 5, '1', '(vi) In the given diagram, chords AC and BC are equal. If ∠ACD = 120°, then ∠AEC is:

(a) \(30^{\circ}\)
(b) \(60^{\circ}\)
(c) \(90^{\circ}\)
\(\left( \begin{array}{ll}1 & 2 \end{array} \right)\)', 1, 'Circles', 'short', 3, '0a75ef__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-1-6', '0a75ef', 6, '1', '(vii) The factor common to the two polynomials $x^2 - 4$ and $x^3 - x^2 - 4x + 4$ is:

(a) \((x + 1)\)
(b) \((x - 1)\)
(c) \((x + 2)\)
\((x - 2)\)', 1, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-0a75ef-1-7', '0a75ef', 7, '1', '(viii) A man invested in a company paying 12% dividend on its share. If the percentage return on his investment is 10%, then the shares are:

(a) at par
(b) below par
\(\sqrt{(e)}\) above par
(d) cannot be determined', 1, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-0a75ef-1-8', '0a75ef', 8, '1', '(ix) Statement 1: The point which is equidistant from three non-collinear points D, E and F is the circumcentre of the $\Delta$DEF.
Statement 2: The incentre of a triangle is the point where the bisector of the angles intersects.', 1, 'Circles', 'MCQ', 4, NULL, array['Both the statements are true.', 'Both the statements are false.', 'Statement 1 is true, and Statement 2 is false.', 'Statement 1 is false, and Statement 2 is true.']::text[]),
  ('MQ-0a75ef-1-9', '0a75ef', 9, '1', '(x) Assertion(A): If $$\sin^2 A + \sin A = 1$$ then $$\cos^4 A + \cos^2 A = 1$$
Reason(R): $$1 - \sin^2 A = \cos^2 A$$', 1, 'Trigonometry', 'MCQ', 5, NULL, array['(A) is true, (R) is false.', '(A) is false, (R) is true.', 'Both (A) and (R) are true, and (R) is the correct reason for (A).', 'Both (A) and (R) are true, and (R) is the incorrect reason for (A).']::text[]),
  ('MQ-0a75ef-1-10', '0a75ef', 10, '1', '(xi) In the given diagram $$\Delta ABC \sim \Delta EFG$$. If $$\angle ABC = \angle EFG = 60^\circ$$, then the length of the side FG is:', 1, 'Similarity', 'MCQ', 5, '0a75ef__ICSE_X_Mat_p5_img_0_jpeg.webp', array['\(15 \mathrm{~cm}\)', '\(20 \mathrm{~cm}\)', '\(25 \mathrm{~cm}\)', '\(30 \mathrm{~cm}\)']::text[]),
  ('MQ-0a75ef-1-11', '0a75ef', 11, '1', '(xii) If the volume of two spheres is in the ratio 27 : 64, then the ratio of their radii is:', 1, 'Mensuration', 'MCQ', 5, NULL, array['\(3:4\)', '\(4:3\)', '\(9:16\)', '\(16:9\)']::text[]),
  ('MQ-0a75ef-1-12', '0a75ef', 12, '1', '(xiii) The marked price of an article is ₹1375. If the CGST is charged at a rate of 4%, then the price of the article including GST is:', 1, 'GST and Banking', 'MCQ', 6, NULL, array['55', '110', '1430', '1485']::text[]),
  ('MQ-0a75ef-1-13', '0a75ef', 13, '1', '(xiv) The solution set for $0 < -\frac{x}{3} < 2, x \in \mathbb{Z}$ is:', 1, 'Linear Inequations', 'MCQ', 6, NULL, array['\(\{-5, -4, -3, -2, -1\}\)', '\(\{-6, -5, -4, -3, -2, -1\}\)', '\(\{-5, -4, -3, -2, -1, 0\}\)', '\(\{-6, -5, -4, -3, -2, -1, 0\}\)']::text[]),
  ('MQ-0a75ef-1-14', '0a75ef', 14, '1', '(xv) Assertion(A): The mean of first 9 natural numbers is 4.5.
Reason(R): Mean = $\frac{\text{Sum of all the observations}}{\text{Total number of observations}}$', 1, 'Statistics', 'MCQ', 6, NULL, array['(A) is true, (R) is false.', '(A) is false, (R) is true.', 'Both (A) and (R) are true, and (R) is the correct reason for (A).', 'Both (A) and (R) are true, and (R) is the incorrect reason for (A).']::text[]),
  ('MQ-0a75ef-2-0', '0a75ef', 15, '2', '(i) Solve the following quadratic equation $2x^2 - 5x - 4 = 0$

Give your answer correct to three significant figures.

(Use mathematical tables for this question)

[4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-0a75ef-2-1', '0a75ef', 16, '2', 'ii) Mrs. Rao deposited ₹250 per month in a recurring deposit account for a period of 3 years. She received ₹10,110 at the time of maturity. Find: [4]

(a) the rate of inter
(b) how much more interest Mrs. Rao will receive if she had deposited ₹50 more per month at the same rate of interest and for the same time.', 4, 'GST and Banking', 'long', 7, NULL, NULL),
  ('MQ-0a75ef-2-2', '0a75ef', 17, '2', '(iii) In ΔABC, ∠ABC = 90°, AB = 20 cm, AC = 25 cm, DE is perpendicular to AC such that ∠DEA = 90° and DE = 3 cm as shown in the given figure. [4]

(a) Prove that \(\Delta ABC\sim \Delta AED\)
(b) Find the lengths of BC, AD and AE
(c) If BCED represents a plot of land on a map whose actual area on ground is \(576\mathrm{m}^2\), then find the scale factor of the map.', 4, 'Similarity', 'long', 7, '0a75ef__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-3-0', '0a75ef', 18, '3', '(i) Use ruler and compass for the following construction. Construct a ΔABC, where AB = 6 cm, AC = 4.5 cm and ∠BAC = 120°. Construct a circle circumscribing the ΔABC. Measure and write down the length of the radius of the circle. 5.3 cm [4]', 4, 'Constructions', 'long', 7, NULL, NULL),
  ('MQ-0a75ef-3-1', '0a75ef', 19, '3', '(ii) If A = [1 2; 3 4], B = [2 1; 4 2] and C = [-5 1; 7 -4] [4]

Find:

(a) \(\mathbf{A} + \mathbf{C}\)
(b) \(\mathbf{B}(\mathbf{A} + \mathbf{C})\)
(c) 51
(d) \(\mathbf{B}(\mathbf{A} + \mathbf{C}) - 5\mathbf{B}\)', 4, 'Matrices', 'long', 7, NULL, NULL),
  ('MQ-0a75ef-3-2', '0a75ef', 20, '3', '(iii) In the given graph ABCD is a parallelogram.

[5]

Using the graph, answer the following:

(a) write down the coordinates of A, B, C and D.
(b) calculate the coordinates of ''P'', the point of intersection of the diagonals AC and BD.
(c) find the slope of sides CB and DA and verify that they represent parallel lines.
(d) find the equation of the diagonal A', 5, 'Coordinate Geometry', 'long', 8, '0a75ef__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-4-0', '0a75ef', 21, '4', '(i) Solve the following inequation, write the solution set and represent it on the real number line. [3]

$$2x - \frac{5}{3} < \frac{3x}{5} + 10 \leq \frac{4x}{5} + 11; x \in \mathbb{R}$$', 3, 'Linear Inequations', 'short', 9, NULL, NULL),
  ('MQ-0a75ef-4-1', '0a75ef', 22, '4', '(ii) The first term of an Arithmetic Progression (A.P.) is 5, the last term is 50 and their sum is 440. Find: [3]

- (a) the number of terms n = 16
- (b) common difference d = 3', 3, 'Arithmetic Progression', 'short', 9, NULL, NULL),
  ('MQ-0a75ef-4-2', '0a75ef', 23, '4', '(iii) Prove that:

$$\frac{(\cot A + \tan A - 1)(\sin A + \cos A)}{\sin^3 A + \cos^3 A} = \sec A \cdot \cosec A$$', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-0a75ef-5-0', '0a75ef', 24, '5', '(i) Using properties of proportion, find the value of ''x'': [3]

$$\frac{6x^2 + 3x - 5}{3x - 5} = \frac{9x^2 + 2x + 5}{2x + 5}; x \neq 0$$', 3, 'Ratio and Proportion', 'short', 9, NULL, NULL),
  ('MQ-0a75ef-5-1', '0a75ef', 25, '5', '(ii) It is given that (x - 2) is a factor of polynomial $$2x^3 - 7x^2 + kx - 2$$. [3]

Find:

- (a) the value of ''k''.
- (b) hence, factorise the resulting polynomial completely.', 3, 'Factorisation and Remainder Theorem', 'short', 9, NULL, NULL),
  ('MQ-0a75ef-5-2', '0a75ef', 26, '5', '(iii) A solid wooden capsule is shown in Figure 1. The capsule is formed of a cylindrical block and two hemispheres.

Find the sum of total surface area of the three parts as shown in Figure 2. Given, the radius of the capsule is 3.5 cm and the length of the cylindrical block is 14 cm.

(Use $$\pi = \frac{22}{7}$$)

Figure 1

Figure 2', NULL, 'Mensuration', 'short', 10, '0a75ef__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-6-0', '0a75ef', 27, '6', '(i) Use a graph paper for this question taking 2 cm = 1 unit along both axes.

(a) Plot A(1, 3), B(1, 2) and C(3, 0).
(b) Reflect A and B on the \(x\)-axis and name their images as E and D respectively. Write down their coordinates.
(c) Reflect A and B through the origin and name their images as F and G respectively.
(d) Reflect A, B and C on the \(y\)-axis and name their images as J, I and H respectively.
(e) Join all the points A, B, C, D, E, F, G, H, I and J in order and name the closed figure so formed.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-0a75ef-6-1', '0a75ef', 28, '6', '(ii) In the given diagram, AB is a vertical tower 100 m away from the foot of a 30 storied building CD. The angles of depression from the point C and E, (E being the mid-point of CD), are 35° and 14° respectively. [5]

(Use mathematical table for the required values rounded off correct to two places of decimals only)

Find the height of the:

(a) tower AB
(b) building CD', 5, 'Trigonometry', 'long', 11, '0a75ef__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-7-0', '0a75ef', 29, '7', '(i) Use a graph paper for this question.

[3]

(Take 2 cm = 10 Marks along one axis and 2 cm = 10 students along another axis).

Draw a Histogram for the following distribution which gives the marks obtained by 164 students in a particular class and hence find the Mode.

| Marks | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 |
| --- | --- | --- | --- | --- | --- |
| Number of Students | 10 | 26 | 40 | 54 | 34 |', 3, 'Statistics', 'short', 11, NULL, NULL),
  ('MQ-0a75ef-7-1', '0a75ef', 30, '7', '(ii) In the given graph, P and Q are points such that PQ cuts off intercepts of 5 units and 3 units along the x-axis and y-axis respectively. Line RS is perpendicular to PQ and passes through the origin. Find the:

(a) coordinates of \(\mathbf{P}\) and \(\mathbf{Q}\)
(b) equation of line RS', NULL, 'Coordinate Geometry', 'short', 12, '0a75ef__ICSE_X_Mat_p12_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-7-2', '0a75ef', 31, '7', '(iii) Refer to the given bill.

A customer paid ₹2000 (rounded off to the nearest ₹10) to clear the bill.

Note: 5% discount is applicable on an article if 10 or more such articles are purchased.

| BILL | | | |
| --- | --- | --- | --- |
| Article | M.P. (₹) | Quantity | G.S.T. |
| A | 190 | 06 | 12% |
| B | 50 | 12 | 18% |

Check whether the total amount paid by the customer is correct or not. Justify your answer with necessary working.', NULL, 'GST and Banking', 'short', 12, NULL, NULL),
  ('MQ-0a75ef-8-0', '0a75ef', 32, '8', '(i) A man bought ₹200 shares of a company at 25% premium. If he received a return of 5% [3] on his investment. Find the

(a) market value
(b) dividend percent declare
(c) number of shares purchased, if annual dividend is ₹1000.', 3, 'Shares and Dividends', 'short', 13, NULL, NULL),
  ('MQ-0a75ef-8-1', '0a75ef', 33, '8', '(ii) For the given frequency distribution, find the: [3]

(a) mean, to the nearest whole number
(b) median

| x | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| f | 3 | 2 | 2 | 6 | 3 | 5 | 3 |', 3, 'Statistics', 'short', 13, NULL, NULL),
  ('MQ-0a75ef-8-2', '0a75ef', 34, '8', '(iii) Mr. and Mrs. Das were travelling by car from Delhi to Kasauli for a holiday. Distance [4] between Delhi and Kasauli is approximately 350 km (via NH 152D). Due to heavy rain they had to slow down. The average speed of the car was reduced by 20 km/hr and time of the journey increased by 2 hours. Find

(a) the original speed of the car.
(b) with the reduced speed, the number of hours they took to reach their destination.', 4, 'Quadratic Equations', 'long', 13, NULL, NULL),
  ('MQ-0a75ef-9-0', '0a75ef', 35, '9', '(i) A hollow sphere of external diameter 10 cm and internal diameter 6 cm is melted and made into a solid right circular cone of height 8 cm. Find the radius of the cone so formed. [Use $$\pi = \frac{22}{7}$$]', NULL, 'Mensuration', 'short', 14, '0a75ef__ICSE_X_Mat_p14_img_1_jpeg.webp', NULL),
  ('MQ-0a75ef-9-1', '0a75ef', 36, '9', '(ii) Ms. Sushmita went to a fair and participated in a game. The game consisted of a box having number cards with numbers from 01 to 30. The three prizes were as per the given table:

| Prize | Number on the card drawn at random is a |
| --- | --- |
| Wall Clock | perfect square |
| Water Bottle | even number which is also a multiple of 3 |
| Purse | prime number |', NULL, 'Probability', 'short', 14, NULL, NULL),
  ('MQ-0a75ef-9-2', '0a75ef', 37, '9', '(iii) X, Y, Z and C are the points on the circumference of a circle with centre ''O''. AB is a tangent to the circle at ''X'' and ZY = XY. Given ∠OBX = 32° and ∠AXZ = 66°. Find: [4]

(a) ∠BOX
(b) ∠CYX
(c) ∠ZYX
(d) ∠OXY', 4, 'Circles', 'long', 15, '0a75ef__ICSE_X_Mat_p15_img_0_jpeg.webp', NULL),
  ('MQ-0a75ef-10-0', '0a75ef', 38, '10', '(i) If 1701 is the nᵗʰ term of the Geometric Progression (G.P.) 7. 21. 63 ... [3]

(a) the value of ''n'' 
(b) hence find the sum of the ''n'' terms of the G.P.', 3, 'Geometric Progression', 'short', 15, NULL, NULL),
  ('MQ-0a75ef-10-1', '0a75ef', 39, '10', '(ii) In the given diagram ''O'' is the centre of the circle. Chord SR produced meets the tangent XTP at P. [3]

(a) Prove that ΔPTR ~ ΔPST
(b) Prove that PT² = PR × PS
(c) If PR = 4 cm and PS = 16 cm, find the length of the tangent R', 3, 'Circles', 'short', 15, '0a75ef__ICSE_X_Mat_p15_img_1_jpeg.webp', NULL),
  ('MQ-0a75ef-10-2', '0a75ef', 40, '10', '(iii) The given graph represents the monthly salaries (in ₹) of workers of a factory.

[4]

Using graph answer the following:

(a) the total number of workers.
(b) the median class.
(c) the lower-quartile class.
(d) number of workers having monthly salary more than or equal to ₹6,000 but less than ₹10,000.', 4, 'Statistics', 'long', 16, '0a75ef__ICSE_X_Mat_p16_img_0_jpeg.webp', NULL),
  ('MQ-f277e3-1-0', 'f277e3', 0, '1', 'i) A dealer in Bihar sells goods to a customer worth Rs. 2,00,000 in the same rate. If the rate of CGST and SGST is 5 % each, the SGST to be paid is ,

a) Rs. 5000 b) Rs. 10,000 c) Rs. 20,000 d) Rs. 12,000', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-1', 'f277e3', 1, '1', 'ii) The solution set of the inequation $$\frac{1}{2}(x - 3) \geq \frac{2}{3}(6 - 2x), x \in \mathbb{R}$$ is,

a) $$x \leq 3$$ b) $$x < 3$$ c) $$x \geq 3$$ d) $$x > 3$$', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-2', 'f277e3', 2, '1', 'iii) If one of the root of the quadratic equation $$px^2 + 15x - 14 = 0$$ is $$\frac{2}{3}$$ then the value of $$p$$ is ,

a) 6.5 b) 12 c) 8 d) 9', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-3', 'f277e3', 3, '1', 'iv) What number should be added to each of the numbers 6, 15, 20 and 43 to make them proportional ?

a) 2 b) 4 c) 3 d) 6', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-4', 'f277e3', 4, '1', 'v) If on dividing $$4x^2 - 3kx + 5$$ by $$(x + 2)$$, the remainder is (-3) then the value of $$k$$ is,

a) 4 b) (-4) c) 3 d) (-3)', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-5', 'f277e3', 5, '1', 'vi) If $$\begin{bmatrix} x+3 & 4 \\ y-4 & x+y \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 3 & 9 \end{bmatrix}$$, then the value of $$x$$ and $$y$$ are ,

a) $$x = 2, y = 7$$ b) $$x = 7, y = 2$$ c) $$x = 3, y = 6$$ d) $$x = -2, y = 7$$', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-6', 'f277e3', 6, '1', 'vii) The 11$^{th}$ term of the A.P. -3, $$\frac{-1}{2}$$, 2, ... is ,

a) 28 b) 22 c) -38 d) -48.5', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-f277e3-1-7', 'f277e3', 7, '1', 'viii) It is given that $\Delta ABC \sim \Delta PQR$ with $\frac{BC}{QR} = \frac{1}{3}$, then $\frac{\text{area of } \Delta PQR}{\text{area of } \Delta ABC}$ is equal to,

a) 9 b) 3 c) $\frac{1}{3}$ d) $\frac{1}{9}$', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-8', 'f277e3', 8, '1', 'ix) The coordinates of the point $P(-3, 5)$ on reflection in the $x$-axis are,

a) $(3, 5)$ b) $(-3, -5)$ c) $(3, -5)$ d) $(-3, 5)$', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-9', 'f277e3', 9, '1', 'x) If the end points of the diameter of a circle are $A(-2, 3)$ and $B(4, -5)$, then the coordinates of its centre are

a) $(2, -2)$ b) $(-2, 2)$ c) $(-1, 1)$ d) $(1, -1)$', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-10', 'f277e3', 10, '1', 'xi) The slope of the line passing through the points $(0, -4)$ and $(-6, 2)$ is,

a) 0 b) 1 c) -1 d) 6', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-11', 'f277e3', 11, '1', 'xii) ABCD is a cyclic quadrilateral. If $\angle BAC = 2x + 5^\circ$ and $\angle BDC = x + 10^\circ$ then $x = ?$

a) $65^\circ$ b) $45^\circ$ c) $55^\circ$ d) $5^\circ$', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-12', 'f277e3', 12, '1', 'xiii) If a solid right circular copper cone of height 15 cm and radius 6 cm is melated and recast into smaller copper cones each of height 3 cm and radius 2 cm, the number of smaller cones can be made is,

a) 45 b) 60 c) 54 d) 50', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-13', 'f277e3', 13, '1', 'xiv) The probability of getting a number divisible by 3 in throwing a dice is,

a) $\frac{1}{6}$ b) $\frac{1}{3}$ c) $\frac{1}{2}$ d) $\frac{2}{3}$', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-f277e3-1-14', 'f277e3', 14, '1', 'xv) For the given 25 variables : $x_1, x_2, x_3 \dots \dots x_{25}$

**Assertion (A)** : To find median of the given data, the variate needs to be arranged in ascending or descending order.

**Reason (R)** : The median is the central most term of the arranged data.

a) A is true, R is false, b) A is false, R is true, c) both A and R are true, d) both A and R are false', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-f277e3-2-0', 'f277e3', 15, '2', '**Q.2)** i) Salman deposits Rs.1200 every month in a recurring deposit account for $2\frac{1}{2}$ years. If the rate of interest is 6 % per annum, find the amount he will receive on maturity.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-f277e3-2-1', 'f277e3', 16, '2', 'ii) 3, 9, m, 81 and n are in continued proportion. Find the values of m and n.', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-f277e3-2-2', 'f277e3', 17, '2', 'iii) Prove that : $\frac{\cos A}{1+\sin A} + \frac{1+\sin A}{\cos A} = 2 \sec A$.', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f277e3-3-0', 'f277e3', 18, '3', '**Q.3)** i) Shown below is a horizontal water tank composed of a cylinder and two hemispheres. The tank is filled up to a height of 7 m. Find the surface area of the tank in contact with water. (use $\pi = \frac{22}{7}$)

[4]', 4, 'Mensuration', 'long', 2, 'f277e3__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-f277e3-3-1', 'f277e3', 19, '3', 'ii) In the following figure, ABC is a triangle and BC is parallel to y-axis. AB and AC intersect the y-axis at P and Q respectively.

a) Write down the coordinates of A.
b) Find the lengths of AB and AC.
c) Find the ratio in which Q divides AC.
d) Find the equation of the line AC. [4]', 4, 'Coordinate Geometry', 'long', 3, 'f277e3__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-f277e3-3-2', 'f277e3', 20, '3', 'iii) The table given below shows the ages of members of a society:

| Age (in years) | 25 - 35 | 35 - 45 | 45 - 55 | 55 - 65 | 65 - 75 | 75 - 85 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of members of the society | 5 | 32 | 69 | 80 | 61 | 13 |

Use graph sheet for this question. Take 2 cm = 10 years along one axis and 2 cm = 10 members along the other axis.

a) Draw a histogram representing the above distribution.
b) Hence find the modal age of the members. [5]', 5, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-f277e3-4-0', 'f277e3', 21, '4', '**Q.4)** a) Solve for x, using the properties of proportion. [3]

$$\frac{\sqrt{2+x} + \sqrt{3-x}}{\sqrt{2+x} - \sqrt{3-x}} = 3$$', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-f277e3-4-1', 'f277e3', 22, '4', 'b) Using a ruler and a pair of compasses only, construct : [3]

i) a triangle ABC, given AB = 4 cm, BC = 6 cm and ∠ABC = 90°.
ii) a circle which passes through the points A, B and C and mark its centre as O.', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-f277e3-4-2', 'f277e3', 23, '4', 'c) An aeroplane at an altitude of 250 m observe the angle of depression of two boats on the opposite banks of a river to be 45° and 60° respectively. Find the width of the river. Write the answer correct to the nearest whole number.', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-f277e3-5-0', 'f277e3', 24, '5', '**Q. 5)** a) Two vertices of a triangle are (-1, 4) and (5, 2). If the centroid is (0, -3), find the third vertex. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-f277e3-5-1', 'f277e3', 25, '5', 'b) Prove that :- $$\sqrt{sec^2\theta + \cosec^2\theta} = \sec \theta \cosec \theta$$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-f277e3-5-2', 'f277e3', 26, '5', 'c) The first, the last term and the common difference of an arithmetic progression are 98, 1001 and 7 respectively. Find the following for the given arithmetic progression :

i) number of terms n and ii) sum of n terms [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-f277e3-6-0', 'f277e3', 27, '6', 'Q.6) a) The following bill shows that GST rates and the marked price of articles :

| Bill Computers | | |
| --- | --- | --- |
| Articles | Marked price | Rate of GST |
| Graphic Card | Rs. 15500.00 | 18 % |
| Laptop adapter | Rs. 1900.00 | 28 % |

Find the total amount to be paid for the above bill.

[3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-f277e3-6-1', 'f277e3', 28, '6', 'b) Solve the quadratic equation $7x^2 + 2x - 2 = 0$. Give your answer correct to two places of decimal. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-f277e3-6-2', 'f277e3', 29, '6', 'c) The mean of the following data is 16. Calculate the value of f.

| Marks | 5 | 10 | 15 | 20 | 25 | [3] |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 7 | f | 9 | 6 | |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f277e3-7-0', 'f277e3', 30, '7', 'Q.7) a) Solve the following inequation, write down the solution set and represent it on the real number line:
$$-2 + 10x \leq 13x + 10 < 24 + 10x, x \in z.$$ [3]', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-f277e3-7-1', 'f277e3', 31, '7', 'b) A company with 500 shares of nominal value Rs. 120 declares an annual dividend of 15%. Calculate
i) the total amount of dividend paid by the company. [3]
ii) annual income of Mr. Sharma who holds 80 shares of the company.', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-f277e3-7-2', 'f277e3', 32, '7', 'c) Find the value of ''p'' if the lines $5x - 3y + 2 = 0$ and $6x - py + 7 = 0$ are perpendicular to each other. Hence, find the equation of a line passing through $(-2, -1)$ and parallel to $6x - py + 7 = 0$. [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-f277e3-8-0', 'f277e3', 33, '8', 'Q.8) a) Prove that : $\frac{(1+sin\theta)^2+(1-sin\theta)^2}{2cos^2\theta} = sec^2\theta + tan^2\theta$. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-f277e3-8-1', 'f277e3', 34, '8', 'b) Given $A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$ and $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ and $A^2 = 9A + MI$. Find M. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-f277e3-8-2', 'f277e3', 35, '8', 'c) $P(1,-2)$ is a point on the line segment A (3,-6) and B (x,y) such that AP : PB is equal to 2 : 3. Find the coordinates of B. [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-f277e3-9-0', 'f277e3', 36, '9', 'Q.9) a) Using properties of proportion, find x : y. Given $\frac{x^2+2x}{2x+4} = \frac{y^2+3y}{3y+9}$. [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-f277e3-9-1', 'f277e3', 37, '9', 'b) If $(x + 2)$ and $(x + 3)$ are factors of $x^3 + ax + b$, find the values of a and b. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-f277e3-9-2', 'f277e3', 38, '9', 'c) In $\Delta PQR$, MN is parallel to QR and $\frac{PM}{MQ} = \frac{2}{3}$.

i) Find $\frac{MN}{QR}$. ii) Prove that $\Delta OMN$ and $\Delta ORQ$ are similar. [4]', 4, 'Similarity', 'long', 4, 'f277e3__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-f277e3-10-0', 'f277e3', 39, '10', 'Q.10) a) In the figure given below, A, B, C and D are points on the circle with centre O. Given that ∠ABC = 62°, find i) ∠ADC, ii) ∠CAB

[3]', 3, 'Circles', 'short', 5, 'f277e3__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-f277e3-10-1', 'f277e3', 40, '10', 'b) Harpreet tossed two different coins simultaneously. Find the probability of getting :-
i) two heads, ii) at most one head, iii) at least one head.

[3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-f277e3-10-2', 'f277e3', 41, '10', 'c) What number must be added to 2x^3 - 3x^2 - 8x so that the resulting polynomial leaves the remainder 10 when divided by 2x + 1?

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-84110a-1-0', '84110a', 0, '1', '(i) When polynomial $x^3 - 3x^2 - 6x + 8$ is divided by $(x + 2)$, the remainder is zero. The probability of $(x + 2)$ to be one of the factors of the given polynomial is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['0', '$\frac{1}{3}$', '$\frac{2}{3}$', '1']::text[]),
  ('MQ-84110a-1-1', '84110a', 1, '1', '(ii) Assertion (A): In $\Delta ABC$ and $\Delta PQR$, if $\angle BAC = \angle QPR$ and
$\angle ABC = \angle PQR$, then $\Delta ABC \sim \Delta PQR$
Reason (R): $\Delta ABC \sim \Delta PQR$ by SSS axiom', 1, 'Similarity', 'MCQ', 2, NULL, array['(A) is true, (R) is false.', '(A) is false, (R) is true.', 'Both (A) and (R) are true, and (R) is the correct reason for (A).', 'Both (A) and (R) are true, and (R) is the incorrect reason for (A).']::text[]),
  ('MQ-84110a-1-2', '84110a', 2, '1', '(iii) The ratio of **diameters** of two right circular cones is **3 : 7** and that of their **heights** is **14 : 9**, then their **volumes** are in ratio:', 1, 'Mensuration', 'MCQ', 3, NULL, array['3 : 7', '2 : 7', '3 : 2', '9 : 49']::text[]),
  ('MQ-84110a-1-3', '84110a', 3, '1', '(iv) The value of $p$ for which $(x - p)$ is a factor of $x^3 - px^2 + x + 5$ is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-5', '-4', '5', '$p + 5$']::text[]),
  ('MQ-84110a-1-4', '84110a', 4, '1', '(v) The **GST** of an article is reduced from **12%** to **5%** and due to this, the price paid for the article is cut down by ₹14. The original price of the article is:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹50', '₹98', '₹100', '₹200']::text[]),
  ('MQ-84110a-1-5', '84110a', 5, '1', '(vi) The mean of $1^2$, $2^2$, $3^3$ and $4^4$ is:', 1, NULL, 'MCQ', 3, NULL, array['24', '72', '144', '264']::text[]),
  ('MQ-84110a-1-6', '84110a', 6, '1', '(vii) If $2x - 15 > 4x + 9$, then:', 1, 'Linear Inequations', 'MCQ', 4, NULL, array['\(x < - 12\)', '\(x < 12\)', '\(x > -12\)', '\(x > 12\)']::text[]),
  ('MQ-84110a-1-7', '84110a', 7, '1', '(viii) Assertion(A): If the length of shadow of a person is equal to his height, then the angle of elevation of the sun is $45^{\circ}$.
Reason(R): For any right-angled triangle, $\tan \theta = \frac{\text{Perpendicular}}{\text{Base}}$', 1, 'Trigonometry', 'MCQ', 4, NULL, array['(A) is true, (R) is false.', '(A) is false, (R) is true.', 'Both (A) and (R) are true, and (R) is the correct reason for (A).', 'Both (A) and (R) are true, and (R) is the incorrect reason for (A).']::text[]),
  ('MQ-84110a-1-8', '84110a', 8, '1', '(ix) The roots of the quadratic equation $3x^2 = 6x$ is:', 1, 'Quadratic Equations', 'MCQ', 4, NULL, array['0', '2', '0 and 2', '0 and 6']::text[]),
  ('MQ-84110a-1-9', '84110a', 9, '1', '(x) The locus of a toy bird fixed at the tip of one of the blades of a rotating ceiling fan is a:', 1, 'Loci', 'MCQ', 4, NULL, array['straight line', 'circle', 'semi-circular arc', 'diameter of the circle so formed']::text[]),
  ('MQ-84110a-1-10', '84110a', 10, '1', '(xi) Percentage return on ₹100, 12% share of a company bought at 4% discount is:', 1, 'Shares and Dividends', 'MCQ', 5, NULL, array['\(10\%\)', '\(12\%\)', '\(12.5\%\)', '\(16\%\)']::text[]),
  ('MQ-84110a-1-11', '84110a', 11, '1', '(xii) If matrix A of order 2 × 1 and matrix B of order 2 × 2 are added, then the order of the matrix A + B is:', 1, 'Matrices', 'MCQ', 5, NULL, array['\(2 \times 2\)', '\(2 \times 1\)', '\(1 \times 2\)', '\(\mathrm{A} + \mathrm{B}\) is not possible']::text[]),
  ('MQ-84110a-1-12', '84110a', 12, '1', '(xiii) In the adjoining diagram, PQ is a tangent at A to the circle with centre O.
If ∠OAC = 25°, then ∠ABC is:', 1, 'Circles', 'MCQ', 5, '84110a__ICSE_X_Mat_p5_img_0_jpeg.webp', array['\(20^{\circ}\)', '\(65^{\circ}\)', '\(70^{\circ}\)', '\(130^{\circ}\)']::text[]),
  ('MQ-84110a-1-13', '84110a', 13, '1', '(xiv) The line segment joining A(-7, 2) and B(3, -8) is divided by the x-axis in the ratio:', 1, 'Coordinate Geometry', 'MCQ', 5, NULL, array['\(1:4\)', '\(3:7\)', '\(4:1\)', '\(7:3\)']::text[]),
  ('MQ-84110a-1-14', '84110a', 14, '1', '(xv) Mr. Rahul deposited ₹11,700 in a recurring deposit account for 1 1/2 years.
The amount deposited by him per month is:', 1, 'GST and Banking', 'MCQ', 6, NULL, array['₹650', '₹780', '₹6,500', '₹7,800']::text[]),
  ('MQ-84110a-2-0', '84110a', 15, '2', '(i) A retailer purchased an air conditioner (A.C.) for ₹30,000. He marked up its price by 20% and then allows a discount of 10% on the marked price to a customer. If the sale is intra-state and the rate of GST is 28%, find the:

(a) marked price of A.C.
(b) total amount paid by the customer including GST.
(c) tax collected by the central and the state governments respectively.', NULL, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-84110a-2-1', '84110a', 16, '2', '(ii) In the adjoining diagram ∠DOE = 46° and ∠BGH = 113°.

(a) Find \(\angle\) DBC and \(\angle\) DCE.
(b) Prove that CBGH is a cyclic quadrilateral.', NULL, 'Circles', 'short', 6, '84110a__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-84110a-3-0', '84110a', 17, '3', '(i) Prove that: [4]

$$\frac{(\sin A - \sin^3 A)}{(\cos^3 A - \cos A)} \times (\sec A - \text{cosec} A) = \text{cosec} A (\cot A - 1)$$', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-84110a-3-1', '84110a', 18, '3', '(ii) If $$2x^3 - 3x^2 - 3x + 2 = (2x - 1)(x^2 + ax + b)$$: [4]

- (a) using Remainder and Factor theorem, find the value of ''a'' and ''b''.
- (b) **hence**, factorise the polynomial $$2x^3 - 3x^2 - 3x + 2$$ completely.', 4, 'Factorisation and Remainder Theorem', 'long', 7, NULL, NULL),
  ('MQ-84110a-3-2', '84110a', 19, '3', '(iii)

[5]

Using the given graph, answer the following:

(a) Write down the coordinates of the points A, B, C, and E.
(b) Name and write down the coordinates of the image of B under reflection in x-axis.
(c) Name and write the coordinates of the image of D under reflection through the origin.
(d) Which point is the image of A under reflection on the line BH? Write its coordinates.
(e) Name the closed figure ABCDEFGH.', 5, 'Coordinate Geometry', 'long', 8, '84110a__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-84110a-4-0', '84110a', 20, '4', '(i) The sum of two numbers is **2** and the sum of their reciprocals is **2.25**. Find the numbers. [3]', 3, 'Quadratic Equations', 'short', 9, NULL, NULL),
  ('MQ-84110a-4-1', '84110a', 21, '4', '(ii) A right circular cone of radius **20 cm** has its volume **8800 cm³**. Find its: [3]
(a) height
(b) curved surface area
Give your answer to the nearest whole number.
[Use π = 22/7]', 3, 'Mensuration', 'short', 9, NULL, NULL),
  ('MQ-84110a-4-2', '84110a', 22, '4', '(iii) Construct a regular hexagon of side **4.5 cm**. Hence, construct a circle circumscribing the regular hexagon. Use ruler and compass for the construction. Measure and write down the radius of the circle. [4]', 4, 'Constructions', 'long', 9, NULL, NULL),
  ('MQ-84110a-5-0', '84110a', 23, '5', '(i) **164, 160, 156, 152, ...** are in Arithmetic Progression (A.P.). Find: [3]
(a) which term is equal to 0.
(b) the sum of its first 20 terms.', 3, 'Arithmetic Progression', 'short', 9, NULL, NULL),
  ('MQ-84110a-5-1', '84110a', 24, '5', '(ii) Solve the following quadratic equation: [3]

$$3x^2 + 6x - 4 = 0$$

Give your answer correct to two places of decimals

(Use Mathematical tables, if necessary)', 3, 'Quadratic Equations', 'short', 10, NULL, NULL),
  ('MQ-84110a-5-2', '84110a', 25, '5', '(iii) In the adjoining figure of a circle with centre O and diameter AD, ∠BED = 70° [4] and BC is parallel to AD. Find:

(a) \(\angle BAD\)
(b) \(\angle BOD\)
(c) \(\angle DBC\)
(d) \(\angle DCF\)', 4, 'Circles', 'long', 10, '84110a__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-84110a-6-0', '84110a', 26, '6', '(i) Solve the inequation, write down the solution set and represent it on a real number line: [3]

$$3x - 16 < \frac{2x}{5} - 3 \leq -\frac{3}{5} + 2x; \quad x \in R$$', 3, 'Linear Inequations', 'short', 10, NULL, NULL),
  ('MQ-84110a-6-1', '84110a', 27, '6', '(ii) If the 6th term of a series in Geometric Progression (G.P.) is 32 and the 9th term is 256, find the: [3]

(a) first term and the common ratio.
(b) sum of its first 10 terms.', 3, 'Geometric Progression', 'short', 11, NULL, NULL),
  ('MQ-84110a-6-2', '84110a', 28, '6', '(iii) An ice cream cone has a diameter of 7 cm and its height is 9 cm. It is filled with a scoop of spherical shaped ice cream of radius 3.5 cm. [4]

Find: (Give all answers correct to the nearest whole number)

(a) on melting, is the ice cream sufficient to fill the cone completely without any wastage?
(b) the volume of ice cream, if any, is in excess or less.

[Use $$\pi = \frac{22}{7}$$]', 4, 'Mensuration', 'long', 11, '84110a__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-84110a-7-0', '84110a', 29, '7', '(i) There are some red, green and white marbles in a box. One marble is picked up at random from this box. If the probability of picking up a red marble is $$\frac{2}{9}$$ and that of picking up a green marble is $$\frac{4}{9}$$ then find the:

(a) probability of picking up a white marble.
(b) number of green marbles, if total number of marbles is 54.
(c) probability of not picking up a red marble.', NULL, 'Probability', 'short', 12, NULL, NULL),
  ('MQ-84110a-7-1', '84110a', 30, '7', '(ii) Mr. Anil has a recurring deposit account. He deposits a certain amount of money per month for 2 years. If he received an interest whose value is the double of the deposit made per month, then find the rate of interest.', NULL, 'GST and Banking', 'short', 12, NULL, NULL),
  ('MQ-84110a-7-2', '84110a', 31, '7', '(iii) If \(a, b, c\) and \(d\) are in continued proportion, prove that [4]

$$ad(c^2 + d^2) = c^3(b + d)$$', 4, 'Ratio and Proportion', 'long', 12, NULL, NULL),
  ('MQ-84110a-8-0', '84110a', 32, '8', '(i) ₹100 shares of a company giving 10% dividend are selling at ₹150. Mr. Saha invests ₹18000 to buy these shares. He sells 80% of his shares after one year. Find:

(a) the number of shares he purchased.
(b) the number of shares he sold.
(c) his annual income from the remaining \(20\%\) shares he still holds.', NULL, 'Shares and Dividends', 'short', 12, NULL, NULL),
  ('MQ-84110a-8-1', '84110a', 33, '8', '(ii) Equation of a line AB is x + 2y + 6 = 0. A perpendicular PQ is dropped on AB from the point P(3, -2) meeting AB at Q. Find the: [3]

(a) equation of PQ.
(b) coordinates of the point \(Q\)', 3, 'Coordinate Geometry', 'short', 13, NULL, NULL),
  ('MQ-84110a-8-2', '84110a', 34, '8', '(iii) Divide 20 into two parts such that the sum of their squares is 272. The larger of two parts is square of the other. Assuming the smaller part to be ''x'', form an equation and solve it to find the two parts. [4]', 4, 'Quadratic Equations', 'long', 13, NULL, NULL),
  ('MQ-84110a-9-0', '84110a', 35, '9', '(i) Use a graph paper for this question: [5]

The Marks out of 80 obtained by 160 students in a Mathematics test were recorded as given in the table:

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 12 | 20 | 28 | 35 | 29 | 16 | 12 | 8 |

(Take 2 cm = 10 Marks on one axis and 2 cm = 20 students on the other axis).

Draw an Ogive and use it to find the following:

(a) median marks
(b) upper quartile marks
(c) number of students who scored above 65 marks
(d) the lowest marks scored by the top \(30\%\) students.', 5, 'Statistics', 'long', 13, NULL, NULL),
  ('MQ-84110a-9-1', '84110a', 36, '9', '(ii) The angle of elevation of the top of a hill from the foot of a tower at B is 50°. The angle of elevation of the top of the tower 100 m high from the foot of the hill at C is 35°.

Find the:

(a) horizontal distance BC between the Hill and the Tower.
(b) height CD of the Hill. (Take tan50° = 1.20)
(c) time taken by a cyclist to cover the distance BC, cycling at 20 m/sec.', NULL, 'Trigonometry', 'short', 14, '84110a__ICSE_X_Mat_p14_img_0_jpeg.webp', NULL),
  ('MQ-84110a-10-0', '84110a', 37, '10', '(i) Using Remainder and Factor theorem factorise the given polynomial completely.

$$6x^3 + x^2 - 4x + 1$$', NULL, 'Factorisation and Remainder Theorem', 'short', 14, NULL, NULL),
  ('MQ-84110a-10-1', '84110a', 38, '10', '(ii) Using short-cut method, find Mean of the given frequency distribution:

| Class | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 6 | 9 | 14 | 10 | 7 | 4 |', NULL, 'Statistics', 'short', 14, NULL, NULL),
  ('MQ-84110a-10-2', '84110a', 39, '10', '(iii) Use ruler and compass for the following constructions:

[4]

Construct:

(a) an isosceles ΔABC in which AB = AC = 7 cm and BC = 6 cm.
(b) the locus of points which moves such that it is 2.5 cm from the point A.
(c) the locus of points equidistant from B and C. Mark point P which satisfies both the conditions mentioned in (b) and (c).
(d) a circle passing through P, B and C.', 4, 'Constructions', 'long', 15, NULL, NULL),
  ('MQ-cf63e8-1.i-0', 'cf63e8', 0, '1.i', 'i) $(1 + \sin A)(1 - \sin A)$ is equal to

a) $\csc^2 A$ b) $\sin^2 A$ c) $\sec^2 A$ d) $\cos^2 A$', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.ii-0', 'cf63e8', 1, '1.ii', 'ii) A polynomial in ''x'' is divided by $(x - a)$ and for $(x - a)$ to be a factor of this polynomial, the remainder should be .

a) -a b) 0 c) a d) $2a$', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.iii-0', 'cf63e8', 2, '1.iii', 'iii) A consumer bought a TV from a dealer at a discount of 20% on the marked price of Rs.40,000. If the rate of GST is 18%, then the tax paid by the consumer is :

a) 5760 b) 2880 c) nil d) 7200', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.iv-0', 'cf63e8', 3, '1.iv', 'iv) A man deposited Rs.1000 per month in a recurring deposit for 3 years at 8% p.a. The maturity value is :

a) 44,000 b) 40,000 c) 40,440 d) 44,444', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.v-0', 'cf63e8', 4, '1.v', 'v) If $2x - 5 \leq 5x + 4 < 11$, $x \in I$, then:

a) $-3 \leq x \leq 1.4$ b) $-3 \leq x \leq 2$ c) $-3 \leq x < 1$ d) $-3 \geq x$', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.vi-0', 'cf63e8', 5, '1.vi', 'vi) The Discriminant of the quadratic equation $3x^2 - 4x + 2 = 0$ is :

a) 8 b) -8 c) 16 d) $-\sqrt{8}$', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.vii-0', 'cf63e8', 6, '1.vii', 'vii) If the goods are purchased by a dealer in Jodhpur (Rajasthan) from a manufacturer in other city of Rajasthan, the type of tax applicable will be

a) SGST only b) CGST only c) IGST d) both a and b', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-cf63e8-1.viii-0', 'cf63e8', 7, '1.viii', 'viii) **Assertion (A)** : If the probability of India winning a T - 20 cricket match against Australia is $\frac{7}{10}$, then the probability of India losing the match against Australia is $\frac{3}{10}$.
**Reason(R)** : If $\bar{E}$ is the complementary event of the event E, then $P(E) + P(\bar{E}) = 1$.', 1, 'Probability', 'MCQ', 2, NULL, array['A is true. R is false', 'A is false. R is true', 'both A and R are true and R is the correct reason for A.', 'both A and R are true and R is incorrect reason for A.']::text[]),
  ('MQ-cf63e8-1.ix-0', 'cf63e8', 8, '1.ix', 'ix) The quadratic equation $x^2 + x - 5 = 0$ has.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['two distinct real roots', 'two equal roots', 'no real roots', 'more than 2 real roots']::text[]),
  ('MQ-cf63e8-1.x-0', 'cf63e8', 9, '1.x', 'x) If $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, $B = \begin{bmatrix} 4 & 0 \\ -2 & 2 \end{bmatrix}$, then $AB + BA = ?$', 1, 'Matrices', 'MCQ', 2, NULL, array['$\begin{bmatrix} 2 & 3 \\ 12 & 8 \end{bmatrix}$', '$\begin{bmatrix} 8 & 8 \\ 12 & 12 \end{bmatrix}$', '$\begin{bmatrix} 12 & 8 \\ 8 & 12 \end{bmatrix}$', '$\begin{bmatrix} 4 & 12 \\ 8 & 12 \end{bmatrix}$']::text[]),
  ('MQ-cf63e8-1.xi-0', 'cf63e8', 10, '1.xi', 'xi) **Statement 1** : The quadratic equation $2x^2 - \sqrt{5}x + 1 = 0$ has no real roots.
**Statement 2** : The quadratic equation $2x^2 + 3x + 1 = 0$ has equal roots.
Which of the following is valid ?', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['both the statements are true.', 'both the statements are false.', 'Statement 1 is true but Statement 2 is false.', 'Statement 1 is false but Statement 2 is true.']::text[]),
  ('MQ-cf63e8-1.xii-0', 'cf63e8', 11, '1.xii', 'xii) Which of the following points is invariant with respect to the line $y = -2$ ?', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(3, 2)', '(3, -2)', '(2, 3)', '(-2, 3)']::text[]),
  ('MQ-cf63e8-1.xiii-0', 'cf63e8', 12, '1.xiii', 'xiii) A bag contains 3 red and 2 blue marbles. A marble is drawn at random. The probability of drawing a black ball is.', 1, 'Probability', 'MCQ', 2, NULL, array['0', '$\frac{1}{5}$', '$\frac{2}{5}$', '$\frac{3}{5}$']::text[]),
  ('MQ-cf63e8-1.xiv-0', 'cf63e8', 13, '1.xiv', 'xiv) Salman has some shares of Rs.50 of a company paying 15% dividend. If his annual income is Rs.3000, then the numbers of share he possesses is.', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['80', '400', '600', '800']::text[]),
  ('MQ-cf63e8-1.xv-0', 'cf63e8', 14, '1.xv', 'xv) If A is a square matrix such that $A^2 = A$, then $(I + A)^2 - 3A = ?$', 1, 'Matrices', 'MCQ', 3, NULL, array['$I$', '$A$', '$3I$', '$4I$']::text[]),
  ('MQ-cf63e8-2-0', 'cf63e8', 15, '2', 'a) The following bill shows the GST rate and the marked price of articles :

| S.No. | Item | Marked Price | Quantity | Rate of GST |
| --- | --- | --- | --- | --- |
| a) | LED TV set | Rs.12000 | 01 | 28% |
| b) | MP4 player | Rs. 5000 | 01 | 18% |

Find the total amount to be paid (including GST) for the above bill.

[4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-2-1', 'cf63e8', 16, '2', '(b) Prove that :- $\frac{\sin \theta}{1 - \cot \theta} + \frac{\cos \theta}{1 - \tan \theta} = \cos \theta + \sin \theta$

[4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-2-2', 'cf63e8', 17, '2', 'c) Salman deposit Rs. 1000 every month in a recurring deposits account for 2 years. If he receives Rs. 26000 on a maturity, find :

a) the total interest Salman earns.

b) the rate of interest.

[4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-3-0', 'cf63e8', 18, '3', 'a) Solve the following inequation and represent the solution set on the number line.

$$\frac{3x}{5} + 2 < x + 4 \leq \frac{x}{2} + 5, \quad x \in \mathbb{R}$$

[4]', 4, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-3-1', 'cf63e8', 19, '3', '(b) Given $A = \begin{bmatrix} 2 & -6 \\ 2 & 0 \end{bmatrix}, B = \begin{bmatrix} -3 & 2 \\ 4 & 0 \end{bmatrix}, c = \begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix}$. Find the matrix $X$ such that $A + 2X = 2B + C$.

[4]', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-3-2', 'cf63e8', 20, '3', 'c) Use graph paper for this question taking 2 cm = 1 unit along both axes.

[5]

i) Plot $A(1, 3)$, $B(1, 2)$ and $C(3, 0)$.

ii) Reflect $A$ and $B$ on the $x$-axis and name their images as $E$ and $D$ respectively. Write down their coordinates.

iii) Reflect $A$ and $B$ through the origin and name their images as $F$ and $G$ respectively.

iv) Reflect $A$, $B$ and $C$ on the $y$-axis and name their images as $J$, $I$ and $H$ respectively.

v) Join all the points $A, B, C, D, E, F, G, H, I$ and $J$ in order and name the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-cf63e8-4-0', 'cf63e8', 21, '4', 'a) Use the Remainder Theorem to factorise the following expression: $2x^3 + x^2 - 13x + 6$.

[3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-cf63e8-4-2', 'cf63e8', 22, '4', 'c) In a certain positive fraction, the denominator is greater than the numerator by 3. If 1 is subtracted from both the numerator and denominator, the fraction is decreased by $\frac{1}{14}$. Find the fraction. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-cf63e8-5-0', 'cf63e8', 23, '5', 'a) Prove that : $1 + \frac{\tan^2 \theta}{1 + \sec \theta} = \sec \theta$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-cf63e8-5-1', 'cf63e8', 24, '5', 'b) Two different dice are thrown simultaneously. What is the probability that the sum of two numbers appearing on the top of dice is. (i) 8 (ii) 10 iii) atleast 10 ? [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-cf63e8-5-2', 'cf63e8', 25, '5', 'c) Given $A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$ and $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ and $A^2 = 9A + MI$. Find matrix M. [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-cf63e8-6-0', 'cf63e8', 26, '6', 'a) Show that $(2x + 7)$ is a factor of $2x^3 + 7x^2 - 4x - 14$ . Hence factorise $2x^3 + 7x^2 - 4x - 14$ [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-cf63e8-6-1', 'cf63e8', 27, '6', 'b) The angles of depression of two ships A and B as observed from the top of a light house 60 m high are 60° and 45° respectively. If the two ships are on the opposite sides of the light house, find the distance between the two ships. Give your answer correct to the nearest whole number. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-cf63e8-6-2', 'cf63e8', 28, '6', 'c) Solve the following inequation and write down the solution set :

$$11x - 4 < 15x + 4 \leq 13x + 14, \quad x \in W.$$

Represent the solution on the number line. [4]', 4, 'Linear Inequations', 'long', 4, NULL, NULL),
  ('MQ-cf63e8-7-0', 'cf63e8', 29, '7', 'a) Mr. Kumar a registered dealer purchased goods worth Rs. 40000 from a dealer (within the same state). If the rate of GST is 18%.

(i) Calculate the input CGST and input SGST

(ii) If he sold these goods to Mr. Dev (within the state) for Rs. 50000, calculate Mr. Kumar''s output CGST and output SGST.

(iii) Calculate the CGST and SGST payable by Mr. Kumar [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-cf63e8-7-2', 'cf63e8', 30, '7', 'c) Using a graph paper, plot the points A(6, 4) and B(0, 4). [4]

i) Reflect A and B in the origin to get images A'' and B''.

ii) Write the coordinates of A'' and B''

iii) State the geometrical name for the figure ABA''B''.

iv) Find its perimeter', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-cf63e8-8-0', 'cf63e8', 31, '8', 'a) Solve the inequation $$2y - 3 < y + 1 \leq 4y + 7$$, where $$y \in R$$.

Also represent the solution set on the number line.

[3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-8-1', 'cf63e8', 32, '8', 'b) A car covers a distance of 400 km at a certain speed. Had the speed been 12 km/hr more, the time taken for the journey would have been 1 hr 40 min. less. Find the original speed of the car.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-8-2', 'cf63e8', 33, '8', 'c) Prove that : $$(\sin \theta + \cos \theta)(\text{cosec } \theta - \sec \theta) = \text{cosec } \theta . \sec \theta - 2 \tan \theta$$', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-9-0', 'cf63e8', 34, '9', 'a) Prove that $$\sqrt{\frac{\sec A - 1}{\sec A + 1}} + \sqrt{\frac{\sec A + 1}{\sec A - 1}} = 2 \text{ cosec } A$$

[3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-9-1', 'cf63e8', 35, '9', 'b) A man observes the angle of elevation of the top of a building to be $$30^\circ$$. He walks towards it in a horizontal line through its base. On covering 60m, the angle of elevation changes to $$60^\circ$$. Find the height of the building correct to the nearest meter.', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-9-2', 'cf63e8', 36, '9', 'c) If $$\begin{bmatrix} a & 1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 4 & 3 \\ -3 & 2 \end{bmatrix} = \begin{bmatrix} b & 11 \\ 4 & c \end{bmatrix}$$. find a. b and c.

[4]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-cf63e8-10-0', 'cf63e8', 37, '10', 'a) Salman buys 50 shares of face value Rs. 100 available at Rs. 132.

[3]

i) What is his investment ? ii) If the dividend is 7.5 % p.a. , what will be his annual income', 3, 'Shares and Dividends', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-10-1', 'cf63e8', 38, '10', 'b) Solve : $$x^2 + 7x - 7 = 0$$ and give your answer correct to two decimal places.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-cf63e8-10-2', 'cf63e8', 39, '10', 'c) If $$x = a \sec \theta + b \tan \theta$$ and $$y = a \tan \theta + b \sec \theta$$, prove that $$x^2 - y^2 = a^2 - b^2$$.', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-7d7bee-1-1', '7d7bee', 0, '1', '(ii) Manu Purchases some goods for ₹2000 and sells them for ₹2,500. If the rate of GST is 18%, the tax liability on Manu is.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹360', '₹450', '₹90', '₹900']::text[]),
  ('MQ-7d7bee-1-2', '7d7bee', 1, '1', '(iii) Naveen deposits ₹800 every month in a recurring deposit account for 6 months. If he receives ₹4884 at the time of maturity, then the interest he earns is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹84', '₹42', '₹24', '₹284']::text[]),
  ('MQ-7d7bee-1-3', '7d7bee', 2, '1', '(iv) 500, ₹50 share at par earn a dividend of ₹1,250 in one year. The rate of dividend is:', 1, 'Shares and Dividends', 'MCQ', 1, NULL, array['10%', '7.5%', '12.5%', '5%']::text[]),
  ('MQ-7d7bee-1-4', '7d7bee', 3, '1', '(v) For $$7 - 3x < x - 5$$, the solution is', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['x > 3', 'x < 3', 'x ≥ 3', 'x ≤ 3']::text[]),
  ('MQ-7d7bee-1-5', '7d7bee', 4, '1', '(vi) For quadratic equation $$2x + \frac{5}{x} = 5$$,', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['x ≠ 0', 'x = 1', 'x = 5', 'x = 2']::text[]),
  ('MQ-7d7bee-1-6', '7d7bee', 5, '1', '(vii) Two integers differ by 2 and sum of their square is 52. The integers are.', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['4 and 6', '4 or 6', '-4 or 6', '-4 and -6 or 6 and 4']::text[]),
  ('MQ-7d7bee-1-7', '7d7bee', 6, '1', '(viii) The mean proportional between 4 and 9 is', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['4', '6', '9', '36']::text[]),
  ('MQ-7d7bee-1-8', '7d7bee', 7, '1', '(ix) The nth term of an arithmetic progression (A.P) is $$2n + 5$$. The 10th term is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['7', '15', '25', '45']::text[]),
  ('MQ-7d7bee-1-9', '7d7bee', 8, '1', '(x) Factors of $$4 + 4x - x^2 - x^3$$ are:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$$(2 + x)(2 - x)(1 + x)$$', '$$(x - 2)(1 + x)(2 + x)$$', '$$(x + 2)(x - 2)(1 - x)$$', '$$(2 + x)(x - 1)(2 - x)$$']::text[]),
  ('MQ-7d7bee-5-0', '7d7bee', 9, '5', '(i) Find the geometrical progression with fourth term \(= 54\) and seventh term \(= 1458\). [3]', 3, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-5-1', '7d7bee', 10, '5', '(ii) The point \( p(a, b) \) is first reflected in the origin and then reflected in the \( y \)-axis to \( p'' \). If \( p'' \) has co-ordinate (4, 6); evaluate a and b. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-5-2', '7d7bee', 11, '5', '(iii) Points A,B,C and D divide the line segment joining the point (5, -10) and the origin in the five equal parts. Find the co-ordinates of B and D [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-6-0', '7d7bee', 12, '6', '(i) The points \((\mathbf{K},3)\) (2,-4) and \((-k + 1, - 2)\) are collinear find K. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-6-1', '7d7bee', 13, '6', '(ii) Divide 96 into four parts which are in A.P and ratio between product of their means to the product of their extremes is 15:7 [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-6-2', '7d7bee', 14, '6', '(iii) Which term of the G.P, 2, \(2\sqrt{2}\), 4. is \(128\sqrt{2}\) [4]', 4, 'Geometric Progression', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-7-0', '7d7bee', 15, '7', '(i) Solve the following equation using factorisation method. [3]

$$\frac{x-3}{x+3} + \frac{x+3}{x-3} = 2\frac{1}{2}$$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-7-1', '7d7bee', 16, '7', '(ii) If \( A^2, 4 \) and 9 are in continued proportion, then find the value of \( A^2 \). [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-7-2', '7d7bee', 17, '7', '(iii) Factorise the expression, [4]

$$f(x) = 2x^3 - 7x^2 - 3x + 18$$, hence find all possible values of x for which f(x) = 0', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-8-0', '7d7bee', 18, '8', '(i) If \( P = \begin{bmatrix} 2 & 6 \\ 3 & 9 \end{bmatrix} \) and \( Q = \begin{bmatrix} 3 & x \\ y & 2 \end{bmatrix} \), find \( x \) and \( y \) such that \( PQ = \) null matrix. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-8-1', '7d7bee', 19, '8', '(ii) State the Co-ordinates of the following points under reflection in the line \( x = 0 \) [3]

(a) (-6, 4) (b) (0, 5) (c) (3, -4)', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-8-2', '7d7bee', 20, '8', '(iii) Solve for x using the quadratic formula. write your answer correct to two significant figure, (x - 1)^2 - 3x + 4 = 0 [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-9-0', '7d7bee', 21, '9', '(i) ABC is a triangle, whose vertices are A(1, -1), B(0, 4) and C(-6, 4). D is the midpoint of BC.

Find:- (a) Co-ordinate of D (b) Equation of the median AD [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-9-1', '7d7bee', 22, '9', '(ii) Which term of the A.P 15, 30, 45, 60...is 300. Hence. Find the sum of all the terms of the Arithmetic Progression (A.P) [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-9-2', '7d7bee', 23, '9', '(iii) A company with 10,000 shares of nominal value ₹100 declares an annual dividend of 8% to the share- holders. [4]

(a) Calculate the total amount of dividend paid by the company.
(b) Ramesh had bough 90 shares of the company at ₹150 per share. Calculate the dividend he receives and percentage of return on his investment.', 4, 'Shares and Dividends', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-10-0', '7d7bee', 24, '10', '(i) Divide 20 into two parts such that three times the square of one part exceeds the other part by 10. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-10-1', '7d7bee', 25, '10', '(ii) If \((a - b):(a + b) = 1:11\) , find the ratio of \((5a + 4b + 15):(5a - 4b + 3)\) [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-7d7bee-10-2', '7d7bee', 26, '10', '(iii) Calculate the ratio in which the line joining the points \((-3, -1)\) and \((5, 7)\) is divided by the line \(x = 2\). Also find the co-ordinate of the point of intersection. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-7d7bee-1-10', '7d7bee', 27, '1', '(xi) The sum of 20 terms of the G.P 10, 20, 40,...is', 1, 'Geometric Progression', 'MCQ', 3, NULL, array['$$10(2^{19} - 1)$$', '$$10(2^{21} - 1)$$', '$$10(2^{26} - 1)$$', 'None of these']::text[]),
  ('MQ-7d7bee-1-11', '7d7bee', 28, '1', '(xii) The point P(x, y) is reflected in the line Y=x to the point P'' (x'', Y''), then', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['$$x = y$$', '$$y'' = x''$$', '$$x = x''$$ and $$y = y''$$', '$$x = y''$$ and $$y = x''$$']::text[]),
  ('MQ-7d7bee-1-12', '7d7bee', 29, '1', '(xiii) The line $$y = 4$$ divides the join of points (6, 7) and (4, -1) in the ratio:-', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['3:5', '5:3 -', '1:5', '5:1']::text[]),
  ('MQ-7d7bee-1-13', '7d7bee', 30, '1', '(xiv) The slope of a line is $$\sqrt{3}$$, its inclination is ...', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['$$30^{\circ}$$', '$$45^{\circ}$$ c', '$$60^{\circ}$$', '$$90^{\circ}$$']::text[]),
  ('MQ-7d7bee-1-14', '7d7bee', 31, '1', '(xv) The printed price of an article is ₹3080. If the rate of GST is 10% then the GST charged is:-', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹154', '₹308', '₹30.80', '15.40']::text[]),
  ('MQ-7d7bee-2-0', '7d7bee', 32, '2', '(i) Find the value of ''m'' if the following equation has equal roots. (4)

$$(m - 2)x^2 - (5 + m)x + 16 = 0$$', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-7d7bee-2-1', '7d7bee', 33, '2', '(ii) ₹250 is divided equally among a certain number of children. If there were 25 children more, each would have received 50 paise less. Find the number of children. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-7d7bee-2-2', '7d7bee', 34, '2', '(iii) If $$x = \frac{\sqrt{a+3b} + \sqrt{a-3b}}{\sqrt{a+3b} - \sqrt{a-3b}}$$, Prove that [4]

$$3bx^2 - 2ax + 3b = 0$$', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-7d7bee-3-0', '7d7bee', 35, '3', '(i) Given that $$(x - 2)$$ and $$(x + 1)$$ are factors of $$f(x) = x^3 + 3x^2 + ax + b$$, calculate the values of a and b. Hence find all the factors of $$f(x)$$ [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-7d7bee-3-1', '7d7bee', 36, '3', '(ii) Solve for x and y: (a) $$\begin{bmatrix} 2 & 5 \\ 5 & 2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} -7 \\ 14 \end{bmatrix}$$ (b) $$[x + y \quad x - 4] \begin{bmatrix} -1 & -2 \\ 2 & 2 \end{bmatrix} = [-7 \quad -11]$$', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-7d7bee-3-2', '7d7bee', 37, '3', '(iii) The sum of first 7 terms of an A.P is 49 and that of first 17 terms of it is 289. find the sum of first n terms. [5]', 5, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-7d7bee-4-0', '7d7bee', 38, '4', '(i) A shopkeeper sells an A.C to Ms. Alka for ₹31,200 including GST at the rate of 28%. If the shopkeeper and Ms. Alka both are from the same city. Find for the shopkeeper:

(a) Total amount of GST (b) Taxable value of AC [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-7d7bee-4-1', '7d7bee', 39, '4', '(ii) A man has a Recurring Deposit Account in a bank for $$3\frac{1}{2}$$ years. If the rate of interest is 12% per annum and man gets ₹10,206 on maturity, find the value of monthly instalments. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-7d7bee-4-2', '7d7bee', 40, '4', '(iii) Solve the following inequation and write the solution set $$13x - 5 < 15x + 4 < 7x + 12, x \in R$$. Represent the solution on a real number line. [4]', 4, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-bdb0ef-1-0', 'bdb0ef', 0, '1', 'i. If $P = [1 \quad 2] \begin{bmatrix} 3 & 7 \\ 2 & 4 \end{bmatrix}$ The order of matrix $P$ is:', 1, 'Matrices', 'MCQ', 1, NULL, array['$1 \times 1$', '$2 \times 2$', '$1 \times 2$', '$2 \times 1$']::text[]),
  ('MQ-bdb0ef-1-1', 'bdb0ef', 1, '1', 'ii. The value of $k$ for the quadratic equation $x^2 - kx + 4 = 0$ to have real and equal roots is:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['$\mp 2$', '$\mp 4$', '5', '3']::text[]),
  ('MQ-bdb0ef-1-2', 'bdb0ef', 2, '1', 'iii. Amit sold a chair to Raman at ₹ 4000 GST charge @ 18% the price paid by Raman is Rupees:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['4018', '4500', '4000', '4720']::text[]),
  ('MQ-bdb0ef-1-3', 'bdb0ef', 3, '1', 'iv. Mr. Sharma deposits ₹ 500 every month for three and a half year in the bank of India at the rate of interest as 8% p.a. What will be his total investment?', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹ 1750', '₹ 21,000', '₹ 3010', '₹ 24,010']::text[]),
  ('MQ-bdb0ef-1-4', 'bdb0ef', 4, '1', 'v. **Statement 1:** The probability that the Sun will rise from west tomorrow is 1.
**Statement 2:** The probability that it will rain on Monday is 1.
Which of the following is valid?', 1, 'Probability', 'MCQ', 1, NULL, array['both the statements are true', 'both the statements are false', 'statement 1 is true but statement 2 is false', 'statement 1 is false and statement 2 is true']::text[]),
  ('MQ-bdb0ef-1-5', 'bdb0ef', 5, '1', 'vi. Which of the following equations represent a line passing through origin', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$5x - 7y + 5 = 0$', '$y = -4$', '$x = 7$', '$3x - 7y = 0$']::text[]),
  ('MQ-bdb0ef-1-6', 'bdb0ef', 6, '1', 'vii. The reflection of $(0, -2)$ in the line $x = 2$ is?', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$(-4, -2)$', '$(1, -1)$', '$(0, 4)$', '$(4, -2)$ .']::text[]),
  ('MQ-bdb0ef-1-7', 'bdb0ef', 7, '1', 'viii. In the given figure triangle ABC is similar to triangle EDF by the criteria:', 1, 'Similarity', 'MCQ', 1, 'bdb0ef__ICSE_X_Mat_p1_img_0_jpeg.webp', array['SSS', 'SAS', 'AAS', 'AAA']::text[]),
  ('MQ-bdb0ef-1-8', 'bdb0ef', 8, '1', 'ix. In the given figure, AB and AC are tangents to the circle with centre O such that $\angle BAC = 40^{\circ}$, then $\angle OBC$ is equal to:
![img-0.jpeg](img-0.jpeg)[caption": "a) $20^{\\circ}$ b) $140^{\\circ}$ c) $70^{\\circ}$ d) $40^{\\circ}$"}]', 1, 'Circles', 'MCQ', 2, 'bdb0ef__ICSE_X_Mat_p2_img_0_jpeg.webp', array['$20^{\circ}$', '$140^{\circ}$', '$70^{\circ}$', '$40^{\circ}$']::text[]),
  ('MQ-bdb0ef-1-9', 'bdb0ef', 9, '1', 'x. If 84 is the nth term of the arithmetic progression 21,28,35,42...then ''n'' is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['11', '14', '9', '10']::text[]),
  ('MQ-bdb0ef-1-10', 'bdb0ef', 10, '1', 'xi. Median marks from the given data is:
| Marks | 25 | 50 | 35 | 65 | 45 | 70 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 6 | 15 | 12 | 10 | 18 | 9 |', 1, 'Statistics', 'MCQ', 2, NULL, array['18', '45', '65', '35']::text[]),
  ('MQ-bdb0ef-1-11', 'bdb0ef', 11, '1', 'xii. A cylinder and a cone are of same base radius and of same height. The ratio of the volume of the cylinder to that of the cone is', 1, 'Mensuration', 'MCQ', 2, NULL, array['2 : 1', '3 : 1', '2 : 3', '3 : 2']::text[]),
  ('MQ-bdb0ef-1-12', 'bdb0ef', 12, '1', 'xiii. If x, 12, 8 and 32 are in continued proportion, then the value of x is:', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['6', '4', '3', '2']::text[]),
  ('MQ-bdb0ef-1-13', 'bdb0ef', 13, '1', 'xiv.
The value of $\sin^4 A - \cos^4 A$ is equal to:', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$2\sin^2 A - 1$', '$2\cos^2 A - 1$', '$\sin^2 A + \cos^2 A$', '$2\cos^2 A + 1$']::text[]),
  ('MQ-bdb0ef-1-14', 'bdb0ef', 14, '1', 'xv. A man invested ₹10320 on ₹ 100 shares at a discount of ₹14. Number of shares bought by him is', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['120', '110', '100', '95']::text[]),
  ('MQ-bdb0ef-2-0', 'bdb0ef', 15, '2', 'i. Saanvi has a recurring deposit account and deposits ₹ 900 per month for 2 years if she gets ₹1800 as interest at the time of maturity, find the rate of interest.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-bdb0ef-2-1', 'bdb0ef', 16, '2', 'ii. The third term of G.P is 4. Find the product of first five terms.', NULL, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-bdb0ef-2-2', 'bdb0ef', 17, '2', 'iii. In the given figure AC is the diameter of the circle with centre O. CD is parallel to BE. Given that $\angle AOB = 80^{\circ}$ and $\angle ACE = 20^{\circ}$. Calculate:

(a) $\angle BEC$

(b) $\angle BCD$

(c) $\angle CED$

[4]', 4, 'Circles', 'long', 2, 'bdb0ef__ICSE_X_Mat_p2_img_1_jpeg.webp', NULL),
  ('MQ-bdb0ef-3-0', 'bdb0ef', 18, '3', 'i. The radius and height of a right circular cone are in the ratio 5:12 and its volume is 2512 cubic cm. Find

the radius and slant height of the cone. (Take $\pi = 3.14$)', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-bdb0ef-3-1', 'bdb0ef', 19, '3', 'ii. From the given figure:

a) Write down the coordinates of A and B.
b) If P divides AB in the ratio 2:3, find the coordinates of point P.
c) Find the equation of a line parallel to line AB and passing through origin.', NULL, 'Coordinate Geometry', 'short', 2, 'bdb0ef__ICSE_X_Mat_p2_img_2_jpeg.webp', NULL),
  ('MQ-bdb0ef-3-2', 'bdb0ef', 20, '3', 'iii. Plot the points A (3, 5) and B (-2, -4). Use 1 cm = 1 unit on both the axes.

a) A'' is the image of A when reflected in the x-axis. Write down the co-ordinates of A'' and plot it on the graph paper.
b) B'' is the image of B when reflected in the y-axis, followed by reflection in the origin. Write down the co-ordinates of B'' and plot it on the graph paper.
c) Write down the geometrical name of the figure AA''BB''A. [5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-bdb0ef-4-0', 'bdb0ef', 21, '4', 'i. The ages of 40 students are given in the following table. Find the arithmetic mean.

| Age( in yrs) | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 4 | 6 | 9 | 8 | 7 | 4 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-4-1', 'bdb0ef', 22, '4', 'ii. A dice is rolled two times. Find the probability of getting:

a) a total of at least 9
b) a doublet
c) prime number on both the dice [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-4-2', 'bdb0ef', 23, '4', 'iii. A registered Company computer engineer provides computer maintenance services to five different companies. He offers different discounts to different companies depending upon their payment terms. If the rate of GST at 18%, calculate the output GST for the computer engineer.

| Company | C1 | C2 | C3 | C4 | C5 |
| --- | --- | --- | --- | --- | --- |
| SERVICE COST (₹) | 10,200 | 12,100 | 13,600 | 10,000 | 12,500 |
| DISCOUNT | 30% | 25% | 20% | 15% | 10% |', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-5-0', 'bdb0ef', 24, '5', 'i. Solve the equation $$3x^2 - x - 7 = 0$$ and give your answer correct to two decimal place.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-5-1', 'bdb0ef', 25, '5', 'ii. In the following figure, calculate the values of x, y and z if: $$\frac{x}{3} = \frac{y}{4} = \frac{z}{5}$$', NULL, 'Ratio and Proportion', 'short', 3, 'bdb0ef__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-bdb0ef-5-2', 'bdb0ef', 26, '5', 'iii. A person on tour has ₹ 4200 for his expenses. If he extends his tour by three days, he has to cut his daily expenses by ₹ 70. Find his original duration of the tour.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-6-0', 'bdb0ef', 27, '6', 'i. Prove the identity: $$\frac{\cos\theta \cot\theta}{1+\sin\theta} = \csc\theta - 1$$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-6-1', 'bdb0ef', 28, '6', 'ii. Solve and graph the solution set of $$13x - 5 \le 15x + 4 < 7x + 12$$; where $$x \in \mathbb{R}$$.', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-6-2', 'bdb0ef', 29, '6', 'iii. A man invests ₹ 8000 in shares of a company which pays 15% dividend at a time when a ₹ 35 shares costs ₹40. Find:

a) the number of shares he bought.
b) the annual income from his shares.
c) the rate of interest which he gets on his investment. [4]', 4, 'Shares and Dividends', 'long', 3, NULL, NULL),
  ('MQ-bdb0ef-7-0', 'bdb0ef', 30, '7', 'i. The sum of n terms of an A.P is \( n^2 + 3n \). Find its \( 14^{\text{th}} \) term. [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-7-1', 'bdb0ef', 31, '7', 'ii. Given: \( x = \frac{\sqrt{a^2 + b^2} + \sqrt{a^2 - b^2}}{\sqrt{a^2 + b^2} - \sqrt{a^2 - b^2}} \) Using properties of proportion show that: \( b^2 x^2 - 2a^2 x + b^2 = 0 \). [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-bdb0ef-7-2', 'bdb0ef', 32, '7', 'iii. Two persons are standing on the opposite sides of a tower. They observe the angles of elevation of the top of the tower to be $30^\circ$ and $38^\circ$ respectively. Find the distance between them, if the height of the tower is 50 m. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-bdb0ef-8-0', 'bdb0ef', 33, '8', 'i. Draw an inscribing circle of a regular hexagon of side 5.5 cm and mark its center as O. [3]', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-bdb0ef-8-1', 'bdb0ef', 34, '8', 'ii. In fig., AB is a chord of the circle and AOC is its diameter such that $\angle ACB = 50^\circ$. If AT is the tangent to the circle at the point A, then find the measure of $\angle BAT$ and $\angle BTA$. [3]', 3, 'Circles', 'short', 4, 'bdb0ef__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-bdb0ef-8-2', 'bdb0ef', 35, '8', 'iii. The figure given below shows two straight lines AB and CD intersecting each other at point P (3, 4). Find the equation of AB and CD. [4]', 4, 'Coordinate Geometry', 'long', 4, 'bdb0ef__ICSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-bdb0ef-9-0', 'bdb0ef', 36, '9', 'i. Find the value of ''a'', if $3x^3 - ax^2 + 5x - 13$ and $(a + 1)x^2 - 7x + 5$ leave the same remainder when each is divided by $x - 3$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-bdb0ef-9-1', 'bdb0ef', 37, '9', 'ii. Solve for x and y: $[x + y - x - 4] \begin{bmatrix} -1 & -2 \\ 2 & 2 \end{bmatrix} = [-7 \quad -11]$ [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-bdb0ef-9-2', 'bdb0ef', 38, '9', 'iii. In the following figure, PQ and PR are tangents to the circle, with centre O. If $\angle P$ is $60^\circ$. Calculate:
a) $\angle QOR$ b) $\angle OQR$ c) $\angle QSR$ [4]', 4, 'Circles', 'long', 4, 'bdb0ef__ICSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-bdb0ef-10-0', 'bdb0ef', 39, '10', 'i. Use ruler and compasses for the following question taking a scale of 10 m = 1 cm. A park in a city is bounded by straight fences AB, BC, CD and DA. Given that AB = 50 m, BC = 63 m, $\angle ABC = 75^\circ$. D is a point equidistant from the fences AB and BC. If $\angle BAD = 90^\circ$, construct the outline of the park ABCD. Also locate a point P on the line BD for the flag post which is equidistant from the corners of the park A and B. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-bdb0ef-10-1', 'bdb0ef', 40, '10', 'ii. The following data represents the daily wages in rupees of a certain number of employees of a company:

| Daily Wages (₹) | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 | 100-110 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of employees | 8 | 14 | 12 | 17 | 20 | 26 | 13 | 10 |

Use a graph to answer the following questions:

a) Represent the above distribution by an ogive.
b) Using ogive drawn by you, estimate:
1. median wage.
2. percentage of employees who earn more than ₹ 84 per day.
3. number of employees who earn ₹ 56 and below.

[6]', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-3202d9-1-0', '3202d9', 0, '1', '(i) A shopkeeper bought a washing machine for 20,000 from a dealer. He sold it to a consumer at a profit of 5000. If rate of GST is 28%, then the tax liability of the shopkeeper is:

☑ (a) 1400

(b) 700

(c) 650

(d) nil', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-1', '3202d9', 1, '1', '(ii) The roots of $$3x^2 - 5x + 1 = 0$$ are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['irrational', 'equal', 'imaginary', 'none of these']::text[]),
  ('MQ-3202d9-1-2', '3202d9', 2, '1', '(ii) On dividing $$x^3 - x^2 + x - 1$$ by $$(x - 1)$$, the remainder is:

(a) 1

(b) -1

☑ (c) 0

(d) 4', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-3', '3202d9', 3, '1', 'iv) A is a matrix of order $$2 \times 3$$. The order of A'' is:

☑ (a) $$2 \times 3$$

(b) $$2 \times 2$$

(c) $$3 \times 2$$

(d) $$3 \times 3$$', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-4', '3202d9', 4, '1', '(v) If $$x, 2x + p, 3x + 6$$ are in AP, then the value of p is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['2', '3', '5', '7']::text[]),
  ('MQ-3202d9-1-5', '3202d9', 5, '1', '(vi) If the image of the point P under reflection in the x-axis is (-3, 4), then the coordinates of the point P are:

(a) (3, 4)

☑ (b) -3, -4)

(c) (3, 4)

(d) (-4, 3)', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-6', '3202d9', 6, '1', '(vii) In the figure, if $$\triangle ABC$$ QPR, then the value of x is', 1, 'Similarity', 'MCQ', 1, '3202d9__ICSE_X_Mat_p1_img_1_jpeg.webp', array['\(2\mathrm{cm}\)', '\(4\mathrm{cm}\)', '\(3.5\mathrm{cm}\)', '\(2.5\mathrm{cm}\)']::text[]),
  ('MQ-3202d9-1-7', '3202d9', 7, '1', '(vii) A rectangular paper is folded into a cylinder. The length and breadth of the paper are L and B respectively. Which of the following represents its curved surface area?

(a) $$2\pi tLB$$

☑ (b) LB

(c) $$\frac{L}{B}$$

(d) $$\pi LB$$', 1, 'Mensuration', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-8', '3202d9', 8, '1', '(ix) If $$2r - 1) 9$$, xEW, then the greatest value of x is:

(a) 3

☑ (b) 2

(c) 4

(d) 5', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-9', '3202d9', 9, '1', '(x) Which of the following cannot be the probability of an event?

(a) 3

(b) 3

☑ (c) 1.001

(d) 0.6', 1, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-10', '3202d9', 10, '1', '(xi) The value of [ 2 - 1] [ 7 0]

[ 0 5] + [-1 4] is:

☑ (a) [ 9 - 9]
[-1 1]

☑ (b) [ 9 - 1]
[-1 9]

(c) [ 8 1]

[ 4 -1]

(d) [ 5 2]

[ 1 -6]', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-11', '3202d9', 11, '1', '(xii) If P(-1, 1) is the mid-point of the line segment joining A(-3, b) and B(1, b + 4), then the value of b is:

☑ (a) 1

(b) -1

(c) 2

(d) 0', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-12', '3202d9', 12, '1', '(xiii) ABCD is a cyclic quadrilateral such that AB is a diameter of the circle circumscribing it and $$\angle ADC = 140^{\circ}$$, then BAC is equal to:

(a) $$80^{\circ}$$

☑ (b) $$50^{\circ}$$

(c) 40

(d) $$30^{\circ}$$', 1, 'Circles', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-13', '3202d9', 13, '1', '(xiv) The nth term of an AP is $$Tn = 4n - 1$$. The common difference of the AP is:

(a) 2

(b) 3

(c) -3

☑ (d) 4', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-3202d9-1-14', '3202d9', 14, '1', '(xv) The relation between mean, median, and mode is:

☑ (a) Mean -Mode = 3(Mean -Median)

(b) 3 (Mean -Mode) = (Mean -Median)

(c) Mean + Mode = 3(Mean -Median)

(d) Mean -Mode = 3 (Mean + Median)', 1, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-3202d9-2-0', '3202d9', 15, '2', '(i) Mr. Richard has a recurring deposit account in a bank for 3 years at 7.5% p.a. simple interest. If he gets 8325 as interest at the time of maturity, find:

(a) The monthly deposit

[4]
(b) The maturity value.', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-3202d9-2-1', '3202d9', 16, '2', '(ii) If b is the mean proportion between a and c, show that: $$a^4 + a^2 b^2 + b^4 = \frac{a^2}{b^4 + b^2 c^2 + c^4}$$', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-3202d9-2-2', '3202d9', 17, '2', 'iii) Prove that $$\sin \theta - 2\sin^3 \theta$$

$$2\cos^3 - \cos \theta = \tan \theta \tag{4}$$', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-3202d9-3-0', '3202d9', 18, '3', '(i) The adjoining figure represents a solid consisting of a right circular cylinder with a hemisphere at one end and a cone at the other. Their common radius is 7 cm. The height of the cylinder and cone are each of 4 cm. Find the volume of the solid.', 5, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-3202d9-3-1', '3202d9', 19, '3', '(ii) A(2, 5), B(-1, 2) and C(5, 8) are the vertices of a triangle ABC, ''M is a point on AB such that AM : MB = 1 : 2. Find the co-ordinates of ''M''. Hence find the equation of the line passing through the points C and M', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-3202d9-3-2', '3202d9', 20, '3', '(iii) Use a graph paper for this question (Take 2 cm = I unit on both X and y axis)

(a) Plot the following points: A(0, 4), B(2, 3), C(1, 1) and D(2, 0)
(b) Reflect points B, C, D on the y-axis and write down their coordinates. Name the images as B'', C'', D. Respectively.
(C) Join the points A, B, C, D, D'', C'', B'' and A in order, so as to form a closed figure. Write down the equation of the line of symmetry of the figure formed.', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-3202d9-4-0', '3202d9', 21, '4', '(i) Mr. Roy went to a departmental store and bought the following items. The GST rates and the quantity of each item and market price of each are given below :

| S No. | Items | Price per item in | Quantity | GST rate | Amount |
| --- | --- | --- | --- | --- | --- |
| 1 | Walnut | 650 | 1 | 5% | |
| 2 | Potato Chips | 50 | 2 | 0% | |
| 3 | Coffee | 80 | 3 | 18% | |

Find the :

(a) The total amount of SGST paid.

(b) The total amount of the bill', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-3202d9-4-1', '3202d9', 22, '4', '(ii) Solve \( x^{2} + 7x = 7 \) and give your answer correct to two decimal places. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-3202d9-4-2', '3202d9', 23, '4', '(iii) Draw a histogram for the given data, using a graph paper: [4]

| Class -interval | Frequency |
| --- | --- |
| 0 -10 | 14 |
| 10-20 | 22 |
| 20-30 | 27 |
| 30-40 | 22 |
| 40-50 | 23 |
| 50-60 | 20 |
| 60-70 | 15 |

Estimate the mode from the graph.', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-3202d9-5-0', '3202d9', 24, '5', '(i) Find the values of x and y if [1 2][x 0] [x 0]

$$[3\ 3][0\ y] = [9\ 0]$$', NULL, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-3202d9-5-1', '3202d9', 25, '5', '(ii) In the given figure, AC is a tangent to the circle with centre O. If \(< ADB = 55^{\circ}\), find x and y. Give reasons for your answers. [3]', 3, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-3202d9-5-2', '3202d9', 26, '5', '(ii) Using the Remainder Theorem, find the remainders obtained when \( x^3 + (kx + 8)x + k \) is divided by \( x + 1 \) and \( x - 2 \). Hence find \( k \) if the sum of the two remainders is \( \frac{1}{k} \) [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-3202d9-6-0', '3202d9', 27, '6', '(i) A (-1, 3), B(4, 2) and C(3, -2) are the vertices of a triangle.
(a) Find the coordinates of the centroid of the triangle.
(b) Find the equation of the line through G and parallel to AC. cot A-1 2 sec AA cot A', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-3202d9-6-1', '3202d9', 28, '6', '(ii) Prove that : cot a -1 : cot A

$$\frac{}{2 - \sec^2 A} = \frac{}{1 + \tan A}$$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-3202d9-6-2', '3202d9', 29, '6', 'ii) The 4th term of an A.P. is 22 and 15th term is 66. Find the first term and the common. difference. Hence find the sum or the series to 8 terms.', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-3202d9-7-0', '3202d9', 30, '7', '(i) If one card is drawn at random from a pack of 52 playing cards, what is the probability that it is:

(a) a king?

(b) the ace of clubs?

(c) a heart?', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-3202d9-7-1', '3202d9', 31, '7', '(ii) The sum of the radius of the base and the height of a solid cylinder is 37 cm. If the total surface area of the cylind 1628 m, find its volume.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-3202d9-7-2', '3202d9', 32, '7', '(iii) In the given figure, TP and TQ are two tangents to the circle with centre O, touching at A and C respectively. If <BCQ = 55° and <BAP = 60°, find:

(a) <OBA and <OBC

(b) <AOC

(c) <ATC', NULL, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-3202d9-8-0', '3202d9', 33, '8', '(i) Solve the following in equation and represent the solution set on a number line.

$$\frac{1}{2} < -\frac{1}{2} - 4 < 7\frac{1}{2}, x \in I$$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-3202d9-8-1', '3202d9', 34, '8', '(ii) Find the mean of the following data:

| Class -interval | 0 -10 | 10 -20 | 20 -30 | 30 -40 | 40 -50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 12 | 16 | 6 | 7 | 9 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-3202d9-8-2', '3202d9', 35, '8', '(iii) In Δ ABC, AD is the bisector of <A. If BC = 10 cm, BD = 6 cm and AC =6 cm, find AB', NULL, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-3202d9-9-0', '3202d9', 36, '9', '(i) The duration of telephone calls in a week at a school were recorded as below:

| Time in seconds | 10-20 | 20 -30 | 30 -40 | 40 -50 | 50 -60 | 60 -70 | 70 -80 | 80 -90 | 90 -100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. Of calls | 5 | 14 | 19 | 27 | 43 | 29 | 16 | 12 | 5 |

Draw an ogive and locate the median and quartiles.', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-3202d9-9-1', '3202d9', 37, '9', '(ii) 7500 were divided equally among a certain number of children. Had there been 20 less children, each would have received Rs. 100 more. Find the original number of children.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3202d9-10-0', '3202d9', 38, '10', '(i) Using properties of proportion solve for x, given

$$5x + 2x - 6$$

$$\frac{}{5x - 2x - 6} = 4$$

$$5x - 2x - 6$$', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-3202d9-10-1', '3202d9', 39, '10', '(ii) Using ruler and compass only, construct a Δ ABC such that BC = 5 cm and AB = 6.5 cm and <ABC = 120°.

Construct a circum-circle of Δ ABC.', NULL, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-3202d9-10-2', '3202d9', 40, '10', '(iii) The angle of elevation from a point P of the top of a tower QR, 50 m high is 60° and that of the tower PT from the point Q is 30°. Find the height of the tower PT. Correct to the nearest metre.', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-b5bc1d-1-0', 'b5bc1d', 0, '1', 'i) What must be subtracted from the polynomial $$x^3 + x^2 - 2x + 1$$, so that the result exactly divisible by (x-3).', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['-31', '-30', '30', '31']::text[]),
  ('MQ-b5bc1d-1-1', 'b5bc1d', 1, '1', 'ii) If matrix $$A = \begin{bmatrix} 2 & 2 \\ 0 & 2 \end{bmatrix}$$ and $$A^2 = \begin{bmatrix} 4 & x \\ 0 & 4 \end{bmatrix}$$, then the value of x is,', 1, 'Matrices', 'MCQ', 1, NULL, array['2', '4', '8', '10']::text[]),
  ('MQ-b5bc1d-1-2', 'b5bc1d', 2, '1', 'iii) If (x-2) is a factor of $$x^3 - kx - 12$$, then the value of k is,', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['3', '2', '-2', '-3']::text[]),
  ('MQ-b5bc1d-1-3', 'b5bc1d', 3, '1', 'iv) If $$(4a + 7b)(4c - 7d) = (4a - 7b)(4c + 7d)$$ then,', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['a: b = c : 2d', 'a : b = 2c : d', 'a : b = 4c : d', 'a : b = c : d']::text[]),
  ('MQ-b5bc1d-1-4', 'b5bc1d', 4, '1', 'v) The mean proportional between $$\frac{1}{2}$$ and 128 is,', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['64', '32', '16', '8']::text[]),
  ('MQ-b5bc1d-1-5', 'b5bc1d', 5, '1', 'vi) Assertion(A) : Three quantities of the same kind a, b and c are in continued proportion.
Reason(R) : The ratio of a and b is equal to the ratio of b and c.', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['A is true, R is false,', 'A is false, R is true,', 'both A and R are true,', 'both A and R are false.']::text[]),
  ('MQ-b5bc1d-2-0', 'b5bc1d', 6, '2', 'Q.2) If $$x = \frac{\sqrt{2a+1} + \sqrt{2a-1}}{\sqrt{2a+1} - \sqrt{2a-1}}$$, prove that $$x^2 - 4ax + 1 = 0$$.', NULL, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-b5bc1d-3-0', 'b5bc1d', 7, '3', 'Q.3) Find the value of x and y if : $$2 \begin{bmatrix} x & 7 \\ 9 & y-5 \end{bmatrix} + \begin{bmatrix} 6 & -7 \\ 4 & 5 \end{bmatrix} = \begin{bmatrix} 10 & 7 \\ 22 & 15 \end{bmatrix}$$.', NULL, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-b5bc1d-4-0', 'b5bc1d', 8, '4', 'Q.4) Given $$A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$$ and $$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$ and $$A^2 = 9A + mI$$. Find m.', NULL, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-b5bc1d-5-0', 'b5bc1d', 9, '5', 'Q.5) Find the values of the constants a and b, if (x-2) and (x+3) are both factors of the expression

$$x^3 + ax^2 + bx - 12$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-b5bc1d-6-0', 'b5bc1d', 10, '6', 'Q.6) Using the factor theorem, show that (x - 2) is a factor of $$x^3 + x^2 - 4x - 4$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-b5bc1d-7-0', 'b5bc1d', 11, '7', 'Q.7) Given, $A = \begin{bmatrix} 4\sin30^\circ & \cos 0^\circ \\ \cos 0^\circ & 4\sin30^\circ \end{bmatrix}$ and $B = \begin{bmatrix} 4 \\ 5 \end{bmatrix}$. If $AX = B$:

i) Write the order of the matrix X. ii) Find the matrix X.', NULL, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-b5bc1d-8-0', 'b5bc1d', 12, '8', 'Q.8) Using componendo and dividendo find the values of x, given $\frac{\sqrt{3x+4} + \sqrt{3x-5}}{\sqrt{3x+4} - \sqrt{3x-5}} = 9$', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-b5bc1d-9-0', 'b5bc1d', 13, '9', 'Q.9) If $k + 3$, $k + 2$, $3k - 7$ and $2k - 7$ are in proportion, find k.', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-b5bc1d-10-0', 'b5bc1d', 14, '10', 'Q.10) If $(x - 2)$ is a factor of the expression $2x^3 + ax^2 + bx - 14$ and when the expression is divided by $(x - 3)$, it leaves remainder 52, find the values of a and b.', NULL, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-b5bc1d-11-0', 'b5bc1d', 15, '11', 'Q. 11) Factorise the polynomial $2x^3 + 3x^2 - 9x - 10$ completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-0c9771-1-0', '0c9771', 0, '1', 'i) A dealer in Sikkim sells goods to a consumer in Sikkim worth ₹ 80,000. If the rate of GST is 12%, the SGST to be paid is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹ 9600', '₹ 6400', '₹ 2400', '₹ 4800']::text[]),
  ('MQ-0c9771-1-2', '0c9771', 1, '1', 'iii) In the adjoining diagram, O is the centre of the circle and PT is a tangent. The value of x is:', 1, 'Circles', 'MCQ', 1, '0c9771__ICSE_X_Mat_p1_img_0_jpeg.webp', array['$$50^\circ$$', '$$90^\circ$$', '$$105^\circ$$', '$$85^\circ$$']::text[]),
  ('MQ-0c9771-1-3', '0c9771', 2, '1', 'iv) The centroid in centre of a triangle is the point which is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['at equal distance from the three sides of the triangle.', 'the point of intersection of the angular bisectors of the triangle.', 'the point of intersection of the three medians.', 'the point of intersection of the three altitudes of the triangle.']::text[]),
  ('MQ-0c9771-1-4', '0c9771', 3, '1', '(v) If the $$n^{th}$$ term of an A.P. is given by $$a_n = 2n + 1$$, then the sum of first $$n$$ terms of the A.P. is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['$$n(n - 2)$$', '$$n(n + 2)$$', '$$n(n + 1)$$', '$$n(n - 1)$$']::text[]),
  ('MQ-0c9771-1-5', '0c9771', 4, '1', '(vi) 10 cards are marked with the numbers 1 to 10, and then one card is picked up. What is the probability that the card is an odd prime number?', 1, 'Probability', 'MCQ', 1, NULL, array['0.6', '0.5', '0.4', '0.3']::text[]),
  ('MQ-0c9771-1-6', '0c9771', 5, '1', '(vii) If 84 is the nth term of the arithmetic progression 21, 28, 35, 42... then ''n'' is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['11', '14', '9', '10']::text[]),
  ('MQ-0c9771-1-7', '0c9771', 6, '1', '(viii) The equation of a line whose y intercept = 2 and slope = 3 is y = 3x - 2', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['y = 2x + 3', 'x = 2y + 3', 'y = 3x + 2', 'x = 3y + 2']::text[]),
  ('MQ-0c9771-1-8', '0c9771', 7, '1', '(vii) If A = [3 - 2] and B = [-1 4; 2 0]
Assertion (A): Product AB of two matrices A and B is possible.
Reason (R): Number of columns of A is equal to number of rows in B.', 1, 'Matrices', 'MCQ', 2, NULL, array['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is NOT the correct explanation of A.', 'A is true but R is false. (d) A is false but R is true']::text[]),
  ('MQ-0c9771-1-9', '0c9771', 8, '1', '(x) The value of cosec² θ + sec² θ is equal to :', 1, 'Trigonometry', 'MCQ', 2, NULL, array['tan² θ + cot² θ', 'cot θ + tan θ', '(cot θ + tan θ)²', '1']::text[]),
  ('MQ-0c9771-1-10', '0c9771', 9, '1', '(xi) The value of k if the roots of the equation x² - 2x + p = 0 are real and equal is:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['1', '-1', '0', '2']::text[]),
  ('MQ-0c9771-1-11', '0c9771', 10, '1', '(xii) The median of the following observations arranged in ascending order is 64. Find the value of x:
27, 31, 46, 52, x, x + 4, 71, 79, 85, 90', 1, 'Statistics', 'MCQ', 2, NULL, array['60', '61', '62', '66']::text[]),
  ('MQ-0c9771-1-12', '0c9771', 11, '1', '(xiii) Given x + 2 ≤ x/s + 3 and x is a prime number. The solution set for x is:', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['0', '{0}', '{1}', '{0,1}']::text[]),
  ('MQ-0c9771-1-13', '0c9771', 12, '1', '(xiv) A rectangular sheet of paper of size 11 cm × 7 cm is first rotated about the side 11 cm and then about the side 7 cm to form a cylinder, as shown in the diagram. The ratio of their curved surface areas is:', 1, 'Mensuration', 'MCQ', 2, '0c9771__ICSE_X_Mat_p2_img_0_jpeg.webp', array['1:1', '11:7', '7:11', '2:3']::text[]),
  ('MQ-0c9771-1-14', '0c9771', 13, '1', '(xv) If r, 8, 16, q are in continued proportion, then the value of q + r is', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['26', '66', '36', '48']::text[]),
  ('MQ-0c9771-2-0', '0c9771', 14, '2', '(a) While factorizing a polynomial, a student finds that x - 1 is a factor of x³ + x² - 4x - 4. Is the student Correct? Give reason. Also, factorize the given polynomial completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-0c9771-2-1', '0c9771', 15, '2', '(b) A and B are two points on the x-axis and y-axis respectively.

(i) Write the coordinates of A and B.

(ii) P is a point on AB such that AP:PB 3:1. Using section formula, find coordinates of point P

(iii) find coordinates of centroid of triangle OAB.

(iv) find equation of a line passing through P and perpendicular to AB. [4]', 4, 'Coordinate Geometry', 'long', 2, '0c9771__ICSE_X_Mat_p2_img_3_jpeg.webp', NULL),
  ('MQ-0c9771-2-2', '0c9771', 16, '2', '(c) In the given figure TP and TQ are two tangents to the circle with centre O, touching at A and C respectively. [4]

If ∠BCQ = 55° and ∠BAP = 60°, find:

(i) ∠OBA and ∠OBC

(ii) ∠AOC

(iii) ∠ATC

[4]', 4, 'Circles', 'long', 2, '0c9771__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-0c9771-3-0', '0c9771', 17, '3', '(a) In an arithmetic progression the fourth and sixth terms are 8 and 14 respectively. Find the:
(i) first term (ii) common difference (iii) sum of first 20 terms. [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-0c9771-3-1', '0c9771', 18, '3', '(b) A circus tent is cylindrical to a height of 4 m and conical above it. If its diameter is 105 m and its slant height is 80 m, calculate the total area of canvas required. Also, find the total cost of canvas used at ₹ 15 per meter if the width is 1.5 m. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-0c9771-3-2', '0c9771', 19, '3', '(c) Use graph paper for this question. (Take 2 cm=1 unit along both x and y axis)

Plot the points O(0, 0), A(-4,4), B(-3,0) and C(0,-3)

i. Reflect points A and B on y-axis and name them A'' and B'' respectively. Write their coordinates.
ii. Name the figure OABCB''A''.
iii. State a point which is invariant under the reflection in the y axis.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-0c9771-4-0', '0c9771', 20, '4', '(a) A man invests ₹ 4500 in shares of a company which is paying 7.5% dividend. If ₹ 100 shares are available at a discount of 10%, find (i) number of shares (ii) his dividend. [3]', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-0c9771-4-1', '0c9771', 21, '4', '(b) Solve the following inequation and write down the solution set. Represent it on the number line. [3]

$$-3 + x \leq \frac{8}{3}x + 2 \leq \frac{14}{3} + 2x, x \in R$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-0c9771-4-2', '0c9771', 22, '4', '(c) Calculate the mean marks of the distribution by short-cut method. [4]

| Class interval | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 20 | 10 | 10 | 9 | 6 | 12 | 8 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-0c9771-5-0', '0c9771', 23, '5', '(a) In the given diagram ΔADB and ΔACB are two right angled triangles with ∠ADB = ∠BCA = 90°. If AB = 10 cm, AD = 6 cm, BC = 2.4 cm and DP = 4.5 cm [3]

i. Prove that ΔAPD ~ ΔBPC

ii. Find the length of BD and PB [3]', 3, 'Similarity', 'short', 3, '0c9771__ICSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-0c9771-5-1', '0c9771', 24, '5', '(b) Rekha opened a recurring deposit account for 20 months. The rate of interest is 9% per annum and she receives ₹ 441 as interest at the time of maturity. Find the amount she deposited each month. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-0c9771-5-2', '0c9771', 25, '5', '(c) Prove the following trigonometry identity: $$\left(\frac{1-\tan\theta}{1-\cot\theta}\right)^2 + 1 = \sec^2\theta$$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-0c9771-6-0', '0c9771', 26, '6', '(a) Find equation of a line passing through the point (2, -1) and parallel to the line 6x + 10y + 7 = 0 [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-0c9771-6-1', '0c9771', 27, '6', '(b) In the given diagram, an isosceles DABC is inscribed in a circle with centre O. PQ is a tangent to the circle at C. OM is perpendicular to chord AC and ∠COM = 65°. Find: (i) ∠ABC (ii) ∠BAC (iii) ∠BCQ [3]', 3, 'Circles', 'short', 3, '0c9771__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-0c9771-6-2', '0c9771', 28, '6', '(c)The following bill shows the GST rate and the marked price of articles:

| Rajdhani Departmental Store | | | | |
| --- | --- | --- | --- | --- |
| | Item | Marked Price | Discount | Rate of GST |
| (a) | Dry fruits (1 kg) | ₹1200 | ₹100 | 12% |
| (b) | Packed Wheat flour (5kg) | ₹286 | Nil | 5% |
| (c) | Bakery products | ₹500 | 10% | 12% |

Find the total amount to be paid (including GST) for the above bill.

[4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-0c9771-7-0', '0c9771', 29, '7', '(a) The marks obtained by 120 students in an English test are given below.

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw the ogive and hence estimate:

(i) the median marks
(ii) the no of students who did not pass the test if the pass percentage was 50
(iii) the upper quartile marks. [6]', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-0c9771-7-1', '0c9771', 30, '7', '(b) From the top of a tower 100 m high a man observes the angle of depression of two ships A and B, on opposite sides of the tower as 45° and 38° respectively. If the foot of the tower and the ships are in the same horizontal line find the distance between two ships A and B to the nearest metre. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-0c9771-8-0', '0c9771', 31, '8', '(a) Cards marked with numbers 1, 2, 3... 20 are well shuffled and a card is drawn at random. What is the probability that the number on the card is: (i) A prime number, (ii) A number divisible by 3, (iii)A perfect square? [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-0c9771-8-1', '0c9771', 32, '8', '(b) Using properties of proportion, find \( x \): \( \frac{\sqrt{5x} + \sqrt{2x - 6}}{\sqrt{5x} - \sqrt{2x - 6}} = 4 \) [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-0c9771-8-2', '0c9771', 33, '8', '(c) Using ruler and compass construct a triangle ABC in which \( \mathrm{AB} = 6\mathrm{cm} \), \( \angle BAC = 120^{\circ} \) and \( AC = 5\mathrm{cm} \). Construct a circle passing through A, B and C. Measure and write down the radius of the circle. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-0c9771-9-0', '0c9771', 34, '9', '(a) In a GP the first term is 24 and fifth term is 8. Find the \(9^{\text{th}}\) term of the G.P. [3]', 3, 'Geometric Progression', 'short', 4, NULL, NULL),
  ('MQ-0c9771-9-1', '0c9771', 35, '9', '(b) Solve the following quadratic equation and give the answer correct to two decimal places: \( 4x^{2} - 5x - 3 = 0 \). [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-0c9771-9-2', '0c9771', 36, '9', '(c)Given \(\left[ \begin{array}{cc}4 & 2\\ 1 & -1 \end{array} \right]\) . \(M = 6\) I. State the order of matrix M. Also find the matrix M. [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-0c9771-10-0', '0c9771', 37, '10', '(a) A solid sphere of radius \(15\mathrm{cm}\) is melted and recast into solid right circular cones of radius \(2.5\mathrm{cm}\) and height \(8\mathrm{cm}\). Calculate the number of cones recast. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-0c9771-10-1', '0c9771', 38, '10', '(b) Solve for \( x \) and \( y \): \( [x + y - x - 4] \left[ \begin{array}{cc} -1 & -2 \\ 2 & 2 \end{array} \right] = [-7 - 11] \) [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-0c9771-10-2', '0c9771', 39, '10', '(c) A shopkeeper purchases a certain number of books for ₹ 960. If the cost per book was ₹ 8 less, the number of books that can be purchased for ₹ 960 would be 4 more. Write an equation, taking the original cost of each book to be ₹x, and solve it. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-4ecffb-1-0', '4ecffb', 0, '1', 'i) Salman has some shares of Rs.50 of a company paying 15% dividend. If his annual income is Rs.3000, then the number of shares he possesses is ,', 1, 'Shares and Dividends', 'MCQ', 1, NULL, array['80', '400', '600', '800']::text[]),
  ('MQ-4ecffb-1-1', '4ecffb', 1, '1', 'ii) The greatest integer which is such that if 7 is added to its double, the resulting number becomes greater than three times the integer is,', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['4', '5', '6', '7']::text[]),
  ('MQ-4ecffb-1-2', '4ecffb', 2, '1', 'iii) **Statement 1 :** The quadratic equation $2x^2 - \sqrt{5}x + 1 = 0$ has no real roots.
**Statement 2 :** The quadratic equation $2x^2 + 3x + 1 = 0$ has equal roots.
**Which of the following is valid ?**', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['Both the statements are true.', 'Both the statements are false.', 'Statement 1 is true but Statement 2 is false', 'Statement 1 is false but Statement 2 is true.']::text[]),
  ('MQ-4ecffb-1-3', '4ecffb', 3, '1', 'iv) If the polynomial $x^3 + ax^2 + bx + 6$ leaves the same remainders when divided by $(x - 1)$ and $(x+2)$ , then the relation between a and b is,', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$a - b - 3 = 0$', '$a + b - 3 = 0$', '$a + b + 3 = 0$', '$a - b + 3 = 0$ .']::text[]),
  ('MQ-4ecffb-1-4', '4ecffb', 4, '1', 'v) If $a : b = 9 : 10$ , then the value of $\frac{2a^2 - 3b^2}{2a^2 + 3b^2}$ is,', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['$-\frac{23}{77}$', '$\frac{23}{77}$', '$\frac{24}{99}$', '$-\frac{24}{99}$']::text[]),
  ('MQ-4ecffb-1-5', '4ecffb', 5, '1', 'vi) If $\begin{bmatrix} x & 3x \\ y & 4y \end{bmatrix} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 5 \\ 12 \end{bmatrix}$ , then the value of x is ,', 1, 'Matrices', 'MCQ', 1, NULL, array['$x = 2, y = 3$', '$x = -2, y = 3$', '$x = 1, y = 2$', '$x = 1, y = -2$']::text[]),
  ('MQ-4ecffb-1-6', '4ecffb', 6, '1', 'vii) In G.P., the sum of the first n terms is 364, the first term is 1 and the common ratio is 3. The value of n is,', 1, 'Geometric Progression', 'MCQ', 2, NULL, array['4', '5', '6', '8']::text[]),
  ('MQ-4ecffb-1-7', '4ecffb', 7, '1', 'viii) In the following figure, MN IQR, if PN= 3.6 cm, NR = 2.4 cm and PQ=5 cm, then PM is.', 1, 'Similarity', 'MCQ', 2, NULL, array['4 cm', '3.6 cm', '2 cm', '3 cm']::text[]),
  ('MQ-4ecffb-1-8', '4ecffb', 8, '1', 'ix) The co-ordinates of the image of the point A(-3, 4), when reflected in the line x = 2, followed by reflection in the line y = 1 is,', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(6, -2)', '(6, -1)', '(7, -1)', '(7, -2)']::text[]),
  ('MQ-4ecffb-1-9', '4ecffb', 9, '1', 'x) The slope of a line perpendicular to the line 3x = 4y + 11 is,', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$\frac{3}{4}$', '$-\frac{3}{4}$', '$\frac{4}{3}$', '$-\frac{4}{3}$']::text[]),
  ('MQ-4ecffb-1-10', '4ecffb', 10, '1', 'xi) In the following figure, PQ and PR are tangents from P to a circle with centre O. If $\angle POR=55^\circ$, then $\angle QPR$ is,', 1, 'Circles', 'MCQ', 2, '4ecffb__ICSE_X_Mat_p2_img_1_jpeg.webp', array['$35^\circ$', '$55^\circ$', '$70^\circ$', '$80^\circ$']::text[]),
  ('MQ-4ecffb-1-11', '4ecffb', 11, '1', 'xii) The number of balls of radius 1cm that can be made from a sphere of radius 10 cm is,', 1, 'Mensuration', 'MCQ', 2, NULL, array['100', '1000', '10000', '100000']::text[]),
  ('MQ-4ecffb-1-12', '4ecffb', 12, '1', 'xiii) The sum of money required to buy 50, Rs. 40 shares at Rs. 38.50 is :', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['Rs. 1920', 'Rs. 1924', 'Rs. 1925', 'Rs. 1952']::text[]),
  ('MQ-4ecffb-1-13', '4ecffb', 13, '1', 'xiv) Given that the sum of the squares of the first seven natural numbers is 140, then their mean is :', 1, NULL, 'MCQ', 2, NULL, array['20', '70', '280', '980']::text[]),
  ('MQ-4ecffb-1-14', '4ecffb', 14, '1', 'xv) $A = [3 - 2]$ and $B = \begin{bmatrix} -1 & 4 \\ 2 & 0 \end{bmatrix}$

**Assertion (A)** : Product AB of the two matrices A and B is possible.

**Reason (R)** : Number of columns of matrix A is equal to number of rows in matrix B.

a) A is true, R is false

c) Both A and R are true and R is the correct reason for A

b) A is false, R is true

d) Both A and R are true and R is the incorrect reason for A.', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-4ecffb-2-0', '4ecffb', 15, '2', 'i) For the following frequency distribution, draw a histogram. Hence, calculate the mode.

[4]

| Class | 0 - 5 | 5 - 10 | 10 - 15 | 15 - 20 | 20 - 25 | 25 - 30 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 7 | 18 | 10 | 8 | 5 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-4ecffb-2-1', '4ecffb', 16, '2', 'ii) Beena has a cumulative deposit account of Rs. 400 per month at 10% per annum simple interest. If

 
The gets Rs. 30100 at the time of maturity, find the total time for which the account was held.

[4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-4ecffb-2-2', '4ecffb', 17, '2', 'iii) In the following figure, PQ is a tangent to the circle at A. AB and AD are bisectors of ∠CAQ and ∠PAC respectively. If ∠BAQ=30°, prove that a) BD is the diameter of the circle. ii) ABC is an isosceles triangle.', NULL, 'Circles', 'short', 3, '4ecffb__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-4ecffb-3-0', '4ecffb', 18, '3', 'i) From a solid cylinder of height 30cm and radius 7cm, a conical cavity of height 24 cm and of base radius 7cm is drilled out. Find the volume and the total surface area of the remaining solid.

[4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-4ecffb-3-1', '4ecffb', 19, '3', 'ii) Construct a ΔABC, given that AB = 4.5 cm, BC = 7 cm and median AD = 4 cm. Construct inscribed circle of ΔABC and measure its radius.

[4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-4ecffb-3-2', '4ecffb', 20, '3', 'iii) For this question, use a graph paper. Scale: 1cm = 1unit along both x and y-axis.)

[5]

Plot points A ( 0,3 ), B ( 4,0 ), C ( 6,2 ) and D ( 5,0 ).

Reflect the points as given below and write their coordinates:

(a) Reflect A on x-axis to A''.

(b) Reflect B on y- axis to B''.

(c) Reflect C on x-axis to C''.

(d) D remain invariant when reflected on the line whose equation is

(e) Join the points A,B,C,D,C'',B,A'', B'' and A to form a closed figure. Name the closed figure BCDC''.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-4ecffb-4-0', '4ecffb', 21, '4', 'i) In the following figure, PAB is a secant and PT a tangent to the circle with centre O. If ∠ATP= 40°, PA = 9 cm and AB = 7 cm. Find a) ∠APT b) length of PT.', NULL, 'Circles', 'short', 3, '4ecffb__ICSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-4ecffb-4-1', '4ecffb', 22, '4', 'ii) Two different dice are thrown simultaneously. What is the probability that the sum of two numbers appearing on the top of dice is : i) 8 ii) 10 iii) atleast 10 ? [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-4ecffb-4-2', '4ecffb', 23, '4', 'iii) If A = [3/0 -1/2], find matrix B such that A² - 2B = 3A + 5I, where I is a 2 X 2 matrix. [4]', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-4ecffb-5-0', '4ecffb', 24, '5', 'i) The deer population is increasing in a national park. In year 2020 it was 1000, since then it has been increasing and it becomes 2 times every year. Find the population in 2025. [3]', 3, 'Geometric Progression', 'short', 3, NULL, NULL),
  ('MQ-4ecffb-5-1', '4ecffb', 25, '5', 'ii) A shopkeeper bought an article with market price Rs. 1200 from the wholesaler at a discount of \(10\%\). The shopkeeper sells this article to the customer on the market price printed on it. If the rate of GST is \(6\%\), then find: a) GST paid by the wholesaler. b) Amount paid by the customer to buy the item. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-4ecffb-5-2', '4ecffb', 26, '5', 'iii) A drone camera is used to shoot an object P from two different positions R and S along the same vertical line QRS. The angle of depression of the object P from these two positions are \(35^{\circ}\) and \(60^{\circ}\) respectively as shown in the diagram. If the distance of the object P from point Q is 50 metres, then find the distance between R and S correct to the nearest metre. [4]', 4, 'Trigonometry', 'long', 4, '4ecffb__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-4ecffb-6-0', '4ecffb', 27, '6', 'i) Using properties of proportion, solve for \( x \). Given that \( x \) is positive: \( \frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4 \) [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-4ecffb-6-1', '4ecffb', 28, '6', 'ii) If \( \mathrm{P}(9\mathrm{a} - 2, - \mathrm{b}) \) divides the line segment joining A(3a + 1, -3) and B(8a, 5) in the ratio 3:1, find the values of a and b. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4ecffb-6-2', '4ecffb', 29, '6', 'iii) A cylindrical flagpole \(4.9\mathrm{m}\) high and \(3.5\mathrm{cm}\) in radius is surmounted on either side by a cone \(0.60\mathrm{m}\) high. Find the volume and surface area of the pole. [4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-4ecffb-7-0', '4ecffb', 30, '7', 'i) Find the equation of a line passing through the points (2,-3) and (3,2). Show that point (4, 7) lies on the line. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4ecffb-7-1', '4ecffb', 31, '7', 'ii) Prove that: \(\frac{\cos A}{1 - \tan A} +\frac{\sin A}{1 - \cot A} = \cos A + \sin A\) [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4ecffb-7-2', '4ecffb', 32, '7', 'iii) Rohan and his younger sister, Priya are enjoying a sunny afternoon in their backyard. Rohan, who is taller, notices that both he and Priya cast distinct shadows on the ground. He wonders if he can use this observation to understand something about their heights without directly measuring them by using the properties of similar triangles. [4]

Based on above information answer the following questions.

 
a) Rohan''s height is 1.8 metres and his shadow length is 2.7 metres. If Priya''s shadow length is 1.5 metres, then find Priya''s height.
b) If a flagpole casts a shadow of 12 metres at the same time Rohan measured his shadow, what would be the approximate height of the flagpole ?', 4, 'Similarity', 'long', 4, '4ecffb__ICSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-4ecffb-8-0', '4ecffb', 33, '8', 'i) The following bill shows the GST rate and the marked price of articles : [4]

| Rajdhani Departmental Store | | | | |
| --- | --- | --- | --- | --- |
| S. No. | Item | Marked price | Discount | Rate of GST |
| a) | Dry fruits (1 kg) | Rs. 1200 | Rs. 100 | 12 % |
| b) | Packed wheat flour(5 kg) | Rs. 286 | No | 5 % |
| c) | Bakery products | Rs. 500 | 10 % | 12 % |

Find the total amount to be paid (including GST ) for the above bill.', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-4ecffb-8-1', '4ecffb', 34, '8', 'ii) If x, y and z are in continued propotion , prove that [3]

$$\frac{x}{y^2 z^2} + \frac{y}{z^2 x^2} + \frac{z}{x^2 y^2} = \frac{1}{x^3} + \frac{1}{y^3} + \frac{1}{z^3}$$', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-4ecffb-8-2', '4ecffb', 35, '8', 'iii) A man buys 250, ten rupee shares each at Rs. 12.50. If the rate of dividend is 7 % , find the : a) Dividend he receives annually . b) percentage return on his investment. [3]', 3, 'Shares and Dividends', 'short', 5, NULL, NULL),
  ('MQ-4ecffb-9-0', '4ecffb', 36, '9', 'i) In the adjoining figure, PQR is a triangle. S is a point on the side QR such that $\angle PSR = \angle QPR$ . Given $QP = 8$ cm, $PR = 6$ cm and $SR = 3$ cm.

a) Prove that $\Delta PQR - \Delta SPR$ . b) Find the length of QR and PS. [3]', 3, 'Similarity', 'short', 5, '4ecffb__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-4ecffb-9-1', '4ecffb', 37, '9', 'ii) Find mean for the following frequency distribution : [3]

| Class | 0 - 15 | 15 - 30 | 30 - 45 | 45 - 60 | 60 - 75 | 75 - 90 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 3 | 4 | 7 | 6 | 8 | 2 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-4ecffb-9-2', '4ecffb', 38, '9', 'iii) Find the coordinates of the centroid P of the $\Delta ABC$ , whose vertices are $A(-1, 3)$ , $B(3, -1)$ and $C(0, 0)$ . Hence , find the equation of a line passing through P and parallel to AB [4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-4ecffb-10-0', '4ecffb', 39, '10', 'i) (Use a ruler and a compass for this question.)

(a) Construct a triangle ABC such that BC = 8cm, AC = 10 cm and ∠ABC = 90°.
(b) Construct an incircle to this triangle. Mark the centre as I.
(c) Measure and write the length of the in-radius.
(d) Measure and write the length of the tangents from vertex C to the incircle.
(e) Mark points P, Q and R where the incircle touches the sides AB, BC and AC of the triangle respectively. Write the relationship between ∠RIQ and ∠QCR.', NULL, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-4ecffb-10-1', '4ecffb', 40, '10', 'ii) Solve the given inequation,

$$\frac{11+3x}{5} \ge 3 - x > \frac{-3}{2}, x \in R$$

(a) Write the solution set.

(b) Represent the solution on the number line.', NULL, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-da958f-1-0', 'da958f', 0, '1', '(i) (x - 2) and (x + 2) are the factors of x³ + x² - 4x - 4. The third factor of the given polynomial is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['\((x - 1)\)', '\((x - 4)\)', '\((x + 1)\)', '\((x + 4)\)']::text[]),
  ('MQ-da958f-1-1', 'da958f', 1, '1', '(iii) In the figure given below, AC is a diameter of the circle.
AP = 3 cm and PB = 4 cm and QP ⊥ AB.
If the area of ΔAPQ is 18 cm², then the area of shaded portion QPBC is:', 1, 'Mensuration', 'MCQ', 3, 'da958f__ICSE_X_Mat_p3_img_0_jpeg.webp', array['\(32\mathrm{cm}^2\)', '\(49\mathrm{cm}^2\)', '\(80~\mathrm{cm}^2\)', '\(98~\mathrm{cm}^2\)']::text[]),
  ('MQ-da958f-1-2', 'da958f', 2, '1', '(ii) Radha deposited ₹400 per month in a recurring deposit account for 18 months.
The qualifying sum of money for the calculation of interest is:', 1, 'GST and Banking', 'MCQ', 4, NULL, array['₹ 3,600', '₹ 7,200', '₹ 68,400', '₹ 1,36,800']::text[]),
  ('MQ-da958f-1-3', 'da958f', 3, '1', '(iv) In the given diagram, the radius of the circle with centre O is 3 cm. PA and PB are the tangents to the circle which are at right angle to each other. The length of OP is:', 1, 'Circles', 'MCQ', 4, 'da958f__ICSE_X_Mat_p4_img_0_jpeg.webp', array['\(\frac{3}{\sqrt{2}} cm\)', '\(3cm\)', '\(3\sqrt{2} cm\)', '\(6\sqrt{2} cm\)']::text[]),
  ('MQ-da958f-1-4', 'da958f', 4, '1', '(v) Assertion (A): If secθ + tanθ = a and secθ - tanθ = b then ab = 1
Reason (R): sec²θ - tan²θ = 1', 1, 'Trigonometry', 'MCQ', 4, NULL, array['(A) is true and (R) is false.', '(A) is false and (R) is true.', 'Both (A) and (R) are true and (R) is the correct explanation of (A).', 'Both (A) and (R) are true, but (R) is not the correct explanation of (A).']::text[]),
  ('MQ-da958f-1-5', 'da958f', 5, '1', '(vi) A solid sphere is cut into two identical hemispheres.
Assertion (A): The total volume of two hemispheres is equal to the volume of the original sphere.
Reason (R): The total surface area of two hemispheres together is equal to the surface area of the original sphere.', 1, 'Mensuration', 'MCQ', 5, NULL, array['(A) is true, (R) is false.', '(A) is false, (R) is true. [Analysis]', 'Both (A) and (R) are true and (R) is the correct explanation of (A).', 'Both (A) and (R) are true, but (R) is not the correct explanation of (A).']::text[]),
  ('MQ-da958f-1-6', 'da958f', 6, '1', '(vii) Given that the sum of the squares of the first seven natural numbers is 140, then their mean is:', 1, NULL, 'MCQ', 5, NULL, array['20', '70', '280', '980']::text[]),
  ('MQ-da958f-1-7', 'da958f', 7, '1', '(viii) A bag contains 3 red and 2 blue marbles. A marble is drawn at random. The probability of drawing a black marble is:', 1, 'Probability', 'MCQ', 5, NULL, array['0', '\(\frac{1}{5}\)', '\(\frac{2}{5}\)', '\(\frac{3}{5}\)']::text[]),
  ('MQ-da958f-1-8', 'da958f', 8, '1', '(ix) If matrix A=[-1 2] and matrix B=[3/4], then matrix AB is equal to:', 1, 'Matrices', 'MCQ', 5, NULL, array['\([-3]\)', '[8]', '[5]', '\(\left[ \begin{array}{ll} - 1 & 2\\ 3 & 4 \end{array} \right]\)']::text[]),
  ('MQ-da958f-1-9', 'da958f', 9, '1', '(x) A mixture of paint is prepared by mixing 2 parts of red pigments with 5 parts of the base. Using the given information in the following table, find the values of a, b & c to get the required mixture of paint.
| Parts of red pigment | 2 | 4 | b | 6 |
| --- | --- | --- | --- | --- |
| Parts of base | 5 | a | 12.5 | c |', 1, 'Ratio and Proportion', 'MCQ', 6, NULL, array['\(a = 10, b = 10, c = 10\)', '\(a = 5, b = 2, c = 5\)', '\(a = 10, b = 5, c = 10\)', '\(a = 10, b = 5, c = 15\)']::text[]),
  ('MQ-da958f-1-10', 'da958f', 10, '1', '(xi) An article which is marked at ₹ 1,200 is available at a discount of 20% and the rate of GST is 18%. The amount of SGST is:', 1, 'GST and Banking', 'MCQ', 6, NULL, array['216.00', '172.80', '108.00', '86.40']::text[]),
  ('MQ-da958f-1-11', 'da958f', 11, '1', '(xii) The sum of money required to buy 50, ₹ 40 shares at ₹ 38.50 is:', 1, 'Shares and Dividends', 'MCQ', 6, NULL, array['1,920', '1,924', '1,925', '1,952']::text[]),
  ('MQ-da958f-1-12', 'da958f', 12, '1', '(xiii) The roots of quadratic equation $$x^2 - 1 = 0$$ are:', 1, 'Quadratic Equations', 'MCQ', 6, NULL, array['0,0', '1,1', '-1,-1', '\(+1, - 1\)']::text[]),
  ('MQ-da958f-1-13', 'da958f', 13, '1', '(xiv) Which of the following equations represents a line equally inclined to the axes?', 1, 'Coordinate Geometry', 'MCQ', 7, NULL, array['\(2x - 3y + 7 = 0\)', '\(x - y = 7\)', '\(x = 7\)', '\(y = -7\)']::text[]),
  ('MQ-da958f-1-14', 'da958f', 14, '1', '(xv) Given, $$x + 2 \leq \frac{x}{3} + 3$$ and $$x$$ is a prime number. The solution set for $$x$$ is:', 1, 'Linear Inequations', 'MCQ', 7, NULL, array['\(\varnothing\)', '\(\{0\}\)', '\(\{1\}\)', '\(\{0,1\}\)']::text[]),
  ('MQ-da958f-2-0', 'da958f', 15, '2', '(i) While factorizing a given polynomial, using remainder & factor theorem, a student finds that $$(2x + 1)$$ is a factor of $$2x^3 + 7x^2 + 2x - 3$$. [4]

(a) Is the student''s solution correct stating that \((2x + 1)\) is a factor of the given polynomial?
(b) Give a valid reason for your answer. Also, factorize the given polynomial completely.

[Analysis &

Application]', 4, 'Factorisation and Remainder Theorem', 'long', 7, NULL, NULL),
  ('MQ-da958f-2-1', 'da958f', 16, '2', '(ii) P is a point on the x- axis which divides the line joining A (- 6, 2) and B (9, - 4). Find: [4]

(a) the ratio in which P divides the line segment AB.
(b) the coordinates of the point \(\mathbf{P}\)
(c) equation of a line parallel to AB and passing through \((-3, -2)\).

[Analysis &

Evaluation]', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-da958f-2-2', 'da958f', 17, '2', '(iii) In the given figure, AC is the diameter of the circle with centre O. [4]

CD is parallel to BE.

∠AOB = 80° and ∠ACE = 20°.

[Analysis & Evaluation]

Calculate:

(a) ∠BEC
(b) ∠BCD
(c) ∠CED', 4, 'Circles', 'long', 8, 'da958f__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-da958f-3-0', 'da958f', 18, '3', '(i) -11, -7, -3, ..., 49, 53 are the terms of a progression. [4]

Answer the following:

(a) What is the type of progression?
(b) How many terms are there in all?
(c) Calculate the value of middle most term.

[Analysis & Evaluation]', 4, 'Arithmetic Progression', 'long', 8, NULL, NULL),
  ('MQ-da958f-3-1', 'da958f', 19, '3', '(ii) In the diagram given below, a tilted right circular cylindrical vessel with base diameter 7 cm contains a liquid. When placed vertically, the height of the liquid in the vessel is the mean of two heights shown in the diagram. Find the area of wet surface, when the cylinder is placed vertically on a horizontal surface. [4]

(Use π = 22/7).

[Application & Evaluation]', 4, 'Mensuration', 'long', 9, 'da958f__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-da958f-3-2', 'da958f', 20, '3', '(iii) Use a ruler and compass to answer this question. [5]

(a) Construct a circle of radius \(4.5\mathrm{cm}\) and draw a chord AB of length \(6.5\mathrm{cm}\).
(b) At A, construct \(\angle CAB = 75^{\circ}\), where C lies on the circumference of the circle.
(c) Construct the locus of all points equidistant from A and B.
(d) Construct the locus of all points equidistant from CA and BA.
(e) Mark the point of intersection of the two loci as P. Measure and write down the length of CP.

[Analysis & Understanding]', 5, 'Constructions', 'long', 9, NULL, NULL),
  ('MQ-da958f-4-0', 'da958f', 21, '4', '(i) Ms. Kaur invested ₹ 8,000 in buying ₹100 shares of a company paying 6% dividend at ₹ 80. After a year, she sold these shares at ₹75 each and invested the proceeds including the dividend received during the first year in buying ₹ 20 shares, paying 15% dividend at ₹ 27 each. Find the: [3]

(a) dividend received by her during the first year.
(b) number of shares purchased by her using the total proceeds.

Application & Evaluation]', 3, 'Shares and Dividends', 'short', 9, NULL, NULL),
  ('MQ-da958f-4-1', 'da958f', 22, '4', '(ii) Solve the following inequation, write the solution set, and represent it on the real number line. [3]

$$5x - 21 < \frac{5x}{7} - 6 \leq -3\frac{3}{7} + x, x \in \mathbb{R}.$$

[Evaluation]', 3, 'Linear Inequations', 'short', 10, NULL, NULL),
  ('MQ-da958f-4-2', 'da958f', 23, '4', '(iii) Prove the following trigonometry identity: [4]

$$(\sin\theta + \cos\theta)(\cosec\theta - \sec\theta) = \cosec\theta.\sec\theta - 2\tan\theta$$

[Application &

Analysis]', 4, 'Trigonometry', 'long', 10, NULL, NULL),
  ('MQ-da958f-5-0', 'da958f', 24, '5', '(i) In the given figure (not drawn to scale) chords AD and BC intersect at P, where AB = 9 cm, PB = 3 cm and PD = 2 cm. [3]

(a) Prove that \(\Delta APB\sim \Delta CPD\)
(b) Find the length of CD.
(c) Find area \(\Delta APB\) : area \(\Delta CPD\)

[Application &

Evaluation]', 3, 'Similarity', 'short', 10, 'da958f__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-da958f-5-1', 'da958f', 25, '5', '(ii) Mr. Sam has a recurring deposit account and deposits ₹ 600 per month for [3]

2 years. If he gets ₹ 15,600 at the time of maturity, find the rate of interest [Application &

earned by him. Evaluation]', 3, 'GST and Banking', 'short', 10, NULL, NULL),
  ('MQ-da958f-5-2', 'da958f', 26, '5', '(iii) Using step-deviation method, find mean for the following frequency distribution: [4]

| Class | 0 – 15 | 15 – 30 | 30 – 45 | 45 – 60 | 60 – 75 | 75 – 90 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 3 | 4 | 7 | 6 | 8 | 2 |

[Application & Evaluation]', 4, 'Statistics', 'long', 11, NULL, NULL),
  ('MQ-da958f-6-0', 'da958f', 27, '6', '(i) Find the coordinates of the centroid P of the \(\Delta ABC\), whose vertices are A(-1, 3), B(3, -1) and C(0, 0). Hence, find the equation of a line passing through P and parallel to AB.', NULL, 'Coordinate Geometry', 'short', 11, NULL, NULL),
  ('MQ-da958f-6-1', 'da958f', 28, '6', '(ii) In the given figure, the parallelogram ABCD circumscribe a circle, touching circle at P, Q, R and S. [3]

(a) Prove that: \(\mathrm{AB} = \mathrm{BC}\)
(b) What special name can be given to the parallelogram ABCD?', 3, 'Circles', 'short', 11, 'da958f__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-da958f-6-2', 'da958f', 29, '6', '(iii) The following bill shows the GST rate and the marked price of articles: [4]

| Rajdhani Departmental Store | | | | |
| --- | --- | --- | --- | --- |
| S. No. | Item | Marked Price | Discount | Rate of GST |
| (a) | Dry fruits (1 kg) | ₹ 1200 | ₹100 | 12% |
| (b) | Packed Wheat flour (5kg) | ₹ 286 | Nil | 5% |
| (c) | Bakery products | ₹ 500 | 10% | 12% |

Find the total amount to be paid (including GST) for the above bill.

[Analysis & Application]

[Application & Evaluation]', 4, 'GST and Banking', 'long', 11, NULL, NULL),
  ('MQ-da958f-7-0', 'da958f', 30, '7', '(i) Draw the necessary diagram for this question. [5]

A man on the top of a lighthouse observes the angle of depression of two ships on the opposite sides of the lighthouse as 30° and 50° respectively. If the height of the lighthouse is 80m, find the distance between the two ships.

Give your answer correct to the nearest meter.

(Use Mathematical Tables for this Question)

[Understanding,

Application &

Evaluation]', 5, 'Trigonometry', 'long', 12, NULL, NULL),
  ('MQ-da958f-7-1', 'da958f', 31, '7', '(ii) The marks of 200 students in a test were recorded as follows: [5]

| Marks % | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 7 | 11 | 20 | 40 | 52 | 36 | 15 | 9 | 5 |

Using a graph sheet draw ogive for the given data and use it to find the:

(a) median.
[Application,
(b) number of students who obtained more than \(65\%\) marks.
Analysis &
(c) number of students who did not pass, if the pass percentage was 35. Evaluation]', 5, 'Statistics', 'long', 12, NULL, NULL),
  ('MQ-da958f-8-0', 'da958f', 32, '8', '(i) A box containing cards numbered between 0 and 100 are shuffled and a card [3]

is picked at random. Find the probability of getting a card which is:

(a) divisible by 6.
[Application &
(b) not divisible by 6. Evaluation]', 3, 'Probability', 'short', 12, NULL, NULL),
  ('MQ-da958f-8-1', 'da958f', 33, '8', '(ii) If x, y and z are in continued proportion, prove that: [3]

$$\frac{x}{y^2.z^2} + \frac{y}{z^2.x^2} + \frac{z}{x^2.y^2} = \frac{1}{x^3} + \frac{1}{y^3} + \frac{1}{z^3}$$

[Application &

Analysis]', 3, 'Ratio and Proportion', 'short', 12, NULL, NULL),
  ('MQ-da958f-8-2', 'da958f', 34, '8', '(iii) A manufacturing company prepares spherical ball bearings, each of radius 7 mm and mass 4 gm. These ball bearings are packed into boxes. Each box can have a maximum of 2156 cm³ of ball bearings. Find the:

(a) maximum number of ball bearings that each box can have.
(b) mass of each box of ball bearings in kg.

(Use π = 22/7)

[Analysis,

Application &

Evaluation]', NULL, 'Mensuration', 'short', 13, NULL, NULL),
  ('MQ-da958f-9-0', 'da958f', 35, '9', '(i) Study the graph given below and answer the following:

(a) Number of batsmen who scored 500 to 700 runs
(b) Modal class interval
(c) The value of mode

[Analysis &

Evaluation]', NULL, 'Statistics', 'short', 13, 'da958f__ICSE_X_Mat_p13_img_0_jpeg.webp', NULL),
  ('MQ-da958f-9-1', 'da958f', 36, '9', '(ii) An Arithmetic Progression (A.P.) has 3 as its first term. The sum of the first [3]

8 terms is twice the sum of the first 5 terms. Find the common difference of the A.P.

[Analysis, Application & Evaluation]', 3, 'Arithmetic Progression', 'short', 14, NULL, NULL),
  ('MQ-da958f-9-2', 'da958f', 37, '9', '(iii) The roots of equation $(q - r)x^2 + (r - p)x + (p - q) = 0$ are equal. [4]

Prove that: $2q = p + r$, that is, $p, q$ & $r$ are in A.P.

[Application & Analysis]', 4, 'Quadratic Equations', 'long', 14, NULL, NULL),
  ('MQ-da958f-10-0', 'da958f', 38, '10', '(i) The sum of the squares of three consecutive even numbers is 596. Find the [3]

numbers. [Analysis, Application & Evaluation]', 3, 'Quadratic Equations', 'short', 14, NULL, NULL),
  ('MQ-da958f-10-1', 'da958f', 39, '10', '(ii) Given matrix, $X = \begin{bmatrix} 1 & 1 \\ 8 & 3 \end{bmatrix}$ and $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$, prove that $X^2 = 4X + 5I$. [3]

[Application & Evaluation]', 3, 'Matrices', 'short', 14, NULL, NULL),
  ('MQ-da958f-10-2', 'da958f', 40, '10', '(iii) Use a graph sheet for this question. Take 1 cm = 1 unit along both the $x$ and [4]

$y$ axis. Plot ABCDE, where A (4, 0), B (4, 2), C (2, 2), D (2,4) and E (0,4).

(a) Reflect the points A, B, C and D on the $y$-axis and name them as F, G, H and I respectively.

(b) Join the points A, B, C, D, E, I, H, G and F in order. Reflect the figure ABCDEIHGF on the $x$-axis and name it as AMNPQRSTF.

(c) Give the geometrical name of the closed figure AEFQ. [Understanding]', 4, 'Coordinate Geometry', 'long', 14, NULL, NULL),
  ('MQ-07eae7-1-0', '07eae7', 0, '1', '**1. The equation of the line passing through origin and parallel to the line $3x + 4y + 7 = 0$ is**', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$3x + 4y + 5 = 0$', '$4x - 3y - 5 = 0$', '$4x - 3y = 0$', '$3x + 4y = 0$']::text[]),
  ('MQ-07eae7-1-1', '07eae7', 1, '1', '**2. A man invested in a company paying 12% dividend on its share. If the percentage return on his investment is 10% then the shares are:-**', 1, 'Shares and Dividends', 'MCQ', 1, NULL, array['At Par', 'Below Par', 'Above Par', 'Cannot be determined']::text[]),
  ('MQ-07eae7-1-2', '07eae7', 2, '1', '**3. Assertion (A): If $\sin^2 A + \sin A = 1$ then $\cos^2 A + \cos^2 A = 1$**

**Reason (R) : 1- $\sin^2 A = \cos^2 A$**

a) (A) is true, (R) is false

**X-MATHEMATICS**

 

b) (A) is false, (R) is true
c) Both (A) and (R) are true, (R) is the correct reason for (A)
d) Both (A) and (R) are true, (R) is the incorrect reason for (A)', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-07eae7-1-3', '07eae7', 3, '1', '4. If the volume of two spheres is in the ratio 27:64 then the ratio of their radii is', 1, 'Mensuration', 'MCQ', 2, NULL, array['3:4', '4:3', '9:16', '16:9']::text[]),
  ('MQ-07eae7-1-4', '07eae7', 4, '1', '5. The marked price of an article is Rs 1375. If the CGST is charged at a rate of 4% then the price of the article including GST is', 1, 'GST and Banking', 'MCQ', 2, NULL, array['Rs 55', 'Rs 110', 'Rs 1430', 'Rs 1485']::text[]),
  ('MQ-07eae7-1-5', '07eae7', 5, '1', '6. The sum of first 16 terms of the AP 10, 6, 2, -2, ... is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-320', '320', '-350', '-300']::text[]),
  ('MQ-07eae7-1-6', '07eae7', 6, '1', '7. The 8th term of the G.P $\frac{3}{4}$, $\frac{3}{2}$, 3, ... is', 1, 'Geometric Progression', 'MCQ', 2, NULL, array['69', '54', '96', '49']::text[]),
  ('MQ-07eae7-1-7', '07eae7', 7, '1', '8. A(1,4), B(4,1) and C(x,4) are the vertices of $\Delta$ ABC.
If the centroid of the triangle is G(4, 3) then x is equal to', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['2', '1', '7', '4']::text[]),
  ('MQ-07eae7-1-8', '07eae7', 8, '1', '9. The sum invested to purchase 15 shares of a company of nominal value Rs75 available at a discount of 20%', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['Rs 60', 'Rs 90', 'Rs 1350', 'Rs 900']::text[]),
  ('MQ-07eae7-1-9', '07eae7', 9, '1', '10. In what ratio does the Y-axis divide the line segment joining the points P(-4.5) and Q (3.-7)', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['4.3', '3.4', '3.1', 'none of these']::text[]),
  ('MQ-07eae7-1-10', '07eae7', 10, '1', '11. Assertion(A):- If $\Delta ABC \sim \Delta DFF$ then $\frac{AB}{DF} = \frac{BC}{EF} = \frac{AC}{DF}$
Reason(R):- Both triangles have same shape and same size', 1, 'Similarity', 'MCQ', 3, NULL, array['A is true. R is false', 'Both A and R are true', 'A is false. R is true', 'Both A and R are false']::text[]),
  ('MQ-07eae7-1-11', '07eae7', 11, '1', '12. The lines represented by $4x + 3y = 9$ and $kx - 6y + 3 = 0$ are parallel. The value of K is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['$-\frac{2}{3}$', '$\frac{2}{3}$', '$2$ d) none of these']::text[]),
  ('MQ-07eae7-1-12', '07eae7', 12, '1', '13. The printed price of an article is Rs3080. If the rate of GST is 10% find GST charged is', 1, 'GST and Banking', 'MCQ', 3, NULL, array['Rs 154', 'Rs 308', 'Rs 30.80', 'Rs 15.40']::text[]),
  ('MQ-07eae7-1-13', '07eae7', 13, '1', '14. The sum of money required to buy 50. Rs 40 shares at Rs 38.50 is', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['Rs 1920', 'Rs 1924', 'Rs 1925', 'Rs1952']::text[]),
  ('MQ-07eae7-1-14', '07eae7', 14, '1', '15. A solid cone of radius 5cm and height 8cm is melted and made into small spheres of radius 0.5cm then how many spheres are formed.', 1, 'Mensuration', 'MCQ', 3, NULL, array['40', '400', '800', 'none of these']::text[]),
  ('MQ-07eae7-2-0', '07eae7', 15, '2', 'Q2. A man bought Rs 200 shares of a company at 25% premium. If he received a return of 5% on his investment. Find the

X-MATHEMATICS

3,, 
a) Market Value
b) Dividend percent declared.
c) Number of shares purchased if annual dividend is Rs 1000 [4]', 4, 'Shares and Dividends', 'long', 3, NULL, NULL),
  ('MQ-07eae7-2-1', '07eae7', 16, '2', 'ii. A bus covers a distance of 240km at a uniform speed. Due to heavy rain its speed gets reduced by 10km/h and as such it takes two hours longer to cover the total distance. Assuming the uniform speed to be x km/h from an equation and solve it to evaluate x. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-07eae7-2-2', '07eae7', 17, '2', 'iii. The fourth, the seventh term and the last term of a geometrical progression are 10, 80 and 2560 respectively. Find its

a) First term
b) Common ratio
c) Number of terms [4]', 4, 'Geometric Progression', 'long', 4, NULL, NULL),
  ('MQ-07eae7-3-0', '07eae7', 18, '3', 'Q3. i. On a map drawn to a scale of 1:40000 a rectangular plot of land ABCD has the following measurements: AB = 6cm and BC = 8cm. Calculate

a) The diagonal distance of the plot in km.
b) The area of the plot in sq.km [5]', 5, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-07eae7-3-1', '07eae7', 19, '3', 'ii. Find the equation of the line that is parallel to 2x + 5y - 7 = 0 and passes through the mid-point of the line segment joining the points (2, 7) and (-4, 1) [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-07eae7-3-2', '07eae7', 20, '3', 'iii. Prove that: - cos A / (1 - tan A) + sin A / (1 - cot A) = sin A + cos A [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-07eae7-4-0', '07eae7', 21, '4', 'Q4. i. In the given figure, AB and DE are perpendicular to BC [4]

 

a. Prove the $\Delta ABC \sim \Delta DEC$
b. AB=6cm, DE=4cm, AC=15cm find CD
c. Find the ratio of the area of $\Delta ABC$: area of $\Delta DEC$', 4, 'Similarity', 'long', 4, '07eae7__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-07eae7-4-1', '07eae7', 22, '4', 'ii. Rohan bought the following eatables from his friends.

| S.No | Item | Price | Quantity | Rate of GST |
| --- | --- | --- | --- | --- |
| 1 | Laddu | Rs 500 per kg | 2kg | 5% |
| 2 | Pastries | Rs 100 per piece | 12 pieces | 18% |

Find: a) Total GST paid

b) Total bill amount including GST [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-07eae7-4-2', '07eae7', 23, '4', 'iii. Mr Gupta invested Rs 33000 in buying Rs 100 shares of a company at 10% premium. The dividend declared by the company is 12%. Find:-

a) No. of shares purchased by him
b) His annual dividend [3]', 3, 'Shares and Dividends', 'short', 5, NULL, NULL),
  ('MQ-07eae7-5-0', '07eae7', 24, '5', 'Q5 i. In an arithmetic progression the 4th and 6th terms are 8 and 14 respectively. Find the

X-MATHEMATICS

 
a) First term
b) Common difference
c) Sum of the first 20 terms [4]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-07eae7-5-1', '07eae7', 25, '5', 'ii. Find the co-ordinates of the points of trisection of the line segment joining the point A(2,1) and B(5,-8). [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-07eae7-5-2', '07eae7', 26, '5', 'iii. A certain number of metallic cones each of radius 2cm and height 3cm are melted and recast into a solid sphere of radius 6cm. Find the number of cones. [3]', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-07eae7-6-0', '07eae7', 27, '6', 'Q6. i. Prove that $$\sqrt{\frac{1+\cos\theta}{1-\cos\theta}} = \text{cosec } \theta + \cot \theta$$ [3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-07eae7-6-1', '07eae7', 28, '6', 'ii. In the figure If PQ || BC.AP=3cm,BP=4cm,BC=5cm. Find [3]

a) AQ:QC

b) PQ', 3, 'Similarity', 'short', 6, '07eae7__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-07eae7-6-2', '07eae7', 29, '6', 'iii. Find the equation of a line parallel to the line $$2x + y - 7 = 0$$ and passing through the intersection of the', NULL, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-07eae7-7-0', '07eae7', 30, '7', 'Q7. i. The difference of two natural numbers is 7 and their product is 450. Find the numbers. [3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-07eae7-7-1', '07eae7', 31, '7', 'ii. Calculate the ratio in which the line joining A(-4,2), B(3,6) is divided by point P (x,3). Find:-

a) x

b) length of AP [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-07eae7-7-2', '07eae7', 32, '7', 'in The total surface area of a cylinder is 462cm². If its closed surface area is one-third of its surface area. Find the volume of the cylinder. [4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-07eae7-8-0', '07eae7', 33, '8', 'Q8. i A man buys 250, ten-rupee shares each at ₹12.50. If the rate of dividend is 7%. Find the

a) Dividend he receives annually
b) Percentage return on his investment [3]', 3, 'Shares and Dividends', 'short', 7, NULL, NULL),
  ('MQ-07eae7-8-1', '07eae7', 34, '8', 'ii. An A.P has 3 as its first term. The sum of the first 8 terms is twice the sum of the first 5 terms. Find the common difference of the A.P [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-07eae7-8-2', '07eae7', 35, '8', 'iii. Five years ago, a woman''s age was the square of her son''s age. Ten years hence her age will be twice that of her son''s age. Find

a) The age of the son five year ago
b) The present age of the woman [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-07eae7-9-0', '07eae7', 36, '9', 'Q9. i. The 2nd and 5th terms of a G.P are -1/2 and -1/16 respectively. Find the sum of the first 8 terms of the G.P. [3]', 3, 'Geometric Progression', 'short', 7, NULL, NULL),
  ('MQ-07eae7-9-1', '07eae7', 37, '9', 'ii. ABCD is a parallelogram where A (x,y) B (5,8) C (4,7) and D(2,-4). Find 

a) Co-ordinates of A
b) The equation of the diagonal BD [3]', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-07eae7-9-2', '07eae7', 38, '9', 'iii. A model of a ship is made to a scale of 1:250. Find

a) The length of the ship, if the length of the model is 1.6m
b) The area of the deck of the ship, if the area of the deck of model is 2.4m²
c) The volume of the model. If the volume of the ship is 1km³ [4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-07eae7-10-0', '07eae7', 39, '10', 'Q10.1. A circus tent is cylindrical to a height of 8m surmounted by a conical part. If total height of the tent is 13m and the diameter of its base is 24m. Find

- a) Total surface area of the tent
- b) Area of the canvas required to make this tent allowing 10% of the canvas used for folds and stitching. [6]', 6, 'Mensuration', 'long', 8, NULL, NULL),
  ('MQ-07eae7-10-1', '07eae7', 40, '10', 'ii. A dealer buys an article for ₹ 6000 from a wholesaler. The dealer sells the article to a consumer at 15% profit. If the sale are intra state and the rate of GST is 18%. Find:-

- a) Input CGST and input SGST paid by the dealer.
- b) Output CGST and output SGST collected by the dealer.
- c) The net CGST and SGST paid by the dealer.
- d) Total amount paid by the consumer [4]', 4, 'GST and Banking', 'long', 8, NULL, NULL),
  ('MQ-e61a0a-1-0', 'e61a0a', 0, '1', '(i) (x + 3), 1, (3x - 7) and -5 are in proportion. The value of x is:', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['-1', '1', '-5', '5']::text[]),
  ('MQ-e61a0a-1-1', 'e61a0a', 1, '1', '(ii) The marked price of a refrigerator is ₹ 12,000 and GST paid by the customer is ₹ 2,160. The rate of GST is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['5%', '12%', '18%', '28%']::text[]),
  ('MQ-e61a0a-1-2', 'e61a0a', 2, '1', '(iii) Rakhi''s mobile number has the following integers:
1, 6, 9, 8, 9, 1, 7, 8, 9
The mode of the above given data is:', 1, 'Statistics', 'MCQ', 2, NULL, array['1', '6', '8', '9']::text[]),
  ('MQ-e61a0a-1-3', 'e61a0a', 3, '1', '(iv) A and B opened a recurring deposit account in a bank which is paying simple interest at 9% per annum. A deposited ₹ 1,500 for one year and B deposited ₹ 1,200 for 15 months. The amount invested by:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['A is ₹ 27 more than B', 'A is ₹ 300 more than B', 'A is ₹ 300 less than B', 'Both A and B are same (₹ 18,000)']::text[]),
  ('MQ-e61a0a-1-4', 'e61a0a', 4, '1', '(v) Find the equation of a line whose y-intercept is 6 and is parallel to x-axis.', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['\(y = 6\)', '\(x = 6\)', '\(x + y = 6\)', '\(y - x = 6\)']::text[]),
  ('MQ-e61a0a-1-5', 'e61a0a', 5, '1', '(vi) Asha buys ₹ 20 shares of a company which pays 9% dividend at such a price that she gets a return of 12% on her investment. At what price did she buy each share?', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['20', '15', '25', '18']::text[]),
  ('MQ-e61a0a-1-6', 'e61a0a', 6, '1', '(vii) The total surface area of a solid sphere ($S_1$) and a solid hemisphere ($S_2$), as shown in the diagram, are equal. The ratio of radii $R$ and $r$ is:', 1, 'Mensuration', 'MCQ', 4, 'e61a0a__ICSE_X_Mat_p4_img_0_jpeg.webp', array['1 : 1', '2 : 1', '$\sqrt{3} : 2$', '$2 : \sqrt{3}$']::text[]),
  ('MQ-e61a0a-1-7', 'e61a0a', 7, '1', '(viii) In the given diagram, O is the centre of the circle and ABCD is a cyclic quadrilateral. If $\angle CDE = 65^\circ$, then the value of $x$ is:', 1, 'Circles', 'MCQ', 4, 'e61a0a__ICSE_X_Mat_p4_img_1_jpeg.webp', array['$32.5^\circ$', '$65^\circ$', '$115^\circ$', '$130^\circ$']::text[]),
  ('MQ-e61a0a-1-8', 'e61a0a', 8, '1', '(ix) The nature of roots of quadratic equation $3x^2 - 6x - 3 = 0$ are:', 1, 'Quadratic Equations', 'MCQ', 5, NULL, array['real and equal', 'real, distinct and rational', 'real, distinct and irrational', 'no real roots']::text[]),
  ('MQ-e61a0a-1-9', 'e61a0a', 9, '1', '(x) Assertion (A): If a die is rolled, the probability of getting a number greater than 6 is $\frac{1}{6}$.
Reason (R): There are six possible outcomes when rolling a die, $\{1, 2, 3, 4, 5, 6\}$.', 1, 'Probability', 'MCQ', 5, NULL, array['(A) is true and (R) is false.', '(A) is false and (R) is true.', 'Both (A) and (R) are true and (R) is the correct explanation of (A).', 'Both (A) and (R) are true but (R) is not the correct explanation of (A).']::text[]),
  ('MQ-e61a0a-1-10', 'e61a0a', 10, '1', '(xi) If the areas of two similar triangles are in the ratio 9 : 64, then the ratio of their corresponding altitudes is:', 1, 'Similarity', 'MCQ', 5, NULL, array['3 : 8', '2 : 1', '9 : 64', '8 : 3']::text[]),
  ('MQ-e61a0a-1-11', 'e61a0a', 11, '1', '(xii) What must be added to $x^3 + 7x^2 + 3x + 2$ so that the result is completely divisible by $(x + 2)$?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 6, NULL, array['-40', '-16', '16', '40']::text[]),
  ('MQ-e61a0a-1-12', 'e61a0a', 12, '1', '(xiii) In the given diagram, $\Delta AOB$ is a right-angled triangle and C is the mid-point of AB. The **coordinates** of the point which is **equidistant** from the three vertices of $\Delta AOB$ is:', 1, 'Coordinate Geometry', 'MCQ', 6, 'e61a0a__ICSE_X_Mat_p6_img_0_jpeg.webp', array['$(x, y)$', '$(y, x)$', '$\left(\frac{x}{2}, \frac{y}{2}\right)$', '$\left(\frac{2x}{3}, \frac{2y}{3}\right)$']::text[]),
  ('MQ-e61a0a-1-13', 'e61a0a', 13, '1', '(xiv) Given matrix $A = \begin{bmatrix} 2 & 3 \\ 1 & 2 \end{bmatrix}$ and matrix $B = [2 \quad -4]$. Product AB is a matrix of order:', 1, 'Matrices', 'MCQ', 7, NULL, array['$2 \times 2$', '$2 \times 1$', '$1 \times 2$', 'product AB is not possible']::text[]),
  ('MQ-e61a0a-1-14', 'e61a0a', 14, '1', '(xv) Assertion (A): The 9th term of a Geometric Progression (G.P.)
6, -12, 24, -48... is a positive term.
Reason (R): The value of $(-2)^8$ is always positive.', 1, 'Geometric Progression', 'MCQ', 7, NULL, array['(A) is true and (R) is false.', '(A) is false and (R) is true.', 'Both (A) and (R) are true and (R) is the correct explanation of (A).', 'Both (A) and (R) are true but (R) is not the correct explanation of (A).']::text[]),
  ('MQ-e61a0a-2-0', 'e61a0a', 15, '2', '(i) The fourth and seventh terms of an Arithmetic Progression (A.P.), are 60 and 114 respectively. Find the:

(a) first term and common difference.
(b) sum of its first 10 terms.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-e61a0a-2-1', 'e61a0a', 16, '2', '(ii) Given, $A = \begin{bmatrix} 3 & 1 \\ 5 & 3 \end{bmatrix}$ and $B = \begin{bmatrix} -1 & a \\ 3 & -5 \end{bmatrix}$ and product $AB = \begin{bmatrix} b & 7 \\ 4 & 5 \end{bmatrix}$.
Find the values of ''a'' and ''b''.', NULL, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-e61a0a-2-2', 'e61a0a', 17, '2', '(iii) In the given diagram, O is the centre of the circle and the tangent DE touches the circle at B. If, ∠ADB = 32°. Find the values of x and y. [4]', 4, 'Circles', 'long', 8, 'e61a0a__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-3-0', 'e61a0a', 18, '3', '(i) The polynomial kx³ + 3x² - 11x - 6 when divided by (x + 1), leaves a remainder of 6. [4]

(a) Find the value of \( \pmb{k} \).
(b) Using the value of \( \pmb{k} \) factorise completely the polynomial

$$kx^3 + 3x^2 - 11x - 6$$', 4, 'Factorisation and Remainder Theorem', 'long', 8, NULL, NULL),
  ('MQ-e61a0a-3-1', 'e61a0a', 19, '3', '(ii) An eye drop bottle is prepared consisting of a hemisphere, a cylinder and a conical cap, as shown in the given diagram. Height of the cylindrical and conical parts are each, equal to the diameter (7 cm). Find the: [4]

(a) minimum height of the cylindrical box required to pack this bottle.
(b) volume of the liquid medicine (shaded part) in the bottle. Give your answer to the nearest whole number. (Use \(\pi = \frac{22}{7}\))', 4, 'Mensuration', 'long', 8, 'e61a0a__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-e61a0a-3-2', 'e61a0a', 20, '3', '(iii) Use ruler and compass for the following construction: [5]
(a) construct an **equilateral** triangle ABC of side 5 cm.
(b) construct the **circumcircle** of $\triangle ABC$.
(c) construct the locus of points which are **equidistant** from AB and BC.
Mark the point where the circumcircle and locus meet, as D.
(d) give the **geometrical** name of quadrilateral ABCD.', 5, 'Constructions', 'long', 9, NULL, NULL),
  ('MQ-e61a0a-4-0', 'e61a0a', 21, '4', '(i) Prove that: [3]

$$(\sec\theta - \cos\theta)(\csc\theta - \sin\theta) = \sin\theta\cos\theta$$', 3, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-e61a0a-4-1', 'e61a0a', 22, '4', '(ii) The cost price of a TV set is ₹ 20,000. The shopkeeper marked it for ₹ 24,000. [3]
He sells it to a customer at a **discount of 10%** on the marked price. If the sale is intra-state and the rate of GST is 12%, find the:

(a) discounted price of the TV set.
(b) amount paid by the customer to clear the bill.', 3, 'GST and Banking', 'short', 9, NULL, NULL),
  ('MQ-e61a0a-4-2', 'e61a0a', 23, '4', '(iii) In the given diagram, DE $\parallel$ BC and AD : DB = 2 : 3. [4]

(a) Prove that: $\triangle ADE \sim \triangle ABC$ and
hence find DE : BC

(b) Prove: $\triangle DFE \sim \triangle CFB$

(c) Given, area of $\triangle DFE = 16$ square units, find the **area of $\triangle CFB$**.', 4, 'Similarity', 'long', 9, 'e61a0a__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-5-0', 'e61a0a', 24, '5', '(i) The histogram drawn on the graph represents the number of students of different heights (in cm). [3]

Using the graph, answer the following:

(a) the number of students whose height is 150 cm and above.
(b) the modal height.
(c) the total number of students.', 3, 'Statistics', 'short', 10, 'e61a0a__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-5-1', 'e61a0a', 25, '5', '(ii) A(-10, -2) and B(2, 10) are two end points of a line segment. If AB intersects the x-axis at P, find the: [3]

(a) ratio in which ''P'' divides AB.
(b) coordinates of point P.', 3, 'Coordinate Geometry', 'short', 11, NULL, NULL),
  ('MQ-e61a0a-5-2', 'e61a0a', 26, '5', '(iii) Solve the quadratic equation (x - 2)^2 - 5x - 3 = 0 and give your answer correct to 3 significant figures. [4]

(Use Mathematical Tables for this question if necessary.)', 4, 'Quadratic Equations', 'long', 11, NULL, NULL),
  ('MQ-e61a0a-6-0', 'e61a0a', 27, '6', '(i) Kabir bought 120 shares of a company with nominal value ₹ 100, available at a premium of ₹ 25. Find: [3]

(a) the money invested by Kabir in buying these shares.
(b) the rate of dividend, if he received ₹ 1,080 as dividend from these shares after one year.
(c) his rate of return.', 3, 'Shares and Dividends', 'short', 11, NULL, NULL),
  ('MQ-e61a0a-6-1', 'e61a0a', 28, '6', '(ii) Find the mean of the following frequency distribution using step-deviation method. [3]

Take assumed mean = 28

| Class Interval | 0 - 8 | 8 - 16 | 16 - 24 | 24 - 32 | 32 - 40 | 40 - 48 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 20 | 14 | 16 | 18 | 22 |', 3, 'Statistics', 'short', 11, NULL, NULL),
  ('MQ-e61a0a-6-2', 'e61a0a', 29, '6', '(iii) The difference of two natural numbers is 5 and sum of their reciprocals is 3/10. Find the two numbers. [4]', 4, 'Quadratic Equations', 'long', 11, NULL, NULL),
  ('MQ-e61a0a-7-0', 'e61a0a', 30, '7', '(i) A flagpole is erected at the top of a building. The angle of elevation of the top and foot of the flagpole from a point 100 m away, on the same level as that of the foot of the building, are 33° and 31° respectively. Find the height of the flagpole. Give your answer correct to the nearest metre.

(Use Mathematical Tables for this question.)', NULL, 'Trigonometry', 'short', 12, 'e61a0a__ICSE_X_Mat_p12_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-7-1', 'e61a0a', 31, '7', '(ii) Using a graph paper, draw an ogive for the following distribution which shows a record of weight in kilograms of 100 students.

| Weight (in kg) | Number of students |
| --- | --- |
| 35 – 40 | 4 |
| 40 – 45 | 6 |
| 45 – 50 | 10 |
| 50 – 55 | 24 |
| 55 – 60 | 26 |
| 60 – 65 | 17 |
| 65 – 70 | 8 |
| 70 – 75 | 5 |

Use your ogive to estimate the following:

(a) the median weight of the students.
(b) percentage of students whose weight is 60 kg or more.
(c) the weight above which 20% of the students lie.', NULL, 'Statistics', 'short', 12, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
