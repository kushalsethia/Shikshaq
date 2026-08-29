set standard_conforming_strings = on;
begin;

-- questions 5001-5500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-e61a0a-8-0', 'e61a0a', 32, '8', '(i) Rohit and Vinay both opened a recurring deposit account in a bank for 2 years at 8% simple interest. Vinay deposited ₹ 300 per month. On maturity, Rohit''s interest was ₹ 800 more than Vinay''s interest. Find the: [3]

(a) interest earned by Vinay.
(b) sum deposited by Rohit every month.', 3, 'GST and Banking', 'short', 13, NULL, NULL),
  ('MQ-e61a0a-8-1', 'e61a0a', 33, '8', '(ii) The fourth term of a Geometric Progression (G.P.) is 16 and its seventh term is 128. Find its: [3]

(a) common ratio
(b) first term', 3, 'Geometric Progression', 'short', 13, NULL, NULL),
  ('MQ-e61a0a-8-2', 'e61a0a', 34, '8', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along both x and y axis. Graphically represent parallelogram OABC, where O(0, 0), A(2, 3), B(5, 3) and C(3, 0). [4]

Reflect OABC:

(a) on the \(x\) -axis and name its image as ODEC.
(b) through the origin and name its image as OIJH.
(c) on the \(y\)-axis and name its image as OFGH.', 4, 'Coordinate Geometry', 'long', 13, NULL, NULL),
  ('MQ-e61a0a-9-0', 'e61a0a', 35, '9', '(i) Solve the following inequation, write the solution set and represent it on the real number line. [3]

$$-1 < \frac{2x - 3}{3} - \frac{x}{5} \leq 1, x \in R$$', 3, 'Linear Inequations', 'short', 13, NULL, NULL),
  ('MQ-e61a0a-9-1', 'e61a0a', 36, '9', '(ii) Use the following graph and answer the given questions:

[3]

(a) Write the co-ordinates of points A, B and C.
(b) Find the equation of a line passing through the mid-point of AC and parallel to AB.', 3, 'Coordinate Geometry', 'short', 14, 'e61a0a__ICSE_X_Mat_p14_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-9-2', 'e61a0a', 37, '9', '(iii) A solid wooden toy is prepared by joining a cone, a cylinder and a sphere, as shown in the given diagram. **The radius of each of the three solids is 7 cm and heights of each of the cone and the cylinder is 24 cm.** Find: [4]

- (a) the **total surface area** of the given solid.
- (b) the **cost** of painting the total surface at the rate of ₹ 0.50 per cm².

(Use $$\pi = \frac{22}{7}$$)', 4, 'Mensuration', 'long', 15, 'e61a0a__ICSE_X_Mat_p15_img_0_jpeg.webp', NULL),
  ('MQ-e61a0a-10-0', 'e61a0a', 38, '10', '(i) If $$x = \frac{5ab}{a - b}, a \neq b$$,

[3]

(a) Find: $$\frac{x}{a}$$

(b) Using properties of proportion, find: $$\frac{x + a}{x - a}$$', 3, 'Ratio and Proportion', 'short', 15, NULL, NULL),
  ('MQ-e61a0a-10-1', 'e61a0a', 39, '10', '(ii) A survey was conducted on 300 families having 2 children each. The results obtained are given below. [3]

| Number of girl child | 2 | 1 | 0 | Total |
| --- | --- | --- | --- | --- |
| Number of families | 95 | 165 | 40 | 300 |

If one family is selected at random, find the probability that it will have:

(a) one girl child
(b) one or more girl child
(c) no boy child', 3, 'Probability', 'short', 16, NULL, NULL),
  ('MQ-e61a0a-10-2', 'e61a0a', 40, '10', '(iii) In the given figure ''O'' is the centre of the circle. PQ is a tangent to the circle at B and AB = AC. If ∠CBQ = 40°, find the unknown angles x, y, z and w. [4]', 4, 'Circles', 'long', 16, 'e61a0a__ICSE_X_Mat_p16_img_0_jpeg.webp', NULL),
  ('MQ-11a9e2-1-4', '11a9e2', 0, '1', '(v) If $A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$, then $A^2$ is equal to', 1, 'Matrices', 'MCQ', 1, NULL, array['$\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix}$', '$\begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix}$', '$\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$', '$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$']::text[]),
  ('MQ-11a9e2-1-5', '11a9e2', 1, '1', '(vi) In the given diagram, chords $AC$ and $BC$ are equal. If angle $\angle ACD = 120^\circ$, then angle $\angle AEC$ is', 1, 'Circles', 'MCQ', 1, '11a9e2__ICSE_X_Mat_p1_img_0_jpeg.webp', array['$30^{\circ}$', '$60^{\circ}$', '$90^{\circ}$', '$120^{\circ}$']::text[]),
  ('MQ-11a9e2-1-6', '11a9e2', 2, '1', '(vii) The factor common to the two polynomials $x^{2} - 4$ and $x^{3} - x^{2} - 4x + 4$ is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$(x + 1)$', '$(x - 1)$', '$(x + 2)$', '$(x - 2)$']::text[]),
  ('MQ-11a9e2-1-7', '11a9e2', 3, '1', '(viii) A man invested in a company paying $12\%$ dividend on its share. If the percentage return on his investment is $10\%$, then the shares are', 1, 'Shares and Dividends', 'MCQ', 1, NULL, array['at par', 'below par', 'above par', 'cannot be determined']::text[]),
  ('MQ-11a9e2-1-13', '11a9e2', 4, '1', '(xiv) The solution set for $0 < -\frac{x}{3} < 2, x \in z$ is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['\(\{-5, -4, -3, -2, -1\}\)', '\(\{-6, -5, -4, -3, -2, -1\}\)', '\(\{-5, -4, -3, -2, -1, 0\}\)', '\(\{-6, -5, -4, -3, -2, -1, 0\}\)']::text[]),
  ('MQ-11a9e2-2-1', '11a9e2', 5, '2', '(ii) Mrs. Rao deposited ₹ 50 per month in a recurring deposit account for a period of 3 years. She received ₹ 10,110 at the time of maturity. Find: [4]

(a) the rate of interest,
(b) how much more interest Mrs. Rao will receive if she had deposited ₹ 250 more per month at the same rate of interest and for the same time.', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-11a9e2-2-2', '11a9e2', 6, '2', '(iii) In $\Delta ABC$, $\angle ABC = 90^\circ$, $AB = 20\mathrm{cm}$, $AC = 25\mathrm{cm}$ $DE$ is perpendicular to $AC$ such that $\angle DEA = 90^\circ$ and $DE = 3\mathrm{cm}$ as shown in the given figure. [4]

(a) Prove that \(\Delta ABC\sim \Delta AED\)
(b) Find the lengths of \(BC, AD\) and \(AE\).
(c) If BCED represents a plot of land on a map whose actual area on ground is \(576\mathrm{m}^2\), then find the scale factor of the map.', 4, 'Similarity', 'long', 2, '11a9e2__ICSE_X_Mat_p2_img_2_jpeg.webp', NULL),
  ('MQ-11a9e2-3-0', '11a9e2', 7, '3', '(i) Use ruler and compass for the following construction. Construct a $\Delta ABC$ where $AB = 6\mathrm{cm}$, $AC = 4.5\mathrm{cm}$ and $\angle BAC = 120^{\circ}$. Construct a circle circumscribing the $\Delta ABC$. Measure and write down the length of the radius of the circle. [4]', 4, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-11a9e2-3-1', '11a9e2', 8, '3', '(ii) If $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, B = \begin{bmatrix} 2 & 1 \\ 4 & 2 \end{bmatrix}$ and $C = \begin{bmatrix} -5 & 1 \\ 7 & -4 \end{bmatrix}$ [4]

Find:

(a) $A + C$

(b) $B(A + C)$

(c) $5B$

(d) $B(A + C) - 5B$', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-11a9e2-3-2', '11a9e2', 9, '3', '(iii) In the given graph $ABCD$ is a parallelogram. [5]

Using the graph, answer the following:

(a) write down the coordinates of \(A, B, C\) and \(D\).
(b) calculate the coordinates of \( P \), the point of intersection of the diagonals \( AC \) and \( BD \).
(c) find the slope of sides \(CB\) and \(DA\) and verify that they represent parallel lines.
(d) find the equation of the diagonal \(AC\).', 5, 'Coordinate Geometry', 'long', 3, '11a9e2__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-11a9e2-4-0', '11a9e2', 10, '4', '(i) Solve the following inequation, write the solution set and represent it on the real number line. [3]

$$
2x - \frac{5}{3} < \frac{3x}{5} + 10 \leq \frac{4x}{5} + 11; \quad x \in R
$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-11a9e2-4-1', '11a9e2', 11, '4', '(ii) The first term of an Arithmetic Progression (A.P.) is 5, the last term is 50 and their sum is 440. Find: [3]

(a) the number of terms
(b) common difference', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-11a9e2-4-2', '11a9e2', 12, '4', '(iii) Prove that: [4]

$$
\frac{(\cot A + \tan A - 1)(\sin A + \cos A)}{\sin^3 A + \cos^3 A} = \sec A \cdot \csc A
$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-11a9e2-5-0', '11a9e2', 13, '5', '(i) Using properties of proportion, find the value of $x$: [3]

$$
\frac{6x^2 + 3x - 5}{3x - 5} = \frac{9x^2 + 2x + 5}{2x + 5}; \quad x \neq 0
$$', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-11a9e2-5-2', '11a9e2', 14, '5', '(iii) A solid wooden capsule is shown in Figure 1. The capsule is formed of a cylindrical block and two hemispheres.

Find the sum of total surface area of the three parts as shown in Figure 2. Given, the radius of the capsule is $3.5\,\mathrm{cm}$ and the length of the cylindrical block is $14\,\mathrm{cm}$. [4]

$$
(\text{Use } \pi = \frac{22}{7})
$$

Figure 1

Figure 2', 4, 'Mensuration', 'long', 3, '11a9e2__ICSE_X_Mat_p3_img_2_jpeg.webp', NULL),
  ('MQ-11a9e2-6-0', '11a9e2', 15, '6', '(i) Use a graph paper for this question taking $2\,\mathrm{cm} = 1$ unit along both axes. [5]

(a) Plot \(A(1,3),B(1,2)\) and \(C(3,0)\)
(b) Reflect \(A\) and \(B\) on the \(x\)-axis and name their images as \(E\) and \(D\) respectively. Write down their coordinates.
(c) Reflect \(A\) and \(B\) through the origin and name their images as \(F\) and \(G\) respectively.
(d) Reflect \(A, B\) and \(C\) on the \(y\)-axis and name their images as \(J, I\) and \(H\) respectively.
(e) Join all the points \(A, B, C, D, E, F, G, H, I\) and \(J\) in order and name the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-11a9e2-6-1', '11a9e2', 16, '6', '(ii) In the given diagram, $AB$ is a vertical tower $100\,\mathrm{m}$ away from the foot of a 30 storied building $CD$. The angles of depression from the point $C$ and $E$. ($E$ being the mid-point of $CD$), are $35^\circ$ and $14^\circ$ respectively. [5] (Use mathematical table for the required values rounded off correct to two places of decimals only) Find the height of the:

(a) tower \(AB\)
(b) building \(CD\)', 5, 'Trigonometry', 'long', 3, '11a9e2__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-11a9e2-7-0', '11a9e2', 17, '7', '(i) Use a graph paper for this question. [3]

(Take $2\mathrm{cm} = 10$ Marks along one axis and $2\mathrm{cm} = 10$ students along another axis).

Draw a Histogram for the following distribution which gives the marks obtained by 164 students in a particular class and hence find the Mode.

| Marks | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- |
| Number of Students | 10 | 26 | 40 | 54 | 34 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-11a9e2-7-1', '11a9e2', 18, '7', '(ii) In the given graph, $P$ and $Q$ are points such that $PQ$ cuts off intercepts of 5 units and 3 units along the $x$-axis and $y$-axis respectively. Line $RS$ is perpendicular to $PQ$ and passes through the origin. Find the: [3]

(a) coordinates of \(P\) and \(Q\)
(b) equation of line \(RS\)', 3, 'Coordinate Geometry', 'short', 4, '11a9e2__ICSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-11a9e2-7-2', '11a9e2', 19, '7', '(iii) Refer to the given bill.

[4]

A customer paid ₹ 2000 (rounded off to the nearest ₹ 10) to clear the bill. Note: $5\%$ discount is applicable on an article if 10 or more such articles are purchased.

| BILL | | | |
| --- | --- | --- | --- |
| Article | M.P. (₹) | Quantity | G.S.T. |
| A | 190 | 06 | 12% |
| B | 50 | 12 | 18% |

Check whether the total amount paid by the customer is correct or not. Justify your answer with necessary working.', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-11a9e2-8-0', '11a9e2', 20, '8', '(i) A man bought ₹ 200 shares of a company at $25\%$ premium. If he received a return of $5\%$ on his investment. Find the: [3]

(a) market value
(b) dividend percent declared
(c) number of shares purchased, if annual dividend is ₹ 1000.', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-11a9e2-8-1', '11a9e2', 21, '8', '(ii) For the given frequency distribution, find the: [3]

(a) mean, to the nearest whole number
(b) median

| x | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| y | 3 | 2 | 2 | 6 | 3 | 5 | 3 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-11a9e2-8-2', '11a9e2', 22, '8', '(iii) Mr. and Mrs. Das were travelling by car from Delhi to Kasauli for a holiday. Distance between Delhi and Kasauli is approximately $350\mathrm{km}$ (via NH 152D). Due to heavy rain they had to slow down. The average speed of the car was reduced by $20\mathrm{km/h}$ and time of the journey increased by 2 hours. Find: [4]

(a) the original speed of the car.
(b) with the reduced speed, the number of hours they took to reach their destination.', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-11a9e2-9-0', '11a9e2', 23, '9', '(i) A hollow sphere of external diameter $10\mathrm{cm}$ and internal diameter $6\mathrm{cm}$ is melted and made into a solid right circular cone of height $8\mathrm{cm}$. Find the radius of the cone so formed. [3]

$$
[ \text {Use } \pi = \frac {22}{7} ]
$$', 3, 'Mensuration', 'short', 4, '11a9e2__ICSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-11a9e2-9-1', '11a9e2', 24, '9', '(ii) Ms. Sushmita went to a fair and participated in a game. The game consisted of a box having number cards with numbers from 01 to 30. The three prizes were as per the given table: [3]

| Prize | Number on the card drawn at random is a |
| --- | --- |
| Wall Clock | perfect square |
| Water Bottle | even number which is also a multiple of 3 |
| Purse | prime number |

Find the probability of winning a:

(a) Wall Clock
(b) Water Bottle
(c) Purse', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-11a9e2-9-2', '11a9e2', 25, '9', '(iii) $X, Y, Z$ and $C$ are the points on the circumference of a circle with centre $O$. $AB$ is a tangent to the circle at $X$ and $ZY = XY$. Given $\angle OBX = 32^\circ$ and $\angle AXZ = 66^\circ$. Find: [4]

(a) $\angle BOX$

(b) $\angle CYX$

(c) $\angle ZYX$

(d) $\angle OXY$', 4, 'Circles', 'long', 5, '11a9e2__ICSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-11a9e2-10-0', '11a9e2', 26, '10', '(i) If 1701 is the $n^{th}$ term of the Geometric Progression (G.P.) 7, 21, 63 ..., find: [3]

(a) the value of \( n \)
(b) hence find the sum of the \(n\) terms of the G.P.', 3, 'Geometric Progression', 'short', 5, NULL, NULL),
  ('MQ-11a9e2-10-1', '11a9e2', 27, '10', '(ii) In the given diagram $O$ is the centre of the circle. Chord $SR$ produced meets the tangent $XTP$ at $P$. [3]

(a) Prove that \(\Delta PTR\sim \Delta PST\)
(b) Prove that \( PT^2 = PR \times PS \)
(c) If \( PR = 4 \, \text{cm} \) and \( PS = 16 \, \text{cm} \), find the length of the tangent \( PT \).', 3, 'Circles', 'short', 5, '11a9e2__ICSE_X_Mat_p5_img_2_jpeg.webp', NULL),
  ('MQ-826f8c-1-0', '826f8c', 0, '1', 'i) Rahul bought a T V from a wholesaler for ₹ 20000 and sells it to consumer at 10% profit. If the rate of GST is 12%, find the tax paid by him?

a) ₹230 b) ₹260 c) ₹240 d) ₹250', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-1', '826f8c', 1, '1', 'ii) Mrs. Asha Mehta deposit Rs 250 per month for one year in a bank''s recurring deposit account. If the rate of (simple) interest is 8% per annum, then the interest earned by her on this account is

a) ₹65 b) ₹ 120 c) ₹130 d) ₹ 260', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-2', '826f8c', 2, '1', 'iii) The largest value of x for which 2(x - 1) ≤ 9 - x and x ∈ W is

a) 4 b) 11/3 c) 3 d) 0', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-3', '826f8c', 3, '1', 'iv) If -2/3 is a root of the equation k x² - 13 x - 10 = 0, the value of k is

a) 1 b) 2 c) 3 d) 4', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-4', '826f8c', 4, '1', 'v) If x + 5 is the mean proportional between x + 2 and x + 9; find the value of x.

a) 3 b) 5 c) 7 d) 11', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-5', '826f8c', 5, '1', 'vi) If 2x + 1 is a factor of 2x² + ax - 3, find the value of a.

a) 6 b) -5 c) 4 d) -2', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-826f8c-1-6', '826f8c', 6, '1', 'vii) The image of the point (4, 7) under reflection in the line x = 0 is

a) (4, 7) b) (-4, 7) c) (-4, -7) d) (4, -7)', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-7', '826f8c', 7, '1', 'viii) The inclination of the line : x - √3 y + 2√3 = 0 is

a) 0° b) 30° c) 60° (d) 90°', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-8', '826f8c', 8, '1', 'ix) If in two ΔABC and ΔPQR, AB/QR = BC/PR = CA/PQ then ..

a) ΔPQR ~ ΔCAB b) ΔPQR ~ ΔABC

c) ΔCAB ~ ΔPQR (d) ΔBCA ~ ΔPQR', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-9', '826f8c', 9, '1', 'x) In the given figure, tangent PT = 12.5 cm and PA = 10 cm; find AB.

a) 5.25 cm b) 5.625 cm c) 6.5cm (d) 7.35cm', 1, 'Circles', 'short', 2, '826f8c__Ies_Orion__p2_img_0_jpeg.webp', NULL),
  ('MQ-826f8c-1-10', '826f8c', 10, '1', 'xi) How many balls each of radius 1 cm can be made by melting a bigger ball whose diameter is 8 cm ?

a) 80 b) 20 c) 64 (d) 56', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-11', '826f8c', 11, '1', 'xii) (sec² θ - 1) (1 - cosec² θ) is equal to

a) -1 b) 0 c) 1 (d) 2', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-12', '826f8c', 12, '1', 'xiii) The probability of getting exactly one head in tossing a pair of coins is

a) 0 b) 1 c) 1/3 (d) 1/2', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-13', '826f8c', 13, '1', 'xiv) Which term of the A. P. 1, 4, 7, 10, ... is 58?

a) 18 b) 19 c) 20 (d) 21', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-826f8c-1-14', '826f8c', 14, '1', 'xv) If the order of matrix A is m × n and the order of matrix B is n × p then the order of matrix A × B is

a) m × n b) n × p c) m × p (d) None of these', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-826f8c-2-0', '826f8c', 15, '2', 'a) If 3 [2 x; 1 0] + 2 [4 3; y 2] = [z -3; 15 4], find the value of x, y and z.

[4]', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-826f8c-2-1', '826f8c', 16, '2', 'b) In the given figure, O is the centre of the circle, ∠BAD = 75° and chord BC= chord CD.

Find : i) ∠BOC
ii) ∠OBD
iii) ∠BCD

[4]', 4, 'Circles', 'long', 3, '826f8c__Ies_Orion__p3_img_0_jpeg.webp', NULL),
  ('MQ-826f8c-2-2', '826f8c', 17, '2', 'c) The shadow of a tower, when the angle of elevation of the sun is 45°, is found to be 10 m longer than when it was 60°. Find the height of the tower in nearest metre.

[4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-826f8c-3-0', '826f8c', 18, '3', 'a) In an auditorium, seats were arranged in rows and columns. The numbers of rows were equal to the number of seats in each row. When the numbers of rows were doubled and the numbers of seats in each row were reduced by 10, the total number of seats increased by 300. Find :

i) The number of rows in the original arrangement.

ii) The number of seats in the auditorium after arrangement.

[4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-826f8c-3-1', '826f8c', 19, '3', 'b) A hollow sphere of internal and external radii 6cm and 8cm respectively is melted and recast into small cones of base radius 2cm and height 8cm. Find the number of cones formed.

[4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-826f8c-3-2', '826f8c', 20, '3', 'c) The following table shows the number of casualties due to accidents at different age group in a city.

| Age ( In years) | 5 – 15 | 15 – 25 | 25 – 35 | 35 – 45 | 45 – 55 | 55 – 65 | 65 – 75 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of casualties | 6 | 10 | 16 | 15 | 24 | 8 | 7 |

Draw an ogive for the given distribution taking 1cm = 10 years on x-axis and 1cm=10 casualties on y- axis. Use graph paper for the same. From the graph determine:

i) the lower quartile
ii) the upper quartile
iii) the median.

[5]', 5, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-826f8c-4-0', '826f8c', 21, '4', 'a) A shopkeeper buys goods worth ₹ 4000 and sells these at a profit of 20% to a consumer in the same state. If GST is charged at 5%, find:

i) CGST paid by the consumer.
ii) SGST paid by the consumer.
iii) the total amount paid by the consumer. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-826f8c-4-1', '826f8c', 22, '4', 'b) In the given figure, the circle touches the sides AB, BC, CD and DC of a quadrilateral ABCD at the points P, Q, R and S respectively. If AB = 11cm, BC = x cm, CR = 4cm and AS = 6cm, find the value of x.

[3]', 3, 'Circles', 'short', 4, '826f8c__Ies_Orion__p4_img_0_jpeg.webp', NULL),
  ('MQ-826f8c-4-2', '826f8c', 23, '4', 'c) In what ratio is the join of A(3, -1) and B(-7, 9) divided by the point P(-1, b)? Hence, find the value of b.

[4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-826f8c-5-0', '826f8c', 24, '5', 'a) Find the value of x for which the numbers (5x + 2), (4x - 1) and (x + 2) are in A.P.

[3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-826f8c-5-1', '826f8c', 25, '5', 'b) From the top of a hill the angles of depression of two consecutive kilometre stones, due east are found to be 30° and 45° respectively. Find the distance of the two stones from the foot of the hill.

[3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-826f8c-5-2', '826f8c', 26, '5', 'c) In the given figure, P is the point on AB such that AP: PB = 4 : 3 and PQ || AC.

AR ⊥ CP and QS ⊥ CP.

i) Calculate PQ:AC
ii) If \(\angle ARC = 90^{\circ}\) and \(\angle QSP = 90^{\circ}\)

and QS = 6cm, calculate the length of AR.

[4]', 4, 'Similarity', 'long', 4, '826f8c__Ies_Orion__p4_img_1_jpeg.webp', NULL),
  ('MQ-826f8c-6-0', '826f8c', 27, '6', 'a) Meena has a cumulative time deposit account of ₹340 per month at 6% per annum. If she gets ₹7157 at the time of maturity, find the total time for which the account was held?', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-826f8c-6-1', '826f8c', 28, '6', 'b) Solve the equation 2x² + 5x - 5 = 0. Write your answer correct to 2 decimal.', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-826f8c-6-2', '826f8c', 29, '6', 'c) A mathematics aptitude test of 50 students was recorded as follows:

| Marks | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- |
| NO. of students | 4 | 8 | 14 | 19 | 5 |

Draw a histogram for the above data using a graph paper and locate the mode

[4]', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-826f8c-7-0', '826f8c', 30, '7', 'a) Solve the inequation $$12 + 1\frac{5}{6}x \leq 5 + 3x, x \in R$$. Represent the solution set on the number line.

[3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-826f8c-7-1', '826f8c', 31, '7', 'b) If $$A = \begin{bmatrix} 5 & 2 \\ 3 & -1 \end{bmatrix}$$ and $$B = \begin{bmatrix} -13 \\ 1 \end{bmatrix}$$, find a matrix X such and AX = B.', NULL, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-826f8c-7-2', '826f8c', 32, '7', 'c) Calculate the mean of the following distribution.

| Height in cm | 135 – 140 | 140 – 145 | 145 – 150 | 150 – 155 | 155 – 160 | 160 – 165 | 165 – 170 | 170 – 175 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of boys | 4 | 9 | 18 | 28 | 24 | 10 | 5 | 2 |

[4]', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-826f8c-8-0', '826f8c', 33, '8', 'a) Prove that: $$\frac{\sec A}{\sec A - 1} + \frac{\sec A}{\sec A + 1} = 2 \cosec^2 A$$

[3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-826f8c-8-1', '826f8c', 34, '8', 'b) Using properties of proportion solve for x. Given :

$$\frac{\sqrt{x+5} + \sqrt{x-16}}{\sqrt{x+5} - \sqrt{x-16}} = \frac{7}{3}$$ [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-826f8c-8-2', '826f8c', 35, '8', 'c) $$P(3, 4), Q(7, -2)$$ and $$R(-2, -1)$$ are the vertices of a $$\triangle PQR$$. Find :

i) the slope of the median of the triangle through $$\angle R$$.

ii) the equation of the median of the triangle through $$\angle R$$..

[4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-826f8c-9-0', '826f8c', 36, '9', 'a) Given that : $$\frac{a^3 + 3ab^2}{b^3 + 3a^2b} = \frac{63}{62}$$ Using properties of proportion, find a : b.

[3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-826f8c-9-1', '826f8c', 37, '9', 'b) Prove that : $$\frac{\sin\theta \tan\theta}{1 - \cos\theta} = (1 + \sec\theta)$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-826f8c-9-2', '826f8c', 38, '9', 'c) The point P (3, 4) is reflected to P'' in x-axis and O'' is the image of O (Origin) when reflected in the line PP''. Using the graph paper, Give :

i) the coordinates of P'' and O''.
ii) the length of the segment PP'' and OO''.
iii) the geometrical name of the figure POP''O''.
iv) the perimeter of the quadrilateral POP''O''.', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-826f8c-10-0', '826f8c', 39, '10', 'a) Construct a ΔABC in which BC = 5cm, AB = 6.5cm and ∠ABC = 120° and draw it'' circumcircle.', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-826f8c-10-1', '826f8c', 40, '10', 'b) Two coins are tossed simultaneously. Find the probability of getting :

i) at least one head
ii) at most one head
iii) exactly one head', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-826f8c-10-2', '826f8c', 41, '10', 'c) Show that (x + 4) is a factor of 2x³ + 9x² + x - 12. Hence factorise the given expression completely.', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-80a02c-1-0', '80a02c', 0, '1', 'a) Dinesh has a recurring deposit account in a bank for 2 years at 9% per annum. If he gets

₹ 7875 at the time of maturity, find the monthly installment. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-80a02c-1-1', '80a02c', 1, '1', 'b) Prove the Identity: $$\frac{\sin\theta - 2\sin^3\theta}{2\cos^3\theta - \cos\theta} = \tan\theta$$ [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-80a02c-1-2', '80a02c', 2, '1', 'c) A model of a ship is made to a scale of 1:200

I. The length of the model is \(4\mathrm{m}\). Calculate the length of the ship.
II. The area of the deck of the ship is \( 160000 \, \text{m}^2 \), find the area of deck of the model.
III. The volume of the model is 200 litres, calculate the volume of the ship in metre cube. [4]', 4, 'Similarity', 'long', 1, NULL, NULL),
  ('MQ-80a02c-2-0', '80a02c', 3, '2', '$$x - \frac{18}{x} = 6. \tag{3}$$

a) Solve and give your answer correct to 3 significant figures:', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-80a02c-2-1', '80a02c', 4, '2', 'b) If \( A = \begin{bmatrix} 1 & 3 \\ 3 & 4 \end{bmatrix} \), \( B = \begin{bmatrix} -2 & 1 \\ -3 & 2 \end{bmatrix} \) and \( A^2 - 5B^2 = 5C \), find the matrix \( C \). [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-80a02c-2-2', '80a02c', 5, '2', 'c) Determine the ratio in which the point $$(\frac{-2}{5}, x)$$ divides the joining of $$(-4, 3)$$ and $$(2, 8)$$.

Also find the value of x. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-80a02c-3-0', '80a02c', 6, '3', 'a) A $$(7, -5)$$ B $$(5, 3)$$ and C $$(-9, 1)$$ are the vertices of $$\Delta$$ ABC. Find the:

I. Slope of BC.

II. Equation of altitude through A. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-80a02c-3-1', '80a02c', 7, '3', 'b) When the two polynomials $$x^3 + ax^2 - x - 2$$ and $$ax^3 + x^2 - 6x - 4$$ are divided by $$x - 2$$, the remainder is same. Find the value of a. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-80a02c-3-2', '80a02c', 8, '3', 'c) Construct a triangle ABC given that, AB = 5 cm, BC = 6 cm and $$\angle ABC = 120^\circ$$. Construct the incircle of the triangle. Measure and record the radius of the incircle. [4]', 4, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-80a02c-4-0', '80a02c', 9, '4', 'a) Find the number of terms of GP whose first term is $$\frac{3}{4}$$, the common ratio is 2 and the last term is 384. [3]', 3, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-80a02c-4-1', '80a02c', 10, '4', 'b) Calculate the mean, the median and the mode of the following data: $$\sqrt{15}, \sqrt{17}, \sqrt{16}, \sqrt{7}, \sqrt{10}, \sqrt{12}, \sqrt{14}, \sqrt{16}, \sqrt{19}, \sqrt{12}$$ and $$\sqrt{16}$$ [3]', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-80a02c-4-2', '80a02c', 11, '4', 'c) If $$x = \frac{\sqrt{2a+1} + \sqrt{2a-1}}{\sqrt{2a+1} - \sqrt{2a-1}}$$ using property of proportion prove that. $$x^2 - 4ax + 1 = 0$$ [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-80a02c-5-0', '80a02c', 12, '5', 'a) The horizontal distance between two towers is 150 m. The angle of depression of the top of one tower as observed from the top of the other tower, which is 120 m in height is $$30^\circ$$. Find the height of the first tower. [3]', 3, 'Trigonometry', 'short', 2, '80a02c__Ies_Pre_X__p2_img_0_jpeg.webp', NULL),
  ('MQ-80a02c-5-1', '80a02c', 13, '5', 'b) In $$\Delta$$ PQR, S is a point on QR such that $$\angle Q = \angle SPR$$
I. prove that $$\Delta PQR \sim \Delta SPR$$
II. If QS=5 cm, SR = 4 cm, find the length of PR. [3]', 3, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-80a02c-5-2', '80a02c', 14, '5', 'c) If the mean marks of the distribution of marks of 100 students is 54, then find x and y. [4]

| Marks | 0 - 20 | 20 - 40 | 40 - 60 | 60 - 80 | 80 - 100 |
| --- | --- | --- | --- | --- | --- |
| No.of students | 16 | x | 24 | 26 | y |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-80a02c-6-0', '80a02c', 15, '6', 'a) The marks obtained by 80 students in a test are given below :

| Marks | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No.of students | 3 | 7 | 15 | 24 | 16 | 8 | 5 | 2 |

Draw and ogive for the given distribution on a graph paper. Use scale of 2 cm = 10 units on both axes. Estimate from ogive :

I. the median
II. the lower quartile
III. the number of students who obtained more than 65 marks
IV. the number of students who did not pass in the test if the pass percentage was 35. [6]', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-80a02c-6-1', '80a02c', 16, '6', 'b) The surface area of a solid metallic sphere is 5024 cm². It is melted and recast into the solid cones of radius 5 cm and height 10 cm .Calculate

I. the radius of sphere
II. the number of cones recast. (Take \(\pi = 3.14\) ) [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-80a02c-7-0', '80a02c', 17, '7', 'a) Construct a ΔABC in which BC =6cm,angleABC=120° and AB = 7.5 CM

I. Construct the locus of point equidistant from B and C.
II. Draw the locus of a point P such that area of \(\Delta\) PBC = area of \(\Delta\) ABC. [3]', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-80a02c-7-1', '80a02c', 18, '7', 'b) Solve the inequation and represent the solution set on the number line.

$$\frac{-1}{3} \leq \frac{x}{2} - \left(-1\frac{1}{3}\right) < \frac{1}{6}, \ x \in R.$$ [3]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-80a02c-7-2', '80a02c', 19, '7', 'c) Use graph paper for this question:

i) Plot P (6, 3) and Q(3, 0).
ii) Reflect P in x axis to get P''. Write the coordinates of P''.
iii) O is the origin .Give the geometrical name of POP''Q.
iv) Find the area of quadrilateral POP''Q.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-80a02c-8-0', '80a02c', 20, '8', 'a) In the adjoining figure PQ and PR are tangents to the circle with Centre O. If ∠QPR= 60°

Calculate : i) ∠QOR ii) ∠OQR iii) ∠QSR', NULL, 'Circles', 'short', 3, '80a02c__Ies_Pre_X__p3_img_0_jpeg.webp', NULL),
  ('MQ-80a02c-8-1', '80a02c', 21, '8', 'b) The sum of three numbers in an A P is -12 and their product is 36. Find the numbers. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-80a02c-8-2', '80a02c', 22, '8', 'c) Prove the identify

$$\sin A (1 + \tan A) + \cos A (1 + \cot A) = \sec A + \csc A$$

[4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-80a02c-9-0', '80a02c', 23, '9', 'a) The internal and external diameters of a hollow hemispherical vessel are 14 cm and 21cm respectively. Find the total surface area of the vessel. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-80a02c-9-1', '80a02c', 24, '9', 'b) In the adjoining figure, ABCD is a cyclic quadrilateral a \(\angle BAD = 103^{\circ}\), \(\angle ADC = 75^{\circ}\) and \(\angle \Lambda CD = 50^{\circ}\). Find :

I. ∠BCA

II. ∠ABC

III. ∠BAC

[3]', 3, 'Circles', 'short', 4, '80a02c__Ies_Pre_X__p4_img_0_jpeg.webp', NULL),
  ('MQ-80a02c-9-2', '80a02c', 25, '9', 'c) When 3 coins are tossed simultaneously, what is the probability of getting

i) exactly two heads

ii) exactly two tails

iii) at least 2 tails

iv) at most one head', NULL, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-80a02c-10-0', '80a02c', 26, '10', 'a) In an auditorium the number of rows was equal to the number of seats in each row. When the number of rows was doubled and the number of seats in each row was reduced by 12, then the number of seats increased by 1300. How many rows were there.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-80a02c-10-1', '80a02c', 27, '10', 'b) Using properties of proportion solve the following:

$$\frac{x^3 + 3x}{3x^2 + 1} = \frac{341}{91}$$

[3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-80a02c-10-2', '80a02c', 28, '10', 'c) A manufacturer marks on article at ₹10000. He sells this article to a wholesaler at a discount of 25% on the marked price and the wholesaler sells it to a retailer at a discount of 15% on its marked price. If the retailer sells the article without any discount and at each stage the GST is 5%, calculate the amount of GST paid by wholesaler and retailer.

[3]

[4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-80a02c-11-0', '80a02c', 29, '11', 'a) A man invest ₹9900 on buying shares of face value of ₹100 each at a premium of 10% in a company. If he earns ₹1350 at the end of the year. Find :

i) the number of shares he has in the company
ii) what is dividend percent per share.

TTT
TTH

[3]', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-80a02c-11-1', '80a02c', 30, '11', 'b) Chords AB and CD of a circle when extended meet at point X,

AB = 4 cm, BX = 6 cm, XD= 5 cm.

Calculate the length of CD.

[3]', 3, 'Circles', 'short', 5, '80a02c__Ies_Pre_X__p5_img_0_jpeg.webp', NULL),
  ('MQ-80a02c-11-2', '80a02c', 31, '11', 'c) Without solving the following quadratic equation, find the value of ''m'' for which the given equation has real and equal roots.

$$X^2 + 2(m - 1) x + (m + 5) = 0$$

[4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-c2e512-1-0', 'c2e512', 0, '1', 'a) Solve the following inequation and write down the solution set: $$2x - 3 < x + 2 \le 2x + 5, \ x \in \mathbb{Z}$$
Represent the solution on the number line. [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-c2e512-1-1', 'c2e512', 1, '1', 'b) Evaluate: $$\begin{bmatrix} \sec 60^\circ & 2 \cos 60^\circ \\ \sin 90^\circ & 2 \cos 0^\circ \end{bmatrix} \begin{bmatrix} 4 & 5 \\ 5 & 4 \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-c2e512-1-2', 'c2e512', 2, '1', 'c) Calculate the following for the given distribution: (i) the mean, correct to one decimal place, (ii) the median and (iii) the mode. [4]

| No. of Goals (variate) | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of matches (frequency) | 2 | 4 | 7 | 6 | 8 | 3 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-c2e512-2-0', 'c2e512', 3, '2', 'a) In an Arithmetic Progression (A.P.), if m$^{th}$ term is n and n$^{th}$ term is m, where m ≠ n, find the p$^{th}$ term. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-c2e512-2-1', 'c2e512', 4, '2', 'b) Prove that: $$\frac{\text{Cos A}}{1 - \text{Sin A}} + \frac{\text{Sin A}}{1 - \text{Cos A}} + 1 = \frac{\text{Sin A Cos A}}{(1 - \text{Sin A})(1 - \text{Cos A})}$$ [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-c2e512-2-2', 'c2e512', 5, '2', 'c) The polynomial $$2x^3 + mx^2 + nx - 2$$ when divided by 2x – 3, leaves remainder 7 and has (x + 2) as its factor. Find m and n. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-c2e512-3-0', 'c2e512', 6, '3', 'a) Solve for x the quadratic equation $$2x^2 + x - 4 = 0$$. Give your answer correct to three significant figures. [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-c2e512-3-1', 'c2e512', 7, '3', 'b) In the given figure, XY is diameter of the circle, PQ is a tangent to the circle at Y and PAB is a straight line. If ∠AXB = 50° and ∠ABX = 70°, calculate ∠BAY and ∠APY. [3]', 3, 'Circles', 'short', 1, 'c2e512__Internobil_p1_img_0_jpeg.webp', NULL),
  ('MQ-c2e512-3-2', 'c2e512', 8, '3', 'c) Find the ratio in which the point P (– 6, a) divides the join of A (–3, – 1) and B(– 8, 9). Also, find the value of a. [4]', 4, 'Coordinate Geometry', 'long', 1, NULL, NULL),
  ('MQ-c2e512-4-0', 'c2e512', 9, '4', 'a) A bag contains 5 white balls, 7 red balls, 4 black balls and 2 blue balls. One ball is drawn at random from the bag. What is the probability that the ball drawn is –

i) white or blue
ii) red or black
iii) neither white nor black? [3]', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-c2e512-4-1', 'c2e512', 10, '4', 'b) Using properties of proportion, solve for x: $$\frac{\sqrt{2} + \sqrt{2 - x}}{\sqrt{2} - \sqrt{2 - x}} = 3$$ [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-c2e512-4-2', 'c2e512', 11, '4', 'c) A girl fills a cylindrical bucket 32cm in height and 18cm in radius with sand. She empties the bucket on the ground and makes a conical heap of the sand. If the height of the conical heap is 24cm, find:

i) its radius and
ii) its slant height correct to one decimal place. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-c2e512-5-0', 'c2e512', 12, '5', 'a) Prove that a cyclic rhombus is a square. [3]', 3, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-c2e512-5-1', 'c2e512', 13, '5', 'b) The area of the base of a right circular cone is 28.26m². If its height is 4m, find its volume and the curved surface area (π = 3.14). [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-c2e512-5-2', 'c2e512', 14, '5', 'c) Mohan buys a washing machine from a wholesaler for Rupees 30,000. He marks the price of the washing machine 10% above the cost price and sells it to Sohan at a discount of 5% on the marked price. If the sale is Inter State and the rate of GST is 12%. Find:

i) the marked price of the washing machine
ii) the amount which Sohan pays to Mohan for the washing machine.
iii) the amount of tax paid by Mohan to the central Government.
iv) the amount of tax received by the state government. [4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-c2e512-6-0', 'c2e512', 15, '6', 'a) If $$X = \begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$$, show that $$6X - X^2 = 9I$$, where I is the Unit Matrix. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-c2e512-6-1', 'c2e512', 16, '6', 'b) Compute Mean for the following data (By step Deviation Method). [3]

| Marks | No. of students |
| --- | --- |
| Less than 10 | 12 |
| Less than 20 | 19 |
| Less than 30 | 35 |
| Less than 40 | 47 |
| Less than 50 | 58 |
| Less than 60 | 65 |
| Less than 70 | 84 |
| Less than 80 | 100 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-c2e512-6-2', 'c2e512', 17, '6', 'c) A boy of height 90cm is walking away from the base of a lamp post at a speed of 1.2ms⁻¹. If the lamp post is 3.6m above the ground, find the length of his shadow after 4 seconds. [4]', 4, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-c2e512-7-0', 'c2e512', 18, '7', 'a) Given equation of line L₁ is y = 3.

i) Write the slope of Line L₂ if L₂ is the bisector of angle YOX
ii) Write the co-ordinates of point P.
iii) Find the equation of \(\mathbf{L}_2\)

[3]', 3, 'Coordinate Geometry', 'short', 2, 'c2e512__Internobil_p3_img_0_jpeg.webp', NULL),
  ('MQ-c2e512-7-1', 'c2e512', 19, '7', 'b) Ashima has cumulative or Recurring Deposit Account in a bank for 5 years at \(9\%\) p.a. At the time of maturity, she gets Rs.51,607.50. Find the monthly instalment. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-c2e512-7-2', 'c2e512', 20, '7', 'c) Use a graph paper for this question. Plot points A (3, 2) and B \((-3, -2)\). From A and B draw perpendiculars AM and BN in the X-axis (take \(1\mathrm{cm} = 1\) unit on both the axes)

i) Name the image of A on reflection in the origin.
ii) Name the figure AMBN and find its area.
iii) Write the co-ordinates of the point to which M is mapped on reflection in X axis and Y axis. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-c2e512-8-0', 'c2e512', 21, '8', 'a) Prove the identity: $$\sqrt{\frac{1 - \tan^2 \theta}{\cot^2 \theta - 1}} = \tan \theta$$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-c2e512-8-1', 'c2e512', 22, '8', 'b) If \(\frac{3x - 4y}{2x - 3y} = \frac{5x - 6y}{4x - 5y}\), find \(x:y\) [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-c2e512-8-2', 'c2e512', 23, '8', 'c) A man observes the angle of elevation of the top of a building to be \(30^{\circ}\). He walks towards it in a horizontal line through its base. On covering \(40\mathrm{m}\), the angle of elevation changes to \(60^{\circ}\). Find the height of the building/correct to the nearest meter. [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-c2e512-9-0', 'c2e512', 24, '9', 'a) Given \( \mathrm{A} = \begin{bmatrix} -3 & -4 \\ 1 & 5 \end{bmatrix} \), \( \mathrm{B} = \begin{bmatrix} 2 & 3 \\ -1 & 0 \end{bmatrix} \) and \( \mathrm{C} = \begin{bmatrix} -1 & 0 \\ 3 & 2 \end{bmatrix} \), if \( \mathrm{P} = 2\mathrm{A} + \mathrm{BC} \), find the matrix \( \mathrm{P} \). [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-c2e512-9-1', 'c2e512', 25, '9', 'b) In the given figure, ABCD is a cyclic quadrilateral \(\angle CBQ = 48^{\circ}\) and \(a = 2b\). Calculate the value of a and b. [3]', 3, 'Circles', 'short', 3, 'c2e512__Internobil_p3_img_1_jpeg.webp', NULL),
  ('MQ-c2e512-9-2', 'c2e512', 26, '9', 'c) If the sum of x terms of an Arithmetic Progression (A.P.) is the same as the sum of its y terms, show that the sum of its (x + y) terms is zero. [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-c2e512-10-0', 'c2e512', 27, '10', 'a) Show that the points (0, 3), (6,0) and (4, 1) lie on a straight line. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-c2e512-10-1', 'c2e512', 28, '10', 'b) A solid right circular cone of height 20cm and base radius 15cm is melted and casted into smaller cones of equal sizes with height 5cm and base radius 1.5cm. How many cones are made? [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-c2e512-10-2', 'c2e512', 29, '10', '9) A 112cm long wire is bent to form a right angled triangle with hypotenuse 50cm. Find the area of the triangle so formed. [4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-c2e512-11-0', 'c2e512', 30, '11', 'a) The monthly income of a group of 320 workers in a firm is given below:

| Monthly Income (in Rs.) | Number of workers |
| --- | --- |
| 6000 - 7000 | 20 |
| 7000 – 8000 | 45 |
| 8000 – 9000 | 65 |
| 9000 – 10,000 | 95 |
| 10,000 – 11,000 | 60 |
| 11,000 – 12,000 | 30 |
| 12,000 – 13,000 | 5 |

Draw an Ogive for the given distribution. From the graph, determine:

i) the median wage.
ii) the number of workers whose income is below Rs.8,500.
iii) the upper Quartile. [6]', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-c2e512-11-1', 'c2e512', 31, '11', 'b) In the figure given below, ED and BC are two parallel chords of the circle and ABE and ACD are two straight lines. Prove that AED is an isosceles triangle. [4]', 4, 'Circles', 'long', 4, 'c2e512__Internobil_p4_img_0_jpeg.webp', NULL),
  ('MQ-5d726a-1-0', '5d726a', 0, '1', '1) The bill amount of an article is ₹ 5900 which includes GST at the rate of 18%. The marked price of the article without GST is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 5000', 'Rs 5900', 'Rs 5500', 'Rs 5200']::text[]),
  ('MQ-5d726a-1-1', '5d726a', 1, '1', '2) When the identity matrix is multiplied by any matrix A of the same order then the incorrect statement is:', 1, 'Matrices', 'MCQ', 1, NULL, array['$A \times I = A$', '$A = I \times A$', '$A \times I = I \times A$', '$A \times A = I$']::text[]),
  ('MQ-5d726a-1-2', '5d726a', 2, '1', '3) If $(x + 1)$ is a factor of the polynomial $2x^3 - 9x^2 + Kx - 10$ then $K$ is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['- 21', '- 1', '- 5', '0']::text[]),
  ('MQ-5d726a-1-3', '5d726a', 3, '1', '4) In a cyclic quadrilateral the sum of opposite angles is:', 1, 'Circles', 'MCQ', 1, NULL, array['360', '90', '270', '180']::text[]),
  ('MQ-5d726a-1-4', '5d726a', 4, '1', '5) 57, 54, 51, 48, ... ... ... ... are in Arithmetic Progression. The value of the 8th term is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['36', '78', '-36', '-78']::text[]),
  ('MQ-5d726a-1-5', '5d726a', 5, '1', '6) The point ( 0, -6) is invariant under reflection in the:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['x axis', 'y axis', 'origin', '$y = -6$']::text[]),
  ('MQ-5d726a-1-6', '5d726a', 6, '1', '7) This test can not be applied for similarity', 1, 'Similarity', 'MCQ', 1, NULL, array['Angle – Angle test', 'Side – angle side test', 'Right angle- hypotenuse side test', 'Side – side – side Test']::text[]),
  ('MQ-5d726a-1-7', '5d726a', 7, '1', '8) A cylinder of 4 cm diameter and 70 cm height has a volume of:

a) 80 m$^{3}$

c) 880 m$^{3}$

b) 8.8 m$^{3}$

d) 0.88 m$^{3}$', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-8', '5d726a', 8, '1', '9) The solution set for the linear inequation

$$-8 \leq x - 7 < -4$$

$x \in I$ is :

a) $\{-1 \leq x < 3 \quad x \in R\}$

c) $\{-1, 0, 1, 2\}$

b) none

d) $\{0, 1, 2, 3\}$', 1, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-9', '5d726a', 9, '1', '10) If the probability of finding a rotten mango in a basket is 0.09 then the probability of finding a good mango is:

a) 0.09

c) 9

b) 0.91

d) 0.89', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-10', '5d726a', 10, '1', '11) The angle in a semicircle is :

a) 90

c) 120

b) 180

d) 360', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-11', '5d726a', 11, '1', '12) Slope of a line parallel to Y axis is:

a) none

c) 0

b) 1

d) $\infty$', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-12', '5d726a', 12, '1', '13) If $A = \begin{bmatrix} -1 & -2 \\ 3 & 4 \end{bmatrix}$ ; $A^2$ :

a) None

c) $\begin{bmatrix} -5 & -6 \\ 9 & 10 \end{bmatrix}$

b) $\begin{bmatrix} -5 & -6 \\ -9 & -10 \end{bmatrix}$

d) $\begin{bmatrix} 1 & 4 \\ 9 & 16 \end{bmatrix}$', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-13', '5d726a', 13, '1', '14) The median of a grouped frequency distribution is found graphically by drawing:

a) Linear graph

c) histogram

b) Cumulative frequency curve

d) frequency polygon', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-5d726a-1-14', '5d726a', 14, '1', '15) Find 20$^{th}$ term of sequence: 9, 5, 1, -3, ... ... ...

a) -67

c) 67

b) -57

d) 0', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-5d726a-2-0', '5d726a', 15, '2', 'a) Katrina opened a recurring deposit account with a bank for two years, rate is 6% and monthly instalment is Rs 1000. Find

i. Interest earned in 2 years

ii. Matured value.

[4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-5d726a-2-1', '5d726a', 16, '2', 'b) If 4, x, 36, y are in continued proportion, find x, y. [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-5d726a-2-2', '5d726a', 17, '2', 'c) Prove $$\frac{\tan A + \sec A - 1}{\tan A + \sec A + 1} = \frac{1 + \sin A}{\cos A}$$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-5d726a-3-0', '5d726a', 18, '3', 'a) A heap of wheat is in the form of a cone of diameter 16.8 m and height is 3.5 m. Find volume. How much cloth is required to just cover the heap. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-5d726a-3-1', '5d726a', 19, '3', 'b) Write down the equation of the line whose gradient is $$\frac{3}{2}$$ and which passes through P, where P divides the line segment joining A (-2, 6) and B (3, -4) in the ratio of 2 : 3. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-5d726a-3-2', '5d726a', 20, '3', 'c) Using graph paper and taking 1 cm = 1 unit along both x axis & y axis, do the following: [5]

1. i. Plot points A (-4, 4) & B (2, 2)
2. ii. Reflect A and B in the origin to get the images A'' and B'' respectively.
3. iii. Write down the coordinates of A'' and B''.
4. iv. Find slope AA''
5. v. Find equation of line AA''', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-5d726a-4-0', '5d726a', 21, '4', 'a. The following bill shows the GST rates and the marked price of articles

BILL : General Store

| Articles | Marked price | Rate of GST |
| --- | --- | --- |
| A | ₹ 500 | 5% |
| B | ₹ 1600 | 12% |

Find the total amount to be paid for the above bill. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-5d726a-4-1', '5d726a', 22, '4', 'b. Solve the following quadratic equation. [3]

$$x^2 - 5x - 5 = 0$$

Give your answer correct to two places of decimal.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-5d726a-4-2', '5d726a', 23, '4', 'c. Draw a histogram to represent the following data and find the mode: [4]

| Pocket money in ₹ | 150 - 250 | 250 - 350 | 350 - 450 | 450 - 550 | 550 - 650 | 650 - 750 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 5 | 10 | 7 | 4 | 6 | 2 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-5d726a-5-0', '5d726a', 24, '5', 'a. If $\begin{bmatrix} 4 & 3 \\ -5 & 0 \end{bmatrix} \begin{bmatrix} x \\ -2 \end{bmatrix} = \begin{bmatrix} 6 \\ y \end{bmatrix}$ Find $x$ and $y$ . [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-5d726a-5-1', '5d726a', 25, '5', 'b. In the figure AB is a diameter of the circle with centre O and $CD\parallel BA$ . If $\angle CAB = 24^\circ$ .

Find i. $\angle DOC$ ii. $\angle DAC$ iii. $\angle ADC$ [3]', 3, 'Circles', 'short', 4, '5d726a__J_B_Petit__p4_img_0_jpeg.webp', NULL),
  ('MQ-5d726a-5-2', '5d726a', 26, '5', 'c. Factorise the given polynomial completely, using Remainder Theorem:

$$6x^3 + 25x^2 + 31x + 10.$$ [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-5d726a-6-0', '5d726a', 27, '6', 'a. $p(3, 4)$ . $Q(7, -2)$ , $R(-2, -1)$ are the vertices of triangle PQR. Write down the equation of the median of the triangle through R. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-5d726a-6-1', '5d726a', 28, '6', 'b. Prove that : $\frac{\text{Cosec } A-1}{\text{Cosec } A+1} = \left( \frac{\cos A}{1+\sin A} \right)^2$ [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-5d726a-6-2', '5d726a', 29, '6', 'c. The first, the last term and the common difference of an Arithmetic Progression are 98, 1001 and 7 respectively. Find the following for the given Arithmetic Progression [4]

- i. Number of terms ''n''
- ii. Sum of the ''n'' terms', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-5d726a-7-0', '5d726a', 30, '7', 'a. If two digit numbers are made with 3, 5, 7 and 9. What is the probability that the number is: [3]

- i. Greater than 55
- ii. A prime number

[3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-5d726a-7-1', '5d726a', 31, '7', 'b. A vessel is in the form of an inverted cone. Its height is 8 cm and the radius of its top is 3.5 cm. It is filled with water up to the rim. When marbles of radius 0.5 cm are dropped in to the vessel, $\frac{2}{7}$ of the water overflows. Find the number of marbles dropped into the vessel. [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-5d726a-7-2', '5d726a', 32, '7', 'c. Circle with centre O, RS parallel to QT $\angle PRT = 20$ $\angle POQ = 100$ [4]

Find $\angle QTR$, $\angle QRP$, $\angle QRS$, $\angle STR$.', 4, 'Circles', 'long', 5, '5d726a__J_B_Petit__p5_img_0_jpeg.webp', NULL),
  ('MQ-5d726a-8-0', '5d726a', 33, '8', 'a. Solve the following Inequation and write the solution set.

i. $13x - 5 < 15x + 4 < 7x + 12$ $x \in R$

Represent the solution on a real number line

[3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-5d726a-8-1', '5d726a', 34, '8', 'b. The weights of 50 apples were recorded as given below. Calculate the mean weight, to the nearest gram, by STEP DEVIATION METHOD.

| Wt in gms | 80-85 | 85-90 | 90-95 | 95-100 | 100-105 | 105-110 | 110-115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of apples | 5 | 8 | 10 | 12 | 8 | 4 | 3 |

[3]', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-5d726a-8-2', '5d726a', 35, '8', 'c. From the top of a cliff 60 m high, the angle of depression of the top and bottom of a tower are observed to be $30^\circ$ and $60^\circ$. Find the height of the tower. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-5d726a-9-0', '5d726a', 36, '9', 'a) Draw an inscribing circle of a regular hexagon of side 5.8 cm. [3]', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-5d726a-9-1', '5d726a', 37, '9', 'b) Solve for x, using the properties of proportion. [3]

$$\frac{x^3 + 3x}{3x^2 + 1} = \frac{341}{91}$$', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-5d726a-9-2', '5d726a', 38, '9', 'c) In the given diagram, ABC is s triangle and BCFD is a parallelogram.
AD : DB = 4 : 5 and EF = 15 cm.

Find:

i. AE : EC
ii. DE
iii. BC

[4]', 4, 'Similarity', 'long', 6, '5d726a__J_B_Petit__p6_img_0_jpeg.webp', NULL),
  ('MQ-5d726a-10-0', '5d726a', 39, '10', 'a) A shopkeeper buys a certain number of books for Rs 360. If the cost per book was Rs 5 less, the number of books that could be bought for Rs 360 would be one more. Taking the original cost of each book to be Rs x, solve it. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-5d726a-10-1', '5d726a', 40, '10', 'b) Use a graph sheet for this question. The daily wages of 120 workers working at a site are given below: [6]

| Wages(₹) | 250-300 | 300-350 | 350-400 | 400-450 | 450-500 | 500-550 | 550-600 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Workers | 8 | 15 | 20 | 30 | 25 | 15 | 7 |

Use 2 cm = ₹ 50 and 2 cm = 20 workers along x- axis and y - axis respectively to draw an ogive and hence estimate:

i. The median wages.
ii. The inter-quartile range of wages.
iii. Percentage of workers whose daily wage is above ₹ 475.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-64765f-1-0', '64765f', 0, '1', 'a) Mr. Gupta opened a recurring deposit account in a bank. He deposited ₹ 2,500 per month for two years. At the time of maturity, he got ₹ 67,500. Find

(i) the total interest earned by Mr. Gupta
(ii) the rate of interest per annum. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-64765f-1-1', '64765f', 1, '1', 'b) Given that x ∈ I, solve the inequation and graph the solution on the number line : [3]

$$3 \geq \frac{x - 4}{2} + \frac{x}{3} \geq 2$$', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-64765f-1-2', '64765f', 2, '1', 'c) Using the properties of proportion solve for x: [4]

$$\frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-64765f-2-0', '64765f', 3, '2', 'a) If t_n represents n^th term of an A.P. t_2 + t_5 - t_3 = 10 and t_2 + t_9 = 17, find its first term and its common difference. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-64765f-2-1', '64765f', 4, '2', 'b) A and B are two points on the x-axis and the y-axis respectively. P (2,-3) is the mid-point of AB. Find the [3]

- (i) coordinates of A and B
- (ii) slope of line AB
- (iii) equation of line AB.', 3, 'Coordinate Geometry', 'short', 2, '64765f__Jamnabai_N_p2_img_0_jpeg.webp', NULL),
  ('MQ-64765f-2-2', '64765f', 5, '2', 'c) In the following table, Σf = 200 and mean = 73. Find the missing frequencies f_1 and f_2.

[4]

| x | 0 | 50 | 100 | 150 | 200 | 250 |
| --- | --- | --- | --- | --- | --- | --- |
| f | 46 | f_1 | f_2 | 25 | 10 | 5 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-64765f-3-0', '64765f', 6, '3', 'a) In the figure, O is the centre of the circle, ∠AOE = 150°, ∠DAO = 51°. Calculate ∠CEB and ∠OCE. [3]', 3, 'Circles', 'short', 3, '64765f__Jamnabai_N_p3_img_0_jpeg.webp', NULL),
  ('MQ-64765f-3-1', '64765f', 7, '3', 'b) Solve the given equation and write your answer correct to two decimal places. [3]

$$2x - \frac{1}{x} = 7.$$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-64765f-3-2', '64765f', 8, '3', 'c) Nine cards (identical in all respects) are numbered 2 to 10. A card is selected from them at random. Find the probability that the card selected will be:

- (i) an even number.
- (ii) a multiple of 3.
- (iii) an even number and a multiple of 3.
- (iv) an even number or a multiple of 3. [4]', 4, 'Probability', 'long', 3, NULL, NULL),
  ('MQ-64765f-4-0', '64765f', 9, '4', '- a) A cylindrical vessel of height 24 cm and diameter 40 cm is full of water. Find the exact number of small cylindrical bottles, each of height 10 cm and diameter 8 cm, which can be filled with this water.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-64765f-4-1', '64765f', 10, '4', '- b) Find ''x'' and ''y'' if A² = B, A = $$\begin{bmatrix} 3 & x \\ 0 & 1 \end{bmatrix}$$ and B = $$\begin{bmatrix} 9 & 16 \\ 0 & -y \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-64765f-4-2', '64765f', 11, '4', 'c) Use graph paper for this question. The point P (3, 4) is reflected to P'' in the x-axis and O'' is the image of O (the origin) when reflected in the line PP''. Write

- (i) the co-ordinates of P'' and O''.
- (ii) the length of the segments PP'' and OO''.
- (iii) the geometrical name of the figure POP''O''. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-64765f-5-0', '64765f', 12, '5', 'a) In the figure given below, AB || CD and O is the centre of the circle.
If ∠ ADC = 25°; find the ∠ AEB. Give reasons in support of your answer. [3]', 3, 'Circles', 'short', 4, '64765f__Jamnabai_N_p4_img_0_jpeg.webp', NULL),
  ('MQ-64765f-5-2', '64765f', 13, '5', 'c) Using the Remainder Theorem, factorise the expression 3x³ + 10x² + x - 6.
Hence, solve the equation 3x³ + 10x² + x - 6 = 0. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-64765f-6-0', '64765f', 14, '6', 'a) Calculate the ratio in which the line joining the points (-3, -1) and (5, 7) is divided by the line x = 2. Also, find the co-ordinates of the point of intersection. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-64765f-6-1', '64765f', 15, '6', 'b) If y is the mean proportion between x and z, prove that [3]

$$\frac{x^2 - y^2 + z^2}{x^{-2} - y^{-2} + z^{-2}} = y^4.$$', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-64765f-6-2', '64765f', 16, '6', 'c) A girl goes to her friend''s house, which is at a distance of 12 km. She covers half of the distance at a speed of x km/hr and the remaining distance at a speed of (x + 2) km/hr. If she takes 2 hrs 30 minutes to cover the whole distance, find ''x''. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-64765f-7-0', '64765f', 17, '7', 'a) Given ∠GHE = ∠DFE = 90°, DH = 8, DF = 12, DG = 3x + 1 and DE = 4x + 2.
Find the lengths of segments DG and DE. [3]', 3, 'Similarity', 'short', 5, '64765f__Jamnabai_N_p5_img_0_jpeg.webp', NULL),
  ('MQ-64765f-7-1', '64765f', 18, '7', 'b) A heap of wheat is in the form of a cone of diameter 16.8 m and height 3.5 m. Find its volume. How much cloth is required to just cover the heap? [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-64765f-7-2', '64765f', 19, '7', 'c) A 20 m high vertical pole and a vertical tower are on the same level ground in such a way that the angle of elevation of the top of the tower, as seen from the foot of the pole is 60° and the angle of elevation of the top of the pole, as seen from the foot of the tower is 30°. Find:

(i) the height of the tower.

(ii) the horizontal distance between the pole and the tower. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-64765f-8-0', '64765f', 20, '8', 'a) AB is the diameter and AC is the chord of a circle with centre O such that ∠BAC=30°. The tangent to the circle at C intersects AB produced in D. Show that BC = BD.

[3]', 3, 'Circles', 'short', 5, '64765f__Jamnabai_N_p5_img_1_jpeg.webp', NULL),
  ('MQ-64765f-8-1', '64765f', 21, '8', 'b) Prove:

$$\frac{\sin \theta \tan \theta}{1 - \cos \theta} = 1 + \sec \theta$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-64765f-8-2', '64765f', 22, '8', 'c) For a dealer A, the list price of an article is ₹ 9000, which he sells to dealer B at some lower price. Further, dealer B sells the same article to a customer at its list price. If the rate of GST is 18% and dealer B paid a tax, under GST, equal to ₹ 324 to the government, find the amount (inclusive of GST) paid by dealer B. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-64765f-9-0', '64765f', 23, '9', 'a) P (3, 4), Q (7, -2) and R (-2, -1) are the vertices of triangle PQR. Write down the equation of the median of the triangle through R. [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-64765f-9-1', '64765f', 24, '9', 'b) Show that \( M^{2}=2M+3I \) where I is the unit matrix and \( M=\begin{bmatrix}1&2\\ 2&1\end{bmatrix} \) [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-64765f-9-2', '64765f', 25, '9', 'c) The expression \( 2x^{3} + ax^{2} + bx - 14 \) leaves a remainder 52 when divided by (x-3) and (x-2) is a factor of it. Find the values of ‘a’ and ‘b’. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-64765f-10-0', '64765f', 26, '10', 'a) Find the value of ‘m’ if the following equation has equal roots:

\[
(m - 2) x ^ {2} - (5 + m) x + 1 6 = 0 \tag {3}', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-64765f-10-1', '64765f', 27, '10', 'b) A line intersects the x-axis at the point \( (-2, 0) \) and cuts off an intercept of 3 units from the positive side of the y-axis. Find the equation of the line. [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-64765f-10-2', '64765f', 28, '10', 'c) The distribution given below shows the marks obtained by 25 students in an aptitude test. Find the mean and the median of the distribution. [4]

| Marks Obtained | 15 | 16 | 17 | 18 | 19 | 20 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 2 | 7 | 6 | 5 | 4 | 1 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-64765f-11-0', '64765f', 29, '11', 'a) In the figure given below, O is the centre of the circle. \(\angle DAE = 70^{\circ}\). Find giving suitable reasons, the measure of

i. \( \angle BCD \)
ii. \( \angle BOD \)
iii. \( \angle OBD \)

[4]', 4, 'Circles', 'long', 6, '64765f__Jamnabai_N_p6_img_0_jpeg.webp', NULL),
  ('MQ-64765f-11-1', '64765f', 30, '11', 'b) The monthly income of a group of 320 employees in a company is given below: [6]

| Monthly Income (thousands) | No. of Employees |
| --- | --- |
| 6-7 | 20 |
| 7-8 | 45 |
| 8-9 | 65 |
| 9-10 | 95 |
| 10-11 | 60 |
| 11-12 | 30 |
| 12-13 | 5 |

Draw an Ogive of the given distribution on a graph paper taking 2 cm = ₹ 1000 on one axis and 2 cm = 50 employees on the other axis. From the graph determine:

i. The median wage.
ii. Number of employees whose income is below ₹ 8500.
iii. If the salary of a senior employee is above ₹ 11,500, find the number of senior employees in the company.', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-42e281-1-0', '42e281', 0, '1', '(i) Ishaan deposited ₹400 every month in a bank’s recurring deposit account for 30 months. If he gets ₹1085 as interest at the time of maturity, then the rate of interest per annum is ____________', 1, 'GST and Banking', 'MCQ', 1, NULL, array['\(7\%\)', '\(8\%\)', '\(9\%\)', '\(6\%\)']::text[]),
  ('MQ-42e281-1-1', '42e281', 1, '1', '(ii) The solution to the inequation $3x - 3 < 27 - 2x \leq 3x + 7$ where $x \in R$ is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['$\{4, 5, 6\}$', '\(\{x: -4 < x \leq 6, x \in R\}\)', '\(\{x: -6 \leq x < 4, x \in R\}\)', '\(\{x: 4 \leq x < 6, x \in R\}\)']::text[]),
  ('MQ-42e281-1-2', '42e281', 2, '1', '(iii) If the order of matrix A is p x n and matrix B is n x p then the order of matrix BA is', 1, 'Matrices', 'MCQ', 2, NULL, array['n x p', 'n x n', 'p x p', 'p x n']::text[]),
  ('MQ-42e281-1-3', '42e281', 3, '1', '(iv) If $x : y = 3 : 4$, then $(7x+3y) : (7x-3y)$ is equal to', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['3:11', '11:3', '4:3', '5:2']::text[]),
  ('MQ-42e281-1-4', '42e281', 4, '1', '(v) The roots of the quadratic equation $12x^2 + 4kx + 3 = 0$ are real and equal, if', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['\( \mathrm{k} = +3 \) or -3', '\( \mathrm{k} = +9 \) or -9', '\( \mathrm{k} = +3 \)', '\( \mathrm{k} = -9 \)']::text[]),
  ('MQ-42e281-1-5', '42e281', 5, '1', '(vi) A solid metallic sphere of radius 6 cm is melted and made into a solid cylinder of height 32 cm. The radius of the cylinder is', 1, 'Mensuration', 'MCQ', 2, NULL, array['3', '1.5', '4', '6']::text[]),
  ('MQ-42e281-1-6', '42e281', 6, '1', '(vii) If $\Delta ABC \sim \Delta DEF$ and $\frac{AB}{DE} = \frac{BC}{FD}$ then', 1, 'Similarity', 'MCQ', 2, NULL, array['\(\angle A = \angle F\)', '\(\angle B = \angle D\)', '\(\angle A = \angle D\)', '\(\angle B = \angle E\)']::text[]),
  ('MQ-42e281-1-7', '42e281', 7, '1', '(viii) The sum of three numbers in an A.P. is 9 and their product is 24, then the numbers are', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['2, 3, 4', '2, 8, 4', '1, 5, 3', '2, 4, 6']::text[]),
  ('MQ-42e281-1-8', '42e281', 8, '1', '(ix) The mean proportional between 8 and 128 is', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['64', '32', '16', '8']::text[]),
  ('MQ-42e281-1-9', '42e281', 9, '1', '(x) $$5 \sec^2 A - 5 \tan^2 A + 1$$ is equal to', 1, 'Trigonometry', 'MCQ', 3, NULL, array['6', '-4', '4', '7']::text[]),
  ('MQ-42e281-1-10', '42e281', 10, '1', '(xi) The point (0, -5) is invariant when reflected in', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['the line \( \mathbf{x} = -5 \)', 'the x-axis', 'the y-axis', 'the origin']::text[]),
  ('MQ-42e281-1-11', '42e281', 11, '1', '(xii) The base radii of two circular cones of the same height are in the ratio 3:5. The ratio of their volumes is', 1, 'Mensuration', 'MCQ', 3, NULL, array['9:25', '3:5', '25:3', '3:8']::text[]),
  ('MQ-42e281-1-12', '42e281', 12, '1', '(xiii) If (x-2) is a factor of $$2x^3 - x^2 - px - 2$$ find the value of ''p''.', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-4', '5', '-5', '2']::text[]),
  ('MQ-42e281-1-13', '42e281', 13, '1', '(xiv) The angle of depression of a car, standing on the ground, from the top of a 75m high tower is 30°. The distance of the car from the base of the tower is (in m) is:', 1, 'Trigonometry', 'MCQ', 4, NULL, array['\(25\sqrt{3}\)', '\(50\sqrt{3}\)', '\(75\sqrt{3}\)', '150']::text[]),
  ('MQ-42e281-1-14', '42e281', 14, '1', '(xv) A ticket is drawn at random from a bag containing tickets numbered from 1 to 40. The probability that the selected ticket has a number which is a multiple of 4 and 5 is', 1, 'Probability', 'MCQ', 4, NULL, array['\(1 / 5\)', '1/10', '1/20', '9/20']::text[]),
  ('MQ-42e281-2-0', '42e281', 15, '2', '(i) A retailer buys a TV set for ₹ 20,000. He marks it 25% above his cost price and gives a discount of 10% to a consumer on the Marked Price. The rate of GST is 18%. Calculate:

(a) the marked price of the TV set.
(b) the GST paid by the retailer to the government.
(c) the price paid by the consumer inclusive of GST.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-42e281-2-1', '42e281', 16, '2', '(ii) Cards numbered from 0 to 50 are kept in a box. If a card is drawn at random from the box, find the probability that the number on the drawn card is:

(a) a perfect square.
(b) divisible by 3 or 4.
(c) a prime number less than 20.
(d) a factor of 12.', NULL, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-42e281-2-2', '42e281', 17, '2', '(iii) Find the value of `a`, if (x + 2) is a factor of ax³ - x² - 20x - 12. Hence, factorize the polynomial completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-42e281-3-0', '42e281', 18, '3', '(i) Solve for x, using properties of proportion:

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-42e281-3-1', '42e281', 19, '3', '(ii)

AB is the diameter of the circle with centre O. AB || DC, ∠ABD = 26⁰. [4]

Find ∠DAB and ∠DEC.', 4, 'Circles', 'long', 5, '42e281__Jamnabai_N_p5_img_0_jpeg.webp', NULL),
  ('MQ-42e281-4-0', '42e281', 20, '4', '(i) Solve \( 2x^{2} - 13x + 17 = 0 \) and write your answer correct to three significant figures. [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-42e281-4-1', '42e281', 21, '4', '(ii) Tanisha deposits a certain sum of money every month in a recurring deposit scheme for 5 years at \(6\%\) per annum. If the amount payable to her at the time of maturity of the account is \(\text{元} 55320\), find the monthly instalment. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-42e281-4-2', '42e281', 22, '4', '(iii) Find the Mode of the given distribution. [4]

| C.I. | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 |
| --- | --- | --- | --- | --- | --- | --- |
| f | 5 | 9 | 16 | 22 | 26 | 18 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-42e281-5-0', '42e281', 23, '5', '(i) If M = $$\begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$$ and N = $$\begin{bmatrix} 4 & 3 \\ 5 & 1 \end{bmatrix}$$

find M² - MN', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-42e281-5-1', '42e281', 24, '5', '(ii) In the given figure, AD || BC and ∠ABC = 90° = ∠ACD, AB = 12 cm and BC = 16 cm. Find lengths of CD and AD.', 3, 'Similarity', 'short', 6, '42e281__Jamnabai_N_p6_img_0_jpeg.webp', NULL),
  ('MQ-42e281-5-2', '42e281', 25, '5', '(iii) The centroid of triangle ABC is (-1, 4). If A = (5, -6) and B = (-2, 3) then find [4]

a. the coordinates of C
b. the equation of line parallel to BC and passing through A.', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-42e281-6-0', '42e281', 26, '6', '(i) Draw a circle of diameter \(9\mathrm{cm}\). Take a point \(\mathbf{P}\) at a distance of \(7.5\mathrm{cm}\) from the centre of the circle. Draw tangents PA and PB to the circle and measure their lengths.', NULL, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-42e281-6-1', '42e281', 27, '6', '(ii) Prove that: \((\cos \sec A - \sin A)(\sec A - \cos A)(\tan A + \cot A) = 1\) [3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-42e281-6-2', '42e281', 28, '6', '(iii) Use step-deviation method to find the mean of the following distribution. [4]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 10 | 9 | 25 | 30 | 16 | 10 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-42e281-7-0', '42e281', 29, '7', '(i) Solve the following inequation and represent the solution on the number line. [3]

$$4x - 19 < \frac{3x}{5} - 2 \le x - \frac{2}{5}, x \in R$$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-42e281-7-1', '42e281', 30, '7', '(ii) Find the sum: [3]

$$1 + (-3) + (-7) + (-11) + \dots \dots \dots + (-315).$$', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-42e281-7-2', '42e281', 31, '7', '(iii) The surface area of a solid metallic sphere is 5024 cm². It is melted and recast into 128 solid cones of radius 5 cm. Find the [4]

a. the radius of the sphere

b. the height of the cone

(Take π = 3.14)', 4, 'Mensuration', 'long', 6, NULL, NULL),
  ('MQ-42e281-8-0', '42e281', 32, '8', '(i) Tangent to the circle at T and chord RQ extended meet at point P. If PQ = 4.5 cm [3] and QR = 13.5 cm, find the length of the tangent PT.', 3, 'Circles', 'short', 7, '42e281__Jamnabai_N_p7_img_0_jpeg.webp', NULL),
  ('MQ-42e281-8-1', '42e281', 33, '8', '(ii) If a, b, c are in continued proportion, then prove that [3]

$$(a^2 - b^2)(b^2 + c^2) = (b^2 - c^2)(a^2 + b^2)$$', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-42e281-8-2', '42e281', 34, '8', '(iii) A box contains some blue, yellow and red marbles. The probability of selecting a blue marble is ¼ and yellow marble is 1/3. If the box contains 10 red marbles, then find [4]

a. probability of selecting a red marble.
b. total number of marbles in the box
c. probability of selecting a white marble.', 4, 'Probability', 'long', 7, NULL, NULL),
  ('MQ-42e281-9-0', '42e281', 35, '9', '(i) Points A and B have coordinates (7, -3) and (1, 9) respectively. Find the equation of the perpendicular bisector of line AB. [3]', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-42e281-9-1', '42e281', 36, '9', '(ii) AT and BT are tangents to the circle with centre O. C and D are points on the circle. \(\angle TAD = 32^{\circ}\) and \(\angle TBD = 28^{\circ}\). Find \(\angle ACB\), \(\angle AOB\), \(\angle ATB\). [3]', 3, 'Circles', 'short', 7, '42e281__Jamnabai_N_p7_img_1_jpeg.webp', NULL),
  ('MQ-42e281-9-2', '42e281', 37, '9', '(iii) The angles of elevation of an airplane which is vertically over a point between two observers on the ground are found to be 60° and 45° respectively. Find the height of the airplane if the observers are 1000 m apart. (Write the answer to the nearest metre) [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-42e281-10-0', '42e281', 38, '10', '(i) Aarav bought some pens for ₹ 360. When the price of each was reduced by Rs.3, he [4] could buy 6 more pens for the same cost of ₹ 360. Find the original cost of the pen.', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-42e281-10-1', '42e281', 39, '10', '(ii) Use a graph paper to answer this question.
The marks obtained by 200 students in a test are given below: [6].

| Marks | No. of students |
| --- | --- |
| 0-10 | 5 |
| 10-20 | 10 |
| 20-30 | 14 |
| 30-40 | 21 |
| 40-50 | 25 |
| 50-60 | 34 |
| 60-70 | 36 |
| 70-80 | 27 |
| 80-90 | 16 |
| 90-100 | 12 |

Draw an Ogive taking 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis. Find

(i) the Median.
(ii) the number of students who obtained more than 65 marks in the test.
(iii) the Upper-Quartile Range.
(iv) If 10 students qualify for merit scholarship, find the minimum marks required to qualify.', 6, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-ad2ac4-1-0', 'ad2ac4', 0, '1', '(i) Siddhant deposited ₹500 every month in a bank''s recurring deposit account and receives ₹ 16,550 as maturity value. If he earns ₹ 1550 as interest at the time of maturity, then find the time for which the account is held. __________', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1 year', '2 years', '1 ½ years', '2 ½ years']::text[]),
  ('MQ-ad2ac4-1-1', 'ad2ac4', 1, '1', '(ii) Which of the given solution sets does the diagram below represent?', 1, 'Linear Inequations', 'MCQ', 2, 'ad2ac4__Jamnabai_X_p2_img_0_jpeg.webp', array['$\{-2, -1, 0, 1, 2, 3\}$', '$\{x: -2 < x \leq 4, x \in R\}$', '$\{x: -2 \leq x < 4, x \in R\}$', '$\{x: -2 \leq x < 4, x \in I\}$']::text[]),
  ('MQ-ad2ac4-1-2', 'ad2ac4', 2, '1', '(iii) If $X \begin{bmatrix} 2 & 1 \\ -3 & 4 \end{bmatrix} = \begin{bmatrix} 2 & 4 \end{bmatrix}$ then the order of matrix $X$ is', 1, 'Matrices', 'MCQ', 2, NULL, array['$1 \times 2$', '$1 \times 1$', '$2 \times 2$', '$2 \times 1$']::text[]),
  ('MQ-ad2ac4-1-3', 'ad2ac4', 3, '1', '(iv) If $a: b = 5:3$ , then the value of $-\frac{9a-3b}{5a+3b}$ is', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['$\frac{9}{15}$', '$\frac{3}{7}$', '$\frac{8}{17}$', '$\frac{4}{21}$']::text[]),
  ('MQ-ad2ac4-1-4', 'ad2ac4', 4, '1', '(v) The roots of the quadratic equation $2x^2 - 9x + 13 = 0$ are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['real and equal', 'irrational and unequal', 'are imaginary', 'rational and unequal']::text[]),
  ('MQ-ad2ac4-1-5', 'ad2ac4', 5, '1', '(vi) If the volume of a cylinder is $1200 \text{ cm}^3$ , then the volume of a cone with the same radius and height as that of the cylinder will be', 1, 'Mensuration', 'MCQ', 2, NULL, array['$3600 \text{ cm}^3$', '$600 \text{ cm}^3$', '$400 \text{ cm}^3$', '$2400 \text{ cm}^3$']::text[]),
  ('MQ-ad2ac4-1-6', 'ad2ac4', 6, '1', '(vii)
In the given circle with diameter AB, find the value of ''x''.', 1, 'Circles', 'MCQ', 3, 'ad2ac4__Jamnabai_X_p3_img_0_jpeg.webp', array['\(30^{\circ}\)', '\(40^{\circ}\)', '\(60^{\circ}\)', '\(45^{\circ}\)']::text[]),
  ('MQ-ad2ac4-1-7', 'ad2ac4', 7, '1', '(viii) Which term of the AP 27, 24, 21, ... is zero?', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['9', '10', '11', '12']::text[]),
  ('MQ-ad2ac4-1-8', 'ad2ac4', 8, '1', '(ix) The value of the y-intercept in the equation x + 2y = 4 is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['4', '\(-\frac{1}{2}\)', '2', '\( \frac{1}{2} \)']::text[]),
  ('MQ-ad2ac4-1-9', 'ad2ac4', 9, '1', '(x) The point of intersection of the perpendicular bisectors of the sides of a triangle is called the', 1, 'Loci', 'MCQ', 3, NULL, array['ortho-centre', 'in-centre', 'circum-centre', 'median']::text[]),
  ('MQ-ad2ac4-1-10', 'ad2ac4', 10, '1', '(xi) If (4, -6) is the image of A when reflected in the x-axis, then the point A is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['\((-4, -6)\)', '\((-4,6)\)', '(4, 6)', '(4, -6)']::text[]),
  ('MQ-ad2ac4-1-11', 'ad2ac4', 11, '1', '(xii) $$- \sec^2 A + \tan 45^\circ + \tan^2 A$$', 1, 'Trigonometry', 'MCQ', 4, NULL, array['0', '3', '2', '1']::text[]),
  ('MQ-ad2ac4-1-12', 'ad2ac4', 12, '1', '(xiii) Find the remainder when $$4x^3 + 6x^2 - 8x - 10$$ is divided by $$(2x + 1)$$.', 1, 'Factorisation and Remainder Theorem', 'MCQ', 4, NULL, array['-4', '5', '-5', '2']::text[]),
  ('MQ-ad2ac4-1-13', 'ad2ac4', 13, '1', '(xiv) If the inter-quartile range is 21 and the upper quartile is 73 in a given distribution, then the value of the lower quartile is', 1, 'Statistics', 'MCQ', 4, NULL, array['50', '52', '- 52', '94']::text[]),
  ('MQ-ad2ac4-1-14', 'ad2ac4', 14, '1', '(xv) If 3 coins are tossed, what is the probability of getting at most one head?

(a) $$\frac{1}{2}$$

(b) 3/8

(c) 7/8

(e) 5/8', 1, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-ad2ac4-2-0', 'ad2ac4', 15, '2', '(i) Use the remainder theorem to factorize the following expression:

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-ad2ac4-2-1', 'ad2ac4', 16, '2', '(ii) The volume and the base area of a right circular conical vessel are $$9856 \text{ cm}^3$$ and $$616 \text{ cm}^2$$ respectively. Find the curved surface area of the vessel.

[4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-ad2ac4-2-2', 'ad2ac4', 17, '2', '(iii) Find the equation of the line through the point of intersection of the lines $$2x + 5y = 9$$ and $$5x - 2y = 8$$ and perpendicular to the line $$4x + 3y = 7$$.

[4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-ad2ac4-3-0', 'ad2ac4', 18, '3', '(i)

If the Mean of the given distribution is 78, find the value of ''p''.

| C.I. | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 | 100-110 |
| --- | --- | --- | --- | --- | --- | --- |
| f | 1 | 8 | 10 | p | 4 | 2 |

[4]', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-ad2ac4-3-1', 'ad2ac4', 19, '3', '(ii)

In the figure below, ABCD is a cyclic quadrilateral. AT is a tangent, ∠ABC = 112° and ∠BAT = 38 Find ∠ADC, ∠AOC and ∠CAB.

[4]', 4, 'Circles', 'long', 5, 'ad2ac4__Jamnabai_X_p5_img_0_jpeg.webp', NULL),
  ('MQ-ad2ac4-3-2', 'ad2ac4', 20, '3', '(iii)

Use a graph paper for this question.

[5]

a. Plot A (0, 5), B (2, 5), C (3, 2)
b. Reflect B and C on the y-axis and name them B'', C'' respectively and write their co-ordinates.
c. Reflect C and C'' in the x-axis and name them D and D'' respectively and write their co-ordinates.
d. Name the figure formed by joining B, C, D, D'', C'', B'', B in order.', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-ad2ac4-4-0', 'ad2ac4', 21, '4', '(i) The numbers (k+3), (k+2), (3k-7) and (2k-3) are in continued proportion. Find ''k''. [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-ad2ac4-4-1', 'ad2ac4', 22, '4', '(ii) Aryan has a recurring deposit account of ₹ 500 per month for 3 years. If he gets ₹ 2220 as interest, find the rate of interest and the maturity value of the investment. [3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-ad2ac4-4-2', 'ad2ac4', 23, '4', '(iii) Two dice are rolled simultaneously. Find the probability: [4]

(a) of obtaining a total of at least 10
(b) of getting a prime number on each dice
(c) that the product of the numbers is 12
(d) that the sum of the numbers is less than 5', 4, 'Probability', 'long', 6, NULL, NULL),
  ('MQ-ad2ac4-5-0', 'ad2ac4', 24, '5', '(i) If M = [2 sin 30 - 4 cos 60 / 2 cos 0 - √3 tan 90] find the matrix ''N'' if M² - M = 2/N. [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-ad2ac4-5-1', 'ad2ac4', 25, '5', '(ii) ABCD is a rectangle, AB = 12 cm and BC = 8 cm. E is a point on BC such that BE = 5 cm. AE produced meets DC produced at F. [3]

i. Prove that \(\Delta\) ABE \(\sim \Delta\) FCE
ii. Find the lengths of EF and CF.', 3, 'Similarity', 'short', 6, 'ad2ac4__Jamnabai_X_p6_img_0_jpeg.webp', NULL),
  ('MQ-ad2ac4-5-2', 'ad2ac4', 26, '5', '(iii) Sanjana bought the following items from a shop.

| Items | Rate per item in ₹ | Rate of GST |
| --- | --- | --- |
| Trousers | 1200 | 18% |
| Shirts | 950 | 12% |
| Camera | 18000 | 28% |
| Olive oil | 520 | 5% |

Find: a. SGST paid b. total bill amount paid by Sanjana [4]', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-ad2ac4-6-0', 'ad2ac4', 27, '6', '(i) Construct a regular hexagon of side 5 cm. Construct a circle circumscribing the hexagon. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-6-1', 'ad2ac4', 28, '6', '(ii) Prove that: $$\frac{\cos A}{\text{cosec } A+1} + \frac{\cos A}{\text{cosec } A-1} = 2 \tan A$$ [3]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-6-2', 'ad2ac4', 29, '6', '(iii) Use short-cut method to find the mean of the following distribution. [4]

| Wages | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 5 | 8 | 30 | 25 | 14 | 12 | 6 |', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-ad2ac4-7-0', 'ad2ac4', 30, '7', '(i) Solve the following inequation and represent the solution on the number line. $$-2\frac{5}{6} < \frac{1}{2} - \frac{2x}{3} \le 2, x \in I$$ [3]', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-7-1', 'ad2ac4', 31, '7', '(ii) In what ratio does the line y = 2 divide the line joining the points A (6,5) and B (4, -3)? Find the coordinates of the point of intersection. [3]', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-7-2', 'ad2ac4', 32, '7', '(iii) In the given circle, chords DB and EC intersect externally at A. [4]

a. Prove that AB x AD = AC = AE.
b. If AB = 4 cm, DB = 6 cm, AC = 5 cm and BC = 4.5 cm, find EC and DE.', 4, 'Circles', 'long', 7, 'ad2ac4__Jamnabai_X_p7_img_0_jpeg.webp', NULL),
  ('MQ-ad2ac4-8-0', 'ad2ac4', 33, '8', '(i) Without solving the following quadratic equation, find the value of p for which the given equation has equal roots. $$(p + 6)x^2 + (p - 2)x + 1 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-8-1', 'ad2ac4', 34, '8', '(ii) A certain number of metallic cylinders each of radius 2 cm and height 3 cm are melted and recast into a solid sphere of radius 6 cm. Find the number of cylinders. [3]', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-ad2ac4-8-2', 'ad2ac4', 35, '8', '(iii) The sum of first 6 terms of an AP is 63. The ratio of its 10th term to its 20th term is 1:2. Find the AP. [4]', 4, 'Arithmetic Progression', 'long', 7, NULL, NULL),
  ('MQ-ad2ac4-9-0', 'ad2ac4', 36, '9', '(i) SGST on an AC is 14% and the price of the AC including GST is ₹ 57,600. [3]
What is the

- a. rate of GST?
- b. price of AC before GST?
- c. amount of CGST paid?', 3, 'GST and Banking', 'short', 8, NULL, NULL),
  ('MQ-ad2ac4-9-1', 'ad2ac4', 37, '9', '(ii) Using properties of proportion solve for ''x'': [3]

$$\frac{x^4 + 1}{2x^2} = \frac{17}{8}$$', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-ad2ac4-9-2', 'ad2ac4', 38, '9', '(iii) Three years ago, a father''s age was the square of his son''s age. Six years hence, his [4]
age will be thrice his son''s age. Find their present ages.', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-ad2ac4-10-0', 'ad2ac4', 39, '10', '(i) When a building under construction was observed from a point R, 120 m from its base the angle of elevation of the top was 30°. After its completion when it was again observed from the same point, the angle changed to 60°. How much higher was the building raised, from the time it was first observed?', NULL, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-ad2ac4-10-1', 'ad2ac4', 40, '10', '(ii) The monthly income of a group of 320 employees in a company is given below:

| Monthly Income | No. of Employees |
| --- | --- |
| 6000-7000 | 20 |
| 7000-8000 | 45 |
| 8000-9000 | 65 |
| 9000-10000 | 95 |
| 10000-11000 | 60 |
| 11000-12000 | 30 |
| 12000-13000 | 5 |

Draw an Ogive on a graph sheet taking 2 cm = Rs.1000 on one axis and 2 cm = 50 employees on the other axis. From the graph determine:

- (i) the Median wage.
- (ii) the number of employees whose income is below 8500.
- (iii) the Upper- Quartile.
- (iv) If the salary of a senior employee is above 11,500, find the number of senior employees in the company.', NULL, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-6ac7ab-1-0', '6ac7ab', 0, '1', 'a) Sheela opened a recurring deposit account in a bank and deposited Rs200 per month for 3 years at 13% per annum interest. Find the maturity value. [5m]', 5, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-1-1', '6ac7ab', 1, '1', 'b) i) The midpoint of a line joining the points A (1,2a+1) and B(3b,3) is (5,-4).Find the values of a and b.[3m]', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-6ac7ab-1-2', '6ac7ab', 2, '1', 'ii) If G(-3,4) is the centroid of a triangle whose vertices are A(6,2), B(x,3) and C(0,y), find the values of x and y [2m]', 2, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-6ac7ab-2-0', '6ac7ab', 3, '2', 'a) The curved surface area of a cylindrical pillar of radius 7m is \( 264 \, m^{2} \) . Find:
i) The height of the pillar ii) The volume of the pillar [Take \( \pi = \frac{22}{7} \) ] [5m]', 5, 'Mensuration', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-2-1', '6ac7ab', 4, '2', 'b) Find a if the two polynomials \( ax^{3} + 3x^{2} - 9 \) and \( 2x^{3} + 4x + a \) leave the same remainder when divided by \( (x+3) \) . [5m]', 5, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-3-0', '6ac7ab', 5, '3', 'a) Anamika has recurring deposit account for 2 years at 10% per annum interest. If she gets Rs7950 at the time of maturity, find the monthly installment. [5m]', 5, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-3-1', '6ac7ab', 6, '3', 'b) Calculate the ratio in which the line segment joining A(3,4) and B(-2,1) is divided by Y-axis. Also find the coordinates of the point of intersection. [5m]', 5, 'Coordinate Geometry', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-4-0', '6ac7ab', 7, '4', 'a) Prove that: \(\frac{\tan\theta}{\sec\theta - 1} + \frac{\tan\theta}{\sec\theta + 1} = 2\cosec\theta\) [5m]', 5, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-4-1', '6ac7ab', 8, '4', 'b) The circumference of the base of a cone is 44cm and the slant height is 25cm. Find the volume of the cone. [Take \(\pi = \frac{22}{7}\)] [5m]', 5, 'Mensuration', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-5-0', '6ac7ab', 9, '5', 'a) If \( x^{3} + ax^{2} + bx - 20 \) has \( (x - 2) \) as factor, and leaves a remainder \( -2 \), when divided by \( (x - 3) \), find the values of a and b. [5m]', 5, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-6ac7ab-5-1', '6ac7ab', 10, '5', 'b) A metal cone of base radius 9cm and height 4cm is melted and recast into a cylinder of height 3cm, find the radius of the cylinder. [5m]', 5, 'Mensuration', 'long', 1, NULL, NULL),
  ('MQ-24cd75-1-0', '24cd75', 0, '1', 'a. Without solving the following equations, find the value of p, for which the given equation has equal roots. [3]

$$4 x^2 + (p - 2) x + 1 = 0$$', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-24cd75-1-1', '24cd75', 1, '1', 'b. A man invested ₹ 10,000 in 8% , ₹ 25 shares at ₹ 40. After a year, he sold these shares at ₹42 each and invested the proceeds (including his dividend) in 9% , ₹ 10 shares at ₹ 11. Find : [4]

(i) His dividend for the first year.
(ii) New number of shares he buys.
(iii) The percentage increase in his return on his original investment.', 4, 'Shares and Dividends', 'long', 1, NULL, NULL),
  ('MQ-24cd75-1-2', '24cd75', 2, '1', 'c. Use the Remainder Theorem to factorise the following expression:

$$2 x^3 + x^2 - 13x + 6.$$', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-24cd75-2-0', '24cd75', 3, '2', 'a. Jai has a recurring deposit account of ₹ 400 per month at 10% per annum. If he gets ₹ 260 as interest at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-24cd75-2-1', '24cd75', 4, '2', 'b. Find the values of x, which satisfies the following inequation. [3]

$$-2 \leq \frac{1}{2} - \frac{2x}{3} \leq 1\frac{5}{6}, x \in N.$$

Graph the solution set on the number line.', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-24cd75-2-2', '24cd75', 5, '2', 'c. The surface area of a solid metallic sphere is 2464 cm². It is melted and recast into solid right circular cones of radius 3.5 cm and height 7 cm. Calculate: [4]

(i) The radius of the sphere.

(ii) The number of cones recast. (Take $x = \frac{22}{7}$).', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-24cd75-3-0', '24cd75', 6, '3', 'a. In the figure below ∠ABC = 70°, ∠ACB = 50°, PT is a tangent to the circle at point T and CT is a diameter. Calculate measure of (i) ∠CBT (ii) ∠BAT and (iii) ∠APT [3]', 3, 'Circles', 'short', 2, '24cd75__Jns_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-24cd75-3-1', '24cd75', 7, '3', 'b. Prove that: $$\frac{\tan^2\theta}{\tan^2\theta - 1} + \frac{\cos^2\theta}{\sin^2\theta - \cos^2\theta} = \frac{1}{3 - 2\cos^2\theta}$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-24cd75-3-2', '24cd75', 8, '3', 'c. Find the mean and median of the following frequency distribution. [4]

| x | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- |
| f | 5 | 4 | 2 | 6 | 3 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-24cd75-4-0', '24cd75', 9, '4', 'a. How many terms of G.P. 3, $\frac{3}{2}$, $\frac{3}{4}$, ... are needed to give the sum $\frac{186}{32}$? [3]', 3, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-24cd75-4-1', '24cd75', 10, '4', 'b. If A = $\begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}$ and I = $\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ find A² - 5A + 7I [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-24cd75-4-2', '24cd75', 11, '4', 'c. Use graph paper and take scale 1cm=1 unit along X and Y axis. Plot the points A(-2,2) and B(4,4). [4]

Reflect A and B in the origin to get A'' and B'' respectively.

(i) Write down the co-ordinates of A'' and B''.

(ii) Give the geometrical name for the figure ABA''B''.

$$\begin{array}{r} 2 \\ -2, -2 \\ 2 \\ -4, -4 \end{array}$$', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-24cd75-5-0', '24cd75', 12, '5', 'a. A wholesaler buys a TV from a manufacturer for ₹25,000. He marks the price of the TV 20% above the cost price and sells it to a retailer at a discount of 10% on the marked price. If the rate of GST is 28%, find:

(i) The marked price.
(ii) Retailer''s cost price inclusive of tax.
(iii) GST paid by the wholesaler.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-24cd75-5-1', '24cd75', 13, '5', 'b. Write down the equation of the line whose slope is 3/2 and which passes through P, where P divides the line segment joining A (-2, 6) and B (3, -4) in the ratio 2 : 3.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-24cd75-5-2', '24cd75', 14, '5', 'c. A circus tent in the form of a cylinder is surmounted by a cone. The height of the tent is 13m and the height of the cylinder is 8m. If the diameter of its base is 24m, calculate the total surface area of the tent to the nearest m² (π = 22/7).', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-24cd75-6-0', '24cd75', 15, '6', 'a. Construct the circumcircle to the triangle ABC in which \(AB = 5\mathrm{cm}\), \(BC = 8\mathrm{cm}\) and \(\angle ABC = 60^{\circ}\). If ABCD is a cyclic quadrilateral such that D is equidistant from B and C, find \(\angle ADC\).', NULL, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-24cd75-6-1', '24cd75', 16, '6', 'b. If two digit numbers are made with 2, 3, 5, what is the probability that the number is

(i) Greater than 35
(ii) A multiple of 2
(iii) A prime number', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-24cd75-6-2', '24cd75', 17, '6', 'c. In the given diagram, AC is the diameter of the circle, with centre O. CD and BE are parallel. ∠AOB = 80° and angle ∠ACE = 10°. Find:

(i) \(\angle BEC,\)
(ii) \(\angle BCD,\)
(iii) \(\angle CED\)', NULL, 'Circles', 'short', 3, '24cd75__Jns_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-24cd75-7-0', '24cd75', 18, '7', 'a. Find \(21 + 18 + 15 + \dots \dots -81\)', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-24cd75-7-1', '24cd75', 19, '7', 'b. Find the equation of a line, which has the y intercept 4, and is parallel to the line \(2x - 3y = 7\). Find the coordinates of the point, where it cuts the x-axis.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-24cd75-7-2', '24cd75', 20, '7', 'c. Determine the mean of the following frequency distribution by Short cut method:

[4]

| C.I. | 10-16 | 16-22 | 22-28 | 28-34 | 34-40 |
| --- | --- | --- | --- | --- | --- |
| frequency | 1 | 10 | 5 | 3 | 6 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-24cd75-8-0', '24cd75', 21, '8', 'a. 6 is the mean proportion between two numbers x and y, and 48 is the third proportional to x and y. Find the numbers.', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-24cd75-8-1', '24cd75', 22, '8', 'b. In the given figure, PQ = QR, ∠RQP = 68°, PC and CQ are tangents to the circle with centre O. Calculate the values of:

(i) ∠QOP

(ii) ∠QCP', NULL, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-24cd75-8-2', '24cd75', 23, '8', 'c. If x³ + ax² - x + b has (x - 2) as a factor and leaves a remainder 3 when divided by (x - 3), find ''a'' and ''b''.', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-24cd75-9-0', '24cd75', 24, '9', 'a. A factory produces 1200 units in the third year and 1400 units in the seventh year. Assuming that the production increases uniformly by a fixed number year, find the production in i) the first year ii) 8th year.', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-24cd75-9-1', '24cd75', 25, '9', 'b. The dimensions of the model of a multistoried building are 1m by 60 cm by 1.20m. If the scale factor is 1:50, find:

(i) The floor area of a room of the building in m², if the floor area of the corresponding room in the model is 50 cm².

(ii) The space inside a room of the model, if the space inside the corresponding room of the building is 90 m³.', NULL, 'Similarity', 'short', 4, NULL, NULL),
  ('MQ-24cd75-9-2', '24cd75', 26, '9', 'c. An aeroplane at a height of 6 km passes vertically above another plane at an instant when their angles of elevation at the same observing point are 60° and 45° respectively. Find the difference between the heights of the planes.', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-24cd75-10-0', '24cd75', 27, '10', 'a. If M x [1 1; 0 2] = [1 2] find :

(i) The order of matrix M

(ii) The matrix M', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-24cd75-10-1', '24cd75', 28, '10', 'b. Given that (a³+3ab²)/(b³+3a²b) = 62/63, Using Componendo and Dividendo, find a : b', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-24cd75-10-2', '24cd75', 29, '10', 'c. In the given figure, $\Delta ABC$ and $\Delta CEF$ are two triangles
where $BA$ is parallel to $CE$ and $AF$ : $AC = 5 : 8$.

(i) Prove that $\Delta ADF \sim \Delta CEF$.

(ii) Find $AD$ if $CE = 6$ cm.

(iii) If $DF$ is parallel to $BC$,
find area ($\Delta ADF$) : area ( $\square$ ) $DFCB$

[4]', 4, 'Similarity', 'long', 5, '24cd75__Jns_X_Math_p5_img_0_jpeg.webp', NULL),
  ('MQ-24cd75-11-0', '24cd75', 30, '11', 'a. Draw an ogive for the following table about the monthly wages of workers in a factory: [6]

| Wages (₹) | 400-450 | 450-500 | 500-550 | 550-600 | 600-650 | 650-700 | 700-750 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 2 | 6 | 12 | 18 | 24 | 13 | 5 |

Use a graph paper to draw an ogive for the above distribution.

(Use a scale of 2 cm = ₹ 50 on x-axis and 2 cm = 10 workers on y-axis).

Use your ogive to estimate:

(i) The median wage of the workers.

(ii) Interquartile range.

(iii) The number of workers who earn more than ₹ 625 daily.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-24cd75-11-1', '24cd75', 31, '11', 'b. Some students planned a picnic. The budget for the food was ₹2400. Since 8 of them failed to join the party, the cost of the food for each member increased by ₹50. Find how many students went to the picnic. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-54d4a8-1-0', '54d4a8', 0, '1', '(i) If the remainder, when $a - 2x + 5x^2$ is divided by $(x - 2)$, is 7 then the value of $a$ is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['3', '- 7', '8', '- 9.']::text[]),
  ('MQ-54d4a8-1-1', '54d4a8', 1, '1', '(ii) A certain sum of money is deposited in a recurring deposit account for 15 months. If
the interest earned for this deposit is one-fifth of the monthly instalment, the rate of
interest is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['6%', '2%', '10%', '4%.']::text[]),
  ('MQ-54d4a8-1-2', '54d4a8', 2, '1', '(iii) If $\Delta ABC \sim \Delta PQR$, $BC = 8 \text{ cm}$ and $QR = 6 \text{ cm}$, then area of $\Delta ABC$ : area of $\Delta PQR$ is:', 1, 'Similarity', 'MCQ', 1, NULL, array['8:6', '3:4', '9:16', '16:9']::text[]),
  ('MQ-54d4a8-1-3', '54d4a8', 3, '1', '(iv) In the figure, PQ and PR are tangents drawn from
an external point P to a circle with centre O such
that $\angle PRQ = 60^{\circ}$. Then $\angle OQR$ is', 1, 'Circles', 'MCQ', 1, '54d4a8__La_Martini_p1_img_0_jpeg.webp', array['$25^{\circ}$', '$30^{\circ}$', '$40^{\circ}$', '$60^{\circ}$.']::text[]),
  ('MQ-54d4a8-1-4', '54d4a8', 4, '1', '(v) If $\sin \theta + \cos \theta = 1$, then the value of $\sin \theta \cos \theta$ is', 1, 'Trigonometry', 'MCQ', 1, NULL, array['2', '0', '1', '$\frac{1}{2}$.']::text[]),
  ('MQ-54d4a8-1-5', '54d4a8', 5, '1', '(vi) If the volume and surface area of a sphere are numerically equal, then the radius of the sphere is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['0 unit', '1 unit', '2 unit', '3 unit.']::text[]),
  ('MQ-54d4a8-1-6', '54d4a8', 6, '1', '(vii) A survey of 20 students showed a mean height of 158 cm. If a student''s height was incorrectly recorded as 180 cm instead of 160 cm, what would be the effect on the mean?', 1, 'Statistics', 'MCQ', 2, NULL, array['increases by 1 cm', 'decreases by 1 cm', 'No change', 'increases by 20 cm.']::text[]),
  ('MQ-54d4a8-1-7', '54d4a8', 7, '1', '(viii) When a die is thrown, the probability of getting an odd number less than 3 is', 1, 'Probability', 'MCQ', 2, NULL, array['$\frac{1}{6}$', '$\frac{1}{3}$', '$\frac{1}{2}$', '0.']::text[]),
  ('MQ-54d4a8-1-8', '54d4a8', 8, '1', '(ix) If $\begin{bmatrix} 0 & 3 \\ 1 & 5 \end{bmatrix} = \begin{bmatrix} a - 2 & b \\ x & y + 1 \end{bmatrix}$, then which of the following relations is correct?', 1, 'Matrices', 'MCQ', 2, NULL, array['$ab = xy$', '$a + y = b + x$', '$a + b = x + y$', '$a + x = b + y$.']::text[]),
  ('MQ-54d4a8-1-9', '54d4a8', 9, '1', '(x) The table shows the values of $x$ and $y$, where $x$ is proportional to $y$:
| x | 6 | 12 | p |
| --- | --- | --- | --- |
| y | q | 18 | 6 |
The values of $p$ and $q$ are', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['$p = 9, q = 4$', '$p = 3, q = 9$', '$p = 4, q = 9$', '$p = 0, q = 12$.']::text[]),
  ('MQ-54d4a8-1-10', '54d4a8', 10, '1', '(xi) A buys certain goods for ₹ 4,000 and sells them to B at a profit of ₹ 500. If B does not sell the goods further and the rate of GST is 5%, the tax liability on A is', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 225', '₹ 175', '₹ 25', '₹ 0.']::text[]),
  ('MQ-54d4a8-1-11', '54d4a8', 11, '1', '(xii) A company declares a dividend of 9% on its shares of face value ₹ 80. If a shareholder holds 600 shares, what is the total dividend he receives?', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['₹4320', '₹4500', '₹5200', '₹5400.']::text[]),
  ('MQ-54d4a8-1-12', '54d4a8', 12, '1', '(xiii) Which of the following options is valid for the given statements?
Statement 1: $3x^2 - 6x + 3 = 0$ has repeated roots.
Statement 2: The equation $ax^2 + bx + c = 0$ has repeated roots if discriminant D > 0.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['Both the statements are true.', 'Both the statements are false.', 'Statement 1 is true, statement 2 is false', 'Statement 2 is true, statement 1 is false.']::text[]),
  ('MQ-54d4a8-1-13', '54d4a8', 13, '1', '(xiv) If points A(1, -2), O(0, 0) and C(x, y) are collinear then:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$x + 2y = 0$', '$x - 2y = 0$', '$2x + y = 0$', '$2x - y = 0$.']::text[]),
  ('MQ-54d4a8-1-14', '54d4a8', 14, '1', '(xv) If $x \in R$, the solution set of $6 \leq -3(2x - 4) < 12$ is', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['$\{x: x \in R, 0 < x < 1\}$', '$\{x: x \in R, 0 \leq x < 1\}$', '$\{0, 1\}$', 'none of these.']::text[]),
  ('MQ-54d4a8-2-0', '54d4a8', 15, '2', '(i) $f(x) = ax^2 + bx + 2$ and $g(x) = bx^2 + ax + 1$ are two polynomials. If $(x - 2)$ is a factor of $f(x)$ but leaves the remainder $-15$ when it divides $g(x)$, find the values of $a$ and $b$.', NULL, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-54d4a8-2-1', '54d4a8', 16, '2', '(ii) Find the following with reference to the adjoining figure:

(a) the equation of the line segment BC,

(b) the ratio in which P divides line segment AB and

(c) the equation of the line segment PQ.', NULL, 'Coordinate Geometry', 'short', 3, '54d4a8__La_Martini_p3_img_0_jpeg.webp', NULL),
  ('MQ-54d4a8-2-2', '54d4a8', 17, '2', '(iii) In the given figure, AB is a diameter, DO // CB and $\angle DCB = 120^\circ$. Calculate:', NULL, 'Circles', 'short', 3, '54d4a8__La_Martini_p3_img_1_jpeg.webp', NULL),
  ('MQ-54d4a8-3-0', '54d4a8', 18, '3', '(f) How many terms of the G.P. 3,9,27, 81, ... must be taken to make the sum 3279?

[4]', 4, 'Geometric Progression', 'long', 3, NULL, NULL),
  ('MQ-54d4a8-3-1', '54d4a8', 19, '3', '(ii) A cylindrical vessel of diameter 14 cm contains water. A solid right circular cylinder of diameter 11.2 cm and height 10 cm is completely immersed in this water. Find the rise in the level of water.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-54d4a8-3-2', '54d4a8', 20, '3', '(iii) Study the graph and answer the following questions:

[S]

(a) State the co-ordinates of the image of C under reflection in the x-axis.

(b) If B is the image of A under reflection, what is the equation of the mirror line?

(c) Find the coordinates of E, which is the image of D under reflection in a line on which A and B are invariant points.

(d) Name the closed figure formed by joining the points A, D, B, E and A in order.', 5, 'Coordinate Geometry', 'long', 4, '54d4a8__La_Martini_p4_img_0_jpeg.webp', NULL),
  ('MQ-54d4a8-4-0', '54d4a8', 21, '4', '(i) Mr. Parekh invested ₹ 52000 on ₹ 100 shares at a discount of ₹ 20 paying 8% dividend. At the end of one year, he sells the shares at a premium of ₹ 20. Find:

(a) the annual dividend (b) profit earned including his dividend. [3]', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-54d4a8-4-1', '54d4a8', 22, '4', '(ii) Solve the linear inequation, write the solution set and represent it on the number line:

$$1 \geq 15 - 7x > 2x - 27, x \in R \tag{3}$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-54d4a8-4-2', '54d4a8', 23, '4', '(iii) Prove that $$(\text{cosec } \theta - \sin \theta)(\sec \theta - \cos \theta) = \frac{1}{\tan \theta + \cot \theta}.$$ [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-54d4a8-5-0', '54d4a8', 24, '5', '(i) In $$\Delta PQR$$, L and M are two points on the base QR, such that $$\angle LPQ = \angle QRP$$ and $$\angle RPM = \angle RQP$$. Prove that: [3]

(a) $$\Delta PQL \sim \Delta RPM$$ (b) $$QL.RM = PL.PM$$', 3, 'Similarity', 'short', 4, '54d4a8__La_Martini_p4_img_1_jpeg.webp', NULL),
  ('MQ-54d4a8-5-1', '54d4a8', 25, '5', '(ii) In a recurring deposit for 2 years, the total amount deposited is ₹ 7200. If the interest earned by him is $$\frac{5}{2}$$ times of his monthly deposit, then find the following: [3]

- (a) The monthly deposit
- (b) The maturity amount
- (c) Rate of interest.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-54d4a8-5-2', '54d4a8', 26, '5', '(iii) Using step deviation, calculate the mean marks of the following distribution. [4]

| Class interval | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 20 | 10 | 10 | 9 | 6 | 12 | 8 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-54d4a8-6-0', '54d4a8', 27, '6', '(i) The line x - 4y = 6 is the perpendicular bisector of the line segment AB and the coordinates of B are (1, 3). Find the co-ordinates of A. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-54d4a8-6-1', '54d4a8', 28, '6', '(ii) In the given figure, QAP is the tangent at the point A and PBD is a straight line. If ∠ACB = 36° and ∠APB = 42°, find:

(a) ∠BAP, (b) ∠ABD, (c) ∠BCD. [3]', 3, 'Circles', 'short', 5, '54d4a8__La_Martini_p5_img_0_jpeg.webp', NULL),
  ('MQ-54d4a8-6-2', '54d4a8', 29, '6', '(iii) Mrs. Dixit bought the following items from a Mall

| Sl No | Item | MRP (in ₹) | Discount (in %) | GST (in %) |
| --- | --- | --- | --- | --- |
| 1. | QLED Smart TV | 25,000 | 15% | 18% |
| 2. | Electric Scooter | 80,000 | 10% | 28% |

Find: (a) Total GST paid to Government,
(b) Amount paid by Mrs. Dixit.

[4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-54d4a8-7-0', '54d4a8', 30, '7', '(i) A man standing on the top of a vertical tower observes a car moving towards the tower at a uniform speed. If it takes 10 minutes for the angle of depression to change from 30° to 45°, how soon after this will the car reach the tower? Give your answer correct to one decimal place. (Take √3 = 1.73) [5]', 5, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-54d4a8-7-1', '54d4a8', 31, '7', '(a) Name the curve plotted
(b) Estimate the median marks.

(c) If the pass percentage was 50, find the number of students who did not pass the test.
(d) Determine the upper quartile from the graph.
(e) If scoring \(85\%\) above makes a student qualify, how many students qualified in the test?', NULL, 'Statistics', 'short', 6, '54d4a8__La_Martini_p6_img_0_jpeg.webp', NULL),
  ('MQ-54d4a8-8-0', '54d4a8', 32, '8', '(i) A child has a dice whose six faces show the letters as given below.
(3) The dice is thrown once. What is probability of getting
(a) A, (b) either A or B, (c) neither A nor B.', NULL, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-54d4a8-8-1', '54d4a8', 33, '8', '(ii) Using the properties of proportion, solve for $$\frac{3x + \sqrt{9x^2 - 5}}{3x + \sqrt{9x^2 - 5}} = 5.$$ [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-54d4a8-8-2', '54d4a8', 34, '8', '(iii) A medicine capsule is in the shape of a cylinder with two hemispheres stuck to each ends as shown in the figure. The capsule is half filled uniformly with medicine.

Find:

(a) The volume of the medicine.

(b) The surface area of capsule which is not in contact with the medicine. (Use π = 3.14) [4]', 4, 'Mensuration', 'long', 7, '54d4a8__La_Martini_p7_img_0_jpeg.webp', NULL),
  ('MQ-54d4a8-9-0', '54d4a8', 35, '9', '(i) The daily wages of obtained by workers is given below: [3]

| Daily Wages | 400-440 | 440-480 | 480-520 | 520-560 | 560-600 | 600-640 |
| --- | --- | --- | --- | --- | --- | --- |
| No of Workers | 8 | 12 | 20 | 25 | 17 | 10 |

Draw a Histogram to estimate the modal wage of the workers.', 3, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-54d4a8-9-1', '54d4a8', 36, '9', '(ii) The first term, last term and sum of all the terms present in the Arithmetic Progression are 5, 45 and 500 respectively. Find the following: [3]

(a) No of terms present in the A.P
(b) The Common Difference of the A.P', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-54d4a8-9-2', '54d4a8', 37, '9', '(iii) In a flight of 600 km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 km/hr and the time of flight increased by 30 minutes. Find the duration of flight. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-54d4a8-10-0', '54d4a8', 38, '10', '(i) Find the values of ''a'' for which the quadratic equation $$x^2 - (3a - 1)x + (2a^2 + 2a - 11) = 0$$ has equal roots. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-54d4a8-10-1', '54d4a8', 39, '10', '(ii) Find x and y if $$\begin{bmatrix} x & 2y \\ 3y & 4x \end{bmatrix} \begin{bmatrix} 2 \\ -1 \end{bmatrix} = \begin{bmatrix} y - 4 \\ 5x + 3 \end{bmatrix}$$. [3]', 3, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-54d4a8-10-2', '54d4a8', 40, '10', '(iii) Construct a circle of radius 5 cm. Mark two chords AB and BC of the circle of length 6 cm and 7 cm respectively. [4]

(a) Draw the locus of the points, inside the circle, which is equidistant from A and B.
(b) Draw the locus of the points, inside the circle which is equidistant from CA and CB.', 4, 'Constructions', 'long', 7, NULL, NULL),
  ('MQ-728eae-1-0', '728eae', 0, '1', '(i). Given $$\begin{bmatrix} x & y \\ z & w \end{bmatrix} \times X = [p \quad q]$$. The order of the matrix X is', 1, 'Matrices', 'MCQ', 1, NULL, array['$$2 \times 2$$', '$$1 \times 2$$', '$$2 \times 1$$', '$$1 \times 1$$.']::text[]),
  ('MQ-728eae-1-1', '728eae', 1, '1', '(ii). Which of the following is not a quadratic equation?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['$$3(x + 1)^2 = 2x^2 + x + 4$$', '$$5x + 2x^2 = x^2 + 9$$', '$$(x^2 - 2)^2 = x^4 + 3 + 4x^2$$', '$$(\sqrt{2}x + \sqrt{3})^2 = 2x^2 - 3x$$.']::text[]),
  ('MQ-728eae-1-2', '728eae', 2, '1', '(iii). The SGST paid by a customer to the shopkeeper for an article, which is priced at ₹ x, is ₹ 30. If the sales are intra-state and the rate of GST charged is 5%, then x is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['600', '1200', '1.50', '3.']::text[]),
  ('MQ-728eae-1-3', '728eae', 3, '1', '(iv). The value(s) of k, for which the quadratic equation $$2x^2 - kx + k = 0$$ has equal roots, is(are):', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['0 only', '4 only', '8 only', '0 and 8.']::text[]),
  ('MQ-728eae-1-4', '728eae', 4, '1', '(v). If the product of the first three terms of a G.P is 27, then the second term of the G.P is:', 1, 'Geometric Progression', 'MCQ', 2, NULL, array['1', '2', '3', '4.']::text[]),
  ('MQ-728eae-1-5', '728eae', 5, '1', '(vi). The value of x, such that 35, x, 7, 5 are in proportion, is', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['49', '25', '37.5', '15.']::text[]),
  ('MQ-728eae-1-6', '728eae', 6, '1', '(vii). If $$\Delta ABC \sim \Delta PQR$$ and $$\angle A = 65^\circ, \angle R = 45^\circ$$, then $$\angle C$$ is:', 1, 'Similarity', 'MCQ', 2, NULL, array['$$65^\circ$$', '$$45^\circ$$', '$$110^\circ$$', '$$70^\circ$$.']::text[]),
  ('MQ-728eae-1-7', '728eae', 7, '1', '(viii). If the radius r of a cylinder is halved and the height h is doubled, then the volume of the cylinder will be:', 1, 'Mensuration', 'MCQ', 2, NULL, array['$$\frac{1}{2}\pi r^2 h$$', '$$\frac{2}{3}\pi r^2 h$$', '$$\frac{1}{6}\pi r^2 h$$', '$$\frac{1}{4}\pi r^2 h$$.']::text[]),
  ('MQ-728eae-1-8', '728eae', 8, '1', '(ix). Which of the following cannot be the probability of an event?', 1, 'Probability', 'MCQ', 2, NULL, array['0.75', '$$\frac{5}{6}$$', '0.002%', '$$\frac{9}{5}$$.']::text[]),
  ('MQ-728eae-1-9', '728eae', 9, '1', '(x). The locus of a point Q so that $$AQ^2 + BQ^2 = AB^2$$, where points A and B are two fixed points, is:', 1, 'Loci', 'MCQ', 2, NULL, array['a straight line', 'circumference of the circle with AB as diameter', 'Circumference of the circle with AQ as diameter', 'Circumference of the circle with BQ as diameter.']::text[]),
  ('MQ-728eae-1-10', '728eae', 10, '1', '(xi). The point P (-6, -3) is reflected in line $$y + 3 = 0$$ to point P''. The co-ordinates of point P'' are:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(-6,3)', '(-6, -3)', '(6,3)', '(6, -3).']::text[]),
  ('MQ-728eae-1-11', '728eae', 11, '1', '(xii). What is the height of the tree, when its shadow is 84 m long and at the same time a girl 2 m high standing in the same straight line casts a shadow 12 m?
10- Math - 2/8 (LMB)', 1, 'Similarity', 'MCQ', 2, '728eae__La_Martini_p3_img_0_jpeg.webp', array['14 m', '24 m', '6 m', '12 m.']::text[]),
  ('MQ-728eae-1-12', '728eae', 12, '1', '(xiii). If a person invests ₹ 19,200 in ₹ 50 shares at a premium of 20%, then the number of shares he buys is', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['640', '384', '320', '160.']::text[]),
  ('MQ-728eae-1-13', '728eae', 13, '1', '(xiv). The line joining the points (2, -1) and (5, -6) is bisected at point A. The value of m, if the point A lies on the line 2x + 4y + m = 0, is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['2', '4', '7', '8.']::text[]),
  ('MQ-728eae-1-14', '728eae', 14, '1', '(xv). Assertion (A): Two congruent triangles are always similar.
Reason(R): If the areas of two similar triangles are equal, then they are congruent.', 1, 'Similarity', 'MCQ', 3, NULL, array['Both A and R are correct. R is the correct explanation to A.', 'Both A and R are correct. R is not the correct explanation to A.', 'A is true but R is false.', 'A is false but R is true.']::text[]),
  ('MQ-728eae-2-0', '728eae', 15, '2', '(a) A toy is in the form of a cone of radius \(3.5\mathrm{cm}\) mounted on a hemisphere of the same radius. The total height of the toy is \(15.5\mathrm{cm}\). find the total surface area of the toy. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-728eae-2-1', '728eae', 16, '2', '(a) Punam opened recurring deposit account with Bank of Baroda for \(1\frac{1}{2}\) years. If the rate of interest is \(6\%\) per annum and the bank pays \(\text{₹} 11,313\) on maturity, find how much did she deposit each month. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-728eae-2-2', '728eae', 17, '2', '(c) Prove that: $$\frac{\tan A}{1 - \cot A} + \frac{\cot A}{1 - \tan A} = \sec A \text{ cosec } A + 1.$$

[4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-728eae-3-0', '728eae', 18, '3', '(a) If $$\frac{a^3+3ab^2}{3a^2b+b^3} = \frac{x^3+3xy^2}{3x^2y+y^3}$$, show that $$\frac{x}{a} = \frac{y}{b}$$.

[4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-728eae-3-1', '728eae', 19, '3', '(b) ABCD is a cyclic quadrilateral in which $$\angle DAC = 27^{\circ}$$, $$\angle DBA = 50^{\circ}$$ and $$\angle ADB = 33^{\circ}$$.

Calculate the following:

(i) \(\angle DBC\)
(ii) \(\angle DCB\)
(iii) \(\angle CAB\)', 4, 'Circles', 'long', 4, '728eae__La_Martini_p4_img_0_jpeg.webp', NULL),
  ('MQ-728eae-3-2', '728eae', 20, '3', '(c) With reference to the graph given below answer the following questions:

[4]

(i). Name the curve represented by the graph.

(ii). What is the median wage of the employees?

(iii). How many employees have income below ₹8500?

(iv). If the salary of a senior employee is above ₹11500, find the number of senior employees in the company. State the upper quartile.

[5]', 5, 'Statistics', 'long', 4, '728eae__La_Martini_p4_img_1_jpeg.webp', NULL),
  ('MQ-728eae-4-0', '728eae', 21, '4', '(a) Given \( A = \begin{bmatrix} x & 0 \\ 0 & 2 \end{bmatrix} \), \( B = \begin{bmatrix} 0 & -y \\ 1 & 0 \end{bmatrix} \), \( C = \begin{bmatrix} 2 & -2 \\ 2 & 2 \end{bmatrix} \) and \( BA = C^2 \), find the values of \( x \) and \( y \). [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-728eae-4-1', '728eae', 22, '4', '(b) Solve the equation \(5x(x + 2) = 3\) and express your answer correct to 3 significant figures. (You may use mathematical tables for this question). [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-728eae-4-2', '728eae', 23, '4', '(c)

In the figure, D is a point on BC such that ∠ABD = ∠CAD. If AB = 5 cm, AC = 3 cm and AD = 4 cm, find:

(i) BC,
(ii) DC,
(iii) area of \(\Delta\) ACD: area of \(\Delta\) BCA. [4]', 4, 'Similarity', 'long', 5, '728eae__La_Martini_p5_img_0_jpeg.webp', NULL),
  ('MQ-728eae-5-0', '728eae', 24, '5', '(a) The following table shows the marks scored by a set of students in an examination. Calculate the mean of the distribution by using short-cut method. [3]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 3 | 8 | 14 | 9 | 4 | 2 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-728eae-5-1', '728eae', 25, '5', '(b) Kavita buys the following items from a departmental store: [3]

| Items | Quantity | Rate | GST |
| --- | --- | --- | --- |
| Brown Rice | 4 kg | ₹ 80/kg | 5% |
| Butter | 2 kg | ₹ 300/kg | 12% |
| Shampoo | 500 ml | ₹ 175 | 18% |

Find the total amount of bill to be paid (including GST).', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-728eae-5-2', '728eae', 26, '5', '(c) In the given figure, O is the centre of the circle. The tangents at B and D in each other at P. If AB is parallel to CD and ∠ABC = 55°, find: (i) ∠BOD, (ii) ∠BPD.', NULL, 'Circles', 'short', 6, '728eae__La_Martini_p6_img_0_jpeg.webp', NULL),
  ('MQ-728eae-6-0', '728eae', 27, '6', '(a) In a G.P, the third term is 24 and the sixth term is 192. Find its tenth term.', NULL, 'Geometric Progression', 'short', 6, NULL, NULL),
  ('MQ-728eae-6-1', '728eae', 28, '6', '(b) The daily wages of 30 employees in an establishment are distributed as follows:

| Daily ages (in ₹) | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| No of employees | 1 | 8 | 10 | 5 | 4 | 2 |

Find the modal daily wages for this distribution by a graphical method.

(Take 2 cm = ₹10 along one axis and 2 cm = 1 employee along the other axis) [3]', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-728eae-6-2', '728eae', 29, '6', '(c) A solid consisting of a right circular cone, standing on a hemisphere, is placed upright in a right circular cylinder full of water and touches the bottom. Find the volume of water left in the cylinder if the object is completely immersed in the cylinder. Give you answer correct to nearest cubic cm. [4]', NULL, 'Mensuration', 'short', 6, '728eae__La_Martini_p6_img_1_jpeg.webp', NULL),
  ('MQ-728eae-7-0', '728eae', 30, '7', '(a) Consider triangle ABC with the given vertices as shown in the figure. AD is a median and AM is the altitude through A.
(i). Find the coordinates of \( D \).
(ii). Find the equation of median through A.
(iii). Find the equation of altitude through A.

[5]', 5, 'Coordinate Geometry', 'long', 6, '728eae__La_Martini_p6_img_2_jpeg.webp', NULL),
  ('MQ-728eae-7-1', '728eae', 31, '7', '(b) The lower window of a house is at a height of 2 m above the ground and its upper window is 4 m vertically above the lower window. At a certain instant, the angles of elevation of a balloon from these windows are observed to be 60° and 30° respectively. Find the height of the balloon above the ground. [5]', 5, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-728eae-8-0', '728eae', 32, '8', '(a) Solve the following inequation, write the solution set and represent it on the number line.

$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x, x \in N.$$ [3]', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-728eae-8-1', '728eae', 33, '8', '(b) In the given figure, QAP is the tangent at the point A and PBD is a straight line. If ∠ACB = 36° and ∠APB = 42°, find: (i) ∠BAP, (ii) ∠QAD, (iii) ∠BCD. [3]', 3, 'Circles', 'short', 7, '728eae__La_Martini_p7_img_0_jpeg.webp', NULL),
  ('MQ-728eae-8-2', '728eae', 34, '8', '(c) Given a line segment EF joining the points E (-4, 6) and F (8, -3). Find the following:

(i) the ratio in which \(EF\) is divided by the Y-axis,
(ii) the coordinates of the point of intersection by theY-axis,
(iii) slope of the line segment EF,
(iv) Equation of the line segment EF. [4]', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-728eae-9-0', '728eae', 35, '9', '(a) Solve for x using properties of proportion:

[3] $$\frac{\sqrt{12x+1}-\sqrt{2x-3}}{\sqrt{12x+1}-\sqrt{2x-3}} = \frac{3}{2}.$$', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-728eae-9-1', '728eae', 36, '9', '(b) A bus covers a distance of 240 km at a auniform speed. Due to heavy rain its speed gets reduced by 10km/h and as such it takes 2 hours longer to cover the total distance. Find the speed of the bus. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-728eae-9-2', '728eae', 37, '9', '(c) Using ruler and compass only for this question: [4]

(i). Construct \(\Delta ABC\), where \(AB = 3.5 \, \text{cm}\), \(BC = 6 \, \text{cm}\) and \(\angle ABC = 60^\circ\).
(ii). Construct the locus of points inside the triangle which are equidistant from \( BA \) and \( BC \).

10- Math - 7/8 (LMB)
(iii). Construct the locus of points inside the triangle which are equidistant B and C

(iv). Mark the point P which is equidistant from Ab, BC and also equidistant C and C. Measure and record the length of PB.', 4, 'Constructions', 'long', 7, NULL, NULL),
  ('MQ-728eae-10-0', '728eae', 38, '10', '(a) Using remainder and factor theorem, factorise the expression completely: $$x^3 - 7x^2 + 15x - 9$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 8, NULL, NULL),
  ('MQ-728eae-10-1', '728eae', 39, '10', '(b) A box contains 90 discs which are numbered from 1 to 90. If one disc is drawn random from the box, find the probability that it is:

(i). a two-digit number,

(ii). a perfect square number,

(iii). a number not divisible by 5.', NULL, 'Probability', 'short', 8, NULL, NULL),
  ('MQ-728eae-10-2', '728eae', 40, '10', '(c) Use graph paper to answer the following questions:

(i). Plot the points \(A\) (4,6) and \(B(1,2)\)
(ii). Reflect A in the \(x\)-axis and name it \(A''\).
(iii). Reflect B in the line \(AA''\) and name it \(B''\).
(iv). Give the geometrical name for the figure \(ABA''B''\).', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-9e2786-1-0', '9e2786', 0, '1', '(i) $$\sin^4 A - \cos^4 A$$ is equal to:', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$$\sin^2 A - 1$$', '$$1 + \cos^2 A$$', '$$2 \sin^2 A - 1$$', '$$1 + 2 \cos^2 A$$']::text[]),
  ('MQ-9e2786-1-1', '9e2786', 1, '1', '(ii) A right triangle-shaped piece of hard board is rotated about its base (not the hypotenuse). The solid thus formed is always:
1. a single cone
2. a double cone
Which of the following statement is valid?', 1, 'Mensuration', 'MCQ', 1, NULL, array['only 1', 'only 2', 'both 1 and 2', 'Neither 1 nor 2']::text[]),
  ('MQ-9e2786-1-2', '9e2786', 2, '1', '(iii) A solid metallic sphere of radius 8 cm is melted and recast into 64 identical solid spheres. The diameter of each smaller sphere thus formed is:', 1, 'Mensuration', 'MCQ', 1, NULL, array['1 cm', '2 cm', '4 cm', '8 cm']::text[]),
  ('MQ-9e2786-1-3', '9e2786', 3, '1', '(iv) Assertion (A): Multiplicative inverse of $$\sec A - \tan A$$ is $$\sec A + \tan A$$.
Reason (R): $$\sec^2 A + \tan^2 A = 1$$.', 1, 'Trigonometry', 'MCQ', 1, NULL, array['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true, R is false.', 'A is false, R is true.']::text[]),
  ('MQ-9e2786-2-0', '9e2786', 4, '2', '2. Prove that $$(\sin \theta + \sec \theta)^2 + (\cos \theta + \csc \theta)^2 = (1 + \sec \theta \csc \theta)^2$$ [4]', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-9e2786-3-0', '9e2786', 5, '3', '3. A cylindrical jar of radius 6 cm contains oil. Iron spheres, each of radius 1.5 cm, are immersed in oil. How many spheres are necessary to raise the level of the oil by 2 cm?

[4]', 4, 'Mensuration', 'long', 1, NULL, NULL),
  ('MQ-9e2786-4-0', '9e2786', 6, '4', '4. A hollow sphere of internal and external diameters 4 cm and 8 cm respectively is melted into a cone of base diameter 8 cm. Find the height of the cone. [4]', 4, 'Mensuration', 'long', 1, NULL, NULL),
  ('MQ-9e2786-5-0', '9e2786', 7, '5', '5. Prove that $$\frac{1 - \cos \theta}{1 + \cos \theta} = (\cot \theta - \csc \theta)^2$$ [4]', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-ccfe7d-1-0', 'ccfe7d', 0, '1', '(i) For an intra-state sale, the CGST paid by a dealer to the central government is Rs 120. If the marked price of the article is Rs 2000, the rate of GST is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['6%', '10%', '12%', '16.67%']::text[]),
  ('MQ-ccfe7d-1-2', 'ccfe7d', 1, '1', '(iii) The roots of the quadratic equation $$px^2 - qx + r = 0$$ are equal if:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['$$p^2 = 4qr$$', '$$q^2 = 4pr$$', '$$-q^2 = 4pr$$', '$$p^2 > 4qr$$']::text[]),
  ('MQ-ccfe7d-1-7', 'ccfe7d', 2, '1', '(viii) The sum invested to purchase 15 shares of a company of nominal value Rs 75 available at a discount of 20% is', 1, 'Shares and Dividends', 'MCQ', 2, NULL, array['Rs 60', 'Rs 90', 'Rs 1350', 'Rs 900']::text[]),
  ('MQ-ccfe7d-1-8', 'ccfe7d', 3, '1', '(ix) Assertion: A die is thrown once and the probability of getting an even number is $$\frac{2}{3}$$. Reason: The sample space for even numbers on a die is {2, 4, 6}.', 1, 'Probability', 'MCQ', 2, NULL, array['Both Assertion and Reason are true, and the Reason is the correct explanation for the Assertion.', 'Both Assertion and Reason are true, but the Reason is not the correct explanation for the Assertion.', 'The Assertion is true, but the Reason is false.', 'The Assertion is false, but the Reason is true.']::text[]),
  ('MQ-ccfe7d-1-9', 'ccfe7d', 4, '1', '(x) Volume of a cylinder of 3cm height is 48π cm³. Radius of the cylinder is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['48 cm', '16 cm', '4 cm', '24 cm']::text[]),
  ('MQ-ccfe7d-1-10', 'ccfe7d', 5, '1', '(xi) The nth term of an A.P. is 2n + 5. The 10th term is :', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['7', '15', '25', '45']::text[]),
  ('MQ-ccfe7d-1-11', 'ccfe7d', 6, '1', '(xii) Consider the following two statements:
Statement 1: The angle in a semi-circle is a right angle.
Statement 2: The exterior angle of a cyclic quadrilateral is half of the interior opposite angle.
Which of the following is valid?', 1, 'Circles', 'MCQ', 3, NULL, array['Both the statements are true.', 'Both the statements are false.', 'Statement 1 is true and Statement 2 is false.', 'Statement 1 is false and Statement 2 is true.']::text[]),
  ('MQ-ccfe7d-1-12', 'ccfe7d', 7, '1', '(xiii) In the given diagram RT is a tangent touching the circle at S. If angle PST = 30° and Angle SPQ = 60° then angle PSQ is equal to:
![img-0.jpeg](img-0.jpeg)[caption": "', 1, 'Circles', 'MCQ', 3, 'ccfe7d__La_Martini_p3_img_0_jpeg.webp', array['40°\n', '30°\n', '90°\n', '60°"}]']::text[]),
  ('MQ-ccfe7d-1-13', 'ccfe7d', 8, '1', '(xiv) The reflection of (4, 3) in the origin is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(4, -3)', '(-4, 3)', '(-4, -3)', '(3, 4)']::text[]),
  ('MQ-ccfe7d-1-14', 'ccfe7d', 9, '1', '(xv) In the given diagram, PS and PT are the tangents to the circle, SQ || PT and angle SPT = 80°. The value of angle QST is :

(a) 140°

(c) 50°

(b) 90°

(d) 80°', 1, 'Circles', 'short', 4, 'ccfe7d__La_Martini_p4_img_0_jpeg.webp', NULL),
  ('MQ-ccfe7d-2-0', 'ccfe7d', 10, '2', '2. (i) A = [x 0; 1 1], B = [4 0; y 1] and C = [4 0; x 1] Find the values of x and y, if AB = C. [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-ccfe7d-2-1', 'ccfe7d', 11, '2', '(ii) A solid metallic cylinder is cut into two identical halves along its height (as shown in the diagram). The diameter of the cylinder is 7 cm and the height is 10 cm. Find [4]

(a) The total surface area (both the halves). 550

(b) The total cost of painting the two halves at the rate of Rs 30 per cm² 17400

(Use π = 22/7).', 4, 'Mensuration', 'long', 4, 'ccfe7d__La_Martini_p4_img_1_jpeg.webp', NULL),
  ('MQ-ccfe7d-2-2', 'ccfe7d', 12, '2', '(iii) 15, 30, 60, 120, ... are in Geometric Progression.

(a) Find the nth term of this GP in terms of n.

(b) How many terms of the above GP will give the sum 945? [4]', 4, 'Geometric Progression', 'long', 4, NULL, NULL),
  ('MQ-ccfe7d-3-0', 'ccfe7d', 13, '3', '3. (i) Prove that $$\frac{\sin^2 \theta + \cos^2 \theta}{\sin \theta + \cos \theta} + \sin \theta \cdot \cos \theta = 1$$. [4]

$$(\sin \theta + \cos \theta)^2 - 3 \sin \theta \cos \theta / (\sin \theta + \cos \theta)$$

$$(\sin \theta + \cos \theta) \times \text{MATH-4}$$

$$(\sin \theta + \cos \theta)^2 - 3 \sin \theta \cos \theta \times 1 + \sin \theta \cos \theta$$

$$1 + 3 \sin \theta \cos \theta - 3 \sin \theta \cos \theta + \sin \theta \cos \theta$$', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-ccfe7d-3-1', 'ccfe7d', 14, '3', '(ii) In the given diagram, O is the centre of the circle. PR and PT are two tangents drawn from the external point P and touching the circle at Q and S respectively. MN is a diameter of the circle. Given angle PQM = 42° and angle PSM = 25°.

[4]

Find: (a) angle OQM

(b) angle QNS

(c) angle QOS

(d) angle QMS', 4, 'Circles', 'long', 5, 'ccfe7d__La_Martini_p5_img_0_jpeg.webp', NULL),
  ('MQ-ccfe7d-3-2', 'ccfe7d', 15, '3', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along the axes. [5]

(a) Plot A (0, 3), B (2, 1) and C (4, -1).
(b) Reflect point B and C in the y-axis and name their images as B'' and C'' respectively. Plot and write the coordinates of the points B'' and C''.
(c) Reflect point A in the line BB'' and name its image as A''.
(d) Plot and write the coordinates of point A''.
(e) Join the points ABA''B'' and give the geometrical name of the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-ccfe7d-4-0', 'ccfe7d', 16, '4', '4. (i) Solve the following quadratic equation for x and give your answer correct to three significant figures : 2x² - 10x + 5 = 0. 1144, 0.563 [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-ccfe7d-4-1', 'ccfe7d', 17, '4', '(ii) The nth term of an Arithmetic Progression is given by the relation Tₙ = 6(7 - n).

(a) Find its first term and common difference.
(b) Find the sum of its 25 terms. [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-ccfe7d-4-2', 'ccfe7d', 18, '4', '(iii) In the given diagram, ΔADB and ΔACB are two right-angled triangles with angle ADB = angle BCA = 90°. AB = 10 cm, AD = 6 cm, BC = 2.4 cm and DP = 4.5 cm.

(a) Prove that \(\Delta APD - \Delta BPC\)
(b) Find the lengths of BD and PB.', 4, 'Similarity', 'long', 5, 'ccfe7d__La_Martini_p5_img_1_jpeg.webp', NULL),
  ('MQ-ccfe7d-5-0', 'ccfe7d', 19, '5', 'The two ways interest at the rate of 8% per annum. If he gets Rs 1040 as interest at the time of maturity, find the total time in years for which the account was held.

[3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-ccfe7d-5-1', 'ccfe7d', 20, '5', '(ii) The following table gives the duration of some movies in minutes.

| Duration (in minutes) | 100-110 | 110-120 | 120-130 | 130-140 | 140-150 | 150-160 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of movies | 5 | 10 | 17 | 8 | 6 | 4 |

Using step-deviation method, find the mean duration of the movies. [3]', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-ccfe7d-5-2', 'ccfe7d', 21, '5', '(iii) If $$\frac{(a + b)^3}{(a - b)^3} = \frac{64}{27}$$

(a) Find \(\frac{a + b}{a - b}\).
(b) Hence using properties of proportion, find a : b. [4]', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-ccfe7d-6-0', 'ccfe7d', 22, '6', '6. (i) Solve the following inequation, write down the solution set and represent it on the real number line. [3]

$$-3 + x \leq \frac{7x}{2} + 2 < 8 + 2x, x \in I.$$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-ccfe7d-6-1', 'ccfe7d', 23, '6', '(ii) In the diagram, an isosceles triangle $$\Delta ABC$$ is inscribed in a circle with centre O. PQ is a tangent to the circle at C. OM is perpendicular to chord AC and angle $$COM = 65^\circ$$.

Find (a) angle ABC, (b) angle BAC and (c) angle BCQ. [3]', 3, 'Circles', 'short', 6, 'ccfe7d__La_Martini_p6_img_0_jpeg.webp', NULL),
  ('MQ-ccfe7d-6-2', 'ccfe7d', 24, '6', '(iii) In the given diagram, ABC is a point on AC. [4]

- (a) Write down the coordinates of A and D.
- (b) Find the coordinates of the centroid of $\triangle ABC$ .
- (c) If D divides AC in the ratio $k : 1$ , find the value of $k$ .
- (d) Find the equation of the line BD.', 4, 'Coordinate Geometry', 'long', 7, 'ccfe7d__La_Martini_p7_img_0_jpeg.webp', NULL),
  ('MQ-ccfe7d-7-0', 'ccfe7d', 25, '7', '7. (i) Mr Gupta invested Rs 33,000 in buying Rs 100 shares of a company at 10% premium. The dividend declared by the company is 12%. [3]

- (a) Find the number of shares purchased by him.
- (b) Find annual dividend.', 3, 'Shares and Dividends', 'short', 7, NULL, NULL),
  ('MQ-ccfe7d-7-1', 'ccfe7d', 26, '7', '(ii) The polynomial $3x^3 + 18x^2 - 15x + k$ has $(x - 1)$ as a factor. Find the value of $k$ . Hence factorise the resulting polynomial completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 7, NULL, NULL),
  ('MQ-ccfe7d-7-2', 'ccfe7d', 27, '7', '(iii) A life insurance agent found the following data for distribution of ages of 100 Policy holders: [4]

| Age in years | 20-25 | 25-30 | 30-35 | 35-40 | 40-45 | 45-50 | 50-55 | 55-60 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Policyholders (Frequency) | 2 | 4 | 12 | 20 | 28 | 22 | 8 | 4 |

On a graph sheet draw an ogive using the given data. Take 2 cm = 5 years along one axis and 2 cm = 10 policyholders along the other axis. Use your graph to find:

- (a) The Median age.
- (b) Number of policyholders whose age is above 52 years.', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-ccfe7d-8-0', 'ccfe7d', 28, '8', '8. (i) The figure shows a circle of $9 \, \text{cm}$ radius with O as the centre. The diameter AB produced meets the tangent PQ at P. If PA = 24 cm, find the length of the tangent PQ. [3]', 3, 'Circles', 'short', 8, 'ccfe7d__La_Martini_p8_img_1_jpeg.webp', NULL),
  ('MQ-ccfe7d-8-1', 'ccfe7d', 29, '8', '(ii) Find the value of $p$ if the lines $5x - 3y + 2 = 0$ and $6x - py + 7 = 0$ are perpendicular to each other. Hence find the equation of a line passing through $(-2, -1)$ and parallel to $6x - py + 7 = 0$.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-ccfe7d-8-2', 'ccfe7d', 30, '8', '(iii) Use a ruler and a pair of compasses to answer this question. [4] Construct angle $ABC = 90^\circ$, where $AB = 6 \, \text{cm}$, $BC = 8 \, \text{cm}$.

(a) Construct the locus of points equidistant from B and C.
(b) Construct the locus of points equidistant from A and B.
(c) Mark the point which satisfies both the conditions (a) and (b) as O. Construct the locus of points keeping a fixed distance OA from the fixed-point O.', 4, 'Constructions', 'long', 8, NULL, NULL),
  ('MQ-ccfe7d-9-0', 'ccfe7d', 31, '9', '9. (i) A Mathematics teacher uses certain amount of terracotta clay to form different shaped solids. First, she turned it into a sphere of radius $7 \, \text{cm}$ and then she made a right circular cone with base radius $14 \, \text{cm}$. Find the height of the cone so formed. If the same clay is turned to make a right circular cylinder of height $7/3 \, \text{cm}$, then find the radius of the cylinder so formed. Also, compare the total surface area of sphere and cylinder so formed.', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-ccfe7d-9-1', 'ccfe7d', 32, '9', '9. (ii) Study the graph and answer the questions that follow:

(a) Make a frequency table for the information provided in the graph.
(b) The number of students whose height is less than \(150~\mathrm{cm}\).
The total number of students.

(c) The modal height.

(d) The difference in the modal height and the mean height, if the average height of the students is 145.5 cm.', NULL, 'Statistics', 'short', 8, 'ccfe7d__La_Martini_p8_img_2_jpeg.webp', NULL),
  ('MQ-ccfe7d-10-0', 'ccfe7d', 33, '10', '(i) The following letters A, D, M, N, O, S, U Y of the English alphabet are written on separate cards and put in a box. The cards are well shuffled and one card is drawn at random. What is the probability that the card drawn is a letter of the word: [3]

(a) MONDAY?

(b) Which does not appear in MONDAY?

(c) Which appears both in SUNDAY and MONDAY?', 3, 'Probability', 'short', 9, NULL, NULL),
  ('MQ-ccfe7d-10-1', 'ccfe7d', 34, '10', '(ii) Rohan bought the following articles from a departmental store: [3]

| Sl. No. | Item | Price | Rate of GST | Discount |
| --- | --- | --- | --- | --- |
| 1 | Hair oil | Rs 1200 | 18% | Rs 100 |
| 2 | Cashew nuts | Rs 600 | 12% | Nil |

Find the

(a) Total GST paid.
(b) Total bill amount including GST.', 3, 'GST and Banking', 'short', 9, NULL, NULL),
  ('MQ-ccfe7d-10-2', 'ccfe7d', 35, '10', '(iii) The angle of elevation of the top of a 100 m high tree from two points A and B on the opposite sides of the tree are 52° and 45° respectively. Find the distance AB to the nearest metre. [4]', 4, 'Trigonometry', 'long', 9, NULL, NULL),
  ('MQ-7a3130-1-0', '7a3130', 0, '1', 'a) Rohini deposited ₹800 per month in a recurring deposit account for 1 year at the rate of 10 % per annum. Find the amount that she will get on maturity. (3)', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-7a3130-1-1', '7a3130', 1, '1', 'b) Using factor theorem, factorise the polynomial $$x^3 + 10x^2 - 37x + 26$$ completely. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-7a3130-1-2', '7a3130', 2, '1', 'c) A wholesaler buys a clock from a manufacturer for ₹4000. He marks the price of the clock 25% above his cost price and sells it to a retailer at a 10% discount on the marked price. If the rate of GST is 18 %, find
i) the marked price.
ii) the retailer''s cost price inclusive of tax.
iii) GST paid by the wholesaler. (4)', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-7a3130-2-0', '7a3130', 3, '2', 'a) Solve the quadratic equation and give your answer correct to two significant figures :
$$5x(x + 2) = 3$$ (3)', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-7a3130-2-1', '7a3130', 4, '2', 'b) Find the ratio in which the line joining the points (1,2) and (-2, 3) is divided by the line
$$3x + 4y = 7$$ (3)', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-7a3130-2-2', '7a3130', 5, '2', 'c) In the given figure, QAP is a tangent at point A and PBD is a straight line. If $$\angle ACB = 36^\circ$$ and $$\angle APB = 42^\circ$$, Calculate (i) $$\angle BAP$$ (ii) $$\angle ABD$$ (iii) $$\angle QAD$$ (iv) $$\angle BCD$$ (4)', 4, 'Circles', 'long', 1, '7a3130__Lfs_X_Math_p1_img_0_jpeg.webp', NULL),
  ('MQ-7a3130-3-0', '7a3130', 6, '3', 'a) Solve the following inequation and represent the solution set on the number line:
$$-3 < -\frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6}, \quad x \in R$$ (3)', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-7a3130-3-1', '7a3130', 7, '3', 'b) A hemispherical bowl of diameter 7.2 cm is completely filled with chocolate sauce. This sauce is poured into an inverted cone of radius 4.8 cm. Find the height of the cone. (3)', 3, 'Mensuration', 'short', 1, NULL, NULL),
  ('MQ-7a3130-3-2', '7a3130', 8, '3', 'c) If the third and the ninth terms of an A.P are 4 and -8 respectively, which term of this A.P is zero (4)', 4, 'Arithmetic Progression', 'long', 1, NULL, NULL),
  ('MQ-7a3130-7-0', '7a3130', 9, '7', 'a) The speed of an express train is x km/hr and the speed of an ordinary train is 12 km/hr less than that of the express train. If the ordinary train takes one hour longer than the express train to cover a distance of 240 km, find the speed of the express train.', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-7a3130-7-1', '7a3130', 10, '7', 'b) In $\Delta PQR$ : $\angle Q = 90^\circ$ and MN is perpendicular to PR. Given that $PM = 5$ cm, $MQ = 4$ cm and $QR = 12$ cm, calculate : i) MN ii) $\frac{\text{area } \Delta PMN}{\text{area MNRQ}}$', NULL, 'Similarity', 'short', 2, '7a3130__Lfs_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-7a3130-7-2', '7a3130', 11, '7', 'c) A toy is made in the form of a hemisphere surmounted by a right circular cone, whose base coincides with the plane surface of the hemisphere. The radius of the base of the cone is 3.5 m and its volume is two-third of the hemisphere. Calculate the height of the cone and the surface area of the toy.', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-7a3130-8-0', '7a3130', 12, '8', 'a) Prove the following identity:
$(1 + \cot A - \csc A)(1 + \tan A + \sec A) = 2$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-7a3130-8-1', '7a3130', 13, '8', 'b) Mr Srinivas invested ₹8000 in 7% ₹100 shares at ₹80. After a year, he sold these shares at ₹75 each and invested the proceeds (including his dividend) in 18% ₹25 shares at ₹41. Find:
i) his dividend for the first year
ii) his annual income in the second year.', NULL, 'Shares and Dividends', 'short', 2, NULL, NULL),
  ('MQ-7a3130-8-2', '7a3130', 14, '8', 'c) Using the properties of proportion, find the value of x : y if

$$\frac{x^3 + 12x}{6x^2 + 8} = \frac{y^3 + 27y}{9y^2 + 27} \quad (4)$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-7a3130-9-0', '7a3130', 15, '9', 'a) The chord of a circle is equal to its radius. Find the angle subtended by the chord at a point on the major arc and also, on the minor arc.', NULL, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-7a3130-9-1', '7a3130', 16, '9', 'b) The mean of the numbers 45, 52, 60, x, 69, 70, 26, 81 and 94 is 68. Find the value of x and calculate the median of the above data.', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-7a3130-9-2', '7a3130', 17, '9', 'c) Using the ruler and a compass, construct a $\Delta ABC$, such that $AB = 4.5$ cm, $BC = 7$ cm and median $AD = 4$ cm. Construct the inscribed circle of the triangle and measure its radius.', NULL, 'Constructions', 'short', 2, NULL, NULL),
  ('MQ-7a3130-10-0', '7a3130', 18, '10', 'a) A model of a ship is made to a scale 1: 300.
i) The length of the model of the ship is 2 m. Calculate the length of the ship.
ii) The area of the deck of the ship is 180,000 m$^2$. Calculate the area of the deck of the model.
iii) The volume of the model is 6.5 m$^3$. Calculate the volume of the ship.', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-7a3130-10-1', '7a3130', 19, '10', 'b) Find the sum of 10 terms of the series : 96 - 48 + 24 - 12 ...', NULL, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-7a3130-10-2', '7a3130', 20, '10', 'c) Draw the histogram of the following frequency distribution and using it, calculate the mode.

| Class Interval | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 15 | 10 | 5 | 12 | 8 |', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-7a3130-4-0', '7a3130', 21, '4', 'a) Without solving the equation, find the value of ''m'' for which the given equation has real roots
$$3x^2 - mx + 27 = 0$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-7a3130-4-1', '7a3130', 22, '4', 'b) If $$A = \begin{bmatrix} 4 & 3 \\ 2 & 5 \end{bmatrix}$$, find the value of x and y such that $$A^2 - xA + yI = 0$$, where x and y are scalar quantities and I is an identity matrix.', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-7a3130-4-2', '7a3130', 23, '4', 'c) Calculate the mean of the following frequency distribution by step deviation method.

| Wages in | 45 - 50 | 50 - 55 | 55 - 60 | 60 - 65 | 65 - 70 | 70 - 75 | 75 - 80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 5 | 8 | 30 | 25 | 14 | 12 | 6 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-7a3130-5-0', '7a3130', 24, '5', 'a) AB is the diameter of a circle with centre O. A line PQ touches the circle at point R and cuts the tangents to the circle through A and B. Prove that $$\angle POQ = 90^\circ$$.', NULL, 'Circles', 'short', 3, '7a3130__Lfs_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-7a3130-5-1', '7a3130', 25, '5', 'b) If \(\begin{bmatrix} 8 & -2 \\ 1 & 4 \end{bmatrix} : X = \begin{bmatrix} 12 \\ 10 \end{bmatrix}\), write i) the order of matrix \(X\) ii) the matrix \(X\)', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-7a3130-5-2', '7a3130', 26, '5', 'c) Use graph paper to answer the following question: (Take \(2\mathrm{cm} = 1\) unit on both axes)

i) Plot the points \( A(4,6) \) and \( B(1,3) \) on the graph paper. These two points are the vertices of a figure ABCD which is symmetrical about the lines \( x = 4 \) and \( y = 3 \).
ii) Complete the figure on the graph and write the coordinates of \( C \) and \( D \).
iii) Write the geometrical name of the figure.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-7a3130-6-0', '7a3130', 27, '6', 'a) In a single throw of two dice, find the probability of getting :

i) a doublet.
ii) an odd number as a sum.
iii) a total of atmost 10.', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-7a3130-6-1', '7a3130', 28, '6', 'b) Construct a circle of radius 5 cm. Mark two chords AB and BC of the circle of length 6 cm and 7 cm respectively.

i) Draw the locus of points, which is equidistant from A and B.
ii) Draw the locus of the points equidistant from CA and CB.', NULL, 'Loci', 'short', 3, NULL, NULL),
  ('MQ-7a3130-6-2', '7a3130', 29, '6', 'c) Find the equation of the line which passes through the point (3,4) and the sum of its intercept on the axes is 14.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-7a3130-11-0', '7a3130', 30, '11', 'a) From the top of a building 20 m high, the angle of elevation of the top of the monument is 45° and the angle of depression of its foot is 15°. Find the height of the monument. (4)', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-7a3130-11-1', '7a3130', 31, '11', 'b) The table shows the distribution of marks obtained by 160 students in an entrance exam. Use a graph sheet to draw an ogive for the distribution. ( Take 2 cm = 10 marks on the X axis and 2 cm = 20 students on the Y axis ) (6)

| Marks | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students. | 9 | 13 | 20 | 26 | 30 | 22 | 15 | 10 | 8 | 7 |

Use your graph to estimate the following:

i) the median
ii) the upper quartile
iii) the number of students who obtained a score of more than 85%.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-7d00e8-1-0', '7d00e8', 0, '1', 'Q.1.a. Archana deposited Rs.400 per month for 36 months in a banks recurring deposit account. If the bank pays interest at the rate of 10% per annum, find the amount she gets on maturity. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-7d00e8-1-1', '7d00e8', 1, '1', 'Q.1.b. Solve the given quadratic equation: $$x^2 - 6x - 40 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-7d00e8-1-2', '7d00e8', 2, '1', 'Q.1.c. A manufacturer sells a T.V to a dealer for Rs.18000 and the dealer sells it to the customer at a profit of Rs.1500. If the sales are intra state and the rate of GST is 12%, find : [4]

- (i) The amount of GST paid by the dealer to the state government.
- (ii) The amount of GST received by the central government.
- (iii) The amount of GST received by the state government.
- (iv) The amount that the consumer pays for the T.V (including GST).', 4, 'GST and Banking', 'long', 1, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
