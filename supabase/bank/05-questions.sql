set standard_conforming_strings = on;
begin;

-- questions 1501-2000 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-55c388-24-1', '55c388', 25, '24', '(B) Evaluate the following: 2

$$
\frac {3 \sin 3 0 ^ {\circ} - 4 \sin^ {3} 3 0 ^ {\circ}}{2 \sin^ {2} 5 0 ^ {\circ} + 2 \cos^ {2} 5 0 ^ {\circ}}
$$', 2, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-55c388-25-0', '55c388', 26, '25', '25. Two friends Anil and Asraf were born in the December month in the year 2010. Find the probability that: 2

(i) they share same date of birth.

(ii) they have different dates of birth.', 2, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-55c388-26-0', '55c388', 27, '26', '26. (A) Prove that $\sqrt{2}$ is an irrational number.', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-55c388-26-1', '55c388', 28, '26', '(B) Let \( x \) and \( y \) be two distinct prime numbers and \( p = x^2y^3 \), \( q = xy^4 \), \( r = x^5y^2 \). Find the HCF and LCM of \( p, q \) and \( r \). Further check if HCF \( (p, q, r) \times \mathrm{LCM}(p, q, r) = p \times q \times r \) or not. 3', 3, NULL, 'short', 3, NULL, NULL),
  ('MQ-55c388-27-0', '55c388', 29, '27', '27. The monthly incomes of two persons are in the ratio 9:7 and their monthly expenditures are in the ratio 4:3. If each saved ₹ 5,000, express the given situation algebraically as a system of linear equations in two variables. Hence, find their respective monthly incomes. 3', 3, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-55c388-28-0', '55c388', 30, '28', '28. \(P(x,y),Q(-2, - 3)\) and \(R(2,3)\) are the vertices of a right triangle PQR right angled at \(P\) . Find the relationship between \(x\) and \(y\) . Hence, find all possible values of \(x\) for which \(y = 2\) 3', 3, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-55c388-29-0', '55c388', 31, '29', '29. (A) Prove that \(\frac{\cos A + \sin A - 1}{\cos A - \sin A + 1} = \operatorname{cosec} A - \cot A\) 3', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-55c388-29-1', '55c388', 32, '29', '(B) If \(\cot \theta +\cos \theta = p\) and \(\cot \theta -\cos \theta = q,\) prove that \(p^2 -q^2 = 4\sqrt{pq}\) 3', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-55c388-30-0', '55c388', 33, '30', '30. \(\alpha\) and \(\beta\) are zeroes of a quadratic polynomial \(px^3 + qx + 1\). Form a quadratic polynomial whose zeroes are \(\frac{2}{\alpha}\) and \(\frac{2}{\beta}\). 3', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-55c388-31-0', '55c388', 34, '31', '31. Rectangle \(ABCD\) circumscribes the circle of radius \(10\mathrm{cm}\). Prove that \(ABCD\) is a square. Hence, find the perimeter of \(ABCD\).', 3, 'Circles', 'short', 3, '55c388__CBSE_X_Mat_p17_img_0_jpeg.webp', NULL),
  ('MQ-55c388-32-0', '55c388', 35, '32', '32. (A) The sides of a right triangle are such that the longest side is $4\mathrm{m}$ more than the shortest side and the third side is $2\mathrm{m}$ less than the longest side. Find the length of each side of the triangle. Also, find the difference between the numerical values of the area and the perimeter of the given triangle. 5', 5, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-55c388-32-1', '55c388', 36, '32', '(B) Express the equation \(\frac{x - 2}{x - 3} +\frac{x - 4}{x - 5} = \frac{10}{3};(x\neq 3,5)\) as a quadratic equation in standard form. Hence, find the roots of the equation so formed. 5', 5, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-55c388-33-0', '55c388', 37, '33', '33. (A) The corresponding sides of \(\Delta ABC\) and \(\Delta PQR\) are in the ratio \(3:5\). \(AD\bot BC\) and \(PS\bot QR\) as shown in the following figures: 5

(i) Prove that \(\Delta ADC\sim \Delta PSR\)
(ii) If \(AD = 4\mathrm{cm}\), find the length of \(PS\).
(iii) Using (ii) find ar \((\Delta ABC):\mathrm{ar}(\Delta PQR)\)', 5, 'Similarity', 'long', 3, '55c388__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-55c388-33-1', '55c388', 38, '33', '(B) State basic proportionality theorem. Use it to prove the following: 5 If three parallel lines $l, m, n$ are intersected by transversals $q$ and $s$ as shown in the adjoining figure,

then $\frac{AB}{BC} = \frac{DE}{EF}$', 5, 'Similarity', 'long', 3, '55c388__CBSE_X_Mat_p3_img_2_jpeg.webp', NULL),
  ('MQ-55c388-34-0', '55c388', 39, '34', '34. A wooden cubical die is formed by forming hemispherical depressions on each of the cube such that face 1 has one depression, face 2 has two depressions and so on. The sum of number of hemispherical depressions on opposite faces is always 7. If the edge of the cubical die measures \(5\mathrm{cm}\) and each hemispherical depression is of diameter \(1.4\mathrm{cm}\), find the total surface area of the die so formed. 5', 5, 'Mensuration', 'long', 3, NULL, NULL),
  ('MQ-55c388-35-0', '55c388', 40, '35', '35. The following table shows the number of patients of different age group who were discharged from the hospital in a particular month: 5

| Age (in years) | Number of Patients Discharged |
| --- | --- |
| 5–15 | 6 |
| 15–25 | 11 |
| 25–35 | 21 |
| 35–45 | 23 |
| 45–55 | 14 |
| 55–65 | 5 |
| Total | 80 |', 5, 'Statistics', 'long', 3, NULL, NULL),
  ('MQ-55c388-36-0', '55c388', 41, '36', '36. The Olympic symbol comprising five interlocking rings represents the union of the five continents of the world and the meeting of athletes from all over the world at the Olympic games. In order to spread awareness about Olympic games, students of Class-X took part in various activities organised by the school. One such group of students made 5 circular rings in the school lawn with the help of ropes. Each circular ring required $44\mathrm{m}$ of rope.

Also, in the shaded regions as shown in the figure, students made rangoli showcasing various sports and games. It is given that $\Delta OAB$ is an equilateral triangle and all unshaded regions are congruent.

XVI

Oswaal CBSE Question Bank Chapterwise & Topicwise, MATHEMATICS STANDARD, Class-10

Based on above information, answer the following questions:

(i) Find the radius of each circular ring. 1
(ii) What is the measure of \(\angle AOB?\) 1
(iii) (A) Find the area of shaded region \(\mathbb{R}_1\) 2', 4, 'Mensuration', 'long', 3, '55c388__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-55c388-37-0', '55c388', 42, '37', '37. Cable cars at hill stations are one of the major tourist attractions. On a hill station, the length of cable car ride from base point to top most point on the hill is $5000\mathrm{m}$ . Poles are installed at equal intervals on the way to provide support to the cable on which car moves.

The distance of first pole from base point is $200\mathrm{m}$ and subsequent poles are installed at equal interval of $150\mathrm{m}$ . Further, the distance of last pole from the top is $300\mathrm{m}$ .

Based on above information, answer the following questions using Arithmetic Progression:

(i) Find the distance of \(10^{\mathrm{th}}\) pole from the base. 1
(ii) Find the distance between \(15^{\mathrm{th}}\) pole and \(25^{\mathrm{th}}\) pole. 1

(iii) (A) Find the time taken by cable car to reach $15^{\text{th}}$ pole from the top if it is moving at the speed of $5\mathrm{m / s}$ and coming from top. 2', 4, 'Arithmetic Progression', 'long', 4, '55c388__CBSE_X_Mat_p4_img_1_jpeg.webp', NULL),
  ('MQ-55c388-38-0', '55c388', 43, '38', '38. A drone was used to facilitate movement of an ambulance on the straight highway to a point \( P \) on the ground where there was an accident.

The ambulance was travelling at the speed of $60~\mathrm{km / h}$ . The drone stopped at a point $Q$ , $100\mathrm{m}$ vertically above the point $P$ . The angle of depression of the ambulance was found to be $30^{\circ}$ at a particular instant.

Based on above information, answer the following questions:

(i) Represent the above situation with the help of a diagram. 1
(ii) Find the distance between the ambulance and the site of accident \((P)\) at the particular instant. (Use \(\sqrt{3} = 1.73\)) 1
(iii) (A) Find the time (in seconds) in which the angle of depression changes from \(30^{\circ}\) to \(45^{\circ}\). 2', 4, 'Trigonometry', 'long', 4, '55c388__CBSE_X_Mat_p4_img_2_jpeg.webp', NULL),
  ('MQ-55c388-6-1', '55c388', 44, '6', '6. The distance of which of the following points from origin is less than 5 units? 1', 1, 'Coordinate Geometry', 'MCQ', 4, NULL, array['(3,4)', '(2,6)', '$(-3, - 4)$', '(1, 4)']::text[]),
  ('MQ-55c388-10-1', '55c388', 45, '10', '10. Which of the following is a trigonometric identity? 1', 1, 'Trigonometry', 'MCQ', 4, NULL, array['$\sin^2\theta = 1 + \cos^2\theta$', '$\mathrm{cosec}^2\theta +\cot^2\theta = 1$', '$\sec^2\theta = 1 + \tan^2\theta$', '$\sin 2\theta = 2\sin \theta$']::text[]),
  ('MQ-55c388-13-1', '55c388', 46, '13', '13. If mean and mode of given set of observations are 10 and 13 respectively, then the value of median is: 1', 1, 'Statistics', 'MCQ', 4, NULL, array['19', '4', '11', '43']::text[]),
  ('MQ-55c388-14-1', '55c388', 47, '14', '14. In the adjoining figure, $AB$ is the chord of larger circle which touches the smaller circle at $P$ . If length of $AB =$ diameter of inner circle $= 2r$ , then the diameter of larger circle is:', 1, 'Circles', 'MCQ', 4, '55c388__CBSE_X_Mat_p4_img_3_jpeg.webp', array['$2r$', '$4r$', '$2\sqrt{2} r$', '$\sqrt{2} r$']::text[]),
  ('MQ-55c388-19-1', '55c388', 48, '19', '19. Assertion (A): A line drawn perpendicular to the tangent at point of contact passes through the centre of the circle.

Reason (R): Lengths of tangents drawn from external point to a circle are equal.', 1, 'Circles', 'short', 5, NULL, NULL),
  ('MQ-55c388-22-2', '55c388', 49, '22', '22. Saima and Aryaa were born in the month of June in the year 2012. Find the probability that:
(i) they have different dates of birth.
(ii) they have same date of birth. 2', 2, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-55c388-23-1', '55c388', 50, '23', '23. Solve the following system of equations algebraically:

$$
37x + 63y = 137
$$

$$
63x + 37y = 163 \tag{2}', 2, NULL, 'short', 5, NULL, NULL),
  ('MQ-55c388-26-2', '55c388', 51, '26', '26. \(\alpha\) and \(\beta\) zeroes of a quadratic polynomial \(x^{2} - ax - b\). Obtain a quadratic polynomial whose zeroes are \(3\alpha + 1\) and \(3\beta + 1\). 3', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-55c388-29-2', '55c388', 52, '29', '29. The two angles of a right angled triangle other than \( 90^{\circ} \) are in the ratio \( 2:3 \). Express the given situation algebraically as a system of linear equations in two variables and hence solve it. 3', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-55c388-32-2', '55c388', 53, '32', '32. The following table shows the number of traffic challans issued in the month of April by the traffic police:

| Number of Challans | Number of Days |
| --- | --- |
| 0–10 | 3 |
| 10–20 | 5 |
| 20–30 | 10 |
| 30–40 | 9 |
| 40–50 | 2 |
| 50–60 | 1 |
| Total | 30 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-55c388-35-1', '55c388', 54, '35', '35. In order to provide shelter to flood victims, a shed was constructed using tin sheets which is in the form of cuboid surmounted by a half cylinder as shown below:

The length, breadth and height of cuboidal portion are 10 m, 7 m and 3 m, respectively. The diameter of the cylindrical portion is 7 m. Find the cost of tin sheets required to make the shed at the rate of ₹ 70 per square metre, given that the shed is open from the front side and closed from the back side. 5', 5, 'Mensuration', 'long', 5, '55c388__CBSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-55c388-4-1', '55c388', 55, '4', '4. If mode and median of given set of observations are 13 and 11 respectively, then the value of mean is:', 1, 'Statistics', 'MCQ', 5, NULL, array['17', '7', '10', '28']::text[]),
  ('MQ-55c388-5-1', '55c388', 56, '5', '5. In the adjoining figure, $AC$ is diameter of larger circle with centre O. $AB$ is tangent to smaller circle with centre O. If $OD = r$, then $BC$ is equal to:', 1, 'Circles', 'MCQ', 5, '55c388__CBSE_X_Mat_p5_img_1_jpeg.webp', array['$r$', '$\frac{3r}{2}$', '$2r$', '$4r$']::text[]),
  ('MQ-55c388-9-1', '55c388', 57, '9', '9. Letters A to F are mentioned on six faces of a die such that each face has a different letter. Two such dice are thrown simultaneously. The probability that vowels turn up on both the dice is:', 1, 'Probability', 'MCQ', 5, NULL, array['$\frac{1}{4}$', '$\frac{1}{3}$', '$\frac{1}{9}$', '$\frac{1}{36}$']::text[]),
  ('MQ-55c388-13-2', '55c388', 58, '13', '13. The distance of point $P(1, -1)$ from $x$-axis is: 1', 1, 'Coordinate Geometry', 'MCQ', 5, NULL, array['1', '-1', '0', '$\sqrt{2}$']::text[]),
  ('MQ-55c388-17-1', '55c388', 59, '17', '17. $\sec A = 2 \cos A$ is true for $A =$', 1, 'Trigonometry', 'MCQ', 5, NULL, array['$0^\circ$', '$30^\circ$', '$45^\circ$', '$60^\circ$']::text[]),
  ('MQ-55c388-20-1', '55c388', 60, '20', '20. Assertion (A): Unit digit of $3^n$ cannot be an even number for any natural number $n$. 1

Reason (R): 2 is not a prime factor of $3^n$ for any natural number $n$.', 1, NULL, 'short', 5, NULL, NULL),
  ('MQ-55c388-24-2', '55c388', 61, '24', '24. Renu and Simran were born in the year 2000 which is a leap year. Find the probability that:

(i) both have same birthday.

(ii) both have different birthdays. 2', 2, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-55c388-25-1', '55c388', 62, '25', '25. Solve the following system of equations algebraically:

$$73x - 37y = 109$$

$$37x - 73y = 1 \quad 2$$', 2, NULL, 'short', 6, NULL, NULL),
  ('MQ-55c388-28-1', '55c388', 63, '28', '28. If $\alpha$ and $\beta$ are the zeroes of the polynomial $ax^2 - x + c$. Obtain a polynomial whose zeroes are $\alpha - 3$ and $\beta - 3$. 3', 3, 'Quadratic Equations', 'short', 6, NULL, NULL),
  ('MQ-55c388-31-1', '55c388', 64, '31', '31. The perimeter of a rectangle is 70 cm. The length of the rectangle is 5 cm more than twice its breadth. Express the given situation as a system of linear equations in two variables and hence solve it. 3', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-55c388-33-2', '55c388', 65, '33', '33. A bat manufacturing company made a huge bat for charity and got it signed by world cup winning team. The dimensions of the bat which is in the form of a cuboid with a cylindrical handle at the top are as follows:

length = 2 m, width = 0.5 m, thickness = 0.1 m
diameter of cylindrical part = 0.1 m
height of cylindrical part = 0.7 m

Find the volume of wood used in the bat. Also, find the total surface area of the wooden bat. 5', 5, 'Mensuration', 'long', 6, NULL, NULL),
  ('MQ-55c388-34-1', '55c388', 66, '34', '34. Following table shows the absentees record of 40 students in an academic year:

| Number of Days | Number of Students |
| --- | --- |
| 2–6 | 11 |
| 6–10 | 10 |
| 10–14 | 7 |
| 14–18 | 4 |
| 18–22 | 4 |
| 22–26 | 3 |
| 26–30 | 1 |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-55c388-1-1', '55c388', 67, '1', '1. $\sqrt{0.4}$ is a/an 1', 1, NULL, 'MCQ', 6, NULL, array['natural number', 'integer', 'rational number', 'irrational number']::text[]),
  ('MQ-55c388-2-1', '55c388', 68, '2', '2. Which of the following cannot be the unit digit of $8^n$, where $n$ is a natural number? 1', 1, NULL, 'MCQ', 6, NULL, array['4', '2', '0', '6']::text[]),
  ('MQ-55c388-3-1', '55c388', 69, '3', '3. Which of the following quadratic equations has real and equal roots? 1', 1, 'Quadratic Equations', 'MCQ', 6, NULL, array['$(x + 1)^2 = 2x + 1$', '$x^2 + x = 0$', '$x^2 - 4 = 0$', '$x^2 + x + 1 = 0$']::text[]),
  ('MQ-55c388-4-2', '55c388', 70, '4', '4. If the zeroes of the polynomial $ax^2 + bx + \frac{2a}{b}$ are reciprocal of each other, then the value of $b$ is 1', 1, 'Quadratic Equations', 'MCQ', 6, NULL, array['2', '$\frac{1}{2}$', '-2', '$-\frac{1}{2}$']::text[]),
  ('MQ-55c388-5-2', '55c388', 71, '5', '5. The distance of the point A(-3, -4) from x-axis is 1', 1, 'Coordinate Geometry', 'MCQ', 6, NULL, array['3', '4', '5', '7']::text[]),
  ('MQ-55c388-6-2', '55c388', 72, '6', '6. In the adjoining figure, PQ || XY || BC, AP = 2 cm, PX = 1.5 cm and BX = 4 cm. If QY = 0.75 cm, then AQ + CY = 1', 1, 'Similarity', 'MCQ', 6, '55c388__CBSE_X_Mat_p6_img_0_jpeg.webp', array['6 cm', '4.5 cm', '3 cm', '5.25 cm']::text[]),
  ('MQ-55c388-7-1', '55c388', 73, '7', '7. Given $\Delta ABC \sim \Delta PQR$, $\angle A = 30^\circ$ and $\angle Q = 90^\circ$. The value of $(\angle R + \angle B)$ is 1', 1, 'Similarity', 'MCQ', 6, NULL, array['$90^\circ$', '$120^\circ$', '$150^\circ$', '$180^\circ$']::text[]),
  ('MQ-55c388-8-1', '55c388', 74, '8', '8. Two coins are tossed simultaneously. The probability of getting atleast one head is 1', 1, 'Probability', 'MCQ', 6, NULL, array['$\frac{1}{4}$', '$\frac{1}{2}$', '$\frac{3}{4}$', '1']::text[]),
  ('MQ-55c388-9-2', '55c388', 75, '9', '9. In the adjoining figure, PA and PB are tangents to a circle with centre O such that $\angle P = 90^\circ$. If $AB = 3\sqrt{2}$ cm, then the diameter of the circle is 1
SOLVED PAPER - 2025
xix', 1, 'Circles', 'MCQ', 6, '55c388__CBSE_X_Mat_p6_img_1_jpeg.webp', array['$3\sqrt{2}\mathrm{cm}$', '$6\sqrt{2}\mathrm{cm}$', '$3\mathrm{cm}$', '$6\mathrm{cm}$']::text[]),
  ('MQ-55c388-10-2', '55c388', 76, '10', '10. For a circle with centre O and radius $5\mathrm{cm}$ , which of the following statements is true?
P: Distance between every pair of parallel tangents is $5\mathrm{cm}$
Q: Distance between every pair of parallel tangents is $10\mathrm{cm}$
R: Distance between every pair of parallel tangents must be between $5\mathrm{cm}$ and $10\mathrm{cm}$
S: There does not exist a point outside the circle from where length of tangent is $5\mathrm{cm}$', 1, 'Circles', 'MCQ', 7, NULL, array['P', 'Q', 'R', 'S']::text[]),
  ('MQ-55c388-11-1', '55c388', 77, '11', '11. In the adjoining figure, TS is a tangent to a circle with centre O. The value of $2x^{\circ}$ is 1', 1, 'Circles', 'MCQ', 7, '55c388__CBSE_X_Mat_p7_img_0_jpeg.webp', array['22.5', '45', '67.5', '90']::text[]),
  ('MQ-55c388-12-1', '55c388', 78, '12', '12. If $x\left(\frac{2\tan 30^{\circ}}{1 + \tan^{2}30^{\circ}}\right) = y\left(\frac{2\tan 30^{\circ}}{1 - \tan^{2}30^{\circ}}\right)$ , then $x:y = 1$', 1, 'Trigonometry', 'MCQ', 7, NULL, array['$1:1$', '$1:2$', '$2:1$', '$4:1$']::text[]),
  ('MQ-55c388-13-3', '55c388', 79, '13', '13. A peacock sitting on the top of a tree of height $10\mathrm{m}$ observes a snake moving on the ground. If the snake is $10\sqrt{3}\mathrm{m}$ away from the base of the tree, then angle of depression of the snake from the eye of the peacock is 1', 1, 'Trigonometry', 'MCQ', 7, '55c388__CBSE_X_Mat_p27_img_0_jpeg.webp', array['$30^{\circ}$', '$45^{\circ}$', '$60^{\circ}$', '$90^{\circ}$']::text[]),
  ('MQ-55c388-14-2', '55c388', 80, '14', '14. If a cone of greatest possible volume is hollowed out from a solid wooden cylinder, then the ratio of the volume of remaining wood to the volume of cone hollowed out is 1', 1, 'Mensuration', 'MCQ', 7, '55c388__CBSE_X_Mat_p27_img_1_jpeg.webp', array['1:1', '1:3', '2:1', '3:1']::text[]),
  ('MQ-55c388-15-1', '55c388', 81, '15', '15. If the mode of some observations is 10 and sum of mean and median is 25, then the mean and median respectively are 1', 1, 'Statistics', 'MCQ', 7, NULL, array['12 and 13', '13 and 12', '10 and 15', '15 and 10']::text[]),
  ('MQ-55c388-16-1', '55c388', 82, '16', '16. If the maximum number of students has obtained 52 marks out of 80, then 1', 1, 'Statistics', 'MCQ', 7, NULL, array['52 is the mean of the data.', '52 is the median of the data.', '52 is the mode of the data.', '52 is the range of the data.']::text[]),
  ('MQ-55c388-17-2', '55c388', 83, '17', '17. The system of equations $2x + 1 = 0$ and $3y - 5 = 0$ has', 1, NULL, 'MCQ', 7, NULL, array['unique solution', 'two solutions', 'no solution', 'infinite number of solutions']::text[]),
  ('MQ-55c388-18-1', '55c388', 84, '18', '18. In a right triangle ABC, right-angled at $A$ , if $\sin B = \frac{1}{4}$ , then the value of $\sec B$ is 1', 1, 'Trigonometry', 'MCQ', 7, '55c388__CBSE_X_Mat_p27_img_2_jpeg.webp', array['4', '$\frac{\sqrt{15}}{4}$', '$\sqrt{15}$', '$\frac{4}{\sqrt{15}}$']::text[]),
  ('MQ-55c388-19-2', '55c388', 85, '19', '19. Assertion (A): For any two prime numbers $p$ and $q$ , their HCF is 1 and LCM is $p + q$ . 1

Reason (R): For any two natural numbers, $\mathrm{HCF} \times \mathrm{LCM} =$ product of numbers.', 1, NULL, 'short', 7, NULL, NULL),
  ('MQ-55c388-20-2', '55c388', 86, '20', '20. In an experiment of throwing a die, 1

Assertion (A): Event $\mathrm{E}_1$ : getting a number less than 3 and Event $\mathrm{E}_2$ : getting a number greater than 3 are complementary events.

Reason (R): If two events E and F are complementary events, then $P(E) + P(F) = 1$ .', 1, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-55c388-21-1', '55c388', 87, '21', '21. (a) Solve the following pair of equations algebraically:

$$
101x + 102y = 304 \tag{2}
$$', 2, NULL, 'short', 7, NULL, NULL),
  ('MQ-55c388-21-2', '55c388', 88, '21', '(b) In a pair of supplementary angles, the greater angle exceeds the smaller by $50^{\circ}$ . Express the given situation as a system of linear equations in two variables and hence obtain the measure of each angle. 2', 2, NULL, 'short', 7, NULL, NULL),
  ('MQ-55c388-22-3', '55c388', 89, '22', '22. (a) If $a \sec \theta + b \tan \theta = m$ and $b \sec \theta + a \tan \theta = n$ , prove that $a^2 + n^2 = b^2 + m^2$', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-55c388-22-4', '55c388', 90, '22', '(b) Use the identity: $\sin^2 A + \cos^2 A = 1$ to prove that $\tan^2 A + 1 = \sec^2 A$ . Hence, find the value of $\tan A$ , when $\sec A = \frac{5}{3}$ , where $A$ is an acute angle. 2', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-55c388-23-2', '55c388', 91, '23', '23. Prove that abscissa of a point $\mathrm{P}$ which is equidistant from points with coordinates $A(7,1)$ and $B(3,5)$ is 2 more than its ordinate. 2', 2, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-55c388-24-3', '55c388', 92, '24', '24. P is a point on the side BC of \(\Delta ABC\) such that \(\angle APC = \angle BAC\). Prove that \(AC^2 = BC \cdot CP\).', 2, 'Similarity', 'short', 8, '55c388__CBSE_X_Mat_p28_img_0_jpeg.webp', NULL),
  ('MQ-55c388-25-2', '55c388', 93, '25', '25. The number of red balls in a bag is three more than the number of black balls. If the probability of drawing a red ball at random from the given bag is \(\frac{12}{23}\), find the total number of balls in the given bag. 2', 2, 'Probability', 'short', 8, NULL, NULL),
  ('MQ-55c388-26-3', '55c388', 94, '26', '26. (a) Prove that $\sqrt{5}$ is an irrational number. 3', 3, NULL, 'short', 8, NULL, NULL),
  ('MQ-55c388-26-4', '55c388', 95, '26', '(b) Let $p, q$ and $r$ be three distinct prime numbers. 3 Check whether $p \cdot q \cdot r + q$ is a composite number or not.

Further, give an example for 3 distinct primes $p, q, r$ such that

(i) \(p\cdot q\cdot r + 1\) is a composite number.
(ii) \(p\cdot q\cdot r + 1\) is a prime number.', 3, NULL, 'short', 8, NULL, NULL),
  ('MQ-55c388-27-1', '55c388', 96, '27', '27. Find the zeroes of the polynomial \( p(x) = 3x^{2} - 4x - 4 \). Hence, write a polynomial whose each of the zeroes is 2 more than zeroes of \( p(x) \). 3', 3, 'Factorisation and Remainder Theorem', 'short', 8, NULL, NULL),
  ('MQ-55c388-28-2', '55c388', 97, '28', '28. Check whether the following pair of equations is consistent or not. If consistent, solve graphically 3

$$
x + 3y = 6
$$

$$
3y - 2x = -12
$$', 3, 'Linear Inequations', 'short', 8, '55c388__CBSE_X_Mat_p29_img_0_jpeg.webp', NULL),
  ('MQ-55c388-29-3', '55c388', 98, '29', '29. If the points A(6, 1), B(p, 2), C(9, 4) and D(7, q) are the vertices of a parallelogram ABCD, then find the values of \( p \) and \( q \). Hence, check whether ABCD is a rectangle or not.', 3, 'Coordinate Geometry', 'short', 8, '55c388__CBSE_X_Mat_p29_img_1_jpeg.webp', NULL),
  ('MQ-55c388-30-1', '55c388', 99, '30', '30. (a) Prove that: \(\frac{\cos\theta - 2\cos^3\theta}{\sin\theta - 2\sin^3\theta} + \cot \theta = 0.\) 3', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-55c388-30-2', '55c388', 100, '30', '(b) Given that \(\sin \theta +\cos \theta = x\) , prove that \(\sin^4\theta +\cos^4\theta\) \(= \frac{2 - (x^2 - 1)^2}{2}.\)', 3, 'Trigonometry', 'short', 8, NULL, NULL),
  ('MQ-55c388-31-2', '55c388', 101, '31', '31. In the adjoining figure, TP and TQ are tangents drawn to a circle with centre O. If \(\angle OPQ = 15^{\circ}\) and \(\angle PTQ = \theta\), then find the value of \(\sin 2\theta\). 3', 3, 'Circles', 'short', 8, '55c388__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-55c388-32-3', '55c388', 102, '32', '32. (a) There is a circular park of diameter 65 m as shown in the following figure, where AB is a diameter. 5

An entry gate is to be constructed at a point P on the boundary of the park such that distance of P from A is 35 m more than the distance of P from B. Find distance of point P from A and B respectively.', 5, 'Mensuration', 'long', 8, '55c388__CBSE_X_Mat_p8_img_1_jpeg.webp', NULL),
  ('MQ-55c388-32-4', '55c388', 103, '32', '(b) Find the smallest value of \( p \) for which the quadratic equation \( x^{2} - 2(p + 1)x + p^{2} = 0 \) has real roots. Hence, find the roots of the equation so obtained. 5', 5, 'Quadratic Equations', 'long', 8, NULL, NULL),
  ('MQ-55c388-33-3', '55c388', 104, '33', '33. (a) If a line drawn parallel to one side of triangle intersecting the other two sides in distinct points divides the two sides in the same ratio, then it is parallel to third side.

State and prove the converse of the above statement.', 5, 'Similarity', 'long', 8, '55c388__CBSE_X_Mat_p30_img_0_jpeg.webp', NULL),
  ('MQ-55c388-33-4', '55c388', 105, '33', '(b) In the adjoining figure, $\Delta$ CAB is a right triangle, right angled at A and AD $\perp$ BC. Prove that $\Delta$ ADB $\sim \Delta$ CDA. Further, if BC = 10 cm and CD = 2 cm, find the length of AD. 5', 5, 'Similarity', 'long', 8, '55c388__CBSE_X_Mat_p8_img_2_jpeg.webp', NULL),
  ('MQ-55c388-34-2', '55c388', 106, '34', '34. From one face of a solid cube of side 14 cm, the largest possible cone is carved out. Find the volume and surface area of the remaining solid.

$$
\left(\text{Use } \pi = \frac{22}{7}, \sqrt{5} = 2.2\right) \tag{5}
$$', 5, 'Mensuration', 'long', 8, '55c388__CBSE_X_Mat_p30_img_2_jpeg.webp', NULL),
  ('MQ-55c388-35-2', '55c388', 107, '35', '35. Following distribution shows the marks of 230 students in a particular subject. If the median marks are 46, then find the values of $x$ and $y$. 5

| Marks | Number of Students |
| --- | --- |
| 10–20 | 12 |
| 20–30 | 30 |
| 30–40 | $x$ |
| 40–50 | 65 |
| 50–60 | $y$ |
| 60–70 | 25 |
| 70–80 | 18 |', 5, 'Statistics', 'long', 8, NULL, NULL),
  ('MQ-55c388-36-2', '55c388', 108, '36', '36. Anurag purchased a farmhouse which is in the form of a semicircle of diameter $70\mathrm{m}$ . He divides it into three parts by taking a point $\mathrm{P}$ on the semicircle in such a way that $\angle \mathrm{PAB} = 30^{\circ}$ as shown in the following figure, where $\mathrm{O}$ is the centre of semicircle.

In part I, he planted saplings of Mango tree, in part II, he grew tomatoes and in part III, he grew oranges. Based on given information, answer the following questions.

(i) What is the measure of \(\angle POA?\) 1
(ii) Find the length of wire needed to fence entire piece of land. 2
(iii) (a) Find the area of region in which saplings of Mango tree are planted. 1', 4, 'Mensuration', 'long', 9, '55c388__CBSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-55c388-37-2', '55c388', 109, '37', '37. In order to organise, Annual Sports Day, a school prepared an eight lane running track with an integrated football field inside the track area as shown below:

The length of innermost lane of the track is $400\mathrm{m}$ and each subsequent lane is $7.6\mathrm{m}$ longer than the preceding lane.

Based on given information, answer the following questions, using concept of Arithmetic Progression.

(i) What is the length of the \(6^{\text{th}}\) lane? 1
(ii) How long is the \(8^{\text{th}}\) lane than that of \(4^{\text{th}}\) lane? 1
(iii) (a) While practicing for a race, a student took one round each in first six lanes. Find the total distance covered by the student. 2', 4, 'Arithmetic Progression', 'long', 9, '55c388__CBSE_X_Mat_p9_img_1_jpeg.webp', NULL),
  ('MQ-55c388-38-2', '55c388', 110, '38', '38. The Statue of Unity situated in Gujarat is the world''s largest Statue which stands over a \(58\mathrm{m}\) high base. As part of the project, a student constructed an inclinometer and wishes to find the height of Statue of Unity using it.

He noted following observations from two places:

# Situation - I:

The angle of elevation of the top of Statue from Place A which is $80\sqrt{3}$ m away from the base of the Statue is found to be $60^{\circ}$ .

# Situation - II:

The angle of elevation of the top of Statue from a Place B which is $40\mathrm{m}$ above the ground is found to be $30^{\circ}$ and entire height of the Statue including the base is found to be $240\mathrm{m}$ .

Based on given information, answer the following questions:

(i) Represent the Situation - I with the help of a diagram. 1
(ii) Represent the Situation - II with the help of a diagram. 1
(iii) (a) Calculate the height of Statue excluding the base and also find the height including the base with the help of Situation-I. 2', 4, 'Trigonometry', 'long', 9, '55c388__CBSE_X_Mat_p9_img_2_jpeg.webp', NULL),
  ('MQ-55c388-1-2', '55c388', 111, '1', '1. The system of equations $x + 5 = 0$ and $2x - 1 = 0$ , has 1', 1, NULL, 'MCQ', 9, NULL, array['No solution', 'Unique solution', 'Two solutions', 'Infinite solutions']::text[]),
  ('MQ-55c388-5-3', '55c388', 112, '5', '5. Which of the following quadratic equations has real and distinct roots? 1', 1, 'Quadratic Equations', 'MCQ', 9, NULL, array['$x^{2} + 2x = 0$', '$x^{2} + x + 1 = 0$', '$(x - 1)^{2} = 1 - 2x$', '$2x^{2} + x + 1 = 0$']::text[]),
  ('MQ-55c388-7-2', '55c388', 113, '7', '7. The distance of point $(a, -b)$ from $x$ -axis is 1', 1, 'Coordinate Geometry', 'MCQ', 9, NULL, array['$a$', '$-a$', '$b$', '$-b$']::text[]),
  ('MQ-55c388-12-2', '55c388', 114, '12', '12. If $x = \cos 30^{\circ} - \sin 30^{\circ}$ and $y = \tan 60^{\circ} - \cot 60^{\circ}$, then', 1, 'Trigonometry', 'MCQ', 10, NULL, array['$x = y$', '$x > y$', '$x < y$', '$x > 1, y < 1$']::text[]),
  ('MQ-55c388-19-3', '55c388', 115, '19', '19. Assertion (A): For two prime numbers $x$ and $y$ ($x < y$), HCF $(x, y) = x$ and LCM $(x, y) = y$.

Reason (R): HCF $(x, y) \leq \text{LCM}(x, y)$, where $x, y$ are any two natural numbers.', 1, NULL, 'short', 10, NULL, NULL),
  ('MQ-55c388-21-3', '55c388', 116, '21', '21. In the adjoining figure, $\frac{\mathrm{AD}}{\mathrm{BD}} = \frac{\mathrm{AE}}{\mathrm{EC}}$ and $\angle \mathrm{BDE} = \angle \mathrm{CED}$, prove that $\Delta \mathrm{ABC}$ is an isosceles triangle.', 2, 'Similarity', 'short', 10, '55c388__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-55c388-22-5', '55c388', 117, '22', '22. A bag contains cards which are numbered from 5 to 100 such that each card bears a different number. A card is drawn at random. Find the probability that number on the card is

(i) a perfect square
(ii) a 2-digit number', 2, 'Probability', 'short', 10, NULL, NULL),
  ('MQ-55c388-29-4', '55c388', 118, '29', '29. Find the zeroes of the polynomial \( q(x) = 8x^{2} - 2x - 3 \). Hence, find a polynomial whose zeroes are 2 less than the zeroes of \( q(x) \).', 3, 'Quadratic Equations', 'short', 10, NULL, NULL),
  ('MQ-55c388-30-3', '55c388', 119, '30', '30. Check whether the following system of equations is consistent or not. If consistent, solve graphically

$$
x - 2y + 4 = 0, 2x - y - 4 = 0
$$', 3, NULL, 'short', 10, '55c388__CBSE_X_Mat_p34_img_0_jpeg.webp', NULL),
  ('MQ-55c388-32-5', '55c388', 120, '32', '32. Following data shows the number of family members living in different bungalows of a locality:

| Number of Members | 0 – 2 | 2 – 4 | 4 – 6 | 6 – 8 | 8 – 10 | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Number of Bungalows | 10 | p | 60 | q | 5 | 120 |

If the median number of members is found to be 5, find the values of $p$ and $q$.', 5, 'Statistics', 'long', 10, NULL, NULL),
  ('MQ-55c388-34-3', '55c388', 121, '34', '34. On the day of her examination, Riya sharpened her pencil from both ends as shown below:

The diameter of the cylindrical and conical part of the pencil is $4.2\,\mathrm{mm}$. If the height of each conical part is $2.8\,\mathrm{mm}$ and length of entire pencil is $105.6\,\mathrm{mm}$. Find the total surface area of the pencil.', 5, 'Mensuration', 'long', 10, '55c388__CBSE_X_Mat_p10_img_1_jpeg.webp', NULL),
  ('MQ-55c388-2-2', '55c388', 122, '2', '2. In the adjoining figure, AP and AQ are tangents to the circle with centre O. If reflex $\angle \mathrm{POQ} = 210^{\circ}$, the value of $2x$ is', 1, 'Circles', 'MCQ', 10, '55c388__CBSE_X_Mat_p10_img_2_jpeg.webp', array['$30^{\circ}$', '$60^{\circ}$', '$120^{\circ}$', '$300^{\circ}$']::text[]),
  ('MQ-55c388-3-2', '55c388', 123, '3', '3. If $x = 2 \sin 60^{\circ} \cos 60^{\circ}$ and $y = \sin^2 30^{\circ} - \cos^2 30^{\circ}$ and $x^2 = ky^2$, the value of $k$ is:', 1, 'Trigonometry', 'MCQ', 10, NULL, array['$\sqrt{3}$', '$-\sqrt{3}$', '3', '$-3$']::text[]),
  ('MQ-55c388-8-2', '55c388', 124, '8', '8. The system of equations $y + a = 0$ and $2x = b$ has', 1, NULL, 'MCQ', 10, NULL, array['No solution', '$\left(-a, \frac{b}{2}\right)$ as its solution', '$\left(\frac{b}{2}, -a\right)$ as its solution', 'Infinite solutions']::text[]),
  ('MQ-55c388-12-3', '55c388', 125, '12', '12. Which of the following equations does not have a real root?', 1, 'Quadratic Equations', 'MCQ', 10, NULL, array['$x^{2} = 0$', '$2x - 1 = 3$', '$x^{2} + 1 = 0$', '$x^{3} + x^{2} = 0$']::text[]),
  ('MQ-55c388-14-3', '55c388', 126, '14', '14. The distance of point P $(3a, 4a)$ from $y$-axis is', 1, 'Coordinate Geometry', 'MCQ', 10, NULL, array['$3a$', '$-3a$', '$4a$', '$-4a$']::text[]),
  ('MQ-55c388-20-3', '55c388', 127, '20', '20. Assertion (A): For two odd prime number $x$ and $y$, $(x \neq y)$, LCM $(2x, 4y) = 4xy$.

Reason (R): LCM $(x, y)$ is a multiple of HCF $(x, y)$. 1', 1, NULL, 'short', 11, NULL, NULL),
  ('MQ-55c388-23-3', '55c388', 128, '23', '23. In the adjoining figure, $\mathrm{AP} = 1\mathrm{cm}$, $\mathrm{BP} = 2\mathrm{cm}$, $\mathrm{AQ} = 1.5\mathrm{cm}$ and $\mathrm{AC} = 4.5\mathrm{cm}$.

Prove that $\Delta \mathrm{APQ} \sim \Delta \mathrm{ABC}$. Hence find the length of PQ, If $\mathrm{BC} = 3.6\mathrm{cm}$. 2', 2, 'Similarity', 'short', 11, '55c388__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-55c388-24-4', '55c388', 129, '24', '24. A bag contains balls numbered 2 to 91 such that each ball bears a different number. A ball is drawn at random from the bag. Find the probability that

(i) it bears a 2-digit number
(ii) it bears a multiple of 1. 2', 2, 'Probability', 'short', 11, NULL, NULL),
  ('MQ-55c388-26-5', '55c388', 130, '26', '26. Check whether the given system of equations is consistent or not. If consistent, solve graphically. 3

$$
x - 2y = 0
$$

$$
2x + y = 0
$$', 3, NULL, 'short', 11, '55c388__CBSE_X_Mat_p36_img_0_jpeg.webp', NULL),
  ('MQ-55c388-31-3', '55c388', 131, '31', '31. Find the zeroes of the polynomial $r(x) = 4x^2 + 3x - 1$. Hence, write a polynomial whose zeroes are reciprocal of the zeroes of polynomial $r(x)$. 3', 3, 'Quadratic Equations', 'short', 11, NULL, NULL),
  ('MQ-55c388-33-5', '55c388', 132, '33', '33. Fermentation tanks are designed in the form of cylinder mounted on a cone as shown below: 5

The total height of the tank is $3.3\mathrm{m}$ and height of conical part is $1.2\mathrm{m}$. The diameter of the cylindrical as well as conical part is $1\mathrm{m}$. Find the capacity of the tank. If the level of liquid in the tank is $0.7\mathrm{m}$ from the top, find the surface area of the tank in contact with liquid.', 5, 'Mensuration', 'long', 11, '55c388__CBSE_X_Mat_p11_img_1_jpeg.webp', NULL),
  ('MQ-55c388-34-4', '55c388', 133, '34', '34. The population of lions was noted in different regions across the world in the following table: 5

| Number of lions | Number of regions |
| --- | --- |
| 0–100 | 2 |
| 100–200 | 5 |
| 200–300 | 9 |
| 300–400 | 12 |
| 400–500 | x |
| 500–600 | 20 |
| 600–700 | 15 |
| 700–800 | 9 |
| 800–900 | y |
| 900–1000 | 2 |
| | 100 |', 5, 'Statistics', 'long', 11, NULL, NULL),
  ('MQ-5a3ed4-1-0', '5a3ed4', 0, '1', '| 1 | If the sum of zeroes of \( P(x) = (k^2 - 14)x^2 - 2x - 4 \) is 1,then the value of k is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['±\( \sqrt{8} \)', '± 4', '± 2', '± 9 | | | | | | 1 |']::text[]),
  ('MQ-5a3ed4-2-0', '5a3ed4', 1, '2', '| 2 | Three coins are tossed simultaneously. The Probability of getting atmost 2 heads is', 1, 'Probability', 'MCQ', 1, NULL, array['\( \frac{2}{8} \)', '\( \frac{1}{8} \)', '\( \frac{6}{8} \)', '\( \frac{7}{8} \) | | | | | | 1 |']::text[]),
  ('MQ-5a3ed4-3-0', '5a3ed4', 2, '3', '| 3 | For the following distribution, the sum of lower limits of the Median class & Modal class would be | | | | | | 1 |
| | Class Interval | 0 – 5 | 5 – 10 | 10 – 15 | 15 – 20 | 20 – 25 | |
| | Frequency | 10 | 5 | 12 | 20 | 9 | |
| |', 1, 'Statistics', 'MCQ', 1, NULL, array['15', '30', '25', '35 | | | | | | |']::text[]),
  ('MQ-5a3ed4-4-0', '5a3ed4', 3, '4', '| 4 | The Volume of the largest right circular cone that can be cut off from a cube of edge 4.2 cm is', 1, 'Mensuration', 'MCQ', 1, NULL, array['9.7 cm\( ^3 \)', '77.6 cm\( ^3 \)', '58.2 cm\( ^3 \)', '19.4 cm\( ^3 \) | | | | | | 1 |']::text[]),
  ('MQ-5a3ed4-5-0', '5a3ed4', 4, '5', '| 5 | What would be the value of k for which the pair of Linear equations 2x + ky = 7 & 3x – 9y – 12 is consistent and independent ?', 1, NULL, 'MCQ', 1, NULL, array['All real numbers except – 6', 'All real numbers expect 6', '6', '– 6 | | | | | | 1 |']::text[]),
  ('MQ-5a3ed4-6-0', '5a3ed4', 5, '6', '| 6 | In the fig: a quadrilateral ABCD is drawn to circumscribe a circle. If BC = 7 cm, CR = 3 cm & AS = 5 cm, the value of AB is', 1, 'Circles', 'MCQ', 2, '5a3ed4__CBSE_X_Mat_p2_img_0_jpeg.webp', array['10 cm', '7 cm', '8 cm', '9 cm ![img-0.jpeg](img-0.jpeg) | 1 |']::text[]),
  ('MQ-5a3ed4-7-0', '5a3ed4', 6, '7', '| 7 | If P(2, x) is the mid-point of the line segment joining the points A(6, -5) and B(-2, 11), the value of x is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['5', '2', '3', '4 | 1 |']::text[]),
  ('MQ-5a3ed4-8-0', '5a3ed4', 7, '8', '| 8 | If tan θ = √3, then the value of sec2θ + cosec2θ isa) 1 b) 40/9 (c) 38/9 d) 5 1/3 | |', 1, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-5a3ed4-9-0', '5a3ed4', 8, '9', '| 9 | PA & PB are tangents to the circle with centre O, such that ∠APB = 500, then measure of ∠OAB is', 1, 'Circles', 'MCQ', 2, NULL, array['250', '300', '400', '500 | 1 |']::text[]),
  ('MQ-5a3ed4-10-0', '5a3ed4', 9, '10', '| 10 | If ui = xi-25/10, ∑fi ui = 20 and ∑fi =100, then mean is', 1, 'Statistics', 'MCQ', 2, NULL, array['25', '27', '20', '5 | 1 |']::text[]),
  ('MQ-5a3ed4-11-0', '5a3ed4', 10, '11', '| 11 | The sum of the squares of zeroes of the Quadratic polynomial P(x) = x2 - 8x + k is 40. The value of k is', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['15', '10', '12', '64 | 1 |']::text[]),
  ('MQ-5a3ed4-12-0', '5a3ed4', 11, '12', '| 12 | The equation x2 - bx + 1 =0 does not possess real roots, then', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['-3 < b ≤ +3', '-2 < b < +2', 'b > 2', 'b < -2 | 1 |']::text[]),
  ('MQ-5a3ed4-13-0', '5a3ed4', 12, '13', '| 13 | A card is drawn at random from a pack of 52 cards. The Probability that the card is neither an ace nor a spade is', 1, 'Probability', 'MCQ', 2, NULL, array['35/52', '10/13', '9/13', '19/26 | 1 |']::text[]),
  ('MQ-5a3ed4-14-0', '5a3ed4', 13, '14', '| 14 | A line intersects the Y-axis and X-axis at the points P and Q respectively. If (2, -5) is the mid-point of PQ, then the coordinates of P and Q are respectively', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(0, -5) and (2, 0)', '(0, 10) and (-4, 0)', '(0, 4) and (-10, 0)', '(0, -10) and (4, 0) | 1 |']::text[]),
  ('MQ-5a3ed4-15-0', '5a3ed4', 14, '15', '| 15 | If 18, a, b, -3 are in AP, then value of a+b is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['15', '7', '11', '19 | 1 |']::text[]),
  ('MQ-5a3ed4-16-0', '5a3ed4', 15, '16', '| 16 | A marble of radius 2.1 cm is put into a cylindrical cup full of water whose radius is 5 cm & height is 6 cm. The volume of water that flows out of cylindrical cup would be', 1, 'Mensuration', 'MCQ', 2, NULL, array['19.4 cm3', '55.4 cm3', '38.8 cm3', '471.4 cm3 | 1 |']::text[]),
  ('MQ-5a3ed4-17-0', '5a3ed4', 16, '17', '| 17 | APB is a tangent to a circle with centre O, at point P. If ∠QPB = 500, what would be the measure of ∠POQ?', 1, 'Circles', 'MCQ', 2, '5a3ed4__CBSE_X_Mat_p2_img_1_jpeg.webp', array['1200', '1100', '1000', '1400 ![img-1.jpeg](img-1.jpeg) | 1 |']::text[]),
  ('MQ-5a3ed4-18-0', '5a3ed4', 17, '18', '| 18 | If sin θ = cos θ, then value of cosec θ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['2', '1', '2/√3', '√2 | 1 |']::text[]),
  ('MQ-5a3ed4-19-0', '5a3ed4', 18, '19', '| 19 | Assertion (A): If product of 2 numbers is 5780 and their HCF is 17, then their LCM is 340 Reason (R): HCF is always a factor of LCM | 1 |', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-20-0', '5a3ed4', 19, '20', '| 20 | Assertion (A): The area of the minor segment of a circle is always less than the area of the Corresponding sector of the circle Reason (R): The area of the major segment of a circle is always less than the area of the corresponding Sector of the circle | 1 |', 1, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-21-0', '5a3ed4', 20, '21', '| 21 | The LCM of two numbers is 6 times their HCF. The sum of LCM & HCF is 91. If one number is 26 ,find the other number OR Three alarm clocks ring their alarms at regular interval of 6 min ,9min & 15 min respectively. If they first beep together at 4 pm,what time will they next ring together? | 2 |', 2, NULL, 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-22-0', '5a3ed4', 21, '22', '| 22 | Find the value of α and β if sin (α +2 β) = $$\frac{\sqrt{3}}{2}$$ and cos (α + 4β) = 0 | 2 |', 2, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-23-0', '5a3ed4', 22, '23', '| 23 | Find the value of a , if the distance between the points A( - 3, - 14 )& B( a , - 5) is 9 units | 2 |', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-24-0', '5a3ed4', 23, '24', '| 24 | Two dice are thrown simultaneously. What is the probability of getting (i)A Prime number on both the dice ? (ii) A total of 9 or 11 ? OR A jar contains marbles of blue , white & red colours. The probability of selecting a blue marble is $$\frac{4}{15}$$ & the probability of selecting a white marble is $$\frac{2}{5}$$ . If the jar contains 10 red marbles,find the total number of marbles in the jar | 2 |', 2, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-25-0', '5a3ed4', 24, '25', '| 25 | Find the ratio in which the point ( - 1 , 6) divides the line segment joining the points ( - 3 , 10) and (6 , - 8 ) | 2 |', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-26-0', '5a3ed4', 25, '26', '| 26 | A chord of a circle of radius 15 cm subtends an angle of 60⁰ at the centre Find area of the corresponding minor segment ( use π = 3.14 & $$\sqrt{3}$$ = 1.73) OR Find the area of the minor sector of a circle of radius 42 cm, if length of the corresponding arc is 44 cm | 3 |', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-27-0', '5a3ed4', 26, '27', '| 27 | Prove that : $$\sqrt{\frac{1+sin\theta}{1-sin\theta}} + \sqrt{\frac{1-sin\theta}{1+sin\theta}} = 2 \sec \theta$$ | 3 |', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-28-0', '5a3ed4', 27, '28', '| 28 | If -5 is a root of the quadratic equation 2x² + px - 15 = 0 and the quadratic equation p(x² + x) + k = 0 has equal roots, then find the value of k | 3 |', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-29-0', '5a3ed4', 28, '29', '| 29 | Prove that $$\sqrt{5}$$ is Irrational | 3 |', 3, NULL, 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-30-0', '5a3ed4', 29, '30', '| 30 | If sum of the squares of the zeroes of the quadratic polynomial p(x) = x² - 8x + k is 40, find the value of k | 3 |', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-5a3ed4-31-0', '5a3ed4', 30, '31', '| 31 | State and prove Basic Proportionality theoremORIn the given figure below, CB || QR and CA || PR Also AQ = 12 cm, AR = 20 cm,PB = CQ = 15 cm. Calculate PC and BR ![img-0.jpeg](img-0.jpeg) | 3 |', 3, 'Similarity', 'short', 4, NULL, NULL),
  ('MQ-5a3ed4-32-0', '5a3ed4', 31, '32', '| 32 | (a)If the median of the following frequency distribution is 32.5 , Find the missing frequencies \( f_1 \) and \( f_2 \) | 5 |
| Class Interval | Frequency |
| 0 – 10 | \( f_1 \) |
| 10 – 20 | 5 |
| 20 – 30 | 9 |
| 30 – 40 | 12 |
| 40 – 50 | \( f_2 \) |
| 50 – 60 | 3 |
| 60 - 70 | 2 |
| Total | 40 |
| (b) Find Mode of the following data |
| Class Interval | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – 50 |
| Frequency | 8 | 12 | 10 | 11 | 9 |', 5, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-5a3ed4-32-1', '5a3ed4', 32, '32', '| OR(a) The mean of the following distribution is 25 .Find the missing frequency |
| Class | 0 – 10 | 10 – 20 | 20 – 30 | 30 – 40 | 40 – |
| Frequency | 5 | 18 | 15 | f | 6 |
| (b) Construct a frequency distribution table for the marks obtained by students & hence find Median |
| | Frequency |
| Less than 10 | 14 |
| Less than 20 | 22 |
| Less than 30 | 37 |
| Less than 40 | 58 |
| Less than 50 | 67 |
| Less than 60 | 75 |', 5, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-5a3ed4-33-0', '5a3ed4', 33, '33', '| 33 | (a)Prove that Parallelogram circumscribing a circle is a Rhombus | 5 |
| | (b)In the given figure, a circle inscribed in Δ ABC touches its sides AB, BC and AC at points D, E & F respectively. If AB = 12 cm, BC = 8 cm and AC = 10 cm, then find the lengths of AD, BE and CF ![img-0.jpeg](img-0.jpeg) | |', 5, 'Circles', 'long', 4, '5a3ed4__CBSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-5a3ed4-34-0', '5a3ed4', 34, '34', '| 34 | The denominator of a fraction is 4 more than twice the numerator. When both the numerator and denominator are decreased by 6, then denominator becomes 12 times the numerator. Determine the fraction ORA number consists of two digits. When the number is divided by the sum of its digits, the quotient is 7. If 27 is subtracted from the number, the digits interchange their places. Find the number | 5 |', 5, 'Quadratic Equations', 'long', 5, NULL, NULL),
  ('MQ-5a3ed4-35-0', '5a3ed4', 35, '35', '| 35 | The angle of elevation of the top of a light house 60 m high ,from two points on the ground on its opposite sides are \( 45^{\circ} \) & \( 60^{\circ} \). What is the distance between the two points? (Take \( \sqrt{3} \) as 1.732 ) | 5 |', 5, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-5a3ed4-36-0', '5a3ed4', 36, '36', '| 36 | The great Stupa of Sanchi is one of the oldest stone structures in India , an important Monument of Indian Architecture. Its nucleus was a simple hemispherical brick structure built over the relics of Buddha. It is a perfect example of combination of solid figures. A big hemispherical dome with a cuboidal structure mounted on it.Based on the above information answer these questions(i)What would be the volume of air contained in the hemispherical dome if the height of the dome is 21m ? (ii) What would be the volume of the cuboidal shaped top of dimension 8m x 6m x 4m ? (ii) Find the cloth material required to cover the dome if radius of base is 14 m?ORFind the total surface area of the combined structure of the dome | 4 |', 2, 'Mensuration', 'short', 5, '5a3ed4__CBSE_X_Mat_p5_img_1_jpeg.webp', NULL),
  ('MQ-5a3ed4-37-0', '5a3ed4', 37, '37', '| 37 | Ramesh places a mirror on level ground to determine the height of a pole (with traffic light fired on it). He stands at a certain distance so that he can see the top of the pole reflected from the mirror. Ramesh''s eye level is 1.5 m above the ground. The distance of Ramesh and the pole from the mirror are 1.8 m and 6 m respectively![img-1.jpeg](img-1.jpeg)(i) What is the height of the pole? | 4 |
| | (ii) Which criterion of similarity is applicable to similar triangles?(iii) Now Ramesh moves behind such that distance between pole and Ramesh is 13 meters. He places mirror between him and pole to see the reflection of light in right position. What is the distance between mirror and Ramesh?ORWhat is the distance between mirror and pole? | |', 2, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-5a3ed4-38-0', '5a3ed4', 38, '38', '| 38 | Ashly being a plant lover decides to convert her balcony into beautiful garden full of plants. She bought few plants with pots for her balcony. She placed the pots in such a way that the number of pots in the first row is 2, second row is 5, third row is 8 and so on .Based on this information answer the questions![img-0.jpeg](img-0.jpeg)(i) Find the number of pots placed in the 10th row(ii) Find the difference in the number of pots placed in 5th row and 2nd row.(iii) If Ashly wants to place 100 pots in total, then the find total no of rows formed in the arrangement.ORIf Ashly has sufficient space for 12 rows, then how many total number of plants are placed by her with the same arrangement? | 4 |', 2, 'Arithmetic Progression', 'short', 6, '5a3ed4__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-b4ef56-1-0', 'b4ef56', 0, '1', '| 1 | If a = 2³ x 3, b = 2x3x5, c = 3ⁿx5 and LCM(a,b,c) = 2³x3²x5, then n is', 1, NULL, 'MCQ', 1, NULL, array['1', '2', '3', '4 | 1 |']::text[]),
  ('MQ-b4ef56-2-0', 'b4ef56', 1, '2', '| 2 | The value of k for which the system of linear equations x + 2y = 3, 5x + ky + 7 = 0 is inconsistent is', 1, NULL, 'MCQ', 1, NULL, array['$$\frac{-14}{3}$$', '$$\frac{2}{5}$$', '5', '10 | 1 |']::text[]),
  ('MQ-b4ef56-3-0', 'b4ef56', 2, '3', '| 3 | The quadratic equation x² + 4x - 3√2 = 0 has', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['two distinct real roots', 'two equal real roots', 'no real roots', 'more than 2 real roots | 1 |']::text[]),
  ('MQ-b4ef56-4-0', 'b4ef56', 3, '4', '| 4 | If the distance between the points (2, -2) and (-1, x) is 5, one of the values of x is', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['-2', '2', '-1', '1 | 1 |']::text[]),
  ('MQ-b4ef56-5-0', 'b4ef56', 4, '5', '| 5 | In Fig. TP and TQ are two tangents from an external point T to a circle with centre O. If \( \angle POQ=110^{\circ} \), then \( \angle PTQ \) is:![img-0.jpeg](img-0.jpeg)', 1, 'Circles', 'MCQ', 2, 'b4ef56__CBSE_X_Mat_p2_img_0_jpeg.webp', array['\( 60^{\circ} \)', '\( 70^{\circ} \)', '\( 80^{\circ} \)', '\( 90^{\circ} \) | 1 |']::text[]),
  ('MQ-b4ef56-6-0', 'b4ef56', 5, '6', '| 6 | In the given figure, AB || PQ. If AB = 6 cm, PQ = 2 cm and OB = 3 cm, then the length of OP is :![img-1.jpeg](img-1.jpeg)', 1, 'Similarity', 'MCQ', 2, 'b4ef56__CBSE_X_Mat_p2_img_1_jpeg.webp', array['9 cm', '3 cm', '4 cm', '1 cm | 1 |']::text[]),
  ('MQ-b4ef56-7-0', 'b4ef56', 6, '7', '| 7 | If \( \cos A = \frac{4}{5} \), then the value of tanA is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['\( \frac{4}{3} \)', '\( \frac{3}{5} \)', '\( \frac{3}{4} \)', '\( \frac{7}{5} \) | 1 |']::text[]),
  ('MQ-b4ef56-8-0', 'b4ef56', 7, '8', '| 8 | In \( \Delta ABC \) and \( \Delta DEF \), \( \frac{AB}{DE} = \frac{BC}{FD} \). Which of the following makes the two triangles similar?', 1, 'Similarity', 'MCQ', 2, NULL, array['\( \angle A = \angle D \)', '\( \angle B = \angle D \)', '\( \angle B = \angle E \)', '\( \angle A = \angle F \) | 1 |']::text[]),
  ('MQ-b4ef56-9-0', 'b4ef56', 8, '9', '| 9 | HCF of two numbers is 27 and their LCM is 162. If one of the numbers is 54, then the other number is', 1, NULL, 'MCQ', 2, NULL, array['36', '35', '9', '81 | 1 |']::text[]),
  ('MQ-b4ef56-10-0', 'b4ef56', 9, '10', '| 10 | The 21^{st} term of an AP whose first two terms are -3 and 4, is', 1, 'Arithmetic Progression', 'MCQ', 3, NULL, array['17', '137', '143', '-143 | 1 |']::text[]),
  ('MQ-b4ef56-11-0', 'b4ef56', 10, '11', '| 11 | In the given figure, DE ∥ BC. If AD = 2 units, DB = AE = 3 units and EC = x units, then the value of x is :', 1, 'Similarity', 'MCQ', 3, NULL, array['2', '3', '5', '$$\frac{9}{2}$$ | 1 |']::text[]),
  ('MQ-b4ef56-12-0', 'b4ef56', 11, '12', '| 12 | From an external point Q, the length of tangent to a circle is 12 cm and the distance of Q from the centre of circle is 13 cm. The radius of circle (in cm) is', 1, 'Circles', 'MCQ', 3, NULL, array['10', '5', '12', '7 | 1 |']::text[]),
  ('MQ-b4ef56-13-0', 'b4ef56', 12, '13', '| 13 | The value of $$2\sqrt{2}\cos45^\circ\sin30^\circ + 2\sqrt{3}\cos30^\circ$$ is', 1, 'Trigonometry', 'MCQ', 3, NULL, array['1', '$$\sqrt{3}$$', '4', '$$\sqrt{2}$$ | 1 |']::text[]),
  ('MQ-b4ef56-14-0', 'b4ef56', 13, '14', '| 14 | If two solid hemispheres of same base radius r are joined together along their bases, then curved surface area of this new solid is', 1, 'Mensuration', 'MCQ', 3, NULL, array['$$4\pi r^2$$', '$$6\pi r^2$$', '$$3\pi r^2$$', '$$8\pi r^2$$ | 1 |']::text[]),
  ('MQ-b4ef56-15-0', 'b4ef56', 14, '15', '| 15 | An unbiased die is thrown. The probability of getting an odd prime number is :', 1, 'Probability', 'MCQ', 3, NULL, array['$$\frac{1}{6}$$', '$$\frac{1}{2}$$', '$$\frac{1}{3}$$', '$$\frac{2}{3}$$ | 1 |']::text[]),
  ('MQ-b4ef56-16-0', 'b4ef56', 15, '16', '| 16 | If $$\frac{1}{2}$$ is a root of the equation $$x^2 + kx - \frac{5}{4} = 0$$, then the value of k is', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['2', '-2', '$$\frac{1}{4}$$', '$$\frac{1}{2}$$ | 1 |']::text[]),
  ('MQ-b4ef56-17-0', 'b4ef56', 16, '17', '| 17 | The empirical relation between the mode, median and mean of a distribution is :', 1, 'Statistics', 'MCQ', 3, NULL, array['Mode = 3 Median – 2 Mean', 'Mode = 3 Mean – 2 Median', 'Mode = 2 Median – 3 Mean', 'Mode = 2 Mean – 3 Median | 1 |']::text[]),
  ('MQ-b4ef56-18-0', 'b4ef56', 17, '18', '| 18 | If $$\alpha$$ and $$\beta$$ are the zeroes of the polynomial $$2x^2 - 13x + 6$$, then $$\alpha + \beta$$ is equal to', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['-3', '3', '$$\frac{13}{2}$$', '$$-\frac{13}{2}$$ | 1 |']::text[]),
  ('MQ-b4ef56-19-0', 'b4ef56', 18, '19', '| | DIRECTION: In the question number 19 and 20, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct optionA) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A)B) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A)C) Assertion (A) is true but reason (R) is false.D) Assertion (A) is false but reason (R) is true. | |
| --- | --- | --- |
| 19 | Assertion (A) : Sum of first 10 terms of the arithmetic progression -0.5, -1.0, -1.5, ... is 31.Reason (R) : Sum of n terms of an AP is given as Sn= \( \frac{n}{2} \) [2a + (n - 1)d] where a is first term and d common difference. | 1 |', 1, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-b4ef56-20-0', 'b4ef56', 19, '20', '| | DIRECTION: In the question number 19 and 20, a statement of Assertion (A) is followed by a statement of Reason (R). Choose the correct optionA) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A)B) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A)C) Assertion (A) is true but reason (R) is false.D) Assertion (A) is false but reason (R) is true. | |
| 20 | Assertion (A) : \( \sqrt{2} + \sqrt{5} \) is an irrational number.Reason (R) : The sum of a rational number and an irrational number is an irrational number. | 1 |', 1, NULL, 'short', 4, NULL, NULL),
  ('MQ-b4ef56-21-0', 'b4ef56', 20, '21', '| 21 | (a) Find a relation between x and y such that the point P(x, y) is equidistant from the points A (-5, 3) and B (7, 2).OR(b) Find the point on the x-axis which is equidistant from the points A(-2, 3) and B(5, 4). | 2 |', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-b4ef56-22-0', 'b4ef56', 21, '22', '| 22 | In the given figure, O is the centre of the circle. AB and AC are tangents drawn to the circle from point A. If \( \angle BAC = 65^{\circ} \), then find the measure of \( \angle BOC \)![img-0.jpeg](img-0.jpeg) | 2 |', 2, 'Circles', 'short', 4, 'b4ef56__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-b4ef56-23-0', 'b4ef56', 22, '23', '| 23 | A student noted the number of cars passing through a spot on a road for 100 periods each of 3 minutes and summarized it in the table given below. Find the mode of the data: | | 2 |
| --- | --- | --- | --- |
| | Number of cars | Frequency | |
| | 0 - 10 | 7 | |
| | 10 - 20 | 14 | |
| | 20 - 30 | 13 | |
| | 30 - 40 | 12 | |
| | 40 - 50 | 20 | |
| | 50 - 60 | 11 | |
| | 60 - 70 | 15 | |
| | 70 - 80 | 8 | |', 2, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-24-0', 'b4ef56', 23, '24', '| 24 | If $$\tan (A + B) = \sqrt{3}$$ and $$\tan (A - B) = \frac{1}{\sqrt{3}}$$ ; $$0^\circ < A + B \leq 90^\circ A > B$$ , find A and B. | | 2 |', 2, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-25-0', 'b4ef56', 24, '25', '| 25 | (a) Determine the AP whose 3rd term is 5 and the 7th term is 9. **OR** (b) If the sum of the first 14 terms of an AP is 1050 and its first term is 10, find the 20th term. | | 2 |', 2, 'Arithmetic Progression', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-26-0', 'b4ef56', 25, '26', '| 26 | Prove that $$\sqrt{3}$$ is an irrational number. | | 3 |', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-b4ef56-27-0', 'b4ef56', 26, '27', '| 27 | (a) Find the coordinates of the points of trisection of the line segment joining the points A(2, -2) and B(-7, 4). **OR** (b) If (1, 2), (4, y), (x, 6) and (3, 5) are the vertices of a parallelogram taken in order, find x and y. | | 3 |', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-28-0', 'b4ef56', 27, '28', '| 28 | Prove that $$(\sin\theta + \text{Cosec}\theta)^2 + (\cos \theta + \sec\theta)^2 = 7 + \tan^2\theta + \cot^2\theta$$ | | 3 |', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-29-0', 'b4ef56', 28, '29', '| 29 | The median of the distribution given below is 14.4. Find the value of x and y if the sum of the frequency is 20 | | 3 |
| | Class Interval | Frequency | |
| | 0 - 6 | 4 | |
| | 6 - 12 | x | |

| | | 12 - 18 | 5 | | |
| --- | --- | --- | --- | --- | --- |
| | | 18 - 24 | y | | |
| | | 24 - 30 | 1 | | |', 3, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-b4ef56-30-0', 'b4ef56', 29, '30', '| 30 | (a) Prove that the lengths of tangents drawn from an external point to a circle are equal.OR(b) A quadrilateral ABCD is drawn to circumscribe a circle. Prove that AB + CD = AD + BC![img-0.jpeg](img-0.jpeg) | | | | 3 |', 3, 'Circles', 'short', 6, NULL, NULL),
  ('MQ-b4ef56-31-0', 'b4ef56', 30, '31', '| 31 | If we add 1 to the numerator and subtract 1 from the denominator, a fraction reduces to 1. It becomes \( \frac{1}{2} \) if we only add 1 to the denominator. What is the fraction? | | | | 3 |', 3, NULL, 'short', 6, NULL, NULL),
  ('MQ-b4ef56-32-0', 'b4ef56', 31, '32', '| 32 | (a) A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.OR(b) A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train. | | | | 5 |', 5, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-b4ef56-33-0', 'b4ef56', 32, '33', '| 33 | State and prove basic proportionality theorem. | | | | 5 |', 5, 'Similarity', 'long', 6, NULL, NULL),
  ('MQ-b4ef56-34-0', 'b4ef56', 33, '34', '| 34 | In a circle of radius 21 cm, an arc subtends an angle of 60° at the centre.Find:(i) the length of the arc(ii) area of the sector formed by the arc(iii) area of the segment formed by the corresponding chord. | | | | 5 |', 5, 'Mensuration', 'long', 6, NULL, NULL),
  ('MQ-b4ef56-35-0', 'b4ef56', 34, '35', '| 35 | (a) The angle of elevation of the top of a tower 30 m high from the foot of another tower in the same plane is 60° and the angle of elevation of the | | | | 5 |

| | top of the second tower from the foot of the first tower is 30⁰. Find the distance between the two towers and also the height of the other tower. **OR** (b) From the top of a tower 100 m high, a man observes two cars on the opposite sides of the tower with angles of depression 30⁰ and 45⁰ respectively. Find the distance between the two cars.(Use √3 = 1·73) | | | | | | |', 5, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-b4ef56-36-0', 'b4ef56', 35, '36', '| 36 | Computer-based learning (CBL) refers to any teaching methodology that makes use of computers for information transmission. At an elementary school level, computer applications can be used to display multimedia lesson plans. A survey was done on 1000 elementary and secondary schools of Assam and they were classified by the number of computers they had. | | | | | | 1 2 2 1 |
| | Number of Computers | 1 – 10 | 11 - 20 | 21 - 50 | 51 - 100 | 100 and more | |
| | Number of Schools | 250 | 200 | 290 | 180 | 80 | |
| | One school is chosen at random. Then : (i) Find the probability that the school chosen at random has more than 100 computers. (ii) (a) Find the probability that the school chosen at random has 50 or fewer computers. **OR** (ii) (b) Find the probability that the school chosen at random has no more than 20 computers. (iii) Find the probability that the school chosen at random has 10 or less than 10 computers. | | | | | | |', 1, 'Probability', 'short', 7, NULL, NULL),
  ('MQ-b4ef56-37-0', 'b4ef56', 36, '37', '| 37 | Maximum Profit : An automobile manufacturer can produce up to 300 cars per day. The profit made from the sale of these vehicles can be modelled by the function P(x) = - x² + 350x - 6600 where P(x) is the profit in thousand Rupees and x is the number of automobiles made and sold. Answer the following questions based on this model: | | | | | | |

| | (i) What is the degree of the given polynomial?(ii) When no cars are produced what is a profit/loss (in thousand rupees)?(iii) (a) What is the break-even point ? (Zero profit point is called break even point) ?OR(iii) (b) What is the profit if 400 cars are produced ? | 11222 |', 1, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-b4ef56-38-0', 'b4ef56', 37, '38', '| 38 | Silo : A silo is a structure for storing bulk materials. Silos are used in agriculture to store grain or fermented feed known as silage. Silos are commonly used for bulk storage of grain, coal, cement, carbon black, woodchips, food products and sawdust.![img-0.jpeg](img-0.jpeg)A silo is in the shape of cylinder surmounted by a conical top. The height and diameter of cylindrical part are 40 feet and 42 feet respectively and the slant height of conical part is 29 feet.(i) Find the height of the conical part.(ii) What is the ratio of the heights of the cylindrical part and conical part ?(iii) (a) How much metal sheet is required to make this silo ?OR(iii) (b) What is the storage capacity of silo? | 11222 |', 1, 'Mensuration', 'short', 8, 'b4ef56__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-4adfbe-1-0', '4adfbe', 0, '1', '| 1. | If the sum of the zeroes of the quadratic polynomial ky^{2} + 2y - 3k is equal to twice their product, then the value of k is:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['3', '1/3', '2', '1 | 1 |']::text[]),
  ('MQ-4adfbe-2-0', '4adfbe', 1, '2', '| 2. | If α and β are zeroes of the polynomial f(x) =x^{2}-p(x+1)-c, then the value of (α+1)(β+1) is:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['1 + c', '1/c', 'c', '1 - c | 1 |']::text[]),
  ('MQ-4adfbe-3-0', '4adfbe', 2, '3', '| 3. | If the lines 3x+2ky - 2 = 0 and 2x+5y+1 = 0 are parallel, then what is the value of k?', 1, NULL, 'MCQ', 1, NULL, array['4/15', '15/4', '4/5', '5/4 | 1 |']::text[]),
  ('MQ-4adfbe-4-0', '4adfbe', 3, '4', '| 4. | If one root of quadratic equation ax^{2}+bx+c = 0 is the reciprocal of the other, then:', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['a = c', 'a = b', 'ac = 1', 'b= c | 1 |']::text[]),
  ('MQ-4adfbe-5-0', '4adfbe', 4, '5', '| 5. | If m-1, m+1 and 2m+3 are in AP, then the value of m is:', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-2', '2', '0', '4 | 1 |']::text[]),
  ('MQ-4adfbe-6-0', '4adfbe', 5, '6', '| 6. | The point P on x-axis is equidistant from the points A(-1, 0) and B(5, 0) is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(2, 0)', '(0, 2)', '(3, 0)', '(2, 2) | 1 |']::text[]),
  ('MQ-4adfbe-7-0', '4adfbe', 6, '7', '| 7. | The distance of the point P(-6,8) from the origin is-', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['8 units', '2√7 units', '10 units', '6 units | 1 |']::text[]),
  ('MQ-4adfbe-8-0', '4adfbe', 7, '8', '| 8. | If angle between two tangents drawn from a point P to a circle of radius ''a'' and centre ''O'' is 90°, then OP = ...', 1, 'Circles', 'MCQ', 2, NULL, array['2a√2', 'a√2', 'a/√2', '5a√2 | 1 |']::text[]),
  ('MQ-4adfbe-9-0', '4adfbe', 8, '9', '| 9. | If cosA = 4/5, then the value of tanA is:', 1, 'Trigonometry', 'MCQ', 2, NULL, array['3/4', '3/5', '4/3', '5/3 | 1 |']::text[]),
  ('MQ-4adfbe-10-0', '4adfbe', 9, '10', '| 10. | In figure AT is a tangent to the circle with centre O such that OT = 4 cm and ∠OTA =30°. Then AT is equal to:', 1, 'Circles', 'MCQ', 2, NULL, array['8cm', '2√2cm', '2√3cm', 'None of these | 1 |']::text[]),
  ('MQ-4adfbe-11-0', '4adfbe', 10, '11', '| 11. | If sin θ + cos θ = 7/5, then sinθ cosθ is:', 1, 'Trigonometry', 'MCQ', 2, NULL, array['12/25', '11/25', '15/25', '14/25 | 1 |']::text[]),
  ('MQ-4adfbe-12-0', '4adfbe', 11, '12', '| 12. | How many tangents can be drawn from the external point towards the circle?', 1, 'Circles', 'MCQ', 2, NULL, array['0', '1', '2', 'infinite | 1 |']::text[]),
  ('MQ-4adfbe-13-0', '4adfbe', 12, '13', '| 13. | Two cubes of volume 8 cm³ are joined end to end, then the surface area of resulting cuboid is:', 1, 'Mensuration', 'MCQ', 2, NULL, array['20cm²', '10 cm²', '80 cm²', '40 cm² | 1 |']::text[]),
  ('MQ-4adfbe-14-0', '4adfbe', 13, '14', '| 14. | The following distribution shows the marks distribution of 90 students. | 1 |
| Marks | Below 5 | Below 10 | Below 15 | Below 20 | Below 25 | Below 30 |
| No.of students | 2 | 6 | 24 | 45 | 78 | 90 |
| The modal class is:', 1, 'Statistics', 'MCQ', 2, NULL, array['20-25', '15-20', '10-15', '25-30 | |']::text[]),
  ('MQ-4adfbe-15-0', '4adfbe', 14, '15', '| 15. | If a solid sphere with total surface area 48cm² is bisected into two hemispheres, then the total surface area of any one of the hemisphere is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['48 cm²', '60 cm²', '264 cm²', '36 cm² | 1 |']::text[]),
  ('MQ-4adfbe-16-0', '4adfbe', 15, '16', '| 16. | The mean of first five whole numbers is:', 1, 'Statistics', 'MCQ', 3, NULL, array['10', '2', '7.5', '5 | 1 |']::text[]),
  ('MQ-4adfbe-17-0', '4adfbe', 16, '17', '| 17. | Two different dice are rolled together, the probability of getting a sum of 10 of the numbers on the two dice is:', 1, 'Probability', 'MCQ', 3, NULL, array['2/13', '5/14', '1/12', '1/13 | 1 |']::text[]),
  ('MQ-4adfbe-18-0', '4adfbe', 17, '18', '| 18. | A right circular cylinder base area is 176 cm² and it has volume 1408 cm³ then the height of the cylinder is:', 1, 'Mensuration', 'MCQ', 3, NULL, array['5cm', '16cm', '8cm', '7cm | 1 |']::text[]),
  ('MQ-4adfbe-19-0', '4adfbe', 18, '19', '| | DIRECTION: In the question 19 and 20 ,a statement of **Assertion(A)** is followed by a Statement of **Reason(R)** (a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A) (b) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A) (c) Assertion (A) is true but reason (R) is false. (d) Assertion (A) is false but reason (R) is true. | |
| 19. | Assertion(A): If product of two numbers is 12960 and their HCF is 12, then their LCM is 108. Reason(R): HCF is always a factor of LCM. | 1 |', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-4adfbe-20-0', '4adfbe', 19, '20', '| | DIRECTION: In the question 19 and 20 ,a statement of **Assertion(A)** is followed by a Statement of **Reason(R)** (a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A) (b) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A) (c) Assertion (A) is true but reason (R) is false. (d) Assertion (A) is false but reason (R) is true. | |
| 20. | Assertion (A): If ΔABC and ΔPQR are congruent triangles, then they are also similar triangles. Reason (R): All congruent triangles are similar but the similar triangles need not be congruent. | 1 |', 1, 'Similarity', 'short', 3, NULL, NULL),
  ('MQ-4adfbe-21-0', '4adfbe', 20, '21', '| 21. | (A).The LCM of two numbers is 64699, their HCF is 97 and one of the numbers is 2231. Find the other. **OR** (B). Explain why 7 × 11 × 13 + 13 and 7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 are composite numbers. | 2 |', 2, NULL, 'short', 3, NULL, NULL),
  ('MQ-4adfbe-22-0', '4adfbe', 21, '22', '| 22. | Find the ratio in which the segment joining the points (1, –3) and (4, 5) is divided by x-axis. Also find the coordinates of this point on x-axis. | 2 |', 2, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-4adfbe-23-0', '4adfbe', 22, '23', '| 23. | (A).Find the probability that a non-leap year selected at random will contain 53 Sundays. **OR** (B).100 tickets of a lottery were sold and there are 5 prizes on these tickets. If Saket has purchased one lottery ticket, what is the probability of winning a prize? | 2 |', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-24-0', '4adfbe', 23, '24', '| 24. | Find the distance between the points P(acosθ + bsinθ, 0) and Q (0, asinθ - bcosθ). | 2 |', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-25-0', '4adfbe', 24, '25', '| 25. | Evaluate: $$\frac{5\cos^2 60^0 + 4\sec^2 30^0 - \tan^2 45^0}{\sin^2 30^0 + \cos^2 30^0}$$. | 2 |', 2, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-26-0', '4adfbe', 25, '26', '| 26. | A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream. | 3 |', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-27-0', '4adfbe', 26, '27', '| 27. | (A). In given Fig.CM and RN are respectively the medians of ΔABC and Δ PQR. If ΔABC ~ΔPQR, prove that : (i) ΔAMC ~ ΔPNR (ii) $$\frac{CM}{RN} = \frac{AB}{PQ}$$ **OR** (B) If BC || EF and FG || CD then prove that AE × AD = AB × AG | 3 |', 3, 'Similarity', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-28-0', '4adfbe', 27, '28', '| 28. | If p(x) = ax² - 8x + 3, where ''a'' is a non-zero real number. One zero of p(x) is three times the other zero. (a) Find the value of a. Show your work. (b) What is the shape of the graph of p(x)? Give reason for your answer. | 3 |', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-29-0', '4adfbe', 28, '29', '| 29. | If x = p sec θ + q tan θ and y = p tan θ + q sec θ, then prove that x² - y² = p² - q². | 3 |', 3, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-30-0', '4adfbe', 29, '30', '| 30 | (A). Annual function badges are circular in shape with two colour area red and silver as shown in picture. The diameter of region representing red colour is 22 cm and silver colour is filled in 10.5 cm wide ring. Find the area of silver region. | 3 |', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-4adfbe-30-1', '4adfbe', 30, '30', '| | **OR** A round table cover has six equal designs as shown in Fig. If the radius of the cover is 28 cm, find the cost of making the designs at the rate of Rs.0.35 per cm². (Use√3 = 1.7) | |', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-4adfbe-31-0', '4adfbe', 31, '31', '| 31. | Prove that √5 is irrational number. | 3 |', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-4adfbe-32-0', '4adfbe', 32, '32', '| 32. | (A).On reversing the digits of a two digit number, number obtained is 9 less than three times the original number. If difference of these two numbers is 45, find the original number. **OR** Solve the following pair of equations graphically: x + 2y = 8, 4x-y - 5=0. | 5 |', 5, NULL, 'long', 5, NULL, NULL),
  ('MQ-4adfbe-33-0', '4adfbe', 33, '33', '| 33. | Prove that the lengths of tangents drawn from an external point to a circle are equal. With the help of this result if two tangents TP and TQ are drawn to a circle with centre O from an external point T. Prove that ∠PTQ = 2∠OPQ. | 5 |', 5, 'Circles', 'long', 5, NULL, NULL),
  ('MQ-4adfbe-34-0', '4adfbe', 34, '34', '| 34. | From the top of a 7 m high building, the angle of elevation of the top of a tower is 60° and the angle of depression of its foot is 45°. Find the height of the tower. | 5 |', 5, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-4adfbe-35-0', '4adfbe', 35, '35', '| 35 | (A).If the median of the following frequency distribution is 32.5. Find the values of f₁ and f₂. | 5 |
| Class Interval | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 | 50-60 | 60-70 | Total |
| Frequency | f₁ | 5 | 9 | 12 | f₂ | 3 | 2 | 40 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-4adfbe-35-1', '4adfbe', 36, '35', '| **OR** Find the mean and mode of the following data: |
| Class Interval | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 | 100-120 | 120-140 |
| Frequency | 25 | 38 | 15 | 40 | 35 | 22 | 36 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-4adfbe-36-0', '4adfbe', 37, '36', '| 36. | In a potato race, a bucket is placed at the starting point, which is 5 m from the first potato, and the other potatoes are placed 3 m apart in a straight line. There are ten potatoes in the line.![img-0.jpeg](img-0.jpeg)A competitor starts from the bucket, picks up the nearest potato, runs back with it, drops it in the bucket, runs back to pick up the next potato, runs to the bucket to drop it in, and she continues in the same way until all the potatoes are in the bucket.On the basis of the above information answer the following questions:(i) Write an A.P. whose terms represent the distance of potatoes from the bucket. Also, find the common difference.(ii) Find \( a_7 \) of this A.P.(iii) (A) What is the total distance the competitor has to run?OR(B) If there will be 12 potatoes then what is the total distance the Competitor has to run? | 1122 |', 4, 'Arithmetic Progression', 'long', 6, '4adfbe__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-4adfbe-37-0', '4adfbe', 38, '37', '| 37. | Anika is studying in class X. She observes two poles DC and BA. The heights of these poles are x m and y m respectively as shown in figure:![img-1.jpeg](img-1.jpeg)These poles are z m apart and O is the point of intersection of the lines joining the top of each pole to the foot of opposite pole and the distance between point O and L is d. Few questions came to his mind while observing the poles.Based on the above information, solve the following questions:(i) Which similarity criteria is applicable in ΔCAB andΔCLO?(ii) If x=y, prove that BC: DA = 1 : 1.(iii) (A) If CL = a, then find a in terms of x, y and d.OR(B) If AL = b, then find b in terms of x, y and d. | 1122 |', 4, 'Similarity', 'long', 6, '4adfbe__CBSE_X_Mat_p6_img_1_jpeg.webp', NULL),
  ('MQ-4adfbe-38-0', '4adfbe', 39, '38', '38.

Avantika join four cubical open boxes of edge 20 cm each to make a pot for planting saplings of pudina in her kitchen garden. The saplings are cylindrical in shape with diameter 14.2 cm and height 11 cm.

Based on the above information, solve the following questions:

(i) If Avantika wants to paint the outer surface of the pot, then how much area she needs to paint?
(ii) What is the volume of the pot formed?
(iii) (A) Find the volume of 1 sapling.', 4, 'Mensuration', 'long', 7, '4adfbe__CBSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-4adfbe-38-1', '4adfbe', 40, '38', '38.

Avantika join four cubical open boxes of edge 20 cm each to make a pot for planting saplings of pudina in her kitchen garden. The saplings are cylindrical in shape with diameter 14.2 cm and height 11 cm.

Based on the above information, solve the following questions:

(i) If Avantika wants to paint the outer surface of the pot, then how much area she needs to paint?
(ii) What is the volume of the pot formed?
(B) If Avantika planted 4 saplings in the pot with some soil and compost up to the brim of the pot, then how much soil and compost are there in the pot?', 4, 'Mensuration', 'long', 7, NULL, NULL),
  ('MQ-53528d-1-0', '53528d', 0, '1', '| 1 | $$\Delta ABC$$ and $$\Delta DEF, \frac{AB}{DE} = \frac{BC}{FD}$$ Which of the following makes the two-triangle similar (a$$\angle A = \angle D$$ (b) $$\angle B = \angle D$$ (C) $$\angle B = \angle E$$ (D) $$\angle A = \angle F$$ | 1 |', 1, 'Similarity', 'short', 1, NULL, NULL),
  ('MQ-53528d-2-0', '53528d', 1, '2', '| 2 | If $$cosec\theta + cot\theta = x$$,value of $$cosec\theta - cot\theta$$ is | 1 |', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-53528d-3-0', '53528d', 2, '3', '| 3 | \( 10\sin^{2}\theta + 10\cos^{2}\theta = ? \)', 1, 'Trigonometry', 'MCQ', 2, NULL, array['1', '5', '10', '\( \frac{1}{10} \) | | | 1 |']::text[]),
  ('MQ-53528d-4-0', '53528d', 3, '4', '| 4 | A pole 6m high casts a shadow \( 2\sqrt{3} \) m long on the ground then, the Sun’s elevation is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['\( 60^{0} \)', '\( 45^{0} \)', '\( 30^{0} \)', '\( 90^{0} \) | | | 1 |']::text[]),
  ('MQ-53528d-5-0', '53528d', 4, '5', '| 5 | The HCF and LCM of two number are 9 and 360 respectively. If one number is 45 what is the other number.', 1, NULL, 'MCQ', 2, NULL, array['50', '75', '73', '72 | | | 1 |']::text[]),
  ('MQ-53528d-6-0', '53528d', 5, '6', '| 6 | The number of polynomials having zeroes as 3 and 5 is', 1, NULL, 'MCQ', 2, NULL, array['1', '2', '3', 'More than 3 | | | 1 |']::text[]),
  ('MQ-53528d-8-0', '53528d', 6, '8', '| 8 | The pair of equations \( x + 2y + 5 = 0 \) and \( -3x - 6y + 1 = 0 \) have', 1, NULL, 'MCQ', 2, NULL, array['Unique solution', 'Two solution', 'Infinitely many solution', 'No solution | | | 1 |']::text[]),
  ('MQ-53528d-9-0', '53528d', 7, '9', '| 9 | \( \Delta ABC \sim \Delta PQR \). If AM and PN are altitudes of \( \Delta ABC \)and\( \Delta PQR \) respectively and \( AB^{2}:PQ^{2} = 4:9 \) Then AM:PN is', 1, 'Similarity', 'MCQ', 2, NULL, array['3:2', '16:81', '4:9', '2:3 | | | 1 |']::text[]),
  ('MQ-53528d-10-0', '53528d', 8, '10', '| 10 | In the given figure, If PA and PB are tangents to the circle with centre O such that\( \angle PAB=50^{0} \), then \( \angle OAB \) is equal to :(a)\( 25^{0} \) (b) \( 30^{0} \)(b)\( 40^{0} \) (d) \( 50^{0} \)![img-0.jpeg](img-0.jpeg) | | | 1 |', 1, 'Circles', 'short', 2, '53528d__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-53528d-11-0', '53528d', 9, '11', '| 11 | The ratio of heights of two circular cylinder of same volume is 1:3, the ratio of the radii of their base is.', 1, 'Mensuration', 'MCQ', 2, NULL, array['3:1', '2:1', '\( \sqrt{3} :1 \)', '\( \sqrt{2} :1 \) | | | 1 |']::text[]),
  ('MQ-53528d-12-0', '53528d', 10, '12', '| 12 | If the perimeter and the area of a circle are numerically equal, then the radius of the circle is', 1, 'Mensuration', 'MCQ', 2, NULL, array['2units', '3units', '5units', '2 units | | | 1 |']::text[]),
  ('MQ-53528d-13-0', '53528d', 11, '13', '| 13 | A card is drawn at random from a well shuffled pack of 52 playing cards. Probability of getting neither a red card nor a queen is | | | 1 |', 1, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-53528d-14-0', '53528d', 12, '14', '| 14 | Total number of factors of a prime number is', 1, NULL, 'MCQ', 3, NULL, array['0', '1', '2', '4 | 1 |']::text[]),
  ('MQ-53528d-15-0', '53528d', 13, '15', '| 15 | Mode+2mean=?', 1, 'Statistics', 'MCQ', 3, NULL, array['Probability', '3Median', '3Mode', '3Mean | 1 |']::text[]),
  ('MQ-53528d-16-0', '53528d', 14, '16', '| 16 | Which of the following is a real number?', 1, NULL, 'MCQ', 3, NULL, array['$$\sqrt{-1}$$', '$$\frac{3}{0}$$', '$$\sqrt{5}$$', 'None of these | 1 |']::text[]),
  ('MQ-53528d-17-0', '53528d', 15, '17', '| 17 | If the quadratic equation $$ax^2 + bx + c = 0$$ has two real and equal roots, then “c” is equal to', 1, 'Quadratic Equations', 'MCQ', 3, NULL, array['$$\frac{-b}{2a}$$', '$$\frac{b}{2a}$$', '$$\frac{-b^2}{4a}$$', '$$\frac{b^2}{4a}$$ | 1 |']::text[]),
  ('MQ-53528d-18-0', '53528d', 16, '18', '| 18 | Given a circle with radius 6cm and angle of sector is $$60^\circ$$ then area of a sector of a circle is', 1, 'Mensuration', 'MCQ', 3, NULL, array['$$\frac{136}{7} \text{ cm}^2$$', '$$\frac{131}{7} \text{ cm}^2$$', '$$\frac{132}{7} \text{ cm}^2$$', '$$\frac{150}{7} \text{ cm}^2$$ | 1 |']::text[]),
  ('MQ-53528d-19-0', '53528d', 17, '19', '| 19 | Assertion (A) 34.12345 is a terminating decimal fraction. Reason (R) Denominator of 34.12345 when expressed in the form p/q, q ≠ 0, is the form of $$2^m \times 2^n$$, where m and n are non-negative integer | 1 |', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-53528d-20-0', '53528d', 18, '20', '| 20 | Assertion (A): If the distance between the point (4, p) and (1,0) is 5, then the value of p is 4. Reason(R) The point which divides the line segment joining the point (7, -6) and (3,4) in the ratio 1:2 internally lies in the fourth quadrant. | 1 |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-53528d-21-0', '53528d', 19, '21', '| 21 | The length of a tangent from a point A at distance 5cm from the centre of the circle is 4cm. Find the radius of the circle. | 2 |', 2, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-53528d-22-0', '53528d', 20, '22', '| 22 | Prove that $$\sqrt{sec^2\theta + cosec^2\theta} = tan\theta + cot\theta$$ | 2 |', 2, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-53528d-23-0', '53528d', 21, '23', '| 23 (A) (B) | The diagonals of a quadrilateral ABCD intersect each other at the point O such that $$\frac{AO}{BO} = \frac{CO}{DO}$$. Show that ABCD is a trapezium **OR** In an equilateral triangle, the length of the median is $$\sqrt{3}$$ cm, then find the length of the side of 2 equilateral triangle. | 2 |', 2, 'Similarity', 'short', 4, NULL, NULL),
  ('MQ-53528d-24-0', '53528d', 22, '24', '| 24 | If the system of equations $$6x + 2y = 3$$ and $$kx + y = 2$$ has a unique solution, find the value of k. | 2 |', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-53528d-25-0', '53528d', 23, '25', '| 25 (A) | In given figure, AB is the diameter of a circle with centre O and AT is a tangent. If $$\angle AOQ = 58^\circ$$, Find $$\angle ATQ$$ OR In the given figure common tangent AB and CD to the two circles with centre $$O_1$$ And $$O_2$$ intersect at E. Prove that AB = CD | 2 |', 2, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-53528d-26-0', '53528d', 24, '26', '| 26 | 4 chairs and 3 tables cost Rs 2100 and 5 chairs and 2 tables | 3 |
| | costs Rs 1750. Find the cost of one chair and one table separately. OR The sum of the numerator and denominator of a fraction is 12. If 1 is added to both the numerator and denominator the fraction becomes $$\frac{3}{4}$$. Find the fraction. | |', 3, NULL, 'short', 4, NULL, NULL),
  ('MQ-53528d-27-0', '53528d', 25, '27', '| 27 | Find the quadratic polynomials whose zeroes are $$3 + \sqrt{2}$$ and $$3 - \sqrt{2}$$ | 3 |', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-53528d-28-0', '53528d', 26, '28', '| 28 | Prove that $$2-3\sqrt{5}$$ is an irrational number. | 3 |', 3, NULL, 'short', 5, NULL, NULL),
  ('MQ-53528d-29-0', '53528d', 27, '29', '| 29 | Three distinct coins are tossed together. Find the probability of getting; (i) At least 2 head (ii) At most 2 heads | 3 |', 3, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-53528d-30-0', '53528d', 28, '30', '| 30 | Prove that length of the tangents drawn from an external point to a circle are equal | 3 |', 3, 'Circles', 'short', 5, NULL, NULL),
  ('MQ-53528d-31-0', '53528d', 29, '31', '| 31 | Prove that: $$\frac{\cosec^2\theta}{\cosec\theta-1} - \frac{\cosec^2\theta}{\cosec\theta+1} = 2\sec^2\theta$$ OR Prove that: $$(\sin\theta + \cosec\theta)^2 + (\cos\theta + \sec\theta)^2 = \tan^2\theta + \cot^2\theta + 7$$. | 3 |', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-53528d-32-0', '53528d', 30, '32', '| 32 (A) (B) | 150 Spherical marbles each with diameter 1.4cm, are dropped in a cylindrical vessel of diameter 7cm containing some water, which are completely immersed in water. Find the rise in the level of water in the vessel. OR A vessel is in the form of a hemispherical bowl surmounted by hallow cylinder of same diameter. The diameter of the hemispherical bowl is 14 cm and total height of the vessel is 13 cm. Find the total surface area of the vessel. Use $$\pi=\frac{22}{7}$$ | 5 |', 5, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-53528d-33-0', '53528d', 31, '33', '| 33 | The median of the distribution given below is 14.4. Find the values of $$x$$ and $$y$$. If the sum of frequency is 20. **Class interval** 0 – 6 6 – 12 12 – 18 18 – 24 24 – 30 **Frequency** 4 x 5 y 1 | 5 |', 5, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-53528d-34-0', '53528d', 32, '34', '| 34 | A truck covers a distance of 150 km at certain average speed and then covers another 200 km at an average speed which is 20km per hour more than the first speed. If the truck covers the total distance in 5 hours, find the first speed of the truck. **OR** Two water taps together can fill a tank in 6hours. The tap of larger diameter takes 9 hours less than the smaller one to fill the tank separately. Find the time in which each tap can separately fill the tank. | 5 |', 5, 'Quadratic Equations', 'long', 6, NULL, NULL),
  ('MQ-53528d-35-0', '53528d', 33, '35', '| 35 | A girls of height 90cm is walking away from the base of a lamp post at a speed 1.2m/s. If the lamp is 3.6 m above the ground , find the length of her shadow after 4 seconds. | 5 |', 5, 'Similarity', 'long', 6, NULL, NULL),
  ('MQ-53528d-36-0', '53528d', 34, '36', '| 36 | India is competitive manufacturing location due to low cost of manpower and strong technical and engineering capabilities contributing to higher quality production runs. The production of TV sets in a factory increases uniformly by a fixed number every year. It produced 16000 sets in 6^{th} years and 22600in 9^{th} year. | |
| (i) | Find the production during first year. | 2 |', 2, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-53528d-36-1', '53528d', 35, '36', '| 36 | India is competitive manufacturing location due to low cost of manpower and strong technical and engineering capabilities contributing to higher quality production runs. The production of TV sets in a factory increases uniformly by a fixed number every year. It produced 16000 sets in 6^{th} years and 22600in 9^{th} year. | |
| (ii) | Find the production during first three years. **OR** In which year, the production is Rs29200. | 2 |', 2, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-53528d-37-0', '53528d', 36, '37', '| 37 | Annual sport day activities in your School, lines have been drawn with chalk power at a distance of 1m each, in a rectangular shaped ground ABCD,100 flowerpots have been placed at a distance of 1m from the each other along AD, as shown in the given figure. Riya run 1/4^{th} the distance AD on the 2^{nd} line and posts a green (G) Flag. Fateha runs 1/5^{th} distance AD on eighth line and posts a red (R) Flag. | |
| (i) | Find the coordinate of green flag. | 2 |
| (ii) | Find the coordinate of red flag. | 2 |', 2, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-53528d-37-1', '53528d', 37, '37', '| 37 | Annual sport day activities in your School, lines have been drawn with chalk power at a distance of 1m each, in a rectangular shaped ground ABCD,100 flowerpots have been placed at a distance of 1m from the each other along AD, as shown in the given figure. Riya run 1/4^{th} the distance AD on the 2^{nd} line and posts a green (G) Flag. Fateha runs 1/5^{th} distance AD on eighth line and posts a red (R) Flag. | |
| (iii) | What is distance between both Flags? | 2 |', 2, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-53528d-38-0', '53528d', 38, '38', '| 38 | A toll plaza an electronic toll collection system has been installed. Fast tag can be used to pay the fare. The tag can be pasted on the windscreen of a car. At the toll plaza a tag scanned reads the information on the tag of the vehicle and debits the desired toll amount from a linked bank amount. For the tag scanner to function properly the speed of a car needs to be less than 30km per hours. A car with a tag installed at a height of 1.5m from the ground enters the scanner zone | |
| (i) | The scanner gets activated when the car tag is at distance of 5m from it. Give one trigonometric ratio for the angle between the horizontal and the line between the car tag and the scanner? | 2 |
| (ii) | The scanner read the complete information on the cars tag while the angle between chip and scanner changes from 30°to 60°due to car movement. What is the distance moved by the car. | 2 |', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-53528d-38-1', '53528d', 39, '38', '| 38 | A toll plaza an electronic toll collection system has been installed. Fast tag can be used to pay the fare. The tag can be pasted on the windscreen of a car. At the toll plaza a tag scanned reads the information on the tag of the vehicle and debits the desired toll amount from a linked bank amount. For the tag scanner to function properly the speed of a car needs to be less than 30km per hours. A car with a tag installed at a height of 1.5m from the ground enters the scanner zone | |
| (iii) | Vehicle with a tag pasted at a height of 2m from the ground stops in the scanner zone. The scanner reads the data at an angle of 45°. What is distance between the tag and the scanner. | 2 |', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-c2986a-1-0', 'c2986a', 0, '1', '| 1 | The zeroes of the quadratic polynomial $$2x^2 - 3x - 9$$ are: a) $$-3, \frac{-3}{2}$$ b) $$3, \frac{3}{2}$$ c) $$3, \frac{-3}{2}$$ d) $$-3, \frac{3}{2}$$ | **[1]** |', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-c2986a-2-0', 'c2986a', 1, '2', '| 2 | For what value of k, the product of zeroes of the polynomial $$kx^2 - 4x - 7$$ is 2? | **[1]** |
| | a) $$\frac{7}{2}$$ b) $$-\frac{2}{7}$$ c) $$-\frac{1}{14}$$ d) $$-\frac{7}{2}$$ | |', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-c2986a-3-0', 'c2986a', 2, '3', '| 3 | The pair of linear equations 4x + 6y = 9 and 2x + 3y = 6 has a) no solution b) two solutions c) one solution d) many solutions | [1] |', 1, NULL, 'short', 2, NULL, NULL),
  ('MQ-c2986a-4-0', 'c2986a', 3, '4', '| 4 | 2x² - 3x + 2 = 0 have a) Real and Distinct roots b) Real and Equal roots c) Real roots d) No Real roots | [1] |', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-c2986a-5-0', 'c2986a', 4, '5', '| 5 | Which term of the A.P. - 29, - 26, - 23, ..., 61 is 16? a) 11^{th} b) 31^{st} c) 10^{th} d) 16^{th} | [1] |', 1, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-c2986a-6-0', 'c2986a', 5, '6', '| 6 | If (3, -6) is the mid - point of the line segment joining (0, 0) and (x, y), then the point (x, y) is: a) (6, - 6) b) (6, - 12) | [1] |
| | c) $$\left(\frac{3}{2}, -3\right)$$ d) ( - 3, 6) | |', 1, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-c2986a-7-0', 'c2986a', 6, '7', '| 7 | Distance of point P(3, 4) from x - axis is a) 5 units b) 1 unit c) 4 units d) 3 units | [1] |', 1, 'Coordinate Geometry', 'short', 3, NULL, NULL),
  ('MQ-c2986a-8-0', 'c2986a', 7, '8', '| 8 | If $$\sin A = \frac{1}{2}$$, then the value of cot A is a) $$\sqrt{3}$$ b) $$\frac{\sqrt{3}}{2}$$ c) $$\frac{1}{\sqrt{3}}$$ d) 1 | [1] |', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-c2986a-9-0', 'c2986a', 8, '9', '| 9 | The value of $$\sin 45^\circ + \cos 45^\circ$$ is a) $$\sqrt{2}$$ b) $$\frac{1}{\sqrt{2}}$$ c) 1 d) $$\frac{1}{\sqrt{3}}$$ | [1] |', 1, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-c2986a-10-0', 'c2986a', 9, '10', '| 10 | The length of the tangent drawn from a point 8 cm away from the centre of a circle of radius 6 cm is a) 5 cm b) $$\sqrt{7}$$ cm c) 10 cm | [1] |
| | d) \( 2\sqrt{7} \) cm | |', 1, 'Circles', 'short', 3, NULL, NULL),
  ('MQ-c2986a-11-0', 'c2986a', 10, '11', '| 11 | In the given figure, the perimeter of\( \Delta \) ABC is:![img-0.jpeg](img-0.jpeg)a) 15 cmb) 30 cmc) 60 cmd) 45 cm | [1] |', 1, 'Circles', 'short', 4, 'c2986a__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-c2986a-12-0', 'c2986a', 11, '12', '| 12 | A circle is of radius 3 cm. The distance between two of its parallel tangents is:a) 3 cmb) 4.5 cmc) 6 cmd) 12 cm | [1] |', 1, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-c2986a-13-0', 'c2986a', 12, '13', '| 13 | A solid is in the shape of a cone standing on a hemisphere with both their radii being equal to 1cm and the height of the cone is equal to its radius. The volume of the solid isa) \( \pi cm^{3} \)b) \( 4\pi cm^{3} \)c) \( 2\pi cm^{3} \)d) \( 3\pi cm^{3} \) | [1] |', 1, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-c2986a-14-0', 'c2986a', 13, '14', '| 14 | How many bricks each measuring (25 cm× 11.25 cm × 6 cm) will be required to construct a wall (8 m × 6 m × 22.5 cm)?a) 7200 | [1] |
| | b) 4800 c) 8000 d) 6400 | |', 1, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-c2986a-15-0', 'c2986a', 14, '15', '| 15 | The mean of all the factors of 24 is a) 7.5 b) 7 c) 6.5 d) 24 | [1] |', 1, NULL, 'short', 5, NULL, NULL),
  ('MQ-c2986a-16-0', 'c2986a', 15, '16', '| 16 | For a frequency distribution, mean, median and mode are connected by the relation a) Mode = 3 Median - 2 Mean b) Mode = 2 Median - 3 Mean c) Mode = 3 Mean - 2 Median d) Mode = 3 Median + 2 Mean | [1] |', 1, 'Statistics', 'short', 5, NULL, NULL),
  ('MQ-c2986a-17-0', 'c2986a', 16, '17', '| 17 | Which of the following cannot be the probability of occurrence of an event? a) 0.2 b) 1.6 c) 0.8 d) 0.4 | [1] |', 1, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-c2986a-18-0', 'c2986a', 17, '18', '| 18 | An unbiased die is thrown once. The probability of getting a composite number is a) $$\frac{2}{5}$$ b) $$\frac{1}{3}$$ | [1] |
| | c) $$\frac{2}{3}$$ d) $$\frac{1}{2}$$ | |', 1, 'Probability', 'short', 5, NULL, NULL),
  ('MQ-c2986a-19-0', 'c2986a', 18, '19', '| 19 | **Assertion (A):** The HCF of two numbers is 5 and their product is 150, then their LCM is 30. **Reason (R):** For any two positive integers a and b, HCF (a, b) + LCM (a, b) = a × b. a) Both A and R are true and R is the correct explanation of A. b) Both A and R are true but R is not the correct explanation of A. c) A is true but R is false. d) A is false but R is true. | **[1]** |', 1, NULL, 'short', 6, NULL, NULL),
  ('MQ-c2986a-20-0', 'c2986a', 19, '20', '| 20 | **Assertion (A):** Area of a sector of a circle of radius r and central angle $$\theta = \left( \frac{\theta}{180} \times 2\pi r \right)$$ **Reason (R):** Sector is a part of a circle enclosed between two bounding radii and a corresponding arc. a) Both A and R are true and R is the correct explanation of A. b) Both A and R are true but R is not the correct explanation of A. c) A is false but R is true. d) A is true but R is false. | **[1]** |', 1, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-c2986a-21-0', 'c2986a', 20, '21', '| 21 | Find the HCF of 96 and 404 by prime factorisation method. Hence, find their LCM. **OR** Find the LCM and HCF of the integers 12, 15 and 21 by applying the prime factorisation method. | **[2]** |', 2, NULL, 'short', 6, NULL, NULL),
  ('MQ-c2986a-22-0', 'c2986a', 21, '22', '| 22 | Find the value of y for which the distance between the points P (2, - 3) and Q(10, y) is 10 units. | **[2]** |', 2, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-c2986a-23-0', 'c2986a', 22, '23', '| 23 | Find the coordinates of the point which divides the line segment joining the points (4, - 3) and (8, 5) in the ratio 3 : 1 internally. | [2] |', 2, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-c2986a-24-0', 'c2986a', 23, '24', '| 24 | If cos A = \( \frac{5}{13} \), then verify that \( \frac{\cos A}{1 - \tan A} + \frac{\sin A}{1 - \cot A} = \cos A + \sin A \). | [2] |', 2, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-c2986a-25-0', 'c2986a', 24, '25', '| 25 | Gopi buys a fish from a shop for his aquarium. The shopkeeper takes out one fish at random from a tank containing 5 male fish and 8 female fish. What is the probability that the fish taken out is a male fish?![img-0.jpeg](img-0.jpeg)(OR)A bag contains 2 green, 3 red and 4 black balls. A ball is taken out from the bag at random. Find the probability that the selected ball isa) Not Greenb) Not Black | [2] |', 2, 'Probability', 'short', 7, 'c2986a__CBSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-c2986a-26-0', 'c2986a', 25, '26', '| 26 | Prove that\( \sqrt{2} \) is an irrational number. | [3] |', 3, NULL, 'short', 7, NULL, NULL),
  ('MQ-c2986a-27-0', 'c2986a', 26, '27', '| 27 | Find a quadratic polynomial, the sum and product of whose zeroes are\( \sqrt{2} \)and \( \frac{1}{3} \), respectively. | [3] |', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-c2986a-28-0', 'c2986a', 27, '28', '| 28 | Is it possible to design a rectangular park of perimeter 80 m and area 400 m2? If so, find its length and breadth. | [3] |', 3, 'Quadratic Equations', 'short', 7, NULL, NULL),
  ('MQ-c2986a-29-0', 'c2986a', 28, '29', '| 29 | Write all the other trigonometric ratios of∠ A in terms of sec A. | [3] |', 3, 'Trigonometry', 'short', 7, NULL, NULL),
  ('MQ-c2986a-30-0', 'c2986a', 29, '30', '| 30 | ABCD is a trapezium with AB || DC. E and F are two points on non - parallel sides AD and BC respectively, such that EF is parallel to AB.Show that \( \frac{AE}{ED} = \frac{BF}{FC} \)![img-1.jpeg](img-1.jpeg)OR | [3] |', 3, 'Similarity', 'short', 7, 'c2986a__CBSE_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-c2986a-30-1', 'c2986a', 30, '30', '| | E is a point on side AD produced of a parallelogram ABCD and BE intersects CD at F. Prove that\( \Delta ABE \sim \Delta CFB \). | |', 3, 'Similarity', 'short', 8, NULL, NULL),
  ('MQ-c2986a-31-0', 'c2986a', 31, '31', '| 31 | In a circle of radius 21 cm, an arc subtends an angle of \( 60^{\circ} \) at the center. Find:1. the length of the arc.2. area of the sector formed by the arc.3. area of the segment formed by the corresponding chordORA brooch is made with silver wire in the form of a circle with diameter 35 mm. The wire is also used in making 5 diameters which divide the circle into 10 equal sectors as shown in figure. Find:1. the total length of the silver wire required.2. the area of each sector of the brooch.![img-0.jpeg](img-0.jpeg) | [3] |', 3, 'Mensuration', 'short', 8, NULL, NULL),
  ('MQ-c2986a-32-0', 'c2986a', 32, '32', '| 32 | Half the perimeter of a rectangular garden, whose length is 4 m more than its width, is 36 m. Find the dimensions of the garden graphically.ORIf we add 1 to the numerator and subtract 1 from the denominator, a fraction reduces to 1. It becomes\( \frac{1}{2} \) if we only add 1 to the denominator. What is the fraction? | [5] |', 5, NULL, 'long', 8, NULL, NULL),
  ('MQ-c2986a-33-0', 'c2986a', 33, '33', '| 33 | A statue, 1.6 m tall, stands on the top of a pedestal. From a point on the ground, the angle of elevation of the top of the statue is \( 60^{\circ} \) and from the same point the angle of elevation of the top of the pedestal is \( 45^{\circ} \). Find the height of the pedestal. | [5] |', 5, 'Trigonometry', 'long', 8, NULL, NULL),
  ('MQ-c2986a-34-0', 'c2986a', 34, '34', '| 34 | In figure AB and CD are two parallel tangents to a circle with centre O. ST is tangent segment between the two parallel tangents touching the circle at Q. Show that∠ SOT = 90°![img-0.jpeg](img-0.jpeg) | | [5] |', 5, 'Circles', 'long', 9, 'c2986a__CBSE_X_Mat_p9_img_0_jpeg.webp', NULL),
  ('MQ-c2986a-35-0', 'c2986a', 35, '35', '| 35 | The following table shows the ages of the patients admitted in a hospital during a year:Find the mode and the mean of the data given above. Compare and interpret the two measures of central tendency.ORThe following table gives the distribution of the life time of 400 neonlamps:Find the median life time of a lamp. | | [5] |', 5, 'Statistics', 'long', 9, NULL, NULL),
  ('MQ-c2986a-36-0', 'c2986a', 36, '36', '| 36 | Read the following text carefully and answer the questions that follow:Akshat''s father is planning some construction work in his terrace area. He ordered 360 bricks and instructed the supplier to keep the bricks in such as way that the bottom row has 30 bricks and next is one less than that and so on. | | [4] |
| | ![img-0.jpeg](img-0.jpeg)The supplier stacked these 360 bricks in the following manner, 30 bricks in the bottom row, 29 bricks in the next row, 28 bricks in the row next to it, and so on.1. In how many rows, 360 bricks are placed? (1)2. How many bricks are there in the top row? (1)3. How many bricks are there in \( 10^{th} \) row? (2)ORIf which row 26 bricks are there? (2) | |', 1, 'Arithmetic Progression', 'short', 9, 'c2986a__CBSE_X_Mat_p10_img_0_jpeg.webp', NULL),
  ('MQ-c2986a-37-0', 'c2986a', 37, '37', '| 37 | Read the following text carefully and answer the questions that follow:In the figure given below, a folding table is shown:![img-1.jpeg](img-1.jpeg)![img-2.jpeg](img-2.jpeg)The legs of the table are represented by line segments AB and CD intersecting at O. Join AC and BD.Considering table top is parallel to the ground, and OB = x, OD = x + 3, OC = 3x + 19 and OA = 3x + 4, answer the following questions:1. Prove that\( \Delta \) OAC is similar to \( \Delta \) OBD.2. Prove that\( \frac{OA}{AC} = \frac{OB}{BD} \)3. | [4] |', 1, 'Similarity', 'short', 10, 'c2986a__CBSE_X_Mat_p10_img_2_jpeg.webp', NULL),
  ('MQ-c2986a-37-2', 'c2986a', 38, '37', '| 37 | Read the following text carefully and answer the questions that follow:In the figure given below, a folding table is shown:![img-1.jpeg](img-1.jpeg)![img-2.jpeg](img-2.jpeg)The legs of the table are represented by line segments AB and CD intersecting at O. Join AC and BD.Considering table top is parallel to the ground, and OB = x, OD = x + 3, OC = 3x + 19 and OA = 3x + 4, answer the following questions:1. Prove that\( \Delta \) OAC is similar to \( \Delta \) OBD.2. Prove that\( \frac{OA}{AC} = \frac{OB}{BD} \)3. | [4] |
| | a. Observe the figure and find the value of x. Hence, find the length of OC.ORb. Observe the figure and find\( \frac{BD}{AC} \). | |', 2, 'Similarity', 'short', 10, NULL, NULL),
  ('MQ-c2986a-38-0', 'c2986a', 39, '38', '| 38 | Read the following text carefully and answer the questions that follow:A carpenter in the small town of Bareilly used to make and sell different kinds of wood items like a rectangular box, cylindrical pen stand, and cuboidal pen stand. One day a student came to his shop and asked him to make a pen stand with the dimensions as follows:A pen stand should be in the shape of a cuboid with four conical depressions to hold pens. The dimensions of the cuboid should be 15 cm by 10 cm by 3.5 cm. The radius of each of the depressions is0.5 cm and the depth is1.4 cm.![img-0.jpeg](img-0.jpeg)1. The volume of the cuboidal part. (1)2. The volume of wood in the entire stand. (1)3. Total volume of conical depression. (2)ORIf the cost of wood used is ₹ 10 per cm\( ^{3} \), then the total cost of making the pen stand. (2) | [4] |', 1, 'Mensuration', 'short', 11, 'c2986a__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-cda1ba-1-0', 'cda1ba', 0, '1', '| 1 | If the zeroes of the quadratic polynomial \( x^{2} + (a + 1)x + b \) are 2 and -3, then', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['a = -7, b = -1', 'a = 5, b = -1', 'a = 2, b = -6', 'a = 0, b = -6 | 1 |']::text[]),
  ('MQ-cda1ba-2-0', 'cda1ba', 1, '2', '| 2 | The zeroes of the quadratic polynomial \( x^{2} + 9x + 18 \) are', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['both positive', 'both negative', 'one positive and one negative', 'both equal | 1 |']::text[]),
  ('MQ-cda1ba-3-0', 'cda1ba', 2, '3', '| 3 | For what value k, do the equations \( 2x - y + 3 = 0 \) and \( 6x - ky + 9 = 0 \) represent coincident lines?', 1, NULL, 'MCQ', 1, NULL, array['2', '- 2', '3', '-3 | 1 |']::text[]),
  ('MQ-cda1ba-4-0', 'cda1ba', 3, '4', '| 4 | If the sum and product of the roots of the equation \( 3x^{2} - 8x + 2k = 0 \) are equal, then the value of k is', 1, 'Quadratic Equations', 'MCQ', 1, NULL, array['4', '3', '6', '8 | 1 |']::text[]),
  ('MQ-cda1ba-5-0', 'cda1ba', 4, '5', '| 5 | If 2x, x + 10, 3x + 2 are in A.P., then x is equal to', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['0', '2', '4', '6 | 1 |']::text[]),
  ('MQ-cda1ba-6-0', 'cda1ba', 5, '6', '| 6 | The coordinates of a point P, where PQ is the diameter of a circle whose centre is (2, -3)and Q is (1, 4) is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(3, -10)', '(2, -10)', '(-3, 10)', '(-2, 10). | 1 |']::text[]),
  ('MQ-cda1ba-7-0', 'cda1ba', 6, '7', '| 7 | If the distance between the points A(2, -2) and B(-1, x) is equal to 5, then the value of x is:', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['2', '-2', '1', '-1 | 1 |']::text[]),
  ('MQ-cda1ba-8-0', 'cda1ba', 7, '8', '| 8 | The value of (sin30° + cos30°) – (sin60° + cos60°) is ...', 1, 'Trigonometry', 'MCQ', 2, NULL, array['-1', '0', '1', '2 | 1 |']::text[]),
  ('MQ-cda1ba-9-0', 'cda1ba', 8, '9', '| 9 | If 3sec θ – 5 =0 , then cot θ is', 1, 'Trigonometry', 'MCQ', 2, NULL, array['\( \frac{4}{5} \)', '\( \frac{5}{3} \)', '\( \frac{3}{4} \)', '\( \frac{3}{5} \) | 1 |']::text[]),
  ('MQ-cda1ba-10-0', 'cda1ba', 9, '10', '| 10 | In the given below figure, point P is 26 cm away from the centre O of a circle and the length PT of the tangent drawn from P to the circle is 24 cm. Then the radius of the circle is', 1, 'Circles', 'MCQ', 2, 'cda1ba__CBSE_X_Mat_p2_img_0_jpeg.webp', array['25 cm', '26 cm', '24cm', '10cm ![img-0.jpeg](img-0.jpeg) | 1 |']::text[]),
  ('MQ-cda1ba-11-0', 'cda1ba', 10, '11', '| 11 | The tangents drawn at the extremities of the diameter of a circle are', 1, 'Circles', 'MCQ', 2, NULL, array['Perpendicular', 'Parallel', 'equal', 'none of these | 1 |']::text[]),
  ('MQ-cda1ba-12-0', 'cda1ba', 11, '12', '| 12 | In the given figure, if ∠RPS = 25°, the value of ∠ ROS is', 1, 'Circles', 'MCQ', 2, 'cda1ba__CBSE_X_Mat_p2_img_1_jpeg.webp', array['135°', '145°', '165°', '155° ![img-1.jpeg](img-1.jpeg) | 1 |']::text[]),
  ('MQ-cda1ba-13-0', 'cda1ba', 12, '13', '| 13 | The ratio of the total surface area to the curved surface area of a cylinder with base radius 80cm and height 20 cm is', 1, 'Mensuration', 'MCQ', 2, NULL, array['1 : 2', '2 : 1', '3 : 1', '5 : 1 | 1 |']::text[]),
  ('MQ-cda1ba-14-0', 'cda1ba', 13, '14', '| 14 | Volume and total surface area of a solid hemisphere are numerically equal. What is the diameter of hemisphere?', 1, 'Mensuration', 'MCQ', 2, NULL, array['9 units', '6 units', '4.5 units', '18 units | 1 |']::text[]),
  ('MQ-cda1ba-15-0', 'cda1ba', 14, '15', '| 15 | If mean of a, a+3, a+6, a+9 and a+12 is 10, then a is equal to;', 1, 'Statistics', 'MCQ', 2, NULL, array['1', '2', '3', '4 | 1 |']::text[]),
  ('MQ-cda1ba-16-0', 'cda1ba', 15, '16', '| 16 | Consider the following frequency distribution of the heights of 60 students of a class: | 1 |
| --- | --- | --- |
| Height (in cm) | 150 – 155 | 155 – 160 | 160 – 165 | 165 – 170 | 170 – 175 | 175 – 180 |
| Number of students | 15 | 13 | 10 | 8 | 9 | 5 |
| The sum of the lower limit of the modal class and upper limit of the median class is', 1, 'Statistics', 'MCQ', 3, NULL, array['310', '315', '320', '330 |']::text[]),
  ('MQ-cda1ba-17-0', 'cda1ba', 16, '17', '| 17 | Cards are marked with numbers 1 to 50 are placed in the box and mixed thoroughly. One card is drawn at random from the box. What is the probability of getting a prime number?', 1, 'Probability', 'MCQ', 3, NULL, array['1', '$$\frac{4}{10}$$', '$$\frac{1}{2}$$', '$$\frac{3}{10}$$ | 1 |']::text[]),
  ('MQ-cda1ba-18-0', 'cda1ba', 17, '18', '| 18 | A school has five houses A, B, C, D and E. One class has 23 students, 4 from house A, 8 from house B, 5 from house C, 2 from house D and the rest from house E. A single student is selected at random to be the class monitor. The probability that the selected student is not from houses A, B and C is:', 1, 'Probability', 'MCQ', 3, NULL, array['$$\frac{4}{23}$$', '$$\frac{6}{23}$$', '$$\frac{8}{23}$$', '$$\frac{17}{23}$$ | 1 |']::text[]),
  ('MQ-cda1ba-19-0', 'cda1ba', 18, '19', '| 19 | **DIRECTION:** In the question number (19) and (20), a statement of assertion (A) is followed by a statement of Reason (R). **Choose the correct option** **Statement A (Assertion):** The HCF of two numbers is 15 and their product is 2250. Then their LCM is 150. **Statement R(Reason) :** If a, b are two positive integers, then HCF x LCM=a x b. (a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A) (b) Both assertion (A) and reason (R) are true and reason (R) is not the correct explanation of assertion (A) (c) Assertion (A) is true but reason (R) is false. (d) Assertion (A) is false but reason (R) is true. | 1 |', 1, NULL, 'short', 3, NULL, NULL),
  ('MQ-cda1ba-20-0', 'cda1ba', 19, '20', '| 20 | **Statement A (Assertion)**: If the perimeter of a circle is equal to that of a square, then the ratio of their areas is 14:11 **Statement R (Reason)**: If the perimeter of a circle is equal to that of a square, then their areas are equal (a) Both assertion (A) and reason (R) are true and reason (R) is the correct explanation of assertion (A) (b) Both assertion (A) and reason (R) are true and reason (R) is not the correct **explanation** of assertion (A) (c) Assertion (A) is true but reason (R) is false. (d) Assertion (A) is false but reason (R) is true. | 1 |', 1, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-cda1ba-21-0', 'cda1ba', 20, '21', '| 21 | Given that $\sqrt{3}$ is irrational, prove that $2 + 5\sqrt{3}$ is irrational. **(or)** Given that $\sqrt{7}$ is irrational, prove that $3\sqrt{7}$ is an irrational number. | 2 |', 2, NULL, 'short', 4, NULL, NULL),
  ('MQ-cda1ba-22-0', 'cda1ba', 21, '22', '| 22 | Find the distance between the following pairs of points : (a, b), (- a, - b) | 2 |', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-cda1ba-23-0', 'cda1ba', 22, '23', '| 23 | Find the ratio in which the y-axis divides the line segment joining the points (5, - 6) and (-1, - 4). | 2 |', 2, 'Coordinate Geometry', 'short', 4, NULL, NULL),
  ('MQ-cda1ba-24-0', 'cda1ba', 23, '24', '| 24 | If $\tan (A + B) = \sqrt{3}$ and $\tan (A - B) = \frac{1}{\sqrt{3}}$; $0^\circ < A + B \le 90^\circ$; A > B, find A and B. | 2 |', 2, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-cda1ba-25-0', 'cda1ba', 24, '25', '| 25 | A bag contains 24 balls of which x are red, 2x are white and 3x are blue. Find x. A ball is selected at random. What is the probability that (i) it is red (ii) it is blue (iii) neither red nor blue **(or)** One card is drawn from a well-shuffled deck of 52 cards. Calculate the probability that the card will be (i) an ace, (ii) not be an ace. | 2 |', 2, 'Probability', 'short', 4, NULL, NULL),
  ('MQ-cda1ba-26-0', 'cda1ba', 25, '26', '| 26 | Prove that $\sqrt{5}$ is an irrational number | 3 |', 3, NULL, 'short', 4, NULL, NULL),
  ('MQ-cda1ba-27-0', 'cda1ba', 26, '27', '| 27 | If one of the zero of the polynomial \( 3x^{2} + 8x + 2k + 1 \) is seven times the other, find the value of ‘k’. | 3 |', 3, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-cda1ba-28-0', 'cda1ba', 27, '28', '| 28 | Find the values of k for each of the following quadratic equations, so that they have two equal roots.(i) \( 2x^{2} + kx + 3 = 0 \) (ii) \( kx(x - 2) + 6 = 0 \) | 3 |', 3, 'Quadratic Equations', 'short', 5, NULL, NULL),
  ('MQ-cda1ba-29-0', 'cda1ba', 28, '29', '| 29 | Prove that \( \frac{\tan \theta}{1 - \cot \theta} + \frac{\cot \theta}{1 - \tan \theta} = 1 + \sec \theta \cosec \theta \) | 3 |', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-cda1ba-30-0', 'cda1ba', 29, '30', '| 30 | Prove that “If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio”(or)In the given figure, altitudes AD and CE of Δ ABC intersect each other at the point P. Show that (i) Δ AEP ~ Δ CDP(ii) Δ ABD ~ Δ CBE(iii) Δ AEP ~ Δ ADB ![img-0.jpeg](img-0.jpeg) | 3 |', 3, 'Similarity', 'short', 5, NULL, NULL),
  ('MQ-cda1ba-31-0', 'cda1ba', 30, '31', '| 31 | The length of the minute hand of a clock is 14 cm. Find the area swept by the minute hand in 5 minutes.(or)An umbrella has 8 ribs which are equally spaced (see Fig.). Assuming umbrella to be a flat circle of radius 45 cm, find the area between the two consecutive ribs of the umbrella. ![img-1.jpeg](img-1.jpeg) | 3 |', 3, 'Mensuration', 'short', 5, NULL, NULL),
  ('MQ-cda1ba-32-0', 'cda1ba', 31, '32', '| 32 | A fraction becomes \( \frac{9}{11} \) if 2 is added to both the numerator and the denominator.If 3 is added to both the numerator and the denominator, it becomes \( \frac{5}{6} \). Find the fraction(or)A train covered a certain distance at a uniform speed. If the train would have been 10km/h faster, it would have taken 2 hours less than the scheduled time. And, if the train were slower by 10km/h, it would have taken 3 hours more than the scheduled time. Find the distance covered by the train. | 5 |', 5, NULL, 'long', 5, NULL, NULL),
  ('MQ-cda1ba-33-0', 'cda1ba', 32, '33', '| 33 | Two poles of equal heights are standing opposite each other on either side of the road, which is 80 m wide. From a point between them on the road, the angles of elevation of the top of the poles are 60° and 30°, respectively. Find the height of the poles and the distances of the point from the poles. | | | | | | | 5 |', 5, 'Trigonometry', 'long', 6, NULL, NULL),
  ('MQ-cda1ba-34-0', 'cda1ba', 33, '34', '| 34 | Prove that the lengths of tangents drawn from an external point to a circle are equal.Also If AB, AC, PQ are tangents in below figure and AB = 5 cm, find the perimeter of ΔAPQ ![img-0.jpeg](img-0.jpeg) | | | | | | | 5 |', 5, 'Circles', 'long', 6, 'cda1ba__CBSE_X_Mat_p6_img_0_jpeg.webp', NULL),
  ('MQ-cda1ba-35-0', 'cda1ba', 34, '35', '| 35 | The mean of the following frequency table is 53. But the frequencies f1 and f2 in the classes 20–40 and 60–80 are missing. Find the missing frequencies | | | | | | | 5 |
| | Age (in years) | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 | Total | |
| | No. of people | 15 | f1 | 21 | f2 | 17 | 100 | |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-cda1ba-35-1', 'cda1ba', 35, '35', '| | (or)The distribution given below shows the number of wickets taken by bowlers in one daycricket matches. Find the mean and median of the number of wickets taken. | | | | | | | |
| | No. of wickets | 20-60 | 60-100 | 100-140 | 140-180 | 180-220 | 220-260 | |
| No. of bowlers | 7 | 5 | 16 | 12 | 2 | 3 | | |', 5, 'Statistics', 'long', 6, NULL, NULL),
  ('MQ-cda1ba-36-0', 'cda1ba', 36, '36', '| 36 | In a class the teacher asks every student to write an example of AP. Two boys Aryan and Roshan writes their progressions as -5,-2, 1,4 ... and 187, 184, 181,... respectively. Now the teacher asks the various students of the class the following questions on this progression. Help students to find the answers of the following.(i) Find the sum of common difference of the two progressions.(ii) Find the 34thterm of the progression written by Roshan.(iii) Find the sum of first 10 terms of the progression written by Aryan.(OR) | | | | | | | 112 |', 1, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-cda1ba-37-0', 'cda1ba', 37, '37', '| 37 | ![img-0.jpeg](img-0.jpeg)Vijay is trying to find the average height of a tower near his house. He is using the properties of similar triangles.The height of Vijay''s house if 20m when Vijay''s house casts a shadow 10m long on the ground. At the same time, the tower casts a shadow 50m long on the ground and the house of Ajay casts 20m shadow on the ground.(i) What is the height of the tower?(ii) What is the height of Ajay''s house?(iii) What will be the length of the shadow of the tower when Vijay''s house casts a shadow of 12m?(or)When the tower casts a shadow of 40m, same time what will be the length of the shadow of Vijay''s house? | 112 |', 1, 'Similarity', 'short', 7, 'cda1ba__CBSE_X_Mat_p7_img_0_jpeg.webp', NULL),
  ('MQ-cda1ba-38-0', 'cda1ba', 38, '38', '| 38 | On a Sunday, your Parents took you to a fair. You could see lot of toys displayed,and you wanted them to buy a RUBIK''s cube and strawberry ice-cream for you. Observe the figures and answer the questions-: ![img-1.jpeg](img-1.jpeg)(i) Find the length of the diagonal if each edge measures 6cm ?(ii)Find the volume of the solid figure if the length of the edge is 7cm?(iii)What is the surface area of hemisphere (ice cream) if the base radius is 7cm?(or)If the slant height of the conical part is 5 cm, and its radius is 4 cm, find its height. | 112 |', 1, 'Mensuration', 'short', 7, 'cda1ba__CBSE_X_Mat_p7_img_1_jpeg.webp', NULL),
  ('MQ-b2e3bc-1-0', 'b2e3bc', 0, '1', '1. Find the value of k, for which one root of the quadratic equation $$kx^2-14x+8=0$$ is six times the other.', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-b2e3bc-2-0', 'b2e3bc', 1, '2', '2. Find the tenth term of the sequence $$\sqrt{2}$$, $$\sqrt{8}$$, $$\sqrt{18}$$, ...', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-b2e3bc-3-0', 'b2e3bc', 2, '3', '3. Out of 200 bulbs in a box, 12 bulbs are defective. One bulb is taken out at random from the box. What is the probability that the drawn bulb is not defective?', 1, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-b2e3bc-4-0', 'b2e3bc', 3, '4', '4. Find the value of a, for which point P ($$\frac{a}{3}$$, 2) is the midpoint of the line segment joining the points Q (-5, 4) and R(-1, 0).', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-b2e3bc-5-0', 'b2e3bc', 4, '5', '5. If 2 is a root of the equation $$x^2+kx+12=0$$ and the equation $$x^2+kx+q=0$$ has equal roots, find the value of q.', 2, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-b2e3bc-6-0', 'b2e3bc', 5, '6', '6. How many two digit numbers are divisible by 7?', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-7-0', 'b2e3bc', 6, '7', '7. Find a relation between \( x \& y \) such that the point \( P(x, y) \) is equidistant from the points \( A(-5, 3) \) and \( B(7, 2) \).', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-8-0', 'b2e3bc', 7, '8', '8. Find the perimeter of the shaded region if ABCD is a square of side 21 cm and APB & CPD are semicircles. (Use π=22/7).', 2, 'Mensuration', 'short', 2, 'b2e3bc__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-9-0', 'b2e3bc', 8, '9', '9. A sphere of diameter 6cm is dropped in a right circular cylindrical vessel partly filled with water. The diameter of the cylindrical vessel is 12 cm. If the sphere is completely submerged in water, by how much will the level of water rise in the cylindrical vessel₹', 2, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-10-0', 'b2e3bc', 9, '10', '10. Find the number of coins of 1.5 cm diameter and 0.2 cm thickness to be melted to form a right circular cylinder of height 10 cm and diameter 4.5 cm.', 2, 'Mensuration', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-11-0', 'b2e3bc', 10, '11', '11. Solve \(\frac{1}{(a + b + x)} = \frac{1}{a} +\frac{1}{b} +\frac{1}{x},a + b\neq 0.\)', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-12-0', 'b2e3bc', 11, '12', '12. In an AP, the sum of first \( n \) terms is \( \frac{3n^2}{2} + \frac{13n}{2} \). Find the \( 25^{\text{th}} \) term.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-13-0', 'b2e3bc', 12, '13', '13. The ninth term of an AP is equal to seven times the second term and twelfth term exceeds five times the third term by 2. Find the first term and the common difference.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-b2e3bc-14-0', 'b2e3bc', 13, '14', '14. In the given figure, the radii of two concentric circles are 13 cm and 8 cm. AB is diameter of the bigger circle. BD is the tangent to the smaller circle touching it at D. Find the length AD.', 3, 'Circles', 'short', 3, 'b2e3bc__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-15-0', 'b2e3bc', 14, '15', '15. P & Q are centres of circles of radii 9 cm and 2 cm respectively. PQ= 17cm. R is the centre of the circle of radius x cm which touches the above circle externally. Given that angle PRQ is \(90^{\circ}\). Write an equation in x and solve it.', 3, 'Circles', 'short', 3, 'b2e3bc__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-16-0', 'b2e3bc', 15, '16', '16. Draw a triangle ABC in which AB=5cm, BC=6cm and angle ABC =60°. Construct a triangle whose sides are 5/7 times the corresponding sides of triangle ABC.', 3, 'Constructions', 'short', 3, NULL, NULL),
  ('MQ-b2e3bc-17-0', 'b2e3bc', 16, '17', '17. One card is drawn from a well shuffled deck of 52 cards. Find the probability of getting (a) Non face card, (b) Black king or a Red queen, (c) Spade card.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-b2e3bc-18-0', 'b2e3bc', 17, '18', '18. Find the area of shaded region shown in the given figure where a circular arc of radius 6 cm has been drawn with vertex O of an equilateral triangle OAB of side 12 cm as centre.', 3, 'Mensuration', 'short', 3, 'b2e3bc__CBSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-b2e3bc-19-0', 'b2e3bc', 18, '19', '19. Water is flowing at the rate of 0.7 m/sec through a circular pipe whose internal diameter is 2 cm into a cylindrical tank, the radius of whose base is 40 cm. Determine the increase in the level of water in half hour.', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-b2e3bc-20-0', 'b2e3bc', 19, '20', '20. The perimeters of the ends of the frustum of a cone are 207.24 cm and 169.56 cm. If the height of the frustum be 8 cm, find the whole surface area of the frustum. (Use π = 3.14)', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-b2e3bc-21-0', 'b2e3bc', 20, '21', '21. Three eighth of the students of a class opted for visiting an old age home. Sixteen students opted for having a nature walk. Square root of total number of students in the class opted for tree plantation in the school. The number of students who visited an old age home is same as the number of students who went for a nature walk and did tree plantation. Find the total number of student. What values are inculcated in students through such activities?', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-b2e3bc-22-0', 'b2e3bc', 21, '22', '22. The minimum age of children to be eligible to participate in a painting competition is 8 years. It is observed that the age of youngest boy was 8 years and the ages of rest of participants are having a common difference of 4 months. If the sum of ages of all the participants is 168 years, find the age of eldest participant in the painting competition.', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-b2e3bc-23-0', 'b2e3bc', 22, '23', '23. Prove that the lengths of the tangents drawn from an external point to a circle are equal. Using the above theorem, prove that AB+CD = AD+BC, if a quadrilateral ABCD is drawn to circumscribe a circle.', 4, 'Circles', 'long', 4, 'b2e3bc__CBSE_X_Mat_p16_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-24-0', 'b2e3bc', 23, '24', '24. Draw a pair of tangents inclined to each other at an angle of 60° to a circle of radius 3 cm.', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-b2e3bc-25-0', 'b2e3bc', 24, '25', '25. From the top of tower, 100 m high, a man observes two cars on the opposite sides of the tower with the angles of depression 30° & 45° respectively. Find the distance between the cars. (Use √3=1.73).', 4, 'Trigonometry', 'long', 4, 'b2e3bc__CBSE_X_Mat_p17_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-26-0', 'b2e3bc', 25, '26', '26. From a point on the ground, the angles of elevation of the bottom and top of a tower fixed at the top of a 20 m high building are 45° & 60° respectively. Find the height of the tower.', 4, 'Trigonometry', 'long', 4, 'b2e3bc__CBSE_X_Mat_p18_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-27-0', 'b2e3bc', 26, '27', '27. Cards marked with numbers 3, 4, 5, ..., 50 are placed in a bag and mixed thoroughly. One card is drawn at random from the bag. Find the probability that number on the card drawn is:

a. Divisible by 7.
b. A perfect square.
c. A multiple of 6', 4, 'Probability', 'long', 4, NULL, NULL),
  ('MQ-b2e3bc-28-0', 'b2e3bc', 27, '28', '28. If P(9a-2, -b) divides the line segment joining A(3a+1, -3) and B(8a, 5) in the ratio 3:1. Find the values of a & b.', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-b2e3bc-29-0', 'b2e3bc', 28, '29', '29. Find the coordinates of the points which divide the line segment joining A(2, -3) and B(-4, -6) into three equal parts.', 4, 'Coordinate Geometry', 'long', 5, NULL, NULL),
  ('MQ-b2e3bc-30-0', 'b2e3bc', 29, '30', '30. Four equal circles are described at the four corners of a square so that each touches two of the others. The shaded area enclosed between the circles is $\frac{24}{7} \text{cm}^2$. Find the radius of each circle.', 4, 'Mensuration', 'long', 5, 'b2e3bc__CBSE_X_Mat_p20_img_0_jpeg.webp', NULL),
  ('MQ-b2e3bc-31-0', 'b2e3bc', 30, '31', '31. A right triangle having sides 15 cm and 20 cm is made to revolve about its hypotenuse. Find the Volume and Surface Area of the double cone so formed. (Use $\pi=3.14$).', 4, 'Mensuration', 'long', 5, 'b2e3bc__CBSE_X_Mat_p21_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-1-0', 'd9f288', 0, '1', '1. A letter is chosen at random from the letter of the “word PROBABILITY”. Find the probability that it is a not a vowel.', 1, 'Probability', 'short', 1, NULL, NULL),
  ('MQ-d9f288-2-0', 'd9f288', 1, '2', '2. Find the 17th term from the end of the AP: 1, 6, 11, 16... 211, 216', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-d9f288-3-0', 'd9f288', 2, '3', '3. A pole 6 m high casts a shadow 2√3 m long on the ground, then find the angle of elevation of the sun.', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-d9f288-4-0', 'd9f288', 3, '4', '4. In the given figure PA and PB are tangents to a circle with centre O. If

$$\angle APB = (2x + 3)^x$$ and $$\angle AOB = (3x + 7)^x$$, then find the value of x', 1, 'Circles', 'short', 1, 'd9f288__CBSE_X_Mat_p1_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-5-0', 'd9f288', 4, '5', '5. Find the sum of all natural numbers that are less than 100 and divisible by 4.', 2, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-d9f288-6-0', 'd9f288', 5, '6', '6. Find the value of p for which the points ( -1 , 3 ) , ( 2 , p ) and ( 5 , - 1 ) are collinear.', 2, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-d9f288-7-0', 'd9f288', 6, '7', '7. Find the value(s) of k, for which the equation $$kx^2 - kx + 1 = 0$$ has equal roots.', 2, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-d9f288-8-0', 'd9f288', 7, '8', '8. Using the figure given below, prove that AR = 1/2 (perimeter of triangle ABC)', 2, 'Circles', 'short', 2, 'd9f288__CBSE_X_Mat_p2_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-9-0', 'd9f288', 8, '9', '9. P and Q are the points with co-ordinates (2, -1) and (-3, 4). Find the co-ordinates of the point R such that PR is 2/5 of PQ.', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-d9f288-10-0', 'd9f288', 9, '10', '10. In the given figure, common tangents AB and CD to the two circles intersect at E. Prove that AB = CD.', 2, 'Circles', 'short', 2, 'd9f288__CBSE_X_Mat_p2_img_1_jpeg.webp', NULL),
  ('MQ-d9f288-11-0', 'd9f288', 10, '11', '11. Solve the given equation by the method of completing the squares:

x² + 12x - 45 = 0', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-d9f288-12-0', 'd9f288', 11, '12', '12. The sum of first six terms of an A.P. is 42. The ratio of its 10th term to its 30th term is 1:3. Find the first term of the A.P.', 3, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-d9f288-13-0', 'd9f288', 12, '13', '13. From the top of a lighthouse 75 m high, the angles of depression of two ships are observed to be 30° and 45° respectively. If one ship is directly behind the other on the same side of the lighthouse then find the distance between the two ships.', 3, 'Trigonometry', 'short', 2, 'd9f288__CBSE_X_Mat_p8_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-14-0', 'd9f288', 13, '14', '14. The vertices of a triangle are A (-1, 3), B (1, -1) and C (5, 1). Find the length of the median through the vertex C.', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-d9f288-15-0', 'd9f288', 14, '15', '15. The king, queen and jack of diamond are removed from a deck of 52 playing cards and then well shuffled. Now one card is drawn at random from the remaining cards. Determine the probability that the card drawn is :

i) A face card.
ii) A red card.
iii) A king.', 3, 'Probability', 'short', 3, NULL, NULL),
  ('MQ-d9f288-16-0', 'd9f288', 15, '16', '16. Find the area of the minor segment of a circle of radius \(42\mathrm{cm}\), if the length of the corresponding arc is \(44\mathrm{cm}\).', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-d9f288-17-0', 'd9f288', 16, '17', '17. A cylindrical pipe has inner diameter of \(4\mathrm{cm}\) and water flows through it at the rate of 20 meter per minute. How long would it take to fill a conical tank of radius \(40\mathrm{cm}\) and depth \(72\mathrm{cm}\)₹', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-d9f288-18-0', 'd9f288', 17, '18', '18. In given figure, PS is the diameter of a circle of radius \(6\mathrm{cm}\). The points Q and R trisects the diameter PS. Semi circles are drawn on PQ and QS as diameters. Find the area of the shaded region.', 3, 'Mensuration', 'short', 3, 'd9f288__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-19-0', 'd9f288', 18, '19', '19. Find the number of spherical lead shots, each of diameter \(6\mathrm{cm}\) that can be made from a solid cuboid of lead having dimensions \(24\mathrm{cm} \times 22\mathrm{cm} \times 12\mathrm{cm}\).', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-d9f288-20-0', 'd9f288', 19, '20', '20. A wooden souvenir is made by scooping out a hemisphere from each end of a solid cylinder. If the height of the cylinder is \(10\mathrm{cm}\) and its base is of radius 3.5 cm then find the total cost of polishing the souvenir at the rate of Rs. 10 per \(\mathrm{cm}^2\).', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-d9f288-21-0', 'd9f288', 20, '21', '21. Draw a $\Delta$ ABC with sides BC = 5cm, AB = 6cm and AC = 7cm and then construct a triangle similar to $\Delta$ABC whose sides are $\frac{4}{7}$ of the corresponding sides of $\Delta$ABC.', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-d9f288-22-0', 'd9f288', 21, '22', '22. A train covers a distance of 90 kms at a uniform speed. It would have taken 30 minutes less if the speed had been 15 km/hr more. Calculate the original duration of the journey', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-d9f288-23-0', 'd9f288', 22, '23', '23. Cards marked with numbers 1, 3, 5... 49 are placed in a box and mixed thoroughly. One card is drawn from the box. Find the probability that the number on the card is

(i) divisible by 3
(ii) a composite number
(iii) Not a perfect square
(iv) Multiple of 3 and 5.', 4, 'Probability', 'long', 4, NULL, NULL),
  ('MQ-d9f288-24-0', 'd9f288', 23, '24', '24. In given figure, XY and PQ are two parallel tangents to a circle with centre O and another tangent AB with point of contact C intersecting XY at A and PQ at B. Prove that ∠AOB = 90°', 4, 'Circles', 'long', 4, 'd9f288__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-25-0', 'd9f288', 24, '25', '25. Solve the following quadratic equation by applying the quadratic formula:

$$p^2x^2 + (p^2 - q^2)x - q^2 = 0$$', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-d9f288-26-0', 'd9f288', 25, '26', '26. The points A ( 1 , -2 ) , B ( 2 , 3 ) , C ( k , 2 )and D ( - 4 , - 3 ) are the vertices of a parallelogram. Find the value of k and the altitude of the parallelogram corresponding to the base AB.', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-d9f288-27-0', 'd9f288', 26, '27', '27. From a point 100 m above a lake the angle of elevation of a stationary helicopter is 30° and the angle of depression of reflection of the helicopter in the lake is 60°. Find the height of the helicopter above the lake.', 4, 'Trigonometry', 'long', 4, 'd9f288__CBSE_X_Mat_p11_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-28-0', 'd9f288', 27, '28', '28. A donor agency ensures milk is supplied in containers, which are in the form of a frustum of a cone to be distributed to flood victims in a camp. The height of each frustum is 30 cm and the radii of whose lower and upper circular ends are 20 cm and 40 cm respectively. . If this milk is available at the rate of Rs.35 per litre and 880 litres of milk is needed daily for a camp.

(a) Find how many milk containers are needed daily for the camp.
(b) What daily cost will it put on the donor agency?
(c) What value of the donor agency is depicted in this situation?', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-d9f288-29-0', 'd9f288', 28, '29', '29. The radii of two concentric circles are 13 cm and 8 cm. AB is a diameter of the bigger circle and BD is tangent to the smaller circle touching it at D and intersecting the larger circle at P, on producing. Find the length of AP.', 4, 'Circles', 'long', 5, 'd9f288__CBSE_X_Mat_p12_img_0_jpeg.webp', NULL),
  ('MQ-d9f288-30-0', 'd9f288', 29, '30', '30. A manufacturer of TV sets produced 600 units in the 3rd year and 700 units in the 7th year. Assuming that, production increases uniformly by a fixed number of units every year. Find

(i) The production in 1st year.
(ii) The production in 10th year.
(iii) The total production in 7 years.', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-d9f288-31-0', 'd9f288', 30, '31', '31. 50 circular discs, each of radius 7cm and thickness 0.5cm are placed one above the other. Find the total surface area of the solid so formed. Find how much space will be left in a cubical box of side 25cm if the solid formed is placed inside it.', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-8f2711-1-0', '8f2711', 0, '1', '| **1.** | Write whether the rational number $$\frac{7}{75}$$ will have a terminating decimal expansion or a nor-terminating repeating decimal expansion. |', 1, NULL, 'short', 1, NULL, NULL),
  ('MQ-8f2711-2-0', '8f2711', 1, '2', '| **2.** | Find the value(s) of k, if the quadratic equation $$3x^2 - k\sqrt{3}x + 4 = 0$$ has equal roots. |', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-8f2711-3-0', '8f2711', 2, '3', '| **3.** | Find the eleventh term from the last term of the AP: 27, 23, 19, ..., -65. |', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-8f2711-4-0', '8f2711', 3, '4', '| **4.** | Find the coordinates of the point on y-axis which is nearest to the point (-2, 5). |', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-8f2711-5-0', '8f2711', 4, '5', '| **5.** | In given figure, ST || RQ, PS = 3 cm and SR = 4 cm. Find the ratio of the area of Δ PST to the area of Δ PRQ. |', 1, 'Similarity', 'short', 1, NULL, NULL),
  ('MQ-8f2711-6-0', '8f2711', 5, '6', '| **6.** | If $$\cos A = \frac{2}{5}$$, find the value of $$4 + 4 \tan^2 A$$ |', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-8f2711-7-0', '8f2711', 6, '7', '| 7. | If two positive integers p and q are written as p = a²b³ and q = a³b; a, b are prime numbers, then verify: LCM (p, q) × HCF (p, q) = pq |', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-8f2711-8-0', '8f2711', 7, '8', '| 8. | The sum of first n terms of an AP is given by S_{n} = 2n² + 3n. Find the sixteenth term of the AP. |', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-8f2711-9-0', '8f2711', 8, '9', '| 9. | Find the value(s) of k for which the pair of linear equations kx + y = k² and x + ky = 1 have infinitely many solutions. |', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-8f2711-10-0', '8f2711', 9, '10', '| 10. | If $$\left(1, \frac{p}{3}\right)$$ is the mid-point of the line segment joining the points (2, 0) and $$\left(0, \frac{2}{9}\right)$$, then show that the line 5x + 3y + 2 = 0 passes through the point (-1, 3p). |', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8f2711-11-0', '8f2711', 10, '11', '| 11. | A box contains cards numbered 11 to 123. A card is drawn at random from the box. Find the probability that the number on the drawn card is (i) a square number (ii) a multiple of 7 |', 2, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-8f2711-12-0', '8f2711', 11, '12', '| 12. | A box contains 12 balls of which some are red in colour. If 6 more red balls are put in the box and a ball is drawn at random, the probability of drawing a red ball doubles than what it was before. Find the number of red balls in the bag. |', 2, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-8f2711-13-0', '8f2711', 12, '13', '| 13. | Show that exactly one of the numbers n, n + 2 or n + 4 is divisible by 3. |', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-8f2711-14-0', '8f2711', 13, '14', '| 14. | Find all the zeroes of the polynomial 3x⁴ + 6x³ - 2x² - 10x - 5 if two of its zeroes are $$\sqrt{\frac{5}{3}}$$ and $$-\sqrt{\frac{5}{3}}$$. |', 3, 'Factorisation and Remainder Theorem', 'short', 2, NULL, NULL),
  ('MQ-8f2711-15-0', '8f2711', 14, '15', '| 15. | Seven times a two digit number is equal to four times the number obtained by reversing the order of its digits. If the difference of the digits is 3, determine the number. |', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-8f2711-16-0', '8f2711', 15, '16', '| 16. | In what ratio does the x-axis divide the line segment joining the points (-4, -6) and (-1, 7)? Find the co-ordinates of the point of division. **OR** The points A(4, -2), B(7, 2), C(0, 9) and D(-3, 5) form a parallelogram. Find the length of the altitude of the parallelogram on the base AB. |', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-8f2711-17-0', '8f2711', 16, '17', '| 17. | In given figure \( \angle 1 = \angle 2 \) and \( \Delta \text{NSQ} \cong \Delta \text{MTR} \), then prove that \( \Delta \text{PTS} \sim \Delta \text{PRQ} \).![img-0.jpeg](img-0.jpeg)ORIn an equilateral triangle ABC, D is a point on the side BC such that\( \text{BD} = \frac{1}{3} \text{BC} \). Prove that \( 9\text{AD}^2 = 7\text{AB}^2 \)![img-1.jpeg](img-1.jpeg) |', 3, 'Similarity', 'short', 3, '8f2711__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-8f2711-18-0', '8f2711', 17, '18', '| 18. | In given figure XY and X''Y'' are two parallel tangents to a circle with centre O and another tangent AB with point of contact C intersecting XY at A and X''Y'' at B.Prove that \( \angle \text{AOB} = 90^\circ \).![img-2.jpeg](img-2.jpeg) |', 3, 'Circles', 'short', 3, '8f2711__CBSE_X_Mat_p3_img_2_jpeg.webp', NULL),
  ('MQ-8f2711-19-0', '8f2711', 18, '19', '| 19. | Evaluate: \( \frac{\text{cosec}^2 63^\circ + \tan^2 24^\circ}{\text{cot}^2 66^\circ + \sec^2 27^\circ} + \frac{\sin^2 63^\circ + \cos 63^\circ \sin 27^\circ + \sin 27^\circ \sec 63^\circ}{2(\text{cosec}^2 65^\circ - \tan^2 25^\circ)} \)ORIf \( \sin \theta + \cos \theta = \sqrt{2} \), then evaluate: \( \tan \theta + \cot \theta \) |', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-8f2711-20-0', '8f2711', 19, '20', '| 20. | In given figure ABPC is a quadrant of a circle of radius 14 cm and a semicircle is drawn with BC as diameter. Find the area of the shaded region![img-0.jpeg](img-0.jpeg) | | | | | |', 3, 'Mensuration', 'short', 4, '8f2711__CBSE_X_Mat_p4_img_0_jpeg.webp', NULL),
  ('MQ-8f2711-21-0', '8f2711', 20, '21', '| 21. | Water in a canal, 6 m wide and 1.5 m deep, is flowing with a speed of 10 km/h. How much area will it irrigate in 30 minutes, if 8 cm of standing water is needed?ORA cone of maximum size is carved out from a cube of edge 14 cm. Find the surface area of the remaining solid after the cone is carved out. | | | | | |', 3, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-8f2711-22-0', '8f2711', 21, '22', '| 22. | Find the mode of the following distribution of marks obtained by the students in an examination: | | | | | |
| | Marks obtained | 0-20 | 20-40 | 40-60 | 60-80 | 80-100 |
| | Number of students | 15 | 18 | 21 | 29 | 17 |
| Given the mean of the above distribution is 53, using empirical relationship estimate the value of its median. | | | | | | |', 3, 'Statistics', 'short', 4, NULL, NULL),
  ('MQ-8f2711-23-0', '8f2711', 22, '23', '| 23. | A train travelling at a uniform speed for 360 km would have taken 48 minutes less to travel the same distance if its speed were 5 km/hour more. Find the original speed of the train.ORCheck whether the equation \( 5x^{2} - 6x - 2 = 0 \) has real roots and if it has, find them by the method of completing the square. Also verify that roots obtained satisfy the given equation. | | | | | |', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-8f2711-24-0', '8f2711', 23, '24', '| 24. | An AP consists of 37 terms. The sum of the three middle most terms is 225 and the sum of the last three terms is 429. Find the AP. | | | | | |', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-8f2711-25-0', '8f2711', 24, '25', '| 25. | Show that in a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.ORProve that the ratio of the areas of two similar triangles is equal to the ratio of the squares of their corresponding sides. | | | | | |', 4, 'Similarity', 'long', 4, NULL, NULL),
  ('MQ-8f2711-26-0', '8f2711', 25, '26', '| 26. | Draw a triangle ABC with side BC = 7 cm, ∠B = 45°, ∠A = 105°. Then, construct a triangle whose sides are \( \frac{4}{3} \) times the corresponding sides of ΔABC. | | | | | | | |', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-8f2711-27-0', '8f2711', 26, '27', '| 27. | Prove that \( \frac{\cos\theta - \sin\theta + 1}{\cos\theta + \sin\theta - 1} = \text{cosec}\theta + \cot\theta \) | | | | | | | |', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-8f2711-28-0', '8f2711', 27, '28', '| 28. | The angles of depression of the top and bottom of a building 50 metres high as observed from the top of a tower are 30° and 60°, respectively. Find the height of the tower and also the horizontal distance between the building and the tower. | | | | | | | |', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-8f2711-29-0', '8f2711', 28, '29', '| 29. | Two dairy owners A and B sell flavoured milk filled to capacity in mugs of negligible thickness, which are cylindrical in shape with a raised hemispherical bottom. The mugs are 14 cm high and have diameter of 7 cm as shown in given figure. Both A and B sell flavoured milk at the rate of ₹ 80 per litre. The dairy owner A uses the formula \( \pi r^{2}h \) to find the volume of milk in the mug and charges ₹ 43.12 for it. The dairy owner B is of the view that the price of actual quantity of milk should be charged. What according to him should be the price of one mug of milk? Which value is exhibited by the dairy owner B? (use \( \pi = \frac{22}{7} \))![img-0.jpeg](img-0.jpeg) | | | | | | | |', 4, 'Mensuration', 'long', 5, '8f2711__CBSE_X_Mat_p5_img_0_jpeg.webp', NULL),
  ('MQ-8f2711-30-0', '8f2711', 29, '30', '| 30. | The following distribution shows the daily pocket allowance of children of a locality. The mean pocket allowance is ₹ 18. Find the missing frequency k. | | | | | | | |
| | Daily pocket allowance (in ₹) | 11–13 | 13–15 | 15–17 | 17–19 | 19–21 | 21–23 | 23–25 |
| | Number of children | 3 | 6 | 9 | 13 | k | 5 | 4 |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-8f2711-30-1', '8f2711', 30, '30', '| | ORThe following frequency distribution shows the distance (in metres) thrown by 68 students in a Javelin throw competition. | | | | | | | |
| | Distance (in m) | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 |
| | Number of students | 4 | 5 | 13 | 20 | 14 | 8 | 4 |
| | Draw a less than type Ogive for the given data and find the median distance thrown using this curve. | | | | | | | |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-4ac516-1-0', '4ac516', 0, '1', '| 1. | Find the value of a, for which point P (\( \frac{a}{3} \), 2) is the mid-point of the line segment joining the points Q(-5,4) and R(-1,0). | 1 |', 1, 'Coordinate Geometry', 'short', 1, NULL, NULL),
  ('MQ-4ac516-2-0', '4ac516', 1, '2', '| 2. | Find the value of k, for which one root of the quadratic equation \( kx^{2}-14x+8 = 0 \) is 2. | 1 |', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-4ac516-2-1', '4ac516', 2, '2', '| | Find the value(s) of k for which the equation \( x^{2} + 5kx + 16 = 0 \) has real and equal roots. | |', 1, 'Quadratic Equations', 'short', 1, NULL, NULL),
  ('MQ-4ac516-3-0', '4ac516', 3, '3', '| 3. | Write the value of \( cot^{2}\theta - \frac{1}{sin^{2}\theta} \) | 1 |', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-4ac516-3-1', '4ac516', 4, '3', '| | If \( sin\theta = cos\theta \), then find the value of \( 2tan\theta + cos^{2}\theta \) | |', 1, 'Trigonometry', 'short', 1, NULL, NULL),
  ('MQ-4ac516-4-0', '4ac516', 5, '4', '| 4. | If nth term of an A.P. is (2n+1), what is the sum of its first three terms? | 1 |', 1, 'Arithmetic Progression', 'short', 1, NULL, NULL),
  ('MQ-4ac516-5-0', '4ac516', 6, '5', '| 5. | In figure if AD= 6cm, DB=9cm, AE = 8cm and EC = 12cm and \( \angle ADE = 48^{0} \). Find \( \angle ABC \) | 1 |', 1, 'Similarity', 'short', 1, NULL, NULL),
  ('MQ-4ac516-6-0', '4ac516', 7, '6', '| 6. | After how many decimal places will the decimal expansion of \( \frac{23}{2^{4} \times 5^{3}} \) terminate? | 1 |', 1, NULL, 'short', 1, NULL, NULL),
  ('MQ-4ac516-7-0', '4ac516', 8, '7', '| 7. | The HCF and LCM of two numbers are 9 and 360 respectively. If one number is 45, find the other number. | 2 |', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-4ac516-7-1', '4ac516', 9, '7', '| | Show that \( 7 - \sqrt{5} \) is irrational, give that \( \sqrt{5} \) is irrational. | |', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-4ac516-8-0', '4ac516', 10, '8', '| 8. | Find the \( 20^{th} \) term from the last term of the AP 3,8,13,...,253 | 2 |', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-4ac516-8-1', '4ac516', 11, '8', '| | If 7 times the \( 7^{th} \) term of an A.P is equal to 11 times its \( 11^{th} \) term, then find its \( 18^{th} \) term. | |', 2, 'Arithmetic Progression', 'short', 2, NULL, NULL),
  ('MQ-4ac516-9-0', '4ac516', 12, '9', '| 9. | Find the coordinates of the point P which divides the join of A(-2,5) and B(3,-5) in the ratio 2:3 | 2 |', 2, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-4ac516-10-0', '4ac516', 13, '10', '| 10. | A card is drawn at random from a well shuffled deck of 52 cards. Find the probability of getting neither a red card nor a queen. | 2 |', 2, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-4ac516-11-0', '4ac516', 14, '11', '| 11. | Two dice are thrown at the same time and the product of numbers appearing on them is noted. Find the probability that the product is a prime number | 2 |', 2, 'Probability', 'short', 2, NULL, NULL),
  ('MQ-4ac516-12-0', '4ac516', 15, '12', '| 12. | For what value of p will the following pair of linear equations have infinitely many solutions\( (p-3)x+3y = p \)\( px+py = 12 \) | 2 |', 2, NULL, 'short', 2, NULL, NULL),
  ('MQ-4ac516-13-0', '4ac516', 16, '13', '| 13. | Use Euclid’s Division Algorithm to find the HCF of 726 and 275. | 3 |', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-4ac516-14-0', '4ac516', 17, '14', '| 14. | Find the zeroes of the following polynomial:\( 5\sqrt{5}x^{2}+30x+8\sqrt{5} \) | 3 |', 3, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-4ac516-15-0', '4ac516', 18, '15', '| 15. | Places A and B are 80 km apart from each other on a highway. A car starts from A and another from B at the same time. If they move in same direction they meet in 8 hours and if they move towards each other they meet in 1 hour 20 minutes. Find the speed of cars. | 3 |', 3, NULL, 'short', 2, NULL, NULL),
  ('MQ-4ac516-16-0', '4ac516', 19, '16', '| 16. | The points A(1,-2), B(2,3), C (k,2) and D(-4,-3) are the vertices of a parallelogram. Find the value of k. | 3 |', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-4ac516-16-1', '4ac516', 20, '16', '| | Find the value of k for which the points (3k-1,k-2), (k,k-7) and (k-1,-k-2) are collinear. | |', 3, 'Coordinate Geometry', 'short', 2, NULL, NULL),
  ('MQ-4ac516-17-0', '4ac516', 21, '17', '| 17. | Prove that \( cot\theta - tan\theta = \frac{2cos^{2}\theta - 1}{sin\theta cos\theta} \) | 3 |', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-4ac516-17-1', '4ac516', 22, '17', '| | Prove that \( sin\theta(1 + tan\theta) + cos\theta(1 + cot\theta) = sec\theta + cosec\theta \) | |', 3, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-4ac516-18-0', '4ac516', 23, '18', '| 18. | The radii of two concentric circles are 13 cm and 8 cm. AB is a diameter of the bigger circle and BD is a tangent to the smaller circle touching it at D and intersecting the larger circle at P on producing. Find the length of AP. | 3 |', 3, 'Circles', 'short', 2, NULL, NULL),
  ('MQ-4ac516-19-0', '4ac516', 24, '19', '| 19. | In figure \( \angle 1 = \angle 2 \) and \( \Delta \text{NSQ} \cong \Delta \text{MTR} \), then prove that \( \Delta \text{PTS} \sim \Delta \text{PRQ} \).![img-0.jpeg](img-0.jpeg) | | | | | | |', 3, 'Similarity', 'short', 3, '4ac516__CBSE_X_Mat_p3_img_0_jpeg.webp', NULL),
  ('MQ-4ac516-19-1', '4ac516', 25, '19', '| | In \( \Delta \text{ABC} \), if AD is the median, then show that \( \text{AB}^{2} + \text{AC}^{2} = 2(\text{AD}^{2} + \text{BD}^{2}) \)![img-1.jpeg](img-1.jpeg) | | | | | | |', 3, 'Similarity', 'short', 3, '4ac516__CBSE_X_Mat_p3_img_1_jpeg.webp', NULL),
  ('MQ-4ac516-20-0', '4ac516', 26, '20', '| 20. | Find the area of the minor segment of a circle of radius 42cm, if length of the corresponding arc is 44cm. | | | | | | 3 |', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-4ac516-21-0', '4ac516', 27, '21', '| 21. | Water is flowing at the rate of 15 km per hour through a pipe of diameter 14cm into a rectangular tank which is 50 m long and 44 m wide. Find the time in which the level of water in the tank will rise by 21 cm. | | | | | | 3 |', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-4ac516-21-1', '4ac516', 28, '21', '| | A solid sphere of radius 3 cm is melted and then recast into small spherical balls each of diameter 0.6cm. Find the number of balls. | | | | | | |', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-4ac516-22-0', '4ac516', 29, '22', '| 22. | The table shows the daily expenditure on grocery of 25 households in a locality. Find the modal daily expenditure on grocery by a suitable method. | | | | | | 3 |
| | Daily Expenditure (in Rs.) | 100-150 | 150-200 | 200-250 | 250-300 | 300-350 | |
| | No of households | 4 | 5 | 12 | 2 | 2 | |', 3, 'Statistics', 'short', 3, NULL, NULL),
  ('MQ-4ac516-23-0', '4ac516', 30, '23', '| 23. | A train takes 2 hours less for a journey of 300km if its speed is increased by 5 km/h from its usual speed. Find the usual speed of the train. | 4 |', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-4ac516-23-1', '4ac516', 31, '23', '| \( \text{Solve for } x: \frac{1}{(a+b+x)} = \frac{1}{a} + \frac{1}{b} + \frac{1}{x}, [a \neq 0, b \neq 0, x \neq 0, x \neq -(a+b)] \) |', 4, 'Quadratic Equations', 'long', 4, NULL, NULL),
  ('MQ-4ac516-24-0', '4ac516', 32, '24', '| 24. | An AP consists of 50 terms of which \( 3^{rd} \) term is 12 and the last term is 106. Find the \( 29^{th} \) term. | 4 |', 4, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-4ac516-25-0', '4ac516', 33, '25', '| 25. | Prove that in a right angled triangle square of the hypotenuse is equal to sum of the squares of other two sides. | 4 |', 4, 'Similarity', 'long', 4, NULL, NULL),
  ('MQ-4ac516-26-0', '4ac516', 34, '26', '| 26. | Draw a \( \Delta ABC \) with sides 6cm, 8cm and 9 cm and then construct a triangle similar to \( \Delta ABC \) whose sides are \( \frac{3}{5} \) of the corresponding sides of \( \Delta ABC \). | 4 |', 4, 'Constructions', 'long', 4, NULL, NULL),
  ('MQ-4ac516-27-0', '4ac516', 35, '27', '| 27. | A man on the top of a vertical observation tower observes a car moving at a uniform speed coming directly towards it. If it takes 12 minutes for the angle of depression to change from \( 30^0 \) to \( 45^0 \), how long will the car take to reach the observation tower from this point? | 4 |', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-4ac516-27-1', '4ac516', 36, '27', '| The angle of elevation of a cloud from a point 60 m above the surface of the water of a lake is \( 30^0 \) and the angle of depression of its shadow from the same point in water of lake is \( 60^0 \). Find the height of the cloud from the surface of water. |', 4, 'Trigonometry', 'long', 4, NULL, NULL),
  ('MQ-4ac516-28-0', '4ac516', 37, '28', '| 28. | The median of the following data is 525. Find the values of x and y if the total frequency is 100. | 4 |
| Class Interval | Frequency |
| 0-100 | 2 |
| 100-200 | 5 |
| 200-300 | x |
| 300-400 | 12 |
| 400-500 | 17 |
| 500-600 | 20 |
| 600-700 | Y |
| 700-800 | 9 |
| 800-900 | 7 |
| 900-1000 | 4 |', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-4ac516-28-1', '4ac516', 38, '28', '| | The following data indicates the marks of 53 students in Mathematics. | | |
| | Marks | Number of students | |
| | 0-10 | 5 | |
| | 10-20 | 3 | |
| | 20-30 | 4 | |
| | 30-40 | 3 | |
| | 40-50 | 4 | |
| | 50-60 | 4 | |
| | 60-70 | 7 | |
| | 70-80 | 9 | |
| | 80-90 | 7 | |
| | 90-100 | 8 | |
| Draw less than type ogive for the data above and hence find the median. | | | |', 4, 'Statistics', 'long', 5, NULL, NULL),
  ('MQ-4ac516-29-0', '4ac516', 39, '29', '| 29. | The radii of circular ends of a bucket of height 24 cm are 15 cm and 5 cm. Find the area of its curved surface. | | 4 |', 4, 'Mensuration', 'long', 5, NULL, NULL),
  ('MQ-4ac516-30-0', '4ac516', 40, '30', '| 30. | If $$sec\theta + tan\theta = p$$, then find the value of $$cosec\theta$$. | | 4 |', 4, 'Trigonometry', 'long', 5, NULL, NULL),
  ('MQ-a73119-1-0', 'a73119', 0, '1', '(i) Which of the following cannot be the probability of an event?', 1, 'Probability', 'MCQ', 1, NULL, array['0.01', '3%', '16/17', '17/16']::text[]),
  ('MQ-a73119-1-1', 'a73119', 1, '1', '(ii) (sec A + tan A)(1-sin A) = ...', 1, 'Trigonometry', 'MCQ', 1, NULL, array['Sec A', 'sin A', 'cosec A', 'cos A']::text[]),
  ('MQ-a73119-1-2', 'a73119', 2, '1', '(iii) The number of tangents drawn from an external point on a circle are ______.', 1, 'Circles', 'MCQ', 1, NULL, array['two', 'three', 'three', 'infinite']::text[]),
  ('MQ-a73119-1-3', 'a73119', 3, '1', '(iv) Assertion: Point P(x, y) lies on X axis is equidistant from point A (-2, 0) & B(6, 0). Reason: Since P(2, 0) is the midpoint of A(-2, 0) & B(6, 0).', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['both assertion and reason are true and the reason is the correct explanation of assertion.', 'both assertion and reason are true and the reason is not the correct explanation of assertion.', 'assertion is true but reason is false.', 'assertion is false but reason is true.']::text[]),
  ('MQ-a73119-1-4', 'a73119', 4, '1', '(v) A rectangle ABCD made in first quadrant shows reflection in X axis in the ____.', 1, 'Coordinate Geometry', 'MCQ', 2, NULL, array['first quadrant', 'second quadrant', 'third quadrant', 'fourth quadrant.']::text[]),
  ('MQ-a73119-1-5', 'a73119', 5, '1', '(vi) If nth term of an A.P. -1, 4, 9, 14, ... is 129, then value of n is ____.', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['25', '26', '27', '28']::text[]),
  ('MQ-a73119-1-6', 'a73119', 6, '1', '(vii) If (2x-1) is a factor of 6x^3 - 3x^2 + kx - 5/2 = 0, then the value of k is ____.', 1, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['5', '-5', '1/2', '-1/2']::text[]),
  ('MQ-a73119-1-7', 'a73119', 7, '1', '(viii) The GST charged on essential food items is ____.', 1, 'GST and Banking', 'MCQ', 2, NULL, array['5%', '12%', '0%', '18%.']::text[]),
  ('MQ-a73119-1-8', 'a73119', 8, '1', '(ix) If -2 5/6 < 1/2 - 2x/3 ≤ 2, x ∈ W, then the solution set is:', 1, 'Linear Inequations', 'MCQ', 2, NULL, array['{0, 1, 2, 3, 4}', '{0, 1, 2, 3, 4, 5}', '{1, 2, 3, 4}', '{1, 2, 3, 4, 5}']::text[]),
  ('MQ-a73119-1-9', 'a73119', 9, '1', '(x) A pole 6m high casts a shadow on the ground of length ____, when the sun''s elevation is 60°.', 1, 'Trigonometry', 'MCQ', 2, NULL, array['2√3m', '6√3m', '6√2m', '6m']::text[]),
  ('MQ-a73119-1-10', 'a73119', 10, '1', '(xi) A cubical metal block of edge 22 cm is melted and recast in small cylinders of radius 2 cm and height 3.5 cm. The number of cylinders made are ____.', 1, 'Mensuration', 'MCQ', 2, NULL, array['121', '242', '363', '140']::text[]),
  ('MQ-a73119-1-11', 'a73119', 11, '1', '(xii) A person deposits ₹3000 per month in a recurring deposit account for 2 years at 9% p.a. then the interest earned in 2 years will be ____.', 1, 'GST and Banking', 'MCQ', 2, NULL, array['₹ 6750', '₹ 6570', '₹ 6075', '₹ 6705']::text[]),
  ('MQ-a73119-1-12', 'a73119', 12, '1', '(xiii) The common difference of the A.P. 1/3q, 1-6q/3q, 1-12q/3q, ... is ____.', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-1', '-2', '1', '2']::text[]),
  ('MQ-a73119-1-13', 'a73119', 13, '1', '(xiv) It is given that ΔABC ~ ΔDFE, ∠A = 30°, ∠C = 50°, AB = 5cm, AC = 8cm and DF = 7.5cm. Then the true statement is ____.', 1, 'Similarity', 'MCQ', 2, NULL, array['DE = 12 cm, ∠F = 50°', 'DE = 12 cm, ∠F = 100°', 'EF = 12 cm, ∠D = 100°', 'EF = 12 cm, ∠D = 30°']::text[]),
  ('MQ-a73119-1-14', 'a73119', 14, '1', '(xv) How many shares should a man purchase of ₹ 50 shares selling at ₹ 60 to obtain an annual income of ₹ 900, if the dividend is 15%.', 1, 'Shares and Dividends', 'MCQ', 3, NULL, array['100', '120', '140', '150']::text[]),
  ('MQ-a73119-2-0', 'a73119', 15, '2', '(a) Using ruler and compasses only :

i. Construct a \(\Delta PQR\) with \(QR = 6.5\mathrm{cm}\), \(m\angle PQR = 60^{\circ}\), \(PQ = 5\mathrm{cm}\).
ii. Construct the locus of point at a distance \(3.5\mathrm{cm}\) from point P.
iii. Construct the locus of point equidistant from PR and QR.
iv. Mark points A and B which are at a distance of \(3.5\mathrm{cm}\) from point P and equidistant from PR and QR.', 4, 'Constructions', 'long', 3, NULL, NULL),
  ('MQ-a73119-2-1', 'a73119', 16, '2', '(b) Find the equation of the line passing through the point \((-1, 2)\) and the point of intersection of the lines \(6x - 5y + 2 = 0\) and \(5x - 6y + 9 = 0\). [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-a73119-2-2', 'a73119', 17, '2', '(c) A man invested ₹ 8000 in 7%, ₹ 100 shares at ₹ 80. After a year, he sold these shares at ₹ 75 each and invested the proceeds (including his dividend) in 18%, ₹ 25 shares at ₹ 41. Find:

i. his dividend for the first year.
ii. his annual income in the second year.
iii. the \(\%\) increase in his return on his original investment. [4]', 4, 'Shares and Dividends', 'long', 3, NULL, NULL),
  ('MQ-a73119-3-0', 'a73119', 18, '3', '(a) The area of the model of an object of area 4.8 m² is 30 cm². Calculate:

i. the scale factor
ii. height of the model, if the object is \(80\mathrm{m}\) tall.
iii. volume of the object in \(\mathfrak{m}^3\) , if the volume of the model is 0.18 litre. [4]', 4, 'Similarity', 'long', 3, NULL, NULL),
  ('MQ-a73119-3-1', 'a73119', 19, '3', '(b) Use the graph paper for this question.

i. the point \(\mathrm{P}(2, -4)\) is reflected about the line \(x = 0\) to get the image Q. Find the coordinates of Q.
ii. point \(Q\) is reflected about the line \(y = 2\) to get the image R. Find the coordinates of Point R.
iii. Name the figure.
iv. find the area of figure PQR. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
