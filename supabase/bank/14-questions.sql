set standard_conforming_strings = on;
begin;

-- questions 6001-6500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-09a67e-4-1', '09a67e', 22, '4', 'b) Solve the following inequation and graph the solution on a number line. [3] $$-2\frac{1}{4} \le x + \frac{1}{4} < 4\frac{3}{4}, x \in I.$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-09a67e-4-2', '09a67e', 23, '4', 'c) Find a, b if $$\begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix} \begin{bmatrix} 2a \\ 1 \end{bmatrix} + 2 \begin{bmatrix} -4 \\ 5 \end{bmatrix} = \begin{bmatrix} 8 \\ 4b \end{bmatrix}$$ [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-09a67e-5-0', '09a67e', 24, '5', 'Q5: a) The polynomial $$px^3 - 7x^2 - 7x + 3$$ when dividend by $$2x - 1$$ leaves a remainder $$\frac{-15}{8}$$. Find p. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-09a67e-5-1', '09a67e', 25, '5', 'b) Solve the following quadratic equation $$2x^2 - 12x - 1 = 0$$ and express your answer correct to one significant figure. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-09a67e-5-2', '09a67e', 26, '5', 'c) Find the value of ''x'', if mean of the following distribution is 20. [4]

| X | 15 | 17 | 19 | 20 +x | 23 |
| --- | --- | --- | --- | --- | --- |
| F | 2 | 3 | 4 | 5x | 6 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-09a67e-6-0', '09a67e', 27, '6', 'Q6: a) Identical cards marked with number 2 to 101 are placed in a bag.

One card is drawn at random from this bag. Find the probability that the number on the card is :

i) A perfect square ii) A prime number greater than 50

iii) A number which is neither prime nor composite.', NULL, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-09a67e-6-1', '09a67e', 28, '6', 'b) In $\Delta ABC$, $\angle ABC = 90^{\circ}$ and $BD \perp AC$. Prove $ABD \sim \Delta BCD$. [3]

If AB = 5.7 cm, BD = 3.8 cm and CD = 5.4 cm, Find BC.', 3, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-09a67e-6-2', '09a67e', 29, '6', 'c) Using the properties of proportion, solve for x. [4]

$$\frac{1+x+x^2}{1-x+x^2} = \frac{171(1+x)}{172(1-x)}$$', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-09a67e-7-0', '09a67e', 30, '7', 'Q7: a) If x = 2 is one root of the equation (k - 3) $x^2 - kx - 8 = 0$, find the [3]

value of k. Also, find the other root of the equation.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-09a67e-7-1', '09a67e', 31, '7', 'b) Draw a histogram for the following distribution. [3]

Use it to estimate the mode.

| Classmark | 15 | 25 | 35 | 45 | 55 | 65 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 22 | 33 | 18 | 11 | 7 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-09a67e-7-2', '09a67e', 32, '7', 'c) SGST on an AC is 14% and the price of the AC including GST is [4]

Rs.57,600. What is the i) rate of GST ii) Price of AC before GST

iii) Amount of GST.', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-09a67e-8-0', '09a67e', 33, '8', 'Q8: a) Ajay has a R.D account in a bank and deposits Rs.400 per month. If he receives Rs.10,100 at the time of maturity, find the time for which the account is held if the rate of interest is 5% p.a. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-09a67e-8-1', '09a67e', 34, '8', 'b) The table below shows the marks obtained a group of 200 students in an examination. [6]

| Marks | 0 - 10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 5 | 20 | 30 | 45 | 37 | 26 | 32 |

SVIS (G/K)

(Gr.10 : Math Paper) Page 5/6
c) Draw an Ogive on a graph paper. Use a scale of 2 cm = 10 marks on x-axis and 2 cm = 20 students on y – axis and estimate the following values.

- i) Median marks
- ii) Lower quartile
- iii) Find the number of students getting more than 72 marks.
- iv) Find number of students scoring less than 40%.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-09a67e-9-0', '09a67e', 35, '9', '**Q9:** a) If $A = \begin{bmatrix} 2 & -3 \\ a & b \end{bmatrix}$ find a and b so that $A^2 = I$ [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-09a67e-9-1', '09a67e', 36, '9', 'b) Three numbers are in continued proportion. If the middle number is 18 and the sum of first and last is 39, find the numbers. [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-09a67e-9-2', '09a67e', 37, '9', 'c) In the circle with centre O, Chords AB and CD intersect externally at P and PT is a tangent to the circle at T. If PB = 12 cm, AB = 15 cm and DP = 6 cm, find the lengths of : i) PT ii) Radius [4]', 4, 'Circles', 'long', 6, '09a67e__Svis_S01_X_p6_img_0_jpeg.webp', NULL),
  ('MQ-09a67e-10-0', '09a67e', 38, '10', '**Q10:** a) A cylindrical can of radius 9 cm and height 12 cm is full of ice-cream. The can was emptied completely when each child who attended a party was given a cone full of ice-cream with a hemispherical topping. How many children attended the party, if the base radius of the cone is 3 cm and height is 6 cm. [3]', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-09a67e-10-1', '09a67e', 39, '10', 'b) Construct a triangle ABC in which AB = 4.5 cm, BC = 7 cm and median AM = 4 cm. Circumscribe a circle and record its radius. [3]', 3, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-09a67e-10-2', '09a67e', 40, '10', 'c) A passenger train covers a distance of 360 Km at a certain speed. An express train which is 8 Km/hr. faster covers the same distance in 1 hour 30 minutes less. Find the speed of the express train. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-b2b549-1-0', 'b2b549', 0, '1', '1) The median of the given frequency distribution is found graphically with the help of

a) Histogram b) Frequency curve c) Frequency polygon d) Ogive', 1, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-b2b549-1-12', 'b2b549', 1, '1', '13) If replacement set is the set of whole numbers, the solution set of the inequation
$$5x + 4 \le 24$$ is', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['$$\{1,2,3,4\}$$', '$$\{---,-2,-1,0,1,2,3,4\}$$', '$$\{4,5,6\}$$', '$$\{0,1,2,3,4\}$$']::text[]),
  ('MQ-b2b549-1-13', 'b2b549', 2, '1', '14) If $$M \times \left[ \begin{array}{c} 2 \\ -p \end{array} \right] = \left[ \begin{array}{c} 5 \\ 0 \end{array} \right]$$, find order of matrix M.', 1, 'Matrices', 'MCQ', 3, NULL, array['$$2 \times 1$$', '$$1 \times 2$$', '$$2 \times 2$$', '$$1 \times 1$$']::text[]),
  ('MQ-2a358e-1-0', '2a358e', 0, '1', 'i) A retailer purchases a fan for Rs.1500 from a wholesaler and sells it to a consumer at 10%
profit if the sales are intra-state and the rate of GST is 12% then find the selling price of the fan
by the retailer (excluding tax) is?', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs.1500', 'Rs. 1650', 'Rs. 1848', 'Rs. 1800']::text[]),
  ('MQ-2a358e-1-1', '2a358e', 1, '1', 'ii) Mr. John has a cumulative bank account and deposits Rs.600 per month for a period of 4 years.
If he gets Rs. 5880 as interest at the time of maturity, find the rate of interest:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['11', '10.5', '10', '11.5']::text[]),
  ('MQ-2a358e-1-2', '2a358e', 2, '1', 'iii) Find the mean proportion of (a - b) and (a³ - a²b) if, a > b.', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['a(b - a)', 'a(a - b)', '-a(a - b)', 'a(-a - b)']::text[]),
  ('MQ-2a358e-1-3', '2a358e', 3, '1', 'iv) Solution set of the inequations, 3x-11<3 where x ε (1, 2, 3---10) is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{-1,2,3,4}', '{1,-2,3,4}', '{1,2,-3,4}', '{1,2,3,4}']::text[]),
  ('MQ-2a358e-1-4', '2a358e', 4, '1', 'v) Which of the following is not a quadratic equation:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['x² + 3x - 5 = 0', 'x² + x³ + 2 = 0', '3 + x + x² = 0', 'x² - 9 = 0']::text[]),
  ('MQ-2a358e-1-5', '2a358e', 5, '1', 'vi) Sum of two natural numbers is 8 and difference of their reciprocals is 2/15. Find the numbers.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['2 and 3', '3 and 5', '3 and 4', '3 and 1']::text[]),
  ('MQ-2a358e-1-6', '2a358e', 6, '1', 'vii) Quantities a, 2, 10 and b are the continued proportion. Find the values of a and b.', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['0.5 and 20', '2 and 10', '0.4 and 50', '0.3 and 30']::text[]),
  ('MQ-2a358e-1-7', '2a358e', 7, '1', 'viii) The following numbers k+3, k+2, 3k-7 and 2k-3 are in proportion. Find the value of k.', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['k = 5 or k = -1', 'k = -5 or k = 1', 'k = 5 or k = 1', 'k = -5 or k = -1']::text[]),
  ('MQ-2a358e-1-8', '2a358e', 8, '1', 'ix) In a single throw of a dice, find the probability of getting a number less than 7.', 1, 'Probability', 'MCQ', 2, NULL, array['6', '5', '1', '3']::text[]),
  ('MQ-2a358e-1-9', '2a358e', 9, '1', 'x) The slope of a line parallel to Y-axis is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['0', '1', '-1', 'not defined']::text[]),
  ('MQ-2a358e-1-10', '2a358e', 10, '1', 'xi) One card is drawn from a well shuffled deck of 52 playing cards. The Probability of getting a non- face card is', 1, 'Probability', 'MCQ', 2, NULL, array['3/13', '10/13', '7/13', '4/13']::text[]),
  ('MQ-2a358e-1-11', '2a358e', 11, '1', 'xii) The slope of the line passing through the points (3,-2) and (-7,-2) is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['0', '1', '-1/10', 'not defined']::text[]),
  ('MQ-2a358e-1-12', '2a358e', 12, '1', 'xiii) The reflection of the point (-3, 0) in the origin is the point:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(0,-3)', '(0,3)', '(3,0)', '(3,3)']::text[]),
  ('MQ-2a358e-1-13', '2a358e', 13, '1', 'xiv) If the end points of a diameter of a circle are A(-2,3) and B(4,-5), then the coordinates of its center are

a) (2,-2)

c) (-1, 1)

b) (1,-1)

d) (-2, 2)', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-2a358e-1-14', '2a358e', 14, '1', 'xv) If the image of the point P under reflection in the X-axis is (-3, 2) then the coordinates of the point P are:

a) (3,2)

c) (3,-2)

b) (-3,-2)

d) (-3, 0)', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-2a358e-2-0', '2a358e', 15, '2', 'i) A straight line passes through the points P(-1,4) and Q(5,-2). It intersects the co-ordinate axes at points A and B. M is mid-point of the segment AB. Find : [4]
a) the co-ordinates of M.
b) the coordinates of A and B.
c) the equation of the line.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-2a358e-2-1', '2a358e', 16, '2', 'ii) National Trading Company, Meerut (UP) made the supply of the following goods/services to Samarth Traders, Noida (UP). Find the total amount of bill if the rate of GST = 12% . [4]

| Quantity (no. of pieces) | 20 | 30 | 12 | 40 |
| --- | --- | --- | --- | --- |
| MRP (in ₹. per piece) | 225 | 320 | 300 | 250 |
| Discount % | 40 | 30 | 50 | 40 |', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-2a358e-2-2', '2a358e', 17, '2', 'iii) Find the values of x, which satisfy the inequation $$-2\frac{5}{6} < \frac{1}{2} - \frac{2x}{3} \le 2$$ , $$x \in W$$. Graph the solution set on the number line. [4]', 4, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-2a358e-3-0', '2a358e', 18, '3', 'i) In what ratio is the line joining P(5, 3) and Q(-5, 3) divided by the y-axis? Also find the coordinates of the point of intersection. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-2a358e-3-1', '2a358e', 19, '3', 'ii) An aeroplane travelled a distance of 400 km at an average speed of x km/hr. On the return journey, the speed was increased by 40 km/hr. Write down an expression for the time taken for :

a) the onward journey;
b) the return journey.

If the return journey took 30 minutes less than the onward journey, write down an equation in x and find its value. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-2a358e-3-2', '2a358e', 20, '3', 'a) Rama opened a recurring deposit account in a bank and deposited ₹ 800 per month for $$1\frac{1}{2}$$ years. If he received ₹ 15,084 at the time of maturity, find the rate of interest per annum. [2]', 2, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-2a358e-3-3', '2a358e', 21, '3', 'b) Radha deposited ₹ 200 per month for 36 months in a bank''s recurring deposit account. If the bank pays interest at the rate of 11 % per annum, find the amount she gets on maturity.

[3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-2a358e-4-0', '2a358e', 22, '4', 'i) If $$\frac{5x+3y}{5x-3y} = \frac{7}{3}$$, find the value [3]

a) $$\frac{x}{y}$$ and b) $$\frac{3x^2 + 2y^2}{3x^2 - 2y^2}$$', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-2a358e-4-1', '2a358e', 23, '4', 'ii) Solve by using the quadratic formula: $$x^2 - 4x + 1 = 0$$. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-2a358e-4-2', '2a358e', 24, '4', 'iii) A box contains 7 blue, 8 white and 5 black marbles. If a marble is drawn at random from the box, what is the probability that it will be

a) Black b) Blue or Black c) Not Black d) Green [4]', 4, 'Probability', 'long', 4, NULL, NULL),
  ('MQ-2a358e-5-0', '2a358e', 25, '5', 'i) a) The image of a triangle after reflecting in y-axis is A''(16,9) B''(5,-2), C''(-4,3). Find the pre-image. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-2a358e-5-1', '2a358e', 26, '5', 'b) Solve : $$x + 1 \geq 3$$. Represent the solution set of inequation on the number line.', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-2a358e-5-2', '2a358e', 27, '5', 'ii) Find the equation of a straight line with slope –2 and which intersects x- axis at a distance of 3 units to the left of origin. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-2a358e-5-3', '2a358e', 28, '5', 'iii) Ahmed has a recurring deposit account in a bank. He deposits Rs. 2500 per month for 2 years. If he get Rs. 66250 at the time of maturity, Find a) the interest paid by the bank. b) the rate of interest. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-2a358e-6-0', '2a358e', 29, '6', 'i) Calculate the ratio in which the line joining A(–4,2) and B(3,6) is divided by point P(x,3). Also find (i) x (ii) Length of AP. [3]', 3, 'Coordinate Geometry', 'short', 4, '2a358e__Thakur_Int_p4_img_0_jpeg.webp', NULL),
  ('MQ-2a358e-6-1', '2a358e', 30, '6', 'ii) What least number must be added to each of the numbers 6, 15, 20 and 43 to make them proportional? [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-2a358e-6-2', '2a358e', 31, '6', 'a) Find the value of ''p'' if the following quadratic equation have equal roots:
$$4x^2 - (p - 2)x + 1 = 0$$

[4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-2a358e-6-3', '2a358e', 32, '6', 'b) Find the discriminant of the quadratic equation $$4x^2 - 12x + 9 = 0$$ and hence find the nature of the roots.', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-2a358e-7-0', '2a358e', 33, '7', 'i) The marked price of an article Rs. 9000 and rate of GST on it 18%. A shopkeeper buys this article at a reduced price and sells it at its market price. If the shopkeeper paid Rs.162 as CGST to the government, find the amount (inclusive of GST) paid by the shopkeeper. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-2a358e-7-1', '2a358e', 34, '7', 'ii) In a single throw of a dice, find the probability of getting a number:

a) greater than 2 b) less than or equal to 2 c) Not greater than 2 [3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-2a358e-7-2', '2a358e', 35, '7', 'iii) The speed of the boat in still water is 15 km/hr. It can go 30 km upstream and return downstream to the original point in 4 hours 30 minutes. Find the speed of the stream. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-2a358e-8-0', '2a358e', 36, '8', 'i) Given a line segment AB joining the points A(-4,6) and B(8,-3). Find: [3]

a) the ratio in which AB is divided by the y-axis.
b) find the coordinates of the point of intersection.
c) the length of AB', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-2a358e-8-1', '2a358e', 37, '8', 'ii) Find the value of ''a'' for which the points A(a, 3), B(2,1) and C(5,a) are collinear.

Hence, find the equation of the line. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-2a358e-8-2', '2a358e', 38, '8', 'iii) $$x^2 - 18x + 77 = 0$$ a) Solve $$x^2 - 4x + 1 = 0$$ by using formula. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-2a358e-8-3', '2a358e', 39, '8', 'b) If 3 and -3 are the solutions of equation $$ax^2 + bx - 9 = 0$$. find the values of a and b.', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-2a358e-9-0', '2a358e', 40, '9', 'i) Mohit, Rajiv and Geeta live in the same city. Mohit sells an article to Rajiv for Rs.50,000 and Rajiv sells the same article to Geeta at a profit of Rs. 6,000. If all the transactions are under GST system at the rate of 12%; Find:

a) The state government tax (SGST) paid by Rajiv.
b) The total tax received by the central-government (CGST).
c) How much Geeta paid for the article? [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-2a358e-9-1', '2a358e', 41, '9', 'ii) Given : $$P = \{x : 5 < 2x - 1 \le 11, x \in R\}$$

$$Q = \{x : -1 \le 3 + 4x < 23, x \in I\}$$

Where R = {real number} and I = {integers}

Represent P and Q on two different number lines. Write down the elements of P ∩ Q. [3]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-2a358e-9-2', '2a358e', 42, '9', 'iii) Use a graph paper for this question. (Take two divisions=1 unit on both the axis). Plot the point P(3,2) and Q(-3,-2). From P and Q draw perpendiculars PM and QN on the x-axis

a) Write the Coordinates of points M and N.
b) Name the image of P on reflection in the origin.
c) Assign the special name to the geometrical figure PMQN and find its area. [4]', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-2a358e-10-0', '2a358e', 43, '10', 'i) A game of numbers has cards marked with 11,12,13,...40. A card is drawn at random. Find the Probability that the number on the card drawn is : [3]

a) a perfect square
b) divisible by 7', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-2a358e-10-1', '2a358e', 44, '10', 'ii) Using componendo and dividendo, find the value of x, given [3]

$$\frac{\sqrt{3x+4} + \sqrt{3x-5}}{\sqrt{3x+4} - \sqrt{3x-5}} = 9$$', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-2a358e-10-2', '2a358e', 45, '10', 'iii) The point P (3, 4) is reflected to P'' in the x-axis; and O'' is the image of O (the origin) when reflected the line PP''. Using graph paper, give:

a) The co-ordinates of \(\mathbf{P}''\) and \(\mathrm{O}''\).
b) The lengths of the segments \(\mathrm{PP}''\) and \(\mathrm{OO}''\).
c) The perimeter of the quadrilateral \(\mathrm{POP''O''}\).
d) The geometrical name of the figure \(\mathrm{POP''O''}\). [4]', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-99a35e-1-0', '99a35e', 0, '1', '(i) The amplitude of the complex number $$-\frac{2}{1+i\sqrt{3}}$$ is given by [1]', 1, NULL, 'MCQ', 1, NULL, array['$$\frac{\pi}{4}$$', '$$\frac{\pi}{3}$$', '$$\frac{2\pi}{3}$$', '$$-\frac{2\pi}{3}$$']::text[]),
  ('MQ-99a35e-1-1', '99a35e', 1, '1', '(ii) The equation of the diameter of the circle $x^2 + y^2 - 6x + 2y = 0$, which passes through the origin, is given by', 1, 'Circles', 'MCQ', 2, NULL, array['$y + 3x = 0$', '$x - 3y = 0$', '$x + 3y = 0$', '$y - 3x = 0$']::text[]),
  ('MQ-99a35e-1-2', '99a35e', 2, '1', '(iii) The coefficient of $x^{11}$ in the expansion of $(2x^2 + x - 3)^6$ is given by', 1, NULL, 'MCQ', 2, NULL, array['186', '190', '192', '196']::text[]),
  ('MQ-99a35e-1-3', '99a35e', 3, '1', '(iv) Assertion : Two finite sets A and B have $m$ and $n$ elements respectively. If the ratio of the cardinal number of the power set of the set B to the power set of the set A is 128: 1, and $m + n = 15$, then $m = 4, n = 11$.
Reason : Number of elements present in the power set of a set is the square of the number of elements present in that set itself.', 1, NULL, 'MCQ', 2, NULL, array['Assertion is correct, Reason is correct, Reason is the correct explanation of Assertion', 'Assertion is correct, Reason is correct, Reason is not the correct explanation of Assertion', 'Assertion is correct, but Reason is incorrect', 'Reason is correct, but Assertion is incorrect']::text[]),
  ('MQ-99a35e-1-4', '99a35e', 4, '1', '(v) The coordinates of the foot of the perpendicular from the point $(2, 3)$ on the straight line $x + y - 11 = 0$, is given by', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(-6, 5)$', '$(5, 6)$', '$(-5, 6)$', '$(6, 5)$']::text[]),
  ('MQ-99a35e-1-5', '99a35e', 5, '1', '(vi) If $f(x) = \cos^2 x + \sec^2 x$, then', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$f(x) < 1$', '$f(x) = 1$', '$1 < f(x) < 2$', '$f(x) \geq 2$']::text[]),
  ('MQ-99a35e-1-6', '99a35e', 6, '1', '(vii) Statement 1 : The eccentricity of a conic is a constant ratio that measures how much the conic deviates from being a perfect circle.
Statement 2 : The eccentricity of a rectangular hyperbola is greater than 1.', 1, NULL, 'MCQ', 2, NULL, array['Both the Statements 1 and 2 are correct', 'Statement 1 is correct, but Statement 2 is incorrect', 'Statement 2 is correct, but Statement 1 is incorrect', 'Both the Statements 1 and 2 are incorrect']::text[]),
  ('MQ-99a35e-1-7', '99a35e', 7, '1', '(viii) Statement 1: If $f(x) = 2x^2 + 3x - 5$, then $f''(0) - 3f''(-1) = 0$.
Statement 2: $\frac{d}{dx}[f(x) \pm g(x)] = \frac{d}{dx}[f(x)] \pm \frac{d}{dx}[g(x)]$. [1]', 1, NULL, 'MCQ', 3, NULL, array['Both the Statements are correct', 'Both the Statements are incorrect', 'Statement 1 is correct, Statement 2 is incorrect', 'Statement 1 is incorrect, Statement 2 is correct']::text[]),
  ('MQ-99a35e-1-8', '99a35e', 8, '1', '(ix) The mean of 100 observations is 50, and their standard deviation is 5. The sum of the squares of all the observations is [1]', 1, 'Statistics', 'MCQ', 3, NULL, array['50000', '250000', '252500', '255000']::text[]),
  ('MQ-99a35e-1-9', '99a35e', 9, '1', '(x) Assertion: $\lim_{x \to 5} \frac{x^n - 5^n}{x - 5} = 500$, where $n$ is a natural number, then $n = 4$.
Reason: $\lim_{x \to a} f(x)g(x) = \lim_{x \to a} f(x) \lim_{x \to a} g(x)$. [1]', 1, 'Statistics', 'MCQ', 3, NULL, array['Assertion is correct, Reason is correct, Reason is the correct explanation of Assertion', 'Assertion is correct, Reason is correct, Reason is not the correct explanation of Assertion', 'Assertion is correct, Reason is incorrect', 'Assertion is incorrect, Reason is correct']::text[]),
  ('MQ-99a35e-1-10', '99a35e', 10, '1', '(xi) A geometric progression consists of 200 terms. If the sum of the odd terms of the geometric progression is $m$, and the sum of the even terms is $n$, then the common ratio of the geometric progression is [1]', 1, 'Geometric Progression', 'MCQ', 3, NULL, array['$\frac{m}{n}$', '$\frac{n}{m}$', '$m + \frac{n}{m}$', '$n + \frac{m}{n}$']::text[]),
  ('MQ-99a35e-1-11', '99a35e', 11, '1', '(xii) The number of straight lines passing through the origin, which are equally inclined to both the axes is [1]', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['4', '3', '2', '1']::text[]),
  ('MQ-99a35e-1-12', '99a35e', 12, '1', '(xiii) There are 10 lamps in an auditorium. Each one of them can be switched on independently. Find the number of ways the auditorium can be illuminated. [1]', 1, NULL, 'MCQ', 3, NULL, array['$2^{10}$', '$2^{10} - 1$', '$10^2$', '$10^2 - 1$']::text[]),
  ('MQ-99a35e-1-13', '99a35e', 13, '1', '(xiv) Find the equation of the hyperbola whose eccentricity is $\frac{4}{3}$, and the coordinates of it''s vertices are $(\pm 7, 0)$. [1]', 1, NULL, 'MCQ', 4, NULL, array['$7x^2 - 9y^2 = 343$', '$9x^2 - 7y^2 = 343$', '$7x^2 + 9y^2 = 343$', '$9x^2 + 7y^2 = 343$']::text[]),
  ('MQ-99a35e-1-14', '99a35e', 14, '1', '(xv) Limit of a function $f(x)$ exists at the point $x = c$, if [1]', 1, NULL, 'MCQ', 4, NULL, array['the right hand limit exists at \( x = c \), and is equal to \( f(c) \)', 'the left hand limit exists at \( x = c \), and is equal to \( f(c) \)', '\( f(x) \) is differentiable at \( x = c \)', 'both the right hand limit and the left hand limit exists at \( x = c \), and are equal']::text[]),
  ('MQ-99a35e-1-15', '99a35e', 15, '1', '(xvi) Three numbers are chosen at random from the first 20 natural numbers. Find the probability that the numbers are not consecutive. [1]', 1, 'Probability', 'MCQ', 4, NULL, array['$\frac{187}{190}$', '$\frac{93}{95}$', '$\frac{94}{95}$', '$\frac{3}{190}$']::text[]),
  ('MQ-99a35e-1-16', '99a35e', 16, '1', '(xvii) L is the foot of the perpendicular drawn from a point P(3, 4, 5), on the xy plane. Find the coordinates of the point L. [1]', 1, 'Probability', 'MCQ', 4, NULL, array['(3, 0, 0)', '(0, 4, 5)', '(3, 4, 0)', '(3, 0, 5)']::text[]),
  ('MQ-99a35e-1-17', '99a35e', 17, '1', '(xviii) Find the domain and range of the function $f(x) = \frac{|x-a|}{x-a}$, where $a$ is a constant. [1]', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-99a35e-1-18', '99a35e', 18, '1', '(xix) Find the number of words, with or without meaning, that can be formed with the letters of the word ''EQUATION'' so that the vowels always occur together. [1]', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-99a35e-1-19', '99a35e', 19, '1', '(xx)

State whether the diagram represented above depicts a function or not. Give appropriate reasons in support of your answer.', 1, NULL, 'short', 4, '99a35e__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-99a35e-2-0', '99a35e', 20, '2', 'Determine the domain and the range of the function $$f(x) = \frac{1}{\sqrt{4+3\sin x}}$$.', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-99a35e-3-0', '99a35e', 21, '3', 'Show that, if $$p, q, r$$ and $$s$$ are real numbers such that, $$pr = 2(q + s)$$, then at least one of the equations $$x^2 + px + q = 0$$, and $$x^2 + rx + s = 0$$ has real roots.', 2, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-99a35e-4-0', '99a35e', 22, '4', 'If $$f(x) = \frac{x}{3+\tan x}$$, then find $$f''\left(\frac{\pi}{4}\right)$$.', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-99a35e-5-0', '99a35e', 23, '5', '(i) Find $$k$$, if the coefficients of $$x^2$$ and $$x^3$$ in the expansion of $$(3 + kx)^9$$ are equal.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-99a35e-5-1', '99a35e', 24, '5', '(ii) If the coefficients of the middle terms in the expansions of $$(1 + mx)^4$$, and $$(1 - mx)^6$$ are equal, then find the value of $$m$$.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-99a35e-6-0', '99a35e', 25, '6', '(i) Evaluate the limit $$\lim_{x \to 0} \frac{\sqrt{1+x}-1}{\log(1+x)}$$.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-99a35e-6-1', '99a35e', 26, '6', '(ii) Evaluate the limit $$\lim_{x \to 0} x \sin\left(\frac{1}{x}\right)$$.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-99a35e-7-0', '99a35e', 27, '7', '(i) The Cartesian product of the set A with itself has 9 elements, among which, two elements are $$(-1, 0)$$, and $$(0, 1)$$. Find the set A, and state the cardinality of A.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-99a35e-7-1', '99a35e', 28, '7', '(ii) If the power sets of two sets A and B are equal, then prove that the sets A and B are also equal.', 2, NULL, 'short', 6, NULL, NULL),
  ('MQ-99a35e-8-0', '99a35e', 29, '8', 'Two real numbers, $x$ and $y$, are chosen from the interval $[0, 2]$. Determine the probability that the real numbers $x$ and $y$ satisfy $x^2 + y^2 \leq 1$.', 2, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-99a35e-9-0', '99a35e', 30, '9', 'Show that the centroid of a triangle formed by joining the midpoints of it''s sides is the same as the centroid of the triangle itself. Hence, find the centroid of a triangle, the midpoints of whose sides are D(1, 2, -3), E(3, 0, 1), and F(-1, 1, -4).', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-99a35e-10-0', '99a35e', 31, '10', 'The roots of the quadratic equation $px^2 - 2(p + 2)x + 3p = 0$ differ by 2. Find $p$. Hence, find the roots of the quadratic equation.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-99a35e-11-0', '99a35e', 32, '11', 'Find the equation of the circle passing through the points (2, 3) and (-1, 1), and whose centre lies on the straight line $x - 3y - 11 = 0$.', 3, 'Circles', 'short', 6, NULL, NULL),
  ('MQ-99a35e-12-0', '99a35e', 33, '12', 'A society planned to organise a mixed doubles lawn tennis tournament. 7 married couples registered for the tournament. Find the number of ways the matches can be arranged, such that no husband and wife pair are included in the same match.', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-99a35e-13-0', '99a35e', 34, '13', '(i) If $z$ is a complex number, and $iz^3 + z^2 - z + i = 0$, then find the modulus of $z$.', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-99a35e-13-1', '99a35e', 35, '13', '(ii) If $a + ib = \frac{(x+i)^2}{2x-i}$, then prove that, $a^2 + b^2 = \frac{(x^2+1)^2}{4x^2+1}$.', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-99a35e-14-0', '99a35e', 36, '14', '(i) A, B and C are three mutually exclusive and exhaustive events of a random experiment. Given that, thrice the probability of event A is equal to the probability of the event C, which is again equal to twice the probability of the event B. Find the individual probabilities.', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-99a35e-14-1', '99a35e', 37, '14', '(ii) The following table shows the values of the differentiable functions $u(x)$ and $v(x)$, alongwith their derivatives.
| x | u(x) | u''(x) | v(x) | v''(x) |
| --- | --- | --- | --- | --- |
| 1 | 4 | 1 | 3 | 1 |
| 2 | 3 | 2 | 2 | 8 |
| 3 | 6 | 1 | 7 | 2 |
| 4 | 1 | 3 | 6 | 1 |
If the function $f(x)$ is defined as $f(x) = u(x)v(x)$, then determine the value of $f''(3)$.', 3, NULL, 'short', 7, NULL, NULL),
  ('MQ-99a35e-15-0', '99a35e', 38, '15', '(i) If $x + y = z$, and $\tan x = k \tan y$, then prove that, $\sin z = \frac{k+1}{k-1} \sin(x - y)$.', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-99a35e-15-1', '99a35e', 39, '15', '(ii) Prove that, $\tan \left(\frac{\pi}{3} - x\right) \tan x \tan \left(\frac{\pi}{3} + x\right) = \tan 3x$.', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-99a35e-16-0', '99a35e', 40, '16', '(i) Find the equation of the ellipse with eccentricity $\frac{3}{4}$, foci on the $y$ axis, centre at the origin, and passing through the point $(6, 4)$. Find the coordinates of the vertices of the ellipse, and the equations of it''s directrices.', 5, NULL, 'long', 7, NULL, NULL),
  ('MQ-99a35e-16-1', '99a35e', 41, '16', '(ii) The towers of a suspension bridge, hung in the form of a parabola, have their tops 30 metres above the roadway and are 200 metres apart. If the cable (lowest point of the bridge) is 5 metres above the roadway at the centre of the bridge, find the length of the vertical supporting pillar 30 metres from the centre.', 5, NULL, 'long', 7, NULL, NULL),
  ('MQ-99a35e-17-0', '99a35e', 42, '17', '(i) For the word ''EXAMINATION'', determine the number of combinations of four letters, and the number of permutations of four letters.', 5, NULL, 'long', 8, NULL, NULL),
  ('MQ-99a35e-17-1', '99a35e', 43, '17', '(ii) A man has 7 relatives, 4 of them are ladies, and 3 are gentlemen. His wife also has 7 relatives, 3 of them are ladies, and 4 are gentlemen. Find the number of ways they can invite their relatives to a dinner party which has 3 ladies and 3 gentlemen, so that there are 3 of the man''s relatives, and 3 of the wife''s relatives.', 5, NULL, 'long', 8, NULL, NULL),
  ('MQ-99a35e-18-0', '99a35e', 44, '18', 'Find the derivative of the function $f(x) = \sqrt{\tan x}$ by using first principle.', 5, NULL, 'long', 8, NULL, NULL),
  ('MQ-99a35e-19-0', '99a35e', 45, '19', 'Prove that, $\tan x \tan \left(x + \frac{\pi}{3}\right) + \tan \left(x + \frac{\pi}{3}\right) \tan \left(x - \frac{\pi}{3}\right) + \tan \left(x - \frac{\pi}{3}\right) \tan x = -3$.', 5, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-99a35e-20-0', '99a35e', 46, '20', 'Find the mean, variance, and standard deviation for the following set of observations.
| Classes | 33 - 36 | 37 - 40 | 41 - 44 | 45 - 48 | 49 - 52 |
| --- | --- | --- | --- | --- | --- |
| Frequencies | 15 | 17 | 21 | 22 | 25 |', 5, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-268a6e-1-0', '268a6e', 0, '1', '(a) Find the value of ‘k’ if $4x^3 - 2x^2 + kx + 5$ leaves remainder -10 when divided by $2x + 1$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-268a6e-1-1', '268a6e', 1, '1', '(b) Amit deposits ₹ 1600 per month in a bank for 18 months in a recurring deposit account. If he gets ₹ 31,080 at the time of maturity, what is the rate of interest per annum? [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-268a6e-1-2', '268a6e', 2, '1', '(c) A shopkeeper bought an article with market price ₹ 1200 from the wholesaler at a discount of 10%. The shopkeeper sells this article to the customer on the market price printed on it. If the rate of GST is 6%, then find:

(i) GST paid by the wholesaler.

(ii) Amount paid by the customer to buy the item. [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-268a6e-2-0', '268a6e', 3, '2', '(a) Solve the following inequation and represent your solution on the real number line:

$$- 5 \frac { 1 } { 2 } - x \leq \frac { 1 } { 2 } - 3 x \leq 3 \frac { 1 } { 2 } - x , \ x \in R$$ [3]', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-268a6e-2-1', '268a6e', 4, '2', '(b) Find the 16th term of the A.P. 7, 11, 15, 19... Find the sum of the first 6 terms. [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-268a6e-2-2', '268a6e', 5, '2', '(c) In the given figure CE is a tangent to the circle at point C. ABCD is a cyclic quadrilateral. If ∠ABC = 93° and ∠DCE = 35°.

Find:

(i) ∠ADC
(ii) ∠CAD
(iii) ∠ACD [4]', 4, 'Circles', 'long', 2, '268a6e__UnknownSch_p2_img_0_jpeg.webp', NULL),
  ('MQ-268a6e-3-0', '268a6e', 6, '3', '(a) Prove the following identity

$$\frac { \sec A } { \sec A - 1 } + \frac { \sec A } { \sec A + 1 } = 2 \mathrm { c o s e c } ^ { 2 } \mathrm { A }$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-268a6e-3-1', '268a6e', 7, '3', '(b) Find x and y if :

$$3 \left[ \begin{array} { l l } { 5 } & { - 6 } \\ { 4 } & { x } \end{array} \right] - \left[ \begin{array} { l l } { 6 } & { y } \\ { 0 } & { 6 } \end{array} \right] = 3 \left[ \begin{array} { l l } { 3 } & { - 2 } \\ { 4 } & { 0 } \end{array} \right]$$ [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-268a6e-3-2', '268a6e', 8, '3', '(c) For what value of ''k'' will the following quadratic equation:

$$( k + 1 ) x ^ { 2 } - 4 k x + 9 = 0 { \mathrm { ~ h a v e ~ r e a l ~ a n d ~ e q u a l ~ r o o t s ? ~ S o l v e ~ t h e ~ e q u a t i o n s . } }$$ [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-268a6e-4-0', '268a6e', 9, '4', '(a) A box consists of 4 red, 5 black and 6 white balls. One ball is drawn out at random. Find the probability that the ball drawn is:

(i) black
(ii) red or white [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-268a6e-4-1', '268a6e', 10, '4', '(b) Calculate the median and mode for the following distribution:

| Weight (in kg) | 35 | 47 | 52 | 56 | 60 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 3 | 5 | 3 | 2 |

[3]', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-268a6e-4-2', '268a6e', 11, '4', '(c) A solid cylinder of radius 7 cm and height 14 cm is melted and recast into solid spheres each of radius 3.5 cm. Find the number of spheres formed. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-268a6e-5-0', '268a6e', 12, '5', '(a) The \( 2^{nd} \) and \( 45^{th} \) term of an arithmetic progression are 10 and 96 respectively. Find the first term and the common difference and hence find the sum of the first 15 terms.', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-268a6e-5-1', '268a6e', 13, '5', '(b) If \( A = \begin{bmatrix} 3 & -1 \\ 0 & 2 \end{bmatrix} \) , find matrix B such that \( A^{2} - 2B = 3A + 5I \) where I is a 2 x 2 identity matrix.', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-268a6e-5-2', '268a6e', 14, '5', '(c) With the help of a graph paper, taking 1cm=1unit along both x and y axis:

(i) Plot points A (0, 3), B (2, 3), C (3, 0), D (2, -3), E (0, -3)
(ii) Reflect points B, C and D on the y axis and name them as B'', C'' and D'' respectively.
(iii) Write the co-ordinates of B'', C'' and D''.
(iv) Write the equation of line B'' D''.
(v) Name the figure BCDD''C''B''B [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-268a6e-6-0', '268a6e', 15, '6', '(a) In Δ ABC and ΔEDC, AB is parallel to ED. BD = 1/3 BC and AB = 12.3 cm.

(i) Prove that ΔABC ~ ΔEDC.
(ii) Find DE
(iii) Find:

$$\frac{area\ of\ \Delta EDC}{area\ of\ \Delta ABC}$$

[3]', 3, 'Similarity', 'short', 4, '268a6e__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-268a6e-6-1', '268a6e', 16, '6', '(b) Find the ratio in which the line joining (-2, 5) and (-5, -6) is divided by the line y = -3. Hence find the point of intersection. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-268a6e-6-2', '268a6e', 17, '6', '(c) The given solid figure is a cylinder surmounted by a cone. The diameter of the base of the cylinder is 6 cm. The height of the cone is 4 cm and the total height of the solid is 25 cm. Take π = 22/7.

Find the:

(i) Volume of the solid
(ii) Curved surface area of the solid

Give your answers correct to the nearest whole number. [4]', 4, 'Mensuration', 'long', 4, '268a6e__UnknownSch_p4_img_1_jpeg.webp', NULL),
  ('MQ-268a6e-7-0', '268a6e', 18, '7', '(a) In the given figure, PAB is a secant and PT a tangent to the circle with centre O.
If ∠ATP = 40°, PA = 9 cm and AB = 7 cm.

Find:

(i) ∠APT
(ii) length of PT [3]', 3, 'Circles', 'short', 5, '268a6e__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-268a6e-7-1', '268a6e', 19, '7', '(b) The 1st and the 8th term of a GP are 4 and 512 respectively. Find:

(i) the common ratio
(ii) the sum of its first 5 terms. [3]', 3, 'Geometric Progression', 'short', 5, NULL, NULL),
  ('MQ-268a6e-7-2', '268a6e', 20, '7', '(c) The mean of the following distribution is 49. Find the missing frequency ''a''.

| Class | 0 – 20 | 20 – 40 | 40 – 60 | 60 – 80 | 80 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 15 | 20 | 30 | a | 10 |

[4]', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-268a6e-8-0', '268a6e', 21, '8', '(a) Prove the following identity
$$(\sin A + \text{cosec} A)^2 + (\cos A + \sec A)^2 = 5 + \sec^2 A \cdot \text{cosec}^2 A$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-268a6e-8-1', '268a6e', 22, '8', '(b) Find the equation of the perpendicular bisector of line segment joining A(4, 2) and B(-3, -5) [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-268a6e-8-2', '268a6e', 23, '8', '(c) Using properties of proportion, find x : y if

$$\frac{x^3 + 12x}{6x^2 + 8} = \frac{y^3 + 27y}{9y^2 + 27}$$ [4]', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-268a6e-9-0', '268a6e', 24, '9', '(a) The difference of the squares of two natural numbers is 84. The square of the larger number is 25 times the smaller number. Find the numbers. [4]', 4, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-268a6e-9-1', '268a6e', 25, '9', '(b) The following table shows the distribution of marks in Mathematics:

| Marks (less than) | No. of students |
| --- | --- |
| 10 | 7 |
| 20 | 28 |
| 30 | 54 |
| 40 | 71 |
| 50 | 84 |
| 60 | 105 |
| 70 | 147 |
| 80 | 180 |

With the help of a graph paper, taking 2 cm = 10 units along one axis and 2 cm = 20 units along the other axis, plot an ogive for the above distribution and use it to find the:

(i) median.
(ii) number of students who scored distinction marks (75% and above)
(iii) number of students, who passed the examination if pass marks is 35%. [6]', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-268a6e-10-0', '268a6e', 26, '10', '(a) Prove that two tangents drawn from an external point to a circle are of equal length. [3]', 3, 'Circles', 'short', 7, NULL, NULL),
  ('MQ-268a6e-10-1', '268a6e', 27, '10', '(b) From the given figure find the:

(i) Coordinates of points P, Q, R.

(ii) Equation of the line through P and parallel to QR. [3]', 3, 'Coordinate Geometry', 'short', 7, '268a6e__UnknownSch_p7_img_0_jpeg.webp', NULL),
  ('MQ-268a6e-10-2', '268a6e', 28, '10', '(c) Ms. Roy went to a departmental store and bought the following items. The GST rates and the quantity of each items and market price of each are given below:

| S.No. | Items | Price per item in ₹ | Quantity | GST rate | Amount |
| --- | --- | --- | --- | --- | --- |
| 1. | Walnut | 650 | 1 | 5% | |
| 2. | Potato Chips | 50 | 2 | 0% | |
| 3. | Coffee | 80 | 2 | 18% | |

Find the:

(i) The total amount of SGST paid.

(ii) The total amount of the bill. [4]', 4, 'GST and Banking', 'long', 7, NULL, NULL),
  ('MQ-268a6e-11-0', '268a6e', 29, '11', '(a) Mr. Sharma receives an annual income of ₹ 900 in buying ₹ 50 shares selling at ₹ 80. If the dividend declared is 20%, find the:

(i) Amount invested by Mr. Sharma.
(ii) Percentage return on his investment. [3]', 3, 'Shares and Dividends', 'short', 8, NULL, NULL),
  ('MQ-268a6e-11-1', '268a6e', 30, '11', '(b) Two poles AB and PQ are standing opposite each other on either side of a road 200 m wide. From a point R between them on the road, the angles of elevation of the top of the poles AB and PQ are 45° and 40° respectively. If height of AB = 80 m, find the height of PQ correct to the nearest metre. [3]', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-268a6e-11-2', '268a6e', 31, '11', '(c) Construct a triangle PQR, given RQ = 10 cm, ∠PRQ = 75° and base RP = 8 cm. Find by construction:

(i) The locus of points which are equidistant from QR and QP.
(ii) The locus of points which are equidistant from P and Q.
(iii) Mark the point O which satisfies conditions (i) and (ii). [4]', 4, 'Constructions', 'long', 8, NULL, NULL),
  ('MQ-272ab8-1-0', '272ab8', 0, '1', '(i) The point (3,0) is invariant under reflection in:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['The origin', 'x-axis', 'y-axis', 'both x and y axes']::text[]),
  ('MQ-272ab8-1-1', '272ab8', 1, '1', '(ii) In the given figure, AB is a diameter of the circle with centre ''O''. If $\angle COB = 55^\circ$ then the value of x is:
T22 511 S2 – SPECIMEN
1 of 7', 1, 'Circles', 'MCQ', 1, '272ab8__UnknownSch_p1_img_0_jpeg.webp', array['27.5⁰', '55⁰', '110⁰', '125⁰']::text[]),
  ('MQ-272ab8-1-2', '272ab8', 2, '1', '(iii) If a rectangular sheet having dimensions 22 cm x 11 cm is rolled along its shorter side to form a cylinder. Then the curved surface area of the cylinder so formed is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['968 cm²', '424 cm²', '121 cm²', '242 cm²']::text[]),
  ('MQ-272ab8-1-3', '272ab8', 3, '1', '(iv) If the vertices of a triangle are (1,3), (2, - 4) and (-3, 1). Then the co-ordinate of its centroid is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(0, 0)', '(0, 1)', '(1, 0)', '(1, 1)']::text[]),
  ('MQ-272ab8-1-4', '272ab8', 4, '1', '(v) tan θ x √(1 - sin²θ) is equal to:', 1, 'Trigonometry', 'MCQ', 2, NULL, array['cos θ', 'sin θ', 'tan θ', 'cot θ']::text[]),
  ('MQ-272ab8-1-5', '272ab8', 5, '1', '(vi) The median class for the given distribution is:
| Class Interval | 1 – 5 | 6 – 10 | 11–15 | 16 –20 |
| --- | --- | --- | --- | --- |
| Cumulative Frequency | 2 | 6 | 11 | 18 |', 1, 'Statistics', 'MCQ', 2, NULL, array['1 – 5', '6 – 10', '11 – 15', '11 – 20']::text[]),
  ('MQ-272ab8-1-6', '272ab8', 6, '1', '(vii) If the lines $7y = ax + 4$ and $2y = 3 - x$, are parallel to each other, then the value of ''a'' is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['- 1', '$\frac{-7}{2}$', '$\frac{-2}{7}$', '14']::text[]),
  ('MQ-272ab8-1-7', '272ab8', 7, '1', '(viii) Volume of a cylinder is 330 cm³. The volume of the cone having same radius and height as that of the given cylinder is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['330 cm³', '165 cm³', '110 cm³', '220 cm³']::text[]),
  ('MQ-272ab8-1-8', '272ab8', 8, '1', '(ix) In the given graph, the modal class is the class with frequency:', 1, 'Statistics', 'MCQ', 3, '272ab8__UnknownSch_p3_img_0_jpeg.webp', array['72', '21', '48', '36']::text[]),
  ('MQ-272ab8-1-9', '272ab8', 9, '1', '(x) If the probability of a player winning a game is 0.56. The probability of his losing this game is:', 1, 'Probability', 'MCQ', 3, NULL, array['0.56', '1', '0.44', '0']::text[]),
  ('MQ-272ab8-2-0', '272ab8', 10, '2', '(i) Find the ratio in which the x-axis divides internally the line joining points A (6, -4) and B (-3, 8). [2]', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-272ab8-2-1', '272ab8', 11, '2', '(ii) Three rotten apples are accidentally mixed with twelve good ones. One apple is picked at random. What is the probability that it is a good one? [2]', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-272ab8-2-2', '272ab8', 12, '2', '(iii) In the given figure, AC is a tangent to circle at point B. $\Delta EFD$ is an equilateral triangle and $\angle CBD = 40^{\circ}$. Find: [3]

(a) $\angle BFD$
(b) $\angle FBD$
(c) $\angle ABF$', 3, 'Circles', 'short', 4, '272ab8__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-272ab8-2-3', '272ab8', 13, '2', '(iv) A drone camera is used to shoot an object P from two different positions R and S along the same vertical line QRS. The angle of depression of the object P from these two positions are $35^{\circ}$ and $60^{\circ}$ respectively as shown in the diagram. If the distance of the object P from point Q is 50 metres, then find the distance between R and S correct to the nearest meter. [3]', 3, 'Trigonometry', 'short', 4, '272ab8__UnknownSch_p4_img_1_jpeg.webp', NULL),
  ('MQ-272ab8-3-0', '272ab8', 14, '3', '(i) In the given figure, PT is a tangent to the circle at T, chord BA is produced to meet the tangent at P. Perpendicular BC bisects the chord TA at C. If PA = 9cm and TB = 7cm, find the lengths of: [2]

(a) AB
(b) PT', 2, 'Circles', 'short', 5, '272ab8__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-272ab8-3-1', '272ab8', 15, '3', '(ii) How many solid right circular cylinders of radius 2 cm and height 3 cm can be made by melting a solid right circular cylinder of diameter 12 cm and height 15 cm? [2]', 2, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-272ab8-3-2', '272ab8', 16, '3', '(iii) Prove that: [3]

\[
\frac {\cos^ {2} A}{\cos A - \sin A} + \frac {\sin A}{1 - \cot A} = \sin A + \cos A
\]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-272ab8-3-3', '272ab8', 17, '3', '(iv) Use graph paper for this question, take 2 cm = 10 marks along one axis and 2 cm = 10 students along the other axis.

The following table shows the distribution of marks in a 50 marks test in Mathematics:

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| --- | --- | --- | --- | --- | --- |
| No. of Students | 6 | 10 | 13 | 7 | 4 |

Draw the ogive for the above distribution and hence estimate the median marks. [3]', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-272ab8-4-0', '272ab8', 18, '4', '(i) Find the equation of the perpendicular dropped from the point P (-1,2) onto the line joining A (1,4) and B (2,3). [2]', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-272ab8-4-1', '272ab8', 19, '4', '(ii) Find the mean for the following distribution: [2]

| Class Interval | 20 – 40 | 40 – 60 | 60–80 | 80 –100 |
| --- | --- | --- | --- | --- |
| Frequency | 4 | 7 | 6 | 3 |', 2, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-272ab8-4-2', '272ab8', 20, '4', '(iii) A solid piece of wooden cone is of radius OP = 7 cm and height OQ = 12 cm. A cylinder whose radius and height equal to half of that of the cone is drilled out from this piece of wooden cone. Find the volume of the remaining piece of wood.

$$(\text{Use}, \pi = \frac{22}{7})$$ [3]', 3, 'Mensuration', 'short', 6, '272ab8__UnknownSch_p6_img_0_jpeg.webp', NULL),
  ('MQ-272ab8-4-3', '272ab8', 21, '4', '(iv) Use a graph sheet for this question, take 2cm = 1 unit along both x and y axis: [3]

(a) Plot the points A (3,2) and B (5,0). Reflect point A on the y-axis to A''. Write co-ordinates of A''.
(b) Reflect point B on the line AA'' to B''. Write the co-ordinates of B''.
(c) Name the closed figure A''B''AB.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-272ab8-5-0', '272ab8', 22, '5', '(i) In the given figure, the sides of the quadrilateral PQRS touches the circle at A,B,C and D. If RC = 4 cm, RQ = 7 cm and PD = 5cm. Find the length of PQ: [2]', 2, 'Circles', 'short', 6, '272ab8__UnknownSch_p6_img_1_jpeg.webp', NULL),
  ('MQ-272ab8-5-1', '272ab8', 23, '5', '(ii) Prove that: [2]

$$\frac{\sin^3\theta + \cos^3\theta}{\sin\theta + \cos\theta} = 1 - \sin\theta\cos\theta$$', 2, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-272ab8-5-2', '272ab8', 24, '5', '(iii) In the given diagram, OA = OB, ∠OAB = θ and the line AB passes through point P (-3, 4).

[3]

Find:

(a) Slope and inclination (θ) of the line AB
(b) Equation of the line AB', 3, 'Coordinate Geometry', 'short', 7, '272ab8__UnknownSch_p7_img_0_jpeg.webp', NULL),
  ('MQ-272ab8-5-3', '272ab8', 25, '5', '(iv) Use graph paper for this question. Estimate the mode of the given distribution by plotting a histogram. [Take 2 cm = 10 marks along one axis and 2 cm = 5 students along the other axis]

[3]

| Daily wages(in ₹) | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 |
| --- | --- | --- | --- | --- | --- |
| No. of Workers | 6 | 12 | 20 | 15 | 9 |', 3, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-272ab8-6-0', '272ab8', 26, '6', '(i) A box contains tokens numbered 5 to 16. A token is drawn at random. Find the probability that the token drawn bears a number divisible by:

[2]

(a) 5
(b) Neither by 2 nor by 3', 2, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-272ab8-6-1', '272ab8', 27, '6', '(ii) Point M (2, b) is the mid-point of the line segment joining points P (a, 7) and Q (6, 5). Find the values of ''a'' and ''b''.', 2, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-272ab8-6-2', '272ab8', 28, '6', '(iii) An aeroplane is flying horizontally along a straight line at a height of 3000 m from the ground at a speed of 160 m/s. Find the time it would take for the angle of elevation of the plane as seen from a particular point on the ground to change from 60° to 45°. Give your answer correct to the nearest second.', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-272ab8-6-3', '272ab8', 29, '6', '(iv) Given that the mean of the following frequency distribution is 30, find the missing frequency ''f''
| Class Interval | 0 – 10 | 10 – 20 | 20–30 | 30 –40 | 40 – 50 | 50 – 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 6 | 10 | f | 6 | 4 |', 3, 'Statistics', 'short', 7, NULL, NULL),
  ('MQ-ef86c1-1-0', 'ef86c1', 0, '1', '1. If matrix A is of order 3 x 2 and matrix B is of order 2 x 2 then the matrix AB is of order', 1, 'Matrices', 'MCQ', 1, NULL, array['3 x 2', '3 x 1', '2 x 3', '1 x 3']::text[]),
  ('MQ-ef86c1-2-0', 'ef86c1', 1, '2', '2. The percentage share of SGST of total GST for an Intra-State sale of an article is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['25%', '50%', '75%', '100%']::text[]),
  ('MQ-ef86c1-3-0', 'ef86c1', 2, '3', '3. ABCD is a trapezium with AB parallel to DC.
Then the triangle similar to ΔAOB is', 1, 'Similarity', 'MCQ', 1, 'ef86c1__UnknownSch_p1_img_0_jpeg.webp', array['ΔADB', 'ΔACB', 'ΔCOD', 'ΔCOB']::text[]),
  ('MQ-ef86c1-4-0', 'ef86c1', 3, '4', '4. The mean proportion between 9 and 16 is', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['25', '144', '7', '12']::text[]),
  ('MQ-ef86c1-5-0', 'ef86c1', 4, '5', '5. A man deposited ₹ 500 per month for 6 months and received ₹3300 as the maturity value. The interest received by him is: -', 1, 'GST and Banking', 'MCQ', 1, NULL, array['1950', '300', '2800', 'none of these']::text[]),
  ('MQ-ef86c1-6-0', 'ef86c1', 5, '6', '6. The solution set representing the following number line is', 1, 'Linear Inequations', 'MCQ', 2, 'ef86c1__UnknownSch_p2_img_0_jpeg.webp', array['\(\{x: x \in \mathbb{R}, -3 \leq x < 2\}\)', '\(\{x: x \in \mathbb{R}, -3 < x < 2\}\)', '\(\{\mathrm{x}:\mathrm{x}\in \mathbb{R}, - 3 < \mathrm{x}\leq 2\}\)', '\(\{\mathrm{x}:\mathrm{x}\in \mathbb{R}, - 3\leq \mathrm{x}\leq 2\}\)']::text[]),
  ('MQ-ef86c1-7-0', 'ef86c1', 6, '7', '7. The first three terms of an arithmetic progression (A. P.) are 1, 9, 17, then the next two terms are', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['25 and 35', '27 and 37', '25 and 33', 'none of these']::text[]),
  ('MQ-ef86c1-8-0', 'ef86c1', 7, '8', '8. If \(\Delta ABC \sim \Delta QRP\) then the corresponding proportional sides are', 1, 'Similarity', 'MCQ', 2, NULL, array['\(\frac{AB}{QR} = \frac{BC}{RP}\)', '\(\frac{AC}{QR} = \frac{BC}{RP}\)', '\(\frac{AB}{QR} = \frac{BC}{QP}\)', '\(\frac{AB}{PQ} = \frac{BC}{RP}\)']::text[]),
  ('MQ-ef86c1-9-0', 'ef86c1', 8, '9', '9. If \( x \in W \), then the solution set of the inequation \( -x > -7 \), is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['\(\{8,9,10\ldots\}\)', '\(\{0,1,2,3,4,5,6\}\)', '\(\{0,1,2,3\ldots\}\)', '\(\{-8, -9, -10\ldots\}\)']::text[]),
  ('MQ-ef86c1-10-0', 'ef86c1', 9, '10', '10. The roots of the quadratic equation \( 4x^{2} - 7x + 2 = 0 \) are 1.390, 0.359. The roots correct to 2 significant figures are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['1.39 and 0.36', '1.3 and 0.35', '1.4 and 0.36', '1.390 and 0.360']::text[]),
  ('MQ-ef86c1-11-0', 'ef86c1', 10, '11', '11. 1.5, 3, x and 8 are in proportion, then x is equal to', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['6', '4', '4.5', '16']::text[]),
  ('MQ-ef86c1-12-0', 'ef86c1', 11, '12', '12. If a polynomial \( 2x^{2} - 7x - 1 \) is divided by \( (x + 3) \), then the remainder is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['- 4', '38', '-3', '2']::text[]),
  ('MQ-ef86c1-13-0', 'ef86c1', 12, '13', '13. If 73 is the \( n^{th} \) term of the arithmetic progression 3, 8, 13, 18..., then ''n'' is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['13', '14', '15', '16']::text[]),
  ('MQ-ef86c1-14-0', 'ef86c1', 13, '14', '14. The roots of the quadratic equation \( x^{2} + 2x + 1 = 0 \) are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['Real and distinct', 'Real and equal', 'Distinct', 'Not real/ imaginary']::text[]),
  ('MQ-ef86c1-15-0', 'ef86c1', 14, '15', '15. Which of the following statement is not true?', 1, NULL, 'MCQ', 3, NULL, array['All identity matrices are square matrix', 'All null matrices are square matrix', 'For a square matrix number of rows is equal to the number of columns', 'A square matrix all of whose elements except those in the leading diagonal are zero is the diagonal matrix']::text[]),
  ('MQ-ef86c1-16-0', 'ef86c1', 15, '16', '16. If (x - 2) is a factor of the polynomial x³ + 2x² - 13 x + k, then ''k'' is equal to', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-10', '26', '-26', '10']::text[]),
  ('MQ-ef86c1-17-0', 'ef86c1', 16, '17', '17. A man deposited ₹1200 in a recurring deposit account for 1 year at 5% per annum simple interest. The interest earned by him on maturity is', 2, 'GST and Banking', 'MCQ', 3, NULL, array['14790', '390', '4680', '780']::text[]),
  ('MQ-ef86c1-18-0', 'ef86c1', 17, '18', '18. If x² - 4 is a factor of polynomial x³ + x² - 4x - 4, then its factors are', 2, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['(x-2) (x+2) (x+1)', '(x-2) (x+2) (x-1)', '(x-2) (x-2) (x+1)', '(x-2) (x-2) (x-1)']::text[]),
  ('MQ-ef86c1-19-0', 'ef86c1', 18, '19', '19. The following bill shows the GST rates and the marked price of articles A and B:
| BILL: GENERAL STORE | | |
| --- | --- | --- |
| Articles | Marked price | Rate of GST |
| A | ₹300 | 12% |
| B | ₹1200 | 5% |
The total amount to be paid for the above bill is: -', 2, 'GST and Banking', 'MCQ', 3, NULL, array['1548', '1596', '1560', '1536']::text[]),
  ('MQ-ef86c1-20-0', 'ef86c1', 19, '20', '20. The solution set for the linear inequation -8 ≤ x - 7 < - 4, x ∈ I is', 2, 'Linear Inequations', 'MCQ', 3, NULL, array['{x: x ∈ R, -1 ≤ x < 3}', '{0, 1, 2, 3}', '{-1, 0, 1, 2, 3}', '{ -1, 0, 1, 2}']::text[]),
  ('MQ-ef86c1-21-0', 'ef86c1', 20, '21', '21. If $$\frac{5a}{7b} = \frac{4c}{3d}$$, then by Componendo and dividendo', 2, 'Ratio and Proportion', 'MCQ', 4, NULL, array['$$\frac{5a+7b}{5a-7b} = \frac{4c-3d}{4c+3d}$$', '$$\frac{5a-7b}{5a+7b} = \frac{4c+3d}{4c-3d}$$', '$$\frac{\frac{5a+7b}{5a-7b}}{\frac{4c+3d}{4c-3d}} =$$', '$$\frac{5a+7b}{5a+7b} = \frac{4c-3d}{4c-3d}$$']::text[]),
  ('MQ-ef86c1-22-0', 'ef86c1', 21, '22', '22. If $$A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$$ then $$A^2$$ is', 2, 'Matrices', 'MCQ', 4, NULL, array['$$\begin{bmatrix} 4 & 0 \\ 1 & 49 \end{bmatrix}$$', '$$\begin{bmatrix} 4 & 0 \\ -9 & 49 \end{bmatrix}$$', '$$\begin{bmatrix} 4 & 0 \\ 9 & 49 \end{bmatrix}$$', '$$\begin{bmatrix} 1 & 9 \\ -9 & 48 \end{bmatrix}$$']::text[]),
  ('MQ-ef86c1-23-0', 'ef86c1', 22, '23', '23. The distance between station A and B by road is 240 km and by train it is 300 km. A car starts from station A with a speed x km/hr whereas a train starts from station B with a speed 20km/hr more than the speed of the car.
(i) The time taken by car to reach station B is
(a) $$\frac{240}{x}$$
(b) $$\frac{300}{x}$$
(c) $$\frac{20}{x}$$
(d) $$\frac{300}{x+20}$$
(ii) The time taken by train to reach station A
(a) $$\frac{240}{x}$$
(b) $$\frac{300}{x}$$
(c) $$\frac{20}{x}$$
(d) $$\frac{300}{x+20}$$
(iii) If the time taken by train is 1 hour less than that taken by the car, then the quadratic equation formed is
(a) $$x^2 + 80x - 6000 = 0$$
(b) $$x^2 + 80x - 4800 = 0$$
(c) $$x^2 + 240x - 1600 = 0$$
(d) $$x^2 - 80x + 4800 = 0$$
(iv) The speed of the car is', 4, 'Quadratic Equations', 'MCQ', 4, NULL, array['60km/hr', '120km/hr', '40km/hr', '80km/hr']::text[]),
  ('MQ-ef86c1-24-0', 'ef86c1', 23, '24', '24. In the given triangle PQR, AB || QR, QP || CB and AR intersects CB at O.
Using the given diagram answer the following question:
(i) The triangle similar to ΔARQ is
(a) ΔORC
(b) ΔARP
(c) ΔOBR
(d) ΔQRP
(ii) ΔPQR ~ΔBCR by axiom
(a) SAS
(b) AAA
(c) SSS
(d) AAS
(iii) If QC = 6 cm, CR = 4 cm, BR = 3 cm. The length of RP is
(a) 4.5 cm
(b) 8cm
(c) 7.5cm
(d) 5cm
(iv) The ratio PQ: BC is', 4, 'Similarity', 'MCQ', 5, 'ef86c1__UnknownSch_p5_img_0_jpeg.webp', array['2 : 3', '3 : 2', '5 : 2', '2 : 5']::text[]),
  ('MQ-ef86c1-25-0', 'ef86c1', 24, '25', '25 The nth term of an arithmetic progression (A.P.) is (3n + 1)
(i) The first three terms of this A. P. are
(a) 5, 6, 7
(b) 3, 6, 9
(c) 1, 4, 7
(d) 4, 7, 10
(ii) The common difference of the A.P. is
(a) 3
(b) 1
(c) -3
(d) 2
(iii) Which of the following is not a term of this A.P.
(a) 25
(b) 27
(c) 28
(d) 31
(iv) Sum of the first 10 terms of this A.P. is', 4, 'Arithmetic Progression', 'MCQ', 5, NULL, array['350', '175', '-95', '70']::text[]),
  ('MQ-07f75d-1-0', '07f75d', 0, '1', '1. M/s Ram Traders, Delhi, provided the following services to M/s Geeta Trading Company in Agra (UP). Find the amount of bill:
| Number of services | 8 | 12 | 10 | 16 |
| --- | --- | --- | --- | --- |
| Cost of each service (in Rs.) | 680 | 320 | 260 | 420 |
| GST% | 5 | 12 | 18 | 12 |
(P.O.C.I.B - 100%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-2-0', '07f75d', 1, '2', '2. A is a manufacturer of T.V. sets in Delhi. He manufactures a particular brand of T.V. set and marks it at Rs.75,000. He then sells this T.V. set to a wholesaler B in Punjab at a discount of 30%. The wholesaler B raises the marked price of the T.V. set bought by 30% and then sells it to dealer C in Delhi. If the rate of GST = 5%, find tax (under GST) paid by wholesaler B to the government. (P.O.C.I.B - 70%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-3-0', '07f75d', 2, '3', '3. Kritika, a manufacturer, sells binoculars for Rs. 3,750 to Aarushi, a wholesaler, who sells it to Vashu, a retailer, at a profit of 12%. Vashu, The retailer, sells it to a customer, Dhir, at a profit of Rs. 600. The GST charged is 18%, and all the sales are intra-state, find:

(i) The GST paid by the wholesaler, Aarushi, to the Central Government.
(ii) The price paid by the retailer, Vashu, inclusive of tax.
(iii) The total GST received by State Government.
(iv) The price paid by the customer, Dhir. (P.O.C.I.B - 70%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-4-0', '07f75d', 3, '4', '4. A shopkeeper buys an article whose list price is Rs. 450 at some rate of discount from a wholesaler. He sells the article to a consumer at the list price and charges GST at the rate of 6%. If the shopkeeper has to pay GST of Rs. 2.70, find the rate of discount at which he bought the article from the wholesaler. (P.O.C.I.B - 1%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-1-1', '07f75d', 4, '1', '1. Vedik deposited Rs. 350 per month in a bank for 1 year and 3 months under the Recurring Deposit Scheme. If the maturity value of his deposits is Rs. 5,565; find the rate of interest per annum. (P.O.C.I.B - 100%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-2-1', '07f75d', 5, '2', '2. Rishabh has a Recurring Deposit Account in a post office for 3 years at 8% p.a. simple interest. If he gets Rs. 9,990 as interest at the time of maturity, find :

(i) the monthly instalment

(ii) the amount of maturity.

(P.O.C.I.B - 100%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-3-1', '07f75d', 6, '3', '3. Sonia had a recurring deposit account in a bank and deposited Rs. 600 per month for 2½ years. If the rate of interest was 10% p.a., find the maturity value of this account. (P.O.C.I.B - 100%)', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-07f75d-4-1', '07f75d', 7, '4', '4. Mr. Britto deposits a certain sum of money each month in a Recurring Deposit Account of a bank. If the rate of interest is of 8% per annum and Mr. Britto gets Rs. 8088 from the bank after 3 years, find the value of his monthly instalment. (P.O.C.I.B - 100%)', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-07f75d-5-0', '07f75d', 8, '5', '5. The maturity value of a R.D. Account is Rs. 16,176. If the monthly installment is Rs. 400 and the rate of interest is 8%; find the time (period) of this R.D. Account. (P.O.C.I.B - 10%)', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-07f75d-1-2', '07f75d', 9, '1', '1. Solve the following inequation and graph the solution set on the number line

$$2x - 3 < x + 2 \leq 3x + 5, x \in Z. \tag{P.O.C.I.B - 100\%}$$', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-2-2', '07f75d', 10, '2', '2. Solve the inequation: $$-2\frac{1}{2} + 2x \leq \frac{4x}{5} \leq \frac{4}{3} + 2x, x \in W$$

Graph the solution-set on the number line. (P.O.C.I.B - 100%)', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-3-2', '07f75d', 11, '3', '3. Solve the inequation and represent the solution set on the number line;

$$-2 < \frac{1}{2} - \frac{3x + 1}{4} \leq 3\frac{5}{8}, x \in N \tag{P.O.C.I.B - 100\%}$$', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-4-2', '07f75d', 12, '4', '4. Solve the following inequation, write down the solution set and represent the solution set on the number line.

$$-3 \leq \frac{1}{2} - \frac{3x}{4} \leq \frac{5}{8} \text{ when } x \in R \tag{P.O.C.I.B - 100\%}$$', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-5-1', '07f75d', 13, '5', '5. P is the solution set of $$7x - 2 > 4x + 1$$ and Q is the solution set of $$9x - 45 \geq 5(x - 5)$$; where $$x \in R$$. Represent:

- (i) $$P \cap Q$$
- (ii) $$P - Q$$
- (iii) $$P \cap Q''$$

on different number lines. (P.O.C.I.B - 1%)', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-1-3', '07f75d', 14, '1', '1. Solve the following question and give your answer correct to 2 decimal places: $$5x^2 - 3x - 4 = 0$$ (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-2-3', '07f75d', 15, '2', '2. Solve the following equation: $$x - \frac{18}{x} = 6$$. Give your answer correct to two significant figures. (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-3-3', '07f75d', 16, '3', '3. Solve for x using the quadratic formula. Write your answer correct to two significant figures: $$(x - 1)^2 - 3x + 4 = 0$$. (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-4-3', '07f75d', 17, '4', '4. Find the value of ''k'' for which x = 3 is a solution of the quadratic equation, $$(k + 2)x^2 - kx + 6 = 0$$. Thus find the other root of the equation. (20%)', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-5-2', '07f75d', 18, '5', '5. Find the value of k for which the following equation has equal roots.

$$x^2 + 4kx + (k^2 - k + 2) = 0 \tag{P.O.C.I.B - 80\%}$$', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-6-0', '07f75d', 19, '6', '6. Find the value of ''m'' for which the given equation has real and equal roots.

$$x^2 + 2(m - 1)x + (m + 5) = 0. \tag{P.O.C.I.B - 80\%}$$', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-07f75d-1-4', '07f75d', 20, '1', '1. Rs. 480 is divided equally among ''x'' children. If the number of children were 20 more then each would have got Rs. 12 less. Find ''x''. (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-2-4', '07f75d', 21, '2', '2. A car covers a distance of 400 km at a certain speed. Had the speed been 12 km/h more, the time taken for the journey would have been 1 hour 40 minutes less. Find the original speed of the car. (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-3-4', '07f75d', 22, '3', '3. A two digit positive number is such that the product of its digits is 6. If 9 is added to the number, the digits interchange their places. Find the number. (P.O.C.I.B - 40%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-5-3', '07f75d', 23, '5', '5. Sum of two natural numbers is 8 and the difference of their reciprocal is $$\frac{2}{15}$$. Find the numbers. (P.O.C.I.B - 80%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-6-1', '07f75d', 24, '6', '6. Five years ago, a woman''s age was the square of her son''s age. Ten years later her age will be twice that of her son''s age. Find:
(i) The age of the son five years ago.
(ii) The present age of the woman. (P.O.C.I.B - 100%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-7-0', '07f75d', 25, '7', '7. Two pipes flowing together can fill a cistern in 6 minutes. If one pipe takes 5 minutes more than the other to fill the cistern, find the time in which each pipe would fill the cistern. (P.O.C.I.B - 50%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-8-0', '07f75d', 26, '8', '8. The area of a big rectangular room is 300 m2. If the length were decreased by 5m and the breadth increased by 5 m; the area would be unaltered. Find the length of the room. (P.O.C.I.B - 1%)', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-9-0', '07f75d', 27, '9', '9. The speed of a boat in still water is 15 km/hr. It can go 30 km upstream and return downstream to the original point in 4 hrs 30 mins. Find the speed of the stream.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-07f75d-1-5', '07f75d', 28, '1', '1. Find the least number to be added to 5, 17, 35, 87 such that the resulting numbers are in proportion. (P.O.C.I.B - 50%)', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07f75d-2-5', '07f75d', 29, '2', '2. Find two numbers such that the mean proportional between them is 14 and third proportional to them is 112. (P.O.C.I.B - 80%)', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07f75d-3-5', '07f75d', 30, '3', '3. Using properties of proportion, solve for $$x : \frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$ (P.O.C.I.B - 100%)', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07f75d-4-4', '07f75d', 31, '4', '4. If b is the mean proportion between a and c, show that :

$$\frac{a^4 + a^2b^2 + b^4}{b^4 + b^2c^2 + c^4} = \frac{a^2}{c^2}$$ (P.O.C.I.B - 100%)', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07f75d-5-4', '07f75d', 32, '5', '5. If $$\frac{x}{a} = \frac{y}{b} = \frac{z}{c}$$ show that $$\frac{x^3}{a^3} + \frac{y^3}{b^3} + \frac{z^3}{c^3} = \frac{3xyz}{abc}$$ (P.O.C.I.B - 100%)', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-07f75d-6-2', '07f75d', 33, '6', '6. If $$\frac{7m + 2n}{7m - 2n} = \frac{5}{3}$$, use properties of proportion to find (P.O.C.I.B - 100%)

(i) $$m : n$$
(ii) $$\frac{m^2 + n^2}{m^2 - n^2}$$', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-07f75d-1-6', '07f75d', 34, '1', '1. Find the value of a and b if x - 1 and x - 2 are factors of x³ - ax + b. Hence, factorise completely. (P.O.C.I.B - 100%)', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-07f75d-2-6', '07f75d', 35, '2', '2. Using the Remainder Theorem, factorise the following completely: 4x³ + 7x² - 36x - 63. (P.O.C.I.B - 100%)', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-07f75d-3-6', '07f75d', 36, '3', '3. Find the values of constants a and b when (x² + x - 6) is a factor of expression x³ + ax² + bx - 12. Hence factorise completely. (P.O.C.I.B - 10%)', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-07f75d-4-5', '07f75d', 37, '4', '4. The polynomials 2x³ - 7x² + ax - 6 and x³ - 8x² + (2a + 1) x - 16 leave the same remainder when divided by x - 2. Find the value of ''a''. (P.O.C.I.B - 70%)', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-07f75d-1-7', '07f75d', 38, '1', '1. If $$A = \begin{bmatrix} 3 & -1 \\ 0 & 2 \end{bmatrix}$$, find matrix B such that $$A^2 - 2B = 3A + 5I$$ where I is a 2 x 2 identity matrix. (P.O.C.I.B - 100%)', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-07f75d-2-7', '07f75d', 39, '2', '2. Given $$A = \begin{bmatrix} 2 & 0 \\ -1 & 7 \end{bmatrix}$$ and $$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$ and $$A^2 = 9A + mI$$. Find m. (P.O.C.I.B - 100%)', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-07f75d-3-7', '07f75d', 40, '3', '3. Given $$\begin{bmatrix} 2 & 1 \\ -3 & 4 \end{bmatrix}$$ X = $$\begin{bmatrix} 7 \\ 6 \end{bmatrix}$$. Write :

(i) the order of the matrix X

(ii) the matrix X.

(P.O.C.I.B - 70%)', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-07f75d-4-6', '07f75d', 41, '4', '4. If $$A = \begin{bmatrix} 1 & -1 \\ 2 & 3 \end{bmatrix}$$ and $$C = \begin{bmatrix} 2 & -3 \\ 1 & -11 \end{bmatrix}$$, find matrix B such that BA = C. (P.O.C.I.B - 70%)', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-07f75d-1-8', '07f75d', 42, '1', '1. Which term of the arithmetic progression 1 + 4 + 7 + 10 + ... is 52 ? (P.O.C.I.B - 100%)', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-07f75d-2-8', '07f75d', 43, '2', '2. Find the 31st term of an arithmetic progression whose 10th term is 38 and 16th term is 74. (P.O.C.I.B - 100%)', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-07f75d-3-8', '07f75d', 44, '3', '3. Find the sum of all natural numbers between 250 and 1000 which are divisible by 9. (P.O.C.I.B - 100%)', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-07f75d-4-7', '07f75d', 45, '4', '4. The sum of the first three terms of an Arithmetic Progression is 42 and the product of the first and third term is 52. Find the first term and the common difference. (P.O.C.I.B - 30%)', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-07f75d-5-5', '07f75d', 46, '5', '5. If (k - 3), (2k + 1) and (4k + 3) are three consecutive terms of an A. P., find the value of k. (P.O.C.I.B - 30%)', NULL, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-07f75d-6-3', '07f75d', 47, '6', '6. How many terms of the A.P. 24, 21, 18, ... must be taken so that their sum is 78? (P.O.C.I.B - 80%)', NULL, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-07f75d-1-9', '07f75d', 48, '1', '1. Use a graph paper for this question. (Take 2 cm = 1 unit on both axes)
(i) Plot the following points: A (0, 4), B (2, 3), C (1, 1) and D (2, 0).
(ii) Reflect points B, C, D on the y-axis and write down their co-ordinates. Name the images as B'', C'', D'' respectively.
(iii) Join the points A, B, C, D, D'', C'', B'' and A in order, so as to form a closed figure. Find its area and perimeter.
(iv) Name two invariant points under reflection in y-axis. (P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-2-9', '07f75d', 49, '2', '2. The points P (5, 1) and Q (-2, -2) are reflected in line x = 2. Use graph paper to find the images P'' and Q'' of points P and Q in line x = 2. Take 2 cm = 2 units.

(i) Name the figure PP''QQ''.

(ii) Find the area of □ PP''QQ''.

(P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-1-10', '07f75d', 50, '1', '1. In what ratio is the line joining (2, -3) and (5, 6) divided by the x-axis? Also find the co-ordinates of the point. (P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-2-10', '07f75d', 51, '2', '2. Calculate the ratio in which the line joining A(6, 5) and B(4, -3) is divided by the line y = 2. (P.O.C.I.B - 80%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-3-9', '07f75d', 52, '3', '3. The mid-point of the line segment joining (4a, 2b - 3) and (-4, 3b) is (2, -2a). Find the values of a and b. (P.O.C.I.B - 50%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-4-8', '07f75d', 53, '4', '4. The co-ordinates of the centroid of a triangle PQR are (2, -5). (P.O.C.I.B - 10%) If Q (-6, 5) and R (11, 8); calculate the co-ordinates of vertex P.', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-1-11', '07f75d', 54, '1', '1. The line passing through (-4, -2) and (2, -3) is perpendicular to the line passing through (a, 5) and (2, -1) find a. (P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-2-11', '07f75d', 55, '2', '2. ABCD is a parallelogram where A(x, y), B(5, 8), C(4, 7) and D(2, -4). Find:

(i) Co-ordinates of A.
(ii) the equation of a line, through the centroid and parallel to AB. (P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-07f75d-3-10', '07f75d', 56, '3', '3. In the given figure ABC is a triangle and BC is parallel to the Y-axis. AB and AC intersect the Y-axis at P and Q respectively.

(i) Write the co-ordinates of A.
(iii) Find the ratio in which Q divides AC
(iv) Find the equation of the line AC.
(P.O.C.I.B - 100%)', NULL, 'Coordinate Geometry', 'short', 5, '07f75d__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-07f75d-4-9', '07f75d', 57, '4', '4. In ΔABC, A(3, 5), B(7, 8) and C( 1, – 10). Find the equation of the median through A, altitude through B, perpendicular bisector of AB. (P.O.C.I.B - 80%)', NULL, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-07f75d-1-12', '07f75d', 58, '1', '1. (a) In the given figure, ∠PQR = ∠PST = 90°, PQ = 5 cm and PS = 2 cm.

(i) Prove that \(\Delta PQR \sim APST\).
(ii) Find PT if PR is \(13\mathrm{cm}\)
(P.O.C.I.B - 100%)', NULL, 'Similarity', 'short', 6, '07f75d__UnknownSch_p6_img_0_jpeg.webp', NULL),
  ('MQ-07f75d-2-12', '07f75d', 59, '2', '2. In the given figure PQRS is a cyclic quadrilateral PQ and SR produced meet at T.

(i) Prove \(\Delta\) TPS \(\sim \Delta\) TRQ.
(ii) Find SP if \(\mathrm{TP} = 18\mathrm{cm}\), \(\mathrm{RQ} = 4\mathrm{cm}\) and \(\mathrm{TR} = 6\mathrm{cm}\).', NULL, 'Similarity', 'short', 6, '07f75d__UnknownSch_p6_img_1_jpeg.webp', NULL),
  ('MQ-07f75d-3-11', '07f75d', 60, '3', '3. In the adjoining figure ABC is a right angled triangle with ∠BAC = 90°.

(i) Prove \(\Delta \mathrm{ADB} \sim \Delta \mathrm{CDA}\).
(ii) If \(\mathrm{BD} = 18\mathrm{cm}\), \(\mathrm{CD} = 8\mathrm{cm}\), find AD.', NULL, 'Similarity', 'short', 6, '07f75d__UnknownSch_p6_img_2_jpeg.webp', NULL),
  ('MQ-07f75d-1-13', '07f75d', 61, '1', '1. In the given figure, O is the centre of the circle. Tangents at A and B meet at C. If ∠ACO = 30°, find :

(i) \(\angle BCO\)
(ii) \(\angle AOB\)
(iii) \(\angle APB\)', NULL, 'Circles', 'short', 6, '07f75d__UnknownSch_p6_img_3_jpeg.webp', NULL),
  ('MQ-07f75d-2-13', '07f75d', 62, '2', '2. In the figure given below, O is the centre of the circle and SP is a tangent. If ∠SRT = 65°, find the value of x, y and z.
(P.O.C.I.B - 100%)', NULL, 'Circles', 'short', 6, '07f75d__UnknownSch_p6_img_4_jpeg.webp', NULL),
  ('MQ-07f75d-3-12', '07f75d', 63, '3', '3. In the figure given, O is the centre of the circle.
∠DAE = 70°. Find giving suitable reasons,
the measure of :

(i) \(\angle BCD\)
(ii) \(\angle BOD\)
(iii) \(\angle OBD\)', NULL, 'Circles', 'short', 7, '07f75d__UnknownSch_p7_img_0_jpeg.webp', NULL),
  ('MQ-07f75d-4-10', '07f75d', 64, '4', '4. PQRS is a cyclic quadrilateral. Given ∠QPS = 73°, ∠PQS = 55° and ∠PSR = 82°,
calculate:
(i) \(\angle QRS\)
(ii) \(\angle RQS\)
(iii) \(\angle PRQ\)', NULL, 'Circles', 'short', 7, '07f75d__UnknownSch_p7_img_1_jpeg.webp', NULL),
  ('MQ-07f75d-5-6', '07f75d', 65, '5', '5. In triangle PQR, PQ = 24 cm, QR = 7 cm and
∠PQR = 90°.

Find the radius of the inscribed circle.

(P.O.C.I.B - 40%)', NULL, 'Circles', 'short', 7, '07f75d__UnknownSch_p7_img_2_jpeg.webp', NULL),
  ('MQ-07f75d-6-4', '07f75d', 66, '6', '6. In the figure given, diameter AB and chord
CD of a circle meet at P. PT is a tangent to
the circle at T. CD= 7.8 cm, PD = 5 cm,
PB = 4 cm. Find :

(i) AB
(ii) the length of tangent PT.

(P.O.C.I.B - 70%)', NULL, 'Circles', 'short', 7, '07f75d__UnknownSch_p7_img_3_jpeg.webp', NULL),
  ('MQ-07f75d-7-1', '07f75d', 67, '7', '7. ABC is a triangle with AB = 10 cm, BC = 8 cm and
AC = 6 cm. Three circles are drawn touching each
Other with the vertices as their centres. Find the
radii of the three circles. (P.O.C.I.B - 10%)', NULL, 'Circles', 'short', 7, '07f75d__UnknownSch_p7_img_4_jpeg.webp', NULL),
  ('MQ-07f75d-1-14', '07f75d', 68, '1', '1. Draw a circle of radius \(4.5 \mathrm{~cm}\). Draw two tangents to this circle so that the angle between the tangents is \(45^{\circ}\). (P.O.C.I.B - 30%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-2-14', '07f75d', 69, '2', '2. Draw a circle of radius \(3\mathrm{cm}\). Mark a point \(\mathrm{P}\) at a distance of \(5\mathrm{cm}\) from the centre of the circle drawn. Draw 2 tangents PA and PB to the given circle and measure the length of each tangent. (P.O.C.I.B - 30%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-3-13', '07f75d', 70, '3', '3. Construct a triangle ABC in which \(\mathrm{BC} = 5.5\mathrm{cm}\), \(\mathrm{AB} = 6\mathrm{cm}\) and \(\angle ABC = 120^{\circ}\). Construct a circle circumscribing the \(\Delta\) ABC. (P.O.C.I.B - 100%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-4-11', '07f75d', 71, '4', '4. Construct the incircle of an equilateral \(\Delta\)XYZ with side 6.3 cm. (100%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-5-7', '07f75d', 72, '5', '5. Construct regular hexagon of side \(4\mathrm{cm}\). Draw its circumcircle. (100%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-6-5', '07f75d', 73, '6', '6. Construct regular hexagon of side 5 cm. Draw its incircle. (P.O.C.I.B - 100%)', NULL, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-07f75d-1-15', '07f75d', 74, '1', '1. A solid cone of height 8 cm and base radius 6 cm is melted and recast into identical cones, each of height 2 cm and diameter 1 cm. Find the number of cones formed. (P.O.C.I.B - 100%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-2-15', '07f75d', 75, '2', '2. Two solid cylinders, one with diameter 60 cm and height 30 cm and the other with radius 30 cm and height 60 cm, are metled and recasted into a third solid cylinder of height 10 cm. Find the diameter of the cylinder formed. (P.O.C.I.B - 100%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-3-14', '07f75d', 76, '3', '3. Eight metallic spheres each of radius 2mm, are melted and cast into a single sphere. Calculate the radius of the new sphere. (P.O.C.I.B - 100%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-4-12', '07f75d', 77, '4', '4. From a rectangular solid of metal 42 cm by 20 cm by 30 cm, a conical cavity of diameter 14 cm and depth 24 cm is drilled out. (P.O.C.I.B - 70%) Find:(i) the volume of remaining solid, (ii) the surface area of remaining solid, (iii) the weight of the material drilled out if it weighs 7 gm per cm³.', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-5-8', '07f75d', 78, '5', '5. A wooden toy is in the shape of a cone mounted on a cylinder as shown alongside. If the height of the cone is 24 cm, the total height of the toy is 60 cm and the radius of the base of the cone is twice the radius of the base of the cylinder is 10 cm; find the total surface area of the toy. [Take π = 3.14]
(P.O.C.I.B - 70%)', NULL, 'Mensuration', 'short', 8, '07f75d__UnknownSch_p8_img_0_jpeg.webp', NULL),
  ('MQ-07f75d-6-6', '07f75d', 79, '6', '6. A vessel, in the form of an inverted cone, is filled with water to the brim. Its height is 32 cm and diameter of the base is 25.2 cm. Six equal solid cones are dropped in it, so that they are fully submerged. As a result, one-fourth of water in the original cone overflows. What is the volume of each of the solid cones submerged? (P.O.C.I.B - 1%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-7-2', '07f75d', 80, '7', '7. The internal and external diameters of a hollow hemispherical vessel are 21 cm and 28 cm respectively. Find its total surface area. (P.O.C.I.B - 50%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-8-1', '07f75d', 81, '8', '8. A circular tank of diameter 2 m is dug and the earth removed is spread uniformly all around the tank to form an embankment 2 m in width and 1.6 m in height. Find the depth of the circular tank. (P.O.C.I.B - 1%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-9-1', '07f75d', 82, '9', '9. A circus tent is cylindrical to a height of 8m surmounted by a conical part. If total height of the tent is 13m and the diameter of its base is 24m; calculate: (i) total surface area of the tent (ii) Area of canvas, required to make this tent allowing 10% of the canvas used for folds and stitching. (P.O.C.I.B - 1%)', NULL, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-07f75d-1-16', '07f75d', 83, '1', '1. $$\frac{\cos A}{1 - \tan A} + \frac{\sin A}{1 - \cot A} = \cos A + \sin A$$ (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-2-16', '07f75d', 84, '2', '2. (1 + cot A - cosec A) (1 + tan A + sec A) = 2 (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-3-15', '07f75d', 85, '3', '3. $$\frac{\sin \theta - 2 \sin^3 \theta}{2 \cos^3 \theta \cos \theta} = \tan \theta$$ (P.O.C.I.B - 70%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-4-13', '07f75d', 86, '4', '4. (sin A + cosec A)² + (cos A + sec A)² = 7 + tan²A + cot²A (P.O.C.I.B - 70%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-5-9', '07f75d', 87, '5', '5. $$\frac{\cot^2 A}{(\cosec A + 1)^2} = \frac{1 - \sin A}{1 + \sin A}$$ (P.O.C.I.B - 50%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-6-7', '07f75d', 88, '6', '6. $$\frac{\sec A - \tan A}{\sec A + \tan A} = 1 - 2 \sec A \tan A + 2 \tan^2 A$$ (P.O.C.I.B - 20%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-7-3', '07f75d', 89, '7', '7. $$\sqrt{\frac{1 + \sin A}{1 - \sin A}} = \sec A + \tan A$$ (P.O.C.I.B - 20%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-8-2', '07f75d', 90, '8', '8. $$\sqrt{\frac{1 - \cos A}{1 + \cos A}} = \frac{\sin A}{1 + \cos A}$$ (P.O.C.I.B - 20%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-9-2', '07f75d', 91, '9', '9. $$1 - \frac{\cos^2 A}{1 + \sin A} = \sin A$$ (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-10-0', '07f75d', 92, '10', '10. $$\frac{1}{\cos A + \sin A - 1} + \frac{1}{\cos A + \sin A + 1} = \csc A + \sec A$$ (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-1-17', '07f75d', 93, '1', '1. Find the height of a tree when it is found that on walking away from it 20 m, in a horizontal line through its base, the elevation of its top changes from 60° to 30°. (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-2-17', '07f75d', 94, '2', '2. From the top of a cliff, 60 meters high, the angle of depression of the top and bottom of tower is observed to be 30° and 60°. Find the height of the tower. (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-3-16', '07f75d', 95, '3', '3. From the top of a light house 100 m high, the angles of depression of two ships are observed as 48° and 36° respectively. Find the distance between the two ships (in the nearest metre) if the ships are on the opposite side of the light house. (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-4-14', '07f75d', 96, '4', '4. The angle of elevation of the top of an unfinished tower at a point distance 80 m from its base is 30°. How much higher must the tower be raised so that its angle of elevation at the same point may be 60°? (P.O.C.I.B - 100%)', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-07f75d-5-10', '07f75d', 97, '5', '5. An aeroplane flying horizontally 1 km above the ground and going away from the observer is observed at an elevation of 60°. After 10 seconds, its elevation is observed to be 30°; find the uniform speed of the aeroplane in km per hour. (P.O.C.I.B - 1%)', NULL, 'Trigonometry', 'short', 10, NULL, NULL),
  ('MQ-07f75d-6-8', '07f75d', 98, '6', '6. The angle of elevation of a cloud from a point 60m above a lake is 30° and the angle of depression of the reflection of cloud in the lake is 60°. Find the height of the cloud from lake surface. (P.O.C.I.B - 1%)', NULL, 'Trigonometry', 'short', 10, NULL, NULL),
  ('MQ-07f75d-1-18', '07f75d', 99, '1', '1. (i) Using step-deviation method, calculate the mean marks of the following distribution.
(ii) State the modal class.

| Class interval | Frequency |
| --- | --- |
| 50 - 55 | 5 |
| 55 - 60 | 20 |
| 60 - 65 | 10 |
| 65 - 70 | 10 |
| 70 - 75 | 9 |
| 75 - 80 | 6 |
| 80 - 85 | 12 |
| 85 - 90 | 8 |

(P.O.C.I.B - 100%)', NULL, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-07f75d-2-18', '07f75d', 100, '2', '2. A mathematics aptitude test of 50 students was recorded as follows :

| Marks | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 8 | 14 | 19 | 5 |

Draw a histogram for the above data using a graph paper and locate the mode. (P.O.C.I.B - 100%)', NULL, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-07f75d-3-17', '07f75d', 101, '3', '3. The following distribution represents the height of 160 students of a school.

| Height (in cm) | No. of students |
| --- | --- |
| 140 - 145 | 12 |
| 145 - 150 | 20 |
| 150 - 155 | 30 |
| 155 - 160 | 38 |
| 160 - 165 | 24 |
| 165 - 170 | 16 |
| 170 - 175 | 12 |
| 175 - 180 | 8 |

Draw an ogive for the given distribution taking 2 cm = 5 cm of height on one axis and 2 cm = 20 students on the other axis. Using the graph, determine :

(i) The median height
(ii) The interquartile range. (P.O.C.I.B - 100%)
(iii) The number of students whose height is above 172 cm.', NULL, 'Statistics', 'short', 10, NULL, NULL),
  ('MQ-07f75d-4-15', '07f75d', 102, '4', '4. Calculate the mean of the distribution given below using short-cut method.

| Marks | 11-20 | 21-30 | 31-40 | 41-50 | 51-60 | 61-70 | 71-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 2 | 6 | 10 | 12 | 9 | 7 | 4 |', NULL, 'Statistics', 'short', 11, NULL, NULL),
  ('MQ-07f75d-5-11', '07f75d', 103, '5', '5. If the mean of the following distribution is 24, find the value of ''a''

| Marks | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| --- | --- | --- | --- | --- | --- |
| Number of Students | 7 | a | 8 | 10 | 5 |', NULL, 'Statistics', 'short', 11, NULL, NULL),
  ('MQ-07f75d-1-19', '07f75d', 104, '1', '1. Cards bearing numbers 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20 are kept in a bag. A card is drawn at random from the bag. Find the probability of getting a card which is:

- (i) A prime number
- (ii) A number divisible by 4
- (iii) A number that is multiple of 6
- (iv) An odd number.

(P.D.C.I.B - 100%)', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-07f75d-2-19', '07f75d', 105, '2', '2. Sixteen cards are labelled as a, b, c ... m, n, o, p. They are put in a box and shuffled. A boy is asked to draw a card from the box. What is the probability that the card drawn is:

- (i) a vowel.
- (ii) a consonant
- (iii) none of the letters of the word median.

(P.D.C.I.B - 100%)', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-07f75d-3-18', '07f75d', 106, '3', '3. From a pack of 52 playing cards all cards whose numbers are multiples of 3 are removed. A card is now drawn at random What is the probability that the card drawn is:

- (i) a face card (King, Jack or Queen)
- (ii) an even numbered red card?

(P.D.C.I.B - 20%)', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-07f75d-4-16', '07f75d', 107, '4', '4. Two coins are tossed once. Find the probability of getting:

- (i) 2 heads
- (ii) at least 1 tail', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-07f75d-5-12', '07f75d', 108, '5', '5. When 3 coins are tossed simultaneously, what is the probability of finding:

- (i) At most 1 tail?
- (ii) At least 2 tails?
- (iii) Not less than 2 heads?

(P.D.C.I.B - 20%)', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-07f75d-6-9', '07f75d', 109, '6', '6. A box contains some black balls and 30 white balls. If the probability of drawing a black ball is two-fifth of a white ball, find the number of black balls in the box.

(P.D.C.I.B - 10%)', NULL, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-1be9d6-15-0', '1be9d6', 0, '15', '(15)

A circle with centre O, diameter AB and a chord AD is drawn. Another circle is drawn with AO as diameter to cut AD at C. Prove that BD = 2 OC.', NULL, 'Circles', 'short', 1, '1be9d6__UnknownSch_p1_img_0_jpeg.webp', NULL),
  ('MQ-1be9d6-16-0', '1be9d6', 1, '16', '(16) In the adjoining figure, chords AB and CD of a circle meet internally at P. Given that

AP = 3 cm, AB = 9 cm and CP = 2.4 cm.

(i) Prove that triangles ACP and DBP are similar.
(ii) Find PD.
(iii) Find $$\frac{\text{area of } \triangle ACP}{\text{area of } \triangle DBP}$$', NULL, 'Circles', 'short', 1, '1be9d6__UnknownSch_p1_img_1_jpeg.webp', NULL),
  ('MQ-1be9d6-17-0', '1be9d6', 2, '17', '(17) Using the circle, find the value of x in each of the following figure.', NULL, 'Circles', 'short', 1, NULL, NULL),
  ('MQ-1be9d6-3-0', '1be9d6', 3, '3', '3) In the figure given below, QPX is the bisector of ∠YXZ of the triangle XYZ. Prove

that XY : XQ = XP : XZ', NULL, 'Similarity', 'short', 2, '1be9d6__UnknownSch_p2_img_0_jpeg.webp', NULL),
  ('MQ-1be9d6-4-0', '1be9d6', 4, '4', 'In the figure given below, chords BA and DC of a circle meet at P. Prove that

(i) ∠PAD = ∠PCB
(ii) PA x PB = PC x PD', NULL, 'Circles', 'short', 2, '1be9d6__UnknownSch_p2_img_1_jpeg.webp', NULL),
  ('MQ-1be9d6-49-0', '1be9d6', 5, '49', '(49) In the given figure, PQRS is a cyclic quadrilateral. PQ and SR produced meet at T.

(i) Prove that $\Delta TPS \sim \Delta TRQ$
(ii) Find SP if TP = 18 cm, RQ = 4 cm and TR = 6 cm.
(iii) Find the area of quadrilateral PQRS if area of $\Delta TPS = 27 \text{ cm}^2$.', NULL, 'Circles', 'short', 3, '1be9d6__UnknownSch_p3_img_0_jpeg.webp', NULL),
  ('MQ-1be9d6-87-0', '1be9d6', 6, '87', '(87) In the given figure, PM is a tangent to the circle and PA = AM. Prove that

(i) ΔPMB is isosceles.
(ii) PA.PB = MB²', NULL, 'Circles', 'short', 4, '1be9d6__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-1be9d6-99-0', '1be9d6', 7, '99', '(99) In the given figure, AC is a transverse common tangent to two circles with centres P and Q and of radii 6 cm and 3 cm respectively. Given that AB = 8 cm, calculate PQ.', NULL, 'Circles', 'short', 5, '1be9d6__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-1be9d6-110-0', '1be9d6', 8, '110', '(110) In the adjoining figure, CBA is a secant and CD is tangent to the circle. If AB = 7 cm

and BC = 9 cm, then

(i) prove that ΔACD ~ ΔDCB
(ii) find the length of CD.', NULL, 'Circles', 'short', 6, '1be9d6__UnknownSch_p6_img_0_jpeg.webp', NULL),
  ('MQ-1ff52b-1-0', '1ff52b', 0, '1', '(i) For an intrastate transaction, marked price is ₹15,000, discount = 30%, GST = 18%, the amount of CGST is equal to', NULL, 'GST and Banking', 'MCQ', 1, NULL, array['₹1,890', '₹945', '₹10,500', '₹11,445']::text[]),
  ('MQ-1ff52b-1-1', '1ff52b', 1, '1', '(ii) Hritika deposited ₹1500 per month for 2 years in a Recurring Deposit Account. On maturity, she received ₹38,000. The interest received by her is', NULL, 'GST and Banking', 'MCQ', 1, NULL, array['₹2,000', '₹1,500', '₹2,500', '₹3,000']::text[]),
  ('MQ-1ff52b-1-2', '1ff52b', 2, '1', '(iii) Statement 1: When each term of an inequation is multiplied or divided by the same positive number, the sign of inequality remains the same.
Statement 2: If both sides of an equation are positive or both negative, sign of inequality changes when their reciprocals are taken.', NULL, 'Linear Inequations', 'MCQ', 1, NULL, array['Both statements are correct', 'Both statements are incorrect', 'Only statement 1 is correct', 'Only statement 2 is correct']::text[]),
  ('MQ-1ff52b-1-3', '1ff52b', 3, '1', '(iv) The value of ''y'' which satisfies the equation (y + 5) (y - 5) = 24 will be', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['7', '1', '±7', '±1']::text[]),
  ('MQ-1ff52b-1-4', '1ff52b', 4, '1', '(v) Given matrix $$\left[\begin{matrix}4\sin 30^{\circ} & \cos 0^{\circ}\\ \cos 0^{\circ} & 4\sin 30^{\circ}\end{matrix}\right]$$ and $$B = \left[\begin{matrix}4\\ 5\end{matrix}\right]$$. If AX = B. then the order of matrix X is', NULL, 'Matrices', 'MCQ', 1, NULL, array['1 × 1', '2 × 2', '1 × 2', '2 × 1']::text[]),
  ('MQ-1ff52b-1-5', '1ff52b', 5, '1', '(vi) If $$-7x \leq 77$$, then the value of x will be', NULL, 'Linear Inequations', 'MCQ', 1, NULL, array['x > -11', '\(x > 11\)', '\(x \leq -11\)', '\(x \geq -11\)']::text[]),
  ('MQ-1ff52b-1-6', '1ff52b', 6, '1', '(vii) The arithmetic mean of $-5$ and $41$ is', NULL, 'Arithmetic Progression', 'MCQ', 2, NULL, array['13', '6', '12', '18']::text[]),
  ('MQ-1ff52b-1-7', '1ff52b', 7, '1', '(viii) A die has 6 faces marked by the given numbers as shown below:
-1
-2
-3
The die is thrown once. The probability of getting the square root of 4 is', NULL, 'Probability', 'MCQ', 2, NULL, array['$\frac{1}{3}$', '$\frac{2}{3}$', '$\frac{1}{2}$', '$\frac{1}{6}$']::text[]),
  ('MQ-1ff52b-1-8', '1ff52b', 8, '1', '(ix) The height of a circular cylinder is $20 \, \text{cm}$ and the radius of its base is $7 \, \text{cm}$ , then the volume will be', NULL, 'Mensuration', 'MCQ', 2, NULL, array['$3,800 \, \text{cm}^3$', '$3,880 \, \text{cm}^3$', '$3,080 \, \text{cm}^3$', '$3,380 \, \text{cm}^3$']::text[]),
  ('MQ-1ff52b-1-9', '1ff52b', 9, '1', '(x) Two chords, AB and CD of a circle meet at a point O, outside the circle. It is given that AB = 7 cm, CD = 4 cm, and OB = 5 cm. What is the length of OD?', NULL, 'Circles', 'MCQ', 2, '1ff52b__UnknownSch_p2_img_0_jpeg.webp', array['\(4 \mathrm{~cm}\)', '\(5 \mathrm{~cm}\)', '\(6 \mathrm{~cm}\)', '\(7 \mathrm{~cm}\)']::text[]),
  ('MQ-1ff52b-1-10', '1ff52b', 10, '1', '(xi) If one dividing $2x^3 + 3x^2 - kx + 5$ by $x - 2$ , leaves a remainder 7, then the value of $k$ is', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['13', '7', '3', '17']::text[]),
  ('MQ-1ff52b-1-11', '1ff52b', 11, '1', '(xii) If $A = \begin{bmatrix} 1 & 3 \\ 3 & 4 \end{bmatrix}$ , then $A^2 =$', NULL, 'Matrices', 'MCQ', 2, NULL, array['$\begin{bmatrix} 15 & 15 \\ 15 & 25 \end{bmatrix}$', '$\begin{bmatrix} 10 & 15 \\ 15 & 25 \end{bmatrix}$', '$\begin{bmatrix} 5 & 15 \\ 15 & 25 \end{bmatrix}$', '$\begin{bmatrix} 0 & 15 \\ 15 & 25 \end{bmatrix}$']::text[]),
  ('MQ-1ff52b-1-12', '1ff52b', 12, '1', '(xiii) The image of the point A (5, -3), under reflection in the point P (-1, 3) is', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['\((-7, -9)\)', '\((7, -9)\)', '\((-7,9)\)', '(7, 9)']::text[]),
  ('MQ-1ff52b-1-13', '1ff52b', 13, '1', '(xiv) For a given A.P., If $S_1 = 9$ , $S_2 = 29$ , $S_3 = 57$ , then the common difference is equal to (S = Sum of the given terms)', NULL, 'Arithmetic Progression', 'MCQ', 2, NULL, array['20', '-10', '10', 'Indeterminate']::text[]),
  ('MQ-1ff52b-1-14', '1ff52b', 14, '1', '(xv) $\frac{\cos A}{1 + \sin A} + \tan A =$', NULL, 'Trigonometry', 'MCQ', 2, NULL, array['$\sin A$', '$\cos A$', 'cosec A', 'sec A']::text[]),
  ('MQ-1ff52b-2-0', '1ff52b', 15, '2', '(i) A solid metallic sphere of radius 6 cm is melted and made into a solid cylinder of height 32 cm. Find the:

(a) radius of the cylinder.
(b) curved surface area of the cylinder. (Take π = 3.1).', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-1ff52b-2-1', '1ff52b', 16, '2', '(ii) In a mathematics test, 90 students obtained the marks (out of 100) given in the following table:

| Marks | 1-20 | 20-40 | 40-60 | 60-80 | 80-100 |
| --- | --- | --- | --- | --- | --- |
| No. of Students | 8 | 12 | 38 | 20 | 12 |

Find the probability that a student obtained:

(a) less than 40 marks.
(b) more than 59 marks.
(c) between 39 and 80.
(d) 100 marks,', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-1ff52b-2-2', '1ff52b', 17, '2', '(iii) In the given figure, CE is a tangent to the circle at point C. ABCD is a cyclic quadrilateral. If ∠ABC = 93° and ∠DCE = 35°. Find:

(a) ∠ADC
(b) ∠CAD
(c) ∠ACD', NULL, 'Circles', 'short', 3, '1ff52b__UnknownSch_p3_img_0_jpeg.webp', NULL),
  ('MQ-1ff52b-3-0', '1ff52b', 18, '3', '(i) In Δ ABC, ∠ABC = ∠DAC, AB = 8 cm, AC = 4 cm, AD = 5 cm.

(a) Prove that \(\Delta\) ACD is similar to \(\Delta\) BCA.
(b) Find BC and CD.', NULL, 'Similarity', 'short', 3, '1ff52b__UnknownSch_p3_img_1_jpeg.webp', NULL),
  ('MQ-1ff52b-3-1', '1ff52b', 19, '3', '(i) Shahrukh opened a recurring deposit account in a bank and deposited ₹800 every month for 18 months. If he received ₹15,084 at the time of maturity, find the rate of interest per annum.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-1ff52b-3-2', '1ff52b', 20, '3', '(ii) Use graph paper for this question. The points A (2, 3), B (4, 5), and C (7, 2) are the vertices of \(\Delta\) ABC.

(a) Write down the coordinates of A'', B'', and C'', if A'' B'' C'' is the image of \(\Delta\) ABC, when reflected in the origin.
(b) Write down the coordinates of A", B", and C", if A" B" C" is the image of \(\Delta\) ABC, when reflected in the x-axis.
(c) Mention the geometrical name of the quadrilateral BCC"B" and find its area.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-1ff52b-4-0', '1ff52b', 21, '4', '(ii) Prove that \(\sqrt{\sec^2 A + \cosec^2 A} = \tan A + \cot A\)', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-4-1', '1ff52b', 22, '4', '(iii) In a certain A.P. \(32^{\text{th}}\) term is twice the \(12^{\text{th}}\) term. Prove that \(70^{\text{th}}\) term is twice the \(31^{\text{st}}\) term.', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-4-2', '1ff52b', 23, '4', '(iv) A and B are two points on the x-axis and y-axis, respectively. If P (2, -3) is the midpoint of AB, then find the:

(a) The coordinates of A and B.
(b) Slope of line AB.
(c) Equation of line AB.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-5-0', '1ff52b', 24, '5', '(i) A metallic cylinder has radius \(3\mathrm{cm}\) and height \(5\mathrm{cm}\). To reduce its weights, a conical hole is drilled in the cylinder. The conical hole has a radius of \(1.5\mathrm{cm}\) and its depth is \(\frac{8}{9}\mathrm{cm}\). Calculate the ratio of the volume of metal left in the cylinder to the volume of metal taken out in conical shape.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-5-1', '1ff52b', 25, '5', '(ii) Find the value of ''a'' for which the following points A (a, 3), B (2, 1), and C (5, a) are collinear. Hence, find the equation of the line. Consider only the positive value of ''a''.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-5-2', '1ff52b', 26, '5', '(iii) From two points A and B on the same side of a building, the angles of elevation of the top of the building are \(30^{\circ}\) and \(60^{\circ}\), respectively. If the height of the building is \(10\mathrm{m}\), then find the distance between A and B correct to two decimal places.', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-6-0', '1ff52b', 27, '6', '(i) Given \(\frac{x^3 + 12x}{6x^2 + 8} = \frac{y^3 + 27y}{9y^2 + 27}\). Using componendo and dividendo find \(x: y\).', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-6-1', '1ff52b', 28, '6', '(ii) The following table gives the weekly wages of workers in a factory:

| Weekly wages | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Workers | 5 | 20 | 10 | 10 | 9 | 6 | 12 | 8 |

Use graph paper for only (c). Take scale 2 cm = ₹5 on one axis and 2 cm = 10 workers on the other. Calculate:

(a) the mean by step-deviation method.
(b) the modal class.
(c) the number of workers getting ₹65 or more but less than ₹85 as weekly wages.', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-1ff52b-7-0', '1ff52b', 29, '7', '(i) Find the ratio in which the line joining (2, -2) and (3, 7) is divided by the line 2x + y = 4.', NULL, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-7-1', '1ff52b', 30, '7', '(ii) Solve the following inequation and represent the solution on the number line:

$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x, x \in I$$', NULL, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-7-2', '1ff52b', 31, '7', '(iii) In the given figure, AD is a diameter. O is the centre of the circle. AD is parallel to BC and ∠CBD = 32°. Find:

(a) ∠OBD
(b) ∠AOB
(c) ∠BED', NULL, 'Circles', 'short', 5, '1ff52b__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-1ff52b-8-0', '1ff52b', 32, '8', '(i) In the adjoining figure if ∠DAB = 60° and ∠ACB = 70°, find the measure of ∠DBA.', NULL, 'Circles', 'short', 5, '1ff52b__UnknownSch_p5_img_1_jpeg.webp', NULL),
  ('MQ-1ff52b-8-1', '1ff52b', 33, '8', '(ii) Find ''a'' if the two polynomials ax³ + 3x² - 9 and 2x³ + 4x + a, leave the same remainder when divided by x + 3.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-8-2', '1ff52b', 34, '8', '(iii) A positive number is divided into two parts, such that the sum of the squares of the two numbers is 208. The square of the larger part is 18 times the smaller part. Taking x as the smaller part of the two parts, find the number.', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-9-0', '1ff52b', 35, '9', '(i) Prove that: $$\frac{\cos^2 A + \tan^2 A - 1}{\sin^2 A} = \tan^2 A$$', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-9-1', '1ff52b', 36, '9', '(ii) The given numbers A + 3, A + 2, 3A - 7 and 2A - 3 are in proportion. Find ''A''.', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-9-2', '1ff52b', 37, '9', '(iii) A shopkeeper buys a printer at a discount of 30% on the marked price of ₹8,000. He sells the printer to a customer at marked price. GST charged at each stage is 18%. If the sales are intra-state, find:

(a) The GST paid by the shopkeeper to the Central Government.
(b) The price paid by the shopkeeper for the article inclusive of tax.
(c) The price paid by the consumer.
(d) The amount of tax received by the State Government.', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-1ff52b-10-0', '1ff52b', 38, '10', '(i) For what value of ''K'' will the following quadratic equation:

(K + 1) x² - 4Kx + 9 = 0, have real and equal roots? Solve the equation.', NULL, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-1ff52b-10-1', '1ff52b', 39, '10', '(ii) Using ruler and compass only, draw a circle of radius 4 cm, Mark a point P at a distance of 6 cm from the centre of the circle drawn. Draw two tangents PA and PB to the given circle and measure the length of each tangent. All traces of constructions must be visible.', NULL, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-1ff52b-10-2', '1ff52b', 40, '10', '(iii) Use graph paper for this question. A survey regarding height (in cm) of 60 boys belonging to class X of a school was conducted. The following date was recorded.

| Height (cm) | 135-140 | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Taking 2 cm = height of 10 cm along one axis and 2 cm = 10 boys along the other axis draw an ogive of the above distribution. Use the graph to estimate the following:

- (a) The median.
- (b) Lower quartile.', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-320caf-Example 1-0', '320caf', 0, 'Example 1', 'Example 1: A tower is 30 m high. A man standing at some distance from the tower observes that the angle of elevation of the top of the tower is 60°. How far is he from the foot of the tower?', NULL, 'Trigonometry', 'short', 1, '320caf__UnknownSch_p1_img_0_jpeg.webp', NULL),
  ('MQ-320caf-Example 4-0', '320caf', 1, 'Example 4', 'Example 4: A man stands at a point A on the bank of a river and looks at the top of a tree exactly opposite to him on the other bank and finds that the angle of elevation of the top of the tree is $60^{\circ}$. When he moves $50\mathrm{m}$ away from the bank, he finds the angle of elevation to be $30^{\circ}$. Calculate

(i) the width of the river.

(ii) the height of the tree.', NULL, 'Trigonometry', 'short', 3, '320caf__UnknownSch_p3_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 5-0', '320caf', 2, 'Example 5', 'Example 5: A man on the top of a tower observes a car moving at a uniform speed towards it. If it takes 12 minutes for the angle of depression to change from $30^{\circ}$ to $45^{\circ}$, how soon will the car reach the tower? Give the answer correct to nearest second.', NULL, 'Trigonometry', 'short', 5, '320caf__UnknownSch_p5_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 7-0', '320caf', 3, 'Example 7', 'Example 7: From the top of a church spire which is 96 m high, the angles of depression of 2 cars on the road on the same side of the church are $x^{\circ}$ and $y^{\circ}$ where $\tan x^{\circ} = \frac{3}{4}$ and $\tan y^{\circ} = \frac{1}{3}$. Find the distance between the cars.', NULL, 'Trigonometry', 'short', 6, '320caf__UnknownSch_p6_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 9-0', '320caf', 4, 'Example 9', 'Example 9: From the top of building AB if the top of building CD is observed, the angle of elevation of the top C is $30^{\circ}$ and the angle of depression of the foot D is $60^{\circ}$. If the height of AB is $18\mathrm{m}$, find

(i) the height of CD.

(ii) the distance between AB and CD.', NULL, 'Trigonometry', 'short', 7, '320caf__UnknownSch_p7_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 10-0', '320caf', 5, 'Example 10', 'Example 10: From the top of a tower $60\mathrm{m}$ high, the angles of depression of the top and bottom of a building are observed to be $30^{\circ}$ and $60^{\circ}$ respectively. Find the height of the building and the distance between them. [2013]', NULL, 'Trigonometry', 'short', 8, '320caf__UnknownSch_p8_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 12-0', '320caf', 6, 'Example 12', 'Example 12: Two lamp posts of equal height are standing opposite to each other on each side of a road, which is $80\mathrm{m}$ wide. From a point between them on the road, the angle of elevation of the top of the posts are $60^{\circ}$ and $30^{\circ}$ respectively. Find the height of the lamp posts and the distance of the point from the lamp posts.', NULL, 'Trigonometry', 'short', 9, '320caf__UnknownSch_p9_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 13-0', '320caf', 7, 'Example 13', 'Example 13: In the given figure, find AD if BC = 100 ... (ACD ... 20.25) A', NULL, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-320caf-Example 14-0', '320caf', 8, 'Example 14', 'Example 14: There is a coconut tree on the bank of a river. From a boat 5 m above water, the angle of elevation of the top of the tree is $45^{\circ}$ and the angle of depression of reflection of tree top is $60^{\circ}$. Find the height of the tree.', NULL, 'Trigonometry', 'short', 10, '320caf__UnknownSch_p10_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 17-0', '320caf', 9, 'Example 17', 'Example 17: When a building under construction was observed from a point P 120 m from its base, the angle of elevation of the top was 30°. After its completion when it was again observed from the same point, the angle changed to 60°. How much higher was the building raised, from the time it was first observed?', NULL, 'Trigonometry', 'short', 12, '320caf__UnknownSch_p12_img_1_jpeg.webp', NULL),
  ('MQ-320caf-Example 18-0', '320caf', 10, 'Example 18', 'Example 18: From the top of a hill, the angles of depression of two consecutive kilometre stones, due east are round to be $30^{\circ}$ and $45^{\circ}$ respectively. Find the distance of the two stones from the foot of the hill. [2007]', NULL, 'Trigonometry', 'short', 13, '320caf__UnknownSch_p13_img_0_jpeg.webp', NULL),
  ('MQ-320caf-6-0', '320caf', 11, '6', '6. A vertical tower is 20 m high. A mean standing at some distance from the tower knows that the cosine of the angle of elevation of the top of the tower is 0.53. How far is the standing from the foot of the tower? [2002]', NULL, 'Trigonometry', 'short', 14, '320caf__UnknownSch_p14_img_0_jpeg.webp', NULL),
  ('MQ-320caf-7-0', '320caf', 12, '7', '7. A man standing on the bank of a river observes that the angle of elevation of a tree on the opposite bank is $60^{\circ}$. When he moves $50\mathrm{m}$ away from the bank, he finds the angle of elevation to be $30^{\circ}$. Calculate:

(i) the width of the river and
(ii) the height of the tree. [2003]', NULL, 'Trigonometry', 'short', 16, '320caf__UnknownSch_p16_img_0_jpeg.webp', NULL),
  ('MQ-320caf-8-0', '320caf', 13, '8', '8. Two people standing on the same side of a tower in a straight line with it, measure the angles of elevation of the top of the tower as 25° and 50° respectively. If the height of the tower is 70 m, find the distance between the two people. [2004]', NULL, 'Trigonometry', 'short', 18, '320caf__UnknownSch_p18_img_0_jpeg.webp', NULL),
  ('MQ-320caf-10-0', '320caf', 14, '10', '10. A vertical pole and a vertical tower are on the same level ground. From the top of the pole the angle of elevation of the top of the tower is $60^{\circ}$ and the angle of depression of the foot of the tower is $30^{\circ}$. Find the height of the tower if the height of the pole is $20\mathrm{m}$.

[2008]', NULL, 'Trigonometry', 'short', 20, '320caf__UnknownSch_p21_img_0_jpeg.webp', NULL),
  ('MQ-320caf-11-0', '320caf', 15, '11', '11. From two points A and B on the same side of a building, the angles of elevation of the top of the building are $30^{\circ}$ and $60^{\circ}$ respectively. If the height of the building is $10\mathrm{m}$ , find the distance between A and B correct to two decimal places. [2009]', NULL, 'Trigonometry', 'short', 22, '320caf__UnknownSch_p22_img_0_jpeg.webp', NULL),
  ('MQ-320caf-12-0', '320caf', 16, '12', '12. From the top of a light house $100\mathrm{m}$ high the angles of depression of two ships on opposite sides of it are $48^{\circ}$ and $36^{\circ}$ respectively. Find the distance between the two ships to the nearest metre.', NULL, 'Trigonometry', 'short', 24, '320caf__UnknownSch_p24_img_0_jpeg.webp', NULL),
  ('MQ-320caf-13-0', '320caf', 17, '13', '13. A man observes the angle of elevation of the top of a building to be $30^{\circ}$. He walks towards it in horizontal line through its base. On covering $60\mathrm{m}$, the angle of elevation changes to $60^{\circ}$. Find the height of the building to the nearest metre. [2011]', NULL, 'Trigonometry', 'short', 26, NULL, NULL),
  ('MQ-320caf-14-0', '320caf', 18, '14', '14. As observed from the top of a 80 m tall lighthouse, the angles of depression of two ships on the same side of the light house in horizontal line with its base are 30° and 40° respectively. Find the distance between the two ships. Give your answer correct to the nearest metre. [2012]', NULL, 'Trigonometry', 'short', 28, '320caf__UnknownSch_p28_img_0_jpeg.webp', NULL),
  ('MQ-320caf-15-0', '320caf', 19, '15', '15. An aeroplane at an altitude of 250 m observes the angle of depression of two boats on the opposite banks of a river to be 45° and 60° respectively. Find the width of the river. Write the answer correct to the nearest whole number. [2014]', NULL, 'Trigonometry', 'short', 30, '320caf__UnknownSch_p30_img_0_jpeg.webp', NULL),
  ('MQ-320caf-16-0', '320caf', 20, '16', '16. The horizontal distance between two towers is 120 m. The angle of elevation of the top and angle of depression of the bottom of the first tower as observed from the second tower is 30° and 24° respectively.

Find the height of the two towers. Give your answer correct to 3 significant figures.

[2015]', NULL, 'Trigonometry', 'short', 31, '320caf__UnknownSch_p32_img_0_jpeg.webp', NULL),
  ('MQ-320caf-17-0', '320caf', 21, '17', '17. An aeroplane at an altitude of 1500 metres finds that two ships are sailing towards it in the same direction. The angles of depression as observed from the aeroplane are $45^{\circ}$ and $30^{\circ}$ respectively. Find the distance between the two ships. [2016]', NULL, 'Trigonometry', 'short', 33, '320caf__UnknownSch_p33_img_0_jpeg.webp', NULL),
  ('MQ-320caf-13-1', '320caf', 22, '13', '13. The angles of depression of two ships A and B as observed from the top of a lighthouse 60 m high are 60° and 45° respectively. If the two ships are on the opposite sides of the lighthouse, find the distance between the two ships. Give your answer correct to the nearest whole number. [2017]', NULL, 'Trigonometry', 'short', 34, '320caf__UnknownSch_p34_img_0_jpeg.webp', NULL),
  ('MQ-320caf-14-1', '320caf', 23, '14', '14. The angle of elevation from a point P of the top of a tower QR, 50 m high is 60° and that of the tower PT from a point Q is 30°. Find the height of the tower PT, correct to the nearest metre.
[2018]', NULL, 'Trigonometry', 'short', 36, '320caf__UnknownSch_p36_img_0_jpeg.webp', NULL),
  ('MQ-320caf-15-1', '320caf', 24, '15', '15. A man observes the angle of elevation of the top of the tower to be 45°. He walks towards it in a horizontal line through its base. On covering 20 m the angle of elevation changes to 60°. Find the height of the tower correct to 2 significant figures.

[2019]', NULL, 'Trigonometry', 'short', 37, '320caf__UnknownSch_p38_img_0_jpeg.webp', NULL),
  ('MQ-320caf-16-1', '320caf', 25, '16', '16. From the top of a cliff, the angle of depression of the top and bottom of a tower are observed to be 45° and 60° respectively. If the height of the tower is 20 m.

Find :

(i) the height of the cliff
(ii) the distance between the cliff and the tower.

[2020]', NULL, 'Trigonometry', 'short', 39, '320caf__UnknownSch_p40_img_0_jpeg.webp', NULL),
  ('MQ-3c98bf-194-0', '3c98bf', 0, '194', '194] $$\sec A (1 - \sin A) (\sec A + \tan A) = 1$$', NULL, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-3c98bf-195-0', '3c98bf', 1, '195', '195] $$(\csc A - \sin A) (\sec A - \cos A) (\tan A + \cot A) = 1$$', NULL, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-3c98bf-196-0', '3c98bf', 2, '196', '$$\frac{1}{1+\cos A} + \frac{1}{1-\cos A} = 2 \cosec^2 A$$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-3c98bf-197-0', '3c98bf', 3, '197', '197]

$$\frac{\cot^2 A}{(\csc A + 1)^2} = \frac{1 - \sin A}{1 + \sin A}$$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-3c98bf-198-0', '3c98bf', 4, '198', '$$\sqrt{\frac{1 - \sin A}{1 + \sin A}} = \frac{\cos A}{1 + \sin A}$$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-3c98bf-199-0', '3c98bf', 5, '199', '199) $$\frac{\cot A + \csc A - 1}{\cot A - \csc A + 1} = \frac{1 + \cos A}{\sin A}$$', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-3c98bf-200-0', '3c98bf', 6, '200', '$$LHS = \frac{\cos^3 A + \sin^3 A}{\cos A + \sin A} + \frac{\cos^3 A - \sin^3 A}{\cos A - \sin A}$$', NULL, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-3c98bf-201-0', '3c98bf', 7, '201', '201] $$(1 + \tan A \tan B)^2 + (\tan A - \tan B)^2 = \sec^2 A \sec^2 B$$', NULL, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-5c87d6-1-0', '5c87d6', 0, '1', '(i) If the cost of an article is Rs.25,000 and CGST paid by the owner is Rs.2,250, then the rate of GST is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['9%', '10%', '15%', '**18%**']::text[]),
  ('MQ-5c87d6-1-1', '5c87d6', 1, '1', '(ii) The roots of the quadratic equation $$2x^2 + x - 4 = 0$$ are:

(a) Positive and Negative

(b) Both Positive

(c) Both Negative

**(d) Not real roots**', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-5c87d6-1-2', '5c87d6', 2, '1', '(iii) When $$9x^2 - 6x + 2$$ is divided by $$x - 3$$, the remainder will be', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['**65**', '11', '0', '45']::text[]),
  ('MQ-5c87d6-1-3', '5c87d6', 3, '1', '(iv) If A and B are two matrices of orders $$3 \times 2$$ and $$3 \times 2$$ respectively, then the order of their sum is:', 1, 'Matrices', 'MCQ', 1, NULL, array['**3 × 2**', '$$2 \times 3$$', '$$2 \times 2$$', '$$3 \times 3$$']::text[]),
  ('MQ-5c87d6-1-4', '5c87d6', 4, '1', '(v) In an Arithmetic Progression (A.P.), if the common difference is -4, the seventh term is 4, then the first term is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['36', '**28**', '-20', '-78']::text[]),
  ('MQ-5c87d6-1-5', '5c87d6', 5, '1', '(vi) Which of the following points is invariant with respect to the line $$y = -2$$?', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(-3, 2)', '**(3, -2)**', '(2, 3)', '(-2, 0)']::text[]),
  ('MQ-5c87d6-1-6', '5c87d6', 6, '1', '(vii) If in two triangles ABC and PQR $$\frac{AB}{QR} = \frac{BC}{PR} = \frac{CA}{PQ}$$, then', 1, 'Similarity', 'MCQ', 1, NULL, array['$$\Delta PQR \sim \Delta CAB$$', '$$\Delta PQR \sim \Delta ABC$$', '$$\Delta CBA \sim \Delta PQR$$', '$$\Delta BCA \sim \Delta PQR$$']::text[]),
  ('MQ-5c87d6-1-7', '5c87d6', 7, '1', '(viii) The total surface area of a hollow cylinder open at both the ends with outer radius R, inner radius r and height h is', 1, 'Mensuration', 'MCQ', 2, '5c87d6__UnknownSch_p2_img_0_jpeg.webp', array['$$2\pi h(R + r) + 2\pi(R^2 - r^2)$$', '$$2\pi Rh + 2\pi(R^2 - r^2)$$', '$$2\pi h(R + r) - 2\pi(R^2 - r^2)$$', '$$2\pi h(R + r) + 2\pi(R^2 + r^2)$$']::text[]),
  ('MQ-5c87d6-1-8', '5c87d6', 8, '1', '(ix) A is the solution set of $$2(x - 1) < 3x - 1$$ and B is the solution set of $$4x - 3 \leq 8 + x$$, if $$x \in Z$$ then the solution set of $$A \cap B$$ is', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['$$\{0, 1, 2, 3...\}$$', '$$\{\mathbf{0, 1, 2, 3}\}$$', '$$\{4, 5, 6...\}$$', '$$\{3, 2, 1, 0, -1...\}$$']::text[]),
  ('MQ-5c87d6-1-9', '5c87d6', 9, '1', '(x) What will be the probability of an impossible event?', 1, 'Probability', 'MCQ', 2, NULL, array['$$\mathbf{0}$$', '1', '$$\infty$$', '0.5']::text[]),
  ('MQ-5c87d6-1-10', '5c87d6', 10, '1', '(xi) If $$A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$$ and $$A^2 = p A$$, then the value of p is', 1, 'Matrices', 'MCQ', 2, NULL, array['$$\mathbf{2}$$', '3', '4', '1']::text[]),
  ('MQ-5c87d6-1-11', '5c87d6', 11, '1', '(xii) The reflection of the point P (1, -2) in the line y = -1 is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(-3, 2)', '(3, -2)', '(3, 2)', '(1, 0)']::text[]),
  ('MQ-5c87d6-1-12', '5c87d6', 12, '1', '(xiii) In the given figure O is the centre of the circle. Tangent PR makes an angle $$50^{\circ}$$ with chord PQ. The value of $$\angle POQ$$ is', 1, 'Circles', 'MCQ', 2, '5c87d6__UnknownSch_p2_img_1_jpeg.webp', array['$$50^{\circ}$$', '$$25^{\circ}$$', '$$\mathbf{100^{\circ}}$$', '$$90^{\circ}$$']::text[]),
  ('MQ-5c87d6-1-13', '5c87d6', 13, '1', '(xiv) If the difference between the $$18^{\text{th}}$$ term and the $$14^{\text{th}}$$ term of an Arithmetic Progression (A.P.) is 32, then the value of the common difference of the A.P. is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['4', '-4', '$$\mathbf{8}$$', '-8']::text[]),
  ('MQ-5c87d6-1-14', '5c87d6', 14, '1', '(xv) Find the equation of the line parallel to x-axis and passing through (3, 4)', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['x = 3', 'y = 3', 'x = 4', '$$\mathbf{y = 4}$$']::text[]),
  ('MQ-5c87d6-2-0', '5c87d6', 15, '2', '(i) Vineet opened a recurring deposit account in a bank for $$1 \frac{1}{2}$$ years at 6% per annum (simple interest). If he receives ₹11,313 at the time of maturity, then find the monthly instalment. ₹600', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-5c87d6-2-1', '5c87d6', 16, '2', '(ii) If a, b and c are in continued proportion, then show that:
$$\frac{a - b + c}{a + b + c} = \frac{a^2 + b^2 + c^2}{(a + b + c)^2}$$', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-5c87d6-2-2', '5c87d6', 17, '2', '(iii) Prove the following identity: [4]

$$\frac{\cos^2 x}{1 - \tan x} + \frac{\sin^3 x}{\sin x - \cos x} = 1 + \sin x \cos x$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-5c87d6-3-0', '5c87d6', 18, '3', '(i) A sphere of radius r is just enclosed in a right circular cylinder of height h. If the surface area of the sphere is 616 cm², then find:

(a) The total surface area of the cylinder. r = 7 cm TSA = 616 cm²

(b) The volume of the sphere. 1437.33 cm³', NULL, 'Mensuration', 'short', 3, '5c87d6__UnknownSch_p3_img_0_jpeg.webp', NULL),
  ('MQ-5c87d6-3-1', '5c87d6', 19, '3', '(ii) [4]

- (a) Find the ratio in which the line segment joining A (0, 3) and B (4, -1) is divided by the x-axis. 3 : 1
- (b) Write the coordinates of the point of intersection of line AB and the x-axis. (3, 0)', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-5c87d6-3-2', '5c87d6', 20, '3', '(iii) Use graph paper for this question. Take 2 cm = 1 unit along the axes. [5]

- (a) Plot the point A (-4, 4) and B (2, 2).
- (b) Reflect A & B in the origin to get the image A'' and B''.
- (c) Write down the coordinates of A'' and B''.
- (d) Give the geometrical name for the figure ABA''B''.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-5c87d6-4-0', '5c87d6', 21, '4', '(i) Solve the following quadratic equation. Give your answer correct to two significant [3]

places. $$5x^2 + 3x - 4 = 0$$ $$\mathbf{x = 0.64 \text{ or } -1.2}$$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-5c87d6-4-1', '5c87d6', 22, '4', '(ii) Find the sum of the first 22 terms of an AP in which the common difference is 7 and the [3]

twenty second term is 140. a = 2, Sn = 1661', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-5c87d6-4-2', '5c87d6', 23, '4', '(iii) Points A and B have co-ordinates (2,3) and (-2, -3) respectively. Find: [4]

- (a) The slope of AB. 1.5
- (b) The equation of the perpendicular bisector of line segment AB. 2x + 3y = 0
- (c) The value of p, if the point (2, p) lies on the perpendicular bisector of line segment AB. -1.33', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-5c87d6-5-0', '5c87d6', 24, '5', '(i) Given $$\begin{bmatrix} 4 \\ 1 \end{bmatrix}$$ X = $$\begin{bmatrix} -4 & 8 \\ -1 & 2 \end{bmatrix}$$, find: [3]
(a) the order of matrix X. 1 X 2
(b) the matrix X. \(\left[ \begin{array}{c} -1\\ 2 \end{array} \right]\)', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-5c87d6-5-1', '5c87d6', 25, '5', '(ii) Prove the following identity: [3]

$$(\tan^2\alpha + 1)(\cos^2\alpha + 1) = (\tan^2\alpha + 2)$$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-5c87d6-5-2', '5c87d6', 26, '5', '(iii) Use graph sheet for this question. Draw the histogram and use it to find the mode for [4] the given distribution table.

| Lifetime (In hours) | 300–350 | 350–400 | 400–450 | 450–500 | 500–550 |
| --- | --- | --- | --- | --- | --- |
| Number of Lamps | 14 | 56 | 60 | 86 | 74 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-5c87d6-6-0', '5c87d6', 27, '6', '(i) Find the total amount of bill for the following intra-state transaction of goods: ₹50,316 [3]

| Articles | Marked Price | Rate of GST | Discount |
| --- | --- | --- | --- |
| Laptop | ₹45,500.00 | 18% | 10% |
| Laptop Bag | ₹1,900.00 | 5% | Nil |', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-5c87d6-6-1', '5c87d6', 28, '6', '(ii) Show 2x + 7 is a factor of 2x³ + 5x² – 11x – 14. Hence factorise the expression [3] completely, using Factor Theorem. (2x + 7)(x – 2)(x + 1)', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-5c87d6-6-2', '5c87d6', 29, '6', '(iii) A box contains 4 red balls, 5 black balls, 10 white balls and 6 green balls. A ball is [4] drawn from the box without looking into it, find the probability that the ball drawn is:

(a) A black ball. 1/5
(b) A red or a green ball. 2/5
(c) A green and a white ball. 0
(d) Neither a white nor a black ball. 2/5', 4, 'Probability', 'long', 4, NULL, NULL),
  ('MQ-5c87d6-7-0', '5c87d6', 30, '7', '(i) Using a ruler and compasses, draw a circle of radius \(4\mathrm{cm}\). Mark a point \(P\) at a distance [3] of \(7\mathrm{cm}\) from the centre of the circle. Draw two tangents to the given circle from the point \(P\). Measure the length of each tangent.', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-5c87d6-7-1', '5c87d6', 31, '7', '(ii) Two solid spheres of radii \(2\mathrm{cm}\) and \(4\mathrm{cm}\) are melted and recast into a cone of height 8 [3] cm. Find the radius of the cone so formed. 6 cm', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-5c87d6-7-2', '5c87d6', 32, '7', '(iii) A circle with centre O is inscribed in a triangle ABC, where AM = 12 cm, BC = 18 cm, OD is perpendicular to AC and AM is the perpendicular bisector of BC. Find:

(a) Find AD. 6 cm
(b) Prove \(\Delta ADO\sim \Delta AMC\)
(c) Calculate the radius of the circle. 4.5 cm', NULL, 'Similarity', 'short', 4, '5c87d6__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-5c87d6-8-0', '5c87d6', 33, '8', '(i) Solve the following inequation and represent the solution set on a number line. [3]

\[
- 2 \leq \frac {1}{2} - \frac {2 x}{3} < 1 \frac {5}{6}, x \in R \quad \mathbf {S}. \mathbf {S} = \{\mathbf {x}: - 4 < \mathbf {x} \leq 3. 7 5, \mathbf {x} \in \mathbf {R} \}
\]', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-5c87d6-8-1', '5c87d6', 34, '8', '(ii) In the given figure O is the centre of the circle. Tangent DB meets chord AF produced at B. AE and CD intersects at F. AF = (x + 2) cm, FE = x cm, CF = 2 cm, FD = 12 cm and EB = 8 cm. Find:

(a) The value of x. 4 cm
(b) The length of the tangent BD. 12 cm', NULL, 'Circles', 'short', 5, '5c87d6__UnknownSch_p5_img_0_jpeg.webp', NULL),
  ('MQ-5c87d6-8-2', '5c87d6', 35, '8', '(iii) From the top of a tower, the angles of depression of two objects on the ground on the same side of it are observed to be \( 45^{\circ} \) and \( 60^{\circ} \) . If the height of the tower is 150 m, find the distance between the objects correct to the nearest multiple of 10. 60 m', NULL, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-5c87d6-9-0', '5c87d6', 36, '9', '(i) If the mean of the following data is 42, find the missing frequency ''f''. f = 25 [3]

| Class | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 7 | 10 | 12 | 13 | f | 10 | 14 | 9 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-5c87d6-9-1', '5c87d6', 37, '9', '(ii) Solve for x, using the properties of proportion. [3]

\[
\frac {2 x + \sqrt {4 x ^ {2} - 1}}{2 x - \sqrt {4 x ^ {2} - 1}} = \frac {4}{1} \quad \mathbf {x} = + 5 / 8
\]', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-5c87d6-9-2', '5c87d6', 38, '9', '(iii) In the figure given below. AB is a diameter of the circle. \( \angle PAB = 35^{\circ} \) and \( \angle PQB = 25^{\circ} \) . Find:

\[
\begin{array}{l} \text {(a)} \quad \angle P R B \quad (\mathrm{b}) \quad \angle P B A \quad (\mathrm{c}) \quad \angle P B Q \quad (\mathrm{d}) \quad \angle B P R \\ = \quad = \quad = \quad = \\ 3 5 ^ {\circ} \quad 5 5 ^ {\circ} \quad 6 5 ^ {\circ} \quad 3 0 ^ {\circ} \\ \end{array}
\]', NULL, 'Circles', 'short', 5, '5c87d6__UnknownSch_p5_img_1_jpeg.webp', NULL),
  ('MQ-5c87d6-10-0', '5c87d6', 39, '10', '(i) A positive number is divided into two parts, such that the sum of the squares of the two parts is 208. The square of the larger part is 18 times the smallest part. Taking x as the smaller of the two parts, find the number. 20', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-5c87d6-10-1', '5c87d6', 40, '10', '(ii) Use a graph sheet for this question. Draw an ogive for the following distribution which shows a record of the weight in kilogram of 200 students.

| Weight (kg) | 40–45 | 45–50 | 50–55 | 55–60 | 60–65 | 65–70 | 70–75 | 75–80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 17 | 22 | 45 | 51 | 31 | 20 | 9 |

Use your ogive to estimate the following:

(a) the median weight.
(b) the lower quartile weight.
(c) the weight above which the heaviest 30% of the students fall.', NULL, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-8b9ffe-1-0', '8b9ffe', 0, '1', 'Example 1: In $\triangle ABC$, $PQ \parallel BC$ and $AP : PB = 2 : 3$. If $AQ = x + 1$ and $QC = x + 5$, find the value of $x$.', NULL, 'Similarity', 'short', 1, '8b9ffe__UnknownSch_p1_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-2-0', '8b9ffe', 1, '2', 'Example 2: In $\triangle ABC$, $AB \parallel DE$ and $BE : EC = 3 : 4$. If $AC = 5.6 \, \text{cm}$, find the length of AD.', NULL, 'Similarity', 'short', 2, '8b9ffe__UnknownSch_p2_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-6-0', '8b9ffe', 2, '6', 'Example 6: In $\Delta ABC$, $M$ and $N$ are points on $AB$ and $AC$ such that $AM = 2\text{ cm}$, $MK = 4\text{ cm}$, $AN = 3\text{ cm}$ and $NC = 1\text{ cm}$. Prove that $\Delta AMN \sim \Delta ACB$.', NULL, 'Similarity', 'short', 3, '8b9ffe__UnknownSch_p3_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-7-0', '8b9ffe', 3, '7', 'Example 7: In the figure, $\mathrm{AO} = 2\mathrm{cm}$ , $\mathrm{BO} = 3\mathrm{cm}$ , $\mathrm{CO} = 1\mathrm{cm}$ and $\mathrm{DO} = 1.5\mathrm{cm}$ .

Prove that $\Delta AOB\sim \Delta COD$', NULL, 'Similarity', 'short', 4, '8b9ffe__UnknownSch_p4_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-9-0', '8b9ffe', 4, '9', 'Example 9: In $\Delta XYZ$, $XY = 1.5\mathrm{cm}$, $YZ = 3\mathrm{cm}$, $XZ = 2\mathrm{cm}$ and in $\Delta PQR$, $PQ = 2.25\mathrm{cm}$, $QR = 4.5\mathrm{cm}$ and $PR = 3\mathrm{cm}$. Prove that $\Delta XYZ \sim \Delta PQR$.', NULL, 'Similarity', 'short', 6, '8b9ffe__UnknownSch_p6_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-11-0', '8b9ffe', 5, '11', 'Example 11: In $\Delta ABC$, the medians BD and CE intersect at G. Prove that

(i) $\Delta EGD \sim \Delta CGB$

(ii) $\mathrm{BG} = 2\mathrm{GD}$', NULL, 'Similarity', 'short', 7, '8b9ffe__UnknownSch_p7_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-13-0', '8b9ffe', 6, '13', 'Example 13: In $\Delta PQR$, $PX = \frac{1}{2} XQ$ and $XY \parallel QR$. Find:

(i) area of $\Delta PXY$: area of $\Delta PQR$.

(ii) If $QR = 4.5 \text{ cm}$, find the length of $XY$.', NULL, 'Similarity', 'short', 8, '8b9ffe__UnknownSch_p8_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-14-0', '8b9ffe', 7, '14', 'Example 14: In the given $\Delta ABC$, $\angle ABC = 90^\circ$, $BP \perp AC$, $AP = 9\text{ cm}$ and $PC = 16\text{ cm}$.

(i) Prove that \(\Delta APB \sim \Delta BPC\). (ii) Find the length of BP.
(iii) Find area \(\Delta APB\) : area \(\Delta BPC\)', NULL, 'Similarity', 'short', 9, '8b9ffe__UnknownSch_p9_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-15-0', '8b9ffe', 8, '15', 'Example 15: In the given figure, AC bisects $\angle BAD$ and $AB = 16\mathrm{cm}$ , $\mathrm{AC} = 12\mathrm{cm}$ , $\mathrm{AD} = 9\mathrm{cm}$ .

(i) Prove that $\Delta ABC \sim \Delta ACD$ .
(ii) Find $\frac{\text{area of } \Delta ABC}{\text{area of } \Delta ACD}$', NULL, 'Similarity', 'short', 10, '8b9ffe__UnknownSch_p10_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-16-0', '8b9ffe', 9, '16', 'Example 16: In the quadrilateral ABCD, AC bisects $\angle BCD$, $\angle ABC = 90^{\circ} = \angle DAC$. If $AB = 6\mathrm{cm}$ and $AC = 10\mathrm{cm}$, calculate AD and CD.', NULL, 'Similarity', 'short', 12, '8b9ffe__UnknownSch_p12_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-17-0', '8b9ffe', 10, '17', 'Example 17: In the given figure, $\Delta ABC$ and $\Delta AMP$ are right angled at B and M. Given $AC = 10 \text{ cm}$, $AP = 15 \text{ cm}$ and $PM = 12 \text{ cm}$.

(i) Prove that \(\Delta ABC \sim \Delta AMP\). (ii) Find AB and BC.
(iii) Find area of \(\Delta ABC\): area of \(\Delta AMP\)', NULL, 'Similarity', 'short', 13, '8b9ffe__UnknownSch_p13_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-18-0', '8b9ffe', 11, '18', 'Example 18: In the given figure, AD || BC and $\angle ABC = 90^{\circ} = \angle ACD$, $AB = 12\mathrm{cm}$ and $BC = 16\mathrm{cm}$.

Find (i) CD and (ii) AD.', NULL, 'Similarity', 'short', 14, '8b9ffe__UnknownSch_p14_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-19-0', '8b9ffe', 12, '19', 'Example 19: In the given figure, ABCD is a parallelogram. E is a point on AB, CE intersects the diagonal BD at G and EF || BC.

If AE : EB = 1 : 2, find

(i) EF:AD
(ii) area of \(\Delta BEF\): area of \(\Delta BAD\)
(iii) area of \(\Delta EFG\): area of \(\Delta CBG\)', NULL, 'Similarity', 'short', 16, '8b9ffe__UnknownSch_p16_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-20-0', '8b9ffe', 13, '20', 'Example 20: In the given figure, $\angle ABC = \angle BDC$.

(i) Prove that \(\Delta ABC \sim \Delta ADB\).
(ii) If \( AC = 9 \, \text{cm} \) and \( CD = 7 \, \text{cm} \), find the length of AB.
(iii) Find area of \(\Delta ABC\) : area of \(\Delta ADB\)', NULL, 'Similarity', 'short', 17, '8b9ffe__UnknownSch_p17_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-23-0', '8b9ffe', 14, '23', 'Example 23: In $\Delta PQR$, $\angle Q = 90^{\circ}$ and $MN \perp PR$. $PM = 5\mathrm{cm}$, $MQ = 4\mathrm{cm}$

and $QR = 12\mathrm{cm}$. Find: (i) MN (ii) $\frac{\text{area of } \Delta PMN}{\text{area of } MNRQ}$', NULL, 'Similarity', 'short', 19, '8b9ffe__UnknownSch_p19_img_1_jpeg.webp', NULL),
  ('MQ-8b9ffe-24-0', '8b9ffe', 15, '24', 'Example 24: In $\Delta PQR$, S is a point on QR so that $\angle Q = \angle SPR$. If QS = 5 cm and SR = 4 cm, find PR.', NULL, 'Similarity', 'short', 20, '8b9ffe__UnknownSch_p20_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-25-0', '8b9ffe', 16, '25', 'Example 25: ABCD is a rectangle with DP $\perp$ QC. Prove that $\Delta$ DPC $\sim \Delta$ CBQ.', NULL, 'Similarity', 'short', 21, '8b9ffe__UnknownSch_p21_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-4-0', '8b9ffe', 17, '4', '4. AB and ED are perpendiculars to BD. AE meets BD at C. If AB = 16 cm, BC = 12 cm and CD = 3 cm :

(i) find the lengths of DE and CE.
(ii) find area \(\Delta ABC\) : area \(\Delta EDC\).', NULL, 'Similarity', 'short', 23, '8b9ffe__UnknownSch_p23_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-5-0', '8b9ffe', 18, '5', '5. In the quadrilateral PQRS,

PS || QR, PQ ⊥ QR and PR ⊥ RS.

(i) If PQ = 12 cm, QR = 9 cm, find PS and RS.
(ii) Find area of ΔPQR : area of ΔSRP.', NULL, 'Similarity', 'short', 25, '8b9ffe__UnknownSch_p25_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-6-1', '8b9ffe', 19, '6', '6. In $\Delta ABC$, $\angle ABC = 90^{\circ}$ and $QP \perp AC$ :

(i) Prove that \(\Delta ABC \sim \Delta APQ\).
(ii) If \( AP = 5 \), \( PQ = 12 \), \( BC = 36 \), find the lengths of AB and AC.
(iii) Find area of \(\Delta APQ\) : area of \(\Delta ABC\).', NULL, 'Similarity', 'short', 27, '8b9ffe__UnknownSch_p27_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-x-0', '8b9ffe', 20, NULL, '(ii) Find the value of $x$ if $PQ = x + 2$ and $ST = 2x + 1$.', NULL, 'Similarity', 'short', 29, '8b9ffe__UnknownSch_p29_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-9-1', '8b9ffe', 21, '9', '9. In the given figure, AB = 9 cm,
BC = 12 cm and AC = 15 cm. BP ⊥ AC.

(i) What is the measure of \(\angle ABC\)?
(ii) Prove that \(\Delta APB \sim \Delta ABC\).
(iii) Find the lengths of BP and AP.', NULL, 'Similarity', 'short', 30, '8b9ffe__UnknownSch_p31_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-10-0', '8b9ffe', 22, '10', '10. In $\Delta ABC$, P and Q are points on AB and AC such that $AP = 4$ cm, $PB = 13.5$ cm, $AQ = 7$ cm and $QC = 3$ cm :

(i) Prove that \(\Delta APQ \sim \Delta ACB\).
(ii) If \( \mathrm{BC} = 10 \, \mathrm{cm} \), find the length of PQ.
(iii) Find the area of \(\Delta APQ\): area of \(\Delta ACB\).', NULL, 'Similarity', 'short', 32, NULL, NULL),
  ('MQ-8b9ffe-11-1', '8b9ffe', 23, '11', '11. In ΔPQR, S is a point on QR such that ∠Q = ∠SPR.

(i) Prove that ΔPQR ~ ΔSPR.
(ii) If QS = 5 cm, SR = 4 cm, find the length of PR.', NULL, 'Similarity', 'short', 34, '8b9ffe__UnknownSch_p34_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-12-0', '8b9ffe', 24, '12', '12. In $\Delta ABC$, $DE \parallel BC$.

(i) Prove that \(\Delta ADE \sim \Delta ABC\).
(ii) If \(AD = x, DE = x + 1, BC = y, AE = 7,\) \(BD = 8, CE = 14,\) find \(x\) and \(y\)', NULL, 'Similarity', 'short', 36, '8b9ffe__UnknownSch_p36_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-15-1', '8b9ffe', 25, '15', '15. ABCD is a rectangle, $\mathrm{AB} = 12\mathrm{cm}$ and BC $= 8\mathrm{cm}$ . E is a point on BC such that BE $= 5\mathrm{cm}$ . AE produced meets DC produced at F.

(i) Prove that \(\Delta ABE \sim \Delta FCE\).
(ii) Find the lengths of EF and CF.
(iii) Find area of \(\Delta\) FEC : area of \(\Delta\) FAD.', NULL, 'Similarity', 'short', 37, '8b9ffe__UnknownSch_p37_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-16-1', '8b9ffe', 26, '16', '16. ABCD is a trapezium, AB $\parallel$ CD. AB = 9, AC = 12 and CD = 16.

(i) Prove that \(\Delta ABC \sim \Delta CAD\).
(ii) If \(AD = 10\), find BC.', NULL, 'Similarity', 'short', 39, '8b9ffe__UnknownSch_p39_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-17-1', '8b9ffe', 27, '17', '17. In $\Delta ABC$, $\angle B = 90^{\circ}$. PQ $\perp$ AC.

(i) Prove \(\Delta ABC \sim \Delta AQP\).
(ii) If \(AB = 15, AQ = 6, AP = 3x + 4\) and \(QC = 10x - 1\), find \(x, AP\) and \(AC\).', NULL, 'Similarity', 'short', 40, '8b9ffe__UnknownSch_p40_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-19-1', '8b9ffe', 28, '19', '19. In the given figure, AB || CD || EF, AB = 4, OC = 9, OD = 6, DF = 3 and CD = 8, find x, y, z and EF.', NULL, 'Similarity', 'short', 41, '8b9ffe__UnknownSch_p41_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-21-0', '8b9ffe', 29, '21', '21. D and E are two points on sides AB and BC of $\Delta ABC$ such that $\angle EDB = \angle ACB$.

(i) Prove that \(\Delta ABC \sim \Delta EBD\).
(ii) If \(\mathrm{BE} = 6\mathrm{cm}\), \(\mathrm{EC} = 4\mathrm{cm}\), \(\mathrm{BD} = 5\mathrm{cm}\) and area of \(\Delta \mathrm{BED} = 9\mathrm{cm}^2\), calculate the
(a) length of AB

(b) area of $\Delta ABC$.', NULL, 'Similarity', 'short', 43, '8b9ffe__UnknownSch_p43_img_0_jpeg.webp', NULL),
  ('MQ-8b9ffe-23-1', '8b9ffe', 30, '23', '23. In the given figure, AB || CD || EF, AB = 5 cm, AC = 4 cm, EF = 7.5 cm, CF = x and CD = y.

(i) Prove that \(\Delta \mathrm{FEC} \sim \Delta \mathrm{ABC}\).
(ii) Solve for \( x \) and \( y \).
(iii) Find area \(\Delta CDF\) : area of \(\Delta ABF\).', NULL, 'Similarity', 'short', 44, '8b9ffe__UnknownSch_p44_img_0_jpeg.webp', NULL),
  ('MQ-bdc271-Example 1-0', 'bdc271', 0, 'Example 1', 'Example 1: When a chartered accountant (CA) provided his services to Mr. Rao in filing his income returns, his bill for services was ₹8260 inclusive of 18% GST. What is the original amount of the bill? How much is the GST paid to the State Government by the CA?', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-bdc271-Example 2-0', 'bdc271', 1, 'Example 2', 'Example 2: Sachin visits a department stores and buys the following articles:
Medicines costing ₹1250, GST @ 5%; a packet of sweets ₹450, GST @ 5%
soaps, hair oil ₹500, GST @ 18%; a chess board ₹300 with a discount of 10%, GST @ 12%
Calculate:

(i) the total amount of GST paid.
(ii) the total bill amount including GST paid by Sachin.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-bdc271-Example 4-0', 'bdc271', 2, 'Example 4', 'Example 4: When Mr. Mukherjee stayed in a hotel for 2 days he had to pay ₹7080 including 18% GST. What is the tariff of the hotel for a unit of accommodation?', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-bdc271-Example 5-0', 'bdc271', 3, 'Example 5', 'Example 5: A shopkeeper buys certain quantity of cashew nuts for ₹7200 and sells it to a consumer at a profit of 25%. If the rate of GST is 5%, find the GST paid by the shopkeeper to the Central and State Governments.', NULL, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-bdc271-Example 6-0', 'bdc271', 4, 'Example 6', 'Example 6: A manufacturer sells a sewing machine to a wholesaler for ₹5500. The wholesaler sells it to a shopkeeper for ₹7500. The shopkeeper makes a profit of ₹1000 by selling it to a consumer. If GST charged at each stage is 12%, find (i) the amount of GST paid by the manufacturer to the Central Government (ii) the amount of GST received by the State Government on this machine and (iii) the final price paid by the consumer.', NULL, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-bdc271-Example 7-0', 'bdc271', 5, 'Example 7', 'Example 7: A shopkeeper buys a printer at a discount of 30% on the marked price of ₹8000. He sells the printer to a customer at marked price. GST charged at each stage is 18%. If the sales are intra-state, find

(i) the GST paid by the shopkeeper to the Central Government.
(ii) the price paid by the shopkeeper for the article inclusive of tax.
(iii) the cost to the customer inclusive of tax.
(iv) the amount of tax received by the State Government.', NULL, 'GST and Banking', 'short', 8, NULL, NULL),
  ('MQ-bdc271-Example 8-0', 'bdc271', 6, 'Example 8', 'Example 8: A manufacturer marks a mobile for ₹6000. He sells it to the wholesaler at 25% discount. The wholesaler sells it to a retailer at 20% discount on MP. If the retailer sells it at MP and GST charged is 12% at every stage. Find

(i) the GST paid to the Central Government by the wholesaler.
(ii) the GST paid to the State Government by the retailer.
(iii) the amount which the consumer pays.', NULL, 'GST and Banking', 'short', 9, NULL, NULL),
  ('MQ-bdc271-Example 9-0', 'bdc271', 7, 'Example 9', 'Example 9: The printed price of an air conditioner is ₹40000. The wholesaler allows a discount of 10% on it to the shopkeeper. The shopkeeper sells the AC to a customer at a discount of 5% on the marked price. GST is charged at the rate of 28%. The sales are intra-state. Find

(i) the price inclusive of tax paid by the shopkeeper.
(ii) the tax paid by the wholesaler to the State Government.
(iii) the GST paid by the shopkeeper to the State Government.
(iv) the tax received by the Central Government.
(v) the total amount paid by the customer inclusive of tax.', NULL, 'GST and Banking', 'short', 10, NULL, NULL),
  ('MQ-bdc271-Example 10-0', 'bdc271', 8, 'Example 10', 'Example 10: A manufacturer sells an article with marked price ₹2000 to a wholesaler at a discount of 20% on the marked price. The wholesaler sells it to a retailer at a discount of 10% on the marked price. The retailer sells the article to a customer at the marked price. If the GST paid by the wholesaler is ₹24, find

(i) the rate of GST.

(ii) the GST paid by the retailer.

(iii) the price paid by the customer.', NULL, 'GST and Banking', 'short', 11, NULL, NULL),
  ('MQ-bdc271-Example 11-0', 'bdc271', 9, 'Example 11', 'Example 11: A shopkeeper sells some edible oil for ₹7200 at its MP. The shopkeeper pays GST of ₹120 to the Government. If the GST charged throughout is 5%, calculate the price paid by the shopkeeper for the oil inclusive of tax.', NULL, 'GST and Banking', 'short', 12, NULL, NULL),
  ('MQ-bdc271-Example 12-0', 'bdc271', 10, 'Example 12', 'Example 12: The marked price of an article is ₹6000 and rate of GST is 12%. A shopkeeper buys it at a discount and sells it at its marked price. If the sales are intra-state and the shopkeeper paid ₹36 under GST to the State Government, find (i) the amount (inclusive of GST) paid by the shopkeeper and (ii) the % of discount received by him.', NULL, 'GST and Banking', 'short', 13, NULL, NULL),
  ('MQ-bdc271-Example 13-0', 'bdc271', 11, 'Example 13', 'Example 13: A wholesaler buys a TV from a manufacturer for ₹25000. He marks the price of the TV 20% above cost price and sells it to a retailer at a discount of 10% on the marked price. If the rate of GST is 28%, find

(i) the marked price.

(ii) the retailer''s cost price inclusive of tax.

(iii) the GST paid by the wholesaler.', NULL, 'GST and Banking', 'short', 14, NULL, NULL),
  ('MQ-bdc271-Example 14-0', 'bdc271', 12, 'Example 14', 'Example 14: The price of an article is ₹5120 inclusive of GST, at the rate of 28% on its listed price. A customer asks the dealer for a discount on the listed price so that after charging GST, the selling price will be same as listed price. What is the amount of discount which the dealer must allow for the deal?', NULL, 'GST and Banking', 'short', 15, NULL, NULL),
  ('MQ-bdc271-Example 15-0', 'bdc271', 13, 'Example 15', 'Example 15: A manufacturer supplies some blankets worth ₹40000 to a dealer at a profit of 15%. The dealer sells these to a shopkeeper at a profit of ₹12000. If the rate of GST is 12%, calculate

(i) the input GST of the dealer.

(ii) the GST paid by the dealer to the Government.

(iii) the price paid by the shopkeeper inclusive of GST.', NULL, 'GST and Banking', 'short', 16, NULL, NULL),
  ('MQ-bdc271-Example 16-0', 'bdc271', 14, 'Example 16', 'Example 16: The price of an article is ₹4410 inclusive of GST, at the rate of 5% on its listed price. A customer asks the dealer for a discount on the listed price so that after charging GST, the selling price will be same as listed price.

(i) What is the list price?
(ii) What is the amount of discount which the dealer must allow for the deal?', NULL, 'GST and Banking', 'short', 17, NULL, NULL),
  ('MQ-bdc271-19-0', 'bdc271', 15, '19', '19. Ayush purchased a computer for ₹28320 which included 20% discount on the list price and 18% tax under GST on the remaining price. Find the list price of the computer.', NULL, 'GST and Banking', 'short', 19, NULL, NULL),
  ('MQ-bdc271-24-0', 'bdc271', 16, '24', '24. Mr. Bedi visits the market and buys the following articles :

Medicines costing ₹ 950, GST @5% A Pair of shoes costing ₹ 3000, GST @ 18%

A Laptop bag costing ₹ 1000 with a discount of 30% GST @ 18%

Calculate :

(i) the total amount of GST paid.
(ii) the total bill amount including GST paid by Mr. Bedi. (2020)', NULL, 'GST and Banking', 'short', 20, NULL, NULL),
  ('MQ-bf807b-Example 9-0', 'bf807b', 0, 'Example 9', 'Example 9: If one root of the quadratic equation $mx^2 - 9x - 10 = 0$ is 2, find the value of $m$, and also find the other root.', NULL, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-bf807b-Example 15-0', 'bf807b', 1, 'Example 15', 'Example 15: Solve the following equation and give your answer correct to 2 decimal places.

$$
5x^2 - 3x - 4 = 0', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-bf807b-Example 16-0', 'bf807b', 2, 'Example 16', 'Example 16: Solve and give answer correct to 3 significant figures.

Solution: $$x - \frac{18}{x} = 6$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-bf807b-Example 17-0', 'bf807b', 3, 'Example 17', '(i) $5x^{2} - 8x - 12 = 0$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-bf807b-Example 17-1', 'bf807b', 4, 'Example 17', '(ii) $3x + \frac{48}{x} = 24$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-bf807b-Example 17-2', 'bf807b', 5, 'Example 17', '(iii) $2x^{2} - 9x + 13 = 0$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-bf807b-Example 17-3', 'bf807b', 6, 'Example 17', '(iv) $7x^{2} - 7x - 42 = 0$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-bf807b-Example 18-0', 'bf807b', 7, 'Example 18', 'Example 18: Without solving the following quadratic equation, find the value of $m$ for which the given equation has real and equal roots.

$$
x^{2} + 2(m - 1)x + (m + 5) = 0', NULL, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-bf807b-Example 21-0', 'bf807b', 8, 'Example 21', 'Example 21: The sum of two natural numbers is 14 and the sum of their reciprocals is $\frac{7}{24}$. Find the numbers.', NULL, 'Quadratic Equations', 'short', 21, NULL, NULL),
  ('MQ-bf807b-Example 22-0', 'bf807b', 9, 'Example 22', 'Example 22: The difference of squares of two natural numbers is 180. The square of the smaller number is 8 times the larger number. Find the numbers.', NULL, 'Quadratic Equations', 'short', 22, NULL, NULL),
  ('MQ-bf807b-Example 23-0', 'bf807b', 10, 'Example 23', 'Example 23: A two-digit positive number is such that the product of its digits is 8. If 18 is added to the number, the digits interchange their places. Find the number.', NULL, 'Quadratic Equations', 'short', 23, NULL, NULL),
  ('MQ-bf807b-Example 24-0', 'bf807b', 11, 'Example 24', 'Example 24: In a two-digit number, the unit''s digit exceeds its ten''s digit by 1, and the product of the given number and its ten''s digit is 280. Find the number.', NULL, 'Quadratic Equations', 'short', 24, NULL, NULL),
  ('MQ-bf807b-Example 25-0', 'bf807b', 12, 'Example 25', 'Example 25: The sum of areas of two squares is $225\mathrm{m}^2$. If the difference of their perimeters is $12\mathrm{m}$, find the length of sides of the squares.', NULL, 'Quadratic Equations', 'short', 25, NULL, NULL),
  ('MQ-bf807b-Example 26-0', 'bf807b', 13, 'Example 26', 'Example 26: The lengths of a rectangle exceeds the breadth by 5 m. If the length was decreased by 4 m and the breadth was doubled, then the area would be increased by 40 m². Find the length.', NULL, 'Quadratic Equations', 'short', 27, NULL, NULL),
  ('MQ-bf807b-Example 27-0', 'bf807b', 14, 'Example 27', 'Example 27: A wire of length 60 cm is bent to form a right-angled triangle and its hypotenuse is 26 cm. Find the other two sides of the triangle.', NULL, 'Quadratic Equations', 'short', 28, 'bf807b__UnknownSch_p28_img_0_jpeg.webp', NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
