set standard_conforming_strings = on;
begin;

-- questions 3501-4000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-577a37-9-2', '577a37', 34, '9', '(iii)If the \(6^{\text{th}}\) term of an A.P is equal to four times its first term and the sum of first six terms is 75, find the first term and the common difference. [4]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-577a37-10-0', '577a37', 35, '10', '(i) Prove that \(\frac{1}{\sec A - \tan A} + \frac{1}{\sec A + \tan A} = \frac{2}{\cos x}\) [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-577a37-10-1', '577a37', 36, '10', '(ii) Construct a triangle ABC, given that \( \mathrm{AB} = 6\mathrm{cm} \), \( \mathrm{BC} = 8\mathrm{cm} \) and median \( \mathrm{AD} = 5\mathrm{cm} \). Construct an incircle to triangle ABC and measure its radius. [3]', 3, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-577a37-10-2', '577a37', 37, '10', '(iii) The angle of elevation of an aeroplane from a point \( \mathrm{P} \) on the ground is \( 60^{\circ} \). After 12 seconds from the same point \( \mathrm{P} \), the angle of elevation of the same plane changes to \( 30^{\circ} \). If the plane is flying horizontally at a speed of \( 600\sqrt{3}\mathrm{km / h} \), find the height at which the plane is flying. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-4f388d-1-0', '4f388d', 0, '1', '(i) If $$\begin{bmatrix} x-2y & 5 \\ 3 & y \end{bmatrix} = \begin{bmatrix} 6 & 5 \\ 3 & -2 \end{bmatrix}$$, then the value of x is:
a. -2 b. 0 c. 1 d. 2', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-4f388d-1-1', '4f388d', 1, '1', '(ii) A retailer has goods worth Rs 10,000 and sells it to a consumer for Rs 13,500. If the rate of GST is 18%, then the GST payable by him to the government is
a. Rs 630 b. Rs 243 c. Rs 180 d. Rs 423', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-4f388d-1-2', '4f388d', 2, '1', '(iii) When the roots of a quadratic equation are real and distinct then the discriminant of the quadratic equation is
a. Infinite b. positive c. Zero d. negative', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-4f388d-1-3', '4f388d', 3, '1', '(iv) The solution set of $$1 \geq 15 - 7x > 2x - 27$$, x $$\in$$ N is
a. {2, 3, 4} b. {2, 3} c. {3, 4} d. {3}', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-4f388d-1-4', '4f388d', 4, '1', '(v) Find the 10$^{th}$ term of a given A.P 24, 21, 18, ...
a. 51 b. 3 c. -51 d. -3', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-4f388d-1-5', '4f388d', 5, '1', '(vi) If a polynomial $$x^3 - 3x^2 + 2x + 1$$ is divided by x - 1, then the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['-1', '-3', '1', '2']::text[]),
  ('MQ-4f388d-1-6', '4f388d', 6, '1', '(vii) The point p (-3, 2) is invariant point about x = -3 under reflection. The coordinates of p'' is', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(-3, -2)', '(3, -2)', '(-3, 2)', '(3.2)']::text[]),
  ('MQ-4f388d-1-7', '4f388d', 7, '1', '(viii) It is given that in a group of 3 students, the probability of students not having the same birthday is 0.946, then the probability that the students have the same birthday is', 1, 'Probability', 'MCQ', 1, NULL, array['0.946', '1', '0', '0.054']::text[]),
  ('MQ-4f388d-1-8', '4f388d', 8, '1', '(ix) If the vertices of a triangle are (7, 9) (1, 1) and (4, -7). Then the coordinates of the centroid are:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(4, 3)', '(5, 3)', '(4, 1)', '(0, 0)']::text[]),
  ('MQ-4f388d-1-9', '4f388d', 9, '1', '(x) The radii of two cylinders are in the ratio 5:7 and their heights are in the ratio 3:5. the ratio of their curved surface areas, is', 1, 'Mensuration', 'MCQ', 2, NULL, array['3 : 7', '7 : 3', '5 : 7', '3 : 5']::text[]),
  ('MQ-4f388d-1-10', '4f388d', 10, '1', '(xi) If the straight lines 4x + ay + 9 = 0 and 3x -5y - 7 = 0 are perpendicular to one another, then the value of a is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$$\frac{1}{5}$$', '12', '5', '$$\frac{12}{5}$$']::text[]),
  ('MQ-4f388d-1-11', '4f388d', 11, '1', '(xii) In the given figure, O is the centre of the circle and $$\angle PBA = 45^{\circ}$$. Then $$\angle PQB$$ is', 1, 'Circles', 'MCQ', 2, '4f388d__Gundecha_X_p2_img_0_jpeg.webp', array['$$45^{\circ}$$', '$$30^{\circ}$$', '$$90^{\circ}$$', '$$55^{\circ}$$']::text[]),
  ('MQ-4f388d-1-12', '4f388d', 12, '1', '(xiii) An ogive is useful in determining the

a) Mean b) mode c) median d) all the above', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-4f388d-1-13', '4f388d', 13, '1', '(xiv) Saloni deposits ₹ 150 per month for 1 ½ years. The total sum deposited is

a) ₹ 2500 b) ₹ 2700 c) ₹ 3500 d) none of the above', 1, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-4f388d-1-14', '4f388d', 14, '1', '(xv) If a matrix has equal number of rows and columns then it is said to be a:', 1, 'Matrices', 'MCQ', 2, NULL, array['Row matrix', 'Identical matrix', 'Square matrix', 'Rectangular matrix']::text[]),
  ('MQ-4f388d-2-0', '4f388d', 15, '2', '(i) Mr. Ram has a Recurring Deposit in a bank for 3 years at 9% p.a. simple interest. If he gets ₹ 3996 as interest at the time of maturity, find:

(a) monthly instalment

(b) the amount of maturity', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-4f388d-2-1', '4f388d', 16, '2', '(ii) Prove that: $$\frac{\sin A \tan A}{1 - \cos A} = 1 + \sec A$$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-4f388d-2-2', '4f388d', 17, '2', '(iii) Given $$\begin{bmatrix} 2 & 1 \\ -3 & 4 \end{bmatrix} X = \begin{pmatrix} 7 \\ 6 \end{pmatrix}$$ write:

a. Order of matrix X

b. Find the matrix X', NULL, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-4f388d-3-0', '4f388d', 18, '3', '(i) A solid sphere of radius 15 cm is melted and recast into solid right circular cones of radius 2.5 cm and height 8cm. calculate the number of cones recast. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-4f388d-3-1', '4f388d', 19, '3', '(ii) If b is the mean proportional between a and c, prove that: $$\frac{a^4 + a^2b^2 + b^4}{b^4 + b^2c^2 + c^4} = \frac{a^2}{c^2}$$ [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-4f388d-3-2', '4f388d', 20, '3', '(iii) Use graph paper for this question. (Take 2 cm = 1 unit along both x and y axis). Plot the points O(0, 0), A(-4, 4), B(-3, 0) and C(0, -3)
a. Reflect points A and B on the Y
b. axis and name them A'' and B'' respectively. Write down their coordinates.
c. Write down two invariant points along X axis.
d. Name the geometrical figure OABCB''A''.
e. Find the equation of the line AB.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-4f388d-4-0', '4f388d', 21, '4', '(i) The first term of an AP is 5, the last term is 45 and the sum of all terms of the AP is 400. Find the number of terms and common differences.', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-4f388d-4-1', '4f388d', 22, '4', '(ii) Solve the following in equation and represent the solution set on a number line: \(-2\frac{2}{3} \leq x + \frac{1}{3} < 3\frac{1}{3}, x \in W\)', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-4f388d-4-2', '4f388d', 23, '4', '(iii) Find the amount of bill for the following transaction of goods [3]

| GST% | 18 | 12 |
| --- | --- | --- |
| MRP in Rs | 12000 | 18000 |
| Discount % | 20 | 25 |', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-4f388d-5-0', '4f388d', 24, '5', '(i) Solve the following quadratic equation \( 4x^{2} + 7x + 2 = 0 \). Give your answer in two significant figures. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-4f388d-5-1', '4f388d', 25, '5', '(ii) A box has cards numbered 0 to 100. Cards are mixed thoroughly and a card is drawn at random from the box. find the probability that the card drawn is [3]

a. A perfect square

b. A multiple of 6 or 8

c. A multiple of 6 and 8', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-4f388d-5-2', '4f388d', 26, '5', '(iii) Using the remainder and factor theorem factorise the following polynomial

$$6x^3 + 25x^2 + 31x + 10.$$ [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-4f388d-6-0', '4f388d', 27, '6', '(i) PQR is a triangle. S is a point on the side QR of Δ PQR. Such that ∠ PSR = ∠QPR. Given QP = 8 cm, PR = 6 cm and SR = 3cm. [3]

GEA/SECOND ROUND OF ASSESSMENT 2022-23

This paper consists of 5 printed pages
# CLASS X MATHEMATICS

a. Prove $\Delta$ PQR $\sim \Delta$ SPR
b. Find the length of QR and PS.', 3, 'Similarity', 'short', 3, '4f388d__Gundecha_X_p3_img_0_jpeg.webp', NULL),
  ('MQ-4f388d-6-1', '4f388d', 28, '6', '(ii) Simplify: $\begin{bmatrix} -2\sin 30^\circ & \cosec 30^\circ \\ \tan 45^\circ & \cos 0^\circ \end{bmatrix} \times \begin{bmatrix} \cot 45^\circ & \sin 90^\circ \\ 2\sec 0^\circ & \sec 0^\circ \end{bmatrix}$', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-4f388d-6-2', '4f388d', 29, '6', '(iii) Draw a histogram for the following distribution and hence find the mode of the given data:

| Length in cm | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 |
| --- | --- | --- | --- | --- | --- | --- |
| No of plants | 4 | 3 | 8 | 11 | 6 | 2 |

| Length in cm | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 |
| --- | --- | --- | --- | --- | --- | --- |
| No of plants | 4 | 3 | 8 | 11 | 6 | 2 |', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-4f388d-7-0', '4f388d', 30, '7', '(i) The weights of 50 apples were recorded as given below. Calculate the mean weight, to the nearest gram, by step deviation method.

| Weight in grams | 80 – 85 | 85 – 90 | 90 – 95 | 95 – 100 | 100 – 105 | 105 – 110 | 110 – 115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of apples | 5 | 8 | 10 | 12 | 8 | 4 | 3 |

[3]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-4f388d-7-1', '4f388d', 31, '7', '(ii) Construct a regular hexagon of side \(4\mathrm{cm}\). Construct a circle circumscribing the hexagon. Measure and record its circum-radius.', NULL, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-4f388d-7-2', '4f388d', 32, '7', '(iii) Solve for \( x \) by using the properties of proportion [3] [4]

$$\frac{\sqrt{x+1}+\sqrt{x-1}}{\sqrt{x+1}-\sqrt{x-1}} = \frac{4x-1}{2}$$', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-4f388d-8-0', '4f388d', 33, '8', '(i) Use a graph paper to draw an ogive for the below distribution:

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Use your ogive to estimate:

(ii) the median marks.
(iii) the upper quartile marks.
(iv) the number of students who did not pass the test if pass percentage was 50.', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-4f388d-8-1', '4f388d', 34, '8', '(ii) A shopkeeper buys certain number of pen sets for Rs 900. If the cost per set was Rs 5 more the number of sets that could be bought for Rs 900 would be 9 less. Taking original cost of each set be Rs ''x'' find x.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-4f388d-9-0', '4f388d', 35, '9', '(i) Given a line segment AB joining the points A(-4, 6) and B(8, -3). Find
 a. The ratio in which AB is divided by the Y-axis [3]
 b. Find the coordinates of the point of intersection. [3]
 c. The equation of AB.', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-4f388d-9-1', '4f388d', 36, '9', '(ii) $(\csc A - \sin A) (\sec A - \cos A) \sec^2 A = \tan A$', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-4f388d-9-2', '4f388d', 37, '9', '(iii) A solid is in the form of right circular cylinder with a hemisphere at one end and a cone at the other end. The radius of common base is 2.8 cm and heights of cylindrical and conical portions are 14 cm and 7 cm respectively. Find the total volume of the solid. Give your answer in two decimal places. [4]', 4, 'Mensuration', 'long', 5, '4f388d__Gundecha_X_p5_img_0_jpeg.webp', NULL),
  ('MQ-4f388d-10-0', '4f388d', 38, '10', '(i) In the given circle with centre O, $\angle ABC = 100^\circ$ , $\angle ACD = 40^\circ$ and CT is a tangent to the circle at C. find $\angle ADC$ and $\angle DCT$ . [3]', 3, 'Circles', 'short', 5, '4f388d__Gundecha_X_p5_img_1_jpeg.webp', NULL),
  ('MQ-4f388d-10-1', '4f388d', 39, '10', '(ii) A man deposits Rs 1500 p.m for 3 years in recurring deposit and received Rs 65655 at the end of 3 years. Find the rate percent. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-4f388d-10-2', '4f388d', 40, '10', '(iii) The horizontal distance between two towers is 120 m. the angle of elevation of the top and angle of depression of the bottom of the first tower as observed from the second tower is $30^\circ$ and $24^\circ$ respectively. Find the height of two towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-64d317-1-0', '64d317', 0, '1', '1. Nisha has a four year recurring deposit account in a bank and deposits Rs.800/- per month. If she gets Rs. 9800/- as interest, then the rate of interest is:', NULL, 'GST and Banking', 'MCQ', 1, NULL, array['10%', '10.5%', '12%', '12.5%']::text[]),
  ('MQ-64d317-1-1', '64d317', 1, '1', '2. The zeroes of x2 - 2x - 8 are:', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['2, -4', '4, -2', '-2, -2', '-4, 4']::text[]),
  ('MQ-64d317-1-2', '64d317', 2, '1', '3. The centroid of a $\triangle ABC$ is G (6, 7). If the coordinates of the vertices A, B and C are (a, 5), (7, 9) and (5, 7) respectively. The value of a is:', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['9', '6', '3', '7']::text[]),
  ('MQ-64d317-1-3', '64d317', 3, '1', '4. What is the factorization of 2x2 - 7x - 15?', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$(x + 5)(2x - 3)$', '$(x - 5)(2x + 3)$', '$(x + 3)(2x - 5)$', '$(x - 3)2x - 5$']::text[]),
  ('MQ-64d317-1-4', '64d317', 4, '1', '5. If a matrix has equal number of rows and columns then it is said to be a:', NULL, 'Matrices', 'MCQ', 1, NULL, array['Row Matrix', 'Square Matrix', 'Identical Matrix', 'Rectangular Matrix']::text[]),
  ('MQ-64d317-1-5', '64d317', 5, '1', '6. If the sum of first n terms of an A.P. is $A_n + B_n^2$, where A and B are constants, the common difference will be:', NULL, 'Arithmetic Progression', 'MCQ', 1, NULL, array['$A+B$', '$A-B$', '2A', '2B']::text[]),
  ('MQ-64d317-1-6', '64d317', 6, '1', '7. A point $P(-2, 3)$ is reflected in the line $x = 2$, the coordinates of the point of reflection $P''$ are:', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$(2, 3)$', '$(4, 3)$', '$(6, 3)$', '$(8, 3)$']::text[]),
  ('MQ-64d317-1-7', '64d317', 7, '1', '8. The point $A(p, q)$ is invariant about $x = p$ under reflection. The coordinates of its image $A''$ is:', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$A''(p, -q)$', '$A''(-p, q)$', '$A''(p, q)$', '$A''(-p, -q)$']::text[]),
  ('MQ-64d317-1-8', '64d317', 8, '1', '9. Determine the slope (m) and y — intercept (c) of the following line: $3y = \sqrt{3x} + 6$.', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$M = \sqrt{3}, c = \frac{1}{3}$', '$m = \frac{1}{\sqrt{3}}, c = 2$', '$m = \frac{1}{\sqrt{3}}, c = \sqrt{3}$', '$m = 1, c = -1$']::text[]),
  ('MQ-64d317-1-9', '64d317', 9, '1', '10. Volume of a cone is $220\text{ cm}^3$. The volume of the cylinder having ''same radius and height as that of the given cone is:', NULL, 'Mensuration', 'MCQ', 1, NULL, array['$220\text{ cm}^3$', '$110\text{ cm}^3$', '$660\text{ cm}^3$', '$330\text{ cm}^3$']::text[]),
  ('MQ-64d317-1-10', '64d317', 10, '1', '11. Evaluate: $(1 + \tan A)^2 + (1 - \tan A)^2$', NULL, 'Trigonometry', 'MCQ', 1, NULL, array['0', '$2\text{sec}A$', '$2\text{sec}^2 A$', '$2\tan^2 A$']::text[]),
  ('MQ-64d317-1-11', '64d317', 11, '1', '12. If the order of the matrix A is $m \times n$ and the order of the matrix B is $n \times p$, then the order of matrix AB is:', NULL, 'Matrices', 'MCQ', 2, NULL, array['$m \times n$', '$n \times p$', '$m \times p$', '$p \times p$']::text[]),
  ('MQ-64d317-1-12', '64d317', 12, '1', '13. If the line $2y = 3x + 2$ and $y = ax + 5$ are perpendicular to each other, find the value of a:', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$\frac{3}{2}$', '$\frac{2}{3}$', '$\frac{-2}{3}$', '$\frac{-3}{2}$']::text[]),
  ('MQ-64d317-1-13', '64d317', 13, '1', '14. Find the average of the following distribution:
| Variate (x) | 10 | 30 | 50 | 70 | 90 |
| --- | --- | --- | --- | --- | --- |
| Frequency (f) | 8 | 10 | 10 | 12 | 10 |', NULL, 'Statistics', 'MCQ', 2, NULL, array['47.5', '51.7', '52.4', '52.8']::text[]),
  ('MQ-64d317-1-14', '64d317', 14, '1', '15. The probability of passing students in a class is $\frac{7}{38}$. What is the probability of failure in the class?', NULL, 'Probability', 'MCQ', 2, NULL, array['$\frac{1}{38}$', '$\frac{31}{38}$', '$\frac{35}{38}$', '$\frac{7}{38}$']::text[]),
  ('MQ-64d317-2-0', '64d317', 15, '2', '(a) Use graph paper for this question. [use scale : on both axes 2 cm = 1 unit]
Plot A(4,4), B(4,-4), C(0,-4) and D(0,4), vertices of a rectangle.

i. Reflect A in y-axis to A'' and reflect A'' in x-axis to A''.
ii. Plot and write co-ordinates of A'' and A''.
iii. Name a single transformation which reflects B to A''.
iv. State the geometric name of the figure AA''A''B''.
v. Write the equation of any one diagonal of the figure AA''A''B''. [5]', 5, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-64d317-3-0', '64d317', 16, '3', '(a) If $A = \begin{bmatrix} 1 & 0 \\ -1 & 7 \end{bmatrix}$, find ''m'' such that $A^2 = 8A + ml$. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-64d317-3-1', '64d317', 17, '3', '(b) A shopkeeper buys an article whose printed price is Rs. 5000 from a wholesaler at a discount of 10% and sells it to the consumer at the printed price. if the sales are intra- state and the rate of GST is 12%, find:

i. The amount of tax (under GST) paid by the shopkeeper to the state government.
ii. The amount of tax (under GST) received by the Central Government.
iii. The amount which the consumer pays for the article inclusive of GST. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-64d317-3-2', '64d317', 18, '3', '(c) In the given figure, O is the centre of the circle. ADE is a straight line. $\angle BDE = 140^\circ$ and $ABC = 80^\circ$. Find:

i. $\angle BDC$.
ii. $\angle BOC$.
iii. $\angle BAC$.
iv. $\angle DBC$ [4]', 4, 'Circles', 'long', 2, '64d317__Hare_Krish_p2_img_0_jpeg.webp', NULL),
  ('MQ-64d317-4-0', '64d317', 19, '4', '(a) Prove that: \(\frac{\tan^2 A}{\tan A - 1} + \frac{\cot A}{1 - \tan A} = 1 + \cosec A.\sec A.\) [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-64d317-4-1', '64d317', 20, '4', '(b) The points \(A(7,3)\) and \(C(0,4)\) are the two opposite vertices of a rhombus ABCD.

the diagonals BD. [3]

i. The ratio in which point Q divides the line segment joining the points P(9,4) and R (-9,7). Find :
ii. The value of ''k''.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-64d317-5-0', '64d317', 21, '5', '(a) Solve for \( x \) using properties of proportion: \( \frac{x^4 + 1}{2x^2} = \frac{41}{9} \). [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-64d317-5-1', '64d317', 22, '5', '(b) Calculate the mean (correct to two decimal places) of the following data using step-deviation method: [3]

| Class interval | Frequency |
| --- | --- |
| 0-10 | 6 |
| 10-20 | 8 |
| 20-30 | 10 |
| 30-40 | 2 |
| 40-50 | 4 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-64d317-5-2', '64d317', 23, '5', '(c) Draw a circle of radius 4 cm. Mark its centre as C and mark a point D, such that CD = 7 cm. Using ruler and compasses only, construct two tangents from D to the circle. Measure their lengths. [4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-64d317-6-0', '64d317', 24, '6', '(a) Vidhusha has a recurring deposit account of Rs. 500 per month at \(6.5\%\) per annum. If he gets Rs. 812.50 as interest at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-64d317-6-1', '64d317', 25, '6', '(b) Solve the following inequation and write the solution set: \(\frac{-4}{3} \leq 2\left(\frac{x}{4} + 1\right) - \frac{4}{3} < \frac{5}{6}, x \in R\). [3] Represent the solution set on a real number line.', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-64d317-6-2', '64d317', 26, '6', '(c) A cylindrical container of diameter \(12\mathrm{cm}\) and height \(15\mathrm{cm}\) is filled with ice-cream. The whole ice-cream is to be distributed to 10 children in equal cones with hemispherical tops. If the height of the conical portion is four times radius of its base, find the radius of the ice-cream cone. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-64d317-7-0', '64d317', 27, '7', '(a) What number should be added to the polynomial \(3x^{3} + 2x^{2} - 19x\) so that \((x + 3)\) is a factor of the resulting polynomial? Factorize the resulting polynomial completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-64d317-7-1', '64d317', 28, '7', '(b) A jar contains some marbles of blue, green or white colour. The green and white marbles together are 36 in number. The probability of selecting a blue marble is \(\frac{1}{3}\) And the probability of selecting a green marble is \(\frac{4}{9}\). How many marbles are there of each colour? [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-64d317-7-2', '64d317', 29, '7', '(c)

i. Find the nature of roots of the following quadratic equation without solving it: \((2x + 3)(x - 2) + 2 = 0\)
ii. Solve the above quadratic equation. Give answer correct to three significant figures. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-64d317-8-0', '64d317', 30, '8', '(a) From the top of a light house AB, 100 m high, the angle of depression of two ships C and D on the opposite sides of it are 60° and 45° respectively. find the distance between the two ships to the nearest meter. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-64d317-8-1', '64d317', 31, '8', '(b) Use graph paper for this question. [6]

| Scores | Number of students |
| --- | --- |
| 400-500 | 20 |
| 500-600 | 10 |
| 600-700 | 14 |
| 700-800 | 22 |
| 800-900 | 30 |
| 900-1000 | 30 |
| 1000-1100 | 20 |
| 1100-1200 | 14 |

[scale : 2 cm = 100 marks on one axis and 2 cm = 20 students on the other axis]

The frequency distribution of scores obtained by 160 candidates in an entrance test is as follows:

Draw an ogive and hence, estimate:

1. i. The median score.
2. ii. The interquartile range of scores.
3. iii. Number of students who qualified the test, if 780 is the qualifying score.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-9d3c19-1-0', '9d3c19', 0, '1', '###### [Answer all the question from this part]

1(a)National trading company , Meerut (UP) made the supply of the following goods/services to Samartha traders,Noida(UP).Find the total amount of bill if the rate of GST=12%. [3]

| Quantity(No of pieces) | 20 | 30 | 12 | 40 |
| --- | --- | --- | --- | --- |
| MRP(in RS per piece) | 225 | 320 | 300 | 250 |
| Discount% | 40 | 30 | 50 | 40 |', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-1-1', '9d3c19', 1, '1', '(b) Given that x∈R, solve the following inequality and graph the solution on the number line:

$$- 1 \leq 3 + 4x < 23 \tag{3}$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-1-2', '9d3c19', 2, '1', '(c) If x= ($$\sqrt{a+1}$$+$$\sqrt{a-1}$$)/($$\sqrt{a+1}$$ - $$\sqrt{a-1}$$ ), using the properties of proportion show that : [4]

$$x^2 - 2ax + 1 = 0$$', 4, 'Ratio and Proportion', 'long', 1, NULL, NULL),
  ('MQ-9d3c19-2-0', '9d3c19', 3, '2', '2(a) Mr. Gulati has a Recurring Deposit Account of ₹300 per month. If the rate of interest is 12% and the maturity value of this account is ₹8100; find the time (in years) of this Recurring Deposit Account. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-2-1', '9d3c19', 4, '2', '(b) Find the value of A, where 0°≤A≤90°: cos(90° - A ). Sec77° = 1 [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-2-2', '9d3c19', 5, '2', '(c) Solve the quadratic equation for x ,giving your answer correct to 3 decimal places:

$$2x^2 + 11x + 4 = 0 \tag{4}$$', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-9d3c19-3-0', '9d3c19', 6, '3', '3(a) If A=[$$\begin{array}{cc} 2 & -1 \\ -1 & 3 \end{array}$$], evaluate A² – 3A + 2I, where I is a unit matrix of order 2. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-3-1', '9d3c19', 7, '3', '(b) Find the sum of all natural numbers between 250 and 1000 which are divisible by 9. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-3-2', '9d3c19', 8, '3', '(c) Two dice are thrown simultaneously. Find the probability that : (i) both the dice show the same number, (ii) the first dice shows 6 (iii) the total of the numbers on the dice is greater than 9. (iv) the product of the numbers on the dice is 8. [4]', 4, 'Probability', 'long', 1, NULL, NULL),
  ('MQ-9d3c19-4-0', '9d3c19', 9, '4', '4(a) Some students planned a picnic . The budget for the food was ₹480. As eight of them failed to join the party , the cost of the food for each member increased by ₹10.

Find , how many students went for the picnic? [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-4-1', '9d3c19', 10, '4', '(b) Find the value of ‘k’ if (x – 2) is a factor of x³ + 2x² – kx + 10. Hence, determine whether (x + 5) is also a factor. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-9d3c19-4-2', '9d3c19', 11, '4', '(c) Using the graph paper , plot the points A(6,4) and B(0,4).

(i) reflect A and B in the origin to get the images A’ and B’. (ii) Write the co-ordinates of A’ and B’, (iii) State the geometrical name for the figure ABA’B’. (iv) Find its perimeter. [4]', 4, 'Coordinate Geometry', 'long', 1, NULL, NULL),
  ('MQ-9d3c19-5-0', '9d3c19', 12, '5', '5(a) Two right circular solid cylinders have radii in the ratio 3:5 and heights in the ratio 2:3. Find the ratio between their : (i) curved surface areas (ii) volumes. [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-9d3c19-5-1', '9d3c19', 13, '5', '(b) The line joining the points (2,1) and (5,-8) is trisected at the points P and Q . If point P lies on the line 2x - y + K =0 , find the value of k . Also , find the co-ordinates of point Q. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-9d3c19-5-2', '9d3c19', 14, '5', '(c) In the figure given , AB and CD are straight lines through the centre O of a circle . If <AOC = 80° and <CDE = 40° , find the number of degrees in (i) <DCE (ii) <ABC. [4]', 4, 'Circles', 'long', 2, '9d3c19__Hcs_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-9d3c19-6-0', '9d3c19', 15, '6', '6(a) In triangle ABC , co-ordinates of vertices A,B and C are (4,7) , (-2,3) and (0,1) respectively. Find the equation of the median through vertex A. Also , find the equation of the line through vertex B and parallel to AC. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-9d3c19-6-1', '9d3c19', 16, '6', '(b) PT is a tangent to the circle at T. If <ABC= 70° and <ACB= 50°; calculate (i) <CBT [3]
(ii)<BAT,(iii)<APT', 3, 'Circles', 'short', 2, '9d3c19__Hcs_X_Math_p2_img_1_jpeg.webp', NULL),
  ('MQ-9d3c19-6-2', '9d3c19', 17, '6', '(c) In the figure, given below , ABCD is a parallelogram. P is a point on BC such that BP:PC = 1:2. DP produced meets AB produced at Q . Given the area of triangle CPQ = 20cm².Calculate :

(i) area of triangle CDP (ii) area of parallelogram ABCD. [4]', 4, 'Similarity', 'long', 2, '9d3c19__Hcs_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-9d3c19-7-0', '9d3c19', 18, '7', '7(a) Let \( \mathrm{A} = \begin{bmatrix} 4 & -2 \\ 6 & -3 \end{bmatrix} \), \( \mathrm{B} = \begin{bmatrix} 0 & 2 \\ 1 & -1 \end{bmatrix} \) and \( \mathrm{C} = \begin{bmatrix} -2 & 3 \\ 1 & -1 \end{bmatrix} \). Find \( \mathrm{A}^2 - \mathrm{A} + \mathrm{BC} \).', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-9d3c19-7-1', '9d3c19', 19, '7', '(b) Prove that : \( \frac{\cos\theta\cot\theta}{1+\sin\theta}=\operatorname{cosec}\theta-1 \) [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-9d3c19-7-2', '9d3c19', 20, '7', '(c) The following table shows the expenditure of 60 boys on books. Find the mode of their expenditure: [4]

| Expenditure(₹) | 20-25 | 25-30 | 30-35 | 35-40 | 40-45 | 45-50 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 7 | 23 | 18 | 6 | 2 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-9d3c19-8-0', '9d3c19', 21, '8', '8(a) How many terms of the series \( 18+15+12+ \) ...when added together will give 45? [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-9d3c19-8-1', '9d3c19', 22, '8', '(b) Find the area of the canvas required to make a conical tent 14m high and 96m in diameter. Given that :

(i) \(20\%\) of the canvas is used in folds and stitchings. (ii) canvas used in folds and stitchings is \(20\%\) of the curved surface area of the tent. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-9d3c19-9-0', '9d3c19', 23, '9', '9(a) What number should be subtracted from \( x3 + 3x2 - 8x + 14 \) so that on dividing it by x - 2, the remainder is 10? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-9d3c19-9-1', '9d3c19', 24, '9', '(b) In the right – angled triangle QPR, PM is an altitude. Given that QR = 8cm and MQ = 3.5 cm, calculate the value of PR. [3]', 3, 'Similarity', 'short', 3, '9d3c19__Hcs_X_Math_p3_img_1_jpeg.webp', NULL),
  ('MQ-9d3c19-9-2', '9d3c19', 25, '9', '(c) A motor- boat, whose speed is 9km/h in still water, goes 12km downstream and comes back in a total time of 3 hrs. Find the speed of the stream. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-9d3c19-10-0', '9d3c19', 26, '10', '10(a) The angle of elevation of the top of an unfinished tower from a point at a distance of 80m from its base is \( 30^{\circ} \) . How much higher must the tower be raised so that its angle of elevation at the same point may be \( 60^{\circ} \) ? [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-9d3c19-10-1', '9d3c19', 27, '10', '(b) Using a graph paper , draw an ogive for the following distribution which shows a record of the weight in kilograms of 200 students.

| Weight | 40-45 | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 17 | 22 | 45 | 51 | 31 | 20 | 9 |

Use your Ogive to estimate the following : (i) The percentage of students weighing 55 kg or more,
(ii) The weight above which the heaviest 30% of the students fall, (iii) The number of students who are (a) under – weight and (b) over – weight , if 55.70kg is considered as standard weight? [6]', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-b00c17-1-0', 'b00c17', 0, '1', '(a) Without solving the quadratic equation, find the values of ‘p’ for which the given equation has real and equal roots.

\[
x ^ {2} + 2 (p - 1) x + (p + 5) = 0 \tag {3}
\]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-b00c17-1-1', 'b00c17', 1, '1', '(b) Given \( A = \begin{pmatrix} 2 & -1 \\ 2 & 6 \end{pmatrix} \) , \( B = \begin{pmatrix} -3 & 2 \\ 4 & 0 \end{pmatrix} \) , \( C = \begin{pmatrix} 1 & 3 \\ 0 & -4 \end{pmatrix} \) , find the matrix X such that \( A + 2X = 3B + C \) . [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-b00c17-1-2', 'b00c17', 2, '1', '(c) Puneet has a recurring deposit account in a bank and deposits ₹ 400 per month. If he receives ₹ 10,100 at the time of maturity, find the time (in years) for which the account is held if the rate of interest is 5%. [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-b00c17-2-0', 'b00c17', 3, '2', '(a) When the polynomials $ax^3 + 5x^2 - 11x - 14$ and $3x^3 + ax^2 - 4x + 20$ are divided by $(x + 2)$, the remainders are same. Find the value of ''a''. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-b00c17-2-1', 'b00c17', 4, '2', '(b) Solve for $x$ and write the solution set for the following inequations and represent it on the number line.

$$x - 3 \leq \frac{8x}{3} + 2 \leq 2x + \frac{14}{3}, \quad x \in I \tag{3}$$', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-b00c17-2-2', 'b00c17', 5, '2', '(c) Draw a histogram for the following data and estimate the mode. [4]

| Income in ₹ | 5000 – 6000 | 6000 – 7000 | 7000 – 8000 | 8000 – 9000 | 9000 – 10000 |
| --- | --- | --- | --- | --- | --- |
| Number of employees | 4 | 8 | 20 | 12 | 6 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-b00c17-3-0', 'b00c17', 6, '3', '(a) In the figure, AC is a diameter of the circle, with centre O. Chords BA and CD extended meet at point P. If $\angle P = 35^{\circ}$ and $\angle ACB = 20^{\circ}$,

Calculate: (i) $\angle BDC$

(ii) $\angle ABD$

(iii) $\angle AOB$', 3, 'Circles', 'short', 2, 'b00c17__Hfs_Powai__p2_img_0_jpeg.webp', NULL),
  ('MQ-b00c17-3-1', 'b00c17', 7, '3', '(b) Prove that $(\text{cosec } \theta - \sin\theta) (\sec\theta - \cos\theta) = \frac{1}{\tan\theta + \cot\theta}$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-b00c17-3-2', 'b00c17', 8, '3', '(c) (i) Write down the coordinates of the point P that divides the line joining A(7, 14) and B(-3, 4) in the ratio 1 : 4.

(ii) Find the midpoint of AB. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-b00c17-4-0', 'b00c17', 9, '4', '(a) 125 cones of diameter 1.2cm and height 1cm are dropped into a beaker containing some water and are fully submerged. If the diameter of the beaker is 6cm, calculate the rise in the water level in the beaker. [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-b00c17-4-1', 'b00c17', 10, '4', '(b) If two – digit numbers are made with 3, 5, 7 and 9, what is the probability that the number is

(i) Greater than 55
(ii) A prime number. [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-b00c17-4-2', 'b00c17', 11, '4', '(c) An article is marked at ₹5000 and the rate of GST is 5%. A trader buys it at a discount and sells it to a customer at MP. If the trader pays ₹ 60 as GST to the Government, find

(i) What per cent of discount does the trader get?
(ii) The total money paid by the trader including tax to buy the article.[4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-b00c17-5-0', 'b00c17', 12, '5', '(a) Solve the following equation and calculate the answer correct to

3 significant figures.

$$(x - 2)^2 - 2x - 5 = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-b00c17-5-1', 'b00c17', 13, '5', '(b) Calculate the mean of the distribution. [3]

| Marks | 11 – 20 | 21 – 30 | 31 – 40 | 41 – 50 | 51 – 60 | 61 – 70 | 71 – 80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 7 | 9 | 12 | 9 | 6 | 3 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-b00c17-5-2', 'b00c17', 14, '5', '(c) In the given figure, PQRS is a cyclic quadrilateral. PQ and SR produced meet at T.

(i) Prove that $\Delta TPS \sim \Delta TRQ$
(ii) Find SP, if TP = 18cm, QR = 4cm and TR = 6cm.
(iii) Find the area of quadrilateral PQRS, if the area of $\Delta TPS = 27 \text{ cm}^2$[4]', 4, 'Similarity', 'long', 3, 'b00c17__Hfs_Powai__p3_img_0_jpeg.webp', NULL),
  ('MQ-b00c17-6-0', 'b00c17', 15, '6', '(a) $$A = \begin{pmatrix} -4 & 6 \\ 3 & -5 \end{pmatrix}, B = \begin{pmatrix} -4 & 2 \end{pmatrix}$$ and PA = B.

Find :

(i) The order of matrix P.

(ii) The matrix P. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-b00c17-6-1', 'b00c17', 16, '6', '(b) Find the centroid of Δ ABC where, A ≡ (7, -3), B ≡ (6, 1), and C ≡ (2, 5). If the equation of a median of the triangle is 2x + y + k = 0, find the value of ''k''. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-b00c17-6-2', 'b00c17', 17, '6', '(c) The horizontal distance between two towers is 120m. The angle of elevation of the top and the angle of depression of the bottom of the first tower as observed from the second are 30° and 24° respectively. Find the height of the towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-b00c17-7-0', 'b00c17', 18, '7', '(a) 2x - 5y + 18 = 0 meets X-axis at A. Find the coordinates of A. Find the equation of line passing through A and the point of intersection of 2x +y = 5 and x - 2y = 5. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-b00c17-7-1', 'b00c17', 19, '7', '(b) If a, b, c, d are in proportion, prove that:

$$\frac{\sqrt{a^4 + c^4}}{\sqrt{b^4 + d^4}} = \frac{ma^2 + nc^2}{mb^2 + nd^2}$$ [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-b00c17-7-2', 'b00c17', 20, '7', '(c) In the figure, O is the centre of the circle, ST is a tangent to the circle at D, ∠ABO = 30° and ∠BDS = 66°. Find ∠A, ∠C and ∠ADT.', 3, 'Circles', 'short', 4, 'b00c17__Hfs_Powai__p4_img_0_jpeg.webp', NULL),
  ('MQ-b00c17-8-0', 'b00c17', 21, '8', '(a) Use remainder theorem to factorize the following polynomial:

$$2y^3 - 5y^2 - 19y + 42 \tag{3}$$', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-b00c17-8-1', 'b00c17', 22, '8', '(b) If all even numbered cards are removed from a pack of 52 playing cards.

What is the probability that a card picked up is

- (i) a face card
- (ii) a prime numbered card

(iii) a red multiple of 5. [3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-b00c17-8-2', 'b00c17', 23, '8', '(c) Plot P(2, 4), Q(-2, 1) and R(5, 0). Reflect points P and Q in x-axis to get P and Q in x-axis to get P'' and Q''.

- (i) Write their co-ordinates.
- (ii) Give a geometrical name to the figure formed by joining the points PQQ''P''R. Find its area and perimeter.
- (iii) Name two points from the figure which are invariant on reflection in x-axis. [4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-b00c17-9-0', 'b00c17', 24, '9', '- (a) The 4th term of an A.P. is 22 and 15th term is 66. Find the first term and the common difference. Hence, find the sum of the series to 8 terms. [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-b00c17-9-1', 'b00c17', 25, '9', '- (b) D and E are two points on sides AB and BC respectively of ΔABC such that ∠EDB = ∠ACB.

(i) Prove that ΔABC ~ ΔEBD

(ii) If BE = 6cm, EC = 4cm, BD = 5cm and area of ΔBED = 9cm²,

Calculate the (1) length of AB

(2) area of ΔABC. [3]', 3, 'Similarity', 'short', 5, 'b00c17__Hfs_Powai__p5_img_0_jpeg.webp', NULL),
  ('MQ-b00c17-9-2', 'b00c17', 26, '9', '(c) Some glass flower vases were bought for ₹6000. Ten were damaged during transporting. The remaining were sold for a total profit of ₹1200 by selling each for ₹60 more than what was paid for. Find the number of vases bought. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-b00c17-10-0', 'b00c17', 27, '10', '(a) The following table gives the daily wages of 120 workers in a small factory.

| Wages in ₹ | No. of workers |
| --- | --- |
| 50 – 100 | 14 |
| 100 – 150 | 13 |
| 150 – 200 | 26 |
| 200 – 250 | 18 |
| 250 – 300 | 15 |
| 300 – 350 | 12 |
| 350 – 400 | 9 |
| 400 – 450 | 7 |
| 450 – 500 | 6 |

Draw a ogive for the given data on a graph sheet.

Use a scale of 2cm = ₹50 on one axis and 2cm = 10 workers on the other axis. Use the ogive to estimate the:

- (i) median
- (ii) lower quartile
- (iii) number of workers earning more than ₹325
- (iv) number of workers who earn between ₹175 and ₹325 [6]', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-b00c17-10-1', 'b00c17', 28, '10', '(b) If $$y = \frac{\sqrt{a + x} + \sqrt{a - x}}{\sqrt{a + x} - \sqrt{a - x}}$$, show that $$x = \frac{2ay}{y^2 + 1}$$ [4]', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-b00c17-11-0', 'b00c17', 29, '11', '(a) Find 4 numbers in A.P. whose sum is – 4 and the sum of whose squares is 84. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-b00c17-11-1', 'b00c17', 30, '11', '(b) Prove that $$\frac{(cosA - sin A)(1 + tanA)}{2cos^2 A - 1} = \sec A$$ [3]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-b00c17-11-2', 'b00c17', 31, '11', '(c) A tent is in a form of a cylinder surmounted by a cone. The height of the tent above the ground is 85m and the height of the cylindrical part is 50m. If the diameter of the base is 168m, find the quantity of canvas required to make the tent allowing 20% extra for folding and stitching. Give your answer to nearest m². [4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-9985ff-1-0', '9985ff', 0, '1', 'a. Find the sum of the terms of sequence 5 + 8 + 11 + ... 68. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-9985ff-1-1', '9985ff', 1, '1', 'b. If -5 is a root of the quadratic equation $$2x^2 + px = 15$$ and the quadratic equation $$p(x^2 + x) + k = 0$$ has equal roots, find the value of k. [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-9985ff-1-2', '9985ff', 2, '1', 'c. ABCD is a cyclic quadrilateral in which ∠ DAC = 27°; ∠ DBA = 50° and ∠ ADB = 33°. Calculate: ∠ DBC, ∠ DCB and ∠ CAB. [4]', 4, 'Circles', 'long', 1, '9985ff__Hfs_Thane__p1_img_0_jpeg.webp', NULL),
  ('MQ-9985ff-2-0', '9985ff', 3, '2', 'a. A recurring deposit account of ₹ 1,200 per month has a maturity value of ₹ 12,440. If the rate of interest is 8% and the interest is calculated at the end of every month, find the time (in months) of this recurring deposit account. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-9985ff-2-1', '9985ff', 4, '2', 'b. In the given figure ∠ PQR = ∠ PST = 90⁰, PQ = 5 cm and PS = 2 cm. [3]

i. Prove that Δ PQR ~ Δ PST.

ii. Find the area of Δ PQR: area of quadrilateral SRQT.', 3, 'Similarity', 'short', 1, '9985ff__Hfs_Thane__p1_img_1_jpeg.webp', NULL),
  ('MQ-9985ff-2-2', '9985ff', 5, '2', 'c. Draw a histogram for the given data using a graph paper and estimate the mode from the graph. [4]

| Class interval | 31-36 | 37-42 | 43-48 | 49-54 | 55-60 | 61-66 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 6 | 12 | 20 | 15 | 9 | 4 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-9985ff-3-0', '9985ff', 6, '3', 'a. Given \( A = \begin{bmatrix} 1 & 5 \\ 1 & 2 \end{bmatrix} \) , \( C = \begin{bmatrix} 2 \\ 1 \end{bmatrix} \) , find the matrix B such that AB = 3C [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-9985ff-3-1', '9985ff', 7, '3', 'b. Point P (9a - 2, -b) divides the line segment joining point A (3a + 1, -3) and B (8a, 5) in the ratio 3: 1. Find the values of a and b. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-9985ff-3-2', '9985ff', 8, '3', 'c. Find the value of x, if the mean of the following distribution is 18. [4]

| Data | 13 | 15 | 17 | 19 | 20+x | 23 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 2 | 3 | 4 | 5x | 6 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-9985ff-4-0', '9985ff', 9, '4', 'a. For a trader, marked price of a refrigerator is ₹ 15,680 inclusive of GST at the rate of 12% on the marked price. Sunil, a customer for this refrigerator, asks the trader to reduce the marked price of the refrigerator to such extend that its reduced price plus GST on it is equal to marked price of the refrigerator. Find the required reduction. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-9985ff-4-1', '9985ff', 10, '4', 'b. A (1, -5), B (2, 2) and C (-2, 4) are the vertices of \(\Delta\) ABC, find the equation of the median of the triangle through the vertex A. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-9985ff-4-2', '9985ff', 11, '4', 'c. Prove that: \( (\sin A + \sec A)^{2} + (\cos A + \cosec A)^{2} = (1 + \sec A \cdot \cosec A)^{2} \) [4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-9985ff-5-0', '9985ff', 12, '5', 'a. The mean of 1, 7, 5, 3, 4 and 4 is m. The numbers 3, 2, 4, 2, 3, 3 and p have mean as (m-1) and median as q. Find p and q. [3]', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-9985ff-5-1', '9985ff', 13, '5', 'b. In the figure given below PQ = QR, \( \angle RQP = 68^{\circ} \) , PC and CQ are tangents to the circle with centre O. Calculate the values of: i) \( \angle QOP \) ii) \( \angle QCP \) . [3]', 3, 'Circles', 'short', 2, '9985ff__Hfs_Thane__p2_img_0_jpeg.webp', NULL),
  ('MQ-9985ff-5-2', '9985ff', 14, '5', 'c. Using the factor theorem, show that (x-2) is a factor of \( x^3 + x^2 - 4x - 4 \). Hence factorise the polynomial completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-9985ff-6-0', '9985ff', 15, '6', 'a. Given A = [4 sin30° cos0° cos 0° 4 sin 30°] and B = [4/5] if AX = B. [3]

i. Write the order of matrix X

ii. Find the matrix X', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-9985ff-6-1', '9985ff', 16, '6', 'b. Solve the quadratic equation 3x² + 5x - 9 = 0. Give your answer correct to two decimal places. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-9985ff-6-2', '9985ff', 17, '6', 'c. In the given figure, ABC is a triangle. DE is parallel to BC and AD/DB = 3/2 [4]

i. Find the ratios: AD/AB and DE/BC

ii. Prove that ΔDEF is similar to ΔCBF and find EF/FB.

iii. Find the ratio of the areas of ΔDEF and ΔBFC.', 4, 'Similarity', 'long', 3, '9985ff__Hfs_Thane__p3_img_0_jpeg.webp', NULL),
  ('MQ-9985ff-7-1', '9985ff', 18, '7', 'b. A box contains cards bearing numbers from 6 to 70. If one card is drawn at random from the box, find the probability that it bears: [3]

i. a one-digit number

ii. an odd number less than 30

iii. a composite number between 50 and 70', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-9985ff-7-2', '9985ff', 19, '7', 'c. Solve for x, using the properties of proportionality: (1+x+x²)/(1-x+x²) = (62(1+x))/63(1-x) [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-9985ff-8-0', '9985ff', 20, '8', 'a. 3080 cm³ of water is required to fill a cylindrical vessel completely and 2310 cm³ of water is required to fill it up to 5 cm below the top. [3]

Find:

i. radius of the vessel.

ii. height of the vessel.

iii. wetted surface area of the vessel when it is half-filled with water.', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-9985ff-8-1', '9985ff', 21, '8', 'b. In the following figure, a circle is inscribed in the quadrilateral ABCD. If BC = 38 cm [3]

QB = 27 cm, DC = 25 cm and that AD is perpendicular to DC, find the radius of the circle.', 3, 'Circles', 'short', 3, '9985ff__Hfs_Thane__p4_img_0_jpeg.webp', NULL),
  ('MQ-9985ff-8-2', '9985ff', 22, '8', 'c. Use a graph paper to plot the given points: [4]

i. A (0,5), B (2,5), C (5,2), D (5, -2), E (2, -5) and F (0, -5).
ii. Reflect B, C, D and E on the y-axis and name these points as B'', C'', D'' and E'' respectively and write their co-ordinates.
iii. Name the figure formed by BCDEE''D''C''B''.
iv. Name a line of symmetry for the figure formed.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-9985ff-9-0', '9985ff', 23, '9', 'a. In the given figure, AC is a transverse common tangent to two circles with centres P and Q and of radii 6 cm and 3 cm respectively. Given that AB = 8 cm, calculate PQ. [3]', 3, 'Circles', 'short', 4, '9985ff__Hfs_Thane__p4_img_1_jpeg.webp', NULL),
  ('MQ-9985ff-9-1', '9985ff', 24, '9', 'b. The sum of the 4th and 8th terms of an AP is 24 and the sum of the 6th and the 10th terms is 44. Find the first three terms of the AP. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-9985ff-9-2', '9985ff', 25, '9', 'c. From a solid cylinder whose height is 16 cm and radius is 12 cm, a conical cavity of height 8 cm and of base radius 6 cm is hollowed out. Find the volume and total surface area of the remaining solid. [4]', 4, 'Mensuration', 'long', 4, '9985ff__Hfs_Thane__p4_img_2_jpeg.webp', NULL),
  ('MQ-9985ff-10-0', '9985ff', 26, '10', 'a. Solve the following inequation, write the solution set and represent it on the number line. [3]

$$-3(x-7) \geq 15 - 7x > \frac{x+1}{3}, x \in R$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-9985ff-10-1', '9985ff', 27, '10', 'b. For a dealer A, the list price of an article is ₹ 9000, which he sells to dealer B at some lower price. Further, dealer B sells the same article to a customer at its list price. If the rate of GST is 18% and dealer B paid a tax, under GST, equal to ₹ 324 to the government, find the amount paid by dealer B (inclusive of GST). [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-9985ff-10-2', '9985ff', 28, '10', 'c. The following table shows the lifetime in days of 100 electric bulbs of a certain make. Find the mean lifetime of electric bulbs by using step deviation method. [4]

| Lifetime in days | 0-50 | 50-100 | 100-150 | 150-200 | 200-250 | 250-300 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of bulbs | 8 | 15 | 32 | 26 | 12 | 7 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-9985ff-11-0', '9985ff', 29, '11', 'a. The horizontal distance between two towers is 120 m. The angles of elevation of the top and angle of depression of the bottom of the first tower as observed form the second tower are 30° and 24° respectively. Find the height of the two towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-9985ff-11-1', '9985ff', 30, '11', 'b. The marks obtained by 200 students in an examination are given below. Draw an Ogive for following distribution and use it to estimate: [6]

i. The median marks
ii. The number of students who failed if minimum marks required to pass is 40.
iii. If scoring 85 and more is considered as grade one, find the number of students who secured grade one in the examination.

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 11 | 10 | 20 | 28 | 37 | 40 | 29 | 14 | 6 |', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-324e9b-1-1', '324e9b', 0, '1', '(ii) In triangles ABC and DEF, LB = LE, LF = LC and AB = 3DE, then the two triangles are', 1, 'Similarity', 'MCQ', 1, NULL, array['congruent but not similar', 'similar but not congruent', 'neither congruent nor similar', 'congruent and similar']::text[]),
  ('MQ-324e9b-1-2', '324e9b', 1, '1', '(iii) Volume of a hemispherical ball of diameter 10.5cm can hold?', 1, 'Mensuration', 'MCQ', 1, NULL, array['0.303lit', '3.03lit', '0.030lit', '30.3lit']::text[]),
  ('MQ-324e9b-1-3', '324e9b', 2, '1', '(iv) Which of the following points is invariant with respect to the line y = -2', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(3,2)', '(3, -2)', '(2,3)', '(-2, 3)']::text[]),
  ('MQ-324e9b-1-4', '324e9b', 3, '1', '(v) The 21st term of an A.P whose first two terms are -3 and 4, is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['17', '137', '143', '-143']::text[]),
  ('MQ-324e9b-1-5', '324e9b', 4, '1', '(vi) If the cost of an article is Rs. 25,000, and CGST paid by the customer is Rs. 2250, the rate of GST is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['9%', '10%', '15%', '18%']::text[]),
  ('MQ-324e9b-1-6', '324e9b', 5, '1', '(vii) If Y = $$\begin{bmatrix} 3 & 2 \\ 1 & 4 \end{bmatrix}$$ and 2X + Y = $$\begin{bmatrix} 1 & 0 \\ -3 & 2 \end{bmatrix}$$, then X is', 1, 'Matrices', 'MCQ', 1, NULL, array['$$\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$$', '$$\begin{bmatrix} 1 & -1 \\ 2 & -1 \end{bmatrix}$$', '$$\begin{bmatrix} -1 & 1 \\ -2 & 1 \end{bmatrix}$$', '$$\begin{bmatrix} -1 & -1 \\ -2 & -1 \end{bmatrix}$$']::text[]),
  ('MQ-324e9b-1-7', '324e9b', 6, '1', '(viii) If $\sqrt{2}$ is the root of the equation $kx^2 + \sqrt{2}x - 4 = 0$, then the value of $k$ is', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['1', '-1', '$-\sqrt{2}$', '$\pm \sqrt{2}$']::text[]),
  ('MQ-324e9b-1-8', '324e9b', 7, '1', '(ix) Two direct common tangents exist if', 1, 'Circles', 'MCQ', 2, NULL, array['the two circles do not touch each other', 'the two circles touch each other externally', 'the two circles touch each other internally', 'the two circles intersect each other']::text[]),
  ('MQ-324e9b-1-9', '324e9b', 8, '1', '(x) The set from which values of the variable involved in the inequation are chosen is called', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['empty set', 'solution set', 'null set', 'replacement set']::text[]),
  ('MQ-324e9b-1-10', '324e9b', 9, '1', '(xi) The sum of last 10 terms of A.P 8, 10, 12, ...126 is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-40', '1170', '40', '1710']::text[]),
  ('MQ-324e9b-1-11', '324e9b', 10, '1', '(xii) The remainder when $2x^2 - 5x + 1$ is divided by $(x+3)$', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['34', '4', '43', '-32']::text[]),
  ('MQ-324e9b-1-12', '324e9b', 11, '1', '(xiii) Consider the following frequency distribution
| Class | 0 - 5 | 6 - 11 | 12 - 17 | 18 - 23 | 24 - 29 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 13 | 10 | 15 | 8 | 11 |
The upper limit of the median class is', 1, 'Statistics', 'MCQ', 2, NULL, array['17', '17.5', '18', '18.5']::text[]),
  ('MQ-324e9b-1-13', '324e9b', 12, '1', '(xiv) The point which divides the line segment joining the points $(7, -6)$ and $(3, 4)$ in the ratio 1:2 internally lies in', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['I quadrant', 'II quadrant', 'III quadrant', 'IV quadrant']::text[]),
  ('MQ-324e9b-1-14', '324e9b', 13, '1', '(xv) If $M = \begin{bmatrix} 2 & 0 \\ 1 & 2 \end{bmatrix}$ and $N = \begin{bmatrix} 2 & 0 \\ -1 & 2 \end{bmatrix}$ then $M + 2N$ is', 1, 'Matrices', 'MCQ', 2, NULL, array['$\begin{bmatrix} 6 & 0 \\ -1 & 6 \end{bmatrix}$', '$\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$', '$\begin{bmatrix} 8 & 0 \\ 0 & 8 \end{bmatrix}$', '$\begin{bmatrix} 6 & 0 \\ -1 & -6 \end{bmatrix}$']::text[]),
  ('MQ-324e9b-2-0', '324e9b', 14, '2', '(i) Sonia has a recurring deposit account in a bank. She deposits Rs. 2500 per month for 2 years. If she gets Rs. 66250 at the time of maturity, find

(a) interest paid by the bank

(b) rate of interest

[4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-324e9b-2-1', '324e9b', 15, '2', '(ii) If $7x - 15y = 4x + y$, find the value of (a) $\frac{9x+5y}{9x-5y}$ (b) $\frac{3x^2 + 2y^2}{3x^2 - 2y^2}$ [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-324e9b-2-2', '324e9b', 16, '2', '(iii) Prove the following identity $\frac{\sin \theta \tan \theta}{1 - \cos \theta} = 1 + \sec \theta$ [4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-324e9b-3-0', '324e9b', 17, '3', '(i) A sphere of diameter 12cm is dropped in a right circular cylindrical vessel, partly filled with water. If the sphere is completely submerged in water, the water level in the cylindrical vessel rises by $3\frac{5}{9}$. Find the diameter of the cylindrical vessel. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-324e9b-3-1', '324e9b', 18, '3', '(ii) Find the equation of the line passing through the points $(0, -2)$ and the point of intersection of the lines $4x + 3y = 1$ and $3x - y + 9 = 0$ [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-324e9b-3-2', '324e9b', 19, '3', '(iii) Use a graph sheet for this question.

Take 1 cm = 1 unit along both x and y axis.

(a) Plot the following points: A(0,5), B(3,0), C(1,0) and D(1, -5)
(b) Reflect the points B,C and D on the y-axis and name them as B'', C'', D'' respectively.

(c) Write down the coordinates of B'', C'', and D''

(d) Join the points A, B, C, D, D'', C'', B'', A in order and give a name to the closed figure ABCDD''C''B'' [5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-324e9b-4-0', '324e9b', 20, '4', '(i) A retailer buys a TV from a manufacturer for Rs. 25000. He marks the price of the TV 20% above his cost price and sells it to a consumer at 10% discount on the marked price. If the sales are intra-state and the rate of GST is 12%, find

(a) Consumers cost price of TV inclusive of tax(under GST)

(b) GST paid by the retailer to the Central and State Governments. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-324e9b-4-1', '324e9b', 21, '4', '(ii) Solve the quadratic equation and give your answer correct to 2 decimal places

$$7x^2 + 2x - 2 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-324e9b-4-2', '324e9b', 22, '4', '(iii) Draw a histogram for the following frequency distribution and calculate the mode.

| Class | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 7 | 18 | 10 | 8 | 5 |

[4]', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-324e9b-5-0', '324e9b', 23, '5', '(i) If $X = \begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$, show that $6X - X^2 = 9I$ where I is the unit matrix. [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-324e9b-5-1', '324e9b', 24, '5', '(ii) In the given figure, AB is a diameter of a circle with centre O and AT is a tangent. If $\angle AOQ = 58^\circ$, find $\angle ATQ$ [3]', 3, 'Circles', 'short', 3, '324e9b__Hutchings__p3_img_0_jpeg.webp', NULL),
  ('MQ-324e9b-5-2', '324e9b', 25, '5', '(iii) Given that $(x + 2)$ and $(x + 3)$ are factors of $2x^3 + ax^2 + 7x - b$. Determine the values of a and b [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-324e9b-6-0', '324e9b', 26, '6', '(i) Find the equation of the right bisector of the line segment joining the points A(3, -4) and B(5, -6). [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-324e9b-6-1', '324e9b', 27, '6', '(ii) Find $\theta$, if $\frac{\cos^2\theta - 3\cos\theta + 2}{\sin^2\theta} = 1$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-324e9b-6-2', '324e9b', 28, '6', '(iii) The sum of first five terms and the sum of first seven terms of the same A.P is 167. If the sum of first ten terms of this A.P is 235, find the sum of its first twenty terms. [4]', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-324e9b-7-0', '324e9b', 29, '7', '(i) A game of numbers has cards marked with 11, 12, 13, ...40. A card is drawn at random. Find the probability that the number on the card is :

(a) a perfect square (b) divisible by 7 [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-324e9b-7-1', '324e9b', 30, '7', '(ii) Find the least number of coins of diameter 2.5 cm and height 3 mm which are to be melted to form a solid cylinder of radius 3 cm and height 5 cm [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-324e9b-7-2', '324e9b', 31, '7', '(iii) In the adjoining figure, AC is a diameter of the circle. If AB = BC and L AED = 118°, then find :

(a) L DEC

[4]', 4, 'Circles', 'long', 4, '324e9b__Hutchings__p4_img_0_jpeg.webp', NULL),
  ('MQ-324e9b-8-0', '324e9b', 32, '8', '(i) Solve the following inequation, write the solution set and represent it on the number line :

$$- \frac{x}{3} \leq \frac{x}{2} - 1 \frac{1}{3} < \frac{1}{6}, \quad x \in \mathbb{R}.$$ [3]', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-324e9b-8-1', '324e9b', 33, '8', '(ii) Find the mean for the following frequency distribution by step deviation method

| Class | 84 - 90 | 90 - 96 | 96 - 102 | 102 - 108 | 108 - 114 |
| --- | --- | --- | --- | --- | --- |
| Intervals | | | | | |
| Frequency | 8 | 12 | 15 | 10 | 5 |

[3]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-324e9b-8-2', '324e9b', 34, '8', '(iii) In the adjoining figure AD = 4cm, BD = 11cm, AE = 6cm and EC = 4cm.

(a) Prove that \(\Delta ADE - \Delta ACB\)
(b) If \(\angle ABC = 40^{\circ}\), find \(\angle AED\)
(c) If DE = 7cm, find BC

[4]', 4, 'Similarity', 'long', 4, '324e9b__Hutchings__p4_img_1_jpeg.webp', NULL),
  ('MQ-324e9b-9-0', '324e9b', 35, '9', '(i) The table below shows the distribution of the scores obtained by 120 students in a shooting competition. Using a graph sheet, draw an ogive for the distribution

(Use scale 2cm = 10 units on both axes)

| Score obtained | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Use your ogive to estimate

(a) The median

(b) the interquartile range

(c) the number of shooters who obtained more than 75% scores

[6]', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-324e9b-9-1', '324e9b', 36, '9', '(ii) Sonal can row a boat at a speed of 5km/hr. If it takes her 1hr more to row the boat 5.25km upstream, than to return downstream, find the speed of the stream. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-324e9b-10-0', '324e9b', 37, '10', '(i) If (4a + 5b) (4c - 5d) = (4a - 5b) (4c + 5d), prove that a, b, c, d are in proportion. [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-324e9b-10-1', '324e9b', 38, '10', '(ii) Draw a line AQ = 7cm. Mark a point P on AQ such that AP = 4cm. Using ruler and compasses only, construct

(a) A circle with AP as diameter

(b) Two tangents to the above circle from point Q [3]', 3, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-324e9b-10-2', '324e9b', 39, '10', '(iii) A boy 1.7m is standing 20m away from a flagstaff on the same level ground. He observes that the angle of elevation of the top of the flagstaff is 24°. Calculate the height of the flagstaff.

[4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-c07ec7-1-0', 'c07ec7', 0, '1', 'a) Solve the following inequation and write the solution set:

13x - 5 < 15x + 4 < 7x + 12, x ∈ R. Represent the solution on a real number line.', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-c07ec7-1-1', 'c07ec7', 1, '1', 'b) A die is thrown two times and the total score of two throws is noted. Find the probability that the score is :

- i) an even number
- ii) 7
- iii) at least 9', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-c07ec7-1-2', 'c07ec7', 2, '1', 'c) Using the Remainder and Factor Theorem, factorise $$x^3 + 10x^2 - 37x + 26$$', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-c07ec7-2-0', 'c07ec7', 3, '2', '- a) Find the value of ''a'' for which the following points A (a, 3), B (2, 1) and C (5, a) are collinear. Hence find the equation of the line.', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-c07ec7-2-1', 'c07ec7', 4, '2', '- b) Find the mean of the following distribution:

| C.I. | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 6 | 8 | 12 | 5 | 9 |', 3, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-c07ec7-2-2', 'c07ec7', 5, '2', 'c) Given $$A = \begin{bmatrix} 3 & 0 \\ 0 & 4 \end{bmatrix}$$, $$B = \begin{bmatrix} a & b \\ 0 & c \end{bmatrix}$$ and $$AB = A + B$$, find the values of $$a, b$$ and $$c$$.', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-c07ec7-3-0', 'c07ec7', 6, '3', 'a) An A.P. consists of 50 terms of which the third term is 12 and the last term is 106. Find the 29th term.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-c07ec7-3-1', 'c07ec7', 7, '3', 'b) Manufacturer A sells a washing machine to a dealer B for ₹15000. The dealer B sells it to a consumer at a profit of ₹1800. if the sales are intrastate and the rate of GST is 18%, find

i) the amount of GST paid by the dealer B to the central government.
ii) the amount of GST received by the state government.
iii) the amount that the consumer pays for the machine.', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-c07ec7-3-2', 'c07ec7', 8, '3', 'c) The volume of a conical tent is $$1232m^3$$ and the area of the base floor is $$154m^2$$.

Calculate the: i) radius of the floor

ii) height of the tent

iii) length of the Canvas required to cover this conical tent if its width is 2 m.', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-c07ec7-4-0', 'c07ec7', 9, '4', 'a) Prove the identity: \((\sin \theta + \cos \theta)\) (\(\tan \theta + \cot \theta\)) = \(\sec \theta + \csc \theta\)', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-c07ec7-4-1', 'c07ec7', 10, '4', 'b) In the adjoining figure, PQ=RQ, \(\angle RQP = 68^0\), PC and QC are tangents to the circle with centre O.

Calculate the values of : i) $$\angle QOP$$

ii) $$\angle QCP$$', 3, 'Circles', 'short', 2, 'c07ec7__Hyderabad__p2_img_0_jpeg.webp', NULL),
  ('MQ-c07ec7-4-2', 'c07ec7', 11, '4', 'c) (Use a graph paper to answer the question. Take 1cm = 1unit on both the axes.)

i) Point \( P(x, y) \) is reflected in the x-axis to \( P''(5, -2) \). Find the coordinates of \( P \).
ii) \(P^{\prime \prime}\) is the reflection of \(\mathsf{P}\) when reflected in the y-axis.

Write down the coordinates of $$P''''$$

iii) Name a single transformation that maps $$P''$$ to $$P''''$$.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-c07ec7-5-0', 'c07ec7', 12, '5', '- a) Solve the equation $x^2 - 4x - 8 = 0$. Give your answer correct to 2 decimal places.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-c07ec7-5-1', 'c07ec7', 13, '5', '- b) A bag contains 15 balls of which some are white and the others are red. If the probability of drawing a red ball is twice that of a white ball, find the number of white balls in the bag.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-c07ec7-5-2', 'c07ec7', 14, '5', '- c) Using the properties of proportion, solve $\frac{(3x+2)^2 + (3x-2)^2}{(3x+2)^2 - (3x-2)^2} = \frac{5}{4}$', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-c07ec7-6-0', 'c07ec7', 15, '6', '- a) Let $M$ be a matrix such that $M \times \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix} = \begin{bmatrix} 4 & -7 \end{bmatrix}$ .

i) State the order of M and ii) find M', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-c07ec7-6-1', 'c07ec7', 16, '6', '- b) Mr. Rana has a recurring deposit account in a bank for 2 years at 14% S.I. per annum. If he gets ₹13750 at the time of maturity, find the monthly instalment.', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-c07ec7-6-2', 'c07ec7', 17, '6', '- c) ABC is a right angled triangle with $\angle ABC = 90^\circ$ . D is any point on AB and DE is perpendicular to AC. Prove that:

(i) $\triangle ADE \sim \triangle ACB$ .

(ii) If $AC = 13$ cm, $BC = 5$ cm and $AE = 4$ cm. Find DE and AD.

(iii) Find, area of $\triangle ADE$ : area of quadrilateral BCED.', 4, 'Similarity', 'long', 3, 'c07ec7__Hyderabad__p3_img_0_jpeg.webp', NULL),
  ('MQ-c07ec7-7-0', 'c07ec7', 18, '7', 'a) The first term of an A.P. is 5, the last term is 45 and the sum of its terms is 1000.
Find the number of terms and the common difference.', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-c07ec7-7-1', 'c07ec7', 19, '7', 'b) The daily pocket expenses of 200 students in a school are given below:
Draw a histogram for the following distribution, and find the mode from the graph.

| Expenses (in ₹) | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 | 30-35 | 35-40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students (f) | 10 | 14 | 28 | 42 | 50 | 30 | 14 | 12 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-c07ec7-7-2', 'c07ec7', 20, '7', 'c) A man observes the angle of elevation of the top of a building to be 30°. He walks towards it in a horizontal line through its base, covering 60 m the angle of elevation changes to 60°. Find the height of the building correct to the nearest metre.', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-c07ec7-8-0', 'c07ec7', 21, '8', 'a) A shopkeeper buys a certain number of books for ₹ 720. If the cost per book was ₹ 5 less, then the number of books that could be bought for ₹ 720 would be 2 more. Taking the original cost of each book to be ₹ x, write an equation in x and solve it. (4m)', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-c07ec7-8-1', 'c07ec7', 22, '8', 'b) Use a graph paper to draw an ogive for the given distribution, which shows the marks obtained by 100 students in the General Knowledge paper.

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No.of students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Use the ogive to estimate the:

i) median
ii) lower quartile
iii) number of students who obtained more than 85% marks
iv) number of students who did not pass ,if the pass percentage was 35 (6 m)', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-c07ec7-9-0', 'c07ec7', 23, '9', 'a) Without solving the following quadratic equation, find the value of ''p'' for which the given equation has real and equal roots:

$$x^2 + (p - 3)x + p = 0$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-c07ec7-9-1', 'c07ec7', 24, '9', 'b) Prove that: $$\frac{\cos A}{1 - \tan A} + \frac{\sin A}{1 - \cot A} = \sin A + \cos A$$', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-c07ec7-9-2', 'c07ec7', 25, '9', 'c) In the given figure, AB is the diameter of the circle with centre O. DO is parallel to CB and $$\angle DCB = 120^\circ$$.

Calculate : i) $$\angle DAB$$ ii) $$\angle DBA$$ iii) $$\angle DBC$$', 4, 'Circles', 'long', 5, 'c07ec7__Hyderabad__p5_img_0_jpeg.webp', NULL),
  ('MQ-c07ec7-10-0', 'c07ec7', 26, '10', 'a) A conical vessel whose internal radius 5cm and height 24cm is full of water.
The water is emptied into a cylindrical vessel with internal radius 10cm.
Find the height to which water rises.', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-c07ec7-10-1', 'c07ec7', 27, '10', 'b) If a,b and c are in continued proportion, prove that $$\frac{2a^2-5ab+7b^2}{2b^2-5bc+7c^2} = \frac{a}{c}$$', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-c07ec7-10-2', 'c07ec7', 28, '10', 'c) Find the ratio in which the line segment joining the points A(3, -3) and B(-2, 7) is divided by the x-axis. Also find the coordinates of the point of division.', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-c07ec7-11-0', 'c07ec7', 29, '11', 'a) In the adjoining figure, CE is a tangent to the circle at point C. ABCD is a cyclic quadrilateral,

if $$\angle ABC = 87^0$$ and $$\angle DCE = 38^0$$, find :

i) $$\angle ADC$$

ii) $$\angle CAD$$

iii) $$\angle ACD$$', 3, 'Circles', 'short', 6, 'c07ec7__Hyderabad__p6_img_0_jpeg.webp', NULL),
  ('MQ-c07ec7-11-1', 'c07ec7', 30, '11', 'b) What number should be subtracted from $$2x^3 - 5x^2 + 5x$$ so that the resulting polynomial has a factor $$2x - 3$$', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-c07ec7-11-2', 'c07ec7', 31, '11', 'c) From a circular cylinder of diameter 10cm and height 12cm, a conical cavity of the same base radius and of the same height is hollowed out. Find the total surface area of the remaining solid.(Take $$\pi = 3.14$$)', 4, 'Mensuration', 'long', 6, 'c07ec7__Hyderabad__p6_img_1_jpeg.webp', NULL),
  ('MQ-47e321-1-0', '47e321', 0, '1', '(a) Ranbir borrows 20,000 at \(12\%\) per annum compound interest. If he repays 8400 at the end of the first year and 9680 at the end of the second year, find the amount of loan outstanding at the beginning of the third year. [3]', 3, NULL, 'short', 1, NULL, NULL),
  ('MQ-47e321-1-1', '47e321', 1, '1', '(b) Find the value of \( x \), which satisfy the inequation \( -2\frac{5}{6} < \frac{1}{2} - \frac{2x}{3} \leq 2 \), \( x \in W \). Graph the solution set on the number line. [3]', 3, 'Linear Inequations', 'short', 1, '47e321__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-47e321-1-2', '47e321', 2, '1', '(c) A die has 6 faces marked by the given numbers as shown below:

1 2 3 -1 -2 -3

The die is thrown once. What is the probability of getting

(i) a positive integer.
(ii) an integer greater than -3.
(iii) the smallest integer.', NULL, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-47e321-2-1', '47e321', 3, '2', 'count in a bank and deposited ₹ 800

94 at the time of maturity, find the

[3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-47e321-2-2', '47e321', 4, '2', 'A (-4, 2) and B(3, 6) is divided by

[4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-47e321-3-0', '47e321', 5, '3', '(a) Without using trigonometric tables, evaluate

$$\sin^2 34^\circ + \sin^2 56^\circ + 2 \tan 18^\circ \tan 72^\circ - \cot^2 30^\circ \tag{3}$$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-47e321-3-1', '47e321', 6, '3', '(b) Using the Remainder and Factor Theorem, factorise the following polynomial :

$$x^3 + 10x^2 - 37x + 26 \tag{3}$$', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-47e321-3-2', '47e321', 7, '3', '(c) In the figure given below, ABCD is a rectangle. AB = 14 cm, BC = 7 cm. From the rectangle, a quarter circle BFEC and a semicircle DGE are removed. Calculate the area of the remaining piece of the rectangle. (Take $$\pi = 22/7$$) [4]', 4, 'Mensuration', 'long', 4, '47e321__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-47e321-4-0', '47e321', 8, '4', '(a) The numbers 6, 8, 10, 12, 13 and \( x \) are arranged in an ascending order. If the mean of the observations is equal to the median, find the value of \( x \). [3]', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-47e321-4-1', '47e321', 9, '4', '(b) In the figure, \(\angle DBC = 58^{\circ}\). BD is a diameter of the circle. Calculate:

(i) $\angle BDC$

(ii) $\angle BEC$

(iii) $\angle BAC$

[3]', 3, 'Circles', 'short', 6, '47e321__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-47e321-4-2', '47e321', 10, '4', '(c) Using graph paper to answer the following questions. (Take 2 cm = 1 unit on both axis)

(i) Plot the points \(A(-4,2)\) and \(B(2,4)\)
(ii) \(A^{\prime}\) is the image of \(A\) when reflected in the \(y\)-axis. Plot it on the graph paper and write the coordinates of \(A^{\prime}\).
(iii) \(B^{\prime}\) is the image of \(B\) when reflected in the line AA''. Write the coordinates of \(B^{\prime}\).
(iv) Write the geometric name of the figure \(ABA''B''\).
(v) Name a line of symmetry of the figure formed. [4]', 4, 'Coordinate Geometry', 'long', 6, '47e321__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-47e321-5-0', '47e321', 11, '5', '(a) A shopkeeper bought a washing machine at a discount of 20% from a wholesaler, the printed price of the washing machine being ₹ 18,000. The shopkeeper sells it to a consumer at a discount of 10% on the printed price. If the rate of sales tax is 8% find:

(i) the VAT paid by the shopkeeper.
(ii) the total amount that the consumer pays for the washing machine.

[3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-47e321-5-1', '47e321', 12, '5', '(b) If $$\frac{x^2 + y^2}{x^2 - y^2} = \frac{17}{8}$$, then find the value

(i) \(x:y\)
(ii) \(\frac{x^3 + y^3}{x^3 - y^3}\)', NULL, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-47e321-5-2', '47e321', 13, '5', '(c) In $$\Delta ABC$$, $$\angle ABC = \angle DAC$$. $$AB = 8 \text{ cm}$$.

(i) Prove that \(\Delta ACD\) is similar to \(\Delta\).
(ii) Find \(BC\) and \(CD\)
(iii) Find area of \(\Delta ACD\) : area of \(\Delta ABC\)', NULL, 'Similarity', 'short', 8, '47e321__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-47e321-6-0', '47e321', 14, '6', '(a) Find the value of ''a'' for which the following points \( A \) (a, 3), \( B \) (2, 1) and \( C \) (5, a) are collinear. Hence find the equation of the line. [3]', 3, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-47e321-6-1', '47e321', 15, '6', '(b) Salman invests a sum of money in 50 shares, paying \(15\%\) dividend quoted at \(20\%\) premium. If his annual dividend is 600, calculate:

(i) the number of shares he bought.
(ii) his total investment.
(iii) the rate of return on his investment. [3]', 3, 'Shares and Dividends', 'short', 9, NULL, NULL),
  ('MQ-47e321-6-2', '47e321', 16, '6', '(c) The surface area of a solid metallic sphere is 2464 cm². It is melted and recast into solid right circular cones of radius 3.5 cm and height 7 cm. Calculate:

(i) the radius of the sphere.
(ii) the number of cones recast. (Take \(\pi = 22 / 7\) [4]', 4, 'Mensuration', 'long', 10, NULL, NULL),
  ('MQ-47e321-7-0', '47e321', 17, '7', '(a) Calculate the mean of the distribution given below using the short cut method.

| Marks | 11-20 | 21-30 | 31-40 | 41-50 | 51-60 | 61-70 | 71-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 2 | 6 | 10 | 12 | 9 | 7 | 4 |

[3]', 3, 'Statistics', 'short', 11, NULL, NULL),
  ('MQ-47e321-7-1', '47e321', 18, '7', '(b) In the figure given below, diameter $AB$ and $CD$ of a circle meet at $P$. $PT$ is a tangent to the circle at $T$. $CD = 7.8 \, \text{cm}$, $PD = 5 \, \text{cm}$, $PD = 4 \, \text{cm}$. Find:

(i) \(AB\)
(ii) the length of tangent PT.

[3]', 3, 'Circles', 'short', 11, '47e321__ICSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-47e321-7-2', '47e321', 19, '7', '(c) Let $A = \begin{bmatrix} 2 & 1 \\ 0 & -2 \end{bmatrix}$, $B = \begin{bmatrix} 4 & 1 \\ -3 & -2 \end{bmatrix}$ and $C = \begin{bmatrix} -3 & 2 \\ -1 & 4 \end{bmatrix}$.

Find $A^2 + AC - 5B$.

[4]', 4, 'Matrices', 'long', 11, NULL, NULL),
  ('MQ-47e321-8-0', '47e321', 20, '8', '(a) The compound interest, calculated yearly, on a certain sum of money for the second year is ₹ 1320 and for the third year is ₹ 1452. Calculate the rate of interest and the original sum of money. [3]', 3, 'GST and Banking', 'short', 13, NULL, NULL),
  ('MQ-47e321-8-1', '47e321', 21, '8', '(b) Construct a \(\Delta ABC\) with \(BC = 6.5\mathrm{cm}\), \(AB = 5.5\mathrm{cm}\), \(AC = 5\mathrm{cm}\). Construct the incircle of the triangle. Measure and record the radius of the incircle. [3]', 3, 'Constructions', 'short', 13, '47e321__ICSE_X_Mat_p13_img_0_jpeg.webp', NULL),
  ('MQ-47e321-8-2', '47e321', 22, '8', '(c) (Use a graph paper for this question.) The daily pocket expenses of 200 students in a school are given below:

| Pocket expenses (in ₹) | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 | 30-35 | 35-40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students (frequency) | 10 | 14 | 28 | 42 | 50 | 30 | 14 | 12 |

Draw a histogram representing the above distribution and estimate the mode from the graph.', NULL, 'Statistics', 'short', 13, '47e321__ICSE_X_Mat_p14_img_0_jpeg.webp', NULL),
  ('MQ-47e321-9-0', '47e321', 23, '9', '(a) If \((x - 9):(3x + 6)\) is the duplicate ratio of \(4:9\), find the value of \(x\). [3]', 3, 'Ratio and Proportion', 'short', 14, NULL, NULL),
  ('MQ-47e321-9-1', '47e321', 24, '9', '(b) Solve for \( x \) using the quadratic formula. Write your answer correct to two significant figures. \( (x - 1)^2 - 3x + 4 = 0 \). [3]', 3, 'Quadratic Equations', 'short', 14, NULL, NULL),
  ('MQ-47e321-9-2', '47e321', 25, '9', '(c) A page from the saving bank account of Priyanka is given below:

| Date | Particulars | Amount withdrawn (₹) | Amount deposited (₹) | Balance (₹) |
| --- | --- | --- | --- | --- |
| 03/04/2006 | B/F | — | — | 4,000.00 |
| 05/04/2006 | By cash | — | 2,000.00 | 6,000.00 |
| 18/04/2006 | By cheque | — | 6,000.00 | 12,000.00 |
| 25/05/2006 | To cheque | 5,000.00 | — | 7,000.00 |
| 30/05/2006 | By cash | — | 3,000.00 | 10,000.00 |
| 20/07/2006 | By self | 4,000.00 | — | 6,000.00 |
| 10/09/2006 | By cash | — | 2,000.00 | 8,000.00 |
| 19/09/2006 | To cheque | 1,000.00 | — | 7,000.00 |

If the interest earned by Priyanka for the period of ending September, 2006 is ₹ 175, find the rate of interest. [4]', 4, 'GST and Banking', 'long', 14, NULL, NULL),
  ('MQ-47e321-10-0', '47e321', 26, '10', '(a) A two digit positive number is such that the product of its digits is 6. If 9 is added to the number, the digits interchange their places. Find the number. [4]', 4, 'Quadratic Equations', 'long', 15, NULL, NULL),
  ('MQ-47e321-10-1', '47e321', 27, '10', '(b) The marks obtained by 100 students in a Mathematics test are given below:

| Marks | No. of Students |
| --- | --- |
| 0-10 | 3 |
| 10-20 | 7 |
| 20-30 | 12 |
| 30-40 | 17 |
| 40-50 | 23 |
| 50-60 | 14 |

Ans.
Mathematics, 2014

| 60-70 | 9 |
| --- | --- |
| 70-80 | 6 |
| 80-90 | 5 |
| 90-100 | 4 |

Draw an ogive for the given distribution on a graph sheet.

(Use a scale of 2 cm = 10 units on both axis).

Use the ogive to estimate the :

(i) median.
(ii) lower quartile.
(iii) number of students who obtained more than \(85\%\) marks in the test.
(iv) number of students who did not pass in the test if the pass percentage was 35. [6]', 6, 'Statistics', 'long', 15, '47e321__ICSE_X_Mat_p17_img_0_jpeg.webp', NULL),
  ('MQ-47e321-11-0', '47e321', 28, '11', '(a) In the figure given below, O is the centre of the circle. AB and CD are two chords of the circle. OM is perpendicular to AB and ON is perpendicular to CD.

$AB = 24 \text{ cm}, OM = 5 \text{ cm}, ON = 12 \text{ cm}$. Find the :

(i) radius of the circle.
(ii) length of chord CD.
[3]', 3, 'Circles', 'short', 17, '47e321__ICSE_X_Mat_p17_img_1_jpeg.webp', NULL),
  ('MQ-47e321-11-1', '47e321', 29, '11', '(b) Prove the identity:

$$
(\sin \theta + \cos \theta) (\tan \theta + \cot \theta) = \sec \theta + \operatorname{cosec} \theta. \tag{3}
$$', 3, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-47e321-11-2', '47e321', 30, '11', '(c) An aeroplane at an altitude of 250 m observes the angle of depression of two boats on the opposite banks of a river to be $45^\circ$ and $60^\circ$ respectively. Find the width of the river. Write the answer correct to the nearest whole number. [4]', 4, 'Trigonometry', 'long', 18, '47e321__ICSE_X_Mat_p19_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-1-0', '4512d3', 0, '1', '(a) A shopkeeper bought an article for ₹ 3,450. He marks the price of the article 16% above the cost price. The rate of sales tax charged on the article is 10%.
Find the:

(i) marked price of the article.
(ii) price paid by a customer who buys the article. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-4512d3-1-1', '4512d3', 1, '1', '(b) Solve the following inequation and write the solution set:

$$13x - 5 < 15x + 4 < 7x + 12, x \in \mathbb{R}$$

Represent the solution on a real number line. ] [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-4512d3-1-2', '4512d3', 2, '1', '(c) Without using trigonometric tables evaluate:

$$\frac{\sin 65^{\circ}}{\cos 25^{\circ}} + \frac{\cos 32^{\circ}}{\sin 58^{\circ}} - \sin 28^{\circ} \cdot \sec 62^{\circ} + \text{cosec}^2 30^{\circ} \tag{4}$$', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-4512d3-2-0', '4512d3', 3, '2', '(a) If \( A = \begin{bmatrix} 3 & x \\ 0 & 1 \end{bmatrix} \) and \( B = \begin{bmatrix} 9 & 16 \\ 0 & -y \end{bmatrix} \), find \( x \) and \( y \) when \( A^2 = B \). [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-4512d3-2-1', '4512d3', 4, '2', '(b) The present population of a town is 2,00,000. Its population increases by \(10\%\) in the first year and \(15\%\) in the second year. Find the population of the town at the end of the two years. [3]', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-4512d3-2-2', '4512d3', 5, '2', '(c) Three vertices of a parallelogram ABCD taken in order are A (3, 6), B (5, 10) and C (3, 2) find:

(i) the coordinates of the fourth vertex D.
(ii) length of diagonal BD.
(iii) equation of side AB of the parallelogram ABCD.', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-4512d3-3-0', '4512d3', 6, '3', '(a) In the given figure, ABCD is a square of side 21 cm. AC and BD are two diagonals of the square. Two semi circles are drawn with AD and BC as diameters. Find the area of the shaded region. ( Take $$\pi = \frac{22}{7}$$ ) [3]', 3, 'Mensuration', 'short', 2, '4512d3__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-3-1', '4512d3', 7, '3', '(b) The marks obtained by 30 students in a class assessment of 5 marks is given below:

| Marks | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 1 | 3 | 6 | 10 | 5 | 5 |

Calculate the mean, median and mode of the above distribution. [3]', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-4512d3-3-2', '4512d3', 8, '3', '(c) In the figure given below, O is the centre of the circle and SP is a tangent. If ∠SRT = 65°, find the value of x, y and z.

[4]', 4, 'Circles', 'long', 3, '4512d3__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-4-0', '4512d3', 9, '4', '(a) Katrina opened a recurring deposit account with a Nationalised Bank for a period of 2 years. If the bank pays interest at the rate of 6% per annum and the monthly instalment is ₹1,000, find the:
(i) interest earned in 2 years.
(ii) matured value. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-4512d3-4-1', '4512d3', 10, '4', '(b) Find the value of ''K'' for which x = 3 is a solution of the quadratic equation, (K + 2) x² - Kx + 6 = 0.
Thus find the other root of the equation. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-4512d3-4-2', '4512d3', 11, '4', '(c) Construct a regular hexagon of side 5 cm. Construct a circle circumscribing the hexagon. All traces of construction must be clearly shown. [4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-4512d3-5-0', '4512d3', 12, '5', '(a) Use a graph paper for this question taking 1 cm = 1 unit along both the x and y axis:
(i) Plot the points A(0, 5), B(2, 5), C(5, 2), D(5, -2), E(2, -5) and F(0, -5).

T15 511

10 Years
Question
Paper.com
16 Years
Question
Paper.com

(ii) Reflect the points B, C, D and E on the y-axis and name them respectively as B'', C'', D'' and E''.
(iii) Write the coordinates of B'', C'', D'' and E''.
(iv) Name the figure formed by B C D E E'' D''C''B''.
(v) Name a line of symmetry for the figure formed.

[5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-4512d3-5-1', '4512d3', 13, '5', '(b) Virat opened a Savings Bank account in a bank on 16th April 2010. His pass book shows the following entries:

| Date | Particulars | Withdrawal (₹) | Deposit (₹) | Balance (₹) |
| --- | --- | --- | --- | --- |
| April 16, 2010 | By cash | - | 2500 | 2500 |
| April 28th | By cheque | - | 3000 | 5500 |
| May 9th | To cheque | 850 | - | 4650 |
| May 15th | By cash | - | 1600 | 6250 |
| May 24th | To cash | 1000 | - | 5250 |
| June 4th | To cash | 500 | - | 4750 |
| June 30th | By cheque | - | 2400 | 7150 |
| July 3rd | By cash | - | 1800 | 8950 |

Calculate the interest Virat earned at the end of 31st July, 2010 at 4% per annum interest. What sum of money will he receive if he closes the account on 1st August, 2010?

[5]', 5, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-4512d3-6-0', '4512d3', 14, '6', '(a) If a, b, c are in continued proportion, prove that

$$(a + b + c) (a - b + c) = a^2 + b^2 + c^2.$$

[3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-4512d3-6-1', '4512d3', 15, '6', '(b) In the given figure ABC is a triangle and BC is parallel to the y-axis. AB and AC intersects the y-axis at P and Q respectively.

(i) Write the coordinates of A.
(ii) Find the length of AB and AC.
(iii) Find the ratio in which \(Q\) divides AC.
(iv) Find the equation of the line AC. [4]', 4, 'Coordinate Geometry', 'long', 5, '4512d3__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-6-2', '4512d3', 16, '6', '(c) Calculate the mean of the following distribution:

| Class Interval | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 5 | 12 | 35 | 24 | 16 |

[3]', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-4512d3-7-0', '4512d3', 17, '7', '(a) Two solid spheres of radii 2 cm and 4 cm are melted and recast into a cone of height 8 cm. Find the radius of the cone so formed. [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-4512d3-7-1', '4512d3', 18, '7', '(b) Find ''a'' if the two polynomials $ax^3 + 3x^2 - 9$ and $2x^3 + 4x + a$, leaves the same remainder when divided by $x+3$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-4512d3-7-2', '4512d3', 19, '7', '(c) Prove that $\frac{\sin \theta}{1 - \cot \theta} + \frac{\cos \theta}{1 - \tan \theta} = \cos \theta + \sin \theta$ [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-4512d3-8-0', '4512d3', 20, '8', '(a) AB and CD are two chords of a circle intersecting at P. Prove that

$$AP \times PB = CP \times PD$$

[3]', 3, 'Circles', 'short', 6, '4512d3__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-8-1', '4512d3', 21, '8', '(b) A bag contains 5 white balls, 6 red balls and 9 green balls. A ball is drawn at random from the bag. Find the probability that the ball drawn is:
(i) a green ball
(ii) a white or a red ball
(iii) is neither a green ball nor a white ball. [3]', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-4512d3-8-2', '4512d3', 22, '8', '(c) Rohit invested ₹ 9,600 on ₹ 100 shares at ₹ 20 premium paying 8% dividend. Rohit sold the shares when the price rose to ₹ 160. He invested the proceeds (excluding dividend) in 10% ₹ 50 shares at ₹ 40. Find the:
(i) original number of shares.
(ii) sale proceeds.
(iii) new number of shares.
(iv) change in the two dividends. [4]', 4, 'Shares and Dividends', 'long', 6, NULL, NULL),
  ('MQ-4512d3-9-0', '4512d3', 23, '9', '(a) The horizontal distance between two towers is 120m. The angle of elevation of the top and angle of depression of the bottom of the first tower as observed from the second tower is $30^\circ$ and $24^\circ$ respectively.

T15 511

10 Years Question Paper.com
1 Years
Question
Paper.com

Find the height of the two towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 6, '4512d3__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-9-1', '4512d3', 24, '9', '(b) The weight of 50 workers is given below:

| Weight in Kg | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 | 100-110 | 110-120 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No.of Workers | 4 | 7 | 11 | 14 | 6 | 5 | 3 |

Draw an ogive of the given distribution using a graph sheet. Take 2 cm = 10 kg on one axis and 2cm = 5 workers along the other axis. Use a graph to estimate the following:

- (i) the upper and lower quartiles.
- (ii) if weighing 95 Kg and above is considered overweight find the number of workers who are overweight. [6]', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-4512d3-10-0', '4512d3', 25, '10', '(a) A wholesaler buys a TV from the manufacturer for ₹ 25,000. He marks the price of the TV 20% above his cost price and sells it to a retailer at a 10% discount on the marked price. If the rate of VAT is 8%, find the:

- (i) marked price.
- (ii) retailer''s cost price inclusive of tax.
- (iii) VAT paid by the wholesaler. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-4512d3-10-2', '4512d3', 26, '10', '(c) ABC is a right angled triangle with ∠ABC = 90°. D is any point on AB and DE is perpendicular to AC. Prove that:-

(i) ΔADE ~ ΔACB.

(ii) If AC = 13 cm, BC = 5 cm and AE = 4 cm.
Find DE and AD.

(iii) Find, area of ΔADE: area of quadrilateral BCED.

[4]', 4, 'Similarity', 'long', 8, '4512d3__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-4512d3-11-0', '4512d3', 27, '11', '(a) Sum of two natural numbers is 8 and the difference of their reciprocal is 1/15.

Find the numbers.

[3]', 3, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-4512d3-11-1', '4512d3', 28, '11', '(b) Given $$\frac{x^3 + 12x}{6x^2 + 8} = \frac{y^3 + 27y}{9y^2 + 27}$$. Using componendo and dividendo find x.

[3]', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-4512d3-11-2', '4512d3', 29, '11', '(c) Construct a triangle ABC with AB = 5.5 cm, AC = 6 cm and ∠BAC = 105°.
Hence:

(i) Construct the locus of points equidistant from BA and BC.

(ii) Construct the locus of points equidistant from B and C.

(iii) Mark the point which satisfies the above two loci as P. Measure and write the length of PC.

[4]', 4, 'Constructions', 'long', 8, NULL, NULL),
  ('MQ-3bd972-1-0', '3bd972', 0, '1', '(a) Using remainder theorem, find the value of k if on dividing 2x^3 + 3x^2 - kx + 5 by x - 2, leaves a remainder 7. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-3bd972-1-1', '3bd972', 1, '1', '(b) Given A = [2 - 1, 0] and I = [1 0, 0 1] and A^2 = 9A + mI. Find m. [4]', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-3bd972-1-2', '3bd972', 2, '1', '(c) The mean of following numbers is 68. Find the value of ''x''. [3]
45, 52, 60, x, 69, 70, 26, 81 and 94.

Hence estimate the median.', 3, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-3bd972-2-0', '3bd972', 3, '2', '(a) The slope of a line joining $P(6, k)$ and $Q(1-3k, 3)$ is $\frac{1}{2}$. Find [3]
(i) $k$
(ii) Midpoint of PQ, using the value of ''k'' found in (i).', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-3bd972-2-1', '3bd972', 4, '2', '(b) Without using trigonometrical tables, evaluate: [4]
$$\text{cosec}^2 57^\circ - \tan^2 33^\circ + \cos 44^\circ \text{cosec} 46^\circ - \sqrt{2} \cos 45^\circ - \tan^2 60^\circ$$', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-3bd972-2-2', '3bd972', 5, '2', '(c) A certain number of metallic cones, each of radius 2 cm and height 3 cm are melted and recast into a solid sphere of radius 6cm. Find the number of cones. [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-3bd972-3-1', '3bd972', 6, '3', '(b) In the figure given below, AD is a diameter. O is the centre of the circle. AD is parallel to BC and $\angle CBD = 32^\circ$. Find: [4]
(i) $\angle OBD$
(ii) $\angle AOB$
(iii) $\angle BED$.', 4, 'Circles', 'long', 2, '3bd972__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-3bd972-3-2', '3bd972', 7, '3', '(c) If $(3a + 2b): (5a + 3b) = 18:29$. Find $a:b$. [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-3bd972-4-0', '3bd972', 8, '4', '(a) A game of numbers has cards marked with 11, 12, 13, ..., 40. A card is drawn at random. Find the Probability that the number on the card drawn is: [3]
(i) A perfect square
(ii) Divisible by 7', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-3bd972-4-1', '3bd972', 9, '4', '(b) Use graph paper for this question. [4]
(Take 2 cm = 1 unit along both x and y axis.)
Plot the points O (0, 0), A (-4, 4), B (-3, 0) and C (0, -3)
(i) Reflect points A and B on the y axis and name them A'' and B'' respectively. Write down their coordinates.
(ii) Name the figure OABCB''A''.
(iii) State the line of symmetry of this figure.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-3bd972-4-2', '3bd972', 10, '4', '(c) Mr. Lalit invested ₹5000 at a certain rate of interest, compounded annually for two years. At the end of first year it amounts to ₹5325. Calculate [3]
(i) The rate of interest.
(ii) The amount at the end of second year, to the nearest rupee.', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-3bd972-5-0', '3bd972', 11, '5', '(a) Solve the quadratic equation $$x^2 - 3(x + 3) = 0$$; Give your answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3bd972-5-1', '3bd972', 12, '5', '(b) A page from the savings bank account of Mrs. Ravi is given below.

[4]

| Date | Particulars | Withdrawal (₹) | Deposit (₹) | Balance (₹) |
| --- | --- | --- | --- | --- |
| April 3^{rd} 2006 | B/F | | | 6000 |
| April 7^{th} | By cash | | 2300 | 8300 |
| April 15^{th} | By cheque | | 3500 | 11800 |
| May 20^{th} | To self | 4200 | | 7600 |
| June 10^{th} | By cash | | 5800 | 13400 |
| June 15^{th} | To self | 3100 | | 10300 |
| August 13^{th} | By cheque | | 1000 | 11300 |
| August 25^{th} | To self | 7400 | | 3900 |
| September 6^{th} 2006 | By cash | | 2000 | 5900 |

She closed the account on 30$^{th}$ September, 2006. Calculate the interest Mrs. Ravi earned at the end of 30$^{th}$ September, 2006 at 4.5% per annum interest. Hence, find the amount she receives on closing the account.', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-3bd972-5-2', '3bd972', 13, '5', '(c) In what time will Rs.1500 yield Rs.1996.50 as compound interest at 10% per annum compounded annually?

[3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-3bd972-6-0', '3bd972', 14, '6', '(a) Construct a regular hexagon of side 5 cm. Hence construct all its lines of symmetry and name them.

[3]', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-3bd972-6-1', '3bd972', 15, '6', '(b) In the given figure PQRS is a cyclic quadrilateral PQ and SR produced meet at T.

[4]

(i) Prove $$\Delta TPS \sim \Delta TRQ$$.

(ii) Find SP if TP = 18cm, RQ = 4 cm and TR = 6cm.

(iii) Find area of quadrilateral PQRS if area of $$\Delta PTS = 27 \text{ cm}^2$$.', 4, 'Similarity', 'long', 4, '3bd972__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-3bd972-6-2', '3bd972', 16, '6', '(c) Given matrix $A = \begin{bmatrix} 4 \sin 30^\circ & \cos 0^\circ \\ \cos 0^\circ & 4 \sin 30^\circ \end{bmatrix}$ and $B = \begin{bmatrix} 4 \\ 5 \end{bmatrix}$ [3]

If $AX = B$

- (i) Write the order of matrix $X$ .
- (ii) Find the matrix '' $X$ ''.', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-3bd972-7-0', '3bd972', 17, '7', '(a) An aeroplane at an altitude of 1500 metres finds that two ships are sailing towards it in the same direction. The angles of depression as observed from the aeroplane are $45^\circ$ and $30^\circ$ respectively. Find the distance between the two ships. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-3bd972-7-1', '3bd972', 18, '7', '(b) The table shows the distribution of the scores obtained by 160 shooters in a shooting competition. Use a graph sheet and draw an ogive for the distribution. (Take $2\text{cm} = 10$ scores on the $X$ axis and $2\text{cm} = 20$ shooters on the $Y$ -axis). [6]

| Scores | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 9 | 13 | 20 | 26 | 30 | 22 | 15 | 10 | 8 | 7 |

Use your graph to estimate the following:

- (i) The median.
- (ii) The interquartile range.
- (iii) The number of shooters who obtained a score of more than 85%.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-3bd972-8-1', '3bd972', 19, '8', '(b) Draw a line $AB = 5$ cm. Mark a point $C$ on $AB$ such that $AC = 3$ cm. Using a ruler and a compass only, construct: [4]
- (i) A circle of radius 2.5 cm, passing through $A$ and $C$ .
- (ii) Construct two tangents to the circle from the external point $B$ . Measure and record the length of the tangents.', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-3bd972-8-2', '3bd972', 20, '8', '(c) A line AB meets X-axis at A and Y-axis at B. P(4, -1) divides AB in the ratio 1:2. [3]

(i) Find the coordinates of A and B.

(ii) Find the equation of the line through P and perpendicular to AB.', 3, 'Coordinate Geometry', 'short', 6, '3bd972__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-3bd972-9-0', '3bd972', 21, '9', '(a) A dealer buys an article at a discount of 30% from the wholesaler, the marked price being ₹6,000. The dealer sells it to a shopkeeper at a discount of 10% on the marked price. If the rate of VAT is 6%, find [3]

(i) The price paid by the shopkeeper including the tax.

(ii) The VAT paid by the dealer.', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-3bd972-9-1', '3bd972', 22, '9', '(b) The given figure represents a kite with a circular and a semicircular motifs stuck on it. The radius of circle is 2.5 cm and the semicircle is 2 cm. If diagonals AC and BD are of lengths 12 cm and 8 cm respectively, find the area of the: [4]

(i) shaded part. Give your answer correct to the nearest whole number.

(ii) unshaded part.', 4, 'Mensuration', 'long', 6, '3bd972__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-3bd972-9-2', '3bd972', 23, '9', '(c) A model of a ship is made to a scale 1 : 300 [3]

- (i) The length of the model of the ship is 2 m. Calculate the length of the ship.
- (ii) The area of the deck ship is 180, 000 m². Calculate the area of the deck of the model.
- (iii) The volume of the model is 6.5 m³. Calculate the volume of the ship.', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-3bd972-10-0', '3bd972', 24, '10', '(a) Mohan has a recurring deposit account in a bank for 2 years at 6 % p.a. simple interest. If he gets ₹ 1200 as interest at the time of maturity, find: [3]

- (i) the monthly instalment
- (ii) the amount of maturity.', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-3bd972-10-2', '3bd972', 25, '10', '(c) A bus covers a distance of 240 km at a uniform speed. Due to heavy rain its speed gets reduced by 10 km/h and as such it takes two hrs longer to cover the total distance. Assuming the uniform speed to be ''x'' km/h, form an equation and solve it to evaluate ''x''. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-3bd972-11-0', '3bd972', 26, '11', '(a) Prove that $\frac{\cos A}{1+\sin A} + \tan A = \sec A$. [3]', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-3bd972-11-1', '3bd972', 27, '11', '(b) Use ruler and compasses only for the following question. All construction lines and arcs must be clearly shown. [4]
(i) Construct a $\triangle ABC$ in which $BC=6.5\text{ cm}$, $\angle ABC=60^\circ$, $AB=5\text{ cm}$.
(ii) Construct the locus of points at a distance of $3.5\text{ cm}$ from A.
(iii) Construct the locus of points equidistant from AC and BC.
(iv) Mark 2 points X and Y which are at a distance of $3.5\text{ cm}$ from A and also equidistant from AC and BC. Measure XY.', 4, 'Constructions', 'long', 8, NULL, NULL),
  ('MQ-3bd972-11-2', '3bd972', 28, '11', '(c) Ashok invested ₹ 26,400 on 12%, ₹25 shares of a company. If he receives a dividend of ₹2,475, find the: [3]
(i) number of shares he bought
(ii) Market value of each share', 3, 'Shares and Dividends', 'short', 8, NULL, NULL),
  ('MQ-4e563d-1-0', '4e563d', 0, '1', 'Q1. a) On a certain sum and at a certain rate of interest, the simple interest for the first year is Rs. 270 and the compound interest for the first two years is Rs. 580.50. Find the sum and the rate of interest. [3]', 3, NULL, 'short', 1, NULL, NULL),
  ('MQ-4e563d-1-1', '4e563d', 1, '1', 'b) Anish got a rebate of \(8\%\) on a refrigerator and after rebate he had to pay \(12\%\) as sales tax on it. If he paid Rs. 23,184 for it. What is the list price of the refrigerator. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-4e563d-1-2', '4e563d', 2, '1', 'c) Solve the inequation and graph the solution set on the number line

$$2x - 1 \geq x + \frac{7 - x}{3} > 2, x \in \mathbb{R} \tag{3}$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-4e563d-2-0', '4e563d', 3, '2', 'Q2. a) Find the equation of a line which has y intercept 4 and is parallel to the line \( 2x - 3y - 7 = 0 \). Also find the coordinates of the point, where the line cuts x-axis.', NULL, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-4e563d-2-1', '4e563d', 4, '2', 'b) Find the value of \( x \) given that \( B^2 = A \) where. [3]

$$B = \begin{bmatrix} 2 & 12 \\ 0 & 1 \end{bmatrix} \quad \text{and} \quad A = \begin{bmatrix} 4 & x \\ 0 & 1 \end{bmatrix}$$', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-4e563d-2-2', '4e563d', 5, '2', 'c) If Q is an acute angle, solve $$\frac{\cos^2\theta - 3\cos\theta + 2}{\sin^2\theta} = 1$$ [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-4e563d-3-0', '4e563d', 6, '3', 'Q3. a) In the figure, AB is a diameter of the circle with centre O and CD // BA. If $$\angle CAB = 24^\circ$$ find the value of

(i) $$\angle COB$$ ii) $$\angle DOC$$ iii) $$\angle DAC$$ iv) $$\angle ADC$$', NULL, 'Circles', 'short', 1, '4e563d__ICSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-4e563d-3-1', '4e563d', 7, '3', 'b) Kavita opened a recurring deposit account in a bank for 2 years and 6 months. If the rate of interest is \(8\%\) p.a. Find how much did she deposit each month so that she receives Rs. 8275 at the maturity time. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-4e563d-3-2', '4e563d', 8, '3', 'c) When \(4x^{3} - 3x^{2} + 7x + k\) is divided by \(x + 2\), the remainder is \(-40\). Find \(k\).', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-4e563d-4-0', '4e563d', 9, '4', 'Q4. a) Using a graph paper, plot the points A (6,4) and B (0,4) [4]

i) Reflect A and B in the origin to get the images A'' and B''
ii) Write the co-ordinates of A'' and B''
iii) State the geometrical name for the figure ABA''B''.
iv) Find its area and perimeter.', 4, 'Coordinate Geometry', 'long', 1, NULL, NULL),
  ('MQ-4e563d-4-1', '4e563d', 10, '4', 'b) Find the value of m so that the equation $(4+m)x^2 + (m+1)x + 1 = 0$ [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-4e563d-4-2', '4e563d', 11, '4', 'c) In the figure given below, chords AB and CD of a circle meet externally at P. given that BP = 4cm, CD = 15 cm and DP = 5 cm.

i) Prove that \(\Delta CAP\) and \(\Delta BDP\) are similar.
ii) Find AB
iii) Find \(\frac{\text{area of quadulation CABD}}{\text{area of } \Delta \text{CAP}}\)', NULL, 'Similarity', 'short', 2, '4e563d__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-4e563d-5-0', '4e563d', 12, '5', 'Q5. a) The daily wages of 160 workers in a building project are given.

| Wages in Rs. | 120-130 | 130-140 | 140-150 | 150-160 | 160-170 | 170-180 | 180-190 | 190-200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Using graph paper, draw an ogive for the above distribution. Use your ogive to estimate (i) the median wage of workers (ii) the % of workers who earn more than Rs. 55 a day.', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-4e563d-5-1', '4e563d', 13, '5', 'b) In the figure AB and CD are the lines $2x-y+6=0$ and $x-2y = 4$ respectively

i) Write down the coordinates of A, B, C and D.
ii) Prove that triangle OAB and ODC are similar.
iii) Is figure ABCD cyclic? Give reasons for your ans', NULL, 'Coordinate Geometry', 'short', 2, '4e563d__ICSE_X_Mat_p2_img_1_jpeg.webp', NULL),
  ('MQ-4e563d-6-0', '4e563d', 14, '6', 'Q6. a) Mr. Sengupta invested Rs. 8000 in 8% (Rs. 100) shares, selling at Rs. 80. After a year he sold these shares at Rs. 75 each and invested the proceeds in Rs. 100 shares selling at Rs. 150 with a dividend of 12% (i) His income from the 1st investment. (ii) His income from the second investment (iii) The decreased percentage return on his original investment.', NULL, 'Shares and Dividends', 'short', 2, NULL, NULL),
  ('MQ-4e563d-6-1', '4e563d', 15, '6', 'b) From the top of a cliff. 75m high, the angle of depression of the top and the bottom of a tower are observed to be $30^{\circ}$ and $60^{\circ}$ respectively. Find the height of tower.', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-4e563d-7-0', '4e563d', 16, '7', 'Q7. Mrs. Rao opened a saving Bank account in State Bank of India on 9th Jan. 2008. Her pass book enteries for the year 2008 are as follows.

Mrs. Rao closes the account on 31st December 2008. If the bank pays interest at 4% p.a. find the interest Mrs. Rao receives on closing the account. Give your answer correct to the nearest rupee.

7. Mrs Rao opened a saving Bank account in state bank of India on 9th Jan. 2008. Her passbook enteries for the year 2008 are as follows.

Mrs. Rao closes the account on 31st December 2008. If the bank pays interest at 4% p.a. Find the interest Mrs. Rao receives on closing the account give your answer correct to the nearest rupee.

| Date | Particulars | Withdrawals | Deposits | Balance. |
| --- | --- | --- | --- | --- |
| Jan. 9 | By cash | | 10000 | 10000 |
| Feb. 12 | By cash | | 15,500 | 25,500 |
| April 6 | To cheque | 3500 | | |
| April 30 | To self | 2000 | | |
| July 16 | By cheque | | 6500 | |
| Aug. 4 | To self | 5500 | | |
| Aug. 20 | To cheque | 1200 | | |
| Dec. 12 | By cash | | 1700 | |', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-4e563d-7-1', '4e563d', 17, '7', '7.b. Construct a \(\Delta ABC\) in which \(AB = AC = 5\) cm and \(BC = 6.5\) cm. Using a rules and a compass only draw the reflection A'' BC of \(\Delta ABC\) in BC. Draw lines of symmetry of the figure AB A''C.', NULL, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-4e563d-8-0', '4e563d', 18, '8', '8.a. A shopkeeper buys an article at a discount of \(30\%\) and pays sales tax at the rate of \(6\%\). The shopkeeper sells the article to a consumer at \(10\%\) discount on the list price and charges sales tax at the same rate. If the list price of the article is 3000 find.

(i) the price inclusive of sales tax paid by the shopkeeper.
(ii) the price paid by the consumer. [4]
(iii) the vat paid by the shopkeeper.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-4e563d-8-1', '4e563d', 19, '8', '8.b. The remainder obtained by dividing \( Kx^{2} - 3x + 6 \) by (x-2) is twice the remainder obtained by dividing \( 3x^{2} + 5x - k \) by (x+3). Find the value of k. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-4e563d-8-2', '4e563d', 20, '8', '(c) Sole the equation \( x - \frac{18}{x} = 6 \). Give your answer correct to two significant figures.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-4e563d-9-0', '4e563d', 21, '9', '9a. In the given figure. ABC is a triangle with \(\angle EDB = \angle ACB\)

If BE = 6 cm EC = 4 cm BD = 5 cm and

Area of $\Delta BED = 9\mathrm{cm}^2$ Calculate

(i) the length of AB (ii) Area of $\Delta ABC$

[4]', 4, 'Similarity', 'long', 3, '4e563d__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-4e563d-9-1', '4e563d', 22, '9', 'b. Prove \((1 + \cot \theta -\mathrm{cosec}\theta)\) \((1 + \tan \theta +\sec \theta) = 2\)', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4e563d-9-2', '4e563d', 23, '9', 'c. A certain sum of money is invested at the rate of \(5\%\) p.a. Compound Interest. Compounded annually. If the difference between the interests of third year and first year is Rs. 102.50. Find the sum. [5]', 5, NULL, 'long', 4, NULL, NULL),
  ('MQ-4e563d-10-0', '4e563d', 24, '10', '10.a. The sum of the areas of two squares is $640\mathrm{m}^2$. If the difference in their perimeters is 64m. Find the sides of the two squares. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-4e563d-10-1', '4e563d', 25, '10', 'b. If $P = \begin{bmatrix} 2 & 6 \\ 3 & 9 \end{bmatrix}$ $Q = \begin{bmatrix} 3 & x \\ y & 2 \end{bmatrix}$

find x and y such that PQ = 0.', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-4e563d-10-2', '4e563d', 26, '10', 'c. $A = \{ x : 11x - 5 > 7x + 3, x \in R \}$

$$B = \{ x : 18x - 9 \geq 15 + 12x, x \in R \}$$

Find the range of set A∩B and represent it on a number line.', NULL, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-4e563d-11-0', '4e563d', 27, '11', '11a. In the adjoining figure AE and BC intersect each other at point D.

If $\angle CDE = 90^{\circ} AB = 5$ cm BD = 4 cm and CD = 9 cm find DE [3]', 3, 'Similarity', 'short', 4, '4e563d__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-4e563d-11-1', '4e563d', 28, '11', 'b. Marks obtained by 40 students in a short assessment is given below, where a and b are two missing data

| Marks | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- |
| no. of students | 6 | a | 16 | 13 | b |

If the mean of the distribution is 7.2. Find a & b. [3]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-4e563d-11-2', '4e563d', 29, '11', 'c. Without using trigonometrical tables, evaluate $\sin^2 34^{\circ} + \sin^2 56^{\circ} + 2 \tan 18^{\circ} \cdot \tan 72^{\circ} - \cot^2 30^{\circ}$. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-82f87f-1-0', '82f87f', 0, '1', '(a) If $b$ is the mean proportion between $a$ and $c$, show that: [3]

$$\frac{a^4 + a^2b^2 + b^4}{b^4 + b^2c^2 + c^4} = \frac{a^2}{c^2}$$', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-82f87f-1-1', '82f87f', 1, '1', '(b) Solve the equation $4x^2 - 5x - 3 = 0$ and give your answer correct to two decimal places. [4]', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-82f87f-1-2', '82f87f', 2, '1', '(c) AB and CD are two parallel chords of a circle such that AB = 24 cm and CD = 10 cm. If the radius of the circle is 13 cm, find the distance between the two chords.', 3, 'Circles', 'short', 2, '82f87f__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-82f87f-2-0', '82f87f', 3, '2', '(a) Evaluate without using trigonometric tables, [3]

$$\sin^2 28^\circ + \sin^2 62^\circ + \tan^2 38^\circ - \cot^2 52^\circ + \frac{1}{4} \sec^2 30^\circ$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-82f87f-2-1', '82f87f', 4, '2', '(b) If A = $$\begin{bmatrix} 1 & 3 \\ 3 & 4 \end{bmatrix}$$ and B = $$\begin{bmatrix} -2 & 1 \\ -3 & 2 \end{bmatrix}$$ and A² - 5B² = 5C. Find matrix C where C is a 2 by 2 matrix. [4]', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-82f87f-2-2', '82f87f', 5, '2', '(c) Jaya borrowed ₹ 50,000 for 2 years. The rates of interest for two successive years are 12% and 15% respectively. She repays ₹33,000 at the end of the first year. Find the amount she must pay at the end of the second year to clear her debt. [3]', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-82f87f-3-0', '82f87f', 6, '3', '(a) The catalogue price of a computer set is ₹ 42000. The shopkeeper gives a discount of 10% on the listed price. He further gives an off-season discount of 5% on the discounted price. However, sales tax at 8% is charged on the remaining price after the two successive discounts. Find: [3]

- (i) the amount of sales tax a customer has to pay
- (ii) the total price to be paid by the customer for the computer set.', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-82f87f-3-1', '82f87f', 7, '3', '(b) P(1, -2) is a point on the line segment A(3, -6) and B(x, y) such that AP : PB is equal to 2 : 3. Find the coordinates of B. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-82f87f-3-2', '82f87f', 8, '3', '(c) The marks of 10 students of a class in an examination arranged in ascending order is as follows: [3]

13, 35, 43, 46, x, x+4, 55, 61, 71, 80

If the median marks is 48, find the value of x. Hence find the mode of the given data.', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-82f87f-4-0', '82f87f', 9, '4', '(a) What must be subtracted from $16x^3 - 8x^2 + 4x + 7$ so that the resulting expression has $2x + 1$ as a factor? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-82f87f-4-1', '82f87f', 10, '4', '(b) In the given figure ABCD is a rectangle. It consists of a circle and two semi circles each of which are of radius 5 cm. Find the area of the shaded region. Give your answer correct to three significant figures. [4]', 4, 'Mensuration', 'long', 3, '82f87f__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-82f87f-4-2', '82f87f', 11, '4', '(c) Solve the following inequation and represent the solution set on a number line. [3]

$$-8\frac{1}{2} < -\frac{1}{2} - 4x \leq 7\frac{1}{2}, x \in I$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-82f87f-5-0', '82f87f', 12, '5', '(a) Given matrix $B = \begin{bmatrix} 1 & 1 \\ 8 & 3 \end{bmatrix}$. Find the matrix X if, $X = B^2 - 4B$. [4]

Hence solve for $a$ and $b$ given $X\begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} 5 \\ 50 \end{bmatrix}$', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-82f87f-5-1', '82f87f', 13, '5', '(b) How much should a man invest in ₹ 50 shares selling at ₹60 to obtain an income of ₹ 450, if the rate of dividend declared is 10%. Also find his yield percent, to the nearest whole number. [3]', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-82f87f-5-2', '82f87f', 14, '5', '(c) Sixteen cards are labelled as $a, b, c \dots \dots m, n, o, p$. They are put in a box and shuffled. A boy is asked to draw a card from the box. What is the probability that the card drawn is: [3]

(i) a vowel.
(ii) a consonant.
(iii) none of the letters of the word median.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-82f87f-6-0', '82f87f', 15, '6', '(a) Using a ruler and a compass construct a triangle ABC in which AB = 7cm, [4] ∠CAB=60° and AC = 5cm. Construct the locus of:

(i) points equidistance from AB and AC.
(ii) points equidistant from BA and BC.

Hence construct a circle touching the three sides of the triangle internally.', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-82f87f-6-1', '82f87f', 16, '6', '(b) A conical tent is to accommodate 77 persons. Each person must have 16m³ of air to breathe. Given the radius of the tent as 7m find the height of the tent and also its curved surface area. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-82f87f-6-2', '82f87f', 17, '6', '(c) If 7m + 2n / (7m - 2n) = 5/3, use properties of proportion to find [3]

(i) m : n

(ii) (m² + n²) / (m² - n²)', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-82f87f-7-0', '82f87f', 18, '7', '(a) A page from a saving bank account passbook is given below: [5]

| Date | Particulars | Amount Withdrawn (₹) | Amount Deposited (₹) | Balance (₹) |
| --- | --- | --- | --- | --- |
| Jan. 7, 2016 | B/F | | | 3000.00 |
| Jan 10, 2016 | By Cheque | | 2600.00 | 5600.00 |
| Feb. 8, 2016 | To Self | 1500.00 | | 4100.00 |
| Apr. 6, 2016 | By Cheque | 2100.00 | | 2000.00 |
| May 4, 2016 | By cash | | 6500.00 | 8500.00 |
| May 27, 2016 | By Cheque | | 1500.00 | 10000.00 |

(i) Calculate the interest for the 6 months from January to June 2016, at 6% per annum.
(ii) If the account is closed on 1st July 2016, find the amount received by the account holder.', 5, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-82f87f-7-1', '82f87f', 19, '7', '(b) Use a graph paper for this question (Take 2 cms = 1 unit on both x and y axis) [5]

(i) Plot the following points:

A(0,4), B(2,3), C(1,1) and D(2,0).

(ii) Reflect points B, C, D on the y-axis and write down their coordinates. Name the images as B'', C'', D'' respectively.

(iii) Join the points A, B, C, D, D'', C'', B'' and A in order, so as to form a closed figure. Write down the equation of the line of symmetry of the figure formed.', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-82f87f-8-0', '82f87f', 20, '8', '(a) Calculate the mean of the following distribution using step deviation method. [4]

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of Students | 10 | 9 | 25 | 30 | 16 | 10 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-82f87f-8-1', '82f87f', 21, '8', '(b) In the given figure PQ is a tangent to the circle at A. AB and AD are bisectors of [3]

∠CAQ and ∠PAC. IF ∠BAQ = 30°, prove that:

(i) BD is a diameter of the circle.
(ii) ABC is an isosceles triangle.', 3, 'Circles', 'short', 5, '82f87f__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-82f87f-8-2', '82f87f', 22, '8', '(c) The printed price of an air conditioner is ₹ 45,000/-. The wholesaler allows a [3]

discount of 10% to the shopkeeper. The shopkeeper sells the article to the customer at a discount of 5% of the marked price. Sales tax (under VAT) is charged at the rate of 12% at every stage. Find:

(i) VAT paid by the shopkeeper to the government.
(ii) The total amount paid by the customer inclusive of tax.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-82f87f-9-0', '82f87f', 23, '9', '(a) In the figure given, O is the centre of the circle. ∠DAE = 70°. Find giving suitable [4]

reasons, the measure of:

(i) ∠BCD
(ii) ∠BOD
(iii) ∠OBD', 4, 'Circles', 'long', 6, '82f87f__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-82f87f-9-2', '82f87f', 24, '9', '(c) Prove that [3]

$$\frac{\sin \theta - 2 \sin^3 \theta}{2 \cos^3 \theta - \cos \theta} = \tan \theta$$', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-82f87f-10-0', '82f87f', 25, '10', '(a) The sum of the ages of Vivek and his younger brother Amit is 47 years. The product of their ages in years is 550. Find their ages. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-82f87f-10-1', '82f87f', 26, '10', '(b) The daily wages of 80 workers in a project are given below. [6]

| Wages (in ₹) | 400-450 | 450-500 | 500-550 | 550-600 | 600-650 | 650-700 | 700-750 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 2 | 6 | 12 | 18 | 24 | 13 | 5 |

Use a graph paper to draw an ogive for the above distribution. (Use a scale of 2 cm = ₹ 50 on x-axis and 2 cm = 10 workers on y-axis). Use your ogive to estimate:

(i) the median wage of the workers.
(ii) the lower quartile wage of workers.
(iii) the number of workers who earn more than ₹ 625 daily.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-82f87f-11-0', '82f87f', 27, '11', '(a) The angles of depression of two ships A and B as observed from the top of a light house 60 m high are 60° and 45° respectively. If the two ships are on the opposite sides of the light house, find the distance between the two ships. Give your answer correct to the nearest whole number. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-82f87f-11-1', '82f87f', 28, '11', '(b) PQR is a triangle. S is a point on the side QR of ΔPQR such that ∠PSR = ∠QPR. Given QP = 8 cm, PR = 6 cm and SR = 3 cm [3]

(i) Prove ΔPQR ~ ΔSPR
(ii) Find the length of QR and PS
(iii) $$\frac{area\ of\ \Delta PQR}{area\ of\ \Delta SPR}$$', 3, 'Similarity', 'short', 7, '82f87f__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-82f87f-11-2', '82f87f', 29, '11', '(c) Mr. Richard has a recurring deposit account in a bank for 3 years at 7.5% p. a. simple interest. If he gets ₹ 8325 as interest at the time of maturity, find: [3]

(i) The monthly deposit
(ii) The maturity value.', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-026b8b-1-0', '026b8b', 0, '1', '1. (a) Find the value of $x$ and $y$ if: [3]

$$
2 \left[ \begin{array}{c c} x & 7 \\ 9 & y - 5 \end{array} \right] + \left[ \begin{array}{c c} 6 & - 7 \\ 4 & 5 \end{array} \right] = \left[ \begin{array}{c c} 1 0 & 7 \\ 2 2 & 1 5 \end{array} \right]
$$', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-026b8b-1-1', '026b8b', 1, '1', '(b) Sonia had a recurring deposit account in a bank and deposited ₹ 600 per month for \(2\frac{1}{2}\) years. If the rate of interest was \(10\%\) p.a., find the maturity value of this account. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-026b8b-1-2', '026b8b', 2, '1', '(c) Cards bearing numbers 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20 are kept in a bag. A card is drawn at random from the bag. Find the probability of getting a card which is : [4]

(i) a prime number.
(ii) a number divisible by 4.
(iii) a number that is a multiple of 6.
(iv) an odd number.', 4, 'Probability', 'long', 1, NULL, NULL),
  ('MQ-026b8b-2-0', '026b8b', 3, '2', '2. (a) The circumference of the base of a cylindrical vessel is 132 cm and its height is 25 cm. Find the [3]

(i) radius of the cylinder

(ii) volume of cylinder. (use $$\pi = \frac{22}{7}$$)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-026b8b-2-1', '026b8b', 4, '2', '(b) If $$(k - 3)$$, $$(2k + 1)$$ and $$(4k + 3)$$ are three consecutive terms of an A.P., find the value of k. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-026b8b-2-2', '026b8b', 5, '2', '(c) PQRS is a cyclic quadrilateral. Given $$\angle QPS = 73^{\circ}$$, $$\angle PQS = 55^{\circ}$$ and $$\angle PSR = 82^{\circ}$$, calculate : [4]

(i) $$\angle QRS$$

(ii) $$\angle RQS$$

(iii) $$\angle PRQ$$', 4, 'Circles', 'long', 2, '026b8b__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-3-0', '026b8b', 6, '3', '3. (a) If $$(x + 2)$$ and $$(x + 3)$$ are factors of $$x^3 + ax + b$$, find the values of ''a'' and ''b''. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-026b8b-3-1', '026b8b', 7, '3', '(b) Prove that $$\sqrt{\sec^2 \theta + \cosec^2 \theta} = \tan \theta + \cot \theta$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-026b8b-4-0', '026b8b', 8, '4', '4. (a) Solve the following inequation, write down the solution set and represent it on the real number line: [3]

$$
- 2 + 1 0 x \leq 1 3 x + 1 0 < 2 4 + 1 0 x, x \in Z
$$', 3, 'Linear Inequations', 'short', 3, '026b8b__ICSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-026b8b-4-1', '026b8b', 9, '4', '(b) If the straight lines \( 3x - 5y = 7 \) and \( 4x + ay + 9 = 0 \) are perpendicular to one another, find value of \( a \). [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-026b8b-5-0', '026b8b', 10, '5', '5. (a) The $4^{\text{th}}$ term of a G.P. is 16 and the $7^{\text{th}}$ term is 128. Find the first term and common ratio of the series. [3]', 3, 'Geometric Progression', 'short', 4, NULL, NULL),
  ('MQ-026b8b-5-1', '026b8b', 11, '5', '(b) A man invests ₹ 22,500 in ₹ 50 shares available at $10\%$ discount. If the dividend paid by the company is $12\%$ , calculate : [3]

(i) The number of shares purchased.
(ii) The annual dividend received.
(iii) The rate of return he gets on his investment. Give your answer correct to the nearest whole number.', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-026b8b-5-2', '026b8b', 12, '5', '(c) Use graph paper for this question (Take $2\mathrm{cm} = 1$ unit along both $x$ and $y$ axis). [4]

ABCD is a quadrilateral whose vertices are $A(2, 2)$ , $B(2, -2)$ , $C(0 - 1)$ and $D(0, 1)$

(i) Reflect quadrilateral \(ABCD\) on the \(y\)-axis and name it as \(A''B''CD\).
(ii) Write down the coordinates of \(A''\) and \(B''\).
(iii) Name two points which are invariant under the above reflection.
(iv) Name the polygon \(A''B''CD\).', 4, 'Coordinate Geometry', 'long', 4, '026b8b__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-6-0', '026b8b', 13, '6', '6. (a) Using properties of proportion, solve for $x$ . Given that $x$ is positive : [3]

$$
\frac {2 x + \sqrt {4 x ^ {2} - 1}}{2 x - \sqrt {4 x ^ {2} - 1}} = 4
$$', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-026b8b-6-1', '026b8b', 14, '6', '(b) If $A = \begin{bmatrix} 2 & 3 \\ 5 & 7 \end{bmatrix}$ , $B = \begin{bmatrix} 0 & 4 \\ -1 & 7 \end{bmatrix}$ , and $C = \begin{bmatrix} 1 & 0 \\ -1 & 4 \end{bmatrix}$ ,

$$
\text {f i n d} A C + B ^ {2} - 1 0 C. \tag {3}
$$', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-026b8b-6-2', '026b8b', 15, '6', '(c) Prove that $(1 + \cot \theta -\operatorname {c o s e c}\theta)(1 + \tan \theta +$ sec0) $= 2$ [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-026b8b-7-0', '026b8b', 16, '7', '7. (a) Find the value of $k$ for which the following equation has equal roots. [3]

$$
x^2 + 4kx + (k^2 - k + 2) = 0
$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-026b8b-7-1', '026b8b', 17, '7', '(b) One map drawn to a scale of $1:50,000$, a rectangular plot of land $ABCD$ has the following dimensions. $AB = 6\,\text{cm}$; $BC = 8\,\text{cm}$ and all angles are right angles. Find: [3]

(i) the actual length of the diagonal distance $AC$ of the plot in km.

(ii) the actual area of the plot in sq km.', 3, 'Mensuration', 'short', 5, '026b8b__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-7-2', '026b8b', 18, '7', '(c) $A(2, 5)$, $B(-1, 2)$ and $C(5, 8)$ are the vertices of a triangle $ABC$, ''$M$'' is a point on $AB$ such that $AM:MB = 1:2$. Find the co-ordinates of ''$M$''. Hence find the equation of the line passing through the points $C$ and $M$. [4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-026b8b-8-0', '026b8b', 19, '8', '8. (a) ₹ 7500 were divided equally among a certain number of children. Had there been 20 less children, each would have received ₹ 100 more. Find the original number of children. [3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-026b8b-8-2', '026b8b', 20, '8', '(c) Using ruler and compass only, construct a $\Delta ABC$ such that $BC = 5$ cm and $AB = 6.5$ cm and $\angle ABC = 120^\circ$. [4]

(i) Construct a circum-circle of \(\Delta ABC\)
(ii) Construct a cyclic quadrilateral \(ABCD\), such that \(D\) is equidistant from \(AB\) and \(BC\).', 4, 'Constructions', 'long', 6, '026b8b__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-9-0', '026b8b', 21, '9', '9. (a) Priyanka has a recurring deposit account of ₹ 1,000 per month at 10% per annum. If she gets ₹ 5,550 as interest at the time of maturity, find the total time for which the account was held. [3]', NULL, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-026b8b-9-1', '026b8b', 22, '9', '(b) In $\Delta PQR$, $MN$ is parallel to $QR$ and

$$
\frac{PM}{MQ} = \frac{2}{3}
$$

(i) Find $\frac{MN}{QR}$.

(ii) Prove that \(\Delta OMN\) and \(\Delta ORQ\) are similar.
(iii) Find, area of \(\Delta OMN\) : Area of \(\Delta ORQ\).', NULL, 'Similarity', 'short', 7, '026b8b__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-9-2', '026b8b', 23, '9', '(c) The following figure represents a solid consisting of a right circular cylinder with a hemisphere at one end and a cone at the other. Their common radius is 7 cm. The height of the cylinder and cone are each of 4 cm. Find volume of the solid.', NULL, 'Mensuration', 'short', 7, '026b8b__ICSE_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-026b8b-10-0', '026b8b', 24, '10', '10. (a) Use Remainder theorem to factorize the following polynomial : [3]

$$
2x^3 + 3x^2 - 9x - 10
$$', 3, 'Factorisation and Remainder Theorem', 'short', 7, NULL, NULL),
  ('MQ-026b8b-10-1', '026b8b', 25, '10', '(b) In the figure given below ''O'' is the centre of the circle. If $QR = OP$ and $\angle ORP = 20^\circ$. Find the value of ''x'' giving reasons. [3]', 3, 'Circles', 'short', 7, '026b8b__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-026b8b-10-2', '026b8b', 26, '10', '(c) The angle of elevation from a point $P$ of the top of a tower $QR$, $50\mathrm{m}$ high is $60^{\circ}$ and that of the tower $PT$ from a point $Q$ is $30^{\circ}$. Find the height of the tower $PT$, correct to the nearest metre. [4]', 4, 'Trigonometry', 'long', 8, '026b8b__ICSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-026b8b-11-0', '026b8b', 27, '11', '11. (a) The $4^{\text{th}}$ term of an A.P. is 22 and $15^{\text{th}}$ term is 66. Find the first term and the common difference. Hence find the sum of the series to 8 terms. [4]', 4, 'Arithmetic Progression', 'long', 9, NULL, NULL),
  ('MQ-026b8b-11-1', '026b8b', 28, '11', '(b) Use Graph paper for this question. [6] A survey regarding height (in cm) of 60 boys belonging to Class 10 of a school was conducted. The following data was recorded:

| Height in cm | 135-140 | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Taking $2\mathrm{cm} =$ height of $10\mathrm{cm}$ along one axis and $2\mathrm{cm} = 10$ boys along the other axis draw an ogive of the above distribution. Use the graph to estimate the following:

(i) the median
(ii) lower quartile
(iii) if above \(158~\mathrm{cm}\) is considered as the tall boys of the class. Find the number of boys in the class who are tall.', 6, 'Statistics', 'long', 9, '026b8b__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-f95af9-1-0', 'f95af9', 0, '1', '1. (a) Mohan has recurring deposit account in a bank the deposits Rs. 2500 per month for 2 years. If he gets Rs. 66250 at the time of maturity. [4]

Find : (i) the interest paid by the bank.

(ii) the rate of interest.', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-f95af9-1-1', 'f95af9', 1, '1', '(b) If $$\begin{bmatrix} 0 & 4 \\ -3 & 0 \end{bmatrix}$$ $$\begin{bmatrix} x & -5 \\ y & 0 \end{bmatrix} = \begin{bmatrix} 5 & z \\ 7 & 9 \end{bmatrix} + \begin{bmatrix} 3 & 4 \\ 2 & 6 \end{bmatrix}$$ find the value of x, y and z. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-f95af9-1-2', 'f95af9', 2, '1', '(c) What number should be added to $$2x^3 - 3x^2 - 8x$$ so that the resulting polynomial leaves the remainder 10 when divided by $$2x+1$$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-f95af9-2-0', 'f95af9', 3, '2', '2. (a) The weekly wages of 40 workers in a small factory given below. If the mean weekly wages is Rs. 145 find the values of a and b. [4]

| Daily Wages | 80–100 | 100–120 | 120–140 | 140–160 | 160–180 |
| --- | --- | --- | --- | --- | --- |
| No. of Workers | 4 | 6 | a | b | 18 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-f95af9-2-1', 'f95af9', 4, '2', '(b) Find the value of ''m'' for which the equation has real and equal roots. [3]

$$x^2 + 2 (m - 1) x + m + 5 = 0$$', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-f95af9-2-2', 'f95af9', 5, '2', '(c) When 2 dice are rolled what is the probability of gelling. [3]

(i) the same number on both
(ii) a product of 6
(iii) a sum of 8', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-f95af9-3-0', 'f95af9', 6, '3', '3. a) By increasing the speed of a car by 10 km/hw the time of journey for a distance of 72 km is reduced by 36 minutes. Find the original speed of the car.', NULL, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-f95af9-3-1', 'f95af9', 7, '3', 'b) Solve the mequation and represent the solution set on the number line. [3]

$$- 3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x, x \in I$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-f95af9-3-2', 'f95af9', 8, '3', 'c) Solve : $$\frac{\sin 31^\circ \cos 59^\circ + \cos 31^\circ \sin 59^\circ}{\sec^2 10^\circ - \cot^2 80^\circ}$$ [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-f95af9-4-0', 'f95af9', 9, '4', '4. (a) Use graph paper, Plot A (2,3) B = (6,3) [6]
i) Reflect A in the origin to get the image D
ii) Reflect A in x axis to gather image C
iii) Write down the co-ordination of C & D.
iv) What kind of figure is ABCD ? Find its Area.
v) What is the reflection of C in Yaxis ?
vi) Name two invariant points on reflection in Y axis.', 6, 'Coordinate Geometry', 'long', 1, NULL, NULL),
  ('MQ-f95af9-4-1', 'f95af9', 10, '4', '(b) Using a ruler and pair of compasses only construct.

(i) a triangle ABC given AB = 4 cm BC = 6 cm and LABC = 90°
(ii) a circle which passes through the points A, B and C and mark its centre as O. Measure the length of the radius.', NULL, 'Constructions', 'short', 2, NULL, NULL),
  ('MQ-f95af9-5-0', 'f95af9', 11, '5', '5. (a) The following distribution represents the height of 160 students of a school. [6]

| Height (cm) | 140–145 | 145–150 | 150–155 | 155–160 | 160–165 | 165–170 | 170–175 | 175–180 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Draw an ogive for the given distribution taking 2cm = 5 cm of height on one axis and 2 cm = 20 students on the other axis. Using the graph determine.

(i) the median range
(ii) the inter quartile range.
(iii) the number of students whose height is above 172 cm.', 6, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-f95af9-5-1', 'f95af9', 12, '5', '(b) Prove that $$\frac{\sin A - 2 \sin^3 A}{2 \cos^3 A - \cos A} = \tan A$$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f95af9-6-0', 'f95af9', 13, '6', '6. (a) Solve the equation and give your answer correct 3 significant figure. [4]

$$5x^2 - 3x - 4 = 0$$', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-f95af9-6-1', 'f95af9', 14, '6', '(b) $$A = \begin{bmatrix} -4 & 6 \\ 3 & -5 \end{bmatrix}$$ $$B = [-4 \quad 2]$$ and PA = B find [3]

(i) the order of matrix P
(ii) the matrix P', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-f95af9-6-2', 'f95af9', 15, '6', '(c) $$4 \cos^2\theta - 3 = 0$$ Show that $$4 \cos3\theta - 3 \cos\theta = \cos3\theta$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f95af9-7-0', 'f95af9', 16, '7', '7. From the top of two coconut trees, two men started dropping coconuts at the point P on the ground between the two trees. If the trees are 15 cm and 10 cm high, the angle of depression of point P from the top of the trees are 60° and 45° respectively. Find the distance between the trees. [5]', 5, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-f95af9-7-1', 'f95af9', 17, '7', '(b) The mean of 8, 13, 6, 4 x, 7, 9, 16, 12 is (x+3). Find the value of x and mean. [3]', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f95af9-7-2', 'f95af9', 18, '7', '(c) The number 6, 8, 10, 12, 13 and x are arranged in an ascending order. If the mean of the observations in equal to the median. Find the value of x. [2]', 2, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f95af9-8-0', 'f95af9', 19, '8', '8. Find the mode of the following distribution by drawing a histogram. [4]

| Height | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of plants | 4 | 3 | 8 | 11 | 6 | 2 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-f95af9-8-1', 'f95af9', 20, '8', 'b) There are 60 balls in a box. Some are white and others black. Probability of getting a white ball is 3/2 of getting a black ball. How many of each coloured balls are these. [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-f95af9-8-2', 'f95af9', 21, '8', 'c) Solve the mequation and represent the solution set on the number line. [3]

$$4x - 19 < \frac{3x}{3} - 2 \leq -\frac{2}{5} + x, x \in R$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-f95af9-9-0', 'f95af9', 22, '9', '9. In the given figure tan B = 5/12 tan c = 3/4 and BC = 56 cm find AD [4]', 4, 'Trigonometry', 'long', 3, 'f95af9__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-f95af9-9-1', 'f95af9', 23, '9', 'b) Mrs. Mehta has a recurring deposit account in a bank for 4 years at 10% p.a. She gets Rs. 6370 as the interest on maturity.

Find (i) the monthly instalment. (ii) the maturity value.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-f95af9-9-2', 'f95af9', 24, '9', 'c) Solve the equation : $$3a^2x^2 + 8abx + 4b^2 = 0$$ [2]', 2, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f95af9-10-0', 'f95af9', 25, '10', '10. Show that (x-1) is a factor of x³ - 7x² + 14 x - 8 Hence, Completely factorise the above expression.[4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-f95af9-10-1', 'f95af9', 26, '10', 'b) Construct a triangle ABC with BC = 6.4 cm AC = 5.8 cm ∠B = 75°. Construct the inscribed circle of ΔABC. [4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-f95af9-10-2', 'f95af9', 27, '10', 'c) Solve 2x-3 = $$\sqrt{2x^2 - 2x + 21}$$ [2]', 2, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f95af9-11-0', 'f95af9', 28, '11', '11. Point (0, 4) and (0, -2) are unvarient on reflection in line L₁ and points (1, 0) and (-3,0) are invariant on reflection in line L₂.

(i) Name the lines L₁ and L₂.
(ii) Write the image of P (-3,4) in L₁ name the image as P'' and write its coordinates. Reflect P'' in L₂ and name it P'''' and Write its coordinates.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-f95af9-11-1', 'f95af9', 29, '11', 'b) A wire 112 cm long, is bent to form a right angled triangle. If the hypotenuse is 50 cm long, find the area of the triangle. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-f95af9-11-2', 'f95af9', 30, '11', 'c) Given that (x+2) and (x+3) are factors of 2x³ + ax² + 7x-b. Determine the values of a and b. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-617255-1-1', '617255', 0, '1', '(b) Sonia had a recurring deposit account in a bank and deposited ₹600 per month for 2½ [3]

years. If the rate of interest was 10% p.a., find the maturity value of this account.', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-617255-2-0', '617255', 1, '2', '(a) The circumference of the base of a cylindrical vessel is 132 cm and its height is 25 cm. Find the [3]

(i) radius of the cylinder
(ii) volume of cylinder. (use $$\pi = \frac{22}{7}$$)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-617255-2-2', '617255', 2, '2', '(c) PQRS is a cyclic quadrilateral. Given $$\angle QPS = 73^{\circ}$$, $$\angle PQS = 55^{\circ}$$ and $$\angle PSR = 82^{\circ}$$, [4]

calculate:

(i) $$\angle QRS$$
(ii) $$\angle RQS$$
(iii) $$\angle PRQ$$', 4, 'Circles', 'long', 2, '617255__ICSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-617255-4-0', '617255', 3, '4', '(a) Solve the following inequation, write down the solution set and represent it on the real number line: [3]

$$-2 + 10x \leq 13x + 10 < 24 + 10x, x \in Z$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-617255-5-0', '617255', 4, '5', '(a) The 4th term of a G.P. is 16 and the 7th term is 128. Find the first term and common ratio of the series. [3]', 3, 'Geometric Progression', 'short', 3, NULL, NULL),
  ('MQ-617255-5-2', '617255', 5, '5', '(c) Use graph paper for this question (Take 2cm = 1unit along both x and y axis). [4] ABCD is a quadrilateral whose vertices are A(2,2), B(2,-2), C(0,-1) and D(0,1).

(i) Reflect quadrilateral ABCD on the y-axis and name it as A''B''CD.
(ii) Write down the coordinates of A'' and B''.
(iii) Name two points which are invariant under the above reflection.
(iv) Name the polygon A''B''CD.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-617255-6-1', '617255', 6, '6', '(b) If $$A = \begin{bmatrix} 2 & 3 \\ 5 & 7 \end{bmatrix}, B = \begin{bmatrix} 0 & 4 \\ -1 & 7 \end{bmatrix}$$ and $$C = \begin{bmatrix} 1 & 0 \\ -1 & 4 \end{bmatrix}$$, find AC + B² - 10C. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-617255-7-1', '617255', 7, '7', '(b) On a map drawn to a scale of 1 : 50,000, a rectangular plot of land ABCD has the following dimensions. AB = 6cm; BC = 8cm and all angles are right angles. Find: [3]

(i) the actual length of the diagonal distance AC of the plot in km.
(ii) the actual area of the plot in sq km.', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-617255-8-2', '617255', 8, '8', '(c) Using ruler and compass only, construct a ΔABC such that BC = 5 cm and AB = 6.5 cm and ∠ABC = 120° [4]

(i) Construct a circum-circle of ΔABC
(ii) Construct a cyclic quadrilateral ABCD, such that D is equidistant from AB and BC.', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-617255-9-0', '617255', 9, '9', '(a) Priyanka has a recurring deposit account of ₹1000 per month at 10% per annum. If she gets ₹5550 as interest at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-617255-9-1', '617255', 10, '9', '(b) In ΔPQR, MN is parallel to QR and [3]

$$\frac{PM}{MQ} = \frac{2}{3}$$

(i) Find

$$\frac{MN}{QR}$$

(ii) Prove that ΔOMN and ΔORQ are similar.

(iii) Find, Area of ΔOMN : Area of ΔORQ', 3, 'Similarity', 'short', 5, '617255__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-617255-9-2', '617255', 11, '9', '(c) The following figure represents a solid consisting of a right circular cylinder with a hemisphere at one end and a cone at the other. Their common radius is 7 cm. The height of the cylinder and cone are each of 4 cm. Find the volume of the solid. [4]', 4, 'Mensuration', 'long', 6, '617255__ICSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-617255-10-0', '617255', 12, '10', '(a) Use Remainder theorem to factorize the following polynomial: [3]

$$2x^3 + 3x^2 - 9x - 10.$$', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-617255-10-1', '617255', 13, '10', '(b) In the figure given below ''O'' is the centre of the circle. If QR = OP and ∠ORP = 20°. Find the value of ''x'' giving reasons. [3]', 3, 'Circles', 'short', 6, '617255__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-617255-10-2', '617255', 14, '10', '(c) The angle of elevation from a point P of the top of a tower QR, 50m high is 60° and that of the tower PT from a point Q is 30°. Find the height of the tower PT, correct to the nearest metre.', NULL, 'Trigonometry', 'short', 7, '617255__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-617255-11-0', '617255', 15, '11', '(a) The 4th term of an A.P. is 22 and 15th term is 66. Find the first term and the common difference. Hence find the sum of the series to 8 terms.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-617255-11-1', '617255', 16, '11', '(b) Use Graph paper for this question.

A survey regarding height (in cm) of 60 boys belonging to Class 10 of a school was conducted. The following data was recorded:

| Height in cm | 135 – 140 | 140 – 145 | 145 – 150 | 150 – 155 | 155 – 160 | 160 – 165 | 165 – 170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Taking 2cm = height of 10 cm along one axis and 2 cm = 10 boys along the other axis draw an ogive of the above distribution. Use the graph to estimate the following:

(i) the median
(ii) lower Quartile
(iii) if above 158 cm is considered as the tall boys of the class. Find the number of boys in the class who are tall.', NULL, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-22c5bb-1-0', '22c5bb', 0, '1', '1. (a) Solve the following inequation and write down the solution set: [3]

$$11x - 4 < 15x + 4 \leq 13x + 14, x \in \mathbf{W}$$

Represent the solution on a real number line.', 3, 'Linear Inequations', 'short', 1, '22c5bb__ICSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-1-1', '22c5bb', 1, '1', '(b) A man invests ₹ 4500 in shares of a company which is paying 7.5% dividend. If ₹ 100 shares are available at a discount of 10%. [3]

Find:

(i) Number of shares he purchases.
(ii) His annual income.', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-22c5bb-1-2', '22c5bb', 2, '1', '(c) In a class of 40 students, marks obtained by the students in a class test (out of 10) are given below: [4]

| Marks | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students | 1 | 2 | 3 | 3 | 6 | 10 | 5 | 4 | 3 | 3 |

Calculate the following for the given distribution:

(i) Median
(ii) Mode', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-22c5bb-2-0', '22c5bb', 3, '2', '2. (a) Using the factor theorem, show that $(x - 2)$ is a factor of $x^{3} + x^{2} - 4x - 4$ . Hence, factorise the polynomial completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-22c5bb-2-1', '22c5bb', 4, '2', '(b) Prove that:

$$
(\cos \sec \theta - \sin \theta) (\sec \theta - \cos \theta) (\tan \theta - \cot \theta) = 1 [ 3 ]
$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-22c5bb-2-2', '22c5bb', 5, '2', '(c) In an Arithmetic Progression (A.P.) the fourth and sixth terms are 8 and 14 respectively. Find the: [4]
(i) first term
(ii) common difference
(iii) sum of the first 20 terms.', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-22c5bb-3-0', '22c5bb', 6, '3', '3. (a) Simplify [3]

$$\sin A \left[ \begin{array}{l l} \sin A & - \cos A \\ \cos A & \sin A \end{array} \right] + \cos A \left[ \begin{array}{l l} \cos A & \sin A \\ - \sin A & \cos A \end{array} \right]$$', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-22c5bb-3-1', '22c5bb', 7, '3', '(b) M and N are two points on the X axis and Y axis respectively. [3]

P(3, 2) divides the line segment MN in the ratio 2 : 3.

Find:

(i) the coordinates of M and N.
(ii) slope of the line MN.', 3, 'Coordinate Geometry', 'short', 3, '22c5bb__ICSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-3-2', '22c5bb', 8, '3', '(c) A solid metallic sphere of radius 6 cm is melted and made into a solid cylinder of height 32 cm. Find the: [4]
(i) radius of the cylinder.
(ii) curved surface area of the cylinder.

[Take $$\pi = 3.1$$]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-22c5bb-4-0', '22c5bb', 9, '4', '4. (a) The following numbers, $$k + 3, k + 2, 3k - 7$$ and $$2k - 3$$ are in proportion. Find k. [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-22c5bb-4-1', '22c5bb', 10, '4', '(b) Solve for x the quadratic equation $$x^{2} - 4x - 8 = 0$$. [3] Give your answer correct to three significant figures.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-22c5bb-4-2', '22c5bb', 11, '4', '(c) Use ruler and compass only for answering this question. [4] Draw a circle of radius 4 cm. Mark the centre as O. Mark a point P outside the circle at a distance of 7 cm from the centre. Construct two tangents to the circle from the external point P.

Measure and write down the length of any one tangent.', 4, 'Constructions', 'long', 3, '22c5bb__ICSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-5-0', '22c5bb', 12, '5', '5. (a) There are 25 discs numbered 1 to 25. They are put in a closed box and shaken thoroughly. A disc is drawn at random from the box. [3] Find the probability that the number on the disc is:

(i) an odd number.
(ii) divisible by 2 and 3 both.
(iii) a number less than 16.', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-22c5bb-5-1', '22c5bb', 13, '5', '(b) Rekha opened a recurring deposit account for 20 months. The rate of interest is \(9\%\) per annum and Rekha receives ₹ 441 as interest at the time of maturity. [4]

Find the amount Rekha deposited each month.', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-22c5bb-5-2', '22c5bb', 14, '5', '(c) Use a graph sheet for this question. [4] Take $1\mathrm{cm} = 1$ unit along both $x$ and $y$ axis.

(i) Plot the following points: A(0, 5), B(3, 0), C(1, 0) and D(1, -5)
(ii) Reflect the points B, C and D on the y axis and name them as B'', C'' and D'' respectively.
(iii) Write down the coordinates of B'', C'' and D''.
(iv) Join the points A, B, C, D, D'', C'', B'', A in order and give a name to the closed figure ABCD''D''C''B''A.', 4, 'Coordinate Geometry', 'long', 4, '22c5bb__ICSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-6-0', '22c5bb', 15, '6', '6. (a) In the given figure, ∠PQR = ∠PST = 90°, PQ = 5 cm and PS = 2 cm. [3]

(i) Prove that ΔPQR ~ ΔPST.
(ii) Find Area of ΔPQR : Area of quadrilateral SRQT.', 3, 'Similarity', 'short', 5, '22c5bb__ICSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-22c5bb-6-1', '22c5bb', 16, '6', '(b) The first and last term of a Geometrical Progression (G.P.) are 3 and 96 respectively. If the common ratio is 2, find: [3]
(i) ''n'' the number of terms of the G.P.
(ii) Sum of the n terms.', 3, 'Geometric Progression', 'short', 5, NULL, NULL),
  ('MQ-22c5bb-6-2', '22c5bb', 17, '6', '(c) A hemispherical and a conical hole is scooped out of a solid wooden cylinder. Find the volume of the remaining solid where the measurements are as follows: [4]

The height of the solid cylinder is 7 cm, radius of each of hemisphere, cone and cylinder is 3 cm. Height of cone is 3 cm.

Give your answer correct to the nearest whole number. |Take π = 22/7|.', 4, 'Mensuration', 'long', 5, '22c5bb__ICSE_X_Mat_p5_img_2_jpeg.webp', NULL),
  ('MQ-22c5bb-7-0', '22c5bb', 18, '7', '7. (a) In the given figure AC is a tangent to the circle with centre O. [3]

If $\angle \mathrm{ADB} = 55^{\circ}$ , find $x$ and $y$ . Give reasons for your answers.', 3, 'Circles', 'short', 6, '22c5bb__ICSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-22c5bb-7-1', '22c5bb', 19, '7', '(b) The model of a building is constructed with the scale factor \(1:30\). [3]
(i) If the height of the model is \(80~\mathrm{cm}\), find the actual height of the building in meters.
(ii) If the actual volume of a tank at the top of the building is \(27\mathrm{m}^3\), find the volume of the tank on the top of the model.', 3, 'Similarity', 'short', 6, NULL, NULL),
  ('MQ-22c5bb-7-2', '22c5bb', 20, '7', '(c) Given $\left| \begin{array}{ll}4 & 2\\ -1 & 1 \end{array} \right|$ , where M is a matrix and I is unit matrix of order $2\times 2$ . [4]

(i) State the order of matrix M.
(ii) Find the matrix M.', 4, 'Matrices', 'long', 6, NULL, NULL),
  ('MQ-22c5bb-8-0', '22c5bb', 21, '8', '8. (a) The sum of the first three terms of an Arithmetic Progression (A.P.) is 42 and the product of the first and third term is 52. Find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-22c5bb-8-1', '22c5bb', 22, '8', '(b) The vertices of a ΔABC are A(3, 8), B(-1, 2) and C(6, -6), Find: [3]

- (i) Slope of BC.
- (ii) Equation of a line perpendicular to BC and passing through A.', 3, 'Coordinate Geometry', 'short', 7, '22c5bb__ICSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-8-2', '22c5bb', 23, '8', '- (c) Using ruler and a compass only construct a semi-circle with diameter BC = 7 cm. Locate a point A on the circumference of the semicircle such that A is equidistant from B and C. Complete the cyclic quadrilateral ABCD, such that D is equidistant from AB and BC. Measure ∠ADC and write it down. [4]', 4, 'Constructions', 'long', 7, '22c5bb__ICSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-9-0', '22c5bb', 24, '9', '9. (a) The data on the number of patients attending a hospital in a month are given below. Find the average (mean) number of patients attending the hospital in a month by using the shortcut method. [3]

Take the assumed mean as 45. Give your answer correct to 2 decimal places.

| Number of patients | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of days | 5 | 2 | 7 | 9 | 2 | 5 |', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-22c5bb-9-1', '22c5bb', 25, '9', '(b) Using properties of proportion solve for $x$ , given

[3]

$$
\frac {\sqrt {5 x} + \sqrt {2 x - 6}}{\sqrt {5 x} - \sqrt {2 x - 6}} = 4
$$', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-22c5bb-9-2', '22c5bb', 26, '9', '(c) Sachin invests ₹ 8500 in 10%, ₹ 100 shares at ₹ 170. He sells the shares when the price of each share rises by ₹ 30. He invests the proceeds in 12%, ₹ 100 shares at ₹ 125. Find: [4]
(i) the sale proceeds.
(ii) the number of ₹ 125 shares he buys.
(iii) the change in his annual income.', 4, 'Shares and Dividends', 'long', 8, NULL, NULL),
  ('MQ-22c5bb-10-0', '22c5bb', 27, '10', '10. (a) Use graph paper for this question.

[6]

The marks obtained by 120 students in an English test are given below:

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw the ogive and hence, estimate:

(i) the median marks.
(ii) the number of students who did not pass the test if the pass percentage was 50.
(iii) the upper quartile marks.', 6, 'Statistics', 'long', 9, '22c5bb__ICSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-10-1', '22c5bb', 28, '10', '(b) A man observes the angle of elevation of the top of the tower to be \(45^{\circ}\). He walks towards it in a horizontal line through its base. On covering \(20\mathrm{m}\) the angle of elevation changes to \(60^{\circ}\). Find the height of the tower correct to 2 significant figures. [4]', 4, 'Trigonometry', 'long', 9, '22c5bb__ICSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-22c5bb-11-0', '22c5bb', 29, '11', '11. (a) Using the Remainder Theorem, find the remainders obtained when $x^3 + (\mathrm{R}x + 8)x + \mathrm{R}$ is divided by $x + 1$ and $x - 2$ . [3]

Hence, find $k$ if the sum of the two remainders is 1.', 3, 'Factorisation and Remainder Theorem', 'short', 10, NULL, NULL),
  ('MQ-22c5bb-11-1', '22c5bb', 30, '11', '(b) The product of two consecutive natural numbers which are multiples of 3 is equal to 810. Find the two numbers. [3]', 3, 'Quadratic Equations', 'short', 10, NULL, NULL),
  ('MQ-22c5bb-11-2', '22c5bb', 31, '11', '(c) In the given figure, ABCDE is a pentagon inscribed in a circle such that AC is a diameter and side BC||AE. If \(\angle BAC = 50^{\circ}\), find giving reasons: [4]

(i) \(\angle ACB\)
(ii) \(\angle EDC\)
(iii) \(\angle BEC\)

Hence, prove that BE is also a diameter.', 4, 'Circles', 'long', 10, '22c5bb__ICSE_X_Mat_p10_img_1_jpeg.webp', NULL),
  ('MQ-2ab95b-1-0', '2ab95b', 0, '1', '(a) Solve the following inequation and write down the solution set: [3]

$$11x - 4 < 15x + 4 \leq 13x + 14, x \in W$$

Represent the solution on a real number line.', 3, 'Linear Inequations', 'short', 1, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
