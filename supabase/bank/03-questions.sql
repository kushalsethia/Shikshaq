set standard_conforming_strings = on;
begin;

-- questions 501-1000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-6cadb8-2-2', '6cadb8', 12, '2', 'c. Prove the following [3]

$$\frac{\sin A}{1-\cot A} + \frac{\cos A}{1-\tan A} = \cos A + \sin A$$', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-2-3', '6cadb8', 13, '2', 'd. Use a graph to answer the following questions [3]

i. Plot P (3,1) and Q (0,5). Reflect Q in the origin to Q''.
ii. Reflect P in y-axis to get R
iii. Give a name to PQRQ''', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-3-0', '6cadb8', 14, '3', 'a. A lot of 20 bulbs contains 4 defective bulbs. One bulb is drawn at random from the lot. What is the probability that the bulb is : [2]

i. Defective
ii. Not defective', 2, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-3-1', '6cadb8', 15, '3', 'b. Prove that: \(\frac{1}{1 - \sin A} +\frac{1}{1 + \sin A} = 2\sec^2 A\)', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-3-2', '6cadb8', 16, '3', 'c. The mean of the following distribution is 52. Find the value of p. [3]

| Marks obtained | 10 -20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 -60 | 60 -70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 5 | 3 | 4 | p | 2 | 6 | 13 |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-3-3', '6cadb8', 17, '3', 'd. A bird is perched on the top of a tree 20m high and its angle of elevation from a point on the ground is 45°. The bird flies off horizontally straight from the observer and in 10 sec the angle of elevation of the bird reduces to 30°. Find the speed of the bird rounded to one decimal place. [3]', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-6cadb8-4-0', '6cadb8', 18, '4', 'a. The points A (2, 3), B (3,5) and C (-1, -1) are the vertices of a triangle ABC. Find the equation of the altitude of the triangle through A. [2]', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-6cadb8-4-1', '6cadb8', 19, '4', 'b. In the given figure, the angle of elevation from a point P to the top of a tower QR, 50 m high is 60° and that of tower PT from a point Q is 30°. Find the height of the tower PT, correct to the nearest metre. [2]', 2, 'Trigonometry', 'short', 4, '6cadb8__Beacon_Hig_p4_img_0_jpeg.webp', NULL),
  ('MQ-6cadb8-4-2', '6cadb8', 20, '4', 'c. In the given figure, AC is a tangent to circle at point B.

∠ FBA = 50° and ∠ EDF = 30°. [3]

Find

(a) \(\angle FDB\)
(b) \(\angle EBF\)
(c) \(\angle EFB\)', 3, 'Circles', 'short', 4, '6cadb8__Beacon_Hig_p4_img_1_jpeg.webp', NULL),
  ('MQ-6cadb8-4-3', '6cadb8', 21, '4', 'd. Draw a histogram to the following distribution and hence find the mode. [3]

| Height (cm) | 145 – 155 | 155 – 165 | 165 – 175 | 175 – 185 | 175 – 195 |
| --- | --- | --- | --- | --- | --- |
| No of persons | 5 | 35 | 25 | 15 | 20 |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-6cadb8-5-0', '6cadb8', 22, '5', 'a. M and N are two points on the x-axis and y-axis respectively. P(3,2) divides the line segment MN in the ratio 2 : 3. Find the coordinates of M and N. [2]', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-6cadb8-5-1', '6cadb8', 23, '5', 'b. In a pencil box, there are 36 red pencils and some green pencils. When a pencil is taken out from this pencil box, the probability of getting a green pencil is 11. Find the number of green pencils in the box. [2] 20', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-6cadb8-5-2', '6cadb8', 24, '5', 'c. A cylindrical jug of radius 8 cm and height 10 cm is filled with orange juice. It is then poured into small conical cups of radius 2 cm and height 6 cm. Find the number of cups that can be filled. [3]', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-6cadb8-5-3', '6cadb8', 25, '5', 'd.

| Monthly Income (Rs) | 6000 7000 | 7000 8000 | 8000 9000 | 9000 10000 | 10000 11000 |
| --- | --- | --- | --- | --- | --- |
| No of employees | 20 | 45 | 65 | 90 | 60 |

Monthly income of a group of 280 employees in a company is given below:

Using a graph paper, draw an ogive for the above distribution. Use your ogive to estimate the median. [3]', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-6cadb8-6-0', '6cadb8', 26, '6', 'a. Find the equation of a line with \( x - \) intercept -3 and passing through the point (-2, 5) [2]', 2, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-6cadb8-6-1', '6cadb8', 27, '6', 'b. In the given figure O is the centre of the incircle of quadrilateral ABCD. If PD 36cm. CD 44cm BC 15 cm, find the radius of the circle. [2]', 2, 'Circles', 'short', 5, '6cadb8__Beacon_Hig_p5_img_0_jpeg.webp', NULL),
  ('MQ-6cadb8-6-2', '6cadb8', 28, '6', 'c. The following table shows marks secured by 140 students in an examination. Calculate the mean marks. [3]

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No of students | 20 | 24 | 40 | 36 | 20 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-6cadb8-6-3', '6cadb8', 29, '6', 'd. The given solid figure is a cylinder surmounted by a cone. The diameter of the base of the cylinder is 6 cm. The height of the cone is 4cm and the total height of the solid is 25cm. Find the curved surface area of the solid rounded to the nearest whole number. (Take $$\pi = 3.14$$) [3]', 3, 'Mensuration', 'short', 5, '6cadb8__Beacon_Hig_p5_img_1_jpeg.webp', NULL),
  ('MQ-276cf3-1-0', '276cf3', 0, '1', '1. A box contains 150 apples. If one apple is taken out of random and the probability of its being rotten is 0.06, then the number of good apples in the box is :', 1, 'Probability', 'MCQ', 1, NULL, array['90', '121', '60', '141']::text[]),
  ('MQ-276cf3-1-1', '276cf3', 1, '1', '2. The reflection of a point A(5,2) in the line x-2 = 0 is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(5, -2)', '(-5, 2)', '(-1,2)', '(1,-2)']::text[]),
  ('MQ-276cf3-1-2', '276cf3', 2, '1', '3. If the height of a cone is doubled, then find its increased volume in percentage:', 1, 'Mensuration', 'MCQ', 2, NULL, array['100 %', '50%', '25%', '5%']::text[]),
  ('MQ-276cf3-1-3', '276cf3', 3, '1', '4. The solution set for 5 -- 3x ≥ -- 2x + 2, x W is :', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{0,1,2,3}', '{0,1,2}', '{1, 2, 3,...}', '{-3,-2,-1,0,1,2,3}']::text[]),
  ('MQ-276cf3-1-4', '276cf3', 4, '1', '5. The y-axis divides the line segment joining the points (-4,5) and (3, -7) in the ratio :', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['2:7', '3:7', '4:3', '3:4']::text[]),
  ('MQ-276cf3-1-5', '276cf3', 5, '1', '6. The common difference of the A.P whose nth term is Tn = 3n - 4 , is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-1', '1', '2', '-2']::text[]),
  ('MQ-276cf3-1-6', '276cf3', 6, '1', '7. On dividing $$x^2 - 4x + m$$ by (x -2), the remainder is -1. The value of m is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['1', '2', '-2', '3']::text[]),
  ('MQ-276cf3-1-7', '276cf3', 7, '1', '8. If the height of the vertical pole is $$\sqrt{3}$$ times the length of its shadow on the ground, then the angle of elevation of the sun at that time is:', 1, 'Trigonometry', 'MCQ', 3, NULL, array['$$30^{\circ}$$', '$$60^{\circ}$$', '$$45^{\circ}$$', '$$75^{\circ}$$']::text[]),
  ('MQ-276cf3-1-8', '276cf3', 8, '1', '9. The value of $$\sqrt{\frac{1+\sin\theta}{1-\sin\theta}}$$ is', 1, 'Trigonometry', 'MCQ', 3, NULL, array['$$\cot\theta - \operatorname{cosec}\theta$$', '$$\operatorname{cosec}\theta + \cot\theta$$', '$$\operatorname{cosec}^2\theta + \cot^2\theta$$', '$$\sec\theta + \tan\theta$$']::text[]),
  ('MQ-276cf3-1-9', '276cf3', 9, '1', '10. If the cost of an article is ₹25,000 and CGST paid by the owner is ₹2250, the rate of GST is:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['9%', '10%', '15%', '18%']::text[]),
  ('MQ-276cf3-1-10', '276cf3', 10, '1', '11. In the adjoining figure, $$\Delta$$ ABC is circumscribing a circle. Then, the length of BC is', 1, 'Circles', 'MCQ', 3, '276cf3__Beacon_Hig_p3_img_0_jpeg.webp', array['7 cm', '\(8\mathrm{cm}\)', '\(9\mathrm{cm}\)', '\(10\mathrm{cm}\)']::text[]),
  ('MQ-276cf3-1-11', '276cf3', 11, '1', '12. If $$x \begin{bmatrix} 2 \\ 3 \end{bmatrix} + y \begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 10 \\ 6 \end{bmatrix}$$ then the values of x and y are', 1, 'Matrices', 'MCQ', 4, NULL, array['\(x = 2, y = 6\)', '\(x = 2, y = -6\)', '\(x = 3, y = -4\)', '\(x = 3, y = -6\)']::text[]),
  ('MQ-276cf3-1-12', '276cf3', 12, '1', '13. In the given figure, PQ || CA and all lengths are given in centimetres. The length of BC is', 1, 'Similarity', 'MCQ', 4, '276cf3__Beacon_Hig_p4_img_0_jpeg.webp', array['\(6.4\mathrm{cm}\)', '\(7.5\mathrm{cm}\)', '\(8\mathrm{cm}\)', '\(9\mathrm{cm}\)']::text[]),
  ('MQ-276cf3-1-13', '276cf3', 13, '1', '14. Which one of the following is not a quadratic equation', 1, 'Quadratic Equations', 'MCQ', 4, NULL, array['\((\mathbf{x} + 2)^2 = 2(\mathbf{x} + 3)\)', '\(x^{2} + 3x = (-1)(1 - 3x)^{2}\)', '\((\mathbf{x} + 2)(\mathbf{x} - 1) = \mathbf{x}^2 - 2\mathbf{x} - 3\)', '\(x^{3} - x^{2} + 2x + 1 = (x + 1)^{3}\)']::text[]),
  ('MQ-276cf3-1-14', '276cf3', 14, '1', '15. Find the Median class of the following grouped data.
| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 9 | 10 | 24 | 16 | 11 |', 1, 'Statistics', 'MCQ', 4, NULL, array['0-10', '10 -20', '20 - 30', '30 - 40']::text[]),
  ('MQ-276cf3-2-0', '276cf3', 15, '2', 'a. Shilpa has a 4 year old recurring deposit account in Bank of Maharashtra and deposits ₹ 800 per month. If she gets ₹ 48,200 at the time of maturity. Find

1) Interest received from the bank.
2) Rate of Interest per annum paid by the bank. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-276cf3-2-1', '276cf3', 16, '2', 'b. Prove that : $$\frac{\cos A}{\operatorname{cosec} A+1} + \frac{\cos A}{\operatorname{cosec} A-1} = 2 \tan A$$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-276cf3-2-2', '276cf3', 17, '2', 'c. If y is the mean proportion between x and z show that [4]

$$\left[ \frac{xy+yz+zx}{x+y+z} \right]^3 = xyz$$', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-276cf3-3-0', '276cf3', 18, '3', 'a. The surface area of a solid metallic sphere is 616 cm². If it is melted and recasted into smaller spheres of diameter 3.5cm , how many spheres can be obtained? [4]', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-276cf3-3-1', '276cf3', 19, '3', 'b. O(0,0) A(3,5) and B (-5, -3) are the vertices of triangle OAB.

Find [4]

1. The equation of median of triangle OAB through vertex O.
2. The equation of altitude of triangle OAB through vertex B.', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-276cf3-3-2', '276cf3', 20, '3', 'c. Use graph paper for this question. [5]
Plot P(2,4) Q (-2 , 1) and R (5 , 0) using scale 2cm = 1 unit on both axis.

1) Reflect P and Q in y = 0 to get P'' and Q'' and write their co –
ordinates.

2) Give a geometrical name to the figure PQ Q''P'' R.
3) Find the area of the figure.
4) Write down the equations of QQ''', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-276cf3-4-0', '276cf3', 21, '4', 'a. Solve the following quadratic equation and give your answer correct it to two significant figures. [3]

$$4x - \frac{1}{x} = 6$$', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-276cf3-4-1', '276cf3', 22, '4', 'b. If A = $$\begin{bmatrix} 3 & 7 \\ 2 & 4 \end{bmatrix}$$ B = $$\begin{bmatrix} 0 & 2 \\ 5 & 3 \end{bmatrix}$$ C = $$\begin{bmatrix} 1 & -5 \\ -4 & 6 \end{bmatrix}$$ ,

find the value of AB - 5C [3]', 3, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-276cf3-4-2', '276cf3', 23, '4', 'c. The following Table shows the expenditure of 60 boys on books. Draw a histogram and find the mode of this expenditure. [4]

| Expenditure | 20 -25 | 25- 30 | 30- 35 | 35-40 | 40 - 45 | 45 - 50 |
| --- | --- | --- | --- | --- | --- | --- |
| No of students | 4 | 7 | 23 | 18 | 6 | 2 |', 4, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-276cf3-5-0', '276cf3', 24, '5', 'a. Solve the following in equation write the solution act and represent it on a number line. [3]

$$4x - 19 < \frac{3x}{5} - 2 \leq \frac{-2}{5} + x, x \in R$$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-276cf3-5-1', '276cf3', 25, '5', 'b. A box contains a certain number of balls some of these balls are marked A some are marked B and the remaining are marked C. When a ball is drawn at random P(A) = 1/3 and P(B) = 1/4. . If there are 40 balls in the box which are marked C. Find the number of balls in the box. [3]', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-276cf3-5-2', '276cf3', 26, '5', 'c. The mean of the following distribution is 62.8 and the sum of all frequencies is 50. Find the missing frequencies a and b. [4]

| Class – interval | 0 - 20 | 20 - 40 | 40 – 60 | 60 – 80 | 80 – 100 | 100 - 120 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | a | 10 | b | 7 | 8 |', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-276cf3-6-0', '276cf3', 27, '6', 'a. The first and the last term of an AP are 34 and 700 respectively. If the common difference is 18 how many terms are there and what is their sum? [3]', 3, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-276cf3-6-1', '276cf3', 28, '6', 'b. Prove that : $$\frac{(\cos A - \sin A)(1 + \tan A)}{2\cos^2 A - 1} = \sec A$$ [3]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-276cf3-6-2', '276cf3', 29, '6', 'c. A trader buys x articles for a total cost of ₹ 600. Write down the cost of one article in terms of x. If the cost per article was 5 more the number of articles that can be brought for ₹ 600 would be 4 less. Write down an equation in x for the above condition and solve it to find x. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-276cf3-7-0', '276cf3', 30, '7', 'a. Find the amount of bill for the following state transaction of goods /services. [3]

| MRP in (₹) | 12000 | 15000 | 18000 |
| --- | --- | --- | --- |
| Discount % | 30 | 20 | 40 |
| GST % | 6 | 9 | 2.5 |', 3, 'GST and Banking', 'short', 7, NULL, NULL),
  ('MQ-276cf3-7-1', '276cf3', 31, '7', 'b. Show that $2x + 7$ is a factor of $2x^3 + 5x^2 - 11x - 14$. Hence write all the factors of the given expression using factor theorem. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 8, NULL, NULL),
  ('MQ-276cf3-7-2', '276cf3', 32, '7', 'c. In the given figure AB is the diameter of the circle with centre O. DO is parallel to CB and $\angle DCB = 120^\circ$. calculate

[4]

i) DAB
ii) DBA
iii) DBC', 4, 'Circles', 'long', 8, '276cf3__Beacon_Hig_p8_img_0_jpeg.webp', NULL),
  ('MQ-276cf3-8-0', '276cf3', 33, '8', 'a. The marks obtained in the JEE (advanced test) of candidates in Mathematics are as given below. [6]

| Marks | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No of students | 3 | 7 | 12 | 17 | 23 | 14 | 9 | 6 | 5 | 4 |

Taking scale $2\mathrm{cm} = 10$ units on both axis, draw an ogive for the given distribution on a graph sheet use the ogive to estimate

1) The median marks
2) The upper quartile
3) The number of students who did not pass the test. If the pass percentage was 35.
4) If the top 10 students qualified for the Indian Institute of technology what was the qualifying mark.', 6, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-276cf3-8-1', '276cf3', 34, '8', 'b. Given $x = \frac{\sqrt{2a + 1} + \sqrt{2a - 1}}{\sqrt{2a + 1} - \sqrt{2a - 1}}$ [4]

Use componendo and dividendo to prove $x^2 - 4ax + 1 = 0$', 4, 'Ratio and Proportion', 'long', 8, NULL, NULL),
  ('MQ-276cf3-9-0', '276cf3', 35, '9', 'a. In the given figure, QAP is the tangent at point A and PBD is a straight line. If ∠ACB = 36⁰ and ∠APB = 42⁰, [3] find

1) ∠BAP
2) ∠BCD
3) ∠QAD', 3, 'Circles', 'short', 9, '276cf3__Beacon_Hig_p9_img_0_jpeg.webp', NULL),
  ('MQ-276cf3-9-1', '276cf3', 36, '9', 'b. In the given figure AB || EF || CD Given

that AB = 7.5cm

EG = 2.5 cm GC = 5 cm and DC = 9cm

Find the length of EF and AC.

[3]', 3, 'Similarity', 'short', 9, '276cf3__Beacon_Hig_p9_img_1_jpeg.webp', NULL),
  ('MQ-276cf3-9-2', '276cf3', 37, '9', 'c. The horizontal distance between two towers is 120m. The angle of elevation of the top and angle of depression of the bottom of the first tower as observed from the second tower is 30⁰ and 24⁰. Find the height of the towers. Give your answer correct to 3 significant figures. [4]', 4, 'Trigonometry', 'long', 9, NULL, NULL),
  ('MQ-276cf3-10-0', '276cf3', 38, '10', 'a. The line joining P (- 4 , 5) and Q (3 , 2) interrupts the y- axis at point R. PM and QN are perpendiculars from P and Q on the x- axis. Find [3]

1) The ratio PR : RQ
2) The co – ordinates of R
3) The area of quadrilateral PMNQ', 3, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-276cf3-10-1', '276cf3', 39, '10', 'b. Construct a triangle ABC with BC = 6.5cm AB = 5.5 cm and AC = 5 cm. Construct the in circle of the triangle. Measure and record the radius of the in circle. [3]', 3, 'Constructions', 'short', 10, NULL, NULL),
  ('MQ-276cf3-10-2', '276cf3', 40, '10', 'c. From a solid cylinder of height 36cm and radius 14cm a conical cavity of radius 7cm and height 24cm is drilled out. Find the volume and total surface area of the remaining solid. [4]', 4, 'Mensuration', 'long', 10, '276cf3__Beacon_Hig_p10_img_0_jpeg.webp', NULL),
  ('MQ-a441b7-1-0', 'a441b7', 0, '1', '(i) The nth term of an Arithmetic Progression (A.P.) is (4n + 1). Then the 10th term of this A.P. is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['15', '41', '10', '39']::text[]),
  ('MQ-a441b7-1-1', 'a441b7', 1, '1', '(ii) $$\sin^2\theta (1 + \cot^2\theta)$$ is equal to:', 1, 'Trigonometry', 'MCQ', 1, NULL, array['\(\sin \theta\)', '1', 'cot \(\theta\)', '\(\tan^2\theta\)']::text[]),
  ('MQ-a441b7-1-2', 'a441b7', 2, '1', '(iii) In the figure, if O is the centre of a circle PQ is a chord and the tangent PR at P makes an angle of $50^\circ$ with PQ.
The degree measure of $\angle OQP$ is equal to:', 1, 'Circles', 'MCQ', 2, 'a441b7__Bhaktiveda_p2_img_0_jpeg.webp', array['$30^\circ$', '$100^\circ$', '$50^\circ$', '$40^\circ$']::text[]),
  ('MQ-a441b7-1-3', 'a441b7', 3, '1', '(iv) If $A = \begin{bmatrix} 3 & 2 \\ -1 & 5 \end{bmatrix}$ and $I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$. The order of matrix ''AI'' is:', 1, 'Matrices', 'MCQ', 2, NULL, array['$2 \times 1$', '$1 \times 2$', '$2 \times 2$', '$1 \times 1$']::text[]),
  ('MQ-a441b7-1-4', 'a441b7', 4, '1', '(v) The runs scored by a batsman in 35 different matches are given below:
| Runs scored | 0 – 15 | 15 – 30 | 30 – 45 | 45 – 60 | 60 – 75 | 75 – 90 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 7 | 4 | 8 | 8 | 3 |
The number of matches in which the batsman scored less than 60 runs are:', 1, 'Statistics', 'MCQ', 2, NULL, array['16', '24', '8', '19']::text[]),
  ('MQ-a441b7-1-5', 'a441b7', 5, '1', '(vi) A point Q is reflected in the origin and then reflected in the $y$-axis. Co-ordinates of its image are $(-4, -7)$. The co-ordinates of Q are:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$(4, -7)$', '$(4, 7)$', '$(-4, 0)$', '$(-4, 7)$']::text[]),
  ('MQ-a441b7-1-6', 'a441b7', 6, '1', '(vii) The equation of line is $x - y = 4$. The inclination of the line is:', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['$45^\circ$', '$30^\circ$', '$60^\circ$', '$0^\circ$']::text[]),
  ('MQ-a441b7-1-7', 'a441b7', 7, '1', '(viii) In the given figure, $PQ \parallel BC$, $AP = 2$ cm, $BP = 3$ cm, $QC = 4.5$ cm, $BC = 8$ cm, then value of $AQ$ is', 1, 'Similarity', 'MCQ', 3, 'a441b7__Bhaktiveda_p3_img_0_jpeg.webp', array['3 cm', '2 cm', '1.5 cm', '4 cm']::text[]),
  ('MQ-a441b7-1-8', 'a441b7', 8, '1', '(ix) What should be added to $x^2 - 7x$ so that $(x - 2)$ is a factor of the resulting polynomial?', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-10', '-5', '18', '10']::text[]),
  ('MQ-a441b7-1-9', 'a441b7', 9, '1', '(x) The quadratic equation $4x^2 + 8x - k = 0$ has real and equal roots. The value of ''k'' is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['1', '4', '-1', '-4']::text[]),
  ('MQ-a441b7-1-10', 'a441b7', 10, '1', '(xi) Sachin ordered some food from a restaurant, the bill excluding tax was ₹ 750. If the rate of GST charged is 18 %, the total amount of bill paid by him:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['₹ 817.50', '₹ 825', '₹ 885', '₹ 1425']::text[]),
  ('MQ-a441b7-1-11', 'a441b7', 11, '1', '(xii) The area of the curved surface of a cylinder is $8800\text{ cm}^2$ and the circumference of its base is $110\text{ cm}$. The height of the cylinder is:', 1, 'Mensuration', 'MCQ', 4, NULL, array['$800\text{ cm}$', '$4\text{ cm}$', '$80\text{ cm}$', '$8\text{ cm}$']::text[]),
  ('MQ-a441b7-1-12', 'a441b7', 12, '1', '(xiii) There are 20 cards numbered 1 to 20. Find the probability that a card picked up randomly has a cube number:', 1, 'Probability', 'MCQ', 4, NULL, array['$\frac{1}{10}$', '$\frac{7}{10}$', '$\frac{1}{5}$', '$\frac{1}{20}$']::text[]),
  ('MQ-a441b7-1-13', 'a441b7', 13, '1', '(xiv) If $\frac{7a}{2b} = \frac{5r}{3s}$, then by applying alternendo, the proportion becomes:', 1, 'Ratio and Proportion', 'MCQ', 4, NULL, array['$\frac{3s}{2b} = \frac{5r}{7a}$', '$\frac{2b}{3s} = \frac{7a}{5r}$', '$\frac{7a+2b}{2b} = \frac{5r+3s}{3s}$', '$\frac{2b}{7a} = \frac{3s}{5r}$']::text[]),
  ('MQ-a441b7-1-14', 'a441b7', 14, '1', '(xv) The inequation taking $x$ as the variable for the given graph is:', 1, 'Linear Inequations', 'MCQ', 4, 'a441b7__Bhaktiveda_p4_img_0_jpeg.webp', array['$\{x : -3 \leq x \leq 3 \text{ and } x \in R\}$', '$\{x : -3 \leq x \leq 3 \text{ and } x \in W\}$', '$\{x : -3 \leq x \leq 3 \text{ and } x \in N\}$', '$\{x : -3 < x < 3 \text{ and } x \in W\}$']::text[]),
  ('MQ-a441b7-2-0', 'a441b7', 15, '2', '(i) Mrs. Sharma has a recurring deposit account in the State Bank of India for 24 months at 6 % p.a. simple interest. If she gets ₹ 1200 as interest at the time of maturity, find:

(a) The monthly deposit

(b) The maturity value.

[4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-a441b7-2-1', 'a441b7', 16, '2', '(ii) If $$\frac{x^3 + 3x^2y}{3xy^2 + y^3} = \frac{a^3 + 3a^2b}{3ab^2 + b^3}$$ , using componendo and dividendo

prove that: $$\frac{a}{b} = \frac{x}{y}$$ [4]', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-a441b7-2-2', 'a441b7', 17, '2', '(iii) Prove that: $$\sqrt{\frac{1-\sin A}{1+\sin A}} = \sec A - \tan A$$ [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a441b7-3-0', 'a441b7', 18, '3', '(i) A solid is composed of a cylinder with hemispherical ends. If whole length of solid is 35 cm and diameter of hemispherical ends is 14 cm, find the cost of polishing the surface of the solid at the rate of ₹20 per cm$^{2}$. (Take $$\pi = \frac{22}{7}$$ )

[4]', 4, 'Mensuration', 'long', 5, 'a441b7__Bhaktiveda_p5_img_0_jpeg.webp', NULL),
  ('MQ-a441b7-3-1', 'a441b7', 19, '3', '(ii) Given $$A = \begin{bmatrix} 4 & 4 \\ -2 & 6 \end{bmatrix}$$ , $$B = \begin{bmatrix} 2 & 1 \\ 3 & -2 \end{bmatrix}$$ , $$P = \begin{bmatrix} 16 & x \\ 9 & -16 \end{bmatrix}$$ and $$Q = \begin{bmatrix} 4 & -6 \\ 5 & y \end{bmatrix}$$ .

If $$AB = P + Q$$ , find the values of $$x$$ and $$y$$ . [4]', 4, 'Matrices', 'long', 5, NULL, NULL),
  ('MQ-a441b7-3-2', 'a441b7', 20, '3', '(iii) Use graph sheet for this question. Take 2 cm = 1 unit along the axes.

Points $(0, 1)$ , $(0, -3)$ are invariant on reflection in line $L_1$ .

(a) Name the line $L_1$ and write the equation of line $L_1$ .

(b) Plot $A(2, 2)$ , $B(-4, 4)$ , $C(2, -2)$ and $D(-4, -4)$ .

(c) Reflect $A$ , $B$ , $C$ and $D$ in $L_1$ and name as $A''$ , $B''$ , $C''$ and $D''$ respectively.

(d) Join the points $A$ , $C$ , $D''$ , $D$ , $C''$ , $A''$ , $B$ and $B''$ in order. Give the geometrical name of the closed figure formed. [5]', 5, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-a441b7-4-0', 'a441b7', 21, '4', '(i) If PQRS is a parallelogram where P (3, -1), Q (5, 6) and R (7, 3).

Find the co-ordinates of S.

[3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-a441b7-4-1', 'a441b7', 22, '4', '(ii) When divided by x - 3 the polynomials x³ - px² + x + 6 and

2x³ - x² - (p + 3)x - 6 leave the same remainder. Find the value of ''p''.

[3]', 3, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-a441b7-4-2', 'a441b7', 23, '4', '(iii) A person buys the following items from a departmental store:

[4]

| Item | Quantity | Rate per Item | Rate of GST | Discount |
| --- | --- | --- | --- | --- |
| Pens | 20 | ₹ 25 | 12% | 5% |
| Pencils | 36 | ₹3 | 5% | Nil |

Calculate:

(a) The Total taxable amount.
(b) The total bill amount including GST paid by the person.', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-a441b7-5-0', 'a441b7', 24, '5', '(i) Use graph sheet for this question. Draw a histogram from the following frequency distribution and hence estimate the mode from the graph. Take 2 cm = 10 marks along the x-axis and 2 cm = 2 students along the y-axis: [3]

| Marks | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 7 | 15 | 13 | 5 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-a441b7-5-1', 'a441b7', 25, '5', '(ii) Solve the equation 5x (x + 2) = 3. Write your answer correct to three decimal places. [3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-a441b7-5-2', 'a441b7', 26, '5', '(iii) A (2, 5), B (-1, 2) and C (5, 8) are the vertices of a ΔABC. ''M'' is a point on AB such that AM : MB = 1 : 2. [4]

Find:

(a) The co-ordinates of \(M\)
(b) The equation of the line passing through the points \(M\) and parallel to \(BC\).', 4, 'Coordinate Geometry', 'long', 6, NULL, NULL),
  ('MQ-a441b7-6-0', 'a441b7', 27, '6', '(i) A solid sphere of radius 15 cm is melted and recast into solid right circular cones of radius 2.5 cm and height 8 cm. Calculate the number of cones recast. [3]', 3, 'Mensuration', 'short', 7, NULL, NULL),
  ('MQ-a441b7-6-1', 'a441b7', 28, '6', '(ii) Using ruler and compasses, construct a regular hexagon of side 5 cm. Hence, construct a circle circumscribing the hexagon. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-a441b7-6-2', 'a441b7', 29, '6', '(iii) A man observes the angle of elevation of the top of the coconut tree to be 45°. He walks towards it in a horizontal line through its base. On covering 20 m the angle of elevation changes to 60°.

Find the height of the coconut tree correct to 2 significant figures. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-a441b7-7-0', 'a441b7', 30, '7', '(i) Prove that: [3]

$$\frac{1 + \tan^2 A - 2 \tan A}{1 + \cot^2 A - 2 \cot A} = \tan^2 A$$', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-a441b7-7-1', 'a441b7', 31, '7', '(ii) In the figure given below, AB is parallel to DC, ∠BCE = 80° and ∠BAC = 25°.

Find:

(a) \(\angle CAD\)
(b) \(\angle CBD\)
(c) \(\angle ADC\)', NULL, 'Circles', 'short', 7, 'a441b7__Bhaktiveda_p7_img_0_jpeg.webp', NULL),
  ('MQ-a441b7-7-2', 'a441b7', 32, '7', '(iii) The 4th term of an Arithmetic Progression (A.P.) is 22 and 15th term is 66.

Find: [4]

(a) The first term
(b) The common difference
(c) The sum of the series to 7 terms', 4, 'Arithmetic Progression', 'long', 7, NULL, NULL),
  ('MQ-a441b7-8-0', 'a441b7', 33, '8', '(i) An aeroplane travels a distance of 2800 km at a certain speed of ''x'' km/hr. But on the return journey, the speed was reduced by 100 km/hr and hence it took 30 minutes more than the onward journey. Write an expression in ''x'' and also find the original speed. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-a441b7-8-1', 'a441b7', 34, '8', '(ii) Use a graph sheet for this question. The table below gives the marks of 200 students in a school. The following table shows the distribution: [6]

| Marks | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 | 70 – 80 | 80 – 90 | 90 – 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 8 | 16 | 18 | 38 | 40 | 36 | 30 | 14 |

Use 2 cm = 10 marks and 2 cm = 20 people along x-axis and y-axis respectively to draw an ogive and use it to answer the following:

(a) Estimate the median.
(b) Find the lower quartile.
(c) Find the number of students getting above 85 marks.', 6, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-a441b7-9-0', 'a441b7', 35, '9', '(i) What same number should be subtracted from each of the numbers 8, 12, 18 and 30 so that the remainders are in proportion? [3]', 3, 'Ratio and Proportion', 'short', 8, NULL, NULL),
  ('MQ-a441b7-9-1', 'a441b7', 36, '9', '(ii) There are 8 cards with the letters A, B, C, D, E, A, E, O written on them. When a card is randomly picked up from the set, what is the probability that it is a: [3]

(a) Vowel
(b) Consonant
(c) Letter E', 3, 'Probability', 'short', 8, NULL, NULL),
  ('MQ-a441b7-9-2', 'a441b7', 37, '9', '(iii) AB is a tangent to the circle at Q. PQRS is a cyclic quadrilateral. If ∠PSQ = 38°, ∠PQR = 110°. [4]

Find:

(a) \(\angle PQA\)
(b) \(\angle RQB\)
(c) \(\angle QOR\)
(d) \(\angle QPR\)', 4, 'Circles', 'long', 8, 'a441b7__Bhaktiveda_p8_img_0_jpeg.webp', NULL),
  ('MQ-a441b7-10-0', 'a441b7', 38, '10', '(i) Solve the following inequation and represent the solution set on the number line:

$$-3 < -\frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6},\ x \in R.$$ [3]', 3, 'Linear Inequations', 'short', 9, NULL, NULL),
  ('MQ-a441b7-10-1', 'a441b7', 39, '10', '(ii) The following table gives the monthly wages of a certain number of workers.

[3]

| Monthly wages (in ₹) | 90 – 100 | 110 - 130 | 130 – 150 | 150 – 170 | 170 – 190 |
| --- | --- | --- | --- | --- | --- |
| No. of workers | 4 | 6 | 4 | 8 | 18 |

Calculate the mean by short cut method.', 3, 'Statistics', 'short', 9, NULL, NULL),
  ('MQ-a441b7-10-2', 'a441b7', 40, '10', '(iii) In the given figure, $\Delta ABC$ and $\Delta AMP$ are right angled at B and M.

Given $AC = 10$ cm, $AP = 15$ cm and $PM = 12$ cm. [4]

(a) Prove that $\Delta ABC \sim \Delta AMP$

(b) Find AB and BC.', 4, 'Similarity', 'long', 9, 'a441b7__Bhaktiveda_p9_img_0_jpeg.webp', NULL),
  ('MQ-0e91e9-1-0', '0e91e9', 0, '1', '(i) $$\frac{\text{cosec } \theta}{\tan \theta + \cot \theta}$$ is equal to:', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$$\cos \theta$$', '$$\sin \theta$$', '$$\tan \theta$$', '$$\cot \theta$$']::text[]),
  ('MQ-0e91e9-1-1', '0e91e9', 1, '1', '(ii) If $$(3x + k)$$ , $$(2x + 9)$$ and $$(x + 13)$$ are 3 consecutive terms of an Arithmetic Progression (A.P.), then the value of $$k$$ is:', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['5', '13', '31', '- 5']::text[]),
  ('MQ-0e91e9-1-2', '0e91e9', 2, '1', '(iii) In the given diagram O is the centre of the circles and $\angle BCD = 140^\circ$
The degree measure of x is:', 1, 'Circles', 'MCQ', 2, '0e91e9__Bhaktiveda_p2_img_0_jpeg.webp', array['$130^\circ$', '$45^\circ$', '$70^\circ$', '$50^\circ$']::text[]),
  ('MQ-0e91e9-1-3', '0e91e9', 3, '1', '(iv) If $[3 \quad 5] \begin{bmatrix} -7 & 4 \\ 8 & 3 \end{bmatrix} = X$. The order of matrix ''X'' is:', 1, 'Matrices', 'MCQ', 2, NULL, array['$2 \times 1$', '$1 \times 2$', '$2 \times 2$', '$1 \times 1$']::text[]),
  ('MQ-0e91e9-1-4', '0e91e9', 4, '1', '(v) The point $B(0, 5)$ is invariant under reflection in:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['$x-axis$', '$y-axis$', 'origin', '$y = 2$']::text[]),
  ('MQ-0e91e9-1-5', '0e91e9', 5, '1', '(vi) The price of a sofa-set is ₹ 50000. If the GST is chargeable at the rate of 28%, then the State GST (SGST) share is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 43000', '₹ 14000', '₹ 7000', '₹ 700']::text[]),
  ('MQ-0e91e9-1-6', '0e91e9', 6, '1', '(vii) 3, 9, m, 81 and n are in continued proportion. The values of m and n are:', 1, 'Ratio and Proportion', 'MCQ', 2, NULL, array['$m = 27, n = 243$', '$m = 3, n = 27$', '$m = 1, n = 3$', '$m = 243, n = 1$']::text[]),
  ('MQ-0e91e9-1-7', '0e91e9', 7, '1', '(viii) In the given diagram the $\Delta$ MLN is similar to $\Delta$ RQS by the axiom:', 1, 'Similarity', 'MCQ', 3, '0e91e9__Bhaktiveda_p3_img_0_jpeg.webp', array['SSS', 'AAA', 'RHS', 'SAS']::text[]),
  ('MQ-0e91e9-1-8', '0e91e9', 8, '1', '(ix) Find the value of the remainder when $4x^3 + 6x^2 - 8x - 10$ is divided by $(2x + 1)$:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 3, NULL, array['-5', '-4', '5', '4']::text[]),
  ('MQ-0e91e9-1-9', '0e91e9', 9, '1', '(x) The discriminant of the quadratic equation $2x^2 + 6x + 3 = 0$ is:', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['Negative', 'Zero', 'Positive', 'Infinite']::text[]),
  ('MQ-0e91e9-1-10', '0e91e9', 10, '1', '(xi) The CGST paid by Samaira to the shopkeeper for a watch which is priced at ₹3500 is ₹175. The rate of GST charged is:', 1, 'GST and Banking', 'MCQ', 3, NULL, array['\(1.5\%\)', '\(3\%\)', '\(5\%\)', '\(10\%\)']::text[]),
  ('MQ-0e91e9-1-11', '0e91e9', 11, '1', '(xii) A solid cylinder of radius 3 cm and height 8 cm is melted and formed into a cone of radius 6 cm. The height of the cone is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['\(3\mathrm{cm}\)', '\(6\mathrm{cm}\)', '\(9\mathrm{cm}\)', '\(8\mathrm{cm}\)']::text[]),
  ('MQ-0e91e9-1-12', '0e91e9', 12, '1', '(xiii) Onkar and Neha play a badminton game. If the probability of Onkar winning the match is 0.75, the probability of Neha winning the match is:', 1, 'Probability', 'MCQ', 4, NULL, array['1', '0', '0.75', '0.25']::text[]),
  ('MQ-0e91e9-1-13', '0e91e9', 13, '1', '(xiv) The midpoint P of line joining $A(3, 5)$ and $B(x, y)$ is $(2, 3)$. The co-ordinates of $B(x, y)$:', 1, 'Coordinate Geometry', 'MCQ', 4, NULL, array['$(5, 2)$', '$(1, 1)$', '$(-2, -2)$', '$(2, 3)$']::text[]),
  ('MQ-0e91e9-1-14', '0e91e9', 14, '1', '(xv) The solution set for the given inequation is:
$$2 \leq 3(x - 2) + 5 < 8, \quad x \in W$$', 1, 'Linear Inequations', 'MCQ', 4, NULL, array['$\{1, 2\}$', '$\{2, 3, 4, 5\}$', '$\{6, 7, 8\}$', '$\{0, 1, 2\}$']::text[]),
  ('MQ-0e91e9-2-0', '0e91e9', 15, '2', '(i) Neema had a recurring deposit account in a bank and deposited ₹ 2,500 per month for 2 years. If she gets ₹ 66250 at the time of maturity, find:

(a) The interest paid by the bank

(b) The rate of interest [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-0e91e9-2-1', '0e91e9', 16, '2', '(ii) If $A = \begin{bmatrix} 2 & 3 \\ -1 & 0 \end{bmatrix}$, $B = \begin{bmatrix} 3 & 2 \\ 0 & -3 \end{bmatrix}$ and $C = \begin{bmatrix} -2 & 0 \\ 3 & 1 \end{bmatrix}$, find $AC + B^2 - 5C$ [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-0e91e9-2-2', '0e91e9', 17, '2', '(iii) Prove that: $1 + \frac{\tan^2 A}{\sec A + 1} = \sec A$ [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-0e91e9-3-0', '0e91e9', 18, '3', '(i) The bottom of a cylindrical glass had a hemispherical portion raised as shown in the figure. If the inner radius of the glass is 3 cm and the height of the glass is 9 cm, find the capacity of the glass. [Take $\pi = \frac{22}{7}$] [4]', 4, 'Mensuration', 'long', 4, '0e91e9__Bhaktiveda_p4_img_0_jpeg.webp', NULL),
  ('MQ-0e91e9-3-1', '0e91e9', 19, '3', '(ii) Solve for $x$, using the properties of proportion. [4]

$$\frac{\sqrt{5x+6}+\sqrt{4x+1}}{\sqrt{5x+6}-\sqrt{4x+1}}=7$$', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-0e91e9-3-2', '0e91e9', 20, '3', '(iii) ABCD is a cyclic quadrilateral in the circle with centre O. ST is a tangent. $\angle OBD = 25^\circ$ and $\angle CBT = 30^\circ$. Find: [5]

(a) $\angle BDC$

(b) $\angle DBC$

(c) $\angle BAD$

(d) $\angle BOD$', 5, 'Circles', 'long', 5, '0e91e9__Bhaktiveda_p5_img_0_jpeg.webp', NULL),
  ('MQ-0e91e9-4-0', '0e91e9', 21, '4', '(i) Given a line segment AB joining the points $A$ (4, -2) and $B$ (1, 4). [3]

Find:

(a) The ratio in which AB is divided by the $x$ - axis.

(b) Find the co-ordinates of the point of intersection.', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-0e91e9-4-1', '0e91e9', 22, '4', '(ii) Radhi bought some pens for ₹ 360. When the price of each was reduced by ₹ 3, she could buy 6 more pens for the same cost of ₹ 360. Find the original cost of the pen. [3]', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-0e91e9-4-2', '0e91e9', 23, '4', '(iii) Rohan visits a shopping mall and buys the following items. [4]

A mobile phone costing ₹ 24000, GST @ 5%

A pair of shoes costing ₹ 3000, GST @ 18%

A water heater costing ₹ 16000 @ 28% with 10% discount.

Calculate:

(a) The total amount of GST paid.

(b) The total bill amount including GST paid by Rohan.', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-0e91e9-5-0', '0e91e9', 24, '5', '(i) Find the values of $x$, which satisfy the inequation. [3]

$$\frac{3x}{4} - 1 < \frac{x}{4} + 5 \leq x - \frac{1}{4}, \quad x \in R$$

Graph the solution set on the number line.', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-0e91e9-5-1', '0e91e9', 25, '5', '(ii) Use graph sheet for this question. Draw a histogram from the following frequency distribution and hence estimate the mode from the graph. Take 2 cm = ₹ 50 units along the x-axis and 2 cm = 2 students along the y-axis: [3]

| Pocket money (in ₹) | 150 – 200 | 200 – 250 | 250 – 300 | 300 – 350 | 350 – 400 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 14 | 12 | 9 | 3 | 4 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-0e91e9-5-2', '0e91e9', 26, '5', '(iii) In the given diagram, 4y = 3x + 8 meets y-axis at A.

[4]
Find:

(a) The co-ordinates of A.
(b) The equation of a line AB perpendicular to \( 4y = 3x + 8 \) and passing through A.', 4, 'Coordinate Geometry', 'long', 6, '0e91e9__Bhaktiveda_p6_img_0_jpeg.webp', NULL),
  ('MQ-0e91e9-6-0', '0e91e9', 27, '6', '(i) Solve the following quadratic equation,

[3]

$$4x^2 - 9x - 12 = 0$$

Give your answer correct to two places of decimal.', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-0e91e9-6-1', '0e91e9', 28, '6', '(ii) Prove that:

[3]

$$(cosec A + \sin A)^2 + (sec A + \cos A)^2 = tan^2 A + cot^2 A + 7$$', 3, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-0e91e9-6-2', '0e91e9', 29, '6', '(iii) In the given figure, O is the centre of circle. The tangent PT meets the diameter RQ produced at P. [4]

(a) Prove \(\Delta PQT\sim \Delta PTR\)
(b) If \(\mathrm{PT} = 12\mathrm{cm}\), \(\mathrm{QR} = 32\mathrm{cm}\), find the length of PQ.', 4, 'Circles', 'long', 6, '0e91e9__Bhaktiveda_p6_img_1_jpeg.webp', NULL),
  ('MQ-0e91e9-7-0', '0e91e9', 30, '7', '(i) A bag contains blue and green tennis balls. Of these 48 are green balls and the remaining blue. One ball is chosen at random and the probability that it is green is $$\frac{4}{13}$$. Find: [3]

(a) The total number of balls in the box.
(b) Probability of selecting a blue ball.', 3, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-0e91e9-7-1', '0e91e9', 31, '7', '(ii) Two ships are sailing in the sea on either side of a light house. The angles of depression of the ships from the top of the light house are $$42^{\circ}$$ and $$28^{\circ}$$. Find the distance between them, if the light house is 200 m high. Give your answer correct to the nearest meter. (Use Mathematical Table for this question.) [3]', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-0e91e9-7-2', '0e91e9', 32, '7', '(iii) Draw a line AB = 7 cm. Mark a point C on AB such that AC = 5 cm. Using a ruler and compass only, construct: [4]

(a) A circle of radius \(3.5 \, \text{cm}\), passing through A and C.
(b) Construct two tangents to the circle from the external point B.
(c) Measure and record the length of the tangents.', 4, 'Constructions', 'long', 7, NULL, NULL),
  ('MQ-0e91e9-8-0', '0e91e9', 33, '8', '(i) Show that $$2x + 7$$ is a factor of $$2x^3 + 5x^2 - 11x - 14$$. Hence factorise the given expression completely, using the factor theorem. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 7, NULL, NULL),
  ('MQ-0e91e9-8-1', '0e91e9', 34, '8', '(ii) Use a graph sheet for this question. The weight of 160 applicants for the Army are shown below: [6]

| Weight (in kg) | 50 – 55 | 55 – 60 | 60 – 65 | 65 – 70 | 70 – 75 | 75 – 80 | 80 – 85 | 85 – 90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of applicants | 5 | 8 | 16 | 26 | 40 | 28 | 21 | 16 |

Use 2 cm = 5 kg and 2 cm = 20 applicants along x-axis and y-axis respectively to draw an ogive and hence estimate:

(a) The median weight
(b) The lower quartile
(c) Percentage of applicants whose body weight is above \(87\mathrm{kg}\)', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-0e91e9-9-0', '0e91e9', 35, '9', '(i) The following table gives the groundnut oil prices per litre for a period of 60 days. [3]

| Price (in ₹) | 20 – 30 | 30 – 40 | 40 – 50 | 50 – 60 | 60 – 70 |
| --- | --- | --- | --- | --- | --- |
| No. of days | 6 | 16 | 22 | 13 | 3 |

Find the mean price of groundnut oil per litre to the nearest rupee using step – deviation method.', 3, 'Statistics', 'short', 8, NULL, NULL),
  ('MQ-0e91e9-9-1', '0e91e9', 36, '9', '(ii) If 12th term of an Arithmetic Progression (A.P.) is –13

and the sum of its first 4 terms is 24. Find: [3]

(a) The first and the common difference.
(b) The sum of first 10 terms.', 3, 'Arithmetic Progression', 'short', 8, NULL, NULL),
  ('MQ-0e91e9-9-2', '0e91e9', 37, '9', '(iii) Use graph sheet for this question. Take 2 cm = 2 unit along the axes. [4]

Plot the points A (1, 5), B (4, 2), C (–2, 0), D (2, –2) and E (–2, –6).

(a) Reflect A on the \(x\) - axis and name it as \(A''\).
(b) Reflect the points B, C, D and E on \( AA'' \) and name them as \( B'', C'', D'' \) and \( E'' \) respectively.
(c) Join the points A, B, \( C'' \), D, \( E'' \), \( A'' \), E, \( D'' \), C and \( B'' \). Give the geometrical name of the closed figure so formed.
(d) Name one point from the figure which is invariant on reflection in \( x \)-axis as well as in the line \( AA'' \).', 4, 'Coordinate Geometry', 'long', 8, NULL, NULL),
  ('MQ-673ee3-1-0', '673ee3', 0, '1', '1. If ''d'' be the HCF of 24 and 36, what will be the value of a and b when $$d = 24a + 36b$$
 a) $$(-1, 1)$$ b) $$(1, -1)$$ c) $$(1, 1)$$ d) $$(-1, -1)$$', 1, NULL, 'short', 1, NULL, NULL),
  ('MQ-673ee3-2-0', '673ee3', 1, '2', '2. If the least prime factor of a is 5 and least prime factor of b is 13, then the least prime factor of $$a + b$$ will be', 1, NULL, 'MCQ', 1, NULL, array['1', '2', '3 5', '13']::text[]),
  ('MQ-673ee3-3-0', '673ee3', 2, '3', '3. If the zeros of the quadratic polynomial $x^2 + (a + 1)x + b$ are 2 and -3 then

a) $a = -7, b = -1$

b) $a = 5, b = -1$

d) $a = 0, b = -6$

c) $a = 2, b = -6$', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-673ee3-4-0', '673ee3', 3, '4', 'Zeroes of the polynomial given by the graph $y = f(x)$ will be', 1, 'Quadratic Equations', 'MCQ', 2, '673ee3__Bhavans_Ga_p2_img_0_jpeg.webp', array['$-4, 2, 0$', '$-4, -1, 2$', '$-4, 1, 0$', '$-4, 4, 0$']::text[]),
  ('MQ-673ee3-5-0', '673ee3', 4, '5', '5. If $x = a$ and $y = b$ is the solution of the pair of equations $x - y = 2$ and $x + y = 4$ then the respective values of $a$ and $b$ are', 1, NULL, 'MCQ', 2, NULL, array['$3, 5$', '$5, 3$', '$3, 1$', '$-1, -3$']::text[]),
  ('MQ-673ee3-6-0', '673ee3', 5, '6', '6. $\sin\theta - \cos\theta = 0$, then the value of $\sin^6\theta + \cos^6\theta$ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$2/3$', '$1/3$', '$3/4$', '$1/4$']::text[]),
  ('MQ-673ee3-7-0', '673ee3', 6, '7', '7. In fig. AM = MC and $\angle C$ is a right angle, then $\sin^2\alpha - \cos^2\alpha$ is equal to', 1, 'Trigonometry', 'MCQ', 2, '673ee3__Bhavans_Ga_p2_img_1_jpeg.webp', array['$\frac{4b^2 - 3a^2}{5a^2 - 4b^2}$', '$\frac{5a^2 - 4b^2}{4b^2 - 3a^2}$', '$\frac{4a^2 - 5b^2}{3b^2 - 4a^2}$', '$\frac{3b^2 - 4a^2}{4a^2 - 5b^2}$']::text[]),
  ('MQ-673ee3-8-0', '673ee3', 7, '8', '8. A piece of wire 20 cm long is bent into the form of an arc of a circle subtending an angle of $60^\circ$ at its centre. The radius of the circle is', 1, 'Mensuration', 'MCQ', 2, NULL, array['$\frac{60}{\pi} \text{cm}$', '$\frac{30}{\pi} \text{cm}$', '$\frac{20}{\pi} \text{cm}$', '$\frac{50}{\pi} \text{cm}$']::text[]),
  ('MQ-673ee3-9-0', '673ee3', 8, '9', '9.
The inner and outer diameters of ring I are 32 cm and 34 cm respectively and that of ring II are 19 cm and 21 cm. The total area (in sq.cm) of these two rings will be', 1, 'Mensuration', 'MCQ', 3, '673ee3__Bhavans_Ga_p3_img_0_jpeg.webp', array['53π', '52π', '33π', '20π']::text[]),
  ('MQ-673ee3-10-0', '673ee3', 9, '10', '10. If the origin is the centroid of a triangle whose vertices are A (a, b), B (b, c) and C(c, a) then the value of a³ + b³ + c³ is', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['3 bc', '3 ab', '3 ca', '3 abc']::text[]),
  ('MQ-673ee3-11-0', '673ee3', 10, '11', '11. In a caravan, in addition to 50 hens there are 45 goats and 8 camels with some keepers. If the total no of feet be 224 more than the number of heads, the number of keepers will be', 1, NULL, 'MCQ', 3, NULL, array['15', '10', '30']::text[]),
  ('MQ-673ee3-12-0', '673ee3', 11, '12', '12. If α, β are the roots of the equation
(a + 1)x² + (2a + 3)x + (3a + 4) = 0 and α,β = 2; the value of α + β will be', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['0', '-1', '1', '2']::text[]),
  ('MQ-673ee3-13-0', '673ee3', 12, '13', '13. If the arithmetic mean of two numbers a and b is 8 and ab = 9 the quadratic equation whose roots are a and b will be', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['-x² + 16x + 9 = 0', 'x² - 9x + 16 = 0', 'x² - 16x + 9 = 0', 'x² + 16x + 9 = 0']::text[]),
  ('MQ-673ee3-14-0', '673ee3', 13, '14', '14. If Σfᵢ = 11, Σfᵢxᵢ = 2p + 52 and the mean of any distribution is 6, the value of p will be', 1, 'Statistics', 'MCQ', 3, NULL, array['0', '4', '6', '7']::text[]),
  ('MQ-673ee3-15-0', '673ee3', 14, '15', '15. If A(5,p), B(1,5), C(2,1), D(6,2) taken in order are the vertices of a square then p is equal to', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['7', '3', '6', '8']::text[]),
  ('MQ-673ee3-16-0', '673ee3', 15, '16', '16. If the midpoint of the line segment joining (3, 4) and (k, 7) is (x, y) and it lies on 2x + 2y + 1=0 then the value of k will be', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['10', '-15', '15', '-10']::text[]),
  ('MQ-673ee3-17-0', '673ee3', 16, '17', 'ΔPQR is shown above. ST is drawn such that ΔPRQ - ΔSTQ and QT : TR = 2:3, PR = 20c then ST is', 1, 'Similarity', 'MCQ', 4, '673ee3__Bhavans_Ga_p4_img_0_jpeg.webp', array['10/3 cm', '8 cm', '12 cm', '40/3 cm']::text[]),
  ('MQ-673ee3-18-0', '673ee3', 17, '18', '18. If Secα - tan α = m then sec⁴α - tan⁴α - 2secα tan α is equal to', 1, 'Trigonometry', 'MCQ', 4, NULL, array['m²', '-m²', '1/m²', '-1/m²']::text[]),
  ('MQ-673ee3-19-0', '673ee3', 18, '19', '19. Statement A (assertion) : If the value of mode and mean is 60 and 66 respectively, then the value of median is 64
Statement R (Reason) : Median = 1/2 (mode + 2 mean)', 1, 'Statistics', 'MCQ', 4, NULL, array['Both A and R are true and R is the correct explanation for A', 'Both A and R are true but R is not the correct explanation for A', 'A is true but R is false', 'A is false but R is true']::text[]),
  ('MQ-673ee3-20-0', '673ee3', 19, '20', '20. Statement A (assertion) : D and E are the points on the sides AB and AC of ΔABC such that AD = x cm, AE = (x + 2) cm, DB = (x - 2) cm, EC = (x - 1) cm. If DE || BC then x = 4.
Statement R (Reason) : If a line drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then the other two sides are divided in the same ratio.', 1, 'Similarity', 'MCQ', 4, NULL, array['Both A and R are true and R is the correct explanation for A.', 'Both A and R are true but R is not the correct explanation for A.', 'A is true but R is false.', 'A is false but R is true.']::text[]),
  ('MQ-673ee3-21-0', '673ee3', 20, '21', '21. The LCM of two numbers is 12 times their HCF. The sum of HCF and LCM is 403. If one of the number is 93, find the other.', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-673ee3-22-0', '673ee3', 21, '22', '22. If one zero of the polynomial 3x² - 8x + 2k + 1 is seven times the other, find the value of k.', 2, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-673ee3-22-1', '673ee3', 22, '22', 'If one zero of the quadratic polynomial $f(x) = 4x^2 - 8kx + 8x - 9$ is negative of the other, then find the zeroes of $kx^2 + 3kx + 2$', 2, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-673ee3-23-0', '673ee3', 23, '23', '23. If $\cos \theta - \sin \theta = \sqrt{2} \sin \theta$, prove that $\cos \theta + \sin \theta = \sqrt{2} \cos \theta$.', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-673ee3-23-1', '673ee3', 24, '23', 'If $3 \cos^2 60^\circ + 2 \cot^2 30^\circ - 5 \sin^2 45^\circ = \frac{17}{4} \sin(90^\circ - \theta)$ find $\theta$.', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-673ee3-24-0', '673ee3', 25, '24', '24. If $\sec \theta = x + \frac{1}{4x}$ prove that $\sec \theta + \tan \theta = 2x$ or $\frac{1}{2x}$', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-673ee3-25-0', '673ee3', 26, '25', '25.

In the given figure, AB || DE and BD || EF

Prove that $DC^2 = CF \times AC$', 2, 'Similarity', 'short', 5, '673ee3__Bhavans_Ga_p5_img_0_jpeg.webp', NULL),
  ('MQ-673ee3-26-0', '673ee3', 27, '26', '26. From a stationary shop, Archana bought two pencils and three pens for ₹40 and Indu bought one pencil and two pens for ₹25. Find the price of one pencil and one pen graphically. Consider cost of a pencil and a pen be $2x$ and $7y$ respectively.', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-673ee3-27-0', '673ee3', 28, '27', '27. A motor boat whose speed is $18 \text{ km/hr}$ in still water takes 1 hr. more to go $24 \text{ km}$ upstream than to return downstream to the same spot. Find the speed of the stream.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-673ee3-27-1', '673ee3', 29, '27', 'A trader bought a number of articles for ₹900, five articles were found damaged. He sold each of the remaining articles at ₹2 more than what he paid for it. He got a profit of ₹80 on the whole transaction. Find the number of articles he bought.', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-673ee3-28-0', '673ee3', 30, '28', '28. Find the median for the following frequency distribution

| Height (cm) | 160-162 | 163-165 | 166-168 | 169-171 | 172-174 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 15 | 117 | 136 | 118 | 14 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-673ee3-29-0', '673ee3', 31, '29', 'In the given fig. AM $\perp$ BC If $\tan B = \frac{3}{4}$, $\tan C = \frac{5}{12}$ and BC $= 56 \text{ cm}$, find the length of AM. X-Math. (5) (Turn Over)', 3, 'Trigonometry', 'short', 5, '673ee3__Bhavans_Ga_p5_img_1_jpeg.webp', NULL),
  ('MQ-673ee3-30-0', '673ee3', 32, '30', '30. A(0, 3), B(-1, -2) and C(4, 2) are vertices of ΔABC D is a point on the side BC such that BD/DC = 1/2. P is a point on AD such that AP = 2√5/3 units. Find the coordinates of P. OR', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-673ee3-30-1', '673ee3', 33, '30', 'The base BC of an equilateral triangle ABC lies on y-axis. The co-ordinates of point C are (0, -3). The origin is the midpoint of the base. Find the co-ordinates of the points A and B. Also find the co-ordinates of another point D such that BACD is a rhombus.', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-673ee3-31-0', '673ee3', 34, '31', '31. The diameters of the front and rear wheels of a tractor are 80 cm and 2 m respectively. Find the number of revolutions that rear wheel will make to cover the distance which the front wheel covers in 1400 revolutions (use π = 22/7).', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-673ee3-32-0', '673ee3', 35, '32', '32. In a flight of 600 km, an aircraft was slowed due to bad weather. Its average speed for the trip was reduced by 200 km/hr and time of flight increased by 30 minutes. Find the original duration of the flight.', 5, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-673ee3-32-1', '673ee3', 36, '32', 'a) If the equation \((1 + \mathrm{m}^2)\mathrm{x}^2 + 2\mathrm{mcx} + \mathrm{c}^2 - \mathrm{a}^2 = 0\) has equal roots, show that \(c^2 = a^2(1 + m^2)\)', NULL, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-673ee3-32-2', '673ee3', 37, '32', 'b) The mean of the following frequency table is 50. But the frequencies \( f_{1} \) and \( f_{2} \) in class 20 - 40 and 60 - 80 respectively are missing. Find the missing frequencies.

| Classes | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 17 | f₁ | 32 | f2 | 19 | 120 |', NULL, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-673ee3-33-0', '673ee3', 38, '33', '33. Two trains each \(80\mathrm{m}\) long passes each other on parallel lines. If they are going in the same direction, the faster train takes one minute to pass the other completely. If they are going in opposite directions, they overtake each other in 3 seconds. Find the speed of each train in \(\mathrm{km / hr}\).', 5, NULL, 'long', 6, NULL, NULL),
  ('MQ-673ee3-34-0', '673ee3', 39, '34', '34. ABCD is a prallelogram. AB is divided at P and CD at Q so that AP:PB = 3:2 and CQ:QD = 4:1 If P and Q meets AC at R, then prove that AR = 3/7 AC', 5, 'Similarity', 'long', 6, NULL, NULL),
  ('MQ-673ee3-34-1', '673ee3', 40, '34', 'In ΔABC, AD is a medium. X is a point on AD such that AX:XD=2:3 Ray BX intersects AC in Y. Prove that BX = 4XY. OR', 5, 'Similarity', 'long', 6, NULL, NULL),
  ('MQ-673ee3-35-0', '673ee3', 41, '35', '35. In a circle of radius 21 cm, an arc subtends an angle of 60° at the centre (Use π = 22/7). Find i) the length of the arc
ii) the area of the sector formed by the arc. iii) area of the segment formed by the corresponding arc. (6)', 6, 'Mensuration', 'long', 6, NULL, NULL),
  ('MQ-673ee3-36-0', '673ee3', 42, '36', '36. A seminar is being conducted by an Educational Organisation, where the participants will be educators of different subjects. The number of participants in Hindi, English and Mathematics are 60, 84 and 108 respectively.

Read the above paragraph and answer the following questions.

i) In each room the same number of participants are to be seated and all of them being in the same subject. What is the maximum number of participants that can be accommodated in each room.
ii) What is the minimum number of rooms required during the event?', 2, NULL, 'short', 7, NULL, NULL),
  ('MQ-673ee3-36-1', '673ee3', 43, '36', 'iii) The HCF and LCM of two numbers are 50 and 250 respectively. The first number is divided by 2 and the quotient is 50. Find the second number.', 2, NULL, 'short', 7, NULL, NULL),
  ('MQ-673ee3-36-2', '673ee3', 44, '36', 'iii) Find the greatest number that will divide 445, 572 and 699 leaving remainders 4, 5 and 6 respectively.', 2, NULL, 'short', 7, NULL, NULL),
  ('MQ-673ee3-37-0', '673ee3', 45, '37', '37. Two friends Trisha and Rohan during their summer vacations went to Manali. They decided to go for trekking. While trekking they observed that the trekking path is in the shape of a parabola. The mathematical representation of the track is shown in the graph. Coordinates of A

X-Math.

x
(7)

(Turn Over)
Based on the above information answer the following question :

i) Find the zeros of the polynomial whose graph is given.
ii) What will be the expression of the given polynomial?', 2, NULL, 'short', 7, '673ee3__Bhavans_Ga_p7_img_2_jpeg.webp', NULL),
  ('MQ-673ee3-37-1', '673ee3', 46, '37', 'iii) If one zero of the quadratic polynomial \(2x^{2} - 3x + p\) is 3, find the other zero.', 2, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-673ee3-37-2', '673ee3', 47, '37', 'iii) If $\alpha$ and $\beta$ are the zeros of the quadratic polynomial $4x^2 + 4x + 1$, then form a quadratic polynomial whose zeros are $2\alpha$ and $2\beta$.', 2, 'Quadratic Equations', 'short', 8, NULL, NULL),
  ('MQ-673ee3-38-0', '673ee3', 48, '38', '38. Show below is a map of Giri''s neighbourhood.

Giri did a survey of his neighbourhood and collected the following informations.

The hotel, mall and the maingate of the garden lie in a straight line.
The firestation, bus stand and the main gate of the garden lie in a straight line.
The distance between the hotel and the mall is half the distance between the mall and the maingate of the garden.
The bus stand is exactly midway between the maingate of the garden and the fire station
The mall, bus stand and the water tank lie in a straight line.

Answer the following questions based on the informations given ;

i) What is the X - Coordinate of the mall''s location?
ii) What are the co-ordinates of the fire station?', 2, 'Coordinate Geometry', 'short', 8, '673ee3__Bhavans_Ga_p8_img_0_jpeg.webp', NULL),
  ('MQ-673ee3-38-1', '673ee3', 49, '38', 'iii) If Giri wishes to reach the school from fire station via the water tank, what is the shortest distance covered in this route?', 2, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-673ee3-38-2', '673ee3', 50, '38', 'iii) How much more is the shortest distance of the school from the water tank than the distance of the school from the police station?', 2, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-a30fc0-1-0', 'a30fc0', 0, '1', 'Given m+2 (where m is a positive integer) is a zero of the polynomial q(x) = x² - mx - 6, which of these is the value of m?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['4', '3', '2', '1']::text[]),
  ('MQ-a30fc0-2-0', 'a30fc0', 1, '2', 'D and E are respectively the points on the sides AB and AC of a triangle ABC such that AD = 3cm, BD = 5cm, BC = 12.8cm and DE || BC. Then the length of DE is', 1, 'Similarity', 'MCQ', 1, NULL, array['4.8cm', '7.6cm', '19.2cm', '2.5cm']::text[]),
  ('MQ-a30fc0-3-0', 'a30fc0', 2, '3', 'The value of $$\frac{2 \tan 30^0}{1 - \tan^2 30^0}$$ is equal to', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$$\cos 60^0$$', '$$\sin 60^0$$', '$$\tan 60^0$$', '$$\sin 30^0$$']::text[]),
  ('MQ-a30fc0-4-0', 'a30fc0', 3, '4', '4. Consider the equation kx² + 2x = c(2x² + b). For the equation to be quadratic, which of these cannot be the value of k?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['2c', '3c', '4c', '2c+2b']::text[]),
  ('MQ-a30fc0-5-0', 'a30fc0', 4, '5', '5. If the LCM of 12 and 42 is 10m + 4, then the value of m is', 1, NULL, 'MCQ', 1, NULL, array['50', '8', '$$\frac{1}{5}$$', '1']::text[]),
  ('MQ-a30fc0-6-0', 'a30fc0', 5, '6', 'In the figure given, the pair of tangents AP and AQ drawn from an external point A to a circle with centre O are perpendicular to each other and length of each tangent is 5cm. Then the radius of circle is
( 1 )
( Turn Over )', 1, 'Circles', 'MCQ', 1, 'a30fc0__Bhavans_Ga_p2_img_0_jpeg.webp', array['10cm', '7.5 cm', '5 cm', '2.5 cm']::text[]),
  ('MQ-a30fc0-7-0', 'a30fc0', 6, '7', 'For the following distribution :

| Class | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 15 | 12 | 20 | 9 |

Find the sum of lower limits of the median class and modal class.', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-8-0', 'a30fc0', 7, '8', 'If the perimeter of a semicircular protractor is 36 cm, find its area.', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-9-0', 'a30fc0', 8, '9', 'Check if $(x^2+2x)^2=x^4+3+4x^2$ is a quadratic equation. Justify your answer.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-10-0', 'a30fc0', 9, '10', 'If $\tan \alpha = \sqrt{3}$ and $\tan \beta = \frac{1}{\sqrt{3}}$, then find the value of $\cot(\alpha + \beta)$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-11-0', 'a30fc0', 10, '11', 'Find the nature of the roots of the equation $2x^2 - \sqrt{5}x + 1 = 0$.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-12-0', 'a30fc0', 11, '12', 'Find the zeros of the polynomial $x^2 - 3x - m(m + 3)$.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-13-0', 'a30fc0', 12, '13', 'The radius of a wheel is 0.25m. Find the number of revolutions if will make to travel a distance of 11 km.', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-14-0', 'a30fc0', 13, '14', 'If the centroid of the triangle formed by points P(a,b), Q(b,c) and R(c,a) is at the origin, what is the value of a+b+c?', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-15-0', 'a30fc0', 14, '15', 'Given $\sqrt{2}$ is irrational, prove that $(5 + 3\sqrt{2})$ is an irrational number.', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-a30fc0-15-1', 'a30fc0', 15, '15', 'Find the point on the x-axis which is equidistant from $(2, -5)$ and $(-2, 9)$.', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-16-0', 'a30fc0', 16, '16', 'If $\triangle ABC - \triangle DEF$ and $AB = 4$ cm, $BC = 3.5$ cm, $CA = 2.5$ cm and $DF = 7.5$ cm, then find the perimeter of $\triangle DEF$.', 2, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-17-0', 'a30fc0', 17, '17', 'Quadratic polynomial $2x^2 - 3x + 1$ has zeros as $\alpha$ and $\beta$. Now form a quadratic polynomial whose zeros are $3\alpha$ and $3\beta$.', 2, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-18-0', 'a30fc0', 18, '18', 'In $\triangle ABC$, right angled at B, given $\angle x : \angle y = 1 : 2$. Find the value of $\tan x$.', 2, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-19-0', 'a30fc0', 19, '19', 'If one zero of the quadratic polynomial $P(x) = x^2 + 4kx - 25$ is negative of the other, find the value of k.', 2, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-20-0', 'a30fc0', 20, '20', 'The difference between the circumference and radius of a circle is 37 cm. Find the area of circle.', 2, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-21-0', 'a30fc0', 21, '21', 'Compute the mode for the following frequency distribution

| Size of items (in cm) | 0-4 | 4-8 | 8-12 | 12-16 | 16-20 | 20-24 | 24-28 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 7 | 9 | 17 | 12 | 10 | 6 |', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-22-0', 'a30fc0', 22, '22', 'If $1 + \sin^2 \theta = 3 \sin \theta \cos \theta$, prove that $\tan \theta = 1$ or $\frac{1}{2}$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-22-1', 'a30fc0', 23, '22', 'Prove that $\frac{\sin A - 2\sin^3 A}{2\cos^3 A - \cos A} = \tan A$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-23-0', 'a30fc0', 24, '23', 'Find ''c'' if the system of equations

$cx + 3y + (3 - c) = 0$

$12x + cy - c = 0$ has infinitely many solutions.', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-a30fc0-24-0', 'a30fc0', 25, '24', 'ABCD is a trapezium with AB||DC. E and F are points on non-parallel sides AD and BC respectively, such that EF||AB.

Show that $\frac{AE}{ED} = \frac{BF}{FC}$', 3, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-25-0', 'a30fc0', 26, '25', 'In figure, XY and $X''Y''$ are two parallel tangents to a circle with centre O and another tangent AB with point of contact C intersecting XY at A and $X''Y''$ at B. Prove that $\angle AOB = 90^\circ$', 3, 'Circles', 'short', 2, 'a30fc0__Bhavans_Ga_p2_img_1_jpeg.webp', NULL),
  ('MQ-a30fc0-26-0', 'a30fc0', 27, '26', 'Using quadratic formula solve the following quadratic equation

$p^2x^2 + (p^2 - q^2)x - q^2 = 0$', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-a30fc0-27-0', 'a30fc0', 28, '27', '27. The present age of a father is three years more than three times the age of his son. Three years hence the father''s age will be 10 years more than twice the age of the son. Determine their present ages.', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-a30fc0-28-0', 'a30fc0', 29, '28', '28. Find the area of the shaded region in the given figure, where arcs drawn with centre A, B, C and D intersect in pairs at mid points P, Q, R, S of the sides AB, BC, CD and DA respectively of a square ABCD of side 12 cm.

[Use $\pi = 3.14$]', 3, 'Mensuration', 'short', 2, 'a30fc0__Bhavans_Ga_p3_img_0_jpeg.webp', NULL),
  ('MQ-a30fc0-29-0', 'a30fc0', 30, '29', '29. Determine if points A(3,5), B(6,0), C(1, -3) are collinear or not. (Use distance formula)', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-a30fc0-30-0', 'a30fc0', 31, '30', 'If the roots of the quadratic equation (a - b)x² + (b - c)x + (c - a) = 0 are equal, prove that 2a = b + c.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-a30fc0-31-0', 'a30fc0', 32, '31', '31. In the given figure, a ΔABC is drawn to circumscribe a circle of radius 2 cm such that the segments BD and DC into which BC is divided by the point of contact D are of lengths 4 cm and 3 cm respectively. If the area of ΔABC=21cm², then find the lengths of sides AB and AC.', 4, 'Circles', 'long', 3, 'a30fc0__Bhavans_Ga_p3_img_1_jpeg.webp', NULL),
  ('MQ-a30fc0-31-1', 'a30fc0', 33, '31', 'PQ is a chord of length 8 cm of a circle of radius 5 cm. The tangents at P and Q intersect at a point T. Find the length TP', 4, 'Circles', 'long', 3, 'a30fc0__Bhavans_Ga_p3_img_2_jpeg.webp', NULL),
  ('MQ-a30fc0-32-0', 'a30fc0', 34, '32', '32. If the median of the following frequency distribution is 32.5, find the values of f₁ and f₂

| Class | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | f₁ | 5 | 9 | 12 | f₂ | 3 | 2 | 40 |', 4, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-a30fc0-x-0', 'a30fc0', 35, NULL, 'ii) The quadratic equation in terms of speed of Raj''s car is
a) $$x^2 - 5x - 500 = 0$$
b) $$x^2 + 4x - 400 = 0$$
c) $$x^2 + 5x - 500 = 0$$
d) $$x^2 - 4x + 400 = 0$$
iii) What is the speed of Raj''s car?', NULL, 'Quadratic Equations', 'MCQ', 4, NULL, array['20 km/hour', '15 km/hour', '25 km/hour', '10 km/hour']::text[]),
  ('MQ-a30fc0-x-1', 'a30fc0', 36, NULL, 'iv) How much time Ajay took to travel 400 km?', NULL, NULL, 'MCQ', 4, NULL, array['20 hours', '40 hours', '25 hours', '16 hours']::text[]),
  ('MQ-a30fc0-36-0', 'a30fc0', 37, '36', '36. In order to conduct Sports Day activities in your school, lines have been drawn with chalk powder at a distance of 1m each, in a rectangular shaped ground ABCD, 100 flowerpots have been placed at a distance of 1m from each other along AD, as shown in given figure below.
Niharika runs $$\frac{1}{4}$$ th the distance AD on the 2nd line and posts a green flag. Preet runs $$\frac{1}{5}$$ th distance AD on the eighth line and posts a red flag.
i) The position of green flag is
a) (2,25)
b) (2, 0.25)
c) (25,2)
d) (0, -25)
ii) The position of red flag is
a) (8, 0)
b) (20, 8)
c) (8, 20)
d) (8, 0.2)
iii) If Rashmi has to post a blue flag exactly halfway between the line segment joining the two flags, where should she post her flag?
a) (5, 22.5)
b) (10, 22)
c) (2, 8.5)
d) (2.5, 20)
iv) What is the distance between both the flags initially?', 4, 'Coordinate Geometry', 'MCQ', 4, 'a30fc0__Bhavans_Ga_p4_img_0_jpeg.webp', array['$$\sqrt{4}1\text{m}$$', '$$\sqrt{1}1\text{m}$$', '$$\sqrt{6}1\text{m}$$', '$$\sqrt{5}1\text{m}$$']::text[]),
  ('MQ-9b6d6d-1-0', '9b6d6d', 0, '1', '1. Two AP''s have same common difference. The first term of one of them is - 1 and that of other is - 8. The difference between their 4th terms is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['- 1', '- 8', '7', '- 9']::text[]),
  ('MQ-9b6d6d-2-0', '9b6d6d', 1, '2', '2. The perimeter of a circle is equal to that of a square. The ratio of their areas is', 1, 'Mensuration', 'MCQ', 1, NULL, array['22:7', '14:11', '7:22', '11:14']::text[]),
  ('MQ-9b6d6d-3-0', '9b6d6d', 2, '3', '3. If a card is drawn from a deck of cards, what is the probability of card drawn to be a red or a black card and what can be said about that event?', 1, 'Probability', 'MCQ', 1, NULL, array['0 and it is a sure event', '1 and it is a sure event', '0 and it is an impossible event', '1 and it is an impossible event']::text[]),
  ('MQ-9b6d6d-4-0', '9b6d6d', 3, '4', '4. The length of the tangent drawn from a point 8 cm away from the centre of a circle of radius 6 cm is', 1, 'Circles', 'MCQ', 1, NULL, array['10 cm', '5 cm', '$$\sqrt{7}cm$$', '$$2\sqrt{7}cm$$']::text[]),
  ('MQ-9b6d6d-5-0', '9b6d6d', 4, '5', 'The difference between the circumference and radius of a circle is 74 cm. Find area of the circle.', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-6-0', '9b6d6d', 5, '6', 'Find the area of the square that can be inscribed in a circle of radius 8 cm.', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-7-0', '9b6d6d', 6, '7', 'What is the probability that a leap year has 53 Sundays?', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-8-0', '9b6d6d', 7, '8', '8. 20 tickets on which numbers 1 to 20 are written, are mixed thoroughly and then a ticket is drawn at random out of them. Find the probability that the number on the drawn ticket is a multiple of 3 or 7.', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-9-0', '9b6d6d', 8, '9', '9. If 7 times the \(7^{\text{th}}\) term of an AP is equal to 11 times its \(11^{\text{th}}\) term, then find 18th term.', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-10-0', '9b6d6d', 9, '10', '10. In figure, PQ is a tangent of length 6 cm to the circle with centre O and \(\angle OQP = 60^{\circ}\) Find OQ.', 1, 'Circles', 'short', 2, '9b6d6d__Bhavans_Ga_p2_img_0_jpeg.webp', NULL),
  ('MQ-9b6d6d-11-0', '9b6d6d', 10, '11', '11. Find a, b, c if it is given that the numbers a, 7, b, 23, c are in AP.', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-9b6d6d-12-0', '9b6d6d', 11, '12', '12. In figure, a circle is touching the side BC of \(\Delta ABC\) at P and touching AB and AC produced at Q and R respectively.

Prove that $$AQ = \frac{1}{2}$$ (perimeter of $$\Delta ABC$$)

(2)', 2, 'Circles', 'short', 2, '9b6d6d__Bhavans_Ga_p3_img_0_jpeg.webp', NULL),
  ('MQ-9b6d6d-13-0', '9b6d6d', 12, '13', '13. Find the area of the flower bed (with semicircular ends) shown in the figure given below (use $\pi = 3.14$ )', 2, 'Mensuration', 'short', 3, '9b6d6d__Bhavans_Ga_p3_img_1_jpeg.webp', NULL),
  ('MQ-9b6d6d-14-0', '9b6d6d', 13, '14', '14. In figure, ABCD is a rectangle with AB = 80 cm and BC = 70 cm. If $\angle AED = 90^\circ$, DE = 42 cm and a semicircle is drawn with BC as diameter, find the area of the shaded region', 3, 'Mensuration', 'short', 3, '9b6d6d__Bhavans_Ga_p3_img_2_jpeg.webp', NULL),
  ('MQ-9b6d6d-15-0', '9b6d6d', 14, '15', '15. Kanika was given her pocket money on 1st January, 2019. She puts Re. 1 on day 1, Rs. 2 on day 2, Rs. 3 on day 3, and continued on doing so till the end of the month, from this money into her piggy bank. She also spent Rs. 204 of her

X-Math.

( 3 )

( Turn Over )
pocket money and found that at the end of the month, she still had Rs. 100 with her. How much money was her pocket money for the month?', 3, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-9b6d6d-16-0', '9b6d6d', 15, '16', '16. In figure, ABC is a triangle in which ∠B=90°, BC = 48 cm and AB = 14cm. A circle with centre O is inscribed in the triangle. Find radius r of the circle.', 3, 'Circles', 'short', 4, '9b6d6d__Bhavans_Ga_p4_img_0_jpeg.webp', NULL),
  ('MQ-9b6d6d-17-0', '9b6d6d', 16, '17', '17. From a pack of 52 playing cards, jacks, queens and kings of red colour are removed. From the remaining, a card is drawn at random. Find the probability that the card drawn is

a) a black king
b) a card of red colour
c) a card of black colour', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-9b6d6d-18-0', '9b6d6d', 17, '18', '18. The sum of the third term and the seventh term of an AP is 6 and their product is 8. Find the sum of first 16 terms of the AP.', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-9b6d6d-19-0', '9b6d6d', 18, '19', '19. In figure, ABC is a right angled triangle. ∠B=90°, AB = 28 cm and BC = 21 cm. With AC as diameter, a semi-circle is drawn and with BC as radius, a quarter circle is drawn. Find area of the shaded region.

(4)', 4, 'Mensuration', 'long', 4, '9b6d6d__Bhavans_Ga_p5_img_0_jpeg.webp', NULL),
  ('MQ-9b6d6d-20-0', '9b6d6d', 19, '20', '# 20. Case study:

The modern day cubical dice originated in China and have been dated back as early as 600 BC. Dice were handicrafted and produced on a small scale until the 20th century. A pair of dice is rolled.

Based on the above information, answer the following questions:

- a) What is the probability of getting a doublet of prime numbers? (1)
- b) What is the probability of getting a product of 12? (1)
- c) What is the probability that the product of the numbers is a perfect square? (2, 2), (3, 3), (4, 4), (6, 6), (5, 5)
- d) What is the probability of getting a product of 7? (1)', 5, 'Probability', 'long', 5, NULL, NULL),
  ('MQ-6dc917-1-0', '6dc917', 0, '1', '1) The ratio of LCM and HCF of the least composite and the least prime numbers is

a) 1:2 b) 2:1 c) 1:1 d) 1:3', 1, NULL, 'short', 1, NULL, NULL),
  ('MQ-6dc917-2-0', '6dc917', 1, '2', '2) Rahul follows the below steps to find the roots of the equation $$3x^2 - 11x - 20 = 0$$, by splitting the middle term.
Step 1 : $$3x^2 - 11x - 20 = 0$$
Step 2 : $$3x^2 - 15x + 4x - 20 = 0$$
Step 3 : $$3x(x-5) + 4(x-5) = 0$$
Step 4 : $$(3x - 4)(x - 5) = 0$$
Step 5 : $$x = \frac{4}{5}$$ and 5
In which step did Rahul make the first error?', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['step 1', 'step 2', 'step 3', 'step 4']::text[]),
  ('MQ-6dc917-3-0', '6dc917', 2, '3', '3) If one zero of the polynomial $p(y) = 5y^2 + 13y + m$ is reciprocal of the other, then the value of $m$ is
a) 6 b) 0 c) 5 d) $\frac{1}{3}$', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-6dc917-4-0', '6dc917', 3, '4', '4) One equation of a pair of coincident linear equations is $-5x + 7y = 2$. The second equation can be
a) $10x + 14y + 4 = 0$ b) $-10x - 14y + 4 = 0$
c) $-10x + 14y + 4 = 0$ d) $10x - 14y = -4$', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-6dc917-5-0', '6dc917', 4, '5', '5) The perimeter of a triangle with vertices $(0, 4), (0, 0)$ and $(3, 0)$ is
a) 5 units b) 12 units c) 11 units d) 7 units', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-6dc917-6-0', '6dc917', 5, '6', '6) Given quadrilateral ABCD - quadrilateral PQRS.

Then X is
a) 13 units b) 12 units c) 6 units d) 15 units', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-6dc917-7-0', '6dc917', 6, '7', '7) If $\sqrt{2} \sin(60^\circ - \alpha) = 1$, then the value of $\alpha$ is
a) $45^\circ$ b) $15^\circ$ c) $60^\circ$ d) $30^\circ$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-6dc917-8-0', '6dc917', 7, '8', '8) If $A = \cos^2 x + \sec^2 x$, then A is
a) $\ge 1$ b) $\le 1$ c) $\ge 2$ d) $\le 2$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-6dc917-9-0', '6dc917', 8, '9', '9) In the figure, DE/AC and DF/AE.

Then $\frac{BF}{FE} =$
a) $\frac{BC}{EC}$ b) $\frac{BE}{EC}$ c) $\frac{BF}{FC}$ d) $\frac{BE}{FC}$', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-6dc917-10-0', '6dc917', 9, '10', '10) ABCD is a trapezium such that AB/DC and AB = 3 cm. If diagonals AC and BD intersect at O such that $\frac{AO}{OC} = \frac{BO}{OD} = \frac{1}{2}$, then DC is equal to
a) 3 cm b) 6 cm c) 9 cm d) 12 cm', 1, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-6dc917-11-0', '6dc917', 10, '11', '11) PQ is a tangent to a circle with centre O at point P.
If $\Delta OPQ$ is isosceles, then $\angle OQP$ is
a) $30^\circ$ b) $60^\circ$ c) $45^\circ$ d) $90^\circ$', 1, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-6dc917-12-0', '6dc917', 11, '12', '12) The ratio of the areas of a circle and an equilateral triangle whose diameter and a side are respectively equal, is
a) $\pi: 2$ b) $\pi: \sqrt{3}$ c) $\sqrt{3}: \pi$ d) $\sqrt{2}: \pi$', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-6dc917-13-0', '6dc917', 12, '13', '13) The area of a circular path of uniform width n surrounding a circular region of radius r is
a) $\pi(2r + n)n$ b) $\pi(2r + n)r$ c) $\pi(n+r)r$ d) $\pi(n+r)n$', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-6dc917-14-0', '6dc917', 13, '14', '14) If $\Sigma f_r = 18$, $\Sigma f_r x_r = 2p + 24$ and the mean of the distribution is 2, then p is equal to
a) 3 b) 4 c) 8 d) 6', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-6dc917-15-0', '6dc917', 14, '15', '15) Area of the largest triangle that can be inscribed in a semi-circle of radius r units is
a) $r^2$ sq. units b) $\frac{1}{2}r^2$ sq. units c) $2r^2$ sq. units d) $\pi r^2$ sq. units', 1, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-6dc917-16-0', '6dc917', 15, '16', '16) Consider the following frequency distribution:
| Class | 0-5 | 6-11 | 12-17 | 18-23 | 24-29 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 13 | 10 | 15 | 8 | 11 |

The upper limit of the median class is
a) 17 b) 17.5 c) 18 d) 18.5', 1, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-6dc917-17-0', '6dc917', 16, '17', '17) A letter of English alphabets is chosen at random. What is the probability that it is a letter of the word ''MATHEMATICS''?
a) $\frac{4}{13}$ b) $\frac{9}{26}$ c) $\frac{5}{13}$ d) $\frac{11}{26}$', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-6dc917-18-0', '6dc917', 17, '18', '18) If 3 Cot A = 4, then the value of $\cos^2 A - \sin^2 A$ is
a) $\frac{3}{4}$ b) $\frac{1}{2}$ c) $\frac{24}{25}$ d) $\frac{7}{25}$', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-6dc917-19-0', '6dc917', 18, '19', '19) Statement A (Assertion): The denominator of 34.123456, when expressed in the form $\frac{p}{q}$ where p and q are coprime integers, $q \ne 0$ is of the form $2^m \times 5^n$ where m and n are not negative integers.
X-Stn.Math. (3) (Turn Over)
Statement R (Reason): 34.123456 is a terminating decimal expansion.', 1, NULL, 'MCQ', 2, NULL, array['Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A).', 'Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A).', 'Assertion (A) is true but reason (R) is false.', 'Assertion (A) is false but reason (R) is true.']::text[]),
  ('MQ-6dc917-20-0', '6dc917', 19, '20', '20) Statement A (Assertion): The value of y is 6 for which the distance between the points P (2, -3) and Q (10, y) is 10 units.
Statement R (Reason): Distance between two given points A (x₁, y₁) and B (x₂, y₂) is given by
$$AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A).', 'Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A).', 'Assertion (A) is true but reason (R) is false.', 'Assertion (A) is false but reason (R) is true.']::text[]),
  ('MQ-6dc917-21-0', '6dc917', 20, '21', '21) If \(\sqrt{a} x - \sqrt{b} y = b - a\) and \(\sqrt{b} x - \sqrt{a} y = 0, a, b \neq 0, a \neq b\), then what is the value of \(x - y\)?', 2, NULL, 'short', 3, NULL, NULL),
  ('MQ-6dc917-22-0', '6dc917', 21, '22', '22) Sides AB and BE of a right triangle, right angled at B are of length 16 cm and 8 cm respectively. Find the length of the side of largest square FDGB that can be inscribed in \(\Delta ABE\).', 2, 'Similarity', 'short', 3, '6dc917__Bhavans_Ga_p3_img_0_jpeg.webp', NULL),
  ('MQ-6dc917-23-0', '6dc917', 22, '23', '23) In the figure given, PP'' and QQ'' are common tangents of two circles of unequal radii. Show that PP'' = QQ''', 2, 'Circles', 'short', 3, '6dc917__Bhavans_Ga_p3_img_1_jpeg.webp', NULL),
  ('MQ-6dc917-24-0', '6dc917', 23, '24', '24) A circle with centre O of diameter 28 cm and a chord BC of length 14 cm is shown alongside. What is the length of the major arc of circle?', 2, 'Circles', 'short', 3, '6dc917__Bhavans_Ga_p3_img_3_jpeg.webp', NULL),
  ('MQ-6dc917-24-1', '6dc917', 24, '24', 'OR

A race track is in the form of a ring whose inner circumference is 440 m and the outer circumference is 504 m. Find area of track in terms of π', 2, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-6dc917-25-0', '6dc917', 25, '25', '25) In ΔABC, right angled at A, tan B = 1/√3.

Find CosB CosC + SinB SinC.', 2, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-6dc917-25-1', '6dc917', 26, '25', 'OR

Find an acute angle θ when $$\frac{Cos\theta - Sin\theta}{Cos\theta + Sin\theta} = \frac{1 - \sqrt{3}}{1 + \sqrt{3}}$$', 2, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-6dc917-26-0', '6dc917', 27, '26', '26) Assuming \(\sqrt{2}\) as irrational, prove that \(\sqrt{5} +\sqrt{2}\) is irrational.', 3, NULL, 'short', 3, NULL, NULL),
  ('MQ-6dc917-27-0', '6dc917', 28, '27', '27) If \(\alpha\) and \(\beta\) are the zeros of the quadratic polynomial \(f(x) = 3x^{2} - 7x - 6\), find a polynomial whose zeros are \(2\alpha + 3\beta\) and \(3\alpha + 4\beta\). \(3x^{2} - 35x + 92\).', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-6dc917-28-0', '6dc917', 29, '28', '28) The area of a rectangle gets reduced by 9 square units, if its length is reduced by 5 units and breadth is increased by 3 units. If we increase the length by 3 units and breadth by 2 units, the area increases by 67 square units. Find the dimensions of the rectangle.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-6dc917-28-1', '6dc917', 30, '28', 'OR

17, 9

A train covered a certain distance at a uniform speed. If the train would have been 10 km / hr faster, it would have taken 2 hours less than the scheduled time and if the train were slower by 10 km / hr, it would have taken 3 hours more than the scheduled time. Find the distance covered by the train.', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-6dc917-29-0', '6dc917', 31, '29', '29) Prove that:

$$\frac{\cos A - \sin A + 1}{\cos A + \sin A - 1} = \cos c A + \cos t A$$', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-6dc917-30-0', '6dc917', 32, '30', '30) If a hexagon ABCDEF circumscribes a circle, prove that
$$AB + CD + EF = BC + DE + FA$$', 3, 'Circles', 'short', 4, '6dc917__Bhavans_Ga_p4_img_0_jpeg.webp', NULL),
  ('MQ-6dc917-30-1', '6dc917', 33, '30', 'OR

Prove that a parallelogram circumscribing a circle is a rhombus.', 3, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-6dc917-31-0', '6dc917', 34, '31', '31) Ranjan throws two dice at the same time.

Find the probability of getting

i) a total of at least 9.

ii) the sum as a prime number.', 3, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-6dc917-32-0', '6dc917', 35, '32', '32) To fill a swimming pool two pipes are used. If the pipe of larger diameter is used for 4 hours and the pipe of smaller diameter is used for 9 hours, only half of the pool can be filled. Find, how long it would take for each pipe to fill the pool separately, if the pipe of smaller diameter takes 10 hours more than the pipe of larger diameter to fill the pool?', 5, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-6dc917-32-1', '6dc917', 36, '32', 'OR

In a flight of 600 km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 km/hr from its usual speed and the time of flight increased by 30 minutes. Find the scheduled duration of the flight.', 5, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-6dc917-33-0', '6dc917', 37, '33', '33) Prove that if a line is drawn parallel to one side of a triangle intersecting the other two sides in distinct points, then the other two sides are divided in the same ratio.
Using the above theorem, prove that the diagonals of a trapezium divide each other in the same ratio.', 5, 'Similarity', 'long', 4, NULL, NULL),
  ('MQ-6dc917-34-0', '6dc917', 38, '34', '34) A cuboidal swimming pool is constructed. The dimensions of swimming pool is shown in the picture.

a) How much water can be filled completely in the swimming pool₹ 10800 m³
b) If 100 men take a dive at a time, then what will be the rise in water level, if average displacement of water by a man is 8 m²? 0.22 m
c) In place of a cuboidal swimming pool, if a hemispherical pool of radius 14 m is constructed, then how much water is required to fill the hemispherical pool₹ 410.6 m³', 5, 'Mensuration', 'long', 4, '6dc917__Bhavans_Ga_p4_img_1_jpeg.webp', NULL),
  ('MQ-6dc917-34-1', '6dc917', 39, '34', 'Raj, an architect, designs a rough sketch of model as shown in figure. "A cylinder is surmounted by conical top."

- a) Calculate curved surface area of cylindrical portion.
- b) Calculate curved surface area of conical part.
- c) Calculate volume of model.

$$(Use \sqrt{6.84} = 2.61)$$', 5, 'Mensuration', 'long', 4, '6dc917__Bhavans_Ga_p4_img_2_jpeg.webp', NULL),
  ('MQ-6dc917-36-0', '6dc917', 40, '36', '36) A group of Class X students goes to picnic during vacation. There were three different slides and three friends Ajay, Ram and Shyam are sliding in the three slides. The position of three friends shown by P, Q and R in three different slides is given below:

[Diagram of slides]

Consider O as origin and answer the following questions:

(i) Find the coordinates of the point O which divides the line segment joining PR in the ratio 1:2 internally.
(ii) Find PR.
(iii) Find the coordinates of midpoint of PQ and coordinates of mid point of QR.

If we shift origin O by 2 units towards right and 1 unit towards north, then find the coordinates of P, Q, R.

(2)', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-6dc917-37-0', '6dc917', 41, '37', '(3) India is competitive manufacturing location due to the low cost of manpower and strong technical and engineering capabilities contributing to higher quality production runs. The production of TV sets in a factory increases uniformly by a fixed number every year. It produced 16000 sets in 6th year and 22600 in the 9th year.

(8) Contd.

[Diagram of slides]

i) What is the production in the first year?
(ii) In which year, the production is 29,200?
(iii) Find the difference of the production during 7th year and 4th year.', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-6dc917-37-1', '6dc917', 42, '37', '(3) India is competitive manufacturing location due to the low cost of manpower and strong technical and engineering capabilities contributing to higher quality production runs. The production of TV sets in a factory increases uniformly by a fixed number every year. It produced 16000 sets in 6th year and 22600 in the 9th year.

(8) Contd.

[Diagram of slides]

i) What is the production in the first year?
(ii) In which year, the production is 29,200?
OR

(2)

What is total production for 7 years?

(2)', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-6dc917-38-0', '6dc917', 43, '38', '38) A group of students of class X visited India Gate on an educational trip. The teacher and students had interest in history as well. The teacher narrated that India Gate, official name Delhi Memorial, originally called All-India War memorial, monumental sandstone arch in New Delhi, dedicated to the troops of British India who died in wars fought between 1914 and 1919. The teacher also said that India Gate, which is located at the eastern end of Rajpath (formerly called the kingsway) is about 138 feet (42 metres) in height. (Take $\sqrt{3} = 1.73$)

[Diagram of slides]

X-Stn.Math.

(9) (Turn O)
i) What is the angle of elevation, if they are standing at a distance of 42 m away from the monument₹ 45° (1)
ii) If they want to see the tower at an angle of 60° then find the distance where they should stand. 24.2 (1)
iii) If the altitude of the sun is at 60° then find height of the vertical tower that will cast a shadow of length 20 m. 34.6 (2)', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-98951c-1-0', '98951c', 0, '1', '1. Given the linear equation \( 2x + 5y = 12 \). write another linear equation in two variables such that the geometrical representation of the pair so formed is (i) Intersecting Lines (ii) Parallel Lines', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-98951c-2-0', '98951c', 1, '2', '2. Find the value of \( k \), for which the system of linear equations \( x + 2y = 3 \), \( 5x + ky + 7 = 0 \) is inconsistent', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-98951c-3-0', '98951c', 2, '3', '3. If the mean of the following distribution is 52 find the value of f.

| Class | 0-20 | 20-40 | 40-60 | 60-80 | 80- 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 3 | f | 4 | 3 | 5 |', 2, 'Statistics', 'short', 1, NULL, NULL),
  ('MQ-98951c-4-0', '98951c', 3, '4', '1. If \(\cos A + \cos^2 A = 1\), then prove that \(\sin^2 A + \sin^4 A = 1\)', 2, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-98951c-5-0', '98951c', 4, '5', '5. If the point \( \mathrm{P}(\mathrm{x} \cdot \mathrm{y}) \) is equidistant from the points \( \mathrm{A}(\mathrm{a} + \mathrm{b}, \mathrm{b} - \mathrm{a}) \) and \( \mathrm{B}(\mathrm{a} - \mathrm{b}, \mathrm{a} + \mathrm{b}) \), prove that \( \mathrm{bx} = \mathrm{ay} \).', 2, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-98951c-6-0', '98951c', 5, '6', '6. The line segment joining the points A (3.2) and B (5.1) is divided at the point in the ratio 1:2 and it lies on the line \(3x - 18y + k = 0\). Find the value of k.', 2, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-98951c-7-0', '98951c', 6, '7', '7. The following table shows the marks secured by 140 students in an examination.

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No. of Students | 20 | 36 | 40 | 28 | 16 |

Calculate the mean marks by using step deviation method.', 3, 'Statistics', 'short', 2, NULL, NULL),
  ('MQ-98951c-8-0', '98951c', 7, '8', '8. Solve for x and y

$$\frac{ax}{b} - \frac{by}{a} = a + b$$

$$ax - by = 2ab$$', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-98951c-9-0', '98951c', 8, '9', '9. Prove that $$\sqrt{\frac{1+\sin A}{1-\sin A}} + \sqrt{\frac{1-\sin A}{1+\sin A}} = 2\sec A$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-98951c-10-0', '98951c', 9, '10', '10. If P(2, -1), Q(3, 4), R(-2, 3) and S(-3, -2) be four points in a plane. Show that PQRS is a rhombus but not a square.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-98951c-11-0', '98951c', 10, '11', '11. Solve graphically

$$x + 2y = 3$$

$$4x + 3y = 2$$', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-98951c-12-0', '98951c', 11, '12', '12. The line segment, joining the points (3, -4) and (1, 2) is trisected at the points P and Q. If the coordinates

of P and Q are (p, -2) and $$\left(\frac{5}{3}, q\right)$$ respectively, find values of p and q.', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-98951c-13-0', '98951c', 12, '13', '13. Prove that $$\frac{\sec 0 + \tan 0 - 1}{\tan 0 - \sec 0 + 1} = \frac{\cos 0}{1 - \sin 0}$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-98951c-13-1', '98951c', 13, '13', 'Prove that $$\frac{\cos 0}{1 - \tan 0} + \frac{\sin 0}{1 - \cot 0} = \cos 0 + \sin 0$$', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-98951c-14-0', '98951c', 14, '14', '14. Susy is rowing a boat which goes 30 km upstream and 44 km downstream in 10 hours. In 13 hours, it can go 40 km upstream and 55 km downstream.

i) Represent the above situation algebraically.

ii) What is the speed of the boat in still water and the speed of the stream?', 3, NULL, 'short', 3, '98951c__Bhavans_Ga_p3_img_0_jpeg.webp', NULL),
  ('MQ-ad7d57-1-0', 'ad7d57', 0, '1', '1. Explain why \( 17 \times 5 \times 11 \times 3 \times 2 + 2 \times 11 \) is a composite number?', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-ad7d57-2-0', 'ad7d57', 1, '2', '2. Without actual division state if \(\frac{441}{2^2 \times 5^7 \times 7}\) has a terminating decimal expansion or non-terminating repeating decimal expansion.', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-ad7d57-3-0', 'ad7d57', 2, '3', '3. S and T are the points on the sides PR and QR of \(\Delta\)PQR such that \(\angle P = \angle RTS\). Show that \(\Delta RPQ \sim \Delta RTS\).', 2, 'Similarity', 'short', 1, NULL, NULL),
  ('MQ-ad7d57-4-0', 'ad7d57', 3, '4', '4. In \(\Delta ABC\), DE \(\| BC\). If \(AD = 4cm\), \(DB = (x - 4)cm\), \(AE = 8cm\) and \(EC = (3x - 19)cm\), find \(x\).', 2, 'Similarity', 'short', 1, 'ad7d57__Bhavans_Ga_p1_img_0_jpeg.webp', NULL),
  ('MQ-ad7d57-5-0', 'ad7d57', 4, '5', '5. Check whether \( 4^n \) can end with the digit zero for any natural number ''n''.', 2, NULL, 'short', 1, NULL, NULL),
  ('MQ-ad7d57-6-0', 'ad7d57', 5, '6', '6. If \(\sqrt{3} \sin \theta = \cos \theta\) then find the value of

$$\frac{3 \cos^2 \theta + 2 \cos \theta}{3 \cos \theta + 2}$$', 2, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-ad7d57-7-0', 'ad7d57', 6, '7', '7. Prove that $\sqrt{2}$ is an irrational number.', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-ad7d57-8-0', 'ad7d57', 7, '8', '8. If $\alpha$ and $\beta$ are the zeros of the quadratic polynomial $kx^2 + 4x + 4$ such that $\alpha^2 + \beta^2 = 24$, then find the value(s) of k.', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-ad7d57-9-0', 'ad7d57', 8, '9', '9. ABCD is a trapezium in which AB || CD and its diagonals intersect each other at the point O. Show that $\frac{AO}{BO} = \frac{CO}{DO}$.', 3, 'Similarity', 'short', 2, NULL, NULL),
  ('MQ-ad7d57-10-0', 'ad7d57', 9, '10', '10. Find the value of

$$\frac{\tan^2 60^\circ + 4 \sin^2 45^\circ + 3 \sec^2 30 + 5 \cos^2 90^\circ}{\cosec 30^\circ + \sec 60^\circ - \cot^2 30^\circ}$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-ad7d57-11-0', 'ad7d57', 10, '11', '11. If the angles of $\Delta ABC$ are in the ratio 1:1:2 respectively, the largest angle being $\angle C$, then find the value of

$$\frac{\sec A}{\cosec B} = \frac{\tan A}{\cot B}$$', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-ad7d57-12-0', 'ad7d57', 11, '12', '12. Sides AB and BC and median AD of a $\Delta ABC$ are respectively proportional to sides PQ and QR and median PM of $\Delta PQR$. Show that $\Delta ABC \sim \Delta PQR$.

$\frac{1}{2}$', 4, 'Similarity', 'long', 2, 'ad7d57__Bhavans_Ga_p2_img_0_jpeg.webp', NULL),
  ('MQ-ad7d57-13-0', 'ad7d57', 12, '13', '13. Find the zeros of the quadratic polynomial $x^2 + 4\sqrt{3}x - 15$. Also verify the relationship between the zeros and the coefficients of the polynomial.

(2)', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-ad7d57-14-0', 'ad7d57', 13, '14', '14. The graphs of the quadratic functions are parabolic and have a highest or lowest point called the vertex. They may open up or down. They are symmetrical curves. The graph of a quadratic function is given below.

Based on the above situation answer the following questions:

i) Find the zeros of the polynomial for the given graph. [1]

ii) Find the polynomial representing the above graph. [3]', 4, 'Quadratic Equations', 'long', 3, 'ad7d57__Bhavans_Ga_p3_img_0_jpeg.webp', NULL),
  ('MQ-d8c204-1-0', 'd8c204', 0, '1', '(i) Mr. Dhruv deposits Rs 600 per month in a recurring deposit account for 5 years at the rate of 10% per annum. Then the amount he will receive at the time of maturity be,', 1, 'GST and Banking', 'MCQ', 1, NULL, array['45120', '45230', '45150', '45200']::text[]),
  ('MQ-d8c204-1-1', 'd8c204', 1, '1', '(ii) If $4x - 2 < 2x + 10$ ,', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['$x < 5$', '$x > 6$', '$x \leq 6$', 'none of these']::text[]),
  ('MQ-d8c204-1-2', 'd8c204', 2, '1', '(iii) $5x + 3 \leq 2x + 18$ , find $x$ where $x \in \mathbb{N}$ .', 1, 'Linear Inequations', 'MCQ', 1, NULL, array['$\{1, 2, 3, 4\}$', '$\{5, 4, 3, 2, 1\}$', '$\{1, 2, 3, 4, 5\}$', 'Both b and c']::text[]),
  ('MQ-d8c204-1-3', 'd8c204', 3, '1', '(iv) Mukesh buys an article marked at Rs 5000 at a discount of 15% on the marked price, the rate of GST being 18%. Then the tax Mukesh has to pay for purchase is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 765', 'Rs 750', 'Rs 825', 'Rs 900']::text[]),
  ('MQ-d8c204-1-4', 'd8c204', 4, '1', '(v) Rupa deposited Rs 200 per month for 15 months in a bank''s recurring account. The bank pays interest at a rate of 10% per annum, then the interest earned by Rs during this period is:', 1, 'GST and Banking', 'MCQ', 2, NULL, array['Rs 300', 'Rs 250', 'Rs 200', 'Rs 150']::text[]),
  ('MQ-d8c204-1-5', 'd8c204', 5, '1', '(vi) In the given figure, AB is the diameter of the circle with centre O. If $\angle COB = 55^\circ$ then the value of x is', 1, 'Circles', 'MCQ', 2, 'd8c204__Bhuta_High_p2_img_0_jpeg.webp', array['27.5', '55', '110', '125']::text[]),
  ('MQ-d8c204-1-6', 'd8c204', 6, '1', '(vii) If a rectangular sheet of dimensions 22 cm x 11 cm is rolled along its shorter side to form a cylinder. Then the curved surface area of the cylinder so formed is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['968 cm$^{2}$', '424 cm$^{2}$', '121 cm$^{2}$', '242 cm$^{2}$']::text[]),
  ('MQ-d8c204-1-7', 'd8c204', 7, '1', '(viii) $\tan A + \cot A =$', 1, 'Trigonometry', 'MCQ', 2, NULL, array['$\sec A + \csc A$', '$\sec A \cdot \csc A$', '$\sin A \cdot \cos A$', '$\sin A + \cos A$']::text[]),
  ('MQ-d8c204-1-8', 'd8c204', 8, '1', '(ix) Volume of a cylinder is 330 cm$^{3}$. The volume of the cone having same radius and height as that of the cylinder is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['330 cm$^{3}$', '165 cm$^{3}$', '110 cm$^{3}$', '220 cm$^{3}$']::text[]),
  ('MQ-d8c204-1-9', 'd8c204', 9, '1', '(x) If the probability of a player winning game is 0.56, the probability of his losing the game is', 1, 'Probability', 'MCQ', 3, NULL, array['0.56', '1', '0.44', '0']::text[]),
  ('MQ-d8c204-1-10', 'd8c204', 10, '1', '(xi) $$sec^2A - 1 =$$', 1, 'Trigonometry', 'MCQ', 3, NULL, array['\( \tan^2 A \)', '\( \sin^2 A \)', '\( \cos^2 A \)', '\( \cot^2 A \)']::text[]),
  ('MQ-d8c204-1-11', 'd8c204', 11, '1', '(xii) The mode in the given graph is', 1, 'Statistics', 'MCQ', 3, 'd8c204__Bhuta_High_p3_img_0_jpeg.webp', array['51', '50', '55', '53']::text[]),
  ('MQ-d8c204-1-12', 'd8c204', 12, '1', '(xiii) Assumed mean in the given distribution is:

(a) 45
(b) 55
(c) 45.5
(d) 55.5

| Class interval | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 6 | 8 | 12 | 5 | 9 |', 1, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-d8c204-1-13', 'd8c204', 13, '1', '(xiv) In a single throw of dice, the probability of getting 7 is', 1, 'Probability', 'MCQ', 3, NULL, array['\(1 / 2\)', '\(3 / 4\)', '\(2 / 3\)', '0']::text[]),
  ('MQ-d8c204-1-14', 'd8c204', 14, '1', '(xv) If 3x + 4 < 16 then,', 1, 'Linear Inequations', 'MCQ', 4, NULL, array['\(x < 6.66\)', '\(x < 4\)', '\(x < 5\)', 'none of these']::text[]),
  ('MQ-d8c204-2-0', 'd8c204', 15, '2', 'a. Anjali has a recurring deposit account in a bank of Rs 500 per month for 2 years, she gets Rs 13375 at the time of maturity, find:

(i) Amount of interest paid by the bank
(ii) Rate of interest offered by the bank.', NULL, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-d8c204-2-1', 'd8c204', 16, '2', 'b. Prove the following:

$$(cosec A - \sin A) (sec A - \cos A) sec^2 A = \tan A$$

[4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-d8c204-2-2', 'd8c204', 17, '2', 'c. In the figure given below, AB and CD are straight lines through the centre O of circle. If ∠AOC = 80° and ∠CDE = 40°, find:

(i) \(\angle DCE\)
(ii) \(\angle ABC\)
(iii) \(\angle AED\)', NULL, 'Circles', 'short', 4, 'd8c204__Bhuta_High_p4_img_0_jpeg.webp', NULL),
  ('MQ-d8c204-3-0', 'd8c204', 18, '3', 'a. Use graph sheet for this question. The following table shows the expenditure of 98 boys on books.

| Expenditure in Rs | 25-30 | 30-35 | 35-40 | 40-45 | 45-50 | 50-55 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of students | 6 | 19 | 28 | 25 | 15 | 5 |

Find the mode of their expenditure.', NULL, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-d8c204-3-1', 'd8c204', 19, '3', 'b. A vessel is in the form of an inverted cone. Its height is 8 cm and the radius of its top which is open is 5 cm. It is filled with water upto the rim. When lead shots, each of which is a sphere of radius 0.5 cm are dropped into the vessel, one fourth of the water flows out. Find the number of lead shots dropped into the vessel. [4]', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-d8c204-3-2', 'd8c204', 20, '3', 'c. From the top of the cliff 90 m high, the angles of depression of the top and bottom of a tower are observed to be 30° and 60° respectively. Find: [5]

(i) The horizontal distance between tower and cliff.
(ii) The height of the tower.', 5, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-d8c204-5-0', 'd8c204', 21, '5', 'a. Thirty identical cards are marked with numbers 1 to 30. If one card is drawn at random, find the probability that it is: [3]

i. A multiple of 4 or 6.
ii. A multiple of 3 and 5.
iii. A multiple of 3 or 5.', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-d8c204-5-1', 'd8c204', 22, '5', 'b. In the given figure, diameter AB and chord CD of a circle meet at a point P. PT is a tangent to the circle at T. CD = 7.8 cm, PD = 5 cm, PB = 4 cm. [3]

Find:

(i) AB
(ii) Length of tangent PT.', 3, 'Circles', 'short', 5, 'd8c204__Bhuta_High_p5_img_0_jpeg.webp', NULL),
  ('MQ-d8c204-5-2', 'd8c204', 23, '5', 'c. A computer mechanic in Delhi charges repairing cost from two people A and B to certain discounts. The repairing costs and the corresponding discounts are as given below: [4]

| Name of the person | A | B |
| --- | --- | --- |
| Repairing cost (in Rs) | 5500 | 6250 |
| Discount % | 30 | 40 |

If the rate of GST is 18%, find the total money received by the mechanic.', 4, 'GST and Banking', 'long', 6, NULL, NULL),
  ('MQ-d8c204-6-0', 'd8c204', 24, '6', 'a. Solve the inequation:

$$3z - 5 \leq z + 3 < 5z - 9, z \in R$$

Graph the solution set on the number line.', NULL, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-d8c204-6-1', 'd8c204', 25, '6', 'b. The sum of height and the radius of a solid cylinder is 35 cm and its total surface area is 3080 cm², find the volume of the cylinder. [3]', 3, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-d8c204-6-2', 'd8c204', 26, '6', 'c. Prove:

$$\frac{\text{cosec } A}{\text{cosec } A - 1} + \frac{\text{cosec } A}{\text{cosec } A + 1} = 2\text{sec}^2 A$$', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-d8c204-7-0', 'd8c204', 27, '7', 'a. A man has a recurring deposit account in a bank for 3.5 years. If the rate of interest is 12% p.a. and the man gets Rs 30618 on maturity, find the value of monthly instalment. [3]', 3, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-d8c204-7-1', 'd8c204', 28, '7', 'b. The man of the given distribution is 52. Determine the value of p using step-deviation method: [3]

| Marks obtained | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 5 | 3 | 4 | p | 2 | 6 | 13 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-d8c204-7-2', 'd8c204', 29, '7', 'c. Solve the inequation and graph the solution set on a number line: [4]

$$-3 < -\frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6}, x \in R$$', 4, 'Linear Inequations', 'long', 6, NULL, NULL),
  ('MQ-d8c204-8-0', 'd8c204', 30, '8', 'a. From a light house, the angles of depression of two ships on opposite sides of the lighthouse were observed to be 30° and 45°. If the height of the lighthouse is 100 m and the line joining the two ships passes through the foot of the lighthouse, find the distance between the two ships. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-d8c204-8-1', 'd8c204', 31, '8', 'b. Use graph paper for this question. The table shows a record from a hospital of 84 numbers of casualties due to accidents of different age groups. [6]

| Age (in years) | 5-15 | 15-25 | 25-35 | 35-45 | 45-55 | 55-65 | 65-75 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of casualties | 6 | 10 | 15 | 13 | 25 | 8 | 7 |

Taking a scale of 2 cm = 10 years on one axis and 2 cm = 10 casualties on the other, draw an ogive and estimate the following:

(i) The median
(ii) The upper quartile
(iii) The inter-quartile range', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-1f44c5-1-0', '1f44c5', 0, '1', '(i) The roots of the equation \( 7x^{2} + x - 1 = 0 \) are:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['rational and unequal', 'irrational and equal', 'imaginary and unequal', 'irrational and unequal']::text[]),
  ('MQ-1f44c5-1-1', '1f44c5', 1, '1', '(ii) When polynomial $$3x^3 + 7x^2 + x - 1$$ is divided by $$x + 2$$, then the remainder is:', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['1', '2', '3', '4']::text[]),
  ('MQ-1f44c5-1-2', '1f44c5', 2, '1', '(iii) For the following transaction within Delhi, if MRP = Rs.12,000, Discount % = 30%, GST = 18%, then the amount of bill is:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs.9192', 'Rs. 9912', 'Rs.8400', 'Rs.14160']::text[]),
  ('MQ-1f44c5-1-3', '1f44c5', 3, '1', '(iv) The equation of line with slope $$\frac{1}{2}$$ and y-intercept 5 is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['$$2y = x - 5$$', '$$2y = x + 5$$', '$$2y = x + 20$$', '$$2y = x + 10$$']::text[]),
  ('MQ-1f44c5-1-4', '1f44c5', 4, '1', '(v) The reflection of a point (5,6) in the $$x = 2$$ is:', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['(-1,6)', '(-5,6)', '(1, -6)', '(-3,0)']::text[]),
  ('MQ-1f44c5-1-5', '1f44c5', 5, '1', '(vi) If $$x : y = 3 : 4$$, then $$(7x + 3y) : (7x - 3y)$$ is equal to:', 1, 'Ratio and Proportion', 'MCQ', 1, NULL, array['5 : 2', '4 : 3', '11 : 3', '37:19']::text[]),
  ('MQ-1f44c5-1-6', '1f44c5', 6, '1', '(vii) If Volume of a right cone is 462 m³ and its height is 9 m, then the radius of the cone is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['154 m', '7 m', '49 m', '8 m']::text[]),
  ('MQ-1f44c5-1-7', '1f44c5', 7, '1', '(viii) If x ∈ W, then the solution set of the inequation 5 - 4x ≥ 2 - 3x is:

(a) {..., -2, -1, 0, 1, 2, 3}

(c) {0, 1, 2, 3}

(b) {x: x ∈ R, x ≤ 3}

(d) {1, 2, 3}', 1, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-1f44c5-1-8', '1f44c5', 8, '1', '(ix) The midpoint of the line segment joining the points M (-2, 8) and N (-6, -4) is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(-4, -6)', '(-4, 2)', '(-4, 2) (2, 6)', '(-4, -2)']::text[]),
  ('MQ-1f44c5-1-9', '1f44c5', 9, '1', '(x) If [x + 2, y + 3, 9, 4] = [6, 5, 9, 4], then the value of x + y is:', 1, 'Matrices', 'MCQ', 2, NULL, array['5', '6', '7', '8']::text[]),
  ('MQ-1f44c5-1-10', '1f44c5', 10, '1', '(xi) Out of one-digit prime numbers, one number is selected at random. The probability of selecting an even number is:', 1, 'Probability', 'MCQ', 2, NULL, array['1/2', '4/9', '1/4', '1']::text[]),
  ('MQ-1f44c5-1-11', '1f44c5', 11, '1', '(xii) In the given ΔABC, if ∠EDB = ∠ACB, BE = 6cm, EC = 4cm and BD = 5cm. Find AB:', 1, 'Similarity', 'MCQ', 2, '1f44c5__Billabong__p2_img_0_jpeg.webp', array['4', '6', '7', '12']::text[]),
  ('MQ-1f44c5-1-12', '1f44c5', 12, '1', '(xiii) The speed of a motorboat is 20 km/hr. For covering the distance of 15 km, the boat took 1 hour more for upstream than downstream. Let speed of the stream be x km/hr, which is the correct quadratic equation for the speed of the stream?

(a) x² + 30x - 200 = 0

(c) x² + 20x - 400 = 0

(b) x² + 30x - 400 = 0

(d) x² - 20x - 400 = 0', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-1f44c5-1-13', '1f44c5', 13, '1', '(xiv) In the figure PQ is a diameter of the circle, whose centre is O. Given ∠ROS = 42°, then x is equal to:', 1, 'Circles', 'MCQ', 2, '1f44c5__Billabong__p2_img_1_jpeg.webp', array['\(42^{\circ}\)', '\(90^{\circ}\)', '\(21^{\circ}\)', '\(69^{\circ}\)']::text[]),
  ('MQ-1f44c5-1-14', '1f44c5', 14, '1', '(xv) 30th term of an AP is 128 and the common difference is 4, then the first term is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['10', '12', '15', '20']::text[]),
  ('MQ-1f44c5-2-0', '1f44c5', 15, '2', '(i) Mrs. Shetty has a recurring deposit account in a bank of ₹2000 per month at the rate of 10% p.a. If she gets ₹ 83,100 at the time of maturity, find the total time in years, for which the account was held.', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-1f44c5-2-1', '1f44c5', 16, '2', '(ii) Find x from the following equation using properties of proportion:

$$\frac{(x^2 - x + 1)}{(x^2 + x + 1)} = \frac{14(x - 1)}{13(x + 1)}$$', NULL, 'Ratio and Proportion', 'short', 3, NULL, NULL),
  ('MQ-1f44c5-2-2', '1f44c5', 17, '2', '(iii) Prove: $$\frac{\sin A}{\cot A + \text{cosec } A} = 2 + \frac{\sin A}{\cot A - \text{cosec } A}$$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-1f44c5-3-0', '1f44c5', 18, '3', '(i) The given solid figure is a cylinder with a hemisphere on one side and a cone on the other side. Find:

(a) Volume of the solid
(b) Total surface area of the solid

(Give your answers correct to the nearest whole number.)', NULL, 'Mensuration', 'short', 3, '1f44c5__Billabong__p3_img_0_jpeg.webp', NULL),
  ('MQ-1f44c5-3-1', '1f44c5', 19, '3', '(ii) In the given figure

(a) Write down the coordinates of Points A and B
(b) If P, divides AB in the ratio 1:2, find the coordinates of P
(c) Find the equation of line perpendicular to AB and passing through point P', NULL, 'Coordinate Geometry', 'short', 3, '1f44c5__Billabong__p3_img_1_jpeg.webp', NULL),
  ('MQ-1f44c5-3-2', '1f44c5', 20, '3', '(iii) Use a graph paper for this question (Take 2cm = 2 units on both axes)

(a) Plot \(A(3,5), B(-2, -4)\)
(b) \(A^{\prime}\) is the image of A when reflected along X-axis
(c) \(B^{\prime}\) is the image of point B when reflected along X-axis. Write coordinates of A'' and B''
(d) Join \(AA''BB''A\). Assign a geometrical name to the geometrical figure \(AA''BB''\), also find its area.
(e) Name the two invariant points under reflection in X-axis', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-1f44c5-4-0', '1f44c5', 21, '4', '(i) Find the total amount to be paid for the bill:

[3]

| Bill Computers | | | | | |
| --- | --- | --- | --- | --- | --- |
| Sr.No. | Items | Price per unit (Rs.) | Quantity | GST rate | Amount |
| 1. | Monitor | 16500 | 1 | 15 % | |
| 2. | Laptop adaptor | 2500 | 2 | 10 % | |

Find the total amount to be paid for above bill.', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-1f44c5-4-1', '1f44c5', 22, '4', '(ii) Find the value(s) of k for which the following equation has real and equal roots:

[3]

$$(k + 4)x^2 + (k + 1)x + 1 = 0$$', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-1f44c5-4-2', '1f44c5', 23, '4', '(iii) Use a graph paper, take 2cm = 10 units on one axis and 2cm = 2 units on another axis. Draw a histogram representing the data given below. Hence estimate the mode.

[4]

| Marks | 40 - 50 | 50 - 60 | 60 - 70 | 70 - 80 | 80 - 90 | 90 - 100 |
| --- | --- | --- | --- | --- | --- | --- |
| No. of pupils | 2 | 8 | 12 | 14 | 8 | 6 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-1f44c5-5-0', '1f44c5', 24, '5', '(i) If $A = \begin{bmatrix} 0 & -1 \\ 1 & 2 \end{bmatrix}$ and $B = \begin{bmatrix} 1 & 2 \\ -1 & 1 \end{bmatrix}$ , find the matrix $X$ if $A^2 + 2AB = X$

[3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-1f44c5-5-1', '1f44c5', 25, '5', '(ii) In the given figure, PAB is a secant and PT is a tangent to the circle with centre O.

(a) Prove $\Delta BPT \sim \Delta TPA$

(b) If $PA = 4$ cm and $AB = 5$ cm, find length of PT.

[3]', 3, 'Circles', 'short', 4, '1f44c5__Billabong__p4_img_0_jpeg.webp', NULL),
  ('MQ-1f44c5-5-2', '1f44c5', 26, '5', '(iii) If $(x - 1)$ and $(x + 2)$ are factors of the polynomial: $2x^3 + mx^2 + nx - 14$ ,

(a) Find the values of m and n

(b) factorize the polynomial.

[4]', 4, 'Factorisation and Remainder Theorem', 'long', 4, NULL, NULL),
  ('MQ-1f44c5-6-0', '1f44c5', 27, '6', '(i) ABCD is a parallelogram where A(x, y), B(5, 8), C(4, 7) and D(2, -4). Find:
(a) coordinates of A (b) equation of diagonal BD. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-1f44c5-6-1', '1f44c5', 28, '6', '(ii) An AP consists of 50 terms of which 3rd term is 12 and the last term is 106. Find the first term, common difference, and the sum of first 30 terms. [3]', 3, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-1f44c5-6-2', '1f44c5', 29, '6', '(iii) An observer 1.5 m tall is 30 m away from a chimney. The angle of elevation on the top of chimney from his eye is 50°. Find the height of the chimney to the nearest metre. [4]', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-1f44c5-7-0', '1f44c5', 30, '7', '(i) Find the mean of the following distribution using step deviation method. [3]

| Class | 0 – 20 | 20 – 40 | 40 – 60 | 60 – 80 | 80 – 100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 15 | 18 | 21 | 29 | 17 |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-1f44c5-7-1', '1f44c5', 31, '7', '(ii) A bag contains 12 balls out of which the number of white balls is x. If one ball is drawn at random, Find:

(a) the probability that it will be a white ball in terms of \( x \).
(b) if 6 more white balls are put in the bag, then the probability of drawing a white ball will be double than it was previously. Find \( x \). [3]', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-1f44c5-7-2', '1f44c5', 32, '7', '(iii) Solve the following equation, give your answer correct to 2 significant figures. [4]

$$4x + \frac{6}{x} + 13 = 0$$', 4, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-1f44c5-8-0', '1f44c5', 33, '8', '(i) A cylinder of radius 12cm contains water up to the height is 20 cm. A spherical iron ball is dropped into the cylinder and thus water level is raised by 6.75 cm. What is the radius of the ball? [3]', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-1f44c5-8-1', '1f44c5', 34, '8', '(ii) In the figure given below, AB || DE,

AC = 3 cm,

CE = 7.5 cm and

BD = 14 cm.

Calculate CB and DC.', 3, 'Similarity', 'short', 5, '1f44c5__Billabong__p5_img_0_jpeg.webp', NULL),
  ('MQ-1f44c5-8-2', '1f44c5', 35, '8', '(iii) Construct a regular hexagon of side 4 cm and draw its circumcircle. [4]', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-1f44c5-9-0', '1f44c5', 36, '9', '(i) In the figure O is the centre of the circle,

PT is a tangent at point C,

CB = CA, ∠AED = 70°.

Find:

(a) \(\angle ACB\)
(b) \(\angle AOB\)
(c) \(\angle ACT\)

[4]', 4, 'Circles', 'long', 6, '1f44c5__Billabong__p6_img_0_jpeg.webp', NULL),
  ('MQ-1f44c5-9-1', '1f44c5', 37, '9', '(ii) The following the marks obtained by students in an exam:

| Marks | 30 - 40 | 40 - 50 | 50 - 60 | 60 -70 | 70 - 80 | 80 -90 | 90 - 100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 4 | 13 | 24 | 40 | 30 | 6 |

On a graph paper, take scale 2cm = 10 units on one axis and 2cm = 20 units on another axis.

Construct a cumulative frequency table and draw the ogive.

Estimate the:

(a) median.
(b) the interquartile range.
(c) the number of students scoring above 90 marks.

[6]', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-1f44c5-10-0', '1f44c5', 38, '10', '(i) Solve the inequation and represent the solution set on the number line:

$$-2 + 10x \leq 13x + 10 < 14 + 10x, x \in R$$', NULL, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-1f44c5-10-1', '1f44c5', 39, '10', '(ii) Five years ago, a woman''s age was the square of her son''s age. Ten years hence her age will be twice that of her son''s age. Find:

(a) The age of son five years ago.
(b) The present age of the woman.

[3]', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-1f44c5-10-2', '1f44c5', 40, '10', '(iii) Draw a circle of radius 3. 5cm. Mark the centre as ''O'' Take a point P at a distance of 6cm, from the centre ''O''. Construct two tangents from P to the circle. Measure and write down the length of tangent segments.

[4]', 4, 'Constructions', 'long', 6, NULL, NULL),
  ('MQ-e0a4b7-1-0', 'e0a4b7', 0, '1', '1) The roots of the quadratic equation $$x^2 - 5x + 5 = 0$$ are :

A) Real and equal B) Real and unequal C) Rational
D) Imaginary', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-e0a4b7-1-1', 'e0a4b7', 1, '1', '2) The remainder when $$x^4 - x^3 + x^2 - x + 1$$ is divided by $$(x - 1)$$ is :', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['0', '1', '-1', '2']::text[]),
  ('MQ-e0a4b7-1-2', 'e0a4b7', 2, '1', '3) A refrigerator was sold for Rs. 15,000 under intrastate transaction from station A to station B, the rate of GST is 18%. CGST is equal to:', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 1400', 'Rs 1350', 'Rs 1300', 'Rs 2700']::text[]),
  ('MQ-e0a4b7-1-3', 'e0a4b7', 3, '1', '4) The 10th term the end of the A.P. -2, -6, -10, ..., -110 is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['-72', '74', '-74', '-70']::text[]),
  ('MQ-e0a4b7-1-4', 'e0a4b7', 4, '1', '5) Which of the following cannot be a probability of an event?', 1, 'Probability', 'MCQ', 1, NULL, array['3/7', '0.82', '37%', '-2.4']::text[]),
  ('MQ-e0a4b7-1-5', 'e0a4b7', 5, '1', '6) Piyush has a recurring deposit account for 2 years at 10%p.a. If he receives Rs. 1900 as interest, the monthly instalment paid by him is :', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 700', 'Rs 750', 'Rs 760', 'Rs 800']::text[]),
  ('MQ-e0a4b7-1-6', 'e0a4b7', 6, '1', '7) From the given figure, find AB', 1, NULL, 'MCQ', 1, 'e0a4b7__Bishop_Wes_p1_img_0_jpeg.webp', array['58.56m', '138.56m', '58.56cm', '140m']::text[]),
  ('MQ-e0a4b7-1-7', 'e0a4b7', 7, '1', '8) If C (-2, 1) is the mid point of the line segment joining A(-6, p) and B(2, p+6), the value of p is', 1, 'Coordinate Geometry', 'MCQ', 1, NULL, array['2', '-2', '0', '4']::text[]),
  ('MQ-e0a4b7-1-8', 'e0a4b7', 8, '1', '9) If (x-1) is a factor of $$3x^2 + px - 1$$, the value of p is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['2', '-2', '1', '-1']::text[]),
  ('MQ-e0a4b7-1-9', 'e0a4b7', 9, '1', '10) If 5 - 3x < 11, x ∈ R, then the solution set will be :

A) {x:x > -2, x ∈ R} B) {x:x ≥ -2, x ∈ R}

C) {x: x<2, x ∈ R}

D) {x: x< -2, x ∈ R}', 1, 'Linear Inequations', 'short', 1, NULL, NULL),
  ('MQ-e0a4b7-1-10', 'e0a4b7', 10, '1', '11) How many multiples of 4 lie between 10 and 250 ?', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['48', '64', '60', '52']::text[]),
  ('MQ-e0a4b7-1-11', 'e0a4b7', 11, '1', '12) The point O (0,0) is invariant under reflection in ---:
A) X axis B) Y axis C) Origin D) all three', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-1-12', 'e0a4b7', 12, '1', '13) The fourth proportional to 7, 13 and 35 is:
A) 65 B) 62 C) 52 D) 50', 1, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-1-13', 'e0a4b7', 13, '1', '14) If $A = \begin{bmatrix} -2 & 3 \\ 4 & 5 \end{bmatrix}$ and $B = \begin{bmatrix} 5 & 2 \\ -7 & 3 \end{bmatrix}$ , then the transpose of matrix $(A+B)$ is
A) $\begin{bmatrix} 3 & 5 \\ -3 & 8 \end{bmatrix}$ B) $\begin{bmatrix} 3 & -3 \\ 5 & 8 \end{bmatrix}$ C) $\begin{bmatrix} 3 & 8 \\ -3 & 5 \end{bmatrix}$ D) $\begin{bmatrix} 3 & 5 \\ -8 & 3 \end{bmatrix}$', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-1-14', 'e0a4b7', 14, '1', '15) The co ordinates of the third vertex of a triangle whose two vertices and centroid are (0,0), (5,6) and (0,3) respectively are:

A) (8,9) B) (9,5) C) (5,9) D) (-5,3)', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-2-0', 'e0a4b7', 15, '2', 'a) The shadow of a tower on a level ground increases by 10m when the altitude of the sun changes from 45° to 30°. Find the height of the tower correct to two significant figures. -13.6 [4]', 4, 'Trigonometry', 'long', 2, NULL, NULL),
  ('MQ-e0a4b7-2-1', 'e0a4b7', 16, '2', 'b) A car made a run of 390km in x hours. If the speed had been 4km/hr more, it would have taken 2 hours less for the journey. Find x. [4]', 4, 'Quadratic Equations', 'long', 2, NULL, NULL),
  ('MQ-e0a4b7-2-2', 'e0a4b7', 17, '2', 'c) Use a graph paper for this question. Taking 2cm = 2 units on both axes. Plot the points A (2,5) and B(0,-3). Find

- i) the image A'' of A under reflection in the line y = 0
- ii) the image B'' of B under reflection in the AA''
- iii) name the figure ABA''B''
- iv) measure the sides AA'' and BB''', NULL, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-3-0', 'e0a4b7', 18, '3', 'a) Prove the identity: $\frac{\sin \theta + \cos \theta}{\sin \theta - \cos \theta} + \frac{\sin \theta - \cos \theta}{\sin \theta + \cos \theta} = \frac{2}{1 - 2 \cos^2 \theta}$', NULL, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-3-1', 'e0a4b7', 19, '3', 'b) Solve: $\frac{8}{x+3} - 2 = \frac{3}{2-x}$', NULL, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-3-2', 'e0a4b7', 20, '3', 'c) The 5$^{th}$ term of an A.P. is 34 and the 15$^{th}$ term is 9. Find the A.P. [4]', 4, 'Arithmetic Progression', 'long', 2, NULL, NULL),
  ('MQ-e0a4b7-4-0', 'e0a4b7', 21, '4', 'a) Solve for x and give your answer correct to 2 places of decimal $x^2 - 5x - 10 = 0$ [3]', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-4-1', 'e0a4b7', 22, '4', 'b) What number must be subtracted from each of the numbers 23, 30, 57 and 78, so that the remainders are in proportion. [3]', 3, 'Ratio and Proportion', 'short', 2, NULL, NULL),
  ('MQ-e0a4b7-4-2', 'e0a4b7', 23, '4', 'c) Mrs. Shah opened a recurring deposit account in a bank and deposited Rs 800 per month for one and half years. If she received Rs 15084 at the time of maturity, find the rate of interest per annum. [4]', 4, 'GST and Banking', 'long', 2, NULL, NULL),
  ('MQ-e0a4b7-5-0', 'e0a4b7', 24, '5', 'a) Prove that

$$\sqrt{\sec^2 A + \cosec^2 A} = \tan A + \cot A$$', NULL, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-5-1', 'e0a4b7', 25, '5', 'b) The first and the last term of an AP are 17 and 350 respectively. If its common difference is 9, find the sum of the series.', NULL, 'Arithmetic Progression', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-5-2', 'e0a4b7', 26, '5', 'c) A dealer in Delhi supplied an item of Rs. 50,000 (printed price) at a discount of 20% in Jaipur
. If the rate of GST is 28%, find
i) the amount of CGST and SGST paid by the dealer in Jaipur
ii) the amount of IGST collected by the dealer in Delhi
iii) the amount of bill', NULL, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-6-0', 'e0a4b7', 27, '6', 'a) A bag contains 5 red balls and some blue balls. If the probability of drawing a blue ball from the bag is four times that of a red ball, find the number of blue balls in the bag.', NULL, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-6-1', 'e0a4b7', 28, '6', 'b) Given $$A = \begin{bmatrix} 2 & -1 \\ 2 & 0 \end{bmatrix}$$, $$B = \begin{bmatrix} -3 & 2 \\ 4 & 0 \end{bmatrix}$$ and $$C = \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$ find matrix X such that $$X = 2B + C - A$$', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-6-2', 'e0a4b7', 29, '6', 'c) Factorise using remainder factor theorem: $$2x^3 + 9x^2 + 7x - 6$$', NULL, 'Factorisation and Remainder Theorem', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-7-0', 'e0a4b7', 30, '7', 'a) Solve the inequation: $$-2\frac{5}{6} < \frac{1}{2} - \frac{2x}{3} \le 2$$, x ∈ W also graph the solution set.

[3]', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-7-1', 'e0a4b7', 31, '7', 'b) Find the mean of the following distribution using step deviation method:

| Class interval | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 | 50 - 60 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 10 | 9 | 25 | 30 | 16 | 10 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-7-2', 'e0a4b7', 32, '7', 'c) Using properties of proportion, solve for x

$$\frac{\sqrt{12x+1} + \sqrt{2x-3}}{\sqrt{12x+1} - \sqrt{2x-3}} = \frac{3}{2}$$

[4]', 4, 'Ratio and Proportion', 'long', 3, NULL, NULL),
  ('MQ-e0a4b7-8-0', 'e0a4b7', 33, '8', 'a) If $$X = \begin{bmatrix} 4 & 1 \\ -1 & 2 \end{bmatrix}$$, show that $$6X - X^2 = 9I$$, where I is a unit matrix of order 2 X 2.', NULL, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-8-1', 'e0a4b7', 34, '8', 'b) Calculate the ratio in which the line joining A(-4,2) and B(3,6) is divided by the point P(x,3). Also find the value of x.', NULL, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-8-2', 'e0a4b7', 35, '8', 'c) If the mean of the following distribution is 24, find the value of a.

| Marks | 0 - 10 | 10 - 20 | 20 - 30 | 30 - 40 | 40 - 50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 7 | 4 | 8 | 10 | 5 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-e0a4b7-9-0', 'e0a4b7', 36, '9', 'a) The horizontal distance between two towers is 120m. The angle of elevation of the top and angle of depression of the bottom of the first tower as seen from the second tower are 30° and 24° respectively. Find the height of the two towers correct to 3 significant figures. [5]', 5, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-e0a4b7-9-1', 'e0a4b7', 37, '9', 'b) The result of an examination are tabulated below :

[5]

| Marks less than | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 8 | 20 | 40 | 75 | 125 | 160 | 188 | 192 | 197 | 200 |

Taking 2cm = 10 marks on one axis and 2cm = 20 students on the other axis, draw an ogive for the above and from the ogive determine

i) the median
(ii) the number of students who failed if the pass marks was 35.
(iii) the number of students who obtained grade A, if the lowest marks for grade A was 75.', 5, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-81530d-1-0', '81530d', 0, '1', 'i) The median of a set of 9 distinct observations is 20.5. If each of the largest 4 observations of the set is increased by 2, then the median of the new set', 1, 'Statistics', 'MCQ', 1, NULL, array['is increased by 2', 'is decreased by 2', 'is two times of the original number', 'Remains the same as that of the original set.']::text[]),
  ('MQ-81530d-1-1', '81530d', 1, '1', 'ii) If Siddarth opened a recurring deposit account in a bank and deposited ₹800 per month for 1 ½ years, then the total money deposited in the account is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs.11400', 'Rs. 14400', 'Rs. 1368', 'Rs. 11000']::text[]),
  ('MQ-81530d-1-2', '81530d', 2, '1', 'iii) If $1\frac{1}{2}$ is a solution of equation $2x^2 + px - 6 = 0$, then the value of p is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['1', '-1', '2', '-2']::text[]),
  ('MQ-81530d-1-3', '81530d', 3, '1', 'iv) The radii of two cylinders are in the ratio 2 : 3 and their heights are in the ratio 5 : 3. The ratio of their volumes is', 1, 'Mensuration', 'MCQ', 2, NULL, array['\(10:17\)', '20:27', '17:27', '20:37']::text[]),
  ('MQ-81530d-1-4', '81530d', 4, '1', 'v) The probability of getting a bad egg in a lot of 400 eggs is 0.035. Find the number of bad eggs in the lot.', 1, 'Probability', 'MCQ', 2, NULL, array['7', '14', '21', '28']::text[]),
  ('MQ-81530d-1-5', '81530d', 5, '1', 'vi) If one factor of the quadratic polynomial $x^2 + 3x + k$ is (x-2), then the value of k is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['10', '-10', '5', '-5']::text[]),
  ('MQ-81530d-2-0', '81530d', 6, '2', '(a) If $x^3 + ax^2 + bx + 6$ has $x - 2$ as a factor and leaves a remainder 3 when divided by $x - 3$, find the values of a and b. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 2, NULL, NULL),
  ('MQ-81530d-2-1', '81530d', 7, '2', '(b) Find the equation of the perpendicular bisector of the line joining the points (1,3) and (3,1). [4]', 4, 'Coordinate Geometry', 'long', 2, NULL, NULL),
  ('MQ-81530d-2-2', '81530d', 8, '2', '(c) A conical tent is used to accommodate 77 persons. Each person must have $16m^3$ of air to breathe. Given the radius of the tent as 7 m, find the height of the tent and also its curved surface area. [3]', 3, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-81530d-2-3', '81530d', 9, '2', '(d) Prove that [3]

$$
\frac{\sin \theta - 2 \sin^3 \theta}{2 \cos^3 \theta - \cos \theta} = \tan \theta
$$', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-81530d-3-0', '81530d', 10, '3', '(a) A die is thrown once. Find the probability of getting:

(i) an even number
(ii) a number between 3 and 8
(iii) an even number or a multiple of 3 [3]', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-81530d-3-1', '81530d', 11, '3', '(b) Ashish deposits a certain sum of money every month in a Recurring Deposit Account for a period of 1-year. If the bank pays interest at the rate of 11% p.a. and Ashish gets ₹ 12,715 as the maturity value of this account, what sum of money did he pay every month? [3]', 3, 'GST and Banking', 'short', 3, NULL, NULL),
  ('MQ-81530d-3-2', '81530d', 12, '3', '(c) Using graph paper, plot the points A(6, 4) and B(0, 4).

(i) Reflect A and B in the origin to get the images A'' and B''.

(ii) Write the coordinates of A'' & B''

(iii) State the geometrical name for the figure ABA''B''.

(iv) Find its perimeter.

[4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-81530d-4-0', '81530d', 13, '4', '(a)

Attempt this question on a graph paper. Draw a histogram from the following frequency distribution table and find the mode from the graph:

| Class | 0-5 | 5-10 | 10-15 | 15-20 | 20-25 | 25-30 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 2 | 5 | 18 | 14 | 8 | 5 |', NULL, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-81530d-4-1', '81530d', 14, '4', '(b) Evaluate without using tables:

[3]

$$\left[ \begin{array}{cc} 2 \cos 60^\circ & -2 \sin 30^\circ \\ -\tan 45^\circ & \cos 0^\circ \end{array} \right] \left[ \begin{array}{cc} \cot 45^\circ & \csc 30^\circ \\ \sec 60^\circ & \sin 90^\circ \end{array} \right]$$', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-81530d-4-2', '81530d', 15, '4', '(c) The angle of elevation of the top of an unfinished tower at a point

80m from its base is 30°. How much higher must the tower

be raised so that its angle of elevation at the same point may be 60°

Give your answer to the nearest meter.

[4]', 4, 'Trigonometry', 'long', 3, NULL, NULL),
  ('MQ-81530d-5-0', '81530d', 16, '5', '(a) Attempt this question on a graph paper. Marks obtained by 200 students in examination are given below:

| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 5 | 10 | 14 | 21 | 25 | 34 | 36 | 27 | 16 | 12 |

Draw an Ogive for the given distribution taking 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis.

From the graph find:

(i) the Median
(ii) the Upper Quartile
(iii) the number of students scoring above 65 marks.
(iv) If 10 students qualify for merit scholarship, find the minimum marks required to qualify. [6]', 6, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-81530d-5-1', '81530d', 17, '5', '(b) If the speed of a car is increased by \(10\mathrm{km / hr}\), the time of the journey for a distance of \(72\mathrm{km}\) is reduced by 36 minutes. Find the original speed of the car. [4]', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-1b4868-1-0', '1b4868', 0, '1', '(i) If a polynomial $$3x^2 - 5x + p$$ when divided by (x-2) leaves the remainder 3, then the value of p is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['-19', '- 2', '1', '-1']::text[]),
  ('MQ-1b4868-1-1', '1b4868', 1, '1', '(ii) If $$x \begin{bmatrix} 2 \\ 3 \end{bmatrix} + y \begin{bmatrix} -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 10 \\ 6 \end{bmatrix}$$, then the values of x and y are', 1, 'Matrices', 'MCQ', 1, NULL, array['\(x = 3, y = -6\)', '\(x = 2, y = 6\)', '\(x = 3, y = -4\)', '\(x = 2, y = -6\)']::text[]),
  ('MQ-1b4868-1-2', '1b4868', 2, '1', '(iii) The percentage share of SGST of total GST for an intra-state sale of an article is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['\(75\%\)', '\(50\%\)', '\(25\%\)', '\(100\%\)']::text[]),
  ('MQ-1b4868-1-3', '1b4868', 3, '1', '(iv) If the height of a tree is $\sqrt{3}$ times the length of its shadow, then the angle of elevation of the sun is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['\(45^{\circ}\)', '\(60^{\circ}\)', '\(30^{\circ}\)', '\(90^{\circ}\)']::text[]),
  ('MQ-1b4868-1-4', '1b4868', 4, '1', '(v) The point A(0,-4) is invariant under reflection in', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['both x and y axes', 'origin', 'y-axis', 'x-axis']::text[]),
  ('MQ-1b4868-1-5', '1b4868', 5, '1', '(vi) If probability of an event E is 0.07, then the probability of event E not happening is', 1, 'Probability', 'MCQ', 2, NULL, array['0.93', '0.95', '0.89', '0.90']::text[]),
  ('MQ-1b4868-1-6', '1b4868', 6, '1', '(vii) Which of the following matrix multiplication is not possible?', 1, 'Matrices', 'MCQ', 2, NULL, array['$[3 \quad 2] \begin{bmatrix} 2 \\ 0 \end{bmatrix}$', '$[1 \quad -2] \begin{bmatrix} -2 & 3 \\ -1 & 4 \end{bmatrix}$', '$\begin{bmatrix} 6 & 4 \\ 3 & -1 \end{bmatrix} \begin{bmatrix} -1 \\ 3 \end{bmatrix}$', '$\begin{bmatrix} 2 & 4 \\ 0 & -1 \end{bmatrix} [-1 \quad 3]$']::text[]),
  ('MQ-1b4868-1-7', '1b4868', 7, '1', '(viii) The sum of first n terms of the series a,3a,5a... is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['\(n^2 a^2\)', '\(n^2 a\)', '\(\frac{(2n - 1)an}{2}\)', 'na']::text[]),
  ('MQ-1b4868-1-8', '1b4868', 8, '1', '(ix) The equation $(x+1)^2 - 2(x+1) = 0$ has', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['two equal roots', 'no real roots', 'one real root', 'two real roots']::text[]),
  ('MQ-1b4868-1-9', '1b4868', 9, '1', '(x) The solution set of the following number line is', 1, 'Linear Inequations', 'MCQ', 3, '1b4868__Bombay_Sco_p3_img_0_jpeg.webp', array['\(\{\mathbf{x} / - 1\leq \mathbf{x}\leq 4,\mathbf{x}\in \mathbb{R}\}\)', '\(\{\mathbf{x} / -1\leq \mathbf{x} < 5,\mathbf{x}\in \mathbb{R}\}\)', '\(\{\mathbf{x} / -1 < \mathbf{x}\leq 5,\mathbf{x}\in \mathbb{R}\}\)', '\(\{\mathbf{x} / -1\leq \mathbf{x}\leq 5,\mathbf{x}\in \mathbb{R}\}\)']::text[]),
  ('MQ-1b4868-1-10', '1b4868', 10, '1', '(xi) A cone is surmounted on a flat side of a coin. The cone has same radius as the coin. The surface area of the solid formed is equal to the', 1, 'Mensuration', 'MCQ', 3, NULL, array['base area of coin + C.S.A of coin', 'base area of coin + C.S.A of coin + C.S.A of cone', 'T.S.A of cone + T.S.A of coin', 'T.S.A of cone']::text[]),
  ('MQ-1b4868-1-11', '1b4868', 11, '1', '(xii) AB is a diameter of a circle with centre O(-2,2). If point A is (3, -7) then the coordinates of B are', 1, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(-7,11)', '(7, -11)', '(-9,13)', '(9, -13)']::text[]),
  ('MQ-1b4868-1-12', '1b4868', 12, '1', '(xiii) In the given figure, PA is a tangent to the circle at point A, PB = 16cm, BC = 9cm. The length of PA is', 1, 'Circles', 'MCQ', 3, '1b4868__Bombay_Sco_p3_img_1_jpeg.webp', array['\(25\mathrm{cm}\)', '9cm', '\(20\mathrm{cm}\)', '10cm']::text[]),
  ('MQ-1b4868-1-13', '1b4868', 13, '1', 'In a grouped frequency distribution, the mid values of the classes are used to measure which of the following central tendency?', 1, 'Statistics', 'MCQ', 3, NULL, array['Median', 'Mode', 'Mean', 'all of these']::text[]),
  ('MQ-1b4868-1-14', '1b4868', 14, '1', '★ (xv)

If the slope of the side BC of a rectangle ABCD is $\frac{2}{3}$, then the slope of the side AB is

(a) -3', 1, 'Coordinate Geometry', 'short', 4, '1b4868__Bombay_Sco_p4_img_0_jpeg.webp', NULL),
  ('MQ-1b4868-2-0', '1b4868', 15, '2', 'a) David has a recurring deposit in a bank for 2 years at 6% per annum. If he gets ₹1200 as interest at the time of maturity, find :

i) the monthly instalment. ii) the amount of maturity. [4]', 4, 'GST and Banking', 'long', 4, NULL, NULL),
  ('MQ-1b4868-2-1', '1b4868', 16, '2', 'b) Prove that: (coscc A - sin A) (sec A - cos A) (tan A + cot A) = 1 [4]', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-1b4868-2-2', '1b4868', 17, '2', 'c) If M = $\begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}$ and I is a unit matrix of the same order as that of M, show that M² - 2M = 3I [4] 2', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-1b4868-3-0', '1b4868', 18, '3', 'a) A toy is in the form of a cone mounted on a hemisphere of same radius 3.5cm. The total height of the toy is 15.5cm. Find:

i) the slant height of the cone.
ii) the total surface area of the toy. Give your answer correct to the nearest whole number. (Take \(\pi = \frac{22}{7}\)) [4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-1b4868-3-1', '1b4868', 19, '3', 'b) Using properties of proportion, find the value of x.

$$\frac{\sqrt{3x+4} + \sqrt{3x-5}}{\sqrt{3x+4} - \sqrt{3x-5}} = 9$$ [4] 4', 4, 'Ratio and Proportion', 'long', 4, NULL, NULL),
  ('MQ-1b4868-3-2', '1b4868', 20, '3', 'c) Use graph paper for this question: Plot P(3,4) and reflect it along the x-axis as P'' O'' is the image of O (the origin) when reflected in the line PP''.

Write:

i) the coordinates of \(\mathbf{P}''\) and \(\mathbf{O}''\).
ii) the equation of the line segment \(\mathbf{PP}^{\prime}\).
iii) the geometrical name of the figure \(\mathrm{POP}^{\prime}\mathrm{O}^{\prime}\)
iv) the perimeter of the figure. [5]', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-1b4868-4-0', '1b4868', 21, '4', 'a) Solve the following quadratic equation and give your answer correct to 2 significant figures.

$$4x^2 - 5x - 3 = 0 \tag{3}$$', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-1b4868-4-1', '1b4868', 22, '4', 'b) Construct a regular hexagon of side 5cm and construct a circle circumscribing the hexagon. Measure and write the length of the circum-radius.

[3]', 3, 'Constructions', 'short', 5, NULL, NULL),
  ('MQ-1b4868-4-2', '1b4868', 23, '4', 'c) A line AB meets x-axis at A and y-axis at B. Point P(4,-1) divides AB in the ratio 1:2.

i) Find the coordinates of A and B.
ii) Find the equation of a line through P and perpendicular to AB. [4]', 4, 'Coordinate Geometry', 'long', 5, '1b4868__Bombay_Sco_p5_img_0_jpeg.webp', NULL),
  ('MQ-1b4868-5-0', '1b4868', 24, '5', 'a) Solve the following inequation, write the solution set and represent it on the number line.

$$2x - 3 < x + 1 \le 4x + 7 \text{ , } x \in W \tag{3}$$', 3, 'Linear Inequations', 'short', 5, NULL, NULL),
  ('MQ-1b4868-5-1', '1b4868', 25, '5', 'b) In the figure given below, PQRS is a cyclic quadrilateral. PQ and SR produced meet at T.

i) Prove: \(\Delta \mathrm{TPS} \sim \Delta \mathrm{TRQ}\).
ii) If \(\mathrm{TP} = 18\mathrm{cm}\), \(\mathrm{RQ} = 4\mathrm{cm}\) and \(\mathrm{TR} = 6\mathrm{cm}\), find PS. [3]', 3, 'Similarity', 'short', 5, '1b4868__Bombay_Sco_p5_img_1_jpeg.webp', NULL),
  ('MQ-1b4868-5-2', '1b4868', 26, '5', 'c) The expression x³ -kx² +14x - 8 has (x-2) as a factor.
 i) Find the value of k.
 ii) With the value of k, factorise the above expression completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-1b4868-6-0', '1b4868', 27, '6', 'a) A box contains 7 blue, 8 white and 5 black marbles. If a marble is drawn at random, then find the probability that the marble drawn is

i) black.
ii) blue or white.
iii) green.

[3]', 3, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-1b4868-6-1', '1b4868', 28, '6', 'b) Two solid spheres of radii 2cm and 4cm are melted and recast into a solid cylinder of height 6cm. Find the radius of the cylinder formed.', NULL, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-1b4868-6-2', '1b4868', 29, '6', 'c) A manufacturer sells an air-fryer to a dealer for ₹18000 and the dealer sells it to a consumer at a profit of ₹1500. If the sales are intra-state and the rate of GST is 12%, find

i) the amount of GST paid by the dealer to the State Government.
ii) the amount paid by the consumer for the air-fryer.
iii) the amount of GST received by the Government.', NULL, 'GST and Banking', 'short', 6, NULL, NULL),
  ('MQ-1b4868-7-0', '1b4868', 30, '7', 'a) From the top of a 80m tall light house, the angles of depression of two ships on the same side of the light house in horizontal line with its base are 30° and 40° respectively. Find the distance between the two ships. Give your answer correct to 2 significant figures.', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-1b4868-7-1', '1b4868', 31, '7', 'b) Use graph paper for this question.
The following distribution represents the height of 160 students of a school.

| Height (in cm) | 140-145 | 145-150 | 150-155 | 155-160 | 160-165 | 165-170 | 170-175 | 175-180 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 12 | 20 | 30 | 38 | 24 | 16 | 12 | 8 |

Draw an ogive for the given distribution taking 2cm = 5cm of height on one axis and 2cm = 20 students on the other axis. Use the graph to determine:

i) The median height.
ii) The upper quartile.
iii) The number of students whose height is above 172cm.

[6]', 6, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-1b4868-8-0', '1b4868', 32, '8', 'a) The second, third and the last term of an A.P are 14, 18 and 114 respectively. Find the first term and the number of terms in the A.P.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-1b4868-8-1', '1b4868', 33, '8', 'b) In the figure given below, O is the centre of the circle, ST is a tangent to the circle at D, ∠ ABO = 30⁰ and ∠ BDS = 66⁰.

Find

i) \(\angle DAB\)
ii) \(\angle DCB\)
iii) \(\angle ADT\)

[3] 1', 3, 'Circles', 'short', 7, '1b4868__Bombay_Sco_p7_img_0_jpeg.webp', NULL),
  ('MQ-1b4868-8-2', '1b4868', 34, '8', 'c) The following are the marks obtained by 70 students in a class test. [4] 4

| Marks | 30-40 | 40-50 | 50-60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of students | 10 | 12 | 14 | 12 | 9 | 7 | 6 |

Calculate the mean by step-deviation method. Give your answer correct to 2 decimal places.', 4, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-1b4868-9-0', '1b4868', 35, '9', 'a) Find the equation of a line parallel to \( x - 2y + 8 = 0 \) and passing through the point (1, 2).', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-1b4868-9-1', '1b4868', 36, '9', 'b) Find two numbers such that the mean proportion between them is 12 and the third proportion to them is 96. [3]', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-1b4868-9-2', '1b4868', 37, '9', 'c) A two digit positive number is such that the product of its digits is 6. If 9 is added to the number, the digits interchange their places. Find the number. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-1b4868-10-0', '1b4868', 38, '10', 'a) If A = $$\begin{bmatrix} 4 & 5 \\ 3 & 4 \end{bmatrix}$$, B = $$\begin{bmatrix} 7 \\ 6 \end{bmatrix}$$ and AX = B. Find the

i) order of matrix \(X\)
ii) matrix X

[3]', 3, 'Matrices', 'short', 7, NULL, NULL),
  ('MQ-1b4868-10-1', '1b4868', 39, '10', 'b) In the given figure, S is a point on the side QR of ΔPQR such that ∠PSR = ∠QPR. If QP = 8cm, PR = 6cm and SR = 3cm.

i) Prove \(\Delta \mathrm{PQR}\sim \Delta \mathrm{SPR}\)
ii) Find the length of QR and PS. [3]', 3, 'Similarity', 'short', 8, '1b4868__Bombay_Sco_p8_img_0_jpeg.webp', NULL),
  ('MQ-1b4868-10-2', '1b4868', 40, '10', 'c) Use graph paper for this question.

The daily pocket expenses of some students in the class are given below:

| Pocket expenses in ₹ | 0-50 | 50-100 | 100-150 | 150-200 | 200-250 |
| --- | --- | --- | --- | --- | --- |
| No of students | 8 | 10 | 24 | 18 | 6 |

Draw a histogram for the given distribution, estimate the mode and write the modal class. [4]', 4, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-9d77d9-1.i-0', '9d77d9', 0, '1.i', 'i) Which of the following is the probability of an event?', NULL, 'Probability', 'MCQ', 1, NULL, array['-0.04', '1.004', '\(\frac{18}{23}\)', '\(\frac{8}{7}\)']::text[]),
  ('MQ-9d77d9-1.ii-0', '9d77d9', 1, '1.ii', 'ii) The value(s) of k for which the quadratic equation $$2x^2 - kx + k = 0$$ has equal roots is (are)', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['0 only', '4', '8 only', '0,8']::text[]),
  ('MQ-9d77d9-1.iii-0', '9d77d9', 2, '1.iii', 'iii) The volume of the greatest sphere cut off from a circular cylindrical wood of base radius 1 cm and height 6 cm is', NULL, 'Mensuration', 'MCQ', 1, NULL, array['\(288\pi \mathrm{cm}^3\)', '\(\frac{4}{3}\pi \mathrm{cm}^3\)', '\(6\pi \mathrm{cm}^3\)', '\(4\pi \mathrm{cm}^3\)']::text[]),
  ('MQ-9d77d9-1.iv-0', '9d77d9', 3, '1.iv', 'iv) The quadratic equation $$2x^2 - \sqrt{5}x + 1 = 0$$ has', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['Two distinct real roots', 'two equal real roots', 'no real roots', 'more than two real roots']::text[]),
  ('MQ-9d77d9-1.v-0', '9d77d9', 4, '1.v', 'v) If a rectangular sheet having dimensions 22 cm x 11 cm is rolled along its shorter side to form a cylinder. Then the curved surface area of the cylinder so formed is:', NULL, 'Mensuration', 'MCQ', 2, NULL, array['968 cm²', '424 cm²', '121 cm²', '242 cm²']::text[]),
  ('MQ-9d77d9-1.vi-0', '9d77d9', 5, '1.vi', 'vi) The probability of getting a bad egg in a lot of 400 eggs is 0.035. The number of bad eggs in the lot is', NULL, 'Probability', 'MCQ', 2, NULL, array['28', '7', '14', '21']::text[]),
  ('MQ-9d77d9-1.vii-0', '9d77d9', 6, '1.vii', 'vii) What should be added to 2x³+5x²-28x-18 so that (x-3) is a factor of the resulting polynomial?', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['1', '-3', '3', '-2']::text[]),
  ('MQ-9d77d9-1.viii-0', '9d77d9', 7, '1.viii', 'viii)
If M x [ 3 6
 -2 -8 ] = [-2 16]
then the order of matrix M is', NULL, 'Matrices', 'MCQ', 2, NULL, array['2 x 2', '2 x 1', '1 x 2', '1 x 1']::text[]),
  ('MQ-9d77d9-1.ix-0', '9d77d9', 8, '1.ix', 'ix) If 0⁰ ≤ A ≤ 90⁰ and 4sin²A - 3 = 0 , then the value of A is', NULL, 'Trigonometry', 'MCQ', 3, NULL, array['45⁰', '90⁰', '60⁰', '30⁰']::text[]),
  ('MQ-9d77d9-1.x-0', '9d77d9', 9, '1.x', 'x) $$\frac{(1 + \tan^2 A) \cot A}{\cosec^2 A}$$ is equal to', NULL, 'Trigonometry', 'MCQ', 3, NULL, array['tan A', 'sec A', 'cot A', 'cosec A']::text[])
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
