set standard_conforming_strings = on;
begin;

-- questions 2001-2500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-a73119-3-2', 'a73119', 20, '3', '(c) The point P(1, 2) divides the line segment joining the points A(-2,1) and B(x, y) in the ratio 1:2.

i. Find the coordinates of point B.
ii. What will be the equation of line PQ such that PQ is perpendicular to line AB?
iii. What will be y intercept of line PQ? [5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-a73119-4-0', 'a73119', 21, '4', '(a) A bag contains white, black and red balls. A ball is drawn at random from the bag. If the probability of getting a white ball is $\frac{3}{10}$ and that of a black ball is $\frac{2}{5}$, then:

i. find the probability of getting a red ball.
ii. if the bag contains 20 black balls then find the total number of balls in the bag. [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-a73119-4-1', 'a73119', 22, '4', '(b) If $A = \{x: 4 < 3x - 2 \leq 13, x \in R\}$, then solve and represent on the number line. [3]', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-a73119-4-2', 'a73119', 23, '4', '(c) In the figure, PM is a tangent to the circle and $PA = AM$. Prove that:

i. $\triangle PMB$ is an isosceles triangle.
ii. $PA \times PB = MB^2$ [4]', 4, 'Circles', 'long', 4, 'a73119__C_N_M_Scho_p4_img_0_jpeg.webp', NULL),
  ('MQ-a73119-5-0', 'a73119', 24, '5', '(a) In the figure, AB is the diameter of a circle with centre O. BC is a tangent to the circle at B. OP bisects the chord AD and $\angle AOP = 60^\circ$. Find $\angle C$. [3]', 3, 'Circles', 'short', 4, 'a73119__C_N_M_Scho_p4_img_1_jpeg.webp', NULL),
  ('MQ-a73119-5-1', 'a73119', 25, '5', '(b) A shopkeeper buys a washing machine for ₹ 30,000. He marks the price of the washing machine 10% above the cost price and sells it to the customer at a discount of 5% on the marked price. If the sale is intrastate and the rate of GST is 12% find:

i. the marked price of the washing machine.
ii. amount paid by the customer for washing machine inclusive of tax.
iii. the amount of tax received by the state government. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-a73119-5-2', 'a73119', 26, '5', '(c) Find the three consecutive terms in G.P. such that their sum is 38 and their product is 1728. [4]', 4, 'Geometric Progression', 'long', 4, NULL, NULL),
  ('MQ-a73119-6-0', 'a73119', 27, '6', '(a) If the mean of the following distribution table is 27, find the value of p. [3]

| Class | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 8 | p | 12 | 13 | 10 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-a73119-6-1', 'a73119', 28, '6', '(b) A cylindrical container is made from a metal sheet. The height of the cylinder is 2.1 m and diameter is 140 cm. If the container is open at the top and the metal sheet costs ₹ 400/m$^{2}$, find the cost of the metal sheet for making the container. [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-a73119-6-2', 'a73119', 29, '6', '(c) Prove that : $(\sin\theta + \cosec\theta)^2 + (\cos\theta + \sec\theta)^2 = 7 + \tan^2\theta + \cot^2\theta$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a73119-7-0', 'a73119', 30, '7', '(a) In the given figure, DE // BC, AD = 2 cm, BD = 2.5 cm, AE = 3.2 cm and DE = 4 cm. Find AC & BC. [3]', 3, 'Similarity', 'short', 5, 'a73119__C_N_M_Scho_p5_img_0_jpeg.webp', NULL),
  ('MQ-a73119-7-1', 'a73119', 31, '7', '(b) Evaluate $\begin{bmatrix} 4\sin30^\circ & 2\cos60^\circ \\ \sin90^\circ & 2\cos0^\circ \end{bmatrix} \begin{bmatrix} 1 & 0 \\ -3 & 2 \end{bmatrix}$ [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-a73119-7-2', 'a73119', 32, '7', '(c) A solid wooden toy is in the form of a hemisphere surmounted by a cone of same diameter. The diameter of the hemisphere is 7 cm, and the total wood used in the making of the toy is $166\frac{5}{6} \text{ cm}^3$ . Find the height of the toy. [4]', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-a73119-8-0', 'a73119', 33, '8', '(a) Find X, if $Y = \begin{bmatrix} 3 & 2 \\ 1 & 4 \end{bmatrix}$ and $2X + Y = \begin{bmatrix} 1 & 0 \\ -3 & 2 \end{bmatrix}$ [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-a73119-8-1', 'a73119', 34, '8', '(b) If $\frac{(2x+1)^2 + (2x-1)^2}{(2x+1)^2 - (2x-1)^2} = \frac{17}{8}$ then find the values of x. [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-a73119-8-2', 'a73119', 35, '8', '(c) The angle of elevation of a jet from a point A on the ground is $60^\circ$ . After the flight of 30 sec, the angle of elevation changes to $30^\circ$ . If the jet plane in flying at a constant height of $3600\sqrt{3}$ m, find the speed of the jet plane. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a73119-9-0', 'a73119', 36, '9', '(a) Mrs. Gupta opened a recurring deposit account in a bank. She deposited ₹ 2500 per month for two years. At the time of maturity she got ₹ 67500. Find :

1. the total interest earned by Mrs. Gupta.
2. the rate of interest per annum.', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-a73119-9-1', 'a73119', 37, '9', '(b) Prove that $3x - 2$ is a factor of the polynomial $3x^3 + 16x^2 + 15x - 18$. Hence factorize the expression completely.

[3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-a73119-9-2', 'a73119', 38, '9', '(c) If (-2) is a root of the equation $3x^2 + 7x + p = 0$, find the value of k so that the roots of the equation

$x^2 + k(4x + k - 1) + p = 0$ are real and equal roots.

[4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-a73119-10-0', 'a73119', 39, '10', '(a) If a, b, c are in continued proportion then prove: $\frac{a^2 - b^2 + c^2}{a^{-2} - b^{-2} + c^{-2}} = b^4$

[3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-a73119-10-1', 'a73119', 40, '10', '(b) A book seller buys a number of books for ₹ 1760. If he had bought 4 more books for the same amount, each book would cost ₹ 22 less. How many books did he buy?

[3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-a73119-10-2', 'a73119', 41, '10', '(c) The production yield per hectare of wheat of 100 farms of a village is given below.

Draw an ogive and from the graph determine:

| Production yield (kg/ha) | 40 - 45 | 45 - 50 | 50 - 55 | 55 - 60 | 60 - 65 | 65 - 70 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of farms | 4 | 6 | 16 | 20 | 30 | 24 |

i. the median production yield.
ii. the lower quartile range of production yield.

[4]', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-bb4e80-1-0', 'bb4e80', 0, '1', '(i) The remainder when $f(x) = x^2 - 4x + 2$ is divided by $2x+1$ is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$\frac{1}{4}$', '$\frac{17}{4}$', '-10', '22']::text[]),
  ('MQ-bb4e80-1-1', 'bb4e80', 1, '1', '(ii) Mr. Singh opened a RD account for 2 years and deposited Rs.2500 per month. At the time of maturity, he got Rs.67500. The total interest earned by him during this period is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs.8500', 'Rs.8000', 'Rs.7000', 'Rs.7500']::text[]),
  ('MQ-bb4e80-1-2', 'bb4e80', 2, '1', '(iii) If $\Delta PQR$ is similar to $\Delta PST$ and $PT:ST = 3:4$ then $QR:PR$ is', 1, 'Similarity', 'MCQ', 2, 'bb4e80__Calcutta_B_p2_img_0_jpeg.webp', array['$3:4$', '$4:3$', '$3:7$', '$4:7$']::text[]),
  ('MQ-bb4e80-1-3', 'bb4e80', 3, '1', '(iv) Two tangents are drawn at the two points A and B of a circle of center O from the external point P. If $\angle AOP = 60^\circ$ then $\angle APB$ is', 1, 'Circles', 'MCQ', 2, NULL, array['$120^\circ$', '$90^\circ$', '$60^\circ$', '$30^\circ$']::text[]),
  ('MQ-bb4e80-1-4', 'bb4e80', 4, '1', '(v) The value of $(1 + \tan A)^2 + (1 - \tan A)^2$ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['0', '2 sec A', '2 sec$^2$ A', '2 tan$^2$ A']::text[]),
  ('MQ-bb4e80-1-5', 'bb4e80', 5, '1', '(vi) Statement I : A square sheet of paper is converted into a cylinder by rolling it along its side.
Statement II : The ratio of the base radius of cylinder to the side of the square is $1:2\pi$
Which of the following is valid –', 1, 'Mensuration', 'MCQ', 2, NULL, array['Both the statements are true', 'Both the statements are false', 'Statement I is true, Statement II is false', 'Statement I is false, Statement II is true']::text[]),
  ('MQ-bb4e80-1-6', 'bb4e80', 6, '1', '(vii) Given that the sum of first n natural numbers is $\frac{n(n+1)}{2}$ then their mean is', 1, 'Statistics', 'MCQ', 2, NULL, array['$\frac{n}{2}$', '$\frac{n+1}{2}$', '$\frac{2}{n+1}$', '$\frac{2}{n}$']::text[]),
  ('MQ-bb4e80-1-7', 'bb4e80', 7, '1', '(viii) A letter is chosen at random for the letters of the word "SCHOOL". The probability of that letter is a vowel is', 1, 'Probability', 'MCQ', 2, NULL, array['$\frac{1}{6}$', '$\frac{1}{3}$', '$\frac{1}{2}$', '1']::text[]),
  ('MQ-bb4e80-1-8', 'bb4e80', 8, '1', '(ix) If $A = (1, 2)$ and $B = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$
Assertion (A) : Product of the two matrices A and B is not possible
Reason (R) : For matrix multiplication the number of columns of A is equal to number of rows in B
CBS –Pre- Board Examinations 2025
Page 2 of 6', 1, 'Matrices', 'MCQ', 2, NULL, array['A is true, R is false', 'A is false, R is true', 'Both A and R true, R is the correct reason for A', 'Both A and R true, R is incorrect reason for A']::text[]),
  ('MQ-bb4e80-1-9', 'bb4e80', 9, '1', '(x) If a:b = 3:2 then (a + b)² : (a - b)² is', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['9 : 4', '1 : 25', '25 : 1', '4 : 9']::text[]),
  ('MQ-bb4e80-1-10', 'bb4e80', 10, '1', '(xi) If a dealer in Lucknow (U.P) supplies articles to another dealer in Lucknow (U.P) with a rate of GST 18% then the C.G.S.T', 1, 'GST and Banking', 'MCQ', 3, NULL, array['18%', '10%', '9%', 'Nil']::text[]),
  ('MQ-bb4e80-1-11', 'bb4e80', 11, '1', '(xii) Amount of dividend on 1000 shares of Rs.50 each of at the rate of 12% is', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['Rs.6001', 'Rs.6000', 'Rs.6050', 'Rs.6500']::text[]),
  ('MQ-bb4e80-1-12', 'bb4e80', 12, '1', '(xiii) If x = 2 is a solution of the quadratic equation kx² + 2x -3 = 0 then the value of k is', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['-1', '-4', '1/4', '-1/4']::text[]),
  ('MQ-bb4e80-1-13', 'bb4e80', 13, '1', '(xiv) The slope and y-intercept of the line √3 y = x + 3 is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['1/√3, 3', '√3, -√3', '1/√3, √3', '3, 1/√3']::text[]),
  ('MQ-bb4e80-1-14', 'bb4e80', 14, '1', '(xv) If 25 - 4x ≤ 16, x ∈ N then the smallest value of x is', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['9/4', '2', '3', 'None of these']::text[]),
  ('MQ-bb4e80-2-0', 'bb4e80', 15, '2', '(i) Show that \((x - 1)\) is a factor of \(x^3 - 7x^2 + 14x - 8\). Hence completely factorize the above expression.', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-bb4e80-2-1', 'bb4e80', 16, '2', '(ii) Point A and B have co-ordinates (7, -3) and (1, 9) respectively, find :

(a) the slope of AB.
(b) the equation of perpendicular bisector of the line segment AB
(c) the equation of AB', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-bb4e80-2-2', 'bb4e80', 17, '2', '(i) In the adjoining figure, AD is the diameter of the circle with Centre O. If AD is parallel to BC and ∠CBD = 32°, find:

(a) \(\angle OBD\)
(b) \(\angle AOB\)
(c) \(\angle BED\)', 4, 'Circles', 'long', 3, 'bb4e80__Calcutta_B_p3_img_0_jpeg.webp', NULL),
  ('MQ-bb4e80-3-0', 'bb4e80', 18, '3', '(i) The sum of three numbers in GP is 13/12 and their product is -1. Find the numbers', 4, 'Geometric Progression', 'long', 4, NULL, NULL),
  ('MQ-bb4e80-3-1', 'bb4e80', 19, '3', '(ii) From a circular cylinder of diameter 10 cm and height 12 cm, a conical cavity of the same base radius and of the same height is hollowed out. Find the volume of the remaining solid (take n = 3.14)', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-bb4e80-3-2', 'bb4e80', 20, '3', '(iii) Use graph paper for this question (Take 2 cm = 1 unit along both X and Y axis).
ABCD is a quadrilateral whose vertices are A(2, 2), B(2, -2), C(0, -1) and D(0, 1)
(a) Reflect quadrilateral ABCD on the Y axis and name it as A''B''CD
(b) Write the coordinates of A'' and B''
(c) Name two points which are invariant under the above reflection
(d) Give the geometrical name of the figure A''B''CD', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-bb4e80-4-0', 'bb4e80', 21, '4', 'i) Ajay invests Rs 36000 in buying Rs 100 shares at Rs 20 premium. The dividend is 15% per annum.
Find :

(a) the number of shares he buys
(b) his yearly dividend
(c) the percentage return on his investment.', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-bb4e80-4-1', 'bb4e80', 22, '4', 'ii) Solve the following inequation and represent the solution set on the number line:
2x - 3 < 5x + 3 < 2x + 9, given that x ∈ R', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-bb4e80-4-2', 'bb4e80', 23, '4', 'iii) Prove the identities, sin θ (1 + tan θ) + cos θ (1 + cot θ) = sec θ + cosec θ', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-bb4e80-5-0', 'bb4e80', 24, '5', 'i) In the adjoining figure, CBA is a secant and CD is tangent to the circle.

If AB=7 cm and BC=9 cm, then,
(a) Prove that △ACD ~ △DCB.
(b) Find CD (c) Find area of △ACD : area of △DCB.', 3, 'Circles', 'short', 4, 'bb4e80__Calcutta_B_p4_img_5_jpeg.webp', NULL),
  ('MQ-bb4e80-5-1', 'bb4e80', 25, '5', 'ii) Mr. Biswas deposits Rs 1500 per month in a cumulative time deposit account in State Bank of India for two years. If at the time of maturity he gets Rs 37,875, find the rate of interest. Also find the interest earned.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-bb4e80-5-2', 'bb4e80', 26, '5', 'iii) Calculate the mean of the following distribution by Step-Deviation Method

| Class Interval | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 5 | 12 | 35 | 24 | 16 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-bb4e80-6-0', 'bb4e80', 27, '6', '- (i) A(-1, 3), B(4, 2), C(3, -2) are the vertices of a triangle
- (a) Find the coordinates of the centroid G of the triangle.
- (b) Find the equation of the line through G and parallel to AC.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-bb4e80-6-1', 'bb4e80', 28, '6', '- (ii) In the given figure, AB is a diameter of a circle with centre O and CP is a tangent to the circle at the point C. If AP = 20 cm and CP = 10 cm, find the radius of the circle.

[3+3+4]', 3, 'Circles', 'short', 5, 'bb4e80__Calcutta_B_p5_img_1_jpeg.webp', NULL),
  ('MQ-bb4e80-6-2', 'bb4e80', 29, '6', 'iii) The following bill shows the GST rates and the marked price of articles A, B and C :

| BILL : GROCERY STORE | | | |
| --- | --- | --- | --- |
| ITEMS | DISCOUNT | MARKED PRICE | Rate of GST |
| A | 10 % | Rs. 500 | 10% |
| B | 20 % | Rs. 1500 | 10% |
| C | 25 % | Rs. 1000 | 12% |

Find the total amount of GST and the total amount to be paid by the customer for the above bill.

[5+5]', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-bb4e80-7-0', 'bb4e80', 30, '7', '- (i) The angle of elevation of the top of a hill at the foot of a tower is 60° and the angle of depression from the top of the tower of the foot of the hill is 30°. If the tower is 50 m high, find the height of the hill.', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-bb4e80-7-1', 'bb4e80', 31, '7', '- (ii) The daily wages of 80 workers in a project are given below

| Wages in Rs. | 400-450 | 450-500 | 500-550 | 550-600 | 600-650 | 650-700 | 700-750 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of workers | 2 | 6 | 12 | 18 | 24 | 13 | 5 |

Use a graph paper to draw an ogive for the above distribution (use a scale of 2 cm = ₹50 along x-axis and 1 cm = 5 workers along Y-axis). Use your ogive to estimate

- (a) The median wage of the workers
- (b) The lower quartile wage of the workers
- (c) The number of workers who earn more than Rs. 600 daily.', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-bb4e80-8-0', 'bb4e80', 32, '8', '- i) A box contains 17 blue, 8 white and 25 black marbles. A marble is drawn at random from the box. What is the probability that the marble drawn is not black?', NULL, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-bb4e80-8-1', 'bb4e80', 33, '8', 'ii) Solve for $x$: $\frac{\sqrt{2-x} + \sqrt{2+x}}{\sqrt{2-x} - \sqrt{2+x}} = 3$ (using properties of proportion)', NULL, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-8-2', 'bb4e80', 34, '8', 'iii) Find the minimum length in cm and correct to nearest whole number of the thin metal sheet required to make a hollow and closed cylinder of diameter 20 cm and height 35 cm. Given that the width of the metal sheet is 1 m. Also, find the cost of the sheet at the rate of Rs.56 per cm.', NULL, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-9-0', 'bb4e80', 35, '9', '(i) Draw the histogram for the following distribution

| Wt. in kg | 40-44 | 45-49 | 50-54 | 55-59 | 60-64 | 65-69 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 2 | 8 | 12 | 10 | 6 | 4 |

Hence, estimate the mode.', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-9-1', 'bb4e80', 36, '9', '(ii) The sum of 5$^{th}$ and 9$^{th}$ term of an A.P. is 30. If its 25$^{th}$ term is 3 times its 8$^{th}$ term, find the A.P.', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-9-2', 'bb4e80', 37, '9', '(iii) Find the value(s) of $k$ for which the equation $(k + 1)x^2 - 6(k + 1)x + 3(k + 9) = 0$ will be a quadratic equation? Hence find the value(s) of $k$ for which the quadratic equation have equal roots.', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-bb4e80-10-0', 'bb4e80', 38, '10', '(i) An aeroplane left 30 minutes later then its scheduled time, and in order to reach its destination 1500 km away in time, it has to increase its speed by 250 kmph from its usual speed. Determine its usual speed.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-10-1', 'bb4e80', 39, '10', '(ii) If $A = \begin{bmatrix} 1 & -1 \\ 2 & 3 \end{bmatrix}$ and $C = \begin{bmatrix} 2 & 3 \\ 1 & -11 \end{bmatrix}$ , then find matrix B such that $BA = C$', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-bb4e80-10-2', 'bb4e80', 40, '10', '(iii) Points A, B and C represent the position of three towers such that $AB = 60$ m, $BC = 73$ m and $CA = 52$ m. Taking scale of $10$ m = 1 cm, make an accurate drawing of $\triangle ABC$ . Find by drawing the location of a point which is equidistant from A, B and C and its actual distance from any of the towers.', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-4c6b24-1-0', '4c6b24', 0, '1', 'i) A dealer in Delhi buys some goods worth ₹ 12000. If the rate of GST is 12%, find how much will the dealer pay for the goods bought', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1440', '13440', '12720', '1197']::text[]),
  ('MQ-4c6b24-1-1', '4c6b24', 1, '1', 'ii) If $x = 2$ is a root of the equation $x^2 + 3x - k = 0$, then the value of $k$ is', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['7', '8', '10', '12']::text[]),
  ('MQ-4c6b24-1-2', '4c6b24', 2, '1', 'iii) In an Arithmetic Progression, if $a = 28$, $d = -4$, $n = 7$, then $a_n$ is:', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['4', '5', '3', '7']::text[]),
  ('MQ-4c6b24-1-3', '4c6b24', 3, '1', 'iv) If the lines $3x + 2ky - 2 = 0$ and $2x + 5y + 1 = 0$ are parallel, then what is the value of $k$?', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['4/15', '15/4', '4/5', '5/4']::text[]),
  ('MQ-4c6b24-1-4', '4c6b24', 4, '1', 'v) If $\triangle ABC \sim \triangle QPR$, $BC = 4 \text{ cm}$, $PR = 6 \text{ cm}$. $QR : AC$ is?', 1, 'Similarity', 'MCQ', 2, NULL, array['4/6', '6/4', '2/3', '3/2']::text[]),
  ('MQ-4c6b24-1-5', '4c6b24', 5, '1', 'vi) The midpoint of a line segment joining two points $A(2, 4)$ and $B(-2, -4)$ is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(-2, 4)$', '$(2, -4)$', '$(0, 0)$', '$(-2, -4)$']::text[]),
  ('MQ-4c6b24-1-6', '4c6b24', 6, '1', 'vii) If $\sin(90 - 3\theta) \cdot \csc 60^\circ = 1$, value of $\sin 3\theta$ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['1/2', '$1/\sqrt{2}$', '$\sqrt{3}$', '1']::text[]),
  ('MQ-4c6b24-1-7', '4c6b24', 7, '1', 'viii) If the height of the building and distance from the building foot''s to a point is increased by 20%, then the angle of elevation on the top of the building:', 1, 'Trigonometry', 'MCQ', 2, NULL, array['Increases', 'Decreases', 'Do not change', 'None of the above']::text[]),
  ('MQ-4c6b24-1-8', '4c6b24', 8, '1', 'ix) If $AP = 10 \, \text{cm}, AB = 13 \, \text{cm}, PD = 7.5 \, \text{cm}$. Value of CP is?', 1, 'Circles', 'MCQ', 3, '4c6b24__Cathedral__p3_img_0_jpeg.webp', array['\(2\mathrm{cm}\)', '\(4\mathrm{cm}\)', '\(\frac{1}{2} \mathrm{~cm}\)', '\(7.5 \mathrm{~cm}\)']::text[]),
  ('MQ-4c6b24-1-9', '4c6b24', 9, '1', 'x) If a cone is cut parallel to the base of it by a plane in two parts, then the shape of the top of the cone will be a:', 1, 'Mensuration', 'MCQ', 3, NULL, array['Sphere', 'Cylinder', 'Cone itself', 'Cylinder Hemisphere']::text[]),
  ('MQ-4c6b24-1-10', '4c6b24', 10, '1', 'xi) Two identical solid hemispheres of equal base radius r cm are stuck together along their bases. The total surface area of the combination is', 1, 'Mensuration', 'MCQ', 3, NULL, array['\(6\pi r^2\)', '\(4\pi r^2\)', '\(5\pi r^2\)', '\(3\pi r^2\)']::text[]),
  ('MQ-4c6b24-1-11', '4c6b24', 11, '1', 'xii) Mean of 7, 5, 8, m and 11 is 9. The value of m is', 1, 'Statistics', 'MCQ', 3, NULL, array['41', '11', '9', '14']::text[]),
  ('MQ-4c6b24-1-12', '4c6b24', 12, '1', 'xiii) A bag has 5 white marbles, 8 red marbles and 4 purple marbles. If we take a marble randomly, then what is the probability of not getting purple marble?', 1, 'Probability', 'MCQ', 3, NULL, array['5/17', '8/17', '13/17', '4/17']::text[]),
  ('MQ-4c6b24-1-13', '4c6b24', 13, '1', 'xiv) While computing mean of grouped data, we assume that the frequencies are', 1, 'Statistics', 'MCQ', 3, NULL, array['centred at the class marks of the classes', 'evenly distributed over all the classes', 'centred at the upper limits of the classes', 'centred at the lower limits of the classes']::text[]),
  ('MQ-4c6b24-1-14', '4c6b24', 14, '1', 'xv) If TP and TQ are the two tangents to a circle with centre O so that ∠POQ = 110°, then ∠PTQ is equal to? Given that T is a point outside the circle.', 1, 'Circles', 'MCQ', 4, NULL, array['60°', '70°', '80°', '90°']::text[]),
  ('MQ-4c6b24-2-0', '4c6b24', 15, '2', 'a) Rajan deposits a certain sum of money each month in a recurring deposit account of a bank. If the rate of interest is \(8\%\) per annum and Rajan gets ₹ 8088 from the bank after 3 years, find the value of his monthly instalment. 200', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-4c6b24-2-1', '4c6b24', 16, '2', 'b) Using the properties of proportion solve for \( x \): [4]

$$\frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-4c6b24-2-2', '4c6b24', 17, '2', 'c) Prove that

$$\frac{\sec A - \tan A}{\sec A + \tan A} = 1 + 2\tan^2 A - 2\sec A \tan A$$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4c6b24-3-0', '4c6b24', 18, '3', 'a) The surface area of a solid metallic sphere is \(1256\mathrm{cm}^2\). It is melted and recast into solid right circular cones of radius \(2.5\mathrm{cm}\) and height \(8\mathrm{cm}\). Calculate the number of cones recast.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-4c6b24-3-1', '4c6b24', 19, '3', 'b) Points A (7, -3) and B (1, 9) have been given. Find:

(i) The slope of AB
(ii) The equation of the perpendicular bisector of the line segment AB', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4c6b24-3-2', '4c6b24', 20, '3', 'c) The points (3,0) and (-1,0) are invariant points under reflection in the line L₁ while the points (0,-3) and (0,1) are invariant points on reflection in the line L₂.

(i) Name the lines \(L_{1}\) and \(L_{2}\)
(ii) Write down the images of the points P(3,4) and Q(-5,-2) on reflection in \(\mathbf{L}_2\). Name the images as \(\mathbf{P}^1\) and \(\mathbf{Q}^1\) respectively. Plot points P, Q, \(\mathbf{P}^1\) and \(\mathbf{Q}^1\) on a graph paper.
(iii)Write down the images of P and Q on reflection in L2. Name the images as \(\mathbf{P}^{11}\) and \(\mathbf{Q}^{11}\) respectively. Plot points \(\mathbf{P}^{11}\) and \(\mathbf{Q}^{11}\)
(iv)State or describe a single transformation that maps \(\mathbf{P}^1\) onto \(\mathbf{P}^{11}\)', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4c6b24-4-0', '4c6b24', 21, '4', 'a) The marked price of an article is ₹ 12500. A dealer in Kolkata sells the article to a consumer in the same city at a profit of 8%. If the rate of GST is 18%, find
(i) the selling price (excluding tax) of the goods 13500
(ii) the amount which the consumer pays for the article 15930', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-4c6b24-4-1', '4c6b24', 22, '4', 'b) Solve the equation $$x - \frac{18}{x} = 6$$. Give your answer correct to two places of decimal.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-4c6b24-5-0', '4c6b24', 23, '5', 'a) In the figure alongside $$AB = 7\text{ cm}$$ and $$BC = 9\text{ cm}$$.
(i) Prove that $$\triangle ACD \sim \triangle DCB$$
(ii) Find the length of CD', NULL, 'Similarity', 'short', 5, '4c6b24__Cathedral__p5_img_0_jpeg.webp', NULL),
  ('MQ-4c6b24-5-1', '4c6b24', 24, '5', 'b) Using factor theorem, show that $$x + 4$$ is a factor of $$2x^3 + 9x^2 + x - 12$$. Hence factorise the given expression completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-4c6b24-5-2', '4c6b24', 25, '5', 'c) Given : $$A = \begin{bmatrix} p & 0 \\ 0 & 2 \end{bmatrix}$$, $$B = \begin{bmatrix} 0 & 0 \\ 1 & 2 \end{bmatrix}$$ and $$C = \begin{bmatrix} 2 & -2 \\ 2 & 2 \end{bmatrix}$$ and $$BA = C^2$$. Find the values of p and q', NULL, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-4c6b24-6-0', '4c6b24', 26, '6', 'a) In what ratio is the join if $$A(6, 5)$$ and $$B(4, -3)$$ divide by the line $$y = 2$$. Also fine the co-ordinates of point of intersection.', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-4c6b24-6-1', '4c6b24', 27, '6', 'b) Prove that : $$\sqrt{\frac{1+\sin A}{1-\sin A}} = \frac{\cos A}{1-\sin A}$$

[3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-4c6b24-6-2', '4c6b24', 28, '6', 'c) The sum of the 5$^{th}$ and 9$^{th}$ term of an AP is 26 and the sum of its 7$^{th}$ and 11$^{th}$ term is 42. Find the first three terms of the AP.

[4]', 4, 'Arithmetic Progression', 'long', 6, NULL, NULL),
  ('MQ-4c6b24-7-0', '4c6b24', 29, '7', 'a) Cards marked with numbers 1, 2, 3, ..., 25 are well shuffled and a card is drawn at random. What is the probability that the number on the card is

- (i) a perfect cube
- (ii) a composite number
- (iii) divisible by 3.

[3]', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-4c6b24-7-1', '4c6b24', 30, '7', 'b) In the figure, C and D are points on a semi circle and AB is the diameter. If angle ABC = 55$^{0}$ and angle CAD = 30$^{0}$, calculate angle BAC and angle ACD.', NULL, 'Circles', 'short', 6, '4c6b24__Cathedral__p6_img_0_jpeg.webp', NULL),
  ('MQ-4c6b24-7-2', '4c6b24', 31, '7', 'c) The difference between the outside and inside surface area of a cylindrical metallic pipe 14cm long is 44cm$^{2}$. If the pipe is made of 99cm$^{3}$ of metal, find the outer and inner radii of the pipe.

[4]', 4, 'Mensuration', 'long', 6, NULL, NULL),
  ('MQ-4c6b24-8-0', '4c6b24', 32, '8', 'a) Solve the inequation $3 \leq -\frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6}, x \in R$ . Represent the solution set on the number line.

[3]', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-4c6b24-8-1', '4c6b24', 33, '8', 'b) Calculate the mean of the following distribution using short cut method:

[3]

| Class-Interval | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 8 | 30 | 25 | 14 | 12 | 6 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-4c6b24-8-2', '4c6b24', 34, '8', 'c) In the figure, ABCD is a trapezium in which AB is parallel to DC and the diagonals AC and BD intersect at O.

[4]

Prove that:

$$\Delta OCD \sim \Delta OAB$$

If OA = (2x + 1)cm, OB = (5x - 3) cm, OC = (6x - 5) cm and OD = (3x - 1) cm find the value of x.', 4, 'Similarity', 'long', 6, '4c6b24__Cathedral__p7_img_0_jpeg.webp', NULL),
  ('MQ-4c6b24-9-0', '4c6b24', 35, '9', 'a) The hotel bill for a number of people for overnight stay is ₹. 14400. If there were 4 more people, the bill each person had to pay would have reduced by ₹. 600. Find the number of people staying overnight. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-4c6b24-9-1', '4c6b24', 36, '9', 'b) The following table shows the number of casualties due to accidents in different age groups in a city. [6]

| Age(in years) | 5-15 | 15-25 | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of casualties | 6 | 10 | 16 | 15 | 24 | 8 | 7 |

Use 1cm = 5 years on x-axis and 1 cm = 10 casualties on y-axis. Use graph paper for the same. From your graph determine:

- (i) The lower quartile
- (ii) % of casualties more than 50 years.
- (iii) The median', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-4c6b24-10-0', '4c6b24', 37, '10', 'a) If $$\frac{a}{b} = \frac{c}{d}$$ , using properties of proportion, prove that [3]

$$\frac{3a - 5b}{3a + 5b} = \frac{3c - 5d}{3c + 5d}$$', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-4c6b24-10-1', '4c6b24', 38, '10', 'b) Construct a regular hexagon of side 4cm. Hence construct a circle circumscribing the hexagon. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-4c6b24-10-2', '4c6b24', 39, '10', 'c) A person on the bank of a river observes that the angle of elevation of the top of the tree standing on the opposite bank is $60^\circ$ . When he moves 50 m away from the bank, he finds the angle of elevation to be $30^\circ$ . Calculate [4]

- (i) The width of the river
- (ii) The height of the tree.', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-0644aa-1-0', '0644aa', 0, '1', 'a) Solve the inequation and represent the solution set on a number line:- [3] 3

$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x; \quad x \in I$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-0644aa-1-1', '0644aa', 1, '1', 'b) A man buys 500, ₹20 shares at a discount of 20% and receives a return of 10% on his money. [3] 3

Calculate:- (i) The amount invested by him,

(ii) The rate of dividend paid by the company.', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-0644aa-1-2', '0644aa', 2, '1', 'c) Using step deviation method, calculate the mean for the following data:- [4] 4

| Height (in cm) | 135-140 | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 | 170-175 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of boys | 4 | 9 | 18 | 28 | 24 | 10 | 5 | 2 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-0644aa-2-0', '0644aa', 3, '2', 'a) Use the factor theorem to factorise completely: $$x^3 + x^2 - 4x - 4$$ [3] 3', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-0644aa-2-1', '0644aa', 4, '2', 'b) Prove that: [3] 01

$$\frac{1}{\text{cosec } A - \text{cot } A} - \frac{1}{\sin A} = \frac{1}{\sin A} - \frac{1}{\text{cosec } A + \text{cot } A}$$', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-0644aa-2-2', '0644aa', 5, '2', 'c) The 2nd and 5th terms of a G.P. are $$-\frac{1}{2}$$ and $$\frac{1}{16}$$ respectively. Find the sum of first 8 terms of the G.P. (leave your answer as a fraction) [4] 3', 4, 'Geometric Progression', 'long', 1, NULL, NULL),
  ('MQ-0644aa-3-0', '0644aa', 6, '3', 'a) If $A = \begin{bmatrix} 2 & 0 \\ -3 & 1 \end{bmatrix}$ and $B = \begin{bmatrix} -2 & 4 \\ 3 & 1 \end{bmatrix}$, find a matrix X such that $3A + 4X = 5B$.', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-0644aa-3-1', '0644aa', 7, '3', 'b) Find the ratio in which the line joining A (6, 5) and B (4, -3) is divided by the line y = 2. Also, find the coordinates of the point of intersection.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-0644aa-3-2', '0644aa', 8, '3', 'c) Solve for x when

$$\frac{\sqrt{a+x} + \sqrt{a-x}}{\sqrt{a+x} - \sqrt{a-x}} = b$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-0644aa-4-0', '0644aa', 9, '4', 'a) In the given figure, 0 is the centre of the circle and SP is the tangent. If $\angle SRT = 65^\circ$, find the values of x, y and z', NULL, 'Circles', 'short', 2, '0644aa__Cathedral__p2_img_0_jpeg.webp', NULL),
  ('MQ-0644aa-4-1', '0644aa', 10, '4', 'b) Construct an equilateral triangle ABC with side 4 cm. Draw a circle touching the sides of the triangle.', NULL, 'Constructions', 'short', 2, NULL, NULL),
  ('MQ-0644aa-4-2', '0644aa', 11, '4', 'In the given fig; P is a point on AB such that AP : PB = 4 : 3 and PQ || AC.

(i) Calculate PQ:AC
(ii) If \(\mathrm{ARC} = 90^{\circ}\), \(\mathrm{QSP} = 90^{\circ}\) and \(\mathrm{QS} = 6\mathrm{cm}\),

(iii) Calculate the length of AR.', NULL, 'Similarity', 'short', 2, '0644aa__Cathedral__p2_img_1_jpeg.webp', NULL),
  ('MQ-0644aa-5-0', '0644aa', 12, '5', 'a) Rajan deposits a certain sum of money each month in a recurring deposit account of a bank. If the rate of interest is 8% per annum and Rajan gets ₹8088 from the bank after 3 years, find the value of his monthly instalment.

[3] 3', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-0644aa-5-1', '0644aa', 13, '5', 'b) One card is drawn at random from a well shuffled deck of 52 cards. Find the probability of drawing:

[3]

(i) A 5 of a red suit
(ii) A jack of spades
(iii) A black queen', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-0644aa-5-2', '0644aa', 14, '5', 'c) On a graph, plot A (4, 6) and B (2, 3). Find the image of A when reflected in the line y = 0, name it A''. Find the coordinates of B the image of B when reflected in the line AA''. Give a geometrical name for the figure AB'' A'' B. Calculate the area of the figure AB'' A''B.

[4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-0644aa-6-0', '0644aa', 15, '6', 'a) If a : b = c : d, prove that:

[3]

$$(abcd)(a^{-2} + b^{-2} + c^{-2} + d^{-2}) = (a^2 + b^2 + c^2 + d^2)$$', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-0644aa-6-1', '0644aa', 16, '6', 'b) Find the set of values of K for which the equation \(\mathrm{Kx}^2 + 2\mathrm{x} + 1 = 0\) has distinct real roots. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-0644aa-6-2', '0644aa', 17, '6', 'c) If the sum of first \( n \), \( 2n \) and \( 3n \) terms of an A.P., be \( S_1, S_2 \) and \( S_3 \) respectively, then prove that: [4]

$$S_3 = 3(S_2 - S_1)$$', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-0644aa-7-0', '0644aa', 18, '7', 'a) A cylindrical vessel of radius \(4\mathrm{cm}\) contains water. A solid sphere of radius \(3\mathrm{cm}\) is lowered into water until it is completely immersed. Find the rise in the water level in the vessel.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-0644aa-7-1', '0644aa', 19, '7', 'b) Evaluate without using tables:

$$\begin{bmatrix} 2 \cos 60^\circ & -2 \sin 30^\circ \\ -\tan 45^\circ & \cos 0^\circ \end{bmatrix} \times \begin{bmatrix} \cot 45^\circ & \text{cosec } 30^\circ \\ \sec 60^\circ & \sin 90^\circ \end{bmatrix}$$', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-0644aa-7-2', '0644aa', 20, '7', 'c) ABCD is a rhombus. The coordinates of A and C are (3, 6) and (-1, 2) respectively. Write down the equation of BD [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-0644aa-8-0', '0644aa', 21, '8', 'a) For the following distribution, draw a histogram:

[3]

| Weight (in kg) | 44 – 47 | 48 – 51 | 52 – 55 | 56 – 59 | 60 – 63 | 64 – 67 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 23 | 25 | 37 | 18 | 7 | 2 |

From the histogram, estimate the mode.', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-0644aa-8-1', '0644aa', 22, '8', 'b) Construct a $\Delta ABP$ with AB = 6 cm, $\angle ABP = 45^\circ$ and BP = 5 cm. complete the rectangle ABCD such that [3]

(i) P is equidistant from AB and BC and
(ii) P is equidistant from A and D.', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-0644aa-8-2', '0644aa', 23, '8', 'c) A conical vessel of radius 6 cm and height 8 cm is completely filled with water. A sphere is lowered into the water and its size is such that when it touches the sides, it is just immersed. What fraction of water overflows?', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-0644aa-9-0', '0644aa', 24, '9', 'a) Which term of the AP 5, 12, 19, 26, 33, ... will be 35 more than its \(12^{\text{th}}\) term? [3] 3', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-0644aa-9-1', '0644aa', 25, '9', 'b) A dealer sells an electric kettle for ₹2150. For a particular customer he reduced the price of the kettle in such a way that he customer has to pay only ₹2124 including GST. If the rate of GST is 18% calculate the amount of reduction allowed by the dealer. [3]3', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-0644aa-9-2', '0644aa', 26, '9', 'c) Sangeeta invests ₹16500 partly in 10%, ₹100 shares at ₹130 and partly in 8%, ₹100 shares at ₹120. If her total annual income from these shares be ₹1180, find her investment in each kind of shares. [4]3', 4, 'Shares and Dividends', 'long', 4, NULL, NULL),
  ('MQ-0644aa-10-0', '0644aa', 27, '10', 'a) A tower subtends an angle \(\alpha\) on the same level as the foot of the tower and at a second point \(\mathbf{h}\) metres above the first, the depression of the foot of the tower is \(\beta\). Show that the height of the tower is \(\mathbf{h}\tan \alpha \cot \beta\)', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-0644aa-10-1', '0644aa', 28, '10', 'b) The following table shows the distribution of marks obtained by a group of 400 students in an examination:

| Marks less than | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students | 5 | 10 | 30 | 60 | 105 | 180 | 270 | 355 | 390 | 400 |

Using a scale of 2 cm = 10 marks and 2 cm = 50 students, plot these values and draw a smooth curve through these points. Estimate from the graph:

(i) The median marks
(ii) the lower quartile marks
(iii) the upper quartile marks
(iv) Interquartile range', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-0644aa-11-0', '0644aa', 29, '11', 'a) If $$(2x^3 + ax^2 + bx - 2)$$ when divided by $$(2x - 3)$$ and $$(x + 3)$$ leaves remainder 7 and - 20 respectively, find the values of a and b.', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-0644aa-11-1', '0644aa', 30, '11', 'In the given figure the straight lines AB and CD pass through the centre O of the circle. If $$\angle AOD = 75^\circ$$ and $$\angle OCE = 40^\circ$$ Find :- (i) $$\angle CDE$$ (ii) $$\angle OBE$$', NULL, 'Circles', 'short', 4, '0644aa__Cathedral__p4_img_0_jpeg.webp', NULL),
  ('MQ-0644aa-11-2', '0644aa', 31, '11', 'c) 50 is divided into two parts such that the sum of their reciprocals is $$\frac{1}{12}$$. Find the two parts.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-df7d9b-1-0', 'df7d9b', 0, '1', '(I) Input GST paid by the shopkeeper to the dealer is ₹5000 and output GST collected by the shopkeeper from a consumer is ₹5500. GST paid by the shopkeeper to the government is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['5500', '5000', '500', '1000']::text[]),
  ('MQ-df7d9b-1-1', 'df7d9b', 1, '1', '(II) A quadratic equation $$ax^2 + bx + c = 0$$ has no real roots, if', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['\( b^{2} - 4ac > 0 \)', '\( b^{2} - 4ac < 0 \)', '\( b^{2} - 4ac = 0 \)', '\( b^{2} - ac > 0 \)']::text[]),
  ('MQ-df7d9b-1-2', 'df7d9b', 2, '1', '(III) For what value of k, $$(x + 4)$$ is a factor of the polynomial $$x^2 - x - (2k - 2)$$?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['7', '-9', '11', '-5']::text[]),
  ('MQ-df7d9b-1-3', 'df7d9b', 3, '1', '(IV) Given A and B are two matrices of orders 2X3 and 2X2 respectively. The order of matrix AB is', 1, 'Matrices', 'MCQ', 1, NULL, array['\(3 \times 3\)', '\(2 \times 3\)', '\(3 \times 2\)', 'AB is not defined']::text[]),
  ('MQ-df7d9b-1-4', 'df7d9b', 4, '1', '(V) $$11^{\text{th}}$$ term of an A.P. $$-3, -\frac{1}{2}, 2, \ldots$$ is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['28', '22', '-38', '-48']::text[]),
  ('MQ-df7d9b-1-5', 'df7d9b', 5, '1', '(VI) The reflection of the point $P(1, -2)$ in the line $y = -1$ is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['\((-3, -2)\)', '\((1, -4)\)', '(1,4)', '(1,0)']::text[]),
  ('MQ-df7d9b-1-6', 'df7d9b', 6, '1', '(VII) In the figure given below, if DE || BC, then x equals:', 1, 'Similarity', 'MCQ', 2, 'df7d9b__Cbs_Rehear_p2_img_0_jpeg.webp', array['\(2\mathrm{cm}\)', '\(4\mathrm{cm}\)', '\(6.7 \mathrm{~cm}\)', '\(3\mathrm{cm}\)']::text[]),
  ('MQ-df7d9b-1-7', 'df7d9b', 7, '1', '(VIII) The surface area of a sphere is $616 \, \text{cm}^2$. Its radius is', 1, 'Mensuration', 'MCQ', 2, NULL, array['\(7\mathrm{cm}\)', '\(14\mathrm{cm}\)', '\(21 \mathrm{~cm}\)', '\(28 \mathrm{~cm}\)']::text[]),
  ('MQ-df7d9b-1-8', 'df7d9b', 8, '1', '(IX) If x is a negative integer, find the solution set of $\frac{2}{3} + \frac{1}{3}(x + 1) > 0$', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['\(\{-1, -2\}\)', '\(\{-2, -3\}\)', '\(\{-3, -4\}\)', '\(\{-4, -5\}\)']::text[]),
  ('MQ-df7d9b-1-9', 'df7d9b', 9, '1', '(X) A card is drawn from the set of 52 cards. Find the probability of getting a queen card.', 1, 'Probability', 'MCQ', 2, NULL, array['\(\frac{1}{26}\)', '\(\frac{1}{13}\)', '\(\frac{4}{53}\)', '\(\frac{4}{13}\)']::text[]),
  ('MQ-df7d9b-1-10', 'df7d9b', 10, '1', '(XI) If $\begin{bmatrix} x + 3 & 4 \\ y - 4 & x + y \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 3 & 9 \end{bmatrix}$, then the values of x and y are', 1, 'Matrices', 'MCQ', 2, NULL, array['\(x = 2, y = 7\)', '\(x = 7, y = 2\)', '\(x = 3, y = 6\)', '\(x = -2, y = 7\)']::text[]),
  ('MQ-df7d9b-1-11', 'df7d9b', 11, '1', '(XII) The point which lies on the perpendicular bisector of the line segment joining the points A(-2, -5) and B(2,5) is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(0,0)', '(0,2)', '(2,0)', '(-2,0)']::text[]),
  ('MQ-df7d9b-1-12', 'df7d9b', 12, '1', '(XIII) AB is a chord of the circle and AOC is the diameter such that angle ACB=50°. If AT is the tangent to the circle at the point A, then ∠BAT is equal to', 1, 'Circles', 'MCQ', 3, 'df7d9b__Cbs_Rehear_p3_img_0_jpeg.webp', array['65°', '60°', '50°', '40°']::text[]),
  ('MQ-df7d9b-1-13', 'df7d9b', 13, '1', '(XIV) Which term of the A.P 3,8,13,18, ... is 78?', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['12th', '13th', '15th', '16th']::text[]),
  ('MQ-df7d9b-1-14', 'df7d9b', 14, '1', '(XV) The vertical axis of an ogive comes from this column.', 1, 'Statistics', 'MCQ', 3, NULL, array['Class', 'Cumulative frequency', 'Midpoint', 'Frequency']::text[]),
  ('MQ-df7d9b-2-0', 'df7d9b', 15, '2', '(i) Mr. Gupta opened a recurring deposit account in a bank. He deposited Rs.2,500 per month for two years. At the time of maturity he got Rs.67,500. Find:

(a) The total interest earned by Mr. Gupta
(b) The rate of interest per annum', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-df7d9b-2-1', 'df7d9b', 16, '2', '(ii) If q is the mean proportional between p and r show that pqr(p + q + r)³ = (pq + qr + pr)³', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-df7d9b-2-2', 'df7d9b', 17, '2', '(iii) Prove that sec² A . cosec² A = tan² A + cot² A + 2', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-df7d9b-3-0', 'df7d9b', 18, '3', '(i) A vessel Is in the form of an inverted cone. Its height is 11 cm and the radius of its top which is open, is 2.5 cm. It is filled with water up to the rim. When some lead shots, each up which is the sphere of radius 0.25 cm, are dropped into the vessel, 2/5 of the water flows out. Find the number of lead shots dropped into the vessel.', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-df7d9b-3-1', 'df7d9b', 19, '3', '(ii) A Straight line passes through the point P (5, -2). It intersects the co-ordinate axis at the point A and B, and M is the midpoint of line segment AB. Find
(a) the equation of the line (b) The co-ordinates of A and B (c) The co-ordinates of M', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-df7d9b-3-2', 'df7d9b', 20, '3', '(iii) The point \( P(3,4) \) is reflected to \( P'' \) in the X-axis and \( O'' \) is the image of \( O \) (the origin) when reflected in the line \( PP'' \). Using graph paper give the coordinates of
(a) The co-ordinates of \(P^{\prime}\) and \(O^{\prime}\)
(b) The length of the segments PP'' and OO''.
(c) The perimeter of the quadrilateral POP''O''
(d) The geometrical name of POP''O''', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-df7d9b-4-0', 'df7d9b', 21, '4', 'a) A computer mechanic in Delhi charges repairing cost of three different machines A, B and C from a customer with certain discounts. The repairing cost and the corresponding discounts are given below:

| Name | A | B | C |
| --- | --- | --- | --- |
| Repairing cost | 5500 | 6250 | 4800 |
| Discount% | 30 | 40 | 30 |
| | | | |

If the rate of GST is 18%, then find (i) total amount of CGST charged (ii) total amount of SGST charged (iii) the total amount of money received by the mechanic. [ 3 ]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-df7d9b-4-1', 'df7d9b', 22, '4', 'b) Solve the following quadratic equation and calculate the answer correct to two places of decimal:

$$(x - 1)^2 - 3x + 4 = 0$$ [ 3 ]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-df7d9b-4-2', 'df7d9b', 23, '4', 'c) Calculate the mode of the following distribution by constructing a histogram: [ 4 ]

| Marks Obtained | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 18 | 10 | 32 | 45 | 25 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-df7d9b-5-0', 'df7d9b', 24, '5', 'a) Given that \( A = \begin{bmatrix} 1 & 1 \\ B & 3 \end{bmatrix} \). Show that \( A^2 - 4A = 5I \), where \( I \) is the unit matrix. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-df7d9b-5-1', 'df7d9b', 25, '5', 'b) In each of the following figures, O is the centre of circle. Find the values of a, b and c. Give reasons for your answer. [3]', 3, 'Circles', 'short', 4, 'df7d9b__Cbs_Rehear_p4_img_0_jpeg.webp', NULL),
  ('MQ-df7d9b-5-2', 'df7d9b', 26, '5', 'c) What number should be subtracted from $2x^3 - 3x^2 - 8x$ so that the resulting polynomial

leaves remainder 16 when divided by $x - 1$? [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-df7d9b-6-0', 'df7d9b', 27, '6', '(i) Find the equation of the line passing through the point \((0, -2)\) and the point of intersection of lines \(4x + 3y = 1\) and \(3x - y + 9 = 0\)', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-df7d9b-6-1', 'df7d9b', 28, '6', '(ii) Prove the identity \((\tan A + \sec A - 1) / (\tan A - \sec A + 1) = (1 + \sin A) / \cos A\)', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-df7d9b-6-2', 'df7d9b', 29, '6', '(iii) The eighth term of an A.P. is half of its second term and 11th term exceeds \(1/3\) of \(4^{\text{th}}\) term by 1
(a) Find the \(15^{\text{th}}\) term
(b) Find the sum of \(15^{\text{th}}\) term [3+3+4 marks]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-df7d9b-7-0', 'df7d9b', 30, '7', '(i) Three Coins are tossed simultaneously. Find the probability of getting
(a) At least one head
(b) At most one head
(c) One head', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-df7d9b-7-1', 'df7d9b', 31, '7', '(ii) The adjoining figure represents a solid consisting of a cylinder surmounted by a cone at one end and hemisphere at the other end. Given that common radius is

3.5 cm, The height of the cylinder is 6.5 cm and total height is 12.8 cm, calculate the volume of the solid correct to the nearest cm.', 3, 'Mensuration', 'short', 5, 'df7d9b__Cbs_Rehear_p5_img_0_jpeg.webp', NULL),
  ('MQ-df7d9b-7-2', 'df7d9b', 32, '7', '(iii) In the given figure, O Is the centre of the circle.

If $\angle DAE = 70^{\circ}$, Find the measure of

(a) $\angle BCD$ (b) $\angle BOD$ (c) $\angle OBD$ (d) $\angle BAD$

$$[3+3+4]$$', 4, 'Circles', 'long', 5, 'df7d9b__Cbs_Rehear_p5_img_1_jpeg.webp', NULL),
  ('MQ-df7d9b-8-0', 'df7d9b', 33, '8', '(i) Solve the following inequation and graph the solution on the number line

$$2x - 5 \leq 5x + 4 < 11, x \in R$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-df7d9b-8-1', 'df7d9b', 34, '8', '(ii) Calculate the mean no of wickets for the following data using step deviation method

| No of Wickets | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| No of Bowlers | 10 | 9 | 25 | 30 | 16 | 10 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-df7d9b-8-2', 'df7d9b', 35, '8', '(iii) In $\Delta$ PQR, X and Y are points on sides PQ and PR of the triangle respectively and XY || QR. If $\frac{PQ}{XQ} = \frac{7}{3}$ and PR = 6.3 cm, find YR.', 4, 'Similarity', 'long', 5, NULL, NULL),
  ('MQ-df7d9b-9-0', 'df7d9b', 36, '9', '(i) The hypotenuse of a right angled triangle is \(17\mathrm{cm}\) and the difference between other two sides is \(7\mathrm{cm}\). Find the other two unknown sides.', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-df7d9b-9-1', 'df7d9b', 37, '9', '(ii) The marks obtained by 120 students in a Mathematics test are given below

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of Students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

Draw an ogive for the given distribution on a graph sheet. Use a suitable scale for ogive to estimate the following:

(a) the median (b) the no of students who obtained more than 75% marks in the test. (c) the no of students who did not pass in the test if the pass percentage was 40.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-df7d9b-10-0', 'df7d9b', 38, '10', '(i) Given \(\frac{x^3 + 12x}{6x^2 + 8} = \frac{y^3 + 27y}{9y^2 + 27}\). Using componendo and dividendo find \(x: y\). [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-df7d9b-10-1', 'df7d9b', 39, '10', '(ii) Construct a regular hexagon of side \(5\mathrm{cm}\). Construct a circle circumscribing the hexagon. All traces of construction must be clearly shown. [3]', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-df7d9b-10-2', 'df7d9b', 40, '10', '(iii) An aeroplane at an altitude of 1500 metres finds that two ships are sailing towards it in the same direction. The angles of depression as observed from the aeroplane are \(45^{\circ}\) and \(30^{\circ}\) respectively. Find the distance between the two ships. [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-8ca4cf-1-0', '8ca4cf', 0, '1', 'i) A dealer in Mumbai supplies goods worth Rs 20,000 to another dealer in Nashik. If the rate of GST is 18%, the CGST will be:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 1800', 'Rs 3600', 'Rs 2700', 'Rs 4500']::text[]),
  ('MQ-8ca4cf-1-1', '8ca4cf', 1, '1', 'ii) If the nth term of an A.P is 2n + 4, then the third term of the AP is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['6', '8', '10', '4']::text[]),
  ('MQ-8ca4cf-1-2', '8ca4cf', 2, '1', 'iii) If $$\begin{bmatrix} x + 2 \\ 9 \end{bmatrix} = \begin{bmatrix} 6 & 5 \\ 9 & 4 \end{bmatrix}$$, then the value of x + y is:
a) 5 b) 6 c) 7 d) 8', 1, NULL, 'short', 1, NULL, NULL),
  ('MQ-8ca4cf-1-3', '8ca4cf', 3, '1', 'iv) If $$\frac{5x}{4} - \frac{4x-1}{3} > 1, x \in I$$, then the largest value of x is:
a) -6 b) -8 c) -9 d) -7', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-8ca4cf-1-4', '8ca4cf', 4, '1', 'v) The co-ordinates of a point (5,6) on reflection in origin are:
a) (-5, 6) b) (-5, -6) c) (5, -6) d) (5, 6)', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-8ca4cf-1-5', '8ca4cf', 5, '1', 'vi) A letter is chosen from the word TRIANGLE. The probability of it being a vowel is:
a) $$\frac{3}{8}$$ b) $$\frac{1}{2}$$ c) $$\frac{5}{8}$$ d) $$\frac{3}{4}$$', 1, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-8ca4cf-1-6', '8ca4cf', 6, '1', 'vii) The volume of a right circular cone of height 14cm is 168πcm³. The diameter of the cone will be:', 1, 'Mensuration', 'MCQ', 1, NULL, array['6 cm', '10cm', '8cm', '12cm']::text[]),
  ('MQ-8ca4cf-1-7', '8ca4cf', 7, '1', 'viii) The nature of the roots of the quadratic equation $$3x^2 - 2\sqrt{6}x + 2 = 0$$ is:
a) Imaginary b) Real and unequal c) Real and equal d) None of these', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-8ca4cf-1-8', '8ca4cf', 8, '1', 'ix) If (x - 2) is a factor of 2x^3 - x^2 - px - 2, then the value of p is:
a) 7 b) 5 c) 3 d) 2', 1, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-1-9', '8ca4cf', 9, '1', 'x) If 2, 6, p, 54 and q are in continued proportion, the values of p & q are:

a) 14, 112 b) 16, 144 c) 18, 162 d) 18, 168', 1, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-1-10', '8ca4cf', 10, '1', 'xi) Mbappe deposits Rs 1500 per month in a recurring deposit account for 1 ½ years at an interest rate of 8% p.a. If he gets a total of Rs 28170 at the end of 1 ½ years, calculate the interest received.
a) Rs 1170 b) Rs 2710 c) Rs 2210 d) Rs 1810', 1, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-1-11', '8ca4cf', 11, '1', 'xii) Co-ordinates of X & Y are (-5, a) and (3, a + 6). The mid-point of line segment XY is

(-1,4). The value of a:
a) 0 b) 1 c) 2 d) 3', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-1-12', '8ca4cf', 12, '1', 'xiii) In the given figure, angle ADC = 50°, angle AOB = 140°, then the value of angle OBC will be a is centre of circle
a) 50° b) 40° c) 20° d) 30°', 1, 'Circles', 'short', 2, '8ca4cf__Champion_X_p2_img_0_jpeg.webp', NULL),
  ('MQ-8ca4cf-1-13', '8ca4cf', 13, '1', 'xiv) If in ΔPQR & ΔXYZ, PQ/XY = QR/ZX, then they will be similar when:
a) Angle Q = Angle Y b) Angle P = Angle X
c) Angle Q = Angle X d) Angle P = Angle Z', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-1-14', '8ca4cf', 14, '1', 'xv) If a pole 6 m high casts shadow 2√3 m long on the ground, then the sun''s elevation is:
a) 15° b) 30° c) 45° d) 60°', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-2-0', '8ca4cf', 15, '2', 'a) Moksh Sardesai deposits Rs 1400 every month in a recurring deposit account for 3yrs 3 months. If the rate of interest is 8% p.a, find the amount he will receive on maturity.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-2-1', '8ca4cf', 16, '2', 'b) Using properties of proportion, solve for x

$$\frac{\sqrt{x+2}-\sqrt{x-3}}{\sqrt{x+2}+\sqrt{x-3}} = \frac{1}{5}$$', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-2-2', '8ca4cf', 17, '2', 'c) Prove that $$\frac{1}{1+sin^2A} + \frac{1}{1+cos^2A} + \frac{1}{1+sec^2A} + \frac{1}{1+cosec^2A} = 2$$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-3-0', '8ca4cf', 18, '3', 'a) The internal radius of a hollow wooden hemisphere is 21 cm and it is uniformly 7 cm thick. Calculate:

i) The volume of wood in it

ii) Quantity of oil it can hold', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-8ca4cf-3-1', '8ca4cf', 19, '3', 'b) For the given figure, find:

i) the slope and equation of OA

ii) write down the co-ordinates of B

iii) Find the equation of BC perpendicular to OA

iv) Write the co-ordinates of C', NULL, 'Coordinate Geometry', 'short', 2, '8ca4cf__Champion_X_p2_img_1_jpeg.webp', NULL),
  ('MQ-8ca4cf-3-2', '8ca4cf', 20, '3', 'Use graph sheet for this question. Take 2 cm = 1 unit along the axes. (5)

i) Plot the following points: \( A(2,3,5) \) and \( B(4,0) \)
ii) Reflect point \(A\) on the x-axis and name it A''
iii) Reflect point \(B\) on the origin and name it B''
iv) Reflect A'' on y-axis and name it A''''
v) Reflect A'''' on the x-axis and name it A''''
vi) Join the points ABA''A''''B''A''''A and give the geometrical name of the closed figure so formed', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-8ca4cf-4-0', '8ca4cf', 21, '4', 'a) Solve the following quadratic equation: $$7x^2 + 2x - 2 = 0$$ (3)

Give your answer correct to two significant figures', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-8ca4cf-4-1', '8ca4cf', 22, '4', 'b) Use graph sheet for this question. The following table gives the number of items stocked in a department store. Draw a histogram for the following distribution and then estimate the mode. Use \(2\mathrm{cm} = 10\) items and \(2\mathrm{cm} = 2\) shops on x-axis and y-axis respectively: (3)

| Number of items | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of stores | 3 | 8 | 12 | 6 | 4 | 2 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-8ca4cf-4-2', '8ca4cf', 23, '4', 'Ms Advani went to a department store and bought the following: (4)

| S. No. | Item purchased | Price per item in Rs | Quantity purchased | Discount % | CGST % |
| --- | --- | --- | --- | --- | --- |
| 1 | Almonds | 800 | 1 | 10% | 6 % |
| 2 | Biscuits | 125 | 8 | 20% | 9 % |
| 3 | Watch | 2000 | 1 | 5% | 14% |

i) Find the total SGST paid by her on the items
ii) Find the total bill amount (incl. GST) paid by her', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-8ca4cf-5-0', '8ca4cf', 24, '5', 'a) $$A = \begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix}, B = \begin{bmatrix} 6 \\ 1 \end{bmatrix}, C = [-4 \quad 5]$$. Evaluate $$A^2 - BC$$ (3)', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-8ca4cf-5-1', '8ca4cf', 25, '5', 'b) In the given figure, AOC is a diameter and AC is parallel to ED. If Angle CBE = 62°, calculate angle DEC (3)', 3, 'Circles', 'short', 3, '8ca4cf__Champion_X_p3_img_1_jpeg.webp', NULL),
  ('MQ-8ca4cf-5-2', '8ca4cf', 26, '5', 'd) Using remainder theorem, factorise the given polynomial completely: (4)

$$2x^3 + x^2 - 38x + 35$$', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-8ca4cf-6-0', '8ca4cf', 27, '6', 'a) Write the equation of a line which is parallel to 3x - 4y = 0 and which passes through point P, where P divides the line segment joining A (2, -5) and B (-5, 9) in the ratio 3: 4

(3)', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-8ca4cf-6-1', '8ca4cf', 28, '6', 'b) Prove that: $$\frac{1}{sec\theta - tan\theta} - sec\theta = sec\theta - \frac{1}{sec\theta + tan\theta}$$ (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-8ca4cf-6-2', '8ca4cf', 29, '6', 'c) The sum of first 15 terms of an AP is 105. The sum of the next 15 terms of the same AP is 780. Find the first three terms of the AP. (4)', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-8ca4cf-7-0', '8ca4cf', 30, '7', 'a) A bag contains some green, yellow and white balls. The probability of selecting a green ball is $$\frac{1}{5}$$ and of yellow ball is $$\frac{1}{4}$$. If the bag contains 22 white balls, then find: (3)

i) Total number of balls in the bag

ii) Probability of selecting a white ball', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-8ca4cf-7-1', '8ca4cf', 31, '7', 'b) A cone of slant height 5 cm and height 4 cm is full of water. When a sphere which exactly fits and touches the sides of the cone is immersed, how much volume of water flows out [give your answer in terms of $$\pi$$]? (3)', 3, 'Mensuration', 'short', 4, '8ca4cf__Champion_X_p4_img_0_jpeg.webp', NULL),
  ('MQ-8ca4cf-7-2', '8ca4cf', 32, '7', 'c) In the given figure, ABCD is a cyclic quadrilateral. The tangent to the circle at B meets DC produced at F. If angle EAB = 85°, angle BFC = 50°, calculate:

i) Angle CAB

ii) Angle FBC (4)', 4, 'Circles', 'long', 4, '8ca4cf__Champion_X_p4_img_1_jpeg.webp', NULL),
  ('MQ-8ca4cf-8-0', '8ca4cf', 33, '8', 'a) Solve the following inequation and represent the solution set on a real number line:(3)

$$\frac{1}{2}(2x - 1) \le 2x + \frac{1}{2} < x + 5\frac{1}{2}, x \in R$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-8ca4cf-8-1', '8ca4cf', 34, '8', 'b) Find the mean of the following data using step-deviation method (3)

| Class Interval | 40-45 | 45-50 | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 12 | 20 | 16 | 10 | 8 | 5 | 4 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-8ca4cf-8-2', '8ca4cf', 35, '8', 'c) In the given figure, AB // CD // EF, AB = 4cm, OC = 9cm, OD = 6cm, DF = 3cm, CD = 8cm. Find the length of: (4)

i) OB ii) CE iii) OA iv) EF', 4, 'Similarity', 'long', 4, '8ca4cf__Champion_X_p4_img_2_jpeg.webp', NULL),
  ('MQ-8ca4cf-9-0', '8ca4cf', 36, '9', 'a) A journey of 192 km from Mumbai to Pune takes two hours less by a fast train than by a slow train. If the average speed of the slow train is 16km/hr less than that of the fast train, find the average speed of each train. (4)', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-8ca4cf-9-1', '8ca4cf', 37, '9', 'b) Use a graph sheet for this question. The table below shows the distribution of scores obtained by 160 shooters in a shooting competition out of a total of 90 marks. (6)

| Score | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of shooters | 5 | 11 | 14 | 26 | 29 | 15 | 25 | 23 | 12 |

Use 2 cm = 10 score and 2 cm = 20 shooters on x-axis & y-axis respectively to draw an ogive and hence estimate:

i) The median score
ii) The inter-quartile range of scores
iii) Number of shooters who scored more than \(80\%\) score', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-8ca4cf-10-0', '8ca4cf', 38, '10', 'a) Which number should be subtracted from each of 11, 23 and 53 in order that the remainders would be in continued proportion? (3)', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-8ca4cf-10-1', '8ca4cf', 39, '10', 'b) From a boat \(300\mathrm{m}\) away from a vertical cliff, the angles of elevation of the top and the foot of a vertical concrete pillar on top of the cliff are \(55^{\circ}40''\) and \(54^{\circ}20''\) respectively. Find the height of the pillar correct to the nearest metre. (3)', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-8ca4cf-10-2', '8ca4cf', 40, '10', 'c) Using ruler and compass only, draw a triangle with sides \(3\mathrm{cm}\), \(4\mathrm{cm}\) and \(5\mathrm{cm}\). Draw its circumcircle and measure its radius (4)', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-7662e6-1-0', '7662e6', 0, '1', '(i) The roots of the quadratic equation $$x^2 - 18 = 6x$$ are 8.196 or -2.196. The roots correct to 3 significant figures are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['8.2 or 2.2', '8.2 or -2.2', '8.1 or -2.1', '8.19 or -2.20']::text[]),
  ('MQ-7662e6-1-1', '7662e6', 1, '1', '(ii) Net GST payable by the dealer to the Government =', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Input GST - Output GST', 'Input GST + Output GST', 'Output GST - Input GST', 'Output GST + Input GST']::text[]),
  ('MQ-7662e6-1-2', '7662e6', 2, '1', '(iii) Statement 1: When each term of an inequation is multiplied or divided by the same negative number, the sign of inequality remains the same.
Statement 2: If both sides of an equation are positive or both negative, sign of inequality remains the same when their reciprocals are taken', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['Both statements are correct', 'Both statements are incorrect', 'Only statement 1 is correct', 'Only statement 2 is correct']::text[]),
  ('MQ-7662e6-1-3', '7662e6', 3, '1', '(iv) $(y + 1)$ is a factor of', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$y^3 + 1$', '$y^2 - 1$', 'Both a and b', 'Neither']::text[]),
  ('MQ-7662e6-1-4', '7662e6', 4, '1', '(v) Name the type of matrix: $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$', 1, 'Matrices', 'MCQ', 1, NULL, array['Only square', 'Square and', 'Square and', 'Square and diagonal unit zero']::text[]),
  ('MQ-7662e6-1-5', '7662e6', 5, '1', '(vi) If ''a'' is the first term of an A.P., ''d'' is the common difference and ''n'' is the number of terms in it, then the $p^{th}$ term from its end =', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['\((n - p)^{th}\) term from the beginning', '\((n - p + 1)^{th}\) term from the beginning', '\((n - p - 1)^{th}\) term from the beginning', '\((n + p - 1)^{th}\) term from the beginning']::text[]),
  ('MQ-7662e6-1-6', '7662e6', 6, '1', '(vii) The coordinates of the centroid of a triangle whose vertices are (0, 6), (8,12) and (8, 0) are', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(\frac{16}{3}, 6)$', '(4, 6)', '(16, 6)', '$(\frac{16}{3}, -6)$']::text[]),
  ('MQ-7662e6-1-7', '7662e6', 7, '1', '(viii) In the adjoining figure, ABC is a triangle right-angled at vertex A and AD is the altitude. $\Delta$ABD is similar to', 1, 'Similarity', 'MCQ', 2, '7662e6__Chandulal__p2_img_0_jpeg.webp', array['$\Delta$CDA', '$\Delta$CAD', '$\Delta$DAC', '$\Delta$DCA']::text[]),
  ('MQ-7662e6-1-8', '7662e6', 8, '1', '(ix) In a cyclic quadrilateral ABCD, $\angle B : \angle D = 2 : 3$ and AD $\parallel$ BC. Find the measure of $\angle A$.', 1, 'Circles', 'MCQ', 2, NULL, array['$72^{\circ}$', '$36^{\circ}$', '$108^{\circ}$', '$54^{\circ}$']::text[]),
  ('MQ-7662e6-1-9', '7662e6', 9, '1', '(x) From a solid cylinder of height 24 cm and radius 7 cm, a conical cavity of same radius and height is made. The surface area of the remaining solid will be:', 1, 'Mensuration', 'MCQ', 2, NULL, array['CSA of cylinder + CSA of cone + 2πr²', 'CSA of cylinder + TSA of cone + 2πr²', 'CSA of cylinder + TSA of cone + \(\pi r^2\)', 'CSA of cylinder + CSA of cone + \(\pi r^2\)']::text[]),
  ('MQ-7662e6-1-10', '7662e6', 10, '1', '(xi) The step-deviation method to calculate mean is especially helpful when the data involves

(a) small

(b) medium

(c) big

(d) None of the

quantities

quantities

quantities

above', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-7662e6-1-11', '7662e6', 11, '1', '(xii) If 3 unbiased coins are tossed, what is the probability of getting at most one head', 1, 'Probability', 'MCQ', 2, NULL, array['$\frac{3}{8}$', '$\frac{1}{4}$', '$\frac{5}{8}$', '$\frac{1}{2}$']::text[]),
  ('MQ-7662e6-1-12', '7662e6', 12, '1', '(xiii) Statement 1: Any point on x-axis is (x, 0) and equation of x-axis is y = 0
Statement 2: Any point on y-axis is (0, y) and equation of y-axis is x = 0', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['Only statement 1 is correct', 'Only statement 2 is correct', 'Both statements are incorrect', 'Both statements are correct.']::text[]),
  ('MQ-7662e6-1-13', '7662e6', 13, '1', '(xiv) The given group of numbers are in: 1, 4, 9, 16, 25,...', 1, NULL, 'MCQ', 2, NULL, array['a progression', 'a sequence', 'Both (a) and (b)', 'A.P.']::text[]),
  ('MQ-7662e6-1-14', '7662e6', 14, '1', '(xv) What will be the order of Matrix P? $\underset{\text{PX}}{\text{PX}} Q_{3 \times 2} = PQ_{2 \times 2}$', 1, 'Matrices', 'MCQ', 2, NULL, array['$P_{3 \times 2}$', '$P_{2 \times 2}$', '$P_{3+2}$', '$P_{2 \times 3}$']::text[]),
  ('MQ-7662e6-2-0', '7662e6', 15, '2', '(i) Priyanka deposits ₹350 per month at 10% p.a. in a recurring deposit account for 2 1/2 years. Find:

(a) interest earned in \(2\frac{1}{2}\) years.
(b) maturity value.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-7662e6-2-1', '7662e6', 16, '2', '(ii) 1024, 256, ''p'', 4, and ''q'' are in continued proportion. Find the values of ''p'' and ''q''. [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-7662e6-2-2', '7662e6', 17, '2', '(iii) Prove that: \(\frac{\cos\theta}{\cos\theta + 1} + \frac{\cos\theta}{\cos\theta - 1} = 2\tan\theta\) [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-7662e6-3-0', '7662e6', 18, '3', '(i) The internal radius of a hollow wooden hemisphere is 8 cm and it is uniformly 1 cm thick. Find:

(a) the volume of wood in it to the nearest \(\mathbf{cm}^3\)
(b) quantity of oil it can hold correct to 4 significant figures.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-7662e6-3-1', '7662e6', 19, '3', '(ii) AB is diameter of a circle with centre C (-2, 5). If A is (4, -3), find:

(a) the coordinates of B.
(b) equation of tangent AT.', NULL, 'Circles', 'short', 3, '7662e6__Chandulal__p3_img_0_jpeg.webp', NULL),
  ('MQ-7662e6-3-2', '7662e6', 20, '3', '(iii) Use graph sheet for this question. Take 1 cm = 1 unit along the axes. [5]

(a) Plot the points A (4, 6) and B (1, 2).
(b) A'' is the image of A when reflected in x-axis.
(c) B'' is the image of B when reflected in the line AA''.
(d) Join ABA''B'' in order and give a geometrical name for the figure. Justify your answer.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-7662e6-4-0', '7662e6', 21, '4', '(i) Find the total amount to be paid for the following intra-state bill. [3]

| Articles | Quantity | Rate (₹) | GST rate (%) |
| --- | --- | --- | --- |
| Pens | 50 | 75 | 12 |
| Pencil box | 100 | 35 | 12 |
| Geometrical drawing sets | 30 | 95 | 12 |', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-7662e6-4-1', '7662e6', 22, '4', '(ii) Solve for \( x \) using quadratic formula method: \( x^2 - 2x = 19 \). Give your answer correct to two places of decimal.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-7662e6-4-2', '7662e6', 23, '4', '(iii) Use graph sheet for this question. Draw a histogram for the money spent in the canteen by 60 students in the following table and hence estimate the mode for the following distribution. Take \(2\mathrm{cm} = \text{₹}10\) and \(2\mathrm{cm} = 2\) students along the axes.

| Money spent (₹) | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 16 | 20 | 13 | 3 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-7662e6-5-0', '7662e6', 24, '5', '(i) If $$X = \begin{bmatrix} sec^2\theta & 0 \\ cot^2\theta & sin^2\theta \end{bmatrix}$$ and $$Y = \begin{bmatrix} -\tan^2\theta & -1 \\ -\cosec^2\theta & \cos^2\theta \end{bmatrix}$$. Find $$X + Y$$.', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-7662e6-5-1', '7662e6', 25, '5', '(ii) In the quadrilateral ABCD, AC bisects $$\angle BCD$$, $$\angle ABC = 90^\circ = \angle DAC$$. If AB = 6 cm and AC = 10 cm, calculate AD and CD.', 3, 'Similarity', 'short', 4, '7662e6__Chandulal__p4_img_0_jpeg.webp', NULL),
  ('MQ-7662e6-5-2', '7662e6', 26, '5', '(iii) Using remainder theorem factorise: $$4x^3 + 7x^2 - 36x - 63$$.', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-7662e6-6-0', '7662e6', 27, '6', '(i) PQRS is a parallelogram. P (-2, 0), Q (6, 3), S (8, 5). Find the:

(a) coordinates of R.
(b) equation of QS.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-7662e6-6-1', '7662e6', 28, '6', '(ii) Prove that: \(\frac{\sin^3 A - \cos^3 A}{1 + \sin A \cos A} = \sin A - \cos A\)', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-7662e6-6-2', '7662e6', 29, '6', '(iii) The first term of an A.P. is - 5 and the last term 45. If the sum of the terms of the A.P. is 120, then find the number of terms and the common difference.', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-7662e6-7-0', '7662e6', 30, '7', '(i) A jar contains 81 balls each of which is red, blue, or green. The probability of selecting a red ball is $$\frac{1}{3}$$ and that of blue is $$\frac{4}{9}$$. Find:

(a) how many green balls does the jar contain?
(b) probability of selecting the green ball.', NULL, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-7662e6-7-1', '7662e6', 31, '7', '(ii) Steve and Robin ordered some ice-creams in a shop. Steve wants it to be served in a cone with a hemispherical topping and Robin in a cylindrical cup. The height of cone and cylinder is 5 cm and the radius of the cone, cylinder and hemisphere are all 3.5 cm. Find the volume of ice-cream each got.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-7662e6-7-2', '7662e6', 32, '7', '(iii) ABCD is a cyclic quadrilateral. SDT is a tangent. $$\angle ABD = 50^\circ, \angle DBC = 35^\circ$$. Find:

(a) $$\angle ADC$$ (b) $$\angle ADS$$ (c) $$\angle CDT$$ (d) $$\angle ADO$$', NULL, 'Circles', 'short', 4, '7662e6__Chandulal__p4_img_1_jpeg.webp', NULL),
  ('MQ-7662e6-8-0', '7662e6', 33, '8', '(i)

Calculate the mean by the step-deviation method to the nearest integer of the following distribution.

| Class | 75 – 80 | 80 – 85 | 85 – 90 | 90 – 95 | 95 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | 12 | 9 | 15 | 7 |', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-7662e6-8-1', '7662e6', 34, '8', '(ii)

Solve the following inequation. $$-2\frac{2}{3} \leq x + \frac{1}{3} < 3\frac{1}{3}, x \in R.$$ [3] Represent the solution set on a number line.', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-7662e6-8-2', '7662e6', 35, '8', '(iii)

In PQR, S is a point on QR so that $$\angle Q = \angle SPR$$. If QS = 5 cm and SR = 4 cm. Find:

(a) PR.

(b) PS : QP

[4]', 4, 'Similarity', 'long', 5, '7662e6__Chandulal__p5_img_0_jpeg.webp', NULL),
  ('MQ-7662e6-9-0', '7662e6', 36, '9', '(i)

Devarsh takes 16 days less than Mithil to do a piece of work. If both working together can do it in 15 days, in how many days will Devarsh alone complete the work.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-7662e6-9-1', '7662e6', 37, '9', '(ii)

Use a graph sheet for this question. The following table shows savings of a group of 100 students of their pocket money.

| Savings (₹) | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 8 | 12 | 18 | 22 | 26 | 10 | 4 |

Use 2 cm = ₹10 and 2 cm = 10 students along the x-axis and y-axis respectively to draw an ogive and hence estimate:

(a) the median.

(b) the inter-quartile range.

(c) number of students saving less than ₹15.', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-7662e6-10-0', '7662e6', 38, '10', '(i) If a, b, and c are in continued proportion, prove that: $$a : c = (a + b)^2 : (c + b)^2$$ [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-7662e6-10-1', '7662e6', 39, '10', '(ii) Using ruler and compasses only, construct a regular hexagon of side 3.5 cm. Hence, construct a circle circumscribing the hexagon. Measure and write down the length of the circum-radius.', NULL, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-7662e6-10-2', '7662e6', 40, '10', '(iii) The angle of elevation of the top of a building under construction from a point 70 m from its base is 34°. After the construction was completed, the angle of elevation of the top became 49°. How much higher was the building raised? Give your answer correct to the nearest metre. (Use Mathematical Table for this question).', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-1-0', 'f8dd74', 0, '1', '(i) The roots of the quadratic equation $x^2 + 7x = 7$ are 0.885 or -7.885. The roots correct to 2 significant figures are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['0.89 or -7.9', '0.88 or -7.9', '0.89 or -7.8', '0.8 or -7.9']::text[]),
  ('MQ-f8dd74-1-1', 'f8dd74', 1, '1', '(ii) The correct solution set for the given number line is', 1, 'Linear Inequations', 'MCQ', 1, 'f8dd74__Chandulal__p1_img_1_jpeg.webp', array['$\{x: -4 \leq x < 4, x \in \mathbb{R}\}$', '$\{x: -4 < x < 4, x \in \mathbb{R}\}$', '$\{x: -4 < x \leq 4, x \in \mathbb{R}\}$', '$\{-3, -2, -1, 0, 1, 2, 3\}$']::text[]),
  ('MQ-f8dd74-1-2', 'f8dd74', 2, '1', '(iii) On dividing $ax^3 + 9x^2 + 4x - 10$ by $(x + 3)$, the remainder = 5, find the value of a.', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['1', '-1', '2', '-2']::text[]),
  ('MQ-f8dd74-1-3', 'f8dd74', 3, '1', '(iv) If the consumer pays ₹1,050 as final amount of the bill including 5% GST. The GST collected by the State Government is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹50', '₹525', '₹1,000', '₹25']::text[]),
  ('MQ-f8dd74-1-4', 'f8dd74', 4, '1', '(v) Matrix $A = \begin{bmatrix} 2 & 2 \\ 2 & 2 \end{bmatrix}, A^2 =$', 1, 'Matrices', 'MCQ', 1, NULL, array['$\begin{bmatrix} 4 & 4 \\ 4 & 4 \end{bmatrix}$', '$\begin{bmatrix} 16 & 16 \\ 16 & 16 \end{bmatrix}$', '$\begin{bmatrix} 8 & 8 \\ 8 & 8 \end{bmatrix}$', '$\begin{bmatrix} 2 & 2 \\ 2 & 2 \end{bmatrix}$']::text[]),
  ('MQ-f8dd74-1-5', 'f8dd74', 5, '1', '(vi) If the first term of an A.P. = -15 and common difference = -15, the first three terms of the A.P. will be', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['-15, 0, 15', '15, 0, -15', '-15, 30, -15', '-15, -30, -45']::text[]),
  ('MQ-f8dd74-4-0', 'f8dd74', 6, '4', '(iii) Use graph sheet for this question. Draw a histogram from the following frequency distribution and hence estimate the mode from the graph. Take 2 cm = 5 units along on the x-axis and 2 cm = 2 units along the y-axis.

| Class | 0 - 5 | 5 - 10 | 10 - 15 | 15 - 20 | 20 - 25 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 5 | 18 | 14 | 8 |', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-5-0', 'f8dd74', 7, '5', '(i) Let $A = \begin{bmatrix} 4 & -1 \\ 2 & 0 \end{bmatrix}$ and $B = \begin{bmatrix} 6 \\ 4 \end{bmatrix}$ . Find a matrix $M$ such that $AM = B$ . [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-5-1', 'f8dd74', 8, '5', '(ii) In the given figure, $AD \parallel BC$ and $\angle ABC = 90^\circ = \angle ACD$ , $AB = 12$ cm and $BC = 16$ cm. Find $CD$ and $AD$ . [3]', 3, 'Similarity', 'short', 2, 'f8dd74__Chandulal__p2_img_0_jpeg.webp', NULL),
  ('MQ-f8dd74-5-2', 'f8dd74', 9, '5', '(iii) When $f(x) = ax^3 - bx^2 + x - 1$ is divided by $(2x - 1)$ , it leaves a remainder of $-1$ and [4] when divided by $(2x + 1)$ , it leaves a remainder of $\frac{-5}{2}$ . Using remainder theorem, find the values of ''a'' and ''b''.', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-f8dd74-6-0', 'f8dd74', 10, '6', '(i) ABCD is a rhombus. The coordinates of A and C are $(3, 6)$ and $(-1, 2)$ respectively. [3] Write down the equation of BD.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-6-1', 'f8dd74', 11, '6', '(ii) Prove that: $\frac{\sqrt{1+\cos A}}{\sqrt{1-\cos A}} = \operatorname{cosec} A + \cot A$ . [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-6-2', 'f8dd74', 12, '6', '(iii) The first and the last term of an A.P. are 17 and 350 respectively. If the common [4] difference is 9, how many terms are there in the A.P. and what is their sum?', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-f8dd74-7-0', 'f8dd74', 13, '7', '(i) A bag contains 12 balls out of which ''x'' are red. [3]

(a) one ball is drawn at random, what is the probability that it is red?

(b) If 6 more red balls are put in the bag, the probability of drawing a red ball will be double of that in (a). Find ''x''.', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-7-1', 'f8dd74', 14, '7', '(ii) A solid is in the shape of a hemisphere surmounted by a cone of same base radius 6 [3] cm and height 8 cm. It is melted and formed into a cylinder of height 15 cm. Find the radius of the cylinder.', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-f8dd74-7-2', 'f8dd74', 15, '7', '(iii) ABCD is a cyclic quadrilateral. TA and TC are tangents. $\angle BCT = 20^\circ$ , $\angle BAT = 35^\circ$ . Also, D-O-B. Find: [4]

(a) $\angle ADC$ (b) $\angle AOC$ (c) $\angle ABC$ (d) $\angle ATC$', 4, 'Circles', 'long', 2, 'f8dd74__Chandulal__p2_img_1_jpeg.webp', NULL),
  ('MQ-f8dd74-2-0', 'f8dd74', 16, '2', '(i) Messi has a recurring deposit account in a bank for 3 years at 8% p.a. If he gets ₹40,440 at the time of maturity, then find: [4]

(a) the monthly installment.
(b) the interest he gets on maturity.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-f8dd74-2-1', 'f8dd74', 17, '2', '(ii) If $a : b = c : d$, show that: [4]

$$a + b : c + d = \sqrt{a^2 + b^2} : \sqrt{c^2 + d^2}$$', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-f8dd74-2-2', 'f8dd74', 18, '2', '(iii) Prove that: $\frac{\cos^2 A}{\cos A - \sin A} + \frac{\sin A}{1 - \cot A} = \sin A + \cos A$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-f8dd74-3-0', 'f8dd74', 19, '3', '(i) A hemispherical bowl of radius 4 cm is filled to the brim with chocolate sauce. It is [4] later poured into a cone of radius 8 cm.

(a) What is the height upto which the sauce is filled in the cone?
(b) If the height of cone is \(10\mathrm{cm}\), what fraction of the cone is filled?', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-f8dd74-3-1', 'f8dd74', 20, '3', '(ii) From the given figure, write: [4]

(a) the coordinates of A, B, and C.
(b) the equation of AC.
(c) If AB intersects the \(x\)-axis at point \(P\), what is the \(x\)-intercept of point \(P\).', 4, 'Coordinate Geometry', 'long', 3, 'f8dd74__Chandulal__p3_img_0_jpeg.webp', NULL),
  ('MQ-f8dd74-3-2', 'f8dd74', 21, '3', '(iii) Use graph sheet for this question. Take 1 cm = 1 unit along the axes. [5]

(a) Plot A (4, 4), B (4, -6) and C (8, 0).
(b) Reflect the points A, B, and C on the y-axis and name it as A'', B'', C''. Write the coordinates of the images A'', B'', and C''.
(c) Give a geometrical name for the closed figure AA''C''B''BCA.
(d) What is the area of the quadrilateral A''C''CA?', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-f8dd74-4-1', 'f8dd74', 22, '4', '(i) A wholesaler purchased fancy lights for the taxable amount of ₹1,90,000. He sold it to [3] the retailer for the taxable amount of ₹2,10,000. Retailer sold it to the customer for the taxable amount of ₹2,20,000. Rate of GST is 18%. Find:

(a) CGST paid by the wholesaler to the Government.
(b) SGST paid by the retailer to the Government.', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-f8dd74-4-2', 'f8dd74', 23, '4', '(ii) Solve for x using quadratic formula method. Give your answer correct to one decimal [3]
place. $5x(x + 2) = 3$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f8dd74-1-6', 'f8dd74', 24, '1', '(vii) The point A (-7, 0) is invariant under reflection in the', 1, 'Coordinate Geometry', 'MCQ', 4, NULL, array['y-axis', 'origin', 'x-axis', 'line x = 7']::text[]),
  ('MQ-f8dd74-1-7', 'f8dd74', 25, '1', '(viii) In $\triangle ABC$, $AB = 4$ cm, $BC = 3$ cm and $AC = 5$ cm and in $\triangle DEF$, $DE = 18$ cm, $EF = 24$ cm and $DF = 30$ cm, then the correct correspondence for similarity will be', 1, 'Similarity', 'MCQ', 4, 'f8dd74__Chandulal__p4_img_0_jpeg.webp', array['$\triangle ABC \sim \triangle DEF$', '$\triangle ABC \sim \triangle EDF$', '$\triangle ACB \sim \triangle DEF$', '$\triangle ABC \sim \triangle FED$']::text[]),
  ('MQ-f8dd74-1-8', 'f8dd74', 26, '1', '(ix) In the given figure, PT is a tangent to the circle. Find PT, if $AT = 16$ cm and $AB = 12$ cm

(a) 20 cm (b) 8 cm (c) 16 cm

(d) 4 cm', 1, 'Circles', 'short', 4, 'f8dd74__Chandulal__p4_img_1_jpeg.webp', NULL),
  ('MQ-f8dd74-1-9', 'f8dd74', 27, '1', '(x) Observe the given figure and choose the appropriate answer:

- (a) Vol of cylinder in Fig B < Vol of cylinder in Fig A
- (b) Vol of Cylinder in Fig A < Vol of Cylinder in Fig B
- (c) Volume of Cylinder in Fig A = Volume of Cylinder in Fig B
- (d) Volume of cylinder = area of the rectangle

Fig', 1, 'Mensuration', 'short', 4, 'f8dd74__Chandulal__p4_img_2_jpeg.webp', NULL),
  ('MQ-f8dd74-1-10', 'f8dd74', 28, '1', '(xi) What will be the modal class of the given frequency distribution?

| Class interval | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 5 | 13 | 11 | 6 |

| (a) 0 - 10 | (b) 20 - 30 | (c) 30 - 40 | (d) 40 - 50 |
| --- | --- | --- | --- |', 1, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f8dd74-1-11', 'f8dd74', 29, '1', '(xii) Cards bearing number 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20 are kept in a bag. A card is drawn at random from the bag. What is the probability of getting an even number?', 1, 'Probability', 'MCQ', 4, NULL, array['1', '0', '0.5', '0.75']::text[]),
  ('MQ-f8dd74-1-12', 'f8dd74', 30, '1', '(xiii) Statement 1: Two matrices can be multiplied only when number of columns of the first matrix = number of rows of the second matrix.
Statement 2: A matrix is said to be a unit matrix if each element is ''1''.', 1, 'Matrices', 'MCQ', 4, NULL, array['Only statement 1 is correct', 'Only statement 2 is correct', 'Both statements are incorrect', 'Both statements are correct']::text[]),
  ('MQ-f8dd74-1-13', 'f8dd74', 31, '1', '(xiv) In a given A.P., which of the following will always be true, $S = \text{Sum of ''n'' terms and T represents value of ''n'' terms.}$', 1, 'Arithmetic Progression', 'MCQ', 4, NULL, array['$S_4 - S_1 = T_3$', '$S_4 - S_1 = T_4$', '$S_4 + S_1 = T_4$', '$S_4 - T_1 = T_4$']::text[]),
  ('MQ-f8dd74-1-14', 'f8dd74', 32, '1', '(xv) ABC is a triangle and G (4, 3) is the centroid of the triangle. If A (1, 3), B (4, b) and C (7, 1), the value of ''b'' is', 1, 'Coordinate Geometry', 'MCQ', 4, NULL, array['-5', '10', '5', '-10']::text[]),
  ('MQ-f8dd74-8-0', 'f8dd74', 33, '8', '(i) The following table gives the weight in grams of a sample of 50 potatoes taken from [3] a large consignment.

| Weight (g) | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 |
| --- | --- | --- | --- | --- | --- |
| No. of potatoes | 8 | 10 | 12 | 16 | 4 |

Calculate the mean by the short-cut method.', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-8-1', 'f8dd74', 34, '8', '(ii) Solve the following inequation and represent the solution set on a number line. [3]

$$- \frac{x}{3} \leq \frac{x}{2} - 1 \frac{1}{3} < \frac{1}{6}, x \in \mathbb{R}$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-8-2', 'f8dd74', 35, '8', '(iii) In the given figure, ABCD is a parallelogram. BC is extended to a point Z such that AZ meets diagonal DB at X and side DC at Y and 3DX = XB.

(a) Prove that \(\Delta \mathrm{AXD} \sim \Delta \mathrm{ZXB}\).
(b) Name a triangle similar to \(\Delta DXY\)
(c) If \(AB = 6\mathrm{cm}\), \(AD = 4\mathrm{cm}\), find the lengths of BZ and DY.', NULL, 'Similarity', 'short', 5, 'f8dd74__Chandulal__p5_img_0_jpeg.webp', NULL),
  ('MQ-f8dd74-9-0', 'f8dd74', 36, '9', '(i) A piece of cloth costs ₹200. If one piece were 5 m longer and each metre of cloth cost ₹2 less, the cost of the piece would have remained unchanged. How long is the piece and what is the original rate per metre?', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-9-1', 'f8dd74', 37, '9', '(ii) Use a graph sheet for this question. The following table shows weights of 160 [6] applicants for the Army recruitment.

| Weight (kg) | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of applicants | 4 | 10 | 16 | 24 | 40 | 26 | 24 | 16 |

Use 2 cm = 5 kg and 2 cm = 20 applicants along the x-axis and y-axis respectively to draw an ogive and hence estimate:

(a) the median weight.
(b) the lower quartile.
(c) If an applicant weighing less than \(52\mathrm{kg}\) and more than \(87\mathrm{kg}\) is rejected, what fraction of applicants are rejected because of their weight.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-f8dd74-10-0', 'f8dd74', 38, '10', '(i) Using the properties of proportion, solve for \( x \): \( \frac{5x + (x^2 - 1)}{5x - (x^2 - 1)} = \frac{7}{5} \) [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-10-1', 'f8dd74', 39, '10', '(ii) Using ruler and compasses only, construct a triangle ABC with BC = 6.5 cm, AB = 5.5 cm, AC = 5 cm. Construct the incircle of the triangle. Measure and record the radius of the incircle.', NULL, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-f8dd74-10-2', 'f8dd74', 40, '10', '(iii) A man on the top of a tower observes a car moving at a uniform speed towards it. If it takes 12 minutes for the angle of depression to change from \(30^{\circ}\) to \(45^{\circ}\). How soon will the car reach the tower? Give the answer correct to the nearest second. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a53e09-1-0', 'a53e09', 0, '1', '(i) The point A(4, -5) is reflected in the origin to point A''. The Point A'' is then reflected in x- axis to the point A''''. Therefore, the coordinates of A'''' are', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(-4, -5)', '(4, 5)', '(-4, 5)', '(4, -5)']::text[]),
  ('MQ-a53e09-1-1', 'a53e09', 1, '1', '(ii) If a number x is chosen from the numbers 1, 2, 3 and number y is selected from the numbers 1, 4, 9, then probability of xy < 9 is', 1, 'Probability', 'MCQ', 1, NULL, array['3/9', '4/9', '1/9', '5/9']::text[]),
  ('MQ-a53e09-1-2', 'a53e09', 2, '1', '(iii) In the given figure, O is the centre of the circle.
If ∠COB = 30°, ∠AOB = 60°, then ∠ADC =', 1, 'Circles', 'MCQ', 2, 'a53e09__Children_S_p2_img_0_jpeg.webp', array['30⁰', '60⁰', '90⁰', '45⁰']::text[]),
  ('MQ-a53e09-1-3', 'a53e09', 3, '1', '(iv) If y – intercept and inclination of a line are 6 and 45⁰ respectively, then the equation of a line is :', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['x – y + 6 = 0', '–x –y + 6 = 0', 'y – x + 6 = 0', 'x + y + 6 = 0']::text[]),
  ('MQ-a53e09-1-4', 'a53e09', 4, '1', '(v) If ∑fx = 170 and ∑f = 25 , then the mean x̄ =', 1, 'Statistics', 'MCQ', 2, NULL, array['19.5', '15.0', '6.80', '68.0']::text[]),
  ('MQ-a53e09-1-5', 'a53e09', 5, '1', '(vi) (1 – sinA) ( 1 + sin A) ( 1 + tan²A) is equal to :', 1, 'Trigonometry', 'MCQ', 2, NULL, array['–1', '1', 'sec²A', 'cos²A']::text[]),
  ('MQ-a53e09-1-6', 'a53e09', 6, '1', '(vii) The solution set for the given inequation is :
– 6 < 2x < 6, where x ∈ I', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{– 3, – 2, – 1, 0 , 1, 2, 3}', '{– 2, – 1, 0 , 1, 2}', '{– 5, – 4, – 3, – 2, – 1, 0, 1, 2, 3, 4, 5}', '{– 6, – 5, – 4, – 3, – 2, – 1, 0, 1, 2, 3, 4, 5, 6}']::text[]),
  ('MQ-a53e09-1-7', 'a53e09', 7, '1', '(viii) If in two triangles ABC and PQR, $$\frac{AB}{QR} = \frac{BC}{RP} = \frac{AC}{QP}$$ then', 1, 'Similarity', 'MCQ', 2, NULL, array['ΔPQR ~ ΔABC', 'ΔPQR ~ ΔCAB', 'ΔCBA ~ ΔPQR', 'ΔBCA ~ ΔPQR']::text[]),
  ('MQ-a53e09-1-8', 'a53e09', 8, '1', '(ix) Volume and surface area of a solid hemisphere are numerically equal. Then the diameter of the hemisphere, is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['2 units', '4.5 units', '9 units', '3 units']::text[]),
  ('MQ-a53e09-1-9', 'a53e09', 9, '1', '(x) If ax - 3y = - 12 and 2x - 3y = 3 are parallel to each other, then the value of `a` is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['2', '3', '- 2', '- 3']::text[]),
  ('MQ-a53e09-1-10', 'a53e09', 10, '1', '(xi) Sarah deposited ₹ 1000 for 2 years in a Recurring deposit account and receives ₹ 25500 as maturity value. The interest earned in 2 years is:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹13500', '₹ 3000', '₹ 24000', '₹ 1500']::text[]),
  ('MQ-a53e09-1-11', 'a53e09', 11, '1', '(xii) Which of the following equations has 2 as a root?', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['$$x^2 - 4x + 5 = 0$$', '$$x^2 + 3x - 12 = 0$$', '$$x^2 + 5x - 14 = 0$$', '$$3x^2 - 6x - 2 = 0$$']::text[]),
  ('MQ-a53e09-1-12', 'a53e09', 12, '1', '(xiii) The selling price of an article excluding GST is ₹ 800. If rate of GST is 12%, then the total price of the article is:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹ 704', '₹ 96', '₹ 896', '₹ 848']::text[]),
  ('MQ-a53e09-1-13', 'a53e09', 13, '1', '(xiv) If $$\begin{bmatrix} x+2 & y+3 \\ 9 & 0 \end{bmatrix} = \begin{bmatrix} 6 & -1 \\ 9 & 0 \end{bmatrix}$$ then the value of x - y is', 1, 'Matrices', 'MCQ', 3, NULL, array['8', '0', '12', '- 8']::text[]),
  ('MQ-a53e09-1-14', 'a53e09', 14, '1', '(xv) If 2, k, 8 are in AP, then find the value of `k`.', 1, 'Arithmetic Progression', 'MCQ', 4, NULL, array['4', '± 4', '5', '6']::text[]),
  ('MQ-a53e09-2-0', 'a53e09', 15, '2', '(i) The number (x + 3) is the mean proportion of two numbers (x - 1) and 2x. Find the numbers. (where x > 0) [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-a53e09-2-1', 'a53e09', 16, '2', '(ii) The sum of 7th and 12th terms of an AP is 94 and sum of its 10th and 20th terms is 138. Find its 18th term. [4]', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-a53e09-2-2', 'a53e09', 17, '2', '(iii) Use graph paper for this question. A(0, 4), B(- 2, 2) and C(- 2, 5) and D(- 4, 0). [4]

(a) Plot the given points on a graph sheet taking 2 cm = 1 unit on both the axes.
(b) Reflect points A, B, C in x- axis to get A`, B`, C` and write its coordinates.
(c) Write the equation of line AA`.
(d) Write the geometrical name of the figure ABCDC`B`A`.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-a53e09-3-0', 'a53e09', 18, '3', '(i) When polynomials kx³ - 13x² + 3 and x³ + 10x - k when divided by (x + 2), the remainders are p and q respectively Find the value of `k` if p + 2q = -25 [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-a53e09-3-1', 'a53e09', 19, '3', '(ii) Given A=[2 cos60 - 2 sin30] and if A² - x A + y I = 0, then find the values of x and y [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-a53e09-3-2', 'a53e09', 20, '3', '(iii) 1500 tents are set up by 50 schools to help homeless people affected due to floods and the whole expenditure will be shared equally by the schools. The lower part of each tent is cylindrical of base radius 2.8m and height 3.5 m, with conical upper part of same base radius but of height 2.1m. If the resin used to make the tents cost ₹ 120 per sq.m, find the amount shared by each school.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-a53e09-4-0', 'a53e09', 21, '4', '(i) Ms. Kavita went to a department stores and bought the following items. [3]
Find :

(a) the total CGST paid by her on the items.
(b) the total bill amount including GST paid by her.

| Sr. No | Bought items | Price per item in ₹ | Quantity | Discount | GST |
| --- | --- | --- | --- | --- | --- |
| 1 | Almonds | 800/kg | 1 | 10% | 12% |
| 2 | Pulses | 125/kg | 8 | - | 0% |
| 3 | Wrist watch | 2000 | 1 | 5% | 28% |', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-a53e09-4-1', 'a53e09', 22, '4', '(ii) Solve the given quadratic equation: \( x - 5 = \frac{10}{x} \). Give your answer correct [3] to 2 significant figures.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-a53e09-4-2', 'a53e09', 23, '4', '(iii) Prove that: \( 2 + \tan^2 A + \cot^2 A = \frac{1}{\sin^2 A - \sin^4 A} \) [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a53e09-5-0', 'a53e09', 24, '5', '(i) The first 8 and last 8 letters of the English alphabet are taken into consideration and one letter is taken at random. [3]
Find the probability of getting:

(a) a vowel
(b) none of the letters of the word ''PROBABILITY''.
(c) a consonant.', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-a53e09-5-1', 'a53e09', 25, '5', '(ii) Using the properties of proportion, solve for \( x \). [3]

$$\frac{(1+x+x^2)}{(1-x+x^2)} = \frac{124(1+x)}{126(1-x)}$$', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-a53e09-5-2', 'a53e09', 26, '5', '(iii) A box contains nails of different lengths as shown below. [4]

Draw a histogram and estimate the mode.

| Length (cm) | 2.0 – 2.5 | 2.5 – 3.0 | 3.0 – 3.5 | 3.5 – 4.0 | 4.0 – 4.5 |
| --- | --- | --- | --- | --- | --- |
| No. of nails. | 5 | 8 | 7 | 11 | 9 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-a53e09-6-0', 'a53e09', 27, '6', '(i) A cylindrical can of internal diameter 12 cm contains some water. [3]

When a solid sphere of diameter 9 cm is placed in it, it is completely immersed. Find the rise in the level of water (to one decimal place), if no water over flows.', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-a53e09-6-1', 'a53e09', 28, '6', '(ii) Using factor theorem factorise the polynomial [3]

$$x^3 + 13x^2 + 32x + 20 \text{ completely.}$$', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-a53e09-6-2', 'a53e09', 29, '6', '(iii) In the given figure, PQ and SR produced to meet at T. [4]

TA is a tangent to the circle at A
If TP = 18 cm, RQ = 4 cm,
TR = 6cm and TQ = 8 cm, then:

(a) prove $$\Delta TPS \sim \Delta TRQ$$.

(b) find the length of SP.

(c) find the length of TA.', 4, 'Circles', 'long', 6, 'a53e09__Children_S_p6_img_0_jpeg.webp', NULL),
  ('MQ-a53e09-7-0', 'a53e09', 30, '7', '(i) If $$A = \begin{bmatrix} 3 & -1 \\ 1 & 0 \end{bmatrix}$$ and $$B = \begin{bmatrix} 2 \\ 8 \end{bmatrix}$$, write the order of matrix X and find the matrix X such that AX = B [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-a53e09-7-1', 'a53e09', 31, '7', '(ii) Find the equation of the perpendicular bisector of the line segment joining A (-3, 7) and B (1, 5). [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-a53e09-7-2', 'a53e09', 32, '7', '(iii) Anil has Recurring deposit account in a bank and deposited ₹ 800 per month. If he gets ₹ 21,600 as maturity value and rate of interest is 12% p.a; calculate the total time in years for which he had the account in the bank. [4]', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-a53e09-8-0', 'a53e09', 33, '8', '(i) Solve the following inequation : [3]

$$-3 < -\frac{1}{2} - \frac{2x}{3} \le 2\frac{1}{6}, \quad x \in \mathbb{R}.$$

Represent the solution set on a real number line.', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-a53e09-8-1', 'a53e09', 34, '8', '(ii) A train covers 120 km at a uniform speed. If its speed had been increased by [3]

15 km/h, it would have covered the distance in 40 minutes less. Find the original speed.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-a53e09-8-2', 'a53e09', 35, '8', '(iii) Find the mean of the following distribution by step deviation method. [4]

| Class Interval | 0 - 5 | 5 - 10 | 10- 15 | 15-20 | 20-25 | 25-30 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 7 | 18 | 10 | 8 | 5 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-a53e09-9-0', 'a53e09', 36, '9', '(i) Find the sum of all the numbers between 100 and 1000 which are divisible by 9. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-a53e09-9-1', 'a53e09', 37, '9', '(ii) Construct a circle inscribing a regular hexagon of side \(5\mathrm{cm}\). Measure and record the radius of the incircle. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-a53e09-9-2', 'a53e09', 38, '9', '(iii) From the top of first building, if the top of the second building is observed, [4] the angle of elevation comes to \(30^{\circ}\) and if from the same point, the foot of the second building is observed, the angle of depression becomes \(60^{\circ}\). If the height of the first building is 18m, find
(a) the height of the second building
(b) the distance between two buildings to the nearest metre.', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-a53e09-10-0', 'a53e09', 39, '10', '(i) In the adjoining figure, O is the centre of the circumcircle of triangle ABC. Tangents at A and B intersect at T. If $\angle ATB = 80^{\circ}$ and $\angle AOC = 130^{\circ}$, calculate $\angle CAB$.

[4]', 4, 'Circles', 'long', 7, 'a53e09__Children_S_p7_img_0_jpeg.webp', NULL),
  ('MQ-a53e09-10-1', 'a53e09', 40, '10', '(ii) The following table shows the distribution of heights of a group of 200 factory workers. [6]

Take a scale of 2 cm = 5 cm of height and 2 cm = 20 workers.

| Height in (cm) | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 | 170-175 | 175-180 | 180-185 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 6 | 12 | 20 | 46 | 57 | 37 | 15 | 7 |

Draw an ogive and estimate the following:

(a) The median.
(b) The lower quartile.
(c) The percentage of workers of height 178 cm or taller.
(d) The height above which the tallest \(25\%\) of workers fall.', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-739266-1-0', '739266', 0, '1', 'a) The 5th and 10th terms of an AP are 36 and 61 respectively.
Find its 18th term [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-739266-1-1', '739266', 1, '1', 'b) What is the probability that one number randomly selected from a set of 2 digit numbers is

(i) a multiple of 2 and 7
(ii) one digit is thrice the other
(iii) sum of the two digits should be 7 [3]', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-739266-1-2', '739266', 2, '1', 'c) Solve the given quadratic equation and give your answer correct to two decimal places.

$$x - \frac{18}{x} = 6$$ [4]', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-739266-2-0', '739266', 3, '2', 'a) Given M = $$\begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$$. Find the value of ''k'' if M² - 6M + kI = 0, where I is an identity matrix.', NULL, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-739266-2-1', '739266', 4, '2', 'b) In the given figure, ΔPQR and ΔPST are right angled at Q and S.
Given QR = 10 cm, PT = 15 cm and TS = 12 cm.
Find PQ and PR.', 3, 'Similarity', 'short', 2, '739266__Children_S_p2_img_0_jpeg.webp', NULL),
  ('MQ-739266-2-2', '739266', 5, '2', 'c) Three numbers are in continued proportion and the middle number is 24. If the sum of the first and third is 52, find the numbers. [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-739266-3-0', '739266', 6, '3', 'a) Joseph has an account in recurring deposit scheme for 2 years. He deposits ₹ 1500 per month. If the rate of interest is 8% p.a, calculate the amount he would receive at the time of maturity. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-739266-3-1', '739266', 7, '3', 'b) Calculate the mean of the following data by using the short cut method [3]

| Class | 10 – 18 | 18 – 26 | 26 – 34 | 34 – 42 | 42 - 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 7 | 11 | 18 | 10 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-739266-3-2', '739266', 8, '3', 'c) Using properties of proportion, prove that : $$b^2 = \frac{2a^2x}{x^2+1}$$, when

$$x = \frac{\sqrt{a^2+b^2} + \sqrt{a^2-b^2}}{\sqrt{a^2+b^2} - \sqrt{a^2-b^2}} \tag{4}$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-739266-4-0', '739266', 9, '4', 'a) Without solving the following equation, find the value of ''p'' for which the equation has real and equal roots.

$$25x^2 - 2px + (p - 4) = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-739266-4-1', '739266', 10, '4', 'b) Given Q : $$\begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix} = [1 \quad 2]$$,

Write: (i) the order of the matrix Q (ii) the matrix Q [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-739266-4-2', '739266', 11, '4', 'c) Sum of two natural numbers is 8 and the difference of their reciprocal is $\frac{2}{15}$.

Find the number. $\frac{1+y \approx 8}{\frac{1}{x}+\frac{1}{y} \approx \frac{2}{15}}$ [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-739266-5-0', '739266', 12, '5', 'a) The sum of first 15 terms of an AP is 105. The sum of next 15 terms is 780.

Find the AP. $s_{n_1} = 105$ $s_{n_2} = 780$ [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-739266-5-1', '739266', 13, '5', 'b) Find the values of $x$, which satisfy the inequation

$-2\frac{5}{6} < \frac{1}{2} - \frac{2x}{3} \le 2, x \in W$.

Also, graph the solution set on the real number line. [3]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-739266-5-2', '739266', 14, '5', 'c) A manufacturer sells binoculars for ₹ 3750/- to a wholesaler, who sells it to a retailer at a profit of 12%. The retailer sells it to the customer at a profit of ₹ 630. If the rate of GST is 18%, find the

(i) GST paid by the wholesaler to the Government.
(ii) price paid by the retailer inclusive of tax.
(iii) total GST received by the Government.
(iv) price paid by the customer. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-25e6f1-2-0', '25e6f1', 0, '2', '(c) Mr. Anil Buys 500, ` 20 shares at a discount of 20% and receives a return of [4]

10% on his money. Calculate :

(i) the amount invested by him.
(ii) the rate of dividend paid by the company.
(iii) the annual dividend.', 4, 'Shares and Dividends', 'long', 2, NULL, NULL),
  ('MQ-25e6f1-3-0', '25e6f1', 1, '3', '(a) O is the centre of the circle. AB || DC , ∠ ABD = 26°.

Find ∠ DAB and ∠ DEC.

[3]', 3, 'Circles', 'short', 2, '25e6f1__Children_S_p2_img_0_jpeg.webp', NULL),
  ('MQ-25e6f1-3-1', '25e6f1', 2, '3', '(b) Prove that (x-2) is a factor of x³ - 7x + 6 . Hence, find all the possible factors [3] of the given polynomial.', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-25e6f1-3-2', '25e6f1', 3, '3', '(c) Find mean, median and mode of following frequency distribution : [4]

| x | 8 | 12 | 4 | 6 | 10 |
| --- | --- | --- | --- | --- | --- |
| f | 10 | 3 | 3 | 5 | 4 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-25e6f1-4-0', '25e6f1', 4, '4', '(a) Prove that : [3]

(cosec A - sin A) ( sec A - cos A) = 1 / tan A + cot A', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-25e6f1-4-1', '25e6f1', 5, '4', '(b) An inverted cone is filled with water. When a cube is dropped into it, 1/11 of water from the cone over flows. Find the length of the cube if radius of the cone is 18cm and height is 7cm. [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-25e6f1-4-2', '25e6f1', 6, '4', '(c) A dealer in Kanpur (U.P) supplies goods worth ` 5000 to a dealer in Meerut (U.P.). The dealer in Meerut supplies the same goods / services to a dealer in Delhi at a profit of ` 2500. Find the net GST payable by dealer in Meerut. Also find the cost of goods / services in Delhi as per GST System. The rate of GST is 18%. [4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-25e6f1-5-0', '25e6f1', 7, '5', '(a) It the 3rd term of a G.P is 5/2 and the 7th term is 8/125 , find the GP. [3]', 3, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-25e6f1-5-1', '25e6f1', 8, '5', '(b) Two villages are 3 km apart. A map on which they are shown is drawn to a scale of 1: 5000. [3]

(i) Calculate, in cm, the distance between them on the map.

Mathematics/Grade X/ICSE/ Preliminary Examination /Page 2 of 5

CAA/SN/2019-20
(ii) On the map, a rectangular playground has an area of 24 cm². Calculate the actual area of the playground, in sq.m.', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-25e6f1-5-2', '25e6f1', 9, '5', '(c) Some identical cards are numbered from 46 to 57 and well shuffled. When [4] a card is drawn randomly, what is the probability that the card has

- (i) a multiple of 2 and 3.
- (ii) not a multiple of 7.
- (iii) a prime number.
- (iv) a perfect cube number.', 4, 'Probability', 'long', 3, NULL, NULL),
  ('MQ-25e6f1-6-0', '25e6f1', 10, '6', '(a) The daily pocket money of some student in a school are given below. [3] Using graph paper, draw a histogram and estimate mode.

| Pocket Money ('') | 20 - 40 | 40 - 60 | 60 - 80 | 80 - 100 | 100 -120 |
| --- | --- | --- | --- | --- | --- |
| No. of Student | 12 | 28 | 42 | 36 | 14 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-6-1', '25e6f1', 11, '6', '(b) A (2, 4), B (3, 3) and C (7, 5) are the vertices of a Δ ABC. Find the [3] equation of a line passing through centroid of a Δ ABC and parallel to AB.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-6-2', '25e6f1', 12, '6', '(c) Solve the quadratic equation $$2x - \frac{2}{x} = 7$$ correct to two decimal places. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-25e6f1-7-0', '25e6f1', 13, '7', '(a) Using properties of proportion. Solve for x : [3]

$$\frac{\sqrt{3x+1} - \sqrt{x+1}}{\sqrt{3x+1} + \sqrt{x+1}} = \frac{1}{4}$$', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-7-1', '25e6f1', 14, '7', '(b) Give $$A = \begin{bmatrix} 0 & 2 \\ -2 & 3 \end{bmatrix}$$, $$B = \begin{bmatrix} 1 & 4 \\ -3 & 3 \end{bmatrix}$$, $$C = \begin{bmatrix} 3 & 4 \\ 4 & -1 \end{bmatrix}$$ [3] find (A - B) C.', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-7-2', '25e6f1', 15, '7', '(c) Plot points P (2, 4), Q (-2, 1) and R (5, 0). Reflect point P and Q in [4] X- axis to get P'' and Q''.

- (i) write the co-ordinates of P'' and Q''.
- (ii) give a geometrical name to the P Q Q'' P'' R.
- (iii) find the perimeter of the figure P R P''.
- (iv) name two points from the figure which are invariant on reflection in X-axis.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-25e6f1-8-0', '25e6f1', 16, '8', '(a) Find the value of m, if $$5x^3 + mx^2 - x - 3$$ and $$3x^3 - 4x^2 - 3x + m$$ have [3] same remainder when divided by x - 2.', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-8-1', '25e6f1', 17, '8', '(b) Draw AB of length 7cm, take a point C on AB at a distance of 3cm from A. [3] Draw a circle with AC as diameter and draw tangents BQ and BR to the circle. State any 2 points which are equidistant from BQ and BR of angle QBR.', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-25e6f1-8-2', '25e6f1', 18, '8', '(c) Sum of two natural numbers is 8 and the difference of their reciprocals is $$\frac{2}{15}$$. [4]

Mathematics/Grade X/ICSE/ Preliminary Examination /Page 3 of 5

CAA/SN/2019-20
Find the numbers.', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-25e6f1-9-0', '25e6f1', 19, '9', '(a) The angle of elevation of top of tower from a point A on the ground is $\theta$. On walking 85m towards the tower, the angle of elevation is found to be $2\theta$. If $\tan 2\theta = \frac{8}{15}$, calculate the height of the tower and distance of tower from A.', 4, 'Trigonometry', 'long', 4, '25e6f1__Children_S_p4_img_0_jpeg.webp', NULL),
  ('MQ-25e6f1-9-1', '25e6f1', 20, '9', '(b) The following table shows a record from a hospital:

[6]

| Age in (yrs) | 5 - 15 | 15 - 25 | 25 - 35 | 35 - 45 | 45 - 55 | 55 - 65 | 65 - 75 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of causalities | 6 | 10 | 15 | 13 | 25 | 8 | 7 |

Taking a scale of 2 cm = 10 years on X-axis and 2 cm = 10 causalities on Y-axis. Use graph paper to draw an Ogive and estimate the following:

- (i) the median.
- (ii) the upper quartile.
- (iii) the number of causalities between the age group 21 years to 63 years.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-25e6f1-10-0', '25e6f1', 21, '10', '(a) Prove that: $\frac{\cos^2 A}{\cot^2 A - \cos^2 A} = \tan^2 A$ [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-25e6f1-10-1', '25e6f1', 22, '10', '(b) Solve the following inequation, represent the solution set on the number line: [3]

$$-2 \leq \frac{2}{3} - \frac{x}{2} \leq 1 \frac{1}{6}, x \in R$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-25e6f1-10-2', '25e6f1', 23, '10', '(c) A circular tank of diameter 2m is dug out and the earth removed is spread out evenly all around the tank to form an embankment 1.5 m wide and 2 m in height. Find the depth of the tank correct to two significant figures.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-25e6f1-11-0', '25e6f1', 24, '11', '(a) In $\Delta$ PQR, $\angle Q = 90^{\circ}$ and MN $\perp$ PR PM = 5 cm, MQ = 4 cm and QR = 12 cm

Find : (i) length of MN

(ii) $A (\Delta PMN): A (\square MNRQ)$', NULL, 'Similarity', 'short', 4, '25e6f1__Children_S_p4_img_1_jpeg.webp', NULL),
  ('MQ-25e6f1-11-1', '25e6f1', 25, '11', '(b) Ravina deposits ` 600 per month in a cumulative deposit account for 2 years. [3]

If she receives ` 15,450 at the time of maturity, calculate the rate of interest

per annum.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-25e6f1-11-2', '25e6f1', 26, '11', '(c) TBQ and TCP are tangents to the circle from T. $\angle ABQ = 65^{\circ}$ and $\angle ACP = 40^{\circ}$ Find $\angle BAC$ and $\angle BTC$?', NULL, 'Circles', 'short', 4, '25e6f1__Children_S_p4_img_2_jpeg.webp', NULL),
  ('MQ-b09a8a-1-0', 'b09a8a', 0, '1', '(i) If the first term of an AP is 2 and the common difference is 8, then 20th term is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['162', '154', '160', '158']::text[]),
  ('MQ-b09a8a-1-1', 'b09a8a', 1, '1', '(ii) If A and I are 2 X 2 matrices and I is a unit matrix then which of the following statements is not true?', 1, 'Matrices', 'MCQ', 1, NULL, array['A X I = A', 'I X A = A X I', 'I X A = A', 'I X A = I']::text[]),
  ('MQ-b09a8a-1-2', 'b09a8a', 2, '1', '(iii) In the given diagram, O is the centre of the circle,
∠BAC = 55⁰; find ∠ABC.', 1, 'Circles', 'MCQ', 1, 'b09a8a__Childrens__p1_img_0_jpeg.webp', array['35⁰', '90⁰', '55⁰', '45⁰']::text[]),
  ('MQ-b09a8a-1-3', 'b09a8a', 3, '1', '(iv) The co-ordinates of the centroid of triangle XYZ with vertices X (-1, 0), Y (5, -2) and Z (8, 2) is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(12, 0)', '(6, 0)', '(0, 6)', '(4, 0)']::text[]),
  ('MQ-b09a8a-1-4', 'b09a8a', 4, '1', '(v) The median class for the given distribution is
| Class | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 10 | 17 | 26 | 30 |', 1, 'Statistics', 'MCQ', 2, NULL, array['20 – 30', '40 – 50', '30 – 40', '10 – 20']::text[]),
  ('MQ-b09a8a-1-5', 'b09a8a', 5, '1', '(vi) If P (A) and P (B) are complementary events and P(A) = 0.15, then P(B) is', 1, 'Probability', 'MCQ', 2, NULL, array['0.35', '0.85', '0.3', '0.15']::text[]),
  ('MQ-b09a8a-1-6', 'b09a8a', 6, '1', '(vii) If 9 – 2x > 1 , x ∈ W, then the solution for the inequation is :', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{1, 2, 3}', '{0, 1, 2, 3}', '{0, 1, 2, 3, 4}', '{1, 2, 3, 4}']::text[]),
  ('MQ-b09a8a-1-7', 'b09a8a', 7, '1', '(viii) In ΔABC, PQ ∥ BC; AP = 5, PB = 15, QC = 18 , find AQ', 1, 'Similarity', 'MCQ', 2, 'b09a8a__Childrens__p2_img_0_jpeg.webp', array['3', '6', '9', '4']::text[]),
  ('MQ-b09a8a-1-8', 'b09a8a', 8, '1', '(ix) If the radius of a cone is `r` and its slant height (l) is halved, then curved surface area of the cone is', 1, 'Mensuration', 'MCQ', 2, NULL, array['½ πrl', '2πrl', 'πrl', 'π(r + l)r']::text[]),
  ('MQ-b09a8a-1-9', 'b09a8a', 9, '1', '(x) If the point (5, 6) on reflection in a line is mapped to (-5, 6), then the equation of the mirror line is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['y = 0', 'x = 5', 'y = 5', 'x = 0']::text[]),
  ('MQ-b09a8a-1-10', 'b09a8a', 10, '1', '(xi) If (x - 3) is a factor of f(x) then what is the value of f (3)?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['1', '0', '3', '-3']::text[]),
  ('MQ-b09a8a-1-11', 'b09a8a', 11, '1', '(xii) The roots of the equation x² + kx + 9 = 0 are equal. The value of k is', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['6', '±4', '3', '±6']::text[]),
  ('MQ-b09a8a-1-12', 'b09a8a', 12, '1', '(xiii) The price of an article including 5% GST is ☐714. What is the marked price of the article?', 1, 'GST and Banking', 'MCQ', 3, NULL, array['☐ 672', '☐ 678', '☐ 680', '☐ 750']::text[]),
  ('MQ-b09a8a-1-13', 'b09a8a', 13, '1', '(xiv) If matrix A is of order 3 × 2 and matrix AB is of order 3 × 2, then order of matrix B is', 1, 'Matrices', 'MCQ', 3, NULL, array['3 × 2', '2 × 2', '2 × 3', '1 × 3']::text[]),
  ('MQ-b09a8a-1-14', 'b09a8a', 14, '1', '(xv) If the common difference of an AP is -6, then what is t₁₆ - t₁₂?', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['26', '-24', '-25', '-6']::text[]),
  ('MQ-b09a8a-2-0', 'b09a8a', 15, '2', '(i) A toy is a combination of a cylinder, hemisphere and a cone, each with radius 10 cm as shown in the figure. Height of the conical part is 10 cm and total height of the toy is 60 cm. Find the total surface area of the toy.

$$(\pi=3.14, \sqrt{2}=1.41)$$

[4]', 4, 'Mensuration', 'long', 4, 'b09a8a__Childrens__p4_img_0_jpeg.webp', NULL),
  ('MQ-b09a8a-2-1', 'b09a8a', 16, '2', '(ii) A line AB meets X- axis at A and Y- axis at B. P (4,-1) divides AB in the [4] ratio 1:2. Find the

- (a) co-ordinates of A and B
- (b) equation of the line passing through P and perpendicular to AB.', 4, 'Coordinate Geometry', 'long', 4, 'b09a8a__Childrens__p4_img_1_jpeg.webp', NULL),
  ('MQ-b09a8a-2-2', 'b09a8a', 17, '2', '(iii) Solve for x, using properties of proportion : [4]

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-b09a8a-3-0', 'b09a8a', 18, '3', '- (i) If $$\sec\theta + \tan\theta = m$$; prove that $$\operatorname{cosec}\theta = \frac{m^2 + 1}{m^2 - 1}$$ [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-b09a8a-3-1', 'b09a8a', 19, '3', '- (ii) Zaheeda deposits a certain sum of money, every month in a cumulative deposit account for 2 years. If she receives ☐37,875 at the time of maturity and the rate of interest is 5 %, find the monthly deposit. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-b09a8a-3-2', 'b09a8a', 20, '3', '- (iii) Plot P (2, 4), Q (-2, 1) and R (5, 0). Reflect points P and Q in line y = 0 to get P'' and Q''. [5]
- (a) Write the co-ordinates of P'' and Q''.
- (b) Write the geometrical name of the figure PQQ`P`R.
- (c) Find its area.
- (d) Name one invariant point from the figure which is invariant on reflection in the X – axis.', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-b09a8a-4-0', 'b09a8a', 21, '4', '(i) A retailer buys a TV set for ₹ 20,000. He marks it 25% above his cost [3] price and gives a discount of 10% to a consumer on the MP. The rate of GST is 18%. Calculate:

(a) the marked price of the TV set.

(b) the GST paid by the retailer to the government.

(c) the price paid by the consumer inclusive of GST.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-b09a8a-4-1', 'b09a8a', 22, '4', '(ii) If \( A=\begin{bmatrix}4 & 4 \\ -2 & 6\end{bmatrix} \) , \( B=\begin{bmatrix}2 & 1 \\ 3 & -3\end{bmatrix} \) , \( P=\begin{bmatrix}16 & x \\ 9 & -16\end{bmatrix} \) and \( Q=\begin{bmatrix}4 & -6 \\ 5 & y\end{bmatrix} \) . [3]

Find the values of x and y if AB = P + Q.', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-b09a8a-4-2', 'b09a8a', 23, '4', '(iii) Find the value of `a`, if (x + 2) is a factor of ax\( ^{3} \) - x\( ^{2} \) - 20x -12. [4]

Hence, factorise the polynomial completely.', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-b09a8a-5-0', 'b09a8a', 24, '5', '(i) Solve the given quadratic equation: \(4\mathrm{x}^2 - 7\mathrm{x} + 2 = 0\) [3]

Give your answer correct to two significant figure.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-b09a8a-5-1', 'b09a8a', 25, '5', '(ii) AB is the diameter of the circle with [3]

centre O.

\[
\mathrm{AB} \parallel \mathrm{DC}, \angle \mathrm{ABD} = 2 6 ^ {\circ}.
\]

Find \( \angle DAB \) and \( \angle DEC \) .', 3, 'Circles', 'short', 5, 'b09a8a__Childrens__p5_img_0_jpeg.webp', NULL),
  ('MQ-b09a8a-5-2', 'b09a8a', 26, '5', '(iii) Using graph paper draw a histogram for the given distribution showing [4]

number of runs scored by 50 batsmen. Estimate the mode of the data.

| Runs scored | 3000-4000 | 4000-5000 | 5000-6000 | 6000-7000 | 7000-8000 | 8000-9000 | 9000-10000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of batsmen | 4 | 18 | 9 | 6 | 7 | 2 | 4 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-b09a8a-6-0', 'b09a8a', 27, '6', '(i) Cards numbered from 11 to 60 are kept in a box. If a card is drawn at [3]

random from the box, find the probability that the number on the drawn card is:

(a) a perfect square number.

(b) divisible by 5.

(c) a prime number less than 20.', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-b09a8a-6-1', 'b09a8a', 28, '6', '(ii) A conical vessel, with base radius \(10\mathrm{cm}\) and height \(24\mathrm{cm}\), is full of water. This water is emptied into a cylindrical vessel of base radius \(5\mathrm{cm}\). If \(10\%\) of water is wasted during this transfer, then find the height of the water level in cylindrical vessel.', NULL, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-b09a8a-6-2', 'b09a8a', 29, '6', '(iii) In the given triangle ABC, PQ || BC and PC and BQ intersect at O. [4]

AP = 6 cm, PB = 9 cm, PQ = 5 cm and

AQ = 8 cm. Find

(a) PQ:BC
(b) length of AC
(c) PO:OC', 4, 'Similarity', 'long', 6, 'b09a8a__Childrens__p6_img_0_jpeg.webp', NULL),
  ('MQ-b09a8a-7-0', 'b09a8a', 30, '7', '(i) ABCD is a parallelogram where B(5,8), C(4,7) and D(2,-4). [3] Find the equation of diagonal AC.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-b09a8a-7-1', 'b09a8a', 31, '7', '(ii) Prove that: \(\cos A(1 + \cot A) + \sin A(1 + \tan A) = \sec A + \operatorname{cosec} A\) [3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-b09a8a-7-2', 'b09a8a', 32, '7', '(iii) The \(4^{\text{th}}\) term of an AP is 11 and \(8^{\text{th}}\) term exceeds twice the \(4^{\text{th}}\) term by 5. [4] Find the AP and the sum of the 50 terms of the AP.', 4, 'Arithmetic Progression', 'long', 6, NULL, NULL),
  ('MQ-b09a8a-8-0', 'b09a8a', 33, '8', '(i) Solve the following inequation : [3]

$$4x - 19 < \frac{3x}{5} - 2 \leq \frac{-2}{5} + x, \quad x \in I.$$

Represent the solution set on a real number line.', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-b09a8a-8-1', 'b09a8a', 34, '8', '(ii) If the mean of the following distribution is 24, find the value of `a`. [3]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 7 | a | 8 | 10 | 5 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-b09a8a-8-2', 'b09a8a', 35, '8', '(iii) An aeroplane when flying at a height of 4,000 m from the ground passes [4]

vertically above another areoplane at an instant when the angles of elevation of the two planes from the same point on the ground are 60⁰ and 45⁰ respectively. Find the vertical distance between the aeroplanes at that instant to the nearest metre.', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-b09a8a-9-0', 'b09a8a', 36, '9', '(i) The speed of a boat in still water is 9 km/hr. It can go 12 km upstream and return [4] downstream to the original point in 3 hours. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-b09a8a-9-1', 'b09a8a', 37, '9', '(ii) Use Graph paper for this question. [6]

A survey regarding height (in cm) of 60 boys belonging to Class 10 of a school was conducted. The following data was recorded :

| Height (cm) | 135-140 | 140-145 | 145 - 150 | 150 - 155 | 155 - 160 | 160 - 165 | 165 - 170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Taking 2 cm = height of 10 cm along one axis and 2 cm = 10 boys along the other axis draw ogive for the above distribution. Use the ogive to estimate the following:

(a) The median
(b) The lower quartile
(c) If above 158 cm is considered as the tall boys of the class, then find the number of tall boys in the class.', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-486d39-1-0', '486d39', 0, '1', 'The SGST paid by a customer to the shopkeeper for an article which is priced at Rs.500 is Rs. 15. The rate of GST charged is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1.5%', '3%', '5%', '6%']::text[]),
  ('MQ-486d39-1-1', '486d39', 1, '1', 'When the roots of a quadratic equation are real and equal, then the discriminant of the quadratic equation is:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['Infinite', 'Positive', 'Zero', 'Negative']::text[]),
  ('MQ-486d39-1-2', '486d39', 2, '1', 'If $(x-1)$ is a factor of $2x^2 - ax - 1$, then the value of ''a'' is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['-1', '1', '3', '-3']::text[]),
  ('MQ-486d39-1-3', '486d39', 3, '1', 'The coordinates of the image of the point $(3,-2)$, when reflected in the origin, are :', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$(3, 2)$', '$(3, -2)$', '$(-3, 2)$', '$(-3, -2)$']::text[]),
  ('MQ-486d39-1-4', '486d39', 4, '1', '57, 54, 51, 48,... are in arithmetic Progression. The value of the 8th term is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['36', '78', '-36', '-76']::text[]),
  ('MQ-486d39-1-5', '486d39', 5, '1', '✓i. If $A = \begin{bmatrix} 3 & -2 \\ 0 & 1 \end{bmatrix}$, $B = \begin{bmatrix} 1 & -2 \\ 3 & -1 \end{bmatrix}$ then AB is:
a. $\begin{bmatrix} -3 & -2 \\ 3 & 1 \end{bmatrix}$
c. $\begin{bmatrix} -3 & -2 \\ 3 & -1 \end{bmatrix}$
b. $\begin{bmatrix} -3 & -2 \\ -3 & 1 \end{bmatrix}$
d. $\begin{bmatrix} 3 & -2 \\ -3 & -1 \end{bmatrix}$', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-486d39-1-6', '486d39', 6, '1', '✓ii. If $x \in \{1, 2, 3, \dots, 10\}$, then the elements of the inequation $2(x - 3) < 1$, are:
a. $\{8, 9, 10\}$
c. $\{1, 2, 3\}$
b. $\{1, 2, 3, 4, 5\}$
d. $\{4, 5, 6, 7\}$', 1, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-486d39-1-7', '486d39', 7, '1', '✓iii. A bag contains 5 black, 7 red and 4 white balls. A ball is drawn from the bag at random. The probability that the ball, is:', 1, 'Probability', 'MCQ', 2, NULL, array['$\frac{5}{16}$', '$\frac{3}{16}$', '$\frac{7}{16}$', '$\frac{1}{16}$']::text[]),
  ('MQ-486d39-1-8', '486d39', 8, '1', '✓iv. A marble of radius 2.1cm is put into a cylindrical cup full of water of radius 5 cm and height 6 cm, then how much water flows out of the cylindrical cup?', 1, 'Mensuration', 'MCQ', 2, NULL, array['38.8 c cm³', '5.4 cm³', '19.4 cm³', '471.4 cm³']::text[]),
  ('MQ-486d39-1-9', '486d39', 9, '1', '✓v. The median of the data: 7, 12, 6, 15, 10, 8, 4 and 20, is:', 1, 'Statistics', 'MCQ', 2, NULL, array['8', '9', '10', '20']::text[]),
  ('MQ-486d39-1-10', '486d39', 10, '1', '✓vi. In the given figure, two tangents are drawn from an external point P to the circle, such that $\angle OAB = 10^\circ$. Then the value of $\angle BPA$, is:', 1, 'Circles', 'MCQ', 2, '486d39__City_Inter_p2_img_0_jpeg.webp', array['$40^\circ$', '$30^\circ$', '$20^\circ$', '$10^\circ$']::text[]),
  ('MQ-486d39-1-11', '486d39', 11, '1', '✓vii. The probability expressed as a percentage of a particular occurrence can never be:', 1, 'Probability', 'MCQ', 2, NULL, array['Less than 100', 'Less than 0', 'greater than 1', 'anything but a whole number']::text[]),
  ('MQ-486d39-1-12', '486d39', 12, '1', '✓viii. If the median of the observations 11, 12, 14, 18, p+2, p+4, 30, 32, 35 and 41 arranged in ascending order is 24, then the value of p, is:', 1, 'Statistics', 'MCQ', 2, NULL, array['19', '20', '21', '28']::text[]),
  ('MQ-486d39-1-13', '486d39', 13, '1', 'xiv. In the given figure, if the angle of elevation is 60° and the distance AB = 10 √3 m, then the height of the tower is', 1, 'Trigonometry', 'MCQ', 3, '486d39__City_Inter_p3_img_0_jpeg.webp', array['\(20\sqrt{3}\mathrm{cm}\)', '\(10\mathrm{m}\)', '\(30\mathrm{m}\)', '\(30\sqrt{3}\mathrm{m}\)']::text[]),
  ('MQ-486d39-1-14', '486d39', 14, '1', 'xv. A girl calculates that the probability of her winning the first prize in a lottery is 0.08. If 6000 tickets are sold, how many tickets she has bought?', 1, 'Probability', 'MCQ', 3, NULL, array['40', '240', '480', '750']::text[]),
  ('MQ-486d39-2-0', '486d39', 15, '2', 'i. Sabina has a cumulative time deposit account in Canara Bank. She deposits ₹ 500 per month for a period of 4 years. If at the time of maturity she gets ₹ 28410, find the rate of interest.

(4)', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-486d39-2-1', '486d39', 16, '2', 'ii. If a ≠ b and a : b is the duplicate rate ratio of (a + c) and (b + c), then prove that c is the mean proportional between a and b.

(4)', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-486d39-2-2', '486d39', 17, '2', 'iii. Prove that: $$\frac{1}{\sec\theta + \tan\theta} - \frac{1}{\cos\theta} = \frac{1}{\cos\theta} - \frac{1}{\sec\theta - \tan\theta}$$

(4)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-486d39-3-0', '486d39', 18, '3', 'i. A metal container in the form of a cylinder is surmounted by a hemisphere of the same radius. The internal height of the cylinder is 7m and the internal radius is 3.5m . Calculate :

a) total area of the internal surface, excluding the base;
b) the internal volume of the container in \(\mathfrak{m}^3\)

(4)', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-486d39-3-1', '486d39', 19, '3', 'ii. The vertices of Δ SKY are S(0, 5), K (-1,-2), and Y(11,7). Write down the equation of KY. Find:

(4)

a) the equation of the line through S and perpendicular to KY.
b) the coordinate of the foot of perpendicular SP, as obtained in part(a), meets KY.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-486d39-3-2', '486d39', 20, '3', 'iii.

Use a graph paper for this equation. (Take 10 small division = 1 unit on both axes). Plot the points P (3,2) and Q (-3,-2). From P and Q , draw perpendicular PM and QN on the X axis.

a) Name the image of P on reflection in the origin.

b) Assign the special name of the geometrical figure PMQN and its area.

c) Write the coordinates of the point to which M is mapped on reflection in:

i) X axis ,

ii) Y axis ,

iii) Origin.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-486d39-4-0', '486d39', 21, '4', 'i. A dealer in Shimla supplied goods to a shopkeeper in Mussoorie as per the following specification. Find the total amount of bill: (3)

| Cost in Shimla in ₹ | Rate of GST | Discount offered |
| --- | --- | --- |
| ₹ 5,000 | 18% | 20% |
| ₹ 2,000 | 12% | 10% |
| ₹ 8,000 | 28% | NIL |
| ₹ 4,000 | 12% | NIL |', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-486d39-4-1', '486d39', 22, '4', 'ii. Some school children went on an excursion by a bus to a picnic spot at a distance of 300km. While returning it was raining and the bus had to reduce its speed by 5 km/hr and it took two hour longer for returning. Find the time taken to return. (3)', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-486d39-4-2', '486d39', 23, '4', 'iii. Find the mode and the median of the following frequency distribution: (4)

| X | 10 | 11 | 12 | 13 | 14 | 15 |
| --- | --- | --- | --- | --- | --- | --- |
| Y | 1 | 4 | 7 | 5 | 9 | 3 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-486d39-5-0', '486d39', 24, '5', 'i. If $$A = \begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ $$B = \begin{bmatrix} 2 & 1 \\ 3 & 2 \end{bmatrix}$$ and $$C = \begin{bmatrix} 1 & 3 \\ 3 & 1 \end{bmatrix}$$ find the matrix C (B-A). (3)', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-486d39-5-1', '486d39', 25, '5', 'ii. In the given figure, AC is the diameter of circle with centre O. Chord BD is perpendicular to AC. Write down the angles p, q, r in terms of x. (3)', 3, 'Circles', 'short', 4, '486d39__City_Inter_p4_img_0_jpeg.webp', NULL),
  ('MQ-486d39-5-2', '486d39', 26, '5', 'iii. If $$x^3 + ax^2 + bx + 6$$ has x - 2 as a factor and leaves a reminder 3, when divided by x - 3. Find the value of a and b. (4)', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-486d39-6-0', '486d39', 27, '6', 'i. a) Write down the equation of the line AB, through (3,2) and perpendicular to the line 2y=3x+5.

b) AB meets the X axis at A and the Y axis at B. write down the co-ordinates of A and B. Calculate the area of ΔOAB, where O is origin. (3)', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-486d39-6-1', '486d39', 28, '6', 'If tan A = n tan B and sin A = m sin B, then prove that cos²A = (m²-1)/(n²-1). (3)', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-486d39-6-2', '486d39', 29, '6', 'iii. The sum of the 5th and 7th terms of an A.P. Is 52 and its 10th term is 46. Find the A.P. (4)', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-486d39-7-0', '486d39', 30, '7', 'The given figure shows the cross-section of a cone, a cylinder and a hemisphere all with the same diameter 10cm, and the other dimensions are as shown. (3)

Calculate:

- a) The total surface area,
- b) The total volume of the solid and
- c) The density of the material if its total weight is 1.7kg.

$$\rho = \frac{m}{V}$$', 3, 'Mensuration', 'short', 5, '486d39__City_Inter_p5_img_0_jpeg.webp', NULL),
  ('MQ-486d39-7-1', '486d39', 31, '7', 'ii. A bag contains 15 balls of which x are blue and the remaining are red. If the number of red balls are increased by 5, the probability of drawing the red ball doubles. Find:

- a) Probability that the ball drawn is red
- b) Probability of drawn ball is blue.
- c) Probability of drawing blue ball if 5 red balls are actually added.', NULL, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-486d39-7-2', '486d39', 32, '7', 'iii. In the figure, PQ=QR, angle RQP = 68°, PC and CQ are tangents to the circle with centre O. Calculate the values of (4)

- a) ∠QOP
- b) ∠QCP', 4, 'Circles', 'long', 5, '486d39__City_Inter_p5_img_1_jpeg.webp', NULL),
  ('MQ-486d39-8-0', '486d39', 33, '8', 'Find the values of x which satisfy the given inequation, -2 ≤ 1/2 - 2x/3 ≤ 15/6, x ∈ N. (3)', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-486d39-8-1', '486d39', 34, '8', 'If the mean the following distribution is 24, find the value of ''a''. (3)

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 7 | A | 8 | 10 | 5 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-486d39-8-2', '486d39', 35, '8', 'iii. The median AD of a triangle ABC is bisected at E and BE cuts AC in F. Prove that: F trisects AC.

(4)', 4, 'Similarity', 'long', 6, '486d39__City_Inter_p6_img_0_jpeg.webp', NULL),
  ('MQ-486d39-9-0', '486d39', 36, '9', 'i. A grocer bought a number of fruit baskets for rupees 800. 5 baskets were lost in transit. He sold the rest for rupee 8per basket more than what he paid for them and made a profit of rupee 180 on his outlay. Find the number of baskets bought by him. (4)', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-486d39-9-1', '486d39', 37, '9', 'ii. Draw the ogive for following frequency distribution. Use your ogive to estimate:

a) The median.
b) The number of students who obtained more than 75% marks.

(use squared paper to solve this question). (6)

| Marks | 0-9 | 10-19 | 20-29 | 30-39 | 40-49 | 50-59 | 60-69 | 70-79 | 80-89 | 90-99 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-486d39-10-0', '486d39', 38, '10', 'i. Using ruler and compasses, construct a $\Delta ABC$ with sides AB = 8 cm, BC = 6 cm and CA = 5 cm. Find its incentre and marks it as I. With I as centre, draw a circle which will cut off 2 cm chords from each side of this triangle. Measure and record the radius of this circle. (3)', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-486d39-10-1', '486d39', 39, '10', 'ii. Solve for x, using the properties of proportion: $\frac{\sqrt{x+5} + \sqrt{x-16}}{\sqrt{x-5} - \sqrt{x-16}} = \frac{7}{3}$ (3)', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-486d39-10-2', '486d39', 40, '10', 'iii.

iii. A man on a cliff observes a boat, at an angle of depression 30 degree, which is sailing towards the shore to the point immediately beneath him. Three minutes later, the angle of depression of the boat is found to be 60 degrees,

Assuming that the boat sails at a uniform speed, determine:

a) how much more time it will take to reach the shore.
b) the speed of the boat in metre per second, if the height of the cliff is \(500\mathrm{m}\). (4)', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-f1ee42-1-0', 'f1ee42', 0, '1', '(a) The tax invoice of a telecom service in Meerut shows cost of services provided by it as ₹750. If the GST rate is 18%, find the amount of the bill. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-f1ee42-1-1', 'f1ee42', 1, '1', '(b) In figure given below, quadrilateral ABCD is circumscribed, find x. [3]', 3, 'Circles', 'short', 1, 'f1ee42__Cnm_Icse10_p1_img_0_jpeg.webp', NULL),
  ('MQ-f1ee42-1-2', 'f1ee42', 2, '1', '(c) Find the 31st term of an A.P whose 10th term is 38 and 16th term is 74. [4]', 4, 'Arithmetic Progression', 'long', 1, NULL, NULL),
  ('MQ-f1ee42-2-0', 'f1ee42', 3, '2', '(a) Find the mean and mode of the following data: [3]
2, 2, 3, 5, 5, 5, 6, 8, 9, 10', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-f1ee42-2-1', 'f1ee42', 4, '2', '(b) A letter of English alphabet is chosen at random. Determine the probability that the letter is a consonant. [3]', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-f1ee42-2-2', 'f1ee42', 5, '2', '(c) ₹ 9000 were divided equally among a certain number of persons. Had there been 20 more persons, each would have got ₹160 less. Find the original number of persons. [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-f1ee42-3-0', 'f1ee42', 6, '3', '(a) Find the 100th term of the sequence [3]
$$\sqrt{3}, 2\sqrt{3}, 3\sqrt{3}, \dots \dots$$', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-f1ee42-3-1', 'f1ee42', 7, '3', '(b) It is given that $$\Delta ABC \sim \Delta DEF$$ such that AB = 4 cm, DE = 6 cm, EF = 9 cm and FD = 12 cm, then find the perimeter of $$\Delta ABC$$. [3]', 3, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-f1ee42-3-2', 'f1ee42', 8, '3', '(c) The mean of the following distribution is 54. Find the value of p [4]

| Class interval | 0 - 20 | 20- 40 | 40 - 60 | 60 -80 | 80 -100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | p | 10 | 9 | 13 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-f1ee42-4-0', 'f1ee42', 9, '4', '(a) In the figure given below, ABCD is a cyclic quadrilateral. The tangent to the circle at B meets DC produced at F. If $$\angle EAB = 85^{\circ}$$ and $$\angle BFC = 50^{\circ}$$, find $$\angle CAB$$. [4]', 4, 'Circles', 'long', 2, 'f1ee42__Cnm_Icse10_p2_img_0_jpeg.webp', NULL),
  ('MQ-f1ee42-4-1', 'f1ee42', 10, '4', '(b) Use graph paper

[6]

The following table shows the daily expenditure on food of 100 families in a colony.

Draw the ogive to estimate ( use a scale of 2cm = ₹ 50 on one axis and 2 cm =10 families on the other) :

| Monthly income ( in Rs) | No. of employees |
| --- | --- |
| 100-150 | 3 |
| 150-200 | 8 |
| 200-250 | 14 |
| 250-300 | 20 |
| 300-350 | 22 |
| 350-400 | 18 |
| 400-450 | 12 |
| 450-500 | 3 |

(i) The median
(ii) Upper quartile
(iii) The number of families who spend less than Rs 175.
(iv) The number of families who spend more than Rs 425.', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-f1ee42-5-0', 'f1ee42', 11, '5', '(a) The ages of 37 students in a class are given in the following table: Find the median. [3]

| Age (in years) | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 4 | 6 | 10 | 8 | 7 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-f1ee42-5-1', 'f1ee42', 12, '5', '(b) Solve the equation $$x^2 - 6x - 18 = 0$$ and give your answer correct to 3 significant figures: [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-f1ee42-5-2', 'f1ee42', 13, '5', '(c) A (0,3), B (3, -2) and O (0, 0) are the vertices of a triangle ABO. [4]

(i) Plot the triangle on a graph sheet taking 2cm = 1 unit on both the axes.
(ii) Plot D the reflection of B in the y axis, and write it coordinates.
(iii) Give the geometrical name of the figure ABOD.
(iv) Write the coordinates of an invariant point on triangle ABC on reflection in y axis.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-f1ee42-6-0', 'f1ee42', 14, '6', '(a) Find the least positive value of k for which the equation x² + kx + 4 = 0 has real roots. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-f1ee42-6-1', 'f1ee42', 15, '6', '(b) In a single throw of a die, find the probability of getting: [3]

(i) an odd number

(ii) a number less than 5', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-f1ee42-6-2', 'f1ee42', 16, '6', '(c) Use graph paper: Find the mode of the following frequency distribution by drawing a histogram. [4]

| Class interval | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 7 | 9 | 11 | 6 | 2 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-f1ee42-7-0', 'f1ee42', 17, '7', '(a) A triangle ABC where A is (2, 6), B is (-3, 5) and C is (4, 7), is reflected in the y axis to triangle A''B''C''. Triangle A''B''C'' is then reflected in the origin to triangle A''''B''''C''''. [3]

(i) Write the coordinates of A''''B''''C''''
(ii) Write down a single transformation that maps triangle ABC onto triangle A''''B''''C''''', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-f1ee42-7-1', 'f1ee42', 18, '7', '(b) A bag contains 6 red balls and some blue balls. If the probability of drawing a blue ball is twice that of a red ball, find the number of balls in the bag. [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-f1ee42-7-2', 'f1ee42', 19, '7', '(c) In the given figure ,ABC is a triangle . DE is parallel to BC and AD: DB = 3 : 2. [4]

(i) Determine the ratio DE : BC
(ii) Prove that Δ DEF is similar to Δ CBF. Hence find Area of Δ DEF / Area of Δ CBF', 4, 'Similarity', 'long', 5, 'f1ee42__Cnm_Icse10_p5_img_0_jpeg.webp', NULL),
  ('MQ-f1ee42-8-0', 'f1ee42', 20, '8', '(a) Find the sum of the first 22 terms of the A.P.: 8, 3, -2, ... [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-f1ee42-8-1', 'f1ee42', 21, '8', '(b) Suresh took Health Insurance Policy for his family and paid ₹7200 as SGST. Find the total annual premium paid by him for this policy, rate of GST being 18%. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-f1ee42-8-2', 'f1ee42', 22, '8', '(c) In the figure given below, O is the centre of a circle. Chord CD is parallel to the diameter AB. If ∠ABC = 25°, calculate ∠CED. [4]', 4, 'Circles', 'long', 5, 'f1ee42__Cnm_Icse10_p5_img_1_jpeg.webp', NULL),
  ('MQ-94a98d-1-0', '94a98d', 0, '1', '(a) Solve the following inequation, and represent the solution set on the number line: [3]

$$- 3 + x \leq \frac { 8 x } { 3 } + 2 \leq \frac { 1 4 } { 3 } + 2 x , x \in I$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-94a98d-1-1', '94a98d', 1, '1', '(b) The polynomials $$ax^3 - 7x^2 + 7x - 2$$ and $$x^3 - 2ax^2 + 8x - 8$$ when divided by $$(x - 2)$$ leave the same remainder.

Find the value of a. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-94a98d-1-2', '94a98d', 2, '1', '(c) Find the values of x and y if $$\begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix} \begin{bmatrix} 2x \\ 1 \end{bmatrix} + 2 \begin{bmatrix} -4 \\ 5 \end{bmatrix} = \begin{bmatrix} -10 \\ 7y \end{bmatrix}$$ [4]', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-94a98d-2-0', '94a98d', 3, '2', '(a) Richard has a recurring deposit account in a post office for 3 years at 8% p.a. simple interest.

If he gets ₹ 1,998 as interest at the time of maturity. Find: (i) the monthly instalment

(ii) the amount of maturity. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-94a98d-2-1', '94a98d', 4, '2', '(b) Find the roots of $$x^2 - 3x - 28 = 0$$ using the quadratic formula. [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-94a98d-2-2', '94a98d', 5, '2', '(c) Prove that: [4]

$$\frac { \cos A } { 1 - \tan A } + \frac { \sin A } { 1 - \cot A } = \sin A + \cos A$$', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-94a98d-3-0', '94a98d', 6, '3', '(a) Use a graph paper to answer the following questions: (Take 1 cm = 1 unit on both axes)

(i) Plot A(4, 4), B(4, -6) and C(8, 0), the vertices of a triangle ABC.
(ii) Reflect ABC on the y-axis and name it as A''B''C''. Write the coordinates of the images A'', B'' and C''.
(iii) Give a geometrical name for the figure AA''C''B''BC.', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-94a98d-3-1', '94a98d', 7, '3', '(b) A vessel in the form of a hemispherical bowl is full of water. The contents are emptied into a cylinder.

The internal radii of the bowl and cylinder are respectively 6 cm and 4 cm.

Find the height of water in the cylinder.', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-94a98d-3-2', '94a98d', 8, '3', '(c) Given $$x = \frac{\sqrt{a^2 + b^2} + \sqrt{a^2 - b^2}}{\sqrt{a^2 + b^2} - \sqrt{a^2 - b^2}}$$

Use componendo and dividend to prove that $$b^2 = \frac{2a^2x}{x^2 + 1}$$', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-94a98d-4-0', '94a98d', 9, '4', '(a) In the figure given below, chord AB and diameter PQ of a circle with centre O meet at X.

If BX = 5 cm, OX = 10 cm and the radius of the circle is 6 cm, compute the length of AB.', NULL, 'Circles', 'short', 2, '94a98d__Cnms_Maths_p2_img_0_jpeg.webp', NULL),
  ('MQ-94a98d-4-1', '94a98d', 10, '4', '(b) If 16 is the mean proportion between two numbers x and y and 128 is the third proportional to x and y, find the numbers.', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-94a98d-4-2', '94a98d', 11, '4', '(c) The daily profits (in ₹), of 100 shops in a market, are distributed as follows:

Draw a histogram for the data given below using a graph paper and locate the mode.

| Profit per shop in ₹ | 0 – 100 | 100 – 200 | 200 – 300 | 300 – 400 | 400 – 500 | 500 – 600 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of shops | 12 | 18 | 27 | 21 | 15 | 6 |', NULL, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-94a98d-5-0', '94a98d', 12, '5', '(a) In which ratio does the line $x - y - 2 = 0$ divide the line segment joining the points $(3, -1)$ and $(8, 9)$?

Also find the co-ordinates of the point of division. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-94a98d-5-1', '94a98d', 13, '5', '(b) Priyanka invested ₹ 8,000 in 7% ₹ 100 shares at ₹ 80. After a year she sold these shares at ₹ 75 each and invested the proceeds (including her dividend) in 18%, ₹ 25 shares at ₹ 41.

Find: (i) her dividend for the first year.

(ii) her annual income on shares in the second year.

(iii) the % return increase in her return on her original investment. [3]', 3, 'Shares and Dividends', 'short', 3, NULL, NULL),
  ('MQ-94a98d-5-2', '94a98d', 14, '5', '(c) In the given figure, DE // BC.

(i) Prove that $\Delta$ ADE and $\Delta$ ABC are similar.

(ii) Given that AD = ½ BD, calculate DE, if BC = 4.5 cm.

(iii) If area of $\Delta$ ABC = 18 cm², find area of trapezium DBCE. [4]', 4, 'Similarity', 'long', 3, '94a98d__Cnms_Maths_p3_img_0_jpeg.webp', NULL),
  ('MQ-94a98d-6-0', '94a98d', 15, '6', '(a) A train covers a distance of 600 km at $x$ kmhr⁻¹. Had the speed been $(x + 20)$ kmhr⁻¹, the time taken to cover the distance would have been reduced by 5 hours. Write down an equation in $x$ and solve it to evaluate $x$. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
