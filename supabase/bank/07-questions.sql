set standard_conforming_strings = on;
begin;

-- questions 2501-3000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-94a98d-6-1', '94a98d', 16, '6', '(b) Draw a circle of radius 2.5 cm. Mark a point P at a distance of 6.5 cm from the centre of the circle.

Draw two tangents to the circle from P and measure the length of each. [3]', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-94a98d-6-2', '94a98d', 17, '6', '(c) The surface area of a solid metallic sphere is 1256 cm². It is melted and recast into solid right circular cones of radius 2.5 cm and height 8 cm. Calculate: (i) the radius of the solid sphere.

(ii) the number of cones recast. [Take $\pi = 3.14$] [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-94a98d-7-0', '94a98d', 18, '7', '(a) The line through P(5, 4) intersects y-axis at Q.

(i) Write the slope of the line PQ.
(ii) Write the equation of the line.
(iii) Find the coordinates of Q.', NULL, 'Coordinate Geometry', 'short', 4, '94a98d__Cnms_Maths_p4_img_0_jpeg.webp', NULL),
  ('MQ-94a98d-7-1', '94a98d', 19, '7', '(b) A die has 6 faces marked by the given numbers as shown below:

The die is thrown once. What is probability of getting:

(i) a positive integer
(ii) an integer greater than -4
(iii) the smallest integer? [3]', 3, 'Probability', 'short', 4, '94a98d__Cnms_Maths_p4_img_1_jpeg.webp', NULL),
  ('MQ-94a98d-7-2', '94a98d', 20, '7', '(c) Construct triangle ABC, with AB = 7 cm, BC = 8 cm and ∠ABC = 60⁰.

Locate by construction the point P such that:

(i) P is equidistant from B and C and
(ii) \( \mathrm{P} \) is equidistant from AB and BC.
(iii) Measure and record the length of PB. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-94a98d-8-0', '94a98d', 21, '8', '(a) Using factor theorem, show that (x - 3) is a factor of x³ - 7x² + 15x - 9.

Hence, factorise the given expression completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-94a98d-8-1', '94a98d', 22, '8', '(b) In the figure given below. ∠DOE = 42⁰, where O is the centre. Find ∠DCB.

[3]', 3, 'Circles', 'short', 5, '94a98d__Cnms_Maths_p5_img_0_jpeg.webp', NULL),
  ('MQ-94a98d-8-2', '94a98d', 23, '8', '(c) A pole 5 m high is fixed on the top of a tower. The angle of elevation of the top of the pole observed from a point A on the ground is 60⁰ and the angle of depression of the point A from the top of the tower is 45⁰.

Find the height of the tower.

[4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-94a98d-9-0', '94a98d', 24, '9', '(a) Find the mean for the following frequency distribution by step – deviation method.

[4]

| Class intervals | 84 – 90 | 90 – 96 | 96 – 102 | 102 – 108 | 108 – 114 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 12 | 15 | 10 | 5 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-94a98d-9-1', '94a98d', 25, '9', '(b) Use graph paper for this question.

The marks obtained by 80 students in computer test are given below:

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 10 | 15 | 13 | 20 | 9 | 7 |

Draw an ogive and hence, estimate:

(i) the median marks.
(ii) the inter quartile range.

[6]', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-f87bc6-1-0', 'f87bc6', 0, '1', '(a) Tanvi invested Rs 9000 in 15%, Rs10 shares selling at Rs 45. After a year, she [3]
sold these shares at Rs. 40 each and invested the proceeds in 10%, Rs 20 shares
selling at Rs 25. Calculate:
(i) the number of shares purchased.
(ii) her income from the first investment.
(iii) her income from the second investment.', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-f87bc6-1-1', 'f87bc6', 1, '1', '(b) Prove the identity: $$\frac{\cos^2 A + \tan^2 A - 1}{\sin^2 A} = \tan^2 A$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f87bc6-1-2', 'f87bc6', 2, '1', '(c) The line segment joining the points A (2, 3) and B (6, -5) is intersected by [4]

x-axis at a point K. Write down the ordinate of the point K. Hence find the ratio in which K divides AB.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-f87bc6-2-0', 'f87bc6', 3, '2', '(a) If $$\frac{a}{b} = \frac{c}{d}$$, prove that $$\frac{3a + 5b}{3a - 5b} = \frac{3c + 5d}{3c - 5d}$$. [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-f87bc6-2-1', 'f87bc6', 4, '2', '(b) Find the equation of the line passing through the point of intersection of the lines [3]

$$2x + y - 5 = 0 \text{ and } x - 2y - 5 = 0 \text{ and having } y \text{ intercept as } \frac{-3}{7}.$$', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f87bc6-2-2', 'f87bc6', 5, '2', '(c) From a point on the ground 40 m away from the foot of a tower, the angle of elevation [4]

of the top of the tower is $$30^\circ$$. The angle of elevation of the top of a water tank placed on the top of the tower is $$45^\circ$$. Find:

- (i) the height of the tower upto two significant figures.
- (ii) the depth of the water tank upto two significant figures.', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-f87bc6-3-0', 'f87bc6', 6, '3', '(a) If the equation $$(1 + m^2)x^2 + 2mcx + c^2 - a^2 = 0$$ has equal roots, find the value of $$c$$ in terms of $$a$$ and $$m$$. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-f87bc6-3-1', 'f87bc6', 7, '3', '(b) If $$x = h + a \cos \phi$$ and $$y = k + a \sin \phi$$, prove that: [3]

$$(x - h)^2 + (y - k)^2 = a^2.$$', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f87bc6-3-2', 'f87bc6', 8, '3', '(c) Find $$x$$ from the following equation using properties of proportion: [4]

$$\frac{x^2 - x + 1}{x^2 + x + 1} = \frac{14(x-1)}{13(x+1)}$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-f87bc6-4-0', 'f87bc6', 9, '4', '(a) The model of a building is constructed with the scale factor 1 : 30. [3]

(i) If the height of the model is 80 cm, find the actual height of the building in meters.

(ii) If the actual volume of a tank at the top of the building is 27 m$^{3}$, find the volume of the tank on the top of the model.', 3, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-f87bc6-4-1', 'f87bc6', 10, '4', '(b) The mean of 1, 2, 3, ..., n is 6. Find the value of n. [3]

$$\text{Given } 1 + 2 + 3 + \dots + n = \frac{n(n+1)}{2}.$$', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f87bc6-4-2', 'f87bc6', 11, '4', '(c) Use the graph paper for this question. [4]

The points A (2,3), B (4,5) and C (7,2) are the vertices of $\triangle ABC$ .

(i) Write down the co-ordinates of A'', B'', C'' if A''B''C'' is the image of $\triangle ABC$ , when reflected in the origin.

(ii) Write down the co-ordinates of A'', B'', C'' if $\triangle A''''B''''C''''$ is the image of $\triangle ABC$ , when reflected in the x-axis.

(iii) Mention the special name of the quadrilateral BCC''''B'''' and find its area.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-f87bc6-5-0', 'f87bc6', 12, '5', '(a) With the help of coordinate geometry, prove that the line joining the mid points of any two sides of a $\triangle OAB$ is parallel to the third side. Given that $O(0, 0)$ , $A(4, 4)$ and $B(8, 0)$ . [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-f87bc6-5-1', 'f87bc6', 13, '5', '(b) Solve the following quadratic equation and give your answer correct to 2 decimal places.

$$x^2 + 7x - 7 = 0.$$ [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f87bc6-5-2', 'f87bc6', 14, '5', '(c) Find the mean of the following frequency distribution by short cut method:

[4]

| Class interval | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 | 75-85 | 85-95 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 8 | 8 | 6 | 7 | 9 | 7 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-f87bc6-6-0', 'f87bc6', 15, '6', '(a) The following observations 11, 12, 14, $(x-2)$, $(x+4)$, $(x+9)$, 32, 38, 47

are arranged in ascending order. The median of these observations is 24.

Calculate the value of $x$ and hence find the mean.', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f87bc6-6-1', 'f87bc6', 16, '6', '(b) The point $P(a, b)$ is first reflected in the origin and then reflected in the $y$-axis to $P''$. If $P''$ has coordinates $(4, 6)$, find $a$ and $b$.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-f87bc6-6-2', 'f87bc6', 17, '6', '(c) In a two digit number the product of its digits is 18. When 27 is subtracted from the number, the digits are interchanged. Find the number.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-f87bc6-7-0', 'f87bc6', 18, '7', '(a) Find the equation of the line $AB$ in the following figure. Given $OP = \frac{3}{2}$.', NULL, 'Coordinate Geometry', 'short', 4, 'f87bc6__Cnms_Maths_p4_img_0_jpeg.webp', NULL),
  ('MQ-f87bc6-7-1', 'f87bc6', 19, '7', '(b) Prove the identity: $$\csc^6 A - \cot^6 A = 3 \cot^2 A \csc^2 A + 1$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-f87bc6-7-2', 'f87bc6', 20, '7', '(c) In the figure, ABC is a right angled triangle with $$\angle ABC = 90^\circ$$. D is any point on AB and DE $$\perp$$ AC. [4]

- (i) Prove that $$\triangle AED \sim \triangle ABC$$.
- (ii) If $$AC = 13\text{ cm}$$, $$BC = 5\text{ cm}$$ and $$AE = 4\text{ cm}$$, Find $$A(\triangle AED) : A(\text{quad BCED})$$.', 4, 'Similarity', 'long', 5, 'f87bc6__Cnms_Maths_p5_img_0_jpeg.webp', NULL),
  ('MQ-f87bc6-8-0', 'f87bc6', 21, '8', '(a) The angle of elevation of a pillar from a point P on the ground is $$45^\circ$$ and from a point Q diametrically opposite to P and on the other side of the pillar is $$60^\circ$$. Find the height of the pillar in nearest meter, if the distance between P and Q is 15 m. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-f87bc6-8-1', 'f87bc6', 22, '8', '(b) The weights of 160 applicants for the Army are shown below: $$\text{ogive}$$ [6]

| Weights (kg) | 50 - 55 | 55 - 60 | 60 - 65 | 65 - 70 | 70 - 75 | 75 - 80 | 80 - 85 | 85 - 90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of applicants | 5 | 8 | 16 | 26 | 40 | 28 | 21 | 16 |

Draw an ogive for the above data and estimate:

- (i) the median weight.
- (ii) the lower quartile.
- (iii) If an applicant weighing less than 60 kg and more than 85 kg is rejected, find the number of applicants who are rejected because of their weight.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-10e246-1-0', '10e246', 0, '1', '(a) Prove that \( \frac{\sin A}{1 - \cos A} = \frac{1 + \cos A}{\sin A} \)

[3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-10e246-1-1', '10e246', 1, '1', '(b) Given: A = $$\begin{bmatrix} 2 & 1 \\ 3 & 1 \end{bmatrix}$$ and B = $$\begin{bmatrix} 3 & 0 \\ 1 & 1 \end{bmatrix}$$. Find 2A + 3B - 4I, where I is a unit matrix. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-10e246-1-2', '10e246', 2, '1', '(c) Using factor theorem, factorize $$x^3 - 13x - 12$$. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-10e246-2-0', '10e246', 3, '2', '(a) The marks of 10 students of a class in an examination arranged in ascending order is [3]

as follows:

13, 35, 43, 46, x, x + 4, 55, 61, 71, 80

If the median marks is 48, find the value of x. Hence find the mode of the given data.', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-10e246-2-1', '10e246', 4, '2', '(b) In the given figure, C is the centre of the circle. $$\angle PCQ = 40^0$$ and $$\angle TSP = 120^0$$. [3]

Calculate $$\angle PRQ$$ and $$\angle QPR$$.', 3, 'Circles', 'short', 2, '10e246__Cnms_Mpe_X_p2_img_0_jpeg.webp', NULL),
  ('MQ-10e246-2-2', '10e246', 5, '2', '(c) Use a graph paper for this question. [4]

(i) Plot the point A(-3, 2) and B(2, 5). 
(ii) $$A''$$ is the image of A when reflected in x = 0. Write the coordinates of $$A''$$.
(iii) $$B''$$ is the image of B when reflected in the line $$AA''$$. Write the coordinates of $$B''$$.
(iv) Write the geometrical name of the figure $$ABA''B''$$.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-10e246-3-0', '10e246', 6, '3', '(a) Tanvi deposits Rs 200 per month for 3 years in a recurring deposit account in a bank. [3]
If she gets Rs 8088 at the time of maturity, find the rate of interest.', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-10e246-3-1', '10e246', 7, '3', '(b) Find the value of k if ( k - 2 ), ( 4k - 1 ) and ( 5k + 2 ) are three consecutive terms of an A.P. [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-10e246-3-2', '10e246', 8, '3', '(c) A six faced die is thrown. Find the probability that [4]

(i) a prime number turns up
(ii) an odd number turns up
(iii) a number multiple of 2 turns up.', 4, 'Probability', 'long', 3, NULL, NULL),
  ('MQ-10e246-4-0', '10e246', 9, '4', '(a) Solve the following inequation and graph the solution set on the number line. [3]

$$- 1 < x + 2 < 3 x + 5; \ x \in \mathbf{R}.$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-10e246-4-1', '10e246', 10, '4', '(b) A solid cone of lead with radius 2 cm and height 6 cm is melted and cast into a right circular cylinder of height 2 cm. Find the radius of the base of the cylinder. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-10e246-4-2', '10e246', 11, '4', '(c) AB is a line segment joining the points A (- 4, 6) and B (8, - 3). Find: [4]

(i) the ratio in which AB is divided by the line $x + 2 = 0$.
(ii) the co-ordinates of the point of division.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-10e246-5-0', '10e246', 12, '5', '(a) In the given circle with centre O, ∠ABC = 100⁰ and ∠ACD = 40⁰. CT is a tangent to the circle at C. Find:

- (i) ∠ADC
- (ii) ∠DCT.', NULL, 'Circles', 'short', 4, '10e246__Cnms_Mpe_X_p4_img_0_jpeg.webp', NULL),
  ('MQ-10e246-5-1', '10e246', 13, '5', '(b) Prove that: tan²θ + cot²θ = sec²θ cosec²θ - 2. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-10e246-5-2', '10e246', 14, '5', '(c) Given [8 - 2, 1, 4]B = [12, 10]: Write down [4]

- (i) the order of the matrix B.
- (ii) the matrix B.', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-10e246-6-0', '10e246', 15, '6', '(a) Three numbers are in continued proportion. If the middle number is 18 and the sum [3]

of the first and the last number is 39, find the numbers.', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-10e246-6-1', '10e246', 16, '6', '(b) Solve the following inequation and graph the solution set on the number line. [3]

$$2 x - 1 < x + 2 < 3 x + 5;$$

Replacement set = {-3, -2, -1, 0, 1, 2, 3}', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-10e246-6-2', '10e246', 17, '6', '(c) The total number of observations in the following distribution table is 120 and their mean is 50. Find the values of missing frequencies $f_1$ and $f_2$. [4]

| Class | 0 – 20 | 20 – 40 | 40 – 60 | 60 – 80 | 80 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 17 | $f_1$ | 32 | $f_2$ | 19 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-10e246-7-0', '10e246', 18, '7', '(a) Mr. Hiresh buys the following articles from market: [3]

Medicines costing Rs 1000, GST @ 5 %

A pair of shoes costing Rs 2500, GST @ 18 %

A bag costing Rs 700, GST @ 18 %.

Calculate:

(a) the total amount of GST paid.

(b) the total bill amount including GST paid by Mr. Hiresh.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-10e246-7-1', '10e246', 19, '7', '(b) Solve the quadratic equation $25x^2 + 30x + 7 = 0$ using formula. Write the answer up to [3]

two decimal places.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-10e246-7-2', '10e246', 20, '7', '(c) Solve for x ( Use properties of proportion ): [4]

$$\frac{(4x + 1)^2 + (2x + 3)^2}{4x^2 + 12x + 9} = \frac{61}{36}$$', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-10e246-8-0', '10e246', 21, '8', '(a) A vertical tower subtends a right angle at the top of a vetical flag on the ground. [4]

The height of the flag is 10 m. If the distance between the tower and the flag is $10 \sqrt{3}$ m, find the height of the tower.', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-10e246-8-1', '10e246', 22, '8', '(b) The table below shows the distribution of scores obtained by 120 students in a competition. Using a graph sheet, draw an ogive for the distribution. [6]

( Scale: 2 cm = 10 scores and 2 cm = 10 students )

| Score | No. of students |
| --- | --- |
| 0-10 | 5 |
| 10-20 | 9 |
| 20-30 | 16 |
| 30-40 | 22 |
| 40-50 | 26 |
| 50-60 | 18 |
| 60-70 | 11 |
| 70-80 | 6 |
| 80-90 | 4 |
| 90-100 | 3 |

Use your ogive to estimate:

(i) the median
(ii) the interquartile range
(iii) the number of students who obtained more than 75% scores.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-10e246-9-0', '10e246', 23, '9', '(a) Find the value of k for which the give quadratic equation has real roots [3]

$$k x(x - 2) = - 6 .$$', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-10e246-9-1', '10e246', 24, '9', '(b) The equation of the line AB is 4x - 3y + 18 = 0. [3]

(i) Find the co-ordinates of A.
(ii) If C (8, 0), find the equation of the line AC.', 3, 'Coordinate Geometry', 'short', 7, '10e246__Cnms_Mpe_X_p7_img_0_jpeg.webp', NULL),
  ('MQ-10e246-9-2', '10e246', 25, '9', '(c) A mathematics aptitude test of 50 students was recorded as follows: [4]

| Marks | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 8 | 14 | 19 | 5 |

Draw a histogram for the above data using a graph paper and find the mode.

( Scale: 2 cm = 10 marks and 2 cm = 5 students )', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-10e246-10-0', '10e246', 26, '10', '(a) Mohan deposits Rs. 250 per month for a period of 72 months in a recurring deposit account at the rate of 4.5% p.a. Find the amount he gets on maturity. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-10e246-10-1', '10e246', 27, '10', '(b) The 2nd and 45th term of an arithmetic progression are 10 and 96 respectively. Find the first term and the common difference and hence find the sum of the first 15 terms. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-10e246-10-2', '10e246', 28, '10', '(c) A shopkeeper buys certain number of books for Rs 960. If the cost per book were Rs 8 less, the number of books bought for Rs 960 would have been 4 more. Write an equation taking the original cost of each book as x and solve it to find the original cost of each book. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-10e246-11-0', '10e246', 29, '11', '(a) From the figure , find the equation of the line AB. Given, OA = 1. [3]', 3, 'Coordinate Geometry', 'short', 8, '10e246__Cnms_Mpe_X_p8_img_0_jpeg.webp', NULL),
  ('MQ-10e246-11-1', '10e246', 30, '11', '(b) Two identical coins are thrown simultaneously. Find the probability of getting [3]

(i) at least one tail. (ii) at the most one tail.', 3, 'Probability', 'short', 8, NULL, NULL),
  ('MQ-10e246-11-2', '10e246', 31, '11', '(c) In the figure, ABC is a right angled triangle with ∠ABC = 90⁰. D is any point on AB [4]

DE ⊥ AC.

(i) Prove that ΔAED ~ ΔABC.

(ii) If AC = 13 cm, BC = 5 cm and AE = 4 cm, find DE and AD.

(iii) Find A(ΔAED): A(quad BCED).', 4, 'Similarity', 'long', 8, '10e246__Cnms_Mpe_X_p8_img_1_jpeg.webp', NULL),
  ('MQ-48d218-1-0', '48d218', 0, '1', '(a) If $$\begin{bmatrix} a & 3 \\ 4 & 2 \end{bmatrix} + \begin{bmatrix} 2 & b \\ 1 & -2 \end{bmatrix} \cdot \begin{bmatrix} 1 & 1 \\ -2 & c \end{bmatrix} = \begin{bmatrix} 5 & 0 \\ 7 & 3 \end{bmatrix}$$, find the values of a, b and c. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-48d218-1-1', '48d218', 1, '1', '(b) Solve the inequation and represent the solution set on the number line:
$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x$$, where $$x \in 1$$. [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-48d218-1-2', '48d218', 2, '1', '(c) From a pack of 52 playing cards, all cards whose numbers are multiples of 3 are removed. A card is drawn at random. What is the probability that the card drawn is:

- (i) A face card
- (ii) An even numbered red card ?
- (iii) A black card [4]', 4, 'Probability', 'long', 1, NULL, NULL),
  ('MQ-48d218-2-0', '48d218', 3, '2', 'Ahmed has a recurring deposit account in a bank. He deposits ₹2500 per month for 2 years.

(a) If he gets ₹66250 at the time of maturity, find [3]
(i) the interest paid by the bank
(ii) the rate of interest.', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-48d218-2-1', '48d218', 4, '2', '(b) Find the tenth term from the end of the AP: 4, 9, 14, ..., 254. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-48d218-2-2', '48d218', 5, '2', '(c) Write the equation of a line whose gradient is \(3/2\) and which passes through \(\mathbf{P}\), where \(\mathbf{P}\) divides the line segment joining A (-2, 6) and B (-3, 4) in the ratio 2: 3. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-48d218-3-0', '48d218', 6, '3', '(a) The radii of two circular cylinders are in the ratio 3:4 and their heights are in the ratio 6:5, find the [3] ratio of their curved surfaces.', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-48d218-3-1', '48d218', 7, '3', '(b) Using the remainder theorem, factorise the following polynomials:

$$x^3 + 10x^2 - 37x + 26$$', NULL, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-48d218-3-2', '48d218', 8, '3', '(c) Use a graph paper for this question.
A(0,3), B(3, -2) and O(0,0) are the vertices of triangle ABO.

(i) Name the axis on which A and O are invariant points.
(ii) Plot A, B and C on the graph paper.
(iii) Plot D, the reflection of B in the axis mentioned in (i) and write its coordinates.
(iv) Give the geometrical name of the figure ABOD.', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-48d218-4-0', '48d218', 9, '4', '(a) In the figure, AB is a diameter, APQ and RBQ are straight lines. Find $\angle BPR$', NULL, 'Circles', 'short', 2, '48d218__Cnms_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-48d218-4-1', '48d218', 10, '4', '(b) If \( x, y, z \) are in continued proportion, prove that \( \frac{(x + y)^2}{(y + z)^2} = \frac{x}{z} \)', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-48d218-4-2', '48d218', 11, '4', '(c) The marks obtained by 30 students in a class assessment of 5 marks is given below:

| Marks | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 1 | 3 | 6 | 10 | 5 | 5 |

Calculate the mean, median and mode of the above distribution.', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-48d218-5-0', '48d218', 12, '5', '(a) Let $Q = \begin{bmatrix} 1 & -2 \\ -3 & 4 \end{bmatrix}$ and $R = \begin{bmatrix} -7 \\ 11 \end{bmatrix}$. Find the matrix $P$ if $QP = R$ [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-48d218-5-1', '48d218', 13, '5', '(b) In a GP if the third term is 72 and the sixth term is 1944, find its $n^{\text{th}}$ term. [3]', 3, 'Geometric Progression', 'short', 3, NULL, NULL),
  ('MQ-48d218-5-2', '48d218', 14, '5', '(c) A model of a rocket consists of a cylinder surmounted by a cone at one end having same radius. The dimensions of the model are: common radius = 3 cm, height of cone = 4 cm and total height = 14 cm. If the model is drawn to a scale of 1 : 500, find the total volume of the rocket in $\text{m}^3$. Leave the answer in terms of $\pi$. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-48d218-6-0', '48d218', 15, '6', '(a) Find the sum of integers between 100 and 200 that are divisible by 9 [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-48d218-6-1', '48d218', 16, '6', '(b) How much should a man invest in ₹ 50 shares selling at ₹ 60 to obtain an income of ₹ 450, if the rate of dividend is 10%. Also find the yield percent, to the nearest whole number. [3]', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-48d218-6-2', '48d218', 17, '6', '(c) ABCD is a Rhombus. The coordinates of A and C are (3, 6) and (-1, 2) respectively. Find the equation of BD. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-48d218-7-1', '48d218', 18, '7', '(b) In the following figure PQ is the tangent to the circle at A, DB is the diameter and O is the centre of the circle. If $\angle ADB = 30^\circ$ and $\angle CBD = 60^\circ$. Calculate [3]

(i) $\angle QAB$ (ii) $\angle PAD$ (iii) $\angle CDB$', 3, 'Circles', 'short', 3, '48d218__Cnms_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-48d218-7-2', '48d218', 19, '7', '[4]

(c) Calculate the mean of the distribution given below using the step deviation method.

| Marks | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 2 | 6 | 10 | 12 | 9 | 7 | 4 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-48d218-8-0', '48d218', 20, '8', '[3]

(a) Solve the equation $3x^2 - x - 7 = 0$ and give your answer correct to two decimal places.', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-48d218-8-1', '48d218', 21, '8', '[3]

(b) Prove that: $(\sin A + \csc A)^2 + (\cos A + \sec A)^2 = 5 + \sec^2 A \cdot \csc^2 A$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-48d218-8-2', '48d218', 22, '8', '[4]

(c) Construct a $\Delta ABC$ in which $BC = 6.5 \text{ cm}$ , $\angle ABC = 60^\circ$ , $AB = 5 \text{ cm}$ .

- (i) Construct a locus of points at a distance of 3.5 cm from A.
- (ii) Construct the locus of points equidistant from AC and BC.
- (iii) Mark 2 points X and Y which are at a distance of 3.5 cm from A and also equidistant from AC', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-48d218-9-0', '48d218', 23, '9', '(a) In the adjoining figure, PQRS is a cyclic quadrilateral. PQ and SR produced meet at T.

[3]

- (i) Prove that $\Delta TPS = \Delta TRQ$
- (ii) Find SP if $TP = 18 \text{ cm}$ , $RQ = 4 \text{ cm}$ and $TR = 6 \text{ cm}$ .
- (iii) Find the area of triangle RQT if area of $\Delta PTS = 27 \text{ cm}^2$', 3, 'Similarity', 'short', 4, '48d218__Cnms_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-48d218-9-1', '48d218', 24, '9', '(b) If $\frac{x^2 + y^2}{x^2 - y^2} = 2\frac{1}{8}$ . Using the properties of proportion find : $\frac{x^3 + y^3}{x^3 - y^3}$

[3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-48d218-9-2', '48d218', 25, '9', '(c) If -5 is a root of the quadratic equation $2x^2 + px - 15 = 0$ and the quadratic equation $p(x^2 + x) + k = 0$ has equal roots, find the value of $k$ .

[4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-48d218-10-0', '48d218', 26, '10', '(a) A vertical pole and a vertical tower are on the same level ground. From the top of the pole, the angle of elevation of the top of the tower is 60° and the angle of depression of the foot of the tower is 30°. Find the height of the tower if the height of the pole is 20 m. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-48d218-10-1', '48d218', 27, '10', '(b) The daily wages of 80 workers on a construction site are given below: [6]

| Wages (in Rs) | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 | 100 - 110 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 6 | 10 | 15 | 19 | 12 | 8 | 6 | 4 |

Using a graph paper, draw an ogive for the above distribution. Use your ogive to estimate:

(i) The median wages of the workers.
(ii) The percentage of workers who earn more than \(< 75\) per day.
(iii) The interquartile range.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-48d218-11-0', '48d218', 28, '11', '(a) Find ''a'' if the two polynomials $ax^3 + 3x^2 - 9$ and $2x^3 + 4x + a$, leaves the same remainder when divided by $x + 3$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-48d218-11-1', '48d218', 29, '11', '(b) Draw two concentric circles of radii 3 cm and 5 cm respectively. From any one point P on the outer circle, construct two tangents to the inner circle. Measure the length of the tangent. [3]', 3, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-48d218-11-2', '48d218', 30, '11', '(c) A passenger train covers a distance of 360 km at a certain speed. An express train which is 8 km/h faster covers the distance in 1 hour 30 minutes less. Find the speed of the express train. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-07b0be-1-0', '07b0be', 0, '1', '(i) If – 5 is a root of the quadratic equation $$2x^2 + Px - 15 = 0$$, then', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['P = 3', 'P = 5', 'P = 7', 'P = 1']::text[]),
  ('MQ-07b0be-1-1', '07b0be', 1, '1', '(ii) If $$\frac{x^2 + y^2}{x^2 - y^2} = \frac{17}{8}$$ then the value of x : y is:', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['2 : 3', '4 : 3', '3 : 5', '5 : 3']::text[]),
  ('MQ-07b0be-1-2', '07b0be', 2, '1', '(iii) A man deposited ₹ 200 per month for 36 months in a bank''s recurring deposit account at the rate of 11% per annum, then the interest earned by him is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 1200', '₹ 1220', '₹ 1222', '₹ 1221']::text[]),
  ('MQ-07b0be-1-3', '07b0be', 3, '1', '(iv) The reflection of the point (2, 3) in the line y = 0 is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2, 3)', '(2, -3)', '(-2, -3)', '(-2, 3)']::text[]),
  ('MQ-07b0be-1-4', '07b0be', 4, '1', '(v) $$\frac{\cos A}{1 - \sin A} - \tan A =$$', 1, 'Trigonometry', 'MCQ', 2, NULL, array['cos A', 'sec A', 'sin A', 'cosec A']::text[]),
  ('MQ-07b0be-1-5', '07b0be', 5, '1', '(vi) In a frequency distribution mid value of a class is 10 and the class width is 6, then the lower limit of the class is:', 1, 'Statistics', 'MCQ', 2, NULL, array['4', '7', '5', '3']::text[]),
  ('MQ-07b0be-1-6', '07b0be', 6, '1', '(vii) In an A.P. if $$a = 28, d = -4$$ and $$n = 7$$, then $$t_n$$ is:', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['4', '5', '3', '7']::text[]),
  ('MQ-07b0be-1-7', '07b0be', 7, '1', '(viii) When Mr.Sadan stayed in a hotel for 2 days he had to pay Rs.7080 including 18% GST. What is the tariff of the hotel for one day of accommodation?', 1, 'GST and Banking', 'MCQ', 2, NULL, array['5080', '6000', '4080', '3000']::text[]),
  ('MQ-07b0be-1-8', '07b0be', 8, '1', '(ix) The median class of the following frequency distribution table is:
| Class | Frequency |
| --- | --- |
| 0 – 10 | 9 |
| 10 – 20 | 3 |
| 20 – 30 | 12 |
| 30 – 40 | 4 |
| 40 – 50 | 12 |', 1, 'Statistics', 'MCQ', 2, NULL, array['10 – 20', '20 – 30', '30 – 40', '40 – 50']::text[]),
  ('MQ-07b0be-1-9', '07b0be', 9, '1', '(x) If a pair of dice is tossed, the probability of getting the sum of the numbers on the top more than 12 is:', 1, 'Probability', 'MCQ', 3, NULL, array['1', '1/36', '½', '0']::text[]),
  ('MQ-07b0be-1-10', '07b0be', 10, '1', '(xi) If two matrices A and B are multiplied to get AB then :', 1, 'Matrices', 'MCQ', 3, NULL, array['both A & B are rectangular', 'both A & B have same order', 'number of columns of A is equal to number of rows of B', 'number of rows of A is equal to number of columns of B']::text[]),
  ('MQ-07b0be-1-11', '07b0be', 11, '1', '(xii) If $-2x < 10$, then', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['$x < -5$', '$x > -5$', '$5 > x$', 'None of the above']::text[]),
  ('MQ-07b0be-1-12', '07b0be', 12, '1', '(xiii) The third proportional to 9 and 15 is:', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['15', '25', '20', '18']::text[]),
  ('MQ-07b0be-1-13', '07b0be', 13, '1', '(xiv) If $(x-1)$ is a factor of $x^3 - kx^2 + 11x - 6$, then the value of k should be:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['1', '-6', '6', '5']::text[]),
  ('MQ-07b0be-1-14', '07b0be', 14, '1', '(xv) The solution set representing the following number line is:', 1, 'Linear Inequations', 'MCQ', 3, '07b0be__Dais_T01_X_p3_img_0_jpeg.webp', array['$\{x : x \in R, -2 \leq x < 5\}$', '$\{x : x \in R, x \leq 5\}$', '$\{x : x \in R, -2 \leq x\}$', '$\{x : x \in R, x \leq -2\}$']::text[]),
  ('MQ-07b0be-2-0', '07b0be', 15, '2', '(i) Ms. Zeeba deposits a certain sum of money, every month in a recurring deposit account for 2 years. If she receives Rs. 37875 at the time of maturity and the rate of interest is 5% p.a, find the monthly deposit and the interest she obtained.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-07b0be-2-1', '07b0be', 16, '2', 'If a, b, c are in continued proportion such that $(a + c) = 10$ and $(a^3 + c^3) = 520$, find the value of a,b,c.', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07b0be-2-2', '07b0be', 17, '2', 'Prove that: $\frac{1 + (\sec A - \tan A)^2}{\text{Cosec } A (\sec A - \tan A)} = 2 \tan A$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-07b0be-3-0', '07b0be', 18, '3', '(i) The following bill shows the GST rates and the marked price of the article:

| Items | Marked price (in Rs.) | No. of items | Rate of GST |
| --- | --- | --- | --- |
| Shirt | 1500 | 2 | 8% |
| Suitcase | 7200 | 1 | 12% |
| Tricycle | 2400 | 1 | 18% |

Find the total amount to be paid for the above bill.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-07b0be-3-1', '07b0be', 19, '3', '(ii)

Factorize the given polynomial completely, using factor theorem.

$$(6x^3 + 25x^2 + 31x + 10)$$

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-07b0be-3-2', '07b0be', 20, '3', '(iii) Use a graph paper to answer the following question. Use 2cm = 1 unit on both axes.

- (a) Plot P (3,1) and Q (0,5). Reflect Q in the origin to get Q''.
- (b) Reflect P in the y-axis to get R.
- (c) Reflect P and R in the x-axis to get P'' and R''
- (d) Write the coordinates of R, Q'', P'', R''.
- (e) Give a geometric name for the closed figure PQRR''Q''P''.
- (f) Find its area and name any one invariant point under reflection in the y-axis.

[4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-07b0be-4-0', '07b0be', 21, '4', '(i) A shopkeeper bought a TV set at a discount of 20% from a wholesaler, the printed price of the TV set being Rs. 48,000. The shopkeeper sells it to consumer at a discount of 8% on the printed price. If the rate of GST is 18% and the transaction is intrastate, find:

(a) the price paid by the shopkeeper for the TV set.
(b) SGST and CGST paid by the shopkeeper to the Government.
(c) The price paid by the consumer for the TV set.', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-07b0be-4-1', '07b0be', 22, '4', '(ii) Solve the following quadratic equation, \((7x^{2} + 2x - 2) = 0\) and give your answer correct to 3 significant figures.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-07b0be-4-2', '07b0be', 23, '4', '(iii) In a school the money spent in the canteen by some students is as follows. Draw a histogram to represent the following data and determine the mode.

| Money spent ( in Rs.) | No, of students |
| --- | --- |
| 150 – 200 | 6 |
| 200 – 250 | 16 |
| 250 – 300 | 22 |
| 300 – 350 | 13 |
| 350 – 400 | 5 |
| 400 – 450 | 3 |', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-07b0be-5-0', '07b0be', 24, '5', '(i) If $$A = \begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$, $$B = \begin{bmatrix} 2 & 1 \\ 3 & 2 \end{bmatrix}$$, $$C = \begin{bmatrix} 4 & -5 \\ -3 & 1 \end{bmatrix}$$, compute: $$C(B1 - 2A)$$ where I is the identity matrix of order (2x2).', NULL, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-07b0be-5-1', '07b0be', 25, '5', '(ii) Without solving the quadratic equation, find the value of p for which the equation has real and equal roots.

$$x^2 + 2(p - 1)x + (p + 5) = 0$$', NULL, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-07b0be-5-2', '07b0be', 26, '5', '(iii) If the nth terms of two AP''s 9, 7, 5,... and 24, 21, 18,... are the same, find the value of ''n''. Also find the sum of ''n'' terms of both AP.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-07b0be-6-0', '07b0be', 27, '6', '(i) Some identical cards are numbered from 2 to 25 and well shuffled. [3] When a card is drawn randomly, what is the probability that the card has

(a) a prime number
(b) a multiple of 2 and 3
(c) not a multiple of 7', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-07b0be-6-1', '07b0be', 28, '6', '(ii) Find the sum of 25 terms of an AP in which the third term is 7 and seventh term is 2 more than thrice its third term.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-07b0be-6-2', '07b0be', 29, '6', '(iii) A building and a tower are on the same ground level. From the top of the building, the angle of elevation of the top of the tower is 30° and the angle of depression of the foot of the tower is 60°. If the building is 108 m high, find

(a) the height of the tower
(b) the distance between the bottoms of the building and the tower correct to the nearest meter.', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-07b0be-7-0', '07b0be', 30, '7', '(i) Solve the following inequation and represent the solution set on a number line.

$$-1\frac{1}{6} \leq \frac{x}{2} + \frac{5}{6} < 2, \ x \in R$$', NULL, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-07b0be-7-1', '07b0be', 31, '7', '(ii) Given matrix $$A = \begin{pmatrix} 4 \sin 30 & \cos 0 \\ \cos 0 & 4 \cos 60 \end{pmatrix}$$, $$B = \binom{4}{5}$$. If AX = B [3]

(a) Write the order of matrix \( X \).
(b) Find the matrix \(X\)', 3, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-07b0be-7-2', '07b0be', 32, '7', '(iii) If $$(2x^3 + ax^2 + bx - 2)$$ has a factor (x +2) and leaves a remainder 7 when divided by (2x - 3), find the values of a and b. With these values of a and b, factorize the given polynomial completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 7, NULL, NULL),
  ('MQ-07b0be-8-0', '07b0be', 33, '8', '(i) Calculate the mean of the distribution by step-deviation method. Also state the modal class of the distribution. [4]

| Marks | No. of students |
| --- | --- |
| 10 – 20 | 4 |
| 20 – 30 | 7 |
| 30 – 40 | 9 |
| 40 – 50 | 12 |
| 50 – 60 | 9 |
| 60 – 70 | 6 |
| 70 – 80 | 3 |', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-07b0be-8-1', '07b0be', 34, '8', '(ii) A bag contains 6 green, 7 red and 3 white balls. A ball is chosen without looking into the bag. Find the probability that the ball is [3]

(a) not green
(b) red and green
(c) white or green', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-07b0be-8-2', '07b0be', 35, '8', '(iii) Using properties of proportion solve for x.

$$\frac{x^4+9}{6x^2} = \frac{5}{3}$$', NULL, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-07b0be-9-0', '07b0be', 36, '9', '(i) If a, b, c are in continued proportion, prove that

$$\left(\frac{ab+bc+ac}{a+b+c}\right)^3 = abc$$', NULL, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-07b0be-9-1', '07b0be', 37, '9', '(ii) Prove that: $$\sqrt{\frac{1-\cos A}{1+\cos A}} = \frac{\sin A}{1+\cos A}$$', NULL, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-07b0be-9-2', '07b0be', 38, '9', '(iii) The sum of the first three terms of an AP is 33. If the product of the first and the third terms exceeds the second term by 29, find the AP.', NULL, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-07b0be-10-0', '07b0be', 39, '10', '(i) A passenger train covers a distance of 360 km at a certain speed. An express train which is 8 km/hr faster covers the same distance in 1 hour 30 minutes less. Find the speed of the express train.', NULL, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-07b0be-10-1', '07b0be', 40, '10', '(ii) The following table gives daily wages of 120 workers in a small family. [6]

| Wages in Rs. | No. of workers. |
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

Draw an ogive for the given data using a graph paper. Use a scale of 2 cm = Rs.50 on one axis and 2 cm = 20 workers on the other axis. Use the ogive to estimate the:

(a) median
(b) lower quartile
(c) number of workers earning more than Rs. 325
(d) number of workers who earn between Rs.175 to Rs.325', 6, 'Statistics', 'long', 9, NULL, NULL),
  ('MQ-3a7e1c-1-0', '3a7e1c', 0, '1', '(a) Solve the following Quadratic Equation: $$x^2 - 7x + 3 = 0$$ . Give your answer correct to two decimal places.

[3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-3a7e1c-1-1', '3a7e1c', 1, '1', '(b) Given $$A = \begin{bmatrix} x & 3 \\ y & 3 \end{bmatrix}$$

If $$A^2 = 3I$$ , where I is the identity matrix of order 2, find x and y.

[3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-3a7e1c-1-2', '3a7e1c', 2, '1', '(c) Mr. Bedi visits the market and buys the following articles:

Medicines costing ₹ 950, GST at 5%

A pair of shoes costing ₹ 3000, GST at 18%

A laptop bag costing ₹1000 with a discount of 30%, GST at 18%

i) Calculate the total amount of GST paid

ii) The total bill amount including GST paid by Mr. Bedi', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-3a7e1c-7-0', '3a7e1c', 3, '7', '(b) PQR is a triangle. S is a point on the side QR of ΔPQR such that ZPSR = ZQPR.
Given QP = 8 cm, PR = 6 cm and SR = 3 cm.

(i) Prove ΔPQR = ΔSPR

(ii) Find the length of QR and PS

(iii) $$\frac{\text{area of } \Delta PQR}{\text{area of } \Delta SPR}$$ [3]', 3, 'Similarity', 'short', 2, '3a7e1c__Dbcs_Fre_X_p2_img_0_jpeg.webp', NULL),
  ('MQ-3a7e1c-7-1', '3a7e1c', 4, '7', '(c) The sum of the ages of Vivek and his younger brother Amit is 47 years. The product of their ages in years is 550. Find their ages. [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-3a7e1c-8-0', '3a7e1c', 5, '8', '(a) Mr. Sonu has a recurring deposit account and deposits ₹ 750 per month for 2 years. If he gets ₹ 19125 at the time of maturity, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-3a7e1c-8-1', '3a7e1c', 6, '8', '(b) If the 6th terms of an AP is equal to four times its first term and the sum of first six terms is 75, find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-3a7e1c-9-0', '3a7e1c', 7, '9', '(a) ₹ 7500 were divided equally among a certain number of children. Had there been 20 less children, each would have received ₹ 100 more. Find the original number of children. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-3a7e1c-9-1', '3a7e1c', 8, '9', '(b) Find the value of $$k$$ for which the following equation has equal roots [3]

$$x^2 + 4kx + (k^2 - k + 2) = 0$$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-3a7e1c-9-2', '3a7e1c', 9, '9', '(c) What must be added to the polynomial $$2x^3 - 3x^2 - 8x$$, so that it leaves a reminder 10 when divided by $$2x + 1$$? [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-3a7e1c-4-0', '3a7e1c', 10, '4', '(c) In $\Delta$ PQR, MN is parallel to QR and $\frac{PM}{MQ} = \frac{2}{3}$

(i) Find $\frac{MN}{QR}$

(ii) Prove that $\Delta$OMN and $\Delta$ORQ are similar.

(iii) Find, Area of $\Delta$OMN: Area of $\Delta$ORQ

[4]', 4, 'Similarity', 'long', 3, '3a7e1c__Dbcs_Fre_X_p3_img_0_jpeg.webp', NULL),
  ('MQ-3a7e1c-5-0', '3a7e1c', 11, '5', '(a) Priyanka has a recurring deposit account of ₹ 1000 per month at 10% per annum. If she gets ₹ 5550 as interest at the time of maturity, find the total time for which account has held. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-3a7e1c-5-1', '3a7e1c', 12, '5', '(b) Use Remainder theorem to factorize the following polynomial:

$$2x^3 + 3x^2 - 9x - 10$$ [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-3a7e1c-5-2', '3a7e1c', 13, '5', '(c) The 4th term of an A. P. is 22 and 15th term is 66. Find the first term and the common difference. Hence find the sum of the series to 8 terms. [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-3a7e1c-6-0', '3a7e1c', 14, '6', '(a) The following numbers, $K + 3$, $K + 2$, $3K - 7$ and $2K - 3$ are in proportion. Find $K$. [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-3a7e1c-6-1', '3a7e1c', 15, '6', '(b) Solve for $x$ the quadratic equation $x^2 - 4x - 8 = 0$. Give your answer correct to three significant figures. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3a7e1c-6-2', '3a7e1c', 16, '6', '(c) Given $\begin{bmatrix} 4 & 2 \\ -1 & 1 \end{bmatrix} M = 6I$ where $M$ is a matrix and $I$ is unit matrix of order $2 \times 2$.

(i) State the order of matrix $M$. [4]

(ii) Find the matrix $M$.', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-3a7e1c-7-2', '3a7e1c', 17, '7', '(a) Solve the following inequation and represent the solution set on a number line. [3]

$$-8\frac{1}{2} < -\frac{1}{2} - 4x \leq 7\frac{1}{2}, x \in I$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-3a7e1c-2-0', '3a7e1c', 18, '2', '(a) Using the factor theorem, show that $(x - 2)$ is a factor of $x^3 + x^2 - 4x - 4$. Hence, factorise the polynomial completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-3a7e1c-2-1', '3a7e1c', 19, '2', '(b) The difference of two natural numbers is 7 and their product is 450. Find the numbers. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-3a7e1c-2-2', '3a7e1c', 20, '2', '(c) In an Arithmetic Progression (A.P.) the fourth and sixth terms are 8 and 14 respectively. Find the: (i) first term
(ii) common difference
(iii) sum of the first 20 terms. [4]', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-3a7e1c-3-0', '3a7e1c', 21, '3', '(a) If $A = \begin{bmatrix} 3 & 0 \\ 5 & 1 \end{bmatrix}$ and $B = \begin{bmatrix} -4 & 2 \\ 1 & 0 \end{bmatrix}$, find $A^2 - 2AB + B^2$. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-3a7e1c-3-1', '3a7e1c', 22, '3', '(b) In the given figure $AB = 9$ cm, $PA = 7.5$ cm and $PC = 5$ cm [3]
chords $AD$ and $BC$ intersect at $P$.
i) Prove that $\triangle PAB \sim \triangle PCD$
ii) Find the length of $CD$
iii) Find area of $\triangle PAB$ : area of $\triangle PCD$', 3, 'Circles', 'short', 4, '3a7e1c__Dbcs_Fre_X_p4_img_0_jpeg.webp', NULL),
  ('MQ-3a7e1c-3-2', '3a7e1c', 23, '3', '(c) If $x = \frac{\sqrt{2a+1} + \sqrt{2a-1}}{\sqrt{2a+1} - \sqrt{2a-1}}$, prove that $x^2 - 4ax + 1 = 0$. [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-3a7e1c-4-1', '3a7e1c', 24, '4', '(a) Sonia had a recurring deposit account in a bank and deposited ₹ 3600 per month for 2½ years. If the rate of interest was 10% p.a., find the maturity value of this account. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-3a7e1c-4-2', '3a7e1c', 25, '4', '(b) Solve the following inequation, write down the solution set and represent it on the real number line : $$-2 + 10x \leq 13x + 10 < 24 + 10x, x \in \mathbb{Z}$$ [3]', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-1-0', '4a7cb1', 0, '1', '1. For some integer ''a'' every even integer is of the form:', 1, NULL, 'MCQ', 1, NULL, array['a + 1', '2a', 'a', '2a + 1']::text[]),
  ('MQ-4a7cb1-2-0', '4a7cb1', 1, '2', '2. Graph of a quadratic polynomial can meet the x-axis at almost', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['4 points', '3 points', '2 points', 'one point']::text[]),
  ('MQ-4a7cb1-3-0', '4a7cb1', 2, '3', '3. The pair of equations x = 2 and y = 3 graphically represent lines which are:

a) Coincident

c) intersecting at (3, 2)

b) parallel

d) intersecting at (2, 3)', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-4a7cb1-4-0', '4a7cb1', 3, '4', '4. If the nᵗʰ term of an A.P is (2n + 1), then the sum of its first three terms is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['6n + 3', '15', '12', '21']::text[]),
  ('MQ-4a7cb1-5-0', '4a7cb1', 4, '5', '5. The point which lies on the perpendicular bisector of the line segment joining the points (- 2, - 5) and (2, 5) is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(0, 0)', '(0, 2)', '(2, 0)', '(- 2, 0)']::text[]),
  ('MQ-4a7cb1-6-0', '4a7cb1', 5, '6', '6. In an equilateral triangle ABC, if AD ⊥ BC then which of the following is true?

a) 2AB² = 3AD²

c) 3AB² = 4AD²

b) 4AB² = 3AD²

d) 3AB² = 2AD²', 1, 'Similarity', 'short', 2, '4a7cb1__Delhi_Publ_p2_img_0_jpeg.webp', NULL),
  ('MQ-4a7cb1-7-0', '4a7cb1', 6, '7', '7. If √3 tanθ = 3 sinθ then, (sin²θ - cos²θ) is equal to', 1, 'Trigonometry', 'MCQ', 2, NULL, array['1/3', '1/√3', '√3', '2/√3']::text[]),
  ('MQ-4a7cb1-8-0', '4a7cb1', 7, '8', '8. If 2 sin2θ = √3, then θ = ?', 1, 'Trigonometry', 'MCQ', 2, NULL, array['45°', '30°', '60°', '90°']::text[]),
  ('MQ-4a7cb1-9-0', '4a7cb1', 8, '9', '9. If sin A + sin² A = 1, then the value of cos² A + cos⁴ A is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['2', '1', '- 2', '0']::text[]),
  ('MQ-4a7cb1-10-0', '4a7cb1', 9, '10', '10. If the circumference and area of a circle are numerically equal, then the radius of the circle is equal to', 1, 'Mensuration', 'MCQ', 2, NULL, array['1', '7', '2', 'π']::text[]),
  ('MQ-4a7cb1-11-0', '4a7cb1', 10, '11', '11. If a is Mode, b is Mean and c is Median of a given data then', 1, 'Statistics', 'MCQ', 2, NULL, array['3c = a + 2b', '3b = 2a + c', '3b = a + 2c', 'a = b + c']::text[]),
  ('MQ-4a7cb1-12-0', '4a7cb1', 11, '12', '12. In a survey, it is found that every fifth person possess a vehicle, what is the probability of a person not possessing the vehicle?', 1, 'Probability', 'MCQ', 2, NULL, array['0', '1/5', '4/5', '1']::text[]),
  ('MQ-4a7cb1-13-0', '4a7cb1', 12, '13', '13. The sum of the zeros of the polynomial p(x) = 5x - 7x² + 3 is:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['-7/5', '7/5', '5/7', '-5/7']::text[]),
  ('MQ-4a7cb1-14-0', '4a7cb1', 13, '14', '14. In the given figure, PQRS is a parallelogram,
If AT = AQ = 6 cm, AS = 3 cm and TS = 4 cm, then:', 1, 'Similarity', 'MCQ', 3, '4a7cb1__Delhi_Publ_p3_img_0_jpeg.webp', array['x = 4 cm, y = 5 cm', 'x = 2 cm, y = 3 cm', 'x = 1 cm, y = 2 cm', 'x = 3 cm, y = 4 cm']::text[]),
  ('MQ-4a7cb1-15-0', '4a7cb1', 14, '15', '15. A box contains cards numbered 6 to 55. A card is drawn at random from the box. The probability that the drawn card has a number which is a perfect square, is:', 1, 'Probability', 'MCQ', 3, NULL, array['$$\frac{7}{50}$$', '$$\frac{7}{55}$$', '$$\frac{1}{10}$$', '$$\frac{5}{49}$$']::text[]),
  ('MQ-4a7cb1-16-0', '4a7cb1', 15, '16', '16. Which of the following lines are parallel to the line y = 5x + 2?
i) Y = 5x - 3
ii) $$y = \frac{-1}{5}x + 7$$
iii) $$y = \frac{-1}{5}x + 1$$
iv) y = 5x + 3', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(i), (iii) and (iv)', '(i), (ii), (iii) and (iv)', '(i), (ii) and (iii)', '(i) and (iv)']::text[]),
  ('MQ-4a7cb1-17-0', '4a7cb1', 16, '17', '17. The mid-point of the line segment joining the points P(- 4, 5) and Q(4, 6) lies on:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['x-axis', 'y-axis', 'origin', 'neither x-axis nor y-axis']::text[]),
  ('MQ-4a7cb1-18-0', '4a7cb1', 17, '18', '18. Rakesh loves to travel and he travels every year. He has seen 8 different cities in his first year. Thereafter every year he has seen 2 more cities than the previous year. If he had followed this pattern, how many cities did he see by the end of 10 years of travel?

a) [5 { 8 + 9 (2) } ] cities

c) [5 { 16 + 9 (2) } ] cities

b) [5 { 8 + 10 (2) } ] cities

d) [5 { 16 + 10 (2) } ] cities', 1, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-4a7cb1-19-0', '4a7cb1', 18, '19', 'DIRECTION : In the question number 19 and 20, a statement (A) is followed by a statement (R). Choose the correct option.

a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A).
b) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A).
c) Assertion (A) is true but reason (R) is false.
d) Assertion (A) is false but reason (R) is true.

19. Assertion (A) : For any two prime numbers p and q, their HCF is 1 and LCM is (p + q).
Reason (R) : For any two natural numbers, HCF X LCM = product of numbers.', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-4a7cb1-20-0', '4a7cb1', 19, '20', 'DIRECTION : In the question number 19 and 20, a statement (A) is followed by a statement (R). Choose the correct option.

a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A).
b) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A).
c) Assertion (A) is true but reason (R) is false.
d) Assertion (A) is false but reason (R) is true.
20. Assertion (A) : The value of $\sin \theta = \frac{4}{3}$ is not possible.

Reason (R) : Hypotenuse is the longest side in any right angled triangle.', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-4a7cb1-21-0', '4a7cb1', 20, '21', '21. Prove that $2 + \sqrt{3}$ is an irrational number, given that $\sqrt{3}$ is an irrational number.', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-22-0', '4a7cb1', 21, '22', '22. In the given figure, if LM || BC and LN || CD, prove that

$$\frac{AM}{AB} = \frac{AN}{AD}$$', 2, 'Similarity', 'short', 4, '4a7cb1__Delhi_Publ_p4_img_0_jpeg.webp', NULL),
  ('MQ-4a7cb1-23-0', '4a7cb1', 22, '23', '23. In the given figure, arcs have been drawn of radius 7 cm each with vertices A, B, C and D of quadrilateral ABCD as centres. Find the area of the shaded region.', 2, 'Mensuration', 'short', 4, '4a7cb1__Delhi_Publ_p4_img_1_jpeg.webp', NULL),
  ('MQ-4a7cb1-24-0', '4a7cb1', 23, '24', '24. If A and B are acute angles, $0^{\circ} < A + B \leq 90^{\circ}$ such that $\sin (A - B) = 0$ and $2 \cos (A + B) - 1 = 0$, find A and B.', 2, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-25-0', '4a7cb1', 24, '25', '25. Find the $20^{\text{th}}$ term from the end of the AP: 3, 8, 13, ..., 253.', 2, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-26-0', '4a7cb1', 25, '26', '26. Let x and y be two distinct prime numbers and $p = x^2 y^3$, $q = x y^4$, $r = x^5 y^2$. Find the HCF and LCM of p, q and r. Further check if HCF (p, q, r) = p x q x r or not.', 3, NULL, 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-27-0', '4a7cb1', 26, '27', '27. If $\alpha$ and $\beta$ are zeros of the quadratic polynomial $p(x) = x^2 - 5x + 4$, then find the value of $\frac{1}{\alpha} + \frac{1}{\beta} - 2\alpha\beta$.', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-28-0', '4a7cb1', 27, '28', '28. Prove that: $\frac{\sin \theta - 2\sin^3 \theta}{2 \cos^3 \theta - \cos \theta} = \tan \theta$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4a7cb1-29-0', '4a7cb1', 28, '29', '29. Solve the pair of linear equations:

$$
\frac{2}{\sqrt{x}} + \frac{3}{\sqrt{y}} = 2
$$

$$
\frac{4}{\sqrt{x}} - \frac{9}{\sqrt{y}} = -1
$$', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-4a7cb1-30-0', '4a7cb1', 29, '30', '30. The mode of the following data is 67. Find the missing frequency $x$.

| Class | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 5 | x | 15 | 12 | 7 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-4a7cb1-31-0', '4a7cb1', 30, '31', '31. If $\sin \theta + \cos \theta = p$ and $\sec \theta + \csc \theta = q$, then prove that $q(p^2 - 1) = 2p$.', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-4a7cb1-32-0', '4a7cb1', 31, '32', '32. a) Prove that if a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.', NULL, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-4a7cb1-32-1', '4a7cb1', 32, '32', 'b) In the given figure, $\Delta PQR$ is right-angled at $P$.

M is a point on QR such that PM is perpendicular to QR.

Show that $PQ^2 = QM \times QR$.', NULL, 'Similarity', 'short', 5, '4a7cb1__Delhi_Publ_p5_img_0_jpeg.webp', NULL),
  ('MQ-4a7cb1-33-0', '4a7cb1', 33, '33', '33. In the given figure, O is the centre of the circle

with AC = 24 cm, AB = 7 cm and $\angle BOD = 90^\circ$.

Find the area of the shaded region.', 5, 'Mensuration', 'long', 5, '4a7cb1__Delhi_Publ_p5_img_1_jpeg.webp', NULL),
  ('MQ-4a7cb1-34-0', '4a7cb1', 34, '34', '34. The students of a class are made to stand equally in rows. If 3 students are more in each row, there would be 1 row less. If 3 students are less in a row, there would be 2 more rows. Find the number of students in the class.', 5, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-4a7cb1-35-0', '4a7cb1', 35, '35', '35. A student noted the number of cars passing through a spot on a road for 100 periods each of 3 minutes and summarised it in the table given below. Find the mean and median of the following data.

| No of cars | 0 – 10 | 10 –20 | 20 –30 | 30 –40 | 40 –50 | 50 –60 | 60 –70 | 70 –80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency (Periods) | 7 | 14 | 13 | 12 | 20 | 11 | 15 | 8 |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-4a7cb1-36-0', '4a7cb1', 36, '36', '36. In an equilateral triangle of side 10 cm, equilateral triangles of side 1 cm are formed as shown in the given below figure, such that there is one triangle in the first row, three triangles in the second row, five triangles in the third row and so on.

Based on the above information answer the following questions:
i) How many triangles will be there in bottom most row?', 1, 'Arithmetic Progression', 'short', 6, '4a7cb1__Delhi_Publ_p6_img_0_jpeg.webp', NULL),
  ('MQ-4a7cb1-36-1', '4a7cb1', 37, '36', '36. In an equilateral triangle of side 10 cm, equilateral triangles of side 1 cm are formed as shown in the given below figure, such that there is one triangle in the first row, three triangles in the second row, five triangles in the third row and so on.

Based on the above information answer the following questions:
ii) How many triangles will be there in fourth row from the bottom?', 1, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-36-2', '4a7cb1', 38, '36', '36. In an equilateral triangle of side 10 cm, equilateral triangles of side 1 cm are formed as shown in the given below figure, such that there is one triangle in the first row, three triangles in the second row, five triangles in the third row and so on.

Based on the above information answer the following questions:
iii) a) Find the total number of triangles of side 1 cm each till \(8^{\text{th}}\) row.', 2, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-36-3', '4a7cb1', 39, '36', '36. In an equilateral triangle of side 10 cm, equilateral triangles of side 1 cm are formed as shown in the given below figure, such that there is one triangle in the first row, three triangles in the second row, five triangles in the third row and so on.

Based on the above information answer the following questions:
b) How many more number of triangles are there from 5th row to 10th row than in first 4 rows? Show working.', 2, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-37-0', '4a7cb1', 40, '37', '37. In a survey on holidays, 120 people were asked to state which type of transport they used on their last holidays. The following pie chart shows the result of the survey.

Based on the above information answer the following questions:
(i) If one person is selected at random, find the probability that he/she travelled by bus or ship.', 1, 'Probability', 'short', 6, '4a7cb1__Delhi_Publ_p6_img_1_jpeg.webp', NULL),
  ('MQ-4a7cb1-37-1', '4a7cb1', 41, '37', '37. In a survey on holidays, 120 people were asked to state which type of transport they used on their last holidays. The following pie chart shows the result of the survey.

Based on the above information answer the following questions:
(ii) Which is most favourite mode of transport and how many people used it?', 1, NULL, 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-37-2', '4a7cb1', 42, '37', '37. In a survey on holidays, 120 people were asked to state which type of transport they used on their last holidays. The following pie chart shows the result of the survey.

Based on the above information answer the following questions:
(iii) (a) A person is selected at random. If the probability that he did not use train is \(\frac{4}{5}\), find the number of people who used train.', 2, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-37-3', '4a7cb1', 43, '37', '37. In a survey on holidays, 120 people were asked to state which type of transport they used on their last holidays. The following pie chart shows the result of the survey.

Based on the above information answer the following questions:
(b) The probability that randomly selected person used aeroplane is $\frac{7}{60}$. Find the revenue collected by air company at the rate of Rs.5000 per person.', 2, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-4a7cb1-38-0', '4a7cb1', 44, '38', '38. A coach is discussing the strategy of the game with his players. The position of players is marked with ''x'' in the figure.

Based on the above information answer the following questions:
(i) What is the distance between the player C and B?', 1, 'Coordinate Geometry', 'short', 7, '4a7cb1__Delhi_Publ_p7_img_0_jpeg.webp', NULL),
  ('MQ-4a7cb1-38-1', '4a7cb1', 45, '38', '38. A coach is discussing the strategy of the game with his players. The position of players is marked with ''x'' in the figure.

Based on the above information answer the following questions:
(ii) Write the position of the player who is 6 units from x-axis and 2 units to the right of y-axis.', 1, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-4a7cb1-38-2', '4a7cb1', 46, '38', '38. A coach is discussing the strategy of the game with his players. The position of players is marked with ''x'' in the figure.

Based on the above information answer the following questions:
(iii) a) If (x, y) are the coordinates of the mid-point of the line segment joining A and H, then write the value of x and y.', 2, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-4a7cb1-38-3', '4a7cb1', 47, '38', '38. A coach is discussing the strategy of the game with his players. The position of players is marked with ''x'' in the figure.

Based on the above information answer the following questions:
b) According to sudden requirement coach of the team decided to increase one player in the 4th quadrant without increasing the total number of players, so he decided to change the position of player F in such a way that F becomes symmetric to D with respect to x-axis, then write the new position of F.', 2, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-c96f2b-1-0', 'c96f2b', 0, '1', '1. If one zero of the quadratic polynomial (x² + 3x + k) is 2, then the value of ''k'' is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['10', '- 10', '5', '- 5.']::text[]),
  ('MQ-c96f2b-2-0', 'c96f2b', 1, '2', '2. If in triangles ΔABC and ΔDEF, AB/DE = BC/FD, then they will be similar, when', 1, 'Similarity', 'MCQ', 1, NULL, array['∠B = ∠E', '∠B = ∠D', '∠A = ∠D', '∠A = ∠F.']::text[]),
  ('MQ-c96f2b-3-0', 'c96f2b', 2, '3', '3. If $\sqrt{2}\sin(60^{\circ} - \alpha) = 1$, then the value of ''$\alpha$'' is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$15^{\circ}$', '$30^{\circ}$', '$45^{\circ}$', '$60^{\circ}$.']::text[]),
  ('MQ-c96f2b-4-0', 'c96f2b', 3, '4', '4. In the given figure, PQ is tangent to the circle centered at O. If $\angle AOB = 95^{\circ}$, then the measure of $\angle ABQ$ will be', 1, 'Circles', 'MCQ', 2, 'c96f2b__Delhi_Publ_p2_img_0_jpeg.webp', array['$47.5^{\circ}$', '$42.5^{\circ}$', '$85^{\circ}$', '$132.5^{\circ}$.']::text[]),
  ('MQ-c96f2b-5-0', 'c96f2b', 4, '5', '5. The areas of two circles are in the ratio $9 : 4$. Then, the ratio of their circumferences is', 1, 'Mensuration', 'MCQ', 2, NULL, array['$3 : 2$', '$4 : 9$', '$2 : 3$', '$81 : 16$.']::text[]),
  ('MQ-c96f2b-6-0', 'c96f2b', 5, '6', '6. If the mean and median of a set of numbers are 7.2 and 9 respectively, then the mode will be', 1, 'Statistics', 'MCQ', 2, NULL, array['17.2', '12.6', '18', 'None of these.']::text[]),
  ('MQ-c96f2b-7-0', 'c96f2b', 6, '7', '7. If $a = 2^3 \times 3$, $b = 2 \times 3 \times 5^m$, $c = 3^n \times 5^3$ and $LCM(a, b, c) = 2^3 \times 3^4 \times 5^5$, then $(m + n)$ is', 1, NULL, 'MCQ', 2, NULL, array['6', '4', '9', 'None of these.']::text[]),
  ('MQ-c96f2b-8-0', 'c96f2b', 7, '8', '8. $\sec \theta$ when expressed in terms of $\cot \theta$, is equal to', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$\frac{1 + \cot^2\theta}{\cot\theta}$', '$\sqrt{1 + \cot^2\theta}$', '$\frac{\sqrt{1 + \cot^2\theta}}{\cot\theta}$', '$\frac{\sqrt{1 - \cot^2\theta}}{\cot\theta}$.']::text[]),
  ('MQ-c96f2b-9-0', 'c96f2b', 8, '9', '9. A pair of equations $ax + 2y = 9$ and $3x + by = 18$ represent parallel lines, where $a, b$ are integers, if', 1, NULL, 'MCQ', 2, NULL, array['$a = b$', '$3a = 2b$', '$2a = 3b$', '$ab = 6$.']::text[]),
  ('MQ-c96f2b-10-0', 'c96f2b', 9, '10', '10. The coordinates of the centroid of the triangle of vertices $A(2, 2), B(0, 4)$ and $C(7, -9)$ are', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(5, -6)$', '$(2, 0)$', '$(3, -1)$', 'None of these.']::text[]),
  ('MQ-c96f2b-11-0', 'c96f2b', 10, '11', '11. The zeros of the quadratic polynomial $f(x) = x^2 + 99x + 127$ are

(a) both positive

(c) one positive and one negative

(b) both negative

(d) both equal', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-c96f2b-12-0', 'c96f2b', 11, '12', '12. If tangents $PA$ and $PB$ from a point $P$ to a circle with centre $O$ are inclined to each other at an angle of $80^{\circ}$, then $\angle POA$ is equal to

(a) $50^{\circ}$

(c) $70^{\circ}$

(b) $60^{\circ}$

(d) $80^{\circ}$.', 1, 'Circles', 'short', 2, 'c96f2b__Delhi_Publ_p2_img_1_jpeg.webp', NULL),
  ('MQ-c96f2b-13-0', 'c96f2b', 12, '13', '13. Which of the following number(s) cannot be the probability of happening of an event?', 1, 'Probability', 'MCQ', 3, NULL, array['0', '$$\frac{7}{0.01}$$', '0.07', '$$\frac{0.07}{3}$$ .']::text[]),
  ('MQ-c96f2b-14-0', 'c96f2b', 13, '14', '14. The area of the triangle formed by the lines $$y = x, x = 6$$ and $$y = 0$$ is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['36 sq. units', '18 sq. units', '9 sq. units', '72 sq. units .']::text[]),
  ('MQ-c96f2b-15-0', 'c96f2b', 14, '15', '15. If $$\cos \theta = \frac{4}{5}$$ , then $$24 \tan^2\theta - 17$$ is equal to', 1, 'Trigonometry', 'MCQ', 3, NULL, array['$$\frac{7}{2}$$', '$$\frac{-7}{2}$$', '$$\frac{27}{2}$$', 'None of these.']::text[]),
  ('MQ-c96f2b-16-0', 'c96f2b', 15, '16', '16. Area of a sector of a circle is $$\frac{1}{6}$$ to the area of the circle. The degree measure of its minor arc is', 1, 'Mensuration', 'MCQ', 3, NULL, array['$$90^{\circ}$$', '$$60^{\circ}$$', '$$45^{\circ}$$', '$$30^{\circ}$$ .']::text[]),
  ('MQ-c96f2b-17-0', 'c96f2b', 16, '17', '17. The ratio of LCM and HCF of the least odd composite number and the least prime number is', 1, NULL, 'MCQ', 3, NULL, array['2 : 1', '1 : 2', '18 : 1', 'None of these .']::text[]),
  ('MQ-c96f2b-18-0', 'c96f2b', 17, '18', '18. The ratio in which the $$x$$ -axis divides the line segment joining $$A(3, -4)$$ and $$B(-2, 7)$$ is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['3 : 2', '2 : 3', '4 : 7', '7 : 4.']::text[]),
  ('MQ-c96f2b-19-0', 'c96f2b', 18, '19', '19. Assertion (A) : Point $$P(0,2)$$ is the point of intersection of $$y$$ -axis with the line $$3x + 2y = 4$$. Reason (R) : The distance of the point $$P(0,2)$$ from $$x$$-axis is 2 units.', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-c96f2b-20-0', 'c96f2b', 19, '20', '20. Assertion (A) : If both zeros of the quadratic polynomial $$x^2 - 2kx + 2$$ are equal in magnitude but opposite in sign, then value of ''$$k$$'' is $$\frac{1}{2}$$.

Reason (R) : Sum of zeros of a quadratic polynomial $$ax^2 + bx + c$$ is $$\frac{-b}{a}$$ .', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-c96f2b-21-0', 'c96f2b', 20, '21', '21. Find the value of ''$$k$$'' for which the system of equations

$$2x = -ky + 1, -7y = 5 - 5x$$

has a unique solution.', 2, NULL, 'short', 3, NULL, NULL),
  ('MQ-c96f2b-22-0', 'c96f2b', 21, '22', '22. In the given figure, AB is diameter of a circle centred at O. BC is tangent to the circle at B. If OP bisects the chord AD and $\angle AOP = 60^{\circ}$, then find measure of $\angle C$.', 2, 'Circles', 'short', 4, 'c96f2b__Delhi_Publ_p4_img_0_jpeg.webp', NULL),
  ('MQ-c96f2b-23-0', 'c96f2b', 22, '23', '23. Show that $(12)^n$ can never end with the digit 0 or 5 for any natural number $n''$.', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-c96f2b-23-1', 'c96f2b', 23, '23', 'Three pieces of timber 42 m, 49 m and 63 m long have to be divided into planks of the same length. What is the greatest possible length of each plank? How many planks are formed?', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-c96f2b-24-0', 'c96f2b', 24, '24', '24. The line segment joining the points \( A(3,2) \) and \( B(5,1) \) is divided at the point \( P \) in the ratio \( 1:2 \) and it lies on the line \( 3x - 18y + k = 0 \). Find the value of \( k'' \).', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-25-0', 'c96f2b', 25, '25', '25. The length of the minute hand of a clock is \(14\mathrm{cm}\). Find the area swept by the minute hand in 25 minutes.', 2, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-25-1', 'c96f2b', 26, '25', 'Area of a sector of a circle of radius 36 cm is $54\pi \, cm^2$. Find the length of the corresponding arc of the sector.', 2, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-26-0', 'c96f2b', 27, '26', '26. If \(\cos (A + B) = 0\) and \(\cot (A - B) = \sqrt{3}\), then find the value of \(\cos A\cos B - \sin A\sin B\).', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-27-0', 'c96f2b', 28, '27', '27. If \(\alpha\) and \(\beta\) are zeros of a polynomial \((6x^{2} - 5x + 1)\), then form a quadratic polynomial whose zeros are \(\alpha^{2}\) and \(\beta^{2}\).', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-28-0', 'c96f2b', 29, '28', '28. Prove that

$$
\frac{\tan \theta}{1 - \cot \theta} + \frac{\cot \theta}{1 - \tan \theta} = 1 + \sec \theta \, \text{cosec } \theta.
$$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-28-1', 'c96f2b', 30, '28', 'Prove that

$$
\frac{\tan \theta + \sec \theta - 1}{\tan \theta - \sec \theta + 1} = \frac{1 + \sin \theta}{\cos \theta}.
$$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-29-0', 'c96f2b', 31, '29', '29. Prove that \((4 - 5\sqrt{3})\) is irrational, given that \(\sqrt{3}\) is an irrational number.', 3, NULL, 'short', 4, NULL, NULL),
  ('MQ-c96f2b-30-0', 'c96f2b', 32, '30', '30. Find the median of the following frequency distribution :

| Weekly wages (in Rupees) | 60 – 69 | 70 – 79 | 80 – 89 | 90 – 99 | 100 – 109 | 110 – 119 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of days | 5 | 15 | 20 | 30 | 20 | 8 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-c96f2b-31-0', 'c96f2b', 33, '31', '31. If a circle is touching the side BC of $\Delta ABC$ at P and is touching AB and AC produced at Q and R respectively.

Prove that $AQ = \frac{1}{2}$ (perimeter of $\Delta ABC$).', 3, 'Circles', 'short', 5, 'c96f2b__Delhi_Publ_p5_img_0_jpeg.webp', NULL),
  ('MQ-c96f2b-32-0', 'c96f2b', 34, '32', '32. 8 men and 12 boys can finish a piece of work in 5 days, while 6 men and 8 boys can finish it in 7 days. Find the time taken by 1 man alone and that by 1 boy alone to finish the work.', 5, NULL, 'long', 5, NULL, NULL),
  ('MQ-c96f2b-32-1', 'c96f2b', 35, '32', 'Solve the following pair of linear equations by reducing them to a pair of linear equations:

$$
\frac{10}{(2x + 3y)} + \frac{15}{(3x - 2y)} = 17
$$

$$
\frac{5}{2x + 3y} + \frac{1}{3x - 2y} = 2, \text{ where } 2x + 3y \neq 0 \text{ and } 3x - 2y \neq 0.
$$', 5, NULL, 'long', 5, NULL, NULL),
  ('MQ-c96f2b-33-0', 'c96f2b', 36, '33', '33. A card is drawn at random from a well-shuffled deck of 52 playing cards. Find the probability that the card drawn is

(a) a black face card
(b) an ace
(c) a red 8
(d) neither a red card nor a queen
(e) a card of spades or an ace.', 5, 'Probability', 'long', 5, NULL, NULL),
  ('MQ-c96f2b-34-0', 'c96f2b', 37, '34', '34. The mean of the following data is 42. Find the missing frequencies ‘$x$’ and ‘$y$’ if the sum of the frequencies is 100.

| Class interval | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 7 | 10 | $x$ | 13 | $y$ | 10 | 14 | 9 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-c96f2b-34-1', 'c96f2b', 38, '34', '100 surnames were randomly picked up from a local telephone directory and the frequency distribution of the number of letters in the English alphabets in the surnames was obtained as follows:

| Number of letters | 1 – 4 | 4 – 7 | 7 – 10 | 10 – 13 | 13 – 16 | 16 – 19 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of surnames | 6 | 30 | 40 | 16 | 4 | 4 |

Find the mean number of letters in the surnames. Determine the modal size of the surnames.', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-c96f2b-35-0', 'c96f2b', 39, '35', '35. In a \( \Delta ABC, P \) and Q are points on AB and AC respectively such that \( PQ \parallel BC \) . Prove that the median AD, drawn from A to BC, bisects PQ.', 5, 'Similarity', 'long', 6, 'c96f2b__Delhi_Publ_p6_img_0_jpeg.webp', NULL),
  ('MQ-c96f2b-36-0', 'c96f2b', 40, '36', '## 36. WATER PARK

A water park is an amusement park that features water play areas such as swimming pools, water slides, water playgrounds as well as areas for floating, bathing etc. A group of class X students goes to waterpark.

Four students Arnav(A), Bani(B), Chandan(C) and Dhiraj(D) go for a water slide. Their respective position in the water slide at an instant is given below.

Based on the above information, answer the following questions:

(i) If E is the mid-point of AD, then what are the coordinates of E? 1
(ii) If D slides to M, then find the distance covered by D. 1
(iii) If there is emergency switch at N such that AN : DN = 3: 2, then what will be the coordinates of N? 2', 4, 'Coordinate Geometry', 'long', 6, 'c96f2b__Delhi_Publ_p6_img_2_jpeg.webp', NULL),
  ('MQ-c96f2b-37-0', 'c96f2b', 41, '37', '37. One evening, Rahul was in a park. Children were playing cricket. Birds were singing nearby tree of height 80 m. He observed a bird on the tree at an angle of elevation of \( 45^{\circ} \) . When a sixer was hit, a ball flew through the tree frightening the bird to fly away. In 2 seconds,

he observed the bird flying at the same height at an angle of elevation of $30^{\circ}$ and the ball flying towards him at the same height at an angle of elevation of $60^{\circ}$.

Based on the above data, answer the following questions :

(i) At what distance from the foot of the tree was he observing the bird sitting on the tree? 1
(ii) How far did the bird fly in the mentioned time? 2
(iii) What was the speed of the bird? 1', 4, 'Trigonometry', 'long', 6, 'c96f2b__Delhi_Publ_p7_img_0_jpeg.webp', NULL),
  ('MQ-c96f2b-38-0', 'c96f2b', 42, '38', '38. Makar Sankranti is a fun and delightful occasion. Like many other festivals, the kite flying competition also has a historical and cultural significance attached to it. The following figure shows a kite in which BCD is the shape of quadrant of a circle of radius $42\mathrm{cm}$, ABCD is square and $\Delta$CEF is an isosceles right-angled triangle whose equal sides are $7\mathrm{cm}$ long.

Based on the above information, answer the following questions:

(i) Find the area of the square ABCD. 1
(ii) What is the area of the quadrant BCD? 1
(iii) Find the area of the shaded portion. 2', 4, 'Mensuration', 'long', 7, 'c96f2b__Delhi_Publ_p7_img_1_jpeg.webp', NULL),
  ('MQ-7250a2-1-0', '7250a2', 0, '1', '| 1. | If the equation $$x^2 + 2(k + 2)x + 9k = 0$$ has equal roots then $$k = ?$$ a. 1 or 4 b. -1 or 4 c. 1 or -4 d. -1 or -4 | 1 |', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-7250a2-2-0', '7250a2', 1, '2', '| 2. | The value of k for which the system of equations $$x + 2y = 3$$ and $$5x + ky + 7 = 0$$ is inconsistent, is a. -10 b. 10 c. -5 d. 5 | 1 |', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-7250a2-3-0', '7250a2', 2, '3', '| 3. | Which of the following statements is not true? a. If a point P lies inside a circle, no tangent can be drawn to the circle, passing through P. b. If a point P lies on the circle, then one and only one tangent can be drawn to the circle at P. c. If a point P lies outside the circle, then only two tangents can be drawn to the circle from P. d. A circle can have more than two parallel tangents, parallel to a given line. | 1 |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-7250a2-4-0', '7250a2', 3, '4', '| 4. | In an A.P., if $$a = 8$$ and $$a_{20} = -49$$, then value of $$d$$ is: a. 3 b. $$-\frac{11}{9}$$ c. $$-\frac{27}{10}$$ d. -3 | 1 |', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-7250a2-5-0', '7250a2', 4, '5', '| 5. | The ratio between the volumes of two spheres is 8 : 27. what is the ratio between their surface areas ? a. 2 : 3 b. 4 : 5 c. 5 : 6 d. 4 : 9 | 1 |', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-7250a2-6-0', '7250a2', 5, '6', '| 6. | If $$\text{cosec } \theta + \cot \theta = m$$, then $$\cot \theta$$ is a. $$\frac{m^2+1}{2m}$$ b. $$\frac{m^2-1}{2m}$$ c. $$\frac{m^2-1}{m^2+1}$$ d. $$\frac{m^2+1}{m^2-1}$$ | 1 |', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-7250a2-7-0', '7250a2', 6, '7', '| 7. | In the given figure, $$O$$ is the centre of the circle. $$AB$$ is the tangent to the circle at the point $$P$$. If $$\angle PAO = 30^\circ$$ then $$\angle CPB + \angle ACP$$ is equal to | 1 |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-7250a2-8-0', '7250a2', 7, '8', '| 8. | If one zero of the quadratic polynomial (k - 1)x² + kx + 1 is -4 then the value of k is a. -5/4 b. 5/4 c. -4/3 d. 4/3 | | | | | | 1 |', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-7250a2-9-0', '7250a2', 8, '9', '| 9. | Consider the following frequency distribution: | | | | | | 1 |
| | Class | 0-5 | 6-11 | 12-17 | 18-23 | 24-29 | |
| | Frequency | 13 | 10 | 15 | 8 | 11 | |
| The upper limit of the median class is: a. 7 b. 17.5 c. 18 d. 18.5 | | | | | | | |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-7250a2-10-0', '7250a2', 9, '10', '| 10. | The chord of a circle of radius x cm subtends a right angle at its centre. The length of the chord is 10√2 cm. find the value of x (in cm) a. 10/√2 b. 5√2 c. 10 d. 10√3 | | | | | | 1 |', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-7250a2-11-0', '7250a2', 10, '11', '| 11. | The roots of the equation x² - px + q = 0 are consecutive integers. Find the discriminate of the equation. a. -1 b. 0 c. 1 d. None of these | | | | | | 1 |', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-7250a2-12-0', '7250a2', 11, '12', '| 12. | If x = psec θ and y = qtan θ, then a. x² - y² = p²q² b. x²q² - y²p² = pq c. x²q² - y²p² = 1/p²q² d. x²q² - y²p² = p²q² | | | | | | 1 |', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-7250a2-13-0', '7250a2', 12, '13', '| 13. | A solid sphere of radius x cm is melted and cast into a shape of a solid cone of radius x cm. The height of the cone is: a. 3x cm b. x cm c. 4x cm d. 2x cm | | | | | | 1 |', 1, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-7250a2-14-0', '7250a2', 13, '14', '| 14. | If one cards are drawn from a pack of 52, then the probability that the card is red or jack. a. 4/7 b. 4/17 c. 3/17 d. 7/13 | | | | | | 1 |', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-7250a2-15-0', '7250a2', 14, '15', '| 15. | Three points (0,0), (3,√3), (3,λ) from an equilateral triangle, then λ is equal to a. 2 b. -3 c. -4 d. -√3 | | | | | | 1 |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-7250a2-16-0', '7250a2', 15, '16', '| 16. | For the whole numbers, n, n + 1, n + 2, n + 4 and n + 8, the mean is 3, then n is equal to a. 0 b. 1 c. 3 d. 2 | | | | | | 1 |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-7250a2-17-0', '7250a2', 16, '17', '| 17. | If the line 2x + y = k passes through the point which divides the line segment joining the points (1,1) and (2,4) in the ratio 3: 2, then k equals: a. 29/5 b. 5 c. 6 d. 11/5 | | | | | | 1 |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-7250a2-18-0', '7250a2', 17, '18', '| 18. | In a ODI cricket match, probability of loosing the game is 1/4. What is the probability of winning the game? a. 3/4 b. 1/2 c. 1/4 d. 1/8 | | | | | | 1 |', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-7250a2-19-0', '7250a2', 18, '19', '| 19. | DIRECTION : In the question number 19 and 20 , a statement (A) is followed by a statement (R). Choose the correct option. Statement A (Assertion) : The HCF of two numbers is 5 and their product is 150, then their LCM is 30. Statement R (Reason) : For any two positive integers a and b, HCF (a, b) + LCM (a, b) = a × b. a) Both assertion (A) and reason ( R) are true and reason ( R) is the correct explanation of assertion (A) b) Both assertion (A) and reason ( R) are true and reason ( R) is not the correct explanation of assertion (A) c) Assertion (A) is true but reason (R) is false. d) Assertion (A) is false but reason ( R) is true. | 1 |', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-7250a2-21-0', '7250a2', 19, '21', '| 21. | Two numbers are in the ratio 2 : 3 and their LCM is 180. What is the HCF of these numbers? OR Find the greatest six-digit number which is exactly divisible by 18, 24 and 36. | 2 |', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-7250a2-22-0', '7250a2', 20, '22', '| 22. | Two different dice are thrown together. Find the probability that the numbers obtained have (i) even sum and (ii) even product. OR A bag contains 5 red balls and x green balls. (i) If one ball is drawn at random from the bag, what is the probability that it is green? (ii) If two green balls are taken out of the bag, the probability of drawing a green ball now will be 6/7 times the probability of drawing a green ball in the first case. Find the value of x. | 2 |', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-7250a2-23-0', '7250a2', 21, '23', '| 23. | Find an acute angle θ when $$\frac{\cos \theta - \sin \theta}{\cos \theta + \sin \theta} = \frac{1 - \sqrt{3}}{1 + \sqrt{3}}$$. | 2 |', 2, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-7250a2-24-0', '7250a2', 22, '24', '| 24. | A line intersects Y-axis and X-axis at point P and Q, respectively. If R(2, 5) is the mid-point of line segment PQ, then find the coordinates of P and Q. | 2 |', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-7250a2-25-0', '7250a2', 23, '25', '| 25. | Find a relation between x and y such that the point (x, y) is equidistant from the points (7, 1) and (3, 5). | 2 |', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-7250a2-26-0', '7250a2', 24, '26', '| 26. | In the given figure, A, B and C are points on OP, OQ and OR respectively such that AB ∥ PQ and AC ∥ PR. Show that BC ∥ QR. OR If AD and PM are medians of ΔABC and ΔPQR respectively, where ΔABC ~ ΔPQR ; prove that $$\frac{AB}{PQ} = \frac{AD}{PM}$$ . | 3 |', 3, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-7250a2-27-0', '7250a2', 25, '27', '| 27. | A man buys a number of pens for Rs. 180. If he had bought 3 more pens for the same amount, each pen would have cost him Rs. 3 less. How many pens did he buy? | 3 |', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-7250a2-28-0', '7250a2', 26, '28', '| 28. | If α and β are the zeros of the quadratic polynomial $$f(x) = 2x^2 - 4x + 1$$, find a polynomial whose zeros are (α + 2β) and (2α + β). | 3 |', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-7250a2-29-0', '7250a2', 27, '29', '| 29. | Prove that: $$\frac{\sec \theta - \tan \theta}{\sec \theta + \tan \theta} = 1 - 2 \sec \theta \tan \theta + 2 \tan^2 \theta$$. | 3 |', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-7250a2-30-0', '7250a2', 28, '30', '| 30. | The short and long hands of a clock are 6 cm and 8 cm respectively. Find the sum of distances travelled by their tips in 2 days. [ Take π = 3.14 ] OR In the given figure, OABC is a square of side 7 cm. If OAPC is a quadrant of a circle with centre O, find the area of the shaded region. C B O A | 3 |', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-7250a2-31-0', '7250a2', 29, '31', '| 31. | Prove that $$\sqrt{13}$$ is an irrational number. | 3 |', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-7250a2-32-0', '7250a2', 30, '32', '| 32. | Solve the following system of linear equations graphically: | 5 |

| | x - y = 1 2x + y = 8 Shade the area bounded by these two lines and y-axis. Also determine this area. OR Points A and B are 90 km apart from each other on a highway. A car starts from A and another from B at the same time. If they go in the same direction they meet in 9 hours and if they go in opposite directions they meet in 9/7 hours. Find their speeds. | | | | | | | | |', 5, NULL, 'long', 5, NULL, NULL),
  ('MQ-7250a2-32-1', '7250a2', 31, '32', '| | x - y = 1 2x + y = 8 Shade the area bounded by these two lines and y-axis. Also determine this area. OR Points A and B are 90 km apart from each other on a highway. A car starts from A and another from B at the same time. If they go in the same direction they meet in 9 hours and if they go in opposite directions they meet in 9/7 hours. Find their speeds. | | | | | | | | |', 5, NULL, 'long', 6, NULL, NULL),
  ('MQ-7250a2-33-0', '7250a2', 32, '33', '| 33. | a) Prove that the lengths of tangents drawn from an external point to a circle are equal. b) Using the above result, find the perimeter of Δ APQ if AB, AC, PQ are tangents and AB = 5 cm. (for the given figure) A P X Q B C | | | | | | | | 5 |', 5, 'Circles', 'long', 6, NULL, NULL),
  ('MQ-7250a2-34-0', '7250a2', 33, '34', '| 34. | A 1.2 m tall girl spots a balloon moving with the wind in a horizontal line at a height of 88.2 m from the ground. The angle of elevation of the balloon from the eyes of the girl at any instant is 60°. After some time, the angle of elevation reduces to 30°. Find the distance travelled by the balloon during the interval. | | | | | | | | 5 |', 5, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-7250a2-35-0', '7250a2', 34, '35', '| 35. | The distribution given below shows the number of wickets taken by bowlers in one-day cricket matches. Find the mean and the median of the number of wickets taken. | | | | | | | | 5 |
| | No. of wickets | 20 – 60 | 60 – 100 | 100 – 140 | 140 – 180 | 180 – 220 | 220 – 260 | | |
| | No. of bowlers | 7 | 5 | 16 | 12 | 2 | 3 | | |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-7250a2-35-1', '7250a2', 35, '35', '| | OR If the median of the distribution given below is 28.5, find the values of x and y. | | | | | | | | |
| | Class Interval | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | Total | |
| | Frequency | 5 | x | 20 | 15 | Y | 5 | 60 | |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-7250a2-36-0', '7250a2', 36, '36', '| 36. | An interior designer, Sana hired two painters, Manan and Bhima to make paintings for her buildings. Both painters were asked to make 50 different paintings each. The prices quoted by both the painters are given below : a) Manan asked for Rs.6000 for the first painting , and an increment of Rs.200 for each following painting. b) Bhima asked for Rs.4000 for the first painting and an increment of Rs.400 | | | | | | | | |

| | for each following painting. | |
| --- | --- | --- |
| | (i) How much money did Manan get for his 25^{th} painting ? | 1 |
| | (ii) How much money did Bhima get in all? | 1 |
| | (iii)(A) If Manan and Bhima make paintings at the same pace, find the first painting for which Bhima will get more money than Manan. OR (iii)(B) Sana’s friend , Aarti hired Manan and Bhima to make paintings for her at the same rates as for Sana. Aarti had both painters make the same number of paintings and paid them the exact same amount in total.How many paintings did Aarti get each painter to make? | 2 |', 4, 'Arithmetic Progression', 'long', 6, NULL, NULL),
  ('MQ-7250a2-37-0', '7250a2', 37, '37', '| 37. | The triangle proportionality theorem or basic proportionality theorem is a geometric law stated by Greek mathematician Thales . It states a line drawn parallel to one side of a triangle , it will intersect the other two sides of the triangle and divide them proportionally. Rohit drew a triangle PQR , where ST || QR and $$\frac{PS}{SQ} = \frac{3}{5}$$ and PR = 28 cm. | |
| | (i) What is the length of PT? | 1 |
| | (ii) What is the length of TR? | 1 |
| | (iii)(A) If QR = 32 cm , then find ST. OR (iii)(B) Find the ratio of perimeter of ΔPST to perimeter of ΔPQR | 2 |', 4, 'Similarity', 'long', 7, NULL, NULL),
  ('MQ-7250a2-38-0', '7250a2', 38, '38', '| 38. | The great Stupa at Sanchi is one of the oldest stone structures in India , and an important monument of Indian Architecture. It was originally commissioned by the emperor Ashoka in 3^{rd} century BC.Its nucleus was a simple hemispherical brick structure built over the relics of the Buddha.It is a perfect example of combination of solid figures. A big hemispherical dome with a cuboidal structure mounted on it. | |

| | ![img-0.jpeg](img-0.jpeg)![img-1.jpeg](img-1.jpeg) | |
| --- | --- | --- |
| | (i) Find the volume of the hemispherical dome if the height of the dome is 21 m | 1 |
| | (ii) Find the volume of air occupied in the cuboidal shaped top with dimensions 8 m x 6 m x 4 m. | 1 |
| | (iii)(A) Calculate the total surface area of the combined figure that is the hemispherical dome with radius 21 m and cuboidal shaped top with dimensions 8 m x 6 m x 4m .OR(iii)(B) find the cost of covering the hemispherical dome with a cloth piece if the cost per sq.m is Rs 2.5 . | 2 |', 4, 'Mensuration', 'long', 7, '7250a2__Delhi_Publ_p8_img_0_jpeg.webp', NULL),
  ('MQ-bd6cba-1-0', 'bd6cba', 0, '1', '| **1.** | The value of k for which the system of equations 2x + 3y - 5 = 0 and 4x + ky - 10 = 0 has an infinite number of solutions, is a. 6 b. -6 c. 5 d. -5 | **1** |', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-bd6cba-2-0', 'bd6cba', 1, '2', '| **2.** | If the equation x^{2} + 2(k + 2)x + 9k = 0 has equal roots then k =? a. 1 or 4 b. -1 or 4 c. 1 or -4 d. -1 or -4 | **1** |', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-3-0', 'bd6cba', 2, '3', '| **3.** | In an A.P., if a = 8 and a_{10} = -19, then value of d is: a. 3 b. -11/9 c. -27/10 d. -3 | **1** |', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-4-0', 'bd6cba', 3, '4', '| **4.** | Which of the following statements is not true? a. If a point P lies inside a circle, no tangent can be drawn to the circle, passing through P. b. If a point P lies on the circle, then one and only one tangent can be drawn to the circle at P. c. If a point P lies outside the circle, then only two tangents can be drawn to the circle from P. d. A circle can have more than two parallel tangents, parallel to a given line. | **1** |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-5-0', 'bd6cba', 4, '5', '| **5.** | If sec θ + tan θ = p, then tan θ is a. (p^{2}+1)/(2p) b. (p^{2}-1)/(2p) c. (p^{2}-1)/(p^{2}+1) d. (p^{2}+1)/(p^{2}-1) | **1** |', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-6-0', 'bd6cba', 5, '6', '| **6.** | The ratio between the volumes of two spheres is 8 : 27. what is the ratio between their surface areas? a. 2 : 3 b. 4 : 5 c. 5 : 6 d. 4 : 9 | **1** |', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-7-0', 'bd6cba', 6, '7', '| **7.** | If -2 and 3 are the zeros of the quadratic polynomial x^{2} + (a + 1)x + b then a. a = -2, b = 6 b. a = -2, b = -6 c. a = 2, b = -6 d. a = 2, b = 6 | **1** |', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-8-0', 'bd6cba', 7, '8', '| **8.** | In the given figure, O is the centre of the circle. AB is the tangent to the circle at the point P. If ∠PAO = 30° then ∠CPB + ∠ACP is equal to | **1** |

| | a. 60° b. 90° c. 120° d. 150° | | | | | | |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-bd6cba-9-0', 'bd6cba', 8, '9', '| 9. | The chord of a circle of radius 10 cm subtends a right angle at its centre. The length of the chord (in cm) is a. $$\frac{5}{\sqrt{2}}$$ b. $$5\sqrt{2}$$ c. $$10\sqrt{2}$$ d. $$10\sqrt{3}$$ | | | | | | 1 |', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-10-0', 'bd6cba', 9, '10', '| 10. | Consider the following frequency distribution: | | | | | | 1 |
| | Class | 0-5 | 6-11 | 12-17 | 18-23 | 24-29 | |
| | Frequency | 13 | 10 | 15 | 8 | 11 | |
| The upper limit of the median class is: a. 7 b. 17.5 c. 18 d. 18.5 | | | | | | | |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-11-0', 'bd6cba', 10, '11', '| 11. | The value of $$\frac{2\tan 30^\circ}{1+\tan^2 30^\circ}$$ is equal to a. sin 60° b. cos 60° c. tan 60° d. cot 60° | | | | | | 1 |', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-12-0', 'bd6cba', 11, '12', '| 12. | The roots of the equation $$x^2 - px + q = 0$$ are consecutive integers. Find the discriminate of the equation. a. -1 b. 0 c. 1 d. None of these | | | | | | 1 |', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-13-0', 'bd6cba', 12, '13', '| 13. | A bag has 5 white marbles, 8 red marbles and 4 purple marbles. If we take a marble randomly, then the probability of not getting purple marble is a. 0.5 b. 0.66 c. 0.08 d. 0.77 | | | | | | 1 |', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-14-0', 'bd6cba', 13, '14', '| 14. | A solid sphere of radius x cm is melted and cast into a shape of a solid cone of radius x cm. The height of the cone is: a. 3x cm b. x cm c. 4x cm d. 2x cm | | | | | | 1 |', 1, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-15-0', 'bd6cba', 14, '15', '| 15. | In a moderately symmetrical distribution the mode and median are 75 and 60 respectively, the mean is a. 45.50 b. 45.83 c. 52.5 d. 52.86 | | | | | | 1 |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-16-0', 'bd6cba', 15, '16', '| 16. | Three points (0,0), (3, $$\sqrt{3}$$), (3, $$\lambda$$) from an equilateral triangle, then $$\lambda$$ is equal to | | | | | | 1 |

| | a. 2 b. -3 c. -4 d. $-\sqrt{3}$ | |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-bd6cba-17-0', 'bd6cba', 16, '17', '| 17. | If $P(E) = 0.05$. then the probability of ''not E'' is a. 1.05 b. 0.05 c. 0.95 d. 0.85 | 1 |', 1, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-bd6cba-18-0', 'bd6cba', 17, '18', '| 18. | If the line $2x + y = k$ passes through the point which divides the line segment joining the points (1,1) and (2,4) in the ratio 3: 2, then $k$ equals: a. $\frac{29}{5}$ b. 5 c. 6 d. $\frac{11}{5}$ | 1 |', 1, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-bd6cba-19-0', 'bd6cba', 18, '19', '| 19. | **DIRECTION :** In the question number 19 and 20 , a statement (A) is followed by a statement (R). Choose the correct option. **Statement A (Assertion) :** If the circumference of a circle is reduced by 50% then the area will be reduced by75%. **Statement R (Reason) :** Circumference of a circle = $\pi d$ and area = $\frac{\pi d^2}{2}$,d= diameter. a) Both assertion (A) and reason ( R) are true and reason ( R) is the correct explanation of assertion (A) b) Both assertion (A) and reason ( R) are true and reason ( R) is not the correct explanation of assertion (A) c) Assertion (A) is true but reason (R) is false. d) Assertion (A) is false but reason ( R) is true. | 1 |', 1, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-bd6cba-20-0', 'bd6cba', 19, '20', '| 20. | **Statement A (Assertion) :** The HCF of two numbers is 5 and their product is 150, then their LCM is 30. **Statement R (Reason) :** For any two positive integers a and b, HCF (a, b) + LCM (a, b) = a × b. a) Both assertion (A) and reason ( R) are true and reason ( R) is the correct explanation of assertion (A) b) Both assertion (A) and reason ( R) are true and reason ( R) is not the correct explanation of assertion (A) c) Assertion (A) is true but reason (R) is false. d) Assertion (A) is false but reason ( R) is true. | 1 |', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-bd6cba-21-0', 'bd6cba', 20, '21', '| 21. | An integer is chosen between 70 and 100. Find the probability that it is (i) a prime number and | 2 |', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-bd6cba-28-0', 'bd6cba', 21, '28', '| 28. | If $\alpha$ and $\beta$ are the zeros of the quadratic polynomial $f(x) = 4x^2 - 5x - 1$, find a polynomial whose zeros are $\frac{2\alpha}{\beta}$ and $\frac{2\beta}{\alpha}$. | 3 |', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-bd6cba-30-0', 'bd6cba', 22, '30', '| 30. | (A) The diameters of the front and rear wheels of a tractor are 80 cm and 2 m respectively. Find the number of revolutions that a rear wheel makes to cover the distance which the front wheel covers in 800 revolutions. | 3 |', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-bd6cba-30-1', 'bd6cba', 23, '30', '| | (B) In the given figure, OABC is a quadrant of a circle with centre O and radius 3.5 cm. If OD = 2 cm, find the area of the shaded region. | |', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-bd6cba-31-0', 'bd6cba', 24, '31', '| 31. | Prove that $\sqrt{13}$ is an irrational number. | 3 |', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-bd6cba-32-0', 'bd6cba', 25, '32', '| 32. | Draw the graphs of the equation $x - y + 1 = 0$ and $3x + 2y - 12 = 0$. Determine the coordinates of the vertices of the triangle formed by these lines and the x-axis, and shade the triangular region. | 5 |', 5, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-bd6cba-32-1', 'bd6cba', 26, '32', '| | Two men start from two points P and Q, 8 km apart and walk towards each other. They meet in 80 minutes. If they walk in the same direction, they meet | |

| | in 2 hours. Find their speeds. | |', 5, NULL, 'long', 6, NULL, NULL),
  ('MQ-bd6cba-33-0', 'bd6cba', 27, '33', '| 33. | a) Prove that the lengths of tangents drawn from an external point to a circle are equal. b) Using the above result, find the perimeter of Δ APQ if AB, AC, PQ are tangents and AB = 5 cm. (for the given figure) | 5 |', 5, 'Circles', 'long', 7, NULL, NULL),
  ('MQ-bd6cba-34-0', 'bd6cba', 28, '34', '| 34. | The angle of elevation of a jet fighter from a point A on the ground is 60°. After a flight of 15 seconds, the angle of elevation changes to 30°. If the jet is flying at a speed of 720 km/hr, find the constant height at which the jet is flying. (use √3 = 1.73). | 5 |', 5, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-bd6cba-35-1', 'bd6cba', 29, '35', '| | If the median of the distribution given below is 28.5, find the values of x and y. | |
| Class Interval | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | Total |
| Frequency | 5 | x | 20 | 15 | y | 5 | 60 |', 5, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-bd6cba-36-0', 'bd6cba', 30, '36', '| 36. | A health camp was organized in a school for all the students and staff to spread awareness about health check up and maintaining a healthy life. In one such health camp, it is found that the heights of a group of students in a section of class X form an Arithmetic progression. The height of the shortest student is 140 cm and the common difference is 4 cm. | |
| | i) What is the height of the 10^{th} student of the class? | 1 |', 1, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-bd6cba-36-1', 'bd6cba', 31, '36', '| 36. | A health camp was organized in a school for all the students and staff to spread awareness about health check up and maintaining a healthy life. In one such health camp, it is found that the heights of a group of students in a section of class X form an Arithmetic progression. The height of the shortest student is 140 cm and the common difference is 4 cm. | |
| | ii) If the height of the tallest student in the class is 224 cm, find the total number of students present. | 1 |', 1, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-bd6cba-36-2', 'bd6cba', 32, '36', '| 36. | A health camp was organized in a school for all the students and staff to spread awareness about health check up and maintaining a healthy life. In one such health camp, it is found that the heights of a group of students in a section of class X form an Arithmetic progression. The height of the shortest student is 140 cm and the common difference is 4 cm. | |
| | iii) (A) Find the mean height of the class OR iii)(B) Find the number of students in the class have a height greater than 180 cm | 2 |', 2, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-bd6cba-37-0', 'bd6cba', 33, '37', '| 37. | The triangle proportionality theorem or basic proportionality theorem is a geometric law stated by Greek mathematician Thales. It states a line drawn parallel to one side of a triangle, it will intersect the other two sides of the triangle and divide them proportionally. Rohit drew a triangle PQR, where ST ∥ QR and $$\frac{PS}{SQ} = \frac{3}{5}$$ and PR = 28 cm. i) What is the length of PT? | 1 |', 1, 'Similarity', 'short', 8, NULL, NULL),
  ('MQ-bd6cba-37-1', 'bd6cba', 34, '37', '| 37. | The triangle proportionality theorem or basic proportionality theorem is a geometric law stated by Greek mathematician Thales. It states a line drawn parallel to one side of a triangle, it will intersect the other two sides of the triangle and divide them proportionally. Rohit drew a triangle PQR, where ST ∥ QR and $$\frac{PS}{SQ} = \frac{3}{5}$$ and PR = 28 cm. i) What is the length of PT? | 1 |
| | ii) What is the length of TR? | 1 |', 1, 'Similarity', 'short', 8, NULL, NULL),
  ('MQ-bd6cba-37-2', 'bd6cba', 35, '37', '| 37. | The triangle proportionality theorem or basic proportionality theorem is a geometric law stated by Greek mathematician Thales. It states a line drawn parallel to one side of a triangle, it will intersect the other two sides of the triangle and divide them proportionally. Rohit drew a triangle PQR, where ST ∥ QR and $$\frac{PS}{SQ} = \frac{3}{5}$$ and PR = 28 cm. i) What is the length of PT? | 1 |
| | (iii)(A) If QR = 32 cm, then find ST. OR (iii)(B) Find the ratio of perimeter of ΔPST to perimeter of ΔPQR | 2 |', 2, 'Similarity', 'short', 8, NULL, NULL),
  ('MQ-bd6cba-38-0', 'bd6cba', 36, '38', '| 38. | In a toy manufacturing company, wooden parts are assembled and painted to prepare a toy. One specific toy is in the shape of a cone mounted on a cylinder. For the wood processing activity centre, the wood is taken out of storage to be sawed, after which it undergoes rough polishing, then is cut, drilled and has holes punched in it and then it is fine polished using sandpaper. For the retail packaging and delivery activity centre, the polished wood sub-parts are assembled together, then decorated using paint. The total height of the toy is 26 cm and the height of its conical part is 6 cm. The diameters of the base of the conical part is 5 cm and that of the cylindrical part is 4 cm. [ Use π = 3.14] | |

| | ![img-0.jpeg](img-0.jpeg) | |
| | i) If its cylindrical part is to be painted yellow, find the surface area need to be painted. | 1 |', 1, 'Mensuration', 'short', 8, 'bd6cba__Delhi_Publ_p9_img_0_jpeg.webp', NULL),
  ('MQ-f7fc2d-1-0', 'f7fc2d', 0, '1', '| 1. | If the equation \( 4x^{2} - 3kx + 1 = 0 \) has equal roots then \( k = ? \)a. \( \pm \frac{4}{3} \) b. \( \pm \frac{1}{3} \) c. \( \pm \frac{3}{4} \) d. \( \pm \frac{2}{3} \) | 1 |', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-2-0', 'f7fc2d', 1, '2', '| 2. | The value of k for which the system of equations \( 2x + 3y - 5 = 0 \) and \( 4x + ky - 10 = 0 \) has an infinite number of solutions, isa. 6 b. -6 c. 5 d. -5 | 1 |', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-3-0', 'f7fc2d', 2, '3', '| 3. | Which of the following statements is not true?a. A tangent to a circle intersects the circle exactly at one point.b. The point common to the circle and its tangent is called the point of contact.c. The tangent at any point of a circle is perpendicular to the radius of the circle through the point of contact.d. A straight line can meet a circle at one point only. | 1 |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-4-0', 'f7fc2d', 3, '4', '| 4. | In an A.P., if \( a = 8 \) and \( a_{10} = -19 \), then value of \( d \) is:a. 3 b. \( -\frac{11}{9} \) c. \( -\frac{27}{10} \) d. -3 | 1 |', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-5-0', 'f7fc2d', 4, '5', '| 5. | The ratio between the surface areas of two spheres is 4 : 9. what is the ratio between their volumes ?a. 27 : 8 b. 2 : 3 c. 3 : 2 d. 8 : 27 | 1 |', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-6-0', 'f7fc2d', 5, '6', '| 6. | If \( \sec \theta + \tan \theta = p \), then \( \tan \theta \)isa. \( \frac{p^{2}+1}{2p} \) b. \( \frac{p^{2}-1}{2p} \) c. \( \frac{p^{2}-1}{p^{2}+1} \) d. \( \frac{p^{2}+1}{p^{2}-1} \) | 1 |', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-7-0', 'f7fc2d', 6, '7', '| 7. | In the given figure, \( PQ \) is a tangent to a circle with centre \( O \). \( A \) is the point of contact. If \( \angle PAB = 67^{\circ} \), then measure of \( \angle AQB \) isa. \( 73^{\circ} \) b. \( 44^{\circ} \) c. \( 53^{\circ} \) d. \( 64^{\circ} \) | 1 |', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-f7fc2d-8-0', 'f7fc2d', 7, '8', '| 8. | If $-2$ and $3$ are the zeros of the quadratic polynomial $x^2 + (a + 1)x + b$ then a. $a = -2, b = 6$ b. $a = -2, b = -6$ c. $a = 2, b = -6$ d. $a = 2, b = 6$ |', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-9-0', 'f7fc2d', 8, '9', '| 9. | Consider the following frequency distribution: Class 0-5 5-10 10-15 15-20 20-25 Frequency 10 15 12 20 9 The sum of lower limits of median class and modal class is: a. 15 b. 25 c. 30 d. 35 |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-10-0', 'f7fc2d', 9, '10', '| 10. | The chord of a circle of radius 10 cm subtends a right angle at its centre. The length of the chord (in cm) is a. $\frac{5}{\sqrt{2}}$ b. $5\sqrt{2}$ c. $10\sqrt{2}$ d. $10\sqrt{3}$ |', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-11-0', 'f7fc2d', 10, '11', '| 11. | If one of the roots of the quadratic equation $ax^2 - bx + a = 0$ is 6, then the value of $\frac{b}{a}$ is equal to a. $\frac{1}{6}$ b. $\frac{11}{6}$ c. $\frac{37}{6}$ d. $\frac{6}{11}$ |', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-12-0', 'f7fc2d', 11, '12', '| 12. | The value of $\frac{2\tan 30^\circ}{1+\tan^2 30^\circ}$ is equal to a. $\sin 60^\circ$ b. $\cos 60^\circ$ c. $\tan 60^\circ$ d. $\cot 60^\circ$ |', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-13-0', 'f7fc2d', 12, '13', '| 13. | A right circular cone and a sphere have equal volumes. If the radius of the base of the cone is $2x$ and the radius of the sphere is $3x$, find the height of the cone in terms of $x$. a. $x$ b. $\frac{3x}{2}$ c. $\frac{4x}{3}$ d. $27x$ |', 1, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-14-0', 'f7fc2d', 13, '14', '| 14. | A bag has 5 white marbles, 8 red marbles and 4 purple marbles. If we take a marble randomly, then the probability of not getting purple marble is a. 0.5 b. 0.66 c. 0.08 d. 0.77 |', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-15-0', 'f7fc2d', 14, '15', '| 15. | The distance between the points ($\sin x, \cos x$) and ($\cos x, -\sin x$) is a. 1 b. $\sqrt{2}$ c. $2\sin x\cos x$ d. $4\sin x\cos x$ |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-16-0', 'f7fc2d', 15, '16', '| 16. | In a moderately symmetrical distribution the mode and median are 75 and 60 respectively, the mean is |
| | a. 45.50 | b. 45.83 | c. 52.5 | d. 52.86 | |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f7fc2d-17-0', 'f7fc2d', 16, '17', '| 17. | The mid point of the segment joining (2a, 4) and (-2,2b) is (1,2a + 1), then value of b is a. 2 b. 1 c. 3 d. -1 | | | | 1 |', 1, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-18-0', 'f7fc2d', 17, '18', '| 18. | If P(E) = 0.05. then the probability of ''not E'' is a. 1.05 b. 0.05 c. 0.95 d. 0.85 | | | | 1 |', 1, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-19-0', 'f7fc2d', 18, '19', '| 19. | **DIRECTION : In the question number 19 and 20 , a statement (A) is followed by a statement (R). Choose the correct option.** **Statement A (Assertion) :If the LCM of a and 18 is 36 and HCF of a and 18 is 2 then a=4** **Statement R (Reason) : 2 × 36 = a × 18** a) Both assertion (A) and reason ( R) are true and reason ( R) is the correct explanation of assertion (A) b) Both assertion (A) and reason ( R) are true and reason ( R) is not the correct explanation of assertion (A) c) Assertion (A) is true but reason (R) is false. d) Assertion (A) is false but reason ( R) is true. | | | | 1 |', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-20-0', 'f7fc2d', 19, '20', '| 20. | **Statement A(Assertion):**If the circumference of a circle is reduced by 50% then the area will be reduced by75%. **Statement R(Reason):** Circumference of a circle = πd and area = $$\frac{\pi d^2}{2}$$,d= diameter. a) Both assertion (A) and reason ( R) are true and reason ( R) is the correct explanation of assertion (A) b) Both assertion (A) and reason ( R) are true and reason ( R) is not the correct explanation of assertion (A) c) Assertion (A) is true but reason (R) is false. d) Assertion (A) is false but reason ( R) is true. | | | | 1 |', 1, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-21-0', 'f7fc2d', 20, '21', '| 21. | Find the greatest number which when divides1251, 9377 and 15628 leaves remainder 1, 2 and 3 respectively. OR Explain whether 3 × 12 × 101 + 4 is a prime number or composite number. | | | | 2 |', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-22-0', 'f7fc2d', 21, '22', '| 22. | An integer is chosen between 70 and 100. Find the probability that it is (i) a prime number and (ii) divisible by 7. | | | | 2 |', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-f7fc2d-27-0', 'f7fc2d', 22, '27', '| 27. | A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train. | 3 |', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-f7fc2d-29-0', 'f7fc2d', 23, '29', '| 29. | Prove that : $\sin A (1 + \tan A) + \cos A (1 + \cot A) = \sec A + \csc A$ | 3 |', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-f7fc2d-31-0', 'f7fc2d', 24, '31', '| 31. | Prove that $\sqrt{11}$ is an irrational number. | 3 |', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-f7fc2d-33-0', 'f7fc2d', 25, '33', '| 33. | a) Prove that the lengths of tangents drawn from an external point to a circle are equal.b) In the figure, a circle is inscribed in Δ ABC touches its sides AB, BC and AC at points D, E and F respectively. If AB = 12 cm, BC = 8 cm and AC = 10 cm, then find the lengths of AD, BE and CF.![img-0.jpeg](img-0.jpeg) | | | | | | | | 5 |', NULL, 'Circles', 'short', 7, NULL, NULL),
  ('MQ-f7fc2d-35-0', 'f7fc2d', 26, '35', '| 35. | The following table shows the ages of the patients admitted in a hospital during a year. | | | | | | | | 5 |
| | Age (in years) | 5-15 | 15-25 | 25-35 | 35-45 | 45-55 | 55-65 | | |
| | No. of patients | 6 | 11 | 21 | 23 | 14 | 5 | | |
| | Find the mean and mode of the data given above. | | | | | | | | |', 5, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-f7fc2d-35-1', 'f7fc2d', 27, '35', '| | If the median of the following distribution is 46, find the missing frequency f1 and f2. | | | | | | | | |
| | Class Interval | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 Total | |
| | Frequency | 12 | 30 | f1 | 65 | f2 | 25 | 18 229 | |', 5, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-f7fc2d-36-1', 'f7fc2d', 28, '36', '| 36. | A health camp was organized in a school for all the students and staff to spread awareness about health check up and maintaining a healthy life. In one such health camp, it is found that the heights of a group of students in a section of class X form an Arithmetic progression . The height of the shortest student is 140 cm and the common difference is 4 cm. | | | | | | | | |
| | i) What is the height of the 10thstudent of the class? | | | | | | | | 1 |
| | ii) If the height of the tallest student in the class is 224 cm, find the total number of students present. | | | | | | | | 1 |', 1, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-f7fc2d-36-3', 'f7fc2d', 29, '36', '| 36. | A health camp was organized in a school for all the students and staff to spread awareness about health check up and maintaining a healthy life. In one such health camp, it is found that the heights of a group of students in a section of class X form an Arithmetic progression . The height of the shortest student is 140 cm and the common difference is 4 cm. | | | | | | | | |
| | iii)(B) Find the number of students in the class have a height greater than 180 cm | |', 2, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-f7fc2d-37-0', 'f7fc2d', 30, '37', '| 37. | Joginder, a carpenter designs a trapezium ABCD shaped model as shown in the figure in which AB || DC and diagonals AC and BD divide each other in the ratio 1 : 3 . Later he finds that the side AB is 3 times the side CD. After that he designs various other models of different quadrilaterals with some other measurements as mentioned in following questions. Help him to determine the measurements asked for. i) In the given model, find DO : OB . ii) In the quadrilateral model shown below, ∠1 = ∠3 , ∠2 = ∠4. If $$\frac{EC}{AE} = \frac{DE}{BE} = \frac{1}{2}$$ and DC = 4 cm, find AB. iii) (A) In the given model , if OA = x + 15 , OB = x -7 , OC = x - 12 , OD = x - 2 , then find x. OR iii)(B) In the trapezium model shown , AB || CD , then find AE x FC . | 1 |', 1, 'Similarity', 'short', 8, NULL, NULL),
  ('MQ-063ce1-1-0', '063ce1', 0, '1', '(i) The co-ordinates of the point which divides the line segment joining (-3,10) and (6, -8) in the ratio 2 : 7 are :', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(1,6)', '(1,-6)', '(-1,-6)', '(-1,6)']::text[]),
  ('MQ-063ce1-1-1', '063ce1', 1, '1', 'A point P (-2,3) is reflected in the line x = 2, the coordinates of the point of reflection p'' are:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(2,3)', '(4,3)', '(6,3)', '(8,3)']::text[]),
  ('MQ-063ce1-1-2', '063ce1', 2, '1', '(iii) A cumulative frequency curve is also known as:', 1, 'Statistics', 'MCQ', 1, NULL, array['Parabola', 'Hyperbola', 'Histogram', 'Ogive']::text[]),
  ('MQ-063ce1-1-3', '063ce1', 3, '1', '(iv)
In the given figure, ∠ABC = ∠BDC = 90° each. Choose the correct similarity from the given choices:', 1, 'Similarity', 'MCQ', 2, '063ce1__Dhirubhai__p2_img_1_jpeg.webp', array['ΔABC ~ ΔCBD', 'ΔABC ~ ΔDCB', 'ΔABC ~ ΔBCD', 'ΔABC ~ ΔBDC']::text[]),
  ('MQ-063ce1-1-4', '063ce1', 4, '1', '(v) The volume of the cone is 330 cm³. The volume of the cylinder having same radius and height as that of the given cone is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['330 cm³', '110 cm³', '990 cm³', '660 cm³']::text[]),
  ('MQ-063ce1-1-5', '063ce1', 5, '1', '(vi) If O is the center of the circle and ∠AOC = 120°, then ∠ABC will be :', 1, 'Circles', 'MCQ', 2, '063ce1__Dhirubhai__p2_img_2_jpeg.webp', array['60°', '120°', '240°', '300°']::text[]),
  ('MQ-063ce1-1-6', '063ce1', 6, '1', '(vii) Evaluate: $$\frac{1}{1 + \tan^2 A} + \frac{1}{1 + \cot^2 A}$$', 1, 'Trigonometry', 'MCQ', 2, NULL, array['0', '1', '-1', '2']::text[]),
  ('MQ-063ce1-1-7', '063ce1', 7, '1', '(viii) If the radius of a right circular cone is halved and the height is doubled the percentage of increase/decrease in its volume is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['Increased by 50%', 'Increased by 100%', 'Decreased by 25%', 'Decreased by 50%']::text[]),
  ('MQ-063ce1-1-8', '063ce1', 8, '1', '(ix) If the line 2y = 3x + 2 and y = ax + 5 are perpendicular to each other, then a is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$$\frac{3}{2}$$', '$$\frac{2}{3}$$', '$$\frac{-2}{3}$$', '$$\frac{-3}{2}$$']::text[]),
  ('MQ-063ce1-1-9', '063ce1', 9, '1', '(x) AB and CD be the diameters of circle with centre O. If ∠CAB = 30°, then ''x'' is :', 1, 'Circles', 'MCQ', 3, '063ce1__Dhirubhai__p3_img_0_jpeg.webp', array['30°', '45°', '60°', '90°']::text[]),
  ('MQ-063ce1-1-10', '063ce1', 10, '1', '(xi) Which of the following is not a form of probability?', 1, 'Probability', 'MCQ', 3, NULL, array['2/3', '-1/7', '25%', '0.27']::text[]),
  ('MQ-063ce1-1-11', '063ce1', 11, '1', '(xii) Find the value of p, if average = 42, Σfx = 16p + 40 and Σf = 20', 1, 'Statistics', 'MCQ', 3, NULL, array['30', '40', '50', '70']::text[]),
  ('MQ-063ce1-1-12', '063ce1', 12, '1', '(xiii) Mr. Pankaj took Health Insurance Policy for his family and paid ₹ 900 as SGST. If the rate of GST is 18%, find the Annual Premium paid by him for his policy.', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹ 8000', '₹ 9000', '₹ 10,000', '₹ 12,000']::text[]),
  ('MQ-063ce1-1-13', '063ce1', 13, '1', '(xiv) If x : y = 3 : 4, then (7x + 3y) : (7x - 3y) is :', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['5 : 2', '4 : 3', '11 : 3', '37 : 19']::text[]),
  ('MQ-063ce1-1-14', '063ce1', 14, '1', 'Given A.P. 21, 18, 15, ...
Which term of the above A.P. is (-81)?', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['30th term', '31st term', '34th term', '35th term']::text[]),
  ('MQ-063ce1-2-0', '063ce1', 15, '2', '(i) A registered computer engineer provides computer maintenance to a customer four times in a year. He offers different discounts for each service depending upon the mode of payment and the type of service.

| Service | First Service | Second Service | Third service | Fourth Service |
| --- | --- | --- | --- | --- |
| Service costs | ₹ 8200 | ₹ 13600 | ₹ 8000 | ₹ 12500 |
| Discount | 30% | 20% | 15% | 10% |

If the GST is 18%, Calculate the amount of bill for the computer engineer.', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-063ce1-2-1', '063ce1', 16, '2', '(ii) An exhibition tent is in the form of a cylinder surmounted by a cone. The height of the tent above the tent is 85 m and the height of the cylindrical part is 50 m. If the diameter of the base is 168 m, find the quantity of canvas required to make the tent. Allow 20% extra for folds and stiching. Give your answer to the nearest m².', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-063ce1-2-2', '063ce1', 17, '2', '(iii) In the given figure, ABCDE is a pentagon inscribed in a circle such that AC is the diameter and side BC is parallel to AE, ∠BAC = 50°. Find giving reasons:

(a) ∠ACB

(b) ∠EDC

(d) ∠EBC', 4, 'Circles', 'long', 4, '063ce1__Dhirubhai__p4_img_1_jpeg.webp', NULL),
  ('MQ-063ce1-3-0', '063ce1', 18, '3', '(i) Prove that: $$\frac{\tan A}{secA-1} + \frac{\tan A}{secA+1} = 2 \cosec A$$', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-063ce1-3-1', '063ce1', 19, '3', 'If the mean of the following distribution is 14.7, find the values of p & q. [4]

| Class Interval | Frequency |
| --- | --- |
| 0 – 6 | 10 |
| 6 – 12 | p |
| 12 – 18 | 4 |
| 18 – 24 | 7 |
| 24 – 30 | q |
| 30 – 36 | 4 |
| 36 – 42 | 1 |
| Total | 40 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-063ce1-3-2', '063ce1', 20, '3', '(iii) Use a graph paper for this question. Use 2cm = 1 unit on both the axes. [5]

(a) Plot P(6,3) and Q (3,0). O is the origin.
(b) Reflect P in x-axis to get p'' and write the co-ordinates of P''.
(c) Give the geometrical name of POP''Q. ⇒ arrow head
(d) Name a point from the figure which is invariant on reflection on x-axis.
(e) Find the area of the figure obtained.', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-063ce1-4-0', '063ce1', 21, '4', '(i) Solve the following quadratic equation by the formula method and write

the roots correct to 2 decimal places.

$$(x + 1)(x + 4) + 1 = 0$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-063ce1-4-1', '063ce1', 22, '4', '(ii) Prove that: $$\frac{\cos A}{1 - \tan A} + \frac{\sin A}{1 - \cot A} = \cos A + \sin A$$', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-063ce1-4-2', '063ce1', 23, '4', '(iii) If two-digit numbers are made with 1, 3, 6, and 7, what is the probability that the number is:

(a) less than 60
(b) a prime number
(c) a number divisible by 3
(d) a multiple of 2 or 3', NULL, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-063ce1-5-0', '063ce1', 24, '5', '(i) Find the value/s of m if the equation

$$(2m + 1) x^2 - (2m + 5) x + (2m + 1) = 0$$ has equal and real roots', NULL, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-063ce1-5-1', '063ce1', 25, '5', '(ii) If $$x = \frac{\sqrt{2a+1} + \sqrt{2a-1}}{\sqrt{2a+1} - \sqrt{2a-1}}$$, using properties of proportion, prove that $$x^2 - 4ax + 1 = 0$$.', NULL, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-063ce1-5-2', '063ce1', 26, '5', '(iii) A solid metallic cylinder of base radius 3cm and height 5cm is melted and recast into identical cones, each of height 0.02m and diameter 1 cm. Find the number of cones formed.', NULL, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-063ce1-6-0', '063ce1', 27, '6', '(i) The fourth term of an AP is 11 and the 8th term exceeds twice the fourth term by 5. Find:

(a) the first term
(b) common difference
(c) the sum of the first 50 terms.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-063ce1-6-1', '063ce1', 28, '6', '(ii)

[3]

In the given figure ABCD is a trapezium such that AB is parallel to CD.
The diagonals AC and BD intersect each other at O. Prove that:

(a) \(\Delta OCD \sim \Delta OAB\)
(b) If \(OA = (2p + 1)\), \(OB = (5p - 3)\), \(OC = (6p - 5)\) and \(OD = (3p - 1)\), find the value/s of \(p\).', 3, 'Similarity', 'short', 7, '063ce1__Dhirubhai__p7_img_0_jpeg.webp', NULL),
  ('MQ-063ce1-6-2', '063ce1', 29, '6', '(iii) A (1, 4), B (3, 2) and C (7, 5) are the vertices of Δ ABC. Find:

(a) the co-ordinates of the centroid \( G \) of \( \Delta ABC \).
(b) the equation of a line through \( G \) and parallel to \( AB \).', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-063ce1-7-0', '063ce1', 30, '7', '(i) Solve the following inequation and represent the solution set on a number line.

$$\frac{x}{3} - 4 < \frac{4x}{3} - 2 \leq \frac{x}{3} - 1, x \in R$$', NULL, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-063ce1-7-1', '063ce1', 31, '7', '(ii) Draw a line segment AB = 6cm. Construct a circle with AB as diameter. Mark a point P at 7cm from the mid-point of AB. Construct two tangents from P to the circle with AB as diameter. Measure and write down the length of the tangents.', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-063ce1-7-2', '063ce1', 32, '7', '(iii) ₹ 7500 were divided equally among a certain number of children. Had there been 20 less children, each would have received ₹ 100 more. Find the original number of children.', NULL, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-063ce1-8-0', '063ce1', 33, '8', '(i) From a point on the ground the angle of elevation of the bottom and top of a water tank kept at the top of 20 m high tower are 45° and 60° respectively. Find the height of the water tank to the nearest meter. [4]', 4, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-063ce1-8-1', '063ce1', 34, '8', '(ii) [3]

The inner circumference of the rim of a circular metal tub is 44 cm.
Find:

(a) The inner radius of the tub
(b) The volume of the material of the tub if its outer radius is \(8\mathrm{cm}\). Use \(\pi = \frac{22}{7}\)

Give your answer correct to three significant figure.', 3, 'Mensuration', 'short', 8, '063ce1__Dhirubhai__p8_img_0_jpeg.webp', NULL),
  ('MQ-063ce1-8-2', '063ce1', 35, '8', '(iii) The line 4x - 3y + 12 = 0 meets the x-axis at A. Write down the coordinates of A. Find the equation of the line passing through A and perpendicular to 4x - 3y + 12 =0 [3]', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-063ce1-9-0', '063ce1', 36, '9', '(i) A manufacturer sells a mobile set for ₹ 35,000 to a wholesaler who sells it to a retailer at a profit of 15%. The retailer sells it to a customer at 10% profit. If the rate of GST is 18%, calculate:

(a) The price paid by the retailer for the mobile.
(b) GST paid by the retailer to the government.
(c)The price paid by the customer for the mobile.', NULL, 'GST and Banking', 'short', 8, NULL, NULL),
  ('MQ-063ce1-9-1', '063ce1', 37, '9', '(ii) Find the sum of all two-digit numbers which are divisible by 3. [2]', 2, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-063ce1-9-2', '063ce1', 38, '9', '(iii)

In the adjoining diagram, TB is a tangent to the circle at B with Centre O. SegTO meets the circle at C and A. D is another point on the circle.

$$\angle BTC = 22^\circ$$

Calculate: a) $$\angle BOC$$

b) \(\angle OAB\)
c) \(\angle ABT\)
d) \(\angle BDC\)', NULL, 'Circles', 'short', 9, '063ce1__Dhirubhai__p9_img_0_jpeg.webp', NULL),
  ('MQ-063ce1-10-0', '063ce1', 39, '10', '(i) In the given figure, PQ is a transverse common tangent to two circles with centres A and B and of radius 5 cm and 3 cm respectively. If PQ intersects AB at C such that QP = 16 cm, calculate AB in surd form only.

[4]', 4, 'Circles', 'long', 9, '063ce1__Dhirubhai__p9_img_1_jpeg.webp', NULL),
  ('MQ-063ce1-10-1', '063ce1', 40, '10', '(ii) Use a graph paper for this question. The results of an examination are tabulated below. [6]

The results of an examination are tabulated below.

| Marks (less than) | No. of candidates |
| --- | --- |
| 10 | 8 |
| 20 | 20 |
| 30 | 40 |
| 40 | 75 |
| 50 | 125 |
| 60 | 160 |
| 70 | 188 |
| 80 | 192 |
| 90 | 197 |
| 100 | 200 |

Draw an ogive and use it to determine:

(a) the median
(b) the lower quartile
(c) the number of candidates who failed if the pass mark is 35
(d) the number of candidates who obtained grade A, If the lowest mark for the grade A is 75.', 6, 'Statistics', 'long', 10, NULL, NULL),
  ('MQ-c133fe-1-0', 'c133fe', 0, '1', '(i) A shed of a workshop is of the given shape. The volume of the air that the shed can hold is:
$$\frac{1}{2} \times 35 \times 35 \times 15 \times \frac{22}{7}$$', 1, 'Mensuration', 'MCQ', 1, 'c133fe__Dhirubhai__p1_img_0_jpeg.webp', array['200m³', '288.75m³', '300 m³', '307.25m³']::text[]),
  ('MQ-c133fe-1-1', 'c133fe', 1, '1', '(ii) In the figure, TP and TQ are two tangents to a circle at P and Q respectively with centre O such that, ∠POQ = 110°, the value of ∠PTQ is:', 1, 'Circles', 'MCQ', 2, 'c133fe__Dhirubhai__p2_img_1_jpeg.webp', array['60°', '65°', '70°', '75°']::text[]),
  ('MQ-c133fe-1-2', 'c133fe', 2, '1', '(iii) 1 + tan²θ / (1+secθ) = ---', 1, 'Trigonometry', 'MCQ', 2, NULL, array['sin θ', 'cos θ', 'sec θ', 'tanθ']::text[]),
  ('MQ-c133fe-1-3', 'c133fe', 3, '1', '(iv) In the figure, all dimensions are in cm. The length of AD is:', 1, 'Similarity', 'MCQ', 2, 'c133fe__Dhirubhai__p2_img_2_jpeg.webp', array['12 cm', '14 cm', '16 cm', '18 cm']::text[]),
  ('MQ-c133fe-1-4', 'c133fe', 4, '1', '(v) If the polynomials (2x³ + ax² + 3x - 5) and (x³ + x² - 2x + a) leave the same remainder when divided by (x - 2), then the value of a is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['11', '3', '-3', '5']::text[]),
  ('MQ-c133fe-1-5', 'c133fe', 5, '1', '(vi) In the given figure, if Δ ABC is circumscribing a circle, then the length of BC is :', 1, 'Circles', 'MCQ', 3, 'c133fe__Dhirubhai__p3_img_0_jpeg.webp', array['11 cm', '12 cm', '8 cm', '10 cm']::text[]),
  ('MQ-c133fe-1-6', 'c133fe', 6, '1', '(vii) If A is matrix of order (m x n) and B is a matrix of order (p x q), then the product AB is possible only if', 1, 'Matrices', 'MCQ', 3, NULL, array['m = q', 'n = q', 'm = p', 'n = p']::text[]),
  ('MQ-c133fe-1-7', 'c133fe', 7, '1', '(viii) If the roots of the equation (px² + 8x + 1) = 0 are real, the value of ''p'' is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['≤ 16', '≥ 16', '>16', '>4']::text[]),
  ('MQ-c133fe-1-8', 'c133fe', 8, '1', '(ix) The 75th odd natural number is:', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['151', '149', '147', '75']::text[]),
  ('MQ-c133fe-1-9', 'c133fe', 9, '1', '(x) The equation of a line parallel to x – axis and passing through (- 3, 4) is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['y + 3 = 0', 'x + 4 = 0', 'y – 4 = 0', 'x – 3 = 0']::text[]),
  ('MQ-c133fe-1-10', 'c133fe', 10, '1', '(xi) The class mark of the median class of the given distribution is:
| Class | 0- 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| Cumulative frequency | 8 | 10 | 17 | 26 | 30 |', 1, 'Statistics', 'MCQ', 3, NULL, array['25', '17', '35', '17']::text[]),
  ('MQ-c133fe-1-11', 'c133fe', 11, '1', '(xii) The solution set for the number line given below is:', 1, 'Linear Inequations', 'MCQ', 4, 'c133fe__Dhirubhai__p4_img_0_jpeg.webp', array['\(\{x: -2 \leq x \leq 1, x \in R\}\)', '\(\{x: -2 < x < 2, x \in Z\}\)', '\(\{x: -3 < x < 2, x \in I\}\)', '\(\{x: -3 < x < 1, x \in N\}\)']::text[]),
  ('MQ-c133fe-1-12', 'c133fe', 12, '1', '(xiii) The roots of the quadratic equation ($4x^2 - 7x + 2 = 0$) are 1.390, 0.359. The roots correct to 2 significant figures are:', 1, 'Quadratic Equations', 'MCQ', 4, NULL, array['1.4 and 0.36', '1.3 and 0.35', '1.39 and 0.36', '1.390 and 0.360']::text[]),
  ('MQ-c133fe-1-13', 'c133fe', 13, '1', '(xiv) A shopkeeper buys goods worth ₹ 4000 and sells it at a profit of 20% to a customer. If the GST charged is 5% then, the amount paid by the customer is:', 1, 'GST and Banking', 'MCQ', 4, NULL, array['₹3200', '₹3360', '₹ 4800', '₹5040']::text[]),
  ('MQ-c133fe-1-14', 'c133fe', 14, '1', '(xv) A book has pages numbered from 1 to 85. What is the probability that the sum of the digits of the page number is 8, if a page is chosen at random?', 1, 'Probability', 'MCQ', 4, NULL, array['$\frac{6}{85}$', '$\frac{7}{85}$', '$\frac{9}{85}$', '$\frac{8}{85}$']::text[]),
  ('MQ-c133fe-2-0', 'c133fe', 15, '2', '(i) Find the amount of the bill for the following intrastate transaction of goods from a Super Market, if the rate of GST is 18%. [4]

| Product | Cost in ₹ | Discount % |
| --- | --- | --- |
| Chocolates | 3500 | 40 |
| Crockery | 7500 | 20 |
| Furniture | 8100 | 40 |
| Groceries | 2000 | 10 |', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-c133fe-2-1', 'c133fe', 16, '2', '(ii) A solid toy is in the form of a hemisphere surmounted by a right circular cone. The height of the cone is 4 cm and diameter of the base is 6 cm, calculate: [4]

(a) The volume of the toy
(b) Surface area of the toy \((\Pi = 3.14)\)', 4, 'Mensuration', 'long', 5, 'c133fe__Dhirubhai__p7_img_1_jpeg.webp', NULL),
  ('MQ-c133fe-2-2', 'c133fe', 17, '2', '(iii) The expression $$(ax^3 + bx^2 - 5x + 2a)$$ is exactly divisible by $$(x^2 - 3x - 4)$$. Calculate the value of ''a'' and ''b'' and factorize the expression completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-c133fe-3-0', 'c133fe', 18, '3', '(i) Prove that: $$\sin A (1 + \tan A) + \cos A (1 + \cot A) = \sec A + \csc A$$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-c133fe-3-1', 'c133fe', 19, '3', '(ii) In the given figure, O is the centre of the circle, AOE is the diameter of the semicircle ABCDE. If AB = BC and ∠AEC = 50°, find:

[4]

(a) ∠CBE (b) ∠CDE (c) ∠AOB (d) Show that OB parallel to CE.', 4, 'Circles', 'long', 6, 'c133fe__Dhirubhai__p6_img_0_jpeg.webp', NULL),
  ('MQ-c133fe-3-2', 'c133fe', 20, '3', '(iii) Use a graph paper for this question. (Take 1 cm = 1 unit on both axes) [5]

(a) Plot points A(3, 0), B(5, 6), C(2, 3) and D(-3, 1)
(b) Reflect B, C, D in x-axis and plot it as B'', C'' and D'' respectively. Write the coordinates of B'', C'' & D''
(c) Give the geometric name of the closed figure ABCDD''C''B''.
(d) Name a point from the figure which are invariant on reflection in x-axis.
(e) Find the area of the figure obtained.', 5, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-c133fe-4-0', 'c133fe', 21, '4', '(i) A man has a recurring deposit account in a bank for three years at 8% p.a. If he gets ₹ 3996 as interest at the time of maturity of the scheme, find: (a) the monthly instalment (b) the maturity value. [3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-c133fe-4-1', 'c133fe', 22, '4', '(ii) Prove that: $$\frac{1-\sin A}{1+\sin A} = (\tan A - \sec A)^2$$ [3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-c133fe-4-2', 'c133fe', 23, '4', '(iii) The following distribution shows the number of runs scored by some top batsmen of the world in one-day international cricket matches: [4]

| Runs scored | Number of batsmen |
| --- | --- |
| 3000 - 4000 | 4 |
| 4000 - 5000 | 18 |
| 5000 – 6000 | 9 |
| 6000 – 7000 | 7 |
| 7000 – 8000 | 6 |
| 8000 – 9000 | 3 |
| 9000 - 10000 | 2 |

Draw a histogram for the above distribution and hence estimate the mode of the data.', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-c133fe-5-0', 'c133fe', 24, '5', '(i) Sixteen cards are labelled as a, b, c,... , m, n, o, p. They are put in a box and shuffled. A boy is asked to draw a card from the box. What is the probability that the card drawn is: [3]

(a) A vowel \( ^{A/16} \) = \( ^{1/4} \)
(b) A consonant \( ^{12}/_{16} \leq 3/_{4} \)
(c) None of the letters of the word median? \( ^{19}/_{16} \) = \( ^{3}/_{8} \)', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-c133fe-5-1', 'c133fe', 25, '5', '(ii) The first and last terms of an AP is 5 and 45. If the sum of the terms is [3] 400, find the number of terms and the common difference.', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-c133fe-5-2', 'c133fe', 26, '5', '(iii) If p, q, r are in continued proportion, prove that \( \frac{p^{2}+q^{2}+r^{2}}{p+q+r}=p-q+r. \) [4]

Hence, find p, q, r which are in continued proportion having a sum 19 and having the sum of their squares 133.', 4, 'Ratio and Proportion', 'long', 7, NULL, NULL),
  ('MQ-c133fe-6-0', 'c133fe', 27, '6', '(i) Using properties of proportion, solve for x:

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$', NULL, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-c133fe-6-1', 'c133fe', 28, '6', '(ii) The following table gives hourly wages of workers in a factory:

| Wages in ₹ | No. of workers |
| --- | --- |
| 45 – 50 | 5 |
| 50 – 55 | 8 |
| 55 – 60 | 30 |
| 60 – 65 | 25 |
| 65 – 70 | 14 |
| 70 – 75 | 12 |
| 75 – 80 | 6 |

Calculate the mean hourly wages using the short cut method.', NULL, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-c133fe-6-2', 'c133fe', 29, '6', '(iii) Water drips from a tap at the rate of 4 drops in every 3 seconds. [4]
Volume of one drop is 0.4 cm³. If the dripped water is collected in a cylindrical vessel of height 7 cm and diameter 8 cm, in what time will the vessel be completely filled? What is the volume of the water collected?', 4, 'Mensuration', 'long', 8, NULL, NULL),
  ('MQ-c133fe-7-0', 'c133fe', 30, '7', '(i) Solve the following inequation and represent the solution set on a number line. [3]

$$-8\frac{1}{2} < -\frac{1}{2} - 4x \leq 7\frac{1}{2}, x \in Z$$', 3, 'Linear Inequations', 'short', 8, NULL, NULL),
  ('MQ-c133fe-7-1', 'c133fe', 31, '7', '(ii) Using ruler and compass only, construct a ΔABC such that BC = 5 cm and AB = 6.5 cm and ∠ABC = 120°. Construct a circle passing through the vertices of ΔABC. Measure and write the radius. [3]', 3, 'Constructions', 'short', 8, NULL, NULL),
  ('MQ-c133fe-7-2', 'c133fe', 32, '7', '(iii) A straight line passes through the points P(2,- 5) and Q(4, 3). Find: [4]

(a) The slope of the line PQ
(b) The equation of the line PQ
(c) The value of \( p \), if line PQ passes through the point \( (p - 1, p + 4) \).
(d) The Equation of a line perpendicular to line PQ and passing through origin.', 4, 'Coordinate Geometry', 'long', 9, NULL, NULL),
  ('MQ-c133fe-8-0', 'c133fe', 33, '8', '(i) If A = $$\begin{bmatrix} 1 & -1 \\ 2 & -1 \end{bmatrix}$$, B = $$\begin{bmatrix} x & 1 \\ 4 & -1 \end{bmatrix}$$ and $$A^2 + B^2 = (A + B)^2$$, [3]

find the value of ''x''.', 3, 'Matrices', 'short', 9, NULL, NULL),
  ('MQ-c133fe-8-1', 'c133fe', 34, '8', '(ii) The sum of the third term and the seventh term of an AP is 6 and their product is 8. Find the sum of first 16 terms of AP. [3]', 3, 'Arithmetic Progression', 'short', 9, NULL, NULL),
  ('MQ-c133fe-8-2', 'c133fe', 35, '8', '(iii) [4]

In the figure given above, P is a point on AB and Q is a point on BC such that AP: PB = 4:3. PQ is parallel to AC.

(a) Calculate the ratio PQ: AC, giving reasons for your answers.
(b) In \(\Delta\) ARC, \(\angle ARC = 90^{\circ}\) and in \(\Delta\) PQS, \(\angle PSQ = 90^{\circ}\).

Given QS = 6 cm. Calculate the length of AR.', 4, 'Similarity', 'long', 9, 'c133fe__Dhirubhai__p9_img_0_jpeg.webp', NULL),
  ('MQ-c133fe-9-0', 'c133fe', 36, '9', '(i)

[3]

In Δ PQR, PQ = 24 cm, QR = 7 cm and ∠PQR = 90°. Find the radius ''x'' of the inscribed circle having its centre O.', 3, 'Circles', 'short', 10, 'c133fe__Dhirubhai__p10_img_0_jpeg.webp', NULL),
  ('MQ-c133fe-9-1', 'c133fe', 37, '9', '(ii) Find the ratio in which the y-axis divides the line segment joining the points (5, -6) and (-1, -4). Also, find the point of intersection. [3]', 3, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-c133fe-9-2', 'c133fe', 38, '9', '(iii) As observed from the top of a 80m tall lighthouse, the angles of depression of two ships on the same side of a light house in horizontal line with its base are \(30^{\circ}\) and \(40^{\circ}\) respectively. Find the distance between the two ships. Give your answer to the nearest meter. [4]', 4, 'Trigonometry', 'long', 10, NULL, NULL),
  ('MQ-c133fe-10-0', 'c133fe', 39, '10', '(i)

In an auditorium, seats were arranged in rows and columns. The number of rows was equal to the number of seats in each row. When the number of rows was doubled and the number of seats in each row was reduced by 10, the total number of seats increased by 300. Find: (a) The number of rows in the original arrangement. (b) The number of seats in the auditorium after rearrangement.

[4]', 4, 'Quadratic Equations', 'long', 10, NULL, NULL),
  ('MQ-c133fe-10-1', 'c133fe', 40, '10', '(ii) Use a graph paper for this question. The daily wages of 120 workers [6]

working at a site are given below:

Use 2 cm = ₹ 50 and 2 cm = 20 workers along x – axis and y – axis respectively to draw an ogive and hence estimate:

| Wages (₹) | No. of workers |
| --- | --- |
| 250 – 300 | 8 |
| 300 – 350 | 15 |
| 350 – 400 | 20 |
| 400 – 450 | 30 |
| 450 – 500 | 25 |
| 500 – 550 | 15 |
| 550 – 600 | 7 |

(a) the median wages
(b) the interquartile range of wages
(c) percentage of workers whose daily wage is above ₹ 475', 6, 'Statistics', 'long', 11, NULL, NULL),
  ('MQ-181264-1-0', '181264', 0, '1', '(i) If (2 x -1) is a factor of f(x) = 2x² + px - 5 then the value of p is,', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['10', '9', '8', '5.']::text[]),
  ('MQ-181264-1-1', '181264', 1, '1', '(ii) In the given figure, AT is a tangent to the circle with centre O such that OT=4cm, ∠OTA = 30°. The length of AT (in cm) is,', 1, 'Circles', 'MCQ', 1, '181264__Don_Bosco__p1_img_0_jpeg.webp', array['4', '2', '\(2\sqrt{3}\)', '\(4\sqrt{3}\).']::text[]),
  ('MQ-181264-1-2', '181264', 2, '1', '(iii) A person deposits Rs 500 every month for 2 years at \(10\%\) per annum SI in a recurring deposit account.
Assertion (A): The maturity amount is more than total amount deposited by the person.
This paper consists of 7 printed pages.
Reason (R): Maturity value includes an interest equal to, $$\frac{500 \times 24 \times 25}{100 \times 2 \times 12} = \text{Rs } 125$$.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.']::text[]),
  ('MQ-181264-1-3', '181264', 3, '1', '(iv) In the figure, PA and PB are tangents to the circle with centre at O. If $$\angle APB = 60^\circ$$, the $$\angle OAB$$ is,', 1, 'Circles', 'MCQ', 2, '181264__Don_Bosco__p2_img_0_jpeg.webp', array['\(40^{\circ}\)', '\(30^{\circ}\)', '\(25^{\circ}\)', '\(20^{\circ}\).']::text[]),
  ('MQ-181264-1-4', '181264', 4, '1', '(v) Assertion (A): \( 1 - \tan^2\theta = \sec^2\theta \) and \( \cosec^2\theta + 1 = \tan^2\theta \) are trigonometric identities.
Reason (R): Trigonometric equations that are true for all values of its angles are called trigonometric identities.', 1, 'Trigonometry', 'MCQ', 2, NULL, array['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.']::text[]),
  ('MQ-181264-1-5', '181264', 5, '1', '(vi) The volume of the greatest sphere cut off from a circular cylindrical wood of base radius \(1\mathrm{cm}\) and height \(3\mathrm{cm}\) (in \(\mathrm{cm}^3\)) is,', 1, 'Mensuration', 'MCQ', 2, NULL, array['\(\pi\)', '\(\pi /3\)', '\(2\pi /3\)', '\(4\pi /3\)']::text[]),
  ('MQ-181264-1-6', '181264', 6, '1', '(vii) Assertion (A): Upper quartile for the data 9, 11, 15, 19, 13, 7 is 13.
Reason (R): Upper quartile $$Q_3 = 3(\frac{n}{4})^{\text{th}}$$ term or $$3(\frac{n+1}{4})^{\text{th}}$$ term depending whether n is even or odd.', 1, 'Statistics', 'MCQ', 2, NULL, array['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.']::text[]),
  ('MQ-181264-1-7', '181264', 7, '1', '(viii)If two coins are tossed simultaneously, then the probability of getting at least one head is,', 1, 'Probability', 'MCQ', 2, NULL, array['1/2', '3/4', '1/4', '1.']::text[]),
  ('MQ-181264-1-8', '181264', 8, '1', '(ix) If \(\mathbf{M} = \left[ \begin{array}{ll}1 & -2 \end{array} \right], N = \left[ \begin{array}{ll}2 & 1\\ -1 & 2 \end{array} \right]\), then the order of MN is,', 1, 'Matrices', 'MCQ', 2, NULL, array['1X2', '2X1', '1X1', '2X2.']::text[]),
  ('MQ-181264-1-9', '181264', 9, '1', '(x) Assertion: If \( x = 1 \) is a solution of the equation \( 2x^{2} + px - 6 = 0 \), then the value of \( p \) is 1.
Reason: If $$\alpha$$ is a root of quadratic equation, then $$\alpha$$ satisfies the equation.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.']::text[]),
  ('MQ-181264-1-10', '181264', 10, '1', '(xi) The cost of certain services is Rs 10,000, excluding GST = Rs 1800. The rate of GST is,', 1, 'GST and Banking', 'MCQ', 3, NULL, array['12%', '5%', '18%', '28%.']::text[]),
  ('MQ-181264-1-11', '181264', 11, '1', '(xii) A man has some shares of Rs 50 of a company paying 15% dividend. If his annual income is Rs 3000, then the number of shares he possesses is,', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['80', '400', '600', '800.']::text[]),
  ('MQ-181264-1-12', '181264', 12, '1', '(xiii) For the equation, $$3x^2 - 4x - 2 = 0$$, the roots are,', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['real & equal', 'real & unequal', 'imaginary', 'none of these.']::text[]),
  ('MQ-181264-1-13', '181264', 13, '1', '(xiv) The angle of inclination of the line, $$\sqrt{3} x - y - 1 = 0$$, is,', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['$$30^0$$', '$$45^0$$', '$$60^0$$', '$$90^0$$.']::text[]),
  ('MQ-181264-1-14', '181264', 14, '1', '(xv) The smallest value of x for which, $$x - 2(3+x) < 3(2x-1)$$, $$x \in W$$ is,', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['3', '2', '0', '1']::text[]),
  ('MQ-181264-2-0', '181264', 15, '2', '(i) While factorising a given polynomial, using remainder and factor theorem, a student finds that $$(2x + 1)$$ is a factor of

$$2x^3 - x^2 - 13x - 6.$$

(a) Is the student''s solution correct stating that \((2x + 1)\) is a factor of the given polynomial
(b) Give a valid reason for your answer.

Also, factorise the given polynomial completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-181264-2-1', '181264', 16, '2', '(ii) A and B are the points on positive direction of both x-axis and y-axis, at a distance of 4 units from the origin.
(a) Write the coordinates of both A and B.
(b) P is a point on AB such that AP: PB = 3:1. Using section formula, find the coordinates of P.
(c) Find the equation of line passing through P and perpendicular to AB.

[4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-181264-2-2', '181264', 17, '2', '(iii) In the given diagram, O is the centre of circle. PR and PT are the two tangents drawn from the external point P and touching the circle at Q and S respectively. MN is a diameter of the circle. Given $$\angle PQM = 42^0$$ and $$\angle PSM = 25^0$$, find,

(a) $$\angle OQM$$ (b) $$\angle QNS$$ (c) $$\angle QOS$$ (d) $$\angle QMS$$. [4]', 4, 'Circles', 'long', 3, '181264__Don_Bosco__p4_img_0_jpeg.webp', NULL),
  ('MQ-181264-3-0', '181264', 18, '3', '(i) 15, 30, 60, 120, ... are the terms of a progression.

(a) Identify the nature of progression.

(b) Find its nᵗʰ term.

(c) How many terms of the above progression will give sum 945?', NULL, 'Geometric Progression', 'short', 4, NULL, NULL),
  ('MQ-181264-3-1', '181264', 19, '3', '(ii) From a wooden cubical block of edge 7 cm, the largest possible right cut out whose base is on one of the faces of the cube. Calculate, (a) the volume of a cube in the block (b) the total surface area of the block left. (Take π = 22/7).', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-181264-3-2', '181264', 20, '3', '(iii) Ruler and compasses may be used in this question. All construction, lines may be clearly shown, and of sufficient length and clarity to permit assessment.

(a) Construct a ΔABC in which BC = 6cm, AB = 9 cm and ∠ABC = 60⁰.

(b) Construct locus of all points, inside ΔABC, which are equidistant from B and

(c) Construct the locus of all vertices of triangles with BC as base, which are equi ΔABC.

(d) Mark the point Q in your construction which would make ΔQBC equal in area and isosceles.

(e) Measure and record the length of CQ.', NULL, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-181264-4-0', '181264', 21, '4', '(i) Ashrut invests Rs 8500 in \(10\%\), Rs 100 shares at Rs 170. He sells the shares when the price of each share rises by Rs 30. He invests the proceeds in \(12\%\) Rs 100 shares at Rs 125. Find,
(a) The sale proceeds (b) the number of Rs 125 shares he buys (c) the change in his annual income. [3]', 3, 'Shares and Dividends', 'short', 5, NULL, NULL),
  ('MQ-181264-4-1', '181264', 22, '4', '(ii) Solve the in equation, \(\frac{-x}{3} \leq \frac{x}{2} - 1\frac{1}{3} < \frac{1}{6}\), \(x \in \mathbf{R}\) and plot it on the number line. [3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-181264-4-2', '181264', 23, '4', '(iii) Prove the trigonometric identity,

$$(1 + \cot\theta - \csc\theta)(1 + \tan\theta + \sec\theta) = 2$$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-181264-5-0', '181264', 24, '5', '(i) In the given figure, AC||DE||BF. If AC = 24 cm, EG = 8 cm, GB = 16cm, BF = 30 cm, then,
(a) Prove that, \(\Delta \mathrm{GED} \sim \Delta \mathrm{GBF}\) (b) Find DE (c) Find DB: AB. [3]', 3, 'Similarity', 'short', 5, '181264__Don_Bosco__p5_img_0_jpeg.webp', NULL),
  ('MQ-181264-5-1', '181264', 25, '5', '(ii) Samuel opens a recurring deposit account of Rs.200 per month, whose maturity value is Rs 10,206 at the rate of \(12\%\) per annum. Find the time period of account in months. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-181264-5-2', '181264', 26, '5', '(iii) The mean of the following distribution is 24, find the value of a. (Use step-deviation method). [4]

| marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 7 | a | 8 | 10 | 5 |

This paper consists of 7 printed pages.', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-181264-6-0', '181264', 27, '6', '(i) Points A and B have coordinates (7, -3) and (1, 9) respectively. Find, (a) the slope of (b) the equation of the perpendicular bisector of line segment AB (c) the value of \(P\) if ( lies on it.', NULL, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-181264-6-1', '181264', 28, '6', '(ii) In the adjoining figure, \(\Delta ABC\) with \(AC = 13cm\), \(AB = 12cm\) and \(\angle ABC = 90^{\circ}\) circumscribes a circle of radius \(x\) as shown. Find the value of \(x\)', NULL, 'Circles', 'short', 6, '181264__Don_Bosco__p6_img_0_jpeg.webp', NULL),
  ('MQ-181264-6-2', '181264', 29, '6', '(iii) A manufacturer listed the price of his goods at Rs 1600 per article. He allowed a discount of \(25\%\) to a whole seller who in turn allowed a discount of \(20\%\) on the listed price to the retailer. The retailer sells one article to a consumer at a discount of \(5\%\) on the listed price. If all sales are intra-state and the rate of GST is \(5\%\), find, (a) the amount that the consumer pays for the article
(b) The tax (under GST) paid by the retailer to the Central government for the article
(c) the tax (under GST) received by the State Government. [4]', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-181264-7-0', '181264', 30, '7', '(i) The upper part of a tree, broken by wind, falls to the ground without being detached. The top of the broken part touches the ground at an angle of 38°30'' at a point 6m from the foot of the tree. Find the original height of the tree.

(Use Mathematical table for this question)

[5]', 5, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-181264-7-1', '181264', 31, '7', '(ii) The following table shows the distribution of scores by 120 shooters in a shooting competition. Using a graph sheet, draw an ogive for the distribution. Use your ogive to estimate, (a) the median (b) the inter quartile range (c) the number of shooters who obtained more than 75% scores.

| Scores | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-181264-8-0', '181264', 32, '8', '(i) A card is drawn from a well shuffled pack of 52 cards. Find the probability of getting,
(a) non-face card of black colour.
(b) neither a spade nor a jack
(c) neither a heart nor a red king.. [3]', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-181264-8-1', '181264', 33, '8', '(ii) Using properties of proportion solve for x, given x is positive

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4. \tag{3}$$', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-181264-8-2', '181264', 34, '8', '(iii) A semi-circular sheet of metal of diameter 28 cm is bent to form an open cone. Find,

(a) radius of the cone.
(b) surface area of the cone
(c) volume of the cone. [4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-181264-9-0', '181264', 35, '9', '(i) Find the mean of the following distribution by step-deviation method.

| CI | 0-50 | 50-100 | 100-150 | 150-200 | 200-250 | 250-300 |
| --- | --- | --- | --- | --- | --- | --- |
| f | 4 | 8 | 16 | 13 | 6 | 3 |', NULL, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-181264-9-1', '181264', 36, '9', '(ii) If the \(6^{\text{th}}\) term of an A.P is equal to four times its first term and the sum of first 6 terms is 75, find the first term and the common difference. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-181264-9-2', '181264', 37, '9', '(iii) Solve the equation, \( 5\mathbf{x}^2 - 3\mathbf{x} - 4 = 0 \) and give your answer correct to 3 significant figures. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-181264-10-0', '181264', 38, '10', '(i) The product of the digits of a two-digit number is 32. If 36 is added to the number, the digits interchange their places. Find the number. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-181264-10-1', '181264', 39, '10', '(ii) If \( \mathbf{A} = \begin{bmatrix} x & 0 \\ 1 & 1 \end{bmatrix} \), \( \mathbf{B} = \begin{bmatrix} 4 & 0 \\ y & 1 \end{bmatrix} \) and \( \mathbf{C} = \begin{bmatrix} 4 & 0 \\ x & 1 \end{bmatrix} \). Find the value of \( \mathbf{x} \) and \( \mathbf{y} \) if \( \mathbf{AB} = \mathbf{C} \). [3]', 3, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-181264-10-2', '181264', 40, '10', '(iii) Use graph paper to answer the following question.

(Take 2 cm = 1 unit on both the axes.)

(a) Plot the points A (-4, 2) and B (2, 4).
(b) A'' is image of point A when reflected in the y-axis. Plot it on graph paper and write its coordinates.
(c) B'' is the image of B when reflected in the line AA''. Write the coordinates of B''.
(d) Write the geometric name of the figure ABA''B''. [4]', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-1440ac-1-0', '1440ac', 0, '1', '(i) The reflection of the point P(-2,3) in the x-axis is

a. (2,3) b. (2,-3) c. (-2,-3) d. (-2,0)', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-1440ac-1-1', '1440ac', 1, '1', '(ii) A consumer buys a refrigerator whose marked price is ₹ 30000 from a dealer at a discount of 15%. If the rate of GST is 18%, find the amount of tax (under GST) paid by the consumer for the purchase.

a. ₹ 4590 b. ₹ 4950 c. ₹ 5090 d. ₹ 5490', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-1440ac-1-2', '1440ac', 2, '1', '(iii) Mohan opened a recurring deposit account with a Nationalised Bank for a period of 2 years. If the bank pays interest at the rate of 6% per annum and the monthly instalment is ₹ 1000, find the interest earned in 2 years.

a. ₹ 1400 b. ₹ 1500 c. ₹ 1600 d. ₹ 1200', 1, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-1440ac-1-3', '1440ac', 3, '1', '(iv) If x, 12, 8 and 32 are in proportion, then the value of x is

a. 6 b. 4 c. 3 d. 2', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-1440ac-1-4', '1440ac', 4, '1', '(v) If x ∈ W, then the solution set of the inequation 3-4x ≤ 2 - 3x is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{..., -2, -1, 0, 1, 2, 3}', '{1, 2, 3}', '{0,1,2,3}', '{x: x ∈ W, x ≥ 3}']::text[]),
  ('MQ-1440ac-1-5', '1440ac', 5, '1', '(vi) The roots of the equation x² -3x -10 = 0 are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['(2,-5)', '(-2,5)', '(2,5)', 'none of these']::text[]),
  ('MQ-1440ac-1-6', '1440ac', 6, '1', '(vii) When x³ - 3x² + 5x -7 is divided by (x-2), then the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['0', '1', '2', '-1']::text[]),
  ('MQ-1440ac-1-7', '1440ac', 7, '1', '(viii) (sec²θ -1) (1- cosec²θ) is equal to', 1, 'Trigonometry', 'MCQ', 2, NULL, array['-1', '1', '0', 'none of these']::text[]),
  ('MQ-1440ac-1-8', '1440ac', 8, '1', '(ix) If [x - 2y 5; y] = [6 5; 3 -2], then the value of x is', 1, 'Matrices', 'MCQ', 2, NULL, array['-2', '0', '1', '2']::text[]),
  ('MQ-1440ac-1-9', '1440ac', 9, '1', '(x) The 10th term of the A.P 5, 8, 11, 14...is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['32', '35', '38', '185']::text[]),
  ('MQ-1440ac-1-10', '1440ac', 10, '1', '(xi) The co-ordinate of centroid of the triangle whose vertices are (3,-7), (-8,6), and (5,10) is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(0,9)', '(0,3)', '(1,3)', '(3,3)']::text[]),
  ('MQ-1440ac-1-11', '1440ac', 11, '1', 'In the given figure, AB and DE are perpendiculars to side BC. If AB = 9 cm, DE = 3 cm, and AC = 24 cm, then AD is', 1, 'Similarity', 'MCQ', 2, '1440ac__Dps_Megaci_p2_img_0_jpeg.webp', array['16 cm', '8 cm', '12 cm', 'None of these']::text[]),
  ('MQ-1440ac-1-12', '1440ac', 12, '1', '(xiii) The slope of the line passing through the points (0,-4) and (-6,2) is a. 0

b. 1

c. -1

d. 6', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-1440ac-1-13', '1440ac', 13, '1', '(xiv) The mean of 7 variates is 12. If six of them are 5, 13, 9, 17, 14 and 10, find the seventh variate.', 1, 'Statistics', 'MCQ', 3, NULL, array['16', '15', '14', '17']::text[]),
  ('MQ-1440ac-1-14', '1440ac', 14, '1', '(xv) Out of one digit prime numbers, one number is selected at random. The probability of selecting an even number is', 1, 'Probability', 'MCQ', 3, NULL, array['½', '1/4', '4/9', '1/5']::text[]),
  ('MQ-1440ac-2-0', '1440ac', 15, '2', 'a. Dinesh opened a recurring deposit account in a bank. He deposits Rs.150/- every month for 2/3 years. At the time of maturity, he received Rs 1236. Find the rate of interest.', 4, 'GST and Banking', 'long', 3, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
