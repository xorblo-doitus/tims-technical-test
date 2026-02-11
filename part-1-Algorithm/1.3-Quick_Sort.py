def quick_sort(to_sort: list) -> list:
	if len(to_sort) <= 1:
		return to_sort
	
	pivot = to_sort[0]
	left = []
	right = []
	
	for element in to_sort[1::]:
		if element <= pivot:
			left.append(element)
		else:
			right.append(element)
	
	left = quick_sort(left)
	right = quick_sort(right)
	
	return left + [pivot] + right


# Drawbacks:
# - The way I implemented it is not in place, but it should be doable in place I think.
# - Not stable: eg. [1, 1] will put the second 1 to the left of the pivot.
#
# Is it relevant to implement in everyday projects?
# No, because most languages have a builtin way to sort lists, which is:
# - More widely tested
# - Usually more efficient:
#   - Because it's written in low-level code. (For instance in C for Python)
#   - Because it's written by many persons which know more than us about sorting
# So, unless we know something about our data structure that makes possible an
# optimization, it's better to stick to the builtin sorting.



if __name__ == "__main__":
	DUMMIES = [
		[],
		[1],
		[1, 2],
		[2, 1],
		[1, 1],
		[1, 2, 3],
		[2, 1, 3],
		[3, 2, 1],
		[1, 3, 2],
		[9, 2, 1, 8, 5, 6, 4, 7, 1],
		[2, 1, 5, 8, 9, 1, 2, 5, 6, 7, 8, 9, 1, 2, 3],
	]
	
	def assert_sorting(dummy: list):
		result = quick_sort(dummy)
		expected = sorted(dummy)
		try:
			assert result == expected
		except AssertionError:
			print("Error:\n")
			print("Result:  ", result)
			print("Expected:", expected)
	
	for dummy in DUMMIES:
		assert_sorting(dummy)