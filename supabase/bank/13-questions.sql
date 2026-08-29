set standard_conforming_strings = on;
begin;

-- questions 5501-6000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-7d00e8-2-0', '7d00e8', 3, '2', 'Q.2.a. Determine the value of ''p'' if the equation $$px^2 - 8x + 16 = 0$$ [3]
has real and equal roots.', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-7d00e8-2-1', '7d00e8', 4, '2', 'Q.2.b. Ravi opened a recurring deposited account in a bank and deposited Rs.1000 per month for 36 months. If he received Rs.40,440 at the time of maturity, calculate the rate of interest. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-7d00e8-2-2', '7d00e8', 5, '2', 'Q.2.c. (1) Prepare a bill for the following transaction of services provided by some consulting agency. [4]

- (2) What is the total amount of GST collected?
- (3) What is the total bill amount (including GST)

| Cost of service (in Rs) | GST% | GST (in Rs) | Cost + GST |
| --- | --- | --- | --- |
| 240 | 10 | | |
| 120 | 10 | | |
| 300 | 18 | | |
| 200 | 15 | | |
| | | | |', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-7d00e8-3-0', '7d00e8', 6, '3', 'Q.3.a. Seema has a R.D. account in a bank for 3 years at 8% per annum. [3]

If she gets Rs.18198 at the time of maturity, find

- (i) the monthly instalment
- (ii) the amount of interest.', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-7d00e8-3-1', '7d00e8', 7, '3', 'Q.3.b. Neha plans to buy a dress marked at Rs.1000. The shopkeeper offers a discount of 10 % on the dress. The rate of GST applicable is 10%. [3]

What is the final bill amount paid by her?', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-7d00e8-3-2', '7d00e8', 8, '3', 'Q.3.c. Solve the following quadratic equation $$x^2 - 5x - 8 = 0$$ [4]

Given $$\sqrt{65} = 8.062$$ $$\sqrt{57} = 7.55$$

- (i) Give your answer correct to two decimal places.
- (ii) Give your answer correct to two significant figures.', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-7d00e8-4-0', '7d00e8', 9, '4', 'Q.4.a. A dealer Y buys an article for Rs.4000 from a dealer X. The dealer Y sells this article for Rs.5000 to customer Z. If the rate of GST at each stage is 18%, [3]

find: (i) the SGST paid by dealer Y to dealer X

- (ii) the GST paid by customer Z
- (iii) the total bill paid by customer, including GST', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-7d00e8-4-1', '7d00e8', 10, '4', 'Q.4.b. Determine the nature of roots for the following quadratic equation

$$\sqrt{3}x^2 - 5x + 7\sqrt{3} = 0$$ [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-7d00e8-4-2', '7d00e8', 11, '4', 'Q.4.c. Soham has a R.D. account in a bank for 2 years at 6% per annum. If he gets Rs.2400 as interest at the time of maturity, find [4]

- (i) the monthly instalment
- (ii) the amount of maturity.', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-cb9f45-I.1-0', 'cb9f45', 0, 'I.1', '1. Amit deposits Rs. 1600 per month in a bank for 18 months in a Recurring Deposit Scheme. If he gets Rs.31080 at the time of maturity, what is the rate of interest p.a the end of every month? [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-cb9f45-I.2-0', 'cb9f45', 1, 'I.2', '2. Without actual division, find the remainder if $p(x) = 9x^2 - 6x + 2$ is divided by $(3x - 2)$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-cb9f45-I.3-0', 'cb9f45', 2, 'I.3', '3. Mr. Sandeep purchased a digital camera for Rs.25488 which includes 10% rebate on the list price and 18% tax (under GST) on the remaining price. Find the marked price of the camera? [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-cb9f45-II.1-0', 'cb9f45', 3, 'II.1', '1. Solve the following inequation and represent your solution on the real number line:
$$\frac{-x}{3} \leq \frac{x}{2} - 1\frac{1}{3} < \frac{1}{6}, x \in R.$$ [4]', 4, 'Linear Inequations', 'long', 1, NULL, NULL),
  ('MQ-cb9f45-II.2-0', 'cb9f45', 4, 'II.2', '2. The eighth term of an AP is half of its second term and the eleventh term exceeds one-third of its fourth term by 1. Find the 15th term. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-cb9f45-II.3-0', 'cb9f45', 5, 'II.3', '3. In the given figure AB is parallel to DC. angle BCE = 80 and angle BAC = 25. [3]

Find (a) angle CAD (b) angle CBD (C) angle ADC', 3, 'Circles', 'short', 1, 'cb9f45__Lml_Icse10_p1_img_1_jpeg.webp', NULL),
  ('MQ-cb9f45-III.1-0', 'cb9f45', 6, 'III.1', '1. Prove the following : $$\frac{\sin \theta}{\cot \theta + \csc \theta} = 2 + \frac{\sin \theta}{\cot \theta - \csc \theta}$$ [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-cb9f45-III.2-0', 'cb9f45', 7, 'III.2', '2. If $$2 \begin{bmatrix} x & 7 \\ 9 & y-5 \end{bmatrix} + \begin{bmatrix} 6 & -7 \\ 4 & 5 \end{bmatrix} = \begin{bmatrix} 10 & 7 \\ 22 & 15 \end{bmatrix}$$, find $$x + y$$. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-cb9f45-III.3-0', 'cb9f45', 8, 'III.3', '3. Find the value of a if the two polynomials $$ax^3 + 3x^2 - 9$$ and $$2x^3 + 4x + a$$ leave the same remainder when divided by $$x + 3$$. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-cb9f45-IV.1-0', 'cb9f45', 9, 'IV.1', '1. One card is drawn from a well shuffled deck of 52 cards. Find the probability of getting [3]
(a) A king of red colour (b) a face card (c) a red face card (d) the queen of diamonds. .', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-IV.2-0', 'cb9f45', 10, 'IV.2', '2. If the mean of the following distribution is 24, find the value of `a`. [4]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| Number of students | 7 | a | 8 | 10 | 5 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-cb9f45-IV.3-0', 'cb9f45', 11, 'IV.3', '3. A hemispherical bowl is made of steel 0.25cm thick. The inner radius of the bowl is 5cm. Find the outer curved surface area of the bowl? [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-V.1-0', 'cb9f45', 12, 'V.1', '1. If sum of first 6 terms of an AP is 36 and that of the first 16 terms is 256, then find the sum of first 10 terms? [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-V.2-0', 'cb9f45', 13, 'V.2', '2. If $A = \begin{bmatrix} 3 & -1 \\ 0 & 2 \end{bmatrix}$, Find matrix B such that $A^2 - 2B = 3A - 5I$, where I is an identity matrix.[3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-V.3-0', 'cb9f45', 14, 'V.3', '3. Use graph paper for this [4]

Plot the points O(0,0), A(-4,4), B(-3,0) and C(0,-3)

(a) Reflect A and B on the Y- axis and name them A`and B` respectively. Write down their co-ordinates.
(b) Name the figure OABCB`A`', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-cb9f45-VI.1-0', 'cb9f45', 15, 'VI.1', '1. In $\Delta ABC$ and $\Delta EDC$, $AB$ is parallel to $ED$, $BD = \frac{1}{3} BC$ and $AB = 12.3cm$. [4]

(a) Prove that $\Delta ABC \sim \Delta EDC$.
(b) Find DE.
(c) Find $\frac{\text{area of } \Delta EDC}{\text{area of } \Delta ABC}$.', 4, 'Similarity', 'long', 2, 'cb9f45__Lml_Icse10_p2_img_0_jpeg.webp', NULL),
  ('MQ-cb9f45-VI.2-0', 'cb9f45', 16, 'VI.2', '2. Find the ratio in which the point (2,a) divides the joining of (-4,3) and (6,3). Hence, find a? [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-VI.3-0', 'cb9f45', 17, 'VI.3', '3. A toy is in the form of a cone mounted on a hemisphere with the same radius. The radius of the conical portion is 4cm and its height is 3cm. Find the volume of the toy? ($\pi = 3.14$) [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-VII.1-0', 'cb9f45', 18, 'VII.1', '1. The horizontal distance between two towers is 60m. The angle of depression of the top of the first tower when seen from the top of the second tower is $30^\circ$, If the height of the second tower is 90m, then find the height of the first tower? [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-VII.2-0', 'cb9f45', 19, 'VII.2', '2. Calculate the mean by step-deviation method: [4]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of students | 10 | 9 | 25 | 30 | 16 | 10 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-cb9f45-VII.3-0', 'cb9f45', 20, 'VII.3', '3. Solve $x^2 - 3(x + 3) = 0$, give your answer correct to two significant figures.

[3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-cb9f45-VIII.1-0', 'cb9f45', 21, 'VIII.1', '1. Prove that $$\frac{\sin \theta - 2\sin^3 \theta}{2\cos^3 \theta - \cos \theta} = \tan \theta$$. [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-VIII.2-0', 'cb9f45', 22, 'VIII.2', '2. The midpoints of D,E,F of the sides AB , BC, and CA of a triangle are (3,4) , (8,9) and (6,7) respectively. Find the co-ordinates of the vertices of the triangle ? [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-cb9f45-VIII.3-0', 'cb9f45', 23, 'VIII.3', '3. Using properties of proportion , if $$x = \frac{\sqrt{a+1}+\sqrt{a-1}}{\sqrt{a+1}-\sqrt{a-1}}$$ ,then show that $$x^2 - 2ax + 1 = 0$$. [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-IX.1-0', 'cb9f45', 24, 'IX.1', '1. Five years ago , a woman`s age was the square of her son`s age. Ten years hence , her age will be twice that of her son`s age. Find the present age of the woman? [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-cb9f45-IX.2-0', 'cb9f45', 25, 'IX.2', '2. The following distribution represents the height of 160students of a school: [6]

| Height | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 | 170-175 | 175-180 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Draw an ogive for this and find (a). the median of the height

(b). the inter quartile range.

(c). the number of students whose height is above 172cm.', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-cb9f45-X.1-0', 'cb9f45', 26, 'X.1', '1. Factorise $$x^3 - 23x^2 + 142x - 120$$ using factor theorem. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-X.2-0', 'cb9f45', 27, 'X.2', '2. The area of the curved surface of a right circular cylinder is 4400 sq.cm. and the circumference of its base is 110cm. Find the height of the cylinder? [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-X.3-0', 'cb9f45', 28, 'X.3', '3. Show that $$(2x + 7)$$is a factor of $$2x^3 + 7x^2 - 4x - 14$$.Hence factorise. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-cb9f45-XI.1-0', 'cb9f45', 29, 'XI.1', '1. Kiran has a recurring deposit account of Rs.1000 per month at 10% p.a. If she gets Rs,5550 as interest at the time of maturity , find the total time? [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-XI.2-0', 'cb9f45', 30, 'XI.2', '2. Without solving the following equations , find the value of `p` for which the roots are equal :

$$px^2 - 4x + 3 = 0.$$ [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-cb9f45-XI.3-0', 'cb9f45', 31, 'XI.3', '3. Mr. Vivek sells a TV to a dealer for Rs. 20000. The dealer sells it to a consumer at a profit of Rs.2000. If the sales are intrastate and the rate of GST is 12%, find [4]

(a) The amount of tax under GST paid by the dealer to the Central Government
(b) The amount that the consumer pays for the TV', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-3e509f-I.1-0', '3e509f', 0, 'I.1', '1. Find the value of K if $$4x^3 - 2x^2 + kx + 5$$ leaves remainder (- 10) when divided by $$(2x + 1)$$? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-3e509f-I.2-0', '3e509f', 1, 'I.2', '2. A shopkeeper bought an article with market price Rs.1200 from the wholesaler at a discount od 10% . The shopkeeper sells this article to the customer on the marketprice printed on it. If the rate of GST is 6% then find [3]

- (i). GST paid by the wholesaler
- (ii). Amount paid by the customer to buy the item.', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-3e509f-I.3-0', '3e509f', 2, 'I.3', '3. A box contains 16 cards bearing numbers 1,2,3,...,20 respectively. If a card is drawn at random from the box , find the probability that the number on the card is : [4]

(i) An even number (ii) composite number (iii) a number divisible by 6 .', 4, 'Probability', 'long', 1, NULL, NULL),
  ('MQ-3e509f-II.1-0', '3e509f', 3, 'II.1', '1. Prove that $$\frac{\cos\theta}{1-\tan\theta} + \frac{\sin\theta}{1-\cot\theta} = \cos\theta + \sin\theta$$. [3]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-3e509f-II.2-0', '3e509f', 4, 'II.2', '2. Find x and y if $$4 \begin{bmatrix} 4 & -3 \\ 2 & 3x \end{bmatrix} + \begin{bmatrix} 7 & 2y \\ 2 & 9 \end{bmatrix} = 3 \begin{bmatrix} 3 & -8 \\ 5 & 1 \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-3e509f-II.3-0', '3e509f', 5, 'II.3', '3. Manisha has a recurring deposit account for 2 years at 10% p.a. If she receives Rs. 1900 as interest ,find the value of the monthly instalment paid by her ? [4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-3e509f-III.1-0', '3e509f', 6, 'III.1', '1. Find mean by any method. [4]

| class | 11-20 | 2 1- 30 | 31 -40 | 41 -50 | 51 -60 |
| --- | --- | --- | --- | --- | --- |
| frequency | 5 | 6 | 3 | 6 | 5 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-3e509f-III.2-0', '3e509f', 7, 'III.2', '2. Solve the following equations and represent your solution on numberline. [3]

$$-5\frac{1}{2} - x \leq \frac{1}{2} - 3x \leq 3\frac{1}{2} - x, x \in R.$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-3e509f-III.3-0', '3e509f', 8, 'III.3', '3. In the given figure AB is a diameter of the circle with centre O , DO || CB and angle DCB = 120° [3]

Find

(ii) angle ADC (iv) Show that $$\Delta AOD$$ is an equilateral triangle.', 3, 'Circles', 'short', 1, '3e509f__Lml_Icse10_p1_img_0_jpeg.webp', NULL),
  ('MQ-3e509f-IV.1-0', '3e509f', 9, 'IV.1', '1. Find the \( 25^{th} \) term of the A.P.7,11,15,... , find the sum of 10 terms? [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-3e509f-IV.2-0', '3e509f', 10, 'IV.2', '2. A man observes the angle of elevation of the top of the tower to be \( 45^{0} \) . He walks towards it in a horizontal line through its base. On covering 20m the angle of elevation changes to \( 60^{0} \) . Find the height of the tower correct to 2 significant figures.', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-3e509f-IV.3-0', '3e509f', 11, 'IV.3', '3. Using properties of proportion solve for x, given \( \frac{\sqrt{5x}+\sqrt{2x-6}}{\sqrt{5x}-\sqrt{2x-6}}=4 \) [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-3e509f-V.1-0', '3e509f', 12, 'V.1', '1. A man standing on the bank of a river observes that the angle of elevation of a tree on the opposite bank is \( 60^{0} \) . When he moves 50m away from the bank, he finds the angle of elevation to be \( 30^{0} \) . Calculate the width of the river and height of the tree? [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-3e509f-V.2-0', '3e509f', 13, 'V.2', '2. In the given figure, C and D are points on the circumference of a circle on BA as diameter. Given angleBAD = 70\( ^{0} \). and angleDBC = 30\( ^{0} \), find angle ABD and angle BDC? [3]', 3, 'Circles', 'short', 2, '3e509f__Lml_Icse10_p2_img_0_jpeg.webp', NULL),
  ('MQ-3e509f-V.3-0', '3e509f', 14, 'V.3', '3. A train covers a distance of 200km travelling with a uniform speed of xkm/hr. Another train covers the same distance at a speed of \( (x + 5) \) km/hr. Find the time which each train takes to cover the distance between the stations, if the second train takes 2 hours less than the first, find the value of x? [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-3e509f-VI.1-0', '3e509f', 15, 'VI.1', '1. The volume and curved surface of a cylinder are equal numerically, If the height is 3.5 times the radius of the base, find the radius? [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-3e509f-VI.2-0', '3e509f', 16, 'VI.2', '2. Write down the equation of the line whose gradient is 3/2 and which passes through P, where P divides the line segment joining A (-2,6) and B(3,-4) in the ratio 2:3. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-3e509f-VI.3-0', '3e509f', 17, 'VI.3', '3. Use Remainder Theorem, factorise \(2x^{3} + 3x^{2} - 9x - 10\). [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-3e509f-VII.1-0', '3e509f', 18, 'VII.1', '1. A survey regarding height (in cm) of 60 boys belonging to Class 10 of a school was conducted. The following data was recorded: [4]

| HEIGHT(in cm) | 135-140 | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No: of boys | 4 | 8 | 20 | 14 | 7 | 6 | 1 |

Use the graph, find (i) median (ii) if above 158cm is considered as the tall boys of the class. Find the number of boys who are tall.', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-3e509f-VII.2-0', '3e509f', 19, 'VII.2', '2. Solve \( x^{2}-4x-8=0 \) , (using formula) and correct your answer to three significant figures. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-3e509f-VII.3-0', '3e509f', 20, 'VII.3', '3. In the given figure, angle PQR=angle PST = 90\( ^{0} \), PQ = 5cm and PS = 2cm. [3]

(i) Find area of \( \Delta PQR \) : area of quadrilateral SRQT

(ii) Prove that \(\Delta PQR \sim \Delta PST\).', 3, 'Similarity', 'short', 2, '3e509f__Lml_Icse10_p2_img_1_jpeg.webp', NULL),
  ('MQ-3e509f-VIII.1-0', '3e509f', 21, 'VIII.1', '1. The sum of the three numbers of an A.P. is 42 and the product of the first and third term is 52.

Find \(15^{\text{th}}\) term? [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-3e509f-VIII.2-0', '3e509f', 22, 'VIII.2', '2. Prove that \((\frac{1 - \tan\theta}{1 - \cot\theta})^2 = \tan^2\theta\) [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-3e509f-VIII.3-0', '3e509f', 23, 'VIII.3', '3. From a solid wooden cylinder of height 28cm and diameter 6cm two conical cavities are hollowed out.

The diameters of the cones are also of 6cm and height 10.5cm. ( \( \pi = \frac{22}{7} \) ), find the volume of the remaining solid? Sketch a rough diagram. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-3e509f-IX.1-0', '3e509f', 24, 'IX.1', '1. Find the co-ordinates of the trisection of the line segment joining the points (6,-9) and the origin?', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-3e509f-IX.2-0', '3e509f', 25, 'IX.2', '2. Which term of the A.P. 5, 15, 25, ... will be 130 more than its \(31^{\text{st}}\) term? [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-3e509f-IX.3-0', '3e509f', 26, 'IX.3', '3. If \( A = \begin{bmatrix} 4 & -5 \\ 3 & 2 \end{bmatrix} \) and \( B = \begin{bmatrix} 2 & -3 \\ -1 & 4 \end{bmatrix} \), find the value of \( 6A - B^2 + I \). [4]', 4, 'Matrices', 'long', 3, NULL, NULL),
  ('MQ-3e509f-X.1-0', '3e509f', 27, 'X.1', '1. For what value of K will the following quadratic equation: [3]

\((k + 1)x^{2} - 4kx + 9 = 0\) have real and equal roots?', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3e509f-X.2-0', '3e509f', 28, 'X.2', '2. Find `a`, if the mean of the following data is 55.33. [4]

| Daily wages | 40-45 | 45=50 | 50-55 | 55-60 | 60-65 |
| --- | --- | --- | --- | --- | --- |
| No: of workers | 2 | a | 7 | 12 | 6 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-3e509f-X.3-0', '3e509f', 29, 'X.3', '3. The length of the sides of a right triangle are \((5x + 2)\), \((5x)\) and \((3x - 1)\). Find the length of each side. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3e509f-XI.1-0', '3e509f', 30, 'XI.1', '1. The price of a motorcycle is Rs. 44880 including tax underGST at the rate of \(18\%\) on its listed price. [4] A buyer asks for a discount on the listed price so that after charging GST the selling price of motorcycle becomes equal to the listed price. Find the discount amount in which the seller has to allow for the deal?', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-3e509f-XI.2-0', '3e509f', 31, 'XI.2', '2. If \( A = \frac{6xy}{x + y} \), find the value of \( \frac{A + 3x}{A - 3x} + \frac{A + 3y}{A - 3y} \). [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-3e509f-XI.3-0', '3e509f', 32, 'XI.3', '3. The median of the observations 11,12,14,(a-2),(a+4),(a+9),32,38,47 arranged in ascending order is 24. Find the value of a and then its mean? [3]', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-8d981c-1-0', '8d981c', 0, '1', 'a) Solve the given inequation and graph the solution on the number line:

\[
2 y - 3 < y + 1 \leq 4 y + 7; y \in R
\]', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-8d981c-1-1', '8d981c', 1, '1', 'b) Solve the quadratic equation and give the answer correct to two decimal places.

\[
3 x ^ {2} - x - 7 = 0
\]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-8d981c-1-2', '8d981c', 2, '1', 'c) Shahrukh opened a Recurring Deposit account in a bank and deposited Rs 800 per month for \(1\frac{1}{2}\) yrs. If he received Rs 15084 at the time of maturity, find the rate of interest per annum. [3+3+4]', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-8d981c-2-0', '8d981c', 3, '2', 'a) Prove the identity:

\[
\frac {\cos A}{1 - \tan A} + \frac {\sin A}{1 - \cot A} = \sin A + \cos A
\]', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-8d981c-2-1', '8d981c', 4, '2', 'b) In the given figure, O is the centre of the circle. Chord CD is parallel to the diameter AB. If \( \angle ABC = 25^{\circ} \) , Calculate \( \angle CED \) .', 3, 'Circles', 'short', 1, '8d981c__MPBFHS_X_M_p1_img_0_jpeg.webp', NULL),
  ('MQ-8d981c-2-2', '8d981c', 5, '2', 'c) Draw a histogram and estimate the mode for the following frequency distribution.

| Classes | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 8 | 10 | 5 | 4 | 3 |

[3+3+4]', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-8d981c-3-0', '8d981c', 6, '3', 'a) The sum of three numbers in A.P is 12 and the sum of their cubes is 216. Find the numbers.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-8d981c-3-1', '8d981c', 7, '3', 'b) If \(\begin{bmatrix} 1 & 2 \\ 3 & 3 \end{bmatrix} \begin{bmatrix} x & 0 \\ 0 & y \end{bmatrix} = \begin{bmatrix} x & 0 \\ 9 & 0 \end{bmatrix}\) find the value of \(x\) and \(y\).', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-8d981c-3-2', '8d981c', 8, '3', 'c) Show that (x-3) is a factor of \( x^3 - 7x^2 + 15x - 9 \). Hence factorise \( x^3 - 7x^2 + 15x - 9 \). [3+3+4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-8d981c-4-0', '8d981c', 9, '4', 'a) If $x, y, z$ are in continued proportion, prove that :

$$
\frac {(x + y) ^ {2}}{(y + z) ^ {2}} = \frac {x}{z}
$$', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-8d981c-4-1', '8d981c', 10, '4', 'b) If $A = (-4, 3)$ and $B = (8, -6)$

i) Find the length of AB.
ii) In what ratio is the line segment joining AB, divided by the x-axis?', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8d981c-4-2', '8d981c', 11, '4', 'c) A conical tent is 10cm high and the radius of its base is 24cm. Find:-

i) Slant height of the tent.
ii) Cost of canvas required to make the tent, if the cost of \(1\mathrm{m}^2\) canvas is Rs 70.

[3+3+4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-8d981c-5-0', '8d981c', 12, '5', 'a) Find the values of $k$ for which the following quadratic equation has equal roots.

$$
x ^ {2} - 2 k x + 7 k - 1 2 = 0
$$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-8d981c-5-1', '8d981c', 13, '5', 'b) A box contains 7 blue, 8 white and 5 black marbles. If a marble is drawn at random from the box, what is the probability that it will be:

i) Black?
ii) Blue or black?
iii) Not black?', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-8d981c-5-2', '8d981c', 14, '5', 'c) In the given figure, AB and DE are perpendiculars to BC.

i) If AB=6cm, DE=4cm, and AC=15cm, Calculate CD.
ii) Find the ratio of the area of \(\Delta ABC\) : area of \(\Delta DEC\).

[3+3+4]', 4, 'Similarity', 'long', 2, '8d981c__MPBFHS_X_M_p2_img_0_jpeg.webp', NULL),
  ('MQ-8d981c-6-0', '8d981c', 15, '6', 'a) A dealer buys an article at a discount 30% from the wholesaler, the market price being Rs 6000. The dealer sells it to the consumer at a discount of 10% on the marked price. If the Sales are intra-state and the rate of GST is 5%, find:

i) The amount paid by the consumer for the article.
ii) The tax (under GST) paid by the dealer to the state government.
iii) The amount of tax (under GST) received by the central Government.', 5, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-8d981c-6-1', '8d981c', 16, '6', 'b) Use graph paper for this question.

i) Plot the points A (6, 4) and B (0, 4).
ii) Reflect A and B in the origin to get images A'' and B''. Write the co-ordinates of A'' and B''.
iii) State the geometrical names for the figure ABA''B''.
iv) Find its perimeter. [5+5]', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-8d981c-7-0', '8d981c', 17, '7', 'a) A vertical pole and a vertical tower are on the same level ground. From the top of the pole, the angle of elevation of the top of the tower is 60° and the angle of depression of the foot of the tower is 30°. Find the height of the tower if the height of the pole is 20m.', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-8d981c-7-1', '8d981c', 18, '7', 'b) The marks obtained by 100 students in a mathematics test are given below:-

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Draw ogive from it determine:-

i) Median
ii) Lower quartile
iii) Number of students who obtained more than 85% marks in the test. [4+6]', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-8d981c-8-0', '8d981c', 19, '8', 'a) When 0° < θ < 90°, solve: 2cos²θ + sinθ - 2 = 0', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-8d981c-8-1', '8d981c', 20, '8', 'b) The volume of a cone is the same as that of the cylinder whose height ids 9cm and diameter is 40 cm. Find the radius of the base of the cone if its height is 108cm.', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-8d981c-8-2', '8d981c', 21, '8', 'c) Calculate the mean of the following distribution:-

| Class Interval | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 8 | 5 | 12 | 35 | 24 | 16 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-8d981c-9-0', '8d981c', 22, '9', 'a) In ΔABC, A(3,5), B(7,8) and C(1,-10). Find the equation of the median through A.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-8d981c-9-1', '8d981c', 23, '9', 'b) If the sum of the first 7 terms of an A.P is 49 and that of first 17 terms is 289, find the sum of first n terms.', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-8d981c-9-2', '8d981c', 24, '9', 'c) If x = √[a+1] + √[a-1] / √[a+1] - √[a-1] , using properties of proportion, show that x² - 2ax + 1 = 0.

[3+3+4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-8d981c-10-0', '8d981c', 25, '10', 'a) In the given figure, PQ is a tangent to the circle at A, DB is a diameter, $\angle ADB = 30^{\circ}$ and $\angle CBD = 60^{\circ}$, calculate:-

i) $\angle QAB$
ii) $\angle PAD$
iii) $\angle CDB$', 3, 'Circles', 'short', 4, '8d981c__MPBFHS_X_M_p4_img_0_jpeg.webp', NULL),
  ('MQ-8d981c-10-1', '8d981c', 26, '10', 'b) What number must be subtracted from $2x^2 - 5x$ so that the resulting polynomial leaves the remainder 2 when divided by $(2x+1)$?', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-8d981c-10-2', '8d981c', 27, '10', 'c) A car covers a distance of 400km at a certain speed. Had the speed been 12km/hr more, the time taken for the journey would have been 1 hour 40 minutes less, find the original speed of the car. [3+3+4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-8d981c-11-0', '8d981c', 28, '11', 'a) In the given figure, XY||QR. If $\frac{PQ}{XQ} = \frac{7}{3}$ and PR = 6.3cm find YR.', 3, 'Similarity', 'short', 4, '8d981c__MPBFHS_X_M_p4_img_1_jpeg.webp', NULL),
  ('MQ-8d981c-11-1', '8d981c', 29, '11', 'b) If $(3x+1)$: $(5x+3)$ is the triplicate ratio of 3:4, find the value of x.', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-8d981c-11-2', '8d981c', 30, '11', 'c) If $A = \begin{bmatrix} 1 & 3 \\ 3 & 4 \end{bmatrix}$ and $B = \begin{bmatrix} -2 & 1 \\ -3 & 2 \end{bmatrix}$ and $A^2 - 5B^2 = 5C$, find the matrix C where C is a 2 X 2 matrix.

[3+3+4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-63a77f-1-0', '63a77f', 0, '1', '(a) Find the value of the constant a and b, if x - 2 and x + 3 are both factors of expression x³ + ax² + bx - 12. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-63a77f-1-1', '63a77f', 1, '1', '(b) Ram has a recurring deposit account in a bank for 3½ years at 9.5% S.I per annum. If he gets Rs.78,638 at the time of maturity, find the monthly instalment. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-63a77f-1-2', '63a77f', 2, '1', '(c) Two pipes running together can fill a cistern in 11⅛ minutes. If one pipe takes 5 minutes more than the other to fill the cistern find the time taken by each pipe to fill the cistern. [4]', 4, 'Quadratic Equations', 'long', 1, NULL, NULL),
  ('MQ-63a77f-2-0', '63a77f', 3, '2', '(a) Given:
P = {x: 5 < 2x - 1 ≤ 11, x ∈ R} [3]

Q = {x: -1 ≤ 3 + 4x < 23, x ∈ I}

Represent P and Q on number lines. Write down the elements of P ∩ Q', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-63a77f-2-1', '63a77f', 4, '2', '(b) Solve 1 + 6 + 11 + 16 + ... + x = 148 [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-63a77f-2-2', '63a77f', 5, '2', '(c) The following transactions of a retailer in Tamil Nadu shows the sale and purchase of some electronic items within the same state. [4]

i. Bought the goods at the list price of RS.55,00,000 with 20% trade discount.

ii. Sold the same whole goods at the list price of Rs.70,00,000 with 30% trade discount.

If both CGST and SGST charged are at 9% each, calculate to determine whether there is a tax payable or tax credited during the whole transaction.', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-63a77f-3-0', '63a77f', 6, '3', '(a) Given \( A = \begin{bmatrix} p & 0 \\ 0 & 2 \end{bmatrix} \) , \( B = \begin{bmatrix} 0 & -q \\ 1 & 0 \end{bmatrix} \) , \( C = \begin{bmatrix} 2 & -2 \\ 2 & 2 \end{bmatrix} \) and \( BA = C^{2} \) , find the values of p and q', NULL, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-63a77f-3-1', '63a77f', 7, '3', '(b) Prove that \( \frac{tanA}{1-cotA} + \frac{cotA}{1-tanA} = secAcosecA + 1 \) [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-63a77f-3-2', '63a77f', 8, '3', '(c) In the given circle with centre O, \( \angle ABC = 100^{\circ} \) , \( \angle ACD = 40^{\circ} \) and CT is a tangent to the circle at C. Find \( \angle ADC \) and \( \angle DCT \)', NULL, 'Circles', 'short', 2, '63a77f__Nps_Icse10_p2_img_0_jpeg.webp', NULL),
  ('MQ-63a77f-4-0', '63a77f', 9, '4', '(a) Find the probability of having 53 Sundays in a non-leap year [3]', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-63a77f-4-1', '63a77f', 10, '4', '(b) The mean of the following distribution is 6. Find the value of \( p \) [3]

| x | 2 | 4 | 6 | 10 | p+5 |
| --- | --- | --- | --- | --- | --- |
| f | 3 | 2 | 3 | 1 | 2 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-63a77f-4-2', '63a77f', 11, '4', '(c) A vessel in the form of an inverted cone is filled with water to the brim. Its height is 20 cm and diameter is 16.8 cm. Two equal solid cones are dropped in it so that they are fully submerged. As a result, one-third of the water in the original cone overflows, What is the volume of each of the solid cones submerged?', NULL, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-63a77f-5-0', '63a77f', 12, '5', '(a) A man on the top of a vertical observation tower observes a car moving at a uniform speed coming directly it. If it takes 12 minutes for the angle of depression to change from \(30^{\circ}\) to \(45^{\circ}\), how soon after this will the car reach the observation tower? Give the answer correct to the nearest seconds.', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-63a77f-5-1', '63a77f', 13, '5', '(b) If \((x - 9):(3x + 6)\) is the duplicate ratio of \(4:9\), find the value of \(x\) [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-63a77f-5-2', '63a77f', 14, '5', '(c) In the adjoining figure ABC is a right angled triangle with \(\angle BAC = 90^{\circ}\), and AD⊥BC.

Page 2 of 5

 
i. Prove that $\Delta ADB \sim \Delta CDA$
ii. If $BD = 18 \text{ cm}$, $CD = 8 \text{ cm}$, find $AD$
iii. Find the ratio of the area of $\Delta ADB$ to $\Delta CDA$', NULL, 'Similarity', 'short', 2, '63a77f__Nps_Icse10_p3_img_0_jpeg.webp', NULL),
  ('MQ-63a77f-6-0', '63a77f', 15, '6', '(a) Show that the points $A(-2, 5), B(2, -3)$ and $C(0, 1)$ are collinear. [3]', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-63a77f-6-1', '63a77f', 16, '6', '(b) Using componendo and dividendo, find the value of $x$ if $\frac{(\sqrt{3x+4}+\sqrt{3x-5})}{(\sqrt{3x+4}-\sqrt{3x-5})} = 9$ [3]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-63a77f-6-2', '63a77f', 17, '6', '(c) Using a Graph paper, plot the points A (6, 4) and B (0, 4) [4]

i. Reflect A and B in the origin to get the images $A''$ and $B''$
ii. Write the co-ordinates of $A''$ and $B''$
iii. State the geometrical name for the figure $ABA''B''$
iv. Find its perimeter', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-63a77f-7-0', '63a77f', 18, '7', '(a) The first term of an Arithmetic Progression is 10 and the last term is 50. Sum of all the terms is 480, find the common difference and the number of terms. [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-63a77f-7-1', '63a77f', 19, '7', '(b) $\frac{\cos A}{1-\tan A} + \frac{\sin A}{1-\cot A} = \cos A + \sin A$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-63a77f-7-2', '63a77f', 20, '7', '(c) Solve the following equation: [4]

$x^4 - 26x^2 + 25 = 0$', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-63a77f-8-0', '63a77f', 21, '8', '(a) The marks obtained by 100 students in Mathematics are given below: [6]

Use a graph sheet to draw an Ogive (Use 2 cm = 10 units on both axes) and find out

i. Median
ii. Lower quartile
iii. Number of students who obtained more than 85% marks in the test
iv. Number of students who did not pass the test if the pass percentage was 35.

Page 3 of 5

 
| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-63a77f-8-1', '63a77f', 22, '8', '(b) An exhibition tent is in the form of a cylinder surmounted by a cone. The height of the tent above the ground is 85 m and the height of the cylindrical part is 50 m. If the diameter of the base is 168 m, find the quantity of the canvas required to make the tent. Allow 20% extra for folds and stitching.

Give the answer to the nearest \( m^{2} \) .

[4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-63a77f-9-0', '63a77f', 23, '9', '(a) A bag contains 6 red balls, 8 white balls, 5 green balls and 3 black balls. One ball is drawn at random from the bag. Find the probability that the ball is [3]

(i) White, (ii) Red or Black, (iii) Not green.', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-63a77f-9-1', '63a77f', 24, '9', '(b) A line intersects the x axis at \( (-2, 0) \) and cuts off an intercept of 3 units from the positive side of y axis. Find the equation of the line. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-63a77f-9-2', '63a77f', 25, '9', '(c) If \( \mathrm{A} = \begin{bmatrix} 1 & 0 \\ -1 & 7 \end{bmatrix} \). Determine \( k \) so that \( A^2 = 8A + kI \) [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-63a77f-10-0', '63a77f', 26, '10', '(a) If \((x - 2)\) is a factor of \(2x^{3} - x^{2} - px - 2\) find the value of p and factorise the expression completely. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-63a77f-10-1', '63a77f', 27, '10', '(b) 2 men on either side of a temple 75m high observed the angle of elevation of the top of the temple to be \( 30^{\circ} \) and \( 60^{\circ} \) . Find the distance between the 2 men. [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-63a77f-10-2', '63a77f', 28, '10', '(c) Find the mode of the following distribution using Histogram: [4]

| Class Interval | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 | 30-35 | 35-40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Freq | 10 | 14 | 28 | 42 | 50 | 30 | 14 | 12 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-63a77f-11-0', '63a77f', 29, '11', '(a) If P( - b, 9a - 2) divides the line segment joining the point A (- 3, 3a + 1) and B (5, 8a) in the ratio 3:1. Find the values of a and b. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-63a77f-11-1', '63a77f', 30, '11', '(b) Veena deposits Rs. 100 per month in a bank cumulative time deposit scheme for 5 years. What amount does she get on maturity if the rate of interest is 16% [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-63a77f-11-2', '63a77f', 31, '11', '(c) A, B, C are three points on a circle. Tangent at C meets BA produced at T. Given that ∠ATC = 36°. ∠ACT = 48°. Calculate the angle subtended by AB at the centre of the circle. [4]', 4, 'Circles', 'long', 5, NULL, NULL),
  ('MQ-876e1d-1-0', '876e1d', 0, '1', 'a) $$\left[ \begin{array}{cc} 4 & 2a + 1 \\ 9 + b & c + 3 \end{array} \right] = \left[ \begin{array}{cc} 4 & 7 \\ 3 + 2b & 4 - c \end{array} \right]$$. Find the value of a, b, c. [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-876e1d-1-1', '876e1d', 1, '1', 'b) If O is the centre of the circle, PQ is the chord and tangent PR at P makes an angle of 60⁰ with PQ, then find angle POQ. [3]', 3, 'Circles', 'short', 1, '876e1d__Nps_X_Math_p1_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-1-2', '876e1d', 2, '1', 'c) Observe the given number lines A and B [4]

(i) Write the replacement set of A.
(ii) Write the replacement set of B.
(iii) Write the replacement set of A ∩ B
(iv) Write the replacement set of A¹ ∩ B', 4, 'Linear Inequations', 'long', 2, '876e1d__Nps_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-2-0', '876e1d', 3, '2', 'a) What number should be added to 6, 15, 20 and 43 to make them proportional? [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-876e1d-2-1', '876e1d', 4, '2', 'b) If cot θ = 1/√3 find the value of (1 - cos²θ) / (2 - sin²θ) [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-876e1d-2-2', '876e1d', 5, '2', 'c) A box contains 19 balls bearing numbers 1, 2, 3 ...19. A ball is drawn at random from the box. Find the probability that the number on the ball is
(i) not a prime number (ii) divisible by 3 or 5 (iii) neither divisible by 5 nor 10 (iv) an even number [4]', 4, 'Probability', 'long', 2, NULL, NULL),
  ('MQ-876e1d-3-0', '876e1d', 6, '3', 'a) The number of family members of 31 families of a village is as shown. What is their mean, median and mode? [3]

| Number of members | Number of families |
| --- | --- |
| 2 | 1 |
| 3 | 2 |
| 4 | 4 |
| 5 | 6 |
| 6 | 10 |
| 7 | 3 |
| 8 | 5 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-876e1d-3-1', '876e1d', 7, '3', 'b) Three traders A, B and C belong to different states. Trader A sells some goods to trader B for ₹ 500 and trader B sells to trader C at a profit of ₹ 200. Calculate the tax liability of B, if rate of GST is 12%. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-876e1d-3-2', '876e1d', 8, '3', 'c) Due to sudden floods, some welfare associations jointly requested the government to get 100 tents fixed immediately and offered to contribute 50% of the cost. If the lower part of each tent is of the form of a cylinder of diameter 4.2 m and height 4 m with the conical upper part of same diameter but 2.8 m height. Find the amount the associations would have to pay if the cost of the canvas used is ₹ 100 per sq. m. [4]', 4, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-876e1d-4-0', '876e1d', 9, '4', 'a) The sum of the two digits of a two - digit number is 12. The number obtained by interchanging the digits exceeds the given number by 18. Find the number. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-876e1d-4-1', '876e1d', 10, '4', 'b) Find the 6th term from the end of an AP 5, 2, -1, -4, ... - 31. [3]', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-876e1d-4-2', '876e1d', 11, '4', 'c) In the figure, AD is the median of triangle ABC. P is the midpoint of AD, then find the ratio of AE and AC if BE is parallel to DF. [4]', 4, 'Similarity', 'long', 3, '876e1d__Nps_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-5-0', '876e1d', 12, '5', 'a) BD is tangent to a circle with centre O. Secant BA passes through O. Show that L ACD and L BAC are complementary angles. [3]', 3, 'Circles', 'short', 3, '876e1d__Nps_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-5-1', '876e1d', 13, '5', 'b) The mid points of three sides of a triangle are (1,1), (2, -3) and (3,4). Find the centroid of the triangle and the coordinates of the vertices. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-876e1d-5-2', '876e1d', 14, '5', 'c) Prove that: $$\frac{\tan \theta}{1 - \cot \theta} + \frac{\cot \theta}{1 - \tan \theta} = 1 + \sec \theta \csc \theta$$ [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-876e1d-6-0', '876e1d', 15, '6', 'a) Let A (3,2), B (3,5) and C (5,2) be the vertices of $$\Delta ABC$$. The points A, B, C are reflected in the X-axis onto A'', B'' C'' respectively. On a further reflection in the Y-axis, the vertices map onto A", B", C" respectively. Find the co-ordinates of the vertices of $$\Delta A$$" B"C". Name a single reflection that maps $$\Delta ABC$$ to $$\Delta A$$" B"C". [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-876e1d-6-1', '876e1d', 16, '6', 'b) Using the point slope form, find the equation of the line AB in the given figure. [3]', 3, 'Coordinate Geometry', 'short', 4, '876e1d__Nps_X_Math_p4_img_1_jpeg.webp', NULL),
  ('MQ-876e1d-6-2', '876e1d', 17, '6', 'c) Prove that 4x - 5 is a factor of 36 x² - 29x -20. Hence factorise the quadratic equation completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-876e1d-7-0', '876e1d', 18, '7', 'a) Mr Prabhakar opens a recurring deposit account of ₹ 300 per month at 8% simple interest per annum. On maturity, he gets ₹ 9930. Find the period for which he continued the account. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-876e1d-7-1', '876e1d', 19, '7', 'b) If a, b, c, d are in continued proportion, prove that: [3]

$$\sqrt{(a + b + c)(b + c + d)} = \sqrt{ab} + \sqrt{bc} + \sqrt{cd}$$', 3, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-876e1d-7-2', '876e1d', 20, '7', 'c) if (2n + 3) is the nth term of an AP, find its

- (i) first term
- (ii) common difference
- (iii) the 15th term
- (iv) sum of first 16 terms [4]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-876e1d-8-0', '876e1d', 21, '8', 'a) Draw an Ogive using the following frequency distribution. [6]

| CLASS INTERVAL | FREQUENCY |
| --- | --- |
| 20 -30 | 10 |
| 30 - 40 | 8 |
| 40 - 50 | 12 |
| 50 - 60 | 24 |
| 60 - 70 | 6 |
| 70 - 80 | 25 |
| 80 - 90 | 16 |

From the Ogive find: (i) median (ii) lower quartile

(iii) upper quartile (iv) inter quartile range.', 6, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-876e1d-8-1', '876e1d', 22, '8', 'b) A boat can cover 10 km up the stream and 5 km downstream in 6 hours.

If the speed of the stream is 1.5 km/h, find the speed of the boat in still water. [4]', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-876e1d-9-0', '876e1d', 23, '9', 'a) Given A = $$\begin{bmatrix} 2 & -1 \\ 2 & 0 \end{bmatrix}$$ B = $$\begin{bmatrix} -3 & 2 \\ 4 & 0 \end{bmatrix}$$ and C = $$\begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$ Find the matrix X such that A + X = 2B + C [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-876e1d-9-1', '876e1d', 24, '9', 'b) In $$\Delta$$ ABC, L A = 90, DGFE is a square. If AG = 3 cm and AF = 4 cm, find the following: [3]

(i) $$\frac{AR(\Delta AGF)}{AR(\Delta GBD)}$$

(ii) $$\frac{AR(\Delta FEC)}{AR(\Delta AGF)}$$

(iii) $$\frac{AR(\Delta AGF)}{AR(\Delta ABC)}$$', 3, 'Similarity', 'short', 6, '876e1d__Nps_X_Math_p6_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-9-2', '876e1d', 25, '9', 'c) A, B, C are three points on a circle. The tangent at C meets BA produced at T. Given that L ATC = 36, L ACT = 48 calculate the angle subtended by AB at the centre of the circle. [4]', 4, 'Circles', 'long', 6, '876e1d__Nps_X_Math_p6_img_1_jpeg.webp', NULL),
  ('MQ-876e1d-10-0', '876e1d', 26, '10', 'a) If $$\frac{\sqrt{36x+1}+6\sqrt{x}}{\sqrt{36x+1}-6\sqrt{x}} = 9$$, Find the value of x using the properties of proportion. [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-876e1d-10-1', '876e1d', 27, '10', 'b) From the top of a light house, the angles of depression of two ships on opposite sides of it are observed to be 30⁰ and 60⁰. if the height of the light house is h metres and the line joining the ships passes through the foot of the light house, show that the distance between the ships is

$$\frac{4h}{\sqrt{3}} \text{ m.} \tag{3}$$', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-876e1d-10-2', '876e1d', 28, '10', 'c) A cylindrical bucket, 32 cm high and base radius 18 cm is filled with sand. This bucket is emptied on the ground and a conical heap of sand is formed. If the height of the conical heap is 24 cm, find the radius and slant height of the heap. [4]', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-876e1d-11-0', '876e1d', 29, '11', 'a) Solve for x and give your answer correct to two decimal places.

$$4x^2 - 7x + 2 = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-876e1d-11-1', '876e1d', 30, '11', 'b) Two circles with centres A and B intersect at C and D. The centre B lies on the circumference of circle with centre A. if angle CED = 70, find angle CFD. [3]', 3, 'Circles', 'short', 7, '876e1d__Nps_X_Math_p7_img_0_jpeg.webp', NULL),
  ('MQ-876e1d-11-2', '876e1d', 31, '11', 'c) Use graph paper for this question: [4]

(i) The point P (5,3) is reflected in the origin to get image P''. write the coordinates of P''.
(ii) If M is the foot of the perpendicular from P to the x-axis, write the coordinates of M.
(iii) If N is the foot of the perpendicular from P'' to x-axis, write the coordinates of N.
(iv) Find the area of the figure PMP''N.', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-0622b3-1-0', '0622b3', 0, '1', 'a) Given A = $$\begin{bmatrix} 4 & -12 \\ 4 & 0 \end{bmatrix}$$, B = $$\begin{bmatrix} -3 & 2 \\ 4 & 1 \end{bmatrix}$$ and C = $$\begin{bmatrix} 4 & 0 \\ 0 & 0 \end{bmatrix}$$

Find the matrix X such that A + 2X = 2B + C (3)', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-0622b3-1-1', '0622b3', 1, '1', 'b) A man invests ₹ 9000 in shares of a company which is paying 8% dividend. If ₹ 100 shares are available at a discount of 10%. Find:

(i) Number of shares he purchased.
(ii) His annual income. (3)', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-0622b3-1-2', '0622b3', 2, '1', 'c) The median of the following observations 9,10,12,(X - 4), (X +2), (X + 7), 30, 36, 45 arranged in ascending order is 22.

Find the value of X and hence find its mean. (4)', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-0622b3-2-0', '0622b3', 3, '2', 'a) (x - 1) is a factor of the expression 2x² + ax² + bx - 14 and when the expression is divided by (x - 3), it leaves a remainder 52, find the values of a and b. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-0622b3-2-1', '0622b3', 4, '2', 'b) Prove that :

(cosecθ - sinθ) (secθ - cosθ) (tanθ + cotθ) = 1 (3)', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-0622b3-2-2', '0622b3', 5, '2', 'c) In an Arithmetic Progression, the third term is 8 and the seventh term is 12. Find the:

(i) First term
(ii) Common difference
(iii) Sum of first 20 terms. (4)', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-0622b3-3-0', '0622b3', 6, '3', 'a) In the given figure, ⊥BAD = 60° ⊥ABD = 70° and ⊥BDC = 40°.

(i) Prove that AC is the diameter of the circle.
(ii) Find ACB.
(iii) BCD

(3)', 3, 'Circles', 'short', 2, '0622b3__Nps_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-0622b3-3-1', '0622b3', 7, '3', 'b) The line joining P (-4, 5) and Q (3, 2) intersects the Y-axis at

point R.PM and QN are perpendiculars from P and Q on the X- axis. Find:

Scanned by CamScanner
(i) The ratio PRiRO
(ii) The coordinates of R
(iii) The area of the quadrilateral PRiRO. (3)', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-0622b3-3-2', '0622b3', 8, '3', 'c) Draw a histogram for the following frequency distribution and find the mode from the graph.

| class | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 |
| --- | --- | --- | --- | --- | --- | --- |
| frequency | 2 | 5 | 18 | 14 | 8 | 5 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-0622b3-4-0', '0622b3', 9, '4', 'a) Solve the following equation and calculate the answer correct to two decimal places.

$$2H^2 = 5H = 10 = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-0622b3-4-1', '0622b3', 10, '4', 'b) ABCD is a trapezium in which AB is parallel to CD, Diagonals AC and BD intersect at O.

(i) Prove that A AOB \(\sim\) ACOB.
(ii) If \(OA = 6\) cm and \(OC = 8\) cm, Find

$$(1) \frac{AB(A, AOD)}{AB(A, COD)} \quad (2) \frac{AB(A, AOD)}{AB(A, COD)}$$', NULL, 'Similarity', 'short', 3, '0622b3__Nps_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-0622b3-4-2', '0622b3', 11, '4', 'c) A solid metallic sphere of radius 12 cm is melted and recast into a solid cylinder of height 36 cm. Find the:

(i) Radius of the cylinder
(ii) Curved surface area of the cylinder. (4)', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-0622b3-5-0', '0622b3', 12, '5', 'a) In a single throw of two dice, what is the probability of getting

(i) A total of 9
(ii) a doublet
(iii) 5 on one die and 6 on the other (3)', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-0622b3-5-1', '0622b3', 13, '5', 'b) Ms Rajani deposits a certain sum of money each month in a Recurring Deposit Account of a bank. If the rate of interest is of \(8\%\) per annum and Ms Rajani gets \(\text{₹} 8088\) from the bank after 3 years, find the value of her monthly instalment. (3)', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-0622b3-5-2', '0622b3', 14, '5', 'c) Solve the following inequation, write the solution set and represent it on the number line. (4)

$$\frac{-X}{3} \le \frac{X}{2} - \frac{4}{3} < \frac{1}{6}, \mathbf{x} \in \mathbf{R}$$', 4, 'Linear Inequations', 'long', 4, NULL, NULL),
  ('MQ-0622b3-6-0', '0622b3', 15, '6', 'a) Show that \(\sqrt{\frac{1 - \cos A}{1 + \cos A}} = \frac{1 - \cos A}{\sin A}\) (3)', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-0622b3-6-1', '0622b3', 16, '6', 'b) In the given circle with centre O, \(\angle ABC = 100^{\circ}\), \(\angle ACD = 40^{\circ}\) and CT is a tangent to the circle at C. Find \(\angle ADC\) and \(\angle DCT\). (3)

Scanned by CamScanner', 3, 'Circles', 'short', 4, '0622b3__Nps_X_Math_p5_img_0_jpeg.webp', NULL),
  ('MQ-0622b3-6-2', '0622b3', 17, '6', 'c) A hemispherical and a conical hole is scooped out of a solid wooden cylinder. Find the volume of the remaining solid where the measurements are as follows: The height of the solid cylinder is 7 cm, radius of each of hemisphere, cone and cylinder is 3 cm. Give your answer correct to the nearest whole number. The height of the cone is 3 cm. (4)', 4, 'Mensuration', 'long', 5, '0622b3__Nps_X_Math_p5_img_1_jpeg.webp', NULL),
  ('MQ-0622b3-7-0', '0622b3', 18, '7', 'a) Find the Geometric Progression for which the sum of first two terms is - 4 and the fifth term is 4 times the third term. (3)', 3, 'Geometric Progression', 'short', 5, NULL, NULL),
  ('MQ-0622b3-7-1', '0622b3', 19, '7', 'b) In the given figure, AB and DE are perpendicular to BC.

(i) Prove that \(\Delta ABC \sim \Delta DEC\)
(ii) If \(AB = 6\mathrm{cm}\) \(\mathrm{DE} = 4\mathrm{cm}\) AC = 15 cm, calculate CD.
(iii) Find the ratio of the area of \(\Delta ABC: \Delta DEC\). (3)', 3, 'Similarity', 'short', 6, '0622b3__Nps_X_Math_p6_img_0_jpeg.webp', NULL),
  ('MQ-0622b3-7-2', '0622b3', 20, '7', 'c) TIPTOP ELECTRONICS supplied an AC of 1.5 ton to a company.

Cost of the AC supplied is Rs 51,200 (with GST). Rate of CGST on AC is 14%, then find the following:

(i) Rate of SGST
(ii) Rate of GST
(iii) Taxable value of AC.
(iv) Total amount of GST. (4)', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-0622b3-8-0', '0622b3', 21, '8', 'a) Using the properties of proportion, solve for X (3)

$$\frac{X^3+3X}{3X^2+1} = \frac{341}{91}$$', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-0622b3-8-1', '0622b3', 22, '8', 'b) The co-ordinates of P (2, 6) and Q (-3, 5) are given. Find (3)

(i) The gradient of PQ
(ii) The equation of PQ
(iii) The coordinates of the point where PQ intersects X-axis.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-0622b3-8-2', '0622b3', 23, '8', 'c) Use ruler and compass only for answering this question.

Draw a circle of radius 4 cm. Mark the centre as O. Mark a point P outside the circle at a distance of 7 cm from the centre. Construct

Scanned by CamScanner
two tangents to the circle from the external point P. Measure and write down the length of the tangents. (4)', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-0622b3-9-0', '0622b3', 24, '9', 'a) Use graph sheet for this question. Take 1cm = 1 unit on both axis.

(i) Plot the following points A (0, 5) B (3, 0) C (1, 0) D (1, -5).
(ii) Reflect the points B,C and D on the Y-axis and name them as B",C" and D" respectively.
(iii) Write down the coordinates of \(B^{\prime \prime},C^{\prime \prime},D^{\prime \prime}\)
(iv) Join the points A,B,C,D,D",C",B",A", in order and give a name to the closed figure formed. (5)', 5, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-0622b3-9-1', '0622b3', 25, '9', 'b) Construct angle ABC= 60 and AB = BC = 8 cm. The midpoints of BA and BC are M and N respectively. Draw and describe the locus of a point which is:

(i) Equidistant from BA and BC.
(ii) \(4\mathrm{cm}\) from M
(iii) \(4\mathrm{cm}\) from N.
(iv) Mark the point P which is 4 cm from M and N and equidistant from BA and BC. Join MP and NP and name the figure BMPN. (5)', 5, 'Loci', 'long', 7, NULL, NULL),
  ('MQ-0622b3-10-0', '0622b3', 26, '10', 'a) If x, y, z are in continued proportion, prove that (4)

$$\frac{(x+y)^{\frac{1}{2}}}{(y+x)^{\frac{1}{2}}} = \frac{x}{y}$$', 4, 'Ratio and Proportion', 'long', 7, NULL, NULL),
  ('MQ-0622b3-10-1', '0622b3', 27, '10', '| b) Use the given frequency distribution : | | | | | | |
| --- | --- | --- | --- | --- | --- | --- |
| C.I | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 | 30-35 |
| FREQ | 3 | 4 | 6 | 9 | 7 | 1 |

Draw an OGIVE and hence find the lower quartile, upper quartile and inter quartile range. (6)', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-0622b3-11-0', '0622b3', 28, '11', 'a) Calculate the ratio in which the line joining A (-4, 2) and B(3,6) is divided by the point P (x, 3). Also find (i) x and (ii) length of AP. (3)', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-0622b3-11-1', '0622b3', 29, '11', 'b) A straight road leads to the foot of a tower 200 m high. From the top of the tower the angles of depression of two cars standing on the road are observed to be 45 and 60 respectively. Find the distance between the two cars. (3)', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-0622b3-11-2', '0622b3', 30, '11', 'c) A shopkeeper purchases certain number of books for ₹ 960. If the cost per book was ₹ 8 less, the number of books that could be purchased for ₹ 960 would be 4 more. Write an equation, taking the original cost of each book to be ₹x and solve it to find the original cost of the books. (4)', 4, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-8850b2-1-0', '8850b2', 0, '1', '1. If four number are in proportion then product of extreme =', NULL, 'Ratio and Proportion', 'MCQ', 1, NULL, array['product of first two terms', 'product of means', 'product of middle two terms', 'option (b) and (c) both']::text[]),
  ('MQ-8850b2-1-1', '8850b2', 1, '1', '2. If a, b, c is in continued proportion then ______

a. 2b = a + c

b. 2b = ac

c. b² = ac

d All of these', NULL, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-8850b2-1-2', '8850b2', 2, '1', '3. The value of $$\sqrt{6 + \sqrt{6 + \sqrt{6 +}}}$$ ... is

a. 4

b. 3

c. - 2

d 3.5', NULL, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-8850b2-1-3', '8850b2', 3, '1', '4. In triangles ABC and DEF, ∠B = ∠E, ∠F = ∠C and AB = 3DE, then the two triangles are', NULL, 'Similarity', 'MCQ', 1, NULL, array['congruent but not similar', 'similar but not congruent', 'neither congruent nor similar', 'congruent as well as similar']::text[]),
  ('MQ-8850b2-1-4', '8850b2', 4, '1', '5. A(-1,2) and (1,2) join is divided by y axis, then the ratio...

a. 1:2

b. 1:1

c. 2:1

d none of these', NULL, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-8850b2-1-5', '8850b2', 5, '1', '6. P (-3, 4) reflected in y-axis then p'''' =', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(3,4)', '(3,-4)', '(-3,-4)', '(4,3)']::text[]),
  ('MQ-8850b2-1-6', '8850b2', 6, '1', '7. Centroid of triangle whose vertices are (10,5), (-5,-10) and (6,6)', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2,3)', '(-2,-2)', '(-3,-3)', '(4,5)']::text[]),
  ('MQ-8850b2-1-7', '8850b2', 7, '1', '8. f -1 < 3 + 4x < 23; x ∈ R then x lies between ...', NULL, 'Linear Inequations', 'MCQ', 2, NULL, array['-1 < x < 4', '-1 < x < 5', '1 > x > 4', 'none of these options']::text[]),
  ('MQ-8850b2-1-8', '8850b2', 8, '1', '9. Two triangles are said to be similar if', NULL, 'Similarity', 'MCQ', 2, NULL, array['their angle is same', 'their corresponding angle are same', 'their sides are same', 'none of these']::text[]),
  ('MQ-8850b2-1-9', '8850b2', 9, '1', '10. If k, 2k -1 and 2k + 1 are three consecutive terms of an AP, the value of k is', NULL, 'Arithmetic Progression', 'MCQ', 2, NULL, array['- 2', '3', '- 3', '6']::text[]),
  ('MQ-8850b2-1-10', '8850b2', 10, '1', 'Ashish deposits ₹2500 per month for 15 months in a Cumulative Time Deposit Scheme. If the rate of interest be 5.5% per annum, find the amount received at the time of maturity.
11. What is total principal in the above problem', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 36500', '₹ 37500', '₹ 39500', '₹42000']::text[]),
  ('MQ-8850b2-1-11', '8850b2', 11, '1', 'Ashish deposits ₹2500 per month for 15 months in a Cumulative Time Deposit Scheme. If the rate of interest be 5.5% per annum, find the amount received at the time of maturity.
12. Interest portion for above situation', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['₹1375', '₹ 1525', '₹ 1325', '₹ 1425']::text[]),
  ('MQ-8850b2-1-12', '8850b2', 12, '1', 'Ashish deposits ₹2500 per month for 15 months in a Cumulative Time Deposit Scheme. If the rate of interest be 5.5% per annum, find the amount received at the time of maturity.
13. Amount received by Mr Anish on maturity if Bank extra give ₹ 750 as bonus.', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 38875', '₹ 39625', '₹39526', '₹ 40000']::text[]),
  ('MQ-8850b2-1-13', '8850b2', 13, '1', '14. For the following transaction with Delhi, fill in the blanks to find the amount of bill:
MRP= ₹12000; Discount%=30%; GST=18%', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['IGST', 'SGST', 'CGST', 'Both CGST & IGST']::text[]),
  ('MQ-8850b2-1-14', '8850b2', 14, '1', '15. If p(x) = x² - 2√2 x + 1, the value of p(2√2) = ?', NULL, NULL, 'MCQ', 2, NULL, array['0', '1', '-1', '4√2']::text[]),
  ('MQ-8850b2-2-0', '8850b2', 15, '2', 'a) Without solving the following quadratic equation, find the value of ''m'' for which the given equation has real and equal roots. $$x^2 + 2(m - 1)x + (m + 5) = 0$$. Hence find x. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-8850b2-2-1', '8850b2', 16, '2', 'b) Solve: $$\frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$ [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-8850b2-2-2', '8850b2', 17, '2', 'c) In the given figure, AB and DE are perpendiculars to BC.
If AB = 9 cm, DE = 3 cm, BC = 18cm and AC = 24 cm, calculate AD, DC, EC.[4]', 4, 'Similarity', 'long', 3, '8850b2__Nsm_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-8850b2-3-0', '8850b2', 18, '3', 'a) In the given figure, the line segment AB meets X-axis at A and Y-axis at B. The point P(-3, 4) on AB divides it in the ratio 2 : 3. Find the coordinates of A and B. [4]', 4, 'Coordinate Geometry', 'long', 3, '8850b2__Nsm_X_Math_p3_img_1_jpeg.webp', NULL),
  ('MQ-8850b2-3-1', '8850b2', 19, '3', 'b) If the 19th and 31st terms of an AP are 17 and 23 respectively, find the first term and the common difference. Also find sum of first 10 terms. [4]', 4, 'Arithmetic Progression', 'long', 3, NULL, NULL),
  ('MQ-8850b2-3-2', '8850b2', 20, '3', 'c) Use graph paper to answer this question. [5]

(i) Plot the points A(4, 6) and B(1, 2).

(ii) A'' is the image of A when reflected in X-axis.

(iii) B'' is the image of B when B is reflected in the line AA''.

Give the geometrical name for the figure ABA''B''.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-8850b2-4-0', '8850b2', 21, '4', 'a) c. Solve the following inequation arid graph the solution on the number line.

$$-2 \frac{2}{3} \leq x + \frac{1}{3} < 3 \frac{1}{3}; \quad x \in R. \tag{3}$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-8850b2-4-1', '8850b2', 22, '4', 'b) Mr. Gupta opened a recurring deposit account in a bank. He deposited ₹ 2500 per month for two years. At the time of maturity, he got ₹ 67,500. Find

(i) the total interest earned by Mr. Gupta.

(ii) the rate of interest per annum. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-8850b2-4-2', '8850b2', 23, '4', 'c) If $\begin{bmatrix} 1 & 4 \\ -2 & 3 \end{bmatrix} + 2M = 3 \begin{bmatrix} 2 & 3 \\ -1 & 0 \end{bmatrix}$, find the matrix M. Also find $M^2 + 2M$. [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-8850b2-5-0', '8850b2', 24, '5', 'a) A product is available for ₹ 15930 including 18% GST. Find the mark price of the product. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-8850b2-5-1', '8850b2', 25, '5', 'b) Use the Remainder Theorem to factorise the following expression:

$$2x^3 + x^2 - 13x + 6 \tag{3}$$', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-8850b2-5-2', '8850b2', 26, '5', 'c) If $p = \frac{4xy}{(x + y)}$, prove that $\frac{p + 2x}{p - 2x} + \frac{p + 2y}{p - 2y} = 2$. [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-8850b2-6-0', '8850b2', 27, '6', 'a) A bus covers a distance of 240 km at a uniform speed. Due to heavy rain its speed gets reduced by 10 km/h and as such it takes two hours longer to cover the total distance. Assuming the uniform speed to be ''x'' km/h form an equation and solve it to evaluate ''x''. [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-8850b2-6-1', '8850b2', 28, '6', 'b) Write down the coordinates of the image of the point (3, -2) when:

(i) reflected in the x axis,

(ii) reflected in the y axis,

(iii) reflected in the x axis followed by reflection in the y axis, reflected in the origin. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-8850b2-6-2', '8850b2', 29, '6', 'c) In the given figure, ABC is a triangle with $\square \square$ EDB = $\square$ ACB. Prove that $\square$ ABC $\sim$ $\square$ EBD. If BE = 6 cm, EC = 4 cm, BD = 5 cm, find

(i) length of AB.

(ii) length of AC if DE 12cm.', 4, 'Similarity', 'long', 4, '8850b2__Nsm_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-8850b2-7-0', '8850b2', 30, '7', 'a) Given \( \begin{bmatrix}2&1\\ -3&4\end{bmatrix}X=\begin{bmatrix}7\\ 6\end{bmatrix} \) . Write:

(i) the order of the matrix X
(ii) the matrix X. [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-8850b2-7-1', '8850b2', 31, '7', 'b) Find the value of x, which satisfies the inequation:

\[
- 2 \leq \frac {1}{2} - \frac {2 x}{3} \leq 1 \frac {5}{6}, x \in \mathrm{N}. \tag {[3]}
\]

Graph the solution on the number line.', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-8850b2-7-2', '8850b2', 32, '7', 'c) Calculate the ratio in which the line joining A(6, 5) and B(4, -3) is divided

by the line \( y = 2 \). [2]', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-8850b2-7-3', '8850b2', 33, '7', 'd) A(7,-5) and B(5,-7) AB is diameter of the circle, find the coordinate

of centre of the circle. [2]', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-8850b2-8-0', '8850b2', 34, '8', 'a) RRR Rajamouli opened a Recurring Deposit Account in a bank and deposited ₹ 8000 per month for \( 2^{1}/_{2} \) years. If he received ₹18600 interest at the time of maturity, find the rate of interest per annum and Maturity value. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-8850b2-8-1', '8850b2', 35, '8', 'b) Given that \( x + 2 \) and \( x + 3 \) are factors of \( 2x^{3} + ax^{2} + 7x - b \) . Determine the values of a and b. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-8850b2-8-2', '8850b2', 36, '8', 'c) The marked price of a baby carriage is ₹12500. A shopkeeper gets a discount of 30% on the marked price. He sells it to a customer at the Marked Price. If the sales are intra-state and the rate of GST is 18%, calculate [4]

(i) the price paid by the shopkeeper including tax.
(ii) the price paid by the customer.
(iii) the GST deposited by the shopkeeper with the Central Government.', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-236e62-1-0', '236e62', 0, '1', '1) a) Given $$P = \begin{bmatrix} 1 & -2 \\ -3 & 4 \end{bmatrix}$$ and $$Q = \begin{bmatrix} -7 \\ 11 \end{bmatrix}$$ If $$PX = Q$$, find the matrix X. (3)', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-236e62-1-1', '236e62', 1, '1', 'b) Solve the given inequation and graph the solution on the number line. $$2y - 3 < y+1 \le 4y+7$$ ; $$y \in R$$. (3)', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-236e62-1-2', '236e62', 2, '1', 'A company with 4000 shares of nominal value of Rs 110 each declares an annual dividend of 15%. Calculate: (i) the total amount of dividend paid by the company. (ii) The annual income of Rajeev who holds 88 shares in the company. (iii) If he received only 10% on his investment ,find the price Rajeev paid for each share. (4)', 4, 'Shares and Dividends', 'long', 1, NULL, NULL),
  ('MQ-236e62-2-0', '236e62', 3, '2', '2) a) If $$x = 4$$ is one root of $$(k + 2)x^2 - (5k+2)x - 4 = 0$$, find the value of k. Also, find the other root of the equation. (3)', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-236e62-2-1', '236e62', 4, '2', 'b) \(\frac{\sqrt{3x + 1} + \sqrt{x + 1}}{\sqrt{3x + 1} - \sqrt{x + 1}} = 4\) use properties of proportion and solve for \(x\). (3)', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-236e62-2-2', '236e62', 5, '2', 'c) Find the value of \( k \) if \( (x + 2) \) is a factor of \( 3x^{3} + kx^{2} - 18x + 40 \). Hence, factorise the expression. (4)', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-236e62-3-0', '236e62', 6, '3', '3) a) When 3 coins are tossed simultaneously, what is the probability of getting : (i) 3 tails (ii) exactly 2 tails (iii) atleast 2 tails . (3)', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-236e62-3-1', '236e62', 7, '3', 'b) $$(1 + cotA)^2 + (1 - cotA)^2 = 2 cosec^2A$$ (3)', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-236e62-3-2', '236e62', 8, '3', 'c) In the given figure, AB $$\perp$$ DP and DC $$\perp$$ AP . If AB=3cm,AP=5cm,PD=7.5cm,find (i)CD (ii)area $$\Delta PAB$$ : area $$\Delta PDC$$', NULL, 'Similarity', 'short', 1, '236e62__Orion_X_Ma_p1_img_0_jpeg.webp', NULL),
  ('MQ-236e62-1-3', '236e62', 9, '1', '1.c) Ram opens a RD and deposits ₹800 per month for a period of 2 years. If rate of interest is 9% p.a, find the am''t payable at the end of 2 years.', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-236e62-4-0', '236e62', 10, '4', '4) a) Draw a circle of diameter 9.1cm. Take a point P at a distance of 7.5cm from the centre of the circle. Draw tangents PA and PB to the circle. (3)', 3, 'Constructions', 'short', 2, NULL, NULL),
  ('MQ-236e62-4-1', '236e62', 11, '4', 'b) Construct \(\Delta ABC\), given \(BC = 4cm\), \(\angle B = 75^{\circ}\) and \(AB = 6cm\). Find the point \(P\) such that \(PB = PC\) and \(P\) is equidistant from the sides \(BC\) and \(BA\). (3)', 3, 'Constructions', 'short', 2, NULL, NULL),
  ('MQ-236e62-4-2', '236e62', 12, '4', 'c) A vertical tower is 20m high. A surveyor standing at some distance from the tower knows that the cosine of the angle of elevation of the top of the tower from that point is 0.766. How far is he standing from the foot of the tower? (4)', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-236e62-5-0', '236e62', 13, '5', '5) a) Solve for x and write the solution set for following in equation and represent it on number line.

$$x - 3 \leq \frac{8x}{3} + 2 \leq 2x + \frac{14}{3}, x \in I \tag{3}$$', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-236e62-5-1', '236e62', 14, '5', 'b) Find the value of a, if (x - a) is a factor of $x^3 - a^2x^2 + x + 2$. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-236e62-5-2', '236e62', 15, '5', 'c) A plan of a garden is drawn to a scale of 1:20.

Expressing your answer in cm, calculate the length of the line on the plan which represents a path 13m long.
ii. Calculate the area of pond, in \( m^2 \), which is represented on the plan by an area of \( 125~\mathrm{cm}^2 \). (4)', 4, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-236e62-6-0', '236e62', 16, '6', '6) a) A natural number is $2\frac{2}{3}$ more than its reciprocal. Find the number.', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-236e62-6-1', '236e62', 17, '6', 'b) Evaluate

$$\left[ \begin{array}{cc} \tan 45^{\circ} & \sec 60^{\circ} \\ \operatorname{cosec} 30^{\circ} & \sin 90^{\circ} \end{array} \right] \left[ \begin{array}{cc} 3 & 4 \\ 4 & 3 \end{array} \right] \tag{3}$$', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-236e62-6-2', '236e62', 18, '6', 'c) If two dice are thrown simultaneously, what is the probability of getting on the uppermost faces of the dices?

i. a doublet (same number on both)
ii. a sum of 7
iii. a product of 12
iv. both are odd numbers (4)', 4, 'Probability', 'long', 2, NULL, NULL),
  ('MQ-236e62-7-0', '236e62', 19, '7', '7) a) Find two numbers a and b whose mean proportion is 12 and their third proportional is 96.', NULL, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-236e62-7-1', '236e62', 20, '7', 'b) Mr. R.K. Nair gets Rs 6,455 at the end of one year at the rate of \(14\%\) per annum in a Recurring Deposit Account. Find the monthly installment. (3)', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-236e62-7-2', '236e62', 21, '7', 'c) Find the matrices A and B, if \( 2A + B = \begin{bmatrix} 3 & -4 \\ 2 & 7 \end{bmatrix} \) and \( A - 2B = \begin{bmatrix} 4 & 3 \\ 1 & 1 \end{bmatrix} \). (4)', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-236e62-8-0', '236e62', 22, '8', '8) a) Solve the following equation and give your answer correct to 2 decimal places: $5x^2 - 3x - 4 \neq 0$.', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-236e62-8-1', '236e62', 23, '8', 'b) Prove that: \(\frac{1 + \sec A}{\sec A} = \frac{\sin^2 A}{1 - \cos A}\)', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-236e62-8-2', '236e62', 24, '8', 'c) Draw a regular hexagon of side 5 cm. Also draw its circumscribing circle. (4)', 4, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-236e62-9-0', '236e62', 25, '9', '9) a) Prove that : $$\frac{\cos A}{1-\tan A} + \frac{\sin A}{1-\cot A} = \cos A + \sin A$$ (4)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-236e62-9-1', '236e62', 26, '9', 'b) Construct a triangle ABC in which base BC = 5.5cm, AB = 6cm and $$\angle ABC = 120^\circ$$

i. Construct a circle circumscribing the triangle ABC. (6)
ii. Draw a cyclic quadrilateral ABCD so that D is equidistant from B and C.', 6, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-236e62-10-0', '236e62', 27, '10', '10) a) What should be added to $$2x^3 + 5x^2 - 28x - 18$$ so that $$(x - 3)$$ is a factor of resulting polynomial? (3)', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-236e62-10-1', '236e62', 28, '10', 'b) A man bought some books for Rs 1200. When the price of each rose by Rs 30, he could buy 2 books less for Rs 1200. Find the original price of the book. (3)', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-236e62-10-2', '236e62', 29, '10', 'c) In \(\Delta PQR, PX = \frac{1}{2} XQ\) and \(XY / / QR\). Find: (i) area of \(\Delta PXY\): area of \(\Delta PQR\). (ii) If \(QR = 4.5 \, \text{cm}\), find the length of \(XY\).', NULL, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-236e62-11-0', '236e62', 30, '11', '11) a) There is a coconut tree on the bank of river. From a boat 5m above water, the angle of elevation of the top of the tree is $$45^\circ$$ and the angle of depression of reflection of tree top is $$60^\circ$$. Find the height of the tree. (3)', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-236e62-11-1', '236e62', 31, '11', 'b) What is the probability that one number picked from a set of 2 digit numbers is

i. A multiple of 2 and 7. (3)
ii. One digit is thrice the other.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-236e62-11-2', '236e62', 32, '11', 'John has 1,000 shares of a company with a face value of Rs 40 and paying 8% dividend. He sold some of these shares at a discount of 10 % and invested the proceeds in Rs 20 shares at a premium of 50 % and paying 12 % dividend. If the change in his income is Rs 192, find the number of shares sold by John. (4)', 4, 'Shares and Dividends', 'long', 3, NULL, NULL),
  ('MQ-236e62-11-3', '236e62', 33, '11', '11. c) Suman opens her RD account in a bank of ₹400 per month. How many installments does she have to pay to get a maturity of ₹8560?, if the bank pays an interest of 8% p.a.?', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-db1b34-1-0', 'db1b34', 0, '1', '1) a) Find the value of ''K'', If $$4x^3 - 2x^2 + Kx + 5$$ leaves remainder -10. When divided by $$2x+1$$. (3)', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-db1b34-1-1', 'db1b34', 1, '1', 'b) Solve: \( x^{2} - 5x - 10 = 0 \) giving answer upto 2 decimal places. (3)', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-db1b34-1-2', 'db1b34', 2, '1', 'c) Vivek invests ₹ 4,500 in 8%, ₹ 10 shares at ₹ 15. He sells the shares when the prices rise to ₹ 30, and invests the proceeds in 12% ₹ 100 shares at ₹ 125. Calculate : (4)

(i) the sale proceeds
(ii) the number of \(\text{己} 125\) shares he buys
(iii) The changes in his annual income.', 4, 'Shares and Dividends', 'long', 1, NULL, NULL),
  ('MQ-db1b34-2-0', 'db1b34', 3, '2', '2) a) Point A divides the join of line segments $$M(3, -2)$$ and $$N(10, 19)$$ in the ratio $$3 : 4$$, Find : (3)

(i) The co-ordinates of point A
(ii) The equation of a line passing through A and perpendicular to \(2x \div 3y = 1\)', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-db1b34-2-1', 'db1b34', 4, '2', 'b) Solve the following inequation and represent the solution set on the number line. (3)

$$-3 + x \leq \frac{8x}{3} + 2 < \frac{14}{3} + 2x, where x \in I$$', 3, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-db1b34-2-2', 'db1b34', 5, '2', 'c) If $$A = \begin{bmatrix} x & -3 \\ -4 & 5 \end{bmatrix}, B = \begin{bmatrix} 1 & -3 \\ -4 & y \end{bmatrix}, C = \begin{bmatrix} 7 & -9 \\ -12 & 16 \end{bmatrix}$$ and $$AB = 2C$$, find x and y (4)', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-db1b34-3-0', 'db1b34', 6, '3', '3) a) Find the sum of the geometric progression : $$2 + 6 + 18 + 54 + \dots + 4374$$. (3)', 3, 'Geometric Progression', 'short', 1, NULL, NULL),
  ('MQ-db1b34-3-1', 'db1b34', 7, '3', 'b) AB and CD are two chords of a circle intersecting at a point P outside the circle. If \(\mathrm{PA} = 8\mathrm{cm}\), \(\mathrm{PC} = 5\mathrm{cm}\) and \(\mathrm{PD} = 4\mathrm{cm}\), determine AB. (3)', 3, 'Circles', 'short', 1, NULL, NULL),
  ('MQ-db1b34-3-2', 'db1b34', 8, '3', 'c) Draw a regular hexagon of side \(5\mathrm{cm}\)', NULL, 'Constructions', 'short', 1, NULL, NULL),
  ('MQ-db1b34-4-0', 'db1b34', 9, '4', '4) a) Rohit deposits a certain sum of money, every month in a recurring deposit account for 2 years. If he received ₹ 37,875 at the time of maturity and the rate of interest is 5%, find the monthly deposit. (3)', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-db1b34-4-1', 'db1b34', 10, '4', 'b) Two coins are tossed once. Find the Probability of getting : (i) Two heads. (ii) Atleast one tail (iii) atmost one head . (3)', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-db1b34-4-2', 'db1b34', 11, '4', 'c) Find the mean of the following distribution by step deviation method. Also state the modal class. (4)

| Class interval | 100 – 110 | 110 – 120 | 120 – 130 | 130 – 140 | 140 – 150 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 15 | 18 | 32 | 25 | 10 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-db1b34-5-0', 'db1b34', 12, '5', '5) a) Find the $$\pi^{th}$$ term of the AP: 4,7,10,13... (3)', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-db1b34-5-1', 'db1b34', 13, '5', 'b) A hollow sphere of internal and external diameters 4cm and 8 cm respectively, is melted into a cone of base diameter 8cm. Find the height of the cone. (3)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-db1b34-5-2', 'db1b34', 14, '5', 'c) Simplify : $$\left[ \begin{array}{cc} -2 \sin 30^{\circ} & \text{cosec } 30^{\circ} \\ \tan 45^{\circ} & \cos 0^{\circ} \end{array} \right] * \left[ \begin{array}{cc} \cot 45^{\circ} & \sin 90^{\circ} \\ 2 \sec 0^{\circ} & \sec 60^{\circ} \end{array} \right] * \left[ \begin{array}{c} \text{cosec } 90^{\circ} \\ 2 \cos 60^{\circ} \end{array} \right]$$ (4)', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-db1b34-6-0', 'db1b34', 15, '6', '6) a) Using the properties of proportion, solve the expression. (4)

$$\frac{1 + x + x^2}{1 - x + x^2} = \frac{62(1 + x)}{63(1 - x)}$$', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-db1b34-6-1', 'db1b34', 16, '6', 'b) The marks of 200 students in a test were recorded as follows: (6)

| Marks % | 10 – 19 | 20 – 29 | 30 – 39 | 40 – 49 | 50 – 59 | 60 – 69 | 70 – 79 | 80 – 89 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 7 | 11 | 20 | 46 | 57 | 37 | 15 | 7 |

Draw the ogive and use it to find:
(i) Median

(ii) No. of students who scored more than 35% marks.

(iii) Interquartile range', 6, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-db1b34-7-0', 'db1b34', 17, '7', '7) a) A ball is drawn at random from a box containing 12 white, 16 red and 20 green balls. Determine the probability that the ball drawn is: (i) White (ii) Black (iii) Not green. (3)', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-db1b34-7-1', 'db1b34', 18, '7', 'b) ₹ 480 is divided equally among x number of children. If the number of children were 20 more, then each would have got ₹ 12 less. Find x. (3)', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-db1b34-7-2', 'db1b34', 19, '7', 'c) Using a graph paper, plot the points A(6,4) and B(0,4) . (i) Reflect A and B in the origin to get the images A'' and B''. (ii) Write the coordinate of A'' and B''. (iii) State the Geometrical name for the figure ABA''B''. (iv) Find its perimeter. (4)', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-db1b34-8-0', 'db1b34', 20, '8', '8) a) If x, y, z are in continued proportion,

Prove that : $$\frac{(x+y)^2}{(y+z)^2} = \frac{x}{z}$$ (3)', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-db1b34-8-1', 'db1b34', 21, '8', 'b) If \(-5\) is the root of the quadratic equation \(2x^{2} + mx = 15\), find the value of \(m\), also, find the value of \(k\) if \(m(x^{2} + x) + k = 0\) has equal roots. (3)', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-db1b34-8-2', 'db1b34', 22, '8', 'c) An aeroplane at an altitude of \(250\mathrm{m}\) observes the angle of depression of 2 boats on the opposite banks of a river to be \(45^{\circ}\) and \(60^{\circ}\) respectively. Find the width of the river. Write the answer correct to the nearest whole number. (4)', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-db1b34-9-0', 'db1b34', 23, '9', '9) a) Prove that: \(\frac{\sin A}{1 + \cos A} = \operatorname{cosec} A - \cot A\) (3)', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-db1b34-9-1', 'db1b34', 24, '9', 'b) One kilogram of butter costs \(\text{元}\) 476 which includes \(12\%\) GST. Find the amount of GST paid. (3)', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-db1b34-9-2', 'db1b34', 25, '9', 'c) On a graph paper, taking scale \(1\mathrm{cm} = 1\) unit, plot the points \(A(2,1), B(3,7)\) and \(C(7,3)\). (i) Construct the locus of points equidistance from B and C. (ii) Construct the locus of points at a distance of \(5\mathrm{cm}\) from A. (iii) Locate the point P such that \(\mathrm{PB} = \mathrm{PC}\) and \(\mathrm{PA} = 5\mathrm{cm}\) write the co-ordinates of P.', NULL, 'Loci', 'short', 3, NULL, NULL),
  ('MQ-db1b34-10-0', 'db1b34', 26, '10', '10) a) A model of a ship is made to a scale of \( 1:200 \) (i) The length of the model is \( 4\mathrm{cm} \). calculate the length of the ship. (ii) The volume of the model is 200 litres, calculate the volume of the ship in \( m^3 \). (3)', 3, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-db1b34-10-1', 'db1b34', 27, '10', 'b) The sixth term of a GP is 8 times the third term and the fifth term is 48. Find the GP. (3)', 3, 'Geometric Progression', 'short', 3, NULL, NULL),
  ('MQ-db1b34-10-2', 'db1b34', 28, '10', 'c) The slope of a line joining \(\mathrm{P}(6, \mathrm{k})\) and \(\mathrm{Q}(1 - 3\mathrm{k}, 3)\) is \(1/2\). Find \(\mathrm{k}\), also find midpoint of PQ. (4)', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-db1b34-11-0', 'db1b34', 29, '11', '11) a) Ruchi deposits ₹ 200 every month in a recurring deposit scheme at 8 % p.a. if she gets ₹ 1648 as the maturity value amount, find the period (in years) for which the account is held. (3)', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-db1b34-11-1', 'db1b34', 30, '11', 'b) The cost of sewing machine for a wholesaler is rupees 5000. He sells it to a retailer for ₹ 6000 and the retailer sells it to a consumer for ₹ 7200. If the rate of GST is 12%, find (i) The amount of GST deposited with the government by the retailer. (ii) Price paid by the consumer. (3)', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-db1b34-11-2', 'db1b34', 31, '11', 'c) In the given fig, PAB is a section and PT is a tangent to the circle with centre O. if ∠ATP = 40°, PA = 9 cm and AB = 7 cm. find : (i) ∠APT (ii) length of PT.', 4, 'Circles', 'long', 3, 'db1b34__Orion_X_Ma_p3_img_0_jpeg.webp', NULL),
  ('MQ-c60a9d-1-0', 'c60a9d', 0, '1', 'a. Amit deposited ₹150 per month in a bank for 8 months under the recurring deposit scheme. What will be the maturity value of his deposits if the rate of interest is 8% per annum and interest is calculated at the end of every month? [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-c60a9d-1-1', 'c60a9d', 1, '1', 'b. If both $ax^3 + 2x^2 - 3$ and $x^2 - ax + 4$ leave the same remainder when divided by $(x - 2)$, find $a$. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-c60a9d-1-2', 'c60a9d', 2, '1', 'c. Given: [4]

$$\left[ \begin{array}{cc} 2 & 1 \\ -3 & 4 \end{array} \right] X = \left[ \begin{array}{c} 7 \\ 6 \end{array} \right]$$

Determine :

i. the order of matrix X

ii. the matrix X', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-c60a9d-2-0', 'c60a9d', 3, '2', 'a. Solve the following inequation to find the solution set. [3]

$$-3 + x \leq \frac{8x}{3} + 2 \leq \frac{14}{3} + 2x, \ x \in \mathrm{I}.$$', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-c60a9d-2-1', 'c60a9d', 4, '2', 'b. Prove that $$\sqrt{\frac{\sec A - 1}{\sec A + 1}} = \frac{1 - \cos A}{\sin A}$$ [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-c60a9d-2-2', 'c60a9d', 5, '2', 'c. In an A.P., the first term is 2 and the last term is 29. If the sum of the terms of the A.P. is 155, then find the number of terms and the common difference. [4]', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-c60a9d-3-0', 'c60a9d', 6, '3', 'a. If one root of the quadratic equation $$2x^2 + kx - 6 = 0$$ is 2, find the value of $$k$$. Also, find the other roots. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-c60a9d-3-1', 'c60a9d', 7, '3', 'b. In the given figure, ABCD is a cyclic quadrilateral whose side AB is the diameter of the circle with centre O. If $$\angle ADC = 130^\circ$$, find $$\angle BAC$$. [3]', 3, 'Circles', 'short', 2, 'c60a9d__Pis_X_Math_p2_img_0_jpeg.webp', NULL),
  ('MQ-c60a9d-3-2', 'c60a9d', 8, '3', 'c. 17 cards numbered 1, 2, 3, ..., 17 are put in a box and thoroughly mixed. One person draws a card from the box. Find the probability that the number on the card is : [4]

i. an odd number

ii. a prime number

iii. divisible by 3

iv. divisible by both 2 and 3', 4, 'Probability', 'long', 2, NULL, NULL),
  ('MQ-c60a9d-4-0', 'c60a9d', 9, '4', 'a. Draw a histogram for the given data and find the mode. [3]

| Class | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 7 | 18 | 10 | 8 | 5 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-c60a9d-4-1', 'c60a9d', 10, '4', 'b. A girl fills a cylindrical bucket 32 cm in height and 18 cm in radius with sand. She empties the bucket on the ground and makes a conical heap of the sand. If the height of the conical heap is 24 cm, find its radius [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-c60a9d-4-2', 'c60a9d', 11, '4', 'c. In the triangle ABC, A = (2, -3), B = (6, 7) and C = (-8, 5). Find the equation of the median through A. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-c60a9d-5-0', 'c60a9d', 12, '5', 'a. If \(a, b, c\) are in continued proportion, [3]

\[
\text { prove that } (a + b + c) (a - b + c) = a ^ {2} + b ^ {2} + c ^ {2}
\]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-5-1', 'c60a9d', 13, '5', 'b. In the given figure, \(\angle ABC = \angle BDC\). [3]

(i) Prove that \( \Delta ABC \sim \Delta ADB \) .
(ii) If AC = 9 cm and CD = 7 cm, find the length of AB.
(iii) Find area \( \Delta ABC \) : area \( \Delta ADB \)', 3, 'Similarity', 'short', 3, 'c60a9d__Pis_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-c60a9d-5-2', 'c60a9d', 14, '5', 'c. Solve the equation, \((x - 1)^2 - 3x + 4 = 0\) and give your answer correct to three significant figures. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-c60a9d-6-0', 'c60a9d', 15, '6', 'a. Solve the following linear inequation and represent the solution set on a number line: [3]

\[
2 x - 3 < x + 1 \leq 4 x + 7, x \in \mathrm{R}
\]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-6-1', 'c60a9d', 16, '6', 'b. If \( \mathrm{P}(1, -2) \) is a point on the line segment A (3, -6) and B (x, y) such that AP : PB is equal to 2 : 3, find the coordinates of B.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-6-2', 'c60a9d', 17, '6', 'c. A tent is in the shape of right circular cylinder up to a height of 3 m and then becomes a right circular cone and a maximum height of 13.5 m above the ground.

The slant height of the cone is 17.5 m. Calculate the cost of painting the inner side of the tent at the rate of ₹ 2 per square metre, if the radius of the base is 14 m.', NULL, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-7-0', 'c60a9d', 18, '7', 'a. If \(\mathrm{A} = \begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}\) and \(\mathrm{I} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}\) find \(\mathrm{A}^2 - 5\mathrm{A} + 7\mathrm{I}\) [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-7-1', 'c60a9d', 19, '7', 'b. Find the mean of the following distribution [3]

| Class | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | 11 | 10 | 9 | 13 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-c60a9d-7-2', 'c60a9d', 20, '7', 'c. Use graph paper for this question [4]

i. Plot the point A (3, 5) and B (-2, -4). Use 1 cm = 1 unit on both the axes.
ii. A'' is the image of A when reflected in the x-axis. Write the coordinates of A'' and plot it on the graph paper.

IC/X/2021

Preliminary Examination

page 3 of 5
PODAR
INNOVATION CENTRE
RECEIVING LEARNING

iii. B'' is the image of B when reflected in the y-axis, followed by reflection in the origin. Write the coordinates of B'' and plot it on the graph paper.

iv. Write the geometrical name of AA''BB''.

v. Name two invariant points under reflection in the X-axis.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-c60a9d-8-0', 'c60a9d', 21, '8', 'a. If \( \tan\theta + \sin\theta = m \) and \( \tan\theta - \sin\theta = n \) ; then prove that \( m^{2} - n^{2} = 4\sqrt{mn} \) [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-c60a9d-8-1', 'c60a9d', 22, '8', 'b. Use factor theorem and factorise the following polynomial: [3]

\[
x ^ {3} + 1 0 x ^ {2} - 3 7 x + 2 6
\]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-c60a9d-8-2', 'c60a9d', 23, '8', 'c. The printed price of an air conditioner is ₹ 45000. The wholesaler allows a discount of 10% to the dealer. The dealer sells it to a consumer at a discount of 5% on the marked price. If the sales are intra-state and the rate of GST is 12%, then find [4]

i. The tax paid by the dealer to the Central Government.
ii. The tax paid by the dealer to the State Government.
iii. The amount of tax (under GST) received by the State Government (under GST).
iv. How much does the consumer pay for the air conditioner?', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-c60a9d-9-0', 'c60a9d', 24, '9', 'a. The marks obtained by 100 students in mathematics test are given below. Draw an ogive for the distribution on a graph sheet. (Use a scale of \(2\mathrm{cm} = 10\) units on both axes). [6]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Use the ogive to find:

i. median
ii. the lower quartiles
iii. number of students who obtained more than 85% marks in the test.
iv. number of students who did not pass in the if the pass percentage was 35.', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-c60a9d-9-1', 'c60a9d', 25, '9', 'b. The sum of two numbers is 15 and the sum of their reciprocals is \(\frac{3}{10}\). Find the numbers. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-c60a9d-10-0', 'c60a9d', 26, '10', 'a. Using componendo and dividend, find the value of \( x \): [3]

\[
\frac {\sqrt {3 x + 4} + \sqrt {3 x - 5}}{\sqrt {3 x + 4} - \sqrt {3 x - 5}} = 9
\]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-c60a9d-10-1', 'c60a9d', 27, '10', 'b. In the given figure, ABCD is a parallelogram. E is a point on AB; CE intersects the diagonal BD at G and EF || BC. If AE : EB = 1 : 2, find:

i. EF : AD

ii. Area of \( \Delta \) BEF : area of \( \Delta \) ABD
iii. Area of \( \Delta \) EFG : area of \( \Delta \) CBG', 3, 'Similarity', 'short', 5, 'c60a9d__Pis_X_Math_p5_img_0_jpeg.webp', NULL),
  ('MQ-c60a9d-10-2', 'c60a9d', 28, '10', 'c. A, B and C are three points on a circle. The tangent at C meets BA produced at T. Given that \( \angle ATC = 36^{\circ} \) and \( \angle ACT = 48^{\circ} \) , calculate the angle subtended by AB at the centre of the circle.', 4, 'Circles', 'long', 5, 'c60a9d__Pis_X_Math_p5_img_1_jpeg.webp', NULL),
  ('MQ-c60a9d-11-0', 'c60a9d', 29, '11', 'a. In the figure given alongside, ABCD is a cyclic quadrilateral in which \( \angle BAD = 75^{\circ} \) , \( \angle ABD = 58^{\circ} \) and \( \angle ADC = 77^{\circ} \) . Find:

i. \( \angle BDC \)

ii. \( \angle BCD \)

iii. \( \angle BCA \)', 3, 'Circles', 'short', 5, 'c60a9d__Pis_X_Math_p5_img_2_jpeg.webp', NULL),
  ('MQ-c60a9d-11-1', 'c60a9d', 30, '11', 'b. Two vertices of a triangle are \( (-1, 4) \) and \( (5, 2) \) . If the centroid is \( (0, -3) \) , find the third vertex.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-c60a9d-11-2', 'c60a9d', 31, '11', 'c. A pole 6 m high is fixed on the top of a tower. The angle of elevation of the top of the pole is observed from a point P on the ground is \( 60^{\circ} \) and the angle of depression of the point P from the top of the tower is \( 45^{\circ} \) . Find the height of the tower.

(Take \(\sqrt{3} = 1.73\))', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-3cb594-1-0', '3cb594', 0, '1', 'a) If Rs.7599 is the maturity value on a monthly deposit of Rs 400 for a year and a half, find the rate of interest per annum. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-3cb594-1-1', '3cb594', 1, '1', 'b) If cards are numbered from 10 to 39, find the probability of drawing i. a prime number card ii. a perfect square card. iii. a card which is a multiple of 3 and 4. [3]', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-3cb594-1-2', '3cb594', 2, '1', 'c) \( \mathrm{A} = \left[ \begin{array}{ll} -2 & 0 \\ 4 & 5 \end{array} \right] \mathrm{B} = \left[ \begin{array}{ll} 0 & 4 \\ -3 & 2 \end{array} \right] \) find AB - B + 5 I (I = identity matrix) [4]', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-3cb594-2-0', '3cb594', 3, '2', 'a) A solid cone of radius \(5\mathrm{cm}\) and height \(12\mathrm{cm}\) is melted and recast into hemispheres of radius \(1\mathrm{cm}\), find number of hemispheres recast and the increase in surface area, on recasting. (in terms of \(\pi\)) [3]', 3, 'Mensuration', 'short', 1, NULL, NULL),
  ('MQ-3cb594-2-1', '3cb594', 4, '2', 'b) Find the number of 2 digit multiples of 4, and the sum of them. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-3cb594-2-2', '3cb594', 5, '2', 'c) Solve and represent on a number line \( -2\frac{1}{2} + 2x \leq \frac{4x}{5} \leq \frac{4}{3} + 2x \quad x \in W \) [4]', 4, 'Linear Inequations', 'long', 1, NULL, NULL),
  ('MQ-3cb594-3-0', '3cb594', 6, '3', 'a) Factorise completely. $$x^3 + 4x^2 + x - 4$$, only after finding out what has to be subtracted from it, to make $$(x + 2)$$ a factor of the given expression. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-3cb594-3-1', '3cb594', 7, '3', 'b) Find the co ordinates of the vertex C of parallelogram ABCD given A (-1,0), B (1,3) D (3,5), also find the co ordinates of the point of intersection of its diagonals. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-3cb594-3-2', '3cb594', 8, '3', 'c) Use a graph paper. Plot A (-4, 2) B (-6, 0), reflect A in the x-axis, the y-axis and the origin to form A'', A'''', A'''''' resp. Reflect B in the y-axis to form B''. Join all the points to obtain a geometric figure. Name the figure, and write the equation of the line that divides it into equal halves. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-3cb594-4-0', '3cb594', 9, '4', 'a) Find capacity of a hemispherical bowl having internal radius 30 cm. If the bowl has a uniform thickness of 3cm. find its external curved surface. [3] (π = 3.1)', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-3cb594-4-1', '3cb594', 10, '4', 'b). Find the mean, median, and mode from the following 10, 15, 14, 13, 18, 11, 9, 8, 14, 6. [3]', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-3cb594-4-2', '3cb594', 11, '4', 'c) Plot the Histogram for the given data. Estimate the mode. [4]

| Scores | 81 - 90 | 91 - 100 | 101 - 110 | 111 - 120 | 121 - 130 | 131 - 140 |
| --- | --- | --- | --- | --- | --- | --- |
| Students | 6 | 9 | 16 | 13 | 4 | 2 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-3cb594-5-0', '3cb594', 12, '5', 'a) Given A (-5, -2) B (6, 8) find the equation of line AB. Find i. ratio in which point P on the y-axis divides line AB. ii. Co ordinates of P. iii) the slope of a line passing through P, perpendicular to AB [5]', 5, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-3cb594-5-1', '3cb594', 13, '5', 'b) Construct a triangle ABC, BC = 4cm. ∠B = 120° AC = 7 cm. Find by construction locus of a point P equidistant from points A and B, also equidistant from points B and C of segment AB and BC resp. Construct a cyclic quadrilateral using A, B, C and a point D that is equidistant from seg. AB and BC. [5]', 5, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-3cb594-6-0', '3cb594', 14, '6', 'a). Plot an ogive for the given distribution, estimate the median, the quartiles, the number of students that obtained more than 75% marks, the number of students that failed if the pass mark is 40. [6]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pupils | 5 | 9 | 16 | 22 | 26 | 18 | 11 | 6 | 4 | 3 |', 6, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-3cb594-6-1', '3cb594', 15, '6', 'b) Construct a circle of radius 5 cm. circumscribing a regular hexagon. [4]', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-3cb594-7-0', '3cb594', 16, '7', 'a) Prove: $$\sqrt{\frac{1 - \cos A}{1 + \cos A}} = \frac{\sin A}{1 + \cos A}$$ [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-3cb594-7-1', '3cb594', 17, '7', 'b) Solve: $$3x^2 - x - 7 = 0$$ (upto 3 s.f.) [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-3cb594-7-2', '3cb594', 18, '7', 'c) From a cliff 60 m high, angles of depression to 2 sail boats in a straight line were observed as 45° and 60°, find the distance between the boats, and distance from the base of the cliff to the boat nearer to it. [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-3cb594-8-0', '3cb594', 19, '8', 'a) Goods worth Rs 50,000 were transferred from Delhi to Calcutta at the rate of 18 % GST, and then from Calcutta to Nainital with a profit of Rs 20,000, at the same rate of GST. Find the output tax at i. Delhi ii. Calcutta iii. Nainital [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-3cb594-8-1', '3cb594', 20, '8', 'b) Find the mean using step deviation [3]

| Scores | 20 -30 | 30- 40 | 40 -50 | 50-60 | 60-70 | 70-80 | 80-90 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Students | 7 | 11 | 22 | 10 | 8 | 7 | 5 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-3cb594-8-2', '3cb594', 21, '8', 'c). A PVR auditorium has its seats arranged in rows, such that the number of rows equal the number of seats in each row. In order to create a premium Red Lounge the number of rows were reduced to half, and the number of seats in each row increased by 2. The seating capacity thus reduced by 60 seats. Find the original number of seats. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-3cb594-9-0', '3cb594', 22, '9', 'a) Given AF is tangent to the circle at B, O is centre $$\angle FBC = 55^\circ \angle A = 30^\circ$$ find $$\angle BCD$$, $$\angle BED$$ and $$\angle BDC$$ [3]', 3, 'Circles', 'short', 3, '3cb594__Podar_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-3cb594-9-1', '3cb594', 23, '9', 'b) The first term of an AP is 20, and the sum of its first seven terms is 2100, find the 31st term of this AP. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-3cb594-9-2', '3cb594', 24, '9', 'c) The marked price of an article is Rs 8000, a wholesaler sells this article to a dealer at a 20% discount. The dealer sells the same to a customer at a discount of 10% on MP, if GST is 18% at every stage, find i. the amount of tax (under GST) paid by the dealer to the Government ii. The price the customer pays including GST. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-3cb594-10-0', '3cb594', 25, '10', 'a) If the first 2 terms of a GP is 625 and 125, resp., find the 5th and 6th term of the GP, and the sum of 6 terms [3]', 3, 'Geometric Progression', 'short', 4, NULL, NULL),
  ('MQ-3cb594-10-1', '3cb594', 26, '10', 'b) A model of an Indian Navy sailing vessel is constructed to a scale of 1:50, if the length of the model is 200 cm. find the length of vessel in meters, also find the volume of the actual vessel in m³ if the model has a volume of 400 litres. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-3cb594-10-2', '3cb594', 27, '10', 'c) A sum of Rs. 8100 was invested in Rs. 100 shares available at 10% discount, paying 15% dividend. All the shares were sold at 10% premium after obtaining dividend, and the proceeds with annual income was invested in Rs 10 shares at par. Find the number of Rs. 10 shares bought. [4]', 4, 'Shares and Dividends', 'long', 4, NULL, NULL),
  ('MQ-3cb594-11-0', '3cb594', 28, '11', 'a) use properties of proportion to solve: $$\frac{\sqrt{x+5} + \sqrt{x-16}}{\sqrt{x+5} - \sqrt{x-16}} = \frac{7}{3}$$ [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-3cb594-11-1', '3cb594', 29, '11', 'b) Which is a better investment, Rs 100 shares at 20% premium, paying 15% dividend, or Rs.500 shares at 10% discount paying 10% dividend. [3]', 3, 'Shares and Dividends', 'short', 4, NULL, NULL),
  ('MQ-3cb594-11-2', '3cb594', 30, '11', 'c) Given ABCD is a parallelogram GE // to AD, EC : DE = 5 : 3 Find i. GE : AD ii. CF : AF iii. area ΔEFC : ΔBFC [4]', 4, 'Similarity', 'long', 4, '3cb594__Podar_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-b4312b-1-0', 'b4312b', 0, '1', '(a) Solve the quadratic equation $$4x^{2} - 7x + 2 = 0$$ and give the answer correct to two significant figures. [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-b4312b-1-1', 'b4312b', 1, '1', '(b) Find the numerical value of $$x$$ and $$y$$ if $$\begin{bmatrix} 2 & 3 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 7 \\ -2 \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-b4312b-1-2', 'b4312b', 2, '1', '(c) If the mean of the following frequency distribution is 62.80 and the sum of all the frequencies is 50, then find the values of $$p$$ and $$q$$. [4]

| Classes | 0 - 20 | 20 - 40 | 40 - 60 | 60 – 80 | 80 -100 | 100 – 120 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | p | 10 | q | 7 | 8 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-b4312b-2-0', 'b4312b', 3, '2', '(a) In $$\Delta ABC$$, if A(3, 5), B(7, 8) and C(1, -10), then find the equation of the median through A. [3]', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-b4312b-2-1', 'b4312b', 4, '2', '(b) Find the value of $$k$$, if $$(x - 2)$$ is a factor of $$x^{3} + 2x^{2} - kx + 10$$. Hence determine whether $$(x + 5)$$ is also a factor? [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-b4312b-2-2', 'b4312b', 5, '2', '(c) Find the amount of bill for the following intra-state transaction of goods. The rate of GST is 12%. [4]

| MRP | ₹ 250 | ₹ 200 | ₹ 150 | ₹ 300 |
| --- | --- | --- | --- | --- |
| Discount | 30% | 40% | 32% | 20% |', 4, 'GST and Banking', 'long', 1, NULL, NULL),
  ('MQ-b4312b-3-0', 'b4312b', 6, '3', '(a) ABCD is a trapezium with AB ∥ CD, AB = 9 cm, AC = 12 cm and CD = 16 cm.

(i) Prove that ΔABC ∼ ΔCAD.

(ii) If AD = 12 cm, then find the length of BC. [3]', 3, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-b4312b-3-1', 'b4312b', 7, '3', '(b) The maturity value of a recurring deposit account is ₹ 11364 in 4 years. If the monthly deposit is ₹200, then calculate the rate of interest. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-b4312b-3-2', 'b4312b', 8, '3', '(c) If $$\frac{7m+2n}{7m-2n} = \frac{5}{3}$$, use the properties of proportion to find the value of:

(i) m : n (ii) $$\frac{m^2}{n^2}$$ [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-b4312b-4-0', 'b4312b', 9, '4', '(a) Using a graph paper, plot the points A(6, 4) and B(0, 4).

(i) Reflect A and B in the origin to get the images A'' and B''.

(ii) Write the coordinates of A'' and B''.

(iii) State the geometrical name of the figure ABA''B''. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-b4312b-4-1', 'b4312b', 10, '4', '(b) A game of numbers has cards marked with 11, 12, 13, ..., 40. A card is drawn at random. Find the probability that the number on the card drawn is:

(i) a perfect square.

(ii) divisible by 7.

(iii) an even number. [3]', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-b4312b-4-2', 'b4312b', 11, '4', '(c) Write the equation of the line whose gradient is $$\frac{3}{2}$$ and which passes through P, where P divides the line segment joining A(-2, 6) and B(3, -4) in the ratio 2 : 3. [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-b4312b-5-0', 'b4312b', 12, '5', '(a) How many terms of the A.P. 20, $$19\frac{1}{3}$$, $$18\frac{2}{3}$$, ...must be taken so that their sum is 300? [3]', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-b4312b-5-1', 'b4312b', 13, '5', '(b) The product of digits of a two-digit number is 24. If the unit''s digit exceeds twice its ten''s digit by 2, then find the number. [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-b4312b-5-2', 'b4312b', 14, '5', '(c) ΔABC is a right-angled triangle with ∠ABC = 90°, D is any point on AB and DE is perpendicular to AC. Prove:

(i) Δ ADE ∼ ΔACB

(ii) If AC = 13 cm, BC = 5 cm and AE = 4 cm, find DE and AD.

(iii) Find the area of Δ ADE : area of quadrilateral BCED. [4]', 4, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-b4312b-6-0', 'b4312b', 15, '6', '(a) Given that $x \in \mathbb{R}$, solve the following inequality and graph the solution on the number line:
$-1 \leq 3 + 4x < 23$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-b4312b-6-1', 'b4312b', 16, '6', '(b) If ABCD is a rhombus where A = (3, 8), B = (6, 4) and C = (3, 0), then find the coordinates of D.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-b4312b-6-2', 'b4312b', 17, '6', '(c) If $A = \begin{bmatrix} 0 & -1 \\ 4 & -3 \end{bmatrix}$, $B = \begin{bmatrix} -5 \\ 6 \end{bmatrix}$ and $3A \times M = 2B$; then find the matrix M.', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-b4312b-7-0', 'b4312b', 18, '7', '(a) Using compenendo and dividendo, find the value of $x$ if $\frac{\sqrt{3x-4}+\sqrt{3x-5}}{\sqrt{3x-4}-\sqrt{3x-5}}=9$.', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-b4312b-7-1', 'b4312b', 19, '7', '(b) Find the value of ''a'' if the division of $ax^3 + 9x^2 + 4x - 10$ by $x + 3$ leaves a remainder of 5.', NULL, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-b4312b-7-2', 'b4312b', 20, '7', '(c) The marks obtained by 200 students in an examination are given below:

| Marks | 0 -10 | 10 -20 | 20 -30 | 30 -40 | 40 – 50 | 50 -60 | 60 - 70 | 70 - 80 | 80 -90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 10 | 11 | 20 | 27 | 38 | 40 | 29 | 14 | 6 |

Using the information given in the above table, draw an ogive on a graph paper.

Use your Ogive to estimate:

(i) the median.

(ii) the number of students who obtained more than 90 % of marks in the examination and

(iii) the number of students who did not pass, if the pass percentage was 40.

Use the scale as 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis.', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-b4312b-8-0', 'b4312b', 21, '8', '(a) If the mid – point of the line segment joining $(2a, 4)$ and $(-2, 2b)$ is $(1, 2a + 1)$, then find the numerical values of $a$ and $b$.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-b4312b-8-1', 'b4312b', 22, '8', '(b) Solve the following inequation, and graph the solution on the number line.

$2x - 5 \leq 5x + 4 < 11, x \in \mathbb{R}$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-b4312b-8-2', 'b4312b', 23, '8', '(c) Find 4 numbers in an AP whose sum is $-4$ and the sum of whose squares are 84.', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-b4312b-9-0', 'b4312b', 24, '9', '(a) A shopkeeper sells some edible oil for ₹ 7200 at its marked price. The shopkeeper pays GST of ₹120 to the Government. If the GST charged throughout is 5%, then calculate the price paid by the shopkeeper for the oil inclusive of tax.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-b4312b-9-1', 'b4312b', 25, '9', '(b) Khushwant has a recurring deposit account in a post office for 3 years at 8% p.a. simple interest. If he gets ₹ 1998 as interest at the time of maturity, then find the monthly installment and the amount of maturity.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-b4312b-9-2', 'b4312b', 26, '9', '(c) A box contains 7 blue, 8 white and 5 black marbles. If a marble is drawn at random from the box, then what is the probability it is

(i) a black marble? (ii) either blue or black marble?

(iii) not a black marble? (iv) a green marble?', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-b4312b-10-0', 'b4312b', 27, '10', '(a) If $a$, $b$, $c$ and $d$ are in proportion, then prove that $\frac{a+b}{c+d} = \sqrt{\frac{2a^2+7b^2}{2c^2+7d^2}}$ [3]', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-b4312b-10-1', 'b4312b', 28, '10', '(b) If in $\Delta ABC$, D is the point on AB and E is the point on AC such that DE // BC and $\frac{AD}{DB} = \frac{2}{3}$, then calculate the value of $\frac{\text{area of } \Delta ADE}{\text{area of } \Delta ABC}$ and $\frac{\text{area of trapezium DBCE}}{\text{area of } \Delta ABC}$. [3]', 3, 'Similarity', 'short', 4, NULL, NULL),
  ('MQ-b4312b-10-2', 'b4312b', 29, '10', '(c) An aeroplane left 30 minutes later than its scheduled time, and in order to reach its destination 1500 km away in time, it has to increase its speed by 250 km/hr from its usual speed. Determine its usual speed. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-b4312b-11-0', 'b4312b', 30, '11', '(a) If $A = \begin{bmatrix} 5 & 4 \\ 3 & -1 \end{bmatrix}$; $B = \begin{bmatrix} 2 & 1 \\ 0 & 4 \end{bmatrix}$ and $C = \begin{bmatrix} -3 & 2 \\ 1 & 0 \end{bmatrix}$, then find (i) A + C, (ii) B - A, (iii) A + C - B [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-b4312b-11-1', 'b4312b', 31, '11', '(b) Find the mode of the following distribution. [3]

| Class | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 7 | 9 | 11 | 6 | 2 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-b4312b-11-2', 'b4312b', 32, '11', '(c) If $(x - 2)$ is a factor of $2x^3 - x^2 - px - 2$, then find the value of $p$. With the help of the value of $p$, factorise the given expression completely. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-138d4b-1-0', '138d4b', 0, '1', '(i) When Mr. Desai stayed in a hotel for 2 days, he had to pay ₹ 7080 including 18% GST. What is the tariff of the hotel for a unit of accommodation?', 1, 'GST and Banking', 'MCQ', 1, NULL, array['₹3500', '₹3250', '₹3000', '₹3540']::text[]),
  ('MQ-138d4b-1-1', '138d4b', 1, '1', '(ii) The solution set for the given inequation is :
$$18 \le 4x - 2, x \in I$$', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['{5}', '{1,2,3,4,5}', '{5,6,7,8 ...}', '{-5,-4,-3,-2,-1,0,1,2,3,4,5}']::text[]),
  ('MQ-138d4b-1-2', '138d4b', 2, '1', '(iii) The nature of roots for the equation : $$x^2 - 30x + 225 = 0$$ are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['Rational and unequal', 'Imaginary', 'Real and equal', 'Irrational and unequal']::text[]),
  ('MQ-138d4b-1-3', '138d4b', 3, '1', '(iv) The product of two consecutive natural numbers which are multiples of 3, is equal to 810. Find the two numbers', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['81,10', '27,30', '18,45', '270,3']::text[]),
  ('MQ-138d4b-1-4', '138d4b', 4, '1', '(v)
Write the order of the matrix $$\begin{bmatrix} 6 & 1 \\ 7 & 2 \\ 8 & 3 \end{bmatrix}$$ and classify it', 1, 'Matrices', 'MCQ', 1, NULL, array['Column Matrix 2 x 3', 'Rectangular Matrix 3 x 2', 'Null Matrix 3 x 2', 'Square Matrix 2 x 3']::text[]),
  ('MQ-138d4b-1-5', '138d4b', 5, '1', '(vi) Find the value of x, given that $$A^2 = B$$
$$A = \begin{bmatrix} 2 & 12 \\ 0 & 1 \end{bmatrix} \text{ and } B = \begin{bmatrix} 4 & x \\ 0 & 1 \end{bmatrix}$$
Page 1 of 6
english high school
UNLEASH YOUR POTENTIAL', 1, 'Matrices', 'MCQ', 1, NULL, array['144', '36', '48', '24']::text[]),
  ('MQ-138d4b-1-6', '138d4b', 6, '1', '(vii) The 7th term of an AP whose first term is 5 and common difference is 4 is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['29', '35', '28', '42']::text[]),
  ('MQ-138d4b-1-7', '138d4b', 7, '1', '(viii) If the first term of an AP is -27 and the common difference is 3 which term is 0?', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['8th term', '10th term', '12th term', '1st term']::text[]),
  ('MQ-138d4b-1-8', '138d4b', 8, '1', '(ix) AB is diameter of a circle with centre C (-2,5). If A is (4,-3), the coordinates of point B are', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2,-2)', '(13,8)', '(6,-8)', '(-8,13)']::text[]),
  ('MQ-138d4b-1-9', '138d4b', 9, '1', '(x) Point P(a,b) becomes P''(-a,-b) when reflection is in', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['x axis', 'y axis', 'origin', 'Invariant']::text[]),
  ('MQ-138d4b-1-10', '138d4b', 10, '1', '(xi) In the figure given below, AB || DE, AC = 3 cm, CE = 7.5 cm and BD = 14 cm. Calculate DC.', 1, 'Similarity', 'MCQ', 2, '138d4b__Rbs_X_Math_p2_img_0_jpeg.webp', array['5 cm', '10 cm', '4 cm', '8 cm']::text[]),
  ('MQ-138d4b-1-11', '138d4b', 11, '1', '(xii) The value of x in the given figure is', 1, NULL, 'short', 2, '138d4b__Rbs_X_Math_p2_img_1_jpeg.webp', NULL),
  ('MQ-138d4b-1-12', '138d4b', 12, '1', '(xiii) ''a'' is the mean of 5,10,15,20,20 then the value of a is
Page 2 of 6
Ramniwas Bajaj
english high school
UNLEASH YOUR POTENTIAL', 1, 'Statistics', 'MCQ', 2, NULL, array['20', '25', '14', '16']::text[]),
  ('MQ-138d4b-1-13', '138d4b', 13, '1', '(xiv) A dice is thrown once, the probability of getting a number greater than 2 is', 1, 'Probability', 'MCQ', 3, NULL, array['$$\frac{1}{6}$$', '$$\frac{2}{6}$$', '$$\frac{2}{3}$$', '$$\frac{1}{2}$$']::text[]),
  ('MQ-138d4b-1-14', '138d4b', 14, '1', '(xv) If the radius of a cylinder is 14 cm and height is 10 cm, then its curved surface area is', 1, 'Mensuration', 'MCQ', 3, NULL, array['880 cm²', '6160 cm³', '880 cm³', '6160 cm²']::text[]),
  ('MQ-138d4b-2-0', '138d4b', 15, '2', 'a) Mr. Britto opened a Recurring deposit account in a bank and deposited ₹ 800 per month for 1 ½ years. If he received ₹ 15,084 at the time of maturity, find the rate of interest per annum. 6%', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-138d4b-2-1', '138d4b', 16, '2', 'b) Using properties of proportion find \( x: y \), given: \( \frac{x^2 + 2x}{2x + 4} = \frac{y^2 + 3y}{3y + 9} \) 2:3 [4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-138d4b-2-2', '138d4b', 17, '2', 'c) Prove that: \((1 + \cot \theta - \cosec\theta)(1 + \tan \theta + \sec \theta) = 2\) [4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-138d4b-3-0', '138d4b', 18, '3', 'a) From a solid wooden cylinder of height 28 cm and diameter 6cm, two conical cavities are hollowed out. The diameter of the cones are also of 6cm and height 10.5 cm. Take $$\pi = \frac{22}{7}$$, find the volume of the remaining solid. 254.57 cm³', NULL, 'Mensuration', 'short', 3, '138d4b__Rbs_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-138d4b-3-1', '138d4b', 19, '3', 'b) ABC is a triangle and G(4,3) is the centroid of the triangle. If A(1,3), B=(4,b) [4] and C=(a,1), find a and b. Find the length of side BC. 5', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-138d4b-3-2', '138d4b', 20, '3', 'c) Use graph paper to answer the following questions. [5]

(i) Plot P(3,1) and Q(0,5). Reflect Q in the origin to get Q''
(ii) Reflect P in y-axis to get R
(iii) Reflect P and R in x-axis to get P'' and R''
(iv) Give a name to figure PQRR''Q''P'' Hexagon
(v) Find its perimeter. 48 cm', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-138d4b-4-0', '138d4b', 21, '4', 'a) Ms. Anjali visits the market and buys the following articles:

Medicines costing ₹ 950, SGST @2.5%

A pair of shoes costing ₹ 3000, SGST @ 9%

A Laptop bag costing ₹ 1000 with a discount of 30% , GST @ 18%.

Calculate : (i) the total amount of GST paid.

(ii) The total bill amount including GST paid by Ms. Anjali.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-138d4b-4-1', '138d4b', 22, '4', 'b) Solve and give your answer to correct to 3 significant figures

$$(x - 1)^2 - 3x + 4 = 0$$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-138d4b-4-2', '138d4b', 23, '4', 'c) The daily pocket expenses of some students in a class are given below.

| Pocket expenses (in Rupees) | 0-50 | 50-100 | 100-150 | 150-200 | 200-250 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 8 | 10 | 24 | 18 | 6 |

On a graph paper, draw a histogram for the given distribution and estimate the mode.', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-138d4b-5-0', '138d4b', 24, '5', 'a) If $$A = \begin{bmatrix} 3 & 1 \\ -1 & 2 \end{bmatrix}$$, find the value of $$5A - A^2$$', NULL, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-138d4b-5-1', '138d4b', 25, '5', 'b) In the given figure, AC is the diameter of the circle with centre O. Chords BA and CD are extended meet at point P. If angle P = 35° and angle ACB = 20°, calculate: (i) angle BDC (ii) angle ABD and (iii) angle AOB.', NULL, 'Circles', 'short', 4, '138d4b__Rbs_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-138d4b-5-2', '138d4b', 26, '5', 'c) When the polynomials $$ax^3 + 5x^2 - 11x - 14$$ and $$3x^3 + ax^2 - 4x + 20$$ are divided by $$(x + 2)$$, the remainders are same. Find the value of a.', NULL, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-138d4b-6-0', '138d4b', 27, '6', 'a) Find the equation of a line through P(5,-2) and perpendicular to the line

Page 4 of 6
Ramniwas Bajaj

english high school

UNLEASH YOUR POTENTIAL

2x - 7y = 1. If (k, k + 2) lies on that line, find the value of K.', NULL, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-138d4b-6-1', '138d4b', 28, '6', 'b) Prove that: $$\frac{(\cos A - \sin A)(1 + \tan A)}{2\cos^2 A - 1} = \sec A$$ [3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-138d4b-7-0', '138d4b', 29, '7', 'a) A box contains some green, yellow and white tennis balls. The probability of selecting a green ball is ¼ and yellow ball is 1/3. If the box contains 10 white balls then find: (a) total number of balls in the box (b) probability of selecting a white ball. [3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-138d4b-7-1', '138d4b', 30, '7', 'b) A solid metal cylinder of radius 14 cm and height 21cm is melted down and recast into spheres of radius 3.5 cm. Calculate the number of spheres that can be made. [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-138d4b-7-2', '138d4b', 31, '7', 'c) In the given figure below, AD is a diameter. O is the centre of the circle. AD is parallel to BC and ∠CBD = 32°.

Find :

(i) \(\angle OBD\)
(ii) \(\angle AOB\)
(iii) \(\angle BED\)', NULL, 'Circles', 'short', 5, '138d4b__Rbs_X_Math_p5_img_0_jpeg.webp', NULL),
  ('MQ-138d4b-8-0', '138d4b', 32, '8', 'a) Solve for x and write the solution set for the following inequation and represent it on the number line. [3]

$$3x + \frac{14}{3} > \frac{4x}{3} - 2 \geq 2x - 4, x \in R \quad \{x : -4 < x \leq 3\}$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-138d4b-8-1', '138d4b', 33, '8', 'b) Find the mean of the following distribution by step deviation method: [3]

| Class interval | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 6 | 8 | 12 | 5 | 9 |

49.6', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-138d4b-8-2', '138d4b', 34, '8', 'c) In the given diagram, ABC is a triangle and BCFD is a parallelogram. AD:DB = 4:5 and EF = 15cm.

Find: (a) AE : EC (b) DE and (c) BC

4:5 4cm 9cm', NULL, 'Similarity', 'short', 6, '138d4b__Rbs_X_Math_p6_img_0_jpeg.webp', NULL),
  ('MQ-138d4b-9-0', '138d4b', 35, '9', 'a) Some students planned a picnic. The budget for the food was ₹ 480. As eight of them failed to join the party, the cost of the food for each member increased by ₹10. Find how many students went for the picnic. 24.', NULL, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-138d4b-9-1', '138d4b', 36, '9', 'b) The following table shows a record from a hospital of 84 number of casualties due to accidents of different age groups.

| Age (in years) | 5-15 | 15-25 | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of casualties | 6 | 10 | 15 | 13 | 25 | 8 | 7 |

Taking a scale of 2cm = 10 years on one axis and 2 cm = 10 causalities on the other. Draw an ogive and estimate :

(i) the median. 44 40
(ii) The upper quartile 53, 70

(iii) The number of casualties above age 57 years. 13, 34', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-138d4b-10-0', '138d4b', 37, '10', 'a) Using properties of proportion, solve for x. Given that x is positive:

$$\frac{2x + \sqrt{4x^2 - 1}}{2x - \sqrt{4x^2 - 1}} = 4$$', NULL, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-138d4b-10-1', '138d4b', 38, '10', 'b) Construct a triangle ABC in which base BC = 6cm, AB = 5.5cm, angle ABC = 120°. Construct a circle circumscribing the triangle ABC. Measure and write down the radius of the circle. 6 cm', NULL, 'Constructions', 'short', 6, NULL, NULL),
  ('MQ-138d4b-10-2', '138d4b', 39, '10', 'c) A man observes the angle of elevation of the top of the building to be 30°. He walks towards it in horizontal line through its base. On covering 60m, the angle of elevation changes to 60°. Find the height of the building to the nearest metre. 57 metres.', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-687d45-1-0', '687d45', 0, '1', 'Find the $6^{\text{th}}$ term of the A.P. if the nth term of the sequence is $\frac{n(n+1)}{5}$', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['6', '$\frac{42}{5}$', '7', '$\frac{41}{5}$']::text[]),
  ('MQ-687d45-1-1', '687d45', 1, '1', 'If $\begin{bmatrix} 2 & -2 \\ 3 & 0 \end{bmatrix} + \begin{bmatrix} 5 & 0 \\ -8 & 7 \end{bmatrix} = \begin{bmatrix} 7 & -2 \\ -a & 7 \end{bmatrix}$, find the value of ''a''.', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-687d45-1-2', '687d45', 2, '1', 'Without solving, comment on the nature of roots of the equation

$$\sqrt{3}x^2 - 5x + 7\sqrt{3} = 0.$$

a) real roots

c) real and equal roots

b) imaginary roots

d) imaginary and equal roots', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-687d45-1-3', '687d45', 3, '1', 'Find the $10^{\text{th}}$ term of the A.P. 1, 4, 7, 10...', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['27', '34', '28', '19']::text[]),
  ('MQ-687d45-1-4', '687d45', 4, '1', 'When $x^3 + 3x^2 - kx + 4$ is divided by ( x-2), the remainder is k, find the value of k', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['k= 12', 'k= -12', 'k = - 8', 'k= 8']::text[]),
  ('MQ-687d45-1-5', '687d45', 5, '1', 'If a, b and c are in continued proportion, then ''b'' is called

a) the third proportional

c) the fourth proportional

b) the mean proportional

d) arithmetic mean', 1, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-687d45-1-6', '687d45', 6, '1', 'In figure, $\angle ABC = \angle CAD$, which of the following is true?

a) $\Delta ABC \sim \Delta ADC$

c) $\Delta ABC \sim \Delta DAC$

b) $\Delta ABD \sim \Delta ACD$

d) $\Delta ABD \sim \Delta ADC$', 1, 'Similarity', 'short', 1, '687d45__St_Mary_Mi_p1_img_0_jpeg.webp', NULL),
  ('MQ-687d45-1-7', '687d45', 7, '1', 'viii.

The point of intersection of the three medians of a triangle is called

a) centroid

c) circumcentre

b) orthocentre

d) incentre', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-687d45-1-8', '687d45', 8, '1', 'ix.
Co-ordinates of A and B are (- 3, a) and ( 1, a+4 ). The mid-point of AB is (-1, -1 ). Find the value of a .', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['-3', '5', '-5', '3']::text[]),
  ('MQ-687d45-1-9', '687d45', 9, '1', 'x.
Find the smallest value of x for which 2(x-1) ≥ x-4 , x ∈ W', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['- 2', '0', '-1', '1']::text[]),
  ('MQ-687d45-1-10', '687d45', 10, '1', 'xi.
Slope of a line parallel to Y-axis is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['0', '1', '- 1', 'not defined']::text[]),
  ('MQ-687d45-1-11', '687d45', 11, '1', 'xii.

Find the equation of line whose x-intercept is 6 and y-intercept is - 4.

a) 3y = 2x - 12

c) 3y = 2x -4

b) 3y = 2x + 12

d) 2y = 3x - 8', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-687d45-1-12', '687d45', 12, '1', 'xiii.
Find the value of k for which the equation x² - 2kx + 7k - 12 = 0 has equal roots.', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['(- 4,3)', '(- 3,4)', '(3, 4)', '(-3,- 4)']::text[]),
  ('MQ-687d45-1-13', '687d45', 13, '1', 'xiv.
Calculate the co-ordinates of the centroid of the triangle ABC , if A = (4 , -6 ) , B = ( 3 , -2 ) and C = ( 5 , 2 ) .', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(4,-2)', '( 6,-3)', '(-4,2)', '( -6,2)']::text[]),
  ('MQ-687d45-1-14', '687d45', 14, '1', 'xv. For the following distribution , the median class is
| Class | 20 -25 | 25-30 | 30-35 | 35- 40 | 40-45 |
| --- | --- | --- | --- | --- | --- |
| frequency | 18 | 10 | 12 | 4 | 5 |', 1, 'Statistics', 'MCQ', 2, NULL, array['20-25', '25-30', '30-35', '35-40']::text[]),
  ('MQ-687d45-2-0', '687d45', 15, '2', '✓

Find the equation of the perpendicular bisector of the line joining the points A (- 4, 8 ) and B ( 6 , - 2 ) . What is the ordinate of the point on this line whose abscissa is 8 ?', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-687d45-2-1', '687d45', 16, '2', 'ii.

The sum of the 4th and 8th terms of an A.P. is 24 and the sum of the 6th and 10th terms is 34. Find the first term and the common difference of the A.P.', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-687d45-2-2', '687d45', 17, '2', 'iii.

Find the rate of interest paid by the bank if Amit has a recurring deposit account in the bank and deposits ₹ 400 per month for 3 years to get ₹ 16,176 on maturity.', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-687d45-3-0', '687d45', 18, '3', '✓

A dealer buys an article at a discount of 30% from the wholesaler, the marked price being ₹ 6000. The dealer sells it to the shopkeeper at a discount of 10% on the marked price. If the rate of GST is 12%, find (a) the net GST paid by the dealer (b) the price paid by the shopkeeper including the tax.', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-687d45-3-1', '687d45', 19, '3', 'iv.

Show that ( 2 , 5 ) is a point of trisection of the line-segment joining the points (-2 , 3 ) and ( 4 , 6 ) . Also, find the co-ordinates of the other point of trisection .', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-687d45-3-2', '687d45', 20, '3', 'The distribution given below shows the marks obtained by 70 students in an aptitude test. Draw a histogram and find (i) the modal class (ii) the mode of the distribution.

| Marks | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 12 | 14 | 16 | 10 | 8 | 6 |', 5, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-687d45-4-0', '687d45', 21, '4', 'If $$A = \begin{bmatrix} 2 & -1 \\ 1 & 3 \end{bmatrix}$$, find a matrix B such that $$A^2 - A + 2B = 0$$.', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-687d45-4-1', '687d45', 22, '4', 'Find the equation of the line parallel to the line $$3x+2y=8$$ and passing through the point $$(0, 1)$$.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-687d45-4-2', '687d45', 23, '4', 'Solve $$2x - 3 = \sqrt{2x^2 - 2x + 21}$$', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-687d45-5-0', '687d45', 24, '5', 'Using remainder theorem, find the remainders obtained when

$$x^3 + (kx + 8)x + k$$ is divided by $$x+1$$ and $$x-2$$. Hence find $$k$$, if the sum of the remainders is 1.', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-687d45-5-1', '687d45', 25, '5', 'Point P divides the line segment joining the points A (-1, 3) and B (9, 8) such that AP/BP = k/1. If P lies on the line x-y+2 = 0, find the value of k.', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-687d45-5-2', '687d45', 26, '5', 'Find the arithmetic mean using step deviation method:

| Class Interval | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 6 | 10 | 8 | 12 | 4 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-687d45-6-0', '687d45', 27, '6', 'Which term of the sequence -1, 3, 7, 11, ... Is 95?', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-687d45-6-1', '687d45', 28, '6', 'In the figure, BE = 6 cm, BD = 5 cm and CE = 4 cm. . Find AB.', 3, 'Similarity', 'short', 3, '687d45__St_Mary_Mi_p3_img_0_jpeg.webp', NULL),
  ('MQ-687d45-6-2', '687d45', 29, '6', 'The speed of a boat in still water is 15 km/hr. It can go 30 km upstream and return downstream to the original point in 4 hours 30 minutes. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-687d45-7-0', '687d45', 30, '7', 'i. Solve the quadratic equation $$x^2 - 3(x + 3) = 0$$ and give your answer correct to two significant digits.', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-687d45-7-1', '687d45', 31, '7', 'ii. If $$x = \frac{2ab}{a+b}$$, using properties of proportion, find the value of $$\frac{x+a}{x-a} + \frac{x+b}{x-b}$$.', 3, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-687d45-7-2', '687d45', 32, '7', 'iii. The sum of three numbers in A.P. is 12 and the sum of their cubes is 408. Find the numbers.', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-687d45-8-0', '687d45', 33, '8', 'i. Sum of two natural numbers is 8 and the sum of their reciprocals is $$\frac{8}{15}$$. Find the numbers.', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-687d45-8-1', '687d45', 34, '8', 'ii. Find the value of k, if the lines represented by kx-5y+4=0 and 4x-2y+5=0 are perpendicular to each other.', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-687d45-8-2', '687d45', 35, '8', 'iii. Marks obtained by 160 students in an examination are as follows :

| Marks | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 2 | 24 | 32 | 45 | 30 | 13 | 8 | 6 |

Draw an ogive and from the graph estimate :

the median.
b) the lower quartile.
c) the number of students who obtained more than \(85\%\) marks in the examination.', 5, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-687d45-9-0', '687d45', 36, '9', 'i. In the given figure, $$\Delta$$ PQR is right angled at P and PM is the altitude from P. If QR = 8 cm and MQ = 3.5 cm, calculate the value of PR.', 3, 'Similarity', 'short', 4, '687d45__St_Mary_Mi_p4_img_0_jpeg.webp', NULL),
  ('MQ-687d45-9-1', '687d45', 37, '9', 'ii. Anamika has a R.D. account with Bank of Maharashtra. She deposits ₹ 300 per month at 10% p.a.. If she gets ₹ 7950 at the time of maturity, find the total time for which the account was held.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-687d45-9-2', '687d45', 38, '9', 'iii. Solve the inequation and graph the solution set on the number line :

$$-5\frac{1}{2} - x \leq \frac{1}{2} - 3x \leq 3\frac{1}{2} - x, \ x \in W.$$', 4, 'Linear Inequations', 'long', 4, NULL, NULL),
  ('MQ-09a67e-1-0', '09a67e', 0, '1', '1) The median of the given frequency distribution is found graphically with the help of', 1, 'Statistics', 'MCQ', 1, NULL, array['Histogram', 'Frequency curve', 'Frequency polygon', 'Ogive']::text[]),
  ('MQ-09a67e-1-1', '09a67e', 1, '1', '2) In given figure, if DE is parallel to BC, then ''x'' equals to', 1, 'Similarity', 'MCQ', 1, '09a67e__Svis_S01_X_p1_img_0_jpeg.webp', array['6 cm', '8 cm', '10 cm', '12.5 cm']::text[]),
  ('MQ-09a67e-1-2', '09a67e', 2, '1', '3) If the roots of the given quadratic equation are real and unequal, discriminant will be

a) zero b) positive c) negative d) none of these.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-3', '09a67e', 3, '1', '4) If TP and TQ are two tangents to a circle with centre O so that

$$\angle POQ = 110^{\circ}$$, then $$\angle PTQ$$ is equal to

a) $$60^{\circ}$$ b) $$70^{\circ}$$ c) $$80^{\circ}$$ d) $$90^{\circ}$$', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-4', '09a67e', 4, '1', '5) The probability that a non leap year has 53 Sundays, is

a) $$\frac{2}{7}$$ b) $$\frac{5}{7}$$ c) $$\frac{6}{7}$$ d) $$\frac{1}{7}$$', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-5', '09a67e', 5, '1', '6) If p and q are the roots of the equation $$x^2 - px + q = 0$$, then

a) $$p = 1, q = -2$$ b) $$p = 0, q = 1$$ c) $$p = -2, q = 0$$ d) $$pq \cdot 3x^2 - kx + 2k = 0$$ has equal roots; find K', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-6', '09a67e', 6, '1', '7) The length of the tangent drawn from a point 8 cm away from the centre of a circle of radius 6 cm is

a) $$\sqrt{7}$$ cm b) $$2\sqrt{7}$$ cm c) 10 cm d) 5 cm', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-7', '09a67e', 7, '1', '8) The volume of two spheres are in the ratio 64 : 27. The ratio of their surface areas is

a) 1 : 2 b) 2 : 3 c) 9 : 16 d) 16 : 9', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-8', '09a67e', 8, '1', '9) The maximum volume of a cone that can be carved out of a solid hemisphere of radius ''r'' is

a) $$3\pi r^2$$ b) $$\frac{\pi r^3}{3}$$ c) $$\frac{\pi r^2}{3}$$ d) $$3\pi r^3$$', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-09a67e-1-9', '09a67e', 9, '1', '10) In given figure, APB is a tangent to a circle with centre O at point P. If $$\angle QPB = 50^{\circ}$$, then measure of $$\angle POQ$$ is

a) $$100^{\circ}$$ b) $$120^{\circ}$$ c) $$140^{\circ}$$ d) $$150^{\circ}$$', 1, 'Circles', 'short', 2, '09a67e__Svis_S01_X_p2_img_0_jpeg.webp', NULL),
  ('MQ-09a67e-1-10', '09a67e', 10, '1', '11) If in two triangles ABC and DEF, $$\frac{AB}{DE} = \frac{BC}{FE} = \frac{CA}{FD}$$ then', 1, 'Similarity', 'MCQ', 3, NULL, array['$$\Delta FDE \sim \Delta CAB$$', '$$\Delta FDE \sim \Delta ABC$$', '$$\Delta CBA \sim \Delta FDE$$', '$$\Delta BCA \sim \Delta FDE$$']::text[]),
  ('MQ-09a67e-1-11', '09a67e', 11, '1', '12) Taxes that are levied on any Intra- State purchase are ?', 1, 'GST and Banking', 'MCQ', 3, NULL, array['IGST', 'CGST and SGST', 'SGST', 'CGST']::text[]),
  ('MQ-09a67e-1-12', '09a67e', 12, '1', '13) If replacement set is the set of whole numbers, the solution set of the inequation $$5x + 4 \leq 24$$ is', 1, 'Linear Inequations', 'MCQ', 3, NULL, array['$$\{1,2,3,4\}$$', '$$\{\text{---}, -2, -1, 0, 1, 2, 3, 4\}$$', '$$\{4,5,6\}$$', '$$\{0,1,2,3,4\}$$']::text[]),
  ('MQ-09a67e-1-13', '09a67e', 13, '1', '14) If $$M \times \begin{bmatrix} 2 \\ -p \end{bmatrix} = \begin{bmatrix} 5 \\ 0 \end{bmatrix}$$, find order of matrix M.', 1, 'Matrices', 'MCQ', 3, NULL, array['$$2 \times 1$$', '$$1 \times 2$$', '$$2 \times 2$$', '$$1 \times 1$$']::text[]),
  ('MQ-09a67e-1-14', '09a67e', 14, '1', '15) Find the mode of following frequency distribution
| X | 5 | 15 | 25 | 35 | 45 |
| --- | --- | --- | --- | --- | --- |
| F | 14 | 16 | 20 | 30 | 20 |', 1, 'Statistics', 'MCQ', 3, NULL, array['35', '25', '45', '15']::text[]),
  ('MQ-09a67e-2-0', '09a67e', 15, '2', 'Q2: a) In the adjoining figure, $$\angle ACE = 43^{\circ}$$, $$\angle CAF = 62^{\circ}$$. Find the values of a, b and c. [4]', 4, 'Circles', 'long', 3, '09a67e__Svis_S01_X_p3_img_0_jpeg.webp', NULL),
  ('MQ-09a67e-2-1', '09a67e', 16, '2', 'b) Use step-deviation method to find the mean of the following frequency distribution.

[4]

| Wages (in Rs) | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-09a67e-2-2', '09a67e', 17, '2', 'c) Using factor theorem, factorise $$x^3 + 6x^2 + 11x + 6$$ completely and hence write its factors. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-09a67e-3-0', '09a67e', 18, '3', 'Q3: a) Construct a regular hexagon whose each side is 4.7 cm. Inscribe a circle in this hexagon and record its radius. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-09a67e-3-1', '09a67e', 19, '3', 'b) A two digit number contains the smaller of the two digits in the unit place. The product of the digits is 24 and the difference between the digits is 5. Find the number. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-09a67e-3-2', '09a67e', 20, '3', 'c) The curved surface area of a solid sphere is $$2826 \text{ cm}^2$$. It is melted and recast into solid cones of radius 1.5 cm and height 5 cm, Find the following : (take $$\pi = 3.14$$) [5]

i) radius of the sphere

ii) Number of cones formed.

iii) Volume of each cone.', 5, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-09a67e-4-0', '09a67e', 21, '4', 'Q4: a) Sneha has a R.D account in a bank. She deposits Rs.300 per month for 3 years at 8% p.a. Calculate the amount she will get on maturity. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
