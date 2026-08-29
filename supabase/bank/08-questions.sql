set standard_conforming_strings = on;
begin;

-- questions 3001-3500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-1440ac-2-1', '1440ac', 16, '2', 'b. A box contains 24 pastries of which x are chocolate pastries.

(i) If one pastry is chosen at random, what is the probability that it is not chocolate pastry.

(ii) If 4 more chocolate pastries are added to the box, the probability of choosing a chocolate pastry is $\frac{1}{4}$, find x.', 4, 'Probability', 'long', 3, NULL, NULL),
  ('MQ-1440ac-2-2', '1440ac', 17, '2', 'c. Find the value of x and y if $\begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix} \begin{bmatrix} 2x \\ 1 \end{bmatrix} + 2 \begin{bmatrix} -4 \\ 5 \end{bmatrix} = 4 \begin{bmatrix} 2 \\ y \end{bmatrix}$', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-1440ac-3-0', '1440ac', 18, '3', 'a. Find the values of x which satisfy the given inequation and represent the solution set on a number line :

$$2x - 5 \le 5x + 4 < 11, \text{where } x \in R.$$', 4, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-1440ac-3-1', '1440ac', 19, '3', 'b. If $(2x^3 + ax^2 + bx - 2)$ when divided by $(2x - 3)$ and $(x + 3)$ leaves remainders 7 and -20 respectively, find the values of ''a'' and ''b''.', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-1440ac-3-2', '1440ac', 20, '3', 'c. The points (4,0) and (-2,0) are invariant points under reflection in the line $L_1$.

i. Name the line \(L_{1}\)
ii. Plot the images of the points \(\mathrm{P}(3,4)\) and \(\mathrm{Q}(-5, - 2)\) on reflection in \(L_{1}\) and name the images as \(\mathbf{P} /\) and \(\mathbf{Q} /\) respectively.
III. Give the geometrical name of the figure PP/QQ/, and calculate its area.', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-1440ac-4-0', '1440ac', 21, '4', 'a. The market price of an article is Rs 6000. A wholesaler sells it to a dealer at 20% discount. The dealer further sells it to a customer at a discount of 10% on the market price. If the GST at each step is 18% (sales being intra-state),

i) find the amount of tax paid by dealer to the state government.
ii) Total tax received by the central government.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-1440ac-4-1', '1440ac', 22, '4', 'a. Find the ratio in which the line segment joining the points \((-3, 10)\) and \((6, -8)\) is divided by \((-1, 6)\).', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-1440ac-4-2', '1440ac', 23, '4', 'c. Using ruler and compass construct a triangle ABC with BC = 6.5cm, AB = 5.5cm and AC = 5cm. construct the incircle of the triangle.

Measure and record the radius of the circle.', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-1440ac-5-0', '1440ac', 24, '5', 'a. If \( x = \frac{2mab}{a + b} \), find the value of \( \frac{x + ma}{x - ma} + \frac{x + mb}{x - mb} \).', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-1440ac-5-1', '1440ac', 25, '5', 'b. A metallic sphere of radius 21cm is melted and recast into small cones each of radius 7cm and height 6cm. find the number of cones thus obtained.', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-1440ac-5-2', '1440ac', 26, '5', 'c. Prove that: \((1 + \cot \theta - \cosec\theta)(1 + \tan \theta + \sec \theta) = 2\)', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-1440ac-6-0', '1440ac', 27, '6', 'a. In the given figure, DE I BC, AE = 15 cm, EC = 9 cm, NC = 6 cm and BN = 24 cm. Find the lengths of ME and DM.', 3, 'Similarity', 'short', 4, '1440ac__Dps_Megaci_p4_img_0_jpeg.webp', NULL),
  ('MQ-1440ac-6-1', '1440ac', 28, '6', 'b. Solve the following equation and give your answer correct till two significant figures:

$$x - \frac{18}{x} = 6$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-1440ac-6-2', '1440ac', 29, '6', 'c. Thirty women were examined in a hospital by a doctor and the number of heart beats per minute was recorded and summarized as follows. Find the mean heartbeats per minute for these women, choosing a suitable method.

| Number of heart beats per minute | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of women | 2 | 4 | 3 | 8 | 7 | 6 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-1440ac-7-0', '1440ac', 30, '7', '(a) The \(7^{\text{th}}\) terms of an A.P. is 32 and its \(13^{\text{th}}\) term is 62. Find the A.P.', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-1440ac-7-1', '1440ac', 31, '7', '(b) In the given figure, PA and PB are tangents to the circle. CE is a tangent to the circle at D. If AP = 15 cm, find the perimeter of the triangle PEC.', 3, 'Circles', 'short', 5, '1440ac__Dps_Megaci_p5_img_0_jpeg.webp', NULL),
  ('MQ-1440ac-7-2', '1440ac', 32, '7', '(c) In a school, the percentage attendance of 50 students is as follows:

| Attendance percentage | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 2 | 8 | 12 | 14 | 6 | 8 |

Draw a histogram on a graph paper and find the mode from the graph.', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-1440ac-8-0', '1440ac', 33, '8', '(a) The probability of selecting a blue pencil at random from box that contains only red, blue and black pencils is 1/5. The probability of selecting a black pencil at random from the same box is 1/4. If the box contains 11 red pencils, find the total number of pencils in the box.', 4, 'Probability', 'long', 6, NULL, NULL),
  ('MQ-1440ac-8-1', '1440ac', 34, '8', '(b) The table shows the distribution of scores obtained by 160 shooters in an examination. Use a graph sheet and draw an ogive for the distribution.

(Take 2 cm = 10 scores on the x-axis and 2 cm = 20 shooters on the y-axis)

| Scores | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 10 | 12 | 22 | 24 | 28 | 24 | 14 | 11 | 7 | 8 |

Use your graph to estimate the following: (i) The median

(ii) The upper quartile.

(iii) The number of shooters who obtained a score of more than 80%.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-1440ac-9-0', '1440ac', 35, '9', '(a) Use the factor theorem to factorise \(6x^{3} + 17x^{2} + 4x - 12\) completely.', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-1440ac-9-1', '1440ac', 36, '9', '(b) Find the equation of the median through A of the triangle ABC whose vertices are A (2,5), B (-4,9) and C (-2,-1).', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-1440ac-9-2', '1440ac', 37, '9', '(c) The sum of first seven terms of an A.P. is 182. If its \(4^{\text{th}}\) and \(17^{\text{th}}\) terms are in the ratio 1:5. Find the A.P.', 4, 'Arithmetic Progression', 'long', 6, NULL, NULL),
  ('MQ-1440ac-10-0', '1440ac', 38, '10', 'a. In the figure given below, O is the centre of the circle and AB is a diameter. If \(\angle OAD = 50^{\circ}\) find

(i) \(\angle BCD\)

(ii) \(\angle BOD\)', 3, 'Circles', 'short', 6, '1440ac__Dps_Megaci_p6_img_0_jpeg.webp', NULL),
  ('MQ-1440ac-10-1', '1440ac', 39, '10', 'b. A 56 cm long wire is bent to form a right-angled triangle with hypotenuse 25 cm. Find the area of the triangle so formed.', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-1440ac-10-2', '1440ac', 40, '10', 'c. A fire at a building B is reported on telephone to two fire stations P and Q 10 km apart from each other. P observes that the fire is at an angle of 60° from it and Q observes that it is at an angle of 30° from it. Which station should send its team and how much distance it has to travel?', 4, 'Trigonometry', 'long', 7, '1440ac__Dps_Megaci_p7_img_0_jpeg.webp', NULL),
  ('MQ-2914e8-1-0', '2914e8', 0, '1', '(i) The CGST paid by a customer to the shopkeeper for an article which is priced at ₹25000 is ₹ 2250. The rate of GST charged is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['5%', '12%', '18%', '28%']::text[]),
  ('MQ-2914e8-1-1', '2914e8', 1, '1', '(ii) Which of the following equations has 2 as one of the roots?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['$$2x^2 - 7x + 6 = 0$$', '$$x^2 + 3x - 12 = 0$$', '$$x^2 - 4x + 5 = 0$$', '$$3x^2 - 6x - 2 = 0$$']::text[]),
  ('MQ-2914e8-1-2', '2914e8', 2, '1', '(iii) If $$\begin{bmatrix} a + b & 2 \\ 5 & b \end{bmatrix} = \begin{bmatrix} 6 & 5 \\ 2 & 2 \end{bmatrix}$$, then the value of ''a'' is:', 1, 'Matrices', 'MCQ', 1, NULL, array['6', '5', '4', '3']::text[]),
  ('MQ-2914e8-1-3', '2914e8', 3, '1', '(iv) (x + 1) is a factor of which of the given polynomials?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['x³ + x² - x + 1', 'x³ + x² + x + 1', '2x³ + 3x² - 1', '3x³ + 3x² + x + 1']::text[]),
  ('MQ-2914e8-1-4', '2914e8', 4, '1', '(v) The sum of the first ''n'' terms of an A.P. is 3n² + 5n, then the common difference of this A.P. is:', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['5', '6', '7', '8']::text[]),
  ('MQ-2914e8-1-5', '2914e8', 5, '1', '(vi) The point P(3, 5) on reflection in the line y = -1 is mapped onto P'', the coordinates of P'' is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2, 1)', '(-3, 1)', '(1, 4)', '(3, -7)']::text[]),
  ('MQ-2914e8-1-6', '2914e8', 6, '1', '(vii) In triangle ABC, DE || BC. If AD = x, DB = x - 2, AE = x + 2 and EC = x - 1, then the value of x is:', 1, 'Similarity', 'MCQ', 2, NULL, array['4', '8', '16', '32']::text[]),
  ('MQ-2914e8-1-7', '2914e8', 7, '1', '(viii) The diameter of a sphere is 6 cm. It is melted and drawn into a wire of diameter 0.2 cm. The length of the wire in metres is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['12m', '18m', '36m', '66m']::text[]),
  ('MQ-2914e8-1-8', '2914e8', 8, '1', '(ix) If x is a negative integer, the solution set of $$\frac{2}{3} + \frac{1}{3}(x + 1) > 0$$ is:', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{-2, -3}', '{-1, -2}', '{-3, -4}', '{-4, -5}']::text[]),
  ('MQ-2914e8-1-9', '2914e8', 9, '1', '(x) The letters of the word SOCIETY are placed at random in a row. The probability of getting a consonant is:', 1, 'Probability', 'MCQ', 2, NULL, array['$$\frac{1}{7}$$', ') $$\frac{2}{7}$$', '$$\frac{3}{7}$$', '$$\frac{4}{7}$$']::text[]),
  ('MQ-2914e8-1-10', '2914e8', 10, '1', '(xi) If (x + 5) is the mean proportional between (x + 2) and (x + 9) the value of x is:', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['5', '6', '7', '8']::text[]),
  ('MQ-2914e8-1-11', '2914e8', 11, '1', '(xii) The line segment joining A(-2, 3) and B(6, -5) is intersected by X-axis at the point P. The coordinates of P are:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(1, 0)', '(0, 1)', '(2, 0)', '(d) (-2, 0)']::text[]),
  ('MQ-2914e8-1-12', '2914e8', 12, '1', '(xiii) The distance between two parallel tangents of a circle is 18 cm, then the radius of the circle is:', 1, 'Circles', 'MCQ', 3, NULL, array['8 cm', '10 cm', '9 cm', '7.5 cm']::text[]),
  ('MQ-2914e8-1-13', '2914e8', 13, '1', '(xiv) The value of the expression $$\sin^6\theta + \cos^6\theta + 3 \sin^2\theta \cos^2\theta$$ is :', 1, 'Trigonometry', 'MCQ', 3, NULL, array['0', '1', '2', '3']::text[]),
  ('MQ-2914e8-1-14', '2914e8', 14, '1', '(xv) For the following distribution:
| Class Interval | 0 - 10 | 10 -20 | 20 -30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 20 | 30 | 24 | 40 | 17 |
The sum of lower limits of the modal class and the median class is:', 1, 'Statistics', 'MCQ', 3, NULL, array['20', '30', '40', '50']::text[]),
  ('MQ-2914e8-2-0', '2914e8', 15, '2', '(i) A recurring deposit account of ₹ 500 per month has a maturity value of ₹ 9570. If the rate of interest is 8% per annum and interest is calculated at the end of every month, find the total time for which the account was held. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-2914e8-2-1', '2914e8', 16, '2', '(ii) Using properties of proportion, solve for x.

$$\frac{(m+n)x - (a-b)}{(m-n)x - (a+b)} = \frac{(m+n)x + (a+c)}{(m-n)x + (a-c)} \tag{4}$$', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-2914e8-2-2', '2914e8', 17, '2', '(iii) Prove that:

$$\left(\frac{1 - \tan\theta}{1 - \cot\theta}\right)^2 = \tan^2\theta \tag{4}$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-2914e8-3-0', '2914e8', 18, '3', '(i) A toy is in the shape of a right circular cylinder with a hemisphere on one end and a cone on the other. The height and radius of the cylindrical part are 13cm and 5cm respectively. The radii of the hemispherical and conical parts are the same as that of the cylindrical part. Calculate the surface area of the toy if height of the conical part is 12cm. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-2914e8-3-1', '2914e8', 19, '3', '(ii) (-2, -1) and (4, -5) are the coordinates of the vertices B and D respectively of a rhombus ABCD. Find the equation of the diagonal AC. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-2914e8-3-2', '2914e8', 20, '3', '(iii) Use a graph paper for this question taking 1cm = 1unit along both the x- axis and y- axis. Plot the points A(3, 0) and B(0, 4).

a) Write down the coordinates of A'', the reflection of A in the y- axis.
b) Write down the coordinates of B'', the reflection of B in the x- axis.
c) Assign a special name to quadrilateral ABA''B''A.
d) If C is the midpoint of AB, write down the coordinates of C'' the reflection of C in the origin. [5]', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-2914e8-4-0', '2914e8', 21, '4', '(i) Solve the following equation for x and give your answer correct to 3 significant figures:
$$x^2 - 3x = 9$$

[3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-2914e8-4-1', '2914e8', 22, '4', '(ii) Mr Sunil Sonare visits the market and buys the following articles:

A linen shirt costing ₹ 3000, GST @ 12%

A smart watch costing ₹ 2000 with a discount of 30%, GST @ 18%.

Calculate the total bill amount including GST paid by Mr Sonare. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-2914e8-4-2', '2914e8', 23, '4', '(iii) The table below shows the daily expenditure on food of 50 house-holds in a locality.

| Daily Expenditure(in ₹) | 0 -100 | 100 -200 | 200 - 300 | 300 - 400 | 400 - 500 | 500 - 600 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of House-holds | 5 | 8 | 15 | 10 | 7 | 5 |

Using a graph paper, draw a histogram representing the above distribution and estimate the mode. Take along x-axis 2cm = ₹100 and along y- axis 2cm = 2 Households.

[4]', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-2914e8-5-0', '2914e8', 24, '5', '(i) Find the equation of a line passing through the intersection of 2x - y = 1 and 3x + 2y + 9 = 0 and making an angle of 45⁰ with the positive direction of the X axis.

[3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-2914e8-5-1', '2914e8', 25, '5', '(ii) Prove the following identity:

$$cot^2 A \left( \frac{secA - 1}{1 + sinA} \right) + sec^2 A \left( \frac{sinA - 1}{1 + secA} \right) = 0$$ [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-2914e8-5-2', '2914e8', 26, '5', '(iii) The sum of the third and seventh terms of an A.P. is 6 and their product is 8. Find the sum of the first sixteen terms of the A.P. [4]', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-2914e8-6-0', '2914e8', 27, '6', '(i) If HCF of (x - 5)(x² - x - a) and (x - 4)(x² - 2x - b) is (x - 4)(x - 5), find the values of a and b.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-2914e8-6-1', '2914e8', 28, '6', '(ii) In the figure, O is the centre of a circle of radius 5 cm. T is a point such that OT = 13 cm and OT intersects circle at E. If AB is a tangent to the circle at E, find the length of AB, where TP and TQ are two tangents to the circle.
[3]', 3, 'Circles', 'short', 5, '2914e8__Dps_Newton_p5_img_0_jpeg.webp', NULL),
  ('MQ-2914e8-6-2', '2914e8', 29, '6', '(iii) If X = $$\begin{bmatrix} \sin 90^\circ & \sec 60^\circ \\ \cosec 30^\circ & \cos 0^\circ \end{bmatrix}$$ and I is the unit matrix of the same order as X,

then show that X² - 2X = 3I.

[4]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-2914e8-7-0', '2914e8', 30, '7', '(i) A game of cards numbered 1 to 40, one card is drawn at random. Find the probability that the card drawn has a number:

- a) a perfect square
- b) a prime number
- c) a multiple of 2 and 3

[3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-2914e8-7-1', '2914e8', 31, '7', '(ii) Wax cylinder of diameter 21cm and height 21cm is chipped off and shaped to form a cone of maximum volume. The chipped off wax is recast into a solid sphere. Find the diameter of the sphere.', NULL, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-2914e8-7-2', '2914e8', 32, '7', '(iii) In the given figure, QS is a diameter of the circle. PT touches the circle at R. If, ∠PRQ = 20⁰, ∠SPR = 50⁰ and ∠RSM = 35⁰, find:

- (a) ∠SQR
- (b) ∠PSR
- (c) ∠SMR
- (d) ∠MRT
[4]', 4, 'Circles', 'long', 5, '2914e8__Dps_Newton_p5_img_1_jpeg.webp', NULL),
  ('MQ-2914e8-8-0', '2914e8', 33, '8', '(i) Solve the following inequation and represent the solution set on the number line.

- 1/2 ≤ 9x/10 + 4 ≤ 2/5, x ∈ R

[3]', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-2914e8-8-1', '2914e8', 34, '8', '(ii) In Δ ABC, D is a point on side BC.

∠ABC = ∠DAC, AB = 16cm, AC = 8cm, AD = 10cm

a) Prove that ΔACD ~ ΔBCA

b) Find BC and CD
[3]', 3, 'Similarity', 'short', 6, '2914e8__Dps_Newton_p6_img_0_jpeg.webp', NULL),
  ('MQ-2914e8-8-2', '2914e8', 35, '8', '(iii) A factory manufactures nuts and bolts of various sizes. The measurement of inner diameters of 1000 nuts is given in the following frequency table. Determine the mean inner diameter per nut using the short cut method.

| Diameter(mm) | 43 - 45 | 46 - 48 | 49 - 51 | 52 - 54 | 55 - 57 |
| --- | --- | --- | --- | --- | --- |
| No: of nuts | 175 | 236 | 200 | 196 | 193 |[{"box_2d": [127, 483, 231, 500], "label": "text", "caption": "[4, [4, [4, (4)]', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-2914e8-9-0', '2914e8', 36, '9', '(i) A trader buys ''x'' articles for a total cost of ₹600.

a) Write down the cost of one article in terms of ''x''. If the cost per article was ₹5 more, the number of articles that can be bought for ₹600 would be four less.

b) Write down the equation in ''x'' for the above situation and solve it to find ''x''.', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-2914e8-9-1', '2914e8', 37, '9', '[4, [4][{"box_2d": [100, 631, 974, 747], "label": "table", "caption": "<table><tr><th>(ii) Use graph paper to answer this question.<br/>The table given below shows the salaries of 100 persons.</th><td>Salary(in thousand ₹)</td><td>5000 – 10,000</td><td>10000-15000</td><td>15000-20000</td><td>20000-25000</td><td>25000-30000</td><td>30000-35000</td><td>35000-40000</td><td>40000-45000</td><td>45000-50000</td></tr><tr><th>No. of persons</th><td>4</td><td>7</td><td>10</td><td>10<br/>12</td><

Draw an ogive of the given data.

Hence use your graph to find the following:

- a) Median
- b) Lower Quartile
- c) Number of persons whose salary is above ₹28,000.
- d) Persons earning between ₹18,000 and ₹24,000 are thinking of changing their jobs.
- Find how many persons are planning for a new job.

[6]', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-2914e8-10-0', '2914e8', 38, '10', '(i) $$\frac{x}{b-c} = \frac{y}{c-a} = \frac{z}{a-b}$$ , prove that

a) x + y + z = 0

b) ax +by +cz = 0

[3]', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-2914e8-10-1', '2914e8', 39, '10', '(ii) Using ruler and compasses construct a triangle ABC where AB = 3cm, BC = 4cm and ∠ ABC = 90⁰. Hence construct a circle circumscribing the triangle ABC. Measure and write down the radius of the circle. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-2914e8-10-2', '2914e8', 40, '10', '(iii) The horizontal distance between two towers is 150m. The angle of elevation of the top and the angle of depression of the bottom of the first tower as observed from the second tower is 30⁰ and 26⁰ respectively. Find the heights of the two towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-85f3a4-1-0', '85f3a4', 0, '1', '(a) Find the value of ''k'' if 4x³ - 2x² + kx + 5 leaves remainder -10 when divided by 2x+1. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-85f3a4-1-1', '85f3a4', 1, '1', '(b) In a trapezium ABCD, side AB is parallel to side DC; and the diagonals AC and BD intersect each other at point P. Prove that: PA × PD = PB × PC [3]', 3, 'Similarity', 'short', 1, NULL, NULL),
  ('MQ-85f3a4-1-2', '85f3a4', 2, '1', '(c) John deposits Rs. 1600 per month in a bank for 18 months in a recurring deposit account. If he gets Rs. 31080 at the time of maturity, what is the rate of interest per annum? [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-85f3a4-2-0', '85f3a4', 3, '2', '(a) The point A (-3, 2) is reflected in the x-axis to the point A''. Point A'' is then reflected in the origin to point A". [3]
(i) Write down the co-ordinates of A".
(ii) Write down a single transformation that maps A onto A".', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-85f3a4-2-1', '85f3a4', 4, '2', '(b) In the given figure, O is the centre of the circle and AB is a tangent to the circle at B. If AB = 15 cm and AC = 7.5 cm, calculate the radius of the circle. [3]', 3, 'Circles', 'short', 2, '85f3a4__Dr_Mts_Pun_p2_img_0_jpeg.webp', NULL),
  ('MQ-85f3a4-2-2', '85f3a4', 5, '2', '(c) A metal pipe has a bore (inner diameter) of 5 cm. The pipe is 5 mm thick all round. Find the weight, in kilogram, of 2 metres of the pipe if 1 cm³ of the metal weights 7.7 g. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-85f3a4-3-0', '85f3a4', 6, '3', '(a) Given $$A = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}$$ and $$B = \begin{pmatrix} -4 & -1 \\ -3 & -2 \end{pmatrix}$$

(i) find the matrix 2A+B
(ii) find the matrix C such that B+C = 0 [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-85f3a4-3-1', '85f3a4', 7, '3', '(b) In what ratio is the line joining (2, -3) and (5, 6) divided by the x-axis. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-85f3a4-3-2', '85f3a4', 8, '3', '(c) Solve the following inequation and write down the solution set on real number line: [4]

$$11x - 4 < 15x + 4 \leq 3x + 14; \quad x \in W$$', 4, 'Linear Inequations', 'long', 2, NULL, NULL),
  ('MQ-85f3a4-4-0', '85f3a4', 9, '4', '(a) Without using trigonometric tables, calculate: [3]

$$4 \text{ Sin } 76^\circ. 2 \text{ Cos } 14^\circ + 2 \text{ Cos } 76^\circ. 4 \text{ Sin } 14^\circ - 4 \text{ Sin } 0^\circ + 4 \text{ Sec } 60^\circ$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-85f3a4-4-1', '85f3a4', 10, '4', '(b) Rakesh went on a tour to Goa. He took a room in a hotel for two days at the rate of Rs.5000 per day. On the same day, his friend Jacob also joined him. Hotel provided an extra bed charging Rs.1000 per day for the bed. How much GST, at the rate of 28% is charged by the hotel in the bill to Rakesh for both the days? [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-85f3a4-4-2', '85f3a4', 11, '4', '(c) If the mean of the following distribution is 3, find the value of p and median of distribution. [4]
| x | 1 | 2 | 3 | 5 | p + 4 |
| --- | --- | --- | --- | --- | --- |
| f | 9 | 6 | 9 | 3 | 6 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-85f3a4-5-0', '85f3a4', 12, '5', '(a) If 5th and 6th terms of an A.P are respectively 6 and 5. Find the 11th term of the A.P. [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-85f3a4-5-1', '85f3a4', 13, '5', '(b) The radius of a solid right circular cylinder decreases by 20% and its height increases by 10%. Find the percentage change in its curved surface area. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-85f3a4-5-2', '85f3a4', 14, '5', '(c) Find the amount of the bill of given data. [4]

| Rate per piece (in Rs.) | Number of pieces | Discount % | GST% |
| --- | --- | --- | --- |
| 18 | 360 | 10 | 12 |
| 12 | 480 | 20 | 18 |
| 12 | 120 | 5 | 12 |
| 28 | 150 | 20 | 28 |', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-85f3a4-6-0', '85f3a4', 15, '6', '(a) If x = -3 and x = 2/3 are solutions of quadratic equation \( mx^{2} + 7x + n = 0 \) , find the values of m and n. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-85f3a4-6-1', '85f3a4', 16, '6', '(b) An integer is chosen at random from 1 to 50. Find the probability that number is; [3]

(i) divisible by 5

(ii) a perfect square

(iii) a prime number', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-85f3a4-6-2', '85f3a4', 17, '6', '(c)

\[
\text {If} \times = \frac {\sqrt {a + 3 b} + \sqrt {a - 3 b}}{\sqrt {a + 3 b} - \sqrt {a - 3 b}}, \text {prove that:} 3 b x ^ {2} - 2 a x + 3 b = 0. \tag {4}
\]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-85f3a4-7-0', '85f3a4', 18, '7', '(a) The area of the base of a conical solid is \( 38.5 \, cm^{2} \) and its volume is \( 154 \, cm^{3} \) . Find the curved surface area of the solid. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-85f3a4-7-1', '85f3a4', 19, '7', '(b) If the sides of a quadrilateral ABCD touch a circle, prove that AB + CD = BC + AD. [3]', 3, 'Circles', 'short', 4, '85f3a4__Dr_Mts_Pun_p4_img_0_jpeg.webp', NULL),
  ('MQ-85f3a4-7-2', '85f3a4', 20, '7', '(c) Manish opens a Recurring Deposit Account with the Bank of Rajasthan and deposits ₹ 600 per month for 20 months. Calculate the maturity value of this account, if the bank pays interest at the rate of 10% per annum. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-85f3a4-8-0', '85f3a4', 21, '8', '(a) Prove: Sec²A. Cosec²A = tan²A + Cot²A + 2 [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-85f3a4-8-1', '85f3a4', 22, '8', '(b) In the given figure, O is centre of the circle. If ∠AOB = 140° and ∠OAC = 50°; find:
(i) ∠OBC
(ii) ∠OAB
(ii) ∠CBA [3]', 3, 'Circles', 'short', 4, '85f3a4__Dr_Mts_Pun_p4_img_1_jpeg.webp', NULL),
  ('MQ-85f3a4-8-2', '85f3a4', 23, '8', '(c) The line joining the points (2, 1) and (5, -8) is trisected at the points P and Q, point P lies on the line 2x - y + k = 0, find the value of k. Also, find the co-ordinates of point Q. [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-85f3a4-9-1', '85f3a4', 24, '9', '(b) Show that the points P (a, b + c), Q (b, c + a) and R (c, a + b) are collinear. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-85f3a4-9-2', '85f3a4', 25, '9', '(c) A man on a cliff observes a boat, at an angle of depression of \( 30^{0} \) , which is sailing towards the shore to the point immediately beneath him. Three minute later, the angle of depression of the boat is found to be \( 60^{0} \) . Assuming that the boat sails uniform speed, determine the total time taken by boat to reach the shore. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-85f3a4-10-0', '85f3a4', 26, '10', '(a) [6]

The following distribution represents the height of 160 students of a school.

| Height (in cm) | No. of Students |
| --- | --- |
| 140-145 | 12 |
| 145-150 | 20 |
| 150-155 | 30 |
| 155-160 | 38 |
| 160-165 | 24 |
| 165-170 | 16 |
| 170-175 | 12 |
| 175-180 | 8 |

Draw an ogive for the given distribution taking 2 cm = 5 cm of height on one axis and 2 cm = 20 students on the other axis. Using the graph, determine:

i. The median height.
ii. The interquartile range.
iii. The number of students whose height is above 172 cm.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-85f3a4-10-1', '85f3a4', 27, '10', '(b) For a dealer A, the list price of an article is Rs. 9000, which he sells to dealer B at some lower price. Further, dealer B sells the same article to a customer at its list price. If the rate of GST is 18% and dealer B paid a tax, under GST, equal to Rs. 324 to the government, find the amount (inclusive of GST) paid by dealer B. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-85f3a4-11-0', '85f3a4', 28, '11', '(a) In triangle ABC, the co-ordinates of vertices A, B and C are (4, 7), (-2, 3) and (0, 1) respectively. Find the equation of median through vertex A. Also, find the equation of the line through vertex B and parallel to AC. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-85f3a4-11-1', '85f3a4', 29, '11', '(b) Calculate the angles x, y and z if: \( x/3 = y/4 = z/5 \) [3]', 3, 'Ratio and Proportion', 'short', 5, '85f3a4__Dr_Mts_Pun_p6_img_0_jpeg.webp', NULL),
  ('MQ-85f3a4-11-2', '85f3a4', 30, '11', '(c) From a point P outside the circle, with centre O, tangents PA and PB are drawn. [4]

Prove that:

(i) ∠AOP= ∠BOP
(ii) OP is the perpendicular bisector of chord AB.', 4, 'Circles', 'long', 6, NULL, NULL),
  ('MQ-8b6e84-1-0', '8b6e84', 0, '1', 'i) A dealer in a city buys some goods worth ₹ 6000 from the same city. If the rate of GST is 18%, then CGST paid by him is ________.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹ 1080', '₹ 540', '₹ 6540', '₹ 7080']::text[]),
  ('MQ-8b6e84-1-1', '8b6e84', 1, '1', 'ii) If $x \in I$, then the solution set of the inequation $1 < 2x + 5$ is ________.', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['\(\{\dots \dots , - 4, - 3\}\)', '\(\{\dots \dots , - 4, - 3, - 2\}\)', '\(\{-2, -1, 0, 1, \ldots\}\)', '\(\{-1,0,1,\ldots \}\)']::text[]),
  ('MQ-8b6e84-1-2', '8b6e84', 2, '1', 'iii) If the equation $$2x^2 - 5x + (k + 3) = 0$$ has equal roots, then the value of k is _______.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['$$\frac{9}{8}$$', '$$-\frac{9}{8}$$', '$$\frac{1}{8}$$', '$$-\frac{1}{8}$$']::text[]),
  ('MQ-8b6e84-1-3', '8b6e84', 3, '1', 'iv) The mean proportional between $$\frac{1}{2}$$ and 128 is _______.', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['64', '32', '16', '8']::text[]),
  ('MQ-8b6e84-1-4', '8b6e84', 4, '1', 'v) In a cylinder, if radius is doubled and height is halved, then the volume will be _______.', 1, 'Mensuration', 'MCQ', 2, NULL, array['halved', 'doubled', 'four times', 'same']::text[]),
  ('MQ-8b6e84-1-5', '8b6e84', 5, '1', 'vi) If PA and PB are two tangents to a circle with centre O such that $$\angle APB = 80^\circ$$, then $$\angle AOP$$ is:', 1, 'Circles', 'MCQ', 2, '8b6e84__Euroschool_p2_img_0_jpeg.webp', array['$$40^\circ$$', '$$50^\circ$$', '$$60^\circ$$', '$$70^\circ$$']::text[]),
  ('MQ-8b6e84-1-6', '8b6e84', 6, '1', 'vii) If the coordinates of one end of a diameter of a circle are (2, 3) and coordinates of its centre are (-2, 5), then the coordinates of the other end of the diameter is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(-6, 7)', '(6, -7)', '(-4, 2)', '(5, 3)']::text[]),
  ('MQ-8b6e84-1-7', '8b6e84', 7, '1', 'viii) Which of the following points is invariant with respect to the line $$y = -2$$?', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(-2, 3)', '(2, 3)', '(3, -2)', '(3, 2)']::text[]),
  ('MQ-8b6e84-1-8', '8b6e84', 8, '1', 'ix) In the given figure, if O is the centre of the circle, then the value of x is ______.', 1, 'Circles', 'MCQ', 3, '8b6e84__Euroschool_p3_img_0_jpeg.webp', array['40°', '50°', '45°', '60°']::text[]),
  ('MQ-8b6e84-1-9', '8b6e84', 9, '1', 'x) If the slope of the line passing through the points (2, 5) and (x, 3) is 2, then the value of x is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['2', '1', '-1', '3']::text[]),
  ('MQ-8b6e84-1-10', '8b6e84', 10, '1', 'xi) The probability of getting a number which is neither prime nor composite in single throw of a dice is ______.', 1, 'Probability', 'MCQ', 3, NULL, array['$$\frac{5}{6}$$', '1', '$$\frac{1}{6}$$', '0']::text[]),
  ('MQ-8b6e84-1-11', '8b6e84', 11, '1', 'xii) The remainder when $$2x^3 + 9x^2 + 4x - 10$$ is divided by $$x + 3$$ is ______.', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-3', '4', '5', '-5']::text[]),
  ('MQ-8b6e84-1-12', '8b6e84', 12, '1', 'xiii) If $$2x, x + 10$$ and $$3x + 2$$ are in AP, then $$x =$$ ______.', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['0', '2', '4', '6']::text[]),
  ('MQ-8b6e84-1-13', '8b6e84', 13, '1', 'xiv) If $$\begin{bmatrix} x + 2y & 3y \\ 4x & 2 \end{bmatrix} = \begin{bmatrix} 0 & -3 \\ 8 & 2 \end{bmatrix}$$, then the value of $$x - y =$$ ______.', 1, 'Matrices', 'MCQ', 3, NULL, array['-3', '1', '3', '5']::text[]),
  ('MQ-8b6e84-1-14', '8b6e84', 14, '1', 'xv) A data has 25 observations arranged in descending order. ______ observation represents the median.', 1, 'Statistics', 'MCQ', 3, NULL, array['$$12^{th}$$', '$$13^{th}$$', '$$14^{th}$$', '$$15^{th}$$']::text[]),
  ('MQ-8b6e84-2-0', '8b6e84', 15, '2', 'i) Solve the given inequation and graph the solution on the number line. [4]

$$-2 \frac{2}{3} \leq x + \frac{1}{3} < 3 + \frac{1}{3}, x \in R$$', 4, 'Linear Inequations', 'long', 4, NULL, NULL),
  ('MQ-8b6e84-2-1', '8b6e84', 16, '2', 'ii) Given: $$\begin{bmatrix} 6 & -2 \\ 2 & 3 \end{bmatrix} \cdot M = \begin{bmatrix} 10 \\ -4 \end{bmatrix}$$ Find: M. [2 1] [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-8b6e84-2-2', '8b6e84', 17, '2', 'iii) Use a graph paper for this question.

Draw a histogram for the following data and find:

a) Mode
b) Modal class

[4]

| Marks | 130 – 140 | 140 – 150 | 150 – 160 | 160 – 170 | 170 – 180 | 180 – 190 | 190 – 200 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 8 | 10 | 25 | 12 | 7 | 5 | 3 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-8b6e84-3-0', '8b6e84', 18, '3', 'i) If $$\frac{4m + 3n}{4m - 3n} = \frac{7}{4}$$, using properties of proportion, find: [4]

a) \(m:n\)
b) \(\frac{2m^2 + 11n^2}{2m^2 - 11n^2}\)', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-8b6e84-3-1', '8b6e84', 19, '3', 'ii) Prove that: \(\frac{\cot A}{\operatorname{cosec} A + 1} + \frac{\operatorname{cosec} A + 1}{\operatorname{cot} A} = 2 \sec A\) [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-8b6e84-3-2', '8b6e84', 20, '3', 'iii) In the given figure, O is the centre of the circle and PQ is the diameter. [5]

Given: $$\angle SPQ = 45^{\circ}$$

$$\angle POT = 150^{\circ}$$

Find: a) $$\angle PST$$

b) \(\angle PUT\)
c) \(\angle\) QTR
d) \(\angle\) QRT', 5, 'Circles', 'long', 4, '8b6e84__Euroschool_p4_img_0_jpeg.webp', NULL),
  ('MQ-8b6e84-4-0', '8b6e84', 21, '4', 'i) A retailer buys a TV set from a manufacturer for ₹ 25,000. He marks the price of the TV 20% above his cost price and sells it to a consumer at 10% discount on the marked price. If the sales are intra-state and the rate of GST is 12%, find:

a) the marked price of the TV [3]
b) the amount consumer pays to buy the TV
c) GST paid by the retailer to the Central and State Governments.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-8b6e84-4-1', '8b6e84', 22, '4', 'ii) In the given figure, AB and CD are two parallel chords of the circle with centre O.

BP and DP are tangents at B and D. If ∠ABC = 60°, find [3]

a) \(\angle BOD\)
b) \(\angle BPD\)
c) \(\angle OBD\)', 3, 'Circles', 'short', 5, '8b6e84__Euroschool_p5_img_0_jpeg.webp', NULL),
  ('MQ-8b6e84-4-2', '8b6e84', 23, '4', 'iii) Use a graph paper for this question.

Points A and B have the co-ordinates (-2, 4) and (-4, 1) respectively. Find:

a) The co-ordinates of \( \mathbf{A}'' \), the image of \( \mathbf{A} \) in the line \( x = 0 \).
b) The co-ordinates of \( \mathbf{B}'' \), the image of \( \mathbf{B} \) in the y-axis.
c) The co-ordinates of \( \mathbf{A}'''' \), the image of \( \mathbf{A} \) in the line \( \mathbf{BB}'' \).
d) Assign a special name to the figure B''A''BA".

[4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-8b6e84-5-0', '8b6e84', 24, '5', 'i) If the point C (-1, 2) divides the line segment joining the points A (2, 5) and B, internally, in the ratio 3: 4, find the co-ordinates of B. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-8b6e84-5-1', '8b6e84', 25, '5', 'ii) Prove the following identity:

$$(1 + \cot A - \operatorname{cosec} A) (1 + \tan A + \sec A) = 2 \tag{3}$$', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-8b6e84-5-2', '8b6e84', 26, '5', 'iii) Solve the equation $$3x + \frac{1}{2x} = 5$$. Write your answer correct to two places of decimal.

[4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-8b6e84-6-0', '8b6e84', 27, '6', 'i) The sum of reciprocals of a child''s age (in years) 3 years ago and 5 years from now is $$\frac{1}{3}$$. Find the child''s present age. [3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-8b6e84-6-1', '8b6e84', 28, '6', 'ii) In the given figure, EB ⊥ AC, BG ⊥ AE and CF ⊥ AE. Prove that:

[3]

a) $$\Delta ABG \sim \Delta DCB$$

b) $$\frac{BC}{BD} = \frac{BE}{AB}$$', 3, 'Similarity', 'short', 6, '8b6e84__Euroschool_p6_img_0_jpeg.webp', NULL),
  ('MQ-8b6e84-6-2', '8b6e84', 29, '6', 'iii) Draw a pair of tangents to a circle of radius 5 cm which are inclined to each other at an angle of 60°. Measure the length of each tangent. [4]', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-8b6e84-7-0', '8b6e84', 30, '7', 'i) Find the inclination of the line passing through points A ($$-1, -\sqrt{3}$$) and B ($$\sqrt{3}, 3$$). [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-8b6e84-7-1', '8b6e84', 31, '7', 'ii) The following table gives the literacy rate (in %) in 40 cities. Using short-cut method, find the mean literacy rate.

| Literacy rate (in %) | 45 – 55 | 55 – 65 | 65 – 75 | 75 – 85 | 85 – 95 |
| --- | --- | --- | --- | --- | --- |
| No. of cities | 4 | 11 | 12 | 9 | 4 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-8b6e84-7-2', '8b6e84', 32, '7', 'iii) If $$ax^3 + bx^2 + x - 6$$ has $$(x + 2)$$ as a factor and leaves a remainder 4 when divided by $$(x - 2)$$, find the values of $$a$$ and $$b$$. [3]', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-8b6e84-8-0', '8b6e84', 33, '8', 'i) Pavan has a cumulative time deposit account in a bank. He deposits ₹ 200 per month for 4 years. If he gets ₹ 11,364 at the end of maturity period, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-8b6e84-8-1', '8b6e84', 34, '8', 'ii) There are three children in a family. Find:

a) the probability of atmost one girl.
b) the probability of at least one girl.
c) the probability that there is exactly one girl child in the family. [3]', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-8b6e84-8-2', '8b6e84', 35, '8', 'iii) The line $x - 4y - 6 = 0$ is perpendicular bisector of the line segment PQ and the coordinates of P are (1, 3), find the coordinates of Q. [4]', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-8b6e84-9-0', '8b6e84', 36, '9', 'i) The third term of an A.P is 7 and the seventh term exceeds three times the third term by 2. Find the first term, the common difference and the sum of first 20 terms. [4]', 4, 'Arithmetic Progression', 'long', 7, NULL, NULL),
  ('MQ-8b6e84-9-1', '8b6e84', 37, '9', 'ii) The daily wages of 160 workers in a building project are given below.

| Wages (in ₹) | No. of workers |
| --- | --- |
| 0 – 100 | 12 |
| 100 – 200 | 20 |
| 200 – 300 | 30 |
| 300 – 400 | 38 |
| 400 – 500 | 24 |
| 500 – 600 | 16 |
| 600 – 700 | 12 |
| 700 – 800 | 8 |

Draw a cumulative frequency curve and estimate:

a) Median wage
b) Inter quartile range
c) Percentage of workers who earn more than ₹450 a day. [6]', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-8b6e84-10-0', '8b6e84', 38, '10', 'i) Find the coordinates of points which trisect the line segment joining (5, -8) and (2, 1). [3]', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-8b6e84-10-1', '8b6e84', 39, '10', 'ii) A vessel is in the form of an open inverted cone of height \(8\mathrm{cm}\) and radius of its top is \(5\mathrm{cm}\). It is filled with water up to the brim. When lead shots, each of radius \(0.5\mathrm{cm}\) are dropped into the vessel, one-fourth of the water flows out. Find the number of lead shots dropped in the vessel. [3]', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-8b6e84-10-2', '8b6e84', 40, '10', 'iii) Two persons are standing on the opposite sides of the tower. They observe the angles of elevation of the top of the tower to be \(30^{\circ}\) and \(38^{\circ}\) respectively. Find the distance between them, if the height of the tower is \(50\mathrm{m}\). [4]', 4, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-cd554d-1-0', 'cd554d', 0, '1', 'Given

P = {9 < 2x-1 ≤ 13, x ∈ R}
Q = {x : -5 ≤ 3+4x < 15, x ∈ I}
R = { real numbers} and I = {integers}.

Represent P and Q on different number lines. Write down the elements of P ∩ Q.', NULL, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-cd554d-1-1', 'cd554d', 1, '1', 'The median of the observations 11, 12, 14, (x-2), (x+4), (x+9), 32, 38, 47 arranged in ascending order is 24. Find the value of x and hence find the mean.', NULL, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-cd554d-1-2', 'cd554d', 2, '1', 'Mr. Sharma receives an annual income of ₹900 in buying ₹ 50 shares selling at ₹80. If the dividend declared is 20%. Find the:

(i) amount invested by Mr. Sharma
(ii) percentage return on his investment.', NULL, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-cd554d-2-0', 'cd554d', 3, '2', 'Find the value of a and b if (x-1) and (x-2) are factors of x³ - ax+b.', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-cd554d-2-1', 'cd554d', 4, '2', 'Prove that: $$\frac{\cos A}{1 + \sin A} + \tan A = \sec A$$', NULL, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-cd554d-2-2', 'cd554d', 5, '2', 'c) The first and the last term of an A.P. are 17 and 350 respectively. (4)
If the common difference is 9, how many terms are there and what is their sum?', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-cd554d-3-0', 'cd554d', 6, '3', 'a) If A = $$\begin{bmatrix} 3 & -2 \\ 4 & -2 \end{bmatrix}$$ and I = $$\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$ (3)

Then find k, so that $$A^2 = kA - 2I$$.', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-cd554d-3-1', 'cd554d', 7, '3', 'b) A line AB meets X-axis at A and Y-axis at B. P(4, -1) divides AB in the ratio 1:2. (3)

(i) Find the co-ordinates of A and B.
(ii) Find the equation of the line through P and perpendicular to AB.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-cd554d-3-2', 'cd554d', 8, '3', 'c) A solid cylinder of radius 7 cm and height 14 cm is melted and recast into solid spheres of radius 3.5 cm. Find the number of spheres formed. (4)', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-cd554d-4-0', 'cd554d', 9, '4', 'a) Solve for x using the properties of proportion: (3)

$$\frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-cd554d-4-1', 'cd554d', 10, '4', 'b) Find ''k'' for which x=3 is a solution of the quadratic equation, (k+2)x²-kx + 6 =0. Thus find the other root of the equation. (3)', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-cd554d-4-2', 'cd554d', 11, '4', 'c) Draw a circle of radius 3.5 cm. Mark the centre as O. Mark a point P outside the circle at a distance of 6 cm. from the centre. Construct two tangents to the circle from the external point P. Measure and write down the length of any one tangent. (4)', 4, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-cd554d-5-0', 'cd554d', 12, '5', 'a) A bag contains twenty ₹5 coins, fifty ₹2 coins and thirty ₹1 coins. (3)
If it is equally likely that one of the coins will fall down when the Bag is turned upside down. What is the probability that the coin:

(i) will be a ₹1 coin?
(ii) will not be a ₹2 coin?
(iii) will neither be a ₹5 coin nor be a ₹1 coin?', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-cd554d-5-1', 'cd554d', 13, '5', 'b) The polynomials $2x^3 - 7x^2 + ax-6$ and $x^3-8x^2 + (2a+1)x-16$ leave the same remainder when divided by $x-2$. Find the value of $a$. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-cd554d-5-2', 'cd554d', 14, '5', 'c) Find the amount of bill for the following intra-state transaction of goods/services. (4)

| MRP (in ₹) | 12,000 | 15,000 | 9,500 | 18,000 |
| --- | --- | --- | --- | --- |
| Discount % | 30 | 20 | 30 | 40 |
| CGST % | 6 | 9 | 14 | 2.5 |', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-cd554d-6-0', 'cd554d', 15, '6', 'a) In the figure given below, ABCD is a parallelogram. E is a point on AB. CE intersects the diagonal BD at G and EF is parallel to BC. If AE : EB = 2 : 3, find (i) EF : AD
(ii) Area of triangle BEF: area of triangle ABD. (3)', 3, 'Similarity', 'short', 3, 'cd554d__Faps_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-cd554d-6-1', 'cd554d', 16, '6', 'b) A man sold 400 (₹20) shares paying 5% at ₹18 and invested the proceeds in ₹10 shares paying 7% at ₹12. How many ₹10 shares did he buy and what was the change in his income? (3)', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-cd554d-6-2', 'cd554d', 17, '6', 'c) Use graph paper for this question. Take 1 cm = 1 unit on both axes. (4)

- (i) Plot points P(2, 3) and Q(3, 1)
- (ii) Reflect P in x-axis to P''. Reflect P'' in y-axis to P''''
- (iii) Write the co.ordinates of P'' and P''''
- (iv) Reflect Q in y-axis to Q'' and reflect Q'' in the origin to Q''''
- (v) Write the co.ordinates of Q'' and Q''''
- (vi) Write the geometrical name of PQQ''''P''', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-cd554d-7-0', 'cd554d', 18, '7', 'a) The sum of 3 numbers is GP is 39/10 and their product is 1.
Find the numbers. (3)', 3, 'Geometric Progression', 'short', 4, NULL, NULL),
  ('MQ-cd554d-7-1', 'cd554d', 19, '7', 'b) In the given figure, O is the centre of the circle. Tangents at
A and B meet at C.
If |ACO| = 30°, find : (i) |BCO| (ii) |AOB| (iii) |APB| (3)', 3, 'Circles', 'short', 4, 'cd554d__Faps_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-cd554d-7-2', 'cd554d', 20, '7', 'c) A train covers a distance of 90 km. at a uniform speed. Had the
speed been 15 km/h more, it would have taken 30 minutes
less for the journey. Find the original speed of the train (4)', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-cd554d-8-0', 'cd554d', 21, '8', 'a) A map is drawn to scale 1:20000
(i) The distance between the two towns on the map is 9 cm.
Calculate the actual distance between the two towns in km.
(ii) Calculate the actual area in m² which represents 8 sq.cm.
on the map. (3)', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-cd554d-8-1', 'cd554d', 22, '8', 'b) A straight line passes through the points P(-1, 4) and
Q (5, -2). It intersects the co.ordinate axes at points A and B.
M is the midpoint of the segment AB. Find: (3)

(i) The equation of the line.
(ii) The co.ordinates of A and B
(iii) The co.ordinates of M', 3, 'Coordinate Geometry', 'short', 4, 'cd554d__Faps_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-cd554d-8-2', 'cd554d', 23, '8', 'c) If A = $$\begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}$$, then show that: A²-5A +7I = O (4)', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-cd554d-11-0', 'cd554d', 24, '11', 'a) The following table gives the ages of heads of 500 families.

| Age (in years) | f |
| --- | --- |
| under 25 | 13 |
| 25 -30 | 39 |
| 30 - 35 | 78 |
| 35 - 40 | 119 |
| 40 - 45 | 108 |
| 45 - 50 | 85 |
| 50 - 55 | 39 |
| 55 - 60 | 19 |

Draw an ogive and from it:

(i) Find their median age.
(ii) What percentage of heads are below 38 years?
(iii) What percentage of heads are above 46 years of age?', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-cd554d-11-1', 'cd554d', 25, '11', 'b) As observed from the top of a 80m tall light house, the angles of depression of two ships, on the same side of a light house in horizontal line with its base, are 30° and 40° respectively. Find the distance between the two ships. Give your answer correct to the nearest metre.', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-742c45-1-0', '742c45', 0, '1', 'a. Solve the following inequation and represent the solution on the number line

$$- 2 \frac { 2 } { 3 } \leq x + \frac { 1 } { 3 } < 3 \frac { 1 } { 3 } , x \in R .$$ [3M].', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-742c45-1-1', '742c45', 1, '1', 'b. Mr. Pardeep opened a recurring deposit account in a bank. He deposited ₹2,500 per month for two years. At the time of maturity, he got ₹ 67,500. Find

(i) the total interest earned by Mr. Pardeep.
(ii) The rate of interest per annum. [3M]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-742c45-1-2', '742c45', 2, '1', 'c. Solve the following quadratic equation and give your answer correct to

2 decimal places: 5x (x + 2) = 3. [4M]', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-742c45-2-0', '742c45', 3, '2', 'a. If A = $$\begin{bmatrix} 1 & 1 \\ 8 & 3 \end{bmatrix}$$. Find matrix X, if X = A² - 4A + 3I [3M]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-742c45-2-1', '742c45', 4, '2', 'b. The volume of solid cylinder is 616 cm³ and its height is 16cm. Calculate

(i) its radius [3M]

(ii) its total surface area and Give your answer to the nearest whole number.', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-742c45-2-2', '742c45', 5, '2', 'c. The following table shows the expenditure of 60 boys on books. Find the mode expenditure. [4M]

| Expenditure (Rs) | No of students |
| --- | --- |
| 20 – 25 | 4 |
| 25 – 30 | 7 |
| 30 – 35 | 23 |
| 35 – 40 | 18 |
| 40 – 45 | 6 |
| 45 – 50 | 2 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-742c45-3-0', '742c45', 6, '3', 'a. In the figure given below, ∠BAD = 65°, ∠ABD = 70° and ∠BDC = 45°, find:

(i) ∠BCD

(ii) ∠ADB

(iii) ∠ACB.

[3M]', 3, 'Circles', 'short', 2, '742c45__Gea_Fpe_X__p2_img_0_jpeg.webp', NULL),
  ('MQ-742c45-3-1', '742c45', 7, '3', 'b. In what ratio is the line joining P (5, 3) and Q (-5, 3) divided by the y-axis?

Also find the coordinates of the point of intersection. [3M]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-742c45-3-2', '742c45', 8, '3', 'c. Ms Anjali buys the following items:

A bag costing Rs 2200 with a discount of 25%, GST @ 12%

Books costing Rs 1820 with GST @ 18%

Medicines costing Rs 1300, GST @ 5%

Calculate (i) the total amount of GST paid

(ii) the total bill amount including GST paid by Ms.Anjali. [4M]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-742c45-4-0', '742c45', 9, '4', 'a. Find the mean of the following data and give your answer in nearest whole number. [3M]

| C.I | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| --- | --- | --- | --- | --- | --- |
| frequency | 6 | 8 | 10 | 2 | 4 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-742c45-4-1', '742c45', 10, '4', 'b. Prove that: $$\sqrt{\frac{1-\sin\theta}{1+\sin\theta}} = sec\theta - tan\theta$$ [3M]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-742c45-4-2', '742c45', 11, '4', 'c. A bag contains 5 white balls, 6 red balls and 9 green balls. A ball is drawn is drawn at random from the bag. Find the probability that the ball drawn is:

- (i) A green ball
- (ii) A white or a red ball
- (iii) Is neither a green ball nor a white ball.
- (iv) A yellow ball. [4M]', 4, 'Probability', 'long', 3, NULL, NULL),
  ('MQ-742c45-5-0', '742c45', 12, '5', 'a. A box contains 90 discs which are numbered from 1 to 90. If one disc is drawn at random from the box, find the probability that it bears a: [3M]

- (i) Two digit number.
- (ii) Perfect square number
- (iii) Number divisible by 5.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-742c45-5-1', '742c45', 13, '5', 'b. Meena has a cumulative time deposit of ₹340 per month at 6 % per annum. If she gets ₹7157 at the time of maturity, find the total time for which the account was held? [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-742c45-5-2', '742c45', 14, '5', 'c. The volume of a conical tent is 1232 m³ and the area of the base floor is 154 m². Calculate: [4M]

- (i) the radius of the floor
- (ii) height of the tent
- (iii) length of the canvas required to cover this conical tent if its width is 2m.', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-742c45-6-0', '742c45', 15, '6', 'a. The fourth term of an AP is 11 and the eighth term exceeds twice the fourth term by 5. Find the AP. [3M]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-742c45-6-1', '742c45', 16, '6', 'b. The coordinates of the points A and B are (2, -5) and (-3, 7) respectively. Find the:

- (i) slope of the line AB [3M]
- (ii) equation of the line AB
- (iii) Coordinates of the point where the line AB intersects at the y - axis.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-742c45-6-2', '742c45', 17, '6', 'c. P and Q are two points on the opposite sides of a 90 m high tower AB the base B of the tower AB and points P and Q are along the same straight line, the angles of depression of points P and Q as observed from top A of tower AB are 60° and 30° respectively.

Find the distance between P and Q correct to the nearest metre. [4M]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-742c45-7-0', '742c45', 18, '7', 'a. The mean of the following data is 16. Calculate the value of f [3M]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-742c45-7-1', '742c45', 19, '7', 'b. If (k -3), (2k + 1) and (4k + 3) are three consecutive terms of an A.P., find the value of k. [3M]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-742c45-7-2', '742c45', 20, '7', 'c. In Δ ABC, ∠ ABC = ∠ DAC.AB = 16cm, AC = 8 cm, AD = 10cm.

(i) Prove that Δ ACD is similar to Δ BCA
(ii) Find BC and CD
(iii) Find the area of Δ ACD: area of Δ ABC [4M]', 4, 'Similarity', 'long', 4, '742c45__Gea_Fpe_X__p4_img_0_jpeg.webp', NULL),
  ('MQ-742c45-8-0', '742c45', 21, '8', 'a. The marks obtained by 100 students in a mathematics tests are given below: [6M]

| C.I | 0 – 10 | 10 - 20 | 20 – 30 | 30 – 40 | 40 - 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 - 90 | 90 - 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| f | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Draw an ogive for the given distribution on a graph sheet. Use a scale of 2cm = 10 units on both the axes. Use the ogive to estimate

(i) Median
(ii) Interquartile range
(iii) No. of students who obtained more than 85% marks in the test
(iv) No. of students failed, if the pass percentage was 35', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-742c45-8-1', '742c45', 22, '8', 'b. If $$\frac{7m+2n}{7m-2n} = \frac{5}{3}$$, use properties of proportion to find: [4M]

(i) m: n
(ii) $$\frac{m^2 + n^2}{m^2 - n^2}$$', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-742c45-9-0', '742c45', 23, '9', 'a. A (-1, 3), B (4, 2) and C (3, -2) are the vertices of a triangle. (i) Find the coordinates of the centroid G of the triangle. (ii) Find the equation of the line AD, where Dis the midpoint of BC. [3M]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-742c45-9-1', '742c45', 24, '9', 'b. The difference of two natural numbers is 7 and their product is 450. Find the numbers. [3M]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-742c45-9-2', '742c45', 25, '9', 'c. Use factor theorem to factorise 2x³ + 5x² - 11x - 14 completely. [4M]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-742c45-10-0', '742c45', 26, '10', 'a. In the following figure, O is the centre of the circle and AB is a tangent to it at point B.

∠ ADC = 65°, find , (i) , ∠ACD (ii) , ∠ABO [3M]', 3, 'Circles', 'short', 5, '742c45__Gea_Fpe_X__p5_img_0_jpeg.webp', NULL),
  ('MQ-742c45-10-1', '742c45', 27, '10', 'b. If 2[3 4; 5 x] + [1 y; 0 1] = [7 0; 10 5] find the values of x and y. [3M]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-742c45-10-2', '742c45', 28, '10', 'c. With the help of the graph paper taking 1cm = 1 unit on both the axis

(i) Plot A (2,3), B (4,5) and C (7,2), the vertices of the triangle ABC

(ii) Reflect ABC on the origin and name it as A'', B'' and C''. write the coordinates.

(iii)Write the co-ordinates of the images A", B" and C". if A", B" and C" are the images of triangle ABC when reflected in the x axis.

(iv)Give a geometrical name for the figure BCC"B" [4M]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-742c45-11-0', '742c45', 29, '11', 'a. Find the value of ''a'' for which the following points A (a, 3), B (2, 1) and C (5, a) are collinear. Hence, find the equation of the line. [3M]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-742c45-11-1', '742c45', 30, '11', 'b. 6 is the mean proportion between two numbers x and y. 48 is the third proportional of x and y. find the numbers. [3M]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-742c45-11-2', '742c45', 31, '11', 'c. Using the Remainder Theorem find the remainders obtained when x³ + (kx + 8)x + k is divided by x + 1 and x - 2. Hence find k if the sum of the two remainders is 1. [4M]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-531696-1-0', '531696', 0, '1', 'i) The marked price of a micro oven is Rs. 10000. Dealer offers 20 % discount on the marked price. The selling price of micro oven is', 1, NULL, 'MCQ', 1, NULL, array['Rs. 2000', 'Rs. 6000', 'Rs. 8000', 'Rs. 10000']::text[]),
  ('MQ-531696-1-1', '531696', 1, '1', 'ii) If x ∈ R, the solution set of 1 < 3x + 5 ≤ 11 is', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['{-1, 0, 1, 2}', '{-2, -1, 0, 1}', '{-1, 0, 1}', '{-1, 0, 1, 2, 3}']::text[]),
  ('MQ-531696-1-2', '531696', 2, '1', 'iii) The roots of the quadratic equation 6x² - x - 2 = 0 are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['2/3, 1/2', '-2/3, 1/2', '2/3, -1/2', '-2/3, -1/2']::text[]),
  ('MQ-531696-1-3', '531696', 3, '1', 'iv) When x³ - 3x² + 5x - 7 is divided by x - 2, then the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['0', '1', '2', '-1']::text[]),
  ('MQ-531696-1-4', '531696', 4, '1', 'v) If A = [1 0; 0 1] then the value of A² is', 1, 'Matrices', 'MCQ', 1, NULL, array['[1 1; 0 0]', '[0 0; 1 1]', '[1 0; 0 1]', '[0 1; 1 0]']::text[]),
  ('MQ-531696-1-5', '531696', 5, '1', 'vi) The 21st term of A.P whose first two terms are -3 and 4 is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['17', '137', '143', '-143']::text[]),
  ('MQ-531696-1-6', '531696', 6, '1', 'vii) The point (0, 5) is variant under reflection is', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['the origin', 'y-axis', 'x-axis', 'both x and y axis']::text[]),
  ('MQ-531696-1-7', '531696', 7, '1', 'viii) A is a point on the y-axis whose ordinate is 6 and B is a point on the x-axis whose abscissa is 4. If P be the midpoint of AB, the co-ordinate of P are', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(2, 6)', '(2, 3)', '(4, 3)', '(3, 2)']::text[]),
  ('MQ-531696-1-8', '531696', 8, '1', 'ix) If a pole is 9m high and casts a shadow 3√3 m long on the ground then the sun''s elevation is', 1, 'Trigonometry', 'MCQ', 1, NULL, array['30°', '45°', '60°', '90°']::text[]),
  ('MQ-531696-1-9', '531696', 9, '1', 'x) A fair die is thrown once, the probability of getting an odd prime number is', 1, 'Probability', 'MCQ', 1, NULL, array['1/2', '1/3', '1', '2/3']::text[]),
  ('MQ-531696-1-10', '531696', 10, '1', 'xi) The median of the following numbers 8, 10, 7, 6, 11, 10, 6, 13, 10
a) 7 b) 8 c) 10 d) 11', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-531696-1-11', '531696', 11, '1', 'xii) The lines 7y = ax + 4 and 2y = 3 - x are perpendicular to each other then the value of ''a'' is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['-14', '-7/2', '-2/7', '14']::text[]),
  ('MQ-531696-1-12', '531696', 12, '1', 'xiii) Which term of the A.P 3, 8, 13, 18, ... is 78?', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['12th', '13th', '15th', '16th']::text[]),
  ('MQ-531696-1-13', '531696', 13, '1', 'xiv) All the congruent triangle are similar but all the similar triangles

a) Are also congruent

b) need not to be congruent

b) Both a and b

d) can''t say', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-531696-1-14', '531696', 14, '1', 'xv) The length of tangents drawn from an external point to the circle

a) Are equal

b) are not equal

b) Sometimes are equal

d) are not defined', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-531696-2-0', '531696', 15, '2', 'Q. 2) a) Mr. Prajapati has a recurring deposit account in a bank. He deposits Rs. 2500 per month for 2 years. If he gets Rs. 66,250 at the time of maturity, find: i) the interest paid by the bank ii) the rate of interest (4m)', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-531696-2-1', '531696', 16, '2', 'b) Using properties of proportion, solve for x:

$$\frac{\sqrt{x+1} + \sqrt{x-1}}{\sqrt{x+1} - \sqrt{x-1}} = \frac{4x-1}{2} \quad 5/A \tag{4m}$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-531696-2-2', '531696', 17, '2', 'c) M is the midpoint of the line segment joining the points A(0, 4) and B(6, 0). M also divides the line segment OP in the ratio 1 : 3. Find

i) Co-ordinates of M

ii) co-ordinates of P

(4m)', 4, 'Coordinate Geometry', 'long', 2, '531696__Ges_Prelim_p2_img_0_jpeg.webp', NULL),
  ('MQ-531696-3-0', '531696', 18, '3', 'Q.3) a) Use short cut method to find the mean of monthly wages of a certain number of workers. (4m)

| Monthly wages | 90-110 | 110-130 | 130-150 | 150-170 | 170-190 |
| --- | --- | --- | --- | --- | --- |
| No. Of workers | 4 | 6 | 4 | 8 | 18 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-531696-3-1', '531696', 19, '3', 'b) Prove that: $$\sqrt{\frac{1+\sin A}{1-\sin A}} = \sec A + \tan A$$ (4m)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-531696-3-2', '531696', 20, '3', 'c) Attempt this question on graph paper.

i) Plot A(3, 2) and B(5, 4) on graph paper. Take 2cm = 1 unit on both the axes.

ii) Reflect A and B in the x-axis to A'' and B'' respectively. Plot these points also on the same graph paper.

iii) Write down 1) the geometrical name of the figure ABB''A''.

2) the image A" of A, when A is reflected in the origin.

3) the single transformation that maps A'' to A". (5m)', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-531696-4-0', '531696', 21, '4', 'Q.4) a) Find the amount of the bill for the following transaction of goods/services. The GST rate is 18%. (3m)

| Quantity | 35 | 47 | 20 |
| --- | --- | --- | --- |
| MRP of each item (in Rs.) | 420 | 600 | 350 |
| Discount % | 10 | 10 | 20 |', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-531696-4-1', '531696', 22, '4', 'b) Solve the following inequation. Write the solution set and represent it on the number line.

$$-3(x - 7) \geq 15 - 7x > \frac{x+1}{3}, x \in R$$ (3m)', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-531696-4-2', '531696', 23, '4', 'c) In the following figure, i) If $\angle BAD = 96^{\circ}$, find $\angle BCD$ and $\angle BFE$

ii) Prove that : AD is parallel to FE (4m)', 4, 'Circles', 'long', 4, '531696__Ges_Prelim_p4_img_0_jpeg.webp', NULL),
  ('MQ-531696-5-0', '531696', 24, '5', 'Q.5) a) The side of a right angled triangle are $(x - 1)$ cm, $3x$ cm and $(3x + 1)$ cm.

Find : i) The value of x ii) The length of its sides (3m)', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-531696-5-1', '531696', 25, '5', 'b) If $A = \begin{bmatrix} 0 & 4 \\ 1 & 0 \end{bmatrix}$, $B = \begin{bmatrix} -2 & 0 \\ 3 & -2 \end{bmatrix}$, $C = \begin{bmatrix} -1 & -2 \\ 2 & 0 \end{bmatrix}$, show that :

$$(B - C)A = BA - CA \tag{3m}$$', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-531696-5-2', '531696', 26, '5', 'c) In the given figure, $\Delta ABC$ and $\Delta AMP$ are right angled at B and M respectively. Given $AC = 10$ cm, $AP = 15$ cm, $PM = 12$ cm.

i) Prove that $\Delta ABC \sim \Delta AMP$ ii) Find: AB and BC (4m)', 4, 'Similarity', 'long', 4, '531696__Ges_Prelim_p4_img_1_jpeg.webp', NULL),
  ('MQ-531696-6-0', '531696', 27, '6', 'Q.6) a) 40 students enter for a game of shot-put competition. The distance thrown (in metres) is recorded below :

| Distance(in m) | 12-13 | 13-14 | 14-15 | 15-16 | 16-17 | 17-18 | 18-19 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 9 | 12 | 9 | 4 | 2 | 1 |

Use a graph paper to draw on ogive for the above distribution. Use a scale of $2\mathrm{cm} = 1\mathrm{m}$ on one axis and $2\mathrm{cm} = 5$ students on the other axis.

Hence using your graph find: i) the median ii) upper quartile

iii) no. of students who cover a distance which is above $16\frac{1}{2}$ m. (6M)', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-531696-6-1', '531696', 28, '6', 'b) The sum of 3rd and 11th terms of an A.P is 34. Find the sum of its 13 terms. (4m)', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-531696-7-0', '531696', 29, '7', 'Q.7) a) P(3, 4), Q(7, -2) and R(-2, -1) are the vertices of triangle PQR. Write Down the equation of the median of the triangle through R. (3m)', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-531696-7-1', '531696', 30, '7', 'b) If a : b = 5 : 3 then find the value of (5a + 8b) : (5a - 8b) (3m)', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-531696-7-2', '531696', 31, '7', 'c) Prove the following identity: $$\frac{\sec A}{\sec A - 1} + \frac{\sec A}{\sec A + 1} = 2\cosec^2 A$$ (4m)', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-531696-8-0', '531696', 32, '8', 'Q. 8) a) A box contains of 4 red, 5 black and 6 white balls. One ball is drawn at random. Find the probability that the ball drawn is:

i) black ii) red or white (3m)', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-531696-8-1', '531696', 33, '8', 'b) In the following figure, O is the centre of the circle,

$$\angle AOB = 60^{\circ}$$ and $$\angle BDC = 100^{\circ}$$. Find $$\angle OBC$$. (3m)', 3, 'Circles', 'short', 5, '531696__Ges_Prelim_p5_img_0_jpeg.webp', NULL),
  ('MQ-531696-8-2', '531696', 34, '8', 'c) Solve: $$(x^2 + 3x)^2 - (x^2 + 3x) - 6 = 0$$ (4m)

$$x^2 + 3x = 4$$', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-531696-9-0', '531696', 35, '9', 'Q.9) a) Two poles AB and PQ are standing opposite each other on either side of a road 200 m wide. From a point R between them on the road, the angles of the top of the poles AB and PQ are 45° and 40° respectively. If height of AB = 80 m, find the height of PQ correct to the nearest metre. (3m)', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-531696-9-1', '531696', 36, '9', 'b) Ashish deposits a certain sum of money every month in a R.D account for a period of 12 months. If the bank pays interest at the rate of 11% p.a and Ashish gets Rs. 12715 at the maturity value of this account. What money did he pay every month? (3m)', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-531696-9-2', '531696', 37, '9', 'c)i) Use the information given in the adjoining histogram to construct a frequency table.

$$\phi^2 - 4 - 6$$

ii) Use this table to construct an ogive. (4m)', 4, 'Statistics', 'long', 5, '531696__Ges_Prelim_p6_img_0_jpeg.webp', NULL),
  ('MQ-531696-10-0', '531696', 38, '10', 'Q.10) a) Two dice thrown at the same time. Write down all the possible outcomes.
Find the probability of getting the sum of two numbers appearing on the top
of the dice as : i) 13 ii) less than 13 iii) 10 (3m)', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-531696-10-1', '531696', 39, '10', 'b) Given a line segment AB joining the points A(-4, 6) and B(8, -3). Find
i) the ratio in which AB is divided by the y-axis.
ii) find the coordinates of the point of intersection. (3m)', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-531696-10-2', '531696', 40, '10', 'c) The expression $$4x^3 - bx^2 + x - c$$ leaves remainders 0 and 30 when divided
by x + 1 and 2x - 3 respectively. Calculate the values of b and c. Hence,
factorise the expression completely. (4m)', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-ed8de4-1-0', 'ed8de4', 0, '1', 'a) If ♦♦ = [1 - 1

-1 1] and ♦♦ is an identity matrix of order 2, find ♦♦² + 7♦♦. [3] b) The', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-ed8de4-1-1', 'ed8de4', 1, '1', '-1 1] and ♦♦ is an identity matrix of order 2, find ♦♦² + 7♦♦. [3] b) The

4th term of an A.P. is -15 and its 9th term is -30. Find the A.P. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-ed8de4-1-2', 'ed8de4', 2, '1', 'GRADE X MATHEMATICS c) Find the mean, median and mode of the following

distribution: [4]

| Daily pocket money (₹) | 60 | 70 | 80 | 90 | 100 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 8 | 5 | 6 | 7 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-ed8de4-2-0', 'ed8de4', 3, '2', 'a) Prove that \( (x + 2) \) is a factor of \( 6\diamondsuit^{3} + 13\diamondsuit^{2} + \diamondsuit - 2 \) . Hence factorise [3] the polynomial completely.', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-ed8de4-2-1', 'ed8de4', 4, '2', 'b) ABCD is a cyclic quadrilateral in the circle with centre O.

AB || DC and \( \angle CAB = 25^{\circ} \) . Find:

A

B A O

25°

(i) \( \angle COB \) (ii) \( \angle ADC \) (iii) \( \angle DAC \)', 3, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-ed8de4-2-2', 'ed8de4', 5, '2', 'c) A game of numbers has cards marked with 21, 22, 23,..., 30. A card is [4] drawn at random. Find the probability that the number on the card drawn is (i) a prime number

(ii) multiple of 3

(iii) neither divisible by 4 nor by 5

(iv) a perfect square and a perfect cube.', 4, 'Probability', 'long', 2, NULL, NULL),
  ('MQ-ed8de4-3-0', 'ed8de4', 6, '3', 'a) Solve the following quadratic equation and give your answer correct to three [3]

significant figures. (Use the square root table given at the end of the paper) \( 5 \diamondsuit^{2} - 3 \diamondsuit \)

\[
- 1 = 0
\]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ed8de4-3-1', 'ed8de4', 7, '3', 'b) Prove the following identity: [3] (1 + ◆◆◆◆◆◆◆◆ - ◆◆◆◆◆◆◆◆◆◆◆◆◆)(1 +

\[
\left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \left. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. \right. = 2
\]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-ed8de4-3-2', 'ed8de4', 8, '3', 'c) Sunita went to a shop and brought the following items. The GST rates and the [4] quantity of each items and marked price of each are given below.

| Sr. No. | Items | Price per item (in ₹) | Quantity | GST rate |
| --- | --- | --- | --- | --- |
| 1 | Walnut | 650 | 1 | 5% |
| 2 | Ice cream | 230 | 1 | 18% |
| 3 | Umbrella | 380 | 2 | 12% |

Find:

(i) the total amount of GST paid.
(ii) the total amount of the bill, correct to the nearest rupee.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-ed8de4-4-0', 'ed8de4', 9, '4', 'a) Solve the following inequation and represent the solution set on the number line. [3] -2

\[
+ \diamondsuit \diamondsuit \leq^ {7} \diamondsuit_ {3} + 2 < ^ {1 0} _ {3} + 2 \diamondsuit , \text { where } \diamondsuit \diamondsuit \in I
\]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-ed8de4-4-1', 'ed8de4', 10, '4', 'b) In the adjoining figure, OP is the bisector of AB. [3]

B AB. P (3, 4) A

O is the origin and the point P is (3, 4).

Find:

(i) the slope of OP.
(ii) the co-ordinates of points A and B.
(iii) the equation of line

X', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-ed8de4-4-2', 'ed8de4', 11, '4', 'c) The given solid figure is a cylinder surmounted by a cone.

The diameter of the base of the cylinder is 42 cm. The height of the cone is 20 cm and the total height of the solid is 50 cm. (Take $$\blacklozenge\blacklozenge = ^{22}_{7}$$)

[4]

Find :

- (i) volume of the solid.
- (ii) curved surface area of the solid.', 4, 'Mensuration', 'long', 4, 'ed8de4__Ghsjc_Fpe__p4_img_0_jpeg.webp', NULL),
  ('MQ-ed8de4-5-0', 'ed8de4', 12, '5', 'a) The sum of three numbers in an A.P. is -12 and their product is 36. [3] Find the numbers.', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-ed8de4-5-1', 'ed8de4', 13, '5', 'b) Mr. Bansal has a recurring deposit account in a bank for $$2^{1}_{2}$$ years at 8% per [3] annum. He gets ₹ 1550 as the interest on maturity.

Find (i) the monthly instalment

(ii) the maturity value.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-ed8de4-5-2', 'ed8de4', 14, '5', 'c) Use a graph paper for this question. Take 1 cm = 1 unit along both x and [4] y-axes.

- (i) Plot the points A (-3, 4), B (3, 4), C (6, 0).
- (ii) Reflect the points A, B and C in the origin and name them as A'', B'' and C'' respectively.
- (iii) Write down the co-ordinates of A'', B'' and C''.
- (iv) Write the geometrical name for the figure ABCA''B''C''.
- (v) Name one point from the figure which is invariant on
reflection in the line y = 0.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-ed8de4-6-0', 'ed8de4', 15, '6', 'a) In what ratio does the line $\diamond\diamond = 3$ divide the line joining the points A (2, 6) [3] and B (-12, -1). Find the co-ordinates of the point of intersection.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-ed8de4-6-1', 'ed8de4', 16, '6', 'b) A bag contains total of 50 balls of two colours — white and black. One ball [3] is drawn at random. If the probability of getting a white ball is $^2_5$, find the number of white balls. Also find the probability of drawing a black ball.', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-ed8de4-6-2', 'ed8de4', 17, '6', 'c) Given $[2 - 3$

$$0\ 1] \times B = [-1\ 7$$

$-3\ 3]$, where B is a matrix.

(i) State the order of the matrix B.
(ii) Find the matrix B. [4] **Question 7**', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-ed8de4-7-0', 'ed8de4', 18, '7', 'a) In $\Delta ABC$, $\angle APQ = \angle ACB$, $AP = 6$ cm,

$AQ = 5$ cm and $PB = 4$ cm.

(i) Prove that $\Delta APQ \sim \Delta ACB$.
(ii) Find the length of QC.
(iii) Find area of $\Delta APQ$ : area of $\Delta ABC$.

[3]', 3, 'Similarity', 'short', 5, 'ed8de4__Ghsjc_Fpe__p5_img_0_jpeg.webp', NULL),
  ('MQ-ed8de4-7-1', 'ed8de4', 19, '7', 'b) A dealer buys an article at a discount of 30% from the wholesaler, [3] the marked price being ₹ 8000. The dealer sells it to a consumer at a discount of 10% on the marked price. If the sales are intra-state and the rate of GST is 12%, find:

(i) the amount paid by the consumer for the article.
(ii) the GST paid by the dealer to the state government.
(iii) the GST received by the central government.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-ed8de4-7-2', 'ed8de4', 20, '7', 'c) In the figure, line PR touches the circle at point Q.

[4]

\[
\angle \mathrm{TAS} = 6 5 ^ {\circ}, \angle \mathrm{AQP} = 4 2 ^ {\circ}, \angle \mathrm{SQR} = 5 8 ^ {\circ}.
\]

Find: (i) \( \angle TQS \) (ii) \( \angle ASQ \) (iii) \( \angle ATS \)

P

S', 4, 'Circles', 'long', 5, 'ed8de4__Ghsjc_Fpe__p5_img_1_jpeg.webp', NULL),
  ('MQ-ed8de4-8-0', 'ed8de4', 21, '8', 'a) Find the value of ''◆◆'' if \( 5\diamondsuit^{3} + \diamondsuit\diamondsuit^{2} - \diamondsuit - 3 \) and \( 3\diamondsuit^{3} - 4\diamondsuit^{2} - 3\diamondsuit + \diamondsuit \) have [3] the same remainder when divided by (◆◆ - 2).', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-ed8de4-8-1', 'ed8de4', 22, '8', 'b) A solid metallic cylinder of diameter 28 cm and height 35 cm is melted and [3] recast into some right circular cones of base radius 3.5 cm and height 4 cm. Calculate the number of cones recast.', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-ed8de4-8-2', 'ed8de4', 23, '8', 'c) A building and a tower are on the same level ground. From the top of [4] the building the angle of elevation of the top of the tower is \( 30^{\circ} \) and the angle of depression of the foot of the tower is \( 60^{\circ} \) .

If the height of the building is 18 m, find:

(i) the height of the tower.
(ii) the distance between the building and the tower, correct to nearest metre.', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-ed8de4-9-0', 'ed8de4', 24, '9', 'a) The mean proportional of two numbers is 10 and their sum is 29. Find the [4] numbers.', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-ed8de4-9-1', 'ed8de4', 25, '9', 'b) Attempt this question on a graph paper. [6] Marks obtained by 80 students in an examination are given below:

| Marks | 0 -10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 10 | 15 | 13 | 20 | 9 | 7 |
Draw an ogive for the given distribution taking 2 cm = 10 marks on one axis and 2 cm = 10 students on the other axis. From the graph, find:

(i) the median marks.

(ii) the lower quartile.
(iii) number of students scoring above 40 marks.
(iv) if top 10 students qualify for merit scholarship, find the minimum marks required to qualify.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-ed8de4-10-0', 'ed8de4', 26, '10', 'a) In \(\Delta ABC\), DE \(\parallel\) BC. If AD = \(\diamond\diamond\), DB = [3]

\(\diamond \diamond - 2, \mathrm{AE} = \diamond \diamond + 2\) and \(\mathrm{EC} = \diamond \diamond - 1,\)

find the length of AB and AC. D

B C', 3, 'Similarity', 'short', 7, NULL, NULL),
  ('MQ-ed8de4-10-1', 'ed8de4', 27, '10', 'b) Rajesh deposits ₹ 500 every month in a recurring deposit scheme at 12% p.a. [3] If he gets ₹ 275 as interest on maturity, find the time for which the account is held.', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-ed8de4-10-2', 'ed8de4', 28, '10', 'c) Using properties of proportion, find \(\diamondsuit\diamondsuit : \diamondsuit\diamondsuit\) if [4] \(\diamondsuit\diamondsuit^{3}+12\diamondsuit\)

\[
6 \diamondsuit^ {2} + 8 = \diamondsuit^ {3} + 2 7 \diamondsuit
\]

\[
9 \diamondsuit^ {2} + 2 7
\]', 4, 'Ratio and Proportion', 'long', 7, NULL, NULL),
  ('MQ-ed8de4-11-0', 'ed8de4', 29, '11', 'a) Prove the following identity: \(\diamondsuit\diamondsuit\diamondsuit\diamondsuit-2\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit\diamondsuit

\[
2 \diamondsuit \diamondsuit \diamondsuit \diamondsuit \diamondsuit \diamondsuit^ {3} \diamondsuit \diamondsuit - \diamondsuit \diamondsuit \diamondsuit \diamondsuit \diamondsuit \diamondsuit \diamondsuit = \tan \diamondsuit [ 3 ]
\]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-ed8de4-11-1', 'ed8de4', 30, '11', 'b) The mean of the following distribution is 49. Find the missing frequency ‘a’. [3]

| Class | 0 – 20 | 20 – 40 | 40 – 60 | 60 – 80 | 80 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 15 | 20 | 30 | a | 10 |
| --- | --- | --- | --- | --- | --- |', 3, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-ed8de4-11-2', 'ed8de4', 31, '11', 'c) John wants to distribute 540 oranges among some students. If 30 students [4] were more, each would get 3 oranges less. Write an equation, taking the original number of students to be ◆◆, and solve it to find the original number of students.', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-fe0316-1-0', 'fe0316', 0, '1', '(i) A shopkeeper buys an article for ₹500 and sells it for ₹1000. The rate of GST is 18%. The rate of SGST and CGST are respectively', 1, 'GST and Banking', 'MCQ', 1, NULL, array['9% and 18%', '9% and 9%', '18% and 9%', '4.5% and 9%']::text[]),
  ('MQ-fe0316-1-1', 'fe0316', 1, '1', '(ii) When the discriminant of a quadratic equation is zero then the roots of the quadratic equation are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['Infinite', 'Equal', 'Unequal', 'Not real']::text[]),
  ('MQ-fe0316-1-2', 'fe0316', 2, '1', '(iii) If on dividing $4x^2 - 3kx + 5$ by $x + 2$, the remainder is $-3$, then the value of ''$k$'' is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['4', '$-4$', '3', '$-3$']::text[]),
  ('MQ-fe0316-1-3', 'fe0316', 3, '1', '(iv) A matrix $\mathbf{A}$ is of order $2 \times 3$ and the product $\mathbf{AB}$ is of order $2 \times 1$, then the order of matrix $\mathbf{B}$ is', 1, 'Matrices', 'MCQ', 2, NULL, array['$3 \times 1$', '$1 \times 3$', '$3 \times 2$', '$2 \times 1$']::text[]),
  ('MQ-fe0316-1-4', 'fe0316', 4, '1', '(v) In a recurring deposit scheme, if P is the monthly instalment and time is 3 years, then interest will be calculated on', 1, 'GST and Banking', 'MCQ', 2, NULL, array['P x 3', 'P x 36', '$\frac{\mathrm{P}(36)(36)}{2}$', '$\frac{\mathrm{P}(36)(37)}{2}$']::text[]),
  ('MQ-fe0316-1-5', 'fe0316', 5, '1', '(vi) $\tan^2\Phi - (1/\cos^2\Phi)$ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['1', '$-1$', '$\cos^2\Phi$', '$\operatorname{cosec}^2\Phi$']::text[]),
  ('MQ-fe0316-1-6', 'fe0316', 6, '1', '(vii) The roots of the quadratic equation $x^2 + x + 1 = 0$ are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['real and distinct', 'real and equal', 'not real', 'none of these']::text[]),
  ('MQ-fe0316-1-7', 'fe0316', 7, '1', '(viii) Two cylinders of same lateral surface have their heights in the ratio 3:7, then the ratio of their radii is', 1, 'Mensuration', 'MCQ', 3, NULL, array['3:7', '7:3', '9:49', '$\sqrt{3}:\sqrt{7}$']::text[]),
  ('MQ-fe0316-1-8', 'fe0316', 8, '1', '(ix) The solution set for the inequation is: -
$1 < 3x + 5 \leq 11, \ x \in N$', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['$\{-2, -1, 0, 1, 2\}$', '$\{-4, -3, -2, -1\}$', '$\{0, 1, 2\}$', '$\{1, 2\}$']::text[]),
  ('MQ-fe0316-1-9', 'fe0316', 9, '1', '(x) The mean proportion of (a + b) and ($a^3 + a^2b$) is', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['a + b', '$a^2 + ab$', '$a^2 - ab$', 'a - b']::text[]),
  ('MQ-fe0316-1-10', 'fe0316', 10, '1', '(xi) If $A = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}$ then $A^2 =$', 1, 'Matrices', 'MCQ', 3, NULL, array['A', 'O', 'I', '2A']::text[]),
  ('MQ-fe0316-1-11', 'fe0316', 11, '1', '(xii) The diameter of the base of a cone is 10cm and the height is 12 cm, then its curved surface area is', 1, 'Mensuration', 'MCQ', 3, NULL, array['$60\pi \text{ cm}^2$', '$65\pi \text{ cm}^2$', '$90\pi \text{ cm}^2$', '$120\pi \text{ cm}^2$']::text[]),
  ('MQ-fe0316-1-12', 'fe0316', 12, '1', '(xiii) In the given figure is the centre of the circle. Given that ∠DAC = 40° and AD is diameter of the circle. The degree measure of ∠ABC is', 1, 'Circles', 'MCQ', 4, 'fe0316__Gokuldham__p4_img_0_jpeg.webp', array['40°', '50°', '140°', '220°']::text[]),
  ('MQ-fe0316-1-13', 'fe0316', 13, '1', '(xiv) If sec A — tan A = k, sec A + tan A is equal to', 1, 'Trigonometry', 'MCQ', 4, NULL, array['1 - (1/k)', '1 - k', '1 +.k', '1/k']::text[]),
  ('MQ-fe0316-1-14', 'fe0316', 14, '1', '(xv) The modal class of a grouped frequency distribution is the class interval with the', 1, 'Statistics', 'MCQ', 4, NULL, array['lowest frequency', 'cumulative frequency', 'highest frequency', 'average frequency']::text[]),
  ('MQ-fe0316-2-0', 'fe0316', 15, '2', '(a) Amit deposits ₹ 500 every month in a recurring deposit account for 2 1/2 years. If the rate of interest is 10% per annum, find the amount he will receive on maturity. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-fe0316-2-1', 'fe0316', 16, '2', '(b) Find two numbers whose mean proportional is 16 and the third proportional is 128. [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-fe0316-2-2', 'fe0316', 17, '2', '(c) Prove the following identity:
(sinA+cosecA)² + (cosA +secA)² = 7+ tan²A + cot²A [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-fe0316-3-0', 'fe0316', 18, '3', '(a) 504 cones each of diameter 3.5cm and height 3 cm are melted and recast into a metallic solid cylinder of same radius. Find the height of the cylinder and its surface area. [4]', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-fe0316-3-1', 'fe0316', 19, '3', '(b) Find \(x\) and \(y\) if

\[
\left[ \begin{array}{c c} - 6 & 2 \\ y + 1 & 1 0 \end{array} \right] - 3 \left[ \begin{array}{c c} 3 x - 1 & 1 \\ 2 & 3 \end{array} \right] = \left[ \begin{array}{c c} - 1 2 & - 1 \\ - 5 & 1 \end{array} \right] \tag {4}
\]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-fe0316-3-2', 'fe0316', 20, '3', '(c) Use a graph sheet for this question. The daily wages of 120 workers working at a site are given below.

Use 2cm = ₹ 50 along one axis and 2 cm = 20 workers along other axis to draw an ogive and hence estimate:

i. i. the median wages

ii. ii. the inter - quartile range of wages

iii. percentage of workers whose daily wage is above ₹ 475.

[5]

| Wages (₹) | 250 –300 | 300 – 350 | 350 – 400 | 400 - 450 | 450 – 500 | 500 – 550 | 550 - 600 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 8 | 15 | 20 | 30 | 25 | 15 | 7 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-fe0316-4-0', 'fe0316', 21, '4', '(a) The following bill shows the GST rates and the marked price of articles:

| BILL: COMPUTERS | | |
| --- | --- | --- |
| Articles | Marked price | Rate of GST |
| Graphic Card | Rs 15500.00 | 18% |
| Laptop adapter | Rs 1900.00 | 28% |

Calculate :

(i) the CGST paid to the Government for Graphic card.

(ii) the total GST paid to the government

(iii) the total amount to be paid for the above bill.

[3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-fe0316-4-1', 'fe0316', 22, '4', '(b) Solve the following quadratic equation :

\[
(x - 1) ^ {2} - 3 x + 4 = 0
\]

Give your answer correct to three significant figures.

[3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-fe0316-4-2', 'fe0316', 23, '4', '(c) Use graph sheet for this question.

The following frequency distribution table represents the scores obtained by 100 students in an aptitude test.

Draw a histogram and hence estimate the mode from it.

Take 2 cm = 10 marks along one axis and 2 cm = 10 students along the other axis.

| Scores | 0 -10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 10 | 28 | 42 | 14 |

[4]', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-fe0316-5-0', 'fe0316', 24, '5', '(a) Find the matrix Y, if \( X^{2}-5Y=14I \) , where \( X=\begin{bmatrix}3&-5\\-4&2\end{bmatrix} \) and I is the identity matrix. [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-fe0316-5-1', 'fe0316', 25, '5', '(b) Factorise the given polynomial completely, using the Remainder Theorem:

\[
x ^ {3} + x ^ {2} - 4 x - 4 \tag {3}
\]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-fe0316-5-2', 'fe0316', 26, '5', '(c) The distance by road between two towns A and B is 216 km and by rail it is 208km. A car travels at a speed of x km/h, and the train travels at a speed which is 16km/h faster than the car.

(i)Calculate

(I) the time taken by the car to reach town B from A in terms of x.
(II) the time taken by the train to reach town B from A in terms of x.

(ii) if the train takes 2 hours less than the car to reach town B,

(I) obtain an equation in \( x \) and
(II) solve it to find the speed of the car.

(iii) Hence find speed of the train.

[4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-fe0316-6-0', 'fe0316', 27, '6', '(a) If $\frac{2}{3}$ is a root of the equation $6x^2 - x - p = 0$, find the value of $p$. Hence find the other root. [3]', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-fe0316-6-1', 'fe0316', 28, '6', '(b) Solve the following inequation and represent the solution set on the number line. [3]

$$7 \leq + 4x + 2 < 20, x \in I$$', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-fe0316-6-2', 'fe0316', 29, '6', '(c) Prove:

$$\frac{\sin A + \cos A}{\sin A - \cos A} + \frac{\sin A - \cos A}{\sin A + \cos A} = \frac{2 \sec^2 A}{\sec^2 A - 2} \tag{4}$$', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-fe0316-7-0', 'fe0316', 30, '7', '(a) A shopkeeper buys an article from the wholesaler at a price of ₹1200. He pays CGST of ₹27, the rate of GST being 18%. Find the price at which he sold the article to the consumer. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-fe0316-7-1', 'fe0316', 31, '7', '(c) In the figure given below, chord ED is parallel to the diameter AC of the circle with centre O. If $\angle CBE = 54^\circ$ and $\angle BCF = 92^\circ$.

Calculate

i. $\angle BAE$

ii. $\angle DEC$

[3]', 3, 'Circles', 'short', 7, 'fe0316__Gokuldham__p7_img_0_jpeg.webp', NULL),
  ('MQ-fe0316-7-2', 'fe0316', 32, '7', '(c) A circus tent is in the form of a cylinder surmounted by a cone. The diameter of the cylindrical portion is 24m and its height is 11m. If the vertex of the cone is 16m above the ground, find the length of canvas required to make the tent given that the width of the canvas is 2m.

[4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-fe0316-8-0', 'fe0316', 33, '8', '(a) Solve the following inequation and represent the solution set on a number line: [3]

$$-3 < \frac{-1}{2} - \frac{2x}{3} \leq \frac{5}{6}, x \in R$$', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-fe0316-8-1', 'fe0316', 34, '8', '(b) What number should be added to $2x^3 + 9x^2 + 7x$ so that $(x + 3)$ is a factor of the resulting polynomial? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 8, NULL, NULL),
  ('MQ-fe0316-8-2', 'fe0316', 35, '8', '(c) Ahmed has a recurring deposit account in a bank. He deposits ₹1250 per month for 2 years. If he gets ₹36250 at the time of maturity, find

i. the interest paid by the bank.

ii. the rate of interest [4]', 4, 'GST and Banking', 'long', 8, NULL, NULL),
  ('MQ-fe0316-9-0', 'fe0316', 36, '9', '(a) Find two consecutive positive integers such that the square of the first decreased by 17 equals 4 times the second integer. [4]', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-fe0316-9-1', 'fe0316', 37, '9', '(b) In the given figure, reflex $\angle BOD = 210^{\circ}$ and $\angle BDC = 35^{\circ}$.

Find:

i. $\angle BCD$
ii. $\angle BAD$
iii. $\angle OBD$
iv. $\angle CBD$
v. $\angle COD$', 6, 'Circles', 'long', 8, 'fe0316__Gokuldham__p8_img_0_jpeg.webp', NULL),
  ('MQ-fe0316-10-0', 'fe0316', 38, '10', '(a) Solve for $x$, using the properties of proportion:

$$\frac{x^3 + 3x}{3x^2 + 1} = \frac{341}{91} \tag{3}$$', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-fe0316-10-1', 'fe0316', 39, '10', '(b) Prove that:

$$\sec^4 A(1 - \sin^4 A) - 2 \tan^2 A = 1 \tag{3}$$', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-fe0316-10-2', 'fe0316', 40, '10', '(c) If $x^3 - 2x^2 + a x + b$ has a factor $(x+2)$ and leaves a reminder 9 when divided by $(x+1)$, find the values of $a$ and $b$. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 8, NULL, NULL),
  ('MQ-180d2c-1-0', '180d2c', 0, '1', '(i) In an intra state sale , total GST paid is equal to', 1, 'GST and Banking', 'MCQ', 1, NULL, array['SGST', 'CGST', 'sum of SGST and CGST', 'sum of SGST,CGST and IGST']::text[]),
  ('MQ-180d2c-1-1', '180d2c', 1, '1', '(ii) The value of ''m'' for which the quadratic equation $$3x^2 - 5x - 2m = 0$$ has two
distinct roots is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['$$m < \frac{-24}{25}$$', '$$m > \frac{-25}{24}$$', '$$m < \frac{24}{25}$$', '$$m > \frac{24}{25}$$']::text[]),
  ('MQ-180d2c-1-2', '180d2c', 2, '1', '(iii) On dividing $6x^3 + 5x^2 + x - 2$ by (x+1), the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['0', '- 4', '4', '- 8']::text[]),
  ('MQ-180d2c-1-3', '180d2c', 3, '1', '(iv) If $\begin{bmatrix} 12 \\ 10 \end{bmatrix} X = \begin{bmatrix} 8 & -2 \\ 1 & 4 \end{bmatrix}$, then order of matrix X is', 1, 'Matrices', 'MCQ', 2, NULL, array['1 x 1', '2 x 1', '1 x 2', '2 x 2']::text[]),
  ('MQ-180d2c-1-4', '180d2c', 4, '1', '(v) If 73 is the nth term of the A.P. : 3,8,13,18..., then n is equal to', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['14', '15', '16', '17']::text[]),
  ('MQ-180d2c-1-5', '180d2c', 5, '1', '(vi) The reflection of the point P( 4 , - 1) in the line x = 2 is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(8 , -1)', '(3, -2 )', '(0 , -1)', '(2 , -1)']::text[]),
  ('MQ-180d2c-1-6', '180d2c', 6, '1', '(vii) In the adjoining figure(not to scale), PQ is parallel to CA , CP = 3.2 cm, PB = 4 cm, BQ = 5 cm. The length of AB is', 1, 'Similarity', 'MCQ', 2, '180d2c__Gokuldham__p2_img_0_jpeg.webp', array['7.2 cm', '8.2 cm', '8.0 cm', '9.0 cm']::text[]),
  ('MQ-180d2c-1-7', '180d2c', 7, '1', '(viii) The total surface area of a hemispherical shell with inner radius 8 cm and outer radius 10 cm is', 1, 'Mensuration', 'MCQ', 3, NULL, array['392π cm²', '492π cm²', '264π cm²', '364π cm²']::text[]),
  ('MQ-180d2c-1-8', '180d2c', 8, '1', '(ix) For the given inequation - 1 ≤ 3 + 4x < 23, x ∈ I the minimum value of x is
a) -1
b) 0', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['1', '5']::text[]),
  ('MQ-180d2c-1-9', '180d2c', 9, '1', '(x) The probability of not happening of an event is 1/3, then the probability of happening of this event will be', 1, 'Probability', 'MCQ', 3, NULL, array['More than 1/3', 'Less than 1/3', 'Equal to 1/3', '50% less than 1/3']::text[]),
  ('MQ-180d2c-1-10', '180d2c', 10, '1', '(xi) Which of the following is true for a matrix A and matrix O, where O is the null matrix of same order as A', 1, 'Matrices', 'MCQ', 3, NULL, array['A + O = O + A', 'A - O = O - A', 'A - (-A) = O', 'A - O = - A']::text[]),
  ('MQ-180d2c-1-11', '180d2c', 11, '1', '(xii) The inclination of line y = √3x - 5 is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['30°', '60°', '45°', '90°']::text[]),
  ('MQ-180d2c-1-12', '180d2c', 12, '1', '(xiii) Two chords AB and CD of a circle intersect at a point P ,such that AB bisects CD as given in the figure. If PA = 8 cm , PB = 1 cm and PD = x cm, then the length of CD is', 1, 'Circles', 'MCQ', 4, '180d2c__Gokuldham__p4_img_0_jpeg.webp', array['2√2 cm', '4√2 cm', '3 cm', '9 cm']::text[]),
  ('MQ-180d2c-1-13', '180d2c', 13, '1', '(xiv) If 14+ k , 15 + 2k , 20 - k are in A. P., the value of k is', 1, 'Arithmetic Progression', 'MCQ', 4, NULL, array['5', '3', '2', '1']::text[]),
  ('MQ-180d2c-1-14', '180d2c', 14, '1', '(xv) For the following frequency distribution table with 60 elements the median class is
| Class interval | 0-50 | 50-100 | 100-150 | 150-200 | 200-250 | 250-300 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 20 | 10 | 9 | 8 | 5 |', 1, 'Statistics', 'MCQ', 4, NULL, array['50 - 100', '100 - 150', '150 - 200', '200 - 250']::text[]),
  ('MQ-180d2c-2-0', '180d2c', 15, '2', '(i) David deposits ₹1600 in a recurring deposit account in a bank for 3 1/2 years at R% p.a. rate of interest. If he gets ₹ 78,638 at the time of maturity, find

(a) The interest earned
(b) The rate of interest', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-180d2c-2-1', '180d2c', 16, '2', '(ii) Three numbers are in continued proportion. If the middle term is 12 and the sum of other two numbers is 25,find all the numbers.

[4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-180d2c-2-2', '180d2c', 17, '2', '(iii) Prove the identity: $$\left(\frac{1-\cos\theta+\sin\theta}{1+\sin\theta+\cos\theta}\right)^{2}=\frac{1-\cos\theta}{1+\cos\theta}$$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-180d2c-3-0', '180d2c', 18, '3', '(i) Surface area of a sphere is 5544 cm². It is melted and recast into hemispheres having diameter 7 cm. Find

(a) The radius of the original sphere [4]
(b) The no. of new hemispheres cast.', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-180d2c-3-1', '180d2c', 19, '3', '(ii) Find the equation of the line whose slope is -1 and which passes through P, where P divides the line segment joining A (-1, 2) and B (3,6) in the ratio 1:3.

[4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-180d2c-3-2', '180d2c', 20, '3', '(iii) Use graph paper for this question.

[Scale - On both X -axis and Y-axis: 2cm = 1 unit ]

(a) Plot A(-2, 5), B(-4, 2) , C(-4, -3) and D(-2, -5) .
(b) Reflect A, B, C and D in Y-axis to H, G , F and E respectively. Write co-ordinates of H,G, F and E.
(c) Join A,B,C,D,E,F,G and H. Write the geometrical name of figure ABCDEFGH thus formed.
(d) Write the co-ordinates of a point Q which lies on the figure boundary and is invariant in reflection in x-axis. Label point Q on the graph.
(e) Name a pair of sides from the figure formed which have same slope. [5]', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-180d2c-4-0', '180d2c', 21, '4', '(i) The following bill shows the GST rates and the marked price of articles:

| | **BILL: Stationary Mart** | | |
| --- | --- | --- | --- |
| **Articles** | **Quantity** | **Rate/item** | **Rate of GST** |
| Pen | 100 | ₹10 | --- |
| Paint brush | 50 | ₹10 | 18% |
| Metal Paper clips | 1box | ₹200 | 28% |

(a)If the SGST paid to the Government for pens is ₹ 60,find the rate of GST on pen.

(b)Calculate the total amount to be paid for the above bill. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-180d2c-4-1', '180d2c', 22, '4', '(ii) Solve the following quadratic equation:

\[
x ^ {2} - 8 x + 2 = 0
\]

Give your answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-180d2c-4-2', '180d2c', 23, '4', '(iii) Use graph paper for this question.

The following frequency distribution table gives the heights of a group of students in a class. Draw a histogram and hence estimate the modal height of the class from it.

Take 2 cm = 5 cm along one axis and 2 cm = 2 boys along the other axis.

| Height (in cm) | 150-155 | 155- 160 | 160-165 | 165- 170 | 170-175 | 175-180 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 12 | 13 | 10 | 8 | 5 | 2 |

[4]', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-180d2c-5-0', '180d2c', 24, '5', '(i) If \( \mathrm{A} = \begin{bmatrix} 4 & -2 \\ 6 & -3 \end{bmatrix} \), \( \mathrm{B} = \begin{bmatrix} 0 & 2 \\ 1 & -1 \end{bmatrix} \) and \( \mathrm{C} = \begin{bmatrix} -2 & 3 \\ 1 & -3 \end{bmatrix} \), find

\(\mathrm{A}^2 - 5 \mathrm{I} + \mathrm{BC}\), where I is the identity matrix. [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-180d2c-5-1', '180d2c', 25, '5', '(ii) In the figure given below, O is the centre of the circle, \(\angle AOC = 100^{\circ}\) Calculate

(a) \( \angle CDA \)
(b) \( \angle CBA \)
(c) \( \angle FEA \)', NULL, 'Circles', 'short', 6, '180d2c__Gokuldham__p6_img_0_jpeg.webp', NULL),
  ('MQ-180d2c-5-2', '180d2c', 26, '5', '(iii) If \( g(x) = (2x - 3) \) is a factor of \( f(x) = 2x^{3} - 9x^{2} + x + p \) , find the value of ‘p’ using the factor theorem. Hence factorize the given polynomial \( f(x) \) completely after substituting the value of p.

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-180d2c-6-0', '180d2c', 27, '6', '(i) Prove that PQR is a right-angled triangle where the co-ordinates of P,Q and R are \( P \equiv (-2,4) \) , \( Q \equiv (1,1) \) and \( R \equiv (6,6) \) using slopes, hence find the co-ordinates of the circum-centre C.

[3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-180d2c-6-1', '180d2c', 28, '6', '(ii) Prove the identity: $$\frac{\tan\theta}{\frac{\sin^3\theta}{\cos\theta} + \sin\theta.\cos\theta} = \sec^2\theta - \tan^2\theta$$ [3]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-180d2c-6-2', '180d2c', 29, '6', '(iii) The first term and the last term of an arithmetic progression are 4 and 28 respectively. If sum of its first 9 terms is 144 find [4]

- (a) the number of terms in this A.P.
- (b) the common difference', 4, 'Arithmetic Progression', 'long', 7, NULL, NULL),
  ('MQ-180d2c-7-0', '180d2c', 30, '7', '(i) A child has a die whose six faces show the letters as given below:

The die is thrown once. What is the probability of getting :

- (a) P?
- (b) Not Q?
- (c) Neither P nor Q? [3]', 3, 'Probability', 'short', 7, '180d2c__Gokuldham__p7_img_0_jpeg.webp', NULL),
  ('MQ-180d2c-7-1', '180d2c', 31, '7', '(ii) An open cylindrical vessel of internal diameter 7 cm and height 8 cm stands on a horizontal table. A right circular cone with base diameter 3.5 cm and height 8 cm is placed inside the cylinder. Find the volume of water required to fill the cylinder to the nearest cubic centimetre. [3]', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-180d2c-7-2', '180d2c', 32, '7', '(iii) In the given figure(not drawn to the scale) of a circle, the tangent PT and the secant QST meet at point T. If ∠ PQS = 30° ,

- (a) Find ∠ PRS
- (b) Find ∠ SPT
- (c) Prove that QS is a diameter , if ΔPST is an isosceles triangle with PS = ST.
- (d) Find length of the tangent PT ,if QS =16 cm and ST= 9 cm.

[4]', 4, 'Circles', 'long', 7, '180d2c__Gokuldham__p7_img_1_jpeg.webp', NULL),
  ('MQ-180d2c-8-0', '180d2c', 33, '8', '(i) Solve the following inequation and represent the solution set on a number line:

\[
- \frac {4}{3} \leq 2 \left(\frac {x}{4} + 1\right) - \frac {4}{3} < \frac {5}{6}, x \in R
\]', 3, 'Linear Inequations', 'short', 8, NULL, NULL),
  ('MQ-180d2c-8-1', '180d2c', 34, '8', '(ii) Calculate mean (correct to the nearest whole number) for the following frequency distribution table using Step-Deviation Method. Take assumed mean A = 50.

| CLASS INTERVAL | FREQUENCY |
| --- | --- |
| 25-35 | 7 |
| 35-45 | 9 |
| 45-55 | 8 |
| 55-65 | 10 |
| 65-75 | 6 |

[3]

[3]', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-180d2c-8-2', '180d2c', 35, '8', '(iii) In the given figure, \(\angle ACB = \angle ADE = \angle CEB = 90^{\circ}\).

(a) Prove that :ΔBEC ~ CDE
(b) If BC: CE = 3:2 and
(c) BE = 9.3cm, find CD.

[4]', 4, 'Similarity', 'long', 8, '180d2c__Gokuldham__p8_img_0_jpeg.webp', NULL),
  ('MQ-180d2c-9-0', '180d2c', 36, '9', '(i) By increasing the speed of a car by 10km/hr, the time of journey for a distance of 72 km is reduced by 36 minutes. Take the original speed of car to be x km/hr, frame a quadratic equation and solve it to find the value of x.

[4]', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-180d2c-9-1', '180d2c', 37, '9', '(ii) Use a graph paper for this question. [6]

Use scale: 2cm = 3goals along one axis and 2 cm = 5 countries along another axis.

The goals scored by 32 countries , participating in FIFA Football World Cup 2022 are given below.

Draw an ogive and hence use it to estimate:

i. the median number of goals to the nearest natural number
ii. the lower quartile number of goals to the nearest natural number
iii. percentage of countries who scored 12 or more goals.

| Goals scored | No. of countries |
| --- | --- |
| 0-3 | 8 |
| 3-6 | 14 |
| 6-9 | 4 |
| 9-12 | 2 |
| 12-15 | 2 |
| 15-18 | 2 |', 6, 'Statistics', 'long', 9, NULL, NULL),
  ('MQ-180d2c-10-0', '180d2c', 38, '10', '(i) Solve for x using properties of proportion:

$$16 \left( \frac{a-x}{a+x} \right)^3 = \frac{a+x}{a-x} \tag{3}$$', 3, 'Ratio and Proportion', 'short', 9, NULL, NULL),
  ('MQ-180d2c-10-1', '180d2c', 39, '10', '(ii) Using ruler and compasses, construct a regular hexagon of side 5.5 cm. Hence construct a circle circumscribing the hexagon. Measure and write the length of the circum-radius.', NULL, 'Constructions', 'short', 9, NULL, NULL),
  ('MQ-180d2c-10-2', '180d2c', 40, '10', '(iii) From top a building 10 m high, the angle of elevation of top a tree is 45° and the angle of depression of its foot is 15°. Find the height of the tree (correct to the nearest meter).', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-aa5296-1-0', 'aa5296', 0, '1', 'a) Find mode and median from the following frequency distribution

| Number | 8 | 9 | 11 | 13 | 12 | 10 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 3 | 8 | 15 | 17 | 14 | 12 | 12 | 8 | 6 |', NULL, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-aa5296-1-1', 'aa5296', 1, '1', 'b) Solve the following inequation and represent solution on the real number line

$$- 3 < - \frac { 1 } { 2 } - \frac { 2 x } { 3 } \leq \frac { 5 } { 6 } x \in \mathrm { R }$$ [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-aa5296-1-2', 'aa5296', 2, '1', 'a) Shilpa has a 4 year recurring deposit account in a bank. She deposits Rs. 800 per month. If she gets Rs. 48200 at the time of maturity find

i) the rate of interest
ii) the total interest earned by Shilpa [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-aa5296-2-0', 'aa5296', 3, '2', 'a) Show that $(x - 5)$ is a factor of $2x^3 - 3x^2 - 29x - 30$. Hence factorise the expression completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-aa5296-2-1', 'aa5296', 4, '2', 'b) Prove the identity :-

$$\frac{\sin A}{1+\cos A} = \text{CosecA} - \text{Cot.A} \tag{3}$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-aa5296-2-2', 'aa5296', 5, '2', 'c) In the figure $\angle BAD = 65^\circ$, $\angle ABD = 70^\circ$ and $\angle BDC = 45^\circ$ [4]

i) Prove that AC is a diameter the circle.

ii) Find $\angle ACB$', 4, 'Circles', 'long', 2, 'aa5296__Gokuldham__p2_img_0_jpeg.webp', NULL),
  ('MQ-aa5296-3-0', 'aa5296', 6, '3', 'a) Solve for $x$ and $y$

$$4 \begin{pmatrix} 1 \\ 2x \end{pmatrix} + \begin{pmatrix} 4x \\ 3y \end{pmatrix} = \begin{pmatrix} 16 \\ 18 \end{pmatrix} \tag{3}$$', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-aa5296-3-1', 'aa5296', 7, '3', 'b) i) What ratio does the y axis divides the join of A (8, 5) and B (-3, 2)

ii) Also find the coordinates of point of intersection. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-aa5296-3-2', 'aa5296', 8, '3', 'c) Earth taken out on digging a cylindrical tank of diameter 8m is spread all around the tank uniformly to a width of 1m to form an embankment of height 3m. Calculate the depth of the tank correct to 2 decimal places. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-aa5296-4-0', 'aa5296', 9, '4', 'a). Solve the quadratic equation

$$x^2 - 3(x + 3) = 0 \tag{3}$$

Give your answer correct to two significant figures.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-aa5296-4-2', 'aa5296', 10, '4', 'c) Given equation of line L₁, is y = 4 [4]

i) Write the slope of line \(\mathbf{L}_2\) if \(\mathbf{L}_2\) is the bisector of angle O
ii) Write the Co-ordinates of point P
iii) Write the equation of \(\mathbf{L}_2\)', 4, 'Coordinate Geometry', 'long', 3, 'aa5296__Gokuldham__p3_img_0_jpeg.webp', NULL),
  ('MQ-aa5296-5-0', 'aa5296', 11, '5', 'a) Find the values of ''p'' for which the equation \(px^2 - 6x + p = 0\) has real roots. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-aa5296-5-1', 'aa5296', 12, '5', 'b) Factorise: \(6x^{3} - 23x^{2} + 9x + 18\) [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-aa5296-5-2', 'aa5296', 13, '5', 'c) Plot P(2,4), Q(-2, 1) and R(5, 0). Reflect points P and Q in x-axis to get P'' and Q''

i) Write co-ordinates of P'' and Q''
ii) Give a geometrical name to the figure formed by joining PQQ''P''R
iii) Name two points from the figure which are invariant on reflection in x axis [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-aa5296-6-0', 'aa5296', 14, '6', 'a) In ΔABC, ∠APQ = ∠ACB, AP = 6cm, AQ = 5cm and PB = 4cm.

i) Prove ΔAPQ∩ΔACB

ii) Find the length of QC [3]', 3, 'Similarity', 'short', 4, 'aa5296__Gokuldham__p4_img_0_jpeg.webp', NULL),
  ('MQ-aa5296-6-1', 'aa5296', 15, '6', 'b) The sum of first 3 terms of an A. P. is -3 and the product is 8. Find the A. P. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-aa5296-6-2', 'aa5296', 16, '6', 'c) The radius of a roller is \(35\mathrm{cm}\) and its length is \(3\mathrm{m}\). If it takes 30 revolutions to level a playground; find

i) the area of the playground
ii) the cost of leveling at Rs 5 per m² [4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-aa5296-7-0', 'aa5296', 17, '7', 'a) Two circles with centers O and P intersect at B and D, ABC is a straight line. If ∠AOD = 120° find ∠DPC. [3]', 3, 'Circles', 'short', 5, 'aa5296__Gokuldham__p5_img_0_jpeg.webp', NULL),
  ('MQ-aa5296-7-1', 'aa5296', 18, '7', 'b) A(7, -5), B(5, 3) and C(-9, -1) form a triangle. Find

i) Co-ordinates of centroid
ii) Equation of altitude through A. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-aa5296-7-2', 'aa5296', 19, '7', 'c) $$A = \begin{pmatrix} -4 & 6 \\ 3 & -5 \end{pmatrix}$$, $$B = [-4 \quad 2]$$

and PA = B Find

i) the order of matrix P.
ii) the matrix P. [4]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-aa5296-8-0', 'aa5296', 20, '8', 'a) Rizvi opens a recurring deposit in a bank. If the rate of interest is 7% p.a. and he receives Rs. 5150 from the bank after 2 years.

Calculate the monthly deposit. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-aa5296-8-1', 'aa5296', 21, '8', 'b) Find the value of p for which the lines 2x + 3y - 7 = 0 and

4y - px - 12 = 0 are parallel to each other [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-aa5296-8-2', 'aa5296', 22, '8', 'c) i) Construct a ΔABC with BC = 6 cm, AB = 5.5 cm and ∠ABC = 105°

ii) Construct a circle circumscribing ΔABC.
iii) Locate a point P on the circumference of the circle which is equidistant from AB and BC.
iv) Measure and record the length of BP. [4]', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-aa5296-9-0', 'aa5296', 23, '9', 'a) Calculate the mean of the following frequency distribution by Step Deviation Method.

| Class | 0 – 25 | 25 – 50 | 50 – 75 | 75 – 100 | 100 – 125 | 125 – 150 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 8 | 16 | 13 | 6 | 3 |

[3]', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-aa5296-9-1', 'aa5296', 24, '9', 'b) Find the value of x which satisfy the inequation and graph the solution on real number line

$$-2 < 3 - 2x \leq 5, x \in W \tag{3}$$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-aa5296-9-2', 'aa5296', 25, '9', 'c) ABCD is a parallelogram where A (x, y), B (5, 8), C (4, 7) and D (2, – 4)

Find

i) Coordinates of A
ii) Equation of diagonal BD [4]', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-aa5296-10-0', 'aa5296', 26, '10', 'a) Find the value of a and b if (x – 1) is a factor of ax³ – x² + bx + 6 and when this polynomial is divided by (x – 3), the remainder is 30 [3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-aa5296-10-1', 'aa5296', 27, '10', 'b) The mean of the following distribution is 9.6. Find the missing frequency ''a''

| x | 5 | 7 | 9 | 11 | 13 | 15 |
| --- | --- | --- | --- | --- | --- | --- |
| f | 4 | 6 | a | 4 | 2 | 5 |', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-aa5296-10-2', 'aa5296', 28, '10', 'c) Prove that [3]

$$(\text{Cosec}\theta - \text{Sin}\theta) (\text{Sec}\theta - \text{Cos}\theta) = \frac{1}{\tan\theta + \text{Cot}\theta} \tag{4}$$', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-aa5296-11-0', 'aa5296', 29, '11', 'a) The monthly income of a group of employees is given below:-

| Monthly Income | No. of employee |
| --- | --- |
| 8000 – 9000 | 5 |
| 9000 – 10000 | 9 |
| 10000 – 11000 | 16 |
| 11000 – 12000 | 22 |
| 12000 – 13000 | 26 |
| 13000 – 14000 | 18 |
| 14000 – 15000 | 11 |
| 15000 – 16000 | 8 |
| 16000 – 17000 | 5 |

Using scale 2 cm = Rs. 1000 on one axis , 2 cm = 20 employees , draw the ogive and from it determine

i) the median income
ii) the lower quartile
iii) the number of employees getting above Rs. 15,500
iv) the number of employees getting below Rs. 9,500', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-aa5296-11-1', 'aa5296', 30, '11', 'b) Find the value of p for which the equation $$px^2 - 4x + 2 = 0$$ has real and equal roots and hence solve the equation', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-0f4ee3-c-0', '0f4ee3', 0, 'c', '(c) Using a graph paper draw a histogram for the given distribution showing the number of runs scored by 50 batsmen. Estimate the mode of the data :

[3]

[4] 2c

| Runs scored | 3000– 4000 | 4000– 5000 | 5000– 6000 | 6000– 7000 | 7000– 8000 | 8000– 9000 | 9000– 10000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of batsmen | 4 | 18 | 9 | 6 | 7 | 2 | 4 |', 3, 'Statistics', 'short', 1, '0f4ee3__Graphs_Que_p2_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-x-0', '0f4ee3', 1, NULL, 'Use graph paper for this question (Take 2 cm = 1 unit along both X and Y axis). ABCD is a quadrilateral whose vertices are A(2, 2), B(2, -2), C(0, -1) and D(0, 1).

[4]

(i) Reflect quadrilateral ABCD on the Y-axis and name it as A''B''CD.
(ii) Write down the coordinates of A'' and B''.
(iii) Name two points which are invariant under the above reflection.
(iv) Name the polygon A''B''CD.', 4, 'Coordinate Geometry', 'long', 3, '0f4ee3__Graphs_Que_p4_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-0', '0f4ee3', 2, 'b', '(b) Use Graph paper for this question.

[6]

A survey regarding height (in cm) of 60 boys belonging to Class 10 of a school was conducted. The following data was recorded :

| Height in cm | 135–140 | 140–145 | 145–150 | 150–155 | 155–160 | 160–165 | 165–170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Taking 2 cm = height of 10 cm along one axis and 2 cm = 10 boys along the other axis draw an ogive of the above distribution. Use the graph to estimate the following :

- (i) the median
- (ii) lower quartile
- (iii) if above 158 cm is considered as the tall boys of the class. Find the number of boys in the class who are tall.', 6, 'Statistics', 'long', 5, '0f4ee3__Graphs_Que_p6_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-1', '0f4ee3', 3, 'b', '(b) Use a graph paper for this question (Take 2 cms = 1 unit on both x and y axis)

(i) Plot the following points :

$$A(0, 4), B(2,3), C(1,1) \text{ and } D(2,0)$$

(ii) Reflect points B, C, D on the y-axis and write down their coordinates. Name the images as B'', C'', D'' respectively.

Scanned by CamScanner
Mathematics 2017

(iii) Join the points $A, B, C, D, D'', C'', B''$ and $A$ in order, so as to form a closed figure.

Write down equation of the line of symmetry of the figure formed.**', NULL, 'Coordinate Geometry', 'short', 7, '0f4ee3__Graphs_Que_p9_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-2', '0f4ee3', 4, 'b', '(b) The daily wages of 80 workers in a project are given below.

[4]

| Wages (in ₹) | 400–450 | 450–500 | 500–550. | 550–600 | 600–650 | 650–700 | 700–750 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 2 | 6 | 12 | 18 | 24 | 13 | 5 |

Use a graph paper to draw an ogive for the above distribution. (Use a scale of 2 cm = ₹ 50 on x-axis and 2 cm = 10 workers on y-axis). Use your ogive to estimate :

(i) the median wage of the workers.
(ii) the lower quartile wage of workers.
(iii) the number of workers who earn more than ₹ 625 daily.', 4, 'Statistics', 'long', 10, '0f4ee3__Graphs_Que_p11_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-3', '0f4ee3', 5, 'b', '(b) Use graph paper for this question.

(Take 2 cm = 1 unit along both X and Y axis.)

Plot the points O (0, 0), A (-4, 4), B (-3, 0) and C (0, -3)

(i) Reflect points A and B on the Y axis and name them A'' and B'' respectively.
Write down their coordinates.
(ii) Name the figure OABCB''A''.
(iii) State the line of symmetry of this figure.**', NULL, 'Coordinate Geometry', 'short', 12, '0f4ee3__Graphs_Que_p13_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-4', '0f4ee3', 6, 'b', '(b) The table shows the distribution of the scores obtained by 160 shooters in a shooting competition. Use a graph sheet and draw an ogive for the distribution. (Take 2 cm = 10 scores on the X-axis and 2 cm = 20 shooters on the Y-axis) [6]

| Scores | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 80–90 | 90–100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 9 | 13 | 20 | 26 | 30 | 22 | 15 | 10 | 8 | 7 |

Use your graph to estimate the following :

- (i) The median.
- (ii) The interquartile range.
- (iii) The number of shooters who obtained a score of more than 85%.', 6, 'Statistics', 'long', 14, '0f4ee3__Graphs_Que_p16_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-5', '0f4ee3', 7, 'b', '(b) The histogram below represents the scores obtained by 25 students in a Mathematics mental test. Use the data to : [4]
(i) Frame a frequency distribution table.
(ii) To calculate mean.
(iii) To determine the Modal class.', 4, 'Statistics', 'long', 17, '0f4ee3__Graphs_Que_p17_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-a-0', '0f4ee3', 8, 'a', '(a) Use a graph paper for this question taking 1 cm = 1 unit along both the x and y axis:

(i) Plot the points A(0, 5), B(2, 5), C(5, 2), D(5, -2), E(2, -5) and F(0, -5).
(ii) Reflect the points B, C, D and E on the y-axis and name them respectively as B'', C'', D'' and E''.
(iii) Write the coordinates of B'', C'', D'' and E''.
(iv) Name the figure formed by BC DEE''D''C''B''.
(v) Name a line of symmetry for the figure formed. **', NULL, 'Coordinate Geometry', 'short', 19, '0f4ee3__Graphs_Que_p20_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-6', '0f4ee3', 9, 'b', '(b) The weight of 50 workers is given below:

| Weight in Kg | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 | 100-110 | 110-120 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Workers | 4 | 7 | 11 | 14 | 6 | 5 | 3 |

Draw an ogive of the given distribution using a graph sheet. Take 2 cm = 10 kg on one axis and 2cm = 5 workers along the other axis. Use a graph to estimate the following:

(i) the upper and lower quartiles.
(ii) if weighing \(95\mathrm{Kg}\) and above is considered overweight find the number of workers who are overweight.', NULL, 'Statistics', 'short', 21, '0f4ee3__Graphs_Que_p22_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-1', '0f4ee3', 10, 'c', '(c) Use graph paper to answer the following questions. (Take 2 cm = 1 unit on both axis).

(i) Plot the points $A(-4, 2)$ and $B(2, 4)$.

(ii) $A''$ is the image of $A$ when reflected in the $y$-axis. Plot it on the graph paper and write the coordinates of $A''$.

(iii) $B''$ is the image of $B$ when reflected in the line $AA''$. Write the coordinates of $B''$.

(iv) Write the geometric name of the figure $ABA''B''$.

(v) Name a line of symmetry of the figure formed.**

[4]', 4, 'Coordinate Geometry', 'long', 23, '0f4ee3__Graphs_Que_p24_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-2', '0f4ee3', 11, 'c', '(c) (Use a graph paper for this question.) The daily pocket expenses of 200 students in a school are given below :

| *Pocket expenses* (in ₹) | *Number of students* (frequency) |
| --- | --- |
| 0–5 | 10 |
| 5–10 | 14 |
| 10–15 | 28 |
| 15–20 | 42 |
| 20–25 | 50 |
| 25–30 | 30 |
| 30–35 | 14 |
| 35–40 | 12 |

Draw a histogram representing the above distribution and estimate the mode from the graph. [4]', 4, 'Statistics', 'long', 25, '0f4ee3__Graphs_Que_p26_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-7', '0f4ee3', 12, 'b', '(b) The marks obtained by 100 students in a Mathematics test are given below :

| Marks | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 80–90 | 90–100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Scanned by CamScanner
510 | Mathematics 2014

Draw an ogive for the given distribution on a graph sheet.

(Use a scale of 2 cm = 10 units on both axis).

use the ogive to estimate the :

- (i) median.
- (ii) lower quartile.
- (iii) number of students who obtained more than 85% marks in the test.
- (iv) number of students who did not pass in the test if the pass percentage was 35.', 6, 'Statistics', 'long', 27, '0f4ee3__Graphs_Que_p30_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-3', '0f4ee3', 13, 'c', '(c) Draw a histogram from the following frequency distribution and find the mode from the graph :

| Class | 0–5 | 5–10 | 10–15 | 15–20 | 20–25 | 25–30 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 5 | 18 | 14 | 8 | 5 |', NULL, 'Statistics', 'short', 31, '0f4ee3__Graphs_Que_p32_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-4', '0f4ee3', 14, 'c', '(c) Using a graph paper, plot the points A (6, 4) and B (0, 4).

- (i) Reflect A and B in the origin to get the images A'' and B''.
- (ii) Write the co-ordinates of A'' and B''.
- (iii) State the geometrical name for the figure ABA''B''.
- (iv) Find its perimeter.', NULL, 'Coordinate Geometry', 'short', 33, '0f4ee3__Graphs_Que_p34_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-8', '0f4ee3', 15, 'b', '**(b) The marks obtained by 120 students in a test are given below :**

| Marks | 0—10 | 10—20 | 20—30 | 30—40 | 40—50 | 50—60 | 60—70 | 70—80 | 80—90 | 90—100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw an ogive for the given distribution on a graph sheet.

Use suitable scale for ogive to estimate the following :

(i) The median.

(ii) The number of students who obtained more than 75% marks in the test.

(iii) The number of students who did not pass the test if minimum marks required to pass is 40.

**[6]**', 6, 'Statistics', 'long', 36, '0f4ee3__Graphs_Que_p37_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-5', '0f4ee3', 16, 'c', '(c) Using graph paper and taking 1 cm = 1 unit along both x-axis and y-axis.

(i) Plot the points A (-4, 4) and B (2, 2).
(ii) Reflect A and B in the origin to get the images A'' and B'' respectively.
(iii) Write down the co-ordinates of A'' and B''.
(iv) Give the geometrical name for the figure ABA''B''.
(v) Draw and name its lines of symmetry.**', NULL, 'Coordinate Geometry', 'short', 38, '0f4ee3__Graphs_Que_p39_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-9', '0f4ee3', 17, 'b', '(b) The following distribution represents the height of 160 students of a school.

| Height (in cm) | No. of Students |
| --- | --- |
| 140–145 | 12 |
| 145–150 | 20 |
| 150–155 | 30 |
| 155–160 | 38 |
| 160–165 | 24 |
| 165–170 | 16 |
| 170–175 | 12 |
| 175–180 | 8 |

Draw an ogive for the given distribution taking 2 cm = 5 cm of height on one axis and 2 cm = 20 students on the other axis. Using the graph, determine :

(i) The median height.

(ii) The interquartile range.

(iii) The number of students whose height is above 172 cm.

[6]', 6, 'Statistics', 'long', 40, '0f4ee3__Graphs_Que_p41_img_1_jpeg.webp', NULL),
  ('MQ-0f4ee3-c-6', '0f4ee3', 18, 'c', '(c) A Mathematics aptitude test of 50 students was recorded as follows :

| Marks | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- |
| No. of Students | 4 | 8 | 14 | 19 | 5 |

Draw a histogram for the above data using a graph paper and locate the mode.', NULL, 'Statistics', 'short', 42, '0f4ee3__Graphs_Que_p43_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-a-1', '0f4ee3', 19, 'a', '(a) Use a graph paper to answer the following questions. (Take 1 cm = 1 unit on both axes) :
(i) Plot A (4, 4), B (4, -6) and C (8, 0), the vertices of a triangle ABC.
(ii) Reflect ABC on the y-axis and name it as A''B''C''.
(iii) Write the coordinates of the images A'', B'' and C''.
(iv) Give a geometrical name for the figure AA''C''B''BC.
(v) Identify the line of symmetry of AA''C''B''BC.**', NULL, 'Coordinate Geometry', 'short', 44, '0f4ee3__Graphs_Que_p45_img_0_jpeg.webp', NULL),
  ('MQ-0f4ee3-b-10', '0f4ee3', 20, 'b', '(b) Marks obtained by 200 students in an examination are given below :

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 11 | 10 | 20 | 28 | 37 | 40 | 29 | 14 | 6 |

Draw an ogive for the given distribution taking 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis. Using the graph, determine :

- (i) The median marks
- (ii) The number of students who failed if minimum marks required to pass is 40.
- (iii) If scoring 85 and more marks is considered as grade one, find the number of students who secured grade one in the examination.', 5, 'Statistics', 'long', 46, '0f4ee3__Graphs_Que_p47_img_0_jpeg.webp', NULL),
  ('MQ-f4dc9d-1-0', 'f4dc9d', 0, '1', '(a) Mr Kumar has a recurring deposit account in a bank for 4 years at 10% p.a.
rate of interest. If he gets Rs. 28900 at the time of maturity, find the monthly
instalment paid by Mr. Kumar. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-f4dc9d-1-1', 'f4dc9d', 1, '1', '(b) If the mean of the observation 5, 16, 8, 7, x, 13, 12 is 10, calculate the
median of the observation, marks are arranged in ascending order. [3]', 3, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-f4dc9d-1-2', 'f4dc9d', 2, '1', '(c) If divided by (x - 3) the polynomials x³ - px² + 6 and 2x³ - x² + (p + 3) - 6
leave the same remainder. Find the value of p. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-f4dc9d-2-0', 'f4dc9d', 3, '2', '(a) Given A = $$\begin{bmatrix} 1 & -1 \\ 2 & -1 \end{bmatrix}$$, B = $$\begin{bmatrix} x & 1 \\ -2 & 0 \end{bmatrix}$$ and A² = (A + B). Find the value of x. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-2-1', 'f4dc9d', 4, '2', '(b) The marked price of an article is Rs. 6000. Wholesaler sells it to the dealer at 20% discount. The dealer further sells it to a customer at a discount of 10% on the marked price. If the rate of GST at each stage is 18%, find the amount of tax paid by the dealer to the government. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-2-2', 'f4dc9d', 5, '2', '(c) In the adjoining figure, AC is the diameter of the circle, AB = BC and ∠AED = 118°. Find:

(i) ∠DEC

(ii) ∠DAB', NULL, 'Circles', 'short', 2, 'f4dc9d__Greenwood__p2_img_0_jpeg.webp', NULL),
  ('MQ-f4dc9d-3-0', 'f4dc9d', 6, '3', '(a) Find the solution set of the inequation $$-2\frac{3}{4} < 12 - 2x \leq 2$$. Also, represent the solution on the number line if $$x \in \text{W}$$. [3]', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-3-1', 'f4dc9d', 7, '3', '(b) A coin is tossed, and a dice is thrown simultaneously. Describe the sample space S. Find the probability of getting:

(i) A head and an odd number

(ii) A tail

[3]', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-3-2', 'f4dc9d', 8, '3', '(c) The capacity and the base area of a right circular conical vessel are 9856 cm³ and 616 cm² respectively. Find the curved surface area of the vessel. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-f4dc9d-4-0', 'f4dc9d', 9, '4', '(a) Solve the following quadratic equation and give your answer correct to three significant figures. $$(x - 4)^2 - 5x - 3 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-4-1', 'f4dc9d', 10, '4', '(b) Prove that: $$\frac{\text{CotA} + \text{CosecA} - 1}{\text{CotA} - \text{CosecA} + 1} = \frac{1 + \text{CosA}}{\text{SinA}}$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f4dc9d-4-2', 'f4dc9d', 11, '4', '(c) Write the coordinates of the point P that divides the line joining A (-4, 1) and B (17, 10) in the ratio 1 : 2. Line AB meets the y axis at the point L.

(i) Calculate the distance OP, where O is the origin.
(ii) In what ratio does the y axis divide the line AB? [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-f4dc9d-5-0', 'f4dc9d', 12, '5', '(a) Solve for x, for the given AP, if \( (1 + 4 + 7 + \ldots + x) = 247 \) [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-f4dc9d-5-1', 'f4dc9d', 13, '5', '(b) If \( x = \frac{\sqrt{2a + 1} + \sqrt{2a - 1}}{\sqrt{2a + 1} - \sqrt{2a - 1}} \) , prove that \( x^{2} - 4ax + 1 = 0 \) , using properties of proportion. [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-f4dc9d-5-2', 'f4dc9d', 14, '5', '(c) Use graph paper to answer the following question (Take 1 cm = 1 unit along both the axes)

(i) Plot the point A (2, 3) and B (6, 3)
(ii) Reflect A in the origin and get the point D.
(iii) Reflect A in the x-axis to get the image C.
(iv) Give a geometrical name to the figure ABDC. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-f4dc9d-6-0', 'f4dc9d', 15, '6', '(a) In the given figure AB is the diameter and tangent C meets AB at P.

If \(\angle CAB = 49^0\). Find

(i) \( \angle CBA \)

(ii) \( \angle PCB \)

[3]', 3, 'Circles', 'short', 3, 'f4dc9d__Greenwood__p3_img_0_jpeg.webp', NULL),
  ('MQ-f4dc9d-6-1', 'f4dc9d', 16, '6', '(b) For what value of k will the equation \( (k + 1)x^{2} - 4kx + 9 = 0 \) have real and equal roots? [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f4dc9d-6-2', 'f4dc9d', 17, '6', '(c) Find the value of p if the mean of the following distribution is 16. [4]

| Marks | 5 | 10 | 15 | 20 | 25 |
| --- | --- | --- | --- | --- | --- |
| No of students | 3 | 7 | p | 9 | 6 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-f4dc9d-7-0', 'f4dc9d', 18, '7', '(a) Find the equation of a line whose x-intercept is 8 and y-intercept is -12. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-7-1', 'f4dc9d', 19, '7', '(b) Given \( A = \begin{bmatrix} 0 & 4 \\ 1 & 0 \end{bmatrix} \) , \( B = \begin{bmatrix} -2 & 0 \\ 3 & -2 \end{bmatrix} \) and \( C = \begin{bmatrix} -1 & -2 \\ 2 & 0 \end{bmatrix} \) .

\[
\text { Is } (\mathrm{B} - \mathrm{C}) \mathrm{A} = \mathrm{BA} - \mathrm{CA}? \tag {3}
\]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-7-2', 'f4dc9d', 20, '7', '(c) Mr. Bedi visits the market and buys the following articles:

Medicines costing Rs.950 GST @5%, a dress costing Rs.3000 GST @ 18%, a bag costing Rs.1000, with a discount of 30%, GST @10%.

(i) Calculate the total amount of GST paid.
(ii) The bill amount. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-f4dc9d-8-0', 'f4dc9d', 21, '8', '(a) Using graph paper draw a histogram for the give distribution and estimate the mode of the data. [3]

| C.I. | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 12 | 20 | 26 | 18 | 10 | 6 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-8-1', 'f4dc9d', 22, '8', '(b) Vijay has a recurring deposit account of Rs 1000 per month at 10% p.a. If he gets Rs 5550 as interest at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-9-0', 'f4dc9d', 23, '9', '(a) If \( \frac{8x + 13y}{8x - 13y} = \frac{9}{7} \) , find using properties of proportion x : y. [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-9-1', 'f4dc9d', 24, '9', '(b) Prove that: \(\sin A(1 + \tan A) + \cos A(1 + \cot A) = \sec A + \operatorname{cosec} A\) [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-f4dc9d-9-2', 'f4dc9d', 25, '9', '(c) The sum of the ages of Vivek and his younger brother Amit is 47 years. The product of their ages is 550. Find their ages. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-f4dc9d-10-0', 'f4dc9d', 26, '10', '(a) The marks obtained by 200 students were recorded as follows:

| Marks | 10-19 | 20-29 | 30-39 | 40-49 | 50-59 | 60-69 | 70-79 | 80-89 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 7 | 11 | 20 | 46 | 57 | 37 | 15 | 7 |

(i) Draw an ogive for the above distribution, on a graph sheet.
(ii) Use the ogive curve to estimate the median mark.
(iii) The number of students who scored more than 35 marks.
(iii) Find the interquartile range from the following data. [6]', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-f4dc9d-10-1', 'f4dc9d', 27, '10', '(b) The angle of elevation of the top of a tower is observed to be 60⁰. At a point 30 m vertically above the first point, of observation, the angle of elevation is found to be 45⁰.

Find: (i) The height of the tower

(ii) Its horizontal distance from the points of observation. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-f4dc9d-11-0', 'f4dc9d', 28, '11', '(a) In the given figure ABC is a right angled triangle, right angled at A and AD is perpendicular to CB.

(i) Prove that ΔABD ~ ΔCDA
(ii) If BD = 18 cm and CD = 8 cm, find AD.
(iii) Find the ratio of the area of ΔABD to area of ΔCDA. [3]', 3, 'Similarity', 'short', 5, 'f4dc9d__Greenwood__p5_img_0_jpeg.webp', NULL),
  ('MQ-f4dc9d-11-1', 'f4dc9d', 29, '11', '(b) Factorize the following polynomial completely, using the remainder

theorem: 2x³ + x² - 2x - 1 [3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-f4dc9d-11-2', 'f4dc9d', 30, '11', '(c) A (5, -2), B (6, 3), C (8, 5) are the vertices of ΔABC. Find the equation of:

(i) The median of the triangle through A.
(ii) Find the centroid of the triangle. [4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-f7b449-1-0', 'f7b449', 0, '1', 'a) Solve the following inequation and write down the solution set

$$- 3 < x - 2 \leq 9 - 2x, x \in N.$$

Represent the solution set on a real number line. [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-f7b449-1-1', 'f7b449', 1, '1', 'b) Mr. Johnson saves ₹ 80 every month and puts in a Recurring Deposit scheme paying 8% simple interest p.a. In order to receive a total amount of Rs. 5776, how many instalments must be deposited? [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-f7b449-1-2', 'f7b449', 2, '1', 'c) Using properties of proportion, solve for x. (Given that x is positive)

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$ [4]', 4, 'Ratio and Proportion', 'long', 1, NULL, NULL),
  ('MQ-f7b449-2-0', 'f7b449', 3, '2', 'a) If $$2 \begin{bmatrix} 3 & 4 \\ 5 & x \end{bmatrix} + \begin{bmatrix} 1 & y \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 7 & 0 \\ 10 & 5 \end{bmatrix}$$, find the values of x and y. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-f7b449-2-1', 'f7b449', 4, '2', 'b) Solve for x and give your answer correct to two significant figures

$$x^2 = 3x - 9 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-f7b449-2-2', 'f7b449', 5, '2', 'c) Rohit invested ₹ 9600 on ₹ 100 shares at ₹ 20 premium paying 8% dividend. He sold the shares when the price rose to ₹ 160. He invested the proceeds (excluding dividend) in 10% ₹ 50 shares at Rs. 40. Find the

i. Original number of shares.
ii. Sale proceeds
iii. New number of shares.
iv. Change in the two dividends. [4]', 4, 'Shares and Dividends', 'long', 1, NULL, NULL),
  ('MQ-f7b449-3-0', 'f7b449', 6, '3', 'a) Some cards are numbered from 10 to 40 and well shuffled. One card is drawn at random. What
is the probability that the card number is

i. a prime number.
ii. divisible by 2 and 5.
iii. a perfect square.', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-f7b449-3-1', 'f7b449', 7, '3', 'b) In the given figure if ∠ACE = 43° and ∠CAF = 62°, find the values of a, b and c.

[3]

[3]', 3, 'Circles', 'short', 2, 'f7b449__Gundecha_C_p2_img_0_jpeg.webp', NULL),
  ('MQ-f7b449-3-2', 'f7b449', 8, '3', 'c) The following figure represents a solid consisting of a right circular cylinder with a hemisphere at one end and a cone at the other. Their common radius is 7 cm. The height of the cylinder and cone are each of 4 cm. Find the volume of the solid.', NULL, 'Mensuration', 'short', 2, 'f7b449__Gundecha_C_p2_img_1_jpeg.webp', NULL),
  ('MQ-f7b449-4-0', 'f7b449', 9, '4', 'a) Using the remainder theorem, find the value of ''a'', if the division of x³ + 5x² - ax + 6 by (x - 1) leaves the remainder 2a.', NULL, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-f7b449-4-1', 'f7b449', 10, '4', 'b) If (k - 3), (2k + 1) and (4k + 3) are three consecutive terms of an A.P. Find the value of k.', NULL, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-f7b449-4-2', 'f7b449', 11, '4', 'c) The angles of depression of two ships A and B as observed from the top of a lighthouse 60m high are 60° and 45° respectively. If the two ships are on the opposite sides of the lighthouse, find the distance between the two ships. Give your answer correct to the nearest whole number.

[4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-f7b449-5-0', 'f7b449', 12, '5', 'a) If the straight lines \( 3x - 5y = 7 \) and \( 4x + ay + 9 = 0 \) are perpendicular to one another to one another, find the value of a. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-f7b449-5-1', 'f7b449', 13, '5', 'b) If \( x = \frac{2mab}{a + b} \), find the value of \( \frac{x + ma}{x - ma} + \frac{x + mb}{x - mb} \) [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-f7b449-5-2', 'f7b449', 14, '5', 'c) In the given figure, CT is a tangent to the circle at C. If \(\angle ABC = 100^{\circ}\), \(\angle ACD = 40^{\circ}\), find \(\angle ADC\) and \(\angle DCT\). [4]', 4, 'Circles', 'long', 3, 'f7b449__Gundecha_C_p3_img_0_jpeg.webp', NULL),
  ('MQ-f7b449-6-0', 'f7b449', 15, '6', 'a) Prove that \(\frac{1 + \cos^2 A}{\sin^2 A} = 2\cosec^2 A - 1\) [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-f7b449-6-1', 'f7b449', 16, '6', 'b) How many bullets, each of diameter \(1.5\mathrm{cm}\), can be made by melting a cylinder of lead having radius of the base \(5\mathrm{cm}\) and height \(18\mathrm{cm}\)? [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-f7b449-6-2', 'f7b449', 17, '6', 'c) Draw a line \( \mathrm{AB} = 5 \, \mathrm{cm} \). Mark a point \( \mathrm{C} \) on \( \mathrm{AB} \) such that \( \mathrm{AC} = 3 \, \mathrm{cm} \). Using a ruler and a compass only, construct

i. a circle of radius \(2.5\mathrm{cm}\), passing through A and C.
ii. two tangents to the circle from the external point B. Measure and record the length of the tangents. [4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-f7b449-7-0', 'f7b449', 18, '7', 'a) The bill for a certain number of people for overnight stay is ₹ 4800. If there were 4 more, the bill each person had to pay would have reduced by ₹ 200. Find the number of people staying overnight. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-f7b449-7-1', 'f7b449', 19, '7', 'b) The following table shows the marks of 120 students, obtained in mathematics, in ICSE examination. Draw an Ogive for the table:

| Marks | 30 – 40 | 40 – 50 | 50 – 60 | 60 -70 | 70 - 80 | 80 -90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students | 1 | 3 | 11 | 21 | 43 | 32 | 9 |
Use the Ogive to estimate:

i. The median.
ii. The upper quartile.
iii. The number of students who got more than \(95\%\) marks.
iv. The marks obtained by top \(20\%\) students in the examination.', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f7b449-8-0', 'f7b449', 20, '8', 'a) Write the equation of a line whose gradient is \(3/2\) and which passes through \(\mathbf{P}\), where \(\mathbf{P}\) divides the line segment joining A \((-2, 6)\) and B \((3, -6)\) in the ratio 2: 3. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-f7b449-8-1', 'f7b449', 21, '8', 'b) Find the mean of the following distribution using the short cut method: [3]

| Class Interval | 35 - 40 | 40 - 45 | 45 - 50 | 50 - 55 | 55 - 60 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | 6 | 9 | 5 | 3 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f7b449-8-2', 'f7b449', 22, '8', 'c) The shadow of a vertical tower on a level ground increases by 50 m when the altitude of the sun changes from 45° to 30°. Find the height of the tower correct to one decimal place. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-f7b449-9-0', 'f7b449', 23, '9', 'a) Calculate the median and mode for the following distribution: [3]

| Weight (in kg) | Number of students |
| --- | --- |
| 35 | 4 |
| 47 | 3 |
| 52 | 5 |
| 56 | 3 |
| 60 | 2 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f7b449-9-1', 'f7b449', 24, '9', 'b) PQR is a triangle. S is a point on the side QR of ΔPQR such that ∠PSR = ∠QPR. Given QP = 8cm, PR = 6cm and SR = 3cm.

i. Prove \(\Delta PQR\sim \Delta SPR\)
ii. Find the length of QR and PS
iii. \(\frac{\text{area of } \Delta PQR}{\text{area of } \Delta SPR}\)

[3]', 3, 'Similarity', 'short', 4, 'f7b449__Gundecha_C_p4_img_0_jpeg.webp', NULL),
  ('MQ-f7b449-9-2', 'f7b449', 25, '9', 'c) Use a graph paper for this question. The point A (3,4) is reflected to A'' on the x axis; and O'' is the image of O (the origin) when reflected in AA''.

i. Write the coordinates of \( \mathbf{A}'' \) and \( \mathbf{O}'' \).
ii. Find the perimeter of the quadrilateral AOA''O!
iii. Write the geometrical name of the figure AOA''O!

[4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-f7b449-10-0', 'f7b449', 26, '10', 'a) The nth term of G.P. is 128 and the sum of n terms is 255. If its common ratio is 2, find its first term.', NULL, 'Geometric Progression', 'short', 6, NULL, NULL),
  ('MQ-f7b449-10-1', 'f7b449', 27, '10', 'b) ABCD is a cyclic quadrilateral in which ∠DAC = 27°, ∠DBA = 50° and ∠ADB = 33°. Calculate:
[3]
i. ∠DBC ii. ∠DCB iii. ∠CAB [3]', 3, 'Circles', 'short', 6, 'f7b449__Gundecha_C_p6_img_0_jpeg.webp', NULL),
  ('MQ-f7b449-10-2', 'f7b449', 28, '10', 'c) Using a ruler and a pair of compasses only,

i. Construct a \(\Delta ABC\) with \(\mathrm{BC} = 6\mathrm{cm}\), \(\angle ABC = 120^{\circ}\) and \(\mathrm{AB} = 3.5\mathrm{cm}\).
ii. In this figure draw a circle with BC as diameter. Find a point P on the circumference of the circle which is equidistant from AB and BC.
iii. Measure \(\angle BCP\) [4]', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-f7b449-11-0', 'f7b449', 29, '11', 'a) In the figure given below, diameter AB and chord CD of a circle meet at P. TP is a tangent to the circle at T. CD = 7.8 cm, PD = 5 cm, PB = 4 cm. Find

i. AB
ii. Length of tangent PT. [3]', 3, 'Circles', 'short', 6, 'f7b449__Gundecha_C_p6_img_1_jpeg.webp', NULL),
  ('MQ-f7b449-11-1', 'f7b449', 30, '11', 'b) Find the amount of bill for the following intra state transaction of goods and services. [3]

| MRP (in ₹) | 12000 | 15000 | 9500 | 18000 |
| --- | --- | --- | --- | --- |
| Discount % | 30 | 20 | 30 | 40 |
| CGST% | 6 | 9 | 14 | 2.5 |', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-f7b449-11-2', 'f7b449', 31, '11', 'c) Draw a histogram to represent the following data and from the graph estimate the mode. [4]

| Weight (kg) | 35 – 39 | 40 – 44 | 45 - 49 | 50 - 54 | 55 – 59 |
| --- | --- | --- | --- | --- | --- |
| Number of students | 6 | 17 | 30 | 8 | 3 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-577a37-1-0', '577a37', 0, '1', '(i) A man deposited Rs x per month for y years in a R.D account. If at the time of maturity he got Rs z as interest, then the total maturity amount is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs (12xy +z)', 'Rs 12xyz', 'Rs (xy +12z)', 'Rs $$\frac{xyz}{12}$$']::text[]),
  ('MQ-577a37-1-1', '577a37', 1, '1', '(ii) Given 5x - 11 ≤ 7x - 5 < 9, x ∈ R, the smallest value of x is', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['- 3', '3', '2', '- 2']::text[]),
  ('MQ-577a37-1-2', '577a37', 2, '1', '(iii) The probability of getting a composite number when a fair die is thrown once is', 1, 'Probability', 'MCQ', 1, NULL, array['$$\frac{1}{3}$$', '$$\frac{1}{6}$$', '$$\frac{2}{3}$$', '1']::text[]),
  ('MQ-577a37-1-3', '577a37', 3, '1', '(iv) The discriminant of the quadratic equation 3x² +2x - 1 = 0 is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['4', '±4', '16', '± 16']::text[]),
  ('MQ-577a37-1-4', '577a37', 4, '1', '(v) If three quantities a, b, c are in continued proportion, then which of the following is correct', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['a: b :: a : c', 'a: c :: b : c', 'a: b :: b : c', 'a: b :: c : b']::text[]),
  ('MQ-577a37-1-5', '577a37', 5, '1', '(vi) The CGST is the tax levied by central government for _______________ transaction of goods and services', 1, 'GST and Banking', 'MCQ', 1, NULL, array['intra state', 'interstate', 'both intra and inter', 'none of these']::text[]),
  ('MQ-577a37-1-6', '577a37', 6, '1', '(vii) The reflection of point Q (1, -2) in the line y = - 1 is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(1, -4)', '(1, 4)', '(1, 0)', '(0, 1)']::text[]),
  ('MQ-577a37-1-7', '577a37', 7, '1', '(viii) Which term of the A.P 72, 68, 64, ... is 0?', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['15', '18', '19', '20']::text[]),
  ('MQ-577a37-1-8', '577a37', 8, '1', '(ix) Two matrices A and B are of order 2 x 3. The order of the matrix A + B is', 1, 'Matrices', 'MCQ', 1, NULL, array['2 x 3', '4 x 3', '3 x 2', '2 x 6']::text[]),
  ('MQ-577a37-1-9', '577a37', 9, '1', '(x) Two natural numbers which differ by 4 and the sum of whose squares is 170 are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['7, 10', '11, 7', '7,- 11', '11, - 7']::text[]),
  ('MQ-577a37-1-10', '577a37', 10, '1', '(xi) The length of the tangent drawn to a circle of radius 8 cm, from a point which is at a distance of 10 cm from the centre of the circle is', 1, 'Circles', 'MCQ', 2, NULL, array['6 cm', '7 cm', '9 cm', '2 cm']::text[]),
  ('MQ-577a37-1-11', '577a37', 11, '1', '(xii) If the diameter of the base of a cone is 10 cm and its height is 12 cm, then its curved surface area is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['60π cm²', '90π cm²', '65π cm²', '55π cm²']::text[]),
  ('MQ-577a37-1-12', '577a37', 12, '1', '(xiii) Angle in a semi circle is a angle.', 1, 'Circles', 'MCQ', 2, NULL, array['Obtuse', 'acute', 'right', 'none of these']::text[]),
  ('MQ-577a37-1-13', '577a37', 13, '1', '(xiv) If in triangles DEF and PQR, ∠D = ∠Q and ∠R = ∠E, then which of the following is not true?', 1, 'Similarity', 'MCQ', 2, NULL, array['$$\frac{EF}{PR} = \frac{DE}{QR}$$', '$$\frac{DE}{PQ} = \frac{EF}{RP}$$', '$$\frac{DE}{QR} = \frac{DF}{PQ}$$', '$$\frac{EF}{PR} = \frac{DE}{PR}$$']::text[]),
  ('MQ-577a37-1-14', '577a37', 14, '1', '(xv) The slope of a line perpendicular to the line passing through the points (2, 5) and (-3, 6) is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['5', '$$-\frac{1}{5}$$', '- 5', '0']::text[]),
  ('MQ-577a37-2-0', '577a37', 15, '2', '(i) A dealer D purchased a television from a manufacturer for Rs 20000 and sold it to a retailer R at a profit of 15%. If the rate of G.S.T is 18%, calculate

a. The amount of input CGST and input SGST for the dealer D
b. The amount of GST that dealer D has to deposit with the government
c. The amount that the retailer R has to pay for the television.

[assume that all the transactions take place in the same state]

[4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-577a37-2-1', '577a37', 16, '2', '(ii) Prove that: $$\frac{\tan \theta + \sin \theta}{\tan \theta - \sin \theta} = \frac{\sec \theta + 1}{\sec \theta - 1}$$ [4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-577a37-2-2', '577a37', 17, '2', '(iii) A solid metallic sphere of radius 6 cm is melted and made into a solid cylinder of height 32 cm. find:

a. radius of the cylinder
b. curved surface area of the cylinder. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-577a37-3-0', '577a37', 18, '3', '(i) Sneha has a recurring deposit account and deposits Rs 600 per month for a period of 5 years. If she gets Rs 43320 at the time of maturity, then find the rate of interest.[4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-577a37-3-1', '577a37', 19, '3', '(ii) In the given figure, P (3,1) is a point on the line segment AB such that AP : PB = 2 : 3. Find the coordinates A and B. find the equation of line AB. [4]', 4, 'Coordinate Geometry', 'long', 2, '577a37__Gundecha_X_p2_img_1_jpeg.webp', NULL),
  ('MQ-577a37-3-2', '577a37', 20, '3', '(iii) Use graph paper for this question. (Take 1 cm = 1 unit along both x and y axis). [5] Plot the points A(-4, 0), B(-3, 2), C(0, 4), D(4,1) and E(7, 3)

a. Reflect points B, C, D and E on the x axis and name them B'', C'', D'' and E'' respectively.
b. Join the points A, B, C, D, E'', D'', C'', B'' and A in order.
c. Name the closed figure formed', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-577a37-4-0', '577a37', 21, '4', '(i) Solve the following in equation and represent the solution set on a number line:

$$- \frac{x}{3} < \frac{x}{2} - 1 \frac{1}{3} < \frac{1}{6}, x \in R \tag{3}$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-577a37-4-1', '577a37', 22, '4', '(ii) Find the mode and median of the following frequency distribution: [3]

| X | 10 | 11 | 12 | 13 | 14 | 15 |
| --- | --- | --- | --- | --- | --- | --- |
| F | 1 | 4 | 7 | 5 | 9 | 3 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-577a37-4-2', '577a37', 23, '4', '(iii) If AB is diameter and DC is a tangent, then find :

a. ∠CBA
b. ∠CDB
c. Show that BC = BD

[4]', 4, 'Circles', 'long', 3, '577a37__Gundecha_X_p3_img_0_jpeg.webp', NULL),
  ('MQ-577a37-5-0', '577a37', 24, '5', '(iii) If $$-px^2 + qx + 6 + x^3$$ has $$(x - 1)$$ as a factor and leaves the remainder 4 when divided by $$(x + 1)$$, the values of p and q. 42 - 3', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-577a37-6-0', '577a37', 25, '6', '(i) A bag contains 5 white balls, 6 red balls and 9 green balls. A ball is drawn at random from the bag.

Find the probability that the ball drawn is:

a. a green ball
b. a white or a red ball
c. neither a green ball nor a white ball. [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-577a37-6-1', '577a37', 26, '6', '(ii) Ram has a recurring deposit of Rs 400 per month at 10% per annum. If he gets Rs 16620 at the time of maturity, find the total time in years for which the account was held.[3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-577a37-6-2', '577a37', 27, '6', '(iii) Draw a histogram for the following distribution and hence find the mode of the given data:

| Monthly income (Rs) | 6000 – 7000 | 7000 – 8000 | 8000 – 9000 | 9000 – 10000 | 10000 – 11000 | 11000 – 12000 |
| --- | --- | --- | --- | --- | --- | --- |
| No of employees | 10 | 6 | 15 | 7 | 8 | 6 |', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-577a37-7-0', '577a37', 28, '7', '(i) Use a graph paper to draw an ogive for the below distribution:

| Wages (Rs) | 450 – 500 | 500 – 550 | 550 – 600 | 600 – 650 | 650 – 700 | 700 - 750 | 750 - 800 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of workers | 8 | 12 | 18 | 22 | 26 | 10 | 4 |

Use your ogive to estimate:

a. the median wages.
b. the inter quartile range.
c. the number of workers whose income is more than Rs 675.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-577a37-7-1', '577a37', 29, '7', '(ii) By using properties of proportion, show that $$3bx^2 - 2ax + 3b = 0$$ if [4]

$$\frac{\sqrt{a+3b} + \sqrt{a-3b}}{\sqrt{a+3b} - \sqrt{a-3b}} = x$$', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-577a37-8-0', '577a37', 30, '8', '(i) In triangle PQR, PQ = 24 cm, QR = 7cm and $$\angle PQR = 90^{\circ}$$. Find the radius of the inscribed circle. [3]', 3, 'Circles', 'short', 4, '577a37__Gundecha_X_p4_img_0_jpeg.webp', NULL),
  ('MQ-577a37-8-1', '577a37', 31, '8', '(ii) Find the number of coins, 2.4 cm in diameter and 2 mm thick, to be melted to form a right circular cylinder of height 12 cm and diameter 6 cm. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-577a37-9-0', '577a37', 32, '9', '(i) Solve the quadratic equation \( 2x^{2} - 4x - 3 = 0 \). Give your answer in two decimal places.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-577a37-9-1', '577a37', 33, '9', '(ii) Find the value of ''a'' for which the following points A(a, 3), B(2, 1) and C(5, a) are collinear. Hence find the equation of line. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
