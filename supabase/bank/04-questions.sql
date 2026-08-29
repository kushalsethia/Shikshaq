set standard_conforming_strings = on;
begin;

-- questions 1001-1500 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-9d77d9-2.1-0', '9d77d9', 10, '2.1', '1) Mr Kumar has a recurring deposit account in a bank for 4 years at 10% p.a. rate of interest. If he gets ₹ 21,560 as interest at the time of maturity, find

i) the monthly instalment paid by Mr. Kumar.
ii) the amount of maturity of this recurring deposit account.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.2-0', '9d77d9', 11, '2.2', '2) David has a recurring deposit account and deposits ₹600 per month for a period of 4 years. If he gets ₹5,880 as interest at the time of maturity, find the rate of interest.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.3-0', '9d77d9', 12, '2.3', '3) Smita has a recurring deposit account in a bank of ₹ 2,000 per month at the rate of 10 % p.a. If she gets ₹ 83,100 at the time of maturity, find the total time in years for which the account was held.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.4-0', '9d77d9', 13, '2.4', '4) FInd the square roots of the following numbers

i) 52
ii) 83
iii) 65
iv) 21
v) 108
vi) 153', NULL, NULL, 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.5-0', '9d77d9', 14, '2.5', 'i) the quadratic equation 5x(x+2) = 3, give your answer correct to two significant figures.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.5-1', '9d77d9', 15, '2.5', 'ii) the quadratic equation 4x + 6/x + 13 = 0, correct to 2 decimal places.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.6-0', '9d77d9', 16, '2.6', '6) If by increasing the speed of a car by 10 km, the time of journey for a distance of 72km is reduced by 36 minutes, Find the original speed of the car.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.7-0', '9d77d9', 17, '2.7', '7) Find the value(s) of k for which the following equation has equal roots

$$(k+4)x^2 + (k+1)x + 1 = 0$$', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-9d77d9-2.8-0', '9d77d9', 18, '2.8', '8) Prove that $(5x + 4)$ is a factor of $5x^3 + 4x^2 - 5x - 4$. Hence, factorise the polynomial completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-9d77d9-2.9-0', '9d77d9', 19, '2.9', '9) If $x^3 - 2x^2 + px + q$ has a factor $(x+2)$ and leaves a remainder 9 when divided by $(x + 1)$, find the values of $p$ and $q$. With these values of $p$ and $q$, factorise the polynomial completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-9d77d9-2.10-0', '9d77d9', 20, '2.10', '10) Use factor theorem to factorise the following polynomial completely:

$$
4x^3 + 4x^2 - 9x - 9
$$', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-9d77d9-2.11-0', '9d77d9', 21, '2.11', '11) A hemispherical bowl of internal radius $9\mathrm{cm}$ is full of liquid. This liquid is to be filled into conical shaped small cylindrical containers each of diameter $3\mathrm{cm}$ and height $4\mathrm{cm}$. How many containers are necessary to empty the bowl', NULL, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-9d77d9-2.12-0', '9d77d9', 22, '2.12', '12) From a solid cylinder of height $12\mathrm{cm}$ and diameter $10\mathrm{cm}$, a conical cavity of the same base radius and of the same height is hollowed out. Find the total surface area of the remaining solid. (Take $\Pi = \frac{22}{7}$)', NULL, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-9d77d9-2.13-0', '9d77d9', 23, '2.13', '13) A drone camera is used to shoot an object P from two different positions R and S along the same vertical line QRS. The angle of depression of the object P from these two positions are $35^\circ$ and $60^\circ$ respectively as shown in the diagram. If the distance of the object P
from point Q is 50 metres, then find the distance between R and S

correct to the nearest meter.', NULL, 'Trigonometry', 'short', 5, '9d77d9__Bombay_Sco_p6_img_0_jpeg.webp', NULL),
  ('MQ-9d77d9-2.14-0', '9d77d9', 24, '2.14', '14) A pilot seated in an aircraft at an altitude of 250m, observes the angle of depression of two boats on the opposite banks of a river to be 45⁰ and 60⁰ respectively. Find the width of the river. Give your answer correct to 3 significant figures.', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-9d77d9-2.15-0', '9d77d9', 25, '2.15', '15) The angles of depression of the top and the bottom of a 8 m tall building from the top of a multi-storeyed building are 30⁰ and 45⁰ respectively. Find the height of the multi-storeyed building. Give your answer correct to 2 decimal places.', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-9d77d9-2.16-0', '9d77d9', 26, '2.16', '16) A bag contains identical cards numbered from 50 to 80. The cards are well shuffled and then a card is drawn. Find the probability that the number on the card is:

i) a multiple of 5 and 10.
ii) a factor of number 60.
iii) a perfect cube', NULL, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-9d77d9-2.17-0', '9d77d9', 27, '2.17', '17) Two dice are rolled together. Find the probability of getting

i) the sum of the numbers on the upper-most faces between 5 and 8.
ii) a prime number on each dice.', NULL, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-9d77d9-2.18-0', '9d77d9', 28, '2.18', 'i) \((\sin \theta + \cos \theta)(\tan \theta + \cot \theta) = \sec \theta + \csc \theta\)', NULL, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-9d77d9-2.18-1', '9d77d9', 29, '2.18', 'ii) \(\frac{1 + (\sec A - \tan A)^2}{\csc A (\sec A - \tan A)} = 2\tan A\)', NULL, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-9d77d9-2.18-2', '9d77d9', 30, '2.18', 'iii) \(\frac{\tan^3A - 1}{\tan A - 1} = \sec^2 A + \tan A\)', NULL, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-9d77d9-2.19-0', '9d77d9', 31, '2.19', '19)

Given $M = \begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$, find $k$ if $M^2 - 6M + kI = \text{Null matrix}$

where $I$ is a unit matrix of order $2 \times 2$', NULL, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-9d77d9-2.20-0', '9d77d9', 32, '2.20', '20)

$A = \begin{bmatrix} 3 & 2 \\ 0 & 5 \end{bmatrix}$, $B = \begin{bmatrix} 1 & 0 \\ 1 & 2 \end{bmatrix}$, find each of the following and state if they are equal

i) \((\mathrm{A} + \mathrm{B})(\mathrm{A} + \mathrm{B})\)
ii) \(\mathrm{A}^2 -\mathrm{B}^2\)', NULL, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-f3d0ba-1-0', 'f3d0ba', 0, '1', '1. Mrs. Romani has a three year recurring deposit account in the State Bank. She deposits Rs. 600 per month. Calculate the amount she would receive at the time of maturity if the rate of interest is 9 % p.a.', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs. 22,975', 'Rs. 24,597', 'Rs. 21,579', 'Rs. 23, 795']::text[]),
  ('MQ-f3d0ba-1-1', 'f3d0ba', 1, '1', '2. Write the solution set for the following inequations:
$$3 - 2x \geq x - 12; \text{ where } x \in \mathbf{N}$$', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['{7, 8, 9, 12, 14}', '{6, 5, 4, 3, 8}', '{7, 6, 8, 2, 1}', '{1, 2, 3, 4, 5}']::text[]),
  ('MQ-f3d0ba-1-2', 'f3d0ba', 2, '1', '3. What is the formula to discriminant?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['b - 4ac', '$$b^2 - 4ac$$', '$$a^2 - 4bc$$', '$$b^2 - 4a$$']::text[]),
  ('MQ-f3d0ba-1-3', 'f3d0ba', 3, '1', '4. If $$\frac{\sqrt{3x+1} + \sqrt{x+1}}{\sqrt{3x+1} - \sqrt{x+1}} = 4$$, use properties of proportion and solve for x.', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['x = 12', 'x = 16', 'x = 8', 'x = 6']::text[]),
  ('MQ-f3d0ba-1-4', 'f3d0ba', 4, '1', '5. What should be subtracted from the polynomial $$2x^3 + 5x^2 - 11x - 10$$ so that $$(2x + 7)$$ is a factor?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['a = 1', 'a = 4', 'a = ± 1', 'a = 0']::text[]),
  ('MQ-f3d0ba-1-5', 'f3d0ba', 5, '1', '6. Find the value of x, given that $$A^2 = B$$
$$A = \begin{bmatrix} 2 & 12 \\ 0 & 1 \end{bmatrix}, B = \begin{bmatrix} 4 & x \\ 0 & 1 \end{bmatrix}$$', 1, 'Matrices', 'MCQ', 1, NULL, array['x = 56', 'x = 30', 'x = 38', 'x = 36']::text[]),
  ('MQ-f3d0ba-1-6', 'f3d0ba', 6, '1', '7. Which term of the AP : 23, 44, 65, 86, ...,', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['11', '10', '13', '12']::text[]),
  ('MQ-f3d0ba-1-7', 'f3d0ba', 7, '1', '8. If $\Delta ABC \sim \Delta EDF$ and $\Delta ABC$ is not similar to $\Delta DEF$. then which of following is not true?', 1, 'Similarity', 'MCQ', 2, NULL, array['BC x EF = AC x FD', 'AB x EF = AC x DE', 'BC x DE = AB x EF', 'BC x DE = AB x FD']::text[]),
  ('MQ-f3d0ba-1-8', 'f3d0ba', 8, '1', '9. If a polynomial $2x^2 - 7x - 1$ is divided by $x + 3$, then the remainder is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['- 4', '38', '- 3', '2']::text[]),
  ('MQ-f3d0ba-1-9', 'f3d0ba', 9, '1', '10. An ogive curve is used to determine:', 1, 'Statistics', 'MCQ', 2, NULL, array['Range', 'Mean', 'Mode', 'Median']::text[]),
  ('MQ-f3d0ba-1-10', 'f3d0ba', 10, '1', '11. Find the values of a, b, c and d if: $\begin{bmatrix} a & -2 \\ b & 7 \end{bmatrix} = \begin{bmatrix} 2 & c \\ 3 & 2c + d \end{bmatrix}$

(a) a = 3, b = 2

(b) a = 2, b = 3

c = 11, d = - 2

c = - 2, d = 11

(c) a = - 2, b = 11

(d) a = 11, b = 3

c = 2, d = 3

c = - 2, d = 2', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-f3d0ba-1-11', 'f3d0ba', 11, '1', '12. In the given figure, AB is a chord of the circle such that $\angle AXB = 50^\circ$. If AP is tangent to The circles at point A, then $\angle BAP =$', 1, 'Circles', 'MCQ', 2, 'f3d0ba__Brugesh_Si_p2_img_0_jpeg.webp', array['$65^\circ$', '$50^\circ$', '$40^\circ$', 'can''t determine']::text[]),
  ('MQ-f3d0ba-1-12', 'f3d0ba', 12, '1', '13. $\cot^2 \theta - \frac{1}{\sin^2 \theta} =$', 1, 'Trigonometry', 'MCQ', 2, NULL, array['1', '- 1', '$\sin^2 \theta$', '0']::text[]),
  ('MQ-f3d0ba-1-13', 'f3d0ba', 13, '1', '14. Two (non - vertical) lines with slope $m_1$ and $m_2$ are perpendicular to each other if $m_1 =$', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$\frac{1}{m2}$', '$m_2$', '$-\frac{1}{m2}$', 'none of these']::text[]),
  ('MQ-f3d0ba-1-14', 'f3d0ba', 14, '1', '15. A fair die is thrown once. The probability of getting an odd prime number is:

(a) $\frac{1}{2}$

(b) $\frac{1}{6}$

CONTACT NO:- 7977347685 / 7666015693

#

(c) $$\frac{1}{3}$$

(d) 1', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-f3d0ba-2-0', 'f3d0ba', 15, '2', '(A) Prove that $$\sqrt{sec^2\theta + cosec^2\theta} = \tan \theta + \cot \theta$$ [4M]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-2-1', 'f3d0ba', 16, '2', '(B) PQRS is a cyclic quadrilateral. Given $$\angle QPS = 73^{\circ}$$, $$\angle PQS = 55^{\circ}$$ and $$\angle PSR = 82^{\circ}$$ [4M]

Calculate: i) $$\angle QRS$$, ii) $$\angle RQS$$, iii) $$\angle PRQ$$', 4, 'Circles', 'long', 3, 'f3d0ba__Brugesh_Si_p3_img_0_jpeg.webp', NULL),
  ('MQ-f3d0ba-2-2', 'f3d0ba', 17, '2', '(C) Use a graph paper for this question (take 1 cm = 1 unit both x and y axis.) [4M]

i) Plot the following points: A (0, 4), B (2, 3), C (1, 1) and D (2, 0).
ii) Reflect points B, C, D on the y-axis and write down their coordinates. Name the images as B'', C'', D'' respectively.
iii) join the points A, B, C, D, D'', C'', B'' and A'' in order, so as to form a closed figure. Write the equation of the line of symmetry of the figure formed.', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-3-0', 'f3d0ba', 18, '3', '(A) The following numbers k + 3, k + 2, 3k - 7 and 2k - 3 are in proportion. Find k [4M]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-3-1', 'f3d0ba', 19, '3', '(B) Mr. Richard has a recurring deposit account in a bank for 3 years at 7.5% p.a. [4M]

Simple interest. If he gets Rs 8325 as interest at the time of maturity, find

i) the monthly deposit ii) the maturity value', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-3-2', 'f3d0ba', 20, '3', '(C) Solve the following inequation and represent the solution set on a number line. [5M]

$$-8\frac{1}{2} < -\frac{1}{2} - 4x \leq 7\frac{1}{2}, x \in I$$', 5, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-4-0', 'f3d0ba', 21, '4', '(A) Given $$A = \begin{bmatrix} 3 & -2 \\ -1 & 4 \end{bmatrix}$$, $$B = \begin{bmatrix} 6 \\ 1 \end{bmatrix}$$, $$C = \begin{bmatrix} -4 \\ 5 \end{bmatrix}$$ and $$D = \begin{bmatrix} 2 \\ 2 \end{bmatrix}$$. Find AB + 2C - 4D. [3M]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-f3d0ba-4-1', 'f3d0ba', 22, '4', '(B) If the line joining the points A (4, -5) and B (4, 5) is divided by the point P such that $$\frac{AP}{AB} = \frac{1}{2}$$, find the coordinates of P. [4M]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-4-2', 'f3d0ba', 23, '4', '(C) If (x - 2) is a factor of the expression $$2x^3 + ax^2 + bx - 14$$ and when the expression Is divided by (x - 3), it leaves a remainder 52, find the values of a and b. [4M]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-f3d0ba-5-0', 'f3d0ba', 24, '5', '(A) If x, y, z are in continued proportion, prove that $$\frac{(x+y)^2}{(x-y)^2} = \frac{x}{z}$$. [3M]', 3, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-f3d0ba-5-1', 'f3d0ba', 25, '5', '(B) In the given figure, write i) the coordinates of A, B and C.
ii) the equation of the line through A and parallel to BC.

[3M]', 3, 'Coordinate Geometry', 'short', 4, 'f3d0ba__Brugesh_Si_p4_img_0_jpeg.webp', NULL),
  ('MQ-f3d0ba-5-2', 'f3d0ba', 26, '5', '(C) Rs 480 is divided equally among ''x'' children. If the number of children were 20
More than each would have got Rs 12 less. Find ''x''.

[4M]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-f3d0ba-6-0', 'f3d0ba', 27, '6', '(A) Find the sixth term from the end of the A.P.

17, 14, 11, ...(-31)', NULL, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-f3d0ba-6-1', 'f3d0ba', 28, '6', '(B) The following table shows daily wages of some workers in a factory.

[3M]

| Wages (in Rs) | 300 – 349 | 350 – 399 | 400 – 449 | 450 – 499 | 500 – 549 |
| --- | --- | --- | --- | --- | --- |
| No of workers | 14 | 28 | 42 | 36 | 14 |

Draw a histogram for the above data and estimate the mode from it.', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-f3d0ba-6-2', 'f3d0ba', 29, '6', '(C) Construct a regular hexagon of side 5 cm. construct a circle circumscribing
The hexagon. All traces of construction must be clearly shown.

[4M]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-f3d0ba-7-0', 'f3d0ba', 30, '7', '(A) In ΔPQS, PR ⊥ QS and ∠QPS = 90°. i) show that ΔPQR ∼ ΔSPR.
ii) if QR = 2 cm, RS = 4.5 cm, find PR.

[3M]', 3, 'Similarity', 'short', 4, 'f3d0ba__Brugesh_Si_p4_img_1_jpeg.webp', NULL),
  ('MQ-f3d0ba-7-1', 'f3d0ba', 31, '7', '(B) A vertical pole and a vertical tower are on the same level ground. From the top of [3M]
The pole the angle of elevation of the top of the tower is 60° and the angle of depression
Of the foot of the tower is 30°. find the height of the tower if the height of the pole is 20 m.', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-f3d0ba-7-2', 'f3d0ba', 32, '7', '(C) A manufacturer sells a camera for Rs 10000 to a dealer. The dealer sells it a [4M]
Customer at a profit of 12%. If all transactions are within the state and the rate of GST is 28%, calculate

i) the GST paid by the dealer to the state government.
ii) the total tax received by the central government.

CONTACT NO:- 7977347685 / 7666015693

#

iii) the price paid by the customer.', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-f3d0ba-8-0', 'f3d0ba', 33, '8', '(A) The surface area of a solid metallic sphere is \(616~\mathrm{cm}^2\). It is melted and recast [3M] Into smaller spheres of diameter \(3.5~\mathrm{cm}\). how many such spheres can be obtained?', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-f3d0ba-8-1', 'f3d0ba', 34, '8', '(B) In the figure given below, \(\mathrm{AB} = 7\mathrm{cm}\) and \(\mathrm{BC} = 9\mathrm{cm}\). [3M]

i) prove that $\Delta \mathrm{ACD} \sim \Delta \mathrm{DCB}$.

ii) find the length of CD.', 3, 'Similarity', 'short', 5, 'f3d0ba__Brugesh_Si_p5_img_0_jpeg.webp', NULL),
  ('MQ-f3d0ba-8-2', 'f3d0ba', 35, '8', '(C) If the straight lines $3x - 5y = 7$ and $4x + 9y + 9 = 0$ are perpendicular to one [4M] Another, find the value of a.', 4, NULL, 'long', 5, NULL, NULL),
  ('MQ-f3d0ba-9-0', 'f3d0ba', 36, '9', '(A) If \( \mathrm{A} = \begin{bmatrix} 2 & 3 \\ 5 & 7 \end{bmatrix} \), \( \mathrm{B} = \begin{bmatrix} 0 & 4 \\ -1 & 7 \end{bmatrix} \) and \( \mathrm{C} = \begin{bmatrix} 1 & 0 \\ -1 & 4 \end{bmatrix} \), find \( \mathrm{AC} + \mathrm{B}^2 - 10\mathrm{C} \). [3M]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-f3d0ba-9-1', 'f3d0ba', 37, '9', '(B) The histogram alongside represents the scores obtained by 25 students in a [3M] Mathematics mental test. Use the data to:

i) frame a frequency distribution table
ii) to calculate mean
iii) to determine the modal class.', 3, 'Statistics', 'short', 5, 'f3d0ba__Brugesh_Si_p5_img_1_jpeg.webp', NULL),
  ('MQ-f3d0ba-9-2', 'f3d0ba', 38, '9', '(C) Two solids spheres of radii 2 cm and 4 cm are malted and recast into a cone of [4M] Height 8 cm. find the radius of the cone so formed.', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-f3d0ba-10-0', 'f3d0ba', 39, '10', '(A) When two dice are rolled, what is the probability that on the uppermost faces [4M]

i) the sum of two numbers is less than 5
ii) the product of the numbers is 6
iii) the sum is divisible by 5', 4, 'Probability', 'long', 5, NULL, NULL),
  ('MQ-f3d0ba-10-1', 'f3d0ba', 40, '10', '(B) The weight of 50 workers is given below:

[6M]

| Weight in kg | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 | 100 – 110 | 110 – 120 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of workers | 4 | 7 | 11 | 14 | 6 | 5 | 3 |

Draw an ogive of the given distribution using a graph sheet. Take 2 cm = 10 kg on one axis
And 2 cm = 5 workers along the other axis. Use graph to estimate the following:

i) the upper and lower quartiles.
ii) if weighting 95 kg and above is considered overweight, find the number of workers who are overweight.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-8ef68b-1-0', '8ef68b', 0, '1', 'a) Ahmed has a recurring deposit account in a bank. He deposits ₹2500 per month for 2 years. If he gets ₹66250 at the time of maturity, find:

i) The interest paid by the bank. ii) The rate of interest. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-8ef68b-1-1', '8ef68b', 1, '1', 'b) A man buys some ₹100 shares at ₹150 each. He receives an annual income of ₹450.

The percentage return on the investment is 6 %. Calculate :

i) the rate of dividend ii) the number of shares purchased iii) his investment [3]', 3, 'Shares and Dividends', 'short', 1, NULL, NULL),
  ('MQ-8ef68b-1-2', '8ef68b', 2, '1', 'c) For what value of ''a'' is (3x - 1) a factor of the polynomial 6x³ + ax² + x - 2 ? Hence, find the other factors of the polynomial. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 1, NULL, NULL),
  ('MQ-8ef68b-2-0', '8ef68b', 3, '2', 'a) Let P be a matrix such that P × [2 1; 0 3] = [4 -7].

i) State the order of P

ii) Find P.

[3]', 3, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-8ef68b-2-1', '8ef68b', 4, '2', 'b) The point A(3, 4) on reflection in the X- axis is mapped on to A''. Then A'' on reflection in the Y- axis is mapped on to A''''. Find the co-ordinates of A'' and A''''. Write down a single transformation that maps A to A''''. [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8ef68b-2-2', '8ef68b', 5, '2', 'c) In ΔABC, AD : DB = 4 : 5. Calculate: [4]

(i) $$\frac{AE}{EC}$$

(ii) $$\frac{DE}{BC}$$

(iii) area (ΔABC) : area (ΔADE)', 4, 'Similarity', 'long', 2, '8ef68b__Bss_Nov19__p2_img_0_jpeg.webp', NULL),
  ('MQ-8ef68b-3-0', '8ef68b', 6, '3', 'a) Prove: \(\frac{cot\theta \cdot cos\theta}{1 + sin\theta} = \cosec\theta - 1\) [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-8ef68b-3-1', '8ef68b', 7, '3', 'b) A line AB meets the X-axis at point A and the Y-axis at point B. \(P(4, -1)\) divides AB in the ratio 1:2. Find the co-ordinates of A and B. [3]', 3, 'Coordinate Geometry', 'short', 2, '8ef68b__Bss_Nov19__p2_img_1_jpeg.webp', NULL),
  ('MQ-8ef68b-3-2', '8ef68b', 8, '3', 'c) A tent is of the shape of a right circular cylinder upto a height of 3 m and then becomes a right circular cone with a maximum height of 13.5 m above the ground. Calculate the cost of painting the inner surface of the tent at ₹ 4 per sq. m, if the radius of the base is 14 m. [4]', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-8ef68b-4-0', '8ef68b', 9, '4', 'a) The line 3x - 4y + 12 = 0 meets the X- axis at P. [3]

i) Write the co-ordinates of P.
ii) Determine the equation of the line that passes through P, and is parallel to the given line.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8ef68b-4-1', '8ef68b', 10, '4', 'b) From a boat, \(400\mathrm{m}\) away from a vertical cliff, the angles of elevation of the top and the bottom of a flag post at the edge of the cliff are \(53^{\circ}\) and \(51^{\circ}24''\), respectively. Find the height of the flag post. Write the answer correct to the nearest whole number. [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-8ef68b-4-2', '8ef68b', 11, '4', 'c) Construct a regular hexagon of side \(4\mathrm{cm}\) and construct an incircle. [4]', 4, 'Constructions', 'long', 2, NULL, NULL),
  ('MQ-8ef68b-5-0', '8ef68b', 12, '5', '[3]

a) In the figure, DE || BC.

i) Prove that Δ ADE and Δ ABC are similar.
ii) Given that AD = ½ BD, calculate DE, if BC = 4·5 cm.
iii) If area of Δ ABC = 18 cm², find area of trapezium DBCE.', 3, 'Similarity', 'short', 3, '8ef68b__Bss_Nov19__p3_img_0_jpeg.webp', NULL),
  ('MQ-8ef68b-5-1', '8ef68b', 13, '5', 'b) If A = [2 3; -1 3] and B = [1 4; 4 -2], given A + 2B = 2I, where I is an identity matrix of order

2 × 2, find x and y. [3]', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-8ef68b-5-2', '8ef68b', 14, '5', 'c) Using ruler and compasses only : [4]

i) Construct a triangle ABC with BC = 6 cm, ∠ABC = 120° and AB = 3·5 cm.
ii) In the above figure, draw a circle with BC as diameter. Find a point ''P'' on the circumference of the circle which is equidistant from AB and BC.
iii) Measure ∠BCP.', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-8ef68b-6-0', '8ef68b', 15, '6', 'a) A solid cone of diameter 10 cm and height 8 cm is melted and made into small spheres of radius 0·5 cm. Find the number of spheres formed. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-8ef68b-6-1', '8ef68b', 16, '6', 'b) A model ship is made to a scale 1 : 1000. Calculate (i) the actual length of the ship in ''m'' if the length of the model is 7.2 cm (ii) the area of the deck on the model ship if the area of the deck on the actual ship is 20,000 m²(iii) the volume of the ship if the model is 1·2 m³. [3]', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-8ef68b-6-2', '8ef68b', 17, '6', 'c) Find the co-ordinates of a point which divides the line joining the points (3,-4) and (-8, 7) in the ratio 7 : 5. Hence, find the equation of the line passing through this point and perpendicular to the line segment. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-8ef68b-7-0', '8ef68b', 18, '7', 'a) Find the value of ''p'' if the remainders, when the polynomials px³ + 3x² - 26 and 2x³ - 5x + p are divided by x + 4, are the same. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-8ef68b-7-1', '8ef68b', 19, '7', 'b) A boy stands on the deck of a ship 100 m above a lake and finds the angle of elevation of the top of the hill as 30° and the depression of the foot of the hill to be 60°. Calculate the height of the hill. Give your answer correct to two decimal places. [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-8ef68b-7-2', '8ef68b', 20, '7', 'c) Attempt this question on a graph paper. Take 2 cm = 2 units on both axes. Plot A (3, 2) and B (5, 4) on the graph paper. [4]

i) Reflect A and B in the line \( x = 0 \) to \( A'' \) and \( B'' \) respectively.
ii) Give the geometrical name of the figure ABB''A''.
iii) Find its area.
iv) Write the measure of the angle \(\mathrm{ABB^{\prime}}\)', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-8ef68b-8-0', '8ef68b', 21, '8', 'a) Prove that that \(\frac{\cos^2 A + \tan^2 A - 1}{\sin^2 A} = \tan^2 A\) [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-8-1', '8ef68b', 22, '8', 'b) Find the value of \( k \) for which the two lines \( 3x + 4y = 5 \) and \( kx - 9y = 7 \) are perpendicular to each other. [3]', 3, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-8-2', '8ef68b', 23, '8', 'c) Construct a circle of radius \(3\mathrm{cm}\). Mark a point \(\mathbf{P}\) at a distance of \(7\mathrm{cm}\) from the centre of the circle. From the point \(\mathbf{P}\), construct a pair of tangents, and measure the lengths of the two tangent segments. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-8ef68b-9-0', '8ef68b', 24, '9', 'a) Prove that \(\frac{1 + \tan^2\theta}{1 + \cot^2\theta} = \left(\frac{1 - \tan\theta}{1 - \cot\theta}\right)^2\) [3]', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-9-1', '8ef68b', 25, '9', 'b) Construct a triangle ABC in which base \( \mathrm{BC} = 5 \cdot 5 \, \mathrm{cm} \), \( \mathrm{AB} = 6 \, \mathrm{cm} \) and \( \angle ABC = 120^\circ \).

i) Construct a circle circumscribing the triangle ABC.
ii) Draw a cyclic quadrilateral ABCD so that D is equidistant from B and C. [3]', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-9-2', '8ef68b', 26, '9', 'c) Given A = $$\begin{bmatrix} 2 & 3 \\ -1 & 2 \end{bmatrix}$$ and B = $$\begin{bmatrix} 2 & -3 \\ 0 & -1 \end{bmatrix}$$, find A² - 2B + I where I is the identity matrix [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-8ef68b-10-0', '8ef68b', 27, '10', 'a) Beena has a cumulative deposit account of ₹ 400 per month at 10% per annum simple interest. If she gets ₹ 30100 at the time of maturity, find the total time for which the account was held. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-10-1', '8ef68b', 28, '10', 'b) A cylindrical pipe is \(60~\mathrm{cm}\) long. Its inner diameter is \(3\mathrm{cm}\) and outer diameter is \(3.8\mathrm{cm}\).

Find: [3]

i) The inner curved surface area ii) The volume', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-8ef68b-10-2', '8ef68b', 29, '10', 'c) Sanjay invested ₹42,000 in 7% ₹100 shares at 30% discount. After one year he sold the shares at ₹80 each, and reinvested the proceeds (including the dividend of the first year) in ₹25 shares at ₹15 premium. Find the original dividend and his change in income if the rate of dividend for the new investment is 6%. [4]', 4, 'Shares and Dividends', 'long', 4, NULL, NULL),
  ('MQ-8ef68b-11-0', '8ef68b', 30, '11', 'a) The given figure represents a hemisphere surmounted by a conical block of wood. The diameter of their bases is 6 cm each and the slant height of the cone is 5 cm. Calculate: [3]

(i) The height of the cone.
(ii) The volume of the solid', 3, 'Mensuration', 'short', 5, '8ef68b__Bss_Nov19__p5_img_0_jpeg.webp', NULL),
  ('MQ-8ef68b-11-1', '8ef68b', 31, '11', 'b) Ajay purchases ₹ 100 shares for ₹ 120 and earns 6% profit on his investment. Calculate the rate of dividend and his annual income if he owns 250 shares. [3]', 3, 'Shares and Dividends', 'short', 5, NULL, NULL),
  ('MQ-8ef68b-11-2', '8ef68b', 32, '11', 'c) The line joining P(-4,5) and Q(3,2) intersects the y-axis at R. PM and QN are perpendiculars from P and Q on the x-axis. Find :

(i) the ratio PR : RQ.
(ii) the coordinates of R.

[4]', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-5c5012-1-0', '5c5012', 0, '1', 'a) If a, b, c, d are in proportion, prove that: $$\frac{\sqrt{a^4+c^4}}{\sqrt{b^4+d^4}} = \frac{ma^2+nc^2}{mb^2+nd^2}$$ [3]', 3, 'Ratio and Proportion', 'short', 1, NULL, NULL),
  ('MQ-5c5012-1-1', '5c5012', 1, '1', 'b) Solve the following equation correct up to three significant figures: $$5x^2 - 10x - 3 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-5c5012-1-2', '5c5012', 2, '1', 'c) In the figure A, B, C, D are points on a circle with centre O and $$\angle AOB = 108^\circ$$. Calculate: [4]

(i) $$\angle ACB$$
(ii) $$\angle ADB$$
(iii) $$\angle OAB$$', 4, 'Circles', 'long', 1, '5c5012__Bss_X_Math_p1_img_0_jpeg.webp', NULL),
  ('MQ-5c5012-2-0', '5c5012', 3, '2', 'a) There were 50 questions in an examination paper numbered 1 to 50. Write down the probability that the number of the question will: [3]
 i) contain more than one digit
 ii) contain at least one figure 4
 iii) end in 4', 3, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-5c5012-2-1', '5c5012', 4, '2', 'b) An A.P whose third term is 1 and the 6$^{th}$ term is -11, has 32 terms. Find the last term and the sum of all the terms. [3]', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-5c5012-2-2', '5c5012', 5, '2', 'c) Given $$A = \begin{bmatrix} 2 & -6 \\ 2 & 6 \end{bmatrix}$$, $$B = \begin{bmatrix} -3 & 2 \\ 4 & 0 \end{bmatrix}$$, find the matrix C such that $$A^2 + AB - 5C = 0$$ [4]', 4, 'Matrices', 'long', 1, NULL, NULL),
  ('MQ-5c5012-3-0', '5c5012', 6, '3', 'a) Draw a circle of radius 3.5 cm. Take a point R at a distance of 5.6 cm from the centre and construct tangents to the circle from point R. Measure the length of the tangent segments. [3]', 3, 'Constructions', 'short', 1, NULL, NULL),
  ('MQ-5c5012-3-1', '5c5012', 7, '3', 'b) The line joining A(2, 3) and B(6, -5) is intersected by the x axis at point P. Find the ratio in which P divides AB, hence write down the coordinates of point P. [3]', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-5c5012-3-2', '5c5012', 8, '3', 'c) Draw a histogram representing the following distribution and estimate the mode.

[4]

| Pocket expenses (₹) | 140-150 | 150-160 | 160-170 | 170-180 | 180-190 | 190-200 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 8 | 10 | 26 | 12 | 7 | 3 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-5c5012-4-0', '5c5012', 9, '4', 'a) Polynomial \( x^3 - ax^2 + bx - 6 \) leaves remainder \( -8 \) when divided by \( x + 1 \) and \( 2x + 3 \) is a factor of it. Find the values of a and b. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-5c5012-4-1', '5c5012', 10, '4', 'b) Solve the following inequation: \(-3\frac{1}{2} < \frac{1}{2} - \frac{4x}{3} \leq 3\frac{1}{6}, x \in I\). Represent the solution on a number line. [3]', 3, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-5c5012-4-2', '5c5012', 11, '4', 'c) The surface area of a solid metallic sphere is \(5024~\mathrm{cm}^2\). It is melted and recast into solid cones of radius \(5\mathrm{cm}\) and height \(10\mathrm{cm}\). Take \(\pi = 3.14\) and calculate: [4]

i) the radius of the sphere.
ii) the number of cones recast.', 4, 'Mensuration', 'long', 2, NULL, NULL),
  ('MQ-5c5012-5-0', '5c5012', 12, '5', 'a) A man invests ₹ 20,020 in buying shares of nominal value ₹ 26 at 10% premium. The dividend on the shares is 15% per annum. Calculate:

i) the number of shares he buys.
ii) the dividend he receives annually.
iii) the rate of interest he gets on his money in 2 decimal places.', NULL, 'Shares and Dividends', 'short', 2, NULL, NULL),
  ('MQ-5c5012-5-1', '5c5012', 13, '5', 'b) Prove that: \(\frac{1}{1 + \sin A} +\frac{1}{1 - \sin A} = \frac{2\tan A}{\sin A\cos A}\) [3]', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-5c5012-5-2', '5c5012', 14, '5', 'c) Given matrix \(\mathbf{B} = \begin{bmatrix} 1 & 1 \\ 8 & 3 \end{bmatrix}\); find matrix \(X\) if \(X = 4B - BI\) where \(I\) is a \(2 \times 2\) matrix. [4] Hence solve for a, b, given \(X\begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} 5 \\ 50 \end{bmatrix}\)', 4, 'Matrices', 'long', 2, NULL, NULL),
  ('MQ-5c5012-6-0', '5c5012', 15, '6', 'a) Find the value of k for which the following equation has equal roots.

$$x^2 + 4kx + (k^2 - k + 2) = 0$$', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-5c5012-6-1', '5c5012', 16, '6', 'b) The marked price of an article is ₹30,000. The dealer buys it at a 25% discount and sells it to a retailer at a discount of 15% on the marked price. If the rate of GST is 12%, find the GST paid by the dealer. [3]', 3, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-5c5012-6-2', '5c5012', 17, '6', 'c) Using properties of proportion, solve for \( x: \frac{x^2 + x - 3}{x - 3} = \frac{4x^2 + 3x - 2}{3x - 2} \) [4]', 4, 'Ratio and Proportion', 'long', 2, NULL, NULL),
  ('MQ-5c5012-7-0', '5c5012', 18, '7', 'a) Find the GP whose \(4^{\text{th}}\) and \(7^{\text{th}}\) term are \(\frac{1}{18}\) and \(-\frac{1}{486}\) respectively. [3]', 3, 'Geometric Progression', 'short', 2, NULL, NULL),
  ('MQ-5c5012-7-1', '5c5012', 19, '7', 'b) From a pack of well shuffled 52 playing cards, the even primes are removed. The remaining cards are then shuffled and a card is drawn. Find the probability of drawing : [3]

(i) a numbered card.
(ii) a ten or a spade
(iii) a number divisible by 2', 3, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-5c5012-7-2', '5c5012', 20, '7', '1) Write the coordinates of \( P^{\prime}, Q^{\prime} \)
iv) Give a geometrical name to the figure \(PQQ^{\prime}P^{\prime}R\)
(1) Find the area of the figure \(PQQ^{\prime}P^{\prime}R\)', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-5c5012-8-0', '5c5012', 21, '8', 'a) If the mean of the following distribution is 7.5, find the missing frequency p [3]

| x | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| f | 20 | 17 | p | 10 | 8 | 6 | 7 | 6 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-5c5012-8-1', '5c5012', 22, '8', 'b) A, B, C are three points on a circle. The tangent at C meets AB at T. Given that $\angle ATC = 36^{\circ}$ and $\angle BCT = 48^{\circ}$, find the angle subtended by the arc AB at the centre of the circle O. [3]', 3, 'Circles', 'short', 3, '5c5012__Bss_X_Math_p3_img_0_jpeg.webp', NULL),
  ('MQ-5c5012-8-2', '5c5012', 23, '8', 'c) A hemispherical and a conical hole is scooped out of a solid wooden cylinder. Find the volume of the remaining solid given that the height of the solid cylinder is 7 cm, radius of each of the hemisphere, cone and cylinder is 3 cm and the height of the cone is 3 cm. [Give your answer correct to the nearest whole number] [4]', 4, 'Mensuration', 'long', 3, '5c5012__Bss_X_Math_p3_img_1_jpeg.webp', NULL),
  ('MQ-5c5012-9-0', '5c5012', 24, '9', 'a) The hotel bill for a number of people for an overnight stay is ₹ 4800. If there were 4 more, the bill each person had to pay would have been reduced by ₹ 200. Find the number of people staying overnight. [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-5c5012-9-1', '5c5012', 25, '9', 'b) The following distribution represents the daily allowance of students in a school: [6]

| Daily allowance(₹) | 50 – 55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Draw an ogive for the given distribution. Using the graph, determine:

1) the median allowance
ii) the inter quartile range
iii) the number of students whose allowance is more than 78', 6, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-5c5012-10-0', '5c5012', 26, '10', 'a) The arithmetic mean of 6, 8, 10, x, 8, 7 is 8. Find the median and mode of the data. [3]', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-5c5012-10-1', '5c5012', 27, '10', 'b) In the given figure, AB is the diameter of a circle with centre \((-2,5)\) and \(A(4, -3)\). Find: i) the coordinates of point B ii) the equation of tangent AT [3]', 3, 'Coordinate Geometry', 'short', 4, '5c5012__Bss_X_Math_p4_img_0_jpeg.webp', NULL),
  ('MQ-5c5012-10-2', '5c5012', 28, '10', 'c) Using ruler and compasses only, construct triangle BCA where CB = 5 cm, AC = 4 cm and ∠ABC = 45°. Locate point P which is equidistant from AB and CB and also equidistant from points C and B. Measure the length of PA. [4]', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-5c5012-11-0', '5c5012', 29, '11', 'a) From the top of a tower AB, a man notices two objects C and D on the ground, on the same side of AB. When observed from the top of the tower A, their angles of depression are 45° and 60° respectively. Find the distance between the two objects if the height of the tower is 300 m. Give your answer to the nearest meter [3]', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-5c5012-11-1', '5c5012', 30, '11', 'b) Mr. Mathur opened a recurring deposit account in a bank paying \(12\%\) p.a rate of interest. At the end of two years, he received 26750. Calculate his monthly installment [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-0b1644-1-0', '0b1644', 0, '1', 'a) Using the Remainder theorem, factorise the following polynomial completely.

$$2x^3 + x^2 - 13x + 6$$ [3]', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-0b1644-1-1', '0b1644', 1, '1', 'b) Kishore has a recurring deposit account in a bank for 2 years at 8.5% simple interest. If he gets ₹ 2,550 as interest at the time of maturity, find

i) the monthly deposit.

ii) the maturity value. [3]', 3, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-0b1644-1-2', '0b1644', 2, '1', 'c) Calculate the mean and median of the following distribution: [4]

| Age in years | 12 | 18 | 14 | 17 | 16 | 15 | 13 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 2 | 2 | 5 | 3 | 4 | 6 | 3 |', 4, 'Statistics', 'long', 1, NULL, NULL),
  ('MQ-0b1644-2-0', '0b1644', 3, '2', 'a) Find x, y if $$\begin{bmatrix} -2 & 0 \\ 3 & 1 \end{bmatrix} \begin{bmatrix} -1 \\ 2x \end{bmatrix} + 3 \begin{bmatrix} -2 \\ 1 \end{bmatrix} = 2 \begin{bmatrix} y \\ 3 \end{bmatrix}$$ [3]', 3, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-0b1644-2-1', '0b1644', 4, '2', 'b) In the figure given below, AB is parallel to DC, $$\angle BCE = 80^\circ$$ and $$\angle BAC = 25^\circ$$.

Find:

i) $$\angle BAD$$ [3]

ii) $$\angle CBD$$

iii) $$\angle ADC$$', 3, 'Circles', 'short', 2, '0b1644__Bssm_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-0b1644-2-2', '0b1644', 5, '2', 'c) How many terms of the A.P: -6, $$\frac{-11}{2}$$, -5, ... make the sum - 25? [4]', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-0b1644-3-0', '0b1644', 6, '3', 'a) Solve the following equation, give your answer correct to 2 significant figures.

$$4x + \frac{6}{x} + 13 = 0$$ [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-0b1644-3-1', '0b1644', 7, '3', 'b) In what ratio does the point (-4,p) divide the line segment joining the points A(2,-2), B(-14,6)? Hence, find the value of p [3]', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-0b1644-3-2', '0b1644', 8, '3', 'c) A retailer buys a television set from a wholesaler for ₹40,000. He marks the price of the television set 15 % above the cost price and sells it to a consumer at 5 % discount on the marked price. If the sales are intra-state and the rate of GST is 12 %, find:

i) the marked price of the television set. [4]

ii) the amount of tax paid by the retailer to the Central Government.

iii) the amount of tax received by the State Government for the sale of television set.', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-0b1644-4-0', '0b1644', 9, '4', 'a) The figure given below represents a solid consisting of a right circular cylinder surmounted by a cone at one end. Their common radius is 15cm. The height of the cone is 20cm and the total height of the solid is 70cm. Find the total surface area of the solid [3]

$$(Take \pi = \frac{22}{7})$$', 3, 'Mensuration', 'short', 3, '0b1644__Bssm_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-0b1644-4-1', '0b1644', 10, '4', 'b) Equation of line L₁ is y = -2.

i) Write the slope of line L₂ if L₂ is the bisector of ∠X''OY. [3]
ii) Write the coordinates of point M.
iii) Find the equation of line L₂', 3, 'Coordinate Geometry', 'short', 3, '0b1644__Bssm_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-0b1644-4-2', '0b1644', 11, '4', 'c) Use graph paper for this question.

(Take 2cm = 1 unit on both the axes)

Plot the points P(4,0) and Q(2,-2)

i) P is invariant when reflected in an axis. Name the axis. [4]

ii) Q'' is the image of Q on reflection in the axis found in (i) and R is the image of P on reflection in the origin.

Write down the coordinates of Q'' and R

iii) State the geometrical name of the figure PQRQ''.

iv) Find the area of the figure PQRQ''.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-0b1644-5-0', '0b1644', 12, '5', 'a) Find the value(s) of k for which the following equation has real and equal roots.

$$(k+4)x^2 + (k+1)x + 1 = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-0b1644-5-1', '0b1644', 13, '5', 'b) There are two dice, one red and the other black. Both are rolled simultaneously. Find the probability that

i) each dice shows 5.

ii) the number on the black dice is either 2 or 4.

iii) the sum is at least 11. [3]', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-0b1644-5-2', '0b1644', 14, '5', 'c) If $$\frac{a^3+b^3}{a^3-b^3} = \frac{76}{49}$$, use properties of proportion to find

i) a : b

ii) $$\frac{2a^2-2b^2}{2b^2}$$ [4]', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-0b1644-6-0', '0b1644', 15, '6', 'a) Solve the following inequation, write the solution set and represent it on a number line.

$$- 3 (x - 7) \geq 15 - 7x > \frac{x + 1}{3} \quad , \quad x \in I \tag{3}$$', 3, 'Linear Inequations', 'short', 4, NULL, NULL),
  ('MQ-0b1644-6-1', '0b1644', 16, '6', 'b) In the figure given below, AB is a diameter of the semicircle.
CD ⊥ AB.

i) Prove that Δ ADC ∼ Δ CDB
ii) Find CD, if AD = 4.5 cm and DB = 8 cm [3]', 3, 'Similarity', 'short', 5, '0b1644__Bssm_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-0b1644-6-2', '0b1644', 17, '6', 'c) If the mean of the following observations is 54, find the value of p using the Short Cut Method. [4]

| Class | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | p | 10 | 9 | 13 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-0b1644-7-0', '0b1644', 18, '7', 'a) P(3,4), Q(7,-2) and R(-2,-1) are the vertices of triangle PQR. Find the equation of the median of the triangle through R. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-0b1644-7-1', '0b1644', 19, '7', 'b) The fourth term of an A.P is 11 and the eighth term exceeds twice the fourth term by 5. Find the A.P. [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-0b1644-7-2', '0b1644', 20, '7', 'c) Prove the identity: [4]

$$\frac{\tan A}{1 - \cot A} + \frac{\cot A}{1 - \tan A} = \sec A \operatorname{cosec} A + 1$$', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-0b1644-8-0', '0b1644', 21, '8', 'a) If a,b,c are in continued proportion, prove that :

$$a^2 b^2 c^2 (a^{-4} + b^{-4} + c^{-4}) = b^{-2} (a^4 + b^4 + c^4)$$ [4]', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-0b1644-8-1', '0b1644', 22, '8', 'b) The following table shows the distribution of the heights of a group of 200 factory workers.

| Height (in cm) | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 | 170-175 | 175-180 | 180-185 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of workers | 6 | 12 | 20 | 46 | 57 | 37 | 15 | 7 |

Using a graph sheet, draw an ogive for the distribution.

Take 2cm = 5cm height on one axis and 2cm = 20 workers on the other axis. Use your graph to estimate the following:

i) the median height [6]
ii) the lower quartile.
iii) the height above which the tallest 25% of workers fall.
iv) the number of workers who are considered short if 154 cm is considered as standard height.', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-0b1644-9-0', '0b1644', 23, '9', 'a) Mrs. Shetty has a recurring deposit account in a bank of ₹ 2000 per month at the rate of 10% p.a. If she gets ₹ 83,100 at the time of maturity, find the total time in years, for which the account was held. [3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-0b1644-9-1', '0b1644', 24, '9', 'b) If A = $$\begin{bmatrix} 3 & 7 \\ 2 & 4 \end{bmatrix}$$, B = $$\begin{bmatrix} 0 & 2 \\ 5 & 3 \end{bmatrix}$$ and C = $$\begin{bmatrix} 1 & -5 \\ -4 & 6 \end{bmatrix}$$, find AB - 5C. [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-0b1644-9-2', '0b1644', 25, '9', '(c) The angles of depression of the top and the bottom of an 8 m tall building from the top of a multi-storeyed building are 30⁰ and 45⁰ respectively. Find the height of the multi-storeyed building. Give your answer correct to 2 decimal places. [4]', 4, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-0b1644-10-0', '0b1644', 26, '10', 'a) Point A divides the line segment joining P(-2,6) and Q(3,-4) in the ratio 2:3.

i) Find the coordinates of A. [3]

ii) Find the equation of the line whose gradient is $$\frac{3}{2}$$ and passing through A.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-0b1644-10-1', '0b1644', 27, '10', 'b) In the figure given below, PQ = RQ, ∠ RQP = 68°, PC and QC are tangents to the circle with centre O.

Find :

i) ∠QOP [3]
ii) ∠CPQ
iii) ∠QCP', 3, 'Circles', 'short', 7, '0b1644__Bssm_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-0b1644-10-2', '0b1644', 28, '10', 'c) A grocer bought some baskets of fruit for ₹1500. Five baskets of fruit were lost in the transit. He sold each of the rest for ₹ 10 more than he paid for them and made neither profit nor loss. Find the number of baskets of fruit bought. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-0b1644-11-0', '0b1644', 29, '11', 'a) The polynomials $ax^3 + 5x^2 - 11x - 14$ and $3x^3 + ax^2 - 4x + 20$ when divided by (x+2), leave the same remainder.

Find the value of a. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 7, NULL, NULL),
  ('MQ-0b1644-11-1', '0b1644', 30, '11', 'b) In Δ PQR, MN is parallel to QR and $\frac{PM}{MQ} = \frac{2}{3}$ ,

Find : i) MN:QR

ii) Area (ΔOMN) : Area (ΔORQ) [3]', 3, 'Similarity', 'short', 7, '0b1644__Bssm_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-0b1644-11-2', '0b1644', 31, '11', 'c) A conical vessel, diameter 36cm and height 25cm is filled by a cylindrical pipe of diameter 8mm. The water flows at the rate of 15 m per minute from the pipe. Find the time taken to fill the vessel completely. Give your answer correct to the nearest minute. [4]', 4, 'Mensuration', 'long', 8, NULL, NULL),
  ('MQ-f32e54-1-0', 'f32e54', 0, '1', 'In a right triangle ABC, right-angled at B, BC = 12 cm and AB = 5 cm.
The radius of the circle inscribed in the triangle (in cm) is', 1, 'Circles', 'MCQ', 3, NULL, array['4', '3', '2', '1']::text[]),
  ('MQ-f32e54-2-0', 'f32e54', 1, '2', 'The probability that a number selected at random from the numbers 1, 2, 3, ..., 15 is a multiple of 4, is', 1, 'Probability', 'MCQ', 3, NULL, array['$\frac{4}{15}$', '$\frac{2}{15}$', '$\frac{1}{5}$', '$\frac{1}{3}$']::text[]),
  ('MQ-f32e54-3-0', 'f32e54', 2, '3', 'In a family of 8 children, the probability of having at least one boy is', 1, 'Probability', 'MCQ', 4, NULL, array['$$\frac{7}{8}$$', '$$\frac{1}{8}$$', '$$\frac{5}{8}$$', '$$\frac{3}{4}$$']::text[]),
  ('MQ-f32e54-4-0', 'f32e54', 3, '4', 'The angle of depression of a car parked on the road from the top of a 150 m high tower is 30°. The distance of the car from the tower (in metres) is', 1, 'Trigonometry', 'MCQ', 5, NULL, array['$50\sqrt{3}$', '$150\sqrt{3}$', '$150\sqrt{2}$', '75']::text[]),
  ('MQ-f32e54-5-0', 'f32e54', 4, '5', 'A chord of a circle of radius 10 cm subtends a right angle at its centre. The length of the chord (in cm) is', 1, 'Circles', 'MCQ', 5, NULL, array['$5\sqrt{2}$', '$10\sqrt{2}$', '$\frac{5}{\sqrt{2}}$', '$10\sqrt{3}$']::text[]),
  ('MQ-f32e54-6-0', 'f32e54', 5, '6', 'ABCD is a rectangle whose three vertices are B(4, 0), C(4, 3) and D(0, 3). The length of one of its diagonals is', 1, 'Coordinate Geometry', 'MCQ', 6, NULL, array['5', '4', '3', '25']::text[]),
  ('MQ-f32e54-7-0', 'f32e54', 6, '7', 'If k, 2k - 1 and 2k + 1 are three consecutive terms of an A.P., the value of k is', 1, 'Arithmetic Progression', 'MCQ', 7, NULL, array['2', '3', '-3', '5']::text[]),
  ('MQ-f32e54-8-0', 'f32e54', 7, '8', 'Two circles touch each other externally at P. AB is a common tangent to the circles touching them at A and B. The value of ∠APB is', 1, 'Circles', 'MCQ', 7, NULL, array['30°', '45°', '60°', '90°']::text[]),
  ('MQ-f32e54-9-0', 'f32e54', 8, '9', 'Two different dice are tossed together. Find the probability

- (i) that the number on each die is even.
- (ii) that the sum of numbers appearing on the two dice is 5.', 2, 'Probability', 'short', 8, NULL, NULL),
  ('MQ-f32e54-10-0', 'f32e54', 9, '10', 'If the total surface area of a solid hemisphere is 462 cm$^{2}$, find its volume.

[ Take $\pi = \frac{22}{7} ]', 2, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-f32e54-11-0', 'f32e54', 10, '11', 'Find the number of natural numbers between 101 and 999 which are divisible by both 2 and 5.', 2, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-f32e54-12-0', 'f32e54', 11, '12', 'In Figure 1, common tangents AB and CD to the two circles with centres O₁ and O₂ intersect at E. Prove that AB = CD.

Figure 1', 2, 'Circles', 'short', 9, 'f32e54__CBSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-f32e54-13-0', 'f32e54', 12, '13', 'The incircle of an isosceles triangle ABC, in which AB = AC, touches the sides BC, CA and AB at D, E and F respectively. Prove that BD = DC.', 2, 'Circles', 'short', 9, NULL, NULL),
  ('MQ-f32e54-14-0', 'f32e54', 13, '14', 'Find the value of p so that the quadratic equation px (x - 3) + 9 = 0 has equal roots.', 2, 'Quadratic Equations', 'short', 9, NULL, NULL),
  ('MQ-f32e54-15-0', 'f32e54', 14, '15', 'In Figure 2, two concentric circles with centre O, have radii 21 cm and 42 cm. If $\angle AOB = 60^\circ$, find the area of the shaded region. [Use $\pi = \frac{22}{7}$]

Figure 2', 3, 'Mensuration', 'short', 10, 'f32e54__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-f32e54-16-0', 'f32e54', 15, '16', 'The largest possible sphere is carved out of a wooden solid cube of side 7 cm. Find the volume of the wood left. [Use $\pi = \frac{22}{7}$]', 3, 'Mensuration', 'short', 10, NULL, NULL),
  ('MQ-f32e54-17-0', 'f32e54', 16, '17', 'Water in a canal, 6 m wide and 1.5 m deep, is flowing at a speed of 4 km/h. How much area will it irrigate in 10 minutes, if 8 cm of standing water is needed for irrigation ?', 3, 'Mensuration', 'short', 10, NULL, NULL),
  ('MQ-f32e54-18-0', 'f32e54', 17, '18', 'In Figure 3, ABCD is a trapezium of area 24.5 sq. cm. In it, AD || BC, ∠DAB = 90°, AD = 10 cm and BC = 4 cm. If ABE is a quadrant of a circle, find the area of the shaded region. [ Take π = 22/7 ]

Figure 3', 3, 'Mensuration', 'short', 11, 'f32e54__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-f32e54-19-0', 'f32e54', 18, '19', 'Find the ratio in which the line segment joining the points A(3, -3) and B(-2, 7) is divided by x-axis. Also find the coordinates of the point of division.', 3, 'Coordinate Geometry', 'short', 11, NULL, NULL),
  ('MQ-f32e54-20-0', 'f32e54', 19, '20', 'Construct a triangle with sides 5 cm, 5.5 cm and 6.5 cm. Now construct another triangle, whose sides are 3/5 times the corresponding sides of the given triangle.', 3, 'Constructions', 'short', 11, NULL, NULL),
  ('MQ-f32e54-21-0', 'f32e54', 20, '21', 'Solve for x :

$$\frac{16}{x} - 1 = \frac{15}{x+1};\ x \neq 0,\ -1$$', 3, 'Quadratic Equations', 'short', 11, NULL, NULL),
  ('MQ-f32e54-22-0', 'f32e54', 21, '22', 'The sum of the first seven terms of an AP is 182. If its 4th and the 17th terms are in the ratio 1 : 5, find the AP.', 3, 'Arithmetic Progression', 'short', 11, NULL, NULL),
  ('MQ-f32e54-23-0', 'f32e54', 22, '23', 'From the top of a 60 m high building, the angles of depression of the top and the bottom of a tower are $45^\circ$ and $60^\circ$ respectively. Find the height of the tower. [Take $\sqrt{3} = 1.73$ ]', 3, 'Trigonometry', 'short', 12, NULL, NULL),
  ('MQ-f32e54-24-0', 'f32e54', 23, '24', 'Find a point P on the y-axis which is equidistant from the points A(4, 8) and B(-6, 6). Also find the distance AP.', 3, 'Coordinate Geometry', 'short', 12, NULL, NULL),
  ('MQ-f32e54-25-0', 'f32e54', 24, '25', 'A motorboat whose speed in still water is 18 km/h, takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 12, NULL, NULL),
  ('MQ-f32e54-26-0', 'f32e54', 25, '26', 'Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.', 4, 'Circles', 'long', 12, NULL, NULL),
  ('MQ-f32e54-27-0', 'f32e54', 26, '27', '150 spherical marbles, each of diameter 1.4 cm, are dropped in a cylindrical vessel of diameter 7 cm containing some water, which are completely immersed in water. Find the rise in the level of water in the vessel.', 4, 'Mensuration', 'long', 13, NULL, NULL),
  ('MQ-f32e54-28-0', 'f32e54', 27, '28', 'A container open at the top, is in the form of a frustum of a cone of height 24 cm with radii of its lower and upper circular ends as 8 cm and 20 cm respectively. Find the cost of milk which can completely fill the container at the rate of ₹ 21 per litre. [Use $\pi = \frac{22}{7}$ ]', 4, 'Mensuration', 'long', 13, NULL, NULL),
  ('MQ-f32e54-29-0', 'f32e54', 28, '29', 'The angle of elevation of the top of a tower at a distance of 120 m from a point A on the ground is $45^\circ$ . If the angle of elevation of the top of a flagstaff fixed at the top of the tower, at A is $60^\circ$ , then find the height of the flagstaff. [Use $\sqrt{3} = 1.73$ ]', 4, 'Trigonometry', 'long', 13, NULL, NULL),
  ('MQ-f32e54-30-0', 'f32e54', 29, '30', 'In a school, students decided to plant trees in and around the school to reduce air pollution. It was decided that the number of trees, that each section of each class will plant, will be double of the class in which they are studying. If there are 1 to 12 classes in the school and each class has two sections, find how many trees were planted by the students. Which value is shown in this question?', 4, 'Arithmetic Progression', 'long', 14, NULL, NULL),
  ('MQ-f32e54-31-0', 'f32e54', 30, '31', 'Solve for x :

$$\frac{x-4}{x-5} + \frac{x-6}{x-7} = \frac{10}{3};\ x \neq 5, 7$$', 4, 'Quadratic Equations', 'long', 14, NULL, NULL),
  ('MQ-f32e54-32-0', 'f32e54', 31, '32', 'Five cards — the ten, jack, queen, king and ace of diamonds, are well shuffled with their faces downwards. One card is then picked up at random.

- (a) What is the probability that the drawn card is the queen ?
- (b) If the queen is drawn and put aside, and a second card is drawn, find the probability that the second card is (i) an ace (ii) a queen.', 4, 'Probability', 'long', 14, NULL, NULL),
  ('MQ-f32e54-33-0', 'f32e54', 32, '33', 'If A(4, 2), B(7, 6) and C(1, 4) are the vertices of a $\Delta$ ABC and AD is its median, prove that the median AD divides $\Delta$ ABC into two triangles of equal areas.', 4, 'Coordinate Geometry', 'long', 14, NULL, NULL),
  ('MQ-e62428-1-0', 'e62428', 0, '1', '1. समांतर श्रेढ़ी $-5, \frac{-5}{2}, 0, \frac{5}{2}, \dots$ का 25वाँ पद ज्ञात कीजिए ।

Find the 25$^{th}$ term of the A.P. $-5, \frac{-5}{2}, 0, \frac{5}{2}, \dots$', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-e62428-2-0', 'e62428', 1, '2', '2. जब सूर्य का उन्नयन कोण $60^\circ$ है, तो एक खम्भे की भूमि पर छाया की लंबाई $2\sqrt{3}$ मीटर है। खम्भे की ऊँचाई ज्ञात कीजिए।

A pole casts a shadow of length $2\sqrt{3}$ m on the ground, when the sun''s elevation is $60^\circ$ . Find the height of the pole.', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-e62428-3-0', 'e62428', 2, '3', '3. संयोग के एक खेल में एक तीर को घुमाया जाता है, जो रुकने पर संख्याओं 1, 2, 3, 4, 5, 6, 7, 8 में से किसी एक संख्या को इंगित करता है। यदि यह सभी परिणाम समप्रायिक हों, तो तीर के 8 के किसी एक गुणनखण्ड पर रुकने की प्रायिकता ज्ञात कीजिए।

A game of chance consists of spinning an arrow which comes to rest pointing at one of the numbers 1, 2, 3, 4, 5, 6, 7, 8 and these are equally likely outcomes. Find the probability that the arrow will point at any factor of 8.', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-e62428-4-0', 'e62428', 3, '4', '4. त्रिज्याएँ $a$ तथा $b$ ( $a > b$ ) के दो संकेन्द्रीय वृत्त दिए गए हैं। बड़े वृत्त की जीवा, जो छोटे वृत्त की स्पर्श रेखा है, की लम्बाई ज्ञात कीजिए।

Two concentric circles of radii $a$ and $b$ ( $a > b$ ) are given. Find the length of the chord of the larger circle which touches the smaller circle.', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-e62428-5-0', 'e62428', 4, '5', '5. आकृति 1 में, वृत्त का केन्द्र O है। PT तथा PQ इस वृत्त पर बाह्य बिन्दु P से दो स्पर्श-रेखाएँ हैं। यदि $\angle TPQ = 70^\circ$ है, तो $\angle TRQ$ ज्ञात कीजिए।

आकृति 1

10 Years
10 Question
Paper.com

30/2/1

P.T.O.
In Figure 1, O is the centre of a circle. PT and PQ are tangents to the circle from an external point P. If ∠TPQ = 70°, find ∠TRQ.

Figure 1', 2, 'Circles', 'short', 3, 'e62428__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-e62428-6-0', 'e62428', 5, '6', '6. आकृति 2 में, 5 सेमी त्रिज्या वाले वृत्त में जीवा PQ की लम्बाई 8 सेमी है। P तथा Q पर स्पर्श-रेखाएँ परस्पर बिन्दु T पर मिलती हैं। TP तथा TQ की लम्बाइयाँ ज्ञात कीजिए।

आकृति 2

In Figure 2, PQ is a chord of length 8 cm of a circle of radius 5 cm. The tangents at P and Q intersect at a point T. Find the lengths of TP and TQ.

Figure 2', 2, 'Circles', 'short', 4, 'e62428__CBSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-e62428-7-0', 'e62428', 6, '7', '7. x के लिए हल कीजिए :

$$x^2 - (\sqrt{3} + 1)x + \sqrt{3} = 0$$

Solve for x :

$$x^2 - (\sqrt{3} + 1)x + \sqrt{3} = 0$$', 2, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-e62428-8-0', 'e62428', 7, '8', '8. एक समांतर श्रेढ़ी का चौथा पद 11 है। इस समांतर श्रेढ़ी के पाँचवें तथा सातवें पदों का योगफल 34 है। इसका सार्व अन्तर ज्ञात कीजिए।

The fourth term of an A.P. is 11. The sum of the fifth and seventh terms of the A.P. is 34. Find its common difference.', 2, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-e62428-9-0', 'e62428', 8, '9', '9. सिद्ध कीजिए कि बिन्दु $(a, a)$, $(-a, -a)$ तथा $(-\sqrt{3}a, \sqrt{3}a)$ एक समबाहु त्रिभुज के शीर्ष बिन्दु हैं।

Show that the points $(a, a)$, $(-a, -a)$ and $(-\sqrt{3}a, \sqrt{3}a)$ are the vertices of an equilateral triangle.', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-e62428-10-0', 'e62428', 9, '10', '10. k के किन मानों के लिए बिन्दु $(8, 1)$, $(3, -2k)$ तथा $(k, -5)$ सरेखीय हैं ?

For what values of k are the points $(8, 1)$, $(3, -2k)$ and $(k, -5)$ collinear ?', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-e62428-11-0', 'e62428', 10, '11', '11. बिन्दु A, बिन्दुओं $P(6, -6)$ तथा $Q(-4, -1)$ को मिलाने वाले रेखाखण्ड PQ पर इस प्रकार स्थित है कि $\frac{PA}{PQ} = \frac{2}{5}$। यदि बिन्दु P रेखा $3x + k(y + 1) = 0$ पर भी स्थित हो, तो k का मान ज्ञात कीजिए।

Point A lies on the line segment PQ joining $P(6, -6)$ and $Q(-4, -1)$ in such a way that $\frac{PA}{PQ} = \frac{2}{5}$. If point P also lies on the line $3x + k(y + 1) = 0$, find the value of k.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-e62428-12-0', 'e62428', 11, '12', '12. x के लिए हल कीजिए :

$$x^2 + 5x - (a^2 + a - 6) = 0$$

Solve for x :

$$x^2 + 5x - (a^2 + a - 6) = 0$$', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-e62428-13-0', 'e62428', 12, '13', '13. यदि एक समांतर श्रेढ़ी का 12वाँ पद -13 है तथा इसके प्रथम चार पदों का योगफल 24 है, तो इसके प्रथम दस पदों का योगफल ज्ञात कीजिए ।

In an A.P., if the 12$^{th}$ term is -13 and the sum of its first four terms is 24, find the sum of its first ten terms.', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-e62428-14-0', 'e62428', 13, '14', '14. एक थैले में 18 गेंदें हैं जिनमें x लाल गेंदें हैं ।

- (i) यदि थैले में से एक गेंद यादृच्छया निकाली जाए, तो इसके लाल गेंद के न होने की प्रायिकता क्या है ?
- (ii) यदि थैले में 2 लाल गेंदें और डाल दी जाएँ, तो लाल गेंद के आने की प्रायिकता, पहली अवस्था में लाल गेंद के आने की प्रायिकता की $$\frac{9}{8}$$ गुना है । x का मान ज्ञात कीजिए ।

A bag contains 18 balls out of which x balls are red.

- (i) If one ball is drawn at random from the bag, what is the probability that it is not red ?
- (ii) If 2 more red balls are put in the bag, the probability of drawing a red ball will be $$\frac{9}{8}$$ times the probability of drawing a red ball in the first case. Find the value of x.', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-e62428-15-0', 'e62428', 14, '15', '15. 50 मीटर ऊँचे टावर के शिखर से एक खम्भे के शीर्ष तथा पाद के अवनमन कोण क्रमशः $30^\circ$ तथा $45^\circ$ हैं। ज्ञात कीजिए

- (i) टावर के पाद से खम्भे के पाद की दूरी,
- (ii) खम्भे की ऊँचाई। ( $\sqrt{3} = 1.732$ का प्रयोग कीजिए)

From the top of a tower of height 50 m, the angles of depression of the top and bottom of a pole are $30^\circ$ and $45^\circ$ respectively. Find

- (i) how far the pole is from the bottom of a tower,
- (ii) the height of the pole. (Use $\sqrt{3} = 1.732$ )', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-e62428-16-0', 'e62428', 15, '16', '16. एक घड़ी की बड़ी सुई तथा छोटी सुई क्रमशः 6 सेमी तथा 4 सेमी लम्बी हैं। सुईयों की नोकों द्वारा 24 घंटों में तय दूरियों का योगफल ज्ञात कीजिए। ( $\pi = 3.14$ का प्रयोग कीजिए)

The long and short hands of a clock are 6 cm and 4 cm long respectively. Find the sum of the distances travelled by their tips in 24 hours. (Use $\pi = 3.14$ )', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-e62428-17-0', 'e62428', 16, '17', '17. एक ही धातु के दो गोलों का भार 1 किलोग्राम तथा 7 किलोग्राम है। छोटे गोले की त्रिज्या 3 सेमी है। दोनों गोलों को पिघला कर एक बड़ा गोला बनाया गया। नए गोले का व्यास ज्ञात कीजिए।

Two spheres of same metal weigh 1 kg and 7 kg. The radius of the smaller sphere is 3 cm. The two spheres are melted to form a single big sphere. Find the diameter of the new sphere.', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-e62428-18-0', 'e62428', 17, '18', '18. धातु के एक बेलन की त्रिज्या 3 सेमी तथा ऊँचाई 5 सेमी है। इस का भार कम करने के लिए बेलन में एक शंक्वाकार छेद किया गया। इस शंक्वाकार छेद की त्रिज्या $\frac{3}{2}$ सेमी तथा गहराई $\frac{8}{9}$ सेमी है। शेष बचे बेलन की धातु के आयतन का शंक्वाकार छेद करने हेतु निकाली गई धातु के आयतन से अनुपात ज्ञात कीजिए।

A metallic cylinder has radius 3 cm and height 5 cm. To reduce its weight, a conical hole is drilled in the cylinder. The conical hole has a radius of $\frac{3}{2}$ cm and its depth is $\frac{8}{9}$ cm. Calculate the ratio of the volume of metal left in the cylinder to the volume of metal taken out in conical shape.', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-e62428-19-0', 'e62428', 18, '19', '19. आकृति 3 में, ABCD एक समलंब है जिसमें AB || DC है, AB = 18 सेमी, DC = 32 सेमी और AB तथा DC के बीच की दूरी 14 सेमी है। यदि A, B, C तथा D प्रत्येक को केंद्र मान कर समान त्रिज्या 7 सेमी की चापें निकाली गई हैं, तो छायांकित भाग का क्षेत्रफल ज्ञात कीजिए।

आकृति 3

In Figure 3, ABCD is a trapezium with AB || DC, AB = 18 cm, DC = 32 cm and the distance between AB and DC is 14 cm. If arcs of equal radii 7 cm have been drawn, with centres A, B, C and D, then find the area of the shaded region.

Figure 3', 3, 'Mensuration', 'short', 8, 'e62428__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-e62428-20-0', 'e62428', 19, '20', '20. पानी से पूरा भरे 60 सेमी त्रिज्या तथा 180 सेमी ऊँचाई वाले एक लंबवृत्तीय बेलन में, 60 सेमी ऊँचाई तथा 30 सेमी त्रिज्या वाला एक ठोस लंबवृत्तीय शंकु डाला गया। बेलन में बचे पानी का आयतन घन मीटरों में ज्ञात कीजिए। [ $$\pi = \frac{22}{7}$$ का प्रयोग कीजिए ]

A solid right-circular cone of height 60 cm and radius 30 cm is dropped in a right-circular cylinder full of water of height 180 cm and radius 60 cm. Find the volume of water left in the cylinder, in cubic metres.

[Use $$\pi = \frac{22}{7}$$]', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-e62428-21-0', 'e62428', 20, '21', '21. यदि $x = -2$, समीकरण $3x^2 + 7x + p = 0$ का एक मूल है, तो $k$ के वह मान ज्ञात कीजिए, कि समीकरण $x^2 + k(4x + k - 1) + p = 0$ के मूल समान हों।

If $x = -2$ is a root of the equation $3x^2 + 7x + p = 0$, find the values of $k$ so that the roots of the equation $x^2 + k(4x + k - 1) + p = 0$ are equal.', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-e62428-22-0', 'e62428', 21, '22', '22. तीन-अंकों वाली उन सभी संख्याओं, जिनको 4 से भाग करने पर 3 शेष आता है, से बनी श्रेढ़ी का मध्य पद ज्ञात कीजिए। मध्य पद के दोनों ओर आने वाली सभी संख्याओं का अलग-अलग योगफल भी ज्ञात कीजिए।

Find the middle term of the sequence formed by all three-digit numbers which leave a remainder 3, when divided by 4. Also find the sum of all numbers on both sides of the middle term separately.', 4, 'Arithmetic Progression', 'long', 9, NULL, NULL),
  ('MQ-e62428-23-0', 'e62428', 22, '23', '23. एक कपड़े की कुछ लंबाई की कुल लागत ₹ 200 है। यदि कपड़ा 5 मीटर अधिक लम्बा हो तथा प्रत्येक मीटर की लागत ₹ 2 कम हो, तो कपड़े की लागत में कोई परिवर्तन नहीं होगा। कपड़े का वास्तविक प्रति मीटर मूल्य ज्ञात कीजिए तथा कपड़े की लम्बाई भी ज्ञात कीजिए।

The total cost of a certain length of a piece of cloth is ₹ 200. If the piece was 5 m longer and each metre of cloth costs ₹ 2 less, the cost of the piece would have remained unchanged. How long is the piece and what is its original rate per metre ?', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-e62428-24-0', 'e62428', 23, '24', '24. सिद्ध कीजिए कि वृत्त के किसी बिन्दु पर खींची गई स्पर्श-रेखा उस बिन्दु से गुजरने वाली त्रिज्या पर लम्ब होती है।

Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.', 4, 'Circles', 'long', 9, NULL, NULL),
  ('MQ-e62428-25-0', 'e62428', 24, '25', '25. आकृति 4 में, O केन्द्र वाले वृत्त के बाह्य बिन्दु T से TP एक स्पर्श-रेखा है। यदि ∠PBT = 30° है, तो सिद्ध कीजिए कि BA : AT = 2 : 1.

आकृति 4

In Figure 4, O is the centre of the circle and TP is the tangent to the circle from an external point T. If ∠PBT = 30°, prove that BA : AT = 2 : 1.', 4, 'Circles', 'long', 10, 'e62428__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-e62428-26-0', 'e62428', 25, '26', '26. 3 सेमी त्रिज्या का वृत्त खींचिए। केन्द्र से 7 सेमी दूरी पर बिन्दु P से वृत्त पर दो स्पर्श-रेखाएँ खींचिए। इन दोनों स्पर्श-रेखाओं की लम्बाई मापिए।

Draw a circle of radius 3 cm. From a point P, 7 cm away from its centre draw two tangents to the circle. Measure the length of each tangent.', 4, 'Constructions', 'long', 10, NULL, NULL),
  ('MQ-e62428-27-0', 'e62428', 26, '27', '27. समान ऊँचाई के दो खम्भे 80 मीटर चौड़ी सड़क के दोनों ओर एक-दूसरे के सम्मुख हैं। इन दोनों खम्भों के बीच सड़क के किसी बिन्दु P पर एक खम्भे के शीर्ष का उन्नयन कोण 60° है तथा दूसरे खम्भे के शीर्ष से बिन्दु P का अवनमन कोण 30° है। खम्भों की ऊँचाइयाँ तथा बिन्दु P की खम्भों से दूरियाँ ज्ञात कीजिए।

30/2/1

10 Years Question Paper.com
Two poles of equal heights are standing opposite to each other on either side of the road which is 80 m wide. From a point P between them on the road, the angle of elevation of the top of a pole is 60° and the angle of depression from the top of another pole at point P is 30°. Find the heights of the poles and the distances of the point P from the poles.', 4, 'Trigonometry', 'long', 10, NULL, NULL),
  ('MQ-e62428-28-0', 'e62428', 27, '28', '28. एक बॉक्स में संख्या 6 से 70 तक की गिनती के कार्ड हैं। यदि एक कार्ड यादृच्छया बॉक्स से खींचा जाए, तो प्रायिकता ज्ञात कीजिए कि खींचे गए कार्ड पर

- (i) एक अंक की संख्या है।
- (ii) 5 से पूर्ण विभाजित होने वाली संख्या है।
- (iii) 30 से कम एक विषम संख्या है।
- (iv) 50 से 70 के मध्य की एक भाज्य संख्या है।

A box contains cards bearing numbers from 6 to 70. If one card is drawn at random from the box, find the probability that it bears

- (i) a one digit number.
- (ii) a number divisible by 5.
- (iii) an odd number less than 30.
- (iv) a composite number between 50 and 70.', 4, 'Probability', 'long', 11, NULL, NULL),
  ('MQ-e62428-29-0', 'e62428', 28, '29', '29. एक समबाहु त्रिभुज ABC का आधार BC, y-अक्ष पर स्थित है। बिन्दु C के निर्देशांक (0, -3) हैं। मूल बिन्दु आधार का मध्य-बिन्दु है। बिन्दुओं A तथा B के निर्देशांक ज्ञात कीजिए। अतः एक अन्य बिंदु D के निर्देशांक ज्ञात कीजिए जिससे BACD एक समचतुर्भुज हो।

The base BC of an equilateral triangle ABC lies on y-axis. The coordinates of point C are (0, -3). The origin is the mid-point of the base. Find the coordinates of the points A and B. Also find the coordinates of another point D such that BACD is a rhombus.', 4, 'Coordinate Geometry', 'long', 11, NULL, NULL),
  ('MQ-e62428-30-0', 'e62428', 29, '30', '30. पानी से भरा एक बर्तन उल्टे शंकु के आकार का है। इस बर्तन की ऊँचाई 8 सेमी है। बर्तन ऊपर से खुला है जिसकी त्रिज्या 5 सेमी है। इसमें 100 गोलीय गोलियाँ डाली गईं जिससे बर्तन का एक-चौथाई पानी बाहर आ गया। एक गोली की त्रिज्या ज्ञात कीजिए।

A vessel full of water is in the form of an inverted cone of height 8 cm and the radius of its top, which is open, is 5 cm. 100 spherical lead balls are dropped into the vessel. One-fourth of the water flows out of the vessel. Find the radius of a spherical ball.', 4, 'Mensuration', 'long', 12, NULL, NULL),
  ('MQ-e62428-31-0', 'e62428', 30, '31', '31. एक दूध वाले बर्तन, जिसकी ऊँचाई 30 सेमी है, एक शंकु के छिन्नक के आकार का है, जिसके निचले तथा ऊपरी वृत्तीय सिरों की त्रिज्याएँ क्रमशः 20 सेमी तथा 40 सेमी हैं, में भरा दूध बाढ़ पीड़ितों के लिए कैंप में वितरित किया जाना है। यदि यह दूध ₹ 35 प्रति लीटर के भाव से उपलब्ध है तथा एक कैंप के लिए कम-से-कम 880 लीटर दूध प्रति दिन चाहिए, तो ज्ञात कीजिए कि ऐसे कितने बर्तनों का दूध प्रति दिन कैंप के लिए चाहिए तथा दाता एजेंसी को प्रति दिन कैंप के लिए क्या व्यय करना पड़ेगा। उपरोक्त से दाता एजेंसी द्वारा कौन-सा मूल्य प्रदर्शित किया गया है ?

Milk in a container, which is in the form of a frustum of a cone of height 30 cm and the radii of whose lower and upper circular ends are 20 cm and 40 cm respectively, is to be distributed in a camp for flood victims. If this milk is available at the rate of ₹ 35 per litre and 880 litres of milk is needed daily for a camp, find how many such containers of milk are needed for a camp and what cost will it put on the donor agency for this. What value is indicated through this by the donor agency ?', 4, 'Mensuration', 'long', 12, NULL, NULL),
  ('MQ-bcaeaa-1-0', 'bcaeaa', 0, '1', '1. 52 पत्तों की अच्छी प्रकार फेंटी गई ताश की गड्डी में से यादृच्छया एक पत्ता निकाला गया।
प्रायिकता ज्ञात कीजिए कि निकाला गया पत्ता न तो लाल रंग का है और न ही एक बेगम है।
A card is drawn at random from a well shuffled pack of 52 playing cards. Find the probability of getting neither a red card nor a queen.', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-bcaeaa-2-0', 'bcaeaa', 1, '2', '2. एक दीवार के साथ लगी सीढ़ी क्षैतिज के साथ 60° का कोण बनाती है। यदि सीढ़ी का पाद दीवार से 2.5 मी. की दूरी पर है, तो सीढ़ी की लम्बाई ज्ञात कीजिए।
A ladder, leaning against a wall, makes an angle of 60° with the horizontal. If the foot of the ladder is 2.5 m away from the wall, find the length of the ladder.', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-bcaeaa-3-0', 'bcaeaa', 2, '3', '3. आकृति 1 में O केन्द्र वाले वृत्त के बिंदु C पर PQ एक स्पर्श रेखा है। यदि AB एक व्यास है तथा ∠CAB = 30° है, तो ∠PCA ज्ञात कीजिए।

आकृति 1

In fig.1, PQ is a tangent at a point C to a circle with centre O. If AB is a diameter and ∠CAB = 30°, find ∠PCA.

Figure 1', 1, 'Circles', 'short', 3, 'bcaeaa__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-4-0', 'bcaeaa', 3, '4', '4. $k$ के किस मान के लिए $k+9$, $2k-1$ तथा $2k+7$ एक समांतर श्रेढ़ी के क्रमागत पद हैं?
For what value of $k$ will $k+9$, $2k-1$ and $2k+7$ are the consecutive terms of an A.P. ?', 1, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-bcaeaa-5-0', 'bcaeaa', 4, '5', '5. आकृति 2 में एक चतुर्भुज ABCD, O केंद्र वाले वृत्त के परिगत इस प्रकार बनाई गई है कि भुजाएँ AB, BC, CD तथा DA वृत्त को क्रमशः बिंदुओं P, Q, R तथा S पर स्पर्श करती हैं। सिद्ध कीजिए कि $AB+CD=BC+DA$ ।

आकृति 2

In Fig.2, a quadrilateral ABCD is drawn to circumscribe a circle, with centre O, in such a way that the sides AB, BC, CD and DA touch the circle at the points P, Q, R and S respectively. Prove that $AB+CD=BC+DA$.

Figure 2', 2, 'Circles', 'short', 4, 'bcaeaa__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-6-0', 'bcaeaa', 5, '6', '6 सिद्ध कीजिए कि बिंदु $(3, 0)$, $(6, 4)$ तथा $(-1, 3)$ एक समद्विबाहु समकोण त्रिभुज के शीर्ष हैं। Prove that the points $(3, 0)$, $(6, 4)$ and $(-1, 3)$ are the vertices of a right angled isosceles triangle.', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-bcaeaa-7-0', 'bcaeaa', 6, '7', '7. एक समांतर श्रेढ़ी का चौथा पद शून्य है। सिद्ध कीजिए कि इसका 25 वां पद, उसके 11 वें पद का तीन गुना है।

The 4$^{th}$ term of an A.P. is zero. Prove that the 25$^{th}$ term of the A.P. is three times its 11$^{th}$ term.', 2, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-bcaeaa-8-0', 'bcaeaa', 7, '8', '8. माना P तथा Q, A(2, -2) तथा B(-7, 4) को मिलाने वाले रेखाखंड को इस प्रकार समविभाजित करते हैं कि P, बिंदु A के पास है। P तथा Q के निर्देशांक ज्ञात कीजिए।

Let P and Q be the points of trisection of the line segment joining the points A(2, -2) and B(-7, 4) such that P is nearer to A. Find the coordinates of P and Q.', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-bcaeaa-9-0', 'bcaeaa', 8, '9', '9. आकृति 3 में एक बाह्य बिंदु P से, O केन्द्र तथा r त्रिज्या वाले वृत्त पर दो स्पर्श रेखाएँ PT तथा PS खींची गई हैं। यदि OP = 2r है, तो दर्शाइए कि ∠OTS = ∠OST = 30°।

आकृति 3

In Fig. 3, from an external point P, two tangents PT and PS are drawn to a circle with centre O and radius r. If OP = 2r, show that ∠OTS = ∠OST = 30°.

Figure 3', 2, 'Circles', 'short', 5, 'bcaeaa__CBSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-10-0', 'bcaeaa', 9, '10', '10. x के लिए हल कीजिए : $$\sqrt{6x + 7} - (2x - 7) = 0$$

Solve for x : $$\sqrt{6x + 7} - (2x - 7) = 0$$', 2, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-bcaeaa-11-0', 'bcaeaa', 10, '11', '11. एक शंक्वाकार बर्तन, जिसके आधार की त्रिज्या 5 सेमी तथा ऊँचाई 24 सेमी है, पानी से पूरा भरा है। उस पानी को एक बेलनाकार बर्तन, जिसकी त्रिज्या 10 सेमी है, में डाल दिया जाता है। बेलनाकार बर्तन में कितनी ऊँचाई तक पानी भर जायेगा? ( $$\pi = \frac{22}{7}$$ लीजिए )

A conical vessel, with base radius 5 cm and height 24 cm, is full of water. This water is emptied into a cylindrical vessel of base radius 10 cm. Find the height to which the water will rise in the cylindrical vessel. (Use $$\pi = \frac{22}{7}$$ )', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-bcaeaa-12-0', 'bcaeaa', 11, '12', '12. आकृति 4 में O केन्द्र वाले वृत्त का व्यास AB = 13 सेमी है तथा AC = 12 सेमी है। BC को मिलाया गया है। छायांकित क्षेत्र का क्षेत्रफल ज्ञात कीजिए। ( $$\pi = 3.14$$ लीजिए )

आकृति 4

In fig.4. O is the centre of a circle such that diameter AB = 13 cm and AC = 12 cm. BC is joined. Find the area of the shaded region. (Take $$\pi = 3.14$$ )

Figure 4', 3, 'Mensuration', 'short', 6, 'bcaeaa__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-13-0', 'bcaeaa', 12, '13', '13. यदि बिन्दु $P(x, y)$ बिंदुओं $A(a+b, b-a)$ तथा $B(a-b, a+b)$ से समदूरस्थ है, तो सिद्ध कीजिए कि $bx = ay$.

If the point $P(x, y)$ is equidistant from the points $A(a+b, b-a)$ and $B(a-b, a+b)$. Prove that $bx = ay$.', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-bcaeaa-14-0', 'bcaeaa', 13, '14', '14. आकृति 5 में एक टेंट बेलन के ऊपर लगे उसी व्यास वाले शंकु के आकार का है। बेलनाकार भाग की ऊँचाई तथा व्यास क्रमशः 2.1 मी. तथा 3 मी. हैं तथा शंकवाकार भाग की तिरछी ऊँचाई 2.8 मी. है। टेंट को बनाने में लगे कैनवास का मूल्य ज्ञात कीजिए, यदि कैनवास का भाव

₹ 500 प्रति वर्ग मी है। ($\pi = \frac{22}{7}$ लीजिए)

In fig. 5, a tent is in the shape of a cylinder surmounted by a conical top of same diameter. If the height and diameter of cylindrical part are 2.1 m and 3 m respectively and the slant height of conical part is 2.8 m, find the cost of canvas needed to make the tent if the canvas is available at the rate of

₹ 500/sq.metre. (Use $\pi = \frac{22}{7}$)', 3, 'Mensuration', 'short', 7, 'bcaeaa__CBSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-15-0', 'bcaeaa', 14, '15', '15. 12 सेमी व्यास वाला एक गोला, एक लंब वृत्तीय बेलनाकार बर्तन में डाल दिया जाता है, जिसमें कुछ पानी भरा है। यदि गोला पूर्णतया पानी में डूब जाता है, तो बेलनाकार बर्तन में पानी का स्तर $3\frac{5}{9}$ सेमी ऊँचा उठ जाता है। बेलनाकार बर्तन का व्यास ज्ञात कीजिए।

A sphere of diameter 12 cm, is dropped in a right circular cylindrical vessel, partly filled with water. If the sphere is completely submerged in water, the water level in the cylindrical vessel rises by $3\frac{5}{9}$ cm. Find the diameter of the cylindrical vessel.', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-bcaeaa-16-0', 'bcaeaa', 15, '16', '16. एक व्यक्ति एक जलयान के डैक, जो पानी के स्तर से 10 मी. ऊँचा है, से एक पहाड़ी के शिखर का उन्नयन कोण $60^\circ$ तथा पहाड़ी के तल का अवनमन कोण $30^\circ$ पाता है। पहाड़ी से जलयान की दूरी तथा पहाड़ी की ऊँचाई ज्ञात कीजिए।

A man standing on the deck of a ship, which is 10 m above water level, observes the angle of elevation of the top of a hill as $60^\circ$ and the angle of depression of the base of hill as $30^\circ$. Find the distance of the hill from the ship and the height of the hill.', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-bcaeaa-17-0', 'bcaeaa', 16, '17', '17. आकृति 6 में, दो सकेन्द्रीय वृत्तों, जिसकी त्रिज्याएँ 7 सेमी तथा 14 सेमी हैं, के बीच घिरे छायांकित क्षेत्र का क्षेत्रफल ज्ञात कीजिए जबकि $\angle AOC = 40^\circ$ है। ($\pi = \frac{22}{7}$ लीजिए)

आकृति 6

30/3

YEARS
QUESTION PAPER.COM
In fig. 6, find the area of the shaded region, enclosed between two concentric

circles of radii 7 cm and 14 cm where $\angle AOC = 40^\circ$ . (Use $\pi = \frac{22}{7}$ )

Figure 6', 3, 'Mensuration', 'short', 8, 'bcaeaa__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-18-0', 'bcaeaa', 17, '18', '18. एक थैले में 100 कार्ड हैं जिन पर 1 से लेकर 100 तक संख्याएँ लिखी हैं। थैले में से एक कार्ड यादृच्छया निकाला गया। प्रायिकता ज्ञात कीजिए कि निकाले गए कार्ड पर (i) 9 से विभाजित एक पूर्ण वर्ग संख्या है (ii) 80 से बड़ी एक अभाज्य संख्या है।

There are 100 cards in a bag on which numbers from 1 to 100 are written. A card is taken out from the bag at random. Find the probability that the number on the selected card (i) is divisible by 9 and is a perfect square (ii) is a prime number greater than 80.', 3, 'Probability', 'short', 9, NULL, NULL),
  ('MQ-bcaeaa-19-0', 'bcaeaa', 18, '19', '19. ब्रीन क्रमागत प्राकृत संख्याएँ ऐसी हैं कि बीच वाली संख्या का वर्ग शेष दोनों के वर्गों के अन्तर से 60 अधिक है। संख्याएँ ज्ञात कीजिए।

Three consecutive natural numbers are such that the square of the middle number exceeds the difference of the squares of the other two by 60. Find the numbers.', 3, 'Quadratic Equations', 'short', 9, NULL, NULL),
  ('MQ-bcaeaa-20-0', 'bcaeaa', 19, '20', '20. तीन समांतर श्रेणियों के प्रथम $n$ पदों का योग क्रमशः $S_1, S_2$ तथा $S_3$ हैं। तीनों का प्रथम पद 1 है तथा सार्व अन्तर क्रमशः 1, 2 तथा 3 हैं। सिद्ध कीजिए कि $S_1 + S_3 = 2S_2$ .

The sums of first $n$ terms of three arithmetic progressions are $S_1, S_2$ and $S_3$ respectively. The first term of each A.P. is 1 and their common differences are 1, 2 and 3 respectively. Prove that $S_1 + S_3 = 2S_2$ .', 3, 'Arithmetic Progression', 'short', 9, NULL, NULL),
  ('MQ-bcaeaa-21-0', 'bcaeaa', 20, '21', '21. किसी राज्य में भारी बाढ़ के कारण हजारों लोग बेघर हो गए। 50 विद्यालयों ने मिलकर राज्य सरकार को 1500 टैंट लगाने के लिए स्थान तथा कैनवास देने का प्रस्ताव किया जिसमें प्रत्येक विद्यालय बराबर का अंशदान देगा। प्रत्येक टैंट का निचला भाग बेलनाकार है, जिसके आधार की त्रिज्या 2.8 मी. तथा ऊँचाई 3.5 मी. है। प्रत्येक टैंट का ऊपरी भाग शंकु के आकार का है जिसके आधार की त्रिज्या 2.8 मी. तथा ऊँचाई 2.1 मी. है। यदि टैंट बनाने वाले कैनवास का मूल्य ₹ 120 प्रति वर्ग मी. है, तो प्रत्येक विद्यालय द्वारा कुल व्यय में अंशदान ज्ञात कीजिए।

इस प्रश्न द्वारा कौन सा मूल्य जनित होता है? ($\pi = \frac{22}{7}$ लीजिए)

Due to heavy floods in a state, thousands were rendered homeless. 50 schools collectively offered to the state government to provide place and the canvas for 1500 tents to be fixed by the government and decided to share the whole expenditure equally. The lower part of each tent is cylindrical of base radius 2.8 m and height 3.5 m, with conical upper part of same base radius but of height 2.1 m. If the canvas used to make the tents costs ₹ 120 per sq.m, find the amount shared by each school to set up the tents. What value is generated

by the above problem? (Use $\pi = \frac{22}{7}$)', 4, 'Mensuration', 'long', 10, NULL, NULL),
  ('MQ-bcaeaa-22-0', 'bcaeaa', 21, '22', '22. एक सीधी रेखा में स्थित घरों पर 1 से 49 तक की संख्याएँ (क्रमानुसार) अंकित हैं। दर्शाइए कि इन अंकित संख्याओं में एक ऐसी संख्या X अवश्य है कि X से पहले आने वाले घरों पर की अंकित संख्याओं का योग, X के बाद आनेवाली अंकित संख्याओं के योग के बराबर है। The houses in a row are numbered consecutively from 1 to 49. Show that there exists a value of X such that sum of numbers of houses proceeding the house numbered X is equal to sum of the numbers of houses following X.', 4, 'Arithmetic Progression', 'long', 10, NULL, NULL),
  ('MQ-bcaeaa-23-0', 'bcaeaa', 22, '23', '23. आकृति 7 में एक त्रिभुज ABC के शीर्ष A(4, 6), B(1, 5) तथा C(7, 2) है। एक रेखाखंड DE भुजाओं AB तथा AC को क्रमशः बिंदुओं D तथा E पर इस प्रकार काटता खींचा गया है कि $$\frac{AD}{AB} = \frac{AE}{AC} = \frac{1}{3}$$ है। $$\triangle ADE$$ का क्षेत्रफल ज्ञात कीजिए तथा उसकी $$\triangle ABC$$ के क्षेत्रफल से तुलना कीजिए।

आकृति 7

In fig. 7, the vertices of $$\triangle ABC$$ are A(4, 6), B(1, 5) and C(7, 2). A line-segment DE is drawn to intersect the sides AB and AC at D and E respectively such that $$\frac{AD}{AB} = \frac{AE}{AC} = \frac{1}{3}$$. Calculate the area of $$\triangle ADE$$ and compare it with area of $$\triangle ABC$$.

Figure 7', 4, 'Similarity', 'long', 11, 'bcaeaa__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-24-0', 'bcaeaa', 23, '24', '24. आकृति 8 में दो समान त्रिज्या के वृत्त, जिनके केन्द्र O तथा O'' हैं परस्पर बिंदु X पर स्पर्श करते हैं। OO'' बढ़ाने पर O'' केन्द्र वाले वृत्त को बिंदु A पर काटता है। बिंदु A से O केन्द्र वाले वृत्त पर AC एक स्पर्श रेखा है तथा O''D $\perp$ AC है। $\frac{DO''}{CO}$ का मान ज्ञात कीजिए।

आकृति 8

In Fig. 8, two equal circles, with centres O and O'', touch each other at X. OO'' produced meets the circle with centre O'' at A. AC is tangent to the circle with centre O, at the point C. O''D is perpendicular to AC. Find the value of $\frac{DO''}{CO}$.

figure 8', 4, 'Similarity', 'long', 12, 'bcaeaa__CBSE_X_Mat_p12_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-25-0', 'bcaeaa', 24, '25', '25. एक मोटर बोट, जिसकी स्थिर जल में चाल 24 किमी/घंटा है, धारा के प्रतिकूल 32 किमी जाने में, वही दूरी धारा के अनुकूल जाने की अपेक्षा 1 घंटा अधिक समय लेती है। धारा की चाल ज्ञात कीजिए।

A motor boat whose speed is 24 km/h in still water takes 1 hour more to go 32 km upstream than to return downstream to the same spot. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 12, NULL, NULL),
  ('MQ-bcaeaa-26-0', 'bcaeaa', 25, '26', '26 आकृति 9 में, O केंद्र वाले वृत्त का एक त्रिज्यखंड OAP दर्शाया गया है जिसका केन्द्र पर अंतरित कोण $\theta$ है। AB वृत्त की त्रिज्या OA पर लंब है जो OP के बढ़ाने पर बिंदु B पर काटता है। सिद्ध कीजिए कि रेखांकित भाग का परिमाप $r\left[\tan\theta + \sec\theta + \frac{\pi\theta}{180} - 1\right]$ है।

आकृति 9

In Fig. 9, is shown a sector OAP of a circle with centre O, containing $\angle \theta$. AB is perpendicular to the radius OA and meets OP produced at B. Prove that the perimeter of shaded region is $r\left[\tan\theta + \sec\theta + \frac{\pi\theta}{180} - 1\right]$

Figure 9', 4, 'Mensuration', 'long', 13, 'bcaeaa__CBSE_X_Mat_p13_img_0_jpeg.webp', NULL),
  ('MQ-bcaeaa-27-0', 'bcaeaa', 26, '27', '27 सिद्ध कीजिए कि किसी बाह्य बिंदु से वृत्त पर खींची गई स्पर्श रेखाएँ लंबाई में समान होती हैं।

Prove that the lengths of the tangents drawn from an external point to a circle are equal.', 4, 'Circles', 'long', 13, NULL, NULL),
  ('MQ-bcaeaa-28-0', 'bcaeaa', 27, '28', '28. एक साथ खोलने पर दो नल एक टंकी को $11\frac{1}{9}$ मिनट में भर देते हैं यदि एक नल दूसरे से 5 मिनट अधिक टंकी को भरने में लगाता है, तो ज्ञात कीजिए कि प्रत्येक नल अलग-अलग टंकी को कितने समय में भरेगा?

Two pipes running together can fill a tank in $11\frac{1}{9}$ minutes. If one pipe takes 5 minutes more than the other to fill the tank separately, find the time in which each pipe would fill the tank separately.', 4, 'Quadratic Equations', 'long', 14, NULL, NULL),
  ('MQ-bcaeaa-29-0', 'bcaeaa', 28, '29', '29. भूमि के एक बिंदु से एक मीनार के शिखर का उन्नयन कोण $60^\circ$ है। प्रेक्षण बिंदु से 40 मी. ऊर्ध्वाधर ऊँचाई पर स्थित एक अन्य बिंदु से मीनार के शिखर का उन्नयन कोण $30^\circ$ है। मीनार की ऊँचाई तथा प्रेक्षण बिंदु से मीनार की क्षैतिज दूरी ज्ञात कीजिए।

From a point on the ground, the angle of elevation of the top of a tower is observed to be $60^\circ$. From a point 40 m vertically above the first point of observation, the angle of elevation of the top of the tower is $30^\circ$. Find the height of the tower and its horizontal distance from the point of observation.', 4, 'Trigonometry', 'long', 14, NULL, NULL),
  ('MQ-bcaeaa-30-0', 'bcaeaa', 29, '30', '30. एक त्रिभुज बनाइए जिसकी भुजाओं की लंबाइयाँ 5 सेमी, 6 सेमी तथा 7 सेमी हैं। फिर एक अन्य त्रिभुज की रचना कीजिए जिसकी भुजाएँ पहली त्रिभुज की संगत भुजाओं का $\frac{4}{5}$ भाग हैं।

Draw a triangle with sides 5 cm, 6 cm and 7 cm. Then draw another triangle whose sides are $\frac{4}{5}$ of the corresponding sides of first triangle.', 4, 'Constructions', 'long', 14, NULL, NULL),
  ('MQ-bcaeaa-31-0', 'bcaeaa', 30, '31', '31. संख्याओं 1, 4, 9, 16 में से कोई एक संख्या $x$ यादृच्छया चुनी गई तथा संख्याओं 1, 2, 3, 4 में से कोई एक संख्या $y$ यादृच्छया चुनी गई। प्रायिकता ज्ञात कीजिए कि $xy$ का मान 16 से अधिक है।

A number $x$ is selected at random from the numbers 1, 4, 9, 16 and another number $y$ is selected at random from the numbers 1, 2, 3, 4. Find the probability that the value of $xy$ is more than 16.', 4, 'Probability', 'long', 15, NULL, NULL),
  ('MQ-27d1a7-1-0', '27d1a7', 0, '1', '1. यदि 30 मी. ऊँची एक मीनार, भूमि पर $10\sqrt{3}$ मी. लंबी छाया बनाती है, तो सूर्य का उन्नयन कोण क्या है ?

If a tower 30 m high, casts a shadow $10\sqrt{3}$ m long on the ground, then what is the angle of elevation of the sun ?', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-27d1a7-2-0', '27d1a7', 1, '2', '2. 900 सेबों के एक ढेर में से यादृच्छया एक सेब चुनने पर सड़ा हुआ सेब निकलने की प्रायिकता 0.18 है। ढेर में सड़े हुए सेबों की संख्या क्या है ?

The probability of selecting a rotten apple randomly from a heap of 900 apples is 0.18. What is the number of rotten apples in the heap ?', 1, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-27d1a7-3-0', '27d1a7', 2, '3', '3. एक समांतर श्रेढ़ी, जिसमें $a_{21} - a_7 = 84$ है, का सार्व अंतर क्या है ?

What is the common difference of an A.P. in which $a_{21} - a_7 = 84$ ?', 1, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-27d1a7-4-0', '27d1a7', 3, '4', '4. यदि एक बाह्य बिंदु P से a त्रिज्या तथा O केन्द्र वाले वृत्त पर खींची गई दो स्पर्श-रेखाओं के बीच का कोण $60^\circ$ हो, तो OP की लंबाई ज्ञात कीजिए।

If the angle between two tangents drawn from an external point P to a circle of radius a and centre O, is $60^\circ$, then find the length of OP.', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-27d1a7-5-0', '27d1a7', 4, '5', '5. एक रेखा y-अक्ष तथा x-अक्ष को क्रमशः बिंदुओं P तथा Q पर प्रतिच्छेद करती है। यदि $(2, -5)$, PQ का मध्य-बिंदु हो, तो P तथा Q के निर्देशांक ज्ञात कीजिए।

A line intersects the y-axis and x-axis at the points P and Q respectively.

If $(2, -5)$ is the mid-point of PQ, then find the coordinates of P and Q.', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-27d1a7-6-0', '27d1a7', 5, '6', '6. यदि $P(x, y)$ की $A(5, 1)$ तथा $B(-1, 5)$ से दूरियाँ समान हों, तो सिद्ध कीजिए कि $3x = 2y$.

If the distances of $P(x, y)$ from $A(5, 1)$ and $B(-1, 5)$ are equal, then prove that $3x = 2y$.', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-27d1a7-7-0', '27d1a7', 6, '7', '7. p का वह मान ज्ञात कीजिए जिसके लिए द्विघात समीकरण $$p x^2 - 14x + 8 = 0$$ का एक मूल दूसरे का 6 गुना है ।

Find the value of p, for which one root of the quadratic equation $$p x^2 - 14x + 8 = 0$$ is 6 times the other.', 2, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-27d1a7-8-0', '27d1a7', 7, '8', '8. सिद्ध कीजिए कि वृत्त की किसी जीवा के अंत बिंदुओं पर खींची गई स्पर्श-रेखाएँ जीवा के साथ समान कोण बनाती हैं ।

Prove that the tangents drawn at the end points of a chord of a circle make equal angles with the chord.', 2, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-27d1a7-9-0', '27d1a7', 8, '9', '9. एक वृत्त किसी चतुर्भुज ABCD की सभी चारों भुजाओं को स्पर्श करता है । सिद्ध कीजिए कि $$AB + CD = BC + DA$$

A circle touches all the four sides of a quadrilateral ABCD. Prove that $$AB + CD = BC + DA$$', 2, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-27d1a7-10-0', '27d1a7', 9, '10', '10. समांतर श्रेढ़ी 8, 14, 20, 26, ... का कौन-सा पद इसके 41वें पद से 72 अधिक होगा ?

Which term of the A.P. 8, 14, 20, 26, ... will be 72 more than its 41$^{st}$ term ?', 2, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-27d1a7-11-0', '27d1a7', 10, '11', '11. एक ठोस लोहे के घनाभ की विमाएँ 4.4 मी. × 2.6 मी. × 1.0 मी. हैं । इसे पिघलाकर 30 सेमी आंतरिक त्रिज्या और 5 सेमी मोटाई का एक खोखला बेलनाकार पाइप बनाया गया है । पाइप की लंबाई ज्ञात कीजिए ।

The dimensions of a solid iron cuboid are 4.4 m × 2.6 m × 1.0 m. It is melted and recast into a hollow cylindrical pipe of 30 cm inner radius and thickness 5 cm. Find the length of the pipe.', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-27d1a7-12-0', '27d1a7', 11, '12', '12. दी गई आकृति में, O केंद्र वाले दो संकेंद्रीय वृत्तों की त्रिज्याएँ 21 सेमी तथा 42 सेमी हैं। यदि ∠ AOB = 60° है, तो छायांकित भाग का क्षेत्रफल ज्ञात कीजिए।

$$[\pi = \frac{22}{7} \text{ प्रयोग कीजिए}]$$

In the given figure, two concentric circles with centre O have radii 21 cm and 42 cm. If ∠ AOB = 60°, find the area of the shaded region.

$$[\text{Use } \pi = \frac{22}{7}]$$', 3, 'Mensuration', 'short', 5, '27d1a7__CBSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-27d1a7-13-0', '27d1a7', 12, '13', '13. 5.4 मी. चौड़ी और 1.8 मी. गहरी एक नहर में पानी 25 किमी/घण्टा की गति से बह रहा है। इससे 40 मिनट में कितने क्षेत्रफल की सिंचाई हो सकती है, यदि सिंचाई के लिए 10 सेमी गहरे पानी की आवश्यकता है ?

Water in a canal, 5.4 m wide and 1.8 m deep, is flowing with a speed of 25 km/hour. How much area can it irrigate in 40 minutes, if 10 cm of standing water is required for irrigation ?', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-27d1a7-x-0', '27d1a7', 13, NULL, 'Three semicircles each of diameter 3 cm, a circle of diameter 4.5 cm and a semicircle of radius 4.5 cm are drawn in the given figure. Find the area of the shaded region.', 3, 'Mensuration', 'short', 6, '27d1a7__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-27d1a7-18-0', '27d1a7', 14, '18', '18. 2.4 सेमी ऊँचाई तथा 0.7 सेमी त्रिज्या के एक ठोस लंब-वृत्तीय बेलन से बेलन के समान ऊँचाई व समान त्रिज्या का एक लंब-वृत्तीय शंकु काट कर निकाल लिया जाता है। बचे हुए ठोस का कुल पृष्ठीय क्षेत्रफल ज्ञात कीजिए।

From a solid right circular cylinder of height 2.4 cm and radius 0.7 cm, a right circular cone of same height and same radius is cut out. Find the total surface area of the remaining solid.', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-27d1a7-19-0', '27d1a7', 15, '19', '19. यदि एक समांतर श्रेढ़ी का 10वाँ पद 52 तथा 17वाँ पद 13वें पद से 20 अधिक है, तो समांतर श्रेढ़ी ज्ञात कीजिए।

If the 10$^{th}$ term of an A.P. is 52 and the 17$^{th}$ term is 20 more than the 13$^{th}$ term, find the A.P.', 3, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-27d1a7-20-0', '27d1a7', 16, '20', '20. यदि x में समीकरण $(c^2 - ab)x^2 - 2(a^2 - bc)x + b^2 - ac = 0$ के मूल बराबर हों, तो दर्शाइए कि या तो $a = 0$ है या $a^3 + b^3 + c^3 = 3abc$ है।

If the roots of the equation $(c^2 - ab)x^2 - 2(a^2 - bc)x + b^2 - ac = 0$ in x are equal, then show that either $a = 0$ or $a^3 + b^3 + c^3 = 3abc$.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-27d1a7-21-0', '27d1a7', 17, '21', '21. यदि बिंदु $A(k + 1, 2k)$, $B(3k, 2k + 3)$ तथा $C(5k - 1, 5k)$ संरेख हों, तो $k$ का मान ज्ञात कीजिए।

If the points $A(k + 1, 2k)$, $B(3k, 2k + 3)$ and $C(5k - 1, 5k)$ are collinear, then find the value of $k$.', 4, 'Coordinate Geometry', 'long', 7, NULL, NULL),
  ('MQ-27d1a7-22-0', '27d1a7', 18, '22', '22. दो विभिन्न पासों को एक साथ फेंका गया। प्रायिकता ज्ञात कीजिए कि प्राप्त संख्याओं का
(i) योगफल सम होगा, और
(ii) गुणनफल सम होगा।

Two different dice are thrown together. Find the probability that the numbers obtained have

(i) even sum, and
(ii) even product.', 4, 'Probability', 'long', 7, NULL, NULL),
  ('MQ-27d1a7-23-0', '27d1a7', 19, '23', '23. एक त्रिभुज ABC की रचना कीजिए जिसमें भुजा $BC = 7$ सेमी, $\angle B = 45^\circ$, $\angle A = 105^\circ$ हो। तब एक अन्य त्रिभुज की रचना कीजिए जिसकी भुजाएँ $\triangle ABC$ की संगत भुजाओं की $\frac{3}{4}$ गुनी हों।

Construct a triangle ABC with side $BC = 7$ cm, $\angle B = 45^\circ$, $\angle A = 105^\circ$. Then construct another triangle whose sides are $\frac{3}{4}$ times the corresponding sides of the $\triangle ABC$.', 4, 'Constructions', 'long', 7, NULL, NULL),
  ('MQ-27d1a7-24-0', '27d1a7', 20, '24', '24. किसी वर्षा-जल संग्रहण तन्त्र में, $22$ मी. $\times$ $20$ मी. की छत से वर्षा-जल बहकर 2 मी. आधार के व्यास तथा 3.5 मी. ऊँचाई के एक बेलनाकार टैंक में आता है। यदि टैंक भर गया हो, तो ज्ञात कीजिए कि सेमी में कितनी वर्षा हुई। जल संरक्षण पर अपने विचार व्यक्त कीजिए।

In a rain-water harvesting system, the rain-water from a roof of $22$ m $\times$ $20$ m drains into a cylindrical tank having diameter of base 2 m and height 3.5 m. If the tank is full, find the rainfall in cm. Write your views on water conservation.', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-27d1a7-25-0', '27d1a7', 21, '25', '25. सिद्ध कीजिए कि वृत्त के किसी बाह्य बिंदु से वृत्त पर खींची गई दो स्पर्श-रेखाओं की लंबाइयाँ समान होती हैं।

Prove that the lengths of two tangents drawn from an external point to a circle are equal.', 4, 'Circles', 'long', 8, NULL, NULL),
  ('MQ-27d1a7-26-0', '27d1a7', 22, '26', '26. दी गई आकृति में, XY तथा X''Y'', O केंद्र वाले वृत्त की दो समांतर स्पर्श-रेखाएँ हैं तथा एक अन्य स्पर्श-रेखा AB, जिसका स्पर्श बिंदु C है, XY को A तथा X''Y'' को B पर प्रतिच्छेद करती है। सिद्ध कीजिए कि ∠AOB = 90°.

In the given figure, XY and X''Y'' are two parallel tangents to a circle with centre O and another tangent AB with point of contact C, is intersecting XY at A and X''Y'' at B. Prove that ∠AOB = 90°.', 4, 'Circles', 'long', 8, '27d1a7__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-27d1a7-27-0', '27d1a7', 23, '27', '27. यदि दो समांतर श्रेढ़ियों के प्रथम n पदों के योगफलों का अनुपात $(7n + 1) : (4n + 27)$ है, तो उनके 9वें पदों का अनुपात ज्ञात कीजिए।

If the ratio of the sum of the first n terms of two A.Ps is $(7n + 1) : (4n + 27)$, then find the ratio of their 9$^{th}$ terms.', 4, 'Arithmetic Progression', 'long', 9, NULL, NULL),
  ('MQ-27d1a7-28-0', '27d1a7', 24, '28', '28. x के लिए हल कीजिए :

$$\frac{1}{2x-3} + \frac{1}{x-5} = 1\frac{1}{9},\ x \neq \frac{3}{2},\ 5$$

Solve for x :

$$\frac{1}{2x-3} + \frac{1}{x-5} = 1\frac{1}{9},\ x \neq \frac{3}{2},\ 5$$', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-27d1a7-29-0', '27d1a7', 25, '29', '29. एक रेलगाड़ी 300 किमी की दूरी एकसमान चाल से तय करती है। यदि रेलगाड़ी की चाल 5 किमी/घंटा बढ़ा दी जाए, तो यात्रा में 2 घंटे कम समय लगता है। रेलगाड़ी की मूल चाल ज्ञात कीजिए।

A train covers a distance of 300 km at a uniform speed. If the speed of the train is increased by 5 km/hour, it takes 2 hours less in the journey. Find the original speed of the train.', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-27d1a7-30-0', '27d1a7', 26, '30', '30. एक मीनार की चोटी से एक व्यक्ति एकसमान चाल से मीनार की ओर आती हुई कार को देखता है। यदि 12 मिनट में कार का अवनमन कोण परिवर्तित होकर $30^\circ$ से $45^\circ$ हो जाता है, तो ज्ञात कीजिए कि अब कितने समय में कार मीनार तक पहुँच जाएगी।

A man observes a car from the top of a tower, which is moving towards the tower with a uniform speed. If the angle of depression of the car changes from $30^\circ$ to $45^\circ$ in 12 minutes, find the time taken by the car now to reach the tower.', 4, 'Trigonometry', 'long', 9, NULL, NULL),
  ('MQ-27d1a7-31-0', '27d1a7', 27, '31', '31. दी गई आकृति में, $\triangle ABC$ एक समकोण त्रिभुज है जिसमें $\angle A, 90^\circ$ है। $AB, AC$ व $BC$ को व्यास मानकर अर्धवृत्त खींचे गए हैं। छायांकित भाग का क्षेत्रफल ज्ञात कीजिए।

In the given figure, $\triangle ABC$ is a right-angled triangle in which $\angle A$ is $90^\circ$. Semicircles are drawn on $AB, AC$ and $BC$ as diameters. Find the area of the shaded region.', 4, 'Mensuration', 'long', 10, '27d1a7__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-46a02f-1-0', '46a02f', 0, '1', '1. For an A.P., if \( a_{18} - a_{14} = 32 \), then find the common difference ''d''?', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-46a02f-2-0', '46a02f', 1, '2', '2. Find the distance of the point P (-6,8) from the origin?', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-46a02f-3-0', '46a02f', 2, '3', '3. Calculate the distance between two parallel tangents of a circle of radius \( 3 \, \text{cm} \).', 1, 'Circles', 'short', 1, NULL, NULL),
  ('MQ-46a02f-4-0', '46a02f', 3, '4', '4. Father''s age is 3 times the sum of ages of his two children. After 5 years his age will be twice the sum of ages of two children. Find the age of father.', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-46a02f-5-0', '46a02f', 4, '5', '5. Solve for \( x \): \( \sqrt{6x + 7} - (2x - 7) = 0 \)', 2, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-46a02f-6-0', '46a02f', 5, '6', '6. Prove that the points \((3,0)\), \((6,4)\) and \((-1,3)\) are the vertices of a right angled isosceles triangle.', 2, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-46a02f-7-0', '46a02f', 6, '7', '7. A card is drawn from a well shuffled deck of 52 cards. Find the probability that the card drawn is neither a red card nor a queen.', 2, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-46a02f-8-0', '46a02f', 7, '8', '8. On dividing \( x^3 - 3x^2 + x + 2 \) by a polynomial \( g(x) \), the quotient and the remainder were (x-2) and (-2x+4), respectively. Find \( g(x) \).', 3, 'Factorisation and Remainder Theorem', 'short', 1, NULL, NULL),
  ('MQ-46a02f-9-0', '46a02f', 8, '9', '9. In a flower bed, there are 23 rose plants in the first row, 21 in the second, 19 in the third and so on. There are 5 rose plants in the last row. How many rows are there in the flower bed?', 3, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-46a02f-10-0', '46a02f', 9, '10', '-10. Find the points on the x-axis, which are at a distance of \( 2\sqrt{5} \) from the point (7,-4)?', 3, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-46a02f-11-0', '46a02f', 10, '11', '-11. In \(\Delta OPQ\), right angled at P, OP = 7cm and OQ - PQ = 1 cm. Determine the values of sin Q and cos Q.', 3, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-46a02f-12-0', '46a02f', 11, '12', '12. In a circular table cover of radius \(32\mathrm{cm}\), a design is formed leaving an equilateral triangle ABC in the middle as shown in the figure. Find the area of the design?', 3, 'Mensuration', 'short', 1, '46a02f__CBSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-46a02f-13-0', '46a02f', 12, '13', '13. In a school, the duration of a period in junior section is 40m in and senior section it is 1 hour. If the first bell for each section rings at 9.00a.m, when will the two bells ring together again.', 4, NULL, 'long', 2, NULL, NULL),
  ('MQ-46a02f-14-0', '46a02f', 13, '14', '14. For which value of ''k'' will the following pair of linear equations have no solution. 3x + y = 1 ; (2k - 1)x + (k - 1)y = 2k + 1', 4, NULL, 'long', 2, NULL, NULL),
  ('MQ-46a02f-15-0', '46a02f', 14, '15', '15. A motor boat whose speed is \( 18\mathrm{km / hr} \) in still water takes 1 hour more to go \( 24\mathrm{km} \) upstream than to return downstream to the same spot. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-46a02f-16-0', '46a02f', 15, '16', '16. From a point \( \mathbf{P} \) on the ground the angle of elevation of the top of a 10m tall building is \( 30^{\circ} \). A flag is hoisted at the top of the building and the angle of elevation of the top of the flagstaff from \( \mathbf{P} \) is \( 45^{\circ} \). Find the length of the flag staff and the distance of the building from the point \( \mathbf{P} \). (\( \sqrt{3} = 1.732 \))', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-46a02f-17-0', '46a02f', 16, '17', '17. A life insurance agent found the following data for distribution of ages of 100 policy holders. calculate the median age, if policies are given only to persons having age 18 years onwards but less than 60 years.

| AGE IN YEARS | NUMBER OF POLICY HOLDERS |
| --- | --- |
| Below 20 | 2 |
| Below 25 | 6 |
| Below 30 | 24 |
| Below 35 | 45 |
| Below 40 | 78 |
| Below 45 | 89 |
| Below 50 | 92 |
| Below 55 | 98 |
| Below 60 | 100 |', 4, 'Statistics', 'long', 2, NULL, NULL),
  ('MQ-46a02f-18-0', '46a02f', 17, '18', '18. A triangle ABC is drawn to circumscribe a circle of radius 4 cm such that the segments BD and DC into which BC is divided by the points of contact D are of length 8 cm and 6cm respectively. Find the sides AB and AC.', 4, 'Circles', 'long', 2, '46a02f__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-4a4144-1-0', '4a4144', 0, '1', 'What is the value of $(\cos^2 67^\circ - \sin^2 23^\circ)$ ?', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-4a4144-2-0', '4a4144', 1, '2', 'In an AP, if the common difference (d) = -4, and the seventh term (a_7) is 4, then find the first term.', 1, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-4a4144-3-0', '4a4144', 2, '3', 'Given $$\triangle ABC \sim \triangle PQR$$, if $$\frac{AB}{PQ} = \frac{1}{3}$$, then find $$\frac{\text{ar } \triangle ABC}{\text{ar } \triangle PQR}$$.', 1, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-4a4144-4-0', '4a4144', 3, '4', 'What is the HCF of smallest prime number and the smallest composite number ?', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-4a4144-5-0', '4a4144', 4, '5', 'Find the distance of a point $$P(x, y)$$ from the origin.', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-4a4144-6-0', '4a4144', 5, '6', 'If $$x = 3$$ is one root of the quadratic equation $$x^2 - 2kx - 6 = 0$$, then find the value of $$k$$.', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-4a4144-7-0', '4a4144', 6, '7', 'Two different dice are tossed together. Find the probability :

- (i) of getting a doublet
- (ii) of getting a sum 10, of the numbers on the two dice.', 2, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-4a4144-8-0', '4a4144', 7, '8', 'Find the ratio in which P(4, m) divides the line segment joining the points A(2, 3) and B(6, -3). Hence find m.', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4a4144-9-0', '4a4144', 8, '9', 'An integer is chosen at random between 1 and 100. Find the probability that it is :

- (i) divisible by 8.
- (ii) not divisible by 8.', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-4a4144-10-0', '4a4144', 9, '10', 'In Fig. 1, ABCD is a rectangle. Find the values of x and y.

Fig. - 1', 2, NULL, 'short', 4, '4a4144__CBSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-4a4144-11-0', '4a4144', 10, '11', 'Find the sum of first 8 multiples of 3.', 2, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-4a4144-12-0', '4a4144', 11, '12', 'Given that $\sqrt{2}$ is irrational, prove that $(5 + 3\sqrt{2})$ is an irrational number.', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-4a4144-13-0', '4a4144', 12, '13', 'If A(-2, 1), B(a, 0), C(4, b) and D(1, 2) are the vertices of a parallelogram ABCD, find the values of a and b. Hence find the lengths of its sides.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-4a4144-13-1', '4a4144', 13, '13', 'If A(-5, 7), B(-4, -5), C(-1, -6) and D(4, 5) are the vertices of a quadrilateral, find the area of the quadrilateral ABCD.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-4a4144-14-0', '4a4144', 14, '14', 'Find all zeroes of the polynomial $(2x^4 - 9x^3 + 5x^2 + 3x - 1)$ if two of its zeroes are $(2 + \sqrt{3})$ and $(2 - \sqrt{3})$.', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-4a4144-15-0', '4a4144', 15, '15', 'Find HCF and LCM of 404 and 96 and verify that $HCF \times LCM =$ Product of the two given numbers.', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-4a4144-16-0', '4a4144', 16, '16', 'Prove that the lengths of tangents drawn from an external point to a circle are equal.', 3, 'Circles', 'short', 6, NULL, NULL),
  ('MQ-4a4144-17-0', '4a4144', 17, '17', 'Prove that the area of an equilateral triangle described on one side of the square is equal to half the area of the equilateral triangle described on one of its diagonal.', 3, 'Similarity', 'short', 6, NULL, NULL),
  ('MQ-4a4144-17-1', '4a4144', 18, '17', 'If the area of two similar triangles are equal, prove that they are congruent.', 3, 'Similarity', 'short', 6, NULL, NULL),
  ('MQ-4a4144-18-0', '4a4144', 19, '18', 'A plane left 30 minutes late than its scheduled time and in order to reach the destination 1500 km away in time, it had to increase its speed by 100 km/h from the usual speed. Find its usual speed.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-4a4144-19-0', '4a4144', 20, '19', '19. नीचे दी गई सारिणी में 280 लोगों का वेतन मान दर्शाया गया है :

| वेतन (हजार □ में) | लोगों की संख्या |
| --- | --- |
| 5 – 10 | 49 |
| 10 – 15 | 133 |
| 15 – 20 | 63 |
| 20 – 25 | 15 |
| 25 – 30 | 6 |
| 30 – 35 | 7 |
| 35 – 40 | 4 |
| 40 – 45 | 2 |
| 45 – 50 | 1 |

उपरोक्त आँकड़ों से माध्यक वेतन मान ज्ञात कीजिए।', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-4a4144-21-0', '4a4144', 21, '21', 'Find the area of the shaded region in Fig. 3, where arcs drawn with centres A, B, C and D intersect in pairs at mid-points P, Q, R and S of the sides AB, BC, CD and DA respectively of a square ABCD of side 12 cm. [Use π = 3.14]

Fig. - 3', 3, 'Mensuration', 'short', 7, '4a4144__CBSE_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-4a4144-22-0', '4a4144', 22, '22', 'If 4 tan θ = 3, evaluate (4 sin θ - cos θ + 1) / (4 sin θ + cos θ - 1)', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-4a4144-22-1', '4a4144', 23, '22', 'If tan 2A = cot (A - 18°), where 2A is an acute angle, find the value of A.', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-4a4144-23-0', '4a4144', 24, '23', 'As observed from the top of a 100 m high light house from the sea-level, the angles of depression of two ships are 30° and 45°. If one ship is exactly behind the other on the same side of the light house, find the distance between the two ships. [Use √3 = 1.732]', 4, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-4a4144-24-0', '4a4144', 25, '24', 'The diameters of the lower and upper ends of a bucket in the form of a frustum of a cone are 10 cm and 30 cm respectively. If its height is 24 cm, find :

- (i) The area of the metal sheet used to make the bucket.
- (ii) Why we should avoid the bucket made by ordinary plastic? [Use π = 3.14]', 4, 'Mensuration', 'long', 8, NULL, NULL),
  ('MQ-4a4144-25-0', '4a4144', 26, '25', 'Prove that : $$\frac{\sin A - 2 \sin^3 A}{2 \cos^3 A - \cos A} = \tan A.$$', 4, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-4a4144-26-0', '4a4144', 27, '26', 'The mean of the following distribution is 18. Find the frequency f of the class 19 – 21.

| Class | 11-13 | 13-15 | 15-17 | 17-19 | 19-21 | 21-23 | 23-25 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 3 | 6 | 9 | 13 | f | 5 | 4 |', 4, 'Statistics', 'long', 9, NULL, NULL),
  ('MQ-4a4144-26-1', '4a4144', 28, '26', 'The following distribution gives the daily income of 50 workers of a factory :

| Daily Income (in ₹) | 100-120 | 120-140 | 140-160 | 160-180 | 180-200 |
| --- | --- | --- | --- | --- | --- |
| Number of workers | 12 | 14 | 8 | 6 | 10 |

Convert the distribution above to a less than type cumulative frequency distribution and draw its ogive.', 4, 'Statistics', 'long', 9, NULL, NULL),
  ('MQ-4a4144-27-0', '4a4144', 29, '27', 'A motor boat whose speed is 18 km/hr in still water takes 1hr more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-4a4144-27-1', '4a4144', 30, '27', 'A train travels at a certain average speed for a distance of 63 km and then travels at a distance of 72 km at an average speed of 6 km/hr more than its original speed. If it takes 3 hours to complete total journey, what is the original average speed ?', 4, 'Quadratic Equations', 'long', 9, NULL, NULL),
  ('MQ-4a4144-28-0', '4a4144', 31, '28', 'The sum of four consecutive numbers in an AP is 32 and the ratio of the product of the first and the last term to the product of two middle terms is 7 : 15. Find the numbers.', 4, 'Arithmetic Progression', 'long', 10, NULL, NULL),
  ('MQ-4a4144-29-0', '4a4144', 32, '29', 'Draw a triangle ABC with BC = 6 cm, AB = 5 cm and ∠ABC = 60°. Then construct a triangle whose sides are 3/4 of the corresponding sides of the ΔABC.', 4, 'Constructions', 'long', 10, NULL, NULL),
  ('MQ-4a4144-30-0', '4a4144', 33, '30', 'In an equilateral ΔABC, D is a point on side BC such that BD = 1/3 BC. Prove that 9(AD)^2 = 7(AB)^2', 4, 'Similarity', 'long', 10, NULL, NULL),
  ('MQ-4a4144-30-1', '4a4144', 34, '30', 'Prove that, in a right triangle, the square on the hypotenuse is equal to the sum of the squares on the other two sides.', 4, 'Similarity', 'long', 10, NULL, NULL),
  ('MQ-fedd3e-1-0', 'fedd3e', 0, '1', '1. आकृति 1 में, $PS = 3$ सेमी, $QS = 4$ सेमी, $\angle PRQ = \theta$ , $\angle PSQ = 90^\circ$ , $PQ \perp RQ$ तथा $RQ = 9$ सेमी है। $\tan \theta$ का मान ज्ञात कीजिए।

आकृति 1

अथवा

यदि $\tan \alpha = \frac{5}{12}$ है, तो $\sec \alpha$ का मान ज्ञात कीजिए।

30/3/3

YEARS
QUESTION PAPER.COM

CBSE BOARD X

10YearsQuestionPaper.com
In Figure 1, PS = 3 cm, QS = 4 cm, ∠PRQ = 0, ∠PSQ = 90°, PQ ⊥ RQ and RQ = 9 cm. Evaluate tan θ.

Figure 1

OR

If tan α = 5/12, find the value of sec α.', 1, 'Trigonometry', 'short', 2, 'fedd3e__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-fedd3e-2-0', 'fedd3e', 1, '2', '2. त्रिज्याएँ a तथा b (a > b) के दो संकेन्द्री वृत्त दिए गए हैं। बड़े वृत्त की जीवा, जो छोटे वृत्त की स्पर्श-रेखा है, की लम्बाई ज्ञात कीजिए।

Two concentric circles of radii a and b (a > b) are given. Find the length of the chord of the larger circle which touches the smaller circle.', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-fedd3e-3-0', 'fedd3e', 2, '3', '3. यदि बिंदु A(0, 0) तथा बिंदु B(x, -4) के बीच की दूरी 5 इकाई है, तो x के मान ज्ञात कीजिए।

Find the value(s) of x, if the distance between the points A(0, 0) and B(x, -4) is 5 units.', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-fedd3e-4-0', 'fedd3e', 3, '4', '4. ज्ञात कीजिए कि संख्या 27/2^3.5^4.3^2 के दशमलव रूप का दशमलव के कितने स्थानों के बाद अंत होगा।

अथवा

संख्या 429 को इसके अभाज्य गुणनखण्डों के गुणनफल के रूप में व्यक्त कीजिए।

Find after how many places of decimal the decimal form of the number

27/2^3.5^4.3^2 will terminate.

OR

Express 429 as a product of its prime factors.', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-fedd3e-5-0', 'fedd3e', 4, '5', '5. द्विघात समीकरण (x + 5)^2 = 2(5x - 3) का विविक्तकर (discriminant) लिखिए।

Write the discriminant of the quadratic equation (x + 5)^2 = 2(5x - 3).', 1, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-fedd3e-6-0', 'fedd3e', 5, '6', '6. 3 के प्रथम 10 गुणजों का योगफल ज्ञात कीजिए।

Find the sum of the first 10 multiples of 3.', 1, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-fedd3e-7-0', 'fedd3e', 6, '7', '7. यदि 65 तथा 117 के म.स. (HCF) को 65n - 117 के रूप में दर्शाया जा सकता है, तो n का मान ज्ञात कीजिए।

अथवा

तीन लोग सुबह की सैर के लिए एक साथ बाहर निकले और उनके कदम की लम्बाई क्रमशः 30 cm, 36 cm तथा 40 cm है। प्रत्येक को न्यूनतम कितनी दूरी तय करनी होगी कि सभी अपने पूर्ण कदमों में समान दूरी चले?

If HCF of 65 and 117 is expressible in the form 65n - 117, then find the value of n.

OR

On a morning walk, three persons step out together and their steps measure 30 cm, 36 cm and 40 cm respectively. What is the minimum distance each should walk so that each can cover the same distance in complete steps?', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-fedd3e-8-0', 'fedd3e', 7, '8', '8. एक पासे को एक बार फेंका जाता है। प्रायिकता ज्ञात कीजिए (i) प्राप्त संख्या एक भाज्य संख्या है, (ii) प्राप्त संख्या एक अभाज्य संख्या है।

A die is thrown once. Find the probability of getting (i) a composite number, (ii) a prime number.', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-fedd3e-9-0', 'fedd3e', 8, '9', '9. पूर्ण वर्ग बनाने की विधि का प्रयोग करते हुए दर्शाइए कि समीकरण $$x^2 - 8x + 18 = 0$$ का कोई हल नहीं है।

Using completing the square method, show that the equation $$x^2 - 8x + 18 = 0$$ has no solution.', 2, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-fedd3e-10-0', 'fedd3e', 9, '10', '10. कार्ड जिन पर 7 से 40 तक की संख्याएँ लिखी हैं, एक पेटी में रखे हुए हैं। पूनम उनमें से एक कार्ड यादृच्छया निकालती है। प्रायिकता ज्ञात कीजिए कि पूनम द्वारा निकाले गए कार्ड पर अंकित संख्या 7 का एक गुणज है।

Cards numbered 7 to 40 were put in a box. Poonam selects a card at random. What is the probability that Poonam selects a card which is a multiple of 7?', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-fedd3e-11-0', 'fedd3e', 10, '11', '11. निम्न रैखिक समीकरण युग्म को हल कीजिए :

$$3x + 4y = 10$$

$$2x - 2y = 2$$

Solve the following pair of linear equations :

$$3x + 4y = 10$$

$$2x - 2y = 2$$', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-fedd3e-12-0', 'fedd3e', 11, '12', '12. बिंदु A(3, 1), B(5, 1), C(a, b) तथा D(4, 3) एक समांतर चतुर्भुज ABCD के शीर्ष बिंदु हैं। a तथा b के मान ज्ञात कीजिए।

अथवा

बिंदुओं A(-2, 0) तथा B(0, 8) को जोड़ने वाले रेखाखंड को बिंदु P तथा बिंदु Q समविभाजित करते हैं, जहाँ P बिंदु A के निकट है। बिंदुओं P तथा Q के निर्देशांक ज्ञात कीजिए।

Points A(3, 1), B(5, 1), C(a, b) and D(4, 3) are vertices of a parallelogram ABCD. Find the values of a and b.

OR

Points P and Q trisect the line segment joining the points A(-2, 0) and B(0, 8) such that P is near to A. Find the coordinates of points P and Q.', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-fedd3e-13-0', 'fedd3e', 12, '13', '13. किसी कक्षा अध्यापिका ने पूरे सत्र के लिए अपनी कक्षा के 40 विद्यार्थियों की अनुपस्थिति निम्नलिखित रूप में रिकॉर्ड की। एक विद्यार्थी जितने दिन अनुपस्थित रहा उनका माध्य ज्ञात कीजिए।

| दिनों की संख्या : | 0 – 6 | 6 – 12 | 12 – 18 | 18 – 24 | 24 – 30 | 30 – 36 | 36 – 42 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| विद्यार्थियों की संख्या : | 10 | 11 | 7 | 4 | 4 | 3 | 1 |

A class teacher has the following absentee record of 40 students of a class for the whole term. Find the mean number of days a student was absent.

| Number of days : | 0 – 6 | 6 – 12 | 12 – 18 | 18 – 24 | 24 – 30 | 30 – 36 | 36 – 42 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of students : | 10 | 11 | 7 | 4 | 4 | 3 | 1 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-fedd3e-14-0', 'fedd3e', 13, '14', '14. आकृति 2 में, 5 सेमी त्रिज्या के एक वृत्त की 8 सेमी लंबी एक जीवा PQ है। P और Q पर स्पर्श-रेखाएँ परस्पर एक बिंदु T पर प्रतिच्छेद करती हैं। TP की लंबाई ज्ञात कीजिए।

आकृति 2
अथवा

सिद्ध कीजिए कि वृत्त के परिगत बनी चतुर्भुज की आमने-सामने की भुजाएँ, वृत्त के केन्द्र पर संपूरक कोण अंतरित करती हैं।

In Figure 2, PQ is a chord of length 8 cm of a circle of radius 5 cm. The tangents at P and Q intersect at a point T. Find the length TP.

Figure 2
OR

Prove that opposite sides of a quadrilateral circumscribing a circle subtend supplementary angles at the centre of the circle.', 3, 'Circles', 'short', 6, 'fedd3e__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-fedd3e-15-0', 'fedd3e', 14, '15', '15. A, B और C त्रिभुज ABC के अंतः कोण हैं। दिखाइए कि

(i) $$\sin\left(\frac{B+C}{2}\right) = \cos\frac{A}{2}$$

(ii) यदि $$\angle A = 90^\circ$$ है, तो $$\tan\left(\frac{B+C}{2}\right)$$ का मान ज्ञात कीजिए।

अथवा

30/3/3

YEARS
QUESTION PAPER.COM

CBSE BOARD X

10YearsQuestionPaper.com
यदि $\tan (A + B) = 1$ तथा $\tan (A - B) = \frac{1}{\sqrt{3}}$ है, जहाँ $0^\circ < A + B < 90^\circ, A > B$ है, तो A तथा B के मान ज्ञात कीजिए।

A, B and C are interior angles of a triangle ABC. Show that

(i) $\sin\left(\frac{B+C}{2}\right) = \cos\frac{A}{2}$

(ii) If $\angle A = 90^\circ$ , then find the value of $\tan\left(\frac{B+C}{2}\right)$ .

**OR**

If $\tan (A + B) = 1$ and $\tan (A - B) = \frac{1}{\sqrt{3}}, 0^\circ < A + B < 90^\circ, A > B$ , then find the values of A and B.', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-fedd3e-16-0', 'fedd3e', 15, '16', '16. सिद्ध कीजिए कि $\sqrt{3}$ एक अपरिमेय संख्या है।

**अथवा**

वह बड़ी-से-बड़ी संख्या ज्ञात कीजिए जिससे संख्याओं 1251, 9377 तथा 15628 को भाग करने पर क्रमशः 1, 2 तथा 3 शेषफल आता है।

Prove that $\sqrt{3}$ is an irrational number.

**OR**

Find the largest number which on dividing 1251, 9377 and 15628 leaves remainders 1, 2 and 3 respectively.', 3, NULL, 'short', 7, NULL, NULL),
  ('MQ-fedd3e-17-0', 'fedd3e', 16, '17', '17. समीकरणों $x - y + 1 = 0$ और $3x + 2y - 12 = 0$ का ग्राफ खींचिए। ग्राफ द्वारा, $x$ और $y$ के दोनों समीकरणों को संतुष्ट करने वाले मान ज्ञात कीजिए।

Draw the graph of the equations $x - y + 1 = 0$ and $3x + 2y - 12 = 0$ . Using this graph, find the values of $x$ and $y$ which satisfy both the equations.', 3, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-fedd3e-18-0', 'fedd3e', 17, '18', '18. 6 मी. चौड़ी और 1.5 मी. गहरी एक नहर में पानी 10 किमी/घं. की चाल से बह रहा है। 30 मिनट में, यह नहर कितने क्षेत्रफल की सिंचाई कर पाएगी जबकि सिंचाई के लिए 8 सेमी गहरे ठहरे हुए पानी की आवश्यकता होती है?

Water in a canal, 6 m wide and 1.5 m deep, is flowing with a speed of 10 km/h. How much area will it irrigate in 30 minutes if 8 cm of standing water is needed?', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-fedd3e-19-0', 'fedd3e', 18, '19', '19. किसी त्रिभुज ABC के शीर्ष A से भुजा BC पर डाला गया लम्ब BC को बिंदु D पर इस प्रकार मिलता है कि $DB = 3CD$ है। सिद्ध कीजिए कि $2AB^2 = 2AC^2 + BC^2$ .

**अथवा**

30/3/3

P.T.O.

YEARS
QUESTION PAPER.COM

CBSE BOARD X

10YearsQuestionPaper.com
AD और PM त्रिभुजों ABC और PQR की क्रमशः माध्यिकाएँ हैं जबकि $\Delta ABC \sim \Delta PQR$ है। सिद्ध कीजिए कि $\frac{AB}{PQ} = \frac{AD}{PM}$ है।

The perpendicular from A on side BC of a $\Delta ABC$ meets BC at D such that $DB = 3CD$ . Prove that $2AB^2 = 2AC^2 + BC^2$ .

OR

AD and PM are medians of triangles ABC and PQR respectively where $\Delta ABC \sim \Delta PQR$ . Prove that $\frac{AB}{PQ} = \frac{AD}{PM}$ .', 3, 'Similarity', 'short', 7, NULL, NULL),
  ('MQ-fedd3e-20-0', 'fedd3e', 19, '20', '20. 14 सेमी त्रिज्या वाले एक वृत्त की कोई जीवा केंद्र पर $60^\circ$ का कोण अंतरित करती है। संगत लघु वृत्तखण्ड का क्षेत्रफल ज्ञात कीजिए। ( $\pi = \frac{22}{7}$ तथा $\sqrt{3} = 1.73$ का प्रयोग कीजिए)

A chord of a circle of radius 14 cm subtends an angle of $60^\circ$ at the centre. Find the area of the corresponding minor segment of the circle. (Use $\pi = \frac{22}{7}$ and $\sqrt{3} = 1.73$ )', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-fedd3e-21-0', 'fedd3e', 20, '21', '21. k का वह मान ज्ञात कीजिए, जिससे $A(k + 1, 1)$ , $B(4, -3)$ तथा $C(7, -k)$ से बनी त्रिभुज ABC का क्षेत्रफल 6 वर्ग इकाई हो।

Find the value of k so that the area of triangle ABC with $A(k + 1, 1)$ , $B(4, -3)$ and $C(7, -k)$ is 6 square units.', 3, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-fedd3e-22-0', 'fedd3e', 21, '22', '22. यदि बहुपद $ax^2 + 7x + b$ के शून्य $\frac{2}{3}$ तथा $-3$ हैं, तो a तथा b के मान ज्ञात कीजिए।

If $\frac{2}{3}$ and $-3$ are the zeroes of the polynomial $ax^2 + 7x + b$ , then find the values of a and b.', 3, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-fedd3e-23-0', 'fedd3e', 22, '23', '23. नीचे दिए गए बंटन को ''से अधिक प्रकार'' के बंटन में बदलिए और फिर उस बंटन का ''से अधिक प्रकार'' का तोरण खींचिए।

| वर्ग अंतराल : | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| बारंबारता : | 10 | 8 | 12 | 24 | 6 | 25 | 15 |

3/3

YEARS
QUESTION PAPER.COM

CBSE BOARD X

10YearsQuestionPaper.com
Change the following distribution to a ''more than type'' distribution. Hence draw the ''more than type'' of the type distribution.

| Class interval : | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency : | 10 | 8 | 12 | 24 | 6 | 25 | 15 |', 4, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-fedd3e-24-0', 'fedd3e', 23, '24', '24. एक समतल जमीन पर बड़ी गीला की छाया उस स्थिति में 40 मी. अधिक लंबी हो जाती है जबकि पूर्व का उन्नयन (altitude) 60° से घटकर 30° हो जाता है। गीला की ऊँचाई ज्ञात कीजिए। (दिया गया है: $\sqrt{3} = 1732$)

The shadow of a tower standing on a level ground is found to be 40 m longer when the Sun''s altitude is 30° than when it was 60°. Find the height of the tower. (Given $\sqrt{3} = 1732$)', 4, 'Trigonometry', 'long', 9, NULL, NULL),
  ('MQ-fedd3e-25-0', 'fedd3e', 24, '25', '25. यदि किसी चित्र की एक मृदा के समान अन्य दो मृदाओं को चित्र-चित्र सिद्धों पर प्रतिपादित करने के लिए एक चित्र खींची जाए, तो सिद्ध कीजिए कि वे अन्य दो मृदाएँ एक ही अनुपात में विभाजित हो जाती हैं।

अभ्यास

सिद्ध कीजिए कि एक समतल चित्र में कर्ण का वर्ग शेष दो मृदाओं के वर्ण के योगफल के बराबर होता है।

If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, prove that the other two sides are divided in the same ratio.

OR

Prove that in a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.', 4, 'Similarity', 'long', 9, NULL, NULL),
  ('MQ-fedd3e-26-0', 'fedd3e', 25, '26', '26. यदि किसी समान श्रेणी के $m$ में पद का $m$ गुण, इसके $m$ में पद के $n$ गुण के बराबर हो $(m + n)$, तो दर्शाइए कि समान श्रेणी का $(m + n)$ में पद युग्म होगा।

अभ्यास

किसी समान श्रेणी की प्रथम तीन संख्याओं का योगफल 18 है। यदि पहले और तीसरे पद का गुणफल चार्ज अंश का 5 गुण हो, तो तीनों संख्याओं को ज्ञात कीजिए।

If $m$ times the $m^{th}$ term of an Arithmetic Progression is equal to $n$ times its $n^{th}$ term and $m + n$, show that the $(m + n)^{th}$ term of the A.P. is zero.

OR

The sum of the first three numbers in an Arithmetic Progression is 18. If the product of the first and the third term is 5 times the common difference, find the three numbers.', 4, 'Arithmetic Progression', 'long', 9, NULL, NULL),
  ('MQ-fedd3e-27-0', 'fedd3e', 26, '27', '27. आकृति 3 में, सजावट के लिए बना एक ब्लॉक दर्शाया गया है जो दो ठोसों – एक घन तथा एक अर्धगोले से बना है। ब्लॉक का आधार एक 6 सेमी भुजा का घन है तथा उसके ऊपर एक अर्धगोला है जिसका व्यास 4.2 सेमी है। ज्ञात कीजिए

- (a) ब्लॉक का कुल पृष्ठीय क्षेत्रफल।
- (b) बने हुए ब्लॉक का आयतन।

$$\left( \pi = \frac{22}{7} \text{ लीजिए} \right)$$

आकृति 3

अथवा

ऊपर से खुली एक बाल्टी शंकु के छिन्नक के आकार की है जिसकी धारिता 12308.8 सेमी$^{3}$ है। उसके ऊपरी तथा निचले वृत्ताकार सिरों की त्रिज्याएँ क्रमशः 20 सेमी तथा 12 सेमी हैं। बाल्टी की ऊँचाई ज्ञात कीजिए तथा बाल्टी को बनाने में लगी धातु की चादर का क्षेत्रफल ज्ञात कीजिए। ( $\pi = 3.14$ का प्रयोग कीजिए)

In Figure 3, a decorative block is shown which is made of two solids, a cube and a hemisphere. The base of the block is a cube with edge 6 cm and the hemisphere fixed on the top has a diameter of 4.2 cm. Find

- (a) the total surface area of the block.
- (b) the volume of the block formed. (Take $\pi = \frac{22}{7}$ )

Figure 3

OR

30/3/3

YEARS
QUESTION PAPER.COM

CBSE BOARD X

10YearsQuestionPaper.com
A bucket open at the top is in the form of a frustum of a cone with a capacity of $12308.8 \text{ cm}^3$. The radii of the top and bottom circular ends are 20 cm and 12 cm respectively. Find the height of the bucket and the area of metal sheet used in making the bucket. (Use $\pi = 3.14$)', 4, 'Mensuration', 'long', 10, 'fedd3e__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-fedd3e-28-0', 'fedd3e', 27, '28', '28. एक त्रिभुज की रचना कीजिए जिसकी भुजाओं की लंबाइयाँ 5 सेमी, 6 सेमी तथा 7 सेमी हैं। अब एक अन्य त्रिभुज की रचना कीजिए जिसकी भुजाएँ पहली त्रिभुज की संगत भुजाओं की $\frac{5}{7}$ गुनी हों।

Construct a triangle, the lengths of whose sides are 5 cm, 6 cm and 7 cm. Now construct another triangle whose sides are $\frac{5}{7}$ times the corresponding sides of the first triangle.', 4, 'Constructions', 'long', 11, NULL, NULL),
  ('MQ-fedd3e-29-0', 'fedd3e', 28, '29', '29. सिद्ध कीजिए कि :

$$\frac{\tan^3 \theta}{1 + \tan^2 \theta} + \frac{\cot^3 \theta}{1 + \cot^2 \theta} = \sec \theta \text{ cosec } \theta - 2 \sin \theta \cos \theta.$$

Prove that :

$$\frac{\tan^3 \theta}{1 + \tan^2 \theta} + \frac{\cot^3 \theta}{1 + \cot^2 \theta} = \sec \theta \text{ cosec } \theta - 2 \sin \theta \cos \theta.$$', 4, 'Trigonometry', 'long', 11, NULL, NULL),
  ('MQ-fedd3e-30-0', 'fedd3e', 29, '30', '30. एक मोटर बोट, जिसकी स्थिर जल में चाल 9 किमी/घंटा है, 15 किमी धारा के अनुकूल जाने तथा वापस उसी स्थान पर लौट आने में कुल 3 घंटे 45 मिनट का समय लेती है। धारा की चाल ज्ञात कीजिए।

A motorboat whose speed in still water is 9 km/h, goes 15 km downstream and comes back to the same spot, in a total time of 3 hours 45 minutes. Find the speed of the stream.', 4, 'Quadratic Equations', 'long', 11, NULL, NULL),
  ('MQ-f7562d-1-0', 'f7562d', 0, '1', '1. The number of zeroes for a polynomial p(x) where graph of y = p(x) is given in Figure-1, is', 1, 'Quadratic Equations', 'MCQ', 3, 'f7562d__CBSE_X_Mat_p3_img_0_jpeg.webp', array['3', '4', '0', '5']::text[]),
  ('MQ-f7562d-2-0', 'f7562d', 1, '2', '2. The first term of an A.P. is 5 and the last term is 4 terms is 400, the number of terms is
and', 1, 'Arithmetic Progression', 'MCQ', 5, NULL, array['20', '8', '10', '16']::text[]),
  ('MQ-f7562d-2-1', 'f7562d', 2, '2', 'The 9th term of the A.P. - 15, - 11, - 7, ..., 49 is', 1, 'Arithmetic Progression', 'MCQ', 5, NULL, array['32', '0', '17', '13']::text[]),
  ('MQ-f7562d-3-0', 'f7562d', 3, '3', '3. It is being given that the points A(1, 2), B(0, 0) and C(a, b) are collinear. Which of the following relations between a and b is true?', 1, 'Coordinate Geometry', 'MCQ', 5, NULL, array['a = 2b', '2a = b', 'a + b = 0', 'a - b = 0']::text[]),
  ('MQ-f7562d-4-0', 'f7562d', 4, '4', '4. In Figure-2, TP and TQ are tangents drawn to the circle with centre at O. If ∠POQ = 115° then ∠PTQ is', 1, 'Circles', 'MCQ', 5, 'f7562d__CBSE_X_Mat_p5_img_0_jpeg.webp', array['115°', '57.5°', '55°', '65°']::text[]),
  ('MQ-f7562d-4-1', 'f7562d', 5, '4', 'From an external point Q, the length of the tangent to a circle is 5 cm and the distance of Q from the centre is 8 cm. The radius of the circle is', 1, 'Circles', 'MCQ', 7, NULL, array['\(39 \mathrm{~cm}\)', '\(3 \mathrm{~cm}\)', '\(\sqrt{39} \mathrm{~cm}\)', '\(7 \mathrm{~cm}\)']::text[]),
  ('MQ-f7562d-5-0', 'f7562d', 6, '5', '5. The value of θ for which cos (10° + θ) = sin 30°, is', 1, 'Trigonometry', 'MCQ', 7, NULL, array['\(50^{\circ}\)', '\(40^{\circ}\)', '\(80^{\circ}\)', '\(20^{\circ}\)']::text[]),
  ('MQ-f7562d-6-0', 'f7562d', 7, '6', '6. A bag contains 3 red, 5 black and 7 white balls. A ball is drawn from the bag at random. The probability that the ball drawn is not black, is', 1, 'Probability', 'MCQ', 7, NULL, array['\(\frac{1}{3}\)', '\(\frac{9}{15}\)', '\(\frac{5}{10}\)', '\(\frac{2}{3}\)']::text[]),
  ('MQ-f7562d-7-0', 'f7562d', 8, '7', '7. The pair of linear equations y = 0 and y = - 6 has', 1, NULL, 'MCQ', 7, NULL, array['a unique solution', 'no solution', 'infinitely many solutions', 'only solution \((0,0)\)']::text[]),
  ('MQ-f7562d-8-0', 'f7562d', 9, '8', '8. The mean and median of a distribution are 14 and 15 respectively. The value of mode is', 1, 'Statistics', 'MCQ', 9, NULL, array['16', '17', '18', '13']::text[]),
  ('MQ-f7562d-9-0', 'f7562d', 10, '9', '9. The quadratic equation $$x^2 - 4x + k = 0$$ has distinct real roots if', 1, 'Quadratic Equations', 'MCQ', 9, NULL, array['k = 4', 'k > 4', 'k = 16', 'k < 4']::text[]),
  ('MQ-f7562d-10-0', 'f7562d', 11, '10', '10. Point $$P\left(\frac{a}{8}, 4\right)$$ is the mid-point of the line segment joining the points A(- 5, 2) and B(4, 6). The value of ''a'' is', 1, 'Coordinate Geometry', 'MCQ', 9, NULL, array['-4', '4', '-8', '-2']::text[]),
  ('MQ-f7562d-11-0', 'f7562d', 12, '11', '11. $$\left(\frac{2 + \sqrt{5}}{3}\right)$$ is ________ number.', 1, NULL, 'short', 9, NULL, NULL),
  ('MQ-f7562d-12-0', 'f7562d', 13, '12', '12. Let $$\Delta ABC \sim \Delta DEF$$ and their areas be respectively 81 cm² and 144 cm². If EF = 24 cm, then length of side BC is ________ cm.', 1, 'Similarity', 'short', 9, NULL, NULL),
  ('MQ-f7562d-13-0', 'f7562d', 14, '13', '13. The distance between the points (a, b) and (- a, - b) is', 1, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-f7562d-14-0', 'f7562d', 15, '14', '14. If tan A = 1, then 2 sin A cos A = ___', 1, 'Trigonometry', 'short', 9, NULL, NULL),
  ('MQ-f7562d-15-0', 'f7562d', 16, '15', '15. A spherical metal ball of radius 8 cm is melted to make 8 smaller identical balls. The radius of each new ball is ________ cm.', 1, 'Mensuration', 'short', 9, NULL, NULL),
  ('MQ-f7562d-16-0', 'f7562d', 17, '16', '16. Given that HCF (135, 225) = 45, find the LCM (135, 225).', 1, NULL, 'short', 11, NULL, NULL),
  ('MQ-f7562d-17-0', 'f7562d', 18, '17', '17. In Figure-3, a tightly stretched rope of length \(20\mathrm{m}\) is tied from the top of a vertical pole to the ground. Find the height of the pole if the angle made by the rope with the ground is \(30^{\circ}\).', 1, 'Trigonometry', 'short', 11, 'f7562d__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-f7562d-18-0', 'f7562d', 19, '18', '18. Two dice are thrown simultaneously. What is the probability that the sum of the two numbers appearing on the top is 13₹', 1, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-f7562d-19-0', 'f7562d', 20, '19', '19. After how many decimal places will the decimal representation of the rational number \(\frac{229}{2^2 \times 5^7}\) terminate₹', 1, NULL, 'short', 11, NULL, NULL),
  ('MQ-f7562d-20-0', 'f7562d', 21, '20', '20. In Figure-4, AB and CD are common tangents to circles which touch each other at D. If \( \mathrm{AB} = 8 \) cm, then find the length of CD.', 1, 'Circles', 'short', 11, 'f7562d__CBSE_X_Mat_p11_img_1_jpeg.webp', NULL),
  ('MQ-f7562d-21-0', 'f7562d', 22, '21', '21. Solve for x :

$$6x^2 + 11x + 3 = 0$$', 2, 'Quadratic Equations', 'short', 13, NULL, NULL),
  ('MQ-f7562d-22-0', 'f7562d', 23, '22', '22. The perimeters of two similar triangles are 30 cm and 20 cm respectively. If one side of the first triangle is 9 cm long, find the length of the corresponding side of the second triangle.', 2, 'Similarity', 'short', 13, NULL, NULL),
  ('MQ-f7562d-22-1', 'f7562d', 24, '22', 'In Figure-5, $\Delta$ PQR is right-angled at P. M is a point on QR such that PM is perpendicular to QR. Show that $PQ^2 = QM \times QR$.', 2, 'Similarity', 'short', 13, 'f7562d__CBSE_X_Mat_p13_img_0_jpeg.webp', NULL),
  ('MQ-f7562d-23-0', 'f7562d', 25, '23', '23. Evaluate :

$$\left(\frac{\sin 47^\circ}{\cos 43^\circ}\right)^2 + \left(\frac{\cos 30^\circ}{\cot 30^\circ}\right)^2 - (\sin 60^\circ)^2$$', 2, 'Trigonometry', 'short', 13, NULL, NULL),
  ('MQ-f7562d-24-0', 'f7562d', 26, '24', '24. Find the mode of the following distribution :

| Classes : | 0 – 20 | 20 – 40 | 40 – 60 | 60 – 80 | 80 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency : | 10 | 8 | 12 | 16 | 4 |', 2, 'Statistics', 'short', 13, NULL, NULL),
  ('MQ-f7562d-24-1', 'f7562d', 27, '24', 'From the following distribution, find the median :

| Classes : | 500 – 600 | 600 – 700 | 700 – 800 | 800 – 900 | 900 – 1000 |
| --- | --- | --- | --- | --- | --- |
| Frequency : | 36 | 32 | 32 | 20 | 30 |', 2, 'Statistics', 'short', 13, NULL, NULL),
  ('MQ-f7562d-25-0', 'f7562d', 28, '25', '25. In Figure-6, a tent is in the shape of a cylinder surmounted by a conical top. The cylindrical part is 2·1 m high and conical part has slant height 2·8 m. Both the parts have same radius 2 m. Find the area of the canvas used to make the tent. (Use $$\pi = \frac{22}{7}$$)', 2, 'Mensuration', 'short', 15, 'f7562d__CBSE_X_Mat_p15_img_0_jpeg.webp', NULL),
  ('MQ-f7562d-26-0', 'f7562d', 29, '26', '# 26. Tree Plantation Drive

A Group Housing Society has 600 members, who have their houses in the campus and decided to hold a Tree Plantation Drive on the occasion of New Year. Each household was given the choice of planting a sampling of its choice. The number of different types of saplings planted were :

(i) Neem-125
(ii) Peepal-165
(iii) Creepers - 50
(iv) Fruit plants - 150
(v) Flowering plants - 110

On the opening ceremony, one of the plants is selected randomly for a prize. After reading the above passage, answer the following questions.

What is the probability that the selected plant is

(i) A fruit plant or a flowering plant?
(ii) Either a Neem plant or a Peepal plant?', 2, 'Probability', 'short', 15, NULL, NULL),
  ('MQ-f7562d-27-0', 'f7562d', 30, '27', '27. Prove that \(\sqrt{5}\) is an irrational number.', 3, NULL, 'short', 17, NULL, NULL),
  ('MQ-f7562d-28-0', 'f7562d', 31, '28', '28. The sum of the first 30 terms of an A.P. is 1920. If the fourth term is 18, find its \(11^{\text{th}}\) term.', 3, 'Arithmetic Progression', 'short', 17, NULL, NULL),
  ('MQ-f7562d-29-0', 'f7562d', 32, '29', '29. Find the co-ordinates of the points of trisection of the line segment joining the points \((3, -1)\) and \((6, 8)\).', 3, 'Coordinate Geometry', 'short', 17, NULL, NULL),
  ('MQ-f7562d-29-1', 'f7562d', 33, '29', 'Find the area of a quadrilateral ABCD having vertices at A(1, 2), B(1, 0), C(4, 0) and D(4, 4).', 3, 'Coordinate Geometry', 'short', 17, NULL, NULL),
  ('MQ-f7562d-30-0', 'f7562d', 34, '30', '30. In Figure-7, XY and MN are two parallel tangents to a circle with centre O and another tangent AB with point of contact C intersecting XY at A and MN at B. Prove that ∠ AOB = 90°.', 3, 'Circles', 'short', 17, 'f7562d__CBSE_X_Mat_p17_img_0_jpeg.webp', NULL),
  ('MQ-f7562d-31-0', 'f7562d', 35, '31', '31. Solve the pair of equations :

$$\frac{2}{x} + \frac{3}{y} = 11, \frac{5}{x} - \frac{4}{y} = -7$$

Hence, find the value of 5x - 3y.', 3, NULL, 'short', 17, NULL, NULL),
  ('MQ-f7562d-31-1', 'f7562d', 36, '31', 'Taxi charges in a city consist of fixed charges and the remaining charges depend upon the distance travelled. For a journey of 10 km, the charge paid is ₹ 75 and for a journey of 15 km, the charge paid is ₹ 110. Find the fixed charge and charges per km. Hence, find the charge of covering a distance of 35 km.', 3, NULL, 'short', 19, NULL, NULL),
  ('MQ-f7562d-32-0', 'f7562d', 37, '32', '32. Prove that :

$$\frac{\sin \theta - \cos \theta + 1}{\cos \theta + \sin \theta - 1} = \frac{1}{\sec \theta - \tan \theta}$$', 3, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-f7562d-33-0', 'f7562d', 38, '33', '33. In Figure-8, find the area of the shaded region where a circular arc of radius 7 cm has been drawn with vertex O of an equilateral triangle OAB of side 14 cm as centre. (Use $$\pi = \frac{22}{7}$$ and $$\sqrt{3} = 1.73$$)', 3, 'Mensuration', 'short', 19, 'f7562d__CBSE_X_Mat_p19_img_0_jpeg.webp', NULL),
  ('MQ-f7562d-34-0', 'f7562d', 39, '34', '34. Construct a triangle with sides 5 cm, 6 cm and 7 cm. Now construct another triangle whose sides are $$\frac{2}{3}$$ times the corresponding sides of the first triangle.', 3, 'Constructions', 'short', 19, NULL, NULL),
  ('MQ-f7562d-34-1', 'f7562d', 40, '34', 'Draw a pair of tangents to a circle of radius 3 cm which are inclined to each other at an angle of 60°.', 3, 'Constructions', 'short', 19, NULL, NULL),
  ('MQ-f7562d-35-0', 'f7562d', 41, '35', '35. In a flight of 600 km, the speed of the aircraft was slowed down due to bad weather. The average speed of the trip was decreased by 200 km/hr and thus the time of flight increased by 30 minutes. Find the average speed of the aircraft originally.', 4, 'Quadratic Equations', 'long', 21, NULL, NULL),
  ('MQ-f7562d-35-1', 'f7562d', 42, '35', '₹ 9,000 were divided equally among a certain number of persons. Had there been 20 more persons, each would have got ₹ 160 less. Find the original number of persons.', 4, 'Quadratic Equations', 'long', 21, NULL, NULL),
  ('MQ-f7562d-36-0', 'f7562d', 43, '36', '36. Draw a ''more than'' cumulative frequency curve for the following distribution. Also, find the median from the graph.

| Weight (in kg) : | 40 – 44 | 44 – 48 | 48 – 52 | 52 – 56 | 56 – 60 | 60 – 64 | 64 – 68 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Number of Students : | 7 | 12 | 33 | 47 | 20 | 11 | 5 |', 4, 'Statistics', 'long', 21, NULL, NULL),
  ('MQ-f7562d-37-0', 'f7562d', 44, '37', '37. If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then prove that the other two sides are divided in the same ratio.', 4, 'Similarity', 'long', 21, NULL, NULL),
  ('MQ-f7562d-37-1', 'f7562d', 45, '37', 'In a right-angled triangle, prove that the square of the hypotenuse is equal to the sum of the squares of the other two sides.', 4, 'Similarity', 'long', 21, NULL, NULL),
  ('MQ-f7562d-38-0', 'f7562d', 46, '38', '38. A straight highway leads to the foot of a tower. A man standing at the top of the tower observes a car at an angle of depression of 30°, which is approaching the foot of the tower with a uniform speed. After covering a distance of 50 m, the angle of depression of the car becomes 60°. Find the height of the tower. (Use $$\sqrt{3} = 1.73$$).', 4, 'Trigonometry', 'long', 21, NULL, NULL),
  ('MQ-f7562d-39-0', 'f7562d', 47, '39', '39. A bucket open at the top has top and bottom radii of circular ends as 40 cm and 20 cm respectively. Find the volume of the bucket if its depth is 21 cm. Also find the area of the tin sheet required for making the bucket. (Use $$\pi = \frac{22}{7}$$)', 4, 'Mensuration', 'long', 23, NULL, NULL),
  ('MQ-f7562d-40-0', 'f7562d', 48, '40', '40. Obtain other zeroes of the polynomial

$$f(x) = 2x^4 + 3x^3 - 5x^2 - 9x - 3$$

if two of its zeroes are $$\sqrt{3}$$ and $$-\sqrt{3}$$.', 4, 'Factorisation and Remainder Theorem', 'long', 23, NULL, NULL),
  ('MQ-f7562d-40-1', 'f7562d', 49, '40', 'Without actually calculating the zeroes, form a quadratic polynomial whose zeroes are reciprocals of the zeroes of the polynomial $$5x^2 + 2x - 3$$.', 4, 'Quadratic Equations', 'long', 23, NULL, NULL),
  ('MQ-089004-1-0', '089004', 0, '1', '1. (a) In Fig. 1, AB is diameter of a circle centered at 0. BC is tangent to the circle at B. If OP bisects the chord AD and ∠AOP = 60°, then find m∠C.

Fig. 1', 2, 'Circles', 'short', 2, '089004__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-089004-1-1', '089004', 1, '1', '(b) In Fig. 2, XAY is a tangent to the circle centered at O. If ∠ABO = 40°, then find m∠BAY and m∠AOB.

Fig. 2', 2, 'Circles', 'short', 3, '089004__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-089004-2-0', '089004', 2, '2', '2. If mode of the following frequency distribution is 55, then find the value of x.

| Class : | 0 - 15 | 15 - 30 | 30 - 45 | 45 - 60 | 60 - 75 | 75 - 90 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency : | 10 | 7 | x | 15 | 10 | 12 |', 2, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-089004-3-0', '089004', 3, '3', '3. (a) In an A.P. if the sum of third and seventh term is zero, find its 5th term.', 2, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-089004-3-1', '089004', 4, '3', '(b) Determine the A.P. whose third term is 5 and seventh term is 9.', 2, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-089004-4-0', '089004', 5, '4', '4. Solve the quadratic equation $$x^2 + 2\sqrt{2}x - 6 = 0$$ for x.', 2, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-089004-5-0', '089004', 6, '5', '5. Find the sum of first 20 terms of an A.P. whose nth term is given as $$a_n = 5 - 2n$$.', 2, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-089004-6-0', '089004', 7, '6', '6. A solid piece of metal in the form of a cuboid of dimensions 11 cm x 7 cm x 7 cm is melted to form a number of solid spheres of radii $$\frac{7}{2}$$ cm each. Find the value of n.', 2, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-089004-7-0', '089004', 8, '7', '7. (a) The mean of the following frequency distribution is 25. Find the value of f.

| Class : | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| Frequency : | 5 | 18 | 15 | f | 6 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-089004-7-1', '089004', 9, '7', '(b) Find the mean of the following data using assumed mean method

| Class : | 0 - 5 | 5 - 10 | 10 - 15 | 15 - 20 | 20 - 25 |
| --- | --- | --- | --- | --- | --- |
| Frequency : | 8 | 7 | 10 | 13 | 12 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-089004-8-0', '089004', 10, '8', '8. From a point on a bridge across a river, the angles of depression of the banks on opposite sides of the river are 30° and 45°. If the bridge is at a height of 8 m from the banks, then find the width of the river.', 3, 'Trigonometry', 'short', 4, '089004__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-089004-9-0', '089004', 11, '9', '9. Heights of 60 students of class X of a school are recorded and following data is obtained :

| Height (in cm) : | 130-136 | 135-140 | 140-145 | 145-150 | 150-155 | 155-160 |
| --- | --- | --- | --- | --- | --- | --- |
| Number of Students : | 4 | 11 | 12 | 7 | 10 | 6 |

Find the median height of the students.', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-089004-10-0', '089004', 12, '10', '10. Construct a pair of tangents to a circle of radius 4 cm from a point P lying outside the circle at a distance of 6 cm from the centre.', 3, 'Constructions', 'short', 4, NULL, NULL),
  ('MQ-089004-11-0', '089004', 13, '11', '11. (a) A 2-digit number is such that the product of its digits is 24. If 18 is subtracted from the number, the digits interchange their places. Find the number.', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-089004-11-1', '089004', 14, '11', '(b) The difference of the squares of two numbers is 180. The square of the smaller number is 8 times the greater number. Find the two numbers.', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-089004-12-0', '089004', 15, '12', '12. Prove that a parallelogram circumscribing a circle is a rhombus.', 4, 'Circles', 'long', 5, NULL, NULL),
  ('MQ-089004-13-0', '089004', 16, '13', '13. Case Study - 1 :

# Kite Festival

Kite festival is celebrated in many countries at different times of the year. In India, every year 14th January is celebrated as International Kite Day. On this day many people visit India and participate in the festival by flying various kinds of kites.

The picture given below, three kites flying together.

Fig. 5

In Fig. 5, the angles of elevation of two kites (Points A and B) from the hands of a man (Point C) are found to be 30° and 60° respectively. Taking AD = 50 m and BE = 60 m, find

(1) the lengths of strings used (take them straight) for kites A and B as shown in the figure.
(2) the distance ''d'' between these two kites', 4, 'Trigonometry', 'long', 5, '089004__CBSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-089004-14-0', '089004', 17, '14', '# 14. Case Study - 2

A ''circus'' is a company of performers who put on shows of acrobats, clowns etc. to entertain people started around 250 years back, in open fields, now generally performed in tents.

One such ''Circus Tent'' is shown below.

The tent is in the shape of a cylinder surmounted by a conical top. If the height and diameter of cylindrical part are 9 m and 30 m respectively and height of conical part is 8 m with same diameter as that of the cylindrical part, then find

(1) the area of the canvas used in making the tent;
(2) the cost of the canvas bought for the tent at the rate ₹ 200 per sq m, if 30 sq m canvas was wasted during stitching.', 4, 'Mensuration', 'long', 6, '089004__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-ddb4d6-1-0', 'ddb4d6', 0, '1', '(1) What is the HCF of 3000 and 525', 1, NULL, 'MCQ', 1, NULL, array['75', '25', '55', '35']::text[]),
  ('MQ-ddb4d6-2-0', 'ddb4d6', 1, '2', '(2) On a morning walk, three persons step off together and their steps measure 40 cm, 42 cm and 45 cm respectively. The minimum distance each should walk, so that each can cover the same distance in complete step is :', 1, NULL, 'MCQ', 1, NULL, array['2250 m', '2520 m', '2550 m', '2050 m']::text[]),
  ('MQ-ddb4d6-3-0', 'ddb4d6', 2, '3', '(3) For what value of k, the roots of the equation $$3x^2 - 10x + k = 0$$ are reciprocal each other?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['3', '10', '$$\frac{10}{3}$$', '$$\frac{1}{3}$$']::text[]),
  ('MQ-ddb4d6-4-0', 'ddb4d6', 3, '4', '(4) If the $$n^{th}$$ term of A.P. 12, 15, 18, ..., 99 is 99, Then value of n is equal to', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['20', '40', '30', '35']::text[]),
  ('MQ-ddb4d6-5-0', 'ddb4d6', 4, '5', '(5) The co-ordinates of a point A, where AB is the diameter of the circle with centre (-2, 2) and B is point with coordinates (3, 4) is :', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(7, 0)', '(-7, 0)', '(5, 0)', '(-5, 0)']::text[]),
  ('MQ-ddb4d6-6-0', 'ddb4d6', 5, '6', '(6) The centre of a circle whose end points of a diameter are (-6, 3) and (6, 4) is :', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(8, -1)', '(4, 7)', '$$\left(0, \frac{7}{2}\right)$$', '$$\left(4, \frac{7}{2}\right)$$']::text[]),
  ('MQ-ddb4d6-7-0', 'ddb4d6', 6, '7', '(7) The coordinates of the point which is reflection of point (-3, 5) in x-axis are :', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(3, 5)', '(3, -5)', '(-3, -5)', '(-3, 5)']::text[]),
  ('MQ-ddb4d6-8-0', 'ddb4d6', 7, '8', '(8) If the system of equations $$3x + y = 1$$ and $$(2k - 1)x + (k - 1)y = 2k + 1$$ is inconsistent, then k is', 1, NULL, 'MCQ', 1, NULL, array['-1', '0', '1', '2']::text[]),
  ('MQ-ddb4d6-19-0', 'ddb4d6', 8, '19', '(19) Assertion (A): If the zeroes of a quadratic polynomial $ax^2 + bx + c$ are both positive, then $a, b$ and $c$ all have the same sign.

Reason (R): If two of the zeroes of a cubic polynomial are zero, then it does not have linear and constant terms.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-20-0', 'ddb4d6', 9, '20', '(20) Assertion (A): If $n^{th}$ term of an A.P. is $(2n + 1)$, then the sum of its first three terms is 15.
Reason (R): The sum of first 16 terms of the A.P. 10,6,2,...is - 320.', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-21-0', 'ddb4d6', 10, '21', '(21) Find the $4^{th}$ term from the end of the A.P.: -11, -8, -5, ... 49', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-21-1', 'ddb4d6', 11, '21', 'Or

For what value of k will be $(k + 9)$, $(2k - 1)$ and $(2k + 7)$ are consecutive terms of an A.P.', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-22-0', 'ddb4d6', 12, '22', '(22) Sumit is 3 times as old as his son. Five years later, he shall be two and a half times as old as his son. How old is Sumit at present?', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-23-0', 'ddb4d6', 13, '23', '(23) Point A lies on the line segment XY joining $X(6, -6)$ and $Y(-4, -1)$ in such a way that $\frac{XA}{XY} = \frac{2}{5}$. If point A also lies on the line $3x + k(y + 1) = 0$, find the values of k.', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-24-0', 'ddb4d6', 14, '24', '(24) Find the value of m for which the quadratic equation $(m - 1)x^2 + 2(m - 1)x + 1 = 0$ has two real and equal roots.', 2, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-25-0', 'ddb4d6', 15, '25', '(25) Which term of the A.P. 3,8,13,18, ... is 88?', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-25-1', 'ddb4d6', 16, '25', 'Or

Which term of the A.P.: 121,117,113,...is its first negative term?', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-26-0', 'ddb4d6', 17, '26', '(26) Prove that $\sqrt{2}$ is an irrational number.', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-27-0', 'ddb4d6', 18, '27', '(27) If $m^{th}$ term of an A.P. is $\frac{1}{n}$ and $n^{th}$ term is $\frac{1}{m}$, find the sum of first $mn$ terms.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-27-1', 'ddb4d6', 19, '27', 'OR

How many terms of an A.P. 9,17,25,... must be taken to give a sum of 636?', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-28-0', 'ddb4d6', 20, '28', '(28) What point on the x-axis is equidistant from (7,6) and (-3,4)?', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-28-1', 'ddb4d6', 21, '28', 'Or

Find a point on the $y-axis$ which is equidistant from the points $A(6,5)$ and $B(-4,3)$.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-29-0', 'ddb4d6', 22, '29', '(29) If $\alpha, \beta$ are zeroes of quadratic polynomial $5x^2 + 5x + 1$, find the value of

A) $\alpha^2 + \beta^2$

B) $\alpha^{-1} + \beta^{-1}$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-30-0', 'ddb4d6', 23, '30', '(30) Find the value of k so that quadratic equation $k \times (x - 2) + 6 = 0$ have two equal roots.', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-31-0', 'ddb4d6', 24, '31', '(31) Find how many integers between 200 and 500 are divisible by 8.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-ddb4d6-32-0', 'ddb4d6', 25, '32', '(32) ABCD is a trapezium in which $AB \parallel DC$ and its diagonals intersect each other at the point O. Prove that

$\frac{AO}{OC} = \frac{BO}{OD}$.', 5, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-ddb4d6-32-1', 'ddb4d6', 26, '32', 'Or

State and Prove Basic Proportionality Theorem.', 5, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-ddb4d6-33-0', 'ddb4d6', 27, '33', '(33) In figure, A, B and C are points on OP, OQ and OR respectively such that $AB \parallel PQ$ and $AC \parallel PR$. Show that $BC \parallel QR$.', 5, 'Similarity', 'long', 2, NULL, NULL),
  ('MQ-ddb4d6-9-0', 'ddb4d6', 28, '9', '(9) If $\alpha, \beta$ are the zeroes of the quadratic polynomial $p(x) = x^2 - (k + 6)x + 2(2k - 1)$, then the value of k, if $\alpha + \beta = \frac{1}{2}\alpha\beta$, is', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['-7', '7', '-3', '3']::text[]),
  ('MQ-ddb4d6-10-0', 'ddb4d6', 29, '10', '(10) In the given figure, if $\angle ADE = \angle B$, show that $\triangle ADE \sim \triangle ABC$. If $AD = 3.8 \text{ cm}, AE = 3.6 \text{ cm}, BE = 2.1 \text{ cm}, BC = 4.2 \text{ cm}$, find DE.', 1, 'Similarity', 'MCQ', 3, 'ddb4d6__CBSE_X_Mat_p3_img_0_jpeg.webp', array['2.8 cm', '3.8 cm', '1.8 cm', '4.8 cm']::text[]),
  ('MQ-ddb4d6-11-0', 'ddb4d6', 30, '11', '(11) A vertical pole of length 6 m casts a shadow 4 m long on the ground and at the same time a tower casts a shadow 28 m long. Find the height of the tower.', 1, 'Similarity', 'MCQ', 3, NULL, array['42 m', '32 m', '28 m', '36 m']::text[]),
  ('MQ-ddb4d6-12-0', 'ddb4d6', 31, '12', '(12) The nature of roots of the Quadratic equation $9x^2 - 6x - 2 = 0$ is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['No real roots', '2 equal real roots', '2 distinct real roots', 'More than 2 real roots']::text[]),
  ('MQ-ddb4d6-13-0', 'ddb4d6', 32, '13', '(13) What is the ratio in which the line segment joining (2,-3) and (5, 6) is divided by x-axis?', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['1:2', '2:1', '2:5', '5:2']::text[]),
  ('MQ-ddb4d6-14-0', 'ddb4d6', 33, '14', '(14) If two positive integers a and b are written as $a = x^3y^2$ and $b = xy^3$, where x, y are prime numbers, then the result obtained by dividing the product of the positive integers by the LCM (a, b) is', 1, NULL, 'MCQ', 3, NULL, array['xy', '$xy^2$', '$x^3y^3$', '$x^2y^2$']::text[]),
  ('MQ-ddb4d6-15-0', 'ddb4d6', 34, '15', '(15) The exponent of 2 in the prime factorisation of 484 is:', 1, NULL, 'MCQ', 3, NULL, array['1', '2', '3', '4']::text[]),
  ('MQ-ddb4d6-16-0', 'ddb4d6', 35, '16', '(16) The quadratic polynomial whose sum and product of the zeroes are $\frac{21}{8}$ and $\frac{5}{16}$ respectively is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['$\frac{1}{4}(4x^2 - 12x + 5)$', '$\frac{1}{16}(16x^2 - 42x + 5)$', '$\frac{1}{8}(x^2 - 42x + 5)$', 'None of these']::text[]),
  ('MQ-ddb4d6-17-0', 'ddb4d6', 36, '17', '(17) Two APs have the same common difference. The first term of one of these is -1 and that of the other is -8. The difference between their 4th terms is', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['1', '-7', '7', '9']::text[]),
  ('MQ-ddb4d6-18-0', 'ddb4d6', 37, '18', '(18) A point (x,y) is at a distance of 5 units from the origin. How many such points lie in the third quadrant?', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['0', '1', '2', 'infinity']::text[]),
  ('MQ-ddb4d6-37-0', 'ddb4d6', 38, '37', '(i) What will be the distance covered by Ajay''s car in two hours?

[ 1 mark ]

(ii) What is the quadratic equation for the speed of Raj''s car?

[ 1 mark ]

(iii) How much time taken by Ajay to travel 400 km?

[ 2 mark ]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-ddb4d6-37-1', 'ddb4d6', 39, '37', '(i) What will be the distance covered by Ajay''s car in two hours?

[ 1 mark ]

(ii) What is the quadratic equation for the speed of Raj''s car?

[ 1 mark ]
OR

What is the speed of Ajay''s car?', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-ddb4d6-38-0', 'ddb4d6', 40, '38', '(38) Tharunya was thrilled to know that the football tournament is fixed with a monthly timeframe from 20th July to 20th August 2023 and for the first time in the FIFA Women''s World Cup''s history, two nations host in 10 venues. Her father felt that the game can be better understood if the position of players is represented as points on a coordinate plane.

(i) At an instance, the midfielders and forward formed a parallelogram. Find the position of the central midfielder (D) if the position of other players who formed the parallelogram are :- A(1,2), B(4,3) and C(6,6)

(ii) Check if the Goal keeper G(-3,5), Sweeper H(3,1) and Wing-back K(0,3) fall on a same straight line.
(iii) If Defensive midfielder A(1,4), Attacking midfielder B(2,-3) and Striker E(a,b) lie on the same straight line and B is equidistant from A and E. find the position of E', 4, 'Coordinate Geometry', 'long', 4, 'ddb4d6__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-55c388-1-0', '55c388', 0, '1', '1. If $x = ab^3$ and $y = a^3b$, where $a$ and $b$ are prime numbers, then [HCF $(x, y)$ – LCM $(x, y)$] is equal to: 1', 1, NULL, 'MCQ', 1, NULL, array['$1 - a^3b^3$', '$ab(1 - ab)$', '$ab - a^4b^4$', '$ab(1 - ab)(1 + ab)$']::text[]),
  ('MQ-55c388-2-0', '55c388', 1, '2', '2. $\left(1 + \sqrt{3}\right)^2 - \left(1 - \sqrt{3}\right)^2$ is: 1', 1, NULL, 'MCQ', 1, NULL, array['a positive rational number.', 'a negative integer.', 'a positive irrational number.', 'a negative irrational number.']::text[]),
  ('MQ-55c388-3-0', '55c388', 2, '3', '3. The value of ''$a$'' for which $ax^2 + x + a = 0$ has equal and positive roots is: 1', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['2', '– 2', '$\frac{1}{2}$', '$-\frac{1}{2}$']::text[]),
  ('MQ-55c388-4-0', '55c388', 3, '4', '4. The distance of a point $A$ from $x$-axis is 3 units. Which of the following cannot be coordinates of the point $A$? 1', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(1, 3)', '(– 3, –3)', '(– 3, 3)', '(3, 1)']::text[]),
  ('MQ-55c388-5-0', '55c388', 4, '5', '5. The number of red balls in a bag is 10 more than the number of black balls. If the probability of drawing a red ball at random from this bag is $\frac{3}{5}$, then the total number of balls in the bag is: 1', 1, 'Probability', 'MCQ', 1, NULL, array['50', '60', '80', '40']::text[]),
  ('MQ-55c388-6-0', '55c388', 5, '6', '6. The value of ''$p$'' for which the equations $px + 3y = p - 3$, $12x + py = p$ has infinitely many solutions is: 1', 1, NULL, 'MCQ', 1, NULL, array['– 6 only', '6 only', '$\pm 6$', 'Any real number except $\pm 6$']::text[]),
  ('MQ-55c388-7-0', '55c388', 6, '7', '7. $\Delta ABC$ and $\Delta PQR$ are shown in the adjoining figures. The measure of $\angle C$ is: 1', 1, 'Similarity', 'MCQ', 1, '55c388__CBSE_X_Mat_p1_img_0_jpeg.webp', array['$140^\circ$', '$80^\circ$', '$60^\circ$', '$40^\circ$']::text[]),
  ('MQ-55c388-8-0', '55c388', 7, '8', '8. $\tan 2A = 3 \tan A$ is true, when the measure of $\angle A$ is: 1', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$90^\circ$', '$60^\circ$', '$45^\circ$', '$30^\circ$']::text[]),
  ('MQ-55c388-9-0', '55c388', 8, '9', '9. Which of the following statements is true? 1', 1, NULL, 'MCQ', 2, NULL, array['$\sin 20^{\circ} > \sin 70^{\circ}$', '$\sin 20^{\circ} > \cos 20^{\circ}$', '$\cos 20^{\circ} > \cos 70^{\circ}$', '$\tan 20^{\circ} > \tan 70^{\circ}$']::text[]),
  ('MQ-55c388-10-0', '55c388', 9, '10', '10. A $30\mathrm{m}$ long rope is tightly stretched and tied the top of pole to the ground. If the rope makes an angle of $60^{\circ}$ with the ground, the height of the pole is: 1', 1, 'Trigonometry', 'MCQ', 2, '55c388__CBSE_X_Mat_p13_img_0_jpeg.webp', array['$10\sqrt{3}\mathrm{m}$', '$30\sqrt{3}\mathrm{m}$', '$15\mathrm{m}$', '$15\sqrt{3}\mathrm{m}$']::text[]),
  ('MQ-55c388-11-0', '55c388', 10, '11', '11. On the top face of the wooden cube of side $7\mathrm{cm}$ hemispherical depressions of radius $0.35\mathrm{cm}$ are to be formed by taking out the wood. The maximum number of depressions that can be formed is: 1', 1, 'Mensuration', 'MCQ', 2, NULL, array['400', '100', '20', '10']::text[]),
  ('MQ-55c388-12-0', '55c388', 11, '12', '12. The cumulative frequency for calculating median is obtained by adding the frequencies of all the: 1', 1, 'Statistics', 'MCQ', 2, NULL, array['classes up to the median class', 'classes following the median class', 'classes preceding the median class', 'all classes']::text[]),
  ('MQ-55c388-13-0', '55c388', 12, '13', '13. If mean and median of given set of observations are 10 and 11 respectively, then the value of mode is: 1', 1, 'Statistics', 'MCQ', 2, NULL, array['10.5', '8', '13', '21']::text[]),
  ('MQ-55c388-14-0', '55c388', 13, '14', '14. In the adjoining figure, $AB$ is the chord of the larger circle touching the smaller circle. The centre of both the circles is $O$. If $AB = 2r$ and $OP = r$, then the radius of larger circle is: 1', 1, 'Circles', 'MCQ', 2, '55c388__CBSE_X_Mat_p2_img_0_jpeg.webp', array['$2r$', '$3r$', '$2\sqrt{2} r$', '$\sqrt{2} r$']::text[]),
  ('MQ-55c388-15-0', '55c388', 14, '15', '15. A parallelogram having one of its sides $5\mathrm{cm}$ circumscribes a circle. The perimeter of parallelogram is: 1', 1, 'Circles', 'MCQ', 2, NULL, array['$20\mathrm{cm}$', 'less than $20\mathrm{cm}$', 'more than $20\mathrm{cm}$ but less than $40\mathrm{cm}$', '$40\mathrm{cm}$']::text[]),
  ('MQ-55c388-16-0', '55c388', 15, '16', '16. $E$ and $F$ are points on the sides $AB$ and $AC$ respectively of a $\Delta ABC$ such that $\frac{AE}{EB} = \frac{AF}{FC} = \frac{1}{2}$. Which of the following relation is true? 1', 1, 'Similarity', 'MCQ', 2, NULL, array['$EF = 2BC$', '$BC = 2EF$', '$EF = 3BC$', '$BC = 3EF$']::text[]),
  ('MQ-55c388-17-0', '55c388', 16, '17', '17. Which of the following statements is true for a polynomial $p(x)$ of degree 3? 1', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['$p(x)$ has at most two distinct zeroes.', '$p(x)$ has at least two distinct zeroes.', '$p(x)$ has exactly three distinct zeroes.', '$p(x)$ has at most three distinct zeroes.']::text[]),
  ('MQ-55c388-18-0', '55c388', 17, '18', '18. A pair of dice is thrown. The probability that sum of numbers appearing on top faces is at most 10 is: 1', 1, 'Probability', 'MCQ', 2, NULL, array['$\frac{1}{11}$', '$\frac{10}{11}$', '$\frac{5}{6}$', '$\frac{11}{12}$']::text[]),
  ('MQ-55c388-19-0', '55c388', 18, '19', '19. Assertion (A): $4^n$ ends with digit 0 for some natural number $n$.

Reason (R): For a number $x$ having 2 and 5 as its prime factors, $x^n$ always ends digit 0 for every natural number $n$. 1', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-55c388-20-0', '55c388', 19, '20', '20. Assertion (A): Tangents drawn at the end points of a diameter of a circle are always parallel to each other.

Reason (R): The lengths of tangents drawn to a circle from a point outside the circle are always equal. 1', 1, 'Circles', 'short', 2, '55c388__CBSE_X_Mat_p14_img_0_jpeg.webp', NULL),
  ('MQ-55c388-21-0', '55c388', 20, '21', '21. Solve the following system of equations algebraically: $30x + 44y = 10; 40x + 55y = 13$ 2', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-55c388-22-0', '55c388', 21, '22', '22. (A) A $1.5\mathrm{m}$ tall boy is walking away from the base of a lamp post which is $12\mathrm{m}$ high, at the speed of $2.5\mathrm{m/s}$. Find the length of his shadow after 3 seconds.', 2, 'Similarity', 'short', 2, '55c388__CBSE_X_Mat_p14_img_1_jpeg.webp', NULL),
  ('MQ-55c388-22-1', '55c388', 22, '22', '(B) In parallelogram $ABCD$, side $AD$ is produced to a point E and BE intersects $CD$ at $F$. Prove that $\Delta ABE \sim \Delta CFB$. 2', 2, 'Similarity', 'short', 2, '55c388__CBSE_X_Mat_p15_img_0_jpeg.webp', NULL),
  ('MQ-55c388-23-0', '55c388', 23, '23', '23. Find the coordinates of the point $C$ which lies on the line $AB$ produced such that $AC = 2BC$, where coordinates of points $A$ and $B$ are $(-1, 7)$ and $(4, -3)$ respectively. 2', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-55c388-24-0', '55c388', 24, '24', '24. (A) Find the value of $x$ for which $(\sin A + \operatorname{cosec} A)^2 + (\cos A + \sec A)^2 = x + \tan^2 A + \cot^2 A$ 2', 2, 'Trigonometry', 'short', 2, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
