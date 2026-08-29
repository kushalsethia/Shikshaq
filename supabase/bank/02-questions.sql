set standard_conforming_strings = on;
begin;

-- questions 1-500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-ef2749-1-0', 'ef2749', 0, '1', '1. a) Solve the following Inequation and represent It on a number line.

$$4x - 19 < \frac{3x}{5} - 2 \leq \frac{2}{5} + x, \text{where } x \in R \tag{3}$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-ef2749-1-1', 'ef2749', 1, '1', 'b) If \(\begin{bmatrix} a & 1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 4 & 3 \\ -3 & 2 \end{bmatrix} = \begin{bmatrix} b & 11 \\ 4 & c \end{bmatrix}\), find \(a, b, c\) (3)', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-ef2749-1-2', 'ef2749', 2, '1', 'c) In the given figure, AOB is a diameter and DC is parallel to AB. If \(\angle CAB = x^{\circ}\), find (In terms of \(x\)) the values of (I) \(\angle COB\), (II) \(\angle DOC\), (III) \(\angle DAC\) and (IV) \(\angle ADC\). (Please state proper reasons to support your answers.) (4)', 4, 'Circles', 'long', 1, 'ef2749__Ais_Se_X_M_p1_img_0_jpeg.webp', NULL),
  ('MQ-ef2749-2-0', 'ef2749', 3, '2', '2. a) Cards marked with numbers 2 to 81 are placed in a box and mixed thoroughly. One card is drawn at random from the box. Find the probability that the number on the card drawn is

(1) A number which is a perfect square
(II) An even number
(iii) A prime number less than 50 (3)', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-ef2749-2-1', 'ef2749', 4, '2', 'b) If the \( n \) th terms of two A.P. 9,7,5,... and 24,21,18,... are same, find ''n''. Also find the term. (3)', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-ef2749-2-2', 'ef2749', 5, '2', 'c) The M.P. of an article is ₹7500. A shopkeeper buys the article from a wholesaler at some discount and sells it to a consumer at the marked price. The sales are Intra- state and rate of G.S.T. is 12%. If the shopkeeper pays ₹90 as tax to the State Government, find:

(i) the amount of discount
(ii) price inclusive of tax (under G.S.T.) of the article which the shopkeeper pays to the wholesaler. (4)', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-ef2749-3-0', 'ef2749', 6, '3', '3. a) Prove the following Identity:

$$(\sin A + \text{cosec } A)^2 + (\cos A + \text{sec } A)^2 = 5 + \text{sec}^2 A \text{ cosec}^2 A \tag{3}$$', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-ef2749-3-1', 'ef2749', 7, '3', 'b) If x, y, z are in continued proportion, prove that:

$$\frac{(x+y)^2}{(y+z)^2} = \frac{x}{z} \tag{3}$$', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-ef2749-3-2', 'ef2749', 8, '3', 'c) Use a graph paper to answer the following question.

(Take 2cm = 1 unit on both axes).

(i) Plot the points A(-4,2) and B (2,4).
(ii) A'' is the image of A when reflected in the Y axis. Plot it on the graph paper and write the coordinates of A''.
(iii) B'' is the image of B when reflected in the line AA''. Write the co-ordinates of B''.
(iv) Write the geometric name of the figure ABA''B''.
(v) Find the area of the figure ABA''B''. (4)', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-ef2749-4-0', 'ef2749', 9, '4', 'a) The height of a cone is 5cm. Find the height of another cone whose volume is 16 times its volume and whose radius is equal to its diameter. (3)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-ef2749-4-1', 'ef2749', 10, '4', 'b) A line passes through the point P (2,3) and meets the co-ordinate axes at points Q and R. If 2PQ=3PR, find : (i) co-ordinates of Q and R. (ii) equation of the line QR. (3)', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-ef2749-4-2', 'ef2749', 11, '4', 'c) Use graph paper to answer the following question.

Draw a histogram for the following data :

| Mid value | 5 | 15 | 25 | 35 | 45 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 12 | 16 | 6 | 7 | 9 |

Also find the mode. (4)', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-ef2749-5-0', 'ef2749', 12, '5', 'a) Rekha opened a Recurring deposit account for 20 months. The rate of interest is \(9 \%\)p.a. and Rekha receives \(\text{₹} 6041\) at the time of maturity. Find the amount Rekha deposited every month. (3)', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-ef2749-5-1', 'ef2749', 13, '5', 'b) Given \(\left[ \begin{array}{ll}4 & 2\\ -1 & 1 \end{array} \right]M = 6I\) , where M is a matrix and I is the Identity matrix of order \(2\times 2\)

(i) Find the order of matrix M
(ii) Find matrix M (3)', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-ef2749-5-2', 'ef2749', 14, '5', 'c) Find the equation of the line passing through the origin and the point of intersection of the lines

$$5x + 7y = 3 \text{ and } 2x - 3y = 7.$$ (4)', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-ef2749-6-0', 'ef2749', 15, '6', 'a) Using properties of proportion, solve for \( x: \frac{\sqrt{x + 5} + \sqrt{x - 16}}{\sqrt{x + 5} - \sqrt{x - 16}} = \frac{7}{3} \) (3)', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-ef2749-6-1', 'ef2749', 16, '6', 'b) A, B and C are three points on a circle with centre O. The tangent at C meets AB produced at T. Given that \(\angle ATC = 36^{\circ}\) and \(\angle BCT = 48^{\circ}\), calculate: (I) \(\angle BAC\), (II) the angle subtended by minor arc AB at the centre of the circle. (3)', 3, 'Circles', 'short', 2, 'ef2749__Ais_Se_X_M_p2_img_0_jpeg.webp', NULL),
  ('MQ-ef2749-6-2', 'ef2749', 17, '6', 'c) The mean of the following observations is 54.

| variates | 30 | 70 | 10 | 90 | 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 24 | 17 | 19 | p |

Find the value of p. Hence find the upper quartile for the given distribution. (4)', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-ef2749-7-0', 'ef2749', 18, '7', 'a) Find the values of k so that the following equation has real and equal roots.

$$(3k + 1)x^2 + 2(k + 1)x + k = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-ef2749-7-1', 'ef2749', 19, '7', 'b) The vertices of a triangle are A(-4, 6), B(-1, 6) and C(-1, 2). Find the equation of the median passing through A. (3)', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-ef2749-7-2', 'ef2749', 20, '7', 'c) Two solid cones A and B are placed in a cylindrical tube as shown in the figure. The ratio of their volumes is 2:1. Find the heights and volumes of the cones. Also find the volume of the remaining portion of the cylinder. (4)', 4, 'Mensuration', 'long', 3, 'ef2749__Ais_Se_X_M_p3_img_0_jpeg.webp', NULL),
  ('MQ-ef2749-8-0', 'ef2749', 21, '8', 'a) A box contains 27 balls of same shape and size, in three colours, red, blue and green. The probability of selecting a red ball is \(\frac{1}{3}\) and that of a blue ball is \(\frac{4}{9}\). How many green balls does the box contain? (3)', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-ef2749-8-1', 'ef2749', 22, '8', 'b) In the given figure, BC is parallel to DE. Area of triangle \( ABC = 25 \, \text{cm}^2 \), area of trapezium BCED = 24 \( \text{cm}^2 \) and BC = 10 cm. Calculate the length of DE. (3)', 3, 'Similarity', 'short', 3, 'ef2749__Ais_Se_X_M_p3_img_1_jpeg.webp', NULL),
  ('MQ-ef2749-8-2', 'ef2749', 23, '8', 'c) Find the sum of all odd integers between 10 and 110, which are divisible by 3. (4)', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-ef2749-9-0', 'ef2749', 24, '9', 'a) A man on the deck of a ship is \(12\mathrm{m}\) above water level. He observes that the angle of elevation of the top of a cliff is \(45^{\circ}\) and the angle of depression of the base is \(30^{\circ}\). Calculate the distance of the cliff from the ship and the height of the cliff. (4)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-ef2749-9-1', 'ef2749', 25, '9', 'b) Use graph paper to answer the following question.

Marks obtained by 150 boys in an examination are given below :

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 8 | 10 | 22 | 40 | 20 | 12 | 16 | 8 | 9 | 5 |

Draw an Ogive to represent the given data and use it to estimate :

(i) the median marks
(ii) the pass marks if \(84\%\) of the boys passed in the examination
(iii) the number of boys who scored \(75\%\) marks and above.

(6)', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-ef2749-10-0', 'ef2749', 26, '10', '10. a) A wholesaler sold an article to a dealer for ₹80,000. The dealer then sells the article to a shopkeeper at a profit of ₹15,000. If the rate of GST is 12% and all the sales are intra-state, find :

(i) the price inclusive of tax (under GST) at which the shopkeeper bought the article.
(ii) the tax (under GST) paid by the dealer to the State Government.
(iii) the tax (under GST) received by the Central Government. (3)', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-ef2749-10-1', 'ef2749', 27, '10', 'b) Find the value of ''k'' if 4x³ - 2x² + kx + 5 leaves remainder 10 when divided by (2x + 1). (3)', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-ef2749-10-2', 'ef2749', 28, '10', 'c) B takes 16 days more than A to complete a piece of work. If both working together can do it in 15 days, in how many days will B alone complete the work? (4)', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-ef2749-11-0', 'ef2749', 29, '11', 'a) Prove that : sec⁴A(1 - sin⁴A) - 2tan²A = 1 (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-ef2749-11-1', 'ef2749', 30, '11', 'b) In the figure given below, DE || BC. If AD = 4x - 3, AE = 8x - 7, BD = 3x - 1 and EC = 5x - 3, find the value of x. (3)', 3, 'Similarity', 'short', 4, 'ef2749__Ais_Se_X_M_p4_img_0_jpeg.webp', NULL),
  ('MQ-ef2749-11-2', 'ef2749', 31, '11', 'c) If 2x³ + ax² + bx - 6 has (x - 2) as a factor and leaves a remainder 36 when divided by (x - 3), find the values of a and b. With these values of a and b, factorise the given polynomial completely. (4)

4 | Page', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-e64369-1-0', 'e64369', 0, '1', 'a) If a, b, c are in continued proportion, prove that

$$\frac{a^2 + ab + b^2}{b^2 + bc + c^2} = \frac{a}{c} \tag{3}$$', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-e64369-1-1', 'e64369', 1, '1', 'b) Solve the following quadratic equation by using quadratic formula and give your

answer correct to one decimal place.

$$(x-1)^2 - 3x + 4 = 0. \tag{3}$$', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-e64369-1-2', 'e64369', 2, '1', 'c) In the given figure, $ABCD$ is a cyclic quadrilateral and $PQ$ is a tangent to the circle at

$C$. If $BD$ is the diameter, $\angle DCQ = 40^\circ$ and $\angle ABD = 60^\circ$, find the measure of:

i) \(\angle DBC\)
ii) \(\angle BCP\)
iii) \(\angle BDC\)
iv) \(\angle ADB\)

[4]', 4, 'Circles', 'long', 1, 'e64369__Anubhuti_X_p1_img_0_jpeg.webp', NULL),
  ('MQ-e64369-2-0', 'e64369', 3, '2', 'a) Prove: $$\frac{\cos\theta + \sin\theta}{\sin\theta - \cos\theta} + \frac{\sin\theta - \cos\theta}{\sin\theta + \cos\theta} = \frac{2\sec^2\theta}{\tan^2\theta - 1}$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-e64369-2-1', 'e64369', 4, '2', 'b) If $$X = \begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$$, show that $$6X - X^2 = 9I_2$$. [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-e64369-2-2', 'e64369', 5, '2', 'c) Mohan has a recurring deposit account in a bank for 2 years at 6% per annum simple interest. If he gets ₹ 1200 as interest at time of maturity, find:

(i) the monthly installment
(ii) the amount of maturity.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-e64369-3-0', 'e64369', 6, '3', 'a) Find the sum of all three digit natural numbers, which are divisible by 7. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-e64369-3-1', 'e64369', 7, '3', 'b) A(2, -4), B(3, 3) and C(-1, 5) are the vertices of \(\Delta\) ABC, find the equation of the altitude through B. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-e64369-3-2', 'e64369', 8, '3', 'c) If the mean of the following distribution is 7.5, find the missing frequency \( f \). [4]

| Variate: | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency: | 20 | 17 | f | 10 | 8 | 6 | 7 | 6 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-e64369-4-0', 'e64369', 9, '4', 'a) Given that $$x + 2$$ and $$x + 3$$ are factors of $$2x^3 + ax^2 + 7x - b$$. Determine the values of $$a$$ and $$b$$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-e64369-4-1', 'e64369', 10, '4', 'b) Solve the following equation and represent a solution set on the number line:

$$-\frac{17}{6} < \frac{1}{2} - \frac{2x}{3} \le 4, x \in W.$$ [3]', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-e64369-4-2', 'e64369', 11, '4', 'c) Rachel an engineering student was asked to make a model in her work, but, which he was shaped like a cylinder with cones attached to its end, using thin aluminum sheet. The diameter of the model is 3 cm and the length is 2 cm, if each con has a height of 2 cm, find the volume of air contained in the model that Rachel made. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-e64369-5-0', 'e64369', 12, '5', 'a) h (in Bihar) buys an article for 20000. He sells it to Sanjeev (in Bihar) at a pr fts of \(10\%\). Sanjeev sells the article to Rehman (in Odisha) at a profit of \(15\%\). If the rate of GST on the article is \(18\%\), find the tax (under GST) paid by Sanjeev to the go emment. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-e64369-5-1', 'e64369', 13, '5', 'b) Find the matrix \(M\), such that \((-A + 3B + M) = O\), where \(A = \begin{bmatrix} -2 & 6 \\ 5 & 8 \end{bmatrix}\) and

$$B = \begin{bmatrix} 1 & 2 \\ -2 & 3 \end{bmatrix} \tag{3}$$', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-e64369-5-2', 'e64369', 14, '5', 'c) A bag contains 12 balls out of which x are white.

(i) If one ball is drawn at random, what will be the probability that it is a white ball.
(ii) If 6 more white balls are put in the bag, the probability of drawing a white ball will be double than that in (i), find \( x \).', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-e64369-6-0', 'e64369', 15, '6', 'a) Determine the ratio in which the point \( P(-6, a) \) divides the join of \( A(-, 3) \) and \( B - 8, 9 \). Also find the value of \( a \).', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-e64369-6-1', 'e64369', 16, '6', 'b) 1. The following equation for x using properties of proportion:

$$\frac{\sqrt{5} + \sqrt{5 - x}}{\sqrt{5} - \sqrt{5 - x}} = 3$$

[3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-e64369-6-2', 'e64369', 17, '6', 'c) The areas of two similar triangles are 100 cm and 49 m, respectively. If the altitude of the bigger triangle is 5 cm, find the corresponding altitude of the other.', NULL, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-e64369-7-0', 'e64369', 18, '7', 'a) The following observations 29, 32, 48, 50, x, x +2, 72, 78, 84, 95 have been arranged in ascending order. If the median of the data is 63, find the value of x. [3]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-e64369-7-1', 'e64369', 19, '7', 'b) Bena has a cumulative deposit account of ₹ 400 per month at 10% per annum simple interest. If she gets ₹ 30100 at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-e64369-7-2', 'e64369', 20, '7', 'c) If (x - 2) is a factor of 2x³ - x² - px - 2

(i) find the value of p.

(ii) with the value of p factorize the above expression completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-e64369-8-0', 'e64369', 21, '8', 'a) Two pillars are of equal height and on either side of the road, which is 100 m wide. The angles of elevation of the top of the pillars are 60° and 30° at a point on the road between the pillars. Find the position of point between the pillars and height of each pillar. [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-e64369-8-1', 'e64369', 22, '8', 'b) The point A( 0, 8) is invariant point under reflection in the line L₁

(i) Name the line L₁.

(ii) Plot the points B (-4, 6), C (-2, 6), D (-4, 3), E (-2, 3), F (-4, 0), G (-1, 0), H (-1, -4)

(iii) Plot the images of the points B, C, D, E, F, G, H on reflection in L₁ Name the images as points O, N, M, L, K, J and I respectively.

(iv) Join the points in the order ABCDEFGHIJKLMNOA

(v) Find the area of the figure. [6]', 6, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-e64369-9-0', 'e64369', 23, '9', 'a) Two vertices of a triangle are (3, -5) and (-7, 4). If its centroid is (2, -1), find the third vertex. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-e64369-9-1', 'e64369', 24, '9', 'b) Determine k so that k² + 4k + 8, 2k² + 3k + 6, 3k² + 4k + 4 are three consecutive terms in A.P. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-e64369-9-2', 'e64369', 25, '9', 'c) The speed of a boat in still water is 8 Km/ hr. if can go 15 km upstream and 22 km downstream in 5 hours. Find the speed of the stream. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-e64369-10-0', 'e64369', 26, '10', 'a) Prove that $$\frac{\sin \theta - 2 \sin^3 \theta}{2 \cos^3 \theta - \cos \theta} = \tan \theta$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-e64369-10-1', 'e64369', 27, '10', 'b) A(-1, 3), B(4, 2) and C(3, -2) are the vertices of a triangle. [3]

(i) Find the coordinates of the centroid \( G \) of the triangle.
(ii) Find the equation of the line through \( G \) and parallel to \( AC \).', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-e64369-10-2', 'e64369', 28, '10', 'c) In the given figure, AB is a diameter and AC is a chord of the circle such that $$\angle BAC = 30^\circ$$. The tangent at C intersects AB produced at D. Prove that BC = BD. [4]', 4, 'Circles', 'long', 5, 'e64369__Anubhuti_X_p5_img_0_jpeg.webp', NULL),
  ('MQ-e64369-11-0', 'e64369', 29, '11', 'a) A shopkeeper buys an article whose list price is ₹4500 at some rate of discount form the wholesaler. He sells the article to the consumer at the list price and charges GST at the rate of 12%. If the sales are intra state and the shopkeeper has to pay tax (under GST) of ₹27, to the state government, find the rate of discount at which he bought the article from the wholesaler. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-e64369-11-1', 'e64369', 30, '11', 'b) The daily wages 160 workers in a building project are given below:

[3]

| Wages (in ₹) | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of shooters | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Using a graph paper draw an ogive for the above distribution. Use your ogive to estimate the:

- (i) median wage of the workers.
- (ii) upper quartile wage of the workers
- (iii) lower quartile wage of the workers
- (iv) percentage of workers who earn more than ₹45 a day.', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-8f2e73-1-0', '8f2e73', 0, '1', '(i) If the cost of an article is ₹ 25,000 and CGST paid by the owner is ₹ 2250, the rate of GST is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['9%', '10%', '15%', '18%']::text[]),
  ('MQ-8f2e73-1-1', '8f2e73', 1, '1', '(ii) If $$-\frac{2}{3}$$ is a root of the equation $$kx^2 - 13x - 10 = 0$$, the value of k is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['1', '2', '3', '4']::text[]),
  ('MQ-8f2e73-1-2', '8f2e73', 2, '1', '(iii) Factorization when $$6x^3 + 2x^2 - x + 2$$ is divided by $$(x + 2)$$, then remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['24', '-36', '36', '35']::text[]),
  ('MQ-8f2e73-1-3', '8f2e73', 3, '1', '(iv) If $$A = \begin{pmatrix} -4 & a + 5 \\ 3 & 2 \end{pmatrix} = \begin{pmatrix} b + 5 & 2 \\ 3 & 2 \end{pmatrix}$$, then find the values of a, b', 1, 'Matrices', 'MCQ', 1, NULL, array['3, 9', '-3, 9', '3, -9', '-3, -9']::text[]),
  ('MQ-8f2e73-1-4', '8f2e73', 4, '1', '(v) The $$n^{th}$$ term of an A.P. is given by $$T_n = (4n - 7)$$. Find its first term', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['2', '6', '-3', '3']::text[]),
  ('MQ-8f2e73-1-5', '8f2e73', 5, '1', '(vi) Which of the following point is invariant with respect to the line $$y = -2$$?', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$$(3, -2)$$', '$$(-3, 2)$$', '$$(2, -1)$$', '$$(2, 5)$$']::text[]),
  ('MQ-8f2e73-1-6', '8f2e73', 6, '1', '(vii) The diameter of a cylinder is 7cm and its height is 16cm. Then the curved surface area of cylinder is:', 1, 'Mensuration', 'MCQ', 1, NULL, array['$$132 \text{ cm}^2$$', '$$200 \text{ cm}^2$$', '$$352 \text{ cm}^2$$', '$$304 \text{ cm}^2$$']::text[]),
  ('MQ-8f2e73-1-7', '8f2e73', 7, '1', '(viii) In the adjoining figure, In the adjoining figure,
$$\angle ACB = \angle CDA$$. If AC = 8 cm and AD = 3 cm.
What is the value of BD ?', 1, 'Similarity', 'MCQ', 1, '8f2e73__Apex_X_Mat_p1_img_0_jpeg.webp', array['8 cm', '3 cm', '$$18\frac{1}{3} \text{ cm}$$', '$$\frac{64}{3} \text{ cm}$$']::text[]),
  ('MQ-8f2e73-1-8', '8f2e73', 8, '1', '(ix) The solution set for the following linear inequation is $$-2 \le 1 - 3x < 8$$, $$x \in I$$', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['$$\{-2, -1, 0, 1\}$$', '$$\{x : -2 < x < 1, x \in \mathbb{R}\}$$', '$$\{-1, 0, 1, 2\}$$', '$$\{-2, -1, 0, 1\}$$']::text[]),
  ('MQ-8f2e73-1-9', '8f2e73', 9, '1', '(x) If the probability of winning game is $$\frac{5}{11}$$. What is the probability of the losing it?', 1, 'Probability', 'MCQ', 1, NULL, array['$$\frac{3}{11}$$', '$$\frac{6}{11}$$', '$$\frac{7}{11}$$', '$$\frac{1}{11}$$']::text[]),
  ('MQ-8f2e73-1-10', '8f2e73', 10, '1', '(xi) If matrix A is of order \( 3 \times 2 \) and matrix B is of order \( 2 \times 2 \) then the matrix AB is of order', 1, 'Matrices', 'MCQ', 2, NULL, array['\( 3 \times 2 \)', '\( 3 \times 1 \)', '\( 2 \times 3 \)', '\( 1 \times 3 \)']::text[]),
  ('MQ-8f2e73-1-11', '8f2e73', 11, '1', '(xii) The y-axis divides the line-segment joining the points (-4, 5) and (3, -7) internally in the ratio', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['2:7', '3:7', '4:3', '3:4']::text[]),
  ('MQ-8f2e73-1-12', '8f2e73', 12, '1', '(xiii) In the given figure, if \(\angle DAB = 60^{\circ}\) and \(\angle ABD = 30^{\circ}\) then \(\angle ACB\) is equal to:', 1, 'Circles', 'MCQ', 2, '8f2e73__Apex_X_Mat_p2_img_0_jpeg.webp', array['\( 60^{\circ} \)', '\( 50^{\circ} \)', '\( 70^{\circ} \)', '\( 90^{\circ} \)']::text[]),
  ('MQ-8f2e73-1-13', '8f2e73', 13, '1', '(xiv) If \( p - l, 4p - 3, 3p - 1 \) are in AP, then \( p \) is equal to', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['2', '1', '4', '3']::text[]),
  ('MQ-8f2e73-1-14', '8f2e73', 14, '1', '(xv) Class-mark of a particular class is 9.5 and the class size is 6, then the class-interval', 1, 'Statistics', 'MCQ', 2, NULL, array['3.5 - 15.5', '6.5 - 12.5', '12.5 - 18.5', '15.5 - 27.5']::text[]),
  ('MQ-8f2e73-2-0', '8f2e73', 15, '2', '(i) Mr. Gupta opened a recurring deposit account in a bank. He deposited ₹ 2,500 per month for two years. At the time of maturity he got ₹ 67,500. Find :

(a) The total interest earned by Mr. Gupta
(b) The rate of interest per annum [4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-2-1', '8f2e73', 16, '2', '(ii) If q is the mean proportional between p and r show that: \( pqr(p + q + r)^{3} = (pq + qr + pr)^{3} \) [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-2-2', '8f2e73', 17, '2', '(iii) Prove that : \(\sec^2 A\). cosec\(^2\) \(A = \tan^2 A + \cot^2 A + 2\) [4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-3-0', '8f2e73', 18, '3', '(i) A right circular cone of radius 4 cm and height 5 cm contains some water up to a height of 2.5 cm. Find the radius of the surface of the water level. If some lead shots of radius 0.5 cm are dropped into the cone, the water rises to the top. Find the number of lead shots. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-3-1', '8f2e73', 19, '3', '(ii) If co-ordinates of two points A and B are \( (-3, 4) \) and \( (2, -1) \) , Find :

(a) The equation of AB;
(b) The co-ordinates of the point where the line AB intersects the y-axis. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-3-2', '8f2e73', 20, '3', '(iii) Use graph paper for this question. (Take 2 cm = 1 unit along both x-axis and y-axis.) Plot the points \( O(0,0) \) , \( A(-4,4) \) , \( B(-3,0) \) and \( C(0,-3) \)

(a) Reflect points A and B on the y-axis and name them A'' and B'' respectively. Write down their co-ordinates.
(b) Name the figure OABCB''A''. [5]', 5, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-4-0', '8f2e73', 21, '4', '(i) The printed price of an article is ₹ 60,000. A wholesaler allows a discount of 20% to a shopkeeper. The shopkeeper sells the article to a customer at the printed price. GST is charged at the rate of 5% at every stage. Find:

a) The cost to the shopkeeper inclusive of GST
b) GST paid by the shopkeeper to the government [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-8f2e73-4-1', '8f2e73', 22, '4', '(ii) Solve: \(4x^{2} - 7x + 2 = 0\). Find answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-8f2e73-4-2', '8f2e73', 23, '4', '(iii) Draw histogram to represent the following data: [4]

| Class mark | 16 | 24 | 32 | 40 | 48 | 56 | 64 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 12 | 15 | 18 | 25 | 19 | 10 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-8f2e73-5-0', '8f2e73', 24, '5', '(i) Matrix Find the value of x and y, if \( \begin{bmatrix}3 & -2 \\ -1 & 4\end{bmatrix} \times \begin{bmatrix}2x \\ 1\end{bmatrix} + 2\begin{bmatrix}-4 \\ 5\end{bmatrix} = 4\begin{bmatrix}2 \\ y\end{bmatrix} \) [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-5-1', '8f2e73', 25, '5', '(ii) In the given fig, AB = AC = CD and \( \angle ADC = 38^{\circ} \) Calculate,

(a) \(\angle ABC\)

(b) \(\angle BEC\).
[3]', 3, 'Circles', 'short', 3, '8f2e73__Apex_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-8f2e73-5-2', '8f2e73', 26, '5', '(iii) If \( x^3 + ax^2 + bx + 6 \) has \( x - 2 \) as

a factor and leaves a remainder 3

when divided by \( x - 3 \), find the value of a and b.
[4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-8f2e73-6-0', '8f2e73', 27, '6', '(i) Point A and B have co-ordinates (7, -3) and (1, 9) respectively, find :

(a) the slope of AB.

(b) the equation of perpendicular bisector of the line segment AB, [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-6-1', '8f2e73', 28, '6', '(ii) Prove that: \(\frac{1 + \sin\theta}{1 - \sin\theta} -\frac{1 - \sin\theta}{1 + \sin\theta} = 4\tan \theta \sec \theta\) [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-6-2', '8f2e73', 29, '6', '(iii) In an arithmetic progression ten times of its 10th term is equal to thirty times of its 30th term. Find its 40th term. [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-8f2e73-7-0', '8f2e73', 30, '7', '(i) A pair of die is rolled. Find the probability of getting a) doublets b)sum is 6 c)sum is at least 10 [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-7-1', '8f2e73', 31, '7', '(ii) The total area of a solid metallic sphere is \( 1256 \, cm^{2} \) . It is melted and recast into solid right circular cones of radius 2.5 cm and height 8 cm. Calculate :

(a) The radius of the solid sphere

(b) The number of cones recast. \((\pi = 3.14)\) [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-7-2', '8f2e73', 32, '7', '(iii) PT is a tangent to the circle at T. \(\angle ABC = 70^{\circ}\),

\[
\angle A C B = 5 0 ^ {\circ}
\]

Calculate :

(a) \(\angle\)CBT

(b) \(\angle\)BAT

(c) \(\angle\)APT [4]', 4, 'Circles', 'long', 3, '8f2e73__Apex_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-8f2e73-8-0', '8f2e73', 33, '8', '(i) Solve the inequation \( 4x - 19 < \frac{3x}{5} - 2 \leq -\frac{2}{5} + x \), \( x \in R \) also present the solution on the number line. [3]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-8-1', '8f2e73', 34, '8', '(ii) If the mean distribution is 25

| Class | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 18 | 15 | P | 6 |

Then find p.

[3]', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-8f2e73-8-2', '8f2e73', 35, '8', '(iii) ABC is a right angled triangle with \(\angle ABC = 90^{\circ}\). D is any point on AB and DE is perpendicular to AC. Prove that:

(a) AADE ~ ABCA.
(b) If AC = 13 cm, BC = 5 cm and AE = 4 cm. Find DE and AD.
(c) Find area of AADE : area of quadrilateral BCED.
[4]', 4, 'Similarity', 'long', 4, '8f2e73__Apex_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-8f2e73-9-0', '8f2e73', 36, '9', '(i) A plane left 30 minutes later than the schedule time and in order to reach its destination \(1500\mathrm{km}\) away in time, it has to increase its speed by \(250\mathrm{km / hr}\) from its usual speed. Find its usual speed. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-8f2e73-9-1', '8f2e73', 37, '9', '(ii) Use graph paper for this question. The table given below shows the monthly wages of some factory workers.

(i) Using the table, calculate the cumulative frequencies of workers
(ii) Draw a cumulative frequency curve.

Use 2 cm = ₹ 500, starting the origin at ₹ 6500 on x-axis, and 2 cm = 10 workers on the y-axis. [6]

| Wages (in ₹) | 6500-7000 | 7000-7500 | 7500-8000 | 8000-8500 | 8500-9000 | 9000-9500 | 9500-10000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 18 | 22 | 25 | 17 | 10 | 8 |', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-8f2e73-10-0', '8f2e73', 38, '10', '(i) If \((a^2 + b^2)(x^2 + y^2) = (ax + by)^2\); Prove that \(\frac{x}{y} = \frac{a}{b}\) [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-8f2e73-10-1', '8f2e73', 39, '10', '(ii) Construct a regular hexagon of side 4 cm. Construct a circle circumscribing the hexagon [3]', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-8f2e73-10-2', '8f2e73', 40, '10', '(iii) A man on a cliff observes a boat, at an angle of depression \( 30^{\circ} \) , which is sailing towards the shore to the point immediately beneath him. Three minutes later, the angle of depression of the boat is found to be \( 60^{\circ} \) . Assuming that the boat sails at a uniform speed, determine :

(a) how much more time it will take to reach the shore?
(b) the speed of the boat in metre per second, if the height of the cliff is 500 m [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-7986c3-1-0', '7986c3', 0, '1', '(i) The remainder when $$x^2 - 8x + 4$$ is divided by $$2x + 1$$ is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$$4\frac{1}{8}$$', '$$8\frac{1}{4}$$', '$$3\frac{1}{6}$$', '$$2\frac{1}{4}$$']::text[]),
  ('MQ-7986c3-1-1', '7986c3', 1, '1', '(ii) The roots of the equation $$2x^2 + 6x + 3 = 0$$ are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['imaginary and unequal', 'real and unequal', 'real and equal', 'imaginary and equal']::text[]),
  ('MQ-7986c3-1-2', '7986c3', 2, '1', '(iii) Which of the following is not a factor of $$x^3 - 4x^2 + x + 6$$ ?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$$(x - 2)$$', '$$(x + 1)$$', '$$(x - 1)$$', '$$(x - 3)$$']::text[]),
  ('MQ-7986c3-1-3', '7986c3', 3, '1', '(iv) $$\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}$$ is a type of ...', 1, 'Matrices', 'MCQ', 1, NULL, array['Zero matrix', 'Diagonal matrix', 'Row matrix', 'Rectangular matrix']::text[]),
  ('MQ-7986c3-1-4', '7986c3', 4, '1', '(v) The $$100^{\text{th}}$$ term of the sequence $$\sqrt{3}, 2\sqrt{3}, 3\sqrt{3},$$ ... is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['$$99\sqrt{3}$$', '$$100\sqrt{3}$$', '$$5050\sqrt{3}$$', '$$50\sqrt{3}$$']::text[]),
  ('MQ-7986c3-1-5', '7986c3', 5, '1', '(vi) Which of the following is a root of the equation $$x^2 - 11x + 10 = 0$$', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['$$x = - 1$$', '$$x = 10$$', '$$x = 11$$', '$$x = - 10$$']::text[]),
  ('MQ-7986c3-1-6', '7986c3', 6, '1', '(vii) The coordinates of the image of the point $$A(0, - b)$$ under reflection about the origin are ...', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$$A''(- b, 0)$$', '$$A''(0, b)$$', '$$A''(0, 0)$$', '$$A''(0, - b)$$']::text[]),
  ('MQ-7986c3-1-7', '7986c3', 7, '1', '(viii) The SGST paid by a customer to the shopkeeper for an article which is priced at Rs. 500 is Rs. 15. The rate of GST charged is', 1, 'GST and Banking', 'MCQ', 2, NULL, array['1.5%', '3%', '5%', '6%']::text[]),
  ('MQ-7986c3-1-8', '7986c3', 8, '1', '(ix) In the given diagram the triangle PMN is similar to triangle UVW by the axiom...', 1, 'Similarity', 'MCQ', 2, '7986c3__Ariv_X_Ics_p2_img_0_jpeg.webp', array['SSS', 'SAS', 'AAA', 'RHS']::text[]),
  ('MQ-7986c3-1-9', '7986c3', 9, '1', '(x) The volume of a right circular cone with height 15 m and base area 150 m² is..', 1, 'Mensuration', 'MCQ', 2, NULL, array['1125 m³', '2250 m³', '750 m³', '650 m³']::text[]),
  ('MQ-7986c3-1-10', '7986c3', 10, '1', '(xi) The coordinates of the midpoint M of A(0, 4) and B(0, -4) are', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['M(0, 0)', 'M(4, 0)', 'M(0, 8)', 'M(8, 0)']::text[]),
  ('MQ-7986c3-1-11', '7986c3', 11, '1', '(xii) The solution set for the given inequation is:
$$5x + 4 \leq 24, x \in W$$', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{1, 2, 3, 4}', '{0, 1, 2, 3, 4}', '{- 4, - 3, - 2, - 1}', '{- 4, - 3, - 2, - 1, 0, 1, 2, 3, 4}']::text[]),
  ('MQ-7986c3-1-12', '7986c3', 12, '1', '(xiii) In a badminton match between Rajesh and Joseph, the probability of winning of Rajesh is 0.58. Then the probability of Rajesh not winning is...', 1, 'Probability', 'MCQ', 2, NULL, array['0.42', '0.58', '0.84', '1.16']::text[]),
  ('MQ-7986c3-1-13', '7986c3', 13, '1', '(xiv) If $$A = \begin{bmatrix} 5 & 4 \\ 3 & -2 \end{bmatrix}$$ and $$B = \begin{bmatrix} -2 & -3 \\ 1 & 6 \end{bmatrix}$$ then $$A + B =$$', 1, 'Matrices', 'MCQ', 2, NULL, array['$$\begin{bmatrix} 2 & 6 \\ 4 & -1 \end{bmatrix}$$', '$$\begin{bmatrix} 2 & 4 \\ 4 & 2 \end{bmatrix}$$', '$$\begin{bmatrix} 2 & 4 \\ -2 & -1 \end{bmatrix}$$', '$$\begin{bmatrix} 3 & 1 \\ 4 & 4 \end{bmatrix}$$']::text[]),
  ('MQ-7986c3-1-14', '7986c3', 14, '1', '(xv) In the given figure, if ∠AOC = 160°, then value of y is...', 1, 'Circles', 'MCQ', 3, '7986c3__Ariv_X_Ics_p3_img_0_jpeg.webp', array['100°', '80°', '160°', '90°']::text[]),
  ('MQ-7986c3-2-0', '7986c3', 15, '2', '(i) Prove that $$(1 - \tan A)^2 + (1 + \tan A)^2 = 2\sec^2 A$$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-7986c3-2-1', '7986c3', 16, '2', '(ii) What least number must be added to each of the numbers 6, 15, 20 and 43 to make them proportional? [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-7986c3-2-2', '7986c3', 17, '2', '(iii) The inner and external diameters of a hollow hemispherical vessel are 21 cm and 25.2 cm respectively. Find the cost of painting it all over, at the rate of Rs. 1.50 per cm². [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-7986c3-3-0', '7986c3', 18, '3', '(i) Rajesh opens a Recurring Deposit account with the Bank of Rajasthan and deposits Rs. 600 per month for 20 months. Calculate the maturity value of this account, if the bank pays interest at the rate of 10% per annum. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-7986c3-3-1', '7986c3', 19, '3', '(ii) In triangle ABC, A = (3, 5), B = (7, 8), and C = (1, -10). Find the equation of the median through A. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-7986c3-3-2', '7986c3', 20, '3', '(iii) Use a graph sheet for this question. Take 2 cm = 1 unit along the axes. Plot the triangle OAB, where O (0, 0), A (3, -2), B (2, -3). [5]

(a) Reflect the triangle OAB through the origin and name it triangle OA''B''
(b) Reflect the triangle OA''B'' on the y-axis and name it triangle OA''''B''''
(c) Reflect the triangle OA''''B'''' on the -axis and name it triangle OA''''''B''''''
(d) Join the points AA''''B''''B''A''A''''''B''''''B and give the geometrical name of the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-7986c3-4-0', '7986c3', 21, '4', '(i) Using factor theorem show that \( (3x + 2) \) is a factor of \( 3x^{3} + 2x^{2} - 3x - 2 \) . Hence, factorise the expression \( 3x^{3} + 2x^{2} - 3x - 2 \) completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-7986c3-4-1', '7986c3', 22, '4', '(ii) Find the amount of bill for the following intrastate transaction of services provided by some consulting agency. [3]

| Cost of service (in ₹) | 2,400 | 1,820 | 3,900 | 3,900 |
| --- | --- | --- | --- | --- |
| GST% | 12 | 12 | 18 | 18 |', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-7986c3-4-2', '7986c3', 23, '4', '(iii) Using a graph sheet, draw a histogram for the following frequency distribution and find the mode. [4]

| Class interval | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 12 | 20 | 26 | 18 | 10 | 6 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-7986c3-5-0', '7986c3', 24, '5', '(i) Given \( A = \begin{bmatrix} 1 & 2 \\ -2 & 3 \end{bmatrix} \) , \( B = \begin{bmatrix} -2 & -1 \\ 1 & 2 \end{bmatrix} \) and \( C = \begin{bmatrix} 0 & 3 \\ 2 & -1 \end{bmatrix} \) find \( A + 2B - 3C \) [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-7986c3-5-1', '7986c3', 25, '5', '(ii) In cyclic quadrilateral ABCD, \( \angle DAC = 27^{\circ} \) , [3]

\[
\angle \mathrm{DBA} = 5 0 ^ {\circ} \text { and } \angle \mathrm{ADB} = 3 3 ^ {\circ}.
\]

Calculate :

(i) \( \angle \) DBC, \( \angle \) DCB, \( \angle \) CAB,', 3, 'Circles', 'short', 4, '7986c3__Ariv_X_Ics_p4_img_0_jpeg.webp', NULL),
  ('MQ-7986c3-5-2', '7986c3', 26, '5', '(iii) Factorise the polynomial completely using Remainder theorem [4]

\[
2 x ^ {3} - 7 x ^ {2} - 3 x + 1 8
\]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-7986c3-6-0', '7986c3', 27, '6', '(i) ABCD is a rhombus. The coordinates of A and C are (3, 6) and (-1, 2) respectively. [3] Find;

(a) coordinates of the point of intersection of the diagonals AC and BD
(b) equation of diagonal BD', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-7986c3-6-1', '7986c3', 28, '6', '(ii) Prove that $$\sqrt{sec^2\theta + cosec^2\theta} = sec\theta. \cosec\theta$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-7986c3-6-2', '7986c3', 29, '6', '(iii) The first and the last terms of an A.P. are 5 and 45, respectively. If the sum of its terms [4] is 1000, find;

(a) number of terms
(b) common difference of the A.P.', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-7986c3-7-0', '7986c3', 30, '7', '(i) A die is thrown once. Find the probability of getting: [3]

(a) an even number
(b) a number between 3 and 8
(c) an even number or a multiple of 3', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-7986c3-7-1', '7986c3', 31, '7', '(ii) A solid cone of radius 5 cm and height 8 cm is melted and made into small spheres of [3] radius 0.5 cm. Find the number of spheres formed.', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-7986c3-7-2', '7986c3', 32, '7', '(iii) ABCD is a cyclic quadrilateral in the circle with centre O. ST is a tangent. $$\angle OBD = 25^{\circ}$$ and $$\angle CBT = 30^{\circ}$$. Find $$\angle BOD$$, $$\angle BAD$$, $$\angle BCD$$, $$\angle BDC$$. [4]', 4, 'Circles', 'long', 5, '7986c3__Ariv_X_Ics_p5_img_0_jpeg.webp', NULL),
  ('MQ-7986c3-8-0', '7986c3', 33, '8', '(i) Given $$x \in R$$, solve the inequation and graph the solution on the number line. [3]

$$- 3 < - \frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6}$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-7986c3-8-1', '7986c3', 34, '8', '(ii) The weights of 50 apples were recorded as given below. Calculate the mean weight, to the nearest gram, by the Step Deviation Method. [3]

| Weight in grams | 80-85 | 85-90 | 90-95 | 95-100 | 100-105 | 105-110 | 110-115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of apples | 5 | 8 | 10 | 12 | 8 | 4 | 3 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-7986c3-8-2', '7986c3', 35, '8', '(iii) The expression $4x^3 - bx^2 + x - c$ leaves remainders 0 and 30 when divided by $x + 1$ and $2x - 3$ respectively. Calculate the values of $b$ and $c$. Hence factorise the expression completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-7986c3-9-0', '7986c3', 36, '9', '(i) $A$ can do a piece of work in $x$ days and $B$ can do the same work in $(x + 16)$ days. If both working together can do it in 15 days, calculate $x$. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-7986c3-9-1', '7986c3', 37, '9', '(ii) Use a graph sheet for this question. The daily wages of 120 workers at a site are given. [6]

| Wages (₹) | 250 – 300 | 300 – 350 | 350 – 400 | 400 - 450 | 450 – 500 | 500 – 550 | 550 - 600 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 8 | 15 | 20 | 30 | 25 | 15 | 7 |

Draw an ogive and hence estimate:

- (a) the median wages
- (b) the inter-quartile range of workers
- (c) the percentage of workers whole daily wages is above Rs. 475', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-7986c3-10-0', '7986c3', 38, '10', '(i) Solve the following using the properties of proportion [3]

$$\frac{\sqrt{x+1} + \sqrt{x-1}}{\sqrt{x+1} - \sqrt{x-1}} = \frac{4x-1}{2}$$', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-7986c3-10-1', '7986c3', 39, '10', '(ii) Using a ruler and compass only, construct a triangle ABC in which BC = 4 cm, $\angle ACB = 45^\circ$ and perpendicular from A on BC is 2.5 cm. Draw a circle circumscribing the triangle ABC. [3]', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-7986c3-10-2', '7986c3', 40, '10', '(ii) An aeroplane flying horizontally 1 km above the ground and going away from the observer is observed at an elevation of $60^\circ$. After 10 seconds, its elevation is observed to be $30^\circ$. Find the uniform speed of the aeroplane in km per hour. [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-ea62b6-1-0', 'ea62b6', 0, '1', 'i) The reflection of the point P (-1, 7 ) in the X-axis is

a) ( 1, 7 ) b) ( 1, - 7 ) c) ( -1, -7 ) d) ( -1, 7 )', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-1', 'ea62b6', 1, '1', 'ii) The reflection of the point A ( 4, -1 ) in the line x= 2 is :

a) ( 0, - 1 ) b) ( 8, -1 ) c) ( 0, 1 ) d) ( -1, 0 )', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-2', 'ea62b6', 2, '1', 'iii) Let the point P ( 1, 2 ) divides the join of A ( -2, 1 ) and B( 7, 4 ) in the ratio :

a) 1 : 2 b) 2 : 1 c) 3 : 2 d) 2 : 3', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-3', 'ea62b6', 3, '1', 'iv) If 0 ( a/3 , 4 ) is the mid-point of a line segment joining the points X ( -6, 5 ) and Y ( -2, 3 ) then the value of a is

a) - 4 b) - 6 c) 12 d) - 12', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-4', 'ea62b6', 4, '1', 'v) The angle of inclination of the line Y = 1/√3 x - 5 is

a) 0° b) 30° c) 45° d) 60°', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-5', 'ea62b6', 5, '1', 'vi)

In the figure 0 is the centre of the circle < AOB = 100°, then < ADB is equal to :

a) 100° b) 110° c) 120° d) 130°', 1, 'Circles', 'short', 1, 'ea62b6__Asc_X_Math_p1_img_0_jpeg.webp', NULL),
  ('MQ-ea62b6-1-6', 'ea62b6', 6, '1', 'vii) The third proportional to 6 1/4 and 5 is

a) 4 b) 7 1/2 c) 3 d) none of these', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-7', 'ea62b6', 7, '1', 'viii) The 15th term from the last of the A,P 7,10, 13...130 is

a) 49 b) 85 c) 88 d) 110', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-8', 'ea62b6', 8, '1', 'ix) If on dividing 4x² - 3 kx + 5 by x + 2 , the remainder is -3 then the value of k is

a) 4 b) - 4 c) 3 d) - 3', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-9', 'ea62b6', 9, '1', 'x) If x + 1 is a factor of 3x³ + Kx² + 7x + 4 then the value of k is

a) - 1 b) 0 c) 6 d) 10', 1, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-10', 'ea62b6', 10, '1', 'xi) In an A.P if a = 3.5 d = 0, n = 101, then a/n will be

a) 0 b) 3.5 c) 103.5 d) 104.5', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-ea62b6-1-11', 'ea62b6', 11, '1', 'xii) The probability of drawing a block face card from a deck of 52 playing card is

a) 1/12 b) 3/26 c) 1/2 d) 1/13', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-1-12', 'ea62b6', 12, '1', 'xiii) The class mark of a class is
 a) upper limit + Lower limit b) (upper limit + lower limit)/2 c) upper limit - lower limit

d) (upper limit - lower limit)/2', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-1-13', 'ea62b6', 13, '1', 'xiv) Select the correct option is each of the following questions:

$$\left( \frac{1 + \tan \theta}{1 + \cot \theta} \right)^2 = a) 1 \quad b) \tan^2 c) \tan \theta \quad d) 4$$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-1-14', 'ea62b6', 14, '1', 'xv) If $$\sin \theta + \cos \theta = a$$ and $$\sec \theta + \csc \theta = b$$, then the value of $$b(a^2 - 1)$$ is
a) 2a b) $$a + b$$ c) 2b d) $$a - b$$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-2-0', 'ea62b6', 15, '2', '(a) Find the value of ''x'' and ''y'' if : (3)

$$2 \begin{bmatrix} x & 7 \\ 9 & y - 5 \end{bmatrix} + \begin{bmatrix} 6 & -7 \\ 4 & 5 \end{bmatrix} = \begin{bmatrix} 10 & 7 \\ 22 & 15 \end{bmatrix}$$', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-2-1', 'ea62b6', 16, '2', '(b) Sonia had recurring deposit account in a bank and deposited Rs.600 per month for $$2\frac{1}{2}$$ year. If the rate of interest was 10% p.a. find the maturity value of this account. (3)', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-2-2', 'ea62b6', 17, '2', '(c) Cards bearing numbers 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20 are kept in a bag. A card is drawn at random from the bag. Find the probability of getting a card which is: (3)

- (i) a prime number.
- (ii) a number divisible by 4.
- (iii) a number that is a multiple of 6.', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-2-3', 'ea62b6', 18, '2', '(d) The circumference of the base of a cylindrical vessel is 132 cm and its height is 25cm. Find the (i) radius of the cylinder

(ii) volume of cylinder. (use $$\pi = \frac{22}{7}$$ ) (3)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-2-4', 'ea62b6', 19, '2', '(e) If $$(k - 3)$$, $$(2k + 1)$$ and $$(4k + 3)$$ are three consecutive terms of an A.P. Find the value of k. (3)', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-3-0', 'ea62b6', 20, '3', '(a) If $$(x + 2)$$ and $$(x + 3)$$ are factors of $$x^3 + ax + b$$, Find the values of ''a'' and ''b''. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-3-1', 'ea62b6', 21, '3', '(b) Prove that $$\sqrt{\sec^2 \theta + \csc^2 \theta} = \tan \theta + \cot \theta$$ (3)', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-ea62b6-3-2', 'ea62b6', 22, '3', '(c) Using a graph paper draw a histogram for the given distribution showing the number of runs scored by 50 batsmen. Estimate the mode of the data : (4)

| Runs scored | 3000 - 4000 | 4000 - 5000 | 5000 - 6000 | 6000 - 7000 | 7000 - 8000 | 8000 - 9000 | 9000 - 10000 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of batsmen | 4 | 18 | 9 | 6 | 7 | 2 | 4 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-ea62b6-4-0', 'ea62b6', 23, '4', '(a) Solve the following inequation. Write down the solution set and represent it on the real number
Line :
$$-2 + 10x \leq 13x + 10 < 24 + 10x, x \in Z$$ (3)', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-4-1', 'ea62b6', 24, '4', '(b) If the straight lines $3x - 5y = 7$ and $4x + ay + 9 = 0$ are perpendicular to one another, find the value of a. (3)', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-4-2', 'ea62b6', 25, '4', '(c) Solve $x^2 + 7x = 7$ and give your answer correct to two decimal places. (4)', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-ea62b6-5-0', 'ea62b6', 26, '5', '(a) Using properties of proportion, solve for x. Given that x is positive: (3)

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-5-1', 'ea62b6', 27, '5', '(b) If $A = \begin{bmatrix} 2 & 3 \\ 5 & 7 \end{bmatrix}$, $B = \begin{bmatrix} 0 & 4 \\ -1 & 7 \end{bmatrix}$ and $C = \begin{bmatrix} 1 & 0 \\ -1 & 4 \end{bmatrix}$, find $AC + B^2 - 10C$. (3)', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-5-2', 'ea62b6', 28, '5', '(c) Prove that $(1 + \cot \theta - \csc \theta)(1 + \tan \theta + \sec \theta) = 2$ (4)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-ea62b6-6-0', 'ea62b6', 29, '6', '(a) Find the value of K for which the following equation has equal roots : (3)
$x^2 + 4kx + (k^2 - k + 2) = 0$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-6-1', 'ea62b6', 30, '6', '(b) A (2, 5), B (-1, 2) and C (5, 8) are the vertices of triangle ABC, ''M'' is a point on AB such that AM : MB = 1 : 2. Find the coordinates of ''M''. Hence find the equation of the line passing through the points C and M. (4)', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-ea62b6-6-2', 'ea62b6', 31, '6', '(c)

In the figure, AB = AC, E is any point on BC produced. The segment AE intersects the circle at D. Prove that

(i) $< ADC = < ACE$ (ii) $< ACD = < AEC$ (3)', 3, 'Circles', 'short', 3, 'ea62b6__Asc_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-ea62b6-7-0', 'ea62b6', 32, '7', '(a) Rs.7500 were divided equally among a certain number of children. Had there been 20 less children each would have received Rs. 100 more. Find the original number of children. (4)', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-ea62b6-7-1', 'ea62b6', 33, '7', '(b) If the mean of the following distribution is 24. Find the value of ''a''. (3)

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| --- | --- | --- | --- | --- | --- |
| Number of students | 7 | a | 8 | 10 | 5 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-ea62b6-7-2', 'ea62b6', 34, '7', '(c)

In the figure, AB is diameter of a circle with centre O and QC is a tangent to the circle at C.
If < CAB = 30°, find (i) < CQA (ii) < CBA. (3)', 3, 'Circles', 'short', 4, 'ea62b6__Asc_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-ea62b6-8-0', 'ea62b6', 35, '8', '(a) Priyanka has a recurring deposit account of Rs.1000 per month at 10 % per annum. If she gets Rs.5550 as interest at the time of maturity. Find the total time for which the account was held. (3)', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-ea62b6-8-1', 'ea62b6', 36, '8', '(b)

In ΔPQR, MN is parallel to QR and $$\frac{PM}{MQ} = \frac{2}{3}$$ (3)

(1) Find \(\frac{MN}{QR}\)
(ii) Prove that \(\Delta\) OMN and \(\Delta\) ORQ are similar
(iii) Find, area of \(\Delta\) OMN: area of \(\Delta\) ORQ.', 3, 'Similarity', 'short', 4, 'ea62b6__Asc_X_Math_p4_img_1_jpeg.webp', NULL),
  ('MQ-ea62b6-8-2', 'ea62b6', 37, '8', '(c) The 4th term of an A, P series is 22, and 15th term is 66. Find the first term and common difference of the series. Hence find the sum of series to 8 terms. (4)', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-ea62b6-9-0', 'ea62b6', 38, '9', '(a) The poles of equal heights are standing opposite to each other on either side of the road, Which is \(80\mathrm{m}\) wide. From a point between them on the road, the angles of elevation of the top of poles are \(60^{\circ}\) and \(30^{\circ}\) respectively. Find the height of poles and the distance of the point from the poles.', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-ea62b6-9-1', 'ea62b6', 39, '9', '(b) Simplify: \(\frac{\tan A}{1 - \cot A} +\frac{\cot A}{1 - \tan A}\) (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-ea62b6-9-2', 'ea62b6', 40, '9', '(c) Prove that \(\frac{\operatorname{Sec} \theta + \tan \theta - 1}{\tan \theta - \sec \theta + 1} = \frac{\cos \theta}{1 - \sin \theta}\) (4),', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-8072a3-1-0', '8072a3', 0, '1', '(i) If the discriminant of quadratic equation ax² + bx + c = 0 is equal to zero, then two equal roots are:', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['\(\frac{-b}{2a}\)', '\(\frac{b}{2a}\)', '\(\frac{b}{a}\)', '\(\frac{-a}{2b}\)']::text[]),
  ('MQ-8072a3-1-1', '8072a3', 1, '1', '(ii)
A shopkeeper buys goods worth ₹1000 and sells at a profit of 10%. If rate of GST is 5%, then the bill amount is :', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['₹1050', '₹1155', '₹1080', '₹1000']::text[]),
  ('MQ-8072a3-1-2', '8072a3', 2, '1', '(iii)
The solution set representing the following number line, is:', NULL, 'Linear Inequations', 'MCQ', 2, '8072a3__Avm_6_X_Ma_p2_img_0_jpeg.webp', array['\(\{x: x \in R, -3 < x < 3\}\)', '\(\{x: x \in R, -3 < x \geq 3\}\)', '\(\{x: x \in Z, -3 < x < 3\}\)', '\(\{x: x \in Z, -3 \leq x < 3\}\)']::text[]),
  ('MQ-8072a3-1-3', '8072a3', 3, '1', '(iv)
Manisha opens a Recurring Deposit Account with the Bank of Assam and deposits ₹ 600 per month for 20 months. Calculate the interest accrued, if the bank pays interest at the rate of 10% per annum.', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['₹1050', '₹1000', '₹1200', '₹1500']::text[]),
  ('MQ-8072a3-1-4', '8072a3', 4, '1', '(v)
In the given figure, we have ∠ACB = 90°, CD ⊥ AB, then ΔACB∼ΔADC by:', NULL, 'Similarity', 'MCQ', 2, '8072a3__Avm_6_X_Ma_p2_img_1_jpeg.webp', array['SSS similarity rule', 'SAS similarity rule', 'AA similarity rule', 'None of these']::text[]),
  ('MQ-8072a3-1-5', '8072a3', 5, '1', '(vi) The curved surface area of a cylinder of height 14 cm is 88 sq. cm.
The diameter of the cylinder is:', NULL, 'Mensuration', 'MCQ', 3, NULL, array['0.5 cm', '1.0 cm', '1.5 cm', '2.0 cm']::text[]),
  ('MQ-8072a3-1-6', '8072a3', 6, '1', '(vii) If g(x) = x + 1 is a factor of h(x) = 5x³ + px² - 8x - 12, then the value of p is:', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-8', '5', '9', '12']::text[]),
  ('MQ-8072a3-1-7', '8072a3', 7, '1', '(viii) If the nth term of an A.P. is 7 - 4n, then find its 6th term is:', NULL, 'Arithmetic Progression', 'MCQ', 3, NULL, array['17', '- 17', '18', '- 18']::text[]),
  ('MQ-8072a3-1-8', '8072a3', 8, '1', '(ix) Drawing of an ogive table is useful in determining the:', NULL, 'Statistics', 'MCQ', 3, NULL, array['mode', 'mean', 'median', 'all the three above']::text[]),
  ('MQ-8072a3-1-9', '8072a3', 9, '1', '(x) In the given figure, P (2,4) is the mid point of the line segment AB.
The coordinates of A and B are :', NULL, 'Coordinate Geometry', 'MCQ', 3, '8072a3__Avm_6_X_Ma_p3_img_0_jpeg.webp', array['A (8, 0), B(0, 4)', 'A(0,4), B(8,0)', 'A(4, 0), B(0, 8)', 'A(0, 8), B(4, 0)']::text[]),
  ('MQ-8072a3-1-10', '8072a3', 10, '1', '(xi) Two matrices A and B are multiplied to get AB if:', NULL, 'Matrices', 'MCQ', 4, NULL, array['Both have same order', 'Both are rectangular', 'Number of columns in matrix A is equal to the number of rows in matrix B', 'Number of rows in matrix B is equal to the number of columns in matrix A']::text[]),
  ('MQ-8072a3-1-11', '8072a3', 11, '1', '(xii) The point (5, -6) on reflection in a line is mapped to (-5, -6). Name the mirror line and write its equation.', NULL, 'Coordinate Geometry', 'MCQ', 4, NULL, array['X-axis, y = 0', 'Y-axis, x = 0', 'X-axis, x = 0', 'Y-axis, y = 0']::text[]),
  ('MQ-8072a3-1-12', '8072a3', 12, '1', '(xiii) The probability of not winning a game is 0.35. What is the probability of winning?', NULL, 'Probability', 'MCQ', 4, NULL, array['0.15', '0.25', '0.65', '1.50']::text[]),
  ('MQ-8072a3-1-13', '8072a3', 13, '1', '(xiv) In the figure given, if AB is a chord of the circle and AC is its diameter such that ∠ACB = 50°. If AT is the tangent to the circle at the point A, then ∠CAB is equal to :', NULL, 'Circles', 'MCQ', 4, '8072a3__Avm_6_X_Ma_p4_img_0_jpeg.webp', array['65°', '50°', '40°', '60°']::text[]),
  ('MQ-8072a3-1-14', '8072a3', 14, '1', '(xv)
If x, 9, 5 and 3 are in proportion, then x equals to:', NULL, 'Ratio and Proportion', 'MCQ', 5, NULL, array['15', '45', '27', '18']::text[]),
  ('MQ-8072a3-2-0', '8072a3', 15, '2', '(i) Using the properties of proportion, find the value of x in the expression: (4)

$$\frac{\sqrt{a+x} + \sqrt{a-x}}{\sqrt{a+x} - \sqrt{a-x}} = 5$$', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-8072a3-2-1', '8072a3', 16, '2', '(ii) Find the equation of the line perpendicular to the line joining the points A(2, 4) and B(6, 8) and passing through the point (5,7). (4)', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-8072a3-2-2', '8072a3', 17, '2', '(iii) The given figure represents a hemisphere surmounted by a conical block of wood. The diameter of their base is 12 cm each and the slant height of the cone is 10 cm. Calculate : (4)

(a) the perpendicular height of the cone,
(b) the volume of the solid (Take π = 3.14)', 4, 'Mensuration', 'long', 5, '8072a3__Avm_6_X_Ma_p5_img_0_jpeg.webp', NULL),
  ('MQ-8072a3-3-0', '8072a3', 18, '3', '(i) Ritwik deposits ₹1600 per month for 18 months in a recurring deposit account. If he gets ₹31080 at the time of maturity. Find: (4)

(a) The total interest earned by Ritwik
(b) The rate of interest per annum', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-8072a3-3-1', '8072a3', 19, '3', '(ii) Prove that: $$\frac{\cos^2 A}{\cos A - \sin A} + \frac{\sin A}{1 - \cot A} = \sin A + \cos A.$$', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-8072a3-3-2', '8072a3', 20, '3', '(iii) Use graph paper for this question. The point R (6, 3) was reflected in the origin to get the image R''.

- (a) Write down the coordinates of R''.
- (b) If M is the foot of the perpendicular from R to the line y = 0, find the coordinates of M.
- (c) If N is the foot of the perpendicular from R'' to the line y = 0, find the coordinates of N.
- (d) Name the figure RMR''N.', NULL, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-8072a3-4-0', '8072a3', 21, '4', '(i) If $A = \begin{bmatrix} 3 & 2 \\ x & y \end{bmatrix}$ and $A^2 = I$ , where I is the identity matrix. Find the value of x and y.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-8072a3-4-1', '8072a3', 22, '4', '(ii) Solve the inequation and represent the solution set on the number line: (3) $2y - 3 \leq y + 1 \leq 4y + 7, x \in \mathbb{Z}$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-8072a3-4-2', '8072a3', 23, '4', '(iii) By using step-deviation method, compute the arithmetic mean for the following data:

| Marks obtained | No. of workers |
| --- | --- |
| 0 – 10 | 14 |
| 10 – 20 | 22 |
| 20 – 30 | 37 |
| 30 – 40 | 58 |
| 40 – 50 | 67 |
| 50 – 60 | 75 |', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-8072a3-5-0', '8072a3', 24, '5', '(i) Without solving the following quadratic equation, find the value of ''p'' if the roots of the equation $$px^2 - (2p - 2)x + p = 0$$ has real and equal roots. (3)', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-8072a3-5-1', '8072a3', 25, '5', '(ii) In an intra-state transaction the marked price of an article is ₹6000. A wholeseller sells it to a dealer at 20% discount. The dealer further sells the article to a customer at a discount of 10% on the marked price. If the rate of GST at each stage is 18%, find the amount of tax(under GST) paid by the dealer to the government. (3)', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-8072a3-5-2', '8072a3', 26, '5', '(iii) PA and PB are two tangents of a circle. AC is parallel to PB. Find the angles of $$\triangle ABC$$. (4)', 4, 'Circles', 'long', 7, '8072a3__Avm_6_X_Ma_p7_img_0_jpeg.webp', NULL),
  ('MQ-8072a3-6-0', '8072a3', 27, '6', '(i) If a, b and c are in continued proportion, prove that (3)

$$\frac{1}{a^3} + \frac{1}{b^3} + \frac{1}{c^3} = \frac{a}{b^2c^2} + \frac{b}{c^2a^2} + \frac{c}{a^2b^2}$$', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-8072a3-6-1', '8072a3', 28, '6', '(ii) The daily profits in rupees of 100 shops in a departmental store are distributed as follows: (3)

| Profit per shop (in ₹) | 0-100 | 100-200 | 200-300 | 300-400 | 400-500 | 500-600 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of Shops | 12 | 18 | 27 | 20 | 17 | 6 |

Draw a histogram of the data given above on the graph paper and estimate the mode.', 3, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-8072a3-6-2', '8072a3', 29, '6', '(iii) If 2x³ + ax² + bx - 6 has a factor (2x + 1) and leaves the remainder 12 (4) when divided by (x + 2). Calculate the values of a and b.', 4, 'Factorisation and Remainder Theorem', 'long', 8, NULL, NULL),
  ('MQ-8072a3-7-0', '8072a3', 30, '7', '(i) Find the sum of n terms of the A.P. 8, 5, 2, -1,... to 11 terms. (3)', 3, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-8072a3-7-1', '8072a3', 31, '7', '(ii) P(-4, 6), Q(-1, 6) and R(-1, 2) are the vertices of a triangle. (3)

(a) Find the coordinates of the centroid G of the triangle.
(b) Find the equation of the line through G passing through P.', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-8072a3-7-2', '8072a3', 32, '7', '(iii) Construct a circle of radius 3.5 cm with centre O. Construct 2 tangents (4) PT and PR from a point P outside the circle such that ∠TOR = 120°.', 4, 'Constructions', 'long', 8, NULL, NULL),
  ('MQ-8072a3-8-0', '8072a3', 33, '8', '(i) A hollow copper pipe of inner diameter 14 cm and outer diameter 16 cm is melted into another solid cylinder is of same height as that of pipe. Find the diameter of the solid cylinder. (3)', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-8072a3-8-1', '8072a3', 34, '8', '(ii) In the given figure, AB and CD are two chords of a circle intersecting each other at a point P, such that AP = CP. Prove that AB = CD. (3)', 3, 'Circles', 'short', 8, '8072a3__Avm_6_X_Ma_p8_img_0_jpeg.webp', NULL),
  ('MQ-8072a3-8-2', '8072a3', 35, '8', '(iii) A man standing on a window of the first floor of a building observes (4) that the angle of depression of a dustbin which is 10m from the foot of the building is 45°. He climbs to the window of the second floor, directly above the first floor and observes the angle of depression of the dustbin to be 60°. Calculate the difference in height between the first floor and the second floor.', 4, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-8072a3-9-0', '8072a3', 36, '9', '(i) Car A travels x km for every litre of petrol, while car B travels (x + 5) km for every litre of petrol.

- (a) Write down the number of litres of petrol, use by car A and car B in covering a distance of 200km.
- (b) If car A uses 2 litres of petrol more than car B in covering the 200km, write down an equation in x and solve it to determine the number of litres of petrol used by car B for the journey.

(4)', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-8072a3-9-1', '8072a3', 37, '9', '(ii) Use graph paper for this question.
Marks obtained by 200 students in an examination are given below:

| Marks | No. of Students |
| --- | --- |
| 0 – 10 | 5 |
| 10 – 20 | 11 |
| 20 – 30 | 10 |
| 30 – 40 | 20 |
| 40 – 50 | 28 |
| 50 – 60 | 37 |
| 60 – 70 | 40 |
| 70 – 80 | 29 |
| 80 – 90 | 14 |
| 90 - 100 | 6 |

Draw an ogive for the given distribution taking 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis. Determine:

- (a) The median marks
- (b) The number of students who failed if the minimum marks required is 40.
- (c) If scoring 85 and above is grade one, find the number of students who secured grade one in the examination.', NULL, 'Statistics', 'short', 9, NULL, NULL),
  ('MQ-8072a3-10-0', '8072a3', 38, '10', '(i) Prove that: $$\frac{\cot A + \tan B}{\cot B + \tan A} = \cot A \tan B$$', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-8072a3-10-1', '8072a3', 39, '10', '(ii) Two dice are thrown at the same time. Find the probability that the sum (3)
of two numbers appearing on the dice.

- (a) 10
- (b) Atleast 12', 3, 'Probability', 'short', 10, NULL, NULL),
  ('MQ-8072a3-10-2', '8072a3', 40, '10', '(iii) In the adjoining figure; $QR \parallel ST$ and $S$ divides $PQ$ in the ratio 1 : 2. (4)
Find:

- (a) $\frac{PT}{TR}$
- (b) $\frac{PT}{PR}$
- (c) $ST$ if $QR = 4.5\text{ cm}$', 4, 'Similarity', 'long', 10, '8072a3__Avm_6_X_Ma_p10_img_0_jpeg.webp', NULL),
  ('MQ-8fb800-1-0', '8fb800', 0, '1', 'a) An A.P. consists of 50 terms of which the third term is 12 and the last term is 106. Find the 29th term. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-8fb800-1-1', '8fb800', 1, '1', 'b) Solve the following inequation and represent the solution set on the number line ;

2x - 3 < x + 2 ≤ 3x + 5; x ∈ R [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-8fb800-1-2', '8fb800', 2, '1', 'c) Mr Gupta has a cumulative deposit account of Rs 400 per month at 10% p.a. simple interest. If she gets Rs 30100 at the time of maturity, find the total time for which the account was held. [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-8fb800-2-0', '8fb800', 3, '2', 'a) If P = [1 1 8 3]. Find matrix X if X = P² - 4P. Hence, solve for a and b given ...2 [3]

 
..2..

Contd... Std X Math Pre Prelim review January 2021

\[
X \left[ \begin{array}{c} a \\ b \end{array} \right] = \left[ \begin{array}{c} 5 \\ 5 0 \end{array} \right]
\]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-8fb800-2-1', '8fb800', 4, '2', 'b) A single die is rolled. Find the probability of getting [3]

i) A prime number
ii) Multiple of 2 or 3
iii) A number less than 8', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-8fb800-2-2', '8fb800', 5, '2', 'c) The following table shows the expenditure of 60 boys on books. Find the mode expenditure. [4]

| Expenditure(Rs) | No. of Students |
| --- | --- |
| 20 - 25 | 4 |
| 25 - 30 | 7 |
| 30 - 35 | 23 |
| 35 - 40 | 18 |
| 40 - 45 | 6 |
| 45 - 50 | 2 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-8fb800-3-0', '8fb800', 6, '3', 'a) The line segment joining A (2,3) and B (6,-5) is intersected by the X-axis at point K. Write down the co-ordinates of K. Hence find the ratio in which K divides AB. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8fb800-3-1', '8fb800', 7, '3', 'b) Prove the following identities : (cosec A - sin A) (sec A - cos A) (tan A + cot A) = 1 [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-8fb800-3-2', '8fb800', 8, '3', 'c) PA and PB are two tangents of a circle. AC is parallel to PB. Find the \( \angle ACB \) and \( \angle BAC \) [4]', 4, 'Circles', 'long', 2, '8fb800__Avm_Juhu_I_p2_img_0_jpeg.webp', NULL),
  ('MQ-8fb800-4-0', '8fb800', 9, '4', 'a) Given that 2 is a root of the equation $$3x^2 - p(x+1) = 0$$ and that the equation $$px^2 - qx +9 = 0$$ has equal roots. Find the values of p and q. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-8fb800-4-1', '8fb800', 10, '4', 'b) A circus tent is cylindrical to a height of 4 m and conical above it if its diameter is 105 m and its slant height is 80 m. Calculate the total area of canvas required. Also, find the total cost of canvas used at Rs 15 per meter if the width is 1.5 m [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-8fb800-4-2', '8fb800', 11, '4', 'c) Find the amount of bill inclusive of GST for the following intra-state transaction of goods/services. The GST rate is 5%. [4]

| Quantity | MRP of each item(Rs) | Discount % |
| --- | --- | --- |
| 18 | 150 | 10 |
| 24 | 240 | 20 |
| 30 | 100 | 30 |
| 12 | 120 | 20 |', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-8fb800-5-0', '8fb800', 12, '5', 'a) If $$\frac{a^3 + 3ab^2}{3a^2b + b^3} = \frac{x^3 + 3xy^2}{3x^2y + y^3}$$ prove that $$\frac{x}{a} = \frac{y}{b}$$ [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-8fb800-5-1', '8fb800', 13, '5', 'b) A jar contains 81 balls each of which is red, blue or green. The probability of selecting a red ball is 1/3 and that of blue is 4/9. How many green balls does the jar contain? [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-8fb800-5-2', '8fb800', 14, '5', 'c) Use a graph paper for this question. Plot the points P(3,2) and Q(-3,-2), From P and Q, draw perpendiculars PM and QN on the X-axis [4]
i) Name the image of P on reflection in the origin.
ii) Assign the special name to the geometrical figure PMQN and find its area.
iii) Write the co-ordinates of the points to which M is mapped on reflection in:
i) X- axis ii) Y-axis iii) origin', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-8fb800-6-0', '8fb800', 15, '6', 'a) Mr Shah needs Rs 16509 after 36 months. How much money does he should invest per month in a recurring deposit scheme to get the required amount, when the rate of interest is 9.5 % p.a. ? ...4', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-8fb800-6-1', '8fb800', 16, '6', 'b) If the mean of the following data is 21, find the value of ''P'' [3]

| x | 10 | 15 | 20 | 25 | 35 |
| --- | --- | --- | --- | --- | --- |
| f | 6 | 10 | P | 10 | 8 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-8fb800-6-2', '8fb800', 17, '6', 'c) ABCD is a parallelogram where A(x,y), B(5,8), C(4,7), D(2,-4). Find [4]

i) Coordinate of A
ii) Equation of Diagonal BD', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-8fb800-7-0', '8fb800', 18, '7', 'a) P and Q are two points on the opposite sides of a 90 m high tower AB the base B of the tower AB and points P and Q are along the same straight line, the angles of depression of points P and Q as observed from top A of tower AB are 60° and 30° respectively. Find the distance between P and Q correct to the nearest meter. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-8fb800-7-1', '8fb800', 19, '7', 'b) Angle BAC of triangle ABC is obtuse and AB = AC. P is a point in BC such that PC = 12 cm. PQ and PR are perpendiculars to sides AB and AC respectively. If PQ = 15 cm and PR = 9 cm; find the length of PB. [3]', 3, 'Similarity', 'short', 4, '8fb800__Avm_Juhu_I_p4_img_0_jpeg.webp', NULL),
  ('MQ-8fb800-7-2', '8fb800', 20, '7', 'c) A bus covers a distance of 240 km at a uniform speed. Due to heavy rain its speed gets reduced by 10 km/hr and as such it takes two hrs longer to cover the total distance. Assuming the uniform speed to be ''x'' km/hr form an equation and solve it to evaluate ''x''. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-8fb800-8-0', '8fb800', 21, '8', 'a) Factorise: 2x³ - 5x² - 8x +20 using remainder theorem. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-8fb800-8-1', '8fb800', 22, '8', 'b) The monthly income of a group of 320 employees in a company is given below: [6]

| Monthly Income | No of Employees |
| --- | --- |
| 6000-7000 | 20 |
| 7000-8000 | 45 |
| 8000-9000 | 65 |
| 9000-10000 | 95 |
| 10000-11000 | 60 |
| 11000 -12000 | 30 |
| 12000 -13000 | 5 |

...5

 
..5..

Contd... Std X Math Pre Prelim review January 2021

Draw an ogive taking 2cm=Rs 1000 on one axis and 2 cm =50 employees on other axis. From the graph determine :

i) The median wage.
ii) No. of employees whose income is below Rs 8500
iii) The upper quartile.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-8fb800-9-0', '8fb800', 23, '9', 'a) What number must be subtracted from 16x³- 8x²+ 4x +7 so that the resulting polynomial has 2x +1 as a factor?

[3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-8fb800-9-1', '8fb800', 24, '9', 'b) Given x = $$\frac{\sqrt{a^2 + b^2} + \sqrt{a^2 - b^2}}{\sqrt{a^2 + b^2} - \sqrt{a^2 - b^2}}$$.

Use componendo and dividendo to prove that $$b^2 = \frac{2a^2x}{x^2 + 1}$$. [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-8fb800-9-2', '8fb800', 25, '9', 'c) Find (i)⊥BDC (ii)⊥BCD (iii)⊥BCA

[4]', 4, 'Circles', 'long', 5, '8fb800__Avm_Juhu_I_p5_img_0_jpeg.webp', NULL),
  ('MQ-8fb800-10-0', '8fb800', 26, '10', 'a) Solve the following inequation and represent the solution set on the number line where x∈W [3]

$$-2\frac{1}{2} + 2x \leq \frac{4x}{5} \leq \frac{4}{3} + 2x$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-8fb800-10-1', '8fb800', 27, '10', 'b) The lower window of a house is at a height of 2 m above the ground and its upper window is 4 m vertically above the lower window. At a certain instant the angles of elevation of a balloon from these windows are observed to be 60° and 30° respectively. find the balloon above the ground. [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-8fb800-10-2', '8fb800', 28, '10', 'c) A solid cylinder of silver 9 cm high and 4 cm in diameter is melted and recast into a right circular cone of diameter 6 cm. Find the height and the total surface area of the cone. Give your answer correct to 3 significant figures.( take Π =3.14) [4] ..6', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-8fb800-11-0', '8fb800', 29, '11', 'a) If A = [3 a, -4 8], B = [c 4, -3 0], C = [-1 4, 3 b], [3]

and 3A - 2C = 6B. Find the values of a,b and c.', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-8fb800-11-1', '8fb800', 30, '11', 'b) (sin A +cos A)(sec A + cosec A)=2 + sec A cosec A [3]', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-8fb800-11-2', '8fb800', 31, '11', 'c) In Δ ABC, ∠ ABC =∠ DAC.AB =16cm,AC =8 cm, AD =10cm. [4]

i) Prove that Δ ACD is similar to Δ BCA
ii) Find BC and CD
iii) Find area of Δ ACD : area of Δ ABC', 4, 'Similarity', 'long', 6, '8fb800__Avm_Juhu_I_p6_img_0_jpeg.webp', NULL),
  ('MQ-c619ef-1-0', 'c619ef', 0, '1', '(i) The interest earned on a recurring deposit account with a bank for 2 years, which pays 6% rate of interest per annum on a monthly installment of ₹1000 is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1000', '1500', '10000', '15000']::text[]),
  ('MQ-c619ef-1-1', 'c619ef', 1, '1', '(ii) In an intrastate transaction, goods worth ₹25000 are sold. If the applicable rate of GST is 18%, find the CGST.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['4500', '2250', '2750', '3750']::text[]),
  ('MQ-c619ef-1-2', 'c619ef', 2, '1', '(iii) The solution set for the given number line is:', 1, 'Linear Inequations', 'MCQ', 2, 'c619ef__Avm_X_Math_p2_img_0_jpeg.webp', array['\(\{-2 < x < 1, x \in R\}\)', '\(\{-2, -1, 0, 1\}\)', '\(\{-3, -2, -1, 0, 1, 2\}\)', '\(\{-2\leq x\leq 1,x\in R\}\)']::text[]),
  ('MQ-c619ef-1-3', 'c619ef', 3, '1', '(iv) When the discriminant of the quadratic equation b² - 4ac > 0 then the roots are:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['real and equal', 'real and unequal', 'not real', 'zero']::text[]),
  ('MQ-c619ef-1-4', 'c619ef', 4, '1', '(v) One of the factors of x² - 4x - 5 is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['\(x + 5\)', '\(x - 1\)', '\(x + 4\)', '\(x - 5\)']::text[]),
  ('MQ-c619ef-1-5', 'c619ef', 5, '1', '(vi) If (x² + y²) : 2xy = 5 : 3, then one of the possible values of x : y is.', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['\(1:1\)', '\(2:1\)', '\(1:2\)', '\(3:1\)']::text[]),
  ('MQ-c619ef-1-6', 'c619ef', 6, '1', '(vii) Given $$\left[ \begin{smallmatrix} a \\ b \end{smallmatrix} \right] \times X = \left[ \begin{smallmatrix} p & q \\ r & s \end{smallmatrix} \right]$$. The order of matrix X is:', 1, 'Matrices', 'MCQ', 2, NULL, array['\(2 \times 2\)', '\(1 \times 2\)', '\(2 \times 1\)', '\(1 \times 1\)']::text[]),
  ('MQ-c619ef-1-7', 'c619ef', 7, '1', '(viii) The point A(5, 0) is invariant when reflected about _____.', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['x axis', 'y axis', 'origin', 'a line parallel to \( x \) axis 5 units above it']::text[]),
  ('MQ-c619ef-1-8', 'c619ef', 8, '1', '(ix) The class mark for the class interval 10 - 20 is ________.', 1, 'Statistics', 'MCQ', 3, NULL, array['10', '15', '17.5', '20']::text[]),
  ('MQ-c619ef-1-9', 'c619ef', 9, '1', '(x) Two dice are thrown. Find the probability of getting the same number on both.', 1, 'Probability', 'MCQ', 3, NULL, array['1/4', '1/2', '3/4', '1/6']::text[]),
  ('MQ-c619ef-1-10', 'c619ef', 10, '1', '(xi) Shiny has a recurring deposit account in a post office for 1 year at 10% p.a. simple interest. If her monthly installment is ₹4000, calculate the interest at the time of maturity.', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹3000', '₹2000', '₹2500', '₹2600']::text[]),
  ('MQ-c619ef-1-11', 'c619ef', 11, '1', '(xii) A consumer buys a refrigerator at ₹36000 from a dealer. What GST does she have to pay to the State Government if the rate of GST is 18%?', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹6000', '₹6480', '₹6840', '₹8000']::text[]),
  ('MQ-c619ef-1-12', 'c619ef', 12, '1', '(xiii) The solution set of the inequation 3 - 2x ≥ 3x - 12, given that x ∈ R is:', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['{x : x ∈ R, x < 3}', '{x : x ∈ R, x ≤ 3}', '{x : x ∈ R, x > 3}', '{x : x ∈ R, x ≥ 3}']::text[]),
  ('MQ-c619ef-1-13', 'c619ef', 13, '1', '(xiv) The solution of the equation √3x - 2 = x is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['x = 1 or x = 2', 'x = -1 or x = -2', 'x = 1 or x = 0', 'x = 0 or x = 2']::text[]),
  ('MQ-c619ef-1-14', 'c619ef', 14, '1', '(xv) If a polynomial f(x) is divided by (x - a), then the remainder f(a) is obtained by substituting __________ in f(x).', 1, 'Factorisation and Remainder Theorem', 'MCQ', 4, NULL, array['x = a', 'x = 0', 'x = -a', 'xa = 0']::text[]),
  ('MQ-c619ef-2-0', 'c619ef', 15, '2', '(a) Find the total amount to be paid for the given bill.

[4]

| Articles | Market Price (Rs.) | Discount (Rs.) | Rate of GST |
| --- | --- | --- | --- |
| Stent | Rs. 24500.00 | Rs. 2000 | 28% |
| Oxygen cylinder | Rs. 33000.00 | Rs. 1500 | 18% |', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-c619ef-2-1', 'c619ef', 16, '2', '(b) Find the values of a, b, x and y, if $$\begin{bmatrix} x+y & x-y \\ 3a+7 & b-5 \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 10 & 5 \end{bmatrix}$$ [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-c619ef-2-2', 'c619ef', 17, '2', '(c) Saksham has a recurring deposit account in a bank. He deposits ₹1000 per month for two years. If he gets ₹26,050 at the time of maturity, find [4]

- (i) the interest paid by the bank
- (ii) the rate of interest', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-c619ef-3-0', 'c619ef', 18, '3', '(a) Factorise the given polynomial completely, using Factor Theorem: $$6x^3 - 17x^2 + 4x + 7$$ [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-c619ef-3-1', 'c619ef', 19, '3', '(b) Two coins are tossed at the same time. Find the probability of getting [4]

- (i) a head on the first coin and tail on the second
- (ii) a head and a tail
- (iii) at least one head', 4, 'Probability', 'long', 4, NULL, NULL),
  ('MQ-c619ef-3-2', 'c619ef', 20, '3', '(c) Use a graph sheet for this question. Take 2 cm = 1 unit along the axes. [5]
Plot the points, A(0, 4) and B(-3, 2).

- (i) Reflect point B through the line x = 0 and name it as B''.
- (ii) Reflect point B through the origin and name it as B''''.
- (iii) Reflect point A through the line y = 0 and name it as A''.
- (iv) Join the points AB''B''''A''BA and give the geometrical name of the closed figure so formed.', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-c619ef-4-0', 'c619ef', 21, '4', '(a) Find the discriminant of the following quadratic equation: $3x^2 - 7x + \frac{1}{2} = 0$ , and hence find the nature of the roots. [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-c619ef-4-1', 'c619ef', 22, '4', '(b) Solve the following inequation and represent the solution on the number line.: $x - 11 < 2x - 7 \leq 1, x \in \mathbb{R}$ [3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-c619ef-4-2', 'c619ef', 23, '4', '(c) The following table gives the price range of 50 items in a shop. [4]

| Price (₹) | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 |
| --- | --- | --- | --- | --- | --- |
| No. of items | 11 | 7 | 15 | 8 | 9 |

Find the mean price of all the items to the nearest rupee using step - deviation method.', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-c619ef-5-0', 'c619ef', 24, '5', '(a) A point P is reflected in the origin. Coordinates of its image are (5, 4). Find [3]

- (i) the coordinates of P.
- (ii) the coordinates of the image of P in the x - axis.
- (iii) the coordinates of the image of P in the line x = -2.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-c619ef-5-1', 'c619ef', 25, '5', '(b) Evaluate AB - 5C [3]

$$A = \begin{bmatrix} 3 & 2 \\ -2 & 4 \end{bmatrix},\ B = \begin{bmatrix} 4 \\ 5 \end{bmatrix}\ \text{and}\ C = \begin{bmatrix} 5 \\ 7 \end{bmatrix},\dots 6$$', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-c619ef-5-2', 'c619ef', 26, '5', '(c) Solve for x, using the properties of proportion. [4]

$$\frac{\sqrt{5x} + \sqrt{2x-6}}{\sqrt{5x} - \sqrt{2x-6}} = 4$$', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-c619ef-6-0', 'c619ef', 27, '6', '(a) If 6 is the mean proportion between two numbers x and y and 162 is the third proportional to x and y, find the numbers. [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-c619ef-6-1', 'c619ef', 28, '6', '(b) When $x^3 + 4x^2 - kx - 6$ is divided by $x - 3$ , the remainder is $k$ . Find the value of the constant $k$ . [3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-c619ef-6-2', 'c619ef', 29, '6', '(c) Use a graph sheet for this question. Draw a histogram for the monthly salary of 50 workers in the following table and hence estimate the mode for the following distribution. Take $2\text{ cm} = ₹500$ along the x-axis and $2\text{ cm} = 5$ members along the y-axis. [4]

| Monthly salary (₹) | 3500 - 4000 | 4000 - 4500 | 4500 - 5000 | 5000 - 5500 | 5500 - 6000 |
| --- | --- | --- | --- | --- | --- |
| No. of workers | 10 | 12 | 18 | 7 | 3 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-c619ef-7-0', 'c619ef', 30, '7', '(a) Show that $(3x - 4)$ and $(2x - 1)$ are factors of $6x^2 - 11x + 4$ . [3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-c619ef-7-1', 'c619ef', 31, '7', '(b) Solve the following inequation and write the solution set:

 $3x - 4 < 15x + 8 \leq 12x + 20, x \in \mathbb{W}$ .

 Represent the solution on a real number line. [3]', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-c619ef-7-2', 'c619ef', 32, '7', '(c) Manufacturer A sells a sewing machine to a dealer B for ₹5000. The dealer B sells it to a customer at a profit of ₹500. If the sales are intra-state and the rate of GST is 12%, find [4]
(i) the amount of GST paid by dealer B to the Central Government.
(ii) the amount of GST received by the State Government.
(iii) the amount that the customer pays for the machine.', 4, 'GST and Banking', 'long', 7, NULL, NULL),
  ('MQ-c619ef-8-0', 'c619ef', 33, '8', '(a) Rajesh deposits ₹1500 every month in a recurring deposit account for 1 ½ years. If the rate of interest is 6% per annum, find the interest and maturity value he will receive on maturity. [3]', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-c619ef-8-1', 'c619ef', 34, '8', '(b) If a, b, c, d are in continued proportion, prove that: $$\frac{(a-b)^3}{(b-c)^3} = \frac{a}{d}$$ [3]', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-c619ef-8-2', 'c619ef', 35, '8', '(c) Solve the quadratic equation and give your answer correct to two significant figures. [4]

$$5x^2 + 3x - 4 = 0$$', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-c619ef-9-0', 'c619ef', 36, '9', '(a) A bag contains some red, blue and green pens. The probability of selecting a red pen is $$\frac{3}{4}$$ and blue pen is $$\frac{1}{5}$$. If the bag contains 20 green pens, then find: [3]
(i) total number of pens in the bag.
(ii) probability of selecting a green pen.', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-c619ef-9-1', 'c619ef', 37, '9', '(b) P is the solution set of $$7x + 3 < 3x - 4$$, where $$x \in \mathbb{R}$$. Find the solution set and graph the solution set on the number line. [3]', 3, 'Linear Inequations', 'short', 7, NULL, NULL),
  ('MQ-c619ef-9-2', 'c619ef', 38, '9', '(c) If $$A = \begin{bmatrix} 2 & 0 \\ -1 & 4 \end{bmatrix}$$, find the value of $$A^2 - 6I$$, where I is the unit matrix of order 2. [4]', 4, 'Matrices', 'long', 7, NULL, NULL),
  ('MQ-c619ef-10-0', 'c619ef', 39, '10', '(a) Sheeba has a cumulative deposit account of ₹500 per month at 8% per annum simple interest. If she gets ₹36100 at the time of maturity, find the total time for which the account was held. [4]', 4, 'GST and Banking', 'long', 8, NULL, NULL),
  ('MQ-c619ef-10-1', 'c619ef', 40, '10', '(b) Use a graph sheet for this question. The weights of 120 patients admitted in a hospital are given below: [6]

| Weights (kg) | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 | 100 - 110 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of patients | 10 | 13 | 30 | 20 | 15 | 25 | 7 |

Use 2 cm = 10 kg and 2 cm = 20 patients along x-axis and y-axis respectively to draw an ogive and hence estimate:

- (i) the median weight
- (ii) the inter - quartile range of weights
- (iii) percentage of patients whose weight is below 60 kg.', 6, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-426ab6-1-0', '426ab6', 0, '1', '(i) If A = $$\begin{bmatrix} 2 & -1 \\ -1 & 3 \end{bmatrix}$$ then A² is', 1, 'Matrices', 'MCQ', 1, NULL, array['\(\begin{bmatrix} 4 & -1 \\ 1 & 9 \end{bmatrix}\)', '\(\begin{bmatrix} 4 & 1 \\ 1 & 9 \end{bmatrix}\)', '\(\begin{bmatrix} 5 & -5 \\ -5 & 10 \end{bmatrix}\)', '\(\begin{bmatrix} 2 & 4 \\ 1 & 9 \end{bmatrix}\)']::text[]),
  ('MQ-426ab6-1-1', '426ab6', 1, '1', '(ii) The mean proportion between 4 and 64 is', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['16', '256', '8', '4']::text[]),
  ('MQ-426ab6-1-2', '426ab6', 2, '1', '(iii)
While computing mean of grouped data we assume that the frequencies are', 1, 'Statistics', 'MCQ', 2, NULL, array['evenly distributed over all the classes', 'centered at the lower limits of the classes', 'centered at the class marks of the classes', 'centered at the upper limits of the classes']::text[]),
  ('MQ-426ab6-1-3', '426ab6', 3, '1', '(iv)
The image of the point (3,-4) when reflected in the x-axis is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(3,4)', '(-3,4)', '(-3,-4)', '(3,-4)']::text[]),
  ('MQ-426ab6-1-4', '426ab6', 4, '1', '(v) A man deposited ₹1000 per month for 24 months and received ₹ 27,000 as the maturity value. The interest received by him is', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 3000', '₹ 6000', '₹ 3500', 'None of the above']::text[]),
  ('MQ-426ab6-1-5', '426ab6', 5, '1', '(vi) The solution set representing the following number line is', 1, 'Linear Inequations', 'MCQ', 2, '426ab6__Avm_X_Math_p2_img_0_jpeg.webp', array['\(\{x:x\in R, - 2\leq x < 3\}\)', '\(\{x:x\in R, - 2 < x < 3\}\)', '\(\{x:x\in R, - 2 < x\leq 3\}\)', '\(\{x:x\in R, - 2\leq x\leq 3\}\)']::text[]),
  ('MQ-426ab6-1-6', '426ab6', 6, '1', '(vii) The first three terms of an A.P. are 3,10,17 then the next two terms are', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['22 and 25', '24 and 31', '12 and 18', '18 and 21']::text[]),
  ('MQ-426ab6-1-7', '426ab6', 7, '1', '(viii) If a polynomial $$4p^2 - 4p + 2$$ is divided by $$(p - 1)$$ then the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['0', '-1', '+2', '-2']::text[]),
  ('MQ-426ab6-1-8', '426ab6', 8, '1', '(ix) If $$x \in R$$, then the solution set in equation $$x > -2$$ is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['\(\{\infty, \ldots, -4, -3\}\)', '\(\{2,3,4,\ldots ,\infty \}\)', '\(\{-7, -6, -5, -4, -3, -2\}\)', 'None of these']::text[]),
  ('MQ-426ab6-1-9', '426ab6', 9, '1', 'The slope of a line parallel to the line 4x - 5y - 9 = 0 is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['0', '\(\frac{5}{4}\)', '\(\frac{4}{5}\)', 'not defined']::text[]),
  ('MQ-426ab6-1-10', '426ab6', 10, '1', '(xi) The line segment joining A(-3,1) and B(5,-5) is a diameter of a circle whose centre is C. The co-ordinates of the C are', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['\((-2,1)\)', '(1,-2)', '(4,3)', '(3,4)']::text[]),
  ('MQ-426ab6-1-11', '426ab6', 11, '1', '(xii) During conversion of a solid from one shape to another, the volume of new shape wills ____.', 1, 'Mensuration', 'MCQ', 3, NULL, array['increase', 'decrease', 'remains unaltered', 'be doubled.']::text[]),
  ('MQ-426ab6-1-12', '426ab6', 12, '1', '(xiii) If 48 is the nth term of the A.P. 2,4,6,8,x, ... the ''x'' is', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['24', '2', '20', '26']::text[]),
  ('MQ-426ab6-1-13', '426ab6', 13, '1', '(xiv) The roots of the quadratic equation 2s² + 4s - 2 = 0 are', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['Real and distinct', 'Real and equal', 'Distinct', 'Not real/imaginary']::text[]),
  ('MQ-426ab6-1-14', '426ab6', 14, '1', '(xv) The percentage share of SGST of total GST for an Intra-State sale of an article is', 1, 'GST and Banking', 'MCQ', 3, NULL, array['\(25\%\)', '\(50\%\)', '\(75\%\)', '\(100\%\)']::text[]),
  ('MQ-426ab6-2-0', '426ab6', 15, '2', '(i) Use the factor theorem to factorise \(6a^3 + 17a^2 + 4a - 12\) completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-426ab6-2-1', '426ab6', 16, '2', '(ii) Given \( A = \begin{bmatrix} x & 4 \\ y & 4 \end{bmatrix} \), If \( A^2 = 4I \), where \( I \) is the identity matrix of order 2, find \( x \) and \( y \).', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-426ab6-2-2', '426ab6', 17, '2', '(iii) Using ruler and compass construct a triangle ABC where AB = 3cm,
BC = 4 cm and ∠ABC = 90°.
Hence construct a circle circumscribing triangle ABC. Measure and write down the
radius of the circle.', NULL, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-426ab6-3-0', '426ab6', 18, '3', '(i) Solve the following inequation and represent the solution set on the number line. [4]

$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x, x \in I$$ [4]', 4, 'Linear Inequations', 'long', 4, NULL, NULL),
  ('MQ-426ab6-3-1', '426ab6', 19, '3', '(ii) The surface area of solid metallic sphere is 1256 cm². It is melted and recast into
solid right circular cone of radius 2.5cm and height 8 cm. (Take π = 3.14)
Calculate : i. the radius of the solid sphere
ii. the number of cones recast. [5]', 5, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-426ab6-3-2', '426ab6', 20, '3', '(iii) The weight of 50 mangoes was recorded as given below. Calculate the mean
weight to the nearest gram using Step deviation method.

| Weights in gram | 80-85 | 85-90 | 90-95 | 95-100 | 100-105 | 105-110 | 110-115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of mangoes | 5 | 8 | 10 | 12 | 8 | 4 | 3 |', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-426ab6-4-0', '426ab6', 21, '4', '(i) A(10,5), B(6,3) and C(2,1) are the vertices of a \(\Delta ABC\). L is the midpoint of AB and M is the midpoint of AC. Write down the coordinates of L and M.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-426ab6-4-1', '426ab6', 22, '4', '(ii) ₹ 480 is divided equally among y children. If the number of children was 20 more, then each would have got ₹ 12 less. Find the value of y.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-426ab6-4-2', '426ab6', 23, '4', '(iii) The mean of the following data is 16. Calculate the value of \( f \).

| Marks | 5 | 10 | 15 | 20 | 25 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 7 | f | 9 | 6 |', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-426ab6-5-0', '426ab6', 24, '5', '(i) A man standing on a top of the bridge of 100 m height make the angles of depressions with two ships on opposite sides of him as 45° and 30° respectively. Find the distance between the two ships to nearest metre. [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-426ab6-5-1', '426ab6', 25, '5', '(ii) Prove that: $$\frac{\sin A}{1+\cot A} - \frac{\cos A}{1+\tan A} = \sin A - \cos A$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-426ab6-5-2', '426ab6', 26, '5', '(iii) For $$A = \begin{bmatrix} 1 & 0 \\ 2 & 1 \end{bmatrix}$$ and $$B = \begin{bmatrix} 2 & 3 \\ -1 & 1 \end{bmatrix}$$, find $$A^2 + AB + B^2$$. [4]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-426ab6-6-0', '426ab6', 27, '6', '(i) The line through A(-2,3) and B(4,p) is perpendicular to the line $$2x - 4y = 5$$. Find the value of p. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-426ab6-6-1', '426ab6', 28, '6', '(ii) Using properties of proportion find $$u:v$$, given : $$\frac{u^2+2u}{2u+4} = \frac{v^2+3v}{3v+9}$$ [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-426ab6-6-2', '426ab6', 29, '6', '(iii) Use graph paper for this question. [4]
Take 1 cm = 1 unit on both x and y axis.
(a) Plot the following points on your graph sheets A(-4,0), B(-3,2), C(0,4), D(4,1) and E(7,3).
(b) Reflect the points B,C,D and E on the x-axis and name them as B'',C'' and E'', respectively.
(c) Join the points A,B,C,D,E,E'',D'',C'',B'' and A in order.
(d) Name the closed figure formed.', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-426ab6-7-0', '426ab6', 30, '7', '(i) Solve the following quadratic equation for x and give your answer correct to three significant figures: $$3x^2-9x-27 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-426ab6-7-1', '426ab6', 31, '7', '(ii) How many metres of cloth 11 m wide will be required to make a conical tent, the radius of whose base is 7 m and height is 24 m? [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-426ab6-7-2', '426ab6', 32, '7', '(iii) Find the value of ''c'' if the lines $$5x - 3y + 2$$ and $$6x - cy + 7 = 0$$ are perpendicular to each other. [4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-426ab6-8-0', '426ab6', 33, '8', 'The radii of two cylinders are in the ratio of 4:6 and their heights are in the ratio of 10:8. Calculate the ratio of their curved surface areas.', NULL, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-426ab6-8-1', '426ab6', 34, '8', 'The difference of two natural numbers is 9 and their product is 220. Find the numbers.', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-426ab6-8-2', '426ab6', 35, '8', '(iii) A jar contains 30 marbles out of which ''x'' are black and remaining are red. If probability of drawing a black marble is twice the probability of drawing red marble, find the number of marble of each type in the box.

[6]', 6, 'Probability', 'long', 6, NULL, NULL),
  ('MQ-426ab6-9-0', '426ab6', 36, '9', '| Monthly income | Number of employees |
| --- | --- |
| 6000-7000 | 20 |
| 7000-8000 | 45 |
| 8000-9000 | 65 |
| 9000-10000 | 95 |
| 10000-11000 | 60 |
| 11000-12000 | 30 |
| 12000-13000 | 5 |

Draw an Ogive of the given distribution on a graph sheet taking 2cm = 1,000 on an axis and 2cm = 50 employees on the other axis. From the graph determine :

- (a) the median wage
- (b) the number of employees whose income is below 8,500
- (c) If the salary of a senior employee is above 11,500, find the number of senior employees in the company.
- (d) the upper quartile.', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-426ab6-9-1', '426ab6', 37, '9', '(ii) Prove the identity $$\left(\frac{1-\tan\theta}{1-\cot\theta}\right)^2 = \tan^2\theta$$ [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-426ab6-10-0', '426ab6', 38, '10', '(i) Find the fifth term of the sequence $$\sqrt{2}, \sqrt{8}, \sqrt{18}, \dots$$ [3]', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-426ab6-10-1', '426ab6', 39, '10', '(ii) Mr. Raman has a recurring deposit account and deposits ₹600 per month for 3 years. If he gets ₹ 24,930 at the time of maturity, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-426ab6-10-2', '426ab6', 40, '10', '(iii) Using the properties of proportion, find the value of ''x''. [4]

$$\frac{\sqrt{3x+4}+\sqrt{3x-5}}{\sqrt{3x+4}+\sqrt{3x-5}} = 9$$', 4, 'Ratio and Proportion', 'long', 6, NULL, NULL),
  ('MQ-7444e2-1-0', '7444e2', 0, '1', 'a) Sally has a cumulative time deposit account in a bank. She deposits Rs. 600 per month for 6 years. If at the end of maturity period she gets Rs. 53712, find the rate of interest. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-7444e2-1-1', '7444e2', 1, '1', 'b) Evaluate

$$\left[ \begin{array}{l l} \cos 45^{\circ} & \sin 30^{\circ} \\ \sqrt{2} \cos 0^{\circ} & \sin 0^{\circ} \end{array} \right] \quad \left[ \begin{array}{l l} \sin 45^{\circ} & \cos 90^{\circ} \\ \sin 90^{\circ} & \cot 45^{\circ} \end{array} \right]$$', NULL, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-7444e2-1-2', '7444e2', 2, '1', 'Factorise the following: $$2x^3 - x^2 - 13x - 6$$ using Factor theorem.', NULL, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-7444e2-2-0', '7444e2', 3, '2', 'If $$P = \{x: 7x - 4 > 5x + 2, x \in R\}$$ and $$Q = \{x: x - 19 \ge 1 - 3x, x \in R\}$$; Find the range of the set $$P \cap Q$$ and represent it on the number line. [3]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-7444e2-2-1', '7444e2', 4, '2', 'The sum of three terms in an AP is 45. The product of the first and the third numbers is 200. Find the numbers. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-7444e2-2-2', '7444e2', 5, '2', '$$\text{Prove: } \frac{\sec A - 1}{\sec A + 1} = \left[ \frac{\sin A}{1 + \cos A} \right]^2$$

[4]', 4, 'Trigonometry', 'long', 1, NULL, NULL),
  ('MQ-7444e2-3-0', '7444e2', 6, '3', 'a) If $$\frac{3p + 4q}{3r + 4s} = \frac{3p - 4q}{3r - 4s}$$, Prove that $$\frac{p}{q} = \frac{r}{s}$$ [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-7444e2-3-1', '7444e2', 7, '3', 'b) A man invests a sum of money in Rs. 100 shares, paying 15% dividend quoted at 20% premium. If his annual dividend is Rs. 540, calculate: [3]

(i) His total investment
(ii) The rate of return on his investment', 3, 'Shares and Dividends', 'short', 2, NULL, NULL),
  ('MQ-7444e2-3-2', '7444e2', 8, '3', 'c) Use a graph paper to solve this question: [4]

Plot A (3, 2) and B (5, 4) on the graph paper. Take 2cm = 1 unit on both the axes. Reflect A and B in the x- axis to A'' and B'' respectively. Plot these points on the same graph paper. And write the following:

(i) the geometrical name of the figure ABB''A
(ii) the coordinates of the image of A" of A when A is reflected in the origin
(iii) the single transformation that maps A'' to A"', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-7444e2-4-0', '7444e2', 9, '4', 'a) A bag contains 6 yellow balls and some green balls. If the probability of drawing a green ball is thrice the probability of the yellow ball, find the number of green balls and the total number of balls in the bag. [3]', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-7444e2-4-1', '7444e2', 10, '4', 'b) A (10, 5), B (6, -3) and C (2, 1) are the co-ordinates of the vertices of the \(\triangle\) ABC. Points L and M are the mid-points of AB and AC respectively. [3]

(i) Write the co-ordinates of ''L'' and ''M''
(ii) Write the equation of line LM', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-7444e2-4-2', '7444e2', 11, '4', 'c) The retailer buys a washing machine from a manufacturer for Rs. 50000. He marks the price of the washing machine 40% above his cost price and sells it to a customer at 20% discount on the marked price. If the sales are intra-state and the rate of GST is 12%, find: [4]

(i) The marked price of the washing machine
(ii) The amount of GST paid by the dealer to the state government

retailer', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-7444e2-5-0', '7444e2', 12, '5', 'a) Find the values of constants ''a'' and ''b'' when x - 2 and x + 3 both are the factors of expression $$x^3 + ax^2 + bx - 12$$ [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-7444e2-5-1', '7444e2', 13, '5', 'b) Given that x ∈ I, solve the inequation and graph the solution on the number line:

$$3 \geq \frac{x-4}{2} + \frac{x}{3} \geq 2$$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-7444e2-5-2', '7444e2', 14, '5', 'c) Two identical coins are tossed together. What is the probability of getting:

(i) At least one head
(ii) Exactly one tail
(iii) At least two heads', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-7444e2-9-0', '7444e2', 15, '9', 'a) Find the mean height of plants from the following frequency distribution by short cut method:

| Height (in cm) | 57 | 69 | 73 | 74 | 77 |
| --- | --- | --- | --- | --- | --- |
| Number of plants | 8 | 18 | 41 | 22 | 11 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-7444e2-9-1', '7444e2', 16, '9', 'b) Use ruler and compass for this question:

(i) Draw a circle with centre O and radius 3cm.
(ii) Take a point P which is at a distance of 9cm from the centre.

Draw tangents to the circle from point P.', NULL, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-7444e2-9-2', '7444e2', 17, '9', 'c) In △ABC, ∠B = 90°, AB = 12cm and AC = 15cm.

D and E are points on AB and AC respectively such that ∠AED = 90° and DE = 3cm.

Find the area of △ADE.', NULL, 'Similarity', 'short', 3, '7444e2__Avm_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-7444e2-10-0', '7444e2', 18, '10', 'a) If $$A = \begin{bmatrix} -1 & 1 \\ a & b \end{bmatrix}$$ and $$A^2 = 1$$, find ''a'' and ''b''.', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-7444e2-10-1', '7444e2', 19, '10', 'b) A diameter of sphere is 6cm. It is melted and drawn into a wire of diameter 0.2cm. Find the length of the wire.

[3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-7444e2-10-2', '7444e2', 20, '10', 'b) The sides AB and DC of a cyclic quadrilateral ABCD are produced to meet at P.

The sides AD and BC are produced to meet at Q
If $$\angle ADC = 85^\circ$$ , $$\angle BPC = 40^\circ$$ , calculate:

- (i) $$\angle BAD$$
- (ii) $$\angle DQB$$', NULL, 'Circles', 'short', 4, '7444e2__Avm_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-7444e2-10-3', '7444e2', 21, '10', 'c) If $$\tan \theta + \sec \theta = x$$ , show that $$\sin \theta = \frac{x^2 - 1}{x^2 + 1}$$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-7444e2-6-0', '7444e2', 22, '6', '- a) Solve the quadratic equation : $$2x^2 - 10x = -5$$ correct to 2 decimal places', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-7444e2-6-1', '7444e2', 23, '6', '- b) A solid sphere and hemisphere have the same total surface area. Prove that the ratio of their volume is $$\frac{3\sqrt{3}}{4}$$', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-7444e2-6-2', '7444e2', 24, '6', '- c) An iron tank has length 5m and width 4m, and it contains $$50\text{m}^3$$ of water. A small model tank is made and its volume is $$400\text{m}^3$$ . Find the height of the model tank.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-7444e2-7-0', '7444e2', 25, '7', '- a) The horizontal distance between two trees of different heights is 90m. The angle of depression of the top of the first tree when seen from the top of the second tree is $$30^\circ$$ . If the height of the second tree is 72m, find the height of the first tree to the nearest meter.

[6]', 6, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-7444e2-7-1', '7444e2', 26, '7', 'b) Draw an ogive of the following distribution:

| Class-interval | 30-39 | 40-49 | 50-59 | 60-69 | 70-79 | 80-89 | 90-99 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 20 | 35 | 15 | 40 | 5 | 20 | 10 |

Use the ogive to estimate the following:

- (i) The median
- (ii) The lower quartile
- (iii) The number of variates below 55
- (iv) The number of variates above 75', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-7444e2-8-0', '7444e2', 27, '8', 'Find the equation of a line that has y-intercept 4 and is parallel to the line joining (2, -3) and (4, 2).', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-7444e2-8-1', '7444e2', 28, '8', 'Use ruler and compass only for this question. Draw a circle of radius 4cm and mark two chords AB and AC of the circle of lengths 6cm and 5 cm respectively. [4]

(i) Construct the locus of points, inside the circle that are equidistant from A and C. Prove your construction.
(ii) Construct the locus of points, inside the circle that are equidistant from AB and AC.', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-7444e2-11-0', '7444e2', 29, '11', 'How many terms of the geometric series 1 + 4 + 16 + 64 + ... will make the sum of 5461? [3]', 3, 'Geometric Progression', 'short', 5, NULL, NULL),
  ('MQ-7444e2-11-1', '7444e2', 30, '11', 'In the adjoining figure,

SR is a chord parallel to the diameter PQ of the circle.

If ∠PQR = 58°, calculate:

(i) \(\angle RPQ\)
(ii) \(\angle STP\)

[3]', 3, 'Circles', 'short', 5, '7444e2__Avm_X_Math_p5_img_0_jpeg.webp', NULL),
  ('MQ-7444e2-11-2', '7444e2', 31, '11', 'A journey of 192 km from Mumbai to Pune takes two hours less by a fast train than by a slow train. If the average speed of the slow train is 16km/hr less than that of the fast train, find the average speed of each train. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-bd500d-1-0', 'bd500d', 0, '1', 'i) If $x^2 - 4$ is a factor of polynomial $2x^3 + 2x^2 - 4x - 4$ , then its factors are:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['$(x-2)(x+2)(x+1)$', '$(x-2)(x+2)(x-1)$', '$(x-2)(x-2)(x+1)$', '$(x-2)(x-2)(x-1)$']::text[]),
  ('MQ-bd500d-1-1', 'bd500d', 1, '1', 'ii) A dealer bought an article for ₹8000 and sold it for ₹ 11200 . The GST paid by the dealer to the Government, if the SGST rate is 5% is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹ 280', '₹ 560', '₹ 160', '₹ 320']::text[]),
  ('MQ-bd500d-1-2', 'bd500d', 2, '1', 'iii) If a rectangular sheet having dimensions 22cm X 11cm is rolled along the shorter side to form a cylinder, then the curved surface area of the cylinder is

a) 968cm²

b) 424 cm²

c) 121cm²

• d) 242cm²', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-3', 'bd500d', 3, '1', 'iv) If $$\begin{bmatrix} 2 & x \\ 0 & 1 \end{bmatrix} + 3 \begin{bmatrix} 2 & 1 \\ 4 & 0 \end{bmatrix} = \begin{bmatrix} 8 & 8 \\ 12 & 1 \end{bmatrix}$$ then the value of x is

a) 2

b) 3

c) 4

• d) 5', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-4', 'bd500d', 4, '1', 'v) Cosec A (1 - cos² A)

• a) 1

b) Sin A

c) CosA

d) Tan A', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-5', 'bd500d', 5, '1', 'vi) The roots of the quadratic equation 3kx² - 4kx + 4 = 0 are equal. Then the value of k is

• a) 3

b) 2

c) 1

d) -1', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-6', 'bd500d', 6, '1', 'vii) Which of the following cannot be the probability of an event?

• a) 1.1

b) 0.1

c) 0.9

d) 5%', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-7', 'bd500d', 7, '1', 'viii) The median class for the given distribution is:

| Class interval | 1-5 | 6-10 | 11-15 | 16-20 |
| --- | --- | --- | --- | --- |
| Frequency | 2 | 6 | 11 | 18 |

a) 1-5

b) 6-10

c) 11-15

• d) 16-20', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-bd500d-1-8', 'bd500d', 8, '1', 'ix) ii) in the given figure O is the centre of the incircle of quadrilateral ABCD. If PD = 36cm, CD = 44cm BC = 15cm, find the radius of the circle.', 1, 'Circles', 'MCQ', 3, 'bd500d__Bai_Avabai_p3_img_0_jpeg.webp', array['10cm', '7cm', '8cm', '14cm']::text[]),
  ('MQ-bd500d-1-9', 'bd500d', 9, '1', 'x) Two chords AB and CD of a circle intersect externally at P. if PC = 15cm, CD = 7cm and AP = 12cm, then AB is', 1, 'Circles', 'MCQ', 3, 'bd500d__Bai_Avabai_p3_img_1_jpeg.webp', array['2cm', '4cm', '6cm', '10cm']::text[]),
  ('MQ-bd500d-1-10', 'bd500d', 10, '1', 'xi) The solution set for linear equation $$-8 \leq x - 7 < -4, x \in I$$ is

a { x . x ∈ R , -1 ≤ x < 3 }

b) { 0 , 1 , 2 , 3 }

c) { -1, 0, 1, 2, 3 }

d) { -1 , 0 , 1 , 2 , }', 1, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-bd500d-1-11', 'bd500d', 11, '1', 'xii) The common difference of the AP whose nth term is 8n + 1 is', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['-7', '3', '8', '5']::text[]),
  ('MQ-bd500d-1-12', 'bd500d', 12, '1', 'xiii) If in the figure Δ ADE ~ Δ ABC, find BC', 1, 'Similarity', 'MCQ', 3, 'bd500d__Bai_Avabai_p3_img_2_jpeg.webp', array['4.5cm', '3cm', '3.6cm', '2.4cm']::text[]),
  ('MQ-bd500d-1-13', 'bd500d', 13, '1', 'xiv) If $$\frac{x^3 + 3x}{3x^2 + 1} = \frac{14}{13}$$, then the value of x is', 1, 'Ratio and Proportion', 'MCQ', 4, NULL, array['2', '-1', '4', '3']::text[]),
  ('MQ-bd500d-1-14', 'bd500d', 14, '1', 'xv) The ratio in which x axis divides the line joining (-5, -4) and (-2, 3) is', 1, 'Coordinate Geometry', 'MCQ', 4, NULL, array['4:3', '3:4', '2:5', '5:2']::text[]),
  ('MQ-bd500d-2-0', 'bd500d', 15, '2', 'i) Priyanka has a recurring deposit account of ₹ 800 per month for 21/2 years. If she gets ₹ 2790 as interest at the time of maturity, find [4]

a) the rate of interest
b) the maturity value', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-bd500d-2-1', 'bd500d', 16, '2', 'ii) If b is the mean proportion between a and c, show that: [4]

$$\frac{a^4 + a^2b^2 + b^4}{b^4 + b^2c^2 + c^4} = \frac{a^2}{c^2}$$ [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-bd500d-2-2', 'bd500d', 17, '2', 'iii) Prove that: $$\frac{\cos A}{\text{cosec}A + 1} + \frac{\cos A}{\text{cosec}A - 1} = 2 \tan A$$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-bd500d-3-0', 'bd500d', 18, '3', 'i) The surface area of a solid sphere is 2464cm². It is melted and recast into cones of radius 7cm and height 7cm.Calculate [4]

a) The radius of the sphere
b) The number of cones recast', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-bd500d-3-1', 'bd500d', 19, '3', 'ii) Points A and B have co-ordinates (7, -3) and (1, 9) [4]

a) the slope of AB
b) The equation of perpendicular bisector of AB
c) the value of \( p \) if (-2, p) lies on it.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-bd500d-3-2', 'bd500d', 20, '3', 'Use graph paper for this question. (Take 1cm = 1 unit on both the axis)

[5]

a) Plot the points A (0, 5), B (30), C (1, 0) and D (1, -5)
b) Reflect points B, C and D on the y-axis and write down the coordinates. Name the images as \(B^{1}, C^{1}, D^{1}\) respectively.
c) Name the figure ABCD D1 C1B1
d) Name 2 points which are invariant along y axis', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-bd500d-4-0', 'bd500d', 21, '4', 'i) The following bill shows the GST and Marked price of the articles

[3]

| Articles | Marked price | Discount | GST |
| --- | --- | --- | --- |
| Mobile phone | 15500 | 10% | 5% |
| Watch | 1900 | 0% | 28% |

Find the total bill amount paid by the consumer.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-bd500d-4-1', 'bd500d', 22, '4', 'ii) Solve the following and give your answer correct to 2 significant numbers.

[3]

$$x^2 - 3(x + 3) = 0$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-bd500d-4-2', 'bd500d', 23, '4', 'iii) The daily pocket expense of 200 students is given below. Use a graph paper to draw a histogram and estimate the mode using the graph.

[4]

| Pocket expense | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 | 30-35 | 35-40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 10 | 14 | 28 | 42 | 50 | 30 | 14 | 12 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-bd500d-5-0', 'bd500d', 24, '5', 'i) Given matrix B $$\begin{bmatrix} 1 & 1 \\ 8 & 3 \end{bmatrix}$$. Find the matrix X such that $$X = B^2 - 4B$$. Hence solve for a and b such that $$X \begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} 5 \\ 50 \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-bd500d-5-1', 'bd500d', 25, '5', 'ii) In the given figure AD is the diameter of the circle with centre 0. AD is parallel to BC and ∠CBD=

32°. Find:

a) ∠OBD

b) ∠AOB

c) ∠BED', NULL, 'Circles', 'short', 6, 'bd500d__Bai_Avabai_p6_img_0_jpeg.webp', NULL),
  ('MQ-bd500d-5-2', 'bd500d', 26, '5', 'iii) If 2x³ + ax² + bx - 2 has a factor (x + 2) and leaves remainder 7 when divided by 2x - 3 find the values of a and b.

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 6, NULL, NULL),
  ('MQ-bd500d-6-0', 'bd500d', 27, '6', '√1) In the given diagram, OA = OB, ∠OAB = θ and the line AB passes through point P (-3, 4).

[3]

Find:

(a) Slope and inclination θ of the line AB

(b) Equation of the line AB', 3, 'Coordinate Geometry', 'short', 6, 'bd500d__Bai_Avabai_p6_img_2_jpeg.webp', NULL),
  ('MQ-bd500d-6-1', 'bd500d', 28, '6', '√ii) Prove that (1 + cot A - cosecA) (1 + tanA + SecA) = 2', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-bd500d-6-2', 'bd500d', 29, '6', 'iii) An A.P. consists of 50 terms of which the 3rd term is 12 and the last term is 106. Find

[4]

a) the first term

b) The common difference

c) Sum of the first 50 terms', 4, 'Arithmetic Progression', 'long', 6, NULL, NULL),
  ('MQ-bd500d-7-0', 'bd500d', 30, '7', 'i)) Solve the following inequation, write the solution set and represent it on a number line.

$$-\frac{x}{3} \leq \frac{x}{2} - 1\frac{1}{3} < \frac{1}{6}, \quad x \in \mathbb{R}$$', NULL, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-bd500d-7-1', 'bd500d', 31, '7', 'ii) The weight of 50 apples were recorded as given below. Calculate the mean weight to the nearest

gram using Step Deviation Method.

$$A + \frac{\sum A}{\sum A} xi$$

| Weight ingrams | 80-85 | 85-90 | 90-95 | 95-100 | 100-105 | 105-110 | 110-115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of apples | 5 | 8 | 10 | 12 | 8 | 4 | 3 |', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-bd500d-7-2', 'bd500d', 32, '7', 'iii) In the given figure ABC and CEF are two triangles where BA is parallel to CE and AF: AC = 5 : 8 [4]
a) Prove that \(\Delta ADF \approx \Delta CEF\)
b) Find AD if CE= 6cm 10 cm.
c) If DF is parallel to BC find AD / DB', 4, 'Similarity', 'long', 7, 'bd500d__Bai_Avabai_p7_img_0_jpeg.webp', NULL),
  ('MQ-bd500d-8-0', 'bd500d', 33, '8', 'i) Each of the letters of the word AUTHORIZES is written on identical circular discs and put in a bag. [3] They are well shuffled. If a disc is drawn at random from the bag, what is the probability that the letter is

a) A vowel
b) One of the first 9 letters of the English alphabet which appears in the given word
c) one of the last 9 letters of the English alphabet which appears in the given word?', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-bd500d-8-1', 'bd500d', 34, '8', 'ii) A hemispherical and a conical hole is scooped out of the solid wooden cylinder. Find the volume of [3] the remaining solid where the measurements are as follows.

Height of cylinder is 7cm and radius of cone, sphere and cylinder is 3cm. Height of the cone is 3cm. Give your answer to the nearest whole number using pi as 22/7', 3, 'Mensuration', 'short', 7, 'bd500d__Bai_Avabai_p7_img_1_jpeg.webp', NULL),
  ('MQ-bd500d-8-2', 'bd500d', 35, '8', 'iii) In the figure given below QAP is the tangent at point A and PBD is a straight line. If ∠ ACB = 36° and ∠ APB = 42° find

I. ∠ BAP 36° 78
II. ∠ ABD 78°
III. ∠ QAD 68° 78°
IV. ∠ BCD 66°', NULL, 'Circles', 'short', 8, 'bd500d__Bai_Avabai_p8_img_0_jpeg.webp', NULL),
  ('MQ-bd500d-9-0', 'bd500d', 36, '9', 'i) A two-digit positive number is such that the product of its digit is 6. If 9 is added to the number, the digits interchange their places. Find the number.', NULL, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-bd500d-9-1', 'bd500d', 37, '9', 'ii) The monthly income of a group of 320 employees in a company is given below

| Monthly income in Rs | No of employees |
| --- | --- |
| 6000 - 7000 | 20 |
| 7000 - 8000 | 45 |
| 8000 - 9000 | 65 |
| 9000 - 10000 | 95 |
| 10000 - 11000 | 60 |
| 11000 - 12000 | 30 |
| 12000 - 13000 | 5 |

Draw an ogive taking 2cm = Rs1000 on one axis and 2 cm = 50 employees on the other axis.

From the graph determine

a) The median income.
b) The percentage of employees whose income is below Rs8500.
c) The inter - quartile range of income', NULL, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-bd500d-10-0', 'bd500d', 38, '10', 'i) If $$\frac{x^2 + y^2}{x^2 - y^2} = \frac{17}{8}$$ . Use properties of proportion to find the value of [3]

a) \(x:y\)
b) \(\frac{x^3 + y^3}{x^3 - y^3}\)', 3, 'Ratio and Proportion', 'short', 9, NULL, NULL),
  ('MQ-bd500d-10-1', 'bd500d', 39, '10', 'ii) Construct a triangle ABC with BC = 6.5cm, AB = 5.5cm, AC = 5cm. Construct the incircle of the triangle. Measure and record the radius of the incircle.', NULL, 'Constructions', 'short', 9, NULL, NULL),
  ('MQ-bd500d-10-2', 'bd500d', 40, '10', 'iii) As observed from the top of a 80m tall lighthouse, the angles of depression of two ships on the same side of a lighthouse in horizontal line with its base are \(30^{\circ}\) and \(40^{\circ}\). Find the distance between the two ships. Give your answer to the nearest meter.', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-b389d7-1-0', 'b389d7', 0, '1', 'a) Find matrix X If $$\left[ \begin{array}{cc} 3 & 7 \\ 2 & 4 \end{array} \right] \left[ \begin{array}{cc} 0 & 2 \\ 5 & 3 \end{array} \right] + 2X = \left[ \begin{array}{cc} 1 & -5 \\ -4 & 6 \end{array} \right]$$ [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-b389d7-1-1', 'b389d7', 1, '1', 'b) Solve the following quadratic equation and give your answer correct to 2 decimal places. [3]

$$x^2 - 3(x + 3) = 0$$', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-b389d7-1-2', 'b389d7', 2, '1', 'c) The printed price of an air conditioner is Rs40,000. The wholesaler allows a discount of [4]

10% on it to the shopkeeper. The shopkeeper sells the AC to a customer at the marked price. If GST is charged at the rate of 28%, find

- i) GST paid by the shopkeeper to the government
- ii) Amount paid by the shopkeeper
- iii) Amount paid by the customer', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-b389d7-2-0', 'b389d7', 3, '2', 'a) The fourth term of an A.P. is 11 and the eighth term exceeds twice the fourth term by 5. [3]
Find the A.P. and the sum of 50 terms', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-b389d7-2-1', 'b389d7', 4, '2', 'b) In the given figure AD is the diameter of the circle with centre 0. AD is parallel to BC [3]
and ∠CBD = 32⁰. Find:

i) ∠OBD

ii) ∠AOB

iii) ∠BED', 3, 'Circles', 'short', 2, 'b389d7__Bai_Avabai_p2_img_0_jpeg.webp', NULL),
  ('MQ-b389d7-2-2', 'b389d7', 5, '2', 'c) Three vertices of a parallelogram ABCD taken in order are A (3, 6), B (5, 10) and [4]
C (3, 2), find:

i) The coordinates of vertex D
ii) Equation of side AB', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-b389d7-3-0', 'b389d7', 6, '3', 'a) When the two polynomials x³ - px² + x + 6 and 2x³ - x² - (p + 3)x - 6 are divided by [3]
(x - 3), the remainder is same. Find the value of p.', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-b389d7-3-1', 'b389d7', 7, '3', 'b) Prove that $$\frac{\tan^2\theta}{(\sec\theta - 1)^2} = \frac{1 + \cos\theta}{1 - \cos\theta}$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-b389d7-3-2', 'b389d7', 8, '3', 'c) Plot P (,2,4) and Q (-2,1) and R (5,0) on a graph paper. [4]

i) Reflect P and Q in the line y = 0 to get P¹ and Q¹ and write their coordinates.
ii) Give a geometrical name to the figure PQQ¹P¹R.
iii) Find the area of the figure.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-b389d7-4-0', 'b389d7', 9, '4', 'a) If $$\frac{x}{a} = \frac{y}{b} = \frac{z}{c}$$ show that $$\frac{x^3}{a^3} + \frac{y^3}{b^3} + \frac{z^3}{c^3} = \frac{3xyz}{abc}$$ [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-b389d7-4-1', 'b389d7', 10, '4', 'b) Sonia had a Recurring deposit account in a bank and deposited Rs 600 per month for 2½ years. If the rate of interest was 10% per annum, find the maturity value of this account. [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-b389d7-4-2', 'b389d7', 11, '4', 'c) The mean marks obtained by 50 students in a test is 62.8 where a and b are two missing data. Find a and b. [4]

| Marks | 0-20 | 20 -40 | 40-60 | 60-80 | 80-100 | 100-120 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | a | 10 | b | 7 | 8 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-b389d7-5-0', 'b389d7', 12, '5', 'a) Solve the following inequation, write the solution set and represent it on a number line. [3]

$$\frac{-x}{3} \leq \frac{x}{2} - 1\frac{1}{3} < \frac{1}{6}, \quad x \in R$$', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-b389d7-5-1', 'b389d7', 13, '5', 'b) Prove that $$\frac{1+sinA}{cosecA-cotA} - \frac{1-SinA}{cosecA+cotA} = 2(1+cotA)$$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-b389d7-5-2', 'b389d7', 14, '5', 'c) In the given figure PQRS is a cyclic quadrilateral PQ and SR produced meet at T. [4]

(i) Prove $$\Delta TPS \sim \Delta TRQ$$.
(ii) Find SP if TP = 18cm, RQ = 4 cm and TR = 6cm.
(iii) Find area of quadrilateral PQRS if area of $$\Delta PTS = 27 \text{ cm}^2$$.', 4, 'Similarity', 'long', 3, 'b389d7__Bai_Avabai_p3_img_0_jpeg.webp', NULL),
  ('MQ-b389d7-6-0', 'b389d7', 15, '6', 'a) If $$\frac{x^2 + y^2}{x^2 - y^2} = \frac{17}{8}$$. Use properties of proportion to find the value of [3]

i) x : y

ii) $$\frac{x^3 + y^3}{x^3 - y^3}$$', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-b389d7-6-1', 'b389d7', 16, '6', 'b) Sixteen cards are labelled as a, b, c, ...m, n, o, p. They are put in a box and shuffled. A boy is asked to draw a card from the box. What is the probability that the card drawn is : [3]

i) a vowel

ii) a consonant

iii) none of the letters of the word median', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-b389d7-6-2', 'b389d7', 17, '6', 'c) Given matrix A = $$\begin{bmatrix} 4sin30 & cos0 \\ cos0 & 4sin30 \end{bmatrix}$$ and B = $$\begin{bmatrix} 4 \\ 5 \end{bmatrix}$$ [4]

If AX = B

i) Write the order of matrix X.

ii) Find the matrix X.', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-b389d7-7-0', 'b389d7', 18, '7', 'a) The marks of 10 students of a class in an examination arranged in ascending order is as follows: [3]

13 ,35, 43, 46, x ,x + 4 ,55 ,61 ,71 ,80

If the median marks are 48 ,find the value of x. Hence find the mode of the given data', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-b389d7-7-1', 'b389d7', 19, '7', 'b) Sum of two natural numbers is 8 and the difference of their reciprocal is 2/15. Find the numbers [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-b389d7-7-2', 'b389d7', 20, '7', 'c) A line AB meet X axis at A and y axis at B. P ( 4 , -1 ) divides AB in the ratio 1: 2 [4]

i) Find the co -ordinates of A and B.

ii). Find the equation of a line through P and having the same slope as the line

$$2y = 3x + 5$$', 4, 'Coordinate Geometry', 'long', 4, 'b389d7__Bai_Avabai_p5_img_0_jpeg.webp', NULL),
  ('MQ-b389d7-8-0', 'b389d7', 21, '8', 'a) Using factor theorem show that (x - 3) is a factor of x³ - 7x² + 15x - 9. Hence factorise the expression completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-b389d7-8-1', 'b389d7', 22, '8', 'b) Find the value of k for which the given equation has real and distinct roots. [3]
3x² - 6x + k = 0', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-b389d7-8-2', 'b389d7', 23, '8', 'c) A girl fills a cylindrical bucket 32 cm in height and 18 cm in radius with sand. She empties the bucket on the ground and makes a conical heap of the sand. If the height of the conical heap is 24 cm, find: [4]

i) its radius and

ii) it''s slant height (Give your answer correct to the nearest cm)', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-b389d7-9-0', 'b389d7', 24, '9', 'a) Priyanka has a recurring deposit account of Rs 1000 per month at 10% p per annum. [3]
If she gets Rs 5550 as interest at the time of maturity, find the total time for which the account was held.', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-b389d7-9-1', 'b389d7', 25, '9', 'b) In triangle PQR, PQ = 24cm, QR = 7cm and ∠PQR = 90⁰. Find the radius of the inscribed circle. [3]', 3, 'Circles', 'short', 5, 'b389d7__Bai_Avabai_p5_img_1_jpeg.webp', NULL),
  ('MQ-b389d7-9-2', 'b389d7', 26, '9', 'c) Find the point of intersection of the lines 4x + 3y = 1 and 3x - y + 9 = 0. If this point lies on the line ( 2k - 1 )x - 2y = 4 ; find the value of k [4]', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-b389d7-10-0', 'b389d7', 27, '10', 'a) The monthly income of a group of 320 employees in a company is given below. [6]

| Monthly income in Rs | No of employees |
| --- | --- |
| 6000 - 7000 | 20 |
| 7000 - 8000 | 45 |
| 8000 - 9000 | 65 |
| 9000 - 10000 | 95 |
| 10000 - 11000 | 60 |
| 11000 - 12000 | 30 |
| 12000 - 13000 | 5 |

Draw an ogive taking 2cm = Rs1000 on one axis and 2 cm = 50 employees on the other axis. From the graph determine

i) The median wage.
ii) The number of employees whose income is below Rs8500.
iii) If the salary of the senior employee is above Rs 11500, find the number of senior employees.
iv) The upper quartile.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-b389d7-10-1', 'b389d7', 28, '10', 'b) An aeroplane at an altitude of 250m observes the angle of depression of two boats on the opposite banks of the river to be 45° and 60° respectively. Find the width of the river. Write the answer to the nearest whole number. [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-b389d7-11-0', 'b389d7', 29, '11', 'a) A shopkeeper buys an article from a manufacturer for 12,000 and mark-up it price by 25%. The shopkeeper gives a discount of 10% on the marked up price and he gives a further off season discount of 5% on the balance to a customer of TV .If GST is 12% find :

i) the price paid by the consumer
ii) the amount of SGST paid by the shopkeeper
iii) the amount of tax received by the Central Government', NULL, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-b389d7-11-1', 'b389d7', 30, '11', 'b) Find three numbers in AP whose sum is 24 and whose product is 440. [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-b389d7-11-2', 'b389d7', 31, '11', 'c) In the figure given below O is the centre of the circle and SP is a tangent. [4]

If ∠ SRT = 65⁰ Find the values of x, y and z', 4, 'Circles', 'long', 7, 'b389d7__Bai_Avabai_p7_img_0_jpeg.webp', NULL),
  ('MQ-36ddf3-1-0', '36ddf3', 0, '1', '1) The order of matrix $A = \begin{vmatrix} 2 & 1 & 3 \\ 0 & 5 & 4 \end{vmatrix}$ is ...', 1, 'Matrices', 'MCQ', 1, NULL, array['$1 \times 1$', '$2 \times 2$', '$2 \times 3$', '$4 \times 3$']::text[]),
  ('MQ-36ddf3-1-1', '36ddf3', 1, '1', '2) Find $x$ and $y$ , if $\begin{vmatrix} 3 & -2 \\ -1 & 4 \end{vmatrix} \begin{vmatrix} 2x \\ 1 \end{vmatrix} + 2 \begin{vmatrix} -4 \\ 5 \end{vmatrix} = 4 \begin{vmatrix} 2 \\ y \end{vmatrix}$', 1, 'Matrices', 'MCQ', 1, NULL, array['$x=3, y=2$', '$x=1, y=3$', '$x=-1, y=-1$', '$x=3, y=-2$']::text[]),
  ('MQ-36ddf3-1-2', '36ddf3', 2, '1', '3) In the given figure, $O$ is the centre of the circle and if $\angle OAC = 30^\circ$ , the acute angle between AC and the tangent PQ at C is ...', 1, 'Circles', 'MCQ', 1, '36ddf3__Baldwin_Gi_p1_img_0_jpeg.webp', array['$60^\circ$', '$45^\circ$', '$90^\circ$', '$30^\circ$']::text[]),
  ('MQ-36ddf3-1-3', '36ddf3', 3, '1', '4) If $(x-3)$ is a factor of $x^3 - (2+k)x^2 + 7k$ , then $k = \text{---}$', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['4', '4.5', '5', '5.5']::text[]),
  ('MQ-36ddf3-1-4', '36ddf3', 4, '1', '5) If $2x, x+10, 3x+2$ are in A.P, then $x$ is equal to ---', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['0', '2', '4', '6']::text[]),
  ('MQ-36ddf3-1-5', '36ddf3', 5, '1', '6) If the common difference of an A.P. is 5, then what is $a_{18} - a_{12}$ ?', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['5', '20', '25', '30']::text[]),
  ('MQ-36ddf3-1-6', '36ddf3', 6, '1', '7) The point P(2,4) on reflection in the line y=1 is mapped onto P''. Find the co-ordinates of P''', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2, 2)', '(2, -2)', '(2, -3)', '(-1, 4)']::text[]),
  ('MQ-36ddf3-1-7', '36ddf3', 7, '1', '8) The quadratic equation $$3x^2 - 4\sqrt{3}x + 4 = 0$$ has ---', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['two distinct roots', 'two equal roots', 'no real roots', 'two imaginary roots']::text[]),
  ('MQ-36ddf3-1-8', '36ddf3', 8, '1', '9) The coordinates of the point which is equidistant from the three vertices of $$\triangle AOB$$ (Shown in the given figure) are---', 1, 'Coordinate Geometry', 'MCQ', 2, '36ddf3__Baldwin_Gi_p2_img_0_jpeg.webp', array['(x,y)', '(y,x)', '($$\frac{x}{2}, \frac{y}{2}$$)', '($$\frac{y}{2}, \frac{x}{2}$$)']::text[]),
  ('MQ-36ddf3-1-9', '36ddf3', 9, '1', '10) The equation of the line PQ =---', 1, 'Coordinate Geometry', 'MCQ', 2, '36ddf3__Baldwin_Gi_p2_img_1_jpeg.webp', array['$$y=x+3$$', '$$y=\sqrt{3}x-3$$', '$$y=\frac{1}{\sqrt{3}}x-3$$', '$$y=x-3$$']::text[]),
  ('MQ-36ddf3-1-10', '36ddf3', 10, '1', '11) In $$\triangle DEW$$, AB∥EW. If AD=4cm, DE=12cm and DW=24cm, then the value of DB=---', 1, 'Similarity', 'MCQ', 2, '36ddf3__Baldwin_Gi_p2_img_2_jpeg.webp', array['5', '8', '10', '9']::text[]),
  ('MQ-36ddf3-1-11', '36ddf3', 11, '1', '12) Two chords AB, CD of a circle intersect internally at a point P. If AP=6cm, PB=4cm and PD=3cm. Then PC=---', 1, 'Circles', 'MCQ', 2, NULL, array['8cm', '16cm', '3cm', '4cm']::text[]),
  ('MQ-36ddf3-1-12', '36ddf3', 12, '1', '(13) Twelve solid spheres of the same size are made by melting a solid metallic cylinder of base diameter 2cm and height 16cm. The diameter of each sphere is---', 1, 'Mensuration', 'MCQ', 3, NULL, array['4cm', '3cm', '2cm', '6cm']::text[]),
  ('MQ-36ddf3-1-13', '36ddf3', 13, '1', '14) $$\frac{\tan^2 \theta}{1 + \tan^2 \theta} = \dots$$', 1, 'Trigonometry', 'MCQ', 3, NULL, array['$$2\sin^2 \theta$$', '$$2\cos^2 \theta$$', '$$\sin^2 \theta$$', '$$\cos^2 \theta$$']::text[]),
  ('MQ-36ddf3-1-14', '36ddf3', 14, '1', '15) Identify the correct solution set of the following number line:', 1, 'Linear Inequations', 'MCQ', 3, '36ddf3__Baldwin_Gi_p3_img_0_jpeg.webp', array['$$\{x : x \in R, -1 \leq x \leq 5\}$$', '$$\{-1, 0, 1, 2, 3, 4, 5\}$$', '$$\{0, 1, 2, 3, 4, 5\}$$', '$$\{-1, 0, 1, 2, 3, 4\}$$']::text[]),
  ('MQ-36ddf3-2-0', '36ddf3', 15, '2', 'a) Prove that $$\sqrt{\frac{\sec \theta - 1}{\sec \theta + 1}} = \csc \theta - \cot \theta$$ [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-2-1', '36ddf3', 16, '2', '(b) Harini has a recurring deposit in a bank for 2 years at 6% simple interest. If she gets ₹2400 as the interest at the time of maturity, find: [4]

(i) the monthly instalment.

(ii) the amount of maturity.', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-2-2', '36ddf3', 17, '2', '(c) Using properties of proportion, find the value of $$x \cdot \frac{\sqrt{12x+1} + \sqrt{2x-1}}{\sqrt{12x+1} - \sqrt{2x-1}} = \frac{3}{2}$$ [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-3-0', '36ddf3', 18, '3', '(a) A cylindrical tub, whose diameter is 12cm and height 15cm is full of ice-cream. The whole ice-cream is to be divided among 10 children in equal ice-cream cones, with a conical base surmounted by a hemispherical top. If the height of the conical portion is twice the diameter of the base, find the diameter of the conical part of the ice cream cone. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-3-1', '36ddf3', 19, '3', '(b) The equation of a line is $$3x + 4y - 7 = 0$$, find: [4]

(i) the slope of the line.

(ii) the equation of a line perpendicular to the given line and passing through the intersection of the lines $$x - y + 2 = 0, 3x + y - 10 = 0$$', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-3-2', '36ddf3', 20, '3', '(c) Use a graph sheet for this question. [5]

(a) Plot A(3,2) and B(5,4) on the graph paper. Take 2cm=1 unit on both axis.

P.T.O

(b) Reflect A and B in the x-axis to A'' and B'' respectively. Plot these points also on the same graph paper.

(c) Write down the geometrical name of the figure ABB''A''.

(d) Find the area of the figure ABB''A''.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-36ddf3-4-0', '36ddf3', 21, '4', '(a) A manufacturer sells a T.V. to a dealer for ₹ 18000 and the dealer sells it to a consumer at a profit of ₹1500. If the sales are intrastate and the rate of G.S.T is 12%, Find: [3]

(i) the amount of GST paid by the dealer to the State Government.

(ii) the amount of GST received by the State and central Government.

(iii) the amount that the consumer pays for the TV.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-4-1', '36ddf3', 22, '4', '(b) Solve the inequation $$2x - 5 \leq 5x + 4 < 11$$, where $$x \in I$$. Also, represent the solution set on the number line.', NULL, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-4-2', '36ddf3', 23, '4', '(c) Use the remainder theorem to factorise the following expression $$2x^3 + x^2 - 13x + 6$$ [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-5-0', '36ddf3', 24, '5', '(a) In a flight 600 Km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 Km/h and the time increased by 30 minutes. Find the duration of the flight.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-5-1', '36ddf3', 25, '5', '(b) Given $$A = \begin{bmatrix} P & 0 \\ 0 & 2 \end{bmatrix}$$, $$B = \begin{bmatrix} 0 & -q \\ 1 & 0 \end{bmatrix}$$, $$C = \begin{bmatrix} 2 & -2 \\ 2 & 2 \end{bmatrix}$$ and $$BA = C^2$$, find the values of p and q. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-5-2', '36ddf3', 26, '5', '(c) Solve the following equation and give your answer correct to 3 significant figures: [4]
$$x^2 - 4x + 1 = 0$$', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-36ddf3-6-0', '36ddf3', 27, '6', '(a) Calculate the mean of the following data, using step deviation method: [3]

| Class | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 6 | 10 | 8 | 12 | 4 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-6-1', '36ddf3', 28, '6', '(b) A box contains 90 discs which are numbered from 1 to 90. If one disc is drawn at random from the box, find the probability that it bears [3]

(i) a two-digit number (ii) a perfect square number (iii) a number divisible by 5', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-36ddf3-6-2', '36ddf3', 29, '6', '(c) Find the 50th term and sum of the first 50 terms of the A.P 11,16,21,26--- [4]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-36ddf3-7-0', '36ddf3', 30, '7', '(a) Write down the co-ordinates of the point P that divides the line joining A(-4,1) and B(17,10) in the ratio 1:2, in what ratio does the y-axis divide the line AB? [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-36ddf3-7-1', '36ddf3', 31, '7', '(b) A solid metallic cylinder has a radius of 2cm and 45cm tall. Find the number of metallic spheres of diameter 6cm that can be made by recasting this cylinder. [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-36ddf3-7-2', '36ddf3', 32, '7', '(c) In ΔABC, ∠ABC = ∠DAC. AB = 8cm, AC = 4cm, AD = 5cm. [4]

(i) Prove that ΔACD ~ ΔBCA

(ii) Find BC and CD', 4, 'Similarity', 'long', 5, NULL, NULL),
  ('MQ-36ddf3-8-0', '36ddf3', 33, '8', '(a) Find the third proportional to 5 1/4 and 7. [3]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-36ddf3-8-1', '36ddf3', 34, '8', '(b) AB is the diameter of the circle with centre O as shown in the given figure. APQ and RBQ are straight lines. Find : (i) ∠PRB (ii) ∠PBR (iii) ∠BPR [3]', 3, 'Circles', 'short', 5, '36ddf3__Baldwin_Gi_p5_img_0_jpeg.webp', NULL),
  ('MQ-36ddf3-8-2', '36ddf3', 35, '8', '(c) The marks obtained by 120 students in a test are given below. Draw an ogive for the given distribution on a graph sheet. Using a suitable scale for ogive to estimate the following: [4]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No.of students | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |

(i) the median. (ii) upper quartile (iii) the number of students who obtained more than 75% marks.', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-36ddf3-9-0', '36ddf3', 36, '9', '(a) Draw a line AB = 6 cm. Construct a circle with AB as the diameter. Mark a point P at a distance of 5 cm from the mid-point of AB. construct two tangents from P to the circle with the AB as the diameter. Measure the length of each tangent. [3]', 3, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-36ddf3-9-1', '36ddf3', 37, '9', '(b) A bag contains 12 marbles out of which y are white. [3]

P.T.O

(i) If one marble is drawn at random from the bag, what is the probability that it will be a white marble?

(ii) If 6 more white marbles are put in the bag, the probability of white marble will double that in part, find $y$.', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-36ddf3-9-2', '36ddf3', 38, '9', '(c) In the given figure below, O and P are the centres of two intersecting circles. ABE is a tangent with centre P touching it at point B. $\angle BCD=42^\circ$, find (i) $\angle CBD$ (ii) $\angle DOB$

(iii) $\angle DAB$ (iv) $\angle CDA$', NULL, 'Circles', 'short', 6, '36ddf3__Baldwin_Gi_p6_img_0_jpeg.webp', NULL),
  ('MQ-36ddf3-10-0', '36ddf3', 39, '10', '(a) A hemispherical bowl of internal diameter 36cm contains liquid. This liquid is filled into 72 cylindrical bottles of diameter 6cm. Find the height of each bottle, if 10% liquid is wasted in this transfer.

[3]', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-36ddf3-10-1', '36ddf3', 40, '10', '(b) I.Q of 50 students was recorded as follows :

[3]

| I.Q. score | 80-90 | 90-100 | 100-110 | 110-120 | 120-130 | 130-140 |
| --- | --- | --- | --- | --- | --- | --- |
| NO.of students | 6 | 9 | 16 | 13 | 4 | 2 |

Draw the histogram for the above data and estimate the mode.', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-36ddf3-10-2', '36ddf3', 41, '10', '(c) An aircraft is flying at a constant height with a speed of 360km/h. From a point on the [4] ground, the angle of elevation of the aircraft at an instant was observed to be $45^\circ$. After 20 seconds, the angle elevation was observed to be $30^\circ$. Determine the height at which the aircraft is flying. (use $\sqrt{3}=1.732$)', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-6cadb8-1.1-0', '6cadb8', 0, '1.1', '1. If the lines 2x + 3y = 5 and ax - 6y = 7 are parallel to each other, then the value of a is

a. -1/4 b. 4 c. 1/4 d. -4', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-6cadb8-1.2-0', '6cadb8', 1, '1.2', '2. Which of the following cannot be the probability of an event?

a. 43% b. 2/5 c. 2.7 d. 0.35', 1, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-6cadb8-1.3-0', '6cadb8', 2, '1.3', '3. Point P (x, y) is reflected in the x- axis to P'' (4, -3). The values of x and y are', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['\(x = 4, y = 3\)', '\(x = -4\) \(y = -3\)', '\(x = 4\) \(y = -3\)', '\(x = -4\) \(y = 3\)']::text[]),
  ('MQ-6cadb8-1.4-0', '6cadb8', 3, '1.4', '4. The curved surface area of a cone of radius 2r and slant height 1/2 is

a. πr l b. 2πrl c. 1/2πrl d. πr(r + l)', 1, 'Mensuration', 'short', 1, NULL, NULL),
  ('MQ-6cadb8-1.5-0', '6cadb8', 4, '1.5', '5. The centroid of a triangle whose vertices are (-2, 4) (1, -3) and (4, -4) will be', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['\((0,0)\)', '\((1, - 1)\)', '\((1,0)\)', '\((\frac{7}{3}, \frac{11}{3})\)']::text[]),
  ('MQ-6cadb8-1.6-0', '6cadb8', 5, '1.6', '6. Two chords AB and CD of a circle intersect externally at point P. If PC = 15cm, CD = 7cm and AP = 12cm, then AB is

a. 2cm b. 4cm c. 6cm d. none of these', 1, 'Circles', 'short', 2, '6cadb8__Beacon_Hig_p2_img_0_jpeg.webp', NULL),
  ('MQ-6cadb8-1.7-0', '6cadb8', 6, '1.7', '7. $$\frac{\text{cosec}^2 A}{1 + \cot^2 A} =$$', 1, 'Trigonometry', 'MCQ', 2, NULL, array['0', 'cosec A', '1', 'cot A']::text[]),
  ('MQ-6cadb8-1.8-0', '6cadb8', 7, '1.8', '8. If the length of the shadow of a tower is $$\sqrt{3}$$ times that of its height, then the angle of elevation of the sun is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['15', '30', '45', '60']::text[]),
  ('MQ-6cadb8-1.9-0', '6cadb8', 8, '1.9', '9. Weights of 40 oranges were recorded as below

| limit of class is | Weight | 85 - 90 | 90 - 95 | 95 - 100 | 100- 105 | 105 -110 | The lower the median : |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | No of oranges | 10 | 12 | 12 | 4 | 2 | |
| | a. 85 | b. 90 | c. 95 | d. 100 | | | |', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-6cadb8-1.10-0', '6cadb8', 9, '1.10', '10. In the figure, If O is the centre of the circle, then the value of x is:', 1, 'Circles', 'MCQ', 2, '6cadb8__Beacon_Hig_p2_img_1_jpeg.webp', array['\(55^{\circ}\)', '\(250^{\circ}\)', '\(125^{\circ}\)', '\(70^{\circ}\)']::text[]),
  ('MQ-6cadb8-2-0', '6cadb8', 10, '2', 'a. The mid-point of the line segment joining (2a, 4) and (-2, 2b) is (1, 2a +1). Find the values of a and b.', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-6cadb8-2-1', '6cadb8', 11, '2', 'b. In the given figure, AB is the diameter, \(\angle AOC = 110^{\circ}\)
Find ∠BDC', NULL, 'Circles', 'short', 2, '6cadb8__Beacon_Hig_p3_img_0_jpeg.webp', NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
