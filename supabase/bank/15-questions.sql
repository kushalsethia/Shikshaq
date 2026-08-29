set standard_conforming_strings = on;
begin;

-- questions 6501-6912 of 6912
insert into public.bank_questions
  (id, paper_id, ord, number, body, marks, chapter, qtype, page, figure, options)
values
  ('MQ-bf807b-Example 29-0', 'bf807b', 15, 'Example 29', 'Example 29: The age of a grandmother is square of her granddaughter''s age. Four years ago, she was 15 times the child''s age. Find their present ages.', NULL, 'Quadratic Equations', 'short', 29, NULL, NULL),
  ('MQ-bf807b-Example 30-0', 'bf807b', 16, 'Example 30', 'Example 30: Five years ago, a woman''s age was the square of her son''s age. Four years hence, her age will be thrice that of her son''s age. Find

(i) the age of son five years ago.

(ii) the present age of the woman.', NULL, 'Quadratic Equations', 'short', 31, NULL, NULL),
  ('MQ-bf807b-Example 31-0', 'bf807b', 17, 'Example 31', '**Example 31:** A plane travels a distance of 2400 km at a certain speed. But on the return trip due to bad weather, it reduces its speed by 50 km/h and covers the same distance in 12 minutes more than that of onward journey. Find the original speed of the plane.', NULL, 'Quadratic Equations', 'short', 32, NULL, NULL),
  ('MQ-bf807b-Example 32-0', 'bf807b', 18, 'Example 32', 'Example 32: In winter, a train travels a distance of $264\mathrm{km}$ at a certain speed. In summer, it travels $8\mathrm{km/h}$ faster than in winter and takes 22 minutes less than in winter. Find its speed in winter.', NULL, 'Quadratic Equations', 'short', 34, NULL, NULL),
  ('MQ-bf807b-Example 33-0', 'bf807b', 19, 'Example 33', 'Example 33: A boat goes $12\mathrm{km}$ downstream and returns moving upstream to the same spot after $4\frac{1}{2}$ hours. The speed of the current is $2\mathrm{km/h}$. Find the speed of the boat in still water. Solution: Let the speed of the boat in still water be $x\mathrm{km/h}$.', NULL, 'Quadratic Equations', 'short', 35, NULL, NULL),
  ('MQ-bf807b-Example 34-0', 'bf807b', 20, 'Example 34', 'Example 34: One pipe can fill a tank in 3 hours less than the other. The two pipes can fill the tank in 3 hours 36 minutes. Find the time each pipe would take to fill the tank.', NULL, 'Quadratic Equations', 'short', 37, NULL, NULL),
  ('MQ-bf807b-Example 35-0', 'bf807b', 21, 'Example 35', 'Example 35: Amrita bought some pens for ₹360. When the price of each was reduced by ₹3, she could buy 6 more pens for the same cost of ₹360. Find the original cost of the pen.', NULL, 'Quadratic Equations', 'short', 39, NULL, NULL),
  ('MQ-bf807b-Example 36-0', 'bf807b', 22, 'Example 36', 'Example 36: Some glass flower vases were bought for ₹6000. Ten were damaged during transporting. The remaining were sold for a total profit of ₹1200 by selling each for ₹60 more than what was paid for. Find the number of vases bought.', NULL, 'Quadratic Equations', 'short', 40, NULL, NULL),
  ('MQ-bf807b-Example 37-0', 'bf807b', 23, 'Example 37', 'Example 37: In an auditorium, the number of rows was equal to the number of seats in each row. When the number of rows was doubled and the number of seats in each row was reduced by 12, then the number of seats increased by 1300. How many rows were there? How many seats were there?', NULL, 'Quadratic Equations', 'short', 42, NULL, NULL),
  ('MQ-bf807b-21-0', 'bf807b', 24, '21', '21. Find the value of $k$ for which the following equation has equal roots. [2018]

$$x^2 + 4kx + (k^2 - k + 2) = 0$$', NULL, 'Quadratic Equations', 'short', 43, NULL, NULL),
  ('MQ-d045d1-1-0', 'd045d1', 0, '1', '1. Find the amount of bill for the following intra–state transaction of goods / services.
The GST rate is 5%.

| Quantity (No. of items) | MRP of each item (in ₹) | Discount % |
| --- | --- | --- |
| 18 | 150 | 10 |
| 24 | 240 | 20 |
| 30 | 100 | 30 |
| 12 | 120 | 20 |', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-2-0', 'd045d1', 1, '2', '2. Find the amount of bill for the following intra–state transaction of goods / services.

| MRP (in ₹) | 12,000 | 15,000 | 9,500 | 18,000 |
| --- | --- | --- | --- | --- |
| Discount% | 30 | 20 | 30 | 40 |
| CGST% | 6 | 9 | 14 | 2.5 |', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-3-0', 'd045d1', 2, '3', '3. The marked price of an article = ₹9,000 and rate of GST on it = 18%. A shopkeeper buys this article at a reduced price and sells it at its marked price. If the shopkeeper paid ₹162 as CGST to the government, find the amount (inclusive of GST) paid by the shopkeeper.', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-4-0', 'd045d1', 3, '4', '4. Mohit, Rajiv and Geeta live in the same city. Mohit sells an article to Rajiv for ₹50,000 and Rajiv sells the same article to Geeta at a profit of ₹6,000. If all the transactions are under GST system at the rate of 12% find:

i) the state–government tax (SGST) paid by Rajiv.
ii) the total tax received by the central–government (CGST)
iii) how much does Geeta pay for the article?', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-5-0', 'd045d1', 4, '5', '5. A shopkeeper sells an article for ₹1,770 with GST = 18%. A customer willing to buy this article, asks the shopkeeper to reduce the price of the article so that he pays only ₹1,888 including GST. If the shopkeeper agrees for this, how much reduction will the shopkeeper give?', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-6-0', 'd045d1', 5, '6', '6. The marked price of a ceiling fan is ₹3,000. A shopkeeper buys the article from a wholesaler at some discount and sells it to a consumer at the marked price. The sales are intra state and rate of GST is 18%. If the shopkeeper pays ₹135 as tax (under GST) to the state Government find:

(i) The amount of discount.
(ii) The percentage of discount.
(iii) The price inclusive of tax (under GST) of the ceiling fan which the shopkeeper paid to the wholesaler.', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-7-0', 'd045d1', 6, '7', '7. A manufacturer listed the price of his goods at ₹1,500 per article. He allowed a discount of 25% to a wholesaler who in turn allowed a discount of 20% on the listed price to a
retailer. The retailer sells one article to a consumer at a discount of 5% on the listed price. If all the sales are intrastate and the rate of GST is 5% find:

(i) The price per article inclusive of tax (under GST) which the Wholesaler pays.
(ii) The price per article inclusive of tax (under GST) which the retailer pays.
(iii) Amount which the consumer pays for the article.
(iv) The tax (under GST) paid by retailer to the central government for the article.
(v) The tax (under GST) paid by the wholesaler to the State government for the article.
(vi) The tax received by the state government.', NULL, 'GST and Banking', 'short', 1, NULL, NULL),
  ('MQ-d045d1-8-0', 'd045d1', 7, '8', '8. Ashish deposits a certain sum of money every month in a Recurring Deposit Account for a period of 12 months. If the bank pays interest at the rate of 11% p.a. and Ashish gets ₹12,715 as the maturity value of this account. What sum of money did he pay every month?', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-d045d1-9-0', 'd045d1', 8, '9', '9. Amit deposited ₹150 per month in a bank for 8 months under the Recurring Deposit Scheme. What will be the maturity value of his deposits, if the rate of interest is 8% per annum and interest is calculated at the end of every month₹', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-d045d1-10-0', 'd045d1', 9, '10', '10. Mrs. Geeta deposited ₹350 per month in a bank for 1 year and 3 months under the Recurring Deposit Scheme. If the maturity value of her deposits is ₹5,565; find the rate of interest per annum.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-d045d1-11-0', 'd045d1', 10, '11', '11. Mr. Gulati has a Recurring Deposit Account of ₹300 per month. If the rate of interest is 12% and the maturity value of this account is ₹8,100; find the time (in years) of this Recurring Deposit Account.', NULL, 'GST and Banking', 'short', 2, NULL, NULL),
  ('MQ-d045d1-12-0', 'd045d1', 11, '12', '12. The diagram represents two inequations A and B on real number lines:

i) Write down A and B in set builder notation.
ii) Represent A ∩ B and A ∩ B'' on two different number lines.', NULL, 'Linear Inequations', 'short', 2, 'd045d1__UnknownSch_p2_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-13-0', 'd045d1', 12, '13', '13. P is the solution set of 7x - 2 > 4x + 1 and Q is the solution set of 9x - 45 ≥ 5 (x - 5): where x ∈ R. Represent:

i) P ∩ Q
ii) P - Q
iii) P ∩ Q'' on different number lines', NULL, 'Linear Inequations', 'short', 2, NULL, NULL),
  ('MQ-d045d1-14-0', 'd045d1', 13, '14', '14. Solve the inequation:

$$-2\frac{1}{2} + 2x \leq \frac{4x}{5} \leq \frac{4}{3} + 2x, x \in W$$

Graph the solution set on the number line.', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-15-0', 'd045d1', 14, '15', '15. Solve the following inequation and represent the solution set on the number line.

$$-3 < -\frac{1}{2} - \frac{2x}{3} \leq \frac{5}{6}, x \in R$$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-16-0', 'd045d1', 15, '16', '16. Solve the following inequation and write the solution set:

$$13x - 5 < 15x + 4 < 7x + 12, x \in R$$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-17-0', 'd045d1', 16, '17', '17. Solve the following inequation and represent solution set on a number line.

$$-8\frac{1}{2} < -\frac{1}{2} - 4x \leq 7\frac{1}{2}, x \in I$$', NULL, 'Linear Inequations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-18-0', 'd045d1', 17, '18', '18. $\frac{2}{3}$ and 1 are the solutions of equation $mx^2 + nx + 6 = 0$. Find the values of m and n.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-19-0', 'd045d1', 18, '19', '19. The equation $3x^2 - 12x + (n - 5) = 0$ has equal roots. Find the value of n.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-20-0', 'd045d1', 19, '20', '20. Find the value of k for which the equation $3x^2 - 6x + k = 0$ has distinct and real root.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-21-0', 'd045d1', 20, '21', '21. If -1 and 3 are the roots of $x^2 + px + q = 0$, find the values of p and q.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-22-0', 'd045d1', 21, '22', '22. Solve the following equation for x and give your answer correct to 2 decimal places:

$$3x^2 + 5x - 9 = 0$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-23-0', 'd045d1', 22, '23', '23. Solve equation for x and give your answer correct to 2 decimal places:

$$4x + \frac{6}{x} + 13 = 0$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-24-0', 'd045d1', 23, '24', '24. Solve equation for x, giving your answer correct to 3 decimal places:

$$2x^2 + 11x + 4 = 0$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-25-0', 'd045d1', 24, '25', '25. Solve the following equation and give your answer correct to 3 significant figures:

$$5x^2 - 3x - 4 = 0$$', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-26-0', 'd045d1', 25, '26', '26. The sum of the squares of two consecutive natural numbers is 41. Find the numbers.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-27-0', 'd045d1', 26, '27', '27. The sum of a number and its reciprocal is 4.25. Find the number.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-28-0', 'd045d1', 27, '28', '28. The denominator of a positive fraction is one more than twice the numerator. If the sum of the fraction and its reciprocal is 2.9; find the fraction.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-29-0', 'd045d1', 28, '29', '29. A can do a piece of work in ''x'' days and B can do the same work in (x + 16) days. If both working together can do it in 15 days; calculate ''x''.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-30-0', 'd045d1', 29, '30', '30. A positive number is divided into two parts such that the sum of the squares of the two parts is 20. The square of the larger part is 8 times the smaller part. Taking ''x'' as the smaller part of the two parts, find the number.', NULL, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-d045d1-31-0', 'd045d1', 30, '31', '31. The hypotenuse of a right-angled triangle exceeds one side by 1 cm and the other side by 18 cm; find the lengths of the sides of the triangle.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-32-0', 'd045d1', 31, '32', '32. A footpath of uniform width runs round the inside of a rectangular field 32 m long and 24 m wide. If the path occupies 208 m², find the width of the footpath.', NULL, 'Mensuration', 'short', 4, NULL, NULL),
  ('MQ-d045d1-33-0', 'd045d1', 32, '33', '33. An area is paved with square tiles of a certain size and the number required is 128. If the tiles had been 2 cm smaller each way, 200 tiles would have been needed to pave the same area. Find the size of the larger tiles.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-34-0', 'd045d1', 33, '34', '34. A farmer has 70 m of fencing, with which he encloses three sides of a rectangular sheep pen; the fourth side being a wall. If the area of the pen is 600 sq.m., find the length of its shorter side.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-35-0', 'd045d1', 34, '35', '35. If the speed of a car is increased by 10 km per hr, it takes 18 minutes less to cover a distance of 36 km. Find the speed of the car.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-36-0', 'd045d1', 35, '36', '36. A girl goes to her friend''s house, which is at a distance of 12 km. She covers half of the distance at a speed of x km/hr and the remaining distance at a speed of (x + 2) km/hr. If she takes 2 hrs 30 minutes to cover the whole distance, find ''x''.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-37-0', 'd045d1', 36, '37', '37. A car made a run of 390 km in ''x'' hours. If the speed had been 4 km/hour more, it would have taken 2 hours less for the journey. Find ''x''.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-38-0', 'd045d1', 37, '38', '38. A trader bought an article for ₹x and sold it for ₹52, thereby making a profit of (x – 10) percent on his outlay. Calculate the cost price.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-39-0', 'd045d1', 38, '39', '39. The age of a father is twice the square of the age of his son. Eight years hence, the age of the father will be 4 years more than three times the age of the son. Find their present ages.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-40-0', 'd045d1', 39, '40', '40. The speed of a boat in still water is 15 km/hr, it can go 30 km upstream and return downstream to the original point in 4 hours 30 minutes. Find the speed of the stream.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-41-0', 'd045d1', 40, '41', '41. The total cost price of a certain number of identical articles is ₹4,800. By selling the articles at ₹100 each, a profit equal to the cost price of 15 articles is made. Find the number of articles bought.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-42-0', 'd045d1', 41, '42', '42. ₹6,500 was divided equally among a certain number of persons. Had there been 15 persons more, each would have got ₹30 less. Find the original number of persons.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-43-0', 'd045d1', 42, '43', '43. In an auditorium, seats were arranged in rows and columns. The number of rows was equal to the number of seats in each row. When the number of rows was doubled and the number of seats in each row was reduced by 10, the total number of seats increased by 300. Find:
 i) The number of rows in the original arrangement.
 ii) The number of seats in the auditorium after re-arrangement.', NULL, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-d045d1-44-0', 'd045d1', 43, '44', '44. Quantities a, 2, 10 and b are in continued proportion: find the values of a and b.', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-d045d1-45-0', 'd045d1', 44, '45', '45. 6 is the mean proportion between two numbers x and y and 48 is third proportion to x and y. find the numbers.', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-46-0', 'd045d1', 45, '46', '46. If $$\frac{a}{b} = \frac{c}{d}$$, show that: $$\frac{a^3c + ac^3}{b^3d + bd^3} = \frac{(a+c)^4}{(b+d)^4}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-47-0', 'd045d1', 46, '47', '47. What least number must be subtracted from each of the numbers 7, 17 and 47 so that the remainders are in continued proportion₹', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-48-0', 'd045d1', 47, '48', '48. Given four quantities a, b, c and d are in proportion. Show that:

$$(a - c) b^2 : (b - d) cd = (a^2 - b^2 - ab) : (c^2 - d^2 - cd)$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-49-0', 'd045d1', 48, '49', '49. If $$\frac{5x+6y}{5u+6v} = \frac{5x-6y}{5u-6v}$$ then prove that x : y = u : v', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-50-0', 'd045d1', 49, '50', '50. If $$a = \frac{4\sqrt{6}}{\sqrt{2} + \sqrt{3}}$$, find the value of: $$\frac{a + 2\sqrt{2}}{a - 2\sqrt{2}} + \frac{a + 2\sqrt{3}}{a - 2\sqrt{3}}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-51-0', 'd045d1', 50, '51', '51. If a, b and c are in continued proportion, prove that:

$$\frac{a^2 + b^2 + c^2}{(a + b + c)^2} = \frac{a - b + c}{a + b + c}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-52-0', 'd045d1', 51, '52', '52. Using properties of proportion, solve for x: $$\frac{3x + \sqrt{9x^2 - 5}}{3x - \sqrt{9x^2 - 5}} = 5$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-53-0', 'd045d1', 52, '53', '53. If $$\frac{a}{b} = \frac{c}{d}$$, show that: $$(a + b) : (c + d) = \sqrt{a^2 + b^2} : \sqrt{c^2 + d^2}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-54-0', 'd045d1', 53, '54', '54. If $$\frac{x}{a} = \frac{y}{b} = \frac{z}{c}$$ show that: $$\frac{x^3}{a^3} + \frac{y^3}{b^3} + \frac{z^3}{c^3} = \frac{3xyz}{abc}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-55-0', 'd045d1', 54, '55', '55. If $$\frac{7m+2n}{7m-2n} = \frac{5}{3}$$, use properties of proportion to find:

i) m : n
ii) $$\frac{m^2 + n^2}{m^2 - n^2}$$', NULL, 'Ratio and Proportion', 'short', 5, NULL, NULL),
  ('MQ-d045d1-56-0', 'd045d1', 55, '56', '56. Show that $$3x + 2$$ is a factor of $$3x^2 - x - 2$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-57-0', 'd045d1', 56, '57', '57. Find the value of k, if $$2x + 1$$ is a factor of $$(3k + 2)x^3 + (k - 1)$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-58-0', 'd045d1', 57, '58', '58. Find the values of m and n so that x - 1 and x + 2 both are factors of $$x^3 + (3m + 1)x^2 + nx - 18$$.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-59-0', 'd045d1', 58, '59', '59. What number should be subtracted from $$x^3 + 3x^2 - 8x + 14$$ so that on dividing it by x - 2, the remainder is 10₹', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-60-0', 'd045d1', 59, '60', '60. The polynomials $$2x^3 - 7x^2 + ax - 6$$ and $$x^3 - 8x^2 + (2a + 1)x - 16$$ leave the same remainder when divided by x - 2. Find the value of ''a''.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-61-0', 'd045d1', 60, '61', '61. $$(3x + 2)$$ is a factor of $$3x^3 + 2x^2 - 3x - 2$$. Hence, factorise the expression $$3x^3 + 2x^2 - 3x - 2$$ completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-62-0', 'd045d1', 61, '62', '62. Using the Remainder Theorem, factorise each of the following completely

$$4x^3 + 7x^2 - 36x - 63$$', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-63-0', 'd045d1', 62, '63', '63. Factorise the expression $$f(x) = 2x^3 - 7x^2 - 3x + 18$$', NULL, 'Factorisation and Remainder Theorem', 'short', 5, NULL, NULL),
  ('MQ-d045d1-64-0', 'd045d1', 63, '64', '64. The expression 4x³ - bx² + x - c leaves remainders 0 and 30 when divided by x + 1 and 2x - 3 respectively. Calculate the values of b and c. Hence, factorise the expression completely.', NULL, 'Factorisation and Remainder Theorem', 'short', 6, NULL, NULL),
  ('MQ-d045d1-65-0', 'd045d1', 64, '65', '65. If A = [4 -4] -3 3, B = [6 5] 3 0 and C = [2 3] -1 -2 show that AB = AC. Write the conclusion, if any, that you can draw from the result obtained above.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-66-0', 'd045d1', 65, '66', '66. If M = [1 2] 2 1 and I is a unit matrix of the same order as that of M; show that: M² = 2M + 3I.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-67-0', 'd045d1', 66, '67', '67. If A = [a 0] 0 2, B = [0 -b] 1 0, M = [1 -1] 1 1 and BA = M², find the values of ''a'' and ''b''.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-68-0', 'd045d1', 67, '68', '68. Solve for x and y [x + y x - 4] [ -1 -2 ] 2 2 = [ -7 -11 ]', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-69-0', 'd045d1', 68, '69', '69. Find the: [1 4] 2 1 × M = [13] 5

i) order of matrix M.

ii) the matrix M.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-70-0', 'd045d1', 69, '70', '70. If A = [2 1 -1] 0 1 -2 Find:

i) Aᵗ . A

ii) A. Aᵗ

Where Aᵗ is the transpose of matrix A.', NULL, 'Matrices', 'short', 6, NULL, NULL),
  ('MQ-d045d1-71-0', 'd045d1', 70, '71', '71. Evaluate: [2 cos 60° -2 sin 30°] [cot 45° cos ec 30°] -tan 45° cos 0° sec 60° sin 90°]', NULL, 'Trigonometry', 'short', 6, NULL, NULL),
  ('MQ-d045d1-72-0', 'd045d1', 71, '72', '72. Find the 12ᵗʰ term from the end in A.P. 13, 18, 23, ... 153, 158.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-73-0', 'd045d1', 72, '73', '73. If the pᵗʰ term of an A.P. is (2p + 3); find the A.P.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-74-0', 'd045d1', 73, '74', '74. If tₙ represent nᵗʰ term of an A.P., t₂ + t₅ - t₃ = 10 and t₂ + t₉ = 17, find its first term and its common difference.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-75-0', 'd045d1', 74, '75', '75. Which term of the series: 21, 18, 15, ... is -81? Can any term of this series be zero? If yes, find the number of terms.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-76-0', 'd045d1', 75, '76', '76. The sum of the 4ᵗʰ and the 8ᵗʰ terms of an A.P. is 24 and the sum of the 6ᵗʰ and the 10ᵗʰ terms of the same A.P. is 34. Find the first three terms of the A.P.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-77-0', 'd045d1', 76, '77', '77. If the third term of an A.P. is 5 and the seventh term is 9, find the 17ᵗʰ term.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-78-0', 'd045d1', 77, '78', '78. In an A.P., ten times of its tenth term is equal to thirty times of its 30ᵗʰ term. Find its 40ᵗʰ term.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-79-0', 'd045d1', 78, '79', '79. Determine the value of k for which k² + 4k + 8, 2k² + 3k + 6 and 3k² + 4k + 4 are in A.P.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-80-0', 'd045d1', 79, '80', '80. An A.P. consists of 57 terms of which 7ᵗʰ term is 13 and the last term is 108. Find the 45ᵗʰ term of this A.P.', NULL, 'Arithmetic Progression', 'short', 6, NULL, NULL),
  ('MQ-d045d1-81-0', 'd045d1', 80, '81', '81. Find the sum of 28 terms of an A.P. whose nth term is 8n – 5.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-82-0', 'd045d1', 81, '82', '82. The first term of an A.P. is 5, the last term is 45 and the sum of its terms is 1000. Find the number of terms and the common difference of the A.P.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-83-0', 'd045d1', 82, '83', '83. Find the sum of all natural numbers between 250 and 1000 which are divisible by 9.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-84-0', 'd045d1', 83, '84', '84. If the 8th term of an A.P. is 37 and the 15th term is 15 more than the 12th term, find the A.P. Also find the sum of first 20 terms of this A.P.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-85-0', 'd045d1', 84, '85', '85. The fourth term of an A.P. is 11 and the eighth term exceeds twice the fourth term by 5. Find the A.P. and the sum of first 50 terms.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-86-0', 'd045d1', 85, '86', '86. The sum of three consecutive terms of an A.P. is 21 and the sum of their squares is 165. Find these terms.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-87-0', 'd045d1', 86, '87', '87. Divide 96 into four parts which are in A.P. and the ratio between product of their means to product of their extremes is 15 : 7.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-88-0', 'd045d1', 87, '88', '88. Find five numbers in A.P. whose sum is 12 1/2 and the ratio of the first to the last terms is 2 : 3.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-89-0', 'd045d1', 88, '89', '89. Insert one arithmetic mean between 3 and 13.', NULL, 'Arithmetic Progression', 'short', 7, NULL, NULL),
  ('MQ-d045d1-90-0', 'd045d1', 89, '90', '90. Use graph paper for this question.

The points A (2, 3), B (4, 5) and C (7, 2) are the vertices of Δ ABC

i) Write down the co-ordinates of A'', B'', C'' if Δ A''B''C'' is the image of Δ ABC, when reflected in the origin.
ii) Write down the co-ordinates of A", B", C" if Δ A" B" C" is the image of ΔABC, when reflected in the x-axis.
iii) Mention the special name of the quadrilateral BCC"B" and find its area.', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-d045d1-91-0', 'd045d1', 90, '91', '91. The points P (4, 1) and Q (–2, 4) are reflected in line y = 3. Find the co-ordinates of P'', the image of P and Q'', the image of Q.', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-d045d1-92-0', 'd045d1', 91, '92', '92. The point P (5, 3) was reflected in the origin to get the image P''.

i) Write down the co-ordinates of P''.
ii) If M is the foot of the perpendicular from P to the x-axis, find the co-ordinates of M
iii) If N is the foot of the perpendicular from P'' to the x-axis, find the co-ordinates of N.
iv) Name the figure PMP''N.
v) Find the area of the figure PMP''M.', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-d045d1-93-0', 'd045d1', 92, '93', '93. The point P (2, –4) is reflected about the line x = 0 to get the image Q. Find the co-ordinates of Q.

i) The point Q is reflected about the line y = 0 to get the image R. Find the coordinates of R.
ii) Name the figure PQR.
iii) Find the area of figure PQR.', NULL, 'Coordinate Geometry', 'short', 7, NULL, NULL),
  ('MQ-d045d1-94-0', 'd045d1', 93, '94', '94. Use a graph paper for this question

Take 2 cm = 1 unit on both x and y axis

i) Plot the following points: A (0, 4), B (2, 3), C (1, 1) and D (2, 0)
ii) Reflect points B, C, D on the y-axis and write down their coordinates. Name the images as B'', C'', D'' respectively.
iii) Join the points A, B, C, D, D'', C'', B'', and A in order, so as to form a closed figure. Write down the equation of the line about which if this closed figure obtained is folded, the two parts of the figure exactly coincide.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-95-0', 'd045d1', 94, '95', '95. In what ratio is the line joining (2, -3) and (5, 6) divided by the x-axis₹', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-96-0', 'd045d1', 95, '96', '96. In what ratio is the line joining (2, -4) and (-3, 6) divided by the y-axis₹', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-97-0', 'd045d1', 96, '97', '97. The line joining the points A(-3, -10) and B (-2, 6) is divided by the point P such that $$\frac{PB}{AB} = \frac{1}{5}$$. Find the co-ordinates of P.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-98-0', 'd045d1', 97, '98', '98. Calculate the ratio in which the line joining the points (-3, -1) and (5, 7) is divided by the line x = 2. Also, find the co-ordinates of the point of intersection.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-99-0', 'd045d1', 98, '99', '99. Show that the line segment joining the points (-5, 8) and (10, -4) is trisected by the co-ordinate axes.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-100-0', 'd045d1', 99, '100', '100. A (2, 5), B (-1, 2) and C (5, 8) are the co-ordinates of the vertices of the $$\Delta$$ ABC. Points P and Q lie on AB and AC respectively, such that: AP : PB = AQ : QC = 1 : 2

i) Calculate the co-ordinates of P and Q.

ii) Show that: PQ = $$\frac{1}{3}$$ BC', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-101-0', 'd045d1', 100, '101', '101. The line joining P (-4, 5) and Q (3, 2) intersects the y-axis at point R. PM and QN are perpendiculars from P and Q on the x-axis. Find:

i) The ratio PR : RQ.
ii) The co-ordinates of R.
iii) The area of the quadrilateral PMNQ.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-102-0', 'd045d1', 101, '102', '102. In the given figure, line APB meets the x-axis at point A and y-axis at point B, P is the point (-4, 2) and AP : PB = 1 : 2. Find the co-ordinates of A and B.', NULL, 'Coordinate Geometry', 'short', 8, 'd045d1__UnknownSch_p8_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-103-0', 'd045d1', 102, '103', '103. If P (-b, 9a - 2) divides the line segment joining the points A (-3, 3a + 1) and B (5, 8a) in the ratio 3 : 1, find the values of a and b.', NULL, 'Coordinate Geometry', 'short', 8, NULL, NULL),
  ('MQ-d045d1-104-0', 'd045d1', 103, '104', '104. A (5, 3), B (-1, 1) and C (7, -3) are the vertices of triangle ABC. If L is the mid-point

of AB and M is the mid-point of AC, show that: LM = 1/2 BC', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-105-0', 'd045d1', 104, '105', '105. In the given figure, P (4, 2) is mid-point of line segment AB. Find the co-ordinates of A and B.', NULL, 'Coordinate Geometry', 'short', 9, 'd045d1__UnknownSch_p9_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-106-0', 'd045d1', 105, '106', '106. A (2, 5), B (1, 0), C (-4, 3) and D (-3, 8) are the vertices of quadrilateral ABCD. Find the co-ordinates of the mid-points of AC and BD. Give a special name to the quadrilateral.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-107-0', 'd045d1', 106, '107', '107. The points (2, -1), (-1, 4) and (-2, 2) are mid-points of the sides of a triangle. Find its vertices.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-108-0', 'd045d1', 107, '108', '108. Calculate the co-ordinates of the centroid of the triangle ABC, if A = (7, -2), B = (0, 1) and C = (-1, 4).', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-109-0', 'd045d1', 108, '109', '109. A (5, x), B (-4, 3) and C (y, -2) are the vertices of the triangle ABC whose centroid is the origin. Calculate the values of x and y.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-110-0', 'd045d1', 109, '110', '110. Show that the lines 2x + 5y = 1, x - 3y = 6 and x + 5y + 2 = 0 are concurrent.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-111-0', 'd045d1', 110, '111', '111. The line passing through (0, 2) and (-3, -1) is parallel to the line passing through (-1, 5) and (4, a). Find a.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-112-0', 'd045d1', 111, '112', '112. The line passing through (-4, -2) and (2, -3) is perpendicular to the line passing through (a, 5) and (2, -1). Find a.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-113-0', 'd045d1', 112, '113', '113. Without using the distance formula, show that the points A (4, 5), B (1, 2), C (4, 3) and D (7, 6) are the vertices of a parallelogram.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-114-0', 'd045d1', 113, '114', '114. The side AB of a square ABCD is parallel to the x-axis, find the slopes of all its sides.

Also find:

i) The slope of the diagonal AC,
ii) The slope of the diagonal BD.', NULL, 'Coordinate Geometry', 'short', 9, 'd045d1__UnknownSch_p9_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-115-0', 'd045d1', 114, '115', '115. A (5, 4), B (-3, -2) and C (1, -8) are the vertices of a triangle ABC. Find:

i) The slope of the altitude of AB
ii) The slope of the median AD and
iii) The slope of the line parallel to AC', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-116-0', 'd045d1', 115, '116', '116. The points (K, 3), (2, -4) and (-K + 1, -2) are collinear. Find K.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-117-0', 'd045d1', 116, '117', '117. The equation of a line is 3x - 4y + 12 = 0. It meets the x-axis at point A and the y-axis at point B. Find:

i) The co-ordinates of points A and B;
ii) The length of intercept AB, cut by the line within the co-ordinate axes.', NULL, 'Coordinate Geometry', 'short', 9, NULL, NULL),
  ('MQ-d045d1-118-0', 'd045d1', 117, '118', '118. The co-ordinates of two points P and Q are (2, 6) and (-3, 5) respectively. Find:

i) The gradient of PQ;
ii) The equation of PQ;
iii) The co-ordinates of the point where PQ intersects the x-axis.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-119-0', 'd045d1', 118, '119', '119. The following figure shows a parallelogram ABCD whose side AB is parallel to the x-axis, ∠A = 60° and vertex C = (7, 5). Find the equations of BC and CD.', NULL, 'Coordinate Geometry', 'short', 10, 'd045d1__UnknownSch_p10_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-120-0', 'd045d1', 119, '120', '120. A, B and C have co-ordinates (0, 3), (4, 4) and (8, 0) respectively. Find the equation of the line through A and perpendicular to BC.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-121-0', 'd045d1', 120, '121', '121. Find the equation of the line, whose x-intercept = -4 and y-intercept = 6.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-122-0', 'd045d1', 121, '122', '122. Find the equations of the lines passing through point (-2, 0) and equally inclined to the co-ordinate axes.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-123-0', 'd045d1', 122, '123', '123. The line through P(5, 3) intersects y-axis at Q.

i) Write the slope of the line.
ii) Write the equation of the line.
iii) Find the co-ordinates of Q.', NULL, 'Coordinate Geometry', 'short', 10, 'd045d1__UnknownSch_p10_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-124-0', 'd045d1', 123, '124', '124. A (1, 4), B (3, 2) and C (7, 5) are vertices of a triangle ABC. Find:

i) The co-ordinates of the centroid of triangle ABC.
ii) The equation of a line, through the centroid and parallel to AB.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-125-0', 'd045d1', 124, '125', '125. A (7, -1), B (4, 1) and C (-3, 4) are the vertices of a triangle ABC. Find the equation of a line through the vertex B and the point P in AC; such that AP : CP = 2 : 3.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-126-0', 'd045d1', 125, '126', '126. Find the value of p if the lines, whose equations are 2x - y + 5 = 0 and px + 3y = 4 are perpendicular to each other.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-127-0', 'd045d1', 126, '127', '127. If the lines y = 3x + 7 and 2y + px = 3 are perpendicular to each other, find the value of p.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-128-0', 'd045d1', 127, '128', '128. B (-5, 6) and D (1, 4) are the vertices of rhombus ABCD. Find the equations of diagonals BD and AC.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-129-0', 'd045d1', 128, '129', '129. A (1, -5), B (2, 2) and C (-2, 4) are the vertices of triangle ABC. Find the equation of:

i) The median of the triangle through A.
ii) The altitude of the triangle through B.
iii) The line through C and parallel to AB.', NULL, 'Coordinate Geometry', 'short', 10, NULL, NULL),
  ('MQ-d045d1-130-0', 'd045d1', 129, '130', '130. Match the equations A, B, C and D with the lines \( L_{1} \) , \( L_{2} \) , \( L_{3} \) and \( L_{4} \) , whose graphs are roughly drawn in the given diagram.

i) A = y = 2x;
ii) \( B = y - 2x + 2 = 0 \)
iii) \(C = 3x + 2y = 6;\)
iv) D = y = 2', NULL, 'Coordinate Geometry', 'short', 11, 'd045d1__UnknownSch_p11_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-131-0', 'd045d1', 130, '131', '131. Find the value of a for which the points A (a, 3), B (2, 1) and C (5, a) are collinear. Hence, find the equation of the line.', NULL, 'Coordinate Geometry', 'short', 11, NULL, NULL),
  ('MQ-d045d1-132-0', 'd045d1', 131, '132', '132. In the given figure, AP = 8 cm, BP = 22 cm, AQ = 12 cm and QC = 8 cm.

i) Show that \( \Delta APQ \) is similar to \( \Delta ACB \) .
ii) If PQ = 14 cm, find BC.', NULL, 'Similarity', 'short', 11, 'd045d1__UnknownSch_p11_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-133-0', 'd045d1', 132, '133', '133. Given: \( \angle GHE = \angle DFE = 90^{\circ} \) , DH = 8, DF = 12, DG = 3x - 1 and DE = 4x + 2. Find the lengths of segments DG and DE.', NULL, 'Similarity', 'short', 11, 'd045d1__UnknownSch_p11_img_2_jpeg.webp', NULL),
  ('MQ-d045d1-134-0', 'd045d1', 133, '134', '134. In \( \Delta ABC \) , \( \angle B = 90^{\circ} \) and \( BD \perp AC \) :
If AC = 9 cm and AB = 7 cm; find AD.', NULL, 'Similarity', 'short', 11, NULL, NULL),
  ('MQ-d045d1-135-0', 'd045d1', 134, '135', '135. In the figure, PQRS is a parallelogram with PQ = 16 cm and QR = 10 cm. L is a point on PR such that RL : LP = 2 : 3. QL produced meets RS at M and PS produced at N. Find the lengths of PN and RM.', NULL, 'Similarity', 'short', 11, 'd045d1__UnknownSch_p11_img_3_jpeg.webp', NULL),
  ('MQ-d045d1-136-0', 'd045d1', 135, '136', '136. In the given figure, AB // EF // DC; AB = 67.5 cm, DC = 40.5 cm and AE = 52.5 cm.

i) Name the three pairs of similar triangles
ii) Find the lengths of EC and EF.', NULL, 'Similarity', 'short', 11, 'd045d1__UnknownSch_p11_img_4_jpeg.webp', NULL),
  ('MQ-d045d1-137-0', 'd045d1', 136, '137', '137. In the given figure, P is a point on AB such that AP : PB = 4 : 3. PQ is parallel to AC

i) Calculate the ratio PQ : AC, giving reason for your answer.
ii) In triangle ARC, \( \angle ARC = 90^{\circ} \) and in triangle PQS, \( \angle PSQ = 90^{\circ} \) . Given QS = 6 cm, calculate the length of AR.', NULL, 'Similarity', 'short', 11, 'd045d1__UnknownSch_p11_img_5_jpeg.webp', NULL),
  ('MQ-d045d1-138-0', 'd045d1', 137, '138', '138. In the adjoining figure; DE // BC and D divides AB in the ratio 2 : 3.

Find:

i) \( \frac{AE}{EC} \)
ii) \( \frac{AE}{AC} \)
iii) DE, if BC = 7.5 cm.', NULL, 'Similarity', 'short', 12, 'd045d1__UnknownSch_p12_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-139-0', 'd045d1', 138, '139', '139. In the given figure; AB // EF // CD; Given that AB = 7.5 cm, EG = 2.5 cm, GC = 5 cm and DC = 9 cm. Calculate:

i) EF
ii) AC', NULL, 'Similarity', 'short', 12, 'd045d1__UnknownSch_p12_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-140-0', 'd045d1', 139, '140', '140. A line segment DE is drawn parallel to base BC of \( \Delta ABC \) which cuts AB at point D and AC at point E. If AB = 5 BD and EC = 3.2 cm, find the length of AE.', NULL, 'Similarity', 'short', 12, NULL, NULL),
  ('MQ-d045d1-141-0', 'd045d1', 140, '141', '141. The given figure shows a parallelogram ABCD. E is a point in AD and CE produced meets BA produced at point F. If AE = 4 cm, AF = 8 cm and AB = 12 cm, find the perimeter of the parallelogram ABCD.', NULL, 'Similarity', 'short', 12, 'd045d1__UnknownSch_p12_img_2_jpeg.webp', NULL),
  ('MQ-d045d1-142-0', 'd045d1', 141, '142', '142. In the given figure, O is the centre of the circle. \( \angle OAB \) and \( \angle OCB \) are \( 30^{\circ} \) and \( 40^{\circ} \) respectively. Find \( \angle AOC \) . Show your steps of working.', NULL, 'Circles', 'short', 12, 'd045d1__UnknownSch_p12_img_3_jpeg.webp', NULL),
  ('MQ-d045d1-143-0', 'd045d1', 142, '143', '143. In the following figure, O is the centre of the circle. Find the value of c.', NULL, 'Circles', 'short', 12, NULL, NULL),
  ('MQ-d045d1-144-0', 'd045d1', 143, '144', '144. In the given figure, O is the centre of the circle. If \( \angle AOB = 140^{\circ} \) and \( \angle OAC = 50^{\circ} \) , find:

i) \( \angle ACB \)
ii) \( \angle OBC \)
iii) \( \angle OAB \)
iv) \( \angle CBA \)', NULL, 'Circles', 'short', 12, 'd045d1__UnknownSch_p12_img_4_jpeg.webp', NULL),
  ('MQ-d045d1-145-0', 'd045d1', 144, '145', '145. In the figure given below, shows a circle with centre O.

Given: ∠AOC = a and ∠ABC = b

i) Find the relationship between a and b.
ii) Find the measure of angle OAB, if OABC is a parallelogram.', NULL, 'Circles', 'short', 13, 'd045d1__UnknownSch_p13_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-146-0', 'd045d1', 145, '146', '146. In the figure, given alongside, AB // CD and O is the centre of the circle. If ∠ADC = 25°; find the angle AEB. Give reasons in support of your answer.', NULL, 'Circles', 'short', 13, 'd045d1__UnknownSch_p13_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-147-0', 'd045d1', 146, '147', '147. ABCD is a cyclic quadrilateral in which AB and DC on being produced, meet at P such that PA = PD. Prove that AD is parallel to BC.', NULL, 'Circles', 'short', 13, NULL, NULL),
  ('MQ-d045d1-148-0', 'd045d1', 147, '148', '148. In the given figure, A is the centre of the circle, ABCD is a parallelogram and CDE is a straight line. Prove that: ∠BCD = 2∠ABE.', NULL, 'Circles', 'short', 13, 'd045d1__UnknownSch_p13_img_2_jpeg.webp', NULL),
  ('MQ-d045d1-149-0', 'd045d1', 148, '149', '149. In the given figure I is in the centre of a ΔABC. BI when produced meets the circumcircle of ΔABC at D. Given ∠BAC = 55° and ∠ACB = 65°. Calculate:

i) ∠DCA
ii) ∠DAC
iii) ∠DCI
iv) ∠AIC', NULL, 'Circles', 'short', 13, 'd045d1__UnknownSch_p13_img_3_jpeg.webp', NULL),
  ('MQ-d045d1-150-0', 'd045d1', 149, '150', '150. Calculate the angles x, y and z if:

$$\frac{x}{3} = \frac{y}{4} = \frac{z}{5}$$', NULL, 'Ratio and Proportion', 'short', 13, 'd045d1__UnknownSch_p13_img_4_jpeg.webp', NULL),
  ('MQ-d045d1-151-0', 'd045d1', 150, '151', '151. In the given figure, AE is the diameter of the circle. Write down the numerical value of ∠ABC + ∠CDE. Give reasons for your answer.', NULL, 'Circles', 'short', 13, 'd045d1__UnknownSch_p13_img_5_jpeg.webp', NULL),
  ('MQ-d045d1-152-0', 'd045d1', 151, '152', '152. In the given figure, the centre O of the small circle lies on the circumference of the bigger circle. If \( \angle APB = 75^{\circ} \) and \( \angle BCD = 40^{\circ} \) , find:

i) \( \angle AOB \)
ii) \( \angle ACB \)
iii) \( \angle ABD \)
iv) \( \angle ADB \)', NULL, 'Circles', 'short', 14, 'd045d1__UnknownSch_p14_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-153-0', 'd045d1', 152, '153', '153. The given figure shows a circle with centre O and \( \angle ABP = 42^{\circ} \) . Calculate the measure of:

i) \( \angle PQB \)
ii) \( \angle QPB + \angle PBQ \)', NULL, 'Circles', 'short', 14, 'd045d1__UnknownSch_p14_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-154-0', 'd045d1', 153, '154', '154. The following figure shows a circle with PR as its diameter. If PQ = 7 cm, QR = 3RS = 6 cm, find the perimeter of the cyclic quadrilateral PQRS.', NULL, 'Circles', 'short', 14, NULL, NULL),
  ('MQ-d045d1-155-0', 'd045d1', 154, '155', '155. In cyclic quadrilateral ABCD; AD = BC, \( \angle BAC = 30^{\circ} \) and \( \angle CBD = 70^{\circ} \) find:

i) \( \angle BCD \)
ii) \( \angle BCA \)
iii) \( \angle ABC \)
iv) \( \angle ADC \)', NULL, 'Circles', 'short', 14, NULL, NULL),
  ('MQ-d045d1-156-0', 'd045d1', 155, '156', '156. In the given figure, O is the centre of the circle and AB is a tangent at B. If AB = 15 cm and AC = 7.5 cm, calculate the radius of the circle.', NULL, 'Circles', 'short', 14, 'd045d1__UnknownSch_p14_img_2_jpeg.webp', NULL),
  ('MQ-d045d1-157-0', 'd045d1', 156, '157', '157. In quadrilateral ABCD; angle \( D = 90^{\circ} \) , BC = 38 cm and DC = 25 cm. A circle is inscribed in this quadrilateral which touches AB at point Q such that QB = 27 cm. Find the radius of the circle.', NULL, 'Circles', 'short', 14, NULL, NULL),
  ('MQ-d045d1-158-0', 'd045d1', 157, '158', '158. PT is a tangent to the circle at T. If \( \angle ABC = 70^{\circ} \) and \( \angle ACB = 50^{\circ} \) ; calculate:

i) \( \angle CBT \)
ii) \( \angle BAT \)
iii) \( \angle APT \)', NULL, 'Circles', 'short', 14, 'd045d1__UnknownSch_p14_img_3_jpeg.webp', NULL),
  ('MQ-d045d1-159-0', 'd045d1', 158, '159', '159. In the given figure, 3 × CP = PD = 9 cm and AP = 4.5 cm. Find BP.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-160-0', 'd045d1', 159, '160', '160. In the given figure 5 × PA = 3 × AB = 30 cm and PC = 4 cm. Find CD.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-161-0', 'd045d1', 160, '161', '161. In the given figure, tangent PT = 12.5 cm and PA = 10 cm; find AB.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_2_jpeg.webp', NULL),
  ('MQ-d045d1-162-0', 'd045d1', 161, '162', '162. In the given figure, diameter AB and chord CD of a circle meet at P. PT is a tangent to the circle at T. CD = 7.8 cm, PD = 5 cm, PB = 4 cm. Find:

i) AB.

ii) the length of tangent PT.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_3_jpeg.webp', NULL),
  ('MQ-d045d1-163-0', 'd045d1', 162, '163', '163. Tangent at P to the circumcircle of triangle PQR is drawn. If this tangent is parallel to side QR, show that ΔPQR is isosceles.', NULL, 'Circles', 'short', 15, NULL, NULL),
  ('MQ-d045d1-164-0', 'd045d1', 163, '164', '164. In the figure, ABCD is a cyclic quadrilateral with BC = CD. TC is tangent to the circle at point C and DC is produced to point G. If ∠BCG = 108° and O is the centre of the circle, find:

i) angle BCT.

ii) angle DOC.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_4_jpeg.webp', NULL),
  ('MQ-d045d1-165-0', 'd045d1', 164, '165', '165. In the adjoining figure, O is the centre of the circle and AB is a tangent to it at point B. ∠BDC = 65°. Find ∠BAO.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_5_jpeg.webp', NULL),
  ('MQ-d045d1-166-0', 'd045d1', 165, '166', '166. In the following figure, a circle is inscribed in the quadrilateral ABCD. If BC = 38 cm, QB = 27 cm, DC = 25 cm and that AD is perpendicular to DC, find the radius of the circle.', NULL, 'Circles', 'short', 15, 'd045d1__UnknownSch_p15_img_6_jpeg.webp', NULL),
  ('MQ-d045d1-167-0', 'd045d1', 166, '167', '167. In the given figure, QAP is the tangent at point A and PBD is a straight line. If ∠ACB = 36° and ∠APB = 42°, find:

i) ∠BAP
ii) ∠ABD
iii) ∠QAD
iv) ∠BCD', NULL, 'Circles', 'short', 16, 'd045d1__UnknownSch_p16_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-168-0', 'd045d1', 167, '168', '168. In the given figure, O is the centre of the circle. The tangents at B and D intersect each other at point P. If AB is parallel to CD and ∠ABC = 55°, find:

i) ∠BOD
ii) ∠BPD', NULL, 'Circles', 'short', 16, 'd045d1__UnknownSch_p16_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-169-0', 'd045d1', 168, '169', '169. Using ruler and compass only, construct a triangle ABC such that BC = 5 cm and AB = 6.5 cm and ∠ABC = 120°.

i) Construct a circumcircle of triangle ABC.
ii) Construct a cyclic quadrilateral ABCD such that D is equidistant from AB and BC.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-170-0', 'd045d1', 169, '170', '170. Use ruler and compass only for answering this question. Draw a circle of radius 4 cm. Mark the centre as O. Mark a point P outside the circle at a distance of 7 cm from the centre. Construct two tangents to the circle from the external point P. Measure and write down the length of any one tangent.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-171-0', 'd045d1', 170, '171', '171. Using ruler and compass construct a triangle ABC where AB = 3 cm, BC = 4 cm and ∠ABC = 90°. Hence construct a circle circumscribing the triangle ABC. Measure and write down the radius of the circle.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-172-0', 'd045d1', 171, '172', '172. Using ruler and compasses, construct a regular hexagon of side 4.5 cm. Hence construct a circle circumscribing the hexagon. Measure and write down the length of the circum-radius.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-173-0', 'd045d1', 172, '173', '173. Construct a triangle ABC with BC = 6.5 cm, AB = 5.5 cm, AC = 5 cm. Construct the incircle of the triangle. Measure and record the radius of the incircle.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-174-0', 'd045d1', 173, '174', '174. Draw a circle of radius 4.5 cm. Draw two tangents to this circle so that the angle between the tangents is 60°.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-175-0', 'd045d1', 174, '175', '175. Draw an inscribing circle of a regular hexagon of side 5.8 cm.', NULL, 'Constructions', 'short', 16, NULL, NULL),
  ('MQ-d045d1-176-0', 'd045d1', 175, '176', '176. The radius of a solid right circular cylinder decreases by 20% and its height increases by 10%. Find the percentage change in its;

i) volume
ii) curved surface area', NULL, 'Mensuration', 'short', 16, NULL, NULL),
  ('MQ-d045d1-177-0', 'd045d1', 176, '177', '177. Find the minimum length in cm and correct to nearest whole number of the thin metal sheet required to make a hollow and closed cylindrical box of diameter 20 cm and height 3.5 cm. Given that the width of the metal sheet is 1 m. Also, find the cost of the sheet at the rate of Rs.56 per m. Find the area of metal sheet required, if 10% of it is wasted in cutting, overlapping, etc.', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-178-0', 'd045d1', 177, '178', '178. A circular tank of diameter 2 m is dug and the earth removed is spread uniformly all around the tank to form an embankment 2 m in width and 1.6 m in height. Find the depth of the circular tank.', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-179-0', 'd045d1', 178, '179', '179. Two solid cylinders, one with diameter 60 cm and height 30 cm and the other with radius 30 cm and height 60 cm, are melted and recasted into a third solid cylinder of height 10 cm. Find the diameter of the cylinder formed.', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-180-0', 'd045d1', 179, '180', '180. A closed cylindrical tank, made of thin iron-sheet, has diameter = 8.4 m and height 5.4 m. How much metal sheet, to the nearest m², is used in making this tank, if 1/15 of the sheet actually used was wasted in making the tank₹', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-181-0', 'd045d1', 180, '181', '181. A heap of wheat is in the form of a cone of diameter 16.8 m and height 3.5 m. Find its volume. How much cloth is required to just cover the heap₹', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-182-0', 'd045d1', 181, '182', '182. A vessel, in the form of an inverted cone, is filled with water to the brim. Its height is 32 cm and diameter of the base is 25.2 cm. Six equal solid cones are dropped in it, so that they are fully submerged. As a result, one-fourth of water in the original cone overflows. What is the volume of each of the solid cones submerged₹', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-183-0', 'd045d1', 182, '183', '183. The internal and external diameters of a hollow hemispherical vessel are 21 cm and 28 cm respectively. Find:

i) Internal curved surface area
ii) External curved surface area
iii) Total surface area
iv) Volume of material of the vessel', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-184-0', 'd045d1', 183, '184', '184. The surface area of a solid sphere is increased by 21% without changing its shape. Find the percentage increase in its:

i) Radius
ii) Volume', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-185-0', 'd045d1', 184, '185', '185. The radii of the internal and external surfaces of a metallic spherical shell are 3 cm and 5 cm respectively. It is melted and recast into a solid right circular cone of height 32 cm. Find the diameter of the base of the cone.', NULL, 'Mensuration', 'short', 17, NULL, NULL),
  ('MQ-d045d1-186-0', 'd045d1', 185, '186', '186. A hemispherical bowl of internal radius 9 cm is full of liquid. This liquid is to be filled into conical shaped small containers each of diameter 3 cm and height 4 cm. how many containers are necessary to empty the bowl?', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-187-0', 'd045d1', 186, '187', '187. A solid metallic cone, with radius 6 cm and height 10 cm, is made of some heavy metal A. In order to reduce its weight, a conical hole is made in the cone as shown and it is completely filled with a lighter metal B. The conical hole has a diameter of 6 cm and depth 4 cm. calculate the ratio of the volume of metal A to the volume of the metal B in the solid.', NULL, 'Mensuration', 'short', 18, 'd045d1__UnknownSch_p18_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-188-0', 'd045d1', 187, '188', '188. The height of a solid cone is 30 cm. A small cone is cut off from the top of it such that the base of the cone cut off and the base of the given cone are parallel to each other. If the volume of the cone cut and the volume of the original cone are in the ratio 1 : 27; find the height of the remaining part of the given cone.', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-189-0', 'd045d1', 188, '189', '189. A hemi-spherical bowl has negligible thickness and the length of its circumference is 198 cm. Find the capacity of the bowl.', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-190-0', 'd045d1', 189, '190', '190. A solid metallic hemisphere of diameter 28 cm is melted and recast into a number of identical solid cones, each of diameter 14 cm and height 8 cm. Find the number of cones so formed.', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-191-0', 'd045d1', 190, '191', '191. From a solid cylinder whose height is 16 cm and radius is 12 cm, a conical cavity of height 8 cm and of base radius 6 cm is hollowed out. Find the volume and total surface area of the remaining solid.', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-192-0', 'd045d1', 191, '192', '192. A circus tent is cylindrical to a height of 8 m surmounted by a conical part. If total height of the tent is 13 m and the diameter of its base is 24 m; calculate:

i) total surface area of the tent.
ii) area of canvas, required to make this tent allowing 10% of the canvas used for folds and stitching.', NULL, 'Mensuration', 'short', 18, NULL, NULL),
  ('MQ-d045d1-193-0', 'd045d1', 192, '193', '193. A wooden toy is in the shape of a cone mounted on a cylinder as shown alongside. If the height of the cone is 24 cm, the total height of the toy is 60 cm and the radius of the base of the cone = twice the radius of the base of the cylinder = 10 cm; find the total surface area of the toy. (Take π = 3.14).', NULL, 'Mensuration', 'short', 18, 'd045d1__UnknownSch_p18_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-194-0', 'd045d1', 193, '194', '194. Prove that sec A (1 - sin A) (sec A + tan A) = 1', NULL, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-d045d1-195-0', 'd045d1', 194, '195', '195. Prove that (cosec A - sin A) (sec A - cos A) (tan A + cot A) = 1', NULL, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-d045d1-196-0', 'd045d1', 195, '196', '196. Prove that $$\frac{1}{1+\cos A} + \frac{1}{1-\cos A} = 2 \text{ cosec}^2 A$$', NULL, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-d045d1-197-0', 'd045d1', 196, '197', '197. Prove that $$\frac{cot^2 A}{(\text{cosec } A+1)^2} = \frac{1-\sin A}{1+\sin A}$$', NULL, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-d045d1-198-0', 'd045d1', 197, '198', '198. Prove that $$\sqrt{\frac{1-\sin A}{1+\sin A}} = \frac{\cos A}{1+\sin A}$$', NULL, 'Trigonometry', 'short', 18, NULL, NULL),
  ('MQ-d045d1-199-0', 'd045d1', 198, '199', '199. Prove that $$\frac{\cot A + \csc A - 1}{\cot A - \csc A + 1} = \frac{1 + \cos A}{\sin A}$$', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-200-0', 'd045d1', 199, '200', '200. Prove that $$\frac{\cos^3 A + \sin^3 A}{\cos A + \sin A} + \frac{\cos^3 A - \sin^3 A}{\cos A - \sin A} = 2$$', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-201-0', 'd045d1', 200, '201', '201. Prove that $$(1 + \tan A \tan B)^2 + (\tan A - \tan B)^2 = \sec^2 A \sec^2 B$$', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-202-0', 'd045d1', 201, '202', '202. A guard observes an enemy boat, from an observation tower at a height of 180 m above sea level, to be at an angle of depression of 29°.

i) Calculate, to the nearest metre, the distance of the boat from the foot of the observation tower.
ii) After some time, it is observed that the boat is 200 m from the foot of the observation tower. Calculate the new angle of depression.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-203-0', 'd045d1', 202, '203', '203. Two people standing on the same side of a tower in a straight line with it, measure the angles of elevation of the top of the tower as 25° and 50° respectively. If the height of the tower is 70 m, find the distance between the two people.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-204-0', 'd045d1', 203, '204', '204. The upper part of a tree, broken over by the wind, makes an angle of 45° with the ground; and the distance from the root to the point where the top of the tree touches the ground, is 15 m. What was the height of the tree before it was broken₹', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-205-0', 'd045d1', 204, '205', '205. At a particular time, when the sun''s altitude is 30°, the length of the shadow of a vertical tower is 45 m. Calculate:

i) The height of the tower
ii) The length of the shadow of the same tower, when the sun''s altitude is:

a. 45°
b. 60°', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-206-0', 'd045d1', 205, '206', '206. From the top of a cliff 92 m high, the angle of depression of a buoy is 20°. Calculate, to the nearest metre, the distance of the buoy from the foot of the cliff.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-207-0', 'd045d1', 206, '207', '207. The length of the shadow of a vertical tower on level ground increases by 10 m, when the altitude of the sun changes from 45° to 30°. Calculate the height of the tower, correct to two decimal places.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-208-0', 'd045d1', 207, '208', '208. An observer on the top of a cliff; 200 m above the sea-level, observes the angles of depression of the two ships to be 45° and 30° respectively. Find the distance between the ships, if the ships are:

i) On the same side of the cliff.
ii) On the opposite sides of the cliff.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-209-0', 'd045d1', 208, '209', '209. From a point on the ground, the angle of elevation of the top of a vertical tower is found to be such that its tangent is $$\frac{3}{5}$$. On walking 50 m towards the tower, the tangent of the new angle of elevation of the top of the tower is found to be $$\frac{4}{5}$$. Find the height of the tower.', NULL, 'Trigonometry', 'short', 19, NULL, NULL),
  ('MQ-d045d1-210-0', 'd045d1', 209, '210', '210. A vertical pole and a vertical tower are on the same level ground. From the top of the pole the angle of elevation of the top of the tower is 60° and the angle of depression of the foot of the tower is 30°. Find the height of the tower if the height of the pole is 20 m.', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-211-0', 'd045d1', 210, '211', '211. Two pillars of equal heights stand on either side of a roadway, which is 150 m wide. At a point in the roadway between the pillars the elevations of the tops of the pillars are 60° and 30°, find the height of the pillars and the position of the point.', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-212-0', 'd045d1', 211, '212', '212. A man on a cliff observes a boat, at an angle of depression \( 30^{\circ} \) , which is sailing towards the shore to the point immediately beneath him. Three minutes later, the angle of depression of the boat is found to be \( 60^{\circ} \) . Assuming that the boat sails at a uniform speed, determine:

i) How much more time it will take to reach the shore?
ii) The speed of the boat in metre per second, if the height of the cliff is 500 m.', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-213-0', 'd045d1', 212, '213', '213. An aeroplane flying horizontally 1 km above the ground and going away from the observer is observed at an elevation of \( 60^{\circ} \) . After 10 seconds, its elevation is observed to be \( 30^{\circ} \) ; find the uniform speed of the aeroplane in km per hour.', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-214-0', 'd045d1', 213, '214', '214. A vertical tower is 20 m high. A man standing at some distance from the tower knows that the cosine of the angle of elevation of the top of the tower is 0.53. How far is he standing from the foot of the tower₹', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-215-0', 'd045d1', 214, '215', '215. A 20 m high vertical pole and a vertical tower are on the same level ground in such a way that the angle of elevation of the top of the tower, as seen from the foot of the pole, is \( 60^{\circ} \) and the angle of elevation of the top of the pole as seen from the foot of the tower is \( 30^{\circ} \) . Find:

i) The height of the tower.
ii) The horizontal distance between the pole and the tower.', NULL, 'Trigonometry', 'short', 20, NULL, NULL),
  ('MQ-d045d1-216-0', 'd045d1', 215, '216', '216. The weights of 50 apples were recorded as given below. Calculate the mean weight, to the nearest gram, by the Step Deviation Method.

| Weight in grams | 80–85 | 85–90 | 90–95 | 95–100 | 100–105 | 105–110 | 110–115 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of apples | 5 | 8 | 10 | 12 | 8 | 4 | 3 |', NULL, 'Statistics', 'short', 20, NULL, NULL),
  ('MQ-d045d1-217-0', 'd045d1', 216, '217', '217. The total number of observations in the following distribution table is 120 and their mean is 50. Find the values of missing frequencies \( f_{1} \) and \( f_{2} \).

| Class | 0–20 | 20–40 | 40–60 | 60–80 | 80–100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 17 | \( f_1 \) | 32 | \( f_2 \) | 19 |', NULL, 'Statistics', 'short', 20, NULL, NULL),
  ('MQ-d045d1-218-0', 'd045d1', 217, '218', '218. The following are the marks obtained by 70 boys in a class test.

| Marks | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 80–90 | 90–100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| No. of boys | 10 | 12 | 14 | 12 | 9 | 7 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |

Calculate the mean by Short-cut Method.', NULL, 'Statistics', 'short', 20, NULL, NULL),
  ('MQ-d045d1-219-0', 'd045d1', 218, '219', '219. If the mean of the following observations is 54, find the value of p.

| Class | 0–20 | 20–40 | 40–60 | 60–80 | 80–100 |
| --- | --- | --- | --- | --- | --- |
| Frequency | 7 | p | 10 | 9 | 13 |', NULL, 'Statistics', 'short', 21, NULL, NULL),
  ('MQ-d045d1-220-0', 'd045d1', 219, '220', '220. From the following frequency distribution table, find:

| C.I. | 5–10 | 10–15 | 15–20 | 20–25 | 25–30 | 30–35 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 3 | 4 | 6 | 9 | 7 | 1 |

i) Lower quartile
ii) Upper quartile
iii) Inter-quartile range', NULL, 'Statistics', 'short', 21, NULL, NULL),
  ('MQ-d045d1-221-0', 'd045d1', 220, '221', '221. The table below shows the distribution of the scores obtained by 120 shooters in a shooting competition. Using a graph sheet, draw an ogive for the distribution.

| Score Obtained | Number of Shooters |
| --- | --- |
| 0 – 10 | 5 |
| 10 – 20 | 9 |
| 20 – 30 | 16 |
| 30 – 40 | 22 |
| 40 – 50 | 26 |
| 50 – 60 | 18 |
| 60 – 70 | 11 |
| 70 – 80 | 6 |
| 80 – 90 | 4 |
| 90 – 100 | 3 |

Use your ogive to estimate:

i) The median
ii) The interquartile range
iii) The number of shooters who obtained more than 75% scores', NULL, 'Statistics', 'short', 21, NULL, NULL),
  ('MQ-d045d1-222-0', 'd045d1', 221, '222', '222. Find the mode of the following frequency distribution:

| Class | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 |
| --- | --- | --- | --- | --- | --- | --- |
| Frequency | 4 | 7 | 9 | 11 | 6 | 2 |', NULL, 'Statistics', 'short', 21, NULL, NULL),
  ('MQ-d045d1-223-0', 'd045d1', 222, '223', '223. Use a graph paper for this question. The daily pocket expenses of 200 students in a school are given below:

Page 21 of 23
| Pocket expenses (in ₹) | 0–5 | 5–10 | 10–15 | 15–20 | 20–25 | 25–30 | 30–35 | 35–40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| No. of Students | 10 | 14 | 28 | 42 | 50 | 30 | 14 | 12 |

Draw a histogram representing the above distribution and estimate the mode from the graph.', NULL, 'Statistics', 'short', 21, NULL, NULL),
  ('MQ-d045d1-224-0', 'd045d1', 223, '224', '224. The given histogram represents the scores obtained by 25 students in a Mathematics mental test. Use the data to:

i) Frame a frequency distribution table
ii) To calculate mean
iii) To determine the Modal class', NULL, 'Statistics', 'short', 22, 'd045d1__UnknownSch_p22_img_0_jpeg.webp', NULL),
  ('MQ-d045d1-225-0', 'd045d1', 224, '225', '225. A bag contains 3 red balls, 4 blue balls and one yellow ball, all the balls being identical in shape and size. If a ball is taken out of the bag without looking into it, find the probability that the ball is:

i) yellow
ii) red
iii) not yellow
iv) neither yellow nor red', NULL, 'Probability', 'short', 22, NULL, NULL),
  ('MQ-d045d1-226-0', 'd045d1', 225, '226', '226. A bag contains twenty ₹5 coins, fifty ₹2 coins and thirty ₹1 coins. If it is equally likely that one of the coins will fall down when the bag is turned upside down, what is the probability that the coin:

i) Will be a ₹1 coin?
ii) Will not be a ₹2 coin?
iii) Will neither be a ₹5 coin nor be a ₹1 coin?', NULL, 'Probability', 'short', 22, NULL, NULL),
  ('MQ-d045d1-227-0', 'd045d1', 226, '227', '227. A game consists of spinning an arrow which comes to rest pointing at one of the numbers 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12; as shown alongside. If the outcomes are equally likely, find the probability that the pointer will point at:

i) 6
ii) an even number
iii) a prime number
iv) a number greater than 8
v) A number less than or equal to 9
vi) A number between 3 and 11', NULL, 'Probability', 'short', 22, 'd045d1__UnknownSch_p22_img_1_jpeg.webp', NULL),
  ('MQ-d045d1-228-0', 'd045d1', 227, '228', '228. A bag contains 100 identical marble stones which are numbered from 1 to 100. If one stone is drawn at random from the bag, find the probability that it bears:

i) A perfect square number
ii) A number divisible by 4
iii) A number divisible by 5
iv) A number divisible by 4 or 5
v) A number divisible by 4 and 5', NULL, 'Probability', 'short', 23, NULL, NULL),
  ('MQ-d045d1-229-0', 'd045d1', 228, '229', '229. Three coins are tossed together. Write all the possible outcomes. Now, find the probability of getting:

i) Exactly two heads
ii) At least two heads
iii) Atmost two heads
iv) All tails
v) At least one tail', NULL, 'Probability', 'short', 23, NULL, NULL),
  ('MQ-d045d1-230-0', 'd045d1', 229, '230', '230. Offices in Delhi are open for five days in a week (Monday to Friday). Two employees of an office remain absent for one day in the same particular week. Find the probability that they remain absent on:

i) The same day
ii) Consecutive day
iii) Different days', NULL, 'Probability', 'short', 23, NULL, NULL),
  ('MQ-d045d1-231-0', 'd045d1', 230, '231', '231. A box contains some black balls and 30 white balls. If the probability of drawing a black ball is two-fifths of a white ball; find the number of black balls in the box.', NULL, 'Probability', 'short', 23, NULL, NULL),
  ('MQ-d045d1-232-0', 'd045d1', 231, '232', '232. Sixteen cards are labelled as a, b, c, ... m. n. o. p. They are put in a box and shuffled. A boy is asked to draw a card from the box. What is the probability that the card drawn is:

i) A vowel
ii) A consonant
iii) None of the letters of the word median', NULL, 'Probability', 'short', 23, NULL, NULL),
  ('MQ-d20e5b-1-0', 'd20e5b', 0, '1', '1. $$\frac{\text{cosec } \theta}{\tan \theta + \cot \theta}$$ is equal to', NULL, 'Trigonometry', 'MCQ', 1, NULL, array['$$\cos \theta$$', '$$\sin \theta$$', '$$\tan \theta$$', '$$\cot \theta$$']::text[]),
  ('MQ-d20e5b-2-0', 'd20e5b', 1, '2', '2. If $$(3x + k)$$, $$(2x + 9)$$ and $$(x + 13)$$ are 3 consecutive terms of an Arithmetic Progression (A.P.), then the value of k is:', NULL, 'Arithmetic Progression', 'MCQ', 1, NULL, array['5', '13', '31', '- 5']::text[]),
  ('MQ-d20e5b-3-0', 'd20e5b', 2, '3', '3. In the given diagram O is the centre of the circles and $$\angle BCD = 140^{\circ}$$. The degree measure of x is', NULL, 'Circles', 'MCQ', 1, 'd20e5b__UnknownSch_p1_img_0_jpeg.webp', array['$$130^{\circ}$$', '$$45^{\circ}$$', '$$70^{\circ}$$', '$$50^{\circ}$$']::text[]),
  ('MQ-d20e5b-4-0', 'd20e5b', 3, '4', '4. If $$[3 \quad 5] \begin{bmatrix} -7 & 4 \\ 8 & 3 \end{bmatrix} = X$$. The order of matrix ''X'' is:', NULL, 'Matrices', 'MCQ', 1, NULL, array['$$2 \times 1$$', '$$1 \times 2$$', '$$2 \times 2$$', '$$1 \times 1$$']::text[]),
  ('MQ-d20e5b-5-0', 'd20e5b', 4, '5', '5. The point B (0, 5) is invariant under reflection in:', NULL, 'Coordinate Geometry', 'MCQ', 1, NULL, array['x - axis', 'y - axis', 'origin', 'y = 2']::text[]),
  ('MQ-d20e5b-6-0', 'd20e5b', 5, '6', '6. The price of a sofa - set is ₹ 50,000. If the GST is chargeable at the rate of 28%, then the State GST (SGST) share is:', NULL, 'GST and Banking', 'MCQ', 1, NULL, array['₹ 43,000', '₹ 14,000', '₹ 7,000', '₹ 700']::text[]),
  ('MQ-d20e5b-7-0', 'd20e5b', 6, '7', '7. 3, 9, m, 81 and n are in continued proportion. The values of m and n are:', NULL, 'Ratio and Proportion', 'MCQ', 1, NULL, array['m = 27, n = 243', 'm = 3, n = 27', 'm = 1, n = 3', 'm = 243, n = 1']::text[]),
  ('MQ-d20e5b-8-0', 'd20e5b', 7, '8', '8. In the given diagram the $$\Delta$$ MLN is similar to $$\Delta$$RQS by the axiom:', NULL, 'Similarity', 'MCQ', 1, 'd20e5b__UnknownSch_p1_img_1_jpeg.webp', array['SSS', 'AAA', 'RHS', 'SAS']::text[]),
  ('MQ-d20e5b-9-0', 'd20e5b', 8, '9', '9. Find the value of the remainder when $$4x^3 + 6x^2 - 8x - 10$$ is divided by $$(2x + 1)$$:', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['- 5', '- 4', '5', '4']::text[]),
  ('MQ-d20e5b-10-0', 'd20e5b', 9, '10', '10. The discriminant of the quadratic equation $$2x^2 + 6x + 3 = 0$$ is:', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['Negative', 'Zero', 'Positive', 'Infinite']::text[]),
  ('MQ-d20e5b-11-0', 'd20e5b', 10, '11', '11. The CGST paid by Samaira to the shopkeeper for a watch which is priced at ₹3,500 is ₹175. The rate of GST charged is:', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['1.5%', '3%', '5%', '10%']::text[]),
  ('MQ-d20e5b-12-0', 'd20e5b', 11, '12', '12. A solid cylinder of radius 3 cm and height 8 cm is melted and formed into a cone of radius 6 cm. The height of the cone is:', NULL, 'Mensuration', 'MCQ', 2, NULL, array['3 cm', '6 cm', '9 cm', '8 cm']::text[]),
  ('MQ-d20e5b-13-0', 'd20e5b', 12, '13', '13. Omkar and Neha play a badminton game. If the probability of Omkar winning the match is 0.75, the probability of Neha winning the match is:', NULL, 'Probability', 'MCQ', 2, NULL, array['1', '0', '0.75', '0.25']::text[]),
  ('MQ-d20e5b-14-0', 'd20e5b', 13, '14', '14. The midpoint P of line joining A (3, 5) and B (x, y) is (2, 3). The co-ordinates of B (x, y):', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['(5, 2)', '(1, 1)', '(-2, -2)', '(2, 3)']::text[]),
  ('MQ-d20e5b-15-0', 'd20e5b', 14, '15', '15. The solution set for the given inequation is:
$$2 \leq 3(x - 2) + 5 < 8, x \in W$$', NULL, 'Linear Inequations', 'MCQ', 2, NULL, array['(1, 2)', '(2, 3, 4, 5)', '(6, 7, 8)', '(0, 1, 2)']::text[]),
  ('MQ-d20e5b-16-0', 'd20e5b', 15, '16', '16. In intra state transaction, if the rate of GST is 18%, then the shares of central and state governments respectively are:', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['18%, 0%', '9%, 9%', '0%, 18%', '8%, 10%']::text[]),
  ('MQ-d20e5b-17-0', 'd20e5b', 16, '17', '17. Recurring deposit account is also known as:', NULL, 'GST and Banking', 'MCQ', 2, NULL, array['cumulative deposit account', 'savings bank account', 'current account', 'none of the above']::text[]),
  ('MQ-d20e5b-18-0', 'd20e5b', 17, '18', '18. If the replacement set is the set of whole numbers, then solution set of 12 - x ≥ 3x - 2 is:', NULL, 'Linear Inequations', 'MCQ', 2, NULL, array['(0,1,2,3,5)', '(1,2,3,3,5)', '(1,2,3)', '(0,1,2,3)']::text[]),
  ('MQ-d20e5b-19-0', 'd20e5b', 18, '19', '19. A quadratic equation ax² + bx + c = 0 has equal roots if:', NULL, 'Quadratic Equations', 'MCQ', 2, NULL, array['b² = ac', 'b² > ac', 'b² < ac', 'b² = 4ac']::text[]),
  ('MQ-d20e5b-20-0', 'd20e5b', 19, '20', '20. The mean proportional between 4 and 16 is:', NULL, 'Ratio and Proportion', 'MCQ', 2, NULL, array['0.25', '8', '64', '20']::text[]),
  ('MQ-d20e5b-21-0', 'd20e5b', 20, '21', '21. If (x - a) is a factor of a polynomial f(x), then:', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 2, NULL, array['f(a) = 0', 'f(-a) = 0', 'f(a) = 1', 'f(a) = -1']::text[]),
  ('MQ-d20e5b-22-0', 'd20e5b', 21, '22', '22. Which of the statement/s is/are true for three matrices A, B and C with respect to their orders in multiplication?', NULL, 'Matrices', 'MCQ', 2, NULL, array['A_m×n × B_n×p = C_m×p', 'B_n×p × C_p×m = A_n×m', 'C_p×m × A_m×n = B_p×n', 'All the above']::text[]),
  ('MQ-d20e5b-23-0', 'd20e5b', 22, '23', '23. The common difference of the A.P. 0, -3, -6, -9...is:', NULL, 'Arithmetic Progression', 'MCQ', 2, NULL, array['3', '0', '-9', '-3']::text[]),
  ('MQ-d20e5b-24-0', 'd20e5b', 23, '24', '24. Which of the following graph is used to find the upper quartile of a grouped data?', NULL, 'Statistics', 'MCQ', 3, NULL, array['Histogram', 'Ogive', 'Frequency polygon', 'Bar graph']::text[]),
  ('MQ-d20e5b-25-0', 'd20e5b', 24, '25', '25. The class size of the second class in 0–10, 10–20, 20–30...is:', NULL, 'Statistics', 'MCQ', 3, NULL, array['9', '5', '11', '10']::text[]),
  ('MQ-d20e5b-26-0', 'd20e5b', 25, '26', '26. Inter-quartile range of a grouped data is always:', NULL, 'Statistics', 'MCQ', 3, NULL, array['greater than 0', 'less than 0', 'either 0 or 1', 'any one of the above']::text[]),
  ('MQ-d20e5b-27-0', 'd20e5b', 26, '27', '27. A die is thrown once. The probability of getting a number between 2 and 6 is:', NULL, 'Probability', 'MCQ', 3, NULL, array['2', '0', '$\frac{5}{6}$', '$\frac{1}{2}$']::text[]),
  ('MQ-d20e5b-28-0', 'd20e5b', 27, '28', '28. Which of the following cannot be the probability of an event?', NULL, 'Probability', 'MCQ', 3, NULL, array['$\frac{1}{100}$', '99%', '1', '$\frac{10}{9}$']::text[]),
  ('MQ-d20e5b-29-0', 'd20e5b', 28, '29', '29. If $\frac{a}{b} = \frac{c}{d}$, then using dividendo we get,', NULL, 'Ratio and Proportion', 'MCQ', 3, NULL, array['$\frac{a-b}{b} = \frac{c-d}{d}$', '$\frac{a}{a+b} = \frac{c}{c+d}$', '$\frac{a}{c} = \frac{b}{d}$', '$\frac{a+b}{a-b} = \frac{c+d}{c-d}$']::text[]),
  ('MQ-d20e5b-30-0', 'd20e5b', 29, '30', '30. An identity matrix of order $2 \times 2$ is', NULL, 'Matrices', 'MCQ', 3, NULL, array['$\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$', '$\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$', '$\begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}$', '$\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$']::text[]),
  ('MQ-d20e5b-31-0', 'd20e5b', 30, '31', '31. The point A (4, -5) is reflected in the origin to point A''. The Point A'' is then reflected in x-axis to the point A''''. Therefore, the coordinates of A'''' are', NULL, 'Coordinate Geometry', 'MCQ', 3, NULL, array['(-4, -5)', '(4, 5)', '(-4, 5)', '(4, -5)']::text[]),
  ('MQ-d20e5b-32-0', 'd20e5b', 31, '32', '32. If a number ''x'' is chosen from the numbers 1, 2, 3 and number ''y'' is selected from the numbers 1, 4, 9, then probability of xy < 9 is', NULL, 'Probability', 'MCQ', 3, NULL, array['$\frac{3}{9}$.', '$\frac{4}{9}$.', '$\frac{1}{9}$', '$\frac{5}{9}$']::text[]),
  ('MQ-d20e5b-33-0', 'd20e5b', 32, '33', '33. In the given figure, O is the centre of the circle. If $\angle COB = 30^\circ$, $\angle AOB = 60^\circ$, then $\angle ADC =$', NULL, 'Circles', 'MCQ', 3, 'd20e5b__UnknownSch_p3_img_0_jpeg.webp', array['$30^\circ$', '$60^\circ$', '$90^\circ$', '$45^\circ$']::text[]),
  ('MQ-d20e5b-34-0', 'd20e5b', 33, '34', '34. If y - intercept and inclination of a line are 6 and $45^\circ$ respectively, then the equation of a line is:', NULL, 'Coordinate Geometry', 'MCQ', 3, NULL, array['x - y + 6 = 0', '- x - y + 6 = 0', 'y - x + 6 = 0', 'x + y + 6 = 0']::text[]),
  ('MQ-d20e5b-35-0', 'd20e5b', 34, '35', '35. If $\sum fx = 170$ and $\sum f = 25$, then the mean $\bar{x} =$
Page 3 of 6', NULL, 'Statistics', 'MCQ', 3, NULL, array['19.5', '15.0', '6.80', '68.0']::text[]),
  ('MQ-d20e5b-36-0', 'd20e5b', 35, '36', '36. (1 - sin A) (1 + sin A) (1 + tan²A) is equal to:', NULL, 'Trigonometry', 'MCQ', 4, NULL, array['-1', '1', 'sec²A', 'cos²A']::text[]),
  ('MQ-d20e5b-37-0', 'd20e5b', 36, '37', '37. The solution set for the given inequation is: -6 < 2x < 6, where x ∈ I', NULL, 'Linear Inequations', 'MCQ', 4, NULL, array['{-3, -2, -1, 0, 1, 2, 3}', '{-2, -1, -0, 1, 2}', '{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5}', '{-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6}']::text[]),
  ('MQ-d20e5b-38-0', 'd20e5b', 37, '38', '38. If in two triangles ABC and PQR, $$\frac{AB}{QR} = \frac{BC}{RP} = \frac{AC}{QP}$$ then', NULL, 'Similarity', 'MCQ', 4, NULL, array['ΔPQR ~ ΔABC', 'ΔPQR ~ ΔCAB', 'ΔCBA ~ ΔPQR', 'ΔBCA ~ ΔPQR']::text[]),
  ('MQ-d20e5b-39-0', 'd20e5b', 38, '39', '39. Volume and surface area of a solid hemisphere are numerically equal. Then the diameter of the hemisphere, is:', NULL, 'Mensuration', 'MCQ', 4, NULL, array['2 units', '4.5 units', '9 units', '3units']::text[]),
  ('MQ-d20e5b-40-0', 'd20e5b', 39, '40', '40. If ax - 3y = -12 and 2x - 3y = 3 are parallel to each other, then the value of ''a'' is:', NULL, 'Coordinate Geometry', 'MCQ', 4, NULL, array['2', '3', '-2', '-3']::text[]),
  ('MQ-d20e5b-41-0', 'd20e5b', 40, '41', '41. Sarah deposited ₹1,000 for 2 years in a Recurring deposit account and receives ₹25,500 as maturity value. The interest earned in 2 years is:', NULL, 'GST and Banking', 'MCQ', 4, NULL, array['₹13,500', '₹3,000', '₹24,000', '₹1,500']::text[]),
  ('MQ-d20e5b-42-0', 'd20e5b', 41, '42', '42. Which of the following equations has 2 as a root?', NULL, 'Quadratic Equations', 'MCQ', 4, NULL, array['x² - 4x + 5 = 0', 'x² + 3x - 12 = 0', 'x² + 5x - 14 = 0', '3x² - 6x - 2 = 0']::text[]),
  ('MQ-d20e5b-43-0', 'd20e5b', 42, '43', '43. The selling price of an article excluding GST is ₹800. If rate of GST is 12%, then the total price of the article is:', NULL, 'GST and Banking', 'MCQ', 4, NULL, array['₹704', '₹96', '₹896', '₹848']::text[]),
  ('MQ-d20e5b-44-0', 'd20e5b', 43, '44', '44. If $$\begin{bmatrix} x+2 & y+3 \\ 9 & 0 \end{bmatrix} = \begin{bmatrix} 6 & -1 \\ 9 & 0 \end{bmatrix}$$ then the value of x - y is', NULL, 'Matrices', 'MCQ', 4, NULL, array['8', '0', '12', '-8']::text[]),
  ('MQ-d20e5b-45-0', 'd20e5b', 44, '45', '45. If 2, k, 8 are in AP, then find the value of ''k''', NULL, 'Arithmetic Progression', 'MCQ', 4, NULL, array['4', '±4', '5', '6']::text[]),
  ('MQ-d20e5b-46-0', 'd20e5b', 45, '46', '46. Shree deposited ₹800 per month in a bank for one and half years under the recurring deposit scheme. If the rate of interest is 10% per annum, the interest earned by him:', NULL, 'GST and Banking', 'MCQ', 4, NULL, array['₹1,040', '₹2,000', '₹520', '₹1,140']::text[]),
  ('MQ-d20e5b-47-0', 'd20e5b', 46, '47', '47. The smallest value of x of the inequation 25 - 4x ≤ 16, X ∈ W is.', NULL, 'Linear Inequations', 'MCQ', 4, NULL, array['2', '2.25', '3', '2.75']::text[]),
  ('MQ-d20e5b-48-0', 'd20e5b', 47, '48', '48. When 6x³ + 2x² - x + 2 is divided by (x + 2), then remainder is', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 4, NULL, array['56', '36', '44', '-36']::text[]),
  ('MQ-d20e5b-49-0', 'd20e5b', 48, '49', '49. Which term of the A.P. 4, 9, 14, 19, ... is 79?', NULL, 'Arithmetic Progression', 'MCQ', 5, NULL, array['15th', '16th', '14th', '18th']::text[]),
  ('MQ-d20e5b-50-0', 'd20e5b', 49, '50', '50. If the lines 2x + 3y - 7 = 0 and 4y - px - 12 = 0 are perpendicular to each other, then the value of p is', NULL, 'Coordinate Geometry', 'MCQ', 5, NULL, array['6', '-8/3', '-6', '3/8']::text[]),
  ('MQ-d20e5b-51-0', 'd20e5b', 50, '51', '51. The points which divides the line segment joining the points (7, -6) and (3, 4) in the ration 1 : 2 internally lies in the', NULL, 'Coordinate Geometry', 'MCQ', 5, NULL, array['Ist quadrant', 'IInd Quadrant', 'IIIrd quadrant', 'IVth quadrant']::text[]),
  ('MQ-d20e5b-52-0', 'd20e5b', 51, '52', '52. If two solid hemisphere of same base radius ''r'' are joined together along with their bases, then the curved surface of this new solid is.', NULL, 'Mensuration', 'MCQ', 5, NULL, array['4πr².', '6πr²', '3πr²', '8πr²']::text[]),
  ('MQ-d20e5b-53-0', 'd20e5b', 52, '53', '53. (sec A + tan A) (1 - sin A) is equal to', NULL, 'Trigonometry', 'MCQ', 5, NULL, array['sec A', 'sin A', 'cosec A', 'cos A']::text[]),
  ('MQ-d20e5b-54-0', 'd20e5b', 53, '54', '54. The top of a broken tree has its top touching the ground (shown in the given figure) at a distance of 10 m from the bottom. If the angle made by the broken part with ground is 30°, then the length of the broken part is', NULL, 'Trigonometry', 'MCQ', 5, 'd20e5b__UnknownSch_p5_img_0_jpeg.webp', array['10√3 m', '20/√3 m', '20 m']::text[]),
  ('MQ-d20e5b-55-0', 'd20e5b', 54, '55', '55. In the given figure, the bottom of the glass has a hemispherical raised portion. If the glass is filled with orange juice, the quantity of juice which a person will get is', NULL, 'Mensuration', 'MCQ', 5, NULL, array['135 π cm³', '117 π cm³', '199 π cm³', '36 π cm³']::text[]),
  ('MQ-d20e5b-56-0', 'd20e5b', 55, '56', '56. If P(E) = 0.07, then what is the P(E̅)', NULL, 'Probability', 'MCQ', 5, NULL, array['0.93', '0.95', '0.89', '0.90']::text[]),
  ('MQ-d20e5b-57-0', 'd20e5b', 56, '57', '57. Given [a b c d] X = [p q] the order of matrix X is:', NULL, 'Matrices', 'MCQ', 5, NULL, array['2 × 2', '1 × 2', '2 × 1', '1 × 1']::text[]),
  ('MQ-d20e5b-58-0', 'd20e5b', 57, '58', '58. The nth term of an A.P. is (3n + 1). Sum of the first 10 terms of this A.P. is', NULL, 'Arithmetic Progression', 'MCQ', 5, NULL, array['350', '175', '-95', '70']::text[]),
  ('MQ-d20e5b-59-0', 'd20e5b', 58, '59', '59. The solution set for the linear inequation -8 ≤ x - 7 < -4, x ∈ I is', NULL, 'Linear Inequations', 'MCQ', 5, 'd20e5b__UnknownSch_p5_img_1_jpeg.webp', array['{x: x ∈ R, -1 ≤ x < 3}', '{0, 1, 2, 3}', '{-1, 0, 1, 2, 3}', '{-1, 0, 1, 2}']::text[]),
  ('MQ-d20e5b-60-0', 'd20e5b', 59, '60', '60. The point (3, 0) is invariant under reflection in:', NULL, 'Coordinate Geometry', 'MCQ', 6, NULL, array['The origin', 'x-axis', 'y-axis', 'both x and y axes']::text[]),
  ('MQ-d20e5b-61-0', 'd20e5b', 60, '61', '61. Ms. Anju purchased equipment for ₹4,956 including GST. If the marked or sale price of the equipment is ₹4,200, find the rate of GST.', NULL, 'GST and Banking', 'MCQ', 6, NULL, array['18%', '17%', '8%', '11%']::text[]),
  ('MQ-d20e5b-62-0', 'd20e5b', 61, '62', '62. Maturity Value depends on _________', NULL, 'GST and Banking', 'MCQ', 6, NULL, array['Principal', 'No. of months', 'Interest', 'All of the above']::text[]),
  ('MQ-d20e5b-63-0', 'd20e5b', 62, '63', '63. Solution of the inequation depends upon _________', NULL, 'Linear Inequations', 'MCQ', 6, NULL, array['N', 'I', 'Replacement Set', 'W']::text[]),
  ('MQ-d20e5b-64-0', 'd20e5b', 63, '64', '64. Third proportional to 8 & 12 is _________', NULL, 'Ratio and Proportion', 'MCQ', 6, NULL, array['11', '10', '18', '8']::text[]),
  ('MQ-d20e5b-65-0', 'd20e5b', 64, '65', '65. If two circles touch, the point of contact lies on the straight line through the _________', NULL, 'Circles', 'MCQ', 6, NULL, array['diameter', 'chord', 'radii', 'centres']::text[]),
  ('MQ-d20e5b-66-0', 'd20e5b', 65, '66', '66. The difference between true upper limit & the true lower limit of a grouped frequency distribution is called _________.', NULL, 'Statistics', 'MCQ', 6, NULL, array['class size.', 'class-mark.', 'upper limit.', 'lower limit.']::text[]),
  ('MQ-d20e5b-67-0', 'd20e5b', 66, '67', '67. Each number of a matrix is called', NULL, 'Matrices', 'MCQ', 6, NULL, array['element', 'order', 'index', 'row']::text[]),
  ('MQ-d20e5b-68-0', 'd20e5b', 67, '68', '68. Find the value of a, if (x - a) is a factor of x³ - a²x + x + 2', NULL, 'Factorisation and Remainder Theorem', 'MCQ', 6, NULL, array['2', '-2', '3', '-3']::text[]),
  ('MQ-d20e5b-69-0', 'd20e5b', 68, '69', '69. For given progression 2¹/², 8¹/², 18¹/², 32¹/² the common difference is _________', NULL, 'Arithmetic Progression', 'MCQ', 6, NULL, array['2¹/²', '2n', '8n', '8¹/²']::text[]),
  ('MQ-d20e5b-70-0', 'd20e5b', 69, '70', '70. x = a is a line to the _________ of y-axis, when a is positive.', NULL, 'Coordinate Geometry', 'MCQ', 6, NULL, array['left', 'reflection', 'right', 'origin']::text[]),
  ('MQ-d20e5b-71-0', 'd20e5b', 70, '71', '71. The centroid of a triangle is the point of intersection of its three _________', NULL, 'Coordinate Geometry', 'MCQ', 6, NULL, array['altitudes', 'medians', 'heights', 'coordinates']::text[]),
  ('MQ-d20e5b-72-0', 'd20e5b', 71, '72', '72. If ΔABC ~ ΔAMP, AC = 10, AP = 15, PM = 12, Then BC = _________', NULL, 'Similarity', 'MCQ', 6, NULL, array['8', '9', '28', '12']::text[]),
  ('MQ-d20e5b-73-0', 'd20e5b', 72, '73', '73. Angles in the same segment of a circle are', NULL, 'Circles', 'MCQ', 6, NULL, array['unequal', 'supplementary', 'greater', 'equal']::text[]),
  ('MQ-e833a3-1-0', 'e833a3', 0, '1', '1. If $x$ is the angle of elevation of the top of 30m tall building from a car which is 60m away from the building, then the value of $1 - \tan^2 x$ is', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$\frac{1}{2}$', '$\frac{1}{3}$', '$\frac{3}{4}$', '$\frac{4}{5}$']::text[]),
  ('MQ-e833a3-2-0', 'e833a3', 1, '2', '2. If second term of an AP is $(x - y)$ and 5th term is $(x + y)$, then its first term is', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['$-\frac{1}{3}y$', '$x - \frac{2}{3}y$', '$x - \frac{4}{3}y$', '$x - \frac{5}{3}y$']::text[]),
  ('MQ-e833a3-3-0', 'e833a3', 2, '3', '3. A cone of height 12 cm and slant height 13 cm is surmounted on a hemisphere having radius equal to that of cone. The entire height of the solid is', 1, 'Mensuration', 'MCQ', 1, NULL, array['17cm', '18cm', '22cm', '23cm']::text[]),
  ('MQ-e833a3-4-0', 'e833a3', 3, '4', '4. If $\sin \theta - \cos \theta = \frac{3}{5}$, then $\sin \theta \cos \theta$ is equal to', 1, 'Trigonometry', 'MCQ', 1, NULL, array['$\frac{16}{25}$', '$\frac{9}{16}$', '$\frac{9}{25}$', '$\frac{8}{25}$']::text[]),
  ('MQ-e833a3-5-0', 'e833a3', 4, '5', '5. What is the common difference of an AP in which $a_{21} - a_7 = 84$?', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['84', '42', '21', '6']::text[]),
  ('MQ-e833a3-6-0', 'e833a3', 5, '6', '6. The co-ordinates of one end point of a diameter of a circle are $(4, -1)$ and the coordinates of the centre are $(1, -3)$. Then the coordinates of the other end of the
diameter are', 1, 'Coordinate Geometry', 'MCQ', 1, 'e833a3__Unknown_Sc_p1_img_0_jpeg.webp', array['(-2,5)', '(2,5)', '(-5, -2)', '(-2, -5)']::text[]),
  ('MQ-e833a3-7-0', 'e833a3', 6, '7', '7. Two concentric circles are of radii 13cm and 5 cm. The length of the chord of larger circle which touches the smaller circle is', 1, 'Circles', 'MCQ', 2, NULL, array['12cm', '20cm', '24cm', '30cm']::text[]),
  ('MQ-e833a3-8-0', 'e833a3', 7, '8', '8. The roots of the quadratic equation $$x^2+5x-(\alpha+1)(\alpha+6)=0$$, where $$\alpha$$ is a constant, are', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['$$\alpha+1, \alpha+6$$', '$$(\alpha+1), -(\alpha+6)$$', '$$-(\alpha+1), (\alpha+6)$$', '$$-(\alpha+1), -(\alpha+6)$$']::text[]),
  ('MQ-e833a3-9-0', 'e833a3', 8, '9', '9. Water in a river which is 3m deep and 40m wide is flowing at the rate of 2km/h. How much water will fall into the sea in 2 minutes?', 1, 'Mensuration', 'MCQ', 2, NULL, array['800 m³', '4000 m³', '8000 m³', '2000 m³']::text[]),
  ('MQ-e833a3-10-0', 'e833a3', 9, '10', 'Question number 10 is an Assertion and Reason based question carrying 1 mark. Two statements are given, one labelled Assertion (A) and the other labelled Reason (R). Select the correct answer from the codes (a), (b), (c) and (d) as given below.

(a) Both Assertion (A) and Reason (R) are the true and Reason (R) is a correct explanation of Assertion (A).

(b) Both Assertion (A) and Reason (R) are the true but Reason (R) is not a correct explanation of Assertion (A).

(c) Assertion (A) is true and Reason (R) is false.

(d) Assertion (A) is false and Reason (R) is true.

10. Assertion (A): If roots of the equation $$(2k-1)x^2+4x-3=0$$ are reciprocal of each other, then k=-1.

Reason (R): If a=c, then roots of $$ax^2+bx+c=0$$ are reciprocal of each other.', 1, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-e833a3-11-0', 'e833a3', 10, '11', '11. If $$x \cos 60^\circ + y \cos 0^\circ + \sin 30^\circ - \cot 45^\circ = 5$$, then find the value of $$x+2y$$.', 2, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-e833a3-12-0', 'e833a3', 11, '12', '12. Find the value of k for which roots of the equation $$x^2 - 8kx + 2k = 0$$ are real and equal.', 2, 'Quadratic Equations', 'short', 2, NULL, NULL),
  ('MQ-e833a3-13-0', 'e833a3', 12, '13', '13. The length of shadow of a tower on the plane ground is $$\sqrt{3}$$ times the height of the tower. Find the angle of elevation of the sun.', 2, 'Trigonometry', 'short', 2, NULL, NULL),
  ('MQ-e833a3-14-0', 'e833a3', 13, '14', '14. If $$\frac{x}{a}\cos\theta + \frac{y}{b}\sin\theta = 1$$ and $$\frac{x}{a}\sin\theta - \frac{y}{b}\cos\theta = 1$$, prove that $$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 2$$.', 3, 'Trigonometry', 'short', 3, NULL, NULL),
  ('MQ-e833a3-15-0', 'e833a3', 14, '15', '15. Five ships are positioned in the Indian Ocean. Their positions were plotted on a graph paper in reference to a rectangular coordinate axes. A(-4,-1), B(6,-3), C(6,6), D(2,3), E(1,8) and P(-5,6). An enemy ship is spotted at P.

a) What is the distance between P and E?
b) Find the coordinate of mid-point of BD.
c) We find a rock at new position G such that B, G and C are in a straight line and BG:GC = 3:1 then find the coordinates of G.', 3, 'Coordinate Geometry', 'short', 3, 'e833a3__Unknown_Sc_p3_img_0_jpeg.webp', NULL),
  ('MQ-e833a3-16-0', 'e833a3', 15, '16', '16. A room is in the form of cylinder surmounted by a hemispherical dome. The base radius of hemisphere is half of the height of cylindrical part. If the room contains $$\frac{1408}{21} m^3$$ of air, find the height of the cylindrical part. (Take $$\pi = \frac{22}{7}$$)', 3, 'Mensuration', 'short', 3, NULL, NULL),
  ('MQ-e833a3-17-0', 'e833a3', 16, '17', '17. i) Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.', NULL, 'Circles', 'short', 4, NULL, NULL),
  ('MQ-e833a3-17-1', 'e833a3', 17, '17', 'ii) A triangle ABC is drawn to circumscribe a circle of radius 3 cm such that the segments BD and DC are of lengths 6 cm and 9 cm respectively. If the area of ΔABC=54 cm², find the lengths of the sides AB and AC.', NULL, 'Circles', 'short', 4, 'e833a3__Unknown_Sc_p4_img_0_jpeg.webp', NULL),
  ('MQ-e833a3-18-0', 'e833a3', 18, '18', '18. A manufacturer of TV sets produced 6000 units in the third year and 7000 units in the seventh year. Assuming that the production increases uniformly by fixed number every year, find

(i) the production in the first year,
(ii) the production in the \(5^{\text{th}}\) year,
(iii) the total production in 7 years.', 5, 'Arithmetic Progression', 'long', 4, NULL, NULL),
  ('MQ-e833a3-19-0', 'e833a3', 19, '19', '19. An electrician has to repair an electric fault on a pole of height 8 m. He needs to reach a point 2 m below the top of the pole to undertake the repair work.

Based on the above information, answer the following questions.

i) What should be the length of the ladder, so that it makes an angle of 60° with base?
ii) If the electrician wants to reach 4m below the top of the pole using a ladder which is 4√3 m away from it, then what angle does it make with the base?
iii) The ratio of the height of point B and point A from D is 2:3. If the angles of elevation from point C to point B and point A is 30° and 45° respectively, find the ratio of the corresponding length of ladders.', 5, 'Trigonometry', 'long', 4, 'e833a3__Unknown_Sc_p5_img_0_jpeg.webp', NULL),
  ('MQ-a0a5d3-1-1', 'a0a5d3', 0, '1', 'ii) If the discriminant of the quadratic equation $$ax^2+bx+c$$ is zero, then its roots will be', NULL, 'Quadratic Equations', 'MCQ', 1, NULL, array['$$\frac{-b}{2a}$$', '$$\frac{b}{a}$$', '$$\frac{-a}{2b}$$', '$$\frac{b}{2a}$$']::text[]),
  ('MQ-a0a5d3-1-3', 'a0a5d3', 1, '1', 'iv) The matrix
$$A = \begin{bmatrix} 0 & 0 & 4 \\ 0 & 4 & 0 \\ 4 & 0 & 0 \end{bmatrix}$$
is', NULL, 'Matrices', 'MCQ', 1, NULL, array['Square matrix', 'Diagonal matrix', 'Unit matrix', 'Null matrix']::text[]),
  ('MQ-a0a5d3-1-4', 'a0a5d3', 2, '1', 'iv) If (p-1), (p+3) and (3p -1) are in AP, then p is equal to', NULL, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-2', '-4', '4', '2']::text[]),
  ('MQ-a0a5d3-1-5', 'a0a5d3', 3, '1', 'v) The point (-5,6) on reflection in a line is mapped to (-5,-6). Name the mirror line and write its equation', NULL, 'Coordinate Geometry', 'MCQ', 2, NULL, array['x-axis, y=0', 'y- axis, x=0', 'x -axis, x=0', 'y -axis, y=0']::text[]),
  ('MQ-a0a5d3-1-6', 'a0a5d3', 4, '1', 'vi) In Δ ABC, seg PQ || seg BC and AP = 3, PB = 9, QC = 6 find AQ', NULL, 'Similarity', 'MCQ', 2, NULL, array['2', '3', '6', '4']::text[]),
  ('MQ-a0a5d3-1-7', 'a0a5d3', 5, '1', 'viii) The curved surface area of a right circular cylinder of height 14 cm is 88 cm². Find the diameter of the base of the cylinder.', NULL, 'Mensuration', 'MCQ', 2, NULL, array['0.5', '1.0', '1.5', '2.0']::text[]),
  ('MQ-a0a5d3-1-8', 'a0a5d3', 6, '1', 'ix)The set of values of x satisfying the given inequations is
$$7x + 3 \geq 3x - 5 \text{ and } \frac{x}{4} - 5 \leq \frac{5}{4} - x, x \in \mathbb{N}$$', NULL, 'Linear Inequations', 'MCQ', 2, NULL, array['{-2, -1, 0, 1, 2, 3, 4, 5}', '{1, 2, 3, 4, 5}', '{0, 1, 2, 3, 4}', '{1, 2, 3, 4}']::text[]),
  ('MQ-a0a5d3-1-9', 'a0a5d3', 7, '1', 'x) In a single throw of a dice, probability of getting an odd number less than 8 is', NULL, 'Probability', 'MCQ', 2, NULL, array['0', '$\frac{1}{2}$', '$\frac{2}{3}$', '1']::text[]),
  ('MQ-a0a5d3-1-10', 'a0a5d3', 8, '1', 'xi) The values of x and y for the matrix given are
$$\left[ \begin{array}{r} 2 \\ -3 + 2x \end{array} \right] + \left[ \begin{array}{r} -6 \\ 3 \end{array} \right] = \left[ \begin{array}{r} 2y \\ 6 \end{array} \right]$$', NULL, 'Matrices', 'MCQ', 3, NULL, array['-3, 2', '-2, 3', '3, -2', '3, 2']::text[]),
  ('MQ-a0a5d3-1-11', 'a0a5d3', 9, '1', 'xii) In the adjoining figure, if O is the centre of the circle then the value of ''x'' is :', NULL, 'Circles', 'MCQ', 3, 'a0a5d3__Unknown_X__p3_img_0_jpeg.webp', array['\(18^{\circ}\)', '\(20^{\circ}\)', '\(24^{\circ}\)', '\(36^{\circ}\)']::text[]),
  ('MQ-a0a5d3-1-12', 'a0a5d3', 10, '1', 'xiii) The sum of 12 terms of an AP whose nth term is given by an = 3n +4 is:', NULL, 'Arithmetic Progression', 'MCQ', 3, NULL, array['262', '292', '282', '272']::text[]),
  ('MQ-a0a5d3-1-13', 'a0a5d3', 11, '1', 'xiv) For the following distribution:
| Marks | 0-10 | 10-20 | 20-30 | 30-40 | 40-50 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 3 | 9 | 13 | 10 | 5 |
The number of students who got marks less than 30 is', NULL, 'Statistics', 'MCQ', 3, NULL, array['13', '25', '10', '12']::text[]),
  ('MQ-a0a5d3-1-14', 'a0a5d3', 12, '1', 'xv) Jack wants to find the mode from a given data. To find it he will draw', NULL, 'Statistics', 'MCQ', 3, NULL, array['Frequency Polygon', 'Ogive', 'Histogram', 'Bar Graph']::text[]),
  ('MQ-a0a5d3-2-0', 'a0a5d3', 13, '2', 'i. Saloni deposited ₹ 150 per month and gets ₹ 1236 on maturity under recurring deposit scheme. If the rate of interest is 8% per annum interest calculated at the end of every month. Find the period for which the amount was deposited. [4]', 4, 'GST and Banking', 'long', 3, NULL, NULL),
  ('MQ-a0a5d3-2-1', 'a0a5d3', 14, '2', 'ii. If a, b and c are in continued proportion prove that:

$$\frac{(a+b+c)^2}{a^2+b^2+c^2} = \frac{a+b+c}{a-b+c}$$', NULL, 'Ratio and Proportion', 'short', 4, NULL, NULL),
  ('MQ-a0a5d3-2-2', 'a0a5d3', 15, '2', 'iii. Prove that :

$$\frac{\sin \theta - \cos \theta + 1}{\sin \theta + \cos \theta - 1} = \frac{1}{\sin \theta - \tan \theta}$$', NULL, 'Trigonometry', 'short', 4, NULL, NULL),
  ('MQ-a0a5d3-3-0', 'a0a5d3', 16, '3', 'i. A metal pipe has an inner diameter of 5 cm. The pipe is 5 mm thick all round. Find the weight, in kilogram, of 2 metres of the pipe if 1 cm³ of the metal weights 7.7 g. [4]', 4, 'Mensuration', 'long', 4, NULL, NULL),
  ('MQ-a0a5d3-3-1', 'a0a5d3', 17, '3', 'ii. x and y intercepts of a line AB are both -6. Point P (-4, -2) divides AB. Find:

- a. The ratio in which P divides AB
- b. The equation of line through P which is perpendicular to AB.
- c. The angle made by line AB with x axis. In the direction [4]', 4, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-a0a5d3-3-2', 'a0a5d3', 18, '3', 'iii. Use graph paper for this question. Take 1 cm = 1 unit on both x and y axis.

- a. Plot points A (0, 4), B (3, 7), C (6, 4), D (6, 1) and E (0, -5)
- b. Reflect Points B, C and D in y-axis to B'', C'' and D'' respectively.
- c. Join the points A, B, C, D, E, D'', C'', B'' and A.
- d. Give a geometric name to the figure ABCDED''C''B''. [5]', 5, 'Coordinate Geometry', 'long', 4, NULL, NULL),
  ('MQ-a0a5d3-4-0', 'a0a5d3', 19, '4', 'i. The following bill shows the GST rate and the marked price of the articles.

| BILL: COMPUTERS | | |
| --- | --- | --- |
| Articles | Marked price | Rate of GST |
| Graphic Card | Rs 15500.00 | 18% |
| Laptop adapter | Rs 1900.00 | 28% |

Find the total amount to be paid for the above bill. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-a0a5d3-4-1', 'a0a5d3', 20, '4', 'ii. Solve the quadratic equation x² - 4x + 1 = 0 and write your answer up to 2 decimal places [3]', 3, 'Quadratic Equations', 'short', 4, NULL, NULL),
  ('MQ-a0a5d3-4-2', 'a0a5d3', 21, '4', 'iii. A mathematics aptitude test of 50 students was recorded as follows: [4]

| Marks | 50- 60 | 60-70 | 70-80 | 80-90 | 90-100 |
| --- | --- | --- | --- | --- | --- |
| No. of students | 4 | 8 | 14 | 19 | 5 |

Draw a histogram and estimate mode.', 4, 'Statistics', 'long', 4, NULL, NULL),
  ('MQ-a0a5d3-5-0', 'a0a5d3', 22, '5', 'i Let $$A = \begin{bmatrix} 2 & 4 \\ 3 & 2 \end{bmatrix}, B = \begin{bmatrix} 1 & 3 \\ -2 & 5 \end{bmatrix}, C = \begin{bmatrix} -2 & 5 \\ 3 & 4 \end{bmatrix}$$. Find 3A - CB [3]', 3, 'Matrices', 'short', 5, NULL, NULL),
  ('MQ-a0a5d3-5-1', 'a0a5d3', 23, '5', 'ii. PQRS is a cyclic quadrilateral. Given $$\angle QPS = 73^{\circ}$$, $$\angle PQS = 55^{\circ}$$ and $$\angle PSR = 82^{\circ}$$, calculate $$\angle QRS$$, $$\angle RQS$$ and $$\angle PRQ$$. [3]', 3, 'Circles', 'short', 5, 'a0a5d3__Unknown_X__p5_img_0_jpeg.webp', NULL),
  ('MQ-a0a5d3-5-2', 'a0a5d3', 24, '5', 'iv. Factorise the given polynomial completely:

$$2x^3 + 5x^2 - 28x - 15$$ [4]', 4, 'Factorisation and Remainder Theorem', 'long', 5, NULL, NULL),
  ('MQ-a0a5d3-6-0', 'a0a5d3', 25, '6', 'i. In the figure, AB is the chord of a circle with centre O and DOC is a line segment such that BC = DO. If $$\angle C = 20^{\circ}$$, find angle AOD. [3]', 3, 'Circles', 'short', 5, 'a0a5d3__Unknown_X__p5_img_1_jpeg.webp', NULL),
  ('MQ-a0a5d3-6-1', 'a0a5d3', 26, '6', 'ii. Prove that: $$\sec^6 x - \tan^6 x = 1 + 3\sec^2 x \times \tan^2 x$$

[3]', 3, 'Trigonometry', 'short', 5, NULL, NULL),
  ('MQ-a0a5d3-6-2', 'a0a5d3', 27, '6', 'iii. The first and last term of a A.P. are 17 and 350 respectively. If their common difference is 9. Find the

a. number of terms of the A.P

b. sum of all terms of A.P [4]', 4, 'Arithmetic Progression', 'long', 5, NULL, NULL),
  ('MQ-a0a5d3-7-0', 'a0a5d3', 28, '7', 'i. The probability of selecting a green marble at random from a jar that contains only green, white and yellow marbles is 0.25. The probability of selecting a white marble at random from the same jar is $\frac{1}{3}$. If this jar contains 10 yellow marbles. What is the total number of marbles in the jar?', NULL, 'Probability', 'short', 6, NULL, NULL),
  ('MQ-a0a5d3-7-1', 'a0a5d3', 29, '7', 'ii. The surface area of a solid metallic sphere is 2464 cm$^2$. It is melted and recast into solid right circular cones of radius 3.5 cm and height 7 cm. Calculate:

a. Radius of the sphere.
b. The number of cones recast.', NULL, 'Mensuration', 'short', 6, NULL, NULL),
  ('MQ-a0a5d3-7-2', 'a0a5d3', 30, '7', 'iii. In the given figure O is the centre of the circle, $\angle BAD = 75^{\circ}$ and chord BC = chord CD.

Find: (i) $\angle BOC$ (ii) $\angle OBD$ (iii) $\angle BCD$. (iv) $\angle ABC + \angle ADC$', NULL, 'Circles', 'short', 6, 'a0a5d3__Unknown_X__p6_img_0_jpeg.webp', NULL),
  ('MQ-a0a5d3-8-0', 'a0a5d3', 31, '8', 'i. Solve the following inequation, write the solution set and represent it on the number line

$$-3(x - 7) \geq 15 - 7x > \frac{x+1}{3}, x \in R \tag{3}$$', 3, 'Linear Inequations', 'short', 6, NULL, NULL),
  ('MQ-a0a5d3-8-1', 'a0a5d3', 32, '8', 'ii. Using step deviation method calculate the mean marks of following distribution: (Take assumed mean as 67.5)

[3]

| Class Interval | 50-55 | 55-60 | 60-65 | 65-70 | 70-75 | 75-80 | 80-85 | 85-90 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frequency | 5 | 20 | 10 | 10 | 9 | 6 | 12 | 8 |', 3, 'Statistics', 'short', 6, NULL, NULL),
  ('MQ-a0a5d3-8-2', 'a0a5d3', 33, '8', 'ii. In the figure given below, AB // EF// CD. If AB = 22.5 cm, EP = 7.5 cm, PC = 15 cm and DC = 27 cm. Calculate:

a. EF
b. AC

[4]', 4, 'Similarity', 'long', 6, 'a0a5d3__Unknown_X__p6_img_1_jpeg.webp', NULL),
  ('MQ-a0a5d3-9-0', 'a0a5d3', 34, '9', 'i. If car A travels x km for every litre of petrol, while car B travels (x+5) km for every litre of petrol then,
Find the

a) number of litres of petrol used by car A and B in covering a distance of 400km.
b) If car A used 4 litre of petrol more than car B in covering 400km, determine the number litres of petrol used by car B for the journey. [4]', 4, 'Quadratic Equations', 'long', 7, NULL, NULL),
  ('MQ-a0a5d3-9-1', 'a0a5d3', 35, '9', 'ii. Marks obtained by 200 students in an examination is as given below:

| Marks | Number of students |
| --- | --- |
| 0 - 10 | 5 |
| 10 - 20 | 11 |
| 20 - 30 | 10 |
| 30 - 40 | 20 |
| 40 - 50 | 28 |
| 50 - 60 | 37 |
| 60 - 70 | 40 |
| 70 - 80 | 29 |
| 80 - 90 | 14 |
| 90 - 100 | 6 |

Draw an ogive for the given distribution taking 2 cm = 10 marks on one axis and 2 cm = 20 students on the other axis.

Find: (i) The median marks.

(ii) The number of students who failed, if minimum marks required to pass is 40.
(iii) If scoring 85 and more marks is considered as grade one, find the number of students who secured grade one in the examination. [6]', 6, 'Statistics', 'long', 7, NULL, NULL),
  ('MQ-a0a5d3-10-0', 'a0a5d3', 36, '10', 'i. Solve for x :

$$\frac{\sqrt{36x + 1} + 6\sqrt{x}}{\sqrt{36x + 1} - 6\sqrt{x}} = 9$$ [3]', 3, 'Ratio and Proportion', 'short', 7, NULL, NULL),
  ('MQ-a0a5d3-10-1', 'a0a5d3', 37, '10', 'ii. Draw a circle of diameter 6 cm. From a point P, which is 8 cm away from its centre, draw the two tangents PA and PB to the circle and measure their lengths. [3]', 3, 'Constructions', 'short', 7, NULL, NULL),
  ('MQ-a0a5d3-10-2', 'a0a5d3', 38, '10', 'iii. A 20 m vertical pole and a vertical tower are on the same level ground in such a way that the angle of elevation of top of the tower as seen from foot of the pole is 60° and the angle of elevation of top of the pole as seen from the foot of the tower is 30°. Find:

a. Height of the tower.
b. Horizontal distance between the pole and the tower. [4]', 4, 'Trigonometry', 'long', 7, NULL, NULL),
  ('MQ-74c327-1-0', '74c327', 0, '1', 'i) A man deposited Rs. 600 per month for 9 months and received Rs.5580 as the maturity value. The interest is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs.270', 'Rs. 450', 'Rs. 180', 'Rs.540']::text[]),
  ('MQ-74c327-1-1', '74c327', 1, '1', 'ii) The product of two matrices A and B is possible if

(a) both have same order (b) no. of rows in A = no. of columns in B
(c) no. of columns in A = no. of rows in B (d) both are square matrices.', 1, 'Matrices', 'short', 1, NULL, NULL),
  ('MQ-74c327-1-2', '74c327', 2, '1', 'iii) If $(x - 2)$ is a factor of $2x^3 - x^2 - px - 2$ , then the value of p is', 1, 'Factorisation and Remainder Theorem', 'MCQ', 1, NULL, array['3', '5', '4', '-5']::text[]),
  ('MQ-74c327-1-3', '74c327', 3, '1', 'iv) Which term of the AP: 28, 26, 24, ... is zero?', 1, 'Arithmetic Progression', 'MCQ', 1, NULL, array['13', '14', '15', '16']::text[]),
  ('MQ-74c327-1-4', '74c327', 4, '1', 'v) The price of an article including 5% GST is Rs. 714. The price before tax is', 1, 'GST and Banking', 'MCQ', 1, NULL, array['Rs 672', 'Rs 678', 'Rs 680', 'Rs 750']::text[]),
  ('MQ-74c327-1-6', '74c327', 5, '1', 'vii) If $k - 2, k + 2, 2k + 1$ are in AP, then the value of $k$ is', 1, 'Arithmetic Progression', 'MCQ', 2, NULL, array['-1', '1', '3', '5']::text[]),
  ('MQ-74c327-1-7', '74c327', 6, '1', 'viii) (1) Third term of an AP is 5 and the sixth term is 11. The common difference is
(a) 3
(b) 2
(c) 6
(d) 1
(2) Its first term is', 2, 'Arithmetic Progression', 'MCQ', 2, NULL, array['9', '2', '3', '1']::text[]),
  ('MQ-74c327-1-8', '74c327', 7, '1', 'ix) If $A = \begin{bmatrix} 2 & -2 \\ -2 & 2 \end{bmatrix}$ then $A^2$ is

a $\begin{bmatrix} 4 & 4 \\ 4 & 4 \end{bmatrix}$

b. $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$

c. $\begin{bmatrix} 8 & -8 \\ -8 & 8 \end{bmatrix}$

d. $\begin{bmatrix} 8 & 0 \\ 0 & 8 \end{bmatrix}$', 1, 'Matrices', 'short', 2, NULL, NULL),
  ('MQ-74c327-1-9', '74c327', 8, '1', 'x) A wire which is 60cm long is shaped to form a right triangle with hypotenuse 25 cm.
1) If the base of the triangle is $x$ cm, the height of the triangle is
(a) $(60 - x)\text{cm}$
(b) $(x - 60)\text{cm}$
(c) $(35 - x)\text{cm}$
(d) $(x - 35)\text{cm}$
(2) The quadratic equation formed is
(a) $2x^2 - 70x + 600 = 0$
(b) $2x^2 - 70x - 600 = 0$
(c) $2x^2 - 70x - 1850 = 0$
(d) $2x^2 + 70x - 1850 = 0$
3) The value of $x$ is', 3, 'Quadratic Equations', 'MCQ', 2, NULL, array['30 or 20', '30 or 5', '30 or -65', '15 or 20']::text[]),
  ('MQ-74c327-1-10', '74c327', 9, '1', 'xi) When the roots of a quadratic equation are real and distinct then the discriminant of the quadratic equation is:', 1, 'Quadratic Equations', 'MCQ', 2, NULL, array['Infinite', 'Positive', 'Negative', 'Zero']::text[]),
  ('MQ-74c327-1-11', '74c327', 10, '1', 'ii) The mean proportional between ½ and 128 is', 1, 'Ratio and Proportion', 'MCQ', 3, NULL, array['64', '32', '16', '8']::text[]),
  ('MQ-74c327-2-0', '74c327', 11, '2', '(a) \(P\) is a solution set of \(7x - 2 > 4x + 1\) and \(Q\) is a solution set of \(9x - 45 \geq 5(x - 5)\) where \(x \in R\), then represent \(P \cap Q\). Graph it too. [4]', 4, 'Linear Inequations', 'long', 3, NULL, NULL),
  ('MQ-74c327-2-1', '74c327', 12, '2', '(b) Find the points on the x-axis whose distance from the point A (7,6) and B (-3,4) are in the ratio 1:2. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-74c327-2-2', '74c327', 13, '2', '(c) Polynomial \( x^3 - ax^2 + bx - 6 \) leaves remainder -8 when divided by \( x - 1 \) and \( x - 2 \) is a factor of it, Find the values of a and b. [4]', 4, 'Factorisation and Remainder Theorem', 'long', 3, NULL, NULL),
  ('MQ-74c327-3-0', '74c327', 14, '3', '(a) Find the image of the point (-8, 12) with respect to the mirror line

4x+7y +13 = 0. [4]', 4, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-74c327-3-1', '74c327', 15, '3', '(b) Solve the following equation for \( x \) and give your answer to three significant figures: \( x^2 - 10x + 6 = 0 \) [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-74c327-3-2', '74c327', 16, '3', '(c) Use graph paper for this question. Take \(2\mathrm{cm} = 1\) unit on both axes.

i) Plot A(2,3) and B(4,5) on the graph paper. [5]
ii) Reflect A and B in the x-axis to A'', B''. Write their co-ordinates.
iii) Write the geometrical name of the figure ABB''A''.
iv) What is the area of the figure formed?
v) Write the 2 invariant points under reflection in x-axis.', 5, 'Coordinate Geometry', 'long', 3, NULL, NULL),
  ('MQ-74c327-4-0', '74c327', 17, '4', '(a) Given $$\begin{bmatrix} 1 & -2 \\ 3 & -4 \end{bmatrix}$$. X= $$\begin{bmatrix} -3 \\ -5 \end{bmatrix}$$. [3]

what is the order of matrix X and find the matrix X.', 3, 'Matrices', 'short', 3, NULL, NULL),
  ('MQ-74c327-4-1', '74c327', 18, '4', '(b) Without solving the following quadratic equation find the value of ''p'' for which the given equation has real and equal roots.

$$x^2 + (p - 3)x + p = 0$$. [3]', 3, 'Quadratic Equations', 'short', 3, NULL, NULL),
  ('MQ-74c327-4-2', '74c327', 19, '4', '(c) O Girl! Out of a group of swans, 7/2 times the square root of the number are playing on the shore of a tank. The two remaining ones are playing in the water. What is the total number of swans? [4]', 4, 'Quadratic Equations', 'long', 3, NULL, NULL),
  ('MQ-74c327-5-0', '74c327', 20, '5', '(a) Show that $(x-1)$ is a factor of $x^3 - 7x^2 + 14x - 8$. Hence, completely factorise the above expression. [3]', 3, 'Factorisation and Remainder Theorem', 'short', 4, NULL, NULL),
  ('MQ-74c327-5-1', '74c327', 21, '5', '(b) The sum of the first three terms of an Arithmetic Progression is 42 and the product of the first and the third term is 52. Find the first term, the common difference and the three terms. [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-74c327-5-2', '74c327', 22, '5', '(c) PQRS is a cyclic quadrilateral $PQ = PS$ and $QR = QS$. If $\angle QRS = 70^\circ$, find the angles marked $a$, $x$ and $y$. [4]', 4, 'Circles', 'long', 4, '74c327__Vissanji_X_p4_img_0_jpeg.webp', NULL),
  ('MQ-74c327-6-0', '74c327', 23, '6', '(a) Rani deposits a certain sum of money every month in the recurring deposit scheme for 6 years at 6% p. a. If the amount payable to her at the time of maturity of the account is ₹ 68,112, find the monthly instalment. [3]', 3, 'GST and Banking', 'short', 4, NULL, NULL),
  ('MQ-74c327-6-1', '74c327', 24, '6', '(b) In the adjoining figure OM is the bisector of BC, where O is the origin and the point M is (1,1). [3]

Find:

- i) The slope of OM.
- ii) The co-ordinates of the points B and C.
- iii) The equation of line BC.', 3, 'Coordinate Geometry', 'short', 4, '74c327__Vissanji_X_p4_img_1_jpeg.webp', NULL),
  ('MQ-74c327-6-2', '74c327', 25, '6', '(c) If $X + Y = \begin{bmatrix} -5 & 11 \\ 10 & -4 \end{bmatrix}$ and $X - Y = \begin{bmatrix} 9 & -5 \\ -2 & 14 \end{bmatrix}$, find the matrices X and Y. [4]', 4, 'Matrices', 'long', 4, NULL, NULL),
  ('MQ-74c327-7-0', '74c327', 26, '7', '(a) If $A = \begin{bmatrix} 2 & -1 \\ 3 & 2 \end{bmatrix}$ and $B = \begin{bmatrix} 0 & 4 \\ -1 & 7 \end{bmatrix}$, find $3A^2 - 2B + I$. [3]', 3, 'Matrices', 'short', 4, NULL, NULL),
  ('MQ-74c327-7-1', '74c327', 27, '7', '(b) Which term of an A.P. 3, 10, 17 ...will be 84 more than its 13$^{th}$ term? [3]', 3, 'Arithmetic Progression', 'short', 4, NULL, NULL),
  ('MQ-74c327-7-2', '74c327', 28, '7', '(c) David opened a recurring deposit account in a bank and deposited Rs 300 per month for two years. If he received Rs 7725 at the time of maturity, find the rate of interest per annum. [4]', 4, 'GST and Banking', 'long', 5, NULL, NULL),
  ('MQ-74c327-8-0', '74c327', 29, '8', '(a) The line segment joining A(-1,5/3) and B(a,5) is divided in the ratio 1:3 at P, the point where the line segment AB intersects y-axis. Calculate the value of a and the coordinates of P. [3]', 3, 'Coordinate Geometry', 'short', 5, NULL, NULL),
  ('MQ-74c327-8-1', '74c327', 30, '8', '(b) In the given figure, AB and DE are perpendicular to BC in $\triangle ABC$.

i) Prove that $\triangle ABC \sim \triangle DEC$

ii) If AB = 6 cm, DE = 4 cm and AC = 15 cm. Calculate CD.

[3]', 3, 'Similarity', 'short', 5, '74c327__Vissanji_X_p5_img_0_jpeg.webp', NULL),
  ('MQ-74c327-8-2', '74c327', 31, '8', '(c) Construct a regular hexagon of sides 4cm. [4]
Construct a circle circumscribing the hexagon.', 4, 'Constructions', 'long', 5, NULL, NULL),
  ('MQ-74c327-9-0', '74c327', 32, '9', '(a) In the given figure, PM is a tangent to the circle and PA = AM. [3]

Prove that $\triangle PMB$ is an isos. triangle.

Also Prove that $PA \cdot PB = MB^2$', 3, 'Circles', 'short', 5, '74c327__Vissanji_X_p5_img_1_jpeg.webp', NULL),
  ('MQ-74c327-9-1', '74c327', 33, '9', '(b) Ms. Chawla goes to a shop to buy a leather coat which costs Rs.885, the rate of GST is 18%. She tells the shopkeeper to reduce the price to such an extent that she has to pay Rs. 885, inclusive of GST. Find the reduction needed in the price of the coat. [3]', 3, 'GST and Banking', 'short', 5, NULL, NULL),
  ('MQ-74c327-9-2', '74c327', 34, '9', 'If $(a - 2b - 3c + 4d)(a + 2b + 3c + 4d) = (a + 2b - 3c - 4d)(a - 2b + 3c - 4d)$, show that $2ad = 3bc$. [4]', 4, 'Ratio and Proportion', 'long', 5, NULL, NULL),
  ('MQ-74c327-10-0', '74c327', 35, '10', '(a) Use the properties of proportionality and solve: $$\frac{\sqrt{12x+1}+\sqrt{2x-3}}{\sqrt{12x+1}-\sqrt{2x-3}} = \frac{3}{2}$$ [3]', 3, 'Ratio and Proportion', 'short', 6, NULL, NULL),
  ('MQ-74c327-10-1', '74c327', 36, '10', '(b) Find the equation of the right bisector of the line segment joining the points A(3, -4) and B(5, -6). [3]', 3, 'Coordinate Geometry', 'short', 6, NULL, NULL),
  ('MQ-74c327-10-2', '74c327', 37, '10', '(c) In the adjoining figure ABC is a triangle. [4]

DE is parallel to BC and $$\frac{AD}{DB} = \frac{3}{2}$$

i) Determine the ratio $$\frac{AE}{EC}$$, $$\frac{DE}{BC}$$.

ii) Prove that $$\Delta DEF \sim \Delta CBF$$. Hence, find $$\frac{EF}{FB}$$.', 4, 'Similarity', 'long', 6, '74c327__Vissanji_X_p6_img_0_jpeg.webp', NULL)
on conflict (id) do update set
  paper_id = excluded.paper_id, ord = excluded.ord, number = excluded.number,
  body = excluded.body, marks = excluded.marks, chapter = excluded.chapter,
  qtype = excluded.qtype, page = excluded.page, figure = excluded.figure,
  options = excluded.options;

commit;
